<script lang="ts">
  import type { Snippet } from 'svelte';
  import { getToolbarContext } from './toolbar-context.svelte';

  interface ToolbarButtonProps {
    children?: Snippet<[]>;
    disabled?: boolean;
    class?: string;
    onclick?: (event: MouseEvent) => void;
    [key: string]: unknown;
  }

  let {
    children,
    disabled = false,
    class: className = '',
    onclick,
    ...restProps
  }: ToolbarButtonProps = $props();

  // Verify we're inside a Toolbar
  const context = getToolbarContext();
  if (!context) {
    console.warn('ToolbarButton must be used within a Toolbar');
  }
</script>

<button type="button" class="apg-toolbar-button {className}" {disabled} {onclick} {...restProps}>
  {#if children}
    {@render children()}
  {/if}
</button>
