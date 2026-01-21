# Toggle Button Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/button/#toggle-button

## 概要

トグルボタンは「押されている」または「押されていない」の2つの状態を持つボタンです。aria-pressedを使用して支援技術に状態を伝えます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `button` | ボタン要素 | アクティブ化されたときにアクションをトリガーするウィジェットを示す |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-pressed` | ボタン | `true` \| `false` | はい | クリック、Enter、Space |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Space` | ボタンの状態を切り替える |
| `Enter` | ボタンの状態を切り替える |

## テストチェックリスト

### 高優先度: キーボード

- [ ] Space toggles state
- [ ] Enter toggles state
- [ ] Tab navigates to button
- [ ] Disabled button is skipped by Tab

### 高優先度: ARIA

- [ ] Has role="button" (implicit for <button>)
- [ ] Has aria-pressed attribute
- [ ] aria-pressed toggles between true and false
- [ ] Has type="button" (prevents form submission)
- [ ] Disabled state uses disabled attribute

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Has accessible name (visible text or aria-label)

## 実装ノート

## Structure

```
<button type="button" aria-pressed="false">
  Mute
</button>

State Changes:
- Initial: aria-pressed="false" (not pressed)
- After click: aria-pressed="true" (pressed)

Use type="button":
- Prevents accidental form submission
- Native <button> defaults to type="submit"

Tri-state (rare):
- aria-pressed="mixed" for partially selected state
- Example: "Select All" when some items selected
```

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Toggle on click
it('toggles aria-pressed on click', async () => {
  const user = userEvent.setup();
  render(<ToggleButton>Mute</ToggleButton>);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-pressed', 'false');

  await user.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'true');

  await user.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'false');
});

// Keyboard toggle
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<ToggleButton>Mute</ToggleButton>);

  const button = screen.getByRole('button');
  button.focus();

  await user.keyboard(' ');
  expect(button).toHaveAttribute('aria-pressed', 'true');
});

// Has type="button"
it('has type="button"', () => {
  render(<ToggleButton>Mute</ToggleButton>);
  expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const button = page.locator('button[aria-pressed]').first();
  await expect(button).toHaveRole('button');
  await expect(button).toHaveAttribute('type', 'button');

  const ariaPressed = await button.getAttribute('aria-pressed');
  expect(['true', 'false', 'mixed']).toContain(ariaPressed);
});

// Click toggle test
test('toggles aria-pressed on click', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const button = page.locator('button[aria-pressed]').first();
  const initialState = await button.getAttribute('aria-pressed');

  await button.click();
  const newState = await button.getAttribute('aria-pressed');
  expect(newState).not.toBe(initialState);

  await button.click();
  const finalState = await button.getAttribute('aria-pressed');
  expect(finalState).toBe(initialState);
});

// Keyboard toggle test
test('toggles on Space and Enter keys', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const button = page.locator('button[aria-pressed]').first();
  const initialState = await button.getAttribute('aria-pressed');

  await button.focus();
  await page.keyboard.press('Space');
  expect(await button.getAttribute('aria-pressed')).not.toBe(initialState);

  await page.keyboard.press('Enter');
  expect(await button.getAttribute('aria-pressed')).toBe(initialState);
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/toggle-button/react/demo/');

  const results = await new AxeBuilder({ page })
    .include('button[aria-pressed]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```
