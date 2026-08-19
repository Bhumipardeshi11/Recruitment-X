import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, Sparkles, RefreshCw, FileText, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { JobService } from '../services/api';

export const JdAnalyzer: React.FC = () => {
  const [jdText, setJdText] = useState<string>(`Senior Full-Stack & Cloud Systems Engineer (React & Express)
Location: San Francisco, CA (Hybrid) | Salary: $150,000 - $190,000

About the Role:
Vanguard AI Labs is looking for a Senior Full-Stack Engineer to lead the architecture of our AI career optimization platform. You will build high-throughput Node.js microservices, Prisma PostgreSQL database layers, and responsive React/TypeScript interfaces.

Qualifications & Required Skills:
- 4+ years experience with React, TypeScript, Node.js, Express, and REST API design.
- Hands-on experience with PostgreSQL and Prisma ORM query optimization.
- Proficiency with AWS cloud services (S3), Docker containerization, and CI/CD GitHub Actions.
- Familiarity with GraphQL, Kubernetes, and AI REST integrations (Gemini / OpenAI).`);

  const [resumeText, setResumeText] = useState<string>(`Alex Vance
Senior Full Stack & AI Engineer
Email: alex.vance@recruitmentx.ai | Location: San Francisco, CA

SUMMARY
Senior Engineer with 5+ years of experience building React applications, Node.js Express REST APIs, PostgreSQL databases with Prisma, and AI integrations.

SKILLS
- Core Tech: React, TypeScript, Node.js, Express, PostgreSQL, Prisma ORM, REST API, Tailwind CSS
- Cloud & Tools: AWS S3, Docker, Git, CI/CD GitHub Actions, Jest

WORK EXPERIENCE
Senior Full Stack Engineer | Vanguard AI Labs (2023 - Present)
- Architected real-time AI career analytics dashboard serving 150,000 monthly active users.
- Optimized PostgreSQL database queries with Prisma ORM, reducing query latency by 45%.`);

  const [result, setResult] = useState<any>({
    jobMatchPercentage: 92,
    extractedRoleTitle: 'Senior Full-Stack & Cloud Systems Engineer',
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'AWS', 'Docker', 'REST API', 'Tailwind CSS', 'CI/CD'],
    missingSkills: ['GraphQL', 'Kubernetes'],
    missingKeywords: ['GRAPHQL SCHEMA', 'KUBERNETES HELM', 'MICROSERVICES ARCHITECTURE'],
    recommendations: [
      'Incorporate missing core skills into your Technical Skills section: GraphQL, Kubernetes.',
      'Add relevant experience bullet points demonstrating work with GRAPHQL SCHEMA, KUBERNETES HELM.',
      'Outstanding alignment! You meet over 85% of required technical skills for this role.',
    ],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleAnalyze = async () => {
    if (!jdText.trim()) return;
    setLoading(true);
    try {
      const res = await JobService.analyzeJd(jdText, resumeText);
      if (res.success && res.data) {
        setResult(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (pct: number) => {
    if (pct >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (pct >= 70) return 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-cyan-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
              <Target className="w-3.5 h-3.5" /> AI Job Description Compatibility Analyzer
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit tracking-tight">
              Job Description <span className="glow-text">Skill Match Engine</span>
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Paste any target job description to automatically extract required skills, technologies, and keywords, and compare them directly against your resume.
            </p>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Analyzing Fit...' : 'Analyze Job Description'}
          </button>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Description Input Zone */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              1. Target Job Description Text
            </h2>
            <span className="text-xs text-slate-400">Paste job requirements</span>
          </div>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            rows={12}
            className="w-full glass-input p-4 rounded-xl text-xs font-sans text-slate-200 resize-none leading-relaxed"
            placeholder="Paste raw job posting requirements and responsibilities..."
          />
        </div>

        {/* Candidate Resume Text Input */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              2. Your Candidate Resume Text
            </h2>
            <span className="text-xs text-indigo-400 font-semibold">Active Resume Loaded</span>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={12}
            className="w-full glass-input p-4 rounded-xl text-xs font-mono text-slate-200 resize-none leading-relaxed"
            placeholder="Paste your active resume plain text..."
          />
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <div className="space-y-8">
          {/* Job Match Score Card */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-cyan-950/20 via-indigo-950/20 to-slate-900/80">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Target Compatibility Score</span>
              <h2 className="text-3xl font-extrabold text-white font-outfit">Job Match: {result.jobMatchPercentage}%</h2>
              <p className="text-xs text-slate-300">
                Target Role: <span className="font-bold text-indigo-300">{result.extractedRoleTitle}</span> • {result.matchedSkills.length} of {result.matchedSkills.length + result.missingSkills.length} required skills verified.
              </p>
            </div>

            <div className="shrink-0 text-center">
              <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center font-extrabold text-4xl font-outfit shadow-2xl ${getMatchColor(result.jobMatchPercentage)}`}>
                {result.jobMatchPercentage}%
              </div>
            </div>
          </div>

          {/* Matched & Missing Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Matched Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Matched Skills ({result.matchedSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.matchedSkills.map((s: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Missing Skills ({result.missingSkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map((s: string, idx: number) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-1.5">
                    + Add {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Missing Keywords Panel */}
          {result.missingKeywords && result.missingKeywords.length > 0 && (
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Missing Secondary Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.missingKeywords.map((kw: string, idx: number) => (
                  <span key={idx} className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 space-y-4">
            <h3 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" /> AI Tailored Optimization Recommendations
            </h3>

            <div className="space-y-3">
              {result.recommendations.map((rec: string, idx: number) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                  <ArrowRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
