export const dynamic = 'force-dynamic';
import React from 'react';
import { notFound } from 'next/navigation';
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

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <TestResultView attempt={attempt} user={user} />
    </div>
  );
}
