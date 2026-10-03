import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Workflow, 
  Cpu, 
  Database, 
  Globe, 
  ArrowRight, 
  ChevronRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';
import { StudentGuideView } from './StudentGuideView';

export const StudentGuideSection = ({ onOpenApply }) => {
  const [showFullModal, setShowFullModal] = useState(false);

  return (
    <section id="guide" className="py-20 bg-slate-100/60 dark:bg-slate-900/60 relative overflow-hidden border-t border-b border-slate-200/80 dark:border-slate-800">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 dark:bg-sky-900/50 text-sky-800 dark:text-sky-300 text-xs font-bold uppercase tracking-wider border border-sky-200 dark:border-sky-700">
            <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>COMPLETE 20-MODULE CURRICULUM BLUEPRINT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Detailed Student Guide
          </h2>
          
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
            Follow the complete software journey from initial idea to live domain deployment: <br className="hidden sm:block"/>
            <span className="font-semibold text-sky-700 dark:text-sky-400">
              AI Tools → Code → Backend → Database → GitHub → Vercel → Domain
            </span>
          </p>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            Learn • Build • Test • Deploy • Showcase • 100% Virtual • ₹0 Internship Fee • ₹200 Registration Fee
          </p>
        </div>

        {/* Embedded Interactive Guide Viewer */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-4 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-700">
          <StudentGuideView onOpenApply={onOpenApply} isEmbeddedInDashboard={false} />
        </div>

      </div>

    </section>
  );
};
