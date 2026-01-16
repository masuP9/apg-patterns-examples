# Slider (Multi-Thumb) パターン実装計画書

> 作成日: 2026-01-16
> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

---

## 1. 概要

Slider (Multi-Thumb) は、単一のレール上に2つ以上のサム（つまみ）を配置し、ユーザーが範囲を選択できるスライダーパターンです。価格帯の選択、日付範囲、フィルター条件の設定などに使用されます。

**主要機能**:
- 2つ以上のサムによる範囲選択
- サム間の動的な制約（サムが互いを超えない）
- 各サムが独立してキーボード操作可能
- タブ順序はサムの視覚的位置に関わらず一定

**類似パターン**: Slider（単一サム）

---

## 2. APG 仕様サマリー

### Roles

| Role | 対象要素 | 説明 |
|------|----------|------|
| `slider` | 各サム要素 | フォーカス可能なスライダーサムを識別 |

### Properties（静的属性）

| 属性 | 対象要素 | 値 | 必須 | 備考 |
|------|----------|-----|------|------|
| `aria-label` / `aria-labelledby` | 各サム | string / ID ref | Yes（いずれか） | 各サムを区別する名前（例: "最低価格", "最高価格"） |
| `aria-orientation` | 各サム | `horizontal` / `vertical` | No | 垂直の場合のみ `vertical` を設定 |
| `aria-describedby` | 各サム | ID ref | No | 追加説明がある場合 |

### States（動的属性）

| 属性 | 対象要素 | 値 | 必須 | 変更トリガー |
|------|----------|-----|------|--------------|
| `aria-valuenow` | 各サム | number | Yes | ユーザー操作時 |
| `aria-valuemin` | 各サム | number | Yes | **他のサムの移動時**（動的更新） |
| `aria-valuemax` | 各サム | number | Yes | **他のサムの移動時**（動的更新） |
| `aria-valuetext` | 各サム | string | No | 値変更時（フォーマット使用時） |
| `aria-disabled` | 各サム | `true` / `false` | No | disabled 状態変更時 |

### Keyboard Support

| キー | アクション | 備考 |
|------|------------|------|
| `ArrowRight` / `ArrowUp` | 値を step 分増加 | 他サムの位置を超えない |
| `ArrowLeft` / `ArrowDown` | 値を step 分減少 | 他サムの位置を超えない |
| `Home` | **動的な最小値**に設定 | 下位サムは絶対min、上位サムは下位サムの値 |
| `End` | **動的な最大値**に設定 | 上位サムは絶対max、下位サムは上位サムの値 |
| `Page Up` | 大きな step で増加 | largeStep（デフォルト: step × 10） |
| `Page Down` | 大きな step で減少 | largeStep（デフォルト: step × 10） |

### Focus Management

- 各サムが `tabindex="0"` で独立してフォーカス可能
- タブ順序は DOM 順序に従い、サムの視覚的位置に関わらず一定
- disabled 時は `tabindex="-1"`
- ポインター操作後はフォーカスを操作したサムに移動

---

## 3. 類似パターンとの差分

> **目的**: 実装時の「既存 Slider と同じ」という誤解を防ぎ、正確な実装を担保する。

### 類似パターン: Slider（単一サム）

**選定理由**: 同じ slider ロールを使用し、キーボード操作の基本パターンが共通しているため。

### 差分一覧

| 機能 | Slider（単一） | Slider (Multi-Thumb) | 違いの理由 |
|------|----------------|----------------------|------------|
| サム数 | 1 | 2+ | 範囲選択のため |
| Tab ストップ | 1つ | サム数分 | 各サムが独立して操作可能 |
| `aria-valuemin` | 静的（props の min） | **動的**（他サムの値に依存） | サム間の重なり防止 |
| `aria-valuemax` | 静的（props の max） | **動的**（他サムの値に依存） | サム間の重なり防止 |
| `Home` キー | 絶対 min へ移動 | **動的 min** へ移動（他サムを超えない） | サム順序の維持 |
| `End` キー | 絶対 max へ移動 | **動的 max** へ移動（他サムを超えない） | サム順序の維持 |
| 値の型 | `number` | `number[]` | 複数の値を管理 |
| コールバック | `onValueChange(value)` | `onValueChange(values, activeIndex)` | どのサムが変更されたか識別 |
| Collision 処理 | なし | **必須** - clamp ポリシー | サムの順序保持 |

