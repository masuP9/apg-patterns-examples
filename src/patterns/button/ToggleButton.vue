<template>
  <button
    type="button"
    class="apg-toggle-button"
    :aria-pressed="pressed"
    :disabled="props.disabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span class="apg-toggle-button-content">
      <slot />
    </span>
    <span class="apg-toggle-indicator" aria-hidden="true">
      <template v-if="pressed">
        <slot name="pressed-indicator">{{ props.pressedIndicator ?? '●' }}</slot>
      </template>
      <template v-else>
        <slot name="unpressed-indicator">{{ props.unpressedIndicator ?? '○' }}</slot>
      </template>
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Inherit all HTML button attributes
defineOptions({
  inheritAttrs: false,
});

export interface ToggleButtonProps {
  /** Initial pressed state */
  initialPressed?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Callback fired when toggle state changes */
  onToggle?: (pressed: boolean) => void;
  /** Custom indicator for pressed state (default: "●") */
  pressedIndicator?: string;
  /** Custom indicator for unpressed state (default: "○") */
  unpressedIndicator?: string;
}

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  initialPressed: false,
  disabled: false,
  onToggle: undefined,
  pressedIndicator: undefined,
  unpressedIndicator: undefined,
});

const emit = defineEmits<{
  toggle: [pressed: boolean];
}>();

defineSlots<{
  default(): unknown;
  'pressed-indicator'(): unknown;
  'unpressed-indicator'(): unknown;
}>();

const pressed = ref(props.initialPressed);

const handleClick = () => {
  const newPressed = !pressed.value;
  pressed.value = newPressed;

  // Call onToggle prop if provided (for React compatibility)
  props.onToggle?.(newPressed);
  // Emit Vue event
  emit('toggle', newPressed);
};
</script>
