<template>
  <slot name="trigger" :open="openDialog" />

  <Teleport to="body">
    <dialog
      ref="dialogRef"
      role="alertdialog"
      :class="`apg-alert-dialog ${className}`.trim()"
      :aria-labelledby="titleId"
      :aria-describedby="messageId"
      @keydown.capture="handleKeyDown"
      @cancel="handleCancel2"
      @close="handleClose"
    >
      <h2 :id="titleId" class="apg-alert-dialog-title">
        {{ title }}
      </h2>
      <p :id="messageId" class="apg-alert-dialog-message">
        {{ message }}
      </p>
      <div class="apg-alert-dialog-actions">
        <button
          ref="cancelButtonRef"
          type="button"
          class="apg-alert-dialog-cancel"
          @click="handleCancel"
        >
          {{ cancelLabel }}
        </button>
        <button type="button" :class="confirmButtonClass" @click="handleConfirm">
          {{ confirmLabel }}
        </button>
      </div>
    </dialog>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';

export interface AlertDialogProps {
  /** Dialog title (required for accessibility) */
  title: string;
  /** Alert message (required - unlike regular Dialog) */
  message: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm button variant */
  confirmVariant?: 'default' | 'danger';
  /** Allow closing with Escape key (default: false - unlike regular Dialog) */
  allowEscapeClose?: boolean;
  /** Default open state */
  defaultOpen?: boolean;
  /** Additional CSS class */
  className?: string;
}

const props = withDefaults(defineProps<AlertDialogProps>(), {
  confirmLabel: 'OK',
  cancelLabel: 'Cancel',
  confirmVariant: 'default',
  allowEscapeClose: false,
  defaultOpen: false,
  className: '',
});

const emit = defineEmits<{
  confirm: [];
  cancel: [];
}>();

const dialogRef = ref<HTMLDialogElement>();
const cancelButtonRef = ref<HTMLButtonElement>();
const previousActiveElement = ref<HTMLElement | null>(null);
const instanceId = ref('');

onMounted(() => {
  instanceId.value = `alert-dialog-${Math.random().toString(36).substr(2, 9)}`;

  // Open on mount if defaultOpen
  if (props.defaultOpen && dialogRef.value) {
    dialogRef.value.showModal();
    focusCancelButton();
  }
});

const titleId = computed(() => `${instanceId.value}-title`);
const messageId = computed(() => `${instanceId.value}-message`);

const confirmButtonClass = computed(() => {
  const base = 'apg-alert-dialog-confirm';
  return props.confirmVariant === 'danger' ? `${base} ${base}--danger` : base;
});

const focusCancelButton = async () => {
  await nextTick();
  cancelButtonRef.value?.focus();
};

const openDialog = () => {
  if (dialogRef.value) {
    previousActiveElement.value = document.activeElement as HTMLElement;
    // Lock body scroll
    document.body.style.overflow = 'hidden';
    dialogRef.value.showModal();
    focusCancelButton();
  }
};

const closeDialog = () => {
  // Unlock body scroll
  document.body.style.overflow = '';
  dialogRef.value?.close();
};

const handleClose = () => {
  // Unlock body scroll
  document.body.style.overflow = '';
  // Return focus to trigger
  if (previousActiveElement.value) {
    previousActiveElement.value.focus();
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  // Handle Escape key
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    if (props.allowEscapeClose) {
      emit('cancel');
      closeDialog();
    }
    return;
  }

  // Handle focus trap for Tab key
  if (event.key === 'Tab' && dialogRef.value) {
    const focusableElements = dialogRef.value.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      // Shift+Tab from first element -> wrap to last
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab from last element -> wrap to first
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }
};

// Handle native cancel event (fired when Escape pressed in real browsers)
const handleCancel2 = (event: Event) => {
  if (!props.allowEscapeClose) {
    event.preventDefault();
  } else {
    emit('cancel');
  }
};

const handleConfirm = () => {
  emit('confirm');
  closeDialog();
};

const handleCancel = () => {
  emit('cancel');
  closeDialog();
};

// Expose methods for external control
defineExpose({
  open: openDialog,
  close: closeDialog,
});
</script>
