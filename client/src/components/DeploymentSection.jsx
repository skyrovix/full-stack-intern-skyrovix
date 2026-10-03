import React from 'react';
import { 
  Rocket, 
  ExternalLink, 
  CheckCircle2, 
  Terminal, 
  Globe, 
  ShieldCheck, 
  ArrowRight,
  GitBranch,
  Server,
  Cloud
} from 'lucide-react';

export const DeploymentSection = ({ onOpenApply }) => {
  const steps = [
    { num: '01', title: 'BUILD', desc: 'Optimized production bundles with Vite & Docker containerization' },
    { num: '02', title: 'TEST', desc: 'API testing, environment secrets validation & database connection health' },
    { num: '03', title: 'DEPLOY', desc: 'Continuous integration and live hosting on Vercel, Render & Railway' },
    { num: '04', title: 'SHARE', desc: 'Live public URLs + GitHub repository showcased on resume and LinkedIn' },
  ];

  const deploymentSkills = [
    'Production builds & bundle size optimization',
    'Environment variables (.env) management & secret masking',
    'Cross-Origin Resource Sharing (CORS) & API configuration',
    'Frontend deployment (Vercel, Netlify, Cloudflare Pages)',
    'Backend deployment (Node/Express on Render, Railway)',
    'Production Database connection (PostgreSQL / MySQL connection pools)',
    'Deployment debugging, build error resolution & log auditing',
    'Live URL testing, SSL certificate setup & custom domains'
  ];

  return (
    <section id="deployment" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider border border-emerald-200">
            <Rocket className="w-3.5 h-3.5 text-emerald-600" />
            <span>FULL STACK DEVOPS &amp; HOSTING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Production Deployment Workflow
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Don't leave your projects trapped on localhost. In Skyrovix Batch 1, every significant project is built, connected, and deployed to live production URLs.
          </p>
        </div>

        {/* 4 Steps Banner: BUILD -> TEST -> DEPLOY -> SHARE */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {steps.map((st, i) => (
            <div
              key={st.num}
              className="relative p-6 rounded-2xl bg-slate-50 border border-slate-200/90 text-left shadow-soft group hover:bg-sky-50/60 hover:border-sky-300 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-black text-sky-600 group-hover:scale-110 transition-transform">
                  {st.num}
                </span>
                <span className="text-xs font-extrabold text-slate-800 tracking-widest">
                  STEP {i + 1}
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-1 tracking-wide">
                {st.title}
              </h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Dual Layout: Left Skills / Right Live Deployment Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Left Column: What students will learn */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
                What You Will Learn in Deployment:
              </h3>
              <p className="text-sm text-slate-600">
                Companies evaluate candidates who understand how modern web applications operate in production environments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deploymentSkills.map((skill, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-slate-800 leading-snug">
                    {skill}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900 font-semibold flex items-center gap-3">
              <Cloud className="w-5 h-5 text-sky-600 shrink-0" />
              <span>
                Learn industry platforms: Vercel for frontend React, Render/Railway for Node servers, and Supabase/Neon for managed SQL databases.
              </span>
            </div>
          </div>

          {/* Right Column: Visual Showcase of GitHub Repo + Live URL */}
          <div className="lg:col-span-6">
            <div className="p-6 md:p-8 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-slate-300">Production Application Status</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  OPERATIONAL 100%
                </span>
              </div>

              {/* Box 1: GitHub Repository */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono text-sky-400 font-semibold">
                    <GitBranch className="w-3.5 h-3.5" />
                    github.com/skyrovix-intern/fullstack-ecommerce
                  </span>
                  <span className="text-emerald-400">Public Repo</span>
                </div>
                <p className="text-xs text-slate-300">
                  Clean commit history • Branch protection • Detailed README with architecture diagrams and API specs.
                </p>
              </div>

              {/* Box 2: Live Deployment URL */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/60 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono text-emerald-400 font-semibold">
                    <Globe className="w-3.5 h-3.5" />
                    https://skyrovix-b1-app.vercel.app
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                    HTTPS Live
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Global CDN distribution • Automatic HTTPS • Cashfree Payment Gateway connected with live server callbacks.
                </p>
              </div>

              {/* Target Summary */}
              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400">Internship Requirement:</span>
                <span className="font-bold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  GitHub Repository + Live URL Required
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
