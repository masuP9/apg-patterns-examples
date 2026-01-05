# 多言語対応（日本語）実装計画

## 現状分析

### 既存の設定
- `astro.config.mjs` に i18n 設定あり（`defaultLocale: 'en'`, `locales: ['en', 'ja']`）
- 翻訳ファイル・ユーティリティは未実装
- 全テキストが英語でハードコード

### 翻訳が必要な箇所
1. **UI テキスト**: ナビゲーション、ボタンラベル、見出し
2. **パターンメタデータ**: `src/lib/patterns.ts` の name, description
3. **アクセシビリティドキュメント**: 各パターンの AccessibilityDocs.astro
4. **静的ページ**: index, about, guide, 404

---

## 実装方針

### URL 構造（Astro i18n prefix 方式）
```
/patterns/button/react/      # 英語（デフォルト）
/ja/patterns/button/react/   # 日本語
```

### ページ生成戦略
**静的ページ生成を採用**
- `src/pages/ja/` ディレクトリに日本語ページを作成
- シンプルで明確な構造
- 各言語のページを明示的に管理

### 翻訳管理
- UI テキスト → JSON ファイル（`src/i18n/ui.ts`）
- パターンメタデータ → 翻訳関数で管理
- AccessibilityDocs → 言語別コンポーネント（`AccessibilityDocs.ja.astro`）

### 翻訳優先順位
**AccessibilityDocs を優先**（サイトの主要コンテンツ）
1. AccessibilityDocs の翻訳
2. UI テキストの翻訳
3. 静的ページの翻訳

---

## 実装フェーズ

### Phase 1: i18n インフラストラクチャ

**目的**: 翻訳システムの基盤を構築

1. **`src/i18n/` ディレクトリ作成**
   ```
   src/i18n/
   ├── index.ts          # メインエクスポート
   ├── ui.ts             # UI テキスト翻訳
   ├── patterns.ts       # パターンメタデータ翻訳
   └── utils.ts          # ロケール検出・切り替えユーティリティ
   ```

2. **翻訳ユーティリティ関数**
   ```typescript
   // src/i18n/utils.ts
   export type Locale = 'en' | 'ja';
   export const defaultLocale: Locale = 'en';
   export const locales: Locale[] = ['en', 'ja'];

   export function getLocaleFromUrl(url: URL): Locale;
   export function getLocalizedPath(path: string, locale: Locale): string;
   ```

3. **UI テキスト翻訳**
   ```typescript
   // src/i18n/ui.ts
   export const ui = {
     en: {
       'nav.home': 'Home',
       'nav.patterns': 'Patterns',
       'nav.guide': 'Guide',
       'nav.about': 'About',
       'pattern.demo': 'Demo',
       'pattern.sourceCode': 'Source Code',
       'pattern.accessibility': 'Accessibility',
       // ...
     },
     ja: {
       'nav.home': 'ホーム',
       'nav.patterns': 'パターン',
       'nav.guide': 'ガイド',
       'nav.about': 'このサイトについて',
       'pattern.demo': 'デモ',
       'pattern.sourceCode': 'ソースコード',
       'pattern.accessibility': 'アクセシビリティ',
       // ...
     },
   };

   export function useTranslation(locale: Locale);
   ```

### Phase 2: 既存コンポーネントの i18n 対応

**目的**: 既存の UI コンポーネントを翻訳対応に

1. **BaseLayout.astro の更新**
   - `lang` 属性をロケールに応じて設定
   - ナビゲーションテキストを翻訳関数で取得
   - 言語切り替えリンクを追加

2. **PatternLayout.astro の更新**
   - タブラベル（Demo, Source Code など）を翻訳
   - パターン名・説明を翻訳

3. **パターンメタデータの翻訳**
   ```typescript
   // src/i18n/patterns.ts
   export const patternTranslations = {
     ja: {
       button: {
         name: 'ボタン',
         description: 'フォームの送信や状態のトグルなど、アクションやイベントをトリガーするウィジェット。',
       },
       tabs: {
         name: 'タブ',
         description: '一度に1つのパネルを表示する、タブパネルと呼ばれるコンテンツセクションのセット。',
       },
       // ...
     },
   };
   ```

### Phase 3: ルーティング対応

**目的**: `/ja/` プレフィックス付き URL でのアクセスを可能に

1. **Astro i18n routing 設定の確認・調整**
   ```javascript
   // astro.config.mjs
   i18n: {
     defaultLocale: 'en',
     locales: ['en', 'ja'],
     routing: {
       prefixDefaultLocale: false,  // 英語は / のまま
     },
   },
   ```

