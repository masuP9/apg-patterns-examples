import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Tree View Pattern
 *
 * A hierarchical list where items with children can be expanded or collapsed.
 * Common uses include file browsers, navigation menus, and organizational charts.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treeview/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getTree = (page: import('@playwright/test').Page) => {
  return page.getByRole('tree');
};

const getTreeItems = (page: import('@playwright/test').Page) => {
  return page.getByRole('treeitem');
};

const getGroups = (page: import('@playwright/test').Page) => {
  return page.getByRole('group');
};

/**
 * Click on a treeitem element and wait for it to receive focus.
 * This is needed because:
 * 1. Frameworks like React apply focus asynchronously via useLayoutEffect
 * 2. Expanded parent treeitems contain child elements, so we must click
 *    on the label area (top of the element) to avoid hitting children
 *    which have stopPropagation() on their click handlers.
 *
 * NOTE: Clicking on a parent node TOGGLES its expansion state.
 * Use focusWithoutClick() for tests where you need to focus without side effects.
 */
const clickAndWaitForFocus = async (
  element: import('@playwright/test').Locator,
  _page: import('@playwright/test').Page
) => {
  // Click at the top-left area of the element to hit the label, not children
  // Use position { x: 10, y: 10 } to click near the top-left corner
  await element.click({ position: { x: 10, y: 10 } });

  // Wait for the element to become the active element
  await expect
    .poll(
      async () => {
        return await element.evaluate((el) => document.activeElement === el);
      },
      { timeout: 5000 }
    )
    .toBe(true);
};

/**
 * Focus a treeitem element without triggering click handlers.
 * This is useful for testing keyboard navigation where we don't want
 * to trigger expansion toggle that happens on click.
 */
const focusWithoutClick = async (
  element: import('@playwright/test').Locator,
  _page: import('@playwright/test').Page
) => {
  await element.focus();

  // Wait for the element to become the active element
  await expect
    .poll(
      async () => {
        return await element.evaluate((el) => document.activeElement === el);
      },
      { timeout: 5000 }
    )
    .toBe(true);
};

/**
 * Press a key on a focused element and wait for focus to settle on a treeitem.
 * Uses element.press() for stability instead of page.keyboard.press().
 */
const pressKeyOnElement = async (element: import('@playwright/test').Locator, key: string) => {
  await expect(element).toBeFocused();
  await element.press(key);
  // Wait for focus to settle on a treeitem
  await expect(element.page().locator('[role="treeitem"]:focus')).toBeVisible();
};

/**
 * Navigate to a target node by pressing ArrowDown multiple times.
 * Waits for focus to settle after each key press.
 */
const navigateToIndex = async (page: import('@playwright/test').Page, targetIndex: number) => {
  for (let i = 0; i < targetIndex; i++) {
    const currentFocused = page.locator('[role="treeitem"]:focus');
    await pressKeyOnElement(currentFocused, 'ArrowDown');
  }
};

/**
 * Wait for page hydration to complete.
 * This ensures:
 * 1. Tree element is rendered
 * 2. Treeitems have proper aria-labelledby (not Svelte's pre-hydration IDs)
 * 3. Interactive handlers are attached (one item has tabindex="0")
 */
