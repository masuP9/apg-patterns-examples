<template>
  <div :class="cn('apg-spinbutton', disabled && 'apg-spinbutton--disabled', $attrs.class)">
    <span v-if="label" :id="labelId" class="apg-spinbutton-label">
      {{ label }}
    </span>
    <div class="apg-spinbutton-controls">
      <button
        v-if="showButtons"
        type="button"
        :tabindex="-1"
        aria-label="Decrement"
        :disabled="disabled"
        class="apg-spinbutton-button apg-spinbutton-decrement"
        @mousedown.prevent
        @click="handleDecrement"
      >
        −
      </button>
      <input
        ref="inputRef"
        type="text"
        role="spinbutton"
        :id="$attrs.id as string | undefined"
        :tabindex="disabled ? -1 : 0"
        inputmode="numeric"
        :value="inputValue"
        :readonly="readOnly"
        :aria-valuenow="value"
        :aria-valuemin="min"
        :aria-valuemax="max"
        :aria-valuetext="ariaValueText"
        :aria-label="label ? undefined : ($attrs['aria-label'] as string | undefined)"
        :aria-labelledby="ariaLabelledby"
        :aria-describedby="$attrs['aria-describedby'] as string | undefined"
        :aria-disabled="disabled || undefined"
        :aria-readonly="readOnly || undefined"
        :aria-invalid="$attrs['aria-invalid'] as boolean | undefined"
        :data-testid="$attrs['data-testid'] as string | undefined"
        class="apg-spinbutton-input"
        @input="handleInput"
        @keydown="handleKeyDown"
        @blur="handleBlur"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
      />
      <button
        v-if="showButtons"
        type="button"
        :tabindex="-1"
        aria-label="Increment"
        :disabled="disabled"
        class="apg-spinbutton-button apg-spinbutton-increment"
        @mousedown.prevent
        @click="handleIncrement"
      >
        +
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { cn } from '@/lib/utils';

defineOptions({
  inheritAttrs: false,
});

export interface SpinbuttonProps {
  /** Default value */
  defaultValue?: number;
  /** Minimum value (undefined = no limit) */
  min?: number;
  /** Maximum value (undefined = no limit) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Large step for PageUp/PageDown */
  largeStep?: number;
  /** Whether spinbutton is disabled */
  disabled?: boolean;
  /** Whether spinbutton is read-only */
  readOnly?: boolean;
  /** Show increment/decrement buttons (default: true) */
  showButtons?: boolean;
  /** Visible label text */
  label?: string;
  /** Human-readable value text for aria-valuetext */
  valueText?: string;
  /** Format pattern for dynamic value display (e.g., "{value} items") */
  format?: string;
}

const props = withDefaults(defineProps<SpinbuttonProps>(), {
  defaultValue: 0,
  min: undefined,
  max: undefined,
  step: 1,
  largeStep: undefined,
  disabled: false,
  readOnly: false,
  showButtons: true,
  label: undefined,
  valueText: undefined,
  format: undefined,
});

const emit = defineEmits<{
  valueChange: [value: number];
}>();

// Utility functions
const clamp = (val: number, minVal?: number, maxVal?: number): number => {
  let result = val;
  if (minVal !== undefined) result = Math.max(minVal, result);
  if (maxVal !== undefined) result = Math.min(maxVal, result);
  return result;
};

// Ensure step is valid (positive number)
const ensureValidStep = (stepVal: number): number => {
  return stepVal > 0 ? stepVal : 1;
};

const roundToStep = (val: number, stepVal: number, minVal?: number): number => {
  const validStep = ensureValidStep(stepVal);
  const base = minVal ?? 0;
  const steps = Math.round((val - base) / validStep);
  const result = base + steps * validStep;
  const decimalPlaces = (validStep.toString().split('.')[1] || '').length;
  return Number(result.toFixed(decimalPlaces));
};

// Format value helper
const formatValueText = (val: number, formatStr: string | undefined): string => {
  if (!formatStr) return String(val);
  return formatStr
    .replace('{value}', String(val))
    .replace('{min}', props.min !== undefined ? String(props.min) : '')
    .replace('{max}', props.max !== undefined ? String(props.max) : '');
};

