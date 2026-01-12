<script lang="ts">
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

  interface FlatRow {
    node: TreeGridNodeData;
    level: number;
    parentId: string | null;
    hasChildren: boolean;
  }

  interface CellPosition {
    rowIndex: number;
    colIndex: number;
    cell: TreeGridCellData;
    rowId: string;
    isRowHeader: boolean;
  }

  interface Props {
    columns: TreeGridColumnDef[];
    nodes: TreeGridNodeData[];
    ariaLabel?: string;
    ariaLabelledby?: string;
    expandedIds?: string[];
    defaultExpandedIds?: string[];
    selectable?: boolean;
    multiselectable?: boolean;
    selectedRowIds?: string[];
    defaultSelectedRowIds?: string[];
    defaultFocusedCellId?: string;
    totalRows?: number;
    totalColumns?: number;
    startRowIndex?: number;
    startColIndex?: number;
    enablePageNavigation?: boolean;
    pageSize?: number;
    onExpandedChange?: (expandedIds: string[]) => void;
    onSelectionChange?: (selectedRowIds: string[]) => void;
    onFocusChange?: (cellId: string | null) => void;
    onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
    renderCell?: (cell: TreeGridCellData, rowId: string, colId: string) => any;
  }

  // =============================================================================
  // Props
  // =============================================================================

  let {
    columns,
    nodes,
    ariaLabel,
    ariaLabelledby,
    expandedIds: controlledExpandedIds,
    defaultExpandedIds = [],
    selectable = false,
    multiselectable = false,
    selectedRowIds: controlledSelectedRowIds,
    defaultSelectedRowIds = [],
    defaultFocusedCellId,
    totalRows,
    totalColumns,
    startRowIndex = 2,
    startColIndex = 1,
    enablePageNavigation = false,
    pageSize = 5,
    onExpandedChange,
    onSelectionChange,
    onFocusChange,
    onCellActivate,
    renderCell,
  }: Props = $props();

  // =============================================================================
  // State
  // =============================================================================

  let internalExpandedIds = $state<Set<string>>(new Set(defaultExpandedIds));
  let internalSelectedRowIds = $state<Set<string>>(new Set(defaultSelectedRowIds));
  let focusedCellIdState = $state<string | null>(null);
  let initialized = $state(false);

  let treegridRef: HTMLDivElement | null = $state(null);
  let cellRefs: Map<string, HTMLDivElement> = new Map();

  // =============================================================================
  // Derived - Tree Flattening
  // =============================================================================

  function flattenTree(
    treeNodes: TreeGridNodeData[],
    level: number = 1,
    parentId: string | null = null
  ): FlatRow[] {
    const result: FlatRow[] = [];
    for (const node of treeNodes) {
      const hasChildren = Boolean(node.children && node.children.length > 0);
      result.push({ node, level, parentId, hasChildren });
      if (node.children) {
        result.push(...flattenTree(node.children, level + 1, node.id));
      }
    }
    return result;
  }

  const allRows = $derived(flattenTree(nodes));

  const rowMap = $derived.by(() => {
    const map = new Map<string, FlatRow>();
    for (const flatRow of allRows) {
      map.set(flatRow.node.id, flatRow);
    }
    return map;
  });

  const expandedIds = $derived(
    controlledExpandedIds ? new Set(controlledExpandedIds) : internalExpandedIds
  );
  const selectedRowIds = $derived(
    controlledSelectedRowIds ? new Set(controlledSelectedRowIds) : internalSelectedRowIds
  );

  const visibleRows = $derived.by(() => {
    const result: FlatRow[] = [];
    const collapsedParents = new Set<string>();

    for (const flatRow of allRows) {
      let isHidden = false;
      let currentParentId = flatRow.parentId;

      while (currentParentId) {
        if (collapsedParents.has(currentParentId) || !expandedIds.has(currentParentId)) {
          isHidden = true;
          break;
        }
        const parent = rowMap.get(currentParentId);
        currentParentId = parent?.parentId ?? null;
      }

      if (!isHidden) {
        result.push(flatRow);
        if (flatRow.hasChildren && !expandedIds.has(flatRow.node.id)) {
          collapsedParents.add(flatRow.node.id);
        }
      }
    }
    return result;
  });

  const cellPositionMap = $derived.by(() => {
    const map = new Map<string, CellPosition>();
    visibleRows.forEach((flatRow, rowIndex) => {
      flatRow.node.cells.forEach((cell, colIndex) => {
        map.set(cell.id, {
          rowIndex,
          colIndex,
          cell,
          rowId: flatRow.node.id,
          isRowHeader: columns[colIndex]?.isRowHeader ?? false,
        });
      });
    });
    return map;
  });

  const focusedCellId = $derived(
    focusedCellIdState ?? defaultFocusedCellId ?? visibleRows[0]?.node.cells[0]?.id ?? null
  );

  // =============================================================================
  // Effects
  // =============================================================================

  $effect(() => {
    if (!initialized && nodes.length > 0) {
      internalExpandedIds = new Set(defaultExpandedIds);
      internalSelectedRowIds = new Set(defaultSelectedRowIds);
      initialized = true;
    }
  });

  $effect(() => {
    if (treegridRef && nodes.length > 0) {
      const focusableElements = treegridRef.querySelectorAll<HTMLElement>(
        '[role="gridcell"] a[href], [role="gridcell"] button, [role="rowheader"] a[href], [role="rowheader"] button'
      );
      focusableElements.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
    }
  });

  function registerCell(node: HTMLDivElement, cellId: string) {
    cellRefs.set(cellId, node);
    return {
      destroy() {
        cellRefs.delete(cellId);
      },
    };
  }

  // =============================================================================
  // Methods
  // =============================================================================

  function setFocusedCellId(id: string | null) {
    focusedCellIdState = id;
    onFocusChange?.(id);
  }

  function focusCell(cellId: string) {
    const cellEl = cellRefs.get(cellId);
    if (cellEl) {
      const focusableChild = cellEl.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableChild) {
        focusableChild.setAttribute('tabindex', '-1');
        focusableChild.focus();
      } else {
        cellEl.focus();
      }
      setFocusedCellId(cellId);
    }
  }

  function updateExpandedIds(newExpandedIds: Set<string>) {
    if (!controlledExpandedIds) {
      internalExpandedIds = newExpandedIds;
    }
    onExpandedChange?.([...newExpandedIds]);
  }

  function expandRow(rowId: string) {
    const flatRow = rowMap.get(rowId);
    if (!flatRow?.hasChildren || flatRow.node.disabled) return;
    if (expandedIds.has(rowId)) return;

    const newExpanded = new Set(expandedIds);
    newExpanded.add(rowId);
    updateExpandedIds(newExpanded);
  }

  function collapseRow(rowId: string, currentFocusCellId?: string) {
    const flatRow = rowMap.get(rowId);
    if (!flatRow?.hasChildren || flatRow.node.disabled) return;
    if (!expandedIds.has(rowId)) return;

    const newExpanded = new Set(expandedIds);
    newExpanded.delete(rowId);
    updateExpandedIds(newExpanded);

    // If focus was on a child, move focus to the collapsed parent's first cell
    if (currentFocusCellId) {
      const focusPos = cellPositionMap.get(currentFocusCellId);
      if (focusPos) {
        const focusRowId = focusPos.rowId;
        let currentRow = rowMap.get(focusRowId);
        while (currentRow) {
          if (currentRow.parentId === rowId) {
            const parentRow = rowMap.get(rowId);
            if (parentRow) {
              const parentFirstCell = parentRow.node.cells[0];
              if (parentFirstCell) {
                // Use setTimeout to focus after Svelte updates the DOM
                setTimeout(() => focusCell(parentFirstCell.id), 0);
              }
            }
            break;
          }
          currentRow = currentRow.parentId ? rowMap.get(currentRow.parentId) : undefined;
        }
      }
    }
  }

  function updateSelectedRowIds(newSelectedIds: Set<string>) {
    if (!controlledSelectedRowIds) {
      internalSelectedRowIds = newSelectedIds;
    }
    onSelectionChange?.([...newSelectedIds]);
  }

  function toggleRowSelection(rowId: string, rowDisabled?: boolean) {
    if (!selectable || rowDisabled) return;

    if (multiselectable) {
      const newIds = new Set(selectedRowIds);
      if (newIds.has(rowId)) {
        newIds.delete(rowId);
      } else {
        newIds.add(rowId);
      }
      updateSelectedRowIds(newIds);
    } else {
      const newIds = selectedRowIds.has(rowId) ? new Set<string>() : new Set([rowId]);
      updateSelectedRowIds(newIds);
    }
  }

  function selectAllVisibleRows() {
    if (!selectable || !multiselectable) return;

    const allIds = new Set<string>();
    for (const flatRow of visibleRows) {
      if (!flatRow.node.disabled) {
        allIds.add(flatRow.node.id);
      }
    }
    updateSelectedRowIds(allIds);
  }

  function findNextVisibleRow(
    startRowIndex: number,
    direction: 'up' | 'down',
    size = 1
  ): number | null {
    if (direction === 'down') {
      const targetIndex = Math.min(startRowIndex + size, visibleRows.length - 1);
      return targetIndex > startRowIndex ? targetIndex : null;
    } else {
      const targetIndex = Math.max(startRowIndex - size, 0);
      return targetIndex < startRowIndex ? targetIndex : null;
    }
  }

  function handleKeyDown(event: KeyboardEvent, cell: TreeGridCellData, rowId: string) {
    const pos = cellPositionMap.get(cell.id);
    if (!pos) return;

    const { rowIndex, colIndex, isRowHeader } = pos;
    const flatRow = visibleRows[rowIndex];
    const colCount = columns.length;

    let handled = true;

    switch (event.key) {
      case 'ArrowRight': {
        if (
          isRowHeader &&
          flatRow.hasChildren &&
          !flatRow.node.disabled &&
          !expandedIds.has(rowId)
        ) {
          // Collapsed parent at rowheader: expand
          expandRow(rowId);
        } else {
          // Expanded parent at rowheader, leaf row at rowheader, or non-rowheader: move right
          if (colIndex < colCount - 1) {
            const nextCell = flatRow.node.cells[colIndex + 1];
            if (nextCell) focusCell(nextCell.id);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        if (isRowHeader) {
          if (flatRow.hasChildren && expandedIds.has(rowId) && !flatRow.node.disabled) {
            collapseRow(rowId, cell.id);
          } else if (flatRow.parentId) {
            const parentRow = rowMap.get(flatRow.parentId);
            if (parentRow) {
              const parentVisibleIndex = visibleRows.findIndex(
                (r) => r.node.id === flatRow.parentId
              );
              if (parentVisibleIndex !== -1) {
                const parentCell = parentRow.node.cells[colIndex];
                if (parentCell) focusCell(parentCell.id);
              }
            }
          }
        } else {
          if (colIndex > 0) {
            const prevCell = flatRow.node.cells[colIndex - 1];
            if (prevCell) focusCell(prevCell.id);
          }
        }
        break;
      }
      case 'ArrowDown': {
        const nextRowIndex = findNextVisibleRow(rowIndex, 'down');
        if (nextRowIndex !== null) {
          const nextRow = visibleRows[nextRowIndex];
          const nextCell = nextRow?.node.cells[colIndex];
          if (nextCell) focusCell(nextCell.id);
        }
        break;
      }
      case 'ArrowUp': {
        const prevRowIndex = findNextVisibleRow(rowIndex, 'up');
        if (prevRowIndex !== null) {
          const prevRow = visibleRows[prevRowIndex];
          const prevCell = prevRow?.node.cells[colIndex];
          if (prevCell) focusCell(prevCell.id);
        }
        break;
      }
      case 'Home': {
        if (event.ctrlKey) {
          const firstCell = visibleRows[0]?.node.cells[0];
          if (firstCell) focusCell(firstCell.id);
        } else {
          const firstCellInRow = flatRow.node.cells[0];
          if (firstCellInRow) focusCell(firstCellInRow.id);
        }
        break;
      }
      case 'End': {
        if (event.ctrlKey) {
          const lastRow = visibleRows[visibleRows.length - 1];
          const lastCell = lastRow?.node.cells[lastRow.node.cells.length - 1];
          if (lastCell) focusCell(lastCell.id);
        } else {
          const lastCellInRow = flatRow.node.cells[flatRow.node.cells.length - 1];
          if (lastCellInRow) focusCell(lastCellInRow.id);
        }
        break;
      }
      case 'PageDown': {
        if (enablePageNavigation) {
          const targetRowIndex = Math.min(rowIndex + pageSize, visibleRows.length - 1);
          const targetRow = visibleRows[targetRowIndex];
          const targetCell = targetRow?.node.cells[colIndex];
          if (targetCell) focusCell(targetCell.id);
        } else {
          handled = false;
        }
        break;
      }
      case 'PageUp': {
        if (enablePageNavigation) {
          const targetRowIndex = Math.max(rowIndex - pageSize, 0);
          const targetRow = visibleRows[targetRowIndex];
          const targetCell = targetRow?.node.cells[colIndex];
          if (targetCell) focusCell(targetCell.id);
        } else {
          handled = false;
        }
        break;
      }
      case ' ': {
        toggleRowSelection(rowId, flatRow.node.disabled);
        break;
      }
      case 'Enter': {
        if (!cell.disabled && !flatRow.node.disabled) {
          onCellActivate?.(cell.id, rowId, columns[colIndex]?.id ?? '');
        }
        break;
      }
      case 'a': {
        if (event.ctrlKey) {
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
  }

  // =============================================================================
  // Helper Functions
  // =============================================================================

  function getRowAriaExpanded(flatRow: FlatRow): 'true' | 'false' | undefined {
    if (!flatRow.hasChildren) return undefined;
    return expandedIds.has(flatRow.node.id) ? 'true' : 'false';
  }

  function getRowAriaSelected(flatRow: FlatRow): 'true' | 'false' | undefined {
    if (!selectable) return undefined;
    return selectedRowIds.has(flatRow.node.id) ? 'true' : 'false';
  }

  function getCellRole(colIndex: number): 'rowheader' | 'gridcell' {
    return columns[colIndex]?.isRowHeader ? 'rowheader' : 'gridcell';
  }

  function getExpandIcon(flatRow: FlatRow): string {
    if (!flatRow.hasChildren) return '';
    return expandedIds.has(flatRow.node.id) ? '\u25BC' : '\u25B6';
  }

  function getCellPaddingLeft(flatRow: FlatRow, colIndex: number): string | undefined {
    if (!columns[colIndex]?.isRowHeader) return undefined;
    return `${(flatRow.level - 1) * 20 + 8}px`;
  }
</script>

<div
  bind:this={treegridRef}
  role="treegrid"
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  aria-multiselectable={multiselectable ? 'true' : undefined}
  aria-rowcount={totalRows}
  aria-colcount={totalColumns}
  class="apg-treegrid"
>
  <!-- Header Row -->
  <div role="row" aria-rowindex={totalRows ? 1 : undefined}>
    {#each columns as col, colIndex (col.id)}
      <div role="columnheader" aria-colindex={totalColumns ? startColIndex + colIndex : undefined}>
        {col.header}
      </div>
    {/each}
  </div>

  <!-- Data Rows -->
  {#each visibleRows as flatRow, rowIndex (flatRow.node.id)}
    <div
      role="row"
      aria-level={flatRow.level}
      aria-expanded={getRowAriaExpanded(flatRow)}
      aria-selected={getRowAriaSelected(flatRow)}
      aria-disabled={flatRow.node.disabled ? 'true' : undefined}
      aria-rowindex={totalRows ? startRowIndex + rowIndex : undefined}
    >
      {#each flatRow.node.cells as cell, colIndex (cell.id)}
        {@const isFocused = cell.id === focusedCellId}
        {@const isSelected = selectedRowIds.has(flatRow.node.id)}
        {@const colId = columns[colIndex]?.id ?? ''}
        {@const isRowHeaderCell = columns[colIndex]?.isRowHeader}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          role={getCellRole(colIndex)}
          tabindex={isFocused ? 0 : -1}
          aria-disabled={cell.disabled || flatRow.node.disabled ? 'true' : undefined}
          aria-colindex={totalColumns ? startColIndex + colIndex : undefined}
          aria-colspan={cell.colspan}
          class="apg-treegrid-cell"
          class:focused={isFocused}
          class:selected={isSelected}
          class:disabled={cell.disabled || flatRow.node.disabled}
          style:padding-left={getCellPaddingLeft(flatRow, colIndex)}
          onkeydown={(e) => handleKeyDown(e, cell, flatRow.node.id)}
          onfocusin={() => setFocusedCellId(cell.id)}
          use:registerCell={cell.id}
        >
          {#if isRowHeaderCell && flatRow.hasChildren}
            <span class="expand-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </span>
          {/if}
          {#if renderCell}
            {@html renderCell(cell, flatRow.node.id, colId)}
          {:else}
            {cell.value}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
