import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const gridAccessibilityData: PatternAccessibilityData = {
  pattern: 'grid',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',

  overview: {
    en: 'Grid is an interactive container that enables 2-dimensional navigation using arrow keys, Home, End, and other directional keys. Unlike a static table, Grid supports cell selection and keyboard-based cell activation.',
    ja: 'Grid は矢印キー、Home、End などの方向キーを使用した2次元ナビゲーションを可能にするインタラクティブなコンテナです。静的なテーブルとは異なり、セルの選択とキーボードベースのセルアクティベーションをサポートします。',
  },

  nativeHtmlConsiderations: [
    {
      useCase: {
        en: 'Cells are focusable and interactive (editable, selectable, or contain widgets)',
        ja: 'セルがフォーカス可能でインタラクティブ（編集可能、選択可能、またはウィジェットを含む）',
      },
      recommended: {
        en: 'Use grid role for interactive data grids with 2D keyboard navigation',
        ja: '2Dキーボードナビゲーションを備えたインタラクティブなデータグリッドには grid ロールを使用',
      },
    },
    {
      useCase: {
        en: 'Static data display without interactivity',
        ja: 'インタラクティブ性のない静的データ表示',
      },
      recommended: {
        en: 'Use native <table> elements for static data tables',
        ja: '静的なデータテーブルにはネイティブの <table> 要素を使用',
      },
    },
    {
      useCase: {
        en: 'Interface similar to spreadsheet or data grid',
        ja: 'スプレッドシートやデータグリッドに類似したインターフェース',
      },
      recommended: {
        en: 'Use grid role with full keyboard support',
        ja: '完全なキーボードサポート付きの grid ロールを使用',
      },
    },
  ],

  roles: [
    {
      name: 'grid',
      element: { en: 'Container', ja: 'コンテナ' },
      description: {
        en: 'The grid container (composite widget)',
        ja: 'グリッドコンテナ（複合ウィジェット）',
      },
      required: true,
    },
    {
      name: 'row',
      element: { en: 'Row container', ja: '行コンテナ' },
      description: { en: 'Groups cells horizontally', ja: 'セルを水平方向にグループ化' },
      required: true,
    },
    {
      name: 'columnheader',
      element: { en: 'Header cells', ja: 'ヘッダーセル' },
      description: {
        en: 'Column headers (not focusable in this implementation)',
        ja: '列ヘッダー（この実装ではフォーカス不可）',
      },
    },
    {
      name: 'rowheader',
      element: { en: 'Row header cell', ja: '行ヘッダーセル' },
      description: { en: 'Row headers (optional)', ja: '行ヘッダー（オプション）' },
    },
    {
      name: 'gridcell',
      element: { en: 'Data cells', ja: 'データセル' },
      description: {
        en: 'Interactive cells (focusable)',
        ja: 'インタラクティブセル（フォーカス可能）',
      },
      required: true,
    },
  ],

  properties: [
    {
      attribute: 'role="grid"',
      element: { en: 'Container', ja: 'コンテナ' },
      values: '-',
      required: true,
      notes: { en: 'Identifies the container as a grid', ja: 'コンテナをグリッドとして識別' },
    },
    {
      attribute: 'aria-label',
      element: 'grid',
      values: 'String',
      required: {
        en: 'Yes* (either aria-label or aria-labelledby)',
        ja: 'はい*（aria-label または aria-labelledby のいずれか）',
      },
      notes: { en: 'Accessible name for the grid', ja: 'グリッドのアクセシブルな名前' },
    },
    {
      attribute: 'aria-labelledby',
      element: 'grid',
      values: 'ID reference',
      required: {
        en: 'Yes* (either aria-label or aria-labelledby)',
        ja: 'はい*（aria-label または aria-labelledby のいずれか）',
      },
      notes: { en: 'Alternative to aria-label', ja: 'aria-labelの代替' },
    },
    {
      attribute: 'aria-multiselectable',
      element: 'grid',
      values: 'true',
      required: false,
      notes: {
        en: 'Only present for multi-select mode',
        ja: '複数選択モード時のみ存在',
      },
    },
    {
      attribute: 'aria-rowcount',
      element: 'grid',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: { en: 'Total rows (for virtualization)', ja: '総行数（仮想化用）' },
    },
    {
      attribute: 'aria-colcount',
      element: 'grid',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: { en: 'Total columns (for virtualization)', ja: '総列数（仮想化用）' },
    },
  ],

  states: [
    {
      attribute: 'tabindex',
      element: 'gridcell',
      values: '0 | -1',
      required: true,
      changeTrigger: {
        en: 'Roving tabindex for focus management',
        ja: 'フォーカス管理用のroving tabindex',
      },
    },
    {
      attribute: 'aria-selected',
      element: 'gridcell',
      values: 'true | false',
      required: false,
      changeTrigger: {
        en: 'Present when grid supports selection. When selection is supported, ALL gridcells should have aria-selected.',
        ja: 'グリッドが選択をサポートする場合に存在。選択をサポートする場合、すべてのgridcellにaria-selectedが必要。',
      },
    },
    {
      attribute: 'aria-disabled',
      element: 'gridcell',
      values: 'true',
      required: false,
      changeTrigger: {
        en: 'Indicates the cell is disabled',
        ja: 'セルが無効であることを示す',
      },
    },
    {
      attribute: 'aria-rowindex',
      element: { en: 'row, gridcell', ja: 'row, gridcell' },
      values: { en: 'Number', ja: '数値' },
      required: false,
      changeTrigger: {
        en: 'Row position (for virtualization)',
        ja: '行位置（仮想化用）',
      },
    },
    {
      attribute: 'aria-colindex',
      element: 'gridcell',
      values: { en: 'Number', ja: '数値' },
      required: false,
      changeTrigger: {
        en: 'Column position (for virtualization)',
        ja: '列位置（仮想化用）',
      },
    },
  ],

  keyboardSections: [
    {
      title: { en: '2D Navigation', ja: '2Dナビゲーション' },
      shortcuts: [
        { key: '→', action: { en: 'Move focus one cell right', ja: 'フォーカスを右のセルに移動' } },
        { key: '←', action: { en: 'Move focus one cell left', ja: 'フォーカスを左のセルに移動' } },
        { key: '↓', action: { en: 'Move focus one row down', ja: 'フォーカスを下の行に移動' } },
        { key: '↑', action: { en: 'Move focus one row up', ja: 'フォーカスを上の行に移動' } },
        {
          key: 'Home',
          action: { en: 'Move focus to first cell in row', ja: 'フォーカスを行の最初のセルに移動' },
        },
        {
          key: 'End',
          action: { en: 'Move focus to last cell in row', ja: 'フォーカスを行の最後のセルに移動' },
        },
        {
          key: 'Ctrl + Home',
          action: {
            en: 'Move focus to first cell in grid',
            ja: 'フォーカスをグリッドの最初のセルに移動',
          },
        },
        {
          key: 'Ctrl + End',
          action: {
            en: 'Move focus to last cell in grid',
            ja: 'フォーカスをグリッドの最後のセルに移動',
          },
        },
        {
          key: 'PageDown',
          action: {
            en: 'Move focus down by page size (default 5)',
            ja: 'フォーカスをページサイズ分下に移動（デフォルト5）',
          },
        },
        {
          key: 'PageUp',
          action: {
            en: 'Move focus up by page size (default 5)',
            ja: 'フォーカスをページサイズ分上に移動（デフォルト5）',
          },
        },
      ],
    },
    {
      title: { en: 'Selection & Activation', ja: '選択とアクティベーション' },
      shortcuts: [
        {
          key: 'Space',
          action: {
            en: 'Select/deselect focused cell (when selectable)',
            ja: 'フォーカス中のセルを選択/選択解除（選択可能時）',
          },
        },
        {
          key: 'Enter',
          action: {
            en: 'Activate focused cell (trigger onCellActivate)',
            ja: 'フォーカス中のセルをアクティベート（onCellActivateをトリガー）',
          },
        },
      ],
    },
  ],

  focusManagement: [
    {
      event: { en: 'Roving tabindex', ja: 'Roving tabindex' },
      behavior: {
        en: 'Only one cell has tabindex="0" (the focused cell), all others have tabindex="-1"',
        ja: '1つのセルのみがtabindex="0"（フォーカス中のセル）を持ち、他のすべてのセルはtabindex="-1"を持つ',
      },
    },
    {
      event: { en: 'Single Tab stop', ja: '単一Tabストップ' },
      behavior: {
        en: 'Grid is a single Tab stop (Tab enters grid, Shift+Tab exits)',
        ja: 'グリッドは単一のTabストップ（Tabでグリッドに入り、Shift+Tabで離脱）',
      },
    },
    {
      event: { en: 'Header cells', ja: 'ヘッダーセル' },
      behavior: {
        en: 'Header cells (columnheader) are NOT focusable (no sort functionality in this implementation)',
        ja: 'ヘッダーセル（columnheader）はフォーカス不可（この実装ではソート機能なし）',
      },
    },
    {
      event: { en: 'Data cells only', ja: 'データセルのみ' },
      behavior: {
        en: 'Only gridcells in the data rows are included in keyboard navigation',
        ja: 'データ行のgridcellのみがキーボードナビゲーションに含まれる',
      },
    },
    {
      event: { en: 'Focus memory', ja: 'フォーカスメモリ' },
      behavior: {
        en: 'Last focused cell is remembered when leaving and re-entering the grid',
        ja: 'グリッドを離れて再入場した際、最後にフォーカスされたセルが記憶される',
      },
    },
  ],

  additionalNotes: [
    {
      en: 'Either aria-label or aria-labelledby is required on the grid container.',
      ja: 'グリッドコンテナには aria-label または aria-labelledby のいずれかが必須です。',
    },
    {
      en: 'Disabled cells have aria-disabled="true", are focusable (included in keyboard navigation), cannot be selected or activated, and are visually distinct (e.g., grayed out).',
      ja: '無効化セルはaria-disabled="true"を持ち、フォーカス可能（キーボードナビゲーションに含まれる）ですが、選択またはアクティベートできず、視覚的に区別されます（例：グレーアウト）。',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA grid role',
      url: 'https://w3c.github.io/aria/#grid',
    },
    {
      title: 'WAI-ARIA APG Grid Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
    },
  ],

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト (Testing Library)' },
        description: {
          en: 'Verify component rendering and interactions using framework-specific Testing Library utilities. These tests ensure correct component behavior in isolation.',
          ja: 'フレームワーク固有のTesting Libraryユーティリティを使用して、コンポーネントのレンダリングとインタラクションを検証します。これらのテストはコンポーネントの動作を分離して確認します。',
        },
        areas: [
          {
            en: 'HTML structure and element hierarchy (grid, row, gridcell)',
            ja: 'HTML構造と要素階層（grid, row, gridcell）',
          },
          {
            en: 'Initial attribute values (role, aria-label, tabindex)',
            ja: '初期属性値（role, aria-label, tabindex）',
          },
          { en: 'Selection state changes (aria-selected)', ja: '選択状態の変更（aria-selected）' },
          { en: 'CSS class application', ja: 'CSSクラスの適用' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト (Playwright)' },
        description: {
          en: 'Verify component behavior in a real browser environment across all four frameworks. These tests cover interactions that require full browser context.',
          ja: '4つのすべてのフレームワークで、実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストはフルブラウザコンテキストを必要とするインタラクションをカバーします。',
        },
        areas: [
          {
            en: '2D keyboard navigation (Arrow keys)',
            ja: '2Dキーボードナビゲーション（矢印キー）',
          },
          {
            en: 'Extended navigation (Home, End, Ctrl+Home, Ctrl+End)',
            ja: '拡張ナビゲーション（Home, End, Ctrl+Home, Ctrl+End）',
          },
          {
            en: 'Page navigation (PageUp, PageDown)',
            ja: 'ページナビゲーション（PageUp, PageDown）',
          },
          { en: 'Cell selection and activation', ja: 'セルの選択とアクティベーション' },
          {
            en: 'Focus management and roving tabindex',
            ja: 'フォーカス管理とroving tabindex',
          },
          { en: 'Cross-framework consistency', ja: 'クロスフレームワークの一貫性' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'APG ARIA Attributes', ja: 'APG ARIA属性' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="grid"',
            description: { en: 'Container has grid role', ja: 'コンテナがgridロールを持つ' },
          },
          {
            name: 'role="row"',
            description: { en: 'All rows have row role', ja: 'すべての行がrowロールを持つ' },
          },
          {
            name: 'role="gridcell"',
            description: {
              en: 'Data cells have gridcell role',
              ja: 'データセルがgridcellロールを持つ',
            },
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
              en: 'Row header cells have rowheader role (when applicable)',
              ja: '行ヘッダーセルがrowheaderロールを持つ（該当時）',
            },
          },
          {
            name: 'aria-label',
            description: {
              en: 'Grid has accessible name via aria-label',
              ja: 'グリッドがaria-labelでアクセシブルな名前を持つ',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Grid has accessible name via aria-labelledby',
              ja: 'グリッドがaria-labelledbyでアクセシブルな名前を持つ',
            },
          },
          {
            name: 'aria-multiselectable',
            description: {
              en: 'Present when multi-selection is enabled',
              ja: '複数選択が有効な場合に存在',
            },
          },
          {
            name: 'aria-selected',
            description: {
              en: 'Present on all cells when selection is enabled',
              ja: '選択が有効な場合、すべてのセルに存在',
            },
          },
          {
            name: 'aria-disabled',
            description: { en: 'Present on disabled cells', ja: '無効なセルに存在' },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: '2D Keyboard Navigation', ja: '2Dキーボードナビゲーション' },
        testType: 'E2E',
        items: [
          {
            name: 'ArrowRight',
            description: { en: 'Moves focus one cell right', ja: 'フォーカスを右に1セル移動' },
          },
          {
            name: 'ArrowLeft',
            description: { en: 'Moves focus one cell left', ja: 'フォーカスを左に1セル移動' },
          },
          {
            name: 'ArrowDown',
            description: { en: 'Moves focus one row down', ja: 'フォーカスを下に1行移動' },
          },
          {
            name: 'ArrowUp',
            description: { en: 'Moves focus one row up', ja: 'フォーカスを上に1行移動' },
          },
          {
            name: 'ArrowUp at first row',
            description: {
              en: 'Stops at first data row (does not enter headers)',
              ja: '最初のデータ行で停止（ヘッダーには移動しない）',
            },
          },
          {
            name: 'ArrowRight at row end',
            description: {
              en: 'Stops at row end (default) or wraps (wrapNavigation)',
              ja: '行末で停止（デフォルト）または折り返し（wrapNavigation）',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Extended Navigation', ja: '拡張ナビゲーション' },
        testType: 'E2E',
        items: [
          {
            name: 'Home',
            description: {
              en: 'Moves focus to first cell in row',
              ja: 'フォーカスを行の最初のセルに移動',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Moves focus to last cell in row',
              ja: 'フォーカスを行の最後のセルに移動',
            },
          },
          {
            name: 'Ctrl+Home',
            description: {
              en: 'Moves focus to first cell in grid',
              ja: 'フォーカスをグリッドの最初のセルに移動',
            },
          },
          {
            name: 'Ctrl+End',
            description: {
              en: 'Moves focus to last cell in grid',
              ja: 'フォーカスをグリッドの最後のセルに移動',
            },
          },
          {
            name: 'PageDown',
            description: {
              en: 'Moves focus down by page size',
              ja: 'フォーカスをページサイズ分下に移動',
            },
          },
          {
            name: 'PageUp',
            description: {
              en: 'Moves focus up by page size',
              ja: 'フォーカスをページサイズ分上に移動',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Focus Management (Roving Tabindex)', ja: 'フォーカス管理 (Roving Tabindex)' },
        testType: 'E2E',
        items: [
          {
            name: 'tabindex="0"',
            description: {
              en: 'First focusable cell has tabindex="0"',
              ja: '最初のフォーカス可能なセルがtabindex="0"を持つ',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Other cells have tabindex="-1"',
              ja: '他のセルがtabindex="-1"を持つ',
            },
          },
          {
            name: 'Headers not focusable',
            description: {
              en: 'columnheader cells have no tabindex (not focusable)',
              ja: 'columnheaderセルにtabindexがない（フォーカス不可）',
            },
          },
          {
            name: 'Tab exits grid',
            description: {
              en: 'Tab moves focus out of grid',
              ja: 'Tabでフォーカスがグリッド外に移動',
            },
          },
          {
            name: 'Focus update',
            description: {
              en: 'Focused cell updates tabindex on navigation',
              ja: 'ナビゲーション時にフォーカスセルのtabindexが更新される',
            },
          },
          {
            name: 'Disabled cells',
            description: {
              en: 'Disabled cells are focusable but not activatable',
              ja: '無効セルはフォーカス可能だがアクティベート不可',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Selection', ja: '選択' },
        testType: 'E2E',
        items: [
          {
            name: 'Space toggles',
            description: {
              en: 'Space toggles cell selection (when selectable)',
              ja: 'Spaceでセル選択をトグル（選択可能時）',
            },
          },
          {
            name: 'Single select',
            description: {
              en: 'Single selection clears previous on Space',
              ja: '単一選択モードではSpaceで前の選択をクリア',
            },
          },
          {
            name: 'Multi select',
            description: {
              en: 'Multi-selection allows multiple cells',
              ja: '複数選択モードでは複数セルを選択可能',
            },
          },
          {
            name: 'Enter activates',
            description: {
              en: 'Enter triggers cell activation',
              ja: 'Enterでセルをアクティベート',
            },
          },
          {
            name: 'Disabled no select',
            description: {
              en: 'Space does not select disabled cell',
              ja: 'Spaceで無効セルは選択できない',
            },
          },
          {
            name: 'Disabled no activate',
            description: {
              en: 'Enter does not activate disabled cell',
              ja: 'Enterで無効セルはアクティベートできない',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Virtualization Support', ja: '仮想化サポート' },
        testType: 'Unit',
        items: [
          {
            name: 'aria-rowcount',
            description: { en: 'Present when totalRows provided', ja: 'totalRows指定時に存在' },
          },
          {
            name: 'aria-colcount',
            description: {
              en: 'Present when totalColumns provided',
              ja: 'totalColumns指定時に存在',
            },
          },
          {
            name: 'aria-rowindex',
            description: {
              en: 'Present on rows/cells when virtualizing',
              ja: '仮想化時に行/セルに存在',
            },
          },
          {
            name: 'aria-colindex',
            description: { en: 'Present on cells when virtualizing', ja: '仮想化時にセルに存在' },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility', ja: 'アクセシビリティ' },
        testType: 'E2E',
        items: [
          {
            name: 'axe-core',
            description: {
              en: 'No accessibility violations',
              ja: 'アクセシビリティ違反がないこと',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/grid.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests', ja: 'ユニットテストを実行' },
        command: 'npm run test:unit',
      },
      {
        comment: { en: 'Run framework-specific tests', ja: 'フレームワーク固有のテストを実行' },
        command: 'npm run test:react',
      },
      { comment: { en: 'Run E2E tests', ja: 'E2Eテストを実行' }, command: 'npm run test:e2e' },
      {
        comment: { en: 'Run E2E tests in UI mode', ja: 'E2EテストをUIモードで実行' },
        command: 'npm run test:e2e:ui',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: { en: 'Test runner for unit tests', ja: 'ユニットテスト用テストランナー' },
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
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: { en: 'Browser automation for E2E tests', ja: 'E2Eテスト用ブラウザ自動化' },
      },
      {
        name: 'axe-core/playwright',
        url: 'https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright',
        description: {
          en: 'Automated accessibility testing in E2E',
          ja: 'E2Eでの自動アクセシビリティテスト',
        },
      },
    ],
  },

  testChecklist: [
    // ARIA - High Priority
    { description: 'Container has role="grid"', priority: 'high', category: 'aria' },
    { description: 'All rows have role="row"', priority: 'high', category: 'aria' },
    { description: 'Data cells have role="gridcell"', priority: 'high', category: 'aria' },
    { description: 'Header cells have role="columnheader"', priority: 'high', category: 'aria' },
    {
      description: 'Has accessible name via aria-label or aria-labelledby',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-multiselectable present when multi-select enabled',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-selected present on all cells when selectable',
      priority: 'high',
      category: 'aria',
    },
    { description: 'aria-disabled present on disabled cells', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    {
      description: 'ArrowRight/Left/Up/Down navigate in 2D',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Home/End navigate within row', priority: 'high', category: 'keyboard' },
    {
      description: 'Ctrl+Home/End navigate to grid corners',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'PageUp/PageDown navigate by page size',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Space toggles cell selection', priority: 'high', category: 'keyboard' },
    { description: 'Enter activates focused cell', priority: 'high', category: 'keyboard' },
    { description: 'Tab exits grid to next element', priority: 'high', category: 'keyboard' },

    // Focus - High Priority
    { description: 'Roving tabindex implemented correctly', priority: 'high', category: 'focus' },
    { description: 'Header cells are not focusable', priority: 'high', category: 'focus' },
    {
      description: 'Disabled cells are focusable but not activatable',
      priority: 'high',
      category: 'focus',
    },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Virtualization attributes correct when provided',
      priority: 'medium',
      category: 'aria',
    },
  ],

  implementationNotes: `
## Structure

\`\`\`
┌─────────────────────────────────────────────────────────────────┐
│ div role="grid" aria-label="..."                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (header row)                                 │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│ │ │ columnheader │ │ columnheader │ │ columnheader │         │ │
│ │ │ (no tabIndex)│ │ (no tabIndex)│ │ (no tabIndex)│         │ │
│ │ │ NOT focusable│ │ NOT focusable│ │ NOT focusable│         │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (data row)                                   │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│ │ │ gridcell     │ │ gridcell     │ │ gridcell     │         │ │
│ │ │ tabIndex=0   │ │ tabIndex=-1  │ │ tabIndex=-1  │         │ │
│ │ │ (focused)    │ │              │ │              │         │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
\`\`\`

## Critical Implementation Points

1. **Header cells are NOT focusable** - no sort functionality
2. **No aria-readonly** - no edit functionality
3. **No rowgroup** - simplified structure
4. **Cell ID convention**: \`\${rowId}-\${colIndex}\` for consistent controlled mode
5. **Disabled cells**: Focusable but cannot be selected or activated
6. **CSS Grid layout**: Avoid order or grid-area reordering (visual/DOM mismatch)
`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// 2D Navigation
it('ArrowRight moves focus to next cell', async () => {
  const user = userEvent.setup();
  render(<Grid columns={columns} rows={rows} ariaLabel="Test Grid" />);

  const firstCell = screen.getAllByRole('gridcell')[0];
  firstCell.focus();

  await user.keyboard('{ArrowRight}');

  expect(screen.getAllByRole('gridcell')[1]).toHaveFocus();
});

// ArrowUp does not enter header row
it('ArrowUp stops at first data row', async () => {
  const user = userEvent.setup();
  render(<Grid columns={columns} rows={rows} ariaLabel="Test Grid" />);

  const firstDataCell = screen.getAllByRole('gridcell')[0];
  firstDataCell.focus();

  await user.keyboard('{ArrowUp}');

  // Should stay on first data row, not move to header
  expect(firstDataCell).toHaveFocus();
});

// Selection toggle
it('Space toggles cell selection', async () => {
  const user = userEvent.setup();
  render(<Grid columns={columns} rows={rows} ariaLabel="Test Grid" selectable />);

  const cell = screen.getAllByRole('gridcell')[0];
  cell.focus();

  expect(cell).toHaveAttribute('aria-selected', 'false');

  await user.keyboard(' ');

  expect(cell).toHaveAttribute('aria-selected', 'true');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';

// ARIA Structure
test('has correct grid structure', async ({ page }) => {
  await page.goto('patterns/grid/react/');
  const grid = page.getByRole('grid');
  await expect(grid).toBeVisible();

  // Verify rows and cells
  const rows = page.getByRole('row');
  expect(await rows.count()).toBeGreaterThan(1);
  await expect(page.getByRole('columnheader').first()).toBeVisible();
  await expect(page.getByRole('gridcell').first()).toBeVisible();
});

// 2D Keyboard Navigation
test('arrow keys navigate in 2D', async ({ page }) => {
  await page.goto('patterns/grid/react/');
  const grid = page.getByRole('grid').first();
  const cells = grid.getByRole('gridcell');

  // Focus first cell
  await cells.first().click();

  // ArrowRight moves to next cell
  await page.keyboard.press('ArrowRight');
  await expect(cells.nth(1)).toBeFocused();
});

// Roving Tabindex
test('roving tabindex updates on navigation', async ({ page }) => {
  await page.goto('patterns/grid/react/');
  const cells = page.getByRole('gridcell');
  const firstCell = cells.first();
  const secondCell = cells.nth(1);

  // Initially first cell has tabindex="0"
  await expect(firstCell).toHaveAttribute('tabindex', '0');
  await expect(secondCell).toHaveAttribute('tabindex', '-1');

  // Navigate right
  await firstCell.click();
  await page.keyboard.press('ArrowRight');

  // Tabindex should update
  await expect(firstCell).toHaveAttribute('tabindex', '-1');
  await expect(secondCell).toHaveAttribute('tabindex', '0');
});`,
};
