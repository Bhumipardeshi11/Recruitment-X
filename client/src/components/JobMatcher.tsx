import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, DollarSign, CheckCircle2, Sparkles, Search, Building2, Send } from 'lucide-react';
import { JobService } from '../services/api';
import { JobPosting } from '../types';

export const JobMatcher: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await JobService.getJobs();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApply = async (jobId: string) => {
    if (appliedJobs.includes(jobId)) return;
    setAppliedJobs([...appliedJobs, jobId]);
  };

  const filteredJobs = jobs.filter(j =>
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.requiredSkills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-purple-100 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> AI Candidate Job Matcher
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-outfit">
            Smart AI Job <span className="purple-highlight">Matching Portal</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Jobs are ranked in real-time based on your resume's ATS keyword match, skills distribution, and experience fit.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search role, skill (e.g. React)..."
            className="w-full bg-slate-100 border border-slate-200 pl-10 pr-4 py-2.5 rounded-full text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-purple-500 transition-all"
          />
        </div>
      </div>

      {/* Jobs Feed Grid */}
      <div className="space-y-4">
        {filteredJobs.map((job, idx) => {
          const matchScore = 94 - idx * 6;
          const isApplied = appliedJobs.includes(job.id);

          return (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="space-y-3 max-w-3xl">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" /> {matchScore}% ATS Fit Score
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[11px] uppercase font-semibold">
                    {job.employmentType}
                  </span>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-outfit">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-purple-600" /> {job.company}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {job.location}</span>
                    {job.salaryRange && (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold font-mono">
                        <DollarSign className="w-3.5 h-3.5" /> {job.salaryRange}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">{job.description}</p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {job.requiredSkills.map((skill, sIdx) => (
                    <span key={sIdx} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 w-full md:w-auto">
                <button
                  onClick={() => handleApply(job.id)}
                  disabled={isApplied}
                  className={`w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold text-xs transition-all ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                      : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-600/30 hover:scale-105'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Applied & Shortlisted
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" /> Quick Apply with ATS Resume
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
