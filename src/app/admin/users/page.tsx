export const dynamic = 'force-dynamic';
import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import AdminUsersView from '@/components/admin/AdminUsersView';

export default async function AdminUsersPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/users');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      attempts: {
        include: {
          mockTest: { select: { title: true, totalMarks: true } },
        },
        orderBy: { createdAt: 'desc' },
      },
      payments: {
        where: { status: 'COMPLETED' },
        select: { amount: true },
      },
      enrollments: {
        include: {
          course: { select: { title: true } },
        },
      },
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              User Details & Student Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Inspect student profiles, mock test attempts, scores, and account privileges.
            </p>
          </div>
        </div>

        <AdminUsersView initialUsers={users} />
      </div>
    </div>
  );
}
