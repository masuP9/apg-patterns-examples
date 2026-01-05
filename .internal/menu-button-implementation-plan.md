# Menu Button APG パターン実装計画 (TDD アプローチ)

## 概要

WAI-ARIA APG Menu Button パターンを React, Vue, Svelte, Astro で実装する。
**テスト駆動開発 (TDD)** で進め、先にテストを書いてから実装する。

## スコープ (v1)

- **含む**: 基本メニューアイテム (`role="menuitem"`)
- **含まない**: サブメニュー、checkbox/radio アイテム、ドロップダウンアイコン (将来対応)
- **API**: データ駆動 (Listbox パターンと同様)
- **アイコン**: `label` のみ提供。キャレット (▼) 等は利用側で追加

---

## 1. コンポーネント API 設計

```typescript
interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

// React: ButtonHTMLAttributes を継承して全 DOM 属性を受け入れ
interface MenuButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-haspopup' | 'aria-expanded' | 'aria-controls' | 'type'
> {
  items: MenuItem[];
  label: string;
  onItemSelect?: (itemId: string) => void;
  defaultOpen?: boolean;
}

// Vue: inheritAttrs: false + v-bind="$attrs"
// Svelte: {...$$restProps}
```

---

## 2. APG 準拠要件

### ARIA 属性

| 要素     | 属性              | 値                     |
| -------- | ----------------- | ---------------------- |
| Button   | `aria-haspopup`   | `"menu"`               |
| Button   | `aria-expanded`   | `"true"` / `"false"`   |
| Button   | `aria-controls`   | menu の ID             |
| Menu     | `role`            | `"menu"`               |
| Menu     | `aria-labelledby` | button の ID           |
| MenuItem | `role`            | `"menuitem"`           |
| MenuItem | `aria-disabled`   | `"true"` (disabled 時) |

### キーボード操作

**ボタンフォーカス時:**
| キー | 動作 |
|------|------|
| Enter / Space | メニューを開き、最初のアイテムにフォーカス |
| ArrowDown | メニューを開き、最初のアイテムにフォーカス |
| ArrowUp | メニューを開き、最後のアイテムにフォーカス |

**メニューフォーカス時:**
| キー | 動作 |
|------|------|
| ArrowDown | 次のアイテムに移動 (ループ) |
| ArrowUp | 前のアイテムに移動 (ループ) |
| Home | 最初のアイテムに移動 |
| End | 最後のアイテムに移動 |
| Escape | メニューを閉じ、ボタンにフォーカス |
| Tab | メニューを閉じ、フォーカス移動 |
| Enter / Space | アイテムを実行、メニューを閉じる |
| 文字キー | タイプアヘッド検索 |

---

## 3. テストケース一覧 (優先度順)

### 🔴 High: APG マウス操作

1. `ボタンクリックでメニューが開く`
2. `開いた状態でボタンクリックでメニューが閉じる (トグル)`
3. `メニューアイテムクリックで実行、メニューが閉じる`
4. `disabled アイテムクリックでは何も起こらない`
5. `メニュー外クリックでメニューが閉じる`

### 🔴 High: APG キーボード操作 (ボタン)

6. `Enter でメニューが開き、最初の有効アイテムにフォーカス`
7. `Space でメニューが開き、最初の有効アイテムにフォーカス`
8. `ArrowDown でメニューが開き、最初の有効アイテムにフォーカス`
9. `ArrowUp でメニューが開き、最後の有効アイテムにフォーカス`

### 🔴 High: APG キーボード操作 (メニュー)

10. `ArrowDown で次の有効アイテムに移動`
11. `ArrowDown で最後から最初にループ`
12. `ArrowUp で前の有効アイテムに移動`
13. `ArrowUp で最初から最後にループ`
14. `Home で最初の有効アイテムに移動 (disabled スキップ)`
15. `End で最後の有効アイテムに移動 (disabled スキップ)`
16. `ArrowDown/Up で disabled アイテムをスキップ`
17. `Escape でメニューを閉じ、ボタンにフォーカス`
18. `Tab でメニューを閉じ、フォーカス移動`
19. `Enter でアイテムを実行、メニューを閉じる`
20. `Space でアイテムを実行、メニューを閉じる (スクロール防止)`

### 🔴 High: タイプアヘッド

21. `文字キーでマッチするアイテムにフォーカス`
22. `複数文字入力でマッチ (例: "ed" → "Edit")`
23. `同じ文字連打でマッチをサイクル`
24. `タイプアヘッドで disabled アイテムをスキップ`
25. `マッチなしの場合フォーカス変更なし`
26. `500ms 後にバッファリセット`

