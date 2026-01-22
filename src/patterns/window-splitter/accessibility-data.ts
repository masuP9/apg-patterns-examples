import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const windowSplitterAccessibilityData: PatternAccessibilityData = {
  pattern: 'window-splitter',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/',

  overview: {
    en: 'A window splitter is a movable separator between two panes that allows users to change the relative size of each pane. Used in IDEs, file browsers, and resizable layouts.',
    ja: 'ウィンドウスプリッターは、2つのペイン間で移動可能なセパレーターであり、ユーザーが各ペインの相対的なサイズを変更できます。IDE、ファイルブラウザ、リサイズ可能なレイアウトで使用されます。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'separator',
      element: { en: 'Splitter element', ja: 'スプリッター要素' },
      description: {
        en: 'Focusable separator that controls pane size',
        ja: 'ペインサイズを制御するフォーカス可能なセパレーター',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-valuenow',
      element: { en: 'separator', ja: 'separator' },
      values: '0-100',
      required: true,
      notes: {
        en: 'Primary pane size as percentage',
        ja: 'プライマリペインのサイズ（パーセンテージ）',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuenow',
    },
    {
      attribute: 'aria-valuemin',
      element: { en: 'separator', ja: 'separator' },
      values: 'number',
      required: true,
      notes: { en: 'Minimum value (default: 10)', ja: '最小値（デフォルト: 10）' },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemin',
    },
    {
      attribute: 'aria-valuemax',
      element: { en: 'separator', ja: 'separator' },
      values: 'number',
      required: true,
      notes: { en: 'Maximum value (default: 90)', ja: '最大値（デフォルト: 90）' },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemax',
    },
    {
      attribute: 'aria-controls',
      element: { en: 'separator', ja: 'separator' },
      values: 'ID reference(s)',
      required: true,
      notes: {
        en: 'Primary pane ID (+ secondary pane ID optional)',
        ja: 'プライマリペインのID（+ セカンダリペインのIDは任意）',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-controls',
    },
    {
      attribute: 'aria-label',
      element: { en: 'separator', ja: 'separator' },
      values: 'string',
      required: {
        en: 'Conditional (required if no aria-labelledby)',
        ja: '条件付き（aria-labelledbyがない場合は必須）',
      },
      notes: { en: 'Accessible name', ja: 'アクセシブルな名前' },
      specUrl: 'https://w3c.github.io/aria/#aria-label',
    },
    {
      attribute: 'aria-labelledby',
      element: { en: 'separator', ja: 'separator' },
      values: 'ID reference',
      required: {
        en: 'Conditional (required if no aria-label)',
        ja: '条件付き（aria-labelがない場合は必須）',
      },
      notes: {
        en: 'Reference to visible label element',
        ja: '表示されるラベル要素への参照',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-labelledby',
    },
    {
      attribute: 'aria-orientation',
      element: { en: 'separator', ja: 'separator' },
      values: '"horizontal" | "vertical"',
      required: false,
      notes: {
        en: 'Default: horizontal (left-right split)',
        ja: 'デフォルト: horizontal（左右分割）',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-orientation',
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'separator', ja: 'separator' },
      values: 'true | false',
      required: false,
      notes: { en: 'Disabled state', ja: '無効状態' },
      specUrl: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  states: [
    {
      attribute: 'aria-valuenow',
      element: { en: 'separator element', ja: 'separator要素' },
      values: {
        en: '0-100 (0 = collapsed, 50 = half, 100 = fully expanded)',
        ja: '0-100（0 = 折り畳み、50 = 半分、100 = 完全展開）',
      },
      required: true,
      changeTrigger: {
        en: 'Arrow keys, Home/End, Enter (collapse/expand), pointer drag',
        ja: '矢印キー、Home/End、Enter（折り畳み/展開）、ポインタードラッグ',
      },
      reference: 'https://w3c.github.io/aria/#aria-valuenow',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Arrow Right / Arrow Left',
      action: {
        en: 'Move horizontal splitter (increase/decrease)',
        ja: '水平スプリッターを移動（増加/減少）',
      },
    },
    {
      key: 'Arrow Up / Arrow Down',
      action: {
        en: 'Move vertical splitter (increase/decrease)',
        ja: '垂直スプリッターを移動（増加/減少）',
      },
    },
    {
      key: 'Shift + Arrow',
      action: {
        en: 'Move by large step (default: 10%)',
        ja: '大きなステップで移動（デフォルト: 10%）',
      },
    },
    {
      key: 'Home',
      action: { en: 'Move to minimum position', ja: '最小位置に移動' },
    },
    {
      key: 'End',
      action: { en: 'Move to maximum position', ja: '最大位置に移動' },
    },
    {
      key: 'Enter',
      action: {
        en: 'Toggle collapse/expand primary pane',
        ja: 'プライマリペインの折り畳み/展開を切り替え',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Tab', ja: 'Tab' },
      behavior: {
        en: 'Splitter receives focus via normal tab order',
        ja: 'スプリッターは通常のタブ順序でフォーカスを受け取る',
      },
    },
    {
      event: { en: 'Disabled', ja: '無効時' },
      behavior: {
        en: 'Splitter is not focusable (tabindex="-1")',
        ja: 'スプリッターはフォーカス不可（tabindex="-1"）',
      },
    },
    {
      event: { en: 'Readonly', ja: '読み取り専用時' },
      behavior: {
        en: 'Splitter is focusable but not operable',
        ja: 'スプリッターはフォーカス可能だが操作不可',
      },
    },
    {
      event: { en: 'After collapse/expand', ja: '折り畳み/展開後' },
      behavior: {
        en: 'Focus remains on splitter',
        ja: 'フォーカスはスプリッターに残る',
      },
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Arrow keys are direction-restricted based on orientation. Horizontal splitters only respond to Left/Right, vertical splitters only to Up/Down.',
      ja: '矢印キーは向きに基づいて方向が制限されます。水平スプリッターはLeft/Rightのみに、垂直スプリッターはUp/Downのみに応答します。',
    },
    {
      en: 'In RTL mode, ArrowLeft increases and ArrowRight decreases for horizontal splitters.',
      ja: 'RTLモードでは、水平スプリッターでArrowLeftが増加、ArrowRightが減少になります。',
    },
    {
      en: 'aria-readonly is NOT valid for role="separator". Readonly behavior must be enforced via JavaScript only.',
      ja: 'aria-readonlyはrole="separator"には有効ではありません。読み取り専用の動作はJavaScriptのみで強制する必要があります。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG: Window Splitter Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/',
    },
    {
      title: 'W3C ARIA: separator role',
      url: 'https://w3c.github.io/aria/#separator',
    },
  ],

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: {
          en: 'Unit Tests (Container API / Testing Library)',
          ja: 'ユニットテスト（Container API / Testing Library）',
        },
        description: {
          en: "Verify the component's HTML output and basic interactions. These tests ensure correct template rendering and ARIA attributes.",
          ja: 'コンポーネントのHTML出力と基本的なインタラクションを検証します。これらのテストは正しいテンプレートレンダリングとARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA structure (role, aria-valuenow, aria-controls)',
            ja: 'ARIA構造（role、aria-valuenow、aria-controls）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Home/End, Enter)',
            ja: 'キーボードインタラクション（矢印キー、Home/End、Enter）',
          },
          { en: 'Collapse/expand functionality', ja: '折り畳み/展開機能' },
          { en: 'RTL support', ja: 'RTLサポート' },
          { en: 'Disabled/readonly states', ja: '無効/読み取り専用状態' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment including pointer interactions.',
          ja: 'ポインターインタラクションを含む実際のブラウザ環境でコンポーネントの動作を検証します。',
        },
        areas: [
          { en: 'Pointer drag to resize', ja: 'ポインタードラッグでリサイズ' },
          {
            en: 'Focus management across Tab navigation',
            ja: 'Tabナビゲーション全体のフォーカス管理',
          },
          { en: 'Cross-framework consistency', ja: 'フレームワーク間の一貫性' },
          {
            en: 'Visual state (CSS custom property updates)',
            ja: '視覚状態（CSSカスタムプロパティの更新）',
          },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'ARIA Structure', ja: 'ARIA構造' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="separator"',
            description: {
              en: 'Splitter has separator role',
              ja: 'スプリッターにseparatorロールが設定されている',
            },
          },
          {
            name: 'aria-valuenow',
            description: {
              en: 'Primary pane size as percentage (0-100)',
              ja: 'プライマリペインのサイズ（パーセンテージ 0-100）',
            },
          },
          {
            name: 'aria-valuemin/max',
            description: {
              en: 'Minimum and maximum values set',
              ja: '最小値と最大値が設定されている',
            },
          },
          {
            name: 'aria-controls',
            description: {
              en: 'References primary (and optional secondary) pane',
              ja: 'プライマリ（および任意のセカンダリ）ペインを参照',
            },
          },
          {
            name: 'aria-orientation',
            description: {
              en: 'Set to "vertical" for vertical splitter',
              ja: '垂直スプリッターの場合は"vertical"に設定',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Set to "true" when disabled',
              ja: '無効時は"true"に設定',
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
            name: 'ArrowRight/Left',
            description: {
              en: 'Moves horizontal splitter (increases/decreases)',
              ja: '水平スプリッターを移動（増加/減少）',
            },
          },
          {
            name: 'ArrowUp/Down',
            description: {
              en: 'Moves vertical splitter (increases/decreases)',
              ja: '垂直スプリッターを移動（増加/減少）',
            },
          },
          {
            name: 'Direction restriction',
            description: {
              en: 'Wrong-direction keys have no effect',
              ja: '誤った方向のキーは効果なし',
            },
          },
          {
            name: 'Shift+Arrow',
            description: {
              en: 'Moves by large step',
              ja: '大きなステップで移動',
            },
          },
          {
            name: 'Home/End',
            description: {
              en: 'Moves to min/max position',
              ja: '最小/最大位置に移動',
            },
          },
          {
            name: 'Enter (collapse)',
            description: { en: 'Collapses to 0', ja: '0に折り畳み' },
          },
          {
            name: 'Enter (expand)',
            description: {
              en: 'Restores previous position',
              ja: '以前の位置を復元',
            },
          },
          {
            name: 'RTL support',
            description: {
              en: 'ArrowLeft/Right reversed in RTL mode',
              ja: 'RTLモードでArrowLeft/Rightが反転',
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
              en: 'Splitter is focusable',
              ja: 'スプリッターがフォーカス可能',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Disabled splitter is not focusable',
              ja: '無効なスプリッターはフォーカス不可',
            },
          },
          {
            name: 'readonly focusable',
            description: {
              en: 'Readonly splitter is focusable but not operable',
              ja: '読み取り専用スプリッターはフォーカス可能だが操作不可',
            },
          },
          {
            name: 'Focus after collapse',
            description: {
              en: 'Focus remains on splitter',
              ja: 'フォーカスはスプリッターに残る',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Pointer Interaction', ja: 'ポインターインタラクション' },
        testType: 'E2E',
        items: [
          {
            name: 'Drag to resize',
            description: {
              en: 'Position updates during drag',
              ja: 'ドラッグ中に位置が更新される',
            },
          },
          {
            name: 'Focus on click',
            description: {
              en: 'Clicking focuses the splitter',
              ja: 'クリックでスプリッターにフォーカス',
            },
          },
          {
            name: 'Disabled no response',
            description: {
              en: 'Disabled splitter ignores pointer',
              ja: '無効なスプリッターはポインターを無視',
            },
          },
          {
            name: 'Readonly no response',
            description: {
              en: 'Readonly splitter ignores pointer',
              ja: '読み取り専用スプリッターはポインターを無視',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility', ja: 'アクセシビリティ' },
        testType: 'E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations',
              ja: 'WCAG 2.1 AA違反なし',
            },
          },
          {
            name: 'Collapsed state',
            description: {
              en: 'No violations when collapsed',
              ja: '折り畳み時に違反なし',
            },
          },
          {
            name: 'Disabled state',
            description: {
              en: 'No violations when disabled',
              ja: '無効時に違反なし',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/window-splitter.spec.ts',
    commands: [
      {
        comment: {
          en: 'Run all Window Splitter unit tests',
          ja: 'Window Splitterの全ユニットテストを実行',
        },
        command: 'npx vitest run src/patterns/window-splitter/',
      },
      {
        comment: {
          en: 'Run framework-specific tests',
          ja: 'フレームワーク固有のテストを実行',
        },
        command: 'npm run test:react -- WindowSplitter.test.tsx',
      },
      {
        comment: {
          en: 'Run E2E tests for Window Splitter',
          ja: 'Window SplitterのE2Eテストを実行',
        },
        command: 'npm run test:e2e -- window-splitter.spec.ts',
      },
      {
        comment: {
          en: 'Run E2E tests in UI mode',
          ja: 'E2EテストをUIモードで実行',
        },
        command: 'npm run test:e2e:ui -- window-splitter.spec.ts',
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
    { description: 'Has role="separator"', priority: 'high', category: 'aria' },
    { description: 'Has aria-valuenow attribute', priority: 'high', category: 'aria' },
    { description: 'Has aria-valuemin attribute', priority: 'high', category: 'aria' },
    { description: 'Has aria-valuemax attribute', priority: 'high', category: 'aria' },
    { description: 'Has aria-controls attribute', priority: 'high', category: 'aria' },
    { description: 'aria-valuenow updates on position change', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    {
      description: 'ArrowRight/Left moves horizontal splitter',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'ArrowUp/Down moves vertical splitter', priority: 'high', category: 'keyboard' },
    { description: 'Home moves to minimum', priority: 'high', category: 'keyboard' },
    { description: 'End moves to maximum', priority: 'high', category: 'keyboard' },
    { description: 'Enter toggles collapse/expand', priority: 'high', category: 'keyboard' },
    { description: 'Shift+Arrow moves by large step', priority: 'high', category: 'keyboard' },

    // Focus - High Priority
    { description: 'Splitter is focusable (tabindex="0")', priority: 'high', category: 'focus' },
    { description: 'Disabled splitter not focusable', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    { description: 'No axe-core violations', priority: 'medium', category: 'accessibility' },
    { description: 'RTL mode reverses arrow directions', priority: 'medium', category: 'keyboard' },
  ],

  implementationNotes: `## Structure

\`\`\`
Container (display: flex)
├── Primary Pane (id="primary-pane", style="width: var(--splitter-position)")
├── Separator (role="separator", tabindex="0")
│   ├── aria-valuenow="50"
│   ├── aria-valuemin="10"
│   ├── aria-valuemax="90"
│   ├── aria-controls="primary-pane secondary-pane"
│   └── aria-label="Resize panels"
└── Secondary Pane (id="secondary-pane", flex: 1)

Visual Layout (Horizontal):
┌─────────────┬──┬─────────────────────┐
│             │  │                     │
│   Primary   │▐▐│     Secondary       │
│    Pane     │▐▐│       Pane          │
│             │  │                     │
└─────────────┴──┴─────────────────────┘
              ↑
          Separator (drag handle)

Keyboard Navigation:
←  = Decrease position (RTL: increase)
→  = Increase position (RTL: decrease)
↑  = Increase position (vertical only)
↓  = Decrease position (vertical only)
Home = Set to min
End  = Set to max
Enter = Toggle collapse/expand
Shift+Arrow = Large step
\`\`\`

## Important Notes

- \`aria-readonly\` is NOT valid for \`role="separator"\`. Readonly behavior must be enforced via JavaScript only.
- Direction restriction: Horizontal splitters only respond to Left/Right, vertical splitters only to Up/Down.
- CSS custom property \`--splitter-position\` should be set on the container and used by panes for sizing.`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA attributes test
it('has correct ARIA attributes', () => {
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      min={10}
      max={90}
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  expect(splitter).toHaveAttribute('aria-valuenow', '50');
  expect(splitter).toHaveAttribute('aria-valuemin', '10');
  expect(splitter).toHaveAttribute('aria-valuemax', '90');
  expect(splitter).toHaveAttribute('aria-controls', 'primary');
});

// Keyboard navigation test
it('moves position on ArrowRight', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      step={5}
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  splitter.focus();

  await user.keyboard('{ArrowRight}');
  expect(splitter).toHaveAttribute('aria-valuenow', '55');
});

// Collapse/expand test
it('collapses on Enter', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      collapsible
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  splitter.focus();

  await user.keyboard('{Enter}');
  expect(splitter).toHaveAttribute('aria-valuenow', '0');

  await user.keyboard('{Enter}');
  expect(splitter).toHaveAttribute('aria-valuenow', '50');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="separator" with required attributes', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();

  await expect(splitter).toHaveAttribute('role', 'separator');
  await expect(splitter).toHaveAttribute('aria-valuenow');
  await expect(splitter).toHaveAttribute('aria-valuemin');
  await expect(splitter).toHaveAttribute('aria-valuemax');
  await expect(splitter).toHaveAttribute('aria-controls');
});

// Keyboard navigation test
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();

  await splitter.focus();
  const initialValue = await splitter.getAttribute('aria-valuenow');

  await page.keyboard.press('ArrowRight');
  const newValue = await splitter.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBeGreaterThan(Number(initialValue));

  await page.keyboard.press('Home');
  const minValue = await splitter.getAttribute('aria-valuemin');
  await expect(splitter).toHaveAttribute('aria-valuenow', minValue);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();
  await splitter.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="separator"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
