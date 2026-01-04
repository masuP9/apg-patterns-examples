# APG Patterns Examples

> WAI-ARIA APG パターンに準拠した、React、Vue、Svelte、Astro のアクセシブルな UI コンポーネント実装集

[![Deploy to GitHub Pages](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml)

日本語 | [English](./README.md)

## 概要

このプロジェクトは、[WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) 仕様に準拠したアクセシブルな UI コンポーネントを提供します。各コンポーネントは、**React**、**Vue**、**Svelte**、**Astro**（Web Components）の 4 つの主要フロントエンドフレームワークで実装されています。

## 機能

- **マルチフレームワーク**: React、Vue、Svelte、Astro（Web Components）での実装
- **アクセシビリティファースト**: WAI-ARIA APG 準拠
- **Astro Islands**: インタラクティブコンポーネントを含む高速で最適化された静的サイト
- **インタラクティブドキュメント**: シンタックスハイライト（Shiki）付きのライブサンプル
- **テスト**: Vitest と Testing Library によるテスト
- **開発者体験**: TypeScript、Tailwind CSS、ホットリロード
- **レスポンシブ**: モバイルファーストデザイン

## 技術スタック

| レイヤー       | 技術                           |
| -------------- | ------------------------------ |
| フレームワーク | Astro (Islands アーキテクチャ) |
| コンテンツ     | MDX                            |
| デモ           | React / Vue / Svelte / Astro   |
| スタイリング   | Tailwind CSS + shadcn/ui       |
| コード表示     | Shiki                          |
| テスト         | Vitest + Testing Library       |
| デプロイ       | GitHub Pages                   |

## クイックスタート

### 必要環境

- Node.js 20+
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/masuP9/apg-patterns-examples.git
cd apg-patterns-examples

# 依存関係をインストール
npm install
```

### 開発

```bash
# 開発サーバーを起動
npm run dev
# http://localhost:4321 で開きます

# プロダクションビルド
npm run build

# プロダクションビルドをプレビュー
npm run preview

# テストを実行
npm run test

# リント
npm run lint

# フォーマット
npm run format
```

## コンポーネント実装状況

| パターン      | React | Vue | Svelte | Astro | ステータス |
| ------------- | ----- | --- | ------ | ----- | ---------- |
| Accordion     | ✅    | ✅  | ✅     | ✅    | 完了       |
| Alert         | ✅    | ✅  | ✅     | ✅    | 完了       |
| Breadcrumb    | ✅    | ✅  | ✅     | ✅    | 完了       |
| Dialog        | ✅    | ✅  | ✅     | ✅    | 完了       |
| Disclosure    | ✅    | ✅  | ✅     | ✅    | 完了       |
| Listbox       | ✅    | ✅  | ✅     | ✅    | 完了       |
| Menu Button   | ✅    | ✅  | ✅     | ✅    | 完了       |
| Switch        | ✅    | ✅  | ✅     | ✅    | 完了       |
| Tabs          | ✅    | ✅  | ✅     | ✅    | 完了       |
| Toggle Button | ✅    | ✅  | ✅     | ✅    | 完了       |
| Toolbar       | ✅    | ✅  | ✅     | ✅    | 完了       |
| Tooltip       | ✅    | ✅  | ✅     | ✅    | 完了       |

## アーキテクチャ

```
apg-patterns-examples/
├── src/
│   ├── components/           # サイト UI (shadcn/ui)
│   │   └── ui/
│   ├── lib/                  # ユーティリティ
│   ├── patterns/             # APG パターン実装
│   │   ├── accordion/        # Accordion (React/Vue/Svelte/Astro)
│   │   ├── alert/            # Alert
│   │   ├── breadcrumb/       # Breadcrumb
│   │   ├── button/           # Toggle Button
│   │   ├── dialog/           # Dialog
│   │   ├── disclosure/       # Disclosure
│   │   ├── listbox/          # Listbox
│   │   ├── menu-button/      # Menu Button
│   │   ├── switch/           # Switch
│   │   ├── tabs/             # Tabs
│   │   ├── toolbar/          # Toolbar
│   │   └── tooltip/          # Tooltip
│   ├── layouts/              # ページレイアウト
│   ├── pages/                # ルーティングページ
│   ├── styles/               # グローバルスタイル
│   └── test/                 # テストユーティリティ
├── .internal/                # 内部ドキュメント
├── public/                   # 静的アセット
├── astro.config.mjs
├── CLAUDE.md                 # 開発ガイド
└── package.json
```

## コンポーネント API

### Toggle Button

すべてのコンポーネントは、フレームワーク間で同じ props パターンに従います：

```tsx
// React
<ToggleButton initialPressed={false} onToggle={(pressed) => console.log(pressed)}>
  Mute
</ToggleButton>
```

```vue
<!-- Vue -->
<ToggleButton :initial-pressed="false" @toggle="(pressed) => console.log(pressed)">
  Mute
</ToggleButton>
```

```svelte
<!-- Svelte -->
<ToggleButton initialPressed={false} ontoggle={(e) => console.log(e.detail)}>Mute</ToggleButton>
```

### 主な機能

- **HTML 属性の継承**: 標準の HTML 属性を渡すことができます
- **アクセシビリティ**: キーボードナビゲーションを含む完全な ARIA サポート
- **フレームワーク非依存**: React、Vue、Svelte、Astro 間で一貫した API
- **TypeScript**: 完全な型安全性と IntelliSense サポート

## スタイリング

コンポーネントは、アクセシビリティ強化を備えた Tailwind CSS を使用しています：

- ハイコントラストモードのサポート
- モーション削減の設定への対応
- 強制カラーモードのサポート
- テーマ設定用の CSS カスタムプロパティ

## コントリビューション

コントリビューションを歓迎します！詳細については、[Contributing Guide](./CONTRIBUTING.md) をご覧ください：

- 開発セットアップとワークフロー
- コーディング規約とガイドライン
- コンポーネント実装要件
- テスト要件
- プルリクエストプロセス

### コントリビューションの手順

1. リポジトリをフォーク
2. フィーチャーブランチを作成: `git checkout -b feature/amazing-component`
3. [コーディング規約](./CODING_RULES.md) に従う
4. すべてのテストが通り、コードがフォーマットされていることを確認
5. プルリクエストを送信

### 開発ガイドライン

- APG パターンに正確に従う
- 4 つすべてのフレームワーク間でパリティを維持する
- アクセシビリティチェックを含むテストを書く
- アクセシビリティ機能を徹底的にドキュメント化する
- セマンティックなコミットメッセージを使用する

## セキュリティ

セキュリティに関する懸念や脆弱性の報告については、[Security Policy](./SECURITY.md) をご覧ください。

## ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています。詳細については [LICENSE](./LICENSE) ファイルをご覧ください。

## 謝辞

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/)
- フレームワークコミュニティ: React、Vue、Svelte
- Islands アーキテクチャの Astro チーム

## リンク

- [ライブデモ](https://masup9.github.io/apg-patterns-examples/)
- [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)
