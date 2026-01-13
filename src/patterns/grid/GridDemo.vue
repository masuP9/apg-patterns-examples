<script setup lang="ts">
import { ref } from 'vue';
import Grid from './Grid.vue';

const columns = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
  { id: 'status', header: 'Status' },
];

const rows = [
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
      { id: 'user3-1', value: 'charlie@example.com', disabled: true },
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
];

const selectedIds = ref<string[]>([]);
const multiselectable = ref(true);

function handleSelectionChange(ids: string[]) {
  selectedIds.value = ids;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handleCellActivate(_cellId: string, _rowId: string, _colId: string) {
  // Handle cell activation (e.g., navigate, open modal, etc.)
}
</script>

<template>
  <div class="apg-grid-demo">
    <div class="apg-grid-demo__description">
      <p>
        Use arrow keys to navigate between cells. Press Space to select/deselect cells. Press Enter
        to activate a cell.
      </p>
    </div>

    <div class="apg-grid-demo__controls">
      <label class="flex items-center gap-2">
        <input v-model="multiselectable" type="checkbox" />
        Multi-select mode
      </label>
    </div>

    <Grid
      :columns="columns"
      :rows="rows"
      aria-label="User list"
      selectable
      :multiselectable="multiselectable"
      :selected-ids="selectedIds"
      @selection-change="handleSelectionChange"
      @cell-activate="handleCellActivate"
      enable-page-navigation
      :page-size="2"
    >
      <template #cell="{ cell, colId, rowId }">
        <a v-if="colId === 'name'" :href="`#user-${rowId}`" @click.prevent>{{ cell.value }}</a>
        <template v-else>{{ cell.value }}</template>
      </template>
    </Grid>

    <div v-if="selectedIds.length > 0" class="apg-grid-demo__selection-info">
      <strong>Selected cells:</strong> {{ selectedIds.join(', ') }}
    </div>
  </div>
</template>
