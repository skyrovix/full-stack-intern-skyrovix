import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Clock, 
  TrendingUp, 
  Search, 
  Download, 
  RefreshCw, 
  Settings, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  LogOut, 
  Key,
  MessageCircle,
  Save,
  AlertCircle,
  FileText,
  Briefcase,
  CheckSquare,
  FileCheck2,
  Bell,
  HelpCircle,
  BarChart3,
  ListFilter,
  Check,
  X,
  Menu,
  ChevronRight,
  Eye,
  Filter,
  Send,
  UserCheck,
  UserX,
  Plus,
  GitMerge
} from 'lucide-react';
import navLogo from '../assets/top nav bar logo.png';
import { AdminWorkflowManagement } from './workflow/AdminWorkflowManagement';

export const AdminDashboard = ({ onLogout }) => {
  // Authentication State
  const [authToken, setAuthToken] = useState(localStorage.getItem('skyrovix_admin_token') || '');
  const [loginForm, setLoginForm] = useState({ email: 'admin@skyrovix.com', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active View State: 'dashboard' | 'users' | 'applications' | 'internships' | 'tasks' | 'certificates' | 'offer-letters' | 'payments' | 'notifications' | 'support' | 'analytics' | 'settings'
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data States
  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [applicationsList, setApplicationsList] = useState([]);
  const [internshipsList, setInternshipsList] = useState([]);
  const [tasksList, setTasksList] = useState([]);
  const [submissionsList, setSubmissionsList] = useState([]);
  const [certificatesList, setCertificatesList] = useState([]);
  const [offerLettersList, setOfferLettersList] = useState([]);
  const [paymentsList, setPaymentsList] = useState([]);
  const [notificationsData, setNotificationsData] = useState({ announcements: [], user_notifications: [] });
  const [supportTicketsList, setSupportTicketsList] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [auditLogsList, setAuditLogsList] = useState([]);
  const [portalSettings, setPortalSettings] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals & Action States
  const [selectedUserDetail, setSelectedUserDetail] = useState(null);
  const [selectedSubmissionToReview, setSelectedSubmissionToReview] = useState(null);
  const [reviewForm, setReviewForm] = useState({ status: 'APPROVED', feedback: '', grade: 'A+' });
  const [showGenerateCertModal, setShowGenerateCertModal] = useState(false);
  const [newCertForm, setNewCertForm] = useState({ student_id: '', program: '3-Month Full Stack Development Internship', duration: '3 Months', batch: 'Batch 1' });
  const [showGenerateOLModal, setShowGenerateOLModal] = useState(false);
  const [newOLForm, setNewOLForm] = useState({ student_id: '', domain: 'Full Stack Development', program: '3-Month Full Stack Development Internship', duration: '1 Month', batch: 'Batch 1' });
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', type: 'announcement', targetAudience: 'ALL', userId: '' });
  const [selectedTicketThread, setSelectedTicketThread] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [ticketStatusUpdate, setTicketStatusUpdate] = useState('Waiting for User');

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Settings Edit inputs
  const [whatsappUrlInput, setWhatsappUrlInput] = useState('');
  const [startNoticeInput, setStartNoticeInput] = useState('');
  const [regFeeInput, setRegFeeInput] = useState('200');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Admin Login Handler
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      setLoginLoading(false);

      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
        return;
      }

      localStorage.setItem('skyrovix_admin_token', data.token);
      setAuthToken(data.token);
    } catch (err) {
      setLoginLoading(false);
      setLoginError('Server connection error. Please try again.');
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('skyrovix_admin_token');
    setAuthToken('');
    if (onLogout) onLogout();
  };

  // Fetch all admin data
  const fetchAllAdminData = async () => {
    if (!authToken) return;
    setLoadingData(true);
    const headers = { Authorization: `Bearer ${authToken}` };

    try {
      const [
        statsRes,
        usersRes,
        appsRes,
        intRes,
        tasksRes,
        certsRes,
        olRes,
        payRes,
        notifRes,
        suppRes,
        analyticsRes,
        auditRes,
        settRes
      ] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/applications', { headers }),
        fetch('/api/admin/internships', { headers }),
        fetch('/api/admin/tasks', { headers }),
        fetch('/api/admin/certificates', { headers }),
        fetch('/api/admin/offer-letters', { headers }),
        fetch('/api/admin/payments', { headers }),
        fetch('/api/admin/notifications', { headers }),
        fetch('/api/admin/support', { headers }),
        fetch('/api/admin/analytics', { headers }),
        fetch('/api/admin/audit-logs', { headers }),
        fetch('/api/admin/settings', { headers })
      ]);

      if (statsRes.status === 401 || usersRes.status === 401) {
        handleAdminLogout();
        return;
      }

      const sData = await statsRes.json();
      setStats(sData.stats);

      const uData = await usersRes.json();
      setUsersList(uData.users || []);

      const aData = await appsRes.json();
      setApplicationsList(aData.applications || []);

      const iData = await intRes.json();
      setInternshipsList(iData.internships || []);

      const tData = await tasksRes.json();
      setTasksList(tData.tasks || []);
      setSubmissionsList(tData.submissions || []);

      const cData = await certsRes.json();
      setCertificatesList(cData.certificates || []);

      const oData = await olRes.json();
      setOfferLettersList(oData.offer_letters || []);

      const pData = await payRes.json();
      setPaymentsList(pData.payments || []);

      const nData = await notifRes.json();
      setNotificationsData({ announcements: nData.announcements || [], user_notifications: nData.user_notifications || [] });

      const supData = await suppRes.json();
      setSupportTicketsList(supData.tickets || []);

      const anData = await analyticsRes.json();
      setAnalyticsData(anData);

      const audData = await auditRes.json();
      setAuditLogsList(audData.logs || []);

      const settData = await settRes.json();
      setPortalSettings(settData.settings || {});
      setWhatsappUrlInput(settData.settings?.BATCH_1_WHATSAPP_URL || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP');
      setStartNoticeInput(settData.settings?.BATCH_START_NOTICE || 'Batch 1 starts within the next 10 days.');
      setRegFeeInput(settData.settings?.REGISTRATION_FEE || '200');

      setLoadingData(false);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchAllAdminData();
    }
  }, [authToken]);

  // Activate / Deactivate User Toggle
  const handleToggleUserStatus = async (user) => {
    const newStatus = user.is_active ? 0 : 1;
    const confirmMsg = user.is_active 
      ? `Are you sure you want to deactivate ${user.full_name}? They will lose dashboard access.` 
      : `Activate dashboard access for ${user.full_name}?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const res = await fetch(`/api/admin/users/${user.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ is_active: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to update user status');
      }
    } catch (err) {
      showToast('Network error updating user status');
    }
  };

  // Approve / Reject Application
  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    if (!window.confirm(`Update application ${appId} to status: ${newStatus}?`)) return;

    try {
      const res = await fetch(`/api/admin/applications/${appId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ registration_status: newStatus })
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to update application');
      }
    } catch (err) {
      showToast('Error updating application');
    }
  };

  // Review & Grade Student Task Submission
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!selectedSubmissionToReview) return;

    try {
      const res = await fetch(`/api/admin/tasks/submissions/${selectedSubmissionToReview.id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(reviewForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Submission evaluated: ${reviewForm.status} (Grade: ${reviewForm.grade})`);
        setSelectedSubmissionToReview(null);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to submit review');
      }
    } catch (err) {
      showToast('Error submitting code review');
    }
  };

  // Generate Certificate for Student
  const handleGenerateCertificate = async (e) => {
    e.preventDefault();
    if (!newCertForm.student_id) {
      showToast('Please select a student');
      return;
    }

    try {
      const res = await fetch('/api/admin/certificates/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(newCertForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Certificate generated successfully! ID: ${data.certificate_id}`);
        setShowGenerateCertModal(false);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to generate certificate');
      }
    } catch (err) {
      showToast('Error generating certificate');
    }
  };

  // Revoke Certificate
  const handleRevokeCertificate = async (certId) => {
    if (!window.confirm(`Revoke certificate ${certId}? It will be marked as invalid during verification.`)) return;

    try {
      const res = await fetch(`/api/admin/certificates/${certId}/revoke`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Certificate revoked');
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('Error revoking certificate');
    }
  };

  // Generate Offer Letter
  const handleGenerateOfferLetter = async (e) => {
    e.preventDefault();
    if (!newOLForm.student_id) {
      showToast('Please select a student');
      return;
    }

    try {
      const res = await fetch('/api/admin/offer-letters/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(newOLForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Offer letter issued! Code: ${data.verification_code}`);
        setShowGenerateOLModal(false);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to issue offer letter');
      }
    } catch (err) {
      showToast('Error generating offer letter');
    }
  };

  // Revoke Offer Letter
  const handleRevokeOfferLetter = async (olId) => {
    if (!window.confirm(`Revoke offer letter ${olId}?`)) return;

    try {
      const res = await fetch(`/api/admin/offer-letters/${olId}/revoke`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Offer letter revoked');
        fetchAllAdminData();
      }
    } catch (e) {
      showToast('Error revoking offer letter');
    }
  };

  // Send Admin Broadcast / Notification
  const handleSendBroadcast = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) {
      showToast('Title and message are required');
      return;
    }

    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(broadcastForm)
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Notification broadcast successfully!');
        setShowBroadcastModal(false);
        setBroadcastForm({ title: '', message: '', type: 'announcement', targetAudience: 'ALL', userId: '' });
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to send notification');
      }
    } catch (err) {
      showToast('Error sending broadcast');
    }
  };

  // Reply to Student Support Ticket (Admin)
  const handleSendAdminReply = async (ticketId) => {
    if (!adminReplyText.trim()) return;

    try {
      const res = await fetch(`/api/admin/support/${ticketId}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          message: adminReplyText.trim(),
          status: ticketStatusUpdate
        })
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Reply dispatched to student successfully!');
        setAdminReplyText('');
        // Refresh ticket details
        const tRes = await fetch(`/api/admin/support/${ticketId}`, { headers: { Authorization: `Bearer ${authToken}` } });
        const tData = await tRes.json();
        setSelectedTicketThread(tData.ticket ? { ...tData.ticket, replies: tData.replies } : null);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to send reply');
      }
    } catch (err) {
      showToast('Error replying to ticket');
    }
  };

  // Save Portal Configuration
  const handleSavePortalSettings = async (e) => {
    e.preventDefault();
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` };

    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify({ key: 'BATCH_1_WHATSAPP_URL', value: whatsappUrlInput.trim() })
      });
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify({ key: 'BATCH_START_NOTICE', value: startNoticeInput.trim() })
      });
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers,
        body: JSON.stringify({ key: 'REGISTRATION_FEE', value: regFeeInput.trim() })
      });

      showToast('Portal configuration saved and active!');
      fetchAllAdminData();
    } catch (err) {
      showToast('Failed to save settings');
    }
  };

  // Manual Verify Cashfree Order
  const handleManualVerifyOrder = async (orderId) => {
    try {
      const res = await fetch(`/api/admin/verify-order/${orderId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      showToast(`Order checked: ${data.verification?.payment_status || 'Verified'}`);
      fetchAllAdminData();
    } catch (err) {
      showToast('Verification query failed');
    }
  };

  // If Not Authenticated, show Login Form
  if (!authToken) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 text-left">
        <div className="max-w-md w-full p-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl text-slate-100 space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <img src={navLogo} alt="Skyrovix" className="h-10 w-auto object-contain brightness-0 invert mb-2" />
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-extrabold text-white">Skyrovix Administration Portal</h2>
            <p className="text-xs text-slate-400">Strict authorization required. All admin actions are audit-logged.</p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1">Master Password</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold transition shadow-lg text-xs"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <div className="text-center pt-2">
            <button
              onClick={onLogout}
              className="text-xs font-semibold text-slate-500 hover:text-slate-300"
            >
              ← Return to Skyrovix Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Admin Sidebar Menu items (Section 16)
  const adminMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'workflow', label: 'Internship Workflow', icon: GitMerge },
    { id: 'users', label: 'Users', icon: Users, count: usersList.length },
    { id: 'applications', label: 'Applications', icon: FileText, count: applicationsList.length },
    { id: 'internships', label: 'Internships', icon: Briefcase },
    { id: 'tasks', label: 'Tasks & Reviews', icon: CheckSquare, count: submissionsList.length },
    { id: 'certificates', label: 'Certificates', icon: Award, count: certificatesList.length },
    { id: 'offer-letters', label: 'Offer Letters', icon: FileCheck2, count: offerLettersList.length },
    { id: 'payments', label: 'Payments', icon: CreditCard, count: paymentsList.length },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'support', label: 'Support Tickets', icon: HelpCircle, count: supportTicketsList.filter(t => t.status !== 'Resolved').length },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings & Audit', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 flex font-sans antialiased text-left">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================
          1. ADMIN SIDEBAR NAVIGATION
      ======================================================== */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside className={`
        fixed lg:sticky top-0 h-screen w-64 bg-slate-900 text-slate-200 border-r border-slate-800 z-50 flex flex-col justify-between transition-transform duration-200 shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={navLogo} alt="Skyrovix" className="h-8 w-auto object-contain brightness-0 invert" />
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30">
              ADMIN
            </span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Links list */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
            Control Center
          </div>

          {adminMenuItems.map(item => {
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
                    ? 'bg-sky-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'}
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-sky-700' : 'bg-slate-800 text-slate-400'}`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Admin Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0">
              A
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Super Administrator</div>
              <div className="text-[10px] text-slate-400 truncate">admin@skyrovix.com</div>
            </div>
          </div>

          <button
            onClick={handleAdminLogout}
            className="w-full py-2 px-3 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ========================================================
          2. ADMIN MAIN CONTENT AREA
      ======================================================== */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Admin Workspace</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-900 capitalize">
                {activeView.replace('-', ' ')}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchAllAdminData}
              className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => window.open(`/api/admin/export-csv?token=${authToken}`, '_blank')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full">
          
          {/* ========================================================
              VIEW 1: ADMIN HOME / DASHBOARD (SECTION 17)
          ======================================================== */}
          {activeView === 'dashboard' && (
            <div className="space-y-7">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Platform Analytics &amp; Key Metrics</h2>
                <p className="text-xs text-slate-500 mt-0.5">Real-time statistics synchronized directly with the SQLite production database</p>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Total Users</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats?.total_applicants || usersList.length}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Registered Students</div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Confirmed Enrolled</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats?.paid_registrations || 0}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Payment Verified</div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Total Revenue</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">₹{stats?.total_collection || 0}.00</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">Cashfree Collected</div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Certificates Issued</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{certificatesList.length}</div>
                    <div className="text-[10px] text-purple-600 font-bold mt-0.5">Verified Credentials</div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Registration & Revenue Trend Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-sky-600" />
                      <span>Registration Volume (Recent)</span>
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400">Live Database Feed</span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {usersList.slice(0, 5).map(u => (
                      <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{u.full_name}</div>
                          <div className="text-[11px] text-slate-500">{u.email} • {u.college}</div>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                          {u.payment_status === 'PAID' ? 'PAID' : 'PENDING'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Recent Administrative Audit Logs</span>
                    </h3>
                    <button onClick={() => setActiveView('settings')} className="text-[10px] font-bold text-sky-600 hover:underline">View All</button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {auditLogsList.slice(0, 5).map(log => (
                      <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900">{log.action}</span>
                          <p className="text-[11px] text-slate-500 font-mono truncate max-w-xs">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {log.created_at ? new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================
              VIEW 2: USER MANAGEMENT (SECTION 18)
          ======================================================== */}
          {activeView === 'users' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">User Management ({usersList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Search, inspect student credentials, manage account status, and view deliverables</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by name, email, college..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent focus:outline-none w-44 text-xs"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Deactivated</option>
                    <option value="PAID">Paid Only</option>
                  </select>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">User / ID</th>
                        <th className="py-3.5 px-6">Contact</th>
                        <th className="py-3.5 px-6">College &amp; Dept</th>
                        <th className="py-3.5 px-6">Account Status</th>
                        <th className="py-3.5 px-6">Enrollment</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList
                        .filter(u => {
                          const matchesSearch = !searchQuery || 
                            u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.college?.toLowerCase().includes(searchQuery.toLowerCase());
                          
                          if (!matchesSearch) return false;
                          if (statusFilter === 'ACTIVE') return u.is_active !== 0;
                          if (statusFilter === 'INACTIVE') return u.is_active === 0;
                          if (statusFilter === 'PAID') return u.payment_status === 'PAID';
                          return true;
                        })
                        .map(u => (
                          <tr key={u.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="font-mono text-[10px] text-slate-400">{u.id}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-slate-800">{u.email}</div>
                              <div className="text-[11px] text-slate-500">{u.mobile}</div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-slate-800 font-semibold">{u.college || 'Engineering'}</div>
                              <div className="text-[11px] text-slate-500">{u.department || 'Full Stack Development'} • {u.year_of_study || '3rd Year'}</div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${u.is_active !== 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                {u.is_active !== 0 ? 'Active' : 'Deactivated'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${u.payment_status === 'PAID' ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'}`}>
                                {u.payment_status === 'PAID' ? 'PAID / CONFIRMED' : 'APPLICATION STARTED'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-2">
                              <button
                                onClick={async () => {
                                  const res = await fetch(`/api/admin/users/${u.id}`, { headers: { Authorization: `Bearer ${authToken}` } });
                                  const d = await res.json();
                                  setSelectedUserDetail(d);
                                }}
                                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                              >
                                View
                              </button>

                              <button
                                onClick={() => handleToggleUserStatus(u)}
                                className={`px-3 py-1 font-bold rounded-lg transition ${u.is_active !== 0 ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'}`}
                              >
                                {u.is_active !== 0 ? 'Deactivate' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 3: APPLICATION MANAGEMENT (SECTION 19)
          ======================================================== */}
          {activeView === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Application Management ({applicationsList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Review submissions, approve student admission, update stage workflows, and log audits</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">App ID</th>
                        <th className="py-3.5 px-6">Applicant Name</th>
                        <th className="py-3.5 px-6">Email &amp; Mobile</th>
                        <th className="py-3.5 px-6">Payment</th>
                        <th className="py-3.5 px-6">Registration Stage</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applicationsList.map(app => (
                        <tr key={app.application_id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-mono font-bold text-sky-700">
                            {app.application_id}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {app.full_name}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            <div>{app.email}</div>
                            <div className="text-[11px] text-slate-400">{app.mobile}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-100 text-emerald-800">
                              ₹{app.amount || 200} PAID
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-800">
                              {app.registration_status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-1.5">
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.application_id, 'CONFIRMED')}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleUpdateApplicationStatus(app.application_id, 'REJECTED')}
                              className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-xs"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 4: INTERNSHIP MANAGEMENT (SECTION 20)
          ======================================================== */}
          {activeView === 'internships' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Internship Programs &amp; Batches</h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage batch durations, curricula, announcements, and starter kit parameters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {internshipsList.map(batch => (
                  <div key={batch.id} className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <div>
                        <span className="text-[10px] font-extrabold text-sky-600 uppercase tracking-wider">{batch.id}</span>
                        <h3 className="text-base font-extrabold text-slate-900">{batch.title}</h3>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        ACTIVE
                      </span>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span>Curriculum Domain:</span>
                        <strong className="text-slate-900">{batch.domain}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration Mode:</span>
                        <strong className="text-slate-900">{batch.duration}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Tasks Count:</span>
                        <strong className="text-slate-900">{batch.task_count} Tasks</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Registration Fee:</span>
                        <strong className="text-emerald-700">₹{batch.registration_fee || 200} INR</strong>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <span className="font-bold text-slate-700 block mb-1">Public Announcement Notice:</span>
                      <p className="text-slate-500 text-[11px] leading-relaxed">{batch.start_notice}</p>
                    </div>

                    <button
                      onClick={() => setActiveView('settings')}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
                    >
                      Edit Program Settings
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW: 3-STAGE INTERNSHIP WORKFLOW MANAGEMENT
          ======================================================== */}
          {activeView === 'workflow' && (
            <AdminWorkflowManagement 
              authToken={authToken} 
              onShowToast={showToast} 
            />
          )}

          {/* ========================================================
              VIEW 5: TASK MANAGEMENT & REVIEWS (SECTION 21)
          ======================================================== */}
          {activeView === 'tasks' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Task Management &amp; Mentor Code Evaluations</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Review public GitHub code repositories, grade implementations, and provide remarks</p>
                </div>
              </div>

              {/* Submissions Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-700">
                  Student Deliverables Submitted for Review ({submissionsList.length})
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Task Title</th>
                        <th className="py-3.5 px-6">Student Name</th>
                        <th className="py-3.5 px-6">GitHub Link</th>
                        <th className="py-3.5 px-6">Live URL</th>
                        <th className="py-3.5 px-6">Review Status</th>
                        <th className="py-3.5 px-6">Grade</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissionsList.length === 0 ? (
                        <tr><td colSpan={7} className="text-center py-6 text-slate-400">No student submissions recorded yet.</td></tr>
                      ) : (
                        submissionsList.map(sub => (
                          <tr key={sub.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-6 font-bold text-slate-900">
                              {sub.project_title}
                            </td>
                            <td className="py-4 px-6">
                              <div className="font-semibold text-slate-800">{sub.student_name}</div>
                              <div className="text-[10px] text-slate-400">{sub.student_email}</div>
                            </td>
                            <td className="py-4 px-6">
                              <a
                                href={sub.github_repo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sky-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                              >
                                <span>Repo</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                            <td className="py-4 px-6">
                              {sub.live_deployment_url ? (
                                <a
                                  href={sub.live_deployment_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:underline flex items-center gap-1 font-mono text-[11px]"
                                >
                                  <span>Live</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                sub.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {sub.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-bold font-mono">
                              {sub.grade || '—'}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => {
                                  setSelectedSubmissionToReview(sub);
                                  setReviewForm({
                                    status: sub.status || 'APPROVED',
                                    feedback: sub.feedback || 'Outstanding architecture and clean modular components.',
                                    grade: sub.grade || 'A+'
                                  });
                                }}
                                className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition"
                              >
                                Evaluate
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
              VIEW 6: CERTIFICATE MANAGEMENT (SECTION 22)
          ======================================================== */}
          {activeView === 'certificates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Certificate Management ({certificatesList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Issue cryptographic verifiable certificates with auto-generated unique identifiers</p>
                </div>

                <button
                  onClick={() => setShowGenerateCertModal(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue New Certificate</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Certificate ID</th>
                        <th className="py-3.5 px-6">Recipient Name</th>
                        <th className="py-3.5 px-6">Program / Batch</th>
                        <th className="py-3.5 px-6">Issue Date</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {certificatesList.map(cert => (
                        <tr key={cert.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-mono font-bold text-purple-700">
                            {cert.id}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {cert.student_name}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {cert.program} • {cert.batch}
                          </td>
                          <td className="py-4 px-6 font-mono text-slate-500">
                            {cert.issue_date}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              cert.status === 'ISSUED' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {cert.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            <a
                              href={`/verify/${cert.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition inline-flex items-center gap-1"
                            >
                              <span>Verify</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                            {cert.status === 'ISSUED' && (
                              <button
                                onClick={() => handleRevokeCertificate(cert.id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg transition"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 7: OFFER LETTER MANAGEMENT (SECTION 23)
          ======================================================== */}
          {activeView === 'offer-letters' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Offer Letter Management ({offerLettersList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Generate appointment letters, track unique verification codes, and manage active status</p>
                </div>

                <button
                  onClick={() => setShowGenerateOLModal(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Issue Offer Letter</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Verification Code</th>
                        <th className="py-3.5 px-6">Student Name</th>
                        <th className="py-3.5 px-6">Track / Domain</th>
                        <th className="py-3.5 px-6">Issue Date</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {offerLettersList.map(ol => (
                        <tr key={ol.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-mono font-bold text-sky-700">
                            {ol.verification_code}
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            {ol.student_name}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {ol.domain} ({ol.duration})
                          </td>
                          <td className="py-4 px-6 font-mono text-slate-500">
                            {ol.issue_date}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              ol.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}>
                              {ol.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right space-x-2">
                            {ol.status === 'ACTIVE' && (
                              <button
                                onClick={() => handleRevokeOfferLetter(ol.id)}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg transition"
                              >
                                Revoke
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 8: PAYMENT MANAGEMENT (SECTION 24)
          ======================================================== */}
          {activeView === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Payment Management ({paymentsList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time payment logs, Cashfree PG settlement IDs, and manual verification triggers</p>
                </div>

                <button
                  onClick={() => window.open(`/api/admin/export-csv?token=${authToken}`, '_blank')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Ledger CSV</span>
                </button>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Cashfree Order ID</th>
                        <th className="py-3.5 px-6">Student Name &amp; Email</th>
                        <th className="py-3.5 px-6">Amount</th>
                        <th className="py-3.5 px-6">Payment Method</th>
                        <th className="py-3.5 px-6">PG Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentsList.map(pay => (
                        <tr key={pay.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-mono font-bold text-slate-900">
                            {pay.order_id}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900">{pay.student_name}</div>
                            <div className="text-[10px] text-slate-400">{pay.student_email}</div>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            ₹{pay.amount || 200}.00 {pay.currency || 'INR'}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {pay.payment_method || 'Online PG'}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              pay.status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {pay.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => handleManualVerifyOrder(pay.order_id)}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                            >
                              Check PG Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 9: ADMIN NOTIFICATIONS & BROADCAST (SECTION 26)
          ======================================================== */}
          {activeView === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Announcements &amp; Broadcast Management</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Send alerts, system updates, and personal notifications to enrolled students</p>
                </div>

                <button
                  onClick={() => setShowBroadcastModal(true)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Send Notification</span>
                </button>
              </div>

              {/* Sent announcements */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-900">Active Global Announcements</h3>
                {notificationsData.announcements.map(ann => (
                  <div key={ann.id} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{ann.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {ann.created_at ? new Date(ann.created_at).toLocaleDateString() : 'Active'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{ann.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 10: SUPPORT TICKETS MANAGEMENT (SECTION 25)
          ======================================================== */}
          {activeView === 'support' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Student Support &amp; Mentorship Desk ({supportTicketsList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Address student technical roadblocks, clarify guidelines, and resolve inquiries</p>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Ticket ID</th>
                        <th className="py-3.5 px-6">Student</th>
                        <th className="py-3.5 px-6">Subject</th>
                        <th className="py-3.5 px-6">Category</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {supportTicketsList.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6 font-mono font-bold text-sky-700">
                            {ticket.id}
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900">{ticket.user_name}</div>
                            <div className="text-[10px] text-slate-400">{ticket.user_email}</div>
                          </td>
                          <td className="py-4 px-6 font-semibold text-slate-800 max-w-xs truncate">
                            {ticket.subject}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            {ticket.category}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                              ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={async () => {
                                const res = await fetch(`/api/admin/support/${ticket.id}`, { headers: { Authorization: `Bearer ${authToken}` } });
                                const d = await res.json();
                                setSelectedTicketThread(d.ticket ? { ...d.ticket, replies: d.replies } : null);
                              }}
                              className="px-3 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg transition"
                            >
                              Open Thread
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 11: ANALYTICS (SECTION 17)
          ======================================================== */}
          {activeView === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Deep-Dive Analytics &amp; Reports</h2>
                <p className="text-xs text-slate-500 mt-0.5">Aggregated metrics on academic streams, skills distribution, and student progress</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Department Streams</h3>
                  <div className="space-y-2 pt-2">
                    {analyticsData?.departmentBreakdown?.map((d, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-xl">
                        <span className="font-semibold text-slate-700 uppercase">{d.department || 'General IT'}</span>
                        <strong className="text-slate-900">{d.count} Students</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Academic Year Breakdown</h3>
                  <div className="space-y-2 pt-2">
                    {analyticsData?.yearBreakdown?.map((y, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-xl">
                        <span className="font-semibold text-slate-700">{y.year_of_study || '3rd Year'}</span>
                        <strong className="text-slate-900">{y.count} Students</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Self-Reported Skill Levels</h3>
                  <div className="space-y-2 pt-2">
                    {analyticsData?.skillBreakdown?.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs p-2 bg-slate-50 rounded-xl">
                        <span className="font-semibold text-slate-700">{s.skill_level}</span>
                        <strong className="text-slate-900">{s.count} Students</strong>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              VIEW 12: SETTINGS & AUDIT LOGS (SECTION 34)
          ======================================================== */}
          {activeView === 'settings' && (
            <div className="space-y-8">
              
              {/* Portal Settings Form */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Settings className="w-5 h-5 text-sky-600" />
                  <h3 className="text-base font-bold text-slate-900">Portal &amp; Batch Configuration</h3>
                </div>

                <form onSubmit={handleSavePortalSettings} className="space-y-4 max-w-xl text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Official Batch 1 WhatsApp Group Invitation URL
                    </label>
                    <input
                      type="url"
                      required
                      value={whatsappUrlInput}
                      onChange={(e) => setWhatsappUrlInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Batch Start Public Announcement Notice
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={startNoticeInput}
                      onChange={(e) => setStartNoticeInput(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Registration Fee (INR)
                    </label>
                    <input
                      type="number"
                      required
                      value={regFeeInput}
                      onChange={(e) => setRegFeeInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Portal Settings</span>
                  </button>
                </form>
              </div>

              {/* Complete Audit Logs Table (Section 34) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Administrative Audit Trails</h3>
                    <p className="text-xs text-slate-500">Immutable ledger tracking security operations, approvals, revocations, and configuration changes</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">
                    Total Events: {auditLogsList.length}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Timestamp</th>
                        <th className="py-3.5 px-6">Admin</th>
                        <th className="py-3.5 px-6">Action</th>
                        <th className="py-3.5 px-6">Target</th>
                        <th className="py-3.5 px-6">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {auditLogsList.map(log => (
                        <tr key={log.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-6 font-mono text-slate-500 text-[11px]">
                            {log.created_at ? new Date(log.created_at).toLocaleString() : 'Recent'}
                          </td>
                          <td className="py-3.5 px-6 font-bold text-slate-900">
                            {log.admin_name}
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-sky-100 text-sky-800">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-3.5 px-6 text-slate-600">
                            {log.target_type}: {log.target_id || '—'}
                          </td>
                          <td className="py-3.5 px-6 font-mono text-slate-500 text-[11px] max-w-sm truncate">
                            {log.details}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* ========================================================
          MODAL: USER DETAIL MODAL
      ======================================================== */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-5 text-left text-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-sky-600">Student Profile &amp; History</span>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedUserDetail.user.full_name}</h3>
              </div>
              <button onClick={() => setSelectedUserDetail(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl text-xs">
              <div>Email: <strong>{selectedUserDetail.user.email}</strong></div>
              <div>Mobile: <strong>{selectedUserDetail.user.mobile}</strong></div>
              <div>College: <strong>{selectedUserDetail.user.college}</strong></div>
              <div>Department: <strong>{selectedUserDetail.user.department}</strong></div>
              <div>City: <strong>{selectedUserDetail.user.city}</strong></div>
              <div>Skill Level: <strong>{selectedUserDetail.user.skill_level}</strong></div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Bio:</h4>
              <p className="p-3 bg-slate-50 rounded-xl text-slate-600 leading-relaxed">{selectedUserDetail.user.bio || 'No bio provided'}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900">Offer Letters &amp; Certificates:</h4>
              <div className="flex gap-2">
                <span className="p-2 bg-sky-50 text-sky-800 rounded-lg font-mono">
                  Offer Letters: {selectedUserDetail.offerLetters?.length || 0}
                </span>
                <span className="p-2 bg-emerald-50 text-emerald-800 rounded-lg font-mono">
                  Certificates: {selectedUserDetail.certificates?.length || 0}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedUserDetail(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: REVIEW SUBMISSION MODAL
      ======================================================== */}
      {selectedSubmissionToReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-left text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Evaluate Student Submission</h3>
              <button onClick={() => setSelectedSubmissionToReview(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div>Task: <strong className="text-slate-900">{selectedSubmissionToReview.project_title}</strong></div>
              <div>Student: <strong className="text-slate-900">{selectedSubmissionToReview.student_name}</strong></div>
              <div className="pt-1 flex gap-3">
                <a href={selectedSubmissionToReview.github_repo_url} target="_blank" rel="noopener noreferrer" className="text-sky-600 font-bold hover:underline flex items-center gap-1">
                  <span>Open GitHub Repo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                {selectedSubmissionToReview.live_deployment_url && (
                  <a href={selectedSubmissionToReview.live_deployment_url} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
                    <span>Open Live URL</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Evaluation Decision</label>
                <select
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="APPROVED">Approve (Passed)</option>
                  <option value="REVISION_REQUIRED">Revision Required</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Award Grade</label>
                <select
                  value={reviewForm.grade}
                  onChange={(e) => setReviewForm({ ...reviewForm, grade: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
                >
                  <option value="A+">Grade A+ (Exemplary)</option>
                  <option value="A">Grade A (Proficient)</option>
                  <option value="B+">Grade B+ (Good)</option>
                  <option value="B">Grade B (Satisfactory)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Mentor Remarks &amp; Feedback</label>
                <textarea
                  rows={3}
                  required
                  value={reviewForm.feedback}
                  onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Submit Evaluation
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSubmissionToReview(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ISSUE CERTIFICATE MODAL
      ======================================================== */}
      {showGenerateCertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-left text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Issue New Certificate</h3>
              <button onClick={() => setShowGenerateCertModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleGenerateCertificate} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={newCertForm.student_id}
                  onChange={(e) => setNewCertForm({ ...newCertForm, student_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  value={newCertForm.program}
                  onChange={(e) => setNewCertForm({ ...newCertForm, program: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  required
                  value={newCertForm.duration}
                  onChange={(e) => setNewCertForm({ ...newCertForm, duration: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Generate &amp; Issue
                </button>
                <button
                  type="button"
                  onClick={() => setShowGenerateCertModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: ISSUE OFFER LETTER MODAL
      ======================================================== */}
      {showGenerateOLModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-left text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Issue Offer Letter</h3>
              <button onClick={() => setShowGenerateOLModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleGenerateOfferLetter} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  required
                  value={newOLForm.student_id}
                  onChange={(e) => setNewOLForm({ ...newOLForm, student_id: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="">-- Choose Student --</option>
                  {usersList.map(u => (
                    <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Track / Domain</label>
                <input
                  type="text"
                  required
                  value={newOLForm.domain}
                  onChange={(e) => setNewOLForm({ ...newOLForm, domain: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Duration</label>
                <input
                  type="text"
                  required
                  value={newOLForm.duration}
                  onChange={(e) => setNewOLForm({ ...newOLForm, duration: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Issue Offer Letter
                </button>
                <button
                  type="button"
                  onClick={() => setShowGenerateOLModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: BROADCAST ANNOUNCEMENT MODAL
      ======================================================== */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-4 text-left text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Broadcast Notification</h3>
              <button onClick={() => setShowBroadcastModal(false)} className="text-slate-400 font-bold">✕</button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
                <select
                  value={broadcastForm.targetAudience}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, targetAudience: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="ALL">All Enrolled Students (Global Announcement)</option>
                  <option value="INDIVIDUAL">Specific Student</option>
                </select>
              </div>

              {broadcastForm.targetAudience === 'INDIVIDUAL' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                  <select
                    required
                    value={broadcastForm.userId}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, userId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="">-- Choose Student --</option>
                    {usersList.map(u => (
                      <option key={u.id} value={u.id}>{u.full_name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="Notification Headline..."
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Message Body</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Type the announcement message..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm"
                >
                  Broadcast
                </button>
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: SUPPORT TICKET THREAD & REPLY
      ======================================================== */}
      {selectedTicketThread && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 text-left text-slate-800">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-sky-600">{selectedTicketThread.id} • {selectedTicketThread.category}</span>
                <h3 className="text-base font-bold text-slate-900">{selectedTicketThread.subject}</h3>
              </div>
              <button onClick={() => setSelectedTicketThread(null)} className="text-slate-400 font-bold">✕</button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-900 block mb-1">Student Question:</span>
              <p className="text-slate-700 leading-relaxed">{selectedTicketThread.message}</p>
            </div>

            {/* Conversation Replies */}
            {selectedTicketThread.replies && selectedTicketThread.replies.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-xs text-slate-900">Conversation History:</h4>
                {selectedTicketThread.replies.map(rep => (
                  <div
                    key={rep.id}
                    className={`p-3 rounded-xl text-xs space-y-0.5 ${
                      rep.sender_role === 'ADMIN' ? 'bg-sky-50 border border-sky-100 ml-4' : 'bg-slate-50 border border-slate-100 mr-4'
                    }`}
                  >
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{rep.sender_name} ({rep.sender_role})</span>
                      <span className="text-[10px] text-slate-400">
                        {rep.created_at ? new Date(rep.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Today'}
                      </span>
                    </div>
                    <p className="text-slate-700">{rep.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Admin Reply Form */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Update Ticket Status</label>
                <select
                  value={ticketStatusUpdate}
                  onChange={(e) => setTicketStatusUpdate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Waiting for User">Waiting for User</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Your Response to Student</label>
                <textarea
                  rows={3}
                  placeholder="Type official mentor board response..."
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSendAdminReply(selectedTicketThread.id)}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Response</span>
                </button>
                <button
                  onClick={() => setSelectedTicketThread(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
