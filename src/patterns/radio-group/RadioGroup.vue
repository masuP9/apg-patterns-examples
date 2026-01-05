<template>
  <div
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-orientation="orientation === 'horizontal' ? 'horizontal' : undefined"
    :class="['apg-radio-group', props.class]"
  >
    <!-- Hidden input for form submission -->
    <input type="hidden" :name="name" :value="selectedValue" />

    <div
      v-for="option in options"
      :key="option.id"
      :ref="(el) => setRadioRef(option.value, el as HTMLDivElement | null)"
      role="radio"
      :aria-checked="selectedValue === option.value"
      :aria-disabled="option.disabled || undefined"
      :aria-labelledby="`${instanceId}-label-${option.id}`"
      :tabindex="getTabIndex(option)"
      :class="[
        'apg-radio',
        selectedValue === option.value && 'apg-radio--selected',
        option.disabled && 'apg-radio--disabled',
      ]"
      @click="handleClick(option)"
      @keydown="(e) => handleKeyDown(e, option.value)"
    >
      <span class="apg-radio-control" aria-hidden="true">
        <span class="apg-radio-indicator" />
      </span>
      <span :id="`${instanceId}-label-${option.id}`" class="apg-radio-label">
        {{ option.label }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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
  ariaLabel?: string;
  /** Reference to external label */
  ariaLabelledby?: string;
  /** Controlled value (for v-model) */
  modelValue?: string;
  /** Initially selected value (uncontrolled) */
  defaultValue?: string;
  /** Orientation of the group */
  orientation?: 'horizontal' | 'vertical';
  /** Additional CSS class */
  class?: string;
}

const props = withDefaults(defineProps<RadioGroupProps>(), {
  ariaLabel: undefined,
  ariaLabelledby: undefined,
  modelValue: undefined,
  defaultValue: '',
  orientation: 'vertical',
  class: undefined,
});

const emit = defineEmits<{
  'update:modelValue': [value: string];
  valueChange: [value: string];
}>();

// Generate unique ID for this instance
const instanceId = `radio-group-${Math.random().toString(36).slice(2, 9)}`;

// Filter enabled options
const enabledOptions = computed(() => props.options.filter((opt) => !opt.disabled));

// Check if controlled mode (v-model provided)
const isControlled = computed(() => props.modelValue !== undefined);

// Find initial value
const getInitialValue = () => {
  // If controlled, use modelValue
  if (props.modelValue !== undefined) {
    const option = props.options.find((opt) => opt.value === props.modelValue);
    if (option && !option.disabled) {
      return props.modelValue;
    }
  }
  // Otherwise use defaultValue
  if (props.defaultValue) {
    const option = props.options.find((opt) => opt.value === props.defaultValue);
    if (option && !option.disabled) {
      return props.defaultValue;
    }
  }
  return '';
};

const internalValue = ref(getInitialValue());

// Computed value that respects controlled/uncontrolled mode
const selectedValue = computed(() => {
  if (isControlled.value) {
    return props.modelValue ?? '';
  }
  return internalValue.value;
});

// Watch for external modelValue changes in controlled mode
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      internalValue.value = newValue;
    }
  }
);

// Refs for focus management
const radioRefs = new Map<string, HTMLDivElement>();

const setRadioRef = (value: string, el: HTMLDivElement | null) => {
  if (el) {
    radioRefs.set(value, el);
  } else {
    radioRefs.delete(value);
  }
};

// Get the tabbable radio value
const getTabbableValue = () => {
  if (selectedValue.value && enabledOptions.value.some((opt) => opt.value === selectedValue.value)) {
    return selectedValue.value;
  }
  return enabledOptions.value[0]?.value || '';
};

const getTabIndex = (option: RadioOption): number => {
  if (option.disabled) return -1;
  return option.value === getTabbableValue() ? 0 : -1;
};

// Focus a radio by value
const focusRadio = (value: string) => {
  const radioEl = radioRefs.get(value);
  radioEl?.focus();
};

// Select a radio
const selectRadio = (value: string) => {
  const option = props.options.find((opt) => opt.value === value);
  if (option && !option.disabled) {
    internalValue.value = value;
    emit('update:modelValue', value);
    emit('valueChange', value);
  }
};

// Get enabled index of a value
const getEnabledIndex = (value: string) => {
  return enabledOptions.value.findIndex((opt) => opt.value === value);
};

// Navigate and select
const navigateAndSelect = (direction: 'next' | 'prev' | 'first' | 'last', currentValue: string) => {
  if (enabledOptions.value.length === 0) return;

  let targetIndex: number;
  const currentIndex = getEnabledIndex(currentValue);

  switch (direction) {
    case 'next':
      targetIndex = currentIndex >= 0 ? (currentIndex + 1) % enabledOptions.value.length : 0;
      break;
    case 'prev':
      targetIndex =
        currentIndex >= 0
          ? (currentIndex - 1 + enabledOptions.value.length) % enabledOptions.value.length
          : enabledOptions.value.length - 1;
      break;
    case 'first':
      targetIndex = 0;
      break;
    case 'last':
      targetIndex = enabledOptions.value.length - 1;
      break;
  }

  const targetOption = enabledOptions.value[targetIndex];
  if (targetOption) {
    focusRadio(targetOption.value);
    selectRadio(targetOption.value);
  }
};

const handleKeyDown = (event: KeyboardEvent, optionValue: string) => {
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
};

const handleClick = (option: RadioOption) => {
  if (!option.disabled) {
    focusRadio(option.value);
    selectRadio(option.value);
  }
};
</script>
