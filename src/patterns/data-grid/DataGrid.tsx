import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// =============================================================================
// Types
// =============================================================================

export type SortDirection = 'ascending' | 'descending' | 'none' | 'other';

// =============================================================================
// Helper Functions
// =============================================================================

/** Get sort indicator character based on sort direction */
function getSortIndicator(direction?: SortDirection): string {
  if (direction === 'ascending') return ' ▲';
  if (direction === 'descending') return ' ▼';
  return ' ⇅';
}
export type EditType = 'text' | 'select' | 'combobox';

export interface DataGridCellData {
  id: string;
  value: string | number;
  disabled?: boolean;
  colspan?: number;
  rowspan?: number;
  editable?: boolean;
  readonly?: boolean;
}

export interface DataGridColumnDef {
  id: string;
  header: string;
  sortable?: boolean;
  sortDirection?: SortDirection;
  colspan?: number;
  isRowLabel?: boolean; // This column provides accessible labels for row checkboxes
  editable?: boolean; // Column-level editable flag
  editType?: EditType; // Type of editor: text, select, or combobox
  options?: string[]; // Options for select/combobox
}

export interface DataGridRowData {
  id: string;
  cells: DataGridCellData[];
  hasRowHeader?: boolean;
  disabled?: boolean;
}

export interface DataGridProps {
  columns: DataGridColumnDef[];
  rows: DataGridRowData[];

  // Accessible name (one required)
  ariaLabel?: string;
  ariaLabelledby?: string;

  // Row Selection
  rowSelectable?: boolean;
  rowMultiselectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onRowSelectionChange?: (rowIds: string[]) => void;

  // Sorting
  onSort?: (columnId: string, direction: SortDirection) => void;

  // Range Selection
  enableRangeSelection?: boolean;
  onRangeSelect?: (cellIds: string[]) => void;

  // Cell Editing
  editable?: boolean;
  readonly?: boolean;
  editingCellId?: string | null;
  onEditStart?: (cellId: string, rowId: string, colId: string) => void;
  onEditEnd?: (cellId: string, value: string, cancelled: boolean) => void;
  onCellValueChange?: (cellId: string, newValue: string) => void;

  // Focus
  focusedId?: string | null;
  defaultFocusedId?: string;
  onFocusChange?: (focusedId: string | null) => void;

  // Cell Selection (from Grid)
  selectable?: boolean;
  multiselectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;

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
  renderCell?: (cell: DataGridCellData, rowId: string, colId: string) => React.ReactNode;

  // Styling
  className?: string;
}

// =============================================================================
// Helper Functions
// =============================================================================

function getNextSortDirection(current: SortDirection | undefined): SortDirection {
  switch (current) {
    case 'ascending':
      return 'descending';
    case 'descending':
      return 'ascending';
    case 'none':
    default:
      return 'ascending';
  }
}

// =============================================================================
// Component
// =============================================================================

