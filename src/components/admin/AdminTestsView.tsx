'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  FileQuestion, 
  Trash2, 
  Clock, 
  HelpCircle, 
  Award, 
  X, 
  Loader2, 
  Check, 
  Sparkles,
  BookOpen,
  Layers,
  ChevronDown
} from 'lucide-react';
import { formatCurrency, formatDuration } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface AdminTestsViewProps {
  initialTests: any[];
  courses: any[];
}

export default function AdminTestsView({ initialTests, courses }: AdminTestsViewProps) {
  const router = useRouter();
  const [tests, setTests] = useState<any[]>(initialTests);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTestForQuestions, setSelectedTestForQuestions] = useState<any | null>(null);
  const [isAddQuestionModalOpen, setIsAddQuestionModalOpen] = useState(false);
  const [activeTestForNewQ, setActiveTestForNewQ] = useState<any | null>(null);

  // New Test Form State
  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    category: 'Full Mock',
    courseId: '',
    chapterId: '',
    durationMinutes: 60,
    totalMarks: 100,
    positiveMarks: 4,
    negativeMarks: 1,
    passingMarks: 40,
    isFree: false,
    price: 499,
  });
  const [creatingTest, setCreatingTest] = useState(false);

  // New Question Form State
  const [questionForm, setQuestionForm] = useState({
    questionText: '',
    subject: 'Physics',
    positiveMarks: 4,
    negativeMarks: 1,
    explanation: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctOption: 'A',
  });
  const [creatingQuestion, setCreatingQuestion] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Stats calculation
  const totalTests = tests.length;
  const totalQuestions = tests.reduce((acc, t) => acc + (t._count?.questions || 0), 0);
  const totalAttempts = tests.reduce((acc, t) => acc + (t._count?.attempts || 0), 0);
  const paidTestsCount = tests.filter((t) => !t.isFree && t.price > 0).length;

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingTest(true);

    try {
      const res = await fetch('/api/admin/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create test');

      setTests([
        {
          ...data.mockTest,
          questions: [],
          _count: { questions: 0, attempts: 0 },
        },
        ...tests,
      ]);
      setIsCreateModalOpen(false);
      setTestForm({
        title: '',
        description: '',
        category: 'Full Mock',
        courseId: '',
        chapterId: '',
        durationMinutes: 60,
        totalMarks: 100,
        positiveMarks: 4,
        negativeMarks: 1,
        passingMarks: 40,
        isFree: false,
        price: 499,
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error creating test');
    } finally {
      setCreatingTest(false);
    }
  };

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTestForNewQ) return;
    setCreatingQuestion(true);

    const optionsPayload = [
      { label: 'A', text: questionForm.optionA, isCorrect: questionForm.correctOption === 'A' },
      { label: 'B', text: questionForm.optionB, isCorrect: questionForm.correctOption === 'B' },
      { label: 'C', text: questionForm.optionC, isCorrect: questionForm.correctOption === 'C' },
      { label: 'D', text: questionForm.optionD, isCorrect: questionForm.correctOption === 'D' },
    ];

    try {
      const res = await fetch('/api/admin/questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: activeTestForNewQ.id,
          questionText: questionForm.questionText,
          subject: questionForm.subject,
          positiveMarks: questionForm.positiveMarks,
          negativeMarks: questionForm.negativeMarks,
          explanation: questionForm.explanation,
          options: optionsPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add question');

      // Update tests state
      setTests((prev) =>
        prev.map((t) => {
          if (t.id === activeTestForNewQ.id) {
            return {
              ...t,
              questions: [...(t.questions || []), data.question],
              _count: { ...t._count, questions: (t._count?.questions || 0) + 1 },
            };
          }
          return t;
        })
      );

      setIsAddQuestionModalOpen(false);
      setQuestionForm({
        questionText: '',
        subject: 'Physics',
        positiveMarks: 4,
        negativeMarks: 1,
        explanation: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctOption: 'A',
      });
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error adding question');
    } finally {
      setCreatingQuestion(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!confirm('Are you sure you want to delete this mock test? This will also remove all questions and past attempts.')) {
      return;
    }

    setDeletingId(testId);
    try {
      const res = await fetch(`/api/admin/tests?id=${testId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete test');
      setTests((prev) => prev.filter((t) => t.id !== testId));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'Error deleting test');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards for Test Details */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Mock Tests</span>
          <h3 className="text-2xl font-black text-slate-900">{totalTests}</h3>
          <p className="text-xs text-brand-600 font-semibold">Active in Catalog</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Questions Bank</span>
          <h3 className="text-2xl font-black text-purple-700">{totalQuestions}</h3>
          <p className="text-xs text-purple-600 font-semibold">With Step Explanations</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Total Test Attempts</span>
          <h3 className="text-2xl font-black text-emerald-700">{totalAttempts}</h3>
          <p className="text-xs text-emerald-600 font-semibold">Student Submissions</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Paid Test Series</span>
          <h3 className="text-2xl font-black text-amber-600">{paidTestsCount}</h3>
          <p className="text-xs text-amber-600 font-semibold">{totalTests - paidTestsCount} Free Diagnostic</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">All Mock Tests & Question Banks</h3>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> Create New Mock Test
        </button>
      </div>

      {/* Tests Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="p-4">Test Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Marks & Scheme</th>
                <th className="p-4">Questions Count</th>
                <th className="p-4">Student Attempts</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No mock tests created yet. Click "Create New Mock Test" above.
                  </td>
                </tr>
              ) : (
                tests.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-bold text-slate-900 text-sm line-clamp-1">{t.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{t.description}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-brand-50 text-brand-700 border border-brand-200">
                        {t.category}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-slate-800">
                      {formatDuration(t.durationMinutes)}
                    </td>

                    <td className="p-4">
                      <span className="font-bold text-slate-900">{t.totalMarks} Marks</span>
                      <span className="block text-[10px] text-slate-500">
                        +{t.positiveMarks} / -{t.negativeMarks}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-purple-700 text-sm">
                        {t._count?.questions || t.questions?.length || 0}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Questions</span>
                    </td>

                    <td className="p-4">
                      <span className="font-extrabold text-emerald-700 text-sm">
                        {t._count?.attempts || 0}
                      </span>
                      <span className="text-[10px] text-slate-500 block">Submissions</span>
                    </td>

                    <td className="p-4">
                      {t.isFree ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          FREE
                        </span>
                      ) : (
                        <span className="font-black text-slate-900">{formatCurrency(t.price)}</span>
                      )}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setActiveTestForNewQ(t);
                            setIsAddQuestionModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          title="Add Questions with explanations"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Qs
                        </button>

                        <button
                          onClick={() => setSelectedTestForQuestions(t)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                          title="View Questions"
                        >
                          View ({t.questions?.length || t._count?.questions || 0})
                        </button>

                        <button
                          onClick={() => handleDeleteTest(t.id)}
                          disabled={deletingId === t.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Mock Test"
                        >
                          {deletingId === t.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Mock Test Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  New Test Series
                </span>
                <h3 className="text-xl font-bold">Create Online Mock Test</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTest} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Test Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. JEE Advanced Full Mock Test 02"
                  value={testForm.title}
                  onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Description *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Details regarding syllabus, target exam, and pattern..."
                  value={testForm.description}
                  onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Category</label>
                  <select
                    value={testForm.category}
                    onChange={(e) => setTestForm({ ...testForm, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Full Mock">Full Mock</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Chapter Test">Chapter Test</option>
                    <option value="Topic Test">Topic Test</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min={5}
                    value={testForm.durationMinutes}
                    onChange={(e) => setTestForm({ ...testForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={testForm.totalMarks}
                    onChange={(e) => setTestForm({ ...testForm, totalMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Mark / Right (+)</label>
                  <input
                    type="number"
                    value={testForm.positiveMarks}
                    onChange={(e) => setTestForm({ ...testForm, positiveMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Negative Mark (-)</label>
                  <input
                    type="number"
                    value={testForm.negativeMarks}
                    onChange={(e) => setTestForm({ ...testForm, negativeMarks: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isFreeCheckbox"
                    checked={testForm.isFree}
                    onChange={(e) => setTestForm({ ...testForm, isFree: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded"
                  />
                  <label htmlFor="isFreeCheckbox" className="font-bold text-slate-800 cursor-pointer">
                    Offer this Mock Test for FREE
                  </label>
                </div>

                {!testForm.isFree && (
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Price (₹ INR)</label>
                    <input
                      type="number"
                      min={1}
                      value={testForm.price}
                      onChange={(e) => setTestForm({ ...testForm, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingTest}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow flex items-center gap-2"
                >
                  {creatingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Mock Test'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Question Modal */}
      {isAddQuestionModalOpen && activeTestForNewQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-300">
                  Question Bank Builder
                </span>
                <h3 className="text-xl font-bold">Add Question to "{activeTestForNewQ.title}"</h3>
              </div>
              <button
                onClick={() => setIsAddQuestionModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1">Subject Tag</label>
                  <input
                    type="text"
                    required
                    placeholder="Physics / Chemistry / Mathematics / Biology / Logic"
                    value={questionForm.subject}
                    onChange={(e) => setQuestionForm({ ...questionForm, subject: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Positive (+)</label>
                    <input
                      type="number"
                      value={questionForm.positiveMarks}
                      onChange={(e) => setQuestionForm({ ...questionForm, positiveMarks: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">Negative (-)</label>
                    <input
                      type="number"
                      value={questionForm.negativeMarks}
                      onChange={(e) => setQuestionForm({ ...questionForm, negativeMarks: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">Question Text *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter full question statement, problem statement, or mathematical formula..."
                  value={questionForm.questionText}
                  onChange={(e) => setQuestionForm({ ...questionForm, questionText: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              {/* 4 Options */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase">
                  Options & Correct Answer (Select radio button for the correct option)
                </label>

                {[
                  { label: 'A', key: 'optionA' },
                  { label: 'B', key: 'optionB' },
                  { label: 'C', key: 'optionC' },
                  { label: 'D', key: 'optionD' },
                ].map(({ label, key }) => (
                  <div key={label} className="flex items-center gap-3">
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="radio"
                        name="correctOption"
                        value={label}
                        checked={questionForm.correctOption === label}
                        onChange={(e) => setQuestionForm({ ...questionForm, correctOption: e.target.value })}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                        questionForm.correctOption === label
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-200 text-slate-700'
                      }`}>
                        {label}
                      </span>
                    </label>

                    <input
                      type="text"
                      required
                      placeholder={`Option ${label} text...`}
                      value={(questionForm as any)[key]}
                      onChange={(e) => setQuestionForm({ ...questionForm, [key]: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Step-by-Step Explanation */}
              <div className="p-4 bg-brand-50/70 border border-brand-200 rounded-2xl space-y-1.5">
                <label className="block font-bold text-brand-900 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Detailed Step-by-Step Explanation & Error Solution *
                </label>
                <p className="text-[11px] text-slate-500">
                  This explanation will be shown to students whenever they answer incorrectly to teach them the correct steps and formula.
                </p>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain formula, derivation, step-by-step logic, and why other options are incorrect..."
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-300 text-sm bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddQuestionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingQuestion}
                  className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow flex items-center gap-2"
                >
                  {creatingQuestion ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Question to Bank'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Questions Modal */}
      {selectedTestForQuestions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Question Bank Review
                </span>
                <h3 className="text-xl font-bold">{selectedTestForQuestions.title}</h3>
              </div>
              <button
                onClick={() => setSelectedTestForQuestions(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {(!selectedTestForQuestions.questions || selectedTestForQuestions.questions.length === 0) ? (
                <div className="p-12 text-center text-slate-400 space-y-2">
                  <p>No questions added to this mock test yet.</p>
                  <button
                    onClick={() => {
                      setActiveTestForNewQ(selectedTestForQuestions);
                      setIsAddQuestionModalOpen(true);
                      setSelectedTestForQuestions(null);
                    }}
                    className="px-4 py-2 bg-brand-600 text-white font-bold rounded-xl text-xs"
                  >
                    Add First Question Now
                  </button>
                </div>
              ) : (
                selectedTestForQuestions.questions.map((q: any, idx: number) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">
                        Q{idx + 1}. {q.subject && `[${q.subject}]`}
                      </span>
                      <span className="text-slate-500 font-semibold">
                        +{q.positiveMarks} / -{q.negativeMarks} Marks
                      </span>
                    </div>

                    <p className="text-slate-800 text-sm font-medium">{q.questionText}</p>

                    <div className="grid grid-cols-2 gap-2">
                      {q.options?.map((opt: any) => (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center gap-2 ${
                            opt.isCorrect
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            opt.isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {opt.optionLabel}
                          </span>
                          <span>{opt.optionText}</span>
                          {opt.isCorrect && <Check className="w-3.5 h-3.5 text-emerald-600 ml-auto" />}
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600">
                      <strong className="text-brand-900 block mb-0.5">Solution:</strong>
                      {q.explanation}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTestForQuestions(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                Close Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
