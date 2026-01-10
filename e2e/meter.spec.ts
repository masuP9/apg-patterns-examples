import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Meter Pattern
 *
 * These tests verify the Meter component behavior in a real browser.
 * Meter is a display-only element (non-interactive), so tests focus on:
 * - ARIA structure and attributes
 * - Value display
 * - Accessibility (no keyboard/focus tests needed)
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/meter/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get all meters on the page
const getMeters = (page: import('@playwright/test').Page) => {
  return page.locator('[role="meter"]');
};

for (const framework of frameworks) {
  test.describe(`Meter (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/meter/${framework}/`);
      await page.waitForLoadState('networkidle');
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="meter" on container', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          await expect(meters.nth(i)).toHaveAttribute('role', 'meter');
        }
      });

      test('has aria-valuenow attribute', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();

        for (let i = 0; i < count; i++) {
          const meter = meters.nth(i);
          const valueNow = await meter.getAttribute('aria-valuenow');
          expect(valueNow).not.toBeNull();
          expect(Number(valueNow)).not.toBeNaN();
        }
      });

      test('has aria-valuemin attribute', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();

        for (let i = 0; i < count; i++) {
          const meter = meters.nth(i);
          const valueMin = await meter.getAttribute('aria-valuemin');
          expect(valueMin).not.toBeNull();
          expect(Number(valueMin)).not.toBeNaN();
        }
      });

      test('has aria-valuemax attribute', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();

        for (let i = 0; i < count; i++) {
          const meter = meters.nth(i);
          const valueMax = await meter.getAttribute('aria-valuemax');
          expect(valueMax).not.toBeNull();
          expect(Number(valueMax)).not.toBeNaN();
        }
      });

      test('aria-valuenow is within min/max range', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();

        for (let i = 0; i < count; i++) {
          const meter = meters.nth(i);
          const valueNow = Number(await meter.getAttribute('aria-valuenow'));
          const valueMin = Number(await meter.getAttribute('aria-valuemin'));
          const valueMax = Number(await meter.getAttribute('aria-valuemax'));

          expect(valueNow).toBeGreaterThanOrEqual(valueMin);
          expect(valueNow).toBeLessThanOrEqual(valueMax);
        }
      });

      test('has accessible name (aria-label or aria-labelledby)', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();

        for (let i = 0; i < count; i++) {
          const meter = meters.nth(i);
          const ariaLabel = await meter.getAttribute('aria-label');
          const ariaLabelledby = await meter.getAttribute('aria-labelledby');

          // Must have one of the two
          const hasAccessibleName = ariaLabel !== null || ariaLabelledby !== null;
          expect(hasAccessibleName).toBe(true);
        }
      });

      test('has aria-valuetext when valueText is provided', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();
        let foundValueText = false;

        for (let i = 0; i < count; i++) {
          const meter = meters.nth(i);
          const valueText = await meter.getAttribute('aria-valuetext');
          if (valueText !== null) {
            foundValueText = true;
            expect(valueText.length).toBeGreaterThan(0);
          }
        }

        // Demo page should have at least one meter with valueText
        expect(foundValueText).toBe(true);
      });
    });

    // 🔴 High Priority: Non-Interactive Behavior
    test.describe('APG: Non-Interactive Behavior', () => {
      test('is not focusable by default (no tabindex)', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();

        for (let i = 0; i < count; i++) {
          const meter = meters.nth(i);
          const tabindex = await meter.getAttribute('tabindex');
          // Should not have tabindex, or if present should be -1
          if (tabindex !== null) {
            expect(Number(tabindex)).toBe(-1);
          }
        }
      });

      test('cannot receive focus via keyboard', async ({ page }) => {
        const meters = getMeters(page);
        const count = await meters.count();

        // Tab through the page and check that no meter receives focus
        for (let i = 0; i < 10; i++) {
          await page.keyboard.press('Tab');
          const focusedRole = await page.evaluate(() => {
            return document.activeElement?.getAttribute('role');
          });
          expect(focusedRole).not.toBe('meter');
        }
      });
    });

    // 🟡 Medium Priority: Value Display
    test.describe('Value Display', () => {
      test('displays correct values for demo meters', async ({ page }) => {
        const meters = getMeters(page);

        // CPU Usage meter: value=75
        const cpuMeter = page.locator('[role="meter"][aria-label*="CPU"]');
        if ((await cpuMeter.count()) > 0) {
          await expect(cpuMeter).toHaveAttribute('aria-valuenow', '75');
        }

        // Rating meter: value=3.5, max=5
        const ratingMeter = page.locator('[role="meter"][aria-label*="Rating"]');
        if ((await ratingMeter.count()) > 0) {
          await expect(ratingMeter).toHaveAttribute('aria-valuenow', '3.5');
          await expect(ratingMeter).toHaveAttribute('aria-valuemax', '5');
        }

        // Temperature meter: value=-10, min=-50, max=50
        const tempMeter = page.locator('[role="meter"][aria-label*="Temperature"]');
        if ((await tempMeter.count()) > 0) {
          await expect(tempMeter).toHaveAttribute('aria-valuenow', '-10');
          await expect(tempMeter).toHaveAttribute('aria-valuemin', '-50');
          await expect(tempMeter).toHaveAttribute('aria-valuemax', '50');
        }
      });

      test('handles negative min/max range correctly', async ({ page }) => {
        const tempMeter = page.locator('[role="meter"][aria-label*="Temperature"]');
        if ((await tempMeter.count()) > 0) {
          const valueMin = Number(await tempMeter.getAttribute('aria-valuemin'));
          const valueMax = Number(await tempMeter.getAttribute('aria-valuemax'));
          const valueNow = Number(await tempMeter.getAttribute('aria-valuenow'));

          expect(valueMin).toBeLessThan(0);
          expect(valueMax).toBeGreaterThan(0);
          expect(valueNow).toBeGreaterThanOrEqual(valueMin);
          expect(valueNow).toBeLessThanOrEqual(valueMax);
        }
      });

      test('handles decimal values correctly', async ({ page }) => {
        const ratingMeter = page.locator('[role="meter"][aria-label*="Rating"]');
        if ((await ratingMeter.count()) > 0) {
          const valueNow = await ratingMeter.getAttribute('aria-valuenow');
          expect(valueNow).toBe('3.5');
        }
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        // Wait for meters to be fully rendered
        await page.locator('[role="meter"]').first().waitFor();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('[role="meter"]')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Meter - Cross-framework Consistency', () => {
  test('all frameworks have same meter count', async ({ page }) => {
    const meterCounts: Record<string, number> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/meter/${framework}/`);
      await page.waitForLoadState('networkidle');
      const meters = page.locator('[role="meter"]');
      meterCounts[framework] = await meters.count();
    }

    // All frameworks should have the same number of meters
    const reactCount = meterCounts['react'];
    for (const framework of frameworks) {
      expect(meterCounts[framework]).toBe(reactCount);
    }
  });

  test('all frameworks have consistent ARIA attributes', async ({ page }) => {
    const ariaStructures: Record<string, unknown[]> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/meter/${framework}/`);
      await page.waitForLoadState('networkidle');

      ariaStructures[framework] = await page.evaluate(() => {
        const meters = document.querySelectorAll('[role="meter"]');
        return Array.from(meters).map((meter) => ({
          hasAriaValuenow: meter.hasAttribute('aria-valuenow'),
          hasAriaValuemin: meter.hasAttribute('aria-valuemin'),
          hasAriaValuemax: meter.hasAttribute('aria-valuemax'),
          hasAccessibleName:
            meter.hasAttribute('aria-label') || meter.hasAttribute('aria-labelledby'),
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
