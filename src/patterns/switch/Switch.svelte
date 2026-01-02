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

  let {
    children,
    initialChecked = false,
    disabled = false,
    onCheckedChange = (_) => {},
    ...restProps
  }: SwitchProps = $props();

  let checked = $state(untrack(() => initialChecked));

  function toggle() {
    if (disabled) return;
    checked = !checked;
    onCheckedChange(checked);
  }

  function handleClick() {
    toggle();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      toggle();
    }
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
