import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Multi-Thumb Slider Pattern
 *
 * A slider with two thumbs that allows users to select a range of values.
 * Each thumb uses role="slider" with dynamic aria-valuemin/aria-valuemax
 * based on the other thumb's position.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getBasicSliderContainer = (page: import('@playwright/test').Page) => {
  return page.getByTestId('basic-slider');
};

const getSliders = (page: import('@playwright/test').Page) => {
  return getBasicSliderContainer(page).getByRole('slider');
};

const getSliderByLabel = (page: import('@playwright/test').Page, label: string) => {
  return getBasicSliderContainer(page).getByRole('slider', { name: label });
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`MultiThumbSlider (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/slider-multithumb/${framework}/demo/`);
      await getSliders(page).first().waitFor();

      // Wait for hydration - sliders should have aria-valuenow
      const firstSlider = getSliders(page).first();
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
      test('has two slider elements', async ({ page }) => {
        const sliders = getSliders(page);
        await expect(sliders).toHaveCount(2);
      });

      test('lower thumb has role="slider"', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        await expect(lowerThumb).toHaveRole('slider');
      });

      test('upper thumb has role="slider"', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await expect(upperThumb).toHaveRole('slider');
      });

      test('lower thumb has correct initial aria-valuenow', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const valuenow = await lowerThumb.getAttribute('aria-valuenow');
        expect(valuenow).toBe('20');
      });

      test('upper thumb has correct initial aria-valuenow', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        const valuenow = await upperThumb.getAttribute('aria-valuenow');
        expect(valuenow).toBe('80');
      });

      test('lower thumb has static aria-valuemin (absolute min)', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        await expect(lowerThumb).toHaveAttribute('aria-valuemin', '0');
      });

      test('upper thumb has static aria-valuemax (absolute max)', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await expect(upperThumb).toHaveAttribute('aria-valuemax', '100');
      });

      test('lower thumb has dynamic aria-valuemax based on upper thumb', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        // Upper thumb is at 80, so lower thumb max should be 80 (or 80 - minDistance)
        const valuemax = await lowerThumb.getAttribute('aria-valuemax');
        expect(Number(valuemax)).toBeLessThanOrEqual(80);
      });

      test('upper thumb has dynamic aria-valuemin based on lower thumb', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        // Lower thumb is at 20, so upper thumb min should be 20 (or 20 + minDistance)
        const valuemin = await upperThumb.getAttribute('aria-valuemin');
        expect(Number(valuemin)).toBeGreaterThanOrEqual(20);
      });

      test('sliders are contained in group with label', async ({ page }) => {
        const group = page.getByRole('group', { name: 'Price Range' });
        await expect(group).toBeVisible();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Dynamic Bounds Update
    // ------------------------------------------
    test.describe('APG: Dynamic Bounds Update', () => {
      test('moving lower thumb updates upper thumb aria-valuemin', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');

        await lowerThumb.click();
        await page.keyboard.press('ArrowRight');

        // Lower thumb moved from 20 to 21
        await expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');

        // Upper thumb's min should have increased
        const valuemin = await upperThumb.getAttribute('aria-valuemin');
        expect(Number(valuemin)).toBeGreaterThanOrEqual(21);
      });

      test('moving upper thumb updates lower thumb aria-valuemax', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');

        await upperThumb.click();
        await page.keyboard.press('ArrowLeft');

        // Upper thumb moved from 80 to 79
        await expect(upperThumb).toHaveAttribute('aria-valuenow', '79');

        // Lower thumb's max should have decreased
        const valuemax = await lowerThumb.getAttribute('aria-valuemax');
        expect(Number(valuemax)).toBeLessThanOrEqual(79);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('ArrowRight increases lower thumb value by step', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        await lowerThumb.click();
        await expect(lowerThumb).toBeFocused();

        const initialValue = await lowerThumb.getAttribute('aria-valuenow');
        await page.keyboard.press('ArrowRight');

        const newValue = await lowerThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) + 1);
      });

      test('ArrowLeft decreases upper thumb value by step', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await upperThumb.click();

        const initialValue = await upperThumb.getAttribute('aria-valuenow');
        await page.keyboard.press('ArrowLeft');

        const newValue = await upperThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) - 1);
      });

      test('Home sets lower thumb to absolute minimum', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        await lowerThumb.click();

        await page.keyboard.press('Home');

        await expect(lowerThumb).toHaveAttribute('aria-valuenow', '0');
      });

      test('End sets lower thumb to dynamic maximum (not absolute)', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await lowerThumb.click();

        // Get upper thumb value to determine expected max
        const upperValue = await upperThumb.getAttribute('aria-valuenow');

        await page.keyboard.press('End');

        // Lower thumb should be at or near upper thumb value (respecting minDistance)
        const newValue = await lowerThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBeLessThanOrEqual(Number(upperValue));
      });

      test('Home sets upper thumb to dynamic minimum (not absolute)', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await upperThumb.click();

        // Get lower thumb value to determine expected min
        const lowerValue = await lowerThumb.getAttribute('aria-valuenow');

        await page.keyboard.press('Home');

        // Upper thumb should be at or near lower thumb value (respecting minDistance)
        const newValue = await upperThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBeGreaterThanOrEqual(Number(lowerValue));
      });

      test('End sets upper thumb to absolute maximum', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await upperThumb.click();

        await page.keyboard.press('End');

        await expect(upperThumb).toHaveAttribute('aria-valuenow', '100');
      });

      test('PageUp increases value by large step', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        await lowerThumb.click();

        const initialValue = await lowerThumb.getAttribute('aria-valuenow');
        await page.keyboard.press('PageUp');

        const newValue = await lowerThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) + 10);
      });

      test('PageDown decreases value by large step', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await upperThumb.click();

        const initialValue = await upperThumb.getAttribute('aria-valuenow');
        await page.keyboard.press('PageDown');

        const newValue = await upperThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBe(Number(initialValue) - 10);
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Collision Prevention
    // ------------------------------------------
    test.describe('APG: Collision Prevention', () => {
      test('lower thumb cannot exceed upper thumb', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await lowerThumb.click();

        // Get upper thumb's current value
        const upperValue = await upperThumb.getAttribute('aria-valuenow');

        // Try to move lower thumb to End (dynamic max)
        await page.keyboard.press('End');

        // Verify lower thumb is at or below upper thumb
        const lowerValue = await lowerThumb.getAttribute('aria-valuenow');
        expect(Number(lowerValue)).toBeLessThanOrEqual(Number(upperValue));
      });

      test('upper thumb cannot go below lower thumb', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await upperThumb.click();

        // Get lower thumb's current value
        const lowerValue = await lowerThumb.getAttribute('aria-valuenow');

        // Try to move upper thumb to Home (dynamic min)
        await page.keyboard.press('Home');

        // Verify upper thumb is at or above lower thumb
        const upperValue = await upperThumb.getAttribute('aria-valuenow');
        expect(Number(upperValue)).toBeGreaterThanOrEqual(Number(lowerValue));
      });

      test('thumbs cannot cross when rapidly pressing arrow keys', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');

        // Move lower thumb toward upper thumb
        await lowerThumb.click();
        for (let i = 0; i < 100; i++) {
          await page.keyboard.press('ArrowRight');
        }

        const lowerValue = await lowerThumb.getAttribute('aria-valuenow');
        const upperValue = await upperThumb.getAttribute('aria-valuenow');
        expect(Number(lowerValue)).toBeLessThanOrEqual(Number(upperValue));
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Focus Management
    // ------------------------------------------
    test.describe('APG: Focus Management', () => {
      test('Tab moves from lower to upper thumb', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');

        await lowerThumb.focus();
        await expect(lowerThumb).toBeFocused();

        await page.keyboard.press('Tab');
        await expect(upperThumb).toBeFocused();
      });

      test('Shift+Tab moves from upper to lower thumb', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');

        await upperThumb.focus();
        await expect(upperThumb).toBeFocused();

        await page.keyboard.press('Shift+Tab');
        await expect(lowerThumb).toBeFocused();
      });

      test('both thumbs have tabindex="0"', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const upperThumb = getSliderByLabel(page, 'Maximum Price');

        await expect(lowerThumb).toHaveAttribute('tabindex', '0');
        await expect(upperThumb).toHaveAttribute('tabindex', '0');
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: aria-valuetext Updates
    // ------------------------------------------
    test.describe('aria-valuetext Updates', () => {
      test('lower thumb aria-valuetext updates on value change', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        await lowerThumb.click();

        await page.keyboard.press('Home');
        await expect(lowerThumb).toHaveAttribute('aria-valuetext', '$0');

        await page.keyboard.press('ArrowRight');
        await expect(lowerThumb).toHaveAttribute('aria-valuetext', '$1');
      });

      test('upper thumb aria-valuetext updates on value change', async ({ page }) => {
        const upperThumb = getSliderByLabel(page, 'Maximum Price');
        await upperThumb.click();

        await page.keyboard.press('End');
        await expect(upperThumb).toHaveAttribute('aria-valuetext', '$100');

        await page.keyboard.press('ArrowLeft');
        await expect(upperThumb).toHaveAttribute('aria-valuetext', '$99');
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const results = await new AxeBuilder({ page }).include('[role="group"]').analyze();

        expect(results.violations).toEqual([]);
      });

      test('both sliders pass axe-core', async ({ page }) => {
        const results = await new AxeBuilder({ page }).include('[role="slider"]').analyze();

        expect(results.violations).toEqual([]);
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Pointer Interactions
    // ------------------------------------------
    test.describe('Pointer Interactions', () => {
      test('track click moves nearest thumb', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const track = page.locator('[data-testid="basic-slider"] .apg-slider-multithumb-track');

        // Click near the start of the track (should move lower thumb)
        const trackBox = await track.boundingBox();
        if (trackBox) {
          await page.mouse.click(trackBox.x + 10, trackBox.y + trackBox.height / 2);
        }

        // Lower thumb should have moved toward the click position
        const newValue = await lowerThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBeLessThan(20); // Was 20, should be lower
      });

      test('thumb can be dragged', async ({ page }) => {
        const lowerThumb = getSliderByLabel(page, 'Minimum Price');
        const thumbBox = await lowerThumb.boundingBox();

        if (thumbBox) {
          // Drag thumb to the right
          await page.mouse.move(thumbBox.x + thumbBox.width / 2, thumbBox.y + thumbBox.height / 2);
          await page.mouse.down();
          await page.mouse.move(thumbBox.x + 100, thumbBox.y + thumbBox.height / 2);
          await page.mouse.up();
        }

        // Value should have increased
        const newValue = await lowerThumb.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBeGreaterThan(20); // Was 20
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Disabled State
    // ------------------------------------------
    test.describe('Disabled State', () => {
      test('disabled slider thumbs have tabindex="-1"', async ({ page }) => {
        const disabledSliders = page.locator('[data-testid="disabled-slider"]').getByRole('slider');

        await expect(disabledSliders.first()).toHaveAttribute('tabindex', '-1');
        await expect(disabledSliders.last()).toHaveAttribute('tabindex', '-1');
      });

      test('disabled slider thumbs have aria-disabled="true"', async ({ page }) => {
        const disabledSliders = page.locator('[data-testid="disabled-slider"]').getByRole('slider');

        await expect(disabledSliders.first()).toHaveAttribute('aria-disabled', 'true');
        await expect(disabledSliders.last()).toHaveAttribute('aria-disabled', 'true');
      });

      test('disabled slider ignores keyboard input', async ({ page }) => {
        const disabledThumb = page
          .locator('[data-testid="disabled-slider"]')
          .getByRole('slider')
          .first();

        const initialValue = await disabledThumb.getAttribute('aria-valuenow');

        // Try to click and press arrow key (disabled elements can still receive focus via click)
        await disabledThumb.click({ force: true });
        await page.keyboard.press('ArrowRight');

        // Value should not change
        await expect(disabledThumb).toHaveAttribute('aria-valuenow', initialValue!);
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Vertical Orientation
    // ------------------------------------------
    test.describe('Vertical Orientation', () => {
      test('vertical slider has aria-orientation="vertical"', async ({ page }) => {
        const verticalSliders = page.locator('[data-testid="vertical-slider"]').getByRole('slider');

        await expect(verticalSliders.first()).toHaveAttribute('aria-orientation', 'vertical');
        await expect(verticalSliders.last()).toHaveAttribute('aria-orientation', 'vertical');
      });

      test('vertical slider responds to ArrowUp/Down', async ({ page }) => {
        const verticalThumb = page
          .locator('[data-testid="vertical-slider"]')
          .getByRole('slider')
          .first();

        await verticalThumb.click();
        const initialValue = await verticalThumb.getAttribute('aria-valuenow');

        await page.keyboard.press('ArrowUp');
        const afterUp = await verticalThumb.getAttribute('aria-valuenow');
        expect(Number(afterUp)).toBe(Number(initialValue) + 1);

        await page.keyboard.press('ArrowDown');
        const afterDown = await verticalThumb.getAttribute('aria-valuenow');
        expect(Number(afterDown)).toBe(Number(initialValue));
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: minDistance
    // ------------------------------------------
    test.describe('minDistance Constraint', () => {
      test('thumbs maintain minimum distance', async ({ page }) => {
        const minDistanceSliders = page
          .locator('[data-testid="min-distance-slider"]')
          .getByRole('slider');

        const lowerThumb = minDistanceSliders.first();
        const upperThumb = minDistanceSliders.last();

        // Try to move lower thumb to End
        await lowerThumb.click();
        await page.keyboard.press('End');

        const lowerValue = Number(await lowerThumb.getAttribute('aria-valuenow'));
        const upperValue = Number(await upperThumb.getAttribute('aria-valuenow'));

        // Should maintain minDistance of 10
        expect(upperValue - lowerValue).toBeGreaterThanOrEqual(10);
      });

      test('lower thumb aria-valuemax respects minDistance', async ({ page }) => {
        const minDistanceSliders = page
          .locator('[data-testid="min-distance-slider"]')
          .getByRole('slider');

        const lowerThumb = minDistanceSliders.first();
        const upperThumb = minDistanceSliders.last();

        const upperValue = Number(await upperThumb.getAttribute('aria-valuenow'));
        const lowerMax = Number(await lowerThumb.getAttribute('aria-valuemax'));

        // Lower thumb max should be upper value - minDistance
        expect(lowerMax).toBeLessThanOrEqual(upperValue - 10);
      });

      test('upper thumb aria-valuemin respects minDistance', async ({ page }) => {
        const minDistanceSliders = page
          .locator('[data-testid="min-distance-slider"]')
          .getByRole('slider');

        const lowerThumb = minDistanceSliders.first();
        const upperThumb = minDistanceSliders.last();

        const lowerValue = Number(await lowerThumb.getAttribute('aria-valuenow'));
        const upperMin = Number(await upperThumb.getAttribute('aria-valuemin'));

        // Upper thumb min should be lower value + minDistance
        expect(upperMin).toBeGreaterThanOrEqual(lowerValue + 10);
      });
    });
  });
}

// ============================================
// Cross-framework Consistency Tests
// ============================================

test.describe('MultiThumbSlider - Cross-framework Consistency', () => {
  test('all frameworks render two sliders', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/slider-multithumb/${framework}/demo/`);
      await getSliders(page).first().waitFor();

      const sliders = getSliders(page);
      const count = await sliders.count();
      expect(count).toBe(2);
    }
  });

  test('all frameworks have consistent initial values', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/slider-multithumb/${framework}/demo/`);
      await getSliders(page).first().waitFor();

      // Wait for hydration
      await expect
        .poll(async () => {
          const valuenow = await getSliders(page).first().getAttribute('aria-valuenow');
          return valuenow !== null;
        })
        .toBe(true);

      const lowerThumb = getSliderByLabel(page, 'Minimum Price');
      const upperThumb = getSliderByLabel(page, 'Maximum Price');

      await expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
      await expect(upperThumb).toHaveAttribute('aria-valuenow', '80');
    }
  });

  test('all frameworks support keyboard navigation', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/slider-multithumb/${framework}/demo/`);
      await getSliders(page).first().waitFor();

      // Wait for hydration
      await expect
        .poll(async () => {
          const valuenow = await getSliders(page).first().getAttribute('aria-valuenow');
          return valuenow !== null;
        })
        .toBe(true);

      const lowerThumb = getSliderByLabel(page, 'Minimum Price');
      await lowerThumb.click();

      // Test ArrowRight
      const initialValue = await lowerThumb.getAttribute('aria-valuenow');
      await page.keyboard.press('ArrowRight');

      const newValue = await lowerThumb.getAttribute('aria-valuenow');
      expect(Number(newValue)).toBe(Number(initialValue) + 1);
    }
  });

  test('all frameworks prevent thumb crossing', async ({ page }) => {
    test.setTimeout(60000);

    for (const framework of frameworks) {
      await page.goto(`patterns/slider-multithumb/${framework}/demo/`);
      await getSliders(page).first().waitFor();

      // Wait for hydration
      await expect
        .poll(async () => {
          const valuenow = await getSliders(page).first().getAttribute('aria-valuenow');
          return valuenow !== null;
        })
        .toBe(true);

      const lowerThumb = getSliderByLabel(page, 'Minimum Price');
      const upperThumb = getSliderByLabel(page, 'Maximum Price');

      // Try to move lower thumb beyond upper
      await lowerThumb.click();
      await page.keyboard.press('End');

      const lowerValue = Number(await lowerThumb.getAttribute('aria-valuenow'));
      const upperValue = Number(await upperThumb.getAttribute('aria-valuenow'));

      expect(lowerValue).toBeLessThanOrEqual(upperValue);
    }
  });
});
