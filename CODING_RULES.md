# コーディングルール

このドキュメントは、APG Patterns Examples プロジェクトのコーディングスタイル規約を定義します。

---

## コードフォーマット規則

Prettier を使用。コード生成時は以下のルールに従うこと:

| ルール           | 設定値    | 例                                  |
| ---------------- | --------- | ----------------------------------- |
| セミコロン       | あり      | `const x = 1;`                      |
| クォート         | シングル  | `'string'`（JSX内は `"string"`）    |
| インデント       | 2スペース | -                                   |
| 末尾カンマ       | ES5       | `{ a: 1, b: 2, }` / `[1, 2, 3,]`    |
| 行幅             | 100文字   | 超える場合は改行                    |
| Tailwind CSS順序 | 自動整列  | `prettier-plugin-tailwindcss` 使用  |

**JSX/TSX での注意点**:

```tsx
// ✅ 正しい
import { useState } from 'react';

const Component = ({ label }: Props) => {
  const [open, setOpen] = useState(false);
  return <button className="px-4 py-2">{label}</button>;
};

// ❌ 間違い（ダブルクォート、セミコロンなし）
import { useState } from "react"
```

**オブジェクト/配列**:

```typescript
// ✅ 末尾カンマあり
const items = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
];

// ❌ 末尾カンマなし
const items = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' }
];
```

**三項演算子のネスト禁止**:

三項演算子のネストは可読性が低下するため、if 文や早期リターンを使用すること。

```typescript
// ❌ ネストした三項演算子（読みにくい）
const value = a ? a : b ? c : undefined;

// ✅ 早期リターンを使った関数（読みやすい）
const getValue = () => {
  if (a) return a;
  if (b) return c;
  return undefined;
};
const value = getValue();

// ✅ Vue computed / Svelte $derived.by でも同様
const value = computed(() => {
  if (a) return a;
  if (b) return c;
  return undefined;
});
```

---

## コードスタイル規約

### 1. アーリーリターンの徹底

条件分岐はアーリーリターンを使用してネストを浅く保つ。処理を続行できない条件を先に弾くことで、メインロジックのインデントを減らし可読性を向上させる。

```typescript
// ❌ ネストが深く、メインロジックが埋もれている
function openPopup(focusPosition?: 'first' | 'last') {
  if (!isOpen) {
    valueBeforeOpen = inputValue;
    isOpen = true;

    if (focusPosition) {
      if (enabledOptions.length > 0) {
        const targetOption = focusPosition === 'first'
          ? enabledOptions[0]
          : enabledOptions[enabledOptions.length - 1];
        activeIndex = filteredOptions.findIndex((o) => o.id === targetOption.id);
      }
    }
  }
}

// ✅ アーリーリターンでフラットに
function openPopup(focusPosition?: 'first' | 'last') {
  if (isOpen) {
    return;
  }

  valueBeforeOpen = inputValue;
  isOpen = true;

  if (!focusPosition || enabledOptions.length === 0) {
    return;
  }

  const targetOption = focusPosition === 'first'
    ? enabledOptions[0]
    : enabledOptions[enabledOptions.length - 1];
  const { id: targetId } = targetOption;
  activeIndex = filteredOptions.findIndex(({ id }) => id === targetId);
}
```

### 2. プロパティアクセスの低減

同じオブジェクトのプロパティに繰り返しアクセスする場合、分割代入や変数への代入で冗長なアクセスを減らす。コードの簡潔さと可読性が向上する。

**関数の引数で分割代入**:

```typescript
// ❌ option.xxx と繰り返しアクセス
function selectOption(option: ComboboxOption) {
  if (option.disabled) return;
  internalSelectedId = option.id;
  updateInputValue(option.label);
  onSelect(option);
}

// ✅ 引数で分割代入し、プロパティに直接アクセス
function selectOption({ id, label, disabled }: ComboboxOption) {
  if (disabled) {
    return;
  }

  internalSelectedId = id;
  updateInputValue(label);
  onSelect({ id, label, disabled });
}
```

**コールバック関数で分割代入**:

```typescript
// ❌ option.label, o.id と繰り返しアクセス
const filtered = options.filter((option) =>
  option.label.toLowerCase().includes(inputValue.toLowerCase())
);
const index = options.findIndex((o) => o.id === targetId);

// ✅ 必要なプロパティだけ取り出す
const filtered = options.filter(({ label }) =>
  label.toLowerCase().includes(inputValue.toLowerCase())
);
const index = options.findIndex(({ id }) => id === targetId);
```

