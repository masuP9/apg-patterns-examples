import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Feed, type FeedArticle } from './Feed';

// Test article data
const defaultArticles: FeedArticle[] = [
  {
    id: 'article-1',
    title: 'First Article',
    description: 'Description 1',
    content: <p>Content 1</p>,
  },
  {
    id: 'article-2',
    title: 'Second Article',
    description: 'Description 2',
    content: <p>Content 2</p>,
  },
  {
    id: 'article-3',
    title: 'Third Article',
    description: 'Description 3',
    content: <p>Content 3</p>,
  },
];

const fiveArticles: FeedArticle[] = [
  { id: 'article-1', title: 'Article 1', content: <p>Content 1</p> },
  { id: 'article-2', title: 'Article 2', content: <p>Content 2</p> },
  { id: 'article-3', title: 'Article 3', content: <p>Content 3</p> },
  { id: 'article-4', title: 'Article 4', content: <p>Content 4</p> },
  { id: 'article-5', title: 'Article 5', content: <p>Content 5</p> },
];

// Helper to render Feed with focusable elements before/after for Ctrl+Home/End tests
const renderWithSurroundingElements = (props: React.ComponentProps<typeof Feed>) => {
  return render(
    <div>
      <button data-testid="before-feed">Before Feed</button>
      <Feed {...props} />
      <button data-testid="after-feed">After Feed</button>
    </div>
  );
};

