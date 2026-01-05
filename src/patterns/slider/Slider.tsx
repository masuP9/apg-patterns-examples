import { clsx } from 'clsx';
import { useCallback, useId, useRef, useState } from 'react';

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

type SliderBaseProps = {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  showValue?: boolean;
  onValueChange?: (value: number) => void;
  className?: string;
  id?: string;
  'aria-describedby'?: string;
  'data-testid'?: string;
};

export type SliderProps = SliderBaseProps & LabelProps & ValueTextProps;

// Clamp value to min/max range
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

// Round value to nearest step
const roundToStep = (value: number, step: number, min: number): number => {
  const steps = Math.round((value - min) / step);
  const result = min + steps * step;
  // Fix floating point precision issues
  const decimalPlaces = (step.toString().split('.')[1] || '').length;
  return Number(result.toFixed(decimalPlaces));
};

// Calculate percentage for visual position
const getPercent = (value: number, min: number, max: number): number => {
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

export const Slider: React.FC<SliderProps> = ({
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  largeStep,
  orientation = 'horizontal',
  disabled = false,
  showValue = true,
  onValueChange,
  label,
  valueText,
  format,
  className,
  id,
  'aria-describedby': ariaDescribedby,
  'data-testid': dataTestId,
  ...rest
}) => {
  // Calculate initial value: defaultValue clamped and rounded to step
  const initialValue = clamp(roundToStep(defaultValue ?? min, step, min), min, max);
  const [value, setValue] = useState(initialValue);

  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const labelId = useId();
  const isVertical = orientation === 'vertical';
  const effectiveLargeStep = largeStep ?? step * 10;

  // Update value and call callback
  const updateValue = useCallback(
    (newValue: number) => {
      const clampedValue = clamp(roundToStep(newValue, step, min), min, max);
      if (clampedValue !== value) {
        setValue(clampedValue);
        onValueChange?.(clampedValue);
      }
    },
    [value, step, min, max, onValueChange]
  );

  // Calculate value from pointer position
  const getValueFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current;
      if (!track) return value;

      const rect = track.getBoundingClientRect();

      // Guard against zero-size track (e.g., in jsdom tests)
      if (rect.width === 0 && rect.height === 0) {
        return value;
      }

      let percent: number;

      if (isVertical) {
        // Vertical: top = max, bottom = min
        if (rect.height === 0) return value;
        percent = 1 - (clientY - rect.top) / rect.height;
      } else {
        // Horizontal: left = min, right = max
        if (rect.width === 0) return value;
        percent = (clientX - rect.left) / rect.width;
      }

      const rawValue = min + percent * (max - min);
      return clamp(roundToStep(rawValue, step, min), min, max);
    },
    [isVertical, min, max, step, value]
  );

  // Keyboard handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return;

      let newValue = value;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = value + step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = value - step;
          break;
        case 'Home':
          newValue = min;
          break;
        case 'End':
          newValue = max;
          break;
        case 'PageUp':
          newValue = value + effectiveLargeStep;
          break;
        case 'PageDown':
          newValue = value - effectiveLargeStep;
          break;
        default:
          return; // Don't prevent default for other keys
      }

      event.preventDefault();
      updateValue(newValue);
    },
    [value, step, min, max, effectiveLargeStep, disabled, updateValue]
  );

  // Track whether we're dragging (for environments without pointer capture support)
  const isDraggingRef = useRef(false);

  // Pointer handlers for drag
  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (disabled) return;

      event.preventDefault();
      const thumb = thumbRef.current;
      if (!thumb) return;

      // Use pointer capture if available
      if (typeof thumb.setPointerCapture === 'function') {
        thumb.setPointerCapture(event.pointerId);
      }
      isDraggingRef.current = true;
      thumb.focus();

      const newValue = getValueFromPointer(event.clientX, event.clientY);
      updateValue(newValue);
    },
    [disabled, getValueFromPointer, updateValue]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      // Check pointer capture or fallback to dragging state
      const hasCapture =
        typeof thumb.hasPointerCapture === 'function'
          ? thumb.hasPointerCapture(event.pointerId)
          : isDraggingRef.current;

      if (!hasCapture) return;

      const newValue = getValueFromPointer(event.clientX, event.clientY);
      updateValue(newValue);
    },
    [getValueFromPointer, updateValue]
  );

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    const thumb = thumbRef.current;
    if (thumb && typeof thumb.releasePointerCapture === 'function') {
      try {
        thumb.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore if pointer capture was not set
      }
    }
    isDraggingRef.current = false;
  }, []);

  // Track click handler
  const handleTrackClick = useCallback(
    (event: React.MouseEvent) => {
      if (disabled) return;

      // Ignore if already handled by thumb
      if (event.target === thumbRef.current) return;

      const newValue = getValueFromPointer(event.clientX, event.clientY);
      updateValue(newValue);
      thumbRef.current?.focus();
    },
    [disabled, getValueFromPointer, updateValue]
  );

  const percent = getPercent(value, min, max);

  // Determine aria-valuetext
  const ariaValueText =
    valueText ?? (format ? formatValueText(value, format, min, max) : undefined);

  // Determine display text
  const displayText = valueText ? valueText : formatValueText(value, format, min, max);

  // Determine aria-labelledby
  const ariaLabelledby = rest['aria-labelledby'] ?? (label ? labelId : undefined);

  return (
    <div
      className={clsx(
        'apg-slider',
        isVertical && 'apg-slider--vertical',
        disabled && 'apg-slider--disabled',
        className
      )}
    >
      {label && (
        <span id={labelId} className="apg-slider-label">
          {label}
        </span>
      )}
      <div
        ref={trackRef}
        className="apg-slider-track"
        style={{ '--slider-position': `${percent}%` } as React.CSSProperties}
        onClick={handleTrackClick}
      >
        <div className="apg-slider-fill" aria-hidden="true" />
        <div
          ref={thumbRef}
          role="slider"
          id={id}
          tabIndex={disabled ? -1 : 0}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={ariaValueText}
          aria-label={rest['aria-label']}
          aria-labelledby={ariaLabelledby}
          aria-orientation={isVertical ? 'vertical' : undefined}
          aria-disabled={disabled ? true : undefined}
          aria-describedby={ariaDescribedby}
          data-testid={dataTestId}
          className="apg-slider-thumb"
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>
      {showValue && (
        <span className="apg-slider-value" aria-hidden="true">
          {displayText}
        </span>
      )}
    </div>
  );
};
