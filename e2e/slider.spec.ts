import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Slider Pattern
 *
 * An interactive control that allows users to select a value from within a range.
 * Uses role="slider" with aria-valuenow, aria-valuemin, and aria-valuemax.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/slider/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getSlider = (page: import('@playwright/test').Page) => {
  return page.getByRole('slider');
};

const getSliderByLabel = (page: import('@playwright/test').Page, label: string) => {
  return page.getByRole('slider', { name: label });
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Slider (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/slider/${framework}/demo/`);
      await getSlider(page).first().waitFor();

      // Wait for hydration - slider should have aria-valuenow
      const firstSlider = getSlider(page).first();
      await expect
        .poll(async () => {
          const valuenow = await firstSlider.getAttribute('aria-valuenow');
          return valuenow !== null;
        })
        .toBe(true);
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('slider has role="slider"', async ({ page }) => {
        const slider = getSlider(page).first();
        await expect(slider).toHaveRole('slider');
      });

      test('slider has aria-valuenow', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        const valuenow = await slider.getAttribute('aria-valuenow');
        expect(valuenow).toBe('50');
      });

      test('slider has aria-valuemin', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        const valuemin = await slider.getAttribute('aria-valuemin');
        expect(valuemin).toBe('0');
      });

      test('slider has aria-valuemax', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        const valuemax = await slider.getAttribute('aria-valuemax');
        expect(valuemax).toBe('100');
      });

      test('slider with custom range has correct min/max', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Rating');
        await expect(slider).toHaveAttribute('aria-valuemin', '1');
        await expect(slider).toHaveAttribute('aria-valuemax', '5');
        await expect(slider).toHaveAttribute('aria-valuenow', '3');
      });

      test('slider has accessible name via label', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await expect(slider).toBeVisible();
      });

      test('slider has aria-valuetext when format is provided', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await expect(slider).toHaveAttribute('aria-valuetext', '50%');
      });

      test('rating slider has descriptive aria-valuetext', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Rating');
        await expect(slider).toHaveAttribute('aria-valuetext', '3 of 5');
      });

      test('vertical slider has aria-orientation="vertical"', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Vertical');
        await expect(slider).toHaveAttribute('aria-orientation', 'vertical');
      });

      test('disabled slider has aria-disabled="true"', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Disabled');
        await expect(slider).toHaveAttribute('aria-disabled', 'true');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('ArrowRight increases value by step', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('ArrowRight');

        const newValue = await slider.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) + 1);
      });

      test('ArrowLeft decreases value by step', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('ArrowLeft');

        const newValue = await slider.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) - 1);
      });

      test('ArrowUp increases value by step', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('ArrowUp');

        const newValue = await slider.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) + 1);
      });

      test('ArrowDown decreases value by step', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('ArrowDown');

        const newValue = await slider.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) - 1);
      });

      test('Home sets value to minimum', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        await slider.press('Home');

        await expect(slider).toHaveAttribute('aria-valuenow', '0');
      });

      test('End sets value to maximum', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        await slider.press('End');

        await expect(slider).toHaveAttribute('aria-valuenow', '100');
      });

      test('PageUp increases value by large step', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('PageUp');

        const newValue = await slider.getAttribute('aria-valuenow');
        // Large step is typically step * 10 = 10
        expect(Number(newValue)).toBe(Number(initialValue) + 10);
      });

      test('PageDown decreases value by large step', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('PageDown');

        const newValue = await slider.getAttribute('aria-valuenow');
        // Large step is typically step * 10 = 10
        expect(Number(newValue)).toBe(Number(initialValue) - 10);
      });

      test('value does not exceed maximum', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        // Set to max first
        await slider.press('End');
        await expect(slider).toHaveAttribute('aria-valuenow', '100');

        // Try to go beyond max
        await slider.press('ArrowRight');
        await expect(slider).toHaveAttribute('aria-valuenow', '100');
      });

      test('value does not go below minimum', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        // Set to min first
        await slider.press('Home');
        await expect(slider).toHaveAttribute('aria-valuenow', '0');

        // Try to go below min
        await slider.press('ArrowLeft');
        await expect(slider).toHaveAttribute('aria-valuenow', '0');
      });

      test('Rating slider respects step of 1', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Rating');
        await slider.click();
        await expect(slider).toBeFocused();

        // Initial value might change due to click position, so use Home first
        await slider.press('Home');
        await expect(slider).toHaveAttribute('aria-valuenow', '1');

        await slider.press('ArrowRight');
        await expect(slider).toHaveAttribute('aria-valuenow', '2');

        await slider.press('End');
        await expect(slider).toHaveAttribute('aria-valuenow', '5');

        // Should not exceed max
        await slider.press('ArrowRight');
        await expect(slider).toHaveAttribute('aria-valuenow', '5');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Vertical Slider Keyboard
    // ------------------------------------------
    test.describe('APG: Vertical Slider Keyboard', () => {
      test('ArrowUp increases value in vertical slider', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Vertical');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('ArrowUp');

        const newValue = await slider.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) + 1);
      });

      test('ArrowDown decreases value in vertical slider', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Vertical');
        await slider.click();
        await expect(slider).toBeFocused();

        const initialValue = await slider.getAttribute('aria-valuenow');
        await slider.press('ArrowDown');

        const newValue = await slider.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) - 1);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Focus Management
    // ------------------------------------------
    test.describe('APG: Focus Management', () => {
      test('slider is focusable', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();
      });

      test('slider has tabindex="0"', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await expect(slider).toHaveAttribute('tabindex', '0');
      });

      test('disabled slider has tabindex="-1"', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Disabled');
        await expect(slider).toHaveAttribute('tabindex', '-1');
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Disabled State
    // ------------------------------------------
    test.describe('Disabled State', () => {
      test('disabled slider does not change value on ArrowRight', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Disabled');

        // Force focus via JavaScript (click won't work on disabled)
        await slider.evaluate((el) => (el as HTMLElement).focus());

        const initialValue = await slider.getAttribute('aria-valuenow');
        await page.keyboard.press('ArrowRight');

        const newValue = await slider.getAttribute('aria-valuenow');
        expect(newValue).toBe(initialValue);
      });

      test('disabled slider does not change value on Home', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Disabled');

        // Force focus via JavaScript
        await slider.evaluate((el) => (el as HTMLElement).focus());

        await page.keyboard.press('Home');

        // Should still be 50 (default value)
        await expect(slider).toHaveAttribute('aria-valuenow', '50');
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: aria-valuetext Updates
    // ------------------------------------------
    test.describe('aria-valuetext Updates', () => {
      test('aria-valuetext updates on value change', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Volume');
        await slider.click();
        await expect(slider).toBeFocused();

        // Use Home to reset to known value
        await slider.press('Home');
        await expect(slider).toHaveAttribute('aria-valuetext', '0%');

        await slider.press('ArrowRight');
        await expect(slider).toHaveAttribute('aria-valuetext', '1%');
      });

      test('Rating slider aria-valuetext updates correctly', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Rating');
        await slider.click();
        await expect(slider).toBeFocused();

        // Use Home to reset to known value (min=1)
        await slider.press('Home');
        await expect(slider).toHaveAttribute('aria-valuetext', '1 of 5');

        await slider.press('ArrowRight');
        await expect(slider).toHaveAttribute('aria-valuetext', '2 of 5');
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const results = await new AxeBuilder({ page }).include('[role="slider"]').analyze();

        expect(results.violations).toEqual([]);
      });

      test('vertical slider has no axe-core violations', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Vertical');
        await slider.scrollIntoViewIfNeeded();

        const results = await new AxeBuilder({ page })
          .include('[aria-orientation="vertical"]')
          .analyze();

        expect(results.violations).toEqual([]);
      });

      test('disabled slider has no axe-core violations', async ({ page }) => {
        const slider = getSliderByLabel(page, 'Disabled');
        await slider.scrollIntoViewIfNeeded();

        const results = await new AxeBuilder({ page }).include('[aria-disabled="true"]').analyze();

        expect(results.violations).toEqual([]);
      });
    });
  });
}

// ============================================
// Cross-framework Consistency Tests
// ============================================

test.describe('Slider - Cross-framework Consistency', () => {
  test('all frameworks render sliders', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/slider/${framework}/demo/`);
      await getSlider(page).first().waitFor();

      const sliders = getSlider(page);
      const count = await sliders.count();
      expect(count).toBeGreaterThanOrEqual(4); // Volume, Rating, Vertical, Disabled
    }
  });

  test('all frameworks have consistent ARIA attributes', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/slider/${framework}/demo/`);
      await getSlider(page).first().waitFor();

      // Wait for hydration
      await expect
        .poll(async () => {
          const valuenow = await getSlider(page).first().getAttribute('aria-valuenow');
          return valuenow !== null;
        })
        .toBe(true);

      // Check Volume slider
      const volumeSlider = getSliderByLabel(page, 'Volume');
      await expect(volumeSlider).toHaveAttribute('aria-valuenow', '50');
      await expect(volumeSlider).toHaveAttribute('aria-valuemin', '0');
      await expect(volumeSlider).toHaveAttribute('aria-valuemax', '100');
      await expect(volumeSlider).toHaveAttribute('aria-valuetext', '50%');

      // Check Rating slider
      const ratingSlider = getSliderByLabel(page, 'Rating');
      await expect(ratingSlider).toHaveAttribute('aria-valuenow', '3');
      await expect(ratingSlider).toHaveAttribute('aria-valuemin', '1');
      await expect(ratingSlider).toHaveAttribute('aria-valuemax', '5');

      // Check Vertical slider
      const verticalSlider = getSliderByLabel(page, 'Vertical');
      await expect(verticalSlider).toHaveAttribute('aria-orientation', 'vertical');

      // Check Disabled slider
      const disabledSlider = getSliderByLabel(page, 'Disabled');
      await expect(disabledSlider).toHaveAttribute('aria-disabled', 'true');
    }
  });

  test('all frameworks support keyboard navigation', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/slider/${framework}/demo/`);
      await getSlider(page).first().waitFor();

      // Wait for hydration
      await expect
        .poll(async () => {
          const valuenow = await getSlider(page).first().getAttribute('aria-valuenow');
          return valuenow !== null;
        })
        .toBe(true);

      const slider = getSliderByLabel(page, 'Volume');
      await slider.click();
      await expect(slider).toBeFocused();

      // Test Home (to reset to known value after click)
      await slider.press('Home');
      await expect(slider).toHaveAttribute('aria-valuenow', '0');

      // Test ArrowRight
      await slider.press('ArrowRight');
      await expect(slider).toHaveAttribute('aria-valuenow', '1');

      // Test End
      await slider.press('End');
      await expect(slider).toHaveAttribute('aria-valuenow', '100');
    }
  });
});
