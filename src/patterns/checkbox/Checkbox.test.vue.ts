import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from './Checkbox.vue';

describe('Checkbox (Vue)', () => {
  // 🔴 High Priority: DOM State
  describe('DOM State', () => {
    it('has role="checkbox"', () => {
      render(Checkbox, {
        attrs: { 'aria-label': 'Accept terms' },
      });
      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('is unchecked by default', () => {
      render(Checkbox, {
        attrs: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).not.toBeChecked();
    });

    it('is checked when initialChecked=true', () => {
      render(Checkbox, {
        props: { initialChecked: true },
        attrs: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeChecked();
    });

    it('toggles checked state on click', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        attrs: { 'aria-label': 'Accept terms' },
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
        props: { indeterminate: true },
        attrs: { 'aria-label': 'Select all' },
      });
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
      expect(checkbox.indeterminate).toBe(true);
    });

    it('clears indeterminate on user interaction', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        props: { indeterminate: true },
        attrs: { 'aria-label': 'Select all' },
      });
      const checkbox = screen.getByRole('checkbox') as HTMLInputElement;

      expect(checkbox.indeterminate).toBe(true);
      await user.click(checkbox);
      expect(checkbox.indeterminate).toBe(false);
    });

    it('is disabled when disabled prop is set', () => {
      render(Checkbox, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeDisabled();
    });

    it('does not change state when clicked while disabled', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Accept terms' },
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
        attrs: { 'aria-label': 'Accept terms and conditions' },
      });
      expect(
        screen.getByRole('checkbox', { name: 'Accept terms and conditions' })
      ).toBeInTheDocument();
    });

    it('sets accessible name via external <label>', () => {
      render({
        components: { Checkbox },
        template: `
          <div>
            <label for="terms-checkbox">Accept terms and conditions</label>
            <Checkbox id="terms-checkbox" />
          </div>
        `,
      });
      expect(
        screen.getByRole('checkbox', { name: 'Accept terms and conditions' })
      ).toBeInTheDocument();
    });

    it('toggles checkbox when clicking external label', async () => {
      const user = userEvent.setup();
      render({
        components: { Checkbox },
        template: `
          <div>
            <label for="terms-checkbox">Accept terms</label>
            <Checkbox id="terms-checkbox" />
          </div>
        `,
      });
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).not.toBeChecked();
      await user.click(screen.getByText('Accept terms'));
      expect(checkbox).toBeChecked();
    });

    it('supports name attribute for form submission', () => {
      render(Checkbox, {
        props: { name: 'terms' },
        attrs: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toHaveAttribute('name', 'terms');
    });

    it('sets value attribute correctly', () => {
      render(Checkbox, {
        props: { name: 'color', value: 'red' },
        attrs: { 'aria-label': 'Red' },
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
        attrs: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      expect(checkbox).not.toBeChecked();
      await user.keyboard(' ');
      expect(checkbox).toBeChecked();
    });

    it('moves focus with Tab key', async () => {
      const user = userEvent.setup();
      render({
        components: { Checkbox },
        template: `
          <div>
            <Checkbox aria-label="Checkbox 1" />
            <Checkbox aria-label="Checkbox 2" />
          </div>
        `,
      });

      await user.tab();
      expect(screen.getByRole('checkbox', { name: 'Checkbox 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('checkbox', { name: 'Checkbox 2' })).toHaveFocus();
    });

    it('skips disabled checkbox with Tab', async () => {
      const user = userEvent.setup();
      render({
        components: { Checkbox },
        template: `
          <div>
            <Checkbox aria-label="Checkbox 1" />
            <Checkbox aria-label="Checkbox 2 (disabled)" disabled />
            <Checkbox aria-label="Checkbox 3" />
          </div>
        `,
      });

      await user.tab();
      expect(screen.getByRole('checkbox', { name: 'Checkbox 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('checkbox', { name: 'Checkbox 3' })).toHaveFocus();
    });

    it('ignores Space key when disabled', async () => {
      const user = userEvent.setup();
      render(Checkbox, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Accept terms' },
      });
      const checkbox = screen.getByRole('checkbox');

      checkbox.focus();
      await user.keyboard(' ');
      expect(checkbox).not.toBeChecked();
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Checkbox, {
        attrs: { 'aria-label': 'Accept terms' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when checked', async () => {
      const { container } = render(Checkbox, {
        props: { initialChecked: true },
        attrs: { 'aria-label': 'Accept terms' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when indeterminate', async () => {
      const { container } = render(Checkbox, {
        props: { indeterminate: true },
        attrs: { 'aria-label': 'Select all' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(Checkbox, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Accept terms' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with external label', async () => {
      const { container } = render({
        components: { Checkbox },
        template: `
          <div>
            <label for="terms">Accept terms</label>
            <Checkbox id="terms" />
          </div>
        `,
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
        props: { onCheckedChange: handleCheckedChange },
        attrs: { 'aria-label': 'Accept terms' },
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
        props: { indeterminate: true, onCheckedChange: handleCheckedChange },
        attrs: { 'aria-label': 'Select all' },
      });

      await user.click(screen.getByRole('checkbox'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('merges class correctly', () => {
      render(Checkbox, {
        attrs: { class: 'custom-class', 'data-testid': 'wrapper', 'aria-label': 'Accept terms' },
      });
      const wrapper = screen.getByTestId('wrapper');
      expect(wrapper).toHaveClass('custom-class');
      expect(wrapper).toHaveClass('apg-checkbox');
    });

    it('passes through data-* attributes', () => {
      render(Checkbox, {
        attrs: { 'data-testid': 'custom-checkbox', 'aria-label': 'Accept terms' },
      });
      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument();
    });
  });
});
