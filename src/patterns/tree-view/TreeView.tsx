import { useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';

export interface TreeNode {
  /** Unique identifier for the node */
  id: string;
  /** Display label for the node */
  label: string;
  /** Child nodes (makes this a parent node) */
  children?: TreeNode[];
  /** When true, the node cannot be selected, activated, or expanded */
  disabled?: boolean;
}

export interface TreeViewProps {
  /** Array of tree nodes */
  nodes: TreeNode[];
  /** Enable multi-select mode */
  multiselectable?: boolean;
  /** Initially selected node ID(s) - uncontrolled */
  defaultSelectedIds?: string[];
  /** Currently selected node ID(s) - controlled */
  selectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Initially expanded node IDs - uncontrolled */
  defaultExpandedIds?: string[];
  /** Currently expanded node IDs - controlled */
  expandedIds?: string[];
  /** Callback when expansion changes */
  onExpandedChange?: (expandedIds: string[]) => void;
  /** Callback when node is activated (Enter key) */
  onActivate?: (nodeId: string) => void;
  /** Type-ahead search timeout in ms */
  typeAheadTimeout?: number;
  /** Accessible label */
  'aria-label'?: string;
  /** ID of labeling element */
  'aria-labelledby'?: string;
  /** Additional CSS class */
  className?: string;
}

interface FlatNode {
  node: TreeNode;
  depth: number;
  parentId: string | null;
  hasChildren: boolean;
}

export function TreeView({
  nodes,
  multiselectable = false,
  defaultSelectedIds = [],
  selectedIds: controlledSelectedIds,
  onSelectionChange,
  defaultExpandedIds = [],
  expandedIds: controlledExpandedIds,
  onExpandedChange,
  onActivate,
  typeAheadTimeout = 500,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className = '',
}: TreeViewProps): React.ReactElement {
  const instanceId = useId();

  // Flatten tree for easier navigation
  const flattenTree = useCallback(
    (treeNodes: TreeNode[], depth: number = 0, parentId: string | null = null): FlatNode[] => {
      const result: FlatNode[] = [];
      for (const node of treeNodes) {
        const hasChildren = Boolean(node.children && node.children.length > 0);
        result.push({ node, depth, parentId, hasChildren });
        if (node.children) {
          result.push(...flattenTree(node.children, depth + 1, node.id));
        }
      }
      return result;
    },
    []
  );

  const allNodes = useMemo(() => flattenTree(nodes), [nodes, flattenTree]);
  const nodeMap = useMemo(() => {
    const map = new Map<string, FlatNode>();
    for (const flatNode of allNodes) {
      map.set(flatNode.node.id, flatNode);
    }
    return map;
  }, [allNodes]);

  // Expansion state
  const [internalExpandedIds, setInternalExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds)
  );
  const expandedIds = controlledExpandedIds ? new Set(controlledExpandedIds) : internalExpandedIds;

  const updateExpandedIds = useCallback(
    (newExpandedIds: Set<string>) => {
      if (!controlledExpandedIds) {
        setInternalExpandedIds(newExpandedIds);
      }
      onExpandedChange?.([...newExpandedIds]);
    },
    [controlledExpandedIds, onExpandedChange]
  );

  // Selection state
  const getInitialSelectedIds = useCallback(() => {
    // Filter out disabled nodes from default selection
    if (defaultSelectedIds.length > 0) {
      const validIds = defaultSelectedIds.filter((id) => {
        const flatNode = nodeMap.get(id);
        return flatNode && !flatNode.node.disabled;
      });
      if (validIds.length > 0) {
        return new Set(validIds);
      }
    }
    // No auto-selection - user must explicitly select via Enter/Space/Click
    return new Set<string>();
  }, [defaultSelectedIds, nodeMap]);

  const [internalSelectedIds, setInternalSelectedIds] =
    useState<Set<string>>(getInitialSelectedIds);
  const selectedIds = controlledSelectedIds ? new Set(controlledSelectedIds) : internalSelectedIds;

  const updateSelectedIds = useCallback(
    (newSelectedIds: Set<string>) => {
      if (!controlledSelectedIds) {
        setInternalSelectedIds(newSelectedIds);
      }
      onSelectionChange?.([...newSelectedIds]);
    },
    [controlledSelectedIds, onSelectionChange]
  );

  // Focus state - find first valid node (prefer selected, then first non-disabled)
  const [focusedId, setFocusedId] = useState<string>(() => {
    const firstSelected = [...selectedIds][0];
    if (firstSelected) {
      const flatNode = nodeMap.get(firstSelected);
      if (flatNode && !flatNode.node.disabled) {
        return firstSelected;
      }
    }
    // Fall back to first non-disabled node
    const firstEnabled = allNodes.find((fn) => !fn.node.disabled);
    return firstEnabled?.node.id ?? '';
  });

  const nodeRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const typeAheadBuffer = useRef<string>('');
  const typeAheadTimeoutId = useRef<number | null>(null);
  const selectionAnchor = useRef<string>(focusedId);
  // Ref to track focused node synchronously (avoids stale closure issues)
  const focusedIdRef = useRef<string>(focusedId);

  // Get visible nodes (respecting expansion state)
  const visibleNodes = useMemo(() => {
    const result: FlatNode[] = [];
    const collapsedParents = new Set<string>();

    for (const flatNode of allNodes) {
      // Check if any ancestor is collapsed
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
  }, [allNodes, expandedIds, nodeMap]);

  const visibleIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    visibleNodes.forEach((flatNode, index) => map.set(flatNode.node.id, index));
    return map;
  }, [visibleNodes]);

  // Ref to track the target node to focus (set before state update)
  const pendingFocusRef = useRef<string | null>(null);

  // Focus helpers
  const focusNode = useCallback((nodeId: string) => {
    focusedIdRef.current = nodeId;
    pendingFocusRef.current = nodeId;
    setFocusedId(nodeId);
  }, []);

  // Apply focus after render
  useLayoutEffect(() => {
    if (pendingFocusRef.current !== null) {
      const targetId = pendingFocusRef.current;
      pendingFocusRef.current = null;
      nodeRefs.current.get(targetId)?.focus();
    }
  });

  const focusByIndex = useCallback(
    (index: number) => {
      const flatNode = visibleNodes[index];
      if (flatNode) {
        focusNode(flatNode.node.id);
      }
    },
    [visibleNodes, focusNode]
  );

  // Expansion helpers
  const expandNode = useCallback(
    (nodeId: string) => {
      const flatNode = nodeMap.get(nodeId);
      if (!flatNode?.hasChildren || flatNode.node.disabled) return;
      if (expandedIds.has(nodeId)) return;

      const newExpanded = new Set(expandedIds);
      newExpanded.add(nodeId);
      updateExpandedIds(newExpanded);
    },
    [nodeMap, expandedIds, updateExpandedIds]
  );

  const collapseNode = useCallback(
    (nodeId: string) => {
      const flatNode = nodeMap.get(nodeId);
      if (!flatNode?.hasChildren || flatNode.node.disabled) return;
      if (!expandedIds.has(nodeId)) return;

      const newExpanded = new Set(expandedIds);
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
    },
    [nodeMap, expandedIds, updateExpandedIds, focusedId, focusNode]
  );

  const expandAllSiblings = useCallback(
    (nodeId: string) => {
      const flatNode = nodeMap.get(nodeId);
      if (!flatNode) return;

      const newExpanded = new Set(expandedIds);
      for (const fn of allNodes) {
        if (fn.parentId === flatNode.parentId && fn.hasChildren && !fn.node.disabled) {
          newExpanded.add(fn.node.id);
        }
      }
      updateExpandedIds(newExpanded);
    },
    [nodeMap, allNodes, expandedIds, updateExpandedIds]
  );

  // Selection helpers
  const selectNode = useCallback(
    (nodeId: string) => {
      const flatNode = nodeMap.get(nodeId);
      if (flatNode?.node.disabled) return;

      if (multiselectable) {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(nodeId)) {
          newSelected.delete(nodeId);
        } else {
          newSelected.add(nodeId);
        }
        updateSelectedIds(newSelected);
      } else {
        updateSelectedIds(new Set([nodeId]));
      }
    },
    [nodeMap, multiselectable, selectedIds, updateSelectedIds]
  );

  const selectRange = useCallback(
    (fromId: string, toId: string) => {
      const fromIndex = visibleIndexMap.get(fromId) ?? 0;
      const toIndex = visibleIndexMap.get(toId) ?? 0;
      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);

      const newSelected = new Set(selectedIds);
      for (let i = start; i <= end; i++) {
        const flatNode = visibleNodes[i];
        if (flatNode && !flatNode.node.disabled) {
          newSelected.add(flatNode.node.id);
        }
      }
      updateSelectedIds(newSelected);
    },
    [visibleIndexMap, visibleNodes, selectedIds, updateSelectedIds]
  );

  const selectAllVisible = useCallback(() => {
    const newSelected = new Set<string>();
    for (const flatNode of visibleNodes) {
      if (!flatNode.node.disabled) {
        newSelected.add(flatNode.node.id);
      }
    }
    updateSelectedIds(newSelected);
  }, [visibleNodes, updateSelectedIds]);

  // Type-ahead
  const handleTypeAhead = useCallback(
    (char: string) => {
      if (visibleNodes.length === 0) return;

      if (typeAheadTimeoutId.current !== null) {
        clearTimeout(typeAheadTimeoutId.current);
      }

      typeAheadBuffer.current += char.toLowerCase();
      const buffer = typeAheadBuffer.current;

      // Check if same character repeated
      const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

      const currentIndex = visibleIndexMap.get(focusedId) ?? 0;
      let startIndex: number;
      let searchStr: string;

      if (isSameChar) {
        // Same character repeated: cycle through matches starting from next
        typeAheadBuffer.current = buffer[0];
        startIndex = (currentIndex + 1) % visibleNodes.length;
        searchStr = buffer[0];
      } else if (buffer.length === 1) {
        // Single character: start from next to cycle through matches
        startIndex = (currentIndex + 1) % visibleNodes.length;
        searchStr = buffer;
      } else {
        // Multiple different characters: start from current to allow prefix matching
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
            selectionAnchor.current = flatNode.node.id;
          }
          // Type-ahead only moves focus, does not change selection
          break;
        }
      }

      typeAheadTimeoutId.current = window.setTimeout(() => {
        typeAheadBuffer.current = '';
        typeAheadTimeoutId.current = null;
      }, typeAheadTimeout);
    },
    [visibleNodes, visibleIndexMap, focusedId, focusNode, multiselectable, typeAheadTimeout]
  );

  // Keyboard handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (visibleNodes.length === 0) return;

      const { key, shiftKey, ctrlKey, metaKey } = event;

      // Use ref for current focused node (updated synchronously, avoids stale closure)
      const actualFocusedId = focusedIdRef.current;
      const currentIndex = visibleIndexMap.get(actualFocusedId) ?? 0;
      const currentFlatNode = visibleNodes[currentIndex];

      let shouldPreventDefault = false;

      switch (key) {
        case 'ArrowDown': {
          shouldPreventDefault = true;
          if (currentIndex < visibleNodes.length - 1) {
            const nextIndex = currentIndex + 1;
            focusByIndex(nextIndex);
            const nextNode = visibleNodes[nextIndex];
            if (multiselectable && shiftKey) {
              selectRange(selectionAnchor.current, nextNode.node.id);
            } else if (multiselectable) {
              selectionAnchor.current = nextNode.node.id;
            }
            // Single-select: focus moves but selection does not change
          }
          break;
        }

        case 'ArrowUp': {
          shouldPreventDefault = true;
          if (currentIndex > 0) {
            const prevIndex = currentIndex - 1;
            focusByIndex(prevIndex);
            const prevNode = visibleNodes[prevIndex];
            if (multiselectable && shiftKey) {
              selectRange(selectionAnchor.current, prevNode.node.id);
            } else if (multiselectable) {
              selectionAnchor.current = prevNode.node.id;
            }
            // Single-select: focus moves but selection does not change
          }
          break;
        }

        case 'ArrowRight': {
          shouldPreventDefault = true;
          if (!currentFlatNode) break;

          if (currentFlatNode.hasChildren && !currentFlatNode.node.disabled) {
            if (!expandedIds.has(actualFocusedId)) {
              // Expand closed parent
              expandNode(actualFocusedId);
            } else {
              // Move to first child
              const nextIndex = currentIndex + 1;
              if (nextIndex < visibleNodes.length) {
                const nextNode = visibleNodes[nextIndex];
                if (nextNode.parentId === actualFocusedId) {
                  focusByIndex(nextIndex);
                  // Update anchor on lateral navigation in multiselect
                  if (multiselectable) {
                    selectionAnchor.current = nextNode.node.id;
                  }
                  // Single-select: focus moves but selection does not change
                }
              }
            }
          }
          // Leaf node: do nothing
          break;
        }

        case 'ArrowLeft': {
          shouldPreventDefault = true;
          if (!currentFlatNode) break;

          if (
            currentFlatNode.hasChildren &&
            expandedIds.has(actualFocusedId) &&
            !currentFlatNode.node.disabled
          ) {
            // Collapse open parent
            collapseNode(actualFocusedId);
          } else if (currentFlatNode.parentId) {
            // Move to parent
            focusNode(currentFlatNode.parentId);
            // Update anchor on lateral navigation in multiselect
            if (multiselectable) {
              selectionAnchor.current = currentFlatNode.parentId;
            }
            // Single-select: focus moves but selection does not change
          }
          // Root with no expansion: do nothing
          break;
        }

        case 'Home': {
          shouldPreventDefault = true;
          focusByIndex(0);
          const firstNode = visibleNodes[0];
          if (multiselectable && shiftKey) {
            selectRange(selectionAnchor.current, firstNode.node.id);
          } else if (multiselectable) {
            selectionAnchor.current = firstNode.node.id;
          }
          // Single-select: focus moves but selection does not change
          break;
        }

        case 'End': {
          shouldPreventDefault = true;
          const lastIndex = visibleNodes.length - 1;
          focusByIndex(lastIndex);
          const lastNode = visibleNodes[lastIndex];
          if (multiselectable && shiftKey) {
            selectRange(selectionAnchor.current, lastNode.node.id);
          } else if (multiselectable) {
            selectionAnchor.current = lastNode.node.id;
          }
          // Single-select: focus moves but selection does not change
          break;
        }

        case 'Enter': {
          shouldPreventDefault = true;
          if (currentFlatNode && !currentFlatNode.node.disabled) {
            // Select the node (single-select replaces, multi-select behavior via selectNode)
            if (multiselectable) {
              selectNode(actualFocusedId);
              selectionAnchor.current = actualFocusedId;
            } else {
              updateSelectedIds(new Set([actualFocusedId]));
            }
            // Fire activation callback
            onActivate?.(actualFocusedId);
          }
          break;
        }

        case ' ': {
          shouldPreventDefault = true;
          if (currentFlatNode && !currentFlatNode.node.disabled) {
            if (multiselectable) {
              selectNode(actualFocusedId);
              // Ctrl+Space: toggle without updating anchor
              // Space alone: update anchor for subsequent Shift+Arrow operations
              if (!ctrlKey) {
                selectionAnchor.current = actualFocusedId;
              }
            } else {
              // Single-select: Space selects and activates (same as Enter)
              updateSelectedIds(new Set([actualFocusedId]));
              onActivate?.(actualFocusedId);
            }
          }
          break;
        }

        case '*': {
          shouldPreventDefault = true;
          expandAllSiblings(actualFocusedId);
          break;
        }

        case 'a':
        case 'A': {
          if ((ctrlKey || metaKey) && multiselectable) {
            shouldPreventDefault = true;
            selectAllVisible();
          } else {
            handleTypeAhead(key);
          }
          break;
        }

        default: {
          // Type-ahead for printable characters
          if (key.length === 1 && !ctrlKey && !metaKey) {
            shouldPreventDefault = true;
            handleTypeAhead(key);
          }
        }
      }

      if (shouldPreventDefault) {
        event.preventDefault();
      }
    },
    [
      visibleNodes,
      visibleIndexMap,
      focusedId,
      focusByIndex,
      focusNode,
      expandedIds,
      expandNode,
      collapseNode,
      expandAllSiblings,
      multiselectable,
      selectNode,
      selectRange,
      selectAllVisible,
      updateSelectedIds,
      nodeMap,
      onActivate,
      handleTypeAhead,
    ]
  );

  // Click handler
  const handleNodeClick = useCallback(
    (nodeId: string) => {
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
        selectionAnchor.current = nodeId;
      } else {
        updateSelectedIds(new Set([nodeId]));
      }
      onActivate?.(nodeId);
    },
    [
      nodeMap,
      focusNode,
      expandedIds,
      collapseNode,
      expandNode,
      multiselectable,
      selectNode,
      updateSelectedIds,
      onActivate,
    ]
  );

  // Render a node and its children recursively
  const renderNode = useCallback(
    (node: TreeNode, depth: number = 0): React.ReactNode => {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      const isExpanded = expandedIds.has(node.id);
      const isSelected = selectedIds.has(node.id);
      const isFocused = focusedId === node.id;
      const visibleIndex = visibleIndexMap.get(node.id);
      const isVisible = visibleIndex !== undefined;

      if (!isVisible && depth > 0) {
        return null;
      }

      const nodeClass = `apg-treeview-item ${isSelected ? 'apg-treeview-item--selected' : ''
        } ${node.disabled ? 'apg-treeview-item--disabled' : ''} ${hasChildren ? 'apg-treeview-item--parent' : 'apg-treeview-item--leaf'
        }`.trim();

      const labelId = `${instanceId}-label-${node.id}`;

      return (
        // treegrid keyboard events managed at tree level
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
          key={node.id}
          ref={(el) => {
            if (el) {
              nodeRefs.current.set(node.id, el);
            } else {
              nodeRefs.current.delete(node.id);
            }
          }}
          role="treeitem"
          aria-labelledby={labelId}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-selected={isSelected}
          aria-disabled={node.disabled || undefined}
          tabIndex={isFocused ? 0 : -1}
          className={nodeClass}
          style={{ '--depth': depth }}
          onClick={(e) => {
            e.stopPropagation();
            handleNodeClick(node.id);
          }}
          onFocus={(e) => {
            // Only handle focus if this element is the actual target (not bubbled from child)
            if (e.target === e.currentTarget) {
              focusedIdRef.current = node.id;
              setFocusedId(node.id);
            }
          }}
        >
          <span className="apg-treeview-item-content">
            {hasChildren && (
              <span className="apg-treeview-item-icon" aria-hidden="true">
                {isExpanded ? '▼' : '▶'}
              </span>
            )}
            <span id={labelId} className="apg-treeview-item-label">
              {node.label}
            </span>
          </span>
          {hasChildren && isExpanded && node.children && (
            <ul role="group" className="apg-treeview-group">
              {node.children.map((child) => renderNode(child, depth + 1))}
            </ul>
          )}
        </li>
      );
    },
    [expandedIds, selectedIds, focusedId, visibleIndexMap, handleNodeClick, instanceId]
  );

  const containerClass = `apg-treeview ${className}`.trim();

  return (
    <ul
      role="tree"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-multiselectable={multiselectable || undefined}
      className={containerClass}
      onKeyDown={handleKeyDown}
    >
      {nodes.map((node) => renderNode(node, 0))}
    </ul>
  );
}

export default TreeView;
