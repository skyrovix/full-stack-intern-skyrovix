import React, { useState } from 'react';
import { Menu, X, ArrowRight, LogIn, ChevronDown } from 'lucide-react';
import navLogo from '../assets/top nav bar logo.png';
import { WhatsAppIcon } from './BrandIcons';

export const Navbar = ({ onOpenApply, onOpenLogin, onOpenAdmin, onOpenGuide, onOpenCertificate, whatsappUrl }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 w-full max-w-full glass-nav border-b border-slate-200/90 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
      {/* Top Banner Notice */}
      <div className="w-full bg-gradient-to-r from-slate-950 via-sky-950 to-slate-900 text-white text-[11px] sm:text-xs font-medium py-2 px-3 sm:px-4 tracking-wide border-b border-slate-800">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 truncate">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span className="truncate">
              <strong className="text-cyan-300 font-bold uppercase tracking-wider">Batch 1 Admissions Open:</strong> Starts within the next 10 days. ₹0 Internship Fee • ₹200 Registration Fee Only.
            </span>
          </div>

          <a
            href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-cyan-300 hover:text-white font-semibold text-[11px] transition-colors shrink-0 whitespace-nowrap"
          >
            <span>Join Official WhatsApp</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18 py-2 md:py-3 gap-2">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <a href="#" className="flex items-center gap-2 group">
              <img src={navLogo} alt="Skyrovix" className="h-9 md:h-11 w-auto max-h-11 object-contain" />
            </a>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-2">
            {primaryLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="px-2.5 xl:px-3 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-slate-100/80 transition-all whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}

            {/* Desktop More dropdown for secondary links on smaller desktop screens */}
            <div className="relative group">
              <button
                type="button"
                onClick={() => setMoreOpen(!moreOpen)}
                onMouseEnter={() => setMoreOpen(true)}
                className="flex items-center gap-1 px-2 xl:px-2.5 py-1.5 rounded-lg text-xs xl:text-[13px] font-semibold text-slate-600 hover:text-sky-700 hover:bg-slate-100/80 transition-all whitespace-nowrap"
              >
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${moreOpen ? 'rotate-180 text-sky-600' : ''}`} />
              </button>

              {moreOpen && (
                <div
                  onMouseLeave={() => setMoreOpen(false)}
                  className="absolute left-0 mt-1.5 w-44 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  {secondaryLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={(e) => {
                        setMoreOpen(false);
                        handleNavClick(e, link.href);
                      }}
                      className="block px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-sky-700 hover:bg-sky-50/70 transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-2.5 shrink-0">
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-2 text-slate-700 hover:text-sky-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/90 rounded-xl transition-all shadow-2xs whitespace-nowrap"
              title="Login to User Dashboard"
            >
              <LogIn className="w-3.5 h-3.5 text-sky-600" />
              <span>Login</span>
            </button>

            <a
              href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 xl:px-3 py-2 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-xl transition-all whitespace-nowrap shadow-2xs"
            >
              <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
              <span className="hidden xl:inline">WhatsApp</span>
            </a>

            <button
              onClick={onOpenApply}
              className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 xl:px-4 py-2 bg-gradient-to-r from-sky-600 via-sky-700 to-blue-800 hover:from-sky-700 hover:to-blue-900 text-white rounded-xl shadow-sm hover:shadow transition-all whitespace-nowrap transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span className="hidden xl:inline">APPLY FOR BATCH 1</span>
              <span className="xl:hidden">Apply (₹200)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile & Tablet Menu Button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={onOpenApply}
              className="text-xs font-bold px-3 py-1.5 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-lg shadow-sm whitespace-nowrap"
            >
              Apply (₹200)
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-1.5 pb-3 border-b border-slate-100">
            {allNavLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-xs font-semibold text-slate-700 hover:text-sky-600 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenApply();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-sky-600 to-blue-700 text-white rounded-xl font-extrabold text-sm shadow"
            >
              <span>APPLY FOR BATCH 1 — ₹200</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-xl font-bold text-xs"
            >
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              <span>JOIN OFFICIAL WHATSAPP GROUP</span>
            </a>

            <div className="pt-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
                className="w-full py-2.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5 text-sky-600" />
                <span>Login</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
