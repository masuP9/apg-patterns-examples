<script lang="ts">
  import Tooltip from './Tooltip.svelte';
</script>

<div class="flex flex-wrap items-center gap-8">
  <Tooltip id="tooltip-save" content="Save your changes">
    {#snippet children({ describedBy })}
      <button
        class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        Save
      </button>
    {/snippet}
  </Tooltip>

  <Tooltip id="tooltip-right" content="This appears on the right" placement="right">
    {#snippet children({ describedBy })}
      <button
        class="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        Right tooltip
      </button>
    {/snippet}
  </Tooltip>

  <Tooltip id="tooltip-bottom" content="This appears below" placement="bottom">
    {#snippet children({ describedBy })}
      <button
        class="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        Bottom tooltip
      </button>
    {/snippet}
  </Tooltip>

  <Tooltip id="tooltip-disabled" content="This tooltip is disabled" disabled={true}>
    {#snippet children({ describedBy })}
      <button
        class="bg-muted text-muted-foreground rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        Disabled tooltip
      </button>
    {/snippet}
  </Tooltip>
</div>
