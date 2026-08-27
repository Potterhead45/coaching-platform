import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { processPaymentSuccess } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to proceed to checkout.' }, { status: 401 });
    }

    const { mockTestId, courseId, gateway = 'SANDBOX', amount } = await request.json();

    if (!mockTestId && !courseId) {
      return NextResponse.json({ error: 'Please specify a mock test or course to purchase.' }, { status: 400 });
    }

    let finalAmount = amount || 0;
    let itemTitle = '';

    if (mockTestId) {
      const test = await prisma.mockTest.findUnique({ where: { id: mockTestId } });
      if (!test) return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
      finalAmount = test.price;
      itemTitle = test.title;
    } else if (courseId) {
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      finalAmount = course.price;
      itemTitle = course.title;
    }

    // Process instant sandbox payment or create gateway order
    const payment = await processPaymentSuccess({
      userId: user.id,
      mockTestId,
      courseId,
      amount: finalAmount,
      currency: 'INR',
      gateway: gateway || 'SANDBOX',
      paymentId: `TXN_${gateway.toUpperCase()}_${Date.now()}`,
    });

    return NextResponse.json({
      success: true,
      message: 'Payment processed successfully',
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        invoiceNumber: payment.invoiceNumber,
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
      },
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: 'Payment processing encountered an error' }, { status: 500 });
  }
}
