<script setup lang="ts">
import type { VNode } from 'vue';

defineOptions({ inheritAttrs: false });

export interface TableColumn {
  id: string;
  header: string;
  /** Column is sortable */
  sortable?: boolean;
  /** Current sort direction */
  sort?: 'ascending' | 'descending' | 'none';
}

/**
 * Cell with spanning support
 */
export interface TableCell {
  content: string | VNode;
  /** Number of columns this cell spans */
  colspan?: number;
  /** Number of rows this cell spans */
  rowspan?: number;
}

/**
 * Cell value - can be simple string/VNode or object with spanning
 */
export type TableCellValue = string | VNode | TableCell;

/**
 * Type guard to check if cell is a TableCell object
 */
function isTableCell(cell: TableCellValue): cell is TableCell {
  return typeof cell === 'object' && cell !== null && 'content' in cell;
}

export interface TableRow {
  id: string;
  cells: TableCellValue[];
  /** First cell is row header */
  hasRowHeader?: boolean;
  /** Row index for virtualization (1-based) */
  rowIndex?: number;
}

interface Props {
  /** Column definitions */
  columns: TableColumn[];
  /** Row data */
  rows: TableRow[];
  /** Caption text (optional) */
  caption?: string;

  // Virtualization support
  /** Total number of columns (for virtualization) */
  totalColumns?: number;
  /** Total number of rows (for virtualization) */
  totalRows?: number;
  /** Starting column index (1-based, for virtualization) */
  startColIndex?: number;
}

defineProps<Props>();

const emit = defineEmits<{
  sortChange: [columnId: string, direction: 'ascending' | 'descending'];
}>();

function handleSortClick(column: TableColumn) {
  if (!column.sortable) return;

  const newDirection: 'ascending' | 'descending' =
    column.sort === 'ascending' ? 'descending' : 'ascending';
  emit('sortChange', column.id, newDirection);
}

function getSortIcon(sort?: 'ascending' | 'descending' | 'none'): string {
  if (sort === 'ascending') return '▲';
  if (sort === 'descending') return '▼';
  return '⇅';
}
</script>

<template>
  <div
    role="table"
    class="apg-table"
    :style="{ '--table-cols': columns.length }"
    :aria-colcount="totalColumns"
    :aria-rowcount="totalRows"
    v-bind="$attrs"
  >
    <div v-if="caption" class="apg-table-caption">{{ caption }}</div>

    <!-- Header rowgroup -->
    <div role="rowgroup" class="apg-table-header">
      <div role="row" class="apg-table-row">
        <div
          v-for="(column, colIndex) in columns"
          :key="column.id"
          role="columnheader"
          class="apg-table-columnheader"
          :aria-sort="column.sortable ? column.sort || 'none' : undefined"
          :aria-colindex="startColIndex !== undefined ? startColIndex + colIndex : undefined"
        >
          <button
            v-if="column.sortable"
            type="button"
            class="apg-table-sort-button"
            :aria-label="`Sort by ${column.header}`"
            @click="handleSortClick(column)"
          >
            {{ column.header }}
            <span class="apg-table-sort-icon" aria-hidden="true">
              {{ getSortIcon(column.sort) }}
            </span>
          </button>
          <template v-else>{{ column.header }}</template>
        </div>
      </div>
    </div>

    <!-- Body rowgroup -->
    <div role="rowgroup" class="apg-table-body">
      <div
        v-for="row in rows"
        :key="row.id"
        role="row"
        class="apg-table-row"
        :aria-rowindex="row.rowIndex"
      >
        <div
          v-for="(cell, cellIndex) in row.cells"
          :key="cellIndex"
          :role="row.hasRowHeader && cellIndex === 0 ? 'rowheader' : 'cell'"
          :class="`apg-table-${row.hasRowHeader && cellIndex === 0 ? 'rowheader' : 'cell'}`"
          :style="{
            gridColumn:
              isTableCell(cell) && cell.colspan && cell.colspan > 1
                ? `span ${cell.colspan}`
                : undefined,
            gridRow:
              isTableCell(cell) && cell.rowspan && cell.rowspan > 1
                ? `span ${cell.rowspan}`
                : undefined,
          }"
          :aria-colindex="startColIndex !== undefined ? startColIndex + cellIndex : undefined"
          :aria-colspan="
            isTableCell(cell) && cell.colspan && cell.colspan > 1 ? cell.colspan : undefined
          "
          :aria-rowspan="
            isTableCell(cell) && cell.rowspan && cell.rowspan > 1 ? cell.rowspan : undefined
          "
        >
          {{ isTableCell(cell) ? cell.content : cell }}
        </div>
      </div>
    </div>
  </div>
</template>
