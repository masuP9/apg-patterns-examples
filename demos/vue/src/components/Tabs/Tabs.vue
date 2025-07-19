<template>
  <div :class="['tabs-container', { vertical: orientation === 'vertical' }]">
    <!-- Tablist -->
    <div
      ref="tablistRef"
      role="tablist"
      :aria-orientation="orientation"
      class="tablist"
      @keydown="handleKeyDown"
    >
      <button
        v-for="(tab, index) in tabs"
        :key="tab.id"
        :ref="(el) => setTabRef(tab.id, el as HTMLButtonElement)"
        role="tab"
        type="button"
        :id="`${tablistId}-tab-${tab.id}`"
        :aria-selected="tab.id === selectedId"
        :aria-controls="tab.id === selectedId ? `${tablistId}-panel-${tab.id}` : undefined"
        :tabindex="tab.disabled ? -1 : (tab.id === selectedId ? 0 : -1)"
        :disabled="tab.disabled"
        :class="['tab', {
          selected: tab.id === selectedId,
          disabled: tab.disabled
        }]"
        @click="!tab.disabled && handleTabSelection(tab.id)"
      >
        <span class="tab-label">{{ tab.label }}</span>
        <button
          v-if="deletable && !tab.disabled"
          type="button"
          class="delete-button"
          :aria-label="`Delete ${tab.label} tab`"
          @click.stop="$emit('tabDelete', tab.id)"
        >
          ×
        </button>
      </button>
    </div>

    <!-- Tab Panels -->
    <div class="tabpanels">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        role="tabpanel"
        :id="`${tablistId}-panel-${tab.id}`"
        :aria-labelledby="`${tablistId}-tab-${tab.id}`"
        :hidden="tab.id !== selectedId"
        :class="['tabpanel', { active: tab.id === selectedId }]"
        :tabindex="tab.id === selectedId ? 0 : -1"
      >
        <div v-if="tab.content" v-html="tab.content" />
        <slot v-else :name="`panel-${tab.id}`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'

// Types
export interface TabItem {
  id: string
  label: string
  content?: string
  disabled?: boolean
}

// Props
export interface TabsProps {
  tabs: TabItem[]
  defaultSelectedId?: string
  orientation?: 'horizontal' | 'vertical'
  activation?: 'automatic' | 'manual'
  deletable?: boolean
}

const props = withDefaults(defineProps<TabsProps>(), {
  orientation: 'horizontal',
  activation: 'automatic',
  deletable: false
})

// Emits
const emit = defineEmits<{
  selectionChange: [tabId: string]
  tabDelete: [tabId: string]
}>()

// State
const selectedId = ref<string>('')
const focusedIndex = ref<number>(0)
const tablistRef = ref<HTMLElement>()
const tabRefs = ref<Record<string, HTMLButtonElement>>({})

// Generate unique ID for accessibility
let tablistId = ''
onMounted(() => {
  tablistId = `tabs-${Math.random().toString(36).substr(2, 9)}`
})

// Helper to set tab refs
const setTabRef = (id: string, el: HTMLButtonElement) => {
  if (el) {
    tabRefs.value[id] = el
  }
}

// Initialize selected tab
const initializeSelectedTab = () => {
  if (props.tabs.length > 0) {
    const initialTab = props.defaultSelectedId 
      ? props.tabs.find(tab => tab.id === props.defaultSelectedId && !tab.disabled)
      : props.tabs.find(tab => !tab.disabled)
    selectedId.value = initialTab?.id || props.tabs[0]?.id
  }
}

// Get available (non-disabled) tabs
const availableTabs = computed(() => props.tabs.filter(tab => !tab.disabled))

// Methods
const handleTabSelection = (tabId: string) => {
  selectedId.value = tabId
  emit('selectionChange', tabId)
}

const handleTabFocus = async (index: number) => {
  focusedIndex.value = index
  const tab = availableTabs.value[index]
  if (tab && tabRefs.value[tab.id]) {
    await nextTick()
    tabRefs.value[tab.id].focus()
  }
}

