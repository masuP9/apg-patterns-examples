import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Toggle Button Pattern
 *
 * A toggle button is a two-state button that can be either pressed or not pressed.
 * It uses `aria-pressed` to communicate state to assistive technology.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get toggle buttons
const getToggleButtons = (page: import('@playwright/test').Page) => {
  return page.locator('button[aria-pressed]');
};

for (const framework of frameworks) {
  test.describe(`Toggle Button (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/button/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="button" (implicit)', async ({ page }) => {
        const buttons = getToggleButtons(page);
        const count = await buttons.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(buttons.nth(i)).toHaveRole('button');
        }
      });

      test('has aria-pressed attribute', async ({ page }) => {
        const buttons = getToggleButtons(page);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          const ariaPressed = await buttons.nth(i).getAttribute('aria-pressed');
          expect(['true', 'false', 'mixed']).toContain(ariaPressed);
        }
      });

      test('has type="button" attribute', async ({ page }) => {
        const buttons = getToggleButtons(page);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          await expect(buttons.nth(i)).toHaveAttribute('type', 'button');
        }
      });

      test('has accessible name', async ({ page }) => {
        const buttons = getToggleButtons(page);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          const button = buttons.nth(i);
          const text = await button.textContent();
          const ariaLabel = await button.getAttribute('aria-label');
          const hasAccessibleName = (text && text.trim().length > 0) || ariaLabel !== null;
          expect(hasAccessibleName).toBe(true);
        }
      });
    });

    // 🔴 High Priority: Click Interaction
    test.describe('APG: Click Interaction', () => {
      test('toggles aria-pressed on click', async ({ page }) => {
        const button = getToggleButtons(page).first();
        const initialState = await button.getAttribute('aria-pressed');

        await button.click();

        const newState = await button.getAttribute('aria-pressed');
        expect(newState).not.toBe(initialState);

        // Click again to toggle back
        await button.click();
        const finalState = await button.getAttribute('aria-pressed');
        expect(finalState).toBe(initialState);
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('toggles on Space key', async ({ page }) => {
        const button = getToggleButtons(page).first();
        const initialState = await button.getAttribute('aria-pressed');

        await button.focus();
        await page.keyboard.press('Space');

        const newState = await button.getAttribute('aria-pressed');
        expect(newState).not.toBe(initialState);
      });

      test('toggles on Enter key', async ({ page }) => {
        const button = getToggleButtons(page).first();
        const initialState = await button.getAttribute('aria-pressed');

        await button.focus();
        await page.keyboard.press('Enter');

        const newState = await button.getAttribute('aria-pressed');
        expect(newState).not.toBe(initialState);
      });

      test('is focusable via Tab', async ({ page }) => {
        const button = getToggleButtons(page).first();

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

    // 🔴 High Priority: Disabled State
    test.describe('Disabled State', () => {
      test('disabled button has disabled attribute', async ({ page }) => {
        const disabledButton = page.locator('button[aria-pressed][disabled]');

        if ((await disabledButton.count()) > 0) {
          await expect(disabledButton.first()).toBeDisabled();
        }
      });

      test('disabled button is skipped by Tab', async ({ page }) => {
        const disabledButton = page.locator('button[aria-pressed][disabled]');

        if ((await disabledButton.count()) > 0) {
          // Tab through the page
          for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab');
            const isDisabledButtonFocused = await page.evaluate(() => {
              const activeEl = document.activeElement;
              if (!activeEl) return false;
              return (
                activeEl.hasAttribute('disabled') &&
                activeEl.hasAttribute('aria-pressed') &&
                activeEl.tagName.toLowerCase() === 'button'
              );
            });
            expect(isDisabledButtonFocused).toBe(false);
          }
        }
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const buttons = getToggleButtons(page);
        await buttons.first().waitFor();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('button[aria-pressed]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Toggle Button - Cross-framework Consistency', () => {
  test('all frameworks have toggle buttons', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/button/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('button[aria-pressed]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks toggle correctly on click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/button/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const button = page.locator('button[aria-pressed]').first();
      const initialState = await button.getAttribute('aria-pressed');

      await button.click();

      const newState = await button.getAttribute('aria-pressed');
      expect(newState).not.toBe(initialState);
    }
  });
});
