# Combobox Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/

## Overview

A combobox is a composite widget with a text input field and an associated popup (listbox). Users can either type a value or select from the popup.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `combobox` | Input (`<input>`) | The text input element that users type into |
| `listbox` | Popup (`<ul>`) | The popup containing selectable options |
| `option` | Each item (`<li>`) | An individual selectable option |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `role="combobox"` | input | - | Yes | Identifies the input as a combobox |
| `aria-controls` | input | ID reference | Yes | References the listbox popup (even when closed) |
| `aria-expanded` | input | ``true`` \| ``false`` | Yes | Indicates whether the popup is open |
| `aria-autocomplete` | input | ``list`` \| ``none`` \| ``both`` | Yes | Describes the autocomplete behavior |
| `aria-activedescendant` | input | `ID reference` \| `empty` | Yes | References the currently focused option in the popup |
| `aria-labelledby` | [object Object] | ID reference | Yes | References the label element |
| `aria-selected` | option | ``true`` \| ``false`` | Yes | Indicates the currently focused option |
| `aria-disabled` | option | `true` | No | Indicates the option is disabled |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Down Arrow` | Open popup and focus first option |
| `Up Arrow` | Open popup and focus last option |
| `Alt + Down Arrow` | Open popup without changing focus position |
| `[object Object]` | Filter options and open popup |
| `Down Arrow` | Move focus to next enabled option (no wrap) |
| `Up Arrow` | Move focus to previous enabled option (no wrap) |
| `Home` | Move focus to first enabled option |
| `End` | Move focus to last enabled option |
| `Enter` | Select focused option and close popup |
| `Escape` | Close popup and restore previous input value |
| `Alt + Up Arrow` | Select focused option and close popup |
| `Tab` | Close popup and move to next focusable element |

## Focus Management

- Navigation via arrow keys: DOM focus remains on input; aria-activedescendant references the visually focused option
- Popup closes or filter results are empty: aria-activedescendant is cleared
- Disabled option encountered: Disabled options are skipped during navigation

## Test Checklist

### High Priority: ARIA

- [ ] Input has `role="combobox"`
- [ ] Input has `aria-controls` pointing to listbox
- [ ] `aria-controls` valid even when popup closed
- [ ] `aria-expanded` toggles correctly
- [ ] `aria-autocomplete="list"` present
- [ ] `aria-activedescendant` updates on navigation
- [ ] `aria-activedescendant` clears when closed/empty
- [ ] Listbox has `role="listbox"` and `hidden` when closed
- [ ] Options have `role="option"` and `aria-selected`

### High Priority: Keyboard

- [ ] ArrowDown opens popup, focuses first
- [ ] ArrowUp opens popup, focuses last
- [ ] ArrowDown/Up navigates options
- [ ] Home/End jump to first/last
- [ ] Enter commits selection
- [ ] Escape closes and restores value
- [ ] Tab closes popup

### High Priority: Focus Management

- [ ] DOM focus remains on input during navigation
- [ ] Disabled options are skipped

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

Structure Diagram:
```
Container (div)
+-- Label (label) id="combobox-label"
+-- Input (input)
|   role="combobox"
|   aria-controls="listbox-id"
|   aria-expanded="true/false"
|   aria-autocomplete="list"
|   aria-activedescendant="option-id" (or "")
|   aria-labelledby="combobox-label"
+-- Listbox (ul) id="listbox-id" hidden={!isOpen}
    role="listbox"
    +-- Option (li) role="option" id="opt-1" aria-selected
    +-- Option (li) role="option" id="opt-2" aria-disabled
```

Key Points:
- Listbox always in DOM: Keep listbox in DOM with hidden attribute when closed
- DOM focus stays on input at all times
- Use aria-activedescendant for virtual focus in listbox
- Clear aria-activedescendant when popup closes or filter results are empty
- Skip disabled options during navigation

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const options = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry', disabled: true },
];

// ARIA structure
it('has correct ARIA attributes', () => {
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  expect(input).toHaveAttribute('aria-expanded', 'false');
  expect(input).toHaveAttribute('aria-autocomplete', 'list');
  expect(input).toHaveAttribute('aria-controls');
});

// Keyboard - opens popup on ArrowDown
it('opens popup on ArrowDown and focuses first option', async () => {
  const user = userEvent.setup();
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  await user.click(input);
  await user.keyboard('{ArrowDown}');

  expect(input).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('listbox')).toBeVisible();
  expect(input).toHaveAttribute('aria-activedescendant', 'apple');
});

// Focus - skips disabled options
it('skips disabled options', async () => {
  const user = userEvent.setup();
  render(<Combobox options={options} label="Fruit" />);
  const input = screen.getByRole('combobox');

  await user.click(input);
  await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');

  expect(input).toHaveAttribute('aria-activedescendant', 'banana');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  const combobox = page.locator('[role="combobox"]').first();

  await expect(combobox).toHaveAttribute('role', 'combobox');
  const ariaControls = await combobox.getAttribute('aria-controls');
  expect(ariaControls).toBeTruthy();

  const listbox = page.locator(`#${ariaControls}`);
  await expect(listbox).toHaveAttribute('role', 'listbox');
});

// Keyboard - opens popup
test('ArrowDown opens popup and focuses first option', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  const combobox = page.locator('[role="combobox"]').first();

  await combobox.click();
  await page.keyboard.press('Escape');
  await expect(combobox).toHaveAttribute('aria-expanded', 'false');

  await page.keyboard.press('ArrowDown');
  await expect(combobox).toHaveAttribute('aria-expanded', 'true');

  const activeDescendant = await combobox.getAttribute('aria-activedescendant');
  expect(activeDescendant).toBeTruthy();
});

// axe-core test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/combobox/react/demo/');
  await page.locator('[role="combobox"]').first().waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.apg-combobox')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
