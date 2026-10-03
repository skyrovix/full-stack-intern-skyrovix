import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Lock, 
  ExternalLink, 
  Send, 
  FileCode, 
  Database, 
  Server, 
  Layout, 
  Cloud, 
  Terminal, 
  BookOpen, 
  ChevronDown, 
  ChevronUp, 
  RefreshCw,
  FolderGit2,
  Sparkles,
  ArrowRight,
  X,
  Copy,
  Check,
  Compass,
  ListChecks,
  Lightbulb,
  Layers
} from 'lucide-react';
import { TRAINING_MODULES_DETAIL } from '../../data/trainingModulesDetail';

export const Stage2Training = ({ 
  workflow, 
  onRefresh, 
  onShowToast, 
  onGoToProjects,
  onProceedToProjects,
  onOpenGuide
}) => {
  const goToProjects = onGoToProjects || onProceedToProjects;
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState(null);
  
  // Submission modal state
  const [activeSubmitModule, setActiveSubmitModule] = useState(null);
  const [submitForm, setSubmitForm] = useState({
    github_url: '',
    live_demo_url: '',
    notes: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [copiedCommand, setCopiedCommand] = useState(null);
  const [moduleActiveTab, setModuleActiveTab] = useState({});

  const handleCopyCommand = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedCommand(id);
      setTimeout(() => setCopiedCommand(null), 2000);
      onShowToast && onShowToast('Command copied to clipboard!');
    }
  };

  const isStage1Approved = workflow?.stage1_status === 'APPROVED';
  const isManuallyLocked = workflow?.is_manually_locked;

  // Icons for 5 modules
  const moduleIcons = {
    1: Terminal,
    2: Database,
    3: Server,
    4: Layout,
    5: Cloud
  };

  const fetchModules = async () => {
    try {
      setLoading(true);
      const studentId = localStorage.getItem('skyrovix_student_id') || workflow?.student_id;
      const res = await fetch(`/api/user/workflow/training-modules?studentId=${studentId}`);
      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to load training modules');
        return;
      }

      setModules(data.modules || []);
      if (!expandedModuleId && data.modules?.length > 0) {
        // Expand the first incomplete module or first module
        const firstIncomplete = data.modules.find(m => m.status !== 'APPROVED');
        setExpandedModuleId(firstIncomplete ? firstIncomplete.id : data.modules[0].id);
      }
    } catch (err) {
      setLoading(false);
      setError('Network error fetching training curriculum.');
    }
  };

  useEffect(() => {
    if (isStage1Approved) {
      fetchModules();
    } else {
      setLoading(false);
    }
  }, [isStage1Approved, workflow?.id]);

  const handleOpenSubmit = (mod) => {
    setActiveSubmitModule(mod);
    setSubmitForm({
      github_url: mod.submission?.github_url || '',
      live_demo_url: mod.submission?.live_demo_url || mod.submission?.submission_url || '',
      notes: mod.submission?.notes || ''
    });
    setSubmitError('');
  };

  const handleSubmitModuleAssignment = async (e) => {
    e.preventDefault();
    if (!submitForm.github_url.trim() && !submitForm.live_demo_url.trim()) {
      setSubmitError('Please provide at least your GitHub repository URL or live project link.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    try {
      const studentId = localStorage.getItem('skyrovix_student_id') || workflow?.student_id;
      const res = await fetch(`/api/user/workflow/training-modules/${activeSubmitModule.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          github_url: submitForm.github_url.trim(),
          live_demo_url: submitForm.live_demo_url.trim(),
          notes: submitForm.notes.trim()
        })
      });
      const data = await res.json();
      setSubmitting(false);

      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Failed to submit module assignment.');
        return;
      }

      onShowToast && onShowToast('Assignment submitted successfully for mentor evaluation!');
      setActiveSubmitModule(null);
      fetchModules();
      onRefresh && onRefresh();
    } catch (err) {
      setSubmitting(false);
      setSubmitError('Server communication error.');
    }
  };

  // If Stage 1 is NOT approved, show lock card
  if (!isStage1Approved) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 sm:p-12 text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-inner ring-8 ring-slate-50">
          <Lock className="w-10 h-10 text-slate-600" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Stage 2 Locked
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-1">
            Training & Learning Is Locked
          </h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
            You must complete <strong>Stage 1 (Offer Letter & LinkedIn Publication)</strong> and receive administrator approval before unlocking the 5 training modules.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2 max-w-md mx-auto">
          <div className="font-bold text-slate-800">Unlock Requirement:</div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Publish official Skyrovix offer letter on LinkedIn</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Submit post URL in Stage 1 tab for mentor verification</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Admin approves submission → Stage 2 unlocks automatically</span>
          </div>
        </div>
      </div>
    );
  }

  const approvedCount = modules.filter(m => m.status === 'APPROVED').length;
  const totalCount = modules.length || 5;
  const progressPct = Math.round((approvedCount / totalCount) * 100);
  const isAllApproved = approvedCount >= totalCount;

  return (
    <div className="space-y-6">
      {/* Top Banner with Progress Bar */}
      <div className="bg-gradient-to-r from-[#07284a] via-[#0d3b66] to-[#0a2540] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-bold tracking-wide uppercase border border-sky-400/30">
                Stage 2 of 3
              </span>
              <span className="text-xs text-sky-200">Interactive Curriculum</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Training & Learning Modules
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Complete the five foundational modules covering modern AI workflows, normalized database design, secure Express APIs, React SPA integration, and full stack deployment.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold">Training Progress</span>
              <span className="text-emerald-400 font-extrabold text-sm">
                {approvedCount} / {totalCount} Modules
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300">
              <span>{progressPct}% Completed</span>
              {isAllApproved ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Stage Complete
                </span>
              ) : (
                <span className="text-amber-300 font-medium">
                  {totalCount - approvedCount} Remaining
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Completion Banner */}
      {isAllApproved && (
        <div className="p-6 rounded-3xl bg-emerald-50 border-2 border-emerald-300 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-extrabold text-emerald-950 text-base">
                🎉 Congratulations! Training & Learning Stage Completed
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                All 5 modules have been reviewed and approved by the mentor board. Stage 3 (Internship Projects) is now fully unlocked.
              </p>
            </div>
          </div>
          {goToProjects && (
            <button
              onClick={goToProjects}
              className="py-3 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-md shrink-0 cursor-pointer"
            >
              <FolderGit2 className="w-4 h-4" />
              <span>Go to Internship Projects →</span>
            </button>
          )}
        </div>
      )}

      {/* Loading & Error States */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500">Loading module curriculum and submissions...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Detailed Student Guide Quick Link Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-800 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 border border-sky-400/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Detailed Student Guide &amp; 20-Module Blueprint</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-400/20 text-sky-300 border border-sky-400/30">Official</span>
            </h4>
            <p className="text-xs text-slate-300">
              AI Tools → Code → Backend → Database → GitHub → Vercel → Domain • Reference all 20 modules, prompts, DNS guides &amp; final assessment checklist.
            </p>
          </div>
        </div>
        {onOpenGuide && (
          <button
            onClick={onOpenGuide}
            className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5 shrink-0 self-start sm:self-center shadow-sm cursor-pointer"
          >
            <span>Open Student Guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 5 Modules List */}
      {!loading && (
        <div className="space-y-4">
          {modules.map((mod) => {
            const isExpanded = expandedModuleId === mod.id;
            const ModIcon = moduleIcons[mod.module_num] || Terminal;
            const sub = mod.submission;
            const status = mod.status || 'NOT_STARTED';
            const detail = TRAINING_MODULES_DETAIL[mod.module_num] || {};

            let badgeBg = 'bg-slate-100 text-slate-600 border-slate-200';
            let badgeText = 'Not Started';
            if (status === 'APPROVED') {
              badgeBg = 'bg-emerald-100 text-emerald-800 border-emerald-200';
              badgeText = 'Approved & Passed';
            } else if (status === 'SUBMITTED') {
              badgeBg = 'bg-amber-100 text-amber-800 border-amber-200';
              badgeText = 'Pending Mentor Evaluation';
            } else if (status === 'REJECTED') {
              badgeBg = 'bg-rose-100 text-rose-800 border-rose-200';
              badgeText = 'Revision Required';
            }

            return (
              <div 
                key={mod.id}
                className={`bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                  status === 'APPROVED' 
                    ? 'border-emerald-200 shadow-xs' 
                    : isExpanded 
                    ? 'border-sky-300 shadow-md ring-2 ring-sky-100' 
                    : 'border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {/* Module Header Row */}
                <div 
                  onClick={() => setExpandedModuleId(isExpanded ? null : mod.id)}
                  className="p-5 sm:p-6 flex items-start sm:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : status === 'SUBMITTED'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#07284a] text-white shadow-xs'
                    }`}>
                      {status === 'APPROVED' ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      ) : (
                        <ModIcon className="w-6 h-6" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                          Module {mod.module_num}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeBg}`}>
                          {badgeText}
                        </span>
                        {detail.level && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {detail.level}
                          </span>
                        )}
                        {detail.est_duration && (
                          <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {detail.est_duration}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                        {mod.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1 sm:line-clamp-none">
                        {mod.description}
                      </p>

                      {/* Tech stack badges */}
                      {detail.techStack && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                          {detail.techStack.map((tech, idx) => (
                            <span key={idx} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {status !== 'APPROVED' && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenSubmit(mod);
                        }}
                        className="hidden sm:inline-flex py-2 px-3.5 bg-[#07284a] hover:bg-[#0c3968] text-white font-bold text-xs rounded-xl shadow-xs transition items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-sky-400" />
                        <span>{status === 'SUBMITTED' ? 'Edit Work' : status === 'REJECTED' ? 'Resubmit' : 'Submit Assignment'}</span>
                      </button>
                    )}

                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (() => {
                  const currentTab = moduleActiveTab[mod.id] || 'guide';

                  return (
                    <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-slate-100 space-y-6 text-xs">
                      
                      {/* Sub-Tabs Bar */}
                      <div className="flex items-center gap-1.5 border-b border-slate-200 pb-2.5 overflow-x-auto">
                        <button
                          type="button"
                          onClick={() => setModuleActiveTab(prev => ({ ...prev, [mod.id]: 'guide' }))}
                          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            currentTab === 'guide'
                              ? 'bg-[#07284a] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <Compass className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Step-by-Step Practical Guide</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModuleActiveTab(prev => ({ ...prev, [mod.id]: 'tasks' }))}
                          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            currentTab === 'tasks'
                              ? 'bg-[#07284a] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                          <span>Objectives &amp; Exercises</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModuleActiveTab(prev => ({ ...prev, [mod.id]: 'checklist' }))}
                          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            currentTab === 'checklist'
                              ? 'bg-[#07284a] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <ListChecks className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Submission Checklist</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setModuleActiveTab(prev => ({ ...prev, [mod.id]: 'resources' }))}
                          className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                            currentTab === 'resources'
                              ? 'bg-[#07284a] text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Resources &amp; Docs</span>
                        </button>
                      </div>

                      {/* Mentor Feedback Box if Rejected or Approved with comment */}
                      {sub?.admin_feedback && (
                        <div className={`p-4 rounded-2xl border ${
                          status === 'REJECTED' 
                            ? 'bg-rose-50 border-rose-200 text-rose-900' 
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}>
                          <div className="flex items-center gap-2 font-bold mb-1">
                            {status === 'REJECTED' ? (
                              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            ) : (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            <span>Mentor Feedback:</span>
                          </div>
                          <p className="text-xs leading-relaxed">{sub.admin_feedback}</p>
                        </div>
                      )}

                      {/* Tab 1: Step-by-Step Practical Guide */}
                      {currentTab === 'guide' && (
                        <div className="space-y-6">
                          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950 via-[#07284a] to-slate-900 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-sky-800/60">
                            <div className="space-y-1">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 font-bold text-[10px] uppercase tracking-wider">
                                <Compass className="w-3 h-3 text-cyan-400" />
                                <span>Step-by-Step Practical Roadmap</span>
                              </div>
                              <h4 className="text-sm sm:text-base font-bold text-white">
                                {detail.title || mod.title}
                              </h4>
                              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                                {detail.overview || mod.description}
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center gap-2">
                              <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 text-cyan-200">
                                ⏱ Est. {detail.est_duration || '3-5 Days'}
                              </span>
                            </div>
                          </div>

                          {/* Stepper Timeline */}
                          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-sky-200">
                            {(detail.steps || []).map((step) => {
                              const copyId = `${mod.id}-step-${step.stepNumber}`;
                              const isCopied = copiedCommand === copyId;

                              return (
                                <div key={step.stepNumber} className="relative group">
                                  {/* Step Number Circle */}
                                  <div className="absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#07284a] border-2 border-white text-white font-bold text-xs flex items-center justify-center shadow-md">
                                    {step.stepNumber}
                                  </div>

                                  <div className="bg-slate-50/80 hover:bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3 transition">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                      <div>
                                        <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider block">
                                          Step {step.stepNumber} • Milestone
                                        </span>
                                        <h5 className="text-sm font-bold text-slate-900">
                                          {step.title}
                                        </h5>
                                      </div>
                                      {step.deliverable && (
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold w-fit">
                                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                                          <span>Target: {step.deliverable}</span>
                                        </div>
                                      )}
                                    </div>

                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {step.details || step.summary}
                                    </p>

                                    {/* Command / Code Snippet */}
                                    {step.command && (
                                      <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner text-left">
                                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] text-slate-400">
                                          <span className="font-mono flex items-center gap-1.5">
                                            <Terminal className="w-3 h-3 text-sky-400" />
                                            <span>Terminal Command / Pattern</span>
                                          </span>
                                          <button
                                            type="button"
                                            onClick={() => handleCopyCommand(step.command, copyId)}
                                            className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-300 hover:text-white transition cursor-pointer px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
                                          >
                                            {isCopied ? (
                                              <>
                                                <Check className="w-3 h-3 text-emerald-400" />
                                                <span className="text-emerald-400">Copied!</span>
                                              </>
                                            ) : (
                                              <>
                                                <Copy className="w-3 h-3" />
                                                <span>Copy</span>
                                              </>
                                            )}
                                          </button>
                                        </div>
                                        <pre className="p-3 text-[11px] font-mono text-cyan-300 overflow-x-auto whitespace-pre leading-relaxed">
                                          {step.command}
                                        </pre>
                                      </div>
                                    )}

                                    {/* Pro Tip */}
                                    {step.proTip && (
                                      <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] flex items-start gap-2">
                                        <Lightbulb className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                                        <span><strong className="font-bold">Engineering Pro Tip:</strong> {step.proTip}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Quick Submit Banner at bottom of Guide */}
                          {status !== 'APPROVED' && (
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                              <div className="space-y-0.5 text-left">
                                <h5 className="font-bold text-slate-900 text-xs">Finished all 5 milestones for Module {mod.module_num}?</h5>
                                <p className="text-[11px] text-slate-600">Submit your GitHub repository and live demo links for administrator evaluation.</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleOpenSubmit(mod)}
                                className="px-5 py-2.5 bg-[#07284a] hover:bg-[#0c3968] text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer shrink-0"
                              >
                                <Send className="w-3.5 h-3.5 text-sky-400" />
                                <span>{status === 'SUBMITTED' ? 'Update Submission' : 'Submit Assignment'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tab 2: Objectives & Practical Exercises */}
                      {currentTab === 'tasks' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Learning Objectives */}
                          <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                              <BookOpen className="w-4 h-4 text-sky-600" />
                              <span>Core Learning Objectives</span>
                            </div>
                            <ul className="space-y-2 text-slate-600 text-xs">
                              {mod.objectives?.map((obj, i) => (
                                <li key={i} className="flex items-start gap-2.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5"></span>
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Practical Exercises */}
                          <div className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-3">
                            <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                              <Terminal className="w-4 h-4 text-sky-600" />
                              <span>Practical Exercises &amp; Tasks</span>
                            </div>
                            <div className="space-y-2.5">
                              {mod.exercises?.map((ex, i) => (
                                <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                                  <span className="font-bold text-slate-900 block text-xs">{ex.name}</span>
                                  <span className="text-slate-600 text-[11px] leading-relaxed block">{ex.task}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab 3: Submission Checklist */}
                      {currentTab === 'checklist' && (
                        <div className="space-y-4">
                          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                            <div className="font-bold text-slate-900 text-xs flex items-center gap-2 uppercase tracking-wider">
                              <ListChecks className="w-4 h-4 text-sky-600" />
                              <span>Pre-Submission Quality Checklist</span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              Before submitting your assignment, verify your project satisfies all required criteria below. Submissions missing key deliverables will be marked for revision.
                            </p>

                            <div className="space-y-2 pt-1">
                              {(detail.checklist || [
                                'Clean GitHub repository created with open access',
                                'Detailed README.md with setup and execution instructions',
                                'Atomic conventional commit history',
                                'Working code verified locally without build errors'
                              ]).map((item, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{item}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-2">
                            <h5 className="font-bold text-blue-900 flex items-center gap-1.5">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <span>Mentor Review Standard</span>
                            </h5>
                            <p className="leading-relaxed">
                              Mentors inspect repository cleanliness, commit history, architectural patterns, and adherence to production conventions. Upon verification, the module status turns green.
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Tab 4: Resources & Docs */}
                      {currentTab === 'resources' && (
                        <div className="space-y-4">
                          <span className="font-bold text-slate-700 uppercase tracking-wider text-[11px] block">
                            Official Documentation &amp; Reference Materials:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {mod.resources?.map((res, i) => (
                              <a
                                key={i}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-between gap-3 group"
                              >
                                <div className="space-y-0.5">
                                  <span className="font-bold text-slate-900 block group-hover:text-sky-600 transition-colors">{res.title}</span>
                                  <span className="text-[10px] text-slate-400 font-mono">{res.type || 'Documentation'}</span>
                                </div>
                                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Current Submission Display or Trigger */}
                      <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-slate-900 text-xs">
                            {sub ? 'Your Assignment Submission' : 'Assignment Submission Required'}
                          </div>
                          {sub?.github_url && (
                            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                              <a
                                href={sub.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-700 hover:underline flex items-center gap-1 font-mono font-bold"
                              >
                                <span>GitHub Repository</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                              {sub.live_demo_url && (
                                <a
                                  href={sub.live_demo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-700 hover:underline flex items-center gap-1 font-mono font-bold"
                                >
                                  <span>Live Demo</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              {sub.submitted_at && (
                                <span className="text-slate-400 text-[11px]">
                                  Submitted: {new Date(sub.submitted_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                          {!sub && (
                            <p className="text-slate-500 text-xs mt-0.5">
                              Submit your GitHub repository link and implementation notes to request mentor evaluation.
                            </p>
                          )}
                        </div>

                        {status !== 'APPROVED' && (
                          <button
                            type="button"
                            onClick={() => handleOpenSubmit(mod)}
                            className="py-2.5 px-5 bg-[#07284a] hover:bg-[#0c3968] text-white font-extrabold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-sky-400" />
                            <span>{sub ? 'Edit / Resubmit Assignment' : 'Submit Assignment'}</span>
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })()}
              </div>
            );
          })}
        </div>
      )}

      {/* Assignment Submission Modal */}
      {activeSubmitModule && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative space-y-5 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setActiveSubmitModule(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                Module {activeSubmitModule.module_num} Submission
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {activeSubmitModule.short_title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide your code repository, live artifacts, and implementation notes for mentor evaluation.
              </p>
            </div>

            {submitError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitModuleAssignment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  GitHub Repository URL <span className="text-rose-500">*</span>
                </label>
                <input
                  type="url"
                  value={submitForm.github_url}
                  onChange={(e) => setSubmitForm({ ...submitForm, github_url: e.target.value })}
                  placeholder="https://github.com/username/skyrovix-module-deliverable"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Live Preview / Demo URL (Optional)
                </label>
                <input
                  type="url"
                  value={submitForm.live_demo_url}
                  onChange={(e) => setSubmitForm({ ...submitForm, live_demo_url: e.target.value })}
                  placeholder="https://my-app.vercel.app or API health check link"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Implementation Notes & Documentation Summary <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={submitForm.notes}
                  onChange={(e) => setSubmitForm({ ...submitForm, notes: e.target.value })}
                  placeholder="Briefly describe key challenges solved, tools used, architecture decisions, and test logs..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-500 text-xs"
                  required
                ></textarea>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 bg-[#07284a] hover:bg-[#0c3968] text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                      <span>Submitting Work...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-sky-400" />
                      <span>Submit for Evaluation</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSubmitModule(null)}
                  className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
