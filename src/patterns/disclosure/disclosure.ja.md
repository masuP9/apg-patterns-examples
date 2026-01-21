# Disclosure Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

## 概要

ディスクロージャーは、コンテンツセクションの表示/非表示を制御するボタンです。最もシンプルな展開/折りたたみパターンの一つです。

## ネイティブHTML vs カスタム実装

| ユースケース | 推奨 |
| --- | --- |
| Simple toggle content | Native <details>/<summary> |
| JavaScript disabled support | Native <details>/<summary> |
| Smooth animations | Custom implementation |
| External state control | Custom implementation |
| Custom styling | Custom implementation |

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| Simple toggle content | Recommended | Not needed |
| JavaScript disabled support | Works natively | Requires fallback |
| Smooth animations | Limited support | Full control |
| External state control | Limited | Full control |
| Custom styling | Browser-dependent | Full control |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `button` | トリガー要素 | パネルの表示を切り替えるインタラクティブな要素（ネイティブの<button>を使用） |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-controls` | button | パネルへのID参照 | はい | ボタンと制御対象のパネルを関連付けます |
| `aria-hidden` | panel | `true` \| `false` | いいえ | 折りたたまれた際にパネルを支援技術から隠します |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-expanded` | button 要素 | `true` \| `false` | はい | Click、Enter、Space |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | ディスクロージャーボタンにフォーカスを移動します |
| `Space / Enter` | ディスクロージャーパネルの表示を切り替えます |

## テストチェックリスト

### 高優先度: ARIA

- [ ] Trigger is a <button> element
- [ ] Button has aria-expanded attribute
- [ ] aria-expanded toggles between true and false
- [ ] Button has aria-controls referencing panel id
- [ ] Panel content hidden when collapsed

### 高優先度: クリック動作

- [ ] Click toggles panel visibility

### 高優先度: キーボード

- [ ] Enter toggles panel visibility
- [ ] Space toggles panel visibility

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```html
<button aria-expanded="false" aria-controls="content-1">Show details</button>
<div id="content-1" hidden>Panel content here...</div>
```

## Visibility Methods

1. **hidden attribute (preferred)**
   ```html
   <div id="panel" hidden>...</div>
   ```

2. **CSS display: none**
   ```css
   .panel[aria-hidden="true"] { display: none; }
   ```

3. **aria-hidden + CSS**
   ```html
   <div aria-hidden="true" class="collapsed">...</div>
   ```

## Disclosure vs Accordion

| Disclosure           | Accordion                                 |
| -------------------- | ----------------------------------------- |
| Single panel         | Multiple panels                           |
| No heading structure | Uses headings                             |
| Independent          | Grouped behavior (optional single-expand) |
| Simple show/hide     | Arrow key navigation between headers      |

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
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
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('button has aria-controls referencing panel id', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();

  const ariaControls = await button.getAttribute('aria-controls');
  expect(ariaControls).not.toBeNull();

  const panel = page.locator(`[id="${ariaControls}"]`);
  await expect(panel).toBeAttached();
});

// Toggle behavior test
test('toggles aria-expanded and panel visibility on click', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();
  const panelId = await button.getAttribute('aria-controls');
  const panel = page.locator(`[id="${panelId}"]`);

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
});
```
