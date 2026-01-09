# テスト設計方針

> APG Patterns Examples のテスト戦略

## 設計原則: DAMP (Descriptive And Meaningful Phrases)

テストコードでは **DRY より DAMP を優先** する。

### なぜ DAMP か

テストは「何をテストしているか」が一目で分かることが最も重要。
抽象化によるコード削減よりも、可読性と自己完結性を優先する。

| 観点       | DRY                        | DAMP                 |
| ---------- | -------------------------- | -------------------- |
| 可読性     | 抽象化で意図が隠れる       | テストを見れば分かる |
| デバッグ   | 共通コードを追う必要あり   | そのテストだけで完結 |
| 保守性     | 共通コード変更が全体に影響 | 独立して変更可能     |
| 学習コスト | 抽象化の理解が必要         | コピペで追加可能     |

### 抽象化の方針

**抽象化してよいもの (How-to):**

- テストユーティリティ: `createMockTabs()`
- カスタムマッチャー: `toHaveNoViolations()`
- セットアップ処理: 環境構築の共通処理

**抽象化しないもの (What-to):**

- テストケース本体
- アサーション（期待値は具体的に書く）
- テストデータ（テスト内で定義）

### 例

```typescript
// ❌ 抽象化しすぎ
testToggleBehavior(ToggleButton, { stateAttr: 'aria-pressed' });

// ✅ DAMP: 明示的で自己完結
it('aria-pressed が false から true に変わる', async () => {
  render(<ToggleButton>Mute</ToggleButton>);
  const button = screen.getByRole('button');

  expect(button).toHaveAttribute('aria-pressed', 'false');
  await userEvent.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'true');
});
```

---

## テストの2つの軸

### 1. 基本動作テスト

コンポーネントが正しく動作するかを検証。

- レンダリング
- ユーザー操作（クリック、入力）
- 状態変化
- コールバック呼び出し
- props の受け渡し

### 2. APG 準拠テスト

WAI-ARIA APG 仕様に準拠しているかを検証。

- ARIA 属性（role, aria-\*）
- キーボード操作
- フォーカス管理
- axe-core 自動チェック

---

## APG 準拠テストの観点

### A. ARIA 属性

- 正しい role が設定されている
- 必須の aria-\* 属性が存在する
- 状態変化で aria-\* 属性が更新される
- 関連要素の参照（aria-controls, aria-labelledby）が正しい

### B. キーボード操作

- アクティベーションキー（Space, Enter）
- ナビゲーションキー（矢印キー, Home, End）
- 閉じる/キャンセル（Escape）
- 特殊操作（Delete, Tab）

### C. フォーカス管理

- Roving tabindex（選択要素のみ tabIndex=0）
- フォーカストラップ（モーダル系）
- フォーカス復元（閉じた後の戻り先）

### D. axe-core

- WCAG 2.1 AA 準拠
- 自動検出可能な違反がないこと

---

## パターン間で重複するテスト観点

パターンが異なっても、同じ「観点」でテストを書くことになる。
ただし、テストコード自体は抽象化せず、各コンポーネントで明示的に書く。

### 例: トグル系コンポーネント

ToggleButton, Switch, Checkbox は似た動作だが、テストは個別に書く。

| 観点               | ToggleButton | Switch       | Checkbox         |
| ------------------ | ------------ | ------------ | ---------------- |
| 状態属性           | aria-pressed | aria-checked | aria-checked     |
| アクティベーション | Space, Enter | Space, Enter | Space            |
| 状態変化           | true/false   | true/false   | true/false/mixed |

### 例: ナビゲーション系コンポーネント

Tabs, RadioGroup, Menu は矢印キーナビゲーションを持つ。

| 観点          | Tabs                    | RadioGroup   | Menu     |
| ------------- | ----------------------- | ------------ | -------- |
| コンテナ role | tablist                 | radiogroup   | menu     |
| 子要素 role   | tab                     | radio        | menuitem |
| 選択属性      | aria-selected           | aria-checked | -        |
| 矢印キー      | ← → (水平) / ↑ ↓ (垂直) | ← → ↑ ↓      | ↑ ↓      |
| ループ        | あり                    | あり         | あり     |

---

## ファイル構成

```
src/patterns/
├── button/
│   ├── ToggleButton.tsx
│   └── ToggleButton.test.tsx
├── tabs/
│   ├── Tabs.tsx
│   └── Tabs.test.tsx
└── accordion/
    ├── Accordion.tsx
    └── Accordion.test.tsx
```

1つのテストファイルに全カテゴリをまとめる。
テストを見れば、そのコンポーネントの仕様が分かるようにする。

---

## テストファイルの構成

