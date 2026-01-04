/**
 * MenuButton Web Component Tests
 *
 * Note: These are limited unit tests for the Web Component class.
 * Full keyboard navigation and focus management tests require E2E testing
 * with Playwright due to jsdom limitations with focus events.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock the MenuButton Web Component for testing
// In a real E2E test, this would use the actual compiled Astro component
describe('MenuButton (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgMenuButton extends HTMLElement {
    private container: HTMLDivElement | null = null;
    private button: HTMLButtonElement | null = null;
    private menu: HTMLUListElement | null = null;
    private rafId: number | null = null;
    private isOpen = false;
    private focusedIndex = -1;
    private typeAheadBuffer = '';
    private typeAheadTimeoutId: number | null = null;
    private typeAheadTimeout = 500;

    connectedCallback() {
      this.rafId = requestAnimationFrame(() => this.initialize());
    }

    private initialize() {
      this.rafId = null;
      this.container = this.querySelector('.apg-menu-button');
      this.button = this.querySelector('[data-menu-trigger]');
      this.menu = this.querySelector('[data-menu-list]');

      if (!this.button || !this.menu) {
        return;
      }

      this.isOpen = this.dataset.defaultOpen === 'true';
      this.focusedIndex = parseInt(this.dataset.initialFocusIndex || '-1', 10);

      this.button.addEventListener('click', this.handleButtonClick);
      this.button.addEventListener('keydown', this.handleButtonKeyDown);
      this.menu.addEventListener('keydown', this.handleMenuKeyDown);
      this.menu.addEventListener('click', this.handleMenuClick);
      this.menu.addEventListener('focusin', this.handleMenuFocusIn);

      if (this.isOpen) {
        document.addEventListener('pointerdown', this.handleClickOutside);
      }
    }

    disconnectedCallback() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      if (this.typeAheadTimeoutId !== null) {
        clearTimeout(this.typeAheadTimeoutId);
        this.typeAheadTimeoutId = null;
      }
      document.removeEventListener('pointerdown', this.handleClickOutside);
      this.button?.removeEventListener('click', this.handleButtonClick);
      this.button?.removeEventListener('keydown', this.handleButtonKeyDown);
      this.menu?.removeEventListener('keydown', this.handleMenuKeyDown);
      this.menu?.removeEventListener('click', this.handleMenuClick);
      this.menu?.removeEventListener('focusin', this.handleMenuFocusIn);
    }

    private getItems(): HTMLLIElement[] {
      if (!this.menu) return [];
      return Array.from(this.menu.querySelectorAll<HTMLLIElement>('[role="menuitem"]'));
    }

    private getAvailableItems(): HTMLLIElement[] {
      return this.getItems().filter((item) => item.getAttribute('aria-disabled') !== 'true');
    }

    private openMenu(focusPosition: 'first' | 'last') {
      if (!this.button || !this.menu) return;

      const availableItems = this.getAvailableItems();

      this.isOpen = true;
      this.button.setAttribute('aria-expanded', 'true');
      this.menu.removeAttribute('hidden');
      this.menu.removeAttribute('inert');

      document.addEventListener('pointerdown', this.handleClickOutside);

      if (availableItems.length === 0) {
        this.focusedIndex = -1;
        return;
      }

      const targetIndex = focusPosition === 'first' ? 0 : availableItems.length - 1;
      this.focusedIndex = targetIndex;
      this.updateTabIndices();
      availableItems[targetIndex]?.focus();
    }

    private closeMenu() {
      if (!this.button || !this.menu) return;

      this.isOpen = false;
      this.focusedIndex = -1;
      this.button.setAttribute('aria-expanded', 'false');
      this.menu.setAttribute('hidden', '');
      this.menu.setAttribute('inert', '');

      this.typeAheadBuffer = '';
      if (this.typeAheadTimeoutId !== null) {
        clearTimeout(this.typeAheadTimeoutId);
        this.typeAheadTimeoutId = null;
      }

      document.removeEventListener('pointerdown', this.handleClickOutside);
      this.updateTabIndices();
    }

    private toggleMenu() {
      if (this.isOpen) {
        this.closeMenu();
      } else {
        this.openMenu('first');
      }
    }

    private updateTabIndices() {
      const items = this.getItems();
      const availableItems = this.getAvailableItems();

      items.forEach((item) => {
        if (item.getAttribute('aria-disabled') === 'true') {
          item.tabIndex = -1;
          return;
        }
        const availableIndex = availableItems.indexOf(item);
        item.tabIndex = availableIndex === this.focusedIndex ? 0 : -1;
      });
    }

    private focusItem(index: number) {
      const availableItems = this.getAvailableItems();
      if (index >= 0 && index < availableItems.length) {
        this.focusedIndex = index;
        this.updateTabIndices();
        availableItems[index]?.focus();
      }
    }

    private handleTypeAhead(char: string) {
      const availableItems = this.getAvailableItems();
      if (availableItems.length === 0) return;

      if (this.typeAheadTimeoutId !== null) {
        clearTimeout(this.typeAheadTimeoutId);
      }

      this.typeAheadBuffer += char.toLowerCase();

      const buffer = this.typeAheadBuffer;
      const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

      let startIndex: number;
      let searchStr: string;

      if (isSameChar) {
        this.typeAheadBuffer = buffer[0];
        searchStr = buffer[0];
        startIndex = this.focusedIndex >= 0 ? (this.focusedIndex + 1) % availableItems.length : 0;
      } else if (buffer.length === 1) {
        searchStr = buffer;
        startIndex = this.focusedIndex >= 0 ? (this.focusedIndex + 1) % availableItems.length : 0;
      } else {
        searchStr = buffer;
        startIndex = this.focusedIndex >= 0 ? this.focusedIndex : 0;
      }

      for (let i = 0; i < availableItems.length; i++) {
        const index = (startIndex + i) % availableItems.length;
        const item = availableItems[index];
        const label = item.textContent?.trim().toLowerCase() || '';
        if (label.startsWith(searchStr)) {
          this.focusItem(index);
          break;
        }
      }

      this.typeAheadTimeoutId = window.setTimeout(() => {
        this.typeAheadBuffer = '';
        this.typeAheadTimeoutId = null;
      }, this.typeAheadTimeout);
    }

    private handleButtonClick = () => {
      this.toggleMenu();
    };

    private handleButtonKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
        case ' ':
          event.preventDefault();
          this.openMenu('first');
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.openMenu('first');
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.openMenu('last');
          break;
      }
    };

    private handleMenuClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const item = target.closest('[role="menuitem"]') as HTMLLIElement | null;
      if (!item || item.getAttribute('aria-disabled') === 'true') return;

      const itemId = item.dataset.itemId;
      if (itemId) {
        this.dispatchEvent(
          new CustomEvent('itemselect', {
            detail: { itemId },
            bubbles: true,
          })
        );
      }
      this.closeMenu();
      this.button?.focus();
    };

    private handleMenuFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      const item = target.closest('[role="menuitem"]') as HTMLLIElement | null;
      if (!item || item.getAttribute('aria-disabled') === 'true') return;

      const availableItems = this.getAvailableItems();
      const index = availableItems.indexOf(item);
      if (index >= 0 && index !== this.focusedIndex) {
        this.focusedIndex = index;
        this.updateTabIndices();
      }
    };

    private handleMenuKeyDown = (event: KeyboardEvent) => {
      const availableItems = this.getAvailableItems();

      if (event.key === 'Escape') {
        event.preventDefault();
        this.closeMenu();
        this.button?.focus();
        return;
      }

      if (availableItems.length === 0) return;

      const target = event.target as HTMLElement;
      const currentItem = target.closest('[role="menuitem"]') as HTMLLIElement | null;
      const currentIndex = currentItem ? availableItems.indexOf(currentItem) : -1;

      if (currentIndex < 0) return;

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % availableItems.length;
          this.focusItem(nextIndex);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prevIndex = currentIndex === 0 ? availableItems.length - 1 : currentIndex - 1;
          this.focusItem(prevIndex);
          break;
        }
        case 'Home': {
          event.preventDefault();
          this.focusItem(0);
          break;
        }
        case 'End': {
          event.preventDefault();
          this.focusItem(availableItems.length - 1);
          break;
        }
        case 'Tab': {
          this.closeMenu();
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          const item = availableItems[currentIndex];
          const itemId = item?.dataset.itemId;
          if (itemId) {
            this.dispatchEvent(
              new CustomEvent('itemselect', {
                detail: { itemId },
                bubbles: true,
              })
            );
          }
          this.closeMenu();
          this.button?.focus();
          break;
        }
        default: {
          if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
            event.preventDefault();
            this.handleTypeAhead(event.key);
          }
        }
      }
    };

    private handleClickOutside = (event: PointerEvent) => {
      if (this.container && !this.container.contains(event.target as Node)) {
        this.closeMenu();
      }
    };

    // Expose for testing
    get _isOpen() {
      return this.isOpen;
    }
    get _focusedIndex() {
      return this.focusedIndex;
    }
  }

  function createMenuButtonHTML(
    options: {
      items?: { id: string; label: string; disabled?: boolean }[];
      defaultOpen?: boolean;
    } = {}
  ) {
    const { items = [{ id: 'item1', label: 'Item 1' }], defaultOpen = false } = options;
    const availableItems = items.filter((i) => !i.disabled);
    const initialFocusIndex = defaultOpen && availableItems.length > 0 ? 0 : -1;

    const itemsHTML = items
      .map((item) => {
        const availableIndex = availableItems.findIndex((i) => i.id === item.id);
        const isFocusTarget = availableIndex === initialFocusIndex;
        const tabIndex = item.disabled ? -1 : isFocusTarget ? 0 : -1;
        return `<li role="menuitem" data-item-id="${item.id}" tabindex="${tabIndex}" ${item.disabled ? 'aria-disabled="true"' : ''} class="apg-menu-button-item">${item.label}</li>`;
      })
      .join('');

    return `
      <apg-menu-button ${defaultOpen ? 'data-default-open="true"' : ''} data-initial-focus-index="${initialFocusIndex}">
        <div class="apg-menu-button">
          <button type="button" class="apg-menu-button-trigger" aria-haspopup="menu" aria-expanded="${defaultOpen}" aria-controls="menu-1" data-menu-trigger>
            Actions
          </button>
          <ul id="menu-1" role="menu" aria-labelledby="button-1" class="apg-menu-button-menu" ${!defaultOpen ? 'hidden inert' : ''} data-menu-list>
            ${itemsHTML}
          </ul>
        </div>
      </apg-menu-button>
    `;
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Register custom element if not already registered
    if (!customElements.get('apg-menu-button')) {
      customElements.define('apg-menu-button', TestApgMenuButton);
    }
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders with closed menu by default', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ],
      });

      // Wait for custom element to initialize
      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      expect(button).toBeTruthy();
      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(button.getAttribute('aria-haspopup')).toBe('menu');
      expect(menu.hasAttribute('hidden')).toBe(true);
    });

    it('renders with open menu when defaultOpen is true', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(menu.hasAttribute('hidden')).toBe(false);
    });

    it('renders menu items with role="menuitem"', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');
      expect(items.length).toBe(3);
      expect(items[0].textContent?.trim()).toBe('Cut');
      expect(items[1].textContent?.trim()).toBe('Copy');
      expect(items[2].textContent?.trim()).toBe('Paste');
    });

    it('renders disabled items with aria-disabled', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy', disabled: true },
          { id: 'paste', label: 'Paste' },
        ],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');
      expect(items[0].getAttribute('aria-disabled')).toBeNull();
      expect(items[1].getAttribute('aria-disabled')).toBe('true');
      expect(items[2].getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('Button Click', () => {
    it('opens menu on button click', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      button.click();

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(menu.hasAttribute('hidden')).toBe(false);
    });

    it('closes menu on second button click', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      button.click(); // Open
      button.click(); // Close

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(menu.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('Button Keyboard Navigation', () => {
    it('opens menu on Enter key', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(menu.hasAttribute('hidden')).toBe(false);
    });

    it('opens menu on Space key', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      button.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(menu.hasAttribute('hidden')).toBe(false);
    });

    it('opens menu and focuses first item on ArrowDown', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(menu.hasAttribute('hidden')).toBe(false);
      expect(items[0].getAttribute('tabindex')).toBe('0');
    });

    it('opens menu and focuses last item on ArrowUp', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      button.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));

      expect(items[1].getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Menu Item Selection', () => {
    it('dispatches itemselect event on item click', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-menu-button') as HTMLElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      const selectHandler = vi.fn();
      element.addEventListener('itemselect', selectHandler);

      (items[1] as HTMLLIElement).click();

      expect(selectHandler).toHaveBeenCalledTimes(1);
      expect(selectHandler.mock.calls[0][0].detail.itemId).toBe('copy');
    });

    it('closes menu after item selection', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      (items[0] as HTMLLIElement).click();

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(menu.hasAttribute('hidden')).toBe(true);
    });

    it('does not dispatch event for disabled item click', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut', disabled: true },
          { id: 'copy', label: 'Copy' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-menu-button') as HTMLElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      const selectHandler = vi.fn();
      element.addEventListener('itemselect', selectHandler);

      (items[0] as HTMLLIElement).click();

      expect(selectHandler).not.toHaveBeenCalled();
    });
  });

  describe('Menu Keyboard Navigation', () => {
    it('closes menu and focuses button on Escape', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(menu.hasAttribute('hidden')).toBe(true);
    });

    it('selects item on Enter key', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-menu-button') as HTMLElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      const selectHandler = vi.fn();
      element.addEventListener('itemselect', selectHandler);

      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

      expect(selectHandler).toHaveBeenCalledTimes(1);
      expect(selectHandler.mock.calls[0][0].detail.itemId).toBe('cut');
    });

    it('selects item on Space key', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-menu-button') as HTMLElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      const selectHandler = vi.fn();
      element.addEventListener('itemselect', selectHandler);

      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

      expect(selectHandler).toHaveBeenCalledTimes(1);
    });

    it('moves focus to next item on ArrowDown with wrapping', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');

      // First item should have tabindex 0 initially
      expect(items[0].getAttribute('tabindex')).toBe('0');

      // ArrowDown from first item
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('0');

      // ArrowDown from last item wraps to first
      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
    });

    it('moves focus to previous item on ArrowUp with wrapping', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');

      // ArrowUp from first item wraps to last
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('0');
    });

    it('moves focus to first item on Home', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');

      // Move to last item first
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      expect(items[2].getAttribute('tabindex')).toBe('0');

      // Press Home
      items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      expect(items[0].getAttribute('tabindex')).toBe('0');
    });

    it('moves focus to last item on End', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');

      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      expect(items[2].getAttribute('tabindex')).toBe('0');
    });

    it('closes menu on Tab key', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(menu.hasAttribute('hidden')).toBe(true);
    });
  });

  describe('Disabled Items', () => {
    it('skips disabled items in navigation', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy', disabled: true },
          { id: 'paste', label: 'Paste' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');

      // First available item has tabindex 0
      expect(items[0].getAttribute('tabindex')).toBe('0');

      // ArrowDown should skip disabled item
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));

      // Paste (index 2) should have tabindex 0, disabled Copy should have -1
      expect(items[1].getAttribute('tabindex')).toBe('-1');
      expect(items[2].getAttribute('tabindex')).toBe('0');
    });

    it('disabled items have tabindex -1', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy', disabled: true },
        ],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Click Outside', () => {
    it('closes menu when clicking outside', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      // Simulate click outside
      document.body.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

      expect(button.getAttribute('aria-expanded')).toBe('false');
      expect(menu.hasAttribute('hidden')).toBe(true);
    });

    it('does not close menu when clicking inside', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [{ id: 'cut', label: 'Cut' }],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      // Click inside menu container
      const menuContainer = container.querySelector('.apg-menu-button') as HTMLDivElement;
      menuContainer.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(menu.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('Type-ahead', () => {
    it('focuses matching item on character input', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');

      // Type 'p' to focus Paste
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'p', bubbles: true }));

      expect(items[2].getAttribute('tabindex')).toBe('0');
    });

    it('cycles through items starting with same character', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'clear', label: 'Clear' },
        ],
        defaultOpen: true,
      });

      await new Promise((r) => requestAnimationFrame(r));

      const items = container.querySelectorAll('[role="menuitem"]');

      // Type 'c' - should go to Copy (next after Cut which starts with C)
      items[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
      expect(items[1].getAttribute('tabindex')).toBe('0');

      // Type 'c' again - should go to Clear
      items[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
      expect(items[2].getAttribute('tabindex')).toBe('0');

      // Type 'c' again - should wrap to Cut
      items[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'c', bubbles: true }));
      expect(items[0].getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Empty Items', () => {
    it('opens empty menu without focusing any item', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const menu = container.querySelector('[data-menu-list]') as HTMLUListElement;

      button.click();

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(menu.hasAttribute('hidden')).toBe(false);
    });
  });

  describe('All Items Disabled', () => {
    it('opens menu but does not focus any item when all disabled', async () => {
      container.innerHTML = createMenuButtonHTML({
        items: [
          { id: 'cut', label: 'Cut', disabled: true },
          { id: 'copy', label: 'Copy', disabled: true },
        ],
      });

      await new Promise((r) => requestAnimationFrame(r));

      const button = container.querySelector('[data-menu-trigger]') as HTMLButtonElement;
      const items = container.querySelectorAll('[role="menuitem"]');

      button.click();

      expect(button.getAttribute('aria-expanded')).toBe('true');
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
    });
  });
});
