import { clsx } from 'clsx';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

// Label props: one of these required
type ThumbLabelProps =
  | { 'aria-label': [string, string]; 'aria-labelledby'?: never; getAriaLabel?: never }
  | { 'aria-label'?: never; 'aria-labelledby': [string, string]; getAriaLabel?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; getAriaLabel: (index: number) => string };

type MultiThumbSliderBaseProps = {
  /** Controlled values [lowerValue, upperValue] */
  value?: [number, number];
  /** Initial values for uncontrolled mode [lowerValue, upperValue] */
  defaultValue?: [number, number];
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Large step for PageUp/PageDown (default: step * 10) */
  largeStep?: number;
  /** Minimum distance between thumbs (default: 0) */
  minDistance?: number;
  /** Slider orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Whether slider is disabled */
  disabled?: boolean;
  /** Show value text (default: true) */
  showValues?: boolean;
  /** Format pattern for value display (e.g., "${value}") */
  format?: string;
  /** Function to get aria-valuetext per thumb */
  getAriaValueText?: (value: number, index: number) => string;
  /** Visible label for the group */
  label?: string;
  /** Callback when value changes */
  onValueChange?: (values: [number, number], activeThumbIndex: number) => void;
  /** Callback when change is committed (pointer up / blur) */
  onValueCommit?: (values: [number, number]) => void;
  /** Container className */
  className?: string;
  /** Container id */
  id?: string;
  /** aria-describedby per thumb (tuple or single for both) */
  'aria-describedby'?: string | [string, string];
  /** Test id */
  'data-testid'?: string;
};

export type MultiThumbSliderProps = MultiThumbSliderBaseProps & ThumbLabelProps;

// Utility functions
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const roundToStep = (value: number, step: number, min: number): number => {
  const steps = Math.round((value - min) / step);
  const result = min + steps * step;
  const decimalPlaces = (step.toString().split('.')[1] || '').length;
  return Number(result.toFixed(decimalPlaces));
};

const getPercent = (value: number, min: number, max: number): number => {
  if (max === min) return 0;
  return ((value - min) / (max - min)) * 100;
};

