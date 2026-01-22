# Window Splitter Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

## Overview

A window splitter is a movable separator between two panes that allows users to change the relative size of each pane. Used in IDEs, file browsers, and resizable layouts.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `separator` | Splitter element | Focusable separator that controls pane size |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | [object Object] | 0-100 | Yes | Primary pane size as percentage |
| `aria-valuemin` | [object Object] | number | Yes | Minimum value (default: 10) |
| `aria-valuemax` | [object Object] | number | Yes | Maximum value (default: 90) |
| `aria-controls` | [object Object] | ID reference(s) | Yes | Primary pane ID (+ secondary pane ID optional) |
| `aria-label` | [object Object] | string | Yes | Accessible name |
| `aria-labelledby` | [object Object] | ID reference | Yes | Reference to visible label element |
| `aria-orientation` | [object Object] | `"horizontal"` \| `"vertical"` | No | Default: horizontal (left-right split) |
| `aria-disabled` | [object Object] | `true` \| `false` | No | Disabled state |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | separator element | 0-100 (0 = collapsed, 50 = half, 100 = fully expanded) | Yes | Arrow keys, Home/End, Enter (collapse/expand), pointer drag |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Arrow Right / Arrow Left` | Move horizontal splitter (increase/decrease) |
| `Arrow Up / Arrow Down` | Move vertical splitter (increase/decrease) |
| `Shift + Arrow` | Move by large step (default: 10%) |
| `Home` | Move to minimum position |
| `End` | Move to maximum position |
| `Enter` | Toggle collapse/expand primary pane |

## Focus Management

- Tab: Splitter receives focus via normal tab order
- Disabled: Splitter is not focusable (tabindex="-1")
- Readonly: Splitter is focusable but not operable
- After collapse/expand: Focus remains on splitter

## Test Checklist

### High Priority: ARIA

- [ ] Has role="separator"
- [ ] Has aria-valuenow attribute
- [ ] Has aria-valuemin attribute
- [ ] Has aria-valuemax attribute
- [ ] Has aria-controls attribute
- [ ] aria-valuenow updates on position change

### High Priority: Keyboard

- [ ] ArrowRight/Left moves horizontal splitter
- [ ] ArrowUp/Down moves vertical splitter
- [ ] Home moves to minimum
- [ ] End moves to maximum
- [ ] Enter toggles collapse/expand
- [ ] Shift+Arrow moves by large step

### Medium Priority: Keyboard

- [ ] RTL mode reverses arrow directions

### High Priority: Focus Management

- [ ] Splitter is focusable (tabindex="0")
- [ ] Disabled splitter not focusable

### Medium Priority: Accessibility

- [ ] No axe-core violations

## Implementation Notes

## Structure

```
Container (display: flex)
├── Primary Pane (id="primary-pane", style="width: var(--splitter-position)")
├── Separator (role="separator", tabindex="0")
│   ├── aria-valuenow="50"
│   ├── aria-valuemin="10"
│   ├── aria-valuemax="90"
│   ├── aria-controls="primary-pane secondary-pane"
│   └── aria-label="Resize panels"
└── Secondary Pane (id="secondary-pane", flex: 1)

Visual Layout (Horizontal):
┌─────────────┬──┬─────────────────────┐
│             │  │                     │
│   Primary   │▐▐│     Secondary       │
│    Pane     │▐▐│       Pane          │
│             │  │                     │
└─────────────┴──┴─────────────────────┘
              ↑
          Separator (drag handle)

Keyboard Navigation:
←  = Decrease position (RTL: increase)
→  = Increase position (RTL: decrease)
↑  = Increase position (vertical only)
↓  = Decrease position (vertical only)
Home = Set to min
End  = Set to max
Enter = Toggle collapse/expand
Shift+Arrow = Large step
```

## Important Notes

- `aria-readonly` is NOT valid for `role="separator"`. Readonly behavior must be enforced via JavaScript only.
- Direction restriction: Horizontal splitters only respond to Left/Right, vertical splitters only to Up/Down.
- CSS custom property `--splitter-position` should be set on the container and used by panes for sizing.

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA attributes test
it('has correct ARIA attributes', () => {
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      min={10}
      max={90}
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  expect(splitter).toHaveAttribute('aria-valuenow', '50');
  expect(splitter).toHaveAttribute('aria-valuemin', '10');
  expect(splitter).toHaveAttribute('aria-valuemax', '90');
  expect(splitter).toHaveAttribute('aria-controls', 'primary');
});

// Keyboard navigation test
it('moves position on ArrowRight', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      step={5}
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  splitter.focus();

  await user.keyboard('{ArrowRight}');
  expect(splitter).toHaveAttribute('aria-valuenow', '55');
});

// Collapse/expand test
it('collapses on Enter', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      collapsible
      aria-label="Resize panels"
    />
  );

  const splitter = screen.getByRole('separator');
  splitter.focus();

  await user.keyboard('{Enter}');
  expect(splitter).toHaveAttribute('aria-valuenow', '0');

  await user.keyboard('{Enter}');
  expect(splitter).toHaveAttribute('aria-valuenow', '50');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="separator" with required attributes', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();

  await expect(splitter).toHaveAttribute('role', 'separator');
  await expect(splitter).toHaveAttribute('aria-valuenow');
  await expect(splitter).toHaveAttribute('aria-valuemin');
  await expect(splitter).toHaveAttribute('aria-valuemax');
  await expect(splitter).toHaveAttribute('aria-controls');
});

// Keyboard navigation test
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();

  await splitter.focus();
  const initialValue = await splitter.getAttribute('aria-valuenow');

  await page.keyboard.press('ArrowRight');
  const newValue = await splitter.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBeGreaterThan(Number(initialValue));

  await page.keyboard.press('Home');
  const minValue = await splitter.getAttribute('aria-valuemin');
  await expect(splitter).toHaveAttribute('aria-valuenow', minValue);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/window-splitter/react/');
  const splitter = page.getByRole('separator').first();
  await splitter.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="separator"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
