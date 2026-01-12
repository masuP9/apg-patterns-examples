<script setup lang="ts">
import { computed, ref, onMounted, nextTick, type Ref } from 'vue';

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
}

// =============================================================================
// Props & Emits
// =============================================================================

const props = withDefaults(defineProps<Props>(), {
  selectable: false,
  multiselectable: false,
  defaultSelectedRowIds: () => [],
  defaultExpandedIds: () => [],
  startRowIndex: 2,
  startColIndex: 1,
  enablePageNavigation: false,
  pageSize: 5,
});

const emit = defineEmits<{
  expandedChange: [expandedIds: string[]];
  selectionChange: [selectedRowIds: string[]];
  focusChange: [cellId: string | null];
  cellActivate: [cellId: string, rowId: string, colId: string];
}>();

// =============================================================================
// State
// =============================================================================

const internalExpandedIds = ref<Set<string>>(new Set(props.defaultExpandedIds));
const expandedIds = computed(() => {
  if (props.expandedIds) {
    return new Set(props.expandedIds);
  }
  return internalExpandedIds.value;
});

const internalSelectedRowIds = ref<Set<string>>(new Set(props.defaultSelectedRowIds));
const selectedRowIds = computed(() => {
  if (props.selectedRowIds) {
    return new Set(props.selectedRowIds);
  }
  return internalSelectedRowIds.value;
});

const focusedCellId = ref<string | null>(null);
const treegridRef = ref<HTMLDivElement | null>(null);
const cellRefs = ref<Map<string, HTMLDivElement>>(new Map());

// =============================================================================
// Computed - Flatten Tree
// =============================================================================

const flattenTree = (
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
};

const allRows = computed(() => flattenTree(props.nodes));

const rowMap = computed(() => {
  const map = new Map<string, FlatRow>();
  for (const flatRow of allRows.value) {
    map.set(flatRow.node.id, flatRow);
  }
  return map;
});

const visibleRows = computed(() => {
  const result: FlatRow[] = [];
  const collapsedParents = new Set<string>();

  for (const flatRow of allRows.value) {
    let isHidden = false;
    let currentParentId = flatRow.parentId;

    while (currentParentId) {
      if (collapsedParents.has(currentParentId) || !expandedIds.value.has(currentParentId)) {
        isHidden = true;
        break;
      }
      const parent = rowMap.value.get(currentParentId);
      currentParentId = parent?.parentId ?? null;
    }

    if (!isHidden) {
      result.push(flatRow);
      if (flatRow.hasChildren && !expandedIds.value.has(flatRow.node.id)) {
        collapsedParents.add(flatRow.node.id);
      }
    }
  }
  return result;
});

// =============================================================================
// Cell Position Tracking
// =============================================================================

interface CellPosition {
  rowIndex: number;
  colIndex: number;
  cell: TreeGridCellData;
  rowId: string;
  isRowHeader: boolean;
}

const cellPositionMap = computed(() => {
  const map = new Map<string, CellPosition>();
  visibleRows.value.forEach((flatRow, rowIndex) => {
    flatRow.node.cells.forEach((cell, colIndex) => {
      map.set(cell.id, {
        rowIndex,
        colIndex,
        cell,
        rowId: flatRow.node.id,
        isRowHeader: props.columns[colIndex]?.isRowHeader ?? false,
      });
    });
  });
  return map;
});

// =============================================================================
// Initialize Focus
// =============================================================================

onMounted(() => {
  const initialFocusId =
    props.defaultFocusedCellId ?? visibleRows.value[0]?.node.cells[0]?.id ?? null;
  focusedCellId.value = initialFocusId;

  nextTick(() => {
    if (treegridRef.value) {
      const focusableElements = treegridRef.value.querySelectorAll<HTMLElement>(
        '[role="gridcell"] a[href], [role="gridcell"] button, [role="rowheader"] a[href], [role="rowheader"] button'
      );
      focusableElements.forEach((el) => {
        el.setAttribute('tabindex', '-1');
      });
    }
  });
});

// =============================================================================
// Methods
// =============================================================================

function setFocusedCellId(id: string | null) {
  focusedCellId.value = id;
  emit('focusChange', id);
}

function focusCell(cellId: string) {
  const cellEl = cellRefs.value.get(cellId);
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
  if (!props.expandedIds) {
    internalExpandedIds.value = newExpandedIds;
  }
  emit('expandedChange', [...newExpandedIds]);
}

function expandRow(rowId: string) {
  const flatRow = rowMap.value.get(rowId);
  if (!flatRow?.hasChildren || flatRow.node.disabled) return;
  if (expandedIds.value.has(rowId)) return;

  const newExpanded = new Set(expandedIds.value);
  newExpanded.add(rowId);
  updateExpandedIds(newExpanded);
}

