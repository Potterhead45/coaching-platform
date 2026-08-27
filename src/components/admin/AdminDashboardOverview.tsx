'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Users, 
  FileQuestion, 
  CreditCard, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  Plus, 
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import AdminNav from './AdminNav';

interface AdminDashboardOverviewProps {
  stats: {
    totalStudents: number;
    totalMockTests: number;
    totalTestAttempts: number;
    totalRevenue: number;
  };
  recentAttempts: any[];
  recentPayments: any[];
  testStats: any[];
  adminUser: any;
}

export default function AdminDashboardOverview({
  stats,
  recentAttempts,
  recentPayments,
  testStats,
  adminUser,
}: AdminDashboardOverviewProps) {
  return (
    <div className="space-y-8">
      <AdminNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Coaching Centre Analytics & Admin Dashboard
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Logged in as <strong className="text-slate-800">{adminUser.name}</strong> • Real-time database metrics
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/tests"
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Create New Mock Test
            </Link>
          </div>
        </div>

        {/* 4 Main Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* User Details */}
          <Link
            href="/admin/users"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">User Details</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{stats.totalStudents}</h3>
            <p className="text-xs text-blue-600 font-semibold flex items-center gap-1">
              <span>View All Students</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>

          {/* Test Count Details */}
          <Link
            href="/admin/tests"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Test Details</span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileQuestion className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{stats.totalMockTests}</h3>
            <p className="text-xs text-purple-600 font-semibold flex items-center gap-1">
              <span>Manage Test Series</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>

          {/* Test Attempts Count */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Submissions</span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-emerald-700">{stats.totalTestAttempts}</h3>
            <p className="text-xs text-slate-500 font-medium">Tests Evaluated</p>
          </div>

          {/* Payment Details */}
          <Link
            href="/admin/payments"
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Details</span>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-black text-slate-900">{formatCurrency(stats.totalRevenue)}</h3>
            <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
              <span>View Payment Ledger</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </p>
          </Link>
        </div>

        {/* 2-Column Section: Recent Test Submissions & Recent Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Test Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Student Submissions</h3>
                <p className="text-xs text-slate-500">Live feed of student mock test attempts</p>
              </div>
              <Link href="/admin/users" className="text-xs font-bold text-brand-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {recentAttempts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No test attempts yet.</div>
              ) : (
                recentAttempts.map((att) => (
                  <div key={att.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">{att.user.name}</p>
                      <p className="text-slate-500 truncate max-w-xs">{att.mockTest.title}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded font-black bg-emerald-100 text-emerald-800">
                        {att.score} / {att.mockTest.totalMarks} Marks
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{att.accuracy}% Accuracy</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Payments Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Recent Payment Transactions</h3>
                <p className="text-xs text-slate-500">Income received from paid mock tests & courses</p>
              </div>
              <Link href="/admin/payments" className="text-xs font-bold text-brand-600 hover:underline">
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {recentPayments.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">No payments recorded yet.</div>
              ) : (
                recentPayments.map((pay) => (
                  <div key={pay.id} className="p-4 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900">{pay.user.name}</p>
                      <p className="text-slate-500 truncate max-w-xs">
                        {pay.mockTest?.title || pay.course?.title || 'Mock Test Series'}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-slate-900">{formatCurrency(pay.amount)}</span>
                      <p className="text-[10px] uppercase font-bold text-emerald-600 mt-0.5">{pay.status}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Mock Test Performance & Counts Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Top Mock Tests by Student Participation</h3>
              <p className="text-xs text-slate-500">Test counts and total attempts registered</p>
            </div>
            <Link href="/admin/tests" className="text-xs font-bold text-brand-600 hover:underline">
              Manage All Tests →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {testStats.map((t) => (
              <div key={t.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-100 text-brand-700">
                  {t.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{t.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
                  <span>Attempts: <strong className="text-slate-900">{t._count.attempts}</strong></span>
                  <span>Questions: <strong className="text-slate-900">{t._count.questions}</strong></span>
                  <span className="font-bold text-emerald-700">{t.isFree ? 'FREE' : formatCurrency(t.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
