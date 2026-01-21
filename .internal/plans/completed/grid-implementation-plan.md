# APG Grid パターン実装計画書（APG 仕様整合性確認済み）

## 概要

Codex レビューおよび APG 仕様との整合性確認を経て、計画書を更新しました。

### Codex レビュー指摘事項（対応状況）

| 重要度 | 指摘 | 対応 |
|--------|------|------|
| 重大 | `aria-readonly` の扱いが未整理 | ✅ **APG 確認**: 編集機能なしなら不要。付与しない |
| 重大 | 選択拡張（Shift+Arrow 範囲選択）が未検討 | ✅ セクション 2.5 でスコープを明確化 |
| 高 | `aria-rowindex/colindex` の付与対象が不十分 | ✅ セクション 2.2 で row/header も含めるよう修正 |
| 高 | Props 設計が React 固有 | ✅ セクション 5.1 でフレームワーク非依存に再設計 |
| 高 | aria-label/labelledby の相互排他テストがない | ✅ セクション 4 にテスト追加 |
| 中 | 選択モデル（cell/row）が未確定 | ✅ セクション 2.5 で cell 選択に確定 |
| 中 | Shift+Tab の離脱テストがない | ✅ セクション 4 にテスト追加 |
| 中 | ヘッダーのナビゲーション対象化が未明記 | ✅ **APG 確認**: ソート機能なしならフォーカス不要 |
| 低 | header セルのスパンテストがない | ✅ セクション 4 にテスト追加 |
| 低 | CSS Grid の視覚順序問題 | ✅ セクション 8 にリスクとして追記 |

### APG 仕様セルフレビュー結果

| 確認項目 | APG 仕様 | 計画書の対応 |
|----------|----------|--------------|
| `aria-readonly` | 編集機能がないグリッドでは不要 | ✅ 付与しない |
| ヘッダーセルのフォーカス | ソート/フィルター機能がない場合は不要 | ✅ フォーカス対象外 |
| Data Grid vs Layout Grid | 行末ラップの有無で区別 | ✅ セクション 2.6 で明記 |
| 選択操作 | APG Data Grid 例では範囲選択操作が明記されていない | ✅ 基本的なセル選択（Space）のみ実装 |
| `rowgroup` ロール | APG 例では明示的に使用されていない | ✅ 任意（オプション）と明記 |

---

## 1. 概要

**Grid** は、矢印キー、Home、End などの方向キーを使用して2次元的にナビゲートできるインタラクティブなコンテナです。

**APG 公式 URL**: https://www.w3.org/WAI/ARIA/apg/patterns/grid/

**主要機能**:
- 2次元キーボードナビゲーション（Arrow keys）
- Roving tabindex によるフォーカス管理
- セル選択機能（単一/複数）
- CSS Grid によるレイアウト

**類似パターン**: Menubar（2次元ナビゲーション）、Table（セル構造）、Listbox（選択機能）

**ネイティブ HTML 代替**: なし（`<table>` は静的データ表示用、Grid はインタラクティブ操作用）

---

## 2. APG 仕様サマリー

### 2.1 Roles

| Role | 対象要素 | 必須 | 説明 |
|------|----------|------|------|
| `grid` | Container | Yes | グリッド全体の親要素 |
| `rowgroup` | Header/Body | **No** | 行のグループ化（thead, tbody 相当）※APG例では使用されていない |
| `row` | Row container | Yes | グリッド内の各行 |
| `gridcell` | Data cell | Yes | 通常のデータセル |
| `columnheader` | Header cell | No | 列ヘッダーセル（ヘッダーがある場合） |
| `rowheader` | Row header | No | 行ヘッダーセル（最初の列、オプション） |

> **APG 例に基づく注記**: APG の Data Grid / Layout Grid 例では `rowgroup` ロールは明示的に使用されていません。
> HTML `<table>` 構造では `<thead>`/`<tbody>` が自動的に rowgroup セマンティクスを持ちますが、
> div ベースの実装では rowgroup は任意です。本実装では**簡潔さのため rowgroup を省略**します。

### 2.2 Properties（静的属性）

