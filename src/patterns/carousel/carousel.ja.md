# Carousel Pattern - AI実装ガイド

> APGリファレンス: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

## 概要

カルーセルは一連のアイテム（スライド）を一度に1つずつ表示し、アイテム間を移動するためのコントロールを提供します。フォーカス/ホバー時の一時停止を伴う自動回転、タブリストパターンによるキーボードナビゲーション、タッチ/スワイプジェスチャーをサポートします。

## ARIA要件

### ロール

| ロール | 要素 | 説明 |
| --- | --- | --- |
| `region` | コンテナ（section） | カルーセルのランドマーク領域 |
| `group` | スライドコンテナ | すべてのスライドをグループ化 |
| `tablist` | タブコンテナ | スライドインジケータタブのコンテナ |
| `tab` | 各タブボタン | 個々のスライドインジケータ |
| `tabpanel` | 各スライド | 個々のスライドコンテンツエリア |

### プロパティ

| 属性 | 要素 | 値 | 必須 | 備考 |
| --- | --- | --- | --- | --- |
| `aria-roledescription` | [object Object] | "carousel" | はい | スクリーンリーダーに「carousel」と通知 |
| `aria-roledescription` | [object Object] | "slide" | はい | 「tabpanel」の代わりに「slide」と通知 |
| `aria-label` | [object Object] | テキスト | はい | カルーセルの目的を説明 |
| `aria-label` | [object Object] | "N of M" | はい | スライド位置（例: "1 of 5"） |
| `aria-controls` | [object Object] | ID参照 | はい | 制御対象要素を参照 |
| `aria-labelledby` | [object Object] | ID参照 | はい | 関連するタブを参照 |
| `aria-atomic` | [object Object] | "false" | いいえ | 変更されたコンテンツのみ通知 |

### ステート

| 属性 | 要素 | 値 | 必須 | 変更トリガー |
| --- | --- | --- | --- | --- |
| `aria-selected` | tab 要素 | `true` \| `false` | はい | タブクリック、矢印キー、前へ/次へボタン、自動回転 |
| `aria-live` | スライドコンテナ | `"off"` \| `"polite"` | はい | 再生/一時停止クリック、フォーカスイン/アウト、マウスホバー |

## キーボードサポート

| キー | アクション |
| --- | --- |
| `Tab` | コントロール間を移動（再生/一時停止、タブリスト、前へ/次へ） |
| `ArrowRight` | 次のスライドインジケータタブに移動（最初にループ） |
| `ArrowLeft` | 前のスライドインジケータタブに移動（最後にループ） |
| `Home` | 最初のスライドインジケータタブにフォーカス移動 |
| `End` | 最後のスライドインジケータタブにフォーカス移動 |
| `Enter / Space` | フォーカスされたタブまたはボタンをアクティブ化 |

## フォーカス管理

- 選択中のタブ: tabIndex="0"
- 他のタブ: tabIndex="-1"
- キーボードフォーカスがカルーセルに入る: 回転が一時的に停止、aria-live が "polite" に変更
- キーボードフォーカスがカルーセルから離れる: 回転が再開（自動回転モードがオンの場合）
- マウスがスライド上をホバー: 回転が一時的に停止
- マウスがスライドから離れる: 回転が再開（自動回転モードがオンの場合）
- 一時停止ボタンをクリック: 自動回転モードをオフ、ボタンは再生アイコンを表示
- 再生ボタンをクリック: 自動回転モードをオンにし、即座に回転を開始
- prefers-reduced-motion: reduce: 自動回転がデフォルトで無効

## テストチェックリスト

### 高優先度: ARIA

- [ ] Container has aria-roledescription="carousel"
- [ ] Container has aria-label describing purpose
- [ ] Each tabpanel has aria-roledescription="slide"
- [ ] Each tabpanel has aria-label="N of M"
- [ ] Tab container has role="tablist"
- [ ] Each tab has role="tab" and aria-controls
- [ ] Active tab has aria-selected="true"
- [ ] aria-live="off" during rotation
- [ ] aria-live="polite" when rotation stopped

