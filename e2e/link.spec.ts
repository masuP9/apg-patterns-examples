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

const getLinkByName = (page: import('@playwright/test').Page, name: string) => {
  return page.getByRole('link', { name });
};

// Wait for hydration to complete: Astro removes the `ssr` attribute from
// each <astro-island> once its component has hydrated. The Astro Web Component
// (apg-link) attaches its listeners in a requestAnimationFrame after upgrade,
// so also wait for the next frames.
const waitForHydration = async (page: import('@playwright/test').Page) => {
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      )
  );
};

// Fulfill requests to the demo's external URLs so navigation can be
// asserted without hitting the network.
const stubExternalSites = async (page: import('@playwright/test').Page) => {
  await page
    .context()
    .route(/^https:\/\/(www\.w3\.org|example\.com)\//, (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>Stub</title>' })
    );
};

for (const framework of frameworks) {
  test.describe(`Link (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/link/${framework}/demo/`);
      await waitForHydration(page);
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
      test('Enter navigates to the href', async ({ page }) => {
        await stubExternalSites(page);
        const link = getLinkByName(page, 'WAI-ARIA APG Documentation');
        await link.focus();
        await expect(link).toBeFocused();

        await link.press('Enter');

        await expect(page).toHaveURL('https://www.w3.org/WAI/ARIA/apg/');
      });

      test('Space does not navigate', async ({ page }) => {
        const link = getLinkByName(page, 'Link with hash href');
        await link.focus();
        await expect(link).toBeFocused();

        await link.press('Space');

        // Navigating to "#" is a synchronous same-document navigation, so the
        // URL would already end with "#" if Space had activated the link.
        const url = await page.evaluate(() => window.location.href);
        expect(url).not.toMatch(/#$/);
      });

      test('Enter during IME composition does not navigate', async ({ page }) => {
        const link = getLinkByName(page, 'Link with hash href');

        await link.evaluate((el) => {
          el.dispatchEvent(
            new KeyboardEvent('keydown', {
              key: 'Enter',
              isComposing: true,
              bubbles: true,
              cancelable: true,
            })
          );
        });

        const url = await page.evaluate(() => window.location.href);
        expect(url).not.toMatch(/#$/);
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
      test('click navigates to the href', async ({ page }) => {
        await stubExternalSites(page);
        const link = getLinkByName(page, 'WAI-ARIA APG Documentation');

        await link.click();

        await expect(page).toHaveURL('https://www.w3.org/WAI/ARIA/apg/');
      });

      test('link with target="_blank" opens the href in a new tab', async ({ page }) => {
        await stubExternalSites(page);
        const link = getLinkByName(page, 'External Link (opens in new tab)');

        const newPagePromise = page.context().waitForEvent('page');
        await link.click();
        const newPage = await newPagePromise;

        await expect(newPage).toHaveURL('https://example.com/');
      });

      test('link with target="_blank" opens the new tab without window.opener', async ({
        page,
      }) => {
        await stubExternalSites(page);
        const link = getLinkByName(page, 'External Link (opens in new tab)');

        const newPagePromise = page.context().waitForEvent('page');
        await link.click();
        const newPage = await newPagePromise;
        await newPage.waitForLoadState();

        const hasOpener = await newPage.evaluate(() => window.opener !== null);
        expect(hasOpener).toBe(false);
      });

      test('link with target="_blank" keeps the current page', async ({ page }) => {
        await stubExternalSites(page);
        const link = getLinkByName(page, 'External Link (opens in new tab)');

        const newPagePromise = page.context().waitForEvent('page');
        await link.click();
        await newPagePromise;

        await expect(page).toHaveURL(/\/patterns\/link\/[a-z]+\/demo\/$/);
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

      test('clicking a disabled link does not navigate', async ({ page }) => {
        const disabledLink = getLinkByName(page, 'Disabled Link');

        // force: Playwright treats aria-disabled="true" elements as not actionable
        await disabledLink.click({ force: true });

        const url = await page.evaluate(() => window.location.href);
        expect(url).not.toMatch(/#$/);
      });

      test('pressing Enter on a disabled link does not navigate', async ({ page }) => {
        const disabledLink = getLinkByName(page, 'Disabled Link');
        // Programmatic focus: tabindex="-1" keeps it out of the Tab order only
        await disabledLink.focus();

        await disabledLink.press('Enter');

        const url = await page.evaluate(() => window.location.href);
        expect(url).not.toMatch(/#$/);
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

// Astro-specific: link-activate CustomEvent
test.describe('Link (astro) - link-activate event', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('patterns/link/astro/demo/');
    await waitForHydration(page);
    await page.evaluate(() => {
      const events: (string | undefined)[] = [];
      (window as unknown as { __linkActivations: (string | undefined)[] }).__linkActivations =
        events;
      document.addEventListener('link-activate', (e) => {
        events.push((e as CustomEvent<{ href?: string }>).detail.href);
      });
    });
  });

  test('dispatches link-activate with the href on click', async ({ page }) => {
    await getLinkByName(page, 'Link with hash href').click();

    const events = await page.evaluate(
      () => (window as unknown as { __linkActivations: string[] }).__linkActivations
    );
    expect(events).toEqual(['#']);
  });

  test('dispatches link-activate with the href on Enter', async ({ page }) => {
    const link = getLinkByName(page, 'Link with hash href');
    await link.focus();
    await link.press('Enter');

    const events = await page.evaluate(
      () => (window as unknown as { __linkActivations: string[] }).__linkActivations
    );
    expect(events).toEqual(['#']);
  });

  test('does not dispatch link-activate on Space', async ({ page }) => {
    const link = getLinkByName(page, 'Link with hash href');
    await link.focus();
    await link.press('Space');

    const events = await page.evaluate(
      () => (window as unknown as { __linkActivations: string[] }).__linkActivations
    );
    expect(events).toEqual([]);
  });

  test('does not dispatch link-activate when a disabled link is clicked', async ({ page }) => {
    await getLinkByName(page, 'Disabled Link').click({ force: true });

    const events = await page.evaluate(
      () => (window as unknown as { __linkActivations: string[] }).__linkActivations
    );
    expect(events).toEqual([]);
  });
});

// Cross-framework consistency tests
test.describe('Link - Cross-framework Consistency', () => {
  test('all frameworks have custom link elements', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/link/${framework}/demo/`);
      await waitForHydration(page);

      const links = page.locator('[role="link"]');
      const count = await links.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks have same number of links', async ({ page }) => {
    const linkCounts: Record<string, number> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/link/${framework}/demo/`);
      await waitForHydration(page);

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
      await waitForHydration(page);

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
