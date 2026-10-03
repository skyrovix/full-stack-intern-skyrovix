import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Building2, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  QrCode
} from 'lucide-react';

export const CashfreeModal = ({
  isOpen,
  onClose,
  orderDetails,
  onPaymentSuccess,
  onPaymentFailed,
  onPaymentPending
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Real Cashfree Web SDK checkout trigger
  const handleProceedRealCashfree = (target = '_modal') => {
    if (!orderDetails?.payment_session_id) {
      setErrorMessage('Payment session could not be established. Please retry.');
      return;
    }

    if (!window.Cashfree) {
      console.warn('Cashfree SDK is initializing in window...');
      alert('Cashfree payment gateway is initializing. Please try again in a few seconds.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    try {
      const mode = orderDetails.cashfree_mode === 'production' ? 'production' : 'sandbox';
      const cashfree = window.Cashfree({ mode });

      cashfree.checkout({
        paymentSessionId: orderDetails.payment_session_id,
        redirectTarget: target
      }).then(async (result) => {
        setIsProcessing(false);
        if (result?.error) {
          console.error('Cashfree Checkout Error:', result.error);
          setErrorMessage(result.error.message || 'Payment cancelled or closed.');
          if (onPaymentFailed) {
            onPaymentFailed({ message: result.error.message || 'Payment cancelled or failed' });
          }
        } else if (result?.paymentDetails) {
          // Verify with backend directly
          try {
            const res = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ order_id: orderDetails.order_id })
            });
            const vData = await res.json();
            if (vData.verified && (vData.payment_status === 'SUCCESS' || vData.registration_status === 'CONFIRMED')) {
              if (onPaymentSuccess) onPaymentSuccess(vData);
            } else {
              if (onPaymentFailed) onPaymentFailed(vData);
            }
          } catch (e) {
            if (onPaymentPending) onPaymentPending({ order_id: orderDetails.order_id });
          }
        }
      });
    } catch (err) {
      setIsProcessing(false);
      console.error('Failed to trigger modal Cashfree SDK, switching to redirect:', err);
      try {
        const cashfree = window.Cashfree({
          mode: orderDetails.cashfree_mode === 'production' ? 'production' : 'sandbox'
        });
        cashfree.checkout({
          paymentSessionId: orderDetails.payment_session_id,
          redirectTarget: '_self'
        });
      } catch (e2) {
        setErrorMessage('Unable to launch Cashfree payment sheet. Please check your browser popup blocker.');
      }
    }
  };

  // Auto-launch Cashfree modal when checkout opens
  useEffect(() => {
    if (isOpen && orderDetails?.payment_session_id) {
      const timer = setTimeout(() => {
        if (window.Cashfree) {
          handleProceedRealCashfree('_modal');
        }
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, orderDetails?.payment_session_id]);

  if (!isOpen || !orderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden text-left antialiased font-sans">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-emerald-500 flex items-center justify-center font-black text-slate-950 text-base shadow">
              ₹
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold tracking-wide">
                  CASHFREE PAYMENTS GATEWAY
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  LIVE SECURE
                </span>
              </div>
              <p className="text-[11px] text-sky-200/80">
                Official 256-Bit SSL Encrypted Checkout
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Amount Bar */}
        <div className="p-6 bg-gradient-to-b from-sky-50/80 to-white border-b border-sky-100 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-800">
              Internship Registration
            </span>
            <p className="text-sm font-bold text-slate-900">
              Skyrovix Batch 1 Program Fee
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Order ID: <span className="font-semibold text-sky-700">{orderDetails.order_id}</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Payable</span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">₹200.00</span>
          </div>
        </div>

        {/* Breakdown Guarantee Banner */}
        <div className="px-6 py-2.5 bg-emerald-50 border-b border-emerald-200/80 text-[11px] font-semibold text-emerald-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Internship Tuition: <strong>₹0.00 (100% Free)</strong> • Only ₹200 Registration Fee Applicable.</span>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Student Applicant Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-500 font-medium pb-2 border-b border-slate-200/60 text-[11px]">
              <span className="font-bold uppercase tracking-wider text-slate-700">Applicant Details</span>
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Application Submitted
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Registered Name</span>
                <span className="font-bold truncate block">{orderDetails.customer_name || 'Student Intern'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Registered Email</span>
                <span className="font-bold truncate block font-mono text-[11px]">{orderDetails.customer_email || 'student@skyrovix.com'}</span>
              </div>
            </div>
          </div>

          {/* Supported Methods Icons Grid */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Payment Methods Accepted On Cashfree:
            </label>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl border border-sky-200/80 bg-sky-50/50 flex flex-col items-center gap-1">
                <Smartphone className="w-5 h-5 text-sky-600" />
                <span className="font-bold text-slate-800 text-[11px]">UPI &amp; QR</span>
                <span className="text-[10px] text-slate-500">GPay, PhonePe, Paytm</span>
              </div>
              <div className="p-3 rounded-xl border border-blue-200/80 bg-blue-50/50 flex flex-col items-center gap-1">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="font-bold text-slate-800 text-[11px]">Cards</span>
                <span className="text-[10px] text-slate-500">Visa, Mastercard, RuPay</span>
              </div>
              <div className="p-3 rounded-xl border border-indigo-200/80 bg-indigo-50/50 flex flex-col items-center gap-1">
                <Building2 className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-slate-800 text-[11px]">NetBanking</span>
                <span className="text-[10px] text-slate-500">All Major Indian Banks</span>
              </div>
            </div>
          </div>

          {/* Error notice if popup was closed or failed */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Payment notice:</p>
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={() => handleProceedRealCashfree('_modal')}
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 hover:from-emerald-700 hover:to-sky-800 text-white rounded-2xl font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              <CreditCard className="w-5 h-5" />
              <span>{isProcessing ? 'Connecting to Cashfree Gateway...' : 'Pay ₹200 Via Cashfree Gateway Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleProceedRealCashfree('_self')}
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Alternative: Open Fullscreen Hosted Checkout (Redirect)</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel Payment &amp; Return
            </button>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            Official Cashfree PCI-DSS Level 1 Gateway
          </span>
          <span className="text-emerald-700 font-bold">100% Secure &amp; Verified</span>
        </div>

      </div>
    </div>
  );
};
