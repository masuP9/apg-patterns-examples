/**
 * ToggleButton Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of ToggleButton.astro.
 * Web Component behavior (click to toggle pressed state) is covered by E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import ToggleButton from './ToggleButton.astro';

describe('ToggleButton (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderToggleButton(
    props: {
      initialPressed?: boolean;
      disabled?: boolean;
      class?: string;
    } = {},
    slotContent = 'Mute'
  ): Promise<Document> {
    const html = await container.renderToString(ToggleButton, {
      props,
      slots: { default: slotContent },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-toggle-button custom element wrapper', async () => {
      const doc = await renderToggleButton();
      expect(doc.querySelector('apg-toggle-button')).not.toBeNull();
    });

    it('renders a button inside the wrapper', async () => {
      const doc = await renderToggleButton();
      expect(doc.querySelector('apg-toggle-button button')).not.toBeNull();
    });

    it('renders slot content inside apg-toggle-button-content span', async () => {
      const doc = await renderToggleButton({}, 'Mute');
      const content = doc.querySelector('.apg-toggle-button-content');
      expect(content?.textContent?.trim()).toBe('Mute');
    });

    it('renders toggle indicator span', async () => {
      const doc = await renderToggleButton();
      expect(doc.querySelector('.apg-toggle-indicator')).not.toBeNull();
    });
  });

  // 🔴 High Priority: ARIA - Pressed State
  describe('aria-pressed', () => {
    it('has aria-pressed="false" by default', async () => {
      const doc = await renderToggleButton();
      const btn = doc.querySelector('button');
      expect(btn?.getAttribute('aria-pressed')).toBe('false');
    });

    it('has aria-pressed="true" when initialPressed is true', async () => {
      const doc = await renderToggleButton({ initialPressed: true });
      const btn = doc.querySelector('button');
      expect(btn?.getAttribute('aria-pressed')).toBe('true');
    });
  });

  // 🔴 High Priority: Disabled State
  describe('Disabled State', () => {
    it('is not disabled by default', async () => {
      const doc = await renderToggleButton();
      const btn = doc.querySelector('button');
      expect(btn?.hasAttribute('disabled')).toBe(false);
    });

    it('has disabled attribute when disabled is true', async () => {
      const doc = await renderToggleButton({ disabled: true });
      const btn = doc.querySelector('button');
      expect(btn?.hasAttribute('disabled')).toBe(true);
    });
  });

  // 🟡 Medium Priority: Indicator Text
  describe('Default indicator text', () => {
    it('shows ○ indicator when not pressed', async () => {
      const doc = await renderToggleButton({ initialPressed: false });
      const indicator = doc.querySelector('.apg-toggle-indicator');
      expect(indicator?.textContent?.trim()).toBe('○');
    });

    it('shows ● indicator when pressed', async () => {
      const doc = await renderToggleButton({ initialPressed: true });
      const indicator = doc.querySelector('.apg-toggle-indicator');
      expect(indicator?.textContent?.trim()).toBe('●');
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('has apg-toggle-button class on the button', async () => {
      const doc = await renderToggleButton();
      const btn = doc.querySelector('button');
      expect(btn?.classList.contains('apg-toggle-button')).toBe(true);
    });

    it('appends custom class to wrapper', async () => {
      const doc = await renderToggleButton({ class: 'my-btn' });
      const wrapper = doc.querySelector('apg-toggle-button');
      expect(wrapper?.classList.contains('my-btn')).toBe(true);
    });
  });

  // 🟢 Low Priority: Combined States
  describe('Combined States', () => {
    it('renders pressed and disabled together', async () => {
      const doc = await renderToggleButton({ initialPressed: true, disabled: true });
      const btn = doc.querySelector('button');
      expect(btn?.getAttribute('aria-pressed')).toBe('true');
      expect(btn?.hasAttribute('disabled')).toBe(true);
    });
  });
});