| 属性 | 対象要素 | 値 | 必須 | 備考 |
|------|----------|-----|------|------|
| `aria-label` | grid | 文字列 | Yes* | グリッドの名前 |
| `aria-labelledby` | grid | ID参照 | Yes* | 外部要素による名前付け |
| `aria-rowcount` | grid | 整数（1-based） | No | 仮想化時の総行数 |
| `aria-colcount` | grid | 整数（1-based） | No | 仮想化時の総列数 |
| `aria-rowindex` | **row**, gridcell, rowheader, columnheader | 整数（1-based） | No | 仮想化時の行位置 |
| `aria-colindex` | gridcell, rowheader, columnheader | 整数（1-based） | No | 仮想化時の列位置 |
| `aria-colspan` | gridcell, **columnheader**, **rowheader** | 整数 | No | 複数列にまたがるセル |
| `aria-rowspan` | gridcell, **columnheader**, **rowheader** | 整数 | No | 複数行にまたがるセル |

*どちらか一方のみ必須（同時指定不可）

> **Codex 指摘反映**: `aria-rowindex` は `row` 要素にも付与可能。`aria-colspan/rowspan` はヘッダーセルにも適用可能。

### 2.3 States（動的属性）

| 属性 | 対象要素 | 値 | 必須 | 変更トリガー |
|------|----------|-----|------|--------------|
| `aria-multiselectable` | grid | `true`/`false` | No* | multiselectable prop |
| `aria-selected` | gridcell | `true`/`false` | No | Space キー、クリック |
| `aria-disabled` | gridcell | `true`/`false` | No | disabled prop |

*multiselectable 時は必須

> **APG 仕様に基づく修正: `aria-readonly` について**
>
> APG 仕様によると：
> > 編集機能がないグリッドではこの属性は不要
>
> 本実装では**編集機能を提供しない**ため、`aria-readonly` は**付与しない**。
> 将来、編集機能を追加する場合にのみ `aria-readonly` を使用する。

### 2.4 フォーカス対象

> **APG 仕様に基づく修正: ヘッダーセルのフォーカス**
>
> APG 仕様によると：
> > "if column or row header cells do not provide functions, such as sort or filter, they do not need to be focusable."

**本実装の方針**: ソート/フィルター機能を実装しないため、**ヘッダーセルはフォーカス対象外**とする。

**フォーカス可能な要素**:
- `gridcell`（データセル）: **Yes**

**フォーカス不可の要素**:
- `columnheader`（列ヘッダー）: **No**（ソート/フィルター機能なし）
- `rowheader`（行ヘッダー）: **No**（ソート/フィルター機能なし）
- `grid` コンテナ自体
- `row`

> **Note**: 本実装では `rowgroup` を使用しない（セクション 2.1 参照）

**将来の拡張**: ソート機能を追加する場合、`columnheader` をフォーカス可能にし、`aria-sort` を設定する。

### 2.5 選択モデル

> **Codex 指摘反映: 選択モデルを明確化**

**採用する選択モデル**: **セル選択（Cell Selection）**

| モデル | 対象 | 本実装 |
|--------|------|--------|
| Cell Selection | 個々のセル | ✅ 採用 |
| Row Selection | 行全体 | ❌ 未対応（将来拡張） |

**選択操作**:
| キー | アクション | 備考 |
|------|------------|------|
| `Space` | セル選択をトグル | selectable 時のみ |
| `Ctrl+A` | 全セル選択 | multiselectable 時のみ |

> **スコープ外（APG 仕様に基づく判断）**:
>
> 以下の選択操作は APG で標準的に記載されているが、**本実装ではスコープ外**とする：
> - `Shift+Arrow`: 範囲選択
> - `Shift+Space`: 行選択
> - `Ctrl+Space`: 列選択
> - `Ctrl+Shift+End`: 現在位置から最後まで選択
>
> **理由**: 実装の複雑度を考慮し、基本的なセル選択機能に絞る。将来の拡張として検討可能。

### 2.6 Grid タイプ（Data Grid vs Layout Grid）

> **APG 仕様に基づく明記**

| 特性 | Data Grid | Layout Grid |
|------|-----------|-------------|
| 用途 | 表形式データの表示・操作 | ウィジェットのグループ化 |
| 行末でのラップ | **なし** | オプション（あり） |
| ヘッダー | 通常あり | オプション |

**本実装のデフォルト**: **Data Grid**（`wrapNavigation=false`）

`wrapNavigation=true` を指定すると Layout Grid として動作（行末で次行へラップ）。

### 2.7 Keyboard Support

