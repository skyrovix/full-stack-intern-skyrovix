import React from 'react';
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

export const GitHubWorkflow = ({ onOpenApply }) => {
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
    <section id="github" className="py-20 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-sky-400 text-xs font-bold uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>INDUSTRY STANDARD WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Professional GitHub Workflow
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Software engineering teams collaborate on GitHub every single day. Skyrovix Batch 1 enforces genuine git practices so your profile stands out to tech hiring teams.
          </p>
        </div>

        {/* 8 Workflow Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14 text-left">
          {workflowItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-950 transition-all duration-200 shadow-lg group"
              >
                <div className="p-3 rounded-xl bg-slate-900 text-sky-400 border border-slate-800 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Big CTA Banner */}
        <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 border border-sky-400/30 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-left">
          <div className="space-y-2 max-w-2xl">
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              BUILD YOUR GITHUB PORTFOLIO
            </h3>
            <p className="text-sm text-sky-100 font-medium leading-relaxed">
              Exit the internship with a thriving green commit calendar, clean repositories, and documented full-stack applications ready to present to engineering interviewers.
            </p>
          </div>

          <button
            onClick={onOpenApply}
            className="shrink-0 px-8 py-4 rounded-xl bg-white text-slate-950 font-extrabold text-sm hover:bg-sky-50 shadow-xl transition-all transform hover:scale-105"
          >
            <span>START COMMITTING TODAY</span>
          </button>
        </div>

      </div>
    </section>
  );
};
