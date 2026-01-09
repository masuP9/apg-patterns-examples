import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Feed from './Feed.svelte';
import type { FeedArticle } from './Feed.svelte';

// テスト用記事データ
const defaultArticles: FeedArticle[] = [
  { id: 'article-1', title: 'First Article', description: 'Description 1', content: 'Content 1' },
  { id: 'article-2', title: 'Second Article', description: 'Description 2', content: 'Content 2' },
  { id: 'article-3', title: 'Third Article', description: 'Description 3', content: 'Content 3' },
];

const fiveArticles: FeedArticle[] = [
  { id: 'article-1', title: 'Article 1', content: 'Content 1' },
  { id: 'article-2', title: 'Article 2', content: 'Content 2' },
  { id: 'article-3', title: 'Article 3', content: 'Content 3' },
  { id: 'article-4', title: 'Article 4', content: 'Content 4' },
  { id: 'article-5', title: 'Article 5', content: 'Content 5' },
];

describe('Feed (Svelte)', () => {
  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA 構造', () => {
    it('コンテナに role="feed" がある', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      expect(screen.getByRole('feed')).toBeInTheDocument();
    });

    it('各記事に role="article" がある', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(3);
    });

    it('フィードに aria-label がある', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-label', 'News Feed');
    });

    it('各記事に aria-labelledby がありタイトルを参照している', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        const labelledby = article.getAttribute('aria-labelledby');
        expect(labelledby).toBeTruthy();

        const titleElement = document.getElementById(labelledby!);
        expect(titleElement).toBeInTheDocument();
      });
    });

    it('description 提供時に各記事に aria-describedby がある', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        const describedby = article.getAttribute('aria-describedby');
        expect(describedby).toBeTruthy();

        const descElement = document.getElementById(describedby!);
        expect(descElement).toBeInTheDocument();
      });
    });

    it('aria-posinset が 1 から始まり連続している', () => {
      render(Feed, { props: { articles: fiveArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');

      articles.forEach((article, index) => {
        expect(article).toHaveAttribute('aria-posinset', String(index + 1));
      });
    });

    it('総数が既知の場合 aria-setsize に総数が設定される', () => {
      render(Feed, { props: { articles: fiveArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        expect(article).toHaveAttribute('aria-setsize', '5');
      });
    });

    it('setSize が -1 の場合 aria-setsize に -1 が設定される', () => {
      render(Feed, { props: { articles: fiveArticles, 'aria-label': 'News Feed', setSize: -1 } });
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        expect(article).toHaveAttribute('aria-setsize', '-1');
      });
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('APG: キーボード操作', () => {
    it('Page Down で次の記事にフォーカスが移動する', async () => {
      const user = userEvent.setup();
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      await user.keyboard('{PageDown}');

      expect(articles[1]).toHaveFocus();
    });

    it('Page Up で前の記事にフォーカスが移動する', async () => {
      const user = userEvent.setup();
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });

      const articles = screen.getAllByRole('article');
      articles[1].focus();

      await user.keyboard('{PageUp}');

      expect(articles[0]).toHaveFocus();
    });

    it('最初の記事で Page Up してもループしない', async () => {
      const user = userEvent.setup();
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      await user.keyboard('{PageUp}');

      expect(articles[0]).toHaveFocus();
    });

    it('最後の記事で Page Down してもループしない', async () => {
      const user = userEvent.setup();
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });

      const articles = screen.getAllByRole('article');
      articles[2].focus();

      await user.keyboard('{PageDown}');

      expect(articles[2]).toHaveFocus();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: フォーカス管理', () => {
    it('記事要素が tabindex でフォーカス可能', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');

      articles.forEach((article) => {
        expect(article).toHaveAttribute('tabindex');
      });
    });

    it('roving tabindex を使用（1つの記事のみ tabindex="0"）', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');

      const withTabindex0 = articles.filter((article) => article.getAttribute('tabindex') === '0');
      expect(withTabindex0).toHaveLength(1);
    });

    it('フォーカス移動時に tabindex が更新される', async () => {
      const user = userEvent.setup();
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      expect(articles[0]).toHaveAttribute('tabindex', '0');
      expect(articles[1]).toHaveAttribute('tabindex', '-1');

      await user.keyboard('{PageDown}');

      expect(articles[0]).toHaveAttribute('tabindex', '-1');
      expect(articles[1]).toHaveAttribute('tabindex', '0');
    });

    it('デフォルトで最初の記事が tabindex="0"', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const articles = screen.getAllByRole('article');

      expect(articles[0]).toHaveAttribute('tabindex', '0');
      expect(articles[1]).toHaveAttribute('tabindex', '-1');
      expect(articles[2]).toHaveAttribute('tabindex', '-1');
    });
  });

  // 🔴 High Priority: Dynamic Loading
  describe('APG: 動的読み込み', () => {
    it('デフォルトで aria-busy="false"', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });
      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-busy', 'false');
    });

    it('loading 時に aria-busy="true"', () => {
      render(Feed, {
        props: { articles: defaultArticles, 'aria-label': 'News Feed', loading: true },
      });
      const feed = screen.getByRole('feed');
      expect(feed).toHaveAttribute('aria-busy', 'true');
    });

    it('loading 完了後に aria-busy="false"', async () => {
      const { rerender } = render(Feed, {
        props: { articles: defaultArticles, 'aria-label': 'News Feed', loading: true },
      });

      expect(screen.getByRole('feed')).toHaveAttribute('aria-busy', 'true');

      await rerender({ articles: defaultArticles, 'aria-label': 'News Feed', loading: false });

      expect(screen.getByRole('feed')).toHaveAttribute('aria-busy', 'false');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない', async () => {
      const { container } = render(Feed, {
        props: { articles: defaultArticles, 'aria-label': 'News Feed' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('loading 状態で axe 違反がない', async () => {
      const { container } = render(Feed, {
        props: { articles: defaultArticles, 'aria-label': 'News Feed', loading: true },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Props & Events
  describe('Props & Events', () => {
    it('記事データから記事を描画する', () => {
      render(Feed, { props: { articles: defaultArticles, 'aria-label': 'News Feed' } });

      expect(screen.getByText('First Article')).toBeInTheDocument();
      expect(screen.getByText('Second Article')).toBeInTheDocument();
      expect(screen.getByText('Third Article')).toBeInTheDocument();
    });

    it('フォーカス変更時に focuschange イベントが発火する', async () => {
      const handleFocusChange = vi.fn();
      const user = userEvent.setup();

      render(Feed, {
        props: {
          articles: defaultArticles,
          'aria-label': 'News Feed',
          onfocuschange: handleFocusChange,
        },
      });

      const articles = screen.getAllByRole('article');
      articles[0].focus();

      await user.keyboard('{PageDown}');

      expect(handleFocusChange).toHaveBeenCalledWith({ articleId: 'article-2', index: 1 });
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML 属性継承', () => {
    it('className をマージする', () => {
      const { container } = render(Feed, {
        props: { articles: defaultArticles, 'aria-label': 'News Feed', class: 'custom-feed' },
      });
      const feed = container.querySelector('[role="feed"]');
      expect(feed).toHaveClass('custom-feed');
    });
  });

  // Edge Cases
  describe('異常系', () => {
    it('空の記事配列を処理できる', () => {
      render(Feed, { props: { articles: [], 'aria-label': 'Empty Feed' } });
      const feed = screen.getByRole('feed');
      expect(feed).toBeInTheDocument();
      expect(screen.queryAllByRole('article')).toHaveLength(0);
    });

    it('単一記事を処理できる', () => {
      render(Feed, {
        props: {
          articles: [{ id: '1', title: 'Only Article', content: 'Content' }],
          'aria-label': 'Single Article Feed',
        },
      });

      const articles = screen.getAllByRole('article');
      expect(articles).toHaveLength(1);
      expect(articles[0]).toHaveAttribute('aria-posinset', '1');
      expect(articles[0]).toHaveAttribute('aria-setsize', '1');
    });
  });
});
