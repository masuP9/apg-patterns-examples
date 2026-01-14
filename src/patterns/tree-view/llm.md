# Tree View Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/

## Overview

A tree view presents a hierarchical list where items with children can be expanded or collapsed. Common uses include file browsers, navigation menus, and organizational charts.

## ARIA Requirements

### Roles

| Role | Element | Description |
|------|---------|-------------|
| `tree` | Container `<ul>` | The tree widget container |
| `treeitem` | Each node `<li>` | Individual tree nodes |
| `group` | Child container `<ul>` | Container for child nodes of an expanded parent |

### Properties

| Attribute | Element | Values | Required | Notes |
|-----------|---------|--------|----------|-------|
| `aria-label` | tree | String | Yes* | Accessible name for the tree |
| `aria-labelledby` | tree | ID reference | Yes* | Alternative to aria-label |
| `aria-multiselectable` | tree | `true` | No | Only for multi-select mode |

> *Either `aria-label` or `aria-labelledby` is required (aria-labelledby takes precedence)

### States

| Attribute | Element | Values | Required | Change Trigger |
|-----------|---------|--------|----------|----------------|
| `aria-expanded` | treeitem (parent only) | `true` \| `false` | Yes* | Click, ArrowRight/ArrowLeft |
| `aria-selected` | treeitem (all) | `true` \| `false` | Yes** | Click, Space, Arrow (single-select) |
| `aria-disabled` | treeitem | `true` | No | When node is disabled |
| `tabindex` | treeitem | `0` \| `-1` | Yes | Focus movement |

> *Required on nodes with children. Leaf nodes MUST NOT have aria-expanded.
> **When selection is enabled, ALL treeitems must have aria-selected (true or false).

## Keyboard Support

| Key | Action |
|-----|--------|
| `↓` | Move focus to next visible node |
| `↑` | Move focus to previous visible node |
| `→` | Closed parent: expand / Open parent: move to first child / Leaf: no action |
| `←` | Open parent: collapse / Child or closed parent: move to parent / Root: no action |
| `Home` | Move focus to first node |
| `End` | Move focus to last visible node |
| `Enter` | Select and activate node (see Selection Models below). Does NOT toggle expansion. |
| `Space` | Single-select: Select and activate. Multi-select: Toggle selection. |
| `*` | Expand all siblings at current level |
| Type character | Move focus to next visible node starting with that character |

### Multi-Select Extended Keys

| Key | Action |
|-----|--------|
| `Ctrl+Space` | Toggle selection without updating anchor (see note below) |
| `Shift+↓` | Extend selection to next node |
| `Shift+↑` | Extend selection to previous node |
| `Shift+Home` | Extend selection to first node |
| `Shift+End` | Extend selection to last visible node |
| `Ctrl+A` | Select all visible nodes |

> **Ctrl+Space vs Space**: Both toggle selection. The difference is `Space` updates the selection anchor (used by `Shift+Arrow` range selection), while `Ctrl+Space` preserves the existing anchor. This allows toggling individual items without affecting subsequent range selection operations.

> Note: Enter does NOT toggle expansion. Use ArrowRight/ArrowLeft for expand/collapse.

## Selection Models

### Single-Select (default)

**Explicit Selection (this implementation)**
- Arrow keys move focus only (selection does NOT follow focus)
- `Enter` or `Space` selects the focused node AND fires `onActivate` callback
- `Click` selects the node AND fires `onActivate` callback
- Only one node selected at a time
- All treeitems have `aria-selected`: selected=`true`, others=`false`

> Note: This follows the APG pattern where Enter/Space "perform the default action, which is to select the node".

### Multi-Select

- Tree has `aria-multiselectable="true"`
- Focus and selection are independent
- All treeitems have `aria-selected` (true or false)
- `Space` toggles selection of focused node
- `Ctrl+Space`: Toggle selection without moving focus
- `Shift+Arrow`: Extend selection range from anchor
- `Shift+Home/End`: Extend selection to first/last visible node
- `Ctrl+A`: Select all visible nodes

## Focus Management (Roving Tabindex)

- Only one node has `tabindex="0"` (the focused node)
- All other nodes have `tabindex="-1"`
- Tree is a single Tab stop (Tab enters tree, Shift+Tab exits)
- Focus moves only among visible nodes (collapsed children are skipped)
- When parent is collapsed while child has focus, focus moves to parent

### Disabled Nodes

