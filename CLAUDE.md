# CLAUDE.md - APG Patterns Examples Development Log

## プロジェクト概要

**APG Patterns Examples** は、WAI-ARIA Authoring Practices Guide (APG) のコンポーネントパターンを React、Svelte、Vue の3つのフレームワークで実装し、実際に動作するデモと詳細なコード解説を提供するプロジェクトです。

### プロジェクトの目標
- ✅ APG準拠のアクセシブルなコンポーネント実装
- ✅ フレームワーク間でのベストプラクティス比較
- ✅ プロダクション品質のコード品質
- 🚧 日英バイリンガル対応（企画中）
- ✅ GitHub Pages での自動デプロイ
- 🚧 MCP（Model Context Protocol）対応（企画中）

## 技術スタック

### フロントエンド
- **ドキュメントサイト**: Docusaurus v3 + TypeScript
- **デモアプリ**: React 18 + Svelte 4 + Vue 3
- **スタイリング**: Tailwind CSS + CSS Modules
- **シンタックスハイライト**: Prism.js（react-syntax-highlighter）

### インフラ・CI/CD
- **ホスティング**: GitHub Pages
- **CI/CD**: GitHub Actions
- **パッケージマネージャー**: npm

## アーキテクチャ設計

### ディレクトリ構成
```
apg-patterns-examples/
├── src/                          # Docusaurus メインサイト
│   ├── components/
│   │   ├── CodeViewer/           # コード表示コンポーネント
│   │   └── DemoTabs/             # デモ切り替えタブ
│   └── pages/                    # ドキュメントページ
├── demos/                        # フレームワーク別デモアプリ
│   ├── react/                    # React デモ (port:3001)
│   ├── svelte/                   # Svelte デモ (port:3002)
│   └── vue/                      # Vue デモ (port:3003)
├── static/
│   └── code/                     # コードパターンJSON
└── .github/workflows/            # CI/CDワークフロー
```

### コンポーネント設計思想

#### 1. HTML属性継承パターン
各フレームワークで一貫した属性継承を実装：

**React**:
```typescript
export interface ToggleButtonProps 
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'onKeyDown' | 'type' | 'aria-pressed'> {
  initialPressed?: boolean;
  onToggle?: (pressed: boolean) => void;
}
```

**Vue**:
```vue
<script setup>
defineOptions({ inheritAttrs: false })
</script>
<template>
  <button v-bind="$attrs">
</template>
```

**Svelte**:
```svelte
<button {...$$restProps}>
```

#### 2. アクセシビリティファースト設計
- `aria-pressed`属性による状態管理
- キーボードナビゲーション（Space/Enter）
- スクリーンリーダー対応
- フォーカス管理
- 高コントラストモード対応

## 主要実装詳細

### 1. CodeViewer コンポーネント

#### Docusaurus統合での課題と解決
**問題**: フェッチリクエストがJSONではなくHTMLを返す
```typescript
// 問題のあるコード
fetch('/code/toggleButton.json')

// 解決策: Docusaurus baseURL対応
import { useDocusaurusContext } from '@docusaurus/core/lib/client/exports/useDocusaurusContext';
const { siteConfig } = useDocusaurusContext();
const baseUrl = siteConfig.baseUrl || '/';
fetch(`${baseUrl}code/toggleButton.json`)
```

#### シンタックスハイライト実装
```typescript
import { Highlight, themes } from 'prism-react-renderer';

<Highlight
  theme={colorMode === "dark" ? themes.dracula : themes.github}
  code={currentCode[activeTab] || ""}
  language={getLanguage(activeTab, currentFramework.extension)}
>
  {({ className, style, tokens, getLineProps, getTokenProps }) => (
    <pre className={className} style={style}>
      {tokens.map((line, i) => (
        <div key={i} {...getLineProps({ line })}>
          {line.map((token, key) => (
            <span key={key} {...getTokenProps({ token })} />
          ))}
        </div>
      ))}
    </pre>
  )}
</Highlight>
```

#### アクセシブルなコピー機能
```typescript
// sr-only パターンでライブリージョン実装
<div 
  className={styles.copyFeedback}
  role="status" 
  aria-live="polite"
>
  {copyStatus}
</div>
```

```css
.copyFeedback {
  /* Screen reader only (sr-only approach) */
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
```

### 2. DemoTabs コンポーネント

#### 初回ローディング問題の解決
**問題**: キャッシュがない初回アクセス時にデモが表示されない

**解決策**: フレームワーク別ローディング状態管理
```typescript
const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
  () => frameworks.reduce((acc, framework) => ({ ...acc, [framework]: true }), {})
);

const handleIframeLoad = (framework: string) => {
  setLoadingStates((prev) => ({ ...prev, [framework]: false }));
  setErrorStates((prev) => ({ ...prev, [framework]: false }));
};
```

#### 環境別URL設定
```typescript
const baseUrl = process.env.NODE_ENV === "production"
  ? "https://masup9.github.io/apg-patterns-examples"
  : "http://localhost";

const demoUrls = {
  react: process.env.NODE_ENV === "production"
    ? `${baseUrl}/demos/react`
    : "http://localhost:3001",
  // ... 他のフレームワーク
};
```

