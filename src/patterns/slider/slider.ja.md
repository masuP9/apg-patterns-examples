# Slider Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

## 概要

スライダーは、ユーザーが特定の範囲内から値を選択する入力ウィジェットです。スライダーにはトラックに沿って移動させて値を変更できるつまみがあります。

### ネイティブ vs カスタム比較

| 機能 | ネイティブ | カスタム |
| --- | --- | --- |
| 基本的な値の選択 | 推奨 | 不要 |
| キーボードサポート | 組み込み | 手動実装 |
| JavaScript無効時のサポート | ネイティブで動作 | フォールバック必要 |
| フォーム統合 | 組み込み | 手動実装 |
| カスタムスタイリング | 限定的（疑似要素） | 完全な制御 |
| ブラウザ間で一貫した外観 | 大きく異なる | 一貫性あり |
| 垂直方向 | 現行ブラウザで対応（古いブラウザはフォールバック） | 完全な制御 |

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `slider` | つまみ要素 | ユーザーが範囲内から値を選択できるスライダーとして要素を識別します |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | [object Object] | Number | はい | キーボードまたはポインターによる値変更時に動的に更新 |
| `aria-valuemin` | [object Object] | Number | はい | デフォルト: 0 |
| `aria-valuemax` | [object Object] | Number | はい | デフォルト: 100 |
| `aria-valuetext` | [object Object] | String | はい | 例: "50%", "Medium", "3 of 5 stars" |
| `aria-orientation` | [object Object] | `"horizontal"` \| `"vertical"` | いいえ | デフォルト: horizontal（暗黙的）。垂直スライダーの場合のみ設定。 |
| `aria-disabled` | [object Object] | `true` \| `undefined` | いいえ | 無効化時のみ設定 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Right Arrow` | 値を1ステップ増加させる |
| `Up Arrow` | 値を1ステップ増加させる |
| `Left Arrow` | 値を1ステップ減少させる |
| `Down Arrow` | 値を1ステップ減少させる |
| `Home` | スライダーを最小値に設定する |
| `End` | スライダーを最大値に設定する |
| `Page Up` | 値を大きいステップで増加させる（デフォルト: step * 10） |
| `Page Down` | 値を大きいステップで減少させる（デフォルト: step * 10） |

## テストチェックリスト

### 高優先度: ARIA

- [ ] Has role="slider"
- [ ] Has aria-valuenow attribute
- [ ] Has aria-valuemin attribute
- [ ] Has aria-valuemax attribute
- [ ] aria-valuenow updates on value change
- [ ] Has accessible name

### 高優先度: キーボード

- [ ] Right/Up Arrow increases value
- [ ] Left/Down Arrow decreases value
- [ ] Home sets to minimum
- [ ] End sets to maximum
- [ ] Page Up/Down changes value by large step
- [ ] Value clamped to min/max

### 中優先度: アクセシビリティ

- [ ] No axe-core violations
- [ ] Focus indicator visible

## 実装ノート

## Native HTML Alternative

Consider using `<input type="range">` first:
```html
<label for="volume">Volume</label>
<input type="range" id="volume" min="0" max="100" value="50">
```

Use custom slider when:
- Custom styling beyond pseudo-elements
- Consistent cross-browser appearance
- Complex visual feedback during interaction

## Accessible Naming

One of these is required:
- **Visible label** (recommended) - Using label element or visible text
- `aria-label` - Invisible label
- `aria-labelledby` - Reference to external label element

## Structure

```
<div class="slider-container">
  <div role="slider"
       tabindex="0"
       aria-valuenow="50"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-label="Volume"
       class="slider-thumb">
  </div>
</div>

Visual Layout:
├─────────●─────────────────────────┤
0        50                     100
```

## aria-valuetext

Use when numeric value needs context:
- "50%" instead of "50"
- "Medium" instead of "3"
- "3 of 5 stars" instead of "3"

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA attributes test
it('has correct ARIA attributes', () => {
  render(<Slider min={0} max={100} defaultValue={50} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  expect(slider).toHaveAttribute('aria-valuenow', '50');
  expect(slider).toHaveAttribute('aria-valuemin', '0');
  expect(slider).toHaveAttribute('aria-valuemax', '100');
});

// Keyboard navigation test
it('increases value on Arrow Right', async () => {
  const user = userEvent.setup();
  render(<Slider min={0} max={100} defaultValue={50} step={1} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  slider.focus();

  await user.keyboard('{ArrowRight}');
  expect(slider).toHaveAttribute('aria-valuenow', '51');
});

// Home/End test
it('sets to min on Home, max on End', async () => {
  const user = userEvent.setup();
  render(<Slider min={0} max={100} defaultValue={50} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  slider.focus();

  await user.keyboard('{Home}');
  expect(slider).toHaveAttribute('aria-valuenow', '0');

  await user.keyboard('{End}');
  expect(slider).toHaveAttribute('aria-valuenow', '100');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="slider" with required attributes', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();

  await expect(slider).toHaveAttribute('role', 'slider');
  await expect(slider).toHaveAttribute('aria-valuenow');
  await expect(slider).toHaveAttribute('aria-valuemin');
  await expect(slider).toHaveAttribute('aria-valuemax');
});

// Keyboard navigation test
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();

  await slider.focus();
  const initialValue = await slider.getAttribute('aria-valuenow');

  await page.keyboard.press('ArrowRight');
  const newValue = await slider.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBeGreaterThan(Number(initialValue));

  await page.keyboard.press('Home');
  const minValue = await slider.getAttribute('aria-valuemin');
  await expect(slider).toHaveAttribute('aria-valuenow', minValue);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();
  await slider.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="slider"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
