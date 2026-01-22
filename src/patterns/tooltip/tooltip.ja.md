# Tooltip Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

## 概要

ツールチップは、要素がキーボードフォーカスを受け取ったときまたはマウスがその上にホバーしたときに、その要素に関連する情報を表示するポップアップです。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `tooltip` | ツールチップポップアップ | 要素の説明を表示するコンテキストポップアップ |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-describedby` | [object Object] | ID of tooltip | はい | ツールチップが表示されている時のみ。トリガー要素にアクセシブルな説明を提供するために、ツールチップ要素を参照します。 |
| `aria-hidden` | [object Object] | ``true`` \| ``false`` | いいえ | ツールチップが支援技術から隠されているかどうかを示します。デフォルトはtrue。 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Escape` | ツールチップを閉じる |
| `Tab` | 標準のフォーカスナビゲーション。トリガーがフォーカスを受け取るとツールチップが表示される |

## フォーカス管理

- ツールチップ表示: ツールチップはフォーカスを受け取らない - APGに従い、ツールチップはフォーカス可能であってはいけません。インタラクティブなコンテンツが必要な場合は、DialogまたはPopoverパターンを使用してください。
- トリガーフォーカス: フォーカスが表示をトリガーする - トリガー要素がフォーカスを受け取ると、設定された遅延後にツールチップが表示されます。
- トリガーぼかし: ぼかしがツールチップを非表示にする - フォーカスがトリガー要素を離れると、ツールチップは非表示になります。

## テストチェックリスト

### 高優先度: キーボード

- [ ] Escape closes tooltip
- [ ] Tooltip appears on trigger focus
- [ ] Tooltip hides on trigger blur

### 高優先度: ARIA

- [ ] Tooltip has `role="tooltip"`
- [ ] Trigger has `aria-describedby` when tooltip visible
- [ ] `aria-describedby` removed when tooltip hidden
- [ ] Tooltip has correct `aria-hidden` state

### 高優先度: フォーカス管理

- [ ] Tooltip is NOT focusable
- [ ] Focus stays on trigger when tooltip shows
- [ ] Tab moves to next element (not into tooltip)

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

### Important Constraints

1. **Tooltip never receives focus** - Must not be focusable
2. **No interactive content** - Use Dialog/Popover if interaction needed
3. **Configurable delay** - Prevents accidental activation

### Structure

```
        ┌─────────────────┐
        │ Tooltip content │  ← role="tooltip", id="tip-1"
        └────────┬────────┘
                 │
    ┌────────────▼────────────┐
    │ [Trigger Element]       │  ← aria-describedby="tip-1" (when visible)
    └─────────────────────────┘
```

### State Flow

1. Initial: tooltip hidden, aria-describedby absent
2. Focus/Hover: tooltip visible, aria-describedby set
3. Blur/Leave/Escape: tooltip hidden, aria-describedby removed

### Do NOT

- Put focusable elements in tooltip
- Make tooltip itself focusable
- Use for content requiring interaction

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Show on focus
it('shows tooltip on focus', async () => {
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  trigger.focus();

  expect(await screen.findByRole('tooltip')).toBeVisible();
});

// Escape closes
it('closes on Escape', async () => {
  const user = userEvent.setup();
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  trigger.focus();
  await screen.findByRole('tooltip');

  await user.keyboard('{Escape}');

  expect(screen.queryByRole('tooltip')).not.toBeVisible();
});

// aria-describedby test
it('sets aria-describedby when visible', async () => {
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  expect(trigger).not.toHaveAttribute('aria-describedby');

  trigger.focus();
  const tooltip = await screen.findByRole('tooltip');

  expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('tooltip has role="tooltip" and aria-describedby linkage', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  // Hover to show tooltip
  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });
  await expect(tooltip).toHaveRole('tooltip');

  // Check aria-describedby linkage
  const tooltipId = await tooltip.getAttribute('id');
  await expect(trigger).toHaveAttribute('aria-describedby', tooltipId!);
});

// Keyboard interaction test
test('hides tooltip on Escape key', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });

  await page.keyboard.press('Escape');
  await expect(tooltip).not.toBeVisible();
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  // Show tooltip
  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });

  const results = await new AxeBuilder({ page })
    .include('.apg-tooltip-trigger')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
