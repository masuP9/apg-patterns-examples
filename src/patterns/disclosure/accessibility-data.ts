import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const disclosureAccessibilityData: PatternAccessibilityData = {
  pattern: 'disclosure',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',

  overview: {
    en: 'A disclosure is a button that controls visibility of a section of content. It is one of the simplest expand/collapse patterns.',
    ja: 'ディスクロージャーは、コンテンツセクションの表示/非表示を制御するボタンです。最もシンプルな展開/折りたたみパターンの一つです。',
  },

  // Native HTML considerations for disclosure
  nativeHtmlConsiderations: [
    { useCase: 'Simple toggle content', recommended: 'Native <details>/<summary>' },
    { useCase: 'JavaScript disabled support', recommended: 'Native <details>/<summary>' },
    { useCase: 'Smooth animations', recommended: 'Custom implementation' },
    { useCase: 'External state control', recommended: 'Custom implementation' },
    { useCase: 'Custom styling', recommended: 'Custom implementation' },
  ],

  nativeVsCustom: [
    {
      feature: 'Simple toggle content',
      native: 'Recommended',
      custom: 'Not needed',
    },
    {
      feature: 'JavaScript disabled support',
      native: 'Works natively',
      custom: 'Requires fallback',
    },
    {
      feature: 'Smooth animations',
      native: 'Limited support',
      custom: 'Full control',
    },
    {
      feature: 'External state control',
      native: 'Limited',
      custom: 'Full control',
    },
    {
      feature: 'Custom styling',
      native: 'Browser-dependent',
      custom: 'Full control',
    },
  ],

  roles: [
    {
      name: 'button',
      element: { en: 'Trigger element', ja: 'トリガー要素' },
      description: {
        en: 'Interactive element that toggles panel visibility (use native <button>)',
        ja: 'パネルの表示を切り替えるインタラクティブな要素（ネイティブの<button>を使用）',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-controls',
      element: 'button',
      values: { en: 'ID reference to panel', ja: 'パネルへのID参照' },
      required: true,
      notes: {
        en: 'Associates the button with the panel it controls',
        ja: 'ボタンと制御対象のパネルを関連付けます',
      },
    },
    {
      attribute: 'aria-hidden',
      element: 'panel',
      values: 'true | false',
      required: false,
      notes: {
        en: 'Hides panel from assistive technology when collapsed',
        ja: '折りたたまれた際にパネルを支援技術から隠します',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-expanded',
      element: { en: 'button element', ja: 'button 要素' },
      values: 'true | false',
      required: true,
      changeTrigger: { en: 'Click, Enter, Space', ja: 'Click、Enter、Space' },
      reference: 'https://w3c.github.io/aria/#aria-expanded',
    },
  ],

  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Move focus to the disclosure button',
        ja: 'ディスクロージャーボタンにフォーカスを移動します',
      },
    },
    {
      key: 'Space / Enter',
      action: {
        en: 'Toggle the visibility of the disclosure panel',
        ja: 'ディスクロージャーパネルの表示を切り替えます',
      },
    },
  ],

  additionalNotes: [
    {
      en: 'Disclosure uses native <button> element behavior for keyboard interaction. No additional keyboard handlers are required.',
      ja: 'ディスクロージャーはネイティブの<button>要素の動作をキーボードインタラクションに使用します。追加のキーボードハンドラーは必要ありません。',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA Disclosure Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/',
    },
  ],

  // Testing documentation
  testing: {
    strategies: [
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all four frameworks. These tests cover interactions that require full browser context.',
          ja: '4つのフレームワーク全体で実際のブラウザ環境でのコンポーネント動作を検証します。フルブラウザコンテキストが必要なインタラクションをカバーします。',
        },
        areas: [
          { en: 'Keyboard interactions (Space, Enter)', ja: 'キーボード操作（Space、Enter）' },
          { en: 'aria-expanded state toggling', ja: 'aria-expanded状態の切り替え' },
          { en: 'aria-controls panel association', ja: 'aria-controlsによるパネル関連付け' },
          { en: 'Panel visibility synchronization', ja: 'パネル表示の同期' },
          { en: 'Disabled state behavior', ja: '無効状態の動作' },
          { en: 'Focus management and Tab navigation', ja: 'フォーカス管理とTabナビゲーション' },
          { en: 'Cross-framework consistency', ja: 'クロスフレームワーク一貫性' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'APG ARIA Structure', ja: 'APG ARIA構造' },
        testType: 'E2E',
        items: [
          {
            name: 'button element',
            description: {
              en: 'Trigger is a semantic <button> element',
              ja: 'トリガーがセマンティックな<button>要素である',
            },
          },
          {
            name: 'aria-expanded',
            description: {
              en: 'Button has aria-expanded attribute',
              ja: 'ボタンがaria-expanded属性を持つ',
            },
          },
          {
            name: 'aria-controls',
            description: {
              en: 'Button references panel ID via aria-controls',
              ja: 'ボタンがaria-controls経由でパネルIDを参照',
            },
          },
          {
            name: 'accessible name',
            description: {
              en: 'Button has an accessible name from content or aria-label',
              ja: 'ボタンがコンテンツまたはaria-labelからアクセシブルな名前を持つ',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction', ja: 'APGキーボード操作' },
        testType: 'E2E',
        items: [
          {
            name: 'Space key toggles',
            description: {
              en: 'Pressing Space toggles the disclosure state',
              ja: 'Spaceキーを押すとDisclosureの状態が切り替わる',
            },
          },
          {
            name: 'Enter key toggles',
            description: {
              en: 'Pressing Enter toggles the disclosure state',
              ja: 'Enterキーを押すとDisclosureの状態が切り替わる',
            },
          },
          {
            name: 'Tab navigation',
            description: {
              en: 'Tab key moves focus to disclosure button',
              ja: 'Tabキーでフォーカスをボタンに移動',
            },
          },
          {
            name: 'Disabled Tab skip',
            description: {
              en: 'Disabled disclosures are skipped in Tab order',
              ja: '無効化されたDisclosureはTabの順序でスキップされる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'State Synchronization', ja: '状態の同期' },
        testType: 'E2E',
        items: [
          {
            name: 'aria-expanded toggle',
            description: {
              en: 'Click changes aria-expanded value',
              ja: 'クリックでaria-expanded値が変わる',
            },
          },
          {
            name: 'panel visibility',
            description: {
              en: 'Panel visibility matches aria-expanded state',
              ja: 'パネルの表示がaria-expanded状態と一致',
            },
          },
          {
            name: 'collapsed hidden',
            description: {
              en: 'Panel content is hidden when collapsed',
              ja: '折りたたみ時にパネルコンテンツが非表示',
            },
          },
          {
            name: 'expanded visible',
            description: {
              en: 'Panel content is visible when expanded',
              ja: '展開時にパネルコンテンツが表示',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Disabled State', ja: '無効状態' },
        testType: 'E2E',
        items: [
          {
            name: 'disabled attribute',
            description: {
              en: 'Disabled disclosure has disabled attribute',
              ja: '無効なDisclosureがdisabled属性を持つ',
            },
          },
          {
            name: 'click blocked',
            description: {
              en: "Disabled disclosure doesn't toggle on click",
              ja: '無効なDisclosureはクリックでトグルしない',
            },
          },
          {
            name: 'keyboard blocked',
            description: {
              en: "Disabled disclosure doesn't toggle on keyboard",
              ja: '無効なDisclosureはキーボードでトグルしない',
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
            name: 'axe (collapsed)',
            description: {
              en: 'No WCAG 2.1 AA violations in collapsed state',
              ja: '折りたたみ状態でWCAG 2.1 AA違反なし',
            },
          },
          {
            name: 'axe (expanded)',
            description: {
              en: 'No WCAG 2.1 AA violations in expanded state',
              ja: '展開状態でWCAG 2.1 AA違反なし',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/disclosure.spec.ts',
    commands: [
      {
        comment: {
          en: 'Run E2E tests for Disclosure (all frameworks)',
          ja: 'DisclosureのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=disclosure',
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

  // llm.md specific data
  testChecklist: [
    // ARIA - High Priority
    { description: 'Trigger is a <button> element', priority: 'high', category: 'aria' },
    { description: 'Button has aria-expanded attribute', priority: 'high', category: 'aria' },
    {
      description: 'aria-expanded toggles between true and false',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Button has aria-controls referencing panel id',
      priority: 'high',
      category: 'aria',
    },

    // Behavior - High Priority
    { description: 'Click toggles panel visibility', priority: 'high', category: 'click' },
    { description: 'Enter toggles panel visibility', priority: 'high', category: 'keyboard' },
    { description: 'Space toggles panel visibility', priority: 'high', category: 'keyboard' },
    { description: 'Panel content hidden when collapsed', priority: 'high', category: 'aria' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`html
<button aria-expanded="false" aria-controls="content-1">Show details</button>
<div id="content-1" hidden>Panel content here...</div>
\`\`\`

## Visibility Methods

1. **hidden attribute (preferred)**
   \`\`\`html
   <div id="panel" hidden>...</div>
   \`\`\`

2. **CSS display: none**
   \`\`\`css
   .panel[aria-hidden="true"] { display: none; }
   \`\`\`

3. **aria-hidden + CSS**
   \`\`\`html
   <div aria-hidden="true" class="collapsed">...</div>
   \`\`\`

## Disclosure vs Accordion

| Disclosure           | Accordion                                 |
| -------------------- | ----------------------------------------- |
| Single panel         | Multiple panels                           |
| No heading structure | Uses headings                             |
| Independent          | Grouped behavior (optional single-expand) |
| Simple show/hide     | Arrow key navigation between headers      |`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Initial state
it('starts collapsed', () => {
  render(<Disclosure>Content</Disclosure>);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-expanded', 'false');
});

// Toggle on click
it('toggles on click', async () => {
  const user = userEvent.setup();
  render(<Disclosure>Content</Disclosure>);

  const button = screen.getByRole('button');
  await user.click(button);

  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('Content')).toBeVisible();
});

// aria-controls
it('has aria-controls referencing panel', () => {
  render(<Disclosure>Content</Disclosure>);

  const button = screen.getByRole('button');
  const panelId = button.getAttribute('aria-controls');

  expect(document.getElementById(panelId!)).toBeInTheDocument();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('button has aria-controls referencing panel id', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();

  const ariaControls = await button.getAttribute('aria-controls');
  expect(ariaControls).not.toBeNull();

  const panel = page.locator(\`[id="\${ariaControls}"]\`);
  await expect(panel).toBeAttached();
});

// Toggle behavior test
test('toggles aria-expanded and panel visibility on click', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();
  const panelId = await button.getAttribute('aria-controls');
  const panel = page.locator(\`[id="\${panelId}"]\`);

  const initialState = await button.getAttribute('aria-expanded');
  await button.click();
  const newState = await button.getAttribute('aria-expanded');

  expect(newState).not.toBe(initialState);

  if (newState === 'true') {
    await expect(panel).toBeVisible();
  } else {
    await expect(panel).not.toBeVisible();
  }
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();

  // Expand disclosure
  if ((await button.getAttribute('aria-expanded')) === 'false') {
    await button.click();
  }

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('button[aria-expanded]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
