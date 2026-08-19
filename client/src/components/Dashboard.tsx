import React, { useState } from 'react';
import {
  Search, ChevronDown, Briefcase, Sparkles, TrendingUp, Users, Cpu, FileText,
  Github, Award, CheckCircle2, ArrowRight, MapPin, DollarSign, Building2, ExternalLink, Star, GitFork
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();

  // Search Filter State
  const [skillInput, setSkillInput] = useState<string>('');
  const [experienceLevel, setExperienceLevel] = useState<string>('Fresher / Entry Level');
  const [locationInput, setLocationInput] = useState<string>('');

  const [topJobs] = useState([
    {
      id: 'job-1',
      title: 'Fresher DevOps Engineer',
      company: 'Apex Cloud Systems',
      location: 'Remote',
      salary: '$80,000 - $110,000',
      type: 'Full-Time',
      applications: 51,
      skills: ['Docker', 'AWS', 'Linux', 'CI/CD', 'Git'],
      badge: 'Fresher Friendly',
    },
    {
      id: 'job-2',
      title: 'Data Analyst Intern',
      company: 'Vanguard Analytics',
      location: 'San Francisco, CA',
      salary: '$35 / hr',
      type: 'Internship',
      applications: 42,
      skills: ['Python', 'SQL', 'PostgreSQL', 'Tableau', 'Excel'],
      badge: 'Internship',
    },
    {
      id: 'job-3',
      title: 'Senior Full-Stack & AI Engineer',
      company: 'RecruitmentX AI Labs',
      location: 'Hybrid (San Francisco)',
      salary: '$150,000 - $190,000',
      type: 'Full-Time',
      applications: 89,
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'Prisma', 'PostgreSQL'],
      badge: 'Featured AI Role',
    },
  ]);

  const stats = {
    totalJobs: 890,
    activeUsers: 4442,
    atsScore: 94,
    profileStrength: 92,
    githubScore: 92,
  };

  return (
    <div className="space-y-12 pb-12">
      {/* 1. Hero Section matching reference image template */}
      <section className="bg-gradient-to-b from-purple-100/70 via-purple-50/40 to-slate-50 pt-10 pb-16 px-4 rounded-b-3xl border-b border-purple-100/80">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-outfit tracking-tight leading-tight max-w-4xl mx-auto">
            Discover Jobs, Startups, <span className="text-purple-600 font-extrabold">AI Interview Preparation</span> and Career Opportunities
          </h1>
          <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl mx-auto">
            Explore fresher-friendly roles and apply faster with smart filters.
          </p>

          {/* Metrics & Top Jobs Card (Matching user's picture) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-100/80 max-w-4xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center text-left">
            {/* Left Metric Box 1: Total Jobs */}
            <div className="md:col-span-4 bg-slate-50/80 p-6 rounded-2xl border-t-4 border-t-blue-500 border-slate-200/80 text-center shadow-sm">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 font-outfit block">
                {stats.totalJobs}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2 block">
                Total Jobs
              </span>
            </div>

            {/* Left Metric Box 2: Trusted by Active Users */}
            <div className="md:col-span-4 bg-slate-50/80 p-6 rounded-2xl border-t-4 border-t-cyan-500 border-slate-200/80 text-center shadow-sm">
              <span className="text-4xl sm:text-5xl font-extrabold text-indigo-900 font-outfit block">
                {stats.activeUsers}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2 block">
                Trusted by Active Users
              </span>
            </div>

            {/* Right Widget: Top Jobs by Applications */}
            <div className="md:col-span-4 bg-slate-50/60 p-5 rounded-2xl border border-purple-100/80 space-y-3">
              <div className="border-b border-purple-200/60 pb-2">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
                  <span>Top Jobs by Applications</span>
                </h3>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-slate-200/60">
                  <span className="font-bold text-slate-800">Fresher DevOps Engineer</span>
                  <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md font-mono">51</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-slate-800">Data Analyst Intern</span>
                  <span className="font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md font-mono">42</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Floating Search Filter Bar (Matching user's picture) */}
        <div className="max-w-4xl mx-auto mt-6 px-2">
          <div className="bg-white rounded-full p-2.5 shadow-2xl border border-purple-100 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 w-full md:w-auto">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                placeholder="Search by skills, designation, or..."
                className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-2 px-4 py-2 w-full md:w-auto cursor-pointer">
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value)}
                className="text-xs font-semibold text-slate-700 bg-transparent focus:outline-none cursor-pointer w-full"
              >
                <option>Experience Level</option>
                <option>Fresher / Entry Level</option>
                <option>1-3 Years Experience</option>
                <option>3-5 Years Experience</option>
                <option>Senior (5+ Years)</option>
              </select>
            </div>

            <div className="h-6 w-[1px] bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-2 px-4 py-2 w-full md:w-auto">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={locationInput}
                onChange={e => setLocationInput(e.target.value)}
                placeholder="Location"
                className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <button
              onClick={() => setActiveTab('jobs')}
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3.5 rounded-full text-xs transition-all shadow-md shadow-purple-600/30 shrink-0"
            >
              Search for Jobs
            </button>
          </div>
        </div>
      </section>

      {/* 3. Top Job Postings Section (Matching user's picture) */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 font-outfit">Top Job Postings</h2>
            <p className="text-xs text-slate-500 mt-1">Recommended roles matching your ATS profile skills</p>
          </div>

          <button
            onClick={() => setActiveTab('jobs')}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-md shadow-purple-600/20"
          >
            View All Jobs
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px]">
                    {job.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{job.applications} Applications</span>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-outfit">{job.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-purple-600" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                  </div>
                </div>

                <div className="text-xs font-bold text-purple-700 font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {job.salary}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('jobs')}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-all shadow-sm"
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Integrated RecruitmentX AI Dashboard Widgets */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6">
        <div className="border-t border-slate-200 pt-8">
          <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-600" />
            RecruitmentX AI Career & ATS Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1">Real-time candidate profile scoring, technical skills matrix, and AI recommendations</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: ATS Score */}
          <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider">ATS Score</span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">EXCELLENT</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-slate-900 font-outfit">{stats.atsScore}</span>
              <span className="text-slate-400 text-xs font-medium">/ 100</span>
            </div>
            <button onClick={() => setActiveTab('ats')} className="text-xs text-purple-600 font-bold hover:underline">
              Run ATS Analyzer →
            </button>
          </div>

          {/* Card 2: Profile Strength */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Profile Strength</span>
              <span className="text-emerald-600 font-bold text-xs font-mono">{stats.profileStrength}%</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-emerald-600 font-outfit">{stats.profileStrength}%</span>
              <span className="text-xs text-slate-400">Complete</span>
            </div>
            <button onClick={() => setActiveTab('builder')} className="text-xs text-purple-600 font-bold hover:underline">
              Edit Profile →
            </button>
          </div>

          {/* Card 3: GitHub Portfolio Score */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">GitHub Audit</span>
              <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-[10px] font-bold">VERIFIED</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-purple-700 font-outfit">{stats.githubScore}</span>
              <span className="text-slate-400 text-xs font-medium">/ 100</span>
            </div>
            <button onClick={() => setActiveTab('github')} className="text-xs text-purple-600 font-bold hover:underline">
              View GitHub Audit →
            </button>
          </div>

          {/* Card 4: AI Interview Readiness */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Prep Arena</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 font-outfit">Ready for Practice</span>
              <p className="text-[11px] text-slate-400">3 technical questions generated</p>
            </div>
            <button onClick={() => setActiveTab('ai')} className="text-xs text-purple-600 font-bold hover:underline">
              Start Practice →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
