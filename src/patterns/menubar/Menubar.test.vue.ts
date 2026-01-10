import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi, afterEach } from 'vitest';
import Menubar from './Menubar.vue';

afterEach(() => {
  vi.useRealTimers();
});

// Helper function to create basic menubar items
const createBasicItems = () => [
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

// Items with separator
const createItemsWithSeparator = () => [
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

// Items with checkbox and radio
const createItemsWithCheckboxRadio = () => [
  {
    id: 'view',
    label: 'View',
    items: [
      { type: 'checkbox', id: 'auto-save', label: 'Auto Save', checked: false },
      { type: 'checkbox', id: 'word-wrap', label: 'Word Wrap', checked: true },
      { type: 'separator', id: 'sep1' },
      {
        type: 'radiogroup',
        id: 'theme-group',
        name: 'theme',
        label: 'Theme',
        items: [
          { type: 'radio', id: 'light', label: 'Light', checked: true },
          { type: 'radio', id: 'dark', label: 'Dark', checked: false },
        ],
      },
    ],
  },
];

describe('Menubar (Vue)', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="menubar" on container', () => {
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });
      expect(screen.getByRole('menubar')).toBeInTheDocument();
    });

    it('has role="menu" on dropdown', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('has role="none" on li elements', () => {
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const listItems = document.querySelectorAll('li');
      listItems.forEach((li) => {
        expect(li).toHaveAttribute('role', 'none');
      });
    });

    it('has aria-haspopup="menu" on items with submenu', () => {
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      expect(fileItem).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('has aria-expanded on items with submenu', () => {
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('updates aria-expanded when submenu opens', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('has role="separator" on dividers', async () => {
      const user = userEvent.setup();
      render(Menubar, {
        props: { items: createItemsWithSeparator(), 'aria-label': 'Application' },
      });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has role="group" on radio groups with aria-label', async () => {
      const user = userEvent.setup();
      render(Menubar, {
        props: { items: createItemsWithCheckboxRadio(), 'aria-label': 'Application' },
      });

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const group = screen.getByRole('group', { name: 'Theme' });
      expect(group).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Menubar
  describe('APG Keyboard Interaction - Menubar', () => {
    it('ArrowRight moves to next menubar item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{ArrowRight}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
      });
    });

    it('ArrowLeft moves to previous menubar item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const editItem = screen.getByRole('menuitem', { name: 'Edit' });
      editItem.focus();
      await user.keyboard('{ArrowLeft}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
      });
    });

    it('ArrowRight wraps from last to first', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      viewItem.focus();
      await user.keyboard('{ArrowRight}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
      });
    });

    it('ArrowDown opens submenu and focuses first item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{ArrowDown}');

      await vi.waitFor(() => {
        expect(fileItem).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
      });
    });

    it('Enter opens submenu', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{Enter}');

      await vi.waitFor(() => {
        expect(fileItem).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
      });
    });

    it('ArrowUp opens submenu and focuses last item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{ArrowUp}');

      await vi.waitFor(() => {
        expect(fileItem).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
      });
    });

    it('Home moves to first menubar item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      viewItem.focus();
      await user.keyboard('{Home}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'File' })).toHaveFocus();
      });
    });

    it('End moves to last menubar item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      fileItem.focus();
      await user.keyboard('{End}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'View' })).toHaveFocus();
      });
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Menu
  describe('APG Keyboard Interaction - Menu', () => {
    it('ArrowDown moves to next item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{ArrowDown}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Open' })).toHaveFocus();
      });
    });

    it('Escape closes menu and returns focus to menubar', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');

      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
      expect(fileItem).toHaveFocus();
    });

    it('Enter activates menuitem and closes menu', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(Menubar, {
        props: { items: createBasicItems(), 'aria-label': 'Application', onItemSelect },
      });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{Enter}');

      expect(onItemSelect).toHaveBeenCalledWith('new');
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('ArrowUp moves to previous item', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const openItem = screen.getByRole('menuitem', { name: 'Open' });
      openItem.focus();
      await user.keyboard('{ArrowUp}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
      });
    });

    it('Home moves to first item in menu', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const saveItem = screen.getByRole('menuitem', { name: 'Save' });
      saveItem.focus();
      await user.keyboard('{Home}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'New' })).toHaveFocus();
      });
    });

    it('End moves to last item in menu', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const newItem = screen.getByRole('menuitem', { name: 'New' });
      newItem.focus();
      await user.keyboard('{End}');

      await vi.waitFor(() => {
        expect(screen.getByRole('menuitem', { name: 'Save' })).toHaveFocus();
      });
    });
  });

  // 🔴 High Priority: Checkbox and Radio Items
  describe('Checkbox and Radio Items', () => {
    it('Space on checkbox does not close menu', async () => {
      const user = userEvent.setup();
      render(Menubar, {
        props: { items: createItemsWithCheckboxRadio(), 'aria-label': 'Application' },
      });

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const autoSave = screen.getByRole('menuitemcheckbox', { name: 'Auto Save' });
      autoSave.focus();
      await user.keyboard(' ');

      // Menu should still be open
      expect(viewItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('Space on radio does not close menu', async () => {
      const user = userEvent.setup();
      render(Menubar, {
        props: { items: createItemsWithCheckboxRadio(), 'aria-label': 'Application' },
      });

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });
      darkRadio.focus();
      await user.keyboard(' ');

      // Menu should still be open
      expect(viewItem).toHaveAttribute('aria-expanded', 'true');
    });

    it('only one radio in group can be checked', async () => {
      const user = userEvent.setup();
      render(Menubar, {
        props: { items: createItemsWithCheckboxRadio(), 'aria-label': 'Application' },
      });

      const viewItem = screen.getByRole('menuitem', { name: 'View' });
      await user.click(viewItem);

      const lightRadio = screen.getByRole('menuitemradio', { name: 'Light' });
      const darkRadio = screen.getByRole('menuitemradio', { name: 'Dark' });

      expect(lightRadio).toHaveAttribute('aria-checked', 'true');
      expect(darkRadio).toHaveAttribute('aria-checked', 'false');

      darkRadio.focus();
      await user.keyboard(' ');

      await vi.waitFor(() => {
        expect(lightRadio).toHaveAttribute('aria-checked', 'false');
        expect(darkRadio).toHaveAttribute('aria-checked', 'true');
      });
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('first menubar item has tabIndex="0"', () => {
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      expect(fileItem).toHaveAttribute('tabindex', '0');
    });

    it('other menubar items have tabIndex="-1"', () => {
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const editItem = screen.getByRole('menuitem', { name: 'Edit' });
      const viewItem = screen.getByRole('menuitem', { name: 'View' });

      expect(editItem).toHaveAttribute('tabindex', '-1');
      expect(viewItem).toHaveAttribute('tabindex', '-1');
    });
  });

  // 🔴 High Priority: Pointer Interaction
  describe('Pointer Interaction', () => {
    it('click on menubar item opens menu', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      expect(fileItem).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('click on menubar item again closes menu', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'false');
    });

    it('hover on another menubar item switches menu when open', async () => {
      const user = userEvent.setup();
      render(Menubar, { props: { items: createBasicItems(), 'aria-label': 'Application' } });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      const editItem = screen.getByRole('menuitem', { name: 'Edit' });

      await user.click(fileItem);
      expect(fileItem).toHaveAttribute('aria-expanded', 'true');

      await user.hover(editItem);

      await vi.waitFor(() => {
        expect(fileItem).toHaveAttribute('aria-expanded', 'false');
        expect(editItem).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations when closed', async () => {
      const { container } = render(Menubar, {
        props: { items: createBasicItems(), 'aria-label': 'Application' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with menu open', async () => {
      const user = userEvent.setup();
      const { container } = render(Menubar, {
        props: { items: createBasicItems(), 'aria-label': 'Application' },
      });

      const fileItem = screen.getByRole('menuitem', { name: 'File' });
      await user.click(fileItem);

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
