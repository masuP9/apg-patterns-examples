# コーディングルール

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
  return typeof data === 'object' && 
         data !== null && 
         'requiredProp' in data;
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
  if (!code) return "";
  return code[tab] || "";
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