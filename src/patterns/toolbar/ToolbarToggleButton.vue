<script lang="ts">
export interface ToolbarToggleButtonProps {
  /** Controlled pressed state */
  pressed?: boolean;
  /** Default pressed state (uncontrolled) */
  defaultPressed?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
}
</script>

<template>
  <button
    type="button"
    class="apg-toolbar-button"
    :aria-pressed="currentPressed"
    :disabled="disabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref, inject, computed } from 'vue';
import { ToolbarContextKey } from './toolbar-context';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /** Controlled pressed state */
    pressed?: boolean;
    /** Default pressed state (uncontrolled) */
    defaultPressed?: boolean;
    /** Whether the button is disabled */
    disabled?: boolean;
  }>(),
  {
    pressed: undefined,
    defaultPressed: false,
    disabled: false,
  }
);

const emit = defineEmits<{
  'update:pressed': [pressed: boolean];
  'pressed-change': [pressed: boolean];
}>();

// Verify we're inside a Toolbar
const context = inject(ToolbarContextKey);
if (!context) {
  console.warn('ToolbarToggleButton must be used within a Toolbar');
}

const internalPressed = ref(props.defaultPressed);
const isControlled = computed(() => props.pressed !== undefined);
const currentPressed = computed(() => (isControlled.value ? props.pressed : internalPressed.value));

const handleClick = () => {
  if (props.disabled) return;

  const newPressed = !currentPressed.value;

  if (!isControlled.value) {
    internalPressed.value = newPressed;
  }

  emit('update:pressed', newPressed);
  emit('pressed-change', newPressed);
};
</script>
