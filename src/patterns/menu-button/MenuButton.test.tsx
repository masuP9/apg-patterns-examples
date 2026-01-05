import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MenuButton, type MenuItem } from './MenuButton';

afterEach(() => {
  vi.useRealTimers();
});

// Default test items
const defaultItems: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
];

// Test items with disabled item
const itemsWithDisabled: MenuItem[] = [
  { id: 'cut', label: 'Cut', disabled: true },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
];

// Test items with all disabled
const allDisabledItems: MenuItem[] = [
  { id: 'cut', label: 'Cut', disabled: true },
  { id: 'copy', label: 'Copy', disabled: true },
  { id: 'paste', label: 'Paste', disabled: true },
];

// Test items for type-ahead
const typeAheadItems: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'clear', label: 'Clear' },
  { id: 'edit', label: 'Edit' },
];

describe('MenuButton', () => {
  // 🔴 High Priority: APG Mouse Operations
  describe('APG: Mouse Operations', () => {
    it('opens menu on button click', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).not.toHaveAttribute('hidden');
    });

    it('closes menu on button click when open (toggle)', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('executes and closes menu on menu item click', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(<MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const menuItem = screen.getByRole('menuitem', { name: 'Copy' });
      await user.click(menuItem);

      expect(onItemSelect).toHaveBeenCalledWith('copy');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('does nothing on disabled item click', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(<MenuButton items={itemsWithDisabled} label="Actions" onItemSelect={onItemSelect} />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const disabledItem = screen.getByRole('menuitem', { name: 'Cut' });
      await user.click(disabledItem);

      expect(onItemSelect).not.toHaveBeenCalled();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('closes menu on click outside', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <MenuButton items={defaultItems} label="Actions" />
          <button>Outside</button>
        </div>
      );

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByRole('button', { name: 'Outside' }));
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction (Button)
  describe('APG: Keyboard Interaction (Button)', () => {
    it('opens menu and focuses first enabled item with Enter', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard('{Enter}');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('opens menu and focuses first enabled item with Space', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard(' ');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('opens menu and focuses first enabled item with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard('{ArrowDown}');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('opens menu and focuses last enabled item with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard('{ArrowUp}');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction (Menu)
  describe('APG: Keyboard Interaction (Menu)', () => {
    it('moves to next enabled item with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });

    it('loops from last to first with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const lastItem = screen.getByRole('menuitem', { name: 'Paste' });
      lastItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('moves to previous enabled item with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const secondItem = screen.getByRole('menuitem', { name: 'Copy' });
      secondItem.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('loops from first to last with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
    });

    it('moves to first enabled item with Home (skips disabled)', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={itemsWithDisabled} label="Actions" defaultOpen />);

      const lastItem = screen.getByRole('menuitem', { name: 'Paste' });
      lastItem.focus();
      await user.keyboard('{Home}');

      // Cut is disabled, so focus should go to Copy
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });

    it('moves to last enabled item with End (skips disabled)', async () => {
      const user = userEvent.setup();
      const itemsWithLastDisabled: MenuItem[] = [
        { id: 'cut', label: 'Cut' },
        { id: 'copy', label: 'Copy' },
        { id: 'paste', label: 'Paste', disabled: true },
      ];
      render(<MenuButton items={itemsWithLastDisabled} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{End}');

      // Paste is disabled, so focus should go to Copy
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });

    it('skips disabled items with ArrowDown/Up', async () => {
      const user = userEvent.setup();
      const itemsWithMiddleDisabled: MenuItem[] = [
        { id: 'cut', label: 'Cut' },
        { id: 'copy', label: 'Copy', disabled: true },
        { id: 'paste', label: 'Paste' },
      ];
      render(<MenuButton items={itemsWithMiddleDisabled} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{ArrowDown}');

      // Copy is disabled, so focus should skip to Paste
      expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
    });

    it('closes menu and focuses button with Escape', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveFocus();
    });

    it('closes menu and moves focus with Tab', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <MenuButton items={defaultItems} label="Actions" />
          <button>Next</button>
        </div>
      );

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Tab}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('executes item and closes menu with Enter', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} defaultOpen />
      );

      const item = screen.getByRole('menuitem', { name: 'Copy' });
      item.focus();
      await user.keyboard('{Enter}');

      expect(onItemSelect).toHaveBeenCalledWith('copy');
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    it('executes item and closes menu with Space (prevents scroll)', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} defaultOpen />
      );

      const item = screen.getByRole('menuitem', { name: 'Copy' });
      item.focus();
      await user.keyboard(' ');

      expect(onItemSelect).toHaveBeenCalledWith('copy');
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });
  });

  // 🔴 High Priority: Type-ahead
  describe('APG: Type-ahead', () => {
    it('focuses matching item with character key', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('e');

      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });

    it('matches with multiple characters (e.g., "cl" → "Clear")', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('cl');

      expect(screen.getByRole('menuitem', { name: 'Clear' })).toHaveFocus();
    });

    it('cycles through matches with repeated same character', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();

      // First 'c' -> Cut (already focused, or next match)
      await user.keyboard('c');
      // Items starting with 'c': Cut, Copy, Clear
      // After first 'c' from Cut, should go to Copy
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();

      await user.keyboard('c');
      expect(screen.getByRole('menuitem', { name: 'Clear' })).toHaveFocus();

      await user.keyboard('c');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('skips disabled items in type-ahead', async () => {
      const user = userEvent.setup();
      const itemsWithDisabledMatch: MenuItem[] = [
        { id: 'cut', label: 'Cut' },
        { id: 'copy', label: 'Copy', disabled: true },
        { id: 'clear', label: 'Clear' },
      ];
      render(<MenuButton items={itemsWithDisabledMatch} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('c');

      // Copy is disabled, so should skip to Clear
      expect(screen.getByRole('menuitem', { name: 'Clear' })).toHaveFocus();
    });

    it('does not change focus when no match', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('z');

      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('resets buffer after 500ms', () => {
      vi.useFakeTimers();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      act(() => {
        firstItem.focus();
      });

      // Type 'c' -> moves to Copy
      act(() => {
        fireEvent.keyDown(firstItem, { key: 'c' });
      });
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();

      // Wait for buffer reset (500ms)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // After reset, 'e' should match 'Edit' (not 'ce')
      const copyItem = screen.getByRole('menuitem', { name: 'Copy' });
      act(() => {
        fireEvent.keyDown(copyItem, { key: 'e' });
      });
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: APG ARIA Attributes
  describe('APG: ARIA Attributes', () => {
    it('button has aria-haspopup="menu"', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-haspopup',
        'menu'
      );
    });

    it('has aria-expanded="false" when closed', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    it('has aria-expanded="true" when open', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('button always references menu with aria-controls', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      const button = screen.getByRole('button', { name: 'Actions' });
      const menuId = button.getAttribute('aria-controls');

      expect(menuId).toBeTruthy();
      expect(document.getElementById(menuId!)).toHaveAttribute('role', 'menu');
    });

    it('menu has role="menu"', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('menu references button with aria-labelledby', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const menu = screen.getByRole('menu');
      const labelledbyId = menu.getAttribute('aria-labelledby');

      expect(labelledbyId).toBeTruthy();
      expect(document.getElementById(labelledbyId!)).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('items have role="menuitem"', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const menuItems = screen.getAllByRole('menuitem');

      expect(menuItems).toHaveLength(3);
    });

    it('disabled item has aria-disabled="true"', () => {
      render(<MenuButton items={itemsWithDisabled} label="Actions" defaultOpen />);
      const disabledItem = screen.getByRole('menuitem', { name: 'Cut' });

      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('focused item has tabindex="0"', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const focusedItem = screen.getByRole('menuitem', { name: 'Cut' });
      expect(focusedItem).toHaveAttribute('tabindex', '0');
    });

    it('other items have tabindex="-1"', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const otherItems = screen
        .getAllByRole('menuitem')
        .filter((item) => item.textContent !== 'Cut');
      otherItems.forEach((item) => {
        expect(item).toHaveAttribute('tabindex', '-1');
      });
    });

    it('disabled item has tabindex="-1"', () => {
      render(<MenuButton items={itemsWithDisabled} label="Actions" defaultOpen />);
      const disabledItem = screen.getByRole('menuitem', { name: 'Cut' });

      expect(disabledItem).toHaveAttribute('tabindex', '-1');
    });

    it('returns focus to button when menu closes', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const item = screen.getByRole('menuitem', { name: 'Copy' });
      await user.click(item);

      expect(button).toHaveFocus();
    });

    it('menu has inert and hidden when closed', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      const menu = screen.getByRole('menu', { hidden: true });

      expect(menu).toHaveAttribute('hidden');
      expect(menu).toHaveAttribute('inert');
    });
  });

  // 🔴 High Priority: Edge Cases
  describe('Edge Cases', () => {
    it('when all items are disabled, menu opens but focus stays on button', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={allDisabledItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveFocus();
    });

    it('does not crash with empty items array', () => {
      expect(() => {
        render(<MenuButton items={[]} label="Actions" />);
      }).not.toThrow();

      expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
    });

    it('IDs do not conflict with multiple instances', () => {
      render(
        <>
          <MenuButton items={defaultItems} label="Actions 1" />
          <MenuButton items={defaultItems} label="Actions 2" />
        </>
      );

      const button1 = screen.getByRole('button', { name: 'Actions 1' });
      const button2 = screen.getByRole('button', { name: 'Actions 2' });

      const menuId1 = button1.getAttribute('aria-controls');
      const menuId2 = button2.getAttribute('aria-controls');

      expect(menuId1).not.toBe(menuId2);
    });
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('no axe violations when closed', async () => {
      const { container } = render(<MenuButton items={defaultItems} label="Actions" />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('no axe violations when open', async () => {
      const { container } = render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props
  describe('Props', () => {
    it('initially displayed when defaultOpen=true', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const button = screen.getByRole('button', { name: 'Actions' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).not.toHaveAttribute('hidden');
    });

    it('applies className to container', () => {
      const { container } = render(
        <MenuButton items={defaultItems} label="Actions" className="custom-class" />
      );

      expect(container.querySelector('.apg-menu-button')).toHaveClass('custom-class');
    });

    it('calls onItemSelect with correct id', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(<MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const item = screen.getByRole('menuitem', { name: 'Paste' });
      await user.click(item);

      expect(onItemSelect).toHaveBeenCalledWith('paste');
      expect(onItemSelect).toHaveBeenCalledTimes(1);
    });
  });
});
