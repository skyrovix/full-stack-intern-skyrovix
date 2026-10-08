import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Rocket, Calendar, ArrowRight, BellRing, CheckCircle2 } from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';
import { MagneticButton } from './MagneticButton';

export const BatchAnnouncement = ({ onOpenApply, whatsappUrl }) => {
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <motion.div 
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.65, ease: easeOutQuart }}
        className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071426] via-[#0b1c34] to-[#040d1a] p-6 sm:p-10 text-white shadow-[0_20px_60px_rgba(7,20,38,0.25)] border border-[rgba(24,199,232,0.20)]"
      >
        {/* Ambient background glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#18C7E8]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-[#7342E2]/15 rounded-full blur-3xl pointer-events-none" />
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px'
          }}
        />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Announcement Copy */}
          <div className="space-y-4 max-w-3xl text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18C7E8]/15 border border-[#18C7E8]/35 text-[#18C7E8] text-xs font-black uppercase tracking-wider shadow-xs">
                <Rocket className="w-3.5 h-3.5 text-[#18C7E8]" />
                <span>BATCH 1 ADMISSIONS ACTIVE</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#00B978]/15 border border-[#00B978]/30 text-[#00B978] text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00B978]" />
                <span>₹0 Internship Fee</span>
              </span>
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-snug">
              Official Batch 1 Registration is Now Live <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#18C7E8] via-[#087FC1] to-[#7342E2]">
                Skyrovix 3-Month Full Stack Development Internship.
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-center gap-3 p-3.5 rounded-[18px] bg-white/[0.06] border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-[#18C7E8]/20 text-[#18C7E8] flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">START TIMELINE</span>
                  <strong className="text-xs sm:text-sm text-white font-bold">Within the Next 10 Days</strong>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-[18px] bg-white/[0.06] border border-white/10 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-[#00B978]/20 text-[#00B978] flex items-center justify-center shrink-0">
                  <BellRing className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">OFFICIAL CHANNEL</span>
                  <strong className="text-xs sm:text-sm text-white font-bold">WhatsApp Group Orientation</strong>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed italic border-l-2 border-[#18C7E8]/50 pl-3">
              "Exact onboarding schedule, daily sprint tasks, live guidance sessions, and repository access links are announced through the verified Batch 1 WhatsApp group."
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full lg:w-72 shrink-0">
            <MagneticButton className="w-full">
              <a
                href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-[20px] text-sm font-extrabold bg-[#25D366] hover:bg-[#20ba59] text-white shadow-xl shadow-emerald-950/50 transition-all cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 fill-white" />
                <span>JOIN OFFICIAL WHATSAPP</span>
              </a>
            </MagneticButton>

            <MagneticButton className="w-full">
              <button
                onClick={onOpenApply}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-[20px] text-sm font-extrabold text-white shadow-lg transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #087FC1, #2447B8)',
                  boxShadow: '0 12px 30px rgba(8,127,193,0.30)'
                }}
              >
                <span>APPLY NOW (₹200)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          </div>

        </div>
      </motion.div>
    </section>
  );
};
