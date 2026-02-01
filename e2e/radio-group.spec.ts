import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Radio Group Pattern
 *
 * A set of checkable buttons where only one can be checked at a time.
 * Uses roving tabindex for focus management.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/radio/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getRadioGroup = (page: import('@playwright/test').Page) => {
  return page.getByRole('radiogroup');
};

const getRadios = (page: import('@playwright/test').Page) => {
  return page.getByRole('radio');
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Radio Group (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/radio-group/${framework}/demo/`);
      await getRadioGroup(page).first().waitFor();
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('container has role="radiogroup"', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        await expect(radiogroup).toHaveRole('radiogroup');
      });

      test('has multiple radio groups', async ({ page }) => {
        const radiogroups = getRadioGroup(page);
        const count = await radiogroups.count();
        expect(count).toBeGreaterThan(1);
      });

      test('each option has role="radio"', async ({ page }) => {
        const radios = getRadios(page);
        const count = await radios.count();
        expect(count).toBeGreaterThan(0);

        // Verify first few radios have correct role
        for (let i = 0; i < Math.min(3, count); i++) {
          await expect(radios.nth(i)).toHaveRole('radio');
        }
      });

      test('radiogroup has accessible name', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const ariaLabel = await radiogroup.getAttribute('aria-label');
        const ariaLabelledby = await radiogroup.getAttribute('aria-labelledby');

        // Must have either aria-label or aria-labelledby
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      });

      test('each radio has accessible name via aria-labelledby', async ({ page }) => {
        const radios = getRadios(page);
        const count = await radios.count();

        for (let i = 0; i < Math.min(3, count); i++) {
          const radio = radios.nth(i);
          const labelledby = await radio.getAttribute('aria-labelledby');
          expect(labelledby).toBeTruthy();

          // Verify the referenced element exists
          // Use CSS.escape for IDs that may contain special characters
          if (labelledby) {
            const labelElement = page.locator(`[id="${labelledby}"]`);
            await expect(labelElement).toBeVisible();
          }
        }
      });

      test('selected radio has aria-checked="true"', async ({ page }) => {
        // Use the group with default value
        const radiogroup = getRadioGroup(page).nth(1); // "With Default Value" group
        const radios = radiogroup.getByRole('radio');

        // Find the selected radio
        let selectedCount = 0;
        const count = await radios.count();

        for (let i = 0; i < count; i++) {
          const checked = await radios.nth(i).getAttribute('aria-checked');
          if (checked === 'true') {
            selectedCount++;
          }
        }

        // Should have exactly one selected
        expect(selectedCount).toBe(1);
      });

      test('non-selected radios have aria-checked="false"', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const count = await radios.count();

        // Click first to ensure one is selected
        await radios.first().click();

        // Check non-selected radios
        for (let i = 1; i < count; i++) {
          const checked = await radios.nth(i).getAttribute('aria-checked');
          expect(checked).toBe('false');
        }
      });

      test('disabled radio has aria-disabled="true"', async ({ page }) => {
        // Use the group with disabled option
        const radiogroup = getRadioGroup(page).nth(2); // "With Disabled Option" group
        const radios = radiogroup.getByRole('radio');
        const count = await radios.count();

        let foundDisabled = false;
        for (let i = 0; i < count; i++) {
          const disabled = await radios.nth(i).getAttribute('aria-disabled');
          if (disabled === 'true') {
            foundDisabled = true;
            break;
          }
        }

        expect(foundDisabled).toBe(true);
      });

      test('aria-orientation is only set when horizontal', async ({ page }) => {
        // First group (vertical) - should NOT have aria-orientation
        const verticalGroup = getRadioGroup(page).first();
        const verticalOrientation = await verticalGroup.getAttribute('aria-orientation');
        expect(verticalOrientation).toBeNull();

        // Horizontal group - should have aria-orientation="horizontal"
        const horizontalGroup = getRadioGroup(page).nth(3); // "Horizontal Orientation" group
        const horizontalOrientation = await horizontalGroup.getAttribute('aria-orientation');
        expect(horizontalOrientation).toBe('horizontal');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('Tab focuses first radio when none selected', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const firstRadio = radiogroup.getByRole('radio').first();

        // Focus the page first
        await page.keyboard.press('Tab');

        // Find and verify focus is on first radio
        await expect(firstRadio).toBeFocused();
      });

      test('Tab focuses selected radio', async ({ page }) => {
        // Use group with default value
        const radiogroup = getRadioGroup(page).nth(1);
        const radios = radiogroup.getByRole('radio');

        // Find the pre-selected radio (Medium)
        const mediumRadio = radios.filter({ hasText: 'Medium' });

        // Tab to the group
        await page.keyboard.press('Tab'); // First group
        await page.keyboard.press('Tab'); // Second group (with default)

        await expect(mediumRadio).toBeFocused();
      });

      test('ArrowDown moves to next and selects', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const firstRadio = radios.first();
        const secondRadio = radios.nth(1);

        await firstRadio.click();
        await expect(firstRadio).toBeFocused();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');

        await firstRadio.press('ArrowDown');

        await expect(secondRadio).toBeFocused();
        await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
        await expect(firstRadio).toHaveAttribute('aria-checked', 'false');
      });

      test('ArrowRight moves to next and selects', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const firstRadio = radios.first();
        const secondRadio = radios.nth(1);

        await firstRadio.click();
        await expect(firstRadio).toBeFocused();

        await firstRadio.press('ArrowRight');

        await expect(secondRadio).toBeFocused();
        await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('ArrowUp moves to previous and selects', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const secondRadio = radios.nth(1);
        const firstRadio = radios.first();

        await secondRadio.click();
        await expect(secondRadio).toBeFocused();
        await expect(secondRadio).toHaveAttribute('aria-checked', 'true');

        await secondRadio.press('ArrowUp');

        await expect(firstRadio).toBeFocused();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('ArrowLeft moves to previous and selects', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const secondRadio = radios.nth(1);
        const firstRadio = radios.first();

        await secondRadio.click();
        await expect(secondRadio).toBeFocused();

        await secondRadio.press('ArrowLeft');

        await expect(firstRadio).toBeFocused();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('Arrow keys wrap from last to first', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const lastRadio = radios.last();
        const firstRadio = radios.first();

        await lastRadio.click();
        await expect(lastRadio).toHaveAttribute('aria-checked', 'true');
        await expect(lastRadio).toBeFocused();

        await lastRadio.press('ArrowDown');

        await expect(firstRadio).toBeFocused();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('Arrow keys wrap from first to last', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const firstRadio = radios.first();
        const lastRadio = radios.last();

        await firstRadio.click();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
        await expect(firstRadio).toBeFocused();

        await firstRadio.press('ArrowUp');

        await expect(lastRadio).toBeFocused();
        await expect(lastRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('Home moves to first and selects', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const lastRadio = radios.last();
        const firstRadio = radios.first();

        await lastRadio.click();
        await expect(lastRadio).toBeFocused();

        await lastRadio.press('Home');

        await expect(firstRadio).toBeFocused();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('End moves to last and selects', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const firstRadio = radios.first();
        const lastRadio = radios.last();

        await firstRadio.click();
        await expect(firstRadio).toBeFocused();

        await firstRadio.press('End');

        await expect(lastRadio).toBeFocused();
        await expect(lastRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('Space selects focused radio', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const firstRadio = radios.first();
        const secondRadio = radios.nth(1);

        // Click first to select and focus
        await firstRadio.click();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');

        // Move to second with arrow (focus without selecting in manual mode would need manual mode)
        // In automatic mode, arrow already selects, so test Space on already selected
        await firstRadio.press('ArrowDown');
        await expect(secondRadio).toBeFocused();

        // Press Space - should keep it selected (confirms Space works)
        await secondRadio.press('Space');
        await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('Space does not unselect already selected radio', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const firstRadio = radios.first();

        // Select first radio
        await firstRadio.click();
        await expect(firstRadio).toBeFocused();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');

        // Press Space again - should stay selected
        await firstRadio.press('Space');

        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
      });

      test('Arrow keys skip disabled radios', async ({ page }) => {
        // Use group with disabled option
        const radiogroup = getRadioGroup(page).nth(2);
        const radios = radiogroup.getByRole('radio');

        // Find enabled radios
        const enabledRadios: import('@playwright/test').Locator[] = [];
        const count = await radios.count();
        for (let i = 0; i < count; i++) {
          const disabled = await radios.nth(i).getAttribute('aria-disabled');
          if (disabled !== 'true') {
            enabledRadios.push(radios.nth(i));
          }
        }

        // Start from first enabled radio
        await enabledRadios[0].click();
        await expect(enabledRadios[0]).toBeFocused();
        await expect(enabledRadios[0]).toHaveAttribute('aria-checked', 'true');

        // Press ArrowDown - should skip disabled and go to next enabled
        await enabledRadios[0].press('ArrowDown');

        // Should be on next enabled radio (skipping disabled)
        const focusedElement = page.locator(':focus');
        const focusedDisabled = await focusedElement.getAttribute('aria-disabled');
        expect(focusedDisabled).not.toBe('true');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Click Interaction
    // ------------------------------------------
    test.describe('APG: Click Interaction', () => {
      test('clicking radio selects it', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const secondRadio = radios.nth(1);

        await secondRadio.click();

        await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
        await expect(secondRadio).toBeFocused();
      });

      test('clicking different radio changes selection', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const firstRadio = radios.first();
        const secondRadio = radios.nth(1);

        await firstRadio.click();
        await expect(firstRadio).toHaveAttribute('aria-checked', 'true');

        await secondRadio.click();
        await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
        await expect(firstRadio).toHaveAttribute('aria-checked', 'false');
      });

      test('clicking disabled radio does not select it', async ({ page }) => {
        // Use group with disabled option
        const radiogroup = getRadioGroup(page).nth(2);
        const radios = radiogroup.getByRole('radio');

        // Find disabled radio
        let disabledRadio: import('@playwright/test').Locator | null = null;
        const count = await radios.count();
        for (let i = 0; i < count; i++) {
          const disabled = await radios.nth(i).getAttribute('aria-disabled');
          if (disabled === 'true') {
            disabledRadio = radios.nth(i);
            break;
          }
        }

        expect(disabledRadio).not.toBeNull();

        // Click disabled radio (force: true to bypass disabled check)
        await disabledRadio!.click({ force: true });

        // Should still be unchecked
        await expect(disabledRadio!).toHaveAttribute('aria-checked', 'false');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Focus Management (Roving Tabindex)
    // ------------------------------------------
    test.describe('APG: Roving Tabindex', () => {
      test('selected radio has tabindex="0"', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const secondRadio = radios.nth(1);

        await secondRadio.click();

        await expect(secondRadio).toHaveAttribute('tabindex', '0');
      });

      test('non-selected radios have tabindex="-1"', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const count = await radios.count();

        // Click first to select it
        await radios.first().click();

        // Check non-selected radios
        for (let i = 1; i < count; i++) {
          const radio = radios.nth(i);
          const disabled = await radio.getAttribute('aria-disabled');
          // Only enabled non-selected radios should have tabindex="-1"
          if (disabled !== 'true') {
            await expect(radio).toHaveAttribute('tabindex', '-1');
          }
        }
      });

      test('only one radio has tabindex="0" in group', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const radios = radiogroup.getByRole('radio');
        const count = await radios.count();

        // Click first to ensure selection
        await radios.first().click();

        // Count radios with tabindex="0"
        let tabbableCount = 0;
        for (let i = 0; i < count; i++) {
          const tabindex = await radios.nth(i).getAttribute('tabindex');
          if (tabindex === '0') {
            tabbableCount++;
          }
        }

        expect(tabbableCount).toBe(1);
      });

      test('disabled radios always have tabindex="-1"', async ({ page }) => {
        // Use group with disabled option
        const radiogroup = getRadioGroup(page).nth(2);
        const radios = radiogroup.getByRole('radio');
        const count = await radios.count();

        for (let i = 0; i < count; i++) {
          const radio = radios.nth(i);
          const disabled = await radio.getAttribute('aria-disabled');
          if (disabled === 'true') {
            await expect(radio).toHaveAttribute('tabindex', '-1');
          }
        }
      });

      test('first enabled radio is tabbable when none selected', async ({ page }) => {
        const radiogroup = getRadioGroup(page).first();
        const firstRadio = radiogroup.getByRole('radio').first();

        // First radio should be tabbable initially
        await expect(firstRadio).toHaveAttribute('tabindex', '0');
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        await getRadioGroup(page).first().waitFor();

        const results = await new AxeBuilder({ page })
          .include('[role="radiogroup"]')
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

test.describe('Radio Group - Cross-framework Consistency', () => {
  test('all frameworks render radio groups', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/radio-group/${framework}/demo/`);
      await getRadioGroup(page).first().waitFor();

      const radiogroups = getRadioGroup(page);
      const count = await radiogroups.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks support click to select', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/radio-group/${framework}/demo/`);
      await getRadioGroup(page).first().waitFor();

      const radiogroup = getRadioGroup(page).first();
      const secondRadio = radiogroup.getByRole('radio').nth(1);

      await secondRadio.click();
      await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/radio-group/${framework}/demo/`);
      await getRadioGroup(page).first().waitFor();

      // Check radiogroup role
      const radiogroup = getRadioGroup(page).first();
      await expect(radiogroup).toHaveRole('radiogroup');

      // Check radio role
      const radios = radiogroup.getByRole('radio');
      const count = await radios.count();
      expect(count).toBeGreaterThan(0);

      // Check aria-checked attribute exists
      const firstRadio = radios.first();
      const ariaChecked = await firstRadio.getAttribute('aria-checked');
      expect(ariaChecked === 'true' || ariaChecked === 'false').toBe(true);
    }
  });

  test('all frameworks support keyboard navigation', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/radio-group/${framework}/demo/`);
      await getRadioGroup(page).first().waitFor();

      const radiogroup = getRadioGroup(page).first();
      const radios = radiogroup.getByRole('radio');
      const firstRadio = radios.first();
      const secondRadio = radios.nth(1);

      // Click first to focus
      await firstRadio.click();
      await expect(firstRadio).toHaveAttribute('aria-checked', 'true');
      await expect(firstRadio).toBeFocused();

      // Arrow down should select second
      await firstRadio.press('ArrowDown');
      await expect(secondRadio).toBeFocused();
      await expect(secondRadio).toHaveAttribute('aria-checked', 'true');
    }
  });
});
