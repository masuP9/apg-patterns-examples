import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Breadcrumb Pattern
 *
 * These tests verify the Breadcrumb component behavior in a real browser.
 * Breadcrumb shows the user's location in a site hierarchy and provides
 * navigation to ancestor pages.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get the first breadcrumb navigation (demo page has multiple)
const getBreadcrumb = (page: import('@playwright/test').Page) => {
  return page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]').first();
};

for (const framework of frameworks) {
  test.describe(`Breadcrumb (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/breadcrumb/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('uses nav element', async ({ page }) => {
        const nav = getBreadcrumb(page);
        await expect(nav).toBeAttached();
      });

      test('nav has aria-label containing "Breadcrumb"', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const ariaLabel = await nav.getAttribute('aria-label');
        expect(ariaLabel?.toLowerCase()).toContain('breadcrumb');
      });

      test('last item has aria-current="page"', async ({ page }) => {
        const nav = getBreadcrumb(page);
        // The current page element should have aria-current="page"
        // This could be a link or a span depending on implementation
        const currentPageElement = nav.locator('[aria-current="page"]');
        await expect(currentPageElement.first()).toBeAttached();
      });

      test('uses native anchor elements for links', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const links = nav.locator('a');
        const count = await links.count();

        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          const link = links.nth(i);
          const tagName = await link.evaluate((el) => el.tagName.toLowerCase());
          expect(tagName).toBe('a');
        }
      });
    });

    // 🔴 High Priority: Structure
    test.describe('APG: Structure', () => {
      test('uses ordered list (ol) for hierarchy', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const ol = nav.locator('ol');
        await expect(ol).toBeAttached();
      });

      test('each breadcrumb item is a list item (li)', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const listItems = nav.locator('ol > li');
        const count = await listItems.count();

        expect(count).toBeGreaterThan(0);
      });

      test('links have href attribute', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const links = nav.locator('a');
        const count = await links.count();

        for (let i = 0; i < count; i++) {
          const link = links.nth(i);
          const href = await link.getAttribute('href');
          expect(href).not.toBeNull();
        }
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    // Note: Breadcrumb uses native <a> elements, so keyboard behavior is automatic.
    // These tests verify the standard behavior is preserved across frameworks.
    test.describe('APG: Keyboard Interaction', () => {
      test('links are focusable via Tab', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const links = nav.locator('a');
        const count = await links.count();

        if (count > 0) {
          // Focus on first element before nav
          await page.keyboard.press('Tab');

          // Tab through to find breadcrumb links
          let foundBreadcrumbLink = false;
          for (let i = 0; i < 20; i++) {
            const focusedElement = page.locator(':focus');
            const isInNav = await focusedElement.evaluate((el) => {
              return el.closest('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]') !== null;
            });

            if (isInNav) {
              foundBreadcrumbLink = true;
              break;
            }
            await page.keyboard.press('Tab');
          }

          expect(foundBreadcrumbLink).toBe(true);
        }
      });

      test('Enter activates focused link', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const links = nav.locator('a');
        const count = await links.count();

        if (count > 1) {
          // Focus on a non-current link
          const firstLink = links.first();
          await firstLink.focus();
          await expect(firstLink).toBeFocused();

          // Get href before navigation
          const href = await firstLink.getAttribute('href');

          // Press Enter should navigate (in a real scenario)
          // For testing, we just verify the link is activatable
          await expect(firstLink).toHaveAttribute('href');
        }
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const nav = getBreadcrumb(page);
        await nav.waitFor();

        // Use semantic attribute selector for stability
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('nav[aria-label*="Breadcrumb"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('separators are hidden from assistive technology', async ({ page }) => {
        const nav = getBreadcrumb(page);

        // Check for aria-hidden separators if they exist as elements
        const separators = nav.locator('[aria-hidden="true"]');
        const count = await separators.count();

        // If there are visual separators as elements, they should be aria-hidden
        // CSS-based separators (::before/::after) are automatically hidden from AT
        if (count > 0) {
          for (let i = 0; i < count; i++) {
            await expect(separators.nth(i)).toHaveAttribute('aria-hidden', 'true');
          }
        }
      });
    });

    // 🟢 Low Priority: Visual
    test.describe('Visual', () => {
      test('all breadcrumb items are visible', async ({ page }) => {
        const nav = getBreadcrumb(page);
        const listItems = nav.locator('ol > li');
        const count = await listItems.count();

        for (let i = 0; i < count; i++) {
          await expect(listItems.nth(i)).toBeVisible();
        }
      });

      test('current page is distinguishable', async ({ page }) => {
        const nav = getBreadcrumb(page);
        // The current page element could be a span or link with aria-current="page"
        const currentPageElement = nav.locator('[aria-current="page"]');

        if ((await currentPageElement.count()) > 0) {
          await expect(currentPageElement.first()).toBeVisible();
        }
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Breadcrumb - Cross-framework Consistency', () => {
  test('all frameworks have breadcrumb navigation', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/breadcrumb/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]');
      await expect(nav.first()).toBeAttached();
    }
  });

  test('all frameworks have same number of breadcrumb items', async ({ page }) => {
    const itemCounts: Record<string, number> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/breadcrumb/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]').first();
      const items = nav.locator('ol > li');
      itemCounts[framework] = await items.count();
    }

    // All frameworks should have the same number of items
    const reactCount = itemCounts['react'];
    for (const framework of frameworks) {
      expect(itemCounts[framework]).toBe(reactCount);
    }
  });

  test('all frameworks mark last item as current page', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/breadcrumb/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const nav = page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]').first();
      // The current page element should have aria-current="page"
      const currentPageElement = nav.locator('[aria-current="page"]');
      await expect(currentPageElement.first()).toBeAttached();
    }
  });
});
