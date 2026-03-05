import type { PatternMeta } from '@/lib/pattern-meta-types';

const gridMeta: PatternMeta = {
  title: {
    en: 'Grid',
    ja: 'Grid',
  },
  description: {
    en: 'An interactive 2D data grid with keyboard navigation, cell selection, and activation.',
    ja: 'キーボードナビゲーション、セル選択、アクティベーションを備えたインタラクティブな2Dデータグリッド。',
  },
  hasComparisonSection: true,
  tocItems: {
    en: [
      { id: 'demo', text: 'Demo' },
      { id: 'grid-vs-table', text: 'Grid vs Table' },
      { id: 'accessibility-features', text: 'Accessibility Features' },
      { id: 'source-code', text: 'Source Code' },
      { id: 'usage', text: 'Usage' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'Testing' },
      { id: 'resources', text: 'Resources' },
    ],
    ja: [
      { id: 'demo', text: 'デモ' },
      { id: 'grid-vs-table', text: 'Grid vs Table' },
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
      href: 'https://www.w3.org/WAI/ARIA/apg/example-index/grid/dataGrids.html',
      label: {
        en: 'WAI-ARIA APG: Data Grid Examples',
        ja: 'WAI-ARIA APG: Data Grid 例',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'Grid.tsx',
      testFile: 'Grid.test.tsx',
      lang: 'tsx',
      usageCode: `import { Grid } from './Grid';
import type { GridColumnDef, GridRowData } from './Grid';

const columns: GridColumnDef[] = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

const rows: GridRowData[] = [
  {
    id: 'user1',
    cells: [
      { id: 'user1-0', value: 'Alice Johnson' },
      { id: 'user1-1', value: 'alice@example.com' },
      { id: 'user1-2', value: 'Admin' },
    ],
  },
  {
    id: 'user2',
    cells: [
      { id: 'user2-0', value: 'Bob Smith' },
      { id: 'user2-1', value: 'bob@example.com' },
      { id: 'user2-2', value: 'User' },
    ],
  },
];

// Basic Grid
<Grid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
/>

// With selection
<Grid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
  selectable
  multiselectable
  selectedIds={selectedIds}
  onSelectionChange={(ids) => setSelectedIds(ids)}
  onCellActivate={(cellId, rowId, colId) => {
    console.log('Activated:', { cellId, rowId, colId });
  }}
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'GridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'GridRowData[]',
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
          name: 'ariaLabelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID reference for accessible name',
            ja: 'アクセシブルな名前のID参照',
          },
        },
        {
          name: 'selectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell selection',
            ja: 'セル選択を有効化',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-cell selection',
            ja: '複数セル選択を有効化',
          },
        },
        {
          name: 'selectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Selected cell IDs',
            ja: '選択中のセルID',
          },
        },
        {
          name: 'onSelectionChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Selection change callback',
            ja: '選択変更コールバック',
          },
        },
        {
          name: 'onCellActivate',
          type: '(cellId, rowId, colId) => void',
          default: '-',
          description: {
            en: 'Cell activation callback',
            ja: 'セルアクティベーションコールバック',
          },
        },
        {
          name: 'wrapNavigation',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Wrap navigation at row edges',
            ja: '行端でナビゲーションを折り返す',
          },
        },
        {
          name: 'pageSize',
          type: 'number',
          default: '5',
          description: {
            en: 'Rows to skip with PageUp/Down',
            ja: 'PageUp/Downでスキップする行数',
          },
        },
      ],
    },
    vue: {
      sourceFile: 'Grid.vue',
      testFile: 'Grid.test.vue.ts',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import { ref } from 'vue';
import Grid from './Grid.vue';

const columns = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

const rows = [
  {
    id: 'user1',
    cells: [
      { id: 'user1-0', value: 'Alice Johnson' },
      { id: 'user1-1', value: 'alice@example.com' },
      { id: 'user1-2', value: 'Admin' },
    ],
  },
];

const selectedIds = ref<string[]>([]);

function handleSelectionChange(ids: string[]) {
  selectedIds.value = ids;
}
</script>

<template>
  <Grid
    :columns="columns"
    :rows="rows"
    aria-label="User list"
    selectable
    :multiselectable="true"
    :selected-ids="selectedIds"
    @selection-change="handleSelectionChange"
    @cell-activate="(cellId, rowId, colId) => console.log({ cellId, rowId, colId })"
  />
</template>`,
      apiProps: [
        {
          name: 'columns',
          type: 'GridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'GridRowData[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'selectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell selection',
            ja: 'セル選択を有効化',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-cell selection',
            ja: '複数セル選択を有効化',
          },
        },
        {
          name: 'selected-ids',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Selected cell IDs',
            ja: '選択中のセルID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'selection-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when selection changes',
            ja: '選択が変更されたときに発火',
          },
        },
        {
          name: 'cell-activate',
          detail: '(cellId, rowId, colId)',
          description: {
            en: 'Emitted when cell is activated',
            ja: 'セルがアクティベートされたときに発火',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'Grid.svelte',
      testFile: 'Grid.test.svelte.ts',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import Grid from './Grid.svelte';

  const columns = [
    { id: 'name', header: 'Name' },
    { id: 'email', header: 'Email' },
    { id: 'role', header: 'Role' },
  ];

  const rows = [
    {
      id: 'user1',
      cells: [
        { id: 'user1-0', value: 'Alice Johnson' },
        { id: 'user1-1', value: 'alice@example.com' },
        { id: 'user1-2', value: 'Admin' },
      ],
    },
  ];

  let selectedIds = $state<string[]>([]);

  function handleSelectionChange(ids: string[]) {
    selectedIds = ids;
  }

  function handleCellActivate(cellId: string, rowId: string, colId: string) {
    console.log('Activated:', { cellId, rowId, colId });
  }
</script>

<Grid
  {columns}
  {rows}
  ariaLabel="User list"
  selectable
  multiselectable
  {selectedIds}
  onSelectionChange={handleSelectionChange}
  onCellActivate={handleCellActivate}
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'GridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'GridRowData[]',
          default: 'required',
          description: {
            en: 'Row data',
            ja: '行データ',
          },
        },
        {
          name: 'selectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell selection',
            ja: 'セル選択を有効化',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-cell selection',
            ja: '複数セル選択を有効化',
          },
        },
        {
          name: 'selectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Selected cell IDs',
            ja: '選択中のセルID',
          },
        },
        {
          name: 'onSelectionChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Selection change callback',
            ja: '選択変更コールバック',
          },
        },
        {
          name: 'onCellActivate',
          type: '(cellId, rowId, colId) => void',
          default: '-',
          description: {
            en: 'Cell activation callback',
            ja: 'セルアクティベーションコールバック',
          },
        },
      ],
    },
    astro: {
      sourceFile: 'Grid.astro',
      testFile: 'Grid.test.astro.ts',
      lang: 'astro',
      usageCode: `---
import Grid from '@patterns/grid/Grid.astro';

const columns = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

const rows = [
  {
    id: 'user1',
    cells: [
      { id: 'user1-0', value: 'Alice Johnson' },
      { id: 'user1-1', value: 'alice@example.com' },
      { id: 'user1-2', value: 'Admin' },
    ],
  },
];
---

<!-- Basic Grid -->
<Grid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
/>

<!-- With selection enabled -->
<Grid
  columns={columns}
  rows={rows}
  ariaLabel="User list"
  selectable
  multiselectable
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'GridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'rows',
          type: 'GridRowData[]',
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
          name: 'selectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable cell selection',
            ja: 'セル選択を有効化',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-cell selection',
            ja: '複数セル選択を有効化',
          },
        },
      ],
      apiNote: {
        en: 'The Astro version uses a custom element <code>&lt;apg-grid&gt;</code> for client-side interactivity. Keyboard navigation and selection are handled via JavaScript after hydration.',
        ja: 'Astro版はクライアントサイドのインタラクティビティのためにカスタム要素 <code>&lt;apg-grid&gt;</code> を使用しています。キーボードナビゲーションと選択はハイドレーション後にJavaScriptで処理されます。',
      },
    },
  },
};

export default gridMeta;
