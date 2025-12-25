<script lang="ts">
  import type { Snippet } from "svelte";

  // properties
  interface ToggleButtonProps {
    children?: string | Snippet<[]>;
    initialPressed?: boolean;
    onToggle?: (pressed: boolean) => void;
  }

  let {
    children,
    initialPressed = false,
    onToggle = (_) => {},
  }: ToggleButtonProps = $props();

  // state
  let pressed = $state(initialPressed);

  // Reactive classes
  let stateClass = $derived(
    pressed ? "apg-toggle-button--pressed" : "apg-toggle-button--not-pressed"
  );
  let indicatorClass = $derived(
    pressed
      ? "apg-toggle-indicator--pressed"
      : "apg-toggle-indicator--not-pressed"
  );
  let buttonClasses = $derived(`apg-toggle-button ${stateClass}`.trim());
  let toggleIndicator = $derived(pressed ? "●" : "○");

  // Event handlers
  function handleClick() {
    pressed = !pressed;
    onToggle(pressed);
  }
</script>

<button
  type="button"
  aria-pressed={pressed}
  class={buttonClasses}
  onclick={handleClick}
>
  <span class="apg-toggle-button-content">
    {#if typeof children === "string"}
      {children}
    {:else}
      {@render children?.()}
    {/if}
  </span>
  <span class="apg-toggle-indicator {indicatorClass}" aria-hidden="true">
    {toggleIndicator}
  </span>
</button>
