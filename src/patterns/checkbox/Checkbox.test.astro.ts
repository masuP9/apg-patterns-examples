/**
 * Checkbox Web Component Tests
 *
 * Note: These are unit tests for the Web Component class.
 * Full keyboard navigation and focus management tests require E2E testing
 * with Playwright due to jsdom limitations with focus events.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Checkbox (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgCheckbox extends HTMLElement {
    private input: HTMLInputElement | null = null;
    private rafId: number | null = null;

    connectedCallback() {
      this.rafId = requestAnimationFrame(() => this.initialize());
    }

    private initialize() {
      this.rafId = null;
      this.input = this.querySelector('input[type="checkbox"]');

      if (!this.input) {
        return;
      }

      // Set initial indeterminate state if specified
      if (this.dataset.indeterminate === 'true') {
        this.input.indeterminate = true;
      }

      this.input.addEventListener('change', this.handleChange);
    }

    disconnectedCallback() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.input?.removeEventListener('change', this.handleChange);
    }

    private handleChange = (event: Event) => {
      const target = event.target as HTMLInputElement;

      // Clear indeterminate on user interaction
      if (target.indeterminate) {
        target.indeterminate = false;
      }

      this.dispatchEvent(
        new CustomEvent('checkedchange', {
          detail: { checked: target.checked },
          bubbles: true,
        })
      );
    };

    // Expose for testing
    get _input() {
      return this.input;
    }
  }

  function createCheckboxHTML(
    options: {
      checked?: boolean;
      disabled?: boolean;
      indeterminate?: boolean;
      name?: string;
      value?: string;
      id?: string;
      ariaLabel?: string;
    } = {}
  ) {
    const {
      checked = false,
      disabled = false,
      indeterminate = false,
      name,
      value,
      id,
      ariaLabel = 'Accept terms',
    } = options;

    return `
      <apg-checkbox class="apg-checkbox" ${indeterminate ? 'data-indeterminate="true"' : ''}>
        <input
          type="checkbox"
          class="apg-checkbox-input"
          ${id ? `id="${id}"` : ''}
          ${checked ? 'checked' : ''}
          ${disabled ? 'disabled' : ''}
          ${name ? `name="${name}"` : ''}
          ${value ? `value="${value}"` : ''}
          aria-label="${ariaLabel}"
        />
        <span class="apg-checkbox-control" aria-hidden="true">
          <span class="apg-checkbox-icon apg-checkbox-icon--check">✓</span>
          <span class="apg-checkbox-icon apg-checkbox-icon--indeterminate">−</span>
        </span>
      </apg-checkbox>
    `;
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Register custom element if not already registered
    if (!customElements.get('apg-checkbox')) {
      customElements.define('apg-checkbox', TestApgCheckbox);
    }
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders with unchecked state by default', async () => {
      container.innerHTML = createCheckboxHTML();

      // Wait for custom element to initialize
      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input).toBeTruthy();
      expect(input.checked).toBe(false);
    });

    it('renders with checked state when checked is true', async () => {
      container.innerHTML = createCheckboxHTML({ checked: true });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).toBe(true);
    });

    it('renders with disabled state', async () => {
      container.innerHTML = createCheckboxHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('renders with indeterminate state', async () => {
      container.innerHTML = createCheckboxHTML({ indeterminate: true });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.indeterminate).toBe(true);
    });

    it('renders with name attribute', async () => {
      container.innerHTML = createCheckboxHTML({ name: 'terms' });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.name).toBe('terms');
    });

    it('renders with value attribute', async () => {
      container.innerHTML = createCheckboxHTML({ value: 'accepted' });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.value).toBe('accepted');
    });

    it('renders with id attribute for external label association', async () => {
      container.innerHTML = createCheckboxHTML({ id: 'my-checkbox' });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.id).toBe('my-checkbox');
    });
  });

  describe('Click Interaction', () => {
    it('toggles checked on click', async () => {
      container.innerHTML = createCheckboxHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(false);

      input.click();
      expect(input.checked).toBe(true);

      input.click();
      expect(input.checked).toBe(false);
    });

    it('dispatches checkedchange event on click', async () => {
      container.innerHTML = createCheckboxHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-checkbox') as HTMLElement;
      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

      const changeHandler = vi.fn();
      element.addEventListener('checkedchange', changeHandler);

      input.click();

      expect(changeHandler).toHaveBeenCalledTimes(1);
      expect(changeHandler.mock.calls[0][0].detail.checked).toBe(true);
    });

    it('does not toggle when disabled', async () => {
      container.innerHTML = createCheckboxHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(false);
      input.click();
      expect(input.checked).toBe(false);
    });

    it('clears indeterminate on click', async () => {
      container.innerHTML = createCheckboxHTML({ indeterminate: true });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.indeterminate).toBe(true);
      input.click();
      expect(input.indeterminate).toBe(false);
    });
  });

  describe('External Label Association', () => {
    it('can be associated with external label via for/id', async () => {
      container.innerHTML = `
        <label for="terms-cb">Accept terms</label>
        ${createCheckboxHTML({ id: 'terms-cb', ariaLabel: '' })}
      `;

      await new Promise((r) => requestAnimationFrame(r));

      const label = container.querySelector('label') as HTMLLabelElement;
      const input = container.querySelector('input[type="checkbox"]') as HTMLInputElement;

      expect(input.checked).toBe(false);
      label.click();
      expect(input.checked).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has proper input type', async () => {
      container.innerHTML = createCheckboxHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.type).toBe('checkbox');
    });

    it('supports aria-label for accessible name', async () => {
      container.innerHTML = createCheckboxHTML({ ariaLabel: 'Accept terms and conditions' });

      await new Promise((r) => requestAnimationFrame(r));

      const input = container.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-label')).toBe('Accept terms and conditions');
    });

    it('control is marked as aria-hidden', async () => {
      container.innerHTML = createCheckboxHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const control = container.querySelector('.apg-checkbox-control');
      expect(control?.getAttribute('aria-hidden')).toBe('true');
    });
  });
});
