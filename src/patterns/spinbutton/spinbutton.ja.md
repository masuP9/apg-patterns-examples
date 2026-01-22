# Spinbutton Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

## 概要

スピンボタンは、ユーザーが離散的なセットまたは範囲から値を選択できるようにします。現在の値を表示するテキストフィールドと、オプションの増減ボタンを含みます。直接テキスト入力とキーボードナビゲーションをサポートします。

## ネイティブHTML vs カスタム実装

| ユースケース | 推奨 |
| --- | --- |
| Simple numeric input | Native <input type="number"> |
| Custom styling needed | Custom role="spinbutton" |
| Consistent keyboard behavior | Custom (browser varies) |
| aria-valuetext needed | Custom implementation |

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| Basic numeric input | Recommended | Not needed |
| JavaScript disabled support | Works natively | Requires fallback |
| Built-in validation | Native support | Manual implementation |
| Custom button styling | Limited (browser-dependent) | Full control |
| Consistent cross-browser appearance | Varies by browser | Consistent |
| Custom step/large step behavior | Basic step only | PageUp/PageDown support |
| No min/max limits | Requires omitting attributes | Explicit undefined support |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `spinbutton` | 入力要素 | ユーザーがインクリメント/デクリメントまたは直接入力によって、離散的なセットまたは範囲から値を選択できるスピンボタンとして要素を識別します。 (required) |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | spinbutton | 数値（現在の値） | はい | 値が変更されたとき（キーボード、ボタンクリック、またはテキスト入力）、即座に更新する必要があります |
| `aria-valuemin` | spinbutton | 数値 | いいえ | 最小値が定義されている場合のみ設定します。最小制限が存在しない場合は、属性を完全に省略してください。 |
| `aria-valuemax` | spinbutton | 数値 | いいえ | 最大値が定義されている場合のみ設定します。最大制限が存在しない場合は、属性を完全に省略してください。 |
| `aria-valuetext` | spinbutton | 文字列（例: "5 items", "3 of 10"） | いいえ | 現在の値に対する人間が読めるテキストの代替を提供します。数値だけでは十分な意味を伝えられない場合に使用します。 |
| `aria-disabled` | spinbutton | `true` \| `false` | いいえ | スピンボタンが無効化されており、インタラクティブでないことを示します。 |
| `aria-readonly` | spinbutton | `true` \| `false` | いいえ | スピンボタンが読み取り専用であることを示します。ユーザーはHome/Endキーでナビゲーションできますが、値を変更することはできません。 |
| `aria-label` | spinbutton | 文字列 | はい | スピンボタンに不可視のラベルを提供します |
| `aria-labelledby` | spinbutton | ID参照 | はい | 外部要素をラベルとして参照します |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `ArrowUp` | 値を1ステップ増やします |
| `ArrowDown` | 値を1ステップ減らします |
| `Home` | 値を最小値に設定します（最小値が定義されている場合のみ） |
| `End` | 値を最大値に設定します（最大値が定義されている場合のみ） |
| `Page Up` | 値を大きなステップで増やします（デフォルト: step × 10） |
| `Page Down` | 値を大きなステップで減らします（デフォルト: step × 10） |

## フォーカス管理

- 入力要素: tabindex="0"
- 無効化された入力: tabindex="-1"
- 増加/減少ボタン: tabindex="-1"（タブ順序に含まれない）
- ボタンクリック: フォーカスはスピンボタンに留まります（ボタンには移動しません）

## テストチェックリスト

### 高優先度: ARIA

- [ ] role="spinbutton" exists on input
- [ ] aria-valuenow set to current value
- [ ] aria-valuemin only set when min is defined
- [ ] aria-valuemax only set when max is defined
- [ ] Accessible name required (label/aria-label/aria-labelledby)
- [ ] aria-valuetext set when valueText/format provided
- [ ] aria-disabled="true" when disabled
- [ ] aria-readonly="true" when readOnly

### 中優先度: ARIA

- [ ] Direct text input accepted
- [ ] Value validated and clamped on blur

### 高優先度: キーボード

