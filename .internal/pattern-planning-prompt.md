# APG パターン実装計画策定プロンプト

> このドキュメントは、Claude Code に新しい APG パターンの実装計画を策定させる際のプロンプトテンプレートです。

---

## 🔴 再発防止のための主要な改善点

> **背景**: TreeView 実装時に計画と実装の乖離が発生。根本原因は「計画の曖昧さ × 照合プロセスの省略 × レビュー観点の不足」

### 改善サマリー

| 対策 | 改善内容 | 対象フェーズ |
|------|----------|--------------|
| **計画の明確化** | 「3. 類似パターンとの差分」セクションを必須化。機能の「なぜ違うのか」を明記 | Phase 0 |
| **テストカバレッジ確認** | llm.md チェックリストと差分項目の両方でテストとの1:1対応を確認 | Phase 1 |
| **実装後照合** | 「計画 vs 実装 vs テスト」の三点照合 + 差分項目の個別照合を必須化 | Phase 3 |
| **レビュー依頼の明確化** | 全てのレビュー依頼テンプレートに「差分確認」を追加 | 全フェーズ |
| **成果物照合チェック** | 日本語ページ含む全成果物の存在確認を最終ゲートとして必須化 | Phase 6 |

### ゲート条件（次フェーズに進む前の必須チェック）

| Phase | ゲート条件 |
|-------|------------|
| Phase 0 → Phase 1 | 差分表が作成され、各差分に「違いの理由」が記載されている |
| Phase 1 → Phase 2 | llm.md チェックリスト + 差分項目とテストが1:1で対応している |
| Phase 3 → Phase 4 | 三点照合 + 差分項目照合が完了し、全差異が解消されている |
| Phase 6 → 完了 | 🔴 **成果物照合チェック完了**（日本語ページ含む全ファイルの存在確認） |

---

## 使い方

1. `{変数}` を実際の値に置き換える
2. プロンプト本文を Claude Code にコピー＆ペースト
3. 計画を確認し、必要に応じて調整を依頼
4. **Codex に計画書のレビューを依頼**（「Codex レビュー依頼テンプレート > 計画書レビュー依頼」を使用）
5. レビュー結果を反映し、承認後 TDD ワークフローに沿って実装を進める

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

### 🔴 3. 類似パターンとの差分明記（必須）

> **重要**: 計画の曖昧さが実装漏れの根本原因となる。
> 類似パターンとの「違い」を具体的に明記すること。

類似パターンがある場合、以下の観点で**具体的な差分**を記述してください:

#### 差分明記の観点

| 観点 | 質問 | 記述例（TreeView の場合） |
|------|------|---------------------------|
| **キーボード操作** | 同じキーでも動作が異なる点は？ | `Space`: Listbox は選択のみ、TreeView は展開/折りたたみも行う |
| **状態管理** | 追加・変更される状態は？ | `aria-expanded` が追加（展開状態の管理） |
| **フォーカス管理** | フォーカスルールの違いは？ | 階層構造に沿ったナビゲーション（親→子→兄弟） |
| **選択モード** | 選択方式の違いは？ | マルチセレクト時のアンカー・フォーカス分離 |

#### 差分明記フォーマット

```markdown
### {新パターン} vs {類似パターン} の差分

| 機能 | {類似パターン} | {新パターン} | 違いの理由 |
|------|----------------|--------------|------------|
| `Space` キー | 項目を選択 | 項目を展開/折りたたみ | 階層構造の操作が必要 |
| `Ctrl+Space` | なし | 選択トグル（アンカー更新なし） | 範囲選択のアンカー維持 |
| `aria-expanded` | なし | 必須 | 展開状態の管理 |
```

**NG 例（曖昧）**:
- "Space で選択する（Listbox と同様）" → 本当に同じか？
- "Ctrl+Space でフォーカスを移動せずにトグル" → Space も移動しないので違いが不明

**OK 例（具体的）**:
- "Space は展開/折りたたみ、Ctrl+Space はアンカーを更新せずに選択トグル"
- "Listbox の Space は選択のみだが、TreeView の Space は展開状態も変更"

