/**
 * Combobox Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Combobox.astro.
 * Dynamic behaviors (popup open/close, filtering, selection, aria-activedescendant)
 * are added at runtime by the Web Component and are covered by E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Combobox from './Combobox.astro';

const sampleOptions = [
  { id: 'opt1', label: 'Apple' },
  { id: 'opt2', label: 'Banana' },
  { id: 'opt3', label: 'Cherry', disabled: true },
];

describe('Combobox (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderCombobox(props: {
    options?: typeof sampleOptions;
    label: string;
    placeholder?: string;
    defaultInputValue?: string;
    defaultSelectedOptionId?: string;
    autocomplete?: 'none' | 'list' | 'both';
    disabled?: boolean;
    noResultsMessage?: string;
    class?: string;
  }): Promise<Document> {
    const html = await container.renderToString(Combobox, {
      props: { options: sampleOptions, ...props },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-combobox custom element wrapper', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      expect(doc.querySelector('apg-combobox')).not.toBeNull();
    });

    it('renders a label element', async () => {
      const doc = await renderCombobox({ label: 'Choose fruit' });
      const label = doc.querySelector('label');
      expect(label).not.toBeNull();
      expect(label?.textContent?.trim()).toBe('Choose fruit');
    });

    it('renders input with role="combobox"', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const input = doc.querySelector('[role="combobox"]');
      expect(input).not.toBeNull();
      expect((input as HTMLInputElement)?.type).toBe('text');
    });

    it('renders listbox with role="listbox"', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      expect(doc.querySelector('[role="listbox"]')).not.toBeNull();
    });

    it('renders one option per item', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const options = doc.querySelectorAll('[role="option"]');
      expect(options.length).toBe(3);
    });
  });

  // 🔴 High Priority: ARIA - Combobox Input
  describe('ARIA on input', () => {
    it('input has aria-expanded="false" initially (listbox is closed)', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const input = doc.querySelector('[role="combobox"]');
      expect(input?.getAttribute('aria-expanded')).toBe('false');
    });

    it('input has aria-controls pointing to listbox id', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const input = doc.querySelector('[role="combobox"]');
      const controlsId = input?.getAttribute('aria-controls');
      expect(controlsId).toBeTruthy();
      const listbox = doc.getElementById(controlsId!);
      expect(listbox?.getAttribute('role')).toBe('listbox');
    });

    it('input has aria-autocomplete attribute', async () => {
      const doc = await renderCombobox({ label: 'Fruit', autocomplete: 'list' });
      const input = doc.querySelector('[role="combobox"]');
      expect(input?.getAttribute('aria-autocomplete')).toBe('list');
    });

    it('input has aria-labelledby pointing to label', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const input = doc.querySelector('[role="combobox"]');
      const labelledbyId = input?.getAttribute('aria-labelledby');
      expect(labelledbyId).toBeTruthy();
      const labelEl = doc.getElementById(labelledbyId!);
      expect(labelEl?.textContent?.trim()).toBe('Fruit');
    });
  });

  // 🔴 High Priority: Listbox hidden initially
  describe('Listbox hidden state', () => {
    it('listbox is hidden initially', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox?.hasAttribute('hidden')).toBe(true);
    });
  });

  // 🟡 Medium Priority: Input value
  describe('Input value', () => {
    it('input has empty value by default', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const input = doc.querySelector<HTMLInputElement>('[role="combobox"]');
      expect(input?.getAttribute('value') ?? '').toBe('');
    });

    it('input has defaultInputValue when provided', async () => {
      const doc = await renderCombobox({ label: 'Fruit', defaultInputValue: 'App' });
      const input = doc.querySelector<HTMLInputElement>('[role="combobox"]');
      expect(input?.getAttribute('value')).toBe('App');
    });

    it('input value uses selected option label when defaultSelectedOptionId is provided', async () => {
      const doc = await renderCombobox({ label: 'Fruit', defaultSelectedOptionId: 'opt2' });
      const input = doc.querySelector<HTMLInputElement>('[role="combobox"]');
      expect(input?.getAttribute('value')).toBe('Banana');
    });
  });

  // 🟡 Medium Priority: Disabled option
  describe('Disabled option', () => {
    it('disabled option has aria-disabled="true"', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const options = doc.querySelectorAll<HTMLElement>('[role="option"]');
      // opt3 is disabled
      expect(options[2]?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  // 🟡 Medium Priority: Disabled input
  describe('Disabled input', () => {
    it('input is disabled when disabled prop is true', async () => {
      const doc = await renderCombobox({ label: 'Fruit', disabled: true });
      const input = doc.querySelector<HTMLInputElement>('[role="combobox"]');
      expect(input?.hasAttribute('disabled')).toBe(true);
    });
  });

  // 🟡 Medium Priority: Label-input association
  describe('Label-input association', () => {
    it('label for attribute matches input id', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const label = doc.querySelector('label');
      const input = doc.querySelector<HTMLInputElement>('[role="combobox"]');
      const labelFor = label?.getAttribute('for');
      const inputId = input?.getAttribute('id');
      expect(labelFor).toBeTruthy();
      expect(labelFor).toBe(inputId);
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('input has apg-combobox-input class', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const input = doc.querySelector('[role="combobox"]');
      expect(input?.classList.contains('apg-combobox-input')).toBe(true);
    });

    it('listbox has apg-combobox-listbox class', async () => {
      const doc = await renderCombobox({ label: 'Fruit' });
      const listbox = doc.querySelector('[role="listbox"]');
      expect(listbox?.classList.contains('apg-combobox-listbox')).toBe(true);
    });
  });
});
