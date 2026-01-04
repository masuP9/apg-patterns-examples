# LLM.md Template

このテンプレートは、APG パターンの AI 向け定義ファイル (`llm.md`) を作成する際のガイドラインです。

## ファイル構造

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

1. **簡潔さ**: トークン効率を考慮し、冗長な説明は避ける
2. **表形式**: ARIA 属性やキーボード操作は表で整理
3. **テストチェックリスト**: AI がテストを生成する際のチェックリストを提供
4. **実装例**: フレームワーク非依存で理解しやすいコード例
5. **APG リンク**: 公式ドキュメントへの参照を含める

## 命名規則

- ファイル名: `llm.md`
- 配置場所: `src/patterns/{pattern}/llm.md`
```
