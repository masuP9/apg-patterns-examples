# サイト仕様書

> APG Patterns Examples - Astro リビルド
> 最終更新: 2026-01-16

## 概要

WAI-ARIA APG パターンの実装例を React / Vue / Svelte / Astro で提供するドキュメントサイト。

---

## ターゲットユーザー

アクセシビリティが高いコンポーネント実装のベストプラクティスを学びたい開発者。

**ユーザーのゴール**:

- 自分が使うフレームワークでの実装方法を知りたい
- コードをコピーして自分のプロジェクトに取り込みたい
- APG 仕様の実践的な理解を深めたい

---

## 技術選定（確定）

| レイヤー       | 技術                         | 備考                   |
| -------------- | ---------------------------- | ---------------------- |
| フレームワーク | Astro                        | Islands アーキテクチャ |
| コンテンツ     | MDX                          |                        |
| デモ           | React / Vue / Svelte / Astro | フレームワーク別ページ |
| スタイリング   | Tailwind CSS + shadcn/ui     | サイト UI に使用       |
| コード表示     | Shiki                        | Astro 標準             |
| テスト         | Vitest + Playwright          | ユニット + E2E         |
| 検索           | Pagefind                     | 最初から導入           |
| 多言語         | Astro i18n                   | 最初から考慮           |
| デプロイ       | GitHub Pages                 |                        |

### 採用しないもの

| 技術                    | 理由                             |
| ----------------------- | -------------------------------- |
| Storybook               | Astro で直接確認                 |
| axe-core                | Playwright で十分                |
| Dynamic Import 切り替え | フレームワーク別ページ方式を採用 |

### shadcn/ui の使い分け

| 用途                                          | 使用                         |
| --------------------------------------------- | ---------------------------- |
| サイト UI（Header, Footer, ナビゲーション等） | shadcn/ui                    |
| APG パターンデモ                              | 純粋実装（shadcn/ui 不使用） |

**理由**: デモは APG パターンの実装例として、依存なしの純粋なコードを提供する

---

## サイト構成

### ページ構造

```
/                                    # トップページ
├── /patterns/                       # パターン一覧
│   └── /patterns/{pattern}/         # パターン概要
│       ├── /patterns/{pattern}/react/    # React 実装
│       ├── /patterns/{pattern}/vue/      # Vue 実装
│       ├── /patterns/{pattern}/svelte/   # Svelte 実装
│       └── /patterns/{pattern}/astro/    # Astro 実装（Web Components）
├── /guide/                          # 使い方ガイド
│   ├── /guide/getting-started/
│   └── /guide/contributing/
└── /about/                          # プロジェクトについて
```

### フレームワーク別ページ方式

**採用理由**:

- シンプル: Dynamic Import や状態管理の複雑さがない
- SEO 有利: 各フレームワーク専用ページが独立してインデックス
- パフォーマンス最適: そのフレームワークのバンドルのみ読み込み
- URL 共有しやすい: リンクがそのまま意図したフレームワークを表示
- SSG 最適: Astro の静的ビルドと相性が良い

### グローバルフレームワークセレクター

**動作仕様**:

- ヘッダーにフレームワーク選択 UI を配置
- 選択肢: React / Vue / Svelte / Astro
- 選択状態は localStorage に保存
- パターン一覧等からのリンク先を選択中フレームワークに自動設定
- パターン概要ページ（`/patterns/{pattern}/`）から選択中フレームワークページにリダイレクト

**UI**:

```
┌─────────────────────────────────────────────────────────┐
│  APG Patterns Examples              [React ▼] [🌙/☀️]   │
├─────────────────────────────────────────────────────────┤
```

---

## パターンページ仕様

### URL 構造

| URL                              | 内容                                        |
| -------------------------------- | ------------------------------------------- |
| `/patterns/button/`              | Toggle Button 概要（リダイレクト）          |
| `/patterns/button/react/`        | React 実装 + デモ + コード                  |
| `/patterns/button/vue/`          | Vue 実装 + デモ + コード                    |
| `/patterns/button/svelte/`       | Svelte 実装 + デモ + コード                 |
| `/patterns/button/astro/`        | Astro 実装（Web Components）+ デモ + コード |
| `/patterns/button/react/demo/`   | React デモのみ（E2E テスト用）              |
| `/patterns/button/vue/demo/`     | Vue デモのみ（E2E テスト用）                |
| `/patterns/button/svelte/demo/`  | Svelte デモのみ（E2E テスト用）             |
| `/patterns/button/astro/demo/`   | Astro デモのみ（E2E テスト用）              |

### E2E テスト用デモページ

各パターンのフレームワーク別ページには、デモコンポーネントのみを表示する専用ページを用意する。

**目的**:
- サイトレイアウトなしでコンポーネントをテストできる
- E2E テストの信頼性向上（サイト UI との干渉を回避）
- 開発者がコンポーネント単体の動作を確認できる

**ファイル構成**:
```
src/pages/patterns/{pattern}/{framework}/
├── index.astro        # パターンページ（フルレイアウト）
└── demo/
    └── index.astro    # デモのみページ（レイアウトなし）
```

**デモページの構造**:
```astro
---
import '@/styles/global.css';
import FeedDemo from '@patterns/feed/FeedDemo.tsx';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Demo: Feed (React)</title>
  </head>
  <body>
    <FeedDemo client:load />
  </body>
</html>
```

**パターンページからのリンク**:

デモセクションの最後に「Open demo only →」リンクを配置:

```astro
<div class="border-border bg-background rounded-lg border p-6">
  <FeedDemo client:load />
</div>
<p class="text-muted-foreground mt-2 text-sm">
  <a href="./demo/" class="text-primary hover:underline">Open demo only →</a>
</p>
```

### フレームワーク別ページレイアウト

```
┌─────────────────────────────────────────────────────────┐
│  Toggle Button - React                                  │
│  [React] [Vue] [Svelte] [Astro]  ← フレームワーク切り替えタブ │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ## 概要                                                │
│  パターンの説明文                                        │
│                                                         │
│  ## デモ                                                │
│  ┌───────────────────────────────────────────────────┐ │
│  │  <ToggleButtonDemo />                              │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ## ソースコード                                        │
│  ┌───────────────────────────────────────────────────┐ │
│  │  シンタックスハイライト付きコード表示 (Shiki)       │ │
│  │  [コピー]                                          │ │
│  └───────────────────────────────────────────────────┘ │
│                                                         │
│  ## アクセシビリティ要件                                │
│  - ARIA 属性                                           │
│  - キーボード操作                                       │
│  - フォーカス管理                                       │
│                                                         │
│  ## 参考リンク                                          │
│  - APG 公式                                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## ディレクトリ構成

```
src/
├── components/
│   └── ui/                          # サイト UI（shadcn/ui ベース）
│       ├── button.tsx               # shadcn/ui
│       ├── Header.astro
│       ├── Footer.astro
│       ├── FrameworkSelector.astro
│       ├── FrameworkTabs.astro
│       ├── CodeBlock.astro
│       ├── ThemeToggle.astro
│       └── Search.astro
├── patterns/                        # APG パターン実装
│   └── button/                      # 例: button パターン
│       ├── meta.ts                  # パターンメタデータ（単一の真実源）
│       ├── DemoSection.react.astro          # React 用デモ
│       ├── DemoSection.vue.astro            # Vue 用デモ
│       ├── DemoSection.svelte.astro         # Svelte 用デモ
│       ├── DemoSection.web-component.astro  # Astro Web Component 用デモ
│       ├── {pattern}-demo-data.ts   # 共通 demo data（必要なときのみ）
│       ├── TestingDocs.astro        # テストドキュメント
│       ├── Button.tsx               # React 実装
│       ├── Button.vue               # Vue 実装
│       ├── Button.svelte            # Svelte 実装
│       ├── Button.astro             # Astro 実装（Web Components）
│       ├── ButtonDemo.tsx           # デモラッパー（必要時）
│       ├── Button.test.tsx          # テスト
│       └── button.md               # AI向け定義ファイル
├── content/
│   └── accessibility-docs/          # アクセシビリティ解説（MDX）
│       └── button/
│           ├── en.mdx
│           └── ja.mdx
├── layouts/
│   ├── BaseLayout.astro
│   └── PatternLayout.astro
├── lib/
│   ├── frameworks.ts                # フレームワーク定義の一元管理
│   └── pattern-meta-types.ts        # PatternMeta 型定義
├── pages/
│   ├── index.astro
│   ├── patterns/
│   │   ├── [pattern]/
│   │   │   └── [framework]/
│   │   │       └── index.astro      # 動的ルーティング（en）
│   │   └── index.astro
│   ├── ja/patterns/
│   │   └── [pattern]/
│   │       └── [framework]/
│   │           └── index.astro      # 動的ルーティング（ja）
│   ├── guide/
│   └── about.astro
├── i18n/                            # 多言語対応
│   ├── en.json
│   └── ja.json
└── styles/
    └── global.css
```

### データ駆動アーキテクチャ

各パターンの `meta.ts` が `PatternMeta` 型でメタデータを一元定義する。動的ルーティング（`[pattern]/[framework]/index.astro`）が `import.meta.glob()` で全パターンの `meta.ts` を検出し、`getStaticPaths()` で 4フレームワーク × 2言語 のページをビルド時に生成する。

- **`meta.ts`**: タイトル、説明、TOC、リソース、フレームワーク別 API ドキュメント。全テキストは `Record<Locale, string>` で i18n 対応
- **`DemoSection.{react,vue,svelte,web-component}.astro`**: framework ごとに分割した薄い Astro。それぞれ自分の framework の実装ファイルだけを静的 import する。ページ側 dispatcher が `framework` から該当ファイルを選んで動的 import で呼ぶ
- **`{pattern}-demo-data.ts`** (任意): 4 framework で内容が完全に同一かつ概ね 8 行以上の純 data を切り出した共通ファイル
- **`content/accessibility-docs/`**: MDX でアクセシビリティ解説を記述。frontmatter は `pattern` と `locale` のみ

---

## コード表示

### 実装方式

```typescript
// 動的ルーティングでは import.meta.glob で ?raw 読み込み
const rawModules = import.meta.glob('/src/patterns/**/*.{tsx,vue,svelte,astro}', { query: '?raw' });

// 静的 import の場合
import toggleButtonCode from '@patterns/button/Button.tsx?raw';
```

### 要件

- シンタックスハイライト（Shiki）
- 行番号表示
- コピーボタン
- ダークモード対応

---

## 状態管理

### フレームワーク選択状態

**保存先**: localStorage

```typescript
const FRAMEWORK_KEY = 'apg-selected-framework';
type Framework = 'react' | 'vue' | 'svelte' | 'astro';
const DEFAULT_FRAMEWORK: Framework = 'react';
```

**用途**:

- パターン一覧からのリンク先決定
- パターン概要ページからのリダイレクト先決定
- 新規訪問時のデフォルトフレームワーク

---

## 多言語対応 (i18n)

### 対応言語

- 英語 (en) - デフォルト
- 日本語 (ja)

### URL 構造

```
/patterns/button/react/      # 英語（デフォルト）
/ja/patterns/button/react/   # 日本語
```

### 実装方針

- Astro の i18n 機能を使用
- UI テキストは JSON ファイルで管理
- パターン説明は MDX で各言語用ファイルを作成

---

## 検索機能

### 採用技術: Pagefind

**選定理由**:

- 静的サイト向け
- ビルド時にインデックス生成
- 外部サービス不要
- 軽量

### 検索対象

- パターン名
- パターン説明
- ARIA 属性
- キーボード操作

---

## テスト戦略

### ツール構成

| ツール     | 用途                                   |
| ---------- | -------------------------------------- |
| Vitest     | ユニットテスト                         |
| Playwright | E2E テスト、ブラウザレンダリングテスト |

### テスト対象

**Vitest**:

- ユーティリティ関数
- 状態管理ロジック

**Playwright**:

- キーボード操作
- フォーカス管理
- ARIA 属性の状態変化
- フレームワーク間の動作一貫性

### 設計方針

- DAMP 原則（詳細は `.internal/testing-strategy.md` 参照）

---

## ビルド・デプロイ

### Astro 設定

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://masup9.github.io',
  base: '/apg-patterns-examples',
  integrations: [react(), vue(), svelte(), tailwind(), mdx()],
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
  },
});
```

### GitHub Actions

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

---

## 追加仕様（Codex レビュー反映）

### エラーハンドリング

- **404ページ**: カスタム404ページを作成
- **コンポーネント読み込み失敗**: フォールバック UI を表示

### ダークモード

- Tailwind `darkMode: 'class'` を使用
- localStorage に保存（キー: `apg-theme`）
- デフォルト: システム設定に従う

### レスポンシブ対応

- ブレイクポイント: Tailwind デフォルト（sm: 640px, md: 768px, lg: 1024px）
- モバイル: デモは縦スクロール表示

### Content Collection スキーマ

```typescript
const patternSchema = z.object({
  title: z.string(),
  description: z.string(),
  framework: z.enum(['react', 'vue', 'svelte', 'astro']).optional(),
  ariaFeatures: z.array(z.string()),
  keyboardSupport: z.array(z.string()),
  apgLink: z.string().url(),
  complexity: z.enum(['low', 'medium', 'high']),
});
```

### shadcn/ui 統合方針

- shadcn/ui コンポーネントは React 製
- Astro から `client:load` で Island として呼び出し
- 例: `<Button client:load>Click</Button>`

### リダイレクト実装

```typescript
// src/pages/patterns/[pattern]/index.astro
---
const framework = Astro.cookies.get('apg-framework')?.value || 'react';
return Astro.redirect(`/patterns/${Astro.params.pattern}/${framework}/`);
---
```

### localStorage フォールバック

```typescript
function getFramework(): Framework {
  try {
    return (localStorage.getItem(FRAMEWORK_KEY) as Framework) || DEFAULT_FRAMEWORK;
  } catch {
    return DEFAULT_FRAMEWORK;
  }
}
```

---

## 移行計画

### Phase 1: 基盤構築 ✅ 完了

**完了基準**: ビルド成功 + 空ページ表示

- [x] Astro プロジェクト作成
- [x] React / Vue / Svelte / Astro 統合設定
- [x] Tailwind + shadcn/ui 設定
- [x] 基本レイアウト作成
- [x] i18n 設定
- [x] ダークモード実装

### Phase 2: コア機能 ✅ 完了

- [x] フレームワークセレクター実装
- [x] フレームワーク別ページテンプレート
- [x] コード表示コンポーネント
- [ ] Pagefind 設定

### Phase 3: コンテンツ移行 ✅ 完了

全 29 パターン実装完了（React / Vue / Svelte / Astro）:

- Toggle Button, Tabs, Accordion, Dialog, Menu Button, Disclosure, Alert
- Checkbox, Radio Group, Switch, Listbox, Combobox, Tooltip, Breadcrumb, Link
- Toolbar, Menubar, Grid, Slider, Spinbutton, Meter, Alert Dialog
- Carousel, Table, Tree View, Treegrid, Feed, Window Splitter, Landmarks

### Phase 4: サイト完成 ✅ 完了

- [x] トップページ
- [x] ガイドページ
- [x] About ページ
- [x] テスト整備（Vitest + Playwright）
- [x] GitHub Actions 設定
- [x] 動作確認・デプロイ
- [ ] Pagefind 検索設定

---

## 参考

- [Astro Docs](https://docs.astro.build/)
- [Astro Islands](https://docs.astro.build/en/concepts/islands/)
- [Astro i18n](https://docs.astro.build/en/guides/internationalization/)
- [Pagefind](https://pagefind.app/)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