### 4. TDD ワークフローの計画

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
- [ ] `src/styles/patterns/{pattern}.css` - CSS スタイル
- [ ] `src/styles/global.css` に CSS をインポート追加

### Phase 3: ドキュメント（英語）
- [ ] `AccessibilityDocs.astro` - ARIA 仕様解説
- [ ] `TestingDocs.astro` - テスト解説
- [ ] `NativeHtmlNotice.astro` - ネイティブ HTML 注記（該当パターンのみ）

### Phase 4: 日本語ドキュメント
- [ ] `AccessibilityDocs.ja.astro` - ARIA 仕様解説（日本語）
- [ ] `TestingDocs.ja.astro` - テスト解説（日本語）
- [ ] `NativeHtmlNotice.ja.astro` - ネイティブ HTML 注記（日本語、該当パターンのみ）

### Phase 5: ページ作成
- [ ] `src/pages/patterns/{pattern}/index.astro` - リダイレクト
- [ ] `src/pages/patterns/{pattern}/react/index.astro`
- [ ] `src/pages/patterns/{pattern}/vue/index.astro`
- [ ] `src/pages/patterns/{pattern}/svelte/index.astro`
- [ ] `src/pages/patterns/{pattern}/astro/index.astro`
- [ ] `src/pages/ja/patterns/{pattern}/react/index.astro` - 日本語版
- [ ] `src/pages/ja/patterns/{pattern}/vue/index.astro` - 日本語版
- [ ] `src/pages/ja/patterns/{pattern}/svelte/index.astro` - 日本語版
- [ ] `src/pages/ja/patterns/{pattern}/astro/index.astro` - 日本語版

## 出力形式

以下の構成で Markdown 形式の計画書を出力してください:

1. 概要
2. APG 仕様サマリー（表形式）
3. 🔴 **類似パターンとの差分**（必須 - 新規追加）
4. テスト設計（DAMP 原則に基づく構成）
5. 実装詳細（フレームワーク別の注意点）
6. TDD ワークフロー（具体的な作業ステップ）
7. Codex レビューポイント
8. リスクと注意点
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

| キー | アクション | 備考（類似操作との違い） |
|------|------------|--------------------------|
| `Space` | {アクション} | {他のキーとの違いがあれば明記} |
| `Enter` | {アクション} | {他のキーとの違いがあれば明記} |
| `↓` / `↑` | {アクション} | |
| `Home` | {アクション} | |
| `End` | {アクション} | |

> **🔴 重要: 類似操作の違いを具体的に明記すること**
>
> 類似する操作がある場合は、**具体的に何が違うのか**を明記する。
> 曖昧な表現では実装時にスキップされる原因になる。
>
> | 記述の質 | 例 | 問題点 |
> |----------|-----|--------|
> | ❌ 曖昧 | `Ctrl+Space`: Toggle without moving focus | `Space` も移動しないので違いが不明 |
> | ✅ 具体的 | `Ctrl+Space`: Toggle **without updating anchor** | アンカー更新の有無が明確 |
>
> **判断基準**: 「この説明だけで、`Space` と `Ctrl+Space` を別々に実装できるか？」

### Focus Management

- {フォーカス管理ルール1}
- {Roving tabindex のルール（該当する場合）}
```

### 🔴 3. 類似パターンとの差分（必須）

```markdown
## 3. 類似パターンとの差分

> **目的**: 実装時の「既存と同じ」という誤解を防ぎ、正確な実装を担保する。

### 類似パターン: {類似パターン名}

**選定理由**: {なぜこのパターンが類似しているか}

### 差分一覧

| 機能 | {類似パターン} | {新パターン} | 違いの理由 |
|------|----------------|--------------|------------|
| `Space` キー | {動作} | {動作} | {理由} |
| `Enter` キー | {動作} | {動作} | {理由} |
| `Ctrl+Space` | {動作/なし} | {動作} | {理由} |
| `aria-expanded` | {なし/あり} | {必須/任意} | {理由} |
| フォーカス管理 | {方式} | {方式} | {理由} |

### 差分の詳細説明

#### {差分1}: {機能名}

**{類似パターン}での動作**:
- {具体的な動作説明}

