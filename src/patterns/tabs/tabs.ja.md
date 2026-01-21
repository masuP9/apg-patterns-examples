# Tabs Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/

## 概要

タブはタブパネルと呼ばれるコンテンツのレイヤー化されたセクションのセットで、一度に1つのパネルのコンテンツを表示します。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `tablist` | コンテナ | タブ要素のコンテナ |
| `tab` | 各タブ | 個々のタブ要素 |
| `tabpanel` | パネル | 各タブのコンテンツエリア |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-orientation` | tablist | `"horizontal"` \| `"vertical"` | いいえ | orientation プロパティ |
| `aria-controls` | tab | 関連するパネルへのID参照 | はい | 自動生成 |
| `aria-labelledby` | tabpanel | 関連するタブへのID参照 | はい | 自動生成 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-selected` | tab 要素 | `true` \| `false` | はい | タブクリック、矢印キー（自動）、Enter/Space（手動） |

## キーボードサポート

### 水平方向

| キー | アクション |
| --- | --- |
| `Tab` | タブリスト内にフォーカスを移動、またはタブリストから移動 |
| `ArrowRight` | 次のタブに移動（末尾でループ） |
| `ArrowLeft` | 前のタブに移動（先頭でループ） |
| `Home` | 最初のタブに移動 |
| `End` | 最後のタブに移動 |
| `Enter / Space` | タブをアクティブ化（手動モードのみ） |

### 垂直方向

| キー | アクション |
| --- | --- |
| `ArrowDown` | 次のタブに移動（末尾でループ） |
| `ArrowUp` | 前のタブに移動（先頭でループ） |

## フォーカス管理

- 選択中/フォーカス中のタブ: tabIndex="0"
- 他のタブ: tabIndex="-1"
- タブパネル: tabIndex="0"（フォーカス可能）
- 無効化されたタブ: キーボードナビゲーションでスキップ

## テストチェックリスト

### 高優先度: キーボード

- [ ] ArrowRight moves to next tab (horizontal)
- [ ] ArrowLeft moves to previous tab (horizontal)
- [ ] ArrowDown moves to next tab (vertical)
- [ ] ArrowUp moves to previous tab (vertical)
- [ ] Arrow keys loop at boundaries
- [ ] Home moves to first tab
- [ ] End moves to last tab
- [ ] Disabled tabs are skipped
- [ ] Tab key moves focus to tabpanel
- [ ] Manual mode: Enter/Space activates focused tab

### 高優先度: ARIA

- [ ] Container has role="tablist"
- [ ] Each tab has role="tab"
- [ ] Panel has role="tabpanel"
- [ ] Selected tab has aria-selected="true"
- [ ] Non-selected tabs have aria-selected="false"
- [ ] Tab aria-controls matches panel id
- [ ] Panel aria-labelledby matches tab id
- [ ] aria-orientation reflects orientation prop

### 高優先度: フォーカス管理

- [ ] Only selected/focused tab has tabIndex="0"
- [ ] Other tabs have tabIndex="-1"
- [ ] Tabpanel is focusable (tabIndex="0")

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Activation Modes

### Automatic (default)

- Arrow keys move focus AND select tab
- Panel content changes immediately

### Manual

- Arrow keys move focus only
- Enter/Space required to select tab
- Panel content changes on explicit activation

## Structure

```
┌─────────────────────────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3]   ← tablist     │
├─────────────────────────────────────────┤
│                                         │
│  Panel content here        ← tabpanel   │
│                                         │
└─────────────────────────────────────────┘

ID Relationships:
- Tab: id="tab-1", aria-controls="panel-1"
- Panel: id="panel-1", aria-labelledby="tab-1"
```

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Keyboard navigation test
it('ArrowRight moves to next tab', async () => {
  const user = userEvent.setup();
  render(<Tabs tabs={tabs} />);

  const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
  tab1.focus();

  await user.keyboard('{ArrowRight}');

  const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
  expect(tab2).toHaveFocus();
  expect(tab2).toHaveAttribute('aria-selected', 'true');
});

// ARIA attributes test
it('selected tab has aria-selected=true', () => {
  render(<Tabs tabs={tabs} />);
  const tabs = screen.getAllByRole('tab');

  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
});

// Roving tabindex test
it('only selected tab has tabIndex=0', () => {
  render(<Tabs tabs={tabs} />);
  const tabs = screen.getAllByRole('tab');

  expect(tabs[0]).toHaveAttribute('tabIndex', '0');
  expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('tabs have proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  const tabs = page.locator('.apg-tabs').first();

  // Check roles
  await expect(tabs.getByRole('tablist')).toBeAttached();
  await expect(tabs.getByRole('tab').first()).toBeAttached();
  await expect(tabs.getByRole('tabpanel')).toBeAttached();

  // Check aria-selected and aria-controls linkage
  const selectedTab = tabs.getByRole('tab', { selected: true });
  await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  await expect(selectedTab).toHaveAttribute('aria-controls', /.+/);

  const controlsId = await selectedTab.getAttribute('aria-controls');
  const panel = page.locator(`#${controlsId}`);
  await expect(panel).toHaveRole('tabpanel');
});

// Keyboard navigation test (automatic mode)
test('arrow keys navigate and select tabs', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  const tabs = page.locator('.apg-tabs').first();
  const tabButtons = tabs.getByRole('tab');
  const firstTab = tabButtons.first();
  const secondTab = tabButtons.nth(1);

  await firstTab.click();
  await expect(firstTab).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');

  // Test loop at boundaries
  await page.keyboard.press('End');
  const lastTab = tabButtons.last();
  await expect(lastTab).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(firstTab).toBeFocused();
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  await page.locator('.apg-tabs').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('.apg-tabs')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