2. **動的ルーティング対応**
   - `src/pages/ja/` ディレクトリ作成
   - または `[...locale]/` パターンでの動的生成

3. **リダイレクト設定**
   - `/ja/patterns/{pattern}/` → `/ja/patterns/{pattern}/react/`

### Phase 4: 言語切り替え UI

**目的**: ユーザーが言語を切り替えられる UI を追加

1. **LanguageSwitcher コンポーネント**
   ```astro
   <!-- src/components/LanguageSwitcher.astro -->
   <nav aria-label="Language">
     <a href={englishUrl} lang="en" hreflang="en">English</a>
     <a href={japaneseUrl} lang="ja" hreflang="ja">日本語</a>
   </nav>
   ```

2. **ヘッダーへの統合**
   - デスクトップ: ヘッダー右側に配置
   - モバイル: ハンバーガーメニュー内

3. **アクセシビリティ考慮**
   - `aria-label` で目的を明示
   - `hreflang` 属性を設定
   - 現在の言語を視覚的・スクリーンリーダーに明示

### Phase 5: コンテンツ翻訳

**目的**: 実際の日本語コンテンツを作成

**AccessibilityDocs を最優先**（サイトの主要価値）

1. **優先度 High（初期リリース）**
   - AccessibilityDocs 全文（各パターン）
   - パターン名と説明

2. **優先度 Medium**
   - ナビゲーション・共通 UI テキスト
   - トップページ、About ページ

3. **優先度 Low（将来）**
   - Guide ページ
   - 詳細な説明・ノート

**AccessibilityDocs 翻訳の進め方**:
1. 各パターンに `AccessibilityDocs.ja.astro` を作成
2. ページで `locale` に応じて読み込むコンポーネントを切り替え
3. 利用頻度の高いパターンから順に翻訳
   - Button, Tabs, Dialog, Accordion（よく使われる）
   - その他のパターン

---

## ファイル構成（実装後）

```
src/
├── i18n/
│   ├── index.ts              # メインエクスポート
│   ├── ui.ts                 # UI テキスト（en/ja）
│   ├── patterns.ts           # パターン翻訳
│   └── utils.ts              # ロケールユーティリティ
├── components/
│   └── LanguageSwitcher.astro
├── layouts/
│   ├── BaseLayout.astro      # 更新: lang属性、翻訳対応
│   └── PatternLayout.astro   # 更新: 翻訳対応
├── pages/
│   ├── index.astro           # 英語
│   ├── about.astro
│   ├── ja/
│   │   ├── index.astro       # 日本語
│   │   ├── about.astro
│   │   └── patterns/
│   │       └── ...
│   └── patterns/
│       └── ...
```

---

## 技術的考慮事項

### 1. ページ生成戦略

**静的ページ生成を採用**
- `src/pages/ja/` に日本語ページを作成
- 利点: シンプル、明確、デバッグしやすい
- 各ページを明示的に管理

**ファイル構成**:
```
src/pages/
├── patterns/
│   └── button/
│       └── react/index.astro    # 英語
└── ja/
    └── patterns/
        └── button/
            └── react/index.astro  # 日本語
```

### 2. AccessibilityDocs の多言語対応

**言語別コンポーネント方式**:
```
src/patterns/button/
├── AccessibilityDocs.astro      # 英語（デフォルト）
└── AccessibilityDocs.ja.astro   # 日本語
```

ページ側で locale に応じて動的インポート:
```astro
---
import AccessibilityDocsEn from '@patterns/button/AccessibilityDocs.astro';
import AccessibilityDocsJa from '@patterns/button/AccessibilityDocs.ja.astro';

const AccessibilityDocs = locale === 'ja' ? AccessibilityDocsJa : AccessibilityDocsEn;
---
<AccessibilityDocs />
```

### 3. Content Collections（将来検討）

- パターンコンテンツを MDX に移行
- 言語別ディレクトリで管理
- 現時点では複雑すぎるため Phase 5 以降で検討

### 3. SEO 対応

- `<link rel="alternate" hreflang="...">` タグ
- Open Graph タグの多言語対応
- サイトマップの言語別生成

---

## 作業見積もり

| Phase | 内容 | 複雑度 |
|-------|------|--------|
| Phase 1 | i18n インフラ | 低 |
| Phase 2 | コンポーネント対応 | 中 |
| Phase 3 | ルーティング | 中 |
| Phase 4 | 言語切り替え UI | 低 |
| Phase 5 | コンテンツ翻訳 | 高（量による） |

---

## 次のステップ

1. この計画のレビュー・承認
2. Phase 1 から順次実装
3. 各 Phase 完了後にテスト・確認
