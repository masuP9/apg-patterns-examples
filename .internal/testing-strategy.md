# テスト設計方針

> APG Patterns Examples のテスト戦略

## 設計原則: DAMP (Descriptive And Meaningful Phrases)

テストコードでは **DRY より DAMP を優先** する。

### なぜ DAMP か

テストは「何をテストしているか」が一目で分かることが最も重要。
抽象化によるコード削減よりも、可読性と自己完結性を優先する。

| 観点 | DRY | DAMP |
|------|-----|------|
| 可読性 | 抽象化で意図が隠れる | テストを見れば分かる |
| デバッグ | 共通コードを追う必要あり | そのテストだけで完結 |
| 保守性 | 共通コード変更が全体に影響 | 独立して変更可能 |
| 学習コスト | 抽象化の理解が必要 | コピペで追加可能 |

### 抽象化の方針

**抽象化してよいもの (How-to):**
- テストユーティリティ: `createMockTabs()`
- カスタムマッチャー: `toHaveNoViolations()`
- セットアップ処理: 環境構築の共通処理

**抽象化しないもの (What-to):**
- テストケース本体
- アサーション（期待値は具体的に書く）
- テストデータ（テスト内で定義）

### 例

```typescript
// ❌ 抽象化しすぎ
testToggleBehavior(ToggleButton, { stateAttr: 'aria-pressed' });

// ✅ DAMP: 明示的で自己完結
it('aria-pressed が false から true に変わる', async () => {
  render(<ToggleButton>Mute</ToggleButton>);
  const button = screen.getByRole('button');

  expect(button).toHaveAttribute('aria-pressed', 'false');
  await userEvent.click(button);
  expect(button).toHaveAttribute('aria-pressed', 'true');
});
```

---

## テストの2つの軸

### 1. 基本動作テスト

コンポーネントが正しく動作するかを検証。

- レンダリング
- ユーザー操作（クリック、入力）
- 状態変化
- コールバック呼び出し
- props の受け渡し

### 2. APG 準拠テスト

WAI-ARIA APG 仕様に準拠しているかを検証。

- ARIA 属性（role, aria-*）
- キーボード操作
- フォーカス管理
- axe-core 自動チェック

---

## APG 準拠テストの観点

### A. ARIA 属性

- 正しい role が設定されている
- 必須の aria-* 属性が存在する
- 状態変化で aria-* 属性が更新される
- 関連要素の参照（aria-controls, aria-labelledby）が正しい

### B. キーボード操作

- アクティベーションキー（Space, Enter）
- ナビゲーションキー（矢印キー, Home, End）
- 閉じる/キャンセル（Escape）
- 特殊操作（Delete, Tab）

### C. フォーカス管理

- Roving tabindex（選択要素のみ tabIndex=0）
- フォーカストラップ（モーダル系）
- フォーカス復元（閉じた後の戻り先）

### D. axe-core

- WCAG 2.1 AA 準拠
- 自動検出可能な違反がないこと

---

## パターン間で重複するテスト観点

パターンが異なっても、同じ「観点」でテストを書くことになる。
ただし、テストコード自体は抽象化せず、各コンポーネントで明示的に書く。

### 例: トグル系コンポーネント

ToggleButton, Switch, Checkbox は似た動作だが、テストは個別に書く。

| 観点 | ToggleButton | Switch | Checkbox |
|------|--------------|--------|----------|
| 状態属性 | aria-pressed | aria-checked | aria-checked |
| アクティベーション | Space, Enter | Space, Enter | Space |
| 状態変化 | true/false | true/false | true/false/mixed |

### 例: ナビゲーション系コンポーネント

Tabs, RadioGroup, Menu は矢印キーナビゲーションを持つ。

| 観点 | Tabs | RadioGroup | Menu |
|------|------|------------|------|
| コンテナ role | tablist | radiogroup | menu |
| 子要素 role | tab | radio | menuitem |
| 選択属性 | aria-selected | aria-checked | - |
| 矢印キー | ← → (水平) / ↑ ↓ (垂直) | ← → ↑ ↓ | ↑ ↓ |
| ループ | あり | あり | あり |

---

## ファイル構成

```
demos/react/src/components/
├── Button/
│   ├── ToggleButton.tsx
│   └── ToggleButton.test.tsx
└── Tabs/
    ├── Tabs.tsx
    └── Tabs.test.tsx
```

1つのテストファイルに全カテゴリをまとめる。
テストを見れば、そのコンポーネントの仕様が分かるようにする。

---

## テストファイルの構成

```typescript
describe('ComponentName', () => {
  describe('基本動作', () => {
    it('...', () => {});
  });

  describe('APG: ARIA 属性', () => {
    it('...', () => {});
  });

  describe('APG: キーボード操作', () => {
    it('...', () => {});
  });

  describe('APG: フォーカス管理', () => {
    it('...', () => {});
  });

  describe('アクセシビリティ', () => {
    it('axe による違反がない', async () => {});
  });
});
```

---

## 新規パターン追加時のガイド

1. **APG 仕様を確認**
   - https://www.w3.org/WAI/ARIA/apg/patterns/
   - 必須の role と aria-* 属性
   - キーボード操作の仕様
   - フォーカス管理の要件

2. **テストファイルを作成**
   - 既存のテストを参考に同じ構成で作成
   - テスト名は日本語で具体的に

3. **DAMP で書く**
   - 各テストは自己完結
   - 重複を恐れず、明確さを優先

---

## 使用ツール

| ツール | 用途 |
|-------|------|
| Vitest | テストランナー |
| @testing-library/react | コンポーネントテスト |
| @testing-library/user-event | ユーザー操作 |
| jest-axe | アクセシビリティ自動テスト |

---

## 参考リンク

- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [DRY vs DAMP in Unit Tests](https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/)
- [Testing Library](https://testing-library.com/)
- [jest-axe](https://github.com/nickcolley/jest-axe)
