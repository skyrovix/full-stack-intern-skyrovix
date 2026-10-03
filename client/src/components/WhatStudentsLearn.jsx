import React, { useState } from 'react';
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

export const WhatStudentsLearn = ({ onOpenApply }) => {
  const [activeTab, setActiveTab] = useState('frontend');

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
    <section id="curriculum" className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>INDUSTRY-ALIGNED CURRICULUM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            What Students Will Learn
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Master the complete full-stack lifecycle: from client-side interfaces and RESTful server microservices to relational database modeling, full stack deployments, and Git workflows.
          </p>
        </div>

        {/* Tab Selector for Quick Switching */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {curriculumModules.map((mod) => {
            const Icon = getIcon(mod.iconName);
            const isActive = activeTab === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{mod.category}</span>
              </button>
            );
          })}
        </div>

        {/* 4 Pillars Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {curriculumModules.map((mod) => {
            const Icon = getIcon(mod.iconName);
            const isHighlight = activeTab === mod.id;
            return (
              <div
                key={mod.id}
                onClick={() => setActiveTab(mod.id)}
                className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isHighlight
                    ? 'bg-white border-2 border-sky-500 shadow-xl ring-4 ring-sky-100 -translate-y-1'
                    : 'bg-white border border-slate-200 shadow-soft hover:border-slate-300 hover:-translate-y-0.5'
                }`}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl ${mod.bgColor} ${mod.textColor} border ${mod.borderColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {mod.category.split(' ')[0]}
                      </h3>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                        Core Module
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                    {mod.summary}
                  </p>

                  {/* Skills Checklist */}
                  <div className="space-y-2.5 mb-6">
                    {mod.skills.map((skill, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 leading-snug">
                          {skill}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools & Technologies */}
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block mb-2">
                    Industry Tools:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {mod.tools.map((tool, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 text-center">
          <p className="text-sm font-semibold text-slate-600 mb-4">
            All curriculum pillars are integrated directly into the complete software journey: AI Tools → Code → Backend → Database → GitHub → Vercel → Domain.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById('guide');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-sky-700 bg-white hover:bg-slate-50 px-5 py-2.5 rounded-xl border border-slate-300 transition-colors shadow-2xs cursor-pointer"
            >
              <span>Explore Detailed 20-Module Student Guide</span>
              <ArrowRight className="w-4 h-4 text-sky-600" />
            </button>
            <button
              onClick={onOpenApply}
              className="inline-flex items-center gap-2 text-sm font-bold text-white bg-sky-600 hover:bg-sky-700 px-5 py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>Apply for Batch 1 (Registration: ₹200)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
