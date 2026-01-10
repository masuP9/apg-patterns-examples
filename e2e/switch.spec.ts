import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Switch Pattern
 *
 * A switch is a type of checkbox that represents on/off values.
 * It uses `role="switch"` and `aria-checked` to communicate state
 * to assistive technology.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/switch/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get switch elements
const getSwitches = (page: import('@playwright/test').Page) => {
  return page.locator('[role="switch"]');
};

for (const framework of frameworks) {
  test.describe(`Switch (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/switch/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="switch"', async ({ page }) => {
        const switches = getSwitches(page);
        const count = await switches.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(switches.nth(i)).toHaveAttribute('role', 'switch');
        }
      });

      test('has aria-checked attribute', async ({ page }) => {
        const switches = getSwitches(page);
        const count = await switches.count();

        for (let i = 0; i < count; i++) {
          const ariaChecked = await switches.nth(i).getAttribute('aria-checked');
          expect(['true', 'false']).toContain(ariaChecked);
        }
      });

      test('has accessible name', async ({ page }) => {
        const switches = getSwitches(page);
        const count = await switches.count();

        for (let i = 0; i < count; i++) {
          const switchEl = switches.nth(i);
          const text = await switchEl.textContent();
          const ariaLabel = await switchEl.getAttribute('aria-label');
          const ariaLabelledby = await switchEl.getAttribute('aria-labelledby');
          const hasAccessibleName =
            (text && text.trim().length > 0) || ariaLabel !== null || ariaLabelledby !== null;
          expect(hasAccessibleName).toBe(true);
        }
      });
    });

    // 🔴 High Priority: Click Interaction
    test.describe('APG: Click Interaction', () => {
      test('toggles aria-checked on click', async ({ page }) => {
        const switchEl = getSwitches(page).first();
        const initialState = await switchEl.getAttribute('aria-checked');

        await switchEl.click();

        const newState = await switchEl.getAttribute('aria-checked');
        expect(newState).not.toBe(initialState);

        // Click again to toggle back
        await switchEl.click();
        const finalState = await switchEl.getAttribute('aria-checked');
        expect(finalState).toBe(initialState);
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('toggles on Space key', async ({ page }) => {
        const switchEl = getSwitches(page).first();
        const initialState = await switchEl.getAttribute('aria-checked');

        await switchEl.focus();
        await page.keyboard.press('Space');

        const newState = await switchEl.getAttribute('aria-checked');
        expect(newState).not.toBe(initialState);
      });

      test('toggles on Enter key', async ({ page }) => {
        const switchEl = getSwitches(page).first();
        const initialState = await switchEl.getAttribute('aria-checked');

        await switchEl.focus();
        await page.keyboard.press('Enter');

        const newState = await switchEl.getAttribute('aria-checked');
        expect(newState).not.toBe(initialState);
      });

      test('is focusable via Tab', async ({ page }) => {
        const switchEl = getSwitches(page).first();

        // Tab to the switch
        let found = false;
        for (let i = 0; i < 20; i++) {
          await page.keyboard.press('Tab');
          if (await switchEl.evaluate((el) => el === document.activeElement)) {
            found = true;
            break;
          }
        }

        expect(found).toBe(true);
      });
    });

    // 🔴 High Priority: Disabled State
    test.describe('Disabled State', () => {
      test('disabled switch has aria-disabled="true"', async ({ page }) => {
        const disabledSwitch = page.locator('[role="switch"][aria-disabled="true"]');

        if ((await disabledSwitch.count()) > 0) {
          await expect(disabledSwitch.first()).toHaveAttribute('aria-disabled', 'true');
        }
      });

      test('disabled switch does not toggle on click', async ({ page }) => {
        const disabledSwitch = page.locator('[role="switch"][aria-disabled="true"]');

        if ((await disabledSwitch.count()) > 0) {
          const initialState = await disabledSwitch.first().getAttribute('aria-checked');
          await disabledSwitch.first().click({ force: true });
          const newState = await disabledSwitch.first().getAttribute('aria-checked');
          expect(newState).toBe(initialState);
        }
      });

      test('disabled switch does not toggle on keyboard', async ({ page }) => {
        const disabledSwitch = page.locator('[role="switch"][aria-disabled="true"]');

        if ((await disabledSwitch.count()) > 0) {
          const initialState = await disabledSwitch.first().getAttribute('aria-checked');
          await disabledSwitch.first().focus();
          await page.keyboard.press('Space');
          const newState = await disabledSwitch.first().getAttribute('aria-checked');
          expect(newState).toBe(initialState);
        }
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const switches = getSwitches(page);
        await switches.first().waitFor();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[role="switch"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Switch - Cross-framework Consistency', () => {
  test('all frameworks have switch elements', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/switch/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const switches = page.locator('[role="switch"]');
      const count = await switches.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks toggle correctly on click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/switch/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const switchEl = page.locator('[role="switch"]').first();
      const initialState = await switchEl.getAttribute('aria-checked');

      await switchEl.click();

      const newState = await switchEl.getAttribute('aria-checked');
      expect(newState).not.toBe(initialState);
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    const ariaStructures: Record<string, unknown[]> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/switch/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      ariaStructures[framework] = await page.evaluate(() => {
        const switches = document.querySelectorAll('[role="switch"]');
        return Array.from(switches).map((switchEl) => ({
          hasAriaChecked: switchEl.hasAttribute('aria-checked'),
          hasAccessibleName:
            (switchEl.textContent && switchEl.textContent.trim().length > 0) ||
            switchEl.hasAttribute('aria-label') ||
            switchEl.hasAttribute('aria-labelledby'),
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
