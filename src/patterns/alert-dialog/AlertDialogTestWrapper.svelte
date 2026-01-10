<!--
  Test wrapper for AlertDialog component
  Provides a simple trigger button for testing purposes
-->
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';

  let {
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    confirmVariant = 'default' as const,
    allowEscapeClose = false,
    defaultOpen = false,
    className = '',
    onConfirm = () => {},
    onCancel = () => {},
  }: {
    title?: string;
    message?: string;
    confirmLabel?: string;
    cancelLabel?: string;
    confirmVariant?: 'default' | 'danger';
    allowEscapeClose?: boolean;
    defaultOpen?: boolean;
    className?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  } = $props();
</script>

<AlertDialog
  {title}
  {message}
  {confirmLabel}
  {cancelLabel}
  {confirmVariant}
  {allowEscapeClose}
  {defaultOpen}
  {className}
  {onConfirm}
  {onCancel}
>
  {#snippet trigger({ open })}
    <button type="button" onclick={open}>Open Alert</button>
  {/snippet}
</AlertDialog>