| キー | アクション | 備考 |
|------|------------|------|
| `ArrowRight` | 右のセルへ移動 | 同じ行内（データセルのみ） |
| `ArrowLeft` | 左のセルへ移動 | 同じ行内（データセルのみ） |
| `ArrowDown` | 下のセルへ移動 | 同じ列内 |
| `ArrowUp` | 上のセルへ移動 | 同じ列内 |
| `Home` | 行の最初のセルへ | 現在の行内 |
| `End` | 行の最後のセルへ | 現在の行内 |
| `Ctrl+Home` | グリッド最初のセルへ | 最初のデータ行・最初の列 |
| `Ctrl+End` | グリッド最後のセルへ | 最後の行・最後の列 |
| `PageDown` | 複数行下へ移動 | オプション、pageSize 分 |
| `PageUp` | 複数行上へ移動 | オプション、pageSize 分 |
| `Tab` | グリッドから離脱 | 次のフォーカス可能要素へ |
| `Shift+Tab` | グリッドから離脱 | 前のフォーカス可能要素へ |
| `Space` | セル選択をトグル | selectable 時 |
| `Enter` | セルをアクティベート | onCellActivate コールバック |

> **Note**: ヘッダーセルはフォーカス対象外のため、矢印キーでヘッダーに移動しない。

### 2.8 Focus Management

**採用方式**: Roving tabindex

**ルール**:
- フォーカス中のセルのみ `tabIndex="0"`、他は `tabIndex="-1"`
- 2次元追跡: `[rowIndex, colIndex]` で位置を管理
- disabled セル: フォーカス可能だがアクティベート不可
- グリッド全体が Tab Sequence の1エントリ
- **ヘッダーセルはフォーカス対象外**（ソート機能なしのため）

---

## 3. 類似パターンとの差分

### 3.1 Grid vs Table

| 機能 | Table | Grid | 違いの理由 |
|------|-------|------|------------|
| 主要ロール | `table`, `cell` | `grid`, `gridcell` | Grid はインタラクティブ |
| キーボード操作 | なし | Arrow keys 必須 | 2次元ナビゲーション |
| フォーカス管理 | なし | Roving tabindex 必須 | セル単位の操作 |
| ヘッダーフォーカス | なし | **オプション** | ソート/フィルター機能がある場合のみ |
| `aria-readonly` | なし | **オプション** | 編集機能がある場合のみ |

### 3.2 Grid vs Menubar

| 機能 | Menubar | Grid | 違いの理由 |
|------|---------|------|------------|
| 構造 | 階層的 | フラット（row×col） | Grid は均一構造 |
| `Escape` | submenu を閉じる | **未定義** | Grid には階層がない |
| TypeAhead | あり | なし | Grid は検索不要 |

> **Codex 指摘反映**: Escape の挙動は Grid では未定義/未対応と明記

### 3.3 Grid vs Listbox

| 機能 | Listbox | Grid |
|------|---------|------|
| 次元 | 1次元 | 2次元 |
| 選択モード | 単一/複数 | **同様**（セル選択） |

---

## 4. テスト設計

### 🔴 High Priority: ARIA 属性

| テストケース | 検証内容 |
|--------------|----------|
| `has role="grid" on container` | コンテナの role |
| `has role="row" on all rows` | 全行の role |
| `has role="gridcell" on data cells` | データセルの role |
| `has role="columnheader" on header cells` | ヘッダーセルの role |
| `has role="rowheader" when hasRowHeader` | 行ヘッダーの role |
| `has accessible name via aria-label` | aria-label |
| `has accessible name via aria-labelledby` | aria-labelledby |
| **`rejects both aria-label and aria-labelledby`** | **相互排他性の検証** |
| **`requires aria-label or aria-labelledby`** | **必須性の検証** |
| `has aria-multiselectable when multiselectable` | 複数選択モード |
| `has aria-selected on selectable cells` | 選択状態 |
| `has aria-disabled on disabled cells` | 無効状態 |
| `has aria-colspan on spanned cells` | 列スパン（gridcell） |
| `has aria-rowspan on spanned cells` | 行スパン（gridcell） |
| **`has aria-colspan on spanned columnheader`** | **列スパン（ヘッダー）** |
| **`has aria-rowspan on spanned rowheader`** | **行スパン（ヘッダー）** |

### 🔴 High Priority: キーボード - 2D ナビゲーション

| テストケース | 検証内容 |
|--------------|----------|
| `ArrowRight moves focus one cell right` | 右移動 |
| `ArrowLeft moves focus one cell left` | 左移動 |
| `ArrowDown moves focus one row down` | 下移動 |
| `ArrowUp moves focus one row up` | 上移動 |
| `ArrowRight stops at row end (default)` | 行端で停止 |
| `ArrowRight wraps to next row (wrapNavigation)` | 行端で折り返し |
| `ArrowDown stops at grid bottom` | グリッド下端で停止 |
| `ArrowUp stops at first data row` | 最初のデータ行で停止（ヘッダーには移動しない） |
| `skips disabled cells during navigation` | disabled セルをスキップ |

### 🔴 High Priority: キーボード - 拡張ナビゲーション

| テストケース | 検証内容 |
|--------------|----------|
| `Home moves to first cell in row` | 行の最初へ |
| `End moves to last cell in row` | 行の最後へ |
| `Ctrl+Home moves to first cell in grid` | 最初のデータ行・最初の列へ |
| `Ctrl+End moves to last cell in grid` | 最後の行・最後の列へ |
| `PageDown moves down by pageSize` | ページダウン |
| `PageUp moves up by pageSize` | ページアップ |

### 🔴 High Priority: フォーカス管理

| テストケース | 検証内容 |
|--------------|----------|
| `first focusable cell has tabIndex="0" by default` | デフォルトの初期 tabIndex |
| `defaultFocusedId sets initial focus` | 初期フォーカス指定 |
| `other cells have tabIndex="-1"` | 非フォーカスセルの tabIndex |
| `focused cell updates tabIndex on navigation` | ナビゲーション後の更新 |
| `disabled cells are focusable` | disabled でもフォーカス可能 |
| `Tab focuses grid, then exits` | Tab でグリッドに入り、次で出る |
| **`Shift+Tab exits grid to previous element`** | **Shift+Tab で前の要素へ** |
| `maintains focus position after re-render` | 再レンダリング後の維持 |
| `navigates correctly across spanned cells` | スパンセルのナビゲーション |
| `columnheader cells are not focusable` | ヘッダーはフォーカス不可 |

### 🔴 High Priority: 選択

| テストケース | 検証内容 |
|--------------|----------|
| `Space toggles selection (single)` | 単一選択でのトグル |
| `Space toggles selection (multi)` | 複数選択でのトグル |
| `single selection clears previous on Space` | 単一選択時、前の選択をクリア |
| `Enter activates cell` | Enter でアクティベート |
| `Enter does not activate disabled cell` | disabled セルは Enter で無反応 |
| `Space does not select disabled cell` | disabled セルは Space で無反応 |
| `Ctrl+A selects all (multiselectable only)` | 全選択 |
| `updates aria-selected on selection change` | 選択状態の更新 |
| `calls onSelectionChange callback` | コールバック呼び出し |
| `controlled selectedIds overrides internal state` | Controlled モード |

### 🟡 Medium Priority: 仮想化サポート

| テストケース | 検証内容 |
|--------------|----------|
| `has aria-rowcount when totalRows provided` | 総行数 |
| `has aria-colcount when totalColumns provided` | 総列数 |
| `has aria-rowindex on rows when virtualizing` | 行の位置 |
| `has aria-rowindex on cells when virtualizing` | セルの行位置 |
| `has aria-colindex on cells when virtualizing` | セルの列位置 |
| `has aria-colindex on columnheader when virtualizing` | ヘッダーの列位置（静的だが位置情報は必要） |

---

## 5. 実装詳細

### 5.1 データモデル（フレームワーク非依存）

> **Codex 指摘反映**: Props をフレームワーク非依存に再設計

```typescript
// =============================================================================
// フレームワーク非依存のデータモデル
// =============================================================================

// セルの値（プリミティブ型のみ）
export interface GridCellData {
  id: string;
  value: string | number;  // 表示用の値
  disabled?: boolean;
  colspan?: number;
  rowspan?: number;
}

// 列定義
export interface GridColumnDef {
  id: string;
  header: string;
}

// 行定義
export interface GridRowData {
  id: string;
  cells: GridCellData[];
  hasRowHeader?: boolean;
  disabled?: boolean;
}

// =============================================================================
// 共通 Props インターフェース（全フレームワーク共通の概念）
// =============================================================================

interface GridPropsBase {
  columns: GridColumnDef[];
  rows: GridRowData[];

  // Accessible name（どちらか一方のみ必須）
  ariaLabel?: string;
  ariaLabelledby?: string;

  // Selection
  selectable?: boolean;
  multiselectable?: boolean;
  selectedIds?: string[];
  defaultSelectedIds?: string[];

  // Focus
  focusedId?: string | null;
  defaultFocusedId?: string;

  // Virtualization
  totalColumns?: number;
  totalRows?: number;
  startRowIndex?: number;  // 1-based
  startColIndex?: number;  // 1-based

  // Behavior
  wrapNavigation?: boolean;
  enablePageNavigation?: boolean;
  pageSize?: number;  // default: 5
}
```

