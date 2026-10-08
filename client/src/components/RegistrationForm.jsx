import React, { useState } from 'react';
import { 
  UserPlus, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  ExternalLink, 
  Eye, 
  EyeOff 
} from 'lucide-react';
import { WhatsAppIcon } from './BrandIcons';

export const RegistrationForm = ({
  onOrderCreated,
  onAlreadyConfirmed,
  whatsappUrl
}) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    college: '',
    degree: '',
    department: '',
    yearOfStudy: '3rd Year',
    city: '',
    githubUrl: '',
    linkedinUrl: '',
    skillLevel: 'Beginner',
    duration: '3 Months',
    agreedTerms: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingConfirmedMsg, setExistingConfirmedMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setExistingConfirmedMsg(null);

    // Frontend validations
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setErrorMessage('Please create a password with at least 6 characters for your dashboard login.');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.replace(/\D/g, '').length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.college.trim()) {
      setErrorMessage('Please enter your college / university name.');
      return;
    }
    if (!formData.degree.trim()) {
      setErrorMessage('Please enter your degree program (e.g. B.Tech, B.E, B.Sc, BCA, MCA).');
      return;
    }
    if (!formData.department.trim()) {
      setErrorMessage('Please enter your department / specialization (e.g. CSE, IT, ECE).');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Please enter your city.');
      return;
    }
    if (!formData.agreedTerms) {
      setErrorMessage('You must agree to the internship terms and guidelines to continue.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/registrations/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to submit registration. Please verify your details.');
        return;
      }

      // Check if student is already confirmed
      if (data.already_confirmed) {
        setExistingConfirmedMsg(data);
        if (onAlreadyConfirmed) onAlreadyConfirmed(data);
        return;
      }

      // Order created successfully, invoke Cashfree Checkout modal
      if (data.payment_session_id || data.order_id) {
        onOrderCreated(data);
      }
    } catch (err) {
      setLoading(false);
      console.error('Registration submission error:', err);
      setErrorMessage('Unable to connect to server. Please check your internet connection.');
    }
  };

  return (
    <section id="register" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider border border-sky-200">
            <UserPlus className="w-3.5 h-3.5 text-sky-600" />
            <span>OFFICIAL APPLICATION FORM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Register for Skyrovix Batch 1
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Fill in your academic details, confirm your ₹200 registration fee, and secure your place in the upcoming 3-month full-stack internship.
          </p>
        </div>

        {/* Existing Confirmed Alert Box */}
        {existingConfirmedMsg && (
          <div className="mb-8 p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-left space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <div>
                <h4 className="text-base font-extrabold text-emerald-900">
                  You are already enrolled &amp; confirmed for Batch 1!
                </h4>
                <p className="text-xs text-emerald-700">
                  Registration ID: <strong>{existingConfirmedMsg.registration_id}</strong>
                </p>
              </div>
            </div>
            <p className="text-xs text-emerald-800">
              Your ₹200 registration fee was already verified. Please join the official WhatsApp group for orientation schedules.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <a
                href={existingConfirmedMsg.whatsapp_group_url || whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                Join Batch 1 WhatsApp Group
              </a>
              <a
                href={existingConfirmedMsg.dashboard_url || '#'}
                className="px-4 py-2 bg-white text-slate-800 border border-slate-300 font-bold text-xs rounded-xl inline-flex items-center gap-2"
              >
                Go to User Dashboard
              </a>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-slate-50 p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-soft text-left">
          
          {/* Price Summary Header */}
          <div className="p-4 mb-8 rounded-2xl bg-white border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Internship Program
              </span>
              <h3 className="text-base font-extrabold text-slate-900">
                Skyrovix Batch 1 – {formData.duration || '3 Months'} Full Stack Development ({formData.duration === '6 Months' ? '50 Tasks' : '25 Tasks'})
              </h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-emerald-700 block">₹0 Internship Fee</span>
              <span className="text-xl font-black text-slate-900">₹200 Registration Fee Only</span>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Internship Duration / Track Selection */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Select Internship Track &amp; Duration <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div
                  onClick={() => setFormData(prev => ({ ...prev, duration: '3 Months' }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                    formData.duration === '3 Months'
                      ? 'border-sky-600 bg-sky-50/70 shadow-xs ring-1 ring-sky-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value="3 Months"
                    checked={formData.duration === '3 Months'}
                    onChange={handleChange}
                    className="mt-1 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">3 Months Track</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200">
                        25 TASKS
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      25 Sprint Projects (Tasks #01–#25). Frontend foundations, APIs &amp; full stack architecture.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setFormData(prev => ({ ...prev, duration: '6 Months' }))}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                    formData.duration === '6 Months'
                      ? 'border-sky-600 bg-sky-50/70 shadow-xs ring-1 ring-sky-500'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="duration"
                    value="6 Months"
                    checked={formData.duration === '6 Months'}
                    onChange={handleChange}
                    className="mt-1 text-sky-600 focus:ring-sky-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm">6 Months Track</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        50 TASKS
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1">
                      50 Sprint Projects (Tasks #01–#50). Comprehensive enterprise systems, microservices &amp; capstone platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@example.com"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            {/* Row 2: Account Password & Mobile Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Dashboard Password <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-sky-600 font-semibold normal-case">For User Dashboard Login</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password (min. 6 chars)"
                    required
                    minLength={6}
                    className="w-full px-4 pr-10 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  You will use this email &amp; password to log in to your user dashboard.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Mobile Number (WhatsApp) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    +91
                  </span>
                  <input
                    type="tel"
                    name="mobile"
                    maxLength={10}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="9876543210"
                    required
                    className="w-full pl-12 pr-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Required for official WhatsApp orientation group.
                </p>
              </div>
            </div>

            {/* Row 3: College & Degree */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  College / Institute Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. National Institute of Technology"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Degree <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  placeholder="e.g. B.Tech / B.E / BCA / MCA"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            {/* Row 4: Department & Year of Study */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Department / Branch <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Computer Science & Engineering"
                  required
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Year of Study <span className="text-rose-500">*</span>
                </label>
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Recent Graduate">Recent Graduate</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Row 5: City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bangalore / Chennai / Pune"
                required
                className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
              />
            </div>

            {/* Row 5: GitHub & LinkedIn Profiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  GitHub Profile URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleChange}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  LinkedIn Profile URL <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-3 text-sm rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                />
              </div>
            </div>

            {/* Row 6: Skill Level Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Current Technical Skill Level <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <label
                    key={level}
                    className={`flex flex-col items-center justify-center p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.skillLevel === level
                        ? 'bg-sky-50 border-sky-600 text-sky-950 font-bold ring-2 ring-sky-200 shadow-sm'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="skillLevel"
                      value={level}
                      checked={formData.skillLevel === level}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-xs font-bold">{level}</span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      {level === 'Beginner' ? 'New to web dev' : level === 'Intermediate' ? 'Built simple apps' : 'Know JS/React'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Checkbox: Agreement */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreedTerms"
                  checked={formData.agreedTerms}
                  onChange={handleChange}
                  className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500 border-slate-300 mt-1 shrink-0"
                />
                <span className="text-xs text-slate-600 leading-relaxed font-medium">
                  I agree to the internship terms and guidelines. I understand that the internship fee is ₹0 and the one-time ₹200 fee covers registration and platform onboarding.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                id="submit-registration-btn"
                className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 hover:from-sky-700 hover:to-blue-900 text-white rounded-xl font-extrabold text-base shadow-lg shadow-sky-700/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 disabled:opacity-75 disabled:pointer-events-none"
              >
                {loading ? (
                  <span>Processing Application...</span>
                ) : (
                  <>
                    <span>CONTINUE TO REGISTRATION – PAY ₹200</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Payments processed securely via Cashfree Payments Gateway</span>
            </p>

          </form>

        </div>

      </div>
    </section>
  );
};
