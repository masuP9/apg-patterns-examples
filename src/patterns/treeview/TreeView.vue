<template>
  <ul
    role="tree"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-multiselectable="multiselectable || undefined"
    :class="containerClass"
    @keydown="handleKeyDown"
  >
    <TreeNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      :depth="0"
      :instance-id="instanceId"
      :expanded-ids="expandedIds"
      :selected-ids="selectedIds"
      :focused-id="focusedId"
      :visible-index-map="visibleIndexMap"
      @node-click="handleNodeClick"
      @node-focus="handleNodeFocus"
      @set-ref="setNodeRef"
    />
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import TreeNode from './TreeNode.vue';

export interface TreeNodeData {
  id: string;
  label: string;
  children?: TreeNodeData[];
  disabled?: boolean;
}

export interface TreeViewProps {
  nodes: TreeNodeData[];
  multiselectable?: boolean;
  defaultSelectedIds?: string[];
  selectedIds?: string[];
  defaultExpandedIds?: string[];
  expandedIds?: string[];
  ariaLabel?: string;
  ariaLabelledby?: string;
  typeAheadTimeout?: number;
  className?: string;
}

interface FlatNode {
  node: TreeNodeData;
  depth: number;
  parentId: string | null;
  hasChildren: boolean;
}

const props = withDefaults(defineProps<TreeViewProps>(), {
  multiselectable: false,
  defaultSelectedIds: () => [],
  defaultExpandedIds: () => [],
  typeAheadTimeout: 500,
  className: '',
});

const emit = defineEmits<{
  selectionChange: [selectedIds: string[]];
  expandedChange: [expandedIds: string[]];
  activate: [nodeId: string];
}>();

const instanceId = ref('');
const nodeRefs = ref<Record<string, HTMLLIElement>>({});
const typeAheadBuffer = ref('');
const typeAheadTimeoutId = ref<number | null>(null);
const selectionAnchor = ref('');
const focusedIdRef = ref('');

// Internal state
const internalExpandedIds = ref<Set<string>>(new Set());
const internalSelectedIds = ref<Set<string>>(new Set());
const focusedId = ref('');

// Flatten tree for navigation
const flattenTree = (
  treeNodes: TreeNodeData[],
  depth: number = 0,
  parentId: string | null = null
): FlatNode[] => {
  const result: FlatNode[] = [];
  for (const node of treeNodes) {
    const hasChildren = Boolean(node.children && node.children.length > 0);
    result.push({ node, depth, parentId, hasChildren });
    if (node.children) {
      result.push(...flattenTree(node.children, depth + 1, node.id));
    }
  }
  return result;
};

const allNodes = computed(() => flattenTree(props.nodes));

const nodeMap = computed(() => {
  const map = new Map<string, FlatNode>();
  for (const flatNode of allNodes.value) {
    map.set(flatNode.node.id, flatNode);
  }
  return map;
});

// Expansion state (controlled or uncontrolled)
const expandedIds = computed(() => {
  if (props.expandedIds) {
    return new Set(props.expandedIds);
  }
  return internalExpandedIds.value;
});

// Selection state (controlled or uncontrolled)
const selectedIds = computed(() => {
  if (props.selectedIds) {
    return new Set(props.selectedIds);
  }
  return internalSelectedIds.value;
});

// Visible nodes (respecting expansion state)
const visibleNodes = computed(() => {
  const result: FlatNode[] = [];
  const collapsedParents = new Set<string>();

  for (const flatNode of allNodes.value) {
    let isHidden = false;
    let currentParentId = flatNode.parentId;

    while (currentParentId) {
      if (collapsedParents.has(currentParentId) || !expandedIds.value.has(currentParentId)) {
        isHidden = true;
        break;
      }
      const parent = nodeMap.value.get(currentParentId);
      currentParentId = parent?.parentId ?? null;
    }

    if (!isHidden) {
      result.push(flatNode);
      if (flatNode.hasChildren && !expandedIds.value.has(flatNode.node.id)) {
        collapsedParents.add(flatNode.node.id);
      }
    }
  }
  return result;
});

const visibleIndexMap = computed(() => {
  const map = new Map<string, number>();
  visibleNodes.value.forEach((flatNode, index) => map.set(flatNode.node.id, index));
  return map;
});

const containerClass = computed(() => `apg-treeview ${props.className}`.trim());

