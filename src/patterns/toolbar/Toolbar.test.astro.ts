/**
 * Toolbar Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Toolbar.astro.
 * Keyboard navigation (roving tabindex) is set at runtime by the Web Component
 * and is therefore covered by E2E tests, not here.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Toolbar from './Toolbar.astro';

describe('Toolbar (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderToolbar(
    props: {
      orientation?: 'horizontal' | 'vertical';
      'aria-label'?: string;
      'aria-labelledby'?: string;
      id?: string;
      class?: string;
    } = {},
    slotContent = '<button type="button">Bold</button>'
  ): Promise<Document> {
    const html = await container.renderToString(Toolbar, {
      props,
      slots: { default: slotContent },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-toolbar custom element wrapper', async () => {
      const doc = await renderToolbar();
      expect(doc.querySelector('apg-toolbar')).not.toBeNull();
    });

    it('renders div with role="toolbar"', async () => {
      const doc = await renderToolbar();
      expect(doc.querySelector('[role="toolbar"]')).not.toBeNull();
    });

    it('renders slot content inside toolbar', async () => {
      const doc = await renderToolbar({}, '<button type="button">Bold</button>');
      const toolbar = doc.querySelector('[role="toolbar"]');
      expect(toolbar?.querySelector('button')).not.toBeNull();
    });
  });

  // 🔴 High Priority: ARIA - Orientation
  describe('aria-orientation', () => {
    it('has aria-orientation="horizontal" by default', async () => {
      const doc = await renderToolbar();
      const toolbar = doc.querySelector('[role="toolbar"]');
      expect(toolbar?.getAttribute('aria-orientation')).toBe('horizontal');
    });

    it('has aria-orientation="vertical" when set', async () => {
      const doc = await renderToolbar({ orientation: 'vertical' });
      const toolbar = doc.querySelector('[role="toolbar"]');
      expect(toolbar?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  // 🔴 High Priority: ARIA - Label
  describe('aria-label', () => {
    it('has aria-label when provided', async () => {
      const doc = await renderToolbar({ 'aria-label': 'Text formatting' });
      const toolbar = doc.querySelector('[role="toolbar"]');
      expect(toolbar?.getAttribute('aria-label')).toBe('Text formatting');
    });

    it('does not have aria-label when not provided', async () => {
      const doc = await renderToolbar();
      const toolbar = doc.querySelector('[role="toolbar"]');
      expect(toolbar?.hasAttribute('aria-label')).toBe(false);
    });

    it('has aria-labelledby when provided', async () => {
      const doc = await renderToolbar({ 'aria-labelledby': 'toolbar-heading' });
      const toolbar = doc.querySelector('[role="toolbar"]');
      expect(toolbar?.getAttribute('aria-labelledby')).toBe('toolbar-heading');
    });
  });

  // 🟡 Medium Priority: data-orientation
  describe('data-orientation', () => {
    it('wrapper has data-orientation="horizontal" by default', async () => {
      const doc = await renderToolbar();
      const wrapper = doc.querySelector('apg-toolbar');
      expect(wrapper?.getAttribute('data-orientation')).toBe('horizontal');
    });

    it('wrapper has data-orientation="vertical" when set', async () => {
      const doc = await renderToolbar({ orientation: 'vertical' });
      const wrapper = doc.querySelector('apg-toolbar');
      expect(wrapper?.getAttribute('data-orientation')).toBe('vertical');
    });
  });

  // 🟡 Medium Priority: id prop
  describe('id prop', () => {
    it('wrapper has id when provided', async () => {
      const doc = await renderToolbar({ id: 'my-toolbar' });
      const wrapper = doc.querySelector('apg-toolbar');
      expect(wrapper?.getAttribute('id')).toBe('my-toolbar');
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('toolbar div has apg-toolbar class', async () => {
      const doc = await renderToolbar();
      const toolbar = doc.querySelector('[role="toolbar"]');
      expect(toolbar?.classList.contains('apg-toolbar')).toBe(true);
    });

    it('appends custom class to wrapper', async () => {
      const doc = await renderToolbar({ class: 'my-toolbar' });
      const wrapper = doc.querySelector('apg-toolbar');
      expect(wrapper?.classList.contains('my-toolbar')).toBe(true);
    });
  });
});
