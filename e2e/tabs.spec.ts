import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Tabs Pattern
 *
 * A set of layered sections of content, known as tab panels, that display
 * one panel of content at a time.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getTabs = (page: import('@playwright/test').Page) => {
  return page.locator('.apg-tabs');
};

const getTablist = (page: import('@playwright/test').Page) => {
  return page.getByRole('tablist');
};

const getTabButtons = (page: import('@playwright/test').Page) => {
  return page.getByRole('tab');
};

const getTabPanels = (page: import('@playwright/test').Page) => {
  return page.getByRole('tabpanel');
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Tabs (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/tabs/${framework}/demo/`);
      await getTabs(page).first().waitFor();

      // Wait for hydration - tabs should have proper aria-controls
      const firstTab = getTabButtons(page).first();
      await expect
        .poll(async () => {
          const id = await firstTab.getAttribute('id');
          return id && id.length > 1 && !id.startsWith('-');
        })
        .toBe(true);

      // Ensure first tab is interactive (hydration complete)
      await expect(firstTab).toHaveAttribute('tabindex', '0');
      await expect(firstTab).toHaveAttribute('aria-selected', 'true');
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('tablist has role="tablist"', async ({ page }) => {
        const tablist = getTablist(page).first();
        await expect(tablist).toHaveRole('tablist');
      });

      test('tabs have role="tab"', async ({ page }) => {
        const tabs = getTabButtons(page);
        const firstTab = tabs.first();
        await expect(firstTab).toHaveRole('tab');
      });

      test('panels have role="tabpanel"', async ({ page }) => {
        const panel = getTabPanels(page).first();
        await expect(panel).toHaveRole('tabpanel');
      });

      test('selected tab has aria-selected="true"', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const firstTab = tabButtons.first();

        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
      });

      test('non-selected tabs have aria-selected="false"', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const secondTab = tabButtons.nth(1);

        await expect(secondTab).toHaveAttribute('aria-selected', 'false');
      });

      test('selected tab has aria-controls referencing panel', async ({ page }) => {
        const tabs = getTabs(page).first();
        const selectedTab = tabs.getByRole('tab', { selected: true });

        await expect(selectedTab).toHaveAttribute('aria-controls', /.+/);
        const controlsId = await selectedTab.getAttribute('aria-controls');
        expect(controlsId).toBeTruthy();

        const panel = page.locator(`#${controlsId}`);
        await expect(panel).toHaveRole('tabpanel');
      });

      test('panel has aria-labelledby referencing tab', async ({ page }) => {
        const tabs = getTabs(page).first();
        const selectedTab = tabs.getByRole('tab', { selected: true });
        const tabId = await selectedTab.getAttribute('id');

        const controlsId = await selectedTab.getAttribute('aria-controls');
        const panel = page.locator(`#${controlsId}`);

        await expect(panel).toHaveAttribute('aria-labelledby', tabId!);
      });

      test('tablist has aria-orientation attribute', async ({ page }) => {
        const tablist = getTablist(page).first();
        const orientation = await tablist.getAttribute('aria-orientation');

        // Should be either horizontal (default) or vertical
        expect(['horizontal', 'vertical']).toContain(orientation);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Click Interaction
    // ------------------------------------------
    test.describe('APG: Click Interaction', () => {
      test('clicking tab selects it', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const secondTab = tabButtons.nth(1);

        await expect(secondTab).toHaveAttribute('aria-selected', 'false');

        await secondTab.click();

        await expect(secondTab).toHaveAttribute('aria-selected', 'true');
      });

      test('clicking tab shows corresponding panel', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const secondTab = tabButtons.nth(1);

        await secondTab.click();

        const controlsId = await secondTab.getAttribute('aria-controls');
        const panel = page.locator(`#${controlsId}`);

        await expect(panel).not.toHaveAttribute('hidden');
      });

      test('clicking tab hides other panels', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        // Click second tab
        await secondTab.click();

        // First tab's panel should be hidden
        const firstControlsId = await firstTab.getAttribute('aria-controls');
        if (firstControlsId) {
          const firstPanel = page.locator(`#${firstControlsId}`);
          await expect(firstPanel).toHaveAttribute('hidden', '');
        }
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction (Automatic Mode)
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction (Automatic)', () => {
      test('ArrowRight moves to next tab and selects it', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        await firstTab.focus();
        await expect(firstTab).toBeFocused();

        await firstTab.press('ArrowRight');

        await expect(secondTab).toBeFocused();
        // Automatic mode: arrow key selects tab
        await expect(secondTab).toHaveAttribute('aria-selected', 'true');
      });

      test('ArrowLeft moves to previous tab and selects it', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        // Navigate to second tab using keyboard
        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('ArrowRight');
        await expect(secondTab).toBeFocused();

        // Now test ArrowLeft from second tab
        await secondTab.press('ArrowLeft');

        await expect(firstTab).toBeFocused();
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
      });

      test('Home moves to first tab', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const lastTab = tabButtons.last();

        // Navigate to last tab using keyboard
        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('End');
        await expect(lastTab).toBeFocused();

        // Now test Home from last tab
        await lastTab.press('Home');

        await expect(firstTab).toBeFocused();
      });

      test('End moves to last tab', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const lastTab = tabButtons.last();

        await firstTab.focus();
        await expect(firstTab).toBeFocused();

        await firstTab.press('End');

        await expect(lastTab).toBeFocused();
      });

      test('Arrow keys loop at boundaries', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const lastTab = tabButtons.last();

        // Navigate to last tab using keyboard
        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('End');
        await expect(lastTab).toBeFocused();

        // At last tab, ArrowRight should loop to first
        await lastTab.press('ArrowRight');
        await expect(firstTab).toBeFocused();

        // At first tab, ArrowLeft should loop to last
        await firstTab.press('ArrowLeft');
        await expect(lastTab).toBeFocused();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Manual Activation Mode
    // ------------------------------------------
    test.describe('APG: Manual Activation Mode', () => {
      test('arrow keys move focus without selecting in manual mode', async ({ page }) => {
        // Second tabs component uses manual activation
        const manualTabs = getTabs(page).nth(1);
        const tabButtons = manualTabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');

        await firstTab.press('ArrowRight');

        // Focus should move
        await expect(secondTab).toBeFocused();
        // But selection should NOT change in manual mode
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        await expect(secondTab).toHaveAttribute('aria-selected', 'false');
      });

      test('Enter activates focused tab in manual mode', async ({ page }) => {
        const manualTabs = getTabs(page).nth(1);
        const tabButtons = manualTabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('ArrowRight');
        await expect(secondTab).toBeFocused();

        // Press Enter to activate
        await secondTab.press('Enter');

        await expect(secondTab).toHaveAttribute('aria-selected', 'true');
      });

      test('Space activates focused tab in manual mode', async ({ page }) => {
        const manualTabs = getTabs(page).nth(1);
        const tabButtons = manualTabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('ArrowRight');
        await expect(secondTab).toBeFocused();

        // Press Space to activate
        await secondTab.press('Space');

        await expect(secondTab).toHaveAttribute('aria-selected', 'true');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Roving Tabindex
    // ------------------------------------------
    test.describe('APG: Roving Tabindex', () => {
      test('selected tab has tabindex="0"', async ({ page }) => {
        const tabs = getTabs(page).first();
        const selectedTab = tabs.getByRole('tab', { selected: true });

        await expect(selectedTab).toHaveAttribute('tabindex', '0');
      });

      test('non-selected tabs have tabindex="-1"', async ({ page }) => {
        const tabs = getTabs(page).first();
        const tabButtons = tabs.getByRole('tab');
        const count = await tabButtons.count();

        for (let i = 0; i < count; i++) {
          const tab = tabButtons.nth(i);
          const isSelected = (await tab.getAttribute('aria-selected')) === 'true';

          if (!isSelected) {
            await expect(tab).toHaveAttribute('tabindex', '-1');
          }
        }
      });

      test('tabpanel is focusable', async ({ page }) => {
        const tabs = getTabs(page).first();
        const panel = tabs.getByRole('tabpanel');

        // Panel should have tabindex="0"
        await expect(panel).toHaveAttribute('tabindex', '0');
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Vertical Orientation
    // ------------------------------------------
    test.describe('Vertical Orientation', () => {
      test('ArrowDown moves to next tab in vertical mode', async ({ page }) => {
        // Third tabs component uses vertical orientation
        const verticalTabs = getTabs(page).nth(2);
        const tablist = verticalTabs.getByRole('tablist');
        const tabButtons = verticalTabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        await expect(tablist).toHaveAttribute('aria-orientation', 'vertical');

        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('ArrowDown');

        await expect(secondTab).toBeFocused();
      });

      test('ArrowUp moves to previous tab in vertical mode', async ({ page }) => {
        const verticalTabs = getTabs(page).nth(2);
        const tabButtons = verticalTabs.getByRole('tab');
        const firstTab = tabButtons.first();
        const secondTab = tabButtons.nth(1);

        // Navigate to second tab using keyboard
        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('ArrowDown');
        await expect(secondTab).toBeFocused();

        // Now test ArrowUp from second tab
        await secondTab.press('ArrowUp');

        await expect(firstTab).toBeFocused();
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Disabled Tabs
    // ------------------------------------------
    test.describe('Disabled Tabs', () => {
      test('disabled tab cannot be clicked', async ({ page }) => {
        // Fourth tabs component has disabled tab
        const disabledTabs = getTabs(page).nth(3);
        const tabButtons = disabledTabs.getByRole('tab');
        const disabledTab = tabButtons.filter({ has: page.locator('[disabled]') });

        if ((await disabledTab.count()) > 0) {
          const tab = disabledTab.first();
          await tab.click({ force: true });

          // Should not be selected
          await expect(tab).toHaveAttribute('aria-selected', 'false');
        }
      });

      test('arrow key navigation skips disabled tabs', async ({ page }) => {
        const disabledTabs = getTabs(page).nth(3);
        const tabButtons = disabledTabs.getByRole('tab');
        const firstTab = tabButtons.first();

        await firstTab.focus();
        await expect(firstTab).toBeFocused();
        await firstTab.press('ArrowRight');

        // Should skip disabled tab and go to next enabled
        const focusedTab = disabledTabs.locator('[role="tab"]:focus');
        const isDisabled = await focusedTab.getAttribute('disabled');
        expect(isDisabled).toBeNull();
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const tabs = getTabs(page);
        await tabs.first().waitFor();

        const results = await new AxeBuilder({ page })
          .include('.apg-tabs')
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

test.describe('Tabs - Cross-framework Consistency', () => {
  test('all frameworks have tabs', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/tabs/${framework}/demo/`);
      await getTabs(page).first().waitFor();

      const tabs = getTabs(page);
      const count = await tabs.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks support click to select', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/tabs/${framework}/demo/`);
      await getTabs(page).first().waitFor();

      const tabs = getTabs(page).first();
      const tabButtons = tabs.getByRole('tab');
      const secondTab = tabButtons.nth(1);

      await expect(secondTab).toHaveAttribute('aria-selected', 'false');
      await secondTab.click();
      await expect(secondTab).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/tabs/${framework}/demo/`);
      await getTabs(page).first().waitFor();

      const tabs = getTabs(page).first();
      const tablist = tabs.getByRole('tablist');
      const selectedTab = tabs.getByRole('tab', { selected: true });
      const panel = tabs.getByRole('tabpanel');

      // Verify structure
      await expect(tablist).toBeAttached();
      await expect(selectedTab).toBeAttached();
      await expect(panel).toBeAttached();

      // Verify linking
      const controlsId = await selectedTab.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      await expect(panel).toHaveAttribute('id', controlsId!);
    }
  });
});
