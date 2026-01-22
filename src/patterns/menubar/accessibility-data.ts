import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const menubarAccessibilityData: PatternAccessibilityData = {
  pattern: 'menubar',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/menubar/',

  overview: {
    en: 'Menubar is a horizontal menu bar that provides application-style navigation. Each menubar item can open a dropdown menu or submenu. Unlike menu-button, menubar is always visible and supports hierarchical navigation, checkbox/radio items, and hover-based menu switching.',
    ja: 'メニューバーは、アプリケーションスタイルのナビゲーションを提供する水平メニューバーです。各メニューバーアイテムはドロップダウンメニューやサブメニューを開くことができます。Menu-Buttonとは異なり、メニューバーは常に表示され、階層的なナビゲーション、チェックボックス/ラジオアイテム、ホバーによるメニュー切り替えをサポートします。',
  },

  roles: [
    {
      name: 'menubar',
      element: {
        en: 'Horizontal container (<ul>)',
        ja: '水平コンテナ（<ul>）',
      },
      description: {
        en: 'Top-level menu bar, always visible',
        ja: 'トップレベルのメニューバー（常に表示）',
      },
    },
    {
      name: 'menu',
      element: {
        en: 'Vertical container (<ul>)',
        ja: '垂直コンテナ（<ul>）',
      },
      description: {
        en: 'Dropdown menu or submenu',
        ja: 'ドロップダウンメニューまたはサブメニュー',
      },
    },
    {
      name: 'menuitem',
      element: {
        en: 'Item (<span>)',
        ja: 'アイテム（<span>）',
      },
      description: {
        en: 'Standard action item',
        ja: '標準的なアクションアイテム',
      },
    },
    {
      name: 'menuitemcheckbox',
      element: {
        en: 'Checkbox item',
        ja: 'チェックボックスアイテム',
      },
      description: {
        en: 'Toggleable option',
        ja: 'トグル可能なオプション',
      },
    },
    {
      name: 'menuitemradio',
      element: {
        en: 'Radio item',
        ja: 'ラジオアイテム',
      },
      description: {
        en: 'Exclusive option in a group',
        ja: 'グループ内の排他的なオプション',
      },
    },
    {
      name: 'separator',
      element: {
        en: 'Divider (<hr>)',
        ja: '区切り線（<hr>）',
      },
      description: {
        en: 'Visual separator (not focusable)',
        ja: '視覚的な区切り（フォーカス不可）',
      },
    },
    {
      name: 'group',
      element: {
        en: 'Group container',
        ja: 'グループコンテナ',
      },
      description: {
        en: 'Groups radio items with a label',
        ja: 'ラジオアイテムをラベル付きでグループ化',
      },
    },
    {
      name: 'none',
      element: '<li> elements',
      description: {
        en: 'Hides list semantics from screen readers',
        ja: 'スクリーンリーダーからリストセマンティクスを隠す',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-haspopup',
      element: {
        en: 'menuitem with submenu',
        ja: 'サブメニューを持つmenuitem',
      },
      values: '"menu"',
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'Indicates the item opens a menu (use "menu", not "true")',
        ja: 'アイテムがメニューを開くことを示す（"true"ではなく"menu"を使用）',
      },
    },
    {
      attribute: 'aria-expanded',
      element: {
        en: 'menuitem with submenu',
        ja: 'サブメニューを持つmenuitem',
      },
      values: 'true | false',
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'Indicates whether the menu is open',
        ja: 'メニューが開いているかどうかを示す',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'menu',
      values: {
        en: 'ID reference',
        ja: 'ID参照',
      },
      required: {
        en: 'Yes**',
        ja: 'はい**',
      },
      notes: {
        en: 'References the parent menuitem',
        ja: '親のmenuitemを参照する',
      },
    },
    {
      attribute: 'aria-label',
      element: 'menubar/menu',
      values: {
        en: 'String',
        ja: '文字列',
      },
      required: {
        en: 'Yes**',
        ja: 'はい**',
      },
      notes: {
        en: 'Provides an accessible name',
        ja: 'アクセシブルな名前を提供する',
      },
    },
    {
      attribute: 'aria-checked',
      element: 'checkbox/radio',
      values: 'true | false',
      required: {
        en: 'Yes',
        ja: 'はい',
      },
      notes: {
        en: 'Indicates checked state',
        ja: 'チェック状態を示す',
      },
    },
    {
      attribute: 'aria-disabled',
      element: 'menuitem',
      values: 'true',
      required: {
        en: 'No',
        ja: 'いいえ',
      },
      notes: {
        en: 'Indicates the item is disabled',
        ja: 'アイテムが無効であることを示す',
      },
    },
    {
      attribute: 'aria-hidden',
      element: 'menu/submenu',
      values: 'true | false',
      required: {
        en: 'Yes',
        ja: 'はい',
      },
      notes: {
        en: 'Hides menu from screen readers when closed',
        ja: '閉じているときメニューをスクリーンリーダーから隠す',
      },
    },
  ],

  keyboardSections: [
    {
      title: {
        en: 'Menubar Navigation',
        ja: 'メニューバーナビゲーション',
      },
      shortcuts: [
        {
          key: 'Right Arrow',
          action: {
            en: 'Move focus to next menubar item (wraps to first)',
            ja: '次のメニューバーアイテムにフォーカスを移動（最後から最初にラップ）',
          },
        },
        {
          key: 'Left Arrow',
          action: {
            en: 'Move focus to previous menubar item (wraps to last)',
            ja: '前のメニューバーアイテムにフォーカスを移動（最初から最後にラップ）',
          },
        },
        {
          key: 'Down Arrow',
          action: {
            en: 'Open submenu and focus first item',
            ja: 'サブメニューを開き、最初のアイテムにフォーカス',
          },
        },
        {
          key: 'Up Arrow',
          action: {
            en: 'Open submenu and focus last item',
            ja: 'サブメニューを開き、最後のアイテムにフォーカス',
          },
        },
        {
          key: 'Enter / Space',
          action: {
            en: 'Open submenu and focus first item',
            ja: 'サブメニューを開き、最初のアイテムにフォーカス',
          },
        },
        {
          key: 'Home',
          action: {
            en: 'Move focus to first menubar item',
            ja: '最初のメニューバーアイテムにフォーカスを移動',
          },
        },
        {
          key: 'End',
          action: {
            en: 'Move focus to last menubar item',
            ja: '最後のメニューバーアイテムにフォーカスを移動',
          },
        },
        {
          key: 'Tab',
          action: {
            en: 'Close all menus and move focus out',
            ja: 'すべてのメニューを閉じてフォーカスを外に移動',
          },
        },
      ],
    },
    {
      title: {
        en: 'Menu/Submenu Navigation',
        ja: 'メニュー/サブメニューナビゲーション',
      },
      shortcuts: [
        {
          key: 'Down Arrow',
          action: {
            en: 'Move focus to next item (wraps to first)',
            ja: '次のアイテムにフォーカスを移動（最後から最初にラップ）',
          },
        },
        {
          key: 'Up Arrow',
          action: {
            en: 'Move focus to previous item (wraps to last)',
            ja: '前のアイテムにフォーカスを移動（最初から最後にラップ）',
          },
        },
        {
          key: 'Right Arrow',
          action: {
            en: "Open submenu if present, or move to next menubar item's menu (in top-level menu)",
            ja: 'サブメニューがあれば開く、またはトップレベルメニューでは次のメニューバーアイテムのメニューに移動',
          },
        },
        {
          key: 'Left Arrow',
          action: {
            en: "Close submenu and return to parent, or move to previous menubar item's menu (in top-level menu)",
            ja: 'サブメニューを閉じて親に戻る、またはトップレベルメニューでは前のメニューバーアイテムのメニューに移動',
          },
        },
        {
          key: 'Enter / Space',
          action: {
            en: 'Activate item and close menu; for checkbox/radio, toggle state and keep menu open',
            ja: 'アイテムを実行してメニューを閉じる；チェックボックス/ラジオは状態を切り替えてメニューを開いたままにする',
          },
        },
        {
          key: 'Escape',
          action: {
            en: 'Close menu and return focus to parent (menubar item or parent menuitem)',
            ja: 'メニューを閉じてフォーカスを親（メニューバーアイテムまたは親menuitem）に戻す',
          },
        },
        {
          key: 'Home',
          action: {
            en: 'Move focus to first item',
            ja: '最初のアイテムにフォーカスを移動',
          },
        },
        {
          key: 'End',
          action: {
            en: 'Move focus to last item',
            ja: '最後のアイテムにフォーカスを移動',
          },
        },
        {
          key: 'Character',
          action: {
            en: 'Type-ahead: focus item starting with typed character(s)',
            ja: '先行入力: 入力された文字で始まるアイテムにフォーカスを移動',
          },
        },
      ],
    },
  ],

  focusManagement: [
    {
      event: {
        en: 'Initial focus',
        ja: '初期フォーカス',
      },
      behavior: {
        en: 'Only one menubar item has tabindex="0" at a time',
        ja: '一度に1つのメニューバーアイテムのみがtabindex="0"を持つ',
      },
    },
    {
      event: {
        en: 'Other items',
        ja: 'その他のアイテム',
      },
      behavior: {
        en: 'Other items have tabindex="-1"',
        ja: 'その他のアイテムはtabindex="-1"を持つ',
      },
    },
    {
      event: {
        en: 'Arrow key navigation',
        ja: '矢印キーナビゲーション',
      },
      behavior: {
        en: 'Arrow keys move focus between items with wrapping',
        ja: '矢印キーでアイテム間のフォーカス移動（ラップあり）',
      },
    },
    {
      event: {
        en: 'Disabled items',
        ja: '無効なアイテム',
      },
      behavior: {
        en: 'Disabled items are focusable but not activatable (per APG recommendation)',
        ja: '無効なアイテムはフォーカス可能だが実行不可（APG推奨）',
      },
    },
    {
      event: {
        en: 'Separator',
        ja: '区切り線',
      },
      behavior: {
        en: 'Separators are not focusable',
        ja: '区切り線はフォーカス不可',
      },
    },
    {
      event: {
        en: 'Menu close',
        ja: 'メニューを閉じる',
      },
      behavior: {
        en: 'Focus returns to invoker when menu closes',
        ja: 'メニューが閉じると、フォーカスは呼び出し元に戻る',
      },
    },
  ],

  additionalNotes: [
    {
      en: 'When closed, the menu uses aria-hidden="true" with CSS to hide from screen readers (aria-hidden), hide visually (visibility: hidden), prevent pointer interaction (pointer-events: none), and enable smooth CSS animations on open/close.',
      ja: '閉じているとき、メニューはaria-hidden="true"とCSSを使用して、スクリーンリーダーから隠す（aria-hidden）、視覚的に隠す（visibility: hidden）、ポインター操作を防ぐ（pointer-events: none）、開閉時のスムーズなCSSアニメーションを可能にします。',
    },
    {
      en: 'When open, the menu has aria-hidden="false" with visibility: visible.',
      ja: '開いているとき、メニューはaria-hidden="false"とvisibility: visibleになります。',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA menubar role',
      url: 'https://w3c.github.io/aria/#menubar',
    },
  ],

  testing: {
    strategies: [
      {
        type: 'unit',
        title: {
          en: 'Unit Tests (Testing Library)',
          ja: 'ユニットテスト（Testing Library）',
        },
        description: {
          en: 'Verify component rendering and interactions using framework-specific Testing Library utilities. These tests ensure correct component behavior in isolation.',
          ja: 'フレームワーク固有のTesting Libraryユーティリティを使用してコンポーネントのレンダリングと操作を検証します。これらのテストは分離された環境での正しいコンポーネント動作を確認します。',
        },
        areas: [
          { en: 'HTML structure and element hierarchy', ja: 'HTML構造と要素階層' },
          {
            en: 'Initial attribute values (role, aria-haspopup, aria-expanded)',
            ja: '初期属性値（role、aria-haspopup、aria-expanded）',
          },
          { en: 'Click event handling', ja: 'クリックイベント処理' },
          { en: 'CSS class application', ja: 'CSSクラスの適用' },
        ],
      },
      {
        type: 'e2e',
        title: {
          en: 'E2E Tests (Playwright)',
          ja: 'E2Eテスト（Playwright）',
        },
        description: {
          en: 'Verify component behavior in a real browser environment across all four frameworks. These tests cover interactions that require full browser context.',
          ja: '4つのフレームワーク全体で実際のブラウザ環境でのコンポーネント動作を検証します。これらのテストは完全なブラウザコンテキストを必要とする操作をカバーします。',
        },
        areas: [
          {
            en: 'Keyboard navigation (Arrow keys, Enter, Space, Escape, Tab)',
            ja: 'キーボードナビゲーション（矢印キー、Enter、Space、Escape、Tab）',
          },
          { en: 'Submenu opening and closing', ja: 'サブメニューの開閉' },
          { en: 'Menubar horizontal navigation', ja: 'メニューバーの水平ナビゲーション' },
          {
            en: 'Checkbox and radio item toggling',
            ja: 'チェックボックスとラジオアイテムの切り替え',
          },
          { en: 'Hover-based menu switching', ja: 'ホバーによるメニュー切り替え' },
          { en: 'Type-ahead search', ja: '先行入力検索' },
          {
            en: 'Focus management and roving tabindex',
            ja: 'フォーカス管理とローヴィングタブインデックス',
          },
          { en: 'Cross-framework consistency', ja: 'クロスフレームワークの一貫性' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'APG ARIA Attributes', ja: 'APG ARIA属性' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="menubar"',
            description: { en: 'Container has menubar role', ja: 'コンテナがmenubarロールを持つ' },
          },
          {
            name: 'role="menu"',
            description: { en: 'Dropdown has menu role', ja: 'ドロップダウンがmenuロールを持つ' },
          },
          {
            name: 'role="menuitem"',
            description: { en: 'Items have menuitem role', ja: 'アイテムがmenuitemロールを持つ' },
          },
          {
            name: 'role="menuitemcheckbox"',
            description: {
              en: 'Checkbox items have correct role',
              ja: 'チェックボックスアイテムが正しいロールを持つ',
            },
          },
          {
            name: 'role="menuitemradio"',
            description: {
              en: 'Radio items have correct role',
              ja: 'ラジオアイテムが正しいロールを持つ',
            },
          },
          {
            name: 'role="separator"',
            description: {
              en: 'Dividers have separator role',
              ja: '区切り線がseparatorロールを持つ',
            },
          },
          {
            name: 'role="group"',
            description: {
              en: 'Radio groups have group role with aria-label',
              ja: 'ラジオグループがaria-labelを持つgroupロールを持つ',
            },
          },
          {
            name: 'role="none"',
            description: {
              en: 'All li elements have role="none"',
              ja: 'すべてのli要素がrole="none"を持つ',
            },
          },
          {
            name: 'aria-haspopup',
            description: {
              en: 'Items with submenu have aria-haspopup="menu"',
              ja: 'サブメニューを持つアイテムがaria-haspopup="menu"を持つ',
            },
          },
          {
            name: 'aria-expanded',
            description: {
              en: 'Items with submenu reflect open state',
              ja: 'サブメニューを持つアイテムが開閉状態を反映する',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Submenu references parent menuitem',
              ja: 'サブメニューが親のmenuitemを参照する',
            },
          },
          {
            name: 'aria-checked',
            description: {
              en: 'Checkbox/radio items have correct checked state',
              ja: 'チェックボックス/ラジオアイテムが正しいチェック状態を持つ',
            },
          },
          {
            name: 'aria-hidden',
            description: {
              en: 'Menu has aria-hidden="true" when closed, "false" when open',
              ja: 'メニューが閉じているときaria-hidden="true"、開いているとき"false"',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction - Menubar', ja: 'APGキーボード操作 - メニューバー' },
        testType: 'E2E',
        items: [
          {
            name: 'ArrowRight',
            description: {
              en: 'Moves focus to next menubar item (wraps)',
              ja: '次のメニューバーアイテムにフォーカスを移動（ラップ）',
            },
          },
          {
            name: 'ArrowLeft',
            description: {
              en: 'Moves focus to previous menubar item (wraps)',
              ja: '前のメニューバーアイテムにフォーカスを移動（ラップ）',
            },
          },
          {
            name: 'ArrowDown',
            description: {
              en: 'Opens submenu and focuses first item',
              ja: 'サブメニューを開き、最初のアイテムにフォーカス',
            },
          },
          {
            name: 'ArrowUp',
            description: {
              en: 'Opens submenu and focuses last item',
              ja: 'サブメニューを開き、最後のアイテムにフォーカス',
            },
          },
          { name: 'Enter/Space', description: { en: 'Opens submenu', ja: 'サブメニューを開く' } },
          {
            name: 'Home',
            description: {
              en: 'Moves focus to first menubar item',
              ja: '最初のメニューバーアイテムにフォーカスを移動',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Moves focus to last menubar item',
              ja: '最後のメニューバーアイテムにフォーカスを移動',
            },
          },
          {
            name: 'Tab',
            description: {
              en: 'Closes all menus, moves focus out',
              ja: 'すべてのメニューを閉じ、フォーカスを外に移動',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction - Menu', ja: 'APGキーボード操作 - メニュー' },
        testType: 'E2E',
        items: [
          {
            name: 'ArrowDown',
            description: {
              en: 'Moves focus to next item (wraps)',
              ja: '次のアイテムにフォーカスを移動（ラップ）',
            },
          },
          {
            name: 'ArrowUp',
            description: {
              en: 'Moves focus to previous item (wraps)',
              ja: '前のアイテムにフォーカスを移動（ラップ）',
            },
          },
          {
            name: 'ArrowRight',
            description: {
              en: 'Opens submenu if present, or moves to next menubar menu',
              ja: 'サブメニューがあれば開く、または次のメニューバーメニューに移動',
            },
          },
          {
            name: 'ArrowLeft',
            description: {
              en: 'Closes submenu, or moves to previous menubar menu',
              ja: 'サブメニューを閉じる、または前のメニューバーメニューに移動',
            },
          },
          {
            name: 'Enter/Space',
            description: {
              en: 'Activates item and closes menu',
              ja: 'アイテムを実行してメニューを閉じる',
            },
          },
          {
            name: 'Escape',
            description: {
              en: 'Closes menu, returns focus to parent',
              ja: 'メニューを閉じ、フォーカスを親に戻す',
            },
          },
          {
            name: 'Home/End',
            description: {
              en: 'Moves focus to first/last item',
              ja: '最初/最後のアイテムにフォーカスを移動',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Checkbox and Radio Items', ja: 'チェックボックスとラジオアイテム' },
        testType: 'E2E',
        items: [
          {
            name: 'Checkbox toggle',
            description: {
              en: 'Space/Enter toggles checkbox',
              ja: 'Space/Enterでチェックボックスを切り替え',
            },
          },
          {
            name: 'Checkbox keeps open',
            description: { en: 'Toggle does not close menu', ja: '切り替えでメニューが閉じない' },
          },
          {
            name: 'aria-checked update',
            description: {
              en: 'aria-checked updates on toggle',
              ja: '切り替えでaria-checkedが更新される',
            },
          },
          {
            name: 'Radio select',
            description: { en: 'Space/Enter selects radio', ja: 'Space/Enterでラジオを選択' },
          },
          {
            name: 'Radio keeps open',
            description: { en: 'Selection does not close menu', ja: '選択でメニューが閉じない' },
          },
          {
            name: 'Exclusive selection',
            description: {
              en: 'Only one radio in group can be checked',
              ja: 'グループ内で1つのラジオのみがチェック可能',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Focus Management (Roving Tabindex)',
          ja: 'フォーカス管理（Roving Tabindex）',
        },
        testType: 'E2E',
        items: [
          {
            name: 'tabIndex=0',
            description: {
              en: 'First menubar item has tabIndex=0',
              ja: '最初のメニューバーアイテムがtabIndex=0を持つ',
            },
          },
          {
            name: 'tabIndex=-1',
            description: {
              en: 'Other items have tabIndex=-1',
              ja: '他のアイテムがtabIndex=-1を持つ',
            },
          },
          {
            name: 'Separator',
            description: { en: 'Separator is not focusable', ja: '区切り線はフォーカス不可' },
          },
          {
            name: 'Disabled items',
            description: {
              en: 'Disabled items are focusable but not activatable',
              ja: '無効なアイテムはフォーカス可能だが実行不可',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Type-Ahead Search', ja: '先行入力検索' },
        testType: 'E2E',
        items: [
          {
            name: 'Character match',
            description: {
              en: 'Focuses item starting with typed character',
              ja: '入力された文字で始まるアイテムにフォーカス',
            },
          },
          {
            name: 'Wrap around',
            description: {
              en: 'Search wraps from end to beginning',
              ja: '検索が末尾から先頭にラップ',
            },
          },
          {
            name: 'Skip separator',
            description: { en: 'Skips separator during search', ja: '検索時に区切り線をスキップ' },
          },
          {
            name: 'Skip disabled',
            description: {
              en: 'Skips disabled items during search',
              ja: '検索時に無効なアイテムをスキップ',
            },
          },
          {
            name: 'Buffer reset',
            description: { en: 'Buffer resets after 500ms', ja: '500ms後にバッファがリセット' },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Pointer Interaction', ja: 'ポインタ操作' },
        testType: 'E2E',
        items: [
          {
            name: 'Click open',
            description: {
              en: 'Click menubar item opens menu',
              ja: 'メニューバーアイテムをクリックでメニューを開く',
            },
          },
          {
            name: 'Click toggle',
            description: {
              en: 'Click menubar item again closes menu',
              ja: '再度クリックでメニューを閉じる',
            },
          },
          {
            name: 'Hover switch',
            description: {
              en: 'Hover on another menubar item switches menu (when open)',
              ja: 'メニューが開いているとき他のアイテムにホバーでメニュー切り替え',
            },
          },
          {
            name: 'Item click',
            description: {
              en: 'Click menuitem activates and closes menu',
              ja: 'menuitemをクリックで実行してメニューを閉じる',
            },
          },
          {
            name: 'Click outside',
            description: {
              en: 'Click outside closes menu',
              ja: '外側をクリックでメニューを閉じる',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility', ja: 'アクセシビリティ' },
        testType: 'E2E',
        items: [
          {
            name: 'axe closed',
            description: {
              en: 'No violations when menubar is closed',
              ja: 'メニューバーが閉じているとき違反なし',
            },
          },
          {
            name: 'axe menu open',
            description: {
              en: 'No violations with menu open',
              ja: 'メニューが開いているとき違反なし',
            },
          },
          {
            name: 'axe submenu open',
            description: {
              en: 'No violations with submenu open',
              ja: 'サブメニューが開いているとき違反なし',
            },
          },
        ],
      },
    ],
    commands: [],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: { en: 'Test runner for unit tests', ja: 'ユニットテスト用テストランナー' },
      },
      {
        name: 'Testing Library',
        url: 'https://testing-library.com/',
        description: {
          en: 'Framework-specific testing utilities (React, Vue, Svelte)',
          ja: 'フレームワーク固有のテストユーティリティ（React、Vue、Svelte）',
        },
      },
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: { en: 'Browser automation for E2E tests', ja: 'E2Eテスト用ブラウザ自動化' },
      },
      {
        name: 'axe-core/playwright',
        url: 'https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright',
        description: {
          en: 'Automated accessibility testing in E2E',
          ja: 'E2Eでの自動アクセシビリティテスト',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  testChecklist: [
    { description: 'Container has role="menubar"', priority: 'high', category: 'aria' },
    { description: 'Dropdown has role="menu"', priority: 'high', category: 'aria' },
    {
      description: 'Items have correct role (menuitem/menuitemcheckbox/menuitemradio)',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Separator has role="separator"', priority: 'high', category: 'aria' },
    {
      description: 'Radio group has role="group" with aria-label',
      priority: 'high',
      category: 'aria',
    },
    { description: 'All <li> have role="none"', priority: 'high', category: 'aria' },
    { description: 'Submenu holder has aria-haspopup="menu"', priority: 'high', category: 'aria' },
    { description: 'Submenu holder has aria-expanded', priority: 'high', category: 'aria' },
    {
      description: 'Submenu has aria-labelledby referencing parent menuitem',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Checkbox/radio has aria-checked', priority: 'high', category: 'aria' },
    { description: 'Closed menu has aria-hidden="true"', priority: 'high', category: 'aria' },
    {
      description: 'ArrowRight moves to next menubar item (wrap)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowLeft moves to previous menubar item (wrap)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowDown opens submenu, focuses first item',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowUp opens submenu, focuses last item',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Enter/Space opens submenu', priority: 'high', category: 'keyboard' },
    {
      description: 'Tab/Shift+Tab moves out, closes all menus',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Checkbox toggle does not close menu', priority: 'high', category: 'keyboard' },
    { description: 'Radio selection does not close menu', priority: 'high', category: 'keyboard' },
    {
      description: 'Only one radio in group can be checked',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'First menubar item has tabIndex="0"', priority: 'high', category: 'focus' },
    { description: 'Other items have tabIndex="-1"', priority: 'high', category: 'focus' },
    { description: 'Separator is not focusable', priority: 'high', category: 'focus' },
    {
      description: 'Disabled items are focusable but not activatable',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Click menubar item opens/closes menu', priority: 'high', category: 'click' },
    { description: 'Hover switches menu when open', priority: 'high', category: 'click' },
    { description: 'Click outside closes menu', priority: 'high', category: 'click' },
    { description: 'No axe-core violations', priority: 'medium', category: 'accessibility' },
  ],

  implementationNotes: `
Structure:

┌─────────────────────────────────────────────────────────────┐
│ <ul role="menubar" aria-label="Application">                │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│ │ <li       │ │ <li       │ │ <li       │ │ <li       │    │
│ │  role=    │ │  role=    │ │  role=    │ │  role=    │    │
│ │  none>    │ │  none>    │ │  none>    │ │  none>    │    │
│ │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │    │
│ │ │menuitem│ │ │ │menuitem│ │ │ │menuitem│ │ │ │menuitem│ │   │
│ │ │"File" │ │ │ │"Edit" │ │ │ │"View" │ │ │ │"Help" │ │    │
│ │ │tabindex│ │ │ │tabindex│ │ │ │tabindex│ │ │ │       │ │    │
│ │ │=0      │ │ │ │=-1     │ │ │ │=-1     │ │ │ │       │ │    │
│ │ │aria-   │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │haspopup│ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │="menu" │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │aria-   │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │expanded│ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ └───┬───┘ │ │ └────────┘ │ │ └────────┘ │ │ └───────┘ │    │
│ └─────┼─────┘ └───────────┘ └───────────┘ └───────────┘    │
│       ▼                                                      │
│ ┌─────────────────────────────┐                              │
│ │ <ul role="menu"             │                              │
│ │  aria-labelledby="file-btn">│  ← References parent        │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <span role="menuitem"> │ │                              │
│ │ │   New                   │ │                              │
│ │ └─────────────────────────┘ │                              │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <hr role="separator">  │ │                              │
│ │ └─────────────────────────┘ │                              │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <span role=            │ │                              │
│ │ │   "menuitemcheckbox"    │ │                              │
│ │ │   aria-checked="true">  │ │                              │
│ │ │   Auto Save             │ │                              │
│ │ └─────────────────────────┘ │                              │
│ └─────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘

Critical Implementation Points:
1. All <li> must have role="none" to hide list semantics
2. aria-haspopup="menu" - use explicit "menu", not true
3. Submenu aria-labelledby - must reference parent menuitem ID
4. Checkbox/radio activation keeps menu open - unlike regular menuitem
5. Hover menu switching - only when a menu is already open
6. Context-dependent ←/→ - behavior differs in menubar vs menu vs submenu
`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Menubar horizontal navigation
it('ArrowRight moves to next menubar item', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const fileItem = screen.getByRole('menuitem', { name: 'File' });
  fileItem.focus();

  await user.keyboard('{ArrowRight}');

  expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
});

// Open submenu
it('ArrowDown opens submenu and focuses first item', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const fileItem = screen.getByRole('menuitem', { name: 'File' });
  fileItem.focus();

  await user.keyboard('{ArrowDown}');

  expect(fileItem).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
});

// Checkbox toggle keeps menu open
it('checkbox toggle does not close menu', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const viewItem = screen.getByRole('menuitem', { name: 'View' });
  await user.click(viewItem);

  const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
  checkbox.focus();

  await user.keyboard('{Space}');

  // Menu should still be open
  expect(viewItem).toHaveAttribute('aria-expanded', 'true');
  expect(checkbox).toHaveAttribute('aria-checked', 'true');
});

// li elements have role="none"
it('all li elements have role="none"', () => {
  render(<Menubar items={menuItems} aria-label="Application" />);

  const listItems = document.querySelectorAll('li');
  listItems.forEach(li => {
    expect(li).toHaveAttribute('role', 'none');
  });
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/menubar/react/demo/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const menubar = page.getByRole('menubar');
  await expect(menubar).toBeVisible();

  // Check aria-haspopup="menu" (not "true")
  const fileItem = page.getByRole('menuitem', { name: 'File' });
  const haspopup = await fileItem.getAttribute('aria-haspopup');
  expect(haspopup).toBe('menu');

  // Check all li elements have role="none"
  const listItems = page.locator('li');
  const count = await listItems.count();
  for (let i = 0; i < count; i++) {
    await expect(listItems.nth(i)).toHaveAttribute('role', 'none');
  }
});

// Keyboard navigation test
test('ArrowDown opens submenu and focuses first item', async ({ page }) => {
  const fileItem = page.getByRole('menuitem', { name: 'File' });
  await fileItem.focus();
  await page.keyboard.press('ArrowDown');

  await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

  const menu = page.getByRole('menu');
  const firstMenuItem = menu.getByRole('menuitem').first();
  await expect(firstMenuItem).toBeFocused();
});

// Checkbox/Radio behavior test
test('checkbox toggle keeps menu open', async ({ page }) => {
  const viewItem = page.getByRole('menuitem', { name: 'View' });
  await viewItem.click();

  const checkbox = page.getByRole('menuitemcheckbox').first();
  const initialChecked = await checkbox.getAttribute('aria-checked');
  await checkbox.focus();
  await page.keyboard.press('Space');

  // Menu should still be open
  await expect(viewItem).toHaveAttribute('aria-expanded', 'true');
  // aria-checked should have toggled
  const newChecked = await checkbox.getAttribute('aria-checked');
  expect(newChecked).not.toBe(initialChecked);
});`,
};
