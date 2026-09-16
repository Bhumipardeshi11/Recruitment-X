import { DocumentTextIcon, CheckCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { ProgressRing } from '../ui/ProgressRing';
import { ProgressBar } from '../ui/ProgressBar';
import { clsx } from 'clsx';

interface ATSBreakdownItem {
  label: string;
  score: number;
  status: 'good' | 'warning' | 'poor';
  description: string;
}

interface ATSScoreProps {
  score: number;
  breakdown?: ATSBreakdownItem[];
  lastAnalyzed?: Date;
  onReanalyze?: () => void;
  isAnalyzing?: boolean;
}

const statusColors = {
  good: 'text-success-600 bg-success-100',
  warning: 'text-warning-600 bg-warning-100',
  poor: 'text-error-600 bg-error-100',
};

export const ATSScore: React.FC<ATSScoreProps> = ({
  score,
  breakdown = [],
  lastAnalyzed,
  onReanalyze,
  isAnalyzing = false,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
            <DocumentTextIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">ATS Score</h3>
            <p className="text-sm text-secondary-500">Applicant Tracking System compatibility</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {lastAnalyzed && (
            <span className="text-xs text-secondary-500">
              Last analyzed: {lastAnalyzed.toLocaleDateString()}
            </span>
          )}
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="btn-outline text-sm gap-1.5"
          >
            {isAnalyzing ? (
              <>
                <ArrowPathIcon className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <ArrowPathIcon className="w-4 h-4" />
                Re-analyze
              </>
            )}
          </button>
        </div>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <ProgressRing
              value={score}
              size={160}
              strokeWidth={10}
              color={getScoreColor(score)}
            >
              <span className="text-4xl font-bold text-secondary-900">{score}</span>
            </ProgressRing>
            <p className="mt-4 text-center text-secondary-600">
              {score >= 80 && 'Excellent ATS compatibility'}
              {score >= 60 && score < 80 && 'Good, but could be improved'}
              {score < 60 && 'Needs significant improvement'}
            </p>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {breakdown.length > 0 ? (
              <div>
                <h4 className="font-medium text-secondary-900 mb-4">Score Breakdown</h4>
                <div className="space-y-4">
{breakdown.map((item, index) => {
                      return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className={clsx(
                                'w-2 h-2 rounded-full',
                                item.status === 'good' && 'bg-success-500',
                                item.status === 'warning' && 'bg-warning-500',
                                item.status === 'poor' && 'bg-error-500'
                              )}
                            />
                            <span className="font-medium text-secondary-900">{item.label}</span>
                            <span
                              className={clsx(
                                'px-2 py-0.5 text-xs font-medium rounded-full',
                                statusColors[item.status]
                              )}
                            >
                              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                            </span>
                          </div>
                          <span className={clsx('font-bold', colorClasses[getScoreColor(item.score)])}>
                            {item.score}%
                          </span>
                        </div>
                        <ProgressBar
                          value={item.score}
                          height={6}
                          color={getScoreColor(item.score)}
                        />
                        <p className="text-xs text-secondary-500 ml-5">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-secondary-500">
                <p>No detailed breakdown available.</p>
                <p className="mt-1 text-sm">Run an analysis to see detailed scores.</p>
              </div>
            )}

            <div className="pt-4 border-t border-secondary-200">
              <h4 className="font-medium text-secondary-900 mb-3">Quick Tips</h4>
              <ul className="space-y-2 text-sm text-secondary-600">
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                  Use standard section headings (Experience, Education, Skills)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                  Include relevant keywords from job descriptions
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                  Avoid graphics, tables, and columns
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircleIcon className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                  Use standard fonts (Arial, Calibri, Helvetica)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const colorClasses = {
  primary: 'text-primary-600',
  success: 'text-success-600',
  warning: 'text-warning-600',
  error: 'text-error-600',
};