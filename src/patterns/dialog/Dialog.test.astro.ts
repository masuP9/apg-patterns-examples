/**
 * Dialog Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Dialog.astro.
 * Opening/closing behavior (showModal, focus management) is covered by E2E tests.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Dialog from './Dialog.astro';

describe('Dialog (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderDialog(
    props: {
      title: string;
      description?: string;
      triggerText: string;
      closeOnOverlayClick?: boolean;
      triggerClass?: string;
      class?: string;
    },
    slotContent = '<p>Dialog body content</p>'
  ): Promise<Document> {
    const html = await container.renderToString(Dialog, {
      props,
      slots: { default: slotContent },
    });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-dialog custom element wrapper', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open' });
      expect(doc.querySelector('apg-dialog')).not.toBeNull();
    });

    it('renders a trigger button', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open Dialog' });
      const trigger = doc.querySelector('[data-dialog-trigger]');
      expect(trigger).not.toBeNull();
      expect(trigger?.textContent?.trim()).toBe('Open Dialog');
    });

    it('renders a native <dialog> element', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open' });
      expect(doc.querySelector('dialog')).not.toBeNull();
    });

    it('renders a close button inside the dialog', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open' });
      const closeBtn = doc.querySelector('[data-dialog-close]');
      expect(closeBtn).not.toBeNull();
    });

    it('renders slot content inside dialog body', async () => {
      const doc = await renderDialog(
        { title: 'Confirm', triggerText: 'Open' },
        '<p>My content</p>'
      );
      const body = doc.querySelector('.apg-dialog-body');
      expect(body).not.toBeNull();
      expect(body?.querySelector('p')?.textContent).toBe('My content');
    });
  });

  // 🔴 High Priority: ARIA - aria-labelledby
  describe('aria-labelledby', () => {
    it('dialog has aria-labelledby pointing to title element', async () => {
      const doc = await renderDialog({ title: 'My Dialog', triggerText: 'Open' });
      const dialog = doc.querySelector('dialog');
      const labelledbyId = dialog?.getAttribute('aria-labelledby');
      expect(labelledbyId).toBeTruthy();
      const titleEl = doc.getElementById(labelledbyId!);
      expect(titleEl).not.toBeNull();
      expect(titleEl?.textContent?.trim()).toBe('My Dialog');
    });
  });

  // 🔴 High Priority: ARIA - aria-describedby (conditional)
  describe('aria-describedby', () => {
    it('dialog has no aria-describedby when description is not provided', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open' });
      const dialog = doc.querySelector('dialog');
      expect(dialog?.hasAttribute('aria-describedby')).toBe(false);
    });

    it('dialog has aria-describedby when description is provided', async () => {
      const doc = await renderDialog({
        title: 'Confirm',
        triggerText: 'Open',
        description: 'Are you sure?',
      });
      const dialog = doc.querySelector('dialog');
      const describedbyId = dialog?.getAttribute('aria-describedby');
      expect(describedbyId).toBeTruthy();
      const descEl = doc.getElementById(describedbyId!);
      expect(descEl?.textContent?.trim()).toBe('Are you sure?');
    });
  });

  // 🟡 Medium Priority: Close button accessible label
  describe('Close button', () => {
    it('close button has aria-label="Close dialog"', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open' });
      const closeBtn = doc.querySelector('[data-dialog-close]');
      expect(closeBtn?.getAttribute('aria-label')).toBe('Close dialog');
    });
  });

  // 🟡 Medium Priority: Title rendering
  describe('Title', () => {
    it('renders title as h1 with apg-dialog-title class', async () => {
      const doc = await renderDialog({ title: 'Confirm Action', triggerText: 'Open' });
      const title = doc.querySelector('.apg-dialog-title');
      expect(title).not.toBeNull();
      expect(title?.tagName.toLowerCase()).toBe('h1');
      expect(title?.textContent?.trim()).toBe('Confirm Action');
    });
  });

  // 🟡 Medium Priority: CSS Classes
  describe('CSS Classes', () => {
    it('dialog has apg-dialog class', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open' });
      const dialog = doc.querySelector('dialog');
      expect(dialog?.classList.contains('apg-dialog')).toBe(true);
    });

    it('trigger button has apg-dialog-trigger class', async () => {
      const doc = await renderDialog({ title: 'Confirm', triggerText: 'Open' });
      const trigger = doc.querySelector('[data-dialog-trigger]');
      expect(trigger?.classList.contains('apg-dialog-trigger')).toBe(true);
    });

    it('appends custom class to dialog', async () => {
      const doc = await renderDialog({
        title: 'Confirm',
        triggerText: 'Open',
        class: 'large-dialog',
      });
      const dialog = doc.querySelector('dialog');
      expect(dialog?.classList.contains('large-dialog')).toBe(true);
    });
  });
});
