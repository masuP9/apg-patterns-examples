/**
 * Spinbutton Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Spinbutton.astro.
 * Web Component behavior (keyboard, buttons, text input, IME composition,
 * value announcement and the valuechange event) is covered by E2E tests
 * in e2e/spinbutton.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Spinbutton from './Spinbutton.astro';

describe('Spinbutton (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderSpinbutton(props: Record<string, unknown> = {}): Promise<Document> {
    const html = await container.renderToString(Spinbutton, { props });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-spinbutton custom element wrapper', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      expect(doc.querySelector('apg-spinbutton')).not.toBeNull();
    });

    it('renders a text input with role="spinbutton"', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('input[role="spinbutton"]');
      expect(input?.getAttribute('type')).toBe('text');
    });

    it('has inputmode="numeric" for mobile keyboards', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('inputmode')).toBe('numeric');
    });

    it('renders the initial value in the input', async () => {
      const doc = await renderSpinbutton({ defaultValue: 5, 'aria-label': 'Quantity' });
      const input = doc.querySelector<HTMLInputElement>('[role="spinbutton"]');
      expect(input?.value).toBe('5');
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has aria-valuenow="0" when no defaultValue is given', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('has aria-valuenow set to defaultValue', async () => {
      const doc = await renderSpinbutton({ defaultValue: 5, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuenow')).toBe('5');
    });

    it('has aria-valuemin when min is provided', async () => {
      const doc = await renderSpinbutton({ min: 0, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuemin')).toBe('0');
    });

    it('does not have aria-valuemin when min is not provided', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.hasAttribute('aria-valuemin')).toBe(false);
    });

    it('has aria-valuemax when max is provided', async () => {
      const doc = await renderSpinbutton({ max: 100, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuemax')).toBe('100');
    });

    it('does not have aria-valuemax when max is not provided', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.hasAttribute('aria-valuemax')).toBe(false);
    });

    it('has aria-valuetext when valueText is provided', async () => {
      const doc = await renderSpinbutton({ valueText: '5 items', 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuetext')).toBe('5 items');
    });

    it('has aria-valuetext built from format with value, min and max', async () => {
      const doc = await renderSpinbutton({
        defaultValue: 3,
        min: 1,
        max: 10,
        format: '{value} of {max}',
        'aria-label': 'Rating',
      });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuetext')).toBe('3 of 10');
    });

    it('does not have aria-valuetext when neither valueText nor format is provided', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.hasAttribute('aria-valuetext')).toBe(false);
    });

    it('has aria-disabled="true" when disabled', async () => {
      const doc = await renderSpinbutton({ disabled: true, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-disabled when not disabled', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.hasAttribute('aria-disabled')).toBe(false);
    });

    it('has aria-readonly="true" and the readonly attribute when read-only', async () => {
      const doc = await renderSpinbutton({ readOnly: true, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-readonly')).toBe('true');
      expect(input?.hasAttribute('readonly')).toBe(true);
    });

    it('does not have aria-readonly when not read-only', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.hasAttribute('aria-readonly')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has aria-label when provided', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-label')).toBe('Quantity');
    });

    it('has aria-labelledby when provided', async () => {
      const doc = await renderSpinbutton({ 'aria-labelledby': 'external-label' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-labelledby')).toBe('external-label');
    });

    it('references the visible label via aria-labelledby when label is provided', async () => {
      const doc = await renderSpinbutton({ label: 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      const labelId = input?.getAttribute('aria-labelledby') ?? '';
      expect(doc.getElementById(labelId)?.textContent?.trim()).toBe('Quantity');
    });

    it('does not set aria-label when a visible label is provided', async () => {
      const doc = await renderSpinbutton({ label: 'Quantity', 'aria-label': 'Ignored' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.hasAttribute('aria-label')).toBe(false);
    });

    it('has aria-describedby when provided', async () => {
      const doc = await renderSpinbutton({
        'aria-label': 'Quantity',
        'aria-describedby': 'quantity-help',
      });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-describedby')).toBe('quantity-help');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on the input', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" on the input when disabled', async () => {
      const doc = await renderSpinbutton({ disabled: true, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('tabindex')).toBe('-1');
    });

    it('has tabindex="-1" on the increment and decrement buttons', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      expect(doc.querySelector('.apg-spinbutton-increment')?.getAttribute('tabindex')).toBe('-1');
      expect(doc.querySelector('.apg-spinbutton-decrement')?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟡 Medium Priority: Buttons
  describe('Buttons', () => {
    it('renders increment and decrement buttons with accessible labels by default', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      expect(doc.querySelector('.apg-spinbutton-increment')?.getAttribute('aria-label')).toBe(
        'Increment'
      );
      expect(doc.querySelector('.apg-spinbutton-decrement')?.getAttribute('aria-label')).toBe(
        'Decrement'
      );
    });

    it('does not render buttons when showButtons is false', async () => {
      const doc = await renderSpinbutton({ showButtons: false, 'aria-label': 'Quantity' });
      expect(doc.querySelector('.apg-spinbutton-increment')).toBeNull();
      expect(doc.querySelector('.apg-spinbutton-decrement')).toBeNull();
    });

    it('renders disabled buttons when disabled', async () => {
      const doc = await renderSpinbutton({ disabled: true, 'aria-label': 'Quantity' });
      expect(doc.querySelector('.apg-spinbutton-increment')?.hasAttribute('disabled')).toBe(true);
      expect(doc.querySelector('.apg-spinbutton-decrement')?.hasAttribute('disabled')).toBe(true);
    });
  });

  // 🔴 High Priority: Live Region (fallback for ariaNotify)
  describe('Live Region', () => {
    it('renders an empty role="status" live region when buttons are shown', async () => {
      const doc = await renderSpinbutton({ 'aria-label': 'Quantity' });
      const liveRegion = doc.querySelector('[role="status"]');
      expect(liveRegion?.textContent).toBe('');
    });

    it('does not render the live region when showButtons is false', async () => {
      const doc = await renderSpinbutton({ showButtons: false, 'aria-label': 'Quantity' });
      expect(doc.querySelector('[role="status"]')).toBeNull();
    });
  });

  // 🟡 Medium Priority: Initial Value Normalization
  describe('Initial Value Normalization', () => {
    it('clamps defaultValue above max to max', async () => {
      const doc = await renderSpinbutton({ defaultValue: 150, max: 100, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuenow')).toBe('100');
    });

    it('clamps defaultValue below min to min', async () => {
      const doc = await renderSpinbutton({ defaultValue: -10, min: 0, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('rounds defaultValue to the nearest step', async () => {
      const doc = await renderSpinbutton({ defaultValue: 7, step: 5, 'aria-label': 'Quantity' });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuenow')).toBe('5');
    });

    it('rounds a decimal defaultValue without floating-point error', async () => {
      const doc = await renderSpinbutton({
        defaultValue: 0.1 + 0.2,
        step: 0.1,
        'aria-label': 'Opacity',
      });
      const input = doc.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('aria-valuenow')).toBe('0.3');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('sets the id attribute on the input', async () => {
      const doc = await renderSpinbutton({ id: 'quantity', 'aria-label': 'Quantity' });
      expect(doc.querySelector('[role="spinbutton"]')?.id).toBe('quantity');
    });

    it('applies a custom class to the container', async () => {
      const doc = await renderSpinbutton({ class: 'custom-class', 'aria-label': 'Quantity' });
      expect(doc.querySelector('.apg-spinbutton')?.classList.contains('custom-class')).toBe(true);
    });

    it('sets data-testid on the input', async () => {
      const doc = await renderSpinbutton({ 'data-testid': 'qty', 'aria-label': 'Quantity' });
      expect(doc.querySelector('[role="spinbutton"]')?.getAttribute('data-testid')).toBe('qty');
    });
  });
});
