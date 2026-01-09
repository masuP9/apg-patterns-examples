/**
 * Feed Astro Component Tests using Container API
 *
 * These tests verify the Feed.astro component output using Astro's Container API.
 * This ensures the component renders correct ARIA structure and attributes.
 *
 * Note: Interactive behavior (keyboard navigation, Ctrl+Home/End) is tested in E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Feed from './Feed.astro';

describe('Feed (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  // Helper to render and parse HTML
  async function renderFeed(props: {
    articles: Array<{ id: string; title: string; description?: string; content: string }>;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    setSize?: number;
    loading?: boolean;
    class?: string;
    id?: string;
  }): Promise<Document> {
    const html = await container.renderToString(Feed, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  const basicArticles = [
    {
      id: 'article-1',
      title: 'First Article',
      description: 'Description 1',
      content: '<p>Content 1</p>',
    },
    {
      id: 'article-2',
      title: 'Second Article',
      description: 'Description 2',
      content: '<p>Content 2</p>',
    },
    {
      id: 'article-3',
      title: 'Third Article',
      description: 'Description 3',
      content: '<p>Content 3</p>',
    },
  ];

  const fiveArticles = [
    { id: 'article-1', title: 'Article 1', content: '<p>Content 1</p>' },
    { id: 'article-2', title: 'Article 2', content: '<p>Content 2</p>' },
    { id: 'article-3', title: 'Article 3', content: '<p>Content 3</p>' },
    { id: 'article-4', title: 'Article 4', content: '<p>Content 4</p>' },
    { id: 'article-5', title: 'Article 5', content: '<p>Content 5</p>' },
  ];

  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA Structure', () => {
    it('has role="feed" on container', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const feed = doc.querySelector('[role="feed"]');
      expect(feed).not.toBeNull();
    });

    it('has role="article" on each article', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const articles = doc.querySelectorAll('[role="article"]');
      expect(articles).toHaveLength(3);
    });

    it('has aria-label on feed when provided', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const feed = doc.querySelector('[role="feed"]');
      expect(feed?.getAttribute('aria-label')).toBe('News Feed');
    });

    it('has aria-labelledby on feed when provided', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-labelledby': 'feed-title',
      });
      const feed = doc.querySelector('[role="feed"]');
      expect(feed?.getAttribute('aria-labelledby')).toBe('feed-title');
    });

    it('has aria-labelledby on each article referencing title', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const articles = doc.querySelectorAll('[role="article"]');

      articles.forEach((article) => {
        const labelledby = article.getAttribute('aria-labelledby');
        expect(labelledby).toBeTruthy();

        const titleElement = doc.getElementById(labelledby!);
        expect(titleElement).not.toBeNull();
      });
    });

    it('has aria-describedby on articles when description provided', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const articles = doc.querySelectorAll('[role="article"]');

      articles.forEach((article) => {
        const describedby = article.getAttribute('aria-describedby');
        expect(describedby).toBeTruthy();

        const descElement = doc.getElementById(describedby!);
        expect(descElement).not.toBeNull();
      });
    });

    it('has aria-posinset starting from 1 and sequential', async () => {
      const doc = await renderFeed({
        articles: fiveArticles,
        'aria-label': 'News Feed',
      });
      const articles = doc.querySelectorAll('[role="article"]');

      articles.forEach((article, index) => {
        expect(article.getAttribute('aria-posinset')).toBe(String(index + 1));
      });
    });

    it('has aria-setsize as total count when known', async () => {
      const doc = await renderFeed({
        articles: fiveArticles,
        'aria-label': 'News Feed',
      });
      const articles = doc.querySelectorAll('[role="article"]');

      articles.forEach((article) => {
        expect(article.getAttribute('aria-setsize')).toBe('5');
      });
    });

    it('has aria-setsize as -1 when setSize is -1', async () => {
      const doc = await renderFeed({
        articles: fiveArticles,
        'aria-label': 'News Feed',
        setSize: -1,
      });
      const articles = doc.querySelectorAll('[role="article"]');

      articles.forEach((article) => {
        expect(article.getAttribute('aria-setsize')).toBe('-1');
      });
    });

    it('has aria-setsize as explicit value when provided', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
        setSize: 100,
      });
      const articles = doc.querySelectorAll('[role="article"]');

      articles.forEach((article) => {
        expect(article.getAttribute('aria-setsize')).toBe('100');
      });
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('article elements have tabindex', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const articles = doc.querySelectorAll('[role="article"]');

      articles.forEach((article) => {
        expect(article.hasAttribute('tabindex')).toBe(true);
      });
    });

    it('uses roving tabindex (only first article has tabindex="0")', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const articles = doc.querySelectorAll('[role="article"]');

      expect(articles[0]?.getAttribute('tabindex')).toBe('0');
      expect(articles[1]?.getAttribute('tabindex')).toBe('-1');
      expect(articles[2]?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🔴 High Priority: Dynamic Loading State
  describe('APG: Dynamic Loading', () => {
    it('has aria-busy="false" by default', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });
      const feed = doc.querySelector('[role="feed"]');
      expect(feed?.getAttribute('aria-busy')).toBe('false');
    });

    it('has aria-busy="true" when loading', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
        loading: true,
      });
      const feed = doc.querySelector('[role="feed"]');
      expect(feed?.getAttribute('aria-busy')).toBe('true');
    });
  });

  // 🟢 Low Priority: HTML Attributes
  describe('HTML Attributes', () => {
    it('applies class to container', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
        class: 'custom-feed',
      });
      const feed = doc.querySelector('[role="feed"]');
      expect(feed?.classList.contains('custom-feed')).toBe(true);
    });

    it('applies id to container', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
        id: 'my-feed',
      });
      const feed = doc.querySelector('[role="feed"]');
      expect(feed?.getAttribute('id')).toBe('my-feed');
    });
  });

  // Content Rendering
  describe('Content Rendering', () => {
    it('renders article titles', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });

      expect(doc.body.textContent).toContain('First Article');
      expect(doc.body.textContent).toContain('Second Article');
      expect(doc.body.textContent).toContain('Third Article');
    });

    it('renders article descriptions when provided', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });

      expect(doc.body.textContent).toContain('Description 1');
      expect(doc.body.textContent).toContain('Description 2');
      expect(doc.body.textContent).toContain('Description 3');
    });

    it('renders article content', async () => {
      const doc = await renderFeed({
        articles: basicArticles,
        'aria-label': 'News Feed',
      });

      expect(doc.body.innerHTML).toContain('Content 1');
      expect(doc.body.innerHTML).toContain('Content 2');
      expect(doc.body.innerHTML).toContain('Content 3');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty articles array', async () => {
      const doc = await renderFeed({
        articles: [],
        'aria-label': 'Empty Feed',
      });

      const feed = doc.querySelector('[role="feed"]');
      expect(feed).not.toBeNull();

      const articles = doc.querySelectorAll('[role="article"]');
      expect(articles).toHaveLength(0);
    });

    it('handles single article', async () => {
      const singleArticle = [{ id: '1', title: 'Only Article', content: '<p>Content</p>' }];
      const doc = await renderFeed({
        articles: singleArticle,
        'aria-label': 'Single Article Feed',
      });

      const articles = doc.querySelectorAll('[role="article"]');
      expect(articles).toHaveLength(1);
      expect(articles[0]?.getAttribute('aria-posinset')).toBe('1');
      expect(articles[0]?.getAttribute('aria-setsize')).toBe('1');
    });

    it('handles article without description', async () => {
      const noDescArticles = [{ id: '1', title: 'No Description', content: '<p>Content</p>' }];
      const doc = await renderFeed({
        articles: noDescArticles,
        'aria-label': 'Feed',
      });

      const article = doc.querySelector('[role="article"]');
      // Should not have aria-describedby when no description
      expect(article?.hasAttribute('aria-describedby')).toBe(false);
    });
  });
});
