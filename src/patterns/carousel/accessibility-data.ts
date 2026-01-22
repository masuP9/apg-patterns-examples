import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const carouselAccessibilityData: PatternAccessibilityData = {
  pattern: 'carousel',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/carousel/',

  overview: {
    en: 'A carousel presents a set of items (slides), one at a time, with controls to navigate between items. Supports auto-rotation with pause on focus/hover, keyboard navigation via tablist pattern, and touch/swipe gestures.',
    ja: 'カルーセルは一連のアイテム（スライド）を一度に1つずつ表示し、アイテム間を移動するためのコントロールを提供します。フォーカス/ホバー時の一時停止を伴う自動回転、タブリストパターンによるキーボードナビゲーション、タッチ/スワイプジェスチャーをサポートします。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'region',
      element: { en: 'Container (section)', ja: 'コンテナ（section）' },
      description: {
        en: 'Landmark region for the carousel',
        ja: 'カルーセルのランドマーク領域',
      },
    },
    {
      name: 'group',
      element: { en: 'Slides container', ja: 'スライドコンテナ' },
      description: {
        en: 'Groups all slides together',
        ja: 'すべてのスライドをグループ化',
      },
    },
    {
      name: 'tablist',
      element: { en: 'Tab container', ja: 'タブコンテナ' },
      description: {
        en: 'Container for slide indicator tabs',
        ja: 'スライドインジケータタブのコンテナ',
      },
    },
    {
      name: 'tab',
      element: { en: 'Each tab button', ja: '各タブボタン' },
      description: {
        en: 'Individual slide indicator',
        ja: '個々のスライドインジケータ',
      },
    },
    {
      name: 'tabpanel',
      element: { en: 'Each slide', ja: '各スライド' },
      description: {
        en: 'Individual slide content area',
        ja: '個々のスライドコンテンツエリア',
      },
    },
  ],

  properties: [
    {
      attribute: 'aria-roledescription',
      element: { en: 'Container', ja: 'コンテナ' },
      values: '"carousel"',
      required: true,
      notes: {
        en: 'Announces "carousel" to screen readers',
        ja: 'スクリーンリーダーに「carousel」と通知',
      },
    },
    {
      attribute: 'aria-roledescription',
      element: { en: 'Each slide (tabpanel)', ja: '各スライド（tabpanel）' },
      values: '"slide"',
      required: true,
      notes: {
        en: 'Announces "slide" instead of "tabpanel"',
        ja: '「tabpanel」の代わりに「slide」と通知',
      },
    },
    {
      attribute: 'aria-label',
      element: { en: 'Container', ja: 'コンテナ' },
      values: { en: 'Text', ja: 'テキスト' },
      required: true,
      notes: {
        en: 'Describes the carousel purpose',
        ja: 'カルーセルの目的を説明',
      },
    },
    {
      attribute: 'aria-label',
      element: { en: 'Each slide (tabpanel)', ja: '各スライド（tabpanel）' },
      values: '"N of M"',
      required: true,
      notes: {
        en: 'Slide position (e.g., "1 of 5")',
        ja: 'スライド位置（例: "1 of 5"）',
      },
    },
    {
      attribute: 'aria-controls',
      element: { en: 'Tab, Prev/Next buttons', ja: 'タブ、前へ/次へボタン' },
      values: { en: 'ID reference', ja: 'ID参照' },
      required: true,
      notes: {
        en: 'References controlled element',
        ja: '制御対象要素を参照',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: { en: 'Each slide (tabpanel)', ja: '各スライド（tabpanel）' },
      values: { en: 'ID reference', ja: 'ID参照' },
      required: true,
      notes: {
        en: 'References associated tab',
        ja: '関連するタブを参照',
      },
    },
    {
      attribute: 'aria-atomic',
      element: { en: 'Slides container', ja: 'スライドコンテナ' },
      values: '"false"',
      required: false,
      notes: {
        en: 'Only announce changed content',
        ja: '変更されたコンテンツのみ通知',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-selected',
      element: { en: 'Tab element', ja: 'tab 要素' },
      values: 'true | false',
      required: true,
      changeTrigger: {
        en: 'Tab click, Arrow keys, Prev/Next buttons, Auto-rotation',
        ja: 'タブクリック、矢印キー、前へ/次へボタン、自動回転',
      },
      reference: 'https://w3c.github.io/aria/#aria-selected',
    },
    {
      attribute: 'aria-live',
      element: { en: 'Slides container', ja: 'スライドコンテナ' },
      values: '"off" | "polite"',
      required: true,
      changeTrigger: {
        en: 'Play/Pause click, Focus in/out, Mouse hover',
        ja: '再生/一時停止クリック、フォーカスイン/アウト、マウスホバー',
      },
      reference: 'https://w3c.github.io/aria/#aria-live',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Navigate between controls (Play/Pause, tablist, Prev/Next)',
        ja: 'コントロール間を移動（再生/一時停止、タブリスト、前へ/次へ）',
      },
    },
    {
      key: 'ArrowRight',
      action: {
        en: 'Move to next slide indicator tab (loops to first)',
        ja: '次のスライドインジケータタブに移動（最初にループ）',
      },
    },
    {
      key: 'ArrowLeft',
      action: {
        en: 'Move to previous slide indicator tab (loops to last)',
        ja: '前のスライドインジケータタブに移動（最後にループ）',
      },
    },
    {
      key: 'Home',
      action: {
        en: 'Move focus to first slide indicator tab',
        ja: '最初のスライドインジケータタブにフォーカス移動',
      },
    },
    {
      key: 'End',
      action: {
        en: 'Move focus to last slide indicator tab',
        ja: '最後のスライドインジケータタブにフォーカス移動',
      },
    },
    {
      key: 'Enter / Space',
      action: {
        en: 'Activate focused tab or button',
        ja: 'フォーカスされたタブまたはボタンをアクティブ化',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Selected tab', ja: '選択中のタブ' },
      behavior: 'tabIndex="0"',
    },
    {
      event: { en: 'Other tabs', ja: '他のタブ' },
      behavior: 'tabIndex="-1"',
    },
    {
      event: { en: 'Keyboard focus enters carousel', ja: 'キーボードフォーカスがカルーセルに入る' },
      behavior: {
        en: 'Rotation pauses temporarily, aria-live changes to "polite"',
        ja: '回転が一時的に停止、aria-live が "polite" に変更',
      },
    },
    {
      event: {
        en: 'Keyboard focus leaves carousel',
        ja: 'キーボードフォーカスがカルーセルから離れる',
      },
      behavior: {
        en: 'Rotation resumes (if auto-rotate mode is on)',
        ja: '回転が再開（自動回転モードがオンの場合）',
      },
    },
    {
      event: { en: 'Mouse hovers over slides', ja: 'マウスがスライド上をホバー' },
      behavior: {
        en: 'Rotation pauses temporarily',
        ja: '回転が一時的に停止',
      },
    },
    {
      event: { en: 'Mouse leaves slides', ja: 'マウスがスライドから離れる' },
      behavior: {
        en: 'Rotation resumes (if auto-rotate mode is on)',
        ja: '回転が再開（自動回転モードがオンの場合）',
      },
    },
    {
      event: { en: 'Pause button clicked', ja: '一時停止ボタンをクリック' },
      behavior: {
        en: 'Turns off auto-rotate mode, button shows play icon',
        ja: '自動回転モードをオフ、ボタンは再生アイコンを表示',
      },
    },
    {
      event: { en: 'Play button clicked', ja: '再生ボタンをクリック' },
      behavior: {
        en: 'Turns on auto-rotate mode and starts rotation immediately',
        ja: '自動回転モードをオンにし、即座に回転を開始',
      },
    },
    {
      event: { en: 'prefers-reduced-motion: reduce', ja: 'prefers-reduced-motion: reduce' },
      behavior: {
        en: 'Auto-rotation disabled by default',
        ja: '自動回転がデフォルトで無効',
      },
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'Set aria-live to "off" during auto-rotation to prevent interrupting users. Changes to "polite" when rotation stops, allowing slide changes to be announced.',
      ja: '自動回転中はユーザーの作業を中断しないよう aria-live を "off" に設定されます。回転が停止すると "polite" に変更され、スライド変更が通知されるようになります。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG Carousel Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/carousel/',
    },
  ],

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Container API)', ja: 'ユニットテスト（Container API）' },
        description: {
          en: "Verify the component's HTML output using Astro Container API. These tests ensure correct template rendering without requiring a browser.",
          ja: 'Astro Container APIを使用してコンポーネントのHTML出力を検証します。これらのテストはブラウザを必要とせずに正しいテンプレートレンダリングを確認します。',
        },
        areas: [
          {
            en: 'HTML structure and element hierarchy',
            ja: 'HTML構造と要素の階層',
          },
          {
            en: 'Initial ARIA attributes (aria-roledescription, aria-label, aria-selected)',
            ja: '初期ARIA属性（aria-roledescription, aria-label, aria-selected）',
          },
          {
            en: 'Tablist/tab/tabpanel structure',
            ja: 'tablist/tab/tabpanel構造',
          },
          {
            en: 'Initial tabindex values (roving tabindex)',
            ja: '初期tabindex値（ローヴィングタブインデックス）',
          },
          {
            en: 'CSS class application',
            ja: 'CSSクラスの適用',
          },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト（Playwright）' },
        description: {
          en: 'Verify Web Component behavior in a real browser environment. These tests cover interactions that require JavaScript execution.',
          ja: '実際のブラウザ環境でWeb Componentの動作を検証します。これらのテストはJavaScriptの実行を必要とするインタラクションをカバーします。',
        },
        areas: [
          {
            en: 'Keyboard navigation (Arrow keys, Home, End)',
            ja: 'キーボードナビゲーション（矢印キー、Home、End）',
          },
          {
            en: 'Tab selection and slide changes',
            ja: 'タブ選択とスライド変更',
          },
          {
            en: 'Auto-rotation start/stop',
            ja: '自動回転の開始/停止',
          },
          {
            en: 'Play/pause button interaction',
            ja: '再生/一時停止ボタンの操作',
          },
          {
            en: 'Focus management during navigation',
            ja: 'ナビゲーション中のフォーカス管理',
          },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: { en: 'ARIA Structure', ja: 'ARIA構造' },
        testType: 'Unit',
        items: [
          {
            name: 'aria-roledescription="carousel"',
            description: {
              en: 'Container has carousel role description',
              ja: 'コンテナにcarouselロール記述がある',
            },
          },
          {
            name: 'aria-roledescription="slide"',
            description: {
              en: 'Each tabpanel has slide role description',
              ja: '各tabpanelにslideロール記述がある',
            },
          },
          {
            name: 'aria-label (container)',
            description: {
              en: 'Container has accessible name',
              ja: 'コンテナにアクセシブルな名前がある',
            },
          },
          {
            name: 'aria-label="N of M"',
            description: {
              en: 'Each slide has position label (e.g., "1 of 5")',
              ja: '各スライドに位置ラベルがある（例: "1 of 5"）',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Tablist ARIA', ja: 'Tablist ARIA' },
        testType: 'Unit',
        items: [
          {
            name: 'role="tablist"',
            description: {
              en: 'Tab container has tablist role',
              ja: 'タブコンテナにtablistロールがある',
            },
          },
          {
            name: 'role="tab"',
            description: {
              en: 'Each slide indicator has tab role',
              ja: '各スライドインジケータにtabロールがある',
            },
          },
          {
            name: 'role="tabpanel"',
            description: {
              en: 'Each slide has tabpanel role',
              ja: '各スライドにtabpanelロールがある',
            },
          },
          {
            name: 'aria-selected',
            description: {
              en: 'Active tab has aria-selected="true"',
              ja: 'アクティブなタブにaria-selected="true"がある',
            },
          },
          {
            name: 'aria-controls',
            description: {
              en: 'Tab references its slide via aria-controls',
              ja: 'タブがaria-controls経由でスライドを参照',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Keyboard Interaction', ja: 'キーボード操作' },
        testType: 'E2E',
        items: [
          {
            name: 'ArrowRight',
            description: {
              en: 'Moves focus and activates next slide tab',
              ja: '次のスライドタブにフォーカスを移動しアクティブ化',
            },
          },
          {
            name: 'ArrowLeft',
            description: {
              en: 'Moves focus and activates previous slide tab',
              ja: '前のスライドタブにフォーカスを移動しアクティブ化',
            },
          },
          {
            name: 'Loop navigation',
            description: {
              en: 'Arrow keys loop from last to first and vice versa',
              ja: '矢印キーで最後から最初へ、またはその逆にループ',
            },
          },
          {
            name: 'Home/End',
            description: {
              en: 'Moves focus to first/last slide tab',
              ja: '最初/最後のスライドタブにフォーカスを移動',
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
            name: 'tabIndex=0 (Unit)',
            description: {
              en: 'Selected tab has tabIndex=0 initially',
              ja: '選択されたタブは初期状態でtabIndex=0を持つ',
            },
          },
          {
            name: 'tabIndex=-1 (Unit)',
            description: {
              en: 'Non-selected tabs have tabIndex=-1 initially',
              ja: '選択されていないタブは初期状態でtabIndex=-1を持つ',
            },
          },
          {
            name: 'Roving tabindex (E2E)',
            description: {
              en: 'Only one tab has tabIndex=0 during navigation',
              ja: 'ナビゲーション中に1つのタブのみがtabIndex=0を持つ',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Auto-Rotation', ja: '自動回転' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'aria-live="off" (Unit)',
            description: {
              en: 'Initial aria-live when autoRotate is true',
              ja: 'autoRotateがtrueの場合の初期aria-live',
            },
          },
          {
            name: 'aria-live="polite" (Unit)',
            description: {
              en: 'Initial aria-live when autoRotate is false',
              ja: 'autoRotateがfalseの場合の初期aria-live',
            },
          },
          {
            name: 'Play/Pause button (Unit)',
            description: {
              en: 'Button is rendered when autoRotate is true',
              ja: 'autoRotateがtrueの場合にボタンがレンダリングされる',
            },
          },
          {
            name: 'Play/Pause toggle (E2E)',
            description: {
              en: 'Button toggles rotation state',
              ja: 'ボタンで回転状態を切り替え',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Navigation Controls', ja: 'ナビゲーションコントロール' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Prev/Next buttons (Unit)',
            description: {
              en: 'Navigation buttons are rendered',
              ja: 'ナビゲーションボタンがレンダリングされる',
            },
          },
          {
            name: 'aria-controls (Unit)',
            description: {
              en: 'Buttons have aria-controls pointing to slides container',
              ja: 'ボタンがスライドコンテナを指すaria-controlsを持つ',
            },
          },
          {
            name: 'Next button (E2E)',
            description: {
              en: 'Shows next slide on click',
              ja: 'クリックで次のスライドを表示',
            },
          },
          {
            name: 'Previous button (E2E)',
            description: {
              en: 'Shows previous slide on click',
              ja: 'クリックで前のスライドを表示',
            },
          },
          {
            name: 'Loop navigation (E2E)',
            description: {
              en: 'Loops from last to first and vice versa',
              ja: '最後から最初へ、またはその逆にループ',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'HTML Attributes', ja: 'HTML属性' },
        testType: 'Unit',
        items: [
          {
            name: 'class attribute',
            description: {
              en: 'Custom classes are applied to container',
              ja: 'カスタムクラスがコンテナに適用される',
            },
          },
          {
            name: 'id attribute',
            description: {
              en: 'ID attribute is correctly set',
              ja: 'ID属性が正しく設定される',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/carousel.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Carousel', ja: 'Carouselのユニットテストを実行' },
        command: 'npm run test -- carousel',
      },
      {
        comment: {
          en: 'Run E2E tests for Carousel (all frameworks)',
          ja: 'CarouselのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=carousel',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: {
          en: 'Test runner for unit tests with fake timers for auto-rotation testing',
          ja: '自動回転テスト用のフェイクタイマー付きテストランナー',
        },
      },
      {
        name: 'Astro Container API',
        url: 'https://docs.astro.build/en/reference/container-reference/',
        description: {
          en: 'Server-side component rendering for unit tests',
          ja: 'ユニットテスト用のサーバーサイドコンポーネントレンダリング',
        },
      },
      {
        name: 'Playwright',
        url: 'https://playwright.dev/',
        description: { en: 'Browser automation for E2E tests', ja: 'E2Eテスト用のブラウザ自動化' },
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
        name: 'jest-axe',
        url: 'https://github.com/nickcolley/jest-axe',
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
    // ARIA - High Priority
    {
      description: 'Container has aria-roledescription="carousel"',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Container has aria-label describing purpose',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Each tabpanel has aria-roledescription="slide"',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Each tabpanel has aria-label="N of M"', priority: 'high', category: 'aria' },
    { description: 'Tab container has role="tablist"', priority: 'high', category: 'aria' },
    {
      description: 'Each tab has role="tab" and aria-controls',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Active tab has aria-selected="true"', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'ArrowRight moves to next tab (wraps)', priority: 'high', category: 'keyboard' },
    {
      description: 'ArrowLeft moves to previous tab (wraps)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Home moves to first tab', priority: 'high', category: 'keyboard' },
    { description: 'End moves to last tab', priority: 'high', category: 'keyboard' },
    { description: 'Enter/Space activates tab or button', priority: 'high', category: 'keyboard' },

    // Focus - High Priority
    { description: 'Only one tab has tabindex="0" at a time', priority: 'high', category: 'focus' },
    { description: 'Rotation control is first in tab order', priority: 'high', category: 'focus' },

    // Auto-rotation - High Priority
    { description: 'aria-live="off" during rotation', priority: 'high', category: 'aria' },
    { description: 'aria-live="polite" when rotation stopped', priority: 'high', category: 'aria' },
    { description: 'Rotation pauses on keyboard focus', priority: 'high', category: 'focus' },
    { description: 'Rotation pauses on mouse hover', priority: 'high', category: 'focus' },
    { description: 'Play/pause button toggles rotation', priority: 'high', category: 'click' },
    { description: 'Respects prefers-reduced-motion', priority: 'high', category: 'accessibility' },

    // Navigation - Medium Priority
    { description: 'Next button shows next slide', priority: 'medium', category: 'click' },
    { description: 'Previous button shows previous slide', priority: 'medium', category: 'click' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`
section[aria-roledescription="carousel"][aria-label="..."]
├── div[role="group"][aria-live="off|polite"]  (slides container)
│   └── div[role="tabpanel"][aria-roledescription="slide"][aria-label="1 of N"]
│       └── <Slide Content>
└── div.controls  (below slides)
    ├── button  (Play/Pause - first tab stop)
    ├── div[role="tablist"]
    │   └── button[role="tab"]*  (roving tabindex)
    └── div[role="group"]  (prev/next)
        ├── button  (Previous)
        └── button  (Next)
\`\`\`

## Auto-Rotation State Model

Two independent boolean states:

\`\`\`
autoRotateMode: boolean       // User's intent (toggled by play/pause button)
isPausedByInteraction: boolean // Temporary pause (focus/hover)

isActuallyRotating = autoRotateMode && !isPausedByInteraction
\`\`\`

**State transitions:**
- click pause button → autoRotateMode = false
- click play button → autoRotateMode = true (also resets isPausedByInteraction)
- focus enters carousel → isPausedByInteraction = true
- focus leaves carousel → isPausedByInteraction = false
- hover enters slides → isPausedByInteraction = true
- hover leaves slides → isPausedByInteraction = false

**UI behavior:**
- Button icon reflects \`autoRotateMode\` only
- \`aria-live\` uses \`isActuallyRotating\`: "off" when rotating, "polite" when paused`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from './Carousel';

const slides = [
  { id: '1', content: <div>Slide 1</div> },
  { id: '2', content: <div>Slide 2</div> },
  { id: '3', content: <div>Slide 3</div> },
];

describe('Carousel', () => {
  describe('APG: ARIA Structure', () => {
    it('has aria-roledescription="carousel" on container', () => {
      render(<Carousel slides={slides} aria-label="Featured" />);
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('has aria-roledescription="slide" on each tabpanel', () => {
      render(<Carousel slides={slides} aria-label="Featured" />);
      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      panels.forEach((panel) => {
        expect(panel).toHaveAttribute('aria-roledescription', 'slide');
      });
    });
  });

  describe('APG: Keyboard Interaction', () => {
    it('moves focus to next tab on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Carousel slides={slides} aria-label="Featured" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');

      expect(tabs[1]).toHaveFocus();
    });
  });
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';

const carouselSelector = '[data-testid="carousel-manual"]';

test('has aria-roledescription="carousel" on container', async ({ page }) => {
  await page.goto('patterns/carousel/react/');
  await page.locator(carouselSelector).waitFor();

  const carousel = page.locator(carouselSelector);
  await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
});

test('ArrowRight/ArrowLeft navigate tabs with wrapping', async ({ page }) => {
  await page.goto('patterns/carousel/react/');

  const carousel = page.locator(carouselSelector);
  const tabs = carousel.locator('[role="tablist"] [role="tab"]');
  const firstTab = tabs.first();

  await firstTab.click();
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowRight');
  const secondTab = tabs.nth(1);
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');
});`,
};
