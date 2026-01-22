# Landmarks Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/

## 概要

ランドマークはページの主要なセクションを識別します。8つのランドマークロールがあり、支援技術ユーザーがページ構造を効率的にナビゲートできるようになります。

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| `<header>` | banner | `<body>`の直接の子の場合のみ |
| `<nav>` | navigation | 常に |
| `<main>` | main | 常に |
| `<footer>` | contentinfo | `<body>`の直接の子の場合のみ |
| `<aside>` | complementary | 常に |
| `<section>` | region | **aria-label/labelledbyがある場合のみ** |
| `<form>` | form | **aria-label/labelledbyがある場合のみ** |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `banner` | `<header>` | サイト全体のヘッダー |
| `navigation` | `<nav>` | ナビゲーションリンク |
| `main` | `<main>` | 主要コンテンツ |
| `contentinfo` | `<footer>` | サイト全体のフッター |
| `complementary` | `<aside>` | 補完的コンテンツ |
| `region` | `<section>` | 名前付きセクション |
| `search` | `<form role="search">` | 検索機能 |
| `form` | `<form>` | フォーム領域 |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-label` | [object Object] | String | はい | ランドマークにアクセシブルな名前を提供 |
| `aria-labelledby` | [object Object] | ID reference | はい | 可視の見出し要素を参照 |

## キーボードサポート

## テストチェックリスト

### 高優先度: ARIA

- [ ] Has banner landmark (`<header>` or `role="banner"`)
- [ ] Has navigation landmark (`<nav>` or `role="navigation"`)
- [ ] Has main landmark (`<main>` or `role="main"`)
- [ ] Has contentinfo landmark (`<footer>` or `role="contentinfo"`)
- [ ] Has exactly one main landmark
- [ ] Banner is at top level (not inside article/aside/main/nav/section)
- [ ] Navigation landmarks have unique labels when multiple
- [ ] Region landmarks have accessible name (aria-label or aria-labelledby)
- [ ] Form landmarks have accessible name

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

Structure Diagram:
```
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
```

Key Points:
- Prefer semantic HTML elements over ARIA roles
- header/footer only map to banner/contentinfo at body level
- section without label is NOT a region landmark
- form without label is NOT a form landmark
- <search> element has limited browser support, use <form role="search">

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';

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
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
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
});
```
