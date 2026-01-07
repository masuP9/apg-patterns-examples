<script lang="ts">
  import TreeView, { type TreeNode } from './TreeView.svelte';

  interface Props {
    nodes: TreeNode[];
    ariaLabel: string;
    defaultExpandedIds?: string[];
  }

  let { nodes, ariaLabel, defaultExpandedIds = [] }: Props = $props();

  let activatedId: string | null = $state(null);

  function handleActivate(nodeId: string) {
    activatedId = nodeId;
  }

  function handleReset() {
    activatedId = null;
  }

  function findNodeLabel(nodes: TreeNode[], id: string): string | null {
    for (const { id: nodeId, label, children } of nodes) {
      if (nodeId === id) {
        return label;
      }
      if (children) {
        const found = findNodeLabel(children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  let activatedLabel = $derived(activatedId ? findNodeLabel(nodes, activatedId) : null);
</script>

<div class="flex flex-col gap-4">
  <TreeView {nodes} aria-label={ariaLabel} {defaultExpandedIds} onActivate={handleActivate} />
  <div class="flex items-center gap-3">
    <div
      role="status"
      aria-live="polite"
      class="flex-1 rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-800"
    >
      <span class="text-muted-foreground">Activated: </span>
      {#if activatedLabel}
        <span class="font-medium">{activatedLabel}</span>
      {:else}
        <span class="text-muted-foreground italic">Select a node with Enter, Space, or Click</span>
      {/if}
    </div>
    {#if activatedId}
      <button
        type="button"
        class="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        onclick={handleReset}
      >
        Reset
      </button>
    {/if}
  </div>
</div>
