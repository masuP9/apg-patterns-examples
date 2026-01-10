import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Disclosure Pattern
 *
 * A disclosure is a button that controls visibility of a section of content.
 * It uses `aria-expanded` to indicate state and `aria-controls` to associate
 * the button with its controlled panel.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get disclosure trigger buttons
const getDisclosureButtons = (page: import('@playwright/test').Page) => {
  return page.locator('button[aria-expanded]');
};

for (const framework of frameworks) {
  test.describe(`Disclosure (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/disclosure/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('trigger is a <button> element', async ({ page }) => {
        const buttons = getDisclosureButtons(page);
        const count = await buttons.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          const tagName = await buttons.nth(i).evaluate((el) => el.tagName.toLowerCase());
          expect(tagName).toBe('button');
        }
      });

      test('button has aria-expanded attribute', async ({ page }) => {
        const buttons = getDisclosureButtons(page);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          const ariaExpanded = await buttons.nth(i).getAttribute('aria-expanded');
          expect(['true', 'false']).toContain(ariaExpanded);
        }
      });

      test('button has aria-controls referencing panel id', async ({ page }) => {
        const buttons = getDisclosureButtons(page);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          const button = buttons.nth(i);
          const ariaControls = await button.getAttribute('aria-controls');
          expect(ariaControls).not.toBeNull();

          // Verify the referenced element exists
          if (ariaControls) {
            const panel = page.locator(`[id="${ariaControls}"]`);
            await expect(panel).toBeAttached();
          }
        }
      });

      test('has accessible name', async ({ page }) => {
        const buttons = getDisclosureButtons(page);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          const button = buttons.nth(i);
          const text = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          const ariaLabelledby = await button.getAttribute('aria-labelledby');
          const hasAccessibleName =
            (text && text.trim().length > 0) || ariaLabel !== null || ariaLabelledby !== null;
          expect(hasAccessibleName).toBe(true);
        }
      });
    });

    // 🔴 High Priority: Click Interaction
    test.describe('APG: Click Interaction', () => {
      test('toggles aria-expanded on click', async ({ page }) => {
        const button = getDisclosureButtons(page).first();
        const initialState = await button.getAttribute('aria-expanded');

        await button.click();

        const newState = await button.getAttribute('aria-expanded');
        expect(newState).not.toBe(initialState);

        // Click again to toggle back
        await button.click();
        const finalState = await button.getAttribute('aria-expanded');
        expect(finalState).toBe(initialState);
      });

      test('panel visibility matches aria-expanded state', async ({ page }) => {
        const button = getDisclosureButtons(page).first();
        const panelId = await button.getAttribute('aria-controls');
        expect(panelId).not.toBeNull();

        const panel = page.locator(`[id="${panelId}"]`);

        // Get initial state
        const initialExpanded = await button.getAttribute('aria-expanded');

        if (initialExpanded === 'false') {
          // Panel should be hidden
          await expect(panel).not.toBeVisible();

          // Expand
          await button.click();
          await expect(panel).toBeVisible();
        } else {
          // Panel should be visible
          await expect(panel).toBeVisible();

          // Collapse
          await button.click();
          await expect(panel).not.toBeVisible();
        }
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('toggles on Enter key', async ({ page }) => {
        const button = getDisclosureButtons(page).first();
        const initialState = await button.getAttribute('aria-expanded');

        await button.focus();
        await page.keyboard.press('Enter');

        const newState = await button.getAttribute('aria-expanded');
        expect(newState).not.toBe(initialState);
      });

      test('toggles on Space key', async ({ page }) => {
        const button = getDisclosureButtons(page).first();
        const initialState = await button.getAttribute('aria-expanded');

        await button.focus();
        await page.keyboard.press('Space');

        const newState = await button.getAttribute('aria-expanded');
        expect(newState).not.toBe(initialState);
      });

      test('is focusable via Tab', async ({ page }) => {
        const button = getDisclosureButtons(page).first();

        // Tab to the button
        let found = false;
        for (let i = 0; i < 20; i++) {
          await page.keyboard.press('Tab');
          if (await button.evaluate((el) => el === document.activeElement)) {
            found = true;
            break;
          }
        }

        expect(found).toBe(true);
      });
    });

    // 🔴 High Priority: Panel Content
    test.describe('Panel Content', () => {
      test('panel content is hidden when collapsed', async ({ page }) => {
        const button = getDisclosureButtons(page).first();
        const panelId = await button.getAttribute('aria-controls');
        const panel = page.locator(`[id="${panelId}"]`);

        // Ensure collapsed state
        const isExpanded = (await button.getAttribute('aria-expanded')) === 'true';
        if (isExpanded) {
          await button.click();
        }

        // Panel should be hidden
        await expect(panel).not.toBeVisible();
      });

      test('panel content is visible when expanded', async ({ page }) => {
        const button = getDisclosureButtons(page).first();
        const panelId = await button.getAttribute('aria-controls');
        const panel = page.locator(`[id="${panelId}"]`);

        // Ensure expanded state
        const isExpanded = (await button.getAttribute('aria-expanded')) === 'true';
        if (!isExpanded) {
          await button.click();
        }

        // Panel should be visible
        await expect(panel).toBeVisible();
      });
    });

    // 🔴 High Priority: Disabled State
    test.describe('Disabled State', () => {
      test('disabled disclosure has disabled attribute', async ({ page }) => {
        const disabledDisclosure = page.locator('button[aria-expanded][disabled]');

        if ((await disabledDisclosure.count()) > 0) {
          await expect(disabledDisclosure.first()).toBeDisabled();
        }
      });

      test('disabled disclosure does not toggle on click', async ({ page }) => {
        const disabledDisclosure = page.locator('button[aria-expanded][disabled]');

        if ((await disabledDisclosure.count()) > 0) {
          const initialState = await disabledDisclosure.first().getAttribute('aria-expanded');
          await disabledDisclosure.first().click({ force: true });
          const newState = await disabledDisclosure.first().getAttribute('aria-expanded');
          expect(newState).toBe(initialState);
        }
      });

      test('disabled disclosure does not toggle on keyboard', async ({ page }) => {
        const disabledDisclosure = page.locator('button[aria-expanded][disabled]');

        if ((await disabledDisclosure.count()) > 0) {
          const initialState = await disabledDisclosure.first().getAttribute('aria-expanded');
          await disabledDisclosure.first().focus();
          await page.keyboard.press('Space');
          const newState = await disabledDisclosure.first().getAttribute('aria-expanded');
          expect(newState).toBe(initialState);
        }
      });

      test('disabled disclosure is skipped by Tab', async ({ page }) => {
        const disabledDisclosure = page.locator('button[aria-expanded][disabled]');

        if ((await disabledDisclosure.count()) > 0) {
          // Tab through the page and check that disabled disclosure never receives focus
          for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab');
            const isDisabledFocused = await page.evaluate(() => {
              const activeEl = document.activeElement;
              if (!activeEl) return false;
              return (
                activeEl.hasAttribute('disabled') &&
                activeEl.hasAttribute('aria-expanded') &&
                activeEl.tagName.toLowerCase() === 'button'
              );
            });
            expect(isDisabledFocused).toBe(false);
          }
        }
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations (collapsed state)', async ({ page }) => {
        const button = getDisclosureButtons(page).first();

        // Ensure collapsed
        const isExpanded = (await button.getAttribute('aria-expanded')) === 'true';
        if (isExpanded) {
          await button.click();
        }

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('button[aria-expanded]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('has no axe-core violations (expanded state)', async ({ page }) => {
        const button = getDisclosureButtons(page).first();

        // Ensure expanded
        const isExpanded = (await button.getAttribute('aria-expanded')) === 'true';
        if (!isExpanded) {
          await button.click();
        }

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('button[aria-expanded]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Disclosure - Cross-framework Consistency', () => {
  test('all frameworks have disclosure buttons', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/disclosure/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button[aria-expanded]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks have same number of disclosures', async ({ page }) => {
    const disclosureCounts: Record<string, number> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/disclosure/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button[aria-expanded]');
      disclosureCounts[framework] = await buttons.count();
    }

    // All frameworks should have the same number of disclosures
    const reactCount = disclosureCounts['react'];
    for (const framework of frameworks) {
      expect(disclosureCounts[framework]).toBe(reactCount);
    }
  });

  test('all frameworks toggle correctly on click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/disclosure/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const button = page.locator('button[aria-expanded]').first();
      const initialState = await button.getAttribute('aria-expanded');

      await button.click();

      const newState = await button.getAttribute('aria-expanded');
      expect(newState).not.toBe(initialState);
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    const ariaStructures: Record<string, unknown[]> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/disclosure/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      ariaStructures[framework] = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button[aria-expanded]');
        return Array.from(buttons).map((button) => ({
          isButton: button.tagName.toLowerCase() === 'button',
          hasAriaExpanded: button.hasAttribute('aria-expanded'),
          hasAriaControls: button.hasAttribute('aria-controls'),
          hasAccessibleName:
            (button.textContent && button.textContent.trim().length > 0) ||
            button.hasAttribute('aria-label') ||
            button.hasAttribute('aria-labelledby'),
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
