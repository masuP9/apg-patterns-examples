# Landmarks パターン実装計画書

## 1. 概要

Landmarks は、ページの主要なセクションを識別する8つの ARIA ロールを定義するパターンです。支援技術ユーザーがページ構造を把握し、効率的にナビゲーションできるようにします。

**主要機能**:
- 8つのランドマークロール（banner, navigation, main, contentinfo, complementary, region, search, form）
- ネイティブ HTML 要素との対応（header, nav, main, footer, aside, section, search, form）
- 複数ランドマーク時のラベル付け

**類似パターン**: なし（ページ構造パターンとして独自）

**特殊性**:
- 他のウィジェットパターン（Button, Tabs 等）と異なり、ページ全体の構造を定義
- コンポーネントというより「ページレイアウトのベストプラクティス」を示すデモ
- ほとんどのケースでネイティブ HTML 要素の使用を推奨

---

## 2. APG 仕様サマリー

### Roles

| Role | HTML 要素 | 説明 | 制約 |
|------|-----------|------|------|
| `banner` | `<header>` | サイト全体のヘッダー | ページに1つのみ、トップレベル |
| `navigation` | `<nav>` | ナビゲーションリンク群 | 複数可、要ラベル |
| `main` | `<main>` | ページの主要コンテンツ | ページに1つのみ、トップレベル |
| `contentinfo` | `<footer>` | サイト全体のフッター | ページに1つのみ、トップレベル |
| `complementary` | `<aside>` | 補完的コンテンツ | トップレベル推奨 |
| `region` | `<section>` | 名前付きセクション | **必須: aria-label/labelledby** |
| `search` | `<form role="search">` | 検索機能 | 検索領域に推奨 |
| `form` | `<form>` | フォーム領域 | **必須: aria-label/labelledby** |

### Properties（静的属性）

| 属性 | 対象 | 値 | 必須 | 備考 |
|------|------|-----|------|------|
| `aria-label` | 全ランドマーク | 文字列 | 条件付き | 同種が複数ある場合、または region/form |
| `aria-labelledby` | 全ランドマーク | ID参照 | 条件付き | 見出しを参照する場合 |

### States（動的属性）

該当なし（Landmarks は静的構造）

### Keyboard Support

**該当なし**: Landmarks 自体はキーボード操作を持たない。スクリーンリーダーのランドマークナビゲーション機能（例: NVDA の `D` キー、VoiceOver の rotor）で利用される。

### Focus Management

該当なし（Landmarks はフォーカス可能要素ではない）

---

## 3. ネイティブ HTML との対応・差分（必須）

### HTML 要素 vs ARIA ロールの対応

| HTML 要素 | ARIA ロール | 自動マッピング条件 | ARIA が必要なケース |
|-----------|-------------|-------------------|-------------------|
| `<header>` | `banner` | `<body>` の直接の子の場合 | article/aside/main/nav/section 内では暗黙マッピングなし |
| `<nav>` | `navigation` | 常に | 古いブラウザ対応時のみ role 追加 |
| `<main>` | `main` | 常に | 古いブラウザ対応時のみ role 追加 |
| `<footer>` | `contentinfo` | `<body>` の直接の子の場合 | article/aside/main/nav/section 内では暗黙マッピングなし |
| `<aside>` | `complementary` | 常に | 古いブラウザ対応時のみ role 追加 |
| `<section>` | `region` | **aria-label/labelledby がある場合のみ** | ラベルなしの section は region にならない |
| `<form role="search">` | `search` | role 属性で明示 | `<search>` 要素は新しく、ブラウザサポートが限定的なため `<form role="search">` を推奨 |
| `<form>` | `form` | **aria-label/labelledby がある場合のみ** | ラベルなしの form は form ランドマークにならない |

### 推奨事項

1. **ネイティブ HTML を優先**: 可能な限りセマンティック HTML 要素を使用
2. **ARIA は補完的に**: 古いブラウザ対応や、HTML 要素が使えない場合のみ
3. **ラベル付け**: 同種のランドマークが複数ある場合は必ずユニークなラベルを付与
4. **すべてのコンテンツをランドマーク内に**: 支援技術ユーザーが見落とさないように

