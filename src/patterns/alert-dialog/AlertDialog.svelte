<script lang="ts" module>
  import type { Snippet } from 'svelte';

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
    /** Callback when confirm button is clicked */
    onConfirm?: () => void;
    /** Callback when cancel button is clicked */
    onCancel?: () => void;
    /** Trigger snippet - receives open function */
    trigger: Snippet<[{ open: () => void }]>;
  }
</script>

<script lang="ts">
  import { onMount, tick } from 'svelte';

  let {
    title,
    message,
    confirmLabel = 'OK',
    cancelLabel = 'Cancel',
    confirmVariant = 'default',
    allowEscapeClose = false,
    defaultOpen = false,
    className = '',
    onConfirm = () => {},
    onCancel = () => {},
    trigger,
  }: AlertDialogProps = $props();

  let dialogElement = $state<HTMLDialogElement | undefined>(undefined);
  let cancelButtonElement = $state<HTMLButtonElement | undefined>(undefined);
  let previousActiveElement: HTMLElement | null = null;
  let instanceId = $state('');

  onMount(() => {
    instanceId = `alert-dialog-${Math.random().toString(36).substr(2, 9)}`;

    // Open on mount if defaultOpen
    if (defaultOpen && dialogElement) {
      dialogElement.showModal();
      focusCancelButton();
    }
  });

  let titleId = $derived(`${instanceId}-title`);
  let messageId = $derived(`${instanceId}-message`);
  let confirmButtonClass = $derived(
    confirmVariant === 'danger'
      ? 'apg-alert-dialog-confirm apg-alert-dialog-confirm--danger'
      : 'apg-alert-dialog-confirm'
  );

  async function focusCancelButton() {
    await tick();
    cancelButtonElement?.focus();
  }

  export function open() {
    if (dialogElement) {
      previousActiveElement = document.activeElement as HTMLElement;
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      dialogElement.showModal();
      focusCancelButton();
    }
  }

  export function close() {
    // Unlock body scroll
    document.body.style.overflow = '';
    dialogElement?.close();
  }

  function handleClose() {
    // Unlock body scroll
    document.body.style.overflow = '';
    // Return focus to trigger
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Handle Escape key
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      if (allowEscapeClose) {
        onCancel();
        close();
      }
      return;
    }

    // Handle focus trap for Tab key
    if (event.key === 'Tab' && dialogElement) {
      const focusableElements = dialogElement.querySelectorAll<HTMLElement>(
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
  }

  // Handle native cancel event (fired when Escape pressed in real browsers)
  function handleCancelEvent(event: Event) {
    if (!allowEscapeClose) {
      event.preventDefault();
    } else {
      onCancel();
    }
  }

  function handleConfirm() {
    onConfirm();
    close();
  }

  function handleCancel() {
    onCancel();
    close();
  }
</script>

<!-- Trigger snippet -->
{@render trigger({ open })}

<!-- Native Dialog Element with alertdialog role -->
<dialog
  bind:this={dialogElement}
  role="alertdialog"
  class={`apg-alert-dialog ${className}`.trim()}
  aria-labelledby={titleId}
  aria-describedby={messageId}
  onkeydowncapture={handleKeyDown}
  oncancel={handleCancelEvent}
  onclose={handleClose}
>
  <h2 id={titleId} class="apg-alert-dialog-title">
    {title}
  </h2>
  <p id={messageId} class="apg-alert-dialog-message">
    {message}
  </p>
  <div class="apg-alert-dialog-actions">
    <button
      bind:this={cancelButtonElement}
      type="button"
      class="apg-alert-dialog-cancel"
      onclick={handleCancel}
    >
      {cancelLabel}
    </button>
    <button type="button" class={confirmButtonClass} onclick={handleConfirm}>
      {confirmLabel}
    </button>
  </div>
</dialog>
