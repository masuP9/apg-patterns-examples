import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Button Pattern (Custom Implementation)
 *
 * A custom button using role="button" on a non-button element.
 * This pattern demonstrates why native <button> is recommended.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get custom buttons (role="button" on non-button elements)
const getCustomButtons = (page: import('@playwright/test').Page) => {
  return page.locator('[role="button"]');
};

for (const framework of frameworks) {
  test.describe(`Button (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/button/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="button" (explicit)', async ({ page }) => {
        const buttons = getCustomButtons(page);
        const count = await buttons.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(buttons.nth(i)).toHaveRole('button');
        }
      });

      test('has tabindex="0" for focusability', async ({ page }) => {
        const enabledButton = page.locator('[role="button"]:not([aria-disabled="true"])').first();
        await expect(enabledButton).toHaveAttribute('tabindex', '0');
      });

      test('does NOT have aria-pressed (not a toggle button)', async ({ page }) => {
        const buttons = getCustomButtons(page);
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          const ariaPressed = await buttons.nth(i).getAttribute('aria-pressed');
          expect(ariaPressed).toBeNull();
        }
      });

      test('has accessible name', async ({ page }) => {
        const buttons = getCustomButtons(page);
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
      test('activates on click', async ({ page }) => {
        const button = getCustomButtons(page).first();

        // Set up click tracking
        await page.evaluate(() => {
          const btn = document.querySelector('[role="button"]');
          if (btn) {
            (btn as HTMLElement).dataset.clicked = 'false';
            btn.addEventListener('click', () => {
              (btn as HTMLElement).dataset.clicked = 'true';
            });
          }
        });

        await button.click();

        const clicked = await button.getAttribute('data-clicked');
        expect(clicked).toBe('true');
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('activates on Space key', async ({ page }) => {
        const button = page.locator('[role="button"]:not([aria-disabled="true"])').first();

        // Set up activation tracking
        await page.evaluate(() => {
          const btn = document.querySelector('[role="button"]:not([aria-disabled="true"])');
          if (btn) {
            (btn as HTMLElement).dataset.activated = 'false';
            btn.addEventListener('click', () => {
              (btn as HTMLElement).dataset.activated = 'true';
            });
            btn.addEventListener('button-activate', () => {
              (btn as HTMLElement).dataset.activated = 'true';
            });
          }
        });

        await button.focus();
        await expect(button).toBeFocused();
        await button.press('Space');

        // Check if button was activated (either via click event or custom event)
        const activated = await button.getAttribute('data-activated');
        expect(activated).toBe('true');
      });

      test('activates on Enter key', async ({ page }) => {
        const button = page.locator('[role="button"]:not([aria-disabled="true"])').first();

        // Set up activation tracking
        await page.evaluate(() => {
          const btn = document.querySelector('[role="button"]:not([aria-disabled="true"])');
          if (btn) {
            (btn as HTMLElement).dataset.activated = 'false';
            btn.addEventListener('click', () => {
              (btn as HTMLElement).dataset.activated = 'true';
            });
            btn.addEventListener('button-activate', () => {
              (btn as HTMLElement).dataset.activated = 'true';
            });
          }
        });

        await button.focus();
        await expect(button).toBeFocused();
        await button.press('Enter');

        const activated = await button.getAttribute('data-activated');
        expect(activated).toBe('true');
      });

      test('is focusable via Tab', async ({ page }) => {
        const button = getCustomButtons(page).first();

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
      test('disabled button has aria-disabled="true"', async ({ page }) => {
        const disabledButton = page.locator('[role="button"][aria-disabled="true"]');

        if ((await disabledButton.count()) > 0) {
          await expect(disabledButton.first()).toHaveAttribute('aria-disabled', 'true');
        }
      });

      test('disabled button has tabindex="-1"', async ({ page }) => {
        const disabledButton = page.locator('[role="button"][aria-disabled="true"]');

        if ((await disabledButton.count()) > 0) {
          await expect(disabledButton.first()).toHaveAttribute('tabindex', '-1');
        }
      });

      test('disabled button is skipped by Tab', async ({ page }) => {
        const disabledButton = page.locator('[role="button"][aria-disabled="true"]');

        if ((await disabledButton.count()) > 0) {
          // Tab through the page
          for (let i = 0; i < 20; i++) {
            await page.keyboard.press('Tab');
            const isDisabledButtonFocused = await page.evaluate(() => {
              const activeEl = document.activeElement;
              if (!activeEl) return false;
              return (
                activeEl.getAttribute('aria-disabled') === 'true' &&
                activeEl.getAttribute('role') === 'button'
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
        const buttons = getCustomButtons(page);
        await buttons.first().waitFor();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[role="button"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Button - Cross-framework Consistency', () => {
  test('all frameworks have custom buttons', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/button/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const buttons = page.locator('[role="button"]');
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks activate on click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/button/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const button = page.locator('[role="button"]:not([aria-disabled="true"])').first();

      // Set up click tracking
      await page.evaluate(() => {
        const btn = document.querySelector('[role="button"]:not([aria-disabled="true"])');
        if (btn) {
          (btn as HTMLElement).dataset.clicked = 'false';
          btn.addEventListener('click', () => {
            (btn as HTMLElement).dataset.clicked = 'true';
          });
        }
      });

      await button.click();

      const clicked = await button.getAttribute('data-clicked');
      expect(clicked).toBe('true');
    }
  });
});
