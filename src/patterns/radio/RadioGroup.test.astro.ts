/**
 * RadioGroup Astro Component Tests using Container API
 *
 * Verifies the RadioGroup.astro initial HTML structure and ARIA attributes.
 * Interaction cases (keyboard navigation, click selection, roving focus updates,
 * onValueChange) are covered by Vue/Svelte unit tests and E2E; the Container API
 * only renders initial HTML.
 *
 * Ported structural/initial-state subset of RadioGroup.test.tsx. Interaction-only
 * React cases are omitted here.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import RadioGroup from './RadioGroup.astro';

const defaultOptions = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
];

const optionsWithDisabled = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'blue', label: 'Blue', value: 'blue', disabled: true },
  { id: 'green', label: 'Green', value: 'green' },
];

describe('RadioGroup (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderGroup(props: Record<string, unknown>): Promise<Document> {
    const html = await container.renderToString(RadioGroup, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  function radioByLabel(doc: Document, label: string): Element | null {
    const radios = Array.from(doc.querySelectorAll('[role="radio"]'));
    return radios.find((r) => r.textContent?.trim().includes(label)) ?? null;
  }

  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="radiogroup" on container', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(doc.querySelector('[role="radiogroup"]')).not.toBeNull();
    });

    it('has role="radio" on each option', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(doc.querySelectorAll('[role="radio"]')).toHaveLength(3);
    });

    it('has aria-checked attribute on radios', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      doc.querySelectorAll('[role="radio"]').forEach((radio) => {
        expect(radio.hasAttribute('aria-checked')).toBe(true);
      });
    });

    it('sets aria-checked="true" on selected radio', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        defaultValue: 'blue',
      });
      expect(radioByLabel(doc, 'Blue')?.getAttribute('aria-checked')).toBe('true');
      expect(radioByLabel(doc, 'Red')?.getAttribute('aria-checked')).toBe('false');
      expect(radioByLabel(doc, 'Green')?.getAttribute('aria-checked')).toBe('false');
    });

    it('sets accessible name on radiogroup via aria-label', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(doc.querySelector('[role="radiogroup"]')?.getAttribute('aria-label')).toBe(
        'Favorite color'
      );
    });

    it('sets accessible name on radiogroup via aria-labelledby', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-labelledby': 'color-label',
      });
      expect(doc.querySelector('[role="radiogroup"]')?.getAttribute('aria-labelledby')).toBe(
        'color-label'
      );
    });

    it('sets aria-disabled="true" on disabled radio', async () => {
      const doc = await renderGroup({
        options: optionsWithDisabled,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(radioByLabel(doc, 'Blue')?.getAttribute('aria-disabled')).toBe('true');
    });

    it('sets aria-orientation="horizontal" only when orientation is horizontal', async () => {
      const horizontal = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        orientation: 'horizontal',
      });
      expect(
        horizontal.querySelector('[role="radiogroup"]')?.getAttribute('aria-orientation')
      ).toBe('horizontal');

      const vertical = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        orientation: 'vertical',
      });
      expect(vertical.querySelector('[role="radiogroup"]')?.hasAttribute('aria-orientation')).toBe(
        false
      );

      const noOrientation = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(
        noOrientation.querySelector('[role="radiogroup"]')?.hasAttribute('aria-orientation')
      ).toBe(false);
    });
  });

  // 🔴 High Priority: Focus Management (Roving Tabindex) - initial render
  describe('Focus Management (Roving Tabindex)', () => {
    it('sets tabindex="0" on selected radio', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        defaultValue: 'blue',
      });
      expect(radioByLabel(doc, 'Blue')?.getAttribute('tabindex')).toBe('0');
    });

    it('sets tabindex="-1" on non-selected radios', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        defaultValue: 'blue',
      });
      expect(radioByLabel(doc, 'Red')?.getAttribute('tabindex')).toBe('-1');
      expect(radioByLabel(doc, 'Green')?.getAttribute('tabindex')).toBe('-1');
    });

    it('sets tabindex="-1" on disabled radios', async () => {
      const doc = await renderGroup({
        options: optionsWithDisabled,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(radioByLabel(doc, 'Blue')?.getAttribute('tabindex')).toBe('-1');
    });

    it('sets tabindex="0" on first enabled radio when none selected', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(radioByLabel(doc, 'Red')?.getAttribute('tabindex')).toBe('0');
      expect(radioByLabel(doc, 'Blue')?.getAttribute('tabindex')).toBe('-1');
      expect(radioByLabel(doc, 'Green')?.getAttribute('tabindex')).toBe('-1');
    });

    it('sets tabindex="0" on first non-disabled radio when first is disabled', async () => {
      const options = [
        { id: 'red', label: 'Red', value: 'red', disabled: true },
        { id: 'blue', label: 'Blue', value: 'blue' },
        { id: 'green', label: 'Green', value: 'green' },
      ];
      const doc = await renderGroup({ options, name: 'color', 'aria-label': 'Favorite color' });
      expect(radioByLabel(doc, 'Red')?.getAttribute('tabindex')).toBe('-1');
      expect(radioByLabel(doc, 'Blue')?.getAttribute('tabindex')).toBe('0');
    });

    it('has only one tabindex="0" in the group', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        defaultValue: 'blue',
      });
      const radios = Array.from(doc.querySelectorAll('[role="radio"]'));
      const tabbable = radios.filter((radio) => radio.getAttribute('tabindex') === '0');
      expect(tabbable).toHaveLength(1);
    });
  });

  // 🟡 Medium Priority: Form Integration
  describe('Form Integration', () => {
    it('has hidden input for form submission', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(doc.querySelector('input[type="hidden"][name="color"]')).not.toBeNull();
    });

    it('hidden input has correct name attribute', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
      });
      expect(doc.querySelector('input[type="hidden"]')?.getAttribute('name')).toBe('color');
    });

    it('hidden input has defaultValue on initial render', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        defaultValue: 'green',
      });
      const hiddenInput = doc.querySelector('input[type="hidden"]') as HTMLInputElement | null;
      expect(hiddenInput?.getAttribute('value')).toBe('green');
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('applies className to container', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        class: 'custom-class',
      });
      expect(doc.querySelector('[role="radiogroup"]')?.classList.contains('custom-class')).toBe(
        true
      );
    });

    it('renders with defaultValue', async () => {
      const doc = await renderGroup({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        defaultValue: 'green',
      });
      expect(radioByLabel(doc, 'Green')?.getAttribute('aria-checked')).toBe('true');
    });
  });
});
