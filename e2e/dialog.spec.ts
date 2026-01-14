import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Dialog (Modal) Pattern
 *
 * A window overlaid on the primary content, requiring user interaction.
 * Modal dialogs trap focus and prevent interaction with content outside.
 *
 * Key differences from Alert Dialog:
 * - role="dialog" (not "alertdialog")
 * - Escape key closes the dialog
 * - Has close button (×)
 * - aria-describedby is optional
 * - Initial focus on close button or first focusable element
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getDialog = (page: import('@playwright/test').Page) => {
  // Use getByRole which only returns visible elements with the role
  // This works for both native <dialog> (implicit role) and custom role="dialog"
  return page.getByRole('dialog');
};

const openDialog = async (page: import('@playwright/test').Page) => {
  const trigger = page.getByRole('button', { name: /open dialog/i }).first();
  await trigger.click();
  // Wait for dialog to be visible (native <dialog> has implicit role="dialog")
  await getDialog(page).waitFor({ state: 'visible' });
  return trigger;
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Dialog (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/dialog/${framework}/demo/`);
      // Wait for the trigger button to be visible (indicates hydration complete)
      await page
        .getByRole('button', { name: /open dialog/i })
        .first()
        .waitFor();
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('has role="dialog"', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        await expect(dialog).toBeVisible();
        await expect(dialog).toHaveRole('dialog');
      });

      test('supports native <dialog> or custom role="dialog"', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        const tagName = await dialog.evaluate((el) => el.tagName.toLowerCase());

        // Native <dialog> or a custom element with role="dialog" are both acceptable
        expect(tagName === 'dialog' || (await dialog.getAttribute('role')) === 'dialog').toBe(true);
      });

      test('has aria-modal="true" (for custom dialog) or uses showModal (for native)', async ({
        page,
      }) => {
        await openDialog(page);
        const dialog = getDialog(page);

        const isNative = await dialog.evaluate((el) => el.tagName.toLowerCase() === 'dialog');
        if (isNative) {
          // Native <dialog> opened via showModal() is implicitly modal
          // aria-modal is not required when using showModal()
          const hasOpenAttribute = await dialog.evaluate((el) => el.hasAttribute('open'));
          expect(hasOpenAttribute).toBe(true);
        } else {
          // Custom dialog must have aria-modal="true"
          await expect(dialog).toHaveAttribute('aria-modal', 'true');
        }
      });

      test('is modal (opened via showModal for native dialog)', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        await expect(dialog).toBeVisible();

        const isNative = await dialog.evaluate((el) => el.tagName.toLowerCase() === 'dialog');
        if (isNative) {
          // Verify dialog has 'open' attribute (showModal sets this)
          const hasOpenAttribute = await dialog.evaluate((el) => el.hasAttribute('open'));
          expect(hasOpenAttribute).toBe(true);

          // Verify backdrop exists (showModal() creates ::backdrop)
          const hasBackdrop = await dialog.evaluate((el) => {
            const style = window.getComputedStyle(el, '::backdrop');
            return style.display !== 'none';
          });
          expect(hasBackdrop).toBe(true);
        } else {
          // Custom dialog should have aria-modal="true"
          await expect(dialog).toHaveAttribute('aria-modal', 'true');
        }
      });

      test('has aria-labelledby referencing title', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        const labelledbyId = await dialog.getAttribute('aria-labelledby');

        expect(labelledbyId).toBeTruthy();
        const titleElement = page.locator(`[id="${labelledbyId}"]`);
        await expect(titleElement).toBeVisible();

        // Verify it's an actual title element (heading)
        const tagName = await titleElement.evaluate((el) => el.tagName.toLowerCase());
        expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']).toContain(tagName);
      });

      test('has aria-describedby when description is provided', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        const describedbyId = await dialog.getAttribute('aria-describedby');

        // aria-describedby is optional for Dialog
        if (describedbyId) {
          const descriptionElement = page.locator(`[id="${describedbyId}"]`);
          await expect(descriptionElement).toBeVisible();
        }
      });

      test('has close button with accessible label', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        const closeButton = dialog.getByRole('button', { name: /close/i });

        await expect(closeButton).toBeVisible();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('Escape closes the dialog', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        await expect(dialog).toBeVisible();

        await page.keyboard.press('Escape');

        // Dialog should be closed
        await expect(dialog).not.toBeVisible();
      });

      test('Tab moves focus to next element', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);

        // Get all focusable elements in dialog
        const focusableElements = dialog.locator(
          'button:not([disabled]), [tabindex="0"], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
        );
        const count = await focusableElements.count();
        expect(count).toBeGreaterThanOrEqual(1);

        // Focus the first element explicitly
        const first = focusableElements.first();
        await first.focus();
        await expect(first).toBeFocused();

        // Tab should move to next element
        await page.keyboard.press('Tab');

        // If there's more than one focusable element, focus should have moved
        if (count > 1) {
          await expect(focusableElements.nth(1)).toBeFocused();
        }
      });

      test('Tab wraps from last to first element (focus trap)', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);

        // Get all focusable elements in dialog
        const focusableElements = dialog.locator(
          'button:not([disabled]), [tabindex="0"], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
        );
        const count = await focusableElements.count();

        // Tab through all elements plus one more to verify wrap
        for (let i = 0; i <= count; i++) {
          await page.keyboard.press('Tab');
        }

        // Focus should still be within dialog
        const focusedElement = page.locator(':focus');
        const isWithinDialog = await focusedElement.evaluate(
          (el) => el.closest('dialog, [role="dialog"]') !== null
        );
        expect(isWithinDialog).toBe(true);
      });

      test('Shift+Tab moves focus to previous element', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        const closeButton = dialog.getByRole('button', { name: /close/i });

        // Click close button to ensure focus is in dialog
        await closeButton.click();
        // Dialog closes on click, so reopen
        await page
          .getByRole('button', { name: /open dialog/i })
          .first()
          .click();
        await getDialog(page).waitFor({ state: 'visible' });

        // Tab once to move focus into dialog
        await page.keyboard.press('Tab');

        // Shift+Tab should move backwards but stay in dialog
        await page.keyboard.press('Shift+Tab');

        // Focus should still be within dialog
        const isWithinDialog = await page.evaluate(() => {
          const focused = document.activeElement;
          return focused?.closest('dialog, [role="dialog"]') !== null;
        });
        expect(isWithinDialog).toBe(true);
      });

      test('Shift+Tab wraps from first to last element', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);

        // Get all focusable elements
        const focusableElements = dialog.locator(
          'button:not([disabled]), [tabindex="0"], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
        );
        const count = await focusableElements.count();

        // Shift+Tab through all elements to test wrap
        for (let i = 0; i <= count; i++) {
          await page.keyboard.press('Shift+Tab');
        }

        // Focus should still be within dialog
        const focusedElement = page.locator(':focus');
        const isWithinDialog = await focusedElement.evaluate(
          (el) => el.closest('dialog, [role="dialog"]') !== null
        );
        expect(isWithinDialog).toBe(true);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Focus Management
    // ------------------------------------------
    test.describe('APG: Focus Management', () => {
      test('focuses first focusable element on open', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);

        // Focus should be within dialog
        const focusedElement = page.locator(':focus');
        const isWithinDialog = await focusedElement.evaluate(
          (el) => el.closest('dialog, [role="dialog"]') !== null
        );
        expect(isWithinDialog).toBe(true);
      });

      test('returns focus to trigger on close via Escape', async ({ page }) => {
        const trigger = await openDialog(page);

        await page.keyboard.press('Escape');

        // Focus should return to trigger
        await expect(trigger).toBeFocused();
      });

      test('returns focus to trigger on close via close button', async ({ page }) => {
        const trigger = await openDialog(page);

        const dialog = getDialog(page);
        const closeButton = dialog.getByRole('button', { name: /close/i });
        await closeButton.click();

        // Focus should return to trigger
        await expect(trigger).toBeFocused();
      });

      test('traps focus within dialog', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);

        // Get count of focusable elements
        const focusableElements = dialog.locator(
          'button:not([disabled]), [tabindex="0"], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]'
        );
        const count = await focusableElements.count();

        // Tab many times - focus should never leave dialog
        // First Tab may move focus into dialog, then subsequent Tabs should stay within
        const tabCount = Math.max(count * 3, 10);
        for (let i = 0; i < tabCount; i++) {
          await page.keyboard.press('Tab');
        }

        // After many Tabs, focus should still be within dialog
        const isWithinDialog = await page.evaluate(() => {
          const focused = document.activeElement;
          return focused?.closest('dialog, [role="dialog"]') !== null;
        });
        expect(isWithinDialog).toBe(true);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Click Interaction
    // ------------------------------------------
    test.describe('APG: Click Interaction', () => {
      test('clicking close button closes dialog', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        const closeButton = dialog.getByRole('button', { name: /close/i });
        await closeButton.click();

        await expect(dialog).not.toBeVisible();
      });

      test('clicking overlay closes dialog', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        await expect(dialog).toBeVisible();

        // Get viewport size and dialog bounds to find a safe click position outside dialog
        const viewportSize = page.viewportSize();
        const dialogBox = await dialog.boundingBox();

        if (viewportSize && dialogBox) {
          // Find a safe position outside dialog, handling edge cases
          // Try multiple positions: top, left, right, bottom of dialog
          const candidates = [
            // Above dialog (if there's space)
            { x: dialogBox.x + dialogBox.width / 2, y: Math.max(1, dialogBox.y - 20) },
            // Left of dialog (if there's space)
            { x: Math.max(1, dialogBox.x - 20), y: dialogBox.y + dialogBox.height / 2 },
            // Right of dialog (if there's space)
            {
              x: Math.min(viewportSize.width - 1, dialogBox.x + dialogBox.width + 20),
              y: dialogBox.y + dialogBox.height / 2,
            },
            // Below dialog (if there's space)
            {
              x: dialogBox.x + dialogBox.width / 2,
              y: Math.min(viewportSize.height - 1, dialogBox.y + dialogBox.height + 20),
            },
          ];

          // Find first candidate that's outside dialog bounds
          const isOutsideDialog = (x: number, y: number) =>
            x < dialogBox.x ||
            x > dialogBox.x + dialogBox.width ||
            y < dialogBox.y ||
            y > dialogBox.y + dialogBox.height;

          const safePosition = candidates.find((pos) => isOutsideDialog(pos.x, pos.y));

          if (safePosition) {
            await page.mouse.click(safePosition.x, safePosition.y);
          } else {
            // Fallback: click at viewport corner (1,1)
            await page.mouse.click(1, 1);
          }
        } else {
          // Fallback: click at viewport corner
          await page.mouse.click(1, 1);
        }

        // Dialog should close when clicking overlay
        await expect(dialog).not.toBeVisible();
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        await openDialog(page);

        const dialog = getDialog(page);
        await expect(dialog).toBeVisible();

        const results = await new AxeBuilder({ page })
          .include('dialog')
          .disableRules(['color-contrast'])
          .analyze();

        expect(results.violations).toEqual([]);
      });
    });
  });
}

// ============================================
// Cross-framework Consistency Tests
// ============================================

test.describe('Dialog - Cross-framework Consistency', () => {
  test('all frameworks render dialog with role="dialog"', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/dialog/${framework}/demo/`);
      await page
        .getByRole('button', { name: /open dialog/i })
        .first()
        .waitFor();

      // Open dialog
      const trigger = page.getByRole('button', { name: /open dialog/i }).first();
      await trigger.click();
      await getDialog(page).waitFor({ state: 'visible' });

      const dialog = getDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveRole('dialog');

      // Close dialog for next iteration
      await page.keyboard.press('Escape');
    }
  });

  test('all frameworks have aria-labelledby', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/dialog/${framework}/demo/`);
      await page
        .getByRole('button', { name: /open dialog/i })
        .first()
        .waitFor();

      const trigger = page.getByRole('button', { name: /open dialog/i }).first();
      await trigger.click();
      await getDialog(page).waitFor({ state: 'visible' });

      const dialog = getDialog(page);
      const labelledbyId = await dialog.getAttribute('aria-labelledby');
      expect(labelledbyId).toBeTruthy();

      await page.keyboard.press('Escape');
    }
  });

  test('all frameworks close on Escape', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/dialog/${framework}/demo/`);
      await page
        .getByRole('button', { name: /open dialog/i })
        .first()
        .waitFor();

      const trigger = page.getByRole('button', { name: /open dialog/i }).first();
      await trigger.click();
      await getDialog(page).waitFor({ state: 'visible' });

      const dialog = getDialog(page);
      await expect(dialog).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
    }
  });

  test('all frameworks trap focus within dialog', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/dialog/${framework}/demo/`);
      await page
        .getByRole('button', { name: /open dialog/i })
        .first()
        .waitFor();

      const trigger = page.getByRole('button', { name: /open dialog/i }).first();
      await trigger.click();
      await getDialog(page).waitFor({ state: 'visible' });

      // Tab multiple times
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press('Tab');
      }

      // After many Tabs, focus should still be within dialog
      const isWithinDialog = await page.evaluate(() => {
        const focused = document.activeElement;
        return focused?.closest('dialog, [role="dialog"]') !== null;
      });
      expect(isWithinDialog).toBe(true);

      await page.keyboard.press('Escape');
    }
  });
});
