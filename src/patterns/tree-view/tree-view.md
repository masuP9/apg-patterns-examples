# Tree View Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

## Overview

A tree view presents a hierarchical list of nodes that can be expanded or collapsed. It supports single and multi-select modes, keyboard navigation, and type-ahead search.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `tree` | Container (<ul>) | The tree widget container |
| `treeitem` | Each node (<li>) | Individual tree nodes (both parent and leaf) |
| `group` | Child container (<ul>) | Container for child nodes of an expanded parent |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `role="tree"` | [object Object] | - | Yes | Identifies the container as a tree widget |
| `aria-label` | tree | String | Yes | Accessible name for the tree |
| `aria-labelledby` | tree | ID reference | Yes | Alternative to aria-label (takes precedence) |
| `aria-multiselectable` | tree | true | No | Only present for multi-select mode |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-expanded` | Parent treeitem | `true` \| `false` | Yes | Click, ArrowRight, ArrowLeft, Enter |
| `aria-selected` | All treeitems | `true` \| `false` | Yes | Click, Enter, Space, Arrow keys |
| `aria-disabled` | Disabled treeitem | true | No |  |

## Keyboard Support

### Navigation

| Key | Action |
| --- | --- |
| `ArrowDown` | Move focus to next visible node |
| `ArrowUp` | Move focus to previous visible node |
| `ArrowRight` | Closed parent: expand / Open parent: move to first child / Leaf: no action |
| `ArrowLeft` | Open parent: collapse / Child or closed parent: move to parent / Root: no action |
| `Home` | Move focus to first node |
| `End` | Move focus to last visible node |
| `Enter` | Select and activate node (see Selection section below) |
| `*` | Expand all siblings at current level |
| `[object Object]` | Move focus to next visible node starting with that character |

### Selection (Single-Select Mode)

| Key | Action |
| --- | --- |
| `ArrowDown / ArrowUp` | Move focus only (selection does NOT follow focus) |
| `Enter` | Select focused node and activate (fire onActivate callback) |
| `Space` | Select focused node and activate (fire onActivate callback) |
| `[object Object]` | Select clicked node and activate (fire onActivate callback) |

### Selection (Multi-Select Mode)

| Key | Action |
| --- | --- |
| `Space` | Toggle selection of focused node |
| `Ctrl + Space` | Toggle selection without moving focus |
| `Shift + ArrowDown / ArrowUp` | Extend selection range from anchor |
| `Shift + Home` | Extend selection to first node |
| `Shift + End` | Extend selection to last visible node |
| `Ctrl + A` | Select all visible nodes |

## Focus Management

- Roving tabindex: Only one node has <code>tabindex="0"</code> (the focused node)
- Other nodes: All other nodes have <code>tabindex="-1"</code>
- Single Tab stop: Tree is a single Tab stop (Tab enters tree, Shift+Tab exits)
- Visible nodes only: Focus moves only among visible nodes (collapsed children are skipped)
- Collapse behavior: When a parent is collapsed while a child has focus, focus moves to the parent

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="tree"
- [ ] Each node has role="treeitem"
- [ ] Child containers have role="group"
- [ ] Parent nodes have aria-expanded
- [ ] Leaf nodes do NOT have aria-expanded
- [ ] All treeitems have aria-selected
- [ ] Tree has accessible name (aria-label or aria-labelledby)

### High Priority: Keyboard

- [ ] ArrowDown/ArrowUp navigates visible nodes
- [ ] ArrowRight/ArrowLeft expand/collapse or navigate
- [ ] Home/End move to first/last visible node

### High Priority: Focus Management

- [ ] Roving tabindex implemented correctly
- [ ] Collapsed children are skipped in navigation

### High Priority: Behavior

- [ ] Single-select mode allows only one selection
- [ ] Multi-select mode supports range selection

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

## Structure

```html
<ul role="tree" aria-label="File explorer">
  <li role="treeitem" aria-expanded="true" aria-selected="false" tabindex="0">
    Documents
    <ul role="group">
      <li role="treeitem" aria-selected="false" tabindex="-1">
        Resume.pdf
      </li>
      <li role="treeitem" aria-expanded="false" aria-selected="false" tabindex="-1">
        Projects
        <ul role="group">
          <li role="treeitem" aria-selected="false" tabindex="-1">
            Project1.doc
          </li>
        </ul>
      </li>
    </ul>
  </li>
</ul>
```

## Key Implementation Points

1. **Roving Tabindex**: Only one treeitem has tabindex="0" at a time
2. **aria-expanded**: Only parent nodes have this attribute
3. **aria-selected**: All treeitems must have this when selection is supported
4. **role="group"**: Child containers use group role, not tree
5. **Visible Navigation**: Focus only moves among visible (not collapsed) nodes
6. **Collapse Focus**: When a parent is collapsed while child is focused, focus moves to parent

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has tree role', () => {
  render(<TreeView items={items} aria-label="Files" />);
  expect(screen.getByRole('tree')).toBeInTheDocument();
});

// Navigation
it('ArrowDown moves focus to next visible node', async () => {
  const user = userEvent.setup();
  render(<TreeView items={items} aria-label="Files" />);

  const treeItems = screen.getAllByRole('treeitem');
  treeItems[0].focus();
  await user.keyboard('{ArrowDown}');

  expect(treeItems[1]).toHaveFocus();
});

// Expand/Collapse
it('ArrowRight expands closed parent node', async () => {
  const user = userEvent.setup();
  render(<TreeView items={itemsWithChildren} aria-label="Files" />);

  const parent = screen.getByRole('treeitem', { name: /documents/i });
  expect(parent).toHaveAttribute('aria-expanded', 'false');

  parent.focus();
  await user.keyboard('{ArrowRight}');

  expect(parent).toHaveAttribute('aria-expanded', 'true');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');
  const tree = page.getByRole('tree');

  await expect(tree).toBeVisible();
  await expect(tree).toHaveAttribute('aria-label');
});

// Navigation
test('arrow keys navigate between visible nodes', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');
  const treeItems = page.getByRole('treeitem');

  await treeItems.first().click();
  await page.keyboard.press('ArrowDown');

  await expect(treeItems.nth(1)).toBeFocused();
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/tree-view/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="tree"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
