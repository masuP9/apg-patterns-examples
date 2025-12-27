<!--
  Test wrapper for Dialog component
  Provides a simple trigger button for testing purposes
-->
<script lang="ts">
  import Dialog from './Dialog.svelte';

  let {
    title = 'Test Dialog',
    description = undefined,
    closeOnOverlayClick = true,
    defaultOpen = false,
    className = '',
    onOpenChange = () => {},
    contentText = 'Dialog content',
  }: {
    title?: string;
    description?: string;
    closeOnOverlayClick?: boolean;
    defaultOpen?: boolean;
    className?: string;
    onOpenChange?: (open: boolean) => void;
    contentText?: string;
  } = $props();
</script>

<Dialog
  {title}
  {description}
  {closeOnOverlayClick}
  {defaultOpen}
  {className}
  {onOpenChange}
>
  {#snippet trigger({ open })}
    <button type="button" onclick={open}>Open Dialog</button>
  {/snippet}
  {#snippet children()}
    <p>{contentText}</p>
  {/snippet}
</Dialog>
