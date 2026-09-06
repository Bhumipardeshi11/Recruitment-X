import { BriefcaseIcon, CheckCircleIcon, XCircleIcon, ArrowRightIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { ProgressRing } from '../ui/ProgressRing';
import { ProgressBar } from '../ui/ProgressBar';
import { clsx } from 'clsx';

interface JobMatch {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  salaryRange?: { min: number; max: number };
  postedDate: Date;
}

interface JobMatchScoreProps {
  matches: JobMatch[];
  onViewJob?: (job: JobMatch) => void;
  onApplyJob?: (job: JobMatch) => void;
  isLoading?: boolean;
}

const getMatchColor = (score: number) => {
  if (score >= 80) return 'success';
  if (score >= 60) return 'warning';
  return 'error';
};

const getMatchLabel = (score: number) => {
  if (score >= 80) return 'Excellent Match';
  if (score >= 60) return 'Good Match';
  if (score >= 40) return 'Fair Match';
  return 'Low Match';
};

export const JobMatchScore: React.FC<JobMatchScoreProps> = ({
  matches,
  onViewJob,
  onApplyJob,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
                <BriefcaseIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-secondary-900">Job Matches</h3>
                <p className="text-sm text-secondary-500">AI-powered job recommendations</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-secondary-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <BriefcaseIcon className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No job matches yet</h3>
          <p className="text-secondary-500 mb-6">Complete your profile and upload a resume to get personalized job recommendations</p>
        </div>
      </div>
    );
  }

  const topMatch = matches[0];

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
            <BriefcaseIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Job Matches</h3>
            <p className="text-sm text-secondary-500">{matches.length} matching positions found</p>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <ProgressRing
              value={topMatch.matchScore}
              size={140}
              strokeWidth={10}
              color={getMatchColor(topMatch.matchScore)}
            >
              <span className="text-3xl font-bold text-secondary-900">{topMatch.matchScore}%</span>
            </ProgressRing>
            <p className="mt-3 text-center text-secondary-600">
              {getMatchLabel(topMatch.matchScore)}
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-secondary-500">
              <span className="flex items-center gap-1">
                <CheckCircleIcon className="w-4 h-4 text-success-500" />
                {topMatch.matchedSkills.length} matched
              </span>
              <span className="flex items-center gap-1">
                <XCircleIcon className="w-4 h-4 text-error-500" />
                {topMatch.missingSkills.length} missing
              </span>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Top Match Details</h4>
              <div className="p-4 rounded-lg bg-secondary-50">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div>
                    <h5 className="font-semibold text-secondary-900">{topMatch.title}</h5>
                    <p className="text-secondary-600">{topMatch.company}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-sm text-secondary-500">
                      <span className="flex items-center gap-1">
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        {topMatch.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <BriefcaseIcon className="w-4 h-4" />
                        {topMatch.type}
                      </span>
                      {topMatch.salaryRange && (
                        <span className="font-medium text-success-600">
                          ${topMatch.salaryRange.min.toLocaleString()} - ${topMatch.salaryRange.max.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {onViewJob && (
                      <button onClick={() => onViewJob(topMatch)} className="btn-outline">
                        View Details
                      </button>
                    )}
                    {onApplyJob && (
                      <button onClick={() => onApplyJob(topMatch)} className="btn-primary">
                        <ArrowRightIcon className="w-4 h-4" />
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Skill Match</h4>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h5 className="text-sm font-medium text-success-600 mb-2 flex items-center gap-1">
                    <CheckCircleIcon className="w-4 h-4" />
                    Matched Skills ({topMatch.matchedSkills.length})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {topMatch.matchedSkills.slice(0, 10).map((skill, index) => (
                      <span key={index} className="px-3 py-1 text-sm bg-success-100 text-success-700 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {topMatch.matchedSkills.length > 10 && (
                      <span className="px-3 py-1 text-sm bg-secondary-100 text-secondary-500 rounded-full">
                        +{topMatch.matchedSkills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <h5 className="text-sm font-medium text-error-600 mb-2 flex items-center gap-1">
                    <XCircleIcon className="w-4 h-4" />
                    Missing Skills ({topMatch.missingSkills.length})
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {topMatch.missingSkills.slice(0, 10).map((skill, index) => (
                      <span key={index} className="px-3 py-1 text-sm bg-error-100 text-error-700 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {topMatch.missingSkills.length > 10 && (
                      <span className="px-3 py-1 text-sm bg-secondary-100 text-secondary-500 rounded-full">
                        +{topMatch.missingSkills.length - 10} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-secondary-200">
          <h4 className="font-medium text-secondary-900 mb-4">Other Matches</h4>
          <div className="space-y-3">
            {matches.slice(1, 6).map((match) => (
              <div key={match.id} className="p-4 rounded-lg border border-secondary-200 hover:border-primary-300 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <ProgressRing
                      value={match.matchScore}
                      size={50}
                      strokeWidth={5}
                      showValue
                      color={getMatchColor(match.matchScore)}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium text-secondary-900 truncate">{match.title}</h5>
                        <span className="px-2 py-0.5 text-xs font-medium bg-secondary-100 text-secondary-700 rounded">
                          {match.type}
                        </span>
                      </div>
                      <p className="text-sm text-secondary-500 truncate">{match.company} • {match.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 lg:flex-shrink-0">
                    <div className="hidden lg:block w-24">
                      <ProgressBar
                        value={match.matchScore}
                        height={4}
                        color={getMatchColor(match.matchScore)}
                      />
                    </div>
                    <span className={clsx('text-sm font-semibold', colorClasses[getMatchColor(match.matchScore)])}>
                      {match.matchScore}%
                    </span>
                    {onViewJob && (
                      <button onClick={() => onViewJob(match)} className="btn-outline text-sm">
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
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