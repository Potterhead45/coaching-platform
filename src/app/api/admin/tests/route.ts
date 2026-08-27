import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const {
      title,
      description,
      courseId,
      chapterId,
      category = 'Full Mock',
      durationMinutes = 60,
      totalMarks = 100,
      positiveMarks = 4,
      negativeMarks = 1,
      passingMarks = 40,
      isFree = false,
      price = 0,
    } = await request.json();

    if (!title || !description) {
      return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;

    const mockTest = await prisma.mockTest.create({
      data: {
        title,
        slug,
        description,
        courseId: courseId || null,
        chapterId: chapterId || null,
        category,
        durationMinutes: parseInt(durationMinutes.toString(), 10),
        totalMarks: parseFloat(totalMarks.toString()),
        positiveMarks: parseFloat(positiveMarks.toString()),
        negativeMarks: parseFloat(negativeMarks.toString()),
        passingMarks: parseFloat(passingMarks.toString()),
        isPublished: true,
        isFree: Boolean(isFree),
        price: Boolean(isFree) ? 0 : parseFloat(price.toString()),
      },
    });

    return NextResponse.json({ success: true, mockTest });
  } catch (error: any) {
    console.error('Admin test creation error:', error);
    return NextResponse.json({ error: 'Failed to create mock test' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Test ID is required' }, { status: 400 });
    }

    await prisma.mockTest.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Test deleted successfully' });
  } catch (error: any) {
    console.error('Admin test deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
