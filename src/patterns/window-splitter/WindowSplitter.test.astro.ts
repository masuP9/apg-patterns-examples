/**
 * WindowSplitter Web Component Tests
 *
 * Unit tests for the Web Component class.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('WindowSplitter (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgWindowSplitter extends HTMLElement {
    private separator: HTMLElement | null = null;
    private containerEl: HTMLElement | null = null;
    private isDragging = false;
    private previousPosition: number | null = null;
    private collapsed = false;

    connectedCallback() {
      this.separator = this.querySelector('[role="separator"]');
      this.containerEl = this.querySelector('.apg-window-splitter');

      // Initialize state from data attributes
      this.collapsed = this.dataset.collapsed === 'true';
      if (!this.collapsed) {
        this.previousPosition = this.currentPosition;
      }

      if (this.separator) {
        this.separator.addEventListener('keydown', this.handleKeyDown.bind(this));
      }
    }

    private get min(): number {
      return Number(this.dataset.min) || 10;
    }

    private get max(): number {
      return Number(this.dataset.max) || 90;
    }

    private get step(): number {
      return Number(this.dataset.step) || 5;
    }

    private get largeStep(): number {
      return Number(this.dataset.largeStep) || 10;
    }

    private get orientation(): string {
      return this.dataset.orientation || 'horizontal';
    }

    private get isHorizontal(): boolean {
      return this.orientation === 'horizontal';
    }

    private get isVertical(): boolean {
      return this.orientation === 'vertical';
    }

    private get textDir(): string | undefined {
      return this.dataset.dir;
    }

    private get isRTL(): boolean {
      if (this.textDir === 'rtl') return true;
      if (this.textDir === 'ltr') return false;
      return document.dir === 'rtl';
    }

    private get isCollapsible(): boolean {
      return this.dataset.collapsible !== 'false';
    }

    private get isDisabled(): boolean {
      return this.dataset.disabled === 'true';
    }

    private get isReadonly(): boolean {
      return this.dataset.readonly === 'true';
    }

    private get defaultPosition(): number {
      return Number(this.dataset.defaultPosition) || 50;
    }

    private get expandedPosition(): number | undefined {
      const val = this.dataset.expandedPosition;
      return val !== undefined ? Number(val) : undefined;
    }

    private get currentPosition(): number {
      return Number(this.separator?.getAttribute('aria-valuenow')) || 0;
    }

    private clamp(value: number): number {
      return Math.min(this.max, Math.max(this.min, value));
    }

    private updatePosition(newPosition: number) {
      if (!this.separator || this.isDisabled) return;

      const clampedPosition = this.clamp(newPosition);
      const currentPosition = this.currentPosition;

      if (clampedPosition === currentPosition) return;

      this.separator.setAttribute('aria-valuenow', String(clampedPosition));

      if (this.containerEl) {
        this.containerEl.style.setProperty(
          '--splitter-position',
          `${clampedPosition}%`
        );
      }

      this.dispatchEvent(
        new CustomEvent('positionchange', {
          detail: { position: clampedPosition },
          bubbles: true,
        })
      );
    }

    private handleToggleCollapse() {
      if (!this.isCollapsible || this.isDisabled || this.isReadonly) return;
      if (!this.separator) return;

      if (this.collapsed) {
        // Expand
        const restorePosition =
          this.previousPosition ??
          this.expandedPosition ??
          this.defaultPosition ??
          50;
        const clampedRestore = this.clamp(restorePosition);

        this.dispatchEvent(
          new CustomEvent('collapsedchange', {
            detail: { collapsed: false, previousPosition: this.currentPosition },
            bubbles: true,
          })
        );

        this.collapsed = false;
        this.separator.setAttribute('aria-valuenow', String(clampedRestore));

        if (this.containerEl) {
          this.containerEl.style.setProperty(
            '--splitter-position',
            `${clampedRestore}%`
          );
        }

        this.dispatchEvent(
          new CustomEvent('positionchange', {
            detail: { position: clampedRestore },
            bubbles: true,
          })
        );
      } else {
        // Collapse
        this.previousPosition = this.currentPosition;

        this.dispatchEvent(
          new CustomEvent('collapsedchange', {
            detail: { collapsed: true, previousPosition: this.currentPosition },
            bubbles: true,
          })
        );

        this.collapsed = true;
        this.separator.setAttribute('aria-valuenow', '0');

        if (this.containerEl) {
          this.containerEl.style.setProperty('--splitter-position', '0%');
        }

        this.dispatchEvent(
          new CustomEvent('positionchange', {
            detail: { position: 0, sizeInPx: 0 },
            bubbles: true,
          })
        );
      }
    }

    private handleKeyDown(event: KeyboardEvent) {
      if (this.isDisabled || this.isReadonly) return;

      const hasShift = event.shiftKey;
      const currentStep = hasShift ? this.largeStep : this.step;

      let delta = 0;
      let handled = false;

      switch (event.key) {
        case 'ArrowRight':
          if (!this.isHorizontal) break;
          delta = this.isRTL ? -currentStep : currentStep;
          handled = true;
          break;

        case 'ArrowLeft':
          if (!this.isHorizontal) break;
          delta = this.isRTL ? currentStep : -currentStep;
          handled = true;
          break;

        case 'ArrowUp':
          if (!this.isVertical) break;
          delta = currentStep;
          handled = true;
          break;

        case 'ArrowDown':
          if (!this.isVertical) break;
          delta = -currentStep;
          handled = true;
          break;

        case 'Enter':
          this.handleToggleCollapse();
          handled = true;
          break;

        case 'Home':
          this.updatePosition(this.min);
          handled = true;
          break;

        case 'End':
          this.updatePosition(this.max);
          handled = true;
          break;
      }

      if (handled) {
        event.preventDefault();
        if (delta !== 0) {
          this.updatePosition(this.currentPosition + delta);
        }
      }
    }

    setPosition(newPosition: number) {
      this.updatePosition(newPosition);
    }

    toggleCollapse() {
      this.handleToggleCollapse();
    }

    // Expose for testing
    get _separator() {
      return this.separator;
    }
    get _containerEl() {
      return this.containerEl;
    }
    get _collapsed() {
      return this.collapsed;
    }
  }

  function createSplitterHTML(
    options: {
      position?: number;
      min?: number;
      max?: number;
      step?: number;
      largeStep?: number;
      orientation?: 'horizontal' | 'vertical';
      dir?: 'ltr' | 'rtl';
      collapsible?: boolean;
      disabled?: boolean;
      readonly?: boolean;
      collapsed?: boolean;
      expandedPosition?: number;
      ariaLabel?: string;
      primaryPaneId?: string;
      secondaryPaneId?: string;
    } = {}
  ): string {
    const {
      position = 50,
      min = 10,
      max = 90,
      step = 5,
      largeStep = 10,
      orientation = 'horizontal',
      dir,
      collapsible = true,
      disabled = false,
      readonly = false,
      collapsed = false,
      expandedPosition,
      ariaLabel = 'Resize panels',
      primaryPaneId = 'primary',
      secondaryPaneId,
    } = options;

    const initialPosition = collapsed ? 0 : Math.min(max, Math.max(min, position));
    const isVertical = orientation === 'vertical';
    const ariaControls = secondaryPaneId
      ? `${primaryPaneId} ${secondaryPaneId}`
      : primaryPaneId;

    return `
      <apg-window-splitter
        data-min="${min}"
        data-max="${max}"
        data-step="${step}"
        data-large-step="${largeStep}"
        data-orientation="${orientation}"
        ${dir ? `data-dir="${dir}"` : ''}
        data-collapsible="${collapsible}"
        data-disabled="${disabled}"
        data-readonly="${readonly}"
        data-default-position="${position}"
        ${expandedPosition !== undefined ? `data-expanded-position="${expandedPosition}"` : ''}
        data-collapsed="${collapsed}"
      >
        <div
          class="apg-window-splitter ${isVertical ? 'apg-window-splitter--vertical' : ''} ${disabled ? 'apg-window-splitter--disabled' : ''}"
          style="--splitter-position: ${initialPosition}%"
        >
          <div
            role="separator"
            tabindex="${disabled ? -1 : 0}"
            aria-valuenow="${initialPosition}"
            aria-valuemin="${min}"
            aria-valuemax="${max}"
            aria-controls="${ariaControls}"
            ${isVertical ? 'aria-orientation="vertical"' : ''}
            ${disabled ? 'aria-disabled="true"' : ''}
            aria-label="${ariaLabel}"
            class="apg-window-splitter__separator"
          ></div>
        </div>
      </apg-window-splitter>
    `;
  }

  beforeEach(() => {
    // Register custom element if not registered
    if (!customElements.get('apg-window-splitter')) {
      customElements.define('apg-window-splitter', TestApgWindowSplitter);
    }

    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  // Helper to dispatch keyboard events
  function pressKey(
    element: HTMLElement,
    key: string,
    options: { shiftKey?: boolean } = {}
  ) {
    const event = new KeyboardEvent('keydown', {
      key,
      bubbles: true,
      cancelable: true,
      ...options,
    });
    element.dispatchEvent(event);
  }

  describe('ARIA Attributes', () => {
    it('has role="separator"', () => {
      container.innerHTML = createSplitterHTML();
      const separator = container.querySelector('[role="separator"]');
      expect(separator).toBeTruthy();
    });

    it('has aria-valuenow set to initial position', () => {
      container.innerHTML = createSplitterHTML({ position: 30 });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('30');
    });

    it('has aria-valuenow="0" when collapsed', () => {
      container.innerHTML = createSplitterHTML({ collapsed: true });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('0');
    });

    it('has aria-valuemin set', () => {
      container.innerHTML = createSplitterHTML({ min: 5 });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuemin')).toBe('5');
    });

    it('has aria-valuemax set', () => {
      container.innerHTML = createSplitterHTML({ max: 95 });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuemax')).toBe('95');
    });

    it('has aria-controls referencing primary pane', () => {
      container.innerHTML = createSplitterHTML({ primaryPaneId: 'main-panel' });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-controls')).toBe('main-panel');
    });

    it('has aria-controls referencing both panes', () => {
      container.innerHTML = createSplitterHTML({
        primaryPaneId: 'primary',
        secondaryPaneId: 'secondary',
      });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-controls')).toBe('primary secondary');
    });

    it('has aria-disabled="true" when disabled', () => {
      container.innerHTML = createSplitterHTML({ disabled: true });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-disabled')).toBe('true');
    });

    // Note: aria-readonly is not a valid attribute for role="separator"
    // Readonly behavior is enforced via JavaScript only

    it('has aria-orientation="vertical" for vertical splitter', () => {
      container.innerHTML = createSplitterHTML({ orientation: 'vertical' });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-orientation')).toBe('vertical');
    });
  });

  describe('Keyboard Interaction - Horizontal', () => {
    it('increases value by step on ArrowRight', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight');

      expect(separator.getAttribute('aria-valuenow')).toBe('55');
    });

    it('decreases value by step on ArrowLeft', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowLeft');

      expect(separator.getAttribute('aria-valuenow')).toBe('45');
    });

    it('increases value by largeStep on Shift+ArrowRight', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, largeStep: 10 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight', { shiftKey: true });

      expect(separator.getAttribute('aria-valuenow')).toBe('60');
    });

    it('ignores ArrowUp on horizontal splitter', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowUp');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });

    it('ignores ArrowDown on horizontal splitter', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowDown');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });
  });

  describe('Keyboard Interaction - Vertical', () => {
    it('increases value by step on ArrowUp', async () => {
      container.innerHTML = createSplitterHTML({
        position: 50,
        orientation: 'vertical',
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowUp');

      expect(separator.getAttribute('aria-valuenow')).toBe('55');
    });

    it('decreases value by step on ArrowDown', async () => {
      container.innerHTML = createSplitterHTML({
        position: 50,
        orientation: 'vertical',
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowDown');

      expect(separator.getAttribute('aria-valuenow')).toBe('45');
    });

    it('ignores ArrowLeft on vertical splitter', async () => {
      container.innerHTML = createSplitterHTML({
        position: 50,
        orientation: 'vertical',
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowLeft');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });

    it('ignores ArrowRight on vertical splitter', async () => {
      container.innerHTML = createSplitterHTML({
        position: 50,
        orientation: 'vertical',
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });
  });

  describe('Keyboard Interaction - Collapse/Expand', () => {
    it('collapses on Enter', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'Enter');

      expect(separator.getAttribute('aria-valuenow')).toBe('0');
    });

    it('restores previous value on Enter after collapse', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'Enter'); // Collapse
      pressKey(separator, 'Enter'); // Expand

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });

    it('expands to expandedPosition when initially collapsed', async () => {
      container.innerHTML = createSplitterHTML({
        collapsed: true,
        expandedPosition: 30,
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'Enter');

      expect(separator.getAttribute('aria-valuenow')).toBe('30');
    });

    it('does not collapse when collapsible is false', async () => {
      container.innerHTML = createSplitterHTML({
        position: 50,
        collapsible: false,
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'Enter');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });
  });

  describe('Keyboard Interaction - Home/End', () => {
    it('sets min value on Home', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, min: 10 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'Home');

      expect(separator.getAttribute('aria-valuenow')).toBe('10');
    });

    it('sets max value on End', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, max: 90 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'End');

      expect(separator.getAttribute('aria-valuenow')).toBe('90');
    });
  });

  describe('Keyboard Interaction - RTL', () => {
    it('ArrowLeft increases value in RTL mode', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, dir: 'rtl' });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowLeft');

      expect(separator.getAttribute('aria-valuenow')).toBe('55');
    });

    it('ArrowRight decreases value in RTL mode', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, dir: 'rtl' });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight');

      expect(separator.getAttribute('aria-valuenow')).toBe('45');
    });
  });

  describe('Keyboard Interaction - Disabled/Readonly', () => {
    it('does not change value when disabled', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, disabled: true });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });

    it('does not change value when readonly', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, readonly: true });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });

    it('does not collapse when disabled', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, disabled: true });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'Enter');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });

    it('does not collapse when readonly', async () => {
      container.innerHTML = createSplitterHTML({ position: 50, readonly: true });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'Enter');

      expect(separator.getAttribute('aria-valuenow')).toBe('50');
    });
  });

  describe('Focus Management', () => {
    it('has tabindex="0" on separator', () => {
      container.innerHTML = createSplitterHTML();
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" when disabled', () => {
      container.innerHTML = createSplitterHTML({ disabled: true });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('tabindex')).toBe('-1');
    });

    it('has tabindex="0" when readonly', () => {
      container.innerHTML = createSplitterHTML({ readonly: true });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Edge Cases', () => {
    it('does not exceed max on ArrowRight', async () => {
      container.innerHTML = createSplitterHTML({
        position: 88,
        max: 90,
        step: 5,
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight');

      expect(separator.getAttribute('aria-valuenow')).toBe('90');
    });

    it('does not go below min on ArrowLeft', async () => {
      container.innerHTML = createSplitterHTML({
        position: 12,
        min: 10,
        step: 5,
      });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const separator = element._separator!;
      pressKey(separator, 'ArrowLeft');

      expect(separator.getAttribute('aria-valuenow')).toBe('10');
    });

    it('clamps defaultPosition to min', () => {
      container.innerHTML = createSplitterHTML({ position: 5, min: 10 });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('10');
    });

    it('clamps defaultPosition to max', () => {
      container.innerHTML = createSplitterHTML({ position: 95, max: 90 });
      const separator = container.querySelector('[role="separator"]');
      expect(separator?.getAttribute('aria-valuenow')).toBe('90');
    });
  });

  describe('Events', () => {
    it('dispatches positionchange on keyboard interaction', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const handler = vi.fn();
      element.addEventListener('positionchange', handler);

      const separator = element._separator!;
      pressKey(separator, 'ArrowRight');

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.position).toBe(55);
    });

    it('dispatches collapsedchange on collapse', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const handler = vi.fn();
      element.addEventListener('collapsedchange', handler);

      const separator = element._separator!;
      pressKey(separator, 'Enter');

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.collapsed).toBe(true);
      expect(handler.mock.calls[0][0].detail.previousPosition).toBe(50);
    });

    it('dispatches collapsedchange on expand', async () => {
      container.innerHTML = createSplitterHTML({ collapsed: true });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      const handler = vi.fn();
      element.addEventListener('collapsedchange', handler);

      const separator = element._separator!;
      pressKey(separator, 'Enter');

      expect(handler).toHaveBeenCalled();
      expect(handler.mock.calls[0][0].detail.collapsed).toBe(false);
    });
  });

  describe('Public API', () => {
    it('can set position programmatically', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      element.setPosition(70);

      const separator = element._separator!;
      expect(separator.getAttribute('aria-valuenow')).toBe('70');
    });

    it('can toggle collapse programmatically', async () => {
      container.innerHTML = createSplitterHTML({ position: 50 });
      const element = container.querySelector(
        'apg-window-splitter'
      ) as TestApgWindowSplitter;
      await customElements.whenDefined('apg-window-splitter');
      element.connectedCallback();

      element.toggleCollapse();

      const separator = element._separator!;
      expect(separator.getAttribute('aria-valuenow')).toBe('0');
    });
  });
});
