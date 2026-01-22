import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const spinbuttonAccessibilityData: PatternAccessibilityData = {
  pattern: 'spinbutton',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',

  overview: {
    en: 'A spinbutton allows users to select a value from a discrete set or range. Contains a text field displaying the current value with optional increment/decrement buttons. Supports direct text input and keyboard navigation.',
    ja: 'スピンボタンは、ユーザーが離散的なセットまたは範囲から値を選択できるようにします。現在の値を表示するテキストフィールドと、オプションの増減ボタンを含みます。直接テキスト入力とキーボードナビゲーションをサポートします。',
  },

  // Native HTML considerations
  nativeHtmlConsiderations: [
    { useCase: 'Simple numeric input', recommended: 'Native <input type="number">' },
    { useCase: 'Custom styling needed', recommended: 'Custom role="spinbutton"' },
    { useCase: 'Consistent keyboard behavior', recommended: 'Custom (browser varies)' },
    { useCase: 'aria-valuetext needed', recommended: 'Custom implementation' },
  ],

  nativeVsCustom: [
    {
      feature: 'Basic numeric input',
      native: 'Recommended',
      custom: 'Not needed',
    },
    {
      feature: 'JavaScript disabled support',
      native: 'Works natively',
      custom: 'Requires fallback',
    },
    {
      feature: 'Built-in validation',
      native: 'Native support',
      custom: 'Manual implementation',
    },
    {
      feature: 'Custom button styling',
      native: 'Limited (browser-dependent)',
      custom: 'Full control',
    },
    {
      feature: 'Consistent cross-browser appearance',
      native: 'Varies by browser',
      custom: 'Consistent',
    },
    {
      feature: 'Custom step/large step behavior',
      native: 'Basic step only',
      custom: 'PageUp/PageDown support',
    },
    {
      feature: 'No min/max limits',
      native: 'Requires omitting attributes',
      custom: 'Explicit undefined support',
    },
  ],

  roles: [
    {
      name: 'spinbutton',
      element: { en: 'Input element', ja: '入力要素' },
      description: {
        en: 'Identifies the element as a spin button that allows users to select a value from a discrete set or range by incrementing/decrementing or typing directly.',
        ja: 'ユーザーがインクリメント/デクリメントまたは直接入力によって、離散的なセットまたは範囲から値を選択できるスピンボタンとして要素を識別します。',
      },
      required: true,
    },
  ],

  properties: [
    {
      attribute: 'aria-valuenow',
      element: 'spinbutton',
      values: { en: 'Number (current value)', ja: '数値（現在の値）' },
      required: true,
      notes: {
        en: 'Must be updated immediately when value changes (keyboard, button click, or text input)',
        ja: '値が変更されたとき（キーボード、ボタンクリック、またはテキスト入力）、即座に更新する必要があります',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuenow',
    },
    {
      attribute: 'aria-valuemin',
      element: 'spinbutton',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Only set when min is defined. Omit attribute entirely when no minimum limit exists.',
        ja: '最小値が定義されている場合のみ設定します。最小制限が存在しない場合は、属性を完全に省略してください。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemin',
    },
    {
      attribute: 'aria-valuemax',
      element: 'spinbutton',
      values: { en: 'Number', ja: '数値' },
      required: false,
      notes: {
        en: 'Only set when max is defined. Omit attribute entirely when no maximum limit exists.',
        ja: '最大値が定義されている場合のみ設定します。最大制限が存在しない場合は、属性を完全に省略してください。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemax',
    },
    {
      attribute: 'aria-valuetext',
      element: 'spinbutton',
      values: {
        en: 'String (e.g., "5 items", "3 of 10")',
        ja: '文字列（例: "5 items", "3 of 10"）',
      },
      required: false,
      notes: {
        en: "Provides a human-readable text alternative for the current value. Use when the numeric value alone doesn't convey sufficient meaning.",
        ja: '現在の値に対する人間が読めるテキストの代替を提供します。数値だけでは十分な意味を伝えられない場合に使用します。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuetext',
    },
    {
      attribute: 'aria-disabled',
      element: 'spinbutton',
      values: 'true | false',
      required: false,
      notes: {
        en: 'Indicates that the spinbutton is disabled and not interactive.',
        ja: 'スピンボタンが無効化されており、インタラクティブでないことを示します。',
      },
    },
    {
      attribute: 'aria-readonly',
      element: 'spinbutton',
      values: 'true | false',
      required: false,
      notes: {
        en: 'Indicates that the spinbutton is read-only. Users can navigate with Home/End but cannot change the value.',
        ja: 'スピンボタンが読み取り専用であることを示します。ユーザーはHome/Endキーでナビゲーションできますが、値を変更することはできません。',
      },
    },
    {
      attribute: 'aria-label',
      element: 'spinbutton',
      values: { en: 'String', ja: '文字列' },
      required: {
        en: 'Conditional (required if no visible label)',
        ja: '条件付き（表示されるラベルがない場合は必須）',
      },
      notes: {
        en: 'Provides an invisible label for the spinbutton',
        ja: 'スピンボタンに不可視のラベルを提供します',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'spinbutton',
      values: { en: 'ID reference', ja: 'ID参照' },
      required: {
        en: 'Conditional (required if visible label exists)',
        ja: '条件付き（表示されるラベルが存在する場合は必須）',
      },
      notes: {
        en: 'References an external element as the label',
        ja: '外部要素をラベルとして参照します',
      },
    },
  ],

  keyboardSupport: [
    {
      key: 'ArrowUp',
      action: { en: 'Increases the value by one step', ja: '値を1ステップ増やします' },
    },
    {
      key: 'ArrowDown',
      action: { en: 'Decreases the value by one step', ja: '値を1ステップ減らします' },
    },
    {
      key: 'Home',
      action: {
        en: 'Sets the value to its minimum (only when min is defined)',
        ja: '値を最小値に設定します（最小値が定義されている場合のみ）',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Sets the value to its maximum (only when max is defined)',
        ja: '値を最大値に設定します（最大値が定義されている場合のみ）',
      },
    },
    {
      key: 'Page Up',
      action: {
        en: 'Increases the value by a large step (default: step * 10)',
        ja: '値を大きなステップで増やします（デフォルト: step × 10）',
      },
    },
    {
      key: 'Page Down',
      action: {
        en: 'Decreases the value by a large step (default: step * 10)',
        ja: '値を大きなステップで減らします（デフォルト: step × 10）',
      },
    },
  ],

  focusManagement: [
    {
      event: { en: 'Input element', ja: '入力要素' },
      behavior: 'tabindex="0"',
    },
    {
      event: { en: 'Disabled input', ja: '無効化された入力' },
      behavior: 'tabindex="-1"',
    },
    {
      event: { en: 'Increment/decrement buttons', ja: '増加/減少ボタン' },
      behavior: {
        en: 'tabindex="-1" (not in tab order)',
        ja: 'tabindex="-1"（タブ順序に含まれない）',
      },
    },
    {
      event: { en: 'Button click', ja: 'ボタンクリック' },
      behavior: {
        en: 'Focus stays on spinbutton (does NOT move to button)',
        ja: 'フォーカスはスピンボタンに留まります（ボタンには移動しません）',
      },
    },
  ],

  additionalNotes: [
    {
      en: 'The spinbutton role is used for input controls that let users select a numeric value by using increment/decrement buttons, arrow keys, or typing directly. It combines the functionality of a text input with up/down value adjustment.',
      ja: 'spinbuttonロールは、ユーザーがインクリメント/デクリメントボタン、矢印キー、または直接入力によって数値を選択できる入力コントロールに使用されます。テキスト入力と値の上下調整機能を組み合わせたものです。',
    },
    {
      en: 'Unlike the slider pattern, spinbutton uses Up/Down arrows only (not Left/Right). This allows users to type numeric values directly using the text input.',
      ja: 'スライダーパターンとは異なり、スピンボタンは上下矢印キーのみを使用します（左右矢印キーは使用しません）。これにより、ユーザーはテキスト入力を使用して直接数値を入力できます。',
    },
    {
      en: 'Spinbuttons must have an accessible name. This can be provided through a visible label using the label prop, aria-label for an invisible label, or aria-labelledby to reference an external element.',
      ja: 'スピンボタンにはアクセシブルな名前が必要です。これはlabelプロパティを使用した表示されるラベル、見えないラベルのためのaria-label、または外部要素を参照するaria-labelledbyによって提供できます。',
    },
  ],

  visualDesign: [
    {
      en: 'Focus indicator - Visible focus ring on the entire controls container (including buttons)',
      ja: 'フォーカスインジケーター - コントロールコンテナ全体（ボタンを含む）に可視のフォーカスリングを表示',
    },
    {
      en: 'Button states - Visual feedback on hover and active states',
      ja: 'ボタンの状態 - ホバーおよびアクティブ状態での視覚的フィードバック',
    },
    {
      en: 'Disabled state - Clear visual indication when spinbutton is disabled',
      ja: '無効化状態 - スピンボタンが無効化されているときの明確な視覚的表示',
    },
    {
      en: 'Read-only state - Distinct visual style for read-only mode',
      ja: '読み取り専用状態 - 読み取り専用モードの明確な視覚的スタイル',
    },
    {
      en: 'Forced colors mode - Uses system colors for accessibility in Windows High Contrast Mode',
      ja: '強制カラーモード - Windowsハイコントラストモードでのアクセシビリティのためにシステムカラーを使用',
    },
  ],

  references: [
    {
      title: 'WAI-ARIA APG: Spinbutton Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/',
    },
    {
      title: 'MDN: <input type="number"> element',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number',
    },
    {
      title: 'W3C ARIA: spinbutton role',
      url: 'https://w3c.github.io/aria/#spinbutton',
    },
  ],

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト（Testing Library）' },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用してコンポーネントのレンダリング出力を検証します。これらのテストは正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role="spinbutton", aria-valuenow, aria-valuemin, aria-valuemax)',
            ja: 'ARIA属性（role="spinbutton"、aria-valuenow、aria-valuemin、aria-valuemax）',
          },
          {
            en: 'Keyboard interaction (ArrowUp/Down, Home/End, PageUp/Down)',
            ja: 'キーボード操作（ArrowUp/Down、Home/End、PageUp/Down）',
          },
          {
            en: 'Text input handling and validation',
            ja: 'テキスト入力処理とバリデーション',
          },
          {
            en: 'Accessibility via jest-axe',
            ja: 'jest-axeによるアクセシビリティ検証',
          },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストは操作とフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          { en: 'ARIA structure in live browser', ja: 'ライブブラウザでのARIA構造' },
          {
            en: 'Keyboard interaction across frameworks',
            ja: 'フレームワーク間でのキーボード操作',
          },
          { en: 'Button interaction and focus management', ja: 'ボタン操作とフォーカス管理' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'フレームワーク間の一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'ARIA Attributes', ja: 'ARIA属性' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="spinbutton"',
            description: {
              en: 'Element has the spinbutton role',
              ja: '要素がspinbuttonロールを持つ',
            },
          },
          {
            name: 'aria-valuenow',
            description: {
              en: 'Current value is correctly set and updated',
              ja: '現在の値が正しく設定され、更新される',
            },
          },
          {
            name: 'aria-valuemin',
            description: {
              en: 'Minimum value is set only when min is defined',
              ja: '最小値が定義されている場合のみ設定される',
            },
          },
          {
            name: 'aria-valuemax',
            description: {
              en: 'Maximum value is set only when max is defined',
              ja: '最大値が定義されている場合のみ設定される',
            },
          },
          {
            name: 'aria-valuetext',
            description: {
              en: 'Human-readable text is set when provided',
              ja: '人間が読めるテキストが提供された場合に設定される',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled state is reflected when set',
              ja: '無効状態が設定された場合に反映される',
            },
          },
          {
            name: 'aria-readonly',
            description: {
              en: 'Read-only state is reflected when set',
              ja: '読み取り専用状態が設定された場合に反映される',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Accessible Name', ja: 'アクセシブル名' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-label',
            description: {
              en: 'Accessible name via aria-label attribute',
              ja: 'aria-label属性によるアクセシブル名',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'Accessible name via external element reference',
              ja: '外部要素参照によるアクセシブル名',
            },
          },
          {
            name: 'visible label',
            description: {
              en: 'Visible label provides accessible name',
              ja: '視覚的なラベルがアクセシブル名を提供',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Keyboard Interaction', ja: 'キーボード操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Arrow Up',
            description: { en: 'Increases value by one step', ja: '値を1ステップ増加させる' },
          },
          {
            name: 'Arrow Down',
            description: { en: 'Decreases value by one step', ja: '値を1ステップ減少させる' },
          },
          {
            name: 'Home',
            description: {
              en: 'Sets value to minimum (only when min defined)',
              ja: '最小値に設定（最小値が定義されている場合のみ）',
            },
          },
          {
            name: 'End',
            description: {
              en: 'Sets value to maximum (only when max defined)',
              ja: '最大値に設定（最大値が定義されている場合のみ）',
            },
          },
          {
            name: 'Page Up/Down',
            description: {
              en: 'Increases/decreases value by large step',
              ja: '大きなステップで値を増加/減少させる',
            },
          },
          {
            name: 'Boundary clamping',
            description: {
              en: 'Value does not exceed min/max limits',
              ja: '値が最小値/最大値の範囲を超えない',
            },
          },
          {
            name: 'Disabled state',
            description: {
              en: 'Keyboard has no effect when disabled',
              ja: '無効状態の場合、キーボード操作が無効になる',
            },
          },
          {
            name: 'Read-only state',
            description: {
              en: 'Arrow keys blocked, Home/End allowed',
              ja: '矢印キーはブロック、Home/Endは許可',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Button Interaction', ja: 'ボタン操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Increment click',
            description: {
              en: 'Clicking increment button increases value',
              ja: '増加ボタンのクリックで値が増加する',
            },
          },
          {
            name: 'Decrement click',
            description: {
              en: 'Clicking decrement button decreases value',
              ja: '減少ボタンのクリックで値が減少する',
            },
          },
          {
            name: 'Button labels',
            description: {
              en: 'Buttons have accessible labels',
              ja: 'ボタンにアクセシブルなラベルがある',
            },
          },
          {
            name: 'Disabled/read-only',
            description: {
              en: 'Buttons blocked when disabled or read-only',
              ja: '無効または読み取り専用の場合、ボタンがブロックされる',
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
            name: 'tabindex="0"',
            description: { en: 'Input is focusable', ja: '入力欄がフォーカス可能である' },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Input is not focusable when disabled',
              ja: '無効状態の場合、入力欄がフォーカス不可になる',
            },
          },
          {
            name: 'Button tabindex',
            description: {
              en: 'Buttons have tabindex="-1" (not in tab order)',
              ja: 'ボタンがtabindex="-1"を持つ（タブ順序に含まれない）',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Text Input', ja: 'テキスト入力' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'inputmode="numeric"',
            description: {
              en: 'Uses numeric keyboard on mobile',
              ja: 'モバイルで数値キーボードを使用',
            },
          },
          {
            name: 'Valid input',
            description: {
              en: 'aria-valuenow updates on valid text input',
              ja: '有効なテキスト入力時にaria-valuenowが更新される',
            },
          },
          {
            name: 'Invalid input',
            description: {
              en: 'Reverts to previous value on blur with invalid input',
              ja: '無効な入力でフォーカスを失った際に前の値に戻る',
            },
          },
          {
            name: 'Clamp on blur',
            description: {
              en: 'Value normalized to step and min/max on blur',
              ja: 'フォーカスを失った際にステップと最小値/最大値に正規化される',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'IME Composition', ja: 'IME変換' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'During composition',
            description: {
              en: 'Value not updated during IME composition',
              ja: 'IME変換中は値が更新されない',
            },
          },
          {
            name: 'On composition end',
            description: {
              en: 'Value updates when composition completes',
              ja: '変換完了時に値が更新される',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Edge Cases', ja: 'エッジケース' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'decimal values',
            description: {
              en: 'Handles decimal step values correctly',
              ja: '小数ステップ値を正しく処理する',
            },
          },
          {
            name: 'no min/max',
            description: {
              en: 'Allows unbounded values when no min/max',
              ja: '最小値/最大値がない場合、無制限の値を許可',
            },
          },
          {
            name: 'clamp to min',
            description: {
              en: 'defaultValue below min is clamped to min',
              ja: '最小値を下回るdefaultValueが最小値にクランプされる',
            },
          },
          {
            name: 'clamp to max',
            description: {
              en: 'defaultValue above max is clamped to max',
              ja: '最大値を上回るdefaultValueが最大値にクランプされる',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Callbacks', ja: 'コールバック' },
        testType: 'Unit',
        items: [
          {
            name: 'onValueChange',
            description: {
              en: 'Callback is called with new value on change',
              ja: '値の変更時に新しい値でコールバックが呼ばれる',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'HTML Attribute Inheritance', ja: 'HTML属性の継承' },
        testType: 'Unit',
        items: [
          {
            name: 'className',
            description: {
              en: 'Custom class is applied to container',
              ja: 'カスタムクラスがコンテナに適用される',
            },
          },
          {
            name: 'id',
            description: { en: 'ID attribute is set correctly', ja: 'ID属性が正しく設定される' },
          },
          {
            name: 'data-*',
            description: { en: 'Data attributes are passed through', ja: 'データ属性が継承される' },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/spinbutton.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Spinbutton', ja: 'Spinbuttonのユニットテストを実行' },
        command: 'npm run test -- spinbutton',
      },
      {
        comment: {
          en: 'Run E2E tests for Spinbutton (all frameworks)',
          ja: 'SpinbuttonのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=spinbutton',
      },
    ],
    tools: [
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: {
          en: 'E2E testing (178 cross-framework tests)',
          ja: 'E2Eテスト（178件のクロスフレームワークテスト）',
        },
      },
      {
        name: 'Testing Library',
        url: 'https://testing-library.com/',
        description: {
          en: 'Framework-specific testing utilities (React, Vue, Svelte)',
          ja: 'フレームワーク固有のテストユーティリティ（React, Vue, Svelte）',
        },
      },
      {
        name: 'axe-core',
        url: 'https://github.com/dequelabs/axe-core',
        description: {
          en: 'Automated accessibility testing',
          ja: '自動アクセシビリティテスト',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  testChecklist: [
    // ARIA - High Priority
    { description: 'role="spinbutton" exists on input', priority: 'high', category: 'aria' },
    { description: 'aria-valuenow set to current value', priority: 'high', category: 'aria' },
    {
      description: 'aria-valuemin only set when min is defined',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-valuemax only set when max is defined',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Accessible name required (label/aria-label/aria-labelledby)',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'aria-valuetext set when valueText/format provided',
      priority: 'high',
      category: 'aria',
    },
    { description: 'aria-disabled="true" when disabled', priority: 'high', category: 'aria' },
    { description: 'aria-readonly="true" when readOnly', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'ArrowUp increases value by step', priority: 'high', category: 'keyboard' },
    { description: 'ArrowDown decreases value by step', priority: 'high', category: 'keyboard' },
    {
      description: 'Home sets value to min (only when min defined)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'End sets value to max (only when max defined)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Page Up increases by large step', priority: 'high', category: 'keyboard' },
    { description: 'Page Down decreases by large step', priority: 'high', category: 'keyboard' },
    {
      description: 'Value stops at min/max boundaries (no wrapping)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Keys have no effect when disabled', priority: 'high', category: 'keyboard' },

    // Focus - High Priority
    { description: 'Input is focusable (tabindex="0")', priority: 'high', category: 'focus' },
    {
      description: 'Input not focusable when disabled (tabindex="-1")',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Buttons have tabindex="-1"', priority: 'high', category: 'focus' },
    { description: 'Focus stays on input after button click', priority: 'high', category: 'focus' },

    // Medium Priority
    { description: 'No axe-core violations', priority: 'medium', category: 'accessibility' },
    { description: 'Direct text input accepted', priority: 'medium', category: 'aria' },
    {
      description: 'Value validated and clamped on blur',
      priority: 'medium',
      category: 'aria',
    },
    {
      description: 'IME composition handled correctly',
      priority: 'medium',
      category: 'keyboard',
    },
  ],

  implementationNotes: `### Props Design

\`\`\`typescript
// Label: one of these required (exclusive)
type LabelProps =
  | { label: string; 'aria-label'?: never; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label': string; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label'?: never; 'aria-labelledby': string };

type SpinbuttonBaseProps = {
  defaultValue?: number;
  min?: number;           // default: undefined (no limit)
  max?: number;           // default: undefined (no limit)
  step?: number;          // default: 1
  largeStep?: number;     // default: step * 10
  disabled?: boolean;
  readOnly?: boolean;
  showButtons?: boolean;  // default: true
  onValueChange?: (value: number) => void;
};

export type SpinbuttonProps = SpinbuttonBaseProps & LabelProps;
\`\`\`

### Structure

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│ <div class="apg-spinbutton">                                │
│   <span class="apg-spinbutton-label">Label</span>           │
│   <div class="apg-spinbutton-controls">  ← focus ring here  │
│     <button tabindex="-1" aria-label="Decrement">−</button> │
│     <input                                                  │
│       role="spinbutton"                                     │
│       tabindex="0"                                          │
│       aria-valuenow="5"                                     │
│       aria-valuemin="0"      (only if min defined)          │
│       aria-valuemax="100"    (only if max defined)          │
│       inputmode="numeric"                                   │
│     />                                                      │
│     <button tabindex="-1" aria-label="Increment">+</button> │
│   </div>                                                    │
│ </div>                                                      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Common Pitfalls

1. **Missing accessible name**: Always require label, aria-label, or aria-labelledby
2. **Unconditional aria-valuemin/max**: Only set when min/max props are defined
3. **IME input handling**: Don't update aria-valuenow during composition
4. **Button focus steal**: Buttons must not receive focus on click
5. **Floating-point precision**: Round to step to avoid precision errors`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Role test
it('has role="spinbutton"', () => {
  render(<Spinbutton aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).toBeInTheDocument();
});

// ARIA values test
it('has aria-valuenow set to current value', () => {
  render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuenow', '5');
});

// No aria-valuemin when undefined
it('does not have aria-valuemin when min is undefined', () => {
  render(<Spinbutton aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-valuemin');
});

// Keyboard: ArrowUp
it('increases value on ArrowUp', async () => {
  const user = userEvent.setup();
  render(<Spinbutton defaultValue={5} step={1} aria-label="Quantity" />);
  const spinbutton = screen.getByRole('spinbutton');

  await user.click(spinbutton);
  await user.keyboard('{ArrowUp}');

  expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
});

// axe test
it('has no axe violations', async () => {
  const { container } = render(<Spinbutton aria-label="Quantity" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  const spinbutton = page.getByRole('spinbutton').first();

  await expect(spinbutton).toHaveRole('spinbutton');
  await expect(spinbutton).toHaveAttribute('aria-valuenow');
});

// Keyboard interaction test
test('ArrowUp increases value', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  const spinbutton = page.getByRole('spinbutton').first();

  await spinbutton.focus();
  const initialValue = await spinbutton.getAttribute('aria-valuenow');
  await page.keyboard.press('ArrowUp');

  const newValue = await spinbutton.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBe(Number(initialValue) + 1);
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  await page.getByRole('spinbutton').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('[role="spinbutton"]')
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
