# Checkbox Pattern Implementation Plan

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

## 1. Overview

Checkboxパターンを4つのフレームワーク（React, Vue, Svelte, Astro）で実装する。
APGでは2種類のチェックボックスをサポート：

- **Dual-state (2状態)**: checked / not checked
- **Tri-state (3状態)**: checked / not checked / mixed（親グループ用）

## 2. Implementation Scope

### Phase 1: Basic Checkbox (MVP)

- 単体の2状態チェックボックス
- 4フレームワーク対応
- APG準拠テスト

### Phase 2: Checkbox Group with Mixed State

- 親チェックボックス（mixed状態対応）
- 子チェックボックスグループ
- 全選択/全解除の連動

## 3. File Structure

```
src/patterns/checkbox/
├── Checkbox.tsx              # React implementation
├── Checkbox.vue              # Vue implementation
├── Checkbox.svelte           # Svelte implementation
├── Checkbox.astro            # Astro (Web Components)
├── AccessibilityDocs.astro   # ARIA docs
├── NativeHtmlNotice.astro    # Native HTML recommendation
├── TestingDocs.astro         # Testing documentation
├── llm.md                    # AI implementation guide
├── Checkbox.test.tsx         # React tests
├── Checkbox.test.vue.ts      # Vue tests
├── Checkbox.test.svelte.ts   # Svelte tests
├── CheckboxMixedDemo.tsx     # React: Mixed state demo (Phase 2)
├── CheckboxMixedDemo.vue     # Vue: Mixed state demo (Phase 2)
├── CheckboxMixedDemo.svelte  # Svelte: Mixed state demo (Phase 2)
└── CheckboxMixedDemo.astro   # Astro: Mixed state demo (Phase 2)

src/pages/patterns/checkbox/
├── index.astro               # Redirect to react/
├── react/index.astro
├── vue/index.astro
├── svelte/index.astro
└── astro/index.astro

src/content/patterns/
├── checkbox.json             # Pattern metadata (日英)
```

## 4. ARIA Requirements

### A. ネイティブ `<input type="checkbox">` の場合

ネイティブ要素を使用する場合、`role` や `aria-checked` は**不要**。ブラウザが自動的に適切なセマンティクスを提供する。

| 属性/プロパティ    | 用途                          | 備考                          |
| ------------------ | ----------------------------- | ----------------------------- |
| `checked`          | チェック状態                  | HTML属性 or DOMプロパティ     |
| `indeterminate`    | 混合状態                      | **JSでのみ設定可能**（属性なし）|
| `disabled`         | 無効状態                      | HTML属性                      |
| `<label>`          | アクセシブルネーム            | for属性 or 入れ子             |

```html
<!-- ネイティブの推奨パターン -->
<label>
  <input type="checkbox" name="agree" />
  I agree to the terms
</label>
```

### B. カスタム `role="checkbox"` の場合

カスタム要素で実装する場合のみ、以下のARIA属性が必要。

#### Roles

| Role       | Element               | Description                |
| ---------- | --------------------- | -------------------------- |
| `checkbox` | div/span/button       | Checkbox widget            |
| `group`    | Container (for group) | Groups related checkboxes  |

#### States

| Attribute      | Element  | Values                      | Required | Change Trigger |
| -------------- | -------- | --------------------------- | -------- | -------------- |
| `aria-checked` | checkbox | `true` / `false` / `mixed`  | Yes      | Click, Space   |
| `aria-disabled`| checkbox | `true`                      | No       | Prop change    |

#### Properties

| Attribute          | Element  | Purpose                          |
| ------------------ | -------- | -------------------------------- |
| `aria-label`       | checkbox | Invisible accessible name        |
| `aria-labelledby`  | checkbox | Reference to external label      |
| `aria-describedby` | checkbox | Reference to description         |

### C. グループのアクセシブルネーム要件

チェックボックスグループには必ずアクセシブルネームが必要：

