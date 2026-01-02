<script lang="ts" module>
  import type { Snippet } from 'svelte';

  export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

  export interface TooltipProps {
    /** Tooltip content - can be string or Snippet for rich content */
    content: string | Snippet;
    /** Trigger element - must be a focusable element for keyboard accessibility */
    children?: Snippet<[{ describedBy: string | undefined }]>;
    /** Controlled open state */
    open?: boolean;
    /** Default open state (uncontrolled) */
    defaultOpen?: boolean;
    /** Delay before showing tooltip (ms) */
    delay?: number;
    /** Tooltip placement */
    placement?: TooltipPlacement;
    /**
     * Tooltip ID - Required for SSR/hydration consistency.
     * Must be unique and stable across server and client renders.
     */
    id: string;
    /** Whether the tooltip is disabled */
    disabled?: boolean;
    /** Additional class name for the wrapper */
    class?: string;
    /** Additional class name for the tooltip content */
    tooltipClass?: string;
  }
</script>

<script lang="ts">
  import { cn } from '@/lib/utils';
  import { onDestroy } from 'svelte';

  let {
    content,
    children,
    open: controlledOpen = undefined,
    defaultOpen = false,
    delay = 300,
    placement = 'top',
    id,
    disabled = false,
    class: className = '',
    tooltipClass = '',
    onOpenChange,
  }: TooltipProps & { onOpenChange?: (open: boolean) => void } = $props();

  // Use provided id directly - required for SSR/hydration consistency
  const tooltipId = $derived(id);

  let internalOpen = $state(defaultOpen);
  let timeout: ReturnType<typeof setTimeout> | null = null;

  let isControlled = $derived(controlledOpen !== undefined);
  let isOpen = $derived(isControlled ? controlledOpen : internalOpen);

  // aria-describedby should always be set when not disabled for screen reader accessibility
  // This ensures SR users know the element has a description even before tooltip is visible
  let describedBy = $derived(!disabled ? tooltipId : undefined);

  function setOpen(value: boolean) {
    if (controlledOpen === undefined) {
      internalOpen = value;
    }
    onOpenChange?.(value);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      hideTooltip();
    }
  }

  function showTooltip() {
    if (disabled) return;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      setOpen(true);
    }, delay);
  }

  function hideTooltip() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    setOpen(false);
  }

  // Manage keydown listener based on isOpen state
  // This handles both controlled and uncontrolled modes
  $effect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.removeEventListener('keydown', handleKeyDown);
    }
  });

  // Cleanup on destroy - fix for memory leak
  onDestroy(() => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
    document.removeEventListener('keydown', handleKeyDown);
  });

  const placementClasses: Record<TooltipPlacement, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
  class={cn('apg-tooltip-trigger', 'relative inline-block', className)}
  onmouseenter={showTooltip}
  onmouseleave={hideTooltip}
  onfocusin={showTooltip}
  onfocusout={hideTooltip}
>
  {#if children}
    {@render children({ describedBy })}
  {/if}
  <span
    id={tooltipId}
    role="tooltip"
    aria-hidden={!isOpen}
    class={cn(
      'apg-tooltip',
      'absolute z-50 px-3 py-1.5 text-sm',
      'rounded-md bg-gray-900 text-white shadow-lg',
      'dark:bg-gray-100 dark:text-gray-900',
      'pointer-events-none whitespace-nowrap',
      'transition-opacity duration-150',
      placementClasses[placement],
      isOpen ? 'visible opacity-100' : 'invisible opacity-0',
      tooltipClass
    )}
  >
    {#if typeof content === 'string'}
      {content}
    {:else}
      {@render content()}
    {/if}
  </span>
</span>
