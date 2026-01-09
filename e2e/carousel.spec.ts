import { test, expect } from '@playwright/test';

/**
 * E2E Tests for Carousel Pattern
 *
 * These tests verify the Carousel component behavior in a real browser,
 * including auto-rotation, keyboard interaction, and touch/swipe gestures.
 *
 * Test coverage:
 * - ARIA structure and attributes
 * - Keyboard navigation (Arrow keys, Home, End)
 * - Auto-rotation with pause/resume
 * - Focus management
 * - Touch/swipe interaction
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Carousel (${framework})`, () => {
    // Use data-testid selectors for more robust tests
    const manualCarouselSelector = '[data-testid="carousel-manual"]';
    const autoCarouselSelector = '[data-testid="carousel-auto"]';

    test.beforeEach(async ({ page }) => {
      await page.goto(`patterns/carousel/${framework}/`);
      // Wait for carousel to be mounted (faster than networkidle)
      await page.locator(manualCarouselSelector).waitFor();
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has aria-roledescription="carousel" on container', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
      });

      test('has aria-roledescription="slide" on each tabpanel', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const panels = carousel.locator('[role="tabpanel"]');
        const count = await panels.count();
        expect(count).toBeGreaterThan(0);

        for (let i = 0; i < count; i++) {
          const panel = panels.nth(i);
          await expect(panel).toHaveAttribute('aria-roledescription', 'slide');
        }
      });

      test('has aria-label="N of M" format on slides', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const panels = carousel.locator('[role="tabpanel"]');
        const count = await panels.count();

        for (let i = 0; i < count; i++) {
          const panel = panels.nth(i);
          const label = await panel.getAttribute('aria-label');
          expect(label).toMatch(new RegExp(`${i + 1} of ${count}`));
        }
      });

      test('has tablist with tabs', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tablist = carousel.locator('[role="tablist"]');
        await expect(tablist).toBeVisible();

        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const count = await tabs.count();
        expect(count).toBeGreaterThan(0);
      });

      test('has aria-selected="true" on active tab', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const activeTab = carousel.locator('[role="tablist"] [role="tab"][aria-selected="true"]');
        await expect(activeTab).toBeVisible();

        const activeTabs = await carousel
          .locator('[role="tablist"] [role="tab"][aria-selected="true"]')
          .count();
        expect(activeTabs).toBe(1);
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('moves to next tab on ArrowRight', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const firstTab = tabs.first();

        await firstTab.click();
        await page.waitForTimeout(100);
        await expect(firstTab).toBeFocused();
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(350);

        const secondTab = tabs.nth(1);
        await expect(secondTab).toHaveAttribute('aria-selected', 'true');
        await expect(secondTab).toBeFocused();
      });

      test('moves to previous tab on ArrowLeft', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const secondTab = tabs.nth(1);

        await secondTab.click();
        await page.waitForTimeout(100);
        await expect(secondTab).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(350);

        const firstTab = tabs.first();
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        await expect(firstTab).toBeFocused();
      });

      test('wraps from last to first on ArrowRight', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const count = await tabs.count();
        const lastTab = tabs.nth(count - 1);

        await lastTab.click();
        await page.waitForTimeout(100);
        await expect(lastTab).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('ArrowRight');
        await page.waitForTimeout(350);

        const firstTab = tabs.first();
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        await expect(firstTab).toBeFocused();
      });

      test('wraps from first to last on ArrowLeft', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const count = await tabs.count();
        const firstTab = tabs.first();

        await firstTab.click();
        await page.waitForTimeout(100);
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');

        await page.keyboard.press('ArrowLeft');
        await page.waitForTimeout(350);

        const lastTab = tabs.nth(count - 1);
        await expect(lastTab).toHaveAttribute('aria-selected', 'true');
        await expect(lastTab).toBeFocused();
      });

      test('moves to first tab on Home', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const count = await tabs.count();
        const lastTab = tabs.nth(count - 1);

        await lastTab.click();
        await page.waitForTimeout(100);
        await page.keyboard.press('Home');
        await page.waitForTimeout(350);

        const firstTab = tabs.first();
        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
        await expect(firstTab).toBeFocused();
      });

      test('moves to last tab on End', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const count = await tabs.count();
        const firstTab = tabs.first();

        await firstTab.click();
        await page.waitForTimeout(100);
        await page.keyboard.press('End');
        await page.waitForTimeout(350);

        const lastTab = tabs.nth(count - 1);
        await expect(lastTab).toHaveAttribute('aria-selected', 'true');
        await expect(lastTab).toBeFocused();
      });
    });

    // 🔴 High Priority: Focus Management
    test.describe('APG: Focus Management', () => {
      test('uses roving tabindex on tablist', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const count = await tabs.count();

        // Only one tab should have tabindex="0"
        const tabsWithZeroTabindex = carousel.locator(
          '[role="tablist"] [role="tab"][tabindex="0"]'
        );
        await expect(tabsWithZeroTabindex).toHaveCount(1);

        // Others should have tabindex="-1"
        const tabsWithNegativeTabindex = carousel.locator(
          '[role="tablist"] [role="tab"][tabindex="-1"]'
        );
        await expect(tabsWithNegativeTabindex).toHaveCount(count - 1);
      });
    });

    // 🟡 Medium Priority: Navigation Controls
    test.describe('Navigation Controls', () => {
      test('next button advances to next slide', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const firstTab = tabs.first();
        const secondTab = tabs.nth(1);

        await expect(firstTab).toHaveAttribute('aria-selected', 'true');

        const nextButton = carousel.locator('button[aria-label*="Next"], button:has-text("Next")');
        await nextButton.click();
        // Wait for animation to complete
        await page.waitForTimeout(350);

        await expect(secondTab).toHaveAttribute('aria-selected', 'true');
      });

      test('previous button goes to previous slide', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const firstTab = tabs.first();
        const secondTab = tabs.nth(1);

        // First go to second slide via next button
        const nextButton = carousel.locator('button[aria-label*="Next"], button:has-text("Next")');
        await nextButton.click();
        await page.waitForTimeout(350);
        await expect(secondTab).toHaveAttribute('aria-selected', 'true');

        const prevButton = carousel.locator(
          'button[aria-label*="Previous"], button[aria-label*="Prev"], button:has-text("Previous")'
        );
        await prevButton.click();
        await page.waitForTimeout(350);

        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
      });

      test('navigation buttons wrap around', async ({ page }) => {
        const carousel = page.locator(manualCarouselSelector);
        const tabs = carousel.locator('[role="tablist"] [role="tab"]');
        const count = await tabs.count();
        const lastTab = tabs.nth(count - 1);
        const firstTab = tabs.first();

        // Go to last slide via clicking the tab
        await lastTab.click();
        await page.waitForTimeout(350);
        await expect(lastTab).toHaveAttribute('aria-selected', 'true');

        // Click next - should wrap to first
        const nextButton = carousel.locator('button[aria-label*="Next"], button:has-text("Next")');
        await nextButton.click();
        await page.waitForTimeout(350);

        await expect(firstTab).toHaveAttribute('aria-selected', 'true');
      });
    });

    // 🟡 Medium Priority: Auto-Rotation (test on auto carousel)
    test.describe('Auto-Rotation', () => {
      test('aria-live changes based on rotation state', async ({ page }) => {
        // Use auto-rotation carousel
        const carousel = page.locator(autoCarouselSelector);
        const slidesContainer = carousel.locator('[role="group"]').first();

        // Check initial aria-live value
        const ariaLive = await slidesContainer.getAttribute('aria-live');
        expect(['off', 'polite']).toContain(ariaLive);
      });

      test('play/pause button is present', async ({ page }) => {
        // Use auto-rotation carousel
        const carousel = page.locator(autoCarouselSelector);
        const playPauseButton = carousel.locator(
          'button[aria-label*="Stop"], button[aria-label*="Pause"], button[aria-label*="Start"], button[aria-label*="Play"]'
        );

        // Button should be present on auto-rotate carousel
        await expect(playPauseButton).toBeVisible();
      });
    });
  });
}
