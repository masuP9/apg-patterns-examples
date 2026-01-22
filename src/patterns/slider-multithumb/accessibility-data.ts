import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const sliderMultithumbAccessibilityData: PatternAccessibilityData = {
  pattern: 'slider-multithumb',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/',

  overview: {
    en: 'A multi-thumb slider is an input widget with two thumbs that allows users to select a range of values from within a given range. Each thumb can be moved along a track to adjust the lower and upper bounds of the selected range.',
    ja: 'マルチサムスライダーは、2つのつまみを持つ入力ウィジェットで、ユーザーが特定の範囲内から値の範囲を選択できます。各つまみはトラックに沿って移動させ、選択した範囲の下限と上限を調整できます。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'slider',
      element: { en: 'Lower thumb element', ja: '下限つまみ要素' },
      description: {
        en: 'Identifies the element as a slider for selecting the lower bound of the range.',
        ja: '範囲の下限を選択するためのスライダーとして要素を識別します。',
      },
    },
    {
      name: 'slider',
      element: { en: 'Upper thumb element', ja: '上限つまみ要素' },
      description: {
        en: 'Identifies the element as a slider for selecting the upper bound of the range.',
        ja: '範囲の上限を選択するためのスライダーとして要素を識別します。',
      },
    },
    {
      name: 'group',
      element: { en: 'Container element', ja: 'コンテナ要素' },
      description: {
        en: 'Groups the two sliders together and associates them with a common label.',
        ja: '2つのスライダーをグループ化し、共通のラベルに関連付けます。',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-valuenow',
      element: { en: 'Each slider element', ja: '各slider要素' },
      values: 'Number',
      required: true,
      notes: {
        en: 'Updated dynamically when value changes via keyboard or pointer',
        ja: 'キーボードまたはポインターによる値変更時に動的に更新',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuenow',
    },
    {
      attribute: 'aria-valuemin',
      element: { en: 'Each slider element', ja: '各slider要素' },
      values: 'Number',
      required: true,
      notes: {
        en: 'Static for lower thumb (absolute min), dynamic for upper thumb (lower value + minDistance)',
        ja: '下限つまみは静的（絶対最小値）、上限つまみは動的（下限値 + minDistance）',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemin',
    },
    {
      attribute: 'aria-valuemax',
      element: { en: 'Each slider element', ja: '各slider要素' },
      values: 'Number',
      required: true,
      notes: {
        en: 'Dynamic for lower thumb (upper value - minDistance), static for upper thumb (absolute max)',
        ja: '下限つまみは動的（上限値 - minDistance）、上限つまみは静的（絶対最大値）',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuemax',
    },
    {
      attribute: 'aria-valuetext',
      element: { en: 'Each slider element', ja: '各slider要素' },
      values: 'String',
      required: {
        en: 'No (recommended when value needs context)',
        ja: 'いいえ（値にコンテキストが必要な場合は推奨）',
      },
      notes: {
        en: 'Example: "$20", "$80", "20% - 80%"',
        ja: '例: "$20", "$80", "20% - 80%"',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-valuetext',
    },
    {
      attribute: 'aria-orientation',
      element: { en: 'Each slider element', ja: '各slider要素' },
      values: '"horizontal" | "vertical"',
      required: false,
      notes: {
        en: 'Default: horizontal (implicit). Only set for vertical sliders.',
        ja: 'デフォルト: horizontal（暗黙的）。垂直スライダーの場合のみ設定。',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-orientation',
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'Each slider element', ja: '各slider要素' },
      values: 'true | undefined',
      required: false,
      notes: {
        en: 'Set only when disabled',
        ja: '無効化時のみ設定',
      },
      specUrl: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Moves focus between thumbs (lower to upper)',
        ja: 'つまみ間でフォーカスを移動（下限から上限へ）',
      },
    },
    {
      key: 'Shift + Tab',
      action: {
        en: 'Moves focus between thumbs (upper to lower)',
        ja: 'つまみ間でフォーカスを移動（上限から下限へ）',
      },
    },
    {
      key: 'Right Arrow',
      action: {
        en: 'Increases the value by one step',
        ja: '値を1ステップ増加させる',
      },
    },
    {
      key: 'Up Arrow',
      action: {
        en: 'Increases the value by one step',
        ja: '値を1ステップ増加させる',
      },
    },
    {
      key: 'Left Arrow',
      action: {
        en: 'Decreases the value by one step',
        ja: '値を1ステップ減少させる',
      },
    },
    {
      key: 'Down Arrow',
      action: {
        en: 'Decreases the value by one step',
        ja: '値を1ステップ減少させる',
      },
    },
    {
      key: 'Home',
      action: {
        en: 'Sets the thumb to its minimum allowed value (dynamic for upper thumb)',
        ja: 'つまみを許容最小値に設定（上限つまみは動的）',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Sets the thumb to its maximum allowed value (dynamic for lower thumb)',
        ja: 'つまみを許容最大値に設定（下限つまみは動的）',
      },
    },
    {
      key: 'Page Up',
      action: {
        en: 'Increases the value by a large step (default: step * 10)',
        ja: '値を大きいステップで増加させる（デフォルト: step * 10）',
      },
    },
    {
      key: 'Page Down',
      action: {
        en: 'Decreases the value by a large step (default: step * 10)',
        ja: '値を大きいステップで減少させる（デフォルト: step * 10）',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Tab order', ja: 'タブ順序' },
      behavior: {
        en: 'Both thumbs are in the tab order (tabindex="0")',
        ja: '両方のつまみがタブ順序に含まれる（tabindex="0"）',
      },
    },
    {
      event: { en: 'Constant order', ja: '固定順序' },
      behavior: {
        en: 'Lower thumb always comes first in tab order, regardless of values',
        ja: '値に関係なく、下限つまみが常にタブ順序で先に来る',
      },
    },
    {
      event: { en: 'Track click', ja: 'トラッククリック' },
      behavior: {
        en: 'Clicking the track moves the nearest thumb and focuses it',
        ja: 'トラックをクリックすると最も近いつまみが移動してフォーカスされる',
      },
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG: Slider (Multi-Thumb) Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/',
    },
    {
      title: 'W3C ARIA: slider role',
      url: 'https://w3c.github.io/aria/#slider',
    },
    {
      title: 'W3C ARIA: group role',
      url: 'https://w3c.github.io/aria/#group',
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Each thumb is an independent slider element with its own ARIA attributes. The group role establishes the semantic relationship between the two sliders.',
      ja: '各つまみは独自のARIA属性を持つ独立したスライダー要素です。groupロールが2つのスライダー間のセマンティックな関係を確立します。',
    },
    {
      en: 'Multi-thumb sliders require careful labeling to distinguish between the two thumbs. Use aria-label tuple, aria-labelledby tuple, or getAriaLabel function.',
      ja: 'マルチサムスライダーでは、2つのつまみを区別するために慎重なラベル付けが必要です。aria-labelタプル、aria-labelledbyタプル、またはgetAriaLabel関数を使用してください。',
    },
    {
      en: 'Dynamic bounds: Per the APG specification, when the range of one slider depends on the value of another, aria-valuemin/aria-valuemax must update dynamically.',
      ja: '動的な境界: APG仕様に従い、一方のスライダーの範囲が他方の値に依存する場合、aria-valuemin/aria-valuemaxは動的に更新する必要があります。',
    },
  ],

  // --- Mouse/Pointer Behavior ---

  mousePointerBehavior: [
    {
      en: 'Click on track: Moves the nearest thumb to the clicked position',
      ja: 'トラックをクリック: 最も近いつまみをクリック位置に移動',
    },
    {
      en: 'Drag thumb: Allows continuous adjustment while dragging',
      ja: 'つまみをドラッグ: ドラッグ中の連続的な調整が可能',
    },
    {
      en: 'Pointer capture: Maintains interaction even when pointer moves outside the slider',
      ja: 'ポインターキャプチャ: ポインターがスライダーの外に出てもインタラクションを維持',
    },
  ],

  // --- Visual Design ---

  visualDesign: [
    {
      en: 'Focus indicator: Visible focus ring on each thumb element',
      ja: 'フォーカスインジケーター: 各つまみ要素に可視のフォーカスリング',
    },
    {
      en: 'Range indicator: Visual representation of the selected range between thumbs',
      ja: '範囲インジケーター: つまみ間の選択範囲の視覚的表現',
    },
    {
      en: 'Hover states: Visual feedback on hover',
      ja: 'ホバー状態: ホバー時の視覚的フィードバック',
    },
    {
      en: 'Disabled state: Clear visual indication when slider is disabled',
      ja: '無効状態: スライダーが無効な時の明確な視覚的表示',
    },
    {
      en: 'Forced colors mode: Uses system colors for accessibility in Windows High Contrast Mode',
      ja: '強制カラーモード: Windowsハイコントラストモードでのアクセシビリティのためにシステムカラーを使用',
    },
  ],

  // --- Testing Documentation ---

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
            en: 'ARIA attributes (role="slider", aria-valuenow, aria-valuemin, aria-valuemax)',
            ja: 'ARIA属性（role="slider"、aria-valuenow、aria-valuemin、aria-valuemax）',
          },
          {
            en: 'Dynamic bounds update when thumb values change',
            ja: 'つまみの値が変更されたときの動的な境界の更新',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Home, End, Page Up/Down)',
            ja: 'キーボードインタラクション（矢印キー、Home、End、Page Up/Down）',
          },
          {
            en: 'Collision prevention between thumbs',
            ja: 'つまみ間の衝突防止',
          },
          { en: 'Disabled state handling', ja: '無効状態の処理' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストはインタラクションとフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          { en: 'Keyboard navigation and value changes', ja: 'キーボードナビゲーションと値の変更' },
          { en: 'Dynamic ARIA bounds in live browser', ja: 'ライブブラウザでの動的ARIA境界' },
          { en: 'Collision prevention behavior', ja: '衝突防止の動作' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreによるアクセシビリティスキャン' },
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
        title: { en: 'ARIA Structure', ja: 'ARIA 構造' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'two slider elements',
            description: {
              en: 'Container has exactly two elements with role="slider"',
              ja: 'コンテナにrole="slider"を持つ要素がちょうど2つある',
            },
          },
          {
            name: 'role="group"',
            description: {
              en: 'Sliders are contained in a group with aria-labelledby',
              ja: 'スライダーがaria-labelledbyを持つグループに含まれている',
            },
          },
          {
            name: 'aria-valuenow',
            description: {
              en: 'Both thumbs have correct initial values',
              ja: '両方のつまみに正しい初期値が設定されている',
            },
          },
          {
            name: 'static aria-valuemin',
            description: {
              en: 'Lower thumb has static min (absolute minimum)',
              ja: '下限つまみに静的な最小値（絶対最小値）がある',
            },
          },
          {
            name: 'static aria-valuemax',
            description: {
              en: 'Upper thumb has static max (absolute maximum)',
              ja: '上限つまみに静的な最大値（絶対最大値）がある',
            },
          },
          {
            name: 'dynamic aria-valuemax',
            description: {
              en: "Lower thumb's max depends on upper thumb's value",
              ja: '下限つまみの最大値が上限つまみの値に依存する',
            },
          },
          {
            name: 'dynamic aria-valuemin',
            description: {
              en: "Upper thumb's min depends on lower thumb's value",
              ja: '上限つまみの最小値が下限つまみの値に依存する',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Dynamic Bounds Update', ja: '動的な境界の更新' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'lower -> upper bound',
            description: {
              en: "Moving lower thumb updates upper thumb's aria-valuemin",
              ja: '下限つまみを動かすと上限つまみのaria-valueminが更新される',
            },
          },
          {
            name: 'upper -> lower bound',
            description: {
              en: "Moving upper thumb updates lower thumb's aria-valuemax",
              ja: '上限つまみを動かすと下限つまみのaria-valuemaxが更新される',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Keyboard Interaction', ja: 'キーボードインタラクション' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Arrow Right/Up',
            description: {
              en: 'Increases value by one step',
              ja: '値を1ステップ増加',
            },
          },
          {
            name: 'Arrow Left/Down',
            description: {
              en: 'Decreases value by one step',
              ja: '値を1ステップ減少',
            },
          },
          {
            name: 'Home (lower)',
            description: {
              en: 'Sets lower thumb to absolute minimum',
              ja: '下限つまみを絶対最小値に設定',
            },
          },
          {
            name: 'End (lower)',
            description: {
              en: 'Sets lower thumb to dynamic maximum (upper - minDistance)',
              ja: '下限つまみを動的最大値に設定（上限 - minDistance）',
            },
          },
          {
            name: 'Home (upper)',
            description: {
              en: 'Sets upper thumb to dynamic minimum (lower + minDistance)',
              ja: '上限つまみを動的最小値に設定（下限 + minDistance）',
            },
          },
          {
            name: 'End (upper)',
            description: {
              en: 'Sets upper thumb to absolute maximum',
              ja: '上限つまみを絶対最大値に設定',
            },
          },
          {
            name: 'Page Up/Down',
            description: {
              en: 'Increases/decreases value by large step',
              ja: '値を大きいステップで増加/減少',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Collision Prevention', ja: '衝突防止' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'lower cannot exceed upper',
            description: {
              en: 'Lower thumb stops at (upper - minDistance)',
              ja: '下限つまみが（上限 - minDistance）で停止する',
            },
          },
          {
            name: 'upper cannot go below lower',
            description: {
              en: 'Upper thumb stops at (lower + minDistance)',
              ja: '上限つまみが（下限 + minDistance）で停止する',
            },
          },
          {
            name: 'rapid key presses',
            description: {
              en: 'Thumbs do not cross when rapidly pressing arrow keys',
              ja: '矢印キーを連打してもつまみが交差しない',
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
            name: 'Tab order',
            description: {
              en: 'Tab moves from lower to upper thumb',
              ja: 'Tabで下限から上限つまみに移動',
            },
          },
          {
            name: 'Shift+Tab order',
            description: {
              en: 'Shift+Tab moves from upper to lower thumb',
              ja: 'Shift+Tabで上限から下限つまみに移動',
            },
          },
          {
            name: 'tabindex="0"',
            description: {
              en: 'Both thumbs have tabindex="0" (always in tab order)',
              ja: '両方のつまみにtabindex="0"がある（常にタブ順序に含まれる）',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'aria-valuetext Updates', ja: 'aria-valuetextの更新' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'lower thumb update',
            description: {
              en: 'aria-valuetext updates when lower thumb value changes',
              ja: '下限つまみの値が変更されるとaria-valuetextが更新される',
            },
          },
          {
            name: 'upper thumb update',
            description: {
              en: 'aria-valuetext updates when upper thumb value changes',
              ja: '上限つまみの値が変更されるとaria-valuetextが更新される',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility', ja: 'アクセシビリティ' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'axe violations (container)',
            description: {
              en: 'No accessibility violations on the container',
              ja: 'コンテナにアクセシビリティ違反がない',
            },
          },
          {
            name: 'axe violations (sliders)',
            description: {
              en: 'No accessibility violations on each slider element',
              ja: '各スライダー要素にアクセシビリティ違反がない',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Cross-framework Consistency', ja: 'フレームワーク間の一貫性' },
        testType: 'E2E',
        items: [
          {
            name: 'render two sliders',
            description: {
              en: 'All frameworks render exactly two slider elements',
              ja: 'すべてのフレームワークがちょうど2つのスライダー要素をレンダリング',
            },
          },
          {
            name: 'consistent initial values',
            description: {
              en: 'All frameworks have identical initial aria-valuenow values',
              ja: 'すべてのフレームワークで同一の初期aria-valuenow値',
            },
          },
          {
            name: 'keyboard navigation',
            description: {
              en: 'All frameworks support identical keyboard navigation',
              ja: 'すべてのフレームワークで同一のキーボードナビゲーション',
            },
          },
          {
            name: 'collision prevention',
            description: {
              en: 'All frameworks prevent thumb crossing',
              ja: 'すべてのフレームワークでつまみの交差を防止',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/slider-multithumb.spec.ts',
    commands: [
      {
        comment: {
          en: 'Run unit tests for MultiThumbSlider',
          ja: 'MultiThumbSliderのユニットテストを実行',
        },
        command: 'npm run test -- MultiThumbSlider',
      },
      {
        comment: {
          en: 'Run E2E tests for MultiThumbSlider (all frameworks)',
          ja: 'MultiThumbSliderのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=slider-multithumb',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定フレームワークのE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=slider-multithumb',
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
          en: 'Framework-specific testing utilities',
          ja: 'フレームワーク別テストユーティリティ',
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
        description: {
          en: 'Accessibility testing engine',
          ja: 'アクセシビリティテストエンジン',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // ARIA - High Priority
    { description: 'Has two elements with role="slider"', priority: 'high', category: 'aria' },
    { description: 'Container has role="group"', priority: 'high', category: 'aria' },
    { description: 'Both thumbs have aria-valuenow', priority: 'high', category: 'aria' },
    {
      description: 'Dynamic aria-valuemin/max updates on thumb movement',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Has accessible names for both thumbs', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'Right/Up Arrow increases value', priority: 'high', category: 'keyboard' },
    { description: 'Left/Down Arrow decreases value', priority: 'high', category: 'keyboard' },
    {
      description: 'Home sets to minimum (dynamic for upper)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'End sets to maximum (dynamic for lower)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Page Up/Down changes value by large step',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Thumbs cannot cross each other', priority: 'high', category: 'keyboard' },

    // Focus - High Priority
    { description: 'Tab moves between thumbs in order', priority: 'high', category: 'focus' },
    { description: 'Both thumbs are focusable', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Focus indicator visible on each thumb',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Multi-Thumb Slider Specifics

Unlike a single-thumb slider, multi-thumb sliders require:
- **Two slider elements** within a \`group\` role container
- **Dynamic bounds** that update based on the other thumb's value
- **Collision prevention** to ensure thumbs don't cross

## Structure

\`\`\`
<div role="group" aria-labelledby="label-id">
  <span id="label-id">Price Range</span>
  <div class="slider-track">
    <div class="slider-fill" />
    <div
      role="slider"
      tabindex="0"
      aria-valuenow="20"
      aria-valuemin="0"
      aria-valuemax="80"  <!-- Dynamic: upper value -->
      aria-label="Minimum Price"
    />
    <div
      role="slider"
      tabindex="0"
      aria-valuenow="80"
      aria-valuemin="20"  <!-- Dynamic: lower value -->
      aria-valuemax="100"
      aria-label="Maximum Price"
    />
  </div>
</div>

Visual Layout:
┌─────────────────────────────────────┐
│ Price Range                          │
│ ├─────●━━━━━━━━━━━━●────────────────┤
│ 0     20          80            100  │
└─────────────────────────────────────┘
       ↑            ↑
   Lower Thumb  Upper Thumb
\`\`\`

## Accessible Naming

Each thumb needs its own label:
- \`aria-label\` tuple: \`["Minimum Price", "Maximum Price"]\`
- \`aria-labelledby\` tuple: Reference separate label elements
- \`getAriaLabel\` function: Dynamic label based on thumb index

## Dynamic Bounds

Per APG specification:
- Lower thumb's \`aria-valuemax\` = upper value - minDistance
- Upper thumb's \`aria-valuemin\` = lower value + minDistance

This ensures Home/End keys behave correctly for assistive technology users.`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA structure test
it('renders two slider elements in a group', () => {
  render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);

  const sliders = screen.getAllByRole('slider');
  expect(sliders).toHaveLength(2);
  expect(screen.getByRole('group')).toBeInTheDocument();
});

// Dynamic bounds test
it('updates aria-valuemin/max dynamically', async () => {
  const user = userEvent.setup();
  render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);

  const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

  // Lower thumb's max should be upper value
  expect(lowerThumb).toHaveAttribute('aria-valuemax', '80');
  // Upper thumb's min should be lower value
  expect(upperThumb).toHaveAttribute('aria-valuemin', '20');

  // Move lower thumb
  lowerThumb.focus();
  await user.keyboard('{ArrowRight}');

  // Upper thumb's min should update
  expect(upperThumb).toHaveAttribute('aria-valuemin', '21');
});

// Collision prevention test
it('prevents thumbs from crossing', async () => {
  const user = userEvent.setup();
  render(<MultiThumbSlider defaultValue={[50, 55]} aria-label={['Min', 'Max']} />);

  const [lowerThumb] = screen.getAllByRole('slider');
  lowerThumb.focus();

  // Try to move lower thumb past upper
  for (let i = 0; i < 10; i++) {
    await user.keyboard('{ArrowRight}');
  }

  // Should stop at upper value
  expect(lowerThumb).toHaveAttribute('aria-valuenow', '55');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has two sliders in a group', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const group = page.getByRole('group');
  const sliders = group.getByRole('slider');

  await expect(sliders).toHaveCount(2);
});

// Dynamic bounds test
test('updates dynamic bounds on thumb movement', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

  await lowerThumb.focus();
  await page.keyboard.press('ArrowRight');

  const newMin = await upperThumb.getAttribute('aria-valuemin');
  expect(Number(newMin)).toBeGreaterThan(20); // Original lower value
});

// Collision prevention test
test('prevents thumb crossing via keyboard', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

  // Get upper thumb's current value
  const upperValue = await upperThumb.getAttribute('aria-valuenow');

  await lowerThumb.focus();
  // Press End to try to go to max
  await page.keyboard.press('End');

  // Lower thumb should stop at upper value
  const lowerValue = await lowerThumb.getAttribute('aria-valuenow');
  expect(Number(lowerValue)).toBeLessThanOrEqual(Number(upperValue));
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const group = page.getByRole('group').first();
  await group.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="group"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