### 差分の詳細説明

#### 差分1: 動的な `aria-valuemin` / `aria-valuemax`

**Slider（単一）での動作**:
- `aria-valuemin` と `aria-valuemax` は props で渡された固定値

**Slider (Multi-Thumb) での動作**:
- 下位サムの `aria-valuemax` = 上位サムの `aria-valuenow`
- 上位サムの `aria-valuemin` = 下位サムの `aria-valuenow`
- サムが移動するたびに隣接サムの ARIA 属性を更新

**違いが生じる理由**:
- サムが互いを超えないよう制約するため
- スクリーンリーダーに有効な範囲を正確に伝えるため

#### 差分2: `Home` / `End` キーの動作

**Slider（単一）での動作**:
- `Home`: props の `min` 値へ移動
- `End`: props の `max` 値へ移動

**Slider (Multi-Thumb) での動作**:
- 下位サム: `Home` → 絶対 min、`End` → 上位サムの値（または上位サムの値 - minDistance）
- 上位サム: `Home` → 下位サムの値（または下位サムの値 + minDistance）、`End` → 絶対 max

**違いが生じる理由**:
- サムの順序を維持するため
- minDistance が設定されている場合、その距離を保つため

#### 差分3: Collision（衝突）処理

**Slider（単一）での動作**:
- 衝突処理は不要

**Slider (Multi-Thumb) での動作**:
- ドラッグ時: 他のサムの位置で clamp（停止）
- キーボード時: 他のサムの位置を超える値にならないよう制限
- minDistance オプション: サム間の最小距離を強制

**違いが生じる理由**:
- 範囲スライダーでは論理的な順序（min ≤ max）を維持する必要がある

### 実装時の注意事項

> ⚠️ 以下の点は「Slider と同じ」ではないため、個別に実装が必要:

1. **動的 ARIA bounds**: 各サムの `aria-valuemin`/`max` はレンダリングごとに計算
2. **Home/End クランプ**: 絶対値ではなく、動的な bounds を使用
3. **値の配列管理**: 単一値ではなく配列で状態管理
4. **アクティブサムの追跡**: どのサムが操作されているか追跡

### 差分確認チェックリスト

実装前に以下を確認:

- [ ] 各差分の「違いの理由」が明確に説明されているか
- [ ] 曖昧な表現（「同様」「似ている」）がないか
- [ ] 実装者が「これは別物」と認識できるか

---

## 4. テスト設計

DAMP 原則に基づき、以下の構成でテストを作成します。

### テストファイル構成