---

## 4. 実装アプローチの決定

### 採用アプローチ: デモページ + 教育コンポーネント

Landmarks は「コンポーネント」というより「ページ構造のパターン」であるため、以下のアプローチを採用:

1. **LandmarkDemo コンポーネント**: ランドマーク構造を視覚化するデモ
2. **各ランドマークをハイライト表示**: 視覚的にどこがどのランドマークかわかるUI
3. **正しい実装例 vs 誤った実装例**: ベストプラクティスを示す

### コンポーネント設計

```typescript
// 単一のデモコンポーネント（ページ構造全体を示す）
interface LandmarkDemoProps {
  showLabels?: boolean;      // ランドマーク名のオーバーレイ表示
  highlightActive?: boolean; // ホバー時にハイライト
}
```

### ファイル構成

```
src/patterns/landmarks/
├── LandmarkDemo.tsx         # React デモ
├── LandmarkDemo.vue         # Vue デモ
├── LandmarkDemo.svelte      # Svelte デモ
├── LandmarkDemo.astro       # Astro デモ
├── LandmarkDemo.test.tsx    # React テスト
├── LandmarkDemo.test.vue.ts # Vue テスト
├── LandmarkDemo.test.svelte.ts # Svelte テスト
├── LandmarkDemo.test.astro.ts  # Astro テスト
├── AccessibilityDocs.astro
├── AccessibilityDocs.ja.astro
├── TestingDocs.astro
├── TestingDocs.ja.astro
├── NativeHtmlNotice.astro   # ネイティブ HTML 推奨の説明
├── NativeHtmlNotice.ja.astro
└── llm.md
```

---

## 5. テスト設計（DAMP 原則）

### テストファイル構成

```typescript
describe('LandmarkDemo', () => {
  // 🔴 High Priority: ランドマーク構造
  describe('APG: Landmark Roles', () => {
    it('has banner landmark (header)', () => {});
    it('has navigation landmark (nav)', () => {});
    it('has main landmark (main)', () => {});
    it('has contentinfo landmark (footer)', () => {});
    it('has complementary landmark (aside)', () => {});
    it('has region landmark with label (section[aria-labelledby])', () => {});
    it('has search landmark (form[role="search"])', () => {});
    it('has form landmark with label (form[aria-label])', () => {});
  });

  describe('APG: Landmark Labeling', () => {
    it('navigation landmarks have unique labels when multiple', () => {});
    it('complementary landmarks have unique labels when multiple', () => {});
    it('region landmarks always have accessible name', () => {});
    it('form landmarks have accessible name', () => {});
  });

  // 🟡 Medium Priority: アクセシビリティ
  describe('Accessibility', () => {
    it('has no axe-core violations', async () => {});
    // Note: 「全コンテンツがランドマーク内」は推奨事項であり必須要件ではないため、
    // チェックリストで確認し、テストには含めない
  });

  // 🟢 Low Priority: Props
  describe('Props', () => {
    it('applies className to container', () => {});
    it('shows landmark labels when showLabels is true', () => {});
  });
});
```

### テストケース一覧

#### 🔴 High Priority: ランドマーク構造

| テストケース | 検証内容 |
|--------------|----------|
| `has banner landmark` | `<header>` または `role="banner"` が存在 |
| `has navigation landmark` | `<nav>` または `role="navigation"` が存在 |
| `has main landmark` | `<main>` または `role="main"` が存在 |
| `has contentinfo landmark` | `<footer>` または `role="contentinfo"` が存在 |
| `has search landmark` | `<form role="search">` が存在 |
| `has form landmark` | ラベル付き `<form>` が存在 |
| `has exactly one main landmark` | main が1つのみ |
| `banner is at top level` | banner が article/aside/main/nav/section 内にない |
| `contentinfo is at top level` | contentinfo が article/aside/main/nav/section 内にない |

#### 🔴 High Priority: ラベル付け

