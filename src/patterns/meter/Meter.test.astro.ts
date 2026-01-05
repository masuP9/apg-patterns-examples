/**
 * Meter Web Component Tests
 *
 * Unit tests for the Web Component class.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Meter (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgMeter extends HTMLElement {
    private meter: HTMLElement | null = null;
    private fill: HTMLElement | null = null;
    private valueDisplay: HTMLElement | null = null;

    connectedCallback() {
      this.meter = this.querySelector('[role="meter"]');
      this.fill = this.querySelector('.apg-meter-fill');
      this.valueDisplay = this.querySelector('.apg-meter-value');
    }

    updateValue(newValue: number) {
      if (!this.meter) return;

      const min = Number(this.dataset.min) || 0;
      const max = Number(this.dataset.max) || 100;
      const clamp = this.dataset.clamp !== 'false';

      let normalizedValue = newValue;
      if (clamp && Number.isFinite(newValue)) {
        normalizedValue = Math.min(max, Math.max(min, newValue));
      }

      this.meter.setAttribute('aria-valuenow', String(normalizedValue));

      if (this.fill) {
        const percentage = max === min ? 0 : ((normalizedValue - min) / (max - min)) * 100;
        this.fill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
      }

      if (this.valueDisplay) {
        this.valueDisplay.textContent = String(normalizedValue);
      }

      this.dispatchEvent(
        new CustomEvent('valuechange', {
          detail: { value: normalizedValue },
          bubbles: true,
        })
      );
    }

    // Expose for testing
    get _meter() {
      return this.meter;
    }
    get _fill() {
      return this.fill;
    }
    get _valueDisplay() {
      return this.valueDisplay;
    }
  }

  function createMeterHTML(
    options: {
      value?: number;
      min?: number;
      max?: number;
      clamp?: boolean;
      showValue?: boolean;
      label?: string;
      valueText?: string;
      id?: string;
      ariaLabel?: string;
      ariaLabelledby?: string;
    } = {}
  ) {
    const {
      value = 50,
      min = 0,
      max = 100,
      clamp = true,
      showValue = true,
      label,
      valueText,
      id,
      ariaLabel = 'Progress',
      ariaLabelledby,
    } = options;

    // Calculate normalized value
    let normalizedValue = value;
    if (clamp && Number.isFinite(value)) {
      normalizedValue = Math.min(max, Math.max(min, value));
    }

    const percentage = max === min ? 0 : ((normalizedValue - min) / (max - min)) * 100;

    return `
      <apg-meter
        class="apg-meter"
        data-value="${value}"
        data-min="${min}"
        data-max="${max}"
        data-clamp="${clamp}"
      >
        <div
          role="meter"
          aria-valuenow="${normalizedValue}"
          aria-valuemin="${min}"
          aria-valuemax="${max}"
          ${valueText ? `aria-valuetext="${valueText}"` : ''}
          ${ariaLabelledby ? `aria-labelledby="${ariaLabelledby}"` : `aria-label="${label || ariaLabel}"`}
          ${id ? `id="${id}"` : ''}
          class="apg-meter-container"
        >
          ${label ? `<span class="apg-meter-label" aria-hidden="true">${label}</span>` : ''}
          <div class="apg-meter-track" aria-hidden="true">
            <div class="apg-meter-fill" style="width: ${percentage}%"></div>
          </div>
          ${showValue ? `<span class="apg-meter-value" aria-hidden="true">${normalizedValue}</span>` : ''}
        </div>
      </apg-meter>
    `;
  }

  beforeEach(() => {
    // Register custom element if not already registered
    if (!customElements.get('apg-meter')) {
      customElements.define('apg-meter', TestApgMeter);
    }

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="meter"', () => {
      container.innerHTML = createMeterHTML();
      const meter = container.querySelector('[role="meter"]');
      expect(meter).not.toBeNull();
    });

    it('has aria-valuenow set to current value', () => {
      container.innerHTML = createMeterHTML({ value: 75 });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('75');
    });

    it('has aria-valuemin set', () => {
      container.innerHTML = createMeterHTML({ min: 10 });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuemin')).toBe('10');
    });

    it('has aria-valuemax set', () => {
      container.innerHTML = createMeterHTML({ max: 200 });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuemax')).toBe('200');
    });

    it('has aria-valuetext when provided', () => {
      container.innerHTML = createMeterHTML({ valueText: '75 percent complete' });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuetext')).toBe('75 percent complete');
    });

    it('does not have aria-valuetext when not provided', () => {
      container.innerHTML = createMeterHTML();
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.hasAttribute('aria-valuetext')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      container.innerHTML = createMeterHTML({ ariaLabel: 'CPU Usage' });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-label')).toBe('CPU Usage');
    });

    it('has accessible name via aria-labelledby', () => {
      container.innerHTML = `
        <span id="meter-label">Battery Level</span>
        ${createMeterHTML({ ariaLabelledby: 'meter-label', ariaLabel: undefined })}
      `;
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-labelledby')).toBe('meter-label');
    });

    it('has accessible name via visible label', () => {
      container.innerHTML = createMeterHTML({ label: 'Storage Used' });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-label')).toBe('Storage Used');
    });
  });

  // 🔴 High Priority: Value Clamping
  describe('Value Clamping', () => {
    it('clamps value above max to max', () => {
      container.innerHTML = createMeterHTML({ value: 150, min: 0, max: 100 });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('100');
    });

    it('clamps value below min to min', () => {
      container.innerHTML = createMeterHTML({ value: -50, min: 0, max: 100 });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('does not clamp when clamp=false', () => {
      container.innerHTML = createMeterHTML({ value: 150, min: 0, max: 100, clamp: false });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('150');
    });
  });

  // 🔴 High Priority: Focus Behavior
  describe('Focus Behavior', () => {
    it('is not focusable by default', () => {
      container.innerHTML = createMeterHTML();
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.hasAttribute('tabindex')).toBe(false);
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal values correctly', () => {
      container.innerHTML = createMeterHTML({ value: 33.33 });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('33.33');
    });

    it('handles negative min/max range', () => {
      container.innerHTML = createMeterHTML({ value: 0, min: -50, max: 50 });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('0');
      expect(meter?.getAttribute('aria-valuemin')).toBe('-50');
      expect(meter?.getAttribute('aria-valuemax')).toBe('50');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows value when showValue is true (default)', () => {
      container.innerHTML = createMeterHTML({ value: 75 });
      const valueDisplay = container.querySelector('.apg-meter-value');
      expect(valueDisplay?.textContent).toBe('75');
    });

    it('hides value when showValue is false', () => {
      container.innerHTML = createMeterHTML({ value: 75, showValue: false });
      const valueDisplay = container.querySelector('.apg-meter-value');
      expect(valueDisplay).toBeNull();
    });

    it('displays visible label when label provided', () => {
      container.innerHTML = createMeterHTML({ label: 'CPU Usage' });
      const labelDisplay = container.querySelector('.apg-meter-label');
      expect(labelDisplay?.textContent).toBe('CPU Usage');
    });

    it('has correct fill width based on value', () => {
      container.innerHTML = createMeterHTML({ value: 75, min: 0, max: 100 });
      const fill = container.querySelector('.apg-meter-fill') as HTMLElement;
      expect(fill?.style.width).toBe('75%');
    });
  });

  // 🟡 Medium Priority: Dynamic Updates
  describe('Dynamic Updates', () => {
    it('updates aria-valuenow when updateValue is called', async () => {
      container.innerHTML = createMeterHTML({ value: 50 });
      const component = container.querySelector('apg-meter') as TestApgMeter;

      // Wait for connectedCallback
      await new Promise((resolve) => requestAnimationFrame(resolve));

      component.updateValue(75);

      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('75');
    });

    it('clamps value on updateValue when clamp=true', async () => {
      container.innerHTML = createMeterHTML({ value: 50, clamp: true });
      const component = container.querySelector('apg-meter') as TestApgMeter;

      await new Promise((resolve) => requestAnimationFrame(resolve));

      component.updateValue(150);

      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('aria-valuenow')).toBe('100');
    });

    it('dispatches valuechange event on update', async () => {
      container.innerHTML = createMeterHTML({ value: 50 });
      const component = container.querySelector('apg-meter') as TestApgMeter;

      await new Promise((resolve) => requestAnimationFrame(resolve));

      const handler = vi.fn();
      component.addEventListener('valuechange', handler);

      component.updateValue(75);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: { value: 75 },
        })
      );
    });

    it('updates visual fill on updateValue', async () => {
      container.innerHTML = createMeterHTML({ value: 50 });
      const component = container.querySelector('apg-meter') as TestApgMeter;

      await new Promise((resolve) => requestAnimationFrame(resolve));

      component.updateValue(75);

      const fill = container.querySelector('.apg-meter-fill') as HTMLElement;
      expect(fill?.style.width).toBe('75%');
    });

    it('updates value display on updateValue', async () => {
      container.innerHTML = createMeterHTML({ value: 50 });
      const component = container.querySelector('apg-meter') as TestApgMeter;

      await new Promise((resolve) => requestAnimationFrame(resolve));

      component.updateValue(75);

      const valueDisplay = container.querySelector('.apg-meter-value');
      expect(valueDisplay?.textContent).toBe('75');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('sets id attribute', () => {
      container.innerHTML = createMeterHTML({ id: 'my-meter' });
      const meter = container.querySelector('[role="meter"]');
      expect(meter?.getAttribute('id')).toBe('my-meter');
    });
  });
});
