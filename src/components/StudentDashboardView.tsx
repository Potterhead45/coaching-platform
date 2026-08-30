'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  BookOpen, 
  RotateCcw, 
  ArrowRight, 
  Receipt, 
  Flame, 
  BarChart3, 
  Zap,
  Calendar,
  Layers,
  Sparkles,
  CreditCard,
  Lock
} from 'lucide-react';
import { formatCurrency, formatDuration, formatTime } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { FadeIn, StaggerContainer, StaggerItem, HoverCard, CountUp } from '@/components/motion/MotionWrapper';

interface StudentDashboardViewProps {
  user: any;
  attempts: any[];
  enrollments: any[];
  payments: any[];
  availableTests: any[];
}

export default function StudentDashboardView({
  user,
  attempts,
  enrollments,
  payments,
  availableTests,
}: StudentDashboardViewProps) {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ATTEMPTS' | 'COURSES' | 'BILLING'>('OVERVIEW');

  // Compute stats
  const totalAttempts = attempts.length;
  const totalCorrect = attempts.reduce((acc, a) => acc + a.correctCount, 0);
  const totalIncorrect = attempts.reduce((acc, a) => acc + a.incorrectCount, 0);
  const totalQuestionsAttempted = totalCorrect + totalIncorrect;

  const averageAccuracy =
    totalQuestionsAttempted > 0
      ? ((totalCorrect / totalQuestionsAttempted) * 100).toFixed(1)
      : '0';

  const averageScore =
    totalAttempts > 0
      ? (attempts.reduce((acc, a) => acc + a.score, 0) / totalAttempts).toFixed(1)
      : '0';

  const topScore =
    totalAttempts > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  // Chart data for score progression
  const chartData = [...attempts]
    .reverse()
    .map((att, i) => ({
      testName: `Test ${i + 1}`,
      score: att.score,
      maxMarks: att.totalMarks,
      accuracy: att.accuracy,
      date: new Date(att.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome Card */}
      <FadeIn direction="down" duration={0.4}>
        <div className="bg-gradient-to-r from-[#003135] via-[#024950] to-[#003135] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#0FA4AF]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#003135]/90 text-[#AFDDE5] text-xs font-bold border border-[#0FA4AF]/40">
              <Sparkles className="w-3.5 h-3.5 text-[#0FA4AF]" />
              <span>Student Learning & Analytics Hub</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-[#AFDDE5]/80 text-xs sm:text-sm max-w-xl leading-relaxed">
              Track your mock test scores, target exam benchmarks, and review in-depth solutions for every test attempt.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/tests"
              className="px-6 py-3.5 rounded-2xl bg-[#964734] hover:bg-[#833B2B] text-white text-xs font-bold shadow-lg shadow-[#964734]/30 transition-all hover:scale-[1.02] flex items-center gap-2"
            >
              <Flame className="w-4 h-4 text-[#AFDDE5]" />
              Take a New Mock Test
            </Link>
          </div>
        </div>
      </FadeIn>

      {/* Metric Cards with Animated Counters */}
      <StaggerContainer staggerChildren={0.08} className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StaggerItem>
          <HoverCard hoverY={-4}>
            <div className="bg-white p-6 rounded-3xl border border-[#AFDDE5]/70 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#024950]/10 text-[#024950] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-[#0FA4AF]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#003135]">
                  <CountUp value={totalAttempts} duration={1.2} />
                </h3>
                <p className="text-xs font-semibold text-slate-500">Tests Attempted</p>
              </div>
            </div>
          </HoverCard>
        </StaggerItem>

        <StaggerItem>
          <HoverCard hoverY={-4}>
            <div className="bg-white p-6 rounded-3xl border border-[#AFDDE5]/70 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-emerald-700">
                  <CountUp value={`${averageAccuracy}%`} duration={1.4} />
                </h3>
                <p className="text-xs font-semibold text-slate-500">Average Accuracy</p>
              </div>
            </div>
          </HoverCard>
        </StaggerItem>

        <StaggerItem>
          <HoverCard hoverY={-4}>
            <div className="bg-white p-6 rounded-3xl border border-[#AFDDE5]/70 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#003135]">
                  <CountUp value={averageScore} duration={1.4} />
                </h3>
                <p className="text-xs font-semibold text-slate-500">Average Score</p>
              </div>
            </div>
          </HoverCard>
        </StaggerItem>

        <StaggerItem>
          <HoverCard hoverY={-4}>
            <div className="bg-white p-6 rounded-3xl border border-[#AFDDE5]/70 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#AFDDE5]/30 text-[#024950] flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-[#0FA4AF]" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#024950]">
                  <CountUp value={topScore} duration={1.2} />
                </h3>
                <p className="text-xs font-semibold text-slate-500">Personal Best</p>
              </div>
            </div>
          </HoverCard>
        </StaggerItem>
      </StaggerContainer>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('OVERVIEW')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
            activeTab === 'OVERVIEW'
              ? 'bg-[#003135] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Progress Overview & Chart
        </button>

        <button
          onClick={() => setActiveTab('ATTEMPTS')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'ATTEMPTS'
              ? 'bg-[#003135] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Test Attempts & Solutions</span>
          <span className="px-2 py-0.5 bg-[#AFDDE5]/40 text-[#003135] rounded-full text-[10px] font-bold">
            {attempts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('COURSES')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'COURSES'
              ? 'bg-[#003135] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Enrolled Courses</span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
            {enrollments.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('BILLING')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'BILLING'
              ? 'bg-[#003135] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Payments & Invoices</span>
          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-full text-[10px] font-bold">
            {payments.length}
          </span>
        </button>
      </div>

      {/* Tab: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Progress Chart */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#AFDDE5]/70 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#003135] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#0FA4AF]" />
                  Score Progression Over Tests
                </h3>
                <p className="text-xs text-slate-500">Track your score improvement across successive mock tests.</p>
              </div>
            </div>

            {chartData.length > 0 ? (
              <div className="h-64 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0FA4AF" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#0FA4AF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#003135', borderRadius: '14px', border: '1px solid #0FA4AF', color: '#fff', fontSize: '12px' }}
                    />
                    <Area type="monotone" dataKey="score" stroke="#0FA4AF" strokeWidth={3} fillOpacity={1} fill="url(#scoreGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                No mock test attempts recorded yet. Take a test to populate your progress curve!
              </div>
            )}
          </div>

          {/* Quick Recommended Mock Tests */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#003135] flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#964734]" />
                Recommended Mock Tests
              </h3>
              <Link href="/tests" className="text-xs font-bold text-[#024950] hover:underline">
                Browse All Tests →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableTests.map((t) => (
                <div
                  key={t.id}
                  className="bg-white p-5 rounded-3xl border border-[#AFDDE5]/60 shadow-sm flex items-center justify-between gap-4 hover:border-[#0FA4AF] transition-colors"
                >
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#AFDDE5]/30 text-[#024950]">
                      {t.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{t.title}</h4>
                    <p className="text-[11px] text-slate-500">
                      {t.durationMinutes} mins • {t._count?.questions || 0} Qs • {t.totalMarks} Marks
                    </p>
                  </div>

                  <Link
                    href={`/test/${t.id}/take`}
                    className="px-4 py-2 rounded-xl bg-[#024950] hover:bg-[#003135] text-white text-xs font-bold transition-colors shrink-0 flex items-center gap-1 shadow-sm"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#AFDDE5]" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Tab: ATTEMPTS */}
      {activeTab === 'ATTEMPTS' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-[#AFDDE5]/70 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-[#003135]">Your Test History & Solution Keys</h3>
            <p className="text-xs text-slate-500 mt-0.5">Click any attempt to inspect error breakdowns and step-by-step solutions.</p>
          </div>

          {attempts.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              You haven't attempted any mock tests yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {attempts.map((att) => (
                <div key={att.id} className="p-6 hover:bg-[#AFDDE5]/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-[#AFDDE5]/30 text-[#024950] border border-[#AFDDE5]">
                        {att.mockTest.category}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(att.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-base">{att.mockTest.title}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-600">
                      <span>Score: <strong className="text-slate-900">{att.score}</strong> / {att.totalMarks}</span>
                      <span>Accuracy: <strong className="text-emerald-700">{att.accuracy}%</strong></span>
                      <span>Correct: <strong className="text-emerald-600">+{att.correctCount}</strong></span>
                      <span>Wrong: <strong className="text-rose-600">-{att.incorrectCount}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/test/${att.mockTestId}/result/${att.id}`}
                      className="px-4 py-2.5 rounded-xl bg-[#024950] hover:bg-[#003135] text-white text-xs font-bold shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0FA4AF]" />
                      View Solutions
                    </Link>
                    <Link
                      href={`/test/${att.mockTestId}/take`}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Retake
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Tab: COURSES */}
      {activeTab === 'COURSES' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white rounded-3xl border border-[#AFDDE5]/70 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#003135]">Enrolled Courses</h3>
            <p className="text-xs text-slate-500">Courses you have purchased or enrolled in.</p>
          </div>

          {enrollments.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500 text-sm space-y-3">
              <p>You have not enrolled in any full courses yet.</p>
              <Link href="/courses" className="inline-block px-5 py-2.5 bg-[#964734] hover:bg-[#833B2B] text-white text-xs font-bold rounded-xl transition-colors shadow-sm">
                Explore Course Directory
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {enrollments.map((enr) => (
                <div key={enr.id} className="bg-white rounded-3xl border border-[#AFDDE5]/70 p-6 shadow-sm space-y-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                      {enr.course.targetExam}
                    </span>
                    <h4 className="font-bold text-slate-900 text-lg">{enr.course.title}</h4>
                    <p className="text-xs text-slate-500">{enr.course.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">{enr.course.chapters?.length || 0} Chapters Available</span>
                    <Link
                      href="/courses"
                      className="text-[#024950] font-bold hover:underline"
                    >
                      View Syllabus →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Tab: BILLING */}
      {activeTab === 'BILLING' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl border border-[#AFDDE5]/70 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-lg font-bold text-[#003135]">Payment History & Tax Invoices</h3>
            <p className="text-xs text-slate-500">Official verified purchase records for all mock tests and course enrollments.</p>
          </div>

          {payments.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-[#AFDDE5]/20 text-[#003135] uppercase text-[10px] font-extrabold border-b border-[#AFDDE5]/40">
                  <tr>
                    <th className="p-4">Invoice #</th>
                    <th className="p-4">Item Purchased</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Gateway</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((pay) => (
                    <tr key={pay.id} className="hover:bg-[#AFDDE5]/10 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#003135]">{pay.invoiceNumber}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        {pay.mockTest?.title || pay.course?.title || 'Mock Test Series'}
                      </td>
                      <td className="p-4 font-black text-[#964734]">{formatCurrency(pay.amount)}</td>
                      <td className="p-4 uppercase font-semibold text-slate-600">{pay.gateway}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {pay.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">
                        {new Date(pay.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
