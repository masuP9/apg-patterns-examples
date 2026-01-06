import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Combobox, type ComboboxOption } from './Combobox';

// Default test options
const defaultOptions: ComboboxOption[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
];

// Options with disabled item
const optionsWithDisabled: ComboboxOption[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana', disabled: true },
  { id: 'cherry', label: 'Cherry' },
];

// Options with first item disabled
const optionsWithFirstDisabled: ComboboxOption[] = [
  { id: 'apple', label: 'Apple', disabled: true },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
];

// Options with last item disabled
const optionsWithLastDisabled: ComboboxOption[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry', disabled: true },
];

// All disabled options
const allDisabledOptions: ComboboxOption[] = [
  { id: 'apple', label: 'Apple', disabled: true },
  { id: 'banana', label: 'Banana', disabled: true },
  { id: 'cherry', label: 'Cherry', disabled: true },
];

describe('Combobox', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG: ARIA Attributes', () => {
    it('input has role="combobox"', () => {
      render(<Combobox options={defaultOptions} label="Fruit" />);
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(<Combobox options={defaultOptions} label="Select a fruit" />);
      const input = screen.getByRole('combobox');
      expect(input).toHaveAccessibleName('Select a fruit');
    });

    it('has aria-controls pointing to listbox', () => {
      render(<Combobox options={defaultOptions} label="Fruit" />);
      const input = screen.getByRole('combobox');
      const listboxId = input.getAttribute('aria-controls');

      expect(listboxId).toBeTruthy();
      expect(document.getElementById(listboxId!)).toHaveAttribute('role', 'listbox');
    });

    it('aria-controls points to existing listbox even when closed', () => {
      render(<Combobox options={defaultOptions} label="Fruit" />);
      const input = screen.getByRole('combobox');
      const listboxId = input.getAttribute('aria-controls');

      expect(listboxId).toBeTruthy();
      const listbox = document.getElementById(listboxId!);
      expect(listbox).toBeInTheDocument();
      expect(listbox).toHaveAttribute('hidden');
    });

    it('has aria-expanded="false" when closed', () => {
      render(<Combobox options={defaultOptions} label="Fruit" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('has aria-expanded="true" when opened', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('has aria-autocomplete="list"', () => {
      render(<Combobox options={defaultOptions} label="Fruit" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('has aria-autocomplete="none" when autocomplete is none', () => {
      render(<Combobox options={defaultOptions} label="Fruit" autocomplete="none" />);
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('has aria-activedescendant when option focused', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute('aria-activedescendant');
      const activeId = input.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      expect(document.getElementById(activeId!)).toHaveTextContent('Apple');
    });

    it('clears aria-activedescendant when closed', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input.getAttribute('aria-activedescendant')).toBeTruthy();

      await user.keyboard('{Escape}');
      expect(input.getAttribute('aria-activedescendant')).toBeFalsy();
    });

    it('clears aria-activedescendant when list is empty after filtering', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input.getAttribute('aria-activedescendant')).toBeTruthy();

      // Type something that matches no options
      await user.clear(input);
      await user.type(input, 'xyz');
      expect(input.getAttribute('aria-activedescendant')).toBeFalsy();
    });

    it('listbox has role="listbox"', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('listbox is hidden when closed', () => {
      render(<Combobox options={defaultOptions} label="Fruit" />);
      const input = screen.getByRole('combobox');
      const listboxId = input.getAttribute('aria-controls');
      const listbox = document.getElementById(listboxId!);

      expect(listbox).toHaveAttribute('hidden');
    });

    it('options have role="option"', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('focused option has aria-selected="true"', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const firstOption = screen.getByRole('option', { name: 'Apple' });
      expect(firstOption).toHaveAttribute('aria-selected', 'true');
    });

    it('non-focused options have aria-selected="false"', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const secondOption = screen.getByRole('option', { name: 'Banana' });
      const thirdOption = screen.getByRole('option', { name: 'Cherry' });
      expect(secondOption).toHaveAttribute('aria-selected', 'false');
      expect(thirdOption).toHaveAttribute('aria-selected', 'false');
    });

    it('disabled option has aria-disabled="true"', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const disabledOption = screen.getByRole('option', { name: 'Banana' });
      expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction (Input)
  describe('APG: Keyboard Interaction (Input)', () => {
    it('opens popup and focuses first enabled option on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
      const activeId = input.getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId!)).toHaveTextContent('Apple');
    });

    it('opens popup and focuses last enabled option on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowUp}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
      const activeId = input.getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId!)).toHaveTextContent('Cherry');
    });

    it('skips disabled first option on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithFirstDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const activeId = input.getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId!)).toHaveTextContent('Banana');
    });

    it('skips disabled last option on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithLastDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowUp}');

      const activeId = input.getAttribute('aria-activedescendant');
      expect(document.getElementById(activeId!)).toHaveTextContent('Banana');
    });

    it('closes popup on Escape', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('restores input value on Escape', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" defaultInputValue="App" />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('App');

      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      // After navigation, input might show preview of Banana
      await user.keyboard('{Escape}');

      expect(input).toHaveValue('App');
    });

    it('selects option and closes popup on Enter', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Combobox options={defaultOptions} label="Fruit" onSelect={onSelect} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onSelect).toHaveBeenCalledWith(defaultOptions[0]);
      expect(input).toHaveAttribute('aria-expanded', 'false');
      expect(input).toHaveValue('Apple');
    });

    it('closes popup on Tab', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Combobox options={defaultOptions} label="Fruit" />
          <button>Next</button>
        </div>
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Tab}');
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('opens popup on typing', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'a');

      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('Alt+ArrowDown opens without changing focus position', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{Alt>}{ArrowDown}{/Alt}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
      // aria-activedescendant should not be set
      expect(input.getAttribute('aria-activedescendant')).toBeFalsy();
    });

    it('Alt+ArrowUp commits selection and closes', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Combobox options={defaultOptions} label="Fruit" onSelect={onSelect} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Alt>}{ArrowUp}{/Alt}');

      expect(onSelect).toHaveBeenCalledWith(defaultOptions[1]);
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction (Listbox Navigation)
  describe('APG: Keyboard Interaction (Listbox)', () => {
    it('moves to next enabled option on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Apple');

      await user.keyboard('{ArrowDown}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Banana');
    });

    it('moves to previous enabled option on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Banana');

      await user.keyboard('{ArrowUp}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Apple');
    });

    it('skips disabled option on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Apple');

      await user.keyboard('{ArrowDown}');
      // Should skip Banana (disabled) and go to Cherry
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Cherry');
    });

    it('skips disabled option on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowUp}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Cherry');

      await user.keyboard('{ArrowUp}');
      // Should skip Banana (disabled) and go to Apple
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Apple');
    });

    it('moves to first enabled option on Home', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithFirstDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowUp}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Cherry');

      await user.keyboard('{Home}');
      // Should skip Apple (disabled) and go to Banana
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Banana');
    });

    it('moves to last enabled option on End', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithLastDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Apple');

      await user.keyboard('{End}');
      // Should skip Cherry (disabled) and go to Banana
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Banana');
    });

    it('does not wrap on ArrowDown at last option', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Cherry');

      await user.keyboard('{ArrowDown}');
      // Should stay at Cherry, no wrap
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Cherry');
    });

    it('does not wrap on ArrowUp at first option', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Apple');

      await user.keyboard('{ArrowUp}');
      // Should stay at Apple, no wrap
      expect(
        document.getElementById(input.getAttribute('aria-activedescendant')!)
      ).toHaveTextContent('Apple');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('keeps DOM focus on input when navigating', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');

      expect(input).toHaveFocus();
    });

    it('updates aria-activedescendant on navigation', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const firstActiveId = input.getAttribute('aria-activedescendant');
      expect(firstActiveId).toBeTruthy();

      await user.keyboard('{ArrowDown}');

      const secondActiveId = input.getAttribute('aria-activedescendant');
      expect(secondActiveId).toBeTruthy();
      expect(secondActiveId).not.toBe(firstActiveId);
    });

    it('aria-activedescendant references existing element', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const activeId = input.getAttribute('aria-activedescendant');
      expect(activeId).toBeTruthy();
      expect(document.getElementById(activeId!)).toBeInTheDocument();
    });

    it('maintains focus on input after selection', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(input).toHaveFocus();
    });
  });

  // 🔴 High Priority: Autocomplete
  describe('Autocomplete', () => {
    it('filters options based on input', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'app');

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Apple');
    });

    it('shows all options when input is empty', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('updates input value on selection', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(input).toHaveValue('Banana');
    });

    it('does not filter when autocomplete="none"', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" autocomplete="none" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'xyz');

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);
    });

    it('case-insensitive filtering', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'APPLE');

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Apple');
    });

    it('shows no options message when filter results are empty', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'xyz');

      expect(screen.queryAllByRole('option')).toHaveLength(0);
    });
  });

  // 🔴 High Priority: Disabled Options
  describe('Disabled Options', () => {
    it('does not select disabled option on Enter', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Combobox options={optionsWithFirstDisabled} label="Fruit" onSelect={onSelect} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      // First enabled option is Banana
      await user.keyboard('{ArrowUp}');
      // Try to go to Apple (disabled) - should stay at Banana
      await user.keyboard('{Enter}');

      expect(onSelect).toHaveBeenCalledWith(optionsWithFirstDisabled[1]);
    });

    it('does not select disabled option on click', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Combobox options={optionsWithDisabled} label="Fruit" onSelect={onSelect} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const disabledOption = screen.getByRole('option', { name: 'Banana' });
      await user.click(disabledOption);

      expect(onSelect).not.toHaveBeenCalled();
      expect(input).toHaveAttribute('aria-expanded', 'true');
    });

    it('shows disabled options in filtered results', async () => {
      const user = userEvent.setup();
      render(<Combobox options={optionsWithDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'ban');

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(1);
      expect(options[0]).toHaveTextContent('Banana');
      expect(options[0]).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // 🔴 High Priority: Mouse Interaction
  describe('Mouse Interaction', () => {
    it('selects option on click', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Combobox options={defaultOptions} label="Fruit" onSelect={onSelect} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const option = screen.getByRole('option', { name: 'Banana' });
      await user.click(option);

      expect(onSelect).toHaveBeenCalledWith(defaultOptions[1]);
      expect(input).toHaveValue('Banana');
    });

    it('closes popup on option click', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-expanded', 'true');

      const option = screen.getByRole('option', { name: 'Banana' });
      await user.click(option);

      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('closes popup on outside click', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <Combobox options={defaultOptions} label="Fruit" />
          <button>Outside</button>
        </div>
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(input).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByRole('button', { name: 'Outside' }));
      expect(input).toHaveAttribute('aria-expanded', 'false');
    });

    it('does not select on outside click', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(
        <div>
          <Combobox options={defaultOptions} label="Fruit" onSelect={onSelect} />
          <button>Outside</button>
        </div>
      );

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      await user.click(screen.getByRole('button', { name: 'Outside' }));
      expect(onSelect).not.toHaveBeenCalled();
    });

    it('updates aria-selected on hover', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const bananaOption = screen.getByRole('option', { name: 'Banana' });
      await user.hover(bananaOption);

      expect(bananaOption).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('option', { name: 'Apple' })).toHaveAttribute(
        'aria-selected',
        'false'
      );
    });
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no axe violations when closed', async () => {
      const { container } = render(<Combobox options={defaultOptions} label="Fruit" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when open', async () => {
      const user = userEvent.setup();
      const { container } = render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with selection', async () => {
      const user = userEvent.setup();
      const { container } = render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with disabled options', async () => {
      const user = userEvent.setup();
      const { container } = render(<Combobox options={optionsWithDisabled} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('calls onSelect when option selected', async () => {
      const user = userEvent.setup();
      const onSelect = vi.fn();
      render(<Combobox options={defaultOptions} label="Fruit" onSelect={onSelect} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(onSelect).toHaveBeenCalledWith(defaultOptions[0]);
      expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('calls onInputChange when typing', async () => {
      const user = userEvent.setup();
      const onInputChange = vi.fn();
      render(<Combobox options={defaultOptions} label="Fruit" onInputChange={onInputChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'app');

      expect(onInputChange).toHaveBeenCalledWith('a');
      expect(onInputChange).toHaveBeenCalledWith('ap');
      expect(onInputChange).toHaveBeenCalledWith('app');
    });

    it('calls onOpenChange when popup toggles', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<Combobox options={defaultOptions} label="Fruit" onOpenChange={onOpenChange} />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');
      expect(onOpenChange).toHaveBeenCalledWith(true);

      await user.keyboard('{Escape}');
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it('applies className to container', () => {
      const { container } = render(
        <Combobox options={defaultOptions} label="Fruit" className="custom-class" />
      );

      expect(container.querySelector('.apg-combobox')).toHaveClass('custom-class');
    });

    it('supports disabled state on combobox', () => {
      render(<Combobox options={defaultOptions} label="Fruit" disabled />);

      const input = screen.getByRole('combobox');
      expect(input).toBeDisabled();
    });

    it('supports placeholder', () => {
      render(<Combobox options={defaultOptions} label="Fruit" placeholder="Choose a fruit..." />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('placeholder', 'Choose a fruit...');
    });

    it('supports defaultInputValue', () => {
      render(<Combobox options={defaultOptions} label="Fruit" defaultInputValue="Ban" />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Ban');
    });

    it('supports defaultSelectedOptionId', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" defaultSelectedOptionId="banana" />);

      const input = screen.getByRole('combobox');
      expect(input).toHaveValue('Banana');

      // Open popup - should show all options (not filtered) since input matches selected label
      await user.click(input);

      // All options should be visible (defaultOptions has 3 items)
      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(3);

      // Banana should have data-selected (visually selected state)
      const bananaOption = screen.getByRole('option', { name: 'Banana' });
      expect(bananaOption).toHaveAttribute('data-selected', 'true');

      // Navigate with ArrowDown - focuses first option (Apple)
      await user.keyboard('{ArrowDown}');
      const appleOption = screen.getByRole('option', { name: 'Apple' });
      expect(appleOption).toHaveAttribute('aria-selected', 'true');
    });

    it('IDs do not conflict with multiple instances', () => {
      render(
        <>
          <Combobox options={defaultOptions} label="Fruit 1" />
          <Combobox options={defaultOptions} label="Fruit 2" />
        </>
      );

      const inputs = screen.getAllByRole('combobox');
      const listboxId1 = inputs[0].getAttribute('aria-controls');
      const listboxId2 = inputs[1].getAttribute('aria-controls');

      expect(listboxId1).not.toBe(listboxId2);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('handles empty options array', () => {
      expect(() => {
        render(<Combobox options={[]} label="Fruit" />);
      }).not.toThrow();

      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('when all options are disabled, popup opens but no focus set', async () => {
      const user = userEvent.setup();
      render(<Combobox options={allDisabledOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.keyboard('{ArrowDown}');

      expect(input).toHaveAttribute('aria-expanded', 'true');
      expect(input.getAttribute('aria-activedescendant')).toBeFalsy();
    });

    it('handles rapid typing without errors', async () => {
      const user = userEvent.setup();
      render(<Combobox options={defaultOptions} label="Fruit" />);

      const input = screen.getByRole('combobox');
      await user.click(input);
      await user.type(input, 'applebananacherry', { delay: 10 });

      // Should not throw and should handle gracefully
      expect(input).toHaveValue('applebananacherry');
    });
  });
});
