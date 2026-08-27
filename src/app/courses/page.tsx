import React from 'react';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { 
  BookOpen, 
  Layers, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  FileText,
  HelpCircle,
  Award
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import CourseBuyButton from '@/components/CourseBuyButton';

export default async function CoursesPage() {
  const user = await getCurrentUser();

  const courses = await prisma.course.findMany({
    include: {
      chapters: {
        orderBy: { chapterNumber: 'asc' },
        include: {
          mockTests: {
            where: { isPublished: true },
            select: {
              id: true,
              title: true,
              durationMinutes: true,
              totalMarks: true,
              isFree: true,
              price: true,
            },
          },
        },
      },
      _count: {
        select: { mockTests: true, enrollments: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Structured Learning & Test Curriculum
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Courses, Chapters & Syllabi
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Master every concept systematically. Each course contains topic-wise breakdown, chapter study notes, and targeted chapter tests designed to build speed and accuracy.
          </p>
        </div>

        {/* Courses List */}
        <div className="space-y-12">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
            >
              {/* Course Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 p-6 sm:p-8 text-white">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-500/30 text-brand-200 border border-brand-400/30">
                      {course.targetExam}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold">{course.title}</h2>
                    <p className="text-slate-300 text-sm max-w-2xl">{course.description}</p>
                  </div>

                  <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-3 shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-xs text-slate-400 block">Full Course Access</span>
                      <span className="text-2xl font-black text-white">{formatCurrency(course.price)}</span>
                    </div>

                    <CourseBuyButton
                      course={{
                        id: course.id,
                        title: course.title,
                        price: course.price,
                      }}
                      user={user}
                    />
                  </div>
                </div>
              </div>

              {/* Chapters & Syllabus Accordion */}
              <div className="p-6 sm:p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-brand-600" />
                    Chapter Breakdown & Topic Tests ({course.chapters.length} Chapters)
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {course.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-brand-300 transition-colors space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-200 text-slate-700">
                          Chapter {chapter.chapterNumber}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{chapter.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">{chapter.description}</p>
                      </div>

                      {chapter.notes && (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                          <FileText className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="font-semibold text-slate-800 block">Revision Summary:</span>
                            <span className="font-mono text-[11px] text-slate-700">{chapter.notes}</span>
                          </div>
                        </div>
                      )}

                      {/* Chapter Mock Tests */}
                      {chapter.mockTests.length > 0 && (
                        <div className="pt-2 border-t border-slate-200 space-y-2">
                          <p className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                            Chapter Mock Test:
                          </p>
                          {chapter.mockTests.map((t) => (
                            <div
                              key={t.id}
                              className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 text-xs"
                            >
                              <div className="space-y-0.5">
                                <p className="font-semibold text-slate-800 line-clamp-1">{t.title}</p>
                                <p className="text-[11px] text-slate-500">
                                  {t.durationMinutes} mins • {t.totalMarks} Marks
                                </p>
                              </div>
                              <Link
                                href={`/test/${t.id}/take`}
                                className="px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors shrink-0"
                              >
                                Take Test
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
