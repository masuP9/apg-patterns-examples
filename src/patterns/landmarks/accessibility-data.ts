import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const landmarksAccessibilityData: PatternAccessibilityData = {
  pattern: 'landmarks',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/',

  overview: {
    en: 'Landmarks identify the major sections of a page. There are eight landmark roles that enable assistive technology users to efficiently navigate page structure.',
    ja: 'ランドマークはページの主要なセクションを識別します。8つのランドマークロールがあり、支援技術ユーザーがページ構造を効率的にナビゲートできるようになります。',
  },

  // Note: Landmarks are structural patterns, not interactive widgets
  structureNote: {
    en: 'Landmarks are static structural elements, not interactive widgets. Screen readers provide built-in landmark navigation.',
    ja: 'ランドマークは静的な構造要素であり、インタラクティブなウィジェットではありません。スクリーンリーダーは組み込みのランドマークナビゲーションを提供します。',
  },

  roles: [
    {
      name: 'banner',
      element: '`<header>`',
      description: {
        en: 'Site-wide header',
        ja: 'サイト全体のヘッダー',
      },
    },
    {
      name: 'navigation',
      element: '`<nav>`',
      description: {
        en: 'Navigation links',
        ja: 'ナビゲーションリンク',
      },
    },
    {
      name: 'main',
      element: '`<main>`',
      description: {
        en: 'Primary content',
        ja: '主要コンテンツ',
      },
    },
    {
      name: 'contentinfo',
      element: '`<footer>`',
      description: {
        en: 'Site-wide footer',
        ja: 'サイト全体のフッター',
      },
    },
    {
      name: 'complementary',
      element: '`<aside>`',
      description: {
        en: 'Supporting content',
        ja: '補完的コンテンツ',
      },
    },
    {
      name: 'region',
      element: '`<section>`',
      description: {
        en: 'Named section',
        ja: '名前付きセクション',
      },
    },
    {
      name: 'search',
      element: '`<form role="search">`',
      description: {
        en: 'Search functionality',
        ja: '検索機能',
      },
    },
    {
      name: 'form',
      element: '`<form>`',
      description: {
        en: 'Form area',
        ja: 'フォーム領域',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-label',
      element: {
        en: 'All landmarks',
        ja: 'すべてのランドマーク',
      },
      values: 'String',
      required: {
        en: 'Conditional: when multiple of same type, or region/form',
        ja: '条件付き: 同じ種類が複数ある場合、またはregion/formの場合',
      },
      notes: {
        en: 'Provides an accessible name for the landmark',
        ja: 'ランドマークにアクセシブルな名前を提供',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-label',
    },
    {
      attribute: 'aria-labelledby',
      element: {
        en: 'All landmarks',
        ja: 'すべてのランドマーク',
      },
      values: 'ID reference',
      required: {
        en: 'Conditional: reference visible heading',
        ja: '条件付き: 可視見出しを参照',
      },
      notes: {
        en: 'References a visible heading element',
        ja: '可視の見出し要素を参照',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-labelledby',
    },
  ],

  // Native HTML to ARIA mapping
  nativeVsCustom: [
    {
      useCase: {
        en: '`<header>`',
        ja: '`<header>`',
      },
      native: 'banner',
      custom: {
        en: 'Only when direct child of `<body>`',
        ja: '`<body>`の直接の子の場合のみ',
      },
    },
    {
      useCase: {
        en: '`<nav>`',
        ja: '`<nav>`',
      },
      native: 'navigation',
      custom: {
        en: 'Always',
        ja: '常に',
      },
    },
    {
      useCase: {
        en: '`<main>`',
        ja: '`<main>`',
      },
      native: 'main',
      custom: {
        en: 'Always',
        ja: '常に',
      },
    },
    {
      useCase: {
        en: '`<footer>`',
        ja: '`<footer>`',
      },
      native: 'contentinfo',
      custom: {
        en: 'Only when direct child of `<body>`',
        ja: '`<body>`の直接の子の場合のみ',
      },
    },
    {
      useCase: {
        en: '`<aside>`',
        ja: '`<aside>`',
      },
      native: 'complementary',
      custom: {
        en: 'Always',
        ja: '常に',
      },
    },
    {
      useCase: {
        en: '`<section>`',
        ja: '`<section>`',
      },
      native: 'region',
      custom: {
        en: '**Only when aria-label/labelledby is present**',
        ja: '**aria-label/labelledbyがある場合のみ**',
      },
    },
    {
      useCase: {
        en: '`<form>`',
        ja: '`<form>`',
      },
      native: 'form',
      custom: {
        en: '**Only when aria-label/labelledby is present**',
        ja: '**aria-label/labelledbyがある場合のみ**',
      },
    },
  ],

  // No keyboard support - landmarks are not interactive
  keyboardSupport: [],

  // Landmarks require no keyboard interaction - note about screen reader navigation
  keyboardDocNote: {
    en: 'Landmarks require no keyboard interaction. They are structural elements, not interactive widgets. Screen readers provide built-in landmark navigation (e.g., NVDA D key, VoiceOver rotor).',
    ja: 'ランドマークにはキーボード操作は不要です。ランドマークは構造要素であり、インタラクティブなウィジェットではありません。スクリーンリーダーは組み込みのランドマークナビゲーションを提供します（例：NVDA Dキー、VoiceOverローター）。',
  },

  // No focus management - landmarks are not focusable
  focusManagement: [],

  additionalNotes: [
    {
      en: '**Use semantic HTML elements** - Prefer `<header>`, `<nav>`, `<main>`, etc. over ARIA roles',
      ja: '**セマンティックHTML要素を使用** - ARIAロールよりも`<header>`、`<nav>`、`<main>`などを優先',
    },
    {
      en: '**Label multiple landmarks** - When you have more than one `<nav>` or `<aside>`, give each a unique accessible name',
      ja: '**複数のランドマークにラベルを付ける** - 複数の`<nav>`や`<aside>`がある場合、それぞれに一意のアクセシブルな名前を付ける',
    },
    {
      en: '**Limit landmark count** - Too many landmarks (more than ~7) can be overwhelming for assistive technology users',
      ja: '**ランドマークの数を制限** - ランドマークが多すぎる（約7以上）と支援技術ユーザーにとって煩わしくなる',
    },
    {
      en: '**Place all content in landmarks** - Content outside landmarks may be missed by users navigating by landmarks',
      ja: '**すべてのコンテンツをランドマーク内に配置** - ランドマーク外のコンテンツは、ランドマークでナビゲートするユーザーに見落とされる可能性がある',
    },
    {
      en: '**Top-level placement** - `<header>` and `<footer>` only map to `banner`/`contentinfo` when they are direct children of `<body>`',
      ja: '**トップレベルに配置** - `<header>`と`<footer>`は`<body>`の直接の子の場合にのみ`banner`/`contentinfo`にマップされる',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA APG: Landmarks Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/',
    },
    {
      title: 'WAI-ARIA APG: Landmark Regions',
      url: 'https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/',
    },
    {
      title: 'W3C ARIA: Landmark Roles',
      url: 'https://w3c.github.io/aria/#landmark',
    },
    {
      title: 'MDN: ARIA Landmark Roles',
      url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/landmark_role',
    },
  ],

  // Testing Documentation
  testing: {
    strategies: [
      {
        type: 'unit',
        title: {
          en: 'Unit Tests (Container API / Testing Library)',
          ja: 'ユニットテスト（Container API / Testing Library）',
        },
        description: {
          en: "Verify the component's HTML output and landmark structure. These tests ensure correct rendering without requiring a browser.",
          ja: 'コンポーネントのHTML出力とランドマーク構造を検証します。ブラウザなしで正しいレンダリングを確認できます。',
        },
        areas: [
          {
            en: 'All 8 landmark roles are present',
            ja: '8つのランドマークロールがすべて存在',
          },
          {
            en: 'Semantic HTML elements are used',
            ja: 'セマンティックHTML要素の使用',
          },
          {
            en: 'Proper labeling (aria-label/aria-labelledby)',
            ja: '適切なラベル付け（aria-label/aria-labelledby）',
          },
          {
            en: 'Constraint validation (one main, one banner, etc.)',
            ja: '制約の検証（mainは1つのみ、bannerは1つのみなど）',
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
          en: 'Verify landmark structure in a real browser environment and run accessibility audits.',
          ja: '実際のブラウザ環境でランドマーク構造を検証し、アクセシビリティ監査を実行します。',
        },
        areas: [
          {
            en: 'Landmark roles are exposed correctly',
            ja: 'ランドマークロールが正しく公開される',
          },
          {
            en: 'axe-core accessibility audit',
            ja: 'axe-coreアクセシビリティ監査',
          },
          {
            en: 'Cross-framework consistency',
            ja: 'フレームワーク間の一貫性',
          },
        ],
      },
    ],

    categories: [
      {
        priority: 'high',
        title: {
          en: 'Landmark Structure',
          ja: 'ランドマーク構造',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'banner landmark',
            description: {
              en: 'Has header element with banner role',
              ja: 'bannerロールを持つheader要素がある',
            },
          },
          {
            name: 'navigation landmark',
            description: {
              en: 'Has nav element(s) with navigation role',
              ja: 'navigationロールを持つnav要素がある',
            },
          },
          {
            name: 'main landmark',
            description: {
              en: 'Has main element with main role',
              ja: 'mainロールを持つmain要素がある',
            },
          },
          {
            name: 'contentinfo landmark',
            description: {
              en: 'Has footer element with contentinfo role',
              ja: 'contentinfoロールを持つfooter要素がある',
            },
          },
          {
            name: 'complementary landmark',
            description: {
              en: 'Has aside element with complementary role',
              ja: 'complementaryロールを持つaside要素がある',
            },
          },
          {
            name: 'region landmark',
            description: {
              en: 'Has section with aria-labelledby (region role)',
              ja: 'aria-labelledbyを持つsection（regionロール）がある',
            },
          },
          {
            name: 'search landmark',
            description: {
              en: 'Has form with role="search"',
              ja: 'role="search"を持つformがある',
            },
          },
          {
            name: 'form landmark',
            description: {
              en: 'Has form with aria-label (form role)',
              ja: 'aria-label（formロール）を持つformがある',
            },
          },
          {
            name: 'exactly one main',
            description: {
              en: 'Only one main landmark exists',
              ja: 'mainランドマークが1つだけ存在する',
            },
          },
          {
            name: 'exactly one banner',
            description: {
              en: 'Only one banner landmark exists',
              ja: 'bannerランドマークが1つだけ存在する',
            },
          },
          {
            name: 'exactly one contentinfo',
            description: {
              en: 'Only one contentinfo landmark exists',
              ja: 'contentinfoランドマークが1つだけ存在する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Landmark Labeling',
          ja: 'ランドマークのラベル付け',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'navigation labels',
            description: {
              en: 'Multiple navigations have unique aria-labels',
              ja: '複数のnavigationが一意のaria-labelを持つ',
            },
          },
          {
            name: 'region label',
            description: {
              en: 'Region has aria-label or aria-labelledby',
              ja: 'regionがaria-labelまたはaria-labelledbyを持つ',
            },
          },
          {
            name: 'form label',
            description: {
              en: 'Form landmark has aria-label',
              ja: 'formランドマークがaria-labelを持つ',
            },
          },
          {
            name: 'search label',
            description: {
              en: 'Search landmark has aria-label',
              ja: 'searchランドマークがaria-labelを持つ',
            },
          },
          {
            name: 'complementary label',
            description: {
              en: 'Complementary landmark has aria-label',
              ja: 'complementaryランドマークがaria-labelを持つ',
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
        testType: 'E2E',
        items: [
          {
            name: 'axe-core audit',
            description: {
              en: 'No WCAG 2.1 AA violations',
              ja: 'WCAG 2.1 AAの違反がない',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: {
          en: 'Props & Structure',
          ja: 'プロパティと構造',
        },
        testType: 'Unit',
        items: [
          {
            name: 'className prop',
            description: {
              en: 'Custom className is applied to container',
              ja: 'カスタムclassNameがコンテナに適用される',
            },
          },
          {
            name: 'showLabels prop',
            description: {
              en: 'Landmark labels are visible when enabled',
              ja: '有効時にランドマークラベルが表示される',
            },
          },
          {
            name: 'semantic HTML',
            description: {
              en: 'Uses header, nav, main, footer, aside, section elements',
              ja: 'header、nav、main、footer、aside、section要素を使用',
            },
          },
        ],
      },
    ],

    commands: [
      {
        comment: {
          en: 'Run all landmarks E2E tests',
          ja: 'すべてのlandmarks E2Eテストを実行',
        },
        command: 'npx playwright test landmarks',
      },
      {
        comment: {
          en: 'Run for specific framework (React)',
          ja: '特定のフレームワークで実行（React）',
        },
        command: 'npx playwright test landmarks --grep "react"',
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
        description: {
          en: 'Browser automation for E2E tests',
          ja: 'E2Eテスト用ブラウザ自動化',
        },
      },
      {
        name: 'axe-core',
        url: 'https://www.deque.com/axe/',
        description: {
          en: 'Accessibility testing engine',
          ja: 'アクセシビリティテストエンジン',
        },
      },
    ],

    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // Test checklist for llm.md
  testChecklist: [
    {
      description: 'Has banner landmark (`<header>` or `role="banner"`)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Has navigation landmark (`<nav>` or `role="navigation"`)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Has main landmark (`<main>` or `role="main"`)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Has contentinfo landmark (`<footer>` or `role="contentinfo"`)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Has exactly one main landmark',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Banner is at top level (not inside article/aside/main/nav/section)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Navigation landmarks have unique labels when multiple',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Region landmarks have accessible name (aria-label or aria-labelledby)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Form landmarks have accessible name',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  // Implementation notes for llm.md
  implementationNotes: `Structure Diagram:
\`\`\`
+-----------------------------------------------------------------+
| <header> role="banner"                                          |
| +-------------------------------------------------------------+ |
| | <nav aria-label="Main"> role="navigation"                   | |
| +-------------------------------------------------------------+ |
+-----------------------------------------------------------------+
+-----------------------------------------------------------------+
| <main> role="main"                                              |
| +---------------------+ +-------------------------------------+ |
| | <section            | | <aside aria-label="Related">       | |
| |   aria-labelledby>  | |   role="complementary"              | |
| |   role="region"     | |                                     | |
| +---------------------+ +-------------------------------------+ |
| +-------------------------------------------------------------+ |
| | <form role="search" aria-label="Site search">               | |
| +-------------------------------------------------------------+ |
| +-------------------------------------------------------------+ |
| | <form aria-label="Contact form"> role="form"                | |
| +-------------------------------------------------------------+ |
+-----------------------------------------------------------------+
+-----------------------------------------------------------------+
| <footer> role="contentinfo"                                     |
| +-------------------------------------------------------------+ |
| | <nav aria-label="Footer"> role="navigation"                 | |
| +-------------------------------------------------------------+ |
+-----------------------------------------------------------------+
\`\`\`

Key Points:
- Prefer semantic HTML elements over ARIA roles
- header/footer only map to banner/contentinfo at body level
- section without label is NOT a region landmark
- form without label is NOT a form landmark
- <search> element has limited browser support, use <form role="search">`,

  // Example test code for llm.md
  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';

// Has banner landmark
it('has banner landmark', () => {
  render(<LandmarkDemo />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
});

// Has navigation landmarks with unique labels
it('has navigation landmarks with unique labels', () => {
  render(<LandmarkDemo />);
  const navs = screen.getAllByRole('navigation');
  const labels = navs.map(nav =>
    nav.getAttribute('aria-label') ||
    nav.querySelector('[aria-labelledby]')?.id
  );
  const uniqueLabels = new Set(labels);
  expect(uniqueLabels.size).toBe(navs.length);
});

// Has exactly one main landmark
it('has exactly one main landmark', () => {
  render(<LandmarkDemo />);
  expect(screen.getAllByRole('main')).toHaveLength(1);
});

// Region has accessible name
it('region has accessible name', () => {
  render(<LandmarkDemo />);
  const region = screen.getByRole('region');
  expect(region).toHaveAccessibleName();
});

// Search landmark exists
it('has search landmark', () => {
  render(<LandmarkDemo />);
  expect(screen.getByRole('search')).toBeInTheDocument();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Landmark Roles
test('has all required landmarks', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const demo = page.locator('.apg-landmark-demo');

  await expect(demo.getByRole('banner')).toBeVisible();
  await expect(demo.getByRole('navigation').first()).toBeVisible();
  await expect(demo.getByRole('main')).toBeVisible();
  await expect(demo.getByRole('contentinfo')).toBeVisible();
  await expect(demo.getByRole('complementary')).toBeVisible();
  await expect(demo.getByRole('region')).toBeVisible();
  await expect(demo.getByRole('search')).toBeVisible();
  await expect(demo.getByRole('form')).toBeVisible();
});

// Unique Landmarks
test('has exactly one main, banner, and contentinfo', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const demo = page.locator('.apg-landmark-demo');

  await expect(demo.getByRole('main')).toHaveCount(1);
  await expect(demo.getByRole('banner')).toHaveCount(1);
  await expect(demo.getByRole('contentinfo')).toHaveCount(1);
});

// Labeling
test('landmarks requiring labels have accessible names', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const demo = page.locator('.apg-landmark-demo');

  // region, search, form require accessible names
  await expect(demo.getByRole('region')).toHaveAccessibleName(/.+/);
  await expect(demo.getByRole('search')).toHaveAccessibleName(/.+/);
  await expect(demo.getByRole('form')).toHaveAccessibleName(/.+/);
  await expect(demo.getByRole('complementary')).toHaveAccessibleName(/.+/);
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.apg-landmark-demo')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
