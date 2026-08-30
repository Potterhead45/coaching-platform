import crypto from 'crypto';
import prisma from './prisma';
import { generateInvoiceNumber, generateOrderId } from './utils';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || '';
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || '';
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export interface CreateOrderParams {
  amount: number; // in INR rupees
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number; // in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  created_at: number;
}

/**
 * Creates an order with Razorpay API (or generates a fallback simulation order if keys are not configured).
 */
export async function createRazorpayOrder({
  amount,
  currency = 'INR',
  receipt,
  notes = {},
}: CreateOrderParams): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  isSandbox: boolean;
  keyId: string;
}> {
  const receiptId = receipt || generateOrderId();
  const amountInPaise = Math.round(amount * 100);

  // If Razorpay keys are configured, create real order via Razorpay REST API
  if (RAZORPAY_KEY_ID && RAZORPAY_KEY_SECRET) {
    try {
      const authHeader = `Basic ${Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64')}`;

      const response = await fetch('https://api.razorpay.com/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader,
        },
        body: JSON.stringify({
          amount: amountInPaise,
          currency,
          receipt: receiptId,
          notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Razorpay order creation failed:', errorData);
        throw new Error(errorData.error?.description || 'Failed to create payment order on Razorpay');
      }

      const orderData: RazorpayOrderResponse = await response.json();
      return {
        orderId: orderData.id,
        amount,
        currency: orderData.currency,
        isSandbox: false,
        keyId: RAZORPAY_KEY_ID,
      };
    } catch (err: any) {
      console.error('Error in createRazorpayOrder:', err);
      throw err;
    }
  }

  // Graceful fallback for local development if keys are not configured yet
  return {
    orderId: `order_dev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    amount,
    currency,
    isSandbox: true,
    keyId: 'rzp_test_sandbox_mode',
  };
}

/**
 * Verifies Razorpay payment signature using HMAC SHA-256.
 */
export function verifyRazorpaySignature({
  orderId,
  paymentId,
  signature,
}: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  if (!RAZORPAY_KEY_SECRET) {
    // If running in development sandbox mode without secret
    if (orderId.startsWith('order_dev_') || paymentId.startsWith('pay_dev_') || paymentId.startsWith('SIM_TXN_')) {
      return true;
    }
    return false;
  }

  try {
    const generatedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(generatedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}

/**
 * Verifies Razorpay Webhook signature using HMAC SHA-256.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string = RAZORPAY_WEBHOOK_SECRET
): boolean {
  if (!secret || !signature) return false;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'utf-8'),
      Buffer.from(signature, 'utf-8')
    );
  } catch (error) {
    return false;
  }
}

/**
 * Idempotently records a verified payment and unlocks access for the student.
 */
export async function recordSuccessfulPayment({
  userId,
  mockTestId,
  courseId,
  amount,
  currency = 'INR',
  gateway = 'RAZORPAY',
  orderId,
  paymentId,
}: {
  userId: string;
  mockTestId?: string | null;
  courseId?: string | null;
  amount: number;
  currency?: string;
  gateway?: string;
  orderId: string;
  paymentId: string;
}) {
  // Check if payment with this orderId or paymentId already exists (idempotency)
  const existingPayment = await prisma.payment.findFirst({
    where: {
      OR: [
        { orderId },
        { paymentId },
      ],
    },
  });

  if (existingPayment) {
    // Already processed, ensure course enrollment if needed
    if (courseId) {
      await prisma.courseEnrollment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {},
        create: {
          userId,
          courseId,
        },
      });
    }
    return existingPayment;
  }

  const invoiceNumber = generateInvoiceNumber();

  // Create payment record in database
  const payment = await prisma.payment.create({
    data: {
      orderId,
      userId,
      mockTestId: mockTestId || null,
      courseId: courseId || null,
      amount,
      currency,
      gateway,
      paymentId,
      status: 'COMPLETED',
      invoiceNumber,
    },
  });

  // If course purchased, enroll user
  if (courseId) {
    await prisma.courseEnrollment.upsert({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      update: {},
      create: {
        userId,
        courseId,
      },
    });
  }

  return payment;
}

/**
 * Legacy compatibility alias
 */
export const processPaymentSuccess = recordSuccessfulPayment;

/**
 * Checks whether a user has access to a specific mock test.
 */
export async function hasAccessToTest(userId: string, mockTestId: string): Promise<boolean> {
  const test = await prisma.mockTest.findUnique({
    where: { id: mockTestId },
    select: { isFree: true, price: true, courseId: true },
  });

  if (!test) return false;
  if (test.isFree || test.price <= 0) return true;

  // Check if student purchased the test directly
  const directPurchase = await prisma.payment.findFirst({
    where: {
      userId,
      mockTestId,
      status: 'COMPLETED',
    },
  });

  if (directPurchase) return true;

  // Check if student is enrolled in the parent course
  if (test.courseId) {
    const courseEnrollment = await prisma.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: test.courseId,
        },
      },
    });
    if (courseEnrollment) return true;
  }

  return false;
}

