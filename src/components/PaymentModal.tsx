'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Loader2,
  AlertCircle 
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    id: string;
    title: string;
    type: 'TEST' | 'COURSE';
    price: number;
    description?: string;
  };
  user?: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function PaymentModal({ isOpen, onClose, item, user }: PaymentModalProps) {
  const router = useRouter();
  const [gateway, setGateway] = useState<'SANDBOX' | 'RAZORPAY' | 'STRIPE'>('SANDBOX');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!user) {
      router.push(`/login?redirect=/tests`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: item.type === 'TEST' ? item.id : undefined,
          courseId: item.type === 'COURSE' ? item.id : undefined,
          gateway,
          amount: item.price,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Payment initialization failed');
      }

      setPaymentSuccess(data.payment);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong while processing payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-600 to-indigo-700 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-brand-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" /> 256-Bit SSL Encrypted Checkout
          </div>
          <h2 className="text-xl font-bold">{paymentSuccess ? 'Payment Successful!' : 'Enrollment & Checkout'}</h2>
          <p className="text-sm text-brand-100 mt-1">
            {paymentSuccess ? 'Access has been unlocked instantly.' : 'Complete payment to access premium mock tests & solutions.'}
          </p>
        </div>

        <div className="p-6">
          {paymentSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Enrolled Successfully!</h3>
                <p className="text-sm text-slate-500 mt-1">Invoice #{paymentSuccess.invoiceNumber}</p>
                <p className="text-xs text-slate-400 mt-0.5">Txn ID: {paymentSuccess.paymentId}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item:</span>
                  <span className="font-semibold text-slate-800">{item.title}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(item.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-semibold text-emerald-600">Active / Granted</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {item.type === 'TEST' ? (
                  <button
                    onClick={() => {
                      onClose();
                      router.push(`/test/${item.id}/take`);
                    }}
                    className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Start Mock Test Now
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      router.push(`/dashboard`);
                    }}
                    className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md transition-colors"
                  >
                    Go to Student Dashboard
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full py-2 px-4 text-xs text-slate-500 hover:text-slate-700 font-medium"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Order Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-brand-100 text-brand-700 mb-1">
                      {item.type === 'TEST' ? 'Mock Test Series' : 'Course Access'}
                    </span>
                    <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">{item.title}</h4>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-slate-900">{formatCurrency(item.price)}</span>
                    <span className="block text-[10px] text-slate-500">Incl. all taxes</span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 block">
                  Select Payment Method
                </label>
                
                <div className="space-y-2">
                  {/* Sandbox Instant Checkout */}
                  <label
                    onClick={() => setGateway('SANDBOX')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      gateway === 'SANDBOX'
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center">
                        <Zap className="w-4 h-4 text-amber-300" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                          Instant Demo Checkout
                          <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                            Fast & Free Test
                          </span>
                        </p>
                        <p className="text-xs text-slate-500">1-Click simulated payment for testing & verification</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="gateway"
                      checked={gateway === 'SANDBOX'}
                      onChange={() => setGateway('SANDBOX')}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                  </label>

                  {/* Razorpay Gateway */}
                  <label
                    onClick={() => setGateway('RAZORPAY')}
                    className={`flex items-center justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      gateway === 'RAZORPAY'
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">Razorpay (UPI, Cards, Netbanking)</p>
                        <p className="text-xs text-slate-500">Instant UPI QR, GPay, Paytm, Cards</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="gateway"
                      checked={gateway === 'RAZORPAY'}
                      onChange={() => setGateway('RAZORPAY')}
                      className="text-brand-600 focus:ring-brand-500"
                    />
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!user && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You need to sign in or register to complete your enrollment.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing Payment...
                  </>
                ) : user ? (
                  <>
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                    Pay {formatCurrency(item.price)} & Unlock
                  </>
                ) : (
                  'Login to Pay & Enroll'
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                Guaranteed full access with instant scorecard & solution keys.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
