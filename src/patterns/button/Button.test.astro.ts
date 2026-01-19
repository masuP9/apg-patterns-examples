/**
 * Button Web Component Tests
 *
 * Note: These are unit tests for the Web Component class.
 * Full keyboard navigation and focus management tests require E2E testing
 * with Playwright due to jsdom limitations with focus events.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Button (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgButton extends HTMLElement {
    private spanElement: HTMLSpanElement | null = null;
    private rafId: number | null = null;

    connectedCallback() {
      this.rafId = requestAnimationFrame(() => this.initialize());
    }

    private initialize() {
      this.rafId = null;
      this.spanElement = this.querySelector('span[role="button"]');

      if (!this.spanElement) {
        return;
      }

      this.spanElement.addEventListener('click', this.handleClick);
      this.spanElement.addEventListener('keydown', this.handleKeyDown);
    }

    disconnectedCallback() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.spanElement?.removeEventListener('click', this.handleClick);
      this.spanElement?.removeEventListener('keydown', this.handleKeyDown);
    }

    private handleClick = (event: MouseEvent) => {
      if (this.isDisabled()) {
        event.preventDefault();
        return;
      }

      this.activate(event);
    };

    private handleKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || event.defaultPrevented) {
        return;
      }

      if (this.isDisabled()) {
        return;
      }

      // Button activates on both Space and Enter (unlike links)
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault(); // Prevent Space from scrolling
        this.activate(event);
      }
    };

    private activate(_event: Event) {
      this.dispatchEvent(
        new CustomEvent('button-activate', {
          bubbles: true,
        })
      );
    }

    private isDisabled(): boolean {
      return this.spanElement?.getAttribute('aria-disabled') === 'true';
    }

    // Expose for testing
    get _spanElement() {
      return this.spanElement;
    }
  }

  function createButtonHTML(
    options: {
      disabled?: boolean;
      ariaLabel?: string;
      text?: string;
    } = {}
  ) {
    const { disabled = false, ariaLabel, text = 'Click me' } = options;

    const tabindex = disabled ? '-1' : '0';
    const ariaDisabled = disabled ? 'aria-disabled="true"' : '';
    const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';

    return `
      <apg-button class="apg-button">
        <span
          role="button"
          tabindex="${tabindex}"
          ${ariaDisabled}
          ${ariaLabelAttr}
        >
          ${text}
        </span>
      </apg-button>
    `;
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Register custom element if not already registered
    if (!customElements.get('apg-button')) {
      customElements.define('apg-button', TestApgButton);
    }
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders with role="button"', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]');
      expect(span).toBeTruthy();
    });

    it('renders with tabindex="0" by default', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]');
      expect(span?.getAttribute('tabindex')).toBe('0');
    });

    it('renders with tabindex="-1" when disabled', async () => {
      container.innerHTML = createButtonHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]');
      expect(span?.getAttribute('tabindex')).toBe('-1');
    });

    it('renders with aria-disabled="true" when disabled', async () => {
      container.innerHTML = createButtonHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]');
      expect(span?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-pressed (not a toggle button)', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]');
      expect(span?.hasAttribute('aria-pressed')).toBe(false);
    });

    it('renders with aria-label for accessible name', async () => {
      container.innerHTML = createButtonHTML({ ariaLabel: 'Close dialog' });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]');
      expect(span?.getAttribute('aria-label')).toBe('Close dialog');
    });

    it('has text content as accessible name', async () => {
      container.innerHTML = createButtonHTML({ text: 'Submit Form' });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]');
      expect(span?.textContent?.trim()).toBe('Submit Form');
    });
  });

  describe('Click Interaction', () => {
    it('dispatches button-activate event on click', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      span.click();

      expect(activateHandler).toHaveBeenCalledTimes(1);
    });

    it('does not dispatch event when disabled', async () => {
      container.innerHTML = createButtonHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      span.click();

      expect(activateHandler).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('dispatches button-activate event on Space key', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      span.dispatchEvent(spaceEvent);

      expect(activateHandler).toHaveBeenCalledTimes(1);
    });

    it('dispatches button-activate event on Enter key', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      span.dispatchEvent(enterEvent);

      expect(activateHandler).toHaveBeenCalledTimes(1);
    });

    it('prevents default on Space key to avoid page scrolling', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');

      span.dispatchEvent(spaceEvent);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('does not dispatch event when disabled (Space key)', async () => {
      container.innerHTML = createButtonHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      span.dispatchEvent(spaceEvent);

      expect(activateHandler).not.toHaveBeenCalled();
    });

    it('does not dispatch event when disabled (Enter key)', async () => {
      container.innerHTML = createButtonHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      span.dispatchEvent(enterEvent);

      expect(activateHandler).not.toHaveBeenCalled();
    });

    it('does not dispatch event when isComposing is true', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(enterEvent, 'isComposing', { value: true });
      span.dispatchEvent(enterEvent);

      expect(activateHandler).not.toHaveBeenCalled();
    });

    it('does not dispatch event when defaultPrevented is true', async () => {
      container.innerHTML = createButtonHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-button') as HTMLElement;
      const span = container.querySelector('span[role="button"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('button-activate', activateHandler);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      enterEvent.preventDefault();
      span.dispatchEvent(enterEvent);

      expect(activateHandler).not.toHaveBeenCalled();
    });
  });
});
