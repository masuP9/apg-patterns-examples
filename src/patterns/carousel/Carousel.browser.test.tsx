/**
 * Carousel Browser Tests
 *
 * These tests run in a real browser using Vitest browser mode.
 * They verify touch/swipe interactions that require actual pointer events.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, cleanup, screen, waitFor } from '@testing-library/react';
import { Carousel, type CarouselSlide } from './Carousel';

const defaultSlides: CarouselSlide[] = [
  { id: 'slide1', content: <div>Slide 1 Content</div>, label: 'Slide 1' },
  { id: 'slide2', content: <div>Slide 2 Content</div>, label: 'Slide 2' },
  { id: 'slide3', content: <div>Slide 3 Content</div>, label: 'Slide 3' },
];

describe('Carousel Touch/Swipe Interaction', () => {
  beforeEach(() => {
    // Inject styles for carousel
    const style = document.createElement('style');
    style.textContent = `
      .apg-carousel {
        position: relative;
        width: 600px;
      }
      .apg-carousel-slides {
        overflow: hidden;
      }
      .apg-carousel-slide {
        width: 100%;
        min-height: 200px;
      }
    `;
    style.setAttribute('data-test-styles', 'carousel');
    document.head.appendChild(style);
  });

  afterEach(() => {
    cleanup();
    // Remove injected styles
    const style = document.querySelector('[data-test-styles="carousel"]');
    style?.remove();
  });

  it('shows next slide on swipe left', async () => {
    const handleSlideChange = vi.fn();
    const { container } = render(
      <Carousel
        slides={defaultSlides}
        aria-label="Featured content"
        onSlideChange={handleSlideChange}
      />
    );

    const slidesContainer = container.querySelector('[data-testid="slides-container"]');
    expect(slidesContainer).not.toBeNull();

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Simulate swipe left (drag from right to left)
    const rect = slidesContainer!.getBoundingClientRect();
    const startX = rect.left + rect.width * 0.8;
    const endX = rect.left + rect.width * 0.2;
    const clientY = rect.top + rect.height / 2;

    // PointerDown
    slidesContainer!.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: startX,
        clientY,
        pointerId: 1,
      })
    );

    // PointerMove
    slidesContainer!.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: endX,
        clientY,
        pointerId: 1,
      })
    );

    // PointerUp
    slidesContainer!.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        clientX: endX,
        clientY,
        pointerId: 1,
      })
    );

    await waitFor(() => {
      expect(handleSlideChange).toHaveBeenCalledWith(1);
    });

    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
  });

  it('shows previous slide on swipe right', async () => {
    const handleSlideChange = vi.fn();
    const { container } = render(
      <Carousel
        slides={defaultSlides}
        aria-label="Featured content"
        initialSlide={1}
        onSlideChange={handleSlideChange}
      />
    );

    const slidesContainer = container.querySelector('[data-testid="slides-container"]');
    expect(slidesContainer).not.toBeNull();

    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');

    // Simulate swipe right (drag from left to right)
    const rect = slidesContainer!.getBoundingClientRect();
    const startX = rect.left + rect.width * 0.2;
    const endX = rect.left + rect.width * 0.8;
    const clientY = rect.top + rect.height / 2;

    // PointerDown
    slidesContainer!.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: startX,
        clientY,
        pointerId: 1,
      })
    );

    // PointerMove
    slidesContainer!.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        clientX: endX,
        clientY,
        pointerId: 1,
      })
    );

    // PointerUp
    slidesContainer!.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        clientX: endX,
        clientY,
        pointerId: 1,
      })
    );

    await waitFor(() => {
      expect(handleSlideChange).toHaveBeenCalledWith(0);
    });

    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('does not change slide on small swipe (below threshold)', async () => {
    const handleSlideChange = vi.fn();
    const { container } = render(
      <Carousel
        slides={defaultSlides}
        aria-label="Featured content"
        onSlideChange={handleSlideChange}
      />
    );

    const slidesContainer = container.querySelector('[data-testid="slides-container"]');
    expect(slidesContainer).not.toBeNull();

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    // Simulate small swipe (less than threshold)
    const rect = slidesContainer!.getBoundingClientRect();
    const startX = rect.left + rect.width * 0.5;
    const endX = rect.left + rect.width * 0.45; // Only 5% movement
    const clientY = rect.top + rect.height / 2;

    slidesContainer!.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: startX,
        clientY,
        pointerId: 1,
      })
    );

    slidesContainer!.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        clientX: endX,
        clientY,
        pointerId: 1,
      })
    );

    // Should not have changed
    expect(handleSlideChange).not.toHaveBeenCalled();
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('pauses auto-rotation during touch', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { container } = render(
      <Carousel
        slides={defaultSlides}
        aria-label="Featured content"
        autoRotate
        rotationInterval={1000}
      />
    );

    const slidesContainer = container.querySelector('[data-testid="slides-container"]');
    const tabs = screen.getAllByRole('tab');

    // Start touch
    slidesContainer!.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        clientX: 100,
        clientY: 100,
        pointerId: 1,
      })
    );

    // aria-live should be polite (rotation paused)
    expect(slidesContainer).toHaveAttribute('aria-live', 'polite');

    // Advance time - should not rotate
    vi.advanceTimersByTime(1000);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');

    vi.useRealTimers();
  });
});

describe('Carousel Visual Layout', () => {
  beforeEach(() => {
    const style = document.createElement('style');
    style.textContent = `
      .apg-carousel {
        position: relative;
        width: 600px;
      }
      .apg-carousel-slides {
        overflow: hidden;
      }
      .apg-carousel-slide {
        width: 100%;
        min-height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .apg-carousel-slide[hidden] {
        display: none;
      }
    `;
    style.setAttribute('data-test-styles', 'carousel');
    document.head.appendChild(style);
  });

  afterEach(() => {
    cleanup();
    const style = document.querySelector('[data-test-styles="carousel"]');
    style?.remove();
  });

  it('only shows active slide', () => {
    render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

    const panels = screen.getAllByRole('tabpanel', { hidden: true });

    // First slide should be visible
    expect(panels[0]).not.toHaveAttribute('hidden');

    // Other slides should be hidden
    expect(panels[1]).toHaveAttribute('hidden');
    expect(panels[2]).toHaveAttribute('hidden');
  });

  it('controls are positioned below slides', () => {
    const { container } = render(<Carousel slides={defaultSlides} aria-label="Featured content" />);

    const slidesContainer = container.querySelector('[data-testid="slides-container"]');
    const controls = container.querySelector('.apg-carousel-controls');

    if (slidesContainer && controls) {
      const slidesRect = slidesContainer.getBoundingClientRect();
      const controlsRect = controls.getBoundingClientRect();

      // Controls should be below slides
      expect(controlsRect.top).toBeGreaterThanOrEqual(slidesRect.bottom - 1); // Allow 1px tolerance
    }
  });
});