```typescript
describe('MultiThumbSlider', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG ARIA Attributes', () => {
    // role の検証
    // aria-* 属性の検証
    // 動的な aria-valuemin/max の検証
  });

  describe('APG Keyboard Interaction', () => {
    // 必須キーボード操作の検証
    // Home/End の動的クランプ検証
    // サム間の衝突防止検証
  });

  describe('Focus Management', () => {
    // 複数 Tab ストップの検証
    // DOM 順序でのタブ移動
    // ポインター後のフォーカス
  });

  // 🟡 Medium Priority
  describe('Multi-Thumb Specific', () => {
    // 動的 bounds の更新
    // 衝突ポリシー
    // minDistance 制約
  });

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
| `each thumb has role="slider"` | 各サムに role 属性が存在 |
| `each thumb has aria-valuenow` | 各サムに現在値が設定 |
| `lower thumb has correct aria-valuemin/max` | 下位サムの bounds |
| `upper thumb has correct aria-valuemin/max` | 上位サムの bounds |
| `aria-valuemin updates when lower thumb moves` | 動的 bounds 更新 |
| `aria-valuemax updates when upper thumb moves` | 動的 bounds 更新 |
| `each thumb has accessible name` | aria-label または aria-labelledby |
| `aria-valuetext updates with format` | フォーマット時の valuetext |

#### 🔴 High Priority: キーボード操作

| テストケース | 検証内容 |
|--------------|----------|
| `ArrowRight increases lower thumb value` | 下位サムの増加 |
| `ArrowRight increases upper thumb value` | 上位サムの増加 |
| `ArrowLeft decreases lower thumb value` | 下位サムの減少 |
| `ArrowLeft decreases upper thumb value` | 上位サムの減少 |
| `lower thumb cannot exceed upper thumb with ArrowRight` | 衝突防止 |
| `upper thumb cannot go below lower thumb with ArrowLeft` | 衝突防止 |
| `Home on lower thumb goes to absolute min` | Home 動作（下位） |
| `Home on upper thumb goes to lower thumb value` | Home 動作（上位）- **差分** |
| `End on lower thumb goes to upper thumb value` | End 動作（下位）- **差分** |
| `End on upper thumb goes to absolute max` | End 動作（上位） |
| `PageUp increases value by largeStep` | 大ステップ増加 |
| `PageDown decreases value by largeStep` | 大ステップ減少 |
| `PageUp respects thumb constraints` | 大ステップでの衝突防止 |
| `PageDown respects thumb constraints` | 大ステップでの衝突防止 |
| `vertical orientation: ArrowUp increases, ArrowDown decreases` | 垂直モードの方向 |

#### 🔴 High Priority: フォーカス管理

| テストケース | 検証内容 |
|--------------|----------|
| `both thumbs have tabindex="0"` | フォーカス可能 |
| `Tab moves to lower thumb first` | タブ順序 |
| `Tab moves from lower to upper thumb` | タブ順序 |
| `Tab order is constant regardless of thumb positions` | 位置に依存しない |
| `thumbs not focusable when disabled (tabindex="-1")` | disabled 時 |
| `aria-disabled="true" when disabled` | disabled の ARIA |
| `focus stays on thumb during pointer drag` | ドラッグ中のフォーカス維持 |
| `track click moves focus to activated thumb` | トラッククリック後のフォーカス |

#### 🟡 Medium Priority: Multi-Thumb 固有

| テストケース | 検証内容 |
|--------------|----------|
| `minDistance is enforced on keyboard` | 最小距離（キーボード） |
| `minDistance is enforced on pointer drag` | 最小距離（ポインター） |
| `minDistance with Home/End clamps correctly` | 最小距離 + Home/End |
| `dragging lower thumb clamps at upper thumb` | ドラッグ時の clamp |
| `dragging upper thumb clamps at lower thumb` | ドラッグ時の clamp |
| `track click updates nearest thumb` | トラッククリック |
| `track click tie-breaker: prefer lower thumb when equidistant` | 等距離時のルール |
| `pointer capture prevents thumb switching during drag` | ドラッグ中のサム切り替え防止 |
| `controlled value prop updates reflect immediately` | controlled モード |

#### 🟡 Medium Priority: アクセシビリティ

| テストケース | 検証内容 |
|--------------|----------|
| `has no axe violations` | WCAG 2.1 AA 準拠 |
| `has no axe violations when disabled` | disabled 状態 |
| `has no axe violations with various values` | 各状態 |

#### 🟢 Low Priority: Props

| テストケース | 検証内容 |
|--------------|----------|
| `calls onValueChange with values array and activeIndex` | コールバック |
| `defaultValue sets initial values` | 初期値 |
| `className applies to container` | スタイル継承 |
| `vertical orientation sets aria-orientation` | 垂直モード |

---

## 5. 実装詳細

### Props 設計（React）

```typescript
// Label: 各サムに名前が必要（タプルまたは関数）
type ThumbLabelProps =
  | { 'aria-label': [string, string]; 'aria-labelledby'?: never; getAriaLabel?: never }
  | { 'aria-label'?: never; 'aria-labelledby': [string, string]; getAriaLabel?: never }
  | { 'aria-label'?: never; 'aria-labelledby'?: never; getAriaLabel: (index: number) => string };

