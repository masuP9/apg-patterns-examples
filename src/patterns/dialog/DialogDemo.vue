<!--
  Dialog Demo Component

  A wrapper component for demonstrating the Dialog pattern in Astro pages.
  This provides a simple trigger button that works seamlessly with Astro's islands architecture.
-->
<template>
  <component
    :is="DialogComponent"
    v-if="DialogComponent"
    :title="title"
    :description="description"
    :default-open="defaultOpen"
    :close-on-overlay-click="closeOnOverlayClick"
    :class-name="className"
    @open-change="(open: boolean) => $emit('openChange', open)"
  >
    <template #trigger="{ open }">
      <button
        type="button"
        :class="`apg-dialog-trigger ${triggerClass}`.trim()"
        @click="open"
      >
        {{ triggerText }}
      </button>
    </template>
    <slot />
  </component>
  <button
    v-else
    type="button"
    :class="`apg-dialog-trigger ${triggerClass}`.trim()"
    disabled
  >
    {{ triggerText }}
  </button>
</template>

<script setup lang="ts">
import { shallowRef, onMounted } from 'vue'
import type { Component } from 'vue'

const DialogComponent = shallowRef<Component | null>(null)

onMounted(async () => {
  // @vite-ignore - Disable HMR for this dynamic import to avoid __VUE_HMR_RUNTIME__ error
  const module = await import(/* @vite-ignore */ './Dialog.vue')
  DialogComponent.value = module.default
})

export interface DialogDemoProps {
  /** Dialog title (required for accessibility) */
  title: string
  /** Optional description text */
  description?: string
  /** Text for the trigger button */
  triggerText: string
  /** Additional CSS class for trigger button */
  triggerClass?: string
  /** Default open state */
  defaultOpen?: boolean
  /** Close on overlay click */
  closeOnOverlayClick?: boolean
  /** Additional CSS class for dialog */
  className?: string
}

withDefaults(defineProps<DialogDemoProps>(), {
  description: undefined,
  triggerClass: '',
  defaultOpen: false,
  closeOnOverlayClick: true,
  className: ''
})

defineEmits<{
  openChange: [open: boolean]
}>()
</script>
