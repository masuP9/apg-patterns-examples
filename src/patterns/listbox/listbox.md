# Listbox Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/

## Overview

A listbox widget presents a list of options and allows selection of one or more items. It provides custom selection behavior beyond native `<select>`.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `listbox` | Container (`<ul>`) | Widget for selecting one or more items from a list |
| `option` | Each item (`<li>`) | Selectable option within the listbox |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | listbox | String | Yes | Accessible name for the listbox |
| `aria-labelledby` | listbox | ID reference | Yes | References the labeling element |
| `aria-multiselectable` | listbox | `true` | No | Enables multi-select mode |
| `aria-orientation` | listbox | ``"vertical"`` \| ``"horizontal"`` | No | Navigation direction (default: vertical) |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-selected` | option | ``true`` \| ``false`` | Yes | Click, Arrow keys (single-select), Space (multi-select) |
| `aria-disabled` | option | `true` | No | When disabled |

## Keyboard Support

### Common Navigation

| Key | Action |
| --- | --- |
| `Down Arrow / Up Arrow` | Move focus (vertical orientation) |
| `Right Arrow / Left Arrow` | Move focus (horizontal orientation) |
| `Home` | Move focus to first option |
| `End` | Move focus to last option |
| `Type character` | Type-ahead: focus option starting with typed character(s) |

### Single-Select (Selection Follows Focus)

| Key | Action |
| --- | --- |
| `Arrow keys` | Move focus and selection simultaneously |
| `Space / Enter` | Confirm current selection |

### Multi-Select

| Key | Action |
| --- | --- |
| `Arrow keys` | Move focus only (selection unchanged) |
| `Space` | Toggle selection of focused option |
| `Shift + Arrow` | Move focus and extend selection range |
| `Shift + Home` | Select from anchor to first option |
| `Shift + End` | Select from anchor to last option |
| `Ctrl + A` | Select all options |

## Focus Management

- Focused option: Only one option has `tabindex="0"` at a time (Roving Tabindex)
- Non-focused options: Other options have `tabindex="-1"`
- Arrow navigation: Arrow keys move focus between options
- Disabled options: Disabled options are skipped during navigation
- Edge behavior: Focus does not wrap (stops at edges)

## Test Checklist

### High Priority: Keyboard

- [ ] Arrow keys navigate options
- [ ] Home moves to first option
- [ ] End moves to last option
- [ ] Type-ahead focuses matching option
- [ ] Disabled options are skipped
- [ ] Focus does not wrap
- [ ] Arrow keys move focus and selection (single-select)
- [ ] Space/Enter confirms selection
- [ ] Arrow keys move focus only (multi-select)
- [ ] Space toggles selection
- [ ] Shift+Arrow extends selection
- [ ] Ctrl+A selects all

### High Priority: ARIA

- [ ] Container has `role="listbox"`
- [ ] Items have `role="option"`
- [ ] Listbox has accessible name
- [ ] Selected options have `aria-selected="true"`
- [ ] Multi-select has `aria-multiselectable="true"`

### High Priority: Focus Management

- [ ] Only focused option has `tabIndex="0"`
- [ ] Other options have `tabIndex="-1"`

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

Structure:
```html
<ul role="listbox" aria-label="Choose color">
  <li role="option" aria-selected="true" tabindex="0">Red</li>
  <li role="option" aria-selected="false" tabindex="-1">Green</li>
  <li role="option" aria-selected="false" tabindex="-1">Blue</li>
</ul>
```

Multi-Select:
```html
<ul role="listbox" aria-label="Colors" aria-multiselectable="true">
  <li role="option" aria-selected="true" tabindex="0">Red</li>
  <li role="option" aria-selected="true" tabindex="-1">Green</li>
  <li role="option" aria-selected="false" tabindex="-1">Blue</li>
</ul>
```

Type-Ahead:
- Single character: jump to next option starting with that char
- Multiple chars (typed quickly): match prefix
- Example: typing "gr" focuses "Green"

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Arrow navigation
it('ArrowDown moves focus', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  const firstOption = screen.getByRole('option', { name: 'Red' });
  firstOption.focus();

  await user.keyboard('{ArrowDown}');

  expect(screen.getByRole('option', { name: 'Green' })).toHaveFocus();
});

// Single-select
it('selection follows focus in single-select', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  const firstOption = screen.getByRole('option', { name: 'Red' });
  firstOption.focus();

  await user.keyboard('{ArrowDown}');

  const greenOption = screen.getByRole('option', { name: 'Green' });
  expect(greenOption).toHaveAttribute('aria-selected', 'true');
});

// Multi-select toggle
it('Space toggles in multi-select', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} multiselectable />);

  const option = screen.getByRole('option', { name: 'Red' });
  option.focus();

  await user.keyboard(' ');
  expect(option).toHaveAttribute('aria-selected', 'true');

  await user.keyboard(' ');
  expect(option).toHaveAttribute('aria-selected', 'false');
});

// Type-ahead
it('type-ahead focuses matching option', async () => {
  const user = userEvent.setup();
  render(<Listbox options={options} />);

  screen.getByRole('option', { name: 'Red' }).focus();

  await user.keyboard('g');

  expect(screen.getByRole('option', { name: 'Green' })).toHaveFocus();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/listbox/react/demo/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').first();
  await expect(listbox).toHaveAttribute('role', 'listbox');

  // Check accessible name
  const ariaLabelledby = await listbox.getAttribute('aria-labelledby');
  expect(ariaLabelledby).toBeTruthy();

  // Check options have correct role
  const options = listbox.locator('[role="option"]');
  const count = await options.count();
  expect(count).toBeGreaterThan(0);

  // Multi-select listbox has aria-multiselectable
  const multiSelectListbox = page.locator('[role="listbox"]').nth(1);
  await expect(multiSelectListbox).toHaveAttribute('aria-multiselectable', 'true');
});

// Keyboard navigation test (single-select)
test('ArrowDown moves focus and selection in single-select', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').first();
  const options = listbox.locator('[role="option"]:not([aria-disabled="true"])');
  const firstOption = options.first();
  const secondOption = options.nth(1);

  await firstOption.focus();
  await expect(firstOption).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowDown');
  await expect(secondOption).toHaveAttribute('tabindex', '0');
  await expect(secondOption).toHaveAttribute('aria-selected', 'true');
  await expect(firstOption).toHaveAttribute('aria-selected', 'false');
});

// Multi-select keyboard test
test('Space toggles selection in multi-select', async ({ page }) => {
  const listbox = page.locator('[role="listbox"]').nth(1);
  const firstOption = listbox.locator('[role="option"]:not([aria-disabled="true"])').first();

  await firstOption.focus();
  await expect(firstOption).not.toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Space');
  await expect(firstOption).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('Space');
  await expect(firstOption).toHaveAttribute('aria-selected', 'false');
});

// Accessibility test
test('has no axe-core violations', async ({ page }) => {
  const results = await new AxeBuilder({ page }).include('[role="listbox"]').analyze();
  expect(results.violations).toEqual([]);
});
```
