import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { name, email, phone, courseInterest, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    const inquiry = await prisma.inquiry.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        phone: phone ? phone.trim() : null,
        courseInterest: courseInterest || 'General Inquiry',
        message: message.trim(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry submitted successfully! Our counselor will reach out within 24 hours.',
      inquiryId: inquiry.id,
    });
  } catch (error: any) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