const handleKeyDown = async (event: KeyboardEvent) => {
  // Only handle keyboard events if focus is on a tab
  if (!tablistRef.value?.contains(event.target as Node)) {
    return
  }

  let newIndex = focusedIndex.value
  let shouldPreventDefault = false

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      newIndex = props.orientation === 'horizontal' 
        ? (focusedIndex.value + 1) % availableTabs.value.length
        : (focusedIndex.value + 1) % availableTabs.value.length
      shouldPreventDefault = true
      break
      
    case 'ArrowLeft':
    case 'ArrowUp':
      newIndex = props.orientation === 'horizontal'
        ? (focusedIndex.value - 1 + availableTabs.value.length) % availableTabs.value.length
        : (focusedIndex.value - 1 + availableTabs.value.length) % availableTabs.value.length
      shouldPreventDefault = true
      break
      
    case 'Home':
      newIndex = 0
      shouldPreventDefault = true
      break
      
    case 'End':
      newIndex = availableTabs.value.length - 1
      shouldPreventDefault = true
      break
      
    case 'Enter':
    case ' ':
      if (props.activation === 'manual') {
        const focusedTab = availableTabs.value[focusedIndex.value]
        if (focusedTab) {
          handleTabSelection(focusedTab.id)
        }
      }
      shouldPreventDefault = true
      break
      
    case 'Delete':
      if (props.deletable) {
        const focusedTab = availableTabs.value[focusedIndex.value]
        if (focusedTab) {
          emit('tabDelete', focusedTab.id)
        }
      }
      shouldPreventDefault = true
      break
  }

  if (shouldPreventDefault) {
    event.preventDefault()
    
    if (newIndex !== focusedIndex.value) {
      await handleTabFocus(newIndex)
      
      // Automatic activation: select tab when focus moves
      if (props.activation === 'automatic') {
        const newTab = availableTabs.value[newIndex]
        if (newTab) {
          handleTabSelection(newTab.id)
        }
      }
    }
  }
}

// Watchers
watch(() => props.tabs, initializeSelectedTab, { immediate: true })

// Update focused index when selected tab changes
watch(selectedId, (newSelectedId) => {
  const selectedIndex = availableTabs.value.findIndex(tab => tab.id === newSelectedId)
  if (selectedIndex >= 0) {
    focusedIndex.value = selectedIndex
  }
})
</script>

<style scoped>
/* APG Tabs Component Styles */
.tabs-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  overflow: hidden;
}

.tabs-container.vertical {
  flex-direction: row;
}

/* Tablist */
.tablist {
  display: flex;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  margin: 0;
  padding: 0;
}

.vertical .tablist {
  flex-direction: column;
  border-bottom: none;
  border-right: 1px solid #e5e7eb;
  min-width: 200px;
}

/* Individual Tab */
.tab {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.vertical .tab {
  border-bottom: none;
  border-right: 2px solid transparent;
  justify-content: flex-start;
  width: 100%;
  text-align: left;
}

/* Tab States */
.tab:hover:not(.disabled) {
  background: #f3f4f6;
  color: #374151;
}

.tab:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
  z-index: 1;
}

.tab.selected {
  background: white;
  color: #374151;
  border-bottom-color: #3b82f6;
}

.vertical .tab.selected {
  border-bottom-color: transparent;
  border-right-color: #3b82f6;
}

.tab.disabled {
  color: #9ca3af;
  cursor: not-allowed;
  opacity: 0.6;
}

.tab.disabled:hover {
  background: none;
  color: #9ca3af;
}

/* Tab Label */
.tab-label {
  flex: 1;
}

/* Delete Button */
.delete-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background: none;
  border: none;
  border-radius: 50%;
  font-size: 16px;
  line-height: 1;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.25rem;
}

.delete-button:hover {
  background: #ef4444;
  color: white;
}

.delete-button:focus {
  outline: 2px solid #ef4444;
  outline-offset: 1px;
}

/* Tab Panels Container */
.tabpanels {
  flex: 1;
  position: relative;
  background: white;
}

/* Individual Tab Panel */
.tabpanel {
  padding: 1rem;
  min-height: 200px;
}

.tabpanel:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
}

.tabpanel:not(.active) {
  display: none;
}

/* Responsive Design */
@media (max-width: 768px) {
  .tablist {
    overflow-x: auto;
    scrollbar-width: thin;
  }
  
  .tab {
    flex-shrink: 0;
    min-width: 120px;
  }
  
  .vertical .tabs-container {
    flex-direction: column;
  }
  
  .vertical .tablist {
    flex-direction: row;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
    min-width: auto;
  }
  
  .vertical .tab {
    border-right: none;
    border-bottom: 2px solid transparent;
  }
  
  .vertical .tab.selected {
    border-right-color: transparent;
    border-bottom-color: #3b82f6;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .tab {
    transition: none;
  }
  
  .delete-button {
    transition: none;
  }
}
</style>