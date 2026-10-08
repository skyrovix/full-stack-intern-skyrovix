import React, { useRef, useState, useEffect } from 'react';
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useReducedMotion 
} from 'framer-motion';
import { 
  ArrowRight, 
  Layers, 
  Rocket, 
  Sparkles, 
  Award, 
  Clock3, 
  CheckCircle2, 
  ShieldCheck, 
  BookOpen,
  Code2,
  Database,
  Cpu,
  GitBranch
} from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';
import { MagneticButton } from './MagneticButton';
import { SpotlightCard } from './SpotlightCard';

export const Hero = ({ onOpenApply, onOpenGuide, whatsappUrl }) => {
  const heroRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
  }, []);

  // Desktop Mouse Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 60, mass: 0.2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Parallax offsets for floating tech items
  const p1X = useTransform(smoothMouseX, [-600, 600], [-22, 22]);
  const p1Y = useTransform(smoothMouseY, [-600, 600], [-18, 18]);

  const p2X = useTransform(smoothMouseX, [-600, 600], [25, -25]);
  const p2Y = useTransform(smoothMouseY, [-600, 600], [-20, 20]);

  const p3X = useTransform(smoothMouseX, [-600, 600], [-18, 18]);
  const p3Y = useTransform(smoothMouseY, [-600, 600], [22, -22]);

  const p4X = useTransform(smoothMouseX, [-600, 600], [20, -20]);
  const p4Y = useTransform(smoothMouseY, [-600, 600], [16, -16]);

  const handleHeroMouseMove = (e) => {
    if (isTouchDevice || shouldReduceMotion) return;
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const techStack = [
    { name: 'React 19', tag: 'UI Library' },
    { name: 'Node.js', tag: 'Runtime' },
    { name: 'Express.js', tag: 'REST API' },
    { name: 'MySQL & PostgreSQL', tag: 'Relational DB' },
    { name: 'MongoDB', tag: 'NoSQL' },
    { name: 'Tailwind CSS', tag: 'Styling' },
    { name: 'Cashfree PG', tag: 'Payments' },
    { name: 'Git & GitHub', tag: 'Version Control' },
    { name: 'Vercel & Render', tag: 'Cloud Deploy' },
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

  const officialWhatsApp = whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP';

  // Smooth Vercel/Linear easing curve
  const easeOutQuart = [0.16, 1, 0.3, 1];

  const floatingVisuals = [
    { label: 'React 19', icon: Code2, x: '5%', y: '16%', delay: 0, pX: p1X, pY: p1Y },
    { label: 'Node.js API', icon: Cpu, x: '85%', y: '14%', delay: 1.1, pX: p2X, pY: p2Y },
    { label: 'SQL Database', icon: Database, x: '7%', y: '56%', delay: 2.2, pX: p3X, pY: p3Y },
    { label: 'Git Workflow', icon: GitBranch, x: '84%', y: '54%', delay: 0.9, pX: p4X, pY: p4Y },
  ];

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleHeroMouseMove}
      onMouseLeave={handleHeroMouseLeave}
      className="relative overflow-hidden pt-8 pb-16 md:pt-16 md:pb-24 bg-white text-center"
    >
      {/* Subtle Technical Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(25, 40, 55, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(25, 40, 55, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
      
      {/* Animated Drifting Ambient Radial Glows */}
      {!shouldReduceMotion ? (
        <>
          {/* Top Center Cyan/Blue Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.08, 1],
              x: [0, 20, 0],
              y: [0, -12, 0]
            }}
            transition={{
              duration: 16,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#18C7E8]/12 via-[#087FC1]/8 to-transparent blur-3xl rounded-full pointer-events-none z-0" 
          />
          
          {/* Left Light Blue Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              x: [0, -20, 0],
              y: [0, 18, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-1/4 -left-20 w-80 h-80 bg-[#087FC1]/6 rounded-full blur-3xl pointer-events-none z-0" 
          />
          
          {/* Right Light Purple Glow */}
          <motion.div 
            animate={{ 
              scale: [1, 1.12, 1],
              x: [0, 18, 0],
              y: [0, -16, 0]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="absolute top-1/3 -right-20 w-80 h-80 bg-[#7342E2]/6 rounded-full blur-3xl pointer-events-none z-0" 
          />
        </>
      ) : (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-to-b from-[#18C7E8]/10 via-[#087FC1]/6 to-transparent blur-3xl rounded-full pointer-events-none z-0" />
      )}

      {/* Floating Tech Elements with Slow Hover & Desktop Mouse Parallax */}
      <div className="hidden lg:block absolute inset-0 pointer-events-none max-w-[1340px] mx-auto z-10">
        {floatingVisuals.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={shouldReduceMotion ? { opacity: 0.85 } : { opacity: 0, scale: 0.8 }}
              animate={shouldReduceMotion ? { opacity: 0.85 } : { 
                opacity: 0.85, 
                scale: 1,
                y: [0, -10, 0]
              }}
              style={
                !isTouchDevice && !shouldReduceMotion
                  ? { left: item.x, top: item.y, x: item.pX, y: item.pY }
                  : { left: item.x, top: item.y }
              }
              transition={{
                opacity: { duration: 0.8, delay: 0.35 + idx * 0.12 },
                scale: { duration: 0.8, delay: 0.35 + idx * 0.12 },
                y: { duration: 5 + idx, repeat: Infinity, ease: 'easeInOut', delay: item.delay }
              }}
              className="absolute inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white/85 backdrop-blur-md border border-[rgba(25,40,55,0.08)] shadow-[0_8px_24px_rgba(25,40,55,0.06)] text-xs font-bold text-[#192837]"
            >
              <div className="w-5 h-5 rounded-lg bg-[#087FC1]/10 text-[#087FC1] flex items-center justify-center">
                <Icon className="w-3 h-3" />
              </div>
              <span>{item.label}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="relative z-20 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* 1. HERO TOP BADGE (Floating Pill with animated pulse dot) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.05, ease: easeOutQuart }}
          className="inline-flex items-center justify-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 px-4 sm:px-5 py-2 rounded-full border border-[rgba(8,127,193,0.20)] bg-white/85 backdrop-blur-[14px] shadow-[0_8px_30px_rgba(8,127,193,0.08)] text-xs font-semibold">
            {/* Animated Cyan/Blue Pulsing Dot */}
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18C7E8] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#087FC1]"></span>
            </span>

            <span className="font-extrabold text-[#192837] uppercase tracking-wider text-[11px] sm:text-xs">
              SKYROVIX BATCH 1 ENROLLMENTS
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block"></span>
            <span className="text-[#4C5B6D] hidden sm:inline-block">Starts Within 10 Days</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span className="font-extrabold text-[#00B978] bg-[#00B978]/10 px-2.5 py-0.5 rounded-full border border-[#00B978]/25 text-[11px]">
              ₹0 Internship Fee • ₹200 Registration Only
            </span>
          </div>
        </motion.div>

        {/* 2. HERO EYEBROW */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.12, ease: easeOutQuart }}
        >
          <p className="text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#087FC1]">
            OFFICIAL 3-MONTH FULL STACK DEVELOPMENT INTERNSHIP
          </p>
        </motion.div>

        {/* 3. HERO MAIN HEADLINE (Cinematic Text-Mask Reveal) */}
        <div className="max-w-5xl mx-auto space-y-1">
          <h1 className="font-heading font-extrabold text-center tracking-[-0.04em] leading-[0.98] text-[clamp(2.5rem,7vw,6.2rem)]">
            {/* Line 1: Build Real Systems */}
            <div className="overflow-hidden py-1">
              <motion.span
                initial={shouldReduceMotion ? { opacity: 1 } : { y: '105%', opacity: 0, filter: 'blur(8px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.85, delay: 0.18, ease: easeOutQuart }}
                className="block text-[#192837]"
              >
                Build Real Systems.
              </motion.span>
            </div>

            {/* Line 2: Deploy Production Apps */}
            <div className="overflow-hidden py-1">
              <motion.span
                initial={shouldReduceMotion ? { opacity: 1 } : { y: '105%', opacity: 0, filter: 'blur(10px)' }}
                animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                transition={{ duration: 0.9, delay: 0.32, ease: easeOutQuart }}
                className="block text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(110deg, #087FC1 0%, #18C7E8 45%, #7342E2 100%)'
                }}
              >
                Deploy Production Apps.
              </motion.span>
            </div>
          </h1>
        </div>

        {/* 4. HERO SUBHEADLINE */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.48, ease: easeOutQuart }}
        >
          <p className="text-[clamp(1rem,2vw,1.35rem)] font-bold text-[#192837] tracking-tight flex items-center justify-center flex-wrap gap-2 sm:gap-2.5">
            <span>Learn</span>
            <span className="text-[#18C7E8] font-black">•</span>
            <span>Build</span>
            <span className="text-[#18C7E8] font-black">•</span>
            <span>Test</span>
            <span className="text-[#18C7E8] font-black">•</span>
            <span>Deploy</span>
            <span className="text-[#18C7E8] font-black">•</span>
            <span>Showcase</span>
          </p>
        </motion.div>

        {/* 5. HERO DESCRIPTION */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.58, ease: easeOutQuart }}
          className="max-w-[680px] mx-auto"
        >
          <p className="text-[15px] sm:text-[18px] leading-[1.7] font-normal text-[#4C5B6D] text-center">
            Gain genuine full-stack experience through hands-on practical engineering. Master the complete software journey from initial idea to live domain deployment with AI tools, relational SQL databases, secure REST APIs, Cashfree payment gateway, and live Vercel deployments.
          </p>
        </motion.div>

        {/* 6. HERO CTA BUTTONS with Magnetic Hover & Micro-interactions */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 22, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.68, ease: easeOutQuart }}
          className="pt-2 space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-xl mx-auto">
            {/* PRIMARY: APPLY FOR BATCH 1 (₹200) */}
            <MagneticButton
              onClick={onOpenApply}
              className="w-full sm:w-auto"
            >
              <button
                id="hero-apply-btn"
                className="w-full sm:w-auto min-w-[280px] sm:min-w-[300px] h-[58px] inline-flex items-center justify-center gap-2.5 px-7 rounded-[20px] text-sm sm:text-base font-extrabold text-white cursor-pointer shadow-[0_15px_35px_rgba(8,127,193,0.22)] hover:shadow-[0_20px_45px_rgba(8,127,193,0.35)] transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: 'linear-gradient(135deg, #087FC1, #2447B8)'
                }}
              >
                <span>APPLY FOR BATCH 1</span>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-white/20 text-white border border-white/30">
                  ₹200
                </span>
                <ArrowRight className="w-5 h-5 ml-0.5" />
              </button>
            </MagneticButton>

            {/* SECONDARY: JOIN WHATSAPP GROUP */}
            <MagneticButton className="w-full sm:w-auto">
              <a
                href={officialWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-whatsapp-btn"
                className="w-full sm:w-auto min-w-[240px] h-[58px] inline-flex items-center justify-center gap-2.5 px-6 rounded-[20px] text-sm sm:text-base font-extrabold text-[#123F35] bg-[#ECFFF8] hover:bg-[#d8fced] border border-[#35D39A] shadow-xs cursor-pointer transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                <span>JOIN WHATSAPP GROUP</span>
              </a>
            </MagneticButton>
          </div>

          {/* 7. HERO SUPPORT LINKS */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.78, ease: easeOutQuart }}
            className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-6 text-[13px] sm:text-[14px] font-semibold text-[#4C5B6D] pt-2"
          >
            <a
              href="/guide"
              onClick={handleScrollToGuide}
              className="inline-flex items-center gap-1.5 text-[#087FC1] hover:text-[#7342E2] font-bold transition-colors cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#087FC1]" />
              <span>Explore Detailed Student Guide</span>
            </a>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#4C5B6D]">
              <Clock3 className="w-4 h-4 text-[#087FC1]" />
              <span>Batch Starts Within Next 10 Days</span>
            </span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="inline-flex items-center gap-1.5 text-[#00B978] font-bold">
              <ShieldCheck className="w-4 h-4 text-[#00B978]" />
              <span>Zero Tuition Fee</span>
            </span>
          </motion.div>
        </motion.div>

        {/* 8. HERO INFORMATION CARDS with SpotlightCard mouse tracking glow */}
        <div className="pt-8 sm:pt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 text-left max-w-[1280px] mx-auto">
            
            {/* Card 01: REAL PROJECTS */}
            <SpotlightCard
              spotlightColor="rgba(8, 127, 193, 0.12)"
              borderColor="rgba(8, 127, 193, 0.35)"
              className="p-6 rounded-[24px] bg-white/85 backdrop-blur-md border border-[rgba(25,40,55,0.08)] shadow-[0_10px_40px_rgba(25,40,55,0.06)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-black text-2xl text-[#087FC1]/40 group-hover:text-[#087FC1] transition-colors">
                  01
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#087FC1]/10 text-[#087FC1] flex items-center justify-center transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#087FC1] block mb-1">
                PRACTICAL CURRICULUM
              </span>
              <h3 className="font-heading font-bold text-lg text-[#192837] mb-1">
                Real Projects
              </h3>
              <p className="text-xs text-[#4C5B6D] leading-relaxed">
                50 progressive production deliverables moving from DOM fundamentals to multi-user full-stack apps.
              </p>
            </SpotlightCard>

            {/* Card 02: PRODUCTION DEPLOYMENT */}
            <SpotlightCard
              spotlightColor="rgba(24, 199, 232, 0.14)"
              borderColor="rgba(24, 199, 232, 0.35)"
              className="p-6 rounded-[24px] bg-white/85 backdrop-blur-md border border-[rgba(25,40,55,0.08)] shadow-[0_10px_40px_rgba(25,40,55,0.06)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-black text-2xl text-[#18C7E8]/40 group-hover:text-[#18C7E8] transition-colors">
                  02
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#18C7E8]/10 text-[#087FC1] flex items-center justify-center transition-transform">
                  <Rocket className="w-5 h-5" />
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#18C7E8] block mb-1">
                EDGE &amp; CLOUD DEPLOY
              </span>
              <h3 className="font-heading font-bold text-lg text-[#192837] mb-1">
                Production Deployment
              </h3>
              <p className="text-xs text-[#4C5B6D] leading-relaxed">
                Deploy live on Vercel and Render with live relational databases, custom domains, and automated SSL.
              </p>
            </SpotlightCard>

            {/* Card 03: AI-ASSISTED DEVELOPMENT */}
            <SpotlightCard
              spotlightColor="rgba(115, 66, 226, 0.14)"
              borderColor="rgba(115, 66, 226, 0.35)"
              className="p-6 rounded-[24px] bg-white/85 backdrop-blur-md border border-[rgba(25,40,55,0.08)] shadow-[0_10px_40px_rgba(25,40,55,0.06)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-black text-2xl text-[#7342E2]/40 group-hover:text-[#7342E2] transition-colors">
                  03
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#7342E2]/10 text-[#7342E2] flex items-center justify-center transition-transform">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#7342E2] block mb-1">
                MODERN ENGINEERING
              </span>
              <h3 className="font-heading font-bold text-lg text-[#192837] mb-1">
                AI-Assisted Development
              </h3>
              <p className="text-xs text-[#4C5B6D] leading-relaxed">
                Master AI developer tools for rapid scaffolding, automated test generation, code reviews, and schema modeling.
              </p>
            </SpotlightCard>

            {/* Card 04: CERTIFICATE */}
            <SpotlightCard
              spotlightColor="rgba(0, 185, 120, 0.14)"
              borderColor="rgba(0, 185, 120, 0.35)"
              className="p-6 rounded-[24px] bg-white/85 backdrop-blur-md border border-[rgba(25,40,55,0.08)] shadow-[0_10px_40px_rgba(25,40,55,0.06)]"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-heading font-black text-2xl text-[#00B978]/40 group-hover:text-[#00B978] transition-colors">
                  04
                </span>
                <div className="w-10 h-10 rounded-2xl bg-[#00B978]/10 text-[#00B978] flex items-center justify-center transition-transform">
                  <Award className="w-5 h-5" />
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#00B978] block mb-1">
                OFFICIAL CREDENTIAL
              </span>
              <h3 className="font-heading font-bold text-lg text-[#192837] mb-1">
                Verifiable Certificate
              </h3>
              <p className="text-xs text-[#4C5B6D] leading-relaxed">
                Receive an official, tamper-proof Skyrovix internship certificate with permanent online registry verification.
              </p>
            </SpotlightCard>

          </div>
        </div>

        {/* 100% Transparent Fee Structure Card with Spotlight */}
        <SpotlightCard
          spotlightColor="rgba(8, 127, 193, 0.08)"
          borderColor="rgba(8, 127, 193, 0.25)"
          className="max-w-2xl mx-auto p-6 sm:p-7 rounded-[24px] bg-white/90 backdrop-blur-md border border-[rgba(25,40,55,0.08)] shadow-[0_10px_40px_rgba(25,40,55,0.06)] text-left"
        >
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#00B978]/10 text-[#00B978] border border-[#00B978]/25">
                    Zero Tuition Fee
                  </span>
                  <span className="text-[10px] font-bold text-[#4C5B6D] uppercase tracking-wide">
                    • Official Batch 1 Enrollment
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl text-[#192837]">
                  100% Transparent Fee Structure
                </h3>
              </div>

              <div className="text-left sm:text-right">
                <div className="flex items-center sm:justify-end gap-2">
                  <span className="text-sm font-semibold text-slate-400 line-through">₹12,000</span>
                  <span className="font-heading font-black text-2xl text-[#00B978]">₹0 Fee</span>
                </div>
                <p className="text-xs font-extrabold text-[#192837]">
                  ₹200 Registration Fee Only
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-[#4C5B6D] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00B978] shrink-0" />
                <span>Full hands-on curriculum (3 or 6 months track)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00B978] shrink-0" />
                <span>No training fees or hidden course charges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00B978] shrink-0" />
                <span>Official Batch 1 WhatsApp orientation access</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#00B978] shrink-0" />
                <span>Verifiable Skyrovix Internship Certificate</span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Tech Stack Chip Bar */}
        <div className="pt-4 border-t border-[rgba(25,40,55,0.06)]">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#4C5B6D] mb-3">
            Full Stack Technologies Covered in Batch 1:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {techStack.map((tech) => (
              <span
                key={tech.name}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white border border-[rgba(25,40,55,0.08)] text-[#192837] shadow-2xs hover:border-[#087FC1]/40 hover:text-[#087FC1] transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#087FC1]"></span>
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
