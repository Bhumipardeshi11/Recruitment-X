import React, { useState } from 'react';
import { UploadCloud, CheckCircle2, AlertTriangle, Sparkles, Target, Zap, ArrowRight, RefreshCw, FileText, AlertCircle, Info, ShieldCheck, Layers, BookOpen, UserCheck } from 'lucide-react';
import { AtsService } from '../services/api';
import { AtsAnalysis } from '../types';

export const AtsScorer: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>(`Alex Vance
Senior Full Stack & AI Engineer
Email: alex.vance@recruitmentx.ai | Phone: (415) 890-2341 | Location: San Francisco, CA
LinkedIn: linkedin.com/in/alexvance | GitHub: github.com/alexvance | Web: alexvance.dev

PROFESSIONAL SUMMARY
Passionate Full-Stack Engineer with 5+ years of experience building scalable web applications, REST microservices, and AI features using React, TypeScript, Node.js, Express, and PostgreSQL with Prisma.

TECHNICAL SKILLS
- Frontend: React, TypeScript, Tailwind CSS, Vite, Redux
- Backend: Node.js, Express, PostgreSQL, Prisma ORM, REST API, GraphQL
- Cloud & DevOps: AWS S3, Docker, Git, CI/CD GitHub Actions, Jest

WORK EXPERIENCE
Senior Full Stack Engineer | Vanguard AI Labs (2023 - Present)
- Architected and launched a real-time AI career analytics dashboard serving 150,000 monthly active users.
- Optimized PostgreSQL queries using Prisma ORM, cutting server latency by 45% and reducing database load.
- Integrated OpenAI and Google Gemini REST API endpoints for automated resume summaries.

Software Developer | TechFlow Inc. (2021 - 2023)
- Built 25+ reusable React and TypeScript components for enterprise recruitment platforms.
- Designed secure JWT authentication and role-based access control (RBAC) middleware in Express.

FEATURED PROJECTS
- RecruitmentX Engine: AI-Powered ATS resume scoring engine built with React, Express, Prisma, and PostgreSQL.

EDUCATION
B.S. in Computer Science | UC Berkeley (2021) — GPA: 3.8 / 4.0

CERTIFICATIONS
- AWS Certified Solutions Architect – Associate (2025)`);

  const [targetJd, setTargetJd] = useState<string>(`Senior Full-Stack Engineer Job Description:
We are seeking a Senior Full-Stack Engineer proficient in React, TypeScript, Node.js, Express, PostgreSQL, Prisma, AWS, Docker, and REST APIs to lead the core AI career development platform. Qualifications include 3+ years experience with modern JavaScript frameworks, distributed system design, and AI integrations.`);

  const [analysis, setAnalysis] = useState<AtsAnalysis | null>({
    overallAtsScore: 94,
    keywordMatchScore: 96,
    formattingScore: 90,
    impactScore: 95,
    dimensions: [
      { name: 'Formatting & Layout', score: 90, status: 'EXCELLENT', details: 'Section margins, bullet points, font hierarchy' },
      { name: 'Keyword Alignment', score: 96, status: 'EXCELLENT', details: '10 matching technical terms identified' },
      { name: 'Technical Skills Density', score: 92, status: 'EXCELLENT', details: 'Frontend, Backend, and Database stack verified' },
      { name: 'Work Experience & Impact', score: 95, status: 'EXCELLENT', details: 'Quantitative latency & user volume metrics included' },
      { name: 'Projects & Portfolio', score: 90, status: 'EXCELLENT', details: 'GitHub repository links and live project descriptions' },
      { name: 'Education & Academic', score: 95, status: 'EXCELLENT', details: 'B.S. in Computer Science from UC Berkeley' },
      { name: 'Certifications & Credentials', score: 90, status: 'EXCELLENT', details: 'AWS Certified Solutions Architect verified' },
      { name: 'Contact Information', score: 95, status: 'EXCELLENT', details: 'Email, phone, location, LinkedIn, GitHub' },
      { name: 'ATS Parse Readability', score: 92, status: 'EXCELLENT', details: 'Standard section headers and plain text extractability' },
    ],
    problems: [
      {
        category: 'Keywords',
        severity: 'MEDIUM',
        title: 'Missing Cloud Native Terms (GraphQL, Kubernetes)',
        explanation: 'Senior engineering job descriptions in your region scan for GraphQL API design and Kubernetes container orchestration skills.',
        suggestion: 'Add GraphQL or Kubernetes project highlights under your technical skills section.',
      },
      {
        category: 'Experience',
        severity: 'LOW',
        title: 'DevLabs Experience Bullets Lack Quantitative Metrics',
        explanation: 'Earlier work experience bullet points describe responsibilities without measurable impact percentages.',
        suggestion: 'Quantify achievements (e.g., "Improved UI render time by 28% across 20+ components").',
      },
    ],
    matchedKeywords: ['React', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'AWS', 'Docker', 'REST API'],
    missingKeywords: ['GraphQL', 'Kubernetes'],
    weakBullets: [
      'Built 25+ reusable React and TypeScript components for enterprise recruitment platforms.',
    ],
    strengths: [
      'High density of high-value backend & frontend keywords (React, TypeScript, Express, Prisma)',
      'Complete contact information with valid email, phone, location, and web links',
      'Strong quantitative metrics included (150k MAU, 45% latency reduction)',
    ],
    improvementSuggestions: [
      'Incorporate missing cloud keywords like GraphQL and Kubernetes.',
      'Quantify early career experience at DevLabs with latency or user metrics.',
    ],
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleScan = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const res = await AtsService.scoreResume(resumeText, targetJd);
      if (res.success && res.data) {
        setAnalysis(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 70) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-indigo-500/20 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -z-10"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> 9-Dimension ATS Resume Analyzer Engine
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-outfit tracking-tight">
              RecruitmentX <span className="glow-text">ATS Resume Analyzer</span>
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm sm:text-base leading-relaxed">
              Analyzes Formatting, Keywords, Skills, Experience, Projects, Education, Certifications, Contact Information, and ATS Readability to generate a 0-100 score and problem diagnostics.
            </p>
          </div>
          <button
            onClick={handleScan}
            disabled={loading}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 fill-current" />}
            {loading ? 'Analyzing 9 Dimensions...' : 'Scan Resume Now'}
          </button>
        </div>
      </div>

      {/* Main Input Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Input Zone */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              1. Candidate Resume Text
            </h2>
            <span className="text-xs text-slate-400">Paste plain text or upload file</span>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={12}
            className="w-full glass-input p-4 rounded-xl text-sm font-mono text-slate-200 resize-none leading-relaxed"
            placeholder="Paste raw resume content..."
          />
        </div>

        {/* Target Job Description Input */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Target className="w-5 h-5 text-cyan-400" />
              2. Target Job Description (Optional)
            </h2>
            <span className="text-xs text-cyan-400 font-semibold">For exact match scoring</span>
          </div>

          <textarea
            value={targetJd}
            onChange={(e) => setTargetJd(e.target.value)}
            rows={12}
            className="w-full glass-input p-4 rounded-xl text-sm font-sans text-slate-200 resize-none leading-relaxed"
            placeholder="Paste target job responsibilities and requirements..."
          />
        </div>
      </div>

      {/* Analysis Results Section */}
      {analysis && (
        <div className="space-y-8">
          {/* Top Score Banner & Overall Score */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-indigo-950/20 to-slate-900/80">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">RecruitmentX Composite Rating</span>
              <h2 className="text-3xl font-extrabold text-white font-outfit">Overall ATS Score: {analysis.overallAtsScore} / 100</h2>
              <p className="text-xs text-slate-300">
                Composite evaluation across Formatting, Keywords, Skills, Experience, Projects, Education, Certifications, Contact Info, and ATS Readability.
              </p>
            </div>

            <div className="shrink-0 text-center">
              <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center font-extrabold text-4xl font-outfit shadow-2xl ${getScoreColor(analysis.overallAtsScore)}`}>
                {analysis.overallAtsScore}
              </div>
            </div>
          </div>

          {/* 9-Dimension Audit Radar Grid */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-400" />
              9 Core ATS Dimensions Breakdown
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.dimensions?.map((dim, idx) => (
                <div key={idx} className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{dim.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      dim.status === 'EXCELLENT' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' :
                      dim.status === 'GOOD' ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' :
                      'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                    }`}>
                      {dim.score}%
                    </span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        dim.score >= 85 ? 'bg-emerald-400' : dim.score >= 70 ? 'bg-cyan-400' : 'bg-rose-400'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    ></div>
                  </div>

                  <p className="text-[11px] text-slate-400">{dim.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Problems, Explanations & AI Fix Suggestions */}
          {analysis.problems && analysis.problems.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white font-outfit flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Detected Resume Problems & Explanations ({analysis.problems.length})
              </h2>

              <div className="space-y-4">
                {analysis.problems.map((prob, idx) => (
                  <div key={idx} className="glass-panel p-5 rounded-2xl border border-rose-500/20 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono ${
                          prob.severity === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          prob.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-slate-800 text-slate-300'
                        }`}>
                          {prob.severity} SEVERITY
                        </span>
                        <span className="text-xs font-semibold text-slate-400 font-mono">[{prob.category}]</span>
                      </div>
                      <span className="text-xs font-bold text-white">{prob.title}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">{prob.explanation}</p>

                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-cyan-300 block mb-0.5">AI Fix Suggestion:</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{prob.suggestion}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matched & Missing Keywords */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Matched Keywords ({analysis.matchedKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.matchedKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Missing Keywords ({analysis.missingKeywords.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-rose-500/10 border border-rose-500/30 text-rose-300">
                    + Add {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
