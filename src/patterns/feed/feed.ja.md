# Feed Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/feed/

## 概要

フィードは、ユーザーがスクロールすると自動的に新しいコンテンツが読み込まれるページのセクション（無限スクロール）です。ウィジェットとは異なり、フィードはストラクチャーカテゴリを使用するため、支援技術がデフォルトで読み上げモードを使用できます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `feed` | コンテナ要素 | スクロールでコンテンツが追加/削除される記事の動的リスト |
| `article` | 各記事要素 | フィード内の独立したコンテンツアイテム |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-label` | [object Object] | テキスト | いいえ | フィードのアクセシブルな名前（条件付き*） |
| `aria-labelledby` | [object Object] | ID参照 | いいえ | フィードの可視見出しを参照（条件付き*） |
| `aria-labelledby` | [object Object] | ID参照 | はい | 記事タイトル要素を参照 |
| `aria-describedby` | [object Object] | ID参照 | いいえ | 記事の説明またはコンテンツを参照（推奨） |
| `aria-posinset` | [object Object] | 数値（1始まり） | はい | フィード内の記事の位置（1から開始） |
| `aria-setsize` | [object Object] | 数値または-1 | はい | フィード内の総記事数、不明な場合は-1 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-busy` | Feedコンテナ | `true` \| `false` | いいえ | 読み込み開始（true）、読み込み完了（false）。フィードが新しいコンテンツを読み込み中であることを示します。スクリーンリーダーは読み込みが完了するまで変更の通知を待機します。 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Page Down` | フォーカスをフィード内の次の記事に移動 |
| `Page Up` | フォーカスをフィード内の前の記事に移動 |
| `Ctrl + End` | フォーカスをフィードの後の最初のフォーカス可能要素に移動 |
| `Ctrl + Home` | フォーカスをフィードの前の最初のフォーカス可能要素に移動 |

## フォーカス管理

- ローヴィング tabindex: 1つの記事のみが tabindex="0"、他は tabindex="-1"
- 初期フォーカス: デフォルトで最初の記事が tabindex="0"
- フォーカス追跡: 記事間のフォーカス移動に伴い tabindex が更新される
- ラップなし: 最初から最後、または最後から最初の記事へのラップはしない
- 記事内のコンテンツ: 記事内のインタラクティブ要素はキーボードでアクセス可能

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="feed"
- [ ] Each article has role="article"
- [ ] Feed has aria-label or aria-labelledby
- [ ] Each article has aria-labelledby referencing title
- [ ] aria-posinset starts from 1 and is sequential
- [ ] aria-setsize is total count or -1
- [ ] aria-busy="true" during loading
- [ ] aria-busy="false" after loading
- [ ] aria-posinset/aria-setsize update on article addition

### 中優先度: ARIA

- [ ] aria-describedby set when description provided

### 高優先度: キーボード

- [ ] Page Down moves to next article
- [ ] Page Up moves to previous article
- [ ] Ctrl+End moves focus outside feed (after)
- [ ] Ctrl+Home moves focus outside feed (before)
- [ ] Focus does not loop at first/last article
- [ ] Page Up/Down works when focus is inside article element

### 高優先度: フォーカス管理

- [ ] Article elements have tabindex attribute
- [ ] Only one article has tabindex="0" (roving)
- [ ] tabindex updates when focus moves
- [ ] Article scrolls into view on focus
- [ ] Focus maintained during loading

### 高優先度: アクセシビリティ

- [ ] No duplicate onLoadMore calls during loading

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] No axe-core violations during loading state

## 実装ノート

## Structure

```html
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
```

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

- Set `aria-busy="true"` before multiple DOM operations
- Set `aria-busy="false"` after all operations complete
- Maintain focus position during loading
- Update `aria-posinset`/`aria-setsize` when articles are added/removed
- Prevent duplicate `onLoadMore` calls while `loading=true`

## Ctrl+Home/End Implementation

- Find all focusable elements in document
- Filter to visible elements only (offsetParent !== null)
- For Ctrl+Home: find first focusable BEFORE feed container
- For Ctrl+End: find first focusable AFTER feed container
- Call focus() on found element

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
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
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
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
});
```
