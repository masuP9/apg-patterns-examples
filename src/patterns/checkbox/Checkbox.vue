<template>
  <span class="apg-checkbox" v-bind="wrapperAttrs">
    <input
      ref="inputRef"
      type="checkbox"
      class="apg-checkbox-input"
      :id="props.id"
      :checked="checked"
      :disabled="props.disabled"
      :name="props.name"
      :value="props.value"
      v-bind="inputAttrs"
      @change="handleChange"
    />
    <span class="apg-checkbox-control" aria-hidden="true">
      <span class="apg-checkbox-icon apg-checkbox-icon--check">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="apg-checkbox-icon apg-checkbox-icon--indeterminate">
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 6H9.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </span>
    </span>
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, useAttrs, watch } from 'vue';

defineOptions({
  inheritAttrs: false,
});

export interface CheckboxProps {
  /** Initial checked state */
  initialChecked?: boolean;
  /** Indeterminate (mixed) state */
  indeterminate?: boolean;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Form field name */
  name?: string;
  /** Form field value */
  value?: string;
  /** ID for external label association */
  id?: string;
  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  initialChecked: false,
  indeterminate: false,
  disabled: false,
  name: undefined,
  value: undefined,
  id: undefined,
  onCheckedChange: undefined,
});

const attrs = useAttrs() as {
  class?: string;
  'data-testid'?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  id?: string;
  [key: string]: unknown;
};

const emit = defineEmits<{
  change: [checked: boolean];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const checked = ref(props.initialChecked);
const isIndeterminate = ref(props.indeterminate);

// Separate attrs for wrapper and input
const wrapperAttrs = computed(() => {
  return {
    class: attrs.class,
    'data-testid': attrs['data-testid'],
  };
});

const inputAttrs = computed(() => {
  const { class: _className, 'data-testid': _testId, ...rest } = attrs;
  return rest;
});

// Update indeterminate property on the input element
const updateIndeterminate = () => {
  if (inputRef.value) {
    inputRef.value.indeterminate = isIndeterminate.value;
  }
};

onMounted(() => {
  updateIndeterminate();
});

watch(
  () => props.indeterminate,
  (newValue) => {
    isIndeterminate.value = newValue;
  }
);

watch(isIndeterminate, () => {
  updateIndeterminate();
});

const handleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newChecked = target.checked;
  checked.value = newChecked;
  isIndeterminate.value = false;
  props.onCheckedChange?.(newChecked);
  emit('change', newChecked);
};
</script>
