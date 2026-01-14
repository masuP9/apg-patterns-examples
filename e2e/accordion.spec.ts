import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Accordion Pattern
 *
 * A vertically stacked set of interactive headings that each reveal
 * a section of content.
 *
 * APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

// ============================================
// Helper Functions
// ============================================

const getAccordion = (page: import('@playwright/test').Page) => {
  return page.locator('.apg-accordion');
};

const getAccordionHeaders = (page: import('@playwright/test').Page) => {
  return page.locator('.apg-accordion-trigger');
};

const getAccordionPanels = (page: import('@playwright/test').Page) => {
  return page.locator('.apg-accordion-panel');
};

// ============================================
// Framework-specific Tests
// ============================================

for (const framework of frameworks) {
  test.describe(`Accordion (${framework})`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/accordion/${framework}/demo/`);
      await getAccordion(page).first().waitFor();

      // Wait for hydration to complete - aria-controls should have a proper ID (not starting with hyphen)
      const firstHeader = getAccordionHeaders(page).first();
      await expect
        .poll(async () => {
          const id = await firstHeader.getAttribute('aria-controls');
          // ID should be non-empty and not start with hyphen (Svelte pre-hydration)
          return id && id.length > 1 && !id.startsWith('-');
        })
        .toBe(true);
    });

    // ------------------------------------------
    // 🔴 High Priority: APG ARIA Structure
    // ------------------------------------------
    test.describe('APG: ARIA Structure', () => {
      test('accordion headers have aria-expanded attribute', async ({ page }) => {
        const headers = getAccordionHeaders(page);
        const firstHeader = headers.first();

        // Should have aria-expanded (either true or false)
        const expanded = await firstHeader.getAttribute('aria-expanded');
        expect(['true', 'false']).toContain(expanded);
      });

      test('accordion headers have aria-controls referencing panel', async ({ page }) => {
        const headers = getAccordionHeaders(page);
        const firstHeader = headers.first();

        // Wait for aria-controls to be set
        await expect(firstHeader).toHaveAttribute('aria-controls', /.+/);

        const controlsId = await firstHeader.getAttribute('aria-controls');
        expect(controlsId).toBeTruthy();

        // Panel with that ID should exist
        const panel = page.locator(`[id="${controlsId}"]`);
        await expect(panel).toBeAttached();
      });

      test('panels have role="region" when 6 or fewer items', async ({ page }) => {
        const accordion = getAccordion(page).first();
        const headers = accordion.locator('.apg-accordion-trigger');
        const count = await headers.count();

        if (count <= 6) {
          const panels = accordion.locator('.apg-accordion-panel');
          const firstPanel = panels.first();
          await expect(firstPanel).toHaveRole('region');
        }
      });

      test('panels have aria-labelledby referencing header', async ({ page }) => {
        const accordion = getAccordion(page).first();
        const headers = accordion.locator('.apg-accordion-trigger');
        const count = await headers.count();

        // Only check aria-labelledby when role="region" is present (≤6 items)
        if (count <= 6) {
          const firstHeader = headers.first();

          // Wait for aria-controls to be set
          await expect(firstHeader).toHaveAttribute('aria-controls', /.+/);

          const headerId = await firstHeader.getAttribute('id');
          const controlsId = await firstHeader.getAttribute('aria-controls');
          const panel = page.locator(`[id="${controlsId}"]`);

          await expect(panel).toHaveAttribute('aria-labelledby', headerId!);
        }
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Click Interaction
    // ------------------------------------------
    test.describe('APG: Click Interaction', () => {
      test('clicking header toggles panel expansion', async ({ page }) => {
        const accordion = getAccordion(page).first();
        // Use second header which is not expanded by default
        const header = accordion.locator('.apg-accordion-trigger').nth(1);

        // Wait for component to be interactive (hydration complete)
        await expect(header).toHaveAttribute('aria-expanded', 'false');

        await header.click();

        await expect(header).toHaveAttribute('aria-expanded', 'true');
      });

      test('single expansion mode: opening one panel closes others', async ({ page }) => {
        // First accordion uses single expansion mode
        const accordion = getAccordion(page).first();
        const headers = accordion.locator('.apg-accordion-trigger');

        // Wait for hydration - first header should be expanded by default
        const firstHeader = headers.first();
        await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');

        // Click second header
        const secondHeader = headers.nth(1);
        await secondHeader.click();

        // Second should be open, first should be closed
        await expect(secondHeader).toHaveAttribute('aria-expanded', 'true');
        await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');
      });
    });

    // ------------------------------------------
    // 🔴 High Priority: Keyboard Interaction
    // ------------------------------------------
    test.describe('APG: Keyboard Interaction', () => {
      test('Enter/Space toggles panel expansion', async ({ page }) => {
        const accordion = getAccordion(page).first();
        // Use second header which is collapsed by default
        const header = accordion.locator('.apg-accordion-trigger').nth(1);

        // Wait for component to be ready
        await expect(header).toHaveAttribute('aria-expanded', 'false');

        // Click to set focus (this also opens the panel)
        await header.click();
        await expect(header).toBeFocused();
        await expect(header).toHaveAttribute('aria-expanded', 'true');

        // Press Enter to toggle (should collapse)
        await page.keyboard.press('Enter');
        await expect(header).toHaveAttribute('aria-expanded', 'false');

        // Press Space to toggle (should expand)
        await page.keyboard.press('Space');
        await expect(header).toHaveAttribute('aria-expanded', 'true');
      });

      test('ArrowDown moves focus to next header', async ({ page }) => {
        const accordion = getAccordion(page).first();
        const headers = accordion.locator('.apg-accordion-trigger');

        // Click to set focus
        await headers.first().click();
        await expect(headers.first()).toBeFocused();

        await page.keyboard.press('ArrowDown');

        await expect(headers.nth(1)).toBeFocused();
      });

      test('ArrowUp moves focus to previous header', async ({ page }) => {
        const accordion = getAccordion(page).first();
        const headers = accordion.locator('.apg-accordion-trigger');

        // Click to ensure focus is properly set
        await headers.nth(1).click();
        await expect(headers.nth(1)).toBeFocused();

        await page.keyboard.press('ArrowUp');

        await expect(headers.first()).toBeFocused();
      });

      test('Home moves focus to first header', async ({ page }) => {
        const accordion = getAccordion(page).first();
        const headers = accordion.locator('.apg-accordion-trigger');

        // Click to set focus
        await headers.nth(2).click();
        await expect(headers.nth(2)).toBeFocused();

        await page.keyboard.press('Home');

        await expect(headers.first()).toBeFocused();
      });

      test('End moves focus to last header', async ({ page }) => {
        const accordion = getAccordion(page).first();
        const headers = accordion.locator('.apg-accordion-trigger');
        const count = await headers.count();

        // Click to set focus
        await headers.first().click();
        await expect(headers.first()).toBeFocused();

        await page.keyboard.press('End');

        await expect(headers.nth(count - 1)).toBeFocused();
      });
    });

    // ------------------------------------------
    // 🟡 Medium Priority: Disabled State
    // ------------------------------------------
    test.describe('Disabled State', () => {
      test('disabled header cannot be clicked to expand', async ({ page }) => {
        // Third accordion has disabled items
        const accordions = getAccordion(page);
        const count = await accordions.count();

        // Find accordion with disabled item
        for (let i = 0; i < count; i++) {
          const accordion = accordions.nth(i);
          const disabledHeader = accordion.locator('.apg-accordion-trigger[disabled]');

          if ((await disabledHeader.count()) > 0) {
            const header = disabledHeader.first();
            const initialExpanded = await header.getAttribute('aria-expanded');

            await header.click({ force: true });

            // State should not change
            await expect(header).toHaveAttribute('aria-expanded', initialExpanded!);
            break;
          }
        }
      });

      test('arrow key navigation skips disabled headers', async ({ page }) => {
        // Find accordion with disabled item (third accordion)
        const accordions = getAccordion(page);
        const count = await accordions.count();

        for (let i = 0; i < count; i++) {
          const accordion = accordions.nth(i);
          const disabledHeader = accordion.locator('.apg-accordion-trigger[disabled]');

          if ((await disabledHeader.count()) > 0) {
            const headers = accordion.locator('.apg-accordion-trigger:not([disabled])');
            const firstEnabled = headers.first();

            // Click to set focus reliably
            await firstEnabled.click();
            await expect(firstEnabled).toBeFocused();

            await page.keyboard.press('ArrowDown');

            // Should skip disabled and go to next enabled
            const secondEnabled = headers.nth(1);
            await expect(secondEnabled).toBeFocused();
            break;
          }
        }
      });
    });

    // ------------------------------------------
    // 🟢 Low Priority: Accessibility
    // ------------------------------------------
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const accordion = getAccordion(page);
        await accordion.first().waitFor();

        const results = await new AxeBuilder({ page })
          .include('.apg-accordion')
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

test.describe('Accordion - Cross-framework Consistency', () => {
  test('all frameworks have accordions', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/accordion/${framework}/demo/`);
      await getAccordion(page).first().waitFor();

      const accordions = getAccordion(page);
      const count = await accordions.count();
      expect(count).toBeGreaterThan(0);
    }
  });

  test('all frameworks support click to expand', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/accordion/${framework}/demo/`);
      await getAccordion(page).first().waitFor();

      const accordion = getAccordion(page).first();
      // Use second header which is not expanded by default
      const header = accordion.locator('.apg-accordion-trigger').nth(1);

      // Wait for the component to be interactive (not expanded by default)
      await expect(header).toHaveAttribute('aria-expanded', 'false');

      // Click to toggle
      await header.click();

      // State should change to expanded
      await expect(header).toHaveAttribute('aria-expanded', 'true');
    }
  });

  test('all frameworks have consistent ARIA structure', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/accordion/${framework}/demo/`);
      await getAccordion(page).first().waitFor();

      const accordion = getAccordion(page).first();
      const header = accordion.locator('.apg-accordion-trigger').first();

      // Wait for hydration - aria-controls should be set
      await expect(header).toHaveAttribute('aria-controls', /.+/);

      // Check aria-expanded exists
      const expanded = await header.getAttribute('aria-expanded');
      expect(['true', 'false']).toContain(expanded);

      // Check aria-controls exists and references valid panel
      const controlsId = await header.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();

      const panel = page.locator(`[id="${controlsId}"]`);
      await expect(panel).toBeAttached();
    }
  });
});
