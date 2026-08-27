import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  Flame, 
  Clock, 
  HelpCircle, 
  Award, 
  Sparkles, 
  Filter, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck 
} from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import TestCatalogView from '@/components/TestCatalogView';

export default async function TestsPage() {
  const user = await getCurrentUser();

  const mockTests = await prisma.mockTest.findMany({
    where: { isPublished: true },
    include: {
      course: { select: { title: true, targetExam: true } },
      chapter: { select: { title: true } },
      _count: {
        select: { questions: true, attempts: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Get student's enrolled/purchased tests if logged in
  let purchasedTestIds: string[] = [];
  if (user) {
    const payments = await prisma.payment.findMany({
      where: { userId: user.id, status: 'COMPLETED' },
      select: { mockTestId: true },
    });
    purchasedTestIds = payments.map((p) => p.mockTestId).filter(Boolean) as string[];
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-8">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Exam Benchmark Series
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              All-India Mock Tests & Diagnostics
            </h1>
            <p className="text-slate-600 text-sm">
              Real-time CBT simulator with timer, question palette, instant ranking, and step-by-step solutions for incorrect answers.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Marking Scheme: <strong>+4 for Correct, -1 for Wrong</strong></span>
          </div>
        </div>

        {/* Filterable Catalog Component */}
        <TestCatalogView
          initialTests={mockTests}
          purchasedTestIds={purchasedTestIds}
          user={user}
        />
      </div>
    </div>
  );
}
