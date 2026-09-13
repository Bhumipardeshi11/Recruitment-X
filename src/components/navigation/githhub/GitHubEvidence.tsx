'use client';

import { useState } from 'react';
import {
  Github,
  ExternalLink,
  Star,
  GitFork,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

interface GitHubProject {
  id: number;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  forks: number;
  topics: string[];
  updatedAt: string;
}

interface GitHubResponse {
  username: string;
  total: number;
  projects: GitHubProject[];
}

export default function GitHubEvidence() {
  const [username, setUsername] = useState('');
  const [projects, setProjects] = useState<GitHubProject[]>([]);
  const [searchedUsername, setSearchedUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    const cleanUsername = username.trim();

    if (!cleanUsername) {
      setError('Please enter your GitHub username.');
      return;
    }

    setLoading(true);
    setError('');
    setProjects([]);

    try {
      const response = await fetch(
        `/api/github/projects?username=${encodeURIComponent(cleanUsername)}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Unable to fetch GitHub projects.');
      }

      const result = data as GitHubResponse;

      setProjects(result.projects || []);
      setSearchedUsername(result.username);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong while fetching GitHub projects.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full">
      {/* Main Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
            <Github className="w-6 h-6 text-violet-600" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              GitHub Project Evidence
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Showcase your real coding projects directly from GitHub.
            </p>
          </div>
        </div>

        {/* Username Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label
              htmlFor="github-username"
              className="block text-sm font-semibold text-slate-700 mb-2"
            >
              GitHub Username
            </label>

            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />

              <input
                id="github-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchProjects();
                  }
                }}
                placeholder="e.g. Bhumipardeshi11"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100 transition"
              />
            </div>
          </div>

          <div className="sm:pt-7">
            <button
              type="button"
              onClick={fetchProjects}
              disabled={loading}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold shadow-md shadow-violet-500/20 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  Fetch Projects
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-5 flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200">
            <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />

            <p className="text-sm text-rose-700">
              {error}
            </p>
          </div>
        )}

        {/* Success / Project Count */}
        {searchedUsername && !loading && !error && (
          <div className="mt-6 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />

            <span className="text-slate-700">
              Found{' '}
              <strong className="text-violet-600">
                {projects.length}
              </strong>{' '}
              public project{projects.length !== 1 ? 's' : ''} for{' '}
              <strong className="text-slate-900">
                @{searchedUsername}
              </strong>
            </span>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Your Projects
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="group border border-slate-200 rounded-2xl p-5 bg-white hover:border-violet-300 hover:shadow-lg hover:shadow-violet-100/50 transition-all"
                >
                  {/* Project Name */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <Github className="w-5 h-5 text-slate-700 flex-shrink-0" />

                      <h4 className="font-bold text-slate-900 truncate">
                        {project.name}
                      </h4>
                    </div>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-shrink-0 text-violet-600 hover:text-violet-800 transition"
                      title="View project on GitHub"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-600 mt-3 line-clamp-3 min-h-[60px]">
                    {project.description}
                  </p>

                  {/* Language */}
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {project.language !== 'Not specified' && (
                      <span className="px-2.5 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-semibold">
                        {project.language}
                      </span>
                    )}

                    {project.topics.slice(0, 4).map((topic) => (
                      <span
                        key={topic}
                        className="px-2.5 py-1 rounded-full bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-700 text-xs font-semibold"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <Star className="w-4 h-4" />
                      {project.stars}
                    </div>

                    <div className="flex items-center gap-1.5 text-sm text-slate-500">
                      <GitFork className="w-4 h-4" />
                      {project.forks}
                    </div>

                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-sm font-semibold text-violet-600 hover:text-violet-800 transition"
                    >
                      View Project →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Projects */}
        {searchedUsername &&
          !loading &&
          !error &&
          projects.length === 0 && (
            <div className="mt-6 text-center py-8 rounded-xl bg-slate-50 border border-slate-200">
              <Github className="w-10 h-10 text-slate-400 mx-auto mb-3" />

              <p className="font-semibold text-slate-700">
                No public repositories found.
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Make sure your GitHub repositories are public.
              </p>
            </div>
          )}
      </div>
    </section>
  );
}