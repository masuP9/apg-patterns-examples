import type { PatternMeta } from '@/lib/pattern-meta-types';

const treeViewMeta: PatternMeta = {
  title: {
    en: 'Tree View',
    ja: 'Tree View',
  },
  description: {
    en: 'A hierarchical list where items with children can be expanded or collapsed. Common uses include file browsers, navigation menus, and organizational charts.',
    ja: '子を持つアイテムを展開または折りたたむことができる階層的なリスト。ファイルブラウザ、ナビゲーションメニュー、組織図などでよく使用されます。',
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
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/',
      label: {
        en: 'WAI-ARIA APG: Tree View Pattern',
        ja: 'WAI-ARIA APG: Tree View パターン',
      },
    },
    {
      href: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/examples/treeview-navigation/',
      label: {
        en: 'APG Example: Navigation Treeview',
        ja: 'APG サンプル: ナビゲーション Treeview',
      },
    },
  ],
  frameworks: {
    react: {
      sourceFile: 'TreeView.tsx',
      testFile: 'TreeView.test.tsx',
      lang: 'tsx',
      usageCode: `import { TreeView } from './TreeView';

const nodes = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'report', label: 'report.pdf' },
      { id: 'notes', label: 'notes.txt' },
    ],
  },
  { id: 'readme', label: 'readme.md' },
];

function App() {
  return (
    <div>
      {/* Basic single-select */}
      <TreeView
        nodes={nodes}
        aria-label="File Explorer"
      />

      {/* With default expanded */}
      <TreeView
        nodes={nodes}
        aria-label="Files"
        defaultExpandedIds={['documents']}
      />

      {/* Multi-select mode */}
      <TreeView
        nodes={nodes}
        aria-label="Files"
        multiselectable
      />

      {/* With callbacks */}
      <TreeView
        nodes={nodes}
        aria-label="Files"
        onSelectionChange={(ids) => console.log('Selected:', ids)}
        onExpandedChange={(ids) => console.log('Expanded:', ids)}
        onActivate={(id) => console.log('Activated:', id)}
      />

      {/* Controlled mode */}
      <TreeView
        nodes={nodes}
        aria-label="Files"
        selectedIds={selectedIds}
        expandedIds={expandedIds}
        onSelectionChange={setSelectedIds}
        onExpandedChange={setExpandedIds}
      />
    </div>
  );
}`,
      apiProps: [
        {
          name: 'nodes',
          type: 'TreeNode[]',
          default: 'Required',
          description: {
            en: 'Array of tree nodes',
            ja: 'ツリーノードの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: '複数選択モードを有効化',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected node IDs (uncontrolled)',
            ja: '初期選択されるノード ID（非制御）',
          },
        },
        {
          name: 'selectedIds',
          type: 'string[]',
          default: '-',
          description: {
            en: 'Currently selected node IDs (controlled)',
            ja: '現在選択されているノード ID（制御）',
          },
        },
        {
          name: 'onSelectionChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Callback when selection changes',
            ja: '選択変更時のコールバック',
          },
        },
        {
          name: 'defaultExpandedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially expanded node IDs (uncontrolled)',
            ja: '初期展開されるノード ID（非制御）',
          },
        },
        {
          name: 'expandedIds',
          type: 'string[]',
          default: '-',
          description: {
            en: 'Currently expanded node IDs (controlled)',
            ja: '現在展開されているノード ID（制御）',
          },
        },
        {
          name: 'onExpandedChange',
          type: '(ids: string[]) => void',
          default: '-',
          description: {
            en: 'Callback when expansion changes',
            ja: '展開変更時のコールバック',
          },
        },
        {
          name: 'onActivate',
          type: '(id: string) => void',
          default: '-',
          description: {
            en: 'Callback when node is activated (Enter key)',
            ja: 'ノードがアクティブ化された時のコールバック（Enter キー）',
          },
        },
        {
          name: 'typeAheadTimeout',
          type: 'number',
          default: '500',
          description: {
            en: 'Type-ahead buffer reset timeout (ms)',
            ja: '先行入力バッファのリセットタイムアウト（ミリ秒）',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the tree',
            ja: 'ツリーのアクセシブル名',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベル要素の ID',
          },
        },
        {
          name: 'className',
          type: 'string',
          default: '-',
          description: {
            en: 'Additional CSS class',
            ja: '追加のCSSクラス',
          },
        },
      ],
      apiSubComponents: [
        {
          name: 'TreeNode',
          props: [
            {
              name: 'id',
              type: 'string',
              default: 'required',
              description: { en: 'Unique node identifier', ja: 'ノードの一意な識別子' },
            },
            {
              name: 'label',
              type: 'string',
              default: 'required',
              description: { en: 'Display text for the node', ja: 'ノードの表示テキスト' },
            },
            {
              name: 'children',
              type: 'TreeNode[]',
              default: '-',
              description: {
                en: 'Child nodes (makes this a parent node)',
                ja: '子ノード（親ノードになる）',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                en: 'Whether the node is disabled',
                ja: 'ノードが無効化されているかどうか',
              },
            },
          ],
        },
      ],
    },
    vue: {
      sourceFile: 'TreeView.vue',
      lang: 'vue',
      usageCode: `<script setup>
import TreeView from './TreeView.vue';

const nodes = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'report', label: 'report.pdf' },
      { id: 'notes', label: 'notes.txt' },
    ],
  },
  { id: 'readme', label: 'readme.md' },
];

function handleSelectionChange(ids) {
  console.log('Selected:', ids);
}

function handleExpandedChange(ids) {
  console.log('Expanded:', ids);
}

function handleActivate(id) {
  console.log('Activated:', id);
}
</script>

<template>
  <!-- Basic single-select -->
  <TreeView
    :nodes="nodes"
    aria-label="File Explorer"
  />

  <!-- With default expanded -->
  <TreeView
    :nodes="nodes"
    aria-label="Files"
    :default-expanded-ids="['documents']"
  />

  <!-- Multi-select mode -->
  <TreeView
    :nodes="nodes"
    aria-label="Files"
    multiselectable
  />

  <!-- With callbacks -->
  <TreeView
    :nodes="nodes"
    aria-label="Files"
    @selection-change="handleSelectionChange"
    @expanded-change="handleExpandedChange"
    @activate="handleActivate"
  />
</template>`,
      apiProps: [
        {
          name: 'nodes',
          type: 'TreeNode[]',
          default: 'Required',
          description: {
            en: 'Array of tree nodes',
            ja: 'ツリーノードの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: '複数選択モードを有効化',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected node IDs (uncontrolled)',
            ja: '初期選択されるノード ID（非制御）',
          },
        },
        {
          name: 'selectedIds',
          type: 'string[]',
          default: '-',
          description: {
            en: 'Currently selected node IDs (controlled)',
            ja: '現在選択されているノード ID（制御）',
          },
        },
        {
          name: 'defaultExpandedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially expanded node IDs (uncontrolled)',
            ja: '初期展開されるノード ID（非制御）',
          },
        },
        {
          name: 'expandedIds',
          type: 'string[]',
          default: '-',
          description: {
            en: 'Currently expanded node IDs (controlled)',
            ja: '現在展開されているノード ID（制御）',
          },
        },
        {
          name: 'typeAheadTimeout',
          type: 'number',
          default: '500',
          description: {
            en: 'Type-ahead buffer reset timeout (ms)',
            ja: '先行入力バッファのリセットタイムアウト（ミリ秒）',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the tree',
            ja: 'ツリーのアクセシブル名',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベル要素の ID',
          },
        },
      ],
      apiEvents: [
        {
          name: '@selection-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when selection changes',
            ja: '選択が変更された時に発火',
          },
        },
        {
          name: '@expanded-change',
          detail: 'string[]',
          description: {
            en: 'Emitted when expansion state changes',
            ja: '展開状態が変更された時に発火',
          },
        },
        {
          name: '@activate',
          detail: 'string',
          description: {
            en: 'Emitted when node is activated (Enter key)',
            ja: 'ノードがアクティブ化された時に発火（Enter キー）',
          },
        },
      ],
      apiSubComponents: [
        {
          name: 'TreeNode',
          props: [
            {
              name: 'id',
              type: 'string',
              default: 'required',
              description: { en: 'Unique node identifier', ja: 'ノードの一意な識別子' },
            },
            {
              name: 'label',
              type: 'string',
              default: 'required',
              description: { en: 'Display text for the node', ja: 'ノードの表示テキスト' },
            },
            {
              name: 'children',
              type: 'TreeNode[]',
              default: '-',
              description: {
                en: 'Child nodes (makes this a parent node)',
                ja: '子ノード（親ノードになる）',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                en: 'Whether the node is disabled',
                ja: 'ノードが無効化されているかどうか',
              },
            },
          ],
        },
      ],
    },
    svelte: {
      sourceFile: 'TreeView.svelte',
      lang: 'svelte',
      usageCode: `<script>
import TreeView from './TreeView.svelte';

const nodes = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'report', label: 'report.pdf' },
      { id: 'notes', label: 'notes.txt' },
    ],
  },
  { id: 'readme', label: 'readme.md' },
];

function handleSelectionChange(event) {
  console.log('Selected:', event.detail);
}

function handleExpandedChange(event) {
  console.log('Expanded:', event.detail);
}

function handleActivate(event) {
  console.log('Activated:', event.detail);
}
</script>

<!-- Basic single-select -->
<TreeView
  {nodes}
  aria-label="File Explorer"
/>

<!-- With default expanded -->
<TreeView
  {nodes}
  aria-label="Files"
  defaultExpandedIds={['documents']}
/>

<!-- Multi-select mode -->
<TreeView
  {nodes}
  aria-label="Files"
  multiselectable
/>

<!-- With callbacks -->
<TreeView
  {nodes}
  aria-label="Files"
  onselectionchange={handleSelectionChange}
  onexpandedchange={handleExpandedChange}
  onactivate={handleActivate}
/>`,
      apiProps: [
        {
          name: 'nodes',
          type: 'TreeNode[]',
          default: 'Required',
          description: {
            en: 'Array of tree nodes',
            ja: 'ツリーノードの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: '複数選択モードを有効化',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected node IDs (uncontrolled)',
            ja: '初期選択されるノード ID（非制御）',
          },
        },
        {
          name: 'selectedIds',
          type: 'string[]',
          default: '-',
          description: {
            en: 'Currently selected node IDs (controlled)',
            ja: '現在選択されているノード ID（制御）',
          },
        },
        {
          name: 'defaultExpandedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially expanded node IDs (uncontrolled)',
            ja: '初期展開されるノード ID（非制御）',
          },
        },
        {
          name: 'expandedIds',
          type: 'string[]',
          default: '-',
          description: {
            en: 'Currently expanded node IDs (controlled)',
            ja: '現在展開されているノード ID（制御）',
          },
        },
        {
          name: 'typeAheadTimeout',
          type: 'number',
          default: '500',
          description: {
            en: 'Type-ahead buffer reset timeout (ms)',
            ja: '先行入力バッファのリセットタイムアウト（ミリ秒）',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the tree',
            ja: 'ツリーのアクセシブル名',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベル要素の ID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'onselectionchange',
          detail: 'string[]',
          description: {
            en: 'Dispatched when selection changes',
            ja: '選択が変更された時に発火',
          },
        },
        {
          name: 'onexpandedchange',
          detail: 'string[]',
          description: {
            en: 'Dispatched when expansion state changes',
            ja: '展開状態が変更された時に発火',
          },
        },
        {
          name: 'onactivate',
          detail: 'string',
          description: {
            en: 'Dispatched when node is activated (Enter key)',
            ja: 'ノードがアクティブ化された時に発火（Enter キー）',
          },
        },
      ],
      apiSubComponents: [
        {
          name: 'TreeNode',
          props: [
            {
              name: 'id',
              type: 'string',
              default: 'required',
              description: { en: 'Unique node identifier', ja: 'ノードの一意な識別子' },
            },
            {
              name: 'label',
              type: 'string',
              default: 'required',
              description: { en: 'Display text for the node', ja: 'ノードの表示テキスト' },
            },
            {
              name: 'children',
              type: 'TreeNode[]',
              default: '-',
              description: {
                en: 'Child nodes (makes this a parent node)',
                ja: '子ノード（親ノードになる）',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                en: 'Whether the node is disabled',
                ja: 'ノードが無効化されているかどうか',
              },
            },
          ],
        },
      ],
    },
    astro: {
      sourceFile: 'TreeView.astro',
      lang: 'astro',
      usageCode: `---
import TreeView from './TreeView.astro';

const nodes = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'report', label: 'report.pdf' },
      { id: 'notes', label: 'notes.txt' },
    ],
  },
  { id: 'readme', label: 'readme.md' },
];
---

<!-- Basic single-select -->
<TreeView
  nodes={nodes}
  aria-label="File Explorer"
/>

<!-- With default expanded -->
<TreeView
  nodes={nodes}
  aria-label="Files"
  defaultExpandedIds={['documents']}
/>

<!-- Multi-select mode -->
<TreeView
  nodes={nodes}
  aria-label="Files"
  multiselectable
/>

<!-- With callbacks via custom events -->
<TreeView
  nodes={nodes}
  aria-label="Files"
/>

<script>
  document.querySelector('apg-treeview')?.addEventListener('selection-change', (e) => {
    console.log('Selected:', e.detail);
  });
  document.querySelector('apg-treeview')?.addEventListener('expanded-change', (e) => {
    console.log('Expanded:', e.detail);
  });
  document.querySelector('apg-treeview')?.addEventListener('activate', (e) => {
    console.log('Activated:', e.detail);
  });
</script>`,
      apiProps: [
        {
          name: 'nodes',
          type: 'TreeNode[]',
          default: 'Required',
          description: {
            en: 'Array of tree nodes',
            ja: 'ツリーノードの配列',
          },
        },
        {
          name: 'multiselectable',
          type: 'boolean',
          default: 'false',
          description: {
            en: 'Enable multi-select mode',
            ja: '複数選択モードを有効化',
          },
        },
        {
          name: 'defaultSelectedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially selected node IDs',
            ja: '初期選択されるノード ID',
          },
        },
        {
          name: 'defaultExpandedIds',
          type: 'string[]',
          default: '[]',
          description: {
            en: 'Initially expanded node IDs',
            ja: '初期展開されるノード ID',
          },
        },
        {
          name: 'typeAheadTimeout',
          type: 'number',
          default: '500',
          description: {
            en: 'Type-ahead buffer reset timeout (ms)',
            ja: '先行入力バッファのリセットタイムアウト（ミリ秒）',
          },
        },
        {
          name: 'aria-label',
          type: 'string',
          default: '-',
          description: {
            en: 'Accessible label for the tree',
            ja: 'ツリーのアクセシブル名',
          },
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          default: '-',
          description: {
            en: 'ID of labeling element',
            ja: 'ラベル要素の ID',
          },
        },
      ],
      apiEvents: [
        {
          name: 'selection-change',
          detail: 'string[]',
          description: {
            en: 'Dispatched when selection changes',
            ja: '選択が変更された時に発火',
          },
        },
        {
          name: 'expanded-change',
          detail: 'string[]',
          description: {
            en: 'Dispatched when expansion state changes',
            ja: '展開状態が変更された時に発火',
          },
        },
        {
          name: 'activate',
          detail: 'string',
          description: {
            en: 'Dispatched when node is activated (Enter key)',
            ja: 'ノードがアクティブ化された時に発火（Enter キー）',
          },
        },
      ],
      apiSubComponents: [
        {
          name: 'TreeNode',
          props: [
            {
              name: 'id',
              type: 'string',
              default: 'required',
              description: { en: 'Unique node identifier', ja: 'ノードの一意な識別子' },
            },
            {
              name: 'label',
              type: 'string',
              default: 'required',
              description: { en: 'Display text for the node', ja: 'ノードの表示テキスト' },
            },
            {
              name: 'children',
              type: 'TreeNode[]',
              default: '-',
              description: {
                en: 'Child nodes (makes this a parent node)',
                ja: '子ノード（親ノードになる）',
              },
            },
            {
              name: 'disabled',
              type: 'boolean',
              default: 'false',
              description: {
                en: 'Whether the node is disabled',
                ja: 'ノードが無効化されているかどうか',
              },
            },
          ],
        },
      ],
    },
  },
};

export default treeViewMeta;
