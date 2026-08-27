'use client';

import React, { useState } from 'react';
import { 
  Search, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Lock, 
  Unlock, 
  Loader2, 
  AlertCircle, 
  X,
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface AdminUsersViewProps {
  initialUsers: any[];
}

export default function AdminUsersView({ initialUsers }: AdminUsersViewProps) {
  const [users, setUsers] = useState<any[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleStatus = async (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    setUpdatingId(user.id);

    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user status');

      setUsers((prev) =>
        prev.map((item) => (item.id === user.id ? { ...item, status: newStatus } : item))
      );
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search student by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs bg-slate-50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Roles</option>
            <option value="STUDENT">Students</option>
            <option value="ADMIN">Admins</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-slate-50 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">User Details</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Tests Taken</th>
                <th className="p-4">Avg Accuracy</th>
                <th className="p-4">Total Spent</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const testsCount = u.attempts?.length || 0;
                  const totalSpent = (u.payments || []).reduce(
                    (acc: number, p: any) => acc + p.amount,
                    0
                  );
                  const avgAccuracy =
                    testsCount > 0
                      ? (
                          u.attempts.reduce((acc: number, a: any) => acc + a.accuracy, 0) /
                          testsCount
                        ).toFixed(1)
                      : '0.0';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                          <p className="text-[11px] text-slate-500">{u.email}</p>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600 font-mono">
                        {u.phone || '—'}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                            u.role === 'ADMIN'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>

                      <td className="p-4 font-bold text-slate-900">{testsCount}</td>

                      <td className="p-4 font-semibold text-emerald-700">{avgAccuracy}%</td>

                      <td className="p-4 font-bold text-slate-900">{formatCurrency(totalSpent)}</td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedUser(u)}
                            className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                            title="View Student Progress & Attempt Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(u)}
                            disabled={updatingId === u.id || u.role === 'ADMIN'}
                            className={`p-1.5 rounded-lg transition-colors ${
                              u.status === 'ACTIVE'
                                ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                : 'text-emerald-600 hover:bg-emerald-50'
                            } disabled:opacity-30`}
                            title={u.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                          >
                            {updatingId === u.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : u.status === 'ACTIVE' ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <Unlock className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Student Detailed Record
                </span>
                <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                <p className="text-xs text-slate-400">{selectedUser.email} • {selectedUser.phone || 'No phone'}</p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Profile Overview */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-lg font-black text-slate-900">{selectedUser.attempts?.length || 0}</span>
                  <span className="block text-[11px] text-slate-500 font-semibold">Tests Taken</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-lg font-black text-emerald-700">
                    {selectedUser.attempts?.length > 0
                      ? (
                          selectedUser.attempts.reduce((a: any, b: any) => a + b.accuracy, 0) /
                          selectedUser.attempts.length
                        ).toFixed(1)
                      : '0'}%
                  </span>
                  <span className="block text-[11px] text-slate-500 font-semibold">Avg Accuracy</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-lg font-black text-slate-900">
                    {formatCurrency(
                      (selectedUser.payments || []).reduce((a: any, b: any) => a + b.amount, 0)
                    )}
                  </span>
                  <span className="block text-[11px] text-slate-500 font-semibold">Total Revenue</span>
                </div>
              </div>

              {/* Attempt History List */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                  Mock Test Submissions History ({selectedUser.attempts?.length || 0})
                </h4>

                {(!selectedUser.attempts || selectedUser.attempts.length === 0) ? (
                  <p className="text-slate-400 italic">No tests attempted by this user yet.</p>
                ) : (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                    {selectedUser.attempts.map((att: any) => (
                      <div key={att.id} className="p-3.5 bg-white hover:bg-slate-50 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{att.mockTest.title}</p>
                          <p className="text-[11px] text-slate-500">
                            {new Date(att.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-slate-900">{att.score} / {att.mockTest.totalMarks} Marks</span>
                          <span className="block text-[10px] text-emerald-700 font-bold">{att.accuracy}% Accuracy</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
