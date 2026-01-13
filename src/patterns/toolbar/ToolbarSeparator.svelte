<script lang="ts">
  import { getToolbarContext } from './toolbar-context.svelte';

  interface ToolbarSeparatorProps {
    class?: string;
  }

  let { class: className = '' }: ToolbarSeparatorProps = $props();

  // Verify we're inside a Toolbar
  const context = getToolbarContext();
  if (!context) {
    console.warn('ToolbarSeparator must be used within a Toolbar');
  }

  // Separator orientation is perpendicular to toolbar orientation
  let separatorOrientation = $derived(
    context?.orientation === 'horizontal' ? 'vertical' : 'horizontal'
  );
</script>

<div
  role="separator"
  aria-orientation={separatorOrientation}
  class="apg-toolbar-separator {className}"
></div>
