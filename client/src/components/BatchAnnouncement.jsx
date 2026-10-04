import React from 'react';
import { Rocket, MessageCircle, Calendar, ArrowRight, BellRing, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';

export const BatchAnnouncement = ({ onOpenApply, whatsappUrl }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-[#071c38] to-[#041228] p-6 sm:p-10 text-white shadow-2xl border border-sky-500/30">
        
        {/* Ambient background glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Announcement Copy */}
          <div className="space-y-4 max-w-3xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
                <Rocket className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
                <span>BATCH 1 ADMISSIONS ACTIVE</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>₹0 Internship Fee</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug">
              Official Batch 1 Registration is Now Live <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-white">
                Skyrovix 3-Month Full Stack Development Internship.
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">START TIMELINE</span>
                  <strong className="text-xs sm:text-sm text-white font-bold">Within the Next 10 Days</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">OFFICIAL CHANNEL</span>
                  <strong className="text-xs sm:text-sm text-white font-bold">WhatsApp Group Orientation</strong>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed italic border-l-2 border-cyan-400/40 pl-3">
              "Exact onboarding schedule, daily sprint tasks, live guidance sessions, and repository access links are announced through the verified Batch 1 WhatsApp group."
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full lg:w-72 shrink-0">
            <a
              href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-sm font-extrabold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-emerald-950/50 transition-all transform hover:scale-[1.02] active:scale-100 cursor-pointer"
            >
              <WhatsAppIcon className="w-5 h-5 fill-white" />
              <span>JOIN OFFICIAL WHATSAPP</span>
            </a>

            <button
              onClick={onOpenApply}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-lg shadow-sky-950/40 border border-sky-400/30 transition-all transform hover:scale-[1.02] active:scale-100 cursor-pointer"
            >
              <span>APPLY NOW (₹200)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
