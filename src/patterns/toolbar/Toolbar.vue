<script lang="ts">
export interface ToolbarProps {
  /** Direction of the toolbar */
  orientation?: 'horizontal' | 'vertical'
}

export { ToolbarContextKey, type ToolbarContext } from './toolbar-context'
</script>

<template>
  <div
    ref="toolbarRef"
    role="toolbar"
    :aria-orientation="orientation"
    class="apg-toolbar"
    v-bind="$attrs"
    @keydown="handleKeyDown"
    @focus.capture="handleFocus"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, provide, watch, onMounted, useSlots } from 'vue'
import { ToolbarContextKey, type ToolbarContext } from './toolbar-context'

defineOptions({
  inheritAttrs: false
})

const props = withDefaults(defineProps<{
  /** Direction of the toolbar */
  orientation?: 'horizontal' | 'vertical'
}>(), {
  orientation: 'horizontal'
})

// Provide reactive context to child components
const orientationComputed = computed(() => props.orientation)
provide<ToolbarContext>(ToolbarContextKey, {
  orientation: orientationComputed
})

const toolbarRef = ref<HTMLDivElement | null>(null)
const focusedIndex = ref(0)
const slots = useSlots()

const getButtons = (): HTMLButtonElement[] => {
  if (!toolbarRef.value) return []
  return Array.from(
    toolbarRef.value.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
  )
}

// Roving tabindex: only the focused button should have tabIndex=0
const updateTabIndices = () => {
  const buttons = getButtons()
  if (buttons.length === 0) return

  // Clamp focusedIndex to valid range
  if (focusedIndex.value >= buttons.length) {
    focusedIndex.value = buttons.length - 1
    return // Will re-run with corrected index
  }

  buttons.forEach((btn, index) => {
    btn.tabIndex = index === focusedIndex.value ? 0 : -1
  })
}

onMounted(updateTabIndices)
watch(focusedIndex, updateTabIndices)
watch(() => slots.default?.(), updateTabIndices, { flush: 'post' })

const handleFocus = (event: FocusEvent) => {
  const buttons = getButtons()
  const targetIndex = buttons.findIndex(btn => btn === event.target)
  if (targetIndex !== -1) {
    focusedIndex.value = targetIndex
  }
}

const handleKeyDown = (event: KeyboardEvent) => {
  const buttons = getButtons()
  if (buttons.length === 0) return

  const currentIndex = buttons.findIndex(btn => btn === document.activeElement)
  if (currentIndex === -1) return

  const nextKey = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight'
  const prevKey = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft'
  const invalidKeys = props.orientation === 'vertical'
    ? ['ArrowLeft', 'ArrowRight']
    : ['ArrowUp', 'ArrowDown']

  // Ignore invalid direction keys
  if (invalidKeys.includes(event.key)) {
    return
  }

  let newIndex = currentIndex
  let shouldPreventDefault = false

  switch (event.key) {
    case nextKey:
      // No wrap - stop at end
      if (currentIndex < buttons.length - 1) {
        newIndex = currentIndex + 1
      }
      shouldPreventDefault = true
      break

    case prevKey:
      // No wrap - stop at start
      if (currentIndex > 0) {
        newIndex = currentIndex - 1
      }
      shouldPreventDefault = true
      break

    case 'Home':
      newIndex = 0
      shouldPreventDefault = true
      break

    case 'End':
      newIndex = buttons.length - 1
      shouldPreventDefault = true
      break
  }

  if (shouldPreventDefault) {
    event.preventDefault()
    if (newIndex !== currentIndex) {
      buttons[newIndex].focus()
      focusedIndex.value = newIndex
    }
  }
}
</script>
