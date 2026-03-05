import type { PatternMeta } from '@/lib/pattern-meta-types';

const treegridMeta: PatternMeta = {
  title: {
    en: 'TreeGrid',
    ja: 'TreeGrid',
  },
  description: {
    en: "A hierarchical data grid combining Grid's 2D navigation with TreeView's expandable rows.",
    ja: 'Gridの2Dナビゲーションと、TreeViewの展開可能な行を組み合わせた階層データグリッド。',
  },
  tocItems: {
    en: [
      { id: 'demo', text: 'Demo' },
      { id: 'accessibility-features', text: 'Accessibility Features' },
      { id: 'source-code', text: 'Source Code' },
      { id: 'usage', text: 'Usage' },
      { id: 'api', text: 'API' },
      { id: 'testing', text: 'Testing' },
      { id: 'resources', text: 'Resources' },
    ],
    ja: [
      { id: 'demo', text: 'デモ' },
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/',
      label: {
        en: 'WAI-ARIA APG: TreeGrid Pattern',
        ja: 'WAI-ARIA APG: TreeGrid パターン',
      },
    },
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/example-index/treegrid/treegrid-1.html',
      label: {
        en: 'WAI-ARIA APG: TreeGrid Example',
        ja: 'WAI-ARIA APG: TreeGrid 例',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'TreeGrid.tsx',
      testFile: 'TreeGrid.test.tsx',
      lang: 'tsx',
      usageCode: `import { TreeGrid } from './TreeGrid';
import type { TreeGridColumnDef, TreeGridNodeData } from './TreeGrid';

const columns: TreeGridColumnDef[] = [
  { id: 'name', header: 'Name', isRowHeader: true },
  { id: 'size', header: 'Size' },
  { id: 'date', header: 'Date' },
];

const nodes: TreeGridNodeData[] = [
  {
    id: 'folder1',
    cells: [
      { id: 'folder1-name', value: 'Documents' },
      { id: 'folder1-size', value: '--' },
      { id: 'folder1-date', value: '2024-01-15' },
    ],
    children: [
      {
        id: 'file1',
        cells: [
          { id: 'file1-name', value: 'Report.pdf' },
          { id: 'file1-size', value: '2.5 MB' },
          { id: 'file1-date', value: '2024-01-10' },
        ],
      },
    ],
  },
];

// Basic TreeGrid
<TreeGrid
  columns={columns}
  nodes={nodes}
  ariaLabel="File browser"
/>

// With selection and expand control
<TreeGrid
  columns={columns}
  nodes={nodes}
  ariaLabel="File browser"
  selectable
  multiselectable
  expandedIds={expandedIds}
  selectedRowIds={selectedRowIds}
  onExpandedChange={(ids) => setExpandedIds(ids)}
  onSelectionChange={(ids) => setSelectedRowIds(ids)}
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TreeGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'nodes',
          type: 'TreeGridNodeData[]',
          default: 'required',
          description: {
            en: 'Hierarchical node data',
            ja: '階層ノードデータ',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible name',
            ja: 'アクセシブルな名前',
          },
        },
        {
          name: 'expandedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Expanded row IDs',
            ja: '展開された行ID',
          },
        },
        {
          name: 'onExpandedChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Expand state change callback',
            ja: '展開状態変更コールバック',
          },
        },
        {
          name: 'selectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable row selection',
            ja: '行選択を有効化',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-row selection',
            ja: '複数行選択を有効化',
          },
        },
        {
          name: 'selectedRowIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Selected row IDs',
            ja: '選択された行ID',
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
      apiNote: {
        en: 'Type definitions: <code>TreeGridColumnDef { id: string, header: string, isRowHeader?: boolean }</code>, <code>TreeGridCellData { id: string, value: string | number, disabled?: boolean }</code>, <code>TreeGridNodeData { id: string, cells: TreeGridCellData[], children?: TreeGridNodeData[], disabled?: boolean }</code>',
        ja: '型定義: <code>TreeGridColumnDef { id: string, header: string, isRowHeader?: boolean }</code>, <code>TreeGridCellData { id: string, value: string | number, disabled?: boolean }</code>, <code>TreeGridNodeData { id: string, cells: TreeGridCellData[], children?: TreeGridNodeData[], disabled?: boolean }</code>',
      },
    },
    vue: {
      sourceFile: 'TreeGrid.vue',
      lang: 'vue',
      usageCode: `<script setup lang="ts">
import { ref } from 'vue';
import TreeGrid from './TreeGrid.vue';

const columns = [
  { id: 'name', header: 'Name', isRowHeader: true },
  { id: 'size', header: 'Size' },
];

const nodes = [
  {
    id: 'folder1',
    cells: [
      { id: 'folder1-name', value: 'Documents' },
      { id: 'folder1-size', value: '--' },
    ],
    children: [
      {
        id: 'file1',
        cells: [
          { id: 'file1-name', value: 'Report.pdf' },
          { id: 'file1-size', value: '2.5 MB' },
        ],
      },
    ],
  },
];

const expandedIds = ref(['folder1']);
const selectedRowIds = ref([]);
</script>

<template>
  <TreeGrid
    :columns="columns"
    :nodes="nodes"
    aria-label="File browser"
    selectable
    :multiselectable="true"
    :expanded-ids="expandedIds"
    :selected-row-ids="selectedRowIds"
    @expanded-change="(ids) => expandedIds = ids"
    @selection-change="(ids) => selectedRowIds = ids"
  />
</template>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TreeGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'nodes',
          type: 'TreeGridNodeData[]',
          default: 'required',
          description: {
            en: 'Hierarchical node data',
            ja: '階層ノードデータ',
          },
        },
        {
          name: 'expanded-ids',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Expanded row IDs',
            ja: '展開された行ID',
          },
        },
        {
          name: 'selected-row-ids',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Selected row IDs',
            ja: '選択された行ID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'expanded-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when expand state changes',
            ja: '展開状態が変更されたときに発行',
          },
        },
        {
          name: 'selection-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when selection changes',
            ja: '選択が変更されたときに発行',
          },
        },
        {
          name: 'cell-activate',
          detail: 'cellId, rowId, colId',
          description: {
            en: 'Emitted when cell is activated',
            ja: 'セルがアクティベートされたときに発行',
          },
        },
      ],
    },
    svelte: {
      sourceFile: 'TreeGrid.svelte',
      lang: 'svelte',
      usageCode: `<script lang="ts">
  import TreeGrid from './TreeGrid.svelte';

  const columns = [
    { id: 'name', header: 'Name', isRowHeader: true },
    { id: 'size', header: 'Size' },
  ];

  const nodes = [
    {
      id: 'folder1',
      cells: [
        { id: 'folder1-name', value: 'Documents' },
        { id: 'folder1-size', value: '--' },
      ],
      children: [
        {
          id: 'file1',
          cells: [
            { id: 'file1-name', value: 'Report.pdf' },
            { id: 'file1-size', value: '2.5 MB' },
          ],
        },
      ],
    },
  ];

  let expandedIds = $state(['folder1']);
  let selectedRowIds = $state([]);
</script>

<TreeGrid
  {columns}
  {nodes}
  ariaLabel="File browser"
  selectable
  multiselectable
  {expandedIds}
  {selectedRowIds}
  onExpandedChange={(ids) => expandedIds = ids}
  onSelectionChange={(ids) => selectedRowIds = ids}
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TreeGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'nodes',
          type: 'TreeGridNodeData[]',
          default: 'required',
          description: {
            en: 'Hierarchical node data',
            ja: '階層ノードデータ',
          },
        },
        {
          name: 'expandedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Expanded row IDs',
            ja: '展開された行ID',
          },
        },
        {
          name: 'selectedRowIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Selected row IDs',
            ja: '選択された行ID',
          },
        },
        {
          name: 'onExpandedChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Expand state change callback',
            ja: '展開状態変更コールバック',
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
      ],
    },
    astro: {
      sourceFile: 'TreeGrid.astro',
      lang: 'astro',
      usageCode: `---
import TreeGrid from './TreeGrid.astro';

const columns = [
  { id: 'name', header: 'Name', isRowHeader: true },
  { id: 'size', header: 'Size' },
];

const nodes = [
  {
    id: 'folder1',
    cells: [
      { id: 'folder1-name', value: 'Documents' },
      { id: 'folder1-size', value: '--' },
    ],
    children: [
      {
        id: 'file1',
        cells: [
          { id: 'file1-name', value: 'Report.pdf' },
          { id: 'file1-size', value: '2.5 MB' },
        ],
      },
    ],
  },
];
---

<TreeGrid
  columns={columns}
  nodes={nodes}
  ariaLabel="File browser"
  selectable
  multiselectable
  defaultExpandedIds={['folder1']}
/>`,
      apiProps: [
        {
          name: 'columns',
          type: 'TreeGridColumnDef[]',
          default: 'required',
          description: {
            en: 'Column definitions',
            ja: '列定義',
          },
        },
        {
          name: 'nodes',
          type: 'TreeGridNodeData[]',
          default: 'required',
          description: {
            en: 'Hierarchical node data',
            ja: '階層ノードデータ',
          },
        },
        {
          name: 'ariaLabel',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible name',
            ja: 'アクセシブルな名前',
          },
        },
        {
          name: 'defaultExpandedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially expanded row IDs',
            ja: '初期展開される行ID',
          },
        },
        {
          name: 'selectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable row selection',
            ja: '行選択を有効化',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-row selection',
            ja: '複数行選択を有効化',
          },
        },
      ],
      apiNote: {
        en: 'Note: Astro implementation uses Web Components for client-side interactivity.',
        ja: '注：Astro実装はクライアントサイドのインタラクティビティにWeb Componentsを使用します。',
      },
    },
  },
};

export default treegridMeta;
