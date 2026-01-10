import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Menubar Component
 *
 * These tests verify the Menubar behavior across all frameworks:
 * - role="menubar" on horizontal container
 * - role="menu" on dropdown menus
 * - Horizontal navigation (ArrowLeft/ArrowRight)
 * - Submenu hierarchy navigation
 * - menuitemcheckbox and menuitemradio support
 * - role="none" on li elements
 * - Hover-based menu switching
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Menubar (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/menubar/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    test.describe('ARIA Attributes', () => {
      test('has role="menubar" on container', async ({ page }) => {
        const menubar = page.getByRole('menubar');
        await expect(menubar).toBeVisible();
      });

      test('has role="menu" on dropdown', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        await expect(menu).toBeVisible();
      });

      test('has aria-haspopup="menu" on items with submenu (not "true")', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        const haspopup = await fileItem.getAttribute('aria-haspopup');
        expect(haspopup).toBe('menu');
      });

      test('has aria-expanded on items with submenu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');

        await fileItem.click();
        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      });

      test('all li elements have role="none"', async ({ page }) => {
        const listItems = page.locator('li');
        const count = await listItems.count();

        for (let i = 0; i < count; i++) {
          await expect(listItems.nth(i)).toHaveAttribute('role', 'none');
        }
      });

      test('has role="menuitemcheckbox" on checkbox items', async ({ page }) => {
        // Open View menu to see checkbox items
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        const checkboxItems = page.getByRole('menuitemcheckbox');
        await expect(checkboxItems.first()).toBeVisible();
      });

      test('has role="menuitemradio" on radio items', async ({ page }) => {
        // Open View menu to see radio items
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        const radioItems = page.getByRole('menuitemradio');
        await expect(radioItems.first()).toBeVisible();
      });

      test('has role="separator" on dividers', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const separator = page.getByRole('separator');
        await expect(separator.first()).toBeVisible();
      });

      test('has role="group" on radio groups with aria-label', async ({ page }) => {
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        const group = page.getByRole('group');
        await expect(group.first()).toBeVisible();
        const label = await group.first().getAttribute('aria-label');
        expect(label).toBeTruthy();
      });

      test('menu has aria-hidden="true" when closed', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        const menuId = await fileItem.getAttribute('aria-controls');

        // If aria-controls exists, use it; otherwise find sibling menu (direct child of same li)
        const menu = menuId
          ? page.locator(`#${menuId}`)
          : fileItem.locator('..').locator('> [role="menu"]');

        await expect(menu).toHaveAttribute('aria-hidden', 'true');
      });

      test('menu has aria-hidden="false" when open', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        await expect(menu).toHaveAttribute('aria-hidden', 'false');
      });

      test('submenu has aria-hidden="true" when closed', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        // Find item with submenu (e.g., "Open Recent")
        const menu = page.getByRole('menu');
        const submenuTrigger = menu.getByRole('menuitem', { name: /recent/i });

        if ((await submenuTrigger.count()) > 0) {
          // Get the submenu element (sibling ul with role="menu")
          const submenu = submenuTrigger.locator('..').locator('[role="menu"]');
          await expect(submenu).toHaveAttribute('aria-hidden', 'true');
        }
      });

      test('submenu has aria-hidden="false" when open', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        // Find item with submenu (e.g., "Open Recent")
        const menu = page.getByRole('menu').first();
        const submenuTrigger = menu.getByRole('menuitem', { name: /recent/i });

        if ((await submenuTrigger.count()) > 0) {
          await submenuTrigger.focus();
          await page.keyboard.press('ArrowRight');

          // The submenu should now be open
          await expect(submenuTrigger).toHaveAttribute('aria-expanded', 'true');

          // Get the submenu element
          const submenu = submenuTrigger.locator('..').locator('[role="menu"]');
          await expect(submenu).toHaveAttribute('aria-hidden', 'false');
        }
      });
    });

    test.describe('Keyboard Interaction - Menubar', () => {
      test('ArrowRight moves to next menubar item', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.focus();
        await page.keyboard.press('ArrowRight');

        const editItem = page.getByRole('menuitem', { name: 'Edit' });
        await expect(editItem).toBeFocused();
      });

      test('ArrowLeft moves to previous menubar item', async ({ page }) => {
        const editItem = page.getByRole('menuitem', { name: 'Edit' });
        await editItem.focus();
        await page.keyboard.press('ArrowLeft');

        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await expect(fileItem).toBeFocused();
      });

      test('ArrowRight wraps from last to first', async ({ page }) => {
        // Get the last menubar item
        const menubar = page.getByRole('menubar');
        const items = menubar.getByRole('menuitem');
        const lastItem = items.last();
        await lastItem.focus();

        await page.keyboard.press('ArrowRight');

        const firstItem = items.first();
        await expect(firstItem).toBeFocused();
      });

      test('ArrowDown opens submenu and focuses first item', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.focus();
        await page.keyboard.press('ArrowDown');

        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

        const menu = page.getByRole('menu');
        const firstMenuItem = menu.getByRole('menuitem').first();
        await expect(firstMenuItem).toBeFocused();
      });

      test('Enter opens submenu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.focus();
        await page.keyboard.press('Enter');

        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');
        const menu = page.getByRole('menu');
        await expect(menu).toBeVisible();
      });

      test('Space opens submenu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.focus();
        await page.keyboard.press('Space');

        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');
        const menu = page.getByRole('menu');
        await expect(menu).toBeVisible();
      });

      test('Home moves to first menubar item', async ({ page }) => {
        const editItem = page.getByRole('menuitem', { name: 'Edit' });
        await editItem.focus();
        await page.keyboard.press('Home');

        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await expect(fileItem).toBeFocused();
      });

      test('End moves to last menubar item', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.focus();
        await page.keyboard.press('End');

        const menubar = page.getByRole('menubar');
        const items = menubar.getByRole('menuitem');
        const lastItem = items.last();
        await expect(lastItem).toBeFocused();
      });

      test('ArrowUp opens submenu and focuses last item', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.focus();
        await page.keyboard.press('ArrowUp');

        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

        const menu = page.getByRole('menu');
        const menuItems = menu.getByRole('menuitem');
        const lastMenuItem = menuItems.last();
        await expect(lastMenuItem).toBeFocused();
      });

      test('Tab closes all menus', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();
        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

        await page.keyboard.press('Tab');

        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      });
    });

    test.describe('Keyboard Interaction - Menu', () => {
      test('ArrowDown moves to next item in menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const items = menu.getByRole('menuitem');
        const firstItem = items.first();
        await firstItem.focus();

        await page.keyboard.press('ArrowDown');
        await expect(items.nth(1)).toBeFocused();
      });

      test('ArrowUp moves to previous item in menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const items = menu.getByRole('menuitem');
        await items.nth(1).focus();

        await page.keyboard.press('ArrowUp');
        await expect(items.first()).toBeFocused();
      });

      test('Escape closes menu and returns focus to menubar item', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();
        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

        await page.keyboard.press('Escape');

        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
        await expect(fileItem).toBeFocused();
      });

      test('Enter activates menuitem and closes menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const newItem = menu.getByRole('menuitem', { name: 'New' });
        await newItem.focus();
        await page.keyboard.press('Enter');

        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      });

      test('Home moves to first item in menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const items = menu.getByRole('menuitem');
        const lastItem = items.last();
        await lastItem.focus();
        await page.keyboard.press('Home');

        const firstItem = items.first();
        await expect(firstItem).toBeFocused();
      });

      test('End moves to last item in menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const items = menu.getByRole('menuitem');
        const firstItem = items.first();
        await firstItem.focus();
        await page.keyboard.press('End');

        const lastItem = items.last();
        await expect(lastItem).toBeFocused();
      });

      test('ArrowRight in menu opens submenu if item has one', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        // Find item with submenu (e.g., "Open Recent")
        const menu = page.getByRole('menu');
        const submenuItem = menu.getByRole('menuitem', { name: /recent/i });

        if ((await submenuItem.count()) > 0) {
          await submenuItem.focus();
          await page.keyboard.press('ArrowRight');

          await expect(submenuItem).toHaveAttribute('aria-expanded', 'true');
        }
      });

      test('ArrowRight in menu moves to next menubar item menu when no submenu', async ({
        page,
      }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const firstItem = menu.getByRole('menuitem').first();
        await firstItem.focus();

        await page.keyboard.press('ArrowRight');

        // File menu should close, Edit menu should open
        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
        const editItem = page.getByRole('menuitem', { name: 'Edit' });
        await expect(editItem).toHaveAttribute('aria-expanded', 'true');
      });

      test('ArrowLeft in menu moves to previous menubar item menu', async ({ page }) => {
        const editItem = page.getByRole('menuitem', { name: 'Edit' });
        await editItem.click();

        const menu = page.getByRole('menu');
        const firstItem = menu.getByRole('menuitem').first();
        await firstItem.focus();

        await page.keyboard.press('ArrowLeft');

        // Edit menu should close, File menu should open
        await expect(editItem).toHaveAttribute('aria-expanded', 'false');
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      });
    });

    test.describe('Checkbox and Radio Items', () => {
      test('Space toggles checkbox and menu stays open', async ({ page }) => {
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        const checkbox = page.getByRole('menuitemcheckbox').first();
        const initialChecked = await checkbox.getAttribute('aria-checked');
        await checkbox.focus();
        await page.keyboard.press('Space');

        // Menu should still be open
        await expect(viewItem).toHaveAttribute('aria-expanded', 'true');

        // aria-checked should have toggled
        const newChecked = await checkbox.getAttribute('aria-checked');
        expect(newChecked).not.toBe(initialChecked);
      });

      test('Space selects radio and menu stays open', async ({ page }) => {
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        // Get the name of the first unchecked radio to use as stable locator
        const uncheckedRadio = page.getByRole('menuitemradio', { checked: false }).first();
        const radioName = await uncheckedRadio.textContent();
        await uncheckedRadio.focus();
        await page.keyboard.press('Space');

        // Menu should still be open
        await expect(viewItem).toHaveAttribute('aria-expanded', 'true');

        // Radio should now be checked - use stable locator by name
        const targetRadio = page.getByRole('menuitemradio', { name: radioName! });
        await expect(targetRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('only one radio in group can be checked', async ({ page }) => {
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        const radios = page.getByRole('menuitemradio');
        const firstRadio = radios.first();
        const secondRadio = radios.nth(1);

        // Click second radio
        await secondRadio.click();

        // First should be unchecked, second should be checked
        await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
        await expect(firstRadio).toHaveAttribute('aria-checked', 'false');
      });

      test('Enter toggles checkbox and menu stays open', async ({ page }) => {
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        const checkbox = page.getByRole('menuitemcheckbox').first();
        const initialChecked = await checkbox.getAttribute('aria-checked');
        await checkbox.focus();
        await page.keyboard.press('Enter');

        // Menu should still be open
        await expect(viewItem).toHaveAttribute('aria-expanded', 'true');

        // aria-checked should have toggled
        const newChecked = await checkbox.getAttribute('aria-checked');
        expect(newChecked).not.toBe(initialChecked);
      });

      test('Enter selects radio and menu stays open', async ({ page }) => {
        const viewItem = page.getByRole('menuitem', { name: 'View' });
        await viewItem.click();

        // Get the name of the first unchecked radio to use as stable locator
        const uncheckedRadio = page.getByRole('menuitemradio', { checked: false }).first();
        const radioName = await uncheckedRadio.textContent();
        await uncheckedRadio.focus();
        await page.keyboard.press('Enter');

        // Menu should still be open
        await expect(viewItem).toHaveAttribute('aria-expanded', 'true');

        // Radio should now be checked - use stable locator by name
        const targetRadio = page.getByRole('menuitemradio', { name: radioName! });
        await expect(targetRadio).toHaveAttribute('aria-checked', 'true');
      });
    });

    test.describe('Focus Management', () => {
      test('first menubar item has tabIndex="0"', async ({ page }) => {
        const menubar = page.getByRole('menubar');
        const items = menubar.getByRole('menuitem');
        const firstItem = items.first();

        await expect(firstItem).toHaveAttribute('tabindex', '0');
      });

      test('other menubar items have tabIndex="-1"', async ({ page }) => {
        const menubar = page.getByRole('menubar');
        const items = menubar.getByRole('menuitem');
        const count = await items.count();

        for (let i = 1; i < count; i++) {
          await expect(items.nth(i)).toHaveAttribute('tabindex', '-1');
        }
      });

      test('separator is not focusable', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const separator = page.getByRole('separator').first();
        const tabindex = await separator.getAttribute('tabindex');

        // Separator should not have tabindex or have tabindex="-1"
        expect(tabindex === null || tabindex === '-1').toBe(true);
      });

      test('disabled items are focusable but not activatable', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const disabledItem = page.locator('[aria-disabled="true"]').first();
        if ((await disabledItem.count()) > 0) {
          await disabledItem.focus();
          await expect(disabledItem).toBeFocused();

          // Pressing Enter should not close menu
          await page.keyboard.press('Enter');
          await expect(fileItem).toHaveAttribute('aria-expanded', 'true');
        }
      });
    });

    test.describe('Pointer Interaction', () => {
      test('click on menubar item opens menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');
        const menu = page.getByRole('menu');
        await expect(menu).toBeVisible();
      });

      test('click on menubar item again closes menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();
        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

        await fileItem.click();
        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      });

      test('hover on another menubar item switches menu when open', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        const editItem = page.getByRole('menuitem', { name: 'Edit' });

        await fileItem.click();
        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

        await editItem.hover();

        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
        await expect(editItem).toHaveAttribute('aria-expanded', 'true');
      });

      test('click outside closes menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();
        await expect(fileItem).toHaveAttribute('aria-expanded', 'true');

        // Click outside the menubar
        await page.locator('body').click({ position: { x: 10, y: 10 } });

        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      });

      test('click on menuitem activates and closes menu', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const newItem = menu.getByRole('menuitem', { name: 'New' });
        await newItem.click();

        await expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      });
    });

    test.describe('Type-Ahead', () => {
      test('character focuses matching item', async ({ page }) => {
        const fileItem = page.getByRole('menuitem', { name: 'File' });
        await fileItem.click();

        const menu = page.getByRole('menu');
        const firstItem = menu.getByRole('menuitem').first();
        await firstItem.focus();

        // Type 's' to find 'Save'
        await page.keyboard.type('s');

        // Use exact match to avoid matching both "Save" and "Save As..."
        const saveItem = menu.getByRole('menuitem', { name: 'Save', exact: true });
        if ((await saveItem.count()) > 0) {
          await expect(saveItem).toBeFocused();
        }
      });
    });
  });
}
