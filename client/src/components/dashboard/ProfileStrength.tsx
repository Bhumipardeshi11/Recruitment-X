import { UserCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { ProgressRing } from '../ui/ProgressRing';
import { clsx } from 'clsx';

interface ProfileSection {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  required: boolean;
  actionLabel?: string;
  onAction?: () => void;
}

interface ProfileStrengthProps {
  score: number;
  sections: ProfileSection[];
  onSectionClick?: (section: ProfileSection) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'success';
  if (score >= 50) return 'warning';
  return 'error';
};

export const ProfileStrength: React.FC<ProfileStrengthProps> = ({
  score,
  sections,
  onSectionClick,
}) => {
  const completedSections = sections.filter(s => s.completed).length;
  const totalSections = sections.length;

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary-100 text-secondary-600">
            <UserCircleIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Profile Strength</h3>
            <p className="text-sm text-secondary-500">
              {completedSections} of {totalSections} sections complete
            </p>
          </div>
        </div>
      </div>

      <div className="card-body">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col items-center justify-center">
            <ProgressRing
              value={score}
              size={140}
              strokeWidth={10}
              color={getScoreColor(score)}
            >
              <span className="text-3xl font-bold text-secondary-900">{score}%</span>
            </ProgressRing>
            <p className="mt-3 text-center text-secondary-600">
              {score >= 80 && 'Strong profile - stands out to recruiters'}
              {score >= 50 && score < 80 && 'Good foundation - add more details'}
              {score < 50 && 'Needs work - complete missing sections'}
            </p>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-medium text-secondary-900">Profile Sections</h4>
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={clsx(
                    'p-4 rounded-lg border transition-all',
                    section.completed
                      ? 'border-success-200 bg-success-50'
                      : section.required
                      ? 'border-error-200 bg-error-50'
                      : 'border-secondary-200 hover:border-primary-300'
                  )}
                  onClick={() => onSectionClick?.(section)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={clsx(
                          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5',
                          section.completed
                            ? 'bg-success-100 text-success-600'
                            : section.required
                            ? 'bg-error-100 text-error-600'
                            : 'bg-secondary-100 text-secondary-400'
                        )}
                      >
                        {section.completed ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : section.required ? (
                          <ExclamationTriangleIcon className="w-5 h-5" />
                        ) : (
                          <PlusIcon className="w-5 h-5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className={clsx(
                            'font-medium truncate',
                            section.completed ? 'text-secondary-900' : 'text-secondary-700'
                          )}>
                            {section.label}
                          </h5>
                          {section.required && (
                            <span className="px-1.5 py-0.5 text-xs font-medium bg-error-100 text-error-600 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-secondary-500">{section.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {section.completed ? (
                        <CheckCircleIcon className="w-5 h-5 text-success-500" />
                      ) : section.actionLabel && onSectionClick ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSectionClick(section);
                          }}
                          className="btn-outline text-sm"
                        >
                          {section.actionLabel}
                        </button>
                      ) : (
                        <PlusIcon className="w-5 h-5 text-secondary-400" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};