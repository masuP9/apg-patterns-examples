<template>
  <div
    role="meter"
    :aria-valuenow="normalizedValue"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuetext="ariaValueText"
    :aria-label="label || $attrs['aria-label']"
    :aria-labelledby="$attrs['aria-labelledby']"
    :aria-describedby="$attrs['aria-describedby']"
    :class="['apg-meter', $attrs.class]"
    :id="$attrs.id"
    :tabindex="$attrs.tabindex"
    :data-testid="$attrs['data-testid']"
  >
    <span v-if="label" class="apg-meter-label" aria-hidden="true">
      {{ label }}
    </span>
    <div class="apg-meter-track" aria-hidden="true">
      <div class="apg-meter-fill" :style="{ width: `${percentage}%` }" />
    </div>
    <span v-if="showValue" class="apg-meter-value" aria-hidden="true">
      {{ displayText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

defineOptions({
  inheritAttrs: false,
});

export interface MeterProps {
  /** Current value */
  value: number;
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Clamp value to min/max range (default: true) */
  clamp?: boolean;
  /** Show value text (default: true) */
  showValue?: boolean;
  /** Visible label text */
  label?: string;
  /** Human-readable value text for aria-valuetext */
  valueText?: string;
  /** Format pattern for dynamic value display (e.g., "{value}%", "{value} of {max}") */
  format?: string;
}

const props = withDefaults(defineProps<MeterProps>(), {
  min: 0,
  max: 100,
  clamp: true,
  showValue: true,
  label: undefined,
  valueText: undefined,
  format: undefined,
});

const clampNumber = (value: number, min: number, max: number, shouldClamp: boolean): number => {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return value;
  }
  return shouldClamp ? Math.min(max, Math.max(min, value)) : value;
};

// Format value helper
const formatValueText = (
  val: number,
  formatStr: string | undefined,
  minVal: number,
  maxVal: number
): string => {
  if (!formatStr) return String(val);
  return formatStr
    .replace('{value}', String(val))
    .replace('{min}', String(minVal))
    .replace('{max}', String(maxVal));
};

const normalizedValue = computed(() => clampNumber(props.value, props.min, props.max, props.clamp));

const percentage = computed(() => {
  if (props.max === props.min) return 0;
  const pct = ((normalizedValue.value - props.min) / (props.max - props.min)) * 100;
  return Math.max(0, Math.min(100, pct));
});

const ariaValueText = computed(() => {
  if (props.valueText) return props.valueText;
  if (props.format)
    return formatValueText(normalizedValue.value, props.format, props.min, props.max);
  return undefined;
});

const displayText = computed(() => {
  if (props.valueText) return props.valueText;
  return formatValueText(normalizedValue.value, props.format, props.min, props.max);
});
</script>