### 3. ToggleButton コンポーネント

#### プロパティ設計の簡素化
不要なpropsを削除してHTML属性継承を活用：
- ❌ 削除: `description`, `size`, `variant` props
- ✅ 採用: HTML attributes inheritance pattern
- ✅ 保持: `initialPressed`, `onToggle` (コンポーネント固有の機能)

#### APG準拠のキーボードハンドリング
```typescript
const handleKeyDown = useCallback(
  (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === " " || event.key === "Enter") {
      event.preventDefault(); // スクロール防止
      handleClick();
    }
  },
  [handleClick]
);
```

## CI/CD パイプライン

### GitHub Actions ワークフロー設計

#### ビルド戦略
```yaml
- name: Build demos
  env:
    NODE_ENV: production
  run: |
    cd demos/react && npm run build && cd ../..
    cd demos/svelte && npm run build && cd ../..
    cd demos/vue && npm run build && cd ../..

- name: Copy demo builds to website
  run: |
    mkdir -p build/demos
    cp -r demos/react/dist build/demos/react
    cp -r demos/svelte/dist build/demos/svelte
    cp -r demos/vue/dist build/demos/vue
```

#### 環境別ベースURL設定
各フレームワークのVite設定で本番環境用のbaseURLを設定：

```typescript
// demos/react/vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? "/apg-patterns-examples/demos/react/" 
    : "/demos/react/",
});
```

## YAGNIによるコードベース簡素化

### 削除した過剰な実装
開発過程で「将来必要になるかも」という理由で実装した機能のうち、実際には使用されていないものを削除しました：

#### 1. 複雑なキャッシュシステム
**削除前**: 
- TTL付きキャッシュクラス
- 自動クリーンアップ機能
- 複雑なキャッシュインターフェース

**削除後**: 
- useCallbackによるシンプルなメモ化
- 必要最小限のフェッチロジック

#### 2. 未使用アクセシビリティユーティリティ
**削除したファイル**:
- `src/utils/accessibility.ts` - FocusManager、AriaHelper等
- `src/utils/keyboard.ts` - キーボードナビゲーション関数群

**理由**: React 18のuseId()や直接的なARIA属性で十分対応可能

#### 3. 未使用CSS
**削除**: 
- demo-container、pattern-metadata等の未使用クラス群
- 200行以上の推測実装CSS

**現状**: 実際に必要になったときに追加する方針

#### 4. 過剰な型定義
**削除**:
- CacheEntry、CodeCache等の複雑な型
- 使用されていないインターフェース

### YAGNIのメリット
1. **保守性向上**: 使わないコードの保守が不要
2. **理解しやすさ**: 実際に必要なコードのみが存在
3. **テストの簡素化**: テストすべき範囲が明確
4. **パフォーマンス**: 不要なバンドルサイズ削減

### 学んだこと
- 「将来使うかも」ではなく「今必要」で実装する
- React 18の標準機能（useId等）を活用する
- 実際の使用例が出てから実装する

## 学習ポイントと技術的知見

### 1. フレームワーク横断での統一パターン

#### 属性継承の実装比較
- **React**: `extends Omit<React.ButtonHTMLAttributes<...>, ...>`
- **Vue**: `defineOptions({ inheritAttrs: false })` + `v-bind="$attrs"`
- **Svelte**: `{...$restProps}`

#### 状態管理パターン
- **React**: `useState` + `useCallback`
- **Vue**: `ref` + `computed`
- **Svelte**: `let` + reactive statements (`$:`)

### 2. アクセシビリティ実装の統一

#### ARIA属性の一貫した使用
```typescript
// 全フレームワーク共通
aria-pressed={pressed}
role="button"
type="button"
```

#### キーボードイベントハンドリング
```typescript
// APG仕様準拠: Space/Enterキーでアクティベート
if (event.key === " " || event.key === "Enter") {
  event.preventDefault();
  handleClick();
}
```

### 3. Docusaurus + マルチフレームワーク統合

#### 静的アセット管理
- JSON形式でコードパターンを管理
- 動的インポートでランタイム読み込み
- baseURL考慮したフェッチ処理

#### iframe統合でのサンドボックス設定
```typescript
<iframe
  sandbox="allow-scripts allow-same-origin"
  title={`${framework} Demo`}
/>
```

### 4. CSS-in-JS vs CSS Modules設計判断

#### 採用理由
- **CSS Modules**: Docusaurus標準、スコープ化、型安全性
- **Tailwind**: デモアプリでの迅速な開発
- **CSS Custom Properties**: テーマ対応、フレームワーク横断

#### パフォーマンス考慮
```css
/* プリロード + レイジーローディング */
.demoIframe.hidden {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  position: absolute;
}
```

## 解決した技術的課題

### 1. Docusaurus ルーティング問題
**問題**: `/code/pattern.json` → HTMLレスポンス
**解決**: `useDocusaurusContext` でbaseURL取得

