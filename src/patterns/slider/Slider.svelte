<script lang="ts">
  interface SliderProps {
    defaultValue?: number;
    min?: number;
    max?: number;
    step?: number;
    largeStep?: number;
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    showValue?: boolean;
    label?: string;
    valueText?: string;
    /** Format pattern for dynamic value display (e.g., "{value}%", "{value} of {max}") */
    format?: string;
    onvaluechange?: (value: number) => void;
    [key: string]: unknown;
  }

  let {
    defaultValue,
    min = 0,
    max = 100,
    step = 1,
    largeStep,
    orientation = 'horizontal',
    disabled = false,
    showValue = true,
    label,
    valueText,
    format,
    onvaluechange,
    ...restProps
  }: SliderProps = $props();

  // Utility functions
  function clamp(val: number, minVal: number, maxVal: number): number {
    return Math.min(maxVal, Math.max(minVal, val));
  }

  function roundToStep(val: number, stepVal: number, minVal: number): number {
    const steps = Math.round((val - minVal) / stepVal);
    const result = minVal + steps * stepVal;
    const decimalPlaces = (stepVal.toString().split('.')[1] || '').length;
    return Number(result.toFixed(decimalPlaces));
  }

  function getPercent(val: number, minVal: number, maxVal: number): number {
    if (maxVal === minVal) return 0;
    return ((val - minVal) / (maxVal - minVal)) * 100;
  }

  // Format value helper
  function formatValueText(
    val: number,
    formatStr: string | undefined,
    minVal: number,
    maxVal: number
  ): string {
    if (!formatStr) return String(val);
    return formatStr
      .replace('{value}', String(val))
      .replace('{min}', String(minVal))
      .replace('{max}', String(maxVal));
  }

  // Generate unique ID for label
  const labelId = `slider-label-${Math.random().toString(36).slice(2, 9)}`;

  // Refs
  let thumbEl: HTMLDivElement | null = null;
  let trackEl: HTMLDivElement | null = null;
  let isDragging = $state(false);

  // State - calculate initial value inline (warnings are acceptable for uncontrolled component)

  let value = $state(clamp(roundToStep(defaultValue ?? min, step, min), min, max));

  // Computed
  const isVertical = $derived(orientation === 'vertical');
  const effectiveLargeStep = $derived(largeStep ?? step * 10);
  const percent = $derived(getPercent(value, min, max));

  const ariaValueText = $derived(
    valueText ?? (format ? formatValueText(value, format, min, max) : undefined)
  );

  const displayText = $derived(valueText ? valueText : formatValueText(value, format, min, max));

  const ariaLabelledby = $derived(restProps['aria-labelledby'] ?? (label ? labelId : undefined));

  // Update value and dispatch event
  function updateValue(newValue: number) {
    const clampedValue = clamp(roundToStep(newValue, step, min), min, max);
    if (clampedValue !== value) {
      value = clampedValue;
      onvaluechange?.(clampedValue);
    }
  }

  // Calculate value from pointer position
  function getValueFromPointer(clientX: number, clientY: number): number {
    if (!trackEl) return value;

    const rect = trackEl.getBoundingClientRect();

    // Guard against zero-size track
    if (rect.width === 0 && rect.height === 0) {
      return value;
    }

    let pct: number;

    if (isVertical) {
      if (rect.height === 0) return value;
      pct = 1 - (clientY - rect.top) / rect.height;
    } else {
      if (rect.width === 0) return value;
      pct = (clientX - rect.left) / rect.width;
    }

    const rawValue = min + pct * (max - min);
    return clamp(roundToStep(rawValue, step, min), min, max);
  }

  // Keyboard handler
  function handleKeyDown(event: KeyboardEvent) {
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
        return;
    }

    event.preventDefault();
    updateValue(newValue);
  }

  // Pointer handlers
  function handlePointerDown(event: PointerEvent) {
    if (disabled) return;

    event.preventDefault();
    if (!thumbEl) return;

    if (typeof thumbEl.setPointerCapture === 'function') {
      thumbEl.setPointerCapture(event.pointerId);
    }
    isDragging = true;
    thumbEl.focus();

    const newValue = getValueFromPointer(event.clientX, event.clientY);
    updateValue(newValue);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!thumbEl) return;

    const hasCapture =
      typeof thumbEl.hasPointerCapture === 'function'
        ? thumbEl.hasPointerCapture(event.pointerId)
        : isDragging;

    if (!hasCapture) return;

    const newValue = getValueFromPointer(event.clientX, event.clientY);
    updateValue(newValue);
  }

  function handlePointerUp(event: PointerEvent) {
    if (thumbEl && typeof thumbEl.releasePointerCapture === 'function') {
      try {
        thumbEl.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore
      }
    }
    isDragging = false;
  }

  // Track click handler
  function handleTrackClick(event: MouseEvent) {
    if (disabled) return;
    if (event.target === thumbEl) return;

    const newValue = getValueFromPointer(event.clientX, event.clientY);
    updateValue(newValue);
    thumbEl?.focus();
  }
</script>

<div
  class="apg-slider {isVertical ? 'apg-slider--vertical' : ''} {disabled
    ? 'apg-slider--disabled'
    : ''} {restProps.class || ''}"
>
  {#if label}
    <span id={labelId} class="apg-slider-label">
      {label}
    </span>
  {/if}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    bind:this={trackEl}
    class="apg-slider-track"
    style="--slider-position: {percent}%"
    onclick={handleTrackClick}
  >
    <div class="apg-slider-fill" aria-hidden="true"></div>
    <div
      bind:this={thumbEl}
      role="slider"
      id={restProps.id}
      tabindex={disabled ? -1 : 0}
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuetext={ariaValueText}
      aria-label={restProps['aria-label']}
      aria-labelledby={ariaLabelledby}
      aria-orientation={isVertical ? 'vertical' : undefined}
      aria-disabled={disabled ? true : undefined}
      aria-describedby={restProps['aria-describedby']}
      data-testid={restProps['data-testid']}
      class="apg-slider-thumb"
      onkeydown={handleKeyDown}
      onpointerdown={handlePointerDown}
      onpointermove={handlePointerMove}
      onpointerup={handlePointerUp}
    ></div>
  </div>
  {#if showValue}
    <span class="apg-slider-value" aria-hidden="true">
      {displayText}
    </span>
  {/if}
</div>
