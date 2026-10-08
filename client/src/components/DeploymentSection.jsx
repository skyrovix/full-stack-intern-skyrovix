import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
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
import { SpotlightCard } from './SpotlightCard';

export const DeploymentSection = ({ onOpenApply }) => {
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

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
    <section id="deployment" className="py-20 md:py-24 bg-white border-t border-[rgba(25,40,55,0.08)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading with scroll reveal */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#00B978]/10 text-[#00B978] text-xs font-bold uppercase tracking-wider border border-[#00B978]/25">
            <Rocket className="w-3.5 h-3.5 text-[#00B978]" />
            <span>FULL STACK DEVOPS &amp; HOSTING</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-[#192837] tracking-tight">
            Production Deployment Workflow
          </h2>
          <p className="text-[#4C5B6D] text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Don't leave your projects trapped on localhost. In Skyrovix Batch 1, every significant project is built, connected, and deployed to live production URLs.
          </p>
        </motion.div>

        {/* 4 Steps Banner: BUILD -> TEST -> DEPLOY -> SHARE with SpotlightCard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {steps.map((st, i) => (
            <motion.div
              key={st.num}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: easeOutQuart }}
            >
              <SpotlightCard
                spotlightColor="rgba(8, 127, 193, 0.12)"
                hoverY={-5}
                className="relative p-6 sm:p-7 rounded-[24px] bg-[#F7F9FC] border border-[rgba(25,40,55,0.08)] text-left shadow-[0_8px_30px_rgba(25,40,55,0.03)] group hover:bg-white hover:border-[#087FC1]/40 h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-2xl font-black text-[#087FC1] group-hover:scale-110 transition-transform">
                    {st.num}
                  </span>
                  <span className="text-[11px] font-extrabold text-[#4C5B6D]/80 tracking-widest uppercase">
                    STEP {i + 1}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-black text-[#192837] mb-1 tracking-wide">
                  {st.title}
                </h3>
                <p className="text-xs text-[#4C5B6D] font-normal leading-relaxed">
                  {st.desc}
                </p>
              </SpotlightCard>
            </motion.div>
          ))}
        </div>

        {/* Dual Layout: Left Skills / Right Live Deployment Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          
          {/* Left Column: What students will learn */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -24, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: easeOutQuart }}
            className="lg:col-span-6 space-y-6"
          >
            <div>
              <h3 className="font-heading text-2xl font-black text-[#192837] mb-2">
                What You Will Learn in Deployment:
              </h3>
              <p className="text-sm text-[#4C5B6D]">
                Companies evaluate candidates who understand how modern web applications operate in production environments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deploymentSkills.map((skill, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2.5 p-3.5 rounded-[18px] bg-[#F7F9FC] border border-[rgba(25,40,55,0.08)] hover:border-[#087FC1]/30 transition-colors">
                  <CheckCircle2 className="w-4 h-4 text-[#00B978] shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-[#192837] leading-snug">
                    {skill}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 sm:p-5 rounded-[20px] bg-[#087FC1]/10 border border-[#087FC1]/20 text-xs text-[#192837] font-semibold flex items-center gap-3">
              <Cloud className="w-5 h-5 text-[#087FC1] shrink-0" />
              <span>
                Learn industry platforms: Vercel for frontend React, Render/Railway for Node servers, and Supabase/Neon for managed SQL databases.
              </span>
            </div>
          </motion.div>

          {/* Right Column: Visual Showcase of GitHub Repo + Live URL with SpotlightCard */}
          <motion.div 
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 24, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, ease: easeOutQuart }}
            className="lg:col-span-6"
          >
            <SpotlightCard
              spotlightColor="rgba(24, 199, 232, 0.15)"
              borderColor="rgba(24, 199, 232, 0.35)"
              hoverY={-4}
              className="p-6 md:p-8 rounded-[24px] bg-gradient-to-br from-[#071426] to-[#040d1a] text-white border border-[#087FC1]/30 shadow-[0_20px_50px_rgba(7,20,38,0.30)] space-y-5"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#00B978]" />
                  <span className="text-xs font-bold text-slate-300">Production Application Status</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00B978]/20 text-[#00B978] border border-[#00B978]/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B978] animate-pulse"></span>
                  OPERATIONAL 100%
                </span>
              </div>

              {/* Box 1: GitHub Repository */}
              <div className="p-4 sm:p-5 rounded-[18px] bg-[#030912] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono text-[#18C7E8] font-semibold">
                    <GitBranch className="w-3.5 h-3.5" />
                    github.com/skyrovix-intern/fullstack-ecommerce
                  </span>
                  <span className="text-[#00B978] font-bold text-[10px] uppercase">Public Repo</span>
                </div>
                <p className="text-xs text-slate-300">
                  Clean commit history • Branch protection • Detailed README with architecture diagrams and API specs.
                </p>
              </div>

              {/* Box 2: Live Deployment URL */}
              <div className="p-4 sm:p-5 rounded-[18px] bg-[#030912] border border-[#00B978]/30 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 font-mono text-[#00B978] font-semibold">
                    <Globe className="w-3.5 h-3.5" />
                    https://skyrovix-b1-app.vercel.app
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00B978]/20 text-[#00B978]">
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
                  <CheckCircle2 className="w-4 h-4 text-[#18C7E8]" />
                  GitHub Repository + Live URL Required
                </span>
              </div>
            </SpotlightCard>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
