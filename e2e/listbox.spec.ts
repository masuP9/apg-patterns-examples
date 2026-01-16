import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Listbox Pattern
 *
 * A widget that allows the user to select one or more items from a list of choices.
 * Supports single-select (selection follows focus) and multi-select modes.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/listbox/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get all listboxes
const getListboxes = (page: import('@playwright/test').Page) => {
  return page.locator('[role="listbox"]');
};

// Helper to get listbox by index (0=single-select, 1=multi-select, 2=horizontal)
const getListboxByIndex = (page: import('@playwright/test').Page, index: number) => {
  return page.locator('[role="listbox"]').nth(index);
};

// Helper to get available (non-disabled) options in a listbox
const getAvailableOptions = (listbox: import('@playwright/test').Locator) => {
  return listbox.locator('[role="option"]:not([aria-disabled="true"])');
};

// Helper to get selected options in a listbox
const getSelectedOptions = (listbox: import('@playwright/test').Locator) => {
  return listbox.locator('[role="option"][aria-selected="true"]');
};

for (const framework of frameworks) {
  test.describe(`Listbox (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/listbox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
    });

    // =========================================================================
    // High Priority: ARIA Structure
    // =========================================================================
    test.describe('APG: ARIA Structure', () => {
      test('has role="listbox" on container', async ({ page }) => {
        const listboxes = getListboxes(page);
        const count = await listboxes.count();
        expect(count).toBe(3); // single-select, multi-select, horizontal

        for (let i = 0; i < count; i++) {
          await expect(listboxes.nth(i)).toHaveAttribute('role', 'listbox');
        }
      });

      test('options have role="option"', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = listbox.locator('[role="option"]');
        const count = await options.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(options.nth(i)).toHaveAttribute('role', 'option');
        }
      });

      test('has accessible name via aria-labelledby', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const ariaLabelledby = await listbox.getAttribute('aria-labelledby');
        expect(ariaLabelledby).toBeTruthy();

        const label = page.locator(`#${ariaLabelledby}`);
        const labelText = await label.textContent();
        expect(labelText?.trim().length).toBeGreaterThan(0);
      });

      test('single-select listbox does not have aria-multiselectable', async ({ page }) => {
        const singleSelectListbox = getListboxByIndex(page, 0);
        const ariaMultiselectable = await singleSelectListbox.getAttribute('aria-multiselectable');
        expect(ariaMultiselectable).toBeFalsy();
      });

      test('multi-select listbox has aria-multiselectable="true"', async ({ page }) => {
        const multiSelectListbox = getListboxByIndex(page, 1);
        await expect(multiSelectListbox).toHaveAttribute('aria-multiselectable', 'true');
      });

      test('horizontal listbox has aria-orientation="horizontal"', async ({ page }) => {
        const horizontalListbox = getListboxByIndex(page, 2);
        await expect(horizontalListbox).toHaveAttribute('aria-orientation', 'horizontal');
      });

      test('selected options have aria-selected="true"', async ({ page }) => {
        const singleSelectListbox = getListboxByIndex(page, 0);
        const selectedOptions = getSelectedOptions(singleSelectListbox);
        const count = await selectedOptions.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(selectedOptions.nth(i)).toHaveAttribute('aria-selected', 'true');
        }
      });

      test('disabled options have aria-disabled="true"', async ({ page }) => {
        const multiSelectListbox = getListboxByIndex(page, 1);
        const disabledOptions = multiSelectListbox.locator('[role="option"][aria-disabled="true"]');
        const count = await disabledOptions.count();
        expect(count).toBeGreaterThan(0);
      });
    });

    // =========================================================================
    // High Priority: Single-Select Keyboard Navigation
    // =========================================================================
    test.describe('APG: Single-Select Keyboard Navigation', () => {
      test('ArrowDown moves focus and selection to next option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        await firstOption.focus();
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('ArrowDown');
        await expect(secondOption).toHaveAttribute('tabindex', '0');
        await expect(secondOption).toHaveAttribute('aria-selected', 'true');
        await expect(firstOption).toHaveAttribute('aria-selected', 'false');
      });

      test('ArrowUp moves focus and selection to previous option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        // Click to set initial state, then navigate down to second option
        await firstOption.click();
        await page.keyboard.press('ArrowDown');
        await expect(secondOption).toHaveAttribute('tabindex', '0');
        await expect(secondOption).toHaveAttribute('aria-selected', 'true');

        // Now navigate up
        await page.keyboard.press('ArrowUp');
        await expect(firstOption).toHaveAttribute('tabindex', '0');
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');
      });

      test('Home moves focus and selection to first option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();

        await firstOption.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        await page.keyboard.press('Home');
        await expect(firstOption).toHaveAttribute('tabindex', '0');
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');
      });

      test('End moves focus and selection to last option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const lastOption = options.last();

        await firstOption.focus();
        await page.keyboard.press('End');
        await expect(lastOption).toHaveAttribute('tabindex', '0');
        await expect(lastOption).toHaveAttribute('aria-selected', 'true');
      });

      test('focus does not wrap at boundaries', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = getAvailableOptions(listbox);
        const lastOption = options.last();

        await lastOption.focus();
        await page.keyboard.press('End'); // Ensure we're at the end

        await page.keyboard.press('ArrowDown');

        // Should still be on last option
        await expect(lastOption).toHaveAttribute('tabindex', '0');
      });

      // Note: disabled option skip test is in Multi-Select section since the multi-select
      // listbox has disabled options (Green) while single-select doesn't
    });

    // =========================================================================
    // High Priority: Multi-Select Keyboard Navigation
    // =========================================================================
    test.describe('APG: Multi-Select Keyboard Navigation', () => {
      test('ArrowDown moves focus only (no selection change)', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        await firstOption.focus();
        // Initially no selection in multi-select
        const initialSelected = await getSelectedOptions(listbox).count();

        await page.keyboard.press('ArrowDown');
        await expect(secondOption).toHaveAttribute('tabindex', '0');

        // Selection should not have changed
        const afterSelected = await getSelectedOptions(listbox).count();
        expect(afterSelected).toBe(initialSelected);
      });

      test('ArrowUp moves focus only (no selection change)', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        // Click to set initial state, then navigate down to second option
        await firstOption.click();
        await page.keyboard.press('ArrowDown');
        await expect(secondOption).toHaveAttribute('tabindex', '0');

        // Navigate up should move focus but not change selection
        await page.keyboard.press('ArrowUp');
        await expect(firstOption).toHaveAttribute('tabindex', '0');
      });

      test('Space toggles selection of focused option (select)', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const firstOption = getAvailableOptions(listbox).first();

        await firstOption.focus();
        await expect(firstOption).not.toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('Space');
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');
      });

      test('Space toggles selection of focused option (deselect)', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const firstOption = getAvailableOptions(listbox).first();

        await firstOption.focus();
        await page.keyboard.press('Space'); // Select
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('Space'); // Deselect
        await expect(firstOption).toHaveAttribute('aria-selected', 'false');
      });

      test('Shift+ArrowDown extends selection range', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        await firstOption.focus();
        await page.keyboard.press('Space'); // Select first as anchor
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('Shift+ArrowDown');
        await expect(secondOption).toHaveAttribute('aria-selected', 'true');
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');
      });

      test('Shift+ArrowUp extends selection range', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        // Click second option to set it as anchor (click toggles selection and sets anchor)
        await secondOption.click();
        await expect(secondOption).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('Shift+ArrowUp');
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');
        await expect(secondOption).toHaveAttribute('aria-selected', 'true');
      });

      test('Shift+Home selects from anchor to first option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const thirdOption = options.nth(2);

        await thirdOption.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Space'); // Select third as anchor

        await page.keyboard.press('Shift+Home');

        // All options from first to anchor should be selected
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');
      });

      test('Shift+End selects from anchor to last option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const lastOption = options.last();

        await firstOption.focus();
        await page.keyboard.press('Space'); // Select first as anchor

        await page.keyboard.press('Shift+End');

        // All options from anchor to last should be selected
        await expect(lastOption).toHaveAttribute('aria-selected', 'true');
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');
      });

      test('Ctrl+A selects all available options', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const availableOptions = getAvailableOptions(listbox);
        const firstOption = availableOptions.first();

        await firstOption.focus();
        await page.keyboard.press('Control+a');

        const count = await availableOptions.count();
        for (let i = 0; i < count; i++) {
          await expect(availableOptions.nth(i)).toHaveAttribute('aria-selected', 'true');
        }
      });

      test('disabled options are skipped during navigation', async ({ page }) => {
        // Multi-select listbox has disabled options (Green at index 3)
        const listbox = getListboxByIndex(page, 1);
        const availableOptions = getAvailableOptions(listbox);

        // Get Yellow (index 2 in available options) and Blue (index 3 after skip)
        const yellowOption = availableOptions.nth(2); // Red, Orange, Yellow
        const blueOption = availableOptions.nth(3); // Blue (Green is skipped)

        // Click to focus Yellow first (ensures proper component state)
        await yellowOption.click();
        await page.keyboard.press('ArrowDown');

        // Should skip Green and land on Blue
        await expect(blueOption).toHaveAttribute('tabindex', '0');
      });
    });

    // =========================================================================
    // High Priority: Horizontal Listbox
    // =========================================================================
    test.describe('APG: Horizontal Listbox', () => {
      test('ArrowRight moves to next option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 2);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        await firstOption.focus();
        await page.keyboard.press('ArrowRight');

        await expect(secondOption).toHaveAttribute('tabindex', '0');
        await expect(secondOption).toHaveAttribute('aria-selected', 'true');
      });

      test('ArrowLeft moves to previous option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 2);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        // Click to set initial state, then navigate right to second option
        await firstOption.click();
        await page.keyboard.press('ArrowRight');
        await expect(secondOption).toHaveAttribute('tabindex', '0');

        // Now navigate left
        await page.keyboard.press('ArrowLeft');
        await expect(firstOption).toHaveAttribute('tabindex', '0');
      });

      test('ArrowUp/ArrowDown are ignored in horizontal mode', async ({ page }) => {
        const listbox = getListboxByIndex(page, 2);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();

        await firstOption.focus();

        await page.keyboard.press('ArrowDown');
        // Should still be on first option
        await expect(firstOption).toHaveAttribute('tabindex', '0');

        await page.keyboard.press('ArrowUp');
        await expect(firstOption).toHaveAttribute('tabindex', '0');
      });

      test('Home moves to first option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 2);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();

        await firstOption.focus();
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');

        await page.keyboard.press('Home');
        await expect(firstOption).toHaveAttribute('tabindex', '0');
      });

      test('End moves to last option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 2);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const lastOption = options.last();

        await firstOption.focus();
        await page.keyboard.press('End');

        await expect(lastOption).toHaveAttribute('tabindex', '0');
      });
    });

    // =========================================================================
    // High Priority: Focus Management (Roving Tabindex)
    // =========================================================================
    test.describe('APG: Focus Management', () => {
      test('focused option has tabindex="0"', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const focusedOption = listbox.locator('[role="option"][tabindex="0"]');
        const count = await focusedOption.count();
        expect(count).toBe(1);
      });

      test('other options have tabindex="-1"', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const allOptions = listbox.locator('[role="option"]');
        const count = await allOptions.count();

        let tabindexZeroCount = 0;
        for (let i = 0; i < count; i++) {
          const tabindex = await allOptions.nth(i).getAttribute('tabindex');
          if (tabindex === '0') tabindexZeroCount++;
        }
        expect(tabindexZeroCount).toBe(1);
      });

      test('tabindex updates on navigation', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const secondOption = options.nth(1);

        await firstOption.focus();
        await expect(firstOption).toHaveAttribute('tabindex', '0');
        await expect(secondOption).toHaveAttribute('tabindex', '-1');

        await page.keyboard.press('ArrowDown');
        await expect(firstOption).toHaveAttribute('tabindex', '-1');
        await expect(secondOption).toHaveAttribute('tabindex', '0');
      });

      test('Tab exits listbox', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const firstOption = listbox.locator('[role="option"][tabindex="0"]');

        await firstOption.focus();
        await page.keyboard.press('Tab');

        // Focus should have moved out of listbox
        const focusedElement = page.locator(':focus');
        const isInListbox = await focusedElement.evaluate(
          (el, listboxEl) => listboxEl?.contains(el),
          await listbox.elementHandle()
        );
        expect(isInListbox).toBeFalsy();
      });

      test('focus returns to last focused option on re-entry', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const options = getAvailableOptions(listbox);
        const firstOption = options.first();
        const thirdOption = options.nth(2);

        await firstOption.focus();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await expect(thirdOption).toHaveAttribute('tabindex', '0');

        // Tab out and back
        await page.keyboard.press('Tab');
        await page.keyboard.press('Shift+Tab');

        // Should return to the third option
        await expect(thirdOption).toHaveAttribute('tabindex', '0');
      });
    });

    // =========================================================================
    // High Priority: Type-ahead
    // =========================================================================
    test.describe('APG: Type-ahead', () => {
      test('single character focuses matching option', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const grapeOption = listbox.locator('[role="option"]', { hasText: 'Grape' });
        const firstOption = listbox.locator('[role="option"][tabindex="0"]');

        await firstOption.focus();
        await page.keyboard.press('g');

        await expect(grapeOption).toHaveAttribute('tabindex', '0');
      });

      test('multiple characters match prefix', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const cherryOption = listbox.locator('[role="option"]', { hasText: 'Cherry' });
        const firstOption = listbox.locator('[role="option"][tabindex="0"]');

        await firstOption.focus();
        await page.keyboard.type('ch', { delay: 50 });

        await expect(cherryOption).toHaveAttribute('tabindex', '0');
      });

      test('repeated same character cycles through matches', async ({ page }) => {
        // With fruit options: Apple, Apricot, Banana, Cherry, Date, Elderberry, Fig, Grape
        // Apple and Apricot both start with 'a', so we can test cycling
        const listbox = getListboxByIndex(page, 0);
        const firstOption = listbox.locator('[role="option"][tabindex="0"]');
        await firstOption.click();

        // Use id attribute pattern (works across frameworks: id ends with -option-{id} or data-option-id)
        const appleOption = listbox.locator(
          '[role="option"][id$="-option-apple"], [role="option"][data-option-id="apple"]'
        );
        const apricotOption = listbox.locator(
          '[role="option"][id$="-option-apricot"], [role="option"][data-option-id="apricot"]'
        );

        // Press 'a' - should stay on Apple (first match)
        await page.keyboard.press('a');
        await expect(appleOption).toHaveAttribute('tabindex', '0');

        // Press 'a' again - should cycle to Apricot (next match)
        await page.keyboard.press('a');
        await expect(apricotOption).toHaveAttribute('tabindex', '0');

        // Press 'a' again - should cycle back to Apple
        await page.keyboard.press('a');
        await expect(appleOption).toHaveAttribute('tabindex', '0');
      });

      test('type-ahead buffer clears after timeout', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const firstOption = listbox.locator('[role="option"][tabindex="0"]');
        const cherryOption = listbox.locator('[role="option"]', { hasText: 'Cherry' });
        const dateOption = listbox.locator('[role="option"]', { hasText: 'Date' });

        await firstOption.focus();
        await page.keyboard.press('c'); // Focus Cherry
        await expect(cherryOption).toHaveAttribute('tabindex', '0');

        // Wait for buffer to clear (default 500ms + margin)
        await page.waitForTimeout(600);

        await page.keyboard.press('d'); // Should focus Date, not search for "cd"
        await expect(dateOption).toHaveAttribute('tabindex', '0');
      });

      test('type-ahead updates selection in single-select', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const grapeOption = listbox.locator('[role="option"]', { hasText: 'Grape' });
        const firstOption = listbox.locator('[role="option"][tabindex="0"]');

        await firstOption.focus();
        await page.keyboard.press('g');

        // In single-select, selection follows focus
        await expect(grapeOption).toHaveAttribute('aria-selected', 'true');
      });
    });

    // =========================================================================
    // Medium Priority: Mouse Interaction
    // =========================================================================
    test.describe('Mouse Interaction', () => {
      test('clicking option selects it (single-select)', async ({ page }) => {
        const listbox = getListboxByIndex(page, 0);
        const secondOption = listbox.locator('[role="option"]').nth(1);

        await secondOption.click();
        await expect(secondOption).toHaveAttribute('aria-selected', 'true');
        await expect(secondOption).toHaveAttribute('tabindex', '0');
      });

      test('clicking option toggles selection (multi-select)', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const firstOption = getAvailableOptions(listbox).first();

        // First click - select
        await firstOption.click();
        await expect(firstOption).toHaveAttribute('aria-selected', 'true');

        // Second click - deselect
        await firstOption.click();
        await expect(firstOption).toHaveAttribute('aria-selected', 'false');
      });

      test('clicking disabled option does nothing', async ({ page }) => {
        const listbox = getListboxByIndex(page, 1);
        const disabledOption = listbox.locator('[role="option"][aria-disabled="true"]').first();
        const selectedCountBefore = await getSelectedOptions(listbox).count();

        await disabledOption.click({ force: true });

        const selectedCountAfter = await getSelectedOptions(listbox).count();
        expect(selectedCountAfter).toBe(selectedCountBefore);
      });
    });

    // =========================================================================
    // Medium Priority: Accessibility
    // =========================================================================
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const results = await new AxeBuilder({ page }).include('[role="listbox"]').analyze();
        expect(results.violations).toEqual([]);
      });
    });
  });
}

