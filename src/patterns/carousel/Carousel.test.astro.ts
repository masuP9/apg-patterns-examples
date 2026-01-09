/**
 * Carousel Astro Component Tests using Container API
 *
 * These tests verify the Carousel.astro component output using Astro's Container API.
 * This ensures the component renders correct ARIA structure and attributes.
 *
 * Note: Interactive behavior (keyboard, auto-rotation) is tested in E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Carousel from './Carousel.astro';

describe('Carousel (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  // Helper to render and parse HTML
  async function renderCarousel(props: {
    slides: Array<{ id: string; content: string; label?: string }>;
    'aria-label': string;
    initialSlide?: number;
    autoRotate?: boolean;
    rotationInterval?: number;
    class?: string;
    id?: string;
  }): Promise<Document> {
    const html = await container.renderToString(Carousel, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  const basicSlides = [
    { id: 'slide1', content: '<div>Slide 1 Content</div>', label: 'Slide 1' },
    { id: 'slide2', content: '<div>Slide 2 Content</div>', label: 'Slide 2' },
    { id: 'slide3', content: '<div>Slide 3 Content</div>', label: 'Slide 3' },
  ];

  const fiveSlides = [
    { id: 'slide1', content: '<div>Slide 1</div>', label: 'Slide 1' },
    { id: 'slide2', content: '<div>Slide 2</div>', label: 'Slide 2' },
    { id: 'slide3', content: '<div>Slide 3</div>', label: 'Slide 3' },
    { id: 'slide4', content: '<div>Slide 4</div>', label: 'Slide 4' },
    { id: 'slide5', content: '<div>Slide 5</div>', label: 'Slide 5' },
  ];

  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA Structure', () => {
    it('has aria-roledescription="carousel" on container', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const carousel = doc.querySelector('section');
      expect(carousel?.getAttribute('aria-roledescription')).toBe('carousel');
    });

    it('has aria-label on container', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const carousel = doc.querySelector('section');
      expect(carousel?.getAttribute('aria-label')).toBe('Featured content');
    });

    it('has aria-roledescription="slide" on each tabpanel', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const panels = doc.querySelectorAll('[role="tabpanel"]');
      expect(panels).toHaveLength(3);
      panels.forEach((panel) => {
        expect(panel.getAttribute('aria-roledescription')).toBe('slide');
      });
    });

    it('has aria-label="N of M" on each slide', async () => {
      const doc = await renderCarousel({
        slides: fiveSlides,
        'aria-label': 'Featured content',
      });
      const panels = doc.querySelectorAll('[role="tabpanel"]');

      expect(panels[0]?.getAttribute('aria-label')).toBe('1 of 5');
      expect(panels[1]?.getAttribute('aria-label')).toBe('2 of 5');
      expect(panels[2]?.getAttribute('aria-label')).toBe('3 of 5');
      expect(panels[3]?.getAttribute('aria-label')).toBe('4 of 5');
      expect(panels[4]?.getAttribute('aria-label')).toBe('5 of 5');
    });
  });

  describe('APG: Tablist ARIA', () => {
    it('has role="tablist" on tab container', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const tablist = doc.querySelector('[role="tablist"]');
      expect(tablist).not.toBeNull();
    });

    it('has role="tab" on each tab button', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const tabs = doc.querySelectorAll('[role="tab"]');
      expect(tabs).toHaveLength(3);
    });

    it('has role="tabpanel" on each slide', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const panels = doc.querySelectorAll('[role="tabpanel"]');
      expect(panels).toHaveLength(3);
    });

    it('has aria-selected="true" on first tab by default', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const tabs = doc.querySelectorAll('[role="tab"]');

      expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
      expect(tabs[1]?.getAttribute('aria-selected')).toBe('false');
      expect(tabs[2]?.getAttribute('aria-selected')).toBe('false');
    });

    it('has aria-selected="true" on initialSlide tab', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        initialSlide: 1,
      });
      const tabs = doc.querySelectorAll('[role="tab"]');

      expect(tabs[0]?.getAttribute('aria-selected')).toBe('false');
      expect(tabs[1]?.getAttribute('aria-selected')).toBe('true');
      expect(tabs[2]?.getAttribute('aria-selected')).toBe('false');
    });

    it('has aria-controls pointing to tabpanel', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const tabs = doc.querySelectorAll('[role="tab"]');
      const panels = doc.querySelectorAll('[role="tabpanel"]');

      tabs.forEach((tab, index) => {
        const controls = tab.getAttribute('aria-controls');
        const panelId = panels[index]?.getAttribute('id');
        expect(controls).toBe(panelId);
      });
    });

    it('panel aria-labelledby matches tab id', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const tabs = doc.querySelectorAll('[role="tab"]');
      const panels = doc.querySelectorAll('[role="tabpanel"]');

      panels.forEach((panel, index) => {
        const labelledby = panel.getAttribute('aria-labelledby');
        const tabId = tabs[index]?.getAttribute('id');
        expect(labelledby).toBe(tabId);
      });
    });
  });

  // 🔴 High Priority: Auto-Rotation State
  describe('APG: Auto-Rotation', () => {
    it('has aria-live="off" when autoRotate is true', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        autoRotate: true,
      });
      const slidesContainer = doc.querySelector('[data-testid="slides-container"]');
      expect(slidesContainer?.getAttribute('aria-live')).toBe('off');
    });

    it('has aria-live="polite" when autoRotate is false', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        autoRotate: false,
      });
      const slidesContainer = doc.querySelector('[data-testid="slides-container"]');
      expect(slidesContainer?.getAttribute('aria-live')).toBe('polite');
    });

    it('has play/pause button when autoRotate is true', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        autoRotate: true,
      });
      const playPauseButton = doc.querySelector(
        'button[aria-label*="Stop"], button[aria-label*="Pause"]'
      );
      expect(playPauseButton).not.toBeNull();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('uses roving tabindex on tablist', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const tabs = doc.querySelectorAll('[role="tab"]');

      expect(tabs[0]?.getAttribute('tabindex')).toBe('0');
      expect(tabs[1]?.getAttribute('tabindex')).toBe('-1');
      expect(tabs[2]?.getAttribute('tabindex')).toBe('-1');
    });

    it('active tab has tabindex="0"', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        initialSlide: 1,
      });
      const tabs = doc.querySelectorAll('[role="tab"]');

      expect(tabs[0]?.getAttribute('tabindex')).toBe('-1');
      expect(tabs[1]?.getAttribute('tabindex')).toBe('0');
      expect(tabs[2]?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟡 Medium Priority: Navigation Controls
  describe('Navigation Controls', () => {
    it('has previous button', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const prevButton = doc.querySelector(
        'button[aria-label*="Previous"], button[aria-label*="Prev"]'
      );
      expect(prevButton).not.toBeNull();
    });

    it('has next button', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const nextButton = doc.querySelector('button[aria-label*="Next"]');
      expect(nextButton).not.toBeNull();
    });

    it('prev/next buttons have aria-controls', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
      });
      const prevButton = doc.querySelector(
        'button[aria-label*="Previous"], button[aria-label*="Prev"]'
      );
      const nextButton = doc.querySelector('button[aria-label*="Next"]');
      const slidesContainer = doc.querySelector('[data-testid="slides-container"]');

      expect(prevButton?.getAttribute('aria-controls')).toBe(slidesContainer?.getAttribute('id'));
      expect(nextButton?.getAttribute('aria-controls')).toBe(slidesContainer?.getAttribute('id'));
    });
  });

  // 🟢 Low Priority: HTML Attributes
  describe('HTML Attributes', () => {
    it('applies class to container', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        class: 'custom-carousel',
      });
      const carousel = doc.querySelector('section');
      expect(carousel?.classList.contains('custom-carousel')).toBe(true);
    });

    it('applies id to container', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        id: 'my-carousel',
      });
      const carousel = doc.querySelector('section');
      expect(carousel?.getAttribute('id')).toBe('my-carousel');
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles single slide', async () => {
      const singleSlide = [{ id: 'slide1', content: '<div>Only Slide</div>', label: 'Only' }];
      const doc = await renderCarousel({
        slides: singleSlide,
        'aria-label': 'Featured content',
      });

      const tabs = doc.querySelectorAll('[role="tab"]');
      expect(tabs).toHaveLength(1);

      const panel = doc.querySelector('[role="tabpanel"]');
      expect(panel?.getAttribute('aria-label')).toBe('1 of 1');
    });

    it('clamps initialSlide to valid range', async () => {
      const doc = await renderCarousel({
        slides: basicSlides,
        'aria-label': 'Featured content',
        initialSlide: 99,
      });
      const tabs = doc.querySelectorAll('[role="tab"]');

      // Should fallback to first slide
      expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
    });
  });
});
