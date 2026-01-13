<script setup lang="ts">
import { computed, ref, onMounted, nextTick } from 'vue';

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
}

// =============================================================================
// Props & Emits
// =============================================================================

const props = withDefaults(defineProps<Props>(), {
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
  selectionChange: [selectedIds: string[]];
  focusChange: [focusedId: string | null];
  cellActivate: [cellId: string, rowId: string, colId: string];
}>();

// =============================================================================
// State
// =============================================================================

const internalSelectedIds = ref<string[]>([...props.defaultSelectedIds]);
const selectedIds = computed(() => props.selectedIds ?? internalSelectedIds.value);

const focusedId = ref<string | null>(props.defaultFocusedId ?? props.rows[0]?.cells[0]?.id ?? null);

const gridRef = ref<HTMLDivElement | null>(null);
const cellRefs = ref<Map<string, HTMLDivElement>>(new Map());

// =============================================================================
// Computed
// =============================================================================

// Map cellId to cell info for O(1) lookup
const cellById = computed(() => {
  const map = new Map<
    string,
    { rowIndex: number; colIndex: number; cell: GridCellData; rowId: string }
  >();
  props.rows.forEach((row, rowIndex) => {
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
  const entry = cellById.value.get(cellId);
  if (!entry) {
    return null;
  }
  const { rowIndex, colIndex } = entry;
  return { rowIndex, colIndex };
}

function getCellAt(rowIndex: number, colIndex: number) {
  const cell = props.rows[rowIndex]?.cells[colIndex];
  if (!cell) return undefined;
  return cellById.value.get(cell.id);
}

function setFocusedId(id: string | null) {
  focusedId.value = id;
  emit('focusChange', id);
}

function focusCell(cellId: string) {
  const cellEl = cellRefs.value.get(cellId);
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
  startRowIndex: number,
  startColIndex: number,
  direction: 'right' | 'left' | 'up' | 'down',
  skipDisabled = true
): { rowIndex: number; colIndex: number; cell: GridCellData } | null {
  const colCount = props.columns.length;
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
  internalSelectedIds.value = ids;
  emit('selectionChange', ids);
}

function toggleSelection(cellId: string, cell: GridCellData) {
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
  if (!props.selectable || !props.multiselectable) {
    return;
  }

  const allIds = Array.from(cellById.value.values())
    .filter(({ cell }) => !cell.disabled)
    .map(({ cell }) => cell.id);
  setSelectedIds(allIds);
}

function handleKeyDown(event: KeyboardEvent, cell: GridCellData, rowId: string, colId: string) {
  const pos = getCellPosition(cell.id);
  if (!pos) return;

  const { rowIndex, colIndex } = pos;
  let handled = true;

  switch (event.key) {
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
      if (event.ctrlKey) {
        const firstCell = props.rows[0]?.cells[0];
        if (firstCell) focusCell(firstCell.id);
      } else {
        const firstCellInRow = props.rows[rowIndex]?.cells[0];
        if (firstCellInRow) focusCell(firstCellInRow.id);
      }
      break;
    }
    case 'End': {
      if (event.ctrlKey) {
        const lastRow = props.rows[props.rows.length - 1];
        const lastCell = lastRow?.cells[lastRow.cells.length - 1];
        if (lastCell) focusCell(lastCell.id);
      } else {
        const currentRow = props.rows[rowIndex];
        const lastCellInRow = currentRow?.cells[currentRow.cells.length - 1];
        if (lastCellInRow) focusCell(lastCellInRow.id);
      }
      break;
    }
    case 'PageDown': {
      if (props.enablePageNavigation) {
        const targetRowIndex = Math.min(rowIndex + props.pageSize, props.rows.length - 1);
        const targetCell = props.rows[targetRowIndex]?.cells[colIndex];
        if (targetCell) focusCell(targetCell.id);
      } else {
        handled = false;
      }
      break;
    }
    case 'PageUp': {
      if (props.enablePageNavigation) {
        const targetRowIndex = Math.max(rowIndex - props.pageSize, 0);
        const targetCell = props.rows[targetRowIndex]?.cells[colIndex];
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
        emit('cellActivate', cell.id, rowId, colId);
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

function setCellRef(cellId: string, el: HTMLDivElement | null) {
  if (el) {
    cellRefs.value.set(cellId, el);
  } else {
    cellRefs.value.delete(cellId);
  }
}

// Set tabindex="-1" on all focusable elements inside grid cells
// This ensures Tab exits the grid instead of moving between widgets
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
    :aria-multiselectable="multiselectable ? 'true' : undefined"
    :aria-rowcount="totalRows"
    :aria-colcount="totalColumns"
    class="apg-grid"
  >
    <!-- Header Row -->
    <div role="row" :aria-rowindex="totalRows ? 1 : undefined">
      <div
        v-for="(col, colIndex) in columns"
        :key="col.id"
        role="columnheader"
        :aria-colindex="totalColumns ? startColIndex + colIndex : undefined"
        :aria-colspan="col.colspan"
      >
        {{ col.header }}
      </div>
    </div>

    <!-- Data Rows -->
    <div
      v-for="(row, rowIndex) in rows"
      :key="row.id"
      role="row"
      :aria-rowindex="totalRows ? startRowIndex + rowIndex : undefined"
    >
      <div
        v-for="(cell, colIndex) in row.cells"
        :key="cell.id"
        :ref="(el) => setCellRef(cell.id, el as HTMLDivElement)"
        :role="row.hasRowHeader && colIndex === 0 ? 'rowheader' : 'gridcell'"
        :tabindex="cell.id === focusedId ? 0 : -1"
        :aria-selected="selectable ? (selectedIds.includes(cell.id) ? 'true' : 'false') : undefined"
        :aria-disabled="cell.disabled ? 'true' : undefined"
        :aria-colindex="totalColumns ? startColIndex + colIndex : undefined"
        :aria-colspan="cell.colspan"
        :aria-rowspan="cell.rowspan"
        class="apg-grid-cell"
        :class="{
          focused: cell.id === focusedId,
          selected: selectedIds.includes(cell.id),
          disabled: cell.disabled,
        }"
        @keydown="handleKeyDown($event, cell, row.id, columns[colIndex]?.id ?? '')"
        @focusin="setFocusedId(cell.id)"
      >
        <slot name="cell" :cell="cell" :row-id="row.id" :col-id="columns[colIndex]?.id ?? ''">
          {{ cell.value }}
        </slot>
      </div>
    </div>
  </div>
</template>
