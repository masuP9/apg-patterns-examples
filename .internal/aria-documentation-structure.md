# ARIA ドキュメント構成ガイド

各コンポーネントのドキュメントに記載する WAI-ARIA の Role / Property / State 情報の構成ガイド。

---

## スコープ

### 含めるもの

- **WAI-ARIA Roles** - `role="button"`, `role="tablist"` など
- **WAI-ARIA Properties** - `aria-controls`, `aria-labelledby` など
- **WAI-ARIA States** - `aria-pressed`, `aria-selected` など

### 含めないもの

- HTML属性（`type`, `disabled`, `tabindex` など）
  - → 「Keyboard Support」や「API」セクションで扱う

---

## セクション構造

```
Accessibility Features
├── WAI-ARIA Roles
├── WAI-ARIA Properties    ← パターンによっては不要
├── WAI-ARIA States        ← パターンによっては不要
└── Keyboard Support
```

---

## 各項目に含める情報

| 項目 | 説明 |
|------|------|
| **属性名** | `aria-pressed`, `role="tablist"` など |
| **対象要素** | どの要素に設定するか（複数要素あるパターンの場合） |
| **値** | `true \| false`, `"horizontal" \| "vertical"` など |
| **必須/任意** | Required（Yes） / Optional（No） |
| **設定方法** | どの Props で制御するか、自動生成か |
| **変化タイミング** | どのユーザー操作で値が変わるか（States の場合） |
| **参照リンク** | W3C WAI-ARIA 仕様への参照 |

---

## 表示形式

### Roles

シンプルな箇条書き、またはテーブル（複数要素パターンの場合）。

**単一要素の場合（箇条書き）:**

```markdown
## WAI-ARIA Roles

- `button` - クリック可能な要素であることを示す
  [WAI-ARIA button role](https://w3c.github.io/aria/#button)
```

**複数要素の場合（テーブル）:**

```markdown
## WAI-ARIA Roles

| Role | 対象要素 | 説明 |
|------|---------|------|
| tablist | コンテナ | タブ群のコンテナ |
| tab | 各タブ | 個々のタブ要素 |
| tabpanel | パネル | コンテンツ領域 |
```

### Properties

テーブル形式で一覧性を重視。

```markdown
## WAI-ARIA Properties

| 属性 | 対象 | 値 | 必須 | 設定方法 |
|------|------|-----|------|---------|
| aria-orientation | tablist | "horizontal" \| "vertical" | No | `orientation` prop |
| aria-controls | tab | パネルID | Yes | 自動生成 |
| aria-labelledby | tabpanel | タブID | Yes | 自動生成 |
```

### States

カード/定義リスト形式で動的変化を詳細記述。

```markdown
## WAI-ARIA States

### aria-pressed

トグルボタンの現在の押下状態を示す。

| 項目 | 内容 |
|------|------|
| 対象 | button 要素 |
| 値 | `true` \| `false` |
| 必須 | Yes |
| 初期値 | `initialPressed` prop（デフォルト: false）|
| 変化タイミング | クリック、Enter、Space |
| 参照 | [aria-pressed](https://w3c.github.io/aria/#aria-pressed) |
```

---

## 具体例

### Toggle Button

Roles と States のみ（Properties なし）。

```markdown
## WAI-ARIA Roles

- `button` - クリック可能な要素であることを示す
  [WAI-ARIA button role](https://w3c.github.io/aria/#button)

## WAI-ARIA States

### aria-pressed

トグルボタンの現在の押下状態を示す。

| 項目 | 内容 |
|------|------|
| 値 | `true` \| `false` |
| 必須 | Yes |
| 初期値 | `initialPressed` prop（デフォルト: false）|
| 変化タイミング | クリック、Enter、Space |
| 参照 | [aria-pressed](https://w3c.github.io/aria/#aria-pressed) |
```

### Tabs

Roles / Properties / States の3セクション全て使用。

```markdown
## WAI-ARIA Roles

| Role | 対象要素 | 説明 |
|------|---------|------|
| tablist | コンテナ | タブ群のコンテナ |
| tab | 各タブ | 個々のタブ要素 |
| tabpanel | パネル | コンテンツ領域 |

## WAI-ARIA Properties

| 属性 | 対象 | 値 | 必須 | 設定方法 |
|------|------|-----|------|---------|
| aria-orientation | tablist | "horizontal" \| "vertical" | No | `orientation` prop |
| aria-controls | tab | パネルID | Yes | 自動生成 |
| aria-labelledby | tabpanel | タブID | Yes | 自動生成 |

## WAI-ARIA States

### aria-selected

現在アクティブなタブを示す。

| 項目 | 内容 |
|------|------|
| 対象 | tab 要素 |
| 値 | `true` \| `false` |
| 必須 | Yes |
| 変化タイミング | タブクリック、矢印キー（automatic）、Enter/Space（manual）|
| 参照 | [aria-selected](https://w3c.github.io/aria/#aria-selected) |
```

---

## 日英バイリンガル対応

| 英語 | 日本語 |
|------|--------|
| Required | 必須 |
| Optional | 任意 |
| Target Element | 対象要素 |
| Values | 値 |
| Change Trigger | 変化タイミング |
| Default | 初期値 |
| Reference | 参照 |

---

## 参考リンク

- [WAI-ARIA 仕様](https://w3c.github.io/aria/)
- [WAI-ARIA APG](https://www.w3.org/WAI/ARIA/apg/)
- [APG Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [APG Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
