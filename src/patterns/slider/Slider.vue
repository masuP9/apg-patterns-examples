<template>
  <div
    :class="[
      'apg-slider',
      isVertical && 'apg-slider--vertical',
      disabled && 'apg-slider--disabled',
      $attrs.class,
    ]"
  >
    <span v-if="label" :id="labelId" class="apg-slider-label">
      {{ label }}
    </span>
    <div
      ref="trackRef"
      class="apg-slider-track"
      :style="{ '--slider-position': `${percent}%` }"
      @click="handleTrackClick"
    >
      <div class="apg-slider-fill" aria-hidden="true" />
      <div
        ref="thumbRef"
        role="slider"
        :id="$attrs.id"
        :tabindex="disabled ? -1 : 0"
        :aria-valuenow="value"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuetext="ariaValueText"
        :aria-label="$attrs['aria-label']"
        :aria-labelledby="ariaLabelledby"
        :aria-orientation="isVertical ? 'vertical' : undefined"
        :aria-disabled="disabled ? true : undefined"
        :aria-describedby="$attrs['aria-describedby']"
        :data-testid="$attrs['data-testid']"
        class="apg-slider-thumb"
        @keydown="handleKeyDown"
        @pointerdown="handlePointerDown"
        @pointermove="handlePointerMove"
        @pointerup="handlePointerUp"
      />
    </div>
    <span v-if="showValue" class="apg-slider-value" aria-hidden="true">
      {{ displayText }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';

defineOptions({
  inheritAttrs: false,
});

export interface SliderProps {
  /** Default value */
  defaultValue?: number;
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Large step for PageUp/PageDown */
  largeStep?: number;
  /** Slider orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Whether slider is disabled */
  disabled?: boolean;
  /** Show value text (default: true) */
  showValue?: boolean;
  /** Visible label text */
  label?: string;
  /** Human-readable value text for aria-valuetext */
  valueText?: string;
  /** Format pattern for dynamic value display (e.g., "{value}%", "{value} of {max}") */
  format?: string;
}

const props = withDefaults(defineProps<SliderProps>(), {
  defaultValue: undefined,
  min: 0,
  max: 100,
  step: 1,
  largeStep: undefined,
  orientation: 'horizontal',
  disabled: false,
  showValue: true,
  label: undefined,
  valueText: undefined,
  format: undefined,
});

const emit = defineEmits<{
  valueChange: [value: number];
}>();

// Utility functions
const clamp = (val: number, minVal: number, maxVal: number): number => {
  return Math.min(maxVal, Math.max(minVal, val));
};

const roundToStep = (val: number, stepVal: number, minVal: number): number => {
  const steps = Math.round((val - minVal) / stepVal);
  const result = minVal + steps * stepVal;
  const decimalPlaces = (stepVal.toString().split('.')[1] || '').length;
  return Number(result.toFixed(decimalPlaces));
};

const getPercent = (val: number, minVal: number, maxVal: number): number => {
  if (maxVal === minVal) return 0;
  return ((val - minVal) / (maxVal - minVal)) * 100;
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

// Refs
const thumbRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const labelId = useId();
const isDragging = ref(false);

// State
const initialValue = clamp(
  roundToStep(props.defaultValue ?? props.min, props.step, props.min),
  props.min,
  props.max
);
const value = ref(initialValue);

// Computed
const isVertical = computed(() => props.orientation === 'vertical');
const effectiveLargeStep = computed(() => props.largeStep ?? props.step * 10);
const percent = computed(() => getPercent(value.value, props.min, props.max));

const ariaValueText = computed(() => {
  if (props.valueText) return props.valueText;
  if (props.format) return formatValueText(value.value, props.format, props.min, props.max);
  return undefined;
});

const displayText = computed(() => {
  if (props.valueText) return props.valueText;
  return formatValueText(value.value, props.format, props.min, props.max);
});

const ariaLabelledby = computed(() => {
  const attrLabelledby = (
    getCurrentInstance()?.attrs as { 'aria-labelledby'?: string } | undefined
  )?.['aria-labelledby'];
  return attrLabelledby ?? (props.label ? labelId : undefined);
});

// Helper to get current instance for attrs
import { getCurrentInstance } from 'vue';

// Update value and emit
const updateValue = (newValue: number) => {
  const clampedValue = clamp(roundToStep(newValue, props.step, props.min), props.min, props.max);
  if (clampedValue !== value.value) {
    value.value = clampedValue;
    emit('valueChange', clampedValue);
  }
};

// Calculate value from pointer position
const getValueFromPointer = (clientX: number, clientY: number): number => {
  const track = trackRef.value;
  if (!track) return value.value;

  const rect = track.getBoundingClientRect();

  // Guard against zero-size track
  if (rect.width === 0 && rect.height === 0) {
    return value.value;
  }

  let pct: number;

  if (isVertical.value) {
    if (rect.height === 0) return value.value;
    pct = 1 - (clientY - rect.top) / rect.height;
  } else {
    if (rect.width === 0) return value.value;
    pct = (clientX - rect.left) / rect.width;
  }

  const rawValue = props.min + pct * (props.max - props.min);
  return clamp(roundToStep(rawValue, props.step, props.min), props.min, props.max);
};

// Keyboard handler
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  let newValue = value.value;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      newValue = value.value + props.step;
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      newValue = value.value - props.step;
      break;
    case 'Home':
      newValue = props.min;
      break;
    case 'End':
      newValue = props.max;
      break;
    case 'PageUp':
      newValue = value.value + effectiveLargeStep.value;
      break;
    case 'PageDown':
      newValue = value.value - effectiveLargeStep.value;
      break;
    default:
      return;
  }

  event.preventDefault();
  updateValue(newValue);
};

// Pointer handlers
const handlePointerDown = (event: PointerEvent) => {
  if (props.disabled) return;

  event.preventDefault();
  const thumb = thumbRef.value;
  if (!thumb) return;

  if (typeof thumb.setPointerCapture === 'function') {
    thumb.setPointerCapture(event.pointerId);
  }
  isDragging.value = true;
  thumb.focus();

  const newValue = getValueFromPointer(event.clientX, event.clientY);
  updateValue(newValue);
};

const handlePointerMove = (event: PointerEvent) => {
  const thumb = thumbRef.value;
  if (!thumb) return;

  const hasCapture =
    typeof thumb.hasPointerCapture === 'function'
      ? thumb.hasPointerCapture(event.pointerId)
      : isDragging.value;

  if (!hasCapture) return;

  const newValue = getValueFromPointer(event.clientX, event.clientY);
  updateValue(newValue);
};

const handlePointerUp = (event: PointerEvent) => {
  const thumb = thumbRef.value;
  if (thumb && typeof thumb.releasePointerCapture === 'function') {
    try {
      thumb.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore
    }
  }
  isDragging.value = false;
};

// Track click handler
const handleTrackClick = (event: MouseEvent) => {
  if (props.disabled) return;
  if (event.target === thumbRef.value) return;

  const newValue = getValueFromPointer(event.clientX, event.clientY);
  updateValue(newValue);
  thumbRef.value?.focus();
};
</script>
