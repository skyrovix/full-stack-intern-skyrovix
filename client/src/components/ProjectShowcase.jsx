import React, { useState, useMemo } from 'react';
import { 
  FolderGit2, 
  Search, 
  Tag, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  Code2,
  Cpu
} from 'lucide-react';
import { allProjects, projectCategories, coreStackCategories, standardProjectFolderStructure } from '../data/projects';

export const ProjectShowcase = ({ onOpenApply }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    return allProjects.filter((project) => {
      const matchesCategory =
        selectedCategory === 'all' || project.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;
      const matchesSearch =
        project.title.toLowerCase().includes(query) ||
        (project.num && project.num.includes(query)) ||
        (project.difficulty && project.difficulty.toLowerCase().includes(query)) ||
        (project.whatToLearn && project.whatToLearn.toLowerCase().includes(query)) ||
        (project.expectedOutcome && project.expectedOutcome.toLowerCase().includes(query)) ||
        (project.tech && project.tech.some(t => t.toLowerCase().includes(query)));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="projects" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold uppercase tracking-wider border border-cyan-200">
            <Layers className="w-3.5 h-3.5 text-cyan-600" />
            <span>50 STRUCTURED PROJECTS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Interactive Project Showcase
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Build a comprehensive 50-project GitHub portfolio progressing from browser fundamentals to React, REST APIs, databases, Docker, CI/CD, full stack deployment and production SaaS.
          </p>

          {/* Compliance Disclaimer Notice */}
          <div className="inline-block p-2.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-200 text-xs font-semibold">
            <span>🛡️ <strong>Production Standard:</strong> Git/GitHub required from Project 01 onward with meaningful commits, README, and live full stack deployment URL.</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {projectCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 50 projects, tech stack..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

        </div>

        {/* Results Count Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-medium mb-6 px-1">
          <span>Showing <strong>{filteredProjects.length}</strong> of {allProjects.length} curriculum projects</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-sky-600 hover:underline font-semibold"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {filteredProjects.map((project) => {
            const isCapstone = project.category === 'capstone' || project.num === '50';
            return (
              <div
                key={project.id}
                className={`p-6 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-soft hover:shadow-md ${
                  isCapstone
                    ? 'bg-gradient-to-b from-[#0b1e3b] to-[#081528] text-white border-2 border-cyan-400/60 shadow-xl'
                    : 'bg-white border border-slate-200/90'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isCapstone ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        #{project.num}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full tracking-wide ${
                        isCapstone
                          ? 'bg-cyan-400 text-slate-950 font-black'
                          : project.difficulty.includes('Beginner')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : project.difficulty.includes('Intermediate')
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : project.difficulty.includes('Advanced')
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {project.difficulty}
                      </span>
                    </div>
                    <span className={`text-[11px] font-semibold ${isCapstone ? 'text-cyan-300' : 'text-slate-500'}`}>
                      {project.dueDate} • {project.month}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-base font-extrabold leading-snug ${isCapstone ? 'text-white' : 'text-slate-900'}`}>
                    {project.title}
                  </h3>

                  {/* What to Learn Box */}
                  <div className={`p-2.5 rounded-xl text-xs leading-relaxed border ${
                    isCapstone
                      ? 'bg-white/5 border-white/10 text-slate-200'
                      : 'bg-slate-50 border-slate-200/70 text-slate-700'
                  }`}>
                    <span className="font-extrabold block text-[10px] uppercase tracking-wider text-sky-600 mb-0.5">
                      What You Learn:
                    </span>
                    {project.whatToLearn}
                  </div>

                  {/* Expected Outcome Box */}
                  <div className={`p-2.5 rounded-xl text-xs leading-relaxed border ${
                    isCapstone
                      ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-200'
                      : 'bg-emerald-50/70 border-emerald-200/80 text-emerald-900'
                  }`}>
                    <span className="font-extrabold block text-[10px] uppercase tracking-wider text-emerald-600 mb-0.5">
                      Expected Outcome:
                    </span>
                    {project.expectedOutcome}
                  </div>
                </div>

                {/* Tech Stack Chips */}
                <div className="pt-4 mt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                          isCapstone
                            ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                            : 'bg-slate-100 text-slate-700 border border-slate-200/80'
                        }`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Core Technology Stack Strategy & Standards */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
          
          {/* Core Stack Table */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Core Stack Students Learn
                </h3>
                <p className="text-xs text-slate-500">
                  Industry-aligned tooling required across the 50 projects
                </p>
              </div>
            </div>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-black">
                    <th className="pb-2.5 font-bold">Area</th>
                    <th className="pb-2.5 font-bold">Recommended Stack</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {coreStackCategories.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 pr-4 font-bold text-slate-800 whitespace-nowrap">
                        {item.area}
                      </td>
                      <td className="py-2.5 text-slate-600 font-medium">
                        {item.stack}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Standard Project Folder Structure & GitHub Standards */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-700 font-bold">
                  <FolderGit2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Standard Project Folder Structure
                  </h3>
                  <p className="text-xs text-slate-500">
                    Required repository architecture for all sprint submissions
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 text-cyan-300 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner border border-slate-800">
                <pre className="whitespace-pre">{standardProjectFolderStructure}</pre>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                <h4 className="font-extrabold text-slate-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Minimum GitHub &amp; Deployment Standards</span>
                </h4>
                <ul className="space-y-1.5 text-slate-600 pl-1 leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Use feature-based, meaningful Git commits rather than single bulk uploads.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>Never commit credentials; use environment variables (<code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">.env</code>) and provide <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800 font-mono">.env.example</code>.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>README must document project purpose, features, tech stack, local setup steps, and live URL.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>For backend &amp; full stack projects: document API endpoints, sample request/response payloads, and database schema migrations.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

        </div>

        {/* CTA Footer */}
        <div className="mt-14 p-8 rounded-2xl bg-white border border-slate-200 shadow-soft text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            Ready to Build All 50+ Real-World Applications?
          </h3>
          <p className="text-sm text-slate-600">
            Submit your applications with live deployment URLs and clean GitHub repositories to qualify for your official Skyrovix internship certificate.
          </p>
          <button
            onClick={onOpenApply}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white font-bold text-sm shadow transition-all"
          >
            <span>APPLY FOR BATCH 1 (₹200)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
