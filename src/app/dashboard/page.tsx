import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import StudentDashboardView from '@/components/StudentDashboardView';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirect=/dashboard');
  }

  // Fetch all attempts by this student
  const attempts = await prisma.testAttempt.findMany({
    where: { userId: user.id },
    include: {
      mockTest: {
        include: {
          course: { select: { title: true, targetExam: true } },
          chapter: { select: { title: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch enrolled courses
  const enrollments = await prisma.courseEnrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          chapters: true,
          mockTests: {
            where: { isPublished: true },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Fetch payment records
  const payments = await prisma.payment.findMany({
    where: { userId: user.id },
    include: {
      mockTest: { select: { title: true } },
      course: { select: { title: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // Available mock tests for quick start
  const availableTests = await prisma.mockTest.findMany({
    where: { isPublished: true },
    include: {
      course: { select: { title: true, targetExam: true } },
      _count: { select: { questions: true } },
    },
    take: 4,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <StudentDashboardView
        user={user}
        attempts={attempts}
        enrollments={enrollments}
        payments={payments}
        availableTests={availableTests}
      />
    </div>
  );
}
