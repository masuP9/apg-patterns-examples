import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const checkboxAccessibilityData: PatternAccessibilityData = {
  pattern: 'checkbox',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',

  overview: {
    en: 'A checkbox allows users to select one or more options from a set. Supports dual-state (checked/unchecked) and tri-state (checked/unchecked/mixed) for parent-child relationships.',
    ja: 'チェックボックスは、セットから1つ以上のオプションを選択できます。2状態（チェック/未チェック）と親子関係のための3状態（チェック/未チェック/混在）をサポートします。',
  },

  // --- Native HTML Considerations ---

  nativeHtmlConsiderations: {
    recommendation: {
      en: 'Before using this custom component, consider using native <input type="checkbox"> elements.',
      ja: 'このカスタムコンポーネントを使用する前に、ネイティブの <input type="checkbox"> 要素の使用を検討してください。',
    },
    benefits: {
      en: 'They provide built-in accessibility, work without JavaScript, and require no ARIA attributes.',
      ja: 'ネイティブ要素は組み込みのアクセシビリティを提供し、JavaScript なしで動作し、ARIA 属性を必要としません。',
    },
    codeExample: `<label>
  <input type="checkbox" name="agree" />
  I agree to the terms
</label>`,
    customUseCases: {
      en: 'Use custom implementations only when you need custom styling that native elements cannot provide, or complex indeterminate state management for checkbox groups.',
      ja: 'カスタム実装は、ネイティブ要素では提供できないカスタムスタイリングが必要な場合、またはチェックボックスグループの複雑な不確定状態管理が必要な場合にのみ使用してください。',
    },
  },

  nativeVsCustom: [
    {
      useCase: { en: 'Basic form input', ja: '基本的なフォーム入力' },
      native: { en: 'Recommended', ja: '推奨' },
      custom: { en: 'Not needed', ja: '不要' },
      nativeRecommended: true,
    },
    {
      useCase: { en: 'JavaScript disabled support', ja: 'JavaScript 無効時のサポート' },
      native: { en: 'Works natively', ja: 'ネイティブで動作' },
      custom: { en: 'Requires fallback', ja: 'フォールバックが必要' },
      nativeRecommended: true,
    },
    {
      useCase: { en: 'Indeterminate (mixed) state', ja: '不確定（混在）状態' },
      native: { en: 'JS property only*', ja: 'JS プロパティのみ*' },
      custom: { en: 'Full control', ja: '完全に制御可能' },
      nativeRecommended: false,
    },
    {
      useCase: { en: 'Custom styling', ja: 'カスタムスタイリング' },
      native: { en: 'Limited (browser-dependent)', ja: '制限あり（ブラウザ依存）' },
      custom: { en: 'Full control', ja: '完全に制御可能' },
      nativeRecommended: false,
    },
    {
      useCase: { en: 'Form submission', ja: 'フォーム送信' },
      native: { en: 'Built-in', ja: '組み込み' },
      custom: { en: 'Requires hidden input', ja: 'hidden input が必要' },
      nativeRecommended: true,
    },
  ],

  nativeHtmlFootnote: {
    en: '*Native indeterminate is a JavaScript property, not an HTML attribute. It cannot be set declaratively.',
    ja: '*ネイティブの indeterminate は JavaScript プロパティであり、HTML 属性ではありません。宣言的に設定することはできません。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'checkbox',
      element: {
        en: '<input type="checkbox"> or element with role="checkbox"',
        ja: '<input type="checkbox"> または role="checkbox" を持つ要素',
      },
      description: {
        en: 'Identifies the element as a checkbox. Native <input type="checkbox"> has this role implicitly.',
        ja: '要素をチェックボックスとして識別します。ネイティブの <input type="checkbox"> はこのロールを暗黙的に持ちます。',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-checked / checked',
      element: { en: 'Checkbox element', ja: 'チェックボックス要素' },
      values: 'true | false | mixed',
      required: true,
      changeTrigger: { en: 'Click, Space key', ja: 'クリック、Space キー' },
      reference: 'https://w3c.github.io/aria/#aria-checked',
    },
    {
      attribute: 'indeterminate',
      element: { en: 'Native checkbox (<input>)', ja: 'ネイティブチェックボックス（<input>）' },
      values: 'true | false',
      required: false,
      changeTrigger: {
        en: 'Parent-child sync, automatically cleared on user interaction',
        ja: '親子同期、ユーザー操作時に自動的にクリア',
      },
    },
    {
      attribute: 'disabled',
      element: { en: 'Checkbox element', ja: 'チェックボックス要素' },
      values: 'present | absent',
      required: false,
      changeTrigger: { en: 'Programmatic change', ja: 'プログラムによる変更' },
    },
  ],

  properties: [
    {
      attribute: 'aria-label',
      element: 'Control',
      values: { en: 'string', ja: 'string' },
      required: { en: 'When no visible label', ja: '可視ラベルがない場合' },
      notes: { en: 'Provides accessible name', ja: 'アクセシブルな名前を提供' },
    },
    {
      attribute: 'aria-labelledby',
      element: 'Control',
      values: { en: 'ID reference', ja: 'ID 参照' },
      required: { en: 'When no visible label', ja: '可視ラベルがない場合' },
      notes: { en: 'References external text as label', ja: '外部テキストをラベルとして参照' },
    },
    {
      attribute: 'aria-describedby',
      element: 'Control',
      values: { en: 'ID reference', ja: 'ID 参照' },
      required: false,
      notes: { en: 'Additional description', ja: '追加の説明' },
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Space',
      action: {
        en: 'Toggle the checkbox state (checked/unchecked)',
        ja: 'チェックボックスの状態を切り替える（チェック/未チェック）',
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

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Native checkbox', ja: 'ネイティブチェックボックス' },
      behavior: {
        en: 'Focusable by default',
        ja: 'デフォルトでフォーカス可能',
      },
    },
    {
      event: { en: 'Custom implementation', ja: 'カスタム実装' },
      behavior: { en: 'Requires tabindex="0"', ja: 'tabindex="0" が必要' },
    },
    {
      event: { en: 'Disabled checkbox', ja: '無効なチェックボックス' },
      behavior: { en: 'Skipped in Tab order', ja: 'Tab 順序でスキップ' },
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Unlike the Switch pattern, the Enter key does not toggle the checkbox.',
      ja: 'Switchパターンとは異なり、Enterキーではチェックボックスが切り替わりません。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG Checkbox Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/',
    },
    {
      title: 'MDN: <input type="checkbox">',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox',
    },
    {
      title: 'W3C ARIA: checkbox role',
      url: 'https://w3c.github.io/aria/#checkbox',
    },
  ],

  // --- Accessible Naming ---

  accessibleNaming: {
    title: { en: 'Accessible Naming', ja: 'アクセシブルな名前' },
    description: {
      en: 'Checkboxes must have an accessible name. This can be provided through:',
      ja: 'チェックボックスにはアクセシブルな名前が必要です。これは以下の方法で提供できます:',
    },
    methods: [
      {
        method: { en: 'Label element (recommended)', ja: 'label要素（推奨）' },
        description: {
          en: 'Using <label> with for attribute or wrapping the input',
          ja: '<label> を for 属性で使用するか、inputをラップします',
        },
      },
      {
        method: 'aria-label',
        description: {
          en: 'Provides an invisible label for the checkbox',
          ja: 'チェックボックスに非表示のラベルを提供します',
        },
      },
      {
        method: 'aria-labelledby',
        description: {
          en: 'References an external element as the label',
          ja: '外部要素をラベルとして参照します',
        },
      },
    ],
  },

  // --- Visual Design ---

  visualDesign: {
    title: { en: 'Visual Design', ja: 'ビジュアルデザイン' },
    description: {
      en: 'This implementation follows WCAG 1.4.1 (Use of Color) by not relying solely on color to indicate state:',
      ja: 'この実装は、色のみに依存せずに状態を示すことで、WCAG 1.4.1（色の使用）に準拠しています:',
    },
    stateIndicators: [
      {
        state: { en: 'Checked', ja: 'チェック時' },
        indicator: { en: 'Checkmark icon', ja: 'チェックマークアイコン' },
      },
      {
        state: { en: 'Indeterminate', ja: '不確定状態時' },
        indicator: { en: 'Dash/minus icon', ja: 'ダッシュ/マイナスアイコン' },
      },
      {
        state: { en: 'Unchecked', ja: '未チェック時' },
        indicator: { en: 'Empty box', ja: '空のボックス' },
      },
      {
        state: { en: 'Forced colors mode', ja: '強制カラーモード' },
        indicator: {
          en: 'Uses system colors for accessibility in Windows High Contrast Mode',
          ja: 'Windowsハイコントラストモードでのアクセシビリティのためにシステムカラーを使用',
        },
      },
    ],
  },

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Container API)', ja: 'ユニットテスト (Container API)' },
        description: {
          en: "Verify the component's HTML output using Astro Container API. These tests ensure correct template rendering without requiring a browser.",
          ja: 'Astro Container APIを使用してコンポーネントのHTML出力を検証します。ブラウザを必要とせずに正しいテンプレートレンダリングを確認できます。',
        },
        areas: [
          { en: 'HTML structure and element hierarchy', ja: 'HTML構造と要素の階層' },
          {
            en: 'Initial attribute values (checked, disabled, indeterminate)',
            ja: '初期属性値（checked、disabled、indeterminate）',
          },
          {
            en: 'Form integration attributes (name, value, id)',
            ja: 'フォーム連携属性（name、value、id）',
          },
          { en: 'CSS class application', ja: 'CSSクラスの適用' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト (Playwright)' },
        description: {
          en: 'Verify Web Component behavior in a real browser environment. These tests cover interactions that require JavaScript execution.',
          ja: '実際のブラウザ環境でWeb Componentの動作を検証します。JavaScript実行が必要なインタラクションをカバーします。',
        },
        areas: [
          { en: 'Click and keyboard interactions', ja: 'クリック・キーボード操作' },
          {
            en: 'Custom event dispatching (checkedchange)',
            ja: 'カスタムイベントのディスパッチ（checkedchange）',
          },
          {
            en: 'Indeterminate state clearing on user action',
            ja: 'ユーザー操作によるindeterminate状態のクリア',
          },
          { en: 'Label association and click behavior', ja: 'ラベル関連付けとクリック動作' },
          { en: 'Focus management and tab navigation', ja: 'フォーカス管理とタブナビゲーション' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'HTML Structure', ja: 'HTML構造' },
        testType: 'Unit',
        items: [
          {
            name: 'input type',
            description: {
              en: 'Renders input with type="checkbox"',
              ja: 'type="checkbox"のinputをレンダリング',
            },
          },
          {
            name: 'checked attribute',
            description: {
              en: 'Checked attribute reflects initialChecked prop',
              ja: 'checked属性がinitialChecked propを反映',
            },
          },
          {
            name: 'disabled attribute',
            description: {
              en: 'Disabled attribute is set when disabled prop is true',
              ja: 'disabled propがtrueのときdisabled属性が設定される',
            },
          },
          {
            name: 'data-indeterminate',
            description: {
              en: 'Data attribute set for indeterminate state',
              ja: 'indeterminate状態用のdata属性が設定される',
            },
          },
          {
            name: 'control aria-hidden',
            description: {
              en: 'Visual control element has aria-hidden="true"',
              ja: '視覚的コントロール要素にaria-hidden="true"が設定される',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Keyboard Interaction', ja: 'キーボード操作' },
        testType: 'E2E',
        items: [
          {
            name: 'Space key',
            description: {
              en: 'Toggles the checkbox state',
              ja: 'チェックボックスの状態を切り替える',
            },
          },
          {
            name: 'Tab navigation',
            description: {
              en: 'Tab moves focus between checkboxes',
              ja: 'Tabでチェックボックス間のフォーカスを移動',
            },
          },
          {
            name: 'Disabled Tab skip',
            description: {
              en: 'Disabled checkboxes are skipped in Tab order',
              ja: '無効なチェックボックスはTab順序でスキップされる',
            },
          },
          {
            name: 'Disabled key ignore',
            description: {
              en: 'Disabled checkboxes ignore key presses',
              ja: '無効なチェックボックスはキー入力を無視する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Click Interaction', ja: 'クリック操作' },
        testType: 'E2E',
        items: [
          {
            name: 'checked toggle',
            description: {
              en: 'Click toggles checked state',
              ja: 'クリックでチェック状態を切り替える',
            },
          },
          {
            name: 'disabled click',
            description: {
              en: 'Disabled checkboxes prevent click interaction',
              ja: '無効なチェックボックスはクリック操作を防ぐ',
            },
          },
          {
            name: 'indeterminate clear',
            description: {
              en: 'User interaction clears indeterminate state',
              ja: 'ユーザー操作でindeterminate状態がクリアされる',
            },
          },
          {
            name: 'checkedchange event',
            description: {
              en: 'Custom event dispatched with correct detail',
              ja: '正しいdetailでカスタムイベントがディスパッチされる',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Form Integration', ja: 'フォーム連携' },
        testType: 'Unit',
        items: [
          {
            name: 'name attribute',
            description: {
              en: 'Form name attribute is rendered',
              ja: 'フォームのname属性がレンダリングされる',
            },
          },
          {
            name: 'value attribute',
            description: {
              en: 'Form value attribute is rendered',
              ja: 'フォームのvalue属性がレンダリングされる',
            },
          },
          {
            name: 'id attribute',
            description: {
              en: 'ID attribute is correctly set for label association',
              ja: 'ラベル関連付けのためにID属性が正しく設定される',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Label Association', ja: 'ラベル関連付け' },
        testType: 'E2E',
        items: [
          {
            name: 'Label click',
            description: {
              en: 'Clicking external label toggles checkbox',
              ja: '外部ラベルをクリックするとチェックボックスが切り替わる',
            },
          },
          {
            name: 'Wrapping label',
            description: {
              en: 'Clicking wrapping label toggles checkbox',
              ja: 'ラップするラベルをクリックするとチェックボックスが切り替わる',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'CSS Classes', ja: 'CSSクラス' },
        testType: 'Unit',
        items: [
          {
            name: 'default class',
            description: {
              en: 'apg-checkbox class is applied to wrapper',
              ja: 'apg-checkboxクラスがラッパーに適用される',
            },
          },
          {
            name: 'custom class',
            description: {
              en: 'Custom classes are merged with component classes',
              ja: 'カスタムクラスがコンポーネントクラスとマージされる',
            },
          },
        ],
      },
    ],
    commands: [
      {
        comment: { en: 'Run unit tests for Checkbox', ja: 'Checkboxのユニットテストを実行' },
        command: 'npm run test -- checkbox',
      },
      {
        comment: {
          en: 'Run E2E tests for Checkbox (all frameworks)',
          ja: 'CheckboxのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=checkbox',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: { en: 'Test runner for unit tests', ja: 'ユニットテスト用テストランナー' },
      },
      {
        name: 'Astro Container API',
        url: 'https://docs.astro.build/en/reference/container-reference/',
        description: {
          en: 'Server-side component rendering for unit tests',
          ja: 'ユニットテスト用サーバーサイドコンポーネントレンダリング',
        },
      },
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: { en: 'Browser automation for E2E tests', ja: 'E2Eテスト用ブラウザ自動化' },
      },
      {
        name: 'Testing Library',
        url: 'https://testing-library.com/',
        description: {
          en: 'Framework-specific testing utilities (React, Vue, Svelte)',
          ja: 'フレームワーク固有のテストユーティリティ（React、Vue、Svelte）',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // DOM State - High Priority
    {
      description: 'role="checkbox" exists (implicit via native or explicit)',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Unchecked by default', priority: 'high', category: 'aria' },
    { description: 'Checked when initialChecked=true', priority: 'high', category: 'aria' },
    { description: 'Click toggles checked state', priority: 'high', category: 'click' },
    { description: 'indeterminate property settable', priority: 'high', category: 'aria' },
    { description: 'User action clears indeterminate state', priority: 'high', category: 'click' },
    { description: 'Disabled state prevents interaction', priority: 'high', category: 'aria' },

    // Label & Form - High Priority
    { description: 'Accessible name via aria-label', priority: 'high', category: 'aria' },
    { description: 'Accessible name via external <label>', priority: 'high', category: 'aria' },
    { description: 'name attribute for form submission', priority: 'high', category: 'aria' },
    { description: 'value attribute set correctly', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'Space key toggles state', priority: 'high', category: 'keyboard' },
    { description: 'Tab moves focus to/from checkbox', priority: 'high', category: 'keyboard' },
    { description: 'Disabled checkbox skipped by Tab', priority: 'high', category: 'keyboard' },
    { description: 'Disabled checkbox ignores Space key', priority: 'high', category: 'keyboard' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (all states)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'State visible without color alone (WCAG 1.4.1)',
      priority: 'medium',
      category: 'accessibility',
    },

    // HTML Attributes - Low Priority
    { description: 'Custom className/class merged correctly', priority: 'low', category: 'aria' },
    { description: 'data-* attributes passed through', priority: 'low', category: 'aria' },
    { description: 'id attribute set for label association', priority: 'low', category: 'aria' },
  ],

  implementationNotes: `## Mixed State Behavior

When a mixed (indeterminate) checkbox is activated:

\`\`\`
mixed → checked (true) → unchecked (false) → checked...
\`\`\`

### Parent-Child Sync (Groups)

| Children State | Parent State |
| --- | --- |
| All checked | checked |
| All unchecked | unchecked |
| Some checked | mixed |

| Parent Action | Children Effect |
| --- | --- |
| Check | All children checked |
| Uncheck | All children unchecked |
| Activate when mixed | All children checked |

## Structure

\`\`\`
<span class="apg-checkbox">
  <input type="checkbox" class="apg-checkbox-input" />
  <span class="apg-checkbox-control" aria-hidden="true">
    <span class="apg-checkbox-icon--check">✓</span>
    <span class="apg-checkbox-icon--indeterminate">−</span>
  </span>
</span>
\`\`\`

## Common Pitfalls

1. **Form submission**: Unchecked checkbox sends nothing (not \`false\`). Handle on server or use hidden input.
2. **\`indeterminate\` is JS-only**: No HTML attribute exists. Must set via \`element.indeterminate = true\`.
3. **Focus ring on custom control**: Use adjacent sibling selector since input is visually hidden.
4. **Touch target size**: WCAG 2.5.5 recommends 44x44px minimum.`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Role test
it('has role="checkbox"', () => {
  render(<Checkbox aria-label="Accept terms" />);
  expect(screen.getByRole('checkbox')).toBeInTheDocument();
});

// Toggle test
it('toggles checked state on click', async () => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Accept terms" />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();

  await user.click(checkbox);
  expect(checkbox).toBeChecked();
});

// Keyboard test
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Accept terms" />);

  const checkbox = screen.getByRole('checkbox');
  checkbox.focus();

  await user.keyboard(' ');
  expect(checkbox).toBeChecked();
});

// Indeterminate test
it('clears indeterminate on user action', async () => {
  const user = userEvent.setup();
  render(<Checkbox indeterminate aria-label="Select all" />);

  const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
  expect(checkbox.indeterminate).toBe(true);

  await user.click(checkbox);
  expect(checkbox.indeterminate).toBe(false);
  expect(checkbox).toBeChecked();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';

test('toggles checked state on click', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-terms');
  const control = checkbox.locator('~ .apg-checkbox-control');

  await expect(checkbox).not.toBeChecked();
  await control.click();
  await expect(checkbox).toBeChecked();
});

test('Space key toggles checkbox when focused', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-terms');

  await checkbox.focus();
  await expect(checkbox).not.toBeChecked();

  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
});

test('clears indeterminate state on click', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-select-all');

  const isIndeterminate = await checkbox.evaluate(
    (el: HTMLInputElement) => el.indeterminate
  );
  expect(isIndeterminate).toBe(true);

  await checkbox.locator('~ .apg-checkbox-control').click();

  const isIndeterminateAfter = await checkbox.evaluate(
    (el: HTMLInputElement) => el.indeterminate
  );
  expect(isIndeterminateAfter).toBe(false);
  await expect(checkbox).toBeChecked();
});`,
};
