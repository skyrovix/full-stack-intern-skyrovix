import React, { useState } from 'react';
import { Linkedin } from './LinkedInIcon';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  FileText, 
  Send, 
  Share2, 
  Copy, 
  Check, 
  HelpCircle,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Stage1LinkedIn = ({ 
  workflow, 
  onRefresh, 
  onViewOfferLetter,
  onShowToast,
  onProceedToTraining,
  offerLetters 
}) => {
  const [postUrl, setPostUrl] = useState(workflow?.linkedin_submission?.post_url || '');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const linkedinSub = workflow?.linkedin_submission;
  const stageStatus = workflow?.stage1_status || 'PENDING';
  const offerLetter = workflow?.offer_letter;

  // Client-side quick check
  const validateClientUrl = (url) => {
    if (!url || !url.trim()) {
      return 'LinkedIn post URL is required.';
    }
    const trimmed = url.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return 'Please enter a valid URL beginning with https://';
    }
    try {
      const parsed = new URL(trimmed);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      const isLinkedIn = host === 'linkedin.com' || host === 'lnkd.in' || host.endsWith('.linkedin.com');
      if (!isLinkedIn) {
        return 'The URL must be a valid link from linkedin.com or lnkd.in';
      }
      const path = parsed.pathname.toLowerCase();
      if (
        path.startsWith('/in/') || 
        path.startsWith('/pub/') || 
        path.startsWith('/profile/') ||
        path === '/in' || 
        path === '/pub'
      ) {
        return 'Profile URLs (e.g. linkedin.com/in/...) cannot be accepted. Please submit the direct URL of your published post celebrating your Skyrovix offer letter.';
      }

      if (host === 'lnkd.in') {
        if (path.length <= 1 || path === '/') {
          return 'Please enter a valid LinkedIn post link.';
        }
        return '';
      }

      const isPost = 
        path.startsWith('/posts/') || 
        path.includes('/feed/update/urn:li:activity:') ||
        path.includes('/feed/update/urn:li:share:') ||
        path.includes('/feed/update/urn:li:ugcpost:') ||
        path.startsWith('/feed/update/') ||
        path.includes('activity') ||
        path.includes('share') ||
        path.startsWith('/pulse/');
      if (!isPost) {
        return 'Please enter a direct link to your published post (e.g. https://www.linkedin.com/posts/... or https://lnkd.in/...)';
      }
    } catch (e) {
      return 'Please enter a valid URL format.';
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    const error = validateClientUrl(postUrl);
    if (error) {
      setFormError(error);
      return;
    }

    setSubmitting(true);
    try {
      const studentId = localStorage.getItem('skyrovix_student_id') || workflow?.student_id;
      const res = await fetch('/api/user/workflow/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          postUrl: postUrl.trim()
        })
      });
      const data = await res.json();
      setSubmitting(false);

      if (!res.ok) {
        setFormError(data.error || 'Failed to submit LinkedIn post URL.');
        return;
      }

      onShowToast && onShowToast('LinkedIn post submitted successfully for mentor verification!');
      setIsEditing(false);
      onRefresh && onRefresh();
    } catch (err) {
      setSubmitting(false);
      setFormError('Network error communicating with the server. Please check your connection.');
    }
  };

  const samplePostTemplate = `I am excited to announce that I have received an internship offer from Skyrovix Technologies for the ${offerLetter?.program || '3-Month Full Stack Development Internship'} (Batch 1)! 🚀

Verification Reference: ${offerLetter?.verification_code || 'SKX-OL-2026-9055'}
Domain: ${offerLetter?.domain || 'Full Stack Development'}

Looking forward to building real-world production systems and leveling up my engineering skills with @Skyrovix Technologies!

#Skyrovix #Internship #FullStack #FullStackDevelopment #WebDevelopment #TechCareers`;

  const handleCopyTemplate = () => {
    navigator.clipboard.writeText(samplePostTemplate);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2500);
    onShowToast && onShowToast('Sample announcement caption copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Stage Header */}
      <div className="bg-gradient-to-r from-[#07284a] via-[#0d3b66] to-[#0a2540] text-white p-6 sm:p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-sky-400/20 text-sky-300 text-xs font-bold tracking-wide uppercase border border-sky-400/30">
                Stage 1 of 3
              </span>
              <span className="text-xs text-sky-200">Mandatory Prerequisite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Offer Letter & LinkedIn Publication
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Publish your official Skyrovix Internship Offer Letter on LinkedIn to announce your Batch 1 selection. Once verified by our mentor board, Stage 2 (Training & Learning) will unlock automatically.
            </p>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            {offerLetter && (
              <button
                type="button"
                onClick={onViewOfferLetter}
                className="py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 border border-white/20 backdrop-blur-xs"
              >
                <FileText className="w-4 h-4 text-sky-400" />
                <span>View Offer Letter</span>
              </button>
            )}
            <button
              type="button"
              onClick={handleCopyTemplate}
              className="py-3 px-4 bg-sky-500 hover:bg-sky-400 text-[#07284a] font-extrabold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md"
            >
              {copiedText ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedText ? 'Caption Copied!' : 'Copy Post Caption'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Instructions + Submission Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Step-by-Step Instructions Card (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-5">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base pb-3 border-b border-slate-100">
            <Share2 className="w-5 h-5 text-sky-600" />
            <span>How to Complete Stage 1</span>
          </div>

          <ol className="space-y-4 text-xs">
            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                1
              </span>
              <div>
                <p className="font-bold text-slate-800">Download or View Your Offer Letter</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Your official Skyrovix offer letter has been generated with Ref: <code className="bg-slate-100 text-sky-700 px-1 py-0.5 rounded font-mono font-bold">{offerLetter?.verification_code || 'SKX-OL-2026-9055'}</code>.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                2
              </span>
              <div>
                <p className="font-bold text-slate-800">Publish a Post on LinkedIn</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Create a public post celebrating your selection for Batch 1. Mention Skyrovix Technologies and attach your offer letter image or verification link.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                3
              </span>
              <div>
                <p className="font-bold text-slate-800">Copy the Post Link (Not Profile)</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Click the <strong>••• (More)</strong> button on your post and choose <strong>"Copy link to post"</strong>. Profile links (<code className="text-rose-600 font-mono">/in/...</code>) will be rejected.
                </p>
              </div>
            </li>

            <li className="flex gap-3">
              <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-800 font-bold flex items-center justify-center shrink-0 text-xs">
                4
              </span>
              <div>
                <p className="font-bold text-slate-800">Submit for Mentor Approval</p>
                <p className="text-slate-500 mt-0.5 leading-relaxed">
                  Paste the URL in the form on the right. Once approved, Stage 2 (Training & Learning) unlocks immediately.
                </p>
              </div>
            </li>
          </ol>

          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Note:</strong> Submissions are verified manually by administrators. Entering a valid URL does not auto-approve the stage.
            </span>
          </div>
        </div>

        {/* Submission & Status Card (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-[#0077b5]" />
                <h3 className="font-bold text-slate-900 text-base">
                  LinkedIn Submission Status
                </h3>
              </div>

              {/* Status Pill */}
              {stageStatus === 'APPROVED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Approved & Verified
                </span>
              ) : stageStatus === 'SUBMITTED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  Pending Verification
                </span>
              ) : stageStatus === 'REJECTED' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                  Revision Required
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  Action Required
                </span>
              )}
            </div>

            {/* Approved State Banner */}
            {stageStatus === 'APPROVED' && (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-3 mb-6">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Your LinkedIn Offer Letter publication has been verified!</span>
                </div>
                <p className="text-xs text-emerald-700 leading-relaxed">
                  Congratulations! Mentor review confirmed your announcement post. Stage 2 (Training & Learning) is now fully unlocked.
                </p>
                {linkedinSub?.post_url && (
                  <div className="pt-1 flex items-center justify-between text-xs">
                    <a
                      href={linkedinSub.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-emerald-800 hover:text-emerald-950 font-bold underline decoration-emerald-400"
                    >
                      <span>View Verified LinkedIn Post</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    {linkedinSub.reviewed_at && (
                      <span className="text-[11px] text-emerald-600">
                        Verified on: {new Date(linkedinSub.reviewed_at).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )}
                {onProceedToTraining && (
                  <div className="pt-2">
                    <button
                      onClick={onProceedToTraining}
                      className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <span>Continue to Stage 2: Training & Learning</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Pending Verification Banner */}
            {stageStatus === 'SUBMITTED' && !isEditing && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
                    <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                    <span>Submission Received — Verification Pending</span>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 underline"
                  >
                    Edit URL
                  </button>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your LinkedIn post link has been submitted to the mentor queue. Mentors review links to confirm the Skyrovix offer letter was properly shared.
                </p>
                {linkedinSub?.post_url && (
                  <div className="p-2.5 rounded-xl bg-white/70 border border-amber-200 text-xs break-all flex items-center justify-between gap-2">
                    <a
                      href={linkedinSub.post_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>{linkedinSub.post_url}</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </div>
                )}
                <div className="text-[11px] text-amber-700">
                  Submitted at: {linkedinSub?.submitted_at ? new Date(linkedinSub.submitted_at).toLocaleString() : 'Recently'}
                </div>
              </div>
            )}

            {/* Rejected / Needs Revision Banner */}
            {stageStatus === 'REJECTED' && (
              <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3 mb-6">
                <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <span>Revision Required on LinkedIn Submission</span>
                </div>
                {linkedinSub?.admin_feedback && (
                  <div className="p-3 bg-white/80 rounded-xl border border-rose-200 text-xs">
                    <span className="font-bold text-rose-800 block text-[11px] uppercase tracking-wider">
                      Mentor Feedback Reason:
                    </span>
                    <p className="mt-0.5 text-slate-800 font-medium">{linkedinSub.admin_feedback}</p>
                  </div>
                )}
                <p className="text-xs text-rose-700 leading-relaxed">
                  Please adjust your LinkedIn post according to the mentor instructions and resubmit the correct post URL below.
                </p>
              </div>
            )}

            {/* Submission Form (Shown when Pending submission, Rejected, or Editing) */}
            {(stageStatus === 'PENDING' || stageStatus === 'REJECTED' || isEditing) && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    LinkedIn Post URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    </div>
                    <input
                      type="url"
                      value={postUrl}
                      onChange={(e) => {
                        setPostUrl(e.target.value);
                        setFormError('');
                      }}
                      placeholder="https://www.linkedin.com/posts/username_skyrovix-offer-activity-..."
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 transition ${
                        formError ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20' : 'border-slate-300 focus:ring-sky-200 focus:border-sky-500'
                      }`}
                      required
                    />
                  </div>
                  {formError ? (
                    <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{formError}</span>
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1.5">
                      Must point to a published LinkedIn post (<code className="font-mono text-sky-700">/posts/...</code> or <code className="font-mono text-sky-700">/feed/update/...</code>).
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-3 px-5 rounded-xl bg-[#07284a] hover:bg-[#0c3968] text-white text-xs font-extrabold shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                        <span>Submitting URL...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-sky-400" />
                        <span>{stageStatus === 'REJECTED' || isEditing ? 'Resubmit LinkedIn URL' : 'Submit LinkedIn Post URL'}</span>
                      </>
                    )}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Footer note on gating */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Stage 2 unlock condition: LinkedIn Post Status = Approved</span>
            <span className="font-bold text-slate-700">Skyrovix Batch 1 Portal</span>
          </div>
        </div>

      </div>
    </div>
  );
};
