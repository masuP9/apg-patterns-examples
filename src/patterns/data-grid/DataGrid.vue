<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue';

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
  if (direction === 'ascending') return ' ▲';
  if (direction === 'descending') return ' ▼';
  return ' ⇅';
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
  selectable: boolean,
  rowSelectable: boolean,
  isSelected: boolean
): 'true' | 'false' | undefined {
  if (!selectable) return undefined;
  if (rowSelectable) return undefined; // Row selection takes precedence
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
  rowSelectable?: boolean;
  rowMultiselectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  enableRangeSelection?: boolean;
  editable?: boolean;
  readonly?: boolean;
  editingCellId?: string | null;
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
}

// =============================================================================
// Props & Emits
// =============================================================================

const props = withDefaults(defineProps<Props>(), {
  rowSelectable: false,
  rowMultiselectable: false,
  defaultSelectedRowIds: () => [],
  enableRangeSelection: false,
  editable: false,
  readonly: false,
  selectable: false,
  multiselectable: false,
  defaultSelectedIds: () => [],
  startRowIndex: 1,
  startColIndex: 1,
  wrapNavigation: false,
  enablePageNavigation: false,
  pageSize: 5,
});

const emit = defineEmits<{
  sort: [columnId: string, direction: SortDirection];
  rowSelectionChange: [rowIds: string[]];
  rangeSelect: [cellIds: string[]];
  editStart: [cellId: string, rowId: string, colId: string];
  editEnd: [cellId: string, value: string, cancelled: boolean];
  cellValueChange: [cellId: string, newValue: string];
  selectionChange: [selectedIds: string[]];
  focusChange: [focusedId: string | null];
  cellActivate: [cellId: string, rowId: string, colId: string];
}>();

// =============================================================================
// State
// =============================================================================

// Row selection
const internalSelectedRowIds = ref<string[]>([...props.defaultSelectedRowIds]);
const selectedRowIds = computed(() => props.selectedRowIds ?? internalSelectedRowIds.value);

// Cell selection
const internalSelectedIds = ref<string[]>([...props.defaultSelectedIds]);
const selectedIds = computed(() => props.selectedIds ?? internalSelectedIds.value);

// Focus
// Default to first focusable item based on row selection mode
// rowMultiselectable: header checkbox cell is first (Select all rows)
// rowSelectable only: first row's checkbox cell
// Otherwise: first data cell
const getInitialFocusedId = () => {
  if (props.defaultFocusedId) return props.defaultFocusedId;
  if (props.rowSelectable && props.rowMultiselectable) {
    return 'header-checkbox';
  }
  if (props.rowSelectable) {
    return props.rows[0] ? `checkbox-${props.rows[0].id}` : null;
  }
  return props.rows[0]?.cells[0]?.id ?? null;
};
const focusedId = ref<string | null>(getInitialFocusedId());

// Edit mode
const internalEditingCellId = ref<string | null>(null);
const editingCellId = computed(() =>
  props.editingCellId !== undefined ? props.editingCellId : internalEditingCellId.value
);
const editValue = ref<string>('');
const originalEditValue = ref<string>('');
const editingColId = ref<string | null>(null);
const isEndingEdit = ref(false);

// Combobox state
const comboboxExpanded = ref(false);
const comboboxActiveIndex = ref(-1);
const filteredOptions = ref<string[]>([]);

// Range selection anchor
const anchorCellId = ref<string | null>(null);

const gridRef = ref<HTMLDivElement | null>(null);
const cellRefs = ref<Map<string, HTMLDivElement>>(new Map());
const headerRefs = ref<Map<string, HTMLDivElement>>(new Map());
const inputRef = ref<HTMLInputElement | null>(null);
const selectRef = ref<HTMLSelectElement | null>(null);
const listboxRef = ref<HTMLUListElement | null>(null);

// =============================================================================
// Computed
// =============================================================================

const hasSortableHeaders = computed(() => props.columns.some((col) => col.sortable));

// Check if header row has focusable items (sortable headers OR header checkbox)
const hasHeaderFocusable = computed(
  () => hasSortableHeaders.value || (props.rowSelectable && props.rowMultiselectable)
);

// Find the column that provides row labels (for aria-labelledby on row checkboxes)
// Priority: 1. Column with isRowLabel: true, 2. First column (fallback)
const rowLabelColumn = computed(() => {
  const labelColumn = props.columns.find((col) => col.isRowLabel);
  return labelColumn ?? props.columns[0];
});

