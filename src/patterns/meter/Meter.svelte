<script lang="ts">
  interface MeterProps {
    value: number;
    min?: number;
    max?: number;
    clamp?: boolean;
    showValue?: boolean;
    label?: string;
    valueText?: string;
    formatValue?: (value: number, min: number, max: number) => string;
    [key: string]: unknown;
  }

  let {
    value,
    min = 0,
    max = 100,
    clamp = true,
    showValue = true,
    label,
    valueText,
    formatValue,
    ...restProps
  }: MeterProps = $props();

  function clampNumber(val: number, minVal: number, maxVal: number, shouldClamp: boolean): number {
    if (!Number.isFinite(val) || !Number.isFinite(minVal) || !Number.isFinite(maxVal)) {
      return val;
    }
    return shouldClamp ? Math.min(maxVal, Math.max(minVal, val)) : val;
  }

  const normalizedValue = $derived(clampNumber(value, min, max, clamp));

  const percentage = $derived(() => {
    if (max === min) return 0;
    const pct = ((normalizedValue - min) / (max - min)) * 100;
    return Math.max(0, Math.min(100, pct));
  });

  const ariaValueText = $derived(
    valueText ?? (formatValue ? formatValue(normalizedValue, min, max) : undefined)
  );

  const displayText = $derived(
    valueText
      ? valueText
      : formatValue
        ? formatValue(normalizedValue, min, max)
        : String(normalizedValue)
  );
</script>

<div
  role="meter"
  aria-valuenow={normalizedValue}
  aria-valuemin={min}
  aria-valuemax={max}
  aria-valuetext={ariaValueText}
  aria-label={label || restProps['aria-label']}
  aria-labelledby={restProps['aria-labelledby']}
  aria-describedby={restProps['aria-describedby']}
  class="apg-meter {restProps.class || ''}"
  id={restProps.id}
  tabindex={restProps.tabindex}
  data-testid={restProps['data-testid']}
>
  {#if label}
    <span class="apg-meter-label" aria-hidden="true">
      {label}
    </span>
  {/if}
  <div class="apg-meter-track" aria-hidden="true">
    <div class="apg-meter-fill" style="width: {percentage()}%"></div>
  </div>
  {#if showValue}
    <span class="apg-meter-value" aria-hidden="true">
      {displayText}
    </span>
  {/if}
</div>
