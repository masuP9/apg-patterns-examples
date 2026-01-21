import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const menuButtonAccessibilityData: PatternAccessibilityData = {
  pattern: 'menu-button',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/',

  overview: {
    en: 'A menu button is a button that opens a menu. The button element has aria-haspopup="menu" and controls a dropdown menu containing menu items.',
    ja: 'メニューボタンは、メニューを開くボタンです。ボタン要素はaria-haspopup="menu"を持ち、メニュー項目を含むドロップダウンメニューを制御します。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'button',
      element: {
        en: 'Trigger (<button>)',
        ja: 'トリガー（<button>）',
      },
      description: {
        en: 'The trigger that opens the menu (implicit via <button> element)',
        ja: 'メニューを開くトリガー（<button>要素による暗黙的なロール）',
      },
    },
    {
      name: 'menu',
      element: {
        en: 'Container (<ul>)',
        ja: 'コンテナ（<ul>）',
      },
      description: {
        en: 'A widget offering a list of choices to the user',
        ja: 'ユーザーに選択肢のリストを提供するウィジェット',
      },
    },
    {
      name: 'menuitem',
      element: {
        en: 'Each item (<li>)',
        ja: '各アイテム（<li>）',
      },
      description: {
        en: 'An option in a menu',
        ja: 'メニュー内のオプション',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-haspopup',
      element: 'button',
      values: '"menu"',
      required: true,
      notes: {
        en: 'Indicates the button opens a menu',
        ja: 'ボタンがメニューを開くことを示す',
      },
    },
    {
      attribute: 'aria-controls',
      element: 'button',
      values: {
        en: 'ID reference',
        ja: 'ID参照',
      },
      required: false,
      notes: {
        en: 'References the menu element',
        ja: 'メニュー要素を参照する',
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
        en: 'Yes (or aria-label)',
        ja: 'はい（またはaria-label）',
      },
      notes: {
        en: 'References the button that opens the menu',
        ja: 'メニューを開くボタンを参照する',
      },
    },
    {
      attribute: 'aria-label',
      element: 'menu',
      values: {
        en: 'String',
        ja: '文字列',
      },
      required: {
        en: 'Yes (or aria-labelledby)',
        ja: 'はい（またはaria-labelledby）',
      },
      notes: {
        en: 'Provides an accessible name for the menu',
        ja: 'メニューのアクセシブルな名前を提供する',
      },
    },
    {
      attribute: 'aria-disabled',
      element: 'menuitem',
      values: 'true',
      required: false,
      notes: {
        en: 'Indicates the menu item is disabled',
        ja: 'メニューアイテムが無効であることを示す',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-expanded',
      element: 'button',
      values: 'true | false',
      required: true,
      changeTrigger: {
        en: 'Open/close menu',
        ja: 'メニューを開く/閉じる',
      },
      reference: 'https://w3c.github.io/aria/#aria-expanded',
    },
  ],

  // --- Keyboard Support ---

  keyboardSections: [
    {
      title: {
        en: 'Button (Closed Menu)',
        ja: 'ボタン（メニューが閉じている状態）',
      },
      shortcuts: [
        {
          key: 'Enter / Space',
          action: {
            en: 'Open menu and focus first item',
            ja: 'メニューを開き、最初のアイテムにフォーカスを移動する',
          },
        },
        {
          key: 'Down Arrow',
          action: {
            en: 'Open menu and focus first item',
            ja: 'メニューを開き、最初のアイテムにフォーカスを移動する',
          },
        },
        {
          key: 'Up Arrow',
          action: {
            en: 'Open menu and focus last item',
            ja: 'メニューを開き、最後のアイテムにフォーカスを移動する',
          },
        },
      ],
    },
    {
      title: {
        en: 'Menu (Open)',
        ja: 'メニュー（開いている状態）',
      },
      shortcuts: [
        {
          key: 'Down Arrow',
          action: {
            en: 'Move focus to next item (wraps to first)',
            ja: '次のアイテムにフォーカスを移動する（最後の項目から最初にラップする）',
          },
        },
        {
          key: 'Up Arrow',
          action: {
            en: 'Move focus to previous item (wraps to last)',
            ja: '前のアイテムにフォーカスを移動する（最初の項目から最後にラップする）',
          },
        },
        {
          key: 'Home',
          action: {
            en: 'Move focus to first item',
            ja: '最初のアイテムにフォーカスを移動する',
          },
        },
        {
          key: 'End',
          action: {
            en: 'Move focus to last item',
            ja: '最後のアイテムにフォーカスを移動する',
          },
        },
        {
          key: 'Escape',
          action: {
            en: 'Close menu and return focus to button',
            ja: 'メニューを閉じ、フォーカスをボタンに戻す',
          },
        },
        {
          key: 'Tab',
          action: {
            en: 'Close menu and move focus to next focusable element',
            ja: 'メニューを閉じ、次のフォーカス可能な要素にフォーカスを移動する',
          },
        },
        {
          key: 'Enter / Space',
          action: {
            en: 'Activate focused item and close menu',
            ja: 'フォーカスされたアイテムを実行し、メニューを閉じる',
          },
        },
        {
          key: 'Type character',
          action: {
            en: 'Type-ahead: focus item starting with typed character(s)',
            ja: '先行入力: 入力された文字で始まるアイテムにフォーカスを移動する',
          },
        },
      ],
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: {
        en: 'Focused menu item',
        ja: 'フォーカスされたメニューアイテム',
      },
      behavior: 'tabIndex="0"',
    },
    {
      event: {
        en: 'Other menu items',
        ja: 'その他のメニューアイテム',
      },
      behavior: 'tabIndex="-1"',
    },
    {
      event: {
        en: 'Arrow key navigation',
        ja: '矢印キーナビゲーション',
      },
      behavior: {
        en: 'Wraps from last to first and vice versa',
        ja: '最後から最初へ、またはその逆にラップする',
      },
    },
    {
      event: {
        en: 'Disabled items',
        ja: '無効なアイテム',
      },
      behavior: {
        en: 'Skipped during navigation',
        ja: 'ナビゲーション中にスキップされる',
      },
    },
    {
      event: {
        en: 'Menu closes',
        ja: 'メニューが閉じる',
      },
      behavior: {
        en: 'Focus returns to button',
        ja: 'フォーカスがボタンに戻る',
      },
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'When closed, the menu uses both hidden and inert attributes to hide the menu from visual display, remove it from the accessibility tree, and prevent keyboard and mouse interaction with hidden items.',
      ja: '閉じているとき、メニューはhiddenとinert属性の両方を使用して、視覚的な表示からメニューを隠し、アクセシビリティツリーから削除し、非表示のアイテムに対するキーボードとマウスの操作を防ぎます。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA menu role',
      url: 'https://w3c.github.io/aria/#menu',
    },
  ],

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: {
          en: 'Unit Tests (Testing Library)',
          ja: 'ユニットテスト（Testing Library）',
        },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用してコンポーネントのレンダリング出力を検証します。これらのテストは正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (aria-haspopup, aria-expanded, aria-controls)',
            ja: 'ARIA属性（aria-haspopup、aria-expanded、aria-controls）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Enter, Space, Escape)',
            ja: 'キーボード操作（矢印キー、Enter、Space、Escape）',
          },
          {
            en: 'Type-ahead search functionality',
            ja: '先行入力検索機能',
          },
          {
            en: 'Roving tabindex behavior',
            ja: 'ローヴィングタブインデックスの動作',
          },
          {
            en: 'Accessibility via jest-axe',
            ja: 'jest-axeによるアクセシビリティ検証',
          },
        ],
      },
      {
        type: 'e2e',
        title: {
          en: 'E2E Tests (Playwright)',
          ja: 'E2Eテスト（Playwright）',
        },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: 'すべてのフレームワークにわたって実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストは操作とフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          {
            en: 'Mouse interactions (click to open/close)',
            ja: 'マウス操作（クリックで開く/閉じる）',
          },
          {
            en: 'Keyboard navigation with wrapping',
            ja: 'ラップを含むキーボードナビゲーション',
          },
          {
            en: 'Type-ahead search in live browser',
            ja: 'ライブブラウザでの先行入力検索',
          },
          {
            en: 'ARIA structure validation',
            ja: 'ARIA構造の検証',
          },
          {
            en: 'axe-core accessibility scanning',
            ja: 'axe-coreアクセシビリティスキャン',
          },
          {
            en: 'Cross-framework consistency checks',
            ja: 'フレームワーク間の一貫性チェック',
          },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: {
          en: 'APG Mouse Interaction',
          ja: 'APG マウス操作',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Button click',
            description: {
              en: 'Opens menu on button click',
              ja: 'ボタンをクリックするとメニューが開く',
            },
          },
          {
            name: 'Toggle',
            description: {
              en: 'Clicking button again closes menu',
              ja: 'ボタンを再度クリックするとメニューが閉じる',
            },
          },
          {
            name: 'Item click',
            description: {
              en: 'Clicking menu item activates and closes menu',
              ja: 'メニューアイテムをクリックすると実行され、メニューが閉じる',
            },
          },
          {
            name: 'Disabled item click',
            description: {
              en: 'Clicking disabled item does nothing',
              ja: '無効なアイテムをクリックしても何も起こらない',
            },
          },
          {
            name: 'Click outside',
            description: {
              en: 'Clicking outside menu closes it',
              ja: 'メニューの外側をクリックするとメニューが閉じる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'APG Keyboard Interaction (Button)',
          ja: 'APG キーボード操作（ボタン）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Enter',
            description: {
              en: 'Opens menu, focuses first enabled item',
              ja: 'メニューを開き、最初の有効なアイテムにフォーカスを移動する',
            },
          },
          {
            name: 'Space',
            description: {
              en: 'Opens menu, focuses first enabled item',
              ja: 'メニューを開き、最初の有効なアイテムにフォーカスを移動する',
            },
          },
          {
            name: 'ArrowDown',
            description: {
              en: 'Opens menu, focuses first enabled item',
              ja: 'メニューを開き、最初の有効なアイテムにフォーカスを移動する',
            },
          },
          {
            name: 'ArrowUp',
            description: {
              en: 'Opens menu, focuses last enabled item',
              ja: 'メニューを開き、最後の有効なアイテムにフォーカスを移動する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'APG Keyboard Interaction (Menu)',
          ja: 'APG キーボード操作（メニュー）',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'ArrowDown',
            description: {
              en: 'Moves focus to next enabled item (wraps)',
              ja: '次の有効なアイテムにフォーカスを移動する（ラップする）',
            },
          },
          {
            name: 'ArrowUp',
            description: {
              en: 'Moves focus to previous enabled item (wraps)',
              ja: '前の有効なアイテムにフォーカスを移動する（ラップする）',
            },
          },
          {
            name: 'Home',
            description: {
              en: 'Moves focus to first enabled item',
              ja: '最初の有効なアイテムにフォーカスを移動する',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Moves focus to last enabled item',
              ja: '最後の有効なアイテムにフォーカスを移動する',
            },
          },
          {
            name: 'Escape',
            description: {
              en: 'Closes menu, returns focus to button',
              ja: 'メニューを閉じ、フォーカスをボタンに戻す',
            },
          },
          {
            name: 'Tab',
            description: {
              en: 'Closes menu, moves focus out',
              ja: 'メニューを閉じ、フォーカスを外に移動する',
            },
          },
          {
            name: 'Enter/Space',
            description: {
              en: 'Activates item and closes menu',
              ja: 'アイテムを実行し、メニューを閉じる',
            },
          },
          {
            name: 'Disabled skip',
            description: {
              en: 'Skips disabled items during navigation',
              ja: 'ナビゲーション中に無効なアイテムをスキップする',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Type-Ahead Search',
          ja: '先行入力検索',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Single character',
            description: {
              en: 'Focuses first item starting with typed character',
              ja: '入力された文字で始まる最初のアイテムにフォーカスを移動する',
            },
          },
          {
            name: 'Multiple characters',
            description: {
              en: 'Typed within 500ms form prefix search string',
              ja: '500ms以内に入力された文字がプレフィックス検索文字列を形成する',
            },
          },
          {
            name: 'Wrap around',
            description: {
              en: 'Search wraps from end to beginning',
              ja: '検索が終わりから始まりにラップする',
            },
          },
          {
            name: 'Buffer reset',
            description: {
              en: 'Buffer resets after 500ms of inactivity',
              ja: '500msの非アクティブ後にバッファがリセットされる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'APG ARIA Attributes',
          ja: 'APG ARIA 属性',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-haspopup',
            description: {
              en: 'Button has aria-haspopup="menu"',
              ja: 'ボタンがaria-haspopup="menu"を持つ',
            },
          },
          {
            name: 'aria-expanded',
            description: {
              en: 'Button reflects open state (true/false)',
              ja: 'ボタンが開いている状態を反映する（true/false）',
            },
          },
          {
            name: 'aria-controls',
            description: {
              en: 'Button references menu ID',
              ja: 'ボタンがメニューのIDを参照する',
            },
          },
          {
            name: 'role="menu"',
            description: {
              en: 'Menu container has menu role',
              ja: 'メニューコンテナがmenuロールを持つ',
            },
          },
          {
            name: 'role="menuitem"',
            description: {
              en: 'Each item has menuitem role',
              ja: '各アイテムがmenuitemロールを持つ',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Menu references button for accessible name',
              ja: 'メニューがアクセシブルな名前のためにボタンを参照する',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled items have aria-disabled="true"',
              ja: '無効なアイテムがaria-disabled="true"を持つ',
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
        testType: 'Unit + E2E',
        items: [
          {
            name: 'tabIndex=0',
            description: {
              en: 'Focused item has tabIndex=0',
              ja: 'フォーカスされたアイテムがtabIndex=0を持つ',
            },
          },
          {
            name: 'tabIndex=-1',
            description: {
              en: 'Non-focused items have tabIndex=-1',
              ja: 'フォーカスされていないアイテムがtabIndex=-1を持つ',
            },
          },
          {
            name: 'Initial focus',
            description: {
              en: 'First enabled item receives focus when menu opens',
              ja: 'メニューが開くと最初の有効なアイテムがフォーカスを受け取る',
            },
          },
          {
            name: 'Focus return',
            description: {
              en: 'Focus returns to button when menu closes',
              ja: 'メニューが閉じるとフォーカスがボタンに戻る',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Accessibility',
          ja: 'アクセシビリティ',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations (via jest-axe)',
              ja: 'WCAG 2.1 AA違反がないこと（jest-axe経由）',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/menu-button.spec.ts',
    commands: [
      {
        comment: {
          en: 'Run unit tests for MenuButton',
          ja: 'MenuButtonのユニットテストを実行',
        },
        command: 'npm run test -- menu-button',
      },
      {
        comment: {
          en: 'Run E2E tests for MenuButton (all frameworks)',
          ja: 'MenuButtonのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=menu-button',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークのE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=menu-button',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: {
          en: 'Test runner for unit tests',
          ja: 'ユニットテストランナー',
        },
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
        description: {
          en: 'E2E testing (136 cross-framework tests)',
          ja: 'E2Eテスト（136のクロスフレームワークテスト）',
        },
      },
      {
        name: '@axe-core/playwright',
        url: 'https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright',
        description: {
          en: 'Automated accessibility testing',
          ja: '自動アクセシビリティテスト',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // Mouse - High Priority
    { description: 'Click button opens menu', priority: 'high', category: 'click' },
    { description: 'Click button again closes menu (toggle)', priority: 'high', category: 'click' },
    {
      description: 'Click menu item activates and closes menu',
      priority: 'high',
      category: 'click',
    },
    { description: 'Click disabled item does nothing', priority: 'high', category: 'click' },
    { description: 'Click outside menu closes it', priority: 'high', category: 'click' },

    // Keyboard (Button) - High Priority
    {
      description: 'Enter opens menu, focuses first enabled item',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Space opens menu, focuses first enabled item',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowDown opens menu, focuses first enabled item',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowUp opens menu, focuses last enabled item',
      priority: 'high',
      category: 'keyboard',
    },

    // Keyboard (Menu) - High Priority
    {
      description: 'ArrowDown moves to next item (wraps)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowUp moves to previous item (wraps)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Home moves to first enabled item', priority: 'high', category: 'keyboard' },
    { description: 'End moves to last enabled item', priority: 'high', category: 'keyboard' },
    {
      description: 'Escape closes menu, returns focus to button',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Tab closes menu', priority: 'high', category: 'keyboard' },
    {
      description: 'Enter/Space activates item, closes menu',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Disabled items are skipped', priority: 'high', category: 'keyboard' },

    // Type-Ahead - High Priority
    {
      description: 'Single character focuses matching item',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Multiple characters match prefix', priority: 'high', category: 'keyboard' },
    { description: 'Search wraps around', priority: 'high', category: 'keyboard' },
    { description: 'Buffer resets after 500ms', priority: 'high', category: 'keyboard' },

    // ARIA - High Priority
    { description: 'Button has role="button"', priority: 'high', category: 'aria' },
    { description: 'Button has aria-haspopup="menu"', priority: 'high', category: 'aria' },
    { description: 'Button has aria-expanded (true/false)', priority: 'high', category: 'aria' },
    { description: 'Button has aria-controls linking to menu', priority: 'high', category: 'aria' },
    { description: 'Menu has role="menu"', priority: 'high', category: 'aria' },
    { description: 'Menu has accessible name', priority: 'high', category: 'aria' },
    { description: 'Items have role="menuitem"', priority: 'high', category: 'aria' },
    { description: 'Disabled items have aria-disabled="true"', priority: 'high', category: 'aria' },

    // Focus Management - High Priority
    {
      description: 'Only focused item has tabIndex="0"',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Other items have tabIndex="-1"', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`html
Structure (closed):
<button
  aria-haspopup="menu"
  aria-expanded="false"
  aria-controls="menu-id"
>
  Actions ▼
</button>
<ul id="menu-id" role="menu" aria-labelledby="button-id" hidden>
  <li role="menuitem" tabindex="-1">Cut</li>
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
</ul>

Structure (open):
<button
  aria-haspopup="menu"
  aria-expanded="true"
  aria-controls="menu-id"
>
  Actions ▼
</button>
<ul id="menu-id" role="menu" aria-labelledby="button-id">
  <li role="menuitem" tabindex="0">Cut</li>      <!-- focused -->
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
</ul>

With disabled item:
<li role="menuitem" aria-disabled="true" tabindex="-1">Export</li>
\`\`\`

## Type-Ahead Search

- Characters typed within 500ms form search string
- After 500ms idle, buffer resets
- Search is case-insensitive
- Wraps from end to beginning

## Focus Management (Roving Tabindex)

- Only one menu item has \`tabIndex="0"\`
- Other items have \`tabIndex="-1"\`
- Disabled items are skipped during keyboard navigation
- Focus wraps from last to first (and vice versa)`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Open menu with Enter
it('Enter opens menu and focuses first item', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" />);

  const button = screen.getByRole('button', { name: 'Actions' });
  button.focus();

  await user.keyboard('{Enter}');

  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
});

// Arrow navigation with wrap
it('ArrowDown wraps from last to first', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  screen.getByRole('menuitem', { name: 'Delete' }).focus(); // last item

  await user.keyboard('{ArrowDown}');

  expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
});

// Escape closes menu
it('Escape closes menu and returns focus to button', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  const button = screen.getByRole('button');

  await user.keyboard('{Escape}');

  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(button).toHaveFocus();
});

// Type-ahead
it('type-ahead focuses matching item', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  screen.getByRole('menuitem', { name: 'Cut' }).focus();

  await user.keyboard('p');

  expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
});

// Click outside closes menu
it('clicking outside closes menu', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  await user.click(document.body);

  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';

// Helper functions
const getMenuButton = (page) => page.getByRole('button', { name: /actions/i }).first();
const getMenu = (page) => page.getByRole('menu');
const getMenuItems = (page) => page.getByRole('menuitem');

const openMenu = async (page) => {
  const button = getMenuButton(page);
  await button.click();
  await getMenu(page).waitFor({ state: 'visible' });
  return button;
};

// ARIA structure tests
test('button has correct ARIA attributes', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  const button = getMenuButton(page);

  await expect(button).toHaveAttribute('aria-haspopup', 'menu');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toHaveAttribute('aria-controls', /.+/);
});

// Keyboard interaction
test('Enter opens menu and focuses first item', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  const button = getMenuButton(page);
  await button.focus();
  await page.keyboard.press('Enter');

  await expect(getMenu(page)).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(getMenuItems(page).first()).toBeFocused();
});

// Type-ahead (use trim() for frameworks with whitespace in textContent)
test('type-ahead focuses matching item', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  await openMenu(page);
  await expect(getMenuItems(page).first()).toBeFocused();

  await page.keyboard.press('p');

  await expect
    .poll(async () => {
      const text = await page.evaluate(
        () => document.activeElement?.textContent?.trim().toLowerCase() || ''
      );
      return text.startsWith('p');
    })
    .toBe(true);
});

// axe-core accessibility
test('no accessibility violations', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  await openMenu(page);

  const results = await new AxeBuilder({ page })
    .include('.apg-menu-button')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
