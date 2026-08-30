import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hasAccessToTest } from '@/lib/payment';

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'You must be logged in to submit a test.' }, { status: 401 });
    }

    const { mockTestId, answers, timeSpentSeconds } = await request.json();

    if (!mockTestId || !answers || !Array.isArray(answers)) {
      return NextResponse.json({ error: 'Invalid test submission payload' }, { status: 400 });
    }

    // Server-side security check: Confirm user is authorized to take/submit this test
    const isAuthorized = await hasAccessToTest(user.id, mockTestId);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized. You must purchase or enroll in this mock test before submitting.' },
        { status: 403 }
      );
    }

    // Fetch the mock test along with all questions and their correct options
    const mockTest = await prisma.mockTest.findUnique({
      where: { id: mockTestId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!mockTest) {
      return NextResponse.json({ error: 'Mock test not found' }, { status: 404 });
    }

    let totalScore = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const evaluatedAnswers: {
      questionId: string;
      selectedOptionId?: string | null;
      isCorrect: boolean;
      marksAwarded: number;
      timeSpentSeconds: number;
      isMarkedForReview: boolean;
    }[] = [];

    // Map answers by questionId for fast lookup
    const answerMap = new Map<string, { selectedOptionId?: string; timeSpent?: number; isMarked?: boolean }>();
    answers.forEach((ans) => {
      answerMap.set(ans.questionId, {
        selectedOptionId: ans.selectedOptionId,
        timeSpent: ans.timeSpentSeconds || 0,
        isMarked: ans.isMarkedForReview || false,
      });
    });

    // Evaluate each question
    for (const question of mockTest.questions) {
      const studentAns = answerMap.get(question.id);
      const selectedOptionId = studentAns?.selectedOptionId;
      const timeSpent = studentAns?.timeSpent || 0;
      const isMarked = studentAns?.isMarked || false;

      const correctOption = question.options.find((opt) => opt.isCorrect);

      if (!selectedOptionId) {
        // Unattempted
        unattemptedCount++;
        evaluatedAnswers.push({
          questionId: question.id,
          selectedOptionId: null,
          isCorrect: false,
          marksAwarded: 0,
          timeSpentSeconds: timeSpent,
          isMarkedForReview: isMarked,
        });
      } else if (correctOption && selectedOptionId === correctOption.id) {
        // Correct
        correctCount++;
        const marks = question.positiveMarks || mockTest.positiveMarks || 4;
        totalScore += marks;
        evaluatedAnswers.push({
          questionId: question.id,
          selectedOptionId,
          isCorrect: true,
          marksAwarded: marks,
          timeSpentSeconds: timeSpent,
          isMarkedForReview: isMarked,
        });
      } else {
        // Incorrect
        incorrectCount++;
        const negMarks = question.negativeMarks || mockTest.negativeMarks || 1;
        totalScore -= negMarks;
        evaluatedAnswers.push({
          questionId: question.id,
          selectedOptionId,
          isCorrect: false,
          marksAwarded: -negMarks,
          timeSpentSeconds: timeSpent,
          isMarkedForReview: isMarked,
        });
      }
    }

    const attemptedTotal = correctCount + incorrectCount;
    const accuracy = attemptedTotal > 0 ? (correctCount / attemptedTotal) * 100 : 0;

    // Create TestAttempt and StudentAnswer records in Prisma transaction
    const attempt = await prisma.$transaction(async (tx) => {
      const newAttempt = await tx.testAttempt.create({
        data: {
          userId: user.id,
          mockTestId: mockTest.id,
          score: Math.max(totalScore, 0),
          totalMarks: mockTest.totalMarks,
          accuracy: parseFloat(accuracy.toFixed(1)),
          correctCount,
          incorrectCount,
          unattemptedCount,
          timeSpentSeconds: timeSpentSeconds || 0,
          status: 'SUBMITTED',
          submittedAt: new Date(),
        },
      });

      for (const ans of evaluatedAnswers) {
        await tx.studentAnswer.create({
          data: {
            testAttemptId: newAttempt.id,
            questionId: ans.questionId,
            selectedOptionId: ans.selectedOptionId,
            isCorrect: ans.isCorrect,
            marksAwarded: ans.marksAwarded,
            timeSpentSeconds: ans.timeSpentSeconds,
            isMarkedForReview: ans.isMarkedForReview,
          },
        });
      }

      return newAttempt;
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
      mockTestId: mockTest.id,
      score: attempt.score,
      totalMarks: attempt.totalMarks,
      accuracy: attempt.accuracy,
      correctCount: attempt.correctCount,
      incorrectCount: attempt.incorrectCount,
      unattemptedCount: attempt.unattemptedCount,
    });
  } catch (error: any) {
    console.error('Test submission error:', error);
    return NextResponse.json({ error: 'Failed to process test submission' }, { status: 500 });
  }
}
