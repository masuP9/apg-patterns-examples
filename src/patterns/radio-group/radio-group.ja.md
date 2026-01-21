# Radio Group Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

## 概要

ラジオグループは、ラジオボタンと呼ばれるチェック可能なボタンのセットで、一度に1つのボタンしかチェックできません。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `radiogroup` | コンテナ要素 | ラジオボタンをグループ化します。aria-labelまたはaria-labelledbyでアクセシブルな名前を持つ必要があります。 |
| `radio` | 各オプション要素 | 要素をラジオボタンとして識別します。グループ内で一度にチェックできるのは1つのラジオのみです。 |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-orientation` | radiogroup | `horizontal` \| `vertical` | いいえ | ラジオグループの方向を示します。デフォルトは縦方向です。横方向の場合のみ設定します。 |
| `aria-label` | radiogroup | String | はい | ラジオグループのアクセシブルな名前 |
| `aria-labelledby` | radiogroup | ID参照 | はい | aria-labelの代替 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-checked` | 各ラジオ | `true` \| `false` | はい | Click、Space、矢印キー |
| `aria-disabled` | 無効化されたラジオ | true | いいえ |  |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | グループにフォーカスを移動（選択された、または最初のラジオへ） |
| `Shift + Tab` | グループからフォーカスを移動 |
| `Space` | フォーカスされたラジオを選択（選択解除はしない） |
| `ArrowDown / ArrowRight` | 次のラジオに移動して選択（最初に戻る） |
| `ArrowUp / ArrowLeft` | 前のラジオに移動して選択（最後に戻る） |
| `Home` | 最初のラジオに移動して選択 |
| `End` | 最後のラジオに移動して選択 |

## フォーカス管理

- Roving tabindex: グループ内で一度に1つのラジオのみがTab可能
- 選択されたラジオ: <code>tabindex="0"</code>を持つ
- 選択がない場合: 最初の有効なラジオが<code>tabindex="0"</code>を持つ
- 他のすべてのラジオ: <code>tabindex="-1"</code>を持つ
- 無効化されたラジオ: 常に<code>tabindex="-1"</code>を持つ

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="radiogroup"
- [ ] Each option has role="radio"
- [ ] Selected radio has aria-checked="true"

### 高優先度: キーボード

- [ ] Arrow keys move and select
- [ ] Space selects focused radio

### 高優先度: フォーカス管理

- [ ] Tab enters group to selected/first radio
- [ ] Roving tabindex implemented correctly

### 高優先度: クリック動作

- [ ] Click selects radio

### 高優先度: Behavior

- [ ] Disabled radios skipped during navigation

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```html
<div role="radiogroup" aria-label="Pizza size">
  <div role="radio" aria-checked="false" tabindex="-1" aria-labelledby="small-label">
    <span id="small-label">Small</span>
  </div>
  <div role="radio" aria-checked="true" tabindex="0" aria-labelledby="medium-label">
    <span id="medium-label">Medium</span>
  </div>
  <div role="radio" aria-checked="false" tabindex="-1" aria-labelledby="large-label">
    <span id="large-label">Large</span>
  </div>
</div>
```

## Key Implementation Points

1. **Roving Tabindex**: Only selected (or first if none) radio has tabindex="0"
2. **Selection follows focus**: Arrow keys both move focus AND select
3. **Wrapping**: Navigation wraps from last to first and vice versa
4. **Disabled handling**: Disabled radios are skipped during arrow navigation
5. **Single selection**: Only one radio can be checked at a time

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has radiogroup role', () => {
  render(<RadioGroup options={options} />);
  expect(screen.getByRole('radiogroup')).toBeInTheDocument();
});

// Keyboard navigation with selection
it('ArrowDown moves and selects next radio', async () => {
  const user = userEvent.setup();
  render(<RadioGroup options={options} />);

  const radios = screen.getAllByRole('radio');
  radios[0].focus();
  await user.keyboard('{ArrowDown}');

  expect(radios[1]).toHaveFocus();
  expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  expect(radios[0]).toHaveAttribute('aria-checked', 'false');
});

// Wrapping
it('wraps from last to first', async () => {
  const user = userEvent.setup();
  render(<RadioGroup options={options} value={options[2].value} />);

  const radios = screen.getAllByRole('radio');
  radios[2].focus();
  await user.keyboard('{ArrowDown}');

  expect(radios[0]).toHaveFocus();
  expect(radios[0]).toHaveAttribute('aria-checked', 'true');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');
  const radiogroup = page.getByRole('radiogroup');
  const radios = page.getByRole('radio');

  await expect(radiogroup).toHaveAttribute('aria-label');
  await expect(radios).toHaveCount(3);
});

// Click interaction
test('clicking radio selects it', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');
  const radios = page.getByRole('radio');

  await radios.nth(1).click();

  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="radiogroup"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
