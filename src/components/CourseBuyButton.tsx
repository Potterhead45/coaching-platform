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
        className="px-6 py-3.5 rounded-2xl font-bold bg-[#964734] hover:bg-[#833B2B] text-white transition-all hover:scale-105 shadow-md shadow-[#964734]/25 flex items-center gap-2 text-xs sm:text-sm shrink-0"
      >
        <Sparkles className="w-4 h-4 text-[#AFDDE5]" />
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