- Have `aria-disabled="true"`
- Are focusable (included in keyboard navigation)
- Cannot be selected or activated
- Cannot be expanded/collapsed if parent
- Visually distinct (e.g., grayed out)

## Test Checklist

### High Priority: ARIA

- [ ] Container has `role="tree"`
- [ ] Nodes have `role="treeitem"`
- [ ] Child containers have `role="group"`
- [ ] Parent nodes have `aria-expanded` (true or false)
- [ ] Leaf nodes do NOT have `aria-expanded`
- [ ] `aria-expanded` updates on expand/collapse
- [ ] All treeitems have `aria-selected` (true or false) when selection enabled
- [ ] Selected nodes have `aria-selected="true"`, others have `aria-selected="false"`
- [ ] Multi-select tree has `aria-multiselectable="true"`
- [ ] Tree has accessible name via `aria-label` or `aria-labelledby`
- [ ] `aria-labelledby` takes precedence over `aria-label`
- [ ] Disabled nodes have `aria-disabled="true"`

### High Priority: Keyboard

- [ ] ArrowDown moves to next visible node
- [ ] ArrowUp moves to previous visible node
- [ ] ArrowRight on closed parent expands it
- [ ] ArrowRight on open parent moves to first child
- [ ] ArrowRight on leaf does nothing
- [ ] ArrowLeft on open parent collapses it
- [ ] ArrowLeft on child/closed parent moves to parent
- [ ] ArrowLeft on root does nothing
- [ ] Home moves to first node
- [ ] End moves to last visible node
- [ ] Enter activates node (does NOT toggle expansion)
- [ ] * expands all siblings at current level
- [ ] Type-ahead focuses matching visible node
- [ ] Type-ahead cycles through matches on repeated character

### High Priority: Keyboard (Selection)

- [ ] Single-select: Arrow keys move focus only (no selection change)
- [ ] Single-select: Enter selects focused node and fires onActivate
- [ ] Single-select: Space selects focused node and fires onActivate
- [ ] Single-select: Click selects node and fires onActivate
- [ ] Multi-select: Enter toggles selection and fires onActivate
- [ ] Multi-select: Space toggles selection
- [ ] Multi-select: Ctrl+Space toggles without updating anchor
- [ ] Multi-select: Shift+Arrow extends selection range
- [ ] Multi-select: Shift+Home extends selection to first
- [ ] Multi-select: Shift+End extends selection to last visible
- [ ] Multi-select: Ctrl+A selects all visible nodes

### High Priority: Focus Management

- [ ] Tree is single Tab stop (Tab/Shift+Tab)
- [ ] Focused node has `tabindex="0"`
- [ ] Other nodes have `tabindex="-1"`
- [ ] Collapsed children are skipped during navigation
- [ ] Focus moves to parent when child's parent is collapsed
- [ ] Disabled nodes are focusable
- [ ] Disabled nodes cannot be selected
- [ ] Disabled parent nodes cannot be expanded/collapsed

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Type-ahead only searches visible nodes
- [ ] Type-ahead resets after timeout (default 500ms)
- [ ] Disabled nodes are visually distinct

## Implementation Notes

```
Structure:
┌─────────────────────────────────────────────────────┐
│ <ul role="tree" aria-label="File Explorer">        │
│ ├─ <li role="treeitem" aria-expanded="true">       │
│ │     📁 Documents                                  │
│ │  └─ <ul role="group">                            │
│ │     ├─ <li role="treeitem"> 📄 report.pdf </li>  │
│ │     └─ <li role="treeitem"> 📄 notes.txt </li>   │
│ │     </ul>                                        │
│ │  </li>                                           │
│ ├─ <li role="treeitem" aria-expanded="false">      │
│ │     📁 Images (collapsed)                        │
│ │  </li>                                           │
│ └─ <li role="treeitem"> 📄 readme.md </li>         │
│    (no aria-expanded - leaf node)                  │
└─────────────────────────────────────────────────────┘

Key Points:
- aria-expanded ONLY on parent nodes (not leaves)
- role="group" wraps children of expanded parents
- Leaf nodes have no aria-expanded attribute
- tabindex="0" on focused node, "-1" on others
```

## Props Design (React)

