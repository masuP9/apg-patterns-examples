/**
 * AlertDialog Web Component Tests
 *
 * Note: These are limited unit tests for the Web Component class.
 * Full keyboard navigation and focus management tests require E2E testing
 * with Playwright due to jsdom limitations with focus events and <dialog> element.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('AlertDialog (Web Component)', () => {
  let container: HTMLElement;

  // Web Component class extracted for testing
  class TestApgAlertDialog extends HTMLElement {
    private dialog: HTMLDialogElement | null = null;
    private triggerRef: HTMLElement | null = null;
    private cancelButton: HTMLButtonElement | null = null;
    private confirmButton: HTMLButtonElement | null = null;
    private rafId: number | null = null;

    connectedCallback() {
      this.rafId = requestAnimationFrame(() => this.initialize());
    }

    private initialize() {
      this.rafId = null;
      this.dialog = this.querySelector('dialog');
      this.cancelButton = this.querySelector('[data-cancel]');
      this.confirmButton = this.querySelector('[data-confirm]');

      if (!this.dialog) return;

      // Set up event listeners
      this.dialog.addEventListener('keydown', this.handleKeyDown);
      this.cancelButton?.addEventListener('click', this.handleCancel);
      this.confirmButton?.addEventListener('click', this.handleConfirm);
    }

    disconnectedCallback() {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
      this.dialog?.removeEventListener('keydown', this.handleKeyDown);
      this.cancelButton?.removeEventListener('click', this.handleCancel);
      this.confirmButton?.removeEventListener('click', this.handleConfirm);
    }

    open(triggerElement?: HTMLElement) {
      if (!this.dialog) return;
      this.triggerRef = triggerElement || null;
      this.dialog.showModal();

      // Focus cancel button (safest action)
      requestAnimationFrame(() => {
        this.cancelButton?.focus();
      });
    }

    close() {
      if (!this.dialog) return;
      this.dialog.close();
      this.triggerRef?.focus();
    }

    private handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        const allowEscapeClose = this.dataset.allowEscapeClose === 'true';
        if (!allowEscapeClose) {
          event.preventDefault();
        } else {
          this.dispatchEvent(new CustomEvent('cancel', { bubbles: true }));
        }
      }
    };

    private handleCancel = () => {
      this.dispatchEvent(new CustomEvent('cancel', { bubbles: true }));
      this.close();
    };

    private handleConfirm = () => {
      this.dispatchEvent(new CustomEvent('confirm', { bubbles: true }));
      this.close();
    };
  }

  function createAlertDialogHTML(
    options: {
      title?: string;
      message?: string;
      confirmLabel?: string;
      cancelLabel?: string;
      allowEscapeClose?: boolean;
      open?: boolean;
    } = {}
  ) {
    const {
      title = 'Confirm Action',
      message = 'Are you sure?',
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      allowEscapeClose = false,
      open = false,
    } = options;

    const titleId = 'alert-title';
    const messageId = 'alert-message';

    return `
      <apg-alert-dialog ${allowEscapeClose ? 'data-allow-escape-close="true"' : ''}>
        <dialog
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="${titleId}"
          aria-describedby="${messageId}"
          class="apg-alert-dialog"
          ${open ? 'open' : ''}
        >
          <h2 id="${titleId}" class="apg-alert-dialog-title">${title}</h2>
          <p id="${messageId}" class="apg-alert-dialog-message">${message}</p>
          <div class="apg-alert-dialog-actions">
            <button type="button" data-cancel class="apg-alert-dialog-cancel">${cancelLabel}</button>
            <button type="button" data-confirm class="apg-alert-dialog-confirm">${confirmLabel}</button>
          </div>
        </dialog>
      </apg-alert-dialog>
    `;
  }

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Register custom element if not already registered
    if (!customElements.get('apg-alert-dialog')) {
      customElements.define('apg-alert-dialog', TestApgAlertDialog);
    }
  });

  afterEach(() => {
    container.remove();
    vi.restoreAllMocks();
  });

  describe('ARIA Attributes', () => {
    it('has role="alertdialog" (NOT dialog)', async () => {
      container.innerHTML = createAlertDialogHTML();
      await new Promise((r) => requestAnimationFrame(r));

      const dialog = container.querySelector('dialog');
      expect(dialog?.getAttribute('role')).toBe('alertdialog');
    });

    it('has aria-modal="true"', async () => {
      container.innerHTML = createAlertDialogHTML();
      await new Promise((r) => requestAnimationFrame(r));

      const dialog = container.querySelector('dialog');
      expect(dialog?.getAttribute('aria-modal')).toBe('true');
    });

    it('has aria-labelledby referencing title', async () => {
      container.innerHTML = createAlertDialogHTML({ title: 'Delete Item' });
      await new Promise((r) => requestAnimationFrame(r));

      const dialog = container.querySelector('dialog');
      const titleId = dialog?.getAttribute('aria-labelledby');

      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)?.textContent).toBe('Delete Item');
    });

    it('has aria-describedby referencing message (required)', async () => {
      container.innerHTML = createAlertDialogHTML({ message: 'This cannot be undone.' });
      await new Promise((r) => requestAnimationFrame(r));

      const dialog = container.querySelector('dialog');
      const messageId = dialog?.getAttribute('aria-describedby');

      expect(messageId).toBeTruthy();
      expect(document.getElementById(messageId!)?.textContent).toBe('This cannot be undone.');
    });
  });

  describe('Escape Key Behavior', () => {
    it('prevents close on Escape by default', async () => {
      container.innerHTML = createAlertDialogHTML({ allowEscapeClose: false });
      await new Promise((r) => requestAnimationFrame(r));

      const dialog = container.querySelector('dialog');
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });

      dialog?.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(true);
    });

    it('allows close on Escape when allowEscapeClose=true', async () => {
      container.innerHTML = createAlertDialogHTML({ allowEscapeClose: true });
      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-alert-dialog') as HTMLElement;
      const dialog = container.querySelector('dialog');
      const cancelHandler = vi.fn();

      element.addEventListener('cancel', cancelHandler);

      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      dialog?.dispatchEvent(event);

      expect(event.defaultPrevented).toBe(false);
      expect(cancelHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Actions', () => {
    it('dispatches cancel event on cancel button click', async () => {
      container.innerHTML = createAlertDialogHTML();
      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-alert-dialog') as HTMLElement;
      const cancelButton = container.querySelector('[data-cancel]') as HTMLButtonElement;
      const cancelHandler = vi.fn();

      element.addEventListener('cancel', cancelHandler);
      cancelButton.click();

      expect(cancelHandler).toHaveBeenCalledTimes(1);
    });

    it('dispatches confirm event on confirm button click', async () => {
      container.innerHTML = createAlertDialogHTML();
      await new Promise((r) => requestAnimationFrame(r));

      const element = container.querySelector('apg-alert-dialog') as HTMLElement;
      const confirmButton = container.querySelector('[data-confirm]') as HTMLButtonElement;
      const confirmHandler = vi.fn();

      element.addEventListener('confirm', confirmHandler);
      confirmButton.click();

      expect(confirmHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Button Labels', () => {
    it('displays custom button labels', async () => {
      container.innerHTML = createAlertDialogHTML({
        confirmLabel: 'Delete',
        cancelLabel: 'Keep',
      });
      await new Promise((r) => requestAnimationFrame(r));

      const cancelButton = container.querySelector('[data-cancel]');
      const confirmButton = container.querySelector('[data-confirm]');

      expect(cancelButton?.textContent).toBe('Keep');
      expect(confirmButton?.textContent).toBe('Delete');
    });
  });

  describe('Alert Dialog Specific', () => {
    it('does NOT have a close button (×)', async () => {
      container.innerHTML = createAlertDialogHTML();
      await new Promise((r) => requestAnimationFrame(r));

      // Alert dialog should not have the typical close button
      const closeButton = container.querySelector(
        '[aria-label*="close" i], [aria-label*="Close" i]'
      );
      expect(closeButton).toBeNull();
    });

    it('has only Cancel and Confirm buttons', async () => {
      container.innerHTML = createAlertDialogHTML();
      await new Promise((r) => requestAnimationFrame(r));

      const buttons = container.querySelectorAll('button');
      expect(buttons.length).toBe(2);
    });
  });
});
