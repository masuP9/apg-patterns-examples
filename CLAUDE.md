# CLAUDE.md - APG Patterns Examples

## プロジェクト概要

**APG Patterns Examples** は、WAI-ARIA Authoring Practices Guide (APG) のコンポーネントパターンを React、Vue、Svelte、Astro の4つのフレームワークで実装し、実際に動作するデモとテストを提供するプロジェクト。

## 技術スタック

| レイヤー       | 技術                           |
| -------------- | ------------------------------ |
| フレームワーク | Astro (Islands アーキテクチャ) |
| コンテンツ     | MDX                            |
| デモ           | React / Vue / Svelte / Astro   |
| スタイリング   | Tailwind CSS + shadcn/ui       |
| コード表示     | Shiki                          |
| フォーマット   | Prettier + @takazudo/mdx-formatter |
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
│   ├── frameworks.ts          # フレームワーク定義の一元管理
│   └── pattern-meta-types.ts  # PatternMeta 型定義
├── patterns/                  # APG パターン実装
│   └── button/                # 例: button パターン
│       ├── meta.ts            # パターンメタデータ（単一の真実源）
│       ├── DemoSection.react.astro          # React 用デモ
│       ├── DemoSection.vue.astro            # Vue 用デモ
│       ├── DemoSection.svelte.astro         # Svelte 用デモ
│       ├── DemoSection.web-component.astro  # Astro Web Component 用デモ
│       ├── {pattern}-demo-data.ts # 共通 demo data（必要なときのみ。後述）
│       ├── TestingDocs.astro  # テストドキュメント
│       ├── Button.tsx         # React 実装
│       ├── Button.vue         # Vue 実装
│       ├── Button.svelte      # Svelte 実装
│       ├── Button.astro       # Astro 実装（Web Components）
│       ├── ButtonDemo.tsx     # React デモラッパー（必要時）
│       ├── Button.test.tsx    # テスト
│       └── button.md          # AI向け定義ファイル（llm.md）
├── content/
│   └── accessibility-docs/    # アクセシビリティ解説（MDX）
│       └── button/
│           ├── en.mdx         # 英語
│           └── ja.mdx         # 日本語
├── layouts/
├── pages/
│   ├── patterns/
│   │   ├── [pattern]/
│   │   │   └── [framework]/
│   │   │       └── index.astro  # 動的ルーティング（en）
│   │   └── index.astro          # パターン一覧
│   ├── ja/patterns/
│   │   └── [pattern]/
│   │       └── [framework]/
│   │           └── index.astro  # 動的ルーティング（ja）
│   └── ...
├── i18n/
└── styles/
```

### データ駆動アーキテクチャ

各パターンの `meta.ts` が単一の真実源（Single Source of Truth）となる。1つの `meta.ts` から 4フレームワーク × 2言語 = 8ページが動的に生成される。

- **`meta.ts`**: タイトル、説明、TOC、リソース、フレームワーク別メタデータ（ソースファイル、API Props/Events/Slots）を `PatternMeta` 型で定義。全テキストは `Record<Locale, string>` で i18n 対応
- **`DemoSection.{react,vue,svelte,web-component}.astro`**: framework ごとに分割した薄い Astro。それぞれ自分の framework の実装ファイルだけを静的 import する。`Astro.props` から `locale` のみを受け取り、`framework` prop は持たない。pages 側 dispatcher が `framework` から該当ファイルを選んで呼ぶ
- **`{pattern}-demo-data.ts`** (任意): 4 framework で内容が完全に同一かつ概ね 8 行以上の純 data (配列/オブジェクトリテラル) を切り出した共通ファイル。framework 固有の prop 名 (Vue `ariaLabel` ↔ React/Astro `aria-label`) や関数 (`renderCell` など) は含めず、各 `DemoSection.{framework}.astro` 側で吸収する。共有 data が小さい (8 行未満) または framework 間で差があるパターンでは作らない
- **動的ルーティング**: `[pattern]/[framework]/index.astro` が `import.meta.glob()` で全パターンの `meta.ts` を検出し、`getStaticPaths()` でビルド時にページ生成。同じファイル内の dispatcher が `DemoSection.${framework}.astro` (Astro Web Component は `web-component`) を `import.meta.glob` 経由で動的 import する。loader 欠落時は `throw` する設計（`getStaticPaths` が valid な組み合わせのみ生成する前提）

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

各パターンのアクセシビリティ解説は `src/content/accessibility-docs/{pattern}/{en,ja}.mdx` に MDX で記述する。`TestingDocs.astro` がこれを読み込んで表示する。以下のセクション構成で作成する:

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

### 開発サーバー

開発サーバーはユーザーが別ターミナルで起動済みの場合が多い。ページ確認時は以下の手順で:

1. `curl -s -o /dev/null -w '%{http_code}' http://localhost:4336/` でアクセスを試みる（通常このポートで起動している）
2. 応答がなければ `lsof -i -P | grep LISTEN | grep node` で起動中のポートを探す
3. どちらも見つからなければ `npm run dev` をバックグラウンドで起動する

ポートは自動割当（cwd ハッシュベース）のため固定値ではない。ローカル開発時の base path は `/`（本番の `/apg-patterns-examples/` ではない）。

### コマンド

package.jsonのscriptsを参照

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
