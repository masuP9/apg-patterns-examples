# Spinbutton Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/

## Overview

A spinbutton allows users to select a value from a discrete set or range. Contains a text field displaying the current value with optional increment/decrement buttons. Supports direct text input and keyboard navigation.

## Native HTML vs Custom Implementation

| Use Case | Recommended |
| --- | --- |
| Simple numeric input | Native <input type="number"> |
| Custom styling needed | Custom role="spinbutton" |
| Consistent keyboard behavior | Custom (browser varies) |
| aria-valuetext needed | Custom implementation |

### Native vs Custom Comparison

| Feature | Native | Custom |
| --- | --- | --- |
| Basic numeric input | Recommended | Not needed |
| JavaScript disabled support | Works natively | Requires fallback |
| Built-in validation | Native support | Manual implementation |
| Custom button styling | Limited (browser-dependent) | Full control |
| Consistent cross-browser appearance | Varies by browser | Consistent |
| Custom step/large step behavior | Basic step only | PageUp/PageDown support |
| No min/max limits | Requires omitting attributes | Explicit undefined support |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `spinbutton` | Input element | Identifies the element as a spin button that allows users to select a value from a discrete set or range by incrementing/decrementing or typing directly. (required) |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | spinbutton | Number (current value) | Yes | Must be updated immediately when value changes (keyboard, button click, or text input) |
| `aria-valuemin` | spinbutton | Number | No | Only set when min is defined. Omit attribute entirely when no minimum limit exists. |
| `aria-valuemax` | spinbutton | Number | No | Only set when max is defined. Omit attribute entirely when no maximum limit exists. |
| `aria-valuetext` | spinbutton | String (e.g., "5 items", "3 of 10") | No | Provides a human-readable text alternative for the current value. Use when the numeric value alone doesn't convey sufficient meaning. |
| `aria-disabled` | spinbutton | `true` \| `false` | No | Indicates that the spinbutton is disabled and not interactive. |
| `aria-readonly` | spinbutton | `true` \| `false` | No | Indicates that the spinbutton is read-only. Users can navigate with Home/End but cannot change the value. |
| `aria-label` | spinbutton | String | Yes | Provides an invisible label for the spinbutton |
| `aria-labelledby` | spinbutton | ID reference | Yes | References an external element as the label |

## Keyboard Support

| Key | Action |
| --- | --- |
| `ArrowUp` | Increases the value by one step |
| `ArrowDown` | Decreases the value by one step |
| `Home` | Sets the value to its minimum (only when min is defined) |
| `End` | Sets the value to its maximum (only when max is defined) |
| `Page Up` | Increases the value by a large step (default: step * 10) |
| `Page Down` | Decreases the value by a large step (default: step * 10) |

## Focus Management

- Input element: tabindex="0"
- Disabled input: tabindex="-1"
- Increment/decrement buttons: tabindex="-1" (not in tab order)
- Button click: Focus stays on spinbutton (does NOT move to button)

## Test Checklist

### High Priority: ARIA

- [ ] role="spinbutton" exists on input
- [ ] aria-valuenow set to current value
- [ ] aria-valuemin only set when min is defined
- [ ] aria-valuemax only set when max is defined
- [ ] Accessible name required (label/aria-label/aria-labelledby)
- [ ] aria-valuetext set when valueText/format provided
- [ ] aria-disabled="true" when disabled
- [ ] aria-readonly="true" when readOnly

### Medium Priority: ARIA

- [ ] Direct text input accepted
- [ ] Value validated and clamped on blur

### High Priority: Keyboard

- [ ] ArrowUp increases value by step
- [ ] ArrowDown decreases value by step
- [ ] Home sets value to min (only when min defined)
- [ ] End sets value to max (only when max defined)
- [ ] Page Up increases by large step
- [ ] Page Down decreases by large step
- [ ] Value stops at min/max boundaries (no wrapping)
- [ ] Keys have no effect when disabled

### Medium Priority: Keyboard

- [ ] IME composition handled correctly

