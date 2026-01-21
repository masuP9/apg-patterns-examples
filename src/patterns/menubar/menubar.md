# Menubar Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

## Overview

Menubar is a horizontal menu bar that provides application-style navigation. Each menubar item can open a dropdown menu or submenu. Unlike menu-button, menubar is always visible and supports hierarchical navigation, checkbox/radio items, and hover-based menu switching.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `menubar` | Horizontal container (<ul>) | Top-level menu bar, always visible |
| `menu` | Vertical container (<ul>) | Dropdown menu or submenu |
| `menuitem` | Item (<span>) | Standard action item |
| `menuitemcheckbox` | Checkbox item | Toggleable option |
| `menuitemradio` | Radio item | Exclusive option in a group |
| `separator` | Divider (<hr>) | Visual separator (not focusable) |
| `group` | Group container | Groups radio items with a label |
| `none` | <li> elements | Hides list semantics from screen readers |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-haspopup` | [object Object] | "menu" | Yes | Indicates the item opens a menu (use "menu", not "true") |
| `aria-expanded` | [object Object] | `true` \| `false` | Yes | Indicates whether the menu is open |
| `aria-labelledby` | menu | ID reference | Yes | References the parent menuitem |
| `aria-label` | menubar/menu | String | Yes | Provides an accessible name |
| `aria-checked` | checkbox/radio | `true` \| `false` | Yes | Indicates checked state |
| `aria-disabled` | menuitem | true | Yes | Indicates the item is disabled |
| `aria-hidden` | menu/submenu | `true` \| `false` | Yes | Hides menu from screen readers when closed |

## Keyboard Support

### Menubar Navigation

| Key | Action |
| --- | --- |
| `Right Arrow` | Move focus to next menubar item (wraps to first) |
| `Left Arrow` | Move focus to previous menubar item (wraps to last) |
| `Down Arrow` | Open submenu and focus first item |
| `Up Arrow` | Open submenu and focus last item |
| `Enter / Space` | Open submenu and focus first item |
| `Home` | Move focus to first menubar item |
| `End` | Move focus to last menubar item |
| `Tab` | Close all menus and move focus out |

### Menu/Submenu Navigation

| Key | Action |
| --- | --- |
| `Down Arrow` | Move focus to next item (wraps to first) |
| `Up Arrow` | Move focus to previous item (wraps to last) |
| `Right Arrow` | Open submenu if present, or move to next menubar item's menu (in top-level menu) |
| `Left Arrow` | Close submenu and return to parent, or move to previous menubar item's menu (in top-level menu) |
| `Enter / Space` | Activate item and close menu; for checkbox/radio, toggle state and keep menu open |
| `Escape` | Close menu and return focus to parent (menubar item or parent menuitem) |
| `Home` | Move focus to first item |
| `End` | Move focus to last item |
| `Character` | Type-ahead: focus item starting with typed character(s) |

## Focus Management

- Initial focus: Only one menubar item has tabindex="0" at a time
- Other items: Other items have tabindex="-1"
- Arrow key navigation: Arrow keys move focus between items with wrapping
- Disabled items: Disabled items are focusable but not activatable (per APG recommendation)
- Separator: Separators are not focusable
- Menu close: Focus returns to invoker when menu closes

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="menubar"
- [ ] Dropdown has role="menu"
- [ ] Items have correct role (menuitem/menuitemcheckbox/menuitemradio)
- [ ] Separator has role="separator"
- [ ] Radio group has role="group" with aria-label
- [ ] All <li> have role="none"
- [ ] Submenu holder has aria-haspopup="menu"
- [ ] Submenu holder has aria-expanded
- [ ] Submenu has aria-labelledby referencing parent menuitem
- [ ] Checkbox/radio has aria-checked
- [ ] Closed menu has aria-hidden="true"

### High Priority: Keyboard

- [ ] ArrowRight moves to next menubar item (wrap)
- [ ] ArrowLeft moves to previous menubar item (wrap)
- [ ] ArrowDown opens submenu, focuses first item
- [ ] ArrowUp opens submenu, focuses last item
- [ ] Enter/Space opens submenu
- [ ] Tab/Shift+Tab moves out, closes all menus
- [ ] Checkbox toggle does not close menu
- [ ] Radio selection does not close menu
- [ ] Only one radio in group can be checked

### High Priority: Focus Management

- [ ] First menubar item has tabIndex="0"
- [ ] Other items have tabIndex="-1"
- [ ] Separator is not focusable
- [ ] Disabled items are focusable but not activatable

### High Priority: Click Behavior

- [ ] Click menubar item opens/closes menu
- [ ] Hover switches menu when open
- [ ] Click outside closes menu

### Medium Priority: Accessibility

- [ ] No axe-core violations

## Implementation Notes


Structure:

┌─────────────────────────────────────────────────────────────┐
│ <ul role="menubar" aria-label="Application">                │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐    │
│ │ <li       │ │ <li       │ │ <li       │ │ <li       │    │
│ │  role=    │ │  role=    │ │  role=    │ │  role=    │    │
│ │  none>    │ │  none>    │ │  none>    │ │  none>    │    │
│ │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │ │ ┌───────┐ │    │
│ │ │menuitem│ │ │ │menuitem│ │ │ │menuitem│ │ │ │menuitem│ │   │
│ │ │"File" │ │ │ │"Edit" │ │ │ │"View" │ │ │ │"Help" │ │    │
│ │ │tabindex│ │ │ │tabindex│ │ │ │tabindex│ │ │ │       │ │    │
│ │ │=0      │ │ │ │=-1     │ │ │ │=-1     │ │ │ │       │ │    │
│ │ │aria-   │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │haspopup│ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │="menu" │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │aria-   │ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ │expanded│ │ │ │        │ │ │ │        │ │ │ │       │ │    │
│ │ └───┬───┘ │ │ └────────┘ │ │ └────────┘ │ │ └───────┘ │    │
│ └─────┼─────┘ └───────────┘ └───────────┘ └───────────┘    │
│       ▼                                                      │
│ ┌─────────────────────────────┐                              │
│ │ <ul role="menu"             │                              │
│ │  aria-labelledby="file-btn">│  ← References parent        │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <span role="menuitem"> │ │                              │
│ │ │   New                   │ │                              │
│ │ └─────────────────────────┘ │                              │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <hr role="separator">  │ │                              │
│ │ └─────────────────────────┘ │                              │
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <li role="none">        │ │                              │
│ │ │  <span role=            │ │                              │
│ │ │   "menuitemcheckbox"    │ │                              │
│ │ │   aria-checked="true">  │ │                              │
│ │ │   Auto Save             │ │                              │
│ │ └─────────────────────────┘ │                              │
│ └─────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘

Critical Implementation Points:
1. All <li> must have role="none" to hide list semantics
2. aria-haspopup="menu" - use explicit "menu", not true
3. Submenu aria-labelledby - must reference parent menuitem ID
4. Checkbox/radio activation keeps menu open - unlike regular menuitem
5. Hover menu switching - only when a menu is already open
6. Context-dependent ←/→ - behavior differs in menubar vs menu vs submenu


## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Menubar horizontal navigation
it('ArrowRight moves to next menubar item', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const fileItem = screen.getByRole('menuitem', { name: 'File' });
  fileItem.focus();

  await user.keyboard('{ArrowRight}');

  expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
});

// Open submenu
it('ArrowDown opens submenu and focuses first item', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const fileItem = screen.getByRole('menuitem', { name: 'File' });
  fileItem.focus();

  await user.keyboard('{ArrowDown}');

  expect(fileItem).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
});

// Checkbox toggle keeps menu open
it('checkbox toggle does not close menu', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  const viewItem = screen.getByRole('menuitem', { name: 'View' });
  await user.click(viewItem);

  const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
  checkbox.focus();

  await user.keyboard('{Space}');

  // Menu should still be open
  expect(viewItem).toHaveAttribute('aria-expanded', 'true');
  expect(checkbox).toHaveAttribute('aria-checked', 'true');
});

// li elements have role="none"
it('all li elements have role="none"', () => {
  render(<Menubar items={menuItems} aria-label="Application" />);

  const listItems = document.querySelectorAll('li');
  listItems.forEach(li => {
    expect(li).toHaveAttribute('role', 'none');
  });
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('patterns/menubar/react/demo/');
  await page.waitForLoadState('networkidle');
});

// ARIA structure test
test('has correct ARIA structure', async ({ page }) => {
  const menubar = page.getByRole('menubar');
  await expect(menubar).toBeVisible();

  // Check aria-haspopup="menu" (not "true")
  const fileItem = page.getByRole('menuitem', { name: 'File' });
  const haspopup = await fileItem.getAttribute('aria-haspopup');
  expect(haspopup).toBe('menu');

  // Check all li elements have role="none"
  const listItems = page.locator('li');
  const count = await listItems.count();
  for (let i = 0; i < count; i++) {
    await expect(listItems.nth(i)).toHaveAttribute('role', 'none');
  }
});

// Keyboard navigation test
test('ArrowDown opens submenu and focuses first item', async ({ page }) => {
  const fileItem = page.getByRole('menuitem', { name: 'File' });
  await fileItem.focus();
  await page.keyboard.press('ArrowDown');

  await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

  const menu = page.getByRole('menu');
  const firstMenuItem = menu.getByRole('menuitem').first();
  await expect(firstMenuItem).toBeFocused();
});

// Checkbox/Radio behavior test
test('checkbox toggle keeps menu open', async ({ page }) => {
  const viewItem = page.getByRole('menuitem', { name: 'View' });
  await viewItem.click();

  const checkbox = page.getByRole('menuitemcheckbox').first();
  const initialChecked = await checkbox.getAttribute('aria-checked');
  await checkbox.focus();
  await page.keyboard.press('Space');

  // Menu should still be open
  await expect(viewItem).toHaveAttribute('aria-expanded', 'true');
  // aria-checked should have toggled
  const newChecked = await checkbox.getAttribute('aria-checked');
  expect(newChecked).not.toBe(initialChecked);
});
```
