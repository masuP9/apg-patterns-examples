/**
 * MenuButton Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of MenuButton.astro.
 * Web Component behavior (opening/closing, keyboard navigation, roving
 * tabindex updates, type-ahead, click outside and the itemselect event)
 * is covered by E2E tests in e2e/menu-button.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import MenuButton from './MenuButton.astro';

describe('MenuButton (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderMenuButton(props: Record<string, unknown>): Promise<Document> {
    const html = await container.renderToString(MenuButton, { props });
    return new JSDOM(html).window.document;
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-menu-button custom element wrapper', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      expect(doc.querySelector('apg-menu-button')).not.toBeNull();
    });

    it('renders the trigger as a button with type="button" and the label as its text', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      const button = doc.querySelector('button');
      expect(button?.getAttribute('type')).toBe('button');
      expect(button?.textContent?.trim()).toBe('Actions');
    });

    it('renders a list with role="menu"', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      expect(doc.querySelector('ul[role="menu"]')).not.toBeNull();
    });

    it('renders each item as role="menuitem" with its label', async () => {
      const doc = await renderMenuButton({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
          { id: 'paste', label: 'Paste' },
        ],
        label: 'Actions',
      });
      const labels = Array.from(doc.querySelectorAll('[role="menuitem"]')).map((item) =>
        item.textContent?.trim()
      );
      expect(labels).toEqual(['Cut', 'Copy', 'Paste']);
    });

    it('renders an empty menu when items is empty', async () => {
      const doc = await renderMenuButton({ items: [], label: 'Actions' });
      expect(doc.querySelector('[role="menu"]')).not.toBeNull();
      expect(doc.querySelectorAll('[role="menuitem"]')).toHaveLength(0);
    });
  });

  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has aria-haspopup="menu" on the button', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      expect(doc.querySelector('button')?.getAttribute('aria-haspopup')).toBe('menu');
    });

    it('has aria-expanded="false" on the button by default', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      expect(doc.querySelector('button')?.getAttribute('aria-expanded')).toBe('false');
    });

    it('has aria-expanded="true" on the button when defaultOpen is true', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
        defaultOpen: true,
      });
      expect(doc.querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
    });

    it('has aria-controls on the button referencing the menu id', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      const menuId = doc.querySelector('button')?.getAttribute('aria-controls') ?? '';
      expect(doc.getElementById(menuId)?.getAttribute('role')).toBe('menu');
    });

    it('has aria-labelledby on the menu referencing the button', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      const buttonId = doc.querySelector('[role="menu"]')?.getAttribute('aria-labelledby') ?? '';
      expect(doc.getElementById(buttonId)?.textContent?.trim()).toBe('Actions');
    });

    it('has aria-disabled="true" only on disabled items', async () => {
      const doc = await renderMenuButton({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy', disabled: true },
          { id: 'paste', label: 'Paste' },
        ],
        label: 'Actions',
      });
      const items = doc.querySelectorAll('[role="menuitem"]');
      expect(items[0].hasAttribute('aria-disabled')).toBe(false);
      expect(items[1].getAttribute('aria-disabled')).toBe('true');
      expect(items[2].hasAttribute('aria-disabled')).toBe(false);
    });
  });

  // 🔴 High Priority: Menu Visibility
  describe('Menu Visibility', () => {
    it('renders the menu hidden and inert by default', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      const menu = doc.querySelector('[role="menu"]');
      expect(menu?.hasAttribute('hidden')).toBe(true);
      expect(menu?.hasAttribute('inert')).toBe(true);
    });

    it('renders the menu visible and not inert when defaultOpen is true', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
        defaultOpen: true,
      });
      const menu = doc.querySelector('[role="menu"]');
      expect(menu?.hasAttribute('hidden')).toBe(false);
      expect(menu?.hasAttribute('inert')).toBe(false);
    });
  });

  // 🔴 High Priority: Focus Management (initial roving tabindex)
  describe('Focus Management', () => {
    it('has tabindex="-1" on all items when the menu is closed', async () => {
      const doc = await renderMenuButton({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        label: 'Actions',
      });
      const items = doc.querySelectorAll('[role="menuitem"]');
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
    });

    it('has tabindex="0" only on the first item when defaultOpen is true', async () => {
      const doc = await renderMenuButton({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        label: 'Actions',
        defaultOpen: true,
      });
      const items = doc.querySelectorAll('[role="menuitem"]');
      expect(items[0].getAttribute('tabindex')).toBe('0');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
    });

    it('has tabindex="0" on the first enabled item when the first item is disabled and defaultOpen is true', async () => {
      const doc = await renderMenuButton({
        items: [
          { id: 'cut', label: 'Cut', disabled: true },
          { id: 'copy', label: 'Copy' },
        ],
        label: 'Actions',
        defaultOpen: true,
      });
      const items = doc.querySelectorAll('[role="menuitem"]');
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" on all items when all items are disabled and defaultOpen is true', async () => {
      const doc = await renderMenuButton({
        items: [
          { id: 'cut', label: 'Cut', disabled: true },
          { id: 'copy', label: 'Copy', disabled: true },
        ],
        label: 'Actions',
        defaultOpen: true,
      });
      const items = doc.querySelectorAll('[role="menuitem"]');
      expect(items[0].getAttribute('tabindex')).toBe('-1');
      expect(items[1].getAttribute('tabindex')).toBe('-1');
    });
  });

  // 🟡 Medium Priority: Web Component Hydration Data
  describe('Web Component Data Attributes', () => {
    it('sets data-default-open="true" when defaultOpen is true', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
        defaultOpen: true,
      });
      expect(doc.querySelector('apg-menu-button')?.getAttribute('data-default-open')).toBe('true');
    });

    it('does not set data-default-open when defaultOpen is false', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
      });
      expect(doc.querySelector('apg-menu-button')?.hasAttribute('data-default-open')).toBe(false);
    });

    it('sets data-item-id on each item', async () => {
      const doc = await renderMenuButton({
        items: [
          { id: 'cut', label: 'Cut' },
          { id: 'copy', label: 'Copy' },
        ],
        label: 'Actions',
      });
      const ids = Array.from(doc.querySelectorAll('[role="menuitem"]')).map((item) =>
        item.getAttribute('data-item-id')
      );
      expect(ids).toEqual(['cut', 'copy']);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('applies a custom class to the container', async () => {
      const doc = await renderMenuButton({
        items: [{ id: 'cut', label: 'Cut' }],
        label: 'Actions',
        class: 'custom-class',
      });
      expect(doc.querySelector('.apg-menu-button')?.classList.contains('custom-class')).toBe(true);
    });

    it('generates unique ids for each instance', async () => {
      const first = await renderMenuButton({ items: [{ id: 'cut', label: 'Cut' }], label: 'A' });
      const second = await renderMenuButton({ items: [{ id: 'cut', label: 'Cut' }], label: 'B' });
      expect(first.querySelector('[role="menu"]')?.id).not.toBe(
        second.querySelector('[role="menu"]')?.id
      );
    });
  });
});
