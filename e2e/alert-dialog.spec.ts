import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Alert Dialog Component
 *
 * These tests verify the Alert Dialog behavior across all frameworks:
 * - role="alertdialog" (NOT dialog)
 * - aria-describedby is required (unlike Dialog)
 * - Escape key disabled by default (unlike Dialog)
 * - Initial focus on Cancel button (safest action)
 * - Focus trap within dialog
 * - Focus restoration on close
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Alert Dialog (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/alert-dialog/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // Helper to open alert dialog
    const openAlertDialog = async (page: import('@playwright/test').Page) => {
      const trigger = page.getByRole('button', { name: /open alert|delete|confirm/i }).first();
      await trigger.click();
      await page.waitForSelector('[role="alertdialog"]');
    };

    test.describe('ARIA Attributes', () => {
      test('has role="alertdialog" (NOT dialog)', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        await expect(alertDialog).toBeVisible();

        // Should NOT have role="dialog"
        const dialog = page.locator('[role="dialog"]');
        await expect(dialog).toHaveCount(0);
      });

      test('is modal (opened via showModal)', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        await expect(alertDialog).toBeVisible();

        // Verify modal behavior: dialog has ::backdrop pseudo-element (showModal creates it)
        // and the dialog has 'open' attribute
        const hasOpenAttribute = await alertDialog.evaluate((el) => el.hasAttribute('open'));
        expect(hasOpenAttribute).toBe(true);

        // Verify backdrop exists (showModal() creates ::backdrop, show() does not)
        const hasBackdrop = await alertDialog.evaluate((el) => {
          const style = window.getComputedStyle(el, '::backdrop');
          // ::backdrop has display: block when created by showModal()
          return style.display !== 'none';
        });
        expect(hasBackdrop).toBe(true);
      });

      test('has aria-labelledby referencing title', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        const labelledbyId = await alertDialog.getAttribute('aria-labelledby');

        expect(labelledbyId).toBeTruthy();
        const titleElement = page.locator(`#${labelledbyId}`);
        await expect(titleElement).toBeVisible();
      });

      test('has aria-describedby referencing message (required)', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        const describedbyId = await alertDialog.getAttribute('aria-describedby');

        expect(describedbyId).toBeTruthy();
        const messageElement = page.locator(`#${describedbyId}`);
        await expect(messageElement).toBeVisible();
      });
    });

    test.describe('Keyboard Interaction', () => {
      test('Escape does NOT close dialog by default', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        await expect(alertDialog).toBeVisible();

        await page.keyboard.press('Escape');

        // Should still be visible
        await expect(alertDialog).toBeVisible();
      });

      test('Tab moves focus between buttons', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        const cancelButton = alertDialog.getByRole('button', { name: /cancel/i });
        const confirmButton = alertDialog
          .getByRole('button')
          .filter({ hasNot: page.getByText(/cancel/i) });

        // Initial focus should be on Cancel
        await expect(cancelButton).toBeFocused();

        // Tab to Confirm
        await page.keyboard.press('Tab');
        await expect(confirmButton).toBeFocused();
      });

      test('Tab wraps from last to first element', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        const cancelButton = alertDialog.getByRole('button', { name: /cancel/i });
        const confirmButton = alertDialog
          .getByRole('button')
          .filter({ hasNot: page.getByText(/cancel/i) });

        // Start from Cancel
        await expect(cancelButton).toBeFocused();

        // Tab to Confirm
        await page.keyboard.press('Tab');
        await expect(confirmButton).toBeFocused();

        // Tab should wrap to Cancel
        await page.keyboard.press('Tab');
        await expect(cancelButton).toBeFocused();
      });

      test('Shift+Tab wraps from first to last element', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        const cancelButton = alertDialog.getByRole('button', { name: /cancel/i });
        const confirmButton = alertDialog
          .getByRole('button')
          .filter({ hasNot: page.getByText(/cancel/i) });

        // Start from Cancel
        await expect(cancelButton).toBeFocused();

        // Shift+Tab should wrap to Confirm
        await page.keyboard.press('Shift+Tab');
        await expect(confirmButton).toBeFocused();
      });

      test('Enter activates focused button', async ({ page }) => {
        await openAlertDialog(page);

        const cancelButton = page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeFocused();

        await page.keyboard.press('Enter');

        // Dialog should be closed
        const alertDialog = page.getByRole('alertdialog');
        await expect(alertDialog).toHaveCount(0);
      });

      test('Space activates focused button', async ({ page }) => {
        await openAlertDialog(page);

        const cancelButton = page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeFocused();

        await page.keyboard.press('Space');

        // Dialog should be closed
        const alertDialog = page.getByRole('alertdialog');
        await expect(alertDialog).toHaveCount(0);
      });
    });

    test.describe('Focus Management', () => {
      test('focuses Cancel button on open (safest action)', async ({ page }) => {
        await openAlertDialog(page);

        const cancelButton = page.getByRole('button', { name: /cancel/i });
        await expect(cancelButton).toBeFocused();
      });

      test('returns focus to trigger on close via Cancel', async ({ page }) => {
        const trigger = page.getByRole('button', { name: /open alert|delete|confirm/i }).first();
        await trigger.click();
        await page.waitForSelector('[role="alertdialog"]');

        const alertDialog = page.getByRole('alertdialog');
        const cancelButton = alertDialog.getByRole('button', { name: /cancel/i });
        await cancelButton.click();

        await expect(trigger).toBeFocused();
      });

      test('returns focus to trigger on close via Confirm', async ({ page }) => {
        const trigger = page.getByRole('button', { name: /open alert|delete|confirm/i }).first();
        await trigger.click();
        await page.waitForSelector('[role="alertdialog"]');

        const alertDialog = page.getByRole('alertdialog');
        const confirmButton = alertDialog
          .getByRole('button')
          .filter({ hasNot: page.getByText(/cancel/i) });
        await confirmButton.click();

        await expect(trigger).toBeFocused();
      });

      test('traps focus within dialog', async ({ page }) => {
        await openAlertDialog(page);

        // Get all focusable elements in dialog
        const alertDialog = page.getByRole('alertdialog');
        const buttons = alertDialog.getByRole('button');
        const buttonCount = await buttons.count();

        // Tab through all buttons
        for (let i = 0; i < buttonCount; i++) {
          await page.keyboard.press('Tab');
        }

        // Focus should still be within dialog
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toHaveAttribute('type', /(button|submit)/);
      });
    });

    test.describe('Button Actions', () => {
      test('clicking Cancel closes dialog', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        const cancelButton = alertDialog.getByRole('button', { name: /cancel/i });
        await cancelButton.click();

        await expect(alertDialog).toHaveCount(0);
      });

      test('clicking Confirm closes dialog', async ({ page }) => {
        await openAlertDialog(page);

        const alertDialog = page.getByRole('alertdialog');
        const confirmButton = alertDialog
          .getByRole('button')
          .filter({ hasNot: page.getByText(/cancel/i) });
        await confirmButton.click();

        await expect(alertDialog).toHaveCount(0);
      });
    });

    test.describe('Alert Dialog Specific', () => {
      test('does NOT have close button (×)', async ({ page }) => {
        await openAlertDialog(page);

        // Should NOT have close button like regular Dialog
        const closeButton = page.getByRole('button', { name: /close dialog/i });
        await expect(closeButton).toHaveCount(0);
      });
    });
  });
}
