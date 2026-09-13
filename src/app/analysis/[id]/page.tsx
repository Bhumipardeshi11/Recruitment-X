'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { getAnalysisById } from '@/services/analysis';
import { ATSAnalysis } from '@/types/ats';
import { generateLearningRoadmap } from '@/lib/learningRoadmap';
import { getScoreColor, formatDate, getImpactBadge } from '@/lib/utils';
import {
  ArrowLeft, Download, ExternalLink, CheckCircle, XCircle,
  AlertTriangle, ChevronDown, ChevronUp, Loader2,
  Target, Lightbulb, Wand2, BarChart3, FileText, Check, Layers
} from 'lucide-react';

function ATSScoreGauge({ score }: { score: number }) {
  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 54;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-44 h-44">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="10"
          />
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke={color.stroke}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-4xl font-black ${color.text}`}>
            {score}
          </span>
          <span className="text-slate-500 text-xs font-semibold">
            / 100
          </span>
        </div>
      </div>

      <span
        className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full border ${color.badgeBg}`}
      >
        {score >= 80
          ? 'Excellent Match'
          : score >= 65
          ? 'Good Match'
          : score >= 50
          ? 'Needs Improvement'
          : 'Low Match'}
      </span>
    </div>
  );
}

function CategoryBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  const color = getScoreColor(score);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-slate-600">{label}</span>

        <span className={`text-sm font-bold ${color.text}`}>
          {score}%
        </span>
      </div>

      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            backgroundColor: color.stroke,
          }}
        />
      </div>
    </div>
  );
}

function KeywordBadge({
  word,
  status,
}: {
  word: string;
  status: 'MATCHED' | 'MISSING' | 'PARTIAL';
}) {
  const styles = {
    MATCHED:
      'bg-emerald-50 text-emerald-700 border border-emerald-200',
    MISSING:
      'bg-rose-50 text-rose-700 border border-rose-200',
    PARTIAL:
      'bg-amber-50 text-amber-700 border border-amber-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status === 'MATCHED' && (
        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
      )}

      {status === 'MISSING' && (
        <XCircle className="w-3.5 h-3.5 text-rose-600" />
      )}

      {status === 'PARTIAL' && (
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
      )}

      {word}
    </span>
  );
}