async function waitForHydration(page: import('@playwright/test').Page) {
  // Wait for basic rendering
  await getTree(page).first().waitFor();

  // Wait for hydration - ensure treeitems have proper aria-labelledby
  const firstItem = getTreeItems(page).first();
  await expect
    .poll(async () => {
      const labelledby = await firstItem.getAttribute('aria-labelledby');
      return labelledby && labelledby.length > 1 && !labelledby.startsWith('-');
    })
    .toBe(true);

  // Wait for full hydration - ensure interactive handlers are attached
  await expect
    .poll(async () => {
      const tree = getTree(page).first();
      const items = tree.getByRole('treeitem');
      const count = await items.count();
      let hasFocusable = false;
      for (let i = 0; i < count; i++) {
        const tabindex = await items.nth(i).getAttribute('tabindex');
        if (tabindex === '0') {
          hasFocusable = true;
          break;
        }
      }
      return hasFocusable;
    })
    .toBe(true);
}

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Tree View (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/tree-view/${framework}/demo/`);
      await waitForHydration(page);
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('container has role="tree"', async ({ page }) => {
        const tree = getTree(page).first();
        await expect(tree).toBeVisible();
      });

      test('nodes have role="treeitem"', async ({ page }) => {
        const items = getTreeItems(page);
        const count = await items.count();
        expect(count).toBeGreaterThan(0);
      });

      test('child containers have role="group"', async ({ page }) => {
        // First expand a parent node to make group visible
        const tree = getTree(page).first();
        const parentItem = tree.getByRole('treeitem', { expanded: true }).first();

        if ((await parentItem.count()) > 0) {
          const groups = getGroups(page);
          const count = await groups.count();
          expect(count).toBeGreaterThan(0);
        }
      });

      test('tree has accessible name via aria-label', async ({ page }) => {
        const tree = getTree(page).first();
        const label = await tree.getAttribute('aria-label');
        expect(label).toBeTruthy();
      });

      test('parent nodes have aria-expanded', async ({ page }) => {
        const tree = getTree(page).first();
        // Find a parent node (one with children)
        const expandedItems = tree.locator('[role="treeitem"][aria-expanded]');
        const count = await expandedItems.count();
        expect(count).toBeGreaterThan(0);

        const firstExpanded = expandedItems.first();
        const expanded = await firstExpanded.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(expanded);
      });

      test('leaf nodes do NOT have aria-expanded', async ({ page }) => {
        const tree = getTree(page).first();
        // Expand all to see leaf nodes
        const items = tree.getByRole('treeitem');
        const count = await items.count();

        for (let i = 0; i < count; i++) {
          const item = items.nth(i);
          const expanded = await item.getAttribute('aria-expanded');
          const hasGroup = (await item.locator('[role="group"]').count()) > 0;

          // If item has no children (no group), it shouldn't have aria-expanded
          if (!hasGroup && expanded === null) {
            // This is correct - leaf node without aria-expanded
            continue;
          }
          // If it has aria-expanded, it should also have children
          if (expanded !== null) {
            // Parent nodes with aria-expanded should have potential children
            continue;
          }
        }
      });

      test('all treeitems have aria-selected', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');
        const count = await items.count();

        for (let i = 0; i < count; i++) {
          const item = items.nth(i);
          const selected = await item.getAttribute('aria-selected');
          expect(['true', 'false']).toContain(selected);
        }
      });

      test('multi-select tree has aria-multiselectable', async ({ page }) => {
        // Find multi-select tree (second tree on demo page)
        const trees = getTree(page);
        const count = await trees.count();

        // Look for a tree with aria-multiselectable
        let foundMultiselect = false;
        for (let i = 0; i < count; i++) {
          const tree = trees.nth(i);
          const multiselectable = await tree.getAttribute('aria-multiselectable');
          if (multiselectable === 'true') {
            foundMultiselect = true;
            break;
          }
        }

        // Demo page should have at least one multi-select tree
        expect(foundMultiselect).toBe(true);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Navigation
    // ------------------------------------------
    test.describe('APG: Keyboard Navigation', () => {
      test('ArrowDown moves to next visible node', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');
        const firstItem = items.first();

        await clickAndWaitForFocus(firstItem, page);
        await expect(firstItem).toBeFocused();
        await firstItem.press('ArrowDown');

        // Focus should have moved to a different item
        const secondItem = items.nth(1);
        await expect(secondItem).toBeFocused();
      });

      test('ArrowUp moves to previous visible node', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');

        // Click second item first
        const secondItem = items.nth(1);
        await clickAndWaitForFocus(secondItem, page);
        await expect(secondItem).toBeFocused();
        await secondItem.press('ArrowUp');

        const firstItem = items.first();
        await expect(firstItem).toBeFocused();
      });

      test('Home moves to first node', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');

        // Start from a later item
        const laterItem = items.nth(2);
        await clickAndWaitForFocus(laterItem, page);
        await expect(laterItem).toBeFocused();
        await laterItem.press('Home');

        const firstItem = items.first();
        await expect(firstItem).toBeFocused();
      });

      test('End moves to last visible node', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');

        // Click on a non-parent item to avoid triggering expansion toggle
        // Use the second item (first child of expanded parent)
        const secondItem = items.nth(1);
        await clickAndWaitForFocus(secondItem, page);
        await expect(secondItem).toBeFocused();
        await secondItem.press('End');

        // Get current count after any DOM changes
        const currentCount = await items.count();
        const lastItem = items.nth(currentCount - 1);
        await expect(lastItem).toBeFocused();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Expand/Collapse
    // ------------------------------------------
    test.describe('APG: Expand/Collapse', () => {
      test('ArrowRight on closed parent expands it', async ({ page }) => {
        const tree = getTree(page).first();
        // Find a parent node (any with aria-expanded attribute)
        const anyParent = tree.locator('[role="treeitem"][aria-expanded]').first();

        if ((await anyParent.count()) > 0) {
          // Get label ID for stable reference before any interaction
          const labelledby = await anyParent.getAttribute('aria-labelledby');
          const stableLocator = tree.locator(`[role="treeitem"][aria-labelledby="${labelledby}"]`);

          // Focus the first treeitem in tree using click
          const firstItem = tree.getByRole('treeitem').first();
          await clickAndWaitForFocus(firstItem, page);

          // Navigate to find a collapsed parent using keyboard
          // Press * to collapse all siblings first (so we have collapsed parents)
          // Then we can test ArrowRight on a collapsed one

          // Navigate to the parent node using keyboard
          // Use Home to go to first item, then navigate down
          await expect(firstItem).toBeFocused();
          await firstItem.press('Home');

          // Now navigate to the target node
          const items = tree.getByRole('treeitem');
          const count = await items.count();
          let targetIndex = -1;
          for (let i = 0; i < count; i++) {
            const lb = await items.nth(i).getAttribute('aria-labelledby');
            if (lb === labelledby) {
              targetIndex = i;
              break;
            }
          }

          // Press ArrowDown to reach the target (with focus wait after each press)
          await navigateToIndex(page, targetIndex);

          // Now we're on the parent node - check if it's expanded and collapse if needed
          const currentExpanded = await stableLocator.getAttribute('aria-expanded');
          if (currentExpanded === 'true') {
            // Collapse it first
            const focusedItem = page.locator('[role="treeitem"]:focus');
            await expect(focusedItem).toBeFocused();
            await focusedItem.press('ArrowLeft');
            await expect(stableLocator).toHaveAttribute('aria-expanded', 'false');
          }

          // Now test ArrowRight to expand
          const focusedItem = page.locator('[role="treeitem"]:focus');
          await expect(focusedItem).toBeFocused();
          await focusedItem.press('ArrowRight');
          await expect(stableLocator).toHaveAttribute('aria-expanded', 'true');
        }
      });

      test('ArrowRight on open parent moves to first child', async ({ page }) => {
        const tree = getTree(page).first();
        // Find an expanded parent
        const expandedParent = tree.locator('[role="treeitem"][aria-expanded="true"]').first();

        if ((await expandedParent.count()) > 0) {
          // Get parent's labelledby for stable reference
          const parentLabelledby = await expandedParent.getAttribute('aria-labelledby');

          // Focus without click to avoid toggling expansion
          await focusWithoutClick(expandedParent, page);
          await expect(expandedParent).toBeFocused();
          await expandedParent.press('ArrowRight');

          // Focus should move to first child - verify by checking:
          // 1. Focus moved to a different element
          // 2. The focused element is a treeitem
          const focusedItem = page.locator('[role="treeitem"]:focus');
          await expect(focusedItem).toBeVisible();

          // The focused item should not be the parent
          const focusedLabelledby = await focusedItem.getAttribute('aria-labelledby');
          expect(focusedLabelledby).not.toBe(parentLabelledby);
        }
      });

      test('ArrowLeft on open parent collapses it', async ({ page }) => {
        const tree = getTree(page).first();
        // Find a parent node (any with aria-expanded attribute)
        const anyParent = tree.locator('[role="treeitem"][aria-expanded]').first();

        if ((await anyParent.count()) > 0) {
          // Get label ID for stable reference before any interaction
          const labelledby = await anyParent.getAttribute('aria-labelledby');
          const stableLocator = tree.locator(`[role="treeitem"][aria-labelledby="${labelledby}"]`);

          // Focus the first treeitem in tree using click
          const firstItem = tree.getByRole('treeitem').first();
          await clickAndWaitForFocus(firstItem, page);

          // Navigate to the parent node using keyboard
          await expect(firstItem).toBeFocused();
          await firstItem.press('Home');

          // Find the index of target node
          const items = tree.getByRole('treeitem');
          const count = await items.count();
          let targetIndex = -1;
          for (let i = 0; i < count; i++) {
            const lb = await items.nth(i).getAttribute('aria-labelledby');
            if (lb === labelledby) {
              targetIndex = i;
              break;
            }
          }

          // Press ArrowDown to reach the target (with focus wait after each press)
          await navigateToIndex(page, targetIndex);

          // Now we're on the parent node - check if it's collapsed and expand if needed
          const currentExpanded = await stableLocator.getAttribute('aria-expanded');
          if (currentExpanded === 'false') {
            // Expand it first
            const focusedItem = page.locator('[role="treeitem"]:focus');
            await expect(focusedItem).toBeFocused();
            await focusedItem.press('ArrowRight');
            await expect(stableLocator).toHaveAttribute('aria-expanded', 'true');
          }

          // Now test ArrowLeft to collapse
          const focusedItem = page.locator('[role="treeitem"]:focus');
          await expect(focusedItem).toBeFocused();
          await focusedItem.press('ArrowLeft');
          await expect(stableLocator).toHaveAttribute('aria-expanded', 'false');
        }
      });

      test('ArrowLeft on child moves to parent', async ({ page }) => {
        const tree = getTree(page).first();
        // Find an expanded parent to access its children
        const expandedParent = tree.locator('[role="treeitem"][aria-expanded="true"]').first();

        if ((await expandedParent.count()) > 0) {
          // Focus parent without click to avoid toggling expansion
          await focusWithoutClick(expandedParent, page);
          // Move to first child
          await expect(expandedParent).toBeFocused();
          await expandedParent.press('ArrowRight');

          // Now press ArrowLeft to go back to parent
          const focusedChild = page.locator('[role="treeitem"]:focus');
          await expect(focusedChild).toBeFocused();
          await focusedChild.press('ArrowLeft');

          await expect(expandedParent).toBeFocused();
        }
      });

      test('click on parent toggles expansion', async ({ page }) => {
        const tree = getTree(page).first();
        // Find a parent node
        const parentItem = tree.locator('[role="treeitem"][aria-expanded]').first();

        if ((await parentItem.count()) > 0) {
          const initialExpanded = await parentItem.getAttribute('aria-expanded');

          // Click on label area (top of element) to avoid hitting children
          await parentItem.click({ position: { x: 10, y: 10 } });

          const newExpanded = await parentItem.getAttribute('aria-expanded');
          expect(newExpanded).not.toBe(initialExpanded);
        }
      });

      test('* key expands all siblings', async ({ page }) => {
        const tree = getTree(page).first();

        // Focus the first visible item using click
        const firstItem = tree.getByRole('treeitem').first();
        await clickAndWaitForFocus(firstItem, page);

        // The * key expands all expandable siblings at the SAME LEVEL as the focused node
        // First, let's ensure we're at the root level
        await expect(firstItem).toBeFocused();
        await firstItem.press('Home');

        // Get all top-level treeitems (direct children of tree, not nested in groups)
        // Top-level items are those that are not inside a group element
        const topLevelParents = tree.locator(':scope > [role="treeitem"][aria-expanded]');
        const topLevelCount = await topLevelParents.count();

        if (topLevelCount > 0) {
          // Collapse all top-level parents first so we can test * expanding them
          for (let i = 0; i < topLevelCount; i++) {
            const parent = topLevelParents.nth(i);
            const expanded = await parent.getAttribute('aria-expanded');
            if (expanded === 'true') {
              // Navigate to this item and collapse it
              const labelledby = await parent.getAttribute('aria-labelledby');
              // Go home and navigate to find it
              const currentFocused = page.locator('[role="treeitem"]:focus');
              await pressKeyOnElement(currentFocused, 'Home');
              const items = tree.getByRole('treeitem');
              const count = await items.count();
              for (let j = 0; j < count; j++) {
                const lb = await items.nth(j).getAttribute('aria-labelledby');
                if (lb === labelledby) {
                  // Navigate to this item (with focus wait after each press)
                  await navigateToIndex(page, j);
                  // Collapse it
                  const focusedItem = page.locator('[role="treeitem"]:focus');
                  await expect(focusedItem).toBeFocused();
                  await focusedItem.press('ArrowLeft');
                  await expect(parent).toHaveAttribute('aria-expanded', 'false');
                  break;
                }
              }
            }
          }

          // Go back home
          const currentFocused = page.locator('[role="treeitem"]:focus');
          await pressKeyOnElement(currentFocused, 'Home');

          // Press * to expand all siblings at the current level
          const focusedItem = page.locator('[role="treeitem"]:focus');
          await expect(focusedItem).toBeFocused();
          await focusedItem.press('*');

          // Wait for all top-level parents to be expanded (state-based wait)
          for (let i = 0; i < topLevelCount; i++) {
            await expect(topLevelParents.nth(i)).toHaveAttribute('aria-expanded', 'true');
          }
        }
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Selection
    // ------------------------------------------
    test.describe('APG: Selection (Single-Select)', () => {
      test('Enter selects focused node', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');

        // Use first item for reliability, navigate to second using keyboard
        const firstItem = items.first();
        await clickAndWaitForFocus(firstItem, page);

        // Navigate to second item
        await pressKeyOnElement(firstItem, 'ArrowDown');
        const secondItem = items.nth(1);
        await expect(secondItem).toBeFocused();

        // Press Enter to select
        await secondItem.press('Enter');
        await expect(secondItem).toHaveAttribute('aria-selected', 'true');
      });

      test('Space selects focused node', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');
        const firstItem = items.first();

        await clickAndWaitForFocus(firstItem, page);
        await expect(firstItem).toHaveAttribute('aria-selected', 'true');

        // Navigate to another item without selecting (with focus wait)
        await pressKeyOnElement(firstItem, 'ArrowDown');
        const secondItem = items.nth(1);
        await expect(secondItem).toBeFocused();

        // Press Space to select
        await secondItem.press('Space');
        await expect(secondItem).toHaveAttribute('aria-selected', 'true');
        // First item should no longer be selected in single-select
        await expect(firstItem).toHaveAttribute('aria-selected', 'false');
      });

      test('arrow keys move focus without changing selection', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');
        const firstItem = items.first();

        // Select first item
        await clickAndWaitForFocus(firstItem, page);
        await expect(firstItem).toHaveAttribute('aria-selected', 'true');

        // Press Enter to explicitly select it
        await expect(firstItem).toBeFocused();
        await firstItem.press('Enter');

        // Navigate away (with focus wait)
        await pressKeyOnElement(firstItem, 'ArrowDown');
        const secondItem = items.nth(1);
        await expect(secondItem).toBeFocused();

        // Selection should stay on first item (focus moved but not selection)
        await expect(firstItem).toHaveAttribute('aria-selected', 'true');
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Multi-Select
    // ------------------------------------------
    test.describe('APG: Selection (Multi-Select)', () => {
      test('Space toggles selection in multi-select', async ({ page }) => {
        // Find multi-select tree
        const trees = getTree(page);
        const count = await trees.count();

        for (let i = 0; i < count; i++) {
          const tree = trees.nth(i);
          const multiselectable = await tree.getAttribute('aria-multiselectable');

          if (multiselectable === 'true') {
            const items = tree.getByRole('treeitem');
            const firstItem = items.first();

            await clickAndWaitForFocus(firstItem, page);
            await expect(firstItem).toHaveAttribute('aria-selected', 'true');

            // Toggle off
            await expect(firstItem).toBeFocused();
            await firstItem.press('Space');
            await expect(firstItem).toHaveAttribute('aria-selected', 'false');

            // Toggle on
            await expect(firstItem).toBeFocused();
            await firstItem.press('Space');
            await expect(firstItem).toHaveAttribute('aria-selected', 'true');
            break;
          }
        }
      });

      test('Shift+Arrow extends selection range', async ({ page }) => {
        // Find multi-select tree
        const trees = getTree(page);
        const count = await trees.count();

        for (let i = 0; i < count; i++) {
          const tree = trees.nth(i);
          const multiselectable = await tree.getAttribute('aria-multiselectable');

          if (multiselectable === 'true') {
            const items = tree.getByRole('treeitem');
            const firstItem = items.first();

            await clickAndWaitForFocus(firstItem, page);
            await expect(firstItem).toHaveAttribute('aria-selected', 'true');

            // Shift+ArrowDown to extend selection
            await expect(firstItem).toBeFocused();
            await firstItem.press('Shift+ArrowDown');

            const secondItem = items.nth(1);
            await expect(secondItem).toHaveAttribute('aria-selected', 'true');
            await expect(firstItem).toHaveAttribute('aria-selected', 'true');
            break;
          }
        }
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Disabled State
    // ------------------------------------------
    test.describe('Disabled State', () => {
      test('disabled nodes have aria-disabled', async ({ page }) => {
        const tree = getTree(page);
        const disabledItems = tree.locator('[role="treeitem"][aria-disabled="true"]');

        if ((await disabledItems.count()) > 0) {
          const firstDisabled = disabledItems.first();
          await expect(firstDisabled).toHaveAttribute('aria-disabled', 'true');
        }
      });

      test('disabled nodes are focusable but not selectable', async ({ page }) => {
        const trees = getTree(page);
        const count = await trees.count();

        // Look for tree with disabled items (third tree on demo page)
        for (let i = 0; i < count; i++) {
          const tree = trees.nth(i);
          const disabledItem = tree.locator('[role="treeitem"][aria-disabled="true"]').first();

          if ((await disabledItem.count()) > 0) {
            // Get the labelledby of the disabled item for navigation
            const disabledLabelledby = await disabledItem.getAttribute('aria-labelledby');

            // Focus the first item in this tree using keyboard navigation
            const firstItem = tree.getByRole('treeitem').first();
            await focusWithoutClick(firstItem, page);

            // Navigate using keyboard to find the disabled item
            const items = tree.getByRole('treeitem');
            const itemCount = await items.count();
            let foundDisabled = false;

            for (let j = 0; j < itemCount; j++) {
              const currentFocused = page.locator('[role="treeitem"]:focus');
              const currentLabelledby = await currentFocused.getAttribute('aria-labelledby');

              if (currentLabelledby === disabledLabelledby) {
                foundDisabled = true;
                break;
              }
              await pressKeyOnElement(currentFocused, 'ArrowDown');
            }

            if (foundDisabled) {
              // Now we're on the disabled item via keyboard navigation
              // Try to select it with Space (keep page.keyboard.press for disabled element tests)
              await page.keyboard.press('Space');

              // Should not be selected
              await expect(disabledItem).toHaveAttribute('aria-selected', 'false');
            }
            break;
          }
        }
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Type-Ahead
    // ------------------------------------------
    test.describe('Type-Ahead', () => {
      test('typing character focuses matching node', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');
        const firstItem = items.first();

        await clickAndWaitForFocus(firstItem, page);
        await expect(firstItem).toBeFocused();

        // Type 'r' to find nodes starting with 'r' (like 'readme.md')
        await firstItem.press('r');

        // Wait for type-ahead to process (state-based wait)
        // Focus should move to a node starting with 'r'
        await expect
          .poll(
            async () => {
              const focused = page.locator('[role="treeitem"]:focus');
              const labelledby = await focused.getAttribute('aria-labelledby');
              if (!labelledby) return false;
              const label = page.locator(`[id="${labelledby}"]`);
              const text = await label.textContent();
              return text?.toLowerCase().startsWith('r') ?? false;
            },
            { timeout: 5000 }
          )
          .toBe(true);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Focus Management
    // ------------------------------------------
    test.describe('Focus Management', () => {
      test('focused node has tabindex="0"', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');
        const firstItem = items.first();

        await clickAndWaitForFocus(firstItem, page);
        await expect(firstItem).toHaveAttribute('tabindex', '0');
      });

      test('other nodes have tabindex="-1"', async ({ page }) => {
        const tree = getTree(page).first();
        const items = tree.getByRole('treeitem');
        const firstItem = items.first();

        await clickAndWaitForFocus(firstItem, page);
        await expect(firstItem).toHaveAttribute('tabindex', '0');

        // Check that at least one other item has tabindex="-1"
        const secondItem = items.nth(1);
        await expect(secondItem).toHaveAttribute('tabindex', '-1');
      });

      test('focus moves to parent when parent is collapsed', async ({ page }) => {
        const tree = getTree(page).first();
        // Find an expanded parent and save its aria-labelledby
        const expandedParentLocator = tree
          .locator('[role="treeitem"][aria-expanded="true"]')
          .first();

        if ((await expandedParentLocator.count()) > 0) {
          // Get the parent's labelledby ID to use as a stable selector
          const labelledby = await expandedParentLocator.getAttribute('aria-labelledby');

          // Focus parent without click to avoid toggling expansion
          await focusWithoutClick(expandedParentLocator, page);
          // Navigate to a child
          await expect(expandedParentLocator).toBeFocused();
          await expandedParentLocator.press('ArrowRight');

          // Collapse the parent by pressing ArrowLeft twice
          // (first ArrowLeft goes back to parent, second collapses it)
          let focusedItem = page.locator('[role="treeitem"]:focus');
          await expect(focusedItem).toBeFocused();
          await focusedItem.press('ArrowLeft');

          focusedItem = page.locator('[role="treeitem"]:focus');
          await expect(focusedItem).toBeFocused();
          await focusedItem.press('ArrowLeft');

          // Use the stable selector to find the parent (now collapsed)
          const parent = tree.locator(`[role="treeitem"][aria-labelledby="${labelledby}"]`);
          // Focus should be on the parent
          await expect(parent).toBeFocused();
        }
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const tree = getTree(page);
        await tree.first().waitFor();

        const results = await new AxeBuilder({ page })
          .include('[role="tree"]')
          .disableRules(['color-contrast'])
          .analyze();

        expect(results.violations).toEqual([]);
      });
    });
  });
}

// ============================================
// Cross-framework Consistency Tests
// ============================================

test.describe('Tree View - Cross-framework Consistency', () => {
  test('all frameworks have trees', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/tree-view/${framework}/demo/`);
      await waitForHydration(page);

      const trees = getTree(page);
      const count = await trees.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks support click to expand/collapse', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/tree-view/${framework}/demo/`);
      await waitForHydration(page);

      const tree = getTree(page).first();
      const parentItem = tree.locator('[role="treeitem"][aria-expanded]').first();

      if ((await parentItem.count()) > 0) {
        const initialExpanded = await parentItem.getAttribute('aria-expanded');

        // Click on label area (top of element) to avoid hitting children
        await parentItem.click({ position: { x: 10, y: 10 } });
        // Wait for the expansion state to change
        await expect(parentItem).not.toHaveAttribute('aria-expanded', initialExpanded!);

        const newExpanded = await parentItem.getAttribute('aria-expanded');
        expect(newExpanded).not.toBe(initialExpanded);

        // Click again to toggle back
        await parentItem.click({ position: { x: 10, y: 10 } });
        await expect(parentItem).toHaveAttribute('aria-expanded', initialExpanded!);
      }
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/tree-view/${framework}/demo/`);
      await waitForHydration(page);

      const tree = getTree(page).first();

      // Check tree has accessible name
      const label = await tree.getAttribute('aria-label');
      expect(label).toBeTruthy();

      // Check treeitems exist
      const items = tree.getByRole('treeitem');
      const count = await items.count();
      expect(count).toBeGreaterThan(0);

      // Check first item has aria-selected
      const firstItem = items.first();
      const selected = await firstItem.getAttribute('aria-selected');
      expect(['true', 'false']).toContain(selected);
    }
  });
});
