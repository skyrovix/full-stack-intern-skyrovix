import React, { useState } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  FolderGit2, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Rocket, 
  Code2, 
  Database, 
  Globe 
} from 'lucide-react';
import { roadmapData } from '../data/roadmap';

export const RoadmapTimeline = ({ onOpenApply }) => {
  const [expandedMonth, setExpandedMonth] = useState(1);

  const toggleMonth = (m) => {
    setExpandedMonth(expandedMonth === m ? null : m);
  };

  return (
    <section id="roadmap" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider border border-blue-200">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            <span>INTERACTIVE TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            3-Month Engineering Roadmap
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            A structured week-by-week sprint trajectory covering 50+ practical projects, progressing systematically from foundational UI to production-ready multi-tier systems.
          </p>
          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100/80 text-emerald-900 text-xs font-bold border border-emerald-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Total 50+ Projects Across 3 Months
            </span>
          </div>
        </div>

        {/* 3 Months Interactive Cards */}
        <div className="space-y-6 max-w-5xl mx-auto">
          {roadmapData.map((stage) => {
            const isExpanded = expandedMonth === stage.month;
            return (
              <div
                key={stage.month}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-soft ${
                  isExpanded
                    ? 'border-sky-400 bg-white ring-4 ring-sky-50 shadow-lg'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Header Strip */}
                <div
                  onClick={() => toggleMonth(stage.month)}
                  className="p-6 md:p-8 cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none hover:bg-slate-50/60 transition-colors"
                >
                  <div className="flex items-start md:items-center gap-4 text-left">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white flex flex-col items-center justify-center shrink-0 shadow-md">
                      <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">MONTH</span>
                      <span className="text-2xl font-extrabold leading-none">0{stage.month}</span>
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">
                          {stage.tag}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <FolderGit2 className="w-3 h-3 text-emerald-600" />
                          {stage.projectCount}
                        </span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                        {stage.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
                    <span className="text-xs font-bold text-sky-700 hidden sm:inline">
                      {isExpanded ? 'Hide Weeks' : 'View 4 Weeks'}
                    </span>
                    <div className={`p-2 rounded-xl border transition-transform duration-200 ${
                      isExpanded ? 'bg-sky-50 text-sky-700 border-sky-200 rotate-180' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-6 pb-8 md:px-8 pt-2 border-t border-slate-100 text-left space-y-6 animate-in slide-in-from-top duration-200">
                    
                    {/* Weekly Breakdown Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stage.weeks.map((week) => (
                        <div
                          key={week.weekNumber}
                          className="p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                              Week {week.weekNumber}
                            </span>
                            <span className="text-[11px] font-semibold text-slate-500">
                              {week.projects.length} Practical Apps
                            </span>
                          </div>

                          <h4 className="text-sm font-bold text-slate-900 leading-snug">
                            {week.title}
                          </h4>

                          {/* Topics List */}
                          <div className="space-y-1">
                            <p className="text-[11px] font-bold text-slate-500 uppercase">Core Topics:</p>
                            <ul className="space-y-1">
                              {week.topics.map((t, idx) => (
                                <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                                  <span className="text-sky-500 font-bold">•</span>
                                  <span>{t}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Projects built */}
                          <div className="pt-2 border-t border-slate-200/60">
                            <p className="text-[11px] font-bold text-emerald-700 uppercase flex items-center gap-1 mb-1">
                              <Rocket className="w-3 h-3 text-emerald-600" />
                              Key Projects:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {week.projects.map((p, idx) => (
                                <span
                                  key={idx}
                                  className="text-[11px] font-medium bg-white text-slate-800 px-2 py-0.5 rounded border border-slate-200"
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
                    <div className="p-4 rounded-xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-slate-900">Month {stage.month} Milestone Output:</p>
                          <p className="text-xs text-slate-700 font-medium">{stage.milestone}</p>
                        </div>
                      </div>
                      <button
                        onClick={onOpenApply}
                        className="shrink-0 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        Enroll for Month {stage.month}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
