<script lang="ts">
  import type { Snippet } from 'svelte';
  import { setToolbarContext } from './toolbar-context.svelte';

  interface ToolbarProps {
    children?: Snippet<[]>;
    orientation?: 'horizontal' | 'vertical';
    class?: string;
    [key: string]: unknown;
  }

  let {
    children,
    orientation = 'horizontal',
    class: className = '',
    ...restProps
  }: ToolbarProps = $props();

  let toolbarRef: HTMLDivElement | undefined = $state();
  let focusedIndex = $state(0);

  // Provide reactive context to child components
  setToolbarContext(() => orientation);

  function getButtons(): HTMLButtonElement[] {
    if (!toolbarRef) return [];
    return Array.from(toolbarRef.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
  }

  // Track DOM mutations to detect slot content changes
  let mutationCount = $state(0);

  $effect(() => {
    if (!toolbarRef) return;

    const observer = new MutationObserver(() => {
      mutationCount++;
    });

    observer.observe(toolbarRef, { childList: true, subtree: true });

    return () => observer.disconnect();
  });

  // Roving tabindex: only the focused button should have tabIndex=0
  $effect(() => {
    // Dependencies: focusedIndex and mutationCount (for slot content changes)
    void mutationCount;

    const buttons = getButtons();
    if (buttons.length === 0) return;

    // Clamp focusedIndex to valid range
    if (focusedIndex >= buttons.length) {
      focusedIndex = buttons.length - 1;
      return; // Will re-run with corrected index
    }

    buttons.forEach((btn, index) => {
      btn.tabIndex = index === focusedIndex ? 0 : -1;
    });
  });

  function handleFocus(event: FocusEvent) {
    const buttons = getButtons();
    const targetIndex = buttons.findIndex((btn) => btn === event.target);
    if (targetIndex !== -1) {
      focusedIndex = targetIndex;
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    const buttons = getButtons();
    if (buttons.length === 0) return;

    const currentIndex = buttons.findIndex((btn) => btn === document.activeElement);
    if (currentIndex === -1) return;

    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const invalidKeys =
      orientation === 'vertical' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];

    // Ignore invalid direction keys
    if (invalidKeys.includes(event.key)) {
      return;
    }

    let newIndex = currentIndex;
    let shouldPreventDefault = false;

    switch (event.key) {
      case nextKey:
        // No wrap - stop at end
        if (currentIndex < buttons.length - 1) {
          newIndex = currentIndex + 1;
        }
        shouldPreventDefault = true;
        break;

      case prevKey:
        // No wrap - stop at start
        if (currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        shouldPreventDefault = true;
        break;

      case 'Home':
        newIndex = 0;
        shouldPreventDefault = true;
        break;

      case 'End':
        newIndex = buttons.length - 1;
        shouldPreventDefault = true;
        break;
    }

    if (shouldPreventDefault) {
      event.preventDefault();
      if (newIndex !== currentIndex) {
        buttons[newIndex].focus();
        focusedIndex = newIndex;
      }
    }
  }
</script>

<div
  bind:this={toolbarRef}
  role="toolbar"
  aria-orientation={orientation}
  class="apg-toolbar {className}"
  {...restProps}
  onfocusin={handleFocus}
  onkeydown={handleKeyDown}
>
  {#if children}
    {@render children()}
  {/if}
</div>
