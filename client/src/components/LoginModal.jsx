import React, { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ShieldCheck,
  User,
  X
} from 'lucide-react';
import navLogo from '../assets/top nav bar logo.png';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, onAdminLoginSuccess, onOpenApply }) => {
  // 'student' or 'admin'
  const [authRole, setAuthRole] = useState('student');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleSwitch = (role) => {
    setAuthRole(role);
    setError('');
    if (role === 'admin') {
      setEmail('admin@skyrovix.com');
      setPassword('Skyrovix@Admin2026');
    } else {
      setEmail('skyrovix@gmail.com');
      setPassword('skyrovix123');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide both your login ID/email and password.');
      return;
    }

    setLoading(true);

    try {
      // Determine endpoint based on tab or auto-detect
      const endpoint = authRole === 'admin' ? '/api/admin/login' : '/api/auth/login';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.error || 'Invalid credentials. Please verify your email and password.');
        return;
      }

      // 1. Admin login recognized
      if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN' || data.redirect?.includes('admin') || authRole === 'admin') {
        if (data.token) {
          localStorage.setItem('skyrovix_admin_token', data.token);
        }
        if (onAdminLoginSuccess) {
          onAdminLoginSuccess(data.token);
        }
        onClose();
        return;
      }

      // 2. Student user login
      if (data.student_id) {
        localStorage.setItem('skyrovix_student_id', data.student_id);
        if (data.token) {
          localStorage.setItem('skyrovix_auth_token', data.token);
        }
        onLoginSuccess(data.student_id);
        onClose();
      }
    } catch (err) {
      setLoading(false);
      setError('Connection failed. Please check your internet or try again later.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 pb-2 text-center">
          <div className="inline-flex justify-center">
            <img src={navLogo} alt="Skyrovix" className="h-9 w-auto object-contain" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {authRole === 'admin' ? 'Administrator Portal' : 'User Dashboard Login'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {authRole === 'admin'
                ? 'Sign in with your master administrator credentials'
                : 'Sign in with your registered email and password'}
            </p>
          </div>
        </div>

        {/* Role Toggle Switcher */}
        <div className="mt-3 p-1 rounded-2xl bg-slate-100 flex items-center text-xs font-bold">
          <button
            type="button"
            onClick={() => handleRoleSwitch('student')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authRole === 'student'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Student / User</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center gap-1.5 ${
              authRole === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>Administrator</span>
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="my-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {authRole === 'admin' ? 'Admin Email / Username' : 'Registered Email ID'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={authRole === 'admin' ? 'text' : 'email'}
                required
                placeholder={authRole === 'admin' ? 'admin@skyrovix.com' : 'name@gmail.com'}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-sans focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {authRole === 'admin' ? 'Master Password' : 'Account Password'}{' '}
              <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 font-sans focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs active:scale-[0.99] ${
              authRole === 'admin'
                ? 'bg-slate-900 hover:bg-slate-800'
                : 'bg-[#1864f8] hover:bg-blue-700'
            }`}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                {authRole === 'admin' ? <ShieldCheck className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
                <span>
                  {authRole === 'admin' ? 'Sign In as Administrator' : 'Login to User Dashboard'}
                </span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Autofill Links */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Quick fill:</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setAuthRole('student');
                setEmail('skyrovix@gmail.com');
                setPassword('skyrovix123');
                setError('');
              }}
              className="text-blue-600 hover:underline font-semibold"
            >
              Demo Student
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={() => {
                setAuthRole('admin');
                setEmail('admin@skyrovix.com');
                setPassword('Skyrovix@Admin2026');
                setError('');
              }}
              className="text-slate-800 hover:underline font-bold"
            >
              Master Admin
            </button>
          </div>
        </div>

        {/* Modal Footer Links */}
        {authRole === 'student' && (
          <div className="mt-3 text-center">
            <p className="text-xs text-slate-500">
              Don't have an internship account yet?{' '}
              <button
                onClick={() => {
                  onClose();
                  if (onOpenApply) onOpenApply();
                }}
                className="text-[#1864f8] font-bold hover:underline"
              >
                Apply for Batch 1
              </button>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
