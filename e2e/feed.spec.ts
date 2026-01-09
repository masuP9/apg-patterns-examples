import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Tests for Feed Pattern
 *
 * These tests verify the Feed component behavior in a real browser,
 * including keyboard navigation, focus management, and dynamic loading.
 *
 * Note: Tests use isolated demo pages (/patterns/feed/{framework}/demo/) that render
 * only the FeedDemo component without the site layout. This ensures clean testing.
 *
 * Test coverage:
 * - ARIA structure and attributes
 * - Keyboard navigation (Page Up/Down, Ctrl+Home/End)
 * - Focus management (roving tabindex)
 * - Dynamic loading state (aria-busy)
 *
 * Note: Feed uses Page Up/Down for navigation (not Arrow keys)
 * because articles contain long content.
 */

const frameworks = ['react', 'vue', 'svelte', 'astro'] as const;

for (const framework of frameworks) {
  test.describe(`Feed (${framework})`, () => {
    const feedSelector = '[data-testid="feed-demo"]';

    test.beforeEach(async ({ page }) => {
      // Use isolated demo page without site layout
      await page.goto(`patterns/feed/${framework}/demo/`);
      await page.waitForLoadState('networkidle');
      // Wait for feed to be mounted
      await page.locator(feedSelector).waitFor();
    });

    // 🔴 High Priority: ARIA Structure
    test.describe('APG: ARIA Structure', () => {
      test('has role="feed" on container', async ({ page }) => {
        const feed = page.locator(feedSelector);
        await expect(feed).toHaveAttribute('role', 'feed');
      });

      test('has article elements in feed', async ({ page }) => {
        const feed = page.locator(feedSelector);
        // Use native article element (implicit role)
        const articles = feed.locator('article');
        const count = await articles.count();
        expect(count).toBeGreaterThan(0);
      });

      test('has aria-label or aria-labelledby on feed', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const ariaLabel = await feed.getAttribute('aria-label');
        const ariaLabelledby = await feed.getAttribute('aria-labelledby');

        // At least one should be present
        expect(ariaLabel || ariaLabelledby).toBeTruthy();
      });

      test('has aria-labelledby on each article referencing title', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const count = await articles.count();

        for (let i = 0; i < count; i++) {
          const article = articles.nth(i);
          const labelledby = await article.getAttribute('aria-labelledby');
          expect(labelledby).toBeTruthy();

          // Verify the referenced element exists
          const titleElement = page.locator(`#${labelledby}`);
          await expect(titleElement).toBeAttached();
        }
      });

      test('has aria-posinset starting from 1 and sequential', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const count = await articles.count();

        for (let i = 0; i < count; i++) {
          const article = articles.nth(i);
          const posinset = await article.getAttribute('aria-posinset');
          expect(posinset).toBe(String(i + 1));
        }
      });

      test('has aria-setsize on each article', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const count = await articles.count();

        for (let i = 0; i < count; i++) {
          const article = articles.nth(i);
          const setsize = await article.getAttribute('aria-setsize');
          expect(setsize).toBeTruthy();
          // Should be a number or -1
          expect(Number(setsize)).not.toBeNaN();
        }
      });
    });

    // 🔴 High Priority: Keyboard Interaction
    test.describe('APG: Keyboard Interaction', () => {
      test('moves to next article on Page Down', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();
        const secondArticle = articles.nth(1);

        // Focus first article
        await firstArticle.focus();
        await expect(firstArticle).toBeFocused();

        // Press Page Down
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(100);

        await expect(secondArticle).toBeFocused();
      });

      test('moves to previous article on Page Up', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();
        const secondArticle = articles.nth(1);

        // Focus second article
        await secondArticle.focus();
        await expect(secondArticle).toBeFocused();

        // Press Page Up
        await page.keyboard.press('PageUp');
        await page.waitForTimeout(100);

        await expect(firstArticle).toBeFocused();
      });

      test('does not loop at first article on Page Up', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();

        // Focus first article
        await firstArticle.focus();
        await expect(firstArticle).toBeFocused();

        // Press Page Up - should stay on first
        await page.keyboard.press('PageUp');
        await page.waitForTimeout(100);

        await expect(firstArticle).toBeFocused();
      });

      test('does not loop at last article on Page Down', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const count = await articles.count();
        const lastArticle = articles.nth(count - 1);

        // Focus last article
        await lastArticle.focus();
        await expect(lastArticle).toBeFocused();

        // Press Page Down - should stay on last
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(100);

        await expect(lastArticle).toBeFocused();
      });

      test('moves focus outside feed (after) on Ctrl+End', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();
        const afterFeedElement = page.locator('[data-testid="after-feed"]');

        // Focus first article
        await firstArticle.focus();
        await expect(firstArticle).toBeFocused();

        // Press Ctrl+End
        await page.keyboard.press('Control+End');
        await page.waitForTimeout(100);

        // Should focus element after feed
        await expect(afterFeedElement).toBeFocused();
      });

      test('moves focus outside feed (before) on Ctrl+Home', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const secondArticle = articles.nth(1);
        const beforeFeedElement = page.locator('[data-testid="before-feed"]');

        // Focus second article
        await secondArticle.focus();
        await expect(secondArticle).toBeFocused();

        // Press Ctrl+Home
        await page.keyboard.press('Control+Home');
        await page.waitForTimeout(100);

        // Should focus element before feed
        await expect(beforeFeedElement).toBeFocused();
      });

      test('moves to next article even when focus is inside article', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();
        const secondArticle = articles.nth(1);

        // Focus an interactive element inside first article (title link)
        const linkInFirstArticle = firstArticle.locator('a').first();
        const hasInteractiveElement = (await linkInFirstArticle.count()) > 0;

        if (hasInteractiveElement) {
          await linkInFirstArticle.focus();
          await expect(linkInFirstArticle).toBeFocused();

          // Press Page Down - should move to next article
          await page.keyboard.press('PageDown');
          await page.waitForTimeout(100);

          await expect(secondArticle).toBeFocused();
        } else {
          // Skip this test if no interactive elements
          test.skip();
        }
      });
    });

    // 🔴 High Priority: Focus Management
    test.describe('APG: Focus Management', () => {
      test('uses roving tabindex on articles', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const count = await articles.count();

        // Only one article should have tabindex="0"
        const articlesWithZeroTabindex = feed.locator('article[tabindex="0"]');
        await expect(articlesWithZeroTabindex).toHaveCount(1);

        // Others should have tabindex="-1"
        const articlesWithNegativeTabindex = feed.locator('article[tabindex="-1"]');
        await expect(articlesWithNegativeTabindex).toHaveCount(count - 1);
      });

      test('updates tabindex when focus moves', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();
        const secondArticle = articles.nth(1);

        // Focus first article
        await firstArticle.focus();
        await expect(firstArticle).toHaveAttribute('tabindex', '0');
        await expect(secondArticle).toHaveAttribute('tabindex', '-1');

        // Move to second article
        await page.keyboard.press('PageDown');
        await page.waitForTimeout(100);

        // Tabindex should be updated
        await expect(firstArticle).toHaveAttribute('tabindex', '-1');
        await expect(secondArticle).toHaveAttribute('tabindex', '0');
      });
    });

    // 🔴 High Priority: Dynamic Loading
    test.describe('APG: Dynamic Loading', () => {
      test('has aria-busy="false" by default', async ({ page }) => {
        const feed = page.locator(feedSelector);
        await expect(feed).toHaveAttribute('aria-busy', 'false');
      });
    });

    // 🟡 Medium Priority: Accessibility
    test.describe('Accessibility', () => {
      test('has no axe-core violations', async ({ page }) => {
        const demo = page.locator('.apg-feed-demo-wrapper');
        await expect(demo).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page })
          .include('.apg-feed-demo-wrapper')
          .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
      });

      test('article content is accessible', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();

        // Article should contain visible content
        await expect(firstArticle).toBeVisible();

        // Title should be visible
        const labelledby = await firstArticle.getAttribute('aria-labelledby');
        if (labelledby) {
          const title = page.locator(`#${labelledby}`);
          await expect(title).toBeVisible();
        }
      });

      test('articles have focusable title links', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const firstArticle = articles.first();

        // Title link should be focusable
        const titleLink = firstArticle.locator('.apg-feed-article-title-link');
        await expect(titleLink).toBeVisible();
        await titleLink.focus();
        await expect(titleLink).toBeFocused();
      });
    });

    // 🟢 Demo Functionality
    test.describe('Demo Functionality', () => {
      test('Add Article button adds new article', async ({ page }) => {
        const feed = page.locator(feedSelector);
        const articles = feed.locator('article');
        const initialCount = await articles.count();

        // Click Add Article button
        const addButton = page.locator('[data-testid="before-feed"]');
        await addButton.click();

        // Wait for article to be added
        await page.waitForTimeout(100);

        // Should have one more article
        await expect(articles).toHaveCount(initialCount + 1);
      });

      test('Back to top button scrolls feed to top', async ({ page }) => {
        const scrollContainer = page.locator('.apg-feed-scroll-container');

        // Scroll down first
        await scrollContainer.evaluate((el) => {
          el.scrollTop = 500;
        });

        // Verify scrolled
        const scrollTopBefore = await scrollContainer.evaluate((el) => el.scrollTop);
        expect(scrollTopBefore).toBeGreaterThan(0);

        // Click Back to top button
        const backToTopButton = page.locator('[data-testid="after-feed"]');
        await backToTopButton.click();

        // Wait for smooth scroll
        await page.waitForTimeout(500);

        // Should be at top
        const scrollTopAfter = await scrollContainer.evaluate((el) => el.scrollTop);
        expect(scrollTopAfter).toBe(0);
      });
    });
  });
}

