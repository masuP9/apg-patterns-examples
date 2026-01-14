# CLAUDE.md - APG Patterns Examples

## プロジェクト概要

**APG Patterns Examples** は、WAI-ARIA Authoring Practices Guide (APG) のコンポーネントパターンを React、Vue、Svelte、Astro の4つのフレームワークで実装し、実際に動作するデモと詳細なコード解説を提供するプロジェクトです。

### プロジェクトの目標

- APG準拠のアクセシブルなコンポーネント実装
- フレームワーク別のベストプラクティス提供
- プロダクション品質のコード
- 日英バイリンガル対応
- GitHub Pages での自動デプロイ

---

## 技術スタック（Astro リビルド版）

| レイヤー       | 技術                           |
| -------------- | ------------------------------ |
| フレームワーク | Astro (Islands アーキテクチャ) |
| コンテンツ     | MDX                            |
| デモ           | React / Vue / Svelte / Astro   |
| スタイリング   | Tailwind CSS + shadcn/ui       |
| コード表示     | Shiki                          |
| テスト         | Vitest + Playwright            |
| 検索           | Pagefind                       |
| 多言語         | Astro i18n                     |
| デプロイ       | GitHub Pages                   |

---

## ディレクトリ構成

```
src/
├── components/                # サイト UI (shadcn/ui)
│   └── ui/
├── lib/                       # ユーティリティ
│   └── frameworks.ts          # フレームワーク定義の一元管理
├── patterns/                  # APG パターン実装
│   ├── button/
│   │   ├── ToggleButton.tsx
│   │   ├── ToggleButton.vue
│   │   ├── ToggleButton.svelte
│   │   ├── ToggleButton.astro  # Web Components
│   │   └── AccessibilityDocs.astro
│   └── tabs/
│       ├── Tabs.tsx
│       ├── Tabs.vue
│       ├── Tabs.svelte
│       ├── Tabs.astro          # Web Components
│       └── AccessibilityDocs.astro
├── content/
│   └── patterns/              # MDX コンテンツ
├── layouts/
├── pages/
│   ├── patterns/
│   │   └── [pattern]/
│   │       ├── index.astro    # リダイレクト
│   │       ├── react/
│   │       ├── vue/
│   │       ├── svelte/
│   │       └── astro/
│   └── ...
├── i18n/
└── styles/
```

**パスエイリアス**（tsconfig.json）:

- `@/*` → `./src/*`
- `@patterns/*` → `./src/patterns/*`

---

## 内部ドキュメント

| ファイル                                                             | 内容                                            | 参照タイミング |
| -------------------------------------------------------------------- | ----------------------------------------------- | -------------- |
| [CODING_RULES.md](CODING_RULES.md)                                   | コーディングスタイル規約                        | コード実装時   |
| [.internal/site-specification.md](.internal/site-specification.md)   | サイト仕様書（技術選定、URL設計、実装方針）     | 実装時         |
| [.internal/testing-strategy.md](.internal/testing-strategy.md)       | テスト設計方針（DAMP原則、APG準拠テストの観点） | テスト実装時   |
| [.internal/architecture-review.md](.internal/architecture-review.md) | アーキテクチャレビュー（現状課題、改善選択肢）  | 参考資料       |
| [.internal/llm-md-template.md](.internal/llm-md-template.md)         | AI向け定義ファイル（llm.md）のテンプレート      | パターン追加時 |

---

## 開発ガイド

### コンポーネント設計原則

#### 1. HTML属性継承パターン

**React**:

```typescript
export interface ToggleButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'type' | 'aria-pressed'
> {
  initialPressed?: boolean;
  onToggle?: (pressed: boolean) => void;
}
```

**Vue**:

```vue
<script setup>
defineOptions({ inheritAttrs: false })
</script>
<template>
  <button v-bind="$attrs">
</template>
```

**Svelte**:

```svelte
<button {...$$restProps}>
```

**Astro** (Web Components):

```astro
<apg-toggle-button>
  <button type="button" aria-pressed={initialPressed}>
    <slot />
  </button>
</apg-toggle-button>

<script>
  class ApgToggleButton extends HTMLElement {
    connectedCallback() {
      // イベントリスナー設定
    }
  }
  customElements.define('apg-toggle-button', ApgToggleButton);
</script>
```

#### 2. アクセシビリティファースト

- `aria-pressed` 等の ARIA 属性による状態管理
- キーボードナビゲーション（Space/Enter）
- スクリーンリーダー対応
- フォーカス管理

#### 3. AccessibilityDocs 構成

各パターンの `AccessibilityDocs.astro` は以下のセクション構成で作成する:

1. **Native HTML Considerations** (該当パターンのみ)
   - ネイティブ HTML 要素の推奨（例: `<a>`, `<table>`, `<input type="number">`）
   - カスタム実装が必要になるユースケース
   - ネイティブ vs カスタムの判断基準

2. **WAI-ARIA Roles**
   - 使用する role の一覧と説明
   - 各 role の適用対象要素

3. **WAI-ARIA States / Properties**
   - `aria-*` 属性の詳細（値、必須/任意、変更トリガー）
   - 仕様へのリンク

4. **Keyboard Support**
   - キーボード操作の一覧表
   - 各キーのアクション説明

**ネイティブ HTML セクションが必要なパターン例:**

- Link → `<a href>`
- Table → `<table>`
- Checkbox → `<input type="checkbox">`
- Radio Group → `<input type="radio">`
- Meter → `<meter>`
- Spinbutton → `<input type="number">`

#### 4. AI 向け定義ファイル（llm.md）

各パターンには AI コーディングアシスタント向けの定義ファイル `llm.md` を作成する。これにより、Claude Code や Cursor などで類似コンポーネントを実装する際に参照できる。

