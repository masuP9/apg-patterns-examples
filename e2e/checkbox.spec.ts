import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Checkbox Component
 *
 * These tests verify the Web Component behavior that cannot be tested
 * with Container API unit tests, including:
 * - Click interaction and state changes
 * - Custom event dispatching (Astro only - uses Web Component)
 * - Disabled state behavior
 * - Indeterminate state clearing
 * - Label association
 *
 * Note: The checkbox input is visually hidden (1x1px) with a custom visual control.
 * We click on the visual control (.apg-checkbox-control) for most tests,
 * and test label association separately.
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Checkbox (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/checkbox/${framework}/`);
      await page.waitForLoadState('networkidle');
    });

    // Helper to get checkbox and its visual control
    const getCheckbox = (page: import('@playwright/test').Page, id: string) => {
      const checkbox = page.locator(`#${id}`);
      // The visual control is a sibling of the input within the same wrapper
      const control = checkbox.locator('~ .apg-checkbox-control');
      return { checkbox, control };
    };

    test.describe('Click Interaction', () => {
      test('toggles checked state on click', async ({ page }) => {
        const { checkbox, control } = getCheckbox(page, 'demo-terms');

        // Initial state: unchecked
        await expect(checkbox).not.toBeChecked();

        // Click visual control to check
        await control.click();
        await expect(checkbox).toBeChecked();

        // Click visual control to uncheck
        await control.click();
        await expect(checkbox).not.toBeChecked();
      });

      test('initially checked checkbox can be unchecked', async ({ page }) => {
        const { checkbox, control } = getCheckbox(page, 'demo-newsletter');

        // Initial state: checked
        await expect(checkbox).toBeChecked();

        // Click visual control to uncheck
        await control.click();
        await expect(checkbox).not.toBeChecked();

        // Click visual control to check again
        await control.click();
        await expect(checkbox).toBeChecked();
      });
    });

    test.describe('Disabled State', () => {
      test('does not toggle when disabled', async ({ page }) => {
        const { checkbox, control } = getCheckbox(page, 'demo-disabled');
        await expect(checkbox).toBeDisabled();

        // Initial state: unchecked and disabled
        await expect(checkbox).not.toBeChecked();

        // Attempt to click control (should have no effect due to disabled input)
        await control.click({ force: true });
        await expect(checkbox).not.toBeChecked();
      });
    });

    test.describe('Indeterminate State', () => {
      test('clears indeterminate state on click', async ({ page }) => {
        const { checkbox, control } = getCheckbox(page, 'demo-select-all');

        // Check indeterminate state via JavaScript
        const isIndeterminate = await checkbox.evaluate((el: HTMLInputElement) => el.indeterminate);
        expect(isIndeterminate).toBe(true);

        // Click control to clear indeterminate
        await control.click();

        // After click, indeterminate should be false
        const isIndeterminateAfter = await checkbox.evaluate(
          (el: HTMLInputElement) => el.indeterminate
        );
        expect(isIndeterminateAfter).toBe(false);

        // And checkbox should now be checked
        await expect(checkbox).toBeChecked();
      });
    });

    // Custom Events tests are only for Astro (Web Component with checkedchange event)
    // React/Vue/Svelte use framework-specific callbacks instead
    if (framework === 'astro') {
      test.describe('Custom Events (Astro Web Component)', () => {
        test('dispatches checkedchange event on state change', async ({ page }) => {
          const { checkbox, control } = getCheckbox(page, 'demo-terms');
          const wrapper = page.locator('apg-checkbox').filter({ has: checkbox });

          // Set up event listener with timeout to prevent hanging
          const eventPromise = Promise.race([
            wrapper.evaluate((el) => {
              return new Promise<{ checked: boolean }>((resolve) => {
                el.addEventListener(
                  'checkedchange',
                  (e) => {
                    resolve((e as CustomEvent).detail);
                  },
                  { once: true }
                );
              });
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('checkedchange event not fired within 5s')), 5000)
            ),
          ]);

          // Click control to trigger event
          await control.click();

          // Verify event was dispatched with correct detail
          const eventDetail = await eventPromise;
          expect(eventDetail.checked).toBe(true);
        });

        test('event detail reflects current state', async ({ page }) => {
          const { checkbox, control } = getCheckbox(page, 'demo-newsletter');
          const wrapper = page.locator('apg-checkbox').filter({ has: checkbox });

          // Checkbox starts checked, so unchecking should dispatch checked: false
          const eventPromise = Promise.race([
            wrapper.evaluate((el) => {
              return new Promise<{ checked: boolean }>((resolve) => {
                el.addEventListener(
                  'checkedchange',
                  (e) => {
                    resolve((e as CustomEvent).detail);
                  },
                  { once: true }
                );
              });
            }),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('checkedchange event not fired within 5s')), 5000)
            ),
          ]);

          await control.click();

          const eventDetail = await eventPromise;
          expect(eventDetail.checked).toBe(false);
        });
      });
    }

    test.describe('Label Association', () => {
      test('clicking label toggles checkbox', async ({ page }) => {
        const { checkbox } = getCheckbox(page, 'demo-terms');
        // Find label that wraps this checkbox
        const label = page.locator('label').filter({ has: checkbox });

        // Initial state
        await expect(checkbox).not.toBeChecked();

        // Click on label (not the control) to verify label association
        await label.click();
        await expect(checkbox).toBeChecked();
      });
    });

    test.describe('Keyboard Interaction', () => {
      test('Space key toggles checkbox when focused', async ({ page }) => {
        const { checkbox } = getCheckbox(page, 'demo-terms');

        // Focus the checkbox (input is focusable even if visually hidden)
        await checkbox.focus();

        // Initial state
        await expect(checkbox).not.toBeChecked();

        // Press Space to toggle
        await page.keyboard.press('Space');
        await expect(checkbox).toBeChecked();

        // Press Space again to untoggle
        await page.keyboard.press('Space');
        await expect(checkbox).not.toBeChecked();
      });

      test('Space key does not toggle disabled checkbox', async ({ page }) => {
        const { checkbox } = getCheckbox(page, 'demo-disabled');
        await expect(checkbox).toBeDisabled();

        // Try to focus - disabled checkbox should not be focusable
        // Focus on the previous checkbox first
        const { checkbox: selectAll } = getCheckbox(page, 'demo-select-all');
        await selectAll.focus();

        // Initial state
        await expect(checkbox).not.toBeChecked();

        // Tab should skip disabled checkbox
        await page.keyboard.press('Tab');

        // Press Space (should not affect disabled checkbox)
        await page.keyboard.press('Space');
        await expect(checkbox).not.toBeChecked();
      });
    });

    test.describe('Accessibility', () => {
      test('checkbox has correct role', async ({ page }) => {
        const { checkbox } = getCheckbox(page, 'demo-terms');
        await expect(checkbox).toHaveRole('checkbox');
      });

      test('checkbox is keyboard focusable', async ({ page }) => {
        const { checkbox } = getCheckbox(page, 'demo-terms');

        // Focus the checkbox directly
        await checkbox.focus();
        await expect(checkbox).toBeFocused();
      });

      test('disabled checkbox is not focusable via tab', async ({ page }) => {
        // Focus on the element before disabled checkbox
        const { checkbox: selectAll } = getCheckbox(page, 'demo-select-all');
        const { checkbox: disabled } = getCheckbox(page, 'demo-disabled');

        await selectAll.focus();
        await expect(selectAll).toBeFocused();

        // Tab should skip disabled checkbox
        await page.keyboard.press('Tab');
        const focusedId = await page.evaluate(() => document.activeElement?.id);
        expect(focusedId).not.toBe('demo-disabled');
      });
    });
  });
}
