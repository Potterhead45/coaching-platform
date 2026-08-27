'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  FileQuestion, 
  CreditCard, 
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'User Details (Students)', href: '/admin/users', icon: Users },
    { name: 'Test Details & Counts', href: '/admin/tests', icon: FileQuestion },
    { name: 'Payment Details & Revenue', href: '/admin/payments', icon: CreditCard },
  ];

  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Site</span>
            </Link>

            <div className="h-5 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500 text-white font-bold">
                <ShieldCheck className="w-4 h-4" />
              </span>
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                Admin Control Center
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-700' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
