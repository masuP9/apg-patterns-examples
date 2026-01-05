/**
 * Link Web Component Tests
 *
 * Note: These are unit tests for the Web Component class.
 * Full keyboard navigation and focus management tests require E2E testing
 * with Playwright due to jsdom limitations with focus events.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('Link (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgLink extends HTMLElement {
    private spanElement: HTMLSpanElement | null = null;
    private rafId: number | null = null;

    connectedCallback() {
      this.rafId = requestAnimationFrame(() => this.initialize());
    }

    private initialize() {
      this.rafId = null;
      this.spanElement = this.querySelector('span[role="link"]');

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

      if (event.key === 'Enter') {
        event.preventDefault();
        this.activate(event);
      }
    };

    private activate(_event: Event) {
      const href = this.dataset.href;
      const target = this.dataset.target;

      this.dispatchEvent(
        new CustomEvent('link-activate', {
          detail: { href, target },
          bubbles: true,
        })
      );

      if (href) {
        if (target === '_blank') {
          window.open(href, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = href;
        }
      }
    }

    private isDisabled(): boolean {
      return this.spanElement?.getAttribute('aria-disabled') === 'true';
    }

    // Expose for testing
    get _spanElement() {
      return this.spanElement;
    }
  }

  function createLinkHTML(
    options: {
      href?: string;
      target?: '_self' | '_blank';
      disabled?: boolean;
      ariaLabel?: string;
      text?: string;
    } = {}
  ) {
    const { href = '#', target, disabled = false, ariaLabel, text = 'Click here' } = options;

    const tabindex = disabled ? '-1' : '0';
    const ariaDisabled = disabled ? 'aria-disabled="true"' : '';
    const ariaLabelAttr = ariaLabel ? `aria-label="${ariaLabel}"` : '';

    return `
      <apg-link
        class="apg-link"
        data-href="${href}"
        ${target ? `data-target="${target}"` : ''}
      >
        <span
          role="link"
          tabindex="${tabindex}"
          ${ariaDisabled}
          ${ariaLabelAttr}
        >
          ${text}
        </span>
      </apg-link>
    `;
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Register custom element if not already registered
    if (!customElements.get('apg-link')) {
      customElements.define('apg-link', TestApgLink);
    }
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders with role="link"', async () => {
      container.innerHTML = createLinkHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]');
      expect(span).toBeTruthy();
    });

    it('renders with tabindex="0" by default', async () => {
      container.innerHTML = createLinkHTML();

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]');
      expect(span?.getAttribute('tabindex')).toBe('0');
    });

    it('renders with tabindex="-1" when disabled', async () => {
      container.innerHTML = createLinkHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]');
      expect(span?.getAttribute('tabindex')).toBe('-1');
    });

    it('renders with aria-disabled="true" when disabled', async () => {
      container.innerHTML = createLinkHTML({ disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]');
      expect(span?.getAttribute('aria-disabled')).toBe('true');
    });

    it('renders with aria-label for accessible name', async () => {
      container.innerHTML = createLinkHTML({ ariaLabel: 'Go to homepage' });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]');
      expect(span?.getAttribute('aria-label')).toBe('Go to homepage');
    });

    it('has text content as accessible name', async () => {
      container.innerHTML = createLinkHTML({ text: 'Learn more' });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]');
      expect(span?.textContent?.trim()).toBe('Learn more');
    });
  });

  describe('Click Interaction', () => {
    it('dispatches link-activate event on click', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com' });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-link') as HTMLElement;
      const span = container.querySelector('span[role="link"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('link-activate', activateHandler);

      span.click();

      expect(activateHandler).toHaveBeenCalledTimes(1);
      expect(activateHandler.mock.calls[0][0].detail.href).toBe('https://example.com');
    });

    it('does not dispatch event when disabled', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com', disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-link') as HTMLElement;
      const span = container.querySelector('span[role="link"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('link-activate', activateHandler);

      span.click();

      expect(activateHandler).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Interaction', () => {
    it('dispatches link-activate event on Enter key', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com' });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-link') as HTMLElement;
      const span = container.querySelector('span[role="link"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('link-activate', activateHandler);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      span.dispatchEvent(enterEvent);

      expect(activateHandler).toHaveBeenCalledTimes(1);
    });

    it('does not dispatch event on Space key', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com' });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-link') as HTMLElement;
      const span = container.querySelector('span[role="link"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('link-activate', activateHandler);

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      span.dispatchEvent(spaceEvent);

      expect(activateHandler).not.toHaveBeenCalled();
    });

    it('does not dispatch event when disabled (Enter key)', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com', disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-link') as HTMLElement;
      const span = container.querySelector('span[role="link"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('link-activate', activateHandler);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      span.dispatchEvent(enterEvent);

      expect(activateHandler).not.toHaveBeenCalled();
    });

    it('does not dispatch event when isComposing is true', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com' });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-link') as HTMLElement;
      const span = container.querySelector('span[role="link"]') as HTMLElement;

      const activateHandler = vi.fn();
      element.addEventListener('link-activate', activateHandler);

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(enterEvent, 'isComposing', { value: true });
      span.dispatchEvent(enterEvent);

      expect(activateHandler).not.toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // @ts-expect-error - delete window.location for mocking
      delete window.location;
      // @ts-expect-error - mock window.location
      window.location = { ...originalLocation, href: '' };
    });

    afterEach(() => {
      // @ts-expect-error - restore window.location
      window.location = originalLocation;
    });

    it('navigates to href on activation', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com' });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]') as HTMLElement;
      span.click();

      expect(window.location.href).toBe('https://example.com');
    });

    it('opens in new tab when target="_blank"', async () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      container.innerHTML = createLinkHTML({ href: 'https://example.com', target: '_blank' });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]') as HTMLElement;
      span.click();

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('does not navigate when disabled', async () => {
      container.innerHTML = createLinkHTML({ href: 'https://example.com', disabled: true });

      await new Promise((r) => requestAnimationFrame(r));

      const span = container.querySelector('span[role="link"]') as HTMLElement;
      span.click();

      expect(window.location.href).toBe('');
    });
  });
});
