import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Table Pattern
 *
 * Test coverage based on APG Table pattern and llm.md Test Checklist:
 *
 * High Priority: ARIA Structure
 * - Container has role="table"
 * - All rows have role="row"
 * - Data cells have role="cell"
 * - Column headers have role="columnheader"
 * - Row headers have role="rowheader" (when present)
 * - Groups have role="rowgroup" (when present)
 *
 * High Priority: Accessible Name
 * - Table has accessible name via aria-label
 *
 * High Priority: Sort State
 * - Sorted column has aria-sort="ascending" or "descending"
 * - Unsorted sortable columns have aria-sort="none"
 * - Sort changes update aria-sort attribute
 *
 * Medium Priority: Virtualization
 * - aria-rowcount matches total rows
 * - aria-rowindex is 1-based on rows
 *
 * Medium Priority: Cell Spanning
 * - aria-colspan is set when cell spans >1 columns
 * - aria-rowspan is set when cell spans >1 rows
 * - Visual spanning matches ARIA attributes
 *
 * Medium Priority: Accessibility
 * - No axe-core violations (WCAG 2.1 AA)
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Table (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/table/${framework}/`);
      // Wait for first table to be visible instead of networkidle (more stable)
      await expect(page.locator('[role="table"]').first()).toBeVisible();
    });

    // =========================================================================
    // High Priority: ARIA Structure
    // =========================================================================
    test.describe('APG: ARIA Structure', () => {
      test('required demos are present (sortable, row headers, spanning)', async ({ page }) => {
        // Verify all required demo tables are present
        await expect(page.locator('[role="table"][aria-label="Sortable User List"]')).toBeVisible();
        await expect(
          page.locator('[role="table"][aria-label="User List with Row Headers"]')
        ).toBeVisible();
        await expect(page.locator('[role="table"][aria-label*="Spanning"]')).toBeVisible();
      });

      test('has role="table" on container', async ({ page }) => {
        const tables = page.locator('[role="table"]');
        await expect(tables.first()).toBeVisible();
        // Multiple tables on the demo page
        expect(await tables.count()).toBeGreaterThanOrEqual(1);
      });

      test('has role="row" on all rows', async ({ page }) => {
        // Check the basic table (first one)
        const basicTable = page.locator('[role="table"][aria-label="User List"]');
        await expect(basicTable).toBeVisible();

        const rows = basicTable.locator('[role="row"]');
        // 1 header row + 5 data rows = 6 rows
        await expect(rows).toHaveCount(6);
      });

      test('has role="columnheader" on header cells', async ({ page }) => {
        const basicTable = page.locator('[role="table"][aria-label="User List"]');
        await expect(basicTable).toBeVisible();

        const headers = basicTable.locator('[role="columnheader"]');
        // 3 columns: Name, Age, City
        await expect(headers).toHaveCount(3);
        await expect(headers.nth(0)).toContainText('Name');
        await expect(headers.nth(1)).toContainText('Age');
        await expect(headers.nth(2)).toContainText('City');
      });

      test('has role="cell" on data cells', async ({ page }) => {
        const basicTable = page.locator('[role="table"][aria-label="User List"]');
        await expect(basicTable).toBeVisible();

        const cells = basicTable.locator('[role="cell"]');
        // 5 rows x 3 columns = 15 cells
        await expect(cells).toHaveCount(15);
      });

      test('has role="rowgroup" for header and body sections', async ({ page }) => {
        const basicTable = page.locator('[role="table"][aria-label="User List"]');
        await expect(basicTable).toBeVisible();

        const rowgroups = basicTable.locator('[role="rowgroup"]');
        // 2 rowgroups: header and body
        await expect(rowgroups).toHaveCount(2);
      });

      test('has role="rowheader" when hasRowHeader is true', async ({ page }) => {
        // Use the table with row headers
        const rowHeaderTable = page.locator(
          '[role="table"][aria-label="User List with Row Headers"]'
        );
        await expect(rowHeaderTable).toBeVisible();

        const rowheaders = rowHeaderTable.locator('[role="rowheader"]');
        // 3 data rows with row headers
        await expect(rowheaders).toHaveCount(3);

        // Verify the first row header contains expected content
        await expect(rowheaders.first()).toContainText('Alice');
      });
    });

    // =========================================================================
    // High Priority: Accessible Name
    // =========================================================================
    test.describe('APG: Accessible Name', () => {
      test('table has accessible name via aria-label', async ({ page }) => {
        const basicTable = page.locator('[role="table"][aria-label="User List"]');
        await expect(basicTable).toBeVisible();
        await expect(basicTable).toHaveAttribute('aria-label', 'User List');
      });

      test('all tables have accessible names', async ({ page }) => {
        const tables = page.locator('[role="table"]');
        const count = await tables.count();

        for (let i = 0; i < count; i++) {
          const table = tables.nth(i);
          const ariaLabel = await table.getAttribute('aria-label');
          const ariaLabelledby = await table.getAttribute('aria-labelledby');
          // Each table must have either aria-label or aria-labelledby
          expect(ariaLabel || ariaLabelledby).toBeTruthy();
        }
      });
    });

    // =========================================================================
    // High Priority: Sort State
    // =========================================================================
    test.describe('APG: Sort State', () => {
      test('sorted column has aria-sort="ascending"', async ({ page }) => {
        const sortableTable = page.locator('[role="table"][aria-label="Sortable User List"]');
        await expect(sortableTable).toBeVisible();

        // Name column is initially sorted ascending
        const nameHeader = sortableTable
          .locator('[role="columnheader"]')
          .filter({ hasText: 'Name' });
        await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
      });

      test('unsorted sortable columns have aria-sort="none"', async ({ page }) => {
        const sortableTable = page.locator('[role="table"][aria-label="Sortable User List"]');
        await expect(sortableTable).toBeVisible();

        // Age and City columns should have aria-sort="none"
        const ageHeader = sortableTable.locator('[role="columnheader"]').filter({ hasText: 'Age' });
        const cityHeader = sortableTable
          .locator('[role="columnheader"]')
          .filter({ hasText: 'City' });

        await expect(ageHeader).toHaveAttribute('aria-sort', 'none');
        await expect(cityHeader).toHaveAttribute('aria-sort', 'none');
      });

      test('clicking sort button changes aria-sort', async ({ page }) => {
        const sortableTable = page.locator('[role="table"][aria-label="Sortable User List"]');
        await expect(sortableTable).toBeVisible();

        const ageHeader = sortableTable.locator('[role="columnheader"]').filter({ hasText: 'Age' });
        const sortButton = ageHeader.locator('button');

        // Initially none
        await expect(ageHeader).toHaveAttribute('aria-sort', 'none');

        // Click to sort ascending
        await sortButton.click();
        await expect(ageHeader).toHaveAttribute('aria-sort', 'ascending');

        // Name should now be none
        const nameHeader = sortableTable
          .locator('[role="columnheader"]')
          .filter({ hasText: 'Name' });
        await expect(nameHeader).toHaveAttribute('aria-sort', 'none');

        // Click again to sort descending
        await sortButton.click();
        await expect(ageHeader).toHaveAttribute('aria-sort', 'descending');
      });

      test('data rows are reordered when sort changes', async ({ page }) => {
        const sortableTable = page.locator('[role="table"][aria-label="Sortable User List"]');
        await expect(sortableTable).toBeVisible();

        // Click Age column to sort ascending (youngest first)
        const ageHeader = sortableTable.locator('[role="columnheader"]').filter({ hasText: 'Age' });
        await ageHeader.locator('button').click();

        // The first data row should now have the youngest person (Bob, 25)
        // Use toContainText to handle whitespace variations
        const firstCell = sortableTable.locator(
          '[role="rowgroup"]:last-child [role="row"]:first-child [role="cell"]:first-child'
        );
        await expect(firstCell).toContainText('Bob');
      });
    });

    // =========================================================================
    // Medium Priority: Virtualization
    // =========================================================================
    test.describe('APG: Virtualization', () => {
      test('aria-rowcount indicates total rows', async ({ page }) => {
        const virtualizedTable = page.locator('[role="table"][aria-label*="Virtualized"]');
        await expect(virtualizedTable).toBeVisible();

        // Total rows is set to totalRows prop value (100 data rows, not including header)
        await expect(virtualizedTable).toHaveAttribute('aria-rowcount', '100');
      });

      test('aria-colcount indicates total columns', async ({ page }) => {
        const virtualizedTable = page.locator('[role="table"][aria-label*="Virtualized"]');
        await expect(virtualizedTable).toBeVisible();

        await expect(virtualizedTable).toHaveAttribute('aria-colcount', '3');
      });

      test('data rows have aria-rowindex indicating position', async ({ page }) => {
        const virtualizedTable = page.locator('[role="table"][aria-label*="Virtualized"]');
        await expect(virtualizedTable).toBeVisible();

        // Data rows have rowIndex values from the demo data (5, 6, 7, 8, 9)
        const dataRows = virtualizedTable.locator('[role="rowgroup"]:last-child [role="row"]');
        await expect(dataRows.nth(0)).toHaveAttribute('aria-rowindex', '5');
        await expect(dataRows.nth(1)).toHaveAttribute('aria-rowindex', '6');
        await expect(dataRows.nth(2)).toHaveAttribute('aria-rowindex', '7');
        await expect(dataRows.nth(3)).toHaveAttribute('aria-rowindex', '8');
        await expect(dataRows.nth(4)).toHaveAttribute('aria-rowindex', '9');
      });

      test('cells have aria-colindex indicating column position', async ({ page }) => {
        const virtualizedTable = page.locator('[role="table"][aria-label*="Virtualized"]');
        await expect(virtualizedTable).toBeVisible();

        // First row cells should have colindex 1, 2, 3
        const firstRowCells = virtualizedTable.locator(
          '[role="rowgroup"]:last-child [role="row"]:first-child [role="cell"]'
        );
        await expect(firstRowCells.nth(0)).toHaveAttribute('aria-colindex', '1');
        await expect(firstRowCells.nth(1)).toHaveAttribute('aria-colindex', '2');
        await expect(firstRowCells.nth(2)).toHaveAttribute('aria-colindex', '3');
      });
    });

    // =========================================================================
    // Medium Priority: Cell Spanning
    // =========================================================================
    test.describe('APG: Cell Spanning', () => {
      test('aria-colspan and aria-rowspan attributes are present', async ({ page }) => {
        const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
        await expect(spanningTable).toBeVisible();

        // Verify colspan attributes exist
        const colspanCells = spanningTable.locator('[aria-colspan]');
        await expect(colspanCells).toHaveCount(2); // N/A (colspan=2) and Total (colspan=4)

        // Verify rowspan attributes exist
        const rowspanCells = spanningTable.locator('[aria-rowspan]');
        await expect(rowspanCells).toHaveCount(1); // Electronics (rowspan=2)

        // Verify specific values
        await expect(spanningTable.locator('[aria-colspan="2"]')).toHaveCount(1);
        await expect(spanningTable.locator('[aria-colspan="4"]')).toHaveCount(1);
        await expect(spanningTable.locator('[aria-rowspan="2"]')).toHaveCount(1);
      });

      test('colspan=2 cell is visually wider than single column header', async ({ page }) => {
        const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
        await expect(spanningTable).toBeVisible();

        const colspanCell = spanningTable.locator('[aria-colspan="2"]').first();
        await expect(colspanCell).toBeVisible();

        // Use header cell as reference (more consistent sizing than data cells)
        const headerCell = spanningTable.locator('[role="columnheader"]').first();
        await expect(headerCell).toBeVisible();

        // Wait for layout to stabilize and verify colspan cell is wider
        // Using header width as baseline: colspan=2 should be ~2x header width
        await expect
          .poll(
            async () => {
              const [colspanBox, headerBox] = await Promise.all([
                colspanCell.boundingBox(),
                headerCell.boundingBox(),
              ]);
              if (!colspanBox || !headerBox || headerBox.width === 0) return 0;
              return colspanBox.width / headerBox.width;
            },
            { timeout: 5000 }
          )
          .toBeGreaterThan(1.5); // Allow some tolerance for padding/borders
      });

      test('colspan=4 cell spans most of the table width', async ({ page }) => {
        const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
        await expect(spanningTable).toBeVisible();

        const fullSpanCell = spanningTable.locator('[aria-colspan="4"]').first();
        await expect(fullSpanCell).toBeVisible();

        // Use header cell as reference
        const headerCell = spanningTable.locator('[role="columnheader"]').first();
        await expect(headerCell).toBeVisible();

        // colspan=4 should be significantly wider than a single header
        await expect
          .poll(
            async () => {
              const [fullSpanBox, headerBox] = await Promise.all([
                fullSpanCell.boundingBox(),
                headerCell.boundingBox(),
              ]);
              if (!fullSpanBox || !headerBox || headerBox.width === 0) return 0;
              return fullSpanBox.width / headerBox.width;
            },
            { timeout: 5000 }
          )
          .toBeGreaterThan(3.0); // Should be ~4x but allow tolerance
      });

      test('rowspan=2 cell is visually taller than single row', async ({ page }) => {
        const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
        await expect(spanningTable).toBeVisible();

        const rowspanCell = spanningTable.locator('[aria-rowspan="2"]').first();
        await expect(rowspanCell).toBeVisible();

        // Use a normal data cell in the same table as reference
        const normalCell = spanningTable
          .locator('[role="cell"]:not([aria-colspan]):not([aria-rowspan])')
          .first();
        await expect(normalCell).toBeVisible();

        // rowspan=2 should be ~2x the height of a normal cell
        await expect
          .poll(
            async () => {
              const [rowspanBox, normalBox] = await Promise.all([
                rowspanCell.boundingBox(),
                normalCell.boundingBox(),
              ]);
              if (!rowspanBox || !normalBox || normalBox.height === 0) return 0;
              return rowspanBox.height / normalBox.height;
            },
            { timeout: 5000 }
          )
          .toBeGreaterThan(1.5); // Allow some tolerance
      });
    });

    // =========================================================================
    // Medium Priority: Accessibility
    // =========================================================================
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[role="table"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}
