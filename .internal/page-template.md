# Pattern Page Template

このテンプレートは、APG パターンページの構成を統一するためのガイドラインです。

## 章構成 (tocItems)

### 基本構成

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

### Native HTML セクションがある場合

ネイティブ HTML 要素が推奨されるパターンでは `native-html` を追加:

```typescript
const tocItems = [
  { id: 'demo', text: 'Demo' },
  { id: 'native-html', text: 'Native HTML' },  // Demo の直後
  { id: 'accessibility-features', text: 'Accessibility Features' },
  { id: 'source-code', text: 'Source Code' },
  { id: 'usage', text: 'Usage' },
  { id: 'api', text: 'API' },
  { id: 'testing', text: 'Testing' },
  { id: 'resources', text: 'Resources' },
];
```

**Native HTML セクションが必要なパターン:**
- Checkbox → `<input type="checkbox">`
- Radio Group → `<input type="radio">`
- Link → `<a href>`
- Table → `<table>`
- Meter → `<meter>`
- Spinbutton → `<input type="number">`

## 必須インポート

```typescript
import PatternLayout from '../../../../layouts/PatternLayout.astro';
import CodeBlock from '@/components/ui/CodeBlock.astro';
import ExternalLink from '@/components/ui/ExternalLink.astro';
import AiGuideBadge from '@/components/ui/AiGuideBadge.astro';
import AiGuideResourceItem from '@/components/ui/AiGuideResourceItem.astro';
import AccessibilityDocs from '@patterns/{pattern}/AccessibilityDocs.astro';
import TestingDocs from '@patterns/{pattern}/TestingDocs.astro';
import FrameworkTabs from '@/components/ui/FrameworkTabs.astro';
import { ResponsiveTable } from '@/components/ui/table';
import Heading from '@/components/ui/Heading.astro';
import sourceCode from '@patterns/{pattern}/{Component}.tsx?raw';
import testCode from '@patterns/{pattern}/{Component}.test.tsx?raw';

// Native HTML セクションがある場合のみ
import NativeHtmlNotice from '@patterns/{pattern}/NativeHtmlNotice.astro';
```

## 章の説明

### 1. Demo
- コンポーネントの実際の動作を確認できるインタラクティブなデモ
- 複数のバリエーションがある場合は `<h3>` 小見出しで分割
- デモごとに説明文を `<p class="text-muted-foreground mb-4 text-sm">` で追加

### 2. Native HTML（条件付き）
- `NativeHtmlNotice.astro` コンポーネントを使用
- ネイティブ HTML 要素の推奨とカスタム実装が必要なケースを説明

### 3. Accessibility Features
- `AccessibilityDocs.astro` コンポーネントを使用
- WAI-ARIA Roles, States/Properties, Keyboard Support を含む

### 4. Source Code
- `CodeBlock` コンポーネントで実装コードを表示
- `collapsible collapsedLines={5}` で折りたたみ表示

### 5. Usage
- 基本的な使用例をコードブロックで表示
- 複数のユースケースがある場合は含める

### 6. API
- Props テーブル（`ResponsiveTable` 使用）
- Events/Emits テーブル（該当する場合）
- TypeScript インターフェース（`CodeBlock` で表示）

### 7. Testing
- `TestingDocs.astro` コンポーネントを使用
- **テストコードブロックを必ず含める**（`<div class="mt-6">` でラップ）

### 8. Resources
- WAI-ARIA APG パターンへのリンク（`ExternalLink` 使用）
- MDN リファレンスへのリンク（該当する場合）
- `AiGuideResourceItem` コンポーネントで AI Guide リンクを追加

## ヘッダー構成

```astro
<header class="mb-8">
  <h1 class="mb-4 text-3xl font-bold">{Pattern Name}</h1>
  <p class="text-muted-foreground text-lg">
    {Short description}
  </p>
  <AiGuideBadge pattern="{pattern}" />
</header>
```

## セクション構成テンプレート

### Demo Section

```astro
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">Demo</Heading>
  <div class="border-border bg-background rounded-lg border p-6">
    <Component client:load />
  </div>
</section>
```

