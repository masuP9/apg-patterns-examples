# AI 向け定義ファイル（`{pattern}.md`）構造リファレンス

APG パターンの AI 向け定義ファイルは **手書きしません**。各パターンの `accessibility-data.ts`（型は `src/lib/pattern-data/types.ts` の `PatternAccessibilityData`）を真実源として、`scripts/generate-pattern-md.ts`（npm スクリプト `npm run generate:llm-md`）が以下を自動生成します:

- `src/patterns/{pattern}/{pattern}.md` … 英語版
- `src/patterns/{pattern}/{pattern}.ja.md` … 日本語版

このドキュメントは、生成される `{pattern}.md` がどのような構造になるかを把握するための**構造リファレンス**です。記載内容を変えたい場合は md を直接編集せず、`accessibility-data.ts` か生成スクリプトを更新してください。

## 生成される構造

````markdown
# {Pattern Name} Pattern - AI Implementation Guide

> APG Reference: {APG URL}

## Overview

{1-2 sentences describing the pattern}

## ARIA Requirements

### Roles

| Role     | Element          | Description   |
| -------- | ---------------- | ------------- |
| `{role}` | {target element} | {description} |

### Properties

| Attribute  | Element  | Values   | Required | Notes   |
| ---------- | -------- | -------- | -------- | ------- |
| `{aria-*}` | {target} | {values} | Yes/No   | {notes} |

### States

| Attribute  | Element  | Values   | Required | Change Trigger |
| ---------- | -------- | -------- | -------- | -------------- |
| `{aria-*}` | {target} | {values} | Yes/No   | {triggers}     |

## Keyboard Support

| Key     | Action               |
| ------- | -------------------- |
| `{Key}` | {action description} |

## Focus Management

- {Focus management rules}
- {Roving tabindex if applicable}

## Test Checklist

### High Priority: Keyboard

- [ ] {keyboard test case}

### High Priority: ARIA

- [ ] {ARIA test case}

### High Priority: Focus Management

- [ ] {focus test case}

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

{Special considerations, common pitfalls, or structural diagrams}

## Example Test Code (React + Testing Library)

```typescript
// Example test snippets
```
````

```

## ガイドライン

`accessibility-data.ts` に内容を記述する際の方針:

1. **簡潔さ**: トークン効率を考慮し、冗長な説明は避ける
2. **表形式**: ARIA 属性やキーボード操作は表で整理
3. **テストチェックリスト**: AI がテストを生成する際のチェックリストを提供
4. **実装例**: フレームワーク非依存で理解しやすいコード例
5. **APG リンク**: 公式ドキュメントへの参照を含める

## 命名規則・生成

- 真実源: `src/patterns/{pattern}/accessibility-data.ts`
- 生成物: `src/patterns/{pattern}/{pattern}.md`（英語）、`src/patterns/{pattern}/{pattern}.ja.md`（日本語）
- 生成コマンド: `npm run generate:llm-md`（`scripts/generate-pattern-md.ts --all-locales`）
- 生成された `.md` は直接編集しない（再生成で上書きされる）
```
