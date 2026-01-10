import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Window Splitter Pattern
 *
 * These tests verify the Window Splitter component behavior in a real browser,
 * including keyboard navigation, focus management, and pointer interaction.
 *
 * Note: Tests use isolated demo pages (/patterns/window-splitter/{framework}/demo/)
 * that render only the demo component without the site layout.
 *
 * Test coverage:
 * - ARIA structure and attributes
 * - Keyboard navigation (Arrow keys, Home/End, Enter)
 * - Focus management
 * - Pointer interaction (drag)
 * - Disabled and readonly states
 * - Collapse/expand functionality
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Window Splitter (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/window-splitter/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
      // Wait for splitter to be mounted (attached is sufficient, visible requires CSS)
      await page.locator('[data-testid="horizontal-splitter"]').waitFor({ state: 'attached' });
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="separator" on splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        await expect(splitter).toHaveAttribute('role', 'separator');
      });

      test('has aria-valuenow on splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        const valuenow = await splitter.getAttribute('aria-valuenow');
        expect(valuenow).toBe('50');
      });

      test('has aria-valuemin on splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        const valuemin = await splitter.getAttribute('aria-valuemin');
        expect(valuemin).toBe('10');
      });

      test('has aria-valuemax on splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        const valuemax = await splitter.getAttribute('aria-valuemax');
        expect(valuemax).toBe('90');
      });

      test('has aria-controls referencing pane elements', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        const controls = await splitter.getAttribute('aria-controls');

        // Should reference both panes
        expect(controls).toContain('horizontal-primary');
        expect(controls).toContain('horizontal-secondary');

        // Verify referenced elements exist
        await expect(page.locator('#horizontal-primary')).toBeAttached();
        await expect(page.locator('#horizontal-secondary')).toBeAttached();
      });

      test('vertical splitter has aria-orientation="vertical"', async ({ page }) => {
        const splitter = page.locator('[data-testid="vertical-splitter"]');
        await expect(splitter).toHaveAttribute('aria-orientation', 'vertical');
      });

      test('horizontal splitter does not have aria-orientation', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        const orientation = await splitter.getAttribute('aria-orientation');
        // Should be undefined/null for horizontal (default)
        expect(orientation).toBeNull();
      });

      test('disabled splitter has aria-disabled="true"', async ({ page }) => {
        const splitter = page.locator('[data-testid="disabled-splitter"]');
        await expect(splitter).toHaveAttribute('aria-disabled', 'true');
      });

      // Note: aria-readonly is not a valid attribute for role="separator"
      // Readonly behavior is enforced via JavaScript only

      test('has aria-labelledby referencing title', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        const labelledby = await splitter.getAttribute('aria-labelledby');
        expect(labelledby).toBe('horizontal-demo-label');

        // Verify referenced element exists
        await expect(page.locator('#horizontal-demo-label')).toBeAttached();
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('ArrowRight increases position on horizontal splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');

        // Focus splitter
        await splitter.focus();
        await expect(splitter).toBeFocused();

        // Initial position
        const initialValue = await splitter.getAttribute('aria-valuenow');
        expect(initialValue).toBe('50');

        // Press ArrowRight
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(50);

        // Position should increase by step (5)
        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('55');
      });

      test('ArrowLeft decreases position on horizontal splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');

        await splitter.focus();

        // Press ArrowLeft
        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(50);

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('45');
      });

      test('ArrowUp increases position on vertical splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="vertical-splitter"]');

        await splitter.focus();

        // Press ArrowUp
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(50);

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('55');
      });

      test('ArrowDown decreases position on vertical splitter', async ({ page }) => {
        const splitter = page.locator('[data-testid="vertical-splitter"]');

        await splitter.focus();

        // Press ArrowDown
        await page.keyboard.press('ArrowDown');
        await page.waitForTimeout(50);

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('45');
      });

      test('Arrow keys are ignored for wrong orientation', async ({ page }) => {
        const horizontalSplitter = page.locator('[data-testid="horizontal-splitter"]');

        await horizontalSplitter.focus();

        // Press ArrowUp (should not affect horizontal splitter)
        await page.keyboard.press('ArrowUp');
        await page.waitForTimeout(50);

        const value = await horizontalSplitter.getAttribute('aria-valuenow');
        expect(value).toBe('50'); // Unchanged
      });

      test('Shift+Arrow moves by large step', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');

        await splitter.focus();

        // Press Shift+ArrowRight
        await page.keyboard.press('Shift+ArrowRight');
        await page.waitForTimeout(50);

        // Should move by largeStep (10)
        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('60');
      });

      test('Home key moves to minimum position', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');

        await splitter.focus();

        // Press Home
        await page.keyboard.press('Home');
        await page.waitForTimeout(50);

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('10'); // min value
      });

      test('End key moves to maximum position', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');

        await splitter.focus();

        // Press End
        await page.keyboard.press('End');
        await page.waitForTimeout(50);

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('90'); // max value
      });

      test('Enter key toggles collapse/expand', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');

        await splitter.focus();

        // Initial position
        const initialValue = await splitter.getAttribute('aria-valuenow');
        expect(initialValue).toBe('50');

        // Press Enter to collapse
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);

        const collapsedValue = await splitter.getAttribute('aria-valuenow');
        expect(collapsedValue).toBe('0');

        // Press Enter again to expand
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);

        const expandedValue = await splitter.getAttribute('aria-valuenow');
        expect(expandedValue).toBe('50'); // Restored to previous position
      });

      test('initially collapsed splitter can be expanded', async ({ page }) => {
        const splitter = page.locator('[data-testid="collapsed-splitter"]');

        await splitter.focus();

        // Should start at 0
        const initialValue = await splitter.getAttribute('aria-valuenow');
        expect(initialValue).toBe('0');

        // Press Enter to expand
        await page.keyboard.press('Enter');
        await page.waitForTimeout(50);

        // Should expand to expandedPosition (50)
        const expandedValue = await splitter.getAttribute('aria-valuenow');
        expect(expandedValue).toBe('50');
      });
    });

    // 🔴 High Priority: Disabled State
    test.describe('APG: Disabled State', () => {
      test('disabled splitter has tabindex="-1"', async ({ page }) => {
        const splitter = page.locator('[data-testid="disabled-splitter"]');
        await expect(splitter).toHaveAttribute('tabindex', '-1');
      });

      test('disabled splitter does not respond to keyboard', async ({ page }) => {
        const splitter = page.locator('[data-testid="disabled-splitter"]');

        // Force focus (since tabindex=-1)
        await splitter.focus({ timeout: 1000 }).catch(() => {
          // Expected to fail or not focus properly
        });

        const initialValue = await splitter.getAttribute('aria-valuenow');

        // Try to move with ArrowRight
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(50);

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe(initialValue); // Unchanged
      });
    });

    // 🔴 High Priority: Readonly State
    test.describe('APG: Readonly State', () => {
      test('readonly splitter has tabindex="0"', async ({ page }) => {
        const splitter = page.locator('[data-testid="readonly-splitter"]');
        await expect(splitter).toHaveAttribute('tabindex', '0');
      });

      test('readonly splitter can receive focus', async ({ page }) => {
        const splitter = page.locator('[data-testid="readonly-splitter"]');

        await splitter.focus();
        await expect(splitter).toBeFocused();
      });

      test('readonly splitter does not respond to keyboard', async ({ page }) => {
        const splitter = page.locator('[data-testid="readonly-splitter"]');

        await splitter.focus();

        const initialValue = await splitter.getAttribute('aria-valuenow');
        expect(initialValue).toBe('70');

        // Try to move with ArrowRight
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(50);

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe('70'); // Unchanged
      });
    });

    // 🔴 High Priority: Focus Management
    test.describe('APG: Focus Management', () => {
      test('splitter is focusable', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        await expect(splitter).toHaveAttribute('tabindex', '0');

        await splitter.focus();
        await expect(splitter).toBeFocused();
      });

      test('Tab navigates between splitters', async ({ page }) => {
        // Start from body
        await page.keyboard.press('Tab');

        // Should eventually reach a splitter
        // Tab through until we hit the first focusable splitter
        let attempts = 0;
        const maxAttempts = 20;

        while (attempts < maxAttempts) {
          const focused = await page.evaluate(() => document.activeElement?.getAttribute('role'));
          if (focused === 'separator') {
            break;
          }
          await page.keyboard.press('Tab');
          attempts++;
        }

        // Verify a splitter is focused
        const focusedRole = await page.evaluate(() => document.activeElement?.getAttribute('role'));
        expect(focusedRole).toBe('separator');
      });
    });

    // 🟡 Medium Priority: Pointer Interaction
    test.describe('Pointer Interaction', () => {
      test('pointer down on splitter starts drag and focuses', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');

        // Click on splitter
        await splitter.click();

        // Should be focused
        await expect(splitter).toBeFocused();
      });

      test('horizontal dragging changes position and pane width', async ({ page }) => {
        // Use demo container for measurement (same as component)
        const demoContainer = page.locator('[data-testid="horizontal-demo"]');
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        const primaryPane = page.locator('#horizontal-primary');

        const demoContainerBox = await demoContainer.boundingBox();
        if (!demoContainerBox) throw new Error('Demo container not found');

        const splitterBox = await splitter.boundingBox();
        if (!splitterBox) throw new Error('Splitter not found');

        // Get initial pane width
        const initialPaneBox = await primaryPane.boundingBox();
        if (!initialPaneBox) throw new Error('Primary pane not found');
        const initialPaneWidth = initialPaneBox.width;

        // Calculate coordinates
        // Initial position is 50%, target is 70% (move to the right)
        const startX = splitterBox.x + splitterBox.width / 2;
        const startY = splitterBox.y + splitterBox.height / 2;

        // Target position: 70% of demo container width from demo container left edge
        const endX = demoContainerBox.x + demoContainerBox.width * 0.7;

        // Use Playwright's mouse API for reliable cross-framework testing
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(endX, startY);
        await page.mouse.up();

        // Wait for state update
        await page.waitForTimeout(50);

        // Position should have increased (from 50% toward 70%)
        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBeGreaterThan(60);

        // Verify actual pane width changed
        const newPaneBox = await primaryPane.boundingBox();
        if (!newPaneBox) throw new Error('Primary pane not found after drag');
        expect(newPaneBox.width).toBeGreaterThan(initialPaneWidth);
      });

      test('vertical dragging changes position and pane height', async ({ page }) => {
        const demoContainer = page.locator('[data-testid="vertical-demo"]');
        const splitter = page.locator('[data-testid="vertical-splitter"]');
        const primaryPane = page.locator('#vertical-primary');

        const demoContainerBox = await demoContainer.boundingBox();
        if (!demoContainerBox) throw new Error('Vertical demo container not found');

        const splitterBox = await splitter.boundingBox();
        if (!splitterBox) throw new Error('Vertical splitter not found');

        // Get initial pane height
        const initialPaneBox = await primaryPane.boundingBox();
        if (!initialPaneBox) throw new Error('Vertical primary pane not found');
        const initialPaneHeight = initialPaneBox.height;

        // Calculate coordinates
        // Initial position is 50%, target is 70% (move down)
        const startX = splitterBox.x + splitterBox.width / 2;
        const startY = splitterBox.y + splitterBox.height / 2;

        // Target position: 70% of demo container height from demo container top edge
        const endY = demoContainerBox.y + demoContainerBox.height * 0.7;

        // Use Playwright's mouse API for reliable cross-framework testing
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX, endY);
        await page.mouse.up();

        // Wait for state update
        await page.waitForTimeout(50);

        // Position should have increased (from 50% toward 70%)
        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(Number(newValue)).toBeGreaterThan(60);

        // Verify actual pane height changed
        const newPaneBox = await primaryPane.boundingBox();
        if (!newPaneBox) throw new Error('Vertical primary pane not found after drag');
        expect(newPaneBox.height).toBeGreaterThan(initialPaneHeight);
      });

      test('disabled splitter does not respond to pointer', async ({ page }) => {
        const splitter = page.locator('[data-testid="disabled-splitter"]');

        const initialValue = await splitter.getAttribute('aria-valuenow');

        // Try to click
        await splitter.click({ force: true });

        const newValue = await splitter.getAttribute('aria-valuenow');
        expect(newValue).toBe(initialValue); // Unchanged
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const demo = page.locator('.apg-window-splitter-demo-wrapper');
        await expect(demo).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('.apg-window-splitter-demo-wrapper')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });
    });

    // 🟢 Visual State
    test.describe('Visual State', () => {
      test('CSS custom property updates with position', async ({ page }) => {
        const splitter = page.locator('[data-testid="horizontal-splitter"]');
        // Get the .apg-window-splitter container (parent of separator)
        const container = page.locator('[data-testid="horizontal-demo"] .apg-window-splitter');

        await splitter.focus();

        // Initial value - check CSS variable via computed style
        const initialValue = await container.evaluate((el) => {
          return getComputedStyle(el).getPropertyValue('--splitter-position').trim();
        });
        expect(initialValue).toBe('50%');

        // Move splitter
        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(50);

        // Style should update
        const newValue = await container.evaluate((el) => {
          return getComputedStyle(el).getPropertyValue('--splitter-position').trim();
        });
        expect(newValue).toBe('55%');
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Window Splitter - Cross-framework Consistency', () => {
  test('all frameworks have same initial ARIA attributes', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/window-splitter/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const splitter = page.locator('[data-testid="horizontal-splitter"]');

      // Check consistent ARIA attributes
      await expect(splitter).toHaveAttribute('role', 'separator');
      await expect(splitter).toHaveAttribute('aria-valuenow', '50');
      await expect(splitter).toHaveAttribute('aria-valuemin', '10');
      await expect(splitter).toHaveAttribute('aria-valuemax', '90');
      await expect(splitter).toHaveAttribute('tabindex', '0');
    }
  });

  test('all frameworks respond to ArrowRight identically', async ({ page }) => {
    const results: Record<string, string | null> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/window-splitter/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const splitter = page.locator('[data-testid="horizontal-splitter"]');
      await splitter.focus();
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(50);

      results[framework] = await splitter.getAttribute('aria-valuenow');
    }

    // All frameworks should have the same result
    const reactValue = results['react'];
    for (const framework of frameworks) {
      expect(results[framework]).toBe(reactValue);
    }
  });

  test('all frameworks respond to Enter (collapse) identically', async ({ page }) => {
    const results: Record<string, string | null> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/window-splitter/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const splitter = page.locator('[data-testid="horizontal-splitter"]');
      await splitter.focus();
      await page.keyboard.press('Enter');
      await page.waitForTimeout(50);

      results[framework] = await splitter.getAttribute('aria-valuenow');
    }

    // All frameworks should collapse to 0
    for (const framework of frameworks) {
      expect(results[framework]).toBe('0');
    }
  });
});
