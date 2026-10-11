/**
 * Meter Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Meter.astro.
 * Web Component behavior (the updateValue method and the valuechange event)
 * is covered by E2E tests in e2e/meter.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Meter from './Meter.astro';

describe('Meter (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderMeter(props: Record<string, unknown>): Promise<Document> {
    const html = await container.renderToString(Meter, { props });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-meter custom element wrapper', async () => {
      const doc = await renderMeter({ value: 50, 'aria-label': 'Progress' });
      expect(doc.querySelector('apg-meter')).not.toBeNull();
    });

    it('stores min, max and clamp as data attributes for the Web Component', async () => {
      const doc = await renderMeter({
        value: 50,
        min: 10,
        max: 200,
        clamp: false,
        'aria-label': 'Progress',
      });
      const wrapper = doc.querySelector('apg-meter');
      expect(wrapper?.getAttribute('data-min')).toBe('10');
      expect(wrapper?.getAttribute('data-max')).toBe('200');
      expect(wrapper?.getAttribute('data-clamp')).toBe('false');
    });

    it('stores format as a data attribute for the Web Component', async () => {
      const doc = await renderMeter({ value: 50, format: '{value}%', 'aria-label': 'Progress' });
      expect(doc.querySelector('apg-meter')?.getAttribute('data-format')).toBe('{value}%');
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="meter"', async () => {
      const doc = await renderMeter({ value: 50, 'aria-label': 'Progress' });
      expect(doc.querySelector('[role="meter"]')).not.toBeNull();
    });

    it('has aria-valuenow set to current value', async () => {
      const doc = await renderMeter({ value: 75, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('75');
    });

    it('has aria-valuemin="0" when min is not provided', async () => {
      const doc = await renderMeter({ value: 50, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuemin')).toBe('0');
    });

    it('has aria-valuemin set to min', async () => {
      const doc = await renderMeter({ value: 50, min: 10, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuemin')).toBe('10');
    });

    it('has aria-valuemax="100" when max is not provided', async () => {
      const doc = await renderMeter({ value: 50, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuemax')).toBe('100');
    });

    it('has aria-valuemax set to max', async () => {
      const doc = await renderMeter({ value: 50, max: 200, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuemax')).toBe('200');
    });

    it('has aria-valuetext when valueText is provided', async () => {
      const doc = await renderMeter({
        value: 75,
        valueText: '75 percent complete',
        'aria-label': 'Progress',
      });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuetext')).toBe('75 percent complete');
    });

    it('has aria-valuetext built from format with value, min and max', async () => {
      const doc = await renderMeter({
        value: 3.5,
        min: 0,
        max: 5,
        format: '{value} / {max}',
        'aria-label': 'Rating',
      });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuetext')).toBe('3.5 / 5');
    });

    it('prefers valueText over format for aria-valuetext', async () => {
      const doc = await renderMeter({
        value: 75,
        valueText: 'Three quarters',
        format: '{value}%',
        'aria-label': 'Progress',
      });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuetext')).toBe('Three quarters');
    });

    it('does not have aria-valuetext when neither valueText nor format is provided', async () => {
      const doc = await renderMeter({ value: 50, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.hasAttribute('aria-valuetext')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', async () => {
      const doc = await renderMeter({ value: 50, 'aria-label': 'CPU Usage' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-label')).toBe('CPU Usage');
    });

    it('has accessible name via aria-labelledby', async () => {
      const doc = await renderMeter({ value: 50, 'aria-labelledby': 'meter-label' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-labelledby')).toBe('meter-label');
    });

    it('uses the visible label as aria-label', async () => {
      const doc = await renderMeter({ value: 50, label: 'Storage Used' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-label')).toBe('Storage Used');
    });

    it('has aria-describedby when provided', async () => {
      const doc = await renderMeter({
        value: 50,
        'aria-label': 'Progress',
        'aria-describedby': 'meter-help',
      });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-describedby')).toBe('meter-help');
    });
  });

  // 🔴 High Priority: Value Clamping
  describe('Value Clamping', () => {
    it('clamps value above max to max', async () => {
      const doc = await renderMeter({ value: 150, min: 0, max: 100, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('100');
    });

    it('clamps value below min to min', async () => {
      const doc = await renderMeter({ value: -50, min: 0, max: 100, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('does not clamp when clamp is false', async () => {
      const doc = await renderMeter({
        value: 150,
        min: 0,
        max: 100,
        clamp: false,
        'aria-label': 'Progress',
      });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('150');
    });
  });

  // 🔴 High Priority: Focus Behavior
  describe('Focus Behavior', () => {
    it('is not focusable (no tabindex)', async () => {
      const doc = await renderMeter({ value: 50, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.hasAttribute('tabindex')).toBe(false);
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('renders decimal values as-is', async () => {
      const doc = await renderMeter({ value: 33.33, 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('33.33');
    });

    it('renders a negative min/max range', async () => {
      const doc = await renderMeter({ value: 0, min: -50, max: 50, 'aria-label': 'Temperature' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('0');
      expect(meter?.getAttribute('aria-valuemin')).toBe('-50');
      expect(meter?.getAttribute('aria-valuemax')).toBe('50');
    });

    it('renders 0% fill width when min equals max', async () => {
      const doc = await renderMeter({ value: 10, min: 10, max: 10, 'aria-label': 'Progress' });
      const fill = doc.querySelector<HTMLElement>('.apg-meter-fill');
      expect(fill?.style.width).toBe('0%');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows the value when showValue is not specified', async () => {
      const doc = await renderMeter({ value: 75, 'aria-label': 'Progress' });
      expect(doc.querySelector('.apg-meter-value')?.textContent?.trim()).toBe('75');
    });

    it('shows the formatted value when format is provided', async () => {
      const doc = await renderMeter({ value: 75, format: '{value}%', 'aria-label': 'Progress' });
      expect(doc.querySelector('.apg-meter-value')?.textContent?.trim()).toBe('75%');
    });

    it('shows valueText instead of the raw value when valueText is provided', async () => {
      const doc = await renderMeter({
        value: -10,
        valueText: '-10°C',
        'aria-label': 'Temperature',
      });
      expect(doc.querySelector('.apg-meter-value')?.textContent?.trim()).toBe('-10°C');
    });

    it('does not render the value display when showValue is false', async () => {
      const doc = await renderMeter({ value: 75, showValue: false, 'aria-label': 'Progress' });
      expect(doc.querySelector('.apg-meter-value')).toBeNull();
    });

    it('displays the visible label when label is provided', async () => {
      const doc = await renderMeter({ value: 50, label: 'CPU Usage' });
      expect(doc.querySelector('.apg-meter-label')?.textContent?.trim()).toBe('CPU Usage');
    });

    it('hides the visual label, track and value from assistive technology', async () => {
      const doc = await renderMeter({ value: 50, label: 'CPU Usage' });
      expect(doc.querySelector('.apg-meter-label')?.getAttribute('aria-hidden')).toBe('true');
      expect(doc.querySelector('.apg-meter-track')?.getAttribute('aria-hidden')).toBe('true');
      expect(doc.querySelector('.apg-meter-value')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('has fill width based on value', async () => {
      const doc = await renderMeter({ value: 75, min: 0, max: 100, 'aria-label': 'Progress' });
      const fill = doc.querySelector<HTMLElement>('.apg-meter-fill');
      expect(fill?.style.width).toBe('75%');
    });

    it('has fill width relative to a non-zero min', async () => {
      const doc = await renderMeter({ value: -10, min: -50, max: 50, 'aria-label': 'Temperature' });
      const fill = doc.querySelector<HTMLElement>('.apg-meter-fill');
      expect(fill?.style.width).toBe('40%');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('sets the id attribute on the meter', async () => {
      const doc = await renderMeter({ value: 50, id: 'my-meter', 'aria-label': 'Progress' });
      expect(doc.querySelector('[role="meter"]')?.id).toBe('my-meter');
    });

    it('applies a custom class to the meter', async () => {
      const doc = await renderMeter({ value: 50, class: 'custom-class', 'aria-label': 'Progress' });
      const meter = doc.querySelector('[role="meter"]');
      expect(meter?.classList.contains('apg-meter')).toBe(true);
      expect(meter?.classList.contains('custom-class')).toBe(true);
    });
  });
});
