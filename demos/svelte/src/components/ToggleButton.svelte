<script lang="ts">
  // Custom props
  export let initialPressed = false;
  export let onToggle: (pressed: boolean) => void = () => {};

  // State
  let pressed = initialPressed;

  // Event handlers
  function handleClick() {
    pressed = !pressed;
    onToggle(pressed);
  }

  function handleKeyUp(event: KeyboardEvent) {
    // Handle Space and Enter keys according to APG specification
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // Prevent default behavior (scrolling for space)
      handleClick();
    }
  }

  // Reactive classes
  $: stateClass = pressed
    ? "apg-toggle-button--pressed"
    : "apg-toggle-button--not-pressed";
  $: indicatorClass = pressed
    ? "apg-toggle-indicator--pressed"
    : "apg-toggle-indicator--not-pressed";
  $: buttonClasses = `apg-toggle-button ${stateClass}`.trim();
</script>

<button
  type="button"
  class={buttonClasses}
  aria-pressed={pressed}
  {...$$restProps}
  on:click={handleClick}
  on:keyup={handleKeyUp}
>
  <span class="apg-toggle-button-content">
    <slot />
  </span>
  <span class="apg-toggle-indicator {indicatorClass}" aria-hidden="true">
    {pressed ? "●" : "○"}
  </span>
</button>
