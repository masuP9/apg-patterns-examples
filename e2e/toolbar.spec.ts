import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Toolbar Pattern
 *
 * A container for grouping a set of controls, such as buttons, toggle buttons,
 * or menus. Toolbar uses roving tabindex for keyboard navigation.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getToolbar = (page: import('@playwright/test').Page) => {
  return page.getByRole('toolbar');
};

const getToolbarButtons = (page: import('@playwright/test').Page, toolbarIndex = 0) => {
  const toolbar = getToolbar(page).nth(toolbarIndex);
  return toolbar.getByRole('button');
};

const getSeparators = (page: import('@playwright/test').Page, toolbarIndex = 0) => {
  const toolbar = getToolbar(page).nth(toolbarIndex);
  return toolbar.getByRole('separator');
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Toolbar (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/toolbar/${framework}/demo/`);
      await getToolbar(page).first().waitFor();

      // Wait for hydration - first button should have tabindex="0"
      const firstButton = getToolbarButtons(page, 0).first();
      await expect
        .poll(async () => {
          const tabindex = await firstButton.getAttribute('tabindex');
          return tabindex === '0';
        })
        .toBe(true);
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('container has role="toolbar"', async ({ page }) => {
        const toolbar = getToolbar(page).first();
        await expect(toolbar).toHaveRole('toolbar');
      });

      test('toolbar has aria-label for accessible name', async ({ page }) => {
        const toolbar = getToolbar(page).first();
        const ariaLabel = await toolbar.getAttribute('aria-label');
        expect(ariaLabel).toBeTruthy();
      });

      test('horizontal toolbar has aria-orientation="horizontal"', async ({ page }) => {
        const toolbar = getToolbar(page).first();
        await expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal');
      });

      test('vertical toolbar has aria-orientation="vertical"', async ({ page }) => {
        // Second toolbar is vertical
        const toolbar = getToolbar(page).nth(1);
        await expect(toolbar).toHaveAttribute('aria-orientation', 'vertical');
      });

      test('buttons have implicit role="button"', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const count = await buttons.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < Math.min(3, count); i++) {
          await expect(buttons.nth(i)).toHaveRole('button');
        }
      });

      test('separator has role="separator"', async ({ page }) => {
        const separators = getSeparators(page, 0);
        const count = await separators.count();
        expect(count).toBeGreaterThan(0);

        await expect(separators.first()).toHaveRole('separator');
      });

      test('separator in horizontal toolbar has aria-orientation="vertical"', async ({ page }) => {
        const separator = getSeparators(page, 0).first();
        await expect(separator).toHaveAttribute('aria-orientation', 'vertical');
      });

      test('separator in vertical toolbar has aria-orientation="horizontal"', async ({ page }) => {
        // Second toolbar is vertical
        const separator = getSeparators(page, 1).first();
        await expect(separator).toHaveAttribute('aria-orientation', 'horizontal');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Toggle Button ARIA
    // ------------------------------------------
    test.describe('APG: Toggle Button ARIA', () => {
      test('toggle button has aria-pressed attribute', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();

        const ariaPressed = await firstButton.getAttribute('aria-pressed');
        expect(ariaPressed === 'true' || ariaPressed === 'false').toBe(true);
      });

      test('clicking toggle button changes aria-pressed', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const toggleButton = buttons.first();

        const initialPressed = await toggleButton.getAttribute('aria-pressed');

        await toggleButton.click();

        const newPressed = await toggleButton.getAttribute('aria-pressed');
        expect(newPressed).not.toBe(initialPressed);
      });

      test('toggle button with defaultPressed starts as pressed', async ({ page }) => {
        // Fifth toolbar has defaultPressed toggle buttons
        const toolbar = getToolbar(page).nth(4);
        const buttons = toolbar.getByRole('button');
        const firstButton = buttons.first();

        await expect(firstButton).toHaveAttribute('aria-pressed', 'true');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction (Horizontal)
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction (Horizontal)', () => {
      test('ArrowRight moves focus to next button', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();
        const secondButton = buttons.nth(1);

        await firstButton.click();
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('ArrowRight');

        await expect(secondButton).toBeFocused();
      });

      test('ArrowLeft moves focus to previous button', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();
        const secondButton = buttons.nth(1);

        await secondButton.click();
        await expect(secondButton).toBeFocused();

        await page.keyboard.press('ArrowLeft');

        await expect(firstButton).toBeFocused();
      });

      test('Home moves focus to first button', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();
        const lastButton = buttons.last();

        await lastButton.click();
        await expect(lastButton).toBeFocused();

        await page.keyboard.press('Home');

        await expect(firstButton).toBeFocused();
      });

      test('End moves focus to last button', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();
        const lastButton = buttons.last();

        await firstButton.click();
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('End');

        await expect(lastButton).toBeFocused();
      });

      test('focus does not wrap at end (stops at edge)', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const lastButton = buttons.last();

        await lastButton.click();
        await expect(lastButton).toBeFocused();

        await page.keyboard.press('ArrowRight');

        // Should still be on last button (no wrap)
        await expect(lastButton).toBeFocused();
      });

      test('focus does not wrap at start (stops at edge)', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();

        await firstButton.click();
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('ArrowLeft');

        // Should still be on first button (no wrap)
        await expect(firstButton).toBeFocused();
      });

      test('ArrowUp/Down are ignored in horizontal toolbar', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();

        await firstButton.click();
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('ArrowDown');
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('ArrowUp');
        await expect(firstButton).toBeFocused();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction (Vertical)
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction (Vertical)', () => {
      test('ArrowDown moves focus to next button in vertical toolbar', async ({ page }) => {
        // Second toolbar is vertical
        const buttons = getToolbarButtons(page, 1);
        const firstButton = buttons.first();
        const secondButton = buttons.nth(1);

        await firstButton.click();
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('ArrowDown');

        await expect(secondButton).toBeFocused();
      });

      test('ArrowUp moves focus to previous button in vertical toolbar', async ({ page }) => {
        const buttons = getToolbarButtons(page, 1);
        const firstButton = buttons.first();
        const secondButton = buttons.nth(1);

        await secondButton.click();
        await expect(secondButton).toBeFocused();

        await page.keyboard.press('ArrowUp');

        await expect(firstButton).toBeFocused();
      });

      test('ArrowLeft/Right are ignored in vertical toolbar', async ({ page }) => {
        const buttons = getToolbarButtons(page, 1);
        const firstButton = buttons.first();

        await firstButton.click();
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('ArrowRight');
        await expect(firstButton).toBeFocused();

        await page.keyboard.press('ArrowLeft');
        await expect(firstButton).toBeFocused();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Disabled Items
    // ------------------------------------------
    test.describe('APG: Disabled Items', () => {
      test('disabled button has disabled attribute', async ({ page }) => {
        // Third toolbar has disabled items
        const toolbar = getToolbar(page).nth(2);
        const buttons = toolbar.getByRole('button');

        let foundDisabled = false;
        const count = await buttons.count();

        for (let i = 0; i < count; i++) {
          const isDisabled = await buttons.nth(i).isDisabled();
          if (isDisabled) {
            foundDisabled = true;
            break;
          }
        }

        expect(foundDisabled).toBe(true);
      });

      test('arrow key navigation skips disabled buttons', async ({ page }) => {
        // Third toolbar has disabled items: Undo, Redo(disabled), Cut, Copy, Paste(disabled)
        const toolbar = getToolbar(page).nth(2);
        const buttons = toolbar.getByRole('button');
        const undoButton = buttons.filter({ hasText: 'Undo' });

        await undoButton.click();
        await expect(undoButton).toBeFocused();

        // ArrowRight should skip Redo (disabled) and go to Cut
        await page.keyboard.press('ArrowRight');

        // Should be on Cut, not Redo
        const focusedButton = page.locator(':focus');
        const focusedText = await focusedButton.textContent();
        expect(focusedText).not.toContain('Redo');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Roving Tabindex
    // ------------------------------------------
    test.describe('APG: Roving Tabindex', () => {
      test('first button has tabindex="0" initially', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();

        await expect(firstButton).toHaveAttribute('tabindex', '0');
      });

      test('other buttons have tabindex="-1" initially', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const count = await buttons.count();

        for (let i = 1; i < count; i++) {
          await expect(buttons.nth(i)).toHaveAttribute('tabindex', '-1');
        }
      });

      test('focused button gets tabindex="0", previous loses it', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const firstButton = buttons.first();
        const secondButton = buttons.nth(1);

        await firstButton.click();
        await page.keyboard.press('ArrowRight');

        // Second button should now have tabindex="0"
        await expect(secondButton).toHaveAttribute('tabindex', '0');
        // First button should have tabindex="-1"
        await expect(firstButton).toHaveAttribute('tabindex', '-1');
      });

      test('only one enabled button has tabindex="0" at a time', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const count = await buttons.count();

        let tabbableCount = 0;
        for (let i = 0; i < count; i++) {
          const button = buttons.nth(i);
          const isDisabled = await button.isDisabled();
          if (isDisabled) continue;

          const tabindex = await button.getAttribute('tabindex');
          if (tabindex === '0') {
            tabbableCount++;
          }
        }

        expect(tabbableCount).toBe(1);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Button Activation
    // ------------------------------------------
    test.describe('APG: Button Activation', () => {
      test('Enter activates button', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const toggleButton = buttons.first();

        // Focus the button without clicking (to avoid changing state)
        await toggleButton.focus();
        await expect(toggleButton).toBeFocused();

        const initialPressed = await toggleButton.getAttribute('aria-pressed');

        await page.keyboard.press('Enter');

        const newPressed = await toggleButton.getAttribute('aria-pressed');
        expect(newPressed).not.toBe(initialPressed);
      });

      test('Space activates button', async ({ page }) => {
        const buttons = getToolbarButtons(page, 0);
        const toggleButton = buttons.first();

        // Focus the button without clicking (to avoid changing state)
        await toggleButton.focus();
        await expect(toggleButton).toBeFocused();

        const initialPressed = await toggleButton.getAttribute('aria-pressed');

        await page.keyboard.press('Space');

        const newPressed = await toggleButton.getAttribute('aria-pressed');
        expect(newPressed).not.toBe(initialPressed);
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        await getToolbar(page).first().waitFor();

        const results = await new AxeBuilder({ page })
          .include('[role="toolbar"]')
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

test.describe('Toolbar - Cross-framework Consistency', () => {
  test('all frameworks render toolbars', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/toolbar/${framework}/demo/`);
      await getToolbar(page).first().waitFor();

      const toolbars = getToolbar(page);
      const count = await toolbars.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks support keyboard navigation', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/toolbar/${framework}/demo/`);
      await getToolbar(page).first().waitFor();

      const buttons = getToolbarButtons(page, 0);
      const firstButton = buttons.first();
      const secondButton = buttons.nth(1);

      await firstButton.click();
      await expect(firstButton).toBeFocused();

      await page.keyboard.press('ArrowRight');
      await expect(secondButton).toBeFocused();
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/toolbar/${framework}/demo/`);
      await getToolbar(page).first().waitFor();

      // Check toolbar role
      const toolbar = getToolbar(page).first();
      await expect(toolbar).toHaveRole('toolbar');

      // Check aria-label
      const ariaLabel = await toolbar.getAttribute('aria-label');
      expect(ariaLabel).toBeTruthy();

      // Check aria-orientation
      const orientation = await toolbar.getAttribute('aria-orientation');
      expect(orientation).toBe('horizontal');

      // Check buttons exist
      const buttons = getToolbarButtons(page, 0);
      const count = await buttons.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks support toggle buttons', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/toolbar/${framework}/demo/`);
      await getToolbar(page).first().waitFor();

      const buttons = getToolbarButtons(page, 0);
      const toggleButton = buttons.first();

      // Should have aria-pressed
      const initialPressed = await toggleButton.getAttribute('aria-pressed');
      expect(initialPressed === 'true' || initialPressed === 'false').toBe(true);

      // Should toggle on click
      await toggleButton.click();
      const newPressed = await toggleButton.getAttribute('aria-pressed');
      expect(newPressed).not.toBe(initialPressed);
    }
  });
});
