# E2Eテスト未実装パターン実装計画

## 概要

E2Eテスト未実装の10パターンに対するPlaywright E2Eテストの実装計画。

**対象パターン**: ~~Accordion~~, ~~Dialog~~, ~~Menu Button~~, ~~Radio Group~~, ~~Slider~~, ~~Spinbutton~~, ~~Tabs~~, ~~Toolbar~~, ~~Tooltip~~, ~~Tree View~~

**現状**: 28/28パターン完了（100%）✅

### 進捗

| パターン    | E2Eテスト | デモページ | TestingDocs | llm.md | 備考 |
| ----------- | --------- | ---------- | ----------- | ------ | ---- |
| Tooltip     | ✅        | ✅         | ✅          | ✅     | 完了 |
| Accordion   | ✅        | ✅         | ✅          | ✅     | 完了 |
| Tabs        | ✅        | ✅         | ✅          | ✅     | 完了 |
| Radio Group | ✅        | ✅         | ✅          | ✅     | 完了 |
| Toolbar     | ✅        | ✅         | ✅          | ✅     | 完了 |
| Slider      | ✅        | ✅         | ✅          | ✅     | 完了 |
| Dialog      | ✅        | ✅         | ✅          | ✅     | 完了 |
| Menu Button | ✅        | ✅         | ✅          | ✅     | 完了 |
| Spinbutton  | ✅        | ✅         | ✅          | ✅     | 完了 |
| Tree View   | ✅        | ✅         | ✅          | ✅     | 完了 |

---

## Phase 0: npm run スクリプトの改善（最初に実施）

### 目的

E2Eテストの柔軟な実行を可能にする。

### 現状のスクリプト

```json
{
  "test:e2e": "DEV_PORT=4321 start-server-and-test dev http-get://localhost:4321 test:e2e:parallel",
  "test:e2e:ci": "playwright test",
  "test:e2e:parallel": "DEV_PORT=4321 run-p test:e2e:react test:e2e:vue test:e2e:svelte test:e2e:astro",
  "test:e2e:react": "E2E_FRAMEWORK=react E2E_SKIP_SERVER=1 playwright test",
  "test:e2e:vue": "E2E_FRAMEWORK=vue E2E_SKIP_SERVER=1 playwright test",
  "test:e2e:svelte": "E2E_FRAMEWORK=svelte E2E_SKIP_SERVER=1 playwright test",
  "test:e2e:astro": "E2E_FRAMEWORK=astro E2E_SKIP_SERVER=1 playwright test",
  "test:e2e:all": "playwright test",
  "test:e2e:ui": "playwright test --ui"
}
```

### 追加するスクリプト

**注意**: このプロジェクトは npm を使用。pnpm/yarn では `npm_config_*` が使えないため非対応。

```json
{
  // 特定パターンのみ実行（全フレームワーク）
  // 使用例: npm run test:e2e:pattern --pattern=menu-button
  "test:e2e:pattern": "DEV_PORT=4321 start-server-and-test dev http-get://localhost:4321 \"playwright test e2e/${npm_config_pattern:?pattern is required}.spec.ts\"",

  // 特定フレームワーク + 特定パターン（サーバー別途起動が必要）
  // 使用例: npm run test:e2e:react:pattern --pattern=menu-button
  "test:e2e:react:pattern": "E2E_FRAMEWORK=react E2E_SKIP_SERVER=1 playwright test e2e/${npm_config_pattern:?pattern is required}.spec.ts",
  "test:e2e:vue:pattern": "E2E_FRAMEWORK=vue E2E_SKIP_SERVER=1 playwright test e2e/${npm_config_pattern:?pattern is required}.spec.ts",
  "test:e2e:svelte:pattern": "E2E_FRAMEWORK=svelte E2E_SKIP_SERVER=1 playwright test e2e/${npm_config_pattern:?pattern is required}.spec.ts",
  "test:e2e:astro:pattern": "E2E_FRAMEWORK=astro E2E_SKIP_SERVER=1 playwright test e2e/${npm_config_pattern:?pattern is required}.spec.ts"
}
```

**修正ポイント**:

- シングルクォート → ダブルクォート（変数展開のため）
- `${npm_config_pattern:?pattern is required}` で未指定時エラー