**イベントオブジェクト**:

```typescript
// ❌ event.key, event.altKey と繰り返しアクセス
function handleKeyDown(event: KeyboardEvent) {
  switch (event.key) {
    case 'ArrowDown':
      if (event.altKey) { /* ... */ }
      break;
    case 'ArrowUp':
      if (event.altKey) { /* ... */ }
      break;
  }
}

// ✅ 先に取り出しておく
function handleKeyDown(event: KeyboardEvent) {
  const { key, altKey } = event;

  switch (key) {
    case 'ArrowDown':
      if (altKey) { /* ... */ }
      break;
    case 'ArrowUp':
      if (altKey) { /* ... */ }
      break;
  }
}
```

**Vue の ref**:

```typescript
// ❌ containerRef.value を繰り返しアクセス
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    closePopup();
  }
};

// ✅ 変数に取り出してからチェック
const handleClickOutside = (event: MouseEvent) => {
  const { value: container } = containerRef;

  if (container === undefined) {
    return;
  }

  if (!container.contains(event.target as Node)) {
    closePopup();
  }
};
```

### 3. 計算結果の再利用

同じ計算結果を複数回使用する場合、変数に保存して再利用する。

```tsx
// ✅ Good: 計算結果を変数に保存
paginatedUsers.map(({ id, name }) => {
  const isSelected = selectedIds.has(id)
  return (
    <TableRow
      key={id}
      aria-selected={isSelected}
      data-state={isSelected ? 'selected' : undefined}
    >
      <Checkbox checked={isSelected} aria-label={`${name}を選択`} />
    </TableRow>
  )
})

// ❌ Bad: 同じ計算を繰り返す
paginatedUsers.map(({ id, name }) => (
  <TableRow
    key={id}
    aria-selected={selectedIds.has(id)}
    data-state={selectedIds.has(id) ? 'selected' : undefined}
  >
    <Checkbox checked={selectedIds.has(id)} aria-label={`${name}を選択`} />
  </TableRow>
))
```

### 4. 肯定的な条件式

条件分岐では否定形（`!` や `not`）より肯定形を優先する。否定形は脳内での変換を強いるため認知負荷が高く、二重否定は特に読みづらい。

**if-else文では肯定形を優先**:

```typescript
// ❌ 否定形が先（読みづらい）
if (!isUserLoggedIn) {
  showLoginPrompt();
} else {
  showDashboard();
}

// ✅ 肯定形が先（読みやすい）
if (isUserLoggedIn) {
  showDashboard();
} else {
  showLoginPrompt();
}
```

**変数名・関数名は肯定的に**:

```typescript
// ❌ 否定的な名前（二重否定を招きやすい）
const isInvalid = !validate(input);
const isNotVisible = element.hidden;
if (!isInvalid) { /* ... */ }  // 二重否定で混乱

// ✅ 肯定的な名前
const isValid = validate(input);
const isVisible = !element.hidden;
if (isValid) { /* ... */ }  // 明快
```

**アーリーリターンとの使い分け**:

アーリーリターン（ガード節）では、例外的なケースを「弾く」目的で否定形を使うのは正当。通常の if-else 分岐では肯定形を優先する。

```typescript
// ✅ アーリーリターンでは否定形OK（例外を弾く目的）
function processData(data: Data | null) {
  if (!data) {
    return;
  }
  // メイン処理
}

// ✅ if-else分岐では肯定形を優先
function renderContent(isLoading: boolean) {
  if (isLoading) {
    return <Spinner />;
  }
  return <Content />;
}
```

**指針**:

- コード内の `!` の出現回数を減らすことを意識する
- 変数名に `no` や `not` を含めない（`noData` → `hasData`）
- 否定的な状態を管理する場合は列挙型を検討（`Status.Disabled`）

---

## TypeScript型アサーション制限

### 基本方針

- **型アサーション（`as`）の使用は最小限に抑制**
- 適切な型定義とランタイム型チェックで型安全性を確保

### 禁止事項

```typescript
// ❌ 避けるべきパターン
const data = response.json() as MyType;
const element = document.getElementById('id') as HTMLElement;
const config = { ...defaultConfig } as Config;
```

