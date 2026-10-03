import React, { useState, useEffect } from 'react';
import { Linkedin } from './LinkedInIcon';
import { 
  Users, 
  GraduationCap, 
  FolderGit2, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  ExternalLink, 
  RefreshCw, 
  Eye, 
  Send, 
  X, 
  FileText, 
  ShieldAlert, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AdminWorkflowManagement = ({ authToken, onShowToast }) => {
  const [interns, setInterns] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [domainFilter, setDomainFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedLinkedInReview, setSelectedLinkedInReview] = useState(null);
  const [linkedInFeedback, setLinkedInFeedback] = useState('');
  const [reviewingLinkedIn, setReviewingLinkedIn] = useState(false);

  const [selectedTrainingReview, setSelectedTrainingReview] = useState(null);
  const [trainingStudentData, setTrainingStudentData] = useState(null);
  const [trainingLoading, setTrainingLoading] = useState(false);
  const [activeModuleReview, setActiveModuleReview] = useState(null);
  const [moduleFeedback, setModuleFeedback] = useState('');
  const [reviewingModule, setReviewingModule] = useState(false);

  const [selectedLockIntern, setSelectedLockIntern] = useState(null);
  const [lockReason, setLockReason] = useState('');
  const [submittingLock, setSubmittingLock] = useState(false);

  // Fetch interns workflow list
  const fetchInterns = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (stageFilter !== 'ALL') params.append('stage', stageFilter);
      if (domainFilter !== 'ALL') params.append('domain', domainFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);

      const res = await fetch(`/api/admin/workflow/interns?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Failed to retrieve workflow data');
        return;
      }

      setInterns(data.interns || []);
      setStats(data.stats || null);
    } catch (err) {
      setLoading(false);
      setError('Network error fetching workflow data.');
    }
  };

  useEffect(() => {
    fetchInterns();
  }, [stageFilter, domainFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchInterns();
  };

  // Open Training Review Modal for Intern
  const handleOpenTrainingReview = async (intern) => {
    setSelectedTrainingReview(intern);
    setTrainingLoading(true);
    try {
      const res = await fetch(`/api/admin/workflow/interns/${intern.student_id}/training`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      const data = await res.json();
      setTrainingLoading(false);
      if (res.ok && data.success) {
        setTrainingStudentData(data);
      } else {
        onShowToast && onShowToast(data.error || 'Failed to load training details');
      }
    } catch (e) {
      setTrainingLoading(false);
      onShowToast && onShowToast('Network error loading training details');
    }
  };

  // Handle LinkedIn Approval / Rejection
  const handleReviewLinkedIn = async (action) => {
    if (action === 'REJECT' && !linkedInFeedback.trim()) {
      onShowToast && onShowToast('Please provide a reason for rejecting the LinkedIn post.');
      return;
    }

    setReviewingLinkedIn(true);
    try {
      const subId = selectedLinkedInReview.linkedin?.id;
      const res = await fetch(`/api/admin/workflow/linkedin/${subId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action,
          feedback: linkedInFeedback.trim()
        })
      });
      const data = await res.json();
      setReviewingLinkedIn(false);

      if (!res.ok || !data.success) {
        onShowToast && onShowToast(data.error || 'Failed to submit review');
        return;
      }

      onShowToast && onShowToast(data.message || 'LinkedIn review recorded!');
      setSelectedLinkedInReview(null);
      setLinkedInFeedback('');
      fetchInterns();
    } catch (err) {
      setReviewingLinkedIn(false);
      onShowToast && onShowToast('Server error while submitting review.');
    }
  };

  // Handle Module Approval / Rejection
  const handleReviewModule = async (action) => {
    if (action === 'REJECT' && !moduleFeedback.trim()) {
      onShowToast && onShowToast('Please provide feedback explaining what needs revision.');
      return;
    }

    setReviewingModule(true);
    try {
      const subId = activeModuleReview.submission?.id;
      const res = await fetch(`/api/admin/workflow/training/${subId}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          action,
          feedback: moduleFeedback.trim()
        })
      });
      const data = await res.json();
      setReviewingModule(false);

      if (!res.ok || !data.success) {
        onShowToast && onShowToast(data.error || 'Failed to submit review');
        return;
      }

      onShowToast && onShowToast(data.message || 'Module review recorded!');
      setActiveModuleReview(null);
      setModuleFeedback('');
      // Refresh training modal data
      handleOpenTrainingReview(selectedTrainingReview);
      fetchInterns();
    } catch (err) {
      setReviewingModule(false);
      onShowToast && onShowToast('Server error while submitting review.');
    }
  };

  // Handle Manual Lock / Unlock Toggle
  const handleToggleLock = async () => {
    const isLocking = !selectedLockIntern.workflow?.is_manually_locked;
    if (isLocking && !lockReason.trim()) {
      onShowToast && onShowToast('A recorded reason is required to lock an intern account.');
      return;
    }

    setSubmittingLock(true);
    try {
      const sId = selectedLockIntern.student_id;
      const res = await fetch(`/api/admin/workflow/interns/${sId}/lock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          locked: isLocking,
          reason: lockReason.trim()
        })
      });
      const data = await res.json();
      setSubmittingLock(false);

      if (!res.ok || !data.success) {
        onShowToast && onShowToast(data.error || 'Failed to update lock status');
        return;
      }

      onShowToast && onShowToast(data.message || 'Lock status updated successfully!');
      setSelectedLockIntern(null);
      setLockReason('');
      fetchInterns();
    } catch (err) {
      setSubmittingLock(false);
      onShowToast && onShowToast('Server error updating lock status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-[#07284a] via-[#0d3b66] to-[#0a2540] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-bold tracking-wide uppercase border border-sky-400/30">
              Admin Control Center
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Internship Workflow Management
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed">
              Supervise the 3-stage sequential internship progression. Review LinkedIn offer letter posts, evaluate 5 training module assignments, manage project unlocks, and configure administrative access locks.
            </p>
          </div>

          <button
            onClick={fetchInterns}
            className="self-start md:self-auto py-2.5 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 border border-white/20 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 text-sky-400 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Workflow Data</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Enrolled Interns
            </span>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">
              {stats.total_interns}
            </div>
            <span className="text-[11px] text-slate-500 block">Confirmed Batch 1</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Stage 1 Pending
            </span>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">
              {stats.stage1_pending}
            </div>
            <span className="text-[11px] text-amber-700 block">LinkedIn verification queue</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-sky-200 bg-sky-50/20 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider block">
              Stage 2 In Training
            </span>
            <div className="text-2xl sm:text-3xl font-black text-sky-600">
              {stats.stage2_training}
            </div>
            <span className="text-[11px] text-sky-700 block">Working on 5 modules</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Stage 3 Projects
            </span>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">
              {stats.stage3_unlocked}
            </div>
            <span className="text-[11px] text-emerald-700 block">Project access unlocked</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              Manually Locked
            </span>
            <div className="text-2xl sm:text-3xl font-black text-rose-600">
              {stats.manually_locked}
            </div>
            <span className="text-[11px] text-rose-700 block">Admin lock active</span>
          </div>

        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          
          {/* Search Box */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by intern name, email, or mobile..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs"
            />
          </div>

          {/* Stage Filter */}
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="ALL">All Stages (1, 2, 3)</option>
            <option value="1">Stage 1: Offer Letter & LinkedIn</option>
            <option value="2">Stage 2: Training & Learning</option>
            <option value="3">Stage 3: Internship Projects</option>
            <option value="LOCKED">Manually Locked Only</option>
          </select>

          {/* Domain Filter */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="ALL">All Domains</option>
            <option value="Full Stack Development">Full Stack Development</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-200"
          >
            <option value="ALL">All Review Statuses</option>
            <option value="LINKEDIN_PENDING">LinkedIn Pending Verification</option>
            <option value="LINKEDIN_APPROVED">LinkedIn Approved</option>
            <option value="TRAINING_IN_PROGRESS">Training In Progress</option>
            <option value="PROJECT_UNLOCKED">Project Access Unlocked</option>
            <option value="MANUALLY_LOCKED">Manually Locked</option>
          </select>

          <button
            type="submit"
            className="py-2.5 px-5 bg-[#07284a] hover:bg-[#0c3968] text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Interns Workflow Table / Card List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Enrolled Interns Workflow Status ({interns.length})
            </h3>
            <p className="text-xs text-slate-500">
              Manage sequential gate approvals, review deliverables, and audit stage unlocks.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-xs text-slate-500">Loading intern workflow records...</p>
          </div>
        ) : interns.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800 text-sm">No Interns Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No registered students match your current search and stage criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Intern Details</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4">Stage 1: LinkedIn Post</th>
                  <th className="py-3 px-4">Stage 2: Training (5 Mods)</th>
                  <th className="py-3 px-4">Stage 3: Projects</th>
                  <th className="py-3 px-4">Account Access</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {interns.map((i) => {
                  const wf = i.workflow || {};
                  const isLocked = wf.is_manually_locked;
                  const liStatus = i.linkedin?.status || wf.stage1_status;

                  return (
                    <tr key={i.student_id} className="hover:bg-slate-50/70 transition">
                      
                      {/* Intern Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-900 text-sm">
                          {i.full_name}
                        </div>
                        <div className="text-[11px] text-slate-500">{i.email}</div>
                        <div className="text-[11px] text-sky-700 font-medium mt-0.5">
                          {i.domain} • {i.college}
                        </div>
                      </td>

                      {/* Current Stage */}
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold text-[11px] ${
                          wf.current_stage === 3 
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : wf.current_stage === 2
                            ? 'bg-sky-100 text-sky-800 border border-sky-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          Stage {wf.current_stage}: {wf.current_stage === 1 ? 'LinkedIn' : wf.current_stage === 2 ? 'Training' : 'Projects'}
                        </span>
                      </td>

                      {/* Stage 1: LinkedIn */}
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          {liStatus === 'APPROVED' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          ) : liStatus === 'PENDING_VERIFICATION' || liStatus === 'SUBMITTED' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              Pending Review
                            </span>
                          ) : liStatus === 'REJECTED' ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              Revision Requested
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">
                              Not Submitted
                            </span>
                          )}

                          {i.linkedin?.post_url && (
                            <div>
                              <button
                                onClick={() => {
                                  setSelectedLinkedInReview(i);
                                  setLinkedInFeedback(i.linkedin?.feedback || '');
                                }}
                                className="text-[11px] text-sky-700 hover:text-sky-900 font-bold underline flex items-center gap-1 cursor-pointer"
                              >
                                <span>Review Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Stage 2: Training */}
                      <td className="py-4 px-4">
                        <div className="space-y-1.5 min-w-[130px]">
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span className={i.training.is_all_approved ? 'text-emerald-700' : 'text-slate-700'}>
                              {i.training.approved_count} / {i.training.total_count} Approved
                            </span>
                            <span className="text-slate-400">{i.training.progress_pct}%</span>
                          </div>

                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all ${
                                i.training.is_all_approved ? 'bg-emerald-500' : 'bg-sky-500'
                              }`}
                              style={{ width: `${i.training.progress_pct}%` }}
                            ></div>
                          </div>

                          <button
                            onClick={() => handleOpenTrainingReview(i)}
                            className="text-[11px] text-[#07284a] hover:underline font-bold block pt-0.5 cursor-pointer"
                          >
                            Review 5 Modules →
                          </button>
                        </div>
                      </td>

                      {/* Stage 3: Projects Access */}
                      <td className="py-4 px-4">
                        {wf.stage3_status === 'UNLOCKED' || wf.stage3_status === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            <Lock className="w-3 h-3 text-slate-400" />
                            Locked (Training Needed)
                          </span>
                        )}
                        <div className="text-[10px] text-slate-500 mt-1">
                          Tasks: {i.tasks?.approved_count || 0} passed
                        </div>
                      </td>

                      {/* Account Access (Manual Lock) */}
                      <td className="py-4 px-4">
                        {isLocked ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            Locked by Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Normal Access
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedLockIntern(i);
                              setLockReason(wf.manual_lock_reason || '');
                            }}
                            title={isLocked ? 'Unlock Intern Account' : 'Manually Lock Intern Account'}
                            className={`p-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                              isLocked 
                                ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100' 
                                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {isLocked ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                          </button>

                          <button
                            onClick={() => handleOpenTrainingReview(i)}
                            className="py-1.5 px-3 bg-[#07284a] hover:bg-[#0c3968] text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
                          >
                            Manage
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: LinkedIn Review Modal */}
      {selectedLinkedInReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative space-y-5 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedLinkedInReview(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                Stage 1 Review
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                LinkedIn Offer Letter Verification
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Intern: <strong>{selectedLinkedInReview.full_name}</strong> ({selectedLinkedInReview.email})
              </p>
            </div>

            {/* Offer Letter & Post Details Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Offer Letter Code:</span>
                <span className="font-mono font-bold text-[#07284a]">
                  {selectedLinkedInReview.offer_letter?.code || 'SKX-OL-2026-9055'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Internship Domain:</span>
                <span className="font-bold text-slate-800">{selectedLinkedInReview.domain}</span>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-slate-500 block mb-1">Submitted LinkedIn Post URL:</span>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200 break-all flex items-center justify-between gap-2">
                  <a
                    href={selectedLinkedInReview.linkedin?.post_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 hover:underline font-mono text-[11px] font-bold flex items-center gap-1.5"
                  >
                    <span>{selectedLinkedInReview.linkedin?.post_url}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  </a>
                </div>
              </div>
            </div>

            {/* Action Notice */}
            <div className="text-[11px] text-slate-600 bg-sky-50 border border-sky-200 p-3 rounded-xl">
              <strong>Approval Effect:</strong> Approving this post automatically transitions the intern to <strong>Stage 2 (Training & Learning Unlocked)</strong>.
            </div>

            {/* Feedback / Reason Input */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Admin Notes / Feedback Reason (Required if Rejecting)
              </label>
              <textarea
                rows={3}
                value={linkedInFeedback}
                onChange={(e) => setLinkedInFeedback(e.target.value)}
                placeholder="e.g. Post verified successfully, or: The post does not tag Skyrovix / uses a profile URL instead of post link..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-200 text-xs"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={reviewingLinkedIn}
                onClick={() => handleReviewLinkedIn('APPROVE')}
                className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {reviewingLinkedIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>Approve & Unlock Stage 2</span>
              </button>

              <button
                type="button"
                disabled={reviewingLinkedIn}
                onClick={() => handleReviewLinkedIn('REJECT')}
                className="py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Reject with Reason</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: Training Modules Review Modal */}
      {selectedTrainingReview && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col relative overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                  Stage 2 Module Evaluations
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  Training Curriculum Review
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Intern: <strong>{selectedTrainingReview.full_name}</strong> • Approved: {trainingStudentData?.approved_count || 0} / 5 Modules
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedTrainingReview(null);
                  setActiveModuleReview(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              
              {trainingLoading ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-8 h-8 border-3 border-sky-200 border-t-sky-600 rounded-full animate-spin mx-auto"></div>
                  <p className="text-slate-500">Loading module assignments...</p>
                </div>
              ) : (
                <>
                  <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-950 flex items-center justify-between">
                    <div>
                      <span className="font-bold block text-sm">Milestone Rule:</span>
                      <span className="text-xs text-sky-800">
                        When all 5 modules are approved, Stage 3 (Internship Project) will automatically unlock for this intern.
                      </span>
                    </div>
                    <span className="font-extrabold text-sm text-[#07284a] px-3 py-1 bg-white rounded-xl shadow-2xs border border-sky-200">
                      {trainingStudentData?.approved_count || 0} / 5 Approved
                    </span>
                  </div>

                  {/* 5 Modules List */}
                  <div className="space-y-3">
                    {trainingStudentData?.modules?.map((m) => {
                      const sub = m.submission;
                      const isApproved = sub?.status === 'APPROVED';
                      const isSubmitted = sub?.status === 'SUBMITTED';
                      const isRejected = sub?.status === 'REJECTED';

                      return (
                        <div 
                          key={m.id}
                          className={`p-4 rounded-2xl border transition ${
                            isApproved 
                              ? 'bg-emerald-50/40 border-emerald-200' 
                              : isSubmitted 
                              ? 'bg-amber-50/40 border-amber-200' 
                              : isRejected 
                              ? 'bg-rose-50/40 border-rose-200' 
                              : 'bg-slate-50/50 border-slate-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/60">
                            <div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Module {m.module_num}
                              </span>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {m.title}
                              </h4>
                            </div>

                            <div className="flex items-center gap-2">
                              {isApproved ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Approved
                                </span>
                              ) : isSubmitted ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                                  <Clock className="w-3 h-3 text-amber-600" /> Pending Review
                                </span>
                              ) : isRejected ? (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3 text-rose-600" /> Revision Needed
                                </span>
                              ) : (
                                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-200 text-slate-600">
                                  Not Submitted
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Submission Details */}
                          {sub ? (
                            <div className="pt-2 space-y-2 text-xs">
                              {sub.github_url && (
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 font-semibold w-24 shrink-0">GitHub Repo:</span>
                                  <a
                                    href={sub.github_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sky-700 font-mono hover:underline flex items-center gap-1 font-bold"
                                  >
                                    <span>{sub.github_url}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                              {sub.live_demo_url && (
                                <div className="flex items-center gap-2">
                                  <span className="text-slate-500 font-semibold w-24 shrink-0">Live Demo:</span>
                                  <a
                                    href={sub.live_demo_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-emerald-700 font-mono hover:underline flex items-center gap-1 font-bold"
                                  >
                                    <span>{sub.live_demo_url}</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </div>
                              )}
                              {sub.notes && (
                                <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700">
                                  <span className="font-bold text-[11px] block text-slate-500">Student Notes:</span>
                                  <p className="mt-0.5">{sub.notes}</p>
                                </div>
                              )}
                              {sub.admin_feedback && (
                                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-amber-900">
                                  <span className="font-bold text-[11px] block text-amber-800">Current Feedback:</span>
                                  <p className="mt-0.5">{sub.admin_feedback}</p>
                                </div>
                              )}

                              {/* Action Trigger */}
                              <div className="pt-2 flex justify-end">
                                <button
                                  onClick={() => {
                                    setActiveModuleReview(m);
                                    setModuleFeedback(sub.admin_feedback || '');
                                  }}
                                  className="py-1.5 px-3 bg-[#07284a] hover:bg-[#0c3968] text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
                                >
                                  {isApproved ? 'Update Evaluation' : 'Evaluate Module Work'}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p className="pt-2 text-slate-400 text-xs italic">
                              Intern has not yet submitted deliverable for Module {m.module_num}.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

            </div>

            {/* Inner Module Evaluation Drawer / Form */}
            {activeModuleReview && (
              <div className="p-5 bg-slate-900 text-white border-t border-slate-800 space-y-3 animate-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-sm text-white">
                    Evaluating Module {activeModuleReview.module_num}: {activeModuleReview.short_title}
                  </h5>
                  <button 
                    onClick={() => setActiveModuleReview(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Mentor Feedback (Required if rejecting):
                  </label>
                  <textarea
                    rows={2}
                    value={moduleFeedback}
                    onChange={(e) => setModuleFeedback(e.target.value)}
                    placeholder="Provide constructive feedback or approval notes..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  ></textarea>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    disabled={reviewingModule}
                    onClick={() => handleReviewModule('APPROVE')}
                    className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {reviewingModule ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>Approve Module Deliverable</span>
                  </button>

                  <button
                    disabled={reviewingModule}
                    onClick={() => handleReviewModule('REJECT')}
                    className="py-2.5 px-4 bg-rose-600/30 hover:bg-rose-600/40 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Reject / Request Revision</span>
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: Manual Lock / Unlock Modal */}
      {selectedLockIntern && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 sm:p-8 relative space-y-5 animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedLockIntern(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                selectedLockIntern.workflow?.is_manually_locked ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                Administrative Security Guard
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                {selectedLockIntern.workflow?.is_manually_locked 
                  ? 'Unlock Intern Account Access' 
                  : 'Manually Lock Intern Account'}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Intern: <strong>{selectedLockIntern.full_name}</strong> ({selectedLockIntern.email})
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedLockIntern.workflow?.is_manually_locked ? (
                'Unlocking will restore normal milestone submissions and project dashboard access.'
              ) : (
                'Locking will immediately prevent this intern from submitting tasks or accessing training/project dashboards until explicitly unlocked. All lock operations are recorded in the security audit log.'
              )}
            </p>

            {!selectedLockIntern.workflow?.is_manually_locked && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Recorded Lock Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={lockReason}
                  onChange={(e) => setLockReason(e.target.value)}
                  placeholder="e.g. Integrity verification required / Under investigation for unauthorized submissions..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-200 text-xs"
                  required
                ></textarea>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                disabled={submittingLock}
                onClick={handleToggleLock}
                className={`flex-1 py-3 px-4 font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-white ${
                  selectedLockIntern.workflow?.is_manually_locked
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {submittingLock ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : selectedLockIntern.workflow?.is_manually_locked ? (
                  <Unlock className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                <span>
                  {selectedLockIntern.workflow?.is_manually_locked ? 'Confirm Account Unlock' : 'Confirm Account Lock'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedLockIntern(null)}
                className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
