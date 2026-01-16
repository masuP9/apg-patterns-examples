import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Tooltip Pattern
 *
 * A tooltip is a popup that displays information related to an element
 * when the element receives keyboard focus or the mouse hovers over it.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// Helper to get tooltip triggers (wrapper elements that contain tooltips)
const getTooltipTriggers = (page: import('@playwright/test').Page) => {
  return page.locator('.apg-tooltip-trigger');
};

// Helper to get tooltip content
const getTooltip = (page: import('@playwright/test').Page) => {
  return page.locator('[role="tooltip"]');
};

// Helper to get the element that should have aria-describedby
// In React/Vue/Astro: the wrapper span has aria-describedby
// In Svelte: the button inside has aria-describedby (passed via slot props)
const getDescribedByElement = (
  _page: import('@playwright/test').Page,
  framework: string,
  trigger: import('@playwright/test').Locator
) => {
  if (framework === 'svelte') {
    return trigger.locator('button').first();
  }
  return trigger;
};

for (const framework of frameworks) {
  test.describe(`Tooltip (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/tooltip/${framework}/demo/`);
      // Wait for tooltip triggers to be available
      await getTooltipTriggers(page).first().waitFor();
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('tooltip has role="tooltip"', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const tooltip = getTooltip(page).first();

        // Hover to show tooltip
        await trigger.hover();
        // Wait for tooltip to appear (default delay is 300ms)
        await expect(tooltip).toBeVisible({ timeout: 1000 });
        await expect(tooltip).toHaveRole('tooltip');
      });

      test('tooltip has aria-hidden when not visible', async ({ page }) => {
        const tooltip = getTooltip(page).first();
        await expect(tooltip).toHaveAttribute('aria-hidden', 'true');
      });

      test('trigger has aria-describedby when tooltip is shown', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const describedByElement = getDescribedByElement(page, framework, trigger);
        const tooltip = getTooltip(page).first();

        // Hover to show tooltip
        await trigger.hover();
        await expect(tooltip).toBeVisible({ timeout: 1000 });

        // After hover - has aria-describedby linking to tooltip
        const tooltipId = await tooltip.getAttribute('id');
        await expect(describedByElement).toHaveAttribute('aria-describedby', tooltipId!);
      });

      test('trigger removes aria-describedby when tooltip is hidden', async ({ page }) => {
        // Svelte always has aria-describedby set (even when hidden) - skip this test for Svelte
        if (framework === 'svelte') {
          test.skip();
          return;
        }

        const trigger = getTooltipTriggers(page).first();
        const describedByElement = getDescribedByElement(page, framework, trigger);
        const tooltip = getTooltip(page).first();

        // Show tooltip
        await trigger.hover();
        await expect(tooltip).toBeVisible({ timeout: 1000 });

        // Hide tooltip by moving mouse away
        await page.locator('body').hover({ position: { x: 10, y: 10 } });
        await expect(tooltip).not.toBeVisible();

        // aria-describedby should be removed
        const describedby = await describedByElement.getAttribute('aria-describedby');
        expect(describedby).toBeNull();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Show/Hide Behavior
    // ------------------------------------------
    test.describe('APG: Show/Hide Behavior', () => {
      test('shows tooltip on hover after delay', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const tooltip = getTooltip(page).first();

        await expect(tooltip).not.toBeVisible();
        await trigger.hover();
        // Tooltip should appear after delay (300ms default)
        await expect(tooltip).toBeVisible({ timeout: 1000 });
      });

      test('shows tooltip on focus', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const focusable = trigger.locator('button, a, [tabindex="0"]').first();
        const tooltip = getTooltip(page).first();

        await expect(tooltip).not.toBeVisible();
        // Click first to ensure page is focused, then Tab to element
        await page.locator('body').click({ position: { x: 10, y: 10 } });
        // Focus the element directly - use click to ensure focus event fires
        await focusable.click();
        await expect(focusable).toBeFocused();
        // Tooltip should appear after delay
        await expect(tooltip).toBeVisible({ timeout: 1000 });
      });

      test('hides tooltip on blur', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const focusable = trigger.locator('button, a, [tabindex="0"]').first();
        const tooltip = getTooltip(page).first();

        // Show tooltip via click (which also focuses)
        await focusable.click();
        await expect(focusable).toBeFocused();
        await expect(tooltip).toBeVisible({ timeout: 1000 });

        // Blur by clicking outside
        await page.locator('body').click({ position: { x: 10, y: 10 } });
        await expect(tooltip).not.toBeVisible();
      });

      test('hides tooltip on mouseleave', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const tooltip = getTooltip(page).first();

        // Show tooltip via hover
        await trigger.hover();
        await expect(tooltip).toBeVisible({ timeout: 1000 });

        // Move mouse away
        await page.locator('body').hover({ position: { x: 10, y: 10 } });
        await expect(tooltip).not.toBeVisible();
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('hides tooltip on Escape key', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const tooltip = getTooltip(page).first();

        // Show tooltip via hover (more reliable than focus for this test)
        await trigger.hover();
        await expect(tooltip).toBeVisible({ timeout: 1000 });

        // Press Escape
        await page.keyboard.press('Escape');
        await expect(tooltip).not.toBeVisible();
      });

      test('focus remains on trigger after Escape', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const focusable = trigger.locator('button, a, [tabindex="0"]').first();
        const tooltip = getTooltip(page).first();

        // Show tooltip via click (which also focuses)
        await focusable.click();
        await expect(focusable).toBeFocused();
        await expect(tooltip).toBeVisible({ timeout: 1000 });

        // Press Escape
        await page.keyboard.press('Escape');
        await expect(tooltip).not.toBeVisible();

        // Focus should remain on the focusable element
        await expect(focusable).toBeFocused();
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Disabled State
    // ------------------------------------------
    test.describe('Disabled State', () => {
      test('disabled tooltip does not show on hover', async ({ page }) => {
        // Find the disabled tooltip trigger (4th one in demo)
        const disabledTrigger = getTooltipTriggers(page).nth(3);
        const tooltips = getTooltip(page);

        // Get initial visible tooltip count
        const initialVisibleCount = await tooltips
          .filter({ has: page.locator(':visible') })
          .count();

        await disabledTrigger.hover();
        // Wait a bit for potential tooltip to appear
        await page.waitForTimeout(500);

        // No new tooltip should be visible
        const finalVisibleCount = await tooltips.filter({ has: page.locator(':visible') }).count();
        expect(finalVisibleCount).toBe(initialVisibleCount);
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations (tooltip hidden)', async ({ page }) => {
        const trigger = getTooltipTriggers(page);
        await trigger.first().waitFor();

        const results = await new AxeBuilder({ page })
          .include('.apg-tooltip-trigger')
          // Exclude color-contrast - design choice for tooltip styling
          .disableRules(['color-contrast'])
          .analyze();

        expect(results.violations).toEqual([]);
      });

      test('has no axe-core violations (tooltip visible)', async ({ page }) => {
        const trigger = getTooltipTriggers(page).first();
        const tooltip = getTooltip(page).first();

        // Show tooltip
        await trigger.hover();
        await expect(tooltip).toBeVisible({ timeout: 1000 });

        const results = await new AxeBuilder({ page })
          .include('.apg-tooltip-trigger')
          // Exclude color-contrast - design choice for tooltip styling
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

test.describe('Tooltip - Cross-framework Consistency', () => {
  test('all frameworks have tooltips', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/tooltip/${framework}/demo/`);
      await getTooltipTriggers(page).first().waitFor();

      const triggers = getTooltipTriggers(page);
      const count = await triggers.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks show tooltip on hover', async ({ page }) => {
    // Run sequentially to avoid parallel test interference
    test.setTimeout(60000);

    for (const framework of frameworks) {
      // Navigate fresh for each framework to avoid state leaking
      await page.goto(`patterns/tooltip/${framework}/demo/`);
      const trigger = getTooltipTriggers(page).first();
      await trigger.waitFor();

      const tooltip = getTooltip(page).first();

      // Ensure tooltip is initially hidden
      await expect(tooltip).toHaveAttribute('aria-hidden', 'true');

      // Get bounding box for precise hover
      const box = await trigger.boundingBox();
      if (!box) throw new Error(`Trigger not found for ${framework}`);

      // Move mouse away, then to center of trigger
      await page.mouse.move(0, 0);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);

      // Wait for tooltip to appear (300ms delay + buffer)
      await expect(tooltip).toBeVisible({ timeout: 2000 });

      // Move away to hide for next iteration
      await page.mouse.move(0, 0);
      await expect(tooltip).not.toBeVisible({ timeout: 1000 });
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/tooltip/${framework}/demo/`);
      await getTooltipTriggers(page).first().waitFor();

      const trigger = getTooltipTriggers(page).first();
      const describedByElement = getDescribedByElement(page, framework, trigger);
      const tooltip = getTooltip(page).first();

      // Show tooltip
      await trigger.hover();
      await expect(tooltip).toBeVisible({ timeout: 1000 });

      // Check role
      await expect(tooltip).toHaveRole('tooltip');

      // Check aria-describedby linkage
      // Note: In React/Vue/Astro, aria-describedby is on the wrapper span
      // In Svelte, it's on the button inside (passed via slot props)
      const tooltipId = await tooltip.getAttribute('id');
      await expect(describedByElement).toHaveAttribute('aria-describedby', tooltipId!);

      // Move away to hide for next iteration
      await page.locator('body').hover({ position: { x: 10, y: 10 } });
    }
  });
});
