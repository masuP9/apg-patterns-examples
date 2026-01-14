import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Spinbutton Pattern
 *
 * A spinbutton allows users to select a value from a discrete set or range.
 * Contains a text field displaying the current value with optional
 * increment/decrement buttons.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getBasicSpinbutton = (page: import('@playwright/test').Page) => {
  return page.getByRole('spinbutton', { name: /quantity/i });
};

const getRangeSpinbutton = (page: import('@playwright/test').Page) => {
  return page.getByRole('spinbutton', { name: /volume/i });
};

const getDisabledSpinbutton = (page: import('@playwright/test').Page) => {
  return page.getByRole('spinbutton', { name: /disabled/i });
};

const getReadOnlySpinbutton = (page: import('@playwright/test').Page) => {
  return page.getByRole('spinbutton', { name: /read-only/i });
};

const getIncrementButton = (
  page: import('@playwright/test').Page,
  spinbutton: import('@playwright/test').Locator
) => {
  // Get the parent container and find increment button
  return spinbutton
    .locator('..')
    .getByRole('button', { name: /increment|increase/i })
    .or(spinbutton.locator('..').locator('button').last());
};

const getDecrementButton = (
  page: import('@playwright/test').Page,
  spinbutton: import('@playwright/test').Locator
) => {
  // Get the parent container and find decrement button
  return spinbutton
    .locator('..')
    .getByRole('button', { name: /decrement|decrease/i })
    .or(spinbutton.locator('..').locator('button').first());
};