### 🔴 High: APG ARIA 属性

27. `ボタンが aria-haspopup="menu" を持つ`
28. `閉じた状態で aria-expanded="false"`
29. `開いた状態で aria-expanded="true"`
30. `ボタンが aria-controls でメニューを常に参照`
31. `メニューが role="menu" を持つ`
32. `メニューが aria-labelledby でボタンを参照`
33. `アイテムが role="menuitem" を持つ`
34. `disabled アイテムが aria-disabled="true"`

### 🔴 High: フォーカス管理

35. `フォーカスアイテムが tabindex="0"`
36. `他アイテムが tabindex="-1"`
37. `disabled アイテムが tabindex="-1"`
38. `メニュー閉じでフォーカスがボタンに戻る`
39. `閉じた状態でメニューが inert + hidden`

### 🔴 High: エッジケース

40. `全アイテム disabled の場合、メニューは開くがフォーカスはボタンに留まる`
41. `空の items 配列でもクラッシュしない`
42. `複数インスタンスで ID が衝突しない`

### 🟡 Medium: アクセシビリティ

43. `閉じた状態で axe 違反なし`
44. `開いた状態で axe 違反なし`

### 🟢 Low: Props / 動作

45. `defaultOpen=true で初期表示`
46. `className がコンテナに適用`
47. `onItemSelect が正しい id で呼ばれる`

---

## 4. 設計決定事項

### レンダリング戦略

**メニューは常に DOM に存在し、`inert` + `hidden` で制御する。**

理由:

- `aria-controls` が常にメニュー ID を参照できる
- `aria-labelledby` が常に機能する
- アニメーション/トランジションが容易

閉じた状態:

- `inert` 属性: 全子要素を非インタラクティブ化、アクセシビリティツリーから除外
- `hidden` 属性: 視覚的に非表示

```html
<ul role="menu" inert="{!isOpen}" hidden="{!isOpen}">
  <!-- items: 開いている時だけ roving tabindex が有効 -->
</ul>
```

**`inert` のメリット:**

- 個別の `tabindex` 管理が不要
- ブラウザネイティブ対応 (Chrome 102+, Firefox 112+, Safari 15.5+)
- スクリーンリーダーからも適切に隠れる

### フォーカス管理方式

**Roving tabindex を使用** (`aria-activedescendant` ではなく)

理由:

- Listbox パターンと一貫性がある
- 実際の DOM フォーカスが移動するため、スクリーンリーダーの互換性が高い
- `element.focus()` で直感的にフォーカス制御できる

実装:

- フォーカス中のアイテム: `tabindex="0"`
- その他のアイテム: `tabindex="-1"`
- disabled アイテム: `tabindex="-1"` (フォーカス不可)

### ボタンクリック動作

**トグル動作**: クリックで開閉を切り替え (APG 準拠)

---

## 5. TDD 実装フェーズ

### Phase 1: テストセットアップ (RED)

```
1. MenuButton.test.tsx 作成
2. 全 47 テストケースを describe/it で空実装
3. 最小限のコンポーネント作成 (全テスト失敗)
```

**作成ファイル:**

- `src/patterns/menu-button/MenuButton.test.tsx`
- `src/patterns/menu-button/MenuButton.tsx` (スケルトン)

### Phase 2: 静的 ARIA 属性 (GREEN)

```
テスト: 27, 30-34
1. aria-haspopup="menu" を追加
2. role="menu", role="menuitem" を追加
3. useId() で一意の ID 生成
4. aria-controls, aria-labelledby を設定
```

### Phase 3: 開閉状態 + マウス操作 (GREEN)

```
テスト: 1-5, 28-29
1. isOpen 状態管理
2. aria-expanded 連動
3. ボタンクリックでトグル
4. アイテムクリックで実行 + 閉じる
5. disabled アイテムクリック無視
6. 外クリックで閉じる
```

### Phase 4: ボタンキーボード (GREEN)

```
テスト: 6-9
1. Enter/Space でメニューを開く
2. ArrowDown で最初のアイテムにフォーカス
3. ArrowUp で最後のアイテムにフォーカス
```

### Phase 5: フォーカス管理 (GREEN)

```
テスト: 35-39
1. Roving tabindex 実装 (開いた状態のみ)
2. フォーカス復元実装
3. 閉じた状態で inert + hidden 適用
```

### Phase 6: メニューナビゲーション (GREEN)

```
テスト: 10-16
1. ArrowDown/Up でナビゲーション
2. Home/End で端に移動
3. disabled スキップロジック
4. ループ動作
```

