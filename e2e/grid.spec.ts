import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * E2E Tests for Grid Pattern
 *
 * Tests verify the Grid component behavior in a real browser,
 * including 2D keyboard navigation, cell selection, and focus management.
 *
 * Test coverage:
 * - ARIA structure and attributes
 * - 2D keyboard navigation (Arrow keys, Home, End, Ctrl+Home, Ctrl+End)
 * - Focus management (roving tabindex)
 * - Cell selection
 *
 * Note: Per APG spec, when a cell contains a single focusable widget (link, button, etc.),
 * focus should be on that widget rather than the cell itself.
 */

/**
 * Helper to check if a cell or a focusable element within it is focused.
 * Per APG: when cell contains a single widget, focus should be on the widget.
 */
async function expectCellOrChildFocused(page: Page, cell: Locator): Promise<void> {
  // Check if cell itself is focused
  const cellIsFocused = await cell.evaluate((el) => document.activeElement === el);
  if (cellIsFocused) {
    await expect(cell).toBeFocused();
    return;
  }

  // Check if a focusable child inside the cell is focused
  const focusedChild = cell.locator(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const childCount = await focusedChild.count();
  if (childCount > 0) {
    // Check if any focusable child is focused
    for (let i = 0; i < childCount; i++) {
      const child = focusedChild.nth(i);
      const childIsFocused = await child.evaluate((el) => document.activeElement === el);
      if (childIsFocused) {
        await expect(child).toBeFocused();
        return;
      }
    }
  }

  // Neither cell nor child is focused - fail the test
  await expect(cell).toBeFocused();
}

/**
 * Helper to focus a cell, handling cells that contain links/buttons.
 */
async function focusCell(page: Page, cell: Locator): Promise<void> {
  // Click on the cell directly (not on any link inside)
  await cell.click({ position: { x: 5, y: 5 } });
}

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Grid (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/grid/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[role="grid"]');
    });

    // 🔴 High Priority: ARIA Attributes
    test.describe('ARIA Attributes', () => {
      test('has role="grid" on container', async ({ page }) => {
        const grid = page.getByRole('grid');
        await expect(grid).toBeVisible();
      });

      test('has role="row" on rows', async ({ page }) => {
        const rows = page.getByRole('row');
        await expect(rows.first()).toBeVisible();
        expect(await rows.count()).toBeGreaterThan(1);
      });

      test('has role="gridcell" on data cells', async ({ page }) => {
        const cells = page.getByRole('gridcell');
        await expect(cells.first()).toBeVisible();
      });

      test('has role="columnheader" on header cells', async ({ page }) => {
        const headers = page.getByRole('columnheader');
        await expect(headers.first()).toBeVisible();
      });

      test('has accessible name', async ({ page }) => {
        const grid = page.getByRole('grid');
        const label = await grid.getAttribute('aria-label');
        const labelledby = await grid.getAttribute('aria-labelledby');
        expect(label || labelledby).toBeTruthy();
      });

      test('aria-rowcount matches actual row count when set', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const ariaRowCount = await grid.getAttribute('aria-rowcount');

        // Skip if aria-rowcount is not set (optional per APG spec for static grids)
        if (ariaRowCount === null) {
          test.skip();
          return;
        }

        const rows = grid.getByRole('row');
        const actualRowCount = await rows.count();
        expect(parseInt(ariaRowCount, 10)).toBe(actualRowCount);
      });

      test('aria-colcount matches actual column count when set', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const ariaColCount = await grid.getAttribute('aria-colcount');

        // Skip if aria-colcount is not set (optional per APG spec for static grids)
        if (ariaColCount === null) {
          test.skip();
          return;
        }

        const headers = grid.getByRole('columnheader');
        const actualColCount = await headers.count();
        expect(parseInt(ariaColCount, 10)).toBe(actualColCount);
      });
    });

    // 🔴 High Priority: Keyboard Navigation
    test.describe('Keyboard Navigation', () => {
      test('ArrowRight moves focus one cell right', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('ArrowRight');

        const secondCell = cells.nth(1);
        await expectCellOrChildFocused(page, secondCell);

        // Verify focus style moved: second cell has .focused, first cell does not
        await expect(secondCell).toHaveClass(/focused/);
        await expect(firstCell).not.toHaveClass(/focused/);
      });

      test('ArrowLeft moves focus one cell left', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const secondCell = cells.nth(1);
        await focusCell(page, secondCell);

        await page.keyboard.press('ArrowLeft');

        const firstCell = cells.first();
        await expectCellOrChildFocused(page, firstCell);
      });

      test('ArrowDown moves focus one row down', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        await focusCell(page, firstCell);

        // Get the number of columns by counting headers in this grid
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        await page.keyboard.press('ArrowDown');

        // Should move to the cell in the next row, same column
        const targetCell = cells.nth(columnCount);
        await expectCellOrChildFocused(page, targetCell);
      });

      test('ArrowUp moves focus one row up', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        // Focus second row, first column
        const secondRowFirstCell = cells.nth(columnCount);
        await focusCell(page, secondRowFirstCell);

        await page.keyboard.press('ArrowUp');

        // Should move to first row, first column
        const firstCell = cells.first();
        await expectCellOrChildFocused(page, firstCell);
      });

      test('ArrowUp stops at first data row (does not enter headers)', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        // Use second cell (Email column) to avoid clicking on link in Name column
        const secondCell = cells.nth(1);
        await focusCell(page, secondCell);

        await page.keyboard.press('ArrowUp');

        // Should stay on second cell (cannot go into headers)
        await expectCellOrChildFocused(page, secondCell);
      });

      test('ArrowDown works after navigating to a cell with ArrowRight', async ({ page }) => {
        // This tests the scenario: navigate with arrow keys, then continue navigating
        // Specifically tests cells that may contain links/widgets
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        // Start from second row, second column (Email column, no link)
        const startCell = cells.nth(columnCount + 1);
        await focusCell(page, startCell);

        // Move left to Name column (which contains a link in React/Vue/Svelte demos)
        await page.keyboard.press('ArrowLeft');
        const nameCell = cells.nth(columnCount);
        await expectCellOrChildFocused(page, nameCell);

        // Now try to move down - this should work
        await page.keyboard.press('ArrowDown');
        const targetCell = cells.nth(columnCount * 2); // Third row, first column
        await expectCellOrChildFocused(page, targetCell);

        // Verify focus style moved correctly
        await expect(targetCell).toHaveClass(/focused/);
        await expect(nameCell).not.toHaveClass(/focused/);
      });

      test('ArrowUp works after navigating to a cell with ArrowRight', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        // Start from fourth row, second column (avoid third row which has disabled cell)
        const startCell = cells.nth(columnCount * 3 + 1);
        await focusCell(page, startCell);

        // Move left to Name column (which contains a link)
        await page.keyboard.press('ArrowLeft');
        const nameCell = cells.nth(columnCount * 3);
        await expectCellOrChildFocused(page, nameCell);

        // Now try to move up - this should work
        await page.keyboard.press('ArrowUp');
        const targetCell = cells.nth(columnCount * 2); // Third row, first column
        await expectCellOrChildFocused(page, targetCell);

        // Verify focus style moved correctly
        await expect(targetCell).toHaveClass(/focused/);
        await expect(nameCell).not.toHaveClass(/focused/);
      });

      test('Home moves to first cell in row', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        // Focus last cell in first row
        const lastCellInFirstRow = cells.nth(columnCount - 1);
        await focusCell(page, lastCellInFirstRow);

        await page.keyboard.press('Home');

        const firstCell = cells.first();
        await expectCellOrChildFocused(page, firstCell);
      });

      test('End moves to last cell in row', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('End');

        const lastCellInFirstRow = cells.nth(columnCount - 1);
        await expectCellOrChildFocused(page, lastCellInFirstRow);
      });

      test('Ctrl+Home moves to first cell in grid', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const lastCell = cells.last();
        await focusCell(page, lastCell);

        await page.keyboard.press('Control+Home');

        const firstCell = cells.first();
        await expectCellOrChildFocused(page, firstCell);
      });

      test('Ctrl+End moves to last cell in grid', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('Control+End');

        const lastCell = cells.last();
        await expectCellOrChildFocused(page, lastCell);
      });

      test('PageDown moves focus down by pageSize rows', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        // Start at first row, first column
        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('PageDown');

        // pageSize=2, so should move to third row (index 2), first column
        const targetCell = cells.nth(columnCount * 2);
        await expectCellOrChildFocused(page, targetCell);
      });

      test('PageUp moves focus up by pageSize rows', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        // Start at fourth row (index 3), first column
        const startCell = cells.nth(columnCount * 3);
        await focusCell(page, startCell);

        await page.keyboard.press('PageUp');

        // pageSize=2, so should move to second row (index 1), first column
        const targetCell = cells.nth(columnCount);
        await expectCellOrChildFocused(page, targetCell);
      });
    });

    // 🔴 High Priority: Focus Management
    test.describe('Focus Management', () => {
      test('first focusable cell has tabIndex="0"', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        await expect(firstCell).toHaveAttribute('tabindex', '0');
      });

      test('other cells have tabIndex="-1"', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const secondCell = cells.nth(1);
        await expect(secondCell).toHaveAttribute('tabindex', '-1');
      });

      test('columnheader cells are not focusable', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const headers = grid.getByRole('columnheader');
        const firstHeader = headers.first();
        const tabindex = await firstHeader.getAttribute('tabindex');
        expect(tabindex).toBeNull();
      });

      test('Tab exits grid', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        // Test with first cell which contains a link
        // Per APG, Tab should exit grid even when focus is on a widget inside a cell
        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('Tab');

        // Should no longer be focused on any element in the grid
        const gridContainsFocus = await grid.evaluate((el) => el.contains(document.activeElement));
        expect(gridContainsFocus).toBe(false);
      });

      test('roving tabindex updates on arrow navigation', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const secondCell = cells.nth(1);

        // Initially first cell has tabindex="0"
        await expect(firstCell).toHaveAttribute('tabindex', '0');
        await expect(secondCell).toHaveAttribute('tabindex', '-1');

        // Focus first cell and navigate right
        await focusCell(page, firstCell);
        await page.keyboard.press('ArrowRight');

        // After navigation, tabindex should update
        await expect(firstCell).toHaveAttribute('tabindex', '-1');
        await expect(secondCell).toHaveAttribute('tabindex', '0');
      });

      test('focus returns to last focused cell on re-entry', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const secondCell = cells.nth(1);

        // Focus second cell
        await focusCell(page, secondCell);
        await expectCellOrChildFocused(page, secondCell);

        // Tab out of grid
        await page.keyboard.press('Tab');

        // Tab back into grid (Shift+Tab)
        await page.keyboard.press('Shift+Tab');

        // Should return to last focused cell (second cell)
        await expectCellOrChildFocused(page, secondCell);
        await expect(secondCell).toHaveAttribute('tabindex', '0');
      });
    });

    // 🔴 High Priority: Selection (if selectable)
    test.describe('Selection', () => {
      test('Space toggles selection when selectable', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const hasAriaSelected = await firstCell.getAttribute('aria-selected');

        // Skip if grid is not selectable
        if (hasAriaSelected === null) {
          test.skip();
          return;
        }

        await focusCell(page, firstCell);
        await page.keyboard.press('Space');

        await expect(firstCell).toHaveAttribute('aria-selected', 'true');
      });

      test('Enter activates cell', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        // Use second cell (Email column) to avoid clicking on link in Name column
        const secondCell = cells.nth(1);
        await focusCell(page, secondCell);

        // Just verify Enter doesn't cause errors
        await page.keyboard.press('Enter');

        // Cell should still be focused
        await expectCellOrChildFocused(page, secondCell);
      });

      test('Space toggles selection off', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const hasAriaSelected = await firstCell.getAttribute('aria-selected');

        // Skip if grid is not selectable
        if (hasAriaSelected === null) {
          test.skip();
          return;
        }

        await focusCell(page, firstCell);

        // Select the cell
        await page.keyboard.press('Space');
        await expect(firstCell).toHaveAttribute('aria-selected', 'true');

        // Deselect the cell
        await page.keyboard.press('Space');
        await expect(firstCell).toHaveAttribute('aria-selected', 'false');
      });

      test('multiselectable grid allows multiple selections', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const isMultiselectable = await grid.getAttribute('aria-multiselectable');

        // Skip if not multiselectable
        if (isMultiselectable !== 'true') {
          test.skip();
          return;
        }

        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const secondCell = cells.nth(1);

        // Select first cell
        await focusCell(page, firstCell);
        await page.keyboard.press('Space');
        await expect(firstCell).toHaveAttribute('aria-selected', 'true');

        // Navigate to second cell and select it
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Space');

        // Both should be selected
        await expect(firstCell).toHaveAttribute('aria-selected', 'true');
        await expect(secondCell).toHaveAttribute('aria-selected', 'true');
      });

      test('selection persists after navigation', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const hasAriaSelected = await firstCell.getAttribute('aria-selected');

        // Skip if grid is not selectable
        if (hasAriaSelected === null) {
          test.skip();
          return;
        }

        // Select first cell
        await focusCell(page, firstCell);
        await page.keyboard.press('Space');
        await expect(firstCell).toHaveAttribute('aria-selected', 'true');

        // Navigate away and back
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowLeft');

        // Selection should persist
        await expect(firstCell).toHaveAttribute('aria-selected', 'true');
      });
    });
  });
}
