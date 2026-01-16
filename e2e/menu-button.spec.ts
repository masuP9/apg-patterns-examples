import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Menu Button Pattern
 *
 * A button that opens a menu containing menu items. The button has
 * aria-haspopup="menu" and controls a dropdown menu.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/menu-button/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getMenuButton = (page: import('@playwright/test').Page) => {
  return page.getByRole('button', { name: /actions|file/i }).first();
};

const getMenu = (page: import('@playwright/test').Page) => {
  return page.getByRole('menu');
};

const getMenuItems = (page: import('@playwright/test').Page) => {
  return page.getByRole('menuitem');
};

const openMenu = async (page: import('@playwright/test').Page) => {
  const button = getMenuButton(page);
  await button.click();
  await getMenu(page).waitFor({ state: 'visible' });
  return button;
};

// Wait for hydration to complete
// This is necessary for frameworks like Svelte where event handlers are attached after hydration
const waitForHydration = async (page: import('@playwright/test').Page) => {
  const button = getMenuButton(page);
  // Wait for aria-controls to be set (basic check)
  await expect(button).toHaveAttribute('aria-controls', /.+/);
  // Poll until a click actually opens the menu (ensures handlers are attached)
  await expect
    .poll(async () => {
      await button.click();
      const isOpen = await getMenu(page).isVisible();
      if (isOpen) {
        await page.keyboard.press('Escape');
      }
      return isOpen;
    })
    .toBe(true);
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Menu Button (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/menu-button/${framework}/demo/`);
      await getMenuButton(page).waitFor();

      // Wait for hydration in frameworks that need it (Svelte)
      // This ensures event handlers are attached before tests run
      if (framework === 'svelte') {
        await waitForHydration(page);
      }
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('button has aria-haspopup="menu"', async ({ page }) => {
        const button = getMenuButton(page);
        await expect(button).toHaveAttribute('aria-haspopup', 'menu');
      });

      test('button has aria-expanded (false when closed)', async ({ page }) => {
        const button = getMenuButton(page);
        await expect(button).toHaveAttribute('aria-expanded', 'false');
      });

      test('button has aria-expanded (true when open)', async ({ page }) => {
        const button = await openMenu(page);
        await expect(button).toHaveAttribute('aria-expanded', 'true');
      });

      test('button has aria-controls referencing menu id', async ({ page }) => {
        const button = getMenuButton(page);

        // Wait for hydration - aria-controls may not be set immediately in Svelte
        await expect
          .poll(async () => {
            const id = await button.getAttribute('aria-controls');
            return id && id.length > 1 && !id.startsWith('-');
          })
          .toBe(true);

        const menuId = await button.getAttribute('aria-controls');
        expect(menuId).toBeTruthy();

        await openMenu(page);
        const menu = getMenu(page);
        await expect(menu).toHaveAttribute('id', menuId!);
      });

      test('menu has role="menu"', async ({ page }) => {
        await openMenu(page);
        const menu = getMenu(page);
        await expect(menu).toBeVisible();
        await expect(menu).toHaveRole('menu');
      });

      test('menu has accessible name via aria-labelledby', async ({ page }) => {
        await openMenu(page);
        const menu = getMenu(page);
        const labelledby = await menu.getAttribute('aria-labelledby');
        expect(labelledby).toBeTruthy();

        // Verify it references the button
        const button = getMenuButton(page);
        const buttonId = await button.getAttribute('id');
        expect(labelledby).toBe(buttonId);
      });

      test('menu items have role="menuitem"', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);
        const count = await items.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(items.nth(i)).toHaveRole('menuitem');
        }
      });

      test('disabled items have aria-disabled="true"', async ({ page }) => {
        // Use the File menu demo which must have disabled item (Export)
        const fileButton = page.getByRole('button', { name: /file/i });
        await expect(fileButton).toBeVisible();
        await fileButton.click();
        await getMenu(page).waitFor({ state: 'visible' });

        const disabledItem = page.getByRole('menuitem', { name: /export/i });
        await expect(disabledItem).toBeVisible();
        await expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction (Button)
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction (Button)', () => {
      test('Enter opens menu and focuses first item', async ({ page }) => {
        const button = getMenuButton(page);
        await button.focus();
        await page.keyboard.press('Enter');

        await expect(getMenu(page)).toBeVisible();
        await expect(button).toHaveAttribute('aria-expanded', 'true');

        // First item should be focused
        const firstItem = getMenuItems(page).first();
        await expect(firstItem).toBeFocused();
      });

      test('Space opens menu and focuses first item', async ({ page }) => {
        const button = getMenuButton(page);
        await button.focus();
        await page.keyboard.press('Space');

        await expect(getMenu(page)).toBeVisible();
        const firstItem = getMenuItems(page).first();
        await expect(firstItem).toBeFocused();
      });

      test('ArrowDown opens menu and focuses first item', async ({ page }) => {
        const button = getMenuButton(page);
        await button.focus();
        await page.keyboard.press('ArrowDown');

        await expect(getMenu(page)).toBeVisible();
        const firstItem = getMenuItems(page).first();
        await expect(firstItem).toBeFocused();
      });

      test('ArrowUp opens menu and focuses last enabled item', async ({ page }) => {
        const button = getMenuButton(page);
        await button.focus();
        await page.keyboard.press('ArrowUp');

        await expect(getMenu(page)).toBeVisible();

        // Find the last enabled item by checking focus
        const focusedItem = page.locator(':focus');
        await expect(focusedItem).toHaveRole('menuitem');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction (Menu)
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction (Menu)', () => {
      test('ArrowDown moves to next item', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);
        const firstItem = items.first();
        await firstItem.focus();

        await page.keyboard.press('ArrowDown');

        const secondItem = items.nth(1);
        await expect(secondItem).toBeFocused();
      });

      test('ArrowDown wraps from last to first', async ({ page }) => {
        await openMenu(page);

        // Focus the last enabled item
        // For basic menu, just navigate to end
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('End');
        }

        const focusedBefore = await page.evaluate(() => document.activeElement?.textContent);
        await page.keyboard.press('ArrowDown');
        const focusedAfter = await page.evaluate(() => document.activeElement?.textContent);

        // Should have wrapped to a different item (first)
        expect(focusedAfter).not.toBe(focusedBefore);
      });

      test('ArrowUp moves to previous item', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);

        // Start from second item
        await items.nth(1).focus();

        await page.keyboard.press('ArrowUp');

        const firstItem = items.first();
        await expect(firstItem).toBeFocused();
      });

      test('ArrowUp wraps from first to last', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);
        const firstItem = items.first();
        await firstItem.focus();

        const focusedBefore = await page.evaluate(() => document.activeElement?.textContent);
        await page.keyboard.press('ArrowUp');
        const focusedAfter = await page.evaluate(() => document.activeElement?.textContent);

        // Should have wrapped to last item
        expect(focusedAfter).not.toBe(focusedBefore);
      });

      test('Home moves to first enabled item', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);

        // Start from second item
        await items.nth(1).focus();

        await page.keyboard.press('Home');

        const firstItem = items.first();
        await expect(firstItem).toBeFocused();
      });

      test('End moves to last enabled item', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);
        const firstItem = items.first();
        await firstItem.focus();

        await page.keyboard.press('End');

        // Focus should be on last item (or last enabled item)
        const focusedItem = page.locator(':focus');
        await expect(focusedItem).toHaveRole('menuitem');

        // Should not be the first item anymore
        const focusedText = await focusedItem.textContent();
        const firstText = await firstItem.textContent();
        expect(focusedText).not.toBe(firstText);
      });

      test('Escape closes menu and returns focus to button', async ({ page }) => {
        const button = await openMenu(page);

        await page.keyboard.press('Escape');

        await expect(getMenu(page)).not.toBeVisible();
        await expect(button).toHaveAttribute('aria-expanded', 'false');
        await expect(button).toBeFocused();
      });

      test('Enter activates item and closes menu', async ({ page }) => {
        const button = await openMenu(page);
        const items = getMenuItems(page);
        const firstItem = items.first();
        await firstItem.focus();

        await page.keyboard.press('Enter');

        await expect(getMenu(page)).not.toBeVisible();
        await expect(button).toBeFocused();
      });

      test('Space activates item and closes menu', async ({ page }) => {
        const button = await openMenu(page);
        const items = getMenuItems(page);
        const firstItem = items.first();
        await firstItem.focus();

        await page.keyboard.press('Space');

        await expect(getMenu(page)).not.toBeVisible();
        await expect(button).toBeFocused();
      });

      test('Tab closes menu', async ({ page }) => {
        await openMenu(page);

        await page.keyboard.press('Tab');

        await expect(getMenu(page)).not.toBeVisible();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Focus Management (Roving Tabindex)
    // ------------------------------------------
    test.describe('APG: Focus Management', () => {
      test('focused item has tabindex="0"', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);
        const firstItem = items.first();
        await firstItem.focus();

        await expect(firstItem).toHaveAttribute('tabindex', '0');
      });

      test('non-focused items have tabindex="-1"', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);
        const count = await items.count();

        if (count > 1) {
          const firstItem = items.first();
          await firstItem.focus();

          // Check second item has tabindex="-1"
          const secondItem = items.nth(1);
          await expect(secondItem).toHaveAttribute('tabindex', '-1');
        }
      });

      test('disabled items are skipped during navigation', async ({ page }) => {
        // Use the File menu demo which must have disabled items
        const fileButton = page.getByRole('button', { name: /file/i });
        await expect(fileButton).toBeVisible();
        await fileButton.click();
        await getMenu(page).waitFor({ state: 'visible' });

        // Navigate through all items
        const focusedTexts: string[] = [];
        for (let i = 0; i < 10; i++) {
          const text = await page.evaluate(() => document.activeElement?.textContent || '');
          if (text && !focusedTexts.includes(text)) {
            focusedTexts.push(text);
          }
          await page.keyboard.press('ArrowDown');
        }

        // "Export" (disabled) should not be in the focused list
        expect(focusedTexts).not.toContain('Export');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Click Interaction
    // ------------------------------------------
    test.describe('APG: Click Interaction', () => {
      test('click button opens menu', async ({ page }) => {
        const button = getMenuButton(page);
        await button.click();

        await expect(getMenu(page)).toBeVisible();
        await expect(button).toHaveAttribute('aria-expanded', 'true');
      });

      test('click button again closes menu (toggle)', async ({ page }) => {
        const button = getMenuButton(page);
        await button.click();
        await expect(getMenu(page)).toBeVisible();

        await button.click();
        await expect(getMenu(page)).not.toBeVisible();
        await expect(button).toHaveAttribute('aria-expanded', 'false');
      });

      test('click menu item activates and closes menu', async ({ page }) => {
        await openMenu(page);
        const items = getMenuItems(page);
        const firstItem = items.first();

        await firstItem.click();

        await expect(getMenu(page)).not.toBeVisible();
      });

      test('click outside menu closes it', async ({ page }) => {
        await openMenu(page);

        const menu = getMenu(page);
        const menuBox = await menu.boundingBox();
        expect(menuBox).not.toBeNull();

        const viewportSize = page.viewportSize();
        expect(viewportSize).not.toBeNull();

        // Find a safe position outside menu, handling edge cases
        const candidates = [
          // Above menu (if there's space)
          { x: menuBox!.x + menuBox!.width / 2, y: Math.max(1, menuBox!.y - 20) },
          // Left of menu (if there's space)
          { x: Math.max(1, menuBox!.x - 20), y: menuBox!.y + menuBox!.height / 2 },
          // Right of menu (if there's space)
          {
            x: Math.min(viewportSize!.width - 1, menuBox!.x + menuBox!.width + 20),
            y: menuBox!.y + menuBox!.height / 2,
          },
          // Below menu (if there's space)
          {
            x: menuBox!.x + menuBox!.width / 2,
            y: Math.min(viewportSize!.height - 1, menuBox!.y + menuBox!.height + 20),
          },
        ];

        // Find first candidate that's outside menu bounds
        const isOutsideMenu = (x: number, y: number) =>
          x < menuBox!.x ||
          x > menuBox!.x + menuBox!.width ||
          y < menuBox!.y ||
          y > menuBox!.y + menuBox!.height;

        const safePosition = candidates.find((pos) => isOutsideMenu(pos.x, pos.y));

        if (safePosition) {
          await page.mouse.click(safePosition.x, safePosition.y);
        } else {
          // Fallback: click at viewport corner (1,1)
          await page.mouse.click(1, 1);
        }

        await expect(getMenu(page)).not.toBeVisible();
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Type-Ahead
    // ------------------------------------------
    test.describe('Type-Ahead', () => {
      test('single character focuses matching item', async ({ page }) => {
        await openMenu(page);

        // Wait for first item to be focused (menu opens with focus on first item)
        const firstItem = getMenuItems(page).first();
        await expect(firstItem).toBeFocused();

        // Type 'p' to find "Paste" - use press() for single key
        await page.keyboard.press('p');

        // Wait for focus to move to item starting with 'p'
        // Use trim() because some frameworks may include whitespace in textContent
        await expect
          .poll(async () => {
            const text = await page.evaluate(
              () => document.activeElement?.textContent?.trim().toLowerCase() || ''
            );
            return text.startsWith('p');
          })
          .toBe(true);
      });

      test('type-ahead wraps around', async ({ page }) => {
        await openMenu(page);

        // Focus last item
        await page.keyboard.press('End');
        const lastItem = getMenuItems(page).last();
        await expect(lastItem).toBeFocused();

        // Type character that matches earlier item - use press() for single key
        await page.keyboard.press('c');

        // Wait for focus to wrap and find item starting with 'c'
        // Use trim() because some frameworks may include whitespace in textContent
        await expect
          .poll(async () => {
            const text = await page.evaluate(
              () => document.activeElement?.textContent?.trim().toLowerCase() || ''
            );
            return text.startsWith('c');
          })
          .toBe(true);
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations (closed)', async ({ page }) => {
        const results = await new AxeBuilder({ page })
          .include('.apg-menu-button')
          .disableRules(['color-contrast'])
          .analyze();

        expect(results.violations).toEqual([]);
      });

      test('has no axe-core violations (open)', async ({ page }) => {
        await openMenu(page);

        const results = await new AxeBuilder({ page })
          .include('.apg-menu-button')
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

test.describe('Menu Button - Cross-framework Consistency', () => {
  test('all frameworks have menu button with aria-haspopup="menu"', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/menu-button/${framework}/demo/`);
      await getMenuButton(page).waitFor();

      const button = getMenuButton(page);
      await expect(button).toHaveAttribute('aria-haspopup', 'menu');
    }
  });

  test('all frameworks open menu on click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/menu-button/${framework}/demo/`);
      await getMenuButton(page).waitFor();

      const button = getMenuButton(page);
      await button.click();

      const menu = getMenu(page);
      await expect(menu).toBeVisible();

      // Close for next iteration
      await page.keyboard.press('Escape');
    }
  });

  test('all frameworks close menu on Escape', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/menu-button/${framework}/demo/`);
      await getMenuButton(page).waitFor();

      await openMenu(page);
      await expect(getMenu(page)).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(getMenu(page)).not.toBeVisible();
    }
  });

  test('all frameworks have consistent keyboard navigation', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/menu-button/${framework}/demo/`);
      await getMenuButton(page).waitFor();

      // Wait for hydration (especially needed for Svelte)
      if (framework === 'svelte') {
        await waitForHydration(page);
      }

      const button = getMenuButton(page);
      await button.focus();
      await page.keyboard.press('Enter');

      const menu = getMenu(page);
      await expect(menu).toBeVisible();

      // First item should be focused
      const firstItem = getMenuItems(page).first();
      await expect(firstItem).toBeFocused();

      // Arrow navigation
      await page.keyboard.press('ArrowDown');
      const secondItem = getMenuItems(page).nth(1);
      await expect(secondItem).toBeFocused();

      await page.keyboard.press('Escape');
    }
  });
});
