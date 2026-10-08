import React, { useState } from 'react';
import { 
  LogIn, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  X
} from 'lucide-react';
import navLogo from '../assets/top nav bar logo.png';

export const LoginModal = ({ isOpen, onClose, onLoginSuccess, onAdminLoginSuccess, onOpenApply }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please provide your registered email/username and password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password })
      });

      let data = {};
      try {
        data = await res.json();
      } catch (parseErr) {
        console.warn('Response JSON parse error:', parseErr);
      }
      setLoading(false);

      if (!res.ok) {
        setError(data.error || data.message || `Server returned error (${res.status}). Please verify credentials and try again.`);
        return;
      }

      // Automatically route Admin vs Student based on authentication result
      if (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN' || data.redirect?.includes('admin')) {
        if (data.token) {
          localStorage.setItem('skyrovix_admin_token', data.token);
        }
        if (onAdminLoginSuccess) {
          onAdminLoginSuccess(data.token);
        }
        onClose();
        return;
      }

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
      <div className="w-full max-w-md bg-white rounded-[24px] p-6 sm:p-8 shadow-[0_25px_60px_rgba(7,20,38,0.25)] border border-[rgba(25,40,55,0.08)] text-left relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-[#192837] transition cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 pb-2 text-center">
          <div className="inline-flex justify-center">
            <img src={navLogo} alt="Skyrovix" className="h-9 w-auto object-contain" />
          </div>
          <div>
            <h3 className="font-heading text-xl font-black text-[#192837] tracking-tight">
              Sign In to Skyrovix
            </h3>
            <p className="text-xs text-[#4C5B6D] mt-1">
              Enter your registered email and password to access your dashboard
            </p>
          </div>
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
            <label className="block font-bold text-[#192837] mb-1">
              Email Address / Username <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="Enter your registered email or username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 font-sans focus:outline-none focus:ring-2 focus:ring-[#087FC1] text-[#192837]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#192837] mb-1">
              Account Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 font-sans focus:outline-none focus:ring-2 focus:ring-[#087FC1] text-[#192837]"
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
            className="w-full py-3.5 text-white font-extrabold rounded-[16px] shadow-md transition flex items-center justify-center gap-2 text-xs active:scale-[0.99] disabled:opacity-70 cursor-pointer"
            style={{
              background: 'linear-gradient(135deg, #087FC1, #2447B8)',
              boxShadow: '0 8px 20px rgba(8,127,193,0.25)'
            }}
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login to Dashboard</span>
              </>
            )}
          </button>
        </form>

        {/* Modal Footer Links */}
        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <p className="text-xs text-[#4C5B6D]">
            Don't have an internship account yet?{' '}
            <button
              onClick={() => {
                onClose();
                if (onOpenApply) onOpenApply();
              }}
              className="text-[#087FC1] font-bold hover:underline cursor-pointer"
            >
              Apply for Batch 1
            </button>
          </p>
        </div>

      </div>
    </div>
  );
};
