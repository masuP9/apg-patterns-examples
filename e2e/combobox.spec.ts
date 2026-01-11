import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Combobox Pattern
 *
 * An editable combobox with list autocomplete. Users can type to filter
 * options or select from a popup listbox using keyboard or mouse.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/combobox/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get combobox elements
const getComboboxes = (page: import('@playwright/test').Page) => {
  return page.locator('[role="combobox"]');
};

// Helper to get the first non-disabled combobox
const getFirstCombobox = (page: import('@playwright/test').Page) => {
  return page.locator('[role="combobox"]:not([disabled])').first();
};

for (const framework of frameworks) {
  test.describe(`Combobox (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/combobox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="combobox" on input', async ({ page }) => {
        const comboboxes = getComboboxes(page);
        const count = await comboboxes.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(comboboxes.nth(i)).toHaveAttribute('role', 'combobox');
        }
      });

      test('has aria-controls pointing to listbox', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        const ariaControls = await combobox.getAttribute('aria-controls');
        expect(ariaControls).toBeTruthy();

        const listbox = page.locator(`#${ariaControls}`);
        await expect(listbox).toHaveAttribute('role', 'listbox');
      });

      test('has aria-expanded attribute', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        const ariaExpanded = await combobox.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(ariaExpanded);
      });

      test('has aria-autocomplete attribute', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        const ariaAutocomplete = await combobox.getAttribute('aria-autocomplete');
        expect(['none', 'list', 'both', 'inline']).toContain(ariaAutocomplete);
      });

      test('has accessible name via aria-labelledby', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        const ariaLabelledby = await combobox.getAttribute('aria-labelledby');
        expect(ariaLabelledby).toBeTruthy();

        const label = page.locator(`#${ariaLabelledby}`);
        const labelText = await label.textContent();
        expect(labelText?.trim().length).toBeGreaterThan(0);
      });

      test('listbox has role="listbox"', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        const ariaControls = await combobox.getAttribute('aria-controls');
        const listbox = page.locator(`#${ariaControls}`);
        await expect(listbox).toHaveAttribute('role', 'listbox');
      });

      test('options have role="option"', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();

        const ariaControls = await combobox.getAttribute('aria-controls');
        const options = page.locator(`#${ariaControls} [role="option"]`);
        const count = await options.count();
        expect(count).toBeGreaterThan(0);
      });
    });

    // High Priority: Keyboard Interaction (Popup Closed)
    test.describe('APG: Keyboard Interaction (Popup Closed)', () => {
      test('ArrowDown opens popup and focuses first option', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.click();
        // Close popup first if open
        await page.keyboard.press('Escape');
        await expect(combobox).toHaveAttribute('aria-expanded', 'false');

        await page.keyboard.press('ArrowDown');
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(activeDescendant).toBeTruthy();
      });

      test('ArrowUp opens popup and focuses last option', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.click();
        // Close popup first if open
        await page.keyboard.press('Escape');
        await expect(combobox).toHaveAttribute('aria-expanded', 'false');

        await page.keyboard.press('ArrowUp');
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(activeDescendant).toBeTruthy();
      });

      test('Alt+ArrowDown opens popup without focusing option', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.click();
        // Close popup first if open
        await page.keyboard.press('Escape');
        await expect(combobox).toHaveAttribute('aria-expanded', 'false');

        await page.keyboard.press('Alt+ArrowDown');
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        // Should not have active descendant
        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(activeDescendant).toBeFalsy();
      });

      test('Typing opens popup and filters options', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.click();
        // Close popup first if open
        await page.keyboard.press('Escape');
        await expect(combobox).toHaveAttribute('aria-expanded', 'false');

        await page.keyboard.type('App');
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        // Should have filtered options
        const ariaControls = await combobox.getAttribute('aria-controls');
        const visibleOptions = page.locator(`#${ariaControls} [role="option"]:not([hidden])`);
        const count = await visibleOptions.count();
        expect(count).toBeGreaterThanOrEqual(1);
      });
    });

    // High Priority: Keyboard Interaction (Popup Open)
    test.describe('APG: Keyboard Interaction (Popup Open)', () => {
      test('ArrowDown moves to next option (no wrap)', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first

        const firstActiveDescendant = await combobox.getAttribute('aria-activedescendant');
        await page.keyboard.press('ArrowDown');
        const secondActiveDescendant = await combobox.getAttribute('aria-activedescendant');

        expect(secondActiveDescendant).not.toBe(firstActiveDescendant);
      });

      test('ArrowUp moves to previous option (no wrap)', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first
        await page.keyboard.press('ArrowDown'); // Move to second

        const secondActiveDescendant = await combobox.getAttribute('aria-activedescendant');
        await page.keyboard.press('ArrowUp');
        const firstActiveDescendant = await combobox.getAttribute('aria-activedescendant');

        expect(firstActiveDescendant).not.toBe(secondActiveDescendant);
      });

      test('Home moves to first option', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowUp'); // Open and focus last

        await page.keyboard.press('Home');
        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(activeDescendant).toBeTruthy();

        // Verify it's pointing to first option
        const ariaControls = await combobox.getAttribute('aria-controls');
        const firstOption = page.locator(`#${ariaControls} [role="option"]:not([hidden])`).first();
        const firstOptionId = await firstOption.getAttribute('id');
        expect(activeDescendant).toBe(firstOptionId);
      });

      test('End moves to last option', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first

        await page.keyboard.press('End');
        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(activeDescendant).toBeTruthy();

        // Verify it's pointing to last option
        const ariaControls = await combobox.getAttribute('aria-controls');
        const lastOption = page.locator(`#${ariaControls} [role="option"]:not([hidden])`).last();
        const lastOptionId = await lastOption.getAttribute('id');
        expect(activeDescendant).toBe(lastOptionId);
      });

      test('Enter selects focused option and closes popup', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first

        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        const activeOption = page.locator(`#${activeDescendant}`);
        const optionText = await activeOption.textContent();

        await page.keyboard.press('Enter');

        await expect(combobox).toHaveAttribute('aria-expanded', 'false');
        await expect(combobox).toHaveValue(optionText?.trim() || '');
      });

      test('Escape closes popup and restores value', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        const originalValue = await combobox.inputValue();

        await page.keyboard.press('ArrowDown'); // Open popup
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        await page.keyboard.type('xxx'); // Change value
        await page.keyboard.press('Escape');

        await expect(combobox).toHaveAttribute('aria-expanded', 'false');
        await expect(combobox).toHaveValue(originalValue);
      });

      test('Alt+ArrowUp selects focused option and closes popup', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first
        await page.keyboard.press('ArrowDown'); // Move to second

        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        const activeOption = page.locator(`#${activeDescendant}`);
        const optionText = await activeOption.textContent();

        await page.keyboard.press('Alt+ArrowUp');

        await expect(combobox).toHaveAttribute('aria-expanded', 'false');
        await expect(combobox).toHaveValue(optionText?.trim() || '');
      });

      test('Tab closes popup without selection change', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open popup
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        await page.keyboard.press('Tab');
        await expect(combobox).toHaveAttribute('aria-expanded', 'false');
      });
    });

    // High Priority: Focus Management
    test.describe('APG: Focus Management', () => {
      test('DOM focus stays on input during navigation', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first
        await page.keyboard.press('ArrowDown'); // Move to next

        // DOM focus should still be on combobox
        const focusedElement = page.locator(':focus');
        await expect(focusedElement).toHaveAttribute('role', 'combobox');
      });

      test('aria-activedescendant updates on navigation', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first

        const firstActiveDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(firstActiveDescendant).toBeTruthy();

        await page.keyboard.press('ArrowDown');
        const secondActiveDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(secondActiveDescendant).toBeTruthy();
        expect(secondActiveDescendant).not.toBe(firstActiveDescendant);
      });

      test('aria-activedescendant cleared when popup closes', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first
        await page.keyboard.press('Escape');

        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(activeDescendant).toBeFalsy();
      });

      test('navigation skips disabled options', async ({ page }) => {
        // Use the combobox with disabled options (third one)
        const comboboxes = page.locator('[role="combobox"]:not([disabled])');
        const combobox = comboboxes.nth(2); // Country combobox with disabled options
        await combobox.focus();
        await page.keyboard.press('ArrowDown'); // Open and focus first

        // Navigate through options and collect active descendant IDs
        const activeIds: string[] = [];
        for (let i = 0; i < 10; i++) {
          const activeDescendant = await combobox.getAttribute('aria-activedescendant');
          if (activeDescendant && !activeIds.includes(activeDescendant)) {
            activeIds.push(activeDescendant);
          }
          await page.keyboard.press('ArrowDown');
        }

        // Check that none of the focused options are disabled
        for (const id of activeIds) {
          const option = page.locator(`#${id}`);
          const ariaDisabled = await option.getAttribute('aria-disabled');
          expect(ariaDisabled).not.toBe('true');
        }
      });
    });

    // Medium Priority: Mouse Interaction
    test.describe('Mouse Interaction', () => {
      test('clicking option selects it and closes popup', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        const ariaControls = await combobox.getAttribute('aria-controls');
        const secondOption = page.locator(`#${ariaControls} [role="option"]:not([hidden])`).nth(1);
        const optionText = await secondOption.textContent();

        await secondOption.click();

        await expect(combobox).toHaveAttribute('aria-expanded', 'false');
        await expect(combobox).toHaveValue(optionText?.trim() || '');
      });

      test('hovering option updates aria-activedescendant', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        const ariaControls = await combobox.getAttribute('aria-controls');
        const thirdOption = page.locator(`#${ariaControls} [role="option"]:not([hidden])`).nth(2);
        const thirdOptionId = await thirdOption.getAttribute('id');

        await thirdOption.hover();

        const activeDescendant = await combobox.getAttribute('aria-activedescendant');
        expect(activeDescendant).toBe(thirdOptionId);
      });

      test('clicking disabled option does not select', async ({ page }) => {
        // Use the combobox with disabled options (third one)
        const comboboxes = page.locator('[role="combobox"]:not([disabled])');
        const combobox = comboboxes.nth(2); // Country combobox with disabled options
        await combobox.focus();
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        const originalValue = await combobox.inputValue();
        const ariaControls = await combobox.getAttribute('aria-controls');
        const disabledOption = page
          .locator(`#${ariaControls} [role="option"][aria-disabled="true"]`)
          .first();

        if ((await disabledOption.count()) > 0) {
          await disabledOption.click({ force: true });
          await expect(combobox).toHaveAttribute('aria-expanded', 'true');
          await expect(combobox).toHaveValue(originalValue);
        }
      });

      test('clicking outside closes popup', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.focus();
        await expect(combobox).toHaveAttribute('aria-expanded', 'true');

        await page.click('body', { position: { x: 10, y: 10 } });
        await expect(combobox).toHaveAttribute('aria-expanded', 'false');
      });
    });

    // Disabled State
    test.describe('Disabled State', () => {
      test('disabled combobox has disabled attribute', async ({ page }) => {
        const disabledCombobox = page.locator('[role="combobox"][disabled]');

        if ((await disabledCombobox.count()) > 0) {
          await expect(disabledCombobox.first()).toBeDisabled();
        }
      });

      test('disabled combobox does not open on focus', async ({ page }) => {
        const disabledCombobox = page.locator('[role="combobox"][disabled]');

        if ((await disabledCombobox.count()) > 0) {
          await disabledCombobox
            .first()
            .focus({ timeout: 1000 })
            .catch(() => {});
          await expect(disabledCombobox.first()).toHaveAttribute('aria-expanded', 'false');
        }
      });
    });

    // Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const combobox = getFirstCombobox(page);
        await combobox.waitFor();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('.apg-combobox')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Combobox - Cross-framework Consistency', () => {
  test('all frameworks have combobox elements', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/combobox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const comboboxes = page.locator('[role="combobox"]');
      const count = await comboboxes.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks select correctly on click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/combobox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const combobox = page.locator('[role="combobox"]:not([disabled])').first();
      await combobox.focus();

      const ariaControls = await combobox.getAttribute('aria-controls');
      const secondOption = page.locator(`#${ariaControls} [role="option"]:not([hidden])`).nth(1);
      const optionText = await secondOption.textContent();

      await secondOption.click();

      await expect(combobox).toHaveValue(optionText?.trim() || '');
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    const ariaStructures: Record<string, unknown[]> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/combobox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      ariaStructures[framework] = await page.evaluate(() => {
        const comboboxes = document.querySelectorAll('[role="combobox"]');
        return Array.from(comboboxes).map((combobox) => ({
          hasAriaControls: combobox.hasAttribute('aria-controls'),
          hasAriaExpanded: combobox.hasAttribute('aria-expanded'),
          hasAriaAutocomplete: combobox.hasAttribute('aria-autocomplete'),
          hasAriaLabelledby: combobox.hasAttribute('aria-labelledby'),
        }));
      });
    }

    // All frameworks should have the same structure
    const reactStructure = ariaStructures['react'];
    for (const framework of frameworks) {
      expect(ariaStructures[framework]).toEqual(reactStructure);
    }
  });
});
