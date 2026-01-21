# Meter Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/meter/

## 概要

メーターは、定義された範囲内の数値をグラフィカルなゲージとして表示します。バッテリーレベル、ストレージ使用量、CPU負荷などに使用されます。インタラクティブではありません（キーボード/フォーカス管理は不要）。

## ネイティブHTML vs カスタム実装

| ユースケース | 推奨 |
| --- | --- |
| Simple value display | Native <meter> |
| Custom styling needed | Custom role="meter" |
| low/high/optimum thresholds | Native <meter> |
| Full visual control | Custom implementation |

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| Basic value display | Recommended | Not needed |
| JavaScript disabled support | Works natively | Requires fallback |
| low/high/optimum thresholds | Built-in support | Manual implementation |
| Custom styling | Limited (browser-dependent) | Full control |
| Consistent cross-browser appearance | Varies by browser | Consistent |
| Dynamic value updates | Works natively | Full control |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `meter` | コンテナ要素 | 既知の範囲内のスカラー値を表示するメーターとして要素を識別します。 (required) |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | [object Object] | 数値（現在の値） | はい | aria-valueminとaria-valuemaxの間である必要があります |
| `aria-valuemin` | [object Object] | 数値（デフォルト: 0） | はい | メーターの最小許容値を指定します |
| `aria-valuemax` | [object Object] | 数値（デフォルト: 100） | はい | メーターの最大許容値を指定します |
| `aria-valuetext` | [object Object] | 文字列（例: "75% complete"） | いいえ | 現在の値に対する人間が読みやすいテキストの代替を提供します。数値だけでは十分な意味を伝えられない場合に使用します。 |
| `aria-label` | [object Object] | 文字列 | はい | メーターに見えないラベルを提供します |
| `aria-labelledby` | [object Object] | ID参照 | はい | 外部要素をラベルとして参照します |

## キーボードサポート

## テストチェックリスト

### 高優先度: ARIA

- [ ] role="meter" exists
- [ ] aria-valuenow set to current value
- [ ] aria-valuemin always set (even with default)
- [ ] aria-valuemax always set (even with default)
- [ ] Accessible name required (label/aria-label/aria-labelledby)
- [ ] aria-valuetext set when valueText or format provided
- [ ] Value clamped to min/max range when clamp=true

### 中優先度: ARIA

- [ ] Decimal values handled correctly
- [ ] Negative min/max range works
- [ ] Large values don't break display
- [ ] valueText overrides format

### 高優先度: アクセシビリティ

- [ ] No axe-core violations

### 高優先度: フォーカス管理

- [ ] Not focusable by default (no tabIndex)

### 中優先度: フォーカス管理

- [ ] tabIndex opt-in makes it focusable

## 実装ノート

### Props Design (Exclusive Types)

```typescript
// Label: one of these required (exclusive)
type LabelProps =
  | { label: string; 'aria-label'?: never; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label': string; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label'?: never; 'aria-labelledby': string };

// ValueText: exclusive with format
type ValueTextProps =
  | { valueText: string; format?: never }
  | { valueText?: never; format?: string }
  | { valueText?: never; format?: never };

export type MeterProps = {
  value: number;
  min?: number;      // default: 0
  max?: number;      // default: 100
  clamp?: boolean;   // default: true
  showValue?: boolean; // default: true
  id?: string;
  className?: string;
  tabIndex?: number;
  'aria-describedby'?: string;
} & LabelProps & ValueTextProps;
```

### Structure

```
┌─────────────────────────────────────────────────────────┐
│ <div> role="meter"                                      │
│   aria-valuenow="75"                                    │
│   aria-valuemin="0"                                     │
│   aria-valuemax="100"                                   │
│   aria-valuetext="75%"                                  │
│   aria-label="CPU Usage"                                │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ <span> label (if visible)                           │ │
│ └─────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ <div> class="meter-track" aria-hidden="true"        │ │
│ │   <div> class="meter-fill" style="width: 75%"       │ │
│ └─────────────────────────────────────────────────────┘ │
│ <span> class="meter-value" aria-hidden="true">75%</span>│
└─────────────────────────────────────────────────────────┘
```

### Value Clamping

