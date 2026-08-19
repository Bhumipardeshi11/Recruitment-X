import React, { useState } from 'react';
import { FileText, Sparkles, Plus, Trash2, Printer, Download, Layout, Wand2 } from 'lucide-react';
import { AiService } from '../services/api';

export const ResumeBuilder: React.FC = () => {
  const [template, setTemplate] = useState<'modern' | 'minimal' | 'executive'>('modern');

  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Alex Vance',
    title: 'Senior Full Stack & AI Engineer',
    email: 'alex.vance@recruitmentx.ai',
    phone: '(415) 890-2341',
    location: 'San Francisco, CA',
    github: 'github.com/alexvance',
    linkedin: 'linkedin.com/in/alexvance',
    website: 'alexvance.dev',
  });

  const [summary, setSummary] = useState(
    'Results-driven Senior Full Stack Engineer with 5+ years of experience architecting distributed Node.js REST services, responsive React interfaces, and AI analytics workflows using TypeScript, Express, and PostgreSQL.'
  );

  const [skills, setSkills] = useState<string[]>([
    'React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma ORM', 'REST API', 'Tailwind CSS', 'AWS S3', 'Docker', 'Google Gemini AI'
  ]);
  const [newSkill, setNewSkill] = useState('');

  const [experiences, setExperiences] = useState([
    {
      company: 'Vanguard AI Labs',
      position: 'Senior Full Stack Engineer',
      location: 'San Francisco, CA',
      period: '2023 - Present',
      bullets: [
        'Architected real-time AI career platform serving 150,000 monthly active users using React and Node.js.',
        'Optimized PostgreSQL queries with Prisma ORM, reducing server response latency by 45%.',
        'Built automated ATS resume scoring algorithms integrating Google Gemini AI REST API endpoints.',
      ],
    },
    {
      company: 'TechFlow Inc.',
      position: 'Software Developer',
      location: 'San Jose, CA',
      period: '2021 - 2023',
      bullets: [
        'Engineered 25+ reusable TypeScript components for enterprise web applications.',
        'Implemented JWT authentication and role-based access control middleware in Express.',
      ],
    },
  ]);

  const [loadingAi, setLoadingAi] = useState<boolean>(false);

  const handleAddSkill = () => {
    if (!newSkill.trim()) return;
    if (!skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleEnhanceBullets = async (expIndex: number) => {
    setLoadingAi(true);
    try {
      const exp = experiences[expIndex];
      const res = await AiService.enhanceBullets(exp.bullets);
      if (res.success && res.data?.bullets) {
        const updated = [...experiences];
        updated[expIndex].bullets = res.data.bullets;
        setExperiences(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAi(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit flex items-center gap-2">
            <FileText className="w-7 h-7 text-indigo-400" />
            AI Resume Builder & PDF Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Build, polish bullet points with AI, switch templates, and export print-ready PDF resumes.
          </p>
        </div>

        <div className="flex items-center gap-3 no-print">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/30 transition-all"
          >
            <Printer className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Editor Controls */}
        <div className="lg:col-span-6 space-y-6 no-print">
          {/* Template Switcher */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Layout className="w-4 h-4 text-indigo-400" /> Select Resume Layout Template
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['modern', 'minimal', 'executive'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTemplate(t)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    template === t
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {t} Layout
                </button>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Contact & Header</h2>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={personalInfo.fullName}
                  onChange={e => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Title</label>
                <input
                  type="text"
                  value={personalInfo.title}
                  onChange={e => setPersonalInfo({ ...personalInfo, title: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Email</label>
                <input
                  type="text"
                  value={personalInfo.email}
                  onChange={e => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 mb-1 block">Location</label>
                <input
                  type="text"
                  value={personalInfo.location}
                  onChange={e => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Professional Summary</h2>
            <textarea
              value={summary}
              onChange={e => setSummary(e.target.value)}
              rows={3}
              className="w-full glass-input p-3 rounded-xl text-xs text-slate-200 resize-none leading-relaxed"
            />
          </div>

          {/* Skills Editor */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Core Technical Skills</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add skill (e.g., GraphQL)..."
                className="w-full glass-input px-3 py-2 rounded-xl text-xs"
              />
              <button
                onClick={handleAddSkill}
                className="px-3 py-2 rounded-xl bg-indigo-600 text-white font-semibold text-xs shrink-0 hover:bg-indigo-500"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((s, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs border border-slate-700 flex items-center gap-1.5">
                  {s}
                  <Trash2
                    onClick={() => handleRemoveSkill(s)}
                    className="w-3 h-3 text-slate-400 hover:text-rose-400 cursor-pointer"
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Experience Section with AI Polish */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white font-outfit uppercase tracking-wider">Work Experience</h2>
            </div>

            {experiences.map((exp, expIdx) => (
              <div key={expIdx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-indigo-300">{exp.position} @ {exp.company}</span>
                  <button
                    onClick={() => handleEnhanceBullets(expIdx)}
                    disabled={loadingAi}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold hover:bg-indigo-500/20"
                  >
                    <Wand2 className="w-3 h-3 text-cyan-400" />
                    {loadingAi ? 'Polishing...' : 'AI Polish Bullets'}
                  </button>
                </div>
                <div className="space-y-2">
                  {exp.bullets.map((b, bIdx) => (
                    <input
                      key={bIdx}
                      type="text"
                      value={b}
                      onChange={e => {
                        const updated = [...experiences];
                        updated[expIdx].bullets[bIdx] = e.target.value;
                        setExperiences(updated);
                      }}
                      className="w-full glass-input px-3 py-1.5 rounded-lg text-xs"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Live Document Preview Panel */}
        <div className="lg:col-span-6">
          <div className="sticky top-24">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between no-print">
              <span>Live ATS Document Preview ({template} mode)</span>
              <span className="text-emerald-400 font-mono text-[11px]">● Ready for Export</span>
            </div>

            <div className="bg-white text-slate-900 p-8 rounded-2xl shadow-2xl min-h-[700px] text-left border border-slate-200 font-sans leading-normal">
              {/* Header */}
              <div className="border-b border-slate-300 pb-4 mb-4">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">{personalInfo.fullName}</h1>
                <p className="text-sm font-semibold text-indigo-700 mt-0.5">{personalInfo.title}</p>
                <div className="flex flex-wrap gap-3 text-xs text-slate-600 mt-2 font-mono">
                  <span>{personalInfo.email}</span> • <span>{personalInfo.phone}</span> • <span>{personalInfo.location}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-2">Professional Summary</h2>
                <p className="text-xs text-slate-700 leading-relaxed">{summary}</p>
              </div>

              {/* Skills */}
              <div className="mb-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-2">Technical Core Competencies</h2>
                <p className="text-xs text-slate-800 font-mono leading-relaxed">{skills.join(' • ')}</p>
              </div>

              {/* Experience */}
              <div className="mb-4 space-y-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-2">Professional Experience</h2>
                {experiences.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">{exp.position} — <span className="font-semibold text-slate-700">{exp.company}</span></span>
                      <span className="text-[11px] text-slate-500 font-mono">{exp.period}</span>
                    </div>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1 pl-1">
                      {exp.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="leading-snug">{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b border-slate-200 pb-1 mb-1">Education</h2>
                <div className="flex justify-between text-xs text-slate-800">
                  <span className="font-bold">B.S. in Computer Science</span>
                  <span className="text-slate-500 font-mono">UC Berkeley</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
