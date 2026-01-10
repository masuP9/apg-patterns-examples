<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';

  interface SwitchProps {
    children?: string | Snippet<[]>;
    initialChecked?: boolean;
    disabled?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    [key: string]: unknown;
  }

  const SWIPE_THRESHOLD = 10;

  let {
    children,
    initialChecked = false,
    disabled = false,
    onCheckedChange = (_) => {},
    ...restProps
  }: SwitchProps = $props();

  let checked = $state(untrack(() => initialChecked));
  let pointerStartX: number | null = null;
  let hasSwiped = false;

  function setCheckedState(newChecked: boolean) {
    if (newChecked !== checked) {
      checked = newChecked;
      onCheckedChange(checked);
    }
  }

  function toggle() {
    if (disabled) return;
    setCheckedState(!checked);
  }

  function handleClick() {
    if (hasSwiped) return;
    toggle();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggle();
    }
  }

  function handlePointerDown(event: PointerEvent) {
    if (disabled) return;
    pointerStartX = event.clientX;
    hasSwiped = false;
    const target = event.target as HTMLElement;
    target.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent) {
    if (disabled || pointerStartX === null) return;
    const deltaX = event.clientX - pointerStartX;
    if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
      hasSwiped = true;
      const newChecked = deltaX > 0;
      setCheckedState(newChecked);
      pointerStartX = null;
    }
  }

  function handlePointerUp(event: PointerEvent) {
    pointerStartX = null;
    const target = event.target as HTMLElement;
    target.releasePointerCapture?.(event.pointerId);
    // Reset hasSwiped after a microtask to allow click handler to check it
    queueMicrotask(() => {
      hasSwiped = false;
    });
  }
</script>

<button
  type="button"
  role="switch"
  aria-checked={checked}
  aria-disabled={disabled || undefined}
  class="apg-switch"
  {disabled}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  {...restProps}
>
  <span class="apg-switch-track">
    <span class="apg-switch-icon" aria-hidden="true">
      <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
          fill="currentColor"
        />
      </svg>
    </span>
    <span class="apg-switch-thumb"></span>
  </span>
  {#if children}
    <span class="apg-switch-label">
      {#if typeof children === 'string'}
        {children}
      {:else}
        {@render children?.()}
      {/if}
    </span>
  {/if}
</button>
