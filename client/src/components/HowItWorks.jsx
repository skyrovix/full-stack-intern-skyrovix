import React from 'react';
import { 
  UserPlus, 
  CreditCard, 
  MessageCircle, 
  PlayCircle, 
  Award, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export const HowItWorks = ({ onOpenApply }) => {
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
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
            <span>STEP-BY-STEP ROAD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A straightforward 5-step journey from initial registration to industry-standard project completion.
          </p>
        </div>

        {/* 5-Step Visual Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 text-left">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.num}
                className="relative p-6 rounded-2xl bg-white border border-slate-200/90 shadow-soft shadow-card-hover flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-black text-slate-300">
                      {st.num}
                    </span>
                    <div className={`p-3 rounded-xl ${st.bg} ${st.color} border ${st.border}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mb-2">
                    {st.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    {st.desc}
                  </p>
                </div>

                {idx < 4 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300 pointer-events-none">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* CTA underneath */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenApply}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-sm shadow transition-all"
          >
            <span>START YOUR REGISTRATION</span>
            <ArrowRight className="w-4 h-4 text-sky-400" />
          </button>
        </div>

      </div>
    </section>
  );
};
