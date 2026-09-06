import { clsx } from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  color?: 'primary' | 'success' | 'warning' | 'error' | 'secondary';
  className?: string;
  onClick?: () => void;
}

const colorClasses = {
  primary: 'bg-primary-100 text-primary-600',
  success: 'bg-success-100 text-success-600',
  warning: 'bg-warning-100 text-warning-600',
  error: 'bg-error-100 text-error-600',
  secondary: 'bg-secondary-100 text-secondary-600',
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  color = 'primary',
  className,
  onClick,
}) => {
  return (
    <div
      className={clsx(
        'card p-6 transition-all duration-200 hover:shadow-soft',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-secondary-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-secondary-900">{value}</p>
        </div>
        <div className={clsx('p-3 rounded-xl', colorClasses[color])}>
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center gap-1">
          <span
            className={clsx(
              'text-sm font-medium',
              trend.positive !== false ? 'text-success-600' : 'text-error-600'
            )}
          >
            {trend.positive !== false ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-sm text-secondary-500">{trend.label}</span>
        </div>
      )}
    </div>
  );
};