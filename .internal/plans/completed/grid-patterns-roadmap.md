# Grid パターン分離ロードマップ

> 作成日: 2026-01-12

## 概要

Grid パターンの機能拡張を計画的に行うため、APG 仕様に基づいて3つのパターンに分離する方針を定める。

## パターン分類

### 1. Grid (Layout Grid) - 完了

**現在の実装状態**: ✅ 完了

**概要**:
基本的な2次元キーボードナビゲーションを提供するシンプルなグリッド。APG の Layout Grid パターンに相当。

**主要機能**:
- 2次元キーボードナビゲーション（Arrow keys, Home, End, Ctrl+Home/End, PageUp/Down）
- Roving tabindex によるフォーカス管理
- セル選択（単一/複数）
- 仮想化サポート（aria-rowcount/colcount）

**実装ファイル**:
- `src/patterns/grid/Grid.{tsx,vue,svelte,astro}`
- `src/patterns/grid/GridDemo.{tsx,vue,svelte}`

**アーキテクチャ**: 単一コンポーネント（props でデータを渡す）

---

### 2. Data Grid - 将来実装予定

**実装状態**: 📋 未実装

**概要**:
表形式データの表示・操作に特化したグリッド。APG の Data Grid パターンに相当。

**計画機能**:
- ソート可能なヘッダー（`aria-sort`）
- フィルタリング
- 行選択（Row Selection）
- Shift+Arrow による範囲選択
- 列のリサイズ

**アーキテクチャの選択肢**:

#### Option A: Compound Components パターン（推奨）
```tsx
// React 例
<DataGrid columns={columns} rows={rows}>
  <DataGridHeader>
    <DataGridColumn id="name" sortable>Name</DataGridColumn>
    <DataGridColumn id="email">Email</DataGridColumn>
  </DataGridHeader>
  <DataGridBody>
    {rows.map(row => (
      <DataGridRow key={row.id}>
        <DataGridCell>{row.name}</DataGridCell>
        <DataGridCell>{row.email}</DataGridCell>
      </DataGridRow>
    ))}
  </DataGridBody>
</DataGrid>
```

**メリット**:
- カスタムセルレンダリングが容易
- ソート/フィルターUIの柔軟な配置
- 型安全なAPI

**デメリット**:
- 実装の複雑度が高い
- Astro Islands では制約あり（ラッパーコンポーネント必須）

#### Option B: 拡張 Props パターン
```tsx
<DataGrid
  columns={[
    { id: 'name', header: 'Name', sortable: true },
    { id: 'email', header: 'Email' }
  ]}
  rows={rows}
  onSort={(columnId, direction) => {}}
  renderCell={(cell, row, col) => <CustomCell {...cell} />}
/>
```

**メリット**:
- 単一コンポーネントで完結
- 学習コストが低い
- Astro 互換性が高い

**デメリット**:
- 複雑な機能追加時に props が肥大化

**推奨**: Option A (Compound Components)

**理由**: Data Grid は機能が多いため、責務分離が重要。Astro デモは制約付きで対応可能。

---

### 3. Editable Grid - 将来実装予定

**実装状態**: 📋 未実装

**概要**:
セル編集機能を持つグリッド。スプレッドシートライクなインタラクション。

**計画機能**:
- セル編集（ダブルクリック / Enter / F2）
- `aria-readonly` の適切な使用
- 編集キャンセル（Escape）
- セル内ドロップダウン（Combobox）
- セル内チェックボックス
- バリデーション
- Undo/Redo

**前提条件**:
- Data Grid パターンが完成していること
- Combobox パターンが実装済みであること

**アーキテクチャ**: Data Grid を拡張（Compound Components）

```tsx
// React 例
<EditableGrid>
  <EditableGridHeader>...</EditableGridHeader>
  <EditableGridBody>
    {rows.map(row => (
      <EditableGridRow key={row.id}>
        <EditableGridCell editable>{row.name}</EditableGridCell>
        <EditableGridCell>
          <Combobox options={statusOptions} />
        </EditableGridCell>
      </EditableGridRow>
    ))}
  </EditableGridBody>
</EditableGrid>
```

---

## 実装優先順位

| 順位 | パターン | 前提条件 | 複雑度 |
|------|----------|----------|--------|
| 1 | Grid (Layout Grid) | なし | 高 ✅ 完了 |
| 2 | Data Grid | なし | 非常に高 |
| 3 | Editable Grid | Data Grid, Combobox | 非常に高 |

## Astro Islands での制約

Compound Components パターンを使用する場合、Astro テンプレート内での子コンポーネント状態管理に制約がある。

**解決策**:
1. デモ用のラッパーコンポーネントを作成（例: `DataGridBasicDemo.tsx`）
2. Astro テンプレートからラッパーを呼び出し

```astro
<!-- ❌ 動作しない -->
<DataGrid client:load>
  <DataGridRow>...</DataGridRow>
</DataGrid>

<!-- ✅ 動作する -->
<DataGridBasicDemo client:load />
```

## 参考リンク

- [APG Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/)
- [APG Layout Grid Example](https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/layout-grids/)
- [APG Data Grid Example](https://www.w3.org/WAI/ARIA/apg/patterns/grid/examples/data-grids/)
- [現在の Grid 実装計画](./../grid-implementation-plan.md)
