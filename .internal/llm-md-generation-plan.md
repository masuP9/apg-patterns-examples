# AI向けMarkdownガイド自動生成計画

> **ステータス**: 検討完了、将来実装予定
> **作成日**: 2026-01-21

## 背景・問題

**現状**:

- 各パターンに手動で `llm.md` を作成・管理（32パターン存在）
- `AccessibilityDocs.astro` にも同様の情報がHTMLテーブルとして存在
- 情報が二重管理されており、乖離リスクがある

**目標**:

- 「単一情報源（SSOT）」から自動生成して乖離を防ぐ
- 管理コストの削減

---

## 検討したアプローチ

| アプローチ                         | Pros                                             | Cons                                             |
| ---------------------------------- | ------------------------------------------------ | ------------------------------------------------ |
| **A. クライアントサイドHTML変換**  | 即座に導入可能、既存コード変更最小               | クライアント依存、Test Checklist等の情報が失われる |
| **B. ビルド時HTML抽出+変換**       | 静的配布可能                                     | HTML構造に依存、変換品質問題                     |
| **C. 構造化データ化+生成** ⭐      | DRY、型安全、トークン効率最適化可能              | 32パターンのデータ移行作業                       |
| **D. MDX移行**                     | Astro標準                                        | 大規模リファクタリング                           |

---

## 決定: TypeScript データソース + 生成（Option C）

TypeScriptファイルでデータを定義し、Astroコンポーネントとllm.md生成の両方で使用。

**構造**:

```
src/patterns/{pattern}/
├── accessibility-data.ts     # データソース（TypeScript）
├── AccessibilityDocs.astro   # TSからimportして表示
└── llm.md                    # 同じTSから生成（ビルド時）
```

**データソース例** (`accessibility-data.ts`):

```typescript
import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const tabsAccessibility: PatternAccessibilityData = {
  pattern: 'tabs',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',

  roles: [
    { name: 'tablist', element: 'Container', description: 'Container for tab elements' },
    { name: 'tab', element: 'Tab element', description: 'Tab control element' },
  ],

  keyboardSupport: [
    { key: 'Tab', action: 'Move focus to active tab' },
    { key: 'ArrowRight', action: 'Move focus to next tab' },
  ],
};
```

**Astroコンポーネントでの使用**:

```astro
---
import { tabsAccessibility } from './accessibility-data';
import DataTable from '@/components/pattern/DataTable.astro';
---

<DataTable data={tabsAccessibility.roles} columns={['name', 'element', 'description']} />
```

**メリット**:

- TypeScriptネイティブの型安全性
- IDE補完が効く
- Node単体でllm.md生成可能（Astroランタイム不要）
- Zodでバリデーション可能
- 既存のAccessibilityDocs.astroから段階的に移行可能

---

## 実装計画

### Phase 1: 型定義作成

**新規作成**: `src/lib/pattern-data/types.ts`

```typescript
export interface AriaRole {
  name: string;
  element: string;
  description: string;
}

export interface KeyboardShortcut {
  key: string;
  action: string;
}

export interface PatternAccessibilityData {
  pattern: string;
  apgUrl: string;
  roles: AriaRole[];
  properties?: AriaProperty[];
  states?: AriaState[];
  keyboardSupport: KeyboardShortcut[];
  // ... 他のフィールド
}
```

### Phase 2: 汎用コンポーネント作成

**新規作成**: `src/components/pattern/DataTable.astro`

- データ配列を受け取りテーブルをレンダリング
- 既存の `ResponsiveTable` スタイルを適用

### Phase 3: データソース作成（パイロット）

**新規作成**: `src/patterns/tabs/accessibility-data.ts`

```typescript
import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const tabsAccessibility: PatternAccessibilityData = {
  pattern: 'tabs',
  apgUrl: '...',
  roles: [...],
  keyboardSupport: [...],
};
```

**変更**: `src/patterns/tabs/AccessibilityDocs.astro`

- データをimportしてDataTableでレンダリング

### Phase 4: llm.md 生成スクリプト

**新規作成**: `scripts/generate-llm-md.ts`

- TypeScriptデータソースから直接import
- Markdown形式で llm.md を生成
- Node単体で実行可能

```json
{
  "scripts": {
    "generate:llm-md": "tsx scripts/generate-llm-md.ts",
    "build": "npm run generate:llm-md && astro build"
  }
}
```

### Phase 5: 段階的移行

1. パイロット: `tabs` パターン
2. シンプル: `button`, `switch`, `alert`
3. 複雑: `combobox`, `dialog`, `grid`
4. 全パターン完了後: 旧AccessibilityDocs内のハードコードを削除

### Phase 6: CI差分チェック追加

- 生成されたllm.mdがコミットされているか検証

---

## 対象ファイル

| ファイル                                         | 変更内容                             |
| ------------------------------------------------ | ------------------------------------ |
| `src/lib/pattern-data/types.ts`                  | **新規** - 型定義                    |
| `src/patterns/{pattern}/accessibility-data.ts`   | **新規** - パターンごとのデータソース |
| `src/components/pattern/DataTable.astro`         | **新規** - 汎用テーブルコンポーネント |
| `src/patterns/{pattern}/AccessibilityDocs.astro` | TSからimportしてレンダリング         |
| `scripts/generate-llm-md.ts`                     | **新規** - llm.md 生成スクリプト     |
| `package.json`                                   | スクリプト追加                       |

---

## 検証方法

```bash
# 1. 開発サーバー起動
npm run dev

# 2. llm.md生成テスト
npm run generate:llm-md

# 3. 生成されたllm.mdと既存を比較
diff src/patterns/tabs/llm.md dist/patterns/tabs/llm.md

# 4. AccessibilityDocsの表示確認
# ブラウザで /patterns/tabs/react/ を確認

# 5. ビルド
npm run build
```

---

## 工数見積もり

- Phase 1-2: 4-6時間
- Phase 3: 3-5時間（パイロット1パターン）
- Phase 4: 4-6時間
- Phase 5: 16-24時間（残り31パターン）
- Phase 6: 2-3時間

**合計**: 27-40時間

---

## 関連ドキュメント

- [llm.md テンプレート](.internal/llm-md-template.md)
- [サイト仕様書](.internal/site-specification.md)
