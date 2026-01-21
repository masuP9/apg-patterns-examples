import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const treeViewAccessibilityData: PatternAccessibilityData = {
  pattern: 'tree-view',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/treeview/',

  overview: {
    en: 'A tree view presents a hierarchical list of nodes that can be expanded or collapsed. It supports single and multi-select modes, keyboard navigation, and type-ahead search.',
    ja: 'ツリービューは展開・折りたたみ可能なノードの階層的なリストを表示します。単一選択・複数選択モード、キーボードナビゲーション、タイプアヘッド検索をサポートします。',
  },

  roles: [
    {
      name: 'tree',
      element: { en: 'Container (<ul>)', ja: 'コンテナ（<ul>）' },
      description: {
        en: 'The tree widget container',
        ja: 'ツリーウィジェットのコンテナ',
      },
    },
    {
      name: 'treeitem',
      element: { en: 'Each node (<li>)', ja: '各ノード（<li>）' },
      description: {
        en: 'Individual tree nodes (both parent and leaf)',
        ja: '個々のツリーノード（親ノードとリーフノードの両方）',
      },
    },
    {
      name: 'group',
      element: { en: 'Child container (<ul>)', ja: '子コンテナ（<ul>）' },
      description: {
        en: 'Container for child nodes of an expanded parent',
        ja: '展開された親の子ノードのコンテナ',
      },
    },
  ],

  properties: [
    {
      attribute: 'role="tree"',
      element: { en: 'Container', ja: 'コンテナ' },
      values: '-',
      required: true,
      notes: {
        en: 'Identifies the container as a tree widget',
        ja: 'コンテナをツリーウィジェットとして識別',
      },
    },
    {
      attribute: 'aria-label',
      element: 'tree',
      values: 'String',
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'Accessible name for the tree',
        ja: 'ツリーのアクセシブルな名前',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'tree',
      values: { en: 'ID reference', ja: 'ID参照' },
      required: {
        en: 'Yes*',
        ja: 'はい*',
      },
      notes: {
        en: 'Alternative to aria-label (takes precedence)',
        ja: 'aria-labelの代替（優先される）',
      },
    },
    {
      attribute: 'aria-multiselectable',
      element: 'tree',
      values: 'true',
      required: false,
      notes: {
        en: 'Only present for multi-select mode',
        ja: '複数選択モードでのみ存在',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-expanded',
      element: { en: 'Parent treeitem', ja: '親treeitem' },
      values: 'true | false',
      required: true,
      changeTrigger: {
        en: 'Click, ArrowRight, ArrowLeft, Enter',
        ja: 'Click、ArrowRight、ArrowLeft、Enter',
      },
      reference: 'https://w3c.github.io/aria/#aria-expanded',
    },
    {
      attribute: 'aria-selected',
      element: { en: 'All treeitems', ja: 'すべてのtreeitem' },
      values: 'true | false',
      required: true,
      changeTrigger: { en: 'Click, Enter, Space, Arrow keys', ja: 'Click、Enter、Space、矢印キー' },
      reference: 'https://w3c.github.io/aria/#aria-selected',
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'Disabled treeitem', ja: '無効化されたtreeitem' },
      values: 'true',
      required: false,
      reference: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  keyboardSections: [
    {
      title: { en: 'Navigation', ja: 'ナビゲーション' },
      shortcuts: [
        {
          key: 'ArrowDown',
          action: { en: 'Move focus to next visible node', ja: '次の表示ノードにフォーカスを移動' },
        },
        {
          key: 'ArrowUp',
          action: {
            en: 'Move focus to previous visible node',
            ja: '前の表示ノードにフォーカスを移動',
          },
        },
        {
          key: 'ArrowRight',
          action: {
            en: 'Closed parent: expand / Open parent: move to first child / Leaf: no action',
            ja: '閉じた親: 展開 / 開いた親: 最初の子へ移動 / リーフ: 操作なし',
          },
        },
        {
          key: 'ArrowLeft',
          action: {
            en: 'Open parent: collapse / Child or closed parent: move to parent / Root: no action',
            ja: '開いた親: 折りたたみ / 子または閉じた親: 親へ移動 / ルート: 操作なし',
          },
        },
        {
          key: 'Home',
          action: { en: 'Move focus to first node', ja: '最初のノードにフォーカスを移動' },
        },
        {
          key: 'End',
          action: {
            en: 'Move focus to last visible node',
            ja: '最後の表示ノードにフォーカスを移動',
          },
        },
        {
          key: 'Enter',
          action: {
            en: 'Select and activate node (see Selection section below)',
            ja: 'ノードを選択してアクティブ化（下記選択セクション参照）',
          },
        },
        {
          key: '*',
          action: {
            en: 'Expand all siblings at current level',
            ja: '現在のレベルのすべての兄弟を展開',
          },
        },
        {
          key: { en: 'Type characters', ja: '文字入力' },
          action: {
            en: 'Move focus to next visible node starting with that character',
            ja: 'その文字で始まる次の表示ノードにフォーカスを移動',
          },
        },
      ],
    },
    {
      title: { en: 'Selection (Single-Select Mode)', ja: '選択（単一選択モード）' },
      shortcuts: [
        {
          key: 'ArrowDown / ArrowUp',
          action: {
            en: 'Move focus only (selection does NOT follow focus)',
            ja: 'フォーカスのみ移動（選択はフォーカスに追従しない）',
          },
        },
        {
          key: 'Enter',
          action: {
            en: 'Select focused node and activate (fire onActivate callback)',
            ja: 'フォーカスされたノードを選択してアクティブ化（onActivateコールバックを発火）',
          },
        },
        {
          key: 'Space',
          action: {
            en: 'Select focused node and activate (fire onActivate callback)',
            ja: 'フォーカスされたノードを選択してアクティブ化（onActivateコールバックを発火）',
          },
        },
        {
          key: { en: 'Click', ja: 'クリック' },
          action: {
            en: 'Select clicked node and activate (fire onActivate callback)',
            ja: 'クリックしたノードを選択してアクティブ化（onActivateコールバックを発火）',
          },
        },
      ],
    },
    {
      title: { en: 'Selection (Multi-Select Mode)', ja: '選択（複数選択モード）' },
      shortcuts: [
        {
          key: 'Space',
          action: {
            en: 'Toggle selection of focused node',
            ja: 'フォーカスされたノードの選択を切り替え',
          },
        },
        {
          key: 'Ctrl + Space',
          action: {
            en: 'Toggle selection without moving focus',
            ja: 'フォーカスを移動せずに選択を切り替え',
          },
        },
        {
          key: 'Shift + ArrowDown / ArrowUp',
          action: { en: 'Extend selection range from anchor', ja: 'アンカーから選択範囲を拡張' },
        },
        {
          key: 'Shift + Home',
          action: { en: 'Extend selection to first node', ja: '最初のノードまで選択を拡張' },
        },
        {
          key: 'Shift + End',
          action: {
            en: 'Extend selection to last visible node',
            ja: '最後の表示ノードまで選択を拡張',
          },
        },
        {
          key: 'Ctrl + A',
          action: { en: 'Select all visible nodes', ja: 'すべての表示ノードを選択' },
        },
      ],
    },
  ],

  focusManagement: [
    {
      event: { en: 'Roving tabindex', ja: 'Roving tabindex' },
      behavior: {
        en: 'Only one node has <code>tabindex="0"</code> (the focused node)',
        ja: '1つのノードのみが<code>tabindex="0"</code>を持つ（フォーカスされたノード）',
      },
    },
    {
      event: { en: 'Other nodes', ja: '他のノード' },
      behavior: {
        en: 'All other nodes have <code>tabindex="-1"</code>',
        ja: '他のすべてのノードは<code>tabindex="-1"</code>を持つ',
      },
    },
    {
      event: { en: 'Single Tab stop', ja: '単一Tabストップ' },
      behavior: {
        en: 'Tree is a single Tab stop (Tab enters tree, Shift+Tab exits)',
        ja: 'ツリーは単一のTabストップ（Tabで入り、Shift+Tabで出る）',
      },
    },
    {
      event: { en: 'Visible nodes only', ja: '表示ノードのみ' },
      behavior: {
        en: 'Focus moves only among visible nodes (collapsed children are skipped)',
        ja: 'フォーカスは表示ノード間のみを移動（折りたたまれた子はスキップ）',
      },
    },
    {
      event: { en: 'Collapse behavior', ja: '折りたたみ動作' },
      behavior: {
        en: 'When a parent is collapsed while a child has focus, focus moves to the parent',
        ja: '子にフォーカスがある状態で親を折りたたむと、フォーカスは親に移動',
      },
    },
  ],

  additionalNotes: [
    {
      en: '* Either aria-label or aria-labelledby is required.',
      ja: '* aria-labelまたはaria-labelledbyのいずれかが必須です。',
    },
    {
      en: 'Parent nodes must have aria-expanded. Leaf nodes must NOT have aria-expanded.',
      ja: '親ノードはaria-expandedを持つ必要があります。リーフノードはaria-expandedを持ってはいけません。',
    },
    {
      en: 'When selection is supported, ALL treeitems must have aria-selected.',
      ja: '選択がサポートされる場合、すべてのtreeitemはaria-selectedを持つ必要があります。',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA tree role',
      url: 'https://w3c.github.io/aria/#tree',
    },
  ],

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト（Testing Library）' },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用して、コンポーネントの出力を検証します。正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role="tree", role="treeitem", role="group")',
            ja: 'ARIA属性（role="tree"、role="treeitem"、role="group"）',
          },
          { en: 'Expansion state (aria-expanded)', ja: '展開状態（aria-expanded）' },
          {
            en: 'Selection state (aria-selected, aria-multiselectable)',
            ja: '選択状態（aria-selected、aria-multiselectable）',
          },
          { en: 'Disabled state (aria-disabled)', ja: '無効化状態（aria-disabled）' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: '実際のブラウザ環境で全フレームワークのコンポーネント動作を検証します。インタラクションとクロスフレームワークの一貫性をカバーします。',
        },
        areas: [
          {
            en: 'Arrow key navigation (ArrowUp, ArrowDown, Home, End)',
            ja: '矢印キーナビゲーション（ArrowUp、ArrowDown、Home、End）',
          },
          {
            en: 'Expand/collapse with ArrowRight/ArrowLeft',
            ja: 'ArrowRight/ArrowLeftでの展開/折りたたみ',
          },
          { en: 'Selection with Enter, Space, and click', ja: 'Enter、Space、クリックでの選択' },
          { en: 'Multi-select with Shift+Arrow', ja: 'Shift+矢印での複数選択' },
          { en: 'Type-ahead character navigation', ja: 'タイプアヘッド文字ナビゲーション' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'クロスフレームワーク一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'ARIA Structure', ja: 'ARIA構造' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="tree"',
            description: {
              en: 'Container element has the tree role',
              ja: 'コンテナ要素がtreeロールを持つ',
            },
          },
          {
            name: 'role="treeitem"',
            description: {
              en: 'Each node has the treeitem role',
              ja: '各ノードがtreeitemロールを持つ',
            },
          },
          {
            name: 'role="group"',
            description: {
              en: 'Child containers have the group role',
              ja: '子コンテナがgroupロールを持つ',
            },
          },
          {
            name: 'aria-expanded (parent)',
            description: {
              en: 'Parent nodes have aria-expanded (true or false)',
              ja: '親ノードがaria-expanded（trueまたはfalse）を持つ',
            },
          },
          {
            name: 'aria-expanded (leaf)',
            description: {
              en: 'Leaf nodes do NOT have aria-expanded',
              ja: 'リーフノードはaria-expandedを持たない',
            },
          },
          {
            name: 'aria-selected',
            description: {
              en: 'All treeitems have aria-selected (true or false)',
              ja: 'すべてのtreeitemがaria-selected（trueまたはfalse）を持つ',
            },
          },
          {
            name: 'aria-multiselectable',
            description: {
              en: 'Tree has aria-multiselectable="true" in multi-select mode',
              ja: '複数選択モードでツリーがaria-multiselectable="true"を持つ',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled nodes have aria-disabled="true"',
              ja: '無効化ノードがaria-disabled="true"を持つ',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Accessible Name', ja: 'アクセシブルな名前' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-label',
            description: {
              en: 'Tree has accessible name via aria-label',
              ja: 'ツリーがaria-labelでアクセシブルな名前を持つ',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Tree can use aria-labelledby (takes precedence)',
              ja: 'ツリーがaria-labelledby（優先される）を使用できる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Navigation', ja: 'ナビゲーション' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'ArrowDown',
            description: { en: 'Moves to next visible node', ja: '次の表示ノードに移動' },
          },
          {
            name: 'ArrowUp',
            description: { en: 'Moves to previous visible node', ja: '前の表示ノードに移動' },
          },
          { name: 'Home', description: { en: 'Moves to first node', ja: '最初のノードに移動' } },
          {
            name: 'End',
            description: { en: 'Moves to last visible node', ja: '最後の表示ノードに移動' },
          },
          {
            name: 'Type-ahead',
            description: {
              en: 'Typing characters focuses matching visible node',
              ja: '文字入力で一致する表示ノードにフォーカス',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Expand/Collapse', ja: '展開/折りたたみ' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'ArrowRight (closed parent)',
            description: { en: 'Expands the parent node', ja: '親ノードを展開' },
          },
          {
            name: 'ArrowRight (open parent)',
            description: { en: 'Moves to first child', ja: '最初の子に移動' },
          },
          { name: 'ArrowRight (leaf)', description: { en: 'Does nothing', ja: '何もしない' } },
          {
            name: 'ArrowLeft (open parent)',
            description: { en: 'Collapses the parent node', ja: '親ノードを折りたたむ' },
          },
          {
            name: 'ArrowLeft (child/closed)',
            description: { en: 'Moves to parent node', ja: '親ノードに移動' },
          },
          { name: 'ArrowLeft (root)', description: { en: 'Does nothing', ja: '何もしない' } },
          {
            name: '* (asterisk)',
            description: {
              en: 'Expands all siblings at current level',
              ja: '現在のレベルのすべての兄弟を展開',
            },
          },
          {
            name: 'Enter',
            description: {
              en: 'Activates node (does NOT toggle expansion)',
              ja: 'ノードをアクティブ化（展開の切り替えはしない）',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Selection (Single-Select)', ja: '選択（単一選択）' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Arrow navigation',
            description: {
              en: 'Selection follows focus (arrows change selection)',
              ja: '選択がフォーカスに追従（矢印で選択が変わる）',
            },
          },
          {
            name: 'Space',
            description: {
              en: 'Has no effect in single-select mode',
              ja: '単一選択モードでは効果なし',
            },
          },
          {
            name: 'Only one selected',
            description: {
              en: 'Only one node can be selected at a time',
              ja: '一度に1つのノードのみ選択可能',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Selection (Multi-Select)', ja: '選択（複数選択）' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Space',
            description: {
              en: 'Toggles selection of focused node',
              ja: 'フォーカスされたノードの選択を切り替え',
            },
          },
          {
            name: 'Ctrl+Space',
            description: {
              en: 'Toggles selection without moving focus',
              ja: 'フォーカスを移動せずに選択を切り替え',
            },
          },
          {
            name: 'Shift+Arrow',
            description: {
              en: 'Extends selection range from anchor',
              ja: 'アンカーから選択範囲を拡張',
            },
          },
          {
            name: 'Shift+Home',
            description: {
              en: 'Extends selection to first node',
              ja: '最初のノードまで選択を拡張',
            },
          },
          {
            name: 'Shift+End',
            description: {
              en: 'Extends selection to last visible node',
              ja: '最後の表示ノードまで選択を拡張',
            },
          },
          {
            name: 'Ctrl+A',
            description: { en: 'Selects all visible nodes', ja: 'すべての表示ノードを選択' },
          },
          {
            name: 'Multiple selection',
            description: {
              en: 'Multiple nodes can be selected simultaneously',
              ja: '複数のノードを同時に選択可能',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Focus Management', ja: 'フォーカス管理' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Single Tab stop',
            description: {
              en: 'Tree is a single Tab stop (Tab/Shift+Tab)',
              ja: 'ツリーが単一のTabストップ（Tab/Shift+Tab）',
            },
          },
          {
            name: 'tabindex="0"',
            description: {
              en: 'Focused node has tabindex="0"',
              ja: 'フォーカスされたノードがtabindex="0"を持つ',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Other nodes have tabindex="-1"',
              ja: '他のノードがtabindex="-1"を持つ',
            },
          },
          {
            name: 'Skip collapsed',
            description: {
              en: 'Collapsed children are skipped during navigation',
              ja: 'ナビゲーション中に折りたたまれた子をスキップ',
            },
          },
          {
            name: 'Focus to parent',
            description: {
              en: "Focus moves to parent when child's parent is collapsed",
              ja: '子の親が折りたたまれると、フォーカスが親に移動',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Disabled Nodes', ja: '無効化ノード' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Focusable',
            description: {
              en: 'Disabled nodes can receive focus',
              ja: '無効化ノードはフォーカスを受け取れる',
            },
          },
          {
            name: 'Not selectable',
            description: {
              en: 'Disabled nodes cannot be selected',
              ja: '無効化ノードは選択できない',
            },
          },
          {
            name: 'Not expandable',
            description: {
              en: 'Disabled parent nodes cannot be expanded/collapsed',
              ja: '無効化された親ノードは展開/折りたたみできない',
            },
          },
          {
            name: 'Not activatable',
            description: {
              en: 'Enter key does not activate disabled nodes',
              ja: 'Enterキーで無効化ノードをアクティブ化できない',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Type-Ahead', ja: 'タイプアヘッド' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Visible nodes only',
            description: {
              en: 'Type-ahead only searches visible nodes',
              ja: 'タイプアヘッドは表示ノードのみを検索',
            },
          },
          {
            name: 'Cycle on repeat',
            description: {
              en: 'Repeated character cycles through matches',
              ja: '繰り返し文字でマッチをサイクル',
            },
          },
          {
            name: 'Multi-character prefix',
            description: {
              en: 'Multiple characters form a search prefix',
              ja: '複数文字で検索プレフィックスを形成',
            },
          },
          {
            name: 'Timeout reset',
            description: {
              en: 'Buffer resets after timeout (default 500ms)',
              ja: 'タイムアウト後にバッファがリセット（デフォルト500ms）',
            },
          },
          {
            name: 'Skip disabled',
            description: {
              en: 'Type-ahead skips disabled nodes',
              ja: 'タイプアヘッドは無効化ノードをスキップ',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Mouse Interaction', ja: 'マウス操作' },
        testType: 'E2E',
        items: [
          {
            name: 'Click parent',
            description: {
              en: 'Toggles expansion and selects node',
              ja: '展開を切り替えてノードを選択',
            },
          },
          {
            name: 'Click leaf',
            description: { en: 'Selects the leaf node', ja: 'リーフノードを選択' },
          },
          {
            name: 'Click disabled',
            description: {
              en: 'Disabled nodes cannot be selected or expanded',
              ja: '無効化ノードは選択・展開できない',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Callbacks', ja: 'コールバック' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'onSelectionChange',
            description: {
              en: 'Called with selected IDs when selection changes',
              ja: '選択が変わったときに選択されたIDで呼び出される',
            },
          },
          {
            name: 'onExpandedChange',
            description: {
              en: 'Called with expanded IDs when expansion changes',
              ja: '展開が変わったときに展開されたIDで呼び出される',
            },
          },
          {
            name: 'onActivate',
            description: {
              en: 'Called with node ID on Enter key',
              ja: 'EnterキーでノードIDと共に呼び出される',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/tree-view.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Tree View', ja: 'Tree Viewのユニットテストを実行' },
        command: 'npm run test -- treeview',
      },
      {
        comment: {
          en: 'Run E2E tests for Tree View (all frameworks)',
          ja: 'Tree ViewのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=tree-view',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定のフレームワークでE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=tree-view',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: { en: 'Test runner for unit tests', ja: 'ユニットテストランナー' },
      },
      {
        name: 'Testing Library',
        url: 'https://testing-library.com/',
        description: {
          en: 'Framework-specific testing utilities (React, Vue, Svelte)',
          ja: 'フレームワーク別テストユーティリティ（React、Vue、Svelte）',
        },
      },
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: { en: 'Browser automation for E2E tests', ja: 'E2Eテスト用ブラウザ自動化' },
      },
      {
        name: 'axe-core',
        url: 'https://github.com/dequelabs/axe-core',
        description: { en: 'Automated accessibility testing', ja: '自動アクセシビリティテスト' },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  testChecklist: [
    { description: 'Container has role="tree"', priority: 'high', category: 'aria' },
    { description: 'Each node has role="treeitem"', priority: 'high', category: 'aria' },
    { description: 'Child containers have role="group"', priority: 'high', category: 'aria' },
    { description: 'Parent nodes have aria-expanded', priority: 'high', category: 'aria' },
    { description: 'Leaf nodes do NOT have aria-expanded', priority: 'high', category: 'aria' },
    { description: 'All treeitems have aria-selected', priority: 'high', category: 'aria' },
    {
      description: 'Tree has accessible name (aria-label or aria-labelledby)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'ArrowDown/ArrowUp navigates visible nodes',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowRight/ArrowLeft expand/collapse or navigate',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Home/End move to first/last visible node',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Roving tabindex implemented correctly', priority: 'high', category: 'focus' },
    {
      description: 'Collapsed children are skipped in navigation',
      priority: 'high',
      category: 'focus',
    },
    {
      description: 'Single-select mode allows only one selection',
      priority: 'high',
      category: 'behavior',
    },
    {
      description: 'Multi-select mode supports range selection',
      priority: 'high',
      category: 'behavior',
    },
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`html
<ul role="tree" aria-label="File explorer">
  <li role="treeitem" aria-expanded="true" aria-selected="false" tabindex="0">
    Documents
    <ul role="group">
      <li role="treeitem" aria-selected="false" tabindex="-1">
        Resume.pdf
      </li>
      <li role="treeitem" aria-expanded="false" aria-selected="false" tabindex="-1">
        Projects
        <ul role="group">
          <li role="treeitem" aria-selected="false" tabindex="-1">
            Project1.doc
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
\`\`\`

## Key Implementation Points

1. **Roving Tabindex**: Only one treeitem has tabindex="0" at a time
2. **aria-expanded**: Only parent nodes have this attribute
3. **aria-selected**: All treeitems must have this when selection is supported
4. **role="group"**: Child containers use group role, not tree
5. **Visible Navigation**: Focus only moves among visible (not collapsed) nodes
6. **Collapse Focus**: When a parent is collapsed while child is focused, focus moves to parent`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has tree role', () => {
  render(<TreeView items={items} aria-label="Files" />);
  expect(screen.getByRole('tree')).toBeInTheDocument();
});

// Navigation
it('ArrowDown moves focus to next visible node', async () => {
  const user = userEvent.setup();
  render(<TreeView items={items} aria-label="Files" />);

  const treeItems = screen.getAllByRole('treeitem');
  treeItems[0].focus();
  await user.keyboard('{ArrowDown}');

  expect(treeItems[1]).toHaveFocus();
});

// Expand/Collapse
it('ArrowRight expands closed parent node', async () => {
  const user = userEvent.setup();
  render(<TreeView items={itemsWithChildren} aria-label="Files" />);

  const parent = screen.getByRole('treeitem', { name: /documents/i });
  expect(parent).toHaveAttribute('aria-expanded', 'false');

  parent.focus();
  await user.keyboard('{ArrowRight}');

  expect(parent).toHaveAttribute('aria-expanded', 'true');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');
  const tree = page.getByRole('tree');

  await expect(tree).toBeVisible();
  await expect(tree).toHaveAttribute('aria-label');
});

// Navigation
test('arrow keys navigate between visible nodes', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');
  const treeItems = page.getByRole('treeitem');

  await treeItems.first().click();
  await page.keyboard.press('ArrowDown');

  await expect(treeItems.nth(1)).toBeFocused();
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="tree"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
