<script setup lang="ts">
import { ref } from 'vue';
import Table from './Table.vue';
import type { TableColumn, TableRow, TableCell } from './Table.vue';

const props = defineProps<{
  variant: 'basic' | 'sortable' | 'rowHeader' | 'virtualized' | 'spanning';
}>();

const initialRows: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'] },
  { id: '2', cells: ['Bob', '25', 'Osaka'] },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
  { id: '4', cells: ['Diana', '28', 'Nagoya'] },
  { id: '5', cells: ['Edward', '42', 'Sapporo'] },
];

const basicColumns: TableColumn[] = [
  { id: 'name', header: 'Name' },
  { id: 'age', header: 'Age' },
  { id: 'city', header: 'City' },
];

const sortableColumns = ref<TableColumn[]>([
  { id: 'name', header: 'Name', sortable: true, sort: 'ascending' },
  { id: 'age', header: 'Age', sortable: true },
  { id: 'city', header: 'City', sortable: true },
]);

const sortableRows = ref<TableRow[]>([...initialRows]);

const rowHeaderRows: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'], hasRowHeader: true },
  { id: '2', cells: ['Bob', '25', 'Osaka'], hasRowHeader: true },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'], hasRowHeader: true },
];

const virtualizedRows: TableRow[] = [
  { id: '5', cells: ['Alice', '30', 'Tokyo'], rowIndex: 5 },
  { id: '6', cells: ['Bob', '25', 'Osaka'], rowIndex: 6 },
  { id: '7', cells: ['Charlie', '35', 'Kyoto'], rowIndex: 7 },
  { id: '8', cells: ['Diana', '28', 'Nagoya'], rowIndex: 8 },
  { id: '9', cells: ['Edward', '42', 'Sapporo'], rowIndex: 9 },
];

const spanningColumns: TableColumn[] = [
  { id: 'product', header: 'Product' },
  { id: 'q1', header: 'Q1' },
  { id: 'q2', header: 'Q2' },
  { id: 'q3', header: 'Q3' },
  { id: 'q4', header: 'Q4' },
];

const spanningRows: TableRow[] = [
  {
    id: 'electronics',
    cells: [{ content: 'Electronics', rowspan: 2 } as TableCell, '150', '180', '200', '220'],
  },
  { id: 'electronics-sub', cells: ['175', '190', '210', '240'] },
  {
    id: 'clothing',
    cells: ['Clothing', { content: 'N/A', colspan: 2 } as TableCell, '90', '120'],
  },
  { id: 'summary', cells: [{ content: 'Total', colspan: 4 } as TableCell, '1775'] },
];

function handleSortChange(columnId: string, direction: 'ascending' | 'descending') {
  sortableColumns.value = sortableColumns.value.map((col) => ({
    ...col,
    sort: col.id === columnId ? direction : 'none',
  }));

  const columnIndex = sortableColumns.value.findIndex(({ id }) => id === columnId);
  sortableRows.value = [...sortableRows.value].sort((a, b) => {
    const aVal = a.cells[columnIndex];
    const bVal = b.cells[columnIndex];

    if (columnId === 'age') {
      const aNum = parseInt(aVal, 10);
      const bNum = parseInt(bVal, 10);
      return direction === 'ascending' ? aNum - bNum : bNum - aNum;
    }

    return direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });
}
</script>

<template>
  <Table
    v-if="props.variant === 'basic'"
    :columns="basicColumns"
    :rows="initialRows"
    aria-label="User List"
  />
  <Table
    v-else-if="props.variant === 'sortable'"
    :columns="sortableColumns"
    :rows="sortableRows"
    aria-label="Sortable User List"
    @sort-change="handleSortChange"
  />
  <Table
    v-else-if="props.variant === 'rowHeader'"
    :columns="basicColumns"
    :rows="rowHeaderRows"
    aria-label="User List with Row Headers"
  />
  <Table
    v-else-if="props.variant === 'virtualized'"
    :columns="basicColumns"
    :rows="virtualizedRows"
    aria-label="Virtualized Table (rows 5-9 of 100)"
    :total-rows="100"
    :total-columns="3"
    :start-col-index="1"
  />
  <Table
    v-else-if="props.variant === 'spanning'"
    :columns="spanningColumns"
    :rows="spanningRows"
    aria-label="Quarterly Sales with Spanning Cells"
  />
</template>
