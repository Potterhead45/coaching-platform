import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createRazorpayOrder, recordSuccessfulPayment } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to proceed to checkout.' }, { status: 401 });
    }

    const { mockTestId, courseId, gateway = 'RAZORPAY', orderId, paymentId, signature } = await request.json();

    if (!mockTestId && !courseId) {
      return NextResponse.json({ error: 'Please specify a mock test or course to purchase.' }, { status: 400 });
    }

    // If orderId and paymentId were provided (verification step)
    if (orderId && paymentId) {
      let finalAmount = 0;
      if (mockTestId) {
        const test = await prisma.mockTest.findUnique({ where: { id: mockTestId } });
        if (!test) return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
        finalAmount = test.price;
      } else if (courseId) {
        const course = await prisma.course.findUnique({ where: { id: courseId } });
        if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
        finalAmount = course.price;
      }

      const payment = await recordSuccessfulPayment({
        userId: user.id,
        mockTestId,
        courseId,
        amount: finalAmount,
        currency: 'INR',
        gateway: gateway || 'RAZORPAY',
        orderId,
        paymentId,
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
    }

    // Otherwise, create an order
    let finalAmount = 0;
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

    const orderData = await createRazorpayOrder({
      amount: finalAmount,
      currency: 'INR',
      notes: {
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        mockTestId: mockTestId || '',
        courseId: courseId || '',
        itemTitle,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        id: orderData.orderId,
        amount: orderData.amount,
        currency: orderData.currency,
        keyId: orderData.keyId,
        isSandbox: orderData.isSandbox,
        itemTitle,
      },
    });
  } catch (error: any) {
    console.error('Payment creation error:', error);
    return NextResponse.json({ error: error.message || 'Payment processing encountered an error' }, { status: 500 });
  }
}
