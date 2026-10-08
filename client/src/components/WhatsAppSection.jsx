import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  CheckCircle2
} from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';
import { MagneticButton } from './MagneticButton';
import { SpotlightCard } from './SpotlightCard';

export const WhatsAppSection = ({ whatsappUrl }) => {
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

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
    <section className="py-20 md:py-24 bg-[#F7F9FC] border-t border-[rgba(25,40,55,0.08)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: easeOutQuart }}
          className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#071426] via-[#052920] to-[#031510] text-white p-8 md:p-12 shadow-[0_20px_50px_rgba(7,20,38,0.25)] border border-[#00B978]/30"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#00B978]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#18C7E8]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Heading and info */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00B978]/20 border border-[#00B978]/40 text-[#00B978] text-xs font-bold uppercase tracking-wider">
                <WhatsAppIcon className="w-3.5 h-3.5 fill-[#00B978]" />
                <span>OFFICIAL COMMUNITY HUB</span>
              </div>

              <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                JOIN THE OFFICIAL <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00B978] via-[#18C7E8] to-white">
                  BATCH 1 WHATSAPP GROUP
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                After completing your ₹200 registration, all official Batch 1 communications, mentorship instructions, and live meeting links are broadcast through our official WhatsApp group.
              </p>

              {/* Group Benefits Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {groupBenefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#00B978] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3">
                <MagneticButton>
                  <a
                    href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="whatsapp-section-btn"
                    className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-[20px] text-base font-extrabold text-slate-950 bg-[#25D366] hover:bg-[#20ba59] shadow-xl shadow-emerald-950/50 transition-all cursor-pointer"
                  >
                    <WhatsAppIcon className="w-5 h-5 fill-slate-950" />
                    <span>JOIN BATCH 1 WHATSAPP GROUP</span>
                  </a>
                </MagneticButton>
                <p className="text-[11px] text-slate-400 mt-2">
                  * Note: Configured dynamically via official Skyrovix administration settings.
                </p>
              </div>
            </div>

            {/* Right Column: Visual WhatsApp Preview Card with SpotlightCard */}
            <div className="lg:col-span-5">
              <SpotlightCard
                spotlightColor="rgba(37, 211, 102, 0.15)"
                borderColor="rgba(37, 211, 102, 0.3)"
                hoverY={-4}
                className="p-6 rounded-[20px] bg-[#031510]/90 border border-emerald-900/50 shadow-xl text-left space-y-4"
              >
                <div className="flex items-center gap-3 pb-3 border-b border-emerald-900/40">
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-slate-950 font-black">
                    <WhatsAppIcon className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <h4 className="font-heading text-sm font-bold text-white">Skyrovix Batch 1 Official</h4>
                    <p className="text-[11px] text-[#00B978]">Community • Batch 1 Interns</p>
                  </div>
                </div>

                {/* Simulated message cards */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-900/40 text-slate-200">
                    <p className="text-[10px] text-[#00B978] font-bold mb-1">📢 Skyrovix Coordinator:</p>
                    <p>Welcome to Batch 1! Exact start date and orientation schedule is now confirmed. Please review week 1 repositories in the portal.</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-emerald-900/40 text-slate-200">
                    <p className="text-[10px] text-[#18C7E8] font-bold mb-1">🚀 Task Release:</p>
                    <p>Month 1 Frontend Sprint 1 brief has been published. Submit your GitHub repository and live deployment link inside your dashboard.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-[11px] text-emerald-300 text-center font-semibold">
                  Official community channels are moderated for serious full-stack learners.
                </div>
              </SpotlightCard>
            </div>

          </div>

        </motion.div>

      </div>
    </section>
  );
};