// Refs
const inputRef = ref<HTMLInputElement | null>(null);
// Use crypto.randomUUID() for unique IDs in Astro Islands (Vue's useId() returns same value for all instances)
const labelId = `spinbutton-label-${crypto.randomUUID().slice(0, 8)}`;
const isComposing = ref(false);

// State
const initialValue = clamp(
  roundToStep(props.defaultValue, props.step, props.min),
  props.min,
  props.max
);
const value = ref(initialValue);
const inputValue = ref(String(initialValue));

// Computed
const effectiveLargeStep = computed(() => props.largeStep ?? props.step * 10);

const ariaValueText = computed(() => {
  if (props.valueText) return props.valueText;
  if (props.format) return formatValueText(value.value, props.format);
  return undefined;
});

const ariaLabelledby = computed(() => {
  const attrLabelledby = (
    getCurrentInstance()?.attrs as { 'aria-labelledby'?: string } | undefined
  )?.['aria-labelledby'];
  if (attrLabelledby) return attrLabelledby;
  if (props.label) return labelId;
  return undefined;
});

// Helper to get current instance for attrs
import { getCurrentInstance } from 'vue';

// Update value and emit
const updateValue = (newValue: number) => {
  const clampedValue = clamp(roundToStep(newValue, props.step, props.min), props.min, props.max);
  if (clampedValue !== value.value) {
    value.value = clampedValue;
    inputValue.value = String(clampedValue);
    emit('valueChange', clampedValue);
  }
};

// Keyboard handler
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled) return;

  let newValue = value.value;
  let handled = false;

  switch (event.key) {
    case 'ArrowUp':
      if (!props.readOnly) {
        newValue = value.value + props.step;
        handled = true;
      }
      break;
    case 'ArrowDown':
      if (!props.readOnly) {
        newValue = value.value - props.step;
        handled = true;
      }
      break;
    case 'Home':
      if (props.min !== undefined) {
        newValue = props.min;
        handled = true;
      }
      break;
    case 'End':
      if (props.max !== undefined) {
        newValue = props.max;
        handled = true;
      }
      break;
    case 'PageUp':
      if (!props.readOnly) {
        newValue = value.value + effectiveLargeStep.value;
        handled = true;
      }
      break;
    case 'PageDown':
      if (!props.readOnly) {
        newValue = value.value - effectiveLargeStep.value;
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

// Text input handler
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  inputValue.value = target.value;

  if (!isComposing.value) {
    const parsed = parseFloat(target.value);
    if (!isNaN(parsed)) {
      const clampedValue = clamp(roundToStep(parsed, props.step, props.min), props.min, props.max);
      if (clampedValue !== value.value) {
        value.value = clampedValue;
        emit('valueChange', clampedValue);
      }
    }
  }
};

// Blur handler
const handleBlur = () => {
  const parsed = parseFloat(inputValue.value);

  if (isNaN(parsed)) {
    // Revert to previous valid value
    inputValue.value = String(value.value);
  } else {
    const newValue = clamp(roundToStep(parsed, props.step, props.min), props.min, props.max);
    if (newValue !== value.value) {
      value.value = newValue;
      emit('valueChange', newValue);
    }
    inputValue.value = String(newValue);
  }
};

// IME composition handlers
const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
  const parsed = parseFloat(inputValue.value);
  if (!isNaN(parsed)) {
    const clampedValue = clamp(roundToStep(parsed, props.step, props.min), props.min, props.max);
    value.value = clampedValue;
    emit('valueChange', clampedValue);
  }
};

// Button handlers
const handleIncrement = (event: MouseEvent) => {
  event.preventDefault();
  if (props.disabled || props.readOnly) return;
  updateValue(value.value + props.step);
  inputRef.value?.focus();
};

const handleDecrement = (event: MouseEvent) => {
  event.preventDefault();
  if (props.disabled || props.readOnly) return;
  updateValue(value.value - props.step);
  inputRef.value?.focus();
};
</script>
