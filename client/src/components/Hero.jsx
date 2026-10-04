import React from 'react';
import { 
  ArrowRight, 
  Layers, 
  Globe2, 
  GitBranch, 
  Rocket, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen
} from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';

export const Hero = ({ onOpenApply, onOpenGuide, whatsappUrl }) => {
  const techStack = [
    { name: 'React 19', tag: 'UI Library' },
    { name: 'Node.js', tag: 'Runtime' },
    { name: 'Express.js', tag: 'REST API' },
    { name: 'PostgreSQL', tag: 'Relational DB' },
    { name: 'Supabase', tag: 'Backend & DB' },
    { name: 'Tailwind CSS', tag: 'Styling' },
    { name: 'Cashfree PG', tag: 'Payments' },
    { name: 'Git & GitHub', tag: 'Version Control' },
    { name: 'Vercel', tag: 'Edge Deploy' },
    { name: 'Custom Domain', tag: 'DNS & SSL' }
  ];

  const handleScrollToGuide = (e) => {
    e.preventDefault();
    if (onOpenGuide) {
      onOpenGuide();
    } else {
      try {
        window.history.pushState({}, '', '/guide');
        window.dispatchEvent(new PopStateEvent('popstate'));
      } catch (err) {
        window.location.href = '/guide';
      }
    }
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 bg-gradient-to-b from-white via-sky-50/40 to-slate-50 text-center">
      {/* Dynamic Background Mesh & Glowing Aurora Lights */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute inset-0 bg-dots-pattern opacity-40 pointer-events-none" />
      
      {/* Ambient Radial Lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-gradient-to-b from-sky-400/20 via-cyan-300/15 to-transparent blur-3xl rounded-full pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Floating Announcement Beacon */}
        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 px-4 py-2 rounded-full bg-white/95 border border-sky-200/90 text-slate-800 text-xs font-semibold shadow-soft backdrop-blur-md hover:border-sky-400 transition-all hover:shadow-md">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600"></span>
          </span>
          <span className="font-extrabold text-sky-900 uppercase tracking-wider text-[11px]">
            SKYROVIX BATCH 1 ENROLLMENTS
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
          <span className="text-slate-600 hidden sm:inline-block">Starts Within 10 Days</span>
          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
          <span className="font-extrabold text-emerald-800 bg-emerald-100/90 px-2.5 py-0.5 rounded-full border border-emerald-300 text-[11px]">
            ₹0 Internship Fee • ₹200 Registration Only
          </span>
        </div>

        {/* Main Headline & Value Statement */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <p className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-sky-600">
            OFFICIAL 3-MONTH FULL STACK DEVELOPMENT INTERNSHIP
          </p>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-950 leading-[1.08]">
            Build Real Systems. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-500 to-blue-700">
              Deploy Production Apps.
            </span>
          </h1>

          <p className="text-lg sm:text-2xl font-bold text-slate-800 tracking-tight">
            Learn • Build • Test • Deploy • Showcase
          </p>

          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Gain genuine full-stack experience through hands-on practical engineering. Master the complete software journey from initial idea to live domain deployment with AI tools, relational SQL databases, secure REST APIs, Cashfree payment gateway, and live Vercel deployments.
          </p>
        </div>

        {/* Action CTA Buttons */}
        <div className="space-y-4 pt-1">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
            <button
              onClick={onOpenApply}
              id="hero-apply-btn"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-sm sm:text-base font-extrabold text-white bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 hover:from-sky-700 hover:to-blue-900 shadow-xl shadow-sky-600/30 hover:shadow-sky-600/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>APPLY FOR BATCH 1 (₹200)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <a
              href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
              target="_blank"
              rel="noopener noreferrer"
              id="hero-whatsapp-btn"
              className="w-full sm:w-auto flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl text-sm sm:text-base font-extrabold text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 shadow-md transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
              <span>JOIN WHATSAPP GROUP</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
            <a
              href="/guide"
              onClick={handleScrollToGuide}
              className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-900 hover:underline font-bold"
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Explore Detailed Student Guide →</span>
            </a>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-sky-600" />
              <span>Batch 1 starts within next 10 days</span>
            </span>
            <span className="text-slate-300">•</span>
            <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Zero Tuition Fee</span>
            </span>
          </div>
        </div>

        {/* 4-Pillar High-Tech Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto text-left pt-2">
          
          <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-soft hover:border-sky-400 hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-xl font-black text-slate-950">50+</span>
              <span className="text-[10px] font-bold text-sky-700 uppercase">Projects</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mb-0.5">Real-World Projects</p>
            <p className="text-[11px] text-slate-500 leading-tight">Progressive business use cases</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-soft hover:border-cyan-400 hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-xl font-black text-slate-950">100%</span>
              <span className="text-[10px] font-bold text-cyan-700 uppercase">Virtual</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mb-0.5">Remote Learning</p>
            <p className="text-[11px] text-slate-500 leading-tight">Batch-based sprint tasks</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-soft hover:border-blue-400 hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-xl font-black text-slate-950">LIVE</span>
              <span className="text-[10px] font-bold text-blue-700 uppercase">Deploy</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mb-0.5">Live Production</p>
            <p className="text-[11px] text-slate-500 leading-tight">Vercel, Render &amp; Databases</p>
          </div>

          <div className="p-4 rounded-2xl bg-white/95 border border-slate-200/90 shadow-soft hover:border-indigo-400 hover:shadow-card-hover transition-all group">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GitBranch className="w-5 h-5" />
            </div>
            <div className="flex items-baseline gap-1 mb-0.5">
              <span className="text-xl font-black text-slate-950">GIT</span>
              <span className="text-[10px] font-bold text-indigo-700 uppercase">&amp; GitHub</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mb-0.5">Git Workflows</p>
            <p className="text-[11px] text-slate-500 leading-tight">Branches, commits &amp; portfolio</p>
          </div>

        </div>

        {/* High-Trust Pricing & Transparency Card */}
        <div className="max-w-2xl mx-auto p-5 sm:p-6 rounded-3xl bg-white/95 border-2 border-sky-100 shadow-xl text-left space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Zero Tuition Fee
                </span>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                  • Official Batch 1 Enrollment
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                100% Transparent Fee Structure
              </h3>
            </div>

            <div className="text-left sm:text-right">
              <div className="flex items-center sm:justify-end gap-2">
                <span className="text-sm font-semibold text-slate-400 line-through">₹12,000</span>
                <span className="text-xl font-black text-emerald-700">₹0 Fee</span>
              </div>
              <p className="text-xs font-extrabold text-slate-900">
                ₹200 Registration Fee Only
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full 3-Month hands-on internship curriculum</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>No training fees or hidden course charges</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Official Batch 1 WhatsApp orientation access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verifiable Skyrovix Internship Certificate</span>
            </div>
          </div>
        </div>

        {/* Tech Stack Chip Bar */}
        <div className="pt-2 border-t border-slate-200/80">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
            Full Stack Technologies Covered in Batch 1:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-slate-200/90 text-slate-700 shadow-2xs hover:border-sky-300 hover:text-sky-700 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <strong>{tech.name}</strong>
                <span className="text-[10px] text-slate-400 font-normal">({tech.tag})</span>
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
