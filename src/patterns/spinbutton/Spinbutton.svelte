<script lang="ts">
  import { untrack } from 'svelte';
  import { cn } from '@/lib/utils';

  interface SpinbuttonProps {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    largeStep?: number;
    disabled?: boolean;
    readOnly?: boolean;
    showButtons?: boolean;
    label?: string;
    valueText?: string;
    format?: string;
    onvaluechange?: (value: number) => void;
    [key: string]: unknown;
  }

  let {
    defaultValue = 0,
    min = undefined,
    max = undefined,
    step = 1,
    largeStep,
    disabled = false,
    readOnly = false,
    showButtons = true,
    label,
    valueText,
    format,
    onvaluechange,
    ...restProps
  }: SpinbuttonProps = $props();

  // Utility functions
  function clamp(val: number, minVal?: number, maxVal?: number): number {
    let result = val;
    if (minVal !== undefined) result = Math.max(minVal, result);
    if (maxVal !== undefined) result = Math.min(maxVal, result);
    return result;
  }

  // Ensure step is valid (positive number)
  function ensureValidStep(stepVal: number): number {
    return stepVal > 0 ? stepVal : 1;
  }

  function roundToStep(val: number, stepVal: number, minVal?: number): number {
    const validStep = ensureValidStep(stepVal);
    const base = minVal ?? 0;
    const steps = Math.round((val - base) / validStep);
    const result = base + steps * validStep;
    const decimalPlaces = (validStep.toString().split('.')[1] || '').length;
    return Number(result.toFixed(decimalPlaces));
  }

  // Format value helper
  function formatValueText(
    val: number,
    formatStr: string | undefined,
    minVal?: number,
    maxVal?: number
  ): string {
    if (!formatStr) return String(val);
    return formatStr
      .replace('{value}', String(val))
      .replace('{min}', minVal !== undefined ? String(minVal) : '')
      .replace('{max}', maxVal !== undefined ? String(maxVal) : '');
  }

  // Generate unique ID for label
  const labelId = `spinbutton-label-${Math.random().toString(36).slice(2, 9)}`;

  // Refs
  let inputEl: HTMLInputElement | null = null;
  let isComposing = $state(false);

  // State - use untrack to capture initial values only
  const initialValue = untrack(() => clamp(roundToStep(defaultValue, step, min), min, max));
  let value = $state(initialValue);
  let inputValue = $state(String(initialValue));

  // Computed
  const effectiveLargeStep = $derived(largeStep ?? step * 10);

  const ariaValueText = $derived.by(() => {
    if (valueText) return valueText;
    if (format) return formatValueText(value, format, min, max);
    return undefined;
  });

  const ariaLabelledby = $derived.by(() => {
    if (restProps['aria-labelledby']) return restProps['aria-labelledby'];
    if (label) return labelId;
    return undefined;
  });

  // Update value and dispatch event
  function updateValue(newValue: number) {
    const clampedValue = clamp(roundToStep(newValue, step, min), min, max);
    if (clampedValue !== value) {
      value = clampedValue;
      inputValue = String(clampedValue);
      onvaluechange?.(clampedValue);
    }
  }

  // Keyboard handler
  function handleKeyDown(event: KeyboardEvent) {
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
  }

  // Text input handler
  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    inputValue = target.value;

    if (!isComposing) {
      const parsed = parseFloat(target.value);
      if (!isNaN(parsed)) {
        const clampedValue = clamp(roundToStep(parsed, step, min), min, max);
        if (clampedValue !== value) {
          value = clampedValue;
          onvaluechange?.(clampedValue);
        }
      }
    }
  }

  // Blur handler
  function handleBlur() {
    const parsed = parseFloat(inputValue);

    if (isNaN(parsed)) {
      inputValue = String(value);
    } else {
      const newValue = clamp(roundToStep(parsed, step, min), min, max);
      if (newValue !== value) {
        value = newValue;
        onvaluechange?.(newValue);
      }
      inputValue = String(newValue);
    }
  }

  // IME composition handlers
  function handleCompositionStart() {
    isComposing = true;
  }

  function handleCompositionEnd() {
    isComposing = false;
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed)) {
      const clampedValue = clamp(roundToStep(parsed, step, min), min, max);
      value = clampedValue;
      onvaluechange?.(clampedValue);
    }
  }

  // Button handlers
  function handleIncrement(event: MouseEvent) {
    event.preventDefault();
    if (disabled || readOnly) return;
    updateValue(value + step);
    inputEl?.focus();
  }

  function handleDecrement(event: MouseEvent) {
    event.preventDefault();
    if (disabled || readOnly) return;
    updateValue(value - step);
    inputEl?.focus();
  }
</script>

<div class={cn('apg-spinbutton', disabled && 'apg-spinbutton--disabled', restProps.class)}>
  {#if label}
    <span id={labelId} class="apg-spinbutton-label">
      {label}
    </span>
  {/if}
  <div class="apg-spinbutton-controls">
    {#if showButtons}
      <button
        type="button"
        tabindex={-1}
        aria-label="Decrement"
        {disabled}
        class="apg-spinbutton-button apg-spinbutton-decrement"
        onmousedown={(e) => e.preventDefault()}
        onclick={handleDecrement}
      >
        −
      </button>
    {/if}
    <input
      bind:this={inputEl}
      type="text"
      role="spinbutton"
      id={restProps.id}
      tabindex={disabled ? -1 : 0}
      inputmode="numeric"
      value={inputValue}
      readonly={readOnly}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={ariaValueText}
      aria-label={label ? undefined : restProps['aria-label']}
      aria-labelledby={ariaLabelledby}
      aria-describedby={restProps['aria-describedby']}
      aria-disabled={disabled || undefined}
      aria-readonly={readOnly || undefined}
      aria-invalid={restProps['aria-invalid']}
      data-testid={restProps['data-testid']}
      class="apg-spinbutton-input"
      oninput={handleInput}
      onkeydown={handleKeyDown}
      onblur={handleBlur}
      oncompositionstart={handleCompositionStart}
      oncompositionend={handleCompositionEnd}
    />
    {#if showButtons}
      <button
        type="button"
        tabindex={-1}
        aria-label="Increment"
        {disabled}
        class="apg-spinbutton-button apg-spinbutton-increment"
        onmousedown={(e) => e.preventDefault()}
        onclick={handleIncrement}
      >
        +
      </button>
    {/if}
  </div>
</div>
