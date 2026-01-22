/**
 * Breadcrumb Pattern - Accessibility Data
 *
 * Single source of truth for accessibility documentation.
 * Used by AccessibilityDocs.astro and for generating breadcrumb.md / breadcrumb.ja.md
 */

import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const breadcrumbAccessibilityData: PatternAccessibilityData = {
  pattern: 'breadcrumb',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',

  overview: {
    en: "A breadcrumb trail shows the user's location in a site hierarchy and provides navigation to ancestor pages.",
    ja: 'パンくずリストは、サイト階層内のユーザーの現在位置を示し、上位ページへのナビゲーションを提供します。',
  },

  // --- ARIA Roles ---
  roles: [
    {
      name: 'navigation',
      element: {
        en: '<nav> element',
        ja: '<nav> 要素',
      },
      description: {
        en: 'Provides a navigation landmark for assistive technology (implicit role of <nav>)',
        ja: '支援技術にナビゲーションランドマークを提供します（<nav>の暗黙のロール）',
      },
    },
  ],

  // --- ARIA Properties ---
  properties: [
    {
      attribute: 'aria-label',
      element: '<nav>',
      values: {
        en: '"Breadcrumb" (or localized)',
        ja: '"Breadcrumb"（またはローカライズされた値）',
      },
      required: true,
      notes: {
        en: 'Labels the navigation landmark for screen readers',
        ja: 'スクリーンリーダー向けにナビゲーションランドマークにラベルを付けます',
      },
    },
    {
      attribute: 'aria-current',
      element: {
        en: 'Current page element',
        ja: '現在のページ要素',
      },
      values: '"page"',
      required: {
        en: 'Yes (on last item)',
        ja: 'はい（最後のアイテム）',
      },
      notes: {
        en: 'Identifies the current page within the breadcrumb trail',
        ja: 'パンくずリスト内の現在のページを識別します',
      },
    },
  ],

  // --- ARIA States ---
  states: [
    {
      attribute: 'aria-current',
      element: {
        en: 'Last item in the breadcrumb (current page)',
        ja: 'パンくずリストの最後のアイテム（現在のページ）',
      },
      values: '"page"',
      required: true,
      changeTrigger: {
        en: 'Indicates the current page location within the breadcrumb navigation.',
        ja: 'パンくずリストナビゲーション内の現在のページ位置を示します。',
      },
      reference: 'https://w3c.github.io/aria/#aria-current',
    },
  ],

  // --- Keyboard Support ---
  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Move focus between breadcrumb links',
        ja: 'パンくずリストのリンク間でフォーカスを移動します',
      },
    },
    {
      key: 'Enter',
      action: {
        en: 'Activate the focused link',
        ja: 'フォーカスされたリンクをアクティブ化します',
      },
    },
  ],

  // --- Additional Notes ---
  additionalNotes: [
    {
      en: 'Breadcrumb uses native <a> element behavior for keyboard interaction. No additional keyboard handlers are required.',
      ja: 'Breadcrumbはネイティブの<a>要素の動作をキーボードインタラクションに使用します。追加のキーボードハンドラーは不要です。',
    },
  ],

  // --- References ---
  references: [
    {
      title: 'WAI-ARIA Breadcrumb Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/',
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
          { en: 'HTML structure (nav, ol, li elements)', ja: 'HTML構造（nav、ol、li要素）' },
          {
            en: 'ARIA attributes (aria-label, aria-current)',
            ja: 'ARIA属性（aria-label、aria-current）',
          },
          { en: 'Link rendering and href values', ja: 'リンクのレンダリングとhref値' },
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
          { en: 'Keyboard navigation (Tab, Enter)', ja: 'キーボードナビゲーション（Tab、Enter）' },
          { en: 'ARIA structure in live browser', ja: 'ライブブラウザでのARIA構造' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreによるアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'フレームワーク間の一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: {
          en: 'APG ARIA Attributes',
          ja: 'APG ARIA属性（Unit + E2E）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'nav element',
            description: {
              en: 'Uses semantic <nav> element',
              ja: 'セマンティックな<nav>要素を使用します',
            },
          },
          {
            name: 'aria-label',
            description: {
              en: 'Navigation has accessible label (default: "Breadcrumb")',
              ja: 'ナビゲーションにアクセシブルなラベルがあります（デフォルト: "Breadcrumb"）',
            },
          },
          {
            name: 'aria-current="page"',
            description: {
              en: 'Last item has aria-current="page"',
              ja: '最後のアイテムにaria-current="page"があります',
            },
          },
          {
            name: 'ol/li structure',
            description: {
              en: 'Uses ordered list for proper semantic structure',
              ja: '適切なセマンティック構造のために順序付きリストを使用します',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Keyboard Interaction',
          ja: 'キーボードインタラクション（E2E）',
        },
        testType: 'E2E',
        items: [
          {
            name: 'Tab navigation',
            description: {
              en: 'Tab moves focus between breadcrumb links',
              ja: 'Tabキーでパンくずリストのリンク間をフォーカス移動します',
            },
          },
          {
            name: 'Enter activation',
            description: {
              en: 'Enter key activates focused link',
              ja: 'Enterキーでフォーカスされたリンクをアクティブ化します',
            },
          },
          {
            name: 'Current page not focusable',
            description: {
              en: 'Last item (span) is not in tab order',
              ja: '最後のアイテム（span）はタブ順序に含まれません',
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
              ja: 'WCAG 2.1 AAの違反がありません（jest-axe使用）',
            },
          },
          {
            name: 'Custom aria-label',
            description: {
              en: 'Can override default label via ariaLabel prop',
              ja: 'ariaLabel propsでデフォルトラベルをオーバーライドできます',
            },
          },
          {
            name: 'Separator hidden',
            description: {
              en: 'Visual separators are hidden from assistive technology',
              ja: '視覚的な区切り文字は支援技術から隠されています',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'Component Behavior',
          ja: 'コンポーネントの動作（Unit）',
        },
        testType: 'Unit',
        items: [
          {
            name: 'Renders all items',
            description: {
              en: 'All provided items are rendered in order',
              ja: '提供されたすべてのアイテムが順番にレンダリングされます',
            },
          },
          {
            name: 'Links have href',
            description: {
              en: 'Non-current items render as links with correct href',
              ja: '現在でないアイテムは正しいhrefを持つリンクとしてレンダリングされます',
            },
          },
          {
            name: 'className merge',
            description: {
              en: 'Custom classes are merged with component classes',
              ja: 'カスタムクラスがコンポーネントクラスとマージされます',
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
            name: 'All frameworks have nav',
            description: {
              en: 'React, Vue, Svelte, Astro all render breadcrumb navigation',
              ja: 'React、Vue、Svelte、Astroすべてがパンくずナビゲーションをレンダリング',
            },
          },
          {
            name: 'Same item count',
            description: {
              en: 'All frameworks render the same number of breadcrumb items',
              ja: 'すべてのフレームワークで同じ数のパンくずアイテムをレンダリング',
            },
          },
          {
            name: 'Current page marked',
            description: {
              en: 'All frameworks mark the last item with aria-current="page"',
              ja: 'すべてのフレームワークで最後のアイテムにaria-current="page"をマーク',
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
    // High Priority: ARIA
    { description: '<nav> element is used', priority: 'high', category: 'aria' },
    {
      description: '<nav> has aria-label="Breadcrumb" (or localized)',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Last item has aria-current="page"', priority: 'high', category: 'aria' },
    { description: 'Links use native <a> elements', priority: 'high', category: 'aria' },
    // High Priority: Structure
    { description: 'Uses ordered list (<ol>) for hierarchy', priority: 'high', category: 'aria' },
    { description: 'Each breadcrumb is a list item (<li>)', priority: 'high', category: 'aria' },
    {
      description: 'Current page is identifiable (text or aria-current)',
      priority: 'high',
      category: 'aria',
    },
    // Medium Priority: Accessibility
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Visual separators are decorative (hidden from AT)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  // --- Implementation Notes ---
  implementationNotes: `Structure:
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/products/shoes" aria-current="page">Shoes</a></li>
  </ol>
</nav>

Separators:
- Use CSS (::before/::after) for visual separators
- Do NOT use text separators that are read by screen readers
- If using icons, add aria-hidden="true"

Current Page Options:
1. Link with aria-current="page" (navigable)
2. Plain text (not linked) - less common

Screen Reader Announcement:
"Breadcrumb navigation, list, 3 items, Home, link, 1 of 3, Products, link, 2 of 3, Shoes, link, current page, 3 of 3"`,

  // --- Example Test Code ---
  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';

// Navigation landmark
it('has navigation with aria-label', () => {
  render(<Breadcrumb items={items} />);
  expect(screen.getByRole('navigation', { name: /breadcrumb/i }))
    .toBeInTheDocument();
});

// Current page
it('marks current page with aria-current', () => {
  render(<Breadcrumb items={items} />);
  const currentLink = screen.getByRole('link', { name: 'Shoes' });
  expect(currentLink).toHaveAttribute('aria-current', 'page');
});

// List structure
it('uses ordered list', () => {
  render(<Breadcrumb items={items} />);
  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Helper to get breadcrumb navigation
const getBreadcrumb = (page) => {
  return page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]').first();
};

// ARIA Structure: nav element with aria-label
test('uses nav element with aria-label containing "Breadcrumb"', async ({ page }) => {
  await page.goto('patterns/breadcrumb/react/demo/');

  const nav = getBreadcrumb(page);
  await expect(nav).toBeAttached();

  const ariaLabel = await nav.getAttribute('aria-label');
  expect(ariaLabel?.toLowerCase()).toContain('breadcrumb');
});

// ARIA Structure: Last item has aria-current="page"
test('last item has aria-current="page"', async ({ page }) => {
  await page.goto('patterns/breadcrumb/react/demo/');

  const nav = getBreadcrumb(page);
  const currentPageElement = nav.locator('[aria-current="page"]');
  await expect(currentPageElement.first()).toBeAttached();
});

// Accessibility: No axe-core violations
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/breadcrumb/react/demo/');

  const nav = getBreadcrumb(page);
  await nav.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('nav[aria-label*="Breadcrumb"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