**{新パターン}での動作**:
- {具体的な動作説明}

**違いが生じる理由**:
- {構造的・機能的な理由}

#### {差分2}: {機能名}

（同様のフォーマットで記述）

### 実装時の注意事項

> ⚠️ 以下の点は「{類似パターン}と同じ」ではないため、個別に実装が必要:

1. **{機能1}**: {具体的な違いと実装方針}
2. **{機能2}**: {具体的な違いと実装方針}

### 差分確認チェックリスト

実装前に以下を確認:

- [ ] 各差分の「違いの理由」が明確に説明されているか
- [ ] 曖昧な表現（「同様」「似ている」）がないか
- [ ] 実装者が「これは別物」と認識できるか
```

### 4. テスト設計

```markdown
## 4. テスト設計

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

### 5. 実装詳細

```markdown
## 5. 実装詳細

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

### 6. TDD ワークフロー

```markdown
## 6. TDD ワークフロー

### Phase 0: 設計準備

1. **APG 仕様の確認**
   - APG 公式ドキュメントを読み込み
   - Examples の動作確認
   - Edge case の洗い出し

2. **🔴 類似パターンとの差分明記**

   > **ゲート条件**: 差分が明確に記述されるまで Phase 1 に進まない

   - 計画書の「3. 類似パターンとの差分」セクションを作成
   - 各機能の「違いの理由」を具体的に記述
   - 曖昧な表現（「同様」「似ている」）がないか確認

   **確認項目**:
   - [ ] 類似パターンとの差分表が作成されているか
   - [ ] 各差分に「違いの理由」が記載されているか
   - [ ] 「{類似パターン}と同じ」という記述がないか（ある場合は詳細化）

3. **llm.md の作成**
   ```bash
   # ファイル作成
   touch src/patterns/{pattern}/llm.md
   ```
   - `.internal/llm-md-template.md` をベースに作成
   - **差分明記の内容を llm.md に反映**
   - Codex に llm.md のレビューを依頼（差分の明確さを重点確認）

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

3. **🔴 チェックリスト照合（必須 - ゲート条件）**

   > **ゲート条件**: 照合表が完成し、全項目が対応するまで Phase 2 に進まない

   llm.md の Test Checklist と作成したテストを照合し、**1:1 対応**を確認する。
   **この手順をスキップすると、実装漏れが発生する**。

   **照合手順**:
   ```bash
   # 1. llm.md のチェックリスト項目を抽出
   grep -E "^\s*-\s*\[" src/patterns/{pattern}/llm.md

   # 2. テストケース名を抽出
   grep -E "it\(|test\(" src/patterns/{pattern}/*.test.tsx
   ```

   **照合表の作成（必須出力）**:
   ```
   | llm.md チェックリスト項目 | 対応テストケース | 状態 |
   |---------------------------|------------------|------|
   | role="tree" on container  | it('has role="tree"...') | ✅ |
   | Ctrl+Space toggles...     | it('Ctrl+Space toggles...') | ✅ |
   | Shift+Home extends...     | ❌ 未作成 | 🔴 要追加 |
   ```

   **🔴 差分項目の確認（追加）**:
   - 計画書の「3. 類似パターンとの差分」に記載した各差分に対応するテストがあるか
   - 差分項目は「他と違う動作」なので、テストがないと実装も漏れる

   ```
   | 差分項目 | 対応テストケース | 状態 |
   |----------|------------------|------|
   | Space で展開（Listbox と異なる） | it('toggles expansion on Space') | ✅ |
   | Ctrl+Space（アンカー更新なし） | it('Ctrl+Space does not update anchor') | ✅ |
   ```

   **漏れが見つかった場合**:
   1. テストを追加する（llm.md に項目があるのにテストがない場合）
   2. llm.md を更新する（テストはあるが llm.md に記載がない場合）
   3. 曖昧な項目は具体化する（「何をテストすべきか」が不明確な場合）
   4. **差分項目のテスト漏れは最優先で追加**

