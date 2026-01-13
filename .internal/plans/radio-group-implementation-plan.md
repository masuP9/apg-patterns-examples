# Radio Group Pattern Implementation Plan

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

## 1. Overview

Radio Group パターンを4つのフレームワーク（React, Vue, Svelte, Astro）で実装する。
Radio Group は相互排他的な選択肢の中から1つだけを選択できるウィジェット。

**特徴:**
- グループ内で1つのみ選択可能（相互排他）
- 矢印キーでフォーカス移動と同時に選択が変わる
- Tab でグループに入り、Tab でグループから出る（Roving Tabindex）

## 2. Implementation Scope

### Phase 1: Basic Radio Group (MVP)

- 単一の Radio Group
- 4フレームワーク対応
- APG準拠テスト
- 垂直/水平レイアウト対応

### Phase 2: Advanced Features (Optional)

- Radio Group in Toolbar（特殊キーボード挙動）
- Disabled 個別オプション

## 3. File Structure

```
src/patterns/radio-group/
├── RadioGroup.tsx              # React implementation
├── RadioGroup.vue              # Vue implementation
├── RadioGroup.svelte           # Svelte implementation
├── RadioGroup.astro            # Astro (Web Components)
├── AccessibilityDocs.astro     # ARIA docs
├── NativeHtmlNotice.astro      # Native HTML recommendation
├── TestingDocs.astro           # Testing documentation
├── llm.md                      # AI implementation guide
├── RadioGroup.test.tsx         # React tests
├── RadioGroup.test.vue.ts      # Vue tests (if needed)
└── RadioGroup.test.svelte.ts   # Svelte tests (if needed)

src/pages/patterns/radio-group/
├── index.astro                 # Redirect to react/
├── react/index.astro
├── vue/index.astro
├── svelte/index.astro
└── astro/index.astro
```

## 4. ARIA Requirements

### A. ネイティブ `<input type="radio">` の場合

ネイティブ要素を使用する場合、`role` や `aria-checked` は**不要**。

| 属性/プロパティ | 用途                     | 備考                     |
| --------------- | ------------------------ | ------------------------ |
| `name`          | グループ化               | 同じ name で相互排他     |
| `checked`       | 選択状態                 | HTML属性 or DOMプロパティ |
| `disabled`      | 無効状態                 | HTML属性                 |
| `<fieldset>`    | グループのコンテナ       | アクセシブルネーム用     |
| `<legend>`      | グループのラベル         | fieldset と組み合わせ    |

```html
<!-- ネイティブの推奨パターン -->
<fieldset>
  <legend>Favorite color</legend>
  <label><input type="radio" name="color" value="red" /> Red</label>
  <label><input type="radio" name="color" value="blue" /> Blue</label>
  <label><input type="radio" name="color" value="green" /> Green</label>
</fieldset>
```

### B. カスタム `role="radiogroup"` の場合

#### Roles

| Role         | Element          | Description                   |
| ------------ | ---------------- | ----------------------------- |
| `radiogroup` | Container        | Groups radio buttons          |
| `radio`      | div/span/button  | Individual radio button       |

#### States

| Attribute      | Element | Values            | Required | Change Trigger    |
| -------------- | ------- | ----------------- | -------- | ----------------- |
| `aria-checked` | radio   | `true` / `false`  | Yes      | Click, Space, Arrow |
| `aria-disabled`| radio   | `true`            | No       | Prop change       |

#### Properties

| Attribute          | Element    | Purpose                          |
| ------------------ | ---------- | -------------------------------- |
| `aria-label`       | radiogroup | Invisible accessible name        |
| `aria-labelledby`  | radiogroup | Reference to external label      |
| `aria-describedby` | radiogroup | Reference to description         |
| `aria-orientation` | radiogroup | `horizontal` / `vertical`        |

## 5. Keyboard Support

### Standard Radio Group