// Build a flat list of focusable items (sortable headers + cells)
const focusableItems = computed(() => {
  const items: Array<{
    id: string;
    type: 'header' | 'cell' | 'checkbox' | 'header-checkbox';
    rowIndex: number;
    colIndex: number;
    columnId?: string;
    rowId?: string;
    cell?: DataGridCellData;
    disabled?: boolean;
  }> = [];

  // Column offset when rowSelectable is enabled (checkbox column takes index 0)
  const colOffset = props.rowSelectable ? 1 : 0;

  // Header checkbox cell at row index -1, colIndex 0 (when rowMultiselectable)
  if (props.rowSelectable && props.rowMultiselectable) {
    items.push({
      id: 'header-checkbox',
      type: 'header-checkbox',
      rowIndex: -1,
      colIndex: 0,
    });
  }

  // Sortable headers at row index -1
  props.columns.forEach((col, colIndex) => {
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
  props.rows.forEach((row, rowIndex) => {
    // Add checkbox cell if row selection is enabled
    if (props.rowSelectable) {
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
        columnId: props.columns[colIndex]?.id,
        cell,
        disabled: cell.disabled || row.disabled,
      });
    });
  });

  return items;
});

const itemById = computed(() => {
  const map = new Map<string, (typeof focusableItems.value)[0]>();
  focusableItems.value.forEach((item) => map.set(item.id, item));
  return map;
});

const showMultiselectable = computed(() => props.rowMultiselectable || props.multiselectable);

// =============================================================================
// Methods - Focus Management
// =============================================================================

function getItemPosition(id: string) {
  const item = itemById.value.get(id);
  if (!item) return null;
  return { rowIndex: item.rowIndex, colIndex: item.colIndex };
}

function getItemAt(rowIndex: number, colIndex: number) {
  if (rowIndex === -1) {
    // Header row - find header-checkbox or sortable header at this column
    return focusableItems.value.find(
      (item) =>
        (item.type === 'header' || item.type === 'header-checkbox') &&
        item.rowIndex === -1 &&
        item.colIndex === colIndex
    );
  }
  // Data row - find cell or checkbox at this position
  return focusableItems.value.find(
    (item) =>
      (item.type === 'cell' || item.type === 'checkbox') &&
      item.rowIndex === rowIndex &&
      item.colIndex === colIndex
  );
}

function setFocusedId(id: string | null) {
  focusedId.value = id;
  emit('focusChange', id);
}

function focusItem(id: string) {
  const item = itemById.value.get(id);
  if (!item) return;

  if (item.type === 'header') {
    const headerEl = headerRefs.value.get(item.columnId!);
    if (headerEl) {
      headerEl.focus();
      setFocusedId(id);
    }
  } else if (item.type === 'header-checkbox') {
    const cellEl = cellRefs.value.get(id);
    if (cellEl) {
      cellEl.focus();
      setFocusedId(id);
    }
  } else {
    const cellEl = cellRefs.value.get(id);
    if (cellEl) {
      cellEl.focus();
      setFocusedId(id);
    }
  }
}