リスクベース優先順位でカテゴリを整理する。

```typescript
describe('ComponentName', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: キーボード操作', () => {
    it('...', () => {});
  });

  describe('APG: ARIA 属性', () => {
    it('...', () => {});
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('axe による違反がない', async () => {});
  });

  describe('Props', () => {
    // 他でカバーされない固有の props テスト
    it('...', () => {});
  });

  // 🟢 Low Priority: 拡張性
  describe('HTML 属性継承', () => {
    it('...', () => {});
  });
});
```

**注意**: APG: ARIA 属性で状態変化（クリック、初期状態）をテストするため、
「基本動作」カテゴリは Props に限定し、重複を避ける。

---

## 新規パターン追加時のガイド

1. **APG 仕様を確認**
   - https://www.w3.org/WAI/ARIA/apg/patterns/
   - 必須の role と aria-\* 属性
   - キーボード操作の仕様
   - フォーカス管理の要件

2. **テストファイルを作成**
   - 既存のテストを参考に同じ構成で作成
   - テスト名は日本語で具体的に

3. **DAMP で書く**
   - 各テストは自己完結
   - 重複を恐れず、明確さを優先

---

## マルチフレームワークテスト

### 方針

各フレームワーク（React, Vue, Svelte, Astro）で **独立したテストファイル** を持つ。
テスト観点は共通だが、テストコード自体は DAMP 原則に従い各フレームワークで明示的に書く。

```
src/patterns/button/
├── ToggleButton.tsx
├── ToggleButton.test.tsx        # React ユニットテスト
├── ToggleButton.vue
├── ToggleButton.test.vue.ts     # Vue ユニットテスト
├── ToggleButton.svelte
├── ToggleButton.test.svelte.ts  # Svelte ユニットテスト
├── ToggleButton.astro
└── ToggleButton.test.astro.ts   # Astro ユニットテスト（Container API）

e2e/
└── table-visual-spanning.spec.ts  # E2E テスト（全フレームワーク共通）
```

### テストの種類

| テスト種別   | 対象               | ツール                     | 実行コマンド        |
| ------------ | ------------------ | -------------------------- | ------------------- |
| ユニット     | React/Vue/Svelte   | @testing-library + jsdom   | `npm run test:unit` |
| ユニット     | Astro              | Container API + JSDOM      | `npm run test:astro`|
| E2E          | 全フレームワーク   | Playwright                 | `npm run test:e2e`  |

### フレームワーク別ユニットテスト

| フレームワーク | テストライブラリ        | 実行環境             | コマンド             |
| -------------- | ----------------------- | -------------------- | -------------------- |
| React          | @testing-library/react  | Vitest + jsdom       | `npm run test:react` |
| Vue            | @testing-library/vue    | Vitest + jsdom       | `npm run test:vue`   |
| Svelte         | @testing-library/svelte | Vitest + jsdom       | `npm run test:svelte`|
| Astro          | Container API           | Vitest + JSDOM       | `npm run test:astro` |

### E2E テスト

E2E テストは `e2e/` ディレクトリに配置し、Playwright で全フレームワークを横断的にテストする。
視覚的なレンダリング（CSS Grid のスパン表示など）や実際のブラウザ動作を検証する場合に使用。

```typescript
// e2e/table-visual-spanning.spec.ts
const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Table Visual Spanning (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`/patterns/table/${framework}/`);
    });
    // ...
  });
}
```

### Astro Web Component パターンの2層テスト戦略

Astro コンポーネントが Web Component（`<script>` 内の `class extends HTMLElement`）を使用する場合、
テストを **2層** に分離する必要がある。

#### なぜ2層か

Astro コンポーネントは以下の2つの部分で構成される：

1. **テンプレート部分** - サーバーサイドでレンダリングされる HTML 出力
2. **Web Component 部分** - クライアントサイドで実行される JavaScript

Container API は Node.js 環境で動作するため、`HTMLElement` が定義されておらず、
Web Component のクライアントサイド動作をテストできない。

#### テスト分離の方針

| テスト層 | 対象 | ツール | テスト内容 |
|---------|------|--------|-----------|
| **Unit (Container API)** | テンプレート出力 | Vitest + JSDOM | HTML構造、属性、CSSクラス |
| **E2E (Playwright)** | Web Component 動作 | Playwright | クリック、キーボード、イベント、フォーカス |

#### Container API でテストできるもの

- HTML 要素の存在と階層構造
- 初期属性値（`checked`, `disabled`, `aria-*` など）
- props から生成される属性
- CSS クラスの適用
- 条件付きレンダリング

#### E2E でテストすべきもの

