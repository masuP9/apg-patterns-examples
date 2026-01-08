/**
 * Checkbox Astro Component Tests using Container API
 *
 * These tests verify the actual Checkbox.astro component output using Astro's Container API.
 * This ensures the component renders correct HTML structure and attributes.
 *
 * Note: Web Component behavior tests (click interaction, event dispatching) require
 * E2E testing with Playwright as they need a real browser environment.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Checkbox from './Checkbox.astro';

describe('Checkbox (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  // Helper to render and parse HTML
  async function renderCheckbox(props: {
    initialChecked?: boolean;
    indeterminate?: boolean;
    disabled?: boolean;
    name?: string;
    value?: string;
    id?: string;
    class?: string;
  } = {}): Promise<Document> {
    const html = await container.renderToString(Checkbox, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-checkbox custom element wrapper', async () => {
      const doc = await renderCheckbox();
      const wrapper = doc.querySelector('apg-checkbox');
      expect(wrapper).not.toBeNull();
    });

    it('renders input with type="checkbox"', async () => {
      const doc = await renderCheckbox();
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input).not.toBeNull();
    });

    it('renders checkbox control span with aria-hidden', async () => {
      const doc = await renderCheckbox();
      const control = doc.querySelector('.apg-checkbox-control');
      expect(control).not.toBeNull();
      expect(control?.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders check icon inside control', async () => {
      const doc = await renderCheckbox();
      const checkIcon = doc.querySelector('.apg-checkbox-icon--check');
      expect(checkIcon).not.toBeNull();
      expect(checkIcon?.querySelector('svg')).not.toBeNull();
    });

    it('renders indeterminate icon inside control', async () => {
      const doc = await renderCheckbox();
      const indeterminateIcon = doc.querySelector('.apg-checkbox-icon--indeterminate');
      expect(indeterminateIcon).not.toBeNull();
      expect(indeterminateIcon?.querySelector('svg')).not.toBeNull();
    });
  });

  // 🔴 High Priority: Checked State
  describe('Checked State', () => {
    it('renders unchecked by default', async () => {
      const doc = await renderCheckbox();
      const input = doc.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
      expect(input?.hasAttribute('checked')).toBe(false);
    });

    it('renders checked when initialChecked is true', async () => {
      const doc = await renderCheckbox({ initialChecked: true });
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.hasAttribute('checked')).toBe(true);
    });
  });

  // 🔴 High Priority: Disabled State
  describe('Disabled State', () => {
    it('renders without disabled attribute by default', async () => {
      const doc = await renderCheckbox();
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.hasAttribute('disabled')).toBe(false);
    });

    it('renders with disabled attribute when disabled is true', async () => {
      const doc = await renderCheckbox({ disabled: true });
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.hasAttribute('disabled')).toBe(true);
    });
  });

  // 🟡 Medium Priority: Indeterminate State
  describe('Indeterminate State', () => {
    it('does not have data-indeterminate by default', async () => {
      const doc = await renderCheckbox();
      const wrapper = doc.querySelector('apg-checkbox');
      expect(wrapper?.hasAttribute('data-indeterminate')).toBe(false);
    });

    it('has data-indeterminate="true" when indeterminate is true', async () => {
      const doc = await renderCheckbox({ indeterminate: true });
      const wrapper = doc.querySelector('apg-checkbox');
      expect(wrapper?.getAttribute('data-indeterminate')).toBe('true');
    });
  });

  // 🟡 Medium Priority: Form Integration
  describe('Form Integration', () => {
    it('renders without name attribute by default', async () => {
      const doc = await renderCheckbox();
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.hasAttribute('name')).toBe(false);
    });

    it('renders with name attribute when provided', async () => {
      const doc = await renderCheckbox({ name: 'terms' });
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.getAttribute('name')).toBe('terms');
    });

    it('renders without value attribute by default', async () => {
      const doc = await renderCheckbox();
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.hasAttribute('value')).toBe(false);
    });

    it('renders with value attribute when provided', async () => {
      const doc = await renderCheckbox({ value: 'accepted' });
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.getAttribute('value')).toBe('accepted');
    });
  });

  // 🟡 Medium Priority: Label Association
  describe('Label Association', () => {
    it('renders without id attribute by default', async () => {
      const doc = await renderCheckbox();
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.hasAttribute('id')).toBe(false);
    });

    it('renders with id attribute when provided for external label association', async () => {
      const doc = await renderCheckbox({ id: 'my-checkbox' });
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.getAttribute('id')).toBe('my-checkbox');
    });
  });

  // 🟢 Low Priority: CSS Classes
  describe('CSS Classes', () => {
    it('has default apg-checkbox class on wrapper', async () => {
      const doc = await renderCheckbox();
      const wrapper = doc.querySelector('apg-checkbox');
      expect(wrapper?.classList.contains('apg-checkbox')).toBe(true);
    });

    it('has apg-checkbox-input class on input', async () => {
      const doc = await renderCheckbox();
      const input = doc.querySelector('input');
      expect(input?.classList.contains('apg-checkbox-input')).toBe(true);
    });

    it('appends custom class to wrapper', async () => {
      const doc = await renderCheckbox({ class: 'custom-class' });
      const wrapper = doc.querySelector('apg-checkbox');
      expect(wrapper?.classList.contains('apg-checkbox')).toBe(true);
      expect(wrapper?.classList.contains('custom-class')).toBe(true);
    });
  });

  // 🟢 Low Priority: Combined States
  describe('Combined States', () => {
    it('renders checked and disabled together', async () => {
      const doc = await renderCheckbox({ initialChecked: true, disabled: true });
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.hasAttribute('checked')).toBe(true);
      expect(input?.hasAttribute('disabled')).toBe(true);
    });

    it('renders with all form attributes', async () => {
      const doc = await renderCheckbox({
        id: 'terms-checkbox',
        name: 'terms',
        value: 'accepted',
        initialChecked: true,
      });
      const input = doc.querySelector('input[type="checkbox"]');
      expect(input?.getAttribute('id')).toBe('terms-checkbox');
      expect(input?.getAttribute('name')).toBe('terms');
      expect(input?.getAttribute('value')).toBe('accepted');
      expect(input?.hasAttribute('checked')).toBe(true);
    });
  });
});
