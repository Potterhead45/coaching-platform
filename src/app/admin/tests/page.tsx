import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import AdminTestsView from '@/components/admin/AdminTestsView';

export default async function AdminTestsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/tests');
  }

  const mockTests = await prisma.mockTest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      course: { select: { id: true, title: true } },
      chapter: { select: { id: true, title: true } },
      questions: {
        orderBy: { orderIndex: 'asc' },
        include: {
          options: true,
        },
      },
      _count: {
        select: { attempts: true, questions: true },
      },
    },
  });

  const courses = await prisma.course.findMany({
    select: { id: true, title: true, chapters: { select: { id: true, title: true } } },
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Test Details & Test Count Analytics
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Create mock tests, build question banks with detailed explanations, and review student participation counts.
            </p>
          </div>
        </div>

        <AdminTestsView initialTests={mockTests} courses={courses} />
      </div>
    </div>
  );
}
