import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';

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

describe('RadioGroup', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="radiogroup" on container', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('has role="radio" on each option', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      const radios = screen.getAllByRole('radio');
      expect(radios).toHaveLength(3);
    });

    it('has aria-checked attribute on radios', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      const radios = screen.getAllByRole('radio');
      radios.forEach((radio) => {
        expect(radio).toHaveAttribute('aria-checked');
      });
    });

    it('sets aria-checked="true" on selected radio', () => {
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="blue"
        />
      );
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'false');
    });

    it('sets accessible name on radiogroup via aria-label', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radiogroup', { name: 'Favorite color' })).toBeInTheDocument();
    });

    it('sets accessible name on radiogroup via aria-labelledby', () => {
      render(
        <>
          <span id="color-label">Choose a color</span>
          <RadioGroup options={defaultOptions} name="color" aria-labelledby="color-label" />
        </>
      );
      expect(screen.getByRole('radiogroup', { name: 'Choose a color' })).toBeInTheDocument();
    });

    it('sets accessible name on each radio', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radio', { name: 'Red' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Blue' })).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: 'Green' })).toBeInTheDocument();
    });

    it('sets aria-disabled="true" on disabled radio', () => {
      render(<RadioGroup options={optionsWithDisabled} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets aria-orientation="horizontal" only when orientation is horizontal', () => {
      const { rerender } = render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          orientation="horizontal"
        />
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-orientation', 'horizontal');

      rerender(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          orientation="vertical"
        />
      );
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-orientation');

      rerender(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radiogroup')).not.toHaveAttribute('aria-orientation');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction
  describe('APG Keyboard Interaction', () => {
    it('focuses selected radio on Tab when one is selected', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <RadioGroup
            options={defaultOptions}
            name="color"
            aria-label="Favorite color"
            defaultValue="blue"
          />
        </>
      );

      await user.tab();
      expect(screen.getByText('Before')).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus();
    });

    it('focuses first radio on Tab when none is selected', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />
        </>
      );

      await user.tab();
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
    });

    it('exits group on Tab from focused radio', async () => {
      const user = userEvent.setup();
      render(
        <>
          <RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />
          <button>After</button>
        </>
      );

      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.tab();
      expect(screen.getByText('After')).toHaveFocus();
    });

    it('exits group on Shift+Tab from focused radio', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />
        </>
      );

      await user.tab();
      expect(screen.getByText('Before')).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByText('Before')).toHaveFocus();
    });

    it('selects focused radio on Space', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.keyboard(' ');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('does not unselect radio on Space when already selected', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="red"
        />
      );

      await user.tab();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      await user.keyboard(' ');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to next radio and selects on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to next radio and selects on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      await user.tab();
      await user.keyboard('{ArrowRight}');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to previous radio and selects on ArrowUp', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="blue"
        />
      );

      await user.tab();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to previous radio and selects on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="blue"
        />
      );

      await user.tab();
      await user.keyboard('{ArrowLeft}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to first radio and selects on Home', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="green"
        />
      );

      await user.tab();
      await user.keyboard('{Home}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('moves to last radio and selects on End', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      await user.tab();
      await user.keyboard('{End}');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('wraps from last to first on ArrowDown', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="green"
        />
      );

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('wraps from first to last on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      await user.tab();
      await user.keyboard('{ArrowUp}');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={optionsWithDisabled} name="color" aria-label="Favorite color" />);

      await user.tab();
      await user.keyboard('{ArrowDown}');
      // Should skip Blue (disabled) and go to Green
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowUp', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={optionsWithDisabled}
          name="color"
          aria-label="Favorite color"
          defaultValue="green"
        />
      );

      await user.tab();
      await user.keyboard('{ArrowUp}');
      // Should skip Blue (disabled) and go to Red
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={optionsWithDisabled}
          name="color"
          aria-label="Favorite color"
          defaultValue="green"
        />
      );

      await user.tab();
      await user.keyboard('{ArrowLeft}');
      // Should skip Blue (disabled) and go to Red
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'true');
    });

    it('skips disabled radio on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={optionsWithDisabled} name="color" aria-label="Favorite color" />);

      await user.tab();
      await user.keyboard('{ArrowRight}');
      // Should skip Blue (disabled) and go to Green
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveFocus();
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });

    it('does not select disabled radio on Space', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={optionsWithDisabled} name="color" aria-label="Favorite color" />);

      const blueRadio = screen.getByRole('radio', { name: 'Blue' });
      blueRadio.focus();
      await user.keyboard(' ');
      expect(blueRadio).toHaveAttribute('aria-checked', 'false');
    });

    it('does not select disabled radio on click', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={optionsWithDisabled} name="color" aria-label="Favorite color" />);

      const blueRadio = screen.getByRole('radio', { name: 'Blue' });
      await user.click(blueRadio);
      expect(blueRadio).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 🔴 High Priority: Focus Management (Roving Tabindex)
  describe('Focus Management (Roving Tabindex)', () => {
    it('sets tabindex="0" on selected radio', () => {
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="blue"
        />
      );
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabIndex', '0');
    });

    it('sets tabindex="-1" on non-selected radios', () => {
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="blue"
        />
      );
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabIndex', '-1');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('tabIndex', '-1');
    });

    it('sets tabindex="-1" on disabled radios', () => {
      render(<RadioGroup options={optionsWithDisabled} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabIndex', '-1');
    });

    it('sets tabindex="0" on first enabled radio when none selected', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabIndex', '0');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabIndex', '-1');
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('tabIndex', '-1');
    });

    it('sets tabindex="0" on first non-disabled radio when first is disabled', () => {
      const options = [
        { id: 'red', label: 'Red', value: 'red', disabled: true },
        { id: 'blue', label: 'Blue', value: 'blue' },
        { id: 'green', label: 'Green', value: 'green' },
      ];
      render(<RadioGroup options={options} name="color" aria-label="Favorite color" />);
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('tabIndex', '-1');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('tabIndex', '0');
    });

    it('has only one tabindex="0" in the group', () => {
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="blue"
        />
      );
      const radios = screen.getAllByRole('radio');
      const tabbableRadios = radios.filter((radio) => radio.getAttribute('tabIndex') === '0');
      expect(tabbableRadios).toHaveLength(1);
    });
  });

  // 🔴 High Priority: Selection Behavior
  describe('Selection Behavior', () => {
    it('selects radio on click', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('deselects previous radio when clicking another', async () => {
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="red"
        />
      );

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'false');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
    });

    it('updates aria-checked on keyboard selection', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      await user.tab();
      await user.keyboard('{ArrowDown}');
      expect(screen.getByRole('radio', { name: 'Blue' })).toHaveAttribute('aria-checked', 'true');
      expect(screen.getByRole('radio', { name: 'Red' })).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 🟡 Medium Priority: Form Integration
  describe('Form Integration', () => {
    it('has hidden input for form submission', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      const hiddenInput = document.querySelector('input[type="hidden"][name="color"]');
      expect(hiddenInput).toBeInTheDocument();
    });

    it('hidden input has correct name attribute', () => {
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);
      const hiddenInput = document.querySelector('input[type="hidden"]');
      expect(hiddenInput).toHaveAttribute('name', 'color');
    });

    it('hidden input value reflects selected value', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('');

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(hiddenInput.value).toBe('blue');
    });

    it('hidden input has defaultValue on initial render', () => {
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="green"
        />
      );
      const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
      expect(hiddenInput.value).toBe('green');
    });

    it('hidden input value updates on keyboard selection', async () => {
      const user = userEvent.setup();
      render(<RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />);

      const hiddenInput = document.querySelector('input[type="hidden"]') as HTMLInputElement;
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
      const { container } = render(
        <RadioGroup options={defaultOptions} name="color" aria-label="Favorite color" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with selected value', async () => {
      const { container } = render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="blue"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with disabled option', async () => {
      const { container } = render(
        <RadioGroup options={optionsWithDisabled} name="color" aria-label="Favorite color" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with horizontal orientation', async () => {
      const { container } = render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          orientation="horizontal"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Behavior
  describe('Props & Behavior', () => {
    it('calls onValueChange when selection changes', async () => {
      const handleValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          onValueChange={handleValueChange}
        />
      );

      await user.click(screen.getByRole('radio', { name: 'Blue' }));
      expect(handleValueChange).toHaveBeenCalledWith('blue');
    });

    it('applies className to container', () => {
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          className="custom-class"
        />
      );
      expect(screen.getByRole('radiogroup')).toHaveClass('custom-class');
    });

    it('renders with defaultValue', () => {
      render(
        <RadioGroup
          options={defaultOptions}
          name="color"
          aria-label="Favorite color"
          defaultValue="green"
        />
      );
      expect(screen.getByRole('radio', { name: 'Green' })).toHaveAttribute('aria-checked', 'true');
    });
  });
});
