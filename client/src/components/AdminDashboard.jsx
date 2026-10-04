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
  GitMerge,
  Database,
  Cloud,
  UploadCloud,
  DownloadCloud,
  Lock,
  Edit3,
  DollarSign,
  Activity,
  Sparkles,
  Copy,
  Sliders,
  Trash2
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

  // Production Control States
  const [showManualPayModal, setShowManualPayModal] = useState(false);
  const [manualPayTarget, setManualPayTarget] = useState(null);
  const [manualPayForm, setManualPayForm] = useState({
    amount: '200',
    paymentMethod: 'MANUAL_CASH_UPI',
    notes: 'Verified offline payment / Admin manual override',
    sendNotification: true
  });
  const [manualPayLoading, setManualPayLoading] = useState(false);

  const [showResetPassModal, setShowResetPassModal] = useState(false);
  const [resetPassTarget, setResetPassTarget] = useState(null);
  const [resetPassInput, setResetPassInput] = useState('');
  const [resetPassLoading, setResetPassLoading] = useState(false);

  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [editStudentForm, setEditStudentForm] = useState({
    id: '',
    full_name: '',
    mobile: '',
    college: '',
    department: '',
    degree: '',
    year_of_study: '',
    city: '',
    state: '',
    skill_level: 'Intermediate',
    github_profile: '',
    linkedin_profile: '',
    is_active: 1
  });
  const [editStudentLoading, setEditStudentLoading] = useState(false);

  // Cloud Sync state
  const [cloudSyncLoading, setCloudSyncLoading] = useState(false);
  const [cloudSyncStats, setCloudSyncStats] = useState(null);

  // Admin Change Password state
  const [adminPasswordForm, setAdminPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [adminPasswordLoading, setAdminPasswordLoading] = useState(false);
  const [adminPasswordStatus, setAdminPasswordStatus] = useState(null);

  // Cashfree Live Query Tool
  const [cashfreeQueryInput, setCashfreeQueryInput] = useState('');
  const [cashfreeQueryResult, setCashfreeQueryResult] = useState(null);
  const [cashfreeQueryLoading, setCashfreeQueryLoading] = useState(false);

  // Copy Feedback state
  const [copiedKey, setCopiedKey] = useState('');

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

  // Restore Certificate
  const handleRestoreCertificate = async (certId) => {
    try {
      const res = await fetch(`/api/admin/certificates/${certId}/restore`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Certificate restored to VALID status');
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to restore certificate');
      }
    } catch (e) {
      showToast('Error restoring certificate');
    }
  };

  // Resend Certificate Email
  const handleResendCertEmail = async (certId) => {
    showToast(`Sending certificate email for ${certId}...`);
    try {
      const res = await fetch(`/api/admin/certificates/${certId}/resend-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Certificate email resent successfully!');
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to resend email');
      }
    } catch (e) {
      showToast('Error resending certificate email');
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

  // Restore Offer Letter
  const handleRestoreOfferLetter = async (olId) => {
    try {
      const res = await fetch(`/api/admin/offer-letters/${olId}/restore`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Offer letter restored to ACTIVE status');
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to restore offer letter');
      }
    } catch (e) {
      showToast('Error restoring offer letter');
    }
  };

  // Resend Offer Letter Email
  const handleResendOLEmail = async (olId) => {
    showToast(`Sending offer letter email for ${olId}...`);
    try {
      const res = await fetch(`/api/admin/offer-letters/${olId}/resend-email`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Offer letter email resent successfully!');
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to resend email');
      }
    } catch (e) {
      showToast('Error resending offer letter email');
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

  // Helper: Copy to Clipboard
  const copyToClipboard = (text, key) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2500);
    showToast('Copied to clipboard!');
  };

  // Manual Payment Override Handlers
  const handleOpenManualPayment = (student) => {
    setManualPayTarget(student);
    setManualPayForm({
      amount: portalSettings.REGISTRATION_FEE || '200',
      paymentMethod: 'MANUAL_CASH_UPI',
      notes: `Direct administrative confirmation for ${student.full_name}`,
      sendNotification: true
    });
    setShowManualPayModal(true);
  };

  const handleSubmitManualPayment = async (e) => {
    e.preventDefault();
    if (!manualPayTarget) return;
    setManualPayLoading(true);

    try {
      const res = await fetch(`/api/admin/students/${manualPayTarget.id}/manual-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(manualPayForm)
      });
      const data = await res.json();
      setManualPayLoading(false);

      if (res.ok) {
        showToast(`Payment confirmed! ${manualPayTarget.full_name} is now enrolled with offer letter.`);
        setShowManualPayModal(false);
        setManualPayTarget(null);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to record manual payment');
      }
    } catch (err) {
      setManualPayLoading(false);
      showToast('Network error processing payment override');
    }
  };

  // Student Password Reset Handlers
  const handleOpenResetPassword = (student) => {
    setResetPassTarget(student);
    setResetPassInput('');
    setShowResetPassModal(true);
  };

  const handleGenerateRandomPass = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let p = '';
    for (let i = 0; i < 10; i++) {
      p += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setResetPassInput(p);
  };

  const handleSubmitResetPassword = async (e) => {
    e.preventDefault();
    if (!resetPassTarget || !resetPassInput) return;
    if (resetPassInput.length < 6) {
      showToast('Password must be at least 6 characters');
      return;
    }
    setResetPassLoading(true);

    try {
      const res = await fetch(`/api/admin/students/${resetPassTarget.id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ newPassword: resetPassInput })
      });
      const data = await res.json();
      setResetPassLoading(false);

      if (res.ok) {
        showToast(`Password successfully reset for ${resetPassTarget.full_name}`);
        setShowResetPassModal(false);
        setResetPassTarget(null);
        setResetPassInput('');
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setResetPassLoading(false);
      showToast('Network error resetting student password');
    }
  };

  // Student Profile Edit Handlers
  const handleOpenEditStudent = (student) => {
    setEditStudentForm({
      id: student.id,
      full_name: student.full_name || '',
      mobile: student.mobile || '',
      college: student.college || '',
      department: student.department || '',
      degree: student.degree || '',
      year_of_study: student.year_of_study || '',
      city: student.city || '',
      state: student.state || '',
      skill_level: student.skill_level || 'Intermediate',
      github_profile: student.github_profile || '',
      linkedin_profile: student.linkedin_profile || '',
      is_active: student.is_active !== undefined ? student.is_active : 1
    });
    setShowEditStudentModal(true);
  };

  const handleSubmitEditStudent = async (e) => {
    e.preventDefault();
    if (!editStudentForm.id) return;
    setEditStudentLoading(true);

    try {
      const res = await fetch(`/api/admin/students/${editStudentForm.id}/details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify(editStudentForm)
      });
      const data = await res.json();
      setEditStudentLoading(false);

      if (res.ok) {
        showToast('Student profile details updated successfully!');
        setShowEditStudentModal(false);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to update details');
      }
    } catch (err) {
      setEditStudentLoading(false);
      showToast('Network error updating student details');
    }
  };

  // Supabase Cloud Synchronisation Handlers
  const handleTriggerSupabasePush = async () => {
    if (!window.confirm('Force-push all local SQLite records (students, payments, certificates, offer letters, system settings) to Supabase Cloud?')) return;
    setCloudSyncLoading(true);

    try {
      const res = await fetch('/api/admin/sync/supabase-push', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      setCloudSyncLoading(false);

      if (res.ok) {
        setCloudSyncStats(data.synced);
        showToast(`Cloud Sync Complete: Synced ${data.synced?.students || 0} students, ${data.synced?.registrations || 0} registrations, and records to Supabase.`);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Supabase push failed');
      }
    } catch (err) {
      setCloudSyncLoading(false);
      showToast('Network error during Supabase sync');
    }
  };

  const handleTriggerSupabasePull = async () => {
    if (!window.confirm('Pull latest student records from Supabase Cloud into local database? Existing matching records will be preserved.')) return;
    setCloudSyncLoading(true);

    try {
      const res = await fetch('/api/admin/sync/supabase-pull', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      setCloudSyncLoading(false);

      if (res.ok) {
        showToast(`Cloud Pull Complete: Loaded ${data.pulled?.students || 0} students and ${data.pulled?.registrations || 0} registrations.`);
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Supabase pull failed');
      }
    } catch (err) {
      setCloudSyncLoading(false);
      showToast('Network error pulling from Supabase');
    }
  };

  // Master Admin Password Change Handler
  const handleChangeAdminPassword = async (e) => {
    e.preventDefault();
    if (adminPasswordForm.newPassword !== adminPasswordForm.confirmPassword) {
      showToast('New passwords do not match');
      return;
    }
    if (adminPasswordForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters');
      return;
    }
    setAdminPasswordLoading(true);
    setAdminPasswordStatus(null);

    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          currentPassword: adminPasswordForm.currentPassword,
          newPassword: adminPasswordForm.newPassword
        })
      });
      const data = await res.json();
      setAdminPasswordLoading(false);

      if (res.ok) {
        setAdminPasswordStatus({ success: true, message: data.message });
        setAdminPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        showToast('Admin master password successfully changed!');
      } else {
        setAdminPasswordStatus({ success: false, message: data.error || 'Failed to change password' });
        showToast(data.error || 'Failed to change password');
      }
    } catch (err) {
      setAdminPasswordLoading(false);
      setAdminPasswordStatus({ success: false, message: 'Server communication error' });
    }
  };

  // Cashfree Live PG Query Handler
  const handleQueryCashfreeLive = async (e, directId) => {
    if (e && e.preventDefault) e.preventDefault();
    const orderIdToLookup = (directId || cashfreeQueryInput || '').trim();
    if (!orderIdToLookup) {
      showToast('Please enter a Cashfree Order ID');
      return;
    }
    setCashfreeQueryLoading(true);
    setCashfreeQueryResult(null);

    try {
      const res = await fetch(`/api/admin/verify-order/${orderIdToLookup}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      setCashfreeQueryLoading(false);
      setCashfreeQueryResult(data);
      showToast(`Gateway query completed: ${data.verification?.payment_status || data.error || 'Done'}`);
      fetchAllAdminData();
    } catch (err) {
      setCashfreeQueryLoading(false);
      showToast('Error querying Cashfree Gateway');
    }
  };

  // Export Ledger and Database Handlers
  const handleExportPaymentsCsv = () => {
    window.open(`/api/admin/export-payments-csv?token=${authToken}`, '_blank');
  };

  const handleExportBackupJson = () => {
    window.open(`/api/admin/export-backup-json?token=${authToken}`, '_blank');
  };

  // Delete Student Account Permanently (Admin)
  const handleDeleteUser = async (user) => {
    const targetId = user?.id || user?.student_id || user?.user_id;
    if (!targetId && !user?.email) return;

    const identifier = targetId || user.email;
    const displayName = user?.full_name || user?.name || user?.email || 'this student';
    const displayEmail = user?.email ? ` (${user.email})` : '';

    const confirmMessage = `WARNING: Are you sure you want to permanently delete the account for "${displayName}"${displayEmail}?\n\nThis will permanently remove:\n• Student profile and dashboard login\n• Internship applications and registrations\n• Project task submissions\n• Issued offer letters and certificates\n• Support tickets and notifications\n\nThis action cannot be undone. Proceed with permanent deletion?`;
    
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(identifier)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();

      if (res.ok) {
        showToast(data.message || `Account for ${displayName} deleted.`);
        if (selectedUserDetail?.user?.id === targetId || selectedUserDetail?.user?.email === user.email) {
          setSelectedUserDetail(null);
        }
        if (showEditStudentModal && editStudentForm?.id === targetId) {
          setShowEditStudentModal(false);
        }
        fetchAllAdminData();
      } else {
        showToast(data.error || 'Failed to delete user account');
      }
    } catch (err) {
      showToast('Network error deleting user account');
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
              <span className="text-xs font-semibold text-slate-400">Admin Control</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-bold text-slate-900 capitalize">
                {activeView.replace('-', ' ')}
              </span>
            </div>

            {/* Live Gateway & Cloud Badges */}
            <div className="hidden sm:flex items-center gap-2 ml-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>PG: LIVE PROD</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                <Cloud className="w-3 h-3 text-sky-500" />
                <span>SUPABASE READY</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleTriggerSupabasePush}
              disabled={cloudSyncLoading}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-xs font-bold transition disabled:opacity-50"
              title="Force push local database to Supabase Cloud"
            >
              <UploadCloud className={`w-3.5 h-3.5 ${cloudSyncLoading ? 'animate-bounce' : ''}`} />
              <span>{cloudSyncLoading ? 'Syncing...' : 'Sync Cloud'}</span>
            </button>

            <button
              onClick={handleExportBackupJson}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
              title="Download entire database state as JSON backup"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Backup JSON</span>
            </button>

            <button
              onClick={handleExportPaymentsCsv}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              title="Export all transactions ledger"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={fetchAllAdminData}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              title="Refresh All Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin text-sky-600' : ''}`} />
            </button>
          </div>
        </header>

        {/* Main Body */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-7 max-w-7xl mx-auto w-full">
          
          {/* ========================================================
              VIEW 1: ADMIN HOME / DASHBOARD (PRODUCTION READY)
          ======================================================== */}
          {activeView === 'dashboard' && (
            <div className="space-y-7">
              {/* Header Title & System Health Ribbon */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Platform Command Center</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time statistics synchronized with SQLite production database &amp; Supabase Cloud</p>
                </div>

                {/* Health strip */}
                <div className="flex flex-wrap items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200/80 shadow-2xs text-xs">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="font-bold text-slate-700">Cashfree PG:</span>
                    <span className="font-extrabold text-emerald-700">Active</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50">
                    <Database className="w-3.5 h-3.5 text-sky-600" />
                    <span className="font-bold text-slate-700">Cloud Sync:</span>
                    <span className="font-extrabold text-sky-700">Supabase</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-bold text-slate-700">WhatsApp:</span>
                    <button
                      onClick={() => copyToClipboard(portalSettings.BATCH_1_WHATSAPP_URL || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP', 'wa_top')}
                      className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <span>{copiedKey === 'wa_top' ? 'Copied!' : 'Copy Link'}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Key Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Total Applicants</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats?.total_applicants || usersList.length}</div>
                    <div className="text-[10px] text-sky-600 font-bold mt-0.5">Registered Students</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Confirmed Enrolled</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{stats?.paid_registrations || 0}</div>
                    <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Paid &amp; Active</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Total Gross Revenue</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">₹{stats?.total_collection || 0}.00</div>
                    <div className="text-[10px] text-amber-600 font-bold mt-0.5">Cashfree + Manual</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-slate-500">Credentials Issued</div>
                    <div className="text-2xl font-black text-slate-900 mt-1">{certificatesList.length}</div>
                    <div className="text-[10px] text-purple-600 font-bold mt-0.5">{offerLettersList.length} Offer Letters</div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Functional Controls Quick Action Panel */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Administrative Functional Controls</h3>
                      <p className="text-[11px] text-slate-400">Direct operational overrides and production maintenance tools</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800 text-sky-400 border border-slate-700 font-bold">
                    SuperAdmin Access
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-1">
                  <button
                    onClick={() => {
                      const firstUnpaid = usersList.find(u => u.payment_status !== 'PAID') || usersList[0];
                      if (firstUnpaid) {
                        handleOpenManualPayment(firstUnpaid);
                      } else {
                        showToast('All registered students are already marked paid!');
                      }
                    }}
                    className="p-3.5 bg-slate-800/90 hover:bg-emerald-600/30 border border-slate-700 hover:border-emerald-500/50 rounded-2xl text-left transition group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <DollarSign className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Manual Pay</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Confirm &amp; Enroll</div>
                  </button>

                  <button
                    onClick={handleTriggerSupabasePush}
                    disabled={cloudSyncLoading}
                    className="p-3.5 bg-slate-800/90 hover:bg-sky-600/30 border border-slate-700 hover:border-sky-500/50 rounded-2xl text-left transition group disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <UploadCloud className={`w-4 h-4 ${cloudSyncLoading ? 'animate-bounce' : ''}`} />
                    </div>
                    <div className="font-bold text-xs text-white">Cloud Push</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Sync to Supabase</div>
                  </button>

                  <button
                    onClick={handleTriggerSupabasePull}
                    disabled={cloudSyncLoading}
                    className="p-3.5 bg-slate-800/90 hover:bg-indigo-600/30 border border-slate-700 hover:border-indigo-500/50 rounded-2xl text-left transition group disabled:opacity-50"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <DownloadCloud className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Cloud Pull</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Fetch Cloud State</div>
                  </button>

                  <button
                    onClick={() => setShowGenerateOLModal(true)}
                    className="p-3.5 bg-slate-800/90 hover:bg-amber-600/30 border border-slate-700 hover:border-amber-500/50 rounded-2xl text-left transition group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Issue Offer</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Generate Letter</div>
                  </button>

                  <button
                    onClick={() => setShowGenerateCertModal(true)}
                    className="p-3.5 bg-slate-800/90 hover:bg-purple-600/30 border border-slate-700 hover:border-purple-500/50 rounded-2xl text-left transition group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Issue Certificate</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Generate Credential</div>
                  </button>

                  <button
                    onClick={() => setShowBroadcastModal(true)}
                    className="p-3.5 bg-slate-800/90 hover:bg-rose-600/30 border border-slate-700 hover:border-rose-500/50 rounded-2xl text-left transition group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="font-bold text-xs text-white">Broadcast</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Send Global Notice</div>
                  </button>
                </div>
              </div>

              {/* Conversion Pipeline & Financial KPI Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Admissions Conversion</span>
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {usersList.length > 0 
                      ? `${(((stats?.paid_registrations || 0) / usersList.length) * 100).toFixed(1)}%` 
                      : '0%'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {stats?.paid_registrations || 0} enrolled of {usersList.length} total signups
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${usersList.length > 0 ? ((stats?.paid_registrations || 0) / usersList.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Payment Pipeline Status</span>
                    <CreditCard className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {usersList.filter(u => u.payment_status !== 'PAID').length}
                  </div>
                  <div className="text-[11px] text-amber-600 font-bold">
                    Pending / Unconfirmed Students
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Use Manual Pay Override to approve students who paid via direct UPI or cash.
                  </p>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Database &amp; Cloud Ledger</span>
                    <Database className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-2xl font-black text-slate-900">
                    {paymentsList.length} Transactions
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {auditLogsList.length} security audit events recorded
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={handleExportPaymentsCsv}
                      className="text-[11px] font-bold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Ledger CSV</span>
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      onClick={handleExportBackupJson}
                      className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1"
                    >
                      <Database className="w-3 h-3" />
                      <span>Full Backup</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Registration & Revenue Trend Visuals */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-sky-600" />
                      <span>Recent Student Registrations</span>
                    </h3>
                    <button onClick={() => setActiveView('users')} className="text-[10px] font-bold text-sky-600 hover:underline">
                      View All ({usersList.length})
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    {usersList.slice(0, 5).map(u => (
                      <div key={u.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="min-w-0 pr-3">
                          <div className="font-bold text-slate-900 truncate">{u.full_name}</div>
                          <div className="text-[11px] text-slate-500 truncate">{u.email} • {u.college || 'FSD Track'}</div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${u.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                            {u.payment_status === 'PAID' ? 'PAID' : 'PENDING'}
                          </span>
                          {u.payment_status !== 'PAID' && (
                            <button
                              onClick={() => handleOpenManualPayment(u)}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] transition"
                            >
                              Confirm
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Student Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>Recent Administrative Audit Trails</span>
                    </h3>
                    <button onClick={() => setActiveView('settings')} className="text-[10px] font-bold text-sky-600 hover:underline">View All</button>
                  </div>

                  <div className="space-y-2 pt-2">
                    {auditLogsList.slice(0, 5).map(log => (
                      <div key={log.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs flex items-start justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-sky-100 text-sky-800">
                              {log.action}
                            </span>
                            <span className="text-[10px] text-slate-400">by {log.admin_name}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 font-mono truncate max-w-xs">{log.details}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
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
                  <h2 className="text-xl font-extrabold text-slate-900">Student &amp; User Operations ({usersList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Search, manage student profiles, manual fee overrides, credential resets, and access state</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs">
                    <Search className="w-3.5 h-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search name, email, college..."
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
                    <option value="PAID">Paid Only</option>
                    <option value="UNPAID">Pending / Unpaid</option>
                    <option value="ACTIVE">Active Only</option>
                    <option value="INACTIVE">Deactivated Only</option>
                  </select>
                </div>
              </div>

              {/* Quick Filter Summary Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${statusFilter === 'ALL' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>All Students</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/50 text-current">{usersList.length}</span>
                </button>

                <button
                  onClick={() => setStatusFilter('PAID')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${statusFilter === 'PAID' ? 'bg-emerald-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Paid &amp; Enrolled</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                    {usersList.filter(u => u.payment_status === 'PAID').length}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter('UNPAID')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${statusFilter === 'UNPAID' ? 'bg-amber-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>Pending Payment</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800">
                    {usersList.filter(u => u.payment_status !== 'PAID').length}
                  </span>
                </button>

                <button
                  onClick={() => setStatusFilter('ACTIVE')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 ${statusFilter === 'ACTIVE' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                  <span>Active Accounts</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-sky-100 text-sky-800">
                    {usersList.filter(u => u.is_active !== 0).length}
                  </span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Student &amp; ID</th>
                        <th className="py-3.5 px-6">Contact Details</th>
                        <th className="py-3.5 px-6">Academic Background</th>
                        <th className="py-3.5 px-6">Payment / Status</th>
                        <th className="py-3.5 px-6">Access</th>
                        <th className="py-3.5 px-6 text-right">Functional Controls</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {usersList
                        .filter(u => {
                          const matchesSearch = !searchQuery || 
                            u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.mobile?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.college?.toLowerCase().includes(searchQuery.toLowerCase());
                          
                          if (!matchesSearch) return false;
                          if (statusFilter === 'ACTIVE') return u.is_active !== 0;
                          if (statusFilter === 'INACTIVE') return u.is_active === 0;
                          if (statusFilter === 'PAID') return u.payment_status === 'PAID';
                          if (statusFilter === 'UNPAID') return u.payment_status !== 'PAID';
                          return true;
                        })
                        .map(u => (
                          <tr key={u.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-6">
                              <div className="font-bold text-slate-900">{u.full_name}</div>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="font-mono text-[10px] text-slate-400 truncate max-w-[130px]">{u.id}</span>
                                <button
                                  onClick={() => copyToClipboard(u.id, `id_${u.id}`)}
                                  className="text-slate-400 hover:text-slate-700"
                                  title="Copy Student ID"
                                >
                                  <Copy className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-slate-800 font-semibold">{u.email}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{u.mobile || '—'}</div>
                              {u.city && <div className="text-[10px] text-slate-400">{u.city}{u.state ? `, ${u.state}` : ''}</div>}
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-slate-800 font-semibold max-w-[180px] truncate">{u.college || 'Engineering'}</div>
                              <div className="text-[11px] text-slate-500">{u.department || 'Full Stack'} • {u.year_of_study || '3rd Year'}</div>
                              <span className="inline-block mt-0.5 text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                                {u.skill_level || 'Intermediate'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-1 rounded-full font-extrabold text-[10px] inline-flex items-center gap-1 ${
                                u.payment_status === 'PAID' 
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {u.payment_status === 'PAID' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                                <span>{u.payment_status === 'PAID' ? 'PAID / CONFIRMED' : 'PAYMENT PENDING'}</span>
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${u.is_active !== 0 ? 'bg-sky-100 text-sky-800' : 'bg-rose-100 text-rose-800'}`}>
                                {u.is_active !== 0 ? 'Active' : 'Deactivated'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex flex-wrap items-center justify-end gap-1.5">
                                <button
                                  onClick={async () => {
                                    const res = await fetch(`/api/admin/users/${u.id}`, { headers: { Authorization: `Bearer ${authToken}` } });
                                    const d = await res.json();
                                    setSelectedUserDetail(d);
                                  }}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                                  title="View Full Profile Dossier"
                                >
                                  View
                                </button>

                                <button
                                  onClick={() => handleOpenEditStudent(u)}
                                  className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg transition flex items-center gap-1"
                                  title="Edit Student Details"
                                >
                                  <Edit3 className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>

                                {u.payment_status !== 'PAID' && (
                                  <button
                                    onClick={() => handleOpenManualPayment(u)}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1 shadow-2xs"
                                    title="Manual Confirm & Enroll"
                                  >
                                    <DollarSign className="w-3 h-3" />
                                    <span>Confirm Pay</span>
                                  </button>
                                )}

                                <button
                                  onClick={() => handleOpenResetPassword(u)}
                                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg transition"
                                  title="Reset Student Password"
                                >
                                  <Key className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleToggleUserStatus(u)}
                                  className={`px-2 py-1 font-bold rounded-lg transition text-[11px] ${u.is_active !== 0 ? 'bg-rose-50 hover:bg-rose-100 text-rose-600' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600'}`}
                                  title={u.is_active !== 0 ? 'Deactivate student dashboard access' : 'Activate access'}
                                >
                                  {u.is_active !== 0 ? 'Deactivate' : 'Activate'}
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold rounded-lg transition border border-rose-200"
                                  title="Permanently Delete Student Account"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Application Management ({applicationsList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Review submissions, manual fee overrides, student admissions, and stage workflows</p>
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
                      {applicationsList.map(app => {
                        const linkedUser = usersList.find(u => u.id === app.user_id || u.email === app.email);
                        const isPaid = app.payment_status === 'PAID' || linkedUser?.payment_status === 'PAID';

                        return (
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
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {isPaid ? `₹${app.amount || 200} PAID` : 'PENDING'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                app.registration_status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {app.registration_status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right space-x-1.5">
                              {!isPaid && linkedUser && (
                                <button
                                  onClick={() => handleOpenManualPayment(linkedUser)}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                                  title="Mark Paid and Confirm"
                                >
                                  Mark Paid
                                </button>
                              )}
                              <button
                                onClick={() => handleUpdateApplicationStatus(app.application_id, 'CONFIRMED')}
                                className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-lg text-xs"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateApplicationStatus(app.application_id, 'REJECTED')}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg text-xs"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => handleDeleteUser(linkedUser || { id: app.student_id || app.user_id, full_name: app.full_name, email: app.email })}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 font-bold rounded-lg transition inline-flex items-center align-middle border border-rose-200"
                                title="Permanently Delete Account / Application"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Certificate Management ({certificatesList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Issue cryptographic verifiable certificates, manage status, view QR codes, and trigger email dispatches</p>
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
                        <th className="py-3.5 px-5">Student</th>
                        <th className="py-3.5 px-5">Student ID</th>
                        <th className="py-3.5 px-5">Domain</th>
                        <th className="py-3.5 px-5">Certificate ID</th>
                        <th className="py-3.5 px-5">Issue Date</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {certificatesList.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="py-8 text-center text-slate-400">
                            No certificates issued yet.
                          </td>
                        </tr>
                      ) : (
                        certificatesList.map(cert => (
                          <tr key={cert.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-5">
                              <div className="font-bold text-slate-900">{cert.student_name}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{cert.student_email || cert.student_id}</div>
                            </td>
                            <td className="py-4 px-5 font-mono font-bold text-slate-700">
                              {cert.student_id_formatted || cert.internship_id || `SKX-2026-${String(cert.student_id).slice(-4)}`}
                            </td>
                            <td className="py-4 px-5 font-semibold text-slate-700">
                              {cert.domain || 'Full Stack Development'}
                            </td>
                            <td className="py-4 px-5 font-mono font-bold text-purple-700">
                              {cert.certificate_id || cert.id}
                            </td>
                            <td className="py-4 px-5 font-mono text-slate-500">
                              {cert.issue_date}
                            </td>
                            <td className="py-4 px-5">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                cert.status === 'REVOKED' || cert.certificate_status === 'REVOKED'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {cert.status === 'REVOKED' || cert.certificate_status === 'REVOKED' ? 'REVOKED' : 'VALID'}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                              <a
                                href={`/api/documents/certificate/${cert.id}/view`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                title="View Document Canvas"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </a>
                              <a
                                href={`/api/documents/certificate/${cert.id}/download`}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                title="Download Document File"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </a>
                              <a
                                href={`/verify/${cert.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                title="Open Public Verification"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Verify</span>
                              </a>
                              <button
                                onClick={() => handleResendCertEmail(cert.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                title="Resend Notification Email to Student"
                              >
                                <Send className="w-3 h-3" />
                                <span>Resend</span>
                              </button>
                              {cert.status === 'REVOKED' || cert.certificate_status === 'REVOKED' ? (
                                <button
                                  onClick={() => handleRestoreCertificate(cert.id)}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition text-[11px]"
                                  title="Restore Certificate to Valid Status"
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRevokeCertificate(cert.id)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg transition text-[11px]"
                                  title="Revoke Certificate"
                                >
                                  Revoke
                                </button>
                              )}
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
              VIEW 7: OFFER LETTER MANAGEMENT (SECTION 22)
          ======================================================== */}
          {activeView === 'offer-letters' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Offer Letter Management ({offerLettersList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Generate appointment letters, track unique verification codes, monitor email delivery, and manage active status</p>
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
                        <th className="py-3.5 px-5">Student</th>
                        <th className="py-3.5 px-5">Student ID</th>
                        <th className="py-3.5 px-5">Domain</th>
                        <th className="py-3.5 px-5">Internship ID</th>
                        <th className="py-3.5 px-5">Offer ID</th>
                        <th className="py-3.5 px-5">Issue Date</th>
                        <th className="py-3.5 px-5">Email Status</th>
                        <th className="py-3.5 px-5">Status</th>
                        <th className="py-3.5 px-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {offerLettersList.length === 0 ? (
                        <tr>
                          <td colSpan="9" className="py-8 text-center text-slate-400">
                            No offer letters issued yet.
                          </td>
                        </tr>
                      ) : (
                        offerLettersList.map(ol => (
                          <tr key={ol.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-4 px-5">
                              <div className="font-bold text-slate-900">{ol.student_name}</div>
                              <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{ol.student_email || ol.student_id}</div>
                            </td>
                            <td className="py-4 px-5 font-mono font-bold text-slate-700">
                              {ol.student_id_formatted || `SKX-2026-${String(ol.student_id).slice(-4)}`}
                            </td>
                            <td className="py-4 px-5 font-semibold text-slate-700">
                              {ol.domain || 'Cloud Computing'}
                            </td>
                            <td className="py-4 px-5 font-mono font-bold text-slate-800">
                              {ol.internship_id || `SKX-INT-2026-${String(ol.student_id).slice(-4)}`}
                            </td>
                            <td className="py-4 px-5 font-mono font-bold text-sky-700">
                              {ol.verification_code || ol.offer_letter_id || ol.id}
                            </td>
                            <td className="py-4 px-5 font-mono text-slate-500">
                              {ol.issue_date}
                            </td>
                            <td className="py-4 px-5">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                ol.email_status === 'SENT' ? 'bg-emerald-100 text-emerald-800' : ol.email_status === 'FAILED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                              }`}>
                                {ol.email_status || 'SENT'}
                              </span>
                            </td>
                            <td className="py-4 px-5">
                              <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                                ol.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}>
                                {ol.status || 'ACTIVE'}
                              </span>
                            </td>
                            <td className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap">
                              <a
                                href={`/api/documents/offer-letter/${ol.id}/view`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                title="View Document Canvas"
                              >
                                <Eye className="w-3 h-3" />
                                <span>View</span>
                              </a>
                              <a
                                href={`/api/documents/offer-letter/${ol.id}/download`}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                title="Download Document File"
                              >
                                <Download className="w-3 h-3" />
                                <span>Download</span>
                              </a>
                              <button
                                onClick={() => handleResendOLEmail(ol.id)}
                                className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition inline-flex items-center gap-1 text-[11px]"
                                title="Resend Notification Email to Student"
                              >
                                <Send className="w-3 h-3" />
                                <span>Resend</span>
                              </button>
                              {ol.status === 'REVOKED' ? (
                                <button
                                  onClick={() => handleRestoreOfferLetter(ol.id)}
                                  className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg transition text-[11px]"
                                  title="Restore Offer Letter"
                                >
                                  Restore
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleRevokeOfferLetter(ol.id)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-lg transition text-[11px]"
                                  title="Revoke Offer Letter"
                                >
                                  Revoke
                                </button>
                              )}
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
              VIEW 8: PAYMENT MANAGEMENT & CASHFREE GATEWAY (SECTION 24)
          ======================================================== */}
          {activeView === 'payments' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Payment &amp; Gateway Management ({paymentsList.length})</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time payment logs, live Cashfree API verification, settlement tracking, and ledger export</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleExportPaymentsCsv}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Ledger CSV</span>
                  </button>
                </div>
              </div>

              {/* Cashfree Live Order Inspector Box */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white border border-slate-700/60 shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <CreditCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">Cashfree Live Gateway Inspector</h3>
                      <p className="text-[11px] text-slate-400">Query Cashfree production servers directly to inspect transaction status</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>API v2023-08-01 Active</span>
                  </span>
                </div>

                <form onSubmit={handleQueryCashfreeLive} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Paste Cashfree Order ID (e.g. order_174... or user_...)"
                      value={cashfreeQueryInput}
                      onChange={(e) => setCashfreeQueryInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-white font-mono text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={cashfreeQueryLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition shrink-0"
                  >
                    {cashfreeQueryLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>{cashfreeQueryLoading ? 'Querying Gateway...' : 'Query Cashfree Live'}</span>
                  </button>
                </form>

                {/* Gateway Inspection Result */}
                {cashfreeQueryResult && (
                  <div className="p-4 bg-slate-800/80 border border-slate-700 rounded-2xl text-xs space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-700/60">
                      <span className="font-bold text-slate-300">Live Gateway Query Response:</span>
                      <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] ${
                        cashfreeQueryResult.verification?.payment_status === 'PAID' 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}>
                        Status: {cashfreeQueryResult.verification?.payment_status || 'NOT PAID / PENDING'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 block">Order ID:</span>
                        <strong className="font-mono text-white truncate block">{cashfreeQueryResult.order_id || cashfreeQueryInput}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Amount / Currency:</span>
                        <strong className="text-white">₹{cashfreeQueryResult.verification?.order_amount || 200}.00 INR</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">PG Status:</span>
                        <strong className="text-white">{cashfreeQueryResult.verification?.payment_status || 'PENDING'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Database Status:</span>
                        <strong className="text-emerald-400">{cashfreeQueryResult.db_updated ? 'Synchronized' : 'Recorded'}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Transactions Ledger Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">Recorded Transactions Ledger</h3>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    Total: ₹{stats?.total_collection || 0}.00 INR
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                      <tr>
                        <th className="py-3.5 px-6">Cashfree Order ID</th>
                        <th className="py-3.5 px-6">Student Contact</th>
                        <th className="py-3.5 px-6">Gross Amount</th>
                        <th className="py-3.5 px-6">Method / Gateway</th>
                        <th className="py-3.5 px-6">PG Status</th>
                        <th className="py-3.5 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {paymentsList.map(pay => (
                        <tr key={pay.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-4 px-6">
                            <div className="font-mono font-bold text-slate-900 flex items-center gap-1.5">
                              <span className="truncate max-w-[150px]">{pay.order_id}</span>
                              <button
                                onClick={() => copyToClipboard(pay.order_id, `order_${pay.id}`)}
                                className="text-slate-400 hover:text-slate-700"
                                title="Copy Order ID"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {pay.created_at ? new Date(pay.created_at).toLocaleDateString() : 'Recent'}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900">{pay.student_name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{pay.student_email}</div>
                          </td>
                          <td className="py-4 px-6 font-bold text-slate-900">
                            ₹{pay.amount || 200}.00 {pay.currency || 'INR'}
                          </td>
                          <td className="py-4 px-6 text-slate-600">
                            <span className="font-semibold text-slate-800">{pay.payment_method || 'Cashfree Online PG'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] inline-flex items-center gap-1 ${
                              pay.status === 'PAID' 
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                              {pay.status === 'PAID' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Clock className="w-3 h-3 text-amber-600" />}
                              <span>{pay.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={() => {
                                setCashfreeQueryInput(pay.order_id);
                                handleQueryCashfreeLive(null, pay.order_id);
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition"
                              title="Query Cashfree Gateway Status Live"
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
              VIEW 12: SETTINGS, CLOUD BACKUPS & SECURITY (SECTION 34)
          ======================================================== */}
          {activeView === 'settings' && (
            <div className="space-y-8">
              
              {/* Top Row: Portal Settings + Cloud Database Operations */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Portal Settings Form */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-sky-600" />
                      <h3 className="text-base font-bold text-slate-900">Portal &amp; Batch Parameters</h3>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">Live Config</span>
                  </div>

                  <form onSubmit={handleSavePortalSettings} className="space-y-4 text-xs">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-slate-700">Official Batch 1 WhatsApp Group URL</label>
                        <a
                          href={whatsappUrlInput}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-bold text-emerald-600 hover:underline flex items-center gap-1"
                        >
                          <span>Test Link</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
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
                        Batch Start Announcement Banner Text
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Parameters to Database</span>
                    </button>
                  </form>
                </div>

                {/* 2. Cloud Database Operations & Disaster Recovery */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-purple-600" />
                      <h3 className="text-base font-bold text-slate-900">Cloud Sync &amp; Disaster Recovery</h3>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Supabase Ready
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Dual-persistence system mirrors local SQLite state to cloud Supabase PostgreSQL in real-time. Manual force-sync controls are available below:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={handleTriggerSupabasePush}
                      disabled={cloudSyncLoading}
                      className="p-3.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold rounded-2xl text-xs flex items-center gap-3 transition disabled:opacity-50 text-left"
                    >
                      <UploadCloud className="w-5 h-5 text-sky-600 shrink-0" />
                      <div>
                        <div className="font-extrabold">Push to Cloud</div>
                        <div className="text-[10px] font-normal text-sky-600">Sync all SQLite to Supabase</div>
                      </div>
                    </button>

                    <button
                      onClick={handleTriggerSupabasePull}
                      disabled={cloudSyncLoading}
                      className="p-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold rounded-2xl text-xs flex items-center gap-3 transition disabled:opacity-50 text-left"
                    >
                      <DownloadCloud className="w-5 h-5 text-indigo-600 shrink-0" />
                      <div>
                        <div className="font-extrabold">Pull from Cloud</div>
                        <div className="text-[10px] font-normal text-indigo-600">Restore cloud records</div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportBackupJson}
                      className="p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold rounded-2xl text-xs flex items-center gap-3 transition text-left"
                    >
                      <Database className="w-5 h-5 text-slate-600 shrink-0" />
                      <div>
                        <div className="font-extrabold">Export JSON Backup</div>
                        <div className="text-[10px] font-normal text-slate-500">Complete database snapshot</div>
                      </div>
                    </button>

                    <button
                      onClick={handleExportPaymentsCsv}
                      className="p-3.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold rounded-2xl text-xs flex items-center gap-3 transition text-left"
                    >
                      <Download className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-extrabold">Export Payments CSV</div>
                        <div className="text-[10px] font-normal text-emerald-600">Financial transactions ledger</div>
                      </div>
                    </button>
                  </div>

                  {cloudSyncStats && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-600">
                      Synced {cloudSyncStats.students || 0} students, {cloudSyncStats.registrations || 0} applications, {cloudSyncStats.offer_letters || 0} offer letters to Supabase.
                    </div>
                  )}
                </div>

              </div>

              {/* Security & Admin Password Management Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-amber-600" />
                    <h3 className="text-base font-bold text-slate-900">Administrator Security &amp; Credentials</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">admin@skyrovix.com</span>
                </div>

                {adminPasswordStatus && (
                  <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                    adminPasswordStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {adminPasswordStatus.success ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                    <span>{adminPasswordStatus.message}</span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminPassword} className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••••••"
                      value={adminPasswordForm.currentPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, currentPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">New Password (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••••••"
                      value={adminPasswordForm.newPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, newPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      placeholder="••••••••••••"
                      value={adminPasswordForm.confirmPassword}
                      onChange={(e) => setAdminPasswordForm({ ...adminPasswordForm, confirmPassword: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3 pt-1">
                    <button
                      type="submit"
                      disabled={adminPasswordLoading}
                      className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition"
                    >
                      {adminPasswordLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Lock className="w-3.5 h-3.5" />}
                      <span>{adminPasswordLoading ? 'Updating Password...' : 'Change Administrator Password'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Complete Audit Logs Table (Section 34) */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">Administrative Audit Trails</h3>
                    <p className="text-xs text-slate-500">Immutable ledger tracking security operations, approvals, revocations, and configuration changes</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded-full">
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

            {/* Section 23: Complete 10-Stage Internship Pipeline Timeline */}
            <div className="space-y-3 text-xs pt-1 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
                  Internship Progression Pipeline (10 Stages):
                </h4>
                <span className="text-[10px] font-mono text-slate-400">
                  ID: {selectedUserDetail.user.student_id_formatted || `SKX-2026-${String(selectedUserDetail.user.id).slice(-4)}`}
                </span>
              </div>

              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/90 space-y-2.5">
                {[
                  {
                    num: 1,
                    title: 'Student Application',
                    status: 'COMPLETED',
                    detail: selectedUserDetail.registration?.created_at ? new Date(selectedUserDetail.registration.created_at).toLocaleDateString('en-GB') : 'Submitted',
                    done: true
                  },
                  {
                    num: 2,
                    title: 'Application Approved',
                    status: selectedUserDetail.registration?.registration_status === 'APPROVED' || selectedUserDetail.registration?.payment_status === 'PAID' ? 'APPROVED' : 'PENDING',
                    detail: selectedUserDetail.registration?.payment_status === 'PAID' ? 'Confirmed & Paid' : 'Pending review',
                    done: selectedUserDetail.registration?.registration_status === 'APPROVED' || selectedUserDetail.registration?.payment_status === 'PAID'
                  },
                  {
                    num: 3,
                    title: 'Offer Letter Generated',
                    status: selectedUserDetail.offerLetters?.length > 0 ? 'GENERATED' : 'PENDING',
                    detail: selectedUserDetail.offerLetters?.[0]?.verification_code || 'Awaiting generation',
                    done: selectedUserDetail.offerLetters?.length > 0
                  },
                  {
                    num: 4,
                    title: 'Offer Letter Sent (Email)',
                    status: selectedUserDetail.offerLetters?.[0]?.email_status === 'SENT' ? 'SENT' : selectedUserDetail.offerLetters?.length > 0 ? 'PENDING / RETRY' : 'PENDING',
                    detail: selectedUserDetail.user.email,
                    done: selectedUserDetail.offerLetters?.[0]?.email_status === 'SENT'
                  },
                  {
                    num: 5,
                    title: 'Internship Started',
                    status: selectedUserDetail.registration?.internship_status === 'ACTIVE' || selectedUserDetail.registration?.internship_status === 'COMPLETED' ? 'ACTIVE' : 'UPCOMING',
                    detail: 'Domain: ' + (selectedUserDetail.registration?.domain || 'Full Stack Development'),
                    done: selectedUserDetail.registration?.internship_status === 'ACTIVE' || selectedUserDetail.registration?.internship_status === 'COMPLETED'
                  },
                  {
                    num: 6,
                    title: 'Tasks / Learning Modules',
                    status: `${selectedUserDetail.trainingSubmissions?.filter(t => t.status === 'APPROVED').length || 0}/5 Modules`,
                    detail: 'Milestone assignments',
                    done: (selectedUserDetail.trainingSubmissions?.filter(t => t.status === 'APPROVED').length || 0) >= 5
                  },
                  {
                    num: 7,
                    title: 'Final Project Submission',
                    status: selectedUserDetail.submissions?.length > 0 ? 'SUBMITTED' : 'NOT SUBMITTED',
                    detail: selectedUserDetail.submissions?.[0]?.project_title || 'Capstone project deliverable',
                    done: selectedUserDetail.submissions?.length > 0
                  },
                  {
                    num: 8,
                    title: 'Final Project Review',
                    status: selectedUserDetail.submissions?.some(s => s.status === 'APPROVED') ? 'APPROVED' : selectedUserDetail.submissions?.length > 0 ? 'UNDER REVIEW' : 'PENDING',
                    detail: 'Mentor board review',
                    done: selectedUserDetail.submissions?.some(s => s.status === 'APPROVED')
                  },
                  {
                    num: 9,
                    title: 'Completion Eligibility Check',
                    status: selectedUserDetail.certificates?.length > 0 ? 'VERIFIED & CLEARED' : 'EVALUATION PENDING',
                    detail: 'All criteria satisfied',
                    done: selectedUserDetail.certificates?.length > 0
                  },
                  {
                    num: 10,
                    title: 'Certificate Generated & Sent',
                    status: selectedUserDetail.certificates?.length > 0 ? (selectedUserDetail.certificates[0].certificate_id || selectedUserDetail.certificates[0].id) : 'NOT ISSUED',
                    detail: selectedUserDetail.certificates?.[0]?.email_status === 'SENT' ? 'Sent to Student' : 'Ready',
                    done: selectedUserDetail.certificates?.length > 0
                  }
                ].map((step) => (
                  <div key={step.num} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                        step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {step.num}
                      </div>
                      <span className="font-semibold text-slate-800">{step.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="text-[10px] text-slate-400 hidden sm:inline">{step.detail}</span>
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                        step.done ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {step.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleDeleteUser(selectedUserDetail.user)}
                className="flex-1 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-rose-200"
                title="Permanently Delete Student Account"
              >
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Account</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedUserDetail(null)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
              >
                Close
              </button>
            </div>
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

      {/* ========================================================
          MODAL: MANUAL PAYMENT OVERRIDE MODAL
      ======================================================== */}
      {showManualPayModal && manualPayTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left text-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">Manual Payment Confirmation</span>
                  <h3 className="text-base font-extrabold text-slate-900">Confirm Student Enrollment</h3>
                </div>
              </div>
              <button 
                onClick={() => { setShowManualPayModal(false); setManualPayTarget(null); }} 
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Student Name:</span>
                <strong className="text-slate-900">{manualPayTarget.full_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email:</span>
                <strong className="text-slate-700 font-mono text-[11px]">{manualPayTarget.email}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Mobile:</span>
                <strong className="text-slate-700">{manualPayTarget.mobile || '—'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">College / Dept:</span>
                <span className="text-slate-700 truncate max-w-[220px]">{manualPayTarget.college} ({manualPayTarget.department || 'FSD'})</span>
              </div>
            </div>

            <form onSubmit={handleSubmitManualPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Fee Amount (INR)</label>
                <input
                  type="number"
                  required
                  value={manualPayForm.amount}
                  onChange={(e) => setManualPayForm({ ...manualPayForm, amount: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method / Channel</label>
                <select
                  value={manualPayForm.paymentMethod}
                  onChange={(e) => setManualPayForm({ ...manualPayForm, paymentMethod: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="MANUAL_CASH_UPI">Direct UPI / QR Code Transfer</option>
                  <option value="OFFLINE_CASH">Cash Deposit / Counter Payment</option>
                  <option value="BANK_NEFT_IMPS">Direct Bank NEFT / IMPS Transfer</option>
                  <option value="ADMIN_SPONSORED">Admin Scholarship / Fee Waiver</option>
                  <option value="GATEWAY_RECONCILED">Gateway Reconciled (Cashfree Verified)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Audit Reference / Transaction ID / Notes</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UPI Ref 41029384729 or Counter Receipt #104"
                  value={manualPayForm.notes}
                  onChange={(e) => setManualPayForm({ ...manualPayForm, notes: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl space-y-1 text-[11px] text-emerald-900">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Automatic Production Actions Triggered:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-emerald-800">
                  <li>Marks student and application status as <strong>PAID &amp; CONFIRMED</strong></li>
                  <li>Generates official <strong>Offer Letter</strong> with verification code if not yet issued</li>
                  <li>Unlocks student dashboard to Step 2 (Offer Letter) and Step 3 (Internship)</li>
                  <li>Syncs change directly to Supabase Cloud &amp; records immutable audit log</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={manualPayLoading}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-2 transition"
                >
                  {manualPayLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{manualPayLoading ? 'Processing Override...' : 'Confirm & Enroll Student'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShowManualPayModal(false); setManualPayTarget(null); }}
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
          MODAL: RESET STUDENT PASSWORD MODAL
      ======================================================== */}
      {showResetPassModal && resetPassTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left text-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600">Student Account Security</span>
                  <h3 className="text-base font-extrabold text-slate-900">Reset Student Password</h3>
                </div>
              </div>
              <button 
                onClick={() => { setShowResetPassModal(false); setResetPassTarget(null); }} 
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Student:</span>
                <strong className="text-slate-900">{resetPassTarget.full_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Email:</span>
                <strong className="text-slate-700 font-mono text-[11px]">{resetPassTarget.email}</strong>
              </div>
            </div>

            <form onSubmit={handleSubmitResetPassword} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-slate-700">New Password</label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPass}
                    className="text-[10px] font-bold text-sky-600 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Generate Random</span>
                  </button>
                </div>
                <input
                  type="text"
                  required
                  minLength={6}
                  placeholder="Enter minimum 6 characters..."
                  value={resetPassInput}
                  onChange={(e) => setResetPassInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <p className="text-[11px] text-slate-500">
                The new password will be encrypted with bcrypt. The student will be able to log in with this new password immediately and will receive an in-app notice.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={resetPassLoading}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-2 transition"
                >
                  {resetPassLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  <span>{resetPassLoading ? 'Updating Password...' : 'Save New Password'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setShowResetPassModal(false); setResetPassTarget(null); }}
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
          MODAL: EDIT STUDENT PROFILE DETAILS MODAL
      ======================================================== */}
      {showEditStudentModal && editStudentForm.id && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto text-left text-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-600">Student Record Management</span>
                  <h3 className="text-base font-extrabold text-slate-900">Edit Student Profile Details</h3>
                </div>
              </div>
              <button 
                onClick={() => setShowEditStudentModal(false)} 
                className="text-slate-400 hover:text-slate-700 font-bold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitEditStudent} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.full_name}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, full_name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile Contact</label>
                  <input
                    type="tel"
                    required
                    value={editStudentForm.mobile}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, mobile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">College / University</label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.college}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, college: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={editStudentForm.department}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Degree</label>
                  <input
                    type="text"
                    value={editStudentForm.degree}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, degree: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Year of Study</label>
                  <input
                    type="text"
                    value={editStudentForm.year_of_study}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, year_of_study: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={editStudentForm.city}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={editStudentForm.state}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, state: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Skill Level</label>
                  <select
                    value={editStudentForm.skill_level}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, skill_level: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Active Status</label>
                  <select
                    value={editStudentForm.is_active}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, is_active: parseInt(e.target.value, 10) })}
                    className="w-full p-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value={1}>Active</option>
                    <option value={0}>Deactivated</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/username"
                    value={editStudentForm.github_profile}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, github_profile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/in/username"
                    value={editStudentForm.linkedin_profile}
                    onChange={(e) => setEditStudentForm({ ...editStudentForm, linkedin_profile: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={editStudentLoading}
                  className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-sm flex items-center justify-center gap-2 transition"
                >
                  {editStudentLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editStudentLoading ? 'Saving...' : 'Save Student Changes'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleDeleteUser({ id: editStudentForm.id, full_name: editStudentForm.full_name, email: editStudentForm.email });
                  }}
                  className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition border border-rose-200"
                  title="Permanently Delete Student Account"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditStudentModal(false)}
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
