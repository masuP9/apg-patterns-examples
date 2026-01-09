import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Carousel from './Carousel.svelte';
import type { CarouselSlide } from './Carousel.svelte';

// Mock matchMedia for tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// テスト用スライドデータ
const defaultSlides: CarouselSlide[] = [
  { id: 'slide1', content: 'Slide 1 Content', label: 'Slide 1' },
  { id: 'slide2', content: 'Slide 2 Content', label: 'Slide 2' },
  { id: 'slide3', content: 'Slide 3 Content', label: 'Slide 3' },
];

const fiveSlides: CarouselSlide[] = [
  { id: 'slide1', content: 'Slide 1', label: 'Slide 1' },
  { id: 'slide2', content: 'Slide 2', label: 'Slide 2' },
  { id: 'slide3', content: 'Slide 3', label: 'Slide 3' },
  { id: 'slide4', content: 'Slide 4', label: 'Slide 4' },
  { id: 'slide5', content: 'Slide 5', label: 'Slide 5' },
];

describe('Carousel (Svelte)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA 構造', () => {
    it('コンテナに aria-roledescription="carousel" がある', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('コンテナに aria-label がある', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-label', 'Featured content');
    });

    it('各 tabpanel に aria-roledescription="slide" がある', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      panels.forEach((panel) => {
        expect(panel).toHaveAttribute('aria-roledescription', 'slide');
      });
    });

    it('各スライドに aria-label="N of M" がある', () => {
      render(Carousel, { props: { slides: fiveSlides, 'aria-label': 'Featured content' } });
      const panels = screen.getAllByRole('tabpanel', { hidden: true });

      expect(panels[0]).toHaveAttribute('aria-label', '1 of 5');
      expect(panels[1]).toHaveAttribute('aria-label', '2 of 5');
      expect(panels[2]).toHaveAttribute('aria-label', '3 of 5');
      expect(panels[3]).toHaveAttribute('aria-label', '4 of 5');
      expect(panels[4]).toHaveAttribute('aria-label', '5 of 5');
    });
  });

  describe('APG: Tablist ARIA', () => {
    it('タブコンテナに role="tablist" がある', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('各タブに role="tab" がある', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('アクティブなタブに aria-selected="true" がある', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('タブの aria-controls が tabpanel を指している', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      const tabs = screen.getAllByRole('tab');
      const panels = screen.getAllByRole('tabpanel', { hidden: true });

      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-controls', panels[index].id);
      });
    });
  });

  // 🔴 High Priority: キーボード操作
  describe('APG: キーボード操作', () => {
    it('ArrowRight で次のタブにフォーカスが移動する', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');

      expect(tabs[1]).toHaveFocus();
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('ArrowLeft で前のタブにフォーカスが移動する', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', initialSlide: 1 },
      });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);
      await user.keyboard('{ArrowLeft}');

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('ArrowRight で最後から最初にループする', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', initialSlide: 2 },
      });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[2]);
      await user.keyboard('{ArrowRight}');

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('ArrowLeft で最初から最後にループする', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowLeft}');

      expect(tabs[2]).toHaveFocus();
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('Home で最初のタブに移動する', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', initialSlide: 2 },
      });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[2]);
      await user.keyboard('{Home}');

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('End で最後のタブに移動する', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{End}');

      expect(tabs[2]).toHaveFocus();
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    });
  });

  // 🔴 High Priority: 自動回転
  describe('APG: 自動回転', () => {
    it('有効時にスライドが自動的に回転する', async () => {
      render(Carousel, {
        props: {
          slides: defaultSlides,
          'aria-label': 'Featured content',
          autoRotate: true,
          rotationInterval: 3000,
        },
      });

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

      vi.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('自動回転中は aria-live="off"', () => {
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', autoRotate: true },
      });

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'off');
    });

    it('回転停止時は aria-live="polite"', () => {
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', autoRotate: false },
      });

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('キーボードフォーカスで回転が停止する', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: {
          slides: defaultSlides,
          'aria-label': 'Featured content',
          autoRotate: true,
          rotationInterval: 3000,
        },
      });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');

      vi.advanceTimersByTime(3000);
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('Play/Pause ボタンで回転を切り替えできる', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: {
          slides: defaultSlides,
          'aria-label': 'Featured content',
          autoRotate: true,
          rotationInterval: 3000,
        },
      });

      const playPauseButton = screen.getByRole('button', { name: /stop|pause/i });
      await user.click(playPauseButton);

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');
    });
  });

  // 🔴 High Priority: フォーカス管理
  describe('APG: フォーカス管理', () => {
    it('tablist で roving tabindex を使用している', () => {
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
    });

    it('一度に1つのタブのみ tabindex="0" を持つ', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');

      const tabsWithZeroTabindex = tabs.filter((tab) => tab.getAttribute('tabIndex') === '0');
      expect(tabsWithZeroTabindex).toHaveLength(1);
    });
  });

  // 🟡 Medium Priority: ナビゲーションコントロール
  describe('ナビゲーションコントロール', () => {
    it('次へボタンで次のスライドを表示する', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, { props: { slides: defaultSlides, 'aria-label': 'Featured content' } });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('前へボタンで前のスライドを表示する', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', initialSlide: 1 },
      });

      const prevButton = screen.getByRole('button', { name: /previous|prev/i });
      await user.click(prevButton);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('最後から最初にループする', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', initialSlide: 2 },
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });
  });

  // 🟡 Medium Priority: アクセシビリティ
  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない', async () => {
      const { container } = render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props
  describe('Props', () => {
    it('onSlideChange がスライド変更時に発火する', async () => {
      const handleSlideChange = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(Carousel, {
        props: {
          slides: defaultSlides,
          'aria-label': 'Featured content',
          onSlideChange: handleSlideChange,
        },
      });

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);

      expect(handleSlideChange).toHaveBeenCalledWith(1);
    });

    it('initialSlide prop を尊重する', () => {
      render(Carousel, {
        props: { slides: defaultSlides, 'aria-label': 'Featured content', initialSlide: 1 },
      });

      const tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  // 異常系
  describe('異常系', () => {
    it('単一スライドを処理できる', () => {
      const singleSlide: CarouselSlide[] = [
        { id: 'slide1', content: 'Only Slide', label: 'Only Slide' },
      ];
      render(Carousel, {
        props: { slides: singleSlide, 'aria-label': 'Featured content' },
      });

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);

      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('aria-label', '1 of 1');
    });
  });
});
