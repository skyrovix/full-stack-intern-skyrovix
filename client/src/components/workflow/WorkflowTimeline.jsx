import React from 'react';
import { Linkedin } from './LinkedInIcon';
import { 
  CheckCircle2, 
  Lock, 
  Clock, 
  AlertCircle, 
  GraduationCap, 
  FolderGit2, 
  ChevronRight 
} from 'lucide-react';

export const WorkflowTimeline = ({ workflow, onSelectStage, activeStageTab, activeTab }) => {
  if (!workflow) return null;
  const currentTab = activeTab !== undefined ? activeTab : activeStageTab;

  const {
    current_stage = 1,
    stage1_status = 'PENDING',
    stage2_status = 'LOCKED',
    stage3_status = 'LOCKED',
    is_manually_locked = false,
    manual_lock_reason,
    training_progress
  } = workflow;

  const completedModules = training_progress?.approved_count || 0;
  const totalModules = training_progress?.total_count || 5;

  const stages = [
    {
      id: 1,
      name: 'Stage 1',
      title: 'Offer Letter & LinkedIn',
      desc: 'Publish offer letter & verify post link',
      icon: Linkedin,
      status: stage1_status,
      isCompleted: stage1_status === 'APPROVED',
      isCurrent: current_stage === 1 && stage1_status !== 'APPROVED',
      isLocked: false,
      badgeText: stage1_status === 'APPROVED' ? 'Approved' : stage1_status === 'SUBMITTED' ? 'Under Review' : stage1_status === 'REJECTED' ? 'Revision Needed' : 'Action Required'
    },
    {
      id: 2,
      name: 'Stage 2',
      title: 'Training & Learning',
      desc: `${completedModules} of ${totalModules} modules approved`,
      icon: GraduationCap,
      status: stage2_status,
      isCompleted: stage2_status === 'COMPLETED' || completedModules >= totalModules,
      isCurrent: current_stage === 2 || (stage1_status === 'APPROVED' && stage2_status !== 'COMPLETED'),
      isLocked: stage1_status !== 'APPROVED',
      badgeText: (stage2_status === 'COMPLETED' || completedModules >= totalModules)
        ? 'Completed' 
        : stage1_status !== 'APPROVED' 
        ? 'Locked' 
        : `${completedModules}/${totalModules} Approved`
    },
    {
      id: 3,
      name: 'Stage 3',
      title: 'Internship Projects',
      desc: 'Production projects & code evaluations',
      icon: FolderGit2,
      status: stage3_status,
      isCompleted: stage3_status === 'COMPLETED',
      isCurrent: stage3_status === 'UNLOCKED' || current_stage === 3,
      isLocked: stage3_status !== 'UNLOCKED' && stage3_status !== 'COMPLETED',
      badgeText: (stage3_status === 'UNLOCKED' || stage3_status === 'COMPLETED') ? 'Unlocked' : 'Locked'
    }
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 mb-6">
      {/* Top Banner Notice if Manually Locked */}
      {is_manually_locked && (
        <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-3 text-xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm">Workflow Access Temporarily Locked by Administrator</span>
            <p className="mt-0.5 text-rose-700">Reason: {manual_lock_reason || 'Administrative review in progress. Please contact support.'}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#07284a]/10 text-[#07284a]">
              Sequential Progression
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Stage {current_stage} of 3
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Internship Access & Milestone Workflow
          </h3>
        </div>
        <div className="text-xs text-slate-500">
          Each stage unlocks strictly upon approval of the previous stage.
        </div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 relative">
        {stages.map((st, idx) => {
          const StepIcon = st.icon;
          const isSelected = currentTab === st.id;

          let cardBorder = 'border-slate-200 hover:border-slate-300';
          let bgGrad = 'bg-slate-50/60';
          let iconColor = 'bg-slate-200 text-slate-600';
          let badgeBg = 'bg-slate-100 text-slate-600';

          if (st.isCompleted) {
            cardBorder = 'border-emerald-200 bg-emerald-50/30';
            iconColor = 'bg-emerald-100 text-emerald-700';
            badgeBg = 'bg-emerald-100 text-emerald-800 border border-emerald-200';
          } else if (st.isCurrent && !st.isLocked) {
            cardBorder = 'border-sky-300 bg-sky-50/40 ring-2 ring-sky-400/20';
            iconColor = 'bg-[#07284a] text-white shadow-sm';
            badgeBg = 'bg-[#07284a] text-white';
          } else if (st.isLocked) {
            cardBorder = 'border-slate-200 bg-slate-50/40 opacity-80';
            iconColor = 'bg-slate-200 text-slate-500';
            badgeBg = 'bg-slate-200 text-slate-600';
          }

          if (st.status === 'REJECTED') {
            badgeBg = 'bg-rose-100 text-rose-800 border border-rose-200';
          } else if (st.status === 'SUBMITTED') {
            badgeBg = 'bg-amber-100 text-amber-800 border border-amber-200';
          }

          return (
            <button
              key={st.id}
              onClick={() => onSelectStage && onSelectStage(st.id)}
              className={`text-left p-4 rounded-2xl border transition-all relative flex flex-col justify-between ${cardBorder} ${bgGrad} ${
                isSelected ? 'shadow-md ring-2 ring-[#07284a]' : 'hover:shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${iconColor}`}>
                    {st.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : st.isLocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : (
                      <StepIcon className="w-5 h-5" />
                    )}
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                    {st.badgeText}
                  </span>
                </div>

                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  {st.name}
                </div>
                <h4 className="text-sm font-bold text-slate-900 mt-0.5 leading-snug">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {st.desc}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold">
                <span className={st.isLocked ? 'text-slate-400' : 'text-[#07284a]'}>
                  {st.isCompleted ? '✓ Passed & Approved' : st.isLocked ? '🔒 Locked' : '→ View Stage Details'}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
