<template>
  <button
    type="button"
    :class="buttonClasses"
    :aria-pressed="pressed"
    :disabled="props.disabled"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span class="apg-toggle-button-content">
      <slot />
    </span>
    <span
      :class="indicatorClasses"
      aria-hidden="true"
    >
      {{ pressed ? '●' : '○' }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Inherit all HTML button attributes
defineOptions({
  inheritAttrs: false
})

export interface ToggleButtonProps {
  /** Initial pressed state */
  initialPressed?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Callback fired when toggle state changes */
  onToggle?: (pressed: boolean) => void;
}

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  initialPressed: false,
  disabled: false,
  onToggle: undefined
})

const emit = defineEmits<{
  toggle: [pressed: boolean]
}>()

const pressed = ref(props.initialPressed)

const handleClick = () => {
  const newPressed = !pressed.value
  pressed.value = newPressed

  // Call onToggle prop if provided (for React compatibility)
  props.onToggle?.(newPressed)
  // Emit Vue event
  emit('toggle', newPressed)
}

// Build CSS classes
const buttonClasses = computed(() => {
  const stateClass = pressed.value
    ? 'apg-toggle-button--pressed'
    : 'apg-toggle-button--not-pressed'

  return `apg-toggle-button ${stateClass}`.trim()
})

const indicatorClasses = computed(() => {
  const stateClass = pressed.value
    ? 'apg-toggle-indicator--pressed'
    : 'apg-toggle-indicator--not-pressed'

  return `apg-toggle-indicator ${stateClass}`
})
</script>
