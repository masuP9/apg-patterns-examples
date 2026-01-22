# Switch Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/switch/

## Overview

A switch is a type of checkbox that represents on/off values, as opposed to checked/unchecked. It uses role="switch" and aria-checked instead of a checkbox.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `switch` | Switch element | An input widget that allows users to choose one of two values: on or off |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-checked` | switch element | `true` \| `false` | Yes | Click, Enter, Space |
| `aria-disabled` | switch element | `true` \| `undefined` | No | Only when disabled |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Space` | Toggle the switch state (on/off) |
| `Enter` | Toggle the switch state (on/off) |

## Test Checklist

### High Priority: Keyboard

- [ ] Space toggles state
- [ ] Enter toggles state
- [ ] Tab navigates to switch
- [ ] Disabled switch behavior correct

### High Priority: ARIA

- [ ] Has role="switch"
- [ ] Has aria-checked attribute
- [ ] aria-checked toggles between true and false
- [ ] Disabled state has aria-disabled="true"
- [ ] Has accessible name

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] State distinguishable without color alone

## Implementation Notes

## Accessible Naming

One of these is required:
- **Visible label** (recommended) - Child content as accessible name
- `aria-label` - Invisible label
- `aria-labelledby` - Reference to external label element

## Visual Design (WCAG 1.4.1)

Do not rely solely on color to indicate state:
- **Thumb position** - Left = off, Right = on
- **Checkmark icon** - Visible only when on
- **Forced colors mode** - Use system colors for Windows High Contrast

## Structure

```
<button role="switch" aria-checked="false">
  <span class="switch-track">
    <span class="switch-thumb" />
  </span>
  Enable notifications
</button>

Visual States:
┌─────────┬────────────┐
│ OFF     │ ON         │
├─────────┼────────────┤
│ [○    ] │ [    ✓]   │
│ Left    │ Right+icon │
└─────────┴────────────┘

Switch vs Checkbox:
- Switch: immediate effect, on/off semantics
- Checkbox: may require form submit, checked/unchecked semantics
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Toggle test
it('toggles aria-checked on click', async () => {
  const user = userEvent.setup();
  render(<Switch>Enable</Switch>);

  const switchEl = screen.getByRole('switch');
  expect(switchEl).toHaveAttribute('aria-checked', 'false');

  await user.click(switchEl);
  expect(switchEl).toHaveAttribute('aria-checked', 'true');
});

// Keyboard test
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<Switch>Enable</Switch>);

  const switchEl = screen.getByRole('switch');
  switchEl.focus();

  await user.keyboard(' ');
  expect(switchEl).toHaveAttribute('aria-checked', 'true');
});

// Accessible name test
it('has accessible name', () => {
  render(<Switch>Enable notifications</Switch>);
  expect(screen.getByRole('switch', { name: /enable notifications/i }))
    .toBeInTheDocument();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="switch" and aria-checked attribute', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switches = page.locator('[role="switch"]');
  const count = await switches.count();
  expect(count).toBeGreaterThan(0);

  for (let i = 0; i < count; i++) {
    await expect(switches.nth(i)).toHaveAttribute('role', 'switch');
    const ariaChecked = await switches.nth(i).getAttribute('aria-checked');
    expect(['true', 'false']).toContain(ariaChecked);
  }
});

// Toggle behavior test
test('toggles aria-checked on click and Space key', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switchEl = page.locator('[role="switch"]').first();
  const initialState = await switchEl.getAttribute('aria-checked');

  // Click toggle
  await switchEl.click();
  expect(await switchEl.getAttribute('aria-checked')).not.toBe(initialState);

  // Space key toggle
  await switchEl.focus();
  await page.keyboard.press('Space');
  expect(await switchEl.getAttribute('aria-checked')).toBe(initialState);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/switch/react/demo/');
  const switches = page.locator('[role="switch"]');
  await switches.first().waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="switch"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
