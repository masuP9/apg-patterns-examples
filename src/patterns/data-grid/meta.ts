import type { PatternMeta } from '@/lib/pattern-meta-types';

const dataGridMeta: PatternMeta = {
  title: {
    en: 'Data Grid',
    ja: 'Data Grid',
  },
  description: {
    en: 'An advanced interactive data grid with sorting, row selection, range selection, and cell editing capabilities.',
    ja: 'ソート、行選択、範囲選択、セル編集機能を備えた高度なインタラクティブデータグリッド。',
  },
  hasComparisonSection: true,
  tocItems: {
    en: [
      { id: 'demo', text: 'Demo' },
      { id: 'data-grid-vs-grid', text: 'Data Grid vs Grid' },
      { id: 'accessibility-features', text: 'Accessibility Features' },
      { id: 'source-code', text: 'Source Code' },
      { id: 'usage', text: 'Usage' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'Testing' },
      { id: 'resources', text: 'Resources' },
    ],
    ja: [
      { id: 'demo', text: 'デモ' },
      { id: 'data-grid-vs-grid', text: 'Data Grid vs Grid' },
      { id: 'accessibility-features', text: 'アクセシビリティ機能' },
      { id: 'source-code', text: 'ソースコード' },
      { id: 'usage', text: '使い方' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'テスト' },
      { id: 'resources', text: 'リソース' },
    ],
  },
  resources: [
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
      label: {
        en: 'WAI-ARIA APG: Grid Pattern',
        ja: 'WAI-ARIA APG: Grid パターン',
      },
    },
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/',
      label: {
        en: 'WAI-ARIA APG: Data Grid Examples',
        ja: 'WAI-ARIA APG: Data Grid 例',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'DataGrid.tsx',
      testFile: 'DataGrid.test.tsx',
      lang: 'tsx',
      usageCode: `import { DataGrid } from './DataGrid';
import type { DataGridColumnDef, DataGridRowData, SortDirection } from './DataGrid';

const columns: DataGridColumnDef[] = [
  { id: 'name', header: 'Name', sortable: true },
  { id: 'email', header: 'Email', sortable: true },
  { id: 'role', header: 'Role', sortable: true },
];

const rows: DataGridRowData[] = [
  {
    id: 'user1',
    cells: [
      { id: 'user1-name', value: 'Alice Johnson', editable: true },
      { id: 'user1-email', value: 'alice@example.com', editable: true },
      { id: 'user1-role', value: 'Admin' },
    ],
  },
  {
    id: 'user2',
    cells: [
      { id: 'user2-name', value: 'Bob Smith', editable: true },
      { id: 'user2-email', value: 'bob@example.com', editable: true },
      { id: 'user2-role', value: 'User' },
    ],
  },
];

// Basic Data Grid with sorting
<DataGrid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
  onSort={(columnId, direction) => handleSort(columnId, direction)}
/>

// With row selection
<DataGrid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
  rowSelectable
  rowMultiselectable
  selectedRowIds={selectedRowIds}
  onRowSelectionChange={(ids) => setSelectedRowIds(ids)}
/>

// With range selection and editing
<DataGrid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
  enableRangeSelection
  editable
  onEditEnd={(cellId, value, cancelled) => {
    if (!cancelled) updateCell(cellId, value);
  }}
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'DataGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'DataGridRowData[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible name for grid',
            ja: 'グリッドのアクセシブルな名前',
          },
        },
        {
          name: 'rowSelectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable row selection with checkboxes',
            ja: 'チェックボックスによる行選択を有効化',
          },
        },
        {
          name: 'rowMultiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multiple row selection',
            ja: '複数行選択を有効化',
          },
        },
        {
          name: 'selectedRowIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Selected row IDs',
            ja: '選択された行のID',
          },
        },
        {
          name: 'onRowSelectionChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Row selection change callback',
            ja: '行選択変更コールバック',
          },
        },
        {
          name: 'onSort',
          type: '(columnId, direction) => void',
          default: '-',
          description: {
            en: 'Sort callback',
            ja: 'ソートコールバック',
          },
        },
        {
          name: 'enableRangeSelection',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable Shift+Arrow range selection',
            ja: 'Shift+矢印での範囲選択を有効化',
          },
        },
        {
          name: 'editable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell editing',
            ja: 'セル編集を有効化',
          },
        },
        {
          name: 'onEditEnd',
          type: '(cellId, value, cancelled) => void',
          default: '-',
          description: {
            en: 'Edit end callback',
            ja: '編集終了コールバック',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'DataGrid.vue',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import { ref } from 'vue';
import DataGrid from './DataGrid.vue';
import type { DataGridColumnDef, DataGridRowData, SortDirection } from './DataGrid.vue';

const columns = ref<DataGridColumnDef[]>([
  { id: 'name', header: 'Name', sortable: true },
  { id: 'email', header: 'Email', sortable: true },
  { id: 'role', header: 'Role', sortable: true },
]);

const rows = ref<DataGridRowData[]>([
  {
    id: 'user1',
    cells: [
      { id: 'user1-name', value: 'Alice Johnson', editable: true },
      { id: 'user1-email', value: 'alice@example.com', editable: true },
      { id: 'user1-role', value: 'Admin' },
    ],
  },
]);

const selectedRowIds = ref<string[]>([]);

function handleSort(columnId: string, direction: SortDirection) {
  columns.value = columns.value.map(col => ({
    ...col,
    sortDirection: col.id === columnId ? direction : 'none'
  }));
}
</script>

<template>
  <DataGrid
    :columns="columns"
    :rows="rows"
    aria-label="User list"
    row-selectable
    row-multiselectable
    :selected-row-ids="selectedRowIds"
    @sort="handleSort"
    @row-selection-change="(ids) => selectedRowIds = ids"
    @edit-end="(cellId, value, cancelled) => console.log({ cellId, value, cancelled })"
  />
</template>`,
      apiProps: [
        {
          name: 'columns',
          type: 'DataGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'DataGridRowData[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'row-selectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable row selection',
            ja: '行選択を有効化',
          },
        },
        {
          name: 'enable-range-selection',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable range selection',
            ja: '範囲選択を有効化',
          },
        },
        {
          name: 'editable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell editing',
            ja: 'セル編集を有効化',
          },
        },
      ],
      apiEvents: [
        {
          name: 'sort',
          detail: '(columnId, direction)',
          description: {
            en: 'Emitted when a column is sorted',
            ja: '列がソートされた時に発火',
          },
        },
        {
          name: 'row-selection-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when row selection changes',
            ja: '行選択が変更された時に発火',
          },
        },
        {
          name: 'edit-end',
          detail: '(cellId, value, cancelled)',
          description: {
            en: 'Emitted when cell editing ends',
            ja: 'セル編集が終了した時に発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'DataGrid.svelte',
      lang: 'svelte',
      usageCode: `<script lang="ts">
import DataGrid from './DataGrid.svelte';
import type { DataGridColumnDef, DataGridRowData, SortDirection } from './DataGrid.svelte';

let columns: DataGridColumnDef[] = $state([
  { id: 'name', header: 'Name', sortable: true },
  { id: 'email', header: 'Email', sortable: true },
  { id: 'role', header: 'Role', sortable: true },
]);

let rows: DataGridRowData[] = $state([
  {
    id: 'user1',
    cells: [
      { id: 'user1-name', value: 'Alice Johnson', editable: true },
      { id: 'user1-email', value: 'alice@example.com', editable: true },
      { id: 'user1-role', value: 'Admin' },
    ],
  },
]);

let selectedRowIds: string[] = $state([]);

function handleSort(columnId: string, direction: SortDirection) {
  columns = columns.map(col => ({
    ...col,
    sortDirection: col.id === columnId ? direction : 'none'
  }));
}
</script>

<DataGrid
  {columns}
  {rows}
  ariaLabel="User list"
  rowSelectable
  rowMultiselectable
  {selectedRowIds}
  onSort={handleSort}
  onRowSelectionChange={(ids) => selectedRowIds = ids}
  onEditEnd={(cellId, value, cancelled) => console.log({ cellId, value, cancelled })}
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'DataGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'DataGridRowData[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'rowSelectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable row selection',
            ja: '行選択を有効化',
          },
        },
        {
          name: 'enableRangeSelection',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable range selection',
            ja: '範囲選択を有効化',
          },
        },
        {
          name: 'editable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell editing',
            ja: 'セル編集を有効化',
          },
        },
      ],
      apiEvents: [
        {
          name: 'onSort',
          detail: '(columnId, direction) => void',
          description: {
            en: 'Called when a column is sorted',
            ja: '列がソートされた時に呼ばれる',
          },
        },
        {
          name: 'onRowSelectionChange',
          detail: '(ids: string[]) => void',
          description: {
            en: 'Called when row selection changes',
            ja: '行選択が変更された時に呼ばれる',
          },
        },
        {
          name: 'onEditEnd',
          detail: '(cellId, value, cancelled) => void',
          description: {
            en: 'Called when cell editing ends',
            ja: 'セル編集が終了した時に呼ばれる',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'DataGrid.astro',
      lang: 'astro',
      usageCode: `---
import DataGrid from './DataGrid.astro';

const columns = [
  { id: 'name', header: 'Name', sortable: true, sortDirection: 'ascending' },
  { id: 'email', header: 'Email', sortable: true },
  { id: 'role', header: 'Role', sortable: true },
];

const rows = [
  {
    id: 'user1',
    cells: [
      { id: 'user1-name', value: 'Alice Johnson', editable: true },
      { id: 'user1-email', value: 'alice@example.com', editable: true },
      { id: 'user1-role', value: 'Admin' },
    ],
  },
];
---

<!-- Basic Data Grid -->
<DataGrid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
/>

<!-- With row selection -->
<DataGrid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
  rowSelectable
  rowMultiselectable
/>

<!-- With range selection and editing -->
<DataGrid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
  enableRangeSelection
  editable
/>

<!-- Listen to events via custom events -->
<script>
  document.querySelector('apg-data-grid').addEventListener('datagrid:sort', (e) => {
    console.log('Sort:', e.detail);
  });
  document.querySelector('apg-data-grid').addEventListener('datagrid:rowselect', (e) => {
    console.log('Row selection:', e.detail);
  });
  document.querySelector('apg-data-grid').addEventListener('datagrid:editend', (e) => {
    console.log('Edit end:', e.detail);
  });
</script>`,
      apiProps: [
        {
          name: 'columns',
          type: 'DataGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'DataGridRowData[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'rowSelectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable row selection',
            ja: '行選択を有効化',
          },
        },
        {
          name: 'enableRangeSelection',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable range selection',
            ja: '範囲選択を有効化',
          },
        },
        {
          name: 'editable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell editing',
            ja: 'セル編集を有効化',
          },
        },
      ],
      apiEvents: [
        {
          name: 'datagrid:sort',
          detail: '{ columnId, direction }',
          description: {
            en: 'Fired when a column is sorted',
            ja: '列がソートされた時に発火',
          },
        },
        {
          name: 'datagrid:rowselect',
          detail: '{ rowIds }',
          description: {
            en: 'Fired when row selection changes',
            ja: '行選択が変更された時に発火',
          },
        },
        {
          name: 'datagrid:editend',
          detail: '{ cellId, value, cancelled }',
          description: {
            en: 'Fired when cell editing ends',
            ja: 'セル編集が終了した時に発火',
          },
        },
      ],
    },
  },
};

export default dataGridMeta;
