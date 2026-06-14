/**
 * MultiThumbSlider Astro Component Tests using Container API
 *
 * Verifies the MultiThumbSlider.astro initial HTML structure and ARIA attributes.
 * Interaction cases (keyboard, pointer, focus, callbacks) are covered by Vue/Svelte
 * unit tests and E2E; the Container API only renders initial HTML.
 *
 * Astro API differs from React: per-thumb labels are `aria-label-lower` /
 * `aria-label-upper` (not a tuple), `aria-labelledby-lower` / `aria-labelledby-upper`,
 * and `aria-describedby` is a single shared id (not a per-thumb tuple). The Astro
 * component also has no function props (`getAriaLabel`, `getAriaValueText`).
 *
 * Ported structural/initial-state subset of MultiThumbSlider.test.tsx. Omitted React
 * cases (no Astro analogue or interaction-only):
 * - 'has accessible name via getAriaLabel function' (no function prop in Astro)
 * - 'sets aria-valuetext with getAriaValueText' (no function prop in Astro)
 * - 'supports aria-describedby as tuple' (Astro `aria-describedby` is a single shared id)
 * - all keyboard/pointer/Tab interaction cases (Container API renders initial HTML only)
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import MultiThumbSlider from './MultiThumbSlider.astro';

describe('MultiThumbSlider (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderSlider(props: Record<string, unknown> = {}): Promise<Document> {
    const html = await container.renderToString(MultiThumbSlider, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  const labels = { 'aria-label-lower': 'Min', 'aria-label-upper': 'Max' };

  function sliders(doc: Document): Element[] {
    return Array.from(doc.querySelectorAll('[role="slider"]'));
  }

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has two elements with role="slider"', async () => {
      const doc = await renderSlider({ ...labels });
      expect(sliders(doc)).toHaveLength(2);
    });

    it('has aria-valuenow set on each thumb', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuenow')).toBe('20');
      expect(upperThumb.getAttribute('aria-valuenow')).toBe('80');
    });

    it('has correct static aria-valuemin/max on lower thumb', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], min: 0, max: 100, ...labels });
      const [lowerThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuemin')).toBe('0');
      expect(lowerThumb.getAttribute('aria-valuemax')).toBe('80');
    });

    it('has correct dynamic aria-valuemin/max on upper thumb', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], min: 0, max: 100, ...labels });
      const [, upperThumb] = sliders(doc);
      expect(upperThumb.getAttribute('aria-valuemin')).toBe('20');
      expect(upperThumb.getAttribute('aria-valuemax')).toBe('100');
    });

    it('applies minDistance to dynamic bounds', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], minDistance: 10, ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuemax')).toBe('70');
      expect(upperThumb.getAttribute('aria-valuemin')).toBe('30');
    });

    it('has aria-disabled="true" when disabled', async () => {
      const doc = await renderSlider({ disabled: true, ...labels });
      sliders(doc).forEach((slider) => {
        expect(slider.getAttribute('aria-disabled')).toBe('true');
      });
    });

    it('does not have aria-disabled when not disabled', async () => {
      const doc = await renderSlider({ ...labels });
      sliders(doc).forEach((slider) => {
        expect(slider.hasAttribute('aria-disabled')).toBe(false);
      });
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label tuple', async () => {
      const doc = await renderSlider({
        'aria-label-lower': 'Minimum Price',
        'aria-label-upper': 'Maximum Price',
      });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-label')).toBe('Minimum Price');
      expect(upperThumb.getAttribute('aria-label')).toBe('Maximum Price');
    });

    it('has accessible name via aria-labelledby tuple', async () => {
      const doc = await renderSlider({
        'aria-labelledby-lower': 'min-label',
        'aria-labelledby-upper': 'max-label',
      });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-labelledby')).toBe('min-label');
      expect(upperThumb.getAttribute('aria-labelledby')).toBe('max-label');
    });
  });

  // 🔴 High Priority: Focus Management (initial render)
  describe('Focus Management', () => {
    it('both thumbs have tabindex="0"', async () => {
      const doc = await renderSlider({ ...labels });
      sliders(doc).forEach((slider) => {
        expect(slider.getAttribute('tabindex')).toBe('0');
      });
    });

    it('thumbs have tabindex="-1" when disabled', async () => {
      const doc = await renderSlider({ disabled: true, ...labels });
      sliders(doc).forEach((slider) => {
        expect(slider.getAttribute('tabindex')).toBe('-1');
      });
    });
  });

  // 🔴 High Priority: Orientation
  describe('Orientation', () => {
    it('does not have aria-orientation for horizontal slider', async () => {
      const doc = await renderSlider({ orientation: 'horizontal', ...labels });
      sliders(doc).forEach((slider) => {
        expect(slider.hasAttribute('aria-orientation')).toBe(false);
      });
    });

    it('has aria-orientation="vertical" for vertical slider', async () => {
      const doc = await renderSlider({ orientation: 'vertical', ...labels });
      sliders(doc).forEach((slider) => {
        expect(slider.getAttribute('aria-orientation')).toBe('vertical');
      });
    });
  });

  // 🔴 High Priority: Value Text
  describe('Value Text', () => {
    it('sets aria-valuetext with format', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], format: '${value}', ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuetext')).toBe('$20');
      expect(upperThumb.getAttribute('aria-valuetext')).toBe('$80');
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles negative min/max range', async () => {
      const doc = await renderSlider({ defaultValue: [-30, 30], min: -50, max: 50, ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuenow')).toBe('-30');
      expect(upperThumb.getAttribute('aria-valuenow')).toBe('30');
      expect(lowerThumb.getAttribute('aria-valuemin')).toBe('-50');
      expect(upperThumb.getAttribute('aria-valuemax')).toBe('50');
    });

    it('normalizes invalid defaultValue (lower > upper)', async () => {
      const doc = await renderSlider({ defaultValue: [80, 20], ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      const lowerValue = Number(lowerThumb.getAttribute('aria-valuenow'));
      const upperValue = Number(upperThumb.getAttribute('aria-valuenow'));
      expect(lowerValue).toBeLessThanOrEqual(upperValue);
    });

    it('clamps defaultValue to min/max', async () => {
      const doc = await renderSlider({ defaultValue: [-10, 150], min: 0, max: 100, ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuenow')).toBe('0');
      expect(upperThumb.getAttribute('aria-valuenow')).toBe('100');
    });

    it('rounds values to step', async () => {
      const doc = await renderSlider({ defaultValue: [23, 77], step: 5, ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuenow')).toBe('25');
      expect(upperThumb.getAttribute('aria-valuenow')).toBe('75');
    });

    it('uses default values when not provided', async () => {
      const doc = await renderSlider({ ...labels });
      const [lowerThumb, upperThumb] = sliders(doc);
      expect(lowerThumb.getAttribute('aria-valuenow')).toBe('0');
      expect(upperThumb.getAttribute('aria-valuenow')).toBe('100');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows values when showValues is true (default)', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], ...labels });
      const values = doc.querySelector('.apg-slider-multithumb-values');
      expect(values?.textContent).toContain('20');
      expect(values?.textContent).toContain('80');
    });

    it('hides values when showValues is false', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], showValues: false, ...labels });
      expect(doc.querySelector('.apg-slider-multithumb-values')).toBeNull();
    });

    it('displays formatted values when format provided', async () => {
      const doc = await renderSlider({ defaultValue: [20, 80], format: '${value}', ...labels });
      const values = doc.querySelector('.apg-slider-multithumb-values');
      expect(values?.textContent).toContain('$20');
      expect(values?.textContent).toContain('$80');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', async () => {
      const doc = await renderSlider({ ...labels, class: 'custom-slider' });
      const containerEl = doc.querySelector('.apg-slider-multithumb');
      expect(containerEl?.classList.contains('custom-slider')).toBe(true);
    });

    it('sets id attribute on container', async () => {
      const doc = await renderSlider({ ...labels, id: 'my-slider' });
      const containerEl = doc.querySelector('.apg-slider-multithumb');
      expect(containerEl?.getAttribute('id')).toBe('my-slider');
    });

    it('passes through data-testid', async () => {
      const doc = await renderSlider({ ...labels, 'data-testid': 'custom-slider' });
      expect(doc.querySelector('[data-testid="custom-slider"]')).not.toBeNull();
    });

    it('supports aria-describedby as string', async () => {
      const doc = await renderSlider({ ...labels, 'aria-describedby': 'desc' });
      sliders(doc).forEach((slider) => {
        expect(slider.getAttribute('aria-describedby')).toBe('desc');
      });
    });
  });

  // 🟢 Low Priority: Group Labeling
  describe('Group Labeling', () => {
    it('has role="group" on container', async () => {
      const doc = await renderSlider({ ...labels, label: 'Price Range' });
      expect(doc.querySelector('[role="group"]')).not.toBeNull();
    });

    it('group has accessible name via label prop', async () => {
      const doc = await renderSlider({ ...labels, label: 'Price Range' });
      const group = doc.querySelector('[role="group"]');
      const labelledby = group?.getAttribute('aria-labelledby');
      expect(labelledby).toBeTruthy();
      expect(doc.getElementById(labelledby!)?.textContent?.trim()).toBe('Price Range');
    });
  });
});
