import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

export interface GridProps {
  columns: GridColumnDef[];
  rows: GridRowData[];

  // Accessible name (one required)
  ariaLabel?: string;
  ariaLabelledby?: string;

  // Selection
  selectable?: boolean;
  multiselectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;

  // Focus
  focusedId?: string | null;
  defaultFocusedId?: string;
  onFocusChange?: (focusedId: string | null) => void;

  // Virtualization
  totalColumns?: number;
  totalRows?: number;
  startRowIndex?: number; // 1-based
  startColIndex?: number; // 1-based

  // Behavior
  wrapNavigation?: boolean;
  enablePageNavigation?: boolean;
  pageSize?: number;

  // Callbacks
  onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
  renderCell?: (cell: GridCellData, rowId: string, colId: string) => React.ReactNode;

  // Styling
  className?: string;
}

// =============================================================================
// Component
// =============================================================================

export function Grid({
  columns,
  rows,
  ariaLabel,
  ariaLabelledby,
  selectable = false,
  multiselectable = false,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
  focusedId: controlledFocusedId,
  defaultFocusedId,
  onFocusChange,
  totalColumns,
  totalRows,
  startRowIndex = 1,
  startColIndex = 1,
  wrapNavigation = false,
  enablePageNavigation = false,
  pageSize = 5,
  onCellActivate,
  renderCell,
  className,
}: GridProps) {
  // ==========================================================================
  // State
  // ==========================================================================

  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedIds);
  const selectedIds = controlledSelectedIds ?? internalSelectedIds;

  const [internalFocusedId, setInternalFocusedId] = useState<string | null>(() => {
    if (defaultFocusedId) return defaultFocusedId;
    // Default to first cell
    return rows[0]?.cells[0]?.id ?? null;
  });
  const focusedId = controlledFocusedId !== undefined ? controlledFocusedId : internalFocusedId;

  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ==========================================================================
  // Computed values
  // ==========================================================================

  // Map cellId to cell info for O(1) lookup
  const cellById = useMemo(() => {
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
  }, [rows]);

  const getCellPosition = useCallback(
    (cellId: string) => {
      const entry = cellById.get(cellId);
      if (!entry) {
        return null;
      }
      const { rowIndex, colIndex } = entry;
      return { rowIndex, colIndex };
    },
    [cellById]
  );

  const getCellAt = useCallback(
    (rowIndex: number, colIndex: number) => {
      const cell = rows[rowIndex]?.cells[colIndex];
      if (!cell) {
        return undefined;
      }
      return cellById.get(cell.id);
    },
    [cellById, rows]
  );

  const getColumnCount = useCallback(() => {
    return columns.length;
  }, [columns]);

  const getRowCount = useCallback(() => {
    return rows.length;
  }, [rows]);

  // ==========================================================================
  // Focus Management
  // ==========================================================================

  const setFocusedId = useCallback(
    (id: string | null) => {
      setInternalFocusedId(id);
      onFocusChange?.(id);
    },
    [onFocusChange]
  );

  const focusCell = useCallback(
    (cellId: string) => {
      const cellEl = cellRefs.current.get(cellId);
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
    },
    [setFocusedId]
  );

  // Find next focusable cell (skipping disabled cells if needed)
  const findNextFocusableCell = useCallback(
    (
      startRowIndex: number,
      startColIndex: number,
      direction: 'right' | 'left' | 'up' | 'down',
      skipDisabled = true
    ): { rowIndex: number; colIndex: number; cell: GridCellData } | null => {
      const colCount = getColumnCount();
      const rowCount = getRowCount();

      let rowIdx = startRowIndex;
      let colIdx = startColIndex;

      const step = () => {
        switch (direction) {
          case 'right':
            colIdx++;
            if (colIdx >= colCount) {
              if (wrapNavigation) {
                colIdx = 0;
                rowIdx++;
                if (rowIdx >= rowCount) {
                  return false; // End of grid
                }
              } else {
                return false; // Stay at edge
              }
            }
            break;
          case 'left':
            colIdx--;
            if (colIdx < 0) {
              if (wrapNavigation) {
                colIdx = colCount - 1;
                rowIdx--;
                if (rowIdx < 0) {
                  return false;
                }
              } else {
                return false;
              }
            }
            break;
          case 'down':
            rowIdx++;
            if (rowIdx >= rowCount) {
              return false;
            }
            break;
          case 'up':
            rowIdx--;
            if (rowIdx < 0) {
              return false;
            }
            break;
        }
        return true;
      };

      // Take one step first
      if (!step()) return null;

      // Find non-disabled cell
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
    },
    [getColumnCount, getRowCount, wrapNavigation, getCellAt]
  );

  // ==========================================================================
  // Selection Management
  // ==========================================================================

  const setSelectedIds = useCallback(
    (ids: string[]) => {
      setInternalSelectedIds(ids);
      onSelectionChange?.(ids);
    },
    [onSelectionChange]
  );

  const toggleSelection = useCallback(
    (cellId: string, cell: GridCellData) => {
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
    },
    [selectable, multiselectable, selectedIds, setSelectedIds]
  );

  const selectAll = useCallback(() => {
    if (!selectable || !multiselectable) {
      return;
    }

    const allIds = Array.from(cellById.values())
      .filter(({ cell }) => !cell.disabled)
      .map(({ cell }) => cell.id);
    setSelectedIds(allIds);
  }, [selectable, multiselectable, cellById, setSelectedIds]);

  // ==========================================================================
  // Keyboard Handling
  // ==========================================================================

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, cell: GridCellData, rowId: string, colId: string) => {
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
            // Ctrl+Home: Go to first cell in grid
            const firstCell = rows[0]?.cells[0];
            if (firstCell) focusCell(firstCell.id);
          } else {
            // Home: Go to first cell in row
            const firstCellInRow = rows[rowIndex]?.cells[0];
            if (firstCellInRow) focusCell(firstCellInRow.id);
          }
          break;
        }
        case 'End': {
          if (ctrlKey) {
            // Ctrl+End: Go to last cell in grid
            const lastRow = rows[rows.length - 1];
            const lastCell = lastRow?.cells[lastRow.cells.length - 1];
            if (lastCell) focusCell(lastCell.id);
          } else {
            // End: Go to last cell in row
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
    },
    [
      getCellPosition,
      findNextFocusableCell,
      focusCell,
      rows,
      enablePageNavigation,
      pageSize,
      toggleSelection,
      onCellActivate,
      selectAll,
    ]
  );

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Set tabindex="-1" on all focusable elements inside grid cells
  // This ensures Tab exits the grid instead of moving between widgets
  useEffect(() => {
    if (gridRef.current) {
      const focusableElements = gridRef.current.querySelectorAll<HTMLElement>(
        '[role="gridcell"] a[href], [role="gridcell"] button, [role="rowheader"] a[href], [role="rowheader"] button'
      );
      focusableElements.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
    }
  }, [rows]);

  // Focus the focused cell when focusedId changes externally
  useEffect(() => {
    if (focusedId) {
      const cellEl = cellRefs.current.get(focusedId);
      if (cellEl && document.activeElement !== cellEl) {
        // Only focus if grid is already focused
        if (gridRef.current?.contains(document.activeElement)) {
          cellEl.focus();
        }
      }
    }
  }, [focusedId]);

  // ==========================================================================
  // Render
  // ==========================================================================

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-multiselectable={multiselectable ? 'true' : undefined}
      aria-rowcount={totalRows}
      aria-colcount={totalColumns}
      className={`apg-grid ${className ?? ''}`}
    >
      {/* Header Row */}
      <div role="row" aria-rowindex={totalRows ? 1 : undefined}>
        {columns.map((col, colIndex) => (
          <div
            key={col.id}
            role="columnheader"
            aria-colindex={totalColumns ? startColIndex + colIndex : undefined}
            aria-colspan={col.colspan}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* Data Rows */}
      {rows.map((row, rowIndex) => (
        <div
          key={row.id}
          role="row"
          aria-rowindex={totalRows ? startRowIndex + rowIndex : undefined}
        >
          {row.cells.map((cell, colIndex) => {
            const isRowHeader = row.hasRowHeader && colIndex === 0;
            const isFocused = cell.id === focusedId;
            const isSelected = selectedIds.includes(cell.id);
            const colId = columns[colIndex]?.id ?? '';

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
                aria-selected={selectable ? (isSelected ? 'true' : 'false') : undefined}
                aria-disabled={cell.disabled ? 'true' : undefined}
                aria-colindex={totalColumns ? startColIndex + colIndex : undefined}
                aria-colspan={cell.colspan}
                aria-rowspan={cell.rowspan}
                onKeyDown={(e) => handleKeyDown(e, cell, row.id, colId)}
                onFocus={() => setFocusedId(cell.id)}
                className={`apg-grid-cell ${isFocused ? 'focused' : ''} ${isSelected ? 'selected' : ''} ${cell.disabled ? 'disabled' : ''}`}
              >
                {renderCell ? renderCell(cell, row.id, colId) : cell.value}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default Grid;
