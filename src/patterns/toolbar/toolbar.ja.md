# Toolbar Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

## 概要

ツールバーは、ボタン、トグルボタン、チェックボックスなどのコントロールセットをグループ化するコンテナです。キーボードナビゲーションには単一のTabストップを提供し、矢印キーでコントロール間を移動します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `toolbar` | コンテナ | コントロールをグループ化するコンテナ |
| `button` | ボタン要素 | <button>要素の暗黙的なロール |
| `separator` | セパレーター | グループ間の視覚的およびセマンティックなセパレーター |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-label` | toolbar | String | はい | ツールバーのアクセシブルな名前 |
| `aria-labelledby` | toolbar | ID参照 | はい | aria-labelの代替（優先される） |
| `aria-orientation` | toolbar | `"horizontal"` \| `"vertical"` | いいえ | ツールバーの方向（デフォルト: horizontal） |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-pressed` | ToolbarToggleButton | `true` \| `false` | はい | Click、Enter、Space |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | ツールバーへのフォーカス移動（単一Tabストップ） |
| `Arrow Right / Arrow Left` | コントロール間のナビゲーション（水平ツールバー） |
| `Arrow Down / Arrow Up` | コントロール間のナビゲーション（垂直ツールバー） |
| `Home` | 最初のコントロールにフォーカスを移動 |
| `End` | 最後のコントロールにフォーカスを移動 |
| `Enter / Space` | ボタンをアクティブ化 / 押下状態を切り替え |

## フォーカス管理

- Roving Tabindex: 一度に1つのコントロールのみがtabindex="0"を持つ
- 他のコントロール: 他のコントロールはtabindex="-1"を持つ
- 矢印キー: 矢印キーでコントロール間のフォーカスを移動
- 無効化/セパレーター: 無効化されたコントロールとセパレーターはスキップされる
- 折り返しなし: フォーカスは折り返さない（端で停止）

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has role="toolbar"
- [ ] Toolbar has aria-label or aria-labelledby
- [ ] aria-orientation reflects horizontal/vertical
- [ ] Toggle buttons have aria-pressed
- [ ] Separator has role="separator"

### 高優先度: キーボード

- [ ] ArrowRight/Left navigates horizontal toolbar
- [ ] ArrowDown/Up navigates vertical toolbar
- [ ] Home/End move to first/last item
- [ ] Focus does not wrap at edges
- [ ] Disabled items are skipped

### 高優先度: フォーカス管理

- [ ] Roving tabindex implemented correctly

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```html
<div role="toolbar" aria-label="Text formatting" aria-orientation="horizontal">
  <button type="button" tabindex="0" aria-pressed="false">Bold</button>
  <button type="button" tabindex="-1" aria-pressed="false">Italic</button>
  <div role="separator" aria-orientation="vertical"></div>
  <button type="button" tabindex="-1">Copy</button>
  <button type="button" tabindex="-1" disabled>Paste</button>
</div>
```

## Key Implementation Points

1. **Roving Tabindex**: Only one button has tabindex="0" at a time
2. **Orientation**: Arrow keys depend on aria-orientation
3. **Skip Disabled**: Disabled buttons and separators are skipped during navigation
4. **No Wrap**: Focus stops at edges (does not loop)
5. **Toggle Buttons**: Use aria-pressed for toggle state

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has toolbar role', () => {
  render(<Toolbar aria-label="Actions"><ToolbarButton>Copy</ToolbarButton></Toolbar>);
  expect(screen.getByRole('toolbar')).toBeInTheDocument();
});

// Keyboard Navigation
it('ArrowRight moves focus to next button', async () => {
  const user = userEvent.setup();
  render(
    <Toolbar aria-label="Actions">
      <ToolbarButton>Copy</ToolbarButton>
      <ToolbarButton>Paste</ToolbarButton>
    </Toolbar>
  );

  const buttons = screen.getAllByRole('button');
  buttons[0].focus();
  await user.keyboard('{ArrowRight}');

  expect(buttons[1]).toHaveFocus();
});

// Toggle Button
it('toggles aria-pressed on click', async () => {
  const user = userEvent.setup();
  render(
    <Toolbar aria-label="Formatting">
      <ToolbarToggleButton>Bold</ToolbarToggleButton>
    </Toolbar>
  );

  const toggle = screen.getByRole('button', { name: 'Bold' });
  expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-pressed', 'true');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');
  const toolbar = page.getByRole('toolbar');

  await expect(toolbar).toBeVisible();
  await expect(toolbar).toHaveAttribute('aria-label');
});

// Keyboard Navigation
test('arrow keys navigate between buttons', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');
  const toolbar = page.getByRole('toolbar').first();
  const buttons = toolbar.getByRole('button');

  await buttons.first().click();
  await page.keyboard.press('ArrowRight');

  await expect(buttons.nth(1)).toBeFocused();
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="toolbar"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