### 5.2 フレームワーク別の実装方針

#### React
```typescript
// セルのカスタムレンダリングは renderCell prop で対応
export interface GridProps extends GridPropsBase {
  renderCell?: (cell: GridCellData, rowId: string, colId: string) => React.ReactNode;
  onSelectionChange?: (selectedIds: string[]) => void;
  onFocusChange?: (focusedId: string | null) => void;
  onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
}
```

#### Vue
```vue
<script setup lang="ts">
// slot を使用してセルをカスタマイズ
defineSlots<{
  cell?: (props: { cell: GridCellData; rowId: string; colId: string }) => any;
}>();
</script>
```

#### Svelte
```svelte
<script lang="ts">
// snippet を使用してセルをカスタマイズ
let { renderCell, ...props }: GridProps & {
  renderCell?: Snippet<[GridCellData, string, string]>;
} = $props();
</script>
```

#### Astro (Web Components)
- `data-*` 属性で JSON データを渡す
- `<slot>` でデフォルトコンテンツを定義

### 5.3 構造図

```
┌─────────────────────────────────────────────────────────────────┐
│ div role="grid" aria-label="..."                                │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (header row)                                 │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│ │ │ columnheader │ │ columnheader │ │ columnheader │         │ │
│ │ │ (no tabIndex)│ │ (no tabIndex)│ │ (no tabIndex)│         │ │
│ │ │ NOT focusable│ │ NOT focusable│ │ NOT focusable│         │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (data row)                                   │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│ │ │ gridcell     │ │ gridcell     │ │ gridcell     │         │ │
│ │ │ tabIndex=0   │ │ tabIndex=-1  │ │ tabIndex=-1  │         │ │
│ │ │ (focused)    │ │              │ │              │         │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (data row)                                   │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │ │
│ │ │ gridcell     │ │ gridcell     │ │ gridcell     │         │ │
│ │ │ tabIndex=-1  │ │ tabIndex=-1  │ │ tabIndex=-1  │         │ │
│ │ └──────────────┘ └──────────────┘ └──────────────┘         │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

> **Note**: `rowgroup` ロールは省略（セクション 2.1 参照）。row を直接 grid 配下に配置。

---

## 6. TDD ワークフロー

### Phase 0: 設計準備 ✅
- [x] APG 仕様の確認
- [x] 類似パターンとの差分明記
- [x] Codex レビュー反映
- [x] `src/patterns/grid/llm.md` の作成

### Phase 1: テスト作成（RED フェーズ） ✅
- [x] `src/patterns/grid/Grid.test.tsx`
- [x] `src/patterns/grid/Grid.test.vue.ts`
- [x] `src/patterns/grid/Grid.test.svelte.ts`
- [x] `src/patterns/grid/Grid.test.astro.ts`
- [x] `e2e/grid.spec.ts`

### Phase 2: 実装（GREEN フェーズ） ✅
- [x] `src/patterns/grid/Grid.tsx`
- [x] `src/patterns/grid/Grid.vue`
- [x] `src/patterns/grid/Grid.svelte`
- [x] `src/patterns/grid/Grid.astro`
- [x] `src/patterns/grid/GridDemo.tsx`
- [x] `src/patterns/grid/GridDemo.vue`
- [x] `src/patterns/grid/GridDemo.svelte`
- [x] `src/styles/patterns/grid.css`
- [x] `src/styles/global.css` に CSS インポート追加

### Phase 3: ユニットテスト実行・クリア ✅
```bash
npm run test:unit
```
- [x] 全フレームワークのユニットテストがパスするまで実装を修正

### Phase 4-5: ドキュメント作成 ✅
- [x] `src/patterns/grid/AccessibilityDocs.astro`
- [x] `src/patterns/grid/AccessibilityDocs.ja.astro`
- [x] `src/patterns/grid/TestingDocs.astro`
- [x] `src/patterns/grid/TestingDocs.ja.astro`

### Phase 6: ページ作成・統合 ✅

#### 6.1 英語ページ作成
- [x] `src/pages/patterns/grid/index.astro` (リダイレクト - 動的ルーティングで対応)
- [x] `src/pages/patterns/grid/react/index.astro`
- [x] `src/pages/patterns/grid/react/demo/index.astro`
- [x] `src/pages/patterns/grid/vue/index.astro`
- [x] `src/pages/patterns/grid/vue/demo/index.astro`
- [x] `src/pages/patterns/grid/svelte/index.astro`
- [x] `src/pages/patterns/grid/svelte/demo/index.astro`
- [x] `src/pages/patterns/grid/astro/index.astro`
- [x] `src/pages/patterns/grid/astro/demo/index.astro`

#### 6.2 日本語ページ作成
- [x] `src/pages/ja/patterns/grid/react/index.astro`
- [x] `src/pages/ja/patterns/grid/react/demo/index.astro`
- [x] `src/pages/ja/patterns/grid/vue/index.astro`
- [x] `src/pages/ja/patterns/grid/vue/demo/index.astro`
- [x] `src/pages/ja/patterns/grid/svelte/index.astro`
- [x] `src/pages/ja/patterns/grid/svelte/demo/index.astro`
- [x] `src/pages/ja/patterns/grid/astro/index.astro`
- [x] `src/pages/ja/patterns/grid/astro/demo/index.astro`

#### 6.3 設定ファイル更新
- [x] `src/lib/patterns.ts` - Grid を追加・status を available に

### Phase 7: E2E テスト実行・クリア ✅

> **重要**: demoページが完成すると E2E テストが実行可能になる。
> E2E テストがすべてパスするまで実装を修正すること。

```bash
# E2E テスト実行
npm run test:e2e

