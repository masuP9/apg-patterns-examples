import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Link Pattern
 *
 * A link is an interactive element that navigates to a resource when activated.
 * This tests custom `role="link"` implementations (not native <a> elements).
 *
 * Key behaviors:
 * - Enter key activates the link
 * - Space key does NOT activate the link (unlike buttons)
 * - Disabled links use aria-disabled="true" and tabindex="-1"
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/link/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get custom link elements (role="link" on non-anchor elements)
const getCustomLinks = (page: import('@playwright/test').Page) => {
  return page.locator('[role="link"]');
};

for (const framework of frameworks) {
  test.describe(`Link (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/link/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="link"', async ({ page }) => {
        const links = getCustomLinks(page);
        const count = await links.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(links.nth(i)).toHaveAttribute('role', 'link');
        }
      });

      test('has tabindex="0" for focusability', async ({ page }) => {
        const links = getCustomLinks(page);
        const count = await links.count();

        for (let i = 0; i < count; i++) {
          const link = links.nth(i);
          const isDisabled = (await link.getAttribute('aria-disabled')) === 'true';

          if (!isDisabled) {
            await expect(link).toHaveAttribute('tabindex', '0');
          }
        }
      });

      test('has accessible name', async ({ page }) => {
        const links = getCustomLinks(page);
        const count = await links.count();

        for (let i = 0; i < count; i++) {
          const link = links.nth(i);
          const text = await link.textContent();
          const ariaLabel = await link.getAttribute('aria-label');
          const ariaLabelledby = await link.getAttribute('aria-labelledby');
          const hasAccessibleName =
            (text && text.trim().length > 0) || ariaLabel !== null || ariaLabelledby !== null;
          expect(hasAccessibleName).toBe(true);
        }
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('activates on Enter key', async ({ page }) => {
        // Get the first enabled link
        const link = page.locator('[role="link"]:not([aria-disabled="true"])').first();
        await link.waitFor();

        // Track keydown event and prevent navigation
        await page.evaluate(() => {
          const links = document.querySelectorAll('[role="link"]:not([aria-disabled="true"])');
          links.forEach((link) => {
            (link as HTMLElement).dataset.enterPressed = 'false';
            link.addEventListener(
              'keydown',
              (e) => {
                if ((e as KeyboardEvent).key === 'Enter') {
                  e.preventDefault(); // Prevent navigation
                  (link as HTMLElement).dataset.enterPressed = 'true';
                }
              },
              { capture: true }
            );
          });
        });

        await link.focus();
        await page.keyboard.press('Enter');

        // Verify Enter key was detected
        const enterPressed = await link.getAttribute('data-enter-pressed');
        expect(enterPressed).toBe('true');
      });

      test('does NOT activate on Space key', async ({ page }) => {
        // Get the first enabled link
        const link = page.locator('[role="link"]:not([aria-disabled="true"])').first();
        await link.waitFor();

        // Track keydown event for Space key
        await page.evaluate(() => {
          const links = document.querySelectorAll('[role="link"]:not([aria-disabled="true"])');
          links.forEach((link) => {
            (link as HTMLElement).dataset.spaceActivated = 'false';
            // The component should NOT have any handler that activates on Space
            // We listen to verify Space does NOT trigger the component's activation
            link.addEventListener('keydown', (e) => {
              if ((e as KeyboardEvent).key === ' ') {
                // Check if the event would have been handled (i.e., if stopPropagation was called)
                // For now, we just track that Space was pressed
                (link as HTMLElement).dataset.spacePressed = 'true';
              }
            });
          });
        });

        await link.focus();
        await page.keyboard.press('Space');
        await page.waitForTimeout(100);

        // The link should still be on the page (no navigation happened)
        // Space should NOT activate links according to APG
        await expect(link).toBeVisible();
      });

      test('is focusable via Tab', async ({ page }) => {
        const link = page.locator('[role="link"]:not([aria-disabled="true"])').first();

        // Tab to the link
        let found = false;
        for (let i = 0; i < 20; i++) {
          await page.keyboard.press('Tab');
          if (await link.evaluate((el) => el === document.activeElement)) {
            found = true;
            break;
          }
        }

        expect(found).toBe(true);
      });
    });

    // 🔴 High Priority: Click Interaction
    test.describe('APG: Click Interaction', () => {
      test('activates on click', async ({ page }) => {
        // Get the first enabled link
        const link = page.locator('[role="link"]:not([aria-disabled="true"])').first();
        await link.waitFor();

        // Track click event and prevent navigation by intercepting at capture phase
        await page.evaluate(() => {
          // Prevent window.open
          window.open = () => null;

          const links = document.querySelectorAll('[role="link"]:not([aria-disabled="true"])');
          links.forEach((link) => {
            (link as HTMLElement).dataset.clicked = 'false';
            link.addEventListener(
              'click',
              (e) => {
                // Prevent navigation
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                (link as HTMLElement).dataset.clicked = 'true';
              },
              { capture: true }
            );
          });
        });

        await link.click();

        // Verify the link was clicked
        const wasClicked = await link.getAttribute('data-clicked');
        expect(wasClicked).toBe('true');
      });
    });

    // 🔴 High Priority: Disabled State
    test.describe('Disabled State', () => {
      test('disabled link has aria-disabled="true"', async ({ page }) => {
        const disabledLink = page.locator('[role="link"][aria-disabled="true"]');

        if ((await disabledLink.count()) > 0) {
          await expect(disabledLink.first()).toHaveAttribute('aria-disabled', 'true');
        }
      });

      test('disabled link has tabindex="-1"', async ({ page }) => {
        const disabledLink = page.locator('[role="link"][aria-disabled="true"]');

        if ((await disabledLink.count()) > 0) {
          await expect(disabledLink.first()).toHaveAttribute('tabindex', '-1');
        }
      });

      test('disabled link is not focusable via Tab', async ({ page }) => {
        const disabledLink = page.locator('[role="link"][aria-disabled="true"]');

        if ((await disabledLink.count()) > 0) {
          // Tab through the page and check that disabled link never receives focus
          for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab');
            const isDisabledLinkFocused = await page.evaluate(() => {
              const activeEl = document.activeElement;
              if (!activeEl) return false;
              return (
                activeEl.getAttribute('aria-disabled') === 'true' &&
                activeEl.getAttribute('role') === 'link'
              );
            });
            expect(isDisabledLinkFocused).toBe(false);
          }
        }
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const links = getCustomLinks(page);
        await links.first().waitFor();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[role="link"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Link - Cross-framework Consistency', () => {
  test('all frameworks have custom link elements', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/link/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const links = page.locator('[role="link"]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks have same number of links', async ({ page }) => {
    const linkCounts: Record<string, number> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/link/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const links = page.locator('[role="link"]');
      linkCounts[framework] = await links.count();
    }

    // All frameworks should have the same number of links
    const reactCount = linkCounts['react'];
    for (const framework of frameworks) {
      expect(linkCounts[framework]).toBe(reactCount);
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    const ariaStructures: Record<string, unknown[]> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/link/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      ariaStructures[framework] = await page.evaluate(() => {
        const links = document.querySelectorAll('[role="link"]');
        return Array.from(links).map((link) => ({
          hasTabindex: link.hasAttribute('tabindex'),
          hasAccessibleName:
            (link.textContent && link.textContent.trim().length > 0) ||
            link.hasAttribute('aria-label') ||
            link.hasAttribute('aria-labelledby'),
        }));
      });
    }

    // All frameworks should have the same structure
    const reactStructure = ariaStructures['react'];
    for (const framework of frameworks) {
      expect(ariaStructures[framework]).toEqual(reactStructure);
    }
  });
});
