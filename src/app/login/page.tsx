'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { GraduationCap, Lock, Mail, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push(redirectUrl);
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
      className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#AFDDE5]/60 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-br from-[#003135] via-[#024950] to-[#003135] p-6 sm:p-8 text-white text-center border-b border-[#0FA4AF]/30">
        <div className="w-14 h-14 rounded-2xl bg-white/10 border border-[#0FA4AF]/40 flex items-center justify-center mx-auto mb-3 shadow-inner">
          <GraduationCap className="w-8 h-8 text-[#AFDDE5]" />
        </div>
        <h2 className="text-2xl font-black tracking-tight">Student & Faculty Portal</h2>
        <p className="text-xs text-[#AFDDE5]/80 mt-1">Sign in to take mock tests and view your analytics</p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2.5"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-extrabold text-[#003135] uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#024950] focus:border-[#024950] text-xs sm:text-sm text-slate-900 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-[11px] font-extrabold text-[#003135] uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#024950] focus:border-[#024950] text-xs sm:text-sm text-slate-900 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-[#964734] hover:bg-[#833B2B] text-white font-bold rounded-xl shadow-lg shadow-[#964734]/25 transition-all hover:scale-[1.01] flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4 text-[#AFDDE5]" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-[#024950]">
          Don't have an account?{' '}
          <Link href="/register" className="font-extrabold text-[#964734] hover:underline">
            Create a student account free
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12 bg-[#F2FAFB]">
      <Suspense fallback={
        <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-md">
          <Loader2 className="w-8 h-8 animate-spin text-[#024950] mx-auto" />
          <p className="text-xs text-slate-500 mt-2 font-medium">Loading Portal...</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