type MultiThumbSliderBaseProps = {
  /** Controlled values [lowerValue, upperValue] */
  value?: [number, number];
  /** Initial values for uncontrolled mode [lowerValue, upperValue] */
  defaultValue?: [number, number];
  /** Minimum value (default: 0) */
  min?: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Step increment (default: 1) */
  step?: number;
  /** Large step for PageUp/PageDown (default: step * 10) */
  largeStep?: number;
  /** Minimum distance between thumbs (default: 0) */
  minDistance?: number;
  /** Slider orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Whether slider is disabled */
  disabled?: boolean;
  /** Show value text (default: true) */
  showValues?: boolean;
  /** Format pattern for value display (e.g., "${value}") */
  format?: string;
  /** Function to get aria-valuetext per thumb */
  getAriaValueText?: (value: number, index: number) => string;
  /** Callback when value changes */
  onValueChange?: (values: [number, number], activeThumbIndex: number) => void;
  /** Callback when change is committed (pointer up / blur) */
  onValueCommit?: (values: [number, number]) => void;
  /** Container className */
  className?: string;
  /** Container id */
  id?: string;
  /** aria-describedby per thumb (tuple or single for both) */
  'aria-describedby'?: string | [string, string];
  /** Test id */
  'data-testid'?: string;
};

export type MultiThumbSliderProps = MultiThumbSliderBaseProps & ThumbLabelProps;
```

**Codex レビュー反映**:
- `value` prop を追加（controlled モード対応）
- `getAriaValueText` を追加（per-thumb の aria-valuetext）
- `aria-describedby` をタプル対応（per-thumb）
- `getAriaLabel` を関数として分離

### フレームワーク別の注意点

#### React
- `useCallback` でハンドラをメモ化（各サムごとに異なる処理）
- `useId` でラベル ID を生成
- ポインターキャプチャ対応

#### Vue
- `defineOptions({ inheritAttrs: false })` の使用
- `computed` で動的 bounds を計算
- 各サムの ref を配列で管理

#### Svelte
- `$props()` による props 受け取り
- `$derived` で動的 bounds を計算
- イベントハンドラのバインド

#### Astro (Web Components)
- `customElements.define()` でカスタム要素登録
- Shadow DOM 内でのスタイルカプセル化
- 属性変更の監視

### 構造図

```
┌─────────────────────────────────────────────────────────────────┐
│ <div class="apg-slider-multithumb">                             │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ <div class="apg-slider-multithumb-track">                   │ │
│ │   <div class="apg-slider-multithumb-range" />  ← 選択範囲   │ │
│ │   <div                                                      │ │
│ │     role="slider"                                           │ │
│ │     class="apg-slider-multithumb-thumb"                     │ │
│ │     tabindex="0"                                            │ │
│ │     aria-valuenow="20"                                      │ │
│ │     aria-valuemin="0"        ← 絶対 min                     │ │
│ │     aria-valuemax="80"       ← 上位サムの値                 │ │
│ │     aria-label="最低価格"                                   │ │
│ │   />                                                        │ │
│ │   <div                                                      │ │
│ │     role="slider"                                           │ │
│ │     class="apg-slider-multithumb-thumb"                     │ │
│ │     tabindex="0"                                            │ │
│ │     aria-valuenow="80"                                      │ │
│ │     aria-valuemin="20"       ← 下位サムの値                 │ │
│ │     aria-valuemax="100"      ← 絶対 max                     │ │
│ │     aria-label="最高価格"                                   │ │
│ │   />                                                        │ │
│ │ </div>                                                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ <div class="apg-slider-multithumb-values" aria-hidden="true">   │
│   <span>20</span> - <span>80</span>                             │
│ </div>                                                          │
└─────────────────────────────────────────────────────────────────┘
```

### 値計算ロジック

```typescript
// 動的 bounds の計算
const getLowerThumbBounds = (values: [number, number], min: number, minDistance: number) => ({
  min: min,
  max: values[1] - minDistance,
});

