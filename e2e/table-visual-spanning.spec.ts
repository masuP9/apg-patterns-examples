import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Table Visual Cell Spanning
 *
 * These tests verify that colspan and rowspan are visually rendered correctly
 * by measuring actual element dimensions in a real browser.
 *
 * Test coverage:
 * - colspan cells have proportionally larger widths
 * - rowspan cells have proportionally larger heights
 * - Combined colspan + rowspan cells have correct dimensions
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Table Visual Spanning (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      // Use relative path (no leading /) to preserve baseURL path component
      await page.goto(`patterns/table/${framework}/`);
      // Wait for the page to fully load
      await page.waitForLoadState('networkidle');
    });

    test('colspan=2 cell has approximately 2x width of normal cell', async ({ page }) => {
      // Find the spanning cells demo section (has aria-label containing "Spanning")
      const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
      await expect(spanningTable).toBeVisible();

      // Find a cell with colspan=2 (N/A cell in Clothing row)
      const colspanCell = spanningTable.locator('[aria-colspan="2"]').first();
      await expect(colspanCell).toBeVisible();

      // Find a normal cell (without colspan) in the same table for comparison
      // Get cells from the body rows that don't have colspan
      const normalCell = spanningTable
        .locator(
          '[role="rowgroup"]:last-child [role="cell"]:not([aria-colspan]):not([aria-rowspan])'
        )
        .first();
      await expect(normalCell).toBeVisible();

      const colspanBox = await colspanCell.boundingBox();
      const normalBox = await normalCell.boundingBox();

      expect(colspanBox).not.toBeNull();
      expect(normalBox).not.toBeNull();

      // colspan=2 should be approximately 2x width (allowing 20% tolerance for gaps/borders)
      expect(colspanBox!.width).toBeGreaterThan(normalBox!.width * 1.8);
      expect(colspanBox!.width).toBeLessThan(normalBox!.width * 2.3);
    });

    test('colspan=4 cell spans most of the table width', async ({ page }) => {
      const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
      await expect(spanningTable).toBeVisible();

      // Find the Total cell with colspan=4
      const fullSpanCell = spanningTable.locator('[aria-colspan="4"]').first();
      await expect(fullSpanCell).toBeVisible();

      // Find a normal cell for comparison
      const normalCell = spanningTable
        .locator(
          '[role="rowgroup"]:last-child [role="cell"]:not([aria-colspan]):not([aria-rowspan])'
        )
        .first();
      await expect(normalCell).toBeVisible();

      const fullSpanBox = await fullSpanCell.boundingBox();
      const normalBox = await normalCell.boundingBox();

      expect(fullSpanBox).not.toBeNull();
      expect(normalBox).not.toBeNull();

      // colspan=4 should be approximately 4x width
      expect(fullSpanBox!.width).toBeGreaterThan(normalBox!.width * 3.5);
      expect(fullSpanBox!.width).toBeLessThan(normalBox!.width * 4.5);
    });

    test('rowspan=2 cell has approximately 2x height of normal cell', async ({ page }) => {
      const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
      await expect(spanningTable).toBeVisible();

      // Find the Electronics cell with rowspan=2
      const rowspanCell = spanningTable.locator('[aria-rowspan="2"]').first();
      await expect(rowspanCell).toBeVisible();

      // Find a normal cell in an adjacent column for height comparison
      const normalCell = spanningTable
        .locator(
          '[role="rowgroup"]:last-child [role="cell"]:not([aria-colspan]):not([aria-rowspan])'
        )
        .first();
      await expect(normalCell).toBeVisible();

      const rowspanBox = await rowspanCell.boundingBox();
      const normalBox = await normalCell.boundingBox();

      expect(rowspanBox).not.toBeNull();
      expect(normalBox).not.toBeNull();

      // rowspan=2 should be approximately 2x height (allowing tolerance for gaps)
      expect(rowspanBox!.height).toBeGreaterThan(normalBox!.height * 1.8);
      expect(rowspanBox!.height).toBeLessThan(normalBox!.height * 2.3);
    });

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

    test('cells with spanning have correct grid-column/grid-row styles', async ({ page }) => {
      const spanningTable = page.locator('[role="table"][aria-label*="Spanning"]');
      await expect(spanningTable).toBeVisible();

      // Check colspan=2 cell has grid-column: span 2
      const colspanCell = spanningTable.locator('[aria-colspan="2"]').first();
      const colspanStyle = await colspanCell.evaluate((el) => getComputedStyle(el).gridColumn);
      expect(colspanStyle).toContain('span 2');

      // Check rowspan=2 cell has grid-row: span 2
      const rowspanCell = spanningTable.locator('[aria-rowspan="2"]').first();
      const rowspanStyle = await rowspanCell.evaluate((el) => getComputedStyle(el).gridRow);
      expect(rowspanStyle).toContain('span 2');
    });
  });
}
