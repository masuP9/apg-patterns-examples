<template>
  <div :class="`apg-accordion ${className}`.trim()">
    <div
      v-for="item in items"
      :key="item.id"
      :class="getItemClass(item)"
    >
      <component :is="`h${headingLevel}`" class="apg-accordion-header">
        <button
          :ref="(el) => setButtonRef(item.id, el)"
          type="button"
          :id="`${instanceId}-header-${item.id}`"
          :aria-expanded="isExpanded(item.id)"
          :aria-controls="`${instanceId}-panel-${item.id}`"
          :aria-disabled="item.disabled || undefined"
          :disabled="item.disabled"
          :class="getTriggerClass(item)"
          @click="handleToggle(item.id)"
          @keydown="handleKeyDown($event, item.id)"
        >
          <span class="apg-accordion-trigger-content">{{ item.header }}</span>
          <span :class="getIconClass(item)" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </button>
      </component>
      <div
        :role="useRegion ? 'region' : undefined"
        :id="`${instanceId}-panel-${item.id}`"
        :aria-labelledby="useRegion ? `${instanceId}-header-${item.id}` : undefined"
        :class="getPanelClass(item)"
      >
        <div class="apg-accordion-panel-content">
          <div v-if="item.content" v-html="item.content" />
          <slot v-else :name="item.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * APG Accordion Pattern - Vue Implementation
 *
 * A vertically stacked set of interactive headings that each reveal a section of content.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
import { ref, computed, onMounted } from 'vue'

/**
 * Accordion item configuration
 */
export interface AccordionItem {
  /** Unique identifier for the item */
  id: string
  /** Content displayed in the accordion header button */
  header: string
  /** Content displayed in the collapsible panel (HTML string) */
  content?: string
  /** When true, the item cannot be expanded/collapsed */
  disabled?: boolean
  /** When true, the panel is expanded on initial render */
  defaultExpanded?: boolean
}

/**
 * Props for the Accordion component
 *
 * @example
 * ```vue
 * <Accordion
 *   :items="[
 *     { id: 'section1', header: 'Section 1', content: 'Content 1', defaultExpanded: true },
 *     { id: 'section2', header: 'Section 2', content: 'Content 2' },
 *   ]"
 *   :heading-level="3"
 *   :allow-multiple="false"
 *   @expanded-change="(ids) => console.log('Expanded:', ids)"
 * />
 * ```
 */
export interface AccordionProps {
  /** Array of accordion items to display */
  items: AccordionItem[]
  /** Allow multiple panels to be expanded simultaneously @default false */
  allowMultiple?: boolean
  /** Heading level for accessibility (h2-h6) @default 3 */
  headingLevel?: 2 | 3 | 4 | 5 | 6
  /** Enable arrow key navigation @default true */
  enableArrowKeys?: boolean
  /** Additional CSS class @default "" */
  className?: string
}

const props = withDefaults(defineProps<AccordionProps>(), {
  allowMultiple: false,
  headingLevel: 3,
  enableArrowKeys: true,
  className: ''
})

const emit = defineEmits<{
  expandedChange: [expandedIds: string[]]
}>()

const expandedIds = ref<string[]>([])
const instanceId = ref('')
const buttonRefs = ref<Record<string, HTMLButtonElement>>({})

onMounted(() => {
  instanceId.value = `accordion-${Math.random().toString(36).substr(2, 9)}`
  // Initialize with defaultExpanded items
  expandedIds.value = props.items
    .filter(item => item.defaultExpanded && !item.disabled)
    .map(item => item.id)
})

const setButtonRef = (id: string, el: unknown) => {
  if (el instanceof HTMLButtonElement) {
    buttonRefs.value[id] = el
  }
}

const availableItems = computed(() => props.items.filter(item => !item.disabled))

// Use role="region" only for 6 or fewer panels (APG recommendation)
const useRegion = computed(() => props.items.length <= 6)

const isExpanded = (itemId: string) => expandedIds.value.includes(itemId)

const getItemClass = (item: AccordionItem) => {
  const classes = ['apg-accordion-item']
  if (isExpanded(item.id)) classes.push('apg-accordion-item--expanded')
  if (item.disabled) classes.push('apg-accordion-item--disabled')
  return classes.join(' ')
}

const getTriggerClass = (item: AccordionItem) => {
  const classes = ['apg-accordion-trigger']
  if (isExpanded(item.id)) classes.push('apg-accordion-trigger--expanded')
  return classes.join(' ')
}

const getIconClass = (item: AccordionItem) => {
  const classes = ['apg-accordion-icon']
  if (isExpanded(item.id)) classes.push('apg-accordion-icon--expanded')
  return classes.join(' ')
}

const getPanelClass = (item: AccordionItem) => {
  return `apg-accordion-panel ${isExpanded(item.id) ? 'apg-accordion-panel--expanded' : 'apg-accordion-panel--collapsed'}`
}

const handleToggle = (itemId: string) => {
  const item = props.items.find(i => i.id === itemId)
  if (item?.disabled) return

  const isCurrentlyExpanded = expandedIds.value.includes(itemId)

  if (isCurrentlyExpanded) {
    expandedIds.value = expandedIds.value.filter(id => id !== itemId)
  } else {
    if (props.allowMultiple) {
      expandedIds.value = [...expandedIds.value, itemId]
    } else {
      expandedIds.value = [itemId]
    }
  }

  emit('expandedChange', expandedIds.value)
}

const handleKeyDown = (event: KeyboardEvent, currentItemId: string) => {
  if (!props.enableArrowKeys) return

  const currentIndex = availableItems.value.findIndex(item => item.id === currentItemId)
  if (currentIndex === -1) return

  let newIndex = currentIndex
  let shouldPreventDefault = false

  switch (event.key) {
    case 'ArrowDown':
      // Move to next, but don't wrap (APG compliant)
      if (currentIndex < availableItems.value.length - 1) {
        newIndex = currentIndex + 1
      }
      shouldPreventDefault = true
      break

    case 'ArrowUp':
      // Move to previous, but don't wrap (APG compliant)
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
      newIndex = availableItems.value.length - 1
      shouldPreventDefault = true
      break
  }

  if (shouldPreventDefault) {
    event.preventDefault()
    if (newIndex !== currentIndex) {
      const newItem = availableItems.value[newIndex]
      if (newItem && buttonRefs.value[newItem.id]) {
        buttonRefs.value[newItem.id].focus()
      }
    }
  }
}
</script>
