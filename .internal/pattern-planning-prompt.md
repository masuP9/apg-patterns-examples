# APG パターン実装計画策定プロンプト

> このドキュメントは、Claude Code に新しい APG パターンの実装計画を策定させる際のプロンプトテンプレートです。

## 使い方

1. `{変数}` を実際の値に置き換える
2. プロンプト本文を Claude Code にコピー＆ペースト
3. 計画を確認し、必要に応じて調整を依頼
4. 承認後、TDD ワークフローに沿って実装を進める

---

## プロンプト本文

```
以下の APG パターンの実装計画を策定してください。

## 対象パターン

- **パターン名**: {Pattern Name}
- **APG 公式 URL**: https://www.w3.org/WAI/ARIA/apg/patterns/{pattern-slug}/
- **複雑度の見込み**: {低 / 中 / 高}
- **ネイティブ HTML 代替**: {あり: <要素名> / なし / 要検討}

## 計画策定の要件

### 1. APG 仕様の調査

以下を APG 公式ドキュメントから抽出してください:

- **Roles**: 使用する WAI-ARIA ロール一覧
- **Properties**: 必須/任意の aria-* 属性
- **States**: 状態変化する aria-* 属性とトリガー
- **Keyboard Support**: 必須のキーボード操作一覧
- **Focus Management**: フォーカス管理ルール（Roving tabindex 等）

### 2. 既存パターンとの比較

このリポジトリの既存実装と比較し:

- 参考にすべき類似パターン
- 再利用可能なパターン（あれば）
- 固有の実装課題

### 3. TDD ワークフローの計画

テストファースト開発の手順を計画してください。
Phase 1 で llm.md とテストを先に作成し、その後実装に進みます。

## 成果物一覧

計画には以下の全成果物を含め、各成果物の具体的な内容を記述してください:

### Phase 0: 設計準備
- [ ] APG 仕様の調査・整理
- [ ] `src/patterns/{pattern}/llm.md` - AI 向け定義ファイル

### Phase 1: テスト作成（実装前）
- [ ] `{Component}.test.tsx` - React テスト
- [ ] `{Component}.test.vue.ts` - Vue テスト
- [ ] `{Component}.test.svelte.ts` - Svelte テスト
- [ ] `{Component}.test.astro.ts` - Astro E2E テスト

### Phase 2: コンポーネント実装
- [ ] `{Component}.tsx` - React 実装
- [ ] `{Component}.vue` - Vue 実装
- [ ] `{Component}.svelte` - Svelte 実装
- [ ] `{Component}.astro` - Astro 実装（Web Components）

### Phase 3: ドキュメント
- [ ] `AccessibilityDocs.astro` - ARIA 仕様解説
- [ ] `TestingDocs.astro` - テスト解説
- [ ] `NativeHtmlNotice.astro` - ネイティブ HTML 注記（該当パターンのみ）

### Phase 4: ページ作成
- [ ] `src/pages/patterns/{pattern}/index.astro` - リダイレクト
- [ ] `src/pages/patterns/{pattern}/react/index.astro`
- [ ] `src/pages/patterns/{pattern}/vue/index.astro`
- [ ] `src/pages/patterns/{pattern}/svelte/index.astro`
- [ ] `src/pages/patterns/{pattern}/astro/index.astro`

## 出力形式

以下の構成で Markdown 形式の計画書を出力してください:

1. 概要
2. APG 仕様サマリー（表形式）
3. テスト設計（DAMP 原則に基づく構成）
4. 実装詳細（フレームワーク別の注意点）
5. TDD ワークフロー（具体的な作業ステップ）
6. Codex レビューポイント
7. リスクと注意点
```

---

## 計画書の出力例

以下は、計画書に含めるべき内容の詳細テンプレートです。

### 1. 概要

```markdown
## 1. 概要

{Pattern Name} は {パターンの説明（1-2文）}。

**主要機能**:
- {機能1}
- {機能2}
- {機能3}

**類似パターン**: {参考にする既存パターン}
```

### 2. APG 仕様サマリー

```markdown
## 2. APG 仕様サマリー

### Roles

| Role | 対象要素 | 説明 |
|------|----------|------|
| `{role}` | {要素} | {説明} |

### Properties（静的属性）

| 属性 | 対象要素 | 値 | 必須 | 備考 |
|------|----------|-----|------|------|
| `aria-labelledby` | {要素} | {ID参照} | Yes | {備考} |

### States（動的属性）

| 属性 | 対象要素 | 値 | 必須 | 変更トリガー |
|------|----------|-----|------|--------------|
| `aria-expanded` | {要素} | `true`/`false` | Yes | クリック時 |

### Keyboard Support

| キー | アクション |
|------|------------|
| `Space` | {アクション} |
| `Enter` | {アクション} |
| `↓` / `↑` | {アクション} |
| `Home` | {アクション} |
| `End` | {アクション} |

### Focus Management

- {フォーカス管理ルール1}
- {Roving tabindex のルール（該当する場合）}
```

