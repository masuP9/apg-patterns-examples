import { useId, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

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

type SpinbuttonBaseProps = {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  disabled?: boolean;
  readOnly?: boolean;
  showButtons?: boolean;
  onValueChange?: (value: number) => void;
  className?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: boolean;
  'data-testid'?: string;
};

export type SpinbuttonProps = SpinbuttonBaseProps & LabelProps & ValueTextProps;

// Clamp value to range (only if min/max defined)
const clamp = (value: number, min?: number, max?: number): number => {
  let result = value;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  return result;
};

// Ensure step is valid (positive number)
const ensureValidStep = (step: number): number => {
  return step > 0 ? step : 1;
};

// Round to step with floating-point precision handling
const roundToStep = (value: number, step: number, min?: number): number => {
  const validStep = ensureValidStep(step);
  const base = min ?? 0;
  const steps = Math.round((value - base) / validStep);
  const result = base + steps * validStep;
  // Handle floating-point precision (e.g., 0.1 + 0.2 = 0.30000000000000004)
  const decimals = (validStep.toString().split('.')[1] || '').length;
  return Number(result.toFixed(decimals));
};

// Format value text
const formatValueText = (format: string, value: number, min?: number, max?: number): string => {
  return format
    .replace('{value}', String(value))
    .replace('{min}', min !== undefined ? String(min) : '')
    .replace('{max}', max !== undefined ? String(max) : '');
};

export function Spinbutton(props: SpinbuttonProps) {
  const {
    defaultValue = 0,
    min,
    max,
    step = 1,
    largeStep,
    disabled = false,
    readOnly = false,
    showButtons = true,
    onValueChange,
    className,
    id,
    'aria-describedby': ariaDescribedby,
    'aria-invalid': ariaInvalid,
    'data-testid': dataTestId,
    ...labelProps
  } = props;

  const generatedId = useId();
  const labelId = `${generatedId}-label`;
  const inputRef = useRef<HTMLInputElement>(null);

  // Get label-related props
  const label = 'label' in labelProps ? labelProps.label : undefined;
  const ariaLabel = 'aria-label' in labelProps ? labelProps['aria-label'] : undefined;
  const ariaLabelledby =
    'aria-labelledby' in labelProps ? labelProps['aria-labelledby'] : undefined;

  // Get valueText-related props
  const valueText = 'valueText' in props ? props.valueText : undefined;
  const format = 'format' in props ? props.format : undefined;

  // Initialize value with clamping and rounding
  const initialValue = clamp(roundToStep(defaultValue, step, min), min, max);
  const [value, setValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(String(initialValue));
  const [isComposing, setIsComposing] = useState(false);

  const effectiveLargeStep = largeStep ?? step * 10;

  // Compute aria-valuetext
  const getAriaValueText = (): string | undefined => {
    if (valueText) return valueText;
    if (format) return formatValueText(format, value, min, max);
    return undefined;
  };
  const computedValueText = getAriaValueText();

  // Update value and call callback
  const updateValue = (newValue: number) => {
    const clampedValue = clamp(roundToStep(newValue, step, min), min, max);
    if (clampedValue !== value) {
      setValue(clampedValue);
      setInputValue(String(clampedValue));
      onValueChange?.(clampedValue);
    }
  };

  // Handle keyboard events
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    let newValue = value;
    let handled = false;

    switch (event.key) {
      case 'ArrowUp':
        if (!readOnly) {
          newValue = value + step;
          handled = true;
        }
        break;
      case 'ArrowDown':
        if (!readOnly) {
          newValue = value - step;
          handled = true;
        }
        break;
      case 'Home':
        if (min !== undefined) {
          newValue = min;
          handled = true;
        }
        break;
      case 'End':
        if (max !== undefined) {
          newValue = max;
          handled = true;
        }
        break;
      case 'PageUp':
        if (!readOnly) {
          newValue = value + effectiveLargeStep;
          handled = true;
        }
        break;
      case 'PageDown':
        if (!readOnly) {
          newValue = value - effectiveLargeStep;
          handled = true;
        }
        break;
      default:
        return;
    }

    if (handled) {
      event.preventDefault();
      updateValue(newValue);
    }
  };

  // Handle text input change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = event.target.value;
    setInputValue(newInputValue);

    if (!isComposing) {
      const parsed = parseFloat(newInputValue);
      if (!isNaN(parsed)) {
        const clampedValue = clamp(roundToStep(parsed, step, min), min, max);
        if (clampedValue !== value) {
          setValue(clampedValue);
          onValueChange?.(clampedValue);
        }
      }
    }
  };

  // Handle blur - validate and finalize input
  const handleBlur = () => {
    const parsed = parseFloat(inputValue);

    if (isNaN(parsed)) {
      // Revert to previous valid value
      setInputValue(String(value));
    } else {
      // Clamp and round the value
      const newValue = clamp(roundToStep(parsed, step, min), min, max);
      if (newValue !== value) {
        setValue(newValue);
        onValueChange?.(newValue);
      }
      setInputValue(String(newValue));
    }
  };

  // IME composition handlers
  const handleCompositionStart = () => setIsComposing(true);
  const handleCompositionEnd = () => {
    setIsComposing(false);
    // Validate and update after composition ends
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clampedValue = clamp(roundToStep(parsed, step, min), min, max);
      setValue(clampedValue);
      onValueChange?.(clampedValue);
    }
  };

  // Button handlers
  const handleIncrement = (event: React.MouseEvent) => {
    event.preventDefault();
    if (disabled || readOnly) return;
    updateValue(value + step);
    inputRef.current?.focus();
  };

  const handleDecrement = (event: React.MouseEvent) => {
    event.preventDefault();
    if (disabled || readOnly) return;
    updateValue(value - step);
    inputRef.current?.focus();
  };

  return (
    <div className={cn('apg-spinbutton', disabled && 'apg-spinbutton--disabled', className)}>
      {label && (
        <span className="apg-spinbutton-label" id={labelId}>
          {label}
        </span>
      )}
      <div className="apg-spinbutton-controls">
        {showButtons && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Decrement"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleDecrement}
            disabled={disabled}
            className="apg-spinbutton-button apg-spinbutton-decrement"
          >
            −
          </button>
        )}
        <input
          ref={inputRef}
          type="text"
          role="spinbutton"
          id={id}
          tabIndex={disabled ? -1 : 0}
          inputMode="numeric"
          value={inputValue}
          readOnly={readOnly}
          aria-valuenow={value}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuetext={computedValueText}
          aria-label={ariaLabel}
          aria-labelledby={label ? labelId : ariaLabelledby}
          aria-describedby={ariaDescribedby}
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          aria-invalid={ariaInvalid}
          data-testid={dataTestId}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          className="apg-spinbutton-input"
        />
        {showButtons && (
          <button
            type="button"
            tabIndex={-1}
            aria-label="Increment"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleIncrement}
            disabled={disabled}
            className="apg-spinbutton-button apg-spinbutton-increment"
          >
            +
          </button>
        )}
      </div>
    </div>
  );
}