// Initialize on mount
onMounted(() => {
  instanceId.value = `treeview-${Math.random().toString(36).slice(2, 11)}`;

  // Initialize expansion
  internalExpandedIds.value = new Set(props.defaultExpandedIds);

  // Initialize selection (filter out disabled nodes)
  if (props.defaultSelectedIds.length > 0) {
    const validIds = props.defaultSelectedIds.filter((id) => {
      const flatNode = nodeMap.value.get(id);
      return flatNode && !flatNode.node.disabled;
    });
    if (validIds.length > 0) {
      internalSelectedIds.value = new Set(validIds);
    }
  }
  // No auto-selection - user must explicitly select via Enter/Space/Click

  // Initialize focus
  const firstSelected = [...selectedIds.value][0];
  if (firstSelected) {
    const flatNode = nodeMap.value.get(firstSelected);
    if (flatNode && !flatNode.node.disabled) {
      focusedId.value = firstSelected;
      focusedIdRef.value = firstSelected;
      selectionAnchor.value = firstSelected;
      return;
    }
  }
  const firstEnabled = allNodes.value.find((fn) => !fn.node.disabled);
  if (firstEnabled) {
    focusedId.value = firstEnabled.node.id;
    focusedIdRef.value = firstEnabled.node.id;
    selectionAnchor.value = firstEnabled.node.id;
  }
});

const setNodeRef = (id: string, el: HTMLLIElement | null) => {
  if (el) {
    nodeRefs.value[id] = el;
  } else {
    delete nodeRefs.value[id];
  }
};

const updateExpandedIds = (newExpandedIds: Set<string>) => {
  if (!props.expandedIds) {
    internalExpandedIds.value = newExpandedIds;
  }
  emit('expandedChange', [...newExpandedIds]);
};

const updateSelectedIds = (newSelectedIds: Set<string>) => {
  if (!props.selectedIds) {
    internalSelectedIds.value = newSelectedIds;
  }
  emit('selectionChange', [...newSelectedIds]);
};

// Synchronous focus state update (for roving tabindex)
const setFocusedId = (nodeId: string) => {
  focusedIdRef.value = nodeId;
  focusedId.value = nodeId;
};

// Deferred DOM focus (after Vue re-render)
const applyDomFocus = async (nodeId: string) => {
  await nextTick();
  nodeRefs.value[nodeId]?.focus();
};

const focusNode = (nodeId: string) => {
  setFocusedId(nodeId);
  applyDomFocus(nodeId);
};

const focusByIndex = (index: number) => {
  const flatNode = visibleNodes.value[index];
  if (flatNode) {
    focusNode(flatNode.node.id);
  }
};

// Expansion helpers
const expandNode = (nodeId: string) => {
  const flatNode = nodeMap.value.get(nodeId);
  if (!flatNode?.hasChildren || flatNode.node.disabled) return;
  if (expandedIds.value.has(nodeId)) return;

  const newExpanded = new Set(expandedIds.value);
  newExpanded.add(nodeId);
  updateExpandedIds(newExpanded);
};

const collapseNode = (nodeId: string) => {
  const flatNode = nodeMap.value.get(nodeId);
  if (!flatNode?.hasChildren || flatNode.node.disabled) return;
  if (!expandedIds.value.has(nodeId)) return;

  const newExpanded = new Set(expandedIds.value);
  newExpanded.delete(nodeId);
  updateExpandedIds(newExpanded);

  // If a child of this node was focused, move focus to the collapsed parent
  const currentFocused = nodeMap.value.get(focusedId.value);
  if (currentFocused) {
    let parentId = currentFocused.parentId;
    while (parentId) {
      if (parentId === nodeId) {
        focusNode(nodeId);
        break;
      }
      const parent = nodeMap.value.get(parentId);
      parentId = parent?.parentId ?? null;
    }
  }
};

const expandAllSiblings = (nodeId: string) => {
  const flatNode = nodeMap.value.get(nodeId);
  if (!flatNode) return;

  const newExpanded = new Set(expandedIds.value);
  for (const fn of allNodes.value) {
    if (fn.parentId === flatNode.parentId && fn.hasChildren && !fn.node.disabled) {
      newExpanded.add(fn.node.id);
    }
  }
  updateExpandedIds(newExpanded);
};

// Selection helpers
const selectNode = (nodeId: string) => {
  const flatNode = nodeMap.value.get(nodeId);
  if (flatNode?.node.disabled) return;

  if (props.multiselectable) {
    const newSelected = new Set(selectedIds.value);
    if (newSelected.has(nodeId)) {
      newSelected.delete(nodeId);
    } else {
      newSelected.add(nodeId);
    }
    updateSelectedIds(newSelected);
  } else {
    updateSelectedIds(new Set([nodeId]));
  }
};

