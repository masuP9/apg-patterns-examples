import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Alert Pattern
 *
 * These tests verify the Alert component behavior in a real browser.
 * Alerts are non-modal informational messages that:
 * - Are announced immediately by screen readers
 * - Do NOT steal focus from the current task
 * - Have the live region container in DOM from page load
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get the alert element
const getAlert = (page: import('@playwright/test').Page) => {
  return page.locator('[role="alert"]');
};

// Helper to get trigger buttons
const getTriggerButtons = (page: import('@playwright/test').Page) => {
  return {
    info: page.getByRole('button', { name: 'Info' }),
    success: page.getByRole('button', { name: 'Success' }),
    warning: page.getByRole('button', { name: 'Warning' }),
    error: page.getByRole('button', { name: 'Error' }),
  };
};

for (const framework of frameworks) {
  test.describe(`Alert (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/alert/${framework}/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="alert" on container', async ({ page }) => {
        const alert = getAlert(page);
        await expect(alert).toHaveAttribute('role', 'alert');
      });

      test('live region exists in DOM from page load', async ({ page }) => {
        // Alert container should exist even when empty
        const alert = getAlert(page);
        await expect(alert).toBeAttached();
      });

      test('displays message when triggered', async ({ page }) => {
        const alert = getAlert(page);
        const { info } = getTriggerButtons(page);

        // Click Info button to show alert
        await info.click();

        // Alert should now contain message text
        await expect(alert).toContainText('informational');
      });

      test('updates message on different button clicks', async ({ page }) => {
        const alert = getAlert(page);
        const buttons = getTriggerButtons(page);

        // Show info alert
        await buttons.info.click();
        await expect(alert).toContainText('informational');

        // Show success alert
        await buttons.success.click();
        await expect(alert).toContainText('successfully');

        // Show warning alert
        await buttons.warning.click();
        await expect(alert).toContainText('review');

        // Show error alert
        await buttons.error.click();
        await expect(alert).toContainText('error');
      });
    });

    // 🔴 High Priority: Focus Management
    test.describe('APG: Focus Management', () => {
      test('does NOT steal focus when alert appears', async ({ page }) => {
        const { info } = getTriggerButtons(page);

        // Focus on the Info button
        await info.focus();
        await expect(info).toBeFocused();

        // Click to trigger alert
        await info.click();

        // Focus should still be on the button, not on the alert
        await expect(info).toBeFocused();
      });

      test('alert container is NOT focusable', async ({ page }) => {
        const alert = getAlert(page);

        // Alert should not have tabindex (or have tabindex="-1")
        const tabindex = await alert.getAttribute('tabindex');
        if (tabindex !== null) {
          expect(Number(tabindex)).toBe(-1);
        }
      });

      test('dismiss button is focusable when present', async ({ page }) => {
        const { info } = getTriggerButtons(page);

        // Trigger alert with dismiss button
        await info.click();

        // Wait for dismiss button to appear
        const dismissButton = page.locator('[role="alert"] button');

        // If dismiss button exists, it should be focusable
        if ((await dismissButton.count()) > 0) {
          await dismissButton.first().focus();
          await expect(dismissButton.first()).toBeFocused();
        }
      });
    });

    // 🔴 High Priority: Dismiss Behavior
    test.describe('Dismiss Behavior', () => {
      test('dismiss button clears alert message', async ({ page }) => {
        const alert = getAlert(page);
        const { info } = getTriggerButtons(page);

        // Show alert
        await info.click();
        await expect(alert).toContainText('informational');

        // Find and click dismiss button
        const dismissButton = page.locator('[role="alert"] button');
        if ((await dismissButton.count()) > 0) {
          await dismissButton.first().click();

          // Alert container should still exist but be empty or hidden
          await expect(alert).not.toContainText('informational');
        }
      });

      test('dismiss button works with keyboard (Enter)', async ({ page }) => {
        const alert = getAlert(page);
        const { success } = getTriggerButtons(page);

        // Show alert
        await success.click();
        await expect(alert).toContainText('successfully');

        // Focus and activate dismiss button with Enter
        const dismissButton = page.locator('[role="alert"] button');
        if ((await dismissButton.count()) > 0) {
          const btn = dismissButton.first();
          await btn.focus();
          await expect(btn).toBeFocused();
          await btn.press('Enter');

          // Alert should be cleared
          await expect(alert).not.toContainText('successfully');
        }
      });

      test('dismiss button works with keyboard (Space)', async ({ page }) => {
        const alert = getAlert(page);
        const { warning } = getTriggerButtons(page);

        // Show alert
        await warning.click();
        await expect(alert).toContainText('review');

        // Focus and activate dismiss button with Space
        const dismissButton = page.locator('[role="alert"] button');
        if ((await dismissButton.count()) > 0) {
          const btn = dismissButton.first();
          await btn.focus();
          await expect(btn).toBeFocused();
          await btn.press('Space');

          // Alert should be cleared
          await expect(alert).not.toContainText('review');
        }
      });
    });

    // 🟡 Medium Priority: Tab Navigation
    test.describe('Tab Navigation', () => {
      test('alert container cannot receive focus via Tab', async ({ page }) => {
        const { info } = getTriggerButtons(page);

        // Show alert
        await info.click();

        // Tab through the page multiple times
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          // If we're inside the alert, it should only be on interactive elements (buttons)
          const isFocusOnAlertContainer = await page.evaluate(() => {
            const activeEl = document.activeElement;
            return activeEl?.getAttribute('role') === 'alert';
          });
          expect(isFocusOnAlertContainer).toBe(false);
        }
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations (empty alert)', async ({ page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[role="alert"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('has no axe-core violations (with message)', async ({ page }) => {
        const { info } = getTriggerButtons(page);

        // Trigger alert
        await info.click();

        // Wait for content to appear
        await expect(page.locator('[role="alert"]')).toContainText('informational');

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[role="alert"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });

    // 🟢 Low Priority: Visual Variants
    test.describe('Visual Variants', () => {
      test('displays different variants correctly', async ({ page }) => {
        const alert = getAlert(page);
        const buttons = getTriggerButtons(page);

        // Test each variant
        for (const [_variant, button] of Object.entries(buttons)) {
          await button.click();
          // Alert should be visible and have content
          await expect(alert).toBeVisible();
          const text = await alert.textContent();
          expect(text?.length).toBeGreaterThan(0);
        }
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Alert - Cross-framework Consistency', () => {
  test('all frameworks have alert role element', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/alert/${framework}/`);
      await page.waitForLoadState('networkidle');
      const alert = page.locator('[role="alert"]');
      await expect(alert).toBeAttached();
    }
  });

  test('all frameworks have same trigger buttons', async ({ page }) => {
    const buttonCounts: Record<string, number> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/alert/${framework}/`);
      await page.waitForLoadState('networkidle');

      // Count buttons: Info, Success, Warning, Error
      const infoBtn = page.getByRole('button', { name: 'Info' });
      const successBtn = page.getByRole('button', { name: 'Success' });
      const warningBtn = page.getByRole('button', { name: 'Warning' });
      const errorBtn = page.getByRole('button', { name: 'Error' });

      const count =
        (await infoBtn.count()) +
        (await successBtn.count()) +
        (await warningBtn.count()) +
        (await errorBtn.count());

      buttonCounts[framework] = count;
    }

    // All frameworks should have the same number of buttons
    const reactCount = buttonCounts['react'];
    for (const framework of frameworks) {
      expect(buttonCounts[framework]).toBe(reactCount);
    }
  });

  test('all frameworks show alert on button click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/alert/${framework}/`);
      await page.waitForLoadState('networkidle');

      const alert = page.locator('[role="alert"]');
      const infoBtn = page.getByRole('button', { name: 'Info' });

      await infoBtn.click();
      await expect(alert).toContainText('informational');
    }
  });
});
