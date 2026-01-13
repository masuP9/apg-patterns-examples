# Menu and Menubar Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/menubar/

## Overview

Menubar is a horizontal menu bar that provides application-style navigation. Each menubar item can open a dropdown menu or submenu. Unlike menu-button, menubar is always visible and supports hierarchical navigation, checkbox/radio items, and hover-based menu switching.

## Key Differences from Menu-Button

| Feature | Menu-Button | Menubar |
|---------|------------|---------|
| Top-level structure | `<button>` trigger | `<ul role="menubar">` (always visible) |
| Horizontal navigation | None | `←`/`→` between menubar items |
| Common use case | Single dropdown | Application menu with multiple dropdowns |
| `<li>` role | Not always specified | `role="none"` required for all `<li>` |
| Hover behavior | None | Auto-switch when menu open |

> Note: Both patterns support submenus, menuitemcheckbox, and menuitemradio. The key difference is that menubar provides a persistent horizontal navigation bar with arrow key navigation between top-level items.

## ARIA Requirements

### Roles

| Role | Element | Description |
|------|---------|-------------|
| `menubar` | Horizontal container (`<ul>`) | Top-level menu bar |
| `menu` | Vertical container (`<ul>`) | Dropdown/submenu |
| `menuitem` | Item (`<span>`) | Standard action item |
| `menuitemcheckbox` | Checkbox item | Toggleable option |
| `menuitemradio` | Radio item | Exclusive option in group |
| `separator` | Divider (`<hr>`) | Visual separator (not focusable) |
| `group` | Group container | Groups radio items with label |
| `none` | `<li>` elements | Hides list semantics from SR |

### Properties

| Attribute | Element | Values | Required | Notes |
|-----------|---------|--------|----------|-------|
| `aria-haspopup` | menuitem with submenu | `"menu"` | Yes* | Use `"menu"` explicitly, not `true` |
| `aria-labelledby` | menu/menubar | ID ref | Yes** | Accessible name |
| `aria-labelledby` | submenu | Parent menuitem ID | Yes** | Submenu references parent |
| `aria-label` | menu/menubar | String | Yes** | Alternative to labelledby |
| `role="none"` | all `<li>` | - | Yes | Hide list semantics |

> \* Only for menuitem with submenu
> \** Either `aria-labelledby` or `aria-label` required

### States

| Attribute | Element | Values | Required | Change Trigger |
|-----------|---------|--------|----------|----------------|
| `aria-expanded` | menuitem with submenu | `true`/`false` | Yes* | Submenu open/close |
| `aria-checked` | menuitemcheckbox | `true`/`false` | Yes | Toggle |
| `aria-checked` | menuitemradio | `true`/`false` | Yes | Selection |
| `aria-disabled` | any menuitem | `true` | No | Disabled state |
| `aria-hidden` | menu/submenu | `true`/`false` | Yes | Hide from AT when closed |

## Keyboard Support

### Menubar Focused

| Key | Action |
|-----|--------|
| `Enter` / `Space` | Open submenu, focus first item. If no submenu, activate |
| `ArrowRight` | Move to next menubar item (wrap) |
| `ArrowLeft` | Move to previous menubar item (wrap) |
| `ArrowDown` | Open submenu, focus first item |
| `ArrowUp` | Open submenu, focus last item |
| `Home` | Focus first menubar item |
| `End` | Focus last menubar item |
| `Escape` | Close menu if open |
| `Tab` / `Shift+Tab` | Move focus out, close all menus |
| Character | Type-ahead (skip separator/disabled). Reset after 500ms |

### Menu/Submenu Focused

| Key | Action |
|-----|--------|
| `Enter` / `Space` | **menuitem**: Activate, close menu. **submenu holder**: Open submenu. **checkbox/radio**: Toggle, **keep menu open** |
| `ArrowDown` | Move to next item (wrap) |
| `ArrowUp` | Move to previous item (wrap) |
| `ArrowRight` | **Has submenu**: Open, focus first. **In menubar's dropdown**: Close current, open next menubar item's menu |
| `ArrowLeft` | **In submenu**: Close, return to parent. **In menubar's dropdown**: Close, open previous menubar item's menu |
| `Home` | Focus first item |
| `End` | Focus last item |
| `Escape` | Close menu, focus parent (menubar item or parent menuitem) |
| `Tab` | Close all menus, move focus out |
| Character | Type-ahead (skip separator/disabled). Reset after 500ms |

## Focus Management

- **Roving tabindex**: Only one item has `tabIndex="0"`, others `tabIndex="-1"`
- **Initial focus**: First menubar item has `tabIndex="0"`
- **Menu open**: Focus first enabled item
- **Menu close**: Return focus to invoker (menubar item or parent menuitem)
- **Disabled items**: Focusable but not activatable (APG recommendation)
- **Separator**: Not focusable

## Test Checklist

### High Priority: ARIA Attributes

