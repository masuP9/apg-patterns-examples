<template>
  <div
    :role="label ? 'group' : undefined"
    :aria-labelledby="label ? groupLabelId : undefined"
    :class="[
      'apg-slider-multithumb',
      isVertical && 'apg-slider-multithumb--vertical',
      disabled && 'apg-slider-multithumb--disabled',
      $attrs.class,
    ]"
    :id="$attrs.id as string | undefined"
    :data-testid="$attrs['data-testid'] as string | undefined"
  >
    <span v-if="label" :id="groupLabelId" class="apg-slider-multithumb-label">
      {{ label }}
    </span>
    <div
      ref="trackRef"
      class="apg-slider-multithumb-track"
      :style="{
        '--slider-lower': `${lowerPercent}%`,
        '--slider-upper': `${upperPercent}%`,
      }"
      @click="handleTrackClick"
    >
      <div class="apg-slider-multithumb-range" aria-hidden="true" />
      <!-- Lower thumb -->
      <div
        ref="lowerThumbRef"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :aria-valuenow="values[0]"
        :aria-valuemin="min"
        :aria-valuemax="getLowerBoundsMax()"
        :aria-valuetext="getThumbAriaValueText(0)"
        :aria-label="getThumbAriaLabel(0)"
        :aria-labelledby="getThumbAriaLabelledby(0)"
        :aria-orientation="isVertical ? 'vertical' : undefined"
        :aria-disabled="disabled ? true : undefined"
        :aria-describedby="getThumbAriaDescribedby(0)"
        class="apg-slider-multithumb-thumb apg-slider-multithumb-thumb--lower"
        :style="isVertical ? { bottom: `${lowerPercent}%` } : { left: `${lowerPercent}%` }"
        @keydown="handleKeyDown(0, $event)"
        @pointerdown="handleThumbPointerDown(0, $event)"
        @pointermove="handleThumbPointerMove(0, $event)"
        @pointerup="handleThumbPointerUp(0, $event)"
      >
        <span class="apg-slider-multithumb-tooltip" aria-hidden="true">
          {{ getThumbAriaLabel(0) }}
        </span>
      </div>
      <!-- Upper thumb -->
      <div
        ref="upperThumbRef"
        role="slider"
        :tabindex="disabled ? -1 : 0"
        :aria-valuenow="values[1]"
        :aria-valuemin="getUpperBoundsMin()"
        :aria-valuemax="max"
        :aria-valuetext="getThumbAriaValueText(1)"
        :aria-label="getThumbAriaLabel(1)"
        :aria-labelledby="getThumbAriaLabelledby(1)"
        :aria-orientation="isVertical ? 'vertical' : undefined"
        :aria-disabled="disabled ? true : undefined"
        :aria-describedby="getThumbAriaDescribedby(1)"
        class="apg-slider-multithumb-thumb apg-slider-multithumb-thumb--upper"
        :style="isVertical ? { bottom: `${upperPercent}%` } : { left: `${upperPercent}%` }"
        @keydown="handleKeyDown(1, $event)"
        @pointerdown="handleThumbPointerDown(1, $event)"
        @pointermove="handleThumbPointerMove(1, $event)"
        @pointerup="handleThumbPointerUp(1, $event)"
      >
        <span class="apg-slider-multithumb-tooltip" aria-hidden="true">
          {{ getThumbAriaLabel(1) }}
        </span>
      </div>
    </div>
    <div v-if="showValues" class="apg-slider-multithumb-values" aria-hidden="true">
      <span class="apg-slider-multithumb-value apg-slider-multithumb-value--lower">
        {{ getDisplayText(0) }}
      </span>
      <span class="apg-slider-multithumb-value-separator"> - </span>
      <span class="apg-slider-multithumb-value apg-slider-multithumb-value--upper">
        {{ getDisplayText(1) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, useId } from 'vue';

defineOptions({
  inheritAttrs: false,
});

export interface MultiThumbSliderProps {
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
  /** Format pattern for value display (e.g., "{value}") */
  format?: string;
  /** Visible label for the group */
  label?: string;
  /** aria-label per thumb */
  ariaLabel?: [string, string];
  /** aria-labelledby per thumb */
  ariaLabelledby?: [string, string];
  /** aria-describedby per thumb (tuple or single for both) */
  ariaDescribedby?: string | [string, string];
  /** Function to get aria-valuetext per thumb */
  getAriaValueText?: (value: number, index: number) => string;
  /** Function to get aria-label per thumb */
  getAriaLabel?: (index: number) => string;
}

const props = withDefaults(defineProps<MultiThumbSliderProps>(), {
  defaultValue: undefined,
  min: 0,
  max: 100,
  step: 1,
  largeStep: undefined,
  minDistance: 0,
  orientation: 'horizontal',
  disabled: false,
  showValues: true,
  format: undefined,
  label: undefined,
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  ariaDescribedby: undefined,
  getAriaValueText: undefined,
  getAriaLabel: undefined,
});

const emit = defineEmits<{
  valueChange: [values: [number, number], activeThumbIndex: number];
  valueCommit: [values: [number, number]];
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

const formatValue = (
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

// Get dynamic bounds for a thumb
const getThumbBounds = (
  index: number,
  currentValues: [number, number],
  minVal: number,
  maxVal: number,
  minDist: number
): { min: number; max: number } => {
  const effectiveMinDistance = Math.min(minDist, maxVal - minVal);
  if (index === 0) {
    return { min: minVal, max: currentValues[1] - effectiveMinDistance };
  } else {
    return { min: currentValues[0] + effectiveMinDistance, max: maxVal };
  }
};

// Normalize values to ensure they are valid
const normalizeValues = (
  inputValues: [number, number],
  minVal: number,
  maxVal: number,
  stepVal: number,
  minDist: number
): [number, number] => {
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
};

// Refs
const lowerThumbRef = ref<HTMLDivElement | null>(null);
const upperThumbRef = ref<HTMLDivElement | null>(null);
const trackRef = ref<HTMLDivElement | null>(null);
const groupLabelId = useId();
const activeThumbIndex = ref<number | null>(null);

// State
const initialValues = normalizeValues(
  props.defaultValue ?? [props.min, props.max],
  props.min,
  props.max,
  props.step,
  props.minDistance
);
const values = ref<[number, number]>(initialValues);

// Computed
const isVertical = computed(() => props.orientation === 'vertical');
const effectiveLargeStep = computed(() => props.largeStep ?? props.step * 10);
const lowerPercent = computed(() => getPercent(values.value[0], props.min, props.max));
const upperPercent = computed(() => getPercent(values.value[1], props.min, props.max));

// Bounds helpers
const getLowerBoundsMax = () =>
  getThumbBounds(0, values.value, props.min, props.max, props.minDistance).max;
const getUpperBoundsMin = () =>
  getThumbBounds(1, values.value, props.min, props.max, props.minDistance).min;

// Update values and emit
const updateValues = (newValues: [number, number], activeIndex: number) => {
  values.value = newValues;
  emit('valueChange', newValues, activeIndex);
};

// Update a single thumb value
const updateThumbValue = (index: number, newValue: number) => {
  const bounds = getThumbBounds(index, values.value, props.min, props.max, props.minDistance);
  const rounded = roundToStep(newValue, props.step, props.min);
  const clamped = clamp(rounded, bounds.min, bounds.max);

  if (clamped === values.value[index]) return;

  const newValues: [number, number] = [...values.value];
  newValues[index] = clamped;
  updateValues(newValues, index);
};

// Calculate value from pointer position
const getValueFromPointer = (clientX: number, clientY: number): number => {
  const track = trackRef.value;
  if (!track) return values.value[0];

  const rect = track.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return values.value[0];
  }

  let pct: number;

  if (isVertical.value) {
    if (rect.height === 0) return values.value[0];
    pct = 1 - (clientY - rect.top) / rect.height;
  } else {
    if (rect.width === 0) return values.value[0];
    pct = (clientX - rect.left) / rect.width;
  }

  const rawValue = props.min + pct * (props.max - props.min);
  return roundToStep(rawValue, props.step, props.min);
};

// Keyboard handler
const handleKeyDown = (index: number, event: KeyboardEvent) => {
  if (props.disabled) return;

  const bounds = getThumbBounds(index, values.value, props.min, props.max, props.minDistance);
  let newValue = values.value[index];

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      newValue = values.value[index] + props.step;
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      newValue = values.value[index] - props.step;
      break;
    case 'Home':
      newValue = bounds.min;
      break;
    case 'End':
      newValue = bounds.max;
      break;
    case 'PageUp':
      newValue = values.value[index] + effectiveLargeStep.value;
      break;
    case 'PageDown':
      newValue = values.value[index] - effectiveLargeStep.value;
      break;
    default:
      return;
  }

  event.preventDefault();
  updateThumbValue(index, newValue);
};

// Pointer handlers
const getThumbRef = (index: number) => (index === 0 ? lowerThumbRef : upperThumbRef);

const handleThumbPointerDown = (index: number, event: PointerEvent) => {
  if (props.disabled) return;

  event.preventDefault();
  const thumb = getThumbRef(index).value;
  if (!thumb) return;

  if (typeof thumb.setPointerCapture === 'function') {
    thumb.setPointerCapture(event.pointerId);
  }
  activeThumbIndex.value = index;
  thumb.focus();
};

const handleThumbPointerMove = (index: number, event: PointerEvent) => {
  const thumb = getThumbRef(index).value;
  if (!thumb) return;

  const hasCapture =
    typeof thumb.hasPointerCapture === 'function'
      ? thumb.hasPointerCapture(event.pointerId)
      : activeThumbIndex.value === index;

  if (!hasCapture) return;

  const newValue = getValueFromPointer(event.clientX, event.clientY);
  updateThumbValue(index, newValue);
};

const handleThumbPointerUp = (index: number, event: PointerEvent) => {
  const thumb = getThumbRef(index).value;
  if (thumb && typeof thumb.releasePointerCapture === 'function') {
    try {
      thumb.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore
    }
  }
  activeThumbIndex.value = null;
  emit('valueCommit', values.value);
};

// Track click handler
const handleTrackClick = (event: MouseEvent) => {
  if (props.disabled) return;
  if (event.target === lowerThumbRef.value || event.target === upperThumbRef.value) return;

  const clickValue = getValueFromPointer(event.clientX, event.clientY);

  const distToLower = Math.abs(clickValue - values.value[0]);
  const distToUpper = Math.abs(clickValue - values.value[1]);
  const targetIndex = distToLower <= distToUpper ? 0 : 1;

  updateThumbValue(targetIndex, clickValue);
  getThumbRef(targetIndex).value?.focus();
};

// ARIA helpers
const getThumbAriaLabel = (index: number): string | undefined => {
  if (props.ariaLabel) {
    return props.ariaLabel[index];
  }
  if (props.getAriaLabel) {
    return props.getAriaLabel(index);
  }
  return undefined;
};

const getThumbAriaLabelledby = (index: number): string | undefined => {
  if (props.ariaLabelledby) {
    return props.ariaLabelledby[index];
  }
  return undefined;
};

const getThumbAriaDescribedby = (index: number): string | undefined => {
  if (!props.ariaDescribedby) return undefined;
  if (Array.isArray(props.ariaDescribedby)) {
    return props.ariaDescribedby[index];
  }
  return props.ariaDescribedby;
};

const getThumbAriaValueText = (index: number): string | undefined => {
  const value = values.value[index];
  if (props.getAriaValueText) {
    return props.getAriaValueText(value, index);
  }
  if (props.format) {
    return formatValue(value, props.format, props.min, props.max);
  }
  return undefined;
};

const getDisplayText = (index: number): string => {
  return formatValue(values.value[index], props.format, props.min, props.max);
};
</script>
