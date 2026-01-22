import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const radioGroupAccessibilityData: PatternAccessibilityData = {
  pattern: 'radio-group',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',

  overview: {
    en: 'A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.',
    ja: 'ラジオグループは、ラジオボタンと呼ばれるチェック可能なボタンのセットで、一度に1つのボタンしかチェックできません。',
  },

  roles: [
    {
      name: 'radiogroup',
      element: { en: 'Container element', ja: 'コンテナ要素' },
      description: {
        en: 'Groups radio buttons together. Must have an accessible name via aria-label or aria-labelledby.',
        ja: 'ラジオボタンをグループ化します。aria-labelまたはaria-labelledbyでアクセシブルな名前を持つ必要があります。',
      },
    },
    {
      name: 'radio',
      element: { en: 'Each option element', ja: '各オプション要素' },
      description: {
        en: 'Identifies the element as a radio button. Only one radio in a group can be checked at a time.',
        ja: '要素をラジオボタンとして識別します。グループ内で一度にチェックできるのは1つのラジオのみです。',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-checked',
      element: { en: 'Each radio', ja: '各ラジオ' },
      values: 'true | false',
      required: true,
      changeTrigger: { en: 'Click, Space, Arrow keys', ja: 'Click、Space、矢印キー' },
    },
    {
      attribute: 'aria-disabled',
      element: { en: 'Disabled radio', ja: '無効化されたラジオ' },
      values: 'true',
      required: false,
    },
  ],

  properties: [
    {
      attribute: 'aria-orientation',
      element: 'radiogroup',
      values: 'horizontal | vertical',
      required: false,
      notes: {
        en: 'Indicates the orientation of the radio group. Vertical is the default. Only set when horizontal.',
        ja: 'ラジオグループの方向を示します。デフォルトは縦方向です。横方向の場合のみ設定します。',
      },
    },
    {
      attribute: 'aria-label',
      element: 'radiogroup',
      values: 'String',
      required: { en: 'Yes (or aria-labelledby)', ja: 'はい（またはaria-labelledby）' },
      notes: {
        en: 'Accessible name for the radio group',
        ja: 'ラジオグループのアクセシブルな名前',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'radiogroup',
      values: { en: 'ID reference', ja: 'ID参照' },
      required: { en: 'Yes (or aria-label)', ja: 'はい（またはaria-label）' },
      notes: {
        en: 'Alternative to aria-label',
        ja: 'aria-labelの代替',
      },
    },
  ],

  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Move focus into the group (to selected or first radio)',
        ja: 'グループにフォーカスを移動（選択された、または最初のラジオへ）',
      },
    },
    {
      key: 'Shift + Tab',
      action: { en: 'Move focus out of the group', ja: 'グループからフォーカスを移動' },
    },
    {
      key: 'Space',
      action: {
        en: 'Select the focused radio (does not unselect)',
        ja: 'フォーカスされたラジオを選択（選択解除はしない）',
      },
    },
    {
      key: 'ArrowDown / ArrowRight',
      action: {
        en: 'Move to next radio and select (wraps to first)',
        ja: '次のラジオに移動して選択（最初に戻る）',
      },
    },
    {
      key: 'ArrowUp / ArrowLeft',
      action: {
        en: 'Move to previous radio and select (wraps to last)',
        ja: '前のラジオに移動して選択（最後に戻る）',
      },
    },
    {
      key: 'Home',
      action: { en: 'Move to first radio and select', ja: '最初のラジオに移動して選択' },
    },
    {
      key: 'End',
      action: { en: 'Move to last radio and select', ja: '最後のラジオに移動して選択' },
    },
  ],

  focusManagement: [
    {
      event: { en: 'Roving tabindex', ja: 'Roving tabindex' },
      behavior: {
        en: 'Only one radio in the group is tabbable at any time',
        ja: 'グループ内で一度に1つのラジオのみがTab可能',
      },
    },
    {
      event: { en: 'Selected radio', ja: '選択されたラジオ' },
      behavior: {
        en: 'Has <code>tabindex="0"</code>',
        ja: '<code>tabindex="0"</code>を持つ',
      },
    },
    {
      event: { en: 'If none selected', ja: '選択がない場合' },
      behavior: {
        en: 'First enabled radio has <code>tabindex="0"</code>',
        ja: '最初の有効なラジオが<code>tabindex="0"</code>を持つ',
      },
    },
    {
      event: { en: 'All other radios', ja: '他のすべてのラジオ' },
      behavior: {
        en: 'Have <code>tabindex="-1"</code>',
        ja: '<code>tabindex="-1"</code>を持つ',
      },
    },
    {
      event: { en: 'Disabled radios', ja: '無効化されたラジオ' },
      behavior: {
        en: 'Always have <code>tabindex="-1"</code>',
        ja: '常に<code>tabindex="-1"</code>を持つ',
      },
    },
  ],

  additionalNotes: [
    {
      en: 'Unlike Checkbox, arrow keys both move focus AND change selection.',
      ja: 'Checkboxとは異なり、矢印キーはフォーカスの移動と選択の変更の両方を行います。',
    },
    {
      en: 'Disabled radios are skipped during navigation.',
      ja: '無効化されたラジオはナビゲーション中にスキップされます。',
    },
    {
      en: 'This implementation uses custom role="radiogroup" and role="radio" for consistent cross-browser keyboard behavior. Native <input type="radio"> provides these roles implicitly.',
      ja: 'この実装は、一貫したクロスブラウザキーボード動作のためにカスタムrole="radiogroup"とrole="radio"を使用します。ネイティブ<input type="radio">はこれらのロールを暗黙的に提供します。',
    },
  ],

  accessibleNaming: {
    title: { en: 'Accessible Naming', ja: 'アクセシブルな名前付け' },
    description: {
      en: 'Both the radio group and individual radios must have accessible names:',
      ja: 'ラジオグループと個々のラジオの両方にアクセシブルな名前が必要です：',
    },
    methods: [
      {
        method: { en: 'Radio group', ja: 'ラジオグループ' },
        description: {
          en: 'Use <code>aria-label</code> or <code>aria-labelledby</code> on the container',
          ja: 'コンテナに<code>aria-label</code>または<code>aria-labelledby</code>を使用',
        },
      },
      {
        method: { en: 'Individual radios', ja: '個々のラジオ' },
        description: {
          en: 'Each radio is labeled by its visible text content via <code>aria-labelledby</code>',
          ja: '各ラジオは<code>aria-labelledby</code>を介して表示テキストでラベル付け',
        },
      },
      {
        method: { en: 'Native alternative', ja: 'ネイティブの代替' },
        description: {
          en: 'Use <code>&lt;fieldset&gt;</code> with <code>&lt;legend&gt;</code> for group labeling',
          ja: 'グループラベル付けに<code>&lt;fieldset&gt;</code>と<code>&lt;legend&gt;</code>を使用',
        },
      },
    ],
  },

  visualDesign: {
    title: { en: 'Visual Design', ja: 'ビジュアルデザイン' },
    description: {
      en: 'This implementation follows WCAG 1.4.1 (Use of Color) by not relying solely on color to indicate state:',
      ja: 'この実装は、状態を示すために色だけに依存しないことでWCAG 1.4.1（色の使用）に準拠しています：',
    },
    stateIndicators: [
      {
        state: { en: 'Selected', ja: '選択済み' },
        indicator: { en: 'Filled circle', ja: '塗りつぶされた円' },
      },
      {
        state: { en: 'Unselected', ja: '未選択' },
        indicator: { en: 'Empty circle', ja: '空の円' },
      },
      {
        state: { en: 'Disabled', ja: '無効化' },
        indicator: { en: 'Reduced opacity', ja: '透明度低下' },
      },
      {
        state: { en: 'Forced colors mode', ja: '強制カラーモード' },
        indicator: {
          en: 'Uses system colors for accessibility in Windows High Contrast Mode',
          ja: 'Windowsハイコントラストモードでのアクセシビリティのためにシステムカラーを使用',
        },
      },
    ],
  },

  references: [
    {
      title: 'WAI-ARIA APG: Radio Group Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/radio/',
    },
    {
      title: 'MDN: <input type="radio">',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio',
    },
    { title: 'W3C ARIA: radiogroup role', url: 'https://w3c.github.io/aria/#radiogroup' },
    { title: 'W3C ARIA: radio role', url: 'https://w3c.github.io/aria/#radio' },
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
            en: 'ARIA attributes (aria-checked, aria-disabled, aria-orientation)',
            ja: 'ARIA属性（aria-checked、aria-disabled、aria-orientation）',
          },
          {
            en: 'Keyboard interaction (Arrow keys, Home, End, Space)',
            ja: 'キーボード操作（矢印キー、Home、End、Space）',
          },
          { en: 'Roving tabindex behavior', ja: 'Roving tabindex動作' },
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
          { en: 'Click interactions', ja: 'クリック操作' },
          { en: 'Arrow key navigation with looping', ja: 'ループ付き矢印キーナビゲーション' },
          { en: 'Space key selection', ja: 'スペースキー選択' },
          { en: 'ARIA structure validation in live browser', ja: 'ライブブラウザでのARIA構造検証' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'クロスフレームワーク一貫性チェック' },
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
            name: 'role="radiogroup"',
            description: {
              en: 'Container has radiogroup role',
              ja: 'コンテナがradiogroupロールを持つ',
            },
          },
          {
            name: 'role="radio"',
            description: {
              en: 'Each option has radio role',
              ja: '各オプションがradioロールを持つ',
            },
          },
          {
            name: 'aria-checked',
            description: {
              en: 'Selected radio has aria-checked="true"',
              ja: '選択されたラジオがaria-checked="true"を持つ',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Disabled radios have aria-disabled="true"',
              ja: '無効化ラジオがaria-disabled="true"を持つ',
            },
          },
          {
            name: 'aria-orientation',
            description: {
              en: 'Only set when horizontal (vertical is default)',
              ja: '横方向の場合のみ設定（縦方向がデフォルト）',
            },
          },
          {
            name: 'accessible name',
            description: {
              en: 'Group and radios have accessible names',
              ja: 'グループとラジオがアクセシブルな名前を持つ',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG Keyboard Interaction', ja: 'APGキーボード操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Tab focus',
            description: {
              en: 'Tab focuses selected radio (or first if none)',
              ja: 'Tabで選択されたラジオにフォーカス（なければ最初）',
            },
          },
          {
            name: 'Tab exit',
            description: {
              en: 'Tab/Shift+Tab exits the group',
              ja: 'Tab/Shift+Tabでグループを離れる',
            },
          },
          {
            name: 'Space select',
            description: {
              en: 'Space selects focused radio',
              ja: 'Spaceでフォーカスされたラジオを選択',
            },
          },
          {
            name: 'Space no unselect',
            description: {
              en: 'Space does not unselect already selected radio',
              ja: 'Spaceで選択済みラジオの選択解除をしない',
            },
          },
          {
            name: 'ArrowDown/Right',
            description: { en: 'Moves to next and selects', ja: '次へ移動して選択' },
          },
          {
            name: 'ArrowUp/Left',
            description: { en: 'Moves to previous and selects', ja: '前へ移動して選択' },
          },
          {
            name: 'Home',
            description: { en: 'Moves to first and selects', ja: '最初へ移動して選択' },
          },
          {
            name: 'End',
            description: { en: 'Moves to last and selects', ja: '最後へ移動して選択' },
          },
          {
            name: 'Arrow wrap',
            description: {
              en: 'Wraps from last to first and vice versa',
              ja: '最後から最初へ、またその逆にラップ',
            },
          },
          {
            name: 'Disabled skip',
            description: {
              en: 'Disabled radios skipped during navigation',
              ja: 'ナビゲーション中に無効化ラジオをスキップ',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Click Interaction', ja: 'クリック操作' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Click selects',
            description: { en: 'Clicking radio selects it', ja: 'クリックでラジオを選択' },
          },
          {
            name: 'Click changes',
            description: {
              en: 'Clicking different radio changes selection',
              ja: '別のラジオをクリックで選択変更',
            },
          },
          {
            name: 'Disabled no click',
            description: {
              en: 'Clicking disabled radio does not select it',
              ja: '無効化ラジオをクリックしても選択されない',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Focus Management - Roving Tabindex', ja: 'フォーカス管理 - Roving Tabindex' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'tabindex="0"',
            description: {
              en: 'Selected radio has tabindex="0"',
              ja: '選択されたラジオがtabindex="0"を持つ',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Non-selected radios have tabindex="-1"',
              ja: '非選択ラジオがtabindex="-1"を持つ',
            },
          },
          {
            name: 'Disabled tabindex',
            description: {
              en: 'Disabled radios have tabindex="-1"',
              ja: '無効化ラジオがtabindex="-1"を持つ',
            },
          },
          {
            name: 'First tabbable',
            description: {
              en: 'First enabled radio tabbable when none selected',
              ja: '選択がない時、最初の有効なラジオがTab可能',
            },
          },
          {
            name: 'Single tabbable',
            description: {
              en: 'Only one tabindex="0" in group at any time',
              ja: '常にグループ内で1つのみtabindex="0"',
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
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations (via jest-axe/axe-core)',
              ja: 'WCAG 2.1 AA違反なし（jest-axe/axe-core経由）',
            },
          },
          {
            name: 'selected axe',
            description: { en: 'No violations with selected value', ja: '選択値ありで違反なし' },
          },
          {
            name: 'disabled axe',
            description: {
              en: 'No violations with disabled option',
              ja: '無効化オプションありで違反なし',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Cross-framework Consistency', ja: 'クロスフレームワーク一貫性' },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks render',
            description: {
              en: 'React, Vue, Svelte, Astro all render radio groups',
              ja: 'React、Vue、Svelte、Astroがすべてラジオグループをレンダリング',
            },
          },
          {
            name: 'Consistent click',
            description: {
              en: 'All frameworks support click to select',
              ja: 'すべてのフレームワークがクリック選択をサポート',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: 'すべてのフレームワークが一貫したARIA構造を持つ',
            },
          },
          {
            name: 'Consistent keyboard',
            description: {
              en: 'All frameworks support keyboard navigation',
              ja: 'すべてのフレームワークがキーボードナビゲーションをサポート',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/radio-group.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Radio Group', ja: 'Radio Groupのユニットテストを実行' },
        command: 'npm run test -- radio-group',
      },
      {
        comment: {
          en: 'Run E2E tests for Radio Group (all frameworks)',
          ja: 'Radio GroupのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=radio-group',
      },
      {
        comment: {
          en: 'Run E2E tests for specific framework',
          ja: '特定のフレームワークでE2Eテストを実行',
        },
        command: 'npm run test:e2e:react:pattern --pattern=radio-group',
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
    { description: 'Container has role="radiogroup"', priority: 'high', category: 'aria' },
    { description: 'Each option has role="radio"', priority: 'high', category: 'aria' },
    { description: 'Selected radio has aria-checked="true"', priority: 'high', category: 'aria' },
    { description: 'Arrow keys move and select', priority: 'high', category: 'keyboard' },
    { description: 'Space selects focused radio', priority: 'high', category: 'keyboard' },
    {
      description: 'Tab enters group to selected/first radio',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Roving tabindex implemented correctly', priority: 'high', category: 'focus' },
    { description: 'Click selects radio', priority: 'high', category: 'click' },
    {
      description: 'Disabled radios skipped during navigation',
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
<div role="radiogroup" aria-label="Pizza size">
  <div role="radio" aria-checked="false" tabindex="-1" aria-labelledby="small-label">
    <span id="small-label">Small</span>
  </div>
  <div role="radio" aria-checked="true" tabindex="0" aria-labelledby="medium-label">
    <span id="medium-label">Medium</span>
  </div>
  <div role="radio" aria-checked="false" tabindex="-1" aria-labelledby="large-label">
    <span id="large-label">Large</span>
  </div>
</div>
\`\`\`

## Key Implementation Points

1. **Roving Tabindex**: Only selected (or first if none) radio has tabindex="0"
2. **Selection follows focus**: Arrow keys both move focus AND select
3. **Wrapping**: Navigation wraps from last to first and vice versa
4. **Disabled handling**: Disabled radios are skipped during arrow navigation
5. **Single selection**: Only one radio can be checked at a time`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has radiogroup role', () => {
  render(<RadioGroup options={options} />);
  expect(screen.getByRole('radiogroup')).toBeInTheDocument();
});

// Keyboard navigation with selection
it('ArrowDown moves and selects next radio', async () => {
  const user = userEvent.setup();
  render(<RadioGroup options={options} />);

  const radios = screen.getAllByRole('radio');
  radios[0].focus();
  await user.keyboard('{ArrowDown}');

  expect(radios[1]).toHaveFocus();
  expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  expect(radios[0]).toHaveAttribute('aria-checked', 'false');
});

// Wrapping
it('wraps from last to first', async () => {
  const user = userEvent.setup();
  render(<RadioGroup options={options} value={options[2].value} />);

  const radios = screen.getAllByRole('radio');
  radios[2].focus();
  await user.keyboard('{ArrowDown}');

  expect(radios[0]).toHaveFocus();
  expect(radios[0]).toHaveAttribute('aria-checked', 'true');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');
  const radiogroup = page.getByRole('radiogroup');
  const radios = page.getByRole('radio');

  await expect(radiogroup).toHaveAttribute('aria-label');
  await expect(radios).toHaveCount(3);
});

// Click interaction
test('clicking radio selects it', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');
  const radios = page.getByRole('radio');

  await radios.nth(1).click();

  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="radiogroup"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
