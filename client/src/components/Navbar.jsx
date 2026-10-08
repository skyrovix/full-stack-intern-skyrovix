import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight, LogIn, ChevronDown } from 'lucide-react';
import navLogo from '../assets/top nav bar logo.png';
import { WhatsAppIcon } from './BrandIcons';

export const Navbar = ({ onOpenApply, onOpenLogin, onOpenAdmin, onOpenGuide, onOpenCertificate, whatsappUrl }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const primaryLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Curriculum', href: '#curriculum' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Certificate', href: '/certificate' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const secondaryLinks = [
    { label: 'Student Guide', href: '/guide' },
    { label: 'Deployment', href: '#deployment' },
    { label: 'Git Workflow', href: '#github' },
  ];

  const allNavLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Student Guide', href: '/guide' },
    { label: 'Certificate', href: '/certificate' },
    { label: 'Curriculum', href: '#curriculum' },
    { label: 'Roadmap', href: '#roadmap' },
    { label: 'Deployment', href: '#deployment' },
    { label: 'Git Workflow', href: '#github' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setMoreOpen(false);

    if (href === '/certificate' || href === '#certificate' || href === '/verify') {
      if (onOpenCertificate) {
        onOpenCertificate();
      } else {
        try {
          window.history.pushState({}, '', '/certificate');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err) {
          window.location.href = '/certificate';
        }
      }
      return;
    }

    if (href === '/guide' || href === '#guide') {
      if (onOpenGuide) {
        onOpenGuide();
      } else {
        try {
          window.history.pushState({}, '', '/guide');
          window.dispatchEvent(new PopStateEvent('popstate'));
        } catch (err) {
          window.location.href = '/guide';
        }
      }
      return;
    }

    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const officialWhatsApp = whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP';

  return (
    <header className="sticky top-0 z-40 w-full max-w-full">
      {/* 5. TOP ANNOUNCEMENT BAR (Slim Premium Height: 34-38px, Deep Navy #071426) */}
      <div className="w-full bg-[#071426] text-white text-[11px] sm:text-xs font-medium h-[36px] flex items-center px-4 border-b border-slate-800/80 transition-colors">
        <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 truncate">
            {/* Glowing animated pulsing cyan dot */}
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#18C7E8] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#18C7E8] shadow-[0_0_8px_#18C7E8]"></span>
            </span>
            <span className="truncate tracking-wide text-slate-200">
              <strong className="text-[#18C7E8] font-bold uppercase tracking-wider">BATCH 1 ADMISSIONS OPEN:</strong>{' '}
              Starts within the next 10 days.{' '}
              <span className="text-slate-300">₹0 Internship Fee</span> •{' '}
              <span className="text-[#00B978] font-semibold">₹200 Registration Fee Only.</span>
            </span>
          </div>

          <a
            href={officialWhatsApp}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden sm:inline-flex items-center gap-1.5 text-[#18C7E8] hover:text-white font-semibold text-[11px] transition-colors shrink-0 whitespace-nowrap"
          >
            <span>Join Official WhatsApp</span>
            <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>

      {/* 6 & 7. NAVBAR CONTAINER & STYLE */}
      <nav 
        className={`w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-[18px] border-b border-[rgba(25,40,55,0.08)] shadow-[0_8px_30px_rgba(25,40,55,0.06)]' 
            : 'bg-[rgba(255,255,255,0.88)] backdrop-blur-[18px] border-b border-[rgba(25,40,55,0.08)]'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-5 py-3 md:py-3.5">
          <div className="flex items-center justify-between gap-4">
            
            {/* LEFT: SKYROVIX Logo */}
            <div className="flex items-center gap-3 shrink-0">
              <a href="#" className="flex items-center gap-2 group focus:outline-none">
                <img 
                  src={navLogo} 
                  alt="Skyrovix" 
                  className="h-9 md:h-11 w-auto max-h-11 object-contain transition-transform duration-200 group-hover:scale-[1.02]" 
                />
              </a>
            </div>

            {/* CENTER: Navigation Links */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
              {primaryLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="px-3 py-1.5 rounded-lg text-[14px] font-medium text-[#405066] hover:text-[#7342E2] hover:bg-[#7342E2]/5 transition-colors duration-250 whitespace-nowrap"
                >
                  {link.label}
                </a>
              ))}

              {/* Desktop More Dropdown for Secondary Links */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setMoreOpen(!moreOpen)}
                  onMouseEnter={() => setMoreOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[14px] font-medium text-[#405066] hover:text-[#7342E2] hover:bg-[#7342E2]/5 transition-colors duration-250 whitespace-nowrap"
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-250 ${moreOpen ? 'rotate-180 text-[#7342E2]' : ''}`} />
                </button>

                {moreOpen && (
                  <div
                    onMouseLeave={() => setMoreOpen(false)}
                    className="absolute left-0 mt-2 w-48 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl border border-[rgba(25,40,55,0.08)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    {secondaryLinks.map((link) => (
                      <a
                        key={link.label}
                        href={link.href}
                        onClick={(e) => {
                          setMoreOpen(false);
                          handleNavClick(e, link.href);
                        }}
                        className="block px-4 py-2 text-[13px] font-medium text-[#405066] hover:text-[#7342E2] hover:bg-[#7342E2]/5 transition-colors"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Action CTAs */}
            <div className="hidden lg:flex items-center space-x-2.5 shrink-0">
              {/* Login Button */}
              <button
                onClick={onOpenLogin}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 text-[#192837] hover:text-[#7342E2] bg-white hover:bg-[#F2F2EE] border border-[rgba(25,40,55,0.12)] rounded-full transition-all shadow-xs whitespace-nowrap cursor-pointer"
                title="Login to Skyrovix Dashboard"
              >
                <LogIn className="w-3.5 h-3.5 text-[#087FC1]" />
                <span>Login</span>
              </button>

              {/* WhatsApp Button */}
              <a
                href={officialWhatsApp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 text-[#123F35] bg-[#ECFFF8] hover:bg-[#d8fced] border border-[#35D39A] rounded-full transition-all whitespace-nowrap shadow-xs cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                <span className="hidden xl:inline">WhatsApp</span>
              </a>

              {/* 8. NAVBAR CTA (APPLY FOR BATCH 1) */}
              <button
                onClick={onOpenApply}
                className="group inline-flex items-center gap-1.5 text-xs font-bold px-5 py-2.5 text-white rounded-full transition-all duration-200 cursor-pointer shadow-[0_8px_20px_rgba(8,127,193,0.22)] hover:shadow-[0_10px_30px_rgba(8,127,193,0.32)] hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #0788C7, #2348B8)'
                }}
              >
                <span>APPLY FOR BATCH 1</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* Mobile / Tablet Header Controls */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <button
                onClick={onOpenApply}
                className="text-xs font-bold px-3.5 py-1.5 text-white rounded-full shadow-sm whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, #0788C7, #2348B8)' }}
              >
                Apply (₹200)
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* 21. MOBILE NAVIGATION DRAWER (Framer Motion AnimatePresence, slide from right) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#192837]/35 backdrop-blur-[4px]"
            />

            {/* Right-sliding drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="absolute top-0 right-0 w-[min(88vw,360px)] h-[100dvh] bg-white shadow-[-12px_0_48px_rgba(25,40,55,0.18)] flex flex-col justify-between p-6 overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <img src={navLogo} alt="Skyrovix" className="h-8 w-auto object-contain" />
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Staggered Nav Links */}
                <div className="py-4 space-y-1">
                  {allNavLinks.map((link, idx) => (
                    <motion.a
                      key={link.label}
                      href={link.href}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 + 0.05 }}
                      onClick={(e) => handleNavClick(e, link.href)}
                      className="block px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#192837] hover:text-[#7342E2] hover:bg-[#7342E2]/5 transition-colors"
                    >
                      {link.label}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Drawer Footer Actions */}
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenApply();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 text-white rounded-2xl font-extrabold text-sm shadow-md"
                  style={{ background: 'linear-gradient(135deg, #0788C7, #2348B8)' }}
                >
                  <span>APPLY FOR BATCH 1 — ₹200</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={officialWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-[#ECFFF8] text-[#123F35] border border-[#35D39A] rounded-2xl font-bold text-xs"
                >
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>JOIN OFFICIAL WHATSAPP GROUP</span>
                </a>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  className="w-full py-2.5 text-xs font-bold text-[#192837] bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#087FC1]" />
                  <span>Login to Dashboard</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};