4. **Codex レビュー依頼（テスト）**
   ```
   テストコードをレビューしてください。
   - APG 仕様の網羅性
   - DAMP 原則への準拠
   - Edge case の考慮
   - llm.md チェックリストとの1:1対応
   - 🔴 計画書の「類似パターンとの差分」項目に対応するテストの有無
   ```

### Phase 2: 実装（GREEN フェーズ）

1. **React 実装**
   ```bash
   touch src/patterns/{pattern}/{Component}.tsx
   npm run test -- {Component}.test.tsx --watch
   ```
   - テストが通るまで実装を進める

2. **🔴 差分項目の実装確認（実装中チェック）**

   > **注意**: 実装中に「これは {類似パターン} と同じでいいか？」と迷ったら、
   > 計画書の「3. 類似パターンとの差分」を参照する。

   実装前に差分項目を確認し、個別に実装が必要な箇所をマーク:

   ```
   | 差分項目 | 実装ファイル内の該当箇所 | 実装状態 |
   |----------|--------------------------|----------|
   | Space で展開 | handleKeyDown case 'Space' | ✅ 実装済 |
   | Ctrl+Space アンカー維持 | handleKeyDown case ' ' + ctrlKey | ✅ 実装済 |
   ```

3. **Codex レビュー依頼（React 実装）**
   ```
   React 実装をレビューしてください。
   - APG 仕様への準拠
   - アクセシビリティの観点
   - コードの品質
   - 🔴 計画書の「類似パターンとの差分」が正しく実装されているか
   ```

4. **他フレームワーク実装**
   - Vue → テスト実行 → レビュー
   - Svelte → テスト実行 → レビュー
   - Astro → テスト実行 → レビュー

5. **CSS 作成とインポート**
   ```bash
   # CSS ファイル作成
   touch src/styles/patterns/{pattern}.css
   ```
   - 既存パターン（meter.css 等）を参考にスタイルを作成
   - **重要**: `src/styles/global.css` にインポートを追加
   ```css
   @import './patterns/{pattern}.css';
   ```
   - インポート漏れがあるとスタイルが適用されないため必ず確認

### Phase 3: リファクタリング（REFACTOR フェーズ）

1. **コード整理**
   - 重複コードの整理（ただし DAMP 原則を維持）
   - 命名の見直し
   - TypeScript 型の改善

2. **🔴 計画-実装-テスト 三点照合（必須 - ゲート条件）**

   > **ゲート条件**: 照合が完了し、全差異が解消されるまで Phase 4 に進まない

   実装完了後、以下の3点が整合しているか確認する。
   **この手順をスキップすると、機能漏れやテスト漏れが本番に出る**。

   **照合の観点**:

   | 照合対象 | 確認内容 | 照合方法 |
   |----------|----------|----------|
   | llm.md Keyboard Support | 全キー操作が実装されているか | 実装の `handleKeyDown` を確認 |
   | llm.md Test Checklist | 全項目にテストが存在するか | テストファイルの `it()` を確認 |
   | 実装コード | llm.md に記載のない機能がないか | 逆方向の照合 |
   | 🔴 **計画書の差分項目** | 類似パターンとの差分が実装されているか | 差分表との照合 |

   **照合手順**:

   ```bash
   # Step 1: llm.md の Keyboard Support を抽出
   grep -A50 "## Keyboard Support" src/patterns/{pattern}/llm.md | head -30

   # Step 2: 実装のキーボードハンドラを確認
   grep -E "case '(Arrow|Enter|Space|Home|End|Escape|Tab)" src/patterns/{pattern}/*.tsx

   # Step 3: テストのキーボードテストを確認
   grep -E "Arrow|Enter|Space|Home|End|Escape" src/patterns/{pattern}/*.test.tsx
   ```

   **照合結果の記録**（必須）:

   ```markdown
   ## 計画 vs 実装 vs テスト 照合結果

   | 機能 | llm.md | 実装 | テスト | 状態 | 対応 |
   |------|--------|------|--------|------|------|
   | ArrowDown moves focus | ✅ | ✅ | ✅ | OK | - |
   | Ctrl+Space toggles | ✅ | ❌ | ❌ | 🔴 | 実装・テスト追加 |
   | Shift+Home extends | ✅ | ✅ | ❌ | 🟡 | テスト追加 |
   | Type-ahead search | ❌ | ✅ | ✅ | 🟡 | llm.md に追記 |
   ```

   **🔴 差分項目の照合（追加）**:

   計画書の「3. 類似パターンとの差分」に記載した項目を個別に照合:

   ```markdown
   ## 差分項目の照合結果

   | 差分項目 | 計画書記載 | 実装 | テスト | 状態 | 対応 |
   |----------|------------|------|--------|------|------|
   | Space で展開（Listbox と異なる） | ✅ | ✅ | ✅ | OK | - |
   | Ctrl+Space アンカー維持 | ✅ | ❌ | ❌ | 🔴 | 実装・テスト追加 |
   | aria-expanded 追加 | ✅ | ✅ | ✅ | OK | - |
   ```

   **差異が見つかった場合の優先度**:

   | 状態 | 優先度 | 対応 |
   |------|--------|------|
   | 計画あり・実装なし | 🔴 最高 | 実装を追加（APG 準拠のため） |
   | 計画あり・テストなし | 🟡 高 | テストを追加 |
   | 実装あり・計画なし | 🟡 高 | llm.md を更新（ドキュメント整合性） |
   | **差分項目の実装漏れ** | 🔴 **最高** | **即座に実装（類似パターンとの違いのため）** |

