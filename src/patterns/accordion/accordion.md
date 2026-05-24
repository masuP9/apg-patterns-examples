# Accordion Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/

## Overview

An accordion is a vertically stacked set of interactive headings that each reveal an associated section of content.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `heading` | Header wrapper (h2-h6) | Contains the accordion trigger button |
| `button` | Header trigger | Interactive element that toggles panel visibility |
| `region` | Panel (optional) | Content area associated with header (omit for 6+ panels) |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-level` | heading | 2 - 6 | Yes | headingLevel prop |
| `aria-controls` | button | ID reference to associated panel | Yes | Auto-generated |
| `aria-labelledby` | region (panel) | ID reference to header button | Yes (if region used) | Auto-generated |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-expanded` | button element | `true` \| `false` | Yes | Click, Enter, Space |
| `aria-disabled` | button element | `true` \| `false` | No | Only when disabled |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Tab` | Move focus to the next focusable element |
| `Space / Enter` | Toggle the expansion of the focused accordion header |

## Focus Management

- Header buttons: Focusable via their button elements
- Tab order: Headers participate in the page Tab sequence; navigate between headers with Tab / Shift+Tab

## Test Checklist

### High Priority: Keyboard

- [ ] Enter/Space toggles panel expansion

### High Priority: ARIA

- [ ] Button has aria-expanded matching panel state
- [ ] Button has aria-controls referencing panel id
- [ ] Panel (if region) has aria-labelledby referencing button
- [ ] 6 or fewer panels have role="region"
- [ ] 7+ panels omit role="region"
- [ ] Disabled items have aria-disabled="true"

### High Priority: Focus Management

- [ ] Focus stays on header after toggle
- [ ] Headers participate in the page Tab sequence

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Proper heading level hierarchy

## Implementation Notes

## Structure

```
┌─────────────────────────────────────┐
│ [▼] Section 1                       │  ← button (aria-expanded="true")
├─────────────────────────────────────┤
│ Panel 1 content...                  │  ← region (aria-labelledby)
├─────────────────────────────────────┤
│ [▶] Section 2                       │  ← button (aria-expanded="false")
├─────────────────────────────────────┤
│ [▶] Section 3                       │  ← button (aria-expanded="false")
└─────────────────────────────────────┘

ID Relationships:
- Button: id="header-1", aria-controls="panel-1"
- Panel: id="panel-1", aria-labelledby="header-1"

Region Role Rule:
- ≤6 panels: use role="region" on panels
- >6 panels: omit role="region" (too many landmarks)
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Toggle test
it('toggles panel on Enter/Space', async () => {
  const user = userEvent.setup();
  render(<Accordion items={items} />);

  const header = screen.getByRole('button', { name: 'Section 1' });
  expect(header).toHaveAttribute('aria-expanded', 'false');

  await user.click(header);
  expect(header).toHaveAttribute('aria-expanded', 'true');
});

// Disabled headers do not toggle
it('disabled header does not toggle on click', async () => {
  const user = userEvent.setup();
  render(<Accordion items={itemsWithDisabled} />);

  const disabled = screen.getByRole('button', { name: 'Section 2' });
  expect(disabled).toHaveAttribute('aria-expanded', 'false');

  await user.click(disabled);
  expect(disabled).toHaveAttribute('aria-expanded', 'false');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('accordion has proper ARIA structure', async ({ page }) => {
  await page.goto('patterns/accordion/react/demo/');
  const accordion = page.locator('.apg-accordion').first();
  const header = accordion.locator('.apg-accordion-trigger').first();

  // Wait for hydration
  await expect(header).toHaveAttribute('aria-controls', /.+/);

  // Check aria-expanded
  const expanded = await header.getAttribute('aria-expanded');
  expect(['true', 'false']).toContain(expanded);

  // Check aria-controls references valid panel
  const controlsId = await header.getAttribute('aria-controls');
  const panel = page.locator(`[id="${controlsId}"]`);
  await expect(panel).toBeAttached();
  await expect(panel).toHaveRole('region');
});

// Keyboard toggle test
test('Enter/Space toggles panel expansion', async ({ page }) => {
  await page.goto('patterns/accordion/react/demo/');
  const accordion = page.locator('.apg-accordion').first();
  const header = accordion.locator('.apg-accordion-trigger').nth(1);

  await expect(header).toHaveAttribute('aria-expanded', 'false');

  await header.click();
  await header.press('Enter');
  await expect(header).toHaveAttribute('aria-expanded', 'false');

  await header.press('Space');
  await expect(header).toHaveAttribute('aria-expanded', 'true');
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/accordion/react/demo/');
  await page.locator('.apg-accordion').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('.apg-accordion')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