const selectRange = (fromId: string, toId: string) => {
  const fromIndex = visibleIndexMap.value.get(fromId) ?? 0;
  const toIndex = visibleIndexMap.value.get(toId) ?? 0;
  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);

  const newSelected = new Set(selectedIds.value);
  for (let i = start; i <= end; i++) {
    const flatNode = visibleNodes.value[i];
    if (flatNode && !flatNode.node.disabled) {
      newSelected.add(flatNode.node.id);
    }
  }
  updateSelectedIds(newSelected);
};

const selectAllVisible = () => {
  const newSelected = new Set<string>();
  for (const flatNode of visibleNodes.value) {
    if (!flatNode.node.disabled) {
      newSelected.add(flatNode.node.id);
    }
  }
  updateSelectedIds(newSelected);
};

// Type-ahead
const handleTypeAhead = (char: string) => {
  if (visibleNodes.value.length === 0) return;

  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
  }

  typeAheadBuffer.value += char.toLowerCase();
  const buffer = typeAheadBuffer.value;

  const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

  const currentIndex = visibleIndexMap.value.get(focusedId.value) ?? 0;
  let startIndex: number;
  let searchStr: string;

  if (isSameChar) {
    typeAheadBuffer.value = buffer[0];
    startIndex = (currentIndex + 1) % visibleNodes.value.length;
    searchStr = buffer[0];
  } else if (buffer.length === 1) {
    startIndex = (currentIndex + 1) % visibleNodes.value.length;
    searchStr = buffer;
  } else {
    startIndex = currentIndex;
    searchStr = buffer;
  }

  for (let i = 0; i < visibleNodes.value.length; i++) {
    const index = (startIndex + i) % visibleNodes.value.length;
    const flatNode = visibleNodes.value[index];
    // Skip disabled nodes in type-ahead
    if (flatNode.node.disabled) continue;
    if (flatNode.node.label.toLowerCase().startsWith(searchStr)) {
      focusNode(flatNode.node.id);
      // Update anchor in multiselect mode
      if (props.multiselectable) {
        selectionAnchor.value = flatNode.node.id;
      }
      // Type-ahead only moves focus, does not change selection
      break;
    }
  }

  typeAheadTimeoutId.value = window.setTimeout(() => {
    typeAheadBuffer.value = '';
    typeAheadTimeoutId.value = null;
  }, props.typeAheadTimeout);
};

const handleNodeClick = (nodeId: string) => {
  const flatNode = nodeMap.value.get(nodeId);
  if (!flatNode || flatNode.node.disabled) return;

  focusNode(nodeId);

  // Toggle expansion for parent nodes
  if (flatNode.hasChildren) {
    if (expandedIds.value.has(nodeId)) {
      collapseNode(nodeId);
    } else {
      expandNode(nodeId);
    }
  }

  // Select and activate
  if (props.multiselectable) {
    selectNode(nodeId);
    selectionAnchor.value = nodeId;
  } else {
    updateSelectedIds(new Set([nodeId]));
  }
  emit('activate', nodeId);
};

const handleNodeFocus = (nodeId: string) => {
  focusedIdRef.value = nodeId;
  focusedId.value = nodeId;
};

