import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const switchAccessibilityData: PatternAccessibilityData = {
  pattern: 'switch',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/switch/',

  overview: {
    en: 'A switch is a type of checkbox that represents on/off values, as opposed to checked/unchecked. It uses role="switch" and aria-checked instead of a checkbox.',
    ja: 'スイッチはチェック済み/未チェックではなく、オン/オフの値を表すチェックボックスの一種です。チェックボックスの代わりにrole="switch"とaria-checkedを使用します。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'switch',
      element: { en: 'Switch element', ja: 'スイッチ要素' },
      description: {
        en: 'An input widget that allows users to choose one of two values: on or off',
        ja: 'ユーザーがオン/オフの2つの値のいずれかを選択できる入力ウィジェット',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-checked',
      element: { en: 'switch element', ja: 'switch 要素' },
      values: 'true | false',
      required: true,
      changeTrigger: {
        en: 'Click, Enter, Space',
        ja: 'クリック、Enter、Space',
      },
      reference: 'https://w3c.github.io/aria/#aria-checked',
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'switch element', ja: 'switch 要素' },
      values: 'true | undefined',
      required: false,
      changeTrigger: {
        en: 'Only when disabled',
        ja: '無効化時のみ',
      },
      reference: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Space',
      action: {
        en: 'Toggle the switch state (on/off)',
        ja: 'スイッチの状態を切り替え（オン/オフ）',
      },
    },
    {
      key: 'Enter',
      action: {
        en: 'Toggle the switch state (on/off)',
        ja: 'スイッチの状態を切り替え（オン/オフ）',
      },
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA switch role',
      url: 'https://w3c.github.io/aria/#switch',
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Switches must have an accessible name via visible label (recommended), aria-label, or aria-labelledby.',
      ja: 'スイッチには表示されるラベル（推奨）、aria-label、またはaria-labelledbyを通じてアクセシブルな名前が必要です。',
    },
    {
      en: 'This implementation follows WCAG 1.4.1 (Use of Color) by not relying solely on color to indicate state.',
      ja: 'この実装は、色のみに依存せず状態を示すことでWCAG 1.4.1（色の使用）に準拠しています。',
    },
    {
      en: 'Thumb position: Left = off, Right = on. Checkmark icon visible only when on.',
      ja: 'つまみの位置: 左 = オフ、右 = オン。チェックマークアイコンはオンの時のみ表示。',
    },
    {
      en: 'Forced colors mode uses system colors for Windows High Contrast Mode accessibility.',
      ja: '強制カラーモードはWindowsハイコントラストモードでのアクセシビリティのためにシステムカラーを使用します。',
    },
  ],

  // --- Implementation Notes ---

  implementationNotesData: {
    structure: {
      diagram: `Structure:
<button role="switch" aria-checked="false">
  <span class="switch-track">
    <span class="switch-thumb" />
  </span>
  Enable notifications
</button>

Visual States:
┌─────────┬────────────┐
│ OFF     │ ON         │
├─────────┼────────────┤
│ [○    ] │ [    ✓]   │
│ Left    │ Right+icon │
└─────────┴────────────┘

Switch vs Checkbox:
- Switch: immediate effect, on/off semantics
- Checkbox: may require form submit, checked/unchecked semantics

Use Switch when:
- Action takes effect immediately
- Represents on/off, enable/disable
- Similar to a physical switch`,
      caption: {
        en: 'Switch component structure and visual states',
        ja: 'Switchコンポーネントの構造と視覚的な状態',
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
          ja: 'フレームワーク固有のテストライブラリを使用してコンポーネントのレンダリング出力を検証します。これらのテストは正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role="switch", aria-checked)',
            ja: 'ARIA属性（role="switch"、aria-checked）',
          },
          {
            en: 'Keyboard interaction (Space, Enter)',
            ja: 'キーボードインタラクション（Space、Enter）',
          },
          { en: 'Disabled state handling', ja: '無効状態の処理' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ検証' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストはインタラクションとフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          { en: 'Click and keyboard toggle behavior', ja: 'クリックとキーボードのトグル動作' },
          { en: 'ARIA structure in live browser', ja: 'ライブブラウザでのARIA構造' },
          { en: 'Disabled state interactions', ja: '無効状態のインタラクション' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreによるアクセシビリティスキャン' },
          {
            en: 'Cross-framework consistency checks',
            ja: 'フレームワーク間の一貫性チェック',
          },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction', ja: 'APG キーボードインタラクション' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Space key',
            description: {
              en: 'Toggles the switch state',
              ja: 'スイッチの状態を切り替え',
            },
          },
          {
            name: 'Enter key',
            description: {
              en: 'Toggles the switch state',
              ja: 'スイッチの状態を切り替え',
            },
          },
          {
            name: 'Tab navigation',
            description: {
              en: 'Tab moves focus between switches',
              ja: 'Tabキーでスイッチ間をフォーカス移動',
            },
          },
          {
            name: 'Disabled Tab skip',
            description: {
              en: 'Disabled switches are skipped in Tab order',
              ja: '無効化されたスイッチはTab順序でスキップされる',
            },
          },
          {
            name: 'Disabled key ignore',
            description: {
              en: 'Disabled switches ignore key presses',
              ja: '無効化されたスイッチはキー押下を無視する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG ARIA Attributes', ja: 'APG ARIA 属性' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="switch"',
            description: {
              en: 'Element has switch role',
              ja: '要素にswitchロールが設定されている',
            },
          },
          {
            name: 'aria-checked initial',
            description: {
              en: 'Initial state is aria-checked="false"',
              ja: '初期状態が aria-checked="false"',
            },
          },
          {
            name: 'aria-checked toggle',
            description: {
              en: 'Click changes aria-checked value',
              ja: 'クリックで aria-checked 値が変更される',
            },
          },
          {
            name: 'type="button"',
            description: {
              en: 'Explicit button type prevents form submission',
              ja: '明示的なボタンタイプでフォーム送信を防止',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled switches have aria-disabled="true"',
              ja: '無効化されたスイッチは aria-disabled="true" を持つ',
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
              en: 'No WCAG 2.1 AA violations (via jest-axe)',
              ja: 'WCAG 2.1 AA違反なし（jest-axe経由）',
            },
          },
          {
            name: 'Accessible name (children)',
            description: {
              en: 'Switch has name from children content',
              ja: 'スイッチが子要素のコンテンツから名前を持つ',
            },
          },
          {
            name: 'aria-label',
            description: {
              en: 'Accessible name via aria-label',
              ja: 'aria-label経由でアクセシブルな名前',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Accessible name via external element',
              ja: '外部要素経由でアクセシブルな名前',
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
            name: 'className merge',
            description: {
              en: 'Custom classes are merged with component classes',
              ja: 'カスタムクラスがコンポーネントクラスとマージされる',
            },
          },
          {
            name: 'data-* attributes',
            description: {
              en: 'Custom data attributes are passed through',
              ja: 'カスタムdata属性が引き継がれる',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Cross-framework Consistency', ja: 'フレームワーク間の一貫性' },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks have switch',
            description: {
              en: 'React, Vue, Svelte, Astro all render switch elements',
              ja: 'React、Vue、Svelte、Astroすべてがスイッチ要素をレンダリング',
            },
          },
          {
            name: 'Toggle on click',
            description: {
              en: 'All frameworks toggle correctly on click',
              ja: 'すべてのフレームワークでクリック時に正しくトグル',
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
    e2eTestFile: 'e2e/switch.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Switch', ja: 'Switchのユニットテストを実行' },
        command: 'npm run test -- switch',
      },
      {
        comment: {
          en: 'Run E2E tests for Switch (all frameworks)',
          ja: 'SwitchのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=switch',
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
    { description: 'Tab navigates to switch', priority: 'high', category: 'keyboard' },
    { description: 'Disabled switch behavior correct', priority: 'high', category: 'keyboard' },

    // ARIA - High Priority
    { description: 'Has role="switch"', priority: 'high', category: 'aria' },
    { description: 'Has aria-checked attribute', priority: 'high', category: 'aria' },
    {
      description: 'aria-checked toggles between true and false',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Disabled state has aria-disabled="true"', priority: 'high', category: 'aria' },
    { description: 'Has accessible name', priority: 'high', category: 'aria' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'State distinguishable without color alone',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Accessible Naming

One of these is required:
- **Visible label** (recommended) - Child content as accessible name
- \`aria-label\` - Invisible label
- \`aria-labelledby\` - Reference to external label element

## Visual Design (WCAG 1.4.1)

Do not rely solely on color to indicate state:
- **Thumb position** - Left = off, Right = on
- **Checkmark icon** - Visible only when on
- **Forced colors mode** - Use system colors for Windows High Contrast

## Structure

\`\`\`
<button role="switch" aria-checked="false">
  <span class="switch-track">
    <span class="switch-thumb" />
  </span>
  Enable notifications
</button>

Visual States:
┌─────────┬────────────┐
│ OFF     │ ON         │
├─────────┼────────────┤
│ [○    ] │ [    ✓]   │
│ Left    │ Right+icon │
└─────────┴────────────┘

Switch vs Checkbox:
- Switch: immediate effect, on/off semantics
- Checkbox: may require form submit, checked/unchecked semantics
\`\`\``,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Toggle test
it('toggles aria-checked on click', async () => {
  const user = userEvent.setup();
  render(<Switch>Enable</Switch>);

  const switchEl = screen.getByRole('switch');
  expect(switchEl).toHaveAttribute('aria-checked', 'false');

  await user.click(switchEl);
  expect(switchEl).toHaveAttribute('aria-checked', 'true');
});

// Keyboard test
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<Switch>Enable</Switch>);

  const switchEl = screen.getByRole('switch');
  switchEl.focus();

  await user.keyboard(' ');
  expect(switchEl).toHaveAttribute('aria-checked', 'true');
});

// Accessible name test
it('has accessible name', () => {
  render(<Switch>Enable notifications</Switch>);
  expect(screen.getByRole('switch', { name: /enable notifications/i }))
    .toBeInTheDocument();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="switch" and aria-checked attribute', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switches = page.locator('[role="switch"]');
  const count = await switches.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(switches.nth(i)).toHaveAttribute('role', 'switch');
    const ariaChecked = await switches.nth(i).getAttribute('aria-checked');
    expect(['true', 'false']).toContain(ariaChecked);
  }
});

// Toggle behavior test
test('toggles aria-checked on click and Space key', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switchEl = page.locator('[role="switch"]').first();
  const initialState = await switchEl.getAttribute('aria-checked');

  // Click toggle
  await switchEl.click();
  expect(await switchEl.getAttribute('aria-checked')).not.toBe(initialState);

  // Space key toggle
  await switchEl.focus();
  await page.keyboard.press('Space');
  expect(await switchEl.getAttribute('aria-checked')).toBe(initialState);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switches = page.locator('[role="switch"]');
  await switches.first().waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="switch"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