export function DataGrid({
  columns,
  rows,
  ariaLabel,
  ariaLabelledby,
  rowSelectable = false,
  rowMultiselectable = false,
  selectedRowIds: controlledSelectedRowIds,
  defaultSelectedRowIds = [],
  onRowSelectionChange,
  onSort,
  enableRangeSelection = false,
  onRangeSelect,
  editable = false,
  readonly = false,
  editingCellId: controlledEditingCellId,
  onEditStart,
  onEditEnd,
  onCellValueChange,
  focusedId: controlledFocusedId,
  defaultFocusedId,
  onFocusChange,
  selectable = false,
  multiselectable = false,
  selectedIds: controlledSelectedIds,
  defaultSelectedIds = [],
  onSelectionChange,
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
}: DataGridProps) {
  // ==========================================================================
  // State
  // ==========================================================================

  // Row selection
  const [internalSelectedRowIds, setInternalSelectedRowIds] =
    useState<string[]>(defaultSelectedRowIds);
  const selectedRowIds = controlledSelectedRowIds ?? internalSelectedRowIds;

  // Cell selection
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedIds);
  const selectedIds = controlledSelectedIds ?? internalSelectedIds;

  // Focus
  const [internalFocusedId, setInternalFocusedId] = useState<string | null>(() => {
    if (defaultFocusedId) return defaultFocusedId;
    // Default to first focusable item based on row selection mode
    // rowMultiselectable: header checkbox cell is first (Select all rows)
    // rowSelectable only: first row's checkbox cell
    // Otherwise: first data cell
    if (rowSelectable && rowMultiselectable) {
      return 'header-checkbox';
    }
    if (rowSelectable) {
      return rows[0] ? `checkbox-${rows[0].id}` : null;
    }
    return rows[0]?.cells[0]?.id ?? null;
  });
  const focusedId = controlledFocusedId !== undefined ? controlledFocusedId : internalFocusedId;

  // Edit mode
  const [internalEditingCellId, setInternalEditingCellId] = useState<string | null>(null);
  const editingCellId =
    controlledEditingCellId !== undefined ? controlledEditingCellId : internalEditingCellId;
  const [editValue, setEditValue] = useState<string>('');
  const [originalEditValue, setOriginalEditValue] = useState<string>('');
  const [editingColId, setEditingColId] = useState<string | null>(null);

  // Combobox state
  const [comboboxExpanded, setComboboxExpanded] = useState(false);
  const [comboboxActiveIndex, setComboboxActiveIndex] = useState(-1);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);

  // Range selection anchor
  const [anchorCellId, setAnchorCellId] = useState<string | null>(null);

  // Ref to track if edit is being ended (to prevent double callback)
  const isEndingEditRef = useRef(false);

  const gridRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const headerRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // ==========================================================================
  // Computed values
  // ==========================================================================

  // Check if we have sortable headers
  const hasSortableHeaders = useMemo(() => columns.some((col) => col.sortable), [columns]);

  // Check if header row has focusable items (sortable headers OR header checkbox)
  const hasHeaderFocusable = useMemo(
    () => hasSortableHeaders || (rowSelectable && rowMultiselectable),
    [hasSortableHeaders, rowSelectable, rowMultiselectable]
  );

  // Find the column that provides row labels (for aria-labelledby on row checkboxes)
  // Priority: 1. Column with isRowLabel: true, 2. First column (fallback)
  const rowLabelColumn = useMemo(() => {
    const labelColumn = columns.find((col) => col.isRowLabel);
    return labelColumn ?? columns[0];
  }, [columns]);

  // Build a flat list of focusable items (sortable headers + cells)
  const focusableItems = useMemo(() => {
    const items: Array<{
      id: string;
      type: 'header' | 'cell' | 'checkbox' | 'header-checkbox';
      rowIndex: number; // -1 for header
      colIndex: number;
      columnId?: string;
      rowId?: string;
      cell?: DataGridCellData;
      disabled?: boolean;
    }> = [];

    // Column offset when rowSelectable is enabled (checkbox column takes index 0)
    const colOffset = rowSelectable ? 1 : 0;

    // Header checkbox cell at row index -1, colIndex 0 (when rowMultiselectable)
    if (rowSelectable && rowMultiselectable) {
      items.push({
        id: 'header-checkbox',
        type: 'header-checkbox',
        rowIndex: -1,
        colIndex: 0,
      });
    }

    // Sortable headers at row index -1
    columns.forEach((col, colIndex) => {
      if (col.sortable) {
        items.push({
          id: `header-${col.id}`,
          type: 'header',
          rowIndex: -1,
          colIndex: colIndex + colOffset,
          columnId: col.id,
        });
      }
    });

    // Checkbox cells and data cells
    rows.forEach((row, rowIndex) => {
      // Add checkbox cell if row selection is enabled
      if (rowSelectable) {
        items.push({
          id: `checkbox-${row.id}`,
          type: 'checkbox',
          rowIndex,
          colIndex: 0,
          rowId: row.id,
          disabled: row.disabled,
        });
      }

      // Data cells
      row.cells.forEach((cell, colIndex) => {
        items.push({
          id: cell.id,
          type: 'cell',
          rowIndex,
          colIndex: colIndex + colOffset,
          rowId: row.id,
          columnId: columns[colIndex]?.id,
          cell,
          disabled: cell.disabled || row.disabled,
        });
      });
    });

    return items;
  }, [columns, rows, rowSelectable, rowMultiselectable]);

  // Map for quick lookup
  const itemById = useMemo(() => {
    const map = new Map<string, (typeof focusableItems)[0]>();
    focusableItems.forEach((item) => map.set(item.id, item));
    return map;
  }, [focusableItems]);

  // Get position of a cell/header
  const getItemPosition = useCallback(
    (id: string) => {
      const item = itemById.get(id);
      if (!item) return null;
      return { rowIndex: item.rowIndex, colIndex: item.colIndex };
    },
    [itemById]
  );

  // Get item at position
  const getItemAt = useCallback(
    (rowIndex: number, colIndex: number) => {
      if (rowIndex === -1) {
        // Header row - find header-checkbox or sortable header at this column
        return focusableItems.find(
          (item) =>
            (item.type === 'header' || item.type === 'header-checkbox') &&
            item.rowIndex === -1 &&
            item.colIndex === colIndex
        );
      }
      // Data row - find cell or checkbox at this position
      return focusableItems.find(
        (item) =>
          (item.type === 'cell' || item.type === 'checkbox') &&
          item.rowIndex === rowIndex &&
          item.colIndex === colIndex
      );
    },
    [focusableItems]
  );

  const getColumnCount = useCallback(
    () => columns.length + (rowSelectable ? 1 : 0),
    [columns, rowSelectable]
  );
  const getRowCount = useCallback(() => rows.length, [rows]);

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

  const focusItem = useCallback(
    (id: string) => {
      const item = itemById.get(id);
      if (!item) return;

      if (item.type === 'header') {
        const headerEl = headerRefs.current.get(item.columnId!);
        if (headerEl) {
          headerEl.focus();
          setFocusedId(id);
        }
      } else if (item.type === 'header-checkbox') {
        const cellEl = cellRefs.current.get(id);
        if (cellEl) {
          cellEl.focus();
          setFocusedId(id);
        }
      } else {
        const cellEl = cellRefs.current.get(id);
        if (cellEl) {
          cellEl.focus();
          setFocusedId(id);
        }
      }
    },
    [itemById, setFocusedId]
  );

  // Find next focusable item (skipping disabled cells)
  const findNextFocusable = useCallback(
    (
      startRowIndex: number,
      startColIndex: number,
      direction: 'right' | 'left' | 'up' | 'down',
      skipDisabled = true
    ): (typeof focusableItems)[0] | null => {
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
                // Allow going up to header row (-1) if header has focusable items
                if (rowIdx < (hasHeaderFocusable ? -1 : 0)) return false;
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
            // Allow going up to header row (-1) if header has focusable items
            if (rowIdx < (hasHeaderFocusable ? -1 : 0)) return false;
            break;
        }
        return true;
      };

      // Take one step first
      if (!step()) return null;

      // Find non-disabled item
      let iterations = 0;
      const maxIterations = colCount * (rowCount + 1);

      while (iterations < maxIterations) {
        const item = getItemAt(rowIdx, colIdx);
        if (item) {
          // For header row (-1), always allow (headers are not disabled)
          if (rowIdx === -1) {
            return item;
          }
          // For data cells, check disabled state
          if (!skipDisabled || !item.disabled) {
            return item;
          }
        }
        if (!step()) break;
        iterations++;
      }

      return null;
    },
    [getColumnCount, getRowCount, wrapNavigation, hasHeaderFocusable, getItemAt]
  );

  // ==========================================================================
  // Row Selection
  // ==========================================================================

  const setSelectedRowIds = useCallback(
    (ids: string[]) => {
      setInternalSelectedRowIds(ids);
      onRowSelectionChange?.(ids);
    },
    [onRowSelectionChange]
  );

  const toggleRowSelection = useCallback(
    (rowId: string, row: DataGridRowData) => {
      if (!rowSelectable || row.disabled) return;

      if (rowMultiselectable) {
        const newIds = selectedRowIds.includes(rowId)
          ? selectedRowIds.filter((id) => id !== rowId)
          : [...selectedRowIds, rowId];
        setSelectedRowIds(newIds);
      } else {
        const newIds = selectedRowIds.includes(rowId) ? [] : [rowId];
        setSelectedRowIds(newIds);
      }
    },
    [rowSelectable, rowMultiselectable, selectedRowIds, setSelectedRowIds]
  );

  // Toggle all row selection
  const toggleAllRowSelection = useCallback(() => {
    if (!rowSelectable || !rowMultiselectable) return;

    const allRowIds = rows.filter((r) => !r.disabled).map((r) => r.id);
    const allSelected = allRowIds.every((id) => selectedRowIds.includes(id));

    if (allSelected) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(allRowIds);
    }
  }, [rowSelectable, rowMultiselectable, rows, selectedRowIds, setSelectedRowIds]);

  // Get select all checkbox state
  const getSelectAllState = useCallback((): 'all' | 'some' | 'none' => {
    const allRowIds = rows.filter((r) => !r.disabled).map((r) => r.id);
    if (allRowIds.length === 0) return 'none';

    const selectedCount = allRowIds.filter((id) => selectedRowIds.includes(id)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === allRowIds.length) return 'all';
    return 'some';
  }, [rows, selectedRowIds]);

  // ==========================================================================
  // Cell Selection
  // ==========================================================================

  const setSelectedIds = useCallback(
    (ids: string[]) => {
      setInternalSelectedIds(ids);
      onSelectionChange?.(ids);
    },
    [onSelectionChange]
  );

  const toggleSelection = useCallback(
    (cellId: string, cell: DataGridCellData) => {
      if (!selectable || cell.disabled) return;

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
    if (!selectable || !multiselectable) return;

    const allIds = focusableItems
      .filter((item) => item.type === 'cell' && !item.disabled)
      .map((item) => item.id);
    setSelectedIds(allIds);
  }, [selectable, multiselectable, focusableItems, setSelectedIds]);

  // ==========================================================================
  // Range Selection
  // ==========================================================================

  const getCellsInRange = useCallback(
    (startId: string, endId: string): string[] => {
      const startItem = itemById.get(startId);
      const endItem = itemById.get(endId);
      if (!startItem || !endItem || startItem.type === 'header' || endItem.type === 'header') {
        return [];
      }

      const minRow = Math.min(startItem.rowIndex, endItem.rowIndex);
      const maxRow = Math.max(startItem.rowIndex, endItem.rowIndex);
      const minCol = Math.min(startItem.colIndex, endItem.colIndex);
      const maxCol = Math.max(startItem.colIndex, endItem.colIndex);

      const cellIds: string[] = [];
      for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
          const item = getItemAt(r, c);
          if (item && item.type === 'cell' && !item.disabled) {
            cellIds.push(item.id);
          }
        }
      }
      return cellIds;
    },
    [itemById, getItemAt]
  );

  const extendRangeSelection = useCallback(
    (currentCellId: string, newFocusId: string) => {
      if (!enableRangeSelection) return;

      // If no anchor yet, use the current cell (before movement) as anchor
      const anchor = anchorCellId ?? currentCellId;
      if (!anchorCellId) {
        setAnchorCellId(currentCellId);
      }

      const cellIds = getCellsInRange(anchor, newFocusId);
      onRangeSelect?.(cellIds);
    },
    [enableRangeSelection, anchorCellId, getCellsInRange, onRangeSelect]
  );

  // ==========================================================================
  // Sorting
  // ==========================================================================

  const handleSort = useCallback(
    (columnId: string) => {
      const column = columns.find((col) => col.id === columnId);
      if (!column?.sortable || !onSort) return;

      const nextDirection = getNextSortDirection(column.sortDirection);
      onSort(columnId, nextDirection);
    },
    [columns, onSort]
  );

  // ==========================================================================
  // Cell Editing
  // ==========================================================================

  // Helper to check if a cell is editable (cell-level or column-level)
  const isCellEditable = useCallback(
    (cell: DataGridCellData, colId: string) => {
      if (cell.readonly) return false;
      // Cell-level editable takes priority
      if (cell.editable !== undefined) return cell.editable;
      // Column-level editable
      const column = columns.find((col) => col.id === colId);
      return column?.editable ?? false;
    },
    [columns]
  );

  // Helper to get column's editType
  const getColumnEditType = useCallback(
    (colId: string): EditType => {
      const column = columns.find((col) => col.id === colId);
      return column?.editType ?? 'text';
    },
    [columns]
  );

  // Helper to get column's options
  const getColumnOptions = useCallback(
    (colId: string): string[] => {
      const column = columns.find((col) => col.id === colId);
      return column?.options ?? [];
    },
    [columns]
  );

  const startEdit = useCallback(
    (cellId: string, rowId: string, colId: string) => {
      if (!editable || readonly) return;

      const item = itemById.get(cellId);
      if (!item || item.type === 'header' || !item.cell) return;

      // Check if cell is editable (cell-level or column-level)
      if (!isCellEditable(item.cell, colId)) return;

      const value = String(item.cell.value);
      setOriginalEditValue(value);
      setEditValue(value);
      setEditingColId(colId);
      setInternalEditingCellId(cellId);

      // Initialize combobox state if editType is combobox
      const editType = getColumnEditType(colId);
      if (editType === 'combobox') {
        const options = getColumnOptions(colId);
        setFilteredOptions(options);
        setComboboxExpanded(true);
        setComboboxActiveIndex(-1);
      }

      onEditStart?.(cellId, rowId, colId);
    },
    [editable, readonly, itemById, isCellEditable, getColumnEditType, getColumnOptions, onEditStart]
  );

  const endEdit = useCallback(
    (cellId: string, cancelled: boolean, explicitValue?: string) => {
      // Guard: prevent double callback using ref
      if (isEndingEditRef.current) return;
      // Guard: only end edit if we're currently editing this cell
      if (internalEditingCellId !== cellId) return;

      isEndingEditRef.current = true;
      // Use explicit value if provided (for combobox/select option clicks),
      // otherwise fall back to current editValue state
      const finalValue = cancelled ? originalEditValue : (explicitValue ?? editValue);
      setInternalEditingCellId(null);
      setEditingColId(null);
      setComboboxExpanded(false);
      setComboboxActiveIndex(-1);
      onEditEnd?.(cellId, finalValue, cancelled);

      // Focus back to cell
      const cellEl = cellRefs.current.get(cellId);
      if (cellEl) {
        cellEl.focus();
      }

      // Reset the flag after the current event loop
      setTimeout(() => {
        isEndingEditRef.current = false;
      }, 0);
    },
    [editValue, originalEditValue, onEditEnd, internalEditingCellId]
  );

  // ==========================================================================
  // Keyboard Handling - Header
  // ==========================================================================

  const handleHeaderKeyDown = useCallback(
    (event: React.KeyboardEvent, column: DataGridColumnDef) => {
      const pos = getItemPosition(`header-${column.id}`);
      if (!pos) return;

      const { colIndex } = pos;
      const { key, ctrlKey, shiftKey } = event;

      let handled = true;

      switch (key) {
        case 'ArrowRight': {
          // colIndex includes colOffset, so we need to adjust for columns array access
          const colOffset = rowSelectable ? 1 : 0;
          // Find next sortable header or wrap to data if none
          let nextColIdx = colIndex - colOffset + 1;
          while (nextColIdx < columns.length) {
            if (columns[nextColIdx].sortable) {
              focusItem(`header-${columns[nextColIdx].id}`);
              return (event.preventDefault(), event.stopPropagation());
            }
            nextColIdx++;
          }
          // No more sortable headers to the right, stay at current
          handled = false;
          break;
        }
        case 'ArrowLeft': {
          // colIndex includes colOffset, so we need to adjust for columns array access
          const colOffset = rowSelectable ? 1 : 0;
          let prevColIdx = colIndex - colOffset - 1;
          while (prevColIdx >= 0) {
            if (columns[prevColIdx].sortable) {
              focusItem(`header-${columns[prevColIdx].id}`);
              return (event.preventDefault(), event.stopPropagation());
            }
            prevColIdx--;
          }
          // No more sortable headers to the left, try header checkbox
          if (rowMultiselectable) {
            focusItem('header-checkbox');
            break;
          }
          handled = false;
          break;
        }
        case 'ArrowDown': {
          // Move to first data row, same column
          // colIndex includes colOffset, but rows[].cells[] doesn't include checkbox column
          const colOffset = rowSelectable ? 1 : 0;
          const cellColIndex = colIndex - colOffset;
          const firstRowCell = rows[0]?.cells[cellColIndex];
          if (firstRowCell) {
            focusItem(firstRowCell.id);
          }
          break;
        }
        case 'Home': {
          if (ctrlKey) {
            // Ctrl+Home: Go to first sortable header or first cell
            const firstSortable = columns.find((col) => col.sortable);
            if (firstSortable) {
              focusItem(`header-${firstSortable.id}`);
            } else {
              const firstCell = rows[0]?.cells[0];
              if (firstCell) focusItem(firstCell.id);
            }
          } else {
            // Home: First sortable header in row
            const firstSortable = columns.find((col) => col.sortable);
            if (firstSortable) {
              focusItem(`header-${firstSortable.id}`);
            }
          }
          break;
        }
        case 'End': {
          if (ctrlKey) {
            // Ctrl+End: Go to last cell in grid
            const lastRow = rows[rows.length - 1];
            const lastCell = lastRow?.cells[lastRow.cells.length - 1];
            if (lastCell) focusItem(lastCell.id);
          } else {
            // End: Last sortable header in row
            const lastSortable = [...columns].reverse().find((col) => col.sortable);
            if (lastSortable) {
              focusItem(`header-${lastSortable.id}`);
            }
          }
          break;
        }
        case 'Enter':
        case ' ': {
          if (column.sortable) {
            handleSort(column.id);
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
    [columns, rows, getItemPosition, focusItem, handleSort, rowMultiselectable]
  );

  // ==========================================================================
  // Keyboard Handling - Header Checkbox Cell
  // ==========================================================================

  const handleHeaderCheckboxKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key, ctrlKey } = event;
      let handled = true;

      switch (key) {
        case 'ArrowRight': {
          // Move to first sortable header if exists
          const firstSortable = columns.find((col) => col.sortable);
          if (firstSortable) {
            focusItem(`header-${firstSortable.id}`);
          }
          break;
        }
        case 'ArrowLeft': {
          // Already at leftmost position
          handled = false;
          break;
        }
        case 'ArrowDown': {
          // Move to first data row checkbox
          if (rows[0]) {
            focusItem(`checkbox-${rows[0].id}`);
          }
          break;
        }
        case 'ArrowUp': {
          // Already at top row
          handled = false;
          break;
        }
        case 'Home': {
          // Already at home position for header row
          if (ctrlKey) {
            // Stay at current position (first cell in grid)
          }
          break;
        }
        case 'End': {
          if (ctrlKey) {
            // Go to last cell in grid
            const lastRow = rows[rows.length - 1];
            const lastCell = lastRow?.cells[lastRow.cells.length - 1];
            if (lastCell) focusItem(lastCell.id);
          } else {
            // Go to last sortable header or stay
            const lastSortable = [...columns].reverse().find((col) => col.sortable);
            if (lastSortable) {
              focusItem(`header-${lastSortable.id}`);
            }
          }
          break;
        }
        case ' ':
        case 'Enter': {
          toggleAllRowSelection();
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
    [columns, rows, focusItem, toggleAllRowSelection]
  );

  // ==========================================================================
  // Keyboard Handling - Cell
  // ==========================================================================

  const handleCellKeyDown = useCallback(
    (event: React.KeyboardEvent, cell: DataGridCellData, rowId: string, colId: string) => {
      // If in edit mode, handle differently
      if (editingCellId === cell.id) {
        if (event.key === 'Escape') {
          event.preventDefault();
          event.stopPropagation();
          endEdit(cell.id, true);
        }
        // Let other keys work normally in input
        return;
      }

      const pos = getItemPosition(cell.id);
      if (!pos) return;

      const { rowIndex, colIndex } = pos;
      const { key, ctrlKey, shiftKey } = event;

      let handled = true;

      switch (key) {
        case 'ArrowRight': {
          if (shiftKey && enableRangeSelection) {
            const next = findNextFocusable(rowIndex, colIndex, 'right');
            if (next) {
              focusItem(next.id);
              extendRangeSelection(cell.id, next.id);
            }
          } else {
            const next = findNextFocusable(rowIndex, colIndex, 'right');
            if (next) {
              focusItem(next.id);
              setAnchorCellId(null);
            }
          }
          break;
        }
        case 'ArrowLeft': {
          if (shiftKey && enableRangeSelection) {
            const next = findNextFocusable(rowIndex, colIndex, 'left');
            if (next) {
              focusItem(next.id);
              extendRangeSelection(cell.id, next.id);
            }
          } else {
            const next = findNextFocusable(rowIndex, colIndex, 'left');
            if (next) {
              focusItem(next.id);
              setAnchorCellId(null);
            }
          }
          break;
        }
        case 'ArrowDown': {
          if (shiftKey && enableRangeSelection) {
            const next = findNextFocusable(rowIndex, colIndex, 'down');
            if (next) {
              focusItem(next.id);
              extendRangeSelection(cell.id, next.id);
            }
          } else {
            const next = findNextFocusable(rowIndex, colIndex, 'down');
            if (next) {
              focusItem(next.id);
              setAnchorCellId(null);
            }
          }
          break;
        }
        case 'ArrowUp': {
          if (shiftKey && enableRangeSelection) {
            const next = findNextFocusable(rowIndex, colIndex, 'up');
            if (next) {
              focusItem(next.id);
              extendRangeSelection(cell.id, next.id);
            }
          } else {
            const next = findNextFocusable(rowIndex, colIndex, 'up');
            if (next) {
              focusItem(next.id);
              setAnchorCellId(null);
            }
          }
          break;
        }
        case 'Home': {
          if (ctrlKey && shiftKey && enableRangeSelection) {
            // Ctrl+Shift+Home: extend selection to grid start
            const firstCell = rows[0]?.cells[0];
            if (firstCell) {
              focusItem(firstCell.id);
              extendRangeSelection(cell.id, firstCell.id);
            }
          } else if (ctrlKey) {
            // Ctrl+Home: Go to first cell in grid
            const firstCell = rows[0]?.cells[0];
            if (firstCell) {
              focusItem(firstCell.id);
              setAnchorCellId(null);
            }
          } else if (shiftKey && enableRangeSelection) {
            // Shift+Home: extend selection to row start
            const firstCellInRow = rows[rowIndex]?.cells[0];
            if (firstCellInRow) {
              focusItem(firstCellInRow.id);
              extendRangeSelection(cell.id, firstCellInRow.id);
            }
          } else {
            // Home: Go to first cell in row
            const firstCellInRow = rows[rowIndex]?.cells[0];
            if (firstCellInRow) {
              focusItem(firstCellInRow.id);
              setAnchorCellId(null);
            }
          }
          break;
        }
        case 'End': {
          const currentRow = rows[rowIndex];
          const lastRow = rows[rows.length - 1];

          if (ctrlKey && shiftKey && enableRangeSelection) {
            // Ctrl+Shift+End: extend selection to grid end
            const lastCell = lastRow?.cells[lastRow.cells.length - 1];
            if (lastCell) {
              focusItem(lastCell.id);
              extendRangeSelection(cell.id, lastCell.id);
            }
          } else if (ctrlKey) {
            // Ctrl+End: Go to last cell in grid
            const lastCell = lastRow?.cells[lastRow.cells.length - 1];
            if (lastCell) {
              focusItem(lastCell.id);
              setAnchorCellId(null);
            }
          } else if (shiftKey && enableRangeSelection) {
            // Shift+End: extend selection to row end
            const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
            if (lastCellInRow) {
              focusItem(lastCellInRow.id);
              extendRangeSelection(cell.id, lastCellInRow.id);
            }
          } else {
            // End: Go to last cell in row
            const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
            if (lastCellInRow) {
              focusItem(lastCellInRow.id);
              setAnchorCellId(null);
            }
          }
          break;
        }
        case 'PageDown': {
          if (enablePageNavigation) {
            const targetRowIndex = Math.min(rowIndex + pageSize, rows.length - 1);
            const targetCell = rows[targetRowIndex]?.cells[colIndex];
            if (targetCell) {
              focusItem(targetCell.id);
              setAnchorCellId(null);
            }
          } else {
            handled = false;
          }
          break;
        }
        case 'PageUp': {
          if (enablePageNavigation) {
            const targetRowIndex = Math.max(rowIndex - pageSize, 0);
            const targetCell = rows[targetRowIndex]?.cells[colIndex];
            if (targetCell) {
              focusItem(targetCell.id);
              setAnchorCellId(null);
            }
          } else {
            handled = false;
          }
          break;
        }
        case ' ': {
          if (selectable) {
            toggleSelection(cell.id, cell);
          }
          break;
        }
        case 'Enter': {
          if (editable && isCellEditable(cell, colId) && !cell.disabled) {
            startEdit(cell.id, rowId, colId);
          } else if (!cell.disabled) {
            onCellActivate?.(cell.id, rowId, colId);
          }
          break;
        }
        case 'F2': {
          if (editable && isCellEditable(cell, colId) && !cell.disabled) {
            startEdit(cell.id, rowId, colId);
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
      editingCellId,
      endEdit,
      getItemPosition,
      findNextFocusable,
      focusItem,
      enableRangeSelection,
      extendRangeSelection,
      rows,
      enablePageNavigation,
      pageSize,
      selectable,
      toggleSelection,
      editable,
      isCellEditable,
      startEdit,
      onCellActivate,
      selectAll,
    ]
  );

  // ==========================================================================
  // Keyboard Handling - Checkbox Cell
  // ==========================================================================

  const handleCheckboxCellKeyDown = useCallback(
    (event: React.KeyboardEvent, rowId: string, row: DataGridRowData) => {
      const checkboxCellId = `checkbox-${rowId}`;
      const pos = getItemPosition(checkboxCellId);
      if (!pos) return;

      const { rowIndex, colIndex } = pos;
      const { key, ctrlKey } = event;

      let handled = true;

      switch (key) {
        case 'ArrowRight': {
          const next = findNextFocusable(rowIndex, colIndex, 'right');
          if (next) {
            focusItem(next.id);
          }
          break;
        }
        case 'ArrowLeft': {
          const next = findNextFocusable(rowIndex, colIndex, 'left');
          if (next) {
            focusItem(next.id);
          }
          break;
        }
        case 'ArrowDown': {
          const next = findNextFocusable(rowIndex, colIndex, 'down');
          if (next) {
            focusItem(next.id);
          }
          break;
        }
        case 'ArrowUp': {
          const next = findNextFocusable(rowIndex, colIndex, 'up');
          if (next) {
            focusItem(next.id);
          }
          break;
        }
        case 'Home': {
          if (ctrlKey) {
            // Ctrl+Home: Go to first cell in grid (first checkbox cell)
            const firstCheckboxId = `checkbox-${rows[0]?.id}`;
            if (firstCheckboxId) {
              focusItem(firstCheckboxId);
            }
          } else {
            // Home: Stay on checkbox (it's the first cell in the row)
            // Do nothing, already at home position
          }
          break;
        }
        case 'End': {
          const currentRow = rows[rowIndex];
          const lastRow = rows[rows.length - 1];

          if (ctrlKey) {
            // Ctrl+End: Go to last cell in grid
            const lastCell = lastRow?.cells[lastRow.cells.length - 1];
            if (lastCell) {
              focusItem(lastCell.id);
            }
          } else {
            // End: Go to last cell in row
            const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
            if (lastCellInRow) {
              focusItem(lastCellInRow.id);
            }
          }
          break;
        }
        case ' ':
        case 'Enter': {
          // Toggle row selection
          if (!row.disabled) {
            toggleRowSelection(rowId, row);
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
    [getItemPosition, findNextFocusable, focusItem, rows, toggleRowSelection]
  );

  // ==========================================================================
  // Effects
  // ==========================================================================

  // Focus input/select when entering edit mode
  useEffect(() => {
    if (editingCellId && editingColId) {
      const editType = getColumnEditType(editingColId);
      if (editType === 'select' && selectRef.current) {
        selectRef.current.focus();
      } else if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [editingCellId, editingColId, getColumnEditType]);

  // Focus the focused cell when focusedId changes externally
  useEffect(() => {
    if (focusedId && !editingCellId) {
      const item = itemById.get(focusedId);
      if (item) {
        if (item.type === 'header') {
          const headerEl = headerRefs.current.get(item.columnId!);
          if (headerEl && document.activeElement !== headerEl) {
            if (gridRef.current?.contains(document.activeElement)) {
              headerEl.focus();
            }
          }
        } else {
          const cellEl = cellRefs.current.get(focusedId);
          if (cellEl && document.activeElement !== cellEl) {
            if (gridRef.current?.contains(document.activeElement)) {
              cellEl.focus();
            }
          }
        }
      }
    }
  }, [focusedId, editingCellId, itemById]);

  // ==========================================================================
  // Render
  // ==========================================================================

  // Determine aria-multiselectable
  const showMultiselectable = rowMultiselectable || multiselectable;

  // CSS variable for grid column count
  const gridStyle = {
    '--apg-data-grid-columns': columns.length,
  } as React.CSSProperties;

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      aria-multiselectable={showMultiselectable ? 'true' : undefined}
      aria-readonly={readonly ? 'true' : undefined}
      aria-rowcount={totalRows}
      aria-colcount={totalColumns}
      className={`apg-data-grid ${className ?? ''}`}
      style={gridStyle}
    >
      {/* Header Row */}
      <div role="row" aria-rowindex={totalRows ? 1 : undefined}>
        {rowSelectable &&
          (() => {
            const isHeaderCheckboxFocused = focusedId === 'header-checkbox';
            return (
              <div
                ref={(el) => {
                  if (el) {
                    cellRefs.current.set('header-checkbox', el);
                  } else {
                    cellRefs.current.delete('header-checkbox');
                  }
                }}
                role="columnheader"
                tabIndex={rowMultiselectable ? (isHeaderCheckboxFocused ? 0 : -1) : undefined}
                aria-colindex={totalColumns ? startColIndex : undefined}
                className={`apg-data-grid-header apg-data-grid-checkbox-cell ${isHeaderCheckboxFocused ? 'focused' : ''}`}
                onKeyDown={rowMultiselectable ? handleHeaderCheckboxKeyDown : undefined}
                onFocus={() => rowMultiselectable && setFocusedId('header-checkbox')}
              >
                {rowMultiselectable && (
                  <input
                    type="checkbox"
                    tabIndex={-1}
                    checked={getSelectAllState() === 'all'}
                    ref={(el) => {
                      if (el) {
                        el.indeterminate = getSelectAllState() === 'some';
                      }
                    }}
                    aria-label="Select all rows"
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleAllRowSelection();
                    }}
                  />
                )}
              </div>
            );
          })()}
        {columns.map((col, colIndex) => {
          const isSortable = col.sortable;
          const headerId = `header-${col.id}`;
          const isFocused = focusedId === headerId;

          return (
            <div
              key={col.id}
              ref={(el) => {
                if (el) {
                  headerRefs.current.set(col.id, el);
                } else {
                  headerRefs.current.delete(col.id);
                }
              }}
              role="columnheader"
              tabIndex={isSortable ? (isFocused ? 0 : -1) : undefined}
              aria-colindex={
                totalColumns ? startColIndex + colIndex + (rowSelectable ? 1 : 0) : undefined
              }
              aria-colspan={col.colspan}
              aria-sort={isSortable ? col.sortDirection || 'none' : undefined}
              onKeyDown={(e) => isSortable && handleHeaderKeyDown(e, col)}
              onFocus={() => isSortable && setFocusedId(headerId)}
              onClick={() => isSortable && handleSort(col.id)}
              className={`apg-data-grid-header ${isSortable ? 'sortable' : ''} ${isFocused ? 'focused' : ''}`}
            >
              {col.header}
              {isSortable && (
                <span
                  aria-hidden="true"
                  className={`sort-indicator ${!col.sortDirection || col.sortDirection === 'none' ? 'unsorted' : ''}`}
                >
                  {getSortIndicator(col.sortDirection)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Data Rows */}
      {rows.map((row, rowIndex) => {
        const isRowSelected = selectedRowIds.includes(row.id);
        const isRowDisabled = row.disabled;

        return (
          <div
            key={row.id}
            role="row"
            aria-rowindex={totalRows ? startRowIndex + rowIndex + 1 : undefined}
            aria-selected={rowSelectable ? (isRowSelected ? 'true' : 'false') : undefined}
            aria-disabled={isRowDisabled ? 'true' : undefined}
          >
            {/* Row selection checkbox */}
            {rowSelectable &&
              (() => {
                const checkboxCellId = `checkbox-${row.id}`;
                const isCheckboxFocused = focusedId === checkboxCellId;
                return (
                  <div
                    ref={(el) => {
                      if (el) {
                        cellRefs.current.set(checkboxCellId, el);
                      } else {
                        cellRefs.current.delete(checkboxCellId);
                      }
                    }}
                    role="gridcell"
                    tabIndex={isCheckboxFocused ? 0 : -1}
                    aria-colindex={totalColumns ? startColIndex : undefined}
                    className={`apg-data-grid-cell apg-data-grid-checkbox-cell ${isCheckboxFocused ? 'focused' : ''}`}
                    onKeyDown={(e) => handleCheckboxCellKeyDown(e, row.id, row)}
                    onFocus={() => setFocusedId(checkboxCellId)}
                  >
                    <input
                      type="checkbox"
                      tabIndex={-1}
                      checked={isRowSelected}
                      disabled={isRowDisabled}
                      aria-labelledby={
                        rowLabelColumn ? `cell-${row.id}-${rowLabelColumn.id}` : undefined
                      }
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleRowSelection(row.id, row);
                      }}
                    />
                  </div>
                );
              })()}

            {/* Data cells */}
            {row.cells.map((cell, colIndex) => {
              const isRowHeader = row.hasRowHeader && colIndex === 0;
              const cellId = cell.id;
              const isFocused = focusedId === cellId;
              const isCellSelected = selectedIds.includes(cellId);
              const colId = columns[colIndex]?.id ?? '';
              const isDisabled = cell.disabled || isRowDisabled;
              const isEditing = editingCellId === cellId;
              const cellIsEditable = editable && isCellEditable(cell, colId) && !isDisabled;
              const editType = getColumnEditType(colId);
              const columnOptions = getColumnOptions(colId);

              // Determine aria-readonly for this cell
              // APG: In editable grids, non-editable cells should have aria-readonly="true"
              const getAriaReadonly = (): 'true' | 'false' | undefined => {
                if (!editable) return undefined;
                if (cell.readonly === true) return 'true';
                if (cellIsEditable) return 'false';
                return 'true'; // Non-editable cell in editable grid
              };
              const showAriaReadonly = getAriaReadonly();

              // Generate id for label column cell to be referenced by row checkbox aria-labelledby
              const isLabelColumn = rowLabelColumn && colId === rowLabelColumn.id;
              const labelCellId = isLabelColumn ? `cell-${row.id}-${colId}` : undefined;

              // Unique IDs for combobox ARIA
              const comboboxListId = `${cellId}-listbox`;

              // Render edit content based on editType
              const renderEditContent = () => {
                if (editType === 'select') {
                  return (
                    <select
                      ref={selectRef}
                      value={editValue}
                      onChange={(e) => {
                        const newValue = e.target.value;
                        setEditValue(newValue);
                        onCellValueChange?.(cellId, newValue);
                        // End edit immediately with explicit value
                        endEdit(cellId, false, newValue);
                      }}
                      onBlur={() => endEdit(cellId, false)}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          e.preventDefault();
                          e.stopPropagation();
                          endEdit(cellId, true);
                        } else if (e.key === 'Enter') {
                          e.preventDefault();
                          e.stopPropagation();
                          endEdit(cellId, false);
                        }
                      }}
                      className="apg-data-grid-select"
                    >
                      {columnOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  );
                }

                if (editType === 'combobox') {
                  return (
                    <div className="apg-data-grid-combobox">
                      <input
                        ref={inputRef}
                        type="text"
                        role="combobox"
                        aria-expanded={comboboxExpanded}
                        aria-controls={comboboxListId}
                        aria-autocomplete="list"
                        aria-activedescendant={
                          comboboxActiveIndex >= 0
                            ? `${cellId}-option-${comboboxActiveIndex}`
                            : undefined
                        }
                        value={editValue}
                        onChange={(e) => {
                          const newValue = e.target.value;
                          setEditValue(newValue);
                          onCellValueChange?.(cellId, newValue);
                          // Filter options based on input
                          const filtered = columnOptions.filter((opt) =>
                            opt.toLowerCase().includes(newValue.toLowerCase())
                          );
                          setFilteredOptions(filtered);
                          setComboboxExpanded(true);
                          setComboboxActiveIndex(-1);
                        }}
                        onBlur={(e) => {
                          // Check if focus is moving to listbox
                          if (listboxRef.current?.contains(e.relatedTarget as Node)) {
                            return;
                          }
                          setComboboxExpanded(false);
                          endEdit(cellId, false);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            e.preventDefault();
                            e.stopPropagation();
                            setComboboxExpanded(false);
                            endEdit(cellId, true);
                          } else if (e.key === 'Enter') {
                            e.preventDefault();
                            e.stopPropagation();
                            const selectedOption =
                              comboboxActiveIndex >= 0
                                ? filteredOptions[comboboxActiveIndex]
                                : undefined;
                            if (selectedOption) {
                              setEditValue(selectedOption);
                              onCellValueChange?.(cellId, selectedOption);
                            }
                            setComboboxExpanded(false);
                            endEdit(cellId, false, selectedOption);
                          } else if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            if (!comboboxExpanded) {
                              setComboboxExpanded(true);
                            } else {
                              setComboboxActiveIndex((prev) =>
                                Math.min(prev + 1, filteredOptions.length - 1)
                              );
                            }
                          } else if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            setComboboxActiveIndex((prev) => Math.max(prev - 1, -1));
                          }
                        }}
                        className="apg-data-grid-input"
                      />
                      {comboboxExpanded && filteredOptions.length > 0 && (
                        <ul
                          ref={listboxRef}
                          id={comboboxListId}
                          role="listbox"
                          className="apg-data-grid-listbox"
                        >
                          {filteredOptions.map((option, index) => (
                            <li
                              key={option}
                              id={`${cellId}-option-${index}`}
                              role="option"
                              aria-selected={index === comboboxActiveIndex}
                              className={`apg-data-grid-option ${index === comboboxActiveIndex ? 'active' : ''}`}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setEditValue(option);
                                onCellValueChange?.(cellId, option);
                                setComboboxExpanded(false);
                                endEdit(cellId, false, option);
                              }}
                            >
                              {option}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                }

                // Default: text input
                return (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => {
                      setEditValue(e.target.value);
                      onCellValueChange?.(cellId, e.target.value);
                    }}
                    onBlur={() => endEdit(cellId, false)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        e.stopPropagation();
                        endEdit(cellId, true);
                      } else if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        endEdit(cellId, false);
                      }
                    }}
                    className="apg-data-grid-input"
                  />
                );
              };

              return (
                <div
                  key={cellId}
                  id={labelCellId}
                  ref={(el) => {
                    if (el) {
                      cellRefs.current.set(cellId, el);
                    } else {
                      cellRefs.current.delete(cellId);
                    }
                  }}
                  role={isRowHeader ? 'rowheader' : 'gridcell'}
                  tabIndex={isFocused && !isEditing ? 0 : -1}
                  aria-selected={
                    selectable && !rowSelectable ? (isCellSelected ? 'true' : 'false') : undefined
                  }
                  aria-disabled={isDisabled ? 'true' : undefined}
                  aria-colindex={
                    totalColumns ? startColIndex + colIndex + (rowSelectable ? 1 : 0) : undefined
                  }
                  aria-colspan={cell.colspan}
                  aria-rowspan={cell.rowspan}
                  aria-readonly={showAriaReadonly}
                  onKeyDown={(e) => handleCellKeyDown(e, cell, row.id, colId)}
                  onFocus={() => !isEditing && setFocusedId(cellId)}
                  onDoubleClick={() => cellIsEditable && startEdit(cellId, row.id, colId)}
                  className={`apg-data-grid-cell ${isFocused ? 'focused' : ''} ${isCellSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''} ${isEditing ? 'editing' : ''} ${cellIsEditable && !isEditing ? 'editable' : ''}`}
                >
                  {(() => {
                    if (isEditing) return renderEditContent();
                    if (renderCell) return renderCell(cell, row.id, colId);
                    return cell.value;
                  })()}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default DataGrid;
