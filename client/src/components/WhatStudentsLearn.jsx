import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  Layout, 
  Server, 
  Database, 
  Terminal, 
  Check, 
  Sparkles, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import { curriculumModules } from '../data/curriculum';
import { SpotlightCard } from './SpotlightCard';
import { MagneticButton } from './MagneticButton';

export const WhatStudentsLearn = ({ onOpenApply }) => {
  const [activeTab, setActiveTab] = useState('frontend');
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

  const getIcon = (name) => {
    switch (name) {
      case 'Layout': return Layout;
      case 'Server': return Server;
      case 'Database': return Database;
      case 'Terminal': return Terminal;
      default: return Layers;
    }
  };

  return (
    <section id="curriculum" className="py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with scroll reveal */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#087FC1]/10 text-[#087FC1] text-xs font-bold uppercase tracking-wider border border-[#087FC1]/20">
            <Sparkles className="w-3.5 h-3.5 text-[#087FC1]" />
            <span>INDUSTRY-ALIGNED CURRICULUM</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#192837] tracking-tight">
            What Students Will Learn
          </h2>
          <p className="text-[#4C5B6D] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Master the complete full-stack lifecycle: from client-side interfaces and RESTful server microservices to relational database modeling, full stack deployments, and Git workflows.
          </p>
        </motion.div>

        {/* Tab Selector for Quick Switching */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: easeOutQuart }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {curriculumModules.map((mod) => {
            const Icon = getIcon(mod.iconName);
            const isActive = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm transition-all shadow-2xs cursor-pointer ${
                  isActive
                    ? 'bg-[#192837] text-white shadow-md'
                    : 'bg-white text-[#4C5B6D] hover:bg-[#F7F9FC] border border-[rgba(25,40,55,0.10)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#18C7E8]' : 'text-slate-400'}`} />
                <span>{mod.category}</span>
              </button>
            );
          })}
        </motion.div>

        {/* 4 Pillars Grid View with SpotlightCard and staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {curriculumModules.map((mod, idx) => {
            const Icon = getIcon(mod.iconName);
            const isHighlight = activeTab === mod.id;
            return (
              <motion.div
                key={mod.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: idx * 0.09, ease: easeOutQuart }}
              >
                <SpotlightCard
                  spotlightColor={isHighlight ? 'rgba(8, 127, 193, 0.15)' : 'rgba(25, 40, 55, 0.05)'}
                  hoverY={-5}
                  onClick={() => setActiveTab(mod.id)}
                  className={`p-6 sm:p-7 rounded-[24px] transition-all duration-300 cursor-pointer flex flex-col justify-between h-full ${
                    isHighlight
                      ? 'bg-white border-2 border-[#087FC1] shadow-[0_15px_40px_rgba(8,127,193,0.15)] ring-4 ring-[#087FC1]/10'
                      : 'bg-white border border-[rgba(25,40,55,0.08)] shadow-[0_8px_30px_rgba(25,40,55,0.04)] hover:border-[#087FC1]/40'
                  }`}
                >
                  <div>
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-3 rounded-2xl ${mod.bgColor} ${mod.textColor} border ${mod.borderColor}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-[#192837]">
                          {mod.category.split(' ')[0]}
                        </h3>
                        <span className="text-[11px] font-semibold text-[#4C5B6D]/70 uppercase tracking-wide">
                          Core Module
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-[#4C5B6D] mb-5 leading-relaxed font-normal">
                      {mod.summary}
                    </p>

                    {/* Skills Checklist */}
                    <div className="space-y-2.5 mb-6">
                      {mod.skills.map((skill, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2">
                          <div className="w-4 h-4 rounded-full bg-[#00B978]/15 text-[#00B978] flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="text-xs font-semibold text-[#192837] leading-snug">
                            {skill}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Technologies */}
                  <div className="pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-[#4C5B6D]/70 block mb-2 tracking-wider">
                      Industry Tools:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {mod.tools.map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#F7F9FC] text-[#192837] border border-[rgba(25,40,55,0.08)]"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: easeOutQuart }}
          className="mt-14 text-center"
        >
          <p className="text-sm font-semibold text-[#4C5B6D] mb-4">
            All curriculum pillars are integrated directly into the complete software journey: AI Tools → Code → Backend → Database → GitHub → Vercel → Domain.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <MagneticButton>
              <button
                onClick={() => {
                  const el = document.getElementById('guide');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#192837] hover:text-[#7342E2] bg-white hover:bg-[#F7F9FC] px-6 py-3.5 rounded-[20px] border border-[rgba(25,40,55,0.12)] transition-all shadow-2xs cursor-pointer"
              >
                <span>Explore Detailed 20-Module Student Guide</span>
                <ArrowRight className="w-4 h-4 text-[#087FC1]" />
              </button>
            </MagneticButton>
            <MagneticButton>
              <button
                onClick={onOpenApply}
                className="inline-flex items-center gap-2 text-sm font-extrabold text-white px-7 py-3.5 rounded-[20px] shadow-lg transition-all cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #087FC1, #2447B8)',
                  boxShadow: '0 10px 25px rgba(8,127,193,0.25)'
                }}
              >
                <span>Apply for Batch 1 (Registration: ₹200)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </MagneticButton>
          </div>
        </motion.div>

      </div>
    </section>
  );
};
