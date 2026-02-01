import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * E2E Tests for TreeGrid Pattern
 *
 * Tests verify the TreeGrid component behavior in a real browser,
 * including 2D keyboard navigation, tree operations (expand/collapse),
 * row selection, and focus management.
 *
 * Test coverage:
 * - ARIA structure and attributes (treegrid, aria-level, aria-expanded)
 * - 2D keyboard navigation (Arrow keys, Home, End, Ctrl+Home, Ctrl+End)
 * - Tree operations at rowheader (ArrowRight/Left for expand/collapse)
 * - Row selection (Space toggles row selection, not cell)
 * - Focus management (roving tabindex)
 *
 * Key differences from Grid:
 * - Tree operations only at rowheader cells
 * - Row selection (aria-selected on row, not cell)
 * - aria-level and aria-expanded on rows
 */

/**
 * Helper to check if a cell or a focusable element within it is focused.
 */
async function expectCellOrChildFocused(_page: Page, cell: Locator): Promise<void> {
  const cellIsFocused = await cell.evaluate((el) => document.activeElement === el);
  if (cellIsFocused) {
    await expect(cell).toBeFocused();
    return;
  }

  const focusedChild = cell.locator(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const childCount = await focusedChild.count();
  if (childCount > 0) {
    for (let i = 0; i < childCount; i++) {
      const child = focusedChild.nth(i);
      const childIsFocused = await child.evaluate((el) => document.activeElement === el);
      if (childIsFocused) {
        await expect(child).toBeFocused();
        return;
      }
    }
  }

  await expect(cell).toBeFocused();
}

/**
 * Helper to focus a cell, handling cells that contain links/buttons.
 * Returns the focused element (either the cell or a focusable child).
 */
async function focusCell(_page: Page, cell: Locator): Promise<Locator> {
  await cell.click({ position: { x: 5, y: 5 } });

  // Check if focus is on the cell or a child element
  const cellIsFocused = await cell.evaluate((el) => document.activeElement === el);
  if (cellIsFocused) {
    return cell;
  }

  // Find and return the focused child
  const focusedChild = cell.locator(
    'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const childCount = await focusedChild.count();
  for (let i = 0; i < childCount; i++) {
    const child = focusedChild.nth(i);
    const childIsFocused = await child.evaluate((el) => document.activeElement === el);
    if (childIsFocused) {
      return child;
    }
  }

  return cell;
}

/**
 * Helper to get the row containing a cell.
 */
async function getRowForCell(cell: Locator): Promise<Locator> {
  return cell.locator('xpath=ancestor::*[@role="row"]').first();
}

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`TreeGrid (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/treegrid/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[role="treegrid"]');
    });

    // 🔴 High Priority: ARIA Attributes
    test.describe('ARIA Attributes', () => {
      test('has role="treegrid" on container', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        await expect(treegrid).toBeVisible();
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

      test('has role="rowheader" on row header cells', async ({ page }) => {
        const rowheaders = page.getByRole('rowheader');
        await expect(rowheaders.first()).toBeVisible();
      });

      test('has accessible name', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const label = await treegrid.getAttribute('aria-label');
        const labelledby = await treegrid.getAttribute('aria-labelledby');
        expect(label || labelledby).toBeTruthy();
      });

      test('parent rows have aria-expanded', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        let foundParentRow = false;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaExpanded = await row.getAttribute('aria-expanded');
          if (ariaExpanded !== null) {
            foundParentRow = true;
            expect(['true', 'false']).toContain(ariaExpanded);
          }
        }
        expect(foundParentRow).toBe(true);
      });

      test('all data rows have aria-level', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaLevel = await row.getAttribute('aria-level');
          // Skip header row (no aria-level)
          if (ariaLevel !== null) {
            const level = parseInt(ariaLevel, 10);
            expect(level).toBeGreaterThanOrEqual(1);
          }
        }
      });

      test('aria-level is 1-based and increments with depth', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        const levels: number[] = [];
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaLevel = await row.getAttribute('aria-level');
          if (ariaLevel !== null) {
            levels.push(parseInt(ariaLevel, 10));
          }
        }

        // Check that level 1 exists (root level)
        expect(levels).toContain(1);
      });

      test('has aria-selected on row (not gridcell) when selectable', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        let hasSelectableRow = false;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaSelected = await row.getAttribute('aria-selected');
          if (ariaSelected !== null) {
            hasSelectableRow = true;
            expect(['true', 'false']).toContain(ariaSelected);
          }
        }

        if (hasSelectableRow) {
          // Verify gridcells don't have aria-selected
          const cells = treegrid.getByRole('gridcell');
          const cellCount = await cells.count();
          for (let i = 0; i < cellCount; i++) {
            const cell = cells.nth(i);
            const ariaSelected = await cell.getAttribute('aria-selected');
            expect(ariaSelected).toBeNull();
          }
        }
      });
    });

    // 🔴 High Priority: Keyboard - Row Navigation
    test.describe('Keyboard - Row Navigation', () => {
      test('ArrowDown moves to same column in next visible row', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rowheaders = treegrid.getByRole('rowheader');
        const firstRowheader = rowheaders.first();
        const focusedElement = await focusCell(page, firstRowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowDown');

        const secondRowheader = rowheaders.nth(1);
        await expectCellOrChildFocused(page, secondRowheader);
      });

      test('ArrowUp moves to same column in previous visible row', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rowheaders = treegrid.getByRole('rowheader');
        const secondRowheader = rowheaders.nth(1);
        const focusedElement = await focusCell(page, secondRowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowUp');

        const firstRowheader = rowheaders.first();
        await expectCellOrChildFocused(page, firstRowheader);
      });

      test('ArrowUp stops at first visible row', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rowheaders = treegrid.getByRole('rowheader');
        const firstRowheader = rowheaders.first();
        const focusedElement = await focusCell(page, firstRowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowUp');

        // Should stay on first row
        await expectCellOrChildFocused(page, firstRowheader);
      });
    });

    // 🔴 High Priority: Keyboard - Cell Navigation
    test.describe('Keyboard - Cell Navigation', () => {
      test('ArrowRight at non-rowheader moves right', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const cells = treegrid.getByRole('gridcell');
        const firstCell = cells.first();
        const focusedElement = await focusCell(page, firstCell);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowRight');

        const secondCell = cells.nth(1);
        await expectCellOrChildFocused(page, secondCell);
      });

      test('ArrowLeft at non-rowheader moves left', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const cells = treegrid.getByRole('gridcell');
        const secondCell = cells.nth(1);
        const focusedElement = await focusCell(page, secondCell);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowLeft');

        const firstCell = cells.first();
        await expectCellOrChildFocused(page, firstCell);
      });

      test('Home moves to first cell in row', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const cells = treegrid.getByRole('gridcell');
        const rowheaders = treegrid.getByRole('rowheader');
        const secondCell = cells.nth(1);
        const focusedElement = await focusCell(page, secondCell);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('Home');

        // Should move to rowheader (first cell in row)
        const firstRowheader = rowheaders.first();
        await expectCellOrChildFocused(page, firstRowheader);
      });

      test('End moves to last cell in row', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rowheaders = treegrid.getByRole('rowheader');
        const firstRowheader = rowheaders.first();
        const focusedElement = await focusCell(page, firstRowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('End');

        // Should move to last cell in first data row
        // Get cells in the same row
        const row = await getRowForCell(firstRowheader);
        const cellsInRow = row.getByRole('gridcell');
        const lastCell = cellsInRow.last();
        await expectCellOrChildFocused(page, lastCell);
      });

      test('Ctrl+Home moves to first cell in grid', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const cells = treegrid.getByRole('gridcell');
        const rowheaders = treegrid.getByRole('rowheader');
        const lastCell = cells.last();
        const focusedElement = await focusCell(page, lastCell);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('Control+Home');

        // Should move to first rowheader
        const firstRowheader = rowheaders.first();
        await expectCellOrChildFocused(page, firstRowheader);
      });

      test('Ctrl+End moves to last cell in grid', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rowheaders = treegrid.getByRole('rowheader');
        const cells = treegrid.getByRole('gridcell');
        const firstRowheader = rowheaders.first();
        const focusedElement = await focusCell(page, firstRowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('Control+End');

        // Should move to last cell
        const lastCell = cells.last();
        await expectCellOrChildFocused(page, lastCell);
      });
    });

    // 🔴 High Priority: Keyboard - Tree Operations
    test.describe('Keyboard - Tree Operations', () => {
      test('ArrowRight at collapsed rowheader expands row', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find a collapsed parent row
        let collapsedRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaExpanded = await row.getAttribute('aria-expanded');
          if (ariaExpanded === 'false') {
            collapsedRowIndex = i;
            break;
          }
        }

        if (collapsedRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(collapsedRowIndex);
        const rowheader = row.getByRole('rowheader');
        const focusedElement = await focusCell(page, rowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowRight');

        await expect(row).toHaveAttribute('aria-expanded', 'true');
      });

      test('expanding a row makes child rows visible', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find a collapsed parent row
        let collapsedRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaExpanded = await row.getAttribute('aria-expanded');
          if (ariaExpanded === 'false') {
            collapsedRowIndex = i;
            break;
          }
        }

        if (collapsedRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(collapsedRowIndex);
        const rowheader = row.getByRole('rowheader');

        // Get initial visible rowheader count
        const visibleRowheadersBefore = await treegrid.getByRole('rowheader').count();

        const focusedElement = await focusCell(page, rowheader);
        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowRight');

        await expect(row).toHaveAttribute('aria-expanded', 'true');

        // After expansion, there should be more visible rowheaders (child rows appeared)
        const visibleRowheadersAfter = await treegrid.getByRole('rowheader').count();
        expect(visibleRowheadersAfter).toBeGreaterThan(visibleRowheadersBefore);
      });

      test('ArrowLeft at expanded rowheader collapses row', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find an expanded parent row
        let expandedRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaExpanded = await row.getAttribute('aria-expanded');
          if (ariaExpanded === 'true') {
            expandedRowIndex = i;
            break;
          }
        }

        if (expandedRowIndex === -1) {
          // Try to expand first, then collapse
          for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const ariaExpanded = await row.getAttribute('aria-expanded');
            if (ariaExpanded === 'false') {
              const rowheader = row.getByRole('rowheader');
              const focused = await focusCell(page, rowheader);
              await expect(focused).toBeFocused();
              await focused.press('ArrowRight');
              await expect(row).toHaveAttribute('aria-expanded', 'true');
              expandedRowIndex = i;
              break;
            }
          }
        }

        if (expandedRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(expandedRowIndex);
        const rowheader = row.getByRole('rowheader');
        const focusedElement = await focusCell(page, rowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowLeft');

        await expect(row).toHaveAttribute('aria-expanded', 'false');
      });

      test('ArrowRight at expanded rowheader moves right to next cell', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find an expanded parent row
        let expandedRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaExpanded = await row.getAttribute('aria-expanded');
          if (ariaExpanded === 'true') {
            expandedRowIndex = i;
            break;
          }
        }

        if (expandedRowIndex === -1) {
          // Try to expand a collapsed row first
          for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);
            const ariaExpanded = await row.getAttribute('aria-expanded');
            if (ariaExpanded === 'false') {
              const rowheader = row.getByRole('rowheader');
              const focused = await focusCell(page, rowheader);
              await expect(focused).toBeFocused();
              await focused.press('ArrowRight');
              await expect(row).toHaveAttribute('aria-expanded', 'true');
              expandedRowIndex = i;
              break;
            }
          }
        }

        if (expandedRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(expandedRowIndex);
        const rowheader = row.getByRole('rowheader');
        const cells = row.getByRole('gridcell');
        const firstCell = cells.first();

        const focusedElement = await focusCell(page, rowheader);

        // ArrowRight at expanded rowheader should move to the next cell (not expand again)
        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowRight');

        // Row should still be expanded
        await expect(row).toHaveAttribute('aria-expanded', 'true');

        // Focus should move to first gridcell in same row
        await expectCellOrChildFocused(page, firstCell);
      });

      test('ArrowRight at non-rowheader does NOT expand', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find a collapsed parent row
        let collapsedRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaExpanded = await row.getAttribute('aria-expanded');
          if (ariaExpanded === 'false') {
            collapsedRowIndex = i;
            break;
          }
        }

        if (collapsedRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(collapsedRowIndex);
        const cells = row.getByRole('gridcell');
        const firstCell = cells.first();
        const focusedElement = await focusCell(page, firstCell);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowRight');

        // Should NOT expand - still collapsed
        await expect(row).toHaveAttribute('aria-expanded', 'false');
      });

      test('Enter does NOT expand/collapse', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find a collapsed parent row
        let collapsedRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaExpanded = await row.getAttribute('aria-expanded');
          if (ariaExpanded === 'false') {
            collapsedRowIndex = i;
            break;
          }
        }

        if (collapsedRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(collapsedRowIndex);
        const rowheader = row.getByRole('rowheader');
        const focusedElement = await focusCell(page, rowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('Enter');

        // Should still be collapsed
        await expect(row).toHaveAttribute('aria-expanded', 'false');
      });
    });

    // 🔴 High Priority: Row Selection
    test.describe('Row Selection', () => {
      test('Space toggles row selection', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find a selectable row
        let selectableRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaSelected = await row.getAttribute('aria-selected');
          if (ariaSelected !== null) {
            selectableRowIndex = i;
            break;
          }
        }

        if (selectableRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(selectableRowIndex);
        const rowheader = row.getByRole('rowheader');
        const focusedElement = await focusCell(page, rowheader);

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('Space');

        await expect(row).toHaveAttribute('aria-selected', 'true');
      });

      test('Space toggles row selection off', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rows = treegrid.getByRole('row');
        const rowCount = await rows.count();

        // Find a selectable row
        let selectableRowIndex = -1;
        for (let i = 0; i < rowCount; i++) {
          const row = rows.nth(i);
          const ariaSelected = await row.getAttribute('aria-selected');
          if (ariaSelected !== null) {
            selectableRowIndex = i;
            break;
          }
        }

        if (selectableRowIndex === -1) {
          test.skip();
          return;
        }

        const row = rows.nth(selectableRowIndex);
        const rowheader = row.getByRole('rowheader');
        const focusedElement = await focusCell(page, rowheader);

        // Select
        await expect(focusedElement).toBeFocused();
        await focusedElement.press('Space');
        await expect(row).toHaveAttribute('aria-selected', 'true');

        // Deselect (focus should still be on the same element after Space)
        await focusedElement.press('Space');
        await expect(row).toHaveAttribute('aria-selected', 'false');
      });
    });

    // 🔴 High Priority: Focus Management
    test.describe('Focus Management', () => {
      test('first focusable cell has tabIndex="0"', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rowheaders = treegrid.getByRole('rowheader');
        const firstRowheader = rowheaders.first();
        await expect(firstRowheader).toHaveAttribute('tabindex', '0');
      });

      test('other cells have tabIndex="-1"', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const cells = treegrid.getByRole('gridcell');
        const firstCell = cells.first();
        await expect(firstCell).toHaveAttribute('tabindex', '-1');
      });

      test('columnheader cells are not focusable', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const headers = treegrid.getByRole('columnheader');
        const firstHeader = headers.first();
        const tabindex = await firstHeader.getAttribute('tabindex');
        expect(tabindex).toBeNull();
      });

      test('Tab exits treegrid', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const rowheaders = treegrid.getByRole('rowheader');
        const firstRowheader = rowheaders.first();
        await focusCell(page, firstRowheader);

        await page.keyboard.press('Tab');

        const treegridContainsFocus = await treegrid.evaluate((el) =>
          el.contains(document.activeElement)
        );
        expect(treegridContainsFocus).toBe(false);
      });

      test('roving tabindex updates on arrow navigation', async ({ page }) => {
        const treegrid = page.getByRole('treegrid');
        const cells = treegrid.getByRole('gridcell');
        const firstCell = cells.first(); // First gridcell (not rowheader) = Size column of first row
        const secondCell = cells.nth(1); // Date column of first row

        // Initially first rowheader has tabindex="0", gridcells have "-1"
        await expect(firstCell).toHaveAttribute('tabindex', '-1');
        await expect(secondCell).toHaveAttribute('tabindex', '-1');

        // Focus first gridcell (Size column) and navigate right to Date column
        const focusedElement = await focusCell(page, firstCell);
        await expect(firstCell).toHaveAttribute('tabindex', '0');

        await expect(focusedElement).toBeFocused();
        await focusedElement.press('ArrowRight');

        // After navigation, tabindex should update
        await expect(firstCell).toHaveAttribute('tabindex', '-1');
        await expect(secondCell).toHaveAttribute('tabindex', '0');
      });
    });
  });
}
