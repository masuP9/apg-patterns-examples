import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const tableAccessibilityData: PatternAccessibilityData = {
  pattern: 'table',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/',

  overview: {
    en: 'Table is a static tabular structure for displaying data. Unlike Grid, it has no keyboard interaction - it provides semantic structure for screen readers. Native HTML <table> is strongly recommended; use ARIA table only for CSS Grid/Flexbox layouts.',
    ja: 'Tableはデータを表示するための静的な表構造です。Gridとは異なり、キーボード操作はありません - スクリーンリーダー向けのセマンティック構造を提供します。ネイティブのHTML <table>が強く推奨されます。ARIA tableはCSS Grid/Flexboxレイアウトの場合にのみ使用してください。',
  },

  // Native HTML considerations
  nativeHtmlConsiderations: [
    { useCase: 'Basic tabular data', recommended: 'Native <table>' },
    { useCase: 'CSS Grid/Flexbox layout', recommended: 'Custom role="table"' },
    { useCase: 'Responsive column reordering', recommended: 'Custom implementation' },
    { useCase: 'Virtualization support', recommended: 'Custom with ARIA' },
  ],

  nativeVsCustom: [
    {
      feature: 'Basic tabular data',
      native: 'Recommended',
      custom: 'Not needed',
    },
    {
      feature: 'JavaScript disabled support',
      native: 'Works natively',
      custom: 'Requires fallback',
    },
    {
      feature: 'Built-in accessibility',
      native: 'Automatic',
      custom: 'Manual ARIA required',
    },
    {
      feature: 'CSS Grid/Flexbox layout',
      native: 'Limited (display: table)',
      custom: 'Full control',
    },
    {
      feature: 'Responsive column reordering',
      native: 'Limited',
      custom: 'Full control',
    },
    {
      feature: 'Virtualization support',
      native: 'Not built-in',
      custom: 'With ARIA support',
    },
  ],

  roles: [
    {
      name: 'table',
      element: { en: 'Container element', ja: 'コンテナ要素' },
      description: {
        en: 'Identifies the element as a table structure containing rows and cells of data.',
        ja: '要素をデータの行とセルを含むテーブル構造として識別します。',
      },
      required: true,
    },
    {
      name: 'rowgroup',
      element: { en: 'Header/Body container', ja: 'ヘッダー/ボディコンテナ' },
      description: {
        en: 'Groups rows together (equivalent to <thead>, <tbody>, <tfoot>).',
        ja: '行をグループ化します（<thead>、<tbody>、<tfoot>に相当）。',
      },
      required: false,
    },
    {
      name: 'row',
      element: { en: 'Row element', ja: '行要素' },
      description: {
        en: 'A row of cells within the table (equivalent to <tr>).',
        ja: 'テーブル内の1行（<tr>に相当）。',
      },
      required: true,
    },
    {
      name: 'columnheader',
      element: { en: 'Header cell', ja: 'ヘッダーセル' },
      description: {
        en: 'A header cell for a column (equivalent to <th> in header row).',
        ja: '列の見出しセル（ヘッダー行の<th>に相当）。',
      },
      required: false,
    },
    {
      name: 'rowheader',
      element: { en: 'Header cell', ja: 'ヘッダーセル' },
      description: {
        en: 'A header cell for a row (equivalent to <th scope="row">).',
        ja: '行の見出しセル（<th scope="row">に相当）。',
      },
      required: false,
    },
    {
      name: 'cell',
      element: { en: 'Data cell', ja: 'データセル' },
      description: {
        en: 'A data cell within a row (equivalent to <td>).',
        ja: '行内のデータセル（<td>に相当）。',
      },
      required: true,
    },
  ],

  properties: [
    {
      attribute: 'aria-label',
      element: 'table',
      values: { en: 'String', ja: '文字列' },
      required: {
        en: 'Yes (or aria-labelledby)',
        ja: 'はい（または aria-labelledby）',
      },
      notes: {
        en: "Provides an accessible name for the table. Required for screen reader users to understand the table's purpose.",
        ja: 'テーブルのアクセシブル名を提供します。スクリーンリーダーのユーザーがテーブルの目的を理解するために必要です。',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'table',
      values: { en: 'ID reference', ja: 'ID参照' },
      required: {
        en: 'Yes (or aria-label)',
        ja: 'はい（または aria-label）',
      },
      notes: {
        en: 'References an element that provides the accessible name for the table.',
        ja: 'テーブルのアクセシブル名を提供する要素を参照します。',
      },
    },
    {
      attribute: 'aria-describedby',
      element: 'table',
      values: { en: 'ID reference', ja: 'ID参照' },
      required: false,
      notes: {
        en: 'References an element providing additional description for the table.',
        ja: 'テーブルの追加説明を提供する要素を参照します。',
      },
    },
    {
      attribute: 'aria-colcount',
      element: 'table',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Defines the total number of columns in the table when only a subset is rendered (virtualization).',
        ja: '一部のみがレンダリングされている場合のテーブルの総列数を定義します（仮想化用）。',
      },
    },
    {
      attribute: 'aria-rowcount',
      element: 'table',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Defines the total number of rows in the table when only a subset is rendered (virtualization).',
        ja: '一部のみがレンダリングされている場合のテーブルの総行数を定義します（仮想化用）。',
      },
    },
    {
      attribute: 'aria-colindex',
      element: 'cell/columnheader',
      values: { en: 'Number (1-based)', ja: '数値（1始まり）' },
      required: false,
      notes: {
        en: 'Indicates the position of a cell within the full table (virtualization).',
        ja: 'テーブル全体におけるセルの位置を示します（仮想化用）。',
      },
    },
    {
      attribute: 'aria-rowindex',
      element: 'row',
      values: { en: 'Number (1-based)', ja: '数値（1始まり）' },
      required: false,
      notes: {
        en: 'Indicates the position of a row within the full table (virtualization).',
        ja: 'テーブル全体における行の位置を示します（仮想化用）。',
      },
    },
    {
      attribute: 'aria-colspan',
      element: 'cell',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Indicates how many columns the cell spans. Only set when >1.',
        ja: 'セルが何列にまたがるかを示します。1より大きい場合のみ設定します。',
      },
    },
    {
      attribute: 'aria-rowspan',
      element: 'cell',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Indicates how many rows the cell spans. Only set when >1.',
        ja: 'セルが何行にまたがるかを示します。1より大きい場合のみ設定します。',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-sort',
      element: {
        en: 'columnheader/rowheader',
        ja: 'columnheader/rowheader 要素',
      },
      values: 'ascending | descending | none | other',
      required: false,
      changeTrigger: {
        en: 'When sort order changes (click sort button)',
        ja: 'ソート順が変更されたとき（ソートボタンクリック）',
      },
    },
  ],

  // No keyboard support for static tables
  keyboardSupport: [],

  focusManagement: [
    {
      event: { en: 'Static table', ja: '静的テーブル' },
      behavior: {
        en: 'Not applicable - no roving tabindex needed',
        ja: '該当なし - roving tabindexは不要',
      },
    },
    {
      event: { en: 'Interactive elements', ja: 'インタラクティブ要素' },
      behavior: {
        en: 'Links/buttons receive focus via normal tab order',
        ja: 'リンク/ボタンは通常のTab順序でフォーカスを受け取る',
      },
    },
  ],

  additionalNotes: [
    {
      en: 'The table role creates a static tabular structure for displaying data. Unlike the grid role, tables are not interactive and do not support keyboard navigation between cells.',
      ja: 'tableロールはデータを表示するための静的な表構造を作成します。gridロールとは異なり、テーブルはインタラクティブではなく、セル間のキーボードナビゲーションをサポートしません。',
    },
    {
      en: 'Keyboard support is not applicable for the table pattern. Interactive elements within cells (buttons, links) receive focus through normal tab order.',
      ja: 'tableパターンにはキーボードサポートは該当しません。セル内のインタラクティブな要素（ボタン、リンク）は通常のTab順序でフォーカスを受け取ります。',
    },
  ],

  visualDesign: [
    {
      en: 'CSS Grid layout - Uses CSS Grid with subgrid for visual cell spanning support',
      ja: 'CSS Gridレイアウト - 視覚的なセル結合サポートのためにCSS Grid + subgridを使用',
    },
    {
      en: 'Cell borders - Gap-based borders using background color',
      ja: 'セルの罫線 - 背景色を使用したギャップベースの罫線',
    },
    {
      en: 'Sort indicators - Visual icons to indicate sort direction',
      ja: 'ソートインジケーター - ソート方向を示す視覚的なアイコン',
    },
    {
      en: 'Header styling - Distinct background for header cells',
      ja: 'ヘッダースタイリング - ヘッダーセルの明確な背景色',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA APG: Table Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/table/',
    },
    {
      title: 'MDN: <table> element',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table',
    },
    {
      title: 'W3C ARIA: table role',
      url: 'https://w3c.github.io/aria/#table',
    },
  ],

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: '単体テスト（Testing Library）' },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用してコンポーネントのレンダリング出力を検証します。これらのテストは正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA roles (table, row, cell, columnheader, rowheader, rowgroup)',
            ja: 'ARIAロール（table, row, cell, columnheader, rowheader, rowgroup）',
          },
          {
            en: 'Accessible name via aria-label or aria-labelledby',
            ja: 'aria-label または aria-labelledby によるアクセシブルな名前',
          },
          { en: 'Sort state attributes (aria-sort)', ja: 'ソート状態属性（aria-sort）' },
          {
            en: 'Virtualization attributes (aria-rowcount, aria-colcount, aria-rowindex)',
            ja: '仮想化属性（aria-rowcount, aria-colcount, aria-rowindex）',
          },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ検証' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover visual rendering and cross-framework consistency.',
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストは視覚的なレンダリングとクロスフレームワークの一貫性をカバーします。',
        },
        areas: [
          { en: 'ARIA structure validation in live browser', ja: 'ライブブラウザでのARIA構造検証' },
          { en: 'Sort interaction and state changes', ja: 'ソートのインタラクションと状態変化' },
          {
            en: 'Visual cell spanning (colspan, rowspan dimensions)',
            ja: '視覚的セル結合（colspan, rowspanの寸法）',
          },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'フレームワーク間の一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'ARIA Structure', ja: 'ARIA構造' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="table"',
            description: {
              en: 'Container element has the table role',
              ja: 'コンテナ要素がtableロールを持つ',
            },
          },
          {
            name: 'role="rowgroup"',
            description: {
              en: 'Header and body groups have rowgroup role',
              ja: 'ヘッダーとボディグループがrowgroupロールを持つ',
            },
          },
          {
            name: 'role="row"',
            description: { en: 'All rows have the row role', ja: 'すべての行がrowロールを持つ' },
          },
          {
            name: 'role="columnheader"',
            description: {
              en: 'Header cells have columnheader role',
              ja: 'ヘッダーセルがcolumnheaderロールを持つ',
            },
          },
          {
            name: 'role="rowheader"',
            description: {
              en: 'Row header cells have rowheader role when specified',
              ja: '指定時に行ヘッダーセルがrowheaderロールを持つ',
            },
          },
          {
            name: 'role="cell"',
            description: {
              en: 'Data cells have the cell role',
              ja: 'データセルがcellロールを持つ',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Accessible Name', ja: 'アクセシブルな名前' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-label',
            description: {
              en: 'Accessible name via aria-label attribute',
              ja: 'aria-label属性によるアクセシブルな名前',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Accessible name via external element reference',
              ja: '外部要素参照によるアクセシブルな名前',
            },
          },
          {
            name: 'caption',
            description: {
              en: 'Caption is displayed when provided',
              ja: '提供時にキャプションが表示される',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Sort State', ja: 'ソート状態' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-sort="ascending"',
            description: {
              en: 'Column sorted in ascending order',
              ja: '昇順でソートされた列',
            },
          },
          {
            name: 'aria-sort="descending"',
            description: {
              en: 'Column sorted in descending order',
              ja: '降順でソートされた列',
            },
          },
          {
            name: 'aria-sort="none"',
            description: {
              en: 'Sortable column that is not currently sorted',
              ja: '現在ソートされていないソート可能な列',
            },
          },
          {
            name: 'no aria-sort',
            description: {
              en: 'Non-sortable columns have no aria-sort attribute',
              ja: 'ソート不可の列にはaria-sort属性がない',
            },
          },
          {
            name: 'onSortChange callback',
            description: {
              en: 'Callback is invoked when sort button is clicked',
              ja: 'ソートボタンクリック時にコールバックが呼び出される',
            },
          },
          {
            name: 'sort toggle',
            description: {
              en: 'Clicking sorted column toggles direction',
              ja: 'ソート済み列をクリックすると方向が切り替わる',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Virtualization Support', ja: '仮想化サポート' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-colcount',
            description: {
              en: 'Total column count for virtualized tables',
              ja: '仮想化テーブルの総列数',
            },
          },
          {
            name: 'aria-rowcount',
            description: {
              en: 'Total row count for virtualized tables',
              ja: '仮想化テーブルの総行数',
            },
          },
          {
            name: 'aria-rowindex',
            description: {
              en: 'Row position in the full table',
              ja: 'テーブル全体における行の位置',
            },
          },
          {
            name: 'aria-colindex',
            description: {
              en: 'Cell position in the full table',
              ja: 'テーブル全体におけるセルの位置',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Visual Cell Spanning (Browser Tests)',
          ja: '視覚的セル結合（ブラウザテスト）',
        },
        testType: 'E2E',
        items: [
          {
            name: 'colspan width',
            description: {
              en: 'Cell with colspan=2 has ~2x width of normal cell',
              ja: 'colspan=2のセルが通常セルの約2倍の幅を持つ',
            },
          },
          {
            name: 'rowspan height',
            description: {
              en: 'Cell with rowspan=2 has ~2x height of normal cell',
              ja: 'rowspan=2のセルが通常セルの約2倍の高さを持つ',
            },
          },
          {
            name: 'full span',
            description: {
              en: 'Cell spanning all columns matches table width',
              ja: '全列にまたがるセルがテーブル幅と一致する',
            },
          },
          {
            name: 'combined spans',
            description: {
              en: 'Cell with both colspan and rowspan has correct dimensions',
              ja: 'colspanとrowspanの両方を持つセルが正しい寸法を持つ',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility', ja: 'アクセシビリティ' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No accessibility violations detected by axe-core',
              ja: 'axe-coreによるアクセシビリティ違反なし',
            },
          },
          {
            name: 'sortable columns',
            description: {
              en: 'No violations with sortable column headers',
              ja: 'ソート可能な列ヘッダーで違反なし',
            },
          },
          {
            name: 'row headers',
            description: {
              en: 'No violations with row header cells',
              ja: '行ヘッダーセルで違反なし',
            },
          },
          {
            name: 'empty table',
            description: {
              en: 'No violations with empty data rows',
              ja: 'データ行が空でも違反なし',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Edge Cases', ja: 'エッジケース' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'empty rows',
            description: {
              en: 'Table renders correctly with no data rows',
              ja: 'データ行なしでテーブルが正しくレンダリングされる',
            },
          },
          {
            name: 'single column',
            description: {
              en: 'Table handles single column correctly',
              ja: 'テーブルが単一列を正しく処理する',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'HTML Attribute Inheritance', ja: 'HTML属性継承' },
        testType: 'Unit',
        items: [
          {
            name: 'className',
            description: {
              en: 'Custom class is applied to container',
              ja: 'カスタムクラスがコンテナに適用される',
            },
          },
          {
            name: 'id',
            description: { en: 'ID attribute is set correctly', ja: 'id属性が正しく設定される' },
          },
          {
            name: 'data-*',
            description: {
              en: 'Data attributes are passed through',
              ja: 'data属性がパススルーされる',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/table.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Table', ja: 'Tableのユニットテストを実行' },
        command: 'npm run test -- table',
      },
      {
        comment: {
          en: 'Run E2E tests for Table (all frameworks)',
          ja: 'TableのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=table',
      },
    ],
    tools: [
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: {
          en: 'E2E testing for cross-framework validation',
          ja: 'クロスフレームワーク検証のためのE2Eテスト',
        },
      },
      {
        name: 'Testing Library',
        url: 'https://testing-library.com/',
        description: {
          en: 'Framework-specific testing utilities (React, Vue, Svelte)',
          ja: 'フレームワーク固有のテストユーティリティ（React, Vue, Svelte）',
        },
      },
      {
        name: 'axe-core',
        url: 'https://github.com/dequelabs/axe-core',
        description: {
          en: 'Automated accessibility testing',
          ja: '自動アクセシビリティテスト',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  testChecklist: [
    // ARIA Structure - High Priority
    { description: 'role="table" on container', priority: 'high', category: 'aria' },
    { description: 'role="row" on all rows', priority: 'high', category: 'aria' },
    { description: 'role="cell" on data cells', priority: 'high', category: 'aria' },
    { description: 'role="columnheader" on header cells', priority: 'high', category: 'aria' },
    { description: 'role="rowheader" when present', priority: 'high', category: 'aria' },
    { description: 'role="rowgroup" when present', priority: 'high', category: 'aria' },

    // Accessible Name - High Priority
    { description: 'Accessible name via aria-label', priority: 'high', category: 'aria' },
    { description: 'Accessible name via aria-labelledby', priority: 'high', category: 'aria' },
    {
      description: 'Description via aria-describedby (when caption)',
      priority: 'high',
      category: 'aria',
    },

    // Sort State - High Priority
    { description: 'aria-sort="ascending" on sorted column', priority: 'high', category: 'aria' },
    { description: 'aria-sort="descending" on sorted column', priority: 'high', category: 'aria' },
    {
      description: 'aria-sort="none" on unsorted sortable columns',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Sort changes update aria-sort attribute', priority: 'high', category: 'aria' },

    // Virtualization - Medium Priority
    { description: 'aria-colcount matches total columns', priority: 'medium', category: 'aria' },
    { description: 'aria-rowcount matches total rows', priority: 'medium', category: 'aria' },
    { description: 'aria-colindex is 1-based on cells', priority: 'medium', category: 'aria' },
    { description: 'aria-rowindex is 1-based on rows', priority: 'medium', category: 'aria' },

    // Cell Spanning - Medium Priority
    {
      description: 'aria-colspan set when cell spans >1 columns',
      priority: 'medium',
      category: 'aria',
    },
    {
      description: 'aria-rowspan set when cell spans >1 rows',
      priority: 'medium',
      category: 'aria',
    },

    // Accessibility - Medium Priority
    { description: 'No axe-core violations', priority: 'medium', category: 'accessibility' },
  ],

  implementationNotes: `### CSS Grid + Subgrid Layout

This implementation uses CSS Grid with Subgrid for visual cell spanning support.

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ div.apg-table [display: grid; --table-cols: N]              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div.apg-table-header [display: grid; subgrid]           │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ div.apg-table-row [display: contents]               │ │ │
│ │ │   → cells become direct grid items                  │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div.apg-table-body [display: grid; subgrid]             │ │
│ │   cells with colspan/rowspan use:                       │ │
│ │     grid-column: span N                                 │ │
│ │     grid-row: span N                                    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Structure Diagram

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ div role="table" aria-label="..."                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div role="rowgroup" (header)                            │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ div role="row"                                      │ │ │
│ │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐       │ │ │
│ │ │ │columnheader│ │columnheader│ │columnheader│       │ │ │
│ │ │ │aria-sort   │ │            │ │            │       │ │ │
│ │ │ └────────────┘ └────────────┘ └────────────┘       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ div role="rowgroup" (body)                              │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ div role="row" aria-rowindex="2"                    │ │ │
│ │ │ ┌────────────┐ ┌────────────┐ ┌────────────┐       │ │ │
│ │ │ │ rowheader? │ │    cell    │ │    cell    │       │ │ │
│ │ │ └────────────┘ └────────────┘ └────────────┘       │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Key Differences from Grid

| Aspect           | Table              | Grid                    |
| ---------------- | ------------------ | ----------------------- |
| Purpose          | Static display     | Interactive editing     |
| Keyboard         | None               | Arrow, Enter, Tab       |
| Focus management | None               | Roving tabindex         |
| Cell role        | \`cell\`           | \`gridcell\`            |
| Selection        | None               | \`aria-selected\`       |`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { Table } from './Table';

const columns = [
  { id: 'name', header: 'Name', sortable: true, sort: 'ascending' as const },
  { id: 'age', header: 'Age', sortable: true },
];

const rows = [
  { id: '1', cells: ['Alice', '30'] },
  { id: '2', cells: ['Bob', '25'] },
];

describe('Table', () => {
  describe('APG: ARIA Structure', () => {
    it('has role="table" on container', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('has role="row" on all rows', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const allRows = screen.getAllByRole('row');
      expect(allRows).toHaveLength(3); // 1 header + 2 data rows
    });

    it('has role="columnheader" on header cells', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(2);
    });

    it('has role="cell" on data cells', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(4); // 2 columns x 2 rows
    });
  });

  describe('APG: Sort State', () => {
    it('has aria-sort="ascending" on sorted column', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('has aria-sort="none" on unsorted sortable column', () => {
      render(<Table columns={columns} rows={rows} aria-label="Users" />);
      const ageHeader = screen.getByRole('columnheader', { name: /age/i });
      expect(ageHeader).toHaveAttribute('aria-sort', 'none');
    });
  });

  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Table columns={columns} rows={rows} aria-label="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/table/react/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const basicTable = page.locator('[role="table"][aria-label="User List"]');
  await expect(basicTable).toBeVisible();

  // Check rows (1 header + 5 data rows)
  const rows = basicTable.locator('[role="row"]');
  await expect(rows).toHaveCount(6);

  // Check columnheaders
  const headers = basicTable.locator('[role="columnheader"]');
  await expect(headers).toHaveCount(3);

  // Check data cells (5 rows x 3 columns)
  const cells = basicTable.locator('[role="cell"]');
  await expect(cells).toHaveCount(15);

  // Check rowgroups (header + body)
  const rowgroups = basicTable.locator('[role="rowgroup"]');
  await expect(rowgroups).toHaveCount(2);
});

// Sort state test
test('clicking sort button changes aria-sort', async ({ page }) => {
  const sortableTable = page.locator('[role="table"][aria-label="Sortable User List"]');
  await expect(sortableTable).toBeVisible();

  const ageHeader = sortableTable.locator('[role="columnheader"]').filter({ hasText: 'Age' });
  const sortButton = ageHeader.locator('button');

  // Initially none
  await expect(ageHeader).toHaveAttribute('aria-sort', 'none');

  // Click to sort ascending
  await sortButton.click();
  await expect(ageHeader).toHaveAttribute('aria-sort', 'ascending');

  // Click again to sort descending
  await sortButton.click();
  await expect(ageHeader).toHaveAttribute('aria-sort', 'descending');
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="table"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