### 3. テスト設計

```markdown
## 3. テスト設計

DAMP 原則に基づき、以下の構成でテストを作成します。

### テストファイル構成

```typescript
describe('{ComponentName}', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG ARIA Attributes', () => {
    // role の検証
    // aria-* 属性の検証
    // 状態変化の検証
  });

  describe('APG Keyboard Interaction', () => {
    // 必須キーボード操作の検証
    // ナビゲーションの検証
    // ループ動作の検証
  });

  describe('Focus Management', () => {
    // Roving tabindex の検証
    // フォーカス移動の検証
  });

  // 🟡 Medium Priority
  describe('Accessibility', () => {
    // axe-core 違反なしの検証
  });

  // 🟢 Low Priority
  describe('Props & Behavior', () => {
    // コールバック呼び出しの検証
    // className 継承の検証
  });
});
```

### テストケース一覧

#### 🔴 High Priority: ARIA 属性

| テストケース | 検証内容 |
|--------------|----------|
| `has role="{role}" on {element}` | role 属性の存在 |
| `has aria-{attr} on {element}` | 必須属性の存在 |
| `updates aria-{attr} on {action}` | 状態変化 |

#### 🔴 High Priority: キーボード操作

| テストケース | 検証内容 |
|--------------|----------|
| `{action} on Space` | Space キー動作 |
| `moves focus to next on ArrowDown` | 矢印キーナビゲーション |
| `wraps from last to first` | ループ動作 |

#### 🔴 High Priority: フォーカス管理

| テストケース | 検証内容 |
|--------------|----------|
| `sets tabindex="0" on {target}` | tabindex 管理 |
| `only one element has tabindex="0"` | 単一フォーカス可能要素 |

#### 🟡 Medium Priority: アクセシビリティ

| テストケース | 検証内容 |
|--------------|----------|
| `has no axe violations` | WCAG 2.1 AA 準拠 |
| `has no axe violations with {state}` | 各状態での準拠 |

#### 🟢 Low Priority: Props

| テストケース | 検証内容 |
|--------------|----------|
| `calls {callback} when {action}` | コールバック |
| `applies className to {element}` | スタイル継承 |
```

### 4. 実装詳細

```markdown
## 4. 実装詳細

### Props 設計（React）

```typescript
export interface {ComponentName}Props extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  '{excluded-props}'
> {
  // 必須 props
  {propName}: {type};

  // オプション props
  {optionalProp}?: {type};

  // コールバック
  {onCallback}?: (value: {type}) => void;
}
```

### フレームワーク別の注意点

#### React
- {注意点}

#### Vue
- `defineOptions({ inheritAttrs: false })` の使用
- {注意点}

#### Svelte
- `$props()` による props 受け取り
- `{...$$restProps}` による属性継承
- {注意点}

#### Astro (Web Components)
- `customElements.define()` でのカスタム要素登録
- {注意点}

### 構造図

```
┌─────────────────────────────────────────┐
│ {Container} role="{role}"               │
│ ┌─────────────────────────────────────┐ │
│ │ {Child} role="{role}"               │ │
│ │ aria-{attr}="{value}"               │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```
```

### 5. TDD ワークフロー

