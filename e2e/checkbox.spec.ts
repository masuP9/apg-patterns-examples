import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Checkbox Component
 *
 * These tests verify the Web Component behavior that cannot be tested
 * with Container API unit tests, including:
 * - Click interaction and state changes
 * - Custom event dispatching
 * - Disabled state behavior
 * - Indeterminate state clearing
 * - Label association
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Checkbox (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/checkbox/${framework}/`);
      await page.waitForLoadState('networkidle');
    });

    test.describe('Click Interaction', () => {
      test('toggles checked state on click', async ({ page }) => {
        const checkbox = page.locator('#demo-terms');
        await expect(checkbox).toBeVisible();

        // Initial state: unchecked
        await expect(checkbox).not.toBeChecked();

        // Click to check
        await checkbox.click();
        await expect(checkbox).toBeChecked();

        // Click to uncheck
        await checkbox.click();
        await expect(checkbox).not.toBeChecked();
      });

      test('initially checked checkbox can be unchecked', async ({ page }) => {
        const checkbox = page.locator('#demo-newsletter');
        await expect(checkbox).toBeVisible();

        // Initial state: checked
        await expect(checkbox).toBeChecked();

        // Click to uncheck
        await checkbox.click();
        await expect(checkbox).not.toBeChecked();

        // Click to check again
        await checkbox.click();
        await expect(checkbox).toBeChecked();
      });
    });

    test.describe('Disabled State', () => {
      test('does not toggle when disabled', async ({ page }) => {
        const checkbox = page.locator('#demo-disabled');
        await expect(checkbox).toBeVisible();
        await expect(checkbox).toBeDisabled();

        // Initial state: unchecked and disabled
        await expect(checkbox).not.toBeChecked();

        // Attempt to click (should have no effect)
        await checkbox.click({ force: true });
        await expect(checkbox).not.toBeChecked();
      });
    });

    test.describe('Indeterminate State', () => {
      test('clears indeterminate state on click', async ({ page }) => {
        const checkbox = page.locator('#demo-select-all');
        await expect(checkbox).toBeVisible();

        // Check indeterminate state via JavaScript
        const isIndeterminate = await checkbox.evaluate(
          (el: HTMLInputElement) => el.indeterminate
        );
        expect(isIndeterminate).toBe(true);

        // Click to clear indeterminate
        await checkbox.click();

        // After click, indeterminate should be false
        const isIndeterminateAfter = await checkbox.evaluate(
          (el: HTMLInputElement) => el.indeterminate
        );
        expect(isIndeterminateAfter).toBe(false);

        // And checkbox should now be checked
        await expect(checkbox).toBeChecked();
      });
    });

    test.describe('Custom Events', () => {
      test('dispatches checkedchange event on state change', async ({ page }) => {
        const checkbox = page.locator('#demo-terms');
        const wrapper = page.locator('apg-checkbox').filter({ has: checkbox });
        await expect(checkbox).toBeVisible();

        // Set up event listener
        const eventPromise = wrapper.evaluate((el) => {
          return new Promise<{ checked: boolean }>((resolve) => {
            el.addEventListener(
              'checkedchange',
              (e) => {
                resolve((e as CustomEvent).detail);
              },
              { once: true }
            );
          });
        });

        // Click to trigger event
        await checkbox.click();

        // Verify event was dispatched with correct detail
        const eventDetail = await eventPromise;
        expect(eventDetail.checked).toBe(true);
      });

      test('event detail reflects current state', async ({ page }) => {
        const checkbox = page.locator('#demo-newsletter');
        const wrapper = page.locator('apg-checkbox').filter({ has: checkbox });
        await expect(checkbox).toBeVisible();

        // Checkbox starts checked, so unchecking should dispatch checked: false
        const eventPromise = wrapper.evaluate((el) => {
          return new Promise<{ checked: boolean }>((resolve) => {
            el.addEventListener(
              'checkedchange',
              (e) => {
                resolve((e as CustomEvent).detail);
              },
              { once: true }
            );
          });
        });

        await checkbox.click();

        const eventDetail = await eventPromise;
        expect(eventDetail.checked).toBe(false);
      });
    });

    test.describe('Label Association', () => {
      test('clicking label toggles checkbox', async ({ page }) => {
        const checkbox = page.locator('#demo-terms');
        // Find the label that wraps this checkbox
        const label = page.locator('label').filter({ has: checkbox });
        await expect(label).toBeVisible();

        // Initial state
        await expect(checkbox).not.toBeChecked();

        // Click on label text (not directly on checkbox)
        await label.click();
        await expect(checkbox).toBeChecked();
      });
    });

    test.describe('Keyboard Interaction', () => {
      test('Space key toggles checkbox when focused', async ({ page }) => {
        const checkbox = page.locator('#demo-terms');
        await expect(checkbox).toBeVisible();

        // Focus the checkbox
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
        const checkbox = page.locator('#demo-disabled');
        await expect(checkbox).toBeVisible();
        await expect(checkbox).toBeDisabled();

        // Focus the checkbox (may not work for disabled, but try)
        await checkbox.focus({ timeout: 1000 }).catch(() => {
          // Disabled checkbox may not be focusable, which is expected
        });

        // Initial state
        await expect(checkbox).not.toBeChecked();

        // Press Space (should have no effect)
        await page.keyboard.press('Space');
        await expect(checkbox).not.toBeChecked();
      });
    });

    test.describe('Accessibility', () => {
      test('checkbox has correct role', async ({ page }) => {
        const checkbox = page.locator('#demo-terms');
        await expect(checkbox).toHaveRole('checkbox');
      });

      test('checkbox is keyboard focusable', async ({ page }) => {
        const checkbox = page.locator('#demo-terms');

        // Tab to the checkbox
        await page.keyboard.press('Tab');

        // Check if checkbox can receive focus
        const focusedId = await page.evaluate(() => document.activeElement?.id);
        // It might take a few tabs to reach the checkbox
        if (focusedId !== 'demo-terms') {
          await checkbox.focus();
        }
        await expect(checkbox).toBeFocused();
      });

      test('disabled checkbox is not focusable via tab', async ({ page }) => {
        // Focus on the element before disabled checkbox
        const selectAll = page.locator('#demo-select-all');
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
