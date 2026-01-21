import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const dataGridAccessibilityData: PatternAccessibilityData = {
  pattern: 'data-grid',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',

  overview: {
    en: 'A data grid presents tabular data with interactive cells that support navigation, selection, and editing.',
    ja: 'データグリッドは、ナビゲーション、選択、編集をサポートするインタラクティブなセルを持つ表形式のデータを表示します。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'grid',
      element: { en: 'Container', ja: 'コンテナ' },
      description: {
        en: 'Identifies the element as a grid. The grid contains rows of cells.',
        ja: 'グリッドとして要素を識別します。グリッドはセルの行を含みます。',
      },
    },
    {
      name: 'row',
      element: { en: 'Each row', ja: '各行' },
      description: { en: 'Identifies a row of cells', ja: 'セルの行を識別します' },
    },
    {
      name: 'gridcell',
      element: { en: 'Each cell', ja: '各セル' },
      description: {
        en: 'Identifies an interactive cell in the grid',
        ja: 'グリッド内のインタラクティブなセルを識別します',
      },
    },
    {
      name: 'rowheader',
      element: { en: 'Row header cell', ja: '行ヘッダーセル' },
      description: {
        en: 'Identifies a cell as a header for its row',
        ja: '行のヘッダーとしてセルを識別します',
      },
    },
    {
      name: 'columnheader',
      element: { en: 'Column header cell', ja: '列ヘッダーセル' },
      description: {
        en: 'Identifies a cell as a header for its column',
        ja: '列のヘッダーとしてセルを識別します',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-rowcount',
      element: 'grid',
      values: { en: 'Total number of rows', ja: '総行数' },
      required: false,
      notes: {
        en: 'Required when rows are virtualized',
        ja: '行が仮想化されている場合に必須',
      },
    },
    {
      attribute: 'aria-colcount',
      element: 'grid',
      values: { en: 'Total number of columns', ja: '総列数' },
      required: false,
      notes: {
        en: 'Required when columns are hidden or virtualized',
        ja: '列が非表示または仮想化されている場合に必須',
      },
    },
    {
      attribute: 'aria-rowindex',
      element: { en: 'row or gridcell', ja: 'row または gridcell' },
      values: { en: "Row's position in the grid", ja: 'グリッド内の行の位置' },
      required: false,
      notes: {
        en: 'Required when rows are virtualized',
        ja: '行が仮想化されている場合に必須',
      },
    },
    {
      attribute: 'aria-colindex',
      element: { en: 'gridcell or columnheader', ja: 'gridcell または columnheader' },
      values: { en: "Column's position in the grid", ja: 'グリッド内の列の位置' },
      required: false,
      notes: {
        en: 'Required when columns are hidden or virtualized',
        ja: '列が非表示または仮想化されている場合に必須',
      },
    },
    {
      attribute: 'aria-sort',
      element: 'columnheader',
      values: '"ascending" | "descending" | "none" | "other"',
      required: false,
      notes: {
        en: 'Indicates the sorting state of a column',
        ja: '列のソート状態を示します',
      },
    },
    {
      attribute: 'aria-describedby',
      element: 'grid',
      values: { en: 'ID reference to description element', ja: '説明要素へのID参照' },
      required: false,
      notes: {
        en: 'Provides additional context about the grid',
        ja: 'グリッドに関する追加のコンテキストを提供します',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-selected',
      element: { en: 'gridcell or row', ja: 'gridcell または row' },
      values: 'true | false',
      required: false,
      changeTrigger: {
        en: 'Click, Space, Ctrl/Cmd+Click',
        ja: 'クリック、Space、Ctrl/Cmd+クリック',
      },
    },
    {
      attribute: 'aria-readonly',
      element: { en: 'grid or gridcell', ja: 'grid または gridcell' },
      values: 'true | false',
      required: false,
      changeTrigger: { en: 'Grid/cell configuration', ja: 'グリッド/セルの設定' },
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'grid, row, or gridcell', ja: 'grid、row、または gridcell' },
      values: 'true | false',
      required: false,
      changeTrigger: { en: 'Grid/row/cell state change', ja: 'グリッド/行/セルの状態変更' },
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'ArrowRight',
      action: {
        en: 'Move focus one cell to the right. Wraps to next row if at end.',
        ja: 'フォーカスを右に1セル移動します。末尾の場合は次の行に折り返します。',
      },
    },
    {
      key: 'ArrowLeft',
      action: {
        en: 'Move focus one cell to the left. Wraps to previous row if at start.',
        ja: 'フォーカスを左に1セル移動します。先頭の場合は前の行に折り返します。',
      },
    },
    {
      key: 'ArrowDown',
      action: {
        en: 'Move focus one cell down.',
        ja: 'フォーカスを下に1セル移動します。',
      },
    },
    {
      key: 'ArrowUp',
      action: {
        en: 'Move focus one cell up.',
        ja: 'フォーカスを上に1セル移動します。',
      },
    },
    {
      key: 'Home',
      action: {
        en: 'Move focus to the first cell in the row.',
        ja: '行の最初のセルにフォーカスを移動します。',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Move focus to the last cell in the row.',
        ja: '行の最後のセルにフォーカスを移動します。',
      },
    },
    {
      key: 'Ctrl + Home',
      action: {
        en: 'Move focus to the first cell in the grid.',
        ja: 'グリッドの最初のセルにフォーカスを移動します。',
      },
    },
    {
      key: 'Ctrl + End',
      action: {
        en: 'Move focus to the last cell in the grid.',
        ja: 'グリッドの最後のセルにフォーカスを移動します。',
      },
    },
    {
      key: 'Page Down',
      action: {
        en: 'Move focus down by a page (implementation-defined).',
        ja: 'フォーカスを1ページ下に移動します（実装依存）。',
      },
    },
    {
      key: 'Page Up',
      action: {
        en: 'Move focus up by a page (implementation-defined).',
        ja: 'フォーカスを1ページ上に移動します（実装依存）。',
      },
    },
    {
      key: 'Space / Enter',
      action: {
        en: 'Activate the cell (e.g., edit, select).',
        ja: 'セルをアクティブ化します（例：編集、選択）。',
      },
    },
    {
      key: 'Escape',
      action: {
        en: 'Cancel edit mode or deselect.',
        ja: '編集モードをキャンセルまたは選択解除します。',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Grid', ja: 'グリッド' },
      behavior: {
        en: 'tabindex="0" on container or first focusable cell',
        ja: 'コンテナまたは最初のフォーカス可能なセルに tabindex="0"',
      },
    },
    {
      event: { en: 'Focused cell', ja: 'フォーカス中のセル' },
      behavior: 'tabindex="0"',
    },
    {
      event: { en: 'Other cells', ja: '他のセル' },
      behavior: 'tabindex="-1"',
    },
    {
      event: { en: 'Interactive content in cells', ja: 'セル内のインタラクティブなコンテンツ' },
      behavior: {
        en: 'Focus moves into cell content on Enter, out on Escape',
        ja: 'Enterでセル内のコンテンツにフォーカス移動、Escapeで移動終了',
      },
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Use role="grid" only when the table is interactive. For static data, use native <table> elements.',
      ja: 'テーブルがインタラクティブな場合にのみ role="grid" を使用してください。静的なデータにはネイティブの <table> 要素を使用してください。',
    },
    {
      en: 'Roving tabindex is recommended for efficient keyboard navigation.',
      ja: '効率的なキーボードナビゲーションのためにローヴィングタブインデックスが推奨されます。',
    },
    {
      en: 'Consider providing a visible focus indicator for the focused cell.',
      ja: 'フォーカスされているセルに視覚的なフォーカスインジケーターを提供することを検討してください。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG: Grid Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/grid/',
    },
    {
      title: 'W3C ARIA: grid role',
      url: 'https://w3c.github.io/aria/#grid',
    },
    {
      title: 'W3C ARIA: gridcell role',
      url: 'https://w3c.github.io/aria/#gridcell',
    },
  ],

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト（Testing Library）' },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用して、コンポーネントのレンダリング出力を検証します。これらのテストは正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role, aria-rowcount, aria-colcount)',
            ja: 'ARIA属性（role, aria-rowcount, aria-colcount）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Home, End, Page Up/Down)',
            ja: 'キーボード操作（矢印キー、Home、End、Page Up/Down）',
          },
          { en: 'Roving tabindex behavior', ja: 'ローヴィングタブインデックスの動作' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks.',
          ja: 'すべてのフレームワークにわたって実際のブラウザ環境でコンポーネントの動作を検証します。',
        },
        areas: [
          { en: 'Click interactions', ja: 'クリック操作' },
          {
            en: 'Two-dimensional keyboard navigation',
            ja: '2次元キーボードナビゲーション',
          },
          { en: 'Cell selection and editing', ja: 'セルの選択と編集' },
          { en: 'ARIA structure validation in live browser', ja: '実ブラウザでのARIA構造検証' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'フレームワーク間の一貫性チェック' },
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
            description: { en: 'Container has grid role', ja: 'コンテナにgridロールがある' },
          },
          {
            name: 'role="row"',
            description: { en: 'Each row has row role', ja: '各行にrowロールがある' },
          },
          {
            name: 'role="gridcell"',
            description: { en: 'Each cell has gridcell role', ja: '各セルにgridcellロールがある' },
          },
          {
            name: 'aria-rowcount',
            description: {
              en: 'Grid has correct row count',
              ja: 'グリッドに正しい行数がある',
            },
          },
          {
            name: 'aria-colcount',
            description: {
              en: 'Grid has correct column count',
              ja: 'グリッドに正しい列数がある',
            },
          },
          {
            name: 'aria-rowindex',
            description: {
              en: 'Rows have correct row index',
              ja: '行に正しい行インデックスがある',
            },
          },
          {
            name: 'aria-colindex',
            description: {
              en: 'Cells have correct column index',
              ja: 'セルに正しい列インデックスがある',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction', ja: 'APGキーボード操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'ArrowRight/Left',
            description: {
              en: 'Moves focus between cells horizontally',
              ja: 'セル間でフォーカスを水平方向に移動',
            },
          },
          {
            name: 'ArrowDown/Up',
            description: {
              en: 'Moves focus between cells vertically',
              ja: 'セル間でフォーカスを垂直方向に移動',
            },
          },
          {
            name: 'Home/End',
            description: {
              en: 'Moves focus to first/last cell in row',
              ja: '行の最初/最後のセルにフォーカスを移動',
            },
          },
          {
            name: 'Ctrl+Home/End',
            description: {
              en: 'Moves focus to first/last cell in grid',
              ja: 'グリッドの最初/最後のセルにフォーカスを移動',
            },
          },
          {
            name: 'Page Up/Down',
            description: {
              en: 'Moves focus by page',
              ja: 'ページ単位でフォーカスを移動',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Focus Management - Roving Tabindex',
          ja: 'フォーカス管理 - ローヴィングタブインデックス',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'tabindex="0"',
            description: {
              en: 'Focused cell has tabindex="0"',
              ja: 'フォーカスされているセルにtabindex="0"がある',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Non-focused cells have tabindex="-1"',
              ja: 'フォーカスされていないセルにtabindex="-1"がある',
            },
          },
          {
            name: 'Single tabbable',
            description: {
              en: 'Only one cell has tabindex="0" at any time',
              ja: '常に1つのセルのみがtabindex="0"を持つ',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Selection', ja: '選択' },
        testType: 'E2E',
        items: [
          {
            name: 'Click selects',
            description: { en: 'Clicking cell selects it', ja: 'セルをクリックすると選択される' },
          },
          {
            name: 'Space selects',
            description: {
              en: 'Space key selects focused cell',
              ja: 'Spaceキーでフォーカスされているセルを選択',
            },
          },
          {
            name: 'Multi-select',
            description: {
              en: 'Ctrl/Cmd+Click for multi-select',
              ja: 'Ctrl/Cmd+クリックで複数選択',
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
              en: 'No WCAG 2.1 AA violations (via jest-axe/axe-core)',
              ja: 'WCAG 2.1 AA違反なし（jest-axe/axe-core経由）',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Cross-framework Consistency', ja: 'フレームワーク間一貫性' },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks render',
            description: {
              en: 'React, Vue, Svelte, Astro all render data grids',
              ja: 'React、Vue、Svelte、Astroすべてでデータグリッドがレンダリングされる',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: 'すべてのフレームワークで一貫したARIA構造',
            },
          },
          {
            name: 'Consistent keyboard',
            description: {
              en: 'All frameworks support keyboard navigation',
              ja: 'すべてのフレームワークでキーボードナビゲーションをサポート',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/data-grid.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for DataGrid', ja: 'DataGridのユニットテストを実行' },
        command: 'npm run test -- data-grid',
      },
      {
        comment: {
          en: 'Run E2E tests for DataGrid (all frameworks)',
          ja: 'DataGridのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=data-grid',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークのE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=data-grid',
      },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:vue:pattern --pattern=data-grid' },
      {
        comment: { en: '', ja: '' },
        command: 'npm run test:e2e:svelte:pattern --pattern=data-grid',
      },
      {
        comment: { en: '', ja: '' },
        command: 'npm run test:e2e:astro:pattern --pattern=data-grid',
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
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // ARIA - High Priority
    { description: 'Container has role="grid"', priority: 'high', category: 'aria' },
    { description: 'Each row has role="row"', priority: 'high', category: 'aria' },
    { description: 'Each cell has role="gridcell"', priority: 'high', category: 'aria' },
    { description: 'Grid has correct aria-rowcount', priority: 'high', category: 'aria' },
    { description: 'Grid has correct aria-colcount', priority: 'high', category: 'aria' },
    { description: 'Rows have correct aria-rowindex', priority: 'high', category: 'aria' },
    { description: 'Cells have correct aria-colindex', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'ArrowRight moves focus to next cell', priority: 'high', category: 'keyboard' },
    {
      description: 'ArrowLeft moves focus to previous cell',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'ArrowDown moves focus to cell below', priority: 'high', category: 'keyboard' },
    { description: 'ArrowUp moves focus to cell above', priority: 'high', category: 'keyboard' },
    {
      description: 'Home moves focus to first cell in row',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'End moves focus to last cell in row', priority: 'high', category: 'keyboard' },
    {
      description: 'Ctrl+Home moves focus to first cell in grid',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Ctrl+End moves focus to last cell in grid',
      priority: 'high',
      category: 'keyboard',
    },

    // Focus Management - High Priority
    { description: 'Focused cell has tabIndex="0"', priority: 'high', category: 'focus' },
    { description: 'Other cells have tabIndex="-1"', priority: 'high', category: 'focus' },
    {
      description: 'Only one tabIndex="0" in grid at any time',
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
│ [Header 1] [Header 2] [Header 3]  ← columnheader       │
├─────────────────────────────────────────────────────────┤
│ [Row 1 H] │ [Cell 1]  │ [Cell 2]   ← row/gridcell      │
│ [Row 2 H] │ [Cell 3]  │ [Cell 4]                        │
│ [Row 3 H] │ [Cell 5]  │ [Cell 6]                        │
└─────────────────────────────────────────────────────────┘

ARIA Relationships:
- grid: aria-rowcount, aria-colcount
- row: aria-rowindex
- gridcell: aria-colindex
\`\`\`

## Focus Management (Roving Tabindex)

- Only one cell has tabindex="0" at a time
- Arrow keys move focus AND update tabindex
- Tab/Shift+Tab moves focus in/out of grid`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Keyboard navigation test
it('ArrowRight moves to next cell', async () => {
  const user = userEvent.setup();
  render(<DataGrid data={testData} />);

  const firstCell = screen.getAllByRole('gridcell')[0];
  firstCell.focus();

  await user.keyboard('{ArrowRight}');

  const secondCell = screen.getAllByRole('gridcell')[1];
  expect(secondCell).toHaveFocus();
  expect(secondCell).toHaveAttribute('tabIndex', '0');
  expect(firstCell).toHaveAttribute('tabIndex', '-1');
});

// ARIA attributes test
it('grid has correct ARIA attributes', () => {
  render(<DataGrid data={testData} />);
  const grid = screen.getByRole('grid');

  expect(grid).toHaveAttribute('aria-rowcount', String(testData.length + 1));
  expect(grid).toHaveAttribute('aria-colcount', String(columns.length));
});

// Roving tabindex test
it('only one cell has tabindex=0', () => {
  render(<DataGrid data={testData} />);
  const cells = screen.getAllByRole('gridcell');

  const tabbableCells = cells.filter(
    cell => cell.getAttribute('tabIndex') === '0'
  );
  expect(tabbableCells).toHaveLength(1);
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('data grid has proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/data-grid/react/demo/');
  const grid = page.getByRole('grid');

  // Check roles
  await expect(grid).toBeAttached();
  await expect(grid.getByRole('row').first()).toBeAttached();
  await expect(grid.getByRole('gridcell').first()).toBeAttached();

  // Check aria-rowcount and aria-colcount
  await expect(grid).toHaveAttribute('aria-rowcount', /.+/);
  await expect(grid).toHaveAttribute('aria-colcount', /.+/);
});

// Keyboard navigation test
test('arrow keys navigate between cells', async ({ page }) => {
  await page.goto('patterns/data-grid/react/demo/');
  const grid = page.getByRole('grid');
  const cells = grid.getByRole('gridcell');
  const firstCell = cells.first();

  await firstCell.click();
  await expect(firstCell).toBeFocused();

  await page.keyboard.press('ArrowRight');
  const secondCell = cells.nth(1);
  await expect(secondCell).toBeFocused();

  await page.keyboard.press('ArrowDown');
  // Focus should move to cell below
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/data-grid/react/demo/');
  await page.getByRole('grid').waitFor();

  const results = await new AxeBuilder({ page })
    .include('[role="grid"]')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