```markdown
## 5. TDD ワークフロー

### Phase 0: 設計準備

1. **APG 仕様の確認**
   - APG 公式ドキュメントを読み込み
   - Examples の動作確認
   - Edge case の洗い出し

2. **llm.md の作成**
   ```bash
   # ファイル作成
   touch src/patterns/{pattern}/llm.md
   ```
   - `.internal/llm-md-template.md` をベースに作成
   - Codex に llm.md のレビューを依頼

### Phase 1: テスト作成（RED フェーズ）

1. **React テストの作成**
   ```bash
   touch src/patterns/{pattern}/{Component}.test.tsx
   npm run test -- {Component}.test.tsx
   ```
   - 全テストが FAIL することを確認（実装前）
   - テスト観点の網羅性を確認

2. **他フレームワークのテスト作成**
   - Vue: `{Component}.test.vue.ts`
   - Svelte: `{Component}.test.svelte.ts`
   - Astro: `{Component}.test.astro.ts`

3. **Codex レビュー依頼（テスト）**
   ```
   テストコードをレビューしてください。
   - APG 仕様の網羅性
   - DAMP 原則への準拠
   - Edge case の考慮
   ```

### Phase 2: 実装（GREEN フェーズ）

1. **React 実装**
   ```bash
   touch src/patterns/{pattern}/{Component}.tsx
   npm run test -- {Component}.test.tsx --watch
   ```
   - テストが通るまで実装を進める

2. **Codex レビュー依頼（React 実装）**
   ```
   React 実装をレビューしてください。
   - APG 仕様への準拠
   - アクセシビリティの観点
   - コードの品質
   ```

3. **他フレームワーク実装**
   - Vue → テスト実行 → レビュー
   - Svelte → テスト実行 → レビュー
   - Astro → テスト実行 → レビュー

### Phase 3: リファクタリング（REFACTOR フェーズ）

1. **コード整理**
   - 重複コードの整理（ただし DAMP 原則を維持）
   - 命名の見直し
   - TypeScript 型の改善

2. **Codex 最終レビュー**
   ```
   全フレームワークの実装をレビューしてください。
   - 一貫性の確認
   - ベストプラクティスへの準拠
   - 潜在的なバグの指摘
   ```

### Phase 4: ドキュメント作成/更新

1. **AccessibilityDocs.astro**
   - llm.md の内容を元に詳細な解説を作成

2. **TestingDocs.astro**
   - テスト設計の解説を作成

3. **NativeHtmlNotice.astro**（該当パターンのみ）
   - ネイティブ HTML 要素の推奨と判断基準

### Phase 5: ページ作成・統合

1. **デモページ作成**
   - 各フレームワーク用のページを作成
   - index.astro でのリダイレクト設定

2. **patterns.ts** / **README.md** / **README.ja.md**
   - 実装したコンポーネントの status を available に
   - README.md / README.ja.md のコンポーネント実装状況を更新

3. **最終確認**
   ```bash
   npm run build
   npm run test
   npm run lint
   ```
```

### 6. Codex レビューポイント

```markdown
## 6. Codex レビューポイント

各フェーズで Codex に依頼するレビュー観点:

### llm.md レビュー

```
以下の llm.md をレビューしてください:
1. APG 仕様との整合性
2. 必須属性の漏れがないか
3. キーボード操作の網羅性
4. テストチェックリストの妥当性
```

### テストコードレビュー

```
以下のテストコードをレビューしてください:
1. APG 仕様の全要件がテストされているか
2. DAMP 原則に従っているか（過度な抽象化がないか）
3. Edge case（disabled, empty, 境界値）の考慮
4. アクセシビリティテスト（axe-core）の網羅性
```

### 実装コードレビュー

```
以下の実装コードをレビューしてください:
1. APG 仕様への準拠
2. キーボードナビゲーションの正確性
3. フォーカス管理の正確性
4. HTML 属性継承パターンの遵守
5. TypeScript 型定義の品質
6. セキュリティ上の問題（XSS 等）
```

### 最終レビュー

```
{Pattern Name} パターンの全実装をレビューしてください:
1. 4フレームワーク間の一貫性
2. テストカバレッジの妥当性
3. ドキュメントと実装の整合性
4. プロダクション品質への到達度
```
```

### 7. リスクと注意点

```markdown
## 7. リスクと注意点

### 技術的リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| {リスク1} | 高/中/低 | {対策} |
| {リスク2} | 高/中/低 | {対策} |

### 実装上の注意点

- **Astro Islands 制約**: 子コンポーネントの状態管理が必要な場合はラッパーコンポーネントを作成
- **フォーカス管理**: `useEffect` / `onMounted` / `onMount` のタイミングに注意
- **キーボードイベント**: `event.preventDefault()` の適切な使用
- **スクリーンリーダー**: 実機でのテストを推奨

### APG 仕様の曖昧な点

- {仕様が曖昧な箇所とその解釈}
```

---

## TDD サイクルの詳細

### RED → GREEN → REFACTOR