```typescript
const clampNumber = (value: number, min: number, max: number, clamp: boolean) => {
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    return value; // Let validation handle non-finite
  }
  return clamp ? Math.min(max, Math.max(min, value)) : value;
};
```

### Format Prop

The `format` prop accepts a string pattern for displaying values. Available placeholders:
- `{value}` - Current value
- `{min}` - Minimum value
- `{max}` - Maximum value

```typescript
// Examples
<Meter value={75} format="{value}%" />           // "75%"
<Meter value={3} max={5} format="{value} of {max}" />   // "3 of 5"
```

### Common Pitfalls

1. **Missing accessible name**: Always require label, aria-label, or aria-labelledby
2. **Conflicting props**: Use TypeScript exclusive types to prevent aria-valuenow override via rest props
3. **Visual-ARIA mismatch**: Ensure visual bar width matches aria-valuenow percentage
4. **Non-finite values**: Validate and warn on NaN/Infinity

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Role test
it('has role="meter"', () => {
  render(<Meter value={50} aria-label="Progress" />);
  expect(screen.getByRole('meter')).toBeInTheDocument();
});

// ARIA values test
it('has correct aria-valuenow/min/max', () => {
  render(<Meter value={75} min={0} max={100} aria-label="CPU" />);
  const meter = screen.getByRole('meter');
  expect(meter).toHaveAttribute('aria-valuenow', '75');
  expect(meter).toHaveAttribute('aria-valuemin', '0');
  expect(meter).toHaveAttribute('aria-valuemax', '100');
});

// Clamping test
it('clamps value to min/max range', () => {
  render(<Meter value={150} min={0} max={100} aria-label="Progress" />);
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100');
});

// aria-valuetext test
it('sets aria-valuetext when valueText provided', () => {
  render(<Meter value={75} valueText="75 percent" aria-label="Progress" />);
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '75 percent');
});

// format test
it('uses format for aria-valuetext', () => {
  render(<Meter value={75} min={0} max={100} format="{value}%" aria-label="Progress" />);
  expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '75%');
});

// Not focusable by default
it('is not focusable by default', () => {
  render(<Meter value={50} aria-label="Progress" />);
  expect(screen.getByRole('meter')).not.toHaveAttribute('tabindex');
});

// axe test
it('has no axe violations', async () => {
  const { container } = render(<Meter value={50} aria-label="Progress" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Negative range test
it('handles negative min/max range', () => {
  render(<Meter value={0} min={-50} max={50} aria-label="Temperature" />);
  const meter = screen.getByRole('meter');
  expect(meter).toHaveAttribute('aria-valuenow', '0');
  expect(meter).toHaveAttribute('aria-valuemin', '-50');
  expect(meter).toHaveAttribute('aria-valuemax', '50');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/meter/react/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA attributes', async ({ page }) => {
  const meters = page.locator('[role="meter"]');
  const count = await meters.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    const meter = meters.nth(i);

    // Required attributes
    const valueNow = await meter.getAttribute('aria-valuenow');
    const valueMin = await meter.getAttribute('aria-valuemin');
    const valueMax = await meter.getAttribute('aria-valuemax');

    expect(valueNow).not.toBeNull();
    expect(valueMin).not.toBeNull();
    expect(valueMax).not.toBeNull();

    // Value should be within range
    expect(Number(valueNow)).toBeGreaterThanOrEqual(Number(valueMin));
    expect(Number(valueNow)).toBeLessThanOrEqual(Number(valueMax));

    // Must have accessible name
    const ariaLabel = await meter.getAttribute('aria-label');
    const ariaLabelledby = await meter.getAttribute('aria-labelledby');
    expect(ariaLabel !== null || ariaLabelledby !== null).toBe(true);
  }
});

// Non-interactive behavior test
test('is not focusable by default', async ({ page }) => {
  const meters = page.locator('[role="meter"]');
  const count = await meters.count();

  for (let i = 0; i < count; i++) {
    const meter = meters.nth(i);
    const tabindex = await meter.getAttribute('tabindex');
    // Should not have tabindex, or if present should be -1
    if (tabindex !== null) {
      expect(Number(tabindex)).toBe(-1);
    }
  }
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.locator('[role="meter"]').first().waitFor();
  const results = await new AxeBuilder({ page }).include('[role="meter"]').analyze();
  expect(results.violations).toEqual([]);
});
```
