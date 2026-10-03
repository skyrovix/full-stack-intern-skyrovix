import React from 'react';
import { 
  Lock, 
  FolderGit2, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle, 
  GraduationCap, 
  ShieldAlert 
} from 'lucide-react';

export const Stage3ProjectLocked = ({ workflow, lockReason, onGoToTraining }) => {
  const isManuallyLocked = workflow?.is_manually_locked;
  const manualLockReason = workflow?.manual_lock_reason;
  const trainingProgress = workflow?.training_progress;

  const approvedCount = trainingProgress?.approved_count || 0;
  const totalCount = trainingProgress?.total_count || 5;
  const progressPct = Math.round((approvedCount / totalCount) * 100);

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-center">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 sm:p-12 space-y-6">
        
        {/* Lock Icon with Ring */}
        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-inner ring-8 ${
          isManuallyLocked 
            ? 'bg-rose-100 text-rose-600 ring-rose-50' 
            : 'bg-amber-100 text-amber-700 ring-amber-50'
        }`}>
          {isManuallyLocked ? (
            <ShieldAlert className="w-10 h-10" />
          ) : (
            <Lock className="w-10 h-10" />
          )}
        </div>

        {/* Title & Key Message */}
        <div className="space-y-2">
          <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${
            isManuallyLocked 
              ? 'bg-rose-50 text-rose-800 border-rose-200' 
              : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isManuallyLocked ? 'Access Temporarily Suspended' : 'Stage 3 Locked'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-2">
            Internship Project Dashboard Is Locked
          </h2>
          
          {/* Required Exact Message */}
          <div className="pt-2">
            <p className="text-slate-800 font-bold text-base sm:text-lg max-w-lg mx-auto leading-snug">
              {isManuallyLocked 
                ? (manualLockReason || lockReason || 'Your project access has been temporarily locked by an administrator.')
                : (lockReason || 'Complete all required Training & Learning modules to unlock your Internship Project.')}
            </p>
          </div>
        </div>

        {/* Training Progress Bar */}
        {!isManuallyLocked && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-md mx-auto space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700">Stage 2 Training Progress:</span>
              <span className="font-extrabold text-[#07284a] text-sm">
                {approvedCount} / {totalCount} Modules Approved
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-[#07284a] rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            <p className="text-[11px] text-slate-500">
              Each of the 5 training modules must be completed and approved by mentors before you can start submitting your assigned 50 production internship projects.
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoToTraining}
            className="w-full sm:w-auto py-3.5 px-6 rounded-xl bg-[#07284a] hover:bg-[#0c3968] text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <GraduationCap className="w-4 h-4 text-sky-400" />
            <span>Open Training & Learning Modules →</span>
          </button>
        </div>

      </div>
    </div>
  );
};
