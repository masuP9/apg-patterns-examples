import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const comboboxAccessibilityData: PatternAccessibilityData = {
  pattern: 'combobox',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',

  overview: {
    en: 'A combobox is a composite widget with a text input field and an associated popup (listbox). Users can either type a value or select from the popup.',
    ja: 'コンボボックスはテキスト入力フィールドと関連するポップアップ（リストボックス）を持つ複合ウィジェットです。ユーザーは値を入力するか、ポップアップから選択できます。',
  },

  roles: [
    {
      name: 'combobox',
      element: 'Input (`<input>`)',
      description: {
        en: 'The text input element that users type into',
        ja: 'ユーザーが入力するテキスト入力要素',
      },
    },
    {
      name: 'listbox',
      element: 'Popup (`<ul>`)',
      description: {
        en: 'The popup containing selectable options',
        ja: '選択可能なオプションを含むポップアップ',
      },
    },
    {
      name: 'option',
      element: 'Each item (`<li>`)',
      description: {
        en: 'An individual selectable option',
        ja: '個々の選択可能なオプション',
      },
    },
  ],

  properties: [
    {
      attribute: 'role="combobox"',
      element: 'input',
      values: '-',
      required: true,
      notes: {
        en: 'Identifies the input as a combobox',
        ja: '入力をコンボボックスとして識別',
      },
    },
    {
      attribute: 'aria-controls',
      element: 'input',
      values: 'ID reference',
      required: true,
      notes: {
        en: 'References the listbox popup (even when closed)',
        ja: 'リストボックスポップアップを参照（閉じている時も）',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-controls',
    },
    {
      attribute: 'aria-expanded',
      element: 'input',
      values: '`true` | `false`',
      required: true,
      notes: {
        en: 'Indicates whether the popup is open',
        ja: 'ポップアップが開いているかどうかを示す',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-expanded',
    },
    {
      attribute: 'aria-autocomplete',
      element: 'input',
      values: '`list` | `none` | `both`',
      required: true,
      notes: {
        en: 'Describes the autocomplete behavior',
        ja: 'オートコンプリートの動作を説明',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-autocomplete',
    },
    {
      attribute: 'aria-activedescendant',
      element: 'input',
      values: 'ID reference | empty',
      required: true,
      notes: {
        en: 'References the currently focused option in the popup',
        ja: 'ポップアップ内で現在フォーカスされているオプションを参照',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-activedescendant',
    },
    {
      attribute: 'aria-labelledby',
      element: {
        en: 'input, listbox',
        ja: 'input、listbox',
      },
      values: 'ID reference',
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'References the label element',
        ja: 'ラベル要素を参照',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-labelledby',
    },
    {
      attribute: 'aria-selected',
      element: 'option',
      values: '`true` | `false`',
      required: true,
      notes: {
        en: 'Indicates the currently focused option',
        ja: '現在フォーカスされているオプションを示す',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-selected',
    },
    {
      attribute: 'aria-disabled',
      element: 'option',
      values: '`true`',
      required: false,
      notes: {
        en: 'Indicates the option is disabled',
        ja: 'オプションが無効であることを示す',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  keyboardSupport: [
    // Popup Closed
    {
      key: 'Down Arrow',
      action: {
        en: 'Open popup and focus first option',
        ja: 'ポップアップを開き、最初のオプションにフォーカス',
      },
      section: {
        en: 'Popup Closed',
        ja: 'ポップアップ閉時',
      },
    },
    {
      key: 'Up Arrow',
      action: {
        en: 'Open popup and focus last option',
        ja: 'ポップアップを開き、最後のオプションにフォーカス',
      },
      section: {
        en: 'Popup Closed',
        ja: 'ポップアップ閉時',
      },
    },
    {
      key: 'Alt + Down Arrow',
      action: {
        en: 'Open popup without changing focus position',
        ja: 'フォーカス位置を変更せずにポップアップを開く',
      },
      section: {
        en: 'Popup Closed',
        ja: 'ポップアップ閉時',
      },
    },
    {
      key: {
        en: 'Type characters',
        ja: '文字入力',
      },
      action: {
        en: 'Filter options and open popup',
        ja: 'オプションをフィルタリングしてポップアップを開く',
      },
      section: {
        en: 'Popup Closed',
        ja: 'ポップアップ閉時',
      },
    },
    // Popup Open
    {
      key: 'Down Arrow',
      action: {
        en: 'Move focus to next enabled option (no wrap)',
        ja: '次の有効なオプションにフォーカスを移動（折り返しなし）',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
    {
      key: 'Up Arrow',
      action: {
        en: 'Move focus to previous enabled option (no wrap)',
        ja: '前の有効なオプションにフォーカスを移動（折り返しなし）',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
    {
      key: 'Home',
      action: {
        en: 'Move focus to first enabled option',
        ja: '最初の有効なオプションにフォーカスを移動',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Move focus to last enabled option',
        ja: '最後の有効なオプションにフォーカスを移動',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
    {
      key: 'Enter',
      action: {
        en: 'Select focused option and close popup',
        ja: 'フォーカス中のオプションを選択しポップアップを閉じる',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
    {
      key: 'Escape',
      action: {
        en: 'Close popup and restore previous input value',
        ja: 'ポップアップを閉じ、以前の入力値を復元',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
    {
      key: 'Alt + Up Arrow',
      action: {
        en: 'Select focused option and close popup',
        ja: 'フォーカス中のオプションを選択しポップアップを閉じる',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
    {
      key: 'Tab',
      action: {
        en: 'Close popup and move to next focusable element',
        ja: 'ポップアップを閉じ、次のフォーカス可能な要素に移動',
      },
      section: {
        en: 'Popup Open',
        ja: 'ポップアップ開時',
      },
    },
  ],

  focusManagement: [
    {
      event: {
        en: 'Navigation via arrow keys',
        ja: '矢印キーでナビゲーション',
      },
      behavior: {
        en: 'DOM focus remains on input; aria-activedescendant references the visually focused option',
        ja: 'DOMフォーカスはinputに留まり、aria-activedescendantが視覚的にフォーカスされているオプションを参照',
      },
    },
    {
      event: {
        en: 'Popup closes or filter results are empty',
        ja: 'ポップアップが閉じるかフィルタ結果が空',
      },
      behavior: {
        en: 'aria-activedescendant is cleared',
        ja: 'aria-activedescendantがクリアされる',
      },
    },
    {
      event: {
        en: 'Disabled option encountered',
        ja: '無効なオプションに遭遇',
      },
      behavior: {
        en: 'Disabled options are skipped during navigation',
        ja: 'ナビゲーション中に無効なオプションはスキップされる',
      },
    },
  ],

  additionalNotes: [
    {
      en: '**Listbox always in DOM**: Keep listbox in DOM with `hidden` attribute when closed (for `aria-controls` reference)',
      ja: '**リストボックスは常にDOMに存在**: `aria-controls`参照のため、閉じている時も`hidden`属性を使用してリストボックスをDOMに保持',
    },
    {
      en: '**IME Handling**: Track composition state to prevent filtering during IME input',
      ja: '**IME処理**: IME入力中のフィルタリングを防ぐため、変換状態を追跡',
    },
    {
      en: '**Click Outside**: Use event listener to close popup on outside clicks',
      ja: '**外側クリック**: イベントリスナーを使用して外側クリック時にポップアップを閉じる',
    },
    {
      en: '**Value Restoration**: Store pre-edit value to restore on Escape',
      ja: '**値の復元**: Escapeキーで復元するため、編集前の値を保存',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA APG: Combobox Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/combobox/',
    },
    {
      title: 'WAI-ARIA: combobox role',
      url: 'https://w3c.github.io/aria/#combobox',
    },
  ],

  // Testing Documentation
  testing: {
    strategies: [
      {
        type: 'unit',
        title: {
          en: 'Unit Tests (Testing Library)',
          ja: 'ユニットテスト (Testing Library)',
        },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用してコンポーネントの出力を検証します。正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role, aria-controls, aria-expanded, etc.)',
            ja: 'ARIA属性（role、aria-controls、aria-expandedなど）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Enter, Escape, etc.)',
            ja: 'キーボード操作（矢印キー、Enter、Escapeなど）',
          },
          {
            en: 'Filtering behavior and option rendering',
            ja: 'フィルタリング動作とオプションのレンダリング',
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
          ja: 'E2Eテスト (Playwright)',
        },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: '実際のブラウザ環境で全フレームワークのコンポーネント動作を検証します。インタラクションとクロスフレームワークの一貫性をカバーします。',
        },
        areas: [
          {
            en: 'Keyboard navigation and selection',
            ja: 'キーボードナビゲーションと選択',
          },
          {
            en: 'Mouse interactions (click, hover)',
            ja: 'マウス操作（クリック、ホバー）',
          },
          {
            en: 'ARIA structure in live browser',
            ja: 'ライブブラウザでのARIA構造',
          },
          {
            en: 'Focus management with aria-activedescendant',
            ja: 'aria-activedescendantによるフォーカス管理',
          },
          {
            en: 'axe-core accessibility scanning',
            ja: 'axe-coreによるアクセシビリティスキャン',
          },
          {
            en: 'Cross-framework consistency checks',
            ja: 'クロスフレームワーク一貫性チェック',
          },
        ],
      },
    ],

    categories: [
      {
        priority: 'high',
        title: {
          en: 'ARIA Attributes',
          ja: 'ARIA属性',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="combobox"',
            description: {
              en: 'Input element has the combobox role',
              ja: 'Input要素にcomboboxロールがある',
            },
          },
          {
            name: 'role="listbox"',
            description: {
              en: 'Popup element has the listbox role',
              ja: 'ポップアップ要素にlistboxロールがある',
            },
          },
          {
            name: 'role="option"',
            description: {
              en: 'Each option has the option role',
              ja: '各オプションにoptionロールがある',
            },
          },
          {
            name: 'aria-controls',
            description: {
              en: 'Input references the listbox ID (always present)',
              ja: 'InputがlistboxIDを参照（常に存在）',
            },
          },
          {
            name: 'aria-expanded',
            description: {
              en: 'Reflects popup open/closed state',
              ja: 'ポップアップの開閉状態を反映',
            },
          },
          {
            name: 'aria-autocomplete',
            description: {
              en: 'Set to "list", "none", or "both"',
              ja: '"list"、"none"、"both"のいずれかに設定',
            },
          },
          {
            name: 'aria-activedescendant',
            description: {
              en: 'References currently focused option',
              ja: '現在フォーカスされているオプションを参照',
            },
          },
          {
            name: 'aria-selected',
            description: {
              en: 'Indicates the currently highlighted option',
              ja: '現在ハイライトされているオプションを示す',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Indicates disabled options',
              ja: '無効なオプションを示す',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Keyboard - Popup Closed',
          ja: 'キーボード - ポップアップ閉時',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Down Arrow',
            description: {
              en: 'Opens popup and focuses first option',
              ja: 'ポップアップを開き、最初のオプションにフォーカス',
            },
          },
          {
            name: 'Up Arrow',
            description: {
              en: 'Opens popup and focuses last option',
              ja: 'ポップアップを開き、最後のオプションにフォーカス',
            },
          },
          {
            name: 'Alt + Down Arrow',
            description: {
              en: 'Opens popup without changing focus',
              ja: 'フォーカスを変更せずにポップアップを開く',
            },
          },
          {
            name: 'Typing',
            description: {
              en: 'Opens popup and filters options',
              ja: 'ポップアップを開き、オプションをフィルタリング',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Keyboard - Popup Open',
          ja: 'キーボード - ポップアップ開時',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Down Arrow',
            description: {
              en: 'Moves to next enabled option (no wrap)',
              ja: '次の有効なオプションに移動（折り返しなし）',
            },
          },
          {
            name: 'Up Arrow',
            description: {
              en: 'Moves to previous enabled option (no wrap)',
              ja: '前の有効なオプションに移動（折り返しなし）',
            },
          },
          {
            name: 'Home',
            description: {
              en: 'Moves to first enabled option',
              ja: '最初の有効なオプションに移動',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Moves to last enabled option',
              ja: '最後の有効なオプションに移動',
            },
          },
          {
            name: 'Enter',
            description: {
              en: 'Selects focused option and closes popup',
              ja: 'フォーカス中のオプションを選択しポップアップを閉じる',
            },
          },
          {
            name: 'Escape',
            description: {
              en: 'Closes popup and restores previous value',
              ja: 'ポップアップを閉じ、以前の値を復元',
            },
          },
          {
            name: 'Alt + Up Arrow',
            description: {
              en: 'Selects focused option and closes popup',
              ja: 'フォーカス中のオプションを選択しポップアップを閉じる',
            },
          },
          {
            name: 'Tab',
            description: {
              en: 'Closes popup and moves to next focusable element',
              ja: 'ポップアップを閉じ、次のフォーカス可能な要素に移動',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: {
          en: 'Focus Management',
          ja: 'フォーカス管理',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'DOM focus on input',
            description: {
              en: 'DOM focus remains on input at all times',
              ja: 'DOMフォーカスは常にinputに留まる',
            },
          },
          {
            name: 'Virtual focus via aria-activedescendant',
            description: {
              en: 'Visual focus controlled by aria-activedescendant',
              ja: '視覚的フォーカスはaria-activedescendantで制御',
            },
          },
          {
            name: 'Clear on close',
            description: {
              en: 'aria-activedescendant cleared when popup closes',
              ja: 'ポップアップが閉じるとaria-activedescendantがクリア',
            },
          },
          {
            name: 'Skip disabled options',
            description: {
              en: 'Navigation skips disabled options',
              ja: 'ナビゲーションが無効なオプションをスキップ',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Filtering',
          ja: 'フィルタリング',
        },
        testType: 'Unit',
        items: [
          {
            name: 'Filter on typing',
            description: {
              en: 'Options filtered as user types',
              ja: 'ユーザーが入力するとオプションがフィルタリング',
            },
          },
          {
            name: 'Case insensitive',
            description: {
              en: 'Filtering is case insensitive',
              ja: 'フィルタリングは大文字小文字を区別しない',
            },
          },
          {
            name: 'No filter (autocomplete="none")',
            description: {
              en: 'All options shown regardless of input',
              ja: '入力に関係なくすべてのオプションを表示',
            },
          },
          {
            name: 'Empty results',
            description: {
              en: 'aria-activedescendant cleared when no matches',
              ja: '一致がない場合aria-activedescendantがクリア',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: {
          en: 'Mouse Interaction',
          ja: 'マウス操作',
        },
        testType: 'E2E',
        items: [
          {
            name: 'Click option',
            description: {
              en: 'Selects option and closes popup',
              ja: 'オプションを選択しポップアップを閉じる',
            },
          },
          {
            name: 'Hover option',
            description: {
              en: 'Updates aria-activedescendant on hover',
              ja: 'ホバー時にaria-activedescendantを更新',
            },
          },
          {
            name: 'Click disabled',
            description: {
              en: 'Disabled options cannot be selected',
              ja: '無効なオプションは選択不可',
            },
          },
          {
            name: 'Click outside',
            description: {
              en: 'Closes popup without selection',
              ja: '選択せずにポップアップを閉じる',
            },
          },
        ],
      },
    ],

    commands: [
      {
        comment: {
          en: 'Run all combobox E2E tests',
          ja: 'すべてのcombobox E2Eテストを実行',
        },
        command: 'npx playwright test combobox',
      },
      {
        comment: {
          en: 'Run for specific framework (React)',
          ja: '特定のフレームワークで実行（React）',
        },
        command: 'npx playwright test combobox --grep "react"',
      },
    ],

    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: {
          en: 'Test runner for unit tests',
          ja: 'ユニットテスト用テストランナー',
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
          en: 'Browser automation for E2E tests',
          ja: 'E2Eテスト用ブラウザ自動化',
        },
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

  // Test checklist for llm.md
  testChecklist: [
    { description: 'Input has `role="combobox"`', priority: 'high', category: 'aria' },
    {
      description: 'Input has `aria-controls` pointing to listbox',
      priority: 'high',
      category: 'aria',
    },
    {
      description: '`aria-controls` valid even when popup closed',
      priority: 'high',
      category: 'aria',
    },
    { description: '`aria-expanded` toggles correctly', priority: 'high', category: 'aria' },
    { description: '`aria-autocomplete="list"` present', priority: 'high', category: 'aria' },
    {
      description: '`aria-activedescendant` updates on navigation',
      priority: 'high',
      category: 'aria',
    },
    {
      description: '`aria-activedescendant` clears when closed/empty',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Listbox has `role="listbox"` and `hidden` when closed',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Options have `role="option"` and `aria-selected`',
      priority: 'high',
      category: 'aria',
    },
    { description: 'ArrowDown opens popup, focuses first', priority: 'high', category: 'keyboard' },
    { description: 'ArrowUp opens popup, focuses last', priority: 'high', category: 'keyboard' },
    { description: 'ArrowDown/Up navigates options', priority: 'high', category: 'keyboard' },
    { description: 'Home/End jump to first/last', priority: 'high', category: 'keyboard' },
    { description: 'Enter commits selection', priority: 'high', category: 'keyboard' },
    {
      description: 'Escape closes and restores value',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Tab closes popup', priority: 'high', category: 'keyboard' },
    {
      description: 'DOM focus remains on input during navigation',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Disabled options are skipped', priority: 'high', category: 'focus' },
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  // Implementation notes for llm.md
  implementationNotes: `Structure Diagram:
\`\`\`
Container (div)
+-- Label (label) id="combobox-label"
+-- Input (input)
|   role="combobox"
|   aria-controls="listbox-id"
|   aria-expanded="true/false"
|   aria-autocomplete="list"
|   aria-activedescendant="option-id" (or "")
|   aria-labelledby="combobox-label"
+-- Listbox (ul) id="listbox-id" hidden={!isOpen}
    role="listbox"
    +-- Option (li) role="option" id="opt-1" aria-selected
    +-- Option (li) role="option" id="opt-2" aria-disabled
\`\`\`

Key Points:
- Listbox always in DOM: Keep listbox in DOM with hidden attribute when closed
- DOM focus stays on input at all times
- Use aria-activedescendant for virtual focus in listbox
- Clear aria-activedescendant when popup closes or filter results are empty
- Skip disabled options during navigation`,

  // Example test code for llm.md
  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry', disabled: true },
];

// ARIA structure
it('has correct ARIA attributes', () => {
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(input).toHaveAttribute('aria-autocomplete', 'list');
  expect(input).toHaveAttribute('aria-controls');
});

// Keyboard - opens popup on ArrowDown
it('opens popup on ArrowDown and focuses first option', async () => {
  const user = userEvent.setup();
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  await user.click(input);
  await user.keyboard('{ArrowDown}');

  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(input).toHaveAttribute('aria-activedescendant', 'apple');
});

// Focus - skips disabled options
it('skips disabled options', async () => {
  const user = userEvent.setup();
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  await user.click(input);
  await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

  expect(input).toHaveAttribute('aria-activedescendant', 'banana');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  const combobox = page.locator('[role="combobox"]').first();

  await expect(combobox).toHaveAttribute('role', 'combobox');
  const ariaControls = await combobox.getAttribute('aria-controls');
  expect(ariaControls).toBeTruthy();

  const listbox = page.locator(\`#\${ariaControls}\`);
  await expect(listbox).toHaveAttribute('role', 'listbox');
});

// Keyboard - opens popup
test('ArrowDown opens popup and focuses first option', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  const combobox = page.locator('[role="combobox"]').first();

  await combobox.click();
  await page.keyboard.press('Escape');
  await expect(combobox).toHaveAttribute('aria-expanded', 'false');

  await page.keyboard.press('ArrowDown');
  await expect(combobox).toHaveAttribute('aria-expanded', 'true');

  const activeDescendant = await combobox.getAttribute('aria-activedescendant');
  expect(activeDescendant).toBeTruthy();
});

// axe-core test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  await page.locator('[role="combobox"]').first().waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.apg-combobox')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
