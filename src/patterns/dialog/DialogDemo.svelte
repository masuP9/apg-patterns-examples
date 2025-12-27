<!--
  Dialog Demo Component

  A wrapper component for demonstrating the Dialog pattern in Astro pages.
  This provides a simple trigger button that works seamlessly with Astro's islands architecture.
-->
<script lang="ts" module>
  export interface DialogDemoProps {
    /** Dialog title (required for accessibility) */
    title: string;
    /** Optional description text */
    description?: string;
    /** Text for the trigger button */
    triggerText: string;
    /** Additional CSS class for trigger button */
    triggerClass?: string;
    /** Default open state */
    defaultOpen?: boolean;
    /** Close on overlay click */
    closeOnOverlayClick?: boolean;
    /** Additional CSS class for dialog */
    className?: string;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Dialog content as HTML string (for Astro integration) */
    contentHtml?: string;
  }
</script>

<script lang="ts">
  import Dialog from './Dialog.svelte';

  let {
    title,
    description = undefined,
    triggerText,
    triggerClass = '',
    defaultOpen = false,
    closeOnOverlayClick = true,
    className = '',
    onOpenChange = () => {},
    contentHtml = '',
  }: DialogDemoProps = $props();
</script>

<Dialog
  {title}
  {description}
  {defaultOpen}
  {closeOnOverlayClick}
  {className}
  {onOpenChange}
>
  {#snippet trigger({ open })}
    <button
      type="button"
      class={`apg-dialog-trigger ${triggerClass}`.trim()}
      onclick={open}
    >
      {triggerText}
    </button>
  {/snippet}
  {#snippet children()}
    {@html contentHtml}
  {/snippet}
</Dialog>