3. **Codex 最終レビュー**
   ```
   全フレームワークの実装をレビューしてください。
   - 一貫性の確認
   - ベストプラクティスへの準拠
   - 潜在的なバグの指摘
   - 🔴 llm.md との整合性（計画と実装の差異がないか）
   - 🔴 計画書の「類似パターンとの差分」が全て実装・テストされているか
   ```

### Phase 4: ドキュメント作成/更新

1. **AccessibilityDocs.astro**（英語）
   - llm.md の内容を元に詳細な解説を作成

2. **TestingDocs.astro**（英語）
   - テスト設計の解説を作成

3. **NativeHtmlNotice.astro**（英語、該当パターンのみ）
   - ネイティブ HTML 要素の推奨と判断基準

### Phase 5: 日本語ドキュメント作成

1. **AccessibilityDocs.ja.astro**
   - 英語版を元に日本語版を作成
   - 既存の日本語ドキュメント（例: `listbox/AccessibilityDocs.ja.astro`）を参考に

2. **TestingDocs.ja.astro**
   - 英語版を元に日本語版を作成

3. **NativeHtmlNotice.ja.astro**（該当パターンのみ）
   - 英語版を元に日本語版を作成

### Phase 6: ページ作成・統合

1. **英語デモページ作成**
   - 各フレームワーク用のページを作成
   - index.astro でのリダイレクト設定

2. **日本語デモページ作成**
   - `src/pages/ja/patterns/{pattern}/{framework}/index.astro`
   - 日本語版ドキュメント（`.ja.astro`）をインポート
   - `locale = 'ja'` と `useTranslation(locale)` を使用
   - 既存の日本語ページ（例: `listbox/react/index.astro`）を参考に

