import { DocumentTextIcon, CheckCircleIcon, ClockIcon, XCircleIcon, ArrowPathIcon, ArrowDownTrayIcon, EyeIcon } from '@heroicons/react/24/outline';
import { ProgressBar } from '../ui/ProgressBar';
import { clsx } from 'clsx';

interface Resume {
  id: string;
  title: string;
  fileName: string;
  status: 'draft' | 'published' | 'archived';
  atsScore?: number;
  lastAnalyzed?: Date;
  fileSize: number;
  updatedAt: Date;
}

interface ResumeStatusProps {
  resumes: Resume[];
  onView?: (resume: Resume) => void;
  onAnalyze?: (resume: Resume) => void;
  onDownload?: (resume: Resume) => void;
  onUploadNew?: () => void;
  isAnalyzing?: string | null;
}

const statusConfig = {
  draft: { label: 'Draft', color: 'text-secondary-600 bg-secondary-100', icon: ClockIcon },
  published: { label: 'Published', color: 'text-success-600 bg-success-100', icon: CheckCircleIcon },
  archived: { label: 'Archived', color: 'text-error-600 bg-error-100', icon: XCircleIcon },
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const ResumeStatus: React.FC<ResumeStatusProps> = ({
  resumes,
  onView,
  onAnalyze,
  onDownload,
  onUploadNew,
  isAnalyzing,
}) => {
  if (resumes.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <DocumentTextIcon className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No resumes yet</h3>
          <p className="text-secondary-500 mb-6">Upload your first resume to get started with ATS analysis</p>
          <button onClick={onUploadNew} className="btn-primary">
            Upload Resume
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary-100 text-primary-600">
            <DocumentTextIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Your Resumes</h3>
            <p className="text-sm text-secondary-500">{resumes.length} resume{resumes.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <button onClick={onUploadNew} className="btn-primary text-sm">
          <PlusIcon className="w-4 h-4" />
          Add Resume
        </button>
      </div>

      <div className="card-body p-0">
        <div className="divide-y divide-secondary-200">
          {resumes.map((resume) => (
            <div key={resume.id} className="p-6 hover:bg-secondary-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <DocumentTextIcon className="w-6 h-6 text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h4 className="font-medium text-secondary-900 truncate">{resume.title}</h4>
                      <span className={clsx('px-2 py-0.5 text-xs font-medium rounded-full', statusConfig[resume.status].color)}>
                        {statusConfig[resume.status].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-secondary-500 truncate">{resume.fileName}</p>
                    <div className="mt-2 flex items-center gap-4 text-xs text-secondary-500">
                      <span>{formatFileSize(resume.fileSize)}</span>
                      <span>Updated {resume.updatedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 lg:flex-shrink-0">
                  {resume.atsScore !== undefined && (
                    <div className="hidden lg:flex items-center gap-3 w-48">
                      <ProgressBar
                        value={resume.atsScore}
                        height={6}
                        showLabel
                        color={resume.atsScore >= 80 ? 'success' : resume.atsScore >= 60 ? 'warning' : 'error'}
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {onView && (
                      <button
                        onClick={() => onView(resume)}
                        className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                        aria-label="View resume"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </button>
                    )}
                    {onDownload && (
                      <button
                        onClick={() => onDownload(resume)}
                        className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                        aria-label="Download resume"
                      >
                        <ArrowDownTrayIcon className="w-5 h-5" />
                      </button>
                    )}
                    {onAnalyze && resume.status !== 'archived' && (
                      <button
                        onClick={() => onAnalyze(resume)}
                        disabled={isAnalyzing === resume.id}
                        className="btn-outline text-sm gap-1.5"
                      >
                        {isAnalyzing === resume.id ? (
                          <>
                            <ArrowPathIcon className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <ArrowPathIcon className="w-4 h-4" />
                            Analyze
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {resume.atsScore !== undefined && (
                  <div className="lg:hidden mt-4 pt-4 border-t border-secondary-200">
                    <ProgressBar
                      value={resume.atsScore}
                      height={6}
                      showLabel
                      label="ATS Score"
                      color={resume.atsScore >= 80 ? 'success' : resume.atsScore >= 60 ? 'warning' : 'error'}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

import { PlusIcon } from '@heroicons/react/24/outline';