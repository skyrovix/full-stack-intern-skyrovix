import React, { useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useReducedMotion } from 'framer-motion';
import { 
  Calendar, 
  ChevronDown, 
  FolderGit2, 
  CheckCircle2, 
  Sparkles, 
  Rocket, 
  ArrowRight,
  Clock,
  Layers
} from 'lucide-react';
import { roadmapData } from '../data/roadmap';
import { MagneticButton } from './MagneticButton';
import { SpotlightCard } from './SpotlightCard';

export const RoadmapTimeline = ({ onOpenApply }) => {
  const [expandedMonth, setExpandedMonth] = useState(1);
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleMonth = (m) => {
    setExpandedMonth(expandedMonth === m ? null : m);
  };

  // Track scroll through the roadmap container for the animated vertical line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 75%', 'end 35%']
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const easeOutQuart = [0.16, 1, 0.3, 1];

  return (
    <section 
      id="roadmap" 
      ref={containerRef}
      className="py-20 md:py-24 bg-[#F7F9FC] border-t border-[rgba(25,40,55,0.08)] relative overflow-hidden"
    >
      {/* Background subtle technical grid */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(25, 40, 55, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(25, 40, 55, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px'
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading with scroll reveal */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#087FC1]/10 text-[#087FC1] text-xs font-bold uppercase tracking-wider border border-[#087FC1]/20">
            <Calendar className="w-3.5 h-3.5 text-[#087FC1]" />
            <span>INTERACTIVE TIMELINE</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#192837] tracking-tight">
            3-Month Engineering Roadmap
          </h2>
          <p className="text-[#4C5B6D] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            A structured week-by-week sprint trajectory covering 50+ practical projects, progressing systematically from foundational UI to production-ready multi-tier systems.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00B978]/15 text-[#00B978] text-xs font-bold border border-[#00B978]/30">
              <CheckCircle2 className="w-4 h-4 text-[#00B978]" />
              Total 50+ Projects Across 3 Months
            </span>
          </div>
        </motion.div>

        {/* Timeline Container with vertical progress track */}
        <div className="relative max-w-5xl mx-auto">
          
          {/* Vertical Connecting Track (Desktop) */}
          <div className="hidden lg:block absolute left-8 top-12 bottom-12 w-0.5 bg-slate-200 pointer-events-none z-0">
            <motion.div 
              style={{ scaleY: shouldReduceMotion ? 1 : smoothProgress, transformOrigin: 'top' }}
              className="w-full h-full bg-gradient-to-b from-[#087FC1] via-[#18C7E8] to-[#7342E2]"
            />
          </div>

          {/* 3 Months Interactive Cards */}
          <div className="space-y-6">
            {roadmapData.map((stage, sIdx) => {
              const isExpanded = expandedMonth === stage.month;
              return (
                <motion.div
                  key={stage.month}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 30, filter: 'blur(4px)' }}
                  whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: sIdx * 0.12, ease: easeOutQuart }}
                  className={`relative rounded-[24px] border transition-all duration-300 overflow-hidden ${
                    isExpanded
                      ? 'border-[#087FC1] bg-white ring-4 ring-[#087FC1]/10 shadow-[0_15px_40px_rgba(8,127,193,0.12)]'
                      : 'border-[rgba(25,40,55,0.08)] bg-white hover:border-[#087FC1]/40 shadow-[0_8px_30px_rgba(25,40,55,0.04)]'
                  }`}
                >
                  {/* Header Strip */}
                  <div
                    onClick={() => toggleMonth(stage.month)}
                    className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none hover:bg-slate-50/70 transition-colors"
                  >
                    <div className="flex items-start md:items-center gap-4 text-left">
                      {/* Month Indicator Icon */}
                      <div className="relative">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#071426] to-[#0b1c34] text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                          <span className="text-[10px] font-bold text-[#18C7E8] uppercase tracking-wider">MONTH</span>
                          <span className="text-2xl font-extrabold leading-none">0{stage.month}</span>
                        </div>
                        {isExpanded && (
                          <span className="absolute -top-1 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18C7E8] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#087FC1]"></span>
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#087FC1]/10 text-[#087FC1] border border-[#087FC1]/20">
                            {stage.tag}
                          </span>
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#00B978]/10 text-[#00B978] border border-[#00B978]/20 flex items-center gap-1">
                            <FolderGit2 className="w-3 h-3 text-[#00B978]" />
                            {stage.projectCount}
                          </span>
                        </div>
                        <h3 className="font-heading text-xl sm:text-2xl font-black text-[#192837]">
                          {stage.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                      <span className="text-xs font-bold text-[#087FC1] hidden sm:inline">
                        {isExpanded ? 'Hide Weeks' : 'View 4 Weeks'}
                      </span>
                      <div className={`p-2 rounded-xl border transition-transform duration-200 ${
                        isExpanded ? 'bg-[#087FC1]/10 text-[#087FC1] border-[#087FC1]/20 rotate-180' : 'bg-slate-100 text-[#4C5B6D] border-slate-200'
                      }`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Smooth Accordion Expansion Body via AnimatePresence */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: easeOutQuart }}
                        className="overflow-hidden border-t border-slate-100"
                      >
                        <div className="px-6 pb-8 md:px-8 pt-6 text-left space-y-6">
                          
                          {/* Weekly Breakdown Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stage.weeks.map((week) => (
                              <div
                                key={week.weekNumber}
                                className="p-5 rounded-[20px] bg-[#F7F9FC] border border-[rgba(25,40,55,0.08)] space-y-3 hover:border-[#087FC1]/30 transition-colors"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#087FC1] bg-[#087FC1]/10 px-2.5 py-0.5 rounded-full">
                                    Week {week.weekNumber}
                                  </span>
                                  <span className="text-[11px] font-semibold text-[#4C5B6D]/70">
                                    {week.projects.length} Practical Apps
                                  </span>
                                </div>

                                <h4 className="font-heading text-sm font-bold text-[#192837] leading-snug">
                                  {week.title}
                                </h4>

                                {/* Topics List */}
                                <div className="space-y-1">
                                  <p className="text-[11px] font-bold text-[#4C5B6D]/70 uppercase tracking-wider">Core Topics:</p>
                                  <ul className="space-y-1">
                                    {week.topics.map((t, idx) => (
                                      <li key={idx} className="text-xs text-[#4C5B6D] flex items-start gap-1.5">
                                        <span className="text-[#087FC1] font-bold">•</span>
                                        <span>{t}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Projects built */}
                                <div className="pt-2 border-t border-slate-200/60">
                                  <p className="text-[11px] font-bold text-[#00B978] uppercase flex items-center gap-1 mb-1 tracking-wider">
                                    <Rocket className="w-3 h-3 text-[#00B978]" />
                                    Key Projects:
                                  </p>
                                  <div className="flex flex-wrap gap-1.5">
                                    {week.projects.map((p, idx) => (
                                      <span
                                        key={idx}
                                        className="text-[11px] font-medium bg-white text-[#192837] px-2.5 py-0.5 rounded-lg border border-[rgba(25,40,55,0.08)] shadow-2xs"
                                      >
                                        {p}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Milestone Banner */}
                          <div className="p-4 sm:p-5 rounded-[20px] bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-[#087FC1]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <Sparkles className="w-5 h-5 text-[#087FC1] shrink-0 mt-0.5" />
                              <div>
                                <p className="font-heading text-xs font-bold text-[#192837]">Month {stage.month} Milestone Output:</p>
                                <p className="text-xs text-[#4C5B6D] font-medium">{stage.milestone}</p>
                              </div>
                            </div>
                            <MagneticButton>
                              <button
                                onClick={onOpenApply}
                                className="shrink-0 px-5 py-2.5 text-white text-xs font-extrabold rounded-full transition-all cursor-pointer shadow-sm hover:shadow-md flex items-center gap-1.5"
                                style={{ background: 'linear-gradient(135deg, #087FC1, #2447B8)' }}
                              >
                                <span>Enroll for Month {stage.month}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </MagneticButton>
                          </div>

                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
