/**
 * Button Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Button.astro.
 * Web Component behavior (click, Space/Enter activation, disabled handling,
 * IME composition and the button-activate event) is covered by E2E tests
 * in e2e/button.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Button from './Button.astro';

describe('Button (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderButton(
    props: Record<string, unknown> = {},
    label = 'Click me'
  ): Promise<Document> {
    const html = await container.renderToString(Button, {
      props,
      slots: { default: label },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-button custom element wrapper', async () => {
      const doc = await renderButton();
      expect(doc.querySelector('apg-button')).not.toBeNull();
    });

    it('renders a span with role="button"', async () => {
      const doc = await renderButton();
      const button = doc.querySelector('[role="button"]');
      expect(button?.tagName).toBe('SPAN');
    });

    it('renders the slot content as the accessible name', async () => {
      const doc = await renderButton({}, 'Submit Form');
      const button = doc.querySelector('[role="button"]');
      expect(button?.textContent?.trim()).toBe('Submit Form');
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('does not have aria-pressed (not a toggle button)', async () => {
      const doc = await renderButton();
      const button = doc.querySelector('[role="button"]');
      expect(button?.hasAttribute('aria-pressed')).toBe(false);
    });

    it('has aria-disabled="true" when disabled', async () => {
      const doc = await renderButton({ disabled: true });
      const button = doc.querySelector('[role="button"]');
      expect(button?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-disabled when not disabled', async () => {
      const doc = await renderButton();
      const button = doc.querySelector('[role="button"]');
      expect(button?.hasAttribute('aria-disabled')).toBe(false);
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" by default', async () => {
      const doc = await renderButton();
      const button = doc.querySelector('[role="button"]');
      expect(button?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" when disabled', async () => {
      const doc = await renderButton({ disabled: true });
      const button = doc.querySelector('[role="button"]');
      expect(button?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('has the apg-button class', async () => {
      const doc = await renderButton();
      const button = doc.querySelector('[role="button"]');
      expect(button?.getAttribute('class')).toBe('apg-button');
    });

    it('applies a custom class alongside apg-button', async () => {
      const doc = await renderButton({ class: 'custom-class' });
      const button = doc.querySelector('[role="button"]');
      expect(button?.getAttribute('class')).toBe('apg-button custom-class');
    });
  });
});
