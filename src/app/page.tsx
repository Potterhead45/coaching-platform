export const dynamic = 'force-dynamic';
import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Clock, 
  Zap, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Star, 
  ArrowRight,
  Sparkles,
  HelpCircle,
  BarChart3,
  Flame,
  Check
} from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import ContactForm from '@/components/ContactForm';

export default async function HomePage() {
  const user = await getCurrentUser();

  // Fetch featured courses and latest mock tests
  const featuredCourses = await prisma.course.findMany({
    include: {
      chapters: {
        select: { id: true, title: true },
      },
      _count: {
        select: { mockTests: true },
      },
    },
    take: 3,
  });

  const mockTests = await prisma.mockTest.findMany({
    where: { isPublished: true },
    include: {
      _count: {
        select: { questions: true, attempts: true },
      },
    },
    take: 6,
    orderBy: { createdAt: 'desc' },
  });

  const stats = [
    { label: 'Students Mentored', value: '15,000+', icon: Users, color: 'text-brand-600 bg-brand-50' },
    { label: 'Total Mock Tests Taken', value: '85,000+', icon: Zap, color: 'text-amber-600 bg-amber-50' },
    { label: 'Selection Success Rate', value: '98.4%', icon: Award, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Average Score Boost', value: '+35%', icon: TrendingUp, color: 'text-indigo-600 bg-indigo-50' },
  ];

  const toppers = [
    { name: 'Aditya S.', exam: 'JEE Advanced', rank: 'AIR 42', score: '324/360', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', quote: 'The real-time test timer and instant explanation of my silly mistakes helped me jump from AIR 1200 to AIR 42.' },
    { name: 'Sneha Roy', exam: 'NEET-UG', rank: 'AIR 88', score: '705/720', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80', quote: 'Detailed post-test analytics identified my weak spots in Organic Chemistry and Genetics early on.' },
    { name: 'Rohan Mehta', exam: 'Class 12 Boards', rank: '98.6%', score: 'Topper', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', quote: 'Chapter-wise test series with step-marking scheme gave me immense confidence before the final exam.' },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-900 via-slate-900 to-slate-950 text-white pt-8 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[600px] h-[300px] bg-brand-500/20 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-400/20 text-brand-300 text-xs font-semibold max-w-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">India’s Advanced Exam Prep & CBT Simulator</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] break-words">
                Master Any Competitive Exam With <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-indigo-200 to-amber-300">Precision Mock Tests</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Experience the authentic NTA-style online exam interface with strict timers, instant automated scoring, and <strong>deep step-by-step explanations for every incorrect answer</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 pt-1">
                <Link
                  href="/tests"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-600/30 transition-all text-sm"
                >
                  <Flame className="w-4 h-4 text-amber-300" />
                  Take a Free Mock Test
                </Link>

                <Link
                  href="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all text-sm"
                >
                  <BookOpen className="w-4 h-4 text-brand-400" />
                  Explore Courses & Syllabus
                </Link>
              </div>

              {/* Quick Demo Creds for testing - Responsive Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300 w-full max-w-full text-left space-y-2 overflow-hidden shadow-inner">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Demo Logins (Try on Login Page):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-slate-400 block font-semibold">Student Account:</span>
                    <code className="text-brand-300 font-mono text-[10px] sm:text-[11px] break-all">student@apexcoaching.com</code>
                    <span className="text-slate-400 block text-[10px]">pass: student123</span>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-700/50">
                    <span className="text-amber-400 block font-semibold">Admin Account:</span>
                    <code className="text-amber-300 font-mono text-[10px] sm:text-[11px] break-all">admin@apexcoaching.com</code>
                    <span className="text-slate-400 block text-[10px]">pass: admin123</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Live Test Interface Preview */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl bg-slate-800/90 border border-slate-700 p-4 sm:p-6 shadow-2xl backdrop-blur-xl w-full">
                <div className="flex items-center justify-between border-b border-slate-700 pb-3 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-300 ml-1.5">CBT Exam Engine</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 text-xs font-mono font-bold border border-red-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> 00:29:45
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700">
                    <p className="text-slate-400 font-medium text-[11px] mb-1">Question 03 of 30 • Physics</p>
                    <p className="text-slate-100 font-semibold text-xs sm:text-sm leading-snug">
                      A particle starts from rest with uniform acceleration a = 4 m/s². What is the distance in the 5th second?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-700 text-slate-300">
                      A) 16 meters
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-200 font-semibold flex items-center justify-between">
                      <span>B) 18 meters</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-700 text-slate-300">
                      C) 20 meters
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900/40 border border-slate-700 text-slate-300">
                      D) 22 meters
                    </div>
                  </div>

                  {/* Feature Pills */}
                  <div className="pt-2 border-t border-slate-700/80 grid grid-cols-3 gap-1.5 text-center text-[10px] text-slate-400">
                    <div className="p-1.5 bg-slate-900/60 rounded truncate">✓ Auto Grading</div>
                    <div className="p-1.5 bg-slate-900/60 rounded truncate">✓ Error Analysis</div>
                    <div className="p-1.5 bg-slate-900/60 rounded truncate">✓ AIR Rank Est.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900">{stat.value}</h3>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-tight">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Apex Mock Tests */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            The Smart Way to Prepare
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Why Standard Mock Tests Fail & How We Fix It
          </h2>
          <p className="text-slate-600 text-base">
            Taking tests without understanding your mistakes is useless. Our platform diagnoses your weak chapters with precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Real Exam CBT Timer</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Experience the exact exam screen with color-coded question palette, section switching, and auto-submit on timeout.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Explanations on Incorrect Answers</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Instantly view why your chosen option was wrong, with comprehensive step-by-step mathematical & conceptual solutions.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Personalized Student Analytics</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Track your test scores, speed per question, negative marks lost, and performance progression over time.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Mock Tests */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                Practice & Benchmark
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Latest Mock Tests</h2>
              <p className="text-slate-600 text-sm mt-1">
                Full-length mock tests and chapter diagnostics crafted by top subject matter experts.
              </p>
            </div>
            <Link
              href="/tests"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group"
            >
              <span>View All Mock Tests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                      {test.category}
                    </span>
                    {test.isFree ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        FREE TEST
                      </span>
                    ) : (
                      <span className="text-base font-extrabold text-slate-900">
                        {formatCurrency(test.price)}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata Chips */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDuration(test.durationMinutes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test._count.questions} Qs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.totalMarks} Marks</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    href={`/test/${test.id}/take`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm bg-slate-900 hover:bg-brand-600 text-white transition-colors"
                  >
                    <span>{test.isFree ? 'Start Free Test' : 'Enroll & Start'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses & Chapters Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Syllabus & Structured Learning
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Comprehensive Courses</h2>
            <p className="text-slate-600 text-sm mt-1">
              Chapter-by-chapter mastery paths tailored for board & competitive exams.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 group"
          >
            <span>Browse All Courses & Chapters</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-slate-800 relative overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-brand-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow">
                    {course.targetExam}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{course.title}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2">{course.description}</p>

                  <div className="pt-2">
                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                      Chapters Included:
                    </p>
                    <ul className="space-y-1">
                      {course.chapters.slice(0, 3).map((ch, idx) => (
                        <li key={ch.id} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                          <span className="truncate">{ch.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <div>
                  <span className="text-xs text-slate-400 block">Course Fee</span>
                  <span className="text-lg font-extrabold text-slate-900">{formatCurrency(course.price)}</span>
                </div>
                <Link
                  href={`/courses`}
                  className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  View Syllabus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hall of Fame / Results */}
      <section id="results" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
              Hall of Fame 2025-2026
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              Our Students Speak For Our Quality
            </h2>
            <p className="text-slate-400 text-sm">
              Discover how regular mock testing with detailed error resolution transformed their scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toppers.map((topper, i) => (
              <div key={i} className="bg-slate-800/90 border border-slate-700 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={topper.image}
                    alt={topper.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-brand-500"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">{topper.name}</h4>
                    <p className="text-xs text-brand-300 font-semibold">
                      {topper.exam} • <span className="text-amber-400 font-bold">{topper.rank}</span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{topper.quote}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Admissions Form */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 bg-gradient-to-br from-brand-700 to-indigo-900 p-8 lg:p-12 text-white flex flex-col justify-between">
              <div className="space-y-6">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-200 bg-brand-600/30 px-3 py-1 rounded-full">
                  Admissions & Counseling
                </span>
                <h3 className="text-3xl font-extrabold">Ready to Elevate Your Exam Scores?</h3>
                <p className="text-brand-100 text-sm leading-relaxed">
                  Get in touch with our academic counselors for batch timings, scholarship tests, and custom test series packages.
                </p>

                <div className="space-y-4 pt-4 text-sm text-brand-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span>Free 1-on-1 Strategy Session</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Full Diagnostic Report</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-brand-500/30 text-xs text-brand-200">
                Helpline: <strong className="text-white">+91 98765 43210</strong>
              </div>
            </div>

            <div className="lg:col-span-7 p-8 lg:p-12">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
