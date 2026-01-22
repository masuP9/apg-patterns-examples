import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const listboxAccessibilityData: PatternAccessibilityData = {
  pattern: 'listbox',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/listbox/',

  overview: {
    en: 'A listbox widget presents a list of options and allows selection of one or more items. It provides custom selection behavior beyond native `<select>`.',
    ja: 'リストボックスウィジェットは、オプションのリストを表示し、1つまたは複数のアイテムの選択を可能にします。ネイティブの `<select>` を超えたカスタム選択動作を提供します。',
  },

  roles: [
    {
      name: 'listbox',
      element: {
        en: 'Container (`<ul>`)',
        ja: 'コンテナ（`<ul>`）',
      },
      description: {
        en: 'Widget for selecting one or more items from a list',
        ja: 'リストから1つまたは複数のアイテムを選択するためのウィジェット',
      },
    },
    {
      name: 'option',
      element: {
        en: 'Each item (`<li>`)',
        ja: '各アイテム（`<li>`）',
      },
      description: {
        en: 'Selectable option within the listbox',
        ja: 'リストボックス内の選択可能なオプション',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-label',
      element: 'listbox',
      values: 'String',
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'Accessible name for the listbox',
        ja: 'リストボックスのアクセシブル名',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-label',
    },
    {
      attribute: 'aria-labelledby',
      element: 'listbox',
      values: 'ID reference',
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'References the labeling element',
        ja: 'ラベル要素への参照',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-labelledby',
    },
    {
      attribute: 'aria-multiselectable',
      element: 'listbox',
      values: '`true`',
      required: false,
      notes: {
        en: 'Enables multi-select mode',
        ja: '複数選択モードを有効にする',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-multiselectable',
    },
    {
      attribute: 'aria-orientation',
      element: 'listbox',
      values: '`"vertical"` | `"horizontal"`',
      required: false,
      notes: {
        en: 'Navigation direction (default: vertical)',
        ja: 'ナビゲーションの方向（デフォルト: vertical）',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-orientation',
    },
  ],

  states: [
    {
      attribute: 'aria-selected',
      element: 'option',
      values: '`true` | `false`',
      required: true,
      changeTrigger: {
        en: 'Click, Arrow keys (single-select), Space (multi-select)',
        ja: 'クリック、矢印キー（単一選択）、Space（複数選択）',
      },
      reference: 'https://w3c.github.io/aria/#aria-selected',
    },
    {
      attribute: 'aria-disabled',
      element: 'option',
      values: '`true`',
      required: false,
      changeTrigger: {
        en: 'When disabled',
        ja: '無効時のみ',
      },
      reference: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  keyboardSections: [
    {
      title: {
        en: 'Common Navigation',
        ja: '共通ナビゲーション',
      },
      shortcuts: [
        {
          key: 'Down Arrow / Up Arrow',
          action: {
            en: 'Move focus (vertical orientation)',
            ja: 'フォーカスを移動（垂直方向）',
          },
        },
        {
          key: 'Right Arrow / Left Arrow',
          action: {
            en: 'Move focus (horizontal orientation)',
            ja: 'フォーカスを移動（水平方向）',
          },
        },
        {
          key: 'Home',
          action: {
            en: 'Move focus to first option',
            ja: '最初のオプションにフォーカスを移動',
          },
        },
        {
          key: 'End',
          action: {
            en: 'Move focus to last option',
            ja: '最後のオプションにフォーカスを移動',
          },
        },
        {
          key: 'Type character',
          action: {
            en: 'Type-ahead: focus option starting with typed character(s)',
            ja: '先行入力: 入力した文字で始まるオプションにフォーカス',
          },
        },
      ],
    },
    {
      title: {
        en: 'Single-Select (Selection Follows Focus)',
        ja: '単一選択（選択がフォーカスに追従）',
      },
      shortcuts: [
        {
          key: 'Arrow keys',
          action: {
            en: 'Move focus and selection simultaneously',
            ja: 'フォーカスと選択を同時に移動',
          },
        },
        {
          key: 'Space / Enter',
          action: {
            en: 'Confirm current selection',
            ja: '現在の選択を確定',
          },
        },
      ],
    },
    {
      title: {
        en: 'Multi-Select',
        ja: '複数選択',
      },
      shortcuts: [
        {
          key: 'Arrow keys',
          action: {
            en: 'Move focus only (selection unchanged)',
            ja: 'フォーカスのみ移動（選択は変更なし）',
          },
        },
        {
          key: 'Space',
          action: {
            en: 'Toggle selection of focused option',
            ja: 'フォーカス中のオプションの選択をトグル',
          },
        },
        {
          key: 'Shift + Arrow',
          action: {
            en: 'Move focus and extend selection range',
            ja: 'フォーカスを移動し選択範囲を拡張',
          },
        },
        {
          key: 'Shift + Home',
          action: {
            en: 'Select from anchor to first option',
            ja: 'アンカーから最初のオプションまで選択',
          },
        },
        {
          key: 'Shift + End',
          action: {
            en: 'Select from anchor to last option',
            ja: 'アンカーから最後のオプションまで選択',
          },
        },
        {
          key: 'Ctrl + A',
          action: {
            en: 'Select all options',
            ja: 'すべてのオプションを選択',
          },
        },
      ],
    },
  ],

  focusManagement: [
    {
      event: {
        en: 'Focused option',
        ja: 'フォーカス中のオプション',
      },
      behavior: {
        en: 'Only one option has `tabindex="0"` at a time (Roving Tabindex)',
        ja: '常に1つのオプションのみが `tabindex="0"` を持つ（ローヴィングタブインデックス）',
      },
    },
    {
      event: {
        en: 'Non-focused options',
        ja: 'フォーカスされていないオプション',
      },
      behavior: {
        en: 'Other options have `tabindex="-1"`',
        ja: '他のオプションは `tabindex="-1"` を持つ',
      },
    },
    {
      event: {
        en: 'Arrow navigation',
        ja: '矢印ナビゲーション',
      },
      behavior: {
        en: 'Arrow keys move focus between options',
        ja: '矢印キーでオプション間のフォーカスを移動',
      },
    },
    {
      event: {
        en: 'Disabled options',
        ja: '無効化されたオプション',
      },
      behavior: {
        en: 'Disabled options are skipped during navigation',
        ja: '無効化されたオプションはナビゲーション中にスキップされる',
      },
    },
    {
      event: {
        en: 'Edge behavior',
        ja: '端の動作',
      },
      behavior: {
        en: 'Focus does not wrap (stops at edges)',
        ja: 'フォーカスは端で折り返さない（端で停止）',
      },
    },
  ],

  additionalNotes: [
    {
      en: '**Single-select:** Selection follows focus (arrow keys change selection)',
      ja: '**単一選択:** 選択がフォーカスに追従（矢印キーで選択が変更される）',
    },
    {
      en: '**Multi-select:** Focus and selection are independent (Space toggles selection)',
      ja: '**複数選択:** フォーカスと選択は独立（Spaceで選択をトグル）',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA listbox role',
      url: 'https://w3c.github.io/aria/#listbox',
    },
  ],

  // Testing Documentation
  testing: {
    strategies: [
      {
        type: 'unit',
        title: {
          en: 'Unit Tests (Testing Library)',
          ja: 'ユニットテスト（Testing Library）',
        },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用して、コンポーネントのレンダリング出力を検証します。正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role, aria-selected, aria-multiselectable, etc.)',
            ja: 'ARIA属性（role、aria-selected、aria-multiselectable など）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Space, Home/End, etc.)',
            ja: 'キーボード操作（矢印キー、Space、Home/End など）',
          },
          {
            en: 'Selection behavior (single-select, multi-select)',
            ja: '選択動作（単一選択、複数選択）',
          },
          {
            en: 'Accessibility via jest-axe',
            ja: 'jest-axeによるアクセシビリティ',
          },
        ],
      },
      {
        type: 'e2e',
        title: {
          en: 'E2E Tests (Playwright)',
          ja: 'E2Eテスト（Playwright）',
        },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: '全フレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。インタラクションとクロスフレームワークの一貫性をカバーします。',
        },
        areas: [
          {
            en: 'Keyboard navigation (single-select, multi-select, horizontal)',
            ja: 'キーボードナビゲーション（単一選択、複数選択、水平方向）',
          },
          {
            en: 'Mouse interactions (click selection, toggle)',
            ja: 'マウス操作（クリック選択、トグル）',
          },
          {
            en: 'ARIA structure in live browser',
            ja: 'ライブブラウザでのARIA構造',
          },
          {
            en: 'Focus management with roving tabindex',
            ja: 'ローヴィングタブインデックスによるフォーカス管理',
          },
          {
            en: 'Type-ahead character navigation',
            ja: 'タイプアヘッド文字ナビゲーション',
          },
          {
            en: 'axe-core accessibility scanning',
            ja: 'axe-coreアクセシビリティスキャン',
          },
          {
            en: 'Cross-framework consistency checks',
            ja: 'クロスフレームワーク一貫性チェック',
          },
        ],
      },
    ],

    categories: [
      {
        priority: 'high',
        title: {
          en: 'APG Keyboard Interaction',
          ja: 'APG キーボード操作',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'ArrowDown/Up',
            description: {
              en: 'Moves focus between options (vertical orientation)',
              ja: 'オプション間でフォーカスを移動（垂直方向）',
            },
          },
          {
            name: 'ArrowRight/Left',
            description: {
              en: 'Moves focus between options (horizontal orientation)',
              ja: 'オプション間でフォーカスを移動（水平方向）',
            },
          },
          {
            name: 'Home/End',
            description: {
              en: 'Moves focus to first/last option',
              ja: '最初/最後のオプションにフォーカスを移動',
            },
          },
          {
            name: 'Disabled skip',
            description: {
              en: 'Skips disabled options during navigation',
              ja: 'ナビゲーション中に無効化されたオプションをスキップ',
            },
          },
          {
            name: 'Selection follows focus',
            description: {
              en: 'Single-select: arrow keys change selection',
              ja: '単一選択: 矢印キーで選択が変更される',
            },
          },
          {
            name: 'Space toggle',
            description: {
              en: 'Multi-select: Space toggles option selection',
              ja: '複数選択: Spaceでオプションの選択をトグル',
            },
          },
          {
            name: 'Shift+Arrow',
            description: {
              en: 'Multi-select: extends selection range',
              ja: '複数選択: 選択範囲を拡張',
            },
          },
          {
            name: 'Shift+Home/End',
            description: {
              en: 'Multi-select: selects from anchor to first/last',
              ja: '複数選択: アンカーから最初/最後まで選択',
            },
          },
          {
            name: 'Ctrl+A',
            description: {
              en: 'Multi-select: selects all options',
              ja: '複数選択: すべてのオプションを選択',
            },
          },
          {
            name: 'Type-ahead',
            description: {
              en: 'Character input focuses matching option',
              ja: '文字入力で一致するオプションにフォーカス',
            },
          },
          {
            name: 'Type-ahead cycle',
            description: {
              en: 'Repeated same character cycles through matches',
              ja: '同じ文字の繰り返し入力で一致項目を巡回',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'APG ARIA Attributes',
          ja: 'APG ARIA 属性',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="listbox"',
            description: {
              en: 'Container has listbox role',
              ja: 'コンテナがlistboxロールを持つ',
            },
          },
          {
            name: 'role="option"',
            description: {
              en: 'Each option has option role',
              ja: '各オプションがoptionロールを持つ',
            },
          },
          {
            name: 'aria-selected',
            description: {
              en: 'Selected options have `aria-selected="true"`',
              ja: '選択されたオプションが `aria-selected="true"` を持つ',
            },
          },
          {
            name: 'aria-multiselectable',
            description: {
              en: 'Listbox has attribute when multi-select enabled',
              ja: '複数選択が有効な場合にリストボックスが属性を持つ',
            },
          },
          {
            name: 'aria-orientation',
            description: {
              en: 'Reflects horizontal/vertical orientation',
              ja: '水平/垂直方向を反映',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled options have `aria-disabled="true"`',
              ja: '無効化されたオプションが `aria-disabled="true"` を持つ',
            },
          },
          {
            name: 'aria-label/labelledby',
            description: {
              en: 'Listbox has accessible name',
              ja: 'リストボックスがアクセシブル名を持つ',
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
              en: 'Focused option has tabIndex=0',
              ja: 'フォーカス中のオプションがtabIndex=0を持つ',
            },
          },
          {
            name: 'tabIndex=-1',
            description: {
              en: 'Non-focused options have tabIndex=-1',
              ja: 'フォーカスされていないオプションがtabIndex=-1を持つ',
            },
          },
          {
            name: 'Disabled tabIndex',
            description: {
              en: 'Disabled options have tabIndex=-1',
              ja: '無効化されたオプションがtabIndex=-1を持つ',
            },
          },
          {
            name: 'Focus restoration',
            description: {
              en: 'Focus returns to correct option on re-entry',
              ja: '再入時に正しいオプションにフォーカスが戻る',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Accessibility',
          ja: 'アクセシビリティ',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations (via jest-axe/axe-core)',
              ja: 'WCAG 2.1 AA違反がないこと（jest-axe/axe-core経由）',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Mouse Interaction',
          ja: 'マウス操作',
        },
        testType: 'E2E',
        items: [
          {
            name: 'Click option',
            description: {
              en: 'Selects option on click (single-select)',
              ja: 'クリックでオプションを選択（単一選択）',
            },
          },
          {
            name: 'Click toggle',
            description: {
              en: 'Toggles selection on click (multi-select)',
              ja: 'クリックで選択をトグル（複数選択）',
            },
          },
          {
            name: 'Click disabled',
            description: {
              en: 'Disabled options cannot be selected',
              ja: '無効化されたオプションは選択できない',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'Cross-framework Consistency',
          ja: 'クロスフレームワーク一貫性',
        },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks have listbox',
            description: {
              en: 'React, Vue, Svelte, Astro all render listbox elements',
              ja: 'React、Vue、Svelte、Astro全てがlistbox要素をレンダリング',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: '全フレームワークで一貫したARIA構造',
            },
          },
          {
            name: 'Select on click',
            description: {
              en: 'All frameworks select correctly on click',
              ja: '全フレームワークでクリック時に正しく選択',
            },
          },
          {
            name: 'Keyboard navigation',
            description: {
              en: 'All frameworks respond to keyboard navigation consistently',
              ja: '全フレームワークでキーボードナビゲーションが一貫して動作',
            },
          },
        ],
      },
    ],

    e2eTestFile: 'e2e/listbox.spec.ts',

    commands: [
      {
        comment: {
          en: 'Run all listbox E2E tests',
          ja: 'すべてのlistbox E2Eテストを実行',
        },
        command: 'npx playwright test listbox',
      },
      {
        comment: {
          en: 'Run for specific framework (React)',
          ja: '特定のフレームワークで実行（React）',
        },
        command: 'npx playwright test listbox --grep "react"',
      },
      {
        comment: {
          en: 'Run in UI mode for debugging',
          ja: 'デバッグ用UIモードで実行',
        },
        command: 'npm run test:e2e:ui -- --grep listbox',
      },
    ],

    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: {
          en: 'Test runner for unit tests',
          ja: 'ユニットテスト用テストランナー',
        },
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
        description: {
          en: 'Browser automation for E2E tests',
          ja: 'E2Eテスト用ブラウザ自動化',
        },
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

  // Test checklist for llm.md
  testChecklist: [
    { description: 'Arrow keys navigate options', priority: 'high', category: 'keyboard' },
    { description: 'Home moves to first option', priority: 'high', category: 'keyboard' },
    { description: 'End moves to last option', priority: 'high', category: 'keyboard' },
    { description: 'Type-ahead focuses matching option', priority: 'high', category: 'keyboard' },
    { description: 'Disabled options are skipped', priority: 'high', category: 'keyboard' },
    { description: 'Focus does not wrap', priority: 'high', category: 'keyboard' },
    {
      description: 'Arrow keys move focus and selection (single-select)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Space/Enter confirms selection', priority: 'high', category: 'keyboard' },
    {
      description: 'Arrow keys move focus only (multi-select)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Space toggles selection', priority: 'high', category: 'keyboard' },
    { description: 'Shift+Arrow extends selection', priority: 'high', category: 'keyboard' },
    { description: 'Ctrl+A selects all', priority: 'high', category: 'keyboard' },
    { description: 'Container has `role="listbox"`', priority: 'high', category: 'aria' },
    { description: 'Items have `role="option"`', priority: 'high', category: 'aria' },
    { description: 'Listbox has accessible name', priority: 'high', category: 'aria' },
    {
      description: 'Selected options have `aria-selected="true"`',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Multi-select has `aria-multiselectable="true"`',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Only focused option has `tabIndex="0"`', priority: 'high', category: 'focus' },
    { description: 'Other options have `tabIndex="-1"`', priority: 'high', category: 'focus' },
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  // Implementation notes for llm.md
  implementationNotes: `Structure:
\`\`\`html
<ul role="listbox" aria-label="Choose color">
  <li role="option" aria-selected="true" tabindex="0">Red</li>
  <li role="option" aria-selected="false" tabindex="-1">Green</li>
  <li role="option" aria-selected="false" tabindex="-1">Blue</li>
</ul>
\`\`\`

Multi-Select:
\`\`\`html
<ul role="listbox" aria-label="Colors" aria-multiselectable="true">
  <li role="option" aria-selected="true" tabindex="0">Red</li>
  <li role="option" aria-selected="true" tabindex="-1">Green</li>
  <li role="option" aria-selected="false" tabindex="-1">Blue</li>
</ul>
\`\`\`

Type-Ahead:
- Single character: jump to next option starting with that char
- Multiple chars (typed quickly): match prefix
- Example: typing "gr" focuses "Green"`,

  // Example test code for llm.md
  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Arrow navigation
it('ArrowDown moves focus', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  const firstOption = screen.getByRole('option', { name: 'Red' });
  firstOption.focus();

  await user.keyboard('{ArrowDown}');

  expect(screen.getByRole('option', { name: 'Green' })).toHaveFocus();
});

// Single-select
it('selection follows focus in single-select', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  const firstOption = screen.getByRole('option', { name: 'Red' });
  firstOption.focus();

  await user.keyboard('{ArrowDown}');

  const greenOption = screen.getByRole('option', { name: 'Green' });
  expect(greenOption).toHaveAttribute('aria-selected', 'true');
});

// Multi-select toggle
it('Space toggles in multi-select', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} multiselectable />);

  const option = screen.getByRole('option', { name: 'Red' });
  option.focus();

  await user.keyboard(' ');
  expect(option).toHaveAttribute('aria-selected', 'true');

  await user.keyboard(' ');
  expect(option).toHaveAttribute('aria-selected', 'false');
});

// Type-ahead
it('type-ahead focuses matching option', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  screen.getByRole('option', { name: 'Red' }).focus();

  await user.keyboard('g');

  expect(screen.getByRole('option', { name: 'Green' })).toHaveFocus();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/listbox/react/demo/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').first();
  await expect(listbox).toHaveAttribute('role', 'listbox');

  // Check accessible name
  const ariaLabelledby = await listbox.getAttribute('aria-labelledby');
  expect(ariaLabelledby).toBeTruthy();

  // Check options have correct role
  const options = listbox.locator('[role="option"]');
  const count = await options.count();
  expect(count).toBeGreaterThan(0);

  // Multi-select listbox has aria-multiselectable
  const multiSelectListbox = page.locator('[role="listbox"]').nth(1);
  await expect(multiSelectListbox).toHaveAttribute('aria-multiselectable', 'true');
});

// Keyboard navigation test (single-select)
test('ArrowDown moves focus and selection in single-select', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').first();
  const options = listbox.locator('[role="option"]:not([aria-disabled="true"])');
  const firstOption = options.first();
  const secondOption = options.nth(1);

  await firstOption.focus();
  await expect(firstOption).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowDown');
  await expect(secondOption).toHaveAttribute('tabindex', '0');
  await expect(secondOption).toHaveAttribute('aria-selected', 'true');
  await expect(firstOption).toHaveAttribute('aria-selected', 'false');
});

// Multi-select keyboard test
test('Space toggles selection in multi-select', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').nth(1);
  const firstOption = listbox.locator('[role="option"]:not([aria-disabled="true"])').first();

  await firstOption.focus();
  await expect(firstOption).not.toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Space');
  await expect(firstOption).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Space');
  await expect(firstOption).toHaveAttribute('aria-selected', 'false');
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).include('[role="listbox"]').analyze();
  expect(results.violations).toEqual([]);
});`,
};
