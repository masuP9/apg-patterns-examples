<script setup lang="ts">
import { ref, computed, toRefs } from 'vue';
import TreeView, { type TreeNode } from './TreeView.vue';

interface Props {
  nodes: TreeNode[];
  ariaLabel: string;
  defaultExpandedIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  defaultExpandedIds: () => [],
});

const { nodes, ariaLabel, defaultExpandedIds } = toRefs(props);

const activatedId = ref<string | null>(null);

function handleActivate(id: string) {
  activatedId.value = id;
}

function handleReset() {
  activatedId.value = null;
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

const activatedLabel = computed(() => {
  const { value: currentId } = activatedId;
  if (!currentId) {
    return null;
  }
  return findNodeLabel(nodes.value, currentId);
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <TreeView
      :nodes="nodes"
      :aria-label="ariaLabel"
      :default-expanded-ids="defaultExpandedIds"
      @activate="handleActivate"
    />
    <div class="flex items-center gap-3">
      <div
        role="status"
        aria-live="polite"
        class="flex-1 rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-800"
      >
        <span class="text-muted-foreground">Activated: </span>
        <span v-if="activatedLabel" class="font-medium">{{ activatedLabel }}</span>
        <span v-else class="text-muted-foreground italic"
          >Select a node with Enter, Space, or Click</span
        >
      </div>
      <button
        v-if="activatedId"
        type="button"
        class="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="handleReset"
      >
        Reset
      </button>
    </div>
  </div>
</template>
