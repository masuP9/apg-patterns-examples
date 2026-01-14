<script lang="ts">
  import Tooltip from './Tooltip.svelte';
</script>

<div class="flex flex-wrap items-center gap-8">
  <Tooltip id="tooltip-save-ja" content="変更を保存">
    {#snippet children({ describedBy })}
      <button
        class="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        保存
      </button>
    {/snippet}
  </Tooltip>

  <Tooltip id="tooltip-right-ja" content="右側に表示されます" placement="right">
    {#snippet children({ describedBy })}
      <button
        class="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        右側ツールチップ
      </button>
    {/snippet}
  </Tooltip>

  <Tooltip id="tooltip-bottom-ja" content="下側に表示されます" placement="bottom">
    {#snippet children({ describedBy })}
      <button
        class="bg-secondary text-secondary-foreground hover:bg-secondary/90 rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        下側ツールチップ
      </button>
    {/snippet}
  </Tooltip>

  <Tooltip id="tooltip-disabled-ja" content="このツールチップは無効です" disabled={true}>
    {#snippet children({ describedBy })}
      <button
        class="bg-muted text-muted-foreground rounded-md px-4 py-2"
        aria-describedby={describedBy}
      >
        無効化されたツールチップ
      </button>
    {/snippet}
  </Tooltip>
</div>
