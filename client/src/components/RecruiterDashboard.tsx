import React, { useState } from 'react';
import { Shield, Plus, Users, Award, Github, CheckCircle2, XCircle, Search, Sparkles } from 'lucide-react';
import { JobService } from '../services/api';

export const RecruiterDashboard: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: 'Apex AI Systems',
    location: 'Remote',
    salaryRange: '$140,000 - $180,000',
    description: '',
    requiredSkills: 'React, Node.js, Express, PostgreSQL',
  });

  const [candidates, setCandidates] = useState([
    {
      id: 'cand-1',
      name: 'Alex Vance',
      title: 'Senior Full Stack & AI Engineer',
      atsScore: 94,
      githubScore: 92,
      matchedSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma'],
      status: 'INTERVIEWING',
    },
    {
      id: 'cand-2',
      name: 'David Chen',
      title: 'Backend Systems Developer',
      atsScore: 88,
      githubScore: 85,
      matchedSkills: ['Node.js', 'Express', 'PostgreSQL', 'AWS', 'Docker'],
      status: 'SCREENED',
    },
    {
      id: 'cand-3',
      name: 'Elena Rostova',
      title: 'Frontend UI/UX Engineer',
      atsScore: 82,
      githubScore: 78,
      matchedSkills: ['React', 'TypeScript', 'Tailwind CSS'],
      status: 'APPLIED',
    },
  ]);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.description) return;
    try {
      await JobService.createJob({
        ...newJob,
        requiredSkills: newJob.requiredSkills.split(',').map(s => s.trim()),
      });
      setShowModal(false);
      alert('New job posting created successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  const updateStatus = (candId: string, newStatus: string) => {
    setCandidates(candidates.map(c => c.id === candId ? { ...c, status: newStatus } : c));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" /> Recruiter & Talent Acquisition Dashboard
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">
            Candidate Pipeline & <span className="glow-text">AI Ranker</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Applicants are automatically evaluated and ranked by ATS match score & GitHub technical audit.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-lg shadow-purple-600/30 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" /> Post New Job Description
        </button>
      </div>

      {/* Recruiter Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Job Openings</div>
          <div className="text-3xl font-extrabold text-white font-outfit mt-2">4 Roles</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Candidates Screened</div>
          <div className="text-3xl font-extrabold text-purple-400 font-outfit mt-2">128 Applicants</div>
        </div>
        <div className="glass-panel p-5 rounded-2xl border border-slate-800">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Top Tier ATS Match Rate</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-outfit mt-2">94% Max Match</div>
        </div>
      </div>

      {/* Ranked Candidate Applicants Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-white font-outfit text-lg flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Ranked Applicant Pipeline (Senior Full-Stack Engineer)
          </h2>
          <span className="text-xs text-slate-400">Sorted by AI ATS Compatibility Score</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Candidate Name</th>
                <th className="py-3.5 px-5">AI ATS Match Score</th>
                <th className="py-3.5 px-5">GitHub Score</th>
                <th className="py-3.5 px-5">Matched Skills</th>
                <th className="py-3.5 px-5">Pipeline Stage</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {candidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-900/50 transition-all">
                  <td className="py-4 px-5">
                    <div className="font-bold text-white text-sm">{cand.name}</div>
                    <div className="text-[11px] text-slate-400">{cand.title}</div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-bold font-mono">
                      {cand.atsScore}% Match
                    </span>
                  </td>
                  <td className="py-4 px-5 font-mono text-indigo-300">
                    <span className="flex items-center gap-1">
                      <Github className="w-3.5 h-3.5 text-indigo-400" /> {cand.githubScore}/100
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {cand.matchedSkills.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-slate-900 text-[10px] text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                      cand.status === 'INTERVIEWING' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                      cand.status === 'SCREENED' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {cand.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => updateStatus(cand.id, 'INTERVIEWING')}
                      className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-[11px]"
                    >
                      Schedule Interview
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Post Job Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 max-w-xl w-full space-y-4">
            <h3 className="text-xl font-bold text-white font-outfit">Post New Job Description</h3>
            <form onSubmit={handleCreateJob} className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Job Title</label>
                <input
                  type="text"
                  required
                  value={newJob.title}
                  onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                  placeholder="e.g. Senior Full-Stack Engineer"
                  className="w-full glass-input p-2.5 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newJob.requiredSkills}
                  onChange={e => setNewJob({ ...newJob, requiredSkills: e.target.value })}
                  className="w-full glass-input p-2.5 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Job Description</label>
                <textarea
                  rows={4}
                  required
                  value={newJob.description}
                  onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                  placeholder="Paste responsibilities and requirements..."
                  className="w-full glass-input p-2.5 rounded-xl text-xs resize-none"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold"
                >
                  Publish Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