- [ ] Container has `role="menubar"`
- [ ] Dropdown has `role="menu"`
- [ ] Items have correct role (`menuitem`/`menuitemcheckbox`/`menuitemradio`)
- [ ] Separator has `role="separator"`
- [ ] Radio group has `role="group"` with `aria-label`
- [ ] All `<li>` have `role="none"`
- [ ] Submenu holder has `aria-haspopup="menu"` (not `true`)
- [ ] Submenu holder has `aria-expanded`
- [ ] Submenu has `aria-labelledby` referencing parent menuitem
- [ ] Checkbox/radio has `aria-checked`
- [ ] Closed menu has `aria-hidden="true"`, open menu has `aria-hidden="false"`

### High Priority: Keyboard - Menubar

- [ ] `ArrowRight` moves to next item (wrap)
- [ ] `ArrowLeft` moves to previous item (wrap)
- [ ] `ArrowDown` opens submenu, focuses first item
- [ ] `ArrowUp` opens submenu, focuses last item
- [ ] `Enter`/`Space` opens submenu
- [ ] `Home` moves to first item
- [ ] `End` moves to last item
- [ ] `Tab`/`Shift+Tab` moves out, closes all menus

### High Priority: Keyboard - Menu

- [ ] `ArrowDown` moves to next item (wrap)
- [ ] `ArrowUp` moves to previous item (wrap)
- [ ] `ArrowRight` opens submenu (if present)
- [ ] `ArrowRight` moves to next menubar item (in top-level menu)
- [ ] `ArrowLeft` closes submenu, returns to parent
- [ ] `ArrowLeft` moves to previous menubar item (in top-level menu)
- [ ] `Enter`/`Space` activates menuitem, closes menu
- [ ] `Escape` closes menu, returns focus to parent
- [ ] `Home`/`End` moves to first/last item

### High Priority: Checkbox/Radio

- [ ] `Space`/`Enter` toggles checkbox
- [ ] Checkbox toggle does **not** close menu
- [ ] `aria-checked` updates on toggle
- [ ] `Space`/`Enter` selects radio
- [ ] Radio selection does **not** close menu
- [ ] Only one radio in group can be checked
- [ ] Selecting radio unchecks others in group

### High Priority: Focus Management

- [ ] First menubar item has `tabIndex="0"`
- [ ] Other items have `tabIndex="-1"`
- [ ] Separator is not focusable
- [ ] Disabled items are focusable but not activatable

### High Priority: Type-Ahead

- [ ] Character focuses matching item
- [ ] Search wraps around
- [ ] Skips separator
- [ ] Skips disabled items
- [ ] Resets after 500ms

### High Priority: Pointer Interaction

- [ ] Click menubar item opens/closes menu
- [ ] Hover on another menubar item switches menu (when open)
- [ ] Click menuitem activates and closes menu
- [ ] Click outside closes menu

### Medium Priority: Accessibility

- [ ] No axe-core violations
- [ ] No violations with menu open
- [ ] No violations with submenu open

## Implementation Notes

```
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
│ │ ┌─────────────────────────┐ │                              │
│ │ │ <ul role="group"        │ │                              │
│ │ │  aria-label="Theme">    │ │                              │
│ │ │  <li role="none">       │ │                              │
│ │ │   <span role=           │ │                              │
│ │ │    "menuitemradio"      │ │                              │
│ │ │    aria-checked="true"> │ │                              │
│ │ │    Light                │ │                              │
│ │ │  </li>                  │ │                              │
│ │ │  <li role="none">       │ │                              │
│ │ │   <span role=           │ │                              │
│ │ │    "menuitemradio"      │ │                              │
│ │ │    aria-checked="false">│ │                              │
│ │ │    Dark                 │ │                              │
│ │ │  </li>                  │ │                              │
│ │ └─────────────────────────┘ │                              │
│ └─────────────────────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

### Critical Implementation Points

1. **All `<li>` must have `role="none"`** to hide list semantics
2. **`aria-haspopup="menu"`** - use explicit `"menu"`, not `true`
3. **Submenu `aria-labelledby`** - must reference parent menuitem ID
4. **Checkbox/radio activation keeps menu open** - unlike regular menuitem
5. **Hover menu switching** - only when a menu is already open
6. **Context-dependent `←`/`→`** - behavior differs in menubar vs menu vs submenu

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

  // Open menu and navigate to checkbox
  const viewItem = screen.getByRole('menuitem', { name: 'View' });
  await user.click(viewItem);

  const checkbox = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
  checkbox.focus();

  await user.keyboard('{Space}');

  // Menu should still be open
  expect(viewItem).toHaveAttribute('aria-expanded', 'true');
  expect(checkbox).toHaveAttribute('aria-checked', 'true');
});

// Radio group exclusive selection
it('only one radio in group can be checked', async () => {
  const user = userEvent.setup();
  render(<Menubar items={menuItems} aria-label="Application" />);

  // Open menu
  await user.click(screen.getByRole('menuitem', { name: 'View' }));

  const lightRadio = screen.getByRole('menuitemradio', { name: 'Light' });
  const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });

  expect(lightRadio).toHaveAttribute('aria-checked', 'true');
  expect(darkRadio).toHaveAttribute('aria-checked', 'false');

  await user.click(darkRadio);

  expect(lightRadio).toHaveAttribute('aria-checked', 'false');
  expect(darkRadio).toHaveAttribute('aria-checked', 'true');
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
