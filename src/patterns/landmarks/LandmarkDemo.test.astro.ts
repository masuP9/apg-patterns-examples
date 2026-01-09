/**
 * LandmarkDemo Astro Component Tests using Container API
 *
 * These tests verify the LandmarkDemo.astro component output using Astro's Container API.
 * This ensures the component renders correct HTML structure and landmark elements.
 *
 * Note: Landmarks are static structural elements without JavaScript interaction,
 * so Container API tests are sufficient for most verification.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import LandmarkDemo from './LandmarkDemo.astro';

describe('LandmarkDemo (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  // Helper to render and parse HTML
  async function renderLandmarkDemo(
    props: {
      showLabels?: boolean;
      class?: string;
    } = {}
  ): Promise<Document> {
    const html = await container.renderToString(LandmarkDemo, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  // 🔴 High Priority: Landmark Roles
  describe('Landmark Roles', () => {
    it('renders header element (banner landmark)', async () => {
      const doc = await renderLandmarkDemo();
      const header = doc.querySelector('header');
      expect(header).not.toBeNull();
    });

    it('renders nav element (navigation landmark)', async () => {
      const doc = await renderLandmarkDemo();
      const navs = doc.querySelectorAll('nav');
      expect(navs.length).toBeGreaterThanOrEqual(1);
    });

    it('renders main element (main landmark)', async () => {
      const doc = await renderLandmarkDemo();
      const main = doc.querySelector('main');
      expect(main).not.toBeNull();
    });

    it('renders footer element (contentinfo landmark)', async () => {
      const doc = await renderLandmarkDemo();
      const footer = doc.querySelector('footer');
      expect(footer).not.toBeNull();
    });

    it('renders aside element (complementary landmark)', async () => {
      const doc = await renderLandmarkDemo();
      const aside = doc.querySelector('aside');
      expect(aside).not.toBeNull();
    });

    it('renders section with aria-labelledby (region landmark)', async () => {
      const doc = await renderLandmarkDemo();
      const section = doc.querySelector('section[aria-labelledby]');
      expect(section).not.toBeNull();
    });

    it('renders form with role="search" (search landmark)', async () => {
      const doc = await renderLandmarkDemo();
      const search = doc.querySelector('form[role="search"]');
      expect(search).not.toBeNull();
    });

    it('renders form with aria-label (form landmark)', async () => {
      const doc = await renderLandmarkDemo();
      // Find form that has aria-label but not role="search"
      const forms = doc.querySelectorAll('form[aria-label]');
      const formLandmark = Array.from(forms).find((form) => form.getAttribute('role') !== 'search');
      expect(formLandmark).not.toBeNull();
    });

    it('renders exactly one main element', async () => {
      const doc = await renderLandmarkDemo();
      const mains = doc.querySelectorAll('main');
      expect(mains.length).toBe(1);
    });

    it('renders exactly one header at top level', async () => {
      const doc = await renderLandmarkDemo();
      // Header should not be inside article, aside, main, nav, section
      const headers = doc.querySelectorAll('header');
      // Check that there's one header that's not nested in other landmarks
      const topLevelHeaders = Array.from(headers).filter((header) => {
        const parent = header.parentElement;
        if (!parent) return true;
        const parentTag = parent.tagName.toLowerCase();
        return !['article', 'aside', 'main', 'nav', 'section'].includes(parentTag);
      });
      expect(topLevelHeaders.length).toBe(1);
    });

    it('renders exactly one footer at top level', async () => {
      const doc = await renderLandmarkDemo();
      const footers = doc.querySelectorAll('footer');
      // Check that there's one footer that's not nested in other landmarks
      const topLevelFooters = Array.from(footers).filter((footer) => {
        const parent = footer.parentElement;
        if (!parent) return true;
        const parentTag = parent.tagName.toLowerCase();
        return !['article', 'aside', 'main', 'nav', 'section'].includes(parentTag);
      });
      expect(topLevelFooters.length).toBe(1);
    });
  });

  // 🔴 High Priority: Landmark Labeling
  describe('Landmark Labeling', () => {
    it('navigation elements have aria-label when multiple', async () => {
      const doc = await renderLandmarkDemo();
      const navs = doc.querySelectorAll('nav');
      if (navs.length > 1) {
        const labels = Array.from(navs).map(
          (nav) => nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby')
        );
        const uniqueLabels = new Set(labels.filter(Boolean));
        expect(uniqueLabels.size).toBe(navs.length);
      }
    });

    it('section element has aria-labelledby attribute', async () => {
      const doc = await renderLandmarkDemo();
      const section = doc.querySelector('section[aria-labelledby]');
      expect(section).not.toBeNull();
      const labelId = section?.getAttribute('aria-labelledby');
      expect(labelId).toBeTruthy();
      // Check that the referenced element exists
      const labelElement = doc.getElementById(labelId!);
      expect(labelElement).not.toBeNull();
    });

    it('search form has aria-label attribute', async () => {
      const doc = await renderLandmarkDemo();
      const search = doc.querySelector('form[role="search"]');
      expect(search?.hasAttribute('aria-label')).toBe(true);
    });

    it('form landmark has aria-label attribute', async () => {
      const doc = await renderLandmarkDemo();
      const forms = doc.querySelectorAll('form[aria-label]');
      const formLandmark = Array.from(forms).find((form) => form.getAttribute('role') !== 'search');
      expect(formLandmark).not.toBeNull();
      expect(formLandmark?.getAttribute('aria-label')).toBeTruthy();
    });

    it('aside element has aria-label attribute', async () => {
      const doc = await renderLandmarkDemo();
      const aside = doc.querySelector('aside');
      expect(aside?.hasAttribute('aria-label')).toBe(true);
    });
  });

  // 🟢 Low Priority: Props
  describe('Props', () => {
    it('applies custom class to container', async () => {
      const doc = await renderLandmarkDemo({ class: 'custom-class' });
      const container = doc.querySelector('.apg-landmark-demo');
      expect(container?.classList.contains('custom-class')).toBe(true);
    });

    it('shows landmark labels when showLabels is true', async () => {
      const doc = await renderLandmarkDemo({ showLabels: true });
      // Check for label overlay elements
      const labels = doc.querySelectorAll('.apg-landmark-label');
      expect(labels.length).toBeGreaterThan(0);
    });

    it('hides landmark labels by default', async () => {
      const doc = await renderLandmarkDemo({ showLabels: false });
      const labels = doc.querySelectorAll('.apg-landmark-label');
      // Labels should either not exist or have hidden class
      Array.from(labels).forEach((label) => {
        expect(label.classList.contains('hidden')).toBe(true);
      });
    });
  });

  // 🟢 Low Priority: Semantic Structure
  describe('Semantic Structure', () => {
    it('main contains region landmark', async () => {
      const doc = await renderLandmarkDemo();
      const main = doc.querySelector('main');
      const regionInMain = main?.querySelector('section[aria-labelledby]');
      expect(regionInMain).not.toBeNull();
    });

    it('main contains complementary landmark', async () => {
      const doc = await renderLandmarkDemo();
      const main = doc.querySelector('main');
      const asideInMain = main?.querySelector('aside');
      expect(asideInMain).not.toBeNull();
    });

    it('header contains navigation', async () => {
      const doc = await renderLandmarkDemo();
      const header = doc.querySelector('header');
      const navInHeader = header?.querySelector('nav');
      expect(navInHeader).not.toBeNull();
    });

    it('footer contains navigation', async () => {
      const doc = await renderLandmarkDemo();
      const footer = doc.querySelector('footer');
      const navInFooter = footer?.querySelector('nav');
      expect(navInFooter).not.toBeNull();
    });
  });

  // CSS Classes
  describe('CSS Classes', () => {
    it('has apg-landmark-demo class on container', async () => {
      const doc = await renderLandmarkDemo();
      const container = doc.querySelector('.apg-landmark-demo');
      expect(container).not.toBeNull();
    });

    it('landmarks have appropriate CSS classes', async () => {
      const doc = await renderLandmarkDemo();
      expect(doc.querySelector('.apg-landmark-banner')).not.toBeNull();
      expect(doc.querySelector('.apg-landmark-main')).not.toBeNull();
      expect(doc.querySelector('.apg-landmark-contentinfo')).not.toBeNull();
    });
  });
});