- クリック・キーボード操作による状態変更
- カスタムイベントのディスパッチ
- `indeterminate` など JavaScript で設定される状態
- フォーカス管理とタブナビゲーション
- ラベルクリックによるトグル動作

#### 例: Checkbox

```
src/patterns/checkbox/
├── Checkbox.astro           # コンポーネント本体
├── Checkbox.test.astro.ts   # Container API テスト（テンプレート出力）

e2e/
└── checkbox.spec.ts         # E2E テスト（Web Component 動作）
```

**Container API テスト（テンプレート出力の検証）:**

```typescript
// Checkbox.test.astro.ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import Checkbox from './Checkbox.astro';

describe('Checkbox (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it('renders input with type="checkbox"', async () => {
    const html = await container.renderToString(Checkbox, { props: {} });
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelector('input[type="checkbox"]')).not.toBeNull();
  });

  it('renders with checked attribute when initialChecked is true', async () => {
    const html = await container.renderToString(Checkbox, {
      props: { initialChecked: true }
    });
    const doc = new JSDOM(html).window.document;
    expect(doc.querySelector('input')?.hasAttribute('checked')).toBe(true);
  });
});
```

**E2E テスト（Web Component 動作の検証）:**

```typescript
// e2e/checkbox.spec.ts
const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Checkbox (${framework})`, () => {
    // Helper to get checkbox and its visual control
    const getCheckbox = (page, id: string) => {
      const checkbox = page.locator(`#${id}`);
      // The visual control is a sibling of the input
      const control = checkbox.locator('~ .apg-checkbox-control');
      return { checkbox, control };
    };

    test('toggles checked state on click', async ({ page }) => {
      await page.goto(`patterns/checkbox/${framework}/`);
      // Note: The input is visually hidden (1x1px), so we click
      // the visual control instead of the input directly
      const { checkbox, control } = getCheckbox(page, 'demo-terms');

      await expect(checkbox).not.toBeChecked();
      await control.click();
      await expect(checkbox).toBeChecked();
    });

    test('clicking label toggles checkbox', async ({ page }) => {
      // Label association test - clicks label, not the control
      const { checkbox } = getCheckbox(page, 'demo-terms');
      const label = page.locator('label').filter({ has: checkbox });

      await expect(checkbox).not.toBeChecked();
      await label.click();
      await expect(checkbox).toBeChecked();
    });

    test('dispatches checkedchange event', async ({ page }) => {
      // カスタムイベントのテストは E2E で行う（Astro only）
    });
  });
}
```

#### Web Component を使わない Astro パターン

Table のように Web Component を使わず、純粋なテンプレートのみのパターンは
Container API テストのみで十分にカバーできる。

### なぜ独立したテストか

1. **DAMP 原則に従う** - 各テストが自己完結
2. **フレームワーク固有の問題を即座に特定** - Vue の `v-bind` / Svelte の `$props()` など
3. **並列実行可能** - CI で効率的に実行
4. **学習リソースとして有用** - 各フレームワークのテスト手法を示す

### デモ単独ページ（E2E テスト用）

一部のパターン（特に Landmarks など）では、コンポーネントがページレイアウト内に埋め込まれると
セマンティクスが変わる場合がある。例えば `<header>` 要素は、ページの `<main>` 内にネストされると
暗黙的な `banner` ロールを失う。

このようなパターンでは、**デモ単独ページ** を作成する。このページは：
- E2E テストで正確なセマンティクスを検証するために使用
- ユーザーがデモのみを確認するためのリンクとしても提供

#### ディレクトリ構成

```
src/pages/patterns/landmarks/
├── react/
│   ├── index.astro      # 通常のパターンページ（レイアウト付き）
│   └── demo/
│       └── index.astro  # デモ単独ページ（レイアウトなし）
├── vue/
│   ├── index.astro
│   └── demo/
│       └── index.astro
├── svelte/
│   ├── index.astro
│   └── demo/
│       └── index.astro
└── astro/
    ├── index.astro
    └── demo/
        └── index.astro
```

#### デモ単独ページの実装

```astro
---
// src/pages/patterns/landmarks/react/demo/index.astro
/**
 * Demo-only Page: LandmarkDemo (React)
 *
 * This page renders the LandmarkDemo component in isolation without
 * the site layout. This ensures proper landmark semantics are preserved
 * (e.g., <header> retains its implicit banner role).
 *
 * Used for:
 * - E2E testing with correct landmark structure
 * - Standalone demo viewing
 */
import '@/styles/global.css';
import LandmarkDemo from '@patterns/landmarks/LandmarkDemo.tsx';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Demo: Landmarks (React)</title>
  </head>
  <body>
    <LandmarkDemo client:load showLabels={true} />
  </body>
