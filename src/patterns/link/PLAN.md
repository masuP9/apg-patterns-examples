# Link パターン実装計画

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/link/

## 1. 概要

Link パターンは、外部リソースまたは現在のページ/アプリケーション内のリソースへのインタラクティブな参照を提供するウィジェットです。

**重要**: APG では **ネイティブ HTML `<a href>` 要素の使用を強く推奨** しています。カスタム ARIA リンクは、ブラウザ標準のリンク機能（新規タブで開く、URL コピー等）を自動的に提供しないため、教育目的での実装となります。

**主要機能**:
- クリックまたは Enter キーでリンク先に遷移
- フォーカス可能でキーボードアクセシブル
- スクリーンリーダーで「リンク」として認識される

**類似パターン**: `button/`（シンプルなインタラクション）、`checkbox/`（ネイティブ HTML 注記の参考）

---

## 2. APG 仕様サマリー

### Roles

| Role | 対象要素 | 説明 |
|------|----------|------|
| `link` | `<span>`, `<img>` 等 | 要素をリンクとして識別 |

### Properties（静的属性）

| 属性 | 対象要素 | 値 | 必須 | 備考 |
|------|----------|-----|------|------|
| `tabindex` | カスタムリンク要素 | `0` / `-1` | Yes | 通常時 `0`、disabled 時 `-1` |
| `aria-label` | リンク要素 | テキスト | 条件付き | テキストコンテンツがない場合に必須 |
| `aria-labelledby` | リンク要素 | ID参照 | 条件付き | 外部ラベルを参照する場合 |
| `aria-current` | リンク要素 | `page` / `step` / `location` 等 | No | 現在のページ/位置を示す場合 |

### States（動的属性）

| 属性 | 対象要素 | 値 | 必須 | 変更トリガー |
|------|----------|-----|------|--------------|
| `aria-disabled` | リンク要素 | `true`/`false` | No | disabled 状態の切り替え |

### Keyboard Support

| キー | アクション |
|------|------------|
| `Enter` | リンクを実行し、ターゲットリソースに移動 |
| `Shift + F10` | （オプション）リンクのコンテキストメニューを開く |

### Focus Management

- `tabindex="0"` でフォーカス可能にする
- **disabled 時は `tabindex="-1"` でフォーカス不可**
- ネイティブ `<a>` 要素は自動的にフォーカス可能
- Roving tabindex は不要（単一要素のため）

---

## 3. Non-Goals（意図的に実装しないもの）

カスタム ARIA リンクでは以下のネイティブ機能を**実装しません**。これは教育的な目的であり、ネイティブ `<a>` 要素の優位性を示すためです。

| 機能 | 説明 |
|------|------|
| **修飾キーによる動作変更** | Ctrl+Click で新規タブ、Shift+Click で新規ウィンドウ等 |
| **ドラッグ&ドロップ** | リンクをブックマークバーにドラッグ等 |
| **URL コピー** | 右クリック→「リンクのアドレスをコピー」|
| **完全なコンテキストメニュー** | ブラウザ標準の右クリックメニュー |
| **SEO 認識** | 検索エンジンによるリンク認識 |

これらの機能が必要な場合は、ネイティブ `<a>` 要素を使用してください。

---

## 4. テスト設計

DAMP 原則に基づき、以下の構成でテストを作成します。

### テストファイル構成

```typescript
describe('Link', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG ARIA Attributes', () => {
    // role="link" の検証
    // tabindex="0" の検証
    // アクセシブルネームの検証
  });

  describe('APG Keyboard Interaction', () => {
    // Enter キーでのリンク実行
    // Space キーでは実行されない（リンク特有）
    // IME 入力中は実行されない
  });

  describe('Disabled State', () => {
    // aria-disabled の検証
    // tabindex="-1" の検証
    // disabled 時の動作制限
  });

  // 🟡 Medium Priority
  describe('Accessibility', () => {
    // axe-core 違反なし（代表的なケースのみ）
  });

  // 🟢 Low Priority
  describe('Props & Behavior', () => {
    // href の処理
    // onClick コールバック
    // className 継承
  });
});
```

