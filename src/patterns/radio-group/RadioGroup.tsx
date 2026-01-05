import { cn } from '@/lib/utils';
import { useCallback, useId, useMemo, useRef, useState } from 'react';

export interface RadioOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Radio options */
  options: RadioOption[];
  /** Group name for form submission */
  name: string;
  /** Accessible label for the group */
  'aria-label'?: string;
  /** Reference to external label */
  'aria-labelledby'?: string;
  /** Initially selected value */
  defaultValue?: string;
  /** Orientation of the group */
  orientation?: 'horizontal' | 'vertical';
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
  /** Additional CSS class */
  className?: string;
}

export function RadioGroup({
  options,
  name,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  defaultValue,
  orientation = 'vertical',
  onValueChange,
  className,
}: RadioGroupProps): React.ReactElement {
  const instanceId = useId();

  // Filter enabled options for navigation
  const enabledOptions = useMemo(() => options.filter((opt) => !opt.disabled), [options]);

  // Find initial selected value
  const initialValue = useMemo(() => {
    if (defaultValue) {
      const option = options.find((opt) => opt.value === defaultValue);
      if (option && !option.disabled) {
        return defaultValue;
      }
    }
    return '';
  }, [defaultValue, options]);

  const [selectedValue, setSelectedValue] = useState(initialValue);

  // Refs for focus management
  const radioRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Get the index of an option in the enabled options list
  const getEnabledIndex = useCallback(
    (value: string) => enabledOptions.findIndex((opt) => opt.value === value),
    [enabledOptions]
  );

  // Get the tabbable radio: selected one, or first enabled one
  const getTabbableValue = useCallback(() => {
    if (selectedValue && getEnabledIndex(selectedValue) >= 0) {
      return selectedValue;
    }
    return enabledOptions[0]?.value || '';
  }, [selectedValue, enabledOptions, getEnabledIndex]);

  // Focus a radio by value
  const focusRadio = useCallback((value: string) => {
    const radioEl = radioRefs.current.get(value);
    radioEl?.focus();
  }, []);

  // Select a radio
  const selectRadio = useCallback(
    (value: string) => {
      const option = options.find((opt) => opt.value === value);
      if (option && !option.disabled) {
        setSelectedValue(value);
        onValueChange?.(value);
      }
    },
    [options, onValueChange]
  );

  // Navigate to next/previous enabled option with wrapping
  const navigateAndSelect = useCallback(
    (direction: 'next' | 'prev' | 'first' | 'last', currentValue: string) => {
      if (enabledOptions.length === 0) return;

      let targetIndex: number;
      const currentIndex = getEnabledIndex(currentValue);

      switch (direction) {
        case 'next':
          targetIndex = currentIndex >= 0 ? (currentIndex + 1) % enabledOptions.length : 0;
          break;
        case 'prev':
          targetIndex =
            currentIndex >= 0
              ? (currentIndex - 1 + enabledOptions.length) % enabledOptions.length
              : enabledOptions.length - 1;
          break;
        case 'first':
          targetIndex = 0;
          break;
        case 'last':
          targetIndex = enabledOptions.length - 1;
          break;
      }

      const targetOption = enabledOptions[targetIndex];
      if (targetOption) {
        focusRadio(targetOption.value);
        selectRadio(targetOption.value);
      }
    },
    [enabledOptions, getEnabledIndex, focusRadio, selectRadio]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, optionValue: string) => {
      const { key } = event;

      switch (key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          navigateAndSelect('next', optionValue);
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          navigateAndSelect('prev', optionValue);
          break;

        case 'Home':
          event.preventDefault();
          navigateAndSelect('first', optionValue);
          break;

        case 'End':
          event.preventDefault();
          navigateAndSelect('last', optionValue);
          break;

        case ' ':
          event.preventDefault();
          selectRadio(optionValue);
          break;
      }
    },
    [navigateAndSelect, selectRadio]
  );

  const handleClick = useCallback(
    (optionValue: string) => {
      const option = options.find((opt) => opt.value === optionValue);
      if (option && !option.disabled) {
        focusRadio(optionValue);
        selectRadio(optionValue);
      }
    },
    [options, focusRadio, selectRadio]
  );

  const tabbableValue = getTabbableValue();

  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-orientation={orientation === 'horizontal' ? 'horizontal' : undefined}
      className={cn('apg-radio-group', className)}
    >
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={selectedValue} />

      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        const isTabbable = option.value === tabbableValue && !option.disabled;
        const tabIndex = option.disabled ? -1 : isTabbable ? 0 : -1;
        const labelId = `${instanceId}-label-${option.id}`;

        return (
          <div
            key={option.id}
            ref={(el) => {
              if (el) {
                radioRefs.current.set(option.value, el);
              } else {
                radioRefs.current.delete(option.value);
              }
            }}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={option.disabled || undefined}
            aria-labelledby={labelId}
            tabIndex={tabIndex}
            className={cn(
              'apg-radio',
              isSelected && 'apg-radio--selected',
              option.disabled && 'apg-radio--disabled'
            )}
            onClick={() => handleClick(option.value)}
            onKeyDown={(e) => handleKeyDown(e, option.value)}
          >
            <span className="apg-radio-control" aria-hidden="true">
              <span className="apg-radio-indicator" />
            </span>
            <span id={labelId} className="apg-radio-label">
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default RadioGroup;
