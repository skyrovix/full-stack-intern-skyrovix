import React from 'react';
import { 
  Calendar, 
  Globe2, 
  Code2, 
  FolderGit2, 
  BadgePercent, 
  CreditCard, 
  Award, 
  CheckCircle2, 
  ShieldCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const ProgramOverview = ({ onOpenApply }) => {
  const overviewCards = [
    {
      icon: Calendar,
      title: 'Duration',
      value: '3 Months',
      detail: 'Structured into 3 progressive monthly engineering milestones',
      color: 'text-sky-600',
      bg: 'bg-sky-50',
      border: 'border-sky-200',
      glow: 'group-hover:border-sky-400 group-hover:shadow-sky-500/10'
    },
    {
      icon: Globe2,
      title: 'Mode',
      value: '100% Virtual',
      detail: 'Remote-first flexible delivery, live guides, sprint tasks & repos',
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      border: 'border-cyan-200',
      glow: 'group-hover:border-cyan-400 group-hover:shadow-cyan-500/10'
    },
    {
      icon: Code2,
      title: 'Program',
      value: 'Full Stack Development',
      detail: 'React 19, Node.js, Express, PostgreSQL, Supabase & REST APIs',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      glow: 'group-hover:border-blue-400 group-hover:shadow-blue-500/10'
    },
    {
      icon: FolderGit2,
      title: 'Projects',
      value: '50+ Practical Projects',
      detail: 'Real business scenarios from foundational UI to production SaaS',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      glow: 'group-hover:border-indigo-400 group-hover:shadow-indigo-500/10'
    },
    {
      icon: BadgePercent,
      title: 'Internship Fee',
      value: '₹0 Zero Tuition',
      detail: 'No training fees, course charges, or hidden deductions',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      glow: 'group-hover:border-emerald-400 group-hover:shadow-emerald-500/10'
    },
    {
      icon: CreditCard,
      title: 'Registration Fee',
      value: '₹200 Only',
      detail: 'One-time nominal administration & verification fee',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      glow: 'group-hover:border-amber-400 group-hover:shadow-amber-500/10'
    },
  ];

  return (
    <section id="overview" className="py-20 bg-slate-50/70 border-y border-slate-200/80 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-dots-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider border border-sky-200 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>EXECUTIVE SUMMARY</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-950 tracking-tight">
            Program Overview
          </h2>

          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A comprehensive, hands-on 3-month engineering internship engineered to help you build real projects, master full stack architecture, and deploy live applications.
          </p>
        </div>

        {/* 6 Key Parameter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {overviewCards.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className={`p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-xl transition-all duration-300 text-left flex flex-col justify-between group ${item.glow}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {item.title}
                    </span>
                    <div className={`p-3 rounded-2xl ${item.bg} ${item.color} border ${item.border} group-hover:scale-110 transition-transform shadow-2xs`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
                    {item.value}
                  </h3>

                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verified Credential Feature Card */}
        <div className="mt-10 p-7 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-950 via-[#0a1e3a] to-[#041228] text-white border border-sky-500/30 shadow-2xl text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-start gap-4 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0 shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-black text-white tracking-tight">
                  Official Skyrovix Digital Internship Certificate
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  INSTANT VERIFICATION QR
                </span>
              </div>
              <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                Awarded upon successful completion of required sprint deliverables — including 50 assigned projects, GitHub repositories, and live Capstone SaaS deployment.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApply}
            className="shrink-0 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-cyan-400 hover:from-sky-300 hover:to-cyan-300 text-slate-950 text-sm font-extrabold transition-all shadow-lg shadow-cyan-500/25 cursor-pointer flex items-center gap-2 transform hover:scale-[1.02] active:scale-100"
          >
            <span>Apply for Batch 1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