// =============================================================================
// Cross-framework Consistency Tests
// =============================================================================
test.describe('Listbox - Cross-framework Consistency', () => {
  test('all frameworks have listbox elements', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/listbox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const listboxes = page.locator('[role="listbox"]');
      const count = await listboxes.count();
      expect(count).toBe(3); // single-select, multi-select, horizontal
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    const ariaStructures: Record<
      string,
      {
        hasAriaLabelledby: boolean;
        ariaMultiselectable: string | null;
        ariaOrientation: string | null;
        optionCount: number;
      }[]
    > = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/listbox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      ariaStructures[framework] = await page.evaluate(() => {
        const listboxes = document.querySelectorAll('[role="listbox"]');
        return Array.from(listboxes).map((listbox) => ({
          hasAriaLabelledby: listbox.hasAttribute('aria-labelledby'),
          ariaMultiselectable: listbox.getAttribute('aria-multiselectable'),
          ariaOrientation: listbox.getAttribute('aria-orientation'),
          optionCount: listbox.querySelectorAll('[role="option"]').length,
        }));
      });
    }

    // All frameworks should have the same structure
    const reactStructure = ariaStructures['react'];
    for (const framework of frameworks) {
      expect(ariaStructures[framework].length).toBe(reactStructure.length);
      for (let i = 0; i < reactStructure.length; i++) {
        expect(ariaStructures[framework][i].hasAriaLabelledby).toBe(
          reactStructure[i].hasAriaLabelledby
        );
        expect(ariaStructures[framework][i].ariaMultiselectable).toBe(
          reactStructure[i].ariaMultiselectable
        );
        expect(ariaStructures[framework][i].ariaOrientation).toBe(
          reactStructure[i].ariaOrientation
        );
        expect(ariaStructures[framework][i].optionCount).toBe(reactStructure[i].optionCount);
      }
    }
  });

  test('all frameworks select correctly on click', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/listbox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      // Test single-select listbox
      const singleSelectListbox = page.locator('[role="listbox"]').first();
      const secondOption = singleSelectListbox.locator('[role="option"]').nth(1);

      await secondOption.click();
      await expect(secondOption).toHaveAttribute('aria-selected', 'true');
    }
  });

  test('all frameworks handle keyboard navigation consistently', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/listbox/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const listbox = page.locator('[role="listbox"]').first();
      const options = listbox.locator('[role="option"]:not([aria-disabled="true"])');
      const firstOption = options.first();
      const secondOption = options.nth(1);

      await firstOption.focus();
      await page.keyboard.press('ArrowDown');

      // Second option should now be focused and selected
      await expect(secondOption).toHaveAttribute('tabindex', '0');
      await expect(secondOption).toHaveAttribute('aria-selected', 'true');
    }
  });
});
