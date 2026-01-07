import { clsx } from 'clsx';

// Label: one of these required (exclusive)
type LabelProps =
  | { label: string; 'aria-label'?: never; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label': string; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label'?: never; 'aria-labelledby': string };

// ValueText: exclusive with format
type ValueTextProps =
  | { valueText: string; format?: never }
  | { valueText?: never; format?: string }
  | { valueText?: never; format?: never };

type MeterBaseProps = {
  value: number;
  min?: number;
  max?: number;
  clamp?: boolean;
  showValue?: boolean;
  id?: string;
  className?: string;
  tabIndex?: number;
  'aria-describedby'?: string;
  'data-testid'?: string;
};

export type MeterProps = MeterBaseProps & LabelProps & ValueTextProps;

const clampNumber = (value: number, min: number, max: number, shouldClamp: boolean): number => {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return value;
  }
  return shouldClamp ? Math.min(max, Math.max(min, value)) : value;
};

const calculatePercentage = (value: number, min: number, max: number): number => {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
};

// Format value helper
const formatValueText = (
  value: number,
  formatStr: string | undefined,
  min: number,
  max: number
): string => {
  if (!formatStr) return String(value);
  return formatStr
    .replace('{value}', String(value))
    .replace('{min}', String(min))
    .replace('{max}', String(max));
};

export const Meter: React.FC<MeterProps> = ({
  value,
  min = 0,
  max = 100,
  clamp = true,
  showValue = true,
  label,
  valueText,
  format,
  className,
  ...rest
}) => {
  const normalizedValue = clampNumber(value, min, max, clamp);
  const percentage = calculatePercentage(normalizedValue, min, max);

  // Determine aria-valuetext
  const ariaValueText =
    valueText ?? (format ? formatValueText(normalizedValue, format, min, max) : undefined);

  // Determine display text (valueText takes priority, then format, then raw value)
  const displayText = valueText ? valueText : formatValueText(normalizedValue, format, min, max);

  return (
    <div
      role="meter"
      aria-valuenow={normalizedValue}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={ariaValueText}
      aria-label={label ?? rest['aria-label']}
      aria-labelledby={rest['aria-labelledby']}
      className={clsx('apg-meter', className)}
      id={rest.id}
      tabIndex={rest.tabIndex}
      aria-describedby={rest['aria-describedby']}
      data-testid={rest['data-testid']}
    >
      {label && (
        <span className="apg-meter-label" aria-hidden="true">
          {label}
        </span>
      )}
      <div className="apg-meter-track" aria-hidden="true">
        <div
          className="apg-meter-fill"
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
      </div>
      {showValue && (
        <span className="apg-meter-value" aria-hidden="true">
          {displayText}
        </span>
      )}
    </div>
  );
};