**配置場所**: `src/patterns/{pattern}/llm.md`

**必須セクション**:

1. **Overview** - パターンの概要（1-2文）
2. **ARIA Requirements** - Roles, Properties, States を表形式で
3. **Keyboard Support** - キーボード操作一覧
4. **Focus Management** - フォーカス管理ルール
5. **Test Checklist** - 優先度別テスト項目（High/Medium）
6. **Implementation Notes** - 実装上の注意点、構造図
7. **Example Test Code** - テストコードのサンプル

**作成時の注意**:

- トークン効率を考慮し、簡潔に記述
- 表形式を活用して情報を整理
- APG 公式リファレンスへのリンクを含める
- テンプレートは [.internal/llm-md-template.md](.internal/llm-md-template.md) を参照

#### 5. shadcn/ui の使い分け

| 用途                           | 使用                 |
| ------------------------------ | -------------------- |
| サイト UI（Header, Footer 等） | shadcn/ui            |
| APG パターンデモ               | 純粋実装（依存なし） |

#### 6. Astro でのフレームワークコンポーネント制約

Astro テンプレート内で React/Vue/Svelte の子コンポーネントを使う場合、**子は静的にシリアライズされる**ため、状態管理が機能しない。

```astro
<!-- ❌ 動作しない: ToolbarToggleButton の状態が機能しない -->
<Toolbar client:load>
  <ToolbarToggleButton>Bold</ToolbarToggleButton>
</Toolbar>

<!-- ✅ 動作する: 全体を1つのコンポーネントにまとめる -->
<TextFormattingToolbar client:load />
```

**ラッパーコンポーネントが必要なケース:**

- 子コンポーネントが自身の状態を持つ（例: toggle の pressed 状態）
- Compound Components パターン（例: Toolbar + ToolbarButton）
- 親から Context を受け取る子コンポーネント

**不要なケース:**

- データ駆動型: `<Tabs tabs={[...]} />` のように props でデータを渡す
- 静的な子要素のみ
- 単一コンポーネント

#### 7. 多言語ページの Heading ID

日本語ページでは `Heading` コンポーネントに明示的な `id` を指定すること。

`Heading` コンポーネントはテキストからスラグを自動生成するが、日本語などの非ASCII文字は除去されてしまい、空または不正なIDになる。これにより TOC（On this page）ナビゲーションが機能しなくなる。

```astro
<!-- ✅ 正しい: id を明示 -->
<Heading level={2} id="demo">{t('pattern.demo')}</Heading>
<Heading level={2} id="accessibility-features">{t('pattern.accessibility')}</Heading>

<!-- ❌ 間違い: 日本語テキストから空のIDが生成される -->
<Heading level={2}>{t('pattern.demo')}</Heading>
```

**注意事項:**

- `tocItems` の `id` と `Heading` の `id` を一致させること
- 日本語と英語で同じIDを使用する（URLフラグメントの一貫性のため）
- ビルド時に非ASCII文字を含むテキストで `id` が未指定の場合、警告が出力される

---

## URL 設計

```
/                                    # トップページ
├── /patterns/                       # パターン一覧
│   └── /patterns/{pattern}/         # リダイレクト
│       ├── /patterns/{pattern}/react/
│       ├── /patterns/{pattern}/vue/
│       ├── /patterns/{pattern}/svelte/
│       └── /patterns/{pattern}/astro/
├── /guide/
└── /about/
```

**多言語**:

```
/patterns/button/react/      # 英語（デフォルト）
/ja/patterns/button/react/   # 日本語
```

---

## 開発環境

### 必要環境

- Node.js 20+
- npm

### コマンド

```bash
# 開発サーバー起動
npm run dev
# ※ポートは自動割当（空いているポートが使用される）
# 起動後にターミナル出力でポート番号を確認すること

# ビルド
npm run build

# テスト（全て: unit + e2e）
npm run test

# ユニットテスト（全フレームワーク）
npm run test:unit

# フレームワーク別ユニットテスト
npm run test:react
npm run test:vue
npm run test:svelte
npm run test:astro    # Container API テスト

# E2E テスト（Playwright）
npm run test:e2e
npm run test:e2e:ui   # UI モード

# 特定パターンの E2E テスト
npm run test:e2e:pattern --pattern=tabs
npm run test:e2e:pattern --pattern=accordion

# 特定フレームワーク + 特定パターン（要: npm run dev 別ターミナル）
npm run test:e2e:react:pattern --pattern=tabs
npm run test:e2e:vue:pattern --pattern=tabs

# その他
npm run test:watch    # ウォッチモード
npm run test:coverage # カバレッジ

# フォーマット
npm run format

# リント
npm run lint
```

### コーディングスタイル規約

コードフォーマット規則とコードスタイル規約は [CODING_RULES.md](CODING_RULES.md) を参照。

### E2E テストとページ確認

- **ページの確認には Playwright を使用する**（curl ではなく）
- Playwright の MCP ツール（`mcp__playwright__*`）を使用してブラウザでページを確認
- DOM 構造や属性の確認も Playwright 経由で行う

```typescript
// 例: aria 属性の確認
const grid = page.getByRole('grid');
const rowcount = await grid.getAttribute('aria-rowcount');
```

---

## 参考リンク

- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [Astro Docs](https://docs.astro.build/)
- [shadcn/ui](https://ui.shadcn.com/)
- [プロジェクトサイト](https://masup9.github.io/apg-patterns-examples/)
- [リポジトリ](https://github.com/masuP9/apg-patterns-examples)

---

## 移行状況

現在、Docusaurus + 3 Storybook 構成から Astro への移行を計画中。

詳細は [.internal/site-specification.md](.internal/site-specification.md) を参照。