| Key           | Action                                              |
| ------------- | --------------------------------------------------- |
| `Tab`         | グループに入る（checked or 最初のラジオにフォーカス） |
| `Shift+Tab`   | グループから出る                                    |
| `Space`       | フォーカス中のラジオを選択（選択解除はしない）      |
| `ArrowRight`  | 次のラジオに移動＆選択（horizontal時、ラップあり）  |
| `ArrowDown`   | 次のラジオに移動＆選択（vertical時、ラップあり）    |
| `ArrowLeft`   | 前のラジオに移動＆選択（horizontal時、ラップあり）  |
| `ArrowUp`     | 前のラジオに移動＆選択（vertical時、ラップあり）    |
| `Home`        | 最初のラジオに移動＆選択                            |
| `End`         | 最後のラジオに移動＆選択                            |

### 注意事項

- **Checkbox との違い**: 矢印キーでフォーカス移動と同時に選択が変わる
- **Space は選択のみ**: 既に選択済みでも選択解除はしない
- **ラップ**: 最後から次へ行くと最初に戻る、最初から前へ行くと最後に行く
- **Roving Tabindex**: 選択中のラジオのみ `tabindex="0"`、他は `tabindex="-1"`
- **Orientation**: vertical（デフォルト）では Up/Down、horizontal では Left/Right を使用
  - 本実装では両方向の矢印キーをサポート（APG推奨）

### フォーカス管理ルール

| 状態                     | Tab でのフォーカス先     |
| ------------------------ | ----------------------- |
| 1つ選択済み              | 選択中のラジオ          |
| 何も選択されていない     | 最初のラジオ            |

## 6. Native HTML Considerations

### 推奨: ネイティブ `<input type="radio">`

```html
<fieldset>
  <legend>Favorite color</legend>
  <label><input type="radio" name="color" value="red" /> Red</label>
  <label><input type="radio" name="color" value="blue" /> Blue</label>
</fieldset>
```

### カスタム実装が必要なケース

| Use Case                    | Native  | Custom |
| --------------------------- | ------- | ------ |
| 基本的なフォーム入力        | ✅ 推奨  | 不要   |
| JavaScriptなし動作          | ✅ 動作  | 要フォールバック |
| 矢印キーでの選択変更        | ブラウザ依存* | ✅ 完全制御 |
| カスタムスタイリング        | 制限あり | ✅ 完全制御 |
| 複雑なアニメーション        | 困難    | ✅ 完全制御 |

*ブラウザによって矢印キーでの選択変更の挙動が異なる場合がある

## 7. Component API Design

### React

```typescript
export interface RadioOption {
  id: string;
  label: string;
  value: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Radio options */
  options: RadioOption[];
  /** Group name for form submission */
  name: string;
  /** Accessible label for the group */
  'aria-label'?: string;
  /** Reference to external label */
  'aria-labelledby'?: string;
  /** Initially selected value */
  defaultValue?: string;
  /** Controlled selected value */
  value?: string;
  /** Orientation of the group */
  orientation?: 'horizontal' | 'vertical';
  /** Callback when selection changes */
  onValueChange?: (value: string) => void;
  /** Additional CSS class */
  className?: string;
}
```

### 実装アプローチの選択

**Option A: ネイティブ `<input type="radio">` ベース**
- Pros: フォーム送信対応、ブラウザ機能活用
- Cons: スタイリング制約、キーボード挙動がブラウザ依存

**Option B: `role="radiogroup"` + `role="radio"` ベース**
- Pros: 完全なスタイリング制御、一貫したキーボード挙動
- Cons: フォーム送信に hidden input 必要

**選択: Option B（カスタムベース）**
- 理由:
  - APG仕様に完全準拠したキーボード挙動を実現
  - フレームワーク間で一貫した挙動を保証
  - 完全なスタイリング制御
- フォーム送信は hidden input で対応

## 8. Visual Design

### 状態表現（WCAG 1.4.1準拠 - 色だけに依存しない）

```
Unchecked:  ○     空の円
Checked:    ●     塗りつぶされた円
Disabled:   グレーアウト + 不透明度
```

### Forced Colors Mode 対応

- `forced-colors: active` でシステムカラー使用
- `CanvasText`, `Canvas`, `Highlight` 等

## 9. Test Checklist

### High Priority: APG ARIA Attributes

- [ ] コンテナに `role="radiogroup"` がある
- [ ] 各ラジオに `role="radio"` がある
- [ ] `aria-checked` 属性がある
- [ ] 選択中は `aria-checked="true"`、非選択は `aria-checked="false"`
- [ ] グループにアクセシブルネーム（`aria-label` or `aria-labelledby`）
- [ ] 各ラジオにアクセシブルネーム
- [ ] disabled で `aria-disabled="true"`
- [ ] `aria-orientation` は horizontal 時のみ設定（vertical はデフォルト）

### High Priority: APG Keyboard Interaction

- [ ] Tab でグループに入る（選択中 or 最初のラジオにフォーカス）
- [ ] Tab/Shift+Tab でグループから出る
- [ ] Space で選択
- [ ] Space は選択解除しない（既に選択済みでも変化なし）
- [ ] ArrowDown で次に移動＆選択
- [ ] ArrowRight で次に移動＆選択
- [ ] ArrowUp で前に移動＆選択
- [ ] ArrowLeft で前に移動＆選択
- [ ] Home で最初に移動＆選択
- [ ] End で最後に移動＆選択
- [ ] 矢印キーでラップする（最後→最初、最初→最後）
- [ ] disabled ラジオは矢印キーでスキップ
- [ ] disabled ラジオは Space で選択できない
- [ ] disabled ラジオはクリックで選択できない

### High Priority: Focus Management (Roving Tabindex)

- [ ] 選択中のラジオは `tabindex="0"`
- [ ] 非選択のラジオは `tabindex="-1"`
- [ ] disabled のラジオは `tabindex="-1"`
- [ ] 何も選択されていない場合、最初の有効なラジオが `tabindex="0"`
- [ ] グループ内で `tabindex="0"` は常に1つだけ
- [ ] Tab でグループに入ると正しいラジオにフォーカス

### High Priority: Selection Behavior

- [ ] クリックで選択が変わる
- [ ] 他のラジオをクリックで以前の選択が解除
- [ ] `aria-checked` がクリック/Space/矢印キーで更新される

### Medium Priority: Form Integration

- [ ] hidden input が存在する（フォーム送信用）
- [ ] hidden input の `name` 属性が正しい
- [ ] hidden input の `value` が選択値を反映

### Medium Priority: Accessibility

- [ ] axe-core で WCAG 2.1 AA 違反なし
- [ ] 色だけでなくアイコンで状態を区別

### Low Priority: Props & Behavior

- [ ] `orientation="horizontal"` で `aria-orientation="horizontal"` が設定
- [ ] `orientation="vertical"` または未指定で `aria-orientation` なし
- [ ] `defaultValue` で初期選択
- [ ] `onValueChange` コールバックが発火
- [ ] `className` がコンテナに適用

## 10. Implementation Steps (TDD)

### Step 1: Test First - React

1. `RadioGroup.test.tsx` - APG準拠テストを先に作成（RED）
   - DOM State テスト
   - Keyboard テスト
   - Label & Form テスト
   - Focus Management テスト
   - axe-core テスト
2. `RadioGroup.tsx` - テストが通るよう実装（GREEN）
3. リファクタリング（REFACTOR）

### Step 2: Documentation

1. `llm.md` - AI実装ガイド
2. `NativeHtmlNotice.astro` - ネイティブHTML推奨
3. `AccessibilityDocs.astro` - ARIA仕様
4. `TestingDocs.astro` - テストドキュメント

### Step 3: Test First - Vue

1. `RadioGroup.vue` - 実装（React テストを参考に）

### Step 4: Test First - Svelte

1. `RadioGroup.svelte` - 実装

### Step 5: Test First - Astro (Web Components)

1. `RadioGroup.astro` - Web Components 実装

### Step 6: スタイル（CSS）