function findNextFocusable(
  startRowIndex: number,
  startColIndex: number,
  direction: 'right' | 'left' | 'up' | 'down',
  skipDisabled = true
) {
  const colCount = props.columns.length + (props.rowSelectable ? 1 : 0);
  const rowCount = props.rows.length;

  let rowIdx = startRowIndex;
  let colIdx = startColIndex;

  const step = () => {
    switch (direction) {
      case 'right':
        colIdx++;
        if (colIdx >= colCount) {
          if (props.wrapNavigation) {
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
          if (props.wrapNavigation) {
            colIdx = colCount - 1;
            rowIdx--;
            // Allow going up to header row (-1) if header has focusable items
            if (rowIdx < (hasHeaderFocusable.value ? -1 : 0)) return false;
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
        if (rowIdx < (hasHeaderFocusable.value ? -1 : 0)) return false;
        break;
    }
    return true;
  };

  if (!step()) return null;

  let iterations = 0;
  const maxIterations = colCount * (rowCount + 1);

  while (iterations < maxIterations) {
    const item = getItemAt(rowIdx, colIdx);
    if (item) {
      if (rowIdx === -1) {
        return item;
      }
      if (!skipDisabled || !item.disabled) {
        return item;
      }
    }
    if (!step()) break;
    iterations++;
  }

  return null;
}

// =============================================================================
// Methods - Row Selection
// =============================================================================

function setSelectedRowIds(ids: string[]) {
  internalSelectedRowIds.value = ids;
  emit('rowSelectionChange', ids);
}

function toggleRowSelection(rowId: string, row: DataGridRowData) {
  if (!props.rowSelectable || row.disabled) return;

  if (props.rowMultiselectable) {
    const newIds = selectedRowIds.value.includes(rowId)
      ? selectedRowIds.value.filter((id) => id !== rowId)
      : [...selectedRowIds.value, rowId];
    setSelectedRowIds(newIds);
  } else {
    const newIds = selectedRowIds.value.includes(rowId) ? [] : [rowId];
    setSelectedRowIds(newIds);
  }
}

function toggleAllRowSelection() {
  if (!props.rowSelectable || !props.rowMultiselectable) return;

  const allRowIds = props.rows.filter((r) => !r.disabled).map((r) => r.id);
  const allSelected = allRowIds.every((id) => selectedRowIds.value.includes(id));

  if (allSelected) {
    setSelectedRowIds([]);
  } else {
    setSelectedRowIds(allRowIds);
  }
}

function getSelectAllState(): 'all' | 'some' | 'none' {
  const allRowIds = props.rows.filter((r) => !r.disabled).map((r) => r.id);
  if (allRowIds.length === 0) return 'none';

  const selectedCount = allRowIds.filter((id) => selectedRowIds.value.includes(id)).length;
  if (selectedCount === 0) return 'none';
  if (selectedCount === allRowIds.length) return 'all';
  return 'some';
}

// =============================================================================
// Methods - Cell Selection
// =============================================================================

function setSelectedIds(ids: string[]) {
  internalSelectedIds.value = ids;
  emit('selectionChange', ids);
}

function toggleSelection(cellId: string, cell: DataGridCellData) {
  if (!props.selectable || cell.disabled) return;

  if (props.multiselectable) {
    const newIds = selectedIds.value.includes(cellId)
      ? selectedIds.value.filter((id) => id !== cellId)
      : [...selectedIds.value, cellId];
    setSelectedIds(newIds);
  } else {
    const newIds = selectedIds.value.includes(cellId) ? [] : [cellId];
    setSelectedIds(newIds);
  }
}

function selectAll() {
  if (!props.selectable || !props.multiselectable) return;

  const allIds = focusableItems.value
    .filter((item) => item.type === 'cell' && !item.disabled)
    .map((item) => item.id);
  setSelectedIds(allIds);
}

// =============================================================================
// Methods - Range Selection
// =============================================================================

function getCellsInRange(startId: string, endId: string): string[] {
  const startItem = itemById.value.get(startId);
  const endItem = itemById.value.get(endId);
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
}

function extendRangeSelection(currentCellId: string, newFocusId: string) {
  if (!props.enableRangeSelection) return;

  const anchor = anchorCellId.value ?? currentCellId;
  if (!anchorCellId.value) {
    anchorCellId.value = currentCellId;
  }

  const cellIds = getCellsInRange(anchor, newFocusId);
  emit('rangeSelect', cellIds);
}

// =============================================================================
// Methods - Sorting
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

function handleSort(columnId: string) {
  const column = props.columns.find((col) => col.id === columnId);
  if (!column?.sortable) return;

  const nextDirection = getNextSortDirection(column.sortDirection);
  emit('sort', columnId, nextDirection);
}

// =============================================================================
// Methods - Cell Editing
// =============================================================================

// Helper to check if a cell is editable (cell-level or column-level)
function isCellEditable(cell: DataGridCellData, colId: string): boolean {
  if (cell.readonly) return false;
  // Cell-level editable takes priority
  if (cell.editable !== undefined) return cell.editable;
  // Column-level editable
  const column = props.columns.find((col) => col.id === colId);
  return column?.editable ?? false;
}

// Helper to get column's editType
function getColumnEditType(colId: string): EditType {
  const column = props.columns.find((col) => col.id === colId);
  return column?.editType ?? 'text';
}

// Helper to get column's options
function getColumnOptions(colId: string): string[] {
  const column = props.columns.find((col) => col.id === colId);
  return column?.options ?? [];
}

function startEdit(cellId: string, rowId: string, colId: string) {
  if (!props.editable || props.readonly) return;

  const item = itemById.value.get(cellId);
  if (!item || item.type === 'header' || !item.cell) return;

  // Check if cell is editable (cell-level or column-level)
  if (!isCellEditable(item.cell, colId)) return;

  const value = String(item.cell.value);
  originalEditValue.value = value;
  editValue.value = value;
  editingColId.value = colId;
  internalEditingCellId.value = cellId;

  // Initialize combobox state if editType is combobox
  const editType = getColumnEditType(colId);
  if (editType === 'combobox') {
    const options = getColumnOptions(colId);
    filteredOptions.value = options;
    comboboxExpanded.value = true;
    comboboxActiveIndex.value = -1;
  }

  emit('editStart', cellId, rowId, colId);
}

function endEdit(cellId: string, cancelled: boolean, explicitValue?: string) {
  if (isEndingEdit.value) return;
  if (internalEditingCellId.value !== cellId) return;

  isEndingEdit.value = true;
  // Use explicit value if provided (for combobox/select option clicks),
  // otherwise fall back to current editValue state
  const finalValue = cancelled ? originalEditValue.value : (explicitValue ?? editValue.value);
  internalEditingCellId.value = null;
  editingColId.value = null;
  comboboxExpanded.value = false;
  comboboxActiveIndex.value = -1;
  emit('editEnd', cellId, finalValue, cancelled);

  const cellEl = cellRefs.value.get(cellId);
  if (cellEl) {
    cellEl.focus();
  }

  setTimeout(() => {
    isEndingEdit.value = false;
  }, 0);
}

// =============================================================================
// Methods - Keyboard Handling
// =============================================================================

function handleHeaderKeyDown(event: KeyboardEvent, column: DataGridColumnDef) {
  const pos = getItemPosition(`header-${column.id}`);
  if (!pos) return;

  const { colIndex } = pos;
  let handled = true;

  switch (event.key) {
    case 'ArrowRight': {
      // colIndex includes colOffset, so we need to adjust for columns array access
      const colOffset = props.rowSelectable ? 1 : 0;
      let nextColIdx = colIndex - colOffset + 1;
      while (nextColIdx < props.columns.length) {
        if (props.columns[nextColIdx].sortable) {
          focusItem(`header-${props.columns[nextColIdx].id}`);
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        nextColIdx++;
      }
      handled = false;
      break;
    }
    case 'ArrowLeft': {
      // colIndex includes colOffset, so we need to adjust for columns array access
      const colOffset = props.rowSelectable ? 1 : 0;
      let prevColIdx = colIndex - colOffset - 1;
      while (prevColIdx >= 0) {
        if (props.columns[prevColIdx].sortable) {
          focusItem(`header-${props.columns[prevColIdx].id}`);
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        prevColIdx--;
      }
      // No more sortable headers to the left, try header checkbox
      if (props.rowMultiselectable) {
        focusItem('header-checkbox');
        break;
      }
      handled = false;
      break;
    }
    case 'ArrowDown': {
      // colIndex includes colOffset, but rows[].cells[] doesn't include checkbox column
      const colOffset = props.rowSelectable ? 1 : 0;
      const cellColIndex = colIndex - colOffset;
      const firstRowCell = props.rows[0]?.cells[cellColIndex];
      if (firstRowCell) {
        focusItem(firstRowCell.id);
      }
      break;
    }
    case 'Home': {
      if (event.ctrlKey) {
        const firstSortable = props.columns.find((col) => col.sortable);
        if (firstSortable) {
          focusItem(`header-${firstSortable.id}`);
        } else {
          const firstCell = props.rows[0]?.cells[0];
          if (firstCell) focusItem(firstCell.id);
        }
      } else {
        const firstSortable = props.columns.find((col) => col.sortable);
        if (firstSortable) {
          focusItem(`header-${firstSortable.id}`);
        }
      }
      break;
    }
    case 'End': {
      if (event.ctrlKey) {
        const lastRow = props.rows[props.rows.length - 1];
        const lastCell = lastRow?.cells[lastRow.cells.length - 1];
        if (lastCell) focusItem(lastCell.id);
      } else {
        const lastSortable = [...props.columns].reverse().find((col) => col.sortable);
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
}

function handleHeaderCheckboxKeyDown(event: KeyboardEvent) {
  const { key, ctrlKey } = event;
  let handled = true;

  switch (key) {
    case 'ArrowRight': {
      // Move to first sortable header if exists
      const firstSortable = props.columns.find((col) => col.sortable);
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
      if (props.rows[0]) {
        focusItem(`checkbox-${props.rows[0].id}`);
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
        const lastRow = props.rows[props.rows.length - 1];
        const lastCell = lastRow?.cells[lastRow.cells.length - 1];
        if (lastCell) focusItem(lastCell.id);
      } else {
        // Go to last sortable header or stay
        const lastSortable = [...props.columns].reverse().find((col) => col.sortable);
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
}

function handleCellKeyDown(
  event: KeyboardEvent,
  cell: DataGridCellData,
  rowId: string,
  colId: string
) {
  if (editingCellId.value === cell.id) {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      endEdit(cell.id, true);
    }
    return;
  }

  const pos = getItemPosition(cell.id);
  if (!pos) return;

  const { rowIndex, colIndex } = pos;
  let handled = true;

  switch (event.key) {
    case 'ArrowRight': {
      if (event.shiftKey && props.enableRangeSelection) {
        const next = findNextFocusable(rowIndex, colIndex, 'right');
        if (next) {
          focusItem(next.id);
          extendRangeSelection(cell.id, next.id);
        }
      } else {
        const next = findNextFocusable(rowIndex, colIndex, 'right');
        if (next) {
          focusItem(next.id);
          anchorCellId.value = null;
        }
      }
      break;
    }
    case 'ArrowLeft': {
      if (event.shiftKey && props.enableRangeSelection) {
        const next = findNextFocusable(rowIndex, colIndex, 'left');
        if (next) {
          focusItem(next.id);
          extendRangeSelection(cell.id, next.id);
        }
      } else {
        const next = findNextFocusable(rowIndex, colIndex, 'left');
        if (next) {
          focusItem(next.id);
          anchorCellId.value = null;
        }
      }
      break;
    }
    case 'ArrowDown': {
      if (event.shiftKey && props.enableRangeSelection) {
        const next = findNextFocusable(rowIndex, colIndex, 'down');
        if (next) {
          focusItem(next.id);
          extendRangeSelection(cell.id, next.id);
        }
      } else {
        const next = findNextFocusable(rowIndex, colIndex, 'down');
        if (next) {
          focusItem(next.id);
          anchorCellId.value = null;
        }
      }
      break;
    }
    case 'ArrowUp': {
      if (event.shiftKey && props.enableRangeSelection) {
        const next = findNextFocusable(rowIndex, colIndex, 'up');
        if (next) {
          focusItem(next.id);
          extendRangeSelection(cell.id, next.id);
        }
      } else {
        const next = findNextFocusable(rowIndex, colIndex, 'up');
        if (next) {
          focusItem(next.id);
          anchorCellId.value = null;
        }
      }
      break;
    }
    case 'Home': {
      if (event.ctrlKey && event.shiftKey && props.enableRangeSelection) {
        const firstCell = props.rows[0]?.cells[0];
        if (firstCell) {
          focusItem(firstCell.id);
          extendRangeSelection(cell.id, firstCell.id);
        }
      } else if (event.ctrlKey) {
        const firstCell = props.rows[0]?.cells[0];
        if (firstCell) {
          focusItem(firstCell.id);
          anchorCellId.value = null;
        }
      } else if (event.shiftKey && props.enableRangeSelection) {
        const firstCellInRow = props.rows[rowIndex]?.cells[0];
        if (firstCellInRow) {
          focusItem(firstCellInRow.id);
          extendRangeSelection(cell.id, firstCellInRow.id);
        }
      } else {
        const firstCellInRow = props.rows[rowIndex]?.cells[0];
        if (firstCellInRow) {
          focusItem(firstCellInRow.id);
          anchorCellId.value = null;
        }
      }
      break;
    }
    case 'End': {
      const currentRow = props.rows[rowIndex];
      const lastRow = props.rows[props.rows.length - 1];

      if (event.ctrlKey && event.shiftKey && props.enableRangeSelection) {
        const lastCell = lastRow?.cells[lastRow.cells.length - 1];
        if (lastCell) {
          focusItem(lastCell.id);
          extendRangeSelection(cell.id, lastCell.id);
        }
      } else if (event.ctrlKey) {
        const lastCell = lastRow?.cells[lastRow.cells.length - 1];
        if (lastCell) {
          focusItem(lastCell.id);
          anchorCellId.value = null;
        }
      } else if (event.shiftKey && props.enableRangeSelection) {
        const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
        if (lastCellInRow) {
          focusItem(lastCellInRow.id);
          extendRangeSelection(cell.id, lastCellInRow.id);
        }
      } else {
        const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
        if (lastCellInRow) {
          focusItem(lastCellInRow.id);
          anchorCellId.value = null;
        }
      }
      break;
    }
    case 'PageDown': {
      if (props.enablePageNavigation) {
        const targetRowIndex = Math.min(rowIndex + props.pageSize, props.rows.length - 1);
        const targetCell = props.rows[targetRowIndex]?.cells[colIndex];
        if (targetCell) {
          focusItem(targetCell.id);
          anchorCellId.value = null;
        }
      } else {
        handled = false;
      }
      break;
    }
    case 'PageUp': {
      if (props.enablePageNavigation) {
        const targetRowIndex = Math.max(rowIndex - props.pageSize, 0);
        const targetCell = props.rows[targetRowIndex]?.cells[colIndex];
        if (targetCell) {
          focusItem(targetCell.id);
          anchorCellId.value = null;
        }
      } else {
        handled = false;
      }
      break;
    }
    case ' ': {
      if (props.selectable) {
        toggleSelection(cell.id, cell);
      }
      break;
    }
    case 'Enter': {
      if (props.editable && isCellEditable(cell, colId) && !cell.disabled) {
        startEdit(cell.id, rowId, colId);
      } else if (!cell.disabled) {
        emit('cellActivate', cell.id, rowId, colId);
      }
      break;
    }
    case 'F2': {
      if (props.editable && isCellEditable(cell, colId) && !cell.disabled) {
        startEdit(cell.id, rowId, colId);
      }
      break;
    }
    case 'a': {
      if (event.ctrlKey) {
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

function handleCheckboxCellClick(checkboxId: string) {
  // Set focused ID first, then after Vue re-renders, focus the cell
  setFocusedId(checkboxId);
  nextTick(() => {
    const cellEl = cellRefs.value.get(checkboxId);
    if (cellEl) {
      cellEl.focus();
    }
  });
}

function handleCheckboxCellKeyDown(event: KeyboardEvent, rowId: string, row: DataGridRowData) {
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
        const firstCheckboxId = `checkbox-${props.rows[0]?.id}`;
        if (firstCheckboxId) {
          focusItem(firstCheckboxId);
        }
      }
      // Home without Ctrl: stay on checkbox (it's the first cell in the row)
      break;
    }
    case 'End': {
      const currentRow = props.rows[rowIndex];
      const lastRow = props.rows[props.rows.length - 1];

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
}

function handleInputKeyDown(event: KeyboardEvent, cellId: string) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    endEdit(cellId, true);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    endEdit(cellId, false);
  }
}

function handleSelectKeyDown(event: KeyboardEvent, cellId: string) {
  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    endEdit(cellId, true);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    endEdit(cellId, false);
  }
}

function handleComboboxKeyDown(event: KeyboardEvent, cellId: string, colId: string) {
  const columnOptions = getColumnOptions(colId);

  if (event.key === 'Escape') {
    event.preventDefault();
    event.stopPropagation();
    comboboxExpanded.value = false;
    endEdit(cellId, true);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();
    const selectedOption =
      comboboxActiveIndex.value >= 0 ? filteredOptions.value[comboboxActiveIndex.value] : undefined;
    if (selectedOption) {
      editValue.value = selectedOption;
      emit('cellValueChange', cellId, selectedOption);
    }
    comboboxExpanded.value = false;
    endEdit(cellId, false, selectedOption);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    if (!comboboxExpanded.value) {
      comboboxExpanded.value = true;
    } else {
      comboboxActiveIndex.value = Math.min(
        comboboxActiveIndex.value + 1,
        filteredOptions.value.length - 1
      );
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    comboboxActiveIndex.value = Math.max(comboboxActiveIndex.value - 1, -1);
  }
}

function handleComboboxInput(cellId: string, colId: string) {
  const columnOptions = getColumnOptions(colId);
  const filtered = columnOptions.filter((opt) =>
    opt.toLowerCase().includes(editValue.value.toLowerCase())
  );
  filteredOptions.value = filtered;
  comboboxExpanded.value = true;
  comboboxActiveIndex.value = -1;
  emit('cellValueChange', cellId, editValue.value);
}

function handleComboboxBlur(event: FocusEvent, cellId: string) {
  // Check if focus is moving to listbox
  if (listboxRef.value?.contains(event.relatedTarget as Node)) {
    return;
  }
  comboboxExpanded.value = false;
  endEdit(cellId, false);
}

function handleOptionClick(option: string, cellId: string) {
  editValue.value = option;
  emit('cellValueChange', cellId, option);
  comboboxExpanded.value = false;
  endEdit(cellId, false, option);
}

// =============================================================================
// Refs
// =============================================================================

function setCellRef(cellId: string, el: HTMLDivElement | null) {
  if (el) {
    cellRefs.value.set(cellId, el);
  } else {
    cellRefs.value.delete(cellId);
  }
}

function setHeaderRef(columnId: string, el: HTMLDivElement | null) {
  if (el) {
    headerRefs.value.set(columnId, el);
  } else {
    headerRefs.value.delete(columnId);
  }
}

// =============================================================================
// Watchers
// =============================================================================

watch(editingCellId, (newVal) => {
  if (newVal && editingColId.value) {
    const editType = getColumnEditType(editingColId.value);
    nextTick(() => {
      if (editType === 'select' && selectRef.value) {
        selectRef.value.focus();
      } else if (inputRef.value) {
        // inputRef might be an array if multiple elements use the same ref name
        const input = Array.isArray(inputRef.value) ? inputRef.value[0] : inputRef.value;
        if (input && typeof input.focus === 'function') {
          input.focus();
          if (typeof input.select === 'function') {
            input.select();
          }
        }
      }
    });
  }
});

// =============================================================================
// Lifecycle
// =============================================================================

onMounted(() => {
  nextTick(() => {
    if (gridRef.value) {
      const focusableElements = gridRef.value.querySelectorAll<HTMLElement>(
        '[role="gridcell"] a[href], [role="gridcell"] button, [role="rowheader"] a[href], [role="rowheader"] button'
      );
      focusableElements.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
    }
  });
});
</script>

<template>
  <div
    ref="gridRef"
    role="grid"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-multiselectable="showMultiselectable ? 'true' : undefined"
    :aria-readonly="readonly ? 'true' : undefined"
    :aria-rowcount="totalRows"
    :aria-colcount="totalColumns"
    class="apg-data-grid"
    :style="{ '--apg-data-grid-columns': columns.length }"
  >
    <!-- Header Row -->
    <div role="row" :aria-rowindex="totalRows ? 1 : undefined">
      <!-- Checkbox header -->
      <div
        v-if="rowSelectable"
        :ref="(el) => rowMultiselectable && setCellRef('header-checkbox', el as HTMLDivElement)"
        role="columnheader"
        :tabindex="rowMultiselectable ? (focusedId === 'header-checkbox' ? 0 : -1) : undefined"
        :aria-colindex="totalColumns ? startColIndex : undefined"
        :class="[
          'apg-data-grid-header apg-data-grid-checkbox-cell',
          { focused: focusedId === 'header-checkbox' },
        ]"
        @keydown="rowMultiselectable && handleHeaderCheckboxKeyDown($event)"
        @focusin="rowMultiselectable && setFocusedId('header-checkbox')"
      >
        <input
          v-if="rowMultiselectable"
          type="checkbox"
          tabindex="-1"
          :checked="getSelectAllState() === 'all'"
          :indeterminate="getSelectAllState() === 'some'"
          aria-label="Select all rows"
          @change.stop="toggleAllRowSelection"
        />
      </div>
      <!-- Column headers -->
      <div
        v-for="(col, colIndex) in columns"
        :key="col.id"
        :ref="(el) => col.sortable && setHeaderRef(col.id, el as HTMLDivElement)"
        role="columnheader"
        :tabindex="col.sortable ? (focusedId === `header-${col.id}` ? 0 : -1) : undefined"
        :aria-colindex="
          totalColumns ? startColIndex + colIndex + (rowSelectable ? 1 : 0) : undefined
        "
        :aria-colspan="col.colspan"
        :aria-sort="col.sortable ? col.sortDirection || 'none' : undefined"
        class="apg-data-grid-header"
        :class="{ sortable: col.sortable, focused: focusedId === `header-${col.id}` }"
        @keydown="col.sortable && handleHeaderKeyDown($event, col)"
        @focusin="col.sortable && setFocusedId(`header-${col.id}`)"
        @click="col.sortable && handleSort(col.id)"
      >
        {{ col.header }}
        <span
          v-if="col.sortable"
          aria-hidden="true"
          :class="[
            'sort-indicator',
            { unsorted: !col.sortDirection || col.sortDirection === 'none' },
          ]"
        >
          {{ getSortIndicator(col.sortDirection) }}
        </span>
      </div>
    </div>

    <!-- Data Rows -->
    <div
      v-for="(row, rowIndex) in rows"
      :key="row.id"
      role="row"
      :aria-rowindex="totalRows ? startRowIndex + rowIndex + 1 : undefined"
      :aria-selected="
        rowSelectable ? (selectedRowIds.includes(row.id) ? 'true' : 'false') : undefined
      "
      :aria-disabled="row.disabled ? 'true' : undefined"
    >
      <!-- Row selection checkbox -->
      <div
        v-if="rowSelectable"
        :ref="(el) => setCellRef(`checkbox-${row.id}`, el as HTMLDivElement)"
        role="gridcell"
        :tabindex="focusedId === `checkbox-${row.id}` ? 0 : -1"
        :aria-colindex="totalColumns ? startColIndex : undefined"
        :class="[
          'apg-data-grid-cell',
          'apg-data-grid-checkbox-cell',
          { focused: focusedId === `checkbox-${row.id}` },
        ]"
        @keydown="handleCheckboxCellKeyDown($event, row.id, row)"
        @focus="setFocusedId(`checkbox-${row.id}`)"
        @click="handleCheckboxCellClick(`checkbox-${row.id}`)"
      >
        <input
          type="checkbox"
          tabindex="-1"
          :checked="selectedRowIds.includes(row.id)"
          :disabled="row.disabled"
          :aria-labelledby="rowLabelColumn ? `cell-${row.id}-${rowLabelColumn.id}` : undefined"
          @change.stop="toggleRowSelection(row.id, row)"
        />
      </div>

      <!-- Data cells -->
      <div
        v-for="(cell, colIndex) in row.cells"
        :key="cell.id"
        :id="
          rowLabelColumn && columns[colIndex]?.id === rowLabelColumn.id
            ? `cell-${row.id}-${columns[colIndex].id}`
            : undefined
        "
        :ref="(el) => setCellRef(cell.id, el as HTMLDivElement)"
        :role="row.hasRowHeader && colIndex === 0 ? 'rowheader' : 'gridcell'"
        :tabindex="focusedId === cell.id && editingCellId !== cell.id ? 0 : -1"
        :aria-selected="getAriaSelected(selectable, rowSelectable, selectedIds.includes(cell.id))"
        :aria-disabled="cell.disabled || row.disabled ? 'true' : undefined"
        :aria-colindex="
          totalColumns ? startColIndex + colIndex + (rowSelectable ? 1 : 0) : undefined
        "
        :aria-colspan="cell.colspan"
        :aria-rowspan="cell.rowspan"
        :aria-readonly="
          getAriaReadonly(
            editable,
            cell.readonly,
            isCellEditable(cell, columns[colIndex]?.id ?? '')
          )
        "
        class="apg-data-grid-cell"
        :class="{
          focused: focusedId === cell.id,
          selected: selectedIds.includes(cell.id),
          disabled: cell.disabled || row.disabled,
          editing: editingCellId === cell.id,
          editable:
            editable &&
            isCellEditable(cell, columns[colIndex]?.id ?? '') &&
            !cell.disabled &&
            !row.disabled &&
            editingCellId !== cell.id,
        }"
        @keydown="handleCellKeyDown($event, cell, row.id, columns[colIndex]?.id ?? '')"
        @focusin="editingCellId !== cell.id && setFocusedId(cell.id)"
        @dblclick="
          isCellEditable(cell, columns[colIndex]?.id ?? '') &&
          startEdit(cell.id, row.id, columns[colIndex]?.id ?? '')
        "
      >
        <!-- Edit mode -->
        <template v-if="editingCellId === cell.id">
          <!-- Select -->
          <select
            v-if="getColumnEditType(columns[colIndex]?.id ?? '') === 'select'"
            ref="selectRef"
            v-model="editValue"
            class="apg-data-grid-select"
            @blur="endEdit(cell.id, false)"
            @keydown="handleSelectKeyDown($event, cell.id)"
            @change="
              emit('cellValueChange', cell.id, editValue);
              endEdit(cell.id, false, editValue);
            "
          >
            <option
              v-for="option in getColumnOptions(columns[colIndex]?.id ?? '')"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <!-- Combobox -->
          <div
            v-else-if="getColumnEditType(columns[colIndex]?.id ?? '') === 'combobox'"
            class="apg-data-grid-combobox"
          >
            <input
              ref="inputRef"
              v-model="editValue"
              type="text"
              role="combobox"
              :aria-expanded="comboboxExpanded"
              :aria-controls="`${cell.id}-listbox`"
              aria-autocomplete="list"
              :aria-activedescendant="
                comboboxActiveIndex >= 0 ? `${cell.id}-option-${comboboxActiveIndex}` : undefined
              "
              class="apg-data-grid-input"
              @blur="handleComboboxBlur($event, cell.id)"
              @keydown="handleComboboxKeyDown($event, cell.id, columns[colIndex]?.id ?? '')"
              @input="handleComboboxInput(cell.id, columns[colIndex]?.id ?? '')"
            />
            <ul
              v-if="comboboxExpanded && filteredOptions.length > 0"
              :id="`${cell.id}-listbox`"
              ref="listboxRef"
              role="listbox"
              class="apg-data-grid-listbox"
            >
              <li
                v-for="(option, optIndex) in filteredOptions"
                :id="`${cell.id}-option-${optIndex}`"
                :key="option"
                role="option"
                :aria-selected="optIndex === comboboxActiveIndex"
                class="apg-data-grid-option"
                :class="{ active: optIndex === comboboxActiveIndex }"
                @mousedown.prevent="handleOptionClick(option, cell.id)"
              >
                {{ option }}
              </li>
            </ul>
          </div>
          <!-- Text input (default) -->
          <input
            v-else
            ref="inputRef"
            v-model="editValue"
            type="text"
            class="apg-data-grid-input"
            @blur="endEdit(cell.id, false)"
            @keydown="handleInputKeyDown($event, cell.id)"
            @input="emit('cellValueChange', cell.id, editValue)"
          />
        </template>
        <!-- Display mode -->
        <template v-else>
          <slot name="cell" :cell="cell" :row-id="row.id" :col-id="columns[colIndex]?.id ?? ''">
            {{ cell.value }}
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>
