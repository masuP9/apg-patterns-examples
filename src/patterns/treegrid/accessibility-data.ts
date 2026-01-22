import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const treegridAccessibilityData: PatternAccessibilityData = {
  pattern: 'treegrid',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/',

  overview: {
    en: 'A treegrid combines Grid 2D keyboard navigation with TreeView hierarchical expand/collapse functionality. Rows can be expanded to show child rows, and selection is on rows rather than cells.',
    ja: 'TreeGridは、Gridの2Dキーボードナビゲーションと、TreeViewの階層展開/折りたたみ機能を組み合わせたものです。行は子行を表示するために展開でき、選択はセルではなく行に対して行われます。',
  },

  // --- Additional Notes (TreeGrid vs Grid) ---

  additionalNotes: [
    {
      en: 'Rows can be expanded/collapsed to show/hide child rows',
      ja: '行を展開/折りたたみして子行の表示/非表示を切り替えられます',
    },
    {
      en: 'Row selection instead of cell selection (aria-selected on row, not gridcell)',
      ja: 'セル選択ではなく行選択（aria-selectedはgridcellではなくrowに設定）',
    },
    {
      en: 'Tree operations (expand/collapse) only work at the rowheader column',
      ja: 'ツリー操作（展開/折りたたみ）はrowheader列でのみ機能します',
    },
    {
      en: 'Rows have aria-level to indicate hierarchy depth',
      ja: '行には階層の深さを示すaria-levelがあります',
    },
  ],

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'treegrid',
      element: { en: 'Container', ja: 'コンテナ' },
      description: {
        en: 'The treegrid container (composite widget)',
        ja: 'treegridコンテナ（複合ウィジェット）',
      },
    },
    {
      name: 'row',
      element: { en: 'Row container', ja: '行コンテナ' },
      description: {
        en: 'Groups cells horizontally, may have children',
        ja: 'セルを水平方向にグループ化し、子を持つことができます',
      },
    },
    {
      name: 'columnheader',
      element: { en: 'Header cells', ja: 'ヘッダーセル' },
      description: {
        en: 'Column headers (not focusable)',
        ja: '列ヘッダー（フォーカス不可）',
      },
    },
    {
      name: 'rowheader',
      element: { en: 'First column cell', ja: '最初の列セル' },
      description: {
        en: 'Row header where tree operations occur',
        ja: 'ツリー操作が行われる行ヘッダー',
      },
    },
    {
      name: 'gridcell',
      element: { en: 'Data cells', ja: 'データセル' },
      description: {
        en: 'Interactive cells (focusable)',
        ja: 'インタラクティブなセル（フォーカス可能）',
      },
    },
  ],

  properties: [
    {
      attribute: 'role="treegrid"',
      element: 'Container',
      values: '-',
      required: true,
      notes: {
        en: 'Identifies the container as a treegrid',
        ja: 'コンテナをtreegridとして識別します',
      },
    },
    {
      attribute: 'aria-label',
      element: 'treegrid',
      values: { en: 'String', ja: '文字列' },
      required: {
        en: 'Yes (either aria-label or aria-labelledby)',
        ja: 'はい（aria-labelまたはaria-labelledbyのいずれか）',
      },
      notes: {
        en: 'Accessible name for the treegrid',
        ja: 'treegridのアクセシブルな名前',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'treegrid',
      values: { en: 'ID reference', ja: 'ID参照' },
      required: {
        en: 'Yes (either aria-label or aria-labelledby)',
        ja: 'はい（aria-labelまたはaria-labelledbyのいずれか）',
      },
      notes: {
        en: 'Alternative to aria-label',
        ja: 'aria-labelの代替',
      },
    },
    {
      attribute: 'aria-multiselectable',
      element: 'treegrid',
      values: 'true',
      required: false,
      notes: {
        en: 'Only present for multi-select mode',
        ja: '複数選択モードの場合のみ存在',
      },
    },
    {
      attribute: 'aria-rowcount',
      element: 'treegrid',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Total rows (for virtualization)',
        ja: '総行数（仮想化用）',
      },
    },
    {
      attribute: 'aria-colcount',
      element: 'treegrid',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Total columns (for virtualization)',
        ja: '総列数（仮想化用）',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-level',
      element: { en: 'row', ja: 'row' },
      values: { en: 'Number (1-based)', ja: '数値（1始まり）' },
      required: true,
      changeTrigger: {
        en: 'Static per row (determined by hierarchy)',
        ja: '行ごとに静的（階層構造により決定）',
      },
    },
    {
      attribute: 'aria-expanded',
      element: { en: 'row (parent only)', ja: 'row（親のみ）' },
      values: 'true | false',
      required: true,
      changeTrigger: {
        en: 'ArrowRight/Left at rowheader, click on expand icon',
        ja: 'rowheaderでのArrowRight/Left、展開アイコンのクリック',
      },
    },
    {
      attribute: 'aria-selected',
      element: { en: 'row', ja: 'row' },
      values: 'true | false',
      required: false,
      changeTrigger: {
        en: 'Space key, click (NOT on gridcell)',
        ja: 'Spaceキー、クリック（gridcellではなく行に設定）',
      },
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'row', ja: 'row' },
      values: 'true',
      required: false,
      changeTrigger: {
        en: 'Only when row is disabled',
        ja: '行が無効な場合のみ',
      },
    },
    {
      attribute: 'aria-rowindex',
      element: { en: 'row', ja: 'row' },
      values: { en: 'Number', ja: '数値' },
      required: false,
      changeTrigger: {
        en: 'Static (for virtualization)',
        ja: '静的（仮想化用）',
      },
    },
  ],

  // --- Keyboard Support ---

  keyboardSections: [
    {
      title: {
        en: '2D Navigation',
        ja: '2Dナビゲーション',
      },
      shortcuts: [
        {
          key: 'Arrow Down',
          action: {
            en: 'Move focus to same column in next visible row',
            ja: '次の表示行の同じ列にフォーカスを移動',
          },
        },
        {
          key: 'Arrow Up',
          action: {
            en: 'Move focus to same column in previous visible row',
            ja: '前の表示行の同じ列にフォーカスを移動',
          },
        },
        {
          key: 'Arrow Right',
          action: {
            en: 'Move focus one cell right (at non-rowheader cells)',
            ja: 'フォーカスを右に1セル移動（非rowheaderセルの場合）',
          },
        },
        {
          key: 'Arrow Left',
          action: {
            en: 'Move focus one cell left (at non-rowheader cells)',
            ja: 'フォーカスを左に1セル移動（非rowheaderセルの場合）',
          },
        },
        {
          key: 'Home',
          action: {
            en: 'Move focus to first cell in row',
            ja: '行の最初のセルにフォーカスを移動',
          },
        },
        {
          key: 'End',
          action: {
            en: 'Move focus to last cell in row',
            ja: '行の最後のセルにフォーカスを移動',
          },
        },
        {
          key: 'Ctrl + Home',
          action: {
            en: 'Move focus to first cell in treegrid',
            ja: 'treegridの最初のセルにフォーカスを移動',
          },
        },
        {
          key: 'Ctrl + End',
          action: {
            en: 'Move focus to last cell in treegrid',
            ja: 'treegridの最後のセルにフォーカスを移動',
          },
        },
      ],
    },
    {
      title: {
        en: 'Tree Operations (at rowheader only)',
        ja: 'ツリー操作（rowheaderのみ）',
      },
      shortcuts: [
        {
          key: 'Arrow Right (at rowheader)',
          action: {
            en: "If collapsed parent: expand row. If expanded parent: move to first child's rowheader. If leaf: do nothing",
            ja: '折りたたまれた親の場合: 行を展開。展開された親の場合: 最初の子のrowheaderに移動。リーフの場合: 何もしない',
          },
        },
        {
          key: 'Arrow Left (at rowheader)',
          action: {
            en: "If expanded parent: collapse row. If collapsed/leaf: move to parent's rowheader. If at root level collapsed: do nothing",
            ja: '展開された親の場合: 行を折りたたみ。折りたたみ済み/リーフの場合: 親のrowheaderに移動。ルートレベルで折りたたみ済みの場合: 何もしない',
          },
        },
      ],
    },
    {
      title: {
        en: 'Row Selection & Cell Activation',
        ja: '行選択とセルアクティベーション',
      },
      shortcuts: [
        {
          key: 'Space',
          action: {
            en: 'Toggle row selection (NOT cell selection)',
            ja: '行の選択を切り替え（セル選択ではない）',
          },
        },
        {
          key: 'Enter',
          action: {
            en: 'Activate focused cell (does NOT expand/collapse)',
            ja: 'フォーカスされたセルをアクティブ化（展開/折りたたみはしない）',
          },
        },
        {
          key: 'Ctrl + A',
          action: {
            en: 'Select all visible rows (when multiselectable)',
            ja: 'すべての表示行を選択（複数選択可能な場合）',
          },
        },
      ],
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Focus model', ja: 'フォーカスモデル' },
      behavior: {
        en: 'Roving tabindex - only one cell has tabindex="0"',
        ja: 'ローヴィングタブインデックス - 1つのセルのみがtabindex="0"を持つ',
      },
    },
    {
      event: { en: 'Other cells', ja: '他のセル' },
      behavior: 'tabindex="-1"',
    },
    {
      event: { en: 'TreeGrid', ja: 'TreeGrid' },
      behavior: {
        en: 'Single Tab stop (Tab enters/exits the grid)',
        ja: '単一のTabストップ（Tabでグリッドに入る/出る）',
      },
    },
    {
      event: { en: 'Column headers', ja: '列ヘッダー' },
      behavior: {
        en: 'NOT focusable (no tabindex)',
        ja: 'フォーカス不可（tabindexなし）',
      },
    },
    {
      event: { en: 'Collapsed children', ja: '折りたたまれた子' },
      behavior: {
        en: 'NOT in keyboard navigation',
        ja: 'キーボードナビゲーションに含まれない',
      },
    },
    {
      event: { en: 'Parent collapses', ja: '親の折りたたみ' },
      behavior: {
        en: 'If focus was on child, move focus to parent',
        ja: '子にフォーカスがあった場合、親にフォーカスを移動',
      },
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG: TreeGrid Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/',
    },
    {
      title: 'W3C ARIA: treegrid role',
      url: 'https://w3c.github.io/aria/#treegrid',
    },
  ],

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト（Testing Library）' },
        description: {
          en: 'Verify component rendering and interactions using framework-specific Testing Library utilities. These tests ensure correct component behavior in isolation.',
          ja: 'フレームワーク固有のTesting Libraryユーティリティを使用してコンポーネントのレンダリングとインタラクションを検証します。これらのテストはコンポーネントの分離された動作を確認します。',
        },
        areas: [
          {
            en: 'HTML structure and element hierarchy (treegrid, row, rowheader, gridcell)',
            ja: 'HTML構造と要素の階層（treegrid、row、rowheader、gridcell）',
          },
          {
            en: 'Initial attribute values (role, aria-label, aria-level, aria-expanded)',
            ja: '初期属性値（role、aria-label、aria-level、aria-expanded）',
          },
          {
            en: 'Selection state changes (aria-selected on rows)',
            ja: '選択状態の変更（行のaria-selected）',
          },
          {
            en: 'Hierarchy depth indicators (aria-level)',
            ja: '階層深度インジケーター（aria-level）',
          },
          { en: 'CSS class application', ja: 'CSSクラスの適用' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all four frameworks. These tests cover interactions that require full browser context.',
          ja: '4つのフレームワークすべてで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストは完全なブラウザコンテキストが必要なインタラクションをカバーします。',
        },
        areas: [
          {
            en: '2D keyboard navigation (Arrow keys)',
            ja: '2Dキーボードナビゲーション（矢印キー）',
          },
          {
            en: 'Tree operations at rowheader (ArrowRight/Left for expand/collapse)',
            ja: 'rowheaderでのツリー操作（展開/折りたたみのArrowRight/Left）',
          },
          {
            en: 'Extended navigation (Home, End, Ctrl+Home, Ctrl+End)',
            ja: '拡張ナビゲーション（Home、End、Ctrl+Home、Ctrl+End）',
          },
          { en: 'Row selection with Space', ja: 'Spaceでの行選択' },
          {
            en: 'Focus management and roving tabindex',
            ja: 'フォーカス管理とローヴィングタブインデックス',
          },
          {
            en: 'Hidden row handling (collapsed children)',
            ja: '非表示行の処理（折りたたまれた子）',
          },
          { en: 'Cross-framework consistency', ja: 'フレームワーク間の一貫性' },
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
            name: 'role="treegrid"',
            description: {
              en: 'Container has treegrid role',
              ja: 'コンテナにtreegridロールがある',
            },
          },
          {
            name: 'role="row"',
            description: { en: 'All rows have row role', ja: 'すべての行にrowロールがある' },
          },
          {
            name: 'role="rowheader"',
            description: {
              en: 'First cell in row has rowheader role',
              ja: '行の最初のセルにrowheaderロールがある',
            },
          },
          {
            name: 'role="gridcell"',
            description: {
              en: 'Other cells have gridcell role',
              ja: '他のセルにgridcellロールがある',
            },
          },
          {
            name: 'role="columnheader"',
            description: {
              en: 'Header cells have columnheader role',
              ja: 'ヘッダーセルにcolumnheaderロールがある',
            },
          },
          {
            name: 'aria-label',
            description: {
              en: 'TreeGrid has accessible name via aria-label',
              ja: 'TreeGridにaria-label経由のアクセシブルな名前がある',
            },
          },
          {
            name: 'aria-level',
            description: {
              en: 'All rows have aria-level (1-based depth)',
              ja: 'すべての行にaria-level（1始まりの深さ）がある',
            },
          },
          {
            name: 'aria-expanded',
            description: {
              en: 'Parent rows have aria-expanded (true/false)',
              ja: '親行にaria-expanded（true/false）がある',
            },
          },
          {
            name: 'aria-selected on row',
            description: {
              en: 'Selection on row element (not cell)',
              ja: '行要素に選択がある（セルではない）',
            },
          },
          {
            name: 'aria-multiselectable',
            description: {
              en: 'Present when multi-selection is enabled',
              ja: '複数選択が有効な場合に存在',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Tree Operations (at Rowheader)', ja: 'ツリー操作（Rowheaderで）' },
        testType: 'E2E',
        items: [
          {
            name: 'ArrowRight expands',
            description: {
              en: 'Expands collapsed parent row',
              ja: '折りたたまれた親行を展開',
            },
          },
          {
            name: 'ArrowRight to child',
            description: {
              en: 'Moves to first child when already expanded',
              ja: '既に展開されている場合、最初の子に移動',
            },
          },
          {
            name: 'ArrowLeft collapses',
            description: {
              en: 'Collapses expanded parent row',
              ja: '展開された親行を折りたたみ',
            },
          },
          {
            name: 'ArrowLeft to parent',
            description: {
              en: 'Moves to parent row when collapsed or leaf',
              ja: '折りたたみまたはリーフの場合、親行に移動',
            },
          },
          {
            name: 'Enter activates only',
            description: {
              en: 'Enter does NOT expand/collapse (unlike Tree)',
              ja: 'Enterは展開/折りたたみをしない（Treeとは異なる）',
            },
          },
          {
            name: 'Children hidden',
            description: {
              en: 'Child rows hidden when parent collapsed',
              ja: '親が折りたたまれると子行が非表示',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: '2D Keyboard Navigation', ja: '2Dキーボードナビゲーション' },
        testType: 'E2E',
        items: [
          {
            name: 'ArrowRight (non-rowheader)',
            description: {
              en: 'Moves focus one cell right',
              ja: 'フォーカスを右に1セル移動',
            },
          },
          {
            name: 'ArrowLeft (non-rowheader)',
            description: {
              en: 'Moves focus one cell left',
              ja: 'フォーカスを左に1セル移動',
            },
          },
          {
            name: 'ArrowDown',
            description: {
              en: 'Moves focus to next visible row',
              ja: '次の表示行にフォーカスを移動',
            },
          },
          {
            name: 'ArrowUp',
            description: {
              en: 'Moves focus to previous visible row',
              ja: '前の表示行にフォーカスを移動',
            },
          },
          {
            name: 'Skip hidden rows',
            description: {
              en: 'ArrowDown/Up skips collapsed children',
              ja: 'ArrowDown/Upは折りたたまれた子をスキップ',
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
              ja: '行の最初のセルにフォーカスを移動',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Moves focus to last cell in row',
              ja: '行の最後のセルにフォーカスを移動',
            },
          },
          {
            name: 'Ctrl+Home',
            description: {
              en: 'Moves focus to first cell in first visible row',
              ja: '最初の表示行の最初のセルにフォーカスを移動',
            },
          },
          {
            name: 'Ctrl+End',
            description: {
              en: 'Moves focus to last cell in last visible row',
              ja: '最後の表示行の最後のセルにフォーカスを移動',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Focus Management (Roving Tabindex)',
          ja: 'フォーカス管理（ローヴィングタブインデックス）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'tabindex="0"',
            description: {
              en: 'First focusable cell has tabindex="0"',
              ja: '最初のフォーカス可能なセルにtabindex="0"がある',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Other cells have tabindex="-1"',
              ja: '他のセルにtabindex="-1"がある',
            },
          },
          {
            name: 'Headers not focusable',
            description: {
              en: 'columnheader cells have no tabindex',
              ja: 'columnheaderセルにtabindexがない',
            },
          },
          {
            name: 'Tab exits treegrid',
            description: {
              en: 'Tab moves focus out of treegrid',
              ja: 'Tabでtreegridからフォーカスが外れる',
            },
          },
          {
            name: 'Focus update',
            description: {
              en: 'Focused cell updates tabindex on navigation',
              ja: 'ナビゲーション時にフォーカスされたセルのtabindexが更新される',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Row Selection', ja: '行選択' },
        testType: 'E2E',
        items: [
          {
            name: 'Space toggles row',
            description: {
              en: 'Space toggles row selection (not cell)',
              ja: 'Spaceで行の選択を切り替え（セルではない）',
            },
          },
          {
            name: 'Single select',
            description: {
              en: 'Single selection clears previous on Space',
              ja: '単一選択ではSpaceで前の選択をクリア',
            },
          },
          {
            name: 'Multi select',
            description: {
              en: 'Multi-selection allows multiple rows',
              ja: '複数選択では複数行を選択可能',
            },
          },
          {
            name: 'Enter activates cell',
            description: {
              en: 'Enter triggers cell activation',
              ja: 'Enterでセルをアクティブ化',
            },
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
              ja: 'アクセシビリティ違反がない',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/treegrid.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for TreeGrid', ja: 'TreeGridのユニットテストを実行' },
        command: 'npm run test -- treegrid',
      },
      {
        comment: {
          en: 'Run E2E tests for TreeGrid (all frameworks)',
          ja: 'TreeGridのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=treegrid',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークのE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=treegrid',
      },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:vue:pattern --pattern=treegrid' },
      {
        comment: { en: '', ja: '' },
        command: 'npm run test:e2e:svelte:pattern --pattern=treegrid',
      },
      {
        comment: { en: '', ja: '' },
        command: 'npm run test:e2e:astro:pattern --pattern=treegrid',
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
          ja: 'フレームワーク固有のテストユーティリティ（React、Vue、Svelte）',
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
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // ARIA - High Priority
    { description: 'Container has role="treegrid"', priority: 'high', category: 'aria' },
    { description: 'Each row has role="row"', priority: 'high', category: 'aria' },
    { description: 'First cell has role="rowheader"', priority: 'high', category: 'aria' },
    { description: 'Other cells have role="gridcell"', priority: 'high', category: 'aria' },
    { description: 'Header cells have role="columnheader"', priority: 'high', category: 'aria' },
    { description: 'All rows have aria-level', priority: 'high', category: 'aria' },
    {
      description: 'Parent rows have aria-expanded (true/false)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Selection uses aria-selected on row (not cell)',
      priority: 'high',
      category: 'aria',
    },

    // Keyboard - High Priority
    {
      description: 'ArrowRight expands collapsed parent at rowheader',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowLeft collapses expanded parent at rowheader',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowRight/Left navigate cells at non-rowheader',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'ArrowDown/Up navigate visible rows', priority: 'high', category: 'keyboard' },
    {
      description: 'Home/End navigate to first/last cell in row',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Ctrl+Home/End navigate to first/last cell in treegrid',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Space toggles row selection', priority: 'high', category: 'keyboard' },
    {
      description: 'Enter activates cell (does NOT expand/collapse)',
      priority: 'high',
      category: 'keyboard',
    },

    // Focus Management - High Priority
    { description: 'Focused cell has tabIndex="0"', priority: 'high', category: 'focus' },
    { description: 'Other cells have tabIndex="-1"', priority: 'high', category: 'focus' },
    { description: 'Column headers are not focusable', priority: 'high', category: 'focus' },
    {
      description: 'Tab enters/exits treegrid (single tab stop)',
      priority: 'high',
      category: 'focus',
    },
    {
      description: 'Focus moves to parent when child collapses',
      priority: 'high',
      category: 'focus',
    },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ [Header 1] [Header 2] [Header 3]  ← columnheader (not focusable)
├─────────────────────────────────────────────────────────┤
│ ▼ [Parent]  │ [Cell]   │ [Cell]   ← row (aria-level="1", aria-expanded="true")
│   [Child 1] │ [Cell]   │ [Cell]   ← row (aria-level="2")
│   [Child 2] │ [Cell]   │ [Cell]   ← row (aria-level="2")
│ ▶ [Parent]  │ [Cell]   │ [Cell]   ← row (aria-level="1", aria-expanded="false")
│ [Leaf]      │ [Cell]   │ [Cell]   ← row (aria-level="1", NO aria-expanded)
└─────────────────────────────────────────────────────────┘
          ↑                     ↑
       rowheader             gridcell
\`\`\`

## Key Differences from Grid

| Feature | TreeGrid | Grid |
|---------|----------|------|
| Selection | Row selection (aria-selected on row) | Cell selection |
| Arrow at rowheader | Expand/collapse tree | Move focus |
| Enter key | Cell activation only | Cell activation |
| Hierarchy | aria-level, aria-expanded on rows | None |
| Navigation | Collapsed children skipped | All cells |

## Focus Management (Roving Tabindex)

- Only one cell has tabindex="0" at a time
- Arrow keys move focus AND update tabindex
- Tab/Shift+Tab enters/exits treegrid
- When parent collapses with focus on child, move focus to parent`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA structure test
it('has correct treegrid structure', () => {
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);

  const treegrid = screen.getByRole('treegrid');
  expect(treegrid).toHaveAttribute('aria-label', 'Files');

  const rows = screen.getAllByRole('row');
  expect(rows.length).toBeGreaterThan(0);

  // Check parent row has aria-level and aria-expanded
  const parentRow = rows.find(r => r.getAttribute('aria-expanded') !== null);
  expect(parentRow).toHaveAttribute('aria-level');
});

// Tree operation test
it('expands/collapses row with arrow keys at rowheader', async () => {
  const user = userEvent.setup();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);

  const rowheader = screen.getAllByRole('rowheader')[0];
  rowheader.focus();

  // Expand
  await user.keyboard('{ArrowRight}');
  const parentRow = rowheader.closest('[role="row"]');
  expect(parentRow).toHaveAttribute('aria-expanded', 'true');

  // Collapse
  await user.keyboard('{ArrowLeft}');
  expect(parentRow).toHaveAttribute('aria-expanded', 'false');
});

// Row selection test
it('toggles row selection with Space', async () => {
  const user = userEvent.setup();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" selectable />);

  const cell = screen.getAllByRole('gridcell')[0];
  cell.focus();

  await user.keyboard(' ');
  const row = cell.closest('[role="row"]');
  expect(row).toHaveAttribute('aria-selected', 'true');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('treegrid has proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  const treegrid = page.getByRole('treegrid');

  await expect(treegrid).toBeAttached();
  await expect(treegrid).toHaveAttribute('aria-label', /.+/);

  // Check rows have aria-level
  const rows = treegrid.getByRole('row');
  const firstRow = rows.first();
  await expect(firstRow).toHaveAttribute('aria-level');
});

// Tree operation test
test('arrow keys expand/collapse at rowheader', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  const rowheader = page.getByRole('rowheader').first();

  await rowheader.click();

  // Get parent row
  const row = page.getByRole('row').filter({ has: rowheader });

  // If collapsed, expand
  const isExpanded = await row.getAttribute('aria-expanded');
  if (isExpanded === 'false') {
    await page.keyboard.press('ArrowRight');
    await expect(row).toHaveAttribute('aria-expanded', 'true');
  }

  // Collapse
  await page.keyboard.press('ArrowLeft');
  await expect(row).toHaveAttribute('aria-expanded', 'false');
});

// Keyboard navigation test
test('arrow keys navigate between visible rows', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  const cells = page.getByRole('gridcell');
  const firstCell = cells.first();

  await firstCell.click();
  await expect(firstCell).toBeFocused();

  await page.keyboard.press('ArrowDown');
  // Focus should move to cell in next visible row
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/treegrid/react/demo/');
  await page.getByRole('treegrid').waitFor();

  const results = await new AxeBuilder({ page })
    .include('[role="treegrid"]')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