3. **🔴 成果物照合チェック（必須 - 最終ゲート条件）**

   > **ゲート条件**: 全成果物が作成されていることを確認するまで「完了」としない

   以下のコマンドで成果物の存在を確認:

   ```bash
   # 英語ページの確認
   ls -la src/pages/patterns/{pattern}/
   ls -la src/pages/patterns/{pattern}/react/
   ls -la src/pages/patterns/{pattern}/vue/
   ls -la src/pages/patterns/{pattern}/svelte/
   ls -la src/pages/patterns/{pattern}/astro/

   # 日本語ページの確認（漏れやすい）
   ls -la src/pages/ja/patterns/{pattern}/
   ls -la src/pages/ja/patterns/{pattern}/react/
   ls -la src/pages/ja/patterns/{pattern}/vue/
   ls -la src/pages/ja/patterns/{pattern}/svelte/
   ls -la src/pages/ja/patterns/{pattern}/astro/

   # 日本語ドキュメントの確認
   ls -la src/patterns/{pattern}/*ja*.astro
   ```

   **成果物チェックリスト**:

   ```markdown
   ## 成果物照合結果

   ### コンポーネント
   - [ ] {Component}.tsx
   - [ ] {Component}.vue
   - [ ] {Component}.svelte
   - [ ] {Component}.astro

   ### ドキュメント（英語）
   - [ ] AccessibilityDocs.astro
   - [ ] TestingDocs.astro

   ### ドキュメント（日本語）
   - [ ] AccessibilityDocs.ja.astro
   - [ ] TestingDocs.ja.astro

   ### ページ（英語）
   - [ ] src/pages/patterns/{pattern}/index.astro
   - [ ] src/pages/patterns/{pattern}/react/index.astro
   - [ ] src/pages/patterns/{pattern}/vue/index.astro
   - [ ] src/pages/patterns/{pattern}/svelte/index.astro
   - [ ] src/pages/patterns/{pattern}/astro/index.astro

   ### ページ（日本語）⚠️ 漏れやすい
   - [ ] src/pages/ja/patterns/{pattern}/react/index.astro
   - [ ] src/pages/ja/patterns/{pattern}/vue/index.astro
   - [ ] src/pages/ja/patterns/{pattern}/svelte/index.astro
   - [ ] src/pages/ja/patterns/{pattern}/astro/index.astro
   ```

4. **patterns.ts** / **README.md** / **README.ja.md** / **llm.md**
   - 実装したコンポーネントの status を available に
   - README.md / README.ja.md のコンポーネント実装状況を更新
   - 計画と実装で乖離した点を整理して、llm.mdに反映

4. **最終確認**
   ```bash
   npm run build
   npm run test
   npm run lint
   ```
```

### 7. Codex レビューポイント

```markdown
## 7. Codex レビューポイント

各フェーズで Codex に依頼するレビュー観点:

### llm.md レビュー

```
以下の llm.md をレビューしてください:
1. APG 仕様との整合性
2. 必須属性の漏れがないか
3. キーボード操作の網羅性
4. テストチェックリストの妥当性
5. 🔴 記述の明確さ（類似操作の違いが具体的に説明されているか）
   - 曖昧な例: "Toggle without moving focus" （Space も移動しないので不明確）
   - 明確な例: "Toggle without updating anchor" （具体的な違いが明確）
```

### テストコードレビュー

```
以下のテストコードをレビューしてください:
1. APG 仕様の全要件がテストされているか
2. DAMP 原則に従っているか（過度な抽象化がないか）
3. Edge case（disabled, empty, 境界値）の考慮
4. アクセシビリティテスト（axe-core）の網羅性
5. 🔴 llm.md チェックリストとの 1:1 対応
   - llm.md の各チェック項目に対応するテストが存在するか
   - 漏れている項目があれば指摘する
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
7. 🔴 llm.md Keyboard Support との整合性
   - llm.md に記載の全キー操作が実装されているか
   - 実装にあって llm.md にない機能がないか
```

### 最終レビュー

```
{Pattern Name} パターンの全実装をレビューしてください:
1. 4フレームワーク間の一貫性
2. テストカバレッジの妥当性
3. ドキュメントと実装の整合性
4. プロダクション品質への到達度
5. 🔴 計画（llm.md）との整合性（以下の三点照合）
   - llm.md に記載の機能が全て実装されているか
   - llm.md に記載の機能が全てテストされているか
   - 実装・テストにあって llm.md にない機能がないか
```
```

### 8. リスクと注意点

```markdown
## 8. リスクと注意点

### 技術的リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| {リスク1} | 高/中/低 | {対策} |
| {リスク2} | 高/中/低 | {対策} |

### 実装上の注意点

- **CSS インポート漏れ**: `src/styles/patterns/{pattern}.css` を作成したら、必ず `src/styles/global.css` にインポートを追加すること。漏れるとスタイルが適用されない
- **Astro Islands 制約**: 子コンポーネントの状態管理が必要な場合はラッパーコンポーネントを作成
- **フォーカス管理**: `useEffect` / `onMounted` / `onMount` のタイミングに注意
- **キーボードイベント**: `event.preventDefault()` の適切な使用
- **スクリーンリーダー**: 実機でのテストを推奨

