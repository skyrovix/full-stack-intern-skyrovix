import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Calendar, 
  Globe2, 
  Code2, 
  FolderGit2, 
  BadgePercent, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { MagneticButton } from './MagneticButton';

export const ProgramOverview = ({ onOpenApply }) => {
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

  const overviewCards = [
    {
      icon: Calendar,
      title: 'Duration',
      value: '3 Months',
      detail: 'Structured into 3 progressive monthly engineering milestones',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      spotlight: 'rgba(8, 127, 193, 0.12)'
    },
    {
      icon: Globe2,
      title: 'Mode',
      value: '100% Virtual',
      detail: 'Remote-first flexible delivery, live guides, sprint tasks & repos',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      spotlight: 'rgba(24, 199, 232, 0.12)'
    },
    {
      icon: Code2,
      title: 'Program',
      value: 'Full Stack Development',
      detail: 'React 19, Node.js, Express, PostgreSQL, MySQL & REST APIs',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      spotlight: 'rgba(36, 71, 184, 0.12)'
    },
    {
      icon: FolderGit2,
      title: 'Projects',
      value: '50+ Practical Projects',
      detail: 'Real business scenarios from foundational UI to production SaaS',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      spotlight: 'rgba(115, 66, 226, 0.12)'
    },
    {
      icon: BadgePercent,
      title: 'Internship Fee',
      value: '₹0 Zero Tuition',
      detail: 'No training fees, course charges, or hidden deductions',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      spotlight: 'rgba(0, 185, 120, 0.12)'
    },
    {
      icon: CreditCard,
      title: 'Registration Fee',
      value: '₹200 Only',
      detail: 'One-time nominal administration & verification fee',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      spotlight: 'rgba(245, 158, 11, 0.12)'
    },
  ];

  return (
    <section id="overview" className="py-20 md:py-24 bg-[#F7F9FC] border-y border-[rgba(25,40,55,0.08)] relative">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(25, 40, 55, 0.10) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#087FC1]/10 text-[#087FC1] text-xs font-bold uppercase tracking-wider border border-[#087FC1]/20">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#087FC1]" />
            <span>EXECUTIVE SUMMARY</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#192837] tracking-tight">
            Program Overview
          </h2>

          <p className="text-[#4C5B6D] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive, hands-on 3-month engineering internship engineered to help you build real projects, master full stack architecture, and deploy live applications.
          </p>
        </motion.div>

        {/* 6 Key Parameter Cards with Staggered Scroll Reveal and SpotlightCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: easeOutQuart }}
              >
                <SpotlightCard
                  spotlightColor={item.spotlight}
                  hoverY={-5}
                  className="p-7 rounded-[24px] bg-white border border-[rgba(25,40,55,0.08)] shadow-[0_10px_35px_rgba(25,40,55,0.04)] hover:shadow-[0_20px_45px_rgba(8,127,193,0.10)] h-full text-left flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4C5B6D]/70">
                        {item.title}
                      </span>
                      <div className={`p-3 rounded-2xl ${item.bg} ${item.color} border ${item.border} group-hover:scale-110 transition-transform shadow-2xs`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="font-heading text-2xl font-black text-[#192837] tracking-tight mb-2">
                      {item.value}
                    </h3>

                    <p className="text-sm text-[#4C5B6D] font-normal leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* Verified Credential Feature Card */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: easeOutQuart }}
          className="mt-10 p-7 sm:p-10 rounded-[24px] bg-gradient-to-r from-[#071426] via-[#0b1c34] to-[#040d1a] text-white border border-[#087FC1]/30 shadow-[0_20px_50px_rgba(7,20,38,0.25)] text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#18C7E8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-[#087FC1]/20 border border-[#087FC1]/40 flex items-center justify-center text-[#18C7E8] shrink-0 shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-xl sm:text-2xl font-black text-white tracking-tight">
                  Official Skyrovix Digital Internship Certificate
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00B978]/20 text-[#00B978] border border-[#00B978]/30">
                  INSTANT VERIFICATION QR
                </span>
              </div>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Awarded upon successful completion of required sprint deliverables — including 50 assigned projects, GitHub repositories, and live Capstone SaaS deployment.
              </p>
            </div>
          </div>

          <MagneticButton>
            <button
              onClick={onOpenApply}
              className="shrink-0 px-6 py-4 rounded-[20px] text-white text-sm font-extrabold transition-all cursor-pointer flex items-center gap-2 shadow-[0_10px_25px_rgba(8,127,193,0.30)] hover:shadow-[0_15px_35px_rgba(8,127,193,0.45)]"
              style={{
                background: 'linear-gradient(135deg, #087FC1, #2447B8)'
              }}
            >
              <span>Apply for Batch 1</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
};