const getUpperThumbBounds = (values: [number, number], max: number, minDistance: number) => ({
  min: values[0] + minDistance,
  max: max,
});

// 値の更新（衝突防止付き）
const updateValue = (
  index: number,
  newValue: number,
  values: [number, number],
  min: number,
  max: number,
  minDistance: number
): [number, number] => {
  const bounds = index === 0
    ? getLowerThumbBounds(values, min, minDistance)
    : getUpperThumbBounds(values, max, minDistance);

  const clampedValue = clamp(newValue, bounds.min, bounds.max);
  const newValues: [number, number] = [...values];
  newValues[index] = clampedValue;
  return newValues;
};
```

---

## 6. TDD ワークフロー

### Phase 0: 設計準備

1. **APG 仕様の確認** ✅ 完了
   - APG 公式ドキュメントを読み込み
   - Examples の動作確認
   - Edge case の洗い出し

2. **類似パターンとの差分明記** ✅ 完了（セクション3）

3. **llm.md の作成**
   ```bash
   touch src/patterns/slider-multithumb/llm.md
   ```
   - 動的 bounds の説明を重点的に記述
   - Single Slider との違いを明記

### Phase 1: テスト作成（RED フェーズ）

1. **React テストの作成**
   ```bash
   touch src/patterns/slider-multithumb/MultiThumbSlider.test.tsx
   npm run test -- MultiThumbSlider.test.tsx
   ```

2. **他フレームワークのユニットテスト作成**
   - Vue: `MultiThumbSlider.test.vue.ts`
   - Svelte: `MultiThumbSlider.test.svelte.ts`
   - Astro: `MultiThumbSlider.test.astro.ts`

3. **E2E テスト作成**
   - `e2e/slider-multithumb.spec.ts`

4. **チェックリスト照合**
   - llm.md の Test Checklist と 1:1 対応確認
   - 差分項目のテスト確認

### Phase 2: 実装（GREEN フェーズ）

1. **React 実装**
   ```bash
   touch src/patterns/slider-multithumb/MultiThumbSlider.tsx
   ```

2. **他フレームワーク実装**
   - Vue → Svelte → Astro

3. **CSS 作成**
   ```bash
   touch src/styles/patterns/slider-multithumb.css
   ```
   - `src/styles/global.css` にインポート追加

### Phase 3: リファクタリング（REFACTOR フェーズ）

1. **計画-実装-テスト 三点照合**
2. **差分項目の照合**

### Phase 4: ドキュメント作成（英語）

- `AccessibilityDocs.astro`
- `TestingDocs.astro`

### Phase 5: 日本語ドキュメント作成

- `AccessibilityDocs.ja.astro`
- `TestingDocs.ja.astro`

### Phase 6: ページ作成・統合

1. **英語ページ**
   - `src/pages/patterns/slider-multithumb/index.astro` (リダイレクト)
   - `src/pages/patterns/slider-multithumb/{framework}/index.astro`
   - `src/pages/patterns/slider-multithumb/{framework}/demo/index.astro`

2. **日本語ページ**
   - `src/pages/ja/patterns/slider-multithumb/{framework}/index.astro`

3. **patterns.ts 更新**
   - `slider-multithumb` を追加（status: 'available'）

4. **成果物照合チェック**

---

## 7. Codex レビューポイント

### llm.md レビュー
- 動的 bounds の説明が明確か
- Single Slider との違いが明記されているか

### テストコードレビュー
- 動的 ARIA bounds のテストが網羅されているか
- Home/End の動的クランプがテストされているか
- 衝突防止がテストされているか

### 実装コードレビュー
- 動的 bounds が毎レンダリングで正しく計算されているか
- 衝突処理が正しく実装されているか
- タブ順序が一定か

---

## 8. リスクと注意点

### 技術的リスク

| リスク | 影響度 | 対策 |
|--------|--------|------|
| 動的 bounds の stale 状態 | 高 | レンダリングごとに計算、useMemo 不使用 |
| 浮動小数点精度ドリフト | 中 | roundToStep で正規化 |
| ポインター計算のずれ | 中 | getBoundingClientRect() 使用 |
| タッチ操作の複雑さ | 中 | どのサムをドラッグ中か追跡 |

### 実装上の注意点

- **動的 bounds**: 各サムの `aria-valuemin`/`max` は他のサムの値に依存するため、メモ化せず毎回計算
- **サムの識別**: ドラッグ中にどのサムを操作しているか追跡（index を保持）
- **トラッククリック**: クリック位置に最も近いサムを移動
- **minDistance**: デフォルト 0 だが、設定時は Home/End や衝突処理で考慮

### 🔴 計画-実装の乖離を防ぐための注意点

#### 差分項目の実装チェック

| 差分項目 | 確認観点 |
|----------|----------|
| 動的 `aria-valuemin`/`max` | 他サムの移動時に更新されているか |
| `Home`/`End` の動的クランプ | 絶対値ではなく動的 bounds を使用しているか |
| 衝突防止 | キーボードとポインター両方で機能するか |
| 値の配列管理 | `[number, number]` 型で管理しているか |

---

## 成果物一覧

### Phase 0: 設計準備
- [ ] `src/patterns/slider-multithumb/llm.md`

### Phase 1: テスト作成
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.test.tsx`
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.test.vue.ts`
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.test.svelte.ts`
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.test.astro.ts`
- [ ] `e2e/slider-multithumb.spec.ts`

### Phase 2: コンポーネント実装
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.tsx`
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.vue`
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.svelte`
- [ ] `src/patterns/slider-multithumb/MultiThumbSlider.astro`
- [ ] `src/styles/patterns/slider-multithumb.css`
- [ ] `src/styles/global.css` に CSS インポート追加

