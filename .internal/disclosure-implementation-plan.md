# Disclosure パターン実装計画

## 概要

WAI-ARIA APG の Disclosure パターンを React、Vue、Svelte、Astro の4フレームワークで実装する。

- APG 仕様: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

## Disclosure vs Accordion の違い

| 項目         | Disclosure                           | Accordion              |
| ------------ | ------------------------------------ | ---------------------- |
| 単位         | 単独コンポーネント                   | グループ管理           |
| 複数展開     | N/A（単独なので常に独立）            | allowMultiple で制御   |
| キーボード   | Enter/Space のみ（buttonネイティブ） | Enter/Space + 矢印キー |
| ユースケース | FAQ回答、詳細表示、ナビ展開          | セクション切り替え     |

## APG 仕様要件

### ARIA 属性

| 属性            | 要素   | 値                   | 必須 |
| --------------- | ------ | -------------------- | ---- |
| `aria-expanded` | button | `"true"` / `"false"` | ✅   |
| `aria-controls` | button | パネルのID           | ✅   |

### キーボード操作

| キー  | アクション                           |
| ----- | ------------------------------------ |
| Enter | 開閉をトグル（buttonネイティブ動作） |
| Space | 開閉をトグル（buttonネイティブ動作） |

**注意**: `<button>` 要素のネイティブ動作に任せるため、独自のキーハンドラは実装しない。

### HTML 構造

**閉じた状態:**

```html
<div class="apg-disclosure">
  <button type="button" aria-expanded="false" aria-controls="panel-id">開閉ボタン</button>
  <div id="panel-id" class="apg-disclosure-panel" aria-hidden="true" inert>
    <div class="apg-disclosure-panel-content">パネルコンテンツ</div>
  </div>
</div>
```

**開いた状態:**

```html
<div class="apg-disclosure">
  <button type="button" aria-expanded="true" aria-controls="panel-id">開閉ボタン</button>
  <div id="panel-id" class="apg-disclosure-panel apg-disclosure-panel--expanded">
    <div class="apg-disclosure-panel-content">パネルコンテンツ</div>
  </div>
</div>
```

**状態切り替え時の属性変更:**

| 状態 | `aria-expanded` | パネルの `aria-hidden` | パネルの `inert` | パネルの class                   |
| ---- | --------------- | ---------------------- | ---------------- | -------------------------------- |
| 閉じ | `"false"`       | `"true"`               | あり             | `apg-disclosure-panel`           |
| 開き | `"true"`        | なし（削除）           | なし（削除）     | `apg-disclosure-panel--expanded` |

**トリガーボタンの動作:**

- `aria-expanded`: パネルの開閉状態に応じて `"true"` / `"false"` を切り替え
- `aria-controls`: パネルの `id` を参照（常に設定）
- クリック/Enter/Space で開閉をトグル（button のネイティブ動作）

## ネイティブ HTML との比較

ネイティブの `<details>` / `<summary>` 要素との比較を AccessibilityDocs に記載する。

```html
<!-- ネイティブ HTML -->
<details>
  <summary>詳細を見る</summary>
  <p>コンテンツ</p>
</details>
```

**ネイティブを使うべきケース:**

- シンプルな開閉コンテンツ
- JavaScript 無効環境での動作が必要
- アニメーションが不要

**カスタム実装が必要なケース:**

- スムーズな開閉アニメーション
- 外部からの状態制御
- 複数 Disclosure の連携
- 細かいスタイリング制御

## コンポーネント設計

### Props 設計

```typescript
interface DisclosureProps {
  /** パネルが開いた状態で初期化（Accordionと命名統一） */
  defaultExpanded?: boolean;
  /** 開閉変更時のコールバック */
  onExpandedChange?: (expanded: boolean) => void;
  /** トリガーボタンのコンテンツ（テキスト/アイコンのみ推奨） */
  trigger: React.ReactNode;
  /** パネルのコンテンツ */
  children: React.ReactNode;
  /** 無効状態 */
  disabled?: boolean;
  /** 追加の CSS クラス */
  className?: string;
}
```

**設計判断:**

- **Uncontrolled のみ**: `open` prop は削除。Switch/Accordion と同様に uncontrolled パターンに統一
- **命名統一**: `defaultExpanded` で Accordion と整合性を取る
- **trigger の制約**: ボタン内にフォーカス可能な要素を置かないことを推奨（ドキュメント化）

### ID 生成ポリシー

各フレームワークでSSR-safe なID生成を行う:

| Framework | 方法                                   | 備考                                    |
| --------- | -------------------------------------- | --------------------------------------- |
| React     | `useId()` フック                       | SSR対応済み                             |
| Vue       | `useId()` (Vue 3.5+)                   | SSR対応済み                             |
| Svelte    | `id` prop を受け取り、Astro側で生成    | Svelte 5 には `useId()` がない          |
| Astro     | サーバーサイドで `crypto.randomUUID()` | SSRのみ（ハイドレーションなし）なのでOK |

**注意事項:**

- Vue: `useId()` は Vue 3.5+ でのみ利用可能。このプロジェクトは Vue 3.5+ を前提とする
- Svelte: Svelte 5 には `useId()` がないため、`id` prop を必須とし、Astro ページ側で `crypto.randomUUID()` を使ってIDを生成して渡す
- Astro: Web Components として実装するため、`client:*` ディレクティブを使わない限りハイドレーションは発生しない

**Svelte での実装例:**

