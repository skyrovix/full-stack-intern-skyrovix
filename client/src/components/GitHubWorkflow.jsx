import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  FileText, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  FolderGit2,
  Terminal
} from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { MagneticButton } from './MagneticButton';

export const GitHubWorkflow = ({ onOpenApply }) => {
  const shouldReduceMotion = useReducedMotion();
  const easeOutQuart = [0.16, 1, 0.3, 1];

  const workflowItems = [
    {
      icon: Terminal,
      title: 'Git Version Control',
      desc: 'Command line mastery: git clone, checkout, add, commit, push, pull, and conflict resolution.'
    },
    {
      icon: FolderGit2,
      title: 'Repositories',
      desc: 'Clean repository structures, standard .gitignore patterns, and branch protection rules.'
    },
    {
      icon: GitBranch,
      title: 'Feature Branching',
      desc: 'Industry standard git-flow (feature/login, fix/db-connection, release/v1.0).'
    },
    {
      icon: GitCommit,
      title: 'Conventional Commits',
      desc: 'Descriptive commit guidelines (feat, fix, docs, refactor) that hiring managers respect.'
    },
    {
      icon: GitPullRequest,
      title: 'Pull Requests & Reviews',
      desc: 'Drafting PRs, code diff analysis, peer reviews, comments, and clean merge strategies.'
    },
    {
      icon: FileText,
      title: 'Professional README',
      desc: 'Tech stack badges, architecture diagrams, installation guides, and live demo badges.'
    },
    {
      icon: BookOpen,
      title: 'Project Documentation',
      desc: 'API endpoint schemas, request/response examples, and deployment instructions.'
    },
    {
      icon: CheckCircle2,
      title: 'GitHub Contribution Grid',
      desc: 'Consistent commit streak and public activity proving daily hands-on coding dedication.'
    }
  ];

  return (
    <section id="github" className="py-20 md:py-24 bg-[#071426] text-white relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#18C7E8]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#7342E2]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header with scroll reveal */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: easeOutQuart }}
          className="text-center max-w-3xl mx-auto mb-14 space-y-3"
        >
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#087FC1]/20 border border-[#087FC1]/40 text-[#18C7E8] text-xs font-bold uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5 text-[#18C7E8]" />
            <span>INDUSTRY STANDARD WORKFLOW</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Professional GitHub Workflow
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Software engineering teams collaborate on GitHub every single day. Skyrovix Batch 1 enforces genuine git practices so your profile stands out to tech hiring teams.
          </p>
        </motion.div>

        {/* 8 Workflow Grid Cards with SpotlightCard & staggered scroll reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14 text-left">
          {workflowItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24, filter: 'blur(4px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.5, delay: idx * 0.06, ease: easeOutQuart }}
              >
                <SpotlightCard
                  spotlightColor="rgba(24, 199, 232, 0.12)"
                  borderColor="rgba(24, 199, 232, 0.3)"
                  hoverY={-5}
                  className="p-5 sm:p-6 rounded-[20px] bg-[#030912]/80 border border-slate-800 hover:border-[#18C7E8]/50 shadow-lg group h-full"
                >
                  <div className="p-3 rounded-2xl bg-slate-900 text-[#18C7E8] border border-slate-800 w-fit mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-base font-bold text-white mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* Big CTA Banner */}
        <motion.div 
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 28, filter: 'blur(4px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: easeOutQuart }}
          className="p-8 md:p-12 rounded-[24px] bg-gradient-to-r from-[#0b1c34] via-[#0e274a] to-[#12163b] border border-[#087FC1]/30 text-white shadow-[0_20px_50px_rgba(7,20,38,0.40)] flex flex-col md:flex-row items-center justify-between gap-6 text-left"
        >
          <div className="space-y-2 max-w-2xl">
            <h3 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
              BUILD YOUR GITHUB PORTFOLIO
            </h3>
            <p className="text-sm text-slate-300 font-normal leading-relaxed">
              Exit the internship with a thriving green commit calendar, clean repositories, and documented full-stack applications ready to present to engineering interviewers.
            </p>
          </div>

          <MagneticButton>
            <button
              onClick={onOpenApply}
              className="shrink-0 px-8 py-4 rounded-[20px] text-white font-extrabold text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #087FC1, #2447B8)',
                boxShadow: '0 12px 30px rgba(8,127,193,0.35)'
              }}
            >
              <span>START COMMITTING TODAY</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </MagneticButton>
        </motion.div>

      </div>
    </section>
  );
};
