import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';

export default async function AdminHomePage() {
  const user = await getCurrentUser();

  if (!user || user.role !== 'ADMIN') {
    redirect('/login?redirect=/admin');
  }

  // Aggregate metrics
  const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });
  const totalMockTests = await prisma.mockTest.count();
  const totalTestAttempts = await prisma.testAttempt.count();
  const payments = await prisma.payment.findMany({ where: { status: 'COMPLETED' } });
  const totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);

  // Recent test attempts
  const recentAttempts = await prisma.testAttempt.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      mockTest: { select: { title: true, totalMarks: true } },
    },
  });

  // Recent payments
  const recentPayments = await prisma.payment.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true, email: true } },
      mockTest: { select: { title: true } },
      course: { select: { title: true } },
    },
  });

  // Test statistics
  const testStats = await prisma.mockTest.findMany({
    select: {
      id: true,
      title: true,
      category: true,
      durationMinutes: true,
      price: true,
      isFree: true,
      _count: {
        select: { attempts: true, questions: true },
      },
    },
    take: 5,
    orderBy: { attempts: { _count: 'desc' } },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <AdminDashboardOverview
        stats={{
          totalStudents,
          totalMockTests,
          totalTestAttempts,
          totalRevenue,
        }}
        recentAttempts={recentAttempts}
        recentPayments={recentPayments}
        testStats={testStats}
        adminUser={user}
      />
    </div>
  );
}