### テストケース一覧

#### 🔴 High Priority: ARIA 属性

| テストケース | 検証内容 |
|--------------|----------|
| `has role="link" on element` | role 属性の存在 |
| `has tabindex="0" on element` | フォーカス可能 |
| `has accessible name from text content` | テキストからの名前取得 |
| `has accessible name from aria-label` | aria-label からの名前取得 |
| `sets aria-disabled="true" when disabled` | disabled 状態の反映 |
| `sets tabindex="-1" when disabled` | disabled 時のフォーカス不可 |

#### 🔴 High Priority: キーボード操作

| テストケース | 検証内容 |
|--------------|----------|
| `calls onClick on Enter key` | Enter キーでの実行 |
| `does not call onClick on Space key` | Space キーでは実行されない |
| `does not call onClick when event.isComposing is true` | IME 入力中は実行されない |
| `does not call onClick when event.defaultPrevented is true` | 既に処理済みのイベントは無視 |
| `calls onClick on click` | クリックでの実行 |
| `does not call onClick when disabled` | disabled 時は実行されない |

#### 🔴 High Priority: フォーカス管理

| テストケース | 検証内容 |
|--------------|----------|
| `is focusable via Tab` | Tab キーでフォーカス可能 |
| `is not focusable when disabled` | disabled 時はフォーカス不可 |

#### 🟡 Medium Priority: アクセシビリティ

| テストケース | 検証内容 |
|--------------|----------|
| `has no axe violations` | WCAG 2.1 AA 準拠（代表ケース） |

#### 🟢 Low Priority: Props

| テストケース | 検証内容 |
|--------------|----------|
| `navigates to href on activation` | href への遷移 |
| `opens in new tab when target="_blank"` | window.open での新規タブ |
| `applies className to element` | スタイル継承 |

---

## 5. 実装詳細

### コンポーネント設計方針

**カスタム ARIA ベース**（`<span role="link">`）で実装します。

理由:
- 教育目的: APG パターンの学習が主目的
- ネイティブ `<a>` は追加実装不要
- カスタム実装の注意点と制限を示すことに価値がある

### Props 設計（React）

```typescript
export interface LinkProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  'onClick'
> {
  /** リンク先 URL */
  href?: string;

  /** リンクのターゲット */
  target?: '_self' | '_blank';

  /** クリック/Enter 時のコールバック */
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;

  /** 無効状態 */
  disabled?: boolean;

  /** 子要素（リンクテキスト） */
  children: React.ReactNode;
}
```

**注意**: `href` または `onClick` のどちらかは必須。両方ない場合は非活性なリンクになってしまう。

### フレームワーク別の注意点

#### React
- `onKeyDown` で Enter キーをハンドル
- `event.isComposing` と `event.defaultPrevented` をチェック
- `href` + `target="_blank"` は `window.open(url, '_blank', 'noopener,noreferrer')` で遷移

#### Vue
- `defineOptions({ inheritAttrs: false })` の使用
- `@keydown.enter` でキーボードハンドル
- `$attrs` で属性継承

#### Svelte
- `on:keydown` でキーボードハンドル
- `{...$$restProps}` で属性継承
- `$props()` による props 受け取り

#### Astro (Web Components)
- `customElements.define('apg-link', ApgLink)` で登録
- `connectedCallback` でイベントリスナー設定
- `attributeChangedCallback` で disabled 監視

### 構造図

```
┌─────────────────────────────────────────┐
│ <span                                   │
│   role="link"                           │
│   tabindex="0" (or "-1" if disabled)    │
│   aria-disabled="false" (or "true")     │
│ >                                       │
│   Link Text                             │
│ </span>                                 │
└─────────────────────────────────────────┘
```

