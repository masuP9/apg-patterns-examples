import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const sliderAccessibilityData: PatternAccessibilityData = {
  pattern: 'slider',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',

  overview: {
    en: 'A slider is an input widget where the user selects a value from within a given range. The slider has a thumb that can be moved along a track to change the value.',
    ja: 'スライダーは、ユーザーが特定の範囲内から値を選択する入力ウィジェットです。スライダーにはトラックに沿って移動させて値を変更できるつまみがあります。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'slider',
      element: { en: 'Thumb element', ja: 'つまみ要素' },
      description: {
        en: 'Identifies the element as a slider that allows users to select a value from within a range',
        ja: 'ユーザーが範囲内から値を選択できるスライダーとして要素を識別します',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-valuenow',
      element: { en: 'slider element', ja: 'slider 要素' },
      values: 'Number',
      required: true,
      notes: {
        en: 'Updated dynamically when value changes via keyboard or pointer',
        ja: 'キーボードまたはポインターによる値変更時に動的に更新',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuenow',
    },
    {
      attribute: 'aria-valuemin',
      element: { en: 'slider element', ja: 'slider 要素' },
      values: 'Number',
      required: true,
      notes: { en: 'Default: 0', ja: 'デフォルト: 0' },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemin',
    },
    {
      attribute: 'aria-valuemax',
      element: { en: 'slider element', ja: 'slider 要素' },
      values: 'Number',
      required: true,
      notes: { en: 'Default: 100', ja: 'デフォルト: 100' },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemax',
    },
    {
      attribute: 'aria-valuetext',
      element: { en: 'slider element', ja: 'slider 要素' },
      values: 'String',
      required: {
        en: 'No (recommended when value needs context)',
        ja: 'いいえ（値にコンテキストが必要な場合は推奨）',
      },
      notes: {
        en: 'Example: "50%", "Medium", "3 of 5 stars"',
        ja: '例: "50%", "Medium", "3 of 5 stars"',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuetext',
    },
    {
      attribute: 'aria-orientation',
      element: { en: 'slider element', ja: 'slider 要素' },
      values: '"horizontal" | "vertical"',
      required: false,
      notes: {
        en: 'Default: horizontal (implicit). Only set for vertical sliders.',
        ja: 'デフォルト: horizontal（暗黙的）。垂直スライダーの場合のみ設定。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-orientation',
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'slider element', ja: 'slider 要素' },
      values: 'true | undefined',
      required: false,
      notes: {
        en: 'Set only when disabled',
        ja: '無効化時のみ設定',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Right Arrow',
      action: {
        en: 'Increases the value by one step',
        ja: '値を1ステップ増加させる',
      },
    },
    {
      key: 'Up Arrow',
      action: {
        en: 'Increases the value by one step',
        ja: '値を1ステップ増加させる',
      },
    },
    {
      key: 'Left Arrow',
      action: {
        en: 'Decreases the value by one step',
        ja: '値を1ステップ減少させる',
      },
    },
    {
      key: 'Down Arrow',
      action: {
        en: 'Decreases the value by one step',
        ja: '値を1ステップ減少させる',
      },
    },
    {
      key: 'Home',
      action: {
        en: 'Sets the slider to its minimum value',
        ja: 'スライダーを最小値に設定する',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Sets the slider to its maximum value',
        ja: 'スライダーを最大値に設定する',
      },
    },
    {
      key: 'Page Up',
      action: {
        en: 'Increases the value by a large step (default: step * 10)',
        ja: '値を大きいステップで増加させる（デフォルト: step * 10）',
      },
    },
    {
      key: 'Page Down',
      action: {
        en: 'Decreases the value by a large step (default: step * 10)',
        ja: '値を大きいステップで減少させる（デフォルト: step * 10）',
      },
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG: Slider Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider/',
    },
    {
      title: 'MDN: <input type="range"> element',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/range',
    },
    {
      title: 'W3C ARIA: slider role',
      url: 'https://w3c.github.io/aria/#slider',
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Sliders must have an accessible name via visible label (recommended), aria-label, or aria-labelledby.',
      ja: 'スライダーには表示されるラベル（推奨）、aria-label、またはaria-labelledbyを通じてアクセシブルな名前が必要です。',
    },
    {
      en: 'This implementation follows WCAG guidelines for accessible visual design including focus indicators, visual fill, and hover states.',
      ja: 'この実装は、フォーカスインジケーター、視覚的な塗りつぶし、ホバー状態を含むアクセシブルなビジュアルデザインのWCAGガイドラインに従っています。',
    },
    {
      en: 'Pointer interaction: Click on track moves thumb immediately; drag allows continuous adjustment.',
      ja: 'ポインター操作: トラックをクリックするとつまみが即座に移動し、ドラッグで連続的な調整が可能です。',
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
<div class="slider-container">
  <label id="label">Volume</label>
  <div class="slider-track">
    <div class="slider-fill" />
    <div
      role="slider"
      tabindex="0"
      aria-valuenow="50"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-labelledby="label"
      class="slider-thumb"
    />
  </div>
</div>

Visual Layout:
┌─────────────────────────────────────┐
│ Volume                               │
│ ├─────────●─────────────────────────┤
│ 0        50                     100  │
└─────────────────────────────────────┘

Keyboard Navigation:
← / ↓  = Decrease by step
→ / ↑  = Increase by step
Home   = Set to min
End    = Set to max
PgUp   = Increase by large step
PgDn   = Decrease by large step`,
      caption: {
        en: 'Slider component structure and visual layout',
        ja: 'Sliderコンポーネントの構造と視覚的なレイアウト',
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
            en: 'ARIA attributes (role="slider", aria-valuenow, aria-valuemin, aria-valuemax)',
            ja: 'ARIA属性（role="slider"、aria-valuenow、aria-valuemin、aria-valuemax）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Home, End, Page Up/Down)',
            ja: 'キーボードインタラクション（矢印キー、Home、End、Page Up/Down）',
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
          { en: 'Keyboard navigation and value changes', ja: 'キーボードナビゲーションと値の変更' },
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
        title: { en: 'ARIA Attributes', ja: 'ARIA 属性' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="slider"',
            description: {
              en: 'Element has the slider role',
              ja: '要素にsliderロールが設定されている',
            },
          },
          {
            name: 'aria-valuenow',
            description: {
              en: 'Current value is correctly set and updated',
              ja: '現在値が正しく設定・更新される',
            },
          },
          {
            name: 'aria-valuemin',
            description: {
              en: 'Minimum value is set',
              ja: '最小値が設定されている',
            },
          },
          {
            name: 'aria-valuemax',
            description: {
              en: 'Maximum value is set',
              ja: '最大値が設定されている',
            },
          },
          {
            name: 'aria-valuetext',
            description: {
              en: 'Human-readable text is set when provided',
              ja: '提供された場合、人間が読めるテキストが設定される',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled state is reflected when set',
              ja: '無効状態が設定時に反映される',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Accessible Name', ja: 'アクセシブルな名前' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-label',
            description: {
              en: 'Accessible name via aria-label attribute',
              ja: 'aria-label属性経由のアクセシブルな名前',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Accessible name via external element reference',
              ja: '外部要素参照経由のアクセシブルな名前',
            },
          },
          {
            name: 'visible label',
            description: {
              en: 'Visible label provides accessible name',
              ja: '表示ラベルがアクセシブルな名前を提供',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Keyboard Interaction', ja: 'キーボードインタラクション' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Arrow Right/Up',
            description: {
              en: 'Increases value by one step',
              ja: '値を1ステップ増加',
            },
          },
          {
            name: 'Arrow Left/Down',
            description: {
              en: 'Decreases value by one step',
              ja: '値を1ステップ減少',
            },
          },
          {
            name: 'Home',
            description: {
              en: 'Sets value to minimum',
              ja: '値を最小値に設定',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Sets value to maximum',
              ja: '値を最大値に設定',
            },
          },
          {
            name: 'Page Up/Down',
            description: {
              en: 'Increases/decreases value by large step',
              ja: '値を大きいステップで増加/減少',
            },
          },
          {
            name: 'Boundary clamping',
            description: {
              en: 'Value does not exceed min/max limits',
              ja: '値がmin/max制限を超えない',
            },
          },
          {
            name: 'Disabled state',
            description: {
              en: 'Keyboard has no effect when disabled',
              ja: '無効時はキーボード操作が無効',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Focus Management', ja: 'フォーカス管理' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'tabindex="0"',
            description: {
              en: 'Thumb is focusable',
              ja: 'つまみがフォーカス可能',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Thumb is not focusable when disabled',
              ja: '無効時はつまみがフォーカス不可',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Orientation', ja: '向き' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'horizontal',
            description: {
              en: 'No aria-orientation for horizontal slider',
              ja: '水平スライダーにはaria-orientationなし',
            },
          },
          {
            name: 'vertical',
            description: {
              en: 'aria-orientation="vertical" is set',
              ja: 'aria-orientation="vertical"が設定される',
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
              en: 'No accessibility violations detected by axe-core',
              ja: 'axe-coreによるアクセシビリティ違反なし',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Edge Cases', ja: 'エッジケース' },
        testType: 'Unit',
        items: [
          {
            name: 'decimal values',
            description: {
              en: 'Handles decimal step values correctly',
              ja: '小数ステップ値を正しく処理',
            },
          },
          {
            name: 'negative range',
            description: {
              en: 'Handles negative min/max ranges',
              ja: '負のmin/max範囲を処理',
            },
          },
          {
            name: 'clamp to min',
            description: {
              en: 'defaultValue below min is clamped to min',
              ja: 'min未満のdefaultValueはminにクランプ',
            },
          },
          {
            name: 'clamp to max',
            description: {
              en: 'defaultValue above max is clamped to max',
              ja: 'max超過のdefaultValueはmaxにクランプ',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Callbacks', ja: 'コールバック' },
        testType: 'Unit',
        items: [
          {
            name: 'onValueChange',
            description: {
              en: 'Callback is called with new value on change',
              ja: '変更時に新しい値でコールバックが呼ばれる',
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
            name: 'className',
            description: {
              en: 'Custom class is applied to container',
              ja: 'カスタムクラスがコンテナに適用される',
            },
          },
          {
            name: 'id',
            description: {
              en: 'ID attribute is set correctly',
              ja: 'ID属性が正しく設定される',
            },
          },
          {
            name: 'data-*',
            description: {
              en: 'Data attributes are passed through',
              ja: 'データ属性が引き継がれる',
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
            name: 'All frameworks render sliders',
            description: {
              en: 'React, Vue, Svelte, Astro all render slider elements',
              ja: 'React、Vue、Svelte、Astroすべてがスライダー要素をレンダリング',
            },
          },
          {
            name: 'Consistent ARIA attributes',
            description: {
              en: 'All frameworks have consistent aria-valuenow, aria-valuemin, aria-valuemax',
              ja: 'すべてのフレームワークで一貫したaria-valuenow、aria-valuemin、aria-valuemax',
            },
          },
          {
            name: 'Keyboard navigation',
            description: {
              en: 'All frameworks support Arrow keys, Home, End keyboard navigation',
              ja: 'すべてのフレームワークが矢印キー、Home、Endキーボードナビゲーションをサポート',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/slider.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Slider', ja: 'Sliderのユニットテストを実行' },
        command: 'npm run test -- slider',
      },
      {
        comment: {
          en: 'Run E2E tests for Slider (all frameworks)',
          ja: 'SliderのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=slider',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークのE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=slider',
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
          en: 'Framework-specific testing utilities',
          ja: 'フレームワーク別テストユーティリティ',
        },
      },
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: { en: 'Browser automation for E2E tests', ja: 'E2Eテスト用ブラウザ自動化' },
      },
      {
        name: 'axe-core',
        url: 'https://github.com/dequelabs/axe-core',
        description: {
          en: 'Accessibility testing engine',
          ja: 'アクセシビリティテストエンジン',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // ARIA - High Priority
    { description: 'Has role="slider"', priority: 'high', category: 'aria' },
    { description: 'Has aria-valuenow attribute', priority: 'high', category: 'aria' },
    { description: 'Has aria-valuemin attribute', priority: 'high', category: 'aria' },
    { description: 'Has aria-valuemax attribute', priority: 'high', category: 'aria' },
    { description: 'aria-valuenow updates on value change', priority: 'high', category: 'aria' },
    { description: 'Has accessible name', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'Right/Up Arrow increases value', priority: 'high', category: 'keyboard' },
    { description: 'Left/Down Arrow decreases value', priority: 'high', category: 'keyboard' },
    { description: 'Home sets to minimum', priority: 'high', category: 'keyboard' },
    { description: 'End sets to maximum', priority: 'high', category: 'keyboard' },
    {
      description: 'Page Up/Down changes value by large step',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Value clamped to min/max', priority: 'high', category: 'keyboard' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Focus indicator visible',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Native HTML Alternative

Consider using \`<input type="range">\` first:
\`\`\`html
<label for="volume">Volume</label>
<input type="range" id="volume" min="0" max="100" value="50">
\`\`\`

Use custom slider when:
- Custom styling beyond pseudo-elements
- Consistent cross-browser appearance
- Complex visual feedback during interaction

## Accessible Naming

One of these is required:
- **Visible label** (recommended) - Using label element or visible text
- \`aria-label\` - Invisible label
- \`aria-labelledby\` - Reference to external label element

## Structure

\`\`\`
<div class="slider-container">
  <div role="slider"
       tabindex="0"
       aria-valuenow="50"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-label="Volume"
       class="slider-thumb">
  </div>
</div>

Visual Layout:
├─────────●─────────────────────────┤
0        50                     100
\`\`\`

## aria-valuetext

Use when numeric value needs context:
- "50%" instead of "50"
- "Medium" instead of "3"
- "3 of 5 stars" instead of "3"`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA attributes test
it('has correct ARIA attributes', () => {
  render(<Slider min={0} max={100} defaultValue={50} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  expect(slider).toHaveAttribute('aria-valuenow', '50');
  expect(slider).toHaveAttribute('aria-valuemin', '0');
  expect(slider).toHaveAttribute('aria-valuemax', '100');
});

// Keyboard navigation test
it('increases value on Arrow Right', async () => {
  const user = userEvent.setup();
  render(<Slider min={0} max={100} defaultValue={50} step={1} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  slider.focus();

  await user.keyboard('{ArrowRight}');
  expect(slider).toHaveAttribute('aria-valuenow', '51');
});

// Home/End test
it('sets to min on Home, max on End', async () => {
  const user = userEvent.setup();
  render(<Slider min={0} max={100} defaultValue={50} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  slider.focus();

  await user.keyboard('{Home}');
  expect(slider).toHaveAttribute('aria-valuenow', '0');

  await user.keyboard('{End}');
  expect(slider).toHaveAttribute('aria-valuenow', '100');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="slider" with required attributes', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();

  await expect(slider).toHaveAttribute('role', 'slider');
  await expect(slider).toHaveAttribute('aria-valuenow');
  await expect(slider).toHaveAttribute('aria-valuemin');
  await expect(slider).toHaveAttribute('aria-valuemax');
});

// Keyboard navigation test
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();

  await slider.focus();
  const initialValue = await slider.getAttribute('aria-valuenow');

  await page.keyboard.press('ArrowRight');
  const newValue = await slider.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBeGreaterThan(Number(initialValue));

  await page.keyboard.press('Home');
  const minValue = await slider.getAttribute('aria-valuemin');
  await expect(slider).toHaveAttribute('aria-valuenow', minValue);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();
  await slider.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="slider"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,

  // --- Native HTML Considerations ---
  nativeHtmlConsiderations: {
    recommendation: {
      en: 'Before using this custom component, consider using native <code>&lt;input type="range"&gt;</code> elements. They provide built-in keyboard support, work without JavaScript, and have native accessibility support.',
      ja: 'このカスタムコンポーネントを使用する前に、ネイティブの<code>&lt;input type="range"&gt;</code>要素の使用を検討してください。組み込みのキーボードサポート、JavaScriptなしでの動作、ネイティブのアクセシビリティサポートを提供します。',
    },
    codeExample: `<label for="volume">Volume</label>
<input type="range" id="volume" min="0" max="100" value="50">`,
    benefits: {
      en: 'Use custom implementations only when you need custom styling that native elements cannot provide, or when you require specific visual feedback during interactions.',
      ja: 'ネイティブ要素では提供できないカスタムスタイリングが必要な場合、またはインタラクション中に特定の視覚的フィードバックが必要な場合にのみ、カスタム実装を使用してください。',
    },
  },

  nativeVsCustom: [
    {
      useCase: { en: 'Basic value selection', ja: '基本的な値の選択' },
      native: { en: 'Recommended', ja: '推奨' },
      custom: { en: 'Not needed', ja: '不要' },
      nativeRecommended: true,
    },
    {
      useCase: { en: 'Keyboard support', ja: 'キーボードサポート' },
      native: { en: 'Built-in', ja: '組み込み' },
      custom: { en: 'Manual implementation', ja: '手動実装' },
      nativeRecommended: true,
    },
    {
      useCase: { en: 'JavaScript disabled support', ja: 'JavaScript無効時のサポート' },
      native: { en: 'Works natively', ja: 'ネイティブで動作' },
      custom: { en: 'Requires fallback', ja: 'フォールバック必要' },
      nativeRecommended: true,
    },
    {
      useCase: { en: 'Form integration', ja: 'フォーム統合' },
      native: { en: 'Built-in', ja: '組み込み' },
      custom: { en: 'Manual implementation', ja: '手動実装' },
      nativeRecommended: true,
    },
    {
      useCase: { en: 'Custom styling', ja: 'カスタムスタイリング' },
      native: { en: 'Limited (pseudo-elements)', ja: '限定的（疑似要素）' },
      custom: { en: 'Full control', ja: '完全な制御' },
      nativeRecommended: false,
    },
    {
      useCase: {
        en: 'Consistent cross-browser appearance',
        ja: 'ブラウザ間で一貫した外観',
      },
      native: { en: 'Varies significantly', ja: '大きく異なる' },
      custom: { en: 'Consistent', ja: '一貫性あり' },
      nativeRecommended: false,
    },
    {
      useCase: { en: 'Vertical orientation', ja: '垂直方向' },
      native: { en: 'Limited browser support', ja: '限定的なブラウザサポート' },
      custom: { en: 'Full control', ja: '完全な制御' },
      nativeRecommended: false,
    },
  ],

  nativeHtmlFootnote: {
    en: 'Native <code>&lt;input type="range"&gt;</code> styling is notoriously inconsistent across browsers. Styling requires vendor-specific pseudo-elements (<code>::-webkit-slider-thumb</code>, <code>::-moz-range-thumb</code>, etc.) which can be complex to maintain.',
    ja: 'ネイティブの<code>&lt;input type="range"&gt;</code>のスタイリングは、ブラウザ間で一貫性がないことで知られています。スタイリングにはベンダー固有の疑似要素（<code>::-webkit-slider-thumb</code>、<code>::-moz-range-thumb</code>など）が必要で、メンテナンスが複雑になる可能性があります。',
  },
};
