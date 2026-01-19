<script lang="ts">
  /**
   * Custom Button using role="button"
   *
   * This component demonstrates how to implement a custom button using ARIA.
   * For production use, prefer the native <button> element which provides
   * all accessibility features automatically.
   *
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
   */
  import type { Snippet } from 'svelte';

  interface ButtonProps {
    /** Whether the button is disabled */
    disabled?: boolean;
    /** Click handler */
    onClick?: (event: MouseEvent | KeyboardEvent) => void;
    /** Children content (string for tests, Snippet for slots) */
    children?: string | Snippet<[]>;
    [key: string]: unknown;
  }

  let { disabled = false, onClick, children, ...restProps }: ButtonProps = $props();

  // Track if Space was pressed on this element (for keyup activation)
  let spacePressed = $state(false);

  function handleClick(event: MouseEvent) {
    if (disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onClick?.(event);
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Ignore if composing (IME input) or already handled
    if (event.isComposing || event.defaultPrevented) {
      return;
    }

    if (disabled) {
      return;
    }

    // Space: prevent scroll on keydown, activate on keyup (native button behavior)
    if (event.key === ' ') {
      event.preventDefault();
      spacePressed = true;
      return;
    }

    // Enter: activate on keydown (native button behavior)
    if (event.key === 'Enter') {
      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  }

  function handleKeyUp(event: KeyboardEvent) {
    // Space: activate on keyup if Space was pressed on this element
    if (event.key === ' ' && spacePressed) {
      spacePressed = false;

      if (disabled) {
        return;
      }

      event.preventDefault();
      (event.currentTarget as HTMLElement).click();
    }
  }
</script>

<span
  {...restProps}
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-disabled={disabled ? 'true' : undefined}
  class="apg-button {restProps.class || ''}"
  onclick={handleClick}
  onkeydown={handleKeyDown}
  onkeyup={handleKeyUp}
  class:undefined={false}
  >{#if typeof children === 'string'}{children}{:else if children}{@render children()}{/if}</span
>