### ナビゲーション実装

```typescript
const navigate = (href: string, target?: string) => {
  if (target === '_blank') {
    // noopener, noreferrer をセキュリティのため付与
    window.open(href, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = href;
  }
};
```

### CSS 要件

```css
[role="link"] {
  cursor: pointer;
  text-decoration: underline;
  color: var(--link-color, blue);
}

[role="link"]:hover {
  text-decoration: none;
}

[role="link"]:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

[role="link"][aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
  text-decoration: none;
}
```

---

## 6. TDD ワークフロー

### Phase 0: 設計準備

1. **APG 仕様の確認** ✅
2. **PLAN.md 作成** ✅
3. **llm.md の作成**
   - Codex レビュー依頼

### Phase 1: テスト作成（RED フェーズ）

1. **React テストの作成**
   - 全テストが FAIL することを確認
   - Codex レビュー依頼

2. **他フレームワークのテスト作成**

### Phase 2: 実装（GREEN フェーズ）

1. **React 実装** → テスト通過 → Codex レビュー
2. **Vue 実装** → テスト通過 → Codex レビュー
3. **Svelte 実装** → テスト通過 → Codex レビュー
4. **Astro 実装** → テスト通過 → Codex レビュー

### Phase 3-5: ドキュメント・ページ作成

---

## 7. リスクと注意点

### 技術的リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| ブラウザ標準機能の欠如 | 中 | NativeHtmlNotice + Non-Goals セクションで明記 |
| Space キー誤実装 | 高 | テストで明示的に検証 |
| IME 入力中の誤作動 | 中 | `event.isComposing` チェック |

### 実装上の注意点

- **Enter vs Space**: リンクは **Enter キーのみ** でアクティベート
- **IME 対応**: `event.isComposing === true` の場合は無視
- **defaultPrevented**: `event.defaultPrevented === true` の場合は無視
- **target="_blank"**: `window.open(url, '_blank', 'noopener,noreferrer')` を使用
- **disabled**: `tabindex="-1"` でフォーカス不可に

### ネイティブ HTML との重要な差異（NativeHtmlNotice 用）

| 機能 | ネイティブ `<a>` | カスタム `role="link"` |
|------|------------------|------------------------|
| 新規タブで開く | Ctrl+Click で標準動作 | `target="_blank"` のみ |
| URL コピー | 標準サポート | 非対応 |
| ドラッグ&ドロップ | 標準サポート | 非対応 |
| 右クリックメニュー | 標準サポート | 限定的 |
| SEO | 認識される | 認識されない可能性 |
| JS 無効時 | 動作する | 動作しない |

---

## 成果物チェックリスト

### Phase 0: 設計準備
- [x] `src/patterns/link/PLAN.md`
- [x] `src/patterns/link/llm.md`

### Phase 1: テスト作成
- [x] `src/patterns/link/Link.test.tsx`
- [x] `src/patterns/link/Link.test.vue.ts`
- [x] `src/patterns/link/Link.test.svelte.ts`
- [x] `src/patterns/link/Link.test.astro.ts`

### Phase 2: コンポーネント実装
- [x] `src/patterns/link/Link.tsx`
- [x] `src/patterns/link/Link.vue`
- [x] `src/patterns/link/Link.svelte`
- [x] `src/patterns/link/Link.astro`

### Phase 3: ドキュメント
- [x] `src/patterns/link/AccessibilityDocs.astro`
- [x] `src/patterns/link/TestingDocs.astro`
- [x] `src/patterns/link/NativeHtmlNotice.astro`

### Phase 4: ページ作成
- [x] `src/pages/patterns/[pattern]/index.astro` (動的リダイレクト)
- [x] `src/pages/patterns/link/react/index.astro`
- [x] `src/pages/patterns/link/vue/index.astro`
- [x] `src/pages/patterns/link/svelte/index.astro`
- [x] `src/pages/patterns/link/astro/index.astro`
