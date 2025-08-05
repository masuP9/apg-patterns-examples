<template>
  <div class="p-8 space-y-8">
    <Tabs
      :tabs="tabs"
      default-selected-id="tab1"
    />
    
    <Tabs
      :tabs="tabs.slice(0, 2)"
      orientation="vertical"
      default-selected-id="tab1"
    />
    
    <Tabs
      :tabs="tabs"
      activation="manual"
      default-selected-id="tab1"
    />
  </div>
</template>

<script setup lang="ts">
import Tabs from '../components/Tabs/Tabs.vue'

const tabs = [
  {
    id: 'tab1',
    label: 'First Tab',
    content: 'First tab content'
  },
  {
    id: 'tab2',
    label: 'Second Tab',
    content: 'Second tab content'
  },
  {
    id: 'tab3',
    label: 'Third Tab',
    content: 'Third tab content'
  }
]
</script>