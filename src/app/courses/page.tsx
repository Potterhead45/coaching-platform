export const dynamic = 'force-dynamic';
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
import { FadeIn, StaggerContainer, StaggerItem, HoverCard } from '@/components/motion/MotionWrapper';

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
    <div className="bg-[#F2FAFB] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <FadeIn direction="down">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#024950] bg-[#AFDDE5]/40 px-3.5 py-1 rounded-full border border-[#0FA4AF]/30">
              Structured Learning & Test Curriculum
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#003135] tracking-tight">
              Courses, Chapters & Syllabi
            </h1>
            <p className="text-[#024950]/80 text-sm leading-relaxed">
              Master every concept systematically. Each course contains topic-wise breakdown, chapter study notes, and targeted chapter tests designed to build speed and accuracy.
            </p>
          </div>
        </FadeIn>

        {/* Courses List */}
        <div className="space-y-12">
          {courses.map((course) => (
            <FadeIn key={course.id} direction="up" duration={0.5}>
              <div className="bg-white rounded-3xl border border-[#AFDDE5]/70 shadow-sm overflow-hidden">
                {/* Course Banner */}
                <div className="bg-gradient-to-r from-[#003135] via-[#024950] to-[#003135] p-6 sm:p-8 text-white border-b border-[#0FA4AF]/30">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <span className="inline-block px-3 py-0.5 rounded-full text-xs font-bold bg-[#003135]/90 text-[#AFDDE5] border border-[#0FA4AF]/40">
                        {course.targetExam}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-extrabold">{course.title}</h2>
                      <p className="text-[#AFDDE5]/80 text-sm max-w-2xl">{course.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-center gap-3 shrink-0">
                      <div className="text-left md:text-right">
                        <span className="text-xs text-[#AFDDE5]/70 block font-medium">Full Course Access</span>
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
                    <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#024950] flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#0FA4AF]" />
                      Chapter Breakdown & Topic Tests ({course.chapters.length} Chapters)
                    </h3>
                  </div>

                  <StaggerContainer staggerChildren={0.06} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {course.chapters.map((chapter) => (
                      <StaggerItem key={chapter.id}>
                        <HoverCard hoverY={-3}>
                          <div className="p-5 rounded-3xl bg-[#AFDDE5]/10 border border-[#AFDDE5]/60 hover:border-[#0FA4AF] transition-colors space-y-3 h-full">
                            <div className="flex items-start justify-between">
                              <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase bg-[#AFDDE5]/40 text-[#003135]">
                                Chapter {chapter.chapterNumber}
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-[#003135] text-base">{chapter.title}</h4>
                              <p className="text-xs text-[#024950]/70 mt-1 leading-relaxed">{chapter.description}</p>
                            </div>

                            {chapter.notes && (
                              <div className="p-3.5 bg-white rounded-2xl border border-[#AFDDE5]/60 text-xs text-slate-600 flex items-start gap-2 shadow-sm">
                                <FileText className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                <div className="space-y-0.5">
                                  <span className="font-bold text-slate-800 block">Revision Summary:</span>
                                  <span className="font-mono text-[11px] text-slate-700">{chapter.notes}</span>
                                </div>
                              </div>
                            )}

                            {/* Chapter Mock Tests */}
                            {chapter.mockTests.length > 0 && (
                              <div className="pt-2 border-t border-slate-200/80 space-y-2">
                                <p className="text-[11px] font-bold text-[#024950] uppercase tracking-wider">
                                  Chapter Mock Test:
                                </p>
                                {chapter.mockTests.map((t) => (
                                  <div
                                    key={t.id}
                                    className="flex items-center justify-between p-3 bg-white rounded-2xl border border-slate-200 text-xs shadow-sm"
                                  >
                                    <div className="space-y-0.5">
                                      <p className="font-bold text-slate-800 line-clamp-1">{t.title}</p>
                                      <p className="text-[11px] text-slate-500">
                                        {t.durationMinutes} mins • {t.totalMarks} Marks
                                      </p>
                                    </div>
                                    <Link
                                      href={`/test/${t.id}/take`}
                                      className="px-3.5 py-1.5 rounded-xl bg-[#024950] hover:bg-[#003135] text-white font-bold text-xs transition-colors shrink-0 shadow-sm"
                                    >
                                      Take Test
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </HoverCard>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
