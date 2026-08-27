'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  GraduationCap, 
  Clock, 
  HelpCircle, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  RotateCcw, 
  Send, 
  Loader2, 
  AlertTriangle,
  CheckCircle2,
  X
} from 'lucide-react';
import TestTimer from './TestTimer';
import QuestionPalette, { QuestionStatus } from './QuestionPalette';

interface CbtTestEngineProps {
  mockTest: any;
  user: any;
}

export default function CbtTestEngine({ mockTest, user }: CbtTestEngineProps) {
  const router = useRouter();
  const questions = mockTest.questions || [];
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [visitedQuestions, setVisitedQuestions] = useState<Set<number>>(new Set([0]));
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const currentQuestion = questions[currentIndex];

  // Track time spent on current question & total time
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalTimeElapsed((prev) => prev + 1);
      if (currentQuestion) {
        setTimeSpent((prev) => ({
          ...prev,
          [currentQuestion.id]: (prev[currentQuestion.id] || 0) + 1,
        }));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestion]);

  // Mark question as visited when changing current index
  const handleSelectQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentIndex(index);
      setVisitedQuestions((prev) => {
        const next = new Set(prev);
        next.add(index);
        return next;
      });
    }
  };

  // Option selection
  const handleOptionSelect = (optionId: string) => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  // Clear answer
  const handleClearResponse = () => {
    if (!currentQuestion) return;
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[currentQuestion.id];
      return copy;
    });
  };

  // Toggle Mark for Review
  const handleToggleMarkForReview = () => {
    if (!currentQuestion) return;
    setMarkedForReview((prev) => ({
      ...prev,
      [currentQuestion.id]: !prev[currentQuestion.id],
    }));

    if (currentIndex < totalQuestions - 1) {
      handleSelectQuestion(currentIndex + 1);
    }
  };

  // Save and Next
  const handleSaveAndNext = () => {
    if (currentIndex < totalQuestions - 1) {
      handleSelectQuestion(currentIndex + 1);
    }
  };

  // Compute status for all questions
  const questionStatuses: QuestionStatus[] = questions.map((q: any, idx: number) => {
    const isAnswered = !!selectedAnswers[q.id];
    const isMarked = !!markedForReview[q.id];
    const isVisited = visitedQuestions.has(idx);

    if (isAnswered && isMarked) return 'ANSWERED_AND_MARKED';
    if (isMarked) return 'MARKED_FOR_REVIEW';
    if (isAnswered) return 'ANSWERED';
    if (isVisited) return 'NOT_ANSWERED';
    return 'NOT_VISITED';
  });

  // Calculate summary counts
  const answeredCount = Object.keys(selectedAnswers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const unattemptedCount = totalQuestions - answeredCount;

  // Submit test to backend
  const handleSubmitTest = useCallback(async () => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payloadAnswers = questions.map((q: any) => ({
        questionId: q.id,
        selectedOptionId: selectedAnswers[q.id] || null,
        timeSpentSeconds: timeSpent[q.id] || 0,
        isMarkedForReview: !!markedForReview[q.id],
      }));

      const res = await fetch('/api/test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: mockTest.id,
          answers: payloadAnswers,
          timeSpentSeconds: totalTimeElapsed,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit test');
      }

      // Redirect to detailed result & solutions page
      router.push(`/test/${mockTest.id}/result/${data.attemptId}`);
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Submission error. Please try again.');
      setSubmitting(false);
    }
  }, [mockTest.id, questions, selectedAnswers, timeSpent, markedForReview, totalTimeElapsed, router]);

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
        <p>No questions found in this mock test.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Test Top Bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 sticky top-0 z-30 flex items-center justify-between gap-2 sm:gap-4 shadow-md w-full">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold shrink-0">
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xs sm:text-base font-bold text-white leading-tight truncate">
              {mockTest.title}
            </h1>
            <p className="text-[10px] sm:text-[11px] text-slate-400 truncate">
              Candidate: <span className="text-brand-300 font-semibold">{user.name}</span> | Marking:{' '}
              <span className="text-emerald-400">+{currentQuestion.positiveMarks || 4}</span> /{' '}
              <span className="text-rose-400">-{currentQuestion.negativeMarks || 1}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Live Timer */}
          <TestTimer
            initialSeconds={mockTest.durationMinutes * 60}
            onTimeUp={() => {
              handleSubmitTest();
            }}
          />

          {/* Submit Test Button */}
          <button
            onClick={() => setSubmitModalOpen(true)}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Test</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Viewer & Actions */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            {/* Question Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-brand-50 text-brand-700 rounded-lg text-xs font-extrabold border border-brand-200">
                  Question {currentIndex + 1} of {totalQuestions}
                </span>
                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                  {currentQuestion.subject || 'General'}
                </span>
              </div>

              <div className="text-xs font-semibold text-slate-500">
                Correct: <span className="text-emerald-600 font-bold">+{currentQuestion.positiveMarks || 4}</span> | Wrong:{' '}
                <span className="text-rose-600 font-bold">-{currentQuestion.negativeMarks || 1}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-slate-900 text-base sm:text-lg font-medium leading-relaxed">
              {currentQuestion.questionText}
            </div>

            {/* Optional Question Image */}
            {currentQuestion.imageUrl && (
              <div className="rounded-xl overflow-hidden border border-slate-200 max-w-md">
                <img src={currentQuestion.imageUrl} alt="Question figure" className="w-full h-auto" />
              </div>
            )}

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options.map((option: any) => {
                const isSelected = selectedAnswers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-brand-600 bg-brand-50/70 shadow-sm ring-1 ring-brand-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 bg-white'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${
                        isSelected
                          ? 'bg-brand-600 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}
                    >
                      {option.optionLabel}
                    </span>
                    <span className="text-sm font-medium text-slate-800 pt-0.5 leading-snug">
                      {option.optionText}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMarkForReview}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border ${
                  markedForReview[currentQuestion.id]
                    ? 'bg-purple-50 text-purple-700 border-purple-300'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-4 h-4 text-purple-600" />
                {markedForReview[currentQuestion.id] ? 'Unmark Review' : 'Mark for Review & Next'}
              </button>

              <button
                onClick={handleClearResponse}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear Choice
              </button>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => handleSelectQuestion(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <button
                onClick={handleSaveAndNext}
                disabled={currentIndex === totalQuestions - 1}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-colors flex items-center gap-1 shadow-sm disabled:opacity-40"
              >
                <span>Save & Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Palette */}
        <div className="lg:col-span-4 h-[600px]">
          <QuestionPalette
            totalQuestions={totalQuestions}
            currentIndex={currentIndex}
            questionStatuses={questionStatuses}
            onSelectQuestion={handleSelectQuestion}
          />
        </div>
      </div>

      {/* Confirmation Submission Modal */}
      {submitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold">Submit Mock Test?</h3>
              </div>
              <button
                onClick={() => setSubmitModalOpen(false)}
                disabled={submitting}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <p className="text-xs text-slate-600">
                Are you sure you want to finish this test? Once submitted, your score will be calculated immediately and detailed solutions will be revealed.
              </p>

              {/* Stats Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-xl font-black text-emerald-700">{answeredCount}</span>
                  <span className="block text-[11px] font-semibold text-emerald-800">Answered</span>
                </div>
                <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200">
                  <span className="text-xl font-black text-rose-700">{unattemptedCount}</span>
                  <span className="block text-[11px] font-semibold text-rose-800">Unanswered</span>
                </div>
                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-200">
                  <span className="text-xl font-black text-purple-700">{markedCount}</span>
                  <span className="block text-[11px] font-semibold text-purple-800">Review Mark</span>
                </div>
              </div>

              {submitError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(false)}
                  disabled={submitting}
                  className="py-3 px-4 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
                >
                  Resume Test
                </button>
                <button
                  type="button"
                  onClick={handleSubmitTest}
                  disabled={submitting}
                  className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Grading Answers...
                    </>
                  ) : (
                    'Confirm & Submit'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
