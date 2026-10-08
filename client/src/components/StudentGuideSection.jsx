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
    <section id="guide" className="py-20 md:py-24 bg-[#F7F9FC] relative overflow-hidden border-t border-b border-[rgba(25,40,55,0.08)]">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#087FC1]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#087FC1]/10 text-[#087FC1] text-xs font-bold uppercase tracking-wider border border-[#087FC1]/20">
            <BookOpen className="w-3.5 h-3.5 text-[#087FC1]" />
            <span>COMPLETE 20-MODULE CURRICULUM BLUEPRINT</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#192837] tracking-tight">
            Detailed Student Guide
          </h2>
          
          <p className="text-[#4C5B6D] text-base sm:text-lg">
            Follow the complete software journey from initial idea to live domain deployment: <br className="hidden sm:block"/>
            <span className="font-semibold text-[#087FC1]">
              AI Tools → Code → Backend → Database → GitHub → Vercel → Domain
            </span>
          </p>

          <p className="text-xs sm:text-sm text-[#4C5B6D]/80 font-medium">
            Learn • Build • Test • Deploy • Showcase • 100% Virtual • ₹0 Internship Fee • ₹200 Registration Fee
          </p>
        </div>

        {/* Embedded Interactive Guide Viewer */}
        <div className="bg-white rounded-[24px] p-4 sm:p-8 shadow-[0_15px_45px_rgba(25,40,55,0.06)] border border-[rgba(25,40,55,0.08)]">
          <StudentGuideView onOpenApply={onOpenApply} isEmbeddedInDashboard={false} />
        </div>

      </div>

    </section>
  );
};
