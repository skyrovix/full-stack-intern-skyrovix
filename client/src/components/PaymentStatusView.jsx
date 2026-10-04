import React, { useEffect, useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MessageCircle, 
  ArrowRight, 
  RotateCw, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { WhatsAppIcon } from './BrandIcons';

export const PaymentStatusView = ({
  orderId,
  initialStatus,
  onGoToDashboard,
  onRetryPayment,
  onBackToHome,
  whatsappUrl
}) => {
  const [loading, setLoading] = useState(true);
  const [verificationData, setVerificationData] = useState(null);
  const [status, setStatus] = useState(initialStatus || 'PENDING');
  const [refreshCount, setRefreshCount] = useState(0);

  // Trigger server-side verification strictly (never trust URL alone)
  const verifyPaymentServerSide = async () => {
    if (!orderId) {
      setLoading(false);
      setStatus('FAILED');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId })
      });

      const data = await response.json();
      setLoading(false);
      setVerificationData(data);

      if (data.verified && (data.payment_status === 'SUCCESS' || data.registration_status === 'CONFIRMED')) {
        setStatus('SUCCESS');
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else if (data.payment_status === 'FAILED') {
        setStatus('FAILED');
      } else {
        setStatus('PENDING');
      }
    } catch (err) {
      setLoading(false);
      console.error('Payment verification error:', err);
      setStatus('PENDING');
    }
  };

  useEffect(() => {
    verifyPaymentServerSide();
  }, [orderId, refreshCount]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4" />
        <h3 className="text-xl font-bold text-slate-900">Verifying Payment With Cashfree...</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Please wait while our server securely verifies your transaction status directly with the payment gateway.
        </p>
      </div>
    );
  }

  // ==========================================
  // 1. SUCCESS STATE
  // ==========================================
  if (status === 'SUCCESS') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-12 space-y-6">
          
          {/* Confetti & Success Badge */}
          <div className="w-20 h-20 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-700 tracking-wider uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Payment Verified Server-Side
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight pt-2">
              🎉 Registration Successful!
            </h2>
            <p className="text-slate-600 text-sm">
              Welcome to <strong>SKYROVIX BATCH 1</strong>
            </p>
          </div>

          {/* Program Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white text-left space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs font-bold text-sky-400">
              <span>BATCH 1 ENROLLMENT</span>
              <span className="bg-emerald-500 text-slate-950 px-2 py-0.5 rounded text-[10px] font-black">
                CONFIRMED
              </span>
            </div>
            <h3 className="text-lg font-bold text-white leading-snug">
              3-Month Full Stack Development Internship
            </h3>
            
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Payment Amount</span>
                <span className="text-emerald-400 font-extrabold text-sm">₹200 — PAID</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Registration Status</span>
                <span className="text-white font-extrabold text-sm">CONFIRMED</span>
              </div>
            </div>

            {verificationData?.student?.full_name && (
              <div className="pt-2 text-xs text-slate-300">
                Registered Intern: <strong>{verificationData.student.full_name}</strong>
              </div>
            )}
          </div>

          {/* NEXT STEP: WhatsApp Group */}
          <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-left space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <h4 className="text-base font-extrabold text-emerald-950">
                NEXT STEP: Join the Official Batch 1 WhatsApp Group
              </h4>
            </div>

            <p className="text-xs text-emerald-800 leading-relaxed font-medium">
              "Your exact internship start date, schedule and further instructions will be shared in the official WhatsApp group."
            </p>

            <a
              href={verificationData?.whatsapp_group_url || whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>JOIN OFFICIAL WHATSAPP GROUP</span>
            </a>
          </div>

          {/* Dashboard Button */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => onGoToDashboard(verificationData?.student?.id)}
              className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>OPEN STUDENT DASHBOARD</span>
            </button>
            <button
              onClick={onBackToHome}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              Back to Home
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // 2. FAILED STATE
  // ==========================================
  if (status === 'FAILED') {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <XCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900">
              Payment Unsuccessful
            </h2>
            <p className="text-sm text-slate-600">
              Your registration payment could not be completed or was cancelled.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 text-left space-y-1">
            <p className="font-bold">Notice:</p>
            <p>
              Your registration has not been marked as confirmed. No charges have been deducted, or any deducted funds will be refunded by your bank within standard banking timelines.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={onRetryPayment}
              className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs transition-colors"
            >
              TRY PAYMENT AGAIN
            </button>
            <button
              onClick={onBackToHome}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
            >
              BACK TO REGISTRATION
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. PENDING STATE
  // ==========================================
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
          <Clock className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black text-slate-900">
            Payment Verification Pending
          </h2>
          <p className="text-sm text-slate-600">
            Your payment is currently being confirmed by the payment gateway and your bank.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-left">
          Registration confirmation will be finalized as soon as the bank settles the transaction. Please do not re-submit payment immediately.
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => setRefreshCount(c => c + 1)}
            className="flex-1 py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4" />
            <span>Refresh Payment Status</span>
          </button>
          <button
            onClick={onBackToHome}
            className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
