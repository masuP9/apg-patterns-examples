# Checkbox Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

## Overview

A checkbox allows users to select one or more options from a set. Supports dual-state (checked/unchecked) and tri-state (checked/unchecked/mixed) for parent-child relationships.

### Native vs Custom Comparison

| Feature | Native | Custom |
| --- | --- | --- |
| Basic form input | Recommended | Not needed |
| JavaScript disabled support | Works natively | Requires fallback |
| Indeterminate (mixed) state | JS property only* | Full control |
| Custom styling | Limited (browser-dependent) | Full control |
| Form submission | Built-in | Requires hidden input |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `checkbox` | <input type="checkbox"> or element with role="checkbox" | Identifies the element as a checkbox. Native <input type="checkbox"> has this role implicitly. |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | Control | string | Yes | Provides accessible name |
| `aria-labelledby` | Control | ID reference | Yes | References external text as label |
| `aria-describedby` | Control | ID reference | No | Additional description |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-checked / checked` | Checkbox element | `true` \| `false` \| `mixed` | Yes | Click, Space key |
| `indeterminate` | Native checkbox (<input>) | `true` \| `false` | No | Parent-child sync, automatically cleared on user interaction |
| `disabled` | Checkbox element | `present` \| `absent` | No | Programmatic change |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Space` | Toggle the checkbox state (checked/unchecked) |
| `Tab` | Move focus to the next focusable element |
| `Shift + Tab` | Move focus to the previous focusable element |

## Focus Management

- Native checkbox: Focusable by default
- Custom implementation: Requires tabindex="0"
- Disabled checkbox: Skipped in Tab order

## Test Checklist

### High Priority: ARIA

- [ ] role="checkbox" exists (implicit via native or explicit)
- [ ] Unchecked by default
- [ ] Checked when initialChecked=true
- [ ] indeterminate property settable
- [ ] Disabled state prevents interaction
- [ ] Accessible name via aria-label
- [ ] Accessible name via external <label>
- [ ] name attribute for form submission
- [ ] value attribute set correctly

### High Priority: Click Behavior

- [ ] Click toggles checked state
- [ ] User action clears indeterminate state

### High Priority: Keyboard

- [ ] Space key toggles state
- [ ] Tab moves focus to/from checkbox
- [ ] Disabled checkbox skipped by Tab
- [ ] Disabled checkbox ignores Space key

### Medium Priority: Accessibility

- [ ] No axe-core violations (all states)
- [ ] State visible without color alone (WCAG 1.4.1)

## Implementation Notes

## Mixed State Behavior

When a mixed (indeterminate) checkbox is activated:

```
mixed → checked (true) → unchecked (false) → checked...
```

### Parent-Child Sync (Groups)

| Children State | Parent State |
| --- | --- |
| All checked | checked |
| All unchecked | unchecked |
| Some checked | mixed |

| Parent Action | Children Effect |
| --- | --- |
| Check | All children checked |
| Uncheck | All children unchecked |
| Activate when mixed | All children checked |

## Structure

```
<span class="apg-checkbox">
  <input type="checkbox" class="apg-checkbox-input" />
  <span class="apg-checkbox-control" aria-hidden="true">
    <span class="apg-checkbox-icon--check">✓</span>
    <span class="apg-checkbox-icon--indeterminate">−</span>
  </span>
</span>
```

## Common Pitfalls

1. **Form submission**: Unchecked checkbox sends nothing (not `false`). Handle on server or use hidden input.
2. **`indeterminate` is JS-only**: No HTML attribute exists. Must set via `element.indeterminate = true`.
3. **Focus ring on custom control**: Use adjacent sibling selector since input is visually hidden.
4. **Touch target size**: WCAG 2.5.5 recommends 44x44px minimum.

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Role test
it('has role="checkbox"', () => {
  render(<Checkbox aria-label="Accept terms" />);
  expect(screen.getByRole('checkbox')).toBeInTheDocument();
});

// Toggle test
it('toggles checked state on click', async () => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Accept terms" />);

  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();

  await user.click(checkbox);
  expect(checkbox).toBeChecked();
});

// Keyboard test
it('toggles on Space key', async () => {
  const user = userEvent.setup();
  render(<Checkbox aria-label="Accept terms" />);

  const checkbox = screen.getByRole('checkbox');
  checkbox.focus();

  await user.keyboard(' ');
  expect(checkbox).toBeChecked();
});

// Indeterminate test
it('clears indeterminate on user action', async () => {
  const user = userEvent.setup();
  render(<Checkbox indeterminate aria-label="Select all" />);

  const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
  expect(checkbox.indeterminate).toBe(true);

  await user.click(checkbox);
  expect(checkbox.indeterminate).toBe(false);
  expect(checkbox).toBeChecked();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('toggles checked state on click', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-terms');
  const control = checkbox.locator('~ .apg-checkbox-control');

  await expect(checkbox).not.toBeChecked();
  await control.click();
  await expect(checkbox).toBeChecked();
});

test('Space key toggles checkbox when focused', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-terms');

  await checkbox.focus();
  await expect(checkbox).not.toBeChecked();

  await page.keyboard.press('Space');
  await expect(checkbox).toBeChecked();
});

test('clears indeterminate state on click', async ({ page }) => {
  await page.goto('patterns/checkbox/react/');
  const checkbox = page.locator('#demo-select-all');

  const isIndeterminate = await checkbox.evaluate(
    (el: HTMLInputElement) => el.indeterminate
  );
  expect(isIndeterminate).toBe(true);

  await checkbox.locator('~ .apg-checkbox-control').click();

  const isIndeterminateAfter = await checkbox.evaluate(
    (el: HTMLInputElement) => el.indeterminate
  );
  expect(isIndeterminateAfter).toBe(false);
  await expect(checkbox).toBeChecked();
});
```
