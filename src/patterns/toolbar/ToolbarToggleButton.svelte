<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import { getToolbarContext } from './toolbar-context.svelte';

  interface ToolbarToggleButtonProps {
    children?: Snippet<[]>;
    /** Controlled pressed state */
    pressed?: boolean;
    /** Default pressed state (uncontrolled) */
    defaultPressed?: boolean;
    /** Callback when pressed state changes */
    onPressedChange?: (pressed: boolean) => void;
    disabled?: boolean;
    class?: string;
    onclick?: (event: MouseEvent) => void;
    [key: string]: unknown;
  }

  let {
    children,
    pressed: controlledPressed = undefined,
    defaultPressed = false,
    onPressedChange,
    disabled = false,
    class: className = '',
    onclick,
    ...restProps
  }: ToolbarToggleButtonProps = $props();

  // Verify we're inside a Toolbar
  const context = getToolbarContext();
  if (!context) {
    console.warn('ToolbarToggleButton must be used within a Toolbar');
  }

  let internalPressed = $state(untrack(() => defaultPressed));
  let isControlled = $derived(controlledPressed !== undefined);
  let pressed = $derived(isControlled ? controlledPressed : internalPressed);

  function handleClick(event: MouseEvent) {
    if (disabled) return;

    const newPressed = !pressed;

    if (!isControlled) {
      internalPressed = newPressed;
    }

    onPressedChange?.(newPressed);
    onclick?.(event);
  }
</script>

<button
  type="button"
  aria-pressed={pressed}
  class="apg-toolbar-button {className}"
  {disabled}
  onclick={handleClick}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button>
