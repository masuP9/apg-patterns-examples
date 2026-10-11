/**
 * Link Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Link.astro.
 * Web Component behavior (Enter/click activation, Space not activating,
 * IME composition, navigation, opening in a new tab, disabled state and the
 * link-activate event) is covered by E2E tests in e2e/link.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Link from './Link.astro';

describe('Link (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderLink(
    props: Record<string, unknown> = {},
    text = 'Click here'
  ): Promise<Document> {
    const html = await container.renderToString(Link, { props, slots: { default: text } });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-link custom element wrapper', async () => {
      const doc = await renderLink({ href: '#' });
      expect(doc.querySelector('apg-link')).not.toBeNull();
    });

    it('renders a span with role="link"', async () => {
      const doc = await renderLink({ href: '#' });
      expect(doc.querySelector('span[role="link"]')).not.toBeNull();
    });

    it('passes href to the Web Component via data-href', async () => {
      const doc = await renderLink({ href: 'https://example.com' });
      expect(doc.querySelector('apg-link')?.getAttribute('data-href')).toBe('https://example.com');
    });

    it('passes target to the Web Component via data-target', async () => {
      const doc = await renderLink({ href: 'https://example.com', target: '_blank' });
      expect(doc.querySelector('apg-link')?.getAttribute('data-target')).toBe('_blank');
    });

    it('does not set data-target when target is not provided', async () => {
      const doc = await renderLink({ href: 'https://example.com' });
      expect(doc.querySelector('apg-link')?.hasAttribute('data-target')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('uses slot content as the text content', async () => {
      const doc = await renderLink({ href: '#' }, 'Learn more');
      expect(doc.querySelector('[role="link"]')?.textContent?.trim()).toBe('Learn more');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" by default', async () => {
      const doc = await renderLink({ href: '#' });
      expect(doc.querySelector('[role="link"]')?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" when disabled', async () => {
      const doc = await renderLink({ href: '#', disabled: true });
      expect(doc.querySelector('[role="link"]')?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has aria-disabled="true" when disabled', async () => {
      const doc = await renderLink({ href: '#', disabled: true });
      expect(doc.querySelector('[role="link"]')?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-disabled when not disabled', async () => {
      const doc = await renderLink({ href: '#' });
      expect(doc.querySelector('[role="link"]')?.hasAttribute('aria-disabled')).toBe(false);
    });

    it('has aria-current="page" when provided', async () => {
      const doc = await renderLink({ href: '#', 'aria-current': 'page' });
      expect(doc.querySelector('[role="link"]')?.getAttribute('aria-current')).toBe('page');
    });

    it('does not have aria-current when not provided', async () => {
      const doc = await renderLink({ href: '#' });
      expect(doc.querySelector('[role="link"]')?.hasAttribute('aria-current')).toBe(false);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('applies a custom class alongside apg-link on the span', async () => {
      const doc = await renderLink({ href: '#', class: 'custom-class' });
      expect(doc.querySelector('[role="link"]')?.className).toBe('apg-link custom-class');
    });
  });
});
