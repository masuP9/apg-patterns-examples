import type { PatternAccessibilityData } from '@/lib/pattern-data/types';

export const tabsAccessibilityData: PatternAccessibilityData = {
  pattern: 'tabs',
  apgUrl: 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/',

  overview:
    'Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time.',

  // --- ARIA Requirements ---

  roles: [
    {
      name: 'tablist',
      element: 'Container',
      description: 'Container for tab elements',
    },
    {
      name: 'tab',
      element: 'Each tab',
      description: 'Individual tab element',
    },
    {
      name: 'tabpanel',
      element: 'Panel',
      description: 'Content area for each tab',
    },
  ],

  properties: [
    {
      attribute: 'aria-orientation',
      element: 'tablist',
      values: '"horizontal" | "vertical"',
      required: false,
      notes: 'orientation prop',
    },
    {
      attribute: 'aria-controls',
      element: 'tab',
      values: 'ID reference to associated panel',
      required: true,
      notes: 'Auto-generated',
    },
    {
      attribute: 'aria-labelledby',
      element: 'tabpanel',
      values: 'ID reference to associated tab',
      required: true,
      notes: 'Auto-generated',
    },
  ],

  states: [
    {
      attribute: 'aria-selected',
      element: 'tab element',
      values: 'true | false',
      required: true,
      changeTrigger: 'Tab click, Arrow keys (automatic), Enter/Space (manual)',
      reference: 'https://w3c.github.io/aria/#aria-selected',
    },
  ],

  // --- Keyboard Support ---

  keyboardSections: [
    {
      title: 'Horizontal Orientation',
      shortcuts: [
        { key: 'Tab', action: 'Move focus into/out of the tablist' },
        { key: 'ArrowRight', action: 'Move to next tab (loops at end)' },
        { key: 'ArrowLeft', action: 'Move to previous tab (loops at start)' },
        { key: 'Home', action: 'Move to first tab' },
        { key: 'End', action: 'Move to last tab' },
        { key: 'Enter / Space', action: 'Activate tab (manual mode only)' },
      ],
    },
    {
      title: 'Vertical Orientation',
      shortcuts: [
        { key: 'ArrowDown', action: 'Move to next tab (loops at end)' },
        { key: 'ArrowUp', action: 'Move to previous tab (loops at start)' },
      ],
    },
  ],

  // --- Focus Management ---

  focusManagement: [
    { event: 'Selected/focused tab', behavior: 'tabIndex="0"' },
    { event: 'Other tabs', behavior: 'tabIndex="-1"' },
    { event: 'Tabpanel', behavior: 'tabIndex="0" (focusable)' },
    { event: 'Disabled tabs', behavior: 'Skipped during keyboard navigation' },
  ],

  // --- Additional Content ---

  additionalNotes: [
    'Automatic mode: Arrow keys move focus AND select tab',
    'Manual mode: Arrow keys move focus only, Enter/Space required to select',
  ],

  references: [
    {
      title: 'WAI-ARIA tablist role',
      url: 'https://w3c.github.io/aria/#tablist',
    },
  ],

  // --- llm.md Specific Data ---

  testChecklist: [
    // Keyboard - High Priority
    {
      description: 'ArrowRight moves to next tab (horizontal)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowLeft moves to previous tab (horizontal)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowDown moves to next tab (vertical)',
      priority: 'high',
      category: 'keyboard',
    },
    {
      description: 'ArrowUp moves to previous tab (vertical)',
      priority: 'high',
      category: 'keyboard',
    },
    { description: 'Arrow keys loop at boundaries', priority: 'high', category: 'keyboard' },
    { description: 'Home moves to first tab', priority: 'high', category: 'keyboard' },
    { description: 'End moves to last tab', priority: 'high', category: 'keyboard' },
    { description: 'Disabled tabs are skipped', priority: 'high', category: 'keyboard' },
    { description: 'Tab key moves focus to tabpanel', priority: 'high', category: 'keyboard' },
    {
      description: 'Manual mode: Enter/Space activates focused tab',
      priority: 'high',
      category: 'keyboard',
    },

    // ARIA - High Priority
    { description: 'Container has role="tablist"', priority: 'high', category: 'aria' },
    { description: 'Each tab has role="tab"', priority: 'high', category: 'aria' },
    { description: 'Panel has role="tabpanel"', priority: 'high', category: 'aria' },
    { description: 'Selected tab has aria-selected="true"', priority: 'high', category: 'aria' },
    {
      description: 'Non-selected tabs have aria-selected="false"',
      priority: 'high',
      category: 'aria',
    },
    { description: 'Tab aria-controls matches panel id', priority: 'high', category: 'aria' },
    { description: 'Panel aria-labelledby matches tab id', priority: 'high', category: 'aria' },
    {
      description: 'aria-orientation reflects orientation prop',
      priority: 'high',
      category: 'aria',
    },

    // Focus Management - High Priority
    {
      description: 'Only selected/focused tab has tabIndex="0"',
      priority: 'high',
      category: 'focus',
    },
    { description: 'Other tabs have tabIndex="-1"', priority: 'high', category: 'focus' },
    { description: 'Tabpanel is focusable (tabIndex="0")', priority: 'high', category: 'focus' },

    // Accessibility - Medium Priority
    {
      description: 'No axe-core violations (WCAG 2.1 AA)',
      priority: 'medium',
      category: 'accessibility',
    },
  ],

  implementationNotes: `## Activation Modes

### Automatic (default)

- Arrow keys move focus AND select tab
- Panel content changes immediately

### Manual

- Arrow keys move focus only
- Enter/Space required to select tab
- Panel content changes on explicit activation

## Structure

\`\`\`
┌─────────────────────────────────────────┐
│ [Tab 1] [Tab 2] [Tab 3]   ← tablist     │
├─────────────────────────────────────────┤
│                                         │
│  Panel content here        ← tabpanel   │
│                                         │
└─────────────────────────────────────────┘

ID Relationships:
- Tab: id="tab-1", aria-controls="panel-1"
- Panel: id="panel-1", aria-labelledby="tab-1"
\`\`\``,

  exampleTestCodeReact: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Keyboard navigation test
it('ArrowRight moves to next tab', async () => {
  const user = userEvent.setup();
  render(<Tabs tabs={tabs} />);

  const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
  tab1.focus();

  await user.keyboard('{ArrowRight}');

  const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
  expect(tab2).toHaveFocus();
  expect(tab2).toHaveAttribute('aria-selected', 'true');
});

// ARIA attributes test
it('selected tab has aria-selected=true', () => {
  render(<Tabs tabs={tabs} />);
  const tabs = screen.getAllByRole('tab');

  expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
});

// Roving tabindex test
it('only selected tab has tabIndex=0', () => {
  render(<Tabs tabs={tabs} />);
  const tabs = screen.getAllByRole('tab');

  expect(tabs[0]).toHaveAttribute('tabIndex', '0');
  expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
});`,

  exampleTestCodeE2E: `import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('tabs have proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  const tabs = page.locator('.apg-tabs').first();

  // Check roles
  await expect(tabs.getByRole('tablist')).toBeAttached();
  await expect(tabs.getByRole('tab').first()).toBeAttached();
  await expect(tabs.getByRole('tabpanel')).toBeAttached();

  // Check aria-selected and aria-controls linkage
  const selectedTab = tabs.getByRole('tab', { selected: true });
  await expect(selectedTab).toHaveAttribute('aria-selected', 'true');
  await expect(selectedTab).toHaveAttribute('aria-controls', /.+/);

  const controlsId = await selectedTab.getAttribute('aria-controls');
  const panel = page.locator(\`#\${controlsId}\`);
  await expect(panel).toHaveRole('tabpanel');
});

// Keyboard navigation test (automatic mode)
test('arrow keys navigate and select tabs', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  const tabs = page.locator('.apg-tabs').first();
  const tabButtons = tabs.getByRole('tab');
  const firstTab = tabButtons.first();
  const secondTab = tabButtons.nth(1);

  await firstTab.click();
  await expect(firstTab).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(secondTab).toBeFocused();
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');

  // Test loop at boundaries
  await page.keyboard.press('End');
  const lastTab = tabButtons.last();
  await expect(lastTab).toBeFocused();

  await page.keyboard.press('ArrowRight');
  await expect(firstTab).toBeFocused();
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tabs/react/demo/');
  await page.locator('.apg-tabs').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('.apg-tabs')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});`,
};