### Native HTML Section（条件付き）

```astro
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">Native HTML</Heading>
  <NativeHtmlNotice />
</section>
```

### Accessibility Features Section

```astro
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">Accessibility Features</Heading>
  <AccessibilityDocs />
</section>
```

### Source Code Section

```astro
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">Source Code</Heading>
  <CodeBlock collapsible collapsedLines={5} code={sourceCode} lang="tsx" title="{Component}.tsx" />
</section>
```

### Usage Section

```astro
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">Usage</Heading>
  <CodeBlock
    collapsible
    collapsedLines={5}
    code={`// Usage example here`}
    lang="tsx"
    title="Example"
  />
</section>
```

### API Section

```astro
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">API</Heading>
  <ResponsiveTable>
    <table class="w-full border-collapse">
      <thead>
        <tr class="border-border border-b">
          <th class="py-2 pr-4 text-left">Prop</th>
          <th class="py-2 pr-4 text-left">Type</th>
          <th class="py-2 pr-4 text-left">Default</th>
          <th class="py-2 text-left">Description</th>
        </tr>
      </thead>
      <tbody>
        <!-- Props rows -->
      </tbody>
    </table>
  </ResponsiveTable>
</section>
```

### Testing Section

```astro
<section class="mb-12">
  <Heading level={2} class="mb-4 text-xl font-semibold">Testing</Heading>
  <TestingDocs />
  <div class="mt-6">
    <CodeBlock
      collapsible
      collapsedLines={5}
      code={testCode}
      lang="tsx"
      title="{Component}.test.tsx"
    />
  </div>
</section>
```

### Resources Section

```astro
<section>
  <Heading level={2} class="mb-4 text-xl font-semibold">Resources</Heading>
  <ul class="list-disc space-y-2 pl-6">
    <li>
      <ExternalLink
        href="https://www.w3.org/WAI/ARIA/apg/patterns/{pattern}/"
        class="text-primary hover:underline"
      >
        WAI-ARIA APG: {Pattern Name} Pattern
      </ExternalLink>
    </li>
    <li>
      <ExternalLink
        href="https://developer.mozilla.org/en-US/docs/Web/..."
        class="text-primary hover:underline"
      >
        MDN: {Related Element/API}
      </ExternalLink>
    </li>
    <AiGuideResourceItem pattern="{pattern}" />
  </ul>
</section>
```

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

新しいパターンページを作成する際：

### 必須ファイル
- [ ] `src/patterns/{pattern}/{Component}.tsx` - React 実装
- [ ] `src/patterns/{pattern}/{Component}.vue` - Vue 実装
- [ ] `src/patterns/{pattern}/{Component}.svelte` - Svelte 実装
- [ ] `src/patterns/{pattern}/{Component}.astro` - Astro 実装
- [ ] `src/patterns/{pattern}/{Component}.test.tsx` - テストファイル
- [ ] `src/patterns/{pattern}/AccessibilityDocs.astro` - アクセシビリティドキュメント
- [ ] `src/patterns/{pattern}/TestingDocs.astro` - テストドキュメント
- [ ] `src/patterns/{pattern}/llm.md` - AI 向けガイド
- [ ] `src/patterns/{pattern}/NativeHtmlNotice.astro` - Native HTML 説明（該当パターンのみ）

### ページ構成
- [ ] tocItems が正しい順序になっている
- [ ] 全セクションの ID が命名規則に従っている
- [ ] ヘッダーに `AiGuideBadge` がある
- [ ] Testing セクションにテストコードブロックがある
- [ ] Resources に `AiGuideResourceItem` がある

### 4フレームワーク対応
- [ ] `src/pages/patterns/{pattern}/react/index.astro`
- [ ] `src/pages/patterns/{pattern}/vue/index.astro`
- [ ] `src/pages/patterns/{pattern}/svelte/index.astro`
- [ ] `src/pages/patterns/{pattern}/astro/index.astro`
- [ ] `src/pages/patterns/{pattern}/index.astro` - リダイレクト用
