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
  Check,
  Target,
  FileCheck,
  PhoneCall
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
    { label: 'Students Mentored', value: '15,000+', icon: Users, color: 'text-brand-700 bg-brand-50 border-brand-200' },
    { label: 'Total Mock Tests Taken', value: '85,000+', icon: Zap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { label: 'Selection Success Rate', value: '98.4%', icon: Award, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'Average Score Growth', value: '+35%', icon: TrendingUp, color: 'text-blue-700 bg-blue-50 border-blue-200' },
  ];

  const toppers = [
    { name: 'Aditya S.', exam: 'JEE Advanced', rank: 'AIR 42', score: '324/360', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80', quote: 'The real-time test timer and instant step-by-step solutions of my incorrect answers helped me jump from AIR 1200 to AIR 42.' },
    { name: 'Sneha Roy', exam: 'NEET-UG', rank: 'AIR 88', score: '705/720', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&q=80', quote: 'Detailed post-test analytics identified my weak spots in Organic Chemistry and Genetics early on.' },
    { name: 'Rohan Mehta', exam: 'Class 12 Boards', rank: '98.6%', score: 'Topper', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80', quote: 'Chapter-wise test series with step-marking scheme gave me immense confidence before the final examination.' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 w-full overflow-x-hidden bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white pt-8 pb-20 sm:pt-16 sm:pb-28 lg:pt-20 lg:pb-32 border-b border-slate-800">
        {/* Subtle Academic Grid & Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-amber-300 text-xs font-semibold max-w-full shadow-sm">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">Premier Computer-Based Testing & Analytics Platform</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-[1.15] text-slate-100 break-words">
                Excel in Competitive Exams with <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-brand-300">Precision Mock Tests</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Authentic NTA/CBT exam simulations with strict timers, positive & negative marking, and <strong className="text-white font-semibold">in-depth step-by-step solutions for every incorrect answer</strong>.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-1">
                <Link
                  href="/tests"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] text-sm"
                >
                  <Flame className="w-4 h-4 text-slate-950" />
                  Take a Free Mock Test
                </Link>

                <Link
                  href="/courses"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all text-sm"
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  Explore Courses & Syllabus
                </Link>
              </div>

              {/* Instant Demo Creds - Clean Academic Access Card */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 w-full max-w-full text-left space-y-2 overflow-hidden shadow-md">
                <div className="font-bold text-amber-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Demo Logins (Available on Login Screen):
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block font-semibold text-[10px] uppercase tracking-wider">Student Candidate</span>
                    <code className="text-amber-200 font-mono text-[11px] break-all">student@apexcoaching.com</code>
                    <span className="text-slate-400 block text-[10px]">pass: student123</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-amber-400 block font-semibold text-[10px] uppercase tracking-wider">Admin Faculty</span>
                    <code className="text-amber-300 font-mono text-[11px] break-all">admin@apexcoaching.com</code>
                    <span className="text-slate-400 block text-[10px]">pass: admin123</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: Authentic CBT Exam Simulator Preview */}
            <div className="lg:col-span-5 w-full">
              <div className="relative rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-6 shadow-2xl backdrop-blur-xl w-full">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">CBT Exam Engine Simulator</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-xs font-mono font-bold border border-rose-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" /> 00:29:45
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span>Question 03 of 30 • Physics</span>
                      <span className="text-emerald-400 font-semibold">+4 / -1 Mark</span>
                    </div>
                    <p className="text-slate-100 font-semibold text-xs sm:text-sm leading-snug">
                      A particle starts from rest with uniform acceleration a = 4 m/s². What is the distance travelled in the 5th second?
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-300">
                      A) 16 meters
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 font-semibold flex items-center justify-between">
                      <span>B) 18 meters</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-300">
                      C) 20 meters
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800 text-slate-300">
                      D) 22 meters
                    </div>
                  </div>

                  {/* Feature Badges */}
                  <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-1.5 text-center text-[10px] text-slate-400">
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80 truncate">✓ NTA Test Pattern</div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80 truncate">✓ Error Solution Keys</div>
                    <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80 truncate">✓ All-India Rank Est.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Institutional Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-16 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/90 shadow-lg shadow-slate-900/5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:border-slate-300 transition-colors">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border ${stat.color}`}>
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
                  <p className="text-[11px] sm:text-xs font-medium text-slate-500 leading-tight">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Academic Methodology / Why Apex */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-10 sm:mb-14">
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Scientific Exam Preparation
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Precision Mock Testing Builds Top Ranks
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            Taking tests without diagnosing your mistakes is ineffective. Our platform analyzes your weak concepts and provides instant explanations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Standard CBT Exam Timer</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Experience the actual exam interface with a live countdown timer, color-coded question palette, and automatic submission upon timeout.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Explanations on Incorrect Answers</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Instantly view why your chosen option was wrong, backed by comprehensive step-by-step mathematical derivations and conceptual explanations.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Student Progress Analytics</h3>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
              Track your test scores, accuracy rate, speed per question, negative marks lost, and performance growth across all exam attempts.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Mock Tests Catalog */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Examination Series
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Active Online Mock Tests</h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1">
                Full-length mock tests and chapter diagnostics curated by premier subject matter experts.
              </p>
            </div>
            <Link
              href="/tests"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-800 hover:text-brand-900 group"
            >
              <span>View All Mock Tests</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockTests.map((test) => (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
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
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-800 transition-colors line-clamp-2">
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-sm bg-slate-900 hover:bg-brand-900 text-white transition-colors"
                  >
                    <span>{test.isFree ? 'Start Free Test' : 'Enroll & Start Test'}</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses & Chapters Syllabus */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-800 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Structured Curriculum
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">Courses & Chapter Syllabus</h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-1">
              Chapter-by-chapter mastery modules designed for board and entrance exams.
            </p>
          </div>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-800 hover:text-brand-900 group"
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
                <div className="h-44 bg-slate-900 relative overflow-hidden">
                  <img
                    src={course.thumbnail || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-slate-900/90 text-amber-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md shadow border border-slate-700">
                    {course.targetExam}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-bold text-slate-900 text-lg line-clamp-1">{course.title}</h3>
                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">{course.description}</p>

                  <div className="pt-2">
                    <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-1.5">
                      Chapters Included:
                    </p>
                    <ul className="space-y-1">
                      {course.chapters.slice(0, 3).map((ch) => (
                        <li key={ch.id} className="text-xs text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-600" />
                          <span className="truncate">{ch.title}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Course Fee</span>
                  <span className="text-lg font-extrabold text-slate-900">{formatCurrency(course.price)}</span>
                </div>
                <Link
                  href={`/courses`}
                  className="px-4 py-2 bg-slate-900 hover:bg-brand-900 text-white font-semibold rounded-xl text-xs transition-colors"
                >
                  View Syllabus
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hall of Fame / Results */}
      <section id="results" className="bg-slate-950 text-white py-16 sm:py-20 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
              Hall of Fame 2025-2026
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Our Student Results & Ranks
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm">
              Discover how structured mock testing with detailed error resolution transformed their scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {toppers.map((topper, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <img
                    src={topper.image}
                    alt={topper.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400/80"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">{topper.name}</h4>
                    <p className="text-xs text-slate-300 font-medium">
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

      {/* Admissions Counseling Form */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 bg-slate-950 p-8 lg:p-12 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800">
              <div className="space-y-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full">
                  Admissions & Counseling
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Ready to Elevate Your Exam Scores?</h3>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Connect with our academic counselors for batch timings, scholarship tests, and custom test series packages.
                </p>

                <div className="space-y-4 pt-4 text-xs sm:text-sm text-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span>Free 1-on-1 Strategy Session</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Full Diagnostic Performance Report</span>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-800 text-xs text-slate-400">
                Helpline: <strong className="text-amber-300 font-semibold">+91 98765 43210</strong>
              </div>
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-12 bg-white">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