// Wait for hydration to complete
const waitForHydration = async (page: import('@playwright/test').Page) => {
  const spinbutton = getBasicSpinbutton(page);
  await expect(spinbutton).toHaveAttribute('aria-valuenow', /.+/);
  await page.waitForTimeout(100);
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Spinbutton (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/spinbutton/${framework}/demo/`);
      await getBasicSpinbutton(page).waitFor();

      // Wait for hydration in frameworks that need it
      if (framework === 'svelte' || framework === 'vue') {
        await waitForHydration(page);
      }
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('spinbutton has role="spinbutton"', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await expect(spinbutton).toHaveRole('spinbutton');
      });

      test('spinbutton has aria-valuenow set to current value', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
      });

      test('range spinbutton has aria-valuemin when min is defined', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await expect(spinbutton).toHaveAttribute('aria-valuemin', '0');
      });

      test('range spinbutton has aria-valuemax when max is defined', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await expect(spinbutton).toHaveAttribute('aria-valuemax', '100');
      });

      test('basic spinbutton does not have aria-valuemin when min is undefined', async ({
        page,
      }) => {
        const spinbutton = getBasicSpinbutton(page);
        // Check that aria-valuemin is either not present or not set
        const valuemin = await spinbutton.getAttribute('aria-valuemin');
        // Accept either null (not set) or empty string
        expect(valuemin === null || valuemin === '').toBe(true);
      });

      test('basic spinbutton does not have aria-valuemax when max is undefined', async ({
        page,
      }) => {
        const spinbutton = getBasicSpinbutton(page);
        const valuemax = await spinbutton.getAttribute('aria-valuemax');
        expect(valuemax === null || valuemax === '').toBe(true);
      });

      test('spinbutton has accessible name', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        // Playwright's toHaveRole with name option already checks accessible name
        await expect(spinbutton).toBeVisible();
      });

      test('range spinbutton has aria-valuetext when format is provided', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        // The format is "{value}%" so aria-valuetext should be "50%"
        await expect(spinbutton).toHaveAttribute('aria-valuetext', '50%');
      });

      test('disabled spinbutton has aria-disabled="true"', async ({ page }) => {
        const spinbutton = getDisabledSpinbutton(page);
        await expect(spinbutton).toHaveAttribute('aria-disabled', 'true');
      });

      test('read-only spinbutton has aria-readonly="true"', async ({ page }) => {
        const spinbutton = getReadOnlySpinbutton(page);
        await expect(spinbutton).toHaveAttribute('aria-readonly', 'true');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('ArrowUp increases value by step', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('ArrowUp');

        await expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
      });

      test('ArrowDown decreases value by step', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('ArrowDown');

        await expect(spinbutton).toHaveAttribute('aria-valuenow', '4');
      });

      test('ArrowUp increases value by custom step (step=5)', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('ArrowUp');

        await expect(spinbutton).toHaveAttribute('aria-valuenow', '55');
      });

      test('ArrowDown decreases value by custom step (step=5)', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('ArrowDown');

        await expect(spinbutton).toHaveAttribute('aria-valuenow', '45');
      });

      test('Home sets value to min (when min is defined)', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('Home');

        await expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
      });

      test('End sets value to max (when max is defined)', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('End');

        await expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
      });

      test('Home has no effect when min is undefined', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('Home');

        // Value should remain unchanged
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
      });

      test('End has no effect when max is undefined', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('End');

        // Value should remain unchanged
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
      });

      test('PageUp increases by large step (step × 10)', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('PageUp');

        // step=5, large step=50, 50+50=100 (capped at max)
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
      });

      test('PageDown decreases by large step (step × 10)', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('PageDown');

        // step=5, large step=50, 50-50=0
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
      });

      test('value stops at max boundary', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();

        // Press End to go to max
        await page.keyboard.press('End');
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '100');

        // Try to increase - should stay at 100
        await page.keyboard.press('ArrowUp');
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
      });

      test('value stops at min boundary', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();

        // Press Home to go to min
        await page.keyboard.press('Home');
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '0');

        // Try to decrease - should stay at 0
        await page.keyboard.press('ArrowDown');
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
      });

      test('keyboard has no effect when disabled', async ({ page }) => {
        const spinbutton = getDisabledSpinbutton(page);

        // Force focus (disabled elements typically can't be focused)
        await spinbutton.evaluate((el) => el.focus());
        await page.keyboard.press('ArrowUp');

        // Value should remain unchanged
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '10');
      });

      test('keyboard has no effect when read-only', async ({ page }) => {
        const spinbutton = getReadOnlySpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('ArrowUp');

        // Value should remain unchanged
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '25');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Focus Management
    // ------------------------------------------
    test.describe('APG: Focus Management', () => {
      test('spinbutton is focusable', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();

        await expect(spinbutton).toBeFocused();
      });

      test('spinbutton has tabindex="0" when enabled', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await expect(spinbutton).toHaveAttribute('tabindex', '0');
      });

      test('spinbutton has tabindex="-1" when disabled', async ({ page }) => {
        const spinbutton = getDisabledSpinbutton(page);
        // Either tabindex="-1" or not in tab order
        const tabindex = await spinbutton.getAttribute('tabindex');
        expect(tabindex === '-1' || tabindex === null).toBe(true);
      });

      test('increment button has tabindex="-1"', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        const incrementBtn = getIncrementButton(page, spinbutton);

        if ((await incrementBtn.count()) > 0) {
          await expect(incrementBtn.first()).toHaveAttribute('tabindex', '-1');
        }
      });

      test('decrement button has tabindex="-1"', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        const decrementBtn = getDecrementButton(page, spinbutton);

        if ((await decrementBtn.count()) > 0) {
          await expect(decrementBtn.first()).toHaveAttribute('tabindex', '-1');
        }
      });

      test('focus stays on spinbutton after increment button click', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();
        await expect(spinbutton).toBeFocused();

        const incrementBtn = getIncrementButton(page, spinbutton);
        if ((await incrementBtn.count()) > 0) {
          await incrementBtn.first().click();
          // Focus should remain on spinbutton, not move to button
          await expect(spinbutton).toBeFocused();
        }
      });

      test('focus stays on spinbutton after decrement button click', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();
        await expect(spinbutton).toBeFocused();

        const decrementBtn = getDecrementButton(page, spinbutton);
        if ((await decrementBtn.count()) > 0) {
          await decrementBtn.first().click();
          // Focus should remain on spinbutton, not move to button
          await expect(spinbutton).toBeFocused();
        }
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Button Interaction
    // ------------------------------------------
    test.describe('Button Interaction', () => {
      test('increment button increases value', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        const incrementBtn = getIncrementButton(page, spinbutton);

        if ((await incrementBtn.count()) > 0) {
          await incrementBtn.first().click();
          await expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
        }
      });

      test('decrement button decreases value', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        const decrementBtn = getDecrementButton(page, spinbutton);

        if ((await decrementBtn.count()) > 0) {
          await decrementBtn.first().click();
          await expect(spinbutton).toHaveAttribute('aria-valuenow', '4');
        }
      });

      test('increment button respects max boundary', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();

        // Go to max first
        await page.keyboard.press('End');
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '100');

        const incrementBtn = getIncrementButton(page, spinbutton);
        if ((await incrementBtn.count()) > 0) {
          await incrementBtn.first().click();
          // Should stay at max
          await expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
        }
      });

      test('decrement button respects min boundary', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();

        // Go to min first
        await page.keyboard.press('Home');
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '0');

        const decrementBtn = getDecrementButton(page, spinbutton);
        if ((await decrementBtn.count()) > 0) {
          await decrementBtn.first().click();
          // Should stay at min
          await expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
        }
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Text Input
    // ------------------------------------------
    test.describe('Text Input', () => {
      test('accepts direct text input', async ({ page }) => {
        const spinbutton = getBasicSpinbutton(page);
        await spinbutton.click();

        // Clear and type new value
        await spinbutton.fill('10');
        await spinbutton.blur();

        await expect(spinbutton).toHaveAttribute('aria-valuenow', '10');
      });

      test('clamps value to range on valid input', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();

        // Type value exceeding max
        await spinbutton.fill('200');
        await spinbutton.blur();

        // Should be clamped to max (100)
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
      });

      test('clamps value to min on valid input', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();

        // Type value below min
        await spinbutton.fill('-50');
        await spinbutton.blur();

        // Should be clamped to min (0)
        await expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Value Text Updates
    // ------------------------------------------
    test.describe('Value Text Updates', () => {
      test('aria-valuetext updates when value changes', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('ArrowUp');

        // Value should be 55, so aria-valuetext should be "55%"
        await expect(spinbutton).toHaveAttribute('aria-valuetext', '55%');
      });

      test('aria-valuetext updates when value decreases', async ({ page }) => {
        const spinbutton = getRangeSpinbutton(page);
        await spinbutton.click();
        await page.keyboard.press('ArrowDown');

        // Value should be 45, so aria-valuetext should be "45%"
        await expect(spinbutton).toHaveAttribute('aria-valuetext', '45%');
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations (basic)', async ({ page }) => {
        const results = await new AxeBuilder({ page })
          .include('.apg-spinbutton-demo')
          .disableRules(['color-contrast'])
          .analyze();

        expect(results.violations).toEqual([]);
      });

      test('has no axe-core violations (disabled)', async ({ page }) => {
        const results = await new AxeBuilder({ page })
          .include('.apg-spinbutton-demo:has([aria-disabled="true"])')
          .disableRules(['color-contrast'])
          .analyze();

        expect(results.violations).toEqual([]);
      });

      test('has no axe-core violations (read-only)', async ({ page }) => {
        const results = await new AxeBuilder({ page })
          .include('.apg-spinbutton-demo:has([aria-readonly="true"])')
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

test.describe('Spinbutton - Cross-framework Consistency', () => {
  test('all frameworks have spinbutton with correct role', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/spinbutton/${framework}/demo/`);
      await getBasicSpinbutton(page).waitFor();

      const spinbutton = getBasicSpinbutton(page);
      await expect(spinbutton).toHaveRole('spinbutton');
    }
  });

  test('all frameworks have aria-valuenow set', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/spinbutton/${framework}/demo/`);
      await getBasicSpinbutton(page).waitFor();

      const spinbutton = getBasicSpinbutton(page);
      await expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
    }
  });

  test('all frameworks support ArrowUp keyboard interaction', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/spinbutton/${framework}/demo/`);
      await getBasicSpinbutton(page).waitFor();

      // Wait for hydration
      if (framework === 'svelte' || framework === 'vue') {
        await waitForHydration(page);
      }

      const spinbutton = getBasicSpinbutton(page);
      await spinbutton.click();
      await page.keyboard.press('ArrowUp');

      await expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
    }
  });

  test('all frameworks support ArrowDown keyboard interaction', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/spinbutton/${framework}/demo/`);
      await getBasicSpinbutton(page).waitFor();

      // Wait for hydration
      if (framework === 'svelte' || framework === 'vue') {
        await waitForHydration(page);
      }

      const spinbutton = getBasicSpinbutton(page);
      await spinbutton.click();
      await page.keyboard.press('ArrowDown');

      await expect(spinbutton).toHaveAttribute('aria-valuenow', '4');
    }
  });

  test('all frameworks have consistent disabled state', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/spinbutton/${framework}/demo/`);
      await getDisabledSpinbutton(page).waitFor();

      const spinbutton = getDisabledSpinbutton(page);
      await expect(spinbutton).toHaveAttribute('aria-disabled', 'true');
    }
  });

  test('all frameworks have consistent read-only state', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/spinbutton/${framework}/demo/`);
      await getReadOnlySpinbutton(page).waitFor();

      const spinbutton = getReadOnlySpinbutton(page);
      await expect(spinbutton).toHaveAttribute('aria-readonly', 'true');
    }
  });
});
