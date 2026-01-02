<script lang="ts">
  import Tooltip from '../Tooltip.svelte';
  import type { TooltipPlacement } from '../Tooltip.svelte';

  interface Props {
    content?: string;
    delay?: number;
    placement?: TooltipPlacement;
    disabled?: boolean;
    id?: string;
  }

  let {
    content = 'Tooltip',
    delay = 300,
    placement = 'top',
    disabled = false,
    id = 'test-tooltip',
  }: Props = $props();
</script>

<Tooltip {content} {delay} {placement} {disabled} {id}>
  {#snippet children({ describedBy })}
    <button type="button" aria-describedby={describedBy}>Hover me</button>
  {/snippet}
</Tooltip>
