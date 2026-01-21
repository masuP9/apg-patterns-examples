# Accordion Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

## 概要

アコーディオンは、垂直に積み重ねられたインタラクティブな見出しのセットで、各見出しが関連するコンテンツセクションを表示します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `heading` | ヘッダーラッパー (h2-h6) | アコーディオントリガーボタンを含む |
| `button` | ヘッダートリガー | パネルの表示/非表示を切り替える対話要素 |
| `region` | パネル (オプション) | ヘッダーと関連付けられたコンテンツエリア (6個以上のパネルでは省略) |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-level` | heading | 2 - 6 | はい | headingLevel プロパティ |
| `aria-controls` | button | 関連付けられたパネルへのID参照 | はい | 自動生成 |
| `aria-labelledby` | [object Object] | ヘッダーボタンへのID参照 | はい | 自動生成 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-expanded` | button 要素 | `true` \| `false` | はい | クリック、Enter、Space |
| `aria-disabled` | button 要素 | `true` \| `false` | いいえ | 無効化する場合のみ |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | 次のフォーカス可能な要素にフォーカスを移動 |
| `Space / Enter` | フォーカスされたアコーディオンヘッダーの展開/折り畳みを切り替え |
| `Arrow Down` | 次のアコーディオンヘッダーにフォーカスを移動 (オプション) |
| `Arrow Up` | 前のアコーディオンヘッダーにフォーカスを移動 (オプション) |
| `Home` | 最初のアコーディオンヘッダーにフォーカスを移動 (オプション) |
| `End` | 最後のアコーディオンヘッダーにフォーカスを移動 (オプション) |

## フォーカス管理

- ヘッダーボタン: ボタン要素経由でフォーカス可能
- 矢印キー: ヘッダー間をナビゲート（無効化されたものはスキップ）
- 端: フォーカスは端でループしない

## テストチェックリスト

### 高優先度: キーボード

- [ ] Enter/Space toggles panel expansion
- [ ] ArrowDown moves to next header
- [ ] ArrowUp moves to previous header
- [ ] Home moves to first header
- [ ] End moves to last header
- [ ] Disabled headers are skipped

### 高優先度: ARIA

- [ ] Button has aria-expanded matching panel state
- [ ] Button has aria-controls referencing panel id
- [ ] Panel (if region) has aria-labelledby referencing button
- [ ] 6 or fewer panels have role="region"
- [ ] 7+ panels omit role="region"
- [ ] Disabled items have aria-disabled="true"

### 高優先度: フォーカス管理

- [ ] Focus stays on header after toggle
- [ ] Arrow keys skip disabled headers

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Proper heading level hierarchy

## 実装ノート

## Structure

```
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
```

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
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
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
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
  const panel = page.locator(`[id="${controlsId}"]`);
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
});
```
