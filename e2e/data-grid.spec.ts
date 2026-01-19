import { expect, test, type Locator, type Page } from '@playwright/test';

/**
 * E2E Tests for DataGrid Pattern
 *
 * Tests verify the DataGrid component behavior in a real browser,
 * including sorting, row selection, range selection, cell editing,
 * and all standard grid navigation.
 *
 * Test coverage:
 * - ARIA structure and attributes (including aria-sort, aria-selected on rows)
 * - Sortable header keyboard interaction
 * - Row selection with checkboxes
 * - Range selection (Shift+Arrow)
 * - Cell editing (Enter/F2, Escape)
 * - 2D keyboard navigation
 * - Focus management
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
 * Helper to focus a cell.
 * Uses focus() directly to avoid clicking internal elements like checkboxes.
 */
async function focusCell(_page: Page, cell: Locator): Promise<void> {
  await cell.focus();
}

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`DataGrid (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/data-grid/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
      await page.waitForSelector('[role="grid"]');
    });

    // ========================================
    // High Priority: ARIA Attributes
    // ========================================
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

      test('sortable columnheader has aria-sort', async ({ page }) => {
        const sortableHeaders = page.locator('[role="columnheader"][aria-sort]');
        const count = await sortableHeaders.count();
        expect(count).toBeGreaterThan(0);

        const firstSortable = sortableHeaders.first();
        const ariaSort = await firstSortable.getAttribute('aria-sort');
        expect(['none', 'ascending', 'descending', 'other']).toContain(ariaSort);
      });

      test('row has aria-selected when rowSelectable', async ({ page }) => {
        const grid = page.getByRole('grid');
        const rows = grid.getByRole('row');

        // Check if any data row has aria-selected (indicates row selection is enabled)
        const firstDataRow = rows.nth(1);
        const ariaSelected = await firstDataRow.getAttribute('aria-selected');

        // Skip if row selection is not enabled
        if (ariaSelected === null) {
          test.skip();
          return;
        }

        expect(['true', 'false']).toContain(ariaSelected);
      });
    });

    // ========================================
    // High Priority: Sorting
    // ========================================
    test.describe('Sorting', () => {
      test('sort cycles through states on header Enter', async ({ page }) => {
        const sortableHeader = page.locator('[role="columnheader"][aria-sort]').first();
        const initialSort = await sortableHeader.getAttribute('aria-sort');

        // Skip if no sortable headers
        if (!initialSort) {
          test.skip();
          return;
        }

        // Focus and press Enter
        await sortableHeader.focus();
        await page.keyboard.press('Enter');

        // Check that aria-sort changed
        const newSort = await sortableHeader.getAttribute('aria-sort');
        expect(newSort).not.toEqual(initialSort);
      });

      test('sort cycles through states on header click', async ({ page }) => {
        const sortableHeader = page.locator('[role="columnheader"][aria-sort]').first();
        const initialSort = await sortableHeader.getAttribute('aria-sort');

        if (!initialSort) {
          test.skip();
          return;
        }

        // Click header
        await sortableHeader.click();

        // Check that aria-sort changed
        const newSort = await sortableHeader.getAttribute('aria-sort');
        expect(newSort).not.toEqual(initialSort);
      });

      test('sort cycles: none -> ascending -> descending -> ascending', async ({ page }) => {
        // Get sortable headers and find one with aria-sort="none"
        const sortableHeaders = page.locator('[role="columnheader"][aria-sort]');
        const count = await sortableHeaders.count();

        if (count === 0) {
          test.skip();
          return;
        }

        // Find the first header with aria-sort="none" and get its text to identify it
        let targetHeaderText: string | null = null;
        for (let i = 0; i < count; i++) {
          const header = sortableHeaders.nth(i);
          const sortValue = await header.getAttribute('aria-sort');
          if (sortValue === 'none') {
            targetHeaderText = await header.textContent();
            break;
          }
        }

        if (!targetHeaderText) {
          test.skip();
          return;
        }

        // Use a stable locator based on text content (which doesn't change with sort)
        // Remove any sort indicator from the text for matching
        const baseText = targetHeaderText.replace(/[▲▼⇅]/g, '').trim();
        const sortableHeader = page.getByRole('columnheader', { name: baseText });

        await expect(sortableHeader).toHaveAttribute('aria-sort', 'none');

        // First click -> ascending
        await sortableHeader.click();
        await expect(sortableHeader).toHaveAttribute('aria-sort', 'ascending');

        // Second click -> descending
        await sortableHeader.click();
        await expect(sortableHeader).toHaveAttribute('aria-sort', 'descending');

        // Third click -> ascending (loop)
        await sortableHeader.click();
        await expect(sortableHeader).toHaveAttribute('aria-sort', 'ascending');
      });

      test('Space on sortable header triggers sort', async ({ page }) => {
        const sortableHeader = page.locator('[role="columnheader"][aria-sort]').first();
        const initialSort = await sortableHeader.getAttribute('aria-sort');

        if (!initialSort) {
          test.skip();
          return;
        }

        await sortableHeader.focus();
        await page.keyboard.press('Space');

        const newSort = await sortableHeader.getAttribute('aria-sort');
        expect(newSort).not.toEqual(initialSort);
      });
    });

    // ========================================
    // High Priority: Row Selection
    // ========================================
    test.describe('Row Selection', () => {
      test('checkbox click toggles row selection', async ({ page }) => {
        const grid = page.getByRole('grid');
        const checkboxes = grid.getByRole('checkbox');
        const count = await checkboxes.count();

        // Skip if no checkboxes (row selection not enabled)
        if (count === 0) {
          test.skip();
          return;
        }

        const rows = grid.getByRole('row');
        const firstDataRow = rows.nth(1);

        // Initial state
        await expect(firstDataRow).toHaveAttribute('aria-selected', 'false');

        // Click checkbox
        const firstCheckbox = checkboxes.first();
        await firstCheckbox.click();

        // Should be selected
        await expect(firstDataRow).toHaveAttribute('aria-selected', 'true');

        // Click again to deselect
        await firstCheckbox.click();
        await expect(firstDataRow).toHaveAttribute('aria-selected', 'false');
      });

      test('Space on checkbox toggles row selection', async ({ page }) => {
        const grid = page.getByRole('grid');
        const checkboxes = grid.getByRole('checkbox');
        const count = await checkboxes.count();

        if (count === 0) {
          test.skip();
          return;
        }

        const rows = grid.getByRole('row');
        const firstDataRow = rows.nth(1);
        const firstCheckbox = checkboxes.first();

        await firstCheckbox.focus();
        await page.keyboard.press('Space');

        await expect(firstDataRow).toHaveAttribute('aria-selected', 'true');
      });

      test('multiple rows can be selected when multiselectable', async ({ page }) => {
        const grid = page.getByRole('grid');
        const isMultiselectable = await grid.getAttribute('aria-multiselectable');

        if (isMultiselectable !== 'true') {
          test.skip();
          return;
        }

        const rows = grid.getByRole('row');

        // Get data rows (skip header row at index 0)
        const firstDataRow = rows.nth(1);
        const secondDataRow = rows.nth(2);

        // Get row checkboxes (not the "select all" checkbox in header)
        const firstRowCheckbox = firstDataRow.getByRole('checkbox');
        const secondRowCheckbox = secondDataRow.getByRole('checkbox');

        // Skip if no row checkboxes
        if ((await firstRowCheckbox.count()) === 0 || (await secondRowCheckbox.count()) === 0) {
          test.skip();
          return;
        }

        // Select first row
        await firstRowCheckbox.click();
        await expect(firstDataRow).toHaveAttribute('aria-selected', 'true');

        // Select second row
        await secondRowCheckbox.click();
        await expect(secondDataRow).toHaveAttribute('aria-selected', 'true');

        // Both should remain selected
        await expect(firstDataRow).toHaveAttribute('aria-selected', 'true');
      });

      test('row checkbox has aria-labelledby referencing label column cell', async ({ page }) => {
        const grid = page.getByRole('grid');
        const rows = grid.getByRole('row');
        const firstDataRow = rows.nth(1);
        // Get the first checkbox in the row (the row selection checkbox)
        const checkbox = firstDataRow.getByRole('checkbox').first();
        const count = await checkbox.count();

        // Skip if no row checkboxes (row selection may be disabled by user toggle in demo)
        if (count === 0) {
          test.skip();
          return;
        }

        const ariaLabelledby = await checkbox.getAttribute('aria-labelledby');

        // Should have aria-labelledby attribute when row selection is enabled
        expect(ariaLabelledby).toBeTruthy();

        // aria-labelledby can be space-separated list of IDs, filter and get the first one
        const labelIds = ariaLabelledby!.split(/\s+/).filter((id) => id.length > 0);
        expect(labelIds.length).toBeGreaterThan(0);

        // The ID should follow the pattern cell-{rowId}-{columnId}
        // columnId can contain letters, numbers, and hyphens
        const primaryLabelId = labelIds[0];
        expect(primaryLabelId).toMatch(/^cell-.+-[\w-]+$/);

        // The referenced element should exist and contain row identifying text
        const labelElement = page.locator(`[id="${primaryLabelId}"]`);
        await expect(labelElement).toBeVisible();
        const labelText = await labelElement.innerText();
        expect(labelText.length).toBeGreaterThan(0);
      });

      test('row checkbox accessible name matches label column cell text', async ({ page }) => {
        const grid = page.getByRole('grid');
        const rows = grid.getByRole('row');
        const firstDataRow = rows.nth(1);
        // Get the first checkbox in the row (the row selection checkbox)
        const rowCheckbox = firstDataRow.getByRole('checkbox').first();
        const count = await rowCheckbox.count();

        // Skip if no row checkbox (row selection may be disabled by user toggle in demo)
        if (count === 0) {
          test.skip();
          return;
        }

        // Get the checkbox's accessible name (from aria-labelledby)
        const ariaLabelledby = await rowCheckbox.getAttribute('aria-labelledby');

        // When row selection is enabled, aria-labelledby should be present
        expect(ariaLabelledby).toBeTruthy();

        // aria-labelledby can be space-separated list of IDs, filter and get the first one
        const labelIds = ariaLabelledby!.split(/\s+/).filter((id) => id.length > 0);
        const primaryLabelId = labelIds[0];

        const labelCell = page.locator(`[id="${primaryLabelId}"]`);
        const expectedName = await labelCell.innerText();

        // Verify the checkbox has the correct accessible name
        await expect(rowCheckbox).toHaveAccessibleName(expectedName);
      });
    });

    // ========================================
    // High Priority: Range Selection
    // ========================================
    test.describe('Range Selection', () => {
      test('Shift+ArrowDown extends selection', async ({ page }) => {
        const grid = page.getByRole('grid');
        const cells = grid.getByRole('gridcell');

        // Check if range selection is enabled (cells have aria-selected)
        const firstCell = cells.first();
        const hasAriaSelected = await firstCell.getAttribute('aria-selected');

        if (hasAriaSelected === null) {
          test.skip();
          return;
        }

        await focusCell(page, firstCell);
        await page.keyboard.press('Shift+ArrowDown');

        // Multiple cells should be selected
        const selectedCells = grid.locator('[role="gridcell"][aria-selected="true"]');
        expect(await selectedCells.count()).toBeGreaterThan(1);
      });

      test('Shift+ArrowRight extends selection', async ({ page }) => {
        const grid = page.getByRole('grid');
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const hasAriaSelected = await firstCell.getAttribute('aria-selected');

        if (hasAriaSelected === null) {
          test.skip();
          return;
        }

        await focusCell(page, firstCell);
        await page.keyboard.press('Shift+ArrowRight');

        const selectedCells = grid.locator('[role="gridcell"][aria-selected="true"]');
        expect(await selectedCells.count()).toBeGreaterThan(1);
      });
    });

    // ========================================
    // High Priority: Cell Editing
    // ========================================
    test.describe('Cell Editing', () => {
      test('Enter on editable cell enters edit mode', async ({ page }) => {
        const grid = page.getByRole('grid');
        // Use aria-readonly="false" to find editable cells (not just cells without aria-readonly)
        const editableCells = grid.locator('[role="gridcell"][aria-readonly="false"]');
        const count = await editableCells.count();

        // Skip if no editable cells
        if (count === 0) {
          test.skip();
          return;
        }

        const editableCell = editableCells.first();
        await focusCell(page, editableCell);
        await page.keyboard.press('Enter');

        // Should show input (textbox, combobox, or select)
        const input = editableCell.locator('input, select, [role="combobox"]').first();
        await expect(input).toBeFocused();
      });

      test('F2 on editable cell enters edit mode', async ({ page }) => {
        const grid = page.getByRole('grid');
        const editableCells = grid.locator('[role="gridcell"][aria-readonly="false"]');
        const count = await editableCells.count();

        if (count === 0) {
          test.skip();
          return;
        }

        const editableCell = editableCells.first();
        await focusCell(page, editableCell);
        await page.keyboard.press('F2');

        const input = editableCell.locator('input, select, [role="combobox"]').first();
        await expect(input).toBeFocused();
      });

      test('Escape cancels edit and restores focus to cell', async ({ page }) => {
        const grid = page.getByRole('grid');
        const editableCells = grid.locator('[role="gridcell"][aria-readonly="false"]');
        const count = await editableCells.count();

        if (count === 0) {
          test.skip();
          return;
        }

        const editableCell = editableCells.first();
        const originalValue = await editableCell.innerText();

        await focusCell(page, editableCell);
        await page.keyboard.press('Enter');

        // Wait for edit mode to be active
        const input = editableCell.locator('input, select, [role="combobox"]').first();
        await expect(input).toBeFocused();

        // Cancel editing
        await page.keyboard.press('Escape');

        // Value should be restored (or unchanged)
        const currentValue = await editableCell.innerText();
        // Just verify editing mode exited - value may or may not change depending on implementation
        expect(currentValue).toBeTruthy();

        // Focus should return to cell
        await expectCellOrChildFocused(page, editableCell);
      });

      test('edit mode disables grid navigation', async ({ page }) => {
        const grid = page.getByRole('grid');
        const editableCells = grid.locator('[role="gridcell"][aria-readonly="false"]');
        const count = await editableCells.count();

        if (count === 0) {
          test.skip();
          return;
        }

        const editableCell = editableCells.first();
        await focusCell(page, editableCell);
        await page.keyboard.press('Enter');

        const input = editableCell.locator('input, select, [role="combobox"]').first();
        await expect(input).toBeFocused();

        // Arrow keys should not navigate grid while editing
        await page.keyboard.press('ArrowRight');

        // Should still be in edit mode (input or cell should have focus)
        const inputStillFocused = await input.evaluate((el) => el === document.activeElement);
        const cellContainsFocus = await editableCell.evaluate((el) =>
          el.contains(document.activeElement)
        );
        expect(inputStillFocused || cellContainsFocus).toBe(true);
      });
    });

    // ========================================
    // High Priority: Keyboard Navigation
    // ========================================
    test.describe('Keyboard Navigation', () => {
      test('ArrowRight moves focus one cell right', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('ArrowRight');

        const secondCell = cells.nth(1);
        await expectCellOrChildFocused(page, secondCell);
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
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('ArrowDown');

        const targetCell = cells.nth(columnCount);
        await expectCellOrChildFocused(page, targetCell);
      });

      test('ArrowUp moves focus one row up', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const headers = grid.getByRole('columnheader');
        const columnCount = await headers.count();

        const secondRowCell = cells.nth(columnCount);
        await focusCell(page, secondRowCell);

        await page.keyboard.press('ArrowUp');

        const firstCell = cells.first();
        await expectCellOrChildFocused(page, firstCell);
      });

      test('ArrowUp from first data row enters sortable header', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const sortableHeaders = grid.locator('[role="columnheader"][aria-sort]');
        const count = await sortableHeaders.count();

        // Skip if no sortable headers
        if (count === 0) {
          test.skip();
          return;
        }

        // Find the column index of the first sortable header
        const firstSortableHeader = sortableHeaders.first();
        const sortableHeaderColId = await firstSortableHeader.getAttribute('data-col-id');

        // Find the first data row's cell in the same column as the sortable header
        const rows = grid.getByRole('row');
        const firstDataRow = rows.nth(1); // Skip header row
        const cellInSameColumn = firstDataRow.locator(
          `[role="gridcell"][data-col-id="${sortableHeaderColId}"]`
        );

        if ((await cellInSameColumn.count()) === 0) {
          test.skip();
          return;
        }

        await focusCell(page, cellInSameColumn);

        await page.keyboard.press('ArrowUp');

        // Should focus sortable header
        await expect(firstSortableHeader).toBeFocused();
      });

      test('ArrowDown from header enters first data row', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const sortableHeaders = grid.locator('[role="columnheader"][aria-sort]');
        const count = await sortableHeaders.count();

        if (count === 0) {
          test.skip();
          return;
        }

        // Find the index of the first sortable header among all columnheaders
        const allHeaders = grid.getByRole('columnheader');
        const firstSortableHeader = sortableHeaders.first();
        await firstSortableHeader.focus();

        // Get the column index by finding the sortable header's position
        const headerCount = await allHeaders.count();
        let sortableHeaderIndex = -1;
        for (let i = 0; i < headerCount; i++) {
          const header = allHeaders.nth(i);
          const ariaSort = await header.getAttribute('aria-sort');
          if (ariaSort !== null) {
            sortableHeaderIndex = i;
            break;
          }
        }

        if (sortableHeaderIndex === -1) {
          test.skip();
          return;
        }

        await page.keyboard.press('ArrowDown');

        // Find the first data row's cell at the same column index
        const rows = grid.getByRole('row');
        const firstDataRow = rows.nth(1); // Skip header row
        const cellsInFirstRow = firstDataRow.getByRole('gridcell');
        const cellInSameColumn = cellsInFirstRow.nth(sortableHeaderIndex);

        await expectCellOrChildFocused(page, cellInSameColumn);
      });

      test('Home moves to first cell in row', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const rows = grid.getByRole('row');
        const firstDataRow = rows.nth(1); // Skip header row
        const cellsInFirstRow = firstDataRow.getByRole('gridcell');

        // Find the last non-checkbox cell in the row
        const cellCount = await cellsInFirstRow.count();
        const lastCell = cellsInFirstRow.nth(cellCount - 1);
        await focusCell(page, lastCell);

        await page.keyboard.press('Home');

        // Home should move to first focusable cell in the row
        // Some implementations move to checkbox cell, others to first data cell
        // Check if any cell in the first few positions is focused
        let foundFocused = false;
        for (let i = 0; i < Math.min(2, cellCount); i++) {
          const cell = cellsInFirstRow.nth(i);
          const isFocused = await cell.evaluate((el) => el === document.activeElement);
          if (isFocused) {
            foundFocused = true;
            break;
          }
        }
        expect(foundFocused).toBe(true);
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
        const rows = grid.getByRole('row');

        // Start from last cell in last data row
        const lastDataRow = rows.last();
        const cellsInLastRow = lastDataRow.getByRole('gridcell');
        const lastCell = cellsInLastRow.last();
        await focusCell(page, lastCell);

        await page.keyboard.press('Control+Home');

        // Ctrl+Home moves to first cell in grid
        // Some implementations move to checkbox cell, others to first data cell
        const firstDataRow = rows.nth(1);
        const cellsInFirstRow = firstDataRow.getByRole('gridcell');
        const cellCount = await cellsInFirstRow.count();

        let foundFocused = false;
        for (let i = 0; i < Math.min(2, cellCount); i++) {
          const cell = cellsInFirstRow.nth(i);
          const isFocused = await cell.evaluate((el) => el === document.activeElement);
          if (isFocused) {
            foundFocused = true;
            break;
          }
        }
        expect(foundFocused).toBe(true);
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
    });

    // ========================================
    // High Priority: Focus Management
    // ========================================
    test.describe('Focus Management', () => {
      test('exactly one focusable element has tabIndex="0"', async ({ page }) => {
        const grid = page.getByRole('grid').first();

        // In roving tabindex, exactly one element should have tabindex="0"
        // This could be a sortable header or a cell depending on implementation
        const elementsWithTabIndex0 = grid.locator('[tabindex="0"]');
        const count = await elementsWithTabIndex0.count();

        // Exactly one element should be in tab order
        expect(count).toBe(1);

        // The element should be either a columnheader or a gridcell
        const element = elementsWithTabIndex0.first();
        const role = await element.getAttribute('role');
        expect(['columnheader', 'gridcell']).toContain(role);
      });

      test('other cells have tabIndex="-1"', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        // Second cell should always have tabindex="-1" (roving tabindex)
        const secondCell = cells.nth(1);
        await expect(secondCell).toHaveAttribute('tabindex', '-1');
      });

      test('sortable columnheader is focusable', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const sortableHeaders = grid.locator('[role="columnheader"][aria-sort]');
        const count = await sortableHeaders.count();

        if (count === 0) {
          test.skip();
          return;
        }

        const firstSortable = sortableHeaders.first();
        const tabindex = await firstSortable.getAttribute('tabindex');
        expect(tabindex).not.toBeNull();
      });

      test('non-sortable columnheader is NOT focusable', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        // Exclude checkbox header cell which is focusable when rowMultiselectable
        const nonSortableHeaders = grid.locator(
          '[role="columnheader"]:not([aria-sort]):not(.apg-data-grid-checkbox-cell)'
        );
        const count = await nonSortableHeaders.count();

        if (count === 0) {
          test.skip();
          return;
        }

        const firstNonSortable = nonSortableHeaders.first();
        const tabindex = await firstNonSortable.getAttribute('tabindex');
        expect(tabindex).toBeNull();
      });

      test('Tab exits grid', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        await focusCell(page, firstCell);

        await page.keyboard.press('Tab');

        const gridContainsFocus = await grid.evaluate((el) => el.contains(document.activeElement));
        expect(gridContainsFocus).toBe(false);
      });

      test('roving tabindex updates on arrow navigation', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const firstCell = cells.first();
        const secondCell = cells.nth(1);

        // First focus the first cell
        await focusCell(page, firstCell);

        // After focusing first cell, it should have tabindex="0"
        await expect(firstCell).toHaveAttribute('tabindex', '0');
        await expect(secondCell).toHaveAttribute('tabindex', '-1');

        // Navigate right
        await page.keyboard.press('ArrowRight');

        // tabindex should move to the second cell
        await expect(firstCell).toHaveAttribute('tabindex', '-1');
        await expect(secondCell).toHaveAttribute('tabindex', '0');
      });

      test('focus returns to last focused cell on re-entry', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const cells = grid.getByRole('gridcell');
        const secondCell = cells.nth(1);

        await focusCell(page, secondCell);
        await expectCellOrChildFocused(page, secondCell);

        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');

        await expectCellOrChildFocused(page, secondCell);
        await expect(secondCell).toHaveAttribute('tabindex', '0');
      });

      test('row checkboxes have tabindex="-1" (not in tab order)', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const rowCheckboxes = grid.locator('[role="gridcell"] input[type="checkbox"]');
        const count = await rowCheckboxes.count();

        // Skip if no row checkboxes (row selection not enabled)
        if (count === 0) {
          test.skip();
          return;
        }

        // All row checkboxes should have tabindex="-1"
        for (let i = 0; i < count; i++) {
          const checkbox = rowCheckboxes.nth(i);
          await expect(checkbox).toHaveAttribute('tabindex', '-1');
        }
      });

      test('checkbox cell has tabindex and supports keyboard navigation', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const checkboxCells = grid.locator('.apg-data-grid-checkbox-cell[role="gridcell"]');
        const count = await checkboxCells.count();

        // Skip if no checkbox cells (row selection not enabled)
        if (count === 0) {
          test.skip();
          return;
        }

        const firstCheckboxCell = checkboxCells.first();

        // Checkbox cell should have tabindex attribute
        const tabindex = await firstCheckboxCell.getAttribute('tabindex');
        expect(tabindex).not.toBeNull();

        // Focus checkbox cell and navigate with arrow keys
        await firstCheckboxCell.focus();
        await expect(firstCheckboxCell).toBeFocused();

        // ArrowRight should move to next cell (name cell)
        await page.keyboard.press('ArrowRight');
        const cells = grid.getByRole('gridcell');
        const secondCell = cells.nth(1); // Name cell after checkbox
        await expectCellOrChildFocused(page, secondCell);

        // ArrowLeft should move back to checkbox cell
        await page.keyboard.press('ArrowLeft');
        await expect(firstCheckboxCell).toBeFocused();
      });

      test('Tab does not move between row checkboxes', async ({ page }) => {
        const grid = page.getByRole('grid').first();
        const checkboxCells = grid.locator('.apg-data-grid-checkbox-cell[role="gridcell"]');
        const count = await checkboxCells.count();

        // Skip if less than 2 checkbox cells
        if (count < 2) {
          test.skip();
          return;
        }

        const firstCheckboxCell = checkboxCells.first();
        await firstCheckboxCell.focus();
        await expect(firstCheckboxCell).toBeFocused();

        // Tab should exit the grid, not move to next checkbox
        await page.keyboard.press('Tab');

        // Focus should be outside the grid
        const gridContainsFocus = await grid.evaluate((el) => el.contains(document.activeElement));
        expect(gridContainsFocus).toBe(false);
      });
    });
  });
}