```
┌─────────────────────────────────────────────────────────────────┐
│                        TDD サイクル                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐     ┌─────────┐     ┌──────────────┐             │
│   │   RED   │────▶│  GREEN  │────▶│   REFACTOR   │             │
│   │         │     │         │     │              │             │
│   │ テスト  │     │ 実装    │     │ コード整理   │             │
│   │ 作成    │     │ 作成    │     │              │             │
│   └─────────┘     └─────────┘     └──────────────┘             │
│        │                                   │                    │
│        │                                   │                    │
│        └───────────────────────────────────┘                    │
│                    次のテストへ                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 各フェーズでの Codex 活用

| フェーズ | Codex 依頼内容 | 期待する成果 |
|----------|----------------|--------------|
| 計画策定後 | 実装計画書レビュー | 仕様の整合性・テスト設計・リスク確認 |
| Phase 0 | llm.md レビュー | 仕様の網羅性確認 |
| Phase 1 | テストコードレビュー | テスト設計の妥当性確認 |
| Phase 2 | 実装コードレビュー | APG 準拠・品質確認 |
| Phase 3 | リファクタリングレビュー | コード品質向上 |
| Phase 4 | ドキュメントレビュー | 正確性・可読性確認 |

---

## Codex レビュー依頼テンプレート

### 計画書レビュー依頼

```
## Codex レビュー依頼: {Pattern Name} 実装計画書

### 計画書の概要
- **パターン名**: {Pattern Name}
- **APG URL**: https://www.w3.org/WAI/ARIA/apg/patterns/{pattern-slug}/
- **ネイティブ HTML 代替**: {あり: <要素名> / なし}

### APG 仕様サマリー
{計画書の APG 仕様サマリーをここに記載}

### テストケース一覧
{計画書のテストケースをここに記載}

### Props 設計
{計画書の Props 設計をここに記載}

### レビュー観点
1. **APG 仕様との整合性**: 漏れている属性や仕様がないか
2. **テスト設計の網羅性**: 追加すべきテストケースがあるか
3. **Props 設計の妥当性**: 型定義・デフォルト値は適切か
4. **ネイティブ HTML との比較**: 正確に説明されているか（該当パターンのみ）
5. **リスクの見落とし**: 他に考慮すべきリスクや注意点があるか

### 期待する出力
- 問題点のリスト
- 改善提案
- 追加すべきテストケース
- 見落としているリスク
```

### テストレビュー依頼

```
## Codex レビュー依頼: {Pattern Name} テストコード

### 対象ファイル
- `src/patterns/{pattern}/{Component}.test.tsx`

### レビュー観点
1. **APG 仕様網羅性**: 以下の仕様が全てテストされているか
   - Roles: {roles}
   - Properties: {properties}
   - States: {states}
   - Keyboard: {keyboard operations}

2. **DAMP 原則**: 各テストが自己完結しているか

3. **Edge case**: 以下のケースが考慮されているか
   - disabled 状態
   - 空の状態
   - 境界値（最初/最後の要素）
   - ループ動作

4. **優先度の妥当性**: High/Medium/Low の分類は適切か

### 期待する出力
- 問題点のリスト
- 改善提案
- 追加すべきテストケース
```

### 実装レビュー依頼

```
## Codex レビュー依頼: {Pattern Name} 実装コード

### 対象ファイル
- `src/patterns/{pattern}/{Component}.tsx`
- `src/patterns/{pattern}/{Component}.vue`
- `src/patterns/{pattern}/{Component}.svelte`
- `src/patterns/{pattern}/{Component}.astro`

### レビュー観点
1. **APG 準拠**: 仕様に完全に準拠しているか
2. **アクセシビリティ**: スクリーンリーダーで適切に読み上げられるか
3. **キーボード操作**: 全ての必須キー操作が実装されているか
4. **フォーカス管理**: Roving tabindex が正しく実装されているか
5. **HTML 属性継承**: 標準 HTML 属性が継承されているか
6. **TypeScript**: 型定義が適切か
7. **セキュリティ**: XSS 等の脆弱性がないか

### 期待する出力
- バグ・問題点のリスト
- 改善提案
- ベストプラクティスへの準拠度評価
```

---

## 参照ドキュメント

| ドキュメント | 用途 |
|--------------|------|
| [llm-md-template.md](.internal/llm-md-template.md) | llm.md のテンプレート |
| [testing-strategy.md](.internal/testing-strategy.md) | テスト設計方針 |
| [site-specification.md](.internal/site-specification.md) | サイト仕様書 |
| [CLAUDE.md](../CLAUDE.md) | プロジェクト概要 |

## 既存パターン参照

| パターン | 複雑度 | 参考にする観点 |
|----------|--------|----------------|
| `button/` | 低 | 基本的な状態管理 |
| `checkbox/` | 中 | ネイティブ HTML 注記 |
| `radio-group/` | 中 | Roving tabindex |
| `accordion/` | 高 | 複数子要素の管理 |
| `tabs/` | 高 | 複合コンポーネント |