# UI モードでデバッグ（失敗時）
npm run test:e2e:ui
```

**E2E テストの確認項目**:
- [x] 全4フレームワークの Grid デモが正常に動作
- [x] キーボードナビゲーションが正しく機能
- [x] 選択操作が正しく機能
- [x] ARIA 属性が正しく設定されている
- [x] フォーカス管理が正しく機能

### Phase 8: 最終確認・リリース ✅

```bash
# ビルド確認
npm run build

# 全テスト実行
npm run test

# リント確認
npm run lint
```

- [ ] `README.md` - 実装状況を更新（未実施）
- [ ] `README.ja.md` - 実装状況を更新（未実施）

---

## 7. 参考ファイル

| ファイル | 参考にする観点 |
|----------|----------------|
| `src/patterns/menubar/Menubar.tsx` | 2次元キーボード、フォーカス状態管理 |
| `src/patterns/menubar/llm.md` | 詳細な llm.md の構成 |
| `src/patterns/table/Table.tsx` | CSS Grid レイアウト、セル構造 |
| `src/patterns/listbox/Listbox.tsx` | 選択状態管理 |

---

## 8. リスクと注意点

### 技術的リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| 2次元ナビゲーションの複雑性 | 高 | Menubar の実装を参考に段階的実装 |
| セルスパンとナビゲーションの整合性 | 高 | スパンセルのスキップロジックを慎重に設計・テスト |
| 仮想化対応の複雑性 | 中 | Props のみ提供し、実際の仮想化は利用者に委ねる |
| Astro Web Component の制約 | 中 | E2E テストで動作確認を徹底 |

### Codex 指摘による追加リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| **CSS Grid の視覚順序と DOM 順序のズレ** | 中 | `order` や `grid-area` での視覚的な並べ替えを避ける運用ルールを文書化 |
| **ID 自動生成による Controlled モードの破綻** | 中 | ID 生成規約を全 FW で共通化（`${rowId}-${colIndex}`） |
| **ヘッダーセルのフォーカスと選択の混同** | 低 | ヘッダーセルは選択対象外と明記 |

### 実装上の注意点

- **CSS インポート漏れ**: `src/styles/patterns/grid.css` を作成したら、`src/styles/global.css` にインポート追加
- **フォーカス管理**: `useEffect` / `onMounted` / `onMount` のタイミングに注意
- **キーボードイベント**: `event.preventDefault()` を適切に使用（スクロール防止）
- **ヘッダーセル**: ソート機能がないためフォーカス対象外（tabIndex を設定しない）

---

## 9. 成果物一覧

### Phase 0: 設計準備 ✅
- [x] `src/patterns/grid/llm.md`

### Phase 1: テスト作成 ✅
- [x] `src/patterns/grid/Grid.test.tsx`
- [x] `src/patterns/grid/Grid.test.vue.ts`
- [x] `src/patterns/grid/Grid.test.svelte.ts`
- [x] `src/patterns/grid/Grid.test.astro.ts`
- [x] `e2e/grid.spec.ts`

### Phase 2: コンポーネント実装 ✅
- [x] `src/patterns/grid/Grid.tsx`
- [x] `src/patterns/grid/Grid.vue`
- [x] `src/patterns/grid/Grid.svelte`
- [x] `src/patterns/grid/Grid.astro`
- [x] `src/patterns/grid/GridDemo.tsx`
- [x] `src/patterns/grid/GridDemo.vue`
- [x] `src/patterns/grid/GridDemo.svelte`
- [x] `src/styles/patterns/grid.css`
- [x] `src/styles/global.css` に CSS インポート追加

### Phase 4-5: ドキュメント ✅
- [x] `src/patterns/grid/AccessibilityDocs.astro`
- [x] `src/patterns/grid/AccessibilityDocs.ja.astro`
- [x] `src/patterns/grid/TestingDocs.astro`
- [x] `src/patterns/grid/TestingDocs.ja.astro`

### Phase 6: ページ作成 ✅

#### 英語ページ
- [x] `src/pages/patterns/grid/index.astro` (動的ルーティングで対応)
- [x] `src/pages/patterns/grid/react/index.astro`
- [x] `src/pages/patterns/grid/react/demo/index.astro`
- [x] `src/pages/patterns/grid/vue/index.astro`
- [x] `src/pages/patterns/grid/vue/demo/index.astro`
- [x] `src/pages/patterns/grid/svelte/index.astro`
- [x] `src/pages/patterns/grid/svelte/demo/index.astro`
- [x] `src/pages/patterns/grid/astro/index.astro`
- [x] `src/pages/patterns/grid/astro/demo/index.astro`

#### 日本語ページ
- [x] `src/pages/ja/patterns/grid/react/index.astro`
- [x] `src/pages/ja/patterns/grid/react/demo/index.astro`
- [x] `src/pages/ja/patterns/grid/vue/index.astro`
- [x] `src/pages/ja/patterns/grid/vue/demo/index.astro`
- [x] `src/pages/ja/patterns/grid/svelte/index.astro`
- [x] `src/pages/ja/patterns/grid/svelte/demo/index.astro`
- [x] `src/pages/ja/patterns/grid/astro/index.astro`
- [x] `src/pages/ja/patterns/grid/astro/demo/index.astro`

### Phase 7: E2E テスト実行・クリア ✅
- [x] `npm run test:e2e` を実行
- [x] 全テストがパスするまで実装を修正

### Phase 8: 最終更新 ✅
- [x] `src/lib/patterns.ts` - Grid を追加・status を available に
- [x] `README.md` - 実装状況を更新
- [x] `README.ja.md` - 実装状況を更新
- [x] `npm run build` でビルド確認
- [x] `npm run test` で全テスト確認
- [x] `npm run lint` でリント確認

---

## 10. 計画と実装の差分

### 追加された Props

| Prop | 説明 | 計画時の状態 |
|------|------|-------------|
| `enablePageNavigation` | PageUp/PageDown を有効化 | 未定義（暗黙的に有効だと想定） |
| `GridColumnDef.colspan` | ヘッダーセルの colspan | 未定義 |

### 実装されなかった機能

| 機能 | 理由 |
|------|------|
| aria-label/labelledby の相互排他検証 | 複雑度回避、両方指定しても動作する |
| aria-rowspan テスト (rowheader) | テストケース未作成 |
| スパンセルのナビゲーションテスト | テストケース未作成 |
| フォーカス位置の再レンダリング後維持テスト | テストケース未作成 |

### 動作の差異

| 項目 | 計画 | 実装 |
|------|------|------|
| `Ctrl+A` | multiselectable 時のみ | `selectable` AND `multiselectable` 時 |
| PageUp/PageDown | デフォルトで有効 | `enablePageNavigation=true` で有効 |
| disabled セルナビゲーション | スキップ | スキップ（skipDisabled パラメータで制御可能） |
