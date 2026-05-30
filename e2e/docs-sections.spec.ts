import { test, expect } from '@playwright/test';

/**
 * Smoke test: every pattern page renders the expected documentation sections
 * and the global footer.
 *
 * Asserts presence of `data-section` markers added to the conditional render
 * blocks in `src/pages/patterns/[pattern]/[framework]/index.astro` and its
 * Japanese counterpart. Catches silent loss of TestingDocs / NativeHtmlNotice
 * / ComparisonSection rendering that `npm run build` cannot detect on its own.
 *
 * Crawls 32 patterns × 2 locales = 64 pages using the `react` framework as a
 * representative.
 */

const ALL_PATTERNS = [
  'accordion',
  'alert',
  'alert-dialog',
  'breadcrumb',
  'button',
  'carousel',
  'checkbox',
  'combobox',
  'data-grid',
  'dialog',
  'disclosure',
  'feed',
  'grid',
  'landmarks',
  'link',
  'listbox',
  'menu-button',
  'menubar',
  'meter',
  'radio',
  'slider',
  'slider-multithumb',
  'spinbutton',
  'switch',
  'table',
  'tabs',
  'toggle-button',
  'toolbar',
  'tooltip',
  'treegrid',
  'treeview',
  'windowsplitter',
] as const;

const NATIVE_HTML_PATTERNS = new Set<string>([
  'button',
  'checkbox',
  'combobox',
  'disclosure',
  'landmarks',
  'link',
  'meter',
  'radio',
  'slider',
  'spinbutton',
  'table',
]);

const COMPARISON_PATTERNS = new Set<string>(['data-grid', 'grid']);

const LOCALES = [
  { prefix: '', label: 'en' },
  { prefix: 'ja/', label: 'ja' },
] as const;

for (const locale of LOCALES) {
  test.describe(`Pattern docs sections (${locale.label})`, () => {
    for (const pattern of ALL_PATTERNS) {
      test(`${pattern}: renders required sections and footer`, async ({ page }) => {
        await page.goto(`${locale.prefix}patterns/${pattern}/react/`);
        await page.waitForLoadState('networkidle');

        await expect(page.locator('footer[data-slot="footer"]')).toHaveCount(1);
        await expect(page.locator('[data-section="testing-docs"]')).toHaveCount(1);

        const expectedNativeHtml = NATIVE_HTML_PATTERNS.has(pattern) ? 1 : 0;
        await expect(page.locator('[data-section="native-html"]')).toHaveCount(expectedNativeHtml);

        const expectedComparison = COMPARISON_PATTERNS.has(pattern) ? 1 : 0;
        await expect(page.locator('[data-section="comparison"]')).toHaveCount(expectedComparison);
      });
    }
  });
}
