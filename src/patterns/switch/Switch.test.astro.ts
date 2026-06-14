/**
 * Switch Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Switch.astro.
 * Web Component behavior (click/keyboard toggle) is covered by E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Switch from './Switch.astro';

describe('Switch (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderSwitch(
    props: {
      initialChecked?: boolean;
      disabled?: boolean;
      class?: string;
    } = {}
  ): Promise<Document> {
    const html = await container.renderToString(Switch, { props });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-switch custom element wrapper', async () => {
      const doc = await renderSwitch();
      expect(doc.querySelector('apg-switch')).not.toBeNull();
    });

    it('renders button with role="switch"', async () => {
      const doc = await renderSwitch();
      const btn = doc.querySelector('button[role="switch"]');
      expect(btn).not.toBeNull();
    });

    it('renders track and thumb inside the button', async () => {
      const doc = await renderSwitch();
      expect(doc.querySelector('.apg-switch-track')).not.toBeNull();
      expect(doc.querySelector('.apg-switch-thumb')).not.toBeNull();
    });
  });

  // 🔴 High Priority: ARIA - Checked State
  describe('aria-checked', () => {
    it('has aria-checked="false" by default', async () => {
      const doc = await renderSwitch();
      const btn = doc.querySelector('button[role="switch"]');
      expect(btn?.getAttribute('aria-checked')).toBe('false');
    });

    it('has aria-checked="true" when initialChecked is true', async () => {
      const doc = await renderSwitch({ initialChecked: true });
      const btn = doc.querySelector('button[role="switch"]');
      expect(btn?.getAttribute('aria-checked')).toBe('true');
    });
  });

  // 🔴 High Priority: Disabled State
  describe('Disabled State', () => {
    it('is not disabled by default', async () => {
      const doc = await renderSwitch();
      const btn = doc.querySelector('button[role="switch"]');
      expect(btn?.hasAttribute('disabled')).toBe(false);
    });

    it('has disabled attribute when disabled is true', async () => {
      const doc = await renderSwitch({ disabled: true });
      const btn = doc.querySelector('button[role="switch"]');
      expect(btn?.hasAttribute('disabled')).toBe(true);
    });

    it('has aria-disabled="true" when disabled', async () => {
      const doc = await renderSwitch({ disabled: true });
      const btn = doc.querySelector('button[role="switch"]');
      expect(btn?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('has apg-switch class on the button', async () => {
      const doc = await renderSwitch();
      const btn = doc.querySelector('button');
      expect(btn?.classList.contains('apg-switch')).toBe(true);
    });

    it('appends custom class to wrapper', async () => {
      const doc = await renderSwitch({ class: 'my-switch' });
      const wrapper = doc.querySelector('apg-switch');
      expect(wrapper?.classList.contains('my-switch')).toBe(true);
    });
  });

  // 🟢 Low Priority: Combined States
  describe('Combined States', () => {
    it('renders checked and disabled together', async () => {
      const doc = await renderSwitch({ initialChecked: true, disabled: true });
      const btn = doc.querySelector('button[role="switch"]');
      expect(btn?.getAttribute('aria-checked')).toBe('true');
      expect(btn?.hasAttribute('disabled')).toBe(true);
    });
  });
});
