'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Search, 
  Clock, 
  HelpCircle, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  Filter 
} from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import PaymentModal from './PaymentModal';
import { StaggerContainer, StaggerItem, HoverCard } from '@/components/motion/MotionWrapper';

interface TestCatalogViewProps {
  initialTests: any[];
  purchasedTestIds: string[];
  user?: any;
}

export default function TestCatalogView({
  initialTests,
  purchasedTestIds,
  user,
}: TestCatalogViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTestToBuy, setSelectedTestToBuy] = useState<any | null>(null);

  const categories = ['ALL', 'Full Mock', 'Diagnostic', 'Chapter Test'];

  const filteredTests = initialTests.filter((test) => {
    const matchesCategory =
      selectedCategory === 'ALL' || test.category === selectedCategory;
    const matchesSearch =
      test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (test.course?.title && test.course.title.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#AFDDE5]/60 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[#024950] text-white shadow-md shadow-[#024950]/20 scale-[1.02]'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Tests' : cat}
            </button>
          ))}
        </div>

        {/* Search Box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic, test, or exam..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#024950] text-xs bg-slate-50 transition-all"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredTests.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3 shadow-sm">
          <p className="text-slate-500 text-sm">No mock tests found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-bold text-[#024950] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <StaggerContainer staggerChildren={0.06} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isPurchased = purchasedTestIds.includes(test.id);
            const canTakeDirectly = test.isFree || test.price <= 0 || isPurchased;

            return (
              <StaggerItem key={test.id}>
                <HoverCard hoverY={-5}>
                  <div
                    className="bg-white rounded-3xl border border-[#AFDDE5]/70 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group hover:border-[#0FA4AF] h-full"
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-[#AFDDE5]/30 text-[#024950] border border-[#AFDDE5]">
                          {test.category}
                        </span>

                        {test.isFree ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            FREE
                          </span>
                        ) : isPurchased ? (
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                          </span>
                        ) : (
                          <span className="text-base font-extrabold text-[#964734]">
                            {formatCurrency(test.price)}
                          </span>
                        )}
                      </div>

                      <div>
                        {test.course && (
                          <p className="text-[11px] font-semibold text-[#0FA4AF] mb-1">
                            {test.course.targetExam} • {test.course.title}
                          </p>
                        )}
                        <h3 className="font-bold text-[#003135] text-lg group-hover:text-[#0FA4AF] transition-colors line-clamp-2">
                          {test.title}
                        </h3>
                        <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                          {test.description}
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] text-[#024950] font-semibold">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[#0FA4AF]" />
                          <span>{formatDuration(test.durationMinutes)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-[#0FA4AF]" />
                          <span>{test._count?.questions || 0} Questions</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-[#0FA4AF]" />
                          <span>{test.totalMarks} Marks</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      {canTakeDirectly ? (
                        <Link
                          href={`/test/${test.id}/take`}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#024950] hover:bg-[#003135] text-white transition-all shadow-sm hover:scale-[1.01]"
                        >
                          <span>{test.isFree ? 'Start Free Mock Test' : 'Launch Mock Test'}</span>
                          <ArrowRight className="w-4 h-4 text-[#AFDDE5]" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => setSelectedTestToBuy(test)}
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-[#964734] hover:bg-[#833B2B] text-white transition-all shadow-md shadow-[#964734]/20 hover:scale-[1.01]"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#AFDDE5]" />
                          <span>Unlock for {formatCurrency(test.price)}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      )}

      {/* Payment Checkout Modal */}
      {selectedTestToBuy && (
        <PaymentModal
          isOpen={!!selectedTestToBuy}
          onClose={() => setSelectedTestToBuy(null)}
          item={{
            id: selectedTestToBuy.id,
            title: selectedTestToBuy.title,
            type: 'TEST',
            price: selectedTestToBuy.price,
            description: selectedTestToBuy.description,
          }}
          user={user}
        />
      )}
    </div>
  );
}
