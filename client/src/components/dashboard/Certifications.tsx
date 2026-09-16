import { TrophyIcon, CalendarDaysIcon, GlobeAltIcon, PlusIcon, PencilIcon, TrashIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { clsx } from 'clsx';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date | null;
  credentialId?: string;
  credentialUrl?: string;
  featured: boolean;
}

interface CertificationsProps {
  certifications: Certification[];
  onAddCertification?: () => void;
  onEditCertification?: (cert: Certification) => void;
  onDeleteCertification?: (certId: string) => void;
  editable?: boolean;
}

const getStatus = (expiryDate?: Date | null) => {
  if (!expiryDate) return 'valid';
  return new Date() > expiryDate ? 'expired' : 'valid';
};

export const Certifications: React.FC<CertificationsProps> = ({
  certifications,
  onAddCertification,
  onEditCertification,
  onDeleteCertification,
  editable = false,
}) => {
  if (certifications.length === 0) {
    return (
      <div className="card">
        <div className="card-body text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary-100 flex items-center justify-center">
            <AwardIcon className="w-8 h-8 text-secondary-400" />
          </div>
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">No certifications yet</h3>
          <p className="text-secondary-500 mb-6">Add certifications to validate your expertise</p>
          {onAddCertification && (
            <button onClick={onAddCertification} className="btn-primary">
              <PlusIcon className="w-4 h-4" />
              Add Certification
            </button>
          )}
        </div>
      </div>
    );
  }

  const validCerts = certifications.filter(c => getStatus(c.expiryDate) === 'valid');
  const expiredCerts = certifications.filter(c => getStatus(c.expiryDate) === 'expired');

  return (
    <div className="card">
      <div className="card-header flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning-100 text-warning-600">
            <TrophyIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-900">Certifications</h3>
            <p className="text-sm text-secondary-500">
              {validCerts.length} valid • {expiredCerts.length} expired
            </p>
          </div>
        </div>
        {onAddCertification && editable && (
          <button onClick={onAddCertification} className="btn-primary text-sm">
            <PlusIcon className="w-4 h-4" />
            Add Certification
          </button>
        )}
      </div>

      <div className="card-body p-0">
        <div className="divide-y divide-secondary-200">
          {certifications.map((cert) => {
            const status = getStatus(cert.expiryDate);
            const isExpired = status === 'expired';

            return (
              <div key={cert.id} className={clsx('p-6 hover:bg-secondary-50 transition-colors', isExpired && 'opacity-75')}>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={clsx(
                      'w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0',
                      cert.featured ? 'bg-warning-100 text-warning-600' : isExpired ? 'bg-error-100 text-error-600' : 'bg-success-100 text-success-600'
                    )}>
                      {cert.featured ? (
                        <CheckCircleIcon className="w-6 h-6" />
                      ) : isExpired ? (
                        <XCircleIcon className="w-6 h-6" />
                      ) : (
                        <AwardIcon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-start gap-3">
                        <h4 className="font-medium text-secondary-900 truncate">{cert.name}</h4>
                        {cert.featured && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-warning-100 text-warning-700 rounded">
                            Featured
                          </span>
                        )}
                        {isExpired && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-error-100 text-error-700 rounded">
                            Expired
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-secondary-500">{cert.issuer}</p>
                      <div className="mt-2 flex items-center gap-4 text-xs text-secondary-500">
                        <span className="flex items-center gap-1">
                          <CalendarDaysIcon className="w-3.5 h-3.5" />
                          Issued: {cert.issueDate.toLocaleDateString()}
                        </span>
                        {cert.expiryDate && (
                          <span className="flex items-center gap-1">
                            <CalendarDaysIcon className="w-3.5 h-3.5" />
                            Expires: {cert.expiryDate.toLocaleDateString()}
                          </span>
                        )}
                        {cert.credentialId && (
                          <span className="font-mono bg-secondary-100 px-2 py-0.5 rounded">
                            {cert.credentialId}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 lg:flex-shrink-0">
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                        aria-label="Verify credential"
                      >
                        <GlobeAltIcon className="w-5 h-5" />
                      </a>
                    )}
                    {editable && onEditCertification && (
                      <button
                        onClick={() => onEditCertification(cert)}
                        className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-secondary-700 transition-colors"
                        aria-label="Edit certification"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                    {editable && onDeleteCertification && (
                      <button
                        onClick={() => onDeleteCertification(cert.id)}
                        className="p-2 rounded-lg text-secondary-500 hover:bg-secondary-100 hover:text-error-600 transition-colors"
                        aria-label="Delete certification"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};