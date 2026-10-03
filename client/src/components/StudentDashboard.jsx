import React, { useState, useEffect, useRef } from 'react';
import { 
  Home,
  User,
  Briefcase,
  FileText,
  CheckSquare,
  Award,
  CreditCard,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  Moon,
  Sun,
  ChevronDown,
  Calendar,
  Clock,
  Sliders,
  CheckCircle2,
  Eye,
  Download,
  MessageCircle,
  Copy,
  Check,
  Flag,
  Share2,
  ExternalLink,
  GitBranch,
  Printer,
  ShieldCheck,
  Building2,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Filter,
  Send,
  Lock,
  ChevronRight,
  TrendingUp,
  FolderGit2,
  FileCheck2,
  Save,
  Camera,
  Upload,
  Trash2,
  BookOpen
} from 'lucide-react';
import navLogo from '../assets/top nav bar logo.png';
import sealImg from '../assets/seal.jpg';
import signatureImg from '../assets/hari sig.jpeg';
import { StudentGuideView } from './StudentGuideView';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons';

export const StudentDashboard = ({ studentId, onLogout, onVerifyCert, onTriggerPayment }) => {
  // Navigation & View State
  // Valid active views: 'dashboard' | 'workflow' | 'profile' | 'internship' | 'applications' | 'tasks' | 'certificates' | 'offer-letters' | 'payments' | 'notifications' | 'support' | 'settings'
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Core Data
  const [profileData, setProfileData] = useState(null);
  const [applicationsList, setApplicationsList] = useState([]);
  const [internshipData, setInternshipData] = useState(null);
  const [tasksList, setTasksList] = useState([]);
  const [certificatesList, setCertificatesList] = useState([]);
  const [offerLettersList, setOfferLettersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [notificationsList, setNotificationsList] = useState([]);
  const [supportTicketsList, setSupportTicketsList] = useState([]);
  
  // 3-Stage Internship Workflow State
  const [workflowData, setWorkflowData] = useState(null);
  const [workflowStageTab, setWorkflowStageTab] = useState(1);
  const [tasksLockInfo, setTasksLockInfo] = useState({ isLocked: false, reason: '' });
  
  // Payment Required Gate State
  const [paymentRequiredData, setPaymentRequiredData] = useState(null);
  const [initiatingPay, setInitiatingPay] = useState(false);

  // UI & Loading States
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Modals
  const [showOfferLetterModal, setShowOfferLetterModal] = useState(false);
  const [selectedOfferLetter, setSelectedOfferLetter] = useState(null);
  const [showIdCardModal, setShowIdCardModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [activeTicketThread, setActiveTicketThread] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Task Submission Form
  const [submissionForm, setSubmissionForm] = useState({
    githubRepoUrl: '',
    liveDeploymentUrl: '',
    notes: ''
  });
  const [submittingTask, setSubmittingTask] = useState(false);

  // Profile Photo Upload Ref
  const fileInputRef = useRef(null);

  // Profile Edit Form State
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    mobile: '',
    college: '',
    department: '',
    year_of_study: '',
    city: '',
    skill_level: '',
    bio: '',
    github_url: '',
    linkedin_url: '',
    avatar_url: ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordMsg, setPasswordMsg] = useState({ error: '', success: '' });
  const [changingPassword, setChangingPassword] = useState(false);

  // Support Ticket Form State
  const [newTicketForm, setNewTicketForm] = useState({
    subject: '',
    category: 'Internship Tasks',
    priority: 'Medium',
    message: ''
  });
  const [submittingTicket, setSubmittingTicket] = useState(false);

  // Task Filter State
  const [taskFilter, setTaskFilter] = useState('ALL');
  const [taskMonthFilter, setTaskMonthFilter] = useState('ALL');
  const [taskSearchQuery, setTaskSearchQuery] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Fetch all user data
  const fetchAllData = async () => {
    const sId = studentId || localStorage.getItem('skyrovix_student_id');
    if (!sId) {
      setError('Please log in with your email and password to access your dashboard.');
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError('');
      setPaymentRequiredData(null);

      // Verify profile and payment status first
      const profRes = await fetch(`/api/user/profile?studentId=${sId}`);
      const profData = await profRes.json();

      if (profRes.status === 402 || profData.payment_required) {
        setPaymentRequiredData(profData);
        setLoading(false);
        return;
      }

      if (!profRes.ok || !profData.success) {
        setError(profData.error || 'Failed to retrieve profile');
        setLoading(false);
        return;
      }

      setProfileData(profData);
      setProfileForm({
        full_name: profData.profile.full_name || '',
        email: profData.profile.email || '',
        mobile: profData.profile.mobile || '',
        college: profData.profile.college || '',
        department: profData.profile.department || '',
        year_of_study: profData.profile.year_of_study || '',
        city: profData.profile.city || '',
        skill_level: profData.profile.skill_level || 'Beginner',
        bio: profData.profile.bio || '',
        github_url: profData.profile.github_url || '',
        linkedin_url: profData.profile.linkedin_url || '',
        avatar_url: profData.profile.avatar_url || ''
      });

      const [
        appRes,
        intRes,
        tasksRes,
        certsRes,
        olRes,
        payRes,
        notifRes,
        suppRes,
        wfRes
      ] = await Promise.all([
        fetch(`/api/user/applications?studentId=${sId}`),
        fetch(`/api/user/internship?studentId=${sId}`),
        fetch(`/api/user/tasks?studentId=${sId}`),
        fetch(`/api/user/certificates?studentId=${sId}`),
        fetch(`/api/user/offer-letters?studentId=${sId}`),
        fetch(`/api/user/payments?studentId=${sId}`),
        fetch(`/api/user/notifications?studentId=${sId}`),
        fetch(`/api/user/support?studentId=${sId}`),
        fetch(`/api/user/workflow?studentId=${sId}`)
      ]);

      const apps = await appRes.json();
      setApplicationsList(apps.applications || []);

      const internship = await intRes.json();
      setInternshipData(internship.internship || null);

      const tasks = await tasksRes.json();
      setTasksList(tasks.tasks || []);
      if (tasks.is_stage_locked) {
        setTasksLockInfo({
          isLocked: true,
          reason: tasks.lock_reason || 'Complete all required Training & Learning modules to unlock your Internship Project.'
        });
      } else {
        setTasksLockInfo({ isLocked: false, reason: '' });
      }

      const certs = await certsRes.json();
      setCertificatesList(certs.certificates || []);

      const ol = await olRes.json();
      setOfferLettersList(ol.offer_letters || []);

      const pay = await payRes.json();
      setPaymentsList(pay.payments || []);

      const notifs = await notifRes.json();
      setNotificationsList(notifs.notifications || []);

      const supp = await suppRes.json();
      setSupportTicketsList(supp.tickets || []);

      if (wfRes && wfRes.ok) {
        const wf = await wfRes.json();
        if (wf.success && wf.workflow) {
          setWorkflowData(wf.workflow);
        }
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Connection to server failed. Please check network.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [studentId]);

  const handleCopyId = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Open Task Modal & Prepopulate Form
  const handleOpenTask = (task) => {
    setSelectedTask(task);
    setSubmissionForm({
      githubRepoUrl: task.submission?.github_repo_url || '',
      liveDeploymentUrl: task.submission?.live_deployment_url || '',
      notes: task.submission?.notes || ''
    });
    setShowTaskModal(true);
  };

  // Submit Task Work
  const handleSubmitTaskWork = async (e) => {
    e.preventDefault();
    if (!submissionForm.githubRepoUrl.trim()) {
      showToast('GitHub repository URL is required.');
      return;
    }

    setSubmittingTask(true);
    const sId = profileData?.profile?.id || studentId;

    try {
      const res = await fetch('/api/user/tasks/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          taskId: selectedTask.id,
          projectTitle: selectedTask.title,
          githubRepoUrl: submissionForm.githubRepoUrl.trim(),
          liveDeploymentUrl: submissionForm.liveDeploymentUrl.trim(),
          notes: submissionForm.notes.trim()
        })
      });
      const data = await res.json();
      setSubmittingTask(false);

      if (res.ok) {
        showToast('Work submitted successfully for mentor code evaluation!');
        setShowTaskModal(false);
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to submit task.');
      }
    } catch (err) {
      setSubmittingTask(false);
      showToast('Server error while submitting task.');
    }
  };

  // Save Profile Changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!profileForm.full_name.trim() || !profileForm.mobile.trim()) {
      showToast('Please provide your full name and mobile number.');
      return;
    }
    const cleanMobile = profileForm.mobile.replace(/[^0-9]/g, '');
    if (cleanMobile.length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }

    setSavingProfile(true);
    const sId = profileData?.profile?.id || studentId;

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          ...profileForm
        })
      });
      const data = await res.json();
      setSavingProfile(false);

      if (res.ok) {
        showToast('Profile updated successfully!');
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to update profile.');
      }
    } catch (err) {
      setSavingProfile(false);
      showToast('Server error updating profile.');
    }
  };

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      showToast('Image file size must be less than 3MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (uploadEvent) => {
      const base64Data = uploadEvent.target?.result;
      if (!base64Data) return;

      // Optimistically update UI immediately
      setProfileForm(prev => ({ ...prev, avatar_url: base64Data }));
      setProfileData(prev => prev ? {
        ...prev,
        profile: { ...prev.profile, avatar_url: base64Data }
      } : prev);

      const sId = profileData?.profile?.id || studentId;
      try {
        const res = await fetch('/api/user/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: sId,
            ...profileForm,
            avatar_url: base64Data
          })
        });
        const data = await res.json();
        if (res.ok) {
          showToast('Profile photo updated successfully!');
        } else {
          showToast(data.error || 'Failed to save photo.');
        }
      } catch (err) {
        showToast('Network error saving photo.');
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Remove Photo
  const handleRemovePhoto = async () => {
    setProfileForm(prev => ({ ...prev, avatar_url: '' }));
    setProfileData(prev => prev ? {
      ...prev,
      profile: { ...prev.profile, avatar_url: '' }
    } : prev);

    const sId = profileData?.profile?.id || studentId;
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          ...profileForm,
          avatar_url: ''
        })
      });
      if (res.ok) {
        showToast('Profile photo removed.');
      } else {
        showToast('Failed to remove photo.');
      }
    } catch (err) {
      showToast('Network error removing photo.');
    }
  };

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ error: '', success: '' });

    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      setPasswordMsg({ error: 'New password must be at least 6 characters long.', success: '' });
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMsg({ error: 'New passwords do not match.', success: '' });
      return;
    }

    setChangingPassword(true);
    const sId = profileData?.profile?.id || studentId;

    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      });
      const data = await res.json();
      setChangingPassword(false);

      if (res.ok) {
        setPasswordMsg({ error: '', success: 'Password updated successfully!' });
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Password changed successfully!');
      } else {
        setPasswordMsg({ error: data.error || 'Password update failed.', success: '' });
      }
    } catch (err) {
      setChangingPassword(false);
      setPasswordMsg({ error: 'Network error communicating with auth server.', success: '' });
    }
  };

  // Submit Support Ticket
  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.message.trim()) {
      showToast('Subject and message are required.');
      return;
    }

    setSubmittingTicket(true);
    const sId = profileData?.profile?.id || studentId;

    try {
      const res = await fetch('/api/user/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          ...newTicketForm
        })
      });
      const data = await res.json();
      setSubmittingTicket(false);

      if (res.ok) {
        showToast('Support ticket submitted successfully!');
        setShowTicketModal(false);
        setNewTicketForm({ subject: '', category: 'Internship Tasks', priority: 'Medium', message: '' });
        fetchAllData();
      } else {
        showToast(data.error || 'Failed to submit ticket.');
      }
    } catch (err) {
      setSubmittingTicket(false);
      showToast('Server error creating support ticket.');
    }
  };

  // Reply to Support Ticket Thread
  const handleSendTicketReply = async (ticketId) => {
    if (!ticketReplyText.trim()) return;
    const sId = profileData?.profile?.id || studentId;

    try {
      const res = await fetch(`/api/user/support/${ticketId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: sId,
          message: ticketReplyText.trim()
        })
      });
      const data = await res.json();
      if (res.ok) {
        setTicketReplyText('');
        showToast('Reply sent successfully!');
        // Refresh support data
        const suppRes = await fetch(`/api/user/support?studentId=${sId}`);
        const suppData = await suppRes.json();
        setSupportTicketsList(suppData.tickets || []);
        const updatedCurrent = suppData.tickets?.find(t => t.id === ticketId);
        if (updatedCurrent) setActiveTicketThread(updatedCurrent);
      } else {
        showToast(data.error || 'Failed to send reply.');
      }
    } catch (err) {
      showToast('Server error sending reply.');
    }
  };

  // Mark all notifications read
  const handleMarkAllNotificationsRead = async () => {
    const sId = profileData?.profile?.id || studentId;
    try {
      await fetch('/api/user/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: sId })
      });
      setNotificationsList(prev => prev.map(n => ({ ...n, is_read: 1 })));
      showToast('All notifications marked as read.');
    } catch (e) {}
  };

  const handlePayFromDashboard = async () => {
    setInitiatingPay(true);
    try {
      const s = paymentRequiredData?.student;
      const res = await fetch('/api/registrations/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: s?.full_name || 'Intern',
          email: s?.email,
          mobile: s?.mobile || '9999999999',
          college: s?.college || 'Engineering College',
          degree: s?.degree || 'B.Tech',
          department: s?.department || 'Computer Science',
          yearOfStudy: s?.year_of_study || '3rd Year',
          city: s?.city || 'City',
          skillLevel: s?.skill_level || 'Beginner',
          agreedTerms: true
        })
      });
      const data = await res.json();
      setInitiatingPay(false);
      if (data.payment_session_id || data.order_id) {
        if (onTriggerPayment) {
          onTriggerPayment(data);
        }
      } else {
        showToast(data.message || 'Unable to initialize checkout.');
        fetchAllData();
      }
    } catch (err) {
      setInitiatingPay(false);
      showToast('Error initiating checkout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f3f6fb] flex flex-col items-center justify-center p-6 text-slate-700">
        <div className="w-12 h-12 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4" />
        <h3 className="text-base font-bold text-slate-900">Loading Skyrovix User Dashboard...</h3>
        <p className="text-xs text-slate-500 mt-1">Connecting to live database and verifying credentials</p>
      </div>
    );
  }

  // Payment Required Screen (Strict Gate for Unpaid Students)
  if (paymentRequiredData) {
    const s = paymentRequiredData.student || {};
    return (
      <div className="min-h-screen bg-[#f3f6fb] flex items-center justify-center p-4 antialiased font-sans">
        <div className="max-w-xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 text-center space-y-6 animate-in fade-in">
          
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img src={navLogo} alt="Skyrovix" className="h-10 w-auto object-contain" />
          </div>

          {/* Shield / Lock Graphic */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-amber-600 shadow-inner ring-8 ring-amber-50/60">
            <Lock className="w-10 h-10" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center shadow">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
              Batch 1 Enrollment • Payment Required
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Registration Fee Payment Required
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
              Hello <strong className="text-slate-900">{s.full_name || 'Intern'}</strong>, your application has been received, but the mandatory <strong>₹200 registration fee</strong> has not been completed.
            </p>
          </div>

          {/* Student & Fee Summary Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-white text-left space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
              <span className="text-sky-300 font-bold uppercase tracking-wider text-[11px]">Enrolled Application Details</span>
              <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold px-2 py-0.5 rounded">UNPAID</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Student Name</span>
                <span className="text-white font-bold truncate block">{s.full_name || 'Student Intern'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Registered Email</span>
                <span className="text-white font-bold truncate block font-mono text-[11px]">{s.email || 'student@gmail.com'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Internship Program</span>
                <span className="text-white font-semibold block text-[11px]">3-Month Full Stack Dev</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">College</span>
                <span className="text-white font-semibold truncate block text-[11px]">{s.college || 'Engineering College'}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-slate-400 block text-[10px]">Internship Tuition Fee</span>
                <span className="text-emerald-400 font-extrabold text-xs">₹0.00 (100% Free)</span>
              </div>
              <div className="text-right">
                <span className="text-slate-400 block text-[10px]">Registration Fee Payable</span>
                <span className="text-xl font-black text-amber-300">₹200.00</span>
              </div>
            </div>
          </div>

          {/* What Unlocks Upon Payment */}
          <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200 text-left text-xs space-y-2">
            <span className="font-extrabold text-sky-950 block text-[11px] uppercase tracking-wider">
              Unlocked Instantly After ₹200 Payment:
            </span>
            <ul className="space-y-1.5 text-slate-700 text-[11px]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Immediate access to your full Student Dashboard &amp; live stats</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Official Skyrovix Offer Letter with verifiable ID &amp; seal</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Join link for the Official Batch 1 WhatsApp announcement group</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>All 20 Training &amp; Learning curriculum modules + mentor code reviews</span>
              </li>
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handlePayFromDashboard}
              disabled={initiatingPay}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 hover:from-sky-700 hover:to-blue-900 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
            >
              <CreditCard className="w-4 h-4" />
              <span>{initiatingPay ? 'Opening Checkout...' : 'Pay ₹200 Via Cashfree Gateway Now'}</span>
            </button>

            <div className="flex gap-2">
              <button
                onClick={fetchAllData}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
              >
                Refresh Payment Status
              </button>
              <button
                onClick={onLogout}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-rose-700 font-bold text-xs transition"
              >
                Log Out / Switch Account
              </button>
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-[#f3f6fb] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Dashboard Session Expired</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {error || 'Unable to retrieve your dashboard credentials. Please log in with your email and password.'}
          </p>
          <button
            onClick={onLogout}
            className="w-full py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  const { profile, stats, registration } = profileData;
  const internName = profile.full_name || 'Hariharan S';
  const internEmail = profile.email || 'skyrovix@gmail.com';
  const studentFormattedId = profile.full_name === 'Hariharan S' 
    ? 'SKX-2026-9055' 
    : (profile.id && profile.id.startsWith('SKX-') 
        ? profile.id 
        : `SKX-2026-${profile.id ? profile.id.slice(-4).toUpperCase() : '9055'}`);
  
  const domainName = 'Full Stack Development';

  const enrollmentDate = profile.full_name === 'Hariharan S' ? '21 Sept 2026' : (registration?.created_at ? new Date(registration.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '21 Sept 2026');
  const durationStr = '3 Months';

  // Dynamic real-time task calculations based on live database submissions
  const totalTasksCount = tasksList.length || 50;
  const completedTasksCount = tasksList.filter(t => t.status === 'Completed' || t.submission?.status === 'APPROVED').length;
  const submittedTasksCount = tasksList.filter(t => (t.status === 'Submitted' || t.submission?.status === 'SUBMITTED') && t.submission?.status !== 'APPROVED').length;
  const pendingTasksCount = tasksList.filter(t => {
    const isCompleted = t.status === 'Completed' || t.submission?.status === 'APPROVED';
    const isSubmitted = t.status === 'Submitted' || t.submission?.status === 'SUBMITTED';
    return !isCompleted && !isSubmitted;
  }).length;
  const month1TasksCount = tasksList.filter(t => (t.order_num || 0) >= 1 && (t.order_num || 0) <= 15).length;
  const month2TasksCount = tasksList.filter(t => (t.order_num || 0) >= 16 && (t.order_num || 0) <= 35).length;
  const month3TasksCount = tasksList.filter(t => (t.order_num || 0) >= 36 && (t.order_num || 0) <= 50).length;
  const progressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
  const unreadNotifsCount = notificationsList.filter(n => !n.is_read).length;

  // SVG Gauge calculations
  const gaugeRadius = 38;
  const gaugeCircumference = 2 * Math.PI * gaugeRadius;
  const gaugeOffset = gaugeCircumference - (progressPct / 100) * gaugeCircumference;

  // Helper for dynamic initials avatar
  const getInitials = (name) => {
    if (!name) return 'HS';
    const clean = name.trim();
    if (!clean) return 'HS';
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Helper to render user avatar or initials medallion
  const renderAvatar = (sizeClasses = "w-full h-full", textClasses = "text-base", extraClasses = "") => {
    const avatarUrl = profileData?.profile?.avatar_url || profileForm?.avatar_url;
    if (avatarUrl) {
      return (
        <img 
          src={avatarUrl} 
          alt={internName} 
          className={`w-full h-full object-cover rounded-full ${extraClasses}`} 
        />
      );
    }
    return (
      <div className={`w-full h-full rounded-full bg-gradient-to-tr from-[#0a1e3f] via-[#163a70] to-[#0284c7] text-white flex items-center justify-center font-black tracking-tight select-none shadow-inner ${textClasses} ${extraClasses}`}>
        {getInitials(internName)}
      </div>
    );
  };

  // Helper to get real-time task card status presentation
  const getTaskStatusInfo = (task) => {
    const isCompleted = task.status === 'Completed' || task.submission?.status === 'APPROVED';
    const isSubmitted = !isCompleted && (task.status === 'Submitted' || task.submission?.status === 'SUBMITTED');

    if (isCompleted) {
      return {
        status: 'Completed',
        badgeText: 'Completed',
        badgeBg: 'bg-[#e6f9f0] text-[#00b074] border border-[#a3e9c9]',
        borderLeft: 'border-l-[#00b074]',
        buttonBg: 'bg-[#e6f9f0] hover:bg-[#d8f5e7] text-[#008f5d] border border-[#a5edd0]',
        buttonText: 'Admin Verified & Passed!',
        icon: CheckCircle2,
        verifiedText: 'Admin Verified',
        showCheckMark: true
      };
    }

    if (isSubmitted) {
      return {
        status: 'Submitted',
        badgeText: 'Under Review',
        badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200',
        borderLeft: 'border-l-amber-500',
        buttonBg: 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200',
        buttonText: 'Pending Mentor Review (Edit)',
        icon: Clock,
        verifiedText: 'Awaiting Evaluation',
        showCheckMark: false
      };
    }

    return {
      status: 'Pending',
      badgeText: 'Pending',
      badgeBg: 'bg-slate-100 text-slate-600 border border-slate-200',
      borderLeft: 'border-l-sky-500',
      buttonBg: 'bg-sky-600 hover:bg-sky-700 text-white shadow-xs',
      buttonText: 'Submit Task Deliverable →',
      icon: Clock,
      verifiedText: 'Not Submitted Yet',
      showCheckMark: false
    };
  };

  // Sidebar Menu Items Definition (Section 4)
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'guide', label: 'Training & Student Guide', icon: BookOpen },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'internship', label: 'My Internship', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'tasks', label: 'Projects / Tasks', icon: CheckSquare },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'offer-letters', label: 'Offer Letters', icon: FileCheck2 },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifsCount > 0 ? unreadNotifsCount : null },
    { id: 'support', label: 'Support', icon: HelpCircle },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#f3f6fb] text-slate-800 flex font-sans antialiased text-left">
      
      {/* Toast Notification Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          1. LEFT SIDEBAR NAVIGATION (DESKTOP & MOBILE DRAWER)
      ======================================================== */}
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 bg-white border-r border-slate-200/80 z-50 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Sidebar Brand Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <button onClick={() => setActiveView('dashboard')} className="flex items-center gap-2 focus:outline-none">
            <img src={navLogo} alt="Skyrovix" className="h-8 w-auto object-contain" />
          </button>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 text-xs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links Scrollable Area */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            User Workspace
          </div>

          {sidebarItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors
                  ${isActive 
                    ? 'bg-[#1864f8] text-white shadow-xs shadow-blue-500/20' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-blue-600' : 'bg-rose-500 text-white'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer: User Card & Sign Out */}
        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
              {renderAvatar("w-full h-full", "text-xs")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-slate-900 truncate">{internName}</div>
              <div className="text-[10px] text-slate-400 font-mono truncate">{studentFormattedId}</div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </aside>

      {/* ========================================================
          2. MAIN CONTENT AREA (TOPBAR + ACTIVE VIEW)
      ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Dashboard Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">User Dashboard</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-900 capitalize">
                {activeView === 'guide' ? 'Training & Student Guide' : activeView.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Top Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick Search */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-400">
              <Search className="w-3.5 h-3.5" />
              <input 
                type="text" 
                placeholder="Search resources, tasks..." 
                className="bg-transparent text-xs text-slate-700 focus:outline-none w-36"
              />
            </div>

            {/* Notifications Bell with unread counter */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 text-slate-600" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                      <Bell className="w-3.5 h-3.5 text-sky-600" />
                      <span>Notifications ({unreadNotifsCount} Unread)</span>
                    </div>
                    <button
                      onClick={handleMarkAllNotificationsRead}
                      className="text-[10px] font-bold text-sky-600 hover:underline"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto px-2 py-2 space-y-1 text-xs">
                    {notificationsList.length === 0 ? (
                      <div className="text-center py-6 text-slate-400 text-xs">No notifications yet.</div>
                    ) : (
                      notificationsList.slice(0, 8).map(n => (
                        <div 
                          key={n.id}
                          className={`p-2.5 rounded-xl border transition ${n.is_read ? 'bg-white border-transparent' : 'bg-sky-50/70 border-sky-100'}`}
                        >
                          <div className="font-bold text-slate-900 text-xs">{n.title}</div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">
                            {n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="pt-2 px-3 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setActiveView('notifications');
                        setShowNotifications(false);
                      }}
                      className="w-full text-center text-xs font-bold text-sky-600 py-1"
                    >
                      View All Notifications →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Dark/Light toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* User Dropdown Pill */}
            <div className="relative">
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:border-slate-300 bg-white transition shadow-2xs"
              >
                <div className="w-7 h-7 rounded-full bg-[#0a1e3f] text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                  {renderAvatar("w-full h-full", "text-[11px]")}
                </div>
                <span className="text-xs font-semibold text-slate-700 max-w-[110px] truncate">
                  {internName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{internName}</div>
                    <div className="text-[11px] text-slate-400 truncate">{internEmail}</div>
                    <span className="inline-block mt-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                      {studentFormattedId}
                    </span>
                  </div>

                  <div className="py-1 text-xs text-slate-700">
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedOfferLetter(offerLettersList[0] || null);
                        setShowOfferLetterModal(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      <span>View Offer Letter</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowIdCardModal(true);
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Download ID Card</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveView('settings');
                        setShowUserDropdown(false);
                      }}
                      className="w-full px-4 py-2 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>Settings &amp; Security</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2 hover:bg-rose-50 text-rose-600 font-semibold flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </header>

        {/* Dashboard Main View Container */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full">
          
          {/* ========================================================
              VIEW 1: DASHBOARD HOME (SCREENSHOT 1 & SCREENSHOT 2)
          ======================================================== */}
          {activeView === 'dashboard' && (
            <div className="space-y-7">
              {/* 1. Main Navy Hero Card (Welcome Intern box is first) */}
              <section className="rounded-[28px] bg-gradient-to-r from-[#0d1f3d] via-[#102a54] to-[#0c1e3a] p-6 sm:p-8 lg:p-10 text-white relative shadow-2xl border border-slate-800/80 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                  
                  {/* Left Column: Avatar, Welcome Intern, Intern Name, Info pill, Buttons */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4 sm:gap-5">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/20 p-0.5 overflow-hidden bg-slate-800 shadow-md">
                          {renderAvatar("w-full h-full", "text-xl sm:text-2xl")}
                        </div>
                        <span className="absolute bottom-0.5 right-0.5 w-5 h-5 rounded-full bg-[#00c9a7] border-2 border-[#0d1f3d] flex items-center justify-center text-white shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      </div>

                      <div className="space-y-1">
                        <div>
                          <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-[#1c2e47] text-amber-300 border border-amber-400/20 shadow-2xs">
                            <Sparkles className="w-3 h-3 fill-amber-300 text-amber-300" />
                            WELCOME INTERN
                          </span>
                        </div>

                        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                          {internName}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2 pt-0.5">
                          <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#0284c7]/25 text-[#38bdf8] border border-[#0284c7]/30">
                            {domainName}
                          </span>

                          <button
                            onClick={() => handleCopyId(studentFormattedId)}
                            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-mono text-slate-300 bg-[#172b48] hover:bg-[#1f3a60] border border-slate-700/60 transition shadow-2xs"
                            title="Click to copy ID"
                          >
                            <span>ID: {studentFormattedId}</span>
                            {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-slate-400" />}
                          </button>
                          {copiedId && <span className="text-[10px] text-emerald-400 font-bold animate-pulse">Copied!</span>}
                        </div>
                      </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="bg-[#0a182c]/75 border border-slate-700/50 rounded-full px-5 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300 shadow-inner">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Enrolled: <strong className="text-white font-semibold">{enrollmentDate}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Duration: <strong className="text-white font-semibold">{durationStr}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Sliders className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Tasks: <strong className="text-[#00c9a7] font-bold">{completedTasksCount} / {totalTasksCount} Completed</strong></span>
                      </div>
                    </div>

                    {/* Action Buttons Rows */}
                    <div className="space-y-3 pt-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          onClick={() => {
                            setSelectedOfferLetter(offerLettersList[0] || null);
                            setShowOfferLetterModal(true);
                          }}
                          className="px-4 py-2 rounded-full bg-[#1a3258] hover:bg-[#234172] text-white border border-slate-600/50 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>View Offer Letter</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedOfferLetter(offerLettersList[0] || null);
                            setShowOfferLetterModal(true);
                            setTimeout(() => window.print(), 300);
                          }}
                          className="px-4 py-2 rounded-full bg-[#1a3258] hover:bg-[#234172] text-white border border-slate-600/50 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Download Offer Letter</span>
                        </button>

                        <button
                          onClick={() => setShowIdCardModal(true)}
                          className="px-4 py-2 rounded-full bg-[#1a3258] hover:bg-[#234172] text-white border border-slate-600/50 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Download ID Card</span>
                        </button>

                        <button
                          onClick={() => {
                            setActiveView('guide');
                          }}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5 text-sky-200" />
                          <span>Training &amp; Student Guide</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <a
                          href={internshipData?.whatsapp_url || 'https://chat.whatsapp.com/SkyrovixBatch1Official'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center gap-2 transition shadow-sm active:scale-95"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-white" />
                          <span>WhatsApp Group</span>
                        </a>

                        <a
                          href="https://www.instagram.com/skyrovix"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-xs flex items-center gap-2 transition shadow-sm active:scale-95"
                        >
                          <InstagramIcon className="w-4 h-4 fill-white" />
                          <span>Instagram</span>
                        </a>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: 100% Circular Progress Meter */}
                  <div className="shrink-0 flex items-center justify-center self-center lg:self-auto py-2">
                    <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#08162b] border border-cyan-500/20 p-2.5 relative flex items-center justify-center shadow-2xl">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r={gaugeRadius}
                          fill="transparent"
                          stroke="#142b4b"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r={gaugeRadius}
                          fill="transparent"
                          stroke="#00c9a7"
                          strokeWidth="8"
                          strokeDasharray={gaugeCircumference}
                          strokeDashoffset={gaugeOffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-out"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                        <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                          {progressPct}%
                        </span>
                        <span className="text-[9px] font-extrabold tracking-widest text-[#00c9a7] uppercase mt-0.5">
                          PROGRESS
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              </section>

              {/* 2. Training Curriculum & Student Guide Quick Hub */}
              <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-md">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                          OFFICIAL CURRICULUM
                        </span>
                        <span className="text-xs font-bold text-slate-500">20 Modules • 15 Parts</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        Training &amp; Detailed Student Guide
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                        AI Tools → Code → Backend → Database → GitHub → Vercel → Domain • Master all 20 modules with guided practicals, prompt templates, and live deployment steps.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <button
                      onClick={() => setActiveView('guide')}
                      className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-[#07284a] hover:bg-[#0c3664] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-sky-400" />
                      <span>Open Student Guide →</span>
                    </button>
                    <button
                      onClick={() => setActiveView('tasks')}
                      className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                      <span>Assigned Projects</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* 3. Three Metric Summary Cards */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-full bg-[#e6f9f0] text-[#00b074] flex items-center justify-center shadow-xs">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="bg-[#00a86b] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-2xs">
                      COMPLETED TASKS
                    </span>
                  </div>
                  <div className="mt-5 space-y-0.5">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {completedTasksCount} / {totalTasksCount}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Approved Deliverables
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-full bg-amber-50 text-[#ff8c00] flex items-center justify-center shadow-xs">
                      <Clock className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="bg-[#ff8c00] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-2xs">
                      SUBMITTED TASKS
                    </span>
                  </div>
                  <div className="mt-5 space-y-0.5">
                    <div className="text-3xl font-black text-slate-900 tracking-tight">
                      {submittedTasksCount}
                    </div>
                    <div className="text-xs font-semibold text-slate-500">
                      Pending Review
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-md transition">
                  <div className="flex items-center justify-between">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
                      <Award className="w-5 h-5 stroke-[2.5]" />
                    </div>
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-2xs">
                      CERTIFICATE STATUS
                    </span>
                  </div>
                  <div className="mt-5 space-y-0.5">
                    <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                      {completedTasksCount === totalTasksCount && totalTasksCount > 0 ? (certificatesList[0]?.id || 'SKY-B1-9055-CERT') : 'Pending Tasks'}
                    </div>
                    <div className={`text-xs font-semibold ${completedTasksCount === totalTasksCount && totalTasksCount > 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {completedTasksCount === totalTasksCount && totalTasksCount > 0 ? 'Verified & Active' : `${completedTasksCount} of ${totalTasksCount} Approved`}
                    </div>
                  </div>
                </div>
              </section>

              {/* Stepper Progress */}
              <section className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-6">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-slate-700" />
                  <h3 className="font-bold text-sm text-slate-900">Internship Milestone Progress</h3>
                </div>

                <div className="py-2 px-2 sm:px-8">
                  <div className="relative">
                    {/* Connecting Bar */}
                    <div className="absolute top-[18px] left-[5%] right-[5%] h-[2px] bg-slate-200 z-0">
                      <div 
                        className="h-full bg-[#00b074] transition-all duration-700"
                        style={{
                          width: (completedTasksCount === totalTasksCount && totalTasksCount > 0)
                            ? '100%' 
                            : (submittedTasksCount > 0 || completedTasksCount > 0 ? '50%' : '0%')
                        }}
                      />
                    </div>
                    <div className="relative z-10 flex items-start justify-between">
                      {/* Step 1 */}
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-[#00b074] text-white flex items-center justify-center shadow-xs">
                          <Check className="w-5 h-5 stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-800 mt-2 text-center">
                          Application Submitted
                        </span>
                        <span className="text-[10px] text-emerald-600 font-bold">Confirmed</span>
                      </div>

                      {/* Step 2 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shadow-xs transition-colors ${
                          completedTasksCount === totalTasksCount && totalTasksCount > 0
                            ? 'bg-[#00b074] text-white'
                            : (submittedTasksCount > 0 || completedTasksCount > 0)
                              ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                              : 'bg-slate-100 text-slate-400 border border-slate-200 font-bold text-xs'
                        }`}>
                          {completedTasksCount === totalTasksCount && totalTasksCount > 0 ? (
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          ) : (
                            <span>{completedTasksCount}/{totalTasksCount}</span>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 mt-2 text-center max-w-[140px]">
                          Tasks Completed &amp; Approved
                        </span>
                        <span className={`text-[10px] font-bold ${
                          completedTasksCount === totalTasksCount && totalTasksCount > 0
                            ? 'text-emerald-600' 
                            : (submittedTasksCount > 0 || completedTasksCount > 0 ? 'text-amber-600' : 'text-slate-400')
                        }`}>
                          {completedTasksCount === totalTasksCount && totalTasksCount > 0 
                            ? 'All Passed' 
                            : `${completedTasksCount} of ${totalTasksCount} Passed`}
                        </span>
                      </div>

                      {/* Step 3 */}
                      <div className="flex flex-col items-center">
                        <div className={`w-11 h-11 -mt-1 rounded-full flex items-center justify-center text-sm transition-colors ${
                          completedTasksCount === totalTasksCount && totalTasksCount > 0
                            ? 'border-4 border-emerald-200 bg-[#00b074] text-white font-bold shadow-inner'
                            : 'border-2 border-slate-200 bg-slate-50 text-slate-400'
                        }`}>
                          {completedTasksCount === totalTasksCount && totalTasksCount > 0 ? (
                            <Check className="w-5 h-5 text-white stroke-[2.5]" />
                          ) : (
                            <Lock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-800 mt-1 text-center">
                          Certificate Issued
                        </span>
                        <span className={`text-[10px] font-bold ${completedTasksCount === totalTasksCount && totalTasksCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                          {completedTasksCount === totalTasksCount && totalTasksCount > 0 ? 'Issued & Verified' : 'Locked'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Task Deliverables Preview */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                      Full Stack Curriculum Projects ({tasksList.length})
                    </h2>
                    <p className="text-xs text-slate-500">50 production deliverables across Month 1, Month 2, and Month 3</p>
                  </div>
                  <button
                    onClick={() => setActiveView('tasks')}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition"
                  >
                    <span>Explore all {tasksList.length || 50} tasks</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tasksList.slice(0, 3).map((task, idx) => {
                    const statusInfo = getTaskStatusInfo(task);
                    const StatusIcon = statusInfo.icon;
                    const projNum = task.order_num ? String(task.order_num).padStart(2, '0') : String(idx + 1).padStart(2, '0');
                    return (
                      <div
                        key={task.id}
                        className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 border-l-[5px] ${statusInfo.borderLeft} flex flex-col justify-between hover:shadow-md transition`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono flex items-center justify-center font-bold text-xs shadow-xs">
                                #{projNum}
                              </span>
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                {task.dueDate || 'Month 1'}
                              </span>
                            </div>
                            <span className={`${statusInfo.badgeBg} text-[11px] font-bold px-3 py-0.5 rounded-full flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusInfo.badgeText}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-slate-900 leading-snug">{task.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{task.description}</p>
                          </div>
                        </div>

                        <div className="pt-4">
                          <button
                            onClick={() => handleOpenTask(task)}
                            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${statusInfo.buttonBg}`}
                          >
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span>{statusInfo.buttonText}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

            </div>
          )}

          {/* ========================================================
              VIEW 2: MY PROFILE (SECTION 6)
          ======================================================== */}
          {activeView === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Student Profile</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Manage your personal information, university credentials, and technical skills</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  Account Active
                </span>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
                
                {/* Profile Top Row */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100">
                  <div className="relative group shrink-0">
                    <div className="w-20 h-20 rounded-full border-2 border-slate-200 p-0.5 overflow-hidden shadow-md bg-slate-800">
                      {renderAvatar("w-full h-full", "text-2xl")}
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-md border-2 border-white transition active:scale-95"
                      title="Upload profile photo"
                    >
                      <Camera className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{profileForm.full_name || internName}</h3>
                        <p className="text-xs text-slate-500">{internEmail}</p>
                      </div>

                      {/* Photo Upload and Remove Actions */}
                      <div className="flex items-center justify-center sm:justify-end gap-2 pt-1 sm:pt-0">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>{(profileData?.profile?.avatar_url || profileForm.avatar_url) ? 'Change Photo' : 'Upload Photo'}</span>
                        </button>
                        {(profileData?.profile?.avatar_url || profileForm.avatar_url) && (
                          <button
                            type="button"
                            onClick={handleRemovePhoto}
                            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <span className="text-xs font-mono font-bold text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                        {studentFormattedId}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        Batch 1 Intern
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {(profileData?.profile?.avatar_url || profileForm.avatar_url) ? 'Custom photo attached' : 'Default initials avatar active'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Profile Edit Form */}
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.full_name}
                        onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Email Address (Read-Only)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={profileForm.email}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 text-xs cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Mobile Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={profileForm.mobile}
                        onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        College / Institution
                      </label>
                      <input
                        type="text"
                        value={profileForm.college}
                        onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Department / Branch
                      </label>
                      <input
                        type="text"
                        value={profileForm.department}
                        onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Year of Study
                      </label>
                      <select
                        value={profileForm.year_of_study}
                        onChange={(e) => setProfileForm({ ...profileForm, year_of_study: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                        <option value="Recent Graduate">Recent Graduate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        City / Location
                      </label>
                      <input
                        type="text"
                        value={profileForm.city}
                        onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Skill Level
                      </label>
                      <select
                        value={profileForm.skill_level}
                        onChange={(e) => setProfileForm({ ...profileForm, skill_level: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      >
                        <option value="Beginner">Beginner (Foundations)</option>
                        <option value="Intermediate">Intermediate (Project Experience)</option>
                        <option value="Advanced">Advanced (Production Experience)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Professional Bio
                    </label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Briefly describe your technical interests, full stack projects, or career ambitions..."
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/username"
                        value={profileForm.github_url}
                        onChange={(e) => setProfileForm({ ...profileForm, github_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/username"
                        value={profileForm.linkedin_url}
                        onChange={(e) => setProfileForm({ ...profileForm, linkedin_url: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-3">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('dashboard')}
                      className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 3: MY INTERNSHIP (SECTION 7)
          ======================================================== */}
          {activeView === 'internship' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Internship Program Details</h2>
                <p className="text-xs text-slate-500 mt-0.5">Overview of your enrolled domain, technical requirements, and curriculum roadmap</p>
              </div>

              <div className="bg-gradient-to-r from-[#0d1f3d] via-[#102a54] to-[#0c1e3a] rounded-3xl p-6 sm:p-8 text-white relative shadow-xl overflow-hidden">
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {internshipData?.batch_name || 'Batch 1'} • 3-MONTH FULL STACK INTERNSHIP • 50 PROJECTS
                    </span>
                    <h3 className="text-2xl font-black text-white mt-2">
                      Full Stack Web Development &amp; Architecture
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                      {internshipData?.overview || '50 progressive deliverables moving from browser fundamentals (HTML/CSS/JS) to React, Node/Express APIs, relational MySQL/PostgreSQL & NoSQL databases, authentication, real-time systems, full stack deployment, payments, Docker, CI/CD, and production architecture.'}
                    </p>
                  </div>

                  <div className="bg-black/30 p-4 rounded-2xl border border-white/10 text-xs font-mono space-y-1.5 shrink-0">
                    <div>Status: <span className="text-[#00c9a7] font-bold">Active &amp; Verified</span></div>
                    <div>Start: <span className="text-white">{internshipData?.start_date || '21 Sept 2026'}</span></div>
                    <div>End: <span className="text-white">{internshipData?.end_date || '26 Oct 2026'}</span></div>
                    <div>Progress: <span className="text-cyan-300 font-bold">{progressPct}% Completed</span></div>
                  </div>
                </div>
              </div>

              {/* Requirements & Resources */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Internship Requirements &amp; Code Quality</span>
                  </h4>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Working Node.js 18+ and Git environment on workstation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Free-tier deployment provider account (Vercel/Render/Netlify) for deployments</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Documented GitHub repository submissions with clear README</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>Participation in sprint milestone evaluations</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-3">
                  <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    <span>Starter Kits &amp; Engineering Resources</span>
                  </h4>
                  <div className="space-y-2">
                    {internshipData?.resources?.map((r, idx) => (
                      <a
                        key={idx}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition border border-slate-100"
                      >
                        <span className="font-semibold text-slate-800">{r.title}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 4: APPLICATIONS (SECTION 9)
          ======================================================== */}
          {activeView === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">My Applications</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Track your Skyrovix program applications, approval stages, and payment records</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Application ID</th>
                        <th className="py-3.5 px-6">Domain / Program</th>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6">Payment</th>
                        <th className="py-3.5 px-6">Stage Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applicationsList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            No applications on record.
                          </td>
                        </tr>
                      ) : (
                        applicationsList.map(app => (
                          <tr key={app.application_id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-6 font-mono font-bold text-sky-700">
                              {app.application_id}
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900">{domainName}</div>
                              <div className="text-[11px] text-slate-500">{app.program_title || '3-Month Full Stack Development'}</div>
                            </td>
                            <td className="py-4 px-6 text-slate-600 font-mono">
                              {enrollmentDate}
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                ₹{app.amount || 200} PAID
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                                {app.registration_status === 'CONFIRMED' ? 'Enrolled & Confirmed' : app.registration_status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => setActiveView('internship')}
                                className="px-3 py-1 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 font-bold transition"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW: TRAINING & DETAILED STUDENT GUIDE (20 MODULES)
          ======================================================== */}
          {(activeView === 'guide' || activeView === 'training' || activeView === 'workflow') && (
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-4 sm:p-8 shadow-xs border border-slate-200/80">
                <StudentGuideView isEmbeddedInDashboard={true} onOpenApply={() => {}} />
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 5: PROJECTS / TASKS (50 SPRINT DELIVERABLES)
          ======================================================== */}
          {activeView === 'tasks' && (() => {
            const filteredTasks = tasksList.filter(task => {
              const order = task.order_num || 0;
              if (taskMonthFilter === 'MONTH_1' && (order < 1 || order > 15)) return false;
              if (taskMonthFilter === 'MONTH_2' && (order < 16 || order > 35)) return false;
              if (taskMonthFilter === 'MONTH_3' && (order < 36 || order > 50)) return false;

              const isCompleted = task.status === 'Completed' || task.submission?.status === 'APPROVED';
              const isSubmitted = !isCompleted && (task.status === 'Submitted' || task.submission?.status === 'SUBMITTED');
              if (taskFilter === 'COMPLETED' && !isCompleted) return false;
              if (taskFilter === 'SUBMITTED' && !isSubmitted) return false;
              if (taskFilter === 'PENDING' && (isCompleted || isSubmitted)) return false;

              if (taskSearchQuery.trim()) {
                const q = taskSearchQuery.toLowerCase().trim();
                const numStr = String(order).padStart(2, '0');
                const title = (task.title || '').toLowerCase();
                const desc = (task.description || '').toLowerCase();
                const diff = (task.difficulty || '').toLowerCase();
                const outcome = (task.expectedOutcome || '').toLowerCase();
                const feats = (task.keyFeatures || []).join(' ').toLowerCase();

                if (
                  !title.includes(q) &&
                  !desc.includes(q) &&
                  !diff.includes(q) &&
                  !outcome.includes(q) &&
                  !feats.includes(q) &&
                  !numStr.includes(q) &&
                  !task.id.toLowerCase().includes(q)
                ) {
                  return false;
                }
              }

              return true;
            });

            return (
              <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        50 SPRINT PROJECTS
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        3-Month Full Stack Internship
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                      Full Stack Curriculum Projects ({tasksList.length})
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Progressively submit code repositories and live URLs from browser fundamentals to production architecture
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200/80 shadow-2xs self-start md:self-auto">
                    <span className="text-xs font-bold text-slate-600">
                      Completed: <strong className="text-emerald-600">{completedTasksCount}</strong> / {totalTasksCount}
                    </span>
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div 
                        className="h-full bg-[#00b074] rounded-full transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-slate-800">{progressPct}%</span>
                  </div>
                </div>

                {/* Month Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2 border-b border-slate-200/80 pb-3">
                  <button
                    onClick={() => setTaskMonthFilter('ALL')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                      taskMonthFilter === 'ALL'
                        ? 'bg-slate-950 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    All Months ({tasksList.length})
                  </button>

                  <button
                    onClick={() => setTaskMonthFilter('MONTH_1')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                      taskMonthFilter === 'MONTH_1'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Month 1: Foundation ({month1TasksCount})
                  </button>

                  <button
                    onClick={() => setTaskMonthFilter('MONTH_2')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                      taskMonthFilter === 'MONTH_2'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Month 2: Full Stack ({month2TasksCount})
                  </button>

                  <button
                    onClick={() => setTaskMonthFilter('MONTH_3')}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition ${
                      taskMonthFilter === 'MONTH_3'
                        ? 'bg-cyan-700 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    Month 3: Advanced Full Stack ({month3TasksCount})
                  </button>
                </div>

                {/* Search Bar & Status Filter Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search by project name, tech stack, or # (e.g. #01, React, Docker)..."
                      value={taskSearchQuery}
                      onChange={(e) => setTaskSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none shadow-2xs"
                    />
                    {taskSearchQuery && (
                      <button
                        onClick={() => setTaskSearchQuery('')}
                        className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600 font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 text-xs self-start sm:self-auto">
                    <button
                      onClick={() => setTaskFilter('ALL')}
                      className={`px-3 py-1 rounded-xl font-bold transition ${taskFilter === 'ALL' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      All Status
                    </button>
                    <button
                      onClick={() => setTaskFilter('PENDING')}
                      className={`px-3 py-1 rounded-xl font-bold transition ${taskFilter === 'PENDING' ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      Pending ({pendingTasksCount})
                    </button>
                    <button
                      onClick={() => setTaskFilter('SUBMITTED')}
                      className={`px-3 py-1 rounded-xl font-bold transition ${taskFilter === 'SUBMITTED' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      Submitted ({submittedTasksCount})
                    </button>
                    <button
                      onClick={() => setTaskFilter('COMPLETED')}
                      className={`px-3 py-1 rounded-xl font-bold transition ${taskFilter === 'COMPLETED' ? 'bg-[#00b074] text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                    >
                      Completed ({completedTasksCount})
                    </button>
                  </div>
                </div>

                {/* Empty State */}
                {filteredTasks.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">No Projects Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No deliverables match your search query or selected month/status filters.
                    </p>
                    <button
                      onClick={() => {
                        setTaskMonthFilter('ALL');
                        setTaskFilter('ALL');
                        setTaskSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTasks.map((task) => {
                      const statusInfo = getTaskStatusInfo(task);
                      const StatusIcon = statusInfo.icon;
                      const projNum = task.order_num ? String(task.order_num).padStart(2, '0') : task.id.replace('proj-', '');
                      const diffStr = task.difficulty || 'Beginner';
                      const diffBadge = diffStr.includes('Beginner')
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : diffStr.includes('Intermediate')
                        ? 'bg-sky-50 text-sky-700 border-sky-200'
                        : diffStr.includes('Full Stack')
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : diffStr.includes('Advanced')
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200';

                      return (
                        <div
                          key={task.id}
                          className={`bg-white rounded-2xl p-6 shadow-sm border border-slate-200/90 border-l-[5px] ${statusInfo.borderLeft} flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group`}
                        >
                          <div className="space-y-3">
                            {/* Top Row: Project number chip, difficulty, and status pill */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-slate-900 text-white font-mono flex items-center justify-center font-bold text-xs shadow-xs">
                                  #{projNum}
                                </span>
                                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${diffBadge}`}>
                                  {diffStr}
                                </span>
                              </div>

                              <span className={`${statusInfo.badgeBg} text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.badgeText}
                              </span>
                            </div>

                            {/* Due Date & Submission State */}
                            <div className="space-y-1 pt-1 border-t border-slate-100">
                              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  {task.dueDate || 'Month 1'}
                                </span>
                                <span className="text-[11px] font-mono text-slate-400">
                                  ID: {task.id}
                                </span>
                              </div>

                              <div className={`flex items-center gap-1.5 text-xs font-bold ${
                                statusInfo.status === 'Completed' ? 'text-[#00b074]' : statusInfo.status === 'Submitted' ? 'text-amber-600' : 'text-slate-500'
                              }`}>
                                <StatusIcon className="w-3.5 h-3.5" />
                                <span>{statusInfo.verifiedText}</span>
                                {statusInfo.showCheckMark && (
                                  <span className="text-[10px] bg-[#e6f9f0] border border-[#a3e9c9] px-1 rounded">✔</span>
                                )}
                              </div>
                            </div>

                            {/* Title & Description / What to Learn */}
                            <div>
                              <h3 className="text-base font-bold text-slate-900 leading-snug">
                                {task.title}
                              </h3>
                              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                                {task.description}
                              </p>
                            </div>

                            {/* KEY REQUIREMENTS / FEATURES */}
                            {task.keyFeatures && task.keyFeatures.length > 0 && (
                              <div className="pt-1">
                                <h4 className="text-[10px] font-extrabold text-[#2563eb] uppercase tracking-wider mb-1">
                                  KEY REQUIREMENTS:
                                </h4>
                                <ul className="text-[11px] text-slate-600 space-y-1">
                                  {task.keyFeatures.slice(0, 2).map((feat, fIdx) => (
                                    <li key={fIdx} className="flex items-start gap-1.5 leading-snug">
                                      <span className="text-[#2563eb] font-black text-sm leading-none">•</span>
                                      <span className="line-clamp-1">{feat}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* EXPECTED OUTCOME */}
                            {task.expectedOutcome && (
                              <div className="pt-1">
                                <h4 className="text-[10px] font-extrabold text-[#009b68] uppercase tracking-wider mb-0.5">
                                  EXPECTED OUTCOME:
                                </h4>
                                <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                                  {task.expectedOutcome}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Bottom Action Pill */}
                          <div className="pt-5">
                            <button
                              onClick={() => handleOpenTask(task)}
                              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs active:scale-[0.99] ${statusInfo.buttonBg}`}
                            >
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span>{statusInfo.buttonText}</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* ========================================================
              VIEW 6: CERTIFICATES (SECTION 10)
          ======================================================== */}
          {activeView === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Internship Certificates</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Official digital verifiable credentials authenticated by Skyrovix Technologies</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificatesList.map(cert => (
                  <div key={cert.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">Certificate of Completion</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                        {cert.status || 'ISSUED'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-slate-400 font-mono">CREDENTIAL ID:</div>
                      <div className="text-base font-extrabold text-slate-900 font-mono">{cert.id}</div>
                      <div className="text-xs text-slate-600 pt-1">
                        Awarded to <strong className="text-slate-900">{cert.student_name || internName}</strong> for successfully completing the <strong>{cert.program || '3-Month Full Stack Development Internship'}</strong>.
                      </div>
                      <div className="text-xs text-slate-500 pt-1">
                        Issue Date: <span className="font-semibold text-slate-700">{cert.issue_date || '26 Oct 2026'}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <button
                        onClick={() => onVerifyCert ? onVerifyCert(cert.id) : window.open(`/verify/${cert.id}`, '_blank')}
                        className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Verify Credential</span>
                      </button>

                      <button
                        onClick={() => window.print()}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 7: OFFER LETTERS (SECTION 11)
          ======================================================== */}
          {activeView === 'offer-letters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Internship Offer Letters</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Official letters of appointment and verification codes issued by Skyrovix Director Board</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {offerLettersList.map(ol => (
                  <div key={ol.id} className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <FileCheck2 className="w-5 h-5 text-sky-600" />
                        <span className="text-xs font-bold text-slate-900">Official Letter of Offer</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black">
                        {ol.status || 'ACTIVE'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="text-xs text-slate-400 font-mono">VERIFICATION CODE:</div>
                      <div className="text-base font-extrabold text-slate-900 font-mono">{ol.verification_code || 'SKX-OL-2026-9055'}</div>
                      <div className="text-xs text-slate-600 pt-1">
                        Domain: <strong className="text-slate-900">{ol.domain || domainName}</strong> • Duration: <strong>{ol.duration || durationStr}</strong>
                      </div>
                      <div className="text-xs text-slate-500 pt-1">
                        Issue Date: <span className="font-semibold text-slate-700">{ol.issue_date || enrollmentDate}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-2">
                      <button
                        onClick={() => {
                          setSelectedOfferLetter(ol);
                          setShowOfferLetterModal(true);
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Corporate Letter</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedOfferLetter(ol);
                          setShowOfferLetterModal(true);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Print / Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 8: PAYMENTS (SECTION 12)
          ======================================================== */}
          {activeView === 'payments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Payment History &amp; Receipts</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time payment transactions verified through Cashfree Payment Gateway</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Order ID</th>
                        <th className="py-3.5 px-6">Amount</th>
                        <th className="py-3.5 px-6">Method</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6">Date</th>
                        <th className="py-3.5 px-6 text-right">Receipt</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentsList.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-slate-400">
                            No payment transactions recorded.
                          </td>
                        </tr>
                      ) : (
                        paymentsList.map(pay => (
                          <tr key={pay.payment_id || pay.order_id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-6 font-mono font-bold text-slate-900">
                              {pay.order_id}
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-900">
                              ₹{pay.amount || 200}.00 {pay.currency || 'INR'}
                            </td>
                            <td className="py-4 px-6 text-slate-600">
                              {pay.payment_method || 'Online Payment'}
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                                {pay.status === 'PAID' ? 'SUCCESS / PAID' : pay.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-slate-500 font-mono">
                              {enrollmentDate}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => {
                                  setSelectedPayment(pay);
                                  setShowReceiptModal(true);
                                }}
                                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                              >
                                View Receipt
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 9: NOTIFICATIONS (SECTION 13)
          ======================================================== */}
          {activeView === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Notifications &amp; Announcements</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Stay updated on submission approvals, orientation dates, and corporate notices</p>
                </div>
                <button
                  onClick={handleMarkAllNotificationsRead}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition"
                >
                  Mark All Read
                </button>
              </div>

              <div className="space-y-3">
                {notificationsList.map(n => (
                  <div
                    key={n.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      n.is_read ? 'bg-white border-slate-200/80 shadow-2xs' : 'bg-sky-50/70 border-sky-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${n.is_read ? 'bg-slate-300' : 'bg-sky-600'}`} />
                          <h4 className="font-bold text-sm text-slate-900">{n.title}</h4>
                        </div>
                        <p className="text-xs text-slate-600 pl-4">{n.message}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {n.created_at ? new Date(n.created_at).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 10: SUPPORT TICKETS (SECTION 14)
          ======================================================== */}
          {activeView === 'support' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Technical Support &amp; Mentorship Inquiries</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Submit helpdesk requests directly to the Skyrovix mentor board</p>
                </div>
                <button
                  onClick={() => setShowTicketModal(true)}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Submit New Ticket</span>
                </button>
              </div>

              {/* Tickets List */}
              <div className="space-y-4">
                {supportTicketsList.length === 0 ? (
                  <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 text-slate-400 text-xs">
                    No support tickets found. Click "Submit New Ticket" to open an inquiry.
                  </div>
                ) : (
                  supportTicketsList.map(ticket => (
                    <div
                      key={ticket.id}
                      className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-sky-700">{ticket.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                              {ticket.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mt-1">{ticket.subject}</h4>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl">
                        {ticket.message}
                      </p>

                      {/* Replies Thread */}
                      {ticket.replies && ticket.replies.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <h5 className="text-[11px] font-extrabold uppercase text-slate-400 tracking-wider">
                            Mentor &amp; Staff Responses:
                          </h5>
                          {ticket.replies.map(rep => (
                            <div
                              key={rep.id}
                              className={`p-3 rounded-xl text-xs space-y-1 ${
                                rep.sender_role === 'ADMIN' ? 'bg-sky-50 border border-sky-100' : 'bg-slate-50 border border-slate-100'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">
                                  {rep.sender_name} {rep.sender_role === 'ADMIN' && '(Skyrovix Mentor Board)'}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {rep.created_at ? new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                                </span>
                              </div>
                              <p className="text-slate-700">{rep.message}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Interactive Student Reply Box */}
                      <div className="pt-2 flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your response to the mentors..."
                          value={activeTicketThread?.id === ticket.id ? ticketReplyText : ''}
                          onChange={(e) => {
                            setActiveTicketThread(ticket);
                            setTicketReplyText(e.target.value);
                          }}
                          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSendTicketReply(ticket.id)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Reply</span>
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 11: SETTINGS & SECURITY (SECTION 15)
          ======================================================== */}
          {activeView === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Account Settings &amp; Security</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage your credentials, change password, and customize dashboard notifications</p>
              </div>

              {/* Password Change Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Lock className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Change Account Password</h3>
                </div>

                {passwordMsg.error && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                    {passwordMsg.error}
                  </div>
                )}
                {passwordMsg.success && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    {passwordMsg.success}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Current Password (Optional if first time)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      New Password (Min 6 characters) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Confirm New Password <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={changingPassword}
                    className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 transition"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{changingPassword ? 'Updating Password...' : 'Update Password'}</span>
                  </button>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Bell className="w-4 h-4 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900">Notification Preferences</h3>
                </div>

                <div className="space-y-3 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-900">Task Review &amp; Evaluation Alerts</div>
                      <div className="text-slate-500">Receive in-app and email notifications when mentors review your code</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-sky-600 rounded" />
                  </label>

                  <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                    <div>
                      <div className="font-bold text-slate-900">Certificate &amp; Offer Letter Notifications</div>
                      <div className="text-slate-500">Alerts when official documents are generated or verified</div>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-sky-600 rounded" />
                  </label>
                </div>
              </div>

            </div>
          )}

        </main>

      </div>

      {/* ========================================================
          MODAL: OFFICIAL OFFER LETTER PREVIEW
      ======================================================== */}
      {showOfferLetterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto space-y-6 text-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
                Official Skyrovix Letter of Offer
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setShowOfferLetterModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Official Letterhead */}
            <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 bg-white shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
                <img src={navLogo} alt="Skyrovix" className="h-10 w-auto object-contain" />
                <div className="text-right text-[11px] text-slate-500 space-y-0.5 font-medium">
                  <div className="font-extrabold text-slate-900 text-xs">Skyrovix Technologies Pvt. Ltd.</div>
                  <div>CIN: U72900TN2024PTC168921</div>
                  <div>support@skyrovix.com • www.skyrovix.com</div>
                </div>
              </div>

              <div className="flex justify-between text-xs font-semibold text-slate-600">
                <div>Ref No: <span className="font-mono text-slate-900">SKX/INT/2026/B1-9055</span></div>
                <div>Date: <span className="text-slate-900">{enrollmentDate}</span></div>
              </div>

              <div className="text-xs space-y-1 text-slate-700">
                <div>To,</div>
                <div className="font-extrabold text-base text-slate-900">{internName}</div>
                <div>Student ID: <span className="font-mono font-bold text-sky-700">{studentFormattedId}</span></div>
                <div>Department of {profile.department || 'Computer Science / IT'}</div>
                <div>{profile.college || 'Engineering & Technology'}</div>
              </div>

              <div className="bg-sky-50/70 p-3 rounded-xl border border-sky-100 text-xs font-bold text-sky-950">
                Subject: Letter of Offer – Virtual Internship in {domainName} (Batch 1)
              </div>

              <div className="text-xs text-slate-700 space-y-3 leading-relaxed">
                <p>Dear <strong>{internName}</strong>,</p>
                <p>
                  We are delighted to extend to you an offer of internship with <strong>Skyrovix Technologies</strong> as a Virtual Technical Intern in the <strong>{domainName}</strong> track, Batch 1.
                </p>
                
                <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-medium">
                  <div><strong>Designation:</strong> Technical Intern ({domainName})</div>
                  <div><strong>Batch:</strong> Batch 1 (2026)</div>
                  <div><strong>Mode:</strong> 100% Virtual / Remote</div>
                  <div><strong>Duration:</strong> {durationStr}</div>
                  <div><strong>Stipend:</strong> Performance / Capstone Based</div>
                  <div><strong>Reporting:</strong> Technical Mentor Board</div>
                </div>

                <p>
                  Upon satisfactory completion of assigned sprint tasks and code reviews, you will be awarded an official, verifiable Certificate of Internship Completion along with a Letter of Recommendation.
                </p>
              </div>

              {/* Signatures & Seal */}
              <div className="pt-6 border-t border-slate-200 flex items-end justify-between">
                <div>
                  <img src={signatureImg} alt="Authorized Signature" className="h-10 w-auto object-contain mb-1" />
                  <div className="font-extrabold text-xs text-slate-900">Hariharan S</div>
                  <div className="text-[10px] text-slate-500 font-semibold">Director of Engineering &amp; Talent</div>
                  <div className="text-[10px] text-sky-700 font-bold">Skyrovix Technologies</div>
                </div>
                <div className="w-20 h-20 opacity-80">
                  <img src={sealImg} alt="Official Seal" className="w-full h-full object-contain" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Offer Letter</span>
              </button>
              <button
                onClick={() => setShowOfferLetterModal(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: STUDENT ID CARD
      ======================================================== */}
      {showIdCardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-6 text-slate-800 text-center">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                Official Student Intern ID Card
              </span>
              <button onClick={() => setShowIdCardModal(false)} className="w-7 h-7 rounded-full hover:bg-slate-100 text-slate-400 font-bold">✕</button>
            </div>

            <div className="relative mx-auto w-full max-w-xs rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c1e38] via-[#102a54] to-[#0a182d] text-white p-6 shadow-xl border border-slate-700/80">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <img src={navLogo} alt="Skyrovix" className="h-7 w-auto object-contain brightness-0 invert" />
                <span className="text-[9px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  BATCH 1
                </span>
              </div>

              <div className="my-5 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full border-2 border-[#00c9a7] p-0.5 overflow-hidden shadow-lg bg-slate-800 mb-2">
                  {renderAvatar("w-full h-full", "text-2xl")}
                </div>
                <h3 className="text-base font-extrabold text-white">{internName}</h3>
                <span className="text-xs font-semibold text-cyan-300">{domainName} Intern</span>
                <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full mt-1 border border-white/15">
                  ID: {studentFormattedId}
                </span>
              </div>

              <div className="bg-black/25 rounded-xl p-3 text-[11px] text-left space-y-1 border border-white/10 font-mono text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Valid:</span>
                  <span className="text-white font-bold">{enrollmentDate} - 26 Oct 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="text-[#00c9a7] font-bold">VERIFIED ACTIVE</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save ID Card</span>
              </button>
              <button
                onClick={() => setShowIdCardModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: TASK CODE SUBMISSION & MENTOR REVIEW
      ======================================================== */}
      {showTaskModal && selectedTask && (() => {
        const projNum = selectedTask.order_num ? String(selectedTask.order_num).padStart(2, '0') : selectedTask.id.replace('proj-', '');
        const diffStr = selectedTask.difficulty || 'Beginner';
        const diffBadge = diffStr.includes('Beginner')
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : diffStr.includes('Intermediate')
          ? 'bg-sky-50 text-sky-700 border-sky-200'
          : diffStr.includes('Full Stack')
          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
          : diffStr.includes('Advanced')
          ? 'bg-purple-50 text-purple-700 border-purple-200'
          : 'bg-rose-50 text-rose-700 border-rose-200';

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 text-left text-slate-800 max-h-[92vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="w-7 h-7 rounded-lg bg-slate-900 text-white font-mono flex items-center justify-center font-bold text-xs shadow-xs">
                      #{projNum}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${diffBadge}`}>
                      {diffStr}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {selectedTask.dueDate || 'Month 1'}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {selectedTask.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowTaskModal(false)} 
                  className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 font-bold shrink-0 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>

              {/* Project Briefing Card */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/90 space-y-3 text-xs">
                {selectedTask.description && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider block">
                      What You Learn &amp; Implement
                    </span>
                    <p className="text-slate-700 font-medium mt-0.5">
                      {selectedTask.description}
                    </p>
                  </div>
                )}

                {selectedTask.keyFeatures && selectedTask.keyFeatures.length > 0 && (
                  <div>
                    <span className="text-[10px] font-black uppercase text-blue-600 tracking-wider block mb-1">
                      Project Requirements Checklist
                    </span>
                    <ul className="space-y-1 text-slate-600 pl-1">
                      {selectedTask.keyFeatures.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-1.5 leading-snug">
                          <span className="text-blue-500 font-bold">•</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedTask.expectedOutcome && (
                  <div className="pt-1 border-t border-slate-200/60">
                    <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider block">
                      Expected Deliverable Outcome
                    </span>
                    <p className="text-slate-700 font-semibold mt-0.5">
                      {selectedTask.expectedOutcome}
                    </p>
                  </div>
                )}
              </div>

              {/* Mentor Grade & Feedback if exists */}
              {selectedTask.submission && (
                <div className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                  selectedTask.submission.status === 'APPROVED'
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`font-extrabold flex items-center gap-1.5 ${
                      selectedTask.submission.status === 'APPROVED' ? 'text-emerald-950' : 'text-amber-950'
                    }`}>
                      {selectedTask.submission.status === 'APPROVED' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-600" />
                      )}
                      Review Status: {selectedTask.submission.status === 'APPROVED' ? 'APPROVED & VERIFIED' : 'AWAITING EVALUATION'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full font-black text-[10px] ${
                      selectedTask.submission.status === 'APPROVED' ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
                    }`}>
                      {selectedTask.submission.status === 'APPROVED' ? `Grade: ${selectedTask.submission.grade || 'A+'}` : 'Under Review'}
                    </span>
                  </div>
                  <p className={`text-[11px] leading-relaxed ${
                    selectedTask.submission.status === 'APPROVED' ? 'text-emerald-800' : 'text-amber-800'
                  }`}>
                    {selectedTask.submission.status === 'APPROVED'
                      ? `Mentor Remarks: "${selectedTask.submission.feedback || 'Outstanding architecture design and clean modular components.'}"`
                      : 'Your task deliverable has been submitted and is queued for code review by the Skyrovix mentor team.'}
                  </p>
                </div>
              )}

              {/* Submission Form */}
              <form onSubmit={handleSubmitTaskWork} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Public GitHub Repository URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <GitBranch className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      required
                      placeholder="https://github.com/username/project-repo"
                      value={submissionForm.githubRepoUrl}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, githubRepoUrl: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Must contain clear README, setup steps, and clean commits.</p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Live Deployment URL (Vercel / Render / AWS / Netlify)
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="url"
                      placeholder="https://your-project.vercel.app"
                      value={submissionForm.liveDeploymentUrl}
                      onChange={(e) => setSubmissionForm({ ...submissionForm, liveDeploymentUrl: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Implementation Highlights &amp; Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe key architectural decisions, challenges solved, or testing notes..."
                    value={submissionForm.notes}
                    onChange={(e) => setSubmissionForm({ ...submissionForm, notes: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="submit"
                    disabled={submittingTask}
                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl transition shadow-sm text-xs flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{submittingTask ? 'Submitting Deliverable...' : (selectedTask.submission ? 'Update Submission' : 'Submit Project Deliverable')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        );
      })()}

      {/* ========================================================
          MODAL: PAYMENT RECEIPT
      ======================================================== */}
      {showReceiptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 text-left text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Registration Payment Receipt</h3>
              <button onClick={() => setShowReceiptModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>
            
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-950">Payment Verified: ₹200.00 PAID</div>
                <div className="text-[11px] text-emerald-700 font-mono">Order ID: {selectedPayment?.order_id || 'SKY-B1-1790414574167'}</div>
              </div>
            </div>

            <div className="text-xs space-y-2 py-2 text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Internship Fee:</span>
                <strong className="text-emerald-700">₹0 (100% Free)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Registration &amp; LMS Charge:</span>
                <strong className="text-slate-900">₹200</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Payment Status:</span>
                <strong className="text-emerald-600">SUCCESS / PAID</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Date:</span>
                <strong className="text-slate-900">{enrollmentDate}</strong>
              </div>
            </div>

            <button
              onClick={() => setShowReceiptModal(false)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: SUBMIT SUPPORT TICKET
      ======================================================== */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-left text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Create Support Ticket</h3>
              <button onClick={() => setShowTicketModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newTicketForm.category}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Internship Tasks">Internship Tasks &amp; Evaluation</option>
                  <option value="Offer Letter">Offer Letter Inquiry</option>
                  <option value="Certificate">Certificate Verification</option>
                  <option value="Payments">Payment &amp; Invoice</option>
                  <option value="General Inquiry">General Mentorship Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Summary of your question or issue..."
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Provide details about what you need assistance with..."
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={submittingTicket}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  {submittingTicket ? 'Submitting...' : 'Submit Ticket'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
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
