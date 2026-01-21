# Breadcrumb Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

## 概要

パンくずリストは、サイト階層内のユーザーの現在位置を示し、上位ページへのナビゲーションを提供します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `navigation` | <nav> 要素 | 支援技術にナビゲーションランドマークを提供します（<nav>の暗黙のロール） |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-label` | <nav> | "Breadcrumb"（またはローカライズされた値） | はい | スクリーンリーダー向けにナビゲーションランドマークにラベルを付けます |
| `aria-current` | [object Object] | "page" | はい | パンくずリスト内の現在のページを識別します |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-current` | パンくずリストの最後のアイテム（現在のページ） | "page" | はい | パンくずリストナビゲーション内の現在のページ位置を示します。 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | パンくずリストのリンク間でフォーカスを移動します |
| `Enter` | フォーカスされたリンクをアクティブ化します |

## テストチェックリスト

### 高優先度: ARIA

- [ ] <nav> element is used
- [ ] <nav> has aria-label="Breadcrumb" (or localized)
- [ ] Last item has aria-current="page"
- [ ] Links use native <a> elements
- [ ] Uses ordered list (<ol>) for hierarchy
- [ ] Each breadcrumb is a list item (<li>)
- [ ] Current page is identifiable (text or aria-current)

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Visual separators are decorative (hidden from AT)

## 実装ノート

Structure:
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
"Breadcrumb navigation, list, 3 items, Home, link, 1 of 3, Products, link, 2 of 3, Shoes, link, current page, 3 of 3"

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';

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
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
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
});
```
