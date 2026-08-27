'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
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
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-xs bg-slate-50"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredTests.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-slate-500 text-sm">No mock tests found matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-bold text-brand-600 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTests.map((test) => {
            const isPurchased = purchasedTestIds.includes(test.id);
            const canTakeDirectly = test.isFree || test.price <= 0 || isPurchased;

            return (
              <div
                key={test.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                      {test.category}
                    </span>

                    {test.isFree ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        FREE
                      </span>
                    ) : isPurchased ? (
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> UNLOCKED
                      </span>
                    ) : (
                      <span className="text-base font-extrabold text-slate-900">
                        {formatCurrency(test.price)}
                      </span>
                    )}
                  </div>

                  <div>
                    {test.course && (
                      <p className="text-[11px] font-semibold text-brand-600 mb-1">
                        {test.course.targetExam} • {test.course.title}
                      </p>
                    )}
                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-brand-600 transition-colors line-clamp-2">
                      {test.title}
                    </h3>
                    <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDuration(test.durationMinutes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test._count.questions} Questions</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>{test.totalMarks} Marks</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {canTakeDirectly ? (
                    <Link
                      href={`/test/${test.id}/take`}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-slate-900 hover:bg-brand-600 text-white transition-all shadow-sm"
                    >
                      <span>{test.isFree ? 'Start Free Mock Test' : 'Launch Mock Test'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <button
                      onClick={() => setSelectedTestToBuy(test)}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white transition-all shadow-md shadow-brand-500/20"
                    >
                      <Lock className="w-3.5 h-3.5 text-amber-300" />
                      <span>Unlock for {formatCurrency(test.price)}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
