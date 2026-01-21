import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const tabsAccessibilityData: PatternAccessibilityData = {
  pattern: 'tabs',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',

  overview: {
    en: 'Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time.',
    ja: 'タブはタブパネルと呼ばれるコンテンツのレイヤー化されたセクションのセットで、一度に1つのパネルのコンテンツを表示します。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'tablist',
      element: { en: 'Container', ja: 'コンテナ' },
      description: { en: 'Container for tab elements', ja: 'タブ要素のコンテナ' },
    },
    {
      name: 'tab',
      element: { en: 'Each tab', ja: '各タブ' },
      description: { en: 'Individual tab element', ja: '個々のタブ要素' },
    },
    {
      name: 'tabpanel',
      element: { en: 'Panel', ja: 'パネル' },
      description: { en: 'Content area for each tab', ja: '各タブのコンテンツエリア' },
    },
  ],

  properties: [
    {
      attribute: 'aria-orientation',
      element: 'tablist',
      values: '"horizontal" | "vertical"',
      required: false,
      notes: { en: 'orientation prop', ja: 'orientation プロパティ' },
    },
    {
      attribute: 'aria-controls',
      element: 'tab',
      values: { en: 'ID reference to associated panel', ja: '関連するパネルへのID参照' },
      required: true,
      notes: { en: 'Auto-generated', ja: '自動生成' },
    },
    {
      attribute: 'aria-labelledby',
      element: 'tabpanel',
      values: { en: 'ID reference to associated tab', ja: '関連するタブへのID参照' },
      required: true,
      notes: { en: 'Auto-generated', ja: '自動生成' },
    },
  ],

  states: [
    {
      attribute: 'aria-selected',
      element: { en: 'tab element', ja: 'tab 要素' },
      values: 'true | false',
      required: true,
      changeTrigger: {
        en: 'Tab click, Arrow keys (automatic), Enter/Space (manual)',
        ja: 'タブクリック、矢印キー（自動）、Enter/Space（手動）',
      },
      reference: 'https://w3c.github.io/aria/#aria-selected',
    },
  ],

  // --- Keyboard Support ---

  keyboardSections: [
    {
      title: { en: 'Horizontal Orientation', ja: '水平方向' },
      shortcuts: [
        {
          key: 'Tab',
          action: {
            en: 'Move focus into/out of the tablist',
            ja: 'タブリスト内にフォーカスを移動、またはタブリストから移動',
          },
        },
        {
          key: 'ArrowRight',
          action: { en: 'Move to next tab (loops at end)', ja: '次のタブに移動（末尾でループ）' },
        },
        {
          key: 'ArrowLeft',
          action: {
            en: 'Move to previous tab (loops at start)',
            ja: '前のタブに移動（先頭でループ）',
          },
        },
        { key: 'Home', action: { en: 'Move to first tab', ja: '最初のタブに移動' } },
        { key: 'End', action: { en: 'Move to last tab', ja: '最後のタブに移動' } },
        {
          key: 'Enter / Space',
          action: {
            en: 'Activate tab (manual mode only)',
            ja: 'タブをアクティブ化（手動モードのみ）',
          },
        },
      ],
    },
    {
      title: { en: 'Vertical Orientation', ja: '垂直方向' },
      shortcuts: [
        {
          key: 'ArrowDown',
          action: { en: 'Move to next tab (loops at end)', ja: '次のタブに移動（末尾でループ）' },
        },
        {
          key: 'ArrowUp',
          action: {
            en: 'Move to previous tab (loops at start)',
            ja: '前のタブに移動（先頭でループ）',
          },
        },
      ],
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Selected/focused tab', ja: '選択中/フォーカス中のタブ' },
      behavior: 'tabIndex="0"',
    },
    { event: { en: 'Other tabs', ja: '他のタブ' }, behavior: 'tabIndex="-1"' },
    {
      event: { en: 'Tabpanel', ja: 'タブパネル' },
      behavior: { en: 'tabIndex="0" (focusable)', ja: 'tabIndex="0"（フォーカス可能）' },
    },
    {
      event: { en: 'Disabled tabs', ja: '無効化されたタブ' },
      behavior: {
        en: 'Skipped during keyboard navigation',
        ja: 'キーボードナビゲーションでスキップ',
      },
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA tablist role',
      url: 'https://w3c.github.io/aria/#tablist',
    },
  ],

  // --- Implementation Notes ---

  implementationNotesData: {
    activationModes: [
      {
        mode: 'automatic',
        title: { en: 'Automatic (default)', ja: '自動モード（デフォルト）' },
        points: [
          {
            en: 'Arrow keys move focus AND select tab',
            ja: '矢印キーでフォーカス移動とタブ選択を同時に行う',
          },
          { en: 'Panel content changes immediately', ja: 'パネルの内容が即座に変更される' },
        ],
      },
      {
        mode: 'manual',
        title: { en: 'Manual', ja: '手動モード' },
        points: [
          { en: 'Arrow keys move focus only', ja: '矢印キーはフォーカス移動のみ' },
          { en: 'Enter/Space required to select tab', ja: 'タブ選択にはEnter/Spaceが必要' },
          {
            en: 'Panel content changes on explicit activation',
            ja: '明示的なアクティベーションでパネル内容が変更される',
          },
        ],
      },
    ],
    structure: {
      diagram: `┌─────────────────────────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3]   ← tablist     │
├─────────────────────────────────────────┤
│                                         │
│  Panel content here        ← tabpanel   │
│                                         │
└─────────────────────────────────────────┘

ID Relationships:
- Tab: id="tab-1", aria-controls="panel-1"
- Panel: id="panel-1", aria-labelledby="tab-1"`,
      caption: {
        en: 'Tabs component structure with ID relationships',
        ja: 'ID関連を含むTabsコンポーネントの構造',
      },
    },
  },

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
            en: 'ARIA attributes (aria-selected, aria-controls, aria-labelledby)',
            ja: 'ARIA属性（aria-selected, aria-controls, aria-labelledby）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Home, End)',
            ja: 'キーボード操作（矢印キー、Home、End）',
          },
          { en: 'Roving tabindex behavior', ja: 'ローヴィングタブインデックスの動作' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: 'すべてのフレームワークにわたって実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストは操作とフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          { en: 'Click interactions', ja: 'クリック操作' },
          { en: 'Arrow key navigation with looping', ja: 'ループを含む矢印キーナビゲーション' },
          {
            en: 'Automatic and manual activation modes',
            ja: '自動および手動アクティベーションモード',
          },
          { en: 'ARIA structure validation in live browser', ja: '実ブラウザでのARIA構造検証' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'フレームワーク間の一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction', ja: 'APGキーボード操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'ArrowRight/Left',
            description: {
              en: 'Moves focus between tabs (horizontal)',
              ja: 'タブ間でフォーカスを移動（水平方向）',
            },
          },
          {
            name: 'ArrowDown/Up',
            description: {
              en: 'Moves focus between tabs (vertical orientation)',
              ja: 'タブ間でフォーカスを移動（垂直方向）',
            },
          },
          {
            name: 'Home/End',
            description: {
              en: 'Moves focus to first/last tab',
              ja: '最初/最後のタブにフォーカスを移動',
            },
          },
          {
            name: 'Loop navigation',
            description: {
              en: 'Arrow keys loop from last to first and vice versa',
              ja: '矢印キーで最後から最初へ、またはその逆にループ',
            },
          },
          {
            name: 'Disabled skip',
            description: {
              en: 'Skips disabled tabs during navigation',
              ja: 'ナビゲーション中に無効なタブをスキップ',
            },
          },
          {
            name: 'Automatic activation',
            description: {
              en: 'Tab panel changes on focus (default mode)',
              ja: 'フォーカス時にタブパネルが変更される（デフォルトモード）',
            },
          },
          {
            name: 'Manual activation',
            description: {
              en: 'Enter/Space required to activate tab',
              ja: 'タブをアクティブ化するにはEnter/Spaceが必要',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG ARIA Attributes', ja: 'APG ARIA属性' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="tablist"',
            description: { en: 'Container has tablist role', ja: 'コンテナにtablistロールがある' },
          },
          {
            name: 'role="tab"',
            description: {
              en: 'Each tab button has tab role',
              ja: '各タブボタンにtabロールがある',
            },
          },
          {
            name: 'role="tabpanel"',
            description: {
              en: 'Content panel has tabpanel role',
              ja: 'コンテンツパネルにtabpanelロールがある',
            },
          },
          {
            name: 'aria-selected',
            description: {
              en: 'Selected tab has aria-selected="true"',
              ja: '選択されたタブにaria-selected="true"がある',
            },
          },
          {
            name: 'aria-controls',
            description: {
              en: 'Tab references its panel via aria-controls',
              ja: 'タブがaria-controls経由でパネルを参照',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Panel references its tab via aria-labelledby',
              ja: 'パネルがaria-labelledby経由でタブを参照',
            },
          },
          {
            name: 'aria-orientation',
            description: {
              en: 'Reflects horizontal/vertical orientation',
              ja: '水平/垂直の向きを反映',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Click Interaction', ja: 'クリック操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Click selects',
            description: { en: 'Clicking tab selects it', ja: 'タブをクリックすると選択される' },
          },
          {
            name: 'Click shows panel',
            description: {
              en: 'Clicking tab shows corresponding panel',
              ja: 'タブをクリックすると対応するパネルが表示される',
            },
          },
          {
            name: 'Click hides others',
            description: {
              en: 'Clicking tab hides other panels',
              ja: 'タブをクリックすると他のパネルが非表示になる',
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
            name: 'tabIndex=0',
            description: {
              en: 'Selected tab has tabIndex=0',
              ja: '選択されたタブにtabIndex=0がある',
            },
          },
          {
            name: 'tabIndex=-1',
            description: {
              en: 'Non-selected tabs have tabIndex=-1',
              ja: '選択されていないタブにtabIndex=-1がある',
            },
          },
          {
            name: 'Panel focusable',
            description: {
              en: 'Panel has tabIndex=0 for focus',
              ja: 'パネルがフォーカスのためにtabIndex=0を持つ',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Vertical Orientation', ja: '垂直方向' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'ArrowDown moves next',
            description: {
              en: 'ArrowDown moves to next tab in vertical mode',
              ja: '垂直モードでArrowDownで次のタブに移動',
            },
          },
          {
            name: 'ArrowUp moves prev',
            description: {
              en: 'ArrowUp moves to previous tab in vertical mode',
              ja: '垂直モードでArrowUpで前のタブに移動',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Disabled State', ja: '無効状態' },
        testType: 'E2E',
        items: [
          {
            name: 'Disabled no click',
            description: {
              en: 'Clicking disabled tab does not select it',
              ja: '無効なタブをクリックしても選択されない',
            },
          },
          {
            name: 'Navigation skips',
            description: {
              en: 'Arrow key navigation skips disabled tabs',
              ja: '矢印キーナビゲーションで無効なタブをスキップ',
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
              en: 'React, Vue, Svelte, Astro all render tabs',
              ja: 'React、Vue、Svelte、Astroすべてでタブがレンダリングされる',
            },
          },
          {
            name: 'Consistent click',
            description: {
              en: 'All frameworks support click to select',
              ja: 'すべてのフレームワークでクリックによる選択をサポート',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: 'すべてのフレームワークで一貫したARIA構造',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/tabs.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Tabs', ja: 'Tabsのユニットテストを実行' },
        command: 'npm run test -- tabs',
      },
      {
        comment: {
          en: 'Run E2E tests for Tabs (all frameworks)',
          ja: 'TabsのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=tabs',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークのE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=tabs',
      },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:vue:pattern --pattern=tabs' },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:svelte:pattern --pattern=tabs' },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:astro:pattern --pattern=tabs' },
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
    // Keyboard - High Priority
    {
      description: 'ArrowRight moves to next tab (horizontal)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowLeft moves to previous tab (horizontal)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowDown moves to next tab (vertical)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowUp moves to previous tab (vertical)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Arrow keys loop at boundaries', priority: 'high', category: 'keyboard' },
    { description: 'Home moves to first tab', priority: 'high', category: 'keyboard' },
    { description: 'End moves to last tab', priority: 'high', category: 'keyboard' },
    { description: 'Disabled tabs are skipped', priority: 'high', category: 'keyboard' },
    { description: 'Tab key moves focus to tabpanel', priority: 'high', category: 'keyboard' },
    {
      description: 'Manual mode: Enter/Space activates focused tab',
      priority: 'high',
      category: 'keyboard',
    },

    // ARIA - High Priority
    { description: 'Container has role="tablist"', priority: 'high', category: 'aria' },
    { description: 'Each tab has role="tab"', priority: 'high', category: 'aria' },
    { description: 'Panel has role="tabpanel"', priority: 'high', category: 'aria' },
    { description: 'Selected tab has aria-selected="true"', priority: 'high', category: 'aria' },
    {
      description: 'Non-selected tabs have aria-selected="false"',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Tab aria-controls matches panel id', priority: 'high', category: 'aria' },
    { description: 'Panel aria-labelledby matches tab id', priority: 'high', category: 'aria' },
    {
      description: 'aria-orientation reflects orientation prop',
      priority: 'high',
      category: 'aria',
    },

    // Focus Management - High Priority
    {
      description: 'Only selected/focused tab has tabIndex="0"',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Other tabs have tabIndex="-1"', priority: 'high', category: 'focus' },
    { description: 'Tabpanel is focusable (tabIndex="0")', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Activation Modes

### Automatic (default)

- Arrow keys move focus AND select tab
- Panel content changes immediately

### Manual

- Arrow keys move focus only
- Enter/Space required to select tab
- Panel content changes on explicit activation

## Structure

\`\`\`
┌─────────────────────────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3]   ← tablist     │
├─────────────────────────────────────────┤
│                                         │
│  Panel content here        ← tabpanel   │
│                                         │
└─────────────────────────────────────────┘

ID Relationships:
- Tab: id="tab-1", aria-controls="panel-1"
- Panel: id="panel-1", aria-labelledby="tab-1"
\`\`\``,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Keyboard navigation test
it('ArrowRight moves to next tab', async () => {
  const user = userEvent.setup();
  render(<Tabs tabs={tabs} />);

  const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
  tab1.focus();

  await user.keyboard('{ArrowRight}');

  const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
  expect(tab2).toHaveFocus();
  expect(tab2).toHaveAttribute('aria-selected', 'true');
});

// ARIA attributes test
it('selected tab has aria-selected=true', () => {
  render(<Tabs tabs={tabs} />);
  const tabs = screen.getAllByRole('tab');

  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
});

// Roving tabindex test
it('only selected tab has tabIndex=0', () => {
  render(<Tabs tabs={tabs} />);
  const tabs = screen.getAllByRole('tab');

  expect(tabs[0]).toHaveAttribute('tabIndex', '0');
  expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('tabs have proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  const tabs = page.locator('.apg-tabs').first();

  // Check roles
  await expect(tabs.getByRole('tablist')).toBeAttached();
  await expect(tabs.getByRole('tab').first()).toBeAttached();
  await expect(tabs.getByRole('tabpanel')).toBeAttached();

  // Check aria-selected and aria-controls linkage
  const selectedTab = tabs.getByRole('tab', { selected: true });
  await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  await expect(selectedTab).toHaveAttribute('aria-controls', /.+/);

  const controlsId = await selectedTab.getAttribute('aria-controls');
  const panel = page.locator(\`#\${controlsId}\`);
  await expect(panel).toHaveRole('tabpanel');
});

// Keyboard navigation test (automatic mode)
test('arrow keys navigate and select tabs', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  const tabs = page.locator('.apg-tabs').first();
  const tabButtons = tabs.getByRole('tab');
  const firstTab = tabButtons.first();
  const secondTab = tabButtons.nth(1);

  await firstTab.click();
  await expect(firstTab).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');

  // Test loop at boundaries
  await page.keyboard.press('End');
  const lastTab = tabButtons.last();
  await expect(lastTab).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(firstTab).toBeFocused();
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  await page.locator('.apg-tabs').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('.apg-tabs')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
