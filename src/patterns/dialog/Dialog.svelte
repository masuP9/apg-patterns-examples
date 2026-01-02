<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export interface DialogProps {
    /** Dialog title (required for accessibility) */
    title: string;
    /** Optional description text */
    description?: string;
    /** Default open state */
    defaultOpen?: boolean;
    /** Close on overlay click */
    closeOnOverlayClick?: boolean;
    /** Additional CSS class */
    className?: string;
    /** Callback when open state changes */
    onOpenChange?: (open: boolean) => void;
    /** Trigger snippet - receives open function */
    trigger: Snippet<[{ open: () => void }]>;
    /** Dialog content */
    children: Snippet;
  }
</script>

<script lang="ts">
  import { onMount } from 'svelte';

  let {
    title,
    description = undefined,
    defaultOpen = false,
    closeOnOverlayClick = true,
    className = '',
    onOpenChange = () => {},
    trigger,
    children,
  }: DialogProps = $props();

  let dialogElement = $state<HTMLDialogElement | undefined>(undefined);
  let previousActiveElement: HTMLElement | null = null;
  let instanceId = $state('');

  onMount(() => {
    instanceId = `dialog-${Math.random().toString(36).substr(2, 9)}`;

    // Open on mount if defaultOpen
    if (defaultOpen && dialogElement) {
      dialogElement.showModal();
      onOpenChange(true);
    }
  });

  let titleId = $derived(`${instanceId}-title`);
  let descriptionId = $derived(`${instanceId}-description`);

  export function open() {
    if (dialogElement) {
      previousActiveElement = document.activeElement as HTMLElement;
      dialogElement.showModal();
      onOpenChange(true);
    }
  }

  export function close() {
    dialogElement?.close();
  }

  function handleClose() {
    onOpenChange(false);
    // Return focus to trigger
    if (previousActiveElement) {
      previousActiveElement.focus();
    }
  }

  function handleDialogClick(event: MouseEvent) {
    // Close on backdrop click
    if (closeOnOverlayClick && event.target === dialogElement) {
      close();
    }
  }
</script>

<!-- Trigger snippet -->
{@render trigger({ open })}

<!-- Native Dialog Element -->
<dialog
  bind:this={dialogElement}
  class={`apg-dialog ${className}`.trim()}
  aria-labelledby={titleId}
  aria-describedby={description ? descriptionId : undefined}
  onclick={handleDialogClick}
  onclose={handleClose}
>
  <div class="apg-dialog-header">
    <h2 id={titleId} class="apg-dialog-title">
      {title}
    </h2>
    <button type="button" class="apg-dialog-close" onclick={close} aria-label="Close dialog">
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
  {#if description}
    <p id={descriptionId} class="apg-dialog-description">
      {description}
    </p>
  {/if}
  <div class="apg-dialog-body">
    {@render children()}
  </div>
</dialog>
