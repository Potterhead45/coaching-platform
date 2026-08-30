export const dynamic = 'force-dynamic';
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import TestResultView from '@/components/TestResultView';

interface ResultPageProps {
  params: {
    id: string;
    attemptId: string;
  };
}

export default async function TestResultPage({ params }: ResultPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/test/${params.id}/result/${params.attemptId}`);
  }

  const attempt = await prisma.testAttempt.findUnique({
    where: { id: params.attemptId },
    include: {
      mockTest: {
        include: {
          course: { select: { title: true, targetExam: true } },
          chapter: { select: { title: true } },
        },
      },
      answers: {
        include: {
          question: {
            include: {
              options: {
                orderBy: { orderIndex: 'asc' },
              },
            },
          },
        },
      },
    },
  });

  if (!attempt) {
    notFound();
  }

  // Security check: Only the candidate or an admin can access attempt solutions
  if (attempt.userId !== user.id && user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 border border-slate-200 text-center shadow-md">
          <h2 className="text-lg font-bold text-slate-900">Access Denied</h2>
          <p className="text-xs text-slate-500 mt-2">
            You do not have permission to view this test attempt scorecard.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <TestResultView attempt={attempt} user={user} />
    </div>
  );
}
