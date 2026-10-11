/**
 * AlertDialog Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of AlertDialog.astro.
 * Web Component behavior (opening via showModal, initial focus on Cancel,
 * focus trap, Escape handling, focus restoration and the cancel/confirm
 * events) is covered by E2E tests in e2e/alert-dialog.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import AlertDialog from './AlertDialog.astro';

describe('AlertDialog (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderAlertDialog(props: Record<string, unknown>): Promise<Document> {
    const html = await container.renderToString(AlertDialog, { props });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-alert-dialog custom element wrapper', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(doc.querySelector('apg-alert-dialog')).not.toBeNull();
    });

    it('renders a trigger button with type="button" and triggerText', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      const trigger = doc.querySelector('.apg-alert-dialog-trigger');
      expect(trigger?.tagName).toBe('BUTTON');
      expect(trigger?.getAttribute('type')).toBe('button');
      expect(trigger?.textContent?.trim()).toBe('Delete');
    });

    it('renders a native dialog element that is closed initially', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      const dialog = doc.querySelector('dialog');
      expect(dialog).not.toBeNull();
      expect(dialog?.hasAttribute('open')).toBe(false);
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="alertdialog" (NOT dialog)', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(doc.querySelector('dialog')?.getAttribute('role')).toBe('alertdialog');
    });

    it('has aria-labelledby referencing the title', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      const titleId = doc.querySelector('dialog')?.getAttribute('aria-labelledby') ?? '';
      expect(doc.getElementById(titleId)?.textContent?.trim()).toBe('Delete item?');
    });

    it('has aria-describedby referencing the message (required)', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      const messageId = doc.querySelector('dialog')?.getAttribute('aria-describedby') ?? '';
      expect(doc.getElementById(messageId)?.textContent?.trim()).toBe('This cannot be undone.');
    });

    it('generates unique title ids for each instance', async () => {
      const first = await renderAlertDialog({
        title: 'First',
        message: 'First message',
        triggerText: 'Open first',
      });
      const second = await renderAlertDialog({
        title: 'Second',
        message: 'Second message',
        triggerText: 'Open second',
      });
      expect(first.querySelector('dialog')?.getAttribute('aria-labelledby')).not.toBe(
        second.querySelector('dialog')?.getAttribute('aria-labelledby')
      );
    });
  });

  // 🔴 High Priority: Escape Key Configuration
  describe('Escape Key Configuration', () => {
    it('sets data-allow-escape-close="false" by default', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(doc.querySelector('apg-alert-dialog')?.getAttribute('data-allow-escape-close')).toBe(
        'false'
      );
    });

    it('sets data-allow-escape-close="true" when allowEscapeClose is true', async () => {
      const doc = await renderAlertDialog({
        title: 'Notice',
        message: 'Maintenance on Sunday.',
        triggerText: 'Show Notice',
        allowEscapeClose: true,
      });
      expect(doc.querySelector('apg-alert-dialog')?.getAttribute('data-allow-escape-close')).toBe(
        'true'
      );
    });
  });

  // 🔴 High Priority: Action Buttons
  describe('Action Buttons', () => {
    it('renders Cancel and OK buttons by default', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(doc.querySelector('.apg-alert-dialog-cancel')?.textContent?.trim()).toBe('Cancel');
      expect(doc.querySelector('.apg-alert-dialog-confirm')?.textContent?.trim()).toBe('OK');
    });

    it('renders custom button labels', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
        confirmLabel: 'Delete',
        cancelLabel: 'Keep',
      });
      expect(doc.querySelector('.apg-alert-dialog-cancel')?.textContent?.trim()).toBe('Keep');
      expect(doc.querySelector('.apg-alert-dialog-confirm')?.textContent?.trim()).toBe('Delete');
    });

    it('renders Cancel before Confirm in the dialog', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
        confirmLabel: 'Delete',
        cancelLabel: 'Cancel',
      });
      const labels = Array.from(doc.querySelectorAll('dialog button')).map((button) =>
        button.textContent?.trim()
      );
      expect(labels).toEqual(['Cancel', 'Delete']);
    });

    it('renders action buttons with type="button"', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(doc.querySelector('.apg-alert-dialog-cancel')?.getAttribute('type')).toBe('button');
      expect(doc.querySelector('.apg-alert-dialog-confirm')?.getAttribute('type')).toBe('button');
    });

    it('applies the danger class to the confirm button when confirmVariant is "danger"', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
        confirmVariant: 'danger',
      });
      expect(
        doc
          .querySelector('.apg-alert-dialog-confirm')
          ?.classList.contains('apg-alert-dialog-confirm--danger')
      ).toBe(true);
    });

    it('does not apply the danger class to the confirm button by default', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(
        doc
          .querySelector('.apg-alert-dialog-confirm')
          ?.classList.contains('apg-alert-dialog-confirm--danger')
      ).toBe(false);
    });
  });

  // 🔴 High Priority: Alert Dialog Specific
  describe('Alert Dialog Specific', () => {
    it('does NOT have a close button (×)', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(doc.querySelector('dialog [aria-label*="close" i]')).toBeNull();
    });

    it('has only the Cancel and Confirm buttons inside the dialog', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
      });
      expect(doc.querySelectorAll('dialog button')).toHaveLength(2);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('applies triggerClass to the trigger button', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
        triggerClass: 'custom-trigger',
      });
      expect(
        doc.querySelector('.apg-alert-dialog-trigger')?.classList.contains('custom-trigger')
      ).toBe(true);
    });

    it('applies a custom class to the dialog', async () => {
      const doc = await renderAlertDialog({
        title: 'Delete item?',
        message: 'This cannot be undone.',
        triggerText: 'Delete',
        class: 'custom-dialog',
      });
      expect(doc.querySelector('dialog')?.classList.contains('custom-dialog')).toBe(true);
      expect(doc.querySelector('dialog')?.classList.contains('apg-alert-dialog')).toBe(true);
    });
  });
});