### 推奨パターン

#### 1. Type Guard Functions

```typescript
// ✅ 推奨: ランタイム型チェック
function isMyType(data: unknown): data is MyType {
  return typeof data === 'object' && data !== null && 'requiredProp' in data;
}

const data: unknown = response.json();
if (isMyType(data)) {
  // data は MyType として扱える
}
```

#### 2. Safe Access Helpers

```typescript
// ✅ 推奨: 安全なアクセス関数
function getCodeForTab(code: FrameworkCode | null, tab: CodeTab): string {
  if (!code) return '';
  return code[tab] || '';
}
```

#### 3. Proper Type Definitions

```typescript
// ✅ 推奨: 適切な型定義
interface FrameworkCode {
  component: string;
  styles?: string;
  usage?: string;
}
```

### DOM API の適切な処理

```typescript
// ❌ 避けるべき: 型アサーションによる強制変換
const element = document.getElementById('my-id') as HTMLElement;

// ✅ 推奨: instanceof チェックによる型ガード
const element = document.getElementById('my-id');
if (element instanceof HTMLInputElement) {
  // HTMLInputElement として安全に使用
  element.value = 'new value';
} else if (element instanceof HTMLButtonElement) {
  // HTMLButtonElement として安全に使用
  element.disabled = true;
} else if (element) {
  // 汎用的な HTMLElement として使用
  element.className = 'active';
} else {
  // 要素が存在しない場合の処理
  console.warn('Element not found');
}

// ✅ 推奨: より具体的な型ガード関数
function isInputElement(element: Element | null): element is HTMLInputElement {
  return element instanceof HTMLInputElement;
}

const element = document.getElementById('my-input');
if (isInputElement(element)) {
  element.value = 'safe access';
}
```

### 例外的に許可される場合

1. **外部ライブラリ**: 型定義が不完全な場合
2. **レガシーコード**: 段階的移行中

```typescript
// ✅ 例外: 外部ライブラリ（型改善予定をコメント）
const config = thirdPartyLib.getConfig() as Config; // TODO: 型定義改善待ち
```

### ESLintルール

```javascript
// .eslintrc.js
"@typescript-eslint/consistent-type-assertions": ["error", {
  "assertionStyle": "as",
  "objectLiteralTypeAssertions": "never"
}],
"@typescript-eslint/no-unnecessary-type-assertion": "error"
```

### 対策手順

1. **型定義の改善**: 完全な型定義を作成
2. **Type Guard実装**: ランタイム型チェック関数
3. **Safe Helper作成**: 安全なアクセス関数
4. **ESLint設定**: 型アサーション制限ルール
5. **コードレビュー**: 型アサーション使用の正当性確認

---

## Astro `set:html` ディレクティブ

### HTML要素に `set:html` を直接使わない — `<Fragment>` を使う

`set:html` は `<Fragment>` でのみ使用し、HTML要素には直接付けない。

**理由**: `prettier-plugin-astro` は `set:html` を持つ空要素を自動的に自己閉じタグに変換する。自己閉じの非void要素はコンテンツがレンダリングされないため、Prettier を実行するだけでコンテンツが消失する。

```astro
<!-- ❌ HTML要素に set:html を直接使用 -->
<!-- Prettier が <td set:html={content} /> に変換 → コンテンツ消失 -->
<td set:html={content}></td>
<p class="note" set:html={htmlString}></p>

<!-- ✅ Fragment パターン（Prettier の影響を受けない） -->
<td><Fragment set:html={content} /></td>
<p class="note"><Fragment set:html={htmlString} /></p>
```

**例外** — 以下の要素には `set:html` を直接使用できる:
- `<Fragment>` — 自己閉じで正常動作する
- PascalCase コンポーネント — フレームワークコンポーネント
- `<script>` / `<style>` — Astro の特殊要素

カスタム ESLint ルール `local/no-set-html-on-self-closing` が違反を検出し、autofix で Fragment パターンに変換する。

---

## その他のルール

### Import順序

- React hooks は先頭でアルファベット順
- 外部ライブラリ → 内部モジュール → 相対パス

### Error Handling

- `console.error` 使用時は ESLint disable コメント必須
- Promise の未処理は `void` オペレータで明示

### アクセシビリティ

- ARIA属性の適切な使用
- キーボードナビゲーション対応必須
- スクリーンリーダー対応
