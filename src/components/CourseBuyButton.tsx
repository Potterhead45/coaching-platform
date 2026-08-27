'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import PaymentModal from '@/components/PaymentModal';

interface CourseBuyButtonProps {
  course: {
    id: string;
    title: string;
    price: number;
  };
  user?: any;
}

export default function CourseBuyButton({ course, user }: CourseBuyButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-6 py-3 rounded-xl font-bold bg-brand-500 hover:bg-brand-400 text-slate-950 transition-all hover:scale-105 shadow-md flex items-center gap-2 text-sm shrink-0"
      >
        <Sparkles className="w-4 h-4 text-amber-900" />
        Enroll in Course
      </button>

      <PaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        item={{
          id: course.id,
          title: course.title,
          type: 'COURSE',
          price: course.price,
        }}
        user={user}
      />
    </>
  );
}