const formatValue = (
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

// Get dynamic bounds for a thumb
const getThumbBounds = (
  index: number,
  values: [number, number],
  min: number,
  max: number,
  minDistance: number
): { min: number; max: number } => {
  // Guard against impossible constraints
  const effectiveMinDistance = Math.min(minDistance, max - min);
  if (index === 0) {
    return { min: min, max: values[1] - effectiveMinDistance };
  } else {
    return { min: values[0] + effectiveMinDistance, max: max };
  }
};

// Normalize values to ensure they are valid
const normalizeValues = (
  values: [number, number],
  min: number,
  max: number,
  step: number,
  minDistance: number
): [number, number] => {
  let [lower, upper] = values;

  // Guard against impossible constraints (minDistance larger than range)
  const effectiveMinDistance = Math.min(minDistance, max - min);

  // Round to step
  lower = roundToStep(lower, step, min);
  upper = roundToStep(upper, step, min);

  // Clamp to absolute bounds
  lower = clamp(lower, min, max - effectiveMinDistance);
  upper = clamp(upper, min + effectiveMinDistance, max);

  // Ensure lower <= upper - effectiveMinDistance
  if (lower > upper - effectiveMinDistance) {
    lower = upper - effectiveMinDistance;
  }

  return [lower, upper];
};

export const MultiThumbSlider: React.FC<MultiThumbSliderProps> = ({
  value: controlledValue,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  minDistance = 0,
  orientation = 'horizontal',
  disabled = false,
  showValues = true,
  format,
  getAriaValueText,
  label,
  onValueChange,
  onValueCommit,
  className,
  id,
  'aria-describedby': ariaDescribedby,
  'data-testid': dataTestId,
  ...rest
}) => {
  // Calculate initial values
  const initialValues = normalizeValues(defaultValue ?? [min, max], min, max, step, minDistance);

  const [internalValues, setInternalValues] = useState<[number, number]>(initialValues);
  const values = controlledValue ?? internalValues;

  // Ref to track latest values for onValueCommit (avoids stale closure)
  const valuesRef = useRef<[number, number]>(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const lowerThumbRef = useRef<HTMLDivElement>(null);
  const upperThumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupLabelId = useId();
  const isVertical = orientation === 'vertical';
  const effectiveLargeStep = largeStep ?? step * 10;

  // Active thumb during drag
  const activeThumbRef = useRef<number | null>(null);

  // Helper to get thumb ref by index
  const getThumbRef = useCallback(
    (index: number) => (index === 0 ? lowerThumbRef : upperThumbRef),
    []
  );

  // Update values
  const updateValues = useCallback(
    (newValues: [number, number], activeIndex: number) => {
      if (!controlledValue) {
        setInternalValues(newValues);
      }
      onValueChange?.(newValues, activeIndex);
    },
    [controlledValue, onValueChange]
  );

  // Update a single thumb value
  const updateThumbValue = useCallback(
    (index: number, newValue: number) => {
      const bounds = getThumbBounds(index, values, min, max, minDistance);
      const rounded = roundToStep(newValue, step, min);
      const clamped = clamp(rounded, bounds.min, bounds.max);

      if (clamped === values[index]) return; // No change

      const newValues: [number, number] = [...values];
      newValues[index] = clamped;
      updateValues(newValues, index);
    },
    [values, min, max, step, minDistance, updateValues]
  );

  // Keyboard handler for a specific thumb
  const handleKeyDown = useCallback(
    (index: number) => (event: React.KeyboardEvent) => {
      if (disabled) return;

      const bounds = getThumbBounds(index, values, min, max, minDistance);
      let newValue = values[index];

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = values[index] + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = values[index] - step;
          break;
        case 'Home':
          newValue = bounds.min;
          break;
        case 'End':
          newValue = bounds.max;
          break;
        case 'PageUp':
          newValue = values[index] + effectiveLargeStep;
          break;
        case 'PageDown':
          newValue = values[index] - effectiveLargeStep;
          break;
        default:
          return;
      }

      event.preventDefault();
      updateThumbValue(index, newValue);
    },
    [values, min, max, step, effectiveLargeStep, minDistance, disabled, updateThumbValue]
  );

  // Calculate value from pointer position
  const getValueFromPointer = useCallback(
    (clientX: number, clientY: number): number => {
      const track = trackRef.current;
      if (!track) return values[0];

      const rect = track.getBoundingClientRect();

      if (rect.width === 0 && rect.height === 0) {
        return values[0];
      }

      let percent: number;

      if (isVertical) {
        if (rect.height === 0) return values[0];
        percent = 1 - (clientY - rect.top) / rect.height;
      } else {
        if (rect.width === 0) return values[0];
        percent = (clientX - rect.left) / rect.width;
      }

      const rawValue = min + percent * (max - min);
      return roundToStep(rawValue, step, min);
    },
    [isVertical, min, max, step, values]
  );

  // Pointer handlers for thumb drag
  const handleThumbPointerDown = useCallback(
    (index: number) => (event: React.PointerEvent) => {
      if (disabled) return;

      event.preventDefault();
      const thumb = getThumbRef(index).current;
      if (!thumb) return;

      if (typeof thumb.setPointerCapture === 'function') {
        thumb.setPointerCapture(event.pointerId);
      }
      activeThumbRef.current = index;
      thumb.focus();
    },
    [disabled, getThumbRef]
  );

  const handleThumbPointerMove = useCallback(
    (index: number) => (event: React.PointerEvent) => {
      const thumb = getThumbRef(index).current;
      if (!thumb) return;

      const hasCapture =
        typeof thumb.hasPointerCapture === 'function'
          ? thumb.hasPointerCapture(event.pointerId)
          : activeThumbRef.current === index;

      if (!hasCapture) return;

      const newValue = getValueFromPointer(event.clientX, event.clientY);
      updateThumbValue(index, newValue);
    },
    [getThumbRef, getValueFromPointer, updateThumbValue]
  );

  const handleThumbPointerUp = useCallback(
    (index: number) => (event: React.PointerEvent) => {
      const thumb = getThumbRef(index).current;
      if (thumb && typeof thumb.releasePointerCapture === 'function') {
        try {
          thumb.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore
        }
      }
      activeThumbRef.current = null;
      // Use ref to get latest values (avoids stale closure issue)
      onValueCommit?.(valuesRef.current);
    },
    [getThumbRef, onValueCommit]
  );

  // Track click handler
  const handleTrackClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return;

      // Ignore if clicked on a thumb
      if (event.target === lowerThumbRef.current || event.target === upperThumbRef.current) {
        return;
      }

      const clickValue = getValueFromPointer(event.clientX, event.clientY);

      // Determine which thumb to move (nearest, prefer lower on tie)
      const distToLower = Math.abs(clickValue - values[0]);
      const distToUpper = Math.abs(clickValue - values[1]);
      const activeIndex = distToLower <= distToUpper ? 0 : 1;

      updateThumbValue(activeIndex, clickValue);
      getThumbRef(activeIndex).current?.focus();
    },
    [disabled, getThumbRef, getValueFromPointer, values, updateThumbValue]
  );

  // Calculate percentages for positioning
  const lowerPercent = getPercent(values[0], min, max);
  const upperPercent = getPercent(values[1], min, max);

  // Get aria-label for a thumb
  const getThumbAriaLabel = (index: number): string | undefined => {
    if ('aria-label' in rest && rest['aria-label']) {
      return rest['aria-label'][index];
    }
    if ('getAriaLabel' in rest && rest.getAriaLabel) {
      return rest.getAriaLabel(index);
    }
    return undefined;
  };

  // Get aria-labelledby for a thumb
  const getThumbAriaLabelledby = (index: number): string | undefined => {
    if ('aria-labelledby' in rest && rest['aria-labelledby']) {
      return rest['aria-labelledby'][index];
    }
    return undefined;
  };

  // Get aria-describedby for a thumb
  const getThumbAriaDescribedby = (index: number): string | undefined => {
    if (!ariaDescribedby) return undefined;
    if (Array.isArray(ariaDescribedby)) {
      return ariaDescribedby[index];
    }
    return ariaDescribedby;
  };

  // Get aria-valuetext for a thumb
  const getThumbAriaValueText = (index: number): string | undefined => {
    const value = values[index];
    if (getAriaValueText) {
      return getAriaValueText(value, index);
    }
    if (format) {
      return formatValue(value, format, min, max);
    }
    return undefined;
  };

  // Get display text for a value
  const getDisplayText = (index: number): string => {
    return formatValue(values[index], format, min, max);
  };

  // Get bounds for a thumb
  const getLowerBounds = () => getThumbBounds(0, values, min, max, minDistance);
  const getUpperBounds = () => getThumbBounds(1, values, min, max, minDistance);

  return (
    <div
      role={label ? 'group' : undefined}
      aria-labelledby={label ? groupLabelId : undefined}
      className={clsx(
        'apg-slider-multithumb',
        isVertical && 'apg-slider-multithumb--vertical',
        disabled && 'apg-slider-multithumb--disabled',
        className
      )}
      id={id}
      data-testid={dataTestId}
    >
      {label && (
        <span id={groupLabelId} className="apg-slider-multithumb-label">
          {label}
        </span>
      )}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        ref={trackRef}
        className="apg-slider-multithumb-track"
        /* eslint-disable @typescript-eslint/consistent-type-assertions -- CSS custom properties require type assertion */
        style={
          {
            '--slider-lower': `${lowerPercent}%`,
            '--slider-upper': `${upperPercent}%`,
          } as React.CSSProperties
        }
        /* eslint-enable @typescript-eslint/consistent-type-assertions */
        onClick={handleTrackClick}
      >
        <div className="apg-slider-multithumb-range" aria-hidden="true" />
        {/* Lower thumb */}
        <div
          ref={lowerThumbRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuenow={values[0]}
          aria-valuemin={min}
          aria-valuemax={getLowerBounds().max}
          aria-valuetext={getThumbAriaValueText(0)}
          aria-label={getThumbAriaLabel(0)}
          aria-labelledby={getThumbAriaLabelledby(0)}
          aria-orientation={isVertical ? 'vertical' : undefined}
          aria-disabled={disabled ? true : undefined}
          aria-describedby={getThumbAriaDescribedby(0)}
          className="apg-slider-multithumb-thumb apg-slider-multithumb-thumb--lower"
          style={isVertical ? { bottom: `${lowerPercent}%` } : { left: `${lowerPercent}%` }}
          onKeyDown={handleKeyDown(0)}
          onPointerDown={handleThumbPointerDown(0)}
          onPointerMove={handleThumbPointerMove(0)}
          onPointerUp={handleThumbPointerUp(0)}
        >
          <span className="apg-slider-multithumb-tooltip" aria-hidden="true">
            {getThumbAriaLabel(0)}
          </span>
        </div>
        {/* Upper thumb */}
        <div
          ref={upperThumbRef}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuenow={values[1]}
          aria-valuemin={getUpperBounds().min}
          aria-valuemax={max}
          aria-valuetext={getThumbAriaValueText(1)}
          aria-label={getThumbAriaLabel(1)}
          aria-labelledby={getThumbAriaLabelledby(1)}
          aria-orientation={isVertical ? 'vertical' : undefined}
          aria-disabled={disabled ? true : undefined}
          aria-describedby={getThumbAriaDescribedby(1)}
          className="apg-slider-multithumb-thumb apg-slider-multithumb-thumb--upper"
          style={isVertical ? { bottom: `${upperPercent}%` } : { left: `${upperPercent}%` }}
          onKeyDown={handleKeyDown(1)}
          onPointerDown={handleThumbPointerDown(1)}
          onPointerMove={handleThumbPointerMove(1)}
          onPointerUp={handleThumbPointerUp(1)}
        >
          <span className="apg-slider-multithumb-tooltip" aria-hidden="true">
            {getThumbAriaLabel(1)}
          </span>
        </div>
      </div>
      {showValues && (
        <div className="apg-slider-multithumb-values" aria-hidden="true">
          <span className="apg-slider-multithumb-value apg-slider-multithumb-value--lower">
            {getDisplayText(0)}
          </span>
          <span className="apg-slider-multithumb-value-separator"> - </span>
          <span className="apg-slider-multithumb-value apg-slider-multithumb-value--upper">
            {getDisplayText(1)}
          </span>
        </div>
      )}
    </div>
  );
};
