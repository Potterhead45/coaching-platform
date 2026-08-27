'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  BookOpen, 
  ArrowRight, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  Filter,
  Flame,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { formatTime } from '@/lib/utils';

interface TestResultViewProps {
  attempt: any;
  user: any;
}

export default function TestResultView({ attempt, user }: TestResultViewProps) {
  const [filter, setFilter] = useState<'ALL' | 'INCORRECT' | 'CORRECT' | 'UNATTEMPTED'>('ALL');

  const { mockTest, answers = [] } = attempt;
  const isPassed = attempt.score >= (mockTest.passingMarks || 0);
  const percentage = mockTest.totalMarks > 0 ? ((attempt.score / mockTest.totalMarks) * 100).toFixed(1) : '0';

  // Filtered answers
  const filteredAnswers = answers.filter((ans: any) => {
    const isUnattempted = !ans.selectedOptionId;
    const isCorrect = ans.isCorrect;
    const isIncorrect = !!ans.selectedOptionId && !ans.isCorrect;

    if (filter === 'INCORRECT') return isIncorrect;
    if (filter === 'CORRECT') return isCorrect;
    if (filter === 'UNATTEMPTED') return isUnattempted;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
                {mockTest.category}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isPassed ? 'Passed' : 'Needs Practice'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{mockTest.title}</h1>
            <p className="text-xs text-slate-500">
              Candidate: <strong className="text-slate-800">{user?.name}</strong> • Attempted on{' '}
              {new Date(attempt.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/test/${mockTest.id}/take`}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Test
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-md shadow-brand-500/20 flex items-center gap-1.5 transition-all"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Scorecard Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
          {/* Total Score */}
          <div className="bg-slate-900 text-white p-5 rounded-2xl flex flex-col justify-between shadow-inner">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
              <span>Your Score</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-amber-300">{attempt.score}</span>
              <span className="text-slate-400 text-xs font-bold"> / {mockTest.totalMarks}</span>
              <p className="text-[11px] text-slate-400 mt-0.5">{percentage}% aggregate</p>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-semibold">
              <span>Accuracy Rate</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-emerald-700">{attempt.accuracy}%</span>
              <p className="text-[11px] text-emerald-700 mt-0.5">{attempt.correctCount} correct answers</p>
            </div>
          </div>

          {/* Negative Marks Lost */}
          <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-800 text-xs font-semibold">
              <span>Incorrect Answers</span>
              <XCircle className="w-4 h-4 text-rose-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-rose-700">{attempt.incorrectCount}</span>
              <p className="text-[11px] text-rose-700 mt-0.5">
                Lost {attempt.incorrectCount * (mockTest.negativeMarks || 1)} marks
              </p>
            </div>
          </div>

          {/* Time Taken */}
          <div className="bg-indigo-50 border border-indigo-200 p-5 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between text-indigo-800 text-xs font-semibold">
              <span>Time Spent</span>
              <Clock className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="mt-2">
              <span className="text-3xl font-black text-indigo-700">{formatTime(attempt.timeSpentSeconds)}</span>
              <p className="text-[11px] text-indigo-700 mt-0.5">
                Limit: {mockTest.durationMinutes} mins
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Answer Key & Deep Explanations Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-600" />
              Detailed Solutions & Error Explanations
            </h2>
            <p className="text-xs text-slate-500">
              Review correct answers alongside your submissions to identify concept gaps.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              All ({answers.length})
            </button>

            <button
              onClick={() => setFilter('INCORRECT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                filter === 'INCORRECT'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
              }`}
            >
              <X className="w-3 h-3" />
              Incorrect ({attempt.incorrectCount})
            </button>

            <button
              onClick={() => setFilter('CORRECT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                filter === 'CORRECT'
                  ? 'bg-emerald-600 text-white'
                  : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
              }`}
            >
              <Check className="w-3 h-3" />
              Correct ({attempt.correctCount})
            </button>

            <button
              onClick={() => setFilter('UNATTEMPTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                filter === 'UNATTEMPTED'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Skipped ({attempt.unattemptedCount})
            </button>
          </div>
        </div>

        {/* Questions Breakdown List */}
        <div className="space-y-6">
          {filteredAnswers.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 text-slate-500 text-sm">
              No questions found under this filter.
            </div>
          ) : (
            filteredAnswers.map((ans: any, index: number) => {
              const question = ans.question;
              const isUnattempted = !ans.selectedOptionId;
              const isCorrect = ans.isCorrect;
              const isIncorrect = !isUnattempted && !isCorrect;

              const correctOption = question.options.find((o: any) => o.isCorrect);
              const studentSelectedOption = question.options.find(
                (o: any) => o.id === ans.selectedOptionId
              );

              return (
                <div
                  key={ans.id}
                  className={`bg-white rounded-2xl border-2 shadow-sm overflow-hidden transition-all ${
                    isCorrect
                      ? 'border-emerald-200'
                      : isIncorrect
                      ? 'border-rose-200 ring-1 ring-rose-300'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Question Result Bar */}
                  <div
                    className={`px-6 py-3.5 flex items-center justify-between text-xs font-bold border-b ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100'
                        : isIncorrect
                        ? 'bg-rose-50 text-rose-800 border-rose-100'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm">
                        Q{question.orderIndex || index + 1}
                      </span>
                      <span className="px-2 py-0.5 bg-white/80 rounded text-[10px] uppercase font-semibold">
                        {question.subject || 'General'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+{ans.marksAwarded} Marks)
                        </span>
                      )}
                      {isIncorrect && (
                        <span className="inline-flex items-center gap-1 font-bold text-rose-700">
                          <XCircle className="w-4 h-4" /> Incorrect ({ans.marksAwarded} Negative Mark)
                        </span>
                      )}
                      {isUnattempted && (
                        <span className="inline-flex items-center gap-1 text-slate-500">
                          <HelpCircle className="w-4 h-4" /> Unattempted (0 Marks)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Content */}
                  <div className="p-6 space-y-5">
                    <p className="text-slate-900 font-semibold text-base sm:text-lg leading-relaxed">
                      {question.questionText}
                    </p>

                    {question.imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-200 max-w-md">
                        <img src={question.imageUrl} alt="Question figure" className="w-full h-auto" />
                      </div>
                    )}

                    {/* Options Review */}
                    <div className="space-y-2.5 pt-2">
                      {question.options.map((opt: any) => {
                        const isStudentChoice = opt.id === ans.selectedOptionId;
                        const isThisCorrect = opt.isCorrect;

                        let style = 'border-slate-200 bg-white text-slate-700';
                        let badgeStyle = 'bg-slate-100 text-slate-700';

                        if (isThisCorrect) {
                          style = 'border-emerald-500 bg-emerald-50/80 text-emerald-900 font-semibold';
                          badgeStyle = 'bg-emerald-600 text-white';
                        } else if (isStudentChoice && !isThisCorrect) {
                          style = 'border-rose-500 bg-rose-50/80 text-rose-900 font-semibold';
                          badgeStyle = 'bg-rose-600 text-white';
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3.5 rounded-xl border-2 flex items-start justify-between gap-3 text-sm transition-all ${style}`}
                          >
                            <div className="flex items-start gap-3">
                              <span
                                className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${badgeStyle}`}
                              >
                                {opt.optionLabel}
                              </span>
                              <span className="pt-0.5">{opt.optionText}</span>
                            </div>

                            <div className="shrink-0 flex items-center gap-1.5 text-xs">
                              {isThisCorrect && (
                                <span className="inline-flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                  <Check className="w-3 h-3" /> Correct Answer
                                </span>
                              )}
                              {isStudentChoice && !isThisCorrect && (
                                <span className="inline-flex items-center gap-1 bg-rose-600 text-white px-2 py-0.5 rounded text-[11px] font-bold">
                                  <X className="w-3 h-3" /> Your Selection
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Step-by-Step Explanation Box */}
                    <div className="mt-4 p-4 bg-brand-50/70 border border-brand-200 rounded-2xl space-y-2">
                      <div className="flex items-center gap-1.5 text-brand-900 text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Step-by-Step Concept Solution & Explanation:</span>
                      </div>
                      <div className="text-slate-800 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-normal">
                        {question.explanation}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
