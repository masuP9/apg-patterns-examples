# Pattern Page Template

このテンプレートは、APG パターンページの構成を統一するためのガイドラインです。

## 章構成 (tocItems)

```typescript
const tocItems = [
  { id: 'demo', text: 'Demo' },
  { id: 'accessibility-features', text: 'Accessibility Features' },
  { id: 'source-code', text: 'Source Code' },
  { id: 'usage', text: 'Usage' },
  { id: 'api', text: 'API' },
  { id: 'testing', text: 'Testing' },
  { id: 'resources', text: 'Resources' },
];
```

## 章の説明

### 1. Demo
- コンポーネントの実際の動作を確認できるインタラクティブなデモ
- 複数のバリエーションがある場合は小見出しで分割

### 2. Accessibility Features
- `AccessibilityDocs.astro` コンポーネントを使用
- WAI-ARIA Roles, States/Properties, Keyboard Support を含む
- ネイティブ HTML 要素がある場合は "Native HTML Considerations" セクションを含める

### 3. Source Code
- `CodeBlock` コンポーネントで実装コードを表示
- `collapsible collapsedLines={5}` で折りたたみ表示

### 4. Usage
- 基本的な使用例をコードブロックで表示
- 複数のユースケースがある場合は含める

### 5. API
- Props テーブル
- Events/Emits テーブル（該当する場合）
- TypeScript インターフェース

### 6. Testing
- `TestingDocs.astro` コンポーネントを使用
- テストカテゴリ（Keyboard, ARIA, Focus Management, Accessibility）
- テストツールへのリンク

### 7. Resources
- WAI-ARIA APG パターンへのリンク
- AI Implementation Guide (llm.md) へのリンク

## ヘッダー構成

```astro
<header class="mb-8">
  <h1 class="mb-4 text-3xl font-bold">{Pattern Name}</h1>
  <p class="text-muted-foreground text-lg">{Short description}</p>
  <a
    href="/patterns/{pattern}/llm.md"
    target="_blank"
    rel="noopener noreferrer"
    class="mt-4 inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
  >
    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"></path>
      <path d="M12 12v8"></path>
      <path d="M8 16h8"></path>
    </svg>
    AI Implementation Guide
  </a>
</header>
```

## セクション ID 命名規則

- `demo` - デモセクション
- `accessibility-features` - アクセシビリティセクション（"accessibility" ではない）
- `testing` - テストセクション
- `source-code` - ソースコードセクション
- `usage` - 使用例セクション
- `api` - API リファレンスセクション
- `resources` - リソースセクション

## 特殊なセクション

一部のパターンでは追加セクションが必要な場合があります：

- **Native HTML Considerations**: ネイティブ HTML 要素が推奨されるパターン（disclosure, checkbox, radio など）
  - `accessibility-features` の前に配置
  - ID: `native-html`

## チェックリスト

新しいパターンページを作成する際：

- [ ] tocItems が正しい順序になっている
- [ ] 全セクションの ID が命名規則に従っている
- [ ] AccessibilityDocs.astro が作成されている
- [ ] TestingDocs.astro が作成されている
- [ ] llm.md が作成されている
- [ ] ヘッダーに AI Implementation Guide リンクがある
- [ ] Resources に llm.md へのリンクがある