1. `.apg-radio-group` 関連のスタイル定義
2. Forced Colors Mode 対応
3. 各状態のビジュアル確認

### Step 7: Pages

1. React page (`src/pages/patterns/radio-group/react/index.astro`)
2. Vue, Svelte, Astro pages
3. index.astro (リダイレクト)

## 11. CSS Classes

```css
.apg-radio-group        /* Container (fieldset or div) */
.apg-radio-group-legend /* Legend/label */
.apg-radio              /* Individual radio container */
.apg-radio-input        /* Visually hidden native input */
.apg-radio-control      /* Visual circle */
.apg-radio-label        /* Label text */
```

### Hidden Input の実装方法

Checkbox と同様の手法:

```css
.apg-radio-input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.apg-radio-input:focus-visible + .apg-radio-control {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}
```

## 12. Demo Scenarios

### Basic Demo

```tsx
<RadioGroup
  name="color"
  aria-label="Favorite color"
  options={[
    { id: 'red', label: 'Red', value: 'red' },
    { id: 'blue', label: 'Blue', value: 'blue' },
    { id: 'green', label: 'Green', value: 'green' },
  ]}
/>
```

### With Default Value

```tsx
<RadioGroup
  name="size"
  aria-label="T-shirt size"
  defaultValue="medium"
  options={[
    { id: 'small', label: 'Small', value: 'small' },
    { id: 'medium', label: 'Medium', value: 'medium' },
    { id: 'large', label: 'Large', value: 'large' },
  ]}
/>
```

### Horizontal Layout

```tsx
<RadioGroup
  name="rating"
  aria-label="Rating"
  orientation="horizontal"
  options={[
    { id: 'r1', label: '1', value: '1' },
    { id: 'r2', label: '2', value: '2' },
    { id: 'r3', label: '3', value: '3' },
  ]}
/>
```

### With Disabled Option

```tsx
<RadioGroup
  name="plan"
  aria-label="Subscription plan"
  options={[
    { id: 'free', label: 'Free', value: 'free' },
    { id: 'pro', label: 'Pro', value: 'pro' },
    { id: 'enterprise', label: 'Enterprise (Coming Soon)', value: 'enterprise', disabled: true },
  ]}
/>
```

## 13. References

- [WAI-ARIA APG: Radio Group Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/radio/)
- [MDN: input type="radio"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio)
- [W3C ARIA: radiogroup role](https://w3c.github.io/aria/#radiogroup)
- [W3C ARIA: radio role](https://w3c.github.io/aria/#radio)

## 14. Differences from Checkbox

| Aspect              | Checkbox                    | Radio Group                  |
| ------------------- | --------------------------- | ---------------------------- |
| Selection           | 複数選択可                  | 1つのみ選択（相互排他）       |
| Keyboard (Arrow)    | 使用しない                  | フォーカス移動＆選択変更      |
| Keyboard (Space)    | トグル                      | 選択（非選択にはならない）    |
| Tab behavior        | 各 checkbox にフォーカス    | グループで1つのみ（Roving）   |
| Wrap                | N/A                         | 最後→最初、最初→最後         |
| Mixed state         | あり (indeterminate)        | なし                         |

---

## Estimated Deliverables

### Phase 1 (TDD順序)

1. [ ] `RadioGroup.test.tsx` - React tests (RED)
2. [ ] `RadioGroup.tsx` - React component (GREEN)
3. [ ] `llm.md` - AI implementation guide
4. [ ] `NativeHtmlNotice.astro` - Native HTML notice
5. [ ] `AccessibilityDocs.astro` - Accessibility documentation
6. [ ] `TestingDocs.astro` - Testing documentation
7. [ ] `RadioGroup.vue` - Vue component
8. [ ] `RadioGroup.svelte` - Svelte component
9. [ ] `RadioGroup.astro` - Astro Web Component
10. [ ] CSS styles
11. [ ] 4 page files (React/Vue/Svelte/Astro) + index.astro
12. [ ] README update
