<template>
  <li
    :ref="(el) => emit('setRef', node.id, el as HTMLLIElement | null)"
    role="treeitem"
    :aria-labelledby="labelId"
    :aria-expanded="hasChildren ? isExpanded : undefined"
    :aria-selected="isSelected"
    :aria-disabled="node.disabled || undefined"
    :tabindex="isFocused ? 0 : -1"
    :class="nodeClass"
    :style="{ '--depth': depth }"
    @click.stop="handleClick"
    @focus="handleFocus"
  >
    <span class="apg-treeview-item-content">
      <span v-if="hasChildren" class="apg-treeview-item-icon" aria-hidden="true">
        {{ isExpanded ? '\u25BC' : '\u25B6' }}
      </span>
      <span :id="labelId" class="apg-treeview-item-label">
        {{ node.label }}
      </span>
    </span>
    <ul v-if="hasChildren && isExpanded && node.children" role="group" class="apg-treeview-group">
      <TreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :depth="depth + 1"
        :instance-id="instanceId"
        :expanded-ids="expandedIds"
        :selected-ids="selectedIds"
        :focused-id="focusedId"
        :visible-index-map="visibleIndexMap"
        @node-click="(id: string) => emit('nodeClick', id)"
        @node-focus="(id: string) => emit('nodeFocus', id)"
        @set-ref="(id: string, el: HTMLLIElement | null) => emit('setRef', id, el)"
      />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { TreeNodeData } from './TreeView.vue';

interface TreeNodeProps {
  node: TreeNodeData;
  depth: number;
  instanceId: string;
  expandedIds: Set<string>;
  selectedIds: Set<string>;
  focusedId: string;
  visibleIndexMap: Map<string, number>;
}

const props = defineProps<TreeNodeProps>();

const emit = defineEmits<{
  nodeClick: [nodeId: string];
  nodeFocus: [nodeId: string];
  setRef: [id: string, el: HTMLLIElement | null];
}>();

const hasChildren = computed(() => Boolean(props.node.children && props.node.children.length > 0));
const isExpanded = computed(() => props.expandedIds.has(props.node.id));
const isSelected = computed(() => props.selectedIds.has(props.node.id));
const isFocused = computed(() => props.focusedId === props.node.id);

const labelId = computed(() => `${props.instanceId}-label-${props.node.id}`);

const nodeClass = computed(() => {
  const classes = ['apg-treeview-item'];
  if (isSelected.value) {
    classes.push('apg-treeview-item--selected');
  }
  if (props.node.disabled) {
    classes.push('apg-treeview-item--disabled');
  }
  if (hasChildren.value) {
    classes.push('apg-treeview-item--parent');
  } else {
    classes.push('apg-treeview-item--leaf');
  }
  return classes.join(' ');
});

const handleClick = () => {
  emit('nodeClick', props.node.id);
};

const handleFocus = (e: FocusEvent) => {
  // Only handle focus if this element is the actual target (not bubbled from child)
  if (e.target === e.currentTarget) {
    emit('nodeFocus', props.node.id);
  }
};
</script>
