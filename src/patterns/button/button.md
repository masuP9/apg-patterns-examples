# Button Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/button/

## Overview

A button is a widget that enables users to trigger an action or event, such as submitting a form, opening a dialog, canceling an action, or performing a delete operation.

## Native HTML vs Custom Implementation

| Use Case | Recommended |
| --- | --- |
| Simple action button | Native <button> |
| Form submission | Native <button type="submit"> |
| Educational purposes (demonstrating ARIA) | Custom role="button" |
| Legacy constraints (non-button must act as button) | Custom role="button" |

### Native vs Custom Comparison

| Feature | Native | Custom |
| --- | --- | --- |
| Keyboard activation (Space/Enter) | Built-in | Requires JavaScript |
| Focus management | Automatic | Requires tabindex |
| disabled attribute | Built-in | Requires aria-disabled + JS |
| Form submission | Built-in | Not supported |
| type attribute | submit/button/reset | Not supported |
| Works without JavaScript | Yes | No |
| Screen reader announcement | Automatic | Requires ARIA |
| Space key scroll prevention | Automatic | Requires preventDefault() |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `button` | <button> or element with role="button" | Identifies the element as a button widget. Native <code>&lt;button&gt;</code> has this role implicitly. |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `tabindex` | [object Object] | `"0"` \| `"-1"` | Yes | Makes the custom button element focusable via keyboard navigation. Native <code>&lt;button&gt;</code> is focusable by default. Set to -1 when disabled. |
| `aria-disabled` | [object Object] | `"true"` \| `"false"` | Yes | Indicates the button is not interactive and cannot be activated. Native <code>&lt;button disabled&gt;</code> automatically handles this. |
| `aria-label` | [object Object] | Text string describing the action | Yes | Provides an accessible name for icon-only buttons or when visible text is insufficient. |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Space` | Activate the button |
| `Enter` | Activate the button |
| `Tab` | Move focus to the next focusable element |
| `Shift + Tab` | Move focus to the previous focusable element |

## Focus Management

- Focus ring: Visible outline when focused via keyboard
- Cursor style: Pointer cursor to indicate interactivity
- Disabled appearance: Reduced opacity and not-allowed cursor when disabled

## Test Checklist

### High Priority: Keyboard

- [ ] Space key activates the button
- [ ] Enter key activates the button
- [ ] Space key prevents page scrolling
- [ ] Tab moves focus to next button
- [ ] Disabled buttons skip Tab order

### High Priority: ARIA

- [ ] Element has role="button"
- [ ] Element has tabindex="0"
- [ ] Disabled button has aria-disabled="true"
- [ ] Disabled button has tabindex="-1"

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

### Medium Priority: Click Behavior

- [ ] Disabled buttons ignore click events
- [ ] Disabled buttons ignore keyboard events

## Implementation Notes

Structure (custom implementation):
<span
  role="button"
  tabindex="0"
  onclick="handleClick()"
  onkeydown="handleKeydown(event)"
>
  Click me
</span>

Native (recommended):
<button type="button">Click me</button>

Key points:
- tabindex="0" makes element focusable
- Both Space and Enter must activate the button
- Space key must call preventDefault() to prevent scrolling
- Disabled state: aria-disabled="true" + tabindex="-1"
- IME composition must be handled (check event.isComposing)

Button vs Toggle Button:
This pattern is for simple action buttons.
For buttons that toggle between pressed and unpressed states,
see the Toggle Button pattern which uses aria-pressed.

## Example Test Code (React + Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';

// Button role
it('has button role', () => {
  render(<CustomButton onClick={jest.fn()}>Click</CustomButton>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

// Keyboard activation
it('activates on Space key', () => {
  const handleClick = jest.fn();
  render(<CustomButton onClick={handleClick}>Click</CustomButton>);
  fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
  expect(handleClick).toHaveBeenCalled();
});

it('activates on Enter key', () => {
  const handleClick = jest.fn();
  render(<CustomButton onClick={handleClick}>Click</CustomButton>);
  fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
  expect(handleClick).toHaveBeenCalled();
});

// Disabled state
it('has aria-disabled when disabled', () => {
  render(<CustomButton disabled>Click</CustomButton>);
  expect(screen.getByRole('button')).toHaveAttribute('aria-disabled', 'true');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Helper to get custom button
const getButton = (page) => {
  return page.locator('[role="button"]').first();
};

// Keyboard activation
test('activates on Space key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const button = getButton(page);
  await button.focus();
  await button.press('Space');

  // Verify activation (depends on implementation)
  await expect(page.locator('.result')).toContainText('clicked');
});

test('activates on Enter key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const button = getButton(page);
  await button.focus();
  await button.press('Enter');

  // Verify activation
  await expect(page.locator('.result')).toContainText('clicked');
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');

  const results = await new AxeBuilder({ page })
    .include('[role="button"]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```