**Option 1: ネイティブ `<fieldset>` + `<legend>`（推奨）**
```html
<fieldset>
  <legend>Select toppings</legend>
  <label><input type="checkbox" /> Cheese</label>
  <label><input type="checkbox" /> Pepperoni</label>
</fieldset>
```

**Option 2: `role="group"` + `aria-labelledby`**
```html
<div role="group" aria-labelledby="group-label">
  <span id="group-label">Select toppings</span>
  <!-- checkboxes -->
</div>
```

## 5. Keyboard Support

| Key     | Action                          |
| ------- | ------------------------------- |
| `Space` | Toggle checkbox state           |
| `Tab`   | Move focus to next focusable    |

### 注意事項

- **Enterキー**: チェックボックスでは**非対応**（Switchとの違い）
- **`<button>` ベースの場合**: ブラウザはEnterでもclickを発火するため、Enterを抑止するか許容するかを決める必要がある
  - 本実装: ネイティブinputベースのため、この問題は発生しない

## 5.1 Mixed状態の遷移ルール

APGに基づく`mixed`状態の挙動：

```
┌─────────────────────────────────────────────────────┐
│ Mixed状態のチェックボックスをSpace操作した場合      │
│                                                     │
│   mixed → checked (true)                            │
│                                                     │
│ ※ false には直接遷移しない                         │
│ ※ 再度Spaceで unchecked に遷移                     │
└─────────────────────────────────────────────────────┘
```

### 親子連動ルール（Phase 2）

| 子の状態           | 親の状態  |
| ------------------ | --------- |
| 全てchecked        | checked   |
| 全てunchecked      | unchecked |
| 一部checked        | mixed     |

| 親の操作           | 子への影響                |
| ------------------ | ------------------------- |
| 親をcheck          | 全ての子をchecked         |
| 親をuncheck        | 全ての子をunchecked       |
| 親がmixedでSpace   | 全ての子をchecked         |

### ネイティブ input の indeterminate

```javascript
// ネイティブの場合、indeterminateはJSプロパティでのみ設定
const checkbox = document.querySelector('input[type="checkbox"]');
checkbox.indeterminate = true;

// ユーザー操作で自動的にfalseになる
// → checked または unchecked のどちらかに遷移
```

## 6. Native HTML Considerations

### 推奨: ネイティブ `<input type="checkbox">`

```html
<label>
  <input type="checkbox" name="agree" />
  I agree to the terms
</label>
```

### カスタム実装が必要なケース

| Use Case                    | Native | Custom |
| --------------------------- | ------ | ------ |
| 基本的なフォーム入力        | ✅ 推奨 | 不要   |
| JavaScriptなし動作          | ✅ 動作 | 要フォールバック |
| indeterminate (mixed) 状態  | 制限あり* | ✅ 完全制御 |
| カスタムスタイリング        | 制限あり | ✅ 完全制御 |
| 複雑なアニメーション        | 困難   | ✅ 完全制御 |

*ネイティブの `indeterminate` はJSでのみ設定可能、HTML属性では不可

## 7. Component API Design

### React

```typescript
export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  /** Initial checked state */
  initialChecked?: boolean;
  /** Indeterminate (mixed) state */
  indeterminate?: boolean;
  /** Checkbox label */
  children?: React.ReactNode;
  /** Callback when state changes */
  onCheckedChange?: (checked: boolean) => void;
}
```

### 実装アプローチの選択

**Option A: ネイティブ `<input type="checkbox">` ベース**
- Pros: フォーム送信対応、ブラウザ機能活用
- Cons: スタイリング制約

**Option B: `<button role="checkbox">` ベース（Switchと同様）**
- Pros: 完全なスタイリング制御
- Cons: フォーム送信に追加対応必要

**選択: Option A（ネイティブベース）**
- 理由: Checkboxはフォーム要素として使われることが多い
- indeterminate 状態は ref で制御

## 8. Visual Design

### 状態表現（WCAG 1.4.1準拠 - 色だけに依存しない）

