# Switch Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/switch/

## 概要

スイッチはチェック済み/未チェックではなく、オン/オフの値を表すチェックボックスの一種です。チェックボックスの代わりにrole="switch"とaria-checkedを使用します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `switch` | スイッチ要素 | ユーザーがオン/オフの2つの値のいずれかを選択できる入力ウィジェット |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-checked` | switch 要素 | `true` \| `false` | はい | クリック、Enter、Space |
| `aria-disabled` | switch 要素 | `true` \| `undefined` | いいえ | 無効化時のみ |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Space` | スイッチの状態を切り替え（オン/オフ） |
| `Enter` | スイッチの状態を切り替え（オン/オフ） |

## テストチェックリスト

### 高優先度: キーボード

- [ ] Space toggles state
- [ ] Enter toggles state
- [ ] Tab navigates to switch
- [ ] Disabled switch behavior correct

### 高優先度: ARIA

- [ ] Has role="switch"
- [ ] Has aria-checked attribute
- [ ] aria-checked toggles between true and false
- [ ] Disabled state has aria-disabled="true"
- [ ] Has accessible name

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] State distinguishable without color alone

## 実装ノート

## Accessible Naming

One of these is required:
- **Visible label** (recommended) - Child content as accessible name
- `aria-label` - Invisible label
- `aria-labelledby` - Reference to external label element

## Visual Design (WCAG 1.4.1)

Do not rely solely on color to indicate state:
- **Thumb position** - Left = off, Right = on
- **Checkmark icon** - Visible only when on
- **Forced colors mode** - Use system colors for Windows High Contrast

## Structure

```
<button role="switch" aria-checked="false">
  <span class="switch-track">
    <span class="switch-thumb" />
  </span>
  Enable notifications
</button>

Visual States:
┌─────────┬────────────┐
│ OFF     │ ON         │
├─────────┼────────────┤
│ [○    ] │ [    ✓]   │
│ Left    │ Right+icon │
└─────────┴────────────┘

Switch vs Checkbox:
- Switch: immediate effect, on/off semantics
- Checkbox: may require form submit, checked/unchecked semantics
```

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Toggle test
it('toggles aria-checked on click', async () => {
  const user = userEvent.setup();
  render(<Switch>Enable</Switch>);

  const switchEl = screen.getByRole('switch');
  expect(switchEl).toHaveAttribute('aria-checked', 'false');

  await user.click(switchEl);
  expect(switchEl).toHaveAttribute('aria-checked', 'true');
});

// Keyboard test
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<Switch>Enable</Switch>);

  const switchEl = screen.getByRole('switch');
  switchEl.focus();

  await user.keyboard(' ');
  expect(switchEl).toHaveAttribute('aria-checked', 'true');
});

// Accessible name test
it('has accessible name', () => {
  render(<Switch>Enable notifications</Switch>);
  expect(screen.getByRole('switch', { name: /enable notifications/i }))
    .toBeInTheDocument();
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="switch" and aria-checked attribute', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switches = page.locator('[role="switch"]');
  const count = await switches.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(switches.nth(i)).toHaveAttribute('role', 'switch');
    const ariaChecked = await switches.nth(i).getAttribute('aria-checked');
    expect(['true', 'false']).toContain(ariaChecked);
  }
});

// Toggle behavior test
test('toggles aria-checked on click and Space key', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switchEl = page.locator('[role="switch"]').first();
  const initialState = await switchEl.getAttribute('aria-checked');

  // Click toggle
  await switchEl.click();
  expect(await switchEl.getAttribute('aria-checked')).not.toBe(initialState);

  // Space key toggle
  await switchEl.focus();
  await page.keyboard.press('Space');
  expect(await switchEl.getAttribute('aria-checked')).toBe(initialState);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switches = page.locator('[role="switch"]');
  await switches.first().waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="switch"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