### High Priority: Focus Management

- [ ] Input is focusable (tabindex="0")
- [ ] Input not focusable when disabled (tabindex="-1")
- [ ] Buttons have tabindex="-1"
- [ ] Focus stays on input after button click

### Medium Priority: Accessibility

- [ ] No axe-core violations

## Implementation Notes

### Props Design

```typescript
// Label: one of these required (exclusive)
type LabelProps =
  | { label: string; 'aria-label'?: never; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label': string; 'aria-labelledby'?: never }
  | { label?: never; 'aria-label'?: never; 'aria-labelledby': string };

type SpinbuttonBaseProps = {
  defaultValue?: number;
  min?: number;           // default: undefined (no limit)
  max?: number;           // default: undefined (no limit)
  step?: number;          // default: 1
  largeStep?: number;     // default: step * 10
  disabled?: boolean;
  readOnly?: boolean;
  showButtons?: boolean;  // default: true
  onValueChange?: (value: number) => void;
};

export type SpinbuttonProps = SpinbuttonBaseProps & LabelProps;
```

### Structure

```
┌─────────────────────────────────────────────────────────────┐
│ <div class="apg-spinbutton">                                │
│   <span class="apg-spinbutton-label">Label</span>           │
│   <div class="apg-spinbutton-controls">  ← focus ring here  │
│     <button tabindex="-1" aria-label="Decrement">−</button> │
│     <input                                                  │
│       role="spinbutton"                                     │
│       tabindex="0"                                          │
│       aria-valuenow="5"                                     │
│       aria-valuemin="0"      (only if min defined)          │
│       aria-valuemax="100"    (only if max defined)          │
│       inputmode="numeric"                                   │
│     />                                                      │
│     <button tabindex="-1" aria-label="Increment">+</button> │
│   </div>                                                    │
│ </div>                                                      │
└─────────────────────────────────────────────────────────────┘
```

### Common Pitfalls

1. **Missing accessible name**: Always require label, aria-label, or aria-labelledby
2. **Unconditional aria-valuemin/max**: Only set when min/max props are defined
3. **IME input handling**: Don't update aria-valuenow during composition
4. **Button focus steal**: Buttons must not receive focus on click
5. **Floating-point precision**: Round to step to avoid precision errors

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Role test
it('has role="spinbutton"', () => {
  render(<Spinbutton aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).toBeInTheDocument();
});

// ARIA values test
it('has aria-valuenow set to current value', () => {
  render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-valuenow', '5');
});

// No aria-valuemin when undefined
it('does not have aria-valuemin when min is undefined', () => {
  render(<Spinbutton aria-label="Quantity" />);
  expect(screen.getByRole('spinbutton')).not.toHaveAttribute('aria-valuemin');
});

// Keyboard: ArrowUp
it('increases value on ArrowUp', async () => {
  const user = userEvent.setup();
  render(<Spinbutton defaultValue={5} step={1} aria-label="Quantity" />);
  const spinbutton = screen.getByRole('spinbutton');

  await user.click(spinbutton);
  await user.keyboard('{ArrowUp}');

  expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
});

// axe test
it('has no axe violations', async () => {
  const { container } = render(<Spinbutton aria-label="Quantity" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  const spinbutton = page.getByRole('spinbutton').first();

  await expect(spinbutton).toHaveRole('spinbutton');
  await expect(spinbutton).toHaveAttribute('aria-valuenow');
});

// Keyboard interaction test
test('ArrowUp increases value', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  const spinbutton = page.getByRole('spinbutton').first();

  await spinbutton.focus();
  const initialValue = await spinbutton.getAttribute('aria-valuenow');
  await page.keyboard.press('ArrowUp');

  const newValue = await spinbutton.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBe(Number(initialValue) + 1);
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/spinbutton/react/demo/');
  await page.getByRole('spinbutton').first().waitFor();

  const results = await new AxeBuilder({ page })
    .include('[role="spinbutton"]')
    .analyze();

  expect(results.violations).toEqual([]);
});
```
