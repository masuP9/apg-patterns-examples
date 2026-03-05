import type { ApiSubComponent, PatternMeta } from '@/lib/pattern-meta-types';

function createTableSubComponents(cellContentType: string, cellsType: string): ApiSubComponent[] {
  return [
    {
      name: 'TableColumn',
      props: [
        {
          name: 'id',
          type: 'string',
          default: 'required',
          description: { en: 'Unique column identifier', ja: '列の一意な識別子' },
        },
        {
          name: 'header',
          type: 'string',
          default: 'required',
          description: { en: 'Column header text', ja: '列ヘッダーテキスト' },
        },
        {
          name: 'sortable',
          type: 'boolean',
          default: 'false',
          description: { en: 'Whether column is sortable', ja: '列がソート可能かどうか' },
        },
        {
          name: 'sort',
          type: "'ascending' | 'descending' | 'none'",
          default: '-',
          description: { en: 'Current sort direction', ja: '現在のソート方向' },
        },
      ],
    },
    {
      name: 'TableCell',
      props: [
        {
          name: 'content',
          type: cellContentType,
          default: 'required',
          description: { en: 'Cell content', ja: 'セルの内容' },
        },
        {
          name: 'colspan',
          type: 'number',
          default: '-',
          description: { en: 'Number of columns to span', ja: '結合する列数' },
        },
        {
          name: 'rowspan',
          type: 'number',
          default: '-',
          description: { en: 'Number of rows to span', ja: '結合する行数' },
        },
      ],
    },
    {
      name: 'TableRow',
      props: [
        {
          name: 'id',
          type: 'string',
          default: 'required',
          description: { en: 'Unique row identifier', ja: '行の一意な識別子' },
        },
        {
          name: 'cells',
          type: cellsType,
          default: 'required',
          description: { en: 'Array of cell data', ja: 'セルデータの配列' },
        },
        {
          name: 'hasRowHeader',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Whether first cell is a row header',
            ja: '最初のセルを行ヘッダーにするかどうか',
          },
        },
        {
          name: 'rowIndex',
          type: 'number',
          default: '-',
          description: {
            en: 'Row index for virtualization',
            ja: '仮想化用の行インデックス',
          },
        },
      ],
    },
  ];
}

