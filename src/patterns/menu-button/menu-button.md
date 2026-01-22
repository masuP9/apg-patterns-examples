# Menu Button Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/

## Overview

A menu button is a button that opens a menu. The button element has aria-haspopup="menu" and controls a dropdown menu containing menu items.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `button` | Trigger (<button>) | The trigger that opens the menu (implicit via <button> element) |
| `menu` | Container (<ul>) | A widget offering a list of choices to the user |
| `menuitem` | Each item (<li>) | An option in a menu |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-haspopup` | button | "menu" | Yes | Indicates the button opens a menu |
| `aria-controls` | button | ID reference | No | References the menu element |
| `aria-labelledby` | menu | ID reference | Yes | References the button that opens the menu |
| `aria-label` | menu | String | Yes | Provides an accessible name for the menu |
| `aria-disabled` | menuitem | true | No | Indicates the menu item is disabled |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-expanded` | button | `true` \| `false` | Yes | Open/close menu |

## Keyboard Support

### Button (Closed Menu)

| Key | Action |
| --- | --- |
| `Enter / Space` | Open menu and focus first item |
| `Down Arrow` | Open menu and focus first item |
| `Up Arrow` | Open menu and focus last item |

### Menu (Open)

| Key | Action |
| --- | --- |
| `Down Arrow` | Move focus to next item (wraps to first) |
| `Up Arrow` | Move focus to previous item (wraps to last) |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Escape` | Close menu and return focus to button |
| `Tab` | Close menu and move focus to next focusable element |
| `Enter / Space` | Activate focused item and close menu |
| `Type character` | Type-ahead: focus item starting with typed character(s) |

## Focus Management

- Focused menu item: tabIndex="0"
- Other menu items: tabIndex="-1"
- Arrow key navigation: Wraps from last to first and vice versa
- Disabled items: Skipped during navigation
- Menu closes: Focus returns to button

## Test Checklist

### High Priority: Click Behavior

- [ ] Click button opens menu
- [ ] Click button again closes menu (toggle)
- [ ] Click menu item activates and closes menu
- [ ] Click disabled item does nothing
- [ ] Click outside menu closes it

### High Priority: Keyboard

- [ ] Enter opens menu, focuses first enabled item
- [ ] Space opens menu, focuses first enabled item
- [ ] ArrowDown opens menu, focuses first enabled item
- [ ] ArrowUp opens menu, focuses last enabled item
- [ ] ArrowDown moves to next item (wraps)
- [ ] ArrowUp moves to previous item (wraps)
- [ ] Home moves to first enabled item
- [ ] End moves to last enabled item
- [ ] Escape closes menu, returns focus to button
- [ ] Tab closes menu
- [ ] Enter/Space activates item, closes menu
- [ ] Disabled items are skipped
- [ ] Single character focuses matching item
- [ ] Multiple characters match prefix
- [ ] Search wraps around
- [ ] Buffer resets after 500ms

### High Priority: ARIA

- [ ] Button has role="button"
- [ ] Button has aria-haspopup="menu"
- [ ] Button has aria-expanded (true/false)
- [ ] Button has aria-controls linking to menu
- [ ] Menu has role="menu"
- [ ] Menu has accessible name
- [ ] Items have role="menuitem"
- [ ] Disabled items have aria-disabled="true"

### High Priority: Focus Management

- [ ] Only focused item has tabIndex="0"
- [ ] Other items have tabIndex="-1"

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

## Structure

```html
Structure (closed):
<button
  aria-haspopup="menu"
  aria-expanded="false"
  aria-controls="menu-id"
>
  Actions ▼
</button>
<ul id="menu-id" role="menu" aria-labelledby="button-id" hidden>
  <li role="menuitem" tabindex="-1">Cut</li>
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
</ul>

Structure (open):
<button
  aria-haspopup="menu"
  aria-expanded="true"
  aria-controls="menu-id"
>
  Actions ▼
</button>
<ul id="menu-id" role="menu" aria-labelledby="button-id">
  <li role="menuitem" tabindex="0">Cut</li>      <!-- focused -->
  <li role="menuitem" tabindex="-1">Copy</li>
  <li role="menuitem" tabindex="-1">Paste</li>
</ul>

With disabled item:
<li role="menuitem" aria-disabled="true" tabindex="-1">Export</li>
```

## Type-Ahead Search

- Characters typed within 500ms form search string
- After 500ms idle, buffer resets
- Search is case-insensitive
- Wraps from end to beginning

## Focus Management (Roving Tabindex)

- Only one menu item has `tabIndex="0"`
- Other items have `tabIndex="-1"`
- Disabled items are skipped during keyboard navigation
- Focus wraps from last to first (and vice versa)

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Open menu with Enter
it('Enter opens menu and focuses first item', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" />);

  const button = screen.getByRole('button', { name: 'Actions' });
  button.focus();

  await user.keyboard('{Enter}');

  expect(button).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
});

// Arrow navigation with wrap
it('ArrowDown wraps from last to first', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  screen.getByRole('menuitem', { name: 'Delete' }).focus(); // last item

  await user.keyboard('{ArrowDown}');

  expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
});

// Escape closes menu
it('Escape closes menu and returns focus to button', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  const button = screen.getByRole('button');

  await user.keyboard('{Escape}');

  expect(button).toHaveAttribute('aria-expanded', 'false');
  expect(button).toHaveFocus();
});

// Type-ahead
it('type-ahead focuses matching item', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  screen.getByRole('menuitem', { name: 'Cut' }).focus();

  await user.keyboard('p');

  expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
});

// Click outside closes menu
it('clicking outside closes menu', async () => {
  const user = userEvent.setup();
  render(<MenuButton items={items} label="Actions" defaultOpen />);

  await user.click(document.body);

  expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';

// Helper functions
const getMenuButton = (page) => page.getByRole('button', { name: /actions/i }).first();
const getMenu = (page) => page.getByRole('menu');
const getMenuItems = (page) => page.getByRole('menuitem');

const openMenu = async (page) => {
  const button = getMenuButton(page);
  await button.click();
  await getMenu(page).waitFor({ state: 'visible' });
  return button;
};

// ARIA structure tests
test('button has correct ARIA attributes', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  const button = getMenuButton(page);

  await expect(button).toHaveAttribute('aria-haspopup', 'menu');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(button).toHaveAttribute('aria-controls', /.+/);
});

// Keyboard interaction
test('Enter opens menu and focuses first item', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  const button = getMenuButton(page);
  await button.focus();
  await page.keyboard.press('Enter');

  await expect(getMenu(page)).toBeVisible();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(getMenuItems(page).first()).toBeFocused();
});

// Type-ahead (use trim() for frameworks with whitespace in textContent)
test('type-ahead focuses matching item', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  await openMenu(page);
  await expect(getMenuItems(page).first()).toBeFocused();

  await page.keyboard.press('p');

  await expect
    .poll(async () => {
      const text = await page.evaluate(
        () => document.activeElement?.textContent?.trim().toLowerCase() || ''
      );
      return text.startsWith('p');
    })
    .toBe(true);
});

// axe-core accessibility
test('no accessibility violations', async ({ page }) => {
  await page.goto('/patterns/menu-button/react/demo/');
  await openMenu(page);

  const results = await new AxeBuilder({ page })
    .include('.apg-menu-button')
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```
