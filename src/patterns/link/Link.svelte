<script lang="ts">
  import type { Snippet } from 'svelte';

  interface LinkProps {
    /** Link destination URL */
    href?: string;
    /** Link target */
    target?: '_self' | '_blank';
    /** Whether the link is disabled */
    disabled?: boolean;
    /** Indicates current item in a set (e.g., current page in navigation) */
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | boolean;
    /** Click handler */
    onClick?: (event: MouseEvent | KeyboardEvent) => void;
    /** Children content (string for tests, Snippet for slots) */
    children?: string | Snippet<[]>;
    [key: string]: unknown;
  }

  let { href, target, disabled = false, onClick, children, ...restProps }: LinkProps = $props();

  function navigate() {
    if (!href) {
      return;
    }

    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  }

  function handleClick(event: MouseEvent) {
    if (disabled) {
      event.preventDefault();
      return;
    }

    onClick?.(event);

    // Navigate only if onClick didn't prevent the event
    if (!event.defaultPrevented) {
      navigate();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Ignore if composing (IME input) or already handled
    if (event.isComposing || event.defaultPrevented) {
      return;
    }

    if (disabled) {
      return;
    }

    // Only Enter key activates link (NOT Space)
    if (event.key === 'Enter') {
      onClick?.(event);

      // Navigate only if onClick didn't prevent the event
      if (!event.defaultPrevented) {
        navigate();
      }
    }
  }
</script>

<span
  role="link"
  tabindex={disabled ? -1 : 0}
  aria-disabled={disabled ? 'true' : undefined}
  class="apg-link {restProps.class || ''}"
  onclick={handleClick}
  onkeydown={handleKeyDown}
  {...restProps}
  class:undefined={false}
  >{#if typeof children === 'string'}{children}{:else if children}{@render children()}{/if}</span
>
