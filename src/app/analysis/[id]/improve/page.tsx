'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/Navbar';
import { getAnalysisById, updateBulletStatus } from '@/services/analysis';
import { ATSAnalysis } from '@/types/ats';
import {
  ArrowLeft,
  Wand2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Info,
  Sparkles,
} from 'lucide-react';

export default function ImprovePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  const [localBullets, setLocalBullets] =
    useState<ATSAnalysis['bulletSuggestions']>([]);

  useEffect(() => {
    getAnalysisById(id)
      .then((data) => {
        setAnalysis(data);
        setLocalBullets(data.bulletSuggestions);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  /* =========================================
     HANDLE ACCEPT / REJECT / UNDO
  ========================================== */

  const handleAction = async (
    bulletId: string,
    status: 'ACCEPTED' | 'REJECTED' | 'PENDING'
  ) => {
    // Update UI immediately
    setLocalBullets((prev) =>
      prev.map((b) =>
        b.id === bulletId
          ? { ...b, status }
          : b
      )
    );

    // Backend currently accepts only ACCEPTED / REJECTED.
    // PENDING is only used locally for Undo.
    if (status === 'PENDING') {
      return;
    }

    await updateBulletStatus(id, bulletId, status);
  };

  /* =========================================
     LOADING
  ========================================== */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-violet-600 animate-spin" />
          </div>

          <p className="text-sm font-semibold text-slate-600">
            Loading AI suggestions...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================
     ANALYSIS NOT FOUND
  ========================================== */

  if (!analysis) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-5 px-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center">
          <XCircle className="w-9 h-9 text-rose-500" />
        </div>

        <div className="text-center">
          <p className="text-slate-900 text-xl font-bold mb-1">
            Analysis Not Found
          </p>

          <p className="text-slate-500 text-sm">
            The requested resume analysis could not be found.
          </p>
        </div>

        <Link
          href="/history"
          className="text-violet-600 hover:text-violet-700 font-semibold text-sm"
        >
          ← Back to History
        </Link>
      </div>
    );
  }

  /* =========================================
     COUNTS
  ========================================== */

  const accepted = localBullets.filter(
    (b) => b.status === 'ACCEPTED'
  ).length;

  const rejected = localBullets.filter(
    (b) => b.status === 'REJECTED'
  ).length;

  const pending = localBullets.filter(
    (b) => !b.status || b.status === 'PENDING'
  ).length;

  /* =========================================
     MAIN UI
  ========================================== */

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* =====================================
            HEADER
        ====================================== */}

        <div className="mb-8">

          <button
            onClick={() => router.push(`/analysis/${id}`)}
            className="flex items-center gap-1.5 text-slate-500 hover:text-violet-600 text-sm font-medium mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to ATS Report
          </button>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

            {/* TITLE */}

            <div>
              <div className="flex items-center gap-3 mb-2">

                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-100 to-fuchsia-100 border border-violet-200 flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-violet-600" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  AI Resume Bullet Optimizer
                </h1>

              </div>

              <p className="text-slate-600 text-sm mt-2 max-w-2xl">
                Review and integrate high-impact ATS keywords into your
                accomplishment statements.
              </p>
            </div>

            {/* STATUS SUMMARY */}

            <div className="flex flex-wrap items-center gap-2">

              {/* ACCEPTED */}

              <div className="bg-white px-3.5 py-2 rounded-xl border border-emerald-200 shadow-sm text-emerald-700 font-bold text-sm">
                ✓ {accepted} Accepted
              </div>

              {/* PENDING */}

              <div className="bg-white px-3.5 py-2 rounded-xl border border-amber-200 shadow-sm text-amber-700 font-bold text-sm">
                ○ {pending} Pending
              </div>

              {/* REJECTED */}

              <div className="bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm text-slate-600 font-bold text-sm">
                ✕ {rejected} Rejected
              </div>

            </div>
          </div>
        </div>

        {/* =====================================
            RESUME INTEGRITY NOTICE
        ====================================== */}

        <div className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-violet-200 shadow-sm mb-8">

          <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <Info className="w-5 h-5 text-violet-600" />
          </div>

          <div>
            <p className="text-sm text-slate-700 leading-relaxed">
              <strong className="text-violet-700">
                Resume Integrity Notice:
              </strong>{' '}
              AI suggestions are tailored to align with the target job
              requirements. Only accept revisions that truthfully represent
              your authentic background and accomplishments.
            </p>
          </div>

        </div>

        {/* =====================================
            NO SUGGESTIONS
        ====================================== */}

        {localBullets.length === 0 ? (

          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">

            <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center mx-auto mb-5">
              <Wand2 className="w-8 h-8 text-violet-600" />
            </div>

            <h3 className="text-slate-900 font-bold text-lg mb-2">
              No Bullet Suggestions Available
            </h3>

            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
              Run a new scan with a detailed job description to generate
              AI-powered resume bullet suggestions.
            </p>

            <Link
              href="/upload"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-500 hover:from-violet-700 hover:to-fuchsia-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-violet-500/20"
            >
              Analyze New Resume
              <ChevronRight className="w-4 h-4" />
            </Link>

          </div>

        ) : (

          /* =====================================
             BULLET SUGGESTIONS
          ====================================== */

          <div className="space-y-6">

            {localBullets.map((bullet) => {

              const isAccepted =
                bullet.status === 'ACCEPTED';

              const isRejected =
                bullet.status === 'REJECTED';

              const isPending =
                !bullet.status ||
                bullet.status === 'PENDING';

              return (

                <div
                  key={bullet.id}
                  className={`bg-white rounded-2xl border overflow-hidden transition-all shadow-sm ${
                    isAccepted
                      ? 'border-emerald-300'
                      : isRejected
                      ? 'border-slate-200 opacity-70'
                      : 'border-slate-200 hover:border-violet-200 hover:shadow-md'
                  }`}
                >

                  {/* =================================
                      STATUS BAR
                  ================================== */}

                  <div
                    className={`px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b ${
                      isAccepted
                        ? 'border-emerald-100 bg-emerald-50/60'
                        : isRejected
                        ? 'border-slate-100 bg-slate-50'
                        : 'border-violet-100 bg-violet-50/40'
                    }`}
                  >

                    {/* SECTION */}

                    <div className="flex items-center gap-2">

                      <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                        SECTION:
                      </span>

                      <span className="text-xs text-violet-700 font-bold bg-violet-100 px-2.5 py-1 rounded-lg">
                        {bullet.section}
                      </span>

                    </div>

                    {/* STATUS */}

                    <div>

                      {isAccepted && (
                        <span className="flex items-center gap-1.5 w-fit text-xs text-emerald-700 font-bold bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200">

                          <CheckCircle className="w-3.5 h-3.5" />

                          Accepted

                        </span>
                      )}

                      {isRejected && (
                        <span className="flex items-center gap-1.5 w-fit text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">

                          <XCircle className="w-3.5 h-3.5" />

                          Rejected

                        </span>
                      )}

                      {isPending && (
                        <span className="flex items-center gap-1.5 w-fit text-xs text-amber-700 font-bold bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">

                          <AlertTriangle className="w-3.5 h-3.5" />

                          Pending Review

                        </span>
                      )}

                    </div>

                  </div>

                  {/* =================================
                      CONTENT
                  ================================== */}

                  <div className="p-5 sm:p-6">

                    {/* ORIGINAL + AI */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">

                      {/* ORIGINAL */}

                      <div>

                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                          Original Resume Statement
                        </p>

                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm text-slate-700 leading-relaxed min-h-[100px]">
                          {bullet.original}
                        </div>

                      </div>

                      {/* AI OPTIMIZED */}

                      <div>

                        <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">

                          <Sparkles className="w-3.5 h-3.5 text-fuchsia-500" />

                          AI-Optimized Bullet Point

                        </p>

                        <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-4 border border-violet-200 text-sm text-slate-800 leading-relaxed min-h-[100px] font-medium">
                          {bullet.suggested}
                        </div>

                      </div>

                    </div>

                    {/* =================================
                        AI RATIONALE
                    ================================== */}

                    <div className="flex items-start gap-3 bg-violet-50/70 rounded-xl px-4 py-3.5 mb-5 border border-violet-100">

                      <div className="w-7 h-7 rounded-lg bg-white border border-violet-200 flex items-center justify-center flex-shrink-0">
                        <Info className="w-4 h-4 text-violet-600" />
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed">

                        <strong className="text-slate-800">
                          AI Rationale:{' '}
                        </strong>

                        {bullet.explanation}

                      </p>

                    </div>

                    {/* =================================
                        ACCEPT / REJECT BUTTONS
                    ================================== */}

                    {isPending && (

                      <div className="flex flex-wrap items-center gap-3">

                        {/* ACCEPT */}

                        <button
                          onClick={() =>
                            handleAction(
                              bullet.id,
                              'ACCEPTED'
                            )
                          }
                          className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-violet-600/20"
                        >

                          <CheckCircle className="w-4 h-4" />

                          Accept Revision

                        </button>

                        {/* REJECT */}

                        <button
                          onClick={() =>
                            handleAction(
                              bullet.id,
                              'REJECTED'
                            )
                          }
                          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold transition-all border border-slate-200"
                        >

                          <XCircle className="w-4 h-4" />

                          Reject

                        </button>

                      </div>

                    )}

                    {/* =================================
                        UNDO
                    ================================== */}

                    {(isAccepted || isRejected) && (

                      <button
                        onClick={() =>
                          handleAction(
                            bullet.id,
                            'PENDING'
                          )
                        }
                        className="text-xs text-slate-500 hover:text-violet-600 underline font-medium transition-colors"
                      >
                        Undo decision
                      </button>

                    )}

                  </div>

                </div>

              );
            })}

          </div>
        )}

        {/* =====================================
            BOTTOM INFORMATION
        ====================================== */}

        {localBullets.length > 0 && (

          <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">

            <div className="flex items-start gap-3">

              <div className="w-9 h-9 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center flex-shrink-0">

                <Sparkles className="w-4 h-4 text-violet-600" />

              </div>

              <div>

                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  How to use these suggestions
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed">
                  Review each AI suggestion carefully. Accept only the
                  statements that accurately describe your real experience,
                  skills, and achievements. Your resume should always remain
                  truthful and authentic.
                </p>

              </div>

            </div>

          </div>

        )}

      </main>
    </div>
  );
}