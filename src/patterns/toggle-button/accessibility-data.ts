import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const toggleButtonAccessibilityData: PatternAccessibilityData = {
  pattern: 'toggle-button',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/button/#toggle-button',

  overview: {
    en: 'A toggle button is a two-state button that can be either pressed or not pressed. It uses aria-pressed to communicate state to assistive technology.',
    ja: 'トグルボタンは「押されている」または「押されていない」の2つの状態を持つボタンです。aria-pressedを使用して支援技術に状態を伝えます。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'button',
      element: { en: 'Button element', ja: 'ボタン要素' },
      description: {
        en: 'Indicates a widget that triggers an action when activated',
        ja: 'アクティブ化されたときにアクションをトリガーするウィジェットを示す',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-pressed',
      element: { en: 'button', ja: 'ボタン' },
      values: 'true | false',
      required: true,
      changeTrigger: {
        en: 'Click, Enter, Space',
        ja: 'クリック、Enter、Space',
      },
      reference: 'https://w3c.github.io/aria/#aria-pressed',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Space',
      action: {
        en: 'Toggle the button state',
        ja: 'ボタンの状態を切り替える',
      },
    },
    {
      key: 'Enter',
      action: {
        en: 'Toggle the button state',
        ja: 'ボタンの状態を切り替える',
      },
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA button role',
      url: 'https://w3c.github.io/aria/#button',
    },
    {
      title: 'aria-pressed',
      url: 'https://w3c.github.io/aria/#aria-pressed',
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Toggle buttons must have an accessible name via visible label text, aria-label, or aria-labelledby.',
      ja: 'トグルボタンには表示されるラベルテキスト、aria-label、またはaria-labelledbyを通じてアクセシブルな名前が必要です。',
    },
    {
      en: 'Use type="button" to prevent accidental form submission.',
      ja: 'type="button"を使用して誤ったフォーム送信を防ぎます。',
    },
    {
      en: 'Tri-state buttons may use aria-pressed="mixed" for partially selected state (e.g., "Select All" when some items selected).',
      ja: '3状態ボタンでは部分的に選択された状態（例：一部のアイテムが選択された「すべて選択」）に aria-pressed="mixed" を使用できます。',
    },
  ],

  // --- Implementation Notes ---

  implementationNotesData: {
    structure: {
      diagram: `Structure:
<button type="button" aria-pressed="false">
  Mute
</button>

State Changes:
- Initial: aria-pressed="false" (not pressed)
- After click: aria-pressed="true" (pressed)

Use type="button":
- Prevents accidental form submission
- Native <button> defaults to type="submit"

Tri-state (rare):
- aria-pressed="mixed" for partially selected state
- Example: "Select All" when some items selected`,
      caption: {
        en: 'Toggle Button structure and state changes',
        ja: 'トグルボタンの構造と状態変化',
      },
    },
  },

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト (Testing Library)' },
        description: {
          en: 'Verify component rendering and interactions using framework-specific Testing Library utilities. These tests ensure correct component behavior in isolation.',
          ja: 'フレームワーク固有のTesting Libraryユーティリティを使用してコンポーネントのレンダリングとインタラクションを検証します。分離された環境で正しいコンポーネント動作を確認できます。',
        },
        areas: [
          { en: 'HTML structure and element hierarchy', ja: 'HTML構造と要素の階層' },
          {
            en: 'Initial attribute values (aria-pressed, type)',
            ja: '初期属性値（aria-pressed、type）',
          },
          {
            en: 'Click event handling and state toggling',
            ja: 'クリックイベント処理と状態切り替え',
          },
          { en: 'CSS class application', ja: 'CSSクラスの適用' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト (Playwright)' },
        description: {
          en: 'Verify component behavior in a real browser environment across all four frameworks. These tests cover interactions that require full browser context.',
          ja: '4つのフレームワーク全体で実際のブラウザ環境でのコンポーネント動作を検証します。フルブラウザコンテキストが必要なインタラクションをカバーします。',
        },
        areas: [
          { en: 'Keyboard interactions (Space, Enter)', ja: 'キーボード操作（Space、Enter）' },
          { en: 'aria-pressed state toggling', ja: 'aria-pressed状態の切り替え' },
          { en: 'Disabled state behavior', ja: '無効状態の動作' },
          { en: 'Focus management and Tab navigation', ja: 'フォーカス管理とTabナビゲーション' },
          { en: 'Cross-framework consistency', ja: 'クロスフレームワーク一貫性' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction (E2E)', ja: 'APG キーボード操作（E2E）' },
        testType: 'E2E',
        items: [
          {
            name: 'Space key toggles',
            description: {
              en: 'Pressing Space toggles the button state',
              ja: 'Spaceキーを押すとボタンの状態が切り替わる',
            },
          },
          {
            name: 'Enter key toggles',
            description: {
              en: 'Pressing Enter toggles the button state',
              ja: 'Enterキーを押すとボタンの状態が切り替わる',
            },
          },
          {
            name: 'Tab navigation',
            description: {
              en: 'Tab key moves focus between buttons',
              ja: 'Tabキーでボタン間のフォーカスを移動する',
            },
          },
          {
            name: 'Disabled Tab skip',
            description: {
              en: 'Disabled buttons are skipped in Tab order',
              ja: '無効化されたボタンはTabの順序でスキップされる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG ARIA Attributes (E2E)', ja: 'APG ARIA 属性（E2E）' },
        testType: 'E2E',
        items: [
          {
            name: 'role="button"',
            description: {
              en: 'Has implicit button role (via <button>)',
              ja: '暗黙的なbuttonロールを持つ（<button> 要素経由）',
            },
          },
          {
            name: 'aria-pressed initial',
            description: {
              en: 'Initial state is aria-pressed="false"',
              ja: '初期状態は aria-pressed="false"',
            },
          },
          {
            name: 'aria-pressed toggle',
            description: {
              en: 'Click changes aria-pressed to true',
              ja: 'クリックで aria-pressed が true に変わる',
            },
          },
          {
            name: 'type="button"',
            description: {
              en: 'Explicit button type prevents form submission',
              ja: '明示的なbutton typeがフォーム送信を防ぐ',
            },
          },
          {
            name: 'disabled state',
            description: {
              en: "Disabled buttons don't change state on click",
              ja: '無効化されたボタンはクリックで状態が変わらない',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility (E2E)', ja: 'アクセシビリティ（E2E）' },
        testType: 'E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations (via jest-axe)',
              ja: 'WCAG 2.1 AA違反がない（jest-axe経由）',
            },
          },
          {
            name: 'accessible name',
            description: {
              en: 'Button has an accessible name from content',
              ja: 'ボタンがコンテンツからアクセシブルな名前を持つ',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'HTML Attribute Inheritance (Unit)', ja: 'HTML属性の継承（Unit）' },
        testType: 'Unit',
        items: [
          {
            name: 'className merge',
            description: {
              en: 'Custom classes are merged with component classes',
              ja: 'カスタムクラスがコンポーネントのクラスとマージされる',
            },
          },
          {
            name: 'data-* attributes',
            description: {
              en: 'Custom data attributes are passed through',
              ja: 'カスタムdata属性が渡される',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/toggle-button.spec.ts',
    commands: [
      {
        comment: {
          en: 'Run unit tests for Toggle Button',
          ja: 'Toggle Buttonのユニットテストを実行',
        },
        command: 'npm run test -- toggle-button',
      },
      {
        comment: {
          en: 'Run E2E tests for Toggle Button (all frameworks)',
          ja: 'Toggle ButtonのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=toggle-button',
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

  // --- llm.md Specific Data ---

  testChecklist: [
    // Keyboard - High Priority
    { description: 'Space toggles state', priority: 'high', category: 'keyboard' },
    { description: 'Enter toggles state', priority: 'high', category: 'keyboard' },
    { description: 'Tab navigates to button', priority: 'high', category: 'keyboard' },
    { description: 'Disabled button is skipped by Tab', priority: 'high', category: 'keyboard' },

    // ARIA - High Priority
    {
      description: 'Has role="button" (implicit for <button>)',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Has aria-pressed attribute', priority: 'high', category: 'aria' },
    {
      description: 'aria-pressed toggles between true and false',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Has type="button" (prevents form submission)',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Disabled state uses disabled attribute', priority: 'high', category: 'aria' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Has accessible name (visible text or aria-label)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`
<button type="button" aria-pressed="false">
  Mute
</button>

State Changes:
- Initial: aria-pressed="false" (not pressed)
- After click: aria-pressed="true" (pressed)

Use type="button":
- Prevents accidental form submission
- Native <button> defaults to type="submit"

Tri-state (rare):
- aria-pressed="mixed" for partially selected state
- Example: "Select All" when some items selected
\`\`\``,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Toggle on click
it('toggles aria-pressed on click', async () => {
  const user = userEvent.setup();
  render(<ToggleButton>Mute</ToggleButton>);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'false');

  await user.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'true');

  await user.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'false');
});

// Keyboard toggle
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<ToggleButton>Mute</ToggleButton>);

  const button = screen.getByRole('button');
  button.focus();

  await user.keyboard(' ');
  expect(button).toHaveAttribute('aria-pressed', 'true');
});

// Has type="button"
it('has type="button"', () => {
  render(<ToggleButton>Mute</ToggleButton>);
  expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const button = page.locator('button[aria-pressed]').first();
  await expect(button).toHaveRole('button');
  await expect(button).toHaveAttribute('type', 'button');

  const ariaPressed = await button.getAttribute('aria-pressed');
  expect(['true', 'false', 'mixed']).toContain(ariaPressed);
});

// Click toggle test
test('toggles aria-pressed on click', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const button = page.locator('button[aria-pressed]').first();
  const initialState = await button.getAttribute('aria-pressed');

  await button.click();
  const newState = await button.getAttribute('aria-pressed');
  expect(newState).not.toBe(initialState);

  await button.click();
  const finalState = await button.getAttribute('aria-pressed');
  expect(finalState).toBe(initialState);
});

// Keyboard toggle test
test('toggles on Space and Enter keys', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const button = page.locator('button[aria-pressed]').first();
  const initialState = await button.getAttribute('aria-pressed');

  await button.focus();
  await page.keyboard.press('Space');
  expect(await button.getAttribute('aria-pressed')).not.toBe(initialState);

  await page.keyboard.press('Enter');
  expect(await button.getAttribute('aria-pressed')).toBe(initialState);
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const results = await new AxeBuilder({ page })
    .include('button[aria-pressed]')
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
