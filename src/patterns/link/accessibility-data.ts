import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const linkAccessibilityData: PatternAccessibilityData = {
  pattern: 'link',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/link/',

  overview: {
    en: 'A link is an interactive element that navigates to a resource when activated. Provides keyboard-accessible navigation with proper screen reader announcement.',
    ja: 'リンクは、アクティブ化されるとリソースに遷移するインタラクティブな要素です。キーボードでアクセス可能なナビゲーションと適切なスクリーンリーダーの読み上げを提供します。',
  },

  // --- Native HTML Considerations ---

  nativeHtmlConsiderations: [
    {
      useCase: 'Standard navigation',
      recommended: 'Native `<a href>`',
    },
    {
      useCase: 'JavaScript-driven navigation',
      recommended: 'Native `<a href>` with `event.preventDefault()`',
    },
    {
      useCase: 'Non-link element that navigates',
      recommended: 'Custom `role="link"` (educational purposes only)',
    },
  ],

  nativeVsCustom: [
    {
      feature: 'Ctrl/Cmd + Click (new tab)',
      native: 'Built-in',
      custom: 'Not supported',
    },
    {
      feature: 'Right-click context menu',
      native: 'Full menu',
      custom: 'Limited',
    },
    {
      feature: 'Copy link address',
      native: 'Built-in',
      custom: 'Not supported',
    },
    {
      feature: 'Drag to bookmarks',
      native: 'Built-in',
      custom: 'Not supported',
    },
    {
      feature: 'SEO recognition',
      native: 'Crawled',
      custom: 'May be ignored',
    },
    {
      feature: 'Works without JavaScript',
      native: 'Yes',
      custom: 'No',
    },
    {
      feature: 'Screen reader announcement',
      native: 'Automatic',
      custom: 'Requires ARIA',
    },
    {
      feature: 'Focus management',
      native: 'Automatic',
      custom: 'Requires tabindex',
    },
  ],

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'link',
      element: {
        en: '<a href> or element with role="link"',
        ja: '<a href> または role="link" を持つ要素',
      },
      description: {
        en: 'Identifies the element as a hyperlink. Native <a href> has this role implicitly.',
        ja: '要素をハイパーリンクとして識別します。ネイティブの <a href> は暗黙的にこのロールを持ちます。',
      },
    },
  ],

  properties: [
    {
      attribute: 'tabindex',
      element: 'Custom element',
      values: '0 (focusable) | -1 (not focusable)',
      required: true,
      notes: {
        en: 'Required for custom implementations. Native <a href> is focusable by default. Set to -1 when disabled.',
        ja: 'カスタム実装では必須。ネイティブの <a href> はデフォルトでフォーカス可能。無効時は -1 に設定。',
      },
    },
    {
      attribute: 'aria-label',
      element: 'Link element',
      values: 'string',
      required: false,
      notes: {
        en: 'Provides an invisible label for the link when no visible text',
        ja: '表示テキストがない場合にリンクの非表示ラベルを提供',
      },
    },
    {
      attribute: 'aria-labelledby',
      element: 'Link element',
      values: 'ID reference',
      required: false,
      notes: {
        en: 'References an external element as the label',
        ja: '外部要素をラベルとして参照',
      },
    },
    {
      attribute: 'aria-current',
      element: 'Link element',
      values: 'page | step | location | date | time | true',
      required: false,
      notes: {
        en: 'Indicates the current item within a set (e.g., current page in navigation)',
        ja: 'セット内の現在の項目を示す（例：ナビゲーション内の現在のページ）',
      },
    },
  ],

  states: [
    {
      attribute: 'aria-disabled',
      element: { en: 'Link element', ja: 'リンク要素' },
      values: 'true | false',
      required: false,
      changeTrigger: {
        en: 'Disabled state change',
        ja: '無効状態の変更',
      },
      reference: 'https://w3c.github.io/aria/#aria-disabled',
    },
  ],

  // --- Keyboard Support ---

  keyboardSupport: [
    {
      key: 'Enter',
      action: {
        en: 'Activate the link and navigate to the target resource',
        ja: 'リンクをアクティブ化し、ターゲットリソースに遷移',
      },
    },
    {
      key: 'Tab',
      action: {
        en: 'Move focus to the next focusable element',
        ja: '次のフォーカス可能な要素にフォーカスを移動',
      },
    },
    {
      key: 'Shift + Tab',
      action: {
        en: 'Move focus to the previous focusable element',
        ja: '前のフォーカス可能な要素にフォーカスを移動',
      },
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    {
      event: {
        en: 'Native <a href>',
        ja: 'ネイティブ <a href>',
      },
      behavior: {
        en: 'Focusable by default',
        ja: 'デフォルトでフォーカス可能',
      },
    },
    {
      event: {
        en: 'Custom links',
        ja: 'カスタムリンク',
      },
      behavior: {
        en: 'Require tabindex="0"',
        ja: 'tabindex="0" が必要',
      },
    },
    {
      event: {
        en: 'Disabled links',
        ja: '無効なリンク',
      },
      behavior: {
        en: 'Use tabindex="-1" (removed from tab order)',
        ja: 'tabindex="-1" を使用（Tabオーダーから除外）',
      },
    },
  ],

  // --- Additional Notes ---

  additionalNotes: [
    {
      en: 'This implementation uses <span role="link"> for educational purposes. For production use, prefer native <a href> elements.',
      ja: 'この実装は教育目的で <span role="link"> を使用しています。本番環境では、ネイティブの <a href> 要素を優先してください。',
    },
    {
      en: 'Unlike buttons, the Space key does NOT activate links. This is a key distinction between the link and button roles.',
      ja: 'ボタンとは異なり、Spaceキーはリンクをアクティブ化しません。これは link ロールと button ロールの重要な違いです。',
    },
    {
      en: 'Links must have an accessible name from text content, aria-label, or aria-labelledby.',
      ja: 'リンクにはテキストコンテンツ、aria-label、またはaria-labelledbyからアクセシブルな名前が必要です。',
    },
  ],

  // --- References ---

  references: [
    {
      title: 'WAI-ARIA APG: Link Pattern',
      url: 'https://www.w3.org/WAI/ARIA/apg/patterns/link/',
    },
    {
      title: 'MDN: <a> element',
      url: 'https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a',
    },
    {
      title: 'W3C ARIA: link role',
      url: 'https://w3c.github.io/aria/#link',
    },
  ],

  // --- Testing Documentation ---

  testing: {
    strategies: [
      {
        type: 'unit',
        title: { en: 'Unit Tests (Testing Library)', ja: 'ユニットテスト (Testing Library)' },
        description: {
          en: "Verify the component's rendered output using framework-specific testing libraries. These tests ensure correct HTML structure and ARIA attributes.",
          ja: 'フレームワーク固有のテストライブラリを使用してコンポーネントのレンダリング出力を検証します。これらのテストは正しいHTML構造とARIA属性を確認します。',
        },
        areas: [
          {
            en: 'ARIA attributes (role="link", tabindex)',
            ja: 'ARIA属性（role="link"、tabindex）',
          },
          {
            en: 'Keyboard interaction (Enter key activation)',
            ja: 'キーボード操作（Enterキーでのアクティブ化）',
          },
          { en: 'Disabled state handling', ja: '無効状態の処理' },
          { en: 'Accessibility via jest-axe', ja: 'jest-axeによるアクセシビリティ検証' },
        ],
      },
      {
        type: 'e2e',
        title: { en: 'E2E Tests (Playwright)', ja: 'E2Eテスト (Playwright)' },
        description: {
          en: 'Verify component behavior in a real browser environment across all frameworks. These tests cover interactions and cross-framework consistency.',
          ja: 'すべてのフレームワークで実際のブラウザ環境でコンポーネントの動作を検証します。これらのテストはインタラクションとフレームワーク間の一貫性をカバーします。',
        },
        areas: [
          { en: 'ARIA structure in live browser', ja: 'ライブブラウザでのARIA構造' },
          { en: 'Keyboard activation (Enter key)', ja: 'キーボードでのアクティブ化（Enterキー）' },
          { en: 'Click interaction behavior', ja: 'クリック操作の動作' },
          { en: 'Disabled state interactions', ja: '無効状態のインタラクション' },
          { en: 'axe-core accessibility scanning', ja: 'axe-coreによるアクセシビリティスキャン' },
          { en: 'Cross-framework consistency checks', ja: 'フレームワーク間の一貫性チェック' },
        ],
      },
    ],
    categories: [
      {
        priority: 'high',
        title: {
          en: 'APG Keyboard Interaction (Unit + E2E)',
          ja: 'APGキーボード操作 (Unit + E2E)',
        },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Enter key',
            description: {
              en: 'Activates the link and navigates to target',
              ja: 'リンクをアクティブ化し、ターゲットに遷移',
            },
          },
          {
            name: 'Space key',
            description: {
              en: 'Does NOT activate the link (links only respond to Enter)',
              ja: 'リンクをアクティブ化しない（リンクはEnterキーのみに応答）',
            },
          },
          {
            name: 'IME composing',
            description: {
              en: 'Ignores Enter key during IME input',
              ja: 'IME入力中はEnterキーを無視',
            },
          },
          {
            name: 'Tab navigation',
            description: {
              en: 'Tab moves focus between links',
              ja: 'Tabキーでリンク間のフォーカスを移動',
            },
          },
          {
            name: 'Disabled Tab skip',
            description: {
              en: 'Disabled links are skipped in Tab order',
              ja: '無効なリンクはTabオーダーでスキップされる',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'ARIA Attributes (Unit + E2E)', ja: 'ARIA属性 (Unit + E2E)' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'role="link"',
            description: {
              en: 'Element has link role',
              ja: '要素がlinkロールを持つ',
            },
          },
          {
            name: 'tabindex="0"',
            description: {
              en: 'Element is focusable via keyboard',
              ja: '要素がキーボードでフォーカス可能',
            },
          },
          {
            name: 'aria-disabled',
            description: {
              en: 'Set to "true" when disabled',
              ja: '無効時に "true" に設定',
            },
          },
          {
            name: 'tabindex="-1"',
            description: {
              en: 'Set when disabled to remove from Tab order',
              ja: '無効時にTabオーダーから除外するために設定',
            },
          },
          {
            name: 'Accessible name',
            description: {
              en: 'Name from text content, aria-label, or aria-labelledby',
              ja: 'テキストコンテンツ、aria-label、またはaria-labelledbyから名前を取得',
            },
          },
        ],
      },
      {
        priority: 'high',
        title: { en: 'Click Behavior (Unit + E2E)', ja: 'クリック動作 (Unit + E2E)' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'Click activation',
            description: {
              en: 'Click activates the link',
              ja: 'クリックでリンクがアクティブ化される',
            },
          },
          {
            name: 'Disabled click',
            description: {
              en: 'Disabled links ignore click events',
              ja: '無効なリンクはクリックイベントを無視',
            },
          },
          {
            name: 'Disabled Enter',
            description: {
              en: 'Disabled links ignore Enter key',
              ja: '無効なリンクはEnterキーを無視',
            },
          },
        ],
      },
      {
        priority: 'medium',
        title: { en: 'Accessibility (Unit + E2E)', ja: 'アクセシビリティ (Unit + E2E)' },
        testType: 'Unit + E2E',
        items: [
          {
            name: 'axe violations',
            description: {
              en: 'No WCAG 2.1 AA violations (via jest-axe)',
              ja: 'WCAG 2.1 AAの違反がない（jest-axeによる）',
            },
          },
          {
            name: 'disabled axe',
            description: {
              en: 'No violations in disabled state',
              ja: '無効状態での違反がない',
            },
          },
          {
            name: 'aria-label axe',
            description: {
              en: 'No violations with aria-label',
              ja: 'aria-label使用時の違反がない',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Navigation & Props (Unit)', ja: 'ナビゲーション & プロパティ (Unit)' },
        testType: 'Unit',
        items: [
          {
            name: 'href navigation',
            description: {
              en: 'Navigates to href on activation',
              ja: 'アクティブ化時にhrefに遷移',
            },
          },
          {
            name: 'target="_blank"',
            description: {
              en: 'Opens in new tab with security options',
              ja: 'セキュリティオプションを含めて新しいタブで開く',
            },
          },
          {
            name: 'className',
            description: {
              en: 'Custom classes are applied',
              ja: 'カスタムクラスが適用される',
            },
          },
          {
            name: 'data-* attributes',
            description: {
              en: 'Custom data attributes are passed through',
              ja: 'カスタムdata属性が渡される',
            },
          },
        ],
      },
      {
        priority: 'low',
        title: { en: 'Cross-framework Consistency (E2E)', ja: 'フレームワーク間の一貫性 (E2E)' },
        testType: 'E2E',
        items: [
          {
            name: 'All frameworks have links',
            description: {
              en: 'React, Vue, Svelte, Astro all render custom link elements',
              ja: 'React、Vue、Svelte、Astroすべてがカスタムリンク要素をレンダリング',
            },
          },
          {
            name: 'Same link count',
            description: {
              en: 'All frameworks render the same number of links',
              ja: 'すべてのフレームワークで同じ数のリンクをレンダリング',
            },
          },
          {
            name: 'Consistent ARIA',
            description: {
              en: 'All frameworks have consistent ARIA structure',
              ja: 'すべてのフレームワークで一貫したARIA構造',
            },
          },
        ],
      },
    ],
    e2eTestFile: 'e2e/link.spec.ts',
    commands: [
      {
        comment: {
          en: 'Run unit tests for Link',
          ja: 'Linkのユニットテストを実行',
        },
        command: 'npm run test -- link',
      },
      {
        comment: {
          en: 'Run E2E tests for Link (all frameworks)',
          ja: 'LinkのE2Eテストを実行（全フレームワーク）',
        },
        command: 'npm run test:e2e:pattern --pattern=link',
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

  // --- llm.md Specific Data ---

  testChecklist: [
    // ARIA - High Priority
    {
      description: 'role="link" exists (implicit via native or explicit)',
      priority: 'high',
      category: 'aria',
    },
    { description: 'tabindex="0" on custom link element', priority: 'high', category: 'aria' },
    { description: 'Accessible name from text content', priority: 'high', category: 'aria' },
    {
      description: 'Accessible name from aria-label when no text',
      priority: 'high',
      category: 'aria',
    },
    { description: 'aria-disabled="true" when disabled', priority: 'high', category: 'aria' },
    { description: 'tabindex="-1" when disabled', priority: 'high', category: 'aria' },

    // Keyboard - High Priority
    { description: 'Enter key activates link', priority: 'high', category: 'keyboard' },
    { description: 'Space key does NOT activate link', priority: 'high', category: 'keyboard' },
    {
      description: 'Ignores keydown when event.isComposing === true (IME)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'Ignores keydown when event.defaultPrevented === true',
      priority: 'high',
      category: 'keyboard',
    },

    // Click - High Priority
    { description: 'Click activates link', priority: 'high', category: 'click' },
    { description: 'Disabled link ignores click', priority: 'high', category: 'click' },
    { description: 'Disabled link ignores Enter key', priority: 'high', category: 'click' },

    // Focus - High Priority
    { description: 'Focusable via Tab key', priority: 'high', category: 'focus' },
    { description: 'Not focusable when disabled', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (all states)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `### Common Pitfalls

1. **Space key**: Links are activated by Enter only, NOT Space. Space scrolls the page.

2. **IME input**: Check \`event.isComposing\` to avoid triggering during IME composition.

3. **Security for \`target="_blank"\`**: Always use \`noopener,noreferrer\` with \`window.open()\`.

4. **Disabled state**: Use both \`aria-disabled="true"\` AND \`tabindex="-1"\`. Prevent click/keydown handlers.

### Structure (Custom Implementation)

\`\`\`
<span
  role="link"
  tabindex="0" (or "-1" when disabled)
  aria-disabled="false" (or "true")
>
  Link Text
</span>
\`\`\`

### Navigation Logic

\`\`\`typescript
const navigate = (href: string, target?: string) => {
  if (target === '_blank') {
    window.open(href, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = href;
  }
};
\`\`\`

### CSS Requirements

\`\`\`css
[role="link"] {
  cursor: pointer;
  text-decoration: underline;
  color: var(--link-color, blue);
}

[role="link"]:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

[role="link"][aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
  text-decoration: none;
}
\`\`\``,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Role test
it('has role="link"', () => {
  render(<Link href="#">Click here</Link>);
  expect(screen.getByRole('link')).toBeInTheDocument();
});

// Accessible name test
it('has accessible name from text content', () => {
  render(<Link href="#">Learn more</Link>);
  expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
});

// Enter key test
it('activates on Enter key', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick}>Click me</Link>);

  const link = screen.getByRole('link');
  link.focus();
  await user.keyboard('{Enter}');

  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Space key should NOT activate
it('does not activate on Space key', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick}>Click me</Link>);

  const link = screen.getByRole('link');
  link.focus();
  await user.keyboard(' ');

  expect(handleClick).not.toHaveBeenCalled();
});

// Disabled test
it('is not focusable when disabled', () => {
  render(<Link href="#" disabled>Disabled link</Link>);

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('tabindex', '-1');
  expect(link).toHaveAttribute('aria-disabled', 'true');
});

// Click test
it('calls onClick on click', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick}>Click me</Link>);

  await user.click(screen.getByRole('link'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Disabled ignores interaction
it('does not call onClick when disabled', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick} disabled>Disabled</Link>);

  await user.click(screen.getByRole('link'));
  expect(handleClick).not.toHaveBeenCalled();
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has role="link" and tabindex="0"', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const links = page.locator('[role="link"]');
  expect(await links.count()).toBeGreaterThan(0);

  // Enabled links should have tabindex="0"
  const enabledLink = page.locator('[role="link"]:not([aria-disabled="true"])').first();
  await expect(enabledLink).toHaveAttribute('tabindex', '0');
});

// Keyboard Interaction
test('activates on Enter key, not Space', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const link = page.locator('[role="link"]:not([aria-disabled="true"])').first();

  // Track keydown events
  await page.evaluate(() => {
    const links = document.querySelectorAll('[role="link"]:not([aria-disabled="true"])');
    links.forEach((link) => {
      (link as HTMLElement).dataset.enterPressed = 'false';
      link.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
          e.preventDefault();
          (link as HTMLElement).dataset.enterPressed = 'true';
        }
      }, { capture: true });
    });
  });

  await link.focus();
  await page.keyboard.press('Enter');
  expect(await link.getAttribute('data-enter-pressed')).toBe('true');

  // Space should NOT activate (link should still be visible, no navigation)
  await page.keyboard.press('Space');
  await expect(link).toBeVisible();
});

// Disabled State
test('disabled link has aria-disabled and tabindex="-1"', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const disabledLink = page.locator('[role="link"][aria-disabled="true"]');

  if (await disabledLink.count() > 0) {
    await expect(disabledLink.first()).toHaveAttribute('aria-disabled', 'true');
    await expect(disabledLink.first()).toHaveAttribute('tabindex', '-1');
  }
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="link"]')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});`,
};
