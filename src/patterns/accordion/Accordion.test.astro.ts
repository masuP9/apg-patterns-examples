/**
 * Accordion Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Accordion.astro.
 * Keyboard navigation and expand/collapse interactions are covered by E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Accordion from './Accordion.astro';

const sampleItems = [
  { id: 'item1', header: 'Section 1', content: '<p>Content 1</p>' },
  { id: 'item2', header: 'Section 2', content: '<p>Content 2</p>', defaultExpanded: true },
  { id: 'item3', header: 'Section 3', content: '<p>Content 3</p>', disabled: true },
];

describe('Accordion (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderAccordion(
    props: {
      items?: typeof sampleItems;
      allowMultiple?: boolean;
      headingLevel?: 2 | 3 | 4 | 5 | 6;
      class?: string;
    } = {}
  ): Promise<Document> {
    const html = await container.renderToString(Accordion, {
      props: { items: sampleItems, ...props },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-accordion custom element wrapper', async () => {
      const doc = await renderAccordion();
      expect(doc.querySelector('apg-accordion')).not.toBeNull();
    });

    it('renders one item wrapper per accordion item', async () => {
      const doc = await renderAccordion();
      const items = doc.querySelectorAll('.apg-accordion-item');
      expect(items.length).toBe(3);
    });

    it('renders a trigger button per item', async () => {
      const doc = await renderAccordion();
      const triggers = doc.querySelectorAll('.apg-accordion-trigger');
      expect(triggers.length).toBe(3);
    });

    it('renders a panel per item', async () => {
      const doc = await renderAccordion();
      const panels = doc.querySelectorAll('.apg-accordion-panel');
      expect(panels.length).toBe(3);
    });

    it('renders default heading level h3', async () => {
      const doc = await renderAccordion();
      expect(doc.querySelector('h3')).not.toBeNull();
    });

    it('renders h2 when headingLevel is 2', async () => {
      const doc = await renderAccordion({ headingLevel: 2 });
      expect(doc.querySelector('h2')).not.toBeNull();
    });
  });

  // 🔴 High Priority: ARIA - aria-expanded
  describe('aria-expanded', () => {
    it('trigger for non-defaultExpanded item has aria-expanded="false"', async () => {
      const doc = await renderAccordion();
      const triggers = doc.querySelectorAll<HTMLButtonElement>('.apg-accordion-trigger');
      // item1 is not defaultExpanded
      expect(triggers[0]?.getAttribute('aria-expanded')).toBe('false');
    });

    it('trigger for defaultExpanded item has aria-expanded="true"', async () => {
      const doc = await renderAccordion();
      const triggers = doc.querySelectorAll<HTMLButtonElement>('.apg-accordion-trigger');
      // item2 is defaultExpanded
      expect(triggers[1]?.getAttribute('aria-expanded')).toBe('true');
    });
  });

  // 🔴 High Priority: ARIA - aria-controls
  describe('aria-controls', () => {
    it('trigger has aria-controls pointing to panel id', async () => {
      const doc = await renderAccordion();
      const trigger = doc.querySelector<HTMLButtonElement>('.apg-accordion-trigger');
      const controlsId = trigger?.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      const panel = doc.getElementById(controlsId!);
      expect(panel).not.toBeNull();
    });
  });

  // 🔴 High Priority: role="region" (for ≤6 panels)
  describe('role="region" on panels', () => {
    it('panels have role="region" when items count is 6 or fewer', async () => {
      const doc = await renderAccordion();
      const panels = doc.querySelectorAll('[role="region"]');
      expect(panels.length).toBe(3);
    });

    it('each region panel has aria-labelledby pointing to its trigger', async () => {
      const doc = await renderAccordion();
      const panel = doc.querySelector<HTMLElement>('[role="region"]');
      const labelledby = panel?.getAttribute('aria-labelledby');
      expect(labelledby).toBeTruthy();
      const trigger = doc.getElementById(labelledby!);
      expect(trigger).not.toBeNull();
    });
  });

  // 🟡 Medium Priority: Disabled State
  describe('Disabled Item', () => {
    it('disabled item trigger has disabled attribute', async () => {
      const doc = await renderAccordion();
      const triggers = doc.querySelectorAll<HTMLButtonElement>('.apg-accordion-trigger');
      // item3 is disabled
      expect(triggers[2]?.hasAttribute('disabled')).toBe(true);
    });

    it('disabled item trigger has aria-disabled="true"', async () => {
      const doc = await renderAccordion();
      const triggers = doc.querySelectorAll<HTMLButtonElement>('.apg-accordion-trigger');
      expect(triggers[2]?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('wrapper has apg-accordion class', async () => {
      const doc = await renderAccordion();
      const wrapper = doc.querySelector('apg-accordion');
      expect(wrapper?.classList.contains('apg-accordion')).toBe(true);
    });

    it('expanded item has apg-accordion-item--expanded class', async () => {
      const doc = await renderAccordion();
      const items = doc.querySelectorAll('.apg-accordion-item');
      // item2 is defaultExpanded
      expect(items[1]?.classList.contains('apg-accordion-item--expanded')).toBe(true);
    });

    it('collapsed panel has apg-accordion-panel--collapsed class', async () => {
      const doc = await renderAccordion();
      const panels = doc.querySelectorAll('.apg-accordion-panel');
      expect(panels[0]?.classList.contains('apg-accordion-panel--collapsed')).toBe(true);
    });

    it('expanded panel has apg-accordion-panel--expanded class', async () => {
      const doc = await renderAccordion();
      const panels = doc.querySelectorAll('.apg-accordion-panel');
      expect(panels[1]?.classList.contains('apg-accordion-panel--expanded')).toBe(true);
    });
  });

  // 🟡 Medium Priority: data-allow-multiple
  describe('data-allow-multiple', () => {
    it('sets data-allow-multiple="false" by default', async () => {
      const doc = await renderAccordion();
      const wrapper = doc.querySelector('apg-accordion');
      expect(wrapper?.getAttribute('data-allow-multiple')).toBe('false');
    });

    it('sets data-allow-multiple="true" when allowMultiple is true', async () => {
      const doc = await renderAccordion({ allowMultiple: true });
      const wrapper = doc.querySelector('apg-accordion');
      expect(wrapper?.getAttribute('data-allow-multiple')).toBe('true');
    });
  });
});