### 高優先度: キーボード

- [ ] ArrowRight moves to next tab (wraps)
- [ ] ArrowLeft moves to previous tab (wraps)
- [ ] Home moves to first tab
- [ ] End moves to last tab
- [ ] Enter/Space activates tab or button

### 高優先度: フォーカス管理

- [ ] Only one tab has tabindex="0" at a time
- [ ] Rotation control is first in tab order
- [ ] Rotation pauses on keyboard focus
- [ ] Rotation pauses on mouse hover

### 高優先度: クリック動作

- [ ] Play/pause button toggles rotation

### 中優先度: クリック動作

- [ ] Next button shows next slide
- [ ] Previous button shows previous slide

### 高優先度: アクセシビリティ

- [ ] Respects prefers-reduced-motion

### 中優先度: アクセシビリティ

- [ ] No axe-core violations (WCAG 2.1 AA)

## 実装ノート

## Structure

```
section[aria-roledescription="carousel"][aria-label="..."]
├── div[role="group"][aria-live="off|polite"]  (slides container)
│   └── div[role="tabpanel"][aria-roledescription="slide"][aria-label="1 of N"]
│       └── <Slide Content>
└── div.controls  (below slides)
    ├── button  (Play/Pause - first tab stop)
    ├── div[role="tablist"]
    │   └── button[role="tab"]*  (roving tabindex)
    └── div[role="group"]  (prev/next)
        ├── button  (Previous)
        └── button  (Next)
```

## Auto-Rotation State Model

Two independent boolean states:

```
autoRotateMode: boolean       // User's intent (toggled by play/pause button)
isPausedByInteraction: boolean // Temporary pause (focus/hover)

isActuallyRotating = autoRotateMode && !isPausedByInteraction
```

**State transitions:**
- click pause button → autoRotateMode = false
- click play button → autoRotateMode = true (also resets isPausedByInteraction)
- focus enters carousel → isPausedByInteraction = true
- focus leaves carousel → isPausedByInteraction = false
- hover enters slides → isPausedByInteraction = true
- hover leaves slides → isPausedByInteraction = false

**UI behavior:**
- Button icon reflects `autoRotateMode` only
- `aria-live` uses `isActuallyRotating`: "off" when rotating, "polite" when paused

## テストコード例 (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from './Carousel';

const slides = [
  { id: '1', content: <div>Slide 1</div> },
  { id: '2', content: <div>Slide 2</div> },
  { id: '3', content: <div>Slide 3</div> },
];

describe('Carousel', () => {
  describe('APG: ARIA Structure', () => {
    it('has aria-roledescription="carousel" on container', () => {
      render(<Carousel slides={slides} aria-label="Featured" />);
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('has aria-roledescription="slide" on each tabpanel', () => {
      render(<Carousel slides={slides} aria-label="Featured" />);
      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      panels.forEach((panel) => {
        expect(panel).toHaveAttribute('aria-roledescription', 'slide');
      });
    });
  });

  describe('APG: Keyboard Interaction', () => {
    it('moves focus to next tab on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Carousel slides={slides} aria-label="Featured" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');

      expect(tabs[1]).toHaveFocus();
    });
  });
});
```

## E2Eテストコード例 (Playwright)

```typescript
import { test, expect } from '@playwright/test';

const carouselSelector = '[data-testid="carousel-manual"]';

test('has aria-roledescription="carousel" on container', async ({ page }) => {
  await page.goto('patterns/carousel/react/');
  await page.locator(carouselSelector).waitFor();

  const carousel = page.locator(carouselSelector);
  await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
});

test('ArrowRight/ArrowLeft navigate tabs with wrapping', async ({ page }) => {
  await page.goto('patterns/carousel/react/');

  const carousel = page.locator(carouselSelector);
  const tabs = carousel.locator('[role="tablist"] [role="tab"]');
  const firstTab = tabs.first();

  await firstTab.click();
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowRight');
  const secondTab = tabs.nth(1);
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');
});
```
