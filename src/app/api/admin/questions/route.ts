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
      mockTestId,
      questionText,
      subject = 'General',
      positiveMarks = 4,
      negativeMarks = 1,
      explanation,
      options, // Array of { label: 'A', text: '...', isCorrect: boolean }
    } = await request.json();

    if (!mockTestId || !questionText || !explanation || !Array.isArray(options) || options.length < 2) {
      return NextResponse.json(
        { error: 'Question text, explanation, and at least 2 options are required.' },
        { status: 400 }
      );
    }

    // Create question and options in transaction
    const question = await prisma.$transaction(async (tx) => {
      const q = await tx.question.create({
        data: {
          mockTestId,
          questionText,
          subject,
          positiveMarks: parseFloat(positiveMarks.toString()),
          negativeMarks: parseFloat(negativeMarks.toString()),
          explanation,
        },
      });

      for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        await tx.option.create({
          data: {
            questionId: q.id,
            optionLabel: opt.label || String.fromCharCode(65 + i),
            optionText: opt.text,
            isCorrect: Boolean(opt.isCorrect),
            orderIndex: i + 1,
          },
        });
      }

      return q;
    });

    return NextResponse.json({ success: true, question });
  } catch (error: any) {
    console.error('Admin question creation error:', error);
    return NextResponse.json({ error: 'Failed to add question' }, { status: 500 });
  }
}