### Phase 7: メニューアクション (GREEN)

```
テスト: 17-20
1. Escape でメニューを閉じ、ボタンにフォーカス
2. Tab でメニューを閉じ、フォーカス移動
3. Enter/Space でアイテム実行
4. Space の preventDefault (スクロール防止)
```

### Phase 8: タイプアヘッド (GREEN)

```
テスト: 21-26
1. 文字キーでタイプアヘッド
2. 複数文字マッチ
3. 同じ文字でサイクル
4. disabled スキップ
5. マッチなしで変更なし
6. 500ms タイムアウト
```

### Phase 9: エッジケース (GREEN)

```
テスト: 40-42
1. 全 disabled でフォーカスがボタンに留まる
2. 空 items でクラッシュしない
3. 複数インスタンスで ID 衝突なし
```

### Phase 10: アクセシビリティ + 仕上げ (GREEN)

```
テスト: 43-47
1. axe 違反修正
2. defaultOpen サポート
3. className サポート
4. onItemSelect コールバック
```

### Phase 11: Vue/Svelte/Astro 展開

```
1. Vue テスト + 実装
2. Svelte テスト + 実装
3. Astro (Web Components) テスト + 実装
```

### Phase 12: ページ作成

```
1. Demo コンポーネント作成
2. AccessibilityDocs.astro 作成
3. TestingDocs.astro 作成
4. ページ (react/vue/svelte/astro) 作成
5. patterns.ts 更新 (status: 'available')
```

---

## 6. ファイル構成

```
src/patterns/menu-button/
├── MenuButton.tsx              # React
├── MenuButton.test.tsx         # React テスト (Vitest)
├── MenuButton.vue              # Vue
├── MenuButton.test.vue.ts      # Vue テスト (Vitest)
├── MenuButton.svelte           # Svelte
├── MenuButton.test.svelte.ts   # Svelte テスト (Vitest)
├── MenuButton.astro            # Astro (Web Components)
├── MenuButton.test.astro.ts    # Astro テスト (Playwright E2E)
├── MenuButtonDemo.tsx          # React デモ
├── MenuButtonDemo.vue          # Vue デモ
├── MenuButtonDemo.svelte       # Svelte デモ
├── AccessibilityDocs.astro     # A11y ドキュメント
└── TestingDocs.astro           # テストドキュメント

src/pages/patterns/menu-button/
├── react/index.astro
├── vue/index.astro
├── svelte/index.astro
└── astro/index.astro

src/styles/patterns/menu-button.css
```

---

## 7. CSS クラス命名

```css
.apg-menu-button {
}
.apg-menu-button-trigger {
}
.apg-menu-button-trigger[aria-expanded='true'] {
}
.apg-menu-button-menu {
}
.apg-menu-button-menu[hidden] {
} /* hidden 属性セレクタで非表示スタイル */
.apg-menu-button-item {
}
.apg-menu-button-item:hover {
}
.apg-menu-button-item:focus {
}
.apg-menu-button-item[aria-disabled='true'] {
}
```

**Note**: `hidden` 属性を使用するため、BEM 修飾子 (`--hidden`) は不要。
アニメーションが必要な場合は CSS トランジションを `hidden` 属性と組み合わせる。

---

## 8. 変更対象ファイル

### 新規作成

- `src/patterns/menu-button/` (全ファイル)
- `src/pages/patterns/menu-button/` (4ページ)
- `src/styles/patterns/menu-button.css`

### 更新

- `src/lib/patterns.ts` - menu-button の status を `'available'` に変更
- `src/pages/patterns/[pattern]/index.astro` - patterns 配列に 'menu-button' 追加

---

## 9. 参照ファイル

| ファイル                              | 参照目的                                   |
| ------------------------------------- | ------------------------------------------ |
| `src/patterns/listbox/Listbox.tsx`    | Roving tabindex, タイプアヘッド            |
| `src/patterns/dialog/Dialog.tsx`      | フォーカス管理, Escape                     |
| `src/patterns/dialog/Dialog.test.tsx` | テスト構造, フォーカス管理テスト           |
| `src/patterns/tabs/Tabs.test.tsx`     | テスト構造, キーボードナビゲーションテスト |
| `.internal/testing-strategy.md`       | DAMP 原則                                  |

---

## 10. 注意事項

- **Listbox との違い**: Menu はポップアップ、選択後に閉じる
- **Dialog との違い**: Menu はアイテム選択、Tab で閉じる
- **Click outside**: useEffect + document listener で実装
- **SSR**: メニューは client:load で動作確認
