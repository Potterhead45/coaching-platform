'use client';

import React from 'react';
import { Check, Bookmark, HelpCircle } from 'lucide-react';

export type QuestionStatus = 'ANSWERED' | 'NOT_ANSWERED' | 'MARKED_FOR_REVIEW' | 'ANSWERED_AND_MARKED' | 'NOT_VISITED';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  questionStatuses: QuestionStatus[];
  onSelectQuestion: (index: number) => void;
}

export default function QuestionPalette({
  totalQuestions,
  currentIndex,
  questionStatuses,
  onSelectQuestion,
}: QuestionPaletteProps) {
  const counts = {
    answered: questionStatuses.filter((s) => s === 'ANSWERED').length,
    notAnswered: questionStatuses.filter((s) => s === 'NOT_ANSWERED').length,
    marked: questionStatuses.filter((s) => s === 'MARKED_FOR_REVIEW').length,
    answeredAndMarked: questionStatuses.filter((s) => s === 'ANSWERED_AND_MARKED').length,
    notVisited: questionStatuses.filter((s) => s === 'NOT_VISITED').length,
  };

  const getButtonStyles = (status: QuestionStatus, isCurrent: boolean) => {
    let base = 'relative flex items-center justify-center font-bold text-xs rounded-lg transition-all border ';
    
    if (isCurrent) {
      base += 'ring-2 ring-brand-500 ring-offset-2 scale-105 z-10 ';
    }

    switch (status) {
      case 'ANSWERED':
        return base + 'bg-emerald-600 text-white border-emerald-700 shadow-sm';
      case 'NOT_ANSWERED':
        return base + 'bg-rose-600 text-white border-rose-700 shadow-sm';
      case 'MARKED_FOR_REVIEW':
        return base + 'bg-purple-600 text-white border-purple-700 shadow-sm';
      case 'ANSWERED_AND_MARKED':
        return base + 'bg-purple-700 text-white border-purple-800 shadow-sm';
      case 'NOT_VISITED':
      default:
        return base + 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-3 bg-slate-900 text-white border-b border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Question Palette</h3>
        <p className="text-[11px] text-slate-400">Click a number to navigate directly</p>
      </div>

      {/* Legend */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 grid grid-cols-2 gap-2 text-[11px] text-slate-700">
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
            {counts.answered}
          </span>
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
            {counts.notAnswered}
          </span>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-purple-600 text-white text-[9px] font-bold flex items-center justify-center">
            {counts.marked}
          </span>
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-4 rounded bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center border border-slate-300">
            {counts.notVisited}
          </span>
          <span>Not Visited</span>
        </div>
      </div>

      {/* Number Matrix */}
      <div className="p-3 flex-1 overflow-y-auto">
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const status = questionStatuses[index] || 'NOT_VISITED';
            const isCurrent = index === currentIndex;

            return (
              <button
                key={index}
                onClick={() => onSelectQuestion(index)}
                className={`h-9 w-full ${getButtonStyles(status, isCurrent)}`}
              >
                {index + 1}
                {status === 'ANSWERED_AND_MARKED' && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
        Attempted: <span className="font-bold text-emerald-700">{counts.answered + counts.answeredAndMarked}</span> / {totalQuestions}
      </div>
    </div>
  );
}