### 🔴 計画-実装の乖離を防ぐための注意点

> **教訓**: TreeView 実装時に計画と実装の乖離が発生した経験から追加。
> **根本原因**: 計画の曖昧さ × 照合プロセスの省略 × レビュー観点の不足

#### 問題パターンと対策

| 問題パターン | 原因 | 発生フェーズ | 対策 |
|--------------|------|--------------|------|
| 機能の実装漏れ | 計画の記述が曖昧で「既存と同じ」と誤解 | Phase 0 | 類似機能との**違い**を明記 |
| テストの漏れ | チェックリストとテストの照合を省略 | Phase 1 | 1:1 対応表を作成 |
| 差異の見落とし | 実装後に計画を参照しない | Phase 3 | 三点照合を実施 |
| レビュー観点の不足 | 「品質」のみで「整合性」を依頼しない | 全フェーズ | Codex に明示的に「計画との照合」を依頼 |
| 🔴 **日本語ページ漏れ** | 英語版完成で「完了」と誤認、成果物照合省略 | Phase 6 | 成果物照合チェックを最終ゲートとして必須化 |

#### 具体例（TreeView での失敗と改善）

**失敗例 1: 曖昧な計画による実装漏れ**
```
❌ 曖昧な計画:
   "Ctrl+Space: Toggle selection without moving focus"
   → Space も「フォーカスを移動しない」ので違いが不明確
   → 「Space と同じ」と誤解され、実装がスキップされた

✅ 明確な計画:
   "Ctrl+Space: Toggle selection without updating anchor (for range selection)"
   → 「アンカーを更新しない」という具体的な違いが明確
   → Space との違いが理解でき、正しく実装される
```

**失敗例 2: 照合プロセスの省略**
```
❌ 省略した場合:
   - llm.md に「Shift+ArrowDown: Extend selection」が記載されている
   - テストファイルを確認せずに実装を開始
   - 結果: テストが存在せず、実装も漏れた

✅ 照合を実施した場合:
   - llm.md のチェックリストとテストを 1:1 で照合
   - 「Shift+ArrowDown のテストがない」と発見
   - Phase 1 の時点でテストを追加 → 実装時に自然とカバー
```

**失敗例 3: レビュー依頼の曖昧さ**
```
❌ 曖昧な依頼:
   "コードの品質をレビューしてください"
   → 「計画との整合性」が観点に含まれない
   → 機能漏れを見落とす

✅ 明確な依頼:
   "コードの品質と、llm.md との整合性をレビューしてください"
   → 計画との照合が明示的にレビュー観点に含まれる
   → 機能漏れを検出できる
```

**失敗例 4: 成果物照合の省略による日本語ページ漏れ**
```
❌ 照合を省略した場合:
   - 英語ページ（4フレームワーク）の実装完了
   - 「動作確認OK、実装完了」と判断
   - 計画書の成果物リストを確認せず
   - 結果: 日本語ページ（8ファイル）が全て漏れた

✅ 成果物照合を実施した場合:
   - 実装完了後に計画書の「成果物一覧」をチェック
   - ls コマンドで実際のファイル存在を確認
   - 「日本語ページが存在しない」と発見
   - Phase 6 の時点で漏れを検出 → 即座に作成
```

#### 再発防止チェックリスト

各フェーズで以下を確認:

- [ ] **Phase 0**: 類似操作の「違い」が具体的に説明されているか？
- [ ] **Phase 1**: llm.md チェックリストとテストが 1:1 で対応しているか？
- [ ] **Phase 3**: 計画・実装・テストの三点照合を実施したか？
- [ ] **Phase 6**: 成果物照合チェックを実施したか？（日本語ページ含む）
- [ ] **レビュー**: Codex に「計画との整合性」を明示的に依頼したか？

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