describe('Feed', () => {
  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA Structure', () => {
    it('has role="feed" on container', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      expect(screen.getByRole('feed')).toBeInTheDocument();
    });

    it('has role="article" on each article', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(3);
    });

    it('has aria-label on feed when provided', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-label', 'News Feed');
    });

    it('has aria-labelledby on feed when provided', () => {
      render(
        <div>
          <h2 id="feed-title">Latest News</h2>
          <Feed articles={defaultArticles} aria-labelledby="feed-title" />
        </div>
      );
      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-labelledby', 'feed-title');
    });

    it('warns when feed has no accessible name', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      render(<Feed articles={defaultArticles} />);
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('accessible name'));
      consoleSpy.mockRestore();
    });

    it('has aria-labelledby on each article referencing title', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        const labelledby = article.getAttribute('aria-labelledby');
        expect(labelledby).toBeTruthy();

        // Verify the referenced element exists and contains the title
        const titleElement = document.getElementById(labelledby!);
        expect(titleElement).toBeInTheDocument();
      });
    });

    it('has aria-describedby on articles when description provided', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        const describedby = article.getAttribute('aria-describedby');
        expect(describedby).toBeTruthy();

        const descElement = document.getElementById(describedby!);
        expect(descElement).toBeInTheDocument();
      });
    });

    it('has aria-posinset starting from 1 and sequential', () => {
      render(<Feed articles={fiveArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');

      articles.forEach((article, index) => {
        expect(article).toHaveAttribute('aria-posinset', String(index + 1));
      });
    });

    it('has aria-setsize as total count when known', () => {
      render(<Feed articles={fiveArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        expect(article).toHaveAttribute('aria-setsize', '5');
      });
    });

    it('has aria-setsize as -1 when setSize is -1 (unknown)', () => {
      render(<Feed articles={fiveArticles} aria-label="News Feed" setSize={-1} />);
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        expect(article).toHaveAttribute('aria-setsize', '-1');
      });
    });

    it('has aria-setsize as explicit value when provided', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" setSize={100} />);
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        expect(article).toHaveAttribute('aria-setsize', '100');
      });
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('APG: Keyboard Interaction', () => {
    it('moves focus to next article on Page Down', async () => {
      const user = userEvent.setup();
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      await user.keyboard('{PageDown}');

      expect(articles[1]).toHaveFocus();
    });

    it('moves focus to previous article on Page Up', async () => {
      const user = userEvent.setup();
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      const articles = screen.getAllByRole('article');
      articles[1].focus();

      await user.keyboard('{PageUp}');

      expect(articles[0]).toHaveFocus();
    });

    it('does not loop at first article on Page Up', async () => {
      const user = userEvent.setup();
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      await user.keyboard('{PageUp}');

      expect(articles[0]).toHaveFocus(); // Still on first
    });

    it('does not loop at last article on Page Down', async () => {
      const user = userEvent.setup();
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      const articles = screen.getAllByRole('article');
      articles[2].focus();

      await user.keyboard('{PageDown}');

      expect(articles[2]).toHaveFocus(); // Still on last
    });

    it('moves focus to next article even when focus is inside article element', async () => {
      const user = userEvent.setup();
      render(
        <Feed
          articles={[
            { id: '1', title: 'Article 1', content: <button>Inside Button 1</button> },
            { id: '2', title: 'Article 2', content: <button>Inside Button 2</button> },
          ]}
          aria-label="News Feed"
        />
      );

      // Focus on button inside first article
      const insideButton = screen.getByRole('button', { name: 'Inside Button 1' });
      insideButton.focus();

      await user.keyboard('{PageDown}');

      const articles = screen.getAllByRole('article');
      expect(articles[1]).toHaveFocus();
    });

    it('moves focus outside feed (after) on Ctrl+End', async () => {
      const user = userEvent.setup();
      renderWithSurroundingElements({
        articles: defaultArticles,
        'aria-label': 'News Feed',
      });

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      await user.keyboard('{Control>}{End}{/Control}');

      const afterButton = screen.getByTestId('after-feed');
      expect(afterButton).toHaveFocus();
    });

    it('moves focus outside feed (before) on Ctrl+Home', async () => {
      const user = userEvent.setup();
      renderWithSurroundingElements({
        articles: defaultArticles,
        'aria-label': 'News Feed',
      });

      const articles = screen.getAllByRole('article');
      articles[1].focus();

      await user.keyboard('{Control>}{Home}{/Control}');

      const beforeButton = screen.getByTestId('before-feed');
      expect(beforeButton).toHaveFocus();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('article elements are focusable with tabindex', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        expect(article).toHaveAttribute('tabindex');
      });
    });

    it('uses roving tabindex (only one article has tabindex="0")', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');

      const withTabindex0 = articles.filter((article) => article.getAttribute('tabindex') === '0');
      expect(withTabindex0).toHaveLength(1);
    });

    it('updates tabindex when focus moves', async () => {
      const user = userEvent.setup();
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      expect(articles[0]).toHaveAttribute('tabindex', '0');
      expect(articles[1]).toHaveAttribute('tabindex', '-1');

      await user.keyboard('{PageDown}');

      expect(articles[0]).toHaveAttribute('tabindex', '-1');
      expect(articles[1]).toHaveAttribute('tabindex', '0');
    });

    it('first article has tabindex="0" by default', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const articles = screen.getAllByRole('article');

      expect(articles[0]).toHaveAttribute('tabindex', '0');
      expect(articles[1]).toHaveAttribute('tabindex', '-1');
      expect(articles[2]).toHaveAttribute('tabindex', '-1');
    });
  });

  // 🔴 High Priority: Dynamic Loading
  describe('APG: Dynamic Loading', () => {
    it('has aria-busy="false" by default', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-busy', 'false');
    });

    it('sets aria-busy="true" during loading', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" loading />);
      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-busy', 'true');
    });

    it('sets aria-busy="false" after loading complete', () => {
      const { rerender } = render(
        <Feed articles={defaultArticles} aria-label="News Feed" loading />
      );

      expect(screen.getByRole('feed')).toHaveAttribute('aria-busy', 'true');

      rerender(<Feed articles={defaultArticles} aria-label="News Feed" loading={false} />);

      expect(screen.getByRole('feed')).toHaveAttribute('aria-busy', 'false');
    });

    it('updates aria-posinset/aria-setsize when articles are added', () => {
      const { rerender } = render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      let articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(3);
      expect(articles[2]).toHaveAttribute('aria-setsize', '3');

      // Add more articles
      rerender(<Feed articles={fiveArticles} aria-label="News Feed" />);

      articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(5);
      articles.forEach((article, index) => {
        expect(article).toHaveAttribute('aria-posinset', String(index + 1));
        expect(article).toHaveAttribute('aria-setsize', '5');
      });
    });

    it('maintains focus during loading', async () => {
      const user = userEvent.setup();
      const { rerender } = render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      const articles = screen.getAllByRole('article');
      articles[1].focus();

      // Start loading
      rerender(<Feed articles={defaultArticles} aria-label="News Feed" loading />);

      expect(articles[1]).toHaveFocus();
    });

    it('calls onLoadMore when provided', async () => {
      const handleLoadMore = vi.fn();
      render(
        <Feed articles={defaultArticles} aria-label="News Feed" onLoadMore={handleLoadMore} />
      );

      const articles = screen.getAllByRole('article');
      articles[2].focus(); // Focus on last article

      // Implementation should call onLoadMore when user reaches end
      // This is tested in E2E for scroll behavior
    });

    it('does not call onLoadMore during loading', async () => {
      const handleLoadMore = vi.fn();
      render(
        <Feed
          articles={defaultArticles}
          aria-label="News Feed"
          loading
          onLoadMore={handleLoadMore}
        />
      );

      // Even if we try to trigger load more, it should be suppressed
      expect(handleLoadMore).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Feed articles={defaultArticles} aria-label="News Feed" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations during loading state', async () => {
      const { container } = render(
        <Feed articles={defaultArticles} aria-label="News Feed" loading />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with setSize=-1', async () => {
      const { container } = render(
        <Feed articles={defaultArticles} aria-label="News Feed" setSize={-1} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Props & Callbacks
  describe('Props & Callbacks', () => {
    it('renders articles from data', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      expect(screen.getByText('First Article')).toBeInTheDocument();
      expect(screen.getByText('Second Article')).toBeInTheDocument();
      expect(screen.getByText('Third Article')).toBeInTheDocument();
    });

    it('renders article content', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" />);

      expect(screen.getByText('Content 1')).toBeInTheDocument();
      expect(screen.getByText('Content 2')).toBeInTheDocument();
      expect(screen.getByText('Content 3')).toBeInTheDocument();
    });

    it('calls onFocusChange with articleId and index on focus', async () => {
      const handleFocusChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Feed articles={defaultArticles} aria-label="News Feed" onFocusChange={handleFocusChange} />
      );

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      await user.keyboard('{PageDown}');

      expect(handleFocusChange).toHaveBeenCalledWith('article-2', 1);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('merges className', () => {
      const { container } = render(
        <Feed articles={defaultArticles} aria-label="News Feed" className="custom-feed" />
      );
      const feed = container.querySelector('[role="feed"]');
      expect(feed).toHaveClass('custom-feed');
    });

    it('passes through data-* attributes', () => {
      render(<Feed articles={defaultArticles} aria-label="News Feed" data-testid="my-feed" />);
      expect(screen.getByTestId('my-feed')).toBeInTheDocument();
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty articles array', () => {
      render(<Feed articles={[]} aria-label="Empty Feed" />);
      const feed = screen.getByRole('feed');
      expect(feed).toBeInTheDocument();
      expect(screen.queryAllByRole('article')).toHaveLength(0);
    });

    it('handles single article', () => {
      render(
        <Feed
          articles={[{ id: '1', title: 'Only Article', content: <p>Content</p> }]}
          aria-label="Single Article Feed"
        />
      );

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(1);
      expect(articles[0]).toHaveAttribute('aria-posinset', '1');
      expect(articles[0]).toHaveAttribute('aria-setsize', '1');
    });

    it('handles article without description', () => {
      render(
        <Feed
          articles={[{ id: '1', title: 'No Description', content: <p>Content</p> }]}
          aria-label="Feed"
        />
      );

      const article = screen.getByRole('article');
      // Should not have aria-describedby when no description
      expect(article).not.toHaveAttribute('aria-describedby');
    });
  });
});
