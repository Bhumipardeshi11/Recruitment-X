import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number;
  max?: number;
  height?: number;
  width?: number | string;
  className?: string;
  showLabel?: boolean;
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'error';
  striped?: boolean;
  animated?: boolean;
}

const colorClasses = {
  primary: 'bg-primary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
};

const bgColors = {
  primary: 'bg-primary-100',
  success: 'bg-success-100',
  warning: 'bg-warning-100',
  error: 'bg-error-100',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = 8,
  width,
  className,
  showLabel = false,
  label,
  color = 'primary',
  striped = false,
  animated = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={clsx('w-full', className)} style={{ width }}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-secondary-700">{label}</span>
          {showLabel && (
            <span className={clsx('text-sm font-semibold', colorClasses[color])}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div
        className={clsx(
          'relative overflow-hidden rounded-full',
          bgColors[color],
          `h-${height / 4}`
        )}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-1000 ease-out',
            colorClasses[color],
            striped && 'bg-gradient-to-r from-transparent via-white/30 to-transparent bg-[length:20px_20px]',
            animated && 'animate-pulse'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};