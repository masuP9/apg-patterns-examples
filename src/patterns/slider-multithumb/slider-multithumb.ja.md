# Slider Multithumb Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

## 概要

マルチサムスライダーは、2つのつまみを持つ入力ウィジェットで、ユーザーが特定の範囲内から値の範囲を選択できます。各つまみはトラックに沿って移動させ、選択した範囲の下限と上限を調整できます。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `slider` | 下限つまみ要素 | 範囲の下限を選択するためのスライダーとして要素を識別します。 |
| `slider` | 上限つまみ要素 | 範囲の上限を選択するためのスライダーとして要素を識別します。 |
| `group` | コンテナ要素 | 2つのスライダーをグループ化し、共通のラベルに関連付けます。 |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | 各slider要素 | Number | はい | キーボードまたはポインターによる値変更時に動的に更新 |
| `aria-valuemin` | 各slider要素 | Number | はい | 下限つまみは静的（絶対最小値）、上限つまみは動的（下限値 + minDistance） |
| `aria-valuemax` | 各slider要素 | Number | はい | 下限つまみは動的（上限値 - minDistance）、上限つまみは静的（絶対最大値） |
| `aria-valuetext` | 各slider要素 | String | はい | 例: "$20", "$80", "20% - 80%" |
| `aria-orientation` | 各slider要素 | `"horizontal"` \| `"vertical"` | いいえ | デフォルト: horizontal（暗黙的）。垂直スライダーの場合のみ設定。 |
| `aria-disabled` | 各slider要素 | `true` \| `undefined` | いいえ | 無効化時のみ設定 |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | つまみ間でフォーカスを移動（下限から上限へ） |
| `Shift + Tab` | つまみ間でフォーカスを移動（上限から下限へ） |
| `Right Arrow` | 値を1ステップ増加させる |
| `Up Arrow` | 値を1ステップ増加させる |
| `Left Arrow` | 値を1ステップ減少させる |
| `Down Arrow` | 値を1ステップ減少させる |
| `Home` | つまみを許容最小値に設定（上限つまみは動的） |
| `End` | つまみを許容最大値に設定（下限つまみは動的） |
| `Page Up` | 値を大きいステップで増加させる（デフォルト: step * 10） |
| `Page Down` | 値を大きいステップで減少させる（デフォルト: step * 10） |

## フォーカス管理

- タブ順序: 両方のつまみがタブ順序に含まれる（tabindex="0"）
- 固定順序: 値に関係なく、下限つまみが常にタブ順序で先に来る
- トラッククリック: トラックをクリックすると最も近いつまみが移動してフォーカスされる

## テストチェックリスト

### 高優先度: ARIA

- [ ] Has two elements with role="slider"
- [ ] Container has role="group"
- [ ] Both thumbs have aria-valuenow
- [ ] Dynamic aria-valuemin/max updates on thumb movement
- [ ] Has accessible names for both thumbs

### 高優先度: キーボード

- [ ] Right/Up Arrow increases value
- [ ] Left/Down Arrow decreases value
- [ ] Home sets to minimum (dynamic for upper)
- [ ] End sets to maximum (dynamic for lower)
- [ ] Page Up/Down changes value by large step
- [ ] Thumbs cannot cross each other

### 高優先度: フォーカス管理

- [ ] Tab moves between thumbs in order
- [ ] Both thumbs are focusable

### 中優先度: アクセシビリティ

- [ ] No axe-core violations
- [ ] Focus indicator visible on each thumb

## 実装ノート

## Multi-Thumb Slider Specifics

Unlike a single-thumb slider, multi-thumb sliders require:
- **Two slider elements** within a `group` role container
- **Dynamic bounds** that update based on the other thumb's value
- **Collision prevention** to ensure thumbs don't cross

## Structure

```
<div role="group" aria-labelledby="label-id">
  <span id="label-id">Price Range</span>
  <div class="slider-track">
    <div class="slider-fill" />
    <div
      role="slider"
      tabindex="0"
      aria-valuenow="20"
      aria-valuemin="0"
      aria-valuemax="80"  <!-- Dynamic: upper value -->
      aria-label="Minimum Price"
    />
    <div
      role="slider"
      tabindex="0"
      aria-valuenow="80"
      aria-valuemin="20"  <!-- Dynamic: lower value -->
      aria-valuemax="100"
      aria-label="Maximum Price"
    />
  </div>
</div>

Visual Layout:
┌─────────────────────────────────────┐
│ Price Range                          │
│ ├─────●━━━━━━━━━━━━●────────────────┤
│ 0     20          80            100  │
└─────────────────────────────────────┘
       ↑            ↑
   Lower Thumb  Upper Thumb
```

## Accessible Naming

Each thumb needs its own label:
- `aria-label` tuple: `["Minimum Price", "Maximum Price"]`
- `aria-labelledby` tuple: Reference separate label elements
- `getAriaLabel` function: Dynamic label based on thumb index

## Dynamic Bounds

Per APG specification:
- Lower thumb's `aria-valuemax` = upper value - minDistance
- Upper thumb's `aria-valuemin` = lower value + minDistance

This ensures Home/End keys behave correctly for assistive technology users.

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA structure test
it('renders two slider elements in a group', () => {
  render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);

  const sliders = screen.getAllByRole('slider');
  expect(sliders).toHaveLength(2);
  expect(screen.getByRole('group')).toBeInTheDocument();
});

// Dynamic bounds test
it('updates aria-valuemin/max dynamically', async () => {
  const user = userEvent.setup();
  render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);

  const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

  // Lower thumb's max should be upper value
  expect(lowerThumb).toHaveAttribute('aria-valuemax', '80');
  // Upper thumb's min should be lower value
  expect(upperThumb).toHaveAttribute('aria-valuemin', '20');

  // Move lower thumb
  lowerThumb.focus();
  await user.keyboard('{ArrowRight}');

  // Upper thumb's min should update
  expect(upperThumb).toHaveAttribute('aria-valuemin', '21');
});

// Collision prevention test
it('prevents thumbs from crossing', async () => {
  const user = userEvent.setup();
  render(<MultiThumbSlider defaultValue={[50, 55]} aria-label={['Min', 'Max']} />);

  const [lowerThumb] = screen.getAllByRole('slider');
  lowerThumb.focus();

  // Try to move lower thumb past upper
  for (let i = 0; i < 10; i++) {
    await user.keyboard('{ArrowRight}');
  }

  // Should stop at upper value
  expect(lowerThumb).toHaveAttribute('aria-valuenow', '55');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has two sliders in a group', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const group = page.getByRole('group');
  const sliders = group.getByRole('slider');

  await expect(sliders).toHaveCount(2);
});

// Dynamic bounds test
test('updates dynamic bounds on thumb movement', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

  await lowerThumb.focus();
  await page.keyboard.press('ArrowRight');

  const newMin = await upperThumb.getAttribute('aria-valuemin');
  expect(Number(newMin)).toBeGreaterThan(20); // Original lower value
});

// Collision prevention test
test('prevents thumb crossing via keyboard', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

  // Get upper thumb's current value
  const upperValue = await upperThumb.getAttribute('aria-valuenow');

  await lowerThumb.focus();
  // Press End to try to go to max
  await page.keyboard.press('End');

  // Lower thumb should stop at upper value
  const lowerValue = await lowerThumb.getAttribute('aria-valuenow');
  expect(Number(lowerValue)).toBeLessThanOrEqual(Number(upperValue));
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const group = page.getByRole('group').first();
  await group.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="group"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