// Cross-framework consistency tests
test.describe('Feed - Cross-framework Consistency', () => {
  test('all frameworks render same article count initially', async ({ page }) => {
    const articleCounts: Record<string, number> = {};

    for (const framework of frameworks) {
      await page.goto(`patterns/feed/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const feed = page.locator('[data-testid="feed-demo"]');
      const articles = feed.locator('article');
      articleCounts[framework] = await articles.count();
    }

    // All frameworks should have the same initial article count
    const reactCount = articleCounts['react'];
    for (const framework of frameworks) {
      expect(articleCounts[framework]).toBe(reactCount);
    }
  });

  test('all frameworks have consistent ARIA attributes', async ({ page }) => {
    for (const framework of frameworks) {
      await page.goto(`patterns/feed/${framework}/demo/`);
      await page.waitForLoadState('networkidle');

      const feed = page.locator('[data-testid="feed-demo"]');

      // Check feed has required attributes
      await expect(feed).toHaveAttribute('role', 'feed');
      await expect(feed).toHaveAttribute('aria-busy', 'false');

      const ariaLabel = await feed.getAttribute('aria-label');
      const ariaLabelledby = await feed.getAttribute('aria-labelledby');
      expect(ariaLabel || ariaLabelledby).toBeTruthy();
    }
  });
});
