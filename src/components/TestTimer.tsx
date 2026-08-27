'use client';

import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface TestTimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
}

export default function TestTimer({ initialSeconds, onTimeUp }: TestTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);

  useEffect(() => {
    if (secondsLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsLeft, onTimeUp]);

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  const isLowTime = secondsLeft < 300; // Less than 5 minutes

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm transition-all ${
        isLowTime
          ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
          : 'bg-slate-900 text-amber-300 border-slate-700 shadow-inner'
      }`}
    >
      {isLowTime ? (
        <AlertTriangle className="w-4 h-4 text-red-500 animate-bounce" />
      ) : (
        <Clock className="w-4 h-4 text-amber-400" />
      )}
      <span className="tracking-wider">
        {hours > 0 ? `${hours.toString().padStart(2, '0')}:` : ''}
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
      <span className="text-[10px] font-sans uppercase font-medium text-slate-400">Time Left</span>
    </div>
  );
}
