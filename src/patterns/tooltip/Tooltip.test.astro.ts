/**
 * Tooltip Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Tooltip.astro.
 * NOTE: aria-describedby is added at runtime by showTooltip() (Web Component JS).
 * Therefore it is ABSENT in the initial render; assert it is not present.
 * Dynamic tooltip visibility is covered by E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Tooltip from './Tooltip.astro';

describe('Tooltip (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderTooltip(
    props: {
      content: string;
      defaultOpen?: boolean;
      delay?: number;
      placement?: 'top' | 'bottom' | 'left' | 'right';
      id?: string;
      disabled?: boolean;
      class?: string;
      tooltipClass?: string;
    },
    slotContent = '<button type="button">Hover me</button>'
  ): Promise<Document> {
    const html = await container.renderToString(Tooltip, {
      props,
      slots: { default: slotContent },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-tooltip custom element wrapper', async () => {
      const doc = await renderTooltip({ content: 'More info' });
      expect(doc.querySelector('apg-tooltip')).not.toBeNull();
    });

    it('renders tooltip span with role="tooltip"', async () => {
      const doc = await renderTooltip({ content: 'More info' });
      const tooltip = doc.querySelector('[role="tooltip"]');
      expect(tooltip).not.toBeNull();
    });

    it('renders the tooltip content text', async () => {
      const doc = await renderTooltip({ content: 'Helpful description' });
      const tooltip = doc.querySelector('[role="tooltip"]');
      expect(tooltip?.textContent?.trim()).toBe('Helpful description');
    });
  });

  // 🔴 High Priority: ARIA - Initial State
  describe('ARIA - Initial State', () => {
    it('tooltip span has aria-hidden="true" initially (not visible)', async () => {
      const doc = await renderTooltip({ content: 'More info' });
      const tooltip = doc.querySelector('[role="tooltip"]');
      expect(tooltip?.getAttribute('aria-hidden')).toBe('true');
    });

    it('trigger wrapper does NOT have aria-describedby initially (added at runtime by JS)', async () => {
      const doc = await renderTooltip({ content: 'More info' });
      const wrapper = doc.querySelector('apg-tooltip');
      // aria-describedby is set by showTooltip() in connectedCallback - runtime only
      expect(wrapper?.hasAttribute('aria-describedby')).toBe(false);
    });
  });

  // 🟡 Medium Priority: Data Attributes
  describe('Data Attributes', () => {
    it('sets data-delay attribute from delay prop', async () => {
      const doc = await renderTooltip({ content: 'Info', delay: 500 });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.getAttribute('data-delay')).toBe('500');
    });

    it('sets data-tooltip-id attribute', async () => {
      const doc = await renderTooltip({ content: 'Info', id: 'my-tip' });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.getAttribute('data-tooltip-id')).toBe('my-tip');
    });

    it('does not set data-disabled when not disabled', async () => {
      const doc = await renderTooltip({ content: 'Info' });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.hasAttribute('data-disabled')).toBe(false);
    });

    it('sets data-disabled="true" when disabled', async () => {
      const doc = await renderTooltip({ content: 'Info', disabled: true });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.getAttribute('data-disabled')).toBe('true');
    });

    it('does not set data-default-open when defaultOpen is false', async () => {
      const doc = await renderTooltip({ content: 'Info', defaultOpen: false });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.hasAttribute('data-default-open')).toBe(false);
    });

    it('sets data-default-open="true" when defaultOpen is true', async () => {
      const doc = await renderTooltip({ content: 'Info', defaultOpen: true });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.getAttribute('data-default-open')).toBe('true');
    });
  });

  // 🟡 Medium Priority: Tooltip ID
  describe('Tooltip ID', () => {
    it('uses provided id for the tooltip span', async () => {
      const doc = await renderTooltip({ content: 'Info', id: 'custom-tip' });
      const tooltip = doc.querySelector('[role="tooltip"]');
      expect(tooltip?.getAttribute('id')).toBe('custom-tip');
    });

    it('generates a unique id when none is provided', async () => {
      const doc = await renderTooltip({ content: 'Info' });
      const tooltip = doc.querySelector('[role="tooltip"]');
      const id = tooltip?.getAttribute('id');
      expect(id).toBeTruthy();
      expect(id?.startsWith('tooltip-')).toBe(true);
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('wrapper has apg-tooltip-trigger class', async () => {
      const doc = await renderTooltip({ content: 'Info' });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.classList.contains('apg-tooltip-trigger')).toBe(true);
    });

    it('tooltip span has apg-tooltip class', async () => {
      const doc = await renderTooltip({ content: 'Info' });
      const tooltip = doc.querySelector('[role="tooltip"]');
      expect(tooltip?.classList.contains('apg-tooltip')).toBe(true);
    });

    it('appends custom class to wrapper', async () => {
      const doc = await renderTooltip({ content: 'Info', class: 'my-wrapper' });
      const wrapper = doc.querySelector('apg-tooltip');
      expect(wrapper?.classList.contains('my-wrapper')).toBe(true);
    });
  });
});
