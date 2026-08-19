import React, { useState } from 'react';
import { Bot, Sparkles, Send, Copy, Check, MessageSquare, BookOpen, Wand2 } from 'lucide-react';
import { AiService } from '../services/api';

export const AiAssistant: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'cover-letter' | 'interview'>('cover-letter');

  // Cover Letter state
  const [jobTitle, setJobTitle] = useState('Senior Full-Stack Engineer');
  const [companyName, setCompanyName] = useState('Vanguard AI Labs');
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [loadingLetter, setLoadingLetter] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Interview Prep state
  const [prepQuestions] = useState([
    {
      question: 'How do you handle database connection pooling and Prisma transactions under high concurrency in Node.js?',
      keyPoints: [
        'Use Prisma $transaction API for atomic multi-query updates',
        'Configure connection pool limits according to PostgreSQL hardware capacity',
        'Handle transient database network disconnects with exponential retry logic',
      ],
      difficulty: 'Hard',
    },
    {
      question: 'How do you optimize client re-renders and large candidate list virtualization in React?',
      keyPoints: [
        'Utilize react-window / react-virtualized for rendering 1,000+ DOM nodes efficiently',
        'Memoize heavy computation with useMemo and callbacks with useCallback',
        'Separate transient input state from global application state tree',
      ],
      difficulty: 'Medium',
    },
    {
      question: 'Describe your approach to designing real-time ATS resume keyword extraction and scoring algorithms.',
      keyPoints: [
        'Normalize raw text with tokenization and lowercase stem matching',
        'Weight core tech skills higher than generic action verbs',
        'Audit bullet points for quantitative performance metrics',
      ],
      difficulty: 'Hard',
    },
  ]);

  const handleGenerateCoverLetter = async () => {
    if (!jobTitle || !companyName) return;
    setLoadingLetter(true);
    try {
      const res = await AiService.generateCoverLetter({
        resumeSummary: 'Senior Full Stack Engineer with 5+ years experience building React frontends, Express APIs, PostgreSQL databases, and AI features.',
        jobTitle,
        companyName,
      });
      if (res.success && res.data?.coverLetter) {
        setCoverLetter(res.data.coverLetter);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingLetter(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 py-6">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" /> AI Career Copilot & Prep Arena
          </div>
          <h1 className="text-3xl font-extrabold text-white font-outfit">
            AI Assistant & <span className="glow-text">Interview Simulator</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Generate customized cover letters and practice role-specific technical interview questions.
          </p>
        </div>

        {/* Subtab Toggle */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('cover-letter')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'cover-letter' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5" /> Cover Letter AI
          </button>
          <button
            onClick={() => setActiveSubTab('interview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'interview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" /> Interview Prep
          </button>
        </div>
      </div>

      {/* Cover Letter Subtab */}
      {activeSubTab === 'cover-letter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white font-outfit flex items-center gap-2">
              <Wand2 className="w-5 h-5 text-indigo-400" /> Target Job Parameters
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Role Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Target Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full glass-input p-3 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={loadingLetter}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> {loadingLetter ? 'Writing Cover Letter...' : 'Generate Cover Letter'}
            </button>
          </div>

          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white font-outfit">AI Output Cover Letter</h2>
              {coverLetter && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Text'}
                </button>
              )}
            </div>

            <textarea
              value={coverLetter || 'Click "Generate Cover Letter" on the left to write a personalized letter based on your resume and target job requirements.'}
              readOnly
              rows={14}
              className="w-full glass-input p-4 rounded-xl text-xs text-slate-200 resize-none font-sans leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Technical Interview Prep Subtab */}
      {activeSubTab === 'interview' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white font-outfit">Role-Specific Technical Questions & Key Answer Guidelines</h2>

          <div className="space-y-4">
            {prepQuestions.map((q, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-bold text-white font-outfit text-base flex items-start gap-2">
                    <span className="text-indigo-400">Q{idx + 1}.</span> {q.question}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-mono font-bold shrink-0">
                    {q.difficulty}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">Key Technical Answer Concepts:</span>
                  <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                    {q.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx}>{pt}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