</html>
```

#### パターンページからデモ単独ページへのリンク

パターンページのデモセクションに「Open demo only」リンクを追加する：

```astro
<!-- Demo Section -->
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">Demo</Heading>
  <p class="text-muted-foreground mb-4">
    This demo visualizes the 8 landmark regions with distinct colored borders.
  </p>
  <div class="border-border bg-background rounded-lg border p-6">
    <LandmarkDemo showLabels={true} />
  </div>
  <p class="text-muted-foreground mt-2 text-sm">
    <a href="./demo/" class="text-primary hover:underline">Open demo only →</a>
  </p>
</section>
```

#### E2E テストのパス

```typescript
// e2e/landmarks.spec.ts
for (const framework of frameworks) {
  test.describe(`Landmarks (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      // デモ単独ページを使用
      await page.goto(`patterns/landmarks/${framework}/demo/`);
    });
    // ...
  });
}
```

#### このアプローチを使うべきパターン

| パターン   | 理由                                                     |
| ---------- | -------------------------------------------------------- |
| Landmarks  | `<header>`/`<footer>` がページ `<main>` 内でロールを失う |
| Dialog     | フォーカストラップがページ要素と干渉する可能性           |
| その他     | ページレイアウトがコンポーネントの動作に影響する場合     |

#### 注意事項

- デモ単独ページは `robots: noindex, nofollow` メタタグで検索エンジンから除外
- パス構造 `/patterns/{pattern}/{framework}/demo/` は URL として意味が明確
- パターンページから「Open demo only」リンクでアクセス可能
- CI 時間を増やさない（別ビルド不要）ため、このアプローチを推奨

### 共通のテスト観点

フレームワークが異なっても、APG 準拠コンポーネントは同じ観点でテストする。

#### ToggleButton

| カテゴリ            | テスト観点                                            |
| ------------------- | ----------------------------------------------------- |
| 🔴 APG: キーボード  | Space でトグル、Enter でトグル、Tab でフォーカス移動  |
| 🔴 APG: ARIA        | role="button"、aria-pressed の状態変化、type="button" |
| 🟡 アクセシビリティ | axe 違反なし、アクセシブルネーム                      |
| Props               | initialPressed、onPressedChange                       |
| 🟢 HTML 属性継承    | className マージ、data-\* 継承                        |

#### Tabs

| カテゴリ            | テスト観点                                                           |
| ------------------- | -------------------------------------------------------------------- |
| 🔴 APG: キーボード  | Arrow でナビゲーション、Home/End、ループ、手動アクティベーション     |
| 🔴 APG: ARIA        | role="tablist/tab/tabpanel"、aria-selected、aria-controls/labelledby |
| 🔴 フォーカス管理   | Roving tabindex、Tab でパネルへ移動                                  |
| 🟡 アクセシビリティ | axe 違反なし                                                         |
| Props               | defaultSelectedId、orientation、activationMode                       |
| 🟢 HTML 属性継承    | className 適用                                                       |

#### Accordion

| カテゴリ            | テスト観点                                                         |
| ------------------- | ------------------------------------------------------------------ |
| 🔴 APG: キーボード  | Enter/Space で開閉、Arrow でナビゲーション（オプション）、Home/End |
| 🔴 APG: ARIA        | aria-expanded、aria-controls/labelledby、role="region" の条件      |
| 🔴 見出し構造       | headingLevel で h2-h6                                              |
| 🟡 アクセシビリティ | axe 違反なし                                                       |
| Props               | defaultExpanded、allowMultiple                                     |
| 🟢 HTML 属性継承    | className 適用                                                     |

---

## 使用ツール

| ツール                      | 用途                                    |
| --------------------------- | --------------------------------------- |
| Vitest                      | テストランナー                          |
| @testing-library/react      | React コンポーネントテスト              |
| @testing-library/vue        | Vue コンポーネントテスト                |
| @testing-library/svelte     | Svelte コンポーネントテスト             |
| @testing-library/user-event | ユーザー操作                            |
| @testing-library/jest-dom   | カスタムマッチャー                      |
| jest-axe                    | アクセシビリティ自動テスト              |
| Astro Container API         | Astro コンポーネントテスト              |
| Playwright                  | E2E テスト（全フレームワーク）          |
| @vitest/coverage-v8         | カバレッジ測定                          |

### セットアップファイル

`src/test/setup.ts` でマッチャーを拡張:

```typescript
import '@testing-library/jest-dom/vitest';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(toHaveNoViolations);
```

---

## 参考リンク

- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [DRY vs DAMP in Unit Tests](https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/)
- [Testing Library](https://testing-library.com/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
