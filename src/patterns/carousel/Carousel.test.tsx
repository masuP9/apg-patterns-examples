import { render, screen, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Carousel, type CarouselSlide } from './Carousel';

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

// Test slide data
const defaultSlides: CarouselSlide[] = [
  { id: 'slide1', content: <div>Slide 1 Content</div>, label: 'Slide 1' },
  { id: 'slide2', content: <div>Slide 2 Content</div>, label: 'Slide 2' },
  { id: 'slide3', content: <div>Slide 3 Content</div>, label: 'Slide 3' },
];

const fiveSlides: CarouselSlide[] = [
  { id: 'slide1', content: <div>Slide 1</div>, label: 'Slide 1' },
  { id: 'slide2', content: <div>Slide 2</div>, label: 'Slide 2' },
  { id: 'slide3', content: <div>Slide 3</div>, label: 'Slide 3' },
  { id: 'slide4', content: <div>Slide 4</div>, label: 'Slide 4' },
  { id: 'slide5', content: <div>Slide 5</div>, label: 'Slide 5' },
];

describe('Carousel', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA Structure', () => {
    it('has aria-roledescription="carousel" on container', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('has aria-label on container', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-label', 'Featured content');
    });

    it('has aria-roledescription="slide" on each tabpanel', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      panels.forEach((panel) => {
        expect(panel).toHaveAttribute('aria-roledescription', 'slide');
      });
    });

    it('has aria-label="N of M" on each slide', () => {
      render(<Carousel slides={fiveSlides} aria-label="Featured content" />);
      const panels = screen.getAllByRole('tabpanel', { hidden: true });

      expect(panels[0]).toHaveAttribute('aria-label', '1 of 5');
      expect(panels[1]).toHaveAttribute('aria-label', '2 of 5');
      expect(panels[2]).toHaveAttribute('aria-label', '3 of 5');
      expect(panels[3]).toHaveAttribute('aria-label', '4 of 5');
      expect(panels[4]).toHaveAttribute('aria-label', '5 of 5');
    });
  });

  describe('APG: Tablist ARIA', () => {
    it('has role="tablist" on tab container', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('has role="tab" on each tab button', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('has role="tabpanel" on each slide', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      expect(panels).toHaveLength(3);
    });

    it('has aria-selected="true" on active tab', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('has aria-controls pointing to tabpanel', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const tabs = screen.getAllByRole('tab');
      const panels = screen.getAllByRole('tabpanel', { hidden: true });

      tabs.forEach((tab, index) => {
        expect(tab).toHaveAttribute('aria-controls', panels[index].id);
      });
    });

    it('panel aria-labelledby matches tab id', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const tabs = screen.getAllByRole('tab');
      const panels = screen.getAllByRole('tabpanel', { hidden: true });

      panels.forEach((panel, index) => {
        expect(panel).toHaveAttribute('aria-labelledby', tabs[index].id);
      });
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('APG: Keyboard Interaction', () => {
    it('moves focus to next tab on ArrowRight', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');

      expect(tabs[1]).toHaveFocus();
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('moves focus to previous tab on ArrowLeft', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" initialSlide={1} />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);
      await user.keyboard('{ArrowLeft}');

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps from last to first on ArrowRight', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" initialSlide={2} />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[2]);
      await user.keyboard('{ArrowRight}');

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps from first to last on ArrowLeft', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowLeft}');

      expect(tabs[2]).toHaveFocus();
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('moves focus to first tab on Home', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" initialSlide={2} />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[2]);
      await user.keyboard('{Home}');

      expect(tabs[0]).toHaveFocus();
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('moves focus to last tab on End', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{End}');

      expect(tabs[2]).toHaveFocus();
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('activates tab on Enter', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{Enter}');

      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('activates tab on Space', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');
      await user.keyboard(' ');

      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });
  });

  // 🔴 High Priority: Auto-Rotation
  describe('APG: Auto-Rotation', () => {
    it('rotates slides automatically when enabled', async () => {
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={3000}
        />
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

      // Advance timer
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      });

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('has aria-live="off" during auto-rotation', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" autoRotate />);

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'off');
    });

    it('has aria-live="polite" when rotation stopped', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" autoRotate={false} />);

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('stops rotation on keyboard focus', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={3000}
        />
      );

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');

      // Advance time - should NOT rotate
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('stops rotation on mouse hover over slides container', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={3000}
        />
      );

      const slidesContainer = screen.getByTestId('slides-container');
      await user.hover(slidesContainer);

      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');

      // Advance time - should NOT rotate
      act(() => {
        vi.advanceTimersByTime(3000);
      });

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('resumes rotation on focus/hover out (if not manually stopped)', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={3000}
        />
      );

      const slidesContainer = screen.getByTestId('slides-container');
      const tabs = screen.getAllByRole('tab');

      // Hover over slides container to pause
      await user.hover(slidesContainer);

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

      // Unhover to resume
      await user.unhover(slidesContainer);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('toggles rotation with play/pause button', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={3000}
        />
      );

      const playPauseButton = screen.getByRole('button', { name: /stop|pause/i });

      // Click to pause
      await user.click(playPauseButton);

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');

      const tabs = screen.getAllByRole('tab');

      act(() => {
        vi.advanceTimersByTime(3000);
      });
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

      // Click to resume
      const startButton = screen.getByRole('button', { name: /start|play/i });
      await user.click(startButton);

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      await waitFor(() => {
        expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('updates button label based on rotation state', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={3000}
        />
      );

      // Initially rotating - button should say "Stop" or "Pause"
      expect(screen.getByRole('button', { name: /stop|pause/i })).toBeInTheDocument();

      // Click to pause
      await user.click(screen.getByRole('button', { name: /stop|pause/i }));

      // Button should now say "Start" or "Play"
      expect(screen.getByRole('button', { name: /start|play/i })).toBeInTheDocument();
    });

    it('respects prefers-reduced-motion', () => {
      // Mock matchMedia for prefers-reduced-motion
      const originalMatchMedia = window.matchMedia;
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={3000}
        />
      );

      // Should not auto-rotate when reduced motion is preferred
      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');

      const tabs = screen.getAllByRole('tab');

      act(() => {
        vi.advanceTimersByTime(3000);
      });

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

      window.matchMedia = originalMatchMedia;
    });

    it('loops back to first slide after last', async () => {
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          autoRotate
          rotationInterval={1000}
          initialSlide={2}
        />
      );

      const tabs = screen.getAllByRole('tab');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await waitFor(() => {
        expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('uses roving tabindex on tablist', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
    });

    it('only one tab has tabindex="0" at a time', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');

      const tabsWithZeroTabindex = tabs.filter((tab) => tab.getAttribute('tabIndex') === '0');
      expect(tabsWithZeroTabindex).toHaveLength(1);
    });

    it('rotation control is first in tab order', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" autoRotate />);

      // Start from outside the carousel and tab in
      const carousel = screen.getByRole('region');
      carousel.focus();

      await user.tab();

      // First focusable should be the play/pause button
      const playPauseButton = screen.getByRole('button', { name: /stop|pause|start|play/i });
      expect(playPauseButton).toHaveFocus();
    });
  });

  // 🟡 Medium Priority: Navigation Controls
  describe('Navigation Controls', () => {
    it('shows next slide on next button click', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('shows previous slide on previous button click', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" initialSlide={1} />);

      const prevButton = screen.getByRole('button', { name: /previous|prev/i });
      await user.click(prevButton);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps to first slide from last on next', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" initialSlide={2} />);

      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('wraps to last slide from first on previous', async () => {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const prevButton = screen.getByRole('button', { name: /previous|prev/i });
      await user.click(prevButton);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    });

    it('prev/next buttons have aria-controls', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

      const prevButton = screen.getByRole('button', { name: /previous|prev/i });
      const nextButton = screen.getByRole('button', { name: /next/i });
      const slidesContainer = screen.getByTestId('slides-container');

      expect(prevButton).toHaveAttribute('aria-controls', slidesContainer.id);
      expect(nextButton).toHaveAttribute('aria-controls', slidesContainer.id);
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Carousel slides={defaultSlides} aria-label="Featured content" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with autoRotate', async () => {
      const { container } = render(
        <Carousel slides={defaultSlides} aria-label="Featured content" autoRotate />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('calls onSlideChange when slide changes', async () => {
      const handleSlideChange = vi.fn();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          onSlideChange={handleSlideChange}
        />
      );

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[1]);

      expect(handleSlideChange).toHaveBeenCalledWith(1);
    });

    it('respects initialSlide prop', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" initialSlide={1} />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('respects autoRotate prop', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" autoRotate={false} />);

      const slidesContainer = screen.getByTestId('slides-container');
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');
    });

    it('applies className to container', () => {
      const { container } = render(
        <Carousel
          slides={defaultSlides}
          aria-label="Featured content"
          className="custom-carousel"
        />
      );
      const carousel = container.firstChild as HTMLElement;
      expect(carousel).toHaveClass('custom-carousel');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles single slide', () => {
      const singleSlide: CarouselSlide[] = [
        { id: 'slide1', content: <div>Only Slide</div>, label: 'Only Slide' },
      ];
      render(<Carousel slides={singleSlide} aria-label="Featured content" />);

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(1);

      const panel = screen.getByRole('tabpanel');
      expect(panel).toHaveAttribute('aria-label', '1 of 1');
    });

    it('handles initialSlide out of bounds', () => {
      render(<Carousel slides={defaultSlides} aria-label="Featured content" initialSlide={99} />);

      const tabs = screen.getAllByRole('tab');
      // Should fallback to first slide
      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    });
  });
});
