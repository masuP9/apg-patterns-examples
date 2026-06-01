import { test, expect } from '@playwright/test';
import { getPatterns } from '../src/lib/patterns';

/**
 * Smoke test: the guide page lists every pattern and its definition file,
 * driven by `getPatterns()` (single source of truth) rather than a
 * hardcoded list.
 *
 * Guards against the regression in #219 where the guide drifted from the
 * actual pattern set (28 hardcoded vs 32 real). Expected counts are derived
 * from `getPatterns()` so adding a 33rd pattern needs no test edit.
 *
 * Framework-independent, so it follows the `docs-sections.spec.ts` convention
 * of `(en)` / `(ja)` describe blocks and runs via the non-filtered
 * `test:e2e:guide` script.
 */

const patterns = getPatterns();
const expectedCount = patterns.length;

// Patterns that were missing from the old hardcoded guide (#219).
const PREVIOUSLY_MISSING = ['data-grid', 'slider-multithumb', 'toggle-button'];

const LOCALES = [
  { prefix: '', label: 'en' },
  { prefix: 'ja/', label: 'ja' },
] as const;

for (const locale of LOCALES) {
  test.describe(`Guide page (${locale.label})`, () => {
    test(`lists all ${expectedCount} patterns as cards`, async ({ page }) => {
      await page.goto(`${locale.prefix}guide/`);
      await page.waitForLoadState('networkidle');

      const cards = page.locator('[data-testid="guide-pattern-cards"] > a');
      await expect(cards).toHaveCount(expectedCount);
    });

    test(`lists all ${expectedCount} definition file links incl. previously-missing patterns`, async ({
      page,
    }) => {
      await page.goto(`${locale.prefix}guide/`);
      await page.waitForLoadState('networkidle');

      const links = page.locator('[data-testid="guide-definition-links"] a');
      await expect(links).toHaveCount(expectedCount);

      const hrefs = await links.evaluateAll((els) =>
        els.map((el) => el.getAttribute('href') ?? '')
      );

      for (const id of PREVIOUSLY_MISSING) {
        const suffix = locale.label === 'ja' ? `${id}/${id}.ja.md` : `${id}/${id}.md`;
        expect(hrefs.some((href) => href.endsWith(suffix))).toBe(true);
      }
    });

    test('every definition file link resolves with 200', async ({ page, request }) => {
      await page.goto(`${locale.prefix}guide/`);
      await page.waitForLoadState('networkidle');

      const links = page.locator('[data-testid="guide-definition-links"] a');
      const hrefs = await links.evaluateAll((els) =>
        els.map((el) => el.getAttribute('href') ?? '')
      );

      expect(hrefs).toHaveLength(expectedCount);

      for (const href of hrefs) {
        const response = await request.get(href);
        expect(response.status(), `${href} should return 200`).toBe(200);
      }
    });
  });
}
