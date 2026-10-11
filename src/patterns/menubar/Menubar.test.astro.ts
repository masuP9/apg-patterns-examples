/**
 * Menubar Astro Component Tests using Container API
 *
 * These tests verify the initial server-rendered HTML of Menubar.astro.
 * Web Component behavior (opening/closing menus, keyboard navigation,
 * pointer interaction, checkbox/radio state changes and type-ahead) is
 * covered by E2E tests in e2e/menubar.spec.ts.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Menubar from './Menubar.astro';
// tsc cannot read types exported from .astro frontmatter; the React type has the same shape
import type { MenubarItem } from './Menubar';

// Shared menubar definition used as render input (not as an expectation source)
const items: MenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'item', id: 'open', label: 'Open' },
      { type: 'separator', id: 'sep1' },
      { type: 'item', id: 'save', label: 'Save', disabled: true },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { type: 'checkbox', id: 'toolbar', label: 'Show Toolbar', checked: true },
      { type: 'checkbox', id: 'statusbar', label: 'Show Status Bar', checked: false },
      {
        type: 'radiogroup',
        id: 'theme',
        name: 'theme',
        label: 'Theme',
        items: [
          { type: 'radio', id: 'light', label: 'Light', checked: true },
          { type: 'radio', id: 'dark', label: 'Dark', checked: false },
        ],
      },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      {
        type: 'submenu',
        id: 'find',
        label: 'Find',
        items: [
          { type: 'item', id: 'find-next', label: 'Find Next' },
          { type: 'item', id: 'replace', label: 'Replace' },
        ],
      },
    ],
  },
];

describe('Menubar (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderMenubar(props: Record<string, unknown> = {}): Promise<Document> {
    const html = await container.renderToString(Menubar, {
      props: { items, 'aria-label': 'Application', ...props },
    });
    return new JSDOM(html).window.document;
  }

  function getMenubarItem(doc: Document, label: string): Element | undefined {
    return Array.from(doc.querySelectorAll('[role="menubar"] > li > [role="menuitem"]')).find(
      (el) => el.textContent?.trim() === label
    );
  }

  function getMenuOf(doc: Document, label: string): Element | null {
    const trigger = getMenubarItem(doc, label);
    return doc.querySelector(`[role="menu"][aria-labelledby="${trigger?.id}"]`);
  }

  // 🔴 High Priority: HTML Structure
  describe('HTML Structure', () => {
    it('renders apg-menubar custom element wrapper', async () => {
      const doc = await renderMenubar();
      expect(doc.querySelector('apg-menubar')).not.toBeNull();
    });

    it('renders a ul with role="menubar"', async () => {
      const doc = await renderMenubar();
      expect(doc.querySelector('ul[role="menubar"]')).not.toBeNull();
    });

    it('renders one menubar item per top-level entry', async () => {
      const doc = await renderMenubar();
      const labels = Array.from(
        doc.querySelectorAll('[role="menubar"] > li > [role="menuitem"]')
      ).map((el) => el.textContent?.trim());
      expect(labels).toEqual(['File', 'View', 'Edit']);
    });

    it('has role="none" on all li elements', async () => {
      const doc = await renderMenubar();
      const roles = Array.from(doc.querySelectorAll('li')).map((li) => li.getAttribute('role'));
      expect(roles.length).toBeGreaterThan(0);
      expect(roles.every((role) => role === 'none')).toBe(true);
    });

    it('hides the decorative chevron icons from assistive technology', async () => {
      const doc = await renderMenubar();
      const svgs = Array.from(doc.querySelectorAll('svg'));
      expect(svgs.length).toBeGreaterThan(0);
      expect(svgs.every((svg) => svg.getAttribute('aria-hidden') === 'true')).toBe(true);
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has aria-label on the menubar when provided', async () => {
      const doc = await renderMenubar({ 'aria-label': 'Application' });
      expect(doc.querySelector('[role="menubar"]')?.getAttribute('aria-label')).toBe('Application');
    });

    it('has aria-labelledby on the menubar when provided', async () => {
      const doc = await renderMenubar({ 'aria-label': undefined, 'aria-labelledby': 'app-title' });
      expect(doc.querySelector('[role="menubar"]')?.getAttribute('aria-labelledby')).toBe(
        'app-title'
      );
    });
  });

  // 🔴 High Priority: Menubar Items
  describe('Menubar Items', () => {
    it('has aria-haspopup="menu" (not "true") on menubar items', async () => {
      const doc = await renderMenubar();
      expect(getMenubarItem(doc, 'File')?.getAttribute('aria-haspopup')).toBe('menu');
    });

    it('has aria-expanded="false" on menubar items initially', async () => {
      const doc = await renderMenubar();
      expect(getMenubarItem(doc, 'File')?.getAttribute('aria-expanded')).toBe('false');
      expect(getMenubarItem(doc, 'View')?.getAttribute('aria-expanded')).toBe('false');
      expect(getMenubarItem(doc, 'Edit')?.getAttribute('aria-expanded')).toBe('false');
    });

    it('gives each menubar item a unique id per component instance', async () => {
      const first = await renderMenubar();
      const second = await renderMenubar();
      expect(getMenubarItem(first, 'File')?.id).not.toBe(getMenubarItem(second, 'File')?.id);
    });
  });

  // 🔴 High Priority: Focus Management (roving tabindex)
  describe('Focus Management', () => {
    it('has tabindex="0" on the first menubar item', async () => {
      const doc = await renderMenubar();
      expect(getMenubarItem(doc, 'File')?.getAttribute('tabindex')).toBe('0');
    });

    it('has tabindex="-1" on the other menubar items', async () => {
      const doc = await renderMenubar();
      expect(getMenubarItem(doc, 'View')?.getAttribute('tabindex')).toBe('-1');
      expect(getMenubarItem(doc, 'Edit')?.getAttribute('tabindex')).toBe('-1');
    });

    it('has tabindex="-1" on all items inside menus', async () => {
      const doc = await renderMenubar();
      const tabindexes = Array.from(
        doc.querySelectorAll(
          '[role="menu"] [role="menuitem"], [role="menu"] [role="menuitemcheckbox"], [role="menu"] [role="menuitemradio"]'
        )
      ).map((el) => el.getAttribute('tabindex'));
      expect(tabindexes.length).toBe(10);
      expect(tabindexes.every((tabindex) => tabindex === '-1')).toBe(true);
    });
  });

  // 🔴 High Priority: Menus
  describe('Menus', () => {
    it('renders a role="menu" labelled by its menubar item', async () => {
      const doc = await renderMenubar();
      const menu = getMenuOf(doc, 'File');
      const labelId = menu?.getAttribute('aria-labelledby') ?? '';
      expect(doc.getElementById(labelId)?.textContent?.trim()).toBe('File');
    });

    it('has aria-hidden="true" on menus initially', async () => {
      const doc = await renderMenubar();
      expect(getMenuOf(doc, 'File')?.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders the menu items in order', async () => {
      const doc = await renderMenubar();
      const labels = Array.from(
        getMenuOf(doc, 'File')?.querySelectorAll('[role="menuitem"]') ?? []
      ).map((el) => el.textContent?.trim());
      expect(labels).toEqual(['New', 'Open', 'Save']);
    });

    it('renders a separator as hr with role="separator"', async () => {
      const doc = await renderMenubar();
      const separator = getMenuOf(doc, 'File')?.querySelector('[role="separator"]');
      expect(separator?.tagName).toBe('HR');
    });

    it('has aria-disabled="true" on disabled items', async () => {
      const doc = await renderMenubar();
      const save = Array.from(doc.querySelectorAll('[role="menuitem"]')).find(
        (el) => el.textContent?.trim() === 'Save'
      );
      expect(save?.getAttribute('aria-disabled')).toBe('true');
    });

    it('does not have aria-disabled on enabled items', async () => {
      const doc = await renderMenubar();
      const newItem = Array.from(doc.querySelectorAll('[role="menuitem"]')).find(
        (el) => el.textContent?.trim() === 'New'
      );
      expect(newItem?.hasAttribute('aria-disabled')).toBe(false);
    });
  });

  // 🟡 Medium Priority: Checkbox and Radio Items
  describe('Checkbox and Radio Items', () => {
    it('renders checkbox items with role="menuitemcheckbox"', async () => {
      const doc = await renderMenubar();
      const labels = Array.from(doc.querySelectorAll('[role="menuitemcheckbox"]')).map((el) =>
        el.textContent?.trim()
      );
      expect(labels).toEqual(['Show Toolbar', 'Show Status Bar']);
    });

    it('has aria-checked="true" on a checked checkbox item', async () => {
      const doc = await renderMenubar();
      const toolbar = doc.querySelector('[role="menuitemcheckbox"][data-item-id="toolbar"]');
      expect(toolbar?.getAttribute('aria-checked')).toBe('true');
    });

    it('has aria-checked="false" on an unchecked checkbox item', async () => {
      const doc = await renderMenubar();
      const statusbar = doc.querySelector('[role="menuitemcheckbox"][data-item-id="statusbar"]');
      expect(statusbar?.getAttribute('aria-checked')).toBe('false');
    });

    it('wraps radio items in role="group" with aria-label', async () => {
      const doc = await renderMenubar();
      const group = doc.querySelector('[role="group"]');
      expect(group?.getAttribute('aria-label')).toBe('Theme');
      expect(group?.querySelectorAll('[role="menuitemradio"]').length).toBe(2);
    });

    it('has aria-checked reflecting the checked radio item', async () => {
      const doc = await renderMenubar();
      const light = doc.querySelector('[role="menuitemradio"][data-item-id="light"]');
      const dark = doc.querySelector('[role="menuitemradio"][data-item-id="dark"]');
      expect(light?.getAttribute('aria-checked')).toBe('true');
      expect(dark?.getAttribute('aria-checked')).toBe('false');
    });
  });

  // 🟡 Medium Priority: Submenus
  describe('Submenus', () => {
    it('has aria-haspopup="menu" and aria-expanded="false" on a submenu trigger', async () => {
      const doc = await renderMenubar();
      const trigger = doc.querySelector('[role="menuitem"][data-item-id="find"]');
      expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');
      expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    });

    it('renders a submenu labelled by its trigger with aria-hidden="true"', async () => {
      const doc = await renderMenubar();
      const trigger = doc.querySelector('[role="menuitem"][data-item-id="find"]');
      const submenu = doc.querySelector(`[role="menu"][aria-labelledby="${trigger?.id}"]`);
      expect(submenu?.getAttribute('aria-hidden')).toBe('true');
    });

    it('renders the submenu items in order', async () => {
      const doc = await renderMenubar();
      const trigger = doc.querySelector('[role="menuitem"][data-item-id="find"]');
      const submenu = doc.querySelector(`[role="menu"][aria-labelledby="${trigger?.id}"]`);
      const labels = Array.from(submenu?.querySelectorAll('[role="menuitem"]') ?? []).map((el) =>
        el.textContent?.trim()
      );
      expect(labels).toEqual(['Find Next', 'Replace']);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attributes', () => {
    it('applies a custom class to the nav container', async () => {
      const doc = await renderMenubar({ class: 'custom-class' });
      const nav = doc.querySelector('nav.apg-menubar');
      expect(nav?.classList.contains('custom-class')).toBe(true);
    });
  });
});
