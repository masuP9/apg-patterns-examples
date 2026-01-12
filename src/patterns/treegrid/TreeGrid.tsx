import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// =============================================================================
// Types
// =============================================================================

export interface TreeGridCellData {
  id: string;
  value: string | number;
  disabled?: boolean;
  colspan?: number;
}

export interface TreeGridNodeData {
  id: string;
  cells: TreeGridCellData[];
  children?: TreeGridNodeData[];
  disabled?: boolean;
}

export interface TreeGridColumnDef {
  id: string;
  header: string;
  isRowHeader?: boolean;
}

export interface TreeGridProps {
  columns: TreeGridColumnDef[];
  nodes: TreeGridNodeData[];

  // Accessible name (one required)
  ariaLabel?: string;
  ariaLabelledby?: string;

  // Expansion
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;

  // Selection (row-based)
  selectable?: boolean;
  multiselectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectionChange?: (rowIds: string[]) => void;

  // Focus
  focusedCellId?: string | null;
  defaultFocusedCellId?: string;
  onFocusChange?: (cellId: string | null) => void;

  // Virtualization
  totalRows?: number;
  totalColumns?: number;
  startRowIndex?: number;
  startColIndex?: number;

  // Behavior
  enablePageNavigation?: boolean;
  pageSize?: number;

  // Callbacks
  onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
  onRowActivate?: (rowId: string) => void;

  // Styling
  className?: string;
}