### 2. TypeScript Build エラー
**問題**: 未使用 React import
**解決**: `import React from 'react'` 削除（JSX Transform使用）

### 3. GitHub Pages 404エラー
**問題**: デモアプリアセットが見つからない
**解決**: 各フレームワークのbaseURL設定 + 適切なCopy処理

### 4. アクセシビリティツリー問題
**問題**: `visibility: hidden` でスクリーンリーダー非対応
**解決**: sr-onlyパターン実装

### 5. コード表示レイアウト崩れ
**問題**: `white-space: pre-wrap` での行折り返し
**解決**: `white-space: pre` で水平スクロール採用

## 今後の開発計画

### Phase 1: コンポーネント拡張
- [ ] Accordion パターン実装
- [ ] Dialog/Modal パターン
- [ ] Menu/Dropdown パターン
- [x] Tabs パターン

### Phase 2: 品質向上
- [ ] Jest/Vitest テストスイート
- [ ] Playwright E2Eテスト
- [ ] アクセシビリティ自動テスト
- [ ] パフォーマンス監視

### Phase 3: 多言語対応
- [ ] i18n インフラ構築
- [ ] 日本語ドキュメント作成
- [ ] 多言語コード例

### Phase 4: エコシステム統合
- [ ] MCP Server実装
- [ ] VS Code Extension
- [ ] npm パッケージ公開

## プロジェクト成果

### 技術的成果
- ✅ 3フレームワーク統一のコンポーネントAPI
- ✅ プロダクション品質のアクセシビリティ実装
- ✅ 自動デプロイ付きドキュメンテーション
- ✅ フレームワーク横断のベストプラクティス確立

### 学習成果
- Vue 3 Composition API の深い理解
- Svelte リアクティビティシステムの活用
- Docusaurus プラグインアーキテクチャ
- GitHub Actions CI/CD 設計
- アクセシビリティ実装パターン
- フレームワーク横断設計手法

### コミュニティ貢献
- APGパターンの実践的実装例
- フレームワーム間比較リソース
- アクセシビリティ教育素材

---

## 開発環境セットアップ

### 必要環境
- Node.js 18+
- npm

### ローカル開発
```bash
# メインサイト起動
npm install
npm start

# デモアプリ起動（並列）
cd demos/react && npm install && npm run dev &
cd demos/svelte && npm install && npm run dev &
cd demos/vue && npm install && npm run dev &
```

### ビルド・デプロイ
```bash
# 全体ビルド
npm run build

# デプロイ（main branch push で自動実行）
git push origin main
```

---

**プロジェクトURL**: https://masup9.github.io/apg-patterns-examples/
**リポジトリ**: https://github.com/masuP9/apg-patterns-examples

## 開発セッションの特徴

このプロジェクトは Claude Code との日本語での開発セッションで作成されました。

## ドキュメントページ構成パターン

### 統一されたページ構成
各APGパターンのドキュメントページは以下の構成で統一されています：

#### ファイル形式
- **拡張子**: `.md` （Markdownファイル）
- **場所**: `docs/patterns/{pattern-name}/overview.md`

#### ページ構造
```markdown
# パターン名

パターンの概要説明

## Pattern Types
パターンのバリエーション（水平・垂直、自動・手動など）

## Accessibility Requirements
### ARIA Roles and Properties
- role属性とARIAプロパティの説明

### Keyboard Support
キーボードナビゲーションの表

### Focus Management
フォーカス管理の仕様

## Implementation Examples
import DemoTabs from '@site/src/components/DemoTabs';
import CodeViewer from '@site/src/components/CodeViewer';

<DemoTabs
  demoPath="/demos/{pattern}"
  frameworks={['react', 'svelte', 'vue']}
/>

## Source Code
<CodeViewer
  frameworks={['react', 'svelte', 'vue']}
  pattern="{pattern}"
/>

## MCP Metadata
JSONメタデータブロック

## Testing
テスト方針の説明

## Resources
関連リンク
```

#### 使用コンポーネント
1. **DemoTabs**: フレームワーク別ライブデモ表示
   - iframeでサンドボックス化された実行環境
   - 環境別URL自動切り替え
   - ローディング・エラー状態管理

2. **CodeViewer**: ソースコード表示
   - シンタックスハイライト
   - フレームワーク切り替えタブ
   - コピー機能付き
   - JSONファイルからコード読み込み

#### メタデータ構造
```json
{
  "pattern": "パターン名",
  "aria_features": ["使用するARIA属性配列"],
  "keyboard_support": ["対応キー配列"],
  "complexity": "難易度レベル",
  "apg_compliance": true,
  "frameworks": ["react", "svelte", "vue"]
}
```

### 実装例
- **Toggle Button**: `docs/patterns/button/overview.md`
- **Tabs**: `docs/patterns/tabs/overview.md`

この構成により、全パターンで一貫したドキュメント体験を提供し、開発者が効率的にAPGパターンを学習・実装できるようになっています。

---

*この文書は Claude Code セッションでの開発過程を記録したものです。*