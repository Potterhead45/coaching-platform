import prisma from './prisma';
import { generateInvoiceNumber, generateOrderId } from './utils';

export interface CheckoutParams {
  userId: string;
  mockTestId?: string;
  courseId?: string;
  gateway?: 'SANDBOX' | 'RAZORPAY' | 'STRIPE';
}

export async function processPaymentSuccess({
  userId,
  mockTestId,
  courseId,
  amount,
  currency = 'INR',
  gateway = 'SANDBOX',
  paymentId,
}: {
  userId: string;
  mockTestId?: string;
  courseId?: string;
  amount: number;
  currency?: string;
  gateway?: string;
  paymentId?: string;
}) {
  const orderId = generateOrderId();
  const invoiceNumber = generateInvoiceNumber();

  // Create payment record
  const payment = await prisma.payment.create({
    data: {
      orderId,
      userId,
      mockTestId,
      courseId,
      amount,
      currency,
      gateway: gateway || 'SANDBOX',
      paymentId: paymentId || `SIM_TXN_${Date.now()}`,
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
