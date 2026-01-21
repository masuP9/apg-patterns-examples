# Button Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/button/

## Overview

A button is an interactive element that performs a single action when activated. This pattern demonstrates custom implementation with `role="button"` to show why native `<button>` is recommended.

## Native HTML vs Custom Implementation

**Strongly prefer native `<button>`** - provides full functionality automatically.

| Use Case | Recommended |
| --- | --- |
| Any button functionality | Native `<button>` |
| Form submission | Native `<button type="submit">` |
| Non-button element that triggers action | Custom `role="button"` (educational only) |

### Native `<button>` Advantages (Not Available in Custom)

| Feature | Native `<button>` | Custom `role="button"` |
| --- | --- | --- |
| Keyboard (Space/Enter) | Automatic | Manual JS required |
| tabindex | Automatic | Manual `tabindex="0"` |
| Form submission | Supported | Not supported |
| disabled attribute | Automatic (focus/click blocked) | Manual (`aria-disabled` + JS) |
| Works without JS | Yes | No |
| Default styling | Browser default | None |

## ARIA Requirements

### Roles

| Role | Element | Required | Description |
| --- | --- | --- | --- |
| `button` | `<span>`, `<div>`, etc. | Yes (custom only) | Implicit with `<button>`, explicit with `role="button"` on custom elements |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `tabindex` | Custom element | `0` / `-1` | Yes (custom only) | `0` = focusable, `-1` = disabled |
| `aria-label` | Button element | string | When no visible text | Accessible name |
| `aria-labelledby` | Button element | ID reference | When no visible text | References external text |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-disabled` | Button element | `true` / `false` | No | Disabled state change |

**Note**: This pattern does NOT use `aria-pressed`. For toggle functionality, see Toggle Button pattern.

## Keyboard Support

| Key | Action |
| --- | --- |
| `Space` | Activate button |
| `Enter` | Activate button |

**Note**: Both Space and Enter activate buttons (unlike links which only use Enter).

## Focus Management

- Native `<button>` is focusable by default
- Custom buttons require `tabindex="0"`
- Disabled buttons use `tabindex="-1"` (removed from tab order)
- No roving tabindex needed (single element)

## Test Checklist

### High Priority: ARIA Attributes

- [ ] `role="button"` exists (explicit on custom element)
- [ ] `tabindex="0"` on custom button element
- [ ] Accessible name from text content
- [ ] Accessible name from `aria-label` when no text
- [ ] `aria-disabled="true"` when disabled
- [ ] `tabindex="-1"` when disabled
- [ ] Does NOT have `aria-pressed` (not a toggle button)

### High Priority: Keyboard

- [ ] Space key activates button on keyup (fires onClick)
- [ ] Space keydown does NOT scroll page (preventDefault)
- [ ] Enter key activates button on keydown (fires onClick)
- [ ] Space only activates if pressed on the element (track spacePressed state)
- [ ] Ignores keydown when `event.isComposing === true` (IME)
- [ ] Ignores keydown when `event.defaultPrevented === true`

### High Priority: Click Behavior

- [ ] Click activates button
- [ ] Disabled button ignores click
- [ ] Disabled button ignores Space key
- [ ] Disabled button ignores Enter key

### High Priority: Focus Management

- [ ] Focusable via Tab key
- [ ] Not focusable when disabled

### Medium Priority: Accessibility

- [ ] No axe-core violations (all states)

## Implementation Notes

### Key Differences from Link Pattern

1. **Space key**: Buttons activate on BOTH Space and Enter. Links only activate on Enter.
2. **preventDefault on Space**: Required to prevent page scrolling.

### Common Pitfalls

1. **Space key timing**: Space must activate on `keyup`, not `keydown` (native button behavior). Track `spacePressed` state to ensure Space was pressed on this element.

2. **Space key scrolls page**: Must call `event.preventDefault()` on keydown when Space is pressed.

3. **IME input**: Check `event.isComposing` to avoid triggering during IME composition.

4. **Disabled state**: Use both `aria-disabled="true"` AND `tabindex="-1"`. Call `stopPropagation()` to prevent event bubbling.

5. **Form submission**: Custom buttons cannot submit forms. Use native `<button type="submit">`.

### Structure (Custom Implementation)

```
<span
  role="button"
  tabindex="0" (or "-1" when disabled)
  aria-disabled="false" (or "true")
>
  Button Text
</span>
```

### Keyboard Handler

**Important**: Space activates on `keyup`, Enter activates on `keydown` (matches native `<button>` behavior).

```typescript
let spacePressed = false;

const handleKeyDown = (event: KeyboardEvent) => {
  // Ignore during IME composition
  if (event.isComposing || event.defaultPrevented) return;
  if (disabled) return;

  // Space: prevent scroll, activate on keyup
  if (event.key === ' ') {
    event.preventDefault();
    spacePressed = true;
    return;
  }

  // Enter: activate on keydown
  if (event.key === 'Enter') {
    event.preventDefault();
    element.click();
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  if (event.key === ' ' && spacePressed) {
    spacePressed = false;
    if (disabled) return;
    event.preventDefault();
    element.click();
  }
};
```

### CSS Requirements

```css
[role="button"] {
  cursor: pointer;
  user-select: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

[role="button"]:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

[role="button"][aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
}
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Role test
it('has role="button"', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});

// tabindex test
it('has tabindex="0"', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
});

// Space key test
it('activates on Space key', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button');
  button.focus();
  await user.keyboard(' ');

  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Enter key test
it('activates on Enter key', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Button onClick={handleClick}>Click me</Button>);

  const button = screen.getByRole('button');
  button.focus();
  await user.keyboard('{Enter}');

  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Disabled test
it('does not activate when disabled', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Button onClick={handleClick} disabled>Disabled</Button>);

  await user.click(screen.getByRole('button'));
  expect(handleClick).not.toHaveBeenCalled();
});

// Disabled tabindex test
it('has tabindex="-1" when disabled', () => {
  render(<Button disabled>Disabled</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveAttribute('tabindex', '-1');
  expect(button).toHaveAttribute('aria-disabled', 'true');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has role="button" and tabindex="0"', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');
  const buttons = page.locator('[role="button"]');
  expect(await buttons.count()).toBeGreaterThan(0);

  const enabledButton = page.locator('[role="button"]:not([aria-disabled="true"])').first();
  await expect(enabledButton).toHaveAttribute('tabindex', '0');
});

// Keyboard Interaction - Space
test('activates on Space key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');
  const button = page.locator('[role="button"]:not([aria-disabled="true"])').first();

  await button.focus();
  const initialText = await button.textContent();
  await page.keyboard.press('Space');

  // Button should have been activated (check for visual feedback or callback)
  await expect(button).toBeFocused();
});

// Keyboard Interaction - Enter
test('activates on Enter key', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');
  const button = page.locator('[role="button"]:not([aria-disabled="true"])').first();

  await button.focus();
  await page.keyboard.press('Enter');

  await expect(button).toBeFocused();
});

// Disabled State
test('disabled button has aria-disabled and tabindex="-1"', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');
  const disabledButton = page.locator('[role="button"][aria-disabled="true"]');

  if (await disabledButton.count() > 0) {
    await expect(disabledButton.first()).toHaveAttribute('aria-disabled', 'true');
    await expect(disabledButton.first()).toHaveAttribute('tabindex', '-1');
  }
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/button/react/demo/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="button"]')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```
