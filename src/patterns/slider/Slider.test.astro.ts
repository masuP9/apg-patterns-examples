/**
 * Slider Web Component Tests
 *
 * Unit tests for the Web Component class.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Slider (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgSlider extends HTMLElement {
    private thumb: HTMLElement | null = null;
    private track: HTMLElement | null = null;
    private fill: HTMLElement | null = null;
    private valueDisplay: HTMLElement | null = null;
    private isDragging = false;

    connectedCallback() {
      this.thumb = this.querySelector('[role="slider"]');
      this.track = this.querySelector('.apg-slider-track');
      this.fill = this.querySelector('.apg-slider-fill');
      this.valueDisplay = this.querySelector('.apg-slider-value');

      if (this.thumb) {
        this.thumb.addEventListener('keydown', this.handleKeyDown.bind(this));
      }
    }

    private get min(): number {
      return Number(this.dataset.min) || 0;
    }

    private get max(): number {
      return Number(this.dataset.max) || 100;
    }

    private get step(): number {
      return Number(this.dataset.step) || 1;
    }

    private get largeStep(): number {
      return Number(this.dataset.largeStep) || this.step * 10;
    }

    private get isVertical(): boolean {
      return this.dataset.orientation === 'vertical';
    }

    private get isDisabled(): boolean {
      return this.dataset.disabled === 'true';
    }

    private get currentValue(): number {
      return Number(this.thumb?.getAttribute('aria-valuenow')) || this.min;
    }

    private clamp(val: number): number {
      return Math.min(this.max, Math.max(this.min, val));
    }

    private roundToStep(val: number): number {
      const steps = Math.round((val - this.min) / this.step);
      const result = this.min + steps * this.step;
      const decimalPlaces = (this.step.toString().split('.')[1] || '').length;
      return Number(result.toFixed(decimalPlaces));
    }

    private updateValue(newValue: number) {
      if (!this.thumb || this.isDisabled) return;

      const clampedValue = this.clamp(this.roundToStep(newValue));
      const currentValue = this.currentValue;

      if (clampedValue === currentValue) return;

      this.thumb.setAttribute('aria-valuenow', String(clampedValue));

      const percentage = ((clampedValue - this.min) / (this.max - this.min)) * 100;

      if (this.fill) {
        this.fill.style[this.isVertical ? 'height' : 'width'] = `${percentage}%`;
      }

      this.thumb.style[this.isVertical ? 'bottom' : 'left'] = `${percentage}%`;

      if (this.valueDisplay) {
        this.valueDisplay.textContent = String(clampedValue);
      }

      this.dispatchEvent(
        new CustomEvent('valuechange', {
          detail: { value: clampedValue },
          bubbles: true,
        })
      );
    }

    private handleKeyDown(event: KeyboardEvent) {
      if (this.isDisabled) return;

      let newValue = this.currentValue;

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          newValue = this.currentValue + this.step;
          break;
        case 'ArrowLeft':
        case 'ArrowDown':
          newValue = this.currentValue - this.step;
          break;
        case 'Home':
          newValue = this.min;
          break;
        case 'End':
          newValue = this.max;
          break;
        case 'PageUp':
          newValue = this.currentValue + this.largeStep;
          break;
        case 'PageDown':
          newValue = this.currentValue - this.largeStep;
          break;
        default:
          return;
      }

      event.preventDefault();
      this.updateValue(newValue);
    }

    setValue(newValue: number) {
      this.updateValue(newValue);
    }

    // Expose for testing
    get _thumb() {
      return this.thumb;
    }
    get _fill() {
      return this.fill;
    }
    get _valueDisplay() {
      return this.valueDisplay;
    }
  }

  function createSliderHTML(
    options: {
      defaultValue?: number;
      min?: number;
      max?: number;
      step?: number;
      largeStep?: number;
      orientation?: 'horizontal' | 'vertical';
      disabled?: boolean;
      showValue?: boolean;
      label?: string;
      valueText?: string;
      id?: string;
      ariaLabel?: string;
      ariaLabelledby?: string;
    } = {}
  ) {
    const {
      defaultValue,
      min = 0,
      max = 100,
      step = 1,
      largeStep,
      orientation = 'horizontal',
      disabled = false,
      showValue = true,
      label,
      valueText,
      id,
      ariaLabel = 'Volume',
      ariaLabelledby,
    } = options;

    // Calculate initial value
    const clamp = (val: number, minVal: number, maxVal: number) =>
      Math.min(maxVal, Math.max(minVal, val));
    const roundToStep = (val: number, stepVal: number, minVal: number) => {
      const steps = Math.round((val - minVal) / stepVal);
      return minVal + steps * stepVal;
    };

    const initialValue = clamp(roundToStep(defaultValue ?? min, step, min), min, max);
    const percentage = max === min ? 0 : ((initialValue - min) / (max - min)) * 100;
    const isVertical = orientation === 'vertical';
    const effectiveLargeStep = largeStep ?? step * 10;
    const labelId = label ? `slider-label-${Math.random().toString(36).slice(2, 9)}` : undefined;

    return `
      <apg-slider
        data-min="${min}"
        data-max="${max}"
        data-step="${step}"
        data-large-step="${effectiveLargeStep}"
        data-orientation="${orientation}"
        data-disabled="${disabled}"
      >
        <div class="apg-slider ${isVertical ? 'apg-slider--vertical' : ''} ${disabled ? 'apg-slider--disabled' : ''}">
          ${label ? `<span id="${labelId}" class="apg-slider-label">${label}</span>` : ''}
          <div class="apg-slider-track">
            <div
              class="apg-slider-fill"
              style="${isVertical ? `height: ${percentage}%` : `width: ${percentage}%`}"
              aria-hidden="true"
            ></div>
            <div
              role="slider"
              ${id ? `id="${id}"` : ''}
              tabindex="${disabled ? -1 : 0}"
              aria-valuenow="${initialValue}"
              aria-valuemin="${min}"
              aria-valuemax="${max}"
              ${valueText ? `aria-valuetext="${valueText}"` : ''}
              ${ariaLabelledby ? `aria-labelledby="${ariaLabelledby}"` : label ? `aria-labelledby="${labelId}"` : `aria-label="${ariaLabel}"`}
              ${isVertical ? `aria-orientation="vertical"` : ''}
              ${disabled ? `aria-disabled="true"` : ''}
              class="apg-slider-thumb"
              style="${isVertical ? `bottom: ${percentage}%` : `left: ${percentage}%`}"
            ></div>
          </div>
          ${showValue ? `<span class="apg-slider-value" aria-hidden="true">${initialValue}</span>` : ''}
        </div>
      </apg-slider>
    `;
  }

  beforeEach(() => {
    // Register custom element if not already registered
    if (!customElements.get('apg-slider')) {
      customElements.define('apg-slider', TestApgSlider);
    }

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="slider"', () => {
      container.innerHTML = createSliderHTML();
      expect(container.querySelector('[role="slider"]')).not.toBeNull();
    });

    it('has aria-valuenow set to current value', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50 });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('has aria-valuenow set to min when no defaultValue', () => {
      container.innerHTML = createSliderHTML({ min: 10 });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('10');
    });

    it('has aria-valuemin set', () => {
      container.innerHTML = createSliderHTML({ min: 0 });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuemin')).toBe('0');
    });

    it('has aria-valuemax set', () => {
      container.innerHTML = createSliderHTML({ max: 100 });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuemax')).toBe('100');
    });

    it('has aria-valuetext when valueText provided', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 75, valueText: '75 percent' });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuetext')).toBe('75 percent');
    });

    it('does not have aria-valuetext when not provided', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 75 });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.hasAttribute('aria-valuetext')).toBe(false);
    });

    it('has aria-disabled="true" when disabled', () => {
      container.innerHTML = createSliderHTML({ disabled: true });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-disabled')).toBe('true');
    });

    it('has aria-orientation="vertical" for vertical slider', () => {
      container.innerHTML = createSliderHTML({ orientation: 'vertical' });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-orientation')).toBe('vertical');
    });

    it('does not have aria-orientation for horizontal slider', () => {
      container.innerHTML = createSliderHTML({ orientation: 'horizontal' });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.hasAttribute('aria-orientation')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      container.innerHTML = createSliderHTML({ ariaLabel: 'Volume' });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-label')).toBe('Volume');
    });

    it('has accessible name via aria-labelledby', () => {
      container.innerHTML = createSliderHTML({ ariaLabelledby: 'external-label' });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-labelledby')).toBe('external-label');
    });

    it('has accessible name via visible label', () => {
      container.innerHTML = createSliderHTML({ label: 'Brightness' });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.hasAttribute('aria-labelledby')).toBe(true);
      expect(container.querySelector('.apg-slider-label')?.textContent).toBe('Brightness');
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('Keyboard Interaction', () => {
    it('increases value by step on ArrowRight', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50, step: 1 });
      const sliderComponent = container.querySelector('apg-slider') as TestApgSlider;
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('51');
    });

    it('decreases value by step on ArrowLeft', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50, step: 1 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('49');
    });

    it('sets min value on Home', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50, min: 0 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('0');
    });

    it('sets max value on End', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50, max: 100 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('100');
    });

    it('increases value by large step on PageUp', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50, step: 1 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('60');
    });

    it('decreases value by large step on PageDown', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50, step: 1 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('40');
    });

    it('does not exceed max on ArrowRight', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 100, max: 100 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('100');
    });

    it('does not go below min on ArrowLeft', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 0, min: 0 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('0');
    });

    it('does not change value when disabled', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50, disabled: true });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('50');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on thumb', () => {
      container.innerHTML = createSliderHTML();
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" when disabled', () => {
      container.innerHTML = createSliderHTML({ disabled: true });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟡 Medium Priority: Events
  describe('Events', () => {
    it('dispatches valuechange event on value change', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 50 });
      const sliderComponent = container.querySelector('apg-slider') as TestApgSlider;
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const eventHandler = vi.fn();
      sliderComponent.addEventListener('valuechange', eventHandler);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      slider.dispatchEvent(event);

      expect(eventHandler).toHaveBeenCalled();
      expect(eventHandler.mock.calls[0][0].detail.value).toBe(51);
    });

    it('does not dispatch event when value does not change', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 100, max: 100 });
      const sliderComponent = container.querySelector('apg-slider') as TestApgSlider;
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const eventHandler = vi.fn();
      sliderComponent.addEventListener('valuechange', eventHandler);

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      slider.dispatchEvent(event);

      expect(eventHandler).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal step values correctly', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 0.5, min: 0, max: 1, step: 0.1 });
      const slider = container.querySelector('[role="slider"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true });
      slider.dispatchEvent(event);

      expect(slider.getAttribute('aria-valuenow')).toBe('0.6');
    });

    it('clamps value to min/max', () => {
      container.innerHTML = createSliderHTML({ defaultValue: -10, min: 0, max: 100 });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('rounds value to step', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 53, min: 0, max: 100, step: 5 });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('aria-valuenow')).toBe('55');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows value when showValue is true', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 75, showValue: true });
      expect(container.querySelector('.apg-slider-value')?.textContent).toBe('75');
    });

    it('hides value when showValue is false', () => {
      container.innerHTML = createSliderHTML({ defaultValue: 75, showValue: false });
      expect(container.querySelector('.apg-slider-value')).toBeNull();
    });

    it('displays visible label when label provided', () => {
      container.innerHTML = createSliderHTML({ label: 'Volume' });
      expect(container.querySelector('.apg-slider-label')?.textContent).toBe('Volume');
    });
  });

  // 🟢 Low Priority: HTML Attributes
  describe('HTML Attributes', () => {
    it('sets id attribute', () => {
      container.innerHTML = createSliderHTML({ id: 'my-slider' });
      const slider = container.querySelector('[role="slider"]');
      expect(slider?.getAttribute('id')).toBe('my-slider');
    });
  });
});
