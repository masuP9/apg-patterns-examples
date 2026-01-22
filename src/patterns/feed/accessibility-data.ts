import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const feedAccessibilityData: PatternAccessibilityData = {
  pattern: 'feed',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',

  overview: {
    en: 'A feed is a section of a page that automatically loads new content as the user scrolls (infinite scroll). Unlike widgets, feeds use the structure category, allowing assistive technologies to use reading mode by default.',
    ja: 'フィードは、ユーザーがスクロールすると自動的に新しいコンテンツが読み込まれるページのセクション（無限スクロール）です。ウィジェットとは異なり、フィードはストラクチャーカテゴリを使用するため、支援技術がデフォルトで読み上げモードを使用できます。',
  },

  roles: [
    {
      name: 'feed',
      element: { en: 'Container element', ja: 'コンテナ要素' },
      description: {
        en: 'A dynamic list of articles where scrolling may add/remove content',
        ja: 'スクロールでコンテンツが追加/削除される記事の動的リスト',
      },
    },
    {
      name: 'article',
      element: { en: 'Each article element', ja: '各記事要素' },
      description: {
        en: 'Independent content item within the feed',
        ja: 'フィード内の独立したコンテンツアイテム',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-label',
      element: { en: 'Feed container', ja: 'Feedコンテナ' },
      values: { en: 'Text', ja: 'テキスト' },
      required: false,
      notes: {
        en: 'Accessible name for the feed (conditional*)',
        ja: 'フィードのアクセシブルな名前（条件付き*）',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: { en: 'Feed container', ja: 'Feedコンテナ' },
      values: { en: 'ID reference', ja: 'ID参照' },
      required: false,
      notes: {
        en: 'References visible heading for the feed (conditional*)',
        ja: 'フィードの可視見出しを参照（条件付き*）',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: { en: 'Each article', ja: '各記事' },
      values: { en: 'ID reference', ja: 'ID参照' },
      required: true,
      notes: {
        en: 'References the article title element',
        ja: '記事タイトル要素を参照',
      },
    },
    {
      attribute: 'aria-describedby',
      element: { en: 'Each article', ja: '各記事' },
      values: { en: 'ID reference', ja: 'ID参照' },
      required: false,
      notes: {
        en: 'References the article description or content (recommended)',
        ja: '記事の説明またはコンテンツを参照（推奨）',
      },
    },
    {
      attribute: 'aria-posinset',
      element: { en: 'Each article', ja: '各記事' },
      values: { en: 'Number (1-based)', ja: '数値（1始まり）' },
      required: true,
      notes: {
        en: 'Position of article in the feed (starts at 1)',
        ja: 'フィード内の記事の位置（1から開始）',
      },
    },
    {
      attribute: 'aria-setsize',
      element: { en: 'Each article', ja: '各記事' },
      values: { en: 'Number or -1', ja: '数値または-1' },
      required: true,
      notes: {
        en: 'Total articles in feed, or -1 if unknown',
        ja: 'フィード内の総記事数、不明な場合は-1',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-busy',
      element: { en: 'Feed container', ja: 'Feedコンテナ' },
      values: 'true | false',
      required: false,
      changeTrigger: {
        en: 'Loading starts (true), loading completes (false). Indicates when the feed is loading new content. Screen readers will wait to announce changes until loading completes.',
        ja: '読み込み開始（true）、読み込み完了（false）。フィードが新しいコンテンツを読み込み中であることを示します。スクリーンリーダーは読み込みが完了するまで変更の通知を待機します。',
      },
      reference: 'https://w3c.github.io/aria/#aria-busy',
    },
  ],

  keyboardSupport: [
    {
      key: 'Page Down',
      action: {
        en: 'Move focus to next article in the feed',
        ja: 'フォーカスをフィード内の次の記事に移動',
      },
    },
    {
      key: 'Page Up',
      action: {
        en: 'Move focus to previous article in the feed',
        ja: 'フォーカスをフィード内の前の記事に移動',
      },
    },
    {
      key: 'Ctrl + End',
      action: {
        en: 'Move focus to first focusable element after the feed',
        ja: 'フォーカスをフィードの後の最初のフォーカス可能要素に移動',
      },
    },
    {
      key: 'Ctrl + Home',
      action: {
        en: 'Move focus to first focusable element before the feed',
        ja: 'フォーカスをフィードの前の最初のフォーカス可能要素に移動',
      },
    },
  ],

  focusManagement: [
    {
      event: { en: 'Roving tabindex', ja: 'ローヴィング tabindex' },
      behavior: {
        en: 'Only one article has tabindex="0", others have tabindex="-1"',
        ja: '1つの記事のみが tabindex="0"、他は tabindex="-1"',
      },
    },
    {
      event: { en: 'Initial focus', ja: '初期フォーカス' },
      behavior: {
        en: 'First article has tabindex="0" by default',
        ja: 'デフォルトで最初の記事が tabindex="0"',
      },
    },
    {
      event: { en: 'Focus tracking', ja: 'フォーカス追跡' },
      behavior: {
        en: 'tabindex updates as focus moves between articles',
        ja: '記事間のフォーカス移動に伴い tabindex が更新される',
      },
    },
    {
      event: { en: 'No wrap', ja: 'ラップなし' },
      behavior: {
        en: 'Focus does not wrap from first to last article or vice versa',
        ja: '最初から最後、または最後から最初の記事へのラップはしない',
      },
    },
    {
      event: { en: 'Content inside articles', ja: '記事内のコンテンツ' },
      behavior: {
        en: 'Interactive elements inside articles remain keyboard accessible',
        ja: '記事内のインタラクティブ要素はキーボードでアクセス可能',
      },
    },
  ],

  additionalNotes: [
    {
      en: 'Either aria-label or aria-labelledby is required on the feed container. Use aria-labelledby when a visible heading exists.',
      ja: 'Feed コンテナには aria-label または aria-labelledby のいずれかが必要です。可視見出しがある場合は aria-labelledby を使用してください。',
    },
    {
      en: 'Why Page Up/Down instead of Arrow keys? Feeds contain long-form content like articles. Using Page Up/Down allows users to navigate between articles while Arrow keys remain available for reading within articles.',
      ja: 'なぜ矢印キーではなく Page Up/Down なのか？フィードには記事のような長文コンテンツが含まれます。Page Up/Down を使用することで、ユーザーは記事間を移動でき、矢印キーは記事内の読み上げに使用できます。',
    },
    {
      en: 'Set aria-busy to true when adding multiple articles to prevent premature announcements. Set to false after all DOM updates are complete.',
      ja: '複数の記事を追加する際に早期通知を防ぐため aria-busy を true に設定します。すべての DOM 更新が完了した後に false に設定します。',
    },
  ],

  structureNote: {
    en: 'Note: Feed is a Structure, Not a Widget. Unlike widget patterns (e.g., Listbox, Menu), the feed pattern is a structure. This means assistive technologies can use their default reading mode when navigating feed content. The feed role enables users to navigate articles using Page Up/Down while still allowing natural reading within each article.',
    ja: '注意: Feed はウィジェットではなくストラクチャー。ウィジェットパターン（例: Listbox、Menu）とは異なり、Feed パターンはストラクチャーです。これは支援技術がフィードコンテンツをナビゲートする際にデフォルトの読み上げモードを使用できることを意味します。Feed ロールにより、ユーザーは Page Up/Down で記事間を移動しながら、各記事内では自然な読み上げが可能になります。',
  },

  keyboardDocNote: {
    en: 'Important: Keyboard Documentation. The Feed pattern uses Page Up/Down for navigation, which differs from common widget patterns that use Arrow keys. As the APG specification notes: "Due to the lack of convention, providing easily discoverable keyboard interface documentation is especially important." Always display keyboard hints near the feed to help users discover these navigation options.',
    ja: '重要: キーボード操作のドキュメント。Feed パターンは Page Up/Down でナビゲートしますが、これは矢印キーを使用する一般的なウィジェットパターンとは異なります。APG 仕様には次のように記載されています: 「慣習がないため、簡単に発見できるキーボードインターフェースのドキュメントを提供することが特に重要です。」ユーザーがこれらのナビゲーションオプションを発見できるよう、フィードの近くにキーボード操作のヒントを常に表示してください。',
  },

  references: [
    {
      title: 'WAI-ARIA APG Feed Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/feed/',
    },
  ],

  // Testing documentation
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
          ja: 'コンポーネントの HTML 出力と基本的なインタラクションを検証します。テンプレートレンダリングと ARIA 属性の正確性を確認します。',
        },
        areas: [
          {
            en: 'HTML structure with feed/article roles',
            ja: 'feed/article ロールを持つ HTML 構造',
          },
          {
            en: 'ARIA attributes (aria-labelledby, aria-posinset, aria-setsize)',
            ja: 'ARIA 属性（aria-labelledby、aria-posinset、aria-setsize）',
          },
          {
            en: 'Initial tabindex values (roving tabindex)',
            ja: '初期 tabindex 値（ローヴィング tabindex）',
          },
          { en: 'Dynamic loading state (aria-busy)', ja: '動的読み込み状態（aria-busy）' },
          { en: 'CSS class application', ja: 'CSS クラスの適用' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment. These tests cover interactions that require JavaScript execution.',
          ja: '実際のブラウザ環境でコンポーネントの動作を検証します。JavaScript の実行が必要なインタラクションをカバーします。',
        },
        areas: [
          {
            en: 'Page Up/Down navigation between articles',
            ja: 'Page Up/Down による記事間のナビゲーション',
          },
          {
            en: 'Ctrl+Home/End for escaping the feed',
            ja: 'Ctrl+Home/End によるフィードからの脱出',
          },
          { en: 'Focus management and tabindex updates', ja: 'フォーカス管理と tabindex の更新' },
          { en: 'Navigation from inside article elements', ja: '記事内要素からのナビゲーション' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'ARIA Structure', ja: 'ARIA 構造' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="feed"',
            description: { en: 'Container has feed role', ja: 'コンテナが feed ロールを持つ' },
          },
          {
            name: 'role="article"',
            description: {
              en: 'Each item has article role',
              ja: '各アイテムが article ロールを持つ',
            },
          },
          {
            name: 'aria-label/labelledby (feed)',
            description: {
              en: 'Feed container has accessible name',
              ja: 'Feed コンテナがアクセシブルな名前を持つ',
            },
          },
          {
            name: 'aria-labelledby (article)',
            description: { en: 'Each article references its title', ja: '各記事がタイトルを参照' },
          },
          {
            name: 'aria-posinset',
            description: { en: 'Sequential starting from 1', ja: '1から始まる連番' },
          },
          {
            name: 'aria-setsize',
            description: { en: 'Total count or -1 if unknown', ja: '総数または不明な場合は-1' },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Keyboard Interaction', ja: 'キーボード操作' },
        testType: 'E2E',
        items: [
          {
            name: 'Page Down',
            description: { en: 'Moves focus to next article', ja: '次の記事にフォーカスを移動' },
          },
          {
            name: 'Page Up',
            description: {
              en: 'Moves focus to previous article',
              ja: '前の記事にフォーカスを移動',
            },
          },
          {
            name: 'No wrap',
            description: {
              en: 'Does not loop at first/last article',
              ja: '最初/最後の記事でループしない',
            },
          },
          {
            name: 'Ctrl+End',
            description: { en: 'Moves focus after the feed', ja: 'フィードの後にフォーカスを移動' },
          },
          {
            name: 'Ctrl+Home',
            description: {
              en: 'Moves focus before the feed',
              ja: 'フィードの前にフォーカスを移動',
            },
          },
          {
            name: 'Inside article',
            description: {
              en: 'Page Down works from inside article elements',
              ja: '記事内要素からも Page Down が動作',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Focus Management', ja: 'フォーカス管理' },
        testType: 'E2E',
        items: [
          {
            name: 'Roving tabindex',
            description: {
              en: 'Only one article has tabindex="0"',
              ja: '1つの記事のみが tabindex="0"',
            },
          },
          {
            name: 'tabindex update',
            description: {
              en: 'tabindex updates when focus moves',
              ja: 'フォーカス移動時に tabindex が更新される',
            },
          },
          {
            name: 'Initial state',
            description: {
              en: 'First article has tabindex="0" by default',
              ja: '最初の記事がデフォルトで tabindex="0"',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Dynamic Loading', ja: '動的読み込み' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-busy="false"',
            description: {
              en: 'Default state when not loading',
              ja: '読み込み中でない場合のデフォルト状態',
            },
          },
          {
            name: 'aria-busy="true"',
            description: { en: 'Set during loading', ja: '読み込み中に設定' },
          },
          {
            name: 'Focus maintenance',
            description: {
              en: 'Focus maintained during loading',
              ja: '読み込み中もフォーカスが維持される',
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
            description: { en: 'No WCAG 2.1 AA violations', ja: 'WCAG 2.1 AA 違反なし' },
          },
          {
            name: 'Loading state',
            description: {
              en: 'No axe violations during loading',
              ja: '読み込み中も axe 違反なし',
            },
          },
          {
            name: 'aria-describedby',
            description: { en: 'Present when description provided', ja: '説明がある場合に存在' },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/feed.spec.ts',
    commands: [
      {
        comment: { en: 'Run all Feed unit tests', ja: 'すべての Feed ユニットテストを実行' },
        command: 'npm run test:unit -- Feed',
      },
      {
        comment: { en: 'Run framework-specific tests', ja: 'フレームワーク別のテスト' },
        command: 'npm run test:react -- Feed.test.tsx',
      },
      {
        comment: { en: 'Run all Feed E2E tests', ja: 'すべての Feed E2E テストを実行' },
        command: 'npm run test:e2e -- feed.spec.ts',
      },
      {
        comment: { en: 'Run in UI mode', ja: 'UI モードで実行' },
        command: 'npm run test:e2e:ui -- feed.spec.ts',
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
  },

  // llm.md specific data
  testChecklist: [
    // ARIA Structure - High Priority
    { description: 'Container has role="feed"', priority: 'high', category: 'aria' },
    { description: 'Each article has role="article"', priority: 'high', category: 'aria' },
    { description: 'Feed has aria-label or aria-labelledby', priority: 'high', category: 'aria' },
    {
      description: 'Each article has aria-labelledby referencing title',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-posinset starts from 1 and is sequential',
      priority: 'high',
      category: 'aria',
    },
    { description: 'aria-setsize is total count or -1', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'Page Down moves to next article', priority: 'high', category: 'keyboard' },
    { description: 'Page Up moves to previous article', priority: 'high', category: 'keyboard' },
    {
      description: 'Ctrl+End moves focus outside feed (after)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Ctrl+Home moves focus outside feed (before)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Focus does not loop at first/last article',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Page Up/Down works when focus is inside article element',
      priority: 'high',
      category: 'keyboard',
    },

    // Focus Management - High Priority
    {
      description: 'Article elements have tabindex attribute',
      priority: 'high',
      category: 'focus',
    },
    {
      description: 'Only one article has tabindex="0" (roving)',
      priority: 'high',
      category: 'focus',
    },
    { description: 'tabindex updates when focus moves', priority: 'high', category: 'focus' },
    { description: 'Article scrolls into view on focus', priority: 'high', category: 'focus' },

    // Dynamic Loading - High Priority
    { description: 'aria-busy="true" during loading', priority: 'high', category: 'aria' },
    { description: 'aria-busy="false" after loading', priority: 'high', category: 'aria' },
    {
      description: 'aria-posinset/aria-setsize update on article addition',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Focus maintained during loading', priority: 'high', category: 'focus' },
    {
      description: 'No duplicate onLoadMore calls during loading',
      priority: 'high',
      category: 'accessibility',
    },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'No axe-core violations during loading state',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'aria-describedby set when description provided',
      priority: 'medium',
      category: 'aria',
    },
  ],

  implementationNotes: `## Structure

\`\`\`html
<div role="feed" aria-label="Blog Posts" aria-busy="false">
  <article
    tabindex="0"
    aria-labelledby="article-1-title"
    aria-describedby="article-1-desc"
    aria-posinset="1"
    aria-setsize="-1"
  >
    <h2 id="article-1-title">Article Title</h2>
    <p id="article-1-desc">Article description...</p>
    <div>Article content with <a href="#">links</a>...</div>
  </article>
  <article
    tabindex="-1"
    aria-labelledby="article-2-title"
    aria-describedby="article-2-desc"
    aria-posinset="2"
    aria-setsize="-1"
  >
    ...
  </article>
</div>
\`\`\`

## Key Differences from Listbox

| Aspect | Listbox | Feed |
|--------|---------|------|
| Category | Widget | Structure |
| Purpose | Selection | Browsing/consuming |
| Navigation | Arrow Up/Down | Page Up/Down |
| aria-selected | Required | None |
| aria-busy | None | Conditional |
| aria-posinset/setsize | Optional | Required |
| Escape | None | Ctrl+Home/End |

## Dynamic Loading

- Set \`aria-busy="true"\` before multiple DOM operations
- Set \`aria-busy="false"\` after all operations complete
- Maintain focus position during loading
- Update \`aria-posinset\`/\`aria-setsize\` when articles are added/removed
- Prevent duplicate \`onLoadMore\` calls while \`loading=true\`

## Ctrl+Home/End Implementation

- Find all focusable elements in document
- Filter to visible elements only (offsetParent !== null)
- For Ctrl+Home: find first focusable BEFORE feed container
- For Ctrl+End: find first focusable AFTER feed container
- Call focus() on found element`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const articles = [
  { id: '1', title: 'First Article', content: 'Content 1' },
  { id: '2', title: 'Second Article', content: 'Content 2' },
  { id: '3', title: 'Third Article', content: 'Content 3' },
];

// ARIA structure
it('has role="feed" on container', () => {
  render(<Feed articles={articles} aria-label="News" />);
  expect(screen.getByRole('feed')).toBeInTheDocument();
});

it('has role="article" on each article', () => {
  render(<Feed articles={articles} aria-label="News" />);
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

it('has sequential aria-posinset starting from 1', () => {
  render(<Feed articles={articles} aria-label="News" />);
  const articleElements = screen.getAllByRole('article');

  articleElements.forEach((article, index) => {
    expect(article).toHaveAttribute('aria-posinset', String(index + 1));
  });
});

// Keyboard navigation
it('Page Down moves focus to next article', async () => {
  const user = userEvent.setup();
  render(<Feed articles={articles} aria-label="News" />);

  const firstArticle = screen.getAllByRole('article')[0];
  firstArticle.focus();

  await user.keyboard('{PageDown}');

  expect(screen.getAllByRole('article')[1]).toHaveFocus();
});

// Roving tabindex
it('uses roving tabindex', () => {
  render(<Feed articles={articles} aria-label="News" />);

  const articleElements = screen.getAllByRole('article');
  const withTabindex0 = articleElements.filter(
    el => el.getAttribute('tabindex') === '0'
  );

  expect(withTabindex0).toHaveLength(1);
});

// Dynamic loading
it('sets aria-busy during loading', () => {
  render(<Feed articles={articles} aria-label="News" loading />);

  expect(screen.getByRole('feed')).toHaveAttribute('aria-busy', 'true');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has role="feed" and article elements', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const feed = page.locator('[data-testid="feed-demo"]');
  await expect(feed).toHaveAttribute('role', 'feed');

  const articles = feed.locator('article');
  expect(await articles.count()).toBeGreaterThan(0);

  // Verify aria-posinset is sequential
  const count = await articles.count();
  for (let i = 0; i < count; i++) {
    const article = articles.nth(i);
    await expect(article).toHaveAttribute('aria-posinset', String(i + 1));
  }
});

// Keyboard Navigation (Page Up/Down)
test('Page Down moves focus to next article', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const feed = page.locator('[data-testid="feed-demo"]');
  const articles = feed.locator('article');
  const firstArticle = articles.first();
  const secondArticle = articles.nth(1);

  await firstArticle.focus();
  await expect(firstArticle).toBeFocused();

  await page.keyboard.press('PageDown');
  await expect(secondArticle).toBeFocused();
});

// Roving Tabindex
test('uses roving tabindex on articles', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const feed = page.locator('[data-testid="feed-demo"]');
  const count = await feed.locator('article').count();

  // Only one article should have tabindex="0"
  await expect(feed.locator('article[tabindex="0"]')).toHaveCount(1);
  await expect(feed.locator('article[tabindex="-1"]')).toHaveCount(count - 1);
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.apg-feed-demo-wrapper')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
