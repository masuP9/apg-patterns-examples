<script setup lang="ts">
import { ref } from 'vue';
import DataGrid from './DataGrid.vue';
import type { DataGridColumnDef, DataGridRowData, SortDirection } from './DataGrid.vue';

// Role options for combobox
const roleOptions = ['Admin', 'Editor', 'Viewer', 'Moderator', 'Guest'];

// Status options for select
const statusOptions = ['Active', 'Inactive'];

const columns = ref<DataGridColumnDef[]>([
  { id: 'name', header: 'Name', sortable: true, sortDirection: 'none', isRowLabel: true },
  { id: 'email', header: 'Email', sortable: true, sortDirection: 'none' },
  {
    id: 'role',
    header: 'Role',
    sortable: true,
    sortDirection: 'none',
    editable: true,
    editType: 'combobox',
    options: roleOptions,
  },
  {
    id: 'status',
    header: 'Status',
    sortable: false,
    editable: true,
    editType: 'select',
    options: statusOptions,
  },
]);

const rows = ref<DataGridRowData[]>([
  {
    id: 'user1',
    cells: [
      { id: 'user1-0', value: 'Alice Johnson' },
      { id: 'user1-1', value: 'alice@example.com' },
      { id: 'user1-2', value: 'Admin' },
      { id: 'user1-3', value: 'Active' },
    ],
  },
  {
    id: 'user2',
    cells: [
      { id: 'user2-0', value: 'Bob Smith' },
      { id: 'user2-1', value: 'bob@example.com' },
      { id: 'user2-2', value: 'Editor' },
      { id: 'user2-3', value: 'Active' },
    ],
  },
  {
    id: 'user3',
    cells: [
      { id: 'user3-0', value: 'Charlie Brown' },
      { id: 'user3-1', value: 'charlie@example.com' },
      { id: 'user3-2', value: 'Viewer' },
      { id: 'user3-3', value: 'Inactive' },
    ],
  },
  {
    id: 'user4',
    cells: [
      { id: 'user4-0', value: 'Diana Prince' },
      { id: 'user4-1', value: 'diana@example.com' },
      { id: 'user4-2', value: 'Admin' },
      { id: 'user4-3', value: 'Active' },
    ],
  },
  {
    id: 'user5',
    cells: [
      { id: 'user5-0', value: 'Eve Wilson' },
      { id: 'user5-1', value: 'eve@example.com' },
      { id: 'user5-2', value: 'Editor' },
      { id: 'user5-3', value: 'Active' },
    ],
  },
]);

const selectedRowIds = ref<string[]>([]);
const rangeSelectedIds = ref<string[]>([]);
const rowSelectable = ref(true);
const rowMultiselectable = ref(true);
const enableRangeSelection = ref(false);
const editable = ref(true);

function handleSort(columnId: string, direction: SortDirection) {
  columns.value = columns.value.map((col) => ({
    ...col,
    sortDirection: col.id === columnId ? direction : 'none',
  }));

  const colIndex = ['name', 'email', 'role', 'status'].indexOf(columnId);
  if (colIndex === -1) return;

  rows.value = [...rows.value].sort((a, b) => {
    const aValue = String(a.cells[colIndex]?.value ?? '');
    const bValue = String(b.cells[colIndex]?.value ?? '');
    const comparison = aValue.localeCompare(bValue);
    return direction === 'ascending' ? comparison : -comparison;
  });
}

function handleRowSelectionChange(ids: string[]) {
  selectedRowIds.value = ids;
}

function handleRangeSelect(ids: string[]) {
  rangeSelectedIds.value = ids;
}

function handleEditEnd(cellId: string, value: string, cancelled: boolean) {
  if (cancelled) return;

  rows.value = rows.value.map((row) => ({
    ...row,
    cells: row.cells.map((cell) => (cell.id === cellId ? { ...cell, value } : cell)),
  }));
}
</script>

<template>
  <div class="apg-data-grid-demo">
    <div class="apg-data-grid-demo__controls">
      <label class="flex items-center gap-2">
        <input v-model="rowSelectable" type="checkbox" />
        Row Selection
      </label>
      <label v-if="rowSelectable" class="flex items-center gap-2">
        <input v-model="rowMultiselectable" type="checkbox" />
        Multi-select
      </label>
      <label class="flex items-center gap-2">
        <input v-model="enableRangeSelection" type="checkbox" />
        Range Selection
      </label>
      <label class="flex items-center gap-2">
        <input v-model="editable" type="checkbox" />
        Editable
      </label>
    </div>

    <DataGrid
      :columns="columns"
      :rows="rows"
      aria-label="User list"
      :row-selectable="rowSelectable"
      :row-multiselectable="rowMultiselectable"
      :selected-row-ids="selectedRowIds"
      :enable-range-selection="enableRangeSelection"
      :editable="editable"
      enable-page-navigation
      :page-size="3"
      @sort="handleSort"
      @row-selection-change="handleRowSelectionChange"
      @range-select="handleRangeSelect"
      @edit-end="handleEditEnd"
    >
      <template #cell="{ cell, colId }">
        <span
          v-if="colId === 'status'"
          :class="['status-badge', cell.value === 'Active' ? 'status-active' : 'status-inactive']"
        >
          {{ cell.value }}
        </span>
        <template v-else>{{ cell.value }}</template>
      </template>
    </DataGrid>

    <div v-if="selectedRowIds.length > 0" class="apg-data-grid-demo__selection-info">
      <strong>Selected rows:</strong> {{ selectedRowIds.join(', ') }}
    </div>

    <div v-if="rangeSelectedIds.length > 0" class="apg-data-grid-demo__selection-info">
      <strong>Range selected cells:</strong> {{ rangeSelectedIds.join(', ') }}
    </div>

    <div class="apg-data-grid-demo__description">
      <p>
        <strong>Navigation:</strong> Arrow keys to navigate, Home/End for row bounds, Ctrl+Home/End
        for grid bounds.
      </p>
      <p>
        <strong>Sorting:</strong> Click or press Enter/Space on a sortable column header to cycle
        sort direction.
      </p>
      <p v-if="rowSelectable">
        <strong>Row Selection:</strong> Click checkboxes or press Space to select/deselect rows.
      </p>
      <p v-if="enableRangeSelection">
        <strong>Range Selection:</strong> Hold Shift and use arrow keys to extend selection.
      </p>
      <p v-if="editable">
        <strong>Editing:</strong> Press Enter or F2 on an editable cell (Role/Status, indicated by
        pen icon) to edit. Role uses combobox with autocomplete, Status uses select dropdown. Escape
        to cancel.
      </p>
    </div>
  </div>
</template>
