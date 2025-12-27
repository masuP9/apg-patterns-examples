<template>
  <div class="flex flex-wrap gap-4">
    <ToggleButton>
      <template #pressed-indicator><VolumeOff :size="20" /></template>
      <template #unpressed-indicator><Volume2 :size="20" /></template>
      Mute
    </ToggleButton>
    <ToggleButton initial-pressed>
      <template #pressed-indicator><Moon :size="20" /></template>
      <template #unpressed-indicator><Sun :size="20" /></template>
      Dark Mode
    </ToggleButton>
    <ToggleButton disabled>
      <template #pressed-indicator><BellOff :size="20" /></template>
      <template #unpressed-indicator><Bell :size="20" /></template>
      Notifications
    </ToggleButton>
  </div>
</template>

<script setup lang="ts">
import { Volume2, VolumeOff, Sun, Moon, Bell, BellOff } from 'lucide-vue-next'
import ToggleButton from './ToggleButton.vue'
</script>
