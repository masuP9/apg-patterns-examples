<template>
  <button
    type="button"
    :class="buttonClasses"
    :aria-pressed="pressed"
    v-bind="$attrs"
    @click="handleClick"
    @keydown="handleKeyDown"
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
  /** Callback fired when toggle state changes */
  onToggle?: (pressed: boolean) => void;
}

const props = withDefaults(defineProps<ToggleButtonProps>(), {
  initialPressed: false,
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

const handleKeyDown = (event: KeyboardEvent) => {
  // Handle Space and Enter keys according to APG specification
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault() // Prevent default behavior (scrolling for space)
    handleClick()
  }
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