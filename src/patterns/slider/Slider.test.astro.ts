/**
 * Slider Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Slider.astro.
 * Web Component behavior (keyboard, pointer, value/valuetext updates and the
 * valuechange event) is covered by E2E tests in e2e/slider.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Slider from './Slider.astro';

describe('Slider (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderSlider(props: Record<string, unknown> = {}): Promise<Document> {
    const html = await container.renderToString(Slider, { props });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-slider custom element wrapper', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume' });
      expect(doc.querySelector('apg-slider')).not.toBeNull();
    });

    it('passes range settings to the Web Component via data attributes', async () => {
      const doc = await renderSlider({ min: 10, max: 50, step: 2, 'aria-label': 'Volume' });
      const element = doc.querySelector('apg-slider');
      expect(element?.getAttribute('data-min')).toBe('10');
      expect(element?.getAttribute('data-max')).toBe('50');
      expect(element?.getAttribute('data-step')).toBe('2');
    });

    it('sets data-large-step to step * 10 when largeStep is not provided', async () => {
      const doc = await renderSlider({ step: 2, 'aria-label': 'Volume' });
      expect(doc.querySelector('apg-slider')?.getAttribute('data-large-step')).toBe('20');
    });

    it('sets data-large-step to largeStep when provided', async () => {
      const doc = await renderSlider({ largeStep: 5, 'aria-label': 'Volume' });
      expect(doc.querySelector('apg-slider')?.getAttribute('data-large-step')).toBe('5');
    });

    it('sets data-format when format is provided', async () => {
      const doc = await renderSlider({ format: '{value}%', 'aria-label': 'Volume' });
      expect(doc.querySelector('apg-slider')?.getAttribute('data-format')).toBe('{value}%');
    });

    it('sets the track position custom property from the initial value', async () => {
      const doc = await renderSlider({ defaultValue: 25, 'aria-label': 'Volume' });
      const track = doc.querySelector<HTMLElement>('.apg-slider-track');
      expect(track?.getAttribute('style')).toBe('--slider-position: 25%');
    });

    it('adds the vertical modifier class for vertical orientation', async () => {
      const doc = await renderSlider({ orientation: 'vertical', 'aria-label': 'Volume' });
      expect(doc.querySelector('.apg-slider')?.classList.contains('apg-slider--vertical')).toBe(
        true
      );
    });

    it('hides the fill element from assistive technology', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume' });
      expect(doc.querySelector('.apg-slider-fill')?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('renders an element with role="slider"', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume' });
      expect(doc.querySelector('[role="slider"]')).not.toBeNull();
    });

    it('has aria-valuenow set to defaultValue', async () => {
      const doc = await renderSlider({ defaultValue: 50, 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('has aria-valuenow set to min when no defaultValue is given', async () => {
      const doc = await renderSlider({ min: 10, 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('10');
    });

    it('has aria-valuemin="0" and aria-valuemax="100" by default', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuemin')).toBe('0');
      expect(slider?.getAttribute('aria-valuemax')).toBe('100');
    });

    it('has aria-valuemin and aria-valuemax set to the provided range', async () => {
      const doc = await renderSlider({ min: 1, max: 5, 'aria-label': 'Rating' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuemin')).toBe('1');
      expect(slider?.getAttribute('aria-valuemax')).toBe('5');
    });

    it('has aria-valuetext when valueText is provided', async () => {
      const doc = await renderSlider({
        defaultValue: 75,
        valueText: '75 percent',
        'aria-label': 'Volume',
      });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuetext')).toBe('75 percent');
    });

    it('has aria-valuetext built from format with value, min and max', async () => {
      const doc = await renderSlider({
        defaultValue: 3,
        min: 1,
        max: 5,
        format: '{value} of {max}',
        'aria-label': 'Rating',
      });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuetext')).toBe('3 of 5');
    });

    it('does not have aria-valuetext when neither valueText nor format is provided', async () => {
      const doc = await renderSlider({ defaultValue: 75, 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.hasAttribute('aria-valuetext')).toBe(false);
    });

    it('has aria-disabled="true" when disabled', async () => {
      const doc = await renderSlider({ disabled: true, 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-disabled when not disabled', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.hasAttribute('aria-disabled')).toBe(false);
    });

    it('has aria-orientation="vertical" for a vertical slider', async () => {
      const doc = await renderSlider({ orientation: 'vertical', 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('does not have aria-orientation for a horizontal slider', async () => {
      const doc = await renderSlider({ orientation: 'horizontal', 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.hasAttribute('aria-orientation')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has aria-label when provided', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-label')).toBe('Volume');
    });

    it('has aria-labelledby when provided', async () => {
      const doc = await renderSlider({ 'aria-labelledby': 'external-label' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-labelledby')).toBe('external-label');
    });

    it('references the visible label via aria-labelledby when label is provided', async () => {
      const doc = await renderSlider({ label: 'Brightness' });
      const slider = doc.querySelector('[role="slider"]');
      const labelId = slider?.getAttribute('aria-labelledby') ?? '';
      expect(doc.getElementById(labelId)?.textContent?.trim()).toBe('Brightness');
    });

    it('does not set aria-label when a visible label is provided', async () => {
      const doc = await renderSlider({ label: 'Brightness', 'aria-label': 'Ignored' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.hasAttribute('aria-label')).toBe(false);
    });

    it('has aria-describedby when provided', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume', 'aria-describedby': 'volume-help' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-describedby')).toBe('volume-help');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on the thumb', async () => {
      const doc = await renderSlider({ 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" on the thumb when disabled', async () => {
      const doc = await renderSlider({ disabled: true, 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟡 Medium Priority: Initial Value Normalization
  describe('Initial Value Normalization', () => {
    it('clamps defaultValue below min to min', async () => {
      const doc = await renderSlider({
        defaultValue: -10,
        min: 0,
        max: 100,
        'aria-label': 'Volume',
      });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('clamps defaultValue above max to max', async () => {
      const doc = await renderSlider({
        defaultValue: 150,
        min: 0,
        max: 100,
        'aria-label': 'Volume',
      });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('100');
    });

    it('rounds defaultValue to the nearest step', async () => {
      const doc = await renderSlider({ defaultValue: 53, step: 5, 'aria-label': 'Volume' });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('55');
    });

    it('rounds a decimal defaultValue without floating-point error', async () => {
      const doc = await renderSlider({
        defaultValue: 0.1 + 0.2,
        min: 0,
        max: 1,
        step: 0.1,
        'aria-label': 'Opacity',
      });
      const slider = doc.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('0.3');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows the value when showValue is true', async () => {
      const doc = await renderSlider({ defaultValue: 75, showValue: true, 'aria-label': 'Volume' });
      expect(doc.querySelector('.apg-slider-value')?.textContent?.trim()).toBe('75');
    });

    it('shows the formatted value when format is provided', async () => {
      const doc = await renderSlider({
        defaultValue: 75,
        format: '{value}%',
        'aria-label': 'Volume',
      });
      expect(doc.querySelector('.apg-slider-value')?.textContent?.trim()).toBe('75%');
    });

    it('hides the value display from assistive technology', async () => {
      const doc = await renderSlider({ defaultValue: 75, 'aria-label': 'Volume' });
      expect(doc.querySelector('.apg-slider-value')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('does not render the value when showValue is false', async () => {
      const doc = await renderSlider({
        defaultValue: 75,
        showValue: false,
        'aria-label': 'Volume',
      });
      expect(doc.querySelector('.apg-slider-value')).toBeNull();
    });

    it('renders the visible label text when label is provided', async () => {
      const doc = await renderSlider({ label: 'Volume' });
      expect(doc.querySelector('.apg-slider-label')?.textContent?.trim()).toBe('Volume');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('sets the id attribute on the thumb', async () => {
      const doc = await renderSlider({ id: 'my-slider', 'aria-label': 'Volume' });
      expect(doc.querySelector('[role="slider"]')?.id).toBe('my-slider');
    });

    it('applies a custom class to the container', async () => {
      const doc = await renderSlider({ class: 'custom-class', 'aria-label': 'Volume' });
      expect(doc.querySelector('.apg-slider')?.classList.contains('custom-class')).toBe(true);
    });
  });
});
