<script lang="ts">
  import { onMount, onDestroy, tick } from 'svelte';
  import { SvelteMap, SvelteSet } from 'svelte/reactivity';

  export interface TreeNode {
    id: string;
    label: string;
    children?: TreeNode[];
    disabled?: boolean;
  }

  interface TreeViewProps {
    nodes: TreeNode[];
    multiselectable?: boolean;
    defaultSelectedIds?: string[];
    selectedIds?: string[];
    defaultExpandedIds?: string[];
    expandedIds?: string[];
    ariaLabel?: string;
    ariaLabelledby?: string;
    typeAheadTimeout?: number;
    onSelectionChange?: (selectedIds: string[]) => void;
    onExpandedChange?: (expandedIds: string[]) => void;
    onActivate?: (nodeId: string) => void;
    class?: string;
  }

  interface FlatNode {
    node: TreeNode;
    depth: number;
    parentId: string | null;
    hasChildren: boolean;
  }

  let {
    nodes = [],
    multiselectable = false,
    defaultSelectedIds = [],
    selectedIds: controlledSelectedIds = undefined,
    defaultExpandedIds = [],
    expandedIds: controlledExpandedIds = undefined,
    ariaLabel = undefined,
    ariaLabelledby = undefined,
    typeAheadTimeout = 500,
    onSelectionChange = () => {},
    onExpandedChange = () => {},
    onActivate = () => {},
    class: className = '',
  }: TreeViewProps = $props();

  let instanceId = $state('');
  let nodeRefs = new SvelteMap<string, HTMLLIElement>();
  let typeAheadBuffer = $state('');
  let typeAheadTimeoutId: number | null = null;
  let selectionAnchor = $state('');
  let focusedIdRef = $state('');

  // Internal state - using SvelteSet for fine-grained reactivity via mutations
  let internalExpandedIds = new SvelteSet<string>();
  let internalSelectedIds = new SvelteSet<string>();

  // Helper function to sync SvelteSet with new values (using mutation for reactivity)
  function syncSvelteSet<T>(target: SvelteSet<T>, source: Iterable<T>) {
    target.clear();
    for (const item of source) {
      target.add(item);
    }
  }
  let focusedId = $state('');

  onMount(() => {
    instanceId = `treeview-${Math.random().toString(36).slice(2, 11)}`;
  });

  // Cleanup type-ahead timeout on destroy
  onDestroy(() => {
    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
    }
  });

  // Flatten tree for navigation
  function flattenTree(
    treeNodes: TreeNode[],
    depth: number = 0,
    parentId: string | null = null
  ): FlatNode[] {
    const result: FlatNode[] = [];
    for (const node of treeNodes) {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      result.push({ node, depth, parentId, hasChildren });
      if (node.children) {
        result.push(...flattenTree(node.children, depth + 1, node.id));
      }
    }
    return result;
  }

  let allNodes = $derived(flattenTree(nodes));

  let nodeMap = $derived.by(() => {
    const map = new SvelteMap<string, FlatNode>();
    for (const flatNode of allNodes) {
      map.set(flatNode.node.id, flatNode);
    }
    return map;
  });

  // Expansion state (controlled or uncontrolled)
  let expandedIds = $derived(
    controlledExpandedIds ? new SvelteSet(controlledExpandedIds) : internalExpandedIds
  );

  // Selection state (controlled or uncontrolled)
  let selectedIds = $derived(
    controlledSelectedIds ? new SvelteSet(controlledSelectedIds) : internalSelectedIds
  );

  // Visible nodes (respecting expansion state)
  let visibleNodes = $derived.by(() => {
    const result: FlatNode[] = [];
    const collapsedParents = new SvelteSet<string>();

    for (const flatNode of allNodes) {
      let isHidden = false;
      let currentParentId = flatNode.parentId;

      while (currentParentId) {
        if (collapsedParents.has(currentParentId) || !expandedIds.has(currentParentId)) {
          isHidden = true;
          break;
        }
        const parent = nodeMap.get(currentParentId);
        currentParentId = parent?.parentId ?? null;
      }

      if (!isHidden) {
        result.push(flatNode);
        if (flatNode.hasChildren && !expandedIds.has(flatNode.node.id)) {
          collapsedParents.add(flatNode.node.id);
        }
      }
    }
    return result;
  });

  let visibleIndexMap = $derived.by(() => {
    const map = new SvelteMap<string, number>();
    visibleNodes.forEach((flatNode, index) => map.set(flatNode.node.id, index));
    return map;
  });

  let containerClass = $derived(`apg-treeview ${className}`.trim());

  // Initialize state
  $effect(() => {
    if (allNodes.length > 0 && internalSelectedIds.size === 0 && internalExpandedIds.size === 0) {
      // Initialize expansion
      syncSvelteSet(internalExpandedIds, defaultExpandedIds);

      // Initialize selection (filter out disabled nodes)
      if (defaultSelectedIds.length > 0) {
        const validIds = defaultSelectedIds.filter((id) => {
          const flatNode = nodeMap.get(id);
          return flatNode && !flatNode.node.disabled;
        });
        if (validIds.length > 0) {
          syncSvelteSet(internalSelectedIds, validIds);
        }
      }
      // No auto-selection - user must explicitly select via Enter/Space/Click

      // Initialize focus
      const firstSelected = [...selectedIds][0];
      if (firstSelected) {
        const flatNode = nodeMap.get(firstSelected);
        if (flatNode && !flatNode.node.disabled) {
          focusedId = firstSelected;
          focusedIdRef = firstSelected;
          selectionAnchor = firstSelected;
          return;
        }
      }
      const firstEnabled = allNodes.find((fn) => !fn.node.disabled);
      if (firstEnabled) {
        focusedId = firstEnabled.node.id;
        focusedIdRef = firstEnabled.node.id;
        selectionAnchor = firstEnabled.node.id;
      }
    }
  });

  // Reactive guard: ensure focusedId and selectionAnchor remain valid when visibility changes
  $effect(() => {
    // Skip during initialization
    if (!focusedId) return;

    // Check if focusedId is still visible
    if (!visibleIndexMap.has(focusedId)) {
      // Find first visible non-disabled node
      const firstEnabled = visibleNodes.find((fn) => !fn.node.disabled);
      if (firstEnabled) {
        focusedId = firstEnabled.node.id;
        focusedIdRef = firstEnabled.node.id;
        selectionAnchor = firstEnabled.node.id;
        // Focus moves but selection does not change automatically
      }
    }

    // Check if selectionAnchor is still valid
    if (selectionAnchor && !visibleIndexMap.has(selectionAnchor)) {
      selectionAnchor = focusedId;
    }
  });

  // Action to track node element references
  function trackNodeRef(node: HTMLLIElement, nodeId: string) {
    nodeRefs.set(nodeId, node);
    return {
      destroy() {
        nodeRefs.delete(nodeId);
      },
    };
  }

  function updateExpandedIds(newExpandedIds: Set<string>) {
    if (!controlledExpandedIds) {
      syncSvelteSet(internalExpandedIds, newExpandedIds);
    }
    onExpandedChange([...newExpandedIds]);
  }

  function updateSelectedIds(newSelectedIds: Set<string>) {
    if (!controlledSelectedIds) {
      syncSvelteSet(internalSelectedIds, newSelectedIds);
    }
    onSelectionChange([...newSelectedIds]);
  }

  function setFocusedId(nodeId: string) {
    focusedIdRef = nodeId;
    focusedId = nodeId;
  }

  async function applyDomFocus(nodeId: string) {
    await tick();
    nodeRefs.get(nodeId)?.focus();
  }

  function focusNode(nodeId: string) {
    setFocusedId(nodeId);
    applyDomFocus(nodeId);
  }

  function focusByIndex(index: number) {
    const flatNode = visibleNodes[index];
    if (flatNode) {
      focusNode(flatNode.node.id);
    }
  }

  // Expansion helpers
  function expandNode(nodeId: string) {
    const flatNode = nodeMap.get(nodeId);
    if (!flatNode?.hasChildren || flatNode.node.disabled) return;
    if (expandedIds.has(nodeId)) return;

    const newExpanded = new SvelteSet(expandedIds);
    newExpanded.add(nodeId);
    updateExpandedIds(newExpanded);
  }

  function collapseNode(nodeId: string) {
    const flatNode = nodeMap.get(nodeId);
    if (!flatNode?.hasChildren || flatNode.node.disabled) return;
    if (!expandedIds.has(nodeId)) return;

    const newExpanded = new SvelteSet(expandedIds);
    newExpanded.delete(nodeId);
    updateExpandedIds(newExpanded);

    // If a child of this node was focused, move focus to the collapsed parent
    const currentFocused = nodeMap.get(focusedId);
    if (currentFocused) {
      let parentId = currentFocused.parentId;
      while (parentId) {
        if (parentId === nodeId) {
          focusNode(nodeId);
          break;
        }
        const parent = nodeMap.get(parentId);
        parentId = parent?.parentId ?? null;
      }
    }
  }

  function expandAllSiblings(nodeId: string) {
    const flatNode = nodeMap.get(nodeId);
    if (!flatNode) return;

    const newExpanded = new SvelteSet(expandedIds);
    for (const fn of allNodes) {
      if (fn.parentId === flatNode.parentId && fn.hasChildren && !fn.node.disabled) {
        newExpanded.add(fn.node.id);
      }
    }
    updateExpandedIds(newExpanded);
  }

  // Selection helpers
  function selectNode(nodeId: string) {
    const flatNode = nodeMap.get(nodeId);
    if (flatNode?.node.disabled) return;

    if (multiselectable) {
      const newSelected = new SvelteSet(selectedIds);
      if (newSelected.has(nodeId)) {
        newSelected.delete(nodeId);
      } else {
        newSelected.add(nodeId);
      }
      updateSelectedIds(newSelected);
    } else {
      updateSelectedIds(new SvelteSet([nodeId]));
    }
  }

  function selectRange(fromId: string, toId: string) {
    const fromIndex = visibleIndexMap.get(fromId) ?? 0;
    const toIndex = visibleIndexMap.get(toId) ?? 0;
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);

    const newSelected = new SvelteSet(selectedIds);
    for (let i = start; i <= end; i++) {
      const flatNode = visibleNodes[i];
      if (flatNode && !flatNode.node.disabled) {
        newSelected.add(flatNode.node.id);
      }
    }
    updateSelectedIds(newSelected);
  }

  function selectAllVisible() {
    const newSelected = new SvelteSet<string>();
    for (const flatNode of visibleNodes) {
      if (!flatNode.node.disabled) {
        newSelected.add(flatNode.node.id);
      }
    }
    updateSelectedIds(newSelected);
  }

  // Type-ahead
  function handleTypeAhead(char: string) {
    if (visibleNodes.length === 0) return;

    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
    }

    typeAheadBuffer += char.toLowerCase();
    const buffer = typeAheadBuffer;

    const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

    const currentIndex = visibleIndexMap.get(focusedId) ?? 0;
    let startIndex: number;
    let searchStr: string;

    if (isSameChar) {
      typeAheadBuffer = buffer[0];
      startIndex = (currentIndex + 1) % visibleNodes.length;
      searchStr = buffer[0];
    } else if (buffer.length === 1) {
      startIndex = (currentIndex + 1) % visibleNodes.length;
      searchStr = buffer;
    } else {
      startIndex = currentIndex;
      searchStr = buffer;
    }

    for (let i = 0; i < visibleNodes.length; i++) {
      const index = (startIndex + i) % visibleNodes.length;
      const flatNode = visibleNodes[index];
      // Skip disabled nodes in type-ahead
      if (flatNode.node.disabled) continue;
      if (flatNode.node.label.toLowerCase().startsWith(searchStr)) {
        focusNode(flatNode.node.id);
        // Update anchor in multiselect mode
        if (multiselectable) {
          selectionAnchor = flatNode.node.id;
        }
        // Type-ahead only moves focus, does not change selection
        break;
      }
    }

    typeAheadTimeoutId = window.setTimeout(() => {
      typeAheadBuffer = '';
      typeAheadTimeoutId = null;
    }, typeAheadTimeout);
  }

  function handleNodeClick(nodeId: string) {
    const flatNode = nodeMap.get(nodeId);
    if (!flatNode || flatNode.node.disabled) return;

    focusNode(nodeId);

    // Toggle expansion for parent nodes
    if (flatNode.hasChildren) {
      if (expandedIds.has(nodeId)) {
        collapseNode(nodeId);
      } else {
        expandNode(nodeId);
      }
    }

    // Select and activate
    if (multiselectable) {
      selectNode(nodeId);
      selectionAnchor = nodeId;
    } else {
      updateSelectedIds(new SvelteSet([nodeId]));
    }
    onActivate(nodeId);
  }

  function handleNodeFocus(nodeId: string) {
    focusedIdRef = nodeId;
    focusedId = nodeId;
  }

  // Determine if key should be handled
  function shouldHandleKey(key: string, ctrlKey: boolean, metaKey: boolean): boolean {
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
    if (key.length === 1 && !ctrlKey && !metaKey) return true;
    if ((key === 'a' || key === 'A') && (ctrlKey || metaKey) && multiselectable) return true;
    return false;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (visibleNodes.length === 0) return;

    const { key, shiftKey, ctrlKey, metaKey } = event;

    // Call preventDefault synchronously for all handled keys
    if (shouldHandleKey(key, ctrlKey, metaKey)) {
      event.preventDefault();
    }

    const actualFocusedId = focusedIdRef;
    const currentIndex = visibleIndexMap.get(actualFocusedId) ?? 0;
    const currentFlatNode = visibleNodes[currentIndex];

    switch (key) {
      case 'ArrowDown': {
        if (currentIndex < visibleNodes.length - 1) {
          const nextIndex = currentIndex + 1;
          focusByIndex(nextIndex);
          const nextNode = visibleNodes[nextIndex];
          if (multiselectable && shiftKey) {
            selectRange(selectionAnchor, nextNode.node.id);
          } else if (multiselectable) {
            selectionAnchor = nextNode.node.id;
          }
          // Single-select: focus moves but selection does not change
        }
        break;
      }

      case 'ArrowUp': {
        if (currentIndex > 0) {
          const prevIndex = currentIndex - 1;
          focusByIndex(prevIndex);
          const prevNode = visibleNodes[prevIndex];
          if (multiselectable && shiftKey) {
            selectRange(selectionAnchor, prevNode.node.id);
          } else if (multiselectable) {
            selectionAnchor = prevNode.node.id;
          }
          // Single-select: focus moves but selection does not change
        }
        break;
      }

      case 'ArrowRight': {
        if (!currentFlatNode) break;

        if (currentFlatNode.hasChildren && !currentFlatNode.node.disabled) {
          if (!expandedIds.has(actualFocusedId)) {
            expandNode(actualFocusedId);
          } else {
            const nextIndex = currentIndex + 1;
            if (nextIndex < visibleNodes.length) {
              const nextNode = visibleNodes[nextIndex];
              if (nextNode.parentId === actualFocusedId) {
                focusByIndex(nextIndex);
                // Update anchor on lateral navigation in multiselect
                if (multiselectable) {
                  selectionAnchor = nextNode.node.id;
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
          expandedIds.has(actualFocusedId) &&
          !currentFlatNode.node.disabled
        ) {
          collapseNode(actualFocusedId);
        } else if (currentFlatNode.parentId) {
          focusNode(currentFlatNode.parentId);
          // Update anchor on lateral navigation in multiselect
          if (multiselectable) {
            selectionAnchor = currentFlatNode.parentId;
          }
          // Single-select: focus moves but selection does not change
        }
        break;
      }

      case 'Home': {
        focusByIndex(0);
        const firstNode = visibleNodes[0];
        if (multiselectable && shiftKey) {
          selectRange(selectionAnchor, firstNode.node.id);
        } else if (multiselectable) {
          selectionAnchor = firstNode.node.id;
        }
        // Single-select: focus moves but selection does not change
        break;
      }

      case 'End': {
        const lastIndex = visibleNodes.length - 1;
        focusByIndex(lastIndex);
        const lastNode = visibleNodes[lastIndex];
        if (multiselectable && shiftKey) {
          selectRange(selectionAnchor, lastNode.node.id);
        } else if (multiselectable) {
          selectionAnchor = lastNode.node.id;
        }
        // Single-select: focus moves but selection does not change
        break;
      }

      case 'Enter': {
        if (currentFlatNode && !currentFlatNode.node.disabled) {
          // Select the node (single-select replaces, multi-select behavior via selectNode)
          if (multiselectable) {
            selectNode(actualFocusedId);
            selectionAnchor = actualFocusedId;
          } else {
            updateSelectedIds(new SvelteSet([actualFocusedId]));
          }
          // Fire activation callback
          onActivate(actualFocusedId);
        }
        break;
      }

      case ' ': {
        if (currentFlatNode && !currentFlatNode.node.disabled) {
          if (multiselectable) {
            selectNode(actualFocusedId);
            // Ctrl+Space: toggle without updating anchor
            // Space alone: update anchor for subsequent Shift+Arrow operations
            if (!ctrlKey) {
              selectionAnchor = actualFocusedId;
            }
          } else {
            // Single-select: Space selects and activates (same as Enter)
            updateSelectedIds(new SvelteSet([actualFocusedId]));
            onActivate(actualFocusedId);
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
        if ((ctrlKey || metaKey) && multiselectable) {
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
  }

  function getNodeClass(node: TreeNode, hasChildren: boolean): string {
    const classes = ['apg-treeview-item'];
    if (selectedIds.has(node.id)) {
      classes.push('apg-treeview-item--selected');
    }
    if (node.disabled) {
      classes.push('apg-treeview-item--disabled');
    }
    if (hasChildren) {
      classes.push('apg-treeview-item--parent');
    } else {
      classes.push('apg-treeview-item--leaf');
    }
    return classes.join(' ');
  }
</script>

{#snippet renderNode(node: TreeNode, depth: number)}
  {@const hasChildren = Boolean(node.children && node.children.length > 0)}
  {@const isExpanded = expandedIds.has(node.id)}
  {@const isSelected = selectedIds.has(node.id)}
  {@const isFocused = focusedId === node.id}
  {@const labelId = `${instanceId}-label-${node.id}`}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <li
    use:trackNodeRef={node.id}
    role="treeitem"
    aria-labelledby={labelId}
    aria-expanded={hasChildren ? isExpanded : undefined}
    aria-selected={isSelected}
    aria-disabled={node.disabled || undefined}
    tabindex={isFocused ? 0 : -1}
    class={getNodeClass(node, hasChildren)}
    style="--depth: {depth}"
    onclick={(e) => {
      e.stopPropagation();
      handleNodeClick(node.id);
    }}
    onfocus={(e) => {
      if (e.target === e.currentTarget) {
        handleNodeFocus(node.id);
      }
    }}
  >
    <span class="apg-treeview-item-content">
      {#if hasChildren}
        <span class="apg-treeview-item-icon" aria-hidden="true">
          {isExpanded ? '\u25BC' : '\u25B6'}
        </span>
      {/if}
      <span id={labelId} class="apg-treeview-item-label">
        {node.label}
      </span>
    </span>
    {#if hasChildren && isExpanded && node.children}
      <ul role="group" class="apg-treeview-group">
        {#each node.children as child (child.id)}
          {@render renderNode(child, depth + 1)}
        {/each}
      </ul>
    {/if}
  </li>
{/snippet}

<ul
  role="tree"
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  aria-multiselectable={multiselectable || undefined}
  class={containerClass}
  onkeydown={handleKeyDown}
>
  {#each nodes as node (node.id)}
    {@render renderNode(node, 0)}
  {/each}
</ul>
