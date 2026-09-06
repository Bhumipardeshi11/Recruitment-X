import { SparklesIcon, LightBulbIcon, ArrowRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon, AcademicCapIcon, BriefcaseIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { ProgressBar } from '../ui/ProgressBar';
import { clsx } from 'clsx';

interface Recommendation {
  id: string;
  type: 'skill' | 'course' | 'certification' | 'project' | 'profile' | 'job';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number;
  effort: 'low' | 'medium' | 'high';
  actionLabel: string;
  actionUrl?: string;
  onAction?: () => void;
  metadata?: Record<string, any>;
}

interface AIRecommendationsProps {
  recommendations: Recommendation[];
  onAction?: (rec: Recommendation) => void;
  onDismiss?: (recId: string) => void;
  isLoading?: boolean;
  maxVisible?: number;
}

const typeIcons = {
  skill: { icon: LightBulbIcon, color: 'primary', bg: 'bg-primary-100' },
  course: { icon: AcademicCapIcon, color: 'success', bg: 'bg-success-100' },
  certification: { icon: CheckCircleIcon, color: 'warning', bg: 'bg-warning-100' },
  project: { icon: BriefcaseIcon, color: 'secondary', bg: 'bg-secondary-100' },
  profile: { icon: SparklesIcon, color: 'primary', bg: 'bg-primary-100' },
  job: { icon: ChartBarIcon, color: 'success', bg: 'bg-success-100' },
};

const priorityColors = {
  high: 'text-error-600 bg-error-100',
  medium: 'text-warning-600 bg-warning-100',
  low: 'text-success-600 bg-success-100',
};

const effortLabels = {
  low: 'Quick win',
  medium: 'Moderate effort',
  high: 'Significant effort',
};

export const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onAction,
  onDismiss,
  isLoading = false,
  maxVisible = 5,
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">AI Recommendations</h3>
                <p className="text-sm text-secondary-500">Personalized suggestions to boost your career</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-secondary-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
            <SparklesIcon className="w-8 h-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">All caught up!</h3>
          <p className="text-secondary-500">No new recommendations at this time. Check back later!</p>
        </div>
      </div>
    );
  }

  const sortedRecs = [...recommendations].sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  const visibleRecs = sortedRecs.slice(0, maxVisible);

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
            <SparklesIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">AI Recommendations</h3>
            <p className="text-sm text-secondary-500">{recommendations.length} personalized suggestions</p>
          </div>
        </div>
      </div>

      <div className="card-body p-0">
        <div className="divide-y divide-secondary-200">
          {visibleRecs.map((rec) => {
            const typeInfo = typeIcons[rec.type];
            const Icon = typeInfo.icon;

            return (
              <div key={rec.id} className="p-6 hover:bg-secondary-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={clsx('w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0', typeInfo.bg)}>
                      <Icon className={clsx('w-6 h-6', `text-${typeInfo.color}-600`)} />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <h4 className="font-medium text-secondary-900">{rec.title}</h4>
                        <span className={clsx('px-2 py-0.5 text-xs font-medium rounded-full', priorityColors[rec.priority])}>
                          {rec.priority.charAt(0).toUpperCase() + rec.priority.slice(1)} Priority
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-secondary-600">{rec.description}</p>
                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-secondary-500">
                        <span className="flex items-center gap-1">
                          <ChartBarIcon className="w-3.5 h-3.5" />
                          Impact: {rec.impact}%
                        </span>
                        <span className="flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          Effort: {effortLabels[rec.effort]}
                        </span>
                        <span className="flex items-center gap-1">
                          <SparklesIcon className="w-3.5 h-3.5" />
                          {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    <ProgressBar
                      value={rec.impact}
                      width={80}
                      height={6}
                      color={rec.priority === 'high' ? 'error' : rec.priority === 'medium' ? 'warning' : 'success'}
                    />
                    {rec.actionUrl ? (
                      <a
                        href={rec.actionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary text-sm"
                      >
                        {rec.actionLabel}
                        <ArrowRightIcon className="w-4 h-4" />
                      </a>
                    ) : onAction ? (
                      <button
                        onClick={() => onAction(rec)}
                        className="btn-primary text-sm"
                      >
                        {rec.actionLabel}
                        <ArrowRightIcon className="w-4 h-4" />
                      </button>
                    ) : null}
                    {onDismiss && (
                      <button
                        onClick={() => onDismiss(rec.id)}
                        className="p-2 rounded-lg text-secondary-400 hover:text-error-600 hover:bg-error-50 transition-colors"
                        aria-label="Dismiss recommendation"
                      >
                        <XCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {sortedRecs.length > maxVisible && (
            <div className="p-6 text-center">
              <p className="text-secondary-500 text-sm">
                And {sortedRecs.length - maxVisible} more recommendations...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};