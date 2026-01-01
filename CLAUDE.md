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

| レイヤー | 技術 |
|---------|------|
| フレームワーク | Astro (Islands アーキテクチャ) |
| コンテンツ | MDX |
| デモ | React / Vue / Svelte / Astro |
| スタイリング | Tailwind CSS + shadcn/ui |
| コード表示 | Shiki |
| テスト | Vitest + Playwright |
| 検索 | Pagefind |
| 多言語 | Astro i18n |
| デプロイ | GitHub Pages |

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

| ファイル | 内容 | 参照タイミング |
|---------|------|---------------|
| [.internal/site-specification.md](.internal/site-specification.md) | サイト仕様書（技術選定、URL設計、実装方針） | 実装時 |
| [.internal/testing-strategy.md](.internal/testing-strategy.md) | テスト設計方針（DAMP原則、APG準拠テストの観点） | テスト実装時 |
| [.internal/architecture-review.md](.internal/architecture-review.md) | アーキテクチャレビュー（現状課題、改善選択肢） | 参考資料 |

---

## 開発ガイド

### コンポーネント設計原則

#### 1. HTML属性継承パターン

**React**:
```typescript
export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type' | 'aria-pressed'> {
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

#### 3. shadcn/ui の使い分け

| 用途 | 使用 |
|------|------|
| サイト UI（Header, Footer 等） | shadcn/ui |
| APG パターンデモ | 純粋実装（依存なし） |

#### 4. Astro でのフレームワークコンポーネント制約

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

# ビルド
npm run build

# テスト
npm run test
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