function collapseRow(rowId: string, currentFocusCellId?: string) {
  const flatRow = rowMap.value.get(rowId);
  if (!flatRow?.hasChildren || flatRow.node.disabled) return;
  if (!expandedIds.value.has(rowId)) return;

  const newExpanded = new Set(expandedIds.value);
  newExpanded.delete(rowId);
  updateExpandedIds(newExpanded);

  // If focus was on a child, move focus to the collapsed parent's first cell
  if (currentFocusCellId) {
    const focusPos = cellPositionMap.value.get(currentFocusCellId);
    if (focusPos) {
      const focusRowId = focusPos.rowId;
      let currentRow = rowMap.value.get(focusRowId);
      while (currentRow) {
        if (currentRow.parentId === rowId) {
          // Focus is on a descendant - move to parent's first cell
          const parentRow = rowMap.value.get(rowId);
          if (parentRow) {
            const parentFirstCell = parentRow.node.cells[0];
            if (parentFirstCell) {
              nextTick(() => focusCell(parentFirstCell.id));
            }
          }
          break;
        }
        currentRow = currentRow.parentId ? rowMap.value.get(currentRow.parentId) : undefined;
      }
    }
  }
}

function updateSelectedRowIds(newSelectedIds: Set<string>) {
  if (!props.selectedRowIds) {
    internalSelectedRowIds.value = newSelectedIds;
  }
  emit('selectionChange', [...newSelectedIds]);
}

function toggleRowSelection(rowId: string, rowDisabled?: boolean) {
  if (!props.selectable || rowDisabled) return;

  if (props.multiselectable) {
    const newIds = new Set(selectedRowIds.value);
    if (newIds.has(rowId)) {
      newIds.delete(rowId);
    } else {
      newIds.add(rowId);
    }
    updateSelectedRowIds(newIds);
  } else {
    const newIds = selectedRowIds.value.has(rowId) ? new Set<string>() : new Set([rowId]);
    updateSelectedRowIds(newIds);
  }
}

function selectAllVisibleRows() {
  if (!props.selectable || !props.multiselectable) return;

  const allIds = new Set<string>();
  for (const flatRow of visibleRows.value) {
    if (!flatRow.node.disabled) {
      allIds.add(flatRow.node.id);
    }
  }
  updateSelectedRowIds(allIds);
}

function findNextVisibleRow(
  startRowIndex: number,
  direction: 'up' | 'down',
  pageSize = 1
): number | null {
  if (direction === 'down') {
    const targetIndex = Math.min(startRowIndex + pageSize, visibleRows.value.length - 1);
    return targetIndex > startRowIndex ? targetIndex : null;
  } else {
    const targetIndex = Math.max(startRowIndex - pageSize, 0);
    return targetIndex < startRowIndex ? targetIndex : null;
  }
}

