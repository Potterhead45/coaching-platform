'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Zap, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Loader2,
  AlertCircle,
  QrCode,
  ArrowRight
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
    phone?: string | null;
  } | null;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

export default function PaymentModal({ isOpen, onClose, item, user }: PaymentModalProps) {
  const router = useRouter();
  const [gateway, setGateway] = useState<'RAZORPAY' | 'SANDBOX'>('RAZORPAY');
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'IDLE' | 'INITIATING' | 'CHECKOUT_OPEN' | 'VERIFYING' | 'SUCCESS'>('IDLE');
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<any | null>(null);

  // Dynamically load Razorpay SDK
  useEffect(() => {
    if (typeof window === 'undefined' || window.Razorpay) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // Keep script cached in DOM for subsequent checkouts
    };
  }, []);

  if (!isOpen) return null;

  const handlePay = async () => {
    if (!user) {
      router.push(`/login?redirect=/tests`);
      return;
    }

    setLoading(true);
    setError(null);
    setPaymentStep('INITIATING');

    try {
      // 1. Create order on the server
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockTestId: item.type === 'TEST' ? item.id : undefined,
          courseId: item.type === 'COURSE' ? item.id : undefined,
          gateway,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment order.');
      }

      const { order, user: userInfo } = orderData;

      // 2. Check if running in Sandbox mode or real Razorpay mode
      if (order.isSandbox || gateway === 'SANDBOX' || !order.keyId || order.keyId.startsWith('rzp_test_sandbox')) {
        // Simulated verified transaction
        setPaymentStep('VERIFYING');
        const simTxnId = `pay_dev_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        const verifyRes = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            paymentId: simTxnId,
            signature: 'sandbox_verified_signature',
            mockTestId: item.type === 'TEST' ? item.id : undefined,
            courseId: item.type === 'COURSE' ? item.id : undefined,
          }),
        });

        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) {
          throw new Error(verifyData.error || 'Payment verification failed.');
        }

        setPaymentSuccess(verifyData.payment);
        setPaymentStep('SUCCESS');
        router.refresh();
        return;
      }

      // 3. Open Real Razorpay Checkout Modal
      if (!window.Razorpay) {
        throw new Error('Razorpay Checkout SDK is loading. Please check your internet connection and try again.');
      }

      setPaymentStep('CHECKOUT_OPEN');

      const options = {
        key: order.keyId,
        amount: Math.round(order.amount * 100),
        currency: order.currency || 'INR',
        name: 'Apex Academy & CBT Hub',
        description: `Enrollment: ${item.title}`,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&q=80',
        order_id: order.id,
        prefill: {
          name: userInfo?.name || user.name,
          email: userInfo?.email || user.email,
          contact: userInfo?.phone || '',
        },
        theme: {
          color: '#024950', // Rich Ocean Teal brand color
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setPaymentStep('IDLE');
          },
        },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          setPaymentStep('VERIFYING');
          try {
            // 4. Cryptographic Server Verification
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                mockTestId: item.type === 'TEST' ? item.id : undefined,
                courseId: item.type === 'COURSE' ? item.id : undefined,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Cryptographic payment verification failed.');
            }

            setPaymentSuccess(verifyData.payment);
            setPaymentStep('SUCCESS');
            router.refresh();
          } catch (verifyErr: any) {
            console.error('Verification error:', verifyErr);
            setError(verifyErr.message || 'Payment signature verification failed.');
            setPaymentStep('IDLE');
          } finally {
            setLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (failResponse: any) => {
        console.error('Payment failed:', failResponse);
        setError(failResponse.error?.description || 'Payment was unsuccessful or cancelled by bank.');
        setLoading(false);
        setPaymentStep('IDLE');
      });

      rzp.open();
    } catch (err: any) {
      console.error('Payment flow error:', err);
      setError(err.message || 'Something went wrong while initiating checkout.');
      setLoading(false);
      setPaymentStep('IDLE');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 10 }}
        transition={{ duration: 0.25, ease: [0.215, 0.61, 0.355, 1] }}
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#AFDDE5]/60 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-[#003135] via-[#024950] to-[#003135] p-6 text-white relative border-b border-[#0FA4AF]/30">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-[#AFDDE5] text-xs font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5 text-[#0FA4AF]" /> 256-Bit SSL Encrypted Checkout
          </div>
          <h2 className="text-xl font-extrabold text-white">
            {paymentSuccess ? 'Payment Verified & Unlocked!' : 'Enrollment & Checkout'}
          </h2>
          <p className="text-xs text-[#AFDDE5]/90 mt-1">
            {paymentSuccess
              ? 'Your test access has been unlocked in the database.'
              : 'Complete payment to access CBT exam interface, timer & solutions.'}
          </p>
        </div>

        <div className="p-6">
          {paymentSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-4 py-2"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Access Granted!</h3>
                <p className="text-xs text-slate-500 mt-1 font-mono">Invoice #{paymentSuccess.invoiceNumber}</p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Txn ID: {paymentSuccess.paymentId}</p>
              </div>

              <div className="bg-[#AFDDE5]/15 rounded-2xl p-4 text-left border border-[#AFDDE5]/60 space-y-2 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Item:</span>
                  <span className="font-bold text-slate-900 text-right line-clamp-1">{item.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid:</span>
                  <span className="font-black text-[#964734]">{formatCurrency(item.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Confirmed & Active
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                {item.type === 'TEST' ? (
                  <button
                    onClick={() => {
                      onClose();
                      router.push(`/test/${item.id}/take`);
                    }}
                    className="w-full py-3.5 px-4 bg-[#964734] hover:bg-[#833B2B] text-white font-bold rounded-xl shadow-lg shadow-[#964734]/25 transition-all flex items-center justify-center gap-2 text-sm"
                  >
                    <Sparkles className="w-4 h-4 text-[#AFDDE5]" />
                    Launch Mock Test Now
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onClose();
                      router.push(`/dashboard`);
                    }}
                    className="w-full py-3.5 px-4 bg-[#024950] hover:bg-[#003135] text-white font-bold rounded-xl shadow-md transition-colors text-sm"
                  >
                    Go to Student Dashboard
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="w-full py-2 text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-5">
              {/* Order Summary */}
              <div className="bg-[#AFDDE5]/15 p-4 rounded-2xl border border-[#AFDDE5]/60">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-[#024950] text-[#AFDDE5] mb-1">
                      {item.type === 'TEST' ? 'Mock Test Series' : 'Course Curriculum'}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-2">{item.title}</h4>
                  </div>
                  <div className="text-right shrink-0 pl-3">
                    <span className="text-xl font-black text-[#964734]">{formatCurrency(item.price)}</span>
                    <span className="block text-[10px] text-slate-500">All Taxes Included</span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Options */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 block">
                  Select Payment Method
                </label>
                
                <div className="space-y-2.5">
                  {/* Razorpay Gateway (Primary Production Gateway) */}
                  <label
                    onClick={() => setGateway('RAZORPAY')}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      gateway === 'RAZORPAY'
                        ? 'border-[#024950] bg-[#AFDDE5]/20 shadow-sm ring-1 ring-[#024950]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#024950] text-[#AFDDE5] flex items-center justify-center shrink-0">
                        <CreditCard className="w-5 h-5 text-[#0FA4AF]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          Razorpay Gateway
                          <span className="text-[10px] bg-[#964734]/15 text-[#964734] font-bold px-1.5 py-0.2 rounded">
                            UPI / Cards / Netbanking
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, QR, Cards, EMI</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="gateway"
                      checked={gateway === 'RAZORPAY'}
                      onChange={() => setGateway('RAZORPAY')}
                      className="text-[#024950] focus:ring-[#024950]"
                    />
                  </label>

                  {/* Sandbox Dev Mode (Available if test mode is desired) */}
                  <label
                    onClick={() => setGateway('SANDBOX')}
                    className={`flex items-center justify-between p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                      gateway === 'SANDBOX'
                        ? 'border-[#0FA4AF] bg-[#AFDDE5]/20 shadow-sm ring-1 ring-[#0FA4AF]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0FA4AF]/20 text-[#0FA4AF] flex items-center justify-center shrink-0">
                        <Zap className="w-4 h-4 text-[#024950]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          Development Sandbox Verification
                        </p>
                        <p className="text-[10px] text-slate-500">Simulate order creation & verification without live charge</p>
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="gateway"
                      checked={gateway === 'SANDBOX'}
                      onChange={() => setGateway('SANDBOX')}
                      className="text-[#024950] focus:ring-[#024950]"
                    />
                  </label>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {!user && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>You must be signed in to complete your checkout and save your test records.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handlePay}
                disabled={loading}
                className="w-full py-3.5 px-4 bg-[#964734] hover:bg-[#833B2B] text-white font-bold rounded-2xl shadow-xl shadow-[#964734]/25 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 hover:scale-[1.01]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {paymentStep === 'INITIATING' && 'Creating Order...'}
                      {paymentStep === 'CHECKOUT_OPEN' && 'Waiting for Payment...'}
                      {paymentStep === 'VERIFYING' && 'Verifying Signature...'}
                      {paymentStep === 'IDLE' && 'Processing...'}
                    </span>
                  </>
                ) : user ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#AFDDE5]" />
                    Pay {formatCurrency(item.price)} & Unlock
                  </>
                ) : (
                  'Login to Pay & Unlock'
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-center text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant server-side verification and CBT test console access.</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