| フェーズ | Codex 依頼内容 | 期待する成果 | 🔴 整合性確認 |
|----------|----------------|--------------|--------------|
| 計画策定後 | 実装計画書レビュー | 仕様の整合性・テスト設計・リスク確認 | - |
| Phase 0 | llm.md レビュー | 仕様の網羅性確認 | **記述の明確さ** |
| Phase 1 | テストコードレビュー | テスト設計の妥当性確認 | **チェックリスト1:1対応** |
| Phase 2 | 実装コードレビュー | APG 準拠・品質確認 | **llm.md Keyboard との照合** |
| Phase 3 | リファクタリングレビュー | コード品質向上 | **計画-実装-テスト三点照合** |
| Phase 4 | ドキュメントレビュー（英語） | 正確性・可読性確認 | - |
| Phase 5 | 日本語ドキュメントレビュー | 翻訳の正確性・用語の一貫性確認 | - |
| Phase 6 | 最終レビュー | 全体の整合性・品質確認 | **最終三点照合** |

> **🔴 重要**: Phase 0, 1, 2, 3, 6 では、**計画（llm.md）との整合性**を明示的にレビュー依頼すること。
> 「品質をレビューしてください」だけでは整合性は確認されない。

---

## Codex レビュー依頼テンプレート

### 計画書レビュー依頼

```
## Codex レビュー依頼: {Pattern Name} 実装計画書

### 計画書の概要
- **パターン名**: {Pattern Name}
- **APG URL**: https://www.w3.org/WAI/ARIA/apg/patterns/{pattern-slug}/
- **ネイティブ HTML 代替**: {あり: <要素名> / なし}
- **類似パターン**: {類似パターン名}

### APG 仕様サマリー
{計画書の APG 仕様サマリーをここに記載}

### 🔴 類似パターンとの差分
{計画書の「類似パターンとの差分」セクションをここに記載}

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
6. 🔴 **類似パターンとの差分の明確さ**:
   - 各差分に「違いの理由」が具体的に説明されているか
   - 曖昧な表現（「同様」「似ている」）がないか
   - 実装者が「これは別物」と認識できるか

### 期待する出力
- 問題点のリスト
- 改善提案
- 追加すべきテストケース
- 見落としているリスク
- 🔴 差分セクションで曖昧な記述があれば具体化の提案
```

### テストレビュー依頼

```
## Codex レビュー依頼: {Pattern Name} テストコード

### 対象ファイル
- `src/patterns/{pattern}/{Component}.test.tsx`

### 類似パターン
- **類似パターン**: {類似パターン名}
- **計画書の差分項目**: {差分項目のリスト}

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

5. 🔴 **差分項目のテストカバレッジ**:
   - 計画書の「類似パターンとの差分」に記載された各項目に対応するテストがあるか
   - 差分項目は「他と違う動作」なので、テスト漏れは実装漏れに直結する

### 期待する出力
- 問題点のリスト
- 改善提案
- 追加すべきテストケース
- 🔴 差分項目でテストが不足している箇所のリスト
```

### 実装レビュー依頼

```
## Codex レビュー依頼: {Pattern Name} 実装コード

### 対象ファイル
- `src/patterns/{pattern}/{Component}.tsx`
- `src/patterns/{pattern}/{Component}.vue`
- `src/patterns/{pattern}/{Component}.svelte`
- `src/patterns/{pattern}/{Component}.astro`

### 類似パターン
- **類似パターン**: {類似パターン名}
- **計画書の差分項目**: {差分項目のリスト}

### レビュー観点
1. **APG 準拠**: 仕様に完全に準拠しているか
2. **アクセシビリティ**: スクリーンリーダーで適切に読み上げられるか
3. **キーボード操作**: 全ての必須キー操作が実装されているか
4. **フォーカス管理**: Roving tabindex が正しく実装されているか
5. **HTML 属性継承**: 標準 HTML 属性が継承されているか
6. **TypeScript**: 型定義が適切か
7. **セキュリティ**: XSS 等の脆弱性がないか
8. 🔴 **差分項目の実装確認**:
   - 計画書の「類似パターンとの差分」に記載された各項目が実装されているか
   - 「{類似パターン}と同じ」として実装がスキップされていないか
   - 差分の「違いの理由」通りに実装されているか

### 期待する出力
- バグ・問題点のリスト
- 改善提案
- ベストプラクティスへの準拠度評価
- 🔴 差分項目で実装が不足または誤っている箇所のリスト
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