function handleKeyDown(event: KeyboardEvent, cell: TreeGridCellData, rowId: string) {
  const pos = cellPositionMap.value.get(cell.id);
  if (!pos) return;

  const { rowIndex, colIndex, isRowHeader } = pos;
  const flatRow = visibleRows.value[rowIndex];
  const colCount = props.columns.length;

  let handled = true;

  switch (event.key) {
    case 'ArrowRight': {
      if (
        isRowHeader &&
        flatRow.hasChildren &&
        !flatRow.node.disabled &&
        !expandedIds.value.has(rowId)
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
        // At rowheader: collapse if expanded, move to parent if collapsed
        if (flatRow.hasChildren && expandedIds.value.has(rowId) && !flatRow.node.disabled) {
          collapseRow(rowId, cell.id);
        } else if (flatRow.parentId) {
          // Move to parent row's rowheader
          const parentRow = rowMap.value.get(flatRow.parentId);
          if (parentRow) {
            const parentVisibleIndex = visibleRows.value.findIndex(
              (r) => r.node.id === flatRow.parentId
            );
            if (parentVisibleIndex !== -1) {
              const parentCell = parentRow.node.cells[colIndex];
              if (parentCell) focusCell(parentCell.id);
            }
          }
        }
      } else {
        // At non-rowheader: move left
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
        const nextRow = visibleRows.value[nextRowIndex];
        const nextCell = nextRow?.node.cells[colIndex];
        if (nextCell) focusCell(nextCell.id);
      }
      break;
    }
    case 'ArrowUp': {
      const prevRowIndex = findNextVisibleRow(rowIndex, 'up');
      if (prevRowIndex !== null) {
        const prevRow = visibleRows.value[prevRowIndex];
        const prevCell = prevRow?.node.cells[colIndex];
        if (prevCell) focusCell(prevCell.id);
      }
      break;
    }
    case 'Home': {
      if (event.ctrlKey) {
        const firstCell = visibleRows.value[0]?.node.cells[0];
        if (firstCell) focusCell(firstCell.id);
      } else {
        const firstCellInRow = flatRow.node.cells[0];
        if (firstCellInRow) focusCell(firstCellInRow.id);
      }
      break;
    }
    case 'End': {
      if (event.ctrlKey) {
        const lastRow = visibleRows.value[visibleRows.value.length - 1];
        const lastCell = lastRow?.node.cells[lastRow.node.cells.length - 1];
        if (lastCell) focusCell(lastCell.id);
      } else {
        const lastCellInRow = flatRow.node.cells[flatRow.node.cells.length - 1];
        if (lastCellInRow) focusCell(lastCellInRow.id);
      }
      break;
    }
    case 'PageDown': {
      if (props.enablePageNavigation) {
        const targetRowIndex = Math.min(rowIndex + props.pageSize, visibleRows.value.length - 1);
        const targetRow = visibleRows.value[targetRowIndex];
        const targetCell = targetRow?.node.cells[colIndex];
        if (targetCell) focusCell(targetCell.id);
      } else {
        handled = false;
      }
      break;
    }
    case 'PageUp': {
      if (props.enablePageNavigation) {
        const targetRowIndex = Math.max(rowIndex - props.pageSize, 0);
        const targetRow = visibleRows.value[targetRowIndex];
        const targetCell = targetRow?.node.cells[colIndex];
        if (targetCell) focusCell(targetCell.id);
      } else {
        handled = false;
      }
      break;
    }
    case ' ': {
      // Space toggles ROW selection
      toggleRowSelection(rowId, flatRow.node.disabled);
      break;
    }
    case 'Enter': {
      // Enter activates cell, does NOT expand/collapse
      if (!cell.disabled && !flatRow.node.disabled) {
        emit('cellActivate', cell.id, rowId, props.columns[colIndex]?.id ?? '');
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

function setCellRef(cellId: string, el: HTMLDivElement | null) {
  if (el) {
    cellRefs.value.set(cellId, el);
  } else {
    cellRefs.value.delete(cellId);
  }
}

// =============================================================================
// Helper Functions for Template
// =============================================================================

function getRowAriaExpanded(flatRow: FlatRow): 'true' | 'false' | undefined {
  if (!flatRow.hasChildren) return undefined;
  return expandedIds.value.has(flatRow.node.id) ? 'true' : 'false';
}

function getRowAriaSelected(flatRow: FlatRow): 'true' | 'false' | undefined {
  if (!props.selectable) return undefined;
  return selectedRowIds.value.has(flatRow.node.id) ? 'true' : 'false';
}

function getCellRole(colIndex: number): 'rowheader' | 'gridcell' {
  return props.columns[colIndex]?.isRowHeader ? 'rowheader' : 'gridcell';
}

function getExpandIcon(flatRow: FlatRow): string {
  if (!flatRow.hasChildren) return '';
  return expandedIds.value.has(flatRow.node.id) ? '\u25BC' : '\u25B6';
}
</script>

<template>
  <div
    ref="treegridRef"
    role="treegrid"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :aria-multiselectable="multiselectable ? 'true' : undefined"
    :aria-rowcount="totalRows"
    :aria-colcount="totalColumns"
    class="apg-treegrid"
  >
    <!-- Header Row -->
    <div role="row" :aria-rowindex="totalRows ? 1 : undefined">
      <div
        v-for="(col, colIndex) in columns"
        :key="col.id"
        role="columnheader"
        :aria-colindex="totalColumns ? startColIndex + colIndex : undefined"
      >
        {{ col.header }}
      </div>
    </div>

    <!-- Data Rows -->
    <div
      v-for="(flatRow, rowIndex) in visibleRows"
      :key="flatRow.node.id"
      role="row"
      :aria-level="flatRow.level"
      :aria-expanded="getRowAriaExpanded(flatRow)"
      :aria-selected="getRowAriaSelected(flatRow)"
      :aria-disabled="flatRow.node.disabled ? 'true' : undefined"
      :aria-rowindex="totalRows ? startRowIndex + rowIndex : undefined"
    >
      <div
        v-for="(cell, colIndex) in flatRow.node.cells"
        :key="cell.id"
        :ref="(el) => setCellRef(cell.id, el as HTMLDivElement)"
        :role="getCellRole(colIndex)"
        :tabindex="cell.id === focusedCellId ? 0 : -1"
        :aria-disabled="cell.disabled || flatRow.node.disabled ? 'true' : undefined"
        :aria-colindex="totalColumns ? startColIndex + colIndex : undefined"
        :aria-colspan="cell.colspan"
        class="apg-treegrid-cell"
        :class="{
          focused: cell.id === focusedCellId,
          selected: selectedRowIds.has(flatRow.node.id),
          disabled: cell.disabled || flatRow.node.disabled,
        }"
        :style="{
          paddingLeft: columns[colIndex]?.isRowHeader
            ? `${(flatRow.level - 1) * 20 + 8}px`
            : undefined,
        }"
        @keydown="handleKeyDown($event, cell, flatRow.node.id)"
        @focusin="setFocusedCellId(cell.id)"
      >
        <span
          v-if="columns[colIndex]?.isRowHeader && flatRow.hasChildren"
          class="expand-icon"
          aria-hidden="true"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </span>
        <slot
          name="cell"
          :cell="cell"
          :row-id="flatRow.node.id"
          :col-id="columns[colIndex]?.id ?? ''"
        >
          {{ cell.value }}
        </slot>
      </div>
    </div>
  </div>
</template>
