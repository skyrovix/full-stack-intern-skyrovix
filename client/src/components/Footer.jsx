import React from 'react';
import { 
  ArrowRight, 
  Globe, 
  MessageCircle, 
  ShieldCheck, 
  Heart,
  Terminal,
  ExternalLink
} from 'lucide-react';
import footerLogo from '../assets/top nav bar logo.png';
import { WhatsAppIcon, InstagramIcon } from './BrandIcons';

export const Footer = ({ onOpenApply, onOpenDashboard, onOpenLogin, onOpenAdmin, onOpenCertificate, whatsappUrl }) => {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-900 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Pre-Footer Final Call to Action */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 border border-sky-800/80 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              ADMISSIONS CLOSING SOON
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              START YOUR FULL STACK JOURNEY WITH SKYROVIX
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Join Batch 1 today. Build 50+ practical projects, deploy live full-stack web applications, and build your technical career foundation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenApply}
              id="footer-apply-btn"
              className="px-8 py-4 bg-white text-slate-950 hover:bg-sky-50 font-black text-sm rounded-xl shadow-lg transition-all transform hover:scale-105"
            >
              APPLY FOR BATCH 1 (₹200)
            </button>
            <a
              href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pt-4">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-white px-3.5 py-1.5 rounded-2xl w-fit inline-flex items-center shadow-sm">
                <img src={footerLogo} alt="Skyrovix" className="h-8 md:h-9 w-auto object-contain" />
              </div>
            </div>
            
            <p className="text-sm font-semibold text-sky-400 tracking-wider">
              Innovation • Technology • Future
            </p>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Skyrovix Technologies empowers aspiring engineers through immersive, project-driven software internships. Dedicated to building real applications with production code standards.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://skyrovix.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-sky-600 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="Official Website"
              >
                <Globe className="w-4 h-4" />
              </a>

              <a
                href="https://linkedin.com/company/skyrovix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-sky-600 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.64c-.88 0-1.6.72-1.6 1.6s.72 1.6 1.6 1.6 1.6-.72 1.6-1.6-.72-1.6-1.6-1.6Z" />
                </svg>
              </a>

              <a
                href="https://instagram.com/skyrovix"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:via-rose-500 hover:to-purple-600 border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="Instagram"
              >
                <InstagramIcon className="w-4 h-4 fill-current" />
              </a>

              <a
                href={whatsappUrl || 'https://chat.whatsapp.com/BIE2gLWrWtb9AGYpL9o2yP'}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-[#25D366] border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all shadow-sm"
                title="WhatsApp Group"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="#overview" className="hover:text-white transition-colors">Program Overview</a></li>
              <li><a href="#curriculum" className="hover:text-white transition-colors">Curriculum Pillars</a></li>
              <li><a href="#roadmap" className="hover:text-white transition-colors">3-Month Roadmap</a></li>
              <li><a href="#deployment" className="hover:text-white transition-colors">Deployment &amp; DevOps</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Fee Transparency</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Program Details */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Batch 1 Program
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Mode: 100% Virtual Remote</li>
              <li>Duration: 3 Months</li>
              <li>Target: 50+ Projects</li>
              <li>Internship Fee: ₹0 Free</li>
              <li>Registration Fee: ₹200 Only</li>
              <li>Start: Next 10 Days</li>
              <li>Status: Admissions Open</li>
            </ul>
          </div>

          {/* Portals & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Portals &amp; Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={onOpenLogin || onOpenDashboard} className="hover:text-sky-400 transition-colors text-left">
                  User Dashboard Login
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenCertificate || (() => {
                    window.history.pushState({}, '', '/certificate');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                  })} 
                  className="hover:text-sky-400 transition-colors text-left"
                >
                  Certificate &amp; Verification
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="hover:text-sky-400 transition-colors text-left">
                  Admin Console
                </button>
              </li>
              <li><a href="#terms" className="hover:text-white transition-colors">Terms &amp; Conditions</a></li>
              <li><a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#refund" className="hover:text-white transition-colors">Payment Guidelines</a></li>
              <li><a href="mailto:support@skyrovix.com" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Security Strip */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SKYROVIX Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Cashfree Verified Merchant Integration
            </span>
            <span>Made with excellence for aspiring software engineers.</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
