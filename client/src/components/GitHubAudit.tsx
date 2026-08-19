import React, { useState } from 'react';
import { Github, Star, GitFork, Code2, Award, ExternalLink, Search, RefreshCw, ShieldCheck } from 'lucide-react';
import { GitHubService } from '../services/api';
import { GitHubAudit as GitHubAuditType } from '../types';

export const GitHubAudit: React.FC = () => {
  const [username, setUsername] = useState<string>('alexvance');
  const [audit, setAudit] = useState<GitHubAuditType | null>({
    username: 'alexvance',
    publicReposCount: 22,
    totalStars: 64,
    totalForks: 18,
    topLanguages: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Python'],
    technicalScore: 92,
    summaryText: 'Verified GitHub Developer Profile: High activity across 22 repositories with top languages in TypeScript, React, and Express. Outstanding code structure and repository documentation.',
    recentRepositories: [
      {
        name: 'recruitmentx-ats-core',
        description: 'AI-Powered ATS & Resume Career Optimization Engine with React & Express',
        language: 'TypeScript',
        stars: 38,
        forks: 11,
        url: 'https://github.com/alexvance/recruitmentx-ats-core',
        updatedAt: '2026-08-08',
      },
      {
        name: 'react-glassmorphism-ui',
        description: 'Dark-mode glass styling components for Vite & Tailwind CSS',
        language: 'TypeScript',
        stars: 18,
        forks: 4,
        url: 'https://github.com/alexvance/react-glassmorphism-ui',
        updatedAt: '2026-08-05',
      },
      {
        name: 'express-prisma-postgres-boilerplate',
        description: 'Production-ready REST API starter with JWT & Prisma ORM',
        language: 'TypeScript',
        stars: 8,
        forks: 3,
        url: 'https://github.com/alexvance/express-prisma-postgres-boilerplate',
        updatedAt: '2026-07-28',
      },
    ],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleAudit = async () => {
    if (!username.trim()) return;
    setLoading(true);
    try {
      const res = await GitHubService.auditProfile(username.trim());
      if (res.success && res.data) {
        setAudit(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header & Search Bar */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold mb-2">
              <Github className="w-3.5 h-3.5 text-indigo-400" /> Developer Portfolio Auditor
            </div>
            <h1 className="text-3xl font-extrabold text-white font-outfit">
              GitHub Technical <span className="glow-text">Portfolio Audit</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Audit public repositories, commit cadence, star count, and compute a Technical Portfolio Score to supplement ATS resumes.
            </p>
          </div>
        </div>

        {/* Username Input Bar */}
        <div className="flex items-center gap-3 max-w-xl">
          <div className="relative flex-1">
            <Github className="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
              placeholder="Enter GitHub username (e.g. alexvance)..."
              className="w-full glass-input pl-10 pr-4 py-3 rounded-2xl text-sm font-medium"
            />
          </div>
          <button
            onClick={handleAudit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 shrink-0"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? 'Auditing...' : 'Audit GitHub'}
          </button>
        </div>
      </div>

      {/* Audit Results Dashboard */}
      {audit && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Technical Score */}
            <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 relative overflow-hidden bg-gradient-to-br from-indigo-950/30 to-slate-900/60">
              <div className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Technical Score
              </div>
              <div className="my-3 flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white font-outfit">{audit.technicalScore}</span>
                <span className="text-slate-500 font-medium">/ 100</span>
              </div>
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Top 5% Developer Tier
              </p>
            </div>

            {/* Total Public Repos */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" /> Public Repositories
              </div>
              <div className="my-3">
                <span className="text-4xl font-extrabold text-white font-outfit">{audit.publicReposCount}</span>
              </div>
              <p className="text-xs text-slate-400">Audited public codebases</p>
            </div>

            {/* Total Stars */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" /> Stargazers Earned
              </div>
              <div className="my-3">
                <span className="text-4xl font-extrabold text-amber-400 font-outfit">{audit.totalStars}</span>
              </div>
              <p className="text-xs text-slate-400">Community stars count</p>
            </div>

            {/* Total Forks */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <GitFork className="w-4 h-4 text-indigo-400" /> Repository Forks
              </div>
              <div className="my-3">
                <span className="text-4xl font-extrabold text-indigo-400 font-outfit">{audit.totalForks}</span>
              </div>
              <p className="text-xs text-slate-400">Project forks & clones</p>
            </div>
          </div>

          {/* Languages & Summary Panel */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Top Tech Stack Languages</h3>
              <div className="flex flex-wrap gap-2">
                {audit.topLanguages.map((lang, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">AI Developer Audit Summary</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{audit.summaryText}</p>
            </div>
          </div>

          {/* Highlighted Repositories */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white font-outfit">Top Audited Public Repositories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {audit.recentRepositories.map((repo, idx) => (
                <div key={idx} className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-indigo-300 font-outfit text-base truncate">{repo.name}</h4>
                      <a href={repo.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">{repo.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs text-slate-400">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 font-mono text-[11px]">
                      {repo.language || 'Code'}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400" /> {repo.stars}</span>
                      <span className="flex items-center gap-1"><GitFork className="w-3.5 h-3.5 text-slate-400" /> {repo.forks}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
