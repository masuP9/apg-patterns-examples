# Window Splitter Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

## 概要

ウィンドウスプリッターは、2つのペイン間で移動可能なセパレーターであり、ユーザーが各ペインの相対的なサイズを変更できます。IDE、ファイルブラウザ、リサイズ可能なレイアウトで使用されます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `separator` | スプリッター要素 | ペインサイズを制御するフォーカス可能なセパレーター |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | [object Object] | 0-100 | はい | プライマリペインのサイズ（パーセンテージ） |
| `aria-valuemin` | [object Object] | number | はい | 最小値（デフォルト: 10） |
| `aria-valuemax` | [object Object] | number | はい | 最大値（デフォルト: 90） |
| `aria-controls` | [object Object] | ID reference(s) | はい | プライマリペインのID（+ セカンダリペインのIDは任意） |
| `aria-label` | [object Object] | string | はい | アクセシブルな名前 |
| `aria-labelledby` | [object Object] | ID reference | はい | 表示されるラベル要素への参照 |
| `aria-orientation` | [object Object] | `"horizontal"` \| `"vertical"` | いいえ | デフォルト: horizontal（左右分割） |
| `aria-disabled` | [object Object] | `true` \| `false` | いいえ | 無効状態 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | separator要素 | 0-100（0 = 折り畳み、50 = 半分、100 = 完全展開） | はい | 矢印キー、Home/End、Enter（折り畳み/展開）、ポインタードラッグ |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Arrow Right / Arrow Left` | 水平スプリッターを移動（増加/減少） |
| `Arrow Up / Arrow Down` | 垂直スプリッターを移動（増加/減少） |
| `Shift + Arrow` | 大きなステップで移動（デフォルト: 10%） |
| `Home` | 最小位置に移動 |
| `End` | 最大位置に移動 |
| `Enter` | プライマリペインの折り畳み/展開を切り替え |

## フォーカス管理

- Tab: スプリッターは通常のタブ順序でフォーカスを受け取る
- 無効時: スプリッターはフォーカス不可（tabindex="-1"）
- 読み取り専用時: スプリッターはフォーカス可能だが操作不可
- 折り畳み/展開後: フォーカスはスプリッターに残る

## テストチェックリスト

### 高優先度: ARIA

- [ ] Has role="separator"
- [ ] Has aria-valuenow attribute
- [ ] Has aria-valuemin attribute
- [ ] Has aria-valuemax attribute
- [ ] Has aria-controls attribute
- [ ] aria-valuenow updates on position change

### 高優先度: キーボード

- [ ] ArrowRight/Left moves horizontal splitter
- [ ] ArrowUp/Down moves vertical splitter
- [ ] Home moves to minimum
- [ ] End moves to maximum
- [ ] Enter toggles collapse/expand
- [ ] Shift+Arrow moves by large step

### 中優先度: キーボード

- [ ] RTL mode reverses arrow directions

### 高優先度: フォーカス管理

- [ ] Splitter is focusable (tabindex="0")
- [ ] Disabled splitter not focusable

### 中優先度: アクセシビリティ

- [ ] No axe-core violations

## 実装ノート

## Structure

```
Container (display: flex)
├── Primary Pane (id="primary-pane", style="width: var(--splitter-position)")
├── Separator (role="separator", tabindex="0")
│   ├── aria-valuenow="50"
│   ├── aria-valuemin="10"
│   ├── aria-valuemax="90"
│   ├── aria-controls="primary-pane secondary-pane"
│   └── aria-label="Resize panels"
└── Secondary Pane (id="secondary-pane", flex: 1)

Visual Layout (Horizontal):
┌─────────────┬──┬─────────────────────┐
│             │  │                     │
│   Primary   │▐▐│     Secondary       │
│    Pane     │▐▐│       Pane          │
│             │  │                     │
└─────────────┴──┴─────────────────────┘
              ↑
          Separator (drag handle)

Keyboard Navigation:
←  = Decrease position (RTL: increase)
→  = Increase position (RTL: decrease)
↑  = Increase position (vertical only)
↓  = Decrease position (vertical only)
Home = Set to min
End  = Set to max
Enter = Toggle collapse/expand
Shift+Arrow = Large step
```

## Important Notes

- `aria-readonly` is NOT valid for `role="separator"`. Readonly behavior must be enforced via JavaScript only.
- Direction restriction: Horizontal splitters only respond to Left/Right, vertical splitters only to Up/Down.
- CSS custom property `--splitter-position` should be set on the container and used by panes for sizing.

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA attributes test
it('has correct ARIA attributes', () => {
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      min={10}
      max={90}
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  expect(splitter).toHaveAttribute('aria-valuenow', '50');
  expect(splitter).toHaveAttribute('aria-valuemin', '10');
  expect(splitter).toHaveAttribute('aria-valuemax', '90');
  expect(splitter).toHaveAttribute('aria-controls', 'primary');
});

// Keyboard navigation test
it('moves position on ArrowRight', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      step={5}
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  splitter.focus();

  await user.keyboard('{ArrowRight}');
  expect(splitter).toHaveAttribute('aria-valuenow', '55');
});

// Collapse/expand test
it('collapses on Enter', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      collapsible
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  splitter.focus();

  await user.keyboard('{Enter}');
  expect(splitter).toHaveAttribute('aria-valuenow', '0');

  await user.keyboard('{Enter}');
  expect(splitter).toHaveAttribute('aria-valuenow', '50');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="separator" with required attributes', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();

  await expect(splitter).toHaveAttribute('role', 'separator');
  await expect(splitter).toHaveAttribute('aria-valuenow');
  await expect(splitter).toHaveAttribute('aria-valuemin');
  await expect(splitter).toHaveAttribute('aria-valuemax');
  await expect(splitter).toHaveAttribute('aria-controls');
});

// Keyboard navigation test
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();

  await splitter.focus();
  const initialValue = await splitter.getAttribute('aria-valuenow');

  await page.keyboard.press('ArrowRight');
  const newValue = await splitter.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBeGreaterThan(Number(initialValue));

  await page.keyboard.press('Home');
  const minValue = await splitter.getAttribute('aria-valuemin');
  await expect(splitter).toHaveAttribute('aria-valuenow', minValue);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();
  await splitter.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="separator"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
