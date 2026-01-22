import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const meterAccessibilityData: PatternAccessibilityData = {
  pattern: 'meter',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/meter/',

  overview: {
    en: 'A meter displays a numeric value within a defined range as a graphical gauge. Used for battery level, storage usage, CPU load, etc. Non-interactive (no keyboard/focus management required).',
    ja: 'メーターは、定義された範囲内の数値をグラフィカルなゲージとして表示します。バッテリーレベル、ストレージ使用量、CPU負荷などに使用されます。インタラクティブではありません（キーボード/フォーカス管理は不要）。',
  },

  // Native HTML considerations for meter
  nativeHtmlConsiderations: [
    { useCase: 'Simple value display', recommended: 'Native <meter>' },
    { useCase: 'Custom styling needed', recommended: 'Custom role="meter"' },
    { useCase: 'low/high/optimum thresholds', recommended: 'Native <meter>' },
    { useCase: 'Full visual control', recommended: 'Custom implementation' },
  ],

  nativeVsCustom: [
    {
      feature: 'Basic value display',
      native: 'Recommended',
      custom: 'Not needed',
    },
    {
      feature: 'JavaScript disabled support',
      native: 'Works natively',
      custom: 'Requires fallback',
    },
    {
      feature: 'low/high/optimum thresholds',
      native: 'Built-in support',
      custom: 'Manual implementation',
    },
    {
      feature: 'Custom styling',
      native: 'Limited (browser-dependent)',
      custom: 'Full control',
    },
    {
      feature: 'Consistent cross-browser appearance',
      native: 'Varies by browser',
      custom: 'Consistent',
    },
    {
      feature: 'Dynamic value updates',
      native: 'Works natively',
      custom: 'Full control',
    },
  ],

  roles: [
    {
      name: 'meter',
      element: {
        en: 'Container element',
        ja: 'コンテナ要素',
      },
      description: {
        en: 'Identifies the element as a meter displaying a scalar value within a known range.',
        ja: '既知の範囲内のスカラー値を表示するメーターとして要素を識別します。',
      },
      required: true,
    },
  ],

  properties: [
    {
      attribute: 'aria-valuenow',
      element: {
        en: 'Meter element',
        ja: 'メーター要素',
      },
      values: {
        en: 'Number (current value)',
        ja: '数値（現在の値）',
      },
      required: true,
      notes: {
        en: 'Must be between aria-valuemin and aria-valuemax',
        ja: 'aria-valueminとaria-valuemaxの間である必要があります',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuenow',
    },
    {
      attribute: 'aria-valuemin',
      element: {
        en: 'Meter element',
        ja: 'メーター要素',
      },
      values: {
        en: 'Number (default: 0)',
        ja: '数値（デフォルト: 0）',
      },
      required: true,
      notes: {
        en: 'Specifies the minimum allowed value for the meter',
        ja: 'メーターの最小許容値を指定します',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemin',
    },
    {
      attribute: 'aria-valuemax',
      element: {
        en: 'Meter element',
        ja: 'メーター要素',
      },
      values: {
        en: 'Number (default: 100)',
        ja: '数値（デフォルト: 100）',
      },
      required: true,
      notes: {
        en: 'Specifies the maximum allowed value for the meter',
        ja: 'メーターの最大許容値を指定します',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemax',
    },
    {
      attribute: 'aria-valuetext',
      element: {
        en: 'Meter element',
        ja: 'メーター要素',
      },
      values: {
        en: 'String (e.g., "75% complete")',
        ja: '文字列（例: "75% complete"）',
      },
      required: false,
      notes: {
        en: "Provides a human-readable text alternative for the current value. Use when the numeric value alone doesn't convey sufficient meaning.",
        ja: '現在の値に対する人間が読みやすいテキストの代替を提供します。数値だけでは十分な意味を伝えられない場合に使用します。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuetext',
    },
    {
      attribute: 'aria-label',
      element: {
        en: 'Meter element',
        ja: 'メーター要素',
      },
      values: {
        en: 'String',
        ja: '文字列',
      },
      required: {
        en: 'Conditional (required if no visible label)',
        ja: '条件付き（表示されるラベルがない場合は必須）',
      },
      notes: {
        en: 'Provides an invisible label for the meter',
        ja: 'メーターに見えないラベルを提供します',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: {
        en: 'Meter element',
        ja: 'メーター要素',
      },
      values: {
        en: 'ID reference',
        ja: 'ID参照',
      },
      required: {
        en: 'Conditional (required if visible label exists)',
        ja: '条件付き（表示されるラベルが存在する場合は必須）',
      },
      notes: {
        en: 'References an external element as the label',
        ja: '外部要素をラベルとして参照します',
      },
    },
  ],

  // No keyboard support - meter is display-only
  keyboardSupport: [],

  // No focus management - meter should not receive focus by default
  focusManagement: [],

  // Additional notes about accessible naming
  additionalNotes: [
    {
      en: 'Meters must have an accessible name. This can be provided through a visible label using the label prop, aria-label for an invisible label, or aria-labelledby to reference an external element.',
      ja: 'メーターはアクセシブルな名前を持つ必要があります。これはlabelプロパティを使用した表示されるラベル、見えないラベルのためのaria-label、または外部要素を参照するaria-labelledbyによって提供できます。',
    },
    {
      en: 'The meter role is used for graphical displays of numeric values within a defined range. It is not interactive and should not receive focus by default.',
      ja: 'meterロールは、定義された範囲内の数値のグラフィカル表示に使用されます。インタラクティブではないため、デフォルトではフォーカスを受け取るべきではありません。',
    },
  ],

  visualDesign: [
    {
      en: 'Visual fill bar - Proportionally represents the current value',
      ja: '視覚的な塗りつぶしバー - 現在の値を比例的に表現',
    },
    {
      en: 'Numeric display - Optional text showing the current value',
      ja: '数値表示 - 現在の値を示すオプションのテキスト',
    },
    {
      en: "Visible label - Optional label identifying the meter's purpose",
      ja: '表示されるラベル - メーターの目的を識別するオプションのラベル',
    },
    {
      en: 'Forced colors mode - Uses system colors for accessibility in Windows High Contrast Mode',
      ja: '強制カラーモード - Windowsハイコントラストモードでのアクセシビリティのためにシステムカラーを使用',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA APG: Meter Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/meter/',
    },
    {
      title: 'MDN: <meter> element',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meter',
    },
    { title: 'W3C ARIA: meter role', url: 'https://w3c.github.io/aria/#meter' },
  ],

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
            en: 'ARIA attributes (role="meter", aria-valuenow, aria-valuemin, aria-valuemax)',
            ja: 'ARIA属性（role="meter"、aria-valuenow、aria-valuemin、aria-valuemax）',
          },
          {
            en: 'Value clamping behavior',
            ja: '値のクランプ動作',
          },
          {
            en: 'Accessible name handling',
            ja: 'アクセシブルな名前の処理',
          },
          {
            en: 'Accessibility via jest-axe',
            ja: 'jest-axeによるアクセシビリティ検証',
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
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover value display and cross-framework consistency.',
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストは値の表示とフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          {
            en: 'ARIA structure in live browser',
            ja: 'ライブブラウザでのARIA構造',
          },
          {
            en: 'Non-interactive behavior verification',
            ja: '非インタラクティブな動作の検証',
          },
          {
            en: 'Value display correctness',
            ja: '値の表示の正確性',
          },
          {
            en: 'axe-core accessibility scanning',
            ja: 'axe-coreによるアクセシビリティスキャン',
          },
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
        title: {
          en: 'ARIA Attributes',
          ja: 'ARIA 属性',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="meter"',
            description: { en: 'Element has the meter role', ja: '要素が meter ロールを持つ' },
          },
          {
            name: 'aria-valuenow',
            description: {
              en: 'Current value is correctly set',
              ja: '現在の値が正しく設定されている',
            },
          },
          {
            name: 'aria-valuemin',
            description: {
              en: 'Minimum value is set (default: 0)',
              ja: '最小値が設定されている（デフォルト: 0）',
            },
          },
          {
            name: 'aria-valuemax',
            description: {
              en: 'Maximum value is set (default: 100)',
              ja: '最大値が設定されている（デフォルト: 100）',
            },
          },
          {
            name: 'aria-valuetext',
            description: {
              en: 'Human-readable text is set when provided',
              ja: '提供された場合、人間が読めるテキストが設定されている',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Accessible Name',
          ja: 'アクセシブルな名前',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-label',
            description: {
              en: 'Accessible name via aria-label attribute',
              ja: 'aria-label 属性によるアクセシブルな名前',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Accessible name via external element reference',
              ja: '外部要素参照によるアクセシブルな名前',
            },
          },
          {
            name: 'visible label',
            description: {
              en: 'Visible label provides accessible name',
              ja: '表示されるラベルがアクセシブルな名前を提供する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Value Clamping',
          ja: '値のクランプ',
        },
        testType: 'Unit',
        items: [
          {
            name: 'clamp above max',
            description: {
              en: 'Values above max are clamped to max',
              ja: '最大値を超える値が最大値にクランプされる',
            },
          },
          {
            name: 'clamp below min',
            description: {
              en: 'Values below min are clamped to min',
              ja: '最小値を下回る値が最小値にクランプされる',
            },
          },
          {
            name: 'no clamp',
            description: {
              en: 'Clamping can be disabled with clamp=false',
              ja: 'clamp=false でクランプを無効化できる',
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
              en: 'No accessibility violations detected by axe-core',
              ja: 'axe-core によってアクセシビリティ違反が検出されない',
            },
          },
          {
            name: 'focus behavior',
            description: { en: 'Not focusable by default', ja: 'デフォルトではフォーカス不可' },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Edge Cases',
          ja: 'エッジケース',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'decimal values',
            description: { en: 'Handles decimal values correctly', ja: '小数値を正しく処理する' },
          },
          {
            name: 'negative range',
            description: {
              en: 'Handles negative min/max ranges',
              ja: '負の最小/最大範囲を処理する',
            },
          },
          {
            name: 'large values',
            description: { en: 'Handles large numeric values', ja: '大きな数値を処理する' },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'HTML Attribute Inheritance',
          ja: 'HTML 属性の継承',
        },
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
            description: { en: 'ID attribute is set correctly', ja: 'ID 属性が正しく設定される' },
          },
          {
            name: 'data-*',
            description: { en: 'Data attributes are passed through', ja: 'データ属性が渡される' },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'Cross-framework Consistency',
          ja: 'フレームワーク間の一貫性',
        },
        testType: 'E2E',
        items: [
          {
            name: 'Same meter count',
            description: {
              en: 'React, Vue, Svelte, Astro all render same number of meters',
              ja: 'React、Vue、Svelte、Astroすべてが同じ数のメーターをレンダリング',
            },
          },
          {
            name: 'Consistent ARIA attributes',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: 'すべてのフレームワークで一貫したARIA構造',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/meter.spec.ts',
    commands: [
      {
        comment: { en: 'Run all unit tests', ja: 'すべてのユニットテストを実行' },
        command: 'npm run test:unit',
      },
      { comment: { en: 'Run E2E tests', ja: 'E2Eテストを実行' }, command: 'npm run test:e2e' },
      {
        comment: { en: 'Run Meter pattern E2E tests', ja: 'Meterパターンの E2E テストを実行' },
        command: 'npm run test:e2e:pattern --pattern=meter',
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
    { description: 'role="meter" exists', priority: 'high', category: 'aria' },
    { description: 'aria-valuenow set to current value', priority: 'high', category: 'aria' },
    {
      description: 'aria-valuemin always set (even with default)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-valuemax always set (even with default)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Accessible name required (label/aria-label/aria-labelledby)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-valuetext set when valueText or format provided',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Value clamped to min/max range when clamp=true',
      priority: 'high',
      category: 'aria',
    },
    { description: 'No axe-core violations', priority: 'high', category: 'accessibility' },
    { description: 'Not focusable by default (no tabIndex)', priority: 'high', category: 'focus' },
    { description: 'Decimal values handled correctly', priority: 'medium', category: 'aria' },
    { description: 'Negative min/max range works', priority: 'medium', category: 'aria' },
    { description: "Large values don't break display", priority: 'medium', category: 'aria' },
    { description: 'valueText overrides format', priority: 'medium', category: 'aria' },
    { description: 'tabIndex opt-in makes it focusable', priority: 'medium', category: 'focus' },
  ],

  implementationNotes: `### Props Design (Exclusive Types)

\`\`\`typescript
// Label: one of these required (exclusive)
type LabelProps =
  | { label: string; 'aria-label'?: never; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label': string; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label'?: never; 'aria-labelledby': string };

// ValueText: exclusive with format
type ValueTextProps =
  | { valueText: string; format?: never }
  | { valueText?: never; format?: string }
  | { valueText?: never; format?: never };

export type MeterProps = {
  value: number;
  min?: number;      // default: 0
  max?: number;      // default: 100
  clamp?: boolean;   // default: true
  showValue?: boolean; // default: true
  id?: string;
  className?: string;
  tabIndex?: number;
  'aria-describedby'?: string;
} & LabelProps & ValueTextProps;
\`\`\`

### Structure

\`\`\`
┌─────────────────────────────────────────────────────────┐
│ <div> role="meter"                                      │
│   aria-valuenow="75"                                    │
│   aria-valuemin="0"                                     │
│   aria-valuemax="100"                                   │
│   aria-valuetext="75%"                                  │
│   aria-label="CPU Usage"                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ <span> label (if visible)                           │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ <div> class="meter-track" aria-hidden="true"        │ │
│ │   <div> class="meter-fill" style="width: 75%"       │ │
│ └─────────────────────────────────────────────────────┘ │
│ <span> class="meter-value" aria-hidden="true">75%</span>│
└─────────────────────────────────────────────────────────┘
\`\`\`

### Value Clamping

\`\`\`typescript
const clampNumber = (value: number, min: number, max: number, clamp: boolean) => {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return value; // Let validation handle non-finite
  }
  return clamp ? Math.min(max, Math.max(min, value)) : value;
};
\`\`\`

### Format Prop

The \`format\` prop accepts a string pattern for displaying values. Available placeholders:
- \`{value}\` - Current value
- \`{min}\` - Minimum value
- \`{max}\` - Maximum value

\`\`\`typescript
// Examples
<Meter value={75} format="{value}%" />           // "75%"
<Meter value={3} max={5} format="{value} of {max}" />   // "3 of 5"
\`\`\`

### Common Pitfalls

1. **Missing accessible name**: Always require label, aria-label, or aria-labelledby
2. **Conflicting props**: Use TypeScript exclusive types to prevent aria-valuenow override via rest props
3. **Visual-ARIA mismatch**: Ensure visual bar width matches aria-valuenow percentage
4. **Non-finite values**: Validate and warn on NaN/Infinity`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Role test
it('has role="meter"', () => {
  render(<Meter value={50} aria-label="Progress" />);
  expect(screen.getByRole('meter')).toBeInTheDocument();
});

// ARIA values test
it('has correct aria-valuenow/min/max', () => {
  render(<Meter value={75} min={0} max={100} aria-label="CPU" />);
  const meter = screen.getByRole('meter');
  expect(meter).toHaveAttribute('aria-valuenow', '75');
  expect(meter).toHaveAttribute('aria-valuemin', '0');
  expect(meter).toHaveAttribute('aria-valuemax', '100');
});

// Clamping test
it('clamps value to min/max range', () => {
  render(<Meter value={150} min={0} max={100} aria-label="Progress" />);
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100');
});

// aria-valuetext test
it('sets aria-valuetext when valueText provided', () => {
  render(<Meter value={75} valueText="75 percent" aria-label="Progress" />);
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '75 percent');
});

// format test
it('uses format for aria-valuetext', () => {
  render(<Meter value={75} min={0} max={100} format="{value}%" aria-label="Progress" />);
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '75%');
});

// Not focusable by default
it('is not focusable by default', () => {
  render(<Meter value={50} aria-label="Progress" />);
  expect(screen.getByRole('meter')).not.toHaveAttribute('tabindex');
});

// axe test
it('has no axe violations', async () => {
  const { container } = render(<Meter value={50} aria-label="Progress" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Negative range test
it('handles negative min/max range', () => {
  render(<Meter value={0} min={-50} max={50} aria-label="Temperature" />);
  const meter = screen.getByRole('meter');
  expect(meter).toHaveAttribute('aria-valuenow', '0');
  expect(meter).toHaveAttribute('aria-valuemin', '-50');
  expect(meter).toHaveAttribute('aria-valuemax', '50');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/meter/react/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA attributes', async ({ page }) => {
  const meters = page.locator('[role="meter"]');
  const count = await meters.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const meter = meters.nth(i);

    // Required attributes
    const valueNow = await meter.getAttribute('aria-valuenow');
    const valueMin = await meter.getAttribute('aria-valuemin');
    const valueMax = await meter.getAttribute('aria-valuemax');

    expect(valueNow).not.toBeNull();
    expect(valueMin).not.toBeNull();
    expect(valueMax).not.toBeNull();

    // Value should be within range
    expect(Number(valueNow)).toBeGreaterThanOrEqual(Number(valueMin));
    expect(Number(valueNow)).toBeLessThanOrEqual(Number(valueMax));

    // Must have accessible name
    const ariaLabel = await meter.getAttribute('aria-label');
    const ariaLabelledby = await meter.getAttribute('aria-labelledby');
    expect(ariaLabel !== null || ariaLabelledby !== null).toBe(true);
  }
});

// Non-interactive behavior test
test('is not focusable by default', async ({ page }) => {
  const meters = page.locator('[role="meter"]');
  const count = await meters.count();

  for (let i = 0; i < count; i++) {
    const meter = meters.nth(i);
    const tabindex = await meter.getAttribute('tabindex');
    // Should not have tabindex, or if present should be -1
    if (tabindex !== null) {
      expect(Number(tabindex)).toBe(-1);
    }
  }
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.locator('[role="meter"]').first().waitFor();
  const results = await new AxeBuilder({ page }).include('[role="meter"]').analyze();
  expect(results.violations).toEqual([]);
});`,
};
