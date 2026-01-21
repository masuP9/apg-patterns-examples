/**
 * Button Pattern - Accessibility Data
 *
 * Single source of truth for accessibility documentation.
 * Used by AccessibilityDocs.astro and for generating button.md / button.ja.md
 */

import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const buttonAccessibilityData: PatternAccessibilityData = {
  pattern: 'button',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',

  overview: {
    en: 'A button is a widget that enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.',
    ja: 'ボタンは、フォームの送信、ダイアログを開く、アクションのキャンセル、削除操作の実行など、アクションやイベントをトリガーするためのウィジェットです。',
  },

  // --- Native HTML Considerations ---
  nativeHtmlConsiderations: [
    { useCase: 'Simple action button', recommended: 'Native <button>' },
    { useCase: 'Form submission', recommended: 'Native <button type="submit">' },
    { useCase: 'Educational purposes (demonstrating ARIA)', recommended: 'Custom role="button"' },
    {
      useCase: 'Legacy constraints (non-button must act as button)',
      recommended: 'Custom role="button"',
    },
  ],

  nativeVsCustom: [
    {
      feature: 'Keyboard activation (Space/Enter)',
      native: 'Built-in',
      custom: 'Requires JavaScript',
    },
    { feature: 'Focus management', native: 'Automatic', custom: 'Requires tabindex' },
    { feature: 'disabled attribute', native: 'Built-in', custom: 'Requires aria-disabled + JS' },
    { feature: 'Form submission', native: 'Built-in', custom: 'Not supported' },
    { feature: 'type attribute', native: 'submit/button/reset', custom: 'Not supported' },
    { feature: 'Works without JavaScript', native: 'Yes', custom: 'No' },
    { feature: 'Screen reader announcement', native: 'Automatic', custom: 'Requires ARIA' },
    {
      feature: 'Space key scroll prevention',
      native: 'Automatic',
      custom: 'Requires preventDefault()',
    },
  ],

  // --- ARIA Roles ---
  roles: [
    {
      name: 'button',
      element: {
        en: '<button> or element with role="button"',
        ja: '<button> または role="button" を持つ要素',
      },
      description: {
        en: 'Identifies the element as a button widget. Native <code>&lt;button&gt;</code> has this role implicitly.',
        ja: '要素をボタンウィジェットとして識別します。ネイティブの <code>&lt;button&gt;</code> は暗黙的にこのロールを持ちます。',
      },
    },
  ],

  // --- ARIA Properties ---
  properties: [
    {
      attribute: 'tabindex',
      element: {
        en: 'Custom button element',
        ja: 'カスタムボタン要素',
      },
      values: '"0" | "-1"',
      required: {
        en: 'Yes (for custom implementations)',
        ja: 'はい（カスタム実装の場合）',
      },
      notes: {
        en: 'Makes the custom button element focusable via keyboard navigation. Native <code>&lt;button&gt;</code> is focusable by default. Set to -1 when disabled.',
        ja: 'カスタムボタン要素をキーボードナビゲーションでフォーカス可能にします。ネイティブの <code>&lt;button&gt;</code> はデフォルトでフォーカス可能です。無効時は -1 に設定します。',
      },
    },
    {
      attribute: 'aria-disabled',
      element: {
        en: 'Button element',
        ja: 'ボタン要素',
      },
      values: '"true" | "false"',
      required: {
        en: 'No (only when disabled)',
        ja: 'いいえ（無効時のみ）',
      },
      notes: {
        en: 'Indicates the button is not interactive and cannot be activated. Native <code>&lt;button disabled&gt;</code> automatically handles this.',
        ja: 'ボタンがインタラクティブでなく、アクティブ化できないことを示します。ネイティブの <code>&lt;button disabled&gt;</code> はこれを自動的に処理します。',
      },
    },
    {
      attribute: 'aria-label',
      element: {
        en: 'Button element (optional)',
        ja: 'ボタン要素（オプション）',
      },
      values: {
        en: 'Text string describing the action',
        ja: 'アクションを説明するテキスト文字列',
      },
      required: {
        en: 'No (only for icon-only buttons)',
        ja: 'いいえ（アイコンのみのボタンの場合のみ）',
      },
      notes: {
        en: 'Provides an accessible name for icon-only buttons or when visible text is insufficient.',
        ja: 'アイコンのみのボタンや、表示テキストが不十分な場合にアクセシブルな名前を提供します。',
      },
    },
  ],

  // --- Keyboard Support ---
  keyboardSupport: [
    {
      key: 'Space',
      action: {
        en: 'Activate the button',
        ja: 'ボタンをアクティブ化',
      },
    },
    {
      key: 'Enter',
      action: {
        en: 'Activate the button',
        ja: 'ボタンをアクティブ化',
      },
    },
    {
      key: 'Tab',
      action: {
        en: 'Move focus to the next focusable element',
        ja: '次のフォーカス可能な要素にフォーカスを移動',
      },
    },
    {
      key: 'Shift + Tab',
      action: {
        en: 'Move focus to the previous focusable element',
        ja: '前のフォーカス可能な要素にフォーカスを移動',
      },
    },
  ],

  // --- Additional Notes ---
  additionalNotes: [
    {
      en: '<strong>Important:</strong> Both Space and Enter keys activate buttons. This differs from links, which only respond to Enter. Custom implementations must call <code>event.preventDefault()</code> on Space to prevent page scrolling.',
      ja: '<strong>重要:</strong> SpaceキーとEnterキーの両方がボタンをアクティブ化します。これはEnterキーのみに応答するリンクとは異なります。カスタム実装では、ページスクロールを防止するためにSpaceキーで <code>event.preventDefault()</code> を呼び出す必要があります。',
    },
  ],

  // --- Accessible Naming ---
  accessibleNaming: {
    description: {
      en: 'Buttons must have an accessible name. This can be provided through:',
      ja: 'ボタンにはアクセシブルな名前が必要です。次の方法で提供できます：',
    },
    methods: [
      {
        method: {
          en: 'Text content (recommended)',
          ja: 'テキストコンテンツ（推奨）',
        },
        description: {
          en: 'The visible text inside the button',
          ja: 'ボタン内の表示テキスト',
        },
      },
      {
        method: 'aria-label',
        description: {
          en: 'Provides an invisible label for icon-only buttons',
          ja: 'アイコンのみのボタンに対する非表示のラベルを提供',
        },
      },
      {
        method: 'aria-labelledby',
        description: {
          en: 'References an external element as the label',
          ja: '外部要素をラベルとして参照',
        },
      },
    ],
  },

  // --- Focus Management ---
  focusManagement: [
    {
      event: {
        en: 'Focus ring',
        ja: 'フォーカスリング',
      },
      behavior: {
        en: 'Visible outline when focused via keyboard',
        ja: 'キーボードでフォーカスされた際に表示されるアウトライン',
      },
    },
    {
      event: {
        en: 'Cursor style',
        ja: 'カーソルスタイル',
      },
      behavior: {
        en: 'Pointer cursor to indicate interactivity',
        ja: 'インタラクティブであることを示すポインターカーソル',
      },
    },
    {
      event: {
        en: 'Disabled appearance',
        ja: '無効時の外観',
      },
      behavior: {
        en: 'Reduced opacity and not-allowed cursor when disabled',
        ja: '無効時は不透明度を下げ、not-allowedカーソルを表示',
      },
    },
  ],

  // --- References ---
  references: [
    {
      title: 'WAI-ARIA APG: Button Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/',
    },
    {
      title: 'MDN: <button> element',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button',
    },
    {
      title: 'W3C ARIA: button role',
      url: 'https://w3c.github.io/aria/#button',
    },
  ],

  // --- Testing Data ---
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
          ja: 'フレームワーク固有のテストライブラリを使用してコンポーネントのレンダリング出力を検証します。これらのテストは正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role="button", tabindex)',
            ja: 'ARIA属性（role="button"、tabindex）',
          },
          {
            en: 'Keyboard interaction (Space and Enter key activation)',
            ja: 'キーボード操作（SpaceキーとEnterキーでのアクティブ化）',
          },
          { en: 'Disabled state handling', ja: '無効状態の処理' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ検証' },
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
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストはインタラクションとフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          { en: 'ARIA structure in live browser', ja: 'ライブブラウザでのARIA構造' },
          {
            en: 'Keyboard activation (Space and Enter key)',
            ja: 'キーボードでのアクティブ化（SpaceキーとEnterキー）',
          },
          { en: 'Click interaction behavior', ja: 'クリック操作の動作' },
          { en: 'Disabled state interactions', ja: '無効状態のインタラクション' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreによるアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'フレームワーク間の一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: {
          en: 'APG Keyboard Interaction',
          ja: 'APGキーボード操作（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Space key',
            description: { en: 'Activates the button', ja: 'ボタンをアクティブ化' },
          },
          {
            name: 'Enter key',
            description: { en: 'Activates the button', ja: 'ボタンをアクティブ化' },
          },
          {
            name: 'Space preventDefault',
            description: {
              en: 'Prevents page scrolling when Space is pressed',
              ja: 'Spaceキー押下時のページスクロールを防止',
            },
          },
          {
            name: 'IME composing',
            description: {
              en: 'Ignores Space/Enter during IME input',
              ja: 'IME入力中はSpace/Enterキーを無視',
            },
          },
          {
            name: 'Tab navigation',
            description: {
              en: 'Tab moves focus between buttons',
              ja: 'Tabキーでボタン間のフォーカスを移動',
            },
          },
          {
            name: 'Disabled Tab skip',
            description: {
              en: 'Disabled buttons are skipped in Tab order',
              ja: '無効なボタンはTabオーダーでスキップされる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'ARIA Attributes',
          ja: 'ARIA属性（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="button"',
            description: { en: 'Element has button role', ja: '要素がbuttonロールを持つ' },
          },
          {
            name: 'tabindex="0"',
            description: {
              en: 'Element is focusable via keyboard',
              ja: '要素がキーボードでフォーカス可能',
            },
          },
          {
            name: 'aria-disabled',
            description: { en: 'Set to "true" when disabled', ja: '無効時に "true" に設定' },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Set when disabled to remove from Tab order',
              ja: '無効時にTabオーダーから除外するために設定',
            },
          },
          {
            name: 'Accessible name',
            description: {
              en: 'Name from text content, aria-label, or aria-labelledby',
              ja: 'テキストコンテンツ、aria-label、またはaria-labelledbyから名前を取得',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Click Behavior',
          ja: 'クリック動作（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Click activation',
            description: {
              en: 'Click activates the button',
              ja: 'クリックでボタンがアクティブ化される',
            },
          },
          {
            name: 'Disabled click',
            description: {
              en: 'Disabled buttons ignore click events',
              ja: '無効なボタンはクリックイベントを無視',
            },
          },
          {
            name: 'Disabled Space',
            description: {
              en: 'Disabled buttons ignore Space key',
              ja: '無効なボタンはSpaceキーを無視',
            },
          },
          {
            name: 'Disabled Enter',
            description: {
              en: 'Disabled buttons ignore Enter key',
              ja: '無効なボタンはEnterキーを無視',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Accessibility',
          ja: 'アクセシビリティ（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations (via jest-axe)',
              ja: 'WCAG 2.1 AAの違反がない（jest-axeによる）',
            },
          },
          {
            name: 'disabled axe',
            description: {
              en: 'No violations in disabled state',
              ja: '無効状態での違反がない',
            },
          },
          {
            name: 'aria-label axe',
            description: {
              en: 'No violations with aria-label',
              ja: 'aria-label使用時の違反がない',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'Props & Attributes',
          ja: 'プロパティ & 属性（Unit）',
        },
        testType: 'Unit',
        items: [
          {
            name: 'className',
            description: { en: 'Custom classes are applied', ja: 'カスタムクラスが適用される' },
          },
          {
            name: 'data-* attributes',
            description: {
              en: 'Custom data attributes are passed through',
              ja: 'カスタムdata属性が渡される',
            },
          },
          {
            name: 'children',
            description: {
              en: 'Child content is rendered',
              ja: '子コンテンツがレンダリングされる',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'Cross-framework Consistency',
          ja: 'フレームワーク間の一貫性（E2E）',
        },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks have buttons',
            description: {
              en: 'React, Vue, Svelte, Astro all render custom button elements',
              ja: 'React、Vue、Svelte、Astroすべてがカスタムボタン要素をレンダリング',
            },
          },
          {
            name: 'Same button count',
            description: {
              en: 'All frameworks render the same number of buttons',
              ja: 'すべてのフレームワークで同じ数のボタンをレンダリング',
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
    commands: [],
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

  // --- Test Checklist (for llm.md) ---
  testChecklist: [
    // High Priority: Keyboard
    { description: 'Space key activates the button', priority: 'high', category: 'keyboard' },
    { description: 'Enter key activates the button', priority: 'high', category: 'keyboard' },
    { description: 'Space key prevents page scrolling', priority: 'high', category: 'keyboard' },
    { description: 'Tab moves focus to next button', priority: 'high', category: 'keyboard' },
    { description: 'Disabled buttons skip Tab order', priority: 'high', category: 'keyboard' },
    // High Priority: ARIA
    { description: 'Element has role="button"', priority: 'high', category: 'aria' },
    { description: 'Element has tabindex="0"', priority: 'high', category: 'aria' },
    { description: 'Disabled button has aria-disabled="true"', priority: 'high', category: 'aria' },
    { description: 'Disabled button has tabindex="-1"', priority: 'high', category: 'aria' },
    // Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Disabled buttons ignore click events',
      priority: 'medium',
      category: 'click',
    },
    {
      description: 'Disabled buttons ignore keyboard events',
      priority: 'medium',
      category: 'click',
    },
  ],

  // --- Implementation Notes ---
  implementationNotes: `Structure (custom implementation):
<span
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="handleKeydown(event)"
>
  Click me
</span>

Native (recommended):
<button type="button">Click me</button>

Key points:
- tabindex="0" makes element focusable
- Both Space and Enter must activate the button
- Space key must call preventDefault() to prevent scrolling
- Disabled state: aria-disabled="true" + tabindex="-1"
- IME composition must be handled (check event.isComposing)

Button vs Toggle Button:
This pattern is for simple action buttons.
For buttons that toggle between pressed and unpressed states,
see the Toggle Button pattern which uses aria-pressed.`,

  // --- Example Test Code ---
  exampleTestCodeReact: `import { render, screen, fireEvent } from '@testing-library/react';

// Button role
it('has button role', () => {
  render(<CustomButton onClick={jest.fn()}>Click</CustomButton>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

// Keyboard activation
it('activates on Space key', () => {
  const handleClick = jest.fn();
  render(<CustomButton onClick={handleClick}>Click</CustomButton>);
  fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
  expect(handleClick).toHaveBeenCalled();
});

it('activates on Enter key', () => {
  const handleClick = jest.fn();
  render(<CustomButton onClick={handleClick}>Click</CustomButton>);
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
});

// Disabled state
it('has aria-disabled when disabled', () => {
  render(<CustomButton disabled>Click</CustomButton>);
  expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Helper to get custom button
const getButton = (page) => {
  return page.locator('[role="button"]').first();
};

// Keyboard activation
test('activates on Space key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const button = getButton(page);
  await button.focus();
  await button.press('Space');

  // Verify activation (depends on implementation)
  await expect(page.locator('.result')).toContainText('clicked');
});

test('activates on Enter key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const button = getButton(page);
  await button.focus();
  await button.press('Enter');

  // Verify activation
  await expect(page.locator('.result')).toContainText('clicked');
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const results = await new AxeBuilder({ page })
    .include('[role="button"]')
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