### 使用方法

```bash
# 特定パターンのみ（開発サーバー自動起動）
npm run test:e2e:pattern --pattern=menu-button

# 特定フレームワーク + 特定パターン（サーバー別途起動が必要）
npm run dev  # 別ターミナルで
npm run test:e2e:react:pattern --pattern=menu-button

# UIモードで特定パターン
npx playwright test e2e/menu-button.spec.ts --ui

# エラー例（pattern未指定）
npm run test:e2e:pattern  # → "pattern is required" エラー
```

### 修正ファイル

- `package.json` - scripts セクションに追加

### 検証方法

```bash
# 既存スクリプトが壊れていないか
npm run test:e2e:react

# 新スクリプトが動作するか
npm run test:e2e:pattern --pattern=button
npm run test:e2e:react:pattern --pattern=button
```

---

## Phase 1-10: パターン別E2Eテスト実装

### 実装順序

**方針**: 低〜中難度から開始してテンプレートの妥当性を検証し、その後高難度に進む。

| 順位 | パターン    | 複雑度 | 理由                                                   |
| ---- | ----------- | ------ | ------------------------------------------------------ |
| 1    | Tooltip     | 低     | 最もシンプル、テンプレ検証に最適                       |
| 2    | Accordion   | 中     | Disclosureと類似で参考あり、複数ロール検証             |
| 3    | Tabs        | 中     | 基本的なRoving tabindex、複数ロール                    |
| 4    | Radio Group | 中     | Checkboxと類似、Roving tabindex                        |
| 5    | Toolbar     | 中     | 複合コンポーネント、Toggle Buttonの組み合わせ          |
| 6    | Slider      | 中     | ドラッグ操作、Playwright特有のテスト技法               |
| 7    | Dialog      | 高     | フォーカストラップ、復元、Alert Dialogと類似で参考あり |
| 8    | Menu Button | 高     | Type-ahead、複雑なキーボード操作                       |
| 9    | Spinbutton  | 高     | テキスト入力+キーボード、IME対応                       |
| 10   | Tree View   | 高     | 階層構造、再帰的ナビゲーション、独自性高い             |

---

## E2Eテストテンプレート

**Tooltip実装からの学び**: 以下のテンプレートは実際の実装経験を反映して更新済み。

**Accordion実装からの学び**:

1. **クラスベースセレクタの活用**: roleが設定されていない要素（accordion headerなど）はCSSクラス（`.apg-accordion-trigger`）でセレクト
2. **ハイドレーション待機パターン**: Svelteはハイドレーション前に`-`で始まる不正なIDを使う → `expect.poll()`でaria-controlsが正しく設定されるまで待機
   ```typescript
   await expect.poll(async () => {
     const id = await firstHeader.getAttribute('aria-controls');
     return id && id.length > 1 && !id.startsWith('-');
   }).toBe(true);
   ```
3. **単一展開モードのテスト**: 1つを開くと他が閉じることを検証（`aria-expanded`の状態変化を追跡）
4. **無効状態テストの分離**: disabled属性を持つ要素のクリックは`{ force: true }`で強制実行し、状態が変わらないことを確認
5. **APG条件付き推奨の検証**: パネル数≤6の場合のみ`role="region"`を検証（パネル数をカウントして条件分岐）

**Tabs実装からの学び**:

1. **状態更新の待機パターン**: Reactなどでクリック後にキーボード操作を行う場合、状態更新が完了するまで明示的に待機が必要。特にRoving tabindexパターンでは、フォーカス移動前に選択状態の確認が重要
   ```typescript
   await lastTab.click();
   // 状態更新を待機してからキーボード操作
   await expect(lastTab).toHaveAttribute('aria-selected', 'true');
   await expect(lastTab).toBeFocused();

   await page.keyboard.press('ArrowRight');
   await expect(firstTab).toBeFocused();
   ```
2. **ループナビゲーションのテスト**: 最後の要素から最初へ（またはその逆）のループ動作は、状態遷移のタイミング問題が発生しやすい。クリック→待機→キー操作の順序を守る
3. **自動/手動アクティベーションの分離テスト**: `automatic`モードと`manual`モードで異なるテストケースを用意。手動モードではEnter/Spaceキーによるアクティベーションを検証

