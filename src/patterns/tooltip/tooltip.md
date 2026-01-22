# Tooltip Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/

## Overview

A tooltip is a popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `tooltip` | Tooltip popup | A contextual popup that displays a description for an element |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-describedby` | [object Object] | ID of tooltip | Yes | Only when tooltip is visible. References the tooltip element to provide an accessible description for the trigger element. |
| `aria-hidden` | [object Object] | ``true`` \| ``false`` | No | Indicates whether the tooltip is hidden from assistive technology. Default is true. |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Escape` | Closes the tooltip |
| `Tab` | Standard focus navigation; tooltip shows when trigger receives focus |

## Focus Management

- Tooltip display: Tooltip never receives focus - Per APG, tooltips must not be focusable. If interactive content is needed, use a Dialog or Popover pattern instead.
- Trigger focus: Focus triggers display - When the trigger element receives focus, the tooltip appears after the configured delay.
- Trigger blur: Blur hides tooltip - When focus leaves the trigger element, the tooltip is hidden.

## Test Checklist

### High Priority: Keyboard

- [ ] Escape closes tooltip
- [ ] Tooltip appears on trigger focus
- [ ] Tooltip hides on trigger blur

### High Priority: ARIA

- [ ] Tooltip has `role="tooltip"`
- [ ] Trigger has `aria-describedby` when tooltip visible
- [ ] `aria-describedby` removed when tooltip hidden
- [ ] Tooltip has correct `aria-hidden` state

### High Priority: Focus Management

- [ ] Tooltip is NOT focusable
- [ ] Focus stays on trigger when tooltip shows
- [ ] Tab moves to next element (not into tooltip)

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

### Important Constraints

1. **Tooltip never receives focus** - Must not be focusable
2. **No interactive content** - Use Dialog/Popover if interaction needed
3. **Configurable delay** - Prevents accidental activation

### Structure

```
        ┌─────────────────┐
        │ Tooltip content │  ← role="tooltip", id="tip-1"
        └────────┬────────┘
                 │
    ┌────────────▼────────────┐
    │ [Trigger Element]       │  ← aria-describedby="tip-1" (when visible)
    └─────────────────────────┘
```

### State Flow

1. Initial: tooltip hidden, aria-describedby absent
2. Focus/Hover: tooltip visible, aria-describedby set
3. Blur/Leave/Escape: tooltip hidden, aria-describedby removed

### Do NOT

- Put focusable elements in tooltip
- Make tooltip itself focusable
- Use for content requiring interaction

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Show on focus
it('shows tooltip on focus', async () => {
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  trigger.focus();

  expect(await screen.findByRole('tooltip')).toBeVisible();
});

// Escape closes
it('closes on Escape', async () => {
  const user = userEvent.setup();
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  trigger.focus();
  await screen.findByRole('tooltip');

  await user.keyboard('{Escape}');

  expect(screen.queryByRole('tooltip')).not.toBeVisible();
});

// aria-describedby test
it('sets aria-describedby when visible', async () => {
  render(<TooltipDemo />);

  const trigger = screen.getByRole('button');
  expect(trigger).not.toHaveAttribute('aria-describedby');

  trigger.focus();
  const tooltip = await screen.findByRole('tooltip');

  expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('tooltip has role="tooltip" and aria-describedby linkage', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  // Hover to show tooltip
  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });
  await expect(tooltip).toHaveRole('tooltip');

  // Check aria-describedby linkage
  const tooltipId = await tooltip.getAttribute('id');
  await expect(trigger).toHaveAttribute('aria-describedby', tooltipId!);
});

// Keyboard interaction test
test('hides tooltip on Escape key', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });

  await page.keyboard.press('Escape');
  await expect(tooltip).not.toBeVisible();
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tooltip/react/demo/');
  const trigger = page.locator('.apg-tooltip-trigger').first();
  const tooltip = page.locator('[role="tooltip"]').first();

  // Show tooltip
  await trigger.hover();
  await expect(tooltip).toBeVisible({ timeout: 1000 });

  const results = await new AxeBuilder({ page })
    .include('.apg-tooltip-trigger')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
