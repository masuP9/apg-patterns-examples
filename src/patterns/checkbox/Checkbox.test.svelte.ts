import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from './Checkbox.svelte';

describe('Checkbox (Svelte)', () => {
  // 🔴 High Priority: DOM State
  describe('DOM State', () => {
    it('has role="checkbox"', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms' },
      });
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('is unchecked by default', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('is checked when initialChecked=true', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', initialChecked: true },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('toggles checked state on click', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });

    it('supports indeterminate property', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Select all', indeterminate: true },
      });
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('clears indeterminate on user interaction', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        props: { 'aria-label': 'Select all', indeterminate: true },
      });
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox.indeterminate).toBe(true);
      await user.click(checkbox);
      expect(checkbox.indeterminate).toBe(false);
    });

    it('is disabled when disabled prop is set', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', disabled: true },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('does not change state when clicked while disabled', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', disabled: true },
      });
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await user.click(checkbox);
      expect(checkbox).not.toBeChecked();
    });
  });

  // 🔴 High Priority: Label & Form
  describe('Label & Form', () => {
    it('sets accessible name via aria-label', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms and conditions' },
      });
      expect(
        screen.getByRole('checkbox', { name: 'Accept terms and conditions' })
      ).toBeInTheDocument();
    });

    it('sets accessible name via external <label>', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);

      const label = document.createElement('label');
      label.htmlFor = 'terms-checkbox';
      label.textContent = 'Accept terms and conditions';
      container.appendChild(label);

      render(Checkbox, {
        target: container,
        props: { id: 'terms-checkbox' },
      });

      expect(
        screen.getByRole('checkbox', { name: 'Accept terms and conditions' })
      ).toBeInTheDocument();

      document.body.removeChild(container);
    });

    it('supports name attribute for form submission', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', name: 'terms' },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'terms');
    });

    it('sets value attribute correctly', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Red', name: 'color', value: 'red' },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('value', 'red');
    });
  });

  // 🔴 High Priority: Keyboard
  describe('Keyboard', () => {
    it('toggles on Space key', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      expect(checkbox).not.toBeChecked();
      await user.keyboard(' ');
      expect(checkbox).toBeChecked();
    });

    it('skips disabled checkbox with Tab', async () => {
      const user = userEvent.setup();
      const container = document.createElement('div');
      document.body.appendChild(container);

      const { unmount: unmount1 } = render(Checkbox, {
        target: container,
        props: { 'aria-label': 'Checkbox 1' },
      });
      const { unmount: unmount2 } = render(Checkbox, {
        target: container,
        props: { 'aria-label': 'Checkbox 2', disabled: true },
      });
      const { unmount: unmount3 } = render(Checkbox, {
        target: container,
        props: { 'aria-label': 'Checkbox 3' },
      });

      await user.tab();
      expect(screen.getByRole('checkbox', { name: 'Checkbox 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('checkbox', { name: 'Checkbox 3' })).toHaveFocus();

      unmount1();
      unmount2();
      unmount3();
      document.body.removeChild(container);
    });

    it('ignores Space key when disabled', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', disabled: true },
      });
      const checkbox = screen.getByRole('checkbox');

      // disabled checkbox cannot be focused, so keyboard events won't affect it
      expect(checkbox).toBeDisabled();
      expect(checkbox).not.toBeChecked();
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Checkbox, {
        props: { 'aria-label': 'Accept terms' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when checked', async () => {
      const { container } = render(Checkbox, {
        props: { 'aria-label': 'Accept terms', initialChecked: true },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when indeterminate', async () => {
      const { container } = render(Checkbox, {
        props: { 'aria-label': 'Select all', indeterminate: true },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(Checkbox, {
        props: { 'aria-label': 'Accept terms', disabled: true },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Callbacks
  describe('Callbacks', () => {
    it('calls onCheckedChange when state changes', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', onCheckedChange: handleCheckedChange },
      });

      await user.click(screen.getByRole('checkbox'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole('checkbox'));
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
    });

    it('calls onCheckedChange when indeterminate is cleared', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(Checkbox, {
        props: {
          'aria-label': 'Select all',
          indeterminate: true,
          onCheckedChange: handleCheckedChange,
        },
      });

      await user.click(screen.getByRole('checkbox'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('has apg-checkbox class by default', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', 'data-testid': 'wrapper' },
      });
      const wrapper = screen.getByTestId('wrapper');
      expect(wrapper).toHaveClass('apg-checkbox');
    });

    it('passes through data-* attributes', () => {
      render(Checkbox, {
        props: { 'aria-label': 'Accept terms', 'data-testid': 'custom-checkbox' },
      });
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument();
    });
  });
});
