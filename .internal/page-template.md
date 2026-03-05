# Pattern Page Template

このテンプレートは、APG パターンページの構成を統一するためのガイドラインです。

> **Note**: ページは動的ルーティング（`[pattern]/[framework]/index.astro`）で自動生成される。個別のページファイル作成は不要。新しいパターンを追加するには `meta.ts` と `DemoSection.astro` を作成すればよい。

## 章構成 (tocItems)

`meta.ts` の `tocItems` で定義する。

### 基本構成

```typescript
const tocItems = [
  { id: 'demo', text: { en: 'Demo', ja: 'デモ' } },
  { id: 'accessibility-features', text: { en: 'Accessibility Features', ja: 'アクセシビリティ機能' } },
  { id: 'source-code', text: { en: 'Source Code', ja: 'ソースコード' } },
  { id: 'usage', text: { en: 'Usage', ja: '使い方' } },
  { id: 'api', text: { en: 'API', ja: 'API' } },
  { id: 'testing', text: { en: 'Testing', ja: 'テスト' } },
  { id: 'resources', text: { en: 'Resources', ja: 'リソース' } },
];
```

### Native HTML セクションがある場合

ネイティブ HTML 要素が推奨されるパターンでは `native-html` を追加:

```typescript
const tocItems = [
  { id: 'demo', text: { en: 'Demo', ja: 'デモ' } },
  { id: 'native-html', text: { en: 'Native HTML', ja: 'ネイティブ HTML' } },  // Demo の直後
  // ...
];
```

**Native HTML セクションが必要なパターン:**
- Checkbox → `<input type="checkbox">`
- Radio Group → `<input type="radio">`
- Link → `<a href>`
- Table → `<table>`
- Meter → `<meter>`
- Spinbutton → `<input type="number">`

## 必要なファイル

動的ルーティングテンプレートが以下のファイルを `import.meta.glob()` で検出・読み込む:

| ファイル | 役割 | 検出パターン |
|---------|------|-------------|
| `meta.ts` | メタデータ定義 | `/src/patterns/*/meta.ts` |
| `DemoSection.astro` | デモ表示 | `/src/patterns/*/DemoSection.astro` |
| `TestingDocs.astro` | テスト解説 | `/src/patterns/*/TestingDocs.astro` |
| `{Component}.{tsx,vue,svelte,astro}` | ソースコード表示 | `/src/patterns/**/*.{tsx,vue,svelte,astro}` (`?raw`) |
| `{Component}.test.*` | テストコード表示 | `/src/patterns/**/*.test.*` (`?raw`) |
| `en.mdx` / `ja.mdx` | アクセシビリティ解説 | `src/content/accessibility-docs/{pattern}/` |

## 章の説明

### 1. Demo
- `DemoSection.astro` コンポーネントが `framework` prop に基づいて適切なフレームワーク実装を表示
- 複数のバリエーションがある場合は DemoSection 内で `<h3>` 小見出しで分割

### 2. Native HTML（条件付き）
- `NativeHtmlNotice.astro` コンポーネントを使用
- ネイティブ HTML 要素の推奨とカスタム実装が必要なケースを説明

### 3. Accessibility Features
- `src/content/accessibility-docs/{pattern}/{locale}.mdx` の内容を表示
- WAI-ARIA Roles, States/Properties, Keyboard Support を含む

### 4. Source Code
- `meta.ts` の `frameworks[framework].sourceFile` で指定されたファイルを `?raw` で読み込み表示
- `CodeBlock` コンポーネントで `collapsible collapsedLines={5}` で折りたたみ表示

### 5. Usage
- `meta.ts` の `frameworks[framework].usageCode` で定義されたコード例を表示

### 6. API
- `meta.ts` の `frameworks[framework].apiProps`, `apiEvents`, `apiSlots`, `apiSubComponents` から自動生成
- `ResponsiveTable` で表示

### 7. Testing
- `TestingDocs.astro` コンポーネントを使用
- テストコードブロックは `meta.ts` の `frameworks[framework].testFile` で指定

### 8. Resources
- `meta.ts` の `resources` で定義
- WAI-ARIA APG パターンへのリンク（`ExternalLink` 使用）
- MDN リファレンスへのリンク（該当する場合）

## セクション ID 命名規則

| ID | セクション |
|----|-----------|
| `demo` | デモセクション |
| `native-html` | Native HTML セクション（条件付き） |
| `accessibility-features` | アクセシビリティセクション |
| `source-code` | ソースコードセクション |
| `usage` | 使用例セクション |
| `api` | API リファレンスセクション |
| `testing` | テストセクション |
| `resources` | リソースセクション |

## チェックリスト

新しいパターンを追加する際：

### 必須ファイル
- [ ] `src/patterns/{pattern}/meta.ts` - パターンメタデータ（`PatternMeta` 型）
- [ ] `src/patterns/{pattern}/DemoSection.astro` - 全フレームワーク統合デモ
- [ ] `src/patterns/{pattern}/{Component}.tsx` - React 実装
- [ ] `src/patterns/{pattern}/{Component}.vue` - Vue 実装
- [ ] `src/patterns/{pattern}/{Component}.svelte` - Svelte 実装
- [ ] `src/patterns/{pattern}/{Component}.astro` - Astro 実装
- [ ] `src/patterns/{pattern}/{Component}.test.tsx` - テストファイル
- [ ] `src/patterns/{pattern}/TestingDocs.astro` - テストドキュメント
- [ ] `src/content/accessibility-docs/{pattern}/en.mdx` - アクセシビリティ解説（英語）
- [ ] `src/content/accessibility-docs/{pattern}/ja.mdx` - アクセシビリティ解説（日本語）
- [ ] `src/patterns/{pattern}/{pattern}.md` - AI 向けガイド
- [ ] `src/patterns/{pattern}/NativeHtmlNotice.astro` - Native HTML 説明（該当パターンのみ）

### meta.ts 構成確認
- [ ] `PatternMeta` 型に準拠している
- [ ] 全テキストが `Record<Locale, string>` で i18n 対応
- [ ] `tocItems` が正しい順序になっている
- [ ] 4フレームワーク分の `frameworks` メタデータが定義されている
- [ ] `resources` にAPG公式リンクが含まれている
