# APG Patterns Examples

> WAI-ARIA APG パターンに準拠した、React、Vue、Svelte、Astro のアクセシブルな UI コンポーネント実装集

[![Deploy to GitHub Pages](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml)

日本語 | [English](./README.md)

## 概要

このプロジェクトは、[WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) のパターンに従ったアクセシブルな UI コンポーネントとテストケースを提供します。

各コンポーネントは、**React**、**Vue**、**Svelte**、**Astro**（Web Components）の4つの主要フロントエンドフレームワークで実装されていて、より身近な実装例を下にアクセシビリティやWAI-ARIAの学習に役立てることができます。

また各コンポーネントには、APGパターンに従っているかどうかのテストが書かれており、テストをそのまま利用し自身が開発したコンポーネントのアクセシビリティを担保することも可能です。またテストについてはAIが理解しやすい形のドキュメントを整備しており、テストケースを生成することもしやすいドキュメントになっています。

その他、ダークモード、ハイコントラストモード、強制カラーモードに対応したスタイリングも提供しさらにアクセシブルなコンポーネントの開発を支援します。

## パターン実装例の提供状況

| パターン             | React | Vue | Svelte | Astro | E2E | ステータス |
| -------------------- | ----- | --- | ------ | ----- | --- | ---------- |
| Accordion            | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Alert                | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Alert Dialog         | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Breadcrumb           | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Button               | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Carousel             | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Checkbox             | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Combobox             | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Data Grid            | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Dialog               | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Disclosure           | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Feed                 | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Grid                 | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Landmarks            | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Link                 | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Listbox              | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Menubar              | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Menu Button          | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Meter                | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Radio Group          | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Slider               | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Slider (Multi-Thumb) | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Spinbutton           | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Switch               | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Table                | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Tabs                 | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Toggle Button        | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Toolbar              | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Tooltip              | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Tree View            | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Treegrid             | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Window Splitter      | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |

## スタイリング

- ハイコントラストモードのサポート
- モーション削減の設定への対応
- 強制カラーモードのサポート

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
- アクセシビリティチェックを含むテストを書く
- アクセシビリティ機能を徹底的にドキュメント化する
- セマンティックなコミットメッセージを使用する

## APG 上流追従ウォッチャー

[`w3c/aria-practices`](https://github.com/w3c/aria-practices) を日次でポーリングし、追跡対象のパターンパスに新規コミットが入ったら APG slug ごとに 1 Issue を起票する GitHub Actions ワークフローを用意しています。レビュアーは各上流変更をこのサイトに反映すべきか、1 か所で判断できます。

### 初期セットアップ（1 度だけ）

1. **リポジトリ設定**: Settings → Actions → General → Workflow permissions → "Read and write permissions" を有効化（state 更新の commit と Issue 作成のため）。
2. **ラベル**: `apg-upstream` という名前のラベルを 1 個作成。

### 実行

- **スケジュール**: 毎日 JST 08:17 (UTC 23:17) に `.github/workflows/apg-upstream-watch.yml` から自動実行。
- **手動 / dry-run**: GitHub UI → Actions → APG Upstream Watch → "Run workflow"。入力（すべて任意）:
  - `dry_run=true`: 副作用なしで意図したアクションのみ表示。
  - `since_override=<ISO8601>`: 全 slug に対して指定時刻以降のコミットを取得（初回 backfill 用）。
  - `patterns=<id,id,...>`: 指定 patternId のみ対象にする。

### State

`.github/apg-state.json` に APG slug ごとに「watcher が Issue 化済みの最後のコミット SHA と日時」を記録します。bot ユーザーが `[skip ci]` 付きで state 更新を commit します。初回検知時は最新コミットを baseline として記録するのみで Issue は作成しません（過去 N 年分の流入を防ぐため）。

### Issue 識別

各 Issue 本文に隠し marker `<!-- apg-upstream:slug=<apg-slug> -->` が埋め込まれています。watcher はタイトルではなくこの marker で既存 open Issue を見つけてコメント追記するため、タイトル変更は安全です。

### ローカル実行

```bash
GITHUB_TOKEN=$(gh auth token) DRY_RUN=true PATTERNS_FILTER=button \
  SINCE_OVERRIDE=2025-12-01T00:00:00Z \
  npm run watch:apg
```

## セキュリティ

セキュリティに関する懸念や脆弱性の報告については、[Security Policy](./SECURITY.md) をご覧ください。

## ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています。詳細については [LICENSE](./LICENSE) ファイルをご覧ください。


## リンク

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [ライブデモ](https://masup9.github.io/apg-patterns-examples/)
- [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)
