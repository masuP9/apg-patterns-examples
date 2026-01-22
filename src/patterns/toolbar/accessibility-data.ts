import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const toolbarAccessibilityData: PatternAccessibilityData = {
  pattern: 'toolbar',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/',

  overview: {
    en: 'A toolbar is a container for grouping a set of controls, such as buttons, toggle buttons, or checkboxes. It provides a single tab stop for keyboard navigation with arrow keys moving between controls.',
    ja: 'ツールバーは、ボタン、トグルボタン、チェックボックスなどのコントロールセットをグループ化するコンテナです。キーボードナビゲーションには単一のTabストップを提供し、矢印キーでコントロール間を移動します。',
  },

  roles: [
    {
      name: 'toolbar',
      element: { en: 'Container', ja: 'コンテナ' },
      description: {
        en: 'Container for grouping controls',
        ja: 'コントロールをグループ化するコンテナ',
      },
    },
    {
      name: 'button',
      element: { en: 'Button elements', ja: 'ボタン要素' },
      description: {
        en: 'Implicit role for <button> elements',
        ja: '<button>要素の暗黙的なロール',
      },
    },
    {
      name: 'separator',
      element: { en: 'Separator', ja: 'セパレーター' },
      description: {
        en: 'Visual and semantic separator between groups',
        ja: 'グループ間の視覚的およびセマンティックなセパレーター',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-label',
      element: 'toolbar',
      values: 'String',
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'Accessible name for the toolbar',
        ja: 'ツールバーのアクセシブルな名前',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'toolbar',
      values: { en: 'ID reference', ja: 'ID参照' },
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'Alternative to aria-label (takes precedence)',
        ja: 'aria-labelの代替（優先される）',
      },
    },
    {
      attribute: 'aria-orientation',
      element: 'toolbar',
      values: '"horizontal" | "vertical"',
      required: false,
      notes: {
        en: 'Orientation of the toolbar (default: horizontal)',
        ja: 'ツールバーの方向（デフォルト: horizontal）',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-pressed',
      element: 'ToolbarToggleButton',
      values: 'true | false',
      required: true,
      changeTrigger: { en: 'Click, Enter, Space', ja: 'Click、Enter、Space' },
      reference: 'https://w3c.github.io/aria/#aria-pressed',
    },
  ],

  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Move focus into/out of the toolbar (single tab stop)',
        ja: 'ツールバーへのフォーカス移動（単一Tabストップ）',
      },
    },
    {
      key: 'Arrow Right / Arrow Left',
      action: {
        en: 'Navigate between controls (horizontal toolbar)',
        ja: 'コントロール間のナビゲーション（水平ツールバー）',
      },
    },
    {
      key: 'Arrow Down / Arrow Up',
      action: {
        en: 'Navigate between controls (vertical toolbar)',
        ja: 'コントロール間のナビゲーション（垂直ツールバー）',
      },
    },
    {
      key: 'Home',
      action: {
        en: 'Move focus to first control',
        ja: '最初のコントロールにフォーカスを移動',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Move focus to last control',
        ja: '最後のコントロールにフォーカスを移動',
      },
    },
    {
      key: 'Enter / Space',
      action: {
        en: 'Activate button / toggle pressed state',
        ja: 'ボタンをアクティブ化 / 押下状態を切り替え',
      },
    },
  ],

  focusManagement: [
    {
      event: { en: 'Roving Tabindex', ja: 'Roving Tabindex' },
      behavior: {
        en: 'Only one control has tabindex="0" at a time',
        ja: '一度に1つのコントロールのみがtabindex="0"を持つ',
      },
    },
    {
      event: { en: 'Other controls', ja: '他のコントロール' },
      behavior: {
        en: 'Other controls have tabindex="-1"',
        ja: '他のコントロールはtabindex="-1"を持つ',
      },
    },
    {
      event: { en: 'Arrow keys', ja: '矢印キー' },
      behavior: {
        en: 'Arrow keys move focus between controls',
        ja: '矢印キーでコントロール間のフォーカスを移動',
      },
    },
    {
      event: { en: 'Disabled/Separator', ja: '無効化/セパレーター' },
      behavior: {
        en: 'Disabled controls and separators are skipped',
        ja: '無効化されたコントロールとセパレーターはスキップされる',
      },
    },
    {
      event: { en: 'No wrap', ja: '折り返しなし' },
      behavior: {
        en: 'Focus does not wrap (stops at edges)',
        ja: 'フォーカスは折り返さない（端で停止）',
      },
    },
  ],

  additionalNotes: [
    {
      en: '* Either aria-label or aria-labelledby is required on the toolbar container.',
      ja: '* ツールバーコンテナにはaria-labelまたはaria-labelledbyのいずれかが必須です。',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA toolbar role',
      url: 'https://w3c.github.io/aria/#toolbar',
    },
  ],

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト（Testing Library）' },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用して、コンポーネントの出力を検証します。正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (aria-pressed, aria-orientation)',
            ja: 'ARIA属性（aria-pressed、aria-orientation）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Home, End)',
            ja: 'キーボード操作（矢印キー、Home、End）',
          },
          { en: 'Roving tabindex behavior', ja: 'Roving tabindexの動作' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: '実際のブラウザ環境で全フレームワークのコンポーネント動作を検証します。インタラクションとクロスフレームワークの一貫性をカバーします。',
        },
        areas: [
          { en: 'Click interactions', ja: 'クリック操作' },
          {
            en: 'Arrow key navigation (horizontal and vertical)',
            ja: '矢印キーナビゲーション（水平・垂直）',
          },
          { en: 'Toggle button state changes', ja: 'トグルボタンの状態変更' },
          { en: 'Disabled item handling', ja: '無効化アイテムの処理' },
          { en: 'ARIA structure validation in live browser', ja: 'ライブブラウザでのARIA構造検証' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'クロスフレームワーク一貫性チェック' },
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
              en: 'Moves focus between items (horizontal)',
              ja: 'アイテム間のフォーカス移動（水平）',
            },
          },
          {
            name: 'ArrowDown/Up',
            description: {
              en: 'Moves focus between items (vertical)',
              ja: 'アイテム間のフォーカス移動（垂直）',
            },
          },
          {
            name: 'Home',
            description: { en: 'Moves focus to first item', ja: '最初のアイテムにフォーカス移動' },
          },
          {
            name: 'End',
            description: { en: 'Moves focus to last item', ja: '最後のアイテムにフォーカス移動' },
          },
          {
            name: 'No wrap',
            description: {
              en: 'Focus stops at edges (no looping)',
              ja: 'フォーカスは端で停止（ループなし）',
            },
          },
          {
            name: 'Disabled skip',
            description: {
              en: 'Skips disabled items during navigation',
              ja: 'ナビゲーション中に無効化アイテムをスキップ',
            },
          },
          {
            name: 'Enter/Space',
            description: {
              en: 'Activates button or toggles toggle button',
              ja: 'ボタンをアクティブ化またはトグルボタンを切り替え',
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
            name: 'role="toolbar"',
            description: { en: 'Container has toolbar role', ja: 'コンテナがtoolbarロールを持つ' },
          },
          {
            name: 'aria-orientation',
            description: {
              en: 'Reflects horizontal/vertical orientation',
              ja: '水平/垂直方向を反映',
            },
          },
          {
            name: 'aria-label/labelledby',
            description: {
              en: 'Toolbar has accessible name',
              ja: 'ツールバーがアクセシブルな名前を持つ',
            },
          },
          {
            name: 'aria-pressed',
            description: {
              en: 'Toggle buttons reflect pressed state',
              ja: 'トグルボタンが押下状態を反映',
            },
          },
          {
            name: 'role="separator"',
            description: {
              en: 'Separator has correct role and orientation',
              ja: 'セパレーターが正しいロールと方向を持つ',
            },
          },
          {
            name: 'type="button"',
            description: {
              en: 'Buttons have explicit type attribute',
              ja: 'ボタンが明示的なtype属性を持つ',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Focus Management - Roving Tabindex', ja: 'フォーカス管理 - Roving Tabindex' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'tabIndex=0',
            description: {
              en: 'First enabled item has tabIndex=0',
              ja: '最初の有効なアイテムがtabIndex=0を持つ',
            },
          },
          {
            name: 'tabIndex=-1',
            description: {
              en: 'Other items have tabIndex=-1',
              ja: '他のアイテムがtabIndex=-1を持つ',
            },
          },
          {
            name: 'Click updates focus',
            description: {
              en: 'Clicking an item updates roving focus position',
              ja: 'アイテムをクリックするとroving focus位置が更新される',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Toggle Button State', ja: 'トグルボタンの状態' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-pressed',
            description: {
              en: 'Toggle button has aria-pressed attribute',
              ja: 'トグルボタンがaria-pressed属性を持つ',
            },
          },
          {
            name: 'Click toggles',
            description: {
              en: 'Clicking toggle button changes aria-pressed',
              ja: 'トグルボタンをクリックするとaria-pressedが変わる',
            },
          },
          {
            name: 'defaultPressed',
            description: {
              en: 'Toggle with defaultPressed starts as pressed',
              ja: 'defaultPressedを持つトグルは押下状態で開始',
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
          {
            name: 'Vertical toolbar',
            description: { en: 'Vertical orientation also passes axe', ja: '垂直方向もaxeに合格' },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Cross-framework Consistency', ja: 'クロスフレームワーク一貫性' },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks render',
            description: {
              en: 'React, Vue, Svelte, Astro all render toolbars',
              ja: 'React、Vue、Svelte、Astroすべてがツールバーをレンダリング',
            },
          },
          {
            name: 'Consistent keyboard',
            description: {
              en: 'All frameworks support keyboard navigation',
              ja: 'すべてのフレームワークがキーボードナビゲーションをサポート',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: 'すべてのフレームワークが一貫したARIA構造を持つ',
            },
          },
          {
            name: 'Toggle buttons',
            description: {
              en: 'All frameworks support toggle button state',
              ja: 'すべてのフレームワークがトグルボタン状態をサポート',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/toolbar.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Toolbar', ja: 'Toolbarのユニットテストを実行' },
        command: 'npm run test -- toolbar',
      },
      {
        comment: {
          en: 'Run E2E tests for Toolbar (all frameworks)',
          ja: 'ToolbarのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=toolbar',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定のフレームワークでE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=toolbar',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: { en: 'Test runner for unit tests', ja: 'ユニットテストランナー' },
      },
      {
        name: 'Testing Library',
        url: 'https://testing-library.com/',
        description: {
          en: 'Framework-specific testing utilities (React, Vue, Svelte)',
          ja: 'フレームワーク別テストユーティリティ（React、Vue、Svelte）',
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

  testChecklist: [
    { description: 'Container has role="toolbar"', priority: 'high', category: 'aria' },
    {
      description: 'Toolbar has aria-label or aria-labelledby',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-orientation reflects horizontal/vertical',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Toggle buttons have aria-pressed', priority: 'high', category: 'aria' },
    { description: 'Separator has role="separator"', priority: 'high', category: 'aria' },
    {
      description: 'ArrowRight/Left navigates horizontal toolbar',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowDown/Up navigates vertical toolbar',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Home/End move to first/last item', priority: 'high', category: 'keyboard' },
    { description: 'Focus does not wrap at edges', priority: 'high', category: 'keyboard' },
    { description: 'Disabled items are skipped', priority: 'high', category: 'keyboard' },
    { description: 'Roving tabindex implemented correctly', priority: 'high', category: 'focus' },
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`html
<div role="toolbar" aria-label="Text formatting" aria-orientation="horizontal">
  <button type="button" tabindex="0" aria-pressed="false">Bold</button>
  <button type="button" tabindex="-1" aria-pressed="false">Italic</button>
  <div role="separator" aria-orientation="vertical"></div>
  <button type="button" tabindex="-1">Copy</button>
  <button type="button" tabindex="-1" disabled>Paste</button>
</div>
\`\`\`

## Key Implementation Points

1. **Roving Tabindex**: Only one button has tabindex="0" at a time
2. **Orientation**: Arrow keys depend on aria-orientation
3. **Skip Disabled**: Disabled buttons and separators are skipped during navigation
4. **No Wrap**: Focus stops at edges (does not loop)
5. **Toggle Buttons**: Use aria-pressed for toggle state`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has toolbar role', () => {
  render(<Toolbar aria-label="Actions"><ToolbarButton>Copy</ToolbarButton></Toolbar>);
  expect(screen.getByRole('toolbar')).toBeInTheDocument();
});

// Keyboard Navigation
it('ArrowRight moves focus to next button', async () => {
  const user = userEvent.setup();
  render(
    <Toolbar aria-label="Actions">
      <ToolbarButton>Copy</ToolbarButton>
      <ToolbarButton>Paste</ToolbarButton>
    </Toolbar>
  );

  const buttons = screen.getAllByRole('button');
  buttons[0].focus();
  await user.keyboard('{ArrowRight}');

  expect(buttons[1]).toHaveFocus();
});

// Toggle Button
it('toggles aria-pressed on click', async () => {
  const user = userEvent.setup();
  render(
    <Toolbar aria-label="Formatting">
      <ToolbarToggleButton>Bold</ToolbarToggleButton>
    </Toolbar>
  );

  const toggle = screen.getByRole('button', { name: 'Bold' });
  expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-pressed', 'true');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');
  const toolbar = page.getByRole('toolbar');

  await expect(toolbar).toBeVisible();
  await expect(toolbar).toHaveAttribute('aria-label');
});

// Keyboard Navigation
test('arrow keys navigate between buttons', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');
  const toolbar = page.getByRole('toolbar').first();
  const buttons = toolbar.getByRole('button');

  await buttons.first().click();
  await page.keyboard.press('ArrowRight');

  await expect(buttons.nth(1)).toBeFocused();
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="toolbar"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
