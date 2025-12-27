<script lang="ts">
  import type { Snippet } from "svelte";
  import { untrack } from "svelte";

  // properties
  interface ToggleButtonProps {
    children?: string | Snippet<[]>;
    initialPressed?: boolean;
    disabled?: boolean;
    onToggle?: (pressed: boolean) => void;
    /** Custom indicator for pressed state (default: "●") */
    pressedIndicator?: string | Snippet<[]>;
    /** Custom indicator for unpressed state (default: "○") */
    unpressedIndicator?: string | Snippet<[]>;
    [key: string]: unknown;
  }

  let {
    children,
    initialPressed = false,
    disabled = false,
    onToggle = (_) => {},
    pressedIndicator = "●",
    unpressedIndicator = "○",
    ...restProps
  }: ToggleButtonProps = $props();

  // state - use untrack to explicitly indicate we only want the initial value
  let pressed = $state(untrack(() => initialPressed));
  let currentIndicator = $derived(
    pressed ? pressedIndicator : unpressedIndicator
  );

  // Event handlers
  function handleClick() {
    pressed = !pressed;
    onToggle(pressed);
  }
</script>

<button
  type="button"
  aria-pressed={pressed}
  class="apg-toggle-button"
  {disabled}
  onclick={handleClick}
  {...restProps}
>
  <span class="apg-toggle-button-content">
    {#if typeof children === "string"}
      {children}
    {:else}
      {@render children?.()}
    {/if}
  </span>
  <span class="apg-toggle-indicator" aria-hidden="true">
    {#if typeof currentIndicator === "string"}
      {currentIndicator}
    {:else if currentIndicator}
      {@render currentIndicator()}
    {/if}
  </span>
</button>
