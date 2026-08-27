'use client';

import React, { useState } from 'react';
import { 
  Search, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  Receipt,
  Download,
  Filter
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AdminPaymentsViewProps {
  initialPayments: any[];
}

export default function AdminPaymentsView({ initialPayments }: AdminPaymentsViewProps) {
  const [payments, setPayments] = useState<any[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gatewayFilter, setGatewayFilter] = useState('ALL');

  const filteredPayments = payments.filter((pay) => {
    const matchesSearch =
      pay.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.user?.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pay.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (pay.mockTest?.title && pay.mockTest.title.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || pay.status === statusFilter;
    const matchesGateway = gatewayFilter === 'ALL' || pay.gateway === gatewayFilter;

    return matchesSearch && matchesStatus && matchesGateway;
  });

  const totalRevenue = payments
    .filter((p) => p.status === 'COMPLETED')
    .reduce((acc, p) => acc + p.amount, 0);

  const completedCount = payments.filter((p) => p.status === 'COMPLETED').length;
  const avgOrderValue = completedCount > 0 ? (totalRevenue / completedCount).toFixed(0) : '0';

  return (
    <div className="space-y-6">
      {/* 3 Main Revenue Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</h3>
            <p className="text-xs font-semibold text-slate-500">Total Net Collections</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-emerald-700">{completedCount}</h3>
            <p className="text-xs font-semibold text-slate-500">Successful Purchases</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">{formatCurrency(Number(avgOrderValue))}</h3>
            <p className="text-xs font-semibold text-slate-500">Average Transaction Size</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by student, invoice #, or test name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
          </select>

          <select
            value={gatewayFilter}
            onChange={(e) => setGatewayFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Gateways</option>
            <option value="SANDBOX">Sandbox Demo</option>
            <option value="RAZORPAY">Razorpay</option>
            <option value="STRIPE">Stripe</option>
          </select>
        </div>
      </div>

      {/* Payments Ledger Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Invoice & Order ID</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Item Enrolled</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Gateway & Txn Ref</th>
                <th className="p-4">Status</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No payment records matching your filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((pay) => (
                  <tr key={pay.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-mono font-bold text-slate-900">{pay.invoiceNumber}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{pay.orderId}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900">{pay.user?.name || 'Student'}</p>
                        <p className="text-[11px] text-slate-500">{pay.user?.email}</p>
                      </div>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {pay.mockTest?.title || pay.course?.title || 'Mock Test Series'}
                    </td>

                    <td className="p-4">
                      <span className="font-black text-slate-900 text-sm">{formatCurrency(pay.amount)}</span>
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {pay.gateway}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                        {pay.paymentId || 'N/A'}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pay.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : pay.status === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {pay.status}
                      </span>
                    </td>

                    <td className="p-4 text-slate-500 whitespace-nowrap">
                      {new Date(pay.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