```
Unchecked:  [ ]     空のボックス
Checked:    [✓]     チェックマーク
Mixed:      [−]     ダッシュ/マイナス記号
Disabled:   グレーアウト + 不透明度
```

### Forced Colors Mode 対応

- `forced-colors: active` でシステムカラー使用
- `CanvasText`, `Canvas`, `Highlight` 等

## 9. Test Checklist

### A. ネイティブ `<input type="checkbox">` の場合

#### High Priority: DOM State

- [ ] `input[type="checkbox"]` が存在する
- [ ] `checked` プロパティが状態を反映
- [ ] クリックで `checked` がトグル
- [ ] `indeterminate` プロパティが設定可能（JSから）
- [ ] ユーザー操作で `indeterminate` が解除される
- [ ] `disabled` 属性で無効化

#### High Priority: Label & Form

- [ ] `<label>` でアクセシブルネームがある
- [ ] `name` 属性でフォーム送信に対応
- [ ] `value` 属性が正しく設定される

#### High Priority: Keyboard

- [ ] Space でトグル
- [ ] Tab でフォーカス移動
- [ ] disabled 時は Tab スキップ
- [ ] disabled 時は Space 無効

### B. カスタム `role="checkbox"` の場合

#### High Priority: ARIA

- [ ] `role="checkbox"` がある
- [ ] `aria-checked` 属性がある
- [ ] `aria-checked` が `true`/`false` でトグル
- [ ] mixed 状態で `aria-checked="mixed"`
- [ ] disabled で `aria-disabled="true"`
- [ ] アクセシブルネーム（`aria-label` or `aria-labelledby`）

#### High Priority: Keyboard

- [ ] Space でトグル
- [ ] Tab でフォーカス移動
- [ ] `tabindex="0"` がある
- [ ] disabled 時は `tabindex="-1"` または操作無効

### C. 共通

#### Medium Priority: Accessibility

- [ ] axe-core で WCAG 2.1 AA 違反なし
- [ ] 色だけでなくアイコンで状態を区別
- [ ] Forced Colors Mode で動作

#### Medium Priority: Group (Phase 2)

- [ ] 親チェックボックスが子の状態を反映
- [ ] 全選択 → 親 checked
- [ ] 全解除 → 親 unchecked
- [ ] 一部選択 → 親 mixed
- [ ] 親トグルで全子に影響
- [ ] mixed からの Space で全子 checked
- [ ] グループにアクセシブルネームがある

## 10. Implementation Steps (TDD)

### Step 1: Test First - React

1. `Checkbox.test.tsx` - APG準拠テストを先に作成（RED）
   - DOM State テスト
   - Keyboard テスト
   - Label & Form テスト
   - axe-core テスト
2. `Checkbox.tsx` - テストが通るよう実装（GREEN）
3. リファクタリング（REFACTOR）

### Step 2: Documentation

1. `llm.md` - AI実装ガイド（テスト仕様の参照元）
2. `NativeHtmlNotice.astro` - ネイティブHTML推奨
3. `AccessibilityDocs.astro` - ARIA仕様

### Step 3: Test First - Vue

1. `Checkbox.test.vue.ts` - テスト作成（RED）
2. `Checkbox.vue` - 実装（GREEN）
3. リファクタリング

### Step 4: Test First - Svelte

1. `Checkbox.test.svelte.ts` - テスト作成（RED）
2. `Checkbox.svelte` - 実装（GREEN）
3. リファクタリング

### Step 5: Test First - Astro (Web Components)

1. `Checkbox.test.astro.ts` - Web Componentクラスのテスト（RED）
   - MenuButton.test.astro.ts と同様のアプローチ
   - Web Componentクラスを抽出してDOMベースでテスト
   - jsdomの制約によりフォーカス系テストは限定的
2. `Checkbox.astro` - Web Components 実装（GREEN）
3. E2Eテスト（Playwright）で完全なキーボード/フォーカス検証

### Step 6: スタイル（CSS）

