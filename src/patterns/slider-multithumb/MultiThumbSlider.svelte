<script lang="ts">
  interface MultiThumbSliderProps {
    defaultValue?: [number, number];
    min?: number;
    max?: number;
    step?: number;
    largeStep?: number;
    minDistance?: number;
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    showValues?: boolean;
    format?: string;
    label?: string;
    ariaLabel?: [string, string];
    ariaLabelledby?: [string, string];
    ariaDescribedby?: string | [string, string];
    getAriaValueText?: (value: number, index: number) => string;
    getAriaLabel?: (index: number) => string;
    onvaluechange?: (values: [number, number], activeThumbIndex: number) => void;
    onvaluecommit?: (values: [number, number]) => void;
    [key: string]: unknown;
  }

  let {
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
    label,
    ariaLabel,
    ariaLabelledby,
    ariaDescribedby,
    getAriaValueText,
    getAriaLabel,
    onvaluechange,
    onvaluecommit,
    ...restProps
  }: MultiThumbSliderProps = $props();

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

  function formatValue(
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

  // Get dynamic bounds for a thumb
  function getThumbBounds(
    index: number,
    currentValues: [number, number],
    minVal: number,
    maxVal: number,
    minDist: number
  ): { min: number; max: number } {
    const effectiveMinDistance = Math.min(minDist, maxVal - minVal);
    if (index === 0) {
      return { min: minVal, max: currentValues[1] - effectiveMinDistance };
    } else {
      return { min: currentValues[0] + effectiveMinDistance, max: maxVal };
    }
  }

  // Normalize values
  function normalizeValues(
    inputValues: [number, number],
    minVal: number,
    maxVal: number,
    stepVal: number,
    minDist: number
  ): [number, number] {
    let [lower, upper] = inputValues;
    const effectiveMinDistance = Math.min(minDist, maxVal - minVal);

    lower = roundToStep(lower, stepVal, minVal);
    upper = roundToStep(upper, stepVal, minVal);

    lower = clamp(lower, minVal, maxVal - effectiveMinDistance);
    upper = clamp(upper, minVal + effectiveMinDistance, maxVal);

    if (lower > upper - effectiveMinDistance) {
      lower = upper - effectiveMinDistance;
    }

    return [lower, upper];
  }

  // Generate unique ID for group label
  const groupLabelId = `slider-multithumb-label-${Math.random().toString(36).slice(2, 9)}`;

  // Refs
  let lowerThumbEl: HTMLDivElement | null = null;
  let upperThumbEl: HTMLDivElement | null = null;
  let trackEl: HTMLDivElement | null = null;
  let activeThumbIndex = $state<number | null>(null);

  // State
  const initialValues = normalizeValues(defaultValue ?? [min, max], min, max, step, minDistance);
  let values = $state<[number, number]>(initialValues);

  // Computed
  const isVertical = $derived(orientation === 'vertical');
  const effectiveLargeStep = $derived(largeStep ?? step * 10);
  const lowerPercent = $derived(getPercent(values[0], min, max));
  const upperPercent = $derived(getPercent(values[1], min, max));

  // Bounds helpers
  const lowerBoundsMax = $derived(getThumbBounds(0, values, min, max, minDistance).max);
  const upperBoundsMin = $derived(getThumbBounds(1, values, min, max, minDistance).min);

  // Update values and dispatch event
  function updateValues(newValues: [number, number], activeIndex: number) {
    values = newValues;
    onvaluechange?.(newValues, activeIndex);
  }

  function updateThumbValue(index: number, newValue: number) {
    const bounds = getThumbBounds(index, values, min, max, minDistance);
    const rounded = roundToStep(newValue, step, min);
    const clamped = clamp(rounded, bounds.min, bounds.max);

    if (clamped === values[index]) return;

    const newValues: [number, number] = [...values];
    newValues[index] = clamped;
    updateValues(newValues, index);
  }

  // Calculate value from pointer position
  function getValueFromPointer(clientX: number, clientY: number): number {
    if (!trackEl) return values[0];

    const rect = trackEl.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      return values[0];
    }

    let pct: number;

    if (isVertical) {
      if (rect.height === 0) return values[0];
      pct = 1 - (clientY - rect.top) / rect.height;
    } else {
      if (rect.width === 0) return values[0];
      pct = (clientX - rect.left) / rect.width;
    }

    const rawValue = min + pct * (max - min);
    return roundToStep(rawValue, step, min);
  }

  // Keyboard handler
  function handleKeyDown(index: number, event: KeyboardEvent) {
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
  }

  // Pointer handlers
  function getThumbEl(index: number): HTMLDivElement | null {
    return index === 0 ? lowerThumbEl : upperThumbEl;
  }

  function handleThumbPointerDown(index: number, event: PointerEvent) {
    if (disabled) return;

    event.preventDefault();
    const thumb = getThumbEl(index);
    if (!thumb) return;

    if (typeof thumb.setPointerCapture === 'function') {
      thumb.setPointerCapture(event.pointerId);
    }
    activeThumbIndex = index;
    thumb.focus();
  }

  function handleThumbPointerMove(index: number, event: PointerEvent) {
    const thumb = getThumbEl(index);
    if (!thumb) return;

    const hasCapture =
      typeof thumb.hasPointerCapture === 'function'
        ? thumb.hasPointerCapture(event.pointerId)
        : activeThumbIndex === index;

    if (!hasCapture) return;

    const newValue = getValueFromPointer(event.clientX, event.clientY);
    updateThumbValue(index, newValue);
  }

  function handleThumbPointerUp(index: number, event: PointerEvent) {
    const thumb = getThumbEl(index);
    if (thumb && typeof thumb.releasePointerCapture === 'function') {
      try {
        thumb.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore
      }
    }
    activeThumbIndex = null;
    onvaluecommit?.(values);
  }

  // Track click handler
  function handleTrackClick(event: MouseEvent) {
    if (disabled) return;
    if (event.target === lowerThumbEl || event.target === upperThumbEl) return;

    const clickValue = getValueFromPointer(event.clientX, event.clientY);

    const distToLower = Math.abs(clickValue - values[0]);
    const distToUpper = Math.abs(clickValue - values[1]);
    const targetIndex = distToLower <= distToUpper ? 0 : 1;

    updateThumbValue(targetIndex, clickValue);
    getThumbEl(targetIndex)?.focus();
  }

  // ARIA helpers
  function getThumbAriaLabelValue(index: number): string | undefined {
    if (ariaLabel) {
      return ariaLabel[index];
    }
    if (getAriaLabel) {
      return getAriaLabel(index);
    }
    return undefined;
  }

  function getThumbAriaLabelledbyValue(index: number): string | undefined {
    if (ariaLabelledby) {
      return ariaLabelledby[index];
    }
    return undefined;
  }

  function getThumbAriaDescribedbyValue(index: number): string | undefined {
    if (!ariaDescribedby) return undefined;
    if (Array.isArray(ariaDescribedby)) {
      return ariaDescribedby[index];
    }
    return ariaDescribedby;
  }

  function getThumbAriaValueTextValue(index: number): string | undefined {
    const value = values[index];
    if (getAriaValueText) {
      return getAriaValueText(value, index);
    }
    if (format) {
      return formatValue(value, format, min, max);
    }
    return undefined;
  }

  function getDisplayText(index: number): string {
    return formatValue(values[index], format, min, max);
  }