### Phase 4: ドキュメント（英語）
- [ ] `src/patterns/slider-multithumb/AccessibilityDocs.astro`
- [ ] `src/patterns/slider-multithumb/TestingDocs.astro`

### Phase 5: 日本語ドキュメント
- [ ] `src/patterns/slider-multithumb/AccessibilityDocs.ja.astro`
- [ ] `src/patterns/slider-multithumb/TestingDocs.ja.astro`

### Phase 6: ページ作成
- [ ] `src/pages/patterns/slider-multithumb/index.astro`
- [ ] `src/pages/patterns/slider-multithumb/react/index.astro`
- [ ] `src/pages/patterns/slider-multithumb/vue/index.astro`
- [ ] `src/pages/patterns/slider-multithumb/svelte/index.astro`
- [ ] `src/pages/patterns/slider-multithumb/astro/index.astro`
- [ ] `src/pages/patterns/slider-multithumb/{framework}/demo/index.astro` (4ファイル)
- [ ] `src/pages/ja/patterns/slider-multithumb/react/index.astro`
- [ ] `src/pages/ja/patterns/slider-multithumb/vue/index.astro`
- [ ] `src/pages/ja/patterns/slider-multithumb/svelte/index.astro`
- [ ] `src/pages/ja/patterns/slider-multithumb/astro/index.astro`
- [ ] `src/lib/patterns.ts` に追加
