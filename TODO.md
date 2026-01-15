# TODO - APG Patterns Examples

> 最終更新: 2026-01-16

## 現状

**Astro 移行完了・全パターン実装完了・全 E2E テスト完了**

Docusaurus + 3 Storybook 構成から Astro Islands アーキテクチャへの移行が完了。
29 パターン全て実装済み、E2E テスト完了。

仕様詳細: [.internal/site-specification.md](.internal/site-specification.md)

---

## 残タスク

### サイト完成

- [x] ガイドページ
- [x] About ページ
- [x] 404 ページ
- [ ] Pagefind 検索設定
- [x] テスト整備（Vitest + Playwright）
- [x] GitHub Actions 設定更新
- [x] 動作確認・デプロイ

### E2E テスト

29/29 パターン完了（100%）

- [x] Accordion
- [x] Dialog
- [x] Menu Button
- [x] Radio Group
- [x] Slider
- [x] Spinbutton
- [x] Tabs
- [x] Toolbar
- [x] Tooltip
- [x] Tree View

---

## APG パターン実装状況

### Tier 1 (高頻度使用)

| パターン       | 状況    | E2E | 複雑度 |
| -------------- | ------- | --- | ------ |
| Toggle Button  | ✅ 完了 | ✅  | 低     |
| Tabs           | ✅ 完了 | ✅  | 中     |
| Accordion      | ✅ 完了 | ✅  | 中     |
| Dialog (Modal) | ✅ 完了 | ✅  | 高     |
| Menu Button    | ✅ 完了 | ✅  | 中     |
| Disclosure     | ✅ 完了 | ✅  | 低     |
| Alert          | ✅ 完了 | ✅  | 低     |

### Tier 2 (中頻度使用)

| パターン    | 状況    | E2E | 複雑度 |
| ----------- | ------- | --- | ------ |
| Checkbox    | ✅ 完了 | ✅  | 低     |
| Radio Group | ✅ 完了 | ✅  | 中     |
| Switch      | ✅ 完了 | ✅  | 低     |
| Listbox     | ✅ 完了 | ✅  | 高     |
| Combobox    | ✅ 完了 | ✅  | 高     |
| Tooltip     | ✅ 完了 | ✅  | 中     |
| Breadcrumb  | ✅ 完了 | ✅  | 低     |
| Link        | ✅ 完了 | ✅  | 低     |

### Tier 3-4 (特定用途・高度)

| パターン        | 状況    | E2E | 複雑度 |
| --------------- | ------- | --- | ------ |
| Toolbar         | ✅ 完了 | ✅  | 中     |
| Menubar         | ✅ 完了 | ✅  | 高     |
| Grid            | ✅ 完了 | ✅  | 高     |
| Slider          | ✅ 完了 | ✅  | 中     |
| Spinbutton      | ✅ 完了 | ✅  | 中     |
| Meter           | ✅ 完了 | ✅  | 低     |
| Alert Dialog    | ✅ 完了 | ✅  | 中     |
| Carousel        | ✅ 完了 | ✅  | 高     |
| Table           | ✅ 完了 | ✅  | 中     |
| Tree View       | ✅ 完了 | ✅  | 高     |
| Treegrid        | ✅ 完了 | ✅  | 高     |
| Feed            | ✅ 完了 | ✅  | 中     |
| Window Splitter | ✅ 完了 | ✅  | 中     |
| Landmarks       | ✅ 完了 | ✅  | 低     |

### 未実装（将来の計画）

| パターン             | 複雑度   |
| -------------------- | -------- |
| Slider (Multi-Thumb) | 高       |
| Data Grid            | 非常に高 |
| Editable Grid        | 非常に高 |

---

## 技術スタック

| 項目              | 技術                       |
| ----------------- | -------------------------- |
| フレームワーク    | Astro (Islands)            |
| UI フレームワーク | React / Vue / Svelte       |
| デモ表示          | フレームワーク別ページ方式 |
| スタイリング      | Tailwind CSS               |
| コード表示        | Shiki                      |
| テスト            | Vitest + Playwright        |
| 多言語            | Astro i18n                 |
| 検索              | Pagefind（未実装）         |

---

## 将来の計画

### Phase 1: APG パターンの充実

- [ ] Slider (Multi-Thumb) パターン
- [ ] Data Grid パターン（詳細: [.internal/plans/grid-patterns-roadmap.md](.internal/plans/grid-patterns-roadmap.md)）
- [ ] Editable Grid パターン

### Phase 2: APG 以外のパターン

- [ ] Toast / Snackbar（通知パターン）
- [ ] Skeleton / Loading States
- [ ] Infinite Scroll
- [ ] Virtual List
- [ ] その他、実プロダクトで頻出するパターン

### 並行: 学習リソース・AI 対応の強化

- [ ] llm.md の改善（より構造化された形式、トークン効率の向上）
- [ ] インタラクティブなデモ体験（キーボード操作のガイド表示）
- [ ] axe-core 連携（デモ上でアクセシビリティチェック結果を表示）
- [ ] コピー可能な最小実装スニペット
- [ ] Pagefind 検索機能

---

## 参考リンク

- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [Astro Docs](https://docs.astro.build/)
- [プロジェクトサイト](https://masup9.github.io/apg-patterns-examples/)
- [リポジトリ](https://github.com/masuP9/apg-patterns-examples)