- [ ] ArrowUp increases value by step
- [ ] ArrowDown decreases value by step
- [ ] Home sets value to min (only when min defined)
- [ ] End sets value to max (only when max defined)
- [ ] Page Up increases by large step
- [ ] Page Down decreases by large step
- [ ] Value stops at min/max boundaries (no wrapping)
- [ ] Keys have no effect when disabled

### 中優先度: キーボード

- [ ] IME composition handled correctly

### 高優先度: フォーカス管理

- [ ] Input is focusable (tabindex="0")
- [ ] Input not focusable when disabled (tabindex="-1")
- [ ] Buttons have tabindex="-1"
- [ ] Focus stays on input after button click

### 中優先度: アクセシビリティ

- [ ] No axe-core violations

## 実装ノート

### Props Design

```typescript
// Label: one of these required (exclusive)
type LabelProps =
  | { label: string; 'aria-label'?: never; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label': string; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label'?: never; 'aria-labelledby': string };

type SpinbuttonBaseProps = {
  defaultValue?: number;
  min?: number;           // default: undefined (no limit)
  max?: number;           // default: undefined (no limit)
  step?: number;          // default: 1
  largeStep?: number;     // default: step * 10
  disabled?: boolean;
  readOnly?: boolean;
  showButtons?: boolean;  // default: true
  onValueChange?: (value: number) => void;
};

export type SpinbuttonProps = SpinbuttonBaseProps & LabelProps;
```

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│ <div class="apg-spinbutton">                                │
│   <span class="apg-spinbutton-label">Label</span>           │
│   <div class="apg-spinbutton-controls">  ← focus ring here  │
│     <button tabindex="-1" aria-label="Decrement">−</button> │
│     <input                                                  │
│       role="spinbutton"                                     │
│       tabindex="0"                                          │
│       aria-valuenow="5"                                     │
│       aria-valuemin="0"      (only if min defined)          │
│       aria-valuemax="100"    (only if max defined)          │
│       inputmode="numeric"                                   │
│     />                                                      │
│     <button tabindex="-1" aria-label="Increment">+</button> │
│   </div>                                                    │
│ </div>                                                      │
└─────────────────────────────────────────────────────────────┘
```

### Common Pitfalls

1. **Missing accessible name**: Always require label, aria-label, or aria-labelledby
2. **Unconditional aria-valuemin/max**: Only set when min/max props are defined
3. **IME input handling**: Don't update aria-valuenow during composition
4. **Button focus steal**: Buttons must not receive focus on click
5. **Floating-point precision**: Round to step to avoid precision errors

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Role test
it('has role="spinbutton"', () => {
  render(<Spinbutton aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).toBeInTheDocument();
});

// ARIA values test
it('has aria-valuenow set to current value', () => {
  render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuenow', '5');
});

// No aria-valuemin when undefined
it('does not have aria-valuemin when min is undefined', () => {
  render(<Spinbutton aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-valuemin');
});

// Keyboard: ArrowUp
it('increases value on ArrowUp', async () => {
  const user = userEvent.setup();
  render(<Spinbutton defaultValue={5} step={1} aria-label="Quantity" />);
  const spinbutton = screen.getByRole('spinbutton');

  await user.click(spinbutton);
  await user.keyboard('{ArrowUp}');

  expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
});

// axe test
it('has no axe violations', async () => {
  const { container } = render(<Spinbutton aria-label="Quantity" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  const spinbutton = page.getByRole('spinbutton').first();

  await expect(spinbutton).toHaveRole('spinbutton');
  await expect(spinbutton).toHaveAttribute('aria-valuenow');
});

// Keyboard interaction test
test('ArrowUp increases value', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  const spinbutton = page.getByRole('spinbutton').first();

  await spinbutton.focus();
  const initialValue = await spinbutton.getAttribute('aria-valuenow');
  await page.keyboard.press('ArrowUp');

  const newValue = await spinbutton.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBe(Number(initialValue) + 1);
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  await page.getByRole('spinbutton').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('[role="spinbutton"]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```
