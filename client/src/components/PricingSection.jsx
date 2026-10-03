import React from 'react';
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Lock, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export const PricingSection = ({ onOpenApply }) => {
  const paymentFlowSteps = [
    { step: '01', title: 'Application', desc: 'Fill the student registration profile' },
    { step: '02', title: '₹200 Payment', desc: 'Pay securely via Cashfree PG (UPI, Cards, NetBanking)' },
    { step: '03', title: 'Verification', desc: 'Automated cryptographic webhook verification' },
    { step: '04', title: 'Confirmation', desc: 'Instant student ID generation & confirmation receipt' },
    { step: '05', title: 'Dashboard', desc: 'Immediate access to the student dashboard & resources' },
    { step: '06', title: 'WhatsApp Group', desc: 'Join the official group for live orientation & start schedule' }
  ];

  return (
    <section id="pricing" className="py-24 bg-white border-t border-slate-200/80 relative overflow-hidden">
      {/* Subtle background mesh */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-300 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% TRANSPARENT PRICING</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
            Transparent Internship Fee Structure
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            High quality technology education should be accessible. Skyrovix charges <strong>zero internship or training tuition fees</strong>.
          </p>
        </div>

        {/* Pricing Card & Comparison Grid */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden mb-16 relative">
          
          {/* Top Notice Banner */}
          <div className="bg-gradient-to-r from-slate-950 via-[#071c38] to-slate-900 text-white p-4 text-center text-xs sm:text-sm font-bold tracking-wide border-b border-sky-500/20">
            <span className="text-cyan-300 font-extrabold uppercase mr-1.5">Official Policy:</span>
            No Internship or Training Fee. Only a ₹200 one-time registration fee is applicable.
          </div>

          <div className="p-6 sm:p-10 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Line Items */}
              <div className="md:col-span-7 space-y-5 text-left">
                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div>
                    <span className="text-base font-bold text-slate-900 block">
                      3-Month Full Stack Internship Training
                    </span>
                    <span className="text-xs text-slate-500">
                      Curriculum, AI tools guidance, 50 sprint projects &amp; code reviews
                    </span>
                  </div>
                  <span className="text-base font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ₹0 Free
                  </span>
                </div>

                <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                  <div>
                    <span className="text-base font-bold text-slate-900 block">
                      One-Time Registration &amp; Onboarding Fee
                    </span>
                    <span className="text-xs text-slate-500">
                      Covers platform profile setup, database records &amp; verified digital certificate
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-900">
                    ₹200
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-black text-slate-900">
                    Total Payable Amount:
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-sky-600">
                    ₹200
                  </span>
                </div>

                {/* Important Callout Note */}
                <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-xs text-amber-900 font-medium space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    Strict Transparency Guarantee:
                  </p>
                  <p className="leading-relaxed">
                    Skyrovix does <strong>not</strong> charge a course or tuition fee. The ₹200 fee is solely for registration administration and credential verification. No further payment will ever be asked during the 3 months.
                  </p>
                </div>
              </div>

              {/* Right Column: Key Inclusions & CTA */}
              <div className="md:col-span-5 bg-slate-50 p-6 sm:p-7 rounded-3xl border border-slate-200/80 text-left space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
                  Everything Included in Batch 1:
                </h4>

                <ul className="space-y-2.5">
                  {[
                    'Full 3-Month virtual engineering internship',
                    '50+ real-world project deliverables',
                    'Access to official Batch 1 WhatsApp group',
                    'Weekly milestones & pull-request code reviews',
                    'Student dashboard tracking & profile portal',
                    'Cryptographically verified completion certificate'
                  ].map((inc, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-slate-700">
                      <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{inc}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onOpenApply}
                  id="pricing-apply-btn"
                  className="w-full py-4 px-4 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 hover:from-sky-700 hover:to-blue-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-sky-600/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                >
                  <span>PAY ₹200 &amp; REGISTER NOW</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1 font-medium">
                  <Lock className="w-3 h-3 text-slate-400" />
                  Secured by Cashfree Payments Gateway (256-bit SSL)
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* 6-Step Visual Process Flow */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">
              Registration &amp; Payment Flow
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent, automated, and secure from application to orientation
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-left">
            {paymentFlowSteps.map((flow) => (
              <div
                key={flow.step}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-soft hover:shadow-md transition-all flex flex-col justify-between group hover:border-sky-300"
              >
                <div>
                  <span className="text-xs font-black text-sky-600 mb-1.5 block group-hover:scale-110 transition-transform">
                    {flow.step}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mb-1 leading-snug">
                    {flow.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                    {flow.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