1. `.apg-checkbox` 関連のスタイル定義
2. Forced Colors Mode 対応
3. 各状態のビジュアル確認

### Step 7: Pages

1. React page (`src/pages/patterns/checkbox/react/index.astro`)
2. Vue, Svelte, Astro pages
3. Pattern metadata (`src/content/patterns/checkbox.json`)

### Step 8: Mixed State Demo (Phase 2)

1. `demos/MixedStateDemo.test.tsx` - デモ用テスト
2. `demos/MixedStateDemo.tsx` - mixed状態デモ
3. 各フレームワーク対応

## 11. CSS Classes

```css
.apg-checkbox           /* Container (<label>) */
.apg-checkbox-input     /* Visually hidden native input */
.apg-checkbox-control   /* Visual box */
.apg-checkbox-icon      /* Check/dash icon */
.apg-checkbox-label     /* Label text */
```

### Hidden Input の実装方法

**重要**: `display: none` や `visibility: hidden` は使用不可。
フォーカス可視・ラベル連携を保った「視覚的に隠す」手法を使用：

```css
.apg-checkbox-input {
  /* 視覚的に隠すが、フォーカス・操作は可能 */
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

/* フォーカス時にカスタムコントロールにスタイルを適用 */
.apg-checkbox-input:focus-visible + .apg-checkbox-control {
  outline: 2px solid var(--focus-ring-color);
  outline-offset: 2px;
}
```

## 12. Demo Scenarios

### Basic Demo

```tsx
<Checkbox>I agree to the terms</Checkbox>
<Checkbox initialChecked>Subscribe to newsletter</Checkbox>
<Checkbox disabled>Unavailable option</Checkbox>
```

### Mixed State Demo (Phase 2)

```tsx
// demos/MixedStateDemo.tsx
// ページに直接配置するデモ用コンポーネント

<MixedStateDemo />

// 内部構造:
// - 親Checkbox（全選択/全解除、mixed状態対応）
// - 子Checkbox × 3（Cheese, Pepperoni, Mushrooms）
// - 状態連動ロジックはデモ内に閉じる
```

## 13. References

- [WAI-ARIA APG: Checkbox Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/)
- [MDN: input type="checkbox"](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox)
- [W3C ARIA: checkbox role](https://w3c.github.io/aria/#checkbox)

## 14. Questions for Review

1. ネイティブ input ベースか button ベースか？→ ネイティブ input を選択
2. Phase 1 で Group も含めるか？→ Phase 2 に分離
3. indeterminate の props 名は `indeterminate` でよいか？

---

## Estimated Deliverables

### Phase 1 (TDD順序)

1. [ ] `Checkbox.test.tsx` - React tests (RED)
2. [ ] `Checkbox.tsx` - React component (GREEN)
3. [ ] `llm.md` - AI implementation guide
4. [ ] `NativeHtmlNotice.astro` - Native HTML notice
5. [ ] `AccessibilityDocs.astro` - Accessibility documentation
6. [ ] `Checkbox.test.vue.ts` - Vue tests (RED)
7. [ ] `Checkbox.vue` - Vue component (GREEN)
8. [ ] `Checkbox.test.svelte.ts` - Svelte tests (RED)
9. [ ] `Checkbox.svelte` - Svelte component (GREEN)
10. [ ] `Checkbox.test.astro.ts` - Astro Web Component tests (RED)
11. [ ] `Checkbox.astro` - Astro Web Component (GREEN)
12. [ ] CSS styles
13. [ ] 4 page files (React/Vue/Svelte/Astro)
14. [ ] Pattern metadata JSON

### Phase 2

15. [ ] `CheckboxMixedDemo.test.tsx` - Demo tests
16. [ ] `CheckboxMixedDemo.tsx` - React demo
17. [ ] `CheckboxMixedDemo.vue` - Vue demo
18. [ ] `CheckboxMixedDemo.svelte` - Svelte demo
19. [ ] `CheckboxMixedDemo.astro` - Astro demo
