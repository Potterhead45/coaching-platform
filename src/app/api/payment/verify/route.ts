import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { verifyRazorpaySignature, recordSuccessfulPayment } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const {
      orderId,
      paymentId,
      signature,
      mockTestId,
      courseId,
    } = await request.json();

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required payment verification parameters (orderId, paymentId)' },
        { status: 400 }
      );
    }

    // 1. Verify payment signature on the backend
    const isSignatureValid = verifyRazorpaySignature({
      orderId,
      paymentId,
      signature: signature || '',
    });

    if (!isSignatureValid) {
      console.warn(`Payment signature mismatch for user ${user.id}, order ${orderId}, payment ${paymentId}`);
      return NextResponse.json(
        { error: 'Payment signature verification failed. The transaction could not be validated.' },
        { status: 400 }
      );
    }

    // 2. Fetch authoritative price from DB to record accurately
    let amount = 0;
    if (mockTestId) {
      const test = await prisma.mockTest.findUnique({
        where: { id: mockTestId },
        select: { id: true, price: true, title: true },
      });
      if (!test) {
        return NextResponse.json({ error: 'Referenced mock test does not exist' }, { status: 404 });
      }
      amount = test.price;
    } else if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, price: true, title: true },
      });
      if (!course) {
        return NextResponse.json({ error: 'Referenced course does not exist' }, { status: 404 });
      }
      amount = course.price;
    }

    // 3. Record verified payment in the database idempotently
    const payment = await recordSuccessfulPayment({
      userId: user.id,
      mockTestId,
      courseId,
      amount,
      currency: 'INR',
      gateway: orderId.startsWith('order_dev_') ? 'SANDBOX' : 'RAZORPAY',
      orderId,
      paymentId,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified and access unlocked successfully.',
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        invoiceNumber: payment.invoiceNumber,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error: any) {
    console.error('Payment verification API error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error occurred during payment verification' },
      { status: 500 }
    );
  }
}
