import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Menubar, type MenubarItem, type MenuItem } from './Menubar';

afterEach(() => {
  vi.useRealTimers();
});

// Helper function to create basic menubar items
const createBasicItems = (): MenubarItem[] => [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'item', id: 'open', label: 'Open' },
      { type: 'item', id: 'save', label: 'Save' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { type: 'item', id: 'cut', label: 'Cut' },
      { type: 'item', id: 'copy', label: 'Copy' },
      { type: 'item', id: 'paste', label: 'Paste' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      { type: 'item', id: 'zoom-in', label: 'Zoom In' },
      { type: 'item', id: 'zoom-out', label: 'Zoom Out' },
    ],
  },
];

// Items with submenu
const createItemsWithSubmenu = (): MenubarItem[] => [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      {
        type: 'submenu',
        id: 'open-recent',
        label: 'Open Recent',
        items: [
          { type: 'item', id: 'doc1', label: 'Document 1' },
          { type: 'item', id: 'doc2', label: 'Document 2' },
        ],
      },
      { type: 'item', id: 'save', label: 'Save' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [{ type: 'item', id: 'cut', label: 'Cut' }],
  },
];

// Items with checkbox and radio
const createItemsWithCheckboxRadio = (): MenubarItem[] => [
  {
    id: 'view',
    label: 'View',
    items: [
      {
        type: 'checkbox',
        id: 'auto-save',
        label: 'Auto Save',
        checked: false,
      },
      {
        type: 'checkbox',
        id: 'word-wrap',
        label: 'Word Wrap',
        checked: true,
      },
      { type: 'separator', id: 'sep1' },
      {
        type: 'radiogroup',
        id: 'theme-group',
        name: 'theme',
        label: 'Theme',
        items: [
          { type: 'radio', id: 'light', label: 'Light', checked: true },
          { type: 'radio', id: 'dark', label: 'Dark', checked: false },
          { type: 'radio', id: 'system', label: 'System', checked: false },
        ],
      },
    ],
  },
];

// Items with disabled items
const createItemsWithDisabled = (): MenubarItem[] => [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'item', id: 'open', label: 'Open', disabled: true },
      { type: 'item', id: 'save', label: 'Save' },
    ],
  },
];

// Items with separator
const createItemsWithSeparator = (): MenubarItem[] => [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'separator', id: 'sep1' },
      { type: 'item', id: 'save', label: 'Save' },
    ],
  },
];