// Determine if key should be handled and call preventDefault synchronously
const shouldHandleKey = (key: string, ctrlKey: boolean, metaKey: boolean): boolean => {
  const handledKeys = [
    'ArrowDown',
    'ArrowUp',
    'ArrowRight',
    'ArrowLeft',
    'Home',
    'End',
    'Enter',
    ' ',
    '*',
  ];
  if (handledKeys.includes(key)) return true;
  // Type-ahead: single printable character without ctrl/meta
  if (key.length === 1 && !ctrlKey && !metaKey) return true;
  // Ctrl+A in multiselect
  if ((key === 'a' || key === 'A') && (ctrlKey || metaKey) && props.multiselectable) return true;
  return false;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (visibleNodes.value.length === 0) return;

  const { key, shiftKey, ctrlKey, metaKey } = event;

  // Call preventDefault synchronously for all handled keys
  if (shouldHandleKey(key, ctrlKey, metaKey)) {
    event.preventDefault();
  }

  const actualFocusedId = focusedIdRef.value;
  const currentIndex = visibleIndexMap.value.get(actualFocusedId) ?? 0;
  const currentFlatNode = visibleNodes.value[currentIndex];

  switch (key) {
    case 'ArrowDown': {
      if (currentIndex < visibleNodes.value.length - 1) {
        const nextIndex = currentIndex + 1;
        focusByIndex(nextIndex);
        const nextNode = visibleNodes.value[nextIndex];
        if (props.multiselectable && shiftKey) {
          selectRange(selectionAnchor.value, nextNode.node.id);
        } else if (props.multiselectable) {
          selectionAnchor.value = nextNode.node.id;
        }
        // Single-select: focus moves but selection does not change
      }
      break;
    }

    case 'ArrowUp': {
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        focusByIndex(prevIndex);
        const prevNode = visibleNodes.value[prevIndex];
        if (props.multiselectable && shiftKey) {
          selectRange(selectionAnchor.value, prevNode.node.id);
        } else if (props.multiselectable) {
          selectionAnchor.value = prevNode.node.id;
        }
        // Single-select: focus moves but selection does not change
      }
      break;
    }

    case 'ArrowRight': {
      if (!currentFlatNode) break;

      if (currentFlatNode.hasChildren && !currentFlatNode.node.disabled) {
        if (!expandedIds.value.has(actualFocusedId)) {
          expandNode(actualFocusedId);
        } else {
          const nextIndex = currentIndex + 1;
          if (nextIndex < visibleNodes.value.length) {
            const nextNode = visibleNodes.value[nextIndex];
            if (nextNode.parentId === actualFocusedId) {
              focusByIndex(nextIndex);
              // Update anchor on lateral navigation in multiselect
              if (props.multiselectable) {
                selectionAnchor.value = nextNode.node.id;
              }
              // Single-select: focus moves but selection does not change
            }
          }
        }
      }
      break;
    }

    case 'ArrowLeft': {
      if (!currentFlatNode) break;

      if (
        currentFlatNode.hasChildren &&
        expandedIds.value.has(actualFocusedId) &&
        !currentFlatNode.node.disabled
      ) {
        collapseNode(actualFocusedId);
      } else if (currentFlatNode.parentId) {
        focusNode(currentFlatNode.parentId);
        // Update anchor on lateral navigation in multiselect
        if (props.multiselectable) {
          selectionAnchor.value = currentFlatNode.parentId;
        }
        // Single-select: focus moves but selection does not change
      }
      break;
    }

    case 'Home': {
      focusByIndex(0);
      const firstNode = visibleNodes.value[0];
      if (props.multiselectable && shiftKey) {
        selectRange(selectionAnchor.value, firstNode.node.id);
      } else if (props.multiselectable) {
        selectionAnchor.value = firstNode.node.id;
      }
      // Single-select: focus moves but selection does not change
      break;
    }

    case 'End': {
      const lastIndex = visibleNodes.value.length - 1;
      focusByIndex(lastIndex);
      const lastNode = visibleNodes.value[lastIndex];
      if (props.multiselectable && shiftKey) {
        selectRange(selectionAnchor.value, lastNode.node.id);
      } else if (props.multiselectable) {
        selectionAnchor.value = lastNode.node.id;
      }
      // Single-select: focus moves but selection does not change
      break;
    }

    case 'Enter': {
      if (currentFlatNode && !currentFlatNode.node.disabled) {
        // Select the node (single-select replaces, multi-select behavior via selectNode)
        if (props.multiselectable) {
          selectNode(actualFocusedId);
          selectionAnchor.value = actualFocusedId;
        } else {
          updateSelectedIds(new Set([actualFocusedId]));
        }
        // Fire activation callback
        emit('activate', actualFocusedId);
      }
      break;
    }

    case ' ': {
      if (currentFlatNode && !currentFlatNode.node.disabled) {
        if (props.multiselectable) {
          selectNode(actualFocusedId);
          // Ctrl+Space: toggle without updating anchor
          // Space alone: update anchor for subsequent Shift+Arrow operations
          if (!ctrlKey) {
            selectionAnchor.value = actualFocusedId;
          }
        } else {
          // Single-select: Space selects and activates (same as Enter)
          updateSelectedIds(new Set([actualFocusedId]));
          emit('activate', actualFocusedId);
        }
      }
      break;
    }

    case '*': {
      expandAllSiblings(actualFocusedId);
      break;
    }

    case 'a':
    case 'A': {
      if ((ctrlKey || metaKey) && props.multiselectable) {
        selectAllVisible();
      } else if (!ctrlKey && !metaKey) {
        handleTypeAhead(key);
      }
      break;
    }

    default: {
      if (key.length === 1 && !ctrlKey && !metaKey) {
        handleTypeAhead(key);
      }
    }
  }
};
</script>