</script>

<div
  role={label ? 'group' : undefined}
  aria-labelledby={label ? groupLabelId : undefined}
  class="apg-slider-multithumb {isVertical ? 'apg-slider-multithumb--vertical' : ''} {disabled
    ? 'apg-slider-multithumb--disabled'
    : ''} {restProps.class || ''}"
  id={restProps.id as string | undefined}
  data-testid={restProps['data-testid'] as string | undefined}
>
  {#if label}
    <span id={groupLabelId} class="apg-slider-multithumb-label">
      {label}
    </span>
  {/if}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    bind:this={trackEl}
    class="apg-slider-multithumb-track"
    style="--slider-lower: {lowerPercent}%; --slider-upper: {upperPercent}%"
    onclick={handleTrackClick}
  >
    <div class="apg-slider-multithumb-range" aria-hidden="true"></div>
    <!-- Lower thumb -->
    <div
      bind:this={lowerThumbEl}
      role="slider"
      tabindex={disabled ? -1 : 0}
      aria-valuenow={values[0]}
      aria-valuemin={min}
      aria-valuemax={lowerBoundsMax}
      aria-valuetext={getThumbAriaValueTextValue(0)}
      aria-label={getThumbAriaLabelValue(0)}
      aria-labelledby={getThumbAriaLabelledbyValue(0)}
      aria-orientation={isVertical ? 'vertical' : undefined}
      aria-disabled={disabled ? true : undefined}
      aria-describedby={getThumbAriaDescribedbyValue(0)}
      class="apg-slider-multithumb-thumb apg-slider-multithumb-thumb--lower"
      style={isVertical ? `bottom: ${lowerPercent}%` : `left: ${lowerPercent}%`}
      onkeydown={(e) => handleKeyDown(0, e)}
      onpointerdown={(e) => handleThumbPointerDown(0, e)}
      onpointermove={(e) => handleThumbPointerMove(0, e)}
      onpointerup={(e) => handleThumbPointerUp(0, e)}
    >
      <span class="apg-slider-multithumb-tooltip" aria-hidden="true">
        {getThumbAriaLabelValue(0)}
      </span>
    </div>
    <!-- Upper thumb -->
    <div
      bind:this={upperThumbEl}
      role="slider"
      tabindex={disabled ? -1 : 0}
      aria-valuenow={values[1]}
      aria-valuemin={upperBoundsMin}
      aria-valuemax={max}
      aria-valuetext={getThumbAriaValueTextValue(1)}
      aria-label={getThumbAriaLabelValue(1)}
      aria-labelledby={getThumbAriaLabelledbyValue(1)}
      aria-orientation={isVertical ? 'vertical' : undefined}
      aria-disabled={disabled ? true : undefined}
      aria-describedby={getThumbAriaDescribedbyValue(1)}
      class="apg-slider-multithumb-thumb apg-slider-multithumb-thumb--upper"
      style={isVertical ? `bottom: ${upperPercent}%` : `left: ${upperPercent}%`}
      onkeydown={(e) => handleKeyDown(1, e)}
      onpointerdown={(e) => handleThumbPointerDown(1, e)}
      onpointermove={(e) => handleThumbPointerMove(1, e)}
      onpointerup={(e) => handleThumbPointerUp(1, e)}
    >
      <span class="apg-slider-multithumb-tooltip" aria-hidden="true">
        {getThumbAriaLabelValue(1)}
      </span>
    </div>
  </div>
  {#if showValues}
    <div class="apg-slider-multithumb-values" aria-hidden="true">
      <span class="apg-slider-multithumb-value apg-slider-multithumb-value--lower">
        {getDisplayText(0)}
      </span>
      <span class="apg-slider-multithumb-value-separator"> - </span>
      <span class="apg-slider-multithumb-value apg-slider-multithumb-value--upper">
        {getDisplayText(1)}
      </span>
    </div>
  {/if}
</div>
