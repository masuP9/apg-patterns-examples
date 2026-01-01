<template>
  <button
    type="button"
    role="switch"
    class="apg-switch"
    :aria-checked="checked"
    :aria-disabled="props.disabled || undefined"
    :disabled="props.disabled"
    v-bind="$attrs"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <span class="apg-switch-track">
      <span class="apg-switch-icon" aria-hidden="true">
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span class="apg-switch-thumb" />
    </span>
    <span v-if="$slots.default" class="apg-switch-label">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineOptions({
  inheritAttrs: false
})

export interface SwitchProps {
  /** Initial checked state */
  initialChecked?: boolean;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  initialChecked: false,
  disabled: false,
  onCheckedChange: undefined
})

const emit = defineEmits<{
  change: [checked: boolean]
}>()

defineSlots<{
  default(): unknown
}>()

const checked = ref(props.initialChecked)

const toggle = () => {
  if (props.disabled) return
  const newChecked = !checked.value
  checked.value = newChecked
  props.onCheckedChange?.(newChecked)
  emit('change', newChecked)
}

const handleClick = () => {
  toggle()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault()
    toggle()
  }
}
</script>
