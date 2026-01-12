<script lang="ts">
  // =============================================================================
  // Types
  // =============================================================================

  export interface GridCellData {
    id: string;
    value: string | number;
    disabled?: boolean;
    colspan?: number;
    rowspan?: number;
  }

  export interface GridColumnDef {
    id: string;
    header: string;
    colspan?: number;
  }

  export interface GridRowData {
    id: string;
    cells: GridCellData[];
    hasRowHeader?: boolean;
    disabled?: boolean;
  }

  interface Props {
    columns: GridColumnDef[];
    rows: GridRowData[];
    ariaLabel?: string;
    ariaLabelledby?: string;
    selectable?: boolean;
    multiselectable?: boolean;
    selectedIds?: string[];
    defaultSelectedIds?: string[];
    defaultFocusedId?: string;
    totalColumns?: number;
    totalRows?: number;
    startRowIndex?: number;
    startColIndex?: number;
    wrapNavigation?: boolean;
    enablePageNavigation?: boolean;
    pageSize?: number;
    onSelectionChange?: (selectedIds: string[]) => void;
    onFocusChange?: (focusedId: string | null) => void;
    onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
    renderCell?: (cell: GridCellData, rowId: string, colId: string) => any;
  }

  // =============================================================================
  // Props
  // =============================================================================

  let {
    columns,
    rows,
    ariaLabel,
    ariaLabelledby,
    selectable = false,
    multiselectable = false,
    selectedIds: controlledSelectedIds,
    defaultSelectedIds = [],
    defaultFocusedId,
    totalColumns,
    totalRows,
    startRowIndex = 1,
    startColIndex = 1,
    wrapNavigation = false,
    enablePageNavigation = false,
    pageSize = 5,
    onSelectionChange,
    onFocusChange,
    onCellActivate,
    renderCell,
  }: Props = $props();

  // =============================================================================
  // State
  // =============================================================================

  let internalSelectedIds = $state<string[]>([]);
  let focusedIdState = $state<string | null>(null);
  let initialized = $state(false);

  let gridRef: HTMLDivElement | null = $state(null);
  let cellRefs: Map<string, HTMLDivElement> = new Map();

  // Compute effective focused ID (use state if set, otherwise derive from props)
  const focusedId = $derived(focusedIdState ?? defaultFocusedId ?? rows[0]?.cells[0]?.id ?? null);

  // Initialize selection state on mount
  $effect(() => {
    if (!initialized && rows.length > 0) {
      internalSelectedIds = defaultSelectedIds ? [...defaultSelectedIds] : [];
      initialized = true;
    }
  });

  // Set tabindex="-1" on all focusable elements inside grid cells
  // This ensures Tab exits the grid instead of moving between widgets
  $effect(() => {
    if (gridRef && rows.length > 0) {
      const focusableElements = gridRef.querySelectorAll<HTMLElement>(
        '[role="gridcell"] a[href], [role="gridcell"] button, [role="rowheader"] a[href], [role="rowheader"] button'
      );
      focusableElements.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
    }
  });

  // Svelte action to register cell refs
  function registerCell(node: HTMLDivElement, cellId: string) {
    cellRefs.set(cellId, node);
    return {
      destroy() {
        cellRefs.delete(cellId);
      },
    };
  }

  // =============================================================================
  // Derived
  // =============================================================================

  const selectedIds = $derived(controlledSelectedIds ?? internalSelectedIds);

  // Map cellId to cell info for O(1) lookup
  const cellById = $derived.by(() => {
    const map = new Map<
      string,
      { rowIndex: number; colIndex: number; cell: GridCellData; rowId: string }
    >();
    rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, colIndex) => {
        map.set(cell.id, { rowIndex, colIndex, cell, rowId: row.id });
      });
    });
    return map;
  });

  // =============================================================================
  // Methods
  // =============================================================================

  function getCellPosition(cellId: string) {
    const entry = cellById.get(cellId);
    if (!entry) {
      return null;
    }
    const { rowIndex, colIndex } = entry;
    return { rowIndex, colIndex };
  }

  function getCellAt(rowIndex: number, colIndex: number) {
    const cell = rows[rowIndex]?.cells[colIndex];
    if (!cell) {
      return undefined;
    }
    return cellById.get(cell.id);
  }

  function setFocusedId(id: string | null) {
    focusedIdState = id;
    onFocusChange?.(id);
  }

  function focusCell(cellId: string) {
    const cellEl = cellRefs.get(cellId);
    if (cellEl) {
      // Check if cell contains a focusable element (link, button, etc.)
      // Per APG: when cell contains a single widget, focus should be on the widget
      const focusableChild = cellEl.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableChild) {
        // Set tabindex="-1" so Tab skips this element and exits the grid
        // The widget can still receive programmatic focus
        focusableChild.setAttribute('tabindex', '-1');
        focusableChild.focus();
      } else {
        cellEl.focus();
      }
      setFocusedId(cellId);
    }
  }

  function findNextFocusableCell(
    startRow: number,
    startCol: number,
    direction: 'right' | 'left' | 'up' | 'down',
    skipDisabled = true
  ): { rowIndex: number; colIndex: number; cell: GridCellData } | null {
    const colCount = columns.length;
    const rowCount = rows.length;

    let rowIdx = startRow;
    let colIdx = startCol;

    const step = () => {
      switch (direction) {
        case 'right':
          colIdx++;
          if (colIdx >= colCount) {
            if (wrapNavigation) {
              colIdx = 0;
              rowIdx++;
              if (rowIdx >= rowCount) return false;
            } else {
              return false;
            }
          }
          break;
        case 'left':
          colIdx--;
          if (colIdx < 0) {
            if (wrapNavigation) {
              colIdx = colCount - 1;
              rowIdx--;
              if (rowIdx < 0) return false;
            } else {
              return false;
            }
          }
          break;
        case 'down':
          rowIdx++;
          if (rowIdx >= rowCount) return false;
          break;
        case 'up':
          rowIdx--;
          if (rowIdx < 0) return false;
          break;
      }
      return true;
    };

    if (!step()) return null;

    let iterations = 0;
    const maxIterations = colCount * rowCount;

    while (iterations < maxIterations) {
      const entry = getCellAt(rowIdx, colIdx);
      if (entry && (!skipDisabled || !entry.cell.disabled)) {
        return { rowIndex: rowIdx, colIndex: colIdx, cell: entry.cell };
      }
      if (!step()) break;
      iterations++;
    }

    return null;
  }

  function setSelectedIds(ids: string[]) {
    internalSelectedIds = ids;
    onSelectionChange?.(ids);
  }

  function toggleSelection(cellId: string, cell: GridCellData) {
    if (!selectable || cell.disabled) {
      return;
    }

    if (multiselectable) {
      const newIds = selectedIds.includes(cellId)
        ? selectedIds.filter((id) => id !== cellId)
        : [...selectedIds, cellId];
      setSelectedIds(newIds);
    } else {
      const newIds = selectedIds.includes(cellId) ? [] : [cellId];
      setSelectedIds(newIds);
    }
  }

  function selectAll() {
    if (!selectable || !multiselectable) {
      return;
    }

    const allIds = Array.from(cellById.values())
      .filter(({ cell }) => !cell.disabled)
      .map(({ cell }) => cell.id);
    setSelectedIds(allIds);
  }

  function handleKeyDown(event: KeyboardEvent, cell: GridCellData, rowId: string, colId: string) {
    const pos = getCellPosition(cell.id);
    if (!pos) {
      return;
    }

    const { rowIndex, colIndex } = pos;
    const { key, ctrlKey } = event;
    let handled = true;

    switch (key) {
      case 'ArrowRight': {
        const next = findNextFocusableCell(rowIndex, colIndex, 'right');
        if (next) focusCell(next.cell.id);
        break;
      }
      case 'ArrowLeft': {
        const next = findNextFocusableCell(rowIndex, colIndex, 'left');
        if (next) focusCell(next.cell.id);
        break;
      }
      case 'ArrowDown': {
        const next = findNextFocusableCell(rowIndex, colIndex, 'down');
        if (next) focusCell(next.cell.id);
        break;
      }
      case 'ArrowUp': {
        const next = findNextFocusableCell(rowIndex, colIndex, 'up');
        if (next) focusCell(next.cell.id);
        break;
      }
      case 'Home': {
        if (ctrlKey) {
          const firstCell = rows[0]?.cells[0];
          if (firstCell) focusCell(firstCell.id);
        } else {
          const firstCellInRow = rows[rowIndex]?.cells[0];
          if (firstCellInRow) focusCell(firstCellInRow.id);
        }
        break;
      }
      case 'End': {
        if (ctrlKey) {
          const lastRow = rows[rows.length - 1];
          const lastCell = lastRow?.cells[lastRow.cells.length - 1];
          if (lastCell) focusCell(lastCell.id);
        } else {
          const currentRow = rows[rowIndex];
          const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
          if (lastCellInRow) focusCell(lastCellInRow.id);
        }
        break;
      }
      case 'PageDown': {
        if (enablePageNavigation) {
          const targetRowIndex = Math.min(rowIndex + pageSize, rows.length - 1);
          const targetCell = rows[targetRowIndex]?.cells[colIndex];
          if (targetCell) focusCell(targetCell.id);
        } else {
          handled = false;
        }
        break;
      }
      case 'PageUp': {
        if (enablePageNavigation) {
          const targetRowIndex = Math.max(rowIndex - pageSize, 0);
          const targetCell = rows[targetRowIndex]?.cells[colIndex];
          if (targetCell) focusCell(targetCell.id);
        } else {
          handled = false;
        }
        break;
      }
      case ' ': {
        toggleSelection(cell.id, cell);
        break;
      }
      case 'Enter': {
        if (!cell.disabled) {
          onCellActivate?.(cell.id, rowId, colId);
        }
        break;
      }
      case 'a': {
        if (ctrlKey) {
          selectAll();
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
</script>

<div
  bind:this={gridRef}
  role="grid"
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  aria-multiselectable={multiselectable ? 'true' : undefined}
  aria-rowcount={totalRows}
  aria-colcount={totalColumns}
  class="apg-grid"
>
  <!-- Header Row -->
  <div role="row" aria-rowindex={totalRows ? 1 : undefined}>
    {#each columns as col, colIndex (col.id)}
      <div
        role="columnheader"
        aria-colindex={totalColumns ? startColIndex + colIndex : undefined}
        aria-colspan={col.colspan}
      >
        {col.header}
      </div>
    {/each}
  </div>

  <!-- Data Rows -->
  {#each rows as row, rowIndex (row.id)}
    <div role="row" aria-rowindex={totalRows ? startRowIndex + rowIndex : undefined}>
      {#each row.cells as cell, colIndex (cell.id)}
        {@const isRowHeader = row.hasRowHeader && colIndex === 0}
        {@const isFocused = cell.id === focusedId}
        {@const isSelected = selectedIds.includes(cell.id)}
        {@const colId = columns[colIndex]?.id ?? ''}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          role={isRowHeader ? 'rowheader' : 'gridcell'}
          tabindex={isFocused ? 0 : -1}
          aria-selected={selectable ? (isSelected ? 'true' : 'false') : undefined}
          aria-disabled={cell.disabled ? 'true' : undefined}
          aria-colindex={totalColumns ? startColIndex + colIndex : undefined}
          aria-colspan={cell.colspan}
          aria-rowspan={cell.rowspan}
          class="apg-grid-cell"
          class:focused={isFocused}
          class:selected={isSelected}
          class:disabled={cell.disabled}
          onkeydown={(e) => handleKeyDown(e, cell, row.id, colId)}
          onfocusin={() => setFocusedId(cell.id)}
          use:registerCell={cell.id}
        >
          {#if renderCell}
            {@html renderCell(cell, row.id, colId)}
          {:else}
            {cell.value}
          {/if}
        </div>
      {/each}
    </div>
  {/each}
</div>
