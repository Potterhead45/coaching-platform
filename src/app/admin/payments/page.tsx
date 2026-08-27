export const dynamic = 'force-dynamic';
import React from 'react';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import AdminNav from '@/components/admin/AdminNav';
import AdminPaymentsView from '@/components/admin/AdminPaymentsView';

export default async function AdminPaymentsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/login?redirect=/admin/payments');
  }

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
      mockTest: { select: { id: true, title: true } },
      course: { select: { id: true, title: true } },
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <AdminNav />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Payment Details & Revenue Ledger
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Audit all test enrollments, gateway transactions, and customer tax invoices.
            </p>
          </div>
        </div>

        <AdminPaymentsView initialPayments={payments} />
      </div>
    </div>
  );
}
