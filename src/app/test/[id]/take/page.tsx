import React from 'react';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hasAccessToTest } from '@/lib/payment';
import CbtTestEngine from '@/components/CbtTestEngine';
import Link from 'next/link';
import { Lock, ArrowLeft } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function TakeTestPage({ params }: PageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirect=/test/${params.id}/take`);
  }

  const mockTest = await prisma.mockTest.findUnique({
    where: { id: params.id },
    include: {
      course: { select: { title: true, targetExam: true } },
      chapter: { select: { title: true } },
      questions: {
        orderBy: { orderIndex: 'asc' },
        include: {
          options: {
            orderBy: { orderIndex: 'asc' },
            select: {
              id: true,
              questionId: true,
              optionLabel: true,
              optionText: true,
              // We omit isCorrect here so students cannot inspect client source code to cheat
            },
          },
        },
      },
    },
  });

  if (!mockTest || !mockTest.isPublished) {
    notFound();
  }

  // Verify access
  const hasAccess = await hasAccessToTest(user.id, mockTest.id);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-2xl flex items-center justify-center mx-auto border border-amber-500/30">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-amber-400">Enrollment Required</span>
            <h2 className="text-2xl font-bold text-white mt-1">{mockTest.title}</h2>
            <p className="text-slate-400 text-xs mt-2">
              This premium mock test series requires enrollment. Complete payment to access the CBT exam interface and detailed solutions.
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700/60 text-sm flex justify-between items-center">
            <span className="text-slate-400">Test Fee:</span>
            <span className="text-xl font-extrabold text-white">{formatCurrency(mockTest.price)}</span>
          </div>

          <div className="space-y-3">
            <Link
              href="/tests"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-brand-600 hover:bg-brand-500 text-white transition-all shadow-lg"
            >
              Go to Test Catalog & Unlock
            </Link>
            <Link
              href="/dashboard"
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 text-xs font-semibold text-slate-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CbtTestEngine mockTest={mockTest} user={user} />;
}