```typescript
interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  disabled?: boolean;
}

interface TreeViewProps {
  // Data
  nodes: TreeNode[];

  // Selection (uncontrolled)
  defaultSelectedIds?: string[];
  // Selection (controlled)
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;

  // Expansion (uncontrolled)
  defaultExpandedIds?: string[];
  // Expansion (controlled)
  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;

  // Behavior
  multiselectable?: boolean;
  onActivate?: (nodeId: string) => void;
  typeAheadTimeout?: number;

  // Accessibility
  'aria-label'?: string;
  'aria-labelledby'?: string;

  // Styling
  className?: string;
}
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const nodes = [
  {
    id: 'docs',
    label: 'Documents',
    children: [
      { id: 'report', label: 'report.pdf' },
      { id: 'notes', label: 'notes.txt' },
    ],
  },
  { id: 'readme', label: 'readme.md' },
];

// ARIA role test
it('has correct roles', () => {
  render(<TreeView nodes={nodes} aria-label="Files" />);

  expect(screen.getByRole('tree')).toBeInTheDocument();
  expect(screen.getAllByRole('treeitem')).toHaveLength(4);
  expect(screen.getByRole('group')).toBeInTheDocument();
});

// Expand/collapse with arrow keys
it('ArrowRight expands closed parent', async () => {
  const user = userEvent.setup();
  render(<TreeView nodes={nodes} aria-label="Files" />);

  const parent = screen.getByRole('treeitem', { name: 'Documents' });
  parent.focus();

  expect(parent).toHaveAttribute('aria-expanded', 'false');
  await user.keyboard('{ArrowRight}');
  expect(parent).toHaveAttribute('aria-expanded', 'true');
});

// Navigation
it('ArrowDown moves to next visible node', async () => {
  const user = userEvent.setup();
  render(<TreeView nodes={nodes} aria-label="Files" defaultExpandedIds={['docs']} />);

  const docs = screen.getByRole('treeitem', { name: 'Documents' });
  docs.focus();

  await user.keyboard('{ArrowDown}');
  expect(screen.getByRole('treeitem', { name: 'report.pdf' })).toHaveFocus();
});

// Focus moves to parent when collapsed
it('moves focus to parent when parent is collapsed', async () => {
  const user = userEvent.setup();
  render(<TreeView nodes={nodes} aria-label="Files" defaultExpandedIds={['docs']} />);

  const child = screen.getByRole('treeitem', { name: 'report.pdf' });
  child.focus();

  await user.keyboard('{ArrowLeft}'); // Move to parent
  await user.keyboard('{ArrowLeft}'); // Collapse parent

  expect(screen.getByRole('treeitem', { name: 'Documents' })).toHaveFocus();
});

// Multi-select
it('Space toggles selection in multi-select', async () => {
  const user = userEvent.setup();
  render(<TreeView nodes={nodes} aria-label="Files" multiselectable />);

  const node = screen.getByRole('treeitem', { name: 'readme.md' });
  node.focus();

  expect(node).toHaveAttribute('aria-selected', 'false');
  await user.keyboard(' ');
  expect(node).toHaveAttribute('aria-selected', 'true');
  await user.keyboard(' ');
  expect(node).toHaveAttribute('aria-selected', 'false');
});

// Single-select: Enter selects and activates
it('Enter selects node and fires onActivate in single-select', async () => {
  const user = userEvent.setup();
  const handleActivate = vi.fn();
  render(<TreeView nodes={nodes} aria-label="Files" onActivate={handleActivate} />);

  const node = screen.getByRole('treeitem', { name: 'readme.md' });
  node.focus();

  await user.keyboard('{Enter}');
  expect(node).toHaveAttribute('aria-selected', 'true');
  expect(handleActivate).toHaveBeenCalledWith('readme');
});

// Single-select: Click selects and activates
it('Click selects node and fires onActivate', async () => {
  const user = userEvent.setup();
  const handleActivate = vi.fn();
  render(<TreeView nodes={nodes} aria-label="Files" onActivate={handleActivate} />);

  const node = screen.getByRole('treeitem', { name: 'readme.md' });
  await user.click(node);

  expect(node).toHaveAttribute('aria-selected', 'true');
  expect(handleActivate).toHaveBeenCalledWith('readme');
});

// Arrow keys move focus without changing selection
it('Arrow keys move focus only in single-select', async () => {
  const user = userEvent.setup();
  render(
    <TreeView
      nodes={nodes}
      aria-label="Files"
      defaultExpandedIds={['docs']}
      defaultSelectedIds={['docs']}
    />
  );

  const docs = screen.getByRole('treeitem', { name: 'Documents' });
  docs.focus();

  expect(docs).toHaveAttribute('aria-selected', 'true');

  await user.keyboard('{ArrowDown}');
  const report = screen.getByRole('treeitem', { name: 'report.pdf' });

  // Focus moved but selection did not follow
  expect(report).toHaveFocus();
  expect(report).toHaveAttribute('aria-selected', 'false');
  expect(docs).toHaveAttribute('aria-selected', 'true');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Helper to click and wait for focus (handles async focus in React)
const clickAndWaitForFocus = async (
  element: import('@playwright/test').Locator,
  page: import('@playwright/test').Page
) => {
  // Click at the top-left area to hit the label, not children
  await element.click({ position: { x: 10, y: 10 } });
  await expect
    .poll(async () => {
      return await element.evaluate((el) => document.activeElement === el);
    }, { timeout: 5000 })
    .toBe(true);
};

test.describe('Tree View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('patterns/tree-view/react/demo/');
    await page.getByRole('tree').first().waitFor();
  });

  // ARIA Structure
  test('has correct ARIA structure', async ({ page }) => {
    const tree = page.getByRole('tree').first();
    await expect(tree).toBeVisible();
    await expect(tree).toHaveAttribute('aria-label', /.+/);

    const items = tree.getByRole('treeitem');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);

    // Parent nodes have aria-expanded
    const parentItems = tree.locator('[role="treeitem"][aria-expanded]');
    expect(await parentItems.count()).toBeGreaterThan(0);

    // Groups exist for expanded parents
    const groups = page.getByRole('group');
    expect(await groups.count()).toBeGreaterThan(0);
  });

  // Keyboard Navigation
  test('ArrowDown moves to next visible node', async ({ page }) => {
    const tree = page.getByRole('tree').first();
    const items = tree.getByRole('treeitem');
    const firstItem = items.first();

    await clickAndWaitForFocus(firstItem, page);
    await page.keyboard.press('ArrowDown');

    const secondItem = items.nth(1);
    await expect(secondItem).toBeFocused();
  });

  // Expand/Collapse
  test('ArrowRight expands closed parent', async ({ page }) => {
    const tree = page.getByRole('tree').first();
    const parent = tree.locator('[role="treeitem"][aria-expanded]').first();
    const labelledby = await parent.getAttribute('aria-labelledby');
    const stableLocator = tree.locator(`[role="treeitem"][aria-labelledby="${labelledby}"]`);

    // Focus first item and navigate to parent
    const firstItem = tree.getByRole('treeitem').first();
    await clickAndWaitForFocus(firstItem, page);
    await page.keyboard.press('Home');

    // Ensure collapsed, then expand
    const expanded = await stableLocator.getAttribute('aria-expanded');
    if (expanded === 'true') {
      await page.keyboard.press('ArrowLeft');
    }
    await page.keyboard.press('ArrowRight');
    await expect(stableLocator).toHaveAttribute('aria-expanded', 'true');
  });

  // Selection
  test('Space selects focused node', async ({ page }) => {
    const tree = page.getByRole('tree').first();
    const items = tree.getByRole('treeitem');
    const firstItem = items.first();

    await clickAndWaitForFocus(firstItem, page);
    await page.keyboard.press('ArrowDown');

    const secondItem = items.nth(1);
    await page.keyboard.press('Space');
    await expect(secondItem).toHaveAttribute('aria-selected', 'true');
  });

  // Focus Management
  test('focused node has tabindex="0"', async ({ page }) => {
    const tree = page.getByRole('tree').first();
    const items = tree.getByRole('treeitem');
    const firstItem = items.first();

    await clickAndWaitForFocus(firstItem, page);
    await expect(firstItem).toHaveAttribute('tabindex', '0');

    const secondItem = items.nth(1);
    await expect(secondItem).toHaveAttribute('tabindex', '-1');
  });

  // Multi-select
  test('Shift+Arrow extends selection in multi-select', async ({ page }) => {
    const trees = page.getByRole('tree');
    const count = await trees.count();

    for (let i = 0; i < count; i++) {
      const tree = trees.nth(i);
      if (await tree.getAttribute('aria-multiselectable') === 'true') {
        const items = tree.getByRole('treeitem');
        const firstItem = items.first();

        await clickAndWaitForFocus(firstItem, page);
        await expect(firstItem).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('Shift+ArrowDown');
        const secondItem = items.nth(1);
        await expect(secondItem).toHaveAttribute('aria-selected', 'true');
        await expect(firstItem).toHaveAttribute('aria-selected', 'true');
        break;
      }
    }
  });

  // Accessibility
  test('has no axe-core violations', async ({ page }) => {
    const results = await new AxeBuilder({ page })
      .include('[role="tree"]')
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
```