const tableMeta: PatternMeta = {
  title: {
    en: 'Table',
    ja: 'テーブル',
  },
  description: {
    en: 'A static tabular structure for displaying data with rows and columns.',
    ja: '行と列でデータを表示するための静的な表構造。',
  },
  tocItems: {
    en: [
      { id: 'demo', text: 'Demo' },
      { id: 'native-html', text: 'Native HTML' },
      { id: 'accessibility-features', text: 'Accessibility Features' },
      { id: 'source-code', text: 'Source Code' },
      { id: 'usage', text: 'Usage' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'Testing' },
      { id: 'resources', text: 'Resources' },
    ],
    ja: [
      { id: 'demo', text: 'デモ' },
      { id: 'native-html', text: 'ネイティブ HTML' },
      { id: 'accessibility-features', text: 'アクセシビリティ機能' },
      { id: 'source-code', text: 'ソースコード' },
      { id: 'usage', text: '使い方' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'テスト' },
      { id: 'resources', text: 'リソース' },
    ],
  },
  hasNativeHtmlNotice: true,
  resources: [
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/',
      label: {
        en: 'WAI-ARIA APG: Table Pattern',
        ja: 'WAI-ARIA APG: Table パターン',
      },
    },
    {
      href: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table',
      label: {
        en: 'MDN: <table> element',
        ja: 'MDN: <table> 要素',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Table.tsx',
      testFile: 'Table.test.tsx',
      lang: 'tsx',
      usageCode: `import { Table } from './Table';
import type { TableColumn, TableRow } from './Table';

const columns: TableColumn[] = [
  { id: 'name', header: 'Name' },
  { id: 'age', header: 'Age' },
  { id: 'city', header: 'City' },
];

const rows: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'] },
  { id: '2', cells: ['Bob', '25', 'Osaka'] },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
];

// Basic table
<Table
  columns={columns}
  rows={rows}
  aria-label="User List"
/>

// Sortable columns
const sortableColumns: TableColumn[] = [
  { id: 'name', header: 'Name', sortable: true, sort: 'ascending' },
  { id: 'age', header: 'Age', sortable: true },
  { id: 'city', header: 'City' },
];

<Table
  columns={sortableColumns}
  rows={rows}
  aria-label="Sortable User List"
  onSortChange={(columnId, direction) => {
    console.log(\`Sort \${columnId} \${direction}\`);
  }}
/>

// With row headers
const rowsWithHeaders: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'], hasRowHeader: true },
  { id: '2', cells: ['Bob', '25', 'Osaka'], hasRowHeader: true },
];

<Table
  columns={columns}
  rows={rowsWithHeaders}
  aria-label="User List with Row Headers"
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TableColumn[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'TableRow[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'caption',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional table caption',
            ja: 'テーブルのキャプション（任意）',
          },
        },
        {
          name: 'onSortChange',
          type: '(columnId: string, direction) => void',
          default: '-',
          description: {
            en: 'Callback when sort changes',
            ja: 'ソート変更時のコールバック',
          },
        },
        {
          name: 'totalColumns',
          type: 'number',
          default: '-',
          description: {
            en: 'Total columns (for virtualization)',
            ja: '総列数（仮想化用）',
          },
        },
        {
          name: 'totalRows',
          type: 'number',
          default: '-',
          description: {
            en: 'Total rows (for virtualization)',
            ja: '総行数（仮想化用）',
          },
        },
        {
          name: 'startColIndex',
          type: 'number',
          default: '-',
          description: {
            en: 'Starting column index (1-based)',
            ja: '開始列インデックス（1始まり）',
          },
        },
      ],
      apiSubComponents: createTableSubComponents(
        'string | ReactNode',
        '(string | ReactNode | TableCell)[]'
      ),
    },
    vue: {
      sourceFile: 'Table.vue',
      testFile: 'Table.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import Table from './Table.vue';
import type { TableColumn, TableRow } from './Table.vue';

const columns: TableColumn[] = [
  { id: 'name', header: 'Name' },
  { id: 'age', header: 'Age' },
  { id: 'city', header: 'City' },
];

const rows: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'] },
  { id: '2', cells: ['Bob', '25', 'Osaka'] },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
];

// Sortable columns
const sortableColumns = ref<TableColumn[]>([
  { id: 'name', header: 'Name', sortable: true, sort: 'ascending' },
  { id: 'age', header: 'Age', sortable: true },
  { id: 'city', header: 'City' },
]);

function handleSortChange(columnId: string, direction: 'ascending' | 'descending') {
  // Handle sort change
}
</script>

<template>
  <!-- Basic table -->
  <Table :columns="columns" :rows="rows" aria-label="User List" />

  <!-- Sortable table -->
  <Table
    :columns="sortableColumns"
    :rows="rows"
    aria-label="Sortable User List"
    :on-sort-change="handleSortChange"
  />

  <!-- With row headers -->
  <Table
    :columns="columns"
    :rows="rowsWithHeaders"
    aria-label="User List with Row Headers"
  />
</template>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TableColumn[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'TableRow[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'caption',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional table caption',
            ja: 'テーブルのキャプション（任意）',
          },
        },
        {
          name: 'onSortChange',
          type: '(columnId: string, direction) => void',
          default: '-',
          description: {
            en: 'Callback when sort changes',
            ja: 'ソート変更時のコールバック',
          },
        },
        {
          name: 'totalColumns',
          type: 'number',
          default: '-',
          description: {
            en: 'Total columns (for virtualization)',
            ja: '総列数（仮想化用）',
          },
        },
        {
          name: 'totalRows',
          type: 'number',
          default: '-',
          description: {
            en: 'Total rows (for virtualization)',
            ja: '総行数（仮想化用）',
          },
        },
        {
          name: 'startColIndex',
          type: 'number',
          default: '-',
          description: {
            en: 'Starting column index (1-based)',
            ja: '開始列インデックス（1始まり）',
          },
        },
      ],
      apiSubComponents: createTableSubComponents('string', '(string | TableCell)[]'),
    },
    svelte: {
      sourceFile: 'Table.svelte',
      testFile: 'Table.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import Table from './Table.svelte';
  import type { TableColumn, TableRow } from './Table.svelte';

  const columns: TableColumn[] = [
    { id: 'name', header: 'Name' },
    { id: 'age', header: 'Age' },
    { id: 'city', header: 'City' },
  ];

  const rows: TableRow[] = [
    { id: '1', cells: ['Alice', '30', 'Tokyo'] },
    { id: '2', cells: ['Bob', '25', 'Osaka'] },
    { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
  ];

  // Sortable columns
  let sortableColumns = $state<TableColumn[]>([
    { id: 'name', header: 'Name', sortable: true, sort: 'ascending' },
    { id: 'age', header: 'Age', sortable: true },
    { id: 'city', header: 'City' },
  ]);

  function handleSortChange(columnId: string, direction: 'ascending' | 'descending') {
    // Handle sort change
  }
</script>

<!-- Basic table -->
<Table {columns} {rows} aria-label="User List" />

<!-- Sortable table -->
<Table
  columns={sortableColumns}
  {rows}
  aria-label="Sortable User List"
  onSortChange={handleSortChange}
/>

<!-- With row headers -->
<Table
  {columns}
  rows={rowsWithHeaders}
  aria-label="User List with Row Headers"
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TableColumn[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'TableRow[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'caption',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional table caption',
            ja: 'テーブルのキャプション（任意）',
          },
        },
        {
          name: 'onSortChange',
          type: '(columnId: string, direction) => void',
          default: '-',
          description: {
            en: 'Callback when sort changes',
            ja: 'ソート変更時のコールバック',
          },
        },
        {
          name: 'totalColumns',
          type: 'number',
          default: '-',
          description: {
            en: 'Total columns (for virtualization)',
            ja: '総列数（仮想化用）',
          },
        },
        {
          name: 'totalRows',
          type: 'number',
          default: '-',
          description: {
            en: 'Total rows (for virtualization)',
            ja: '総行数（仮想化用）',
          },
        },
        {
          name: 'startColIndex',
          type: 'number',
          default: '-',
          description: {
            en: 'Starting column index (1-based)',
            ja: '開始列インデックス（1始まり）',
          },
        },
      ],
      apiSubComponents: createTableSubComponents('string', '(string | TableCell)[]'),
    },
    astro: {
      sourceFile: 'Table.astro',
      testFile: 'Table.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Table from './Table.astro';

const columns = [
  { id: 'name', header: 'Name' },
  { id: 'age', header: 'Age' },
  { id: 'city', header: 'City' },
];

const rows = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'] },
  { id: '2', cells: ['Bob', '25', 'Osaka'] },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
];

// Sortable columns
const sortableColumns = [
  { id: 'name', header: 'Name', sortable: true, sort: 'ascending' as const },
  { id: 'age', header: 'Age', sortable: true },
  { id: 'city', header: 'City' },
];

// With row headers
const rowsWithHeaders = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'], hasRowHeader: true },
  { id: '2', cells: ['Bob', '25', 'Osaka'], hasRowHeader: true },
];
---

<!-- Basic table -->
<Table columns={columns} rows={rows} aria-label="User List" />

<!-- Sortable table -->
<Table
  columns={sortableColumns}
  rows={rows}
  aria-label="Sortable User List"
/>

<!-- With row headers -->
<Table
  columns={columns}
  rows={rowsWithHeaders}
  aria-label="User List with Row Headers"
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TableColumn[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'TableRow[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'caption',
          type: 'string',
          default: '-',
          description: {
            en: 'Optional table caption',
            ja: 'テーブルのキャプション（任意）',
          },
        },
        {
          name: 'totalColumns',
          type: 'number',
          default: '-',
          description: {
            en: 'Total columns (for virtualization)',
            ja: '総列数（仮想化用）',
          },
        },
        {
          name: 'totalRows',
          type: 'number',
          default: '-',
          description: {
            en: 'Total rows (for virtualization)',
            ja: '総行数（仮想化用）',
          },
        },
        {
          name: 'startColIndex',
          type: 'number',
          default: '-',
          description: {
            en: 'Starting column index (1-based)',
            ja: '開始列インデックス（1始まり）',
          },
        },
      ],
      apiEvents: [
        {
          name: 'sortchange',
          detail: '{ columnId: string, direction: string }',
          description: {
            en: 'Dispatched when sort buttons are clicked (Web Component)',
            ja: 'ソートボタンがクリックされたときに発行（Web Component）',
          },
        },
      ],
      apiSubComponents: createTableSubComponents('string', '(string | TableCell)[]'),
    },
  },
};

export default tableMeta;