describe('Menubar', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="menubar" on container', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);
      expect(screen.getByRole('menubar')).toBeInTheDocument();
    });

    it('has role="menu" on dropdown', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('has role="menuitem" on items', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);
      expect(screen.getAllByRole('menuitem')).toHaveLength(3);
    });

    it('has role="menuitemcheckbox" on checkbox items', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      expect(screen.getAllByRole('menuitemcheckbox')).toHaveLength(2);
    });

    it('has role="menuitemradio" on radio items', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      expect(screen.getAllByRole('menuitemradio')).toHaveLength(3);
    });

    it('has role="separator" on dividers', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithSeparator()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has role="group" on radio groups with aria-label', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const group = screen.getByRole('group', { name: 'Theme' });
      expect(group).toBeInTheDocument();
    });

    it('has role="none" on li elements', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const listItems = document.querySelectorAll('li');
      listItems.forEach((li) => {
        expect(li).toHaveAttribute('role', 'none');
      });
    });

    it('has aria-haspopup="menu" on items with submenu (not "true")', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      expect(fileItem).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('has aria-expanded on items with submenu', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when submenu opens', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-checked on checkbox items', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const autoSave = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
      expect(autoSave).toHaveAttribute('aria-checked', 'false');

      const wordWrap = screen.getByRole('menuitemcheckbox', { name: 'Word Wrap' });
      expect(wordWrap).toHaveAttribute('aria-checked', 'true');
    });

    it('has aria-checked on radio items', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const lightRadio = screen.getByRole('menuitemradio', { name: 'Light' });
      expect(lightRadio).toHaveAttribute('aria-checked', 'true');

      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });
      expect(darkRadio).toHaveAttribute('aria-checked', 'false');
    });

    it('has accessible name on menubar', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);
      expect(screen.getByRole('menubar', { name: 'Application' })).toBeInTheDocument();
    });

    it('submenu has aria-labelledby referencing parent menuitem', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithSubmenu()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const openRecent = screen.getByRole('menuitem', { name: 'Open Recent' });
      openRecent.focus();
      await user.keyboard('{ArrowRight}');

      const submenu = screen.getAllByRole('menu')[1];
      const labelledBy = submenu.getAttribute('aria-labelledby');
      expect(labelledBy).toBe(openRecent.id);
    });

    it('closed menu has hidden or aria-hidden', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const menus = document.querySelectorAll('[role="menu"]');
      menus.forEach((menu) => {
        const hasHidden =
          menu.hasAttribute('hidden') || menu.getAttribute('aria-hidden') === 'true';
        expect(hasHidden).toBe(true);
      });
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Menubar
  describe('APG Keyboard Interaction - Menubar', () => {
    it('ArrowRight moves to next menubar item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });

    it('ArrowLeft moves to previous menubar item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const editItem = screen.getByRole('menuitem', { name: 'Edit' });
      editItem.focus();
      await user.keyboard('{ArrowLeft}');

      expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
    });

    it('ArrowRight wraps from last to first', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      viewItem.focus();
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
    });

    it('ArrowLeft wraps from first to last', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{ArrowLeft}');

      expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
    });

    it('ArrowDown opens submenu and focuses first item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('ArrowUp opens submenu and focuses last item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{ArrowUp}');

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    });

    it('Enter opens submenu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{Enter}');

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('Space opens submenu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard(' ');

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('Home moves to first menubar item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      viewItem.focus();
      await user.keyboard('{Home}');

      expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
    });

    it('End moves to last menubar item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{End}');

      expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
    });

    it('Tab moves focus out and closes all menus', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Menubar items={createBasicItems()} aria-label="Application" />
          <button>Outside</button>
        </div>
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Tab}');

      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('Shift+Tab moves focus out and closes all menus', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <Menubar items={createBasicItems()} aria-label="Application" />
        </div>
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      // Use fireEvent instead of user.keyboard for Shift+Tab due to jsdom limitations
      // with user-event's tab destination calculation
      fireEvent.keyDown(fileItem, { key: 'Tab', shiftKey: true });

      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Menu
  describe('APG Keyboard Interaction - Menu', () => {
    it('ArrowDown moves to next item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
    });

    it('ArrowUp moves to previous item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const openItem = screen.getByRole('menuitem', { name: 'Open' });
      openItem.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('ArrowDown wraps from last to first', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const saveItem = screen.getByRole('menuitem', { name: 'Save' });
      saveItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('ArrowUp wraps from first to last', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    });

    it('ArrowRight opens submenu when item has one', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithSubmenu()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const openRecent = screen.getByRole('menuitem', { name: 'Open Recent' });
      openRecent.focus();
      await user.keyboard('{ArrowRight}');

      expect(openRecent).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Document 1' })).toHaveFocus();
    });

    it('ArrowRight moves to next menubar item when in top-level menu (item has no submenu)', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{ArrowRight}');

      // File menu should close, Edit menu should open
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      const editItem = screen.getByRole('menuitem', { name: 'Edit' });
      expect(editItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('ArrowLeft closes submenu and returns to parent', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithSubmenu()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const openRecent = screen.getByRole('menuitem', { name: 'Open Recent' });
      openRecent.focus();
      await user.keyboard('{ArrowRight}');

      expect(openRecent).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{ArrowLeft}');

      expect(openRecent).toHaveAttribute('aria-expanded', 'false');
      expect(openRecent).toHaveFocus();
    });

    it('ArrowLeft moves to previous menubar item when in top-level menu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const editItem = screen.getByRole('menuitem', { name: 'Edit' });
      await user.click(editItem);

      const cutItem = screen.getByRole('menuitem', { name: 'Cut' });
      cutItem.focus();
      await user.keyboard('{ArrowLeft}');

      // Edit menu should close, File menu should open
      expect(editItem).toHaveAttribute('aria-expanded', 'false');
      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('Enter activates menuitem and closes menu', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <Menubar items={createBasicItems()} aria-label="Application" onItemSelect={onItemSelect} />
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{Enter}');

      expect(onItemSelect).toHaveBeenCalledWith('new');
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('Space activates menuitem and closes menu', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <Menubar items={createBasicItems()} aria-label="Application" onItemSelect={onItemSelect} />
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard(' ');

      expect(onItemSelect).toHaveBeenCalledWith('new');
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('Escape closes menu and returns focus to menubar', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');

      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      expect(fileItem).toHaveFocus();
    });

    it('Home moves to first item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const saveItem = screen.getByRole('menuitem', { name: 'Save' });
      saveItem.focus();
      await user.keyboard('{Home}');

      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('End moves to last item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{End}');

      expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Checkbox and Radio Items
  describe('Checkbox and Radio Items', () => {
    it('Space toggles menuitemcheckbox', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      const items = createItemsWithCheckboxRadio();
      (items[0].items[0] as any).onCheckedChange = onCheckedChange;
      render(<Menubar items={items} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const autoSave = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
      autoSave.focus();
      await user.keyboard(' ');

      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('Enter toggles menuitemcheckbox', async () => {
      const user = userEvent.setup();
      const onCheckedChange = vi.fn();
      const items = createItemsWithCheckboxRadio();
      (items[0].items[0] as any).onCheckedChange = onCheckedChange;
      render(<Menubar items={items} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const autoSave = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
      autoSave.focus();
      await user.keyboard('{Enter}');

      expect(onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('Space on checkbox does not close menu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const autoSave = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
      autoSave.focus();
      await user.keyboard(' ');

      // Menu should still be open
      expect(viewItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('Enter on checkbox does not close menu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const autoSave = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
      autoSave.focus();
      await user.keyboard('{Enter}');

      // Menu should still be open
      expect(viewItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('updates aria-checked on toggle', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const autoSave = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
      expect(autoSave).toHaveAttribute('aria-checked', 'false');

      autoSave.focus();
      await user.keyboard(' ');

      expect(autoSave).toHaveAttribute('aria-checked', 'true');
    });

    it('Space selects menuitemradio', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });
      darkRadio.focus();
      await user.keyboard(' ');

      expect(darkRadio).toHaveAttribute('aria-checked', 'true');
    });

    it('Space on radio does not close menu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });
      darkRadio.focus();
      await user.keyboard(' ');

      // Menu should still be open
      expect(viewItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('Enter on radio does not close menu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });
      darkRadio.focus();
      await user.keyboard('{Enter}');

      // Menu should still be open
      expect(viewItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('only one radio in group can be checked', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const lightRadio = screen.getByRole('menuitemradio', { name: 'Light' });
      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });

      expect(lightRadio).toHaveAttribute('aria-checked', 'true');
      expect(darkRadio).toHaveAttribute('aria-checked', 'false');

      darkRadio.focus();
      await user.keyboard(' ');

      expect(lightRadio).toHaveAttribute('aria-checked', 'false');
      expect(darkRadio).toHaveAttribute('aria-checked', 'true');
    });

    it('unchecks other radios in group when one is selected', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />);

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const systemRadio = screen.getByRole('menuitemradio', { name: 'System' });
      systemRadio.focus();
      await user.keyboard(' ');

      const lightRadio = screen.getByRole('menuitemradio', { name: 'Light' });
      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });

      expect(lightRadio).toHaveAttribute('aria-checked', 'false');
      expect(darkRadio).toHaveAttribute('aria-checked', 'false');
      expect(systemRadio).toHaveAttribute('aria-checked', 'true');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('first menubar item has tabIndex="0"', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      expect(fileItem).toHaveAttribute('tabindex', '0');
    });

    it('other menubar items have tabIndex="-1"', () => {
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const editItem = screen.getByRole('menuitem', { name: 'Edit' });
      const viewItem = screen.getByRole('menuitem', { name: 'View' });

      expect(editItem).toHaveAttribute('tabindex', '-1');
      expect(viewItem).toHaveAttribute('tabindex', '-1');
    });

    it('separator is not focusable', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithSeparator()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const separator = screen.getByRole('separator');
      expect(separator).not.toHaveAttribute('tabindex');

      // Navigate through - should skip separator
      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    });

    it('disabled items are focusable', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithDisabled()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{ArrowDown}');

      const openItem = screen.getByRole('menuitem', { name: 'Open' });
      expect(openItem).toHaveFocus();
      expect(openItem).toHaveAttribute('aria-disabled', 'true');
    });

    it('disabled items cannot be activated', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <Menubar
          items={createItemsWithDisabled()}
          aria-label="Application"
          onItemSelect={onItemSelect}
        />
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const openItem = screen.getByRole('menuitem', { name: 'Open' });
      openItem.focus();
      await user.keyboard('{Enter}');

      expect(onItemSelect).not.toHaveBeenCalled();
      // Menu should still be open
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
    });
  });

  // 🔴 High Priority: Type-Ahead
  describe('Type-Ahead', () => {
    it('character focuses matching item', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('s');

      expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    });

    it('search wraps around', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const saveItem = screen.getByRole('menuitem', { name: 'Save' });
      saveItem.focus();
      await user.keyboard('n');

      expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
    });

    it('skips separator', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createItemsWithSeparator()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('s');

      // Should find Save, not get stuck on separator
      expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    });

    it('skips disabled items', async () => {
      const user = userEvent.setup();
      const items: MenubarItem[] = [
        {
          id: 'file',
          label: 'File',
          items: [
            { type: 'item', id: 'open', label: 'Open', disabled: true },
            { type: 'item', id: 'options', label: 'Options' },
          ],
        },
      ];
      render(<Menubar items={items} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const optionsItem = screen.getByRole('menuitem', { name: 'Options' });
      optionsItem.focus();
      await user.keyboard('o');

      // Should wrap to Options (skip disabled Open)
      expect(screen.getByRole('menuitem', { name: 'Options' })).toHaveFocus();
    });

    it('resets after 500ms', async () => {
      vi.useFakeTimers();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      act(() => {
        fireEvent.click(fileItem);
      });

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      act(() => {
        newItem.focus();
      });

      // Type 'o' -> should focus 'Open'
      act(() => {
        fireEvent.keyDown(newItem, { key: 'o' });
      });
      expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();

      // Wait 500ms for reset
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Type 's' -> should focus 'Save' (not 'os')
      const openItem = screen.getByRole('menuitem', { name: 'Open' });
      act(() => {
        fireEvent.keyDown(openItem, { key: 's' });
      });
      expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Pointer Interaction
  describe('Pointer Interaction', () => {
    it('click on menubar item opens menu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('click on menubar item again closes menu', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('hover on another menubar item switches menu when open', async () => {
      const user = userEvent.setup();
      render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      const editItem = screen.getByRole('menuitem', { name: 'Edit' });

      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.hover(editItem);

      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      expect(editItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('click on menuitem activates and closes menu', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <Menubar items={createBasicItems()} aria-label="Application" onItemSelect={onItemSelect} />
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      await user.click(newItem);

      expect(onItemSelect).toHaveBeenCalledWith('new');
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('click outside closes menu', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Menubar items={createBasicItems()} aria-label="Application" />
          <button>Outside</button>
        </div>
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByRole('button', { name: 'Outside' }));
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations when closed', async () => {
      const { container } = render(<Menubar items={createBasicItems()} aria-label="Application" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with menu open', async () => {
      const user = userEvent.setup();
      const { container } = render(<Menubar items={createBasicItems()} aria-label="Application" />);

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with submenu open', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Menubar items={createItemsWithSubmenu()} aria-label="Application" />
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const openRecent = screen.getByRole('menuitem', { name: 'Open Recent' });
      openRecent.focus();
      await user.keyboard('{ArrowRight}');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with checkbox and radio', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Menubar items={createItemsWithCheckboxRadio()} aria-label="Application" />
      );

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('calls onItemSelect with correct id', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <Menubar items={createBasicItems()} aria-label="Application" onItemSelect={onItemSelect} />
      );

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const saveItem = screen.getByRole('menuitem', { name: 'Save' });
      await user.click(saveItem);

      expect(onItemSelect).toHaveBeenCalledWith('save');
    });

    it('applies className to container', () => {
      const { container } = render(
        <Menubar items={createBasicItems()} aria-label="Application" className="custom-class" />
      );

      expect(container.querySelector('.apg-menubar')).toHaveClass('custom-class');
    });

    it('supports aria-labelledby instead of aria-label', () => {
      render(
        <div>
          <h2 id="menu-heading">Application Menu</h2>
          <Menubar items={createBasicItems()} aria-labelledby="menu-heading" />
        </div>
      );

      const menubar = screen.getByRole('menubar');
      expect(menubar).toHaveAttribute('aria-labelledby', 'menu-heading');
    });
  });
});
