import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const alertAccessibilityData: PatternAccessibilityData = {
  pattern: 'alert',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',

  overview: {
    en: "An alert displays a brief, important message that attracts the user's attention without interrupting their task. Alerts are announced by screen readers immediately when content changes.",
    ja: 'アラートは、ユーザーのタスクを中断することなく、ユーザーの注意を引く簡潔で重要なメッセージを表示します。コンテンツが変更されると、スクリーンリーダーによって即座にアナウンスされます。',
  },

  // Critical Implementation Note
  criticalImplementationNotes: [
    {
      en: 'The live region container (role="alert") must exist in the DOM from page load. Do NOT dynamically add/remove the container itself. Only the content inside the container should change dynamically.',
      ja: 'ライブリージョンのコンテナ（role="alert"）は、ページ読み込み時から DOM に存在している必要があります。コンテナ自体を動的に追加・削除しないでください。コンテナ内のコンテンツのみを動的に変更するようにしてください。',
    },
  ],

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'alert',
      element: { en: 'Alert container', ja: 'アラートコンテナ' },
      description: {
        en: "An element that displays a brief, important message that attracts the user's attention without interrupting their task",
        ja: 'ユーザーのタスクを中断することなく、ユーザーの注意を引く簡潔で重要なメッセージを表示する要素',
      },
    },
  ],

  // Implicit properties (alert role sets these automatically)
  implicitProperties: [
    {
      attribute: 'aria-live',
      implicitValue: 'assertive',
      description: {
        en: 'Interrupts screen reader to announce immediately',
        ja: 'スクリーンリーダーを中断して即座にアナウンス',
      },
    },
    {
      attribute: 'aria-atomic',
      implicitValue: 'true',
      description: {
        en: 'Announces entire alert content, not just changed parts',
        ja: '変更された部分だけでなく、アラート全体のコンテンツをアナウンス',
      },
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Enter',
      action: {
        en: 'Activates the dismiss button (if present)',
        ja: '閉じるボタンをアクティブ化（存在する場合）',
      },
    },
    {
      key: 'Space',
      action: {
        en: 'Activates the dismiss button (if present)',
        ja: '閉じるボタンをアクティブ化（存在する場合）',
      },
    },
  ],

  keyboardDocNote: {
    en: 'Alerts require no keyboard interaction. They are designed to inform users without interrupting their workflow. The alert content is automatically announced by screen readers when it changes.',
    ja: 'アラートはキーボード操作を必要としません。ユーザーのワークフローを中断することなく情報を伝えることを目的としています。アラートのコンテンツは、変更されると自動的にスクリーンリーダーによってアナウンスされます。',
  },

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Alert must NOT move focus', ja: 'アラートはフォーカスを移動してはいけません' },
      behavior: {
        en: 'Alerts are non-modal and should not interrupt user workflow by stealing focus',
        ja: 'アラートは非モーダルであり、フォーカスを奪うことでユーザーのワークフローを中断してはいけません',
      },
    },
    {
      event: { en: 'Alert container is not focusable', ja: 'アラートコンテナはフォーカス不可' },
      behavior: {
        en: 'The alert element should not have tabindex or receive keyboard focus',
        ja: 'アラート要素は tabindex を持たず、キーボードフォーカスを受け取ってはいけません',
      },
    },
    {
      event: { en: 'Dismiss button is focusable', ja: '閉じるボタンはフォーカス可能' },
      behavior: {
        en: 'If present, the dismiss button can be reached via Tab navigation',
        ja: '存在する場合、閉じるボタンは Tab ナビゲーションで到達可能です',
      },
    },
  ],

  // --- Additional Guidelines ---

  additionalNotes: [
    {
      en: 'Screen readers detect changes to live regions by observing DOM mutations inside them. If the live region itself is added dynamically, some screen readers may not announce the content reliably.',
      ja: 'スクリーンリーダーは、ライブリージョン内の DOM の変更を検知してアナウンスします。ライブリージョン自体が動的に追加される場合、一部のスクリーンリーダーではコンテンツが確実にアナウンスされない可能性があります。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG: Alert Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/alert/',
    },
    {
      title: 'WAI-ARIA: alert role',
      url: 'https://w3c.github.io/aria/#alert',
    },
    {
      title: 'WAI-ARIA APG: Alert Dialog Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/',
    },
  ],

  // --- Implementation Notes ---

  implementationNotesData: {
    structure: {
      diagram: `<!-- Container always in DOM -->
<div role="alert">
  <!-- Content added dynamically -->
  <span>Your changes have been saved.</span>
</div>

Announcement Behavior:
- Page load content: NOT announced
- Dynamic changes: ANNOUNCED immediately
- aria-live="assertive": interrupts current speech

Alert vs Status:
┌─────────────┬──────────────────────┐
│ role="alert"│ role="status"        │
├─────────────┼──────────────────────┤
│ assertive   │ polite               │
│ interrupts  │ waits for pause      │
│ urgent info │ non-urgent updates   │
└─────────────┴──────────────────────┘`,
      caption: {
        en: 'Alert component structure and announcement behavior',
        ja: 'アラートコンポーネントの構造とアナウンス動作',
      },
    },
    alertVsAlertDialog: {
      alert: {
        title: { en: 'Use Alert', ja: 'Alert を使用する場合' },
        points: [
          {
            en: "The message is informational and doesn't require user action",
            ja: 'メッセージが情報提供のみでユーザーアクションを必要としない',
          },
          {
            en: 'User workflow should NOT be interrupted',
            ja: 'ユーザーのワークフローを中断すべきでない',
          },
          {
            en: 'Focus should remain on the current task',
            ja: 'フォーカスは現在のタスクに留まるべき',
          },
        ],
      },
      alertDialog: {
        title: {
          en: 'Use Alert Dialog (role="alertdialog")',
          ja: 'Alert Dialog (role="alertdialog") を使用する場合',
        },
        points: [
          {
            en: 'The message requires immediate user response',
            ja: 'メッセージが即座のユーザー応答を必要とする',
          },
          {
            en: 'User must acknowledge or take action before continuing',
            ja: 'ユーザーが続行する前に確認またはアクションをとる必要がある',
          },
          {
            en: 'Focus should move to the dialog (modal behavior)',
            ja: 'フォーカスをダイアログに移動すべき（モーダル動作）',
          },
        ],
      },
    },
  },

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
          { en: 'ARIA attributes (role="alert")', ja: 'ARIA 属性 (role="alert")' },
          {
            en: 'Live region container persistence in DOM',
            ja: 'ライブリージョンコンテナの DOM 内での永続性',
          },
          { en: 'Dismiss button accessibility', ja: '閉じるボタンのアクセシビリティ' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axe によるアクセシビリティ検証' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2E テスト (Playwright)' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストはインタラクションとフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          { en: 'ARIA structure in live browser', ja: 'ライブブラウザでの ARIA 構造' },
          {
            en: 'Focus management (alert does NOT steal focus)',
            ja: 'フォーカス管理（アラートはフォーカスを奪わない）',
          },
          {
            en: 'Dismiss button keyboard interactions',
            ja: '閉じるボタンのキーボード操作',
          },
          { en: 'Tab navigation behavior', ja: 'Tab ナビゲーションの動作' },
          { en: 'axe-core accessibility scanning', ja: 'axe-core アクセシビリティスキャン' },
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
        title: { en: 'APG Core Compliance', ja: 'APG コア準拠' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="alert" exists',
            description: {
              en: 'Alert container must have alert role',
              ja: 'アラートコンテナは alert ロールを持つ必要がある',
            },
          },
          {
            name: 'Container always in DOM',
            description: {
              en: 'Live region must not be dynamically added/removed',
              ja: 'ライブリージョンは動的に追加・削除してはならない',
            },
          },
          {
            name: 'Same container on message change',
            description: {
              en: 'Container element identity preserved during updates',
              ja: '更新時にコンテナ要素の同一性が保持される',
            },
          },
          {
            name: 'Focus unchanged after alert',
            description: {
              en: 'Alert must not move keyboard focus',
              ja: 'アラートはキーボードフォーカスを移動してはならない',
            },
          },
          {
            name: 'Alert not focusable',
            description: {
              en: 'Alert container must not have tabindex',
              ja: 'アラートコンテナは tabindex を持ってはならない',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility Validation', ja: 'アクセシビリティ検証' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'No axe violations (with message)',
            description: { en: 'WCAG 2.1 AA compliance', ja: 'WCAG 2.1 AA 準拠' },
          },
          {
            name: 'No axe violations (empty)',
            description: { en: 'WCAG 2.1 AA compliance', ja: 'WCAG 2.1 AA 準拠' },
          },
          {
            name: 'No axe violations (dismissible)',
            description: { en: 'WCAG 2.1 AA compliance', ja: 'WCAG 2.1 AA 準拠' },
          },
          {
            name: 'Dismiss button accessible name',
            description: {
              en: 'Button has aria-label',
              ja: 'ボタンは aria-label を持つ',
            },
          },
          {
            name: 'Dismiss button type="button"',
            description: {
              en: 'Prevents form submission',
              ja: 'フォーム送信を防ぐ',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Props & Extensibility', ja: 'Props と拡張性' },
        testType: 'Unit',
        items: [
          {
            name: 'variant prop changes styling',
            description: { en: 'Visual customization', ja: 'ビジュアルのカスタマイズ' },
          },
          {
            name: 'id prop sets custom ID',
            description: { en: 'SSR support', ja: 'SSR サポート' },
          },
          {
            name: 'className inheritance',
            description: { en: 'Style customization', ja: 'スタイルのカスタマイズ' },
          },
          {
            name: 'children for complex content',
            description: { en: 'Content flexibility', ja: 'コンテンツの柔軟性' },
          },
          {
            name: 'onDismiss callback fires',
            description: { en: 'Event handling', ja: 'イベント処理' },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Cross-framework Consistency', ja: 'フレームワーク間の一貫性' },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks have alert',
            description: {
              en: 'React, Vue, Svelte, Astro all render alert element',
              ja: 'React、Vue、Svelte、Astro すべてがアラート要素をレンダリング',
            },
          },
          {
            name: 'Same trigger buttons',
            description: {
              en: 'All frameworks have consistent trigger buttons',
              ja: 'すべてのフレームワークで一貫したトリガーボタン',
            },
          },
          {
            name: 'Show alert on click',
            description: {
              en: 'All frameworks show alert when button is clicked',
              ja: 'すべてのフレームワークでボタンクリック時にアラートを表示',
            },
          },
        ],
      },
    ],
    screenReaderTesting: {
      description: {
        en: 'Automated tests verify DOM structure, but manual testing with screen readers is essential for validating actual announcement behavior.',
        ja: '自動テストは DOM 構造を検証しますが、実際のアナウンス動作を検証するにはスクリーンリーダーによる手動テストが不可欠です。',
      },
      platforms: [
        { name: 'VoiceOver', platform: 'macOS / iOS' },
        { name: 'NVDA', platform: 'Windows' },
        { name: 'JAWS', platform: 'Windows' },
        { name: 'TalkBack', platform: 'Android' },
      ],
      verificationNote: {
        en: 'Verify that message changes trigger immediate announcement and that existing content on page load is NOT announced.',
        ja: 'メッセージの変更が即座のアナウンスをトリガーすること、およびページ読み込み時に存在するコンテンツはアナウンスされないことを確認してください。',
      },
    },
    commands: [
      {
        comment: { en: 'Run all Alert tests', ja: 'すべての Alert テストを実行' },
        command: 'npm run test -- alert',
      },
      {
        comment: {
          en: 'Run tests for specific framework',
          ja: '特定のフレームワークのテストを実行',
        },
        command: 'npm run test -- Alert.test.tsx    # React',
      },
      { comment: { en: '', ja: '' }, command: 'npm run test -- Alert.test.vue    # Vue' },
      { comment: { en: '', ja: '' }, command: 'npm run test -- Alert.test.svelte # Svelte' },
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
          ja: 'E2E テスト用ブラウザ自動化',
        },
      },
      {
        name: 'axe-core/playwright',
        url: 'https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright',
        description: {
          en: 'Automated accessibility testing in E2E',
          ja: 'E2E での自動アクセシビリティテスト',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // ARIA - High Priority
    { description: 'Container has role="alert"', priority: 'high', category: 'aria' },
    { description: 'Live region exists in DOM before content', priority: 'high', category: 'aria' },
    { description: 'Content changes are announced', priority: 'high', category: 'aria' },

    // Focus Management - High Priority
    { description: 'Alert does NOT steal focus', priority: 'high', category: 'focus' },
    { description: 'Alert container is NOT focusable', priority: 'high', category: 'focus' },
    {
      description: 'Dismiss button (if present) is focusable',
      priority: 'high',
      category: 'focus',
    },

    // Behavior - High Priority
    {
      description: 'Initial page load content is NOT announced',
      priority: 'high',
      category: 'behavior',
    },
    {
      description: 'Dynamic content changes ARE announced',
      priority: 'high',
      category: 'behavior',
    },
    {
      description: 'No auto-dismissal (or user control provided)',
      priority: 'high',
      category: 'behavior',
    },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Critical Implementation Rule

**The live region container MUST exist in the DOM from page load.**

\`\`\`jsx
// WRONG: Dynamically adding live region
{showAlert && <div role="alert">Message</div>}

// CORRECT: Live region always exists, content changes
<div role="alert">
  {message && <span>{message}</span>}
</div>
\`\`\`

## Structure

\`\`\`
<!-- Container always in DOM -->
<div role="alert">
  <!-- Content added dynamically -->
  <span>Your changes have been saved.</span>
</div>

Announcement Behavior:
- Page load content: NOT announced
- Dynamic changes: ANNOUNCED immediately
- aria-live="assertive": interrupts current speech
\`\`\`

## Alert vs Status

| role="alert" | role="status"        |
|--------------|----------------------|
| assertive    | polite               |
| interrupts   | waits for pause      |
| urgent info  | non-urgent updates   |

## Alert vs Alert Dialog

| Use Alert                         | Use Alert Dialog                   |
|-----------------------------------|------------------------------------|
| Informational, no action required | Requires immediate response        |
| Should NOT interrupt workflow     | Must acknowledge before continuing |
| Focus stays on current task       | Focus moves to dialog              |`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';

// Live region exists
it('has role="alert"', () => {
  render(<Alert message="Saved" />);
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

// Dynamic content announced
it('announces dynamic content', async () => {
  const { rerender } = render(<Alert message="" />);

  // Change content
  rerender(<Alert message="Changes saved" />);

  expect(screen.getByRole('alert')).toHaveTextContent('Changes saved');
});

// Does not steal focus
it('does not move focus', () => {
  const button = document.createElement('button');
  document.body.appendChild(button);
  button.focus();

  render(<Alert message="Saved" />);

  expect(document.activeElement).toBe(button);
  button.remove();
});

// Alert container not focusable
it('is not focusable', () => {
  render(<Alert message="Saved" />);
  const alert = screen.getByRole('alert');
  expect(alert).not.toHaveAttribute('tabindex');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure: Live region exists in DOM
test('has role="alert" on container', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const alert = page.locator('[role="alert"]');
  await expect(alert).toHaveAttribute('role', 'alert');
  await expect(alert).toBeAttached();
});

// Focus Management: Alert does NOT steal focus
test('does NOT steal focus when alert appears', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const infoButton = page.getByRole('button', { name: 'Info' });

  await infoButton.focus();
  await expect(infoButton).toBeFocused();

  await infoButton.click();

  // Focus should still be on the button, not on the alert
  await expect(infoButton).toBeFocused();
});

// Accessibility: No axe-core violations
test('has no axe-core violations (with message)', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const infoButton = page.getByRole('button', { name: 'Info' });

  await infoButton.click();
  await expect(page.locator('[role="alert"]')).toContainText('informational');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="alert"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