**Radio Group実装からの学び**:

1. **属性セレクタの使用**: ID に特殊文字（`-`や`:`など）が含まれる場合、`#${id}` ではなく `[id="${id}"]` 属性セレクタを使用する
   ```typescript
   // ❌ Svelteなどで特殊文字を含むIDが生成される場合に失敗
   const labelElement = page.locator(`#${labelledby}`);

   // ✅ 属性セレクタなら特殊文字でも安全
   const labelElement = page.locator(`[id="${labelledby}"]`);
   ```
2. **クリックベースの初期フォーカス**: Tab キーでのフォーカス移動が不安定な場合、クリックで明示的にフォーカスを設定する
   ```typescript
   // Tabでフォーカスを移動するより、クリックで確実にフォーカス
   await firstRadio.click();
   await expect(firstRadio).toHaveAttribute('aria-checked', 'true');

   // その後のキーボード操作
   await page.keyboard.press('ArrowDown');
   ```
3. **Roving tabindexの検証**: Radio Groupは単一のタブストップを持ち、選択された要素のみが `tabindex="0"` を持つことを検証

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for {PatternName} Pattern
 *
 * {パターンの簡潔な説明}
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/{pattern-slug}/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

// パターン固有のヘルパー関数を定義
// 複数の要素を操作する場合は複数のヘルパーを用意
const get{Component} = (page: import('@playwright/test').Page) => {
  return page.locator('[role="{role}"]');
};

// フレームワーク間で実装が異なる場合のヘルパー
const getFrameworkSpecificElement = (
  page: import('@playwright/test').Page,
  framework: string,
  parent: import('@playwright/test').Locator
) => {
  // 例: Svelte は slot props で aria-describedby の設定場所が異なる
  if (framework === 'svelte') {
    return parent.locator('button').first();
  }
  return parent;
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`{PatternName} (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      // ✅ デモページを使用（レイアウトなしでクリーンなテスト環境）
      await page.goto(`patterns/{pattern-slug}/${framework}/demo/`);
      // ✅ 要素の出現を待機（networkidle ではなく）
      await get{Component}(page).first().waitFor();
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('has correct role', async ({ page }) => {
        const component = get{Component}(page);
        await expect(component.first()).toHaveRole('{role}');
      });

      test('has required aria attributes', async ({ page }) => {
        // aria-* 属性の検証
      });

      // フレームワーク固有の差異がある場合はスキップ
      test('framework-specific behavior', async ({ page }) => {
        if (framework === 'svelte') {
          test.skip();
          return;
        }
        // ...
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('responds to {Key} key', async ({ page }) => {
        // キーボード操作テスト
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Click/Mouse Interaction
    // ------------------------------------------
    test.describe('APG: Click Interaction', () => {
      test('responds to click', async ({ page }) => {
        // クリック操作テスト
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Disabled State
    // ------------------------------------------
    test.describe('Disabled State', () => {
      test('disabled element is not interactive', async ({ page }) => {
        // 無効状態テスト
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const component = get{Component}(page);
        await component.first().waitFor();

        const results = await new AxeBuilder({ page })
          .include('{selector}')
          // ✅ 必要に応じてルールを除外（デザイン上の選択）
          .disableRules(['color-contrast'])
          .analyze();

        expect(results.violations).toEqual([]);
      });
    });
  });
}

// ============================================
// Cross-framework Consistency Tests
// ============================================

test.describe('{PatternName} - Cross-framework Consistency', () => {
  test('all frameworks have {component}s', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/{pattern-slug}/${framework}/demo/`);
      await get{Component}(page).first().waitFor();

      const components = get{Component}(page);
      const count = await components.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    // タイムアウト延長（複数フレームワークを順次テスト）
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/{pattern-slug}/${framework}/demo/`);
      await get{Component}(page).first().waitFor();

      // 一貫性検証
      // フレームワーク固有のヘルパーを使用
      const element = getFrameworkSpecificElement(page, framework, get{Component}(page).first());
      // ...
    }
  });
});
```

### テンプレート使用時の注意点

1. **ヘルパー関数**: パターンに応じて複数定義（trigger と content など）
2. **フレームワーク差異**: Svelte の slot props など、実装差異に対応するヘルパーを用意
3. **axe-core ルール除外**: `color-contrast` などデザイン上の選択は除外可
4. **ホバー操作**: `trigger.hover()` が不安定な場合は `boundingBox()` + `mouse.move()` を使用

---

## パターン別テスト観点

### 1. Menu Button

```
APG: ARIA Structure
  - button has aria-haspopup="menu"
  - button has aria-expanded (false→true on open)
  - button has aria-controls referencing menu id
  - menu has role="menu"
  - menu items have role="menuitem"

APG: Keyboard Interaction
  - Enter/Space opens menu, focuses first item
  - ArrowDown opens menu (if closed), moves to next item
  - ArrowUp opens menu (if closed), moves to previous item
  - Home/End moves to first/last item
  - Escape closes menu, returns focus to button
  - Type-ahead: typing characters focuses matching item

APG: Click Interaction
  - click toggles menu open/close
  - clicking outside closes menu
  - clicking menuitem activates and closes

Disabled State
  - disabled menuitems are skipped in navigation
```

### 2. Dialog

```
APG: ARIA Structure
  - dialog has role="dialog"
  - dialog has aria-modal="true"
  - dialog has aria-labelledby referencing title
  - dialog has aria-describedby (optional)

APG: Keyboard Interaction
  - Escape closes dialog
  - Tab cycles through focusable elements (focus trap)
  - Shift+Tab cycles backwards
  - focus moves to first focusable element on open

Focus Management
  - focus returns to trigger element on close
  - focus trap prevents focus leaving dialog
```

### 3. Spinbutton

```
APG: ARIA Structure
  - input has role="spinbutton"
  - has aria-valuenow, aria-valuemin, aria-valuemax
  - has aria-label or aria-labelledby

APG: Keyboard Interaction
  - ArrowUp increments value
  - ArrowDown decrements value
  - Home sets to minimum
  - End sets to maximum
  - PageUp/PageDown for larger steps

Text Input
  - direct numeric input updates value
  - invalid input is rejected/corrected
  - IME composition does not trigger premature updates
```

### 4. Slider

```
APG: ARIA Structure
  - thumb has role="slider"
  - has aria-valuenow, aria-valuemin, aria-valuemax
  - has aria-orientation (vertical only)

APG: Keyboard Interaction
  - ArrowRight/ArrowUp increments
  - ArrowLeft/ArrowDown decrements
  - Home/End for min/max
  - PageUp/PageDown for larger steps

Drag Interaction
  - mouse drag updates value
  - track click sets value to clicked position
```

### 5. Radio Group

```
APG: ARIA Structure
  - container has role="radiogroup"
  - items have role="radio"
  - selected item has aria-checked="true"
  - has aria-orientation (optional)

APG: Keyboard Interaction
  - Arrow keys move selection (with wrap)
  - Space selects focused item
  - Tab moves to/from group (single tab stop)

Roving Tabindex
  - selected/first radio has tabindex="0"
  - others have tabindex="-1"
```

### 6. Accordion

```
APG: ARIA Structure
  - headers are buttons with aria-expanded
  - buttons have aria-controls referencing panel
  - panels have role="region" (≤6 panels only)
  - panels have aria-labelledby

APG: Keyboard Interaction
  - Enter/Space toggles panel
  - ArrowDown/ArrowUp moves between headers
  - Home/End moves to first/last header

Multiple Panels
  - allowMultiple=false auto-closes other panels
```

### 7. Tabs

```
APG: ARIA Structure
  - container has role="tablist"
  - tabs have role="tab" with aria-selected
  - panels have role="tabpanel"
  - aria-controls/aria-labelledby linking

APG: Keyboard Interaction
  - Arrow keys navigate tabs
  - Home/End for first/last
  - automatic: arrow selects immediately
  - manual: arrow moves focus, Enter/Space selects

Roving Tabindex
  - selected tab has tabindex="0"
```

### 8. Toolbar

```
APG: ARIA Structure
  - container has role="toolbar"
  - has aria-label or aria-labelledby
  - has aria-orientation (optional)

APG: Keyboard Interaction
  - Arrow keys navigate between items
  - Home/End for first/last
  - Tab moves out of toolbar

Roving Tabindex
  - focused item has tabindex="0"
```

### 9. Tree View

```
APG: ARIA Structure
  - container has role="tree"
  - items have role="treeitem"
  - groups have role="group"
  - aria-expanded on parent items

APG: Keyboard Interaction
  - ArrowUp/Down moves between visible items
  - ArrowRight expands/enters children
  - ArrowLeft collapses/moves to parent
  - Home/End for first/last
  - Enter/Space activates item
  - Type-ahead navigation
```

### 10. Tooltip

```
APG: ARIA Structure
  - tooltip has role="tooltip"
  - trigger has aria-describedby when shown

APG: Keyboard Interaction
  - Escape hides tooltip

Show/Hide Behavior
  - hover shows after delay
  - focus shows tooltip
  - blur/mouseleave hides
```

---

## 全体的な注意事項

### 1. テストの安定性

```typescript
// ❌ 避ける: networkidle は dev サーバー/HMR でフレークの原因
await page.waitForLoadState("networkidle");

// ✅ 推奨: ロケータの出現待ちに寄せる
await component.first().waitFor();
await expect(component).toBeVisible();

// ❌ 避ける: waitForTimeout は最終手段
await page.waitForTimeout(300);

// ✅ 推奨: expect.poll や toHaveAttribute を使う
await expect(element).toHaveAttribute("aria-expanded", "true");
await expect.poll(() => element.count()).toBe(3);
```

### 2. フォーカス検証

```typescript
// フォーカス確認
await expect(element).toBeFocused();

// Tab ナビゲーションでフォーカス到達確認
let found = false;
for (let i = 0; i < 20; i++) {
  await page.keyboard.press("Tab");
  if (await element.evaluate((el) => el === document.activeElement)) {
    found = true;
    break;
  }
}
expect(found).toBe(true);
```

### 3. 状態遷移の検証

```typescript
// 状態変化前後を検証
const initialState = await element.getAttribute("aria-expanded");
await element.click();
const newState = await element.getAttribute("aria-expanded");
expect(initialState).not.toBe(newState);
```

### 4. axe-core のスコープ限定

```typescript
// 特定の要素のみ検証（ページ全体のノイズを除外）
const results = await new AxeBuilder({ page })
  .include('[role="dialog"]')
  .analyze();
```

### 5. デモページの利用

```typescript
// 通常ページ（レイアウト込み）
await page.goto(`patterns/dialog/${framework}/`);

// デモ専用ページ（レイアウトなし、セマンティクス確認用）
await page.goto(`patterns/dialog/${framework}/demo/`);
```

### 6. フレームワーク固有テスト

```typescript
// Astro Web Component のカスタムイベント
if (framework === "astro") {
  test.describe("Custom Events (Astro Web Component)", () => {
    // ...
  });
}
```

### 7. 複数ロール・リンク属性の整合性チェック

Tabs, Accordion, Tree View など複数ロールを持つパターンでは、ロール間のリンク属性を検証する。

```typescript
// 例: Tabs の aria-controls / aria-labelledby の整合性
test("tab and panel are correctly linked", async ({ page }) => {
  const tab = page.getByRole("tab").first();
  const panelId = await tab.getAttribute("aria-controls");
  const panel = page.locator(`#${panelId}`);

  await expect(panel).toHaveRole("tabpanel");
  await expect(panel).toHaveAttribute(
    "aria-labelledby",
    await tab.getAttribute("id"),
  );
});
```

### 8. 安定したセレクタ方針

```typescript
// ✅ 優先: role + accessible name
page.getByRole("button", { name: "Save" });
page.getByRole("tab", { name: "Settings" });

// ✅ 次点: role のみ（名前がない場合）
page.getByRole("tablist");

// ⚠️ 最終手段: data-testid（role で取得できない場合のみ）
page.locator("[data-testid='slider-thumb']");

// ❌ 避ける: CSS クラスやタグ名での取得
page.locator(".my-button");
```

### 9. 外部領域操作（クリック外閉じ）

Dialog, Menu Button などのクリック外閉じテストでは、安定したクリックターゲットを使う。

```typescript
// ✅ 明確なターゲットを使う
await page.locator("body").click({ position: { x: 10, y: 10 } });
await page.locator("header").click(); // ヘッダー領域

// ⚠️ 避ける: 座標指定なしの body クリック（不安定）
await page.locator("body").click();
```

### 10. Cross-framework フィルタの注意

`E2E_FRAMEWORK` フィルタ使用時、Cross-framework Consistency テストはスキップされる（意図的な挙動）。

```typescript
// フレームワークフィルタ時にスキップされる
test.describe("Pattern - Cross-framework Consistency", () => {
  // このブロックは E2E_FRAMEWORK 指定時は実行されない
});
```

### 11. ホバー操作の安定化

`trigger.hover()` が不安定な場合は、`boundingBox()` と `mouse.move()` を組み合わせる。

```typescript
// ❌ 不安定な場合がある
await trigger.hover();

// ✅ より安定したホバー操作
const box = await trigger.boundingBox();
if (!box) throw new Error('Trigger not found');

// マウスを一度離してからターゲットに移動
await page.mouse.move(0, 0);
await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

// ツールチップ表示を待機
await expect(tooltip).toBeVisible({ timeout: 2000 });
```

### 12. APG 条件付き推奨への対応

一部の APG 推奨は条件付き（例: Accordion の `role="region"` は ≤6 パネルのみ）。テストでは実装の許容範囲を明記する。

```typescript
// Accordion: パネル数に応じて role="region" の有無が変わる
test("panels have role=region when 6 or fewer", async ({ page }) => {
  const panels = page.locator("[aria-labelledby]");
  const count = await panels.count();

  if (count <= 6) {
    // 6 以下なら role="region" が必要
    await expect(panels.first()).toHaveRole("region");
  } else {
    // 7 以上なら role="region" は不要（あってもエラーにしない）
  }
});
```

---

## ファイル配置

```
e2e/
├── accordion.spec.ts      # 新規作成
├── dialog.spec.ts         # 新規作成
├── menu-button.spec.ts    # 新規作成
├── radio-group.spec.ts    # 新規作成
├── slider.spec.ts         # 新規作成
├── spinbutton.spec.ts     # 新規作成
├── tabs.spec.ts           # 新規作成
├── toolbar.spec.ts        # 新規作成
├── tooltip.spec.ts        # 新規作成
├── tree-view.spec.ts      # 新規作成
└── (既存ファイル...)
```

---

## 検証方法

### 単体実行

```bash
# 特定パターンのみ実行（全フレームワーク、サーバー自動起動）
npm run test:e2e:pattern --pattern=menu-button

# 特定フレームワーク + 特定パターン（要: npm run dev 別ターミナル）
npm run test:e2e:react:pattern --pattern=menu-button
npm run test:e2e:vue:pattern --pattern=menu-button
npm run test:e2e:svelte:pattern --pattern=menu-button
npm run test:e2e:astro:pattern --pattern=menu-button
```

### 全体実行

```bash
npm run test:e2e
```

### UIモードでデバッグ

```bash
npm run test:e2e:ui
```

### CI確認

```bash
npm run test:e2e:ci
```

---

## ドキュメンテーション作業

各パターンのE2Eテスト実装時に、以下のドキュメンテーション作業も併せて実施する。

### 1. デモページの作成（英語）

E2Eテストはレイアウトなしのクリーンな環境で実行するため、デモ専用ページを作成する。

**作成ファイル**:
```
src/pages/patterns/{pattern}/{framework}/demo/index.astro
```

**テンプレート**:
```astro
---
/**
 * Demo-only Page: {PatternName} ({Framework})
 *
 * This page renders the {PatternName} component in isolation without
 * the site layout. This ensures clean E2E testing environment.
 */
import '@/styles/global.css';
import {Component} from '@patterns/{pattern}/{Component}.{ext}';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Demo: {PatternName} ({Framework})</title>
  </head>
  <body class="p-8">
    <!-- パターンのデモコンポーネント -->
    <{Component} client:load />
  </body>
</html>
```

**注意点**:
- `<meta name="robots" content="noindex, nofollow" />` で検索エンジンから除外
- `client:load` または `client:only` でハイドレーション（フレームワークに応じて）
- Svelte で日本語テキストが必要な場合は別途デモコンポーネントを作成

### 2. デモページの作成（日本語）

日本語版のデモページも同様に作成する。

**作成ファイル**:
```
src/pages/ja/patterns/{pattern}/{framework}/demo/index.astro
```

**テンプレート**:
```astro
---
/**
 * Demo-only Page: {PatternName} ({Framework}) - Japanese
 *
 * This page renders the {PatternName} component in isolation without
 * the site layout. This ensures clean E2E testing environment.
 */
import '@/styles/global.css';
import {Component} from '@patterns/{pattern}/{Component}.{ext}';
---

<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>デモ: {PatternNameJa} ({Framework})</title>
  </head>
  <body class="p-8">
    <!-- 日本語版デモコンポーネント -->
    <{Component} client:load />
  </body>
</html>
```

**Svelte の場合**:
Svelte はテキストがハードコードされているため、日本語用のデモコンポーネントを別途作成する。

```
src/patterns/{pattern}/{Pattern}Demo.ja.svelte
```

### 3. パターンページへのデモリンク追加

各パターンページのデモセクション末尾にデモページへのリンクを追加する。

**英語版**:
```astro
<p class="text-muted-foreground mt-4 text-sm">
  <a href="./demo/" class="text-primary hover:underline">Open demo only →</a>
</p>
```

**日本語版**:
```astro
<p class="text-muted-foreground mt-4 text-sm">
  <a href="./demo/" class="text-primary hover:underline">デモのみを開く →</a>
</p>
```

**挿入位置**: デモセクションの `</div>` の後、`</section>` の前

### 4. TestingDocs の更新

E2Eテスト実装後、TestingDocs を更新してE2Eテスト情報を追加する。

**更新ファイル**:
- `src/patterns/{pattern}/TestingDocs.astro`（英語）
- `src/patterns/{pattern}/TestingDocs.ja.astro`（日本語）

**追加内容**:
1. テスト戦略セクション（Unit + E2E の2層構造）
2. テストカテゴリに「(Unit + E2E)」ラベル追加
3. E2Eテストコードの表示（CollapsibleなCodeBlock）
4. テスト実行コマンドの更新
5. テストツールセクション（axe-core/playwright 追加）

**E2Eコード読み込み**:
```astro
---
import fs from 'node:fs';
import path from 'node:path';

const e2eTestPath = path.join(process.cwd(), 'e2e/{pattern}.spec.ts');
const e2eTestCode = fs.readFileSync(e2eTestPath, 'utf-8');
---

<CodeBlock
  code={e2eTestCode}
  lang="typescript"
  title="e2e/{pattern}.spec.ts"
  collapsible
  collapsedLines={20}
/>
```

### 5. llm.md の更新

E2Eテスト実装後、llm.md にE2Eテスト情報を追加する。

**更新ファイル**:
```
src/patterns/{pattern}/llm.md
```

**追加内容**:
「Example Test Code」セクションの後に「Example E2E Test Code (Playwright)」セクションを追加。

**テンプレート**:
```markdown
## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/{pattern}/react/demo/');

  const component = page.getByRole('{role}');
  await expect(component).toBeVisible();
  // ... specific assertions
});

// Keyboard interaction test
test('{Key} key performs action', async ({ page }) => {
  await page.goto('patterns/{pattern}/react/demo/');

  // ... keyboard test
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/{pattern}/react/demo/');

  const results = await new AxeBuilder({ page })
    .include('[role="{role}"]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```
```

**注意点**:
- Unit Test とは別セクションとして追加
- パターン固有の重要なテストケースを2-3個含める
- axe-core によるアクセシビリティテストを含める

### 6. チェックリスト

各パターン実装時のドキュメンテーション作業チェックリスト：

- [ ] 英語デモページ作成（4フレームワーク）
- [ ] 日本語デモページ作成（4フレームワーク）
- [ ] Svelte 日本語デモコンポーネント作成（必要な場合）
- [ ] 英語パターンページにデモリンク追加（4フレームワーク）
- [ ] 日本語パターンページにデモリンク追加（4フレームワーク）
- [ ] TestingDocs.astro 更新
- [ ] TestingDocs.ja.astro 更新
- [ ] llm.md 更新（E2Eテストコード追加）

---

## 実装後の更新

各パターンのE2Eテスト実装完了時に以下を更新：

1. `README.md` - E2E列を✅に
2. `README.ja.md` - E2E列を✅に
3. `TODO.md` - E2Eテストセクションのチェックリストを更新
