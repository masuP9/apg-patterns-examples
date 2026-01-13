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
| Accordion            | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Alert                | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Alert Dialog         | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Breadcrumb           | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Button               | -     | -   | -      | -     | -   | 予定       |
| Carousel             | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Checkbox             | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Combobox             | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Dialog               | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Disclosure           | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Feed                 | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Grid                 | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Landmarks            | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Link                 | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Listbox              | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Menubar              | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Menu Button          | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Meter                | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Radio Group          | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Slider               | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Slider (Multi-Thumb) | -     | -   | -      | -     | -   | 予定       |
| Spinbutton           | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Switch               | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Table                | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Tabs                 | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Toggle Button        | ✅    | ✅  | ✅     | ✅    | ✅  | 完了       |
| Toolbar              | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Tooltip              | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
| Tree View            | ✅    | ✅  | ✅     | ✅    | -   | 完了       |
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

## セキュリティ

セキュリティに関する懸念や脆弱性の報告については、[Security Policy](./SECURITY.md) をご覧ください。

## ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています。詳細については [LICENSE](./LICENSE) ファイルをご覧ください。


## リンク

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [ライブデモ](https://masup9.github.io/apg-patterns-examples/)
- [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)
