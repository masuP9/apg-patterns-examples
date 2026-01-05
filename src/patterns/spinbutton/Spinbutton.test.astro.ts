/**
 * Spinbutton Web Component Tests
 *
 * Unit tests for the Web Component class.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Spinbutton (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgSpinbutton extends HTMLElement {
    private input: HTMLInputElement | null = null;
    private incrementBtn: HTMLButtonElement | null = null;
    private decrementBtn: HTMLButtonElement | null = null;
    private isComposing = false;
    private previousValidValue = 0;

    connectedCallback() {
      this.input = this.querySelector('[role="spinbutton"]');
      this.incrementBtn = this.querySelector('.apg-spinbutton-increment');
      this.decrementBtn = this.querySelector('.apg-spinbutton-decrement');

      if (this.input) {
        this.previousValidValue = this.currentValue;
        this.input.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.input.addEventListener('input', this.handleInput.bind(this));
        this.input.addEventListener('blur', this.handleBlur.bind(this));
        this.input.addEventListener('compositionstart', this.handleCompositionStart.bind(this));
        this.input.addEventListener('compositionend', this.handleCompositionEnd.bind(this));
      }

      if (this.incrementBtn) {
        this.incrementBtn.addEventListener('click', this.handleIncrement.bind(this));
      }

      if (this.decrementBtn) {
        this.decrementBtn.addEventListener('click', this.handleDecrement.bind(this));
      }
    }

    private get min(): number | undefined {
      const val = this.dataset.min;
      return val !== undefined && val !== '' ? Number(val) : undefined;
    }

    private get max(): number | undefined {
      const val = this.dataset.max;
      return val !== undefined && val !== '' ? Number(val) : undefined;
    }

    private get step(): number {
      return Number(this.dataset.step) || 1;
    }

    private get largeStep(): number {
      return Number(this.dataset.largeStep) || this.step * 10;
    }

    private get isDisabled(): boolean {
      return this.dataset.disabled === 'true';
    }

    private get isReadOnly(): boolean {
      return this.dataset.readonly === 'true';
    }

    private get format(): string | undefined {
      return this.dataset.format;
    }

    private formatValue(value: number): string {
      const fmt = this.format;
      if (!fmt) return String(value);
      return fmt
        .replace('{value}', String(value))
        .replace('{min}', this.min !== undefined ? String(this.min) : '')
        .replace('{max}', this.max !== undefined ? String(this.max) : '');
    }

    private get currentValue(): number {
      return Number(this.input?.getAttribute('aria-valuenow')) || 0;
    }

    private clamp(val: number): number {
      let result = val;
      if (this.min !== undefined) result = Math.max(this.min, result);
      if (this.max !== undefined) result = Math.min(this.max, result);
      return result;
    }

    private roundToStep(val: number): number {
      const base = this.min ?? 0;
      const steps = Math.round((val - base) / this.step);
      const result = base + steps * this.step;
      const decimalPlaces = (this.step.toString().split('.')[1] || '').length;
      return Number(result.toFixed(decimalPlaces));
    }

    private updateValue(newValue: number, updateInput = true) {
      if (!this.input || this.isDisabled) return;

      const clampedValue = this.clamp(this.roundToStep(newValue));
      const currentValue = this.currentValue;

      if (clampedValue === currentValue) return;

      this.input.setAttribute('aria-valuenow', String(clampedValue));

      if (this.format) {
        this.input.setAttribute('aria-valuetext', this.formatValue(clampedValue));
      }

      if (updateInput) {
        this.input.value = String(clampedValue);
      }

      this.previousValidValue = clampedValue;

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
      let handled = false;

      switch (event.key) {
        case 'ArrowUp':
          if (!this.isReadOnly) {
            newValue = this.currentValue + this.step;
            handled = true;
          }
          break;
        case 'ArrowDown':
          if (!this.isReadOnly) {
            newValue = this.currentValue - this.step;
            handled = true;
          }
          break;
        case 'Home':
          if (this.min !== undefined) {
            newValue = this.min;
            handled = true;
          }
          break;
        case 'End':
          if (this.max !== undefined) {
            newValue = this.max;
            handled = true;
          }
          break;
        case 'PageUp':
          if (!this.isReadOnly) {
            newValue = this.currentValue + this.largeStep;
            handled = true;
          }
          break;
        case 'PageDown':
          if (!this.isReadOnly) {
            newValue = this.currentValue - this.largeStep;
            handled = true;
          }
          break;
        default:
          return;
      }

      if (handled) {
        event.preventDefault();
        this.updateValue(newValue);
      }
    }

    private handleInput() {
      if (this.isComposing || !this.input) return;

      const parsed = parseFloat(this.input.value);
      if (!isNaN(parsed)) {
        const clampedValue = this.clamp(this.roundToStep(parsed));
        this.input.setAttribute('aria-valuenow', String(clampedValue));
        if (this.format) {
          this.input.setAttribute('aria-valuetext', this.formatValue(clampedValue));
        }
        this.previousValidValue = clampedValue;
        this.dispatchEvent(
          new CustomEvent('valuechange', {
            detail: { value: clampedValue },
            bubbles: true,
          })
        );
      }
    }

    private handleBlur() {
      if (!this.input) return;

      const parsed = parseFloat(this.input.value);

      if (isNaN(parsed)) {
        this.input.value = String(this.previousValidValue);
        this.input.setAttribute('aria-valuenow', String(this.previousValidValue));
      } else {
        const newValue = this.clamp(this.roundToStep(parsed));
        this.input.value = String(newValue);
        this.input.setAttribute('aria-valuenow', String(newValue));
        if (this.format) {
          this.input.setAttribute('aria-valuetext', this.formatValue(newValue));
        }
        if (newValue !== this.previousValidValue) {
          this.previousValidValue = newValue;
          this.dispatchEvent(
            new CustomEvent('valuechange', {
              detail: { value: newValue },
              bubbles: true,
            })
          );
        }
      }
    }

    private handleCompositionStart() {
      this.isComposing = true;
    }

    private handleCompositionEnd() {
      this.isComposing = false;
      this.handleInput();
    }

    private handleIncrement(event: MouseEvent) {
      event.preventDefault();
      if (this.isDisabled || this.isReadOnly) return;
      this.updateValue(this.currentValue + this.step);
      this.input?.focus();
    }

    private handleDecrement(event: MouseEvent) {
      event.preventDefault();
      if (this.isDisabled || this.isReadOnly) return;
      this.updateValue(this.currentValue - this.step);
      this.input?.focus();
    }

    setValue(newValue: number) {
      this.updateValue(newValue);
    }

    // Expose for testing
    get _input() {
      return this.input;
    }
    get _isComposing() {
      return this.isComposing;
    }
  }

  function createSpinbuttonHTML(
    options: {
      defaultValue?: number;
      min?: number;
      max?: number;
      step?: number;
      largeStep?: number;
      disabled?: boolean;
      readOnly?: boolean;
      showButtons?: boolean;
      label?: string;
      valueText?: string;
      format?: string;
      id?: string;
      ariaLabel?: string;
      ariaLabelledby?: string;
      ariaDescribedby?: string;
    } = {}
  ) {
    const {
      defaultValue = 0,
      min,
      max,
      step = 1,
      largeStep,
      disabled = false,
      readOnly = false,
      showButtons = true,
      label,
      valueText,
      format,
      id,
      ariaLabel,
      ariaLabelledby,
      ariaDescribedby,
    } = options;

    // Utility functions
    const clamp = (val: number, minVal?: number, maxVal?: number): number => {
      let result = val;
      if (minVal !== undefined) result = Math.max(minVal, result);
      if (maxVal !== undefined) result = Math.min(maxVal, result);
      return result;
    };

    const roundToStep = (val: number, stepVal: number, minVal?: number): number => {
      const base = minVal ?? 0;
      const steps = Math.round((val - base) / stepVal);
      const result = base + steps * stepVal;
      const decimalPlaces = (stepVal.toString().split('.')[1] || '').length;
      return Number(result.toFixed(decimalPlaces));
    };

    const formatValueText = (value: number, formatStr?: string): string => {
      if (!formatStr) return String(value);
      return formatStr
        .replace('{value}', String(value))
        .replace('{min}', min !== undefined ? String(min) : '')
        .replace('{max}', max !== undefined ? String(max) : '');
    };

    const initialValue = clamp(roundToStep(defaultValue, step, min), min, max);
    const effectiveLargeStep = largeStep ?? step * 10;
    const labelId = label
      ? `spinbutton-label-${Math.random().toString(36).slice(2, 9)}`
      : undefined;
    const initialAriaValueText =
      valueText ?? (format ? formatValueText(initialValue, format) : undefined);

    return `
      <apg-spinbutton
        ${min !== undefined ? `data-min="${min}"` : ''}
        ${max !== undefined ? `data-max="${max}"` : ''}
        data-step="${step}"
        data-large-step="${effectiveLargeStep}"
        data-disabled="${disabled}"
        data-readonly="${readOnly}"
        ${format ? `data-format="${format}"` : ''}
      >
        <div class="apg-spinbutton ${disabled ? 'apg-spinbutton--disabled' : ''}">
          ${label ? `<span id="${labelId}" class="apg-spinbutton-label">${label}</span>` : ''}
          <div class="apg-spinbutton-controls">
            ${
              showButtons
                ? `
              <button
                type="button"
                tabindex="-1"
                aria-label="Decrement"
                ${disabled ? 'disabled' : ''}
                class="apg-spinbutton-button apg-spinbutton-decrement"
              >
                −
              </button>
            `
                : ''
            }
            <input
              type="text"
              role="spinbutton"
              ${id ? `id="${id}"` : ''}
              tabindex="${disabled ? -1 : 0}"
              inputmode="numeric"
              value="${initialValue}"
              ${readOnly ? 'readonly' : ''}
              aria-valuenow="${initialValue}"
              ${min !== undefined ? `aria-valuemin="${min}"` : ''}
              ${max !== undefined ? `aria-valuemax="${max}"` : ''}
              ${initialAriaValueText ? `aria-valuetext="${initialAriaValueText}"` : ''}
              ${!label && ariaLabel ? `aria-label="${ariaLabel}"` : ''}
              ${ariaLabelledby ? `aria-labelledby="${ariaLabelledby}"` : label ? `aria-labelledby="${labelId}"` : ''}
              ${ariaDescribedby ? `aria-describedby="${ariaDescribedby}"` : ''}
              ${disabled ? 'aria-disabled="true"' : ''}
              ${readOnly ? 'aria-readonly="true"' : ''}
              class="apg-spinbutton-input"
            />
            ${
              showButtons
                ? `
              <button
                type="button"
                tabindex="-1"
                aria-label="Increment"
                ${disabled ? 'disabled' : ''}
                class="apg-spinbutton-button apg-spinbutton-increment"
              >
                +
              </button>
            `
                : ''
            }
          </div>
        </div>
      </apg-spinbutton>
    `;
  }

  beforeEach(() => {
    if (!customElements.get('apg-spinbutton')) {
      customElements.define('apg-spinbutton', TestApgSpinbutton);
    }

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="spinbutton"', () => {
      container.innerHTML = createSpinbuttonHTML();
      expect(container.querySelector('[role="spinbutton"]')).not.toBeNull();
    });

    it('has aria-valuenow set to current value', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('has aria-valuenow set to 0 when no defaultValue', () => {
      container.innerHTML = createSpinbuttonHTML();
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('has aria-valuemin set when min is provided', () => {
      container.innerHTML = createSpinbuttonHTML({ min: 0 });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuemin')).toBe('0');
    });

    it('does not have aria-valuemin when min is not provided', () => {
      container.innerHTML = createSpinbuttonHTML();
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.hasAttribute('aria-valuemin')).toBe(false);
    });

    it('has aria-valuemax set when max is provided', () => {
      container.innerHTML = createSpinbuttonHTML({ max: 100 });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuemax')).toBe('100');
    });

    it('does not have aria-valuemax when max is not provided', () => {
      container.innerHTML = createSpinbuttonHTML();
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.hasAttribute('aria-valuemax')).toBe(false);
    });

    it('has aria-valuetext when valueText provided', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 5, valueText: '5 items' });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuetext')).toBe('5 items');
    });

    it('has aria-valuetext when format provided', () => {
      container.innerHTML = createSpinbuttonHTML({
        defaultValue: 5,
        min: 0,
        max: 10,
        format: '{value} of {max}',
      });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuetext')).toBe('5 of 10');
    });

    it('does not have aria-valuetext when not provided', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.hasAttribute('aria-valuetext')).toBe(false);
    });

    it('has aria-disabled="true" when disabled', () => {
      container.innerHTML = createSpinbuttonHTML({ disabled: true });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-disabled when not disabled', () => {
      container.innerHTML = createSpinbuttonHTML({ disabled: false });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.hasAttribute('aria-disabled')).toBe(false);
    });

    it('has aria-readonly="true" when read-only', () => {
      container.innerHTML = createSpinbuttonHTML({ readOnly: true });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-readonly')).toBe('true');
    });

    it('does not have aria-readonly when not read-only', () => {
      container.innerHTML = createSpinbuttonHTML({ readOnly: false });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.hasAttribute('aria-readonly')).toBe(false);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      container.innerHTML = createSpinbuttonHTML({ ariaLabel: 'Quantity' });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-label')).toBe('Quantity');
    });

    it('has accessible name via aria-labelledby', () => {
      container.innerHTML = createSpinbuttonHTML({ ariaLabelledby: 'external-label' });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-labelledby')).toBe('external-label');
    });

    it('has accessible name via visible label', () => {
      container.innerHTML = createSpinbuttonHTML({ label: 'Item Count' });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.hasAttribute('aria-labelledby')).toBe(true);
      expect(container.querySelector('.apg-spinbutton-label')?.textContent).toBe('Item Count');
    });

    it('has aria-describedby when provided', () => {
      container.innerHTML = createSpinbuttonHTML({ ariaDescribedby: 'help-text' });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-describedby')).toBe('help-text');
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('Keyboard Interaction', () => {
    it('increases value by step on ArrowUp', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, step: 1 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('51');
    });

    it('decreases value by step on ArrowDown', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, step: 1 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('49');
    });

    it('sets min value on Home when min is defined', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, min: 0 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('0');
    });

    it('does not change value on Home when min is not defined', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('50');
    });

    it('sets max value on End when max is defined', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, max: 100 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('100');
    });

    it('does not change value on End when max is not defined', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('50');
    });

    it('increases value by large step on PageUp', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, step: 1 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('60');
    });

    it('decreases value by large step on PageDown', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, step: 1 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('40');
    });

    it('does not exceed max on ArrowUp', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 100, max: 100 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('100');
    });

    it('does not go below min on ArrowDown', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 0, min: 0 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('0');
    });

    it('allows values beyond default range when no min/max', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 0 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      // Can go negative
      const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
      spinbutton.dispatchEvent(downEvent);
      expect(spinbutton.getAttribute('aria-valuenow')).toBe('-1');

      // Can go positive without limit
      for (let i = 0; i < 200; i++) {
        const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
        spinbutton.dispatchEvent(upEvent);
      }
      expect(spinbutton.getAttribute('aria-valuenow')).toBe('199');
    });

    it('does not change value when disabled', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, disabled: true });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('50');
    });

    it('does not change value with arrow keys when read-only', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, readOnly: true });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('50');
    });

    it('allows Home/End navigation when read-only', () => {
      container.innerHTML = createSpinbuttonHTML({
        defaultValue: 50,
        min: 0,
        max: 100,
        readOnly: true,
      });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const homeEvent = new KeyboardEvent('keydown', { key: 'Home', bubbles: true });
      spinbutton.dispatchEvent(homeEvent);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('0');

      const endEvent = new KeyboardEvent('keydown', { key: 'End', bubbles: true });
      spinbutton.dispatchEvent(endEvent);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('100');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on input', () => {
      container.innerHTML = createSpinbuttonHTML();
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" when disabled', () => {
      container.innerHTML = createSpinbuttonHTML({ disabled: true });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('tabindex')).toBe('-1');
    });

    it('has tabindex="-1" on buttons', () => {
      container.innerHTML = createSpinbuttonHTML({ showButtons: true });
      const incrementBtn = container.querySelector('.apg-spinbutton-increment');
      const decrementBtn = container.querySelector('.apg-spinbutton-decrement');
      expect(incrementBtn?.getAttribute('tabindex')).toBe('-1');
      expect(decrementBtn?.getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🔴 High Priority: Button Interaction
  describe('Button Interaction', () => {
    it('shows increment and decrement buttons by default', () => {
      container.innerHTML = createSpinbuttonHTML();
      expect(container.querySelector('.apg-spinbutton-increment')).not.toBeNull();
      expect(container.querySelector('.apg-spinbutton-decrement')).not.toBeNull();
    });

    it('hides buttons when showButtons is false', () => {
      container.innerHTML = createSpinbuttonHTML({ showButtons: false });
      expect(container.querySelector('.apg-spinbutton-increment')).toBeNull();
      expect(container.querySelector('.apg-spinbutton-decrement')).toBeNull();
    });

    it('increments value on increment button click', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, step: 1 });
      const incrementBtn = container.querySelector('.apg-spinbutton-increment') as HTMLElement;
      const spinbutton = container.querySelector('[role="spinbutton"]');

      incrementBtn.click();

      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('51');
    });

    it('decrements value on decrement button click', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, step: 1 });
      const decrementBtn = container.querySelector('.apg-spinbutton-decrement') as HTMLElement;
      const spinbutton = container.querySelector('[role="spinbutton"]');

      decrementBtn.click();

      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('49');
    });

    it('does not change value on button click when disabled', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, disabled: true });
      const incrementBtn = container.querySelector('.apg-spinbutton-increment') as HTMLElement;
      const spinbutton = container.querySelector('[role="spinbutton"]');

      incrementBtn.click();

      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('does not change value on button click when read-only', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, readOnly: true });
      const incrementBtn = container.querySelector('.apg-spinbutton-increment') as HTMLElement;
      const spinbutton = container.querySelector('[role="spinbutton"]');

      incrementBtn.click();

      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('50');
    });

    it('has accessible label on increment button', () => {
      container.innerHTML = createSpinbuttonHTML();
      const incrementBtn = container.querySelector('.apg-spinbutton-increment');
      expect(incrementBtn?.getAttribute('aria-label')).toBe('Increment');
    });

    it('has accessible label on decrement button', () => {
      container.innerHTML = createSpinbuttonHTML();
      const decrementBtn = container.querySelector('.apg-spinbutton-decrement');
      expect(decrementBtn?.getAttribute('aria-label')).toBe('Decrement');
    });
  });

  // 🟡 Medium Priority: Text Input
  describe('Text Input', () => {
    it('has inputmode="numeric" for mobile keyboard', () => {
      container.innerHTML = createSpinbuttonHTML();
      const input = container.querySelector('[role="spinbutton"]');
      expect(input?.getAttribute('inputmode')).toBe('numeric');
    });

    it('updates aria-valuenow on valid text input', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 0 });
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;

      input.value = '42';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-valuenow')).toBe('42');
    });

    it('clamps input value to min/max', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50, min: 0, max: 100 });
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;

      input.value = '150';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-valuenow')).toBe('100');
    });

    it('reverts to previous value on blur with invalid input', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;

      input.value = 'abc';
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(input.value).toBe('50');
      expect(input.getAttribute('aria-valuenow')).toBe('50');
    });

    it('normalizes value on blur', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 0, min: 0, max: 100, step: 5 });
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;

      input.value = '53';
      input.dispatchEvent(new Event('blur', { bubbles: true }));

      expect(input.value).toBe('55');
      expect(input.getAttribute('aria-valuenow')).toBe('55');
    });
  });

  // 🟡 Medium Priority: IME Composition
  describe('IME Composition', () => {
    it('does not update value during IME composition', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;

      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      input.value = '123';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-valuenow')).toBe('50');
    });

    it('updates value on composition end', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;

      input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }));
      input.value = '75';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(input.getAttribute('aria-valuenow')).toBe('50');

      input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }));

      expect(input.getAttribute('aria-valuenow')).toBe('75');
    });
  });

  // 🟡 Medium Priority: Events
  describe('Events', () => {
    it('dispatches valuechange event on value change', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const component = container.querySelector('apg-spinbutton') as TestApgSpinbutton;
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const eventHandler = vi.fn();
      component.addEventListener('valuechange', eventHandler);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(eventHandler).toHaveBeenCalled();
      expect(eventHandler.mock.calls[0][0].detail.value).toBe(51);
    });

    it('does not dispatch event when value does not change', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 100, max: 100 });
      const component = container.querySelector('apg-spinbutton') as TestApgSpinbutton;
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const eventHandler = vi.fn();
      component.addEventListener('valuechange', eventHandler);

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(eventHandler).not.toHaveBeenCalled();
    });

    it('dispatches valuechange on text input', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 0 });
      const component = container.querySelector('apg-spinbutton') as TestApgSpinbutton;
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;

      const eventHandler = vi.fn();
      component.addEventListener('valuechange', eventHandler);

      input.value = '25';
      input.dispatchEvent(new Event('input', { bubbles: true }));

      expect(eventHandler).toHaveBeenCalled();
      expect(eventHandler.mock.calls[0][0].detail.value).toBe(25);
    });

    it('dispatches valuechange on button click', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 50 });
      const component = container.querySelector('apg-spinbutton') as TestApgSpinbutton;
      const incrementBtn = container.querySelector('.apg-spinbutton-increment') as HTMLElement;

      const eventHandler = vi.fn();
      component.addEventListener('valuechange', eventHandler);

      incrementBtn.click();

      expect(eventHandler).toHaveBeenCalled();
      expect(eventHandler.mock.calls[0][0].detail.value).toBe(51);
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal step values correctly', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 0.5, min: 0, max: 1, step: 0.1 });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('0.6');
    });

    it('clamps value to min/max on init', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: -10, min: 0, max: 100 });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('rounds value to step on init', () => {
      container.innerHTML = createSpinbuttonHTML({ defaultValue: 53, min: 0, max: 100, step: 5 });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('aria-valuenow')).toBe('55');
    });

    it('uses custom large step when provided', () => {
      container.innerHTML = createSpinbuttonHTML({
        defaultValue: 50,
        step: 1,
        largeStep: 20,
      });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      const event = new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuenow')).toBe('70');
    });
  });

  // 🟡 Medium Priority: Format
  describe('Format', () => {
    it('updates aria-valuetext with format on value change', () => {
      container.innerHTML = createSpinbuttonHTML({
        defaultValue: 5,
        min: 0,
        max: 10,
        format: '{value} of {max}',
      });
      const spinbutton = container.querySelector('[role="spinbutton"]') as HTMLElement;

      expect(spinbutton.getAttribute('aria-valuetext')).toBe('5 of 10');

      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true });
      spinbutton.dispatchEvent(event);

      expect(spinbutton.getAttribute('aria-valuetext')).toBe('6 of 10');
    });
  });

  // 🟢 Low Priority: HTML Attributes
  describe('HTML Attributes', () => {
    it('sets id attribute', () => {
      container.innerHTML = createSpinbuttonHTML({ id: 'my-spinbutton' });
      const spinbutton = container.querySelector('[role="spinbutton"]');
      expect(spinbutton?.getAttribute('id')).toBe('my-spinbutton');
    });

    it('has readonly attribute when read-only', () => {
      container.innerHTML = createSpinbuttonHTML({ readOnly: true });
      const input = container.querySelector('[role="spinbutton"]') as HTMLInputElement;
      expect(input.readOnly).toBe(true);
    });

    it('displays visible label when label provided', () => {
      container.innerHTML = createSpinbuttonHTML({ label: 'Quantity' });
      expect(container.querySelector('.apg-spinbutton-label')?.textContent).toBe('Quantity');
    });
  });
});