```svelte
<script lang="ts">
  interface DisclosureProps {
    id: string;  // 必須
    // ...
  }
  let { id, ... }: DisclosureProps = $props();

  // IDを使ってaria-controls用のpanelIdを生成
  const panelId = `${id}-panel`;
</script>
```

```astro
<!-- Astro ページ側 -->
<Disclosure id={crypto.randomUUID()} client:load />
```

### disabled 挙動

- `disabled` 属性のみをボタンに設定（ネイティブ動作を活用）
- `aria-disabled` は使用しない（`disabled` で十分、冗長を避ける）
- `onExpandedChange` は disabled 時に呼ばれない（ネイティブ動作でクリック無効）

## アニメーション実装

`grid-template-rows` を使用したCSSアニメーションを採用（クロスブラウザ対応）。

参考: https://www.tak-dcxi.com/article/css-only-details-animation-2025/

### APG準拠のための `aria-hidden` + `inert` 戦略

`grid-template-rows: 0fr` だけではアクセシビリティツリーからパネルが削除されないため、
スクリーンリーダーが折りたたまれたコンテンツにアクセスできてしまう問題がある。

**解決策**: `aria-hidden` + `inert` 属性を使用

```html
<!-- 閉じた状態 -->
<div id="panel-id" class="apg-disclosure-panel" aria-hidden="true" inert>
  <div class="apg-disclosure-panel-content">パネルコンテンツ</div>
</div>

<!-- 開いた状態 -->
<div id="panel-id" class="apg-disclosure-panel apg-disclosure-panel--expanded">
  <div class="apg-disclosure-panel-content">パネルコンテンツ</div>
</div>
```

- `aria-hidden="true"`: スクリーンリーダーからコンテンツを隠す
- `inert`: パネル内のフォーカス可能要素へのフォーカス移動を防止
- 展開時は両属性を削除（`aria-hidden` と `inert` を設定しない）

**視覚的な非表示:**

- `grid-template-rows: 0fr` + `overflow: hidden` により視覚的にも非表示
- `aria-hidden` + `inert` はアクセシビリティツリーとフォーカス管理用

**`inert` のフォールバック:**

- `inert` 属性は IE/古いブラウザでサポートされない
- フォールバックとして、閉じた状態で `tabindex="-1"` をフォーカス可能要素に設定
- または inert polyfill (https://github.com/WICG/inert) を使用
- このプロジェクトではモダンブラウザをターゲットとするため、polyfill なしで `inert` を使用

### CSS アニメーション

```css
.apg-disclosure-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 200ms ease-out;
}

.apg-disclosure-panel--expanded {
  grid-template-rows: 1fr;
}

.apg-disclosure-panel-content {
  overflow: hidden;
}

/* prefers-reduced-motion 対応 */
@media (prefers-reduced-motion: reduce) {
  .apg-disclosure-panel {
    transition: none;
  }
}
```

**メリット:**

- `aria-hidden` + `inert` でAPG準拠
- Safari/Firefox でも動作
- スムーズな高さアニメーション
- `prefers-reduced-motion` 対応

### ファイル構成

```
src/patterns/disclosure/
├── Disclosure.tsx          # React 実装
├── Disclosure.vue          # Vue 実装
├── Disclosure.svelte       # Svelte 実装
├── Disclosure.astro        # Astro (Web Components) 実装
├── AccessibilityDocs.astro # アクセシビリティドキュメント
└── disclosure.css          # 共通スタイル（オプション）
```

### ページ構成

```
src/pages/patterns/disclosure/
├── index.astro             # リダイレクト
├── react/index.astro
├── vue/index.astro
├── svelte/index.astro
└── astro/index.astro
```

## 実装順序

1. **React 実装** (基準実装)
   - Disclosure.tsx 作成
   - デモページ作成
   - 動作確認

2. **Vue 実装**
   - Disclosure.vue 作成
   - デモページ作成

3. **Svelte 実装**
   - Disclosure.svelte 作成
   - デモページ作成

4. **Astro (Web Components) 実装**
   - Disclosure.astro 作成
   - デモページ作成

5. **AccessibilityDocs 作成**
   - Native HTML Considerations（details/summary）
   - WAI-ARIA Roles
   - WAI-ARIA States / Properties
   - Keyboard Support

6. **パターン一覧への追加**
   - src/lib/patterns.ts 更新

## デモ内容

各フレームワークで以下のデモを実装:

1. **基本的な Disclosure**
   - シンプルな開閉

2. **FAQ 形式**
   - 複数の独立した Disclosure

3. **詳細情報表示**
   - 画像の説明など

## スタイリング方針

- 既存パターン（Accordion 等）と統一感のあるデザイン
- 開閉状態を示す視覚的インジケーター（矢印アイコン）
- フォーカス状態の明確な表示
- ダークモード対応

## テスト観点

1. **アクセシビリティ**
   - `aria-expanded` が正しく切り替わる
   - `aria-controls` が正しいIDを参照
   - キーボード操作（Enter/Space）で開閉（buttonネイティブ動作）

2. **機能**
   - 初期状態（defaultExpanded）
   - disabled 状態
   - onExpandedChange コールバック

3. **スクリーンリーダー**
   - 状態の読み上げ確認

4. **アニメーション**
   - grid-template-rows によるスムーズな開閉
   - 各ブラウザでの動作確認

## 参考資料

- [APG Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [MDN: details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [CSS Only Details Animation](https://www.tak-dcxi.com/article/css-only-details-animation-2025/)
- 既存実装: `src/patterns/accordion/`
