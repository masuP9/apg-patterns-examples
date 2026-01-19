<script lang="ts">
  import { SvelteMap } from 'svelte/reactivity';

  // =============================================================================
  // Types
  // =============================================================================

  export type SortDirection = 'ascending' | 'descending' | 'none' | 'other';
  export type EditType = 'text' | 'select' | 'combobox';

  // =============================================================================
  // Helper Functions
  // =============================================================================

  /** Get sort indicator character based on sort direction */
  function getSortIndicator(direction?: SortDirection): string {
    if (direction === 'ascending') return '▲';
    if (direction === 'descending') return '▼';
    return '⇅';
  }

  /** Get aria-readonly value for a cell in editable grid */
  function getAriaReadonly(
    gridEditable: boolean,
    cellReadonly: boolean | undefined,
    cellEditable: boolean
  ): 'true' | 'false' | undefined {
    if (!gridEditable) return undefined;
    if (cellReadonly === true) return 'true';
    if (cellEditable) return 'false';
    return 'true'; // Non-editable cell in editable grid
  }

  /** Get aria-selected value for a cell */
  function getAriaSelected(
    isSelectable: boolean,
    isRowSelectable: boolean,
    isSelected: boolean
  ): 'true' | 'false' | undefined {
    if (!isSelectable) return undefined;
    if (isRowSelectable) return undefined; // Row selection takes precedence
    return isSelected ? 'true' : 'false';
  }

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

  interface Props {
    columns: DataGridColumnDef[];
    rows: DataGridRowData[];
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
    // Cell selection (from Grid)
    selectable?: boolean;
    multiselectable?: boolean;
    selectedIds?: string[];
    defaultSelectedIds?: string[];
    onSelectionChange?: (selectedIds: string[]) => void;
    // Virtualization
    totalColumns?: number;
    totalRows?: number;
    startRowIndex?: number;
    startColIndex?: number;
    // Behavior
    wrapNavigation?: boolean;
    enablePageNavigation?: boolean;
    pageSize?: number;
    // Callbacks
    onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
    renderCell?: (cell: DataGridCellData, rowId: string, colId: string) => string | number;
    className?: string;
  }

  // =============================================================================
  // Props
  // =============================================================================

  let {
    columns,
    rows,
    ariaLabel,
    ariaLabelledby,
    // Row Selection
    rowSelectable = false,
    rowMultiselectable = false,
    selectedRowIds: controlledSelectedRowIds,
    defaultSelectedRowIds = [],
    onRowSelectionChange,
    // Sorting
    onSort,
    // Range Selection
    enableRangeSelection = false,
    onRangeSelect,
    // Cell Editing
    editable = false,
    readonly = false,
    editingCellId: controlledEditingCellId,
    onEditStart,
    onEditEnd,
    onCellValueChange,
    // Focus
    focusedId: controlledFocusedId,
    defaultFocusedId,
    onFocusChange,
    // Cell selection
    selectable = false,
    multiselectable = false,
    selectedIds: controlledSelectedIds,
    defaultSelectedIds = [],
    onSelectionChange,
    // Virtualization
    totalColumns,
    totalRows,
    startRowIndex = 1,
    startColIndex = 1,
    // Behavior
    wrapNavigation = false,
    enablePageNavigation = false,
    pageSize = 5,
    // Callbacks
    onCellActivate,
    renderCell,
    className = '',
  }: Props = $props();

  // =============================================================================
  // State
  // =============================================================================

  let internalSelectedIds = $state<string[]>([]);
  let internalSelectedRowIds = $state<string[]>([]);
  let focusedIdState = $state<string | null>(null);
  let internalEditingCellId = $state<string | null>(null);
  let editValue = $state<string>('');
  let originalEditValue = $state<string>('');
  let anchorCellId = $state<string | null>(null);
  let initialized = $state(false);
  let isEndingEdit = $state(false);

  let gridRef: HTMLDivElement | null = $state(null);
  let cellRefs: Map<string, HTMLDivElement> = new SvelteMap();
  let headerRefs: Map<string, HTMLDivElement> = new SvelteMap();
  let inputRef: HTMLInputElement | null = $state(null);
  let selectRef: HTMLSelectElement | null = $state(null);
  let listboxRef: HTMLUListElement | null = $state(null);

  // Combobox state
  let comboboxExpanded = $state(false);
  let comboboxActiveIndex = $state(-1);
  let filteredOptions = $state<string[]>([]);

  // =============================================================================
  // Derived Values
  // =============================================================================

  const selectedIds = $derived(controlledSelectedIds ?? internalSelectedIds);
  const selectedRowIds = $derived(controlledSelectedRowIds ?? internalSelectedRowIds);
  const editingCellId = $derived(controlledEditingCellId ?? internalEditingCellId);
  const isEditing = $derived(editingCellId !== null);

  // Check if header row has focusable items (sortable headers OR header checkbox)
  const hasHeaderFocusable = $derived(
    columns.some((col) => col.sortable) || (rowSelectable && rowMultiselectable)
  );

  // Get all focusable cells and headers
  const focusableItems = $derived.by(() => {
    const items: {
      id: string;
      type: 'header' | 'cell' | 'checkbox' | 'header-checkbox';
      rowIndex: number;
      colIndex: number;
      rowId?: string;
      disabled?: boolean;
    }[] = [];

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

    // Add sortable column headers
    columns.forEach((col, colIndex) => {
      if (col.sortable) {
        items.push({
          id: `header-${col.id}`,
          type: 'header',
          rowIndex: -1,
          colIndex: colIndex + colOffset,
        });
      }
    });

    // Add checkbox cells and data cells
    rows.forEach((row, rowIndex) => {
      // Add checkbox cell if row selectable
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

      // Add data cells
      row.cells.forEach((cell, colIndex) => {
        items.push({
          id: cell.id,
          type: 'cell',
          rowIndex,
          colIndex: colIndex + colOffset,
        });
      });
    });

    return items;
  });

  // Get first focusable id based on row selection mode
  // rowMultiselectable: header checkbox cell is first (Select all rows)
  // rowSelectable only: first row's checkbox cell
  // Otherwise: first data cell
  // Note: Sortable headers are focusable via arrow navigation but not the initial Tab stop
  const getFirstFocusableId = $derived.by(() => {
    if (defaultFocusedId) return defaultFocusedId;
    if (rowSelectable && rowMultiselectable) {
      return 'header-checkbox';
    }
    if (rowSelectable) {
      return rows[0] ? `checkbox-${rows[0].id}` : null;
    }
    return rows[0]?.cells[0]?.id ?? null;
  });

  const focusedId = $derived.by(() => {
    if (controlledFocusedId !== undefined) {
      return controlledFocusedId;
    }
    if (focusedIdState) {
      return focusedIdState;
    }
    return defaultFocusedId ?? getFirstFocusableId;
  });

  // Map cellId to cell info for O(1) lookup
  const cellById = $derived.by(() => {
    const map = new SvelteMap<
      string,
      { rowIndex: number; colIndex: number; cell: DataGridCellData; rowId: string }
    >();
    rows.forEach((row, rowIndex) => {
      row.cells.forEach((cell, colIndex) => {
        map.set(cell.id, { rowIndex, colIndex, cell, rowId: row.id });
      });
    });
    return map;
  });

  // Determine if we need checkbox column
  const hasCheckboxColumn = $derived(rowSelectable);

  // Find the column that provides row labels (for aria-labelledby on row checkboxes)
  // Priority: 1. Column with isRowLabel: true, 2. First column (fallback)
  const rowLabelColumn = $derived.by(() => {
    const labelColumn = columns.find((col) => col.isRowLabel);
    return labelColumn ?? columns[0];
  });

  // Determine aria-multiselectable value
  const ariaMultiselectable = $derived.by(() => {
    if (rowSelectable && rowMultiselectable) return 'true';
    if (selectable && multiselectable) return 'true';
    return undefined;
  });

  // Effective column count including checkbox
  const effectiveColCount = $derived(hasCheckboxColumn ? columns.length + 1 : columns.length);

  // =============================================================================
  // Initialize
  // =============================================================================

  $effect(() => {
    if (!initialized && rows.length > 0) {
      internalSelectedIds = defaultSelectedIds ? [...defaultSelectedIds] : [];
      internalSelectedRowIds = defaultSelectedRowIds ? [...defaultSelectedRowIds] : [];
      initialized = true;
    }
  });

  // Set tabindex="-1" on all focusable elements inside grid cells
  $effect(() => {
    if (gridRef && rows.length > 0 && !isEditing) {
      const focusableElements = gridRef.querySelectorAll<HTMLElement>(
        '[role="gridcell"] a[href], [role="gridcell"] button:not(.apg-data-grid-checkbox-cell button), [role="rowheader"] a[href], [role="rowheader"] button'
      );
      focusableElements.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
    }
  });

  // Focus input/select when editing starts
  $effect(() => {
    if (isEditing) {
      if (inputRef) {
        inputRef.focus();
        inputRef.select();
      } else if (selectRef) {
        selectRef.focus();
      }
    }
  });

  // =============================================================================
  // Actions
  // =============================================================================

  function registerCell(node: HTMLDivElement, cellId: string) {
    cellRefs.set(cellId, node);
    return {
      destroy() {
        cellRefs.delete(cellId);
      },
    };
  }

  function registerHeader(node: HTMLDivElement, headerId: string) {
    headerRefs.set(headerId, node);
    return {
      destroy() {
        headerRefs.delete(headerId);
      },
    };
  }

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
      const focusableChild = cellEl.querySelector<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableChild) {
        focusableChild.setAttribute('tabindex', '-1');
        focusableChild.focus();
      } else {
        cellEl.focus();
      }
      setFocusedId(cellId);
    }
  }

  function focusHeader(headerId: string) {
    const headerEl = headerRefs.get(headerId);
    if (headerEl) {
      headerEl.focus();
      setFocusedId(headerId);
    }
  }

  function focusCheckboxCell(checkboxId: string) {
    const cellEl = cellRefs.get(checkboxId);
    if (cellEl) {
      cellEl.focus();
      setFocusedId(checkboxId);
    }
  }

  function getItemAt(rowIndex: number, colIndex: number) {
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
  }

  function focusHeaderCheckboxCell() {
    const cellEl = cellRefs.get('header-checkbox');
    if (cellEl) {
      cellEl.focus();
      setFocusedId('header-checkbox');
    }
  }

  function findNextFocusableCell(
    startRow: number,
    startCol: number,
    direction: 'right' | 'left' | 'up' | 'down',
    skipDisabled = true
  ): { rowIndex: number; colIndex: number; cell: DataGridCellData } | null {
    const colCount = columns.length + (rowSelectable ? 1 : 0);
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

  // Cell selection
  function setSelectedIds(ids: string[]) {
    internalSelectedIds = ids;
    onSelectionChange?.(ids);
  }

  function toggleCellSelection(cellId: string, cell: DataGridCellData) {
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

  function selectAllCells() {
    if (!selectable || !multiselectable) {
      return;
    }

    const allIds = Array.from(cellById.values())
      .filter(({ cell }) => !cell.disabled)
      .map(({ cell }) => cell.id);
    setSelectedIds(allIds);
  }

  // Row selection
  function setSelectedRowIds(ids: string[]) {
    internalSelectedRowIds = ids;
    onRowSelectionChange?.(ids);
  }

  function toggleRowSelection(rowId: string, row: DataGridRowData) {
    if (!rowSelectable || row.disabled) {
      return;
    }

    if (rowMultiselectable) {
      const newIds = selectedRowIds.includes(rowId)
        ? selectedRowIds.filter((id) => id !== rowId)
        : [...selectedRowIds, rowId];
      setSelectedRowIds(newIds);
    } else {
      const newIds = selectedRowIds.includes(rowId) ? [] : [rowId];
      setSelectedRowIds(newIds);
    }
  }

  function toggleAllRowSelection() {
    if (!rowSelectable || !rowMultiselectable) {
      return;
    }

    const allRowIds = rows.filter((r) => !r.disabled).map((r) => r.id);
    const allSelected = allRowIds.every((id) => selectedRowIds.includes(id));

    if (allSelected) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(allRowIds);
    }
  }

  function getSelectAllState(): 'all' | 'some' | 'none' {
    const allRowIds = rows.filter((r) => !r.disabled).map((r) => r.id);
    if (allRowIds.length === 0) return 'none';

    const selectedCount = allRowIds.filter((id) => selectedRowIds.includes(id)).length;
    if (selectedCount === 0) return 'none';
    if (selectedCount === allRowIds.length) return 'all';
    return 'some';
  }

  // Sorting
  function cycleSort(columnId: string, currentDirection: SortDirection = 'none') {
    let nextDirection: SortDirection;
    switch (currentDirection) {
      case 'none':
        nextDirection = 'ascending';
        break;
      case 'ascending':
        nextDirection = 'descending';
        break;
      case 'descending':
        nextDirection = 'ascending';
        break;
      default:
        nextDirection = 'ascending';
    }
    onSort?.(columnId, nextDirection);
  }

  // Range selection
  function getCellsInRange(startCellId: string, endCellId: string): string[] {
    const startPos = getCellPosition(startCellId);
    const endPos = getCellPosition(endCellId);
    if (!startPos || !endPos) return [];

    const minRow = Math.min(startPos.rowIndex, endPos.rowIndex);
    const maxRow = Math.max(startPos.rowIndex, endPos.rowIndex);
    const minCol = Math.min(startPos.colIndex, endPos.colIndex);
    const maxCol = Math.max(startPos.colIndex, endPos.colIndex);

    const cellIds: string[] = [];
    for (let r = minRow; r <= maxRow; r++) {
      for (let c = minCol; c <= maxCol; c++) {
        const cell = rows[r]?.cells[c];
        if (cell) {
          cellIds.push(cell.id);
        }
      }
    }
    return cellIds;
  }

  function extendRangeSelection(currentCellId: string, newFocusId: string) {
    if (!enableRangeSelection) return;

    const anchor = anchorCellId ?? currentCellId;
    if (!anchorCellId) {
      anchorCellId = currentCellId;
    }

    const cellIds = getCellsInRange(anchor, newFocusId);
    onRangeSelect?.(cellIds);
  }

  function clearRangeSelection() {
    anchorCellId = null;
    onRangeSelect?.([]);
  }

  // Cell editing
  // Helper to check if a cell is editable (cell-level or column-level)
  function isCellEditable(cell: DataGridCellData, colId: string): boolean {
    if (cell.readonly) return false;
    // Cell-level editable takes priority
    if (cell.editable !== undefined) return cell.editable;
    // Column-level editable
    const column = columns.find((col) => col.id === colId);
    return column?.editable ?? false;
  }

  function startEdit(cellId: string, rowId: string, colId: string) {
    if (!editable || readonly) return;

    const entry = cellById.get(cellId);
    if (!entry || !isCellEditable(entry.cell, colId)) return;

    const initialValue = String(entry.cell.value);
    editValue = initialValue;
    originalEditValue = initialValue;
    internalEditingCellId = cellId;

    // Initialize combobox state if editType is combobox
    const column = columns.find((col) => col.id === colId);
    if (column?.editType === 'combobox' && column.options) {
      filteredOptions = [...column.options];
      comboboxExpanded = false;
      comboboxActiveIndex = -1;
    }

    onEditStart?.(cellId, rowId, colId);
  }

  function endEdit(cellId: string, cancelled: boolean, explicitValue?: string) {
    if (isEndingEdit) return;
    if (internalEditingCellId !== cellId) return;

    isEndingEdit = true;

    const finalValue = cancelled ? originalEditValue : (explicitValue ?? editValue);
    onEditEnd?.(cellId, finalValue, cancelled);

    internalEditingCellId = null;
    editValue = '';
    originalEditValue = '';

    // Reset combobox state
    comboboxExpanded = false;
    comboboxActiveIndex = -1;
    filteredOptions = [];

    // Return focus to the cell
    setTimeout(() => {
      focusCell(cellId);
      isEndingEdit = false;
    }, 0);
  }

  function handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    editValue = target.value;
    if (editingCellId) {
      onCellValueChange?.(editingCellId, target.value);
    }
  }

  function handleInputKeyDown(event: KeyboardEvent, cellId: string) {
    const { key } = event;

    if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      endEdit(cellId, true);
    } else if (key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      endEdit(cellId, false);
    } else if (key === 'Tab') {
      // Allow Tab within cell for focus trap, but for simple input just commit and move
      event.preventDefault();
      event.stopPropagation();
      endEdit(cellId, false);
    }
  }

  function handleInputBlur(cellId: string) {
    if (isEndingEdit) return;
    endEdit(cellId, false);
  }

  // Combobox input change handler
  function handleComboboxInputChange(event: Event, colId: string) {
    const target = event.target as HTMLInputElement;
    const newValue = target.value;
    editValue = newValue;

    if (editingCellId) {
      onCellValueChange?.(editingCellId, newValue);
    }

    // Filter options based on input
    const column = columns.find((col) => col.id === colId);
    if (column?.options) {
      filteredOptions = column.options.filter((opt) =>
        opt.toLowerCase().includes(newValue.toLowerCase())
      );
      comboboxExpanded = true;
      comboboxActiveIndex = -1;
    }
  }

  // Combobox keyboard handler
  function handleComboboxKeyDown(event: KeyboardEvent, cellId: string) {
    const { key } = event;

    if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      comboboxExpanded = false;
      endEdit(cellId, true);
    } else if (key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      const selectedOption =
        comboboxActiveIndex >= 0 ? filteredOptions[comboboxActiveIndex] : undefined;
      if (selectedOption) {
        editValue = selectedOption;
        onCellValueChange?.(cellId, selectedOption);
      }
      comboboxExpanded = false;
      endEdit(cellId, false, selectedOption);
    } else if (key === 'ArrowDown') {
      event.preventDefault();
      if (!comboboxExpanded) {
        comboboxExpanded = true;
      } else if (comboboxActiveIndex < filteredOptions.length - 1) {
        comboboxActiveIndex = comboboxActiveIndex + 1;
      }
    } else if (key === 'ArrowUp') {
      event.preventDefault();
      if (comboboxActiveIndex > 0) {
        comboboxActiveIndex = comboboxActiveIndex - 1;
      } else if (comboboxActiveIndex === 0) {
        comboboxActiveIndex = -1;
      }
    } else if (key === 'Tab') {
      event.preventDefault();
      event.stopPropagation();
      comboboxExpanded = false;
      endEdit(cellId, false);
    }
  }

  // Combobox blur handler
  function handleComboboxBlur(event: FocusEvent, cellId: string) {
    if (isEndingEdit) return;
    // Check if focus is moving to listbox
    if (listboxRef?.contains(event.relatedTarget as Node)) {
      return;
    }
    comboboxExpanded = false;
    endEdit(cellId, false);
  }

  // Select option from combobox listbox
  function selectComboboxOption(option: string, cellId: string) {
    editValue = option;
    onCellValueChange?.(cellId, option);
    comboboxExpanded = false;
    endEdit(cellId, false, option);
  }

  // Select change handler (for select editType)
  function handleSelectChange(event: Event, cellId: string) {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value;
    editValue = newValue;
    onCellValueChange?.(cellId, newValue);
    // End edit immediately with explicit value
    endEdit(cellId, false, newValue);
  }

  // Select keyboard handler
  function handleSelectKeyDown(event: KeyboardEvent, cellId: string) {
    const { key } = event;

    if (key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      endEdit(cellId, true);
    } else if (key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      endEdit(cellId, false);
    }
  }

  // Select blur handler
  function handleSelectBlur(cellId: string) {
    if (isEndingEdit) return;
    endEdit(cellId, false);
  }

  // =============================================================================
  // Header KeyDown
  // =============================================================================

  function handleHeaderKeyDown(event: KeyboardEvent, col: DataGridColumnDef, colIndex: number) {
    const { key } = event;
    let handled = true;

    switch (key) {
      case 'Enter':
      case ' ': {
        if (col.sortable) {
          cycleSort(col.id, col.sortDirection);
        }
        break;
      }
      case 'ArrowDown': {
        // Move to first data row at same column
        const firstCell = rows[0]?.cells[colIndex];
        if (firstCell) focusCell(firstCell.id);
        break;
      }
      case 'ArrowRight': {
        // Find next sortable header or wrap to first cell of first row
        for (let i = colIndex + 1; i < columns.length; i++) {
          if (columns[i].sortable) {
            focusHeader(`header-${columns[i].id}`);
            return;
          }
        }
        // No more sortable headers, stay
        handled = false;
        break;
      }
      case 'ArrowLeft': {
        // Find previous sortable header
        for (let i = colIndex - 1; i >= 0; i--) {
          if (columns[i].sortable) {
            focusHeader(`header-${columns[i].id}`);
            return;
          }
        }
        // No more sortable headers to the left, try header checkbox
        if (rowMultiselectable) {
          focusHeaderCheckboxCell();
          break;
        }
        handled = false;
        break;
      }
      case 'Home': {
        // Find first sortable header
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].sortable) {
            focusHeader(`header-${columns[i].id}`);
            return;
          }
        }
        break;
      }
      case 'End': {
        // Find last sortable header
        for (let i = columns.length - 1; i >= 0; i--) {
          if (columns[i].sortable) {
            focusHeader(`header-${columns[i].id}`);
            return;
          }
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
  // Header Checkbox KeyDown
  // =============================================================================

  function handleHeaderCheckboxKeyDown(event: KeyboardEvent) {
    const { key, ctrlKey } = event;
    let handled = true;

    switch (key) {
      case 'ArrowRight': {
        // Move to first sortable header if exists
        const firstSortable = columns.find((col) => col.sortable);
        if (firstSortable) {
          focusHeader(`header-${firstSortable.id}`);
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
          focusCheckboxCell(`checkbox-${rows[0].id}`);
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
          if (lastCell) focusCell(lastCell.id);
        } else {
          // Go to last sortable header or stay
          const lastSortable = [...columns].reverse().find((col) => col.sortable);
          if (lastSortable) {
            focusHeader(`header-${lastSortable.id}`);
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
  }

  // =============================================================================
  // Cell KeyDown
  // =============================================================================

  function handleKeyDown(
    event: KeyboardEvent,
    cell: DataGridCellData,
    rowId: string,
    colId: string,
    rowIndex: number,
    colIndex: number
  ) {
    // If editing, ignore grid navigation
    if (isEditing) return;

    const { key, ctrlKey, shiftKey } = event;
    let handled = true;

    switch (key) {
      case 'ArrowRight': {
        if (shiftKey && enableRangeSelection) {
          const next = findNextFocusableCell(rowIndex, colIndex, 'right');
          if (next) {
            extendRangeSelection(cell.id, next.cell.id);
            focusCell(next.cell.id);
          }
        } else {
          clearRangeSelection();
          const next = findNextFocusableCell(rowIndex, colIndex, 'right');
          if (next) focusCell(next.cell.id);
        }
        break;
      }
      case 'ArrowLeft': {
        if (shiftKey && enableRangeSelection) {
          const next = findNextFocusableCell(rowIndex, colIndex, 'left');
          if (next) {
            extendRangeSelection(cell.id, next.cell.id);
            focusCell(next.cell.id);
          }
        } else {
          clearRangeSelection();
          // Check if we're at the first data cell and should go to checkbox
          if (colIndex === 0 && rowSelectable) {
            focusCheckboxCell(`checkbox-${rowId}`);
          } else {
            const next = findNextFocusableCell(rowIndex, colIndex, 'left');
            if (next) focusCell(next.cell.id);
          }
        }
        break;
      }
      case 'ArrowDown': {
        if (shiftKey && enableRangeSelection) {
          const next = findNextFocusableCell(rowIndex, colIndex, 'down');
          if (next) {
            extendRangeSelection(cell.id, next.cell.id);
            focusCell(next.cell.id);
          }
        } else {
          clearRangeSelection();
          const next = findNextFocusableCell(rowIndex, colIndex, 'down');
          if (next) focusCell(next.cell.id);
        }
        break;
      }
      case 'ArrowUp': {
        if (shiftKey && enableRangeSelection) {
          const next = findNextFocusableCell(rowIndex, colIndex, 'up');
          if (next) {
            extendRangeSelection(cell.id, next.cell.id);
            focusCell(next.cell.id);
          }
        } else {
          clearRangeSelection();
          // Check if we should go to header
          if (rowIndex === 0) {
            // Find sortable header at this column
            if (columns[colIndex]?.sortable) {
              focusHeader(`header-${columns[colIndex].id}`);
            }
          } else {
            const next = findNextFocusableCell(rowIndex, colIndex, 'up');
            if (next) focusCell(next.cell.id);
          }
        }
        break;
      }
      case 'Home': {
        if (ctrlKey && shiftKey && enableRangeSelection) {
          const firstCell = rows[0]?.cells[0];
          if (firstCell) {
            extendRangeSelection(cell.id, firstCell.id);
            focusCell(firstCell.id);
          }
        } else if (shiftKey && enableRangeSelection) {
          const firstCellInRow = rows[rowIndex]?.cells[0];
          if (firstCellInRow) {
            extendRangeSelection(cell.id, firstCellInRow.id);
            focusCell(firstCellInRow.id);
          }
        } else if (ctrlKey) {
          clearRangeSelection();
          // Go to first cell in grid (checkbox if rowSelectable)
          if (rowSelectable) {
            focusCheckboxCell(`checkbox-${rows[0].id}`);
          } else {
            const firstCell = rows[0]?.cells[0];
            if (firstCell) focusCell(firstCell.id);
          }
        } else {
          clearRangeSelection();
          // Go to first cell in row (checkbox if rowSelectable)
          if (rowSelectable) {
            focusCheckboxCell(`checkbox-${rowId}`);
          } else {
            const firstCellInRow = rows[rowIndex]?.cells[0];
            if (firstCellInRow) focusCell(firstCellInRow.id);
          }
        }
        break;
      }
      case 'End': {
        if (ctrlKey && shiftKey && enableRangeSelection) {
          const lastRow = rows[rows.length - 1];
          const lastCell = lastRow?.cells[lastRow.cells.length - 1];
          if (lastCell) {
            extendRangeSelection(cell.id, lastCell.id);
            focusCell(lastCell.id);
          }
        } else if (shiftKey && enableRangeSelection) {
          const currentRow = rows[rowIndex];
          const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
          if (lastCellInRow) {
            extendRangeSelection(cell.id, lastCellInRow.id);
            focusCell(lastCellInRow.id);
          }
        } else if (ctrlKey) {
          clearRangeSelection();
          const lastRow = rows[rows.length - 1];
          const lastCell = lastRow?.cells[lastRow.cells.length - 1];
          if (lastCell) focusCell(lastCell.id);
        } else {
          clearRangeSelection();
          const currentRow = rows[rowIndex];
          const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
          if (lastCellInRow) focusCell(lastCellInRow.id);
        }
        break;
      }
      case 'PageDown': {
        if (enablePageNavigation) {
          clearRangeSelection();
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
          clearRangeSelection();
          const targetRowIndex = Math.max(rowIndex - pageSize, 0);
          const targetCell = rows[targetRowIndex]?.cells[colIndex];
          if (targetCell) focusCell(targetCell.id);
        } else {
          handled = false;
        }
        break;
      }
      case ' ': {
        toggleCellSelection(cell.id, cell);
        break;
      }
      case 'Enter': {
        if (editable && isCellEditable(cell, colId) && !readonly) {
          startEdit(cell.id, rowId, colId);
        } else if (!cell.disabled) {
          onCellActivate?.(cell.id, rowId, colId);
        }
        break;
      }
      case 'F2': {
        if (editable && isCellEditable(cell, colId) && !readonly) {
          startEdit(cell.id, rowId, colId);
        }
        break;
      }
      case 'a': {
        if (ctrlKey) {
          selectAllCells();
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
  // Checkbox handlers
  // =============================================================================

  function handleCheckboxCellClick(checkboxId: string) {
    const cellEl = cellRefs.get(checkboxId);
    if (cellEl) {
      // Focus the cell after the checkbox change is processed
      requestAnimationFrame(() => {
        cellEl.focus();
        setFocusedId(checkboxId);
      });
    }
  }

  function handleCheckboxCellKeyDown(event: KeyboardEvent, rowId: string, row: DataGridRowData) {
    const { key, shiftKey, ctrlKey } = event;
    let handled = true;

    const rowIndex = rows.findIndex((r) => r.id === rowId);
    if (rowIndex === -1) return;

    const colCount = columns.length + (rowSelectable ? 1 : 0);

    switch (key) {
      case 'ArrowRight': {
        // Move to first data cell in the same row
        const nextItem = getItemAt(rowIndex, 1);
        if (nextItem) {
          if (nextItem.type === 'checkbox') {
            focusCheckboxCell(nextItem.id);
          } else {
            focusCell(nextItem.id);
          }
        }
        break;
      }
      case 'ArrowLeft': {
        // Already at leftmost position (checkbox column), do nothing
        handled = false;
        break;
      }
      case 'ArrowDown': {
        // Move to checkbox cell in next row
        if (rowIndex < rows.length - 1) {
          const nextRowId = rows[rowIndex + 1].id;
          focusCheckboxCell(`checkbox-${nextRowId}`);
        }
        break;
      }
      case 'ArrowUp': {
        // Move to checkbox cell in previous row, or header checkbox if at first row
        if (rowIndex > 0) {
          const prevRowId = rows[rowIndex - 1].id;
          focusCheckboxCell(`checkbox-${prevRowId}`);
        } else if (rowMultiselectable) {
          // If at first row and header checkbox exists, focus it
          focusHeaderCheckboxCell();
        }
        break;
      }
      case 'Home': {
        if (ctrlKey) {
          // Move to first cell in grid
          const firstItem = getItemAt(0, 0);
          if (firstItem) {
            if (firstItem.type === 'checkbox') {
              focusCheckboxCell(firstItem.id);
            } else {
              focusCell(firstItem.id);
            }
          }
        }
        // Home without ctrl - already at start of row
        break;
      }
      case 'End': {
        if (ctrlKey) {
          // Move to last cell in grid
          const lastRowIndex = rows.length - 1;
          const lastColIndex = colCount - 1;
          const lastItem = getItemAt(lastRowIndex, lastColIndex);
          if (lastItem) {
            focusCell(lastItem.id);
          }
        } else {
          // Move to last cell in current row
          const lastColIndex = colCount - 1;
          const lastItem = getItemAt(rowIndex, lastColIndex);
          if (lastItem) {
            focusCell(lastItem.id);
          }
        }
        break;
      }
      case ' ':
      case 'Enter': {
        // Toggle row selection
        toggleRowSelection(rowId, row);
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

  function handleRowCheckboxChange(event: Event, row: DataGridRowData) {
    event.stopPropagation();
    toggleRowSelection(row.id, row);
  }

  function handleSelectAllCheckboxChange(event: Event) {
    event.stopPropagation();
    toggleAllRowSelection();
  }

  // Header click
  function handleHeaderClick(col: DataGridColumnDef) {
    if (col.sortable) {
      cycleSort(col.id, col.sortDirection);
    }
  }
</script>

<div class="apg-data-grid {className}" style="--apg-data-grid-columns: {columns.length}">
  <div
    bind:this={gridRef}
    role="grid"
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledby}
    aria-multiselectable={ariaMultiselectable}
    aria-readonly={readonly ? 'true' : undefined}
    aria-rowcount={totalRows}
    aria-colcount={totalColumns ?? effectiveColCount}
  >
    <!-- Header Row -->
    <div role="row" aria-rowindex={totalRows ? 1 : undefined}>
      {#if hasCheckboxColumn}
        {@const isHeaderCheckboxFocused = focusedId === 'header-checkbox'}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          role="columnheader"
          class="apg-data-grid-header apg-data-grid-checkbox-cell"
          class:focused={isHeaderCheckboxFocused}
          tabindex={rowMultiselectable ? (isHeaderCheckboxFocused ? 0 : -1) : undefined}
          aria-colindex={totalColumns ? startColIndex : undefined}
          onkeydown={rowMultiselectable ? handleHeaderCheckboxKeyDown : undefined}
          onfocusin={() => rowMultiselectable && setFocusedId('header-checkbox')}
          use:registerCell={'header-checkbox'}
        >
          {#if rowMultiselectable}
            {@const selectAllState = getSelectAllState()}
            <input
              type="checkbox"
              tabindex={-1}
              checked={selectAllState === 'all'}
              indeterminate={selectAllState === 'some'}
              aria-label="Select all rows"
              onchange={handleSelectAllCheckboxChange}
            />
          {/if}
        </div>
      {/if}
      {#each columns as col, colIndex (col.id)}
        {@const headerId = `header-${col.id}`}
        {@const isFocused = focusedId === headerId}
        {@const ariaColIndex = totalColumns
          ? startColIndex + colIndex + (hasCheckboxColumn ? 1 : 0)
          : undefined}
        <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
        <div
          role="columnheader"
          class="apg-data-grid-header"
          class:sortable={col.sortable}
          class:focused={isFocused}
          tabindex={col.sortable ? (isFocused ? 0 : -1) : undefined}
          aria-sort={col.sortable ? (col.sortDirection ?? 'none') : undefined}
          aria-colindex={ariaColIndex}
          aria-colspan={col.colspan}
          onclick={() => handleHeaderClick(col)}
          onkeydown={(e) => handleHeaderKeyDown(e, col, colIndex)}
          onfocusin={() => col.sortable && setFocusedId(headerId)}
          use:registerHeader={headerId}
        >
          {col.header}
          {#if col.sortable}
            <span
              class="sort-indicator"
              class:unsorted={!col.sortDirection || col.sortDirection === 'none'}
              aria-hidden="true"
            >
              {getSortIndicator(col.sortDirection)}
            </span>
          {/if}
        </div>
      {/each}
    </div>

    <!-- Data Rows -->
    {#each rows as row, rowIndex (row.id)}
      {@const isRowSelected = selectedRowIds.includes(row.id)}
      <div
        role="row"
        aria-rowindex={totalRows ? startRowIndex + rowIndex + 1 : undefined}
        aria-selected={rowSelectable ? (isRowSelected ? 'true' : 'false') : undefined}
        aria-disabled={row.disabled ? 'true' : undefined}
      >
        {#if hasCheckboxColumn}
          {@const checkboxId = `checkbox-${row.id}`}
          {@const isCheckboxFocused = focusedId === checkboxId}
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <div
            role="gridcell"
            class="apg-data-grid-cell apg-data-grid-checkbox-cell"
            class:focused={isCheckboxFocused}
            tabindex={isCheckboxFocused ? 0 : -1}
            aria-colindex={totalColumns ? startColIndex : undefined}
            onkeydown={(e) => handleCheckboxCellKeyDown(e, row.id, row)}
            onfocusin={() => setFocusedId(checkboxId)}
            onclick={() => handleCheckboxCellClick(checkboxId)}
            use:registerCell={checkboxId}
          >
            <input
              type="checkbox"
              tabindex={-1}
              checked={isRowSelected}
              disabled={row.disabled}
              aria-labelledby={rowLabelColumn ? `cell-${row.id}-${rowLabelColumn.id}` : undefined}
              onchange={(e) => handleRowCheckboxChange(e, row)}
            />
          </div>
        {/if}
        {#each row.cells as cell, colIndex (cell.id)}
          {@const isRowHeader = row.hasRowHeader && colIndex === 0}
          {@const isFocused = cell.id === focusedId}
          {@const isSelected = selectedIds.includes(cell.id)}
          {@const colId = columns[colIndex]?.id ?? ''}
          {@const isEditingThisCell = editingCellId === cell.id}
          {@const isDisabled = cell.disabled || row.disabled}
          {@const cellEditable =
            editable && isCellEditable(cell, colId) && !readonly && !isDisabled}
          {@const ariaColIndex = totalColumns
            ? startColIndex + colIndex + (hasCheckboxColumn ? 1 : 0)
            : undefined}
          {@const isLabelColumn = rowLabelColumn && columns[colIndex]?.id === rowLabelColumn.id}
          {@const column = columns[colIndex]}
          {@const editType = column?.editType ?? 'text'}
          {@const columnOptions = column?.options ?? []}
          {@const comboboxListId = `${cell.id}-listbox`}
          <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
          <div
            id={isLabelColumn ? `cell-${row.id}-${columns[colIndex].id}` : undefined}
            role={isRowHeader ? 'rowheader' : 'gridcell'}
            tabindex={isFocused ? 0 : -1}
            aria-selected={getAriaSelected(selectable, rowSelectable, isSelected)}
            aria-disabled={isDisabled ? 'true' : undefined}
            aria-readonly={getAriaReadonly(editable, cell.readonly, cellEditable)}
            aria-colindex={ariaColIndex}
            aria-colspan={cell.colspan}
            aria-rowspan={cell.rowspan}
            data-col-id={colId}
            class="apg-data-grid-cell"
            class:focused={isFocused}
            class:selected={isSelected}
            class:disabled={isDisabled}
            class:editable={cellEditable && !isEditingThisCell}
            class:editing={isEditingThisCell}
            onkeydown={(e) => handleKeyDown(e, cell, row.id, colId, rowIndex, colIndex)}
            onfocusin={() => setFocusedId(cell.id)}
            ondblclick={() => cellEditable && startEdit(cell.id, row.id, colId)}
            use:registerCell={cell.id}
          >
            {#if isEditingThisCell}
              {#if editType === 'select'}
                <select
                  bind:this={selectRef}
                  value={editValue}
                  onchange={(e) => handleSelectChange(e, cell.id)}
                  onblur={() => handleSelectBlur(cell.id)}
                  onkeydown={(e) => handleSelectKeyDown(e, cell.id)}
                  class="apg-data-grid-select"
                >
                  {#each columnOptions as option (option)}
                    <option value={option}>{option}</option>
                  {/each}
                </select>
              {:else if editType === 'combobox'}
                <div class="apg-data-grid-combobox">
                  <input
                    bind:this={inputRef}
                    type="text"
                    role="combobox"
                    aria-expanded={comboboxExpanded}
                    aria-controls={comboboxListId}
                    aria-autocomplete="list"
                    aria-activedescendant={comboboxActiveIndex >= 0
                      ? `${cell.id}-option-${comboboxActiveIndex}`
                      : undefined}
                    value={editValue}
                    oninput={(e) => handleComboboxInputChange(e, colId)}
                    onblur={(e) => handleComboboxBlur(e, cell.id)}
                    onkeydown={(e) => handleComboboxKeyDown(e, cell.id)}
                    class="apg-data-grid-input"
                  />
                  {#if comboboxExpanded && filteredOptions.length > 0}
                    <ul
                      bind:this={listboxRef}
                      id={comboboxListId}
                      role="listbox"
                      class="apg-data-grid-listbox"
                    >
                      {#each filteredOptions as option, optionIndex (option)}
                        <li
                          id={`${cell.id}-option-${optionIndex}`}
                          role="option"
                          aria-selected={optionIndex === comboboxActiveIndex}
                          class="apg-data-grid-option"
                          class:active={optionIndex === comboboxActiveIndex}
                          onmousedown={() => selectComboboxOption(option, cell.id)}
                        >
                          {option}
                        </li>
                      {/each}
                    </ul>
                  {/if}
                </div>
              {:else}
                <input
                  bind:this={inputRef}
                  type="text"
                  class="apg-data-grid-input"
                  value={editValue}
                  oninput={handleInputChange}
                  onkeydown={(e) => handleInputKeyDown(e, cell.id)}
                  onblur={() => handleInputBlur(cell.id)}
                />
              {/if}
            {:else if renderCell}
              <!-- eslint-disable-next-line svelte/no-at-html-tags -- renderCell returns sanitized content from the consuming application -->
              {@html renderCell(cell, row.id, colId)}
            {:else}
              {cell.value}
            {/if}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
