import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import RadioGroup from './RadioGroup.svelte';

// Prop mapping vs React:
// - React `aria-label` / `aria-labelledby` -> Svelte `aria-label` / `aria-labelledby` props (same names).
// - React `onValueChange` callback prop -> Svelte `onValueChange` callback prop (same).
// - React `className` -> Svelte `class`.
// - DOM attribute `tabindex` (lowercase) used for assertions.
// Tab-order tests adapt the React sibling-button setup by inserting a real button before/after
// the rendered group in the document; no React-specific cases are skipped.

const defaultOptions = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'blue', label: 'Blue', value: 'blue' },
  { id: 'green', label: 'Green', value: 'green' },
];

const optionsWithDisabled = [
  { id: 'red', label: 'Red', value: 'red' },
  { id: 'blue', label: 'Blue', value: 'blue', disabled: true },
  { id: 'green', label: 'Green', value: 'green' },
];

function makeButton(label: string, position: 'before' | 'after', anchor: HTMLElement) {
  const btn = document.createElement('button');
  btn.textContent = label;
  if (position === 'before') {
    anchor.parentElement!.insertBefore(btn, anchor);
  } else {
    anchor.parentElement!.appendChild(btn);
  }
  return btn;
}

describe('RadioGroup (Svelte)', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="radiogroup" on container', () => {
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('has role="radio" on each option', () => {
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('has aria-checked attribute on radios', () => {
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('aria-checked');
      });
    });

    it('sets aria-checked="true" on selected radio', () => {
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'false');
    });

    it('sets accessible name on radiogroup via aria-label', () => {
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      expect(screen.getByRole('radiogroup', { name: 'Favorite color' })).toBeInTheDocument();
    });

    it('sets accessible name on radiogroup via aria-labelledby', () => {
      const label = document.createElement('span');
      label.id = 'color-label';
      label.textContent = 'Choose a color';
      document.body.appendChild(label);
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-labelledby': 'color-label' },
      });
      expect(screen.getByRole('radiogroup', { name: 'Choose a color' })).toBeInTheDocument();
    });

    it('sets accessible name on each radio', () => {
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      expect(screen.getByRole('radio', { name: 'Red' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Blue' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Green' })).toBeInTheDocument();
    });

    it('sets aria-disabled="true" on disabled radio', () => {
      render(RadioGroup, {
        props: { options: optionsWithDisabled, name: 'color', 'aria-label': 'Favorite color' },
      });
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets aria-orientation="horizontal" only when orientation is horizontal', async () => {
      const { rerender } = render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          orientation: 'horizontal',
        },
      });
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'horizontal');

      await rerender({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        orientation: 'vertical',
      });
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-orientation');

      await rerender({
        options: defaultOptions,
        name: 'color',
        'aria-label': 'Favorite color',
        orientation: undefined,
      });
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-orientation');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction
  describe('APG Keyboard Interaction', () => {
    it('focuses selected radio on Tab when one is selected', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });
      const before = makeButton('Before', 'before', screen.getByRole('radiogroup'));

      await user.tab();
      expect(before).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus();
    });

    it('focuses first radio on Tab when none is selected', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      makeButton('Before', 'before', screen.getByRole('radiogroup'));

      await user.tab();
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
    });

    it('exits group on Tab from focused radio', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      const after = makeButton('After', 'after', screen.getByRole('radiogroup'));

      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.tab();
      expect(after).toHaveFocus();
    });

    it('exits group on Shift+Tab from focused radio', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      const before = makeButton('Before', 'before', screen.getByRole('radiogroup'));

      await user.tab();
      expect(before).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(before).toHaveFocus();
    });

    it('selects focused radio on Space', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.keyboard(' ');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('does not unselect radio on Space when already selected', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'red',
        },
      });

      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.keyboard(' ');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to next radio and selects on ArrowDown', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to next radio and selects on ArrowRight', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to previous radio and selects on ArrowUp', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });

      await user.tab();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to previous radio and selects on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });

      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to first radio and selects on Home', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'green',
        },
      });

      await user.tab();
      await user.keyboard('{Home}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to last radio and selects on End', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      await user.keyboard('{End}');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('wraps from last to first on ArrowDown', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'green',
        },
      });

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('wraps from first to last on ArrowUp', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowDown', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: optionsWithDisabled, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowUp', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: optionsWithDisabled,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'green',
        },
      });

      await user.tab();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: optionsWithDisabled,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'green',
        },
      });

      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowRight', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: optionsWithDisabled, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('does not select disabled radio on Space', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: optionsWithDisabled, name: 'color', 'aria-label': 'Favorite color' },
      });

      const blueRadio = screen.getByRole('radio', { name: 'Blue' });
      blueRadio.focus();
      await user.keyboard(' ');
      expect(blueRadio).toHaveAttribute('aria-checked', 'false');
    });

    it('does not select disabled radio on click', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: optionsWithDisabled, name: 'color', 'aria-label': 'Favorite color' },
      });

      const blueRadio = screen.getByRole('radio', { name: 'Blue' });
      await user.click(blueRadio);
      expect(blueRadio).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 🔴 High Priority: Focus Management (Roving Tabindex)
  describe('Focus Management (Roving Tabindex)', () => {
    it('sets tabindex="0" on selected radio', () => {
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabindex', '0');
    });

    it('sets tabindex="-1" on non-selected radios', () => {
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabindex', '-1');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('tabindex', '-1');
    });

    it('sets tabindex="-1" on disabled radios', () => {
      render(RadioGroup, {
        props: { options: optionsWithDisabled, name: 'color', 'aria-label': 'Favorite color' },
      });
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabindex', '-1');
    });

    it('sets tabindex="0" on first enabled radio when none selected', () => {
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabindex', '0');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabindex', '-1');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('tabindex', '-1');
    });

    it('sets tabindex="0" on first non-disabled radio when first is disabled', () => {
      const options = [
        { id: 'red', label: 'Red', value: 'red', disabled: true },
        { id: 'blue', label: 'Blue', value: 'blue' },
        { id: 'green', label: 'Green', value: 'green' },
      ];
      render(RadioGroup, { props: { options, name: 'color', 'aria-label': 'Favorite color' } });
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabindex', '-1');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabindex', '0');
    });

    it('has only one tabindex="0" in the group', () => {
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });
      const radios = screen.getAllByRole('radio');
      const tabbableRadios = radios.filter((radio) => radio.getAttribute('tabindex') === '0');
      expect(tabbableRadios).toHaveLength(1);
    });
  });

  // 🔴 High Priority: Selection Behavior
  describe('Selection Behavior', () => {
    it('selects radio on click', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('deselects previous radio when clicking another', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'red',
        },
      });

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('updates aria-checked on keyboard selection', async () => {
      const user = userEvent.setup();
      render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 🟡 Medium Priority: Form Integration
  describe('Form Integration', () => {
    it('has hidden input for form submission', () => {
      const { container } = render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      const hiddenInput = container.querySelector('input[type="hidden"][name="color"]');
      expect(hiddenInput).toBeInTheDocument();
    });

    it('hidden input has correct name attribute', () => {
      const { container } = render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      const hiddenInput = container.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute('name', 'color');
    });

    it('hidden input value reflects selected value', async () => {
      const user = userEvent.setup();
      const { container } = render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('');

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(hiddenInput.value).toBe('blue');
    });

    it('hidden input has defaultValue on initial render', () => {
      const { container } = render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'green',
        },
      });
      const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('green');
    });

    it('hidden input value updates on keyboard selection', async () => {
      const user = userEvent.setup();
      const { container } = render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });

      const hiddenInput = container.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('');

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(hiddenInput.value).toBe('blue');

      await user.keyboard('{ArrowDown}');
      expect(hiddenInput.value).toBe('green');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(RadioGroup, {
        props: { options: defaultOptions, name: 'color', 'aria-label': 'Favorite color' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with selected value', async () => {
      const { container } = render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'blue',
        },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with disabled option', async () => {
      const { container } = render(RadioGroup, {
        props: { options: optionsWithDisabled, name: 'color', 'aria-label': 'Favorite color' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with horizontal orientation', async () => {
      const { container } = render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          orientation: 'horizontal',
        },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('calls onValueChange when selection changes', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          onValueChange: handleValueChange,
        },
      });

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(handleValueChange).toHaveBeenCalledWith('blue');
    });

    it('applies className to container', () => {
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          class: 'custom-class',
        },
      });
      expect(screen.getByRole('radiogroup')).toHaveClass('custom-class');
    });

    it('renders with defaultValue', () => {
      render(RadioGroup, {
        props: {
          options: defaultOptions,
          name: 'color',
          'aria-label': 'Favorite color',
          defaultValue: 'green',
        },
      });
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });
  });
});
