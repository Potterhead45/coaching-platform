import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to proceed to checkout.' }, { status: 401 });
    }

    const { mockTestId, courseId, gateway = 'RAZORPAY' } = await request.json();

    if (!mockTestId && !courseId) {
      return NextResponse.json({ error: 'Please specify a mock test or course to purchase.' }, { status: 400 });
    }

    let finalAmount = 0;
    let itemTitle = '';
    let itemDescription = '';

    if (mockTestId) {
      const test = await prisma.mockTest.findUnique({
        where: { id: mockTestId },
        select: { id: true, title: true, price: true, description: true, isPublished: true, isFree: true },
      });

      if (!test || !test.isPublished) {
        return NextResponse.json({ error: 'Mock test not found or unavailable' }, { status: 404 });
      }

      if (test.isFree || test.price <= 0) {
        return NextResponse.json({ error: 'This mock test is free and does not require purchase.' }, { status: 400 });
      }

      finalAmount = test.price;
      itemTitle = test.title;
      itemDescription = test.description || `Mock Test: ${test.title}`;
    } else if (courseId) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { id: true, title: true, price: true, description: true },
      });

      if (!course) {
        return NextResponse.json({ error: 'Course not found or unavailable' }, { status: 404 });
      }

      finalAmount = course.price;
      itemTitle = course.title;
      itemDescription = course.description || `Course: ${course.title}`;
    }

    // Create the authentic Razorpay / Gateway order on server
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
        itemDescription,
      },
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      },
    });
  } catch (error: any) {
    console.error('Create payment order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment order' },
      { status: 500 }
    );
  }
}
