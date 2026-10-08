import React, { useState } from 'react';
import { 
  Compass, 
  Terminal, 
  Cpu, 
  Database, 
  Server, 
  Layout, 
  Globe, 
  GitBranch, 
  Cloud, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  ListChecks, 
  BookOpen, 
  ChevronRight, 
  FileText,
  Lock,
  Workflow,
  ArrowRight,
  Info,
  Award,
  Printer,
  ChevronDown
} from 'lucide-react';

export const StudentGuideView = ({ onOpenApply, isEmbeddedInDashboard = false }) => {
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const navAnchors = [
    { id: 'guide-part-a', label: 'Part A: Big Picture' },
    { id: 'guide-part-b', label: 'Part B: AI Tools & Editors' },
    { id: 'guide-part-c', label: 'Part C: Git & GitHub' },
    { id: 'guide-part-d', label: 'Part D: Frontend' },
    { id: 'guide-part-e', label: 'Part E: Backend' },
    { id: 'guide-part-f', label: 'Part F: Database & Supabase' },
    { id: 'guide-part-g', label: 'Part G: Firebase' },
    { id: 'guide-part-h', label: 'Part H: API Integration' },
    { id: 'guide-part-i', label: 'Part I: Vercel' },
    { id: 'guide-part-j', label: 'Part J: Domain & DNS' },
    { id: 'guide-part-k', label: 'Part K: Full-Stack Project' },
    { id: 'guide-part-l', label: 'Part L: Weekly Schedule' },
    { id: 'guide-part-m', label: 'Part M: Daily Workflow' },
    { id: 'guide-part-n', label: 'Part N: Security' },
    { id: 'guide-part-o', label: 'Part O: Final Assessment' },
  ];

  return (
    <div className={`w-full text-slate-800 dark:text-slate-100 ${isEmbeddedInDashboard ? 'p-0' : 'max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8'}`}>
      
      {/* ========================================================
          DOCUMENT HEADER & METADATA BANNER
      ======================================================== */}
      <header className="rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 text-left">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>SKYROVIX OFFICIAL CURRICULUM</span>
            </div>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 border border-white/10 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save Guide</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            SKYROVIX<br className="sm:hidden" /> 3-Month Full Stack Development Internship
          </h1>
          
          <p className="text-base sm:text-xl font-semibold text-sky-300">
            Detailed Student Guide — AI Tools → Code → Backend → Database → GitHub → Vercel → Domain
          </p>

          <p className="text-sm font-bold text-slate-300 tracking-wide">
            Learn • Build • Test • Deploy • Showcase
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Duration</span>
              <strong className="text-sm sm:text-base font-bold text-white">3 Months</strong>
            </div>
            <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-semibold">Mode</span>
              <strong className="text-sm sm:text-base font-bold text-white">100% Virtual / Batch-based</strong>
            </div>
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <span className="text-[11px] uppercase tracking-wider text-emerald-400 block font-semibold">Internship Fee</span>
              <strong className="text-sm sm:text-base font-bold text-emerald-300">₹0 Free Tuition</strong>
            </div>
            <div className="p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl">
              <span className="text-[11px] uppercase tracking-wider text-sky-400 block font-semibold">Registration Fee</span>
              <strong className="text-sm sm:text-base font-bold text-sky-300">₹200 only</strong>
            </div>
          </div>

          {/* How to use this guide box */}
          <div className="p-4 bg-sky-900/40 border border-sky-500/30 rounded-2xl text-xs sm:text-sm text-sky-100 leading-relaxed font-medium">
            <strong className="text-sky-300 font-bold uppercase tracking-wider block mb-1">How to use this guide:</strong>
            Every module has four outcomes: <strong>understand the concept</strong>, <strong>perform a guided practical</strong>, <strong>submit evidence</strong>, and <strong>explain what you did</strong>. Students should not skip the testing and security steps.
          </div>
        </div>
      </header>

      {/* ========================================================
          STICKY TABLE OF CONTENTS QUICK-JUMP BAR
      ======================================================== */}
      <nav className="sticky top-20 z-30 mb-10 p-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold py-1 px-1 scrollbar-none">
          <span className="text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] font-bold px-2 whitespace-nowrap">
            Jump to:
          </span>
          {navAnchors.map((anchor) => (
            <button
              key={anchor.id}
              onClick={() => scrollToSection(anchor.id)}
              className="px-3 py-1.5 rounded-lg whitespace-nowrap bg-slate-100 dark:bg-slate-800 hover:bg-sky-600 hover:text-white text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              {anchor.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ========================================================
          SINGLE CONTINUOUS DOCUMENT CONTENT (PARTS A THROUGH O)
      ======================================================== */}
      <div className="space-y-12 text-left">

        {/* --------------------------------------------------------
            PART A — THE BIG PICTURE
        -------------------------------------------------------- */}
        <section id="guide-part-a" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">FOUNDATION</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART A — THE BIG PICTURE
            </h2>
          </div>

          {/* 1. What will a student actually learn? */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">1</span>
              <span>What will a student actually learn?</span>
            </h3>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              The internship follows one complete software journey. A student starts with an idea, uses an editor and AI assistant to build it, stores data, connects APIs, puts the code on GitHub, deploys it, connects a domain and explains the final product.
            </p>

            {/* Journey Flow Ribbon */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white font-mono text-xs sm:text-sm font-bold tracking-wider text-center border border-slate-800 shadow-inner overflow-x-auto whitespace-nowrap">
              IDEA → PLAN → CODE → DATABASE → API → TEST → GITHUB → DEPLOY → DOMAIN → LIVE APP
            </div>

            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 pt-2">
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">AI tools:</strong> accelerate planning, coding, debugging and learning.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Code editor:</strong> the workspace where source code is written and executed.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Frontend:</strong> what the user sees and interacts with.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Backend:</strong> server-side logic and APIs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Database:</strong> where application data is stored.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Git/GitHub:</strong> track and share code changes.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Vercel:</strong> deploy web applications from Git repositories.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-sky-500 mt-2 shrink-0" />
                <span><strong className="text-slate-900 dark:text-white">Domain/DNS:</strong> give the live application a human-friendly web address.</span>
              </li>
            </ul>
          </div>

          {/* 2. A simple example used throughout the internship */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">2</span>
              <span>A simple example used throughout the internship</span>
            </h3>

            <div className="p-4 rounded-2xl bg-sky-50/70 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900">
              <h4 className="font-bold text-sky-900 dark:text-sky-300 text-base mb-3">
                Project: Student Internship Management Portal
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                <li className="flex items-center gap-2"><span>•</span> Student opens website.</li>
                <li className="flex items-center gap-2"><span>•</span> Student registers/logs in.</li>
                <li className="flex items-center gap-2"><span>•</span> Student fills an internship application.</li>
                <li className="flex items-center gap-2"><span>•</span> Frontend sends the data.</li>
                <li className="flex items-center gap-2"><span>•</span> Backend/API validates the request.</li>
                <li className="flex items-center gap-2"><span>•</span> Database stores the application.</li>
                <li className="flex items-center gap-2"><span>•</span> Student sees the application status.</li>
                <li className="flex items-center gap-2"><span>•</span> Admin views applications and updates status.</li>
                <li className="flex items-center gap-2"><span>•</span> Project is pushed to GitHub.</li>
                <li className="flex items-center gap-2"><span>•</span> Project is deployed on Vercel.</li>
                <li className="flex items-center gap-2"><span>•</span> Custom domain points to the deployed website.</li>
              </ul>
            </div>

            {/* Golden Rule Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-slate-900 border border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200 text-sm font-semibold">
              <strong className="text-amber-700 dark:text-amber-300 font-extrabold uppercase tracking-wide block mb-1">Golden Rule:</strong>
              Students should be able to point to the frontend, backend, database, authentication, GitHub repository, deployment and domain for their project.
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART B — AI TOOLS & CODE EDITORS
        -------------------------------------------------------- */}
        <section id="guide-part-b" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">AI WORKFLOWS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART B — AI TOOLS &amp; CODE EDITORS
            </h2>
          </div>

          {/* Module 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 1</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                VS Code: the basic development workspace
              </h3>
            </div>
            
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What is VS Code?:</strong> A general-purpose code editor. It lets students create files, edit code, use extensions, open a terminal, run commands and debug projects.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why use it?:</strong> Students need a normal editor first. They should understand project folders and commands before depending heavily on AI.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>When to use it:</strong> Use it for manual coding, checking generated code, terminal commands, debugging and learning how a project is structured.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Setup practice:</strong>
              <ol className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>Install VS Code.</li>
                <li>Create a folder named <code className="font-mono text-sky-600">skyrovix-student-portfolio</code>.</li>
                <li>Open the folder in VS Code.</li>
                <li>Create <code className="font-mono text-sky-600">index.html</code>, <code className="font-mono text-sky-600">style.css</code> and <code className="font-mono text-sky-600">script.js</code>.</li>
                <li>Open the integrated terminal.</li>
                <li>Run the project using a suitable local development method.</li>
                <li>Use the browser and DevTools to inspect the result.</li>
              </ol>
            </div>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <p><strong>Student task:</strong> Create a responsive personal portfolio without AI for the first version. Add a navigation bar, hero section, skills, projects and contact section.</p>
              <p className="mt-1 text-slate-600 dark:text-slate-400"><strong>Expected learning:</strong> The student can locate files, edit code, open a terminal, run a project and find browser errors.</p>
            </div>
          </div>

          {/* Module 2 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 2</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cursor: AI coding agent workflow
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What is Cursor?:</strong> Cursor is an AI-focused coding environment. Its Agent can inspect a codebase, plan work, edit files, run terminal commands and help review changes.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why use it?:</strong> It teaches students how to work with an existing codebase instead of generating everything from zero.
            </p>

            <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs sm:text-sm font-bold text-center">
              Correct workflow: Explain → Plan → Approve → Implement → Review diff → Test → Fix → Commit
            </div>

            <div className="space-y-3">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Prompt examples:</strong>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { label: 'Explain Prompt', text: 'Explain this project structure. Do not change any files. Tell me the entry point, major components, API calls and database-related files.' },
                  { label: 'Plan Prompt', text: 'Plan a student registration feature. Do not write code yet. List the files that need changes, data flow, validation and security considerations.' },
                  { label: 'Implement Prompt', text: 'Implement only the approved registration feature. Keep the existing design. After editing, explain each changed file and run the project checks.' },
                  { label: 'Review Prompt', text: 'Review your changes for bugs, security issues, broken imports and mobile UI problems. Do not change anything until you show the issues.' },
                ].map((pr, pIdx) => (
                  <div key={pIdx} className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-sky-400 block mb-1">{pr.label}</span>
                      <p className="font-mono text-[11px] leading-relaxed">"{pr.text}"</p>
                    </div>
                    <button
                      onClick={() => handleCopy(pr.text, `b-prompt-${pIdx}`)}
                      className="mt-2 text-sky-400 hover:text-white font-semibold flex items-center gap-1 self-start text-[11px]"
                    >
                      {copiedId === `b-prompt-${pIdx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === `b-prompt-${pIdx}` ? 'Copied' : 'Copy Prompt'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Student task:</strong> Take the portfolio from Module 1. Ask Cursor to explain it first, then improve one section. Review the diff, run the project and commit the change.
            </p>

            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-900 dark:text-red-200">
              <strong>Important:</strong> AI-generated code is not automatically correct. The student owns the responsibility for understanding, testing and securing the code.
            </div>
          </div>

          {/* Module 3 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 3</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Google Antigravity
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What is it?:</strong> Google describes Antigravity as an agentic development platform with an editor view and an agent-first interface where agents can plan, execute and verify tasks across the editor, terminal and browser.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why teach it?:</strong> Students learn a more task-oriented AI workflow for multi-step development.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Guided practical:</strong>
              <ol start={8} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>Open a small project.</li>
                <li>Ask the agent to inspect the project and explain it without changing files.</li>
                <li>Ask for a feature plan.</li>
                <li>Approve a small feature.</li>
                <li>Let the agent implement it.</li>
                <li>Inspect the changed files and generated evidence/output.</li>
                <li>Run the application yourself.</li>
                <li>Test the feature manually.</li>
                <li>Commit only after verification.</li>
              </ol>
            </div>

            <div className="p-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <div>
                <strong className="text-sky-400 font-bold block mb-0.5">Prompt:</strong>
                <span className="font-mono text-slate-300">"First inspect this project. Explain the architecture. Then create a plan for adding a contact form. Do not modify files until the plan is complete."</span>
              </div>
              <button
                onClick={() => handleCopy("First inspect this project. Explain the architecture. Then create a plan for adding a contact form. Do not modify files until the plan is complete.", "ag-prompt")}
                className="text-sky-400 hover:text-white shrink-0 ml-3"
              >
                {copiedId === "ag-prompt" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              <strong>Do not teach:</strong> Do not teach students to give an agent a vague instruction such as “build everything” and submit the result without review.
            </p>
          </div>

          {/* Module 4 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 4</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cloud Code
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What is it?:</strong> Cloud Code provides IDE support for Google Cloud development, including Cloud Run and Kubernetes workflows, and can provide Gemini-assisted coding.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why use it?:</strong> It introduces students to cloud-oriented development and deployment workflows.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>When to use it:</strong> Use it after students understand local development, APIs and deployment. It is not necessary for every React/Vercel project.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Practical:</strong>
              <ol start={17} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>Install Cloud Code in VS Code.</li>
                <li>Sign in to the required Google Cloud account/project.</li>
                <li>Open a suitable sample or small backend service.</li>
                <li>Run it locally.</li>
                <li>Understand the generated configuration.</li>
                <li>Learn the difference between a local service and a cloud service.</li>
                <li>Deploy a small Cloud Run example if the batch exercise includes Google Cloud.</li>
              </ol>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Reference:</strong> Google's current Cloud Code documentation includes quickstarts for Cloud Run, Kubernetes, Gemini assistance and secrets.
            </p>
          </div>

          {/* Module 5 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 5</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Lovable / AI app builders
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Purpose in this internship:</strong> Use an AI app builder for rapid prototyping and UI exploration, then inspect, refine, test and version the resulting project.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Correct learning method:</strong>
              <ul className="space-y-1">
                <li>• Start with a clear requirement.</li>
                <li>• Generate a small screen or feature.</li>
                <li>• Inspect the generated project.</li>
                <li>• Identify which code is frontend, data layer and configuration.</li>
                <li>• Move/refine the code in the student's normal development workflow when required.</li>
                <li>• Test responsiveness and functionality.</li>
                <li>• Do not treat the generated app as production-ready by default.</li>
              </ul>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300">
              <strong>Practical task:</strong> generate a simple task dashboard, inspect its structure, identify the data flow, make one manual code change, then put the project under Git version control.
            </p>
          </div>

          {/* Section 8: AI Prompting Formula */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 text-xs font-black flex items-center justify-center">8</span>
              <span>AI prompting — one reusable formula</span>
            </h3>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950 to-slate-900 text-white font-mono text-center font-bold text-xs sm:text-sm border border-purple-800">
              ROLE + CONTEXT + TASK + CONSTRAINTS + OUTPUT + TESTING
            </div>

            <div className="p-4 bg-slate-900 text-slate-200 rounded-2xl border border-slate-800 text-xs font-mono space-y-1 relative">
              <button
                onClick={() => handleCopy("You are helping me as a senior full-stack mentor.\nContext: React + Vite + Tailwind project.\nTask: Add a student registration form.\nConstraints: Do not change unrelated files. Keep the existing UI style. Validate required fields.\nOutput: First give the plan, then list files to change, then implement after approval.\nTesting: Tell me how to test valid, invalid and duplicate submissions.", "formula-copy")}
                className="absolute top-3 right-3 text-sky-400 hover:text-white"
              >
                {copiedId === "formula-copy" ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <p>You are helping me as a senior full-stack mentor.</p>
              <p>Context: React + Vite + Tailwind project.</p>
              <p>Task: Add a student registration form.</p>
              <p>Constraints: Do not change unrelated files. Keep the existing UI style. Validate required fields.</p>
              <p>Output: First give the plan, then list files to change, then implement after approval.</p>
              <p>Testing: Tell me how to test valid, invalid and duplicate submissions.</p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-2xl text-xs sm:text-sm text-purple-950 dark:text-purple-200">
              <strong>AI assignment:</strong> Students must submit 5 prompts: explain, plan, implement, debug and review. For each prompt they must explain what the AI changed and what they personally verified.
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART C — GIT & GITHUB
        -------------------------------------------------------- */}
        <section id="guide-part-c" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">VERSION CONTROL</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART C — GIT &amp; GITHUB
            </h2>
          </div>

          {/* Module 6 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 6</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Git: what and why?
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Git:</strong> A version-control system that records changes to project files.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why:</strong> If an AI edit breaks the project, Git lets students inspect changes and return to an earlier known state.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>GitHub:</strong> A remote platform where Git repositories can be stored, shared and collaborated on.
            </p>

            <div className="space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">First project workflow:</strong>
              <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 space-y-1">
                <p>git init</p>
                <p>git status</p>
                <p>git add .</p>
                <p>git commit -m "Initial portfolio"</p>
                <p>git branch -M main</p>
                <p>git remote add origin &lt;YOUR_REPOSITORY_URL&gt;</p>
                <p>git push -u origin main</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">What each command means:</strong>
              <ul className="space-y-1">
                <li>• <code className="font-mono text-sky-600 font-bold">git init</code> — start Git tracking in the folder.</li>
                <li>• <code className="font-mono text-sky-600 font-bold">git status</code> — see changed/untracked files.</li>
                <li>• <code className="font-mono text-sky-600 font-bold">git add .</code> — choose changes for the next commit.</li>
                <li>• <code className="font-mono text-sky-600 font-bold">git commit</code> — save a version with a message.</li>
                <li>• <code className="font-mono text-sky-600 font-bold">git push</code> — upload commits to the remote repository.</li>
                <li>• <code className="font-mono text-sky-600 font-bold">git pull</code> — bring remote changes to the local project.</li>
                <li>• <code className="font-mono text-sky-600 font-bold">git clone</code> — copy a remote repository to a new local folder.</li>
              </ul>
            </div>
          </div>

          {/* Module 7 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 7</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                GitHub project hygiene
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• Repository name should describe the project.</li>
              <li>• README should explain purpose, features, setup and live URL.</li>
              <li>• .gitignore should exclude node_modules and environment secrets.</li>
              <li>• Commit messages should describe the change.</li>
              <li>• <strong>Never commit passwords, private keys, service-role keys or secret tokens.</strong></li>
              <li>• Use branches for larger features.</li>
              <li>• Review changes before merging.</li>
            </ul>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <strong>Task:</strong> Create one repository per mini project. At least one project must use a feature branch and pull request before merging into main.
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART D — FRONTEND
        -------------------------------------------------------- */}
        <section id="guide-part-d" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">CLIENT APPLICATION</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART D — FRONTEND
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 8</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Frontend foundations
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>HTML:</strong> page structure and semantic elements.</li>
              <li>• <strong>CSS:</strong> layout, spacing, responsive design.</li>
              <li>• <strong>JavaScript:</strong> logic, events, async operations.</li>
              <li>• <strong>React:</strong> components, props, state, hooks and routing.</li>
              <li>• <strong>Tailwind:</strong> fast responsive UI development.</li>
              <li>• <strong>Forms:</strong> controlled fields, validation and error messages.</li>
              <li>• <strong>DevTools:</strong> Console, Network, Elements and Application panels.</li>
            </ul>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Practice progression:</strong>
              <ol start={24} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>Portfolio landing page</li>
                <li>Calculator</li>
                <li>To-do application</li>
                <li>API-based weather/search app</li>
                <li>React dashboard</li>
                <li>Student registration UI</li>
              </ol>
            </div>

            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs sm:text-sm text-emerald-950 dark:text-emerald-200">
              <strong>Success condition:</strong> Student can explain which part is UI, which part contains logic and where an API request is made.
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART E — BACKEND
        -------------------------------------------------------- */}
        <section id="guide-part-e" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">SERVER &amp; APIS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART E — BACKEND
            </h2>
          </div>

          {/* Module 9 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 9</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                What is backend?
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Frontend</strong> = user-facing application.</li>
              <li>• <strong>Backend</strong> = server-side logic that receives requests, validates data, performs business operations and communicates with data/services.</li>
              <li>• <strong>Database</strong> = persistent data store.</li>
              <li>• <strong>API</strong> = defined way for software components to communicate.</li>
            </ul>

            <div className="p-4 bg-slate-900 text-white rounded-2xl text-xs sm:text-sm font-mono leading-relaxed">
              <strong className="text-sky-400 block mb-1 font-sans">Real example:</strong>
              Student clicks Apply → React POST request → Express route → validation → database insert → JSON response → React success message
            </div>
          </div>

          {/* Module 10 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 10</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Node.js + Express
              </h3>
            </div>

            <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• Create a Node project.</li>
              <li>• Understand package.json and npm scripts.</li>
              <li>• Create an Express server.</li>
              <li>• Create routes.</li>
              <li>• Read request parameters/body.</li>
              <li>• Return JSON responses.</li>
              <li>• Use middleware.</li>
              <li>• Handle errors.</li>
              <li>• Use environment variables.</li>
              <li>• Build CRUD endpoints.</li>
            </ul>

            <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 space-y-1">
              <p>GET    /api/students</p>
              <p>POST   /api/students</p>
              <p>GET    /api/students/:id</p>
              <p>PATCH  /api/students/:id</p>
              <p>DELETE /api/students/:id</p>
            </div>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <strong>Practical project:</strong> Student API. Test every endpoint with an API client before connecting React. Students must demonstrate success responses and at least three failure cases.
            </div>
          </div>

          {/* Module 11 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 11</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Authentication vs authorization
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Authentication:</strong> “Who are you?” Example: email/password login.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Authorization:</strong> “What are you allowed to access?” Example: student can view own application; admin can review all applications.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              This distinction is essential when building dashboards, internship portals, e-commerce sites and admin systems.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART F — DATABASE + SUPABASE
        -------------------------------------------------------- */}
        <section id="guide-part-f" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">DATA LAYER</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART F — DATABASE + SUPABASE
            </h2>
          </div>

          {/* Module 12 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 12</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Database basics
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Table</strong> = collection of related records.</li>
              <li>• <strong>Row</strong> = one record.</li>
              <li>• <strong>Column</strong> = one field.</li>
              <li>• <strong>Primary key</strong> = unique identifier.</li>
              <li>• <strong>Foreign key</strong> = relationship to another table.</li>
              <li>• <strong>CRUD</strong> = Create, Read, Update, Delete.</li>
              <li>• <strong>Constraint</strong> = rule that protects data quality.</li>
              <li>• <em>Example tables:</em> users, profiles, applications, tasks, submissions, payments.</li>
            </ul>
          </div>

          {/* Module 13 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 13</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Supabase: what is it?
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What is Supabase?:</strong> A platform built around PostgreSQL with database, authentication, storage and other backend services. Each Supabase project gets a full Postgres database.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why use it:</strong> It lets a student build many web apps without creating every backend infrastructure component from scratch.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block mb-1">When to use it:</strong>
              <p>• When relational/PostgreSQL data is a good fit.</p>
              <p>• When the app needs authentication and database integration.</p>
              <p>• When file storage is needed.</p>
              <p>• When a React application needs a managed backend service.</p>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Step-by-step student exercise:</strong>
              <ol start={30} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>Create a Supabase project.</li>
                <li>Create tables: profiles, applications and tasks.</li>
                <li>Add primary keys and relationships.</li>
                <li>Create the frontend project.</li>
                <li>Install the Supabase client package.</li>
                <li>Store project URL and publishable key in environment variables.</li>
                <li>Connect the frontend.</li>
                <li>Implement registration/login.</li>
                <li>Insert and read application data.</li>
                <li>Add RLS policies.</li>
                <li>Test signed-out, signed-in and unauthorized access.</li>
                <li>Add Storage for a controlled file-upload task.</li>
              </ol>
            </div>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-2">
              <strong className="text-sky-800 dark:text-sky-300 block">RLS — why it matters:</strong>
              <p>Row Level Security controls which database rows a user can access. Supabase recommends securing exposed tables with RLS and policies. Service-role/secret keys bypass RLS and must remain server-side.</p>
              <p className="font-mono text-xs">
                Student A → can read/update Student A data<br/>
                Student B → cannot read Student A private data<br/>
                Admin → can access data according to an explicitly designed admin policy
              </p>
            </div>

            <div className="p-3.5 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl text-xs text-red-900 dark:text-red-200">
              <strong>Critical rule:</strong> Never place a Supabase service-role/secret key in frontend code. Use the publishable key with proper RLS for browser access, or keep secret keys on the backend.
            </div>
          </div>

          {/* Module 14 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 14</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Supabase Auth
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What it does:</strong> Supabase Auth handles user authentication and authorization support, including common methods such as password, magic link and OTP.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Practice flow:</strong>
              <ol start={42} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>Sign up.</li>
                <li>Sign in.</li>
                <li>Get the current authenticated user.</li>
                <li>Create a profile row for the user.</li>
                <li>Protect dashboard routes.</li>
                <li>Show only the user's allowed records.</li>
                <li>Sign out.</li>
                <li>Test direct access to protected pages.</li>
              </ol>
            </div>
          </div>

          {/* Module 15 */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 15</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Supabase Storage
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Use case:</strong> Profile photos, certificates, project screenshots or submitted files.
            </p>

            <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• Create a bucket.</li>
              <li>• Define who can upload.</li>
              <li>• Define who can read.</li>
              <li>• Use appropriate Storage policies.</li>
              <li>• Do not assume that a hidden UI button is security.</li>
              <li>• Test access as different users.</li>
            </ul>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Security:</strong> Supabase Storage access is also controlled through policies/RLS.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART G — FIREBASE
        -------------------------------------------------------- */}
        <section id="guide-part-g" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">NOSQL ALTERNATIVE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART G — FIREBASE
            </h2>
          </div>

          {/* Module 16 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 16</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Firebase: what and why?
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What is Firebase?:</strong> Google's application platform. In this internship, students learn Authentication, Cloud Firestore, Storage and basic hosting/deployment concepts.
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>When to use it:</strong> Use it when a document-oriented Firebase workflow is suitable or when the project specifically requires Firebase services.
            </p>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Student flow:</strong>
              <ol start={50} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1">
                <li>Create a Firebase project.</li>
                <li>Register a web app.</li>
                <li>Enable Authentication.</li>
                <li>Create Firestore data structure.</li>
                <li>Connect the web app using Firebase SDK.</li>
                <li>Create/read/update/delete documents.</li>
                <li>Write Security Rules.</li>
                <li>Test authenticated and unauthorized access.</li>
                <li>Use Storage for a controlled file task if required.</li>
              </ol>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Security:</strong> Firebase recommends combining Authentication with Firestore Security Rules for user-based access and data validation.
            </p>
          </div>

          {/* Section 20: Supabase vs Firebase Table */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">20</span>
              <span>Supabase vs Firebase — learn by building</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold">
                  <tr>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Record</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Simple meaning</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Common learning example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Main database style</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">PostgreSQL / relational</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Firestore / document-oriented</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Auth</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Supabase Auth</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Firebase Authentication</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Access control</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Postgres RLS/policies</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Firebase Security Rules</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Storage</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Supabase Storage</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Cloud Storage for Firebase</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-900 dark:text-white">Student exercise</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Student Management System</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Task Management App</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              The objective is not to memorize which platform is “best.” The objective is to understand the architecture and be able to build with either when a project requires it.
            </p>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART H — API INTEGRATION
        -------------------------------------------------------- */}
        <section id="guide-part-h" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">TESTING &amp; PROTOCOLS</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART H — API INTEGRATION
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 17</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                API + Postman
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Why:</strong> Before connecting a frontend, students should prove that the API itself works.
            </p>

            <div className="p-4 bg-slate-950 text-slate-100 rounded-2xl border border-slate-800 font-mono text-xs space-y-1">
              <strong className="text-sky-400 font-sans block mb-1">Request anatomy:</strong>
              <p><span className="text-emerald-400">METHOD:</span> POST</p>
              <p><span className="text-emerald-400">URL:</span> /api/applications</p>
              <p><span className="text-emerald-400">Headers:</span> Content-Type: application/json</p>
              <p><span className="text-emerald-400">Body:</span> &#123; "name": "Hari", "email": "student@example.com" &#125;</p>
            </div>

            <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>GET</strong> reads data.</li>
              <li>• <strong>POST</strong> creates data.</li>
              <li>• <strong>PUT/PATCH</strong> changes data.</li>
              <li>• <strong>DELETE</strong> removes data.</li>
              <li>• Status codes tell the client what happened.</li>
              <li>• Headers carry metadata/auth information.</li>
              <li>• JSON commonly carries structured request/response data.</li>
            </ul>

            <div className="p-4 bg-sky-50 dark:bg-sky-950/30 rounded-2xl border border-sky-200 dark:border-sky-900 text-xs sm:text-sm text-slate-800 dark:text-slate-200">
              <strong>Task:</strong> Build the Student API, test it with Postman, document each endpoint, then connect React to it.
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART I — VERCEL
        -------------------------------------------------------- */}
        <section id="guide-part-i" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">CLOUD DEPLOYMENT</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART I — VERCEL
            </h2>
          </div>

          {/* Module 18 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 18</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                What is Vercel?
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Purpose:</strong> A deployment platform commonly used to publish web applications. Vercel can connect to Git repositories and automatically create deployments from pushes; preview deployments can be used to test changes before production.
            </p>

            <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Local</strong> = student's computer.</li>
              <li>• <strong>Preview</strong> = deployed version used for testing a change.</li>
              <li>• <strong>Production</strong> = live user-facing version.</li>
            </ul>
          </div>

          {/* Section 23: Step-by-step Vercel deployment */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">23</span>
              <span>Step-by-step Vercel deployment</span>
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ol start={59} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                <li>Finish the project locally.</li>
                <li>Run the build locally and fix errors.</li>
                <li>Push the code to GitHub.</li>
                <li>Sign in to Vercel.</li>
                <li>Import the Git repository.</li>
                <li>Confirm framework/build settings.</li>
                <li>Add required environment variables.</li>
                <li>Deploy.</li>
                <li>Open the preview/live URL.</li>
                <li>Test all important flows.</li>
                <li>Push future changes through Git so deployments update automatically.</li>
              </ol>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              <strong>Git integration:</strong> Vercel supports automatic deployments from Git repositories, including preview deployments for pushes/PR workflows and production deployment from the production branch.
            </p>
          </div>

          {/* Section 24: Environment variables */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">24</span>
              <span>Environment variables</span>
            </h3>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>What are they?:</strong> Configuration values kept outside normal source code, such as API URLs or client configuration.
            </p>

            <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-2xl border border-slate-800 space-y-1">
              <p className="text-slate-400"># Example (Vite & Server):</p>
              <p>VITE_API_URL=https://api.example.com</p>
              <p>DB_TYPE=mysql</p>
              <p>MYSQL_HOST=localhost</p>
            </div>

            <ul className="space-y-1 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• Create a local .env file as required by the framework.</li>
              <li>• Add .env to .gitignore when it contains secrets/configuration.</li>
              <li>• Add required variables in Vercel Project Settings → Environment Variables.</li>
              <li>• Understand which values are public by design and which are secret.</li>
              <li>• Redeploy after changing environment variables; Vercel documents that variable changes apply to new deployments.</li>
            </ul>
          </div>

          {/* Section 25: Common Vercel errors */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">25</span>
              <span>Common Vercel errors</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold">
                  <tr>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Error</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Where to check</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">How to solve</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">Build failed</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Deployment build log</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Find the first real error, reproduce locally, fix and push.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">API works locally only</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Production API URL/env vars</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Configure production variables and test again.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">Login redirect fails</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Production URL/auth redirect settings</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Add the production URL where the auth provider requires it.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">CORS error</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Backend allowed origins</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Allow the correct production frontend origin.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-red-600 dark:text-red-400">Blank page</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Browser console + routing</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Check runtime errors, assets and SPA routing configuration.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART J — DOMAIN + DNS
        -------------------------------------------------------- */}
        <section id="guide-part-j" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">NETWORKING</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART J — DOMAIN + DNS
            </h2>
          </div>

          {/* Module 19 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 19</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                What is a domain?
              </h3>
            </div>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Domain:</strong> A human-friendly address such as <code className="font-mono text-sky-600">example.com</code>.</li>
              <li>• <strong>Hosting:</strong> The service that serves the application.</li>
              <li>• <strong>DNS:</strong> The system that tells the internet where a domain/subdomain should resolve.</li>
              <li>• <strong>SSL/HTTPS:</strong> Encrypted browser-to-site communication; modern hosting platforms can provision HTTPS after domain configuration is verified.</li>
            </ul>
          </div>

          {/* Section 27: Domain purchase */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">27</span>
              <span>Domain purchase — beginner explanation</span>
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ol start={70} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                <li>Choose a domain name.</li>
                <li>Check availability with a domain registrar.</li>
                <li>Register it under the correct owner/contact details.</li>
                <li>Complete any required verification.</li>
                <li>Keep renewal information safe.</li>
                <li>Do not share account passwords or verification codes.</li>
              </ol>
            </div>
          </div>

          {/* Section 28: Connect a domain to Vercel */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">28</span>
              <span>Connect a domain to Vercel</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-xs sm:text-sm font-bold text-center">
              Flow: Buy domain → Deploy project → Vercel Project → Domains → Add domain → Check required DNS → Add exact DNS records at registrar → Verify → HTTPS → Test
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Vercel's current custom-domain documentation explains that the exact DNS records can depend on the project/domain configuration, so students should use the records shown by Vercel rather than blindly copying a generic record.
            </p>
          </div>

          {/* Section 29: DNS records students must understand */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">29</span>
              <span>DNS records students must understand</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold">
                  <tr>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Type</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Meaning</th>
                    <th className="p-3 border-b border-slate-200 dark:border-slate-700">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  <tr>
                    <td className="p-3 font-bold text-sky-600">A</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Points a domain name to an IPv4 address</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">example.com → server IP</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-sky-600">CNAME</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Points a name to another hostname</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">www.example.com → hosting hostname</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-sky-600">Nameserver</td>
                    <td className="p-3 text-slate-700 dark:text-slate-300">Defines which DNS provider manages the domain's DNS</td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">Registrar → DNS provider</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200">
              <strong>Important:</strong> Do not change unrelated MX/email records while connecting a website unless you understand the impact. Website DNS and email DNS can coexist.
            </div>
          </div>

          {/* Section 30: Domain troubleshooting */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">30</span>
              <span>Domain troubleshooting</span>
            </h3>

            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• Confirm the domain was added to the correct Vercel project.</li>
              <li>• Read Vercel's required DNS records.</li>
              <li>• Check the registrar's DNS zone.</li>
              <li>• Remove conflicting records only when you know they are obsolete.</li>
              <li>• Wait for DNS changes to become visible.</li>
              <li>• Verify both root domain and www if both are intended.</li>
              <li>• Confirm HTTPS works.</li>
              <li>• Test the live application, login redirects and API calls after the domain changes.</li>
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART K — FULL-STACK PROJECT
        -------------------------------------------------------- */}
        <section id="guide-part-k" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">CAPSTONE PLATFORM</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART K — FULL-STACK PROJECT
            </h2>
          </div>

          {/* Module 20 */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-lg bg-sky-100 text-sky-800 font-extrabold text-xs">Module 20</span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Build one real-world project
              </h3>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong>Recommended project:</strong> Internship Management Portal. Other acceptable projects include LMS, e-commerce, booking, CRM, event management or student management.
            </p>

            <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-sky-950 text-white font-mono text-center font-bold text-xs sm:text-sm border border-slate-800">
              Required architecture: React/Tailwind → API/Backend → Supabase/PostgreSQL or Firebase → GitHub → Vercel → Custom Domain
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
              <strong className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">Feature checklist:</strong>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300">
                <span>• Responsive frontend</span>
                <span>• Authentication</span>
                <span>• User profile</span>
                <span>• CRUD</span>
                <span>• Database</span>
                <span>• Validation</span>
                <span>• Role/access control where required</span>
                <span>• File upload where required</span>
                <span>• API integration</span>
                <span>• Error/loading states</span>
                <span>• Git/GitHub history</span>
                <span>• README</span>
                <span>• Deployment</span>
                <span>• Environment variables</span>
                <span>• Custom domain</span>
                <span>• HTTPS</span>
                <span>• Testing</span>
              </div>
            </div>
          </div>

          {/* Section 32: AI-assisted project execution */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">32</span>
              <span>AI-assisted project execution</span>
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ol start={76} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                <li>Write requirements in plain English.</li>
                <li>Ask AI for architecture options.</li>
                <li>Choose the stack and explain why.</li>
                <li>Ask AI to create a file/module plan.</li>
                <li>Build the UI in small features.</li>
                <li>Build API/backend in small features.</li>
                <li>Create database schema before writing complex database code.</li>
                <li>Implement authentication and access control.</li>
                <li>Test each feature.</li>
                <li>Commit after stable milestones.</li>
                <li>Deploy a preview.</li>
                <li>Test production configuration.</li>
                <li>Connect domain.</li>
                <li>Prepare README and demo.</li>
              </ol>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART L — WEEKLY PRACTICAL STRUCTURE
        -------------------------------------------------------- */}
        <section id="guide-part-l" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">12-WEEK ROADMAP</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART L — WEEKLY PRACTICAL STRUCTURE
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold">
                <tr>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Week</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Learning focus</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Practical output</th>
                  <th className="p-3 border-b border-slate-200 dark:border-slate-700">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                <tr>
                  <td className="p-3 font-bold text-sky-600">1</td>
                  <td className="p-3 text-slate-900 dark:text-white">VS Code + AI tools + prompting</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">AI-assisted portfolio</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Screenshots + repo</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">2</td>
                  <td className="p-3 text-slate-900 dark:text-white">Git/GitHub + frontend</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">2 mini projects</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Git history + README</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">3</td>
                  <td className="p-3 text-slate-900 dark:text-white">JavaScript/React/API basics</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">React API project</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Live/local demo</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">4</td>
                  <td className="p-3 text-slate-900 dark:text-white">Backend + Express + CRUD</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Student API</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Postman collection</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">5</td>
                  <td className="p-3 text-slate-900 dark:text-white">Database + Supabase</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Student management app</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">DB schema + demo</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">6</td>
                  <td className="p-3 text-slate-900 dark:text-white">Firebase + auth/security</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Task management app</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Rules + demo</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">7</td>
                  <td className="p-3 text-slate-900 dark:text-white">Full-stack integration</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Connected frontend/backend</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Repo + demo</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">8</td>
                  <td className="p-3 text-slate-900 dark:text-white">Testing/debugging/security basics</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Bug-fix sprint</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Issue list + commits</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">9</td>
                  <td className="p-3 text-slate-900 dark:text-white">Vercel + environment variables</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Preview/production deployment</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Live URL</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">10</td>
                  <td className="p-3 text-slate-900 dark:text-white">Domain + DNS + HTTPS</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Custom domain setup</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">DNS notes + live URL</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">11</td>
                  <td className="p-3 text-slate-900 dark:text-white">Final project build</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Major features complete</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">GitHub + preview</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-sky-600">12</td>
                  <td className="p-3 text-slate-900 dark:text-white">Final testing + documentation</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">Production project</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400 font-mono text-xs">Live URL + README + presentation</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART M — DAILY STUDENT WORKFLOW
        -------------------------------------------------------- */}
        <section id="guide-part-m" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-sky-600 uppercase tracking-wider block mb-1">EXECUTION ROUTINE</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART M — DAILY STUDENT WORKFLOW
            </h2>
          </div>

          {/* 33. Every task cycle */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">33</span>
              <span>Every task should follow this cycle</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-center font-bold text-xs sm:text-sm border border-slate-800">
              Learn → Plan → Build → Test → Debug → Commit → Document
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
              <li>• <strong>Learn:</strong> read the concept and understand the expected result.</li>
              <li>• <strong>Plan:</strong> write what files/data/API changes are needed.</li>
              <li>• <strong>Build:</strong> code manually or with controlled AI assistance.</li>
              <li>• <strong>Test:</strong> check normal, invalid and edge cases.</li>
              <li>• <strong>Debug:</strong> inspect the error instead of blindly asking AI to rewrite everything.</li>
              <li>• <strong>Commit:</strong> save a meaningful stable change.</li>
              <li>• <strong>Document:</strong> update README/notes/screenshots.</li>
            </ul>
          </div>

          {/* 34. Submission format for every project */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 text-xs font-black flex items-center justify-center">34</span>
              <span>Submission format for every project</span>
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-700 dark:text-slate-300 font-mono">
                <span>• Project name</span>
                <span>• Problem statement</span>
                <span>• Features</span>
                <span>• Technology stack</span>
                <span>• AI tools used</span>
                <span>• Important prompts used</span>
                <span>• Database design</span>
                <span>• API endpoints (if applicable)</span>
                <span>• GitHub URL</span>
                <span>• Live URL</span>
                <span>• Known limitations</span>
                <span>• Screenshots</span>
                <span>• 2–5 minute demo/explanation</span>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART N — SECURITY & RESPONSIBLE USE
        -------------------------------------------------------- */}
        <section id="guide-part-n" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider block mb-1">COMPLIANCE &amp; SAFETY</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART N — SECURITY &amp; RESPONSIBLE USE
            </h2>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            <li>• <strong>Never commit passwords or secret API keys.</strong></li>
            <li>• <strong>Do not expose backend service-role keys in frontend code.</strong></li>
            <li>• <strong>Use database security rules/RLS rather than relying only on hidden UI.</strong></li>
            <li>• <strong>Validate user input.</strong></li>
            <li>• <strong>Protect admin functionality.</strong></li>
            <li>• <strong>Test unauthorized access.</strong></li>
            <li>• <strong>Do not upload personal/sensitive data unnecessarily.</strong></li>
            <li>• <strong>Review AI-generated code for security issues.</strong></li>
            <li>• <strong>Use only software/assets/data you are permitted to use.</strong></li>
          </ul>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p><strong>Supabase security:</strong> Supabase recommends RLS for exposed tables; service-role/secret keys bypass RLS and must remain server-side.</p>
            <p><strong>Firebase security:</strong> Firebase Security Rules can control access to Firestore, Realtime Database and Storage, and Authentication can be used with rules for user-based access.</p>
          </div>
        </section>

        {/* --------------------------------------------------------
            PART O — FINAL ASSESSMENT
        -------------------------------------------------------- */}
        <section id="guide-part-o" className="bg-white dark:bg-slate-850 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">EVALUATION</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              PART O — FINAL ASSESSMENT
            </h2>
          </div>

          {/* 35. Student must be able to demonstrate */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">35</span>
              <span>Student must be able to demonstrate</span>
            </h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <ol start={90} className="list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                <li>Open the project and explain its folder structure.</li>
                <li>Explain where frontend code is located.</li>
                <li>Explain how the frontend communicates with the backend/database.</li>
                <li>Show the database tables/collections.</li>
                <li>Explain authentication and authorization.</li>
                <li>Show GitHub commits.</li>
                <li>Show the deployment.</li>
                <li>Show environment variables without exposing secrets.</li>
                <li>Explain the domain and DNS connection.</li>
                <li>Demonstrate a real feature from login to database to UI.</li>
                <li>Find and explain one bug they fixed.</li>
                <li>Explain what AI tools were used and what they personally verified.</li>
              </ol>
            </div>
          </div>

          {/* 36. Final success definition */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">36</span>
              <span>Final success definition</span>
            </h3>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 text-white text-center space-y-3 border border-sky-800">
              <h4 className="text-lg sm:text-xl font-black text-cyan-300 tracking-wide uppercase">
                A STUDENT SHOULD NOT JUST HAVE A LIVE WEBSITE.<br />
                THE STUDENT SHOULD UNDERSTAND HOW IT WORKS.
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
                The final goal is independent practical ability: a student receives a requirement, chooses an appropriate tool, builds the feature, connects data, secures it, versions it, deploys it, connects a domain, debugs production issues and explains the complete system.
              </p>
            </div>
          </div>

          {/* 37. Current official learning references */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-black flex items-center justify-center">37</span>
              <span>Current official learning references</span>
            </h3>

            <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
              Use official documentation for changing product interfaces and commands. The curriculum intentionally teaches concepts and workflows rather than relying on screenshots that may become outdated.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Google Antigravity', url: 'https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/', desc: 'Google Developers Blog' },
                { name: 'Cursor Docs', url: 'https://cursor.com/docs', desc: 'AI Coding Agent' },
                { name: 'Google Cloud Code Docs', url: 'https://docs.cloud.google.com/code/docs/vscode', desc: 'IDE Cloud Support' },
                { name: 'Supabase Docs', url: 'https://supabase.com/docs/', desc: 'PostgreSQL Platform' },
                { name: 'Firebase Docs', url: 'https://firebase.google.com/docs', desc: 'Google App Platform' },
                { name: 'Vercel Docs', url: 'https://vercel.com/docs', desc: 'Frontend Deployment' },
              ].map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 transition-all flex items-center justify-between group"
                >
                  <div>
                    <strong className="text-xs font-bold text-slate-900 dark:text-white block group-hover:text-sky-600">
                      {ref.name}
                    </strong>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-[200px] block">
                      {ref.desc}
                    </span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 shrink-0" />
                </a>
              ))}
            </div>

            {/* Document Final Sign-off */}
            <div className="pt-8 text-center text-sm font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase">
              SKYROVIX • Learn • Build • Deploy • Showcase
            </div>
          </div>
        </section>

      </div>

      {/* Floating Back to Top Button */}
      <div className="mt-12 text-center">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold shadow-lg transition-all cursor-pointer"
        >
          <span>↑ Back to Top of Guide</span>
        </button>
      </div>

    </div>
  );
};
