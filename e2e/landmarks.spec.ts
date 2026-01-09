import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Landmarks Pattern
 *
 * These tests verify the landmark structure and accessibility
 * across all framework implementations.
 *
 * Note: Tests use isolated demo pages (/patterns/landmarks/{framework}/demo/) that render
 * only the LandmarkDemo component without the site layout. This ensures proper
 * landmark semantics are preserved (e.g., <header> retains its implicit banner role).
 *
 * Note: Landmarks are static structural elements without JavaScript
 * interaction, so these tests primarily verify:
 * - Correct landmark roles are present
 * - Proper labeling of landmarks
 * - No accessibility violations
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Landmarks (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      // Use isolated demo page without site layout
      await page.goto(`patterns/landmarks/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    test.describe('Landmark Roles', () => {
      test('demo has banner landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const banner = demo.getByRole('banner');
        await expect(banner).toBeVisible();
      });

      test('demo has navigation landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const navs = demo.getByRole('navigation');
        await expect(navs.first()).toBeVisible();
      });

      test('demo has main landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const main = demo.getByRole('main');
        await expect(main).toBeVisible();
      });

      test('demo has contentinfo landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const contentinfo = demo.getByRole('contentinfo');
        await expect(contentinfo).toBeVisible();
      });

      test('demo has complementary landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const aside = demo.getByRole('complementary');
        await expect(aside).toBeVisible();
      });

      test('demo has region landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const region = demo.getByRole('region');
        await expect(region).toBeVisible();
      });

      test('demo has search landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const search = demo.getByRole('search');
        await expect(search).toBeVisible();
      });

      test('demo has form landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const form = demo.getByRole('form');
        await expect(form).toBeVisible();
      });

      test('demo has exactly one main landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const mains = demo.getByRole('main');
        await expect(mains).toHaveCount(1);
      });

      test('demo has exactly one banner landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const banners = demo.getByRole('banner');
        await expect(banners).toHaveCount(1);
      });

      test('demo has exactly one contentinfo landmark', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const contentinfos = demo.getByRole('contentinfo');
        await expect(contentinfos).toHaveCount(1);
      });
    });

    test.describe('Landmark Labeling', () => {
      test('navigation landmarks have unique accessible names', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const navs = demo.getByRole('navigation');
        const count = await navs.count();

        if (count > 1) {
          const names: string[] = [];
          for (let i = 0; i < count; i++) {
            const nav = navs.nth(i);
            const name = await nav.getAttribute('aria-label');
            if (name) names.push(name);
          }
          const uniqueNames = new Set(names);
          expect(uniqueNames.size).toBe(count);
        }
      });

      test('region landmark has accessible name', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const region = demo.getByRole('region');
        // Match any non-empty accessible name
        await expect(region).toHaveAccessibleName(/.+/);
      });

      test('search landmark has accessible name', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const search = demo.getByRole('search');
        await expect(search).toHaveAccessibleName(/.+/);
      });

      test('form landmark has accessible name', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const form = demo.getByRole('form');
        await expect(form).toHaveAccessibleName(/.+/);
      });

      test('complementary landmark has accessible name', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const aside = demo.getByRole('complementary');
        await expect(aside).toHaveAccessibleName(/.+/);
      });
    });

    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        // Focus on the landmark demo area
        const demo = page.locator('.apg-landmark-demo');
        await expect(demo).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('.apg-landmark-demo')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });

    test.describe('Visual Labels', () => {
      test('landmark labels are visible when showLabels is enabled', async ({ page }) => {
        // Look for the toggle button or check if labels are visible
        const labels = page.locator('.apg-landmark-label');

        // If the demo shows labels by default
        const labelCount = await labels.count();
        if (labelCount > 0) {
          // Check at least some labels are visible
          await expect(labels.first()).toBeVisible();
        }
      });
    });

    test.describe('Accessibility Tree Structure', () => {
      test('main landmark contains region, search, form, and complementary', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const main = demo.getByRole('main');

        // Verify main contains expected child landmarks
        await expect(main.getByRole('region')).toBeVisible();
        await expect(main.getByRole('search')).toBeVisible();
        await expect(main.getByRole('form')).toBeVisible();
        await expect(main.getByRole('complementary')).toBeVisible();
      });

      test('banner contains main navigation', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const banner = demo.getByRole('banner');

        // Verify banner contains navigation with "Main" label
        const mainNav = banner.getByRole('navigation', { name: 'Main' });
        await expect(mainNav).toBeVisible();

        // Verify navigation has links
        await expect(mainNav.getByRole('link', { name: 'Home' })).toBeVisible();
        await expect(mainNav.getByRole('link', { name: 'About' })).toBeVisible();
        await expect(mainNav.getByRole('link', { name: 'Contact' })).toBeVisible();
      });

      test('contentinfo contains footer navigation', async ({ page }) => {
        const demo = page.locator('.apg-landmark-demo');
        const contentinfo = demo.getByRole('contentinfo');

        // Verify contentinfo contains navigation with "Footer" label
        const footerNav = contentinfo.getByRole('navigation', { name: 'Footer' });
        await expect(footerNav).toBeVisible();

        // Verify navigation has links
        await expect(footerNav.getByRole('link', { name: 'Privacy' })).toBeVisible();
        await expect(footerNav.getByRole('link', { name: 'Terms' })).toBeVisible();
        await expect(footerNav.getByRole('link', { name: 'Sitemap' })).toBeVisible();
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Landmarks - Cross-framework Consistency', () => {
  test('all frameworks render same landmark structure', async ({ page }) => {
    const landmarkCounts: Record<string, Record<string, number>> = {};

    for (const framework of frameworks) {
      // Use isolated demo page without site layout
      await page.goto(`patterns/landmarks/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      // Scope all queries to the demo component
      const demo = page.locator('.apg-landmark-demo');

      landmarkCounts[framework] = {
        banner: await demo.getByRole('banner').count(),
        navigation: await demo.getByRole('navigation').count(),
        main: await demo.getByRole('main').count(),
        contentinfo: await demo.getByRole('contentinfo').count(),
        complementary: await demo.getByRole('complementary').count(),
        region: await demo.getByRole('region').count(),
        search: await demo.getByRole('search').count(),
        form: await demo.getByRole('form').count(),
      };
    }

    // All frameworks should have the same counts
    const reactCounts = landmarkCounts['react'];
    for (const framework of frameworks) {
      expect(landmarkCounts[framework]).toEqual(reactCounts);
    }
  });
});
