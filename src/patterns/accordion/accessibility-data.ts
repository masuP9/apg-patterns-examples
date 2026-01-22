import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const accordionAccessibilityData: PatternAccessibilityData = {
  pattern: 'accordion',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',

  overview: {
    en: 'An accordion is a vertically stacked set of interactive headings that each reveal an associated section of content.',
    ja: 'アコーディオンは、垂直に積み重ねられたインタラクティブな見出しのセットで、各見出しが関連するコンテンツセクションを表示します。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'heading',
      element: { en: 'Header wrapper (h2-h6)', ja: 'ヘッダーラッパー (h2-h6)' },
      description: {
        en: 'Contains the accordion trigger button',
        ja: 'アコーディオントリガーボタンを含む',
      },
    },
    {
      name: 'button',
      element: { en: 'Header trigger', ja: 'ヘッダートリガー' },
      description: {
        en: 'Interactive element that toggles panel visibility',
        ja: 'パネルの表示/非表示を切り替える対話要素',
      },
    },
    {
      name: 'region',
      element: { en: 'Panel (optional)', ja: 'パネル (オプション)' },
      description: {
        en: 'Content area associated with header (omit for 6+ panels)',
        ja: 'ヘッダーと関連付けられたコンテンツエリア (6個以上のパネルでは省略)',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-level',
      element: 'heading',
      values: '2 - 6',
      required: true,
      notes: { en: 'headingLevel prop', ja: 'headingLevel プロパティ' },
    },
    {
      attribute: 'aria-controls',
      element: 'button',
      values: { en: 'ID reference to associated panel', ja: '関連付けられたパネルへのID参照' },
      required: true,
      notes: { en: 'Auto-generated', ja: '自動生成' },
    },
    {
      attribute: 'aria-labelledby',
      element: { en: 'region (panel)', ja: 'region (パネル)' },
      values: { en: 'ID reference to header button', ja: 'ヘッダーボタンへのID参照' },
      required: { en: 'Yes (if region used)', ja: 'はい (regionを使用する場合)' },
      notes: { en: 'Auto-generated', ja: '自動生成' },
    },
  ],

  states: [
    {
      attribute: 'aria-expanded',
      element: { en: 'button element', ja: 'button 要素' },
      values: 'true | false',
      required: true,
      changeTrigger: { en: 'Click, Enter, Space', ja: 'クリック、Enter、Space' },
      reference: 'https://w3c.github.io/aria/#aria-expanded',
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'button element', ja: 'button 要素' },
      values: 'true | false',
      required: false,
      changeTrigger: { en: 'Only when disabled', ja: '無効化する場合のみ' },
      reference: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Move focus to the next focusable element',
        ja: '次のフォーカス可能な要素にフォーカスを移動',
      },
    },
    {
      key: 'Space / Enter',
      action: {
        en: 'Toggle the expansion of the focused accordion header',
        ja: 'フォーカスされたアコーディオンヘッダーの展開/折り畳みを切り替え',
      },
    },
    {
      key: 'Arrow Down',
      action: {
        en: 'Move focus to the next accordion header (optional)',
        ja: '次のアコーディオンヘッダーにフォーカスを移動 (オプション)',
      },
    },
    {
      key: 'Arrow Up',
      action: {
        en: 'Move focus to the previous accordion header (optional)',
        ja: '前のアコーディオンヘッダーにフォーカスを移動 (オプション)',
      },
    },
    {
      key: 'Home',
      action: {
        en: 'Move focus to the first accordion header (optional)',
        ja: '最初のアコーディオンヘッダーにフォーカスを移動 (オプション)',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Move focus to the last accordion header (optional)',
        ja: '最後のアコーディオンヘッダーにフォーカスを移動 (オプション)',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Header buttons', ja: 'ヘッダーボタン' },
      behavior: { en: 'Focusable via their button elements', ja: 'ボタン要素経由でフォーカス可能' },
    },
    {
      event: { en: 'Arrow keys', ja: '矢印キー' },
      behavior: {
        en: 'Navigate between headers (skip disabled)',
        ja: 'ヘッダー間をナビゲート（無効化されたものはスキップ）',
      },
    },
    {
      event: { en: 'Edges', ja: '端' },
      behavior: { en: 'Focus does not wrap at edges', ja: 'フォーカスは端でループしない' },
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Arrow key navigation is optional but recommended. Focus does not wrap around at the end of the list.',
      ja: '矢印キーによるナビゲーションはオプションですが推奨されます。フォーカスはリストの端でループしません。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA Accordion Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/accordion/',
    },
  ],

  // --- Implementation Notes ---

  implementationNotesData: {
    structure: {
      diagram: `┌─────────────────────────────────────┐
│ [▼] Section 1                       │  ← button (aria-expanded="true")
├─────────────────────────────────────┤
│ Panel 1 content...                  │  ← region (aria-labelledby)
├─────────────────────────────────────┤
│ [▶] Section 2                       │  ← button (aria-expanded="false")
├─────────────────────────────────────┤
│ [▶] Section 3                       │  ← button (aria-expanded="false")
└─────────────────────────────────────┘

ID Relationships:
- Button: id="header-1", aria-controls="panel-1"
- Panel: id="panel-1", aria-labelledby="header-1"

Region Role Rule:
- ≤6 panels: use role="region" on panels
- >6 panels: omit role="region" (too many landmarks)`,
      caption: {
        en: 'Accordion component structure with ID relationships',
        ja: 'ID関連を含むアコーディオンコンポーネントの構造',
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
          ja: 'フレームワーク固有のテストライブラリを使用して、コンポーネントの出力を検証します。これらのテストは正しいHTML構造とARIA属性を確保します。',
        },
        areas: [
          {
            en: 'ARIA attributes (aria-expanded, aria-controls, aria-labelledby)',
            ja: 'ARIA 属性 (aria-expanded, aria-controls, aria-labelledby)',
          },
          {
            en: 'Keyboard interaction (Enter, Space, Arrow keys)',
            ja: 'キーボード操作 (Enter, Space, 矢印キー)',
          },
          { en: 'Expand/collapse behavior', ja: '展開/折り畳み動作' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axe によるアクセシビリティ' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2E テスト (Playwright)' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: '実際のブラウザ環境でコンポーネントの動作を全フレームワークにわたって検証します。これらのテストはインタラクションとクロスフレームワークの一貫性をカバーします。',
        },
        areas: [
          { en: 'Click interactions', ja: 'クリック操作' },
          { en: 'Arrow key navigation', ja: '矢印キーナビゲーション' },
          { en: 'Home/End key navigation', ja: 'Home/End キーナビゲーション' },
          {
            en: 'ARIA structure validation in live browser',
            ja: 'ライブブラウザでの ARIA 構造検証',
          },
          { en: 'axe-core accessibility scanning', ja: 'axe-core アクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'クロスフレームワーク一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction', ja: 'APG キーボード操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Enter key',
            description: {
              en: 'Expands/collapses the focused panel',
              ja: 'フォーカスされたパネルを展開/折り畳み',
            },
          },
          {
            name: 'Space key',
            description: {
              en: 'Expands/collapses the focused panel',
              ja: 'フォーカスされたパネルを展開/折り畳み',
            },
          },
          {
            name: 'ArrowDown',
            description: {
              en: 'Moves focus to next header',
              ja: '次のヘッダーにフォーカスを移動',
            },
          },
          {
            name: 'ArrowUp',
            description: {
              en: 'Moves focus to previous header',
              ja: '前のヘッダーにフォーカスを移動',
            },
          },
          {
            name: 'Home',
            description: {
              en: 'Moves focus to first header',
              ja: '最初のヘッダーにフォーカスを移動',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Moves focus to last header',
              ja: '最後のヘッダーにフォーカスを移動',
            },
          },
          {
            name: 'No loop',
            description: {
              en: 'Focus stops at edges (no wrapping)',
              ja: 'フォーカスは端で停止 (ループしない)',
            },
          },
          {
            name: 'Disabled skip',
            description: {
              en: 'Skips disabled headers during navigation',
              ja: 'ナビゲーション中に無効化されたヘッダーをスキップ',
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
            name: 'aria-expanded',
            description: {
              en: 'Header button reflects expand/collapse state',
              ja: 'ヘッダーボタンが展開/折り畳み状態を反映',
            },
          },
          {
            name: 'aria-controls',
            description: {
              en: 'Header references its panel via aria-controls',
              ja: 'ヘッダーが aria-controls でパネルを参照',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Panel references its header via aria-labelledby',
              ja: 'パネルが aria-labelledby でヘッダーを参照',
            },
          },
          {
            name: 'role="region"',
            description: {
              en: 'Panel has region role (6 or fewer panels)',
              ja: 'パネルに region ロール (6個以下のパネル)',
            },
          },
          {
            name: 'No region (7+)',
            description: {
              en: 'Panel omits region role when 7+ panels',
              ja: '7個以上のパネルの場合、region ロールを省略',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled items have aria-disabled="true"',
              ja: '無効化された項目に aria-disabled="true"',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Click Interaction', ja: 'クリック操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Click expands',
            description: {
              en: 'Clicking header expands panel',
              ja: 'ヘッダーをクリックするとパネルが展開',
            },
          },
          {
            name: 'Click collapses',
            description: {
              en: 'Clicking expanded header collapses panel',
              ja: '展開されたヘッダーをクリックするとパネルが折り畳み',
            },
          },
          {
            name: 'Single expansion',
            description: {
              en: 'Opening panel closes other panels (default)',
              ja: 'パネルを開くと他のパネルが閉じる（デフォルト）',
            },
          },
          {
            name: 'Multiple expansion',
            description: {
              en: 'Multiple panels can be open with allowMultiple',
              ja: 'allowMultiple で複数のパネルを開ける',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Heading Structure', ja: '見出し構造' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'headingLevel prop',
            description: {
              en: 'Uses correct heading element (h2, h3, etc.)',
              ja: '正しい見出し要素を使用 (h2, h3, など)',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Disabled State', ja: '無効状態' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Disabled no click',
            description: {
              en: 'Clicking disabled header does not expand',
              ja: '無効化されたヘッダーをクリックしても展開しない',
            },
          },
          {
            name: 'Disabled no keyboard',
            description: {
              en: 'Enter/Space does not activate disabled header',
              ja: 'Enter/Space で無効化されたヘッダーが動作しない',
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
              ja: 'WCAG 2.1 AA 違反なし (jest-axe/axe-core 経由)',
            },
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
              en: 'React, Vue, Svelte, Astro all render accordions',
              ja: 'React, Vue, Svelte, Astro で全てアコーディオンがレンダリングされる',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: '全フレームワークで一貫した ARIA 構造',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/accordion.spec.ts',
    commands: [
      {
        comment: {
          en: 'Run unit tests for Accordion',
          ja: 'Accordion のユニットテストを実行',
        },
        command: 'npm run test -- accordion',
      },
      {
        comment: {
          en: 'Run E2E tests for Accordion (all frameworks)',
          ja: 'Accordion の E2E テストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=accordion',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークの E2E テストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=accordion',
      },
      { comment: { en: '', ja: '' }, command: 'npm run test:e2e:vue:pattern --pattern=accordion' },
      {
        comment: { en: '', ja: '' },
        command: 'npm run test:e2e:svelte:pattern --pattern=accordion',
      },
      {
        comment: { en: '', ja: '' },
        command: 'npm run test:e2e:astro:pattern --pattern=accordion',
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
          ja: 'フレームワーク固有のテストユーティリティ (React, Vue, Svelte)',
        },
      },
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: {
          en: 'Browser automation for E2E tests',
          ja: 'E2E テスト用ブラウザ自動化',
        },
      },
      {
        name: 'axe-core/playwright',
        url: 'https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright',
        description: {
          en: 'Automated accessibility testing in E2E',
          ja: 'E2E での自動アクセシビリティテスト',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // Keyboard - High Priority
    { description: 'Enter/Space toggles panel expansion', priority: 'high', category: 'keyboard' },
    { description: 'ArrowDown moves to next header', priority: 'high', category: 'keyboard' },
    { description: 'ArrowUp moves to previous header', priority: 'high', category: 'keyboard' },
    { description: 'Home moves to first header', priority: 'high', category: 'keyboard' },
    { description: 'End moves to last header', priority: 'high', category: 'keyboard' },
    { description: 'Disabled headers are skipped', priority: 'high', category: 'keyboard' },

    // ARIA - High Priority
    {
      description: 'Button has aria-expanded matching panel state',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Button has aria-controls referencing panel id',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Panel (if region) has aria-labelledby referencing button',
      priority: 'high',
      category: 'aria',
    },
    { description: '6 or fewer panels have role="region"', priority: 'high', category: 'aria' },
    { description: '7+ panels omit role="region"', priority: 'high', category: 'aria' },
    {
      description: 'Disabled items have aria-disabled="true"',
      priority: 'high',
      category: 'aria',
    },

    // Focus Management - High Priority
    { description: 'Focus stays on header after toggle', priority: 'high', category: 'focus' },
    { description: 'Arrow keys skip disabled headers', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Proper heading level hierarchy',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`
┌─────────────────────────────────────┐
│ [▼] Section 1                       │  ← button (aria-expanded="true")
├─────────────────────────────────────┤
│ Panel 1 content...                  │  ← region (aria-labelledby)
├─────────────────────────────────────┤
│ [▶] Section 2                       │  ← button (aria-expanded="false")
├─────────────────────────────────────┤
│ [▶] Section 3                       │  ← button (aria-expanded="false")
└─────────────────────────────────────┘

ID Relationships:
- Button: id="header-1", aria-controls="panel-1"
- Panel: id="panel-1", aria-labelledby="header-1"

Region Role Rule:
- ≤6 panels: use role="region" on panels
- >6 panels: omit role="region" (too many landmarks)
\`\`\``,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Toggle test
it('toggles panel on Enter/Space', async () => {
  const user = userEvent.setup();
  render(<Accordion items={items} />);

  const header = screen.getByRole('button', { name: 'Section 1' });
  expect(header).toHaveAttribute('aria-expanded', 'false');

  await user.click(header);
  expect(header).toHaveAttribute('aria-expanded', 'true');
});

// Arrow navigation test
it('ArrowDown moves to next header', async () => {
  const user = userEvent.setup();
  render(<Accordion items={items} />);

  const header1 = screen.getByRole('button', { name: 'Section 1' });
  header1.focus();

  await user.keyboard('{ArrowDown}');

  const header2 = screen.getByRole('button', { name: 'Section 2' });
  expect(header2).toHaveFocus();
});

// Skip disabled
it('skips disabled headers', async () => {
  const user = userEvent.setup();
  render(<Accordion items={itemsWithDisabled} />);

  const header1 = screen.getByRole('button', { name: 'Section 1' });
  header1.focus();

  await user.keyboard('{ArrowDown}');
  // Section 2 is disabled, should skip to Section 3
  expect(screen.getByRole('button', { name: 'Section 3' })).toHaveFocus();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('accordion has proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/accordion/react/demo/');
  const accordion = page.locator('.apg-accordion').first();
  const header = accordion.locator('.apg-accordion-trigger').first();

  // Wait for hydration
  await expect(header).toHaveAttribute('aria-controls', /.+/);

  // Check aria-expanded
  const expanded = await header.getAttribute('aria-expanded');
  expect(['true', 'false']).toContain(expanded);

  // Check aria-controls references valid panel
  const controlsId = await header.getAttribute('aria-controls');
  const panel = page.locator(\`[id="\${controlsId}"]\`);
  await expect(panel).toBeAttached();
  await expect(panel).toHaveRole('region');
});

// Keyboard navigation test
test('arrow keys navigate between headers', async ({ page }) => {
  await page.goto('patterns/accordion/react/demo/');
  const accordion = page.locator('.apg-accordion').first();
  const headers = accordion.locator('.apg-accordion-trigger');

  await headers.first().click();
  await expect(headers.first()).toBeFocused();

  await page.keyboard.press('ArrowDown');
  await expect(headers.nth(1)).toBeFocused();

  await page.keyboard.press('Home');
  await expect(headers.first()).toBeFocused();

  await page.keyboard.press('End');
  await expect(headers.last()).toBeFocused();
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/accordion/react/demo/');
  await page.locator('.apg-accordion').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('.apg-accordion')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
