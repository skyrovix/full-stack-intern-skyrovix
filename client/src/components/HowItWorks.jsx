import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  UserPlus, 
  CreditCard, 
  MessageCircle, 
  PlayCircle, 
  Award, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { MagneticButton } from './MagneticButton';

export const HowItWorks = ({ onOpenApply }) => {
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

  const steps = [
    {
      num: '01',
      title: 'Register',
      desc: 'Complete the student application form with your college, degree, and current skill level.',
      icon: UserPlus,
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200'
    },
    {
      num: '02',
      title: 'Pay ₹200 Fee',
      desc: 'Pay the one-time ₹200 registration fee securely via Cashfree PG (Zero tuition fee).',
      icon: CreditCard,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    {
      num: '03',
      title: 'Join WhatsApp',
      desc: 'Join the official Batch 1 WhatsApp group to receive exact start dates and orientation links.',
      icon: MessageCircle,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      num: '04',
      title: 'Start Internship',
      desc: 'Begin Month 1 hands-on sprints, code daily, and master React, Node, and SQL architectures.',
      icon: PlayCircle,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
    {
      num: '05',
      title: 'Complete & Deploy',
      desc: 'Deliver 50+ practical projects, deploy your Capstone SaaS, and earn your verified certificate.',
      icon: Award,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    }
  ];

  return (
    <section className="py-20 md:py-24 bg-white border-t border-[rgba(25,40,55,0.08)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with scroll reveal */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#087FC1]/10 text-[#087FC1] text-xs font-bold uppercase tracking-wider border border-[#087FC1]/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#087FC1]" />
            <span>STEP-BY-STEP ROAD</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#192837] tracking-tight">
            How It Works
          </h2>
          <p className="text-[#4C5B6D] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A straightforward 5-step journey from initial registration to industry-standard project completion.
          </p>
        </motion.div>

        {/* 5-Step Visual Process with SpotlightCard & staggered scroll reveal */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <motion.div
                key={st.num}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: easeOutQuart }}
                className="relative"
              >
                <SpotlightCard
                  spotlightColor="rgba(8, 127, 193, 0.10)"
                  hoverY={-5}
                  className="p-6 sm:p-7 rounded-[24px] bg-[#F7F9FC] border border-[rgba(25,40,55,0.08)] shadow-[0_8px_30px_rgba(25,40,55,0.03)] hover:shadow-[0_15px_35px_rgba(8,127,193,0.08)] hover:bg-white hover:border-[#087FC1]/40 h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-heading text-3xl font-black text-[#087FC1]/30">
                        {st.num}
                      </span>
                      <div className={`p-3 rounded-2xl ${st.bg} ${st.color} border ${st.border}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-heading text-base font-bold text-[#192837] mb-2">
                      {st.title}
                    </h3>

                    <p className="text-xs text-[#4C5B6D] leading-relaxed font-normal">
                      {st.desc}
                    </p>
                  </div>
                </SpotlightCard>

                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-slate-300 pointer-events-none">
                    <ArrowRight className="w-5 h-5 text-[#087FC1]/40" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* CTA underneath with MagneticButton */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, delay: 0.2, ease: easeOutQuart }}
          className="mt-14 text-center"
        >
          <MagneticButton>
            <button
              onClick={onOpenApply}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-[20px] text-white font-extrabold text-sm shadow-xl transition-all cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #087FC1, #2447B8)',
                boxShadow: '0 12px 30px rgba(8,127,193,0.25)'
              }}
            >
              <span>START YOUR REGISTRATION</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
};
