<template>
  <slot name="trigger" :open="openDialog" />

  <Teleport to="body">
    <dialog
      ref="dialogRef"
      :class="`apg-dialog ${className}`.trim()"
      :aria-labelledby="titleId"
      :aria-describedby="description ? descriptionId : undefined"
      @click="handleDialogClick"
      @close="handleClose"
    >
      <div class="apg-dialog-header">
        <h2 :id="titleId" class="apg-dialog-title">
          {{ title }}
        </h2>
        <button
          type="button"
          class="apg-dialog-close"
          @click="closeDialog"
          aria-label="Close dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <p v-if="description" :id="descriptionId" class="apg-dialog-description">
        {{ description }}
      </p>
      <div class="apg-dialog-body">
        <slot />
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

export interface DialogProps {
  /** Dialog title (required for accessibility) */
  title: string
  /** Optional description text */
  description?: string
  /** Default open state */
  defaultOpen?: boolean
  /** Close on overlay click */
  closeOnOverlayClick?: boolean
  /** Additional CSS class */
  className?: string
}

const props = withDefaults(defineProps<DialogProps>(), {
  description: undefined,
  defaultOpen: false,
  closeOnOverlayClick: true,
  className: ''
})

const emit = defineEmits<{
  openChange: [open: boolean]
}>()

const dialogRef = ref<HTMLDialogElement>()
const previousActiveElement = ref<HTMLElement | null>(null)
const instanceId = ref('')

onMounted(() => {
  instanceId.value = `dialog-${Math.random().toString(36).substr(2, 9)}`

  // Open on mount if defaultOpen
  if (props.defaultOpen && dialogRef.value) {
    dialogRef.value.showModal()
    emit('openChange', true)
  }
})

const titleId = computed(() => `${instanceId.value}-title`)
const descriptionId = computed(() => `${instanceId.value}-description`)

const openDialog = () => {
  if (dialogRef.value) {
    previousActiveElement.value = document.activeElement as HTMLElement
    dialogRef.value.showModal()
    emit('openChange', true)
  }
}

const closeDialog = () => {
  dialogRef.value?.close()
}

const handleClose = () => {
  emit('openChange', false)
  // Return focus to trigger
  if (previousActiveElement.value) {
    previousActiveElement.value.focus()
  }
}

const handleDialogClick = (event: MouseEvent) => {
  // Close on backdrop click
  if (props.closeOnOverlayClick && event.target === dialogRef.value) {
    closeDialog()
  }
}

// Expose methods for external control
defineExpose({
  open: openDialog,
  close: closeDialog
})
</script>
