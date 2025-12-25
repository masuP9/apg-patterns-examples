# TODO - APG Patterns Examples

> 最終更新: 2025-12-25

## 現状

**Astro 移行完了**

Docusaurus + 3 Storybook 構成から Astro Islands アーキテクチャへの移行が完了。

仕様詳細: [.internal/site-specification.md](.internal/site-specification.md)

---

## 残タスク

### サイト完成

- [ ] ガイドページ
- [ ] About ページ
- [ ] 404 ページ
- [ ] Pagefind 検索設定
- [ ] テスト整備（Vitest + Playwright）
- [ ] GitHub Actions 設定更新
- [ ] 動作確認・デプロイ

---

## APG パターン実装状況

### Tier 1 (高頻度使用)

| パターン | 状況 | 複雑度 |
|---------|------|--------|
| Toggle Button | ✅ 完了 | 低 |
| Tabs | ✅ 完了 | 中 |
| Accordion | 📋 未実装 | 中 |
| Dialog (Modal) | 📋 未実装 | 高 |
| Menu Button | 📋 未実装 | 高 |
| Disclosure | 📋 未実装 | 低 |
| Alert | 📋 未実装 | 低 |

### Tier 2 (中頻度使用)

| パターン | 状況 | 複雑度 |
|---------|------|--------|
| Checkbox | 📋 未実装 | 低 |
| Radio Group | 📋 未実装 | 中 |
| Switch | 📋 未実装 | 低 |
| Listbox | 📋 未実装 | 高 |
| Combobox | 📋 未実装 | 高 |
| Tooltip | 📋 未実装 | 中 |
| Breadcrumb | 📋 未実装 | 低 |
| Link | 📋 未実装 | 低 |

### Tier 3-4 (特定用途・高度)

Slider, Spinbutton, Meter, Toolbar, Menu Bar, Alert Dialog, Carousel, Grid, Table, Tree View, Treegrid, Feed, Window Splitter, Landmarks

---

## 技術スタック

| 項目 | 技術 |
|------|------|
| フレームワーク | Astro (Islands) |
| UI フレームワーク | React / Vue / Svelte |
| デモ表示 | フレームワーク別ページ方式 |
| スタイリング | Tailwind CSS |
| コード表示 | Shiki |
| テスト | Vitest + Playwright（予定） |
| 多言語 | Astro i18n（予定） |
| 検索 | Pagefind（予定） |

---

## 将来の計画

- MCP (Model Context Protocol) 対応
- npm パッケージ化
- VS Code Extension

---

## 参考リンク

- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [Astro Docs](https://docs.astro.build/)
- [プロジェクトサイト](https://masup9.github.io/apg-patterns-examples/)
- [リポジトリ](https://github.com/masuP9/apg-patterns-examples)
