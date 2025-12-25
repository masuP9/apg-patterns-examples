<template>
  <div :class="containerClass">
    <div
      ref="tablistRef"
      role="tablist"
      :aria-label="label"
      :aria-orientation="orientation"
      :class="tablistClass"
      @keydown="handleKeyDown"
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :ref="(el) => setTabRef(tab.id, el)"
        role="tab"
        type="button"
        :id="`${tablistId}-tab-${tab.id}`"
        :aria-selected="tab.id === selectedId"
        :aria-controls="tab.id === selectedId ? `${tablistId}-panel-${tab.id}` : undefined"
        :tabindex="tab.disabled ? -1 : (tab.id === selectedId ? 0 : -1)"
        :disabled="tab.disabled"
        :class="getTabClass(tab)"
        @click="!tab.disabled && handleTabSelection(tab.id)"
      >
        <span class="apg-tab-label">{{ tab.label }}</span>
      </button>
    </div>

    <div class="apg-tabpanels">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        role="tabpanel"
        :id="`${tablistId}-panel-${tab.id}`"
        :aria-labelledby="`${tablistId}-tab-${tab.id}`"
        :hidden="tab.id !== selectedId"
        :class="getPanelClass(tab)"
        :tabindex="tab.id === selectedId ? 0 : -1"
      >
        <div v-if="tab.content" v-html="tab.content" />
        <slot v-else :name="tab.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue'

export interface TabItem {
  id: string
  label: string
  content?: string
  disabled?: boolean
}

export interface TabsProps {
  tabs: TabItem[]
  defaultSelectedId?: string
  orientation?: 'horizontal' | 'vertical'
  activationMode?: 'automatic' | 'manual'
  label?: string
}

const props = withDefaults(defineProps<TabsProps>(), {
  orientation: 'horizontal',
  activationMode: 'automatic',
  label: undefined
})

const emit = defineEmits<{
  selectionChange: [tabId: string]
}>()

const selectedId = ref<string>('')
const focusedIndex = ref<number>(0)
const tablistRef = ref<HTMLElement>()
const tabRefs = ref<Record<string, HTMLButtonElement>>({})
const tablistId = ref('')

onMounted(() => {
  tablistId.value = `tabs-${Math.random().toString(36).substr(2, 9)}`
})

const setTabRef = (id: string, el: unknown) => {
  if (el instanceof HTMLButtonElement) {
    tabRefs.value[id] = el
  }
}

const initializeSelectedTab = () => {
  if (props.tabs.length > 0) {
    const initialTab = props.defaultSelectedId
      ? props.tabs.find(tab => tab.id === props.defaultSelectedId && !tab.disabled)
      : props.tabs.find(tab => !tab.disabled)
    selectedId.value = initialTab?.id || props.tabs[0]?.id
  }
}

const availableTabs = computed(() => props.tabs.filter(tab => !tab.disabled))

const containerClass = computed(() => {
  return `apg-tabs ${props.orientation === 'vertical' ? 'apg-tabs--vertical' : 'apg-tabs--horizontal'}`
})

const tablistClass = computed(() => {
  return `apg-tablist ${props.orientation === 'vertical' ? 'apg-tablist--vertical' : 'apg-tablist--horizontal'}`
})

const getTabClass = (tab: TabItem) => {
  const classes = ['apg-tab']
  classes.push(props.orientation === 'vertical' ? 'apg-tab--vertical' : 'apg-tab--horizontal')
  if (tab.id === selectedId.value) classes.push('apg-tab--selected')
  if (tab.disabled) classes.push('apg-tab--disabled')
  return classes.join(' ')
}

const getPanelClass = (tab: TabItem) => {
  return `apg-tabpanel ${tab.id === selectedId.value ? 'apg-tabpanel--active' : 'apg-tabpanel--inactive'}`
}

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
  const target = event.target
  if (!tablistRef.value || !(target instanceof Node) || !tablistRef.value.contains(target)) {
    return
  }

  let newIndex = focusedIndex.value
  let shouldPreventDefault = false

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      newIndex = (focusedIndex.value + 1) % availableTabs.value.length
      shouldPreventDefault = true
      break

    case 'ArrowLeft':
    case 'ArrowUp':
      newIndex = (focusedIndex.value - 1 + availableTabs.value.length) % availableTabs.value.length
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
      if (props.activationMode === 'manual') {
        const focusedTab = availableTabs.value[focusedIndex.value]
        if (focusedTab) {
          handleTabSelection(focusedTab.id)
        }
      }
      shouldPreventDefault = true
      break
  }

  if (shouldPreventDefault) {
    event.preventDefault()

    if (newIndex !== focusedIndex.value) {
      await handleTabFocus(newIndex)

      if (props.activationMode === 'automatic') {
        const newTab = availableTabs.value[newIndex]
        if (newTab) {
          handleTabSelection(newTab.id)
        }
      }
    }
  }
}

watch(() => props.tabs, initializeSelectedTab, { immediate: true })

watch(selectedId, (newSelectedId) => {
  const selectedIndex = availableTabs.value.findIndex(tab => tab.id === newSelectedId)
  if (selectedIndex >= 0) {
    focusedIndex.value = selectedIndex
  }
})
</script>
