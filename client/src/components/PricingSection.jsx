import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Check, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Lock
} from 'lucide-react';
import { MagneticButton } from './MagneticButton';
import { SpotlightCard } from './SpotlightCard';

export const PricingSection = ({ onOpenApply }) => {
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

  const paymentFlowSteps = [
    { step: '01', title: 'Application', desc: 'Fill the student registration profile' },
    { step: '02', title: '₹200 Payment', desc: 'Pay securely via Cashfree PG (UPI, Cards, NetBanking)' },
    { step: '03', title: 'Verification', desc: 'Automated cryptographic webhook verification' },
    { step: '04', title: 'Confirmation', desc: 'Instant student ID generation & confirmation receipt' },
    { step: '05', title: 'Dashboard', desc: 'Immediate access to the student dashboard & resources' },
    { step: '06', title: 'WhatsApp Group', desc: 'Join the official group for live orientation & start schedule' }
  ];

  return (
    <section id="pricing" className="py-20 md:py-24 bg-[#F7F9FC] border-t border-[rgba(25,40,55,0.08)] relative overflow-hidden">
      {/* Subtle background grid */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(25, 40, 55, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(25, 40, 55, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with scroll reveal */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00B978]/10 text-[#00B978] text-xs font-bold uppercase tracking-wider border border-[#00B978]/25 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00B978]" />
            <span>100% TRANSPARENT PRICING</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#192837] tracking-tight">
            Transparent Internship Fee Structure
          </h2>

          <p className="text-[#4C5B6D] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            High quality technology education should be accessible. Skyrovix charges <strong className="text-[#192837]">zero internship or training tuition fees</strong>.
          </p>
        </motion.div>

        {/* Pricing Card & Comparison Grid with SpotlightCard */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: easeOutQuart }}
          className="max-w-4xl mx-auto mb-16"
        >
          <SpotlightCard
            spotlightColor="rgba(8, 127, 193, 0.08)"
            hoverY={-4}
            className="bg-white rounded-[24px] border border-[rgba(25,40,55,0.08)] shadow-[0_15px_45px_rgba(25,40,55,0.06)] overflow-hidden"
          >
            {/* Top Notice Banner */}
            <div className="bg-[#071426] text-white p-4 text-center text-xs sm:text-sm font-bold tracking-wide border-b border-[#087FC1]/20">
              <span className="text-[#18C7E8] font-extrabold uppercase mr-1.5">Official Policy:</span>
              No Internship or Training Fee. Only a ₹200 one-time registration fee is applicable.
            </div>

            <div className="p-6 sm:p-10 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                {/* Left Column: Line Items */}
                <div className="md:col-span-7 space-y-5 text-left">
                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div>
                      <span className="font-heading text-base font-bold text-[#192837] block">
                        3-Month Full Stack Internship Training
                      </span>
                      <span className="text-xs text-[#4C5B6D]">
                        Curriculum, AI tools guidance, 50 sprint projects &amp; code reviews
                      </span>
                    </div>
                    <span className="text-sm font-black text-[#00B978] bg-[#00B978]/10 px-3 py-1 rounded-full border border-[#00B978]/25">
                      ₹0 Free
                    </span>
                  </div>

                  <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
                    <div>
                      <span className="font-heading text-base font-bold text-[#192837] block">
                        One-Time Registration &amp; Onboarding Fee
                      </span>
                      <span className="text-xs text-[#4C5B6D]">
                        Covers platform profile setup, database records &amp; verified digital certificate
                      </span>
                    </div>
                    <span className="font-heading text-lg font-black text-[#192837]">
                      ₹200
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-heading text-xl font-black text-[#192837]">
                      Total Payable Amount:
                    </span>
                    <span className="font-heading text-3xl sm:text-4xl font-black text-[#087FC1]">
                      ₹200
                    </span>
                  </div>

                  {/* Important Callout Note */}
                  <div className="p-4 rounded-[18px] bg-amber-50/90 border border-amber-200/90 text-xs text-amber-900 font-medium space-y-1">
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
                <div className="md:col-span-5 bg-[#F7F9FC] p-6 sm:p-7 rounded-[20px] border border-[rgba(25,40,55,0.08)] text-left space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#4C5B6D]/80">
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
                      <li key={idx} className="flex items-center gap-2.5 text-xs font-semibold text-[#192837]">
                        <div className="w-4 h-4 rounded-full bg-[#00B978]/15 text-[#00B978] flex items-center justify-center shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton className="w-full">
                    <button
                      onClick={onOpenApply}
                      id="pricing-apply-btn"
                      className="w-full py-4 px-4 text-white rounded-[20px] font-extrabold text-sm shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                      style={{
                        background: 'linear-gradient(135deg, #087FC1, #2447B8)',
                        boxShadow: '0 10px 25px rgba(8,127,193,0.30)'
                      }}
                    >
                      <span>PAY ₹200 &amp; REGISTER NOW</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </MagneticButton>

                  <p className="text-[11px] text-center text-[#4C5B6D] flex items-center justify-center gap-1 font-medium">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Secured by Cashfree Payments Gateway (256-bit SSL)
                  </p>
                </div>

              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* 6-Step Visual Process Flow with Staggered Scroll Reveal */}
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, ease: easeOutQuart }}
            className="text-center mb-8"
          >
            <h3 className="font-heading text-xl sm:text-2xl font-black text-[#192837]">
              Registration &amp; Payment Flow
            </h3>
            <p className="text-xs sm:text-sm text-[#4C5B6D] mt-1">
              Transparent, automated, and secure from application to orientation
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 text-left">
            {paymentFlowSteps.map((flow, fIdx) => (
              <motion.div
                key={flow.step}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45, delay: fIdx * 0.06, ease: easeOutQuart }}
              >
                <SpotlightCard
                  spotlightColor="rgba(8, 127, 193, 0.10)"
                  hoverY={-3}
                  className="p-4 rounded-[20px] bg-white border border-[rgba(25,40,55,0.08)] shadow-[0_4px_16px_rgba(25,40,55,0.03)] hover:shadow-md hover:border-[#087FC1]/40 h-full flex flex-col justify-between group"
                >
                  <div>
                    <span className="font-heading text-xs font-black text-[#087FC1] mb-1.5 block group-hover:scale-110 transition-transform">
                      {flow.step}
                    </span>
                    <h4 className="font-heading text-xs font-bold text-[#192837] mb-1 leading-snug">
                      {flow.title}
                    </h4>
                    <p className="text-[11px] text-[#4C5B6D] leading-relaxed font-normal">
                      {flow.desc}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