function SectionAuditCard({
  section,
}: {
  section: ATSAnalysis['sectionAudits'][0];
}) {
  const [expanded, setExpanded] = useState(false);

  const statusConfig = {
    PASSED: {
      icon: CheckCircle,
      color: 'text-emerald-600',
      bg: 'border-emerald-200',
    },
    WARNING: {
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'border-amber-200',
    },
    FAILED: {
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'border-rose-200',
    },
  };

  const cfg = statusConfig[section.status];

  return (
    <div
      className={`bg-white rounded-xl border ${cfg.bg} overflow-hidden shadow-sm`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-violet-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <cfg.icon
            className={`w-4 h-4 ${cfg.color} flex-shrink-0`}
          />

          <span className="text-slate-900 font-semibold text-sm">
            {section.name}
          </span>

          <span
            className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.color} bg-slate-50 border border-slate-200`}
          >
            {section.score}/100
          </span>
        </div>

        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-slate-200 pt-3 space-y-3">
          {section.issues.length > 0 && (
            <div>
              <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                Detected Issues
              </p>

              {section.issues.map((issue, i) => (
                <p
                  key={i}
                  className="text-sm text-rose-600 flex gap-2 mb-1.5"
                >
                  <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
                  {issue}
                </p>
              ))}
            </div>
          )}

          {section.suggestions.length > 0 && (
            <div>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                Recommendations
              </p>

              {section.suggestions.map((s, i) => (
                <p
                  key={i}
                  className="text-sm text-slate-600 flex gap-2 mb-1.5"
                >
                  <Lightbulb className="w-4 h-4 flex-shrink-0 mt-0.5 text-violet-500" />
                  {s}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'overview' | 'keywords' | 'skills' | 'roadmap' | 'sections' | 'recommendations'
  >('overview');

  const [keywordFilter, setKeywordFilter] = useState<
    'ALL' | 'MATCHED' | 'MISSING' | 'PARTIAL'
  >('ALL');

  useEffect(() => {
    getAnalysisById(id)
      .then((data) => {
        setAnalysis(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
        <XCircle className="w-12 h-12 text-rose-400" />

        <h2 className="text-xl font-bold text-slate-900">
          Analysis Not Found
        </h2>

        <Link
          href="/history"
          className="text-violet-600 hover:underline"
        >
          ← Back to History
        </Link>
      </div>
    );
  }

  const missingKeywords = analysis.skillComparison.flatMap(
    (cat) => cat.missingSkills
  );

  const learningRoadmap =
    generateLearningRoadmap(missingKeywords);

  console.log('Missing Keywords:', missingKeywords);
  console.log('Learning Roadmap:', learningRoadmap);

  const allKeywords = analysis.keywordDetails.filter(
    (k) =>
      keywordFilter === 'ALL' ||
      k.status === keywordFilter
  );

  const CATEGORY_LABELS = [
    { key: 'keywordScore', label: 'Keyword Match' },
    { key: 'skillScore', label: 'Skills Match' },
    { key: 'experienceScore', label: 'Experience Match' },
    { key: 'educationScore', label: 'Education Match' },
    { key: 'formattingScore', label: 'Resume Formatting' },
    { key: 'structureScore', label: 'Resume Structure' },
  ] as const;

  const TABS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'keywords', label: 'Keywords', icon: Target },
    { id: 'skills', label: 'Skills Matrix', icon: CheckCircle },
    { id: 'roadmap', label: 'Learning Roadmap', icon: Layers },
    { id: 'sections', label: 'Section Audit', icon: AlertTriangle },
    { id: 'recommendations', label: 'AI Suggestions', icon: Lightbulb },
  ] as const;

  return (
    <div className="jankoti-light min-h-screen bg-slate-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Top Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
          <div>
            <button
              onClick={() => router.push('/history')}
              className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm mb-3 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to History
            </button>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {analysis.jobTitle}
              </h1>
            </div>

            {analysis.targetCompany && (
              <p className="text-violet-600 font-semibold text-sm mt-0.5">
                {analysis.targetCompany}
              </p>
            )}

            <p className="text-slate-500 text-xs mt-1.5 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" />
              {analysis.resumeName} • Evaluated{' '}
              {formatDate(analysis.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/analysis/${id}/improve`}
              id="btn-ai-optimizer"
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-violet-500/20 transition-all hover:scale-[1.02]"
            >
              <Wand2 className="w-4 h-4" />
              AI Bullet Optimizer
            </Link>
          </div>
        </div>

        {/* ATS Score Overview Card */}
        <div className="glass-panel rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-center gap-8">

            <ATSScoreGauge score={analysis.overallScore} />

            <div className="flex-1 w-full">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">
                  Category Score Breakdown
                </h2>

                <span className="text-xs text-slate-500 font-mono">
                  6 Pillars Analyzed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CATEGORY_LABELS.map(({ key, label }) => (
                  <CategoryBar
                    key={key}
                    label={label}
                    score={analysis.categoryScores[key]}
                  />
                ))}
              </div>
            </div>

            <div className="flex lg:flex-col gap-3 w-full lg:w-44 flex-shrink-0">
              {[
                {
                  label: 'Matched Terms',
                  val: analysis.matchedKeywords.length,
                  color: 'text-emerald-600',
                  border: 'border-emerald-200',
                },
                {
                  label: 'Missing Terms',
                  val: analysis.missingKeywords.length,
                  color: 'text-rose-600',
                  border: 'border-rose-200',
                },
                {
                  label: 'Partial Matches',
                  val: analysis.partialKeywords.length,
                  color: 'text-amber-600',
                  border: 'border-amber-200',
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`flex-1 bg-white rounded-xl p-3 border ${stat.border} text-center shadow-sm`}
                >
                  <div
                    className={`text-2xl font-black ${stat.color}`}
                  >
                    {stat.val}
                  </div>

                  <div className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-white rounded-2xl border border-slate-200 mb-6 overflow-x-auto shadow-sm">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
                  : 'text-slate-500 hover:text-violet-600 hover:bg-violet-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Detected Keywords in Resume
              </h3>

              <div className="flex flex-wrap gap-2">
                {analysis.matchedKeywords.map((w) => (
                  <KeywordBadge
                    key={w}
                    word={w}
                    status="MATCHED"
                  />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-slate-900 font-bold mb-4 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-600" />
                Missing Keywords from Job Description
              </h3>

              <div className="flex flex-wrap gap-2">
                {analysis.missingKeywords.length > 0 ? (
                  analysis.missingKeywords.map((w) => (
                    <KeywordBadge
                      key={w}
                      word={w}
                      status="MISSING"
                    />
                  ))
                ) : (
                  <p className="text-slate-500 text-sm">
                    No missing keywords found! Exceptional coverage.
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: Keywords */}
        {activeTab === 'keywords' && (
          <div>

            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {(['ALL', 'MATCHED', 'MISSING', 'PARTIAL'] as const).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setKeywordFilter(f)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                      keywordFilter === f
                        ? 'bg-violet-600 border-violet-600 text-white'
                        : 'border-slate-200 text-slate-500 hover:text-violet-600 hover:bg-violet-50'
                    }`}
                  >
                    {f}{' '}
                    {f === 'ALL'
                      ? `(${analysis.keywordDetails.length})`
                      : f === 'MATCHED'
                      ? `(${analysis.matchedKeywords.length})`
                      : f === 'MISSING'
                      ? `(${analysis.missingKeywords.length})`
                      : `(${analysis.partialKeywords.length})`}
                  </button>
                )
              )}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">

                    <th className="text-left px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Keyword
                    </th>

                    <th className="text-left px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider hidden sm:table-cell">
                      Category
                    </th>

                    <th className="text-center px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider hidden md:table-cell">
                      In Resume
                    </th>

                    <th className="text-center px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider hidden md:table-cell">
                      In JD
                    </th>

                    <th className="text-center px-5 py-3.5 text-slate-500 font-bold text-xs uppercase tracking-wider">
                      Match Status
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {allKeywords.map((kw) => (
                    <tr
                      key={kw.word}
                      className="border-b border-slate-100 hover:bg-violet-50/50 transition-colors"
                    >
                      <td className="px-5 py-3.5 text-slate-900 font-semibold">
                        {kw.word}
                      </td>

                      <td className="px-5 py-3.5 text-slate-500 hidden sm:table-cell">
                        {kw.category}
                      </td>

                      <td className="px-5 py-3.5 text-center text-slate-600 hidden md:table-cell font-mono">
                        {kw.countInResume}
                      </td>

                      <td className="px-5 py-3.5 text-center text-slate-600 hidden md:table-cell font-mono">
                        {kw.countInJD}
                      </td>

                      <td className="px-5 py-3.5 text-center">
                        <KeywordBadge
                          word={kw.status}
                          status={kw.status}
                        />
                      </td>
                    </tr>
                  ))}

                  {allKeywords.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-10 text-slate-500"
                      >
                        No keywords match this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Skills */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analysis.skillComparison.map((cat) => {
              const pct = Math.round(
                (cat.matchedCount /
                  Math.max(1, cat.requiredCount)) *
                  100
              );

              const col = getScoreColor(pct);

              return (
                <div
                  key={cat.category}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-900 font-bold text-base">
                      {cat.category}
                    </h3>

                    <span
                      className={`text-lg font-black ${col.text}`}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div className="flex gap-2 text-center mb-5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {[
                      {
                        l: 'Required',
                        v: cat.requiredCount,
                        c: 'text-slate-700',
                      },
                      {
                        l: 'Matched',
                        v: cat.matchedCount,
                        c: 'text-emerald-600',
                      },
                      {
                        l: 'Missing',
                        v: cat.missingCount,
                        c: 'text-rose-600',
                      },
                    ].map((s) => (
                      <div key={s.l} className="flex-1">
                        <div
                          className={`text-xl font-bold ${s.c}`}
                        >
                          {s.v}
                        </div>

                        <div className="text-[10px] text-slate-500 uppercase">
                          {s.l}
                        </div>
                      </div>
                    ))}
                  </div>

                  {cat.matchedSkills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2">
                        Matched
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {cat.matchedSkills.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {cat.missingSkills.length > 0 && (
                    <div>
                      <p className="text-xs font-bold text-rose-600 uppercase tracking-wider mb-2">
                        Missing from Resume
                      </p>

                      <div className="flex flex-wrap gap-1.5">
                        {cat.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3.5: Learning Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="space-y-6">

            {/* Roadmap Header */}
            <div className="bg-white rounded-2xl p-6 border border-violet-200 shadow-sm">
              <div className="flex items-center gap-3 mb-3">

                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center">
                  <Layers className="w-6 h-6 text-violet-600" />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Your Learning Roadmap
                  </h2>

                  <p className="text-sm text-slate-500">
                    Personalized roadmap based on your missing job skills
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-slate-600">
                  {missingKeywords.length} skill gaps detected
                </span>
              </div>
            </div>

            {/* Roadmap Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {learningRoadmap.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                >

                  {/* Number + Skill */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">

                      <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900">
                          {item.title}
                        </h3>

                        <p className="text-xs text-violet-600 uppercase tracking-wider">
                          {item.priority} Priority
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-slate-500">
                      {item.duration}
                    </span>
                  </div>

                  {/* Topics */}
                  <div className="mb-5">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      What to Learn
                    </p>

                    <div className="space-y-2">
                      {item.topics.map((topic: string) => (
                        <div
                          key={topic}
                          className="flex items-center gap-2 text-sm text-slate-600"
                        >
                          <Check className="w-4 h-4 text-violet-600" />
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project */}
                  <div className="rounded-xl bg-violet-50 p-4 border border-violet-100">
                    <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
                      Practice Project
                    </p>

                    <p className="text-sm text-slate-600">
                      {item.project}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* Tab 4: Section Audits */}
        {activeTab === 'sections' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {analysis.sectionAudits.map((section) => (
              <SectionAuditCard
                key={section.name}
                section={section}
              />
            ))}
          </div>
        )}

        {/* Tab 5: Recommendations */}
        {activeTab === 'recommendations' && (
          <div className="space-y-4">

            <div className="flex items-center justify-between">
              <p className="text-slate-500 text-sm font-medium">
                {analysis.recommendations.length} Actionable Recommendations
              </p>

              <Link
                href={`/analysis/${id}/improve`}
                className="flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 font-bold transition-colors"
              >
                <Wand2 className="w-4 h-4" />
                Open AI Bullet Optimizer
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {analysis.recommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3 mb-2">

                  <h4 className="text-slate-900 font-bold text-base">
                    {rec.problem}
                  </h4>

                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${getImpactBadge(
                      rec.impact
                    )}`}
                  >
                    {rec.impact} IMPACT
                  </span>
                </div>

                <p className="text-slate-600 text-sm leading-relaxed mb-3">
                  {rec.recommendation}
                </p>

                <span className="text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                  Target Section: {rec.section}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}