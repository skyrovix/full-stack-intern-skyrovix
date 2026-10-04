import React from 'react';
import { 
  MessageCircle, 
  CheckCircle2, 
  BellRing, 
  Calendar, 
  Users, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';

export const WhatsAppSection = ({ whatsappUrl }) => {
  const groupBenefits = [
    'Exact internship start date announcement',
    'Batch schedule & live orientation calendar',
    'Daily and weekly hands-on coding instructions',
    'Project briefs, starter code & asset kits',
    'Task announcements and milestone targets',
    'Important policy & deadline updates',
    'GitHub submission guidelines & reviewer feedback',
    'Internship code-of-conduct & community rules'
  ];

  return (
    <section className="py-16 bg-white border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900 via-teal-950 to-slate-950 text-white p-8 md:p-12 shadow-2xl border border-emerald-700/60">
          
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading and info */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-emerald-300" />
                <span>OFFICIAL COMMUNITY HUB</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                JOIN THE OFFICIAL <br />
                <span className="text-emerald-400">BATCH 1 WHATSAPP GROUP</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                After completing your ₹200 registration, all official Batch 1 communications, mentorship instructions, and live meeting links are broadcast through our official WhatsApp group.
              </p>

              {/* Group Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {groupBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <a
                  href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="whatsapp-section-btn"
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-extrabold text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-xl shadow-emerald-950/50 transition-all transform hover:scale-[1.02] active:scale-100"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-slate-950" />
                  <span>JOIN BATCH 1 WHATSAPP GROUP</span>
                </a>
                <p className="text-[11px] text-slate-400 mt-2">
                  * Note: Configured dynamically via official Skyrovix administration settings.
                </p>
              </div>
            </div>

            {/* Right Column: Visual WhatsApp Preview Card */}
            <div className="lg:col-span-5">
              <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl text-left space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 font-black">
                    <WhatsAppIcon className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Skyrovix Batch 1 Official</h4>
                    <p className="text-[11px] text-emerald-400">Community • Batch 1 Interns</p>
                  </div>
                </div>

                {/* Simulated message cards */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200">
                    <p className="text-[10px] text-emerald-400 font-bold mb-1">📢 Skyrovix Coordinator:</p>
                    <p>Welcome to Batch 1! Exact start date and orientation schedule is now confirmed. Please review week 1 repositories in the portal.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-slate-200">
                    <p className="text-[10px] text-sky-400 font-bold mb-1">🚀 Task Release:</p>
                    <p>Month 1 Frontend Sprint 1 brief has been published. Submit your GitHub repository and live deployment link inside your dashboard.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-[11px] text-emerald-300 text-center font-semibold">
                  Official community channels are moderated for serious full-stack learners.
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
