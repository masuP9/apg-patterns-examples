import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const tooltipAccessibilityData: PatternAccessibilityData = {
  pattern: 'tooltip',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/',
  overview: {
    en: 'A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    ja: 'ツールチップは、要素がキーボードフォーカスを受け取ったときまたはマウスがその上にホバーしたときに、その要素に関連する情報を表示するポップアップです。',
  },
  workInProgress: {
    en: 'The APG Tooltip pattern is currently marked as "work in progress" by the WAI. This implementation follows the documented guidelines, but the specification may evolve.',
    ja: 'APG Tooltipパターンは現在WAIによって「作業中」とマークされています。この実装は文書化されたガイドラインに従っていますが、仕様は進化する可能性があります。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'tooltip',
      element: {
        en: 'Tooltip popup',
        ja: 'ツールチップポップアップ',
      },
      description: {
        en: 'A contextual popup that displays a description for an element',
        ja: '要素の説明を表示するコンテキストポップアップ',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-describedby',
      element: {
        en: 'Trigger element (wrapper)',
        ja: 'トリガー要素（ラッパー）',
      },
      values: 'ID of tooltip',
      required: {
        en: 'Conditional',
        ja: '条件付き',
      },
      notes: {
        en: 'Only when tooltip is visible. References the tooltip element to provide an accessible description for the trigger element.',
        ja: 'ツールチップが表示されている時のみ。トリガー要素にアクセシブルな説明を提供するために、ツールチップ要素を参照します。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-describedby',
    },
    {
      attribute: 'aria-hidden',
      element: {
        en: 'Tooltip element',
        ja: 'ツールチップ要素',
      },
      values: '`true` | `false`',
      required: false,
      notes: {
        en: 'Indicates whether the tooltip is hidden from assistive technology. Default is true.',
        ja: 'ツールチップが支援技術から隠されているかどうかを示します。デフォルトはtrue。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-hidden',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Escape',
      action: {
        en: 'Closes the tooltip',
        ja: 'ツールチップを閉じる',
      },
    },
    {
      key: 'Tab',
      action: {
        en: 'Standard focus navigation; tooltip shows when trigger receives focus',
        ja: '標準のフォーカスナビゲーション。トリガーがフォーカスを受け取るとツールチップが表示される',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: {
        en: 'Tooltip display',
        ja: 'ツールチップ表示',
      },
      behavior: {
        en: 'Tooltip never receives focus - Per APG, tooltips must not be focusable. If interactive content is needed, use a Dialog or Popover pattern instead.',
        ja: 'ツールチップはフォーカスを受け取らない - APGに従い、ツールチップはフォーカス可能であってはいけません。インタラクティブなコンテンツが必要な場合は、DialogまたはPopoverパターンを使用してください。',
      },
    },
    {
      event: {
        en: 'Trigger focus',
        ja: 'トリガーフォーカス',
      },
      behavior: {
        en: 'Focus triggers display - When the trigger element receives focus, the tooltip appears after the configured delay.',
        ja: 'フォーカスが表示をトリガーする - トリガー要素がフォーカスを受け取ると、設定された遅延後にツールチップが表示されます。',
      },
    },
    {
      event: {
        en: 'Trigger blur',
        ja: 'トリガーぼかし',
      },
      behavior: {
        en: 'Blur hides tooltip - When focus leaves the trigger element, the tooltip is hidden.',
        ja: 'ぼかしがツールチップを非表示にする - フォーカスがトリガー要素を離れると、ツールチップは非表示になります。',
      },
    },
  ],

  // --- Mouse/Pointer Behavior ---

  mousePointerBehavior: [
    {
      en: '**Hover triggers display** - Moving the pointer over the trigger shows the tooltip after the delay.',
      ja: '**ホバーが表示をトリガーする** - ポインターをトリガー上に移動すると、遅延後にツールチップが表示されます。',
    },
    {
      en: '**Pointer leave hides** - Moving the pointer away from the trigger hides the tooltip.',
      ja: '**ポインター離脱で非表示** - ポインターをトリガーから離すと、ツールチップが非表示になります。',
    },
  ],

  // --- Visual Design ---

  visualDesign: [
    {
      en: '**High contrast** - Dark background with light text ensures readability',
      ja: '**高コントラスト** - 暗い背景に明るいテキストで可読性を確保',
    },
    {
      en: '**Dark mode support** - Colors invert appropriately in dark mode',
      ja: '**ダークモード対応** - ダークモードで色が適切に反転',
    },
    {
      en: '**Positioned near trigger** - Tooltip appears adjacent to the triggering element',
      ja: '**トリガーの近くに配置** - ツールチップはトリガー要素に隣接して表示',
    },
    {
      en: '**Configurable delay** - Prevents accidental activation during cursor movement',
      ja: '**設定可能な遅延** - カーソル移動中の誤作動を防止',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA tooltip role',
      url: 'https://w3c.github.io/aria/#tooltip',
    },
  ],

  // --- Testing Documentation ---

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
            en: 'ARIA attributes (role, aria-describedby, aria-hidden)',
            ja: 'ARIA属性（role、aria-describedby、aria-hidden）',
          },
          {
            en: 'Keyboard interaction (Escape key dismissal)',
            ja: 'キーボード操作（Escapeキーでの解除）',
          },
          {
            en: 'Show/hide behavior on focus and blur',
            ja: 'フォーカス/ぼかし時の表示/非表示動作',
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
            en: 'Hover interactions with delay timing',
            ja: '遅延タイミングを伴うホバー操作',
          },
          {
            en: 'Focus/blur interactions',
            ja: 'フォーカス/ぼかし操作',
          },
          {
            en: 'Escape key dismissal',
            ja: 'Escapeキーでの解除',
          },
          {
            en: 'ARIA structure validation in live browser',
            ja: 'ライブブラウザでのARIA構造検証',
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
          en: 'APG ARIA Structure',
          ja: 'APG ARIA構造',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="tooltip"',
            description: {
              en: 'Tooltip container must have tooltip role',
              ja: 'ツールチップコンテナはtooltipロールを持つ必要がある',
            },
          },
          {
            name: 'aria-hidden',
            description: {
              en: 'Hidden tooltips must have aria-hidden="true"',
              ja: '非表示のツールチップはaria-hidden="true"を持つ必要がある',
            },
          },
          {
            name: 'aria-describedby',
            description: {
              en: 'Trigger references tooltip when visible',
              ja: 'トリガーは表示時にツールチップを参照する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Show/Hide Behavior',
          ja: '表示/非表示動作',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Hover shows',
            description: {
              en: 'Shows tooltip on mouse hover after delay',
              ja: 'マウスホバー後、遅延してツールチップを表示',
            },
          },
          {
            name: 'Focus shows',
            description: {
              en: 'Shows tooltip on keyboard focus',
              ja: 'キーボードフォーカスでツールチップを表示',
            },
          },
          {
            name: 'Blur hides',
            description: {
              en: 'Hides tooltip on focus loss',
              ja: 'フォーカスを失うとツールチップを非表示',
            },
          },
          {
            name: 'Mouseleave hides',
            description: {
              en: 'Hides tooltip when mouse leaves trigger',
              ja: 'マウスがトリガーから離れるとツールチップを非表示',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Keyboard Interaction',
          ja: 'キーボード操作',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Escape',
            description: {
              en: 'Closes tooltip on Escape key',
              ja: 'Escapeキーでツールチップを閉じる',
            },
          },
          {
            name: 'Focus retention',
            description: {
              en: 'Focus remains on trigger after Escape',
              ja: 'Escape後もトリガーにフォーカスが残る',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Disabled State',
          ja: '無効化状態',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Disabled no show',
            description: {
              en: 'Disabled tooltip does not show on hover',
              ja: '無効化されたツールチップはホバーしても表示されない',
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
            name: 'axe violations (hidden)',
            description: {
              en: 'No WCAG 2.1 AA violations when tooltip hidden',
              ja: 'ツールチップ非表示時にWCAG 2.1 AA違反がないこと',
            },
          },
          {
            name: 'axe violations (visible)',
            description: {
              en: 'No WCAG 2.1 AA violations when tooltip visible',
              ja: 'ツールチップ表示時にWCAG 2.1 AA違反がないこと',
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
            name: 'All frameworks have tooltips',
            description: {
              en: 'React, Vue, Svelte, Astro all render tooltip elements',
              ja: 'React、Vue、Svelte、Astro全てがtooltip要素をレンダリング',
            },
          },
          {
            name: 'Show on hover',
            description: {
              en: 'All frameworks show tooltip on hover',
              ja: '全フレームワークでホバー時にツールチップを表示',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: '全フレームワークで一貫したARIA構造',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/tooltip.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Tooltip', ja: 'Tooltipのユニットテストを実行' },
        command: 'npm run test -- tooltip',
      },
      {
        comment: {
          en: 'Run E2E tests for Tooltip (all frameworks)',
          ja: 'TooltipのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=tooltip',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークのE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=tooltip',
      },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:vue:pattern --pattern=tooltip' },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:svelte:pattern --pattern=tooltip' },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:astro:pattern --pattern=tooltip' },
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

  // --- llm.md Specific Data ---

  testChecklist: [
    // Keyboard - High Priority
    { description: 'Escape closes tooltip', priority: 'high', category: 'keyboard' },
    { description: 'Tooltip appears on trigger focus', priority: 'high', category: 'keyboard' },
    { description: 'Tooltip hides on trigger blur', priority: 'high', category: 'keyboard' },
    // ARIA - High Priority
    { description: 'Tooltip has `role="tooltip"`', priority: 'high', category: 'aria' },
    {
      description: 'Trigger has `aria-describedby` when tooltip visible',
      priority: 'high',
      category: 'aria',
    },
    {
      description: '`aria-describedby` removed when tooltip hidden',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Tooltip has correct `aria-hidden` state', priority: 'high', category: 'aria' },
    // Focus Management - High Priority
    { description: 'Tooltip is NOT focusable', priority: 'high', category: 'focus' },
    {
      description: 'Focus stays on trigger when tooltip shows',
      priority: 'high',
      category: 'focus',
    },
    {
      description: 'Tab moves to next element (not into tooltip)',
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

  implementationNotes: `### Important Constraints

1. **Tooltip never receives focus** - Must not be focusable
2. **No interactive content** - Use Dialog/Popover if interaction needed
3. **Configurable delay** - Prevents accidental activation

### Structure

\`\`\`
        ┌─────────────────┐
        │ Tooltip content │  ← role="tooltip", id="tip-1"
        └────────┬────────┘
                 │
    ┌────────────▼────────────┐
    │ [Trigger Element]       │  ← aria-describedby="tip-1" (when visible)
    └─────────────────────────┘
\`\`\`

### State Flow

1. Initial: tooltip hidden, aria-describedby absent
2. Focus/Hover: tooltip visible, aria-describedby set
3. Blur/Leave/Escape: tooltip hidden, aria-describedby removed

### Do NOT

- Put focusable elements in tooltip
- Make tooltip itself focusable
- Use for content requiring interaction`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Show on focus
it('shows tooltip on focus', async () => {
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  trigger.focus();

  expect(await screen.findByRole('tooltip')).toBeVisible();
});

// Escape closes
it('closes on Escape', async () => {
  const user = userEvent.setup();
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  trigger.focus();
  await screen.findByRole('tooltip');

  await user.keyboard('{Escape}');

  expect(screen.queryByRole('tooltip')).not.toBeVisible();
});

// aria-describedby test
it('sets aria-describedby when visible', async () => {
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  expect(trigger).not.toHaveAttribute('aria-describedby');

  trigger.focus();
  const tooltip = await screen.findByRole('tooltip');

  expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('tooltip has role="tooltip" and aria-describedby linkage', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  // Hover to show tooltip
  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });
  await expect(tooltip).toHaveRole('tooltip');

  // Check aria-describedby linkage
  const tooltipId = await tooltip.getAttribute('id');
  await expect(trigger).toHaveAttribute('aria-describedby', tooltipId!);
});

// Keyboard interaction test
test('hides tooltip on Escape key', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });

  await page.keyboard.press('Escape');
  await expect(tooltip).not.toBeVisible();
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  // Show tooltip
  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });

  const results = await new AxeBuilder({ page })
    .include('.apg-tooltip-trigger')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