| テストケース | 検証内容 |
|--------------|----------|
| `navigation has unique labels when multiple` | 複数 nav に異なる aria-label |
| `complementary has unique labels when multiple` | 複数 aside に異なる aria-label |
| `region has accessible name` | section に aria-label または aria-labelledby |
| `form landmark has accessible name` | form に aria-label または aria-labelledby |

#### 🟡 Medium Priority: アクセシビリティ

| テストケース | 検証内容 |
|--------------|----------|
| `has no axe-core violations` | WCAG 2.1 AA 準拠 |

#### チェックリスト（テスト対象外の推奨事項）

| 確認項目 | 説明 |
|----------|------|
| 全コンテンツがランドマーク内に含まれる | APG の推奨事項（必須要件ではない） |
| ランドマーク数が7つ以下 | 多すぎると支援技術ユーザーにとって煩雑 |

---

## 6. 実装詳細

### Props 設計（React）

```typescript
export interface LandmarkDemoProps extends React.HTMLAttributes<HTMLDivElement> {
  /** ランドマーク名のオーバーレイを表示 */
  showLabels?: boolean;
}
```

### 構造図

```
┌─────────────────────────────────────────────────────────────┐
│ <header> role="banner"                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <nav aria-label="Main"> role="navigation"               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ <main> role="main"                                           │
│ ┌─────────────────────┐ ┌─────────────────────────────────┐ │
│ │ <section            │ │ <aside> role="complementary"    │ │
│ │   aria-labelledby>  │ │                                 │ │
│ │   role="region"     │ │                                 │ │
│ └─────────────────────┘ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <form role="search" aria-label="Site search">          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <form aria-label="Contact form"> role="form"            │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│ <footer> role="contentinfo"                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ <nav aria-label="Footer"> role="navigation"             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### フレームワーク別の注意点

#### React
- 標準的な HTML セマンティック要素を使用
- `role` 属性は古いブラウザ対応時のみ

#### Vue
- `defineOptions({ inheritAttrs: false })` は不要（デモコンポーネント）
- セマンティック HTML をそのまま使用

#### Svelte
- セマンティック HTML をそのまま使用

#### Astro
- Web Components は不要（静的構造のため）
- サーバーサイドレンダリングで十分

---

## 7. TDD ワークフロー

### Phase 0: 設計準備
1. APG 仕様の確認 ✅
2. llm.md の作成
3. Codex に llm.md のレビューを依頼

### Phase 1: テスト作成（RED フェーズ）
1. React テストの作成
2. 他フレームワークのユニットテスト作成
3. E2E テスト作成
4. チェックリスト照合

### Phase 2: 実装（GREEN フェーズ）
1. React 実装
2. Vue / Svelte / Astro 実装
3. CSS 作成（ランドマークの視覚化スタイル）

### Phase 3: リファクタリング
1. コード整理
2. 計画-実装-テスト 三点照合

### Phase 4: ドキュメント（英語）
1. AccessibilityDocs.astro
2. TestingDocs.astro
3. NativeHtmlNotice.astro（必須）

### Phase 5: 日本語ドキュメント
1. AccessibilityDocs.ja.astro
2. TestingDocs.ja.astro
3. NativeHtmlNotice.ja.astro

### Phase 6: ページ作成・統合
1. 英語デモページ作成（4フレームワーク）
2. 日本語デモページ作成（4フレームワーク）
3. 成果物照合チェック
4. patterns.ts の status を 'available' に更新

---

## 8. Codex レビューポイント

### llm.md レビュー
- 8つのランドマークロールが全て記載されているか
- ネイティブ HTML との対応が正確か
- ラベル付けルールが明確か

### テストコードレビュー
- ランドマーク構造のテストが網羅されているか
- ラベル付けのテストが含まれているか
- axe-core テストが含まれているか

### 実装コードレビュー
- セマンティック HTML が正しく使われているか
- ランドマークの制約（トップレベル、1つのみ等）が守られているか
- 複数ランドマークのラベル付けが正しいか

---

## 9. リスクと注意点

### 技術的リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| `<search>` 要素のブラウザサポート | 中 | `<form role="search">` を推奨パターンとして採用 |
| ランドマークの過剰使用 | 低 | 7つ以下を推奨する旨をドキュメントに記載 |
| axe-core のランドマーク関連ルールの差異 | 低 | WCAG 2.1 AA ルールセットを明示、偽陽性に注意 |

### 実装上の注意点

- **CSS インポート漏れ**: `src/styles/patterns/landmarks.css` を作成したら global.css に追加
- **header/footer のスコープ**: `<body>` 直下でないと banner/contentinfo にならない
- **region/form の必須ラベル**: ラベルなしでは landmarks にならない

### Landmarks パターンの特殊性

1. **キーボード操作なし**: 通常のウィジェットと異なり、Landmarks 自体に操作はない
2. **スクリーンリーダーナビゲーション**: NVDA/VoiceOver のランドマークジャンプ機能で利用
3. **デモの目的**: 「使い方を示す」のが主目的で、再利用可能なコンポーネントではない

---

## 10. 成果物一覧

### コンポーネント
- [ ] `LandmarkDemo.tsx`
- [ ] `LandmarkDemo.vue`
- [ ] `LandmarkDemo.svelte`
- [ ] `LandmarkDemo.astro`

### テスト
- [ ] `LandmarkDemo.test.tsx`
- [ ] `LandmarkDemo.test.vue.ts`
- [ ] `LandmarkDemo.test.svelte.ts`
- [ ] `LandmarkDemo.test.astro.ts`
- [ ] `e2e/landmarks.spec.ts`

### ドキュメント（英語）
- [ ] `AccessibilityDocs.astro`
- [ ] `TestingDocs.astro`
- [ ] `NativeHtmlNotice.astro`
- [ ] `llm.md`

### ドキュメント（日本語）
- [ ] `AccessibilityDocs.ja.astro`
- [ ] `TestingDocs.ja.astro`
- [ ] `NativeHtmlNotice.ja.astro`

### ページ（英語）
- [ ] `src/pages/patterns/landmarks/index.astro`
- [ ] `src/pages/patterns/landmarks/react/index.astro`
- [ ] `src/pages/patterns/landmarks/vue/index.astro`
- [ ] `src/pages/patterns/landmarks/svelte/index.astro`
- [ ] `src/pages/patterns/landmarks/astro/index.astro`

### ページ（日本語）
- [ ] `src/pages/ja/patterns/landmarks/react/index.astro`
- [ ] `src/pages/ja/patterns/landmarks/vue/index.astro`
- [ ] `src/pages/ja/patterns/landmarks/svelte/index.astro`
- [ ] `src/pages/ja/patterns/landmarks/astro/index.astro`

### 設定更新
- [ ] `src/lib/patterns.ts` の status を 'available' に
- [ ] `src/styles/global.css` に CSS インポート追加

---

## 検証方法

1. **ユニットテスト**: `npm run test:unit -- landmarks`
2. **E2E テスト**: `npm run test:e2e -- landmarks`
3. **ビルド確認**: `npm run build`
4. **スクリーンリーダー動作確認**: NVDA/VoiceOver でランドマークナビゲーション
5. **axe DevTools**: ブラウザ拡張でランドマーク構造を確認

---

## Codex レビュー結果と対応

### 指摘事項と対応

| 重要度 | 指摘内容 | 対応 |
|--------|----------|------|
| 重大 | `<search>` 要素を標準 HTML として扱っているが、ブラウザサポートが限定的 | `<form role="search">` を推奨パターンとして修正 |
| 高 | 「search は form より優先」は APG/ARIA のルールではない | 「検索領域に推奨」に修正 |
| 高 | テスト設計に `form` ランドマークの存在確認が欠けている | form ランドマークのテストを追加 |
| 中 | 「all content is within landmarks」は APG 必須要件ではない | テストからチェックリストに移動 |
| 中 | ラベルのユニーク性テストが navigation のみに限定 | complementary 等も追加 |

### 未解決の質問（実装時に確認）

1. **form ランドマークの扱い**: APG/ARIA では「名前付きの場合のみランドマーク」だが、AT 依存がある
2. **axe-core のルールセット**: WCAG 2.1 AA を明示しているが、ランドマーク関連はツールによって差異がある