// Flattened node for easier navigation
interface FlatRow {
  node: TreeGridNodeData;
  level: number;
  parentId: string | null;
  hasChildren: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function TreeGrid({
  columns,
  nodes,
  ariaLabel,
  ariaLabelledby,
  expandedIds: controlledExpandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  selectable = false,
  multiselectable = false,
  selectedRowIds: controlledSelectedRowIds,
  defaultSelectedRowIds = [],
  onSelectionChange,
  focusedCellId: controlledFocusedCellId,
  defaultFocusedCellId,
  onFocusChange,
  totalRows,
  totalColumns,
  startRowIndex = 1,
  startColIndex = 1,
  enablePageNavigation = false,
  pageSize = 5,
  onCellActivate,
  onRowActivate,
  className,
}: TreeGridProps) {
  // ==========================================================================
  // State
  // ==========================================================================

  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>(defaultExpandedIds);
  const expandedIds = controlledExpandedIds ?? internalExpandedIds;
  const expandedSet = useMemo(() => new Set(expandedIds), [expandedIds]);

  const [internalSelectedRowIds, setInternalSelectedRowIds] =
    useState<string[]>(defaultSelectedRowIds);
  const selectedRowIds = controlledSelectedRowIds ?? internalSelectedRowIds;
  const selectedRowSet = useMemo(() => new Set(selectedRowIds), [selectedRowIds]);

  const [internalFocusedCellId, setInternalFocusedCellId] = useState<string | null>(() => {
    if (defaultFocusedCellId) return defaultFocusedCellId;
    // Default to first cell of first node
    return nodes[0]?.cells[0]?.id ?? null;
  });
  const focusedCellId =
    controlledFocusedCellId !== undefined ? controlledFocusedCellId : internalFocusedCellId;

  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ==========================================================================
  // Computed values - Flatten tree
  // ==========================================================================

  const flattenTree = useCallback(
    (
      treeNodes: TreeGridNodeData[],
      level: number = 1,
      parentId: string | null = null
    ): FlatRow[] => {
      const result: FlatRow[] = [];
      for (const node of treeNodes) {
        const hasChildren = Boolean(node.children && node.children.length > 0);
        result.push({ node, level, parentId, hasChildren });
        if (node.children) {
          result.push(...flattenTree(node.children, level + 1, node.id));
        }
      }
      return result;
    },
    []
  );

  const allRows = useMemo(() => flattenTree(nodes), [nodes, flattenTree]);

  const rowMap = useMemo(() => {
    const map = new Map<string, FlatRow>();
    for (const flatRow of allRows) {
      map.set(flatRow.node.id, flatRow);
    }
    return map;
  }, [allRows]);

  // Visible rows based on expansion state
  const visibleRows = useMemo(() => {
    const result: FlatRow[] = [];
    const collapsedParents = new Set<string>();

    for (const flatRow of allRows) {
      // Check if any ancestor is collapsed
      let isHidden = false;
      let currentParentId = flatRow.parentId;
      while (currentParentId) {
        if (collapsedParents.has(currentParentId) || !expandedSet.has(currentParentId)) {
          isHidden = true;
          break;
        }
        const parent = rowMap.get(currentParentId);
        currentParentId = parent?.parentId ?? null;
      }

      if (!isHidden) {
        result.push(flatRow);
        if (flatRow.hasChildren && !expandedSet.has(flatRow.node.id)) {
          collapsedParents.add(flatRow.node.id);
        }
      }
    }
    return result;
  }, [allRows, expandedSet, rowMap]);

  const visibleRowIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    visibleRows.forEach((flatRow, index) => map.set(flatRow.node.id, index));
    return map;
  }, [visibleRows]);

  // Cell lookup
  const cellById = useMemo(() => {
    const map = new Map<
      string,
      { rowId: string; colIndex: number; cell: TreeGridCellData; flatRow: FlatRow }
    >();
    for (const flatRow of allRows) {
      flatRow.node.cells.forEach((cell, colIndex) => {
        map.set(cell.id, { rowId: flatRow.node.id, colIndex, cell, flatRow });
      });
    }
    return map;
  }, [allRows]);

  // ==========================================================================
  // Helpers
  // ==========================================================================

  const getRowHeaderColumnIndex = useCallback(() => {
    return columns.findIndex((col) => col.isRowHeader);
  }, [columns]);

  const isAtRowHeader = useCallback(
    (cellId: string) => {
      const entry = cellById.get(cellId);
      if (!entry) return false;
      const rowHeaderColIndex = getRowHeaderColumnIndex();
      return entry.colIndex === rowHeaderColIndex;
    },
    [cellById, getRowHeaderColumnIndex]
  );

  // ==========================================================================
  // Focus Management
  // ==========================================================================

  const setFocusedCellId = useCallback(
    (id: string | null) => {
      setInternalFocusedCellId(id);
      onFocusChange?.(id);
    },
    [onFocusChange]
  );

  const focusCell = useCallback(
    (cellId: string) => {
      const cellEl = cellRefs.current.get(cellId);
      if (cellEl) {
        cellEl.focus();
        setFocusedCellId(cellId);
      }
    },
    [setFocusedCellId]
  );

  // ==========================================================================
  // Expansion Management
  // ==========================================================================

  const setExpandedIds = useCallback(
    (ids: string[]) => {
      setInternalExpandedIds(ids);
      onExpandedChange?.(ids);
    },
    [onExpandedChange]
  );

  const expandNode = useCallback(
    (rowId: string) => {
      const flatRow = rowMap.get(rowId);
      if (!flatRow?.hasChildren || flatRow.node.disabled) return;
      if (expandedSet.has(rowId)) return;

      const newExpanded = [...expandedIds, rowId];
      setExpandedIds(newExpanded);
    },
    [rowMap, expandedSet, expandedIds, setExpandedIds]
  );

  const collapseNode = useCallback(
    (rowId: string) => {
      const flatRow = rowMap.get(rowId);
      if (!flatRow?.hasChildren || flatRow.node.disabled) return;
      if (!expandedSet.has(rowId)) return;

      const newExpanded = expandedIds.filter((id) => id !== rowId);
      setExpandedIds(newExpanded);

      // If focus is on a descendant, move focus to the collapsed row
      if (focusedCellId) {
        const focusedEntry = cellById.get(focusedCellId);
        if (focusedEntry) {
          let parentId = focusedEntry.flatRow.parentId;
          while (parentId) {
            if (parentId === rowId) {
              // Focus the rowheader of the collapsed row
              const rowHeaderColIndex = getRowHeaderColumnIndex();
              const collapsedRowCell = flatRow.node.cells[rowHeaderColIndex];
              if (collapsedRowCell) {
                focusCell(collapsedRowCell.id);
              }
              break;
            }
            const parent = rowMap.get(parentId);
            parentId = parent?.parentId ?? null;
          }
        }
      }
    },
    [
      rowMap,
      expandedSet,
      expandedIds,
      setExpandedIds,
      focusedCellId,
      cellById,
      getRowHeaderColumnIndex,
      focusCell,
    ]
  );

  // ==========================================================================
  // Selection Management
  // ==========================================================================

  const setSelectedRowIds = useCallback(
    (ids: string[]) => {
      setInternalSelectedRowIds(ids);
      onSelectionChange?.(ids);
    },
    [onSelectionChange]
  );

  const toggleRowSelection = useCallback(
    (rowId: string) => {
      const flatRow = rowMap.get(rowId);
      if (!selectable || flatRow?.node.disabled) return;

      if (multiselectable) {
        const newIds = selectedRowSet.has(rowId)
          ? selectedRowIds.filter((id) => id !== rowId)
          : [...selectedRowIds, rowId];
        setSelectedRowIds(newIds);
      } else {
        const newIds = selectedRowSet.has(rowId) ? [] : [rowId];
        setSelectedRowIds(newIds);
      }
    },
    [rowMap, selectable, multiselectable, selectedRowSet, selectedRowIds, setSelectedRowIds]
  );

  const selectAllVisibleRows = useCallback(() => {
    if (!selectable || !multiselectable) return;

    const allVisibleRowIds = visibleRows
      .filter((flatRow) => !flatRow.node.disabled)
      .map((flatRow) => flatRow.node.id);
    setSelectedRowIds(allVisibleRowIds);
  }, [selectable, multiselectable, visibleRows, setSelectedRowIds]);

  // ==========================================================================
  // Navigation
  // ==========================================================================

  const getVisibleRowByIndex = useCallback(
    (index: number) => {
      return visibleRows[index] ?? null;
    },
    [visibleRows]
  );

  const navigateToCell = useCallback(
    (rowId: string, colIndex: number) => {
      const flatRow = rowMap.get(rowId);
      if (!flatRow) return;

      const cell = flatRow.node.cells[colIndex];
      if (cell) {
        focusCell(cell.id);
      }
    },
    [rowMap, focusCell]
  );

  // ==========================================================================
  // Keyboard Handling
  // ==========================================================================

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, cell: TreeGridCellData, rowId: string, colIndex: number) => {
      const { key, ctrlKey } = event;
      const flatRow = rowMap.get(rowId);
      if (!flatRow) return;

      const visibleRowIndex = visibleRowIndexMap.get(rowId);
      if (visibleRowIndex === undefined) return;

      const rowHeaderColIndex = getRowHeaderColumnIndex();
      const isRowHeader = colIndex === rowHeaderColIndex;

      let handled = true;

      switch (key) {
        case 'ArrowDown': {
          const nextVisibleRow = getVisibleRowByIndex(visibleRowIndex + 1);
          if (nextVisibleRow) {
            navigateToCell(nextVisibleRow.node.id, colIndex);
          }
          break;
        }
        case 'ArrowUp': {
          if (visibleRowIndex > 0) {
            const prevVisibleRow = getVisibleRowByIndex(visibleRowIndex - 1);
            if (prevVisibleRow) {
              navigateToCell(prevVisibleRow.node.id, colIndex);
            }
          }
          break;
        }
        case 'ArrowRight': {
          if (
            isRowHeader &&
            flatRow.hasChildren &&
            !flatRow.node.disabled &&
            !expandedSet.has(rowId)
          ) {
            // Collapsed parent at rowheader: expand
            expandNode(rowId);
          } else {
            // Expanded parent at rowheader, leaf row at rowheader, or non-rowheader: move right
            if (colIndex < columns.length - 1) {
              const nextCell = flatRow.node.cells[colIndex + 1];
              if (nextCell) {
                focusCell(nextCell.id);
              }
            }
          }
          break;
        }
        case 'ArrowLeft': {
          if (isRowHeader) {
            if (flatRow.hasChildren && expandedSet.has(rowId) && !flatRow.node.disabled) {
              // Collapse expanded parent
              collapseNode(rowId);
            } else if (flatRow.parentId) {
              // Move to parent
              const parentRow = rowMap.get(flatRow.parentId);
              if (parentRow) {
                navigateToCell(parentRow.node.id, rowHeaderColIndex);
              }
            }
            // Root level collapsed: do nothing
          } else {
            // Non-rowheader: move left
            if (colIndex > 0) {
              const prevCell = flatRow.node.cells[colIndex - 1];
              if (prevCell) {
                focusCell(prevCell.id);
              }
            }
          }
          break;
        }
        case 'Home': {
          if (ctrlKey) {
            // Ctrl+Home: First cell in grid
            const firstRow = visibleRows[0];
            if (firstRow) {
              navigateToCell(firstRow.node.id, 0);
            }
          } else {
            // Home: First cell in current row
            const firstCell = flatRow.node.cells[0];
            if (firstCell) {
              focusCell(firstCell.id);
            }
          }
          break;
        }
        case 'End': {
          if (ctrlKey) {
            // Ctrl+End: Last cell in grid
            const lastRow = visibleRows[visibleRows.length - 1];
            if (lastRow) {
              navigateToCell(lastRow.node.id, columns.length - 1);
            }
          } else {
            // End: Last cell in current row
            const lastCell = flatRow.node.cells[flatRow.node.cells.length - 1];
            if (lastCell) {
              focusCell(lastCell.id);
            }
          }
          break;
        }
        case 'PageDown': {
          if (enablePageNavigation) {
            const targetIndex = Math.min(visibleRowIndex + pageSize, visibleRows.length - 1);
            const targetRow = visibleRows[targetIndex];
            if (targetRow) {
              navigateToCell(targetRow.node.id, colIndex);
            }
          } else {
            handled = false;
          }
          break;
        }
        case 'PageUp': {
          if (enablePageNavigation) {
            const targetIndex = Math.max(visibleRowIndex - pageSize, 0);
            const targetRow = visibleRows[targetIndex];
            if (targetRow) {
              navigateToCell(targetRow.node.id, colIndex);
            }
          } else {
            handled = false;
          }
          break;
        }
        case ' ': {
          toggleRowSelection(rowId);
          break;
        }
        case 'Enter': {
          if (!cell.disabled && !flatRow.node.disabled) {
            const colId = columns[colIndex]?.id ?? '';
            onCellActivate?.(cell.id, rowId, colId);
            onRowActivate?.(rowId);
          }
          break;
        }
        case 'a': {
          if (ctrlKey) {
            selectAllVisibleRows();
          } else {
            handled = false;
          }
          break;
        }
        default:
          handled = false;
      }

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
    [
      rowMap,
      visibleRowIndexMap,
      getRowHeaderColumnIndex,
      getVisibleRowByIndex,
      navigateToCell,
      expandedSet,
      expandNode,
      collapseNode,
      columns,
      focusCell,
      visibleRows,
      enablePageNavigation,
      pageSize,
      toggleRowSelection,
      onCellActivate,
      onRowActivate,
      selectAllVisibleRows,
    ]
  );

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Focus the focused cell when focusedCellId changes externally
  useEffect(() => {
    if (focusedCellId) {
      const cellEl = cellRefs.current.get(focusedCellId);
      if (cellEl && document.activeElement !== cellEl) {
        if (gridRef.current?.contains(document.activeElement)) {
          cellEl.focus();
        }
      }
    }
  }, [focusedCellId]);

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div
      ref={gridRef}
      role="treegrid"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-multiselectable={multiselectable ? 'true' : undefined}
      aria-rowcount={totalRows}
      aria-colcount={totalColumns}
      className={`apg-treegrid ${className ?? ''}`}
    >
      {/* Header Row */}
      <div role="row" aria-rowindex={totalRows ? 1 : undefined}>
        {columns.map((col, colIndex) => (
          <div
            key={col.id}
            role="columnheader"
            aria-colindex={totalColumns ? startColIndex + colIndex : undefined}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      {visibleRows.map((flatRow, visibleIndex) => {
        const { node, level, hasChildren } = flatRow;
        const isExpanded = expandedSet.has(node.id);
        const isSelected = selectedRowSet.has(node.id);

        return (
          <div
            key={node.id}
            role="row"
            aria-level={level}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={selectable ? isSelected : undefined}
            aria-disabled={node.disabled ? 'true' : undefined}
            aria-rowindex={totalRows ? startRowIndex + visibleIndex : undefined}
            className={`apg-treegrid-row ${isSelected ? 'selected' : ''} ${node.disabled ? 'disabled' : ''}`}
            style={{ '--level': level } satisfies React.CSSProperties}
          >
            {node.cells.map((cell, colIndex) => {
              const col = columns[colIndex];
              const isRowHeader = col?.isRowHeader ?? false;
              const isFocused = cell.id === focusedCellId;

              return (
                <div
                  key={cell.id}
                  ref={(el) => {
                    if (el) {
                      cellRefs.current.set(cell.id, el);
                    } else {
                      cellRefs.current.delete(cell.id);
                    }
                  }}
                  role={isRowHeader ? 'rowheader' : 'gridcell'}
                  tabIndex={isFocused ? 0 : -1}
                  aria-disabled={cell.disabled ? 'true' : undefined}
                  aria-colindex={totalColumns ? startColIndex + colIndex : undefined}
                  aria-colspan={cell.colspan}
                  onKeyDown={(e) => handleKeyDown(e, cell, node.id, colIndex)}
                  onFocus={() => setFocusedCellId(cell.id)}
                  className={`apg-treegrid-cell ${isFocused ? 'focused' : ''} ${cell.disabled ? 'disabled' : ''}`}
                >
                  {isRowHeader && hasChildren && (
                    <span className="apg-treegrid-expand-icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9 6 15 12 9 18" />
                      </svg>
                    </span>
                  )}
                  {cell.value}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default TreeGrid;
