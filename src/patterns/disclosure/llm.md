# Disclosure Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

## Overview

A disclosure is a button that controls visibility of a section of content. It's one of the simplest expand/collapse patterns.

## ARIA Requirements

### Roles

| Role     | Element | Description                   |
| -------- | ------- | ----------------------------- |
| `button` | Trigger | Use native `<button>` element |

### Properties

| Attribute       | Element | Values            | Required | Notes                        |
| --------------- | ------- | ----------------- | -------- | ---------------------------- |
| `aria-controls` | button  | ID of panel       | Yes      | Associates button with panel |
| `aria-hidden`   | panel   | `true` \| `false` | No       | Hides from AT when collapsed |

### States

| Attribute       | Element | Values            | Required | Change Trigger      |
| --------------- | ------- | ----------------- | -------- | ------------------- |
| `aria-expanded` | button  | `true` \| `false` | Yes      | Click, Enter, Space |

## Keyboard Support

| Key               | Action                          |
| ----------------- | ------------------------------- |
| `Tab`             | Move focus to disclosure button |
| `Enter` / `Space` | Toggle panel visibility         |

> Uses native `<button>` element behavior. No additional handlers needed.

## Test Checklist

### High Priority: ARIA

- [ ] Trigger is a `<button>` element
- [ ] Button has `aria-expanded` attribute
- [ ] `aria-expanded` toggles between `true` and `false`
- [ ] Button has `aria-controls` referencing panel id

### High Priority: Behavior

- [ ] Click toggles panel visibility
- [ ] Enter toggles panel visibility
- [ ] Space toggles panel visibility
- [ ] Panel content hidden when collapsed

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Disclosure vs Accordion

| Disclosure           | Accordion                                 |
| -------------------- | ----------------------------------------- |
| Single panel         | Multiple panels                           |
| No heading structure | Uses headings                             |
| Independent          | Grouped behavior (optional single-expand) |
| Simple show/hide     | Arrow key navigation between headers      |

## Implementation Notes

```html
Structure:
<button aria-expanded="false" aria-controls="content-1">Show details</button>
<div id="content-1" hidden>Panel content here...</div>

Visibility Methods: 1. hidden attribute (preferred)
<div id="panel" hidden>...</div>

2. CSS display: none .panel[aria-hidden="true"] { display: none; } 3. aria-hidden + CSS
<div aria-hidden="true" class="collapsed">...</div>

ID Relationship: - Button: aria-controls="panel-1" - Panel: id="panel-1"
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Initial state
it('starts collapsed', () => {
  render(<Disclosure>Content</Disclosure>);

  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('aria-expanded', 'false');
});

// Toggle on click
it('toggles on click', async () => {
  const user = userEvent.setup();
  render(<Disclosure>Content</Disclosure>);

  const button = screen.getByRole('button');
  await user.click(button);

  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText('Content')).toBeVisible();
});

// aria-controls
it('has aria-controls referencing panel', () => {
  render(<Disclosure>Content</Disclosure>);

  const button = screen.getByRole('button');
  const panelId = button.getAttribute('aria-controls');

  expect(document.getElementById(panelId!)).toBeInTheDocument();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('button has aria-controls referencing panel id', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();

  const ariaControls = await button.getAttribute('aria-controls');
  expect(ariaControls).not.toBeNull();

  const panel = page.locator(`[id="${ariaControls}"]`);
  await expect(panel).toBeAttached();
});

// Toggle behavior test
test('toggles aria-expanded and panel visibility on click', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();
  const panelId = await button.getAttribute('aria-controls');
  const panel = page.locator(`[id="${panelId}"]`);

  const initialState = await button.getAttribute('aria-expanded');
  await button.click();
  const newState = await button.getAttribute('aria-expanded');

  expect(newState).not.toBe(initialState);

  if (newState === 'true') {
    await expect(panel).toBeVisible();
  } else {
    await expect(panel).not.toBeVisible();
  }
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/disclosure/react/demo/');
  const button = page.locator('button[aria-expanded]').first();

  // Expand disclosure
  if ((await button.getAttribute('aria-expanded')) === 'false') {
    await button.click();
  }

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('button[aria-expanded]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
