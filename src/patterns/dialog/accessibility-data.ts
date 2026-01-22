import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const dialogAccessibilityData: PatternAccessibilityData = {
  pattern: 'dialog',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/',

  overview: {
    en: 'A dialog is a window overlaid on the primary content, requiring user interaction. Modal dialogs trap focus and prevent interaction with content outside the dialog.',
    ja: 'ダイアログはプライマリコンテンツ上に表示されるウィンドウで、ユーザーの操作を必要とします。モーダルダイアログはフォーカスをトラップし、ダイアログ外のコンテンツとの操作を防ぎます。',
  },

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'dialog',
      element: { en: 'Dialog container', ja: 'ダイアログコンテナ' },
      description: {
        en: 'Indicates the element is a dialog window',
        ja: 'その要素がダイアログウィンドウであることを示す',
      },
      required: true,
    },
  ],

  properties: [
    {
      attribute: 'aria-modal',
      element: 'dialog',
      values: 'true',
      required: true,
      notes: {
        en: 'Indicates this is a modal dialog',
        ja: 'これがモーダルダイアログであることを示す',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'dialog',
      values: { en: 'ID reference to title element', ja: 'タイトル要素への ID 参照' },
      required: true,
      notes: {
        en: 'References the dialog title',
        ja: 'ダイアログのタイトルを参照する',
      },
    },
    {
      attribute: 'aria-describedby',
      element: 'dialog',
      values: { en: 'ID reference to description', ja: '説明への ID 参照' },
      required: false,
      notes: {
        en: 'References optional description text',
        ja: 'オプションの説明テキストを参照する',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: { en: 'Dialog opens', ja: 'ダイアログが開く' },
      behavior: {
        en: 'Focus moves to first focusable element inside the dialog',
        ja: 'ダイアログ内の最初のフォーカス可能な要素にフォーカスが移動する',
      },
    },
    {
      event: { en: 'Dialog closes', ja: 'ダイアログが閉じる' },
      behavior: {
        en: 'Focus returns to the element that triggered the dialog',
        ja: 'ダイアログを開いた要素にフォーカスが戻る',
      },
    },
    {
      event: { en: 'Focus trap', ja: 'フォーカストラップ' },
      behavior: {
        en: 'Tab/Shift+Tab cycles through focusable elements within the dialog only',
        ja: 'Tab/Shift+Tab はダイアログ内のフォーカス可能な要素間のみをサイクルする',
      },
    },
    {
      event: { en: 'Background', ja: '背景' },
      behavior: {
        en: 'Content outside dialog is made inert (not focusable or interactive)',
        ja: 'ダイアログ外のコンテンツは不活性化される（フォーカス不可・操作不可）',
      },
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Tab',
      action: {
        en: 'Move focus to next focusable element within dialog. When focus is on the last element, moves to first.',
        ja: 'ダイアログ内の次のフォーカス可能な要素にフォーカスを移動する。最後の要素にフォーカスがある場合は最初の要素に移動する。',
      },
    },
    {
      key: 'Shift + Tab',
      action: {
        en: 'Move focus to previous focusable element within dialog. When focus is on the first element, moves to last.',
        ja: 'ダイアログ内の前のフォーカス可能な要素にフォーカスを移動する。最初の要素にフォーカスがある場合は最後の要素に移動する。',
      },
    },
    {
      key: 'Escape',
      action: {
        en: 'Close the dialog and return focus to trigger element',
        ja: 'ダイアログを閉じて、開いた要素にフォーカスを戻す',
      },
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA dialog role',
      url: 'https://w3c.github.io/aria/#dialog',
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'The dialog title is required for accessibility and should clearly describe the purpose of the dialog',
      ja: 'アクセシビリティのためにダイアログのタイトルは必須であり、ダイアログの目的を明確に説明する必要があります',
    },
    {
      en: 'Page scrolling is disabled while the dialog is open',
      ja: 'ダイアログが開いている間はページのスクロールが無効になります',
    },
    {
      en: 'Clicking the overlay (background) closes the dialog by default',
      ja: 'オーバーレイ（背景）をクリックするとデフォルトでダイアログが閉じます',
    },
    {
      en: 'The close button has an accessible label for screen readers',
      ja: '閉じるボタンにはスクリーンリーダー向けのアクセシブルなラベルが付いています',
    },
  ],

  // --- Implementation Notes ---

  implementationNotesData: {
    structure: {
      diagram: `Structure:
+-------------------------------------+
| Dialog Title          [X]           |  <- aria-labelledby target
+-------------------------------------+
|                                     |
| Dialog content...                   |  <- aria-describedby target (optional)
|                                     |
| [Cancel]  [Confirm]                 |  <- focusable elements
+-------------------------------------+

Focus Trap:
- First focusable -> ... -> Last focusable -> First focusable (loop)
- Store trigger element reference before opening
- Restore focus to trigger on close`,
      caption: {
        en: 'Dialog component structure and focus management',
        ja: 'Dialogコンポーネントの構造とフォーカス管理',
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
          {
            en: 'ARIA attributes (aria-labelledby, aria-describedby)',
            ja: 'ARIA属性（aria-labelledby、aria-describedby）',
          },
          { en: 'Escape key closes dialog', ja: 'Escapeキーでダイアログを閉じる' },
          { en: 'Focus management on open/close', ja: '開閉時のフォーカス管理' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ検証' },
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
          { en: 'Modal behavior (showModal, backdrop)', ja: 'モーダル動作（showModal、backdrop）' },
          { en: 'Focus trap verification', ja: 'フォーカストラップの検証' },
          { en: 'Focus restoration on close', ja: '閉じた時のフォーカス復元' },
          { en: 'Overlay click to close', ja: 'オーバーレイクリックで閉じる' },
          { en: 'ARIA structure validation in live browser', ja: 'ライブブラウザでのARIA構造検証' },
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
        title: { en: 'APG Keyboard Interaction', ja: 'APG キーボードインタラクション' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Escape key',
            description: {
              en: 'Closes the dialog',
              ja: 'ダイアログを閉じる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'APG ARIA Attributes', ja: 'APG ARIA 属性' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="dialog"',
            description: {
              en: 'Dialog element has dialog role',
              ja: 'ダイアログ要素にdialogロールが設定されている',
            },
          },
          {
            name: 'aria-modal="true"',
            description: {
              en: 'Indicates modal behavior',
              ja: 'モーダル動作を示す',
            },
          },
          {
            name: 'aria-labelledby',
            description: {
              en: 'References the dialog title',
              ja: 'ダイアログのタイトルを参照',
            },
          },
          {
            name: 'aria-describedby',
            description: {
              en: 'References description (when provided)',
              ja: '説明を参照（提供されている場合）',
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
            name: 'Initial focus',
            description: {
              en: 'Focus moves to first focusable element on open',
              ja: '開いた時に最初のフォーカス可能な要素にフォーカスが移動',
            },
          },
          {
            name: 'Focus restore',
            description: {
              en: 'Focus returns to trigger on close',
              ja: '閉じた時にトリガー要素にフォーカスが戻る',
            },
          },
          {
            name: 'Focus trap',
            description: {
              en: 'Tab cycling stays within dialog (via native dialog)',
              ja: 'Tabサイクルがダイアログ内に留まる（ネイティブdialog経由）',
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
              en: 'No WCAG 2.1 AA violations (via jest-axe)',
              ja: 'WCAG 2.1 AA違反なし（jest-axe経由）',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Props & Behavior', ja: 'Props と動作' },
        testType: 'Unit',
        items: [
          {
            name: 'closeOnOverlayClick',
            description: {
              en: 'Controls overlay click behavior',
              ja: 'オーバーレイクリックの動作を制御',
            },
          },
          {
            name: 'defaultOpen',
            description: {
              en: 'Initial open state',
              ja: '初期の開閉状態',
            },
          },
          {
            name: 'onOpenChange',
            description: {
              en: 'Callback fires on open/close',
              ja: '開閉時にコールバックが発火',
            },
          },
          {
            name: 'className',
            description: {
              en: 'Custom classes are applied',
              ja: 'カスタムクラスが適用される',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/dialog.spec.ts',
    commands: [
      {
        comment: { en: 'Run unit tests for Dialog', ja: 'Dialogのユニットテストを実行' },
        command: 'npm run test -- dialog',
      },
      {
        comment: {
          en: 'Run E2E tests for Dialog (all frameworks)',
          ja: 'DialogのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=dialog',
      },
    ],
    tools: [
      {
        name: 'Vitest',
        url: 'https://vitest.dev/',
        description: { en: 'Test runner', ja: 'テストランナー' },
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
        description: { en: 'E2E testing framework', ja: 'E2Eテストフレームワーク' },
      },
      {
        name: 'jest-axe',
        url: 'https://github.com/nickcolley/jest-axe',
        description: {
          en: 'Automated accessibility testing (Unit)',
          ja: '自動アクセシビリティテスト（Unit）',
        },
      },
      {
        name: 'axe-core',
        url: 'https://www.deque.com/axe/',
        description: {
          en: 'Automated accessibility testing (E2E)',
          ja: '自動アクセシビリティテスト（E2E）',
        },
      },
    ],
    documentationLink:
      'https://github.com/masuP9/apg-patterns-examples/blob/main/.internal/testing-strategy.md',
  },

  // --- llm.md Specific Data ---

  testChecklist: [
    // Keyboard - High Priority
    { description: 'Escape closes the dialog', priority: 'high', category: 'keyboard' },
    { description: 'Tab moves to next focusable element', priority: 'high', category: 'keyboard' },
    {
      description: 'Shift+Tab moves to previous focusable element',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Tab wraps from last to first element', priority: 'high', category: 'keyboard' },
    {
      description: 'Shift+Tab wraps from first to last element',
      priority: 'high',
      category: 'keyboard',
    },

    // ARIA - High Priority
    { description: 'Container has role="dialog"', priority: 'high', category: 'aria' },
    { description: 'Dialog has aria-modal="true"', priority: 'high', category: 'aria' },
    {
      description: 'Dialog has aria-labelledby referencing title',
      priority: 'high',
      category: 'aria',
    },
    {
      description: 'Title element id matches aria-labelledby value',
      priority: 'high',
      category: 'aria',
    },

    // Focus - High Priority
    { description: 'Focus moves into dialog on open', priority: 'high', category: 'focus' },
    { description: 'Focus returns to trigger on close', priority: 'high', category: 'focus' },
    { description: 'Focus is trapped within dialog', priority: 'high', category: 'focus' },
    { description: 'Background content is inert', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Page scrolling is disabled while open',
      priority: 'medium',
      category: 'accessibility',
    },
    {
      description: 'Close button has accessible label',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Structure

\`\`\`
+-------------------------------------+
| Dialog Title          [X]           |  <- aria-labelledby target
+-------------------------------------+
|                                     |
| Dialog content...                   |  <- aria-describedby target (optional)
|                                     |
| [Cancel]  [Confirm]                 |  <- focusable elements
+-------------------------------------+
\`\`\`

## Focus Trap

- First focusable -> ... -> Last focusable -> First focusable (loop)
- Store trigger element reference before opening
- Restore focus to trigger on close

## Native Dialog Element

When using native \`<dialog>\` element with \`showModal()\`:
- Modal behavior is implicit
- \`aria-modal\` may be omitted
- Browser handles focus trapping automatically`,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Focus trap test
it('traps focus within dialog', async () => {
  const user = userEvent.setup();
  render(<Dialog open />);

  const closeButton = screen.getByRole('button', { name: /close/i });
  const confirmButton = screen.getByRole('button', { name: /confirm/i });

  closeButton.focus();
  await user.tab();
  // Focus should cycle within dialog
});

// Escape closes dialog
it('closes on Escape', async () => {
  const onClose = vi.fn();
  const user = userEvent.setup();
  render(<Dialog open onClose={onClose} />);

  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalled();
});

// Focus restoration
it('returns focus to trigger on close', async () => {
  const user = userEvent.setup();
  render(<DialogWithTrigger />);

  const trigger = screen.getByRole('button', { name: /open/i });
  await user.click(trigger);
  await user.keyboard('{Escape}');

  expect(trigger).toHaveFocus();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';

const getDialog = (page: import('@playwright/test').Page) => {
  return page.getByRole('dialog');
};

const openDialog = async (page: import('@playwright/test').Page) => {
  const trigger = page.getByRole('button', { name: /open dialog/i }).first();
  await trigger.click();
  await getDialog(page).waitFor({ state: 'visible' });
  return trigger;
};

// ARIA structure test
test('has role="dialog"', async ({ page }) => {
  await openDialog(page);
  const dialog = getDialog(page);
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveRole('dialog');
});

// Focus trap test
test('traps focus within dialog', async ({ page }) => {
  await openDialog(page);
  const dialog = getDialog(page);
  const focusableElements = dialog.locator(
    'button:not([disabled]), [tabindex="0"], input:not([disabled])'
  );
  const count = await focusableElements.count();
  const tabCount = Math.max(count * 3, 10);

  for (let i = 0; i < tabCount; i++) {
    await page.keyboard.press('Tab');
  }

  // Focus should still be within dialog
  const isWithinDialog = await page.evaluate(() => {
    const focused = document.activeElement;
    return focused?.closest('dialog, [role="dialog"]') !== null;
  });
  expect(isWithinDialog).toBe(true);
});

// Focus restoration test
test('returns focus to trigger on close', async ({ page }) => {
  const trigger = await openDialog(page);
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
});`,
};
