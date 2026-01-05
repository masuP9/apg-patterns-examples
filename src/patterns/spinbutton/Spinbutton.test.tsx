import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Spinbutton } from './Spinbutton';

describe('Spinbutton', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="spinbutton"', () => {
      render(<Spinbutton aria-label="Quantity" />);
      expect(screen.getByRole('spinbutton')).toBeInTheDocument();
    });

    it('has aria-valuenow set to current value', () => {
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
    });

    it('has aria-valuenow set to 0 when no defaultValue', () => {
      render(<Spinbutton aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
    });

    it('has aria-valuemin when min is defined', () => {
      render(<Spinbutton min={0} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuemin', '0');
    });

    it('does not have aria-valuemin when min is undefined', () => {
      render(<Spinbutton aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).not.toHaveAttribute('aria-valuemin');
    });

    it('has aria-valuemax when max is defined', () => {
      render(<Spinbutton max={100} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuemax', '100');
    });

    it('does not have aria-valuemax when max is undefined', () => {
      render(<Spinbutton aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).not.toHaveAttribute('aria-valuemax');
    });

    it('has aria-valuetext when valueText provided', () => {
      render(<Spinbutton defaultValue={5} valueText="5 items" aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuetext', '5 items');
    });

    it('does not have aria-valuetext when not provided', () => {
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).not.toHaveAttribute('aria-valuetext');
    });

    it('uses format for aria-valuetext', () => {
      render(<Spinbutton defaultValue={5} format="{value} items" aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuetext', '5 items');
    });

    it('updates aria-valuetext on value change', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} format="{value} items" aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuetext', '6 items');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(<Spinbutton disabled aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(<Spinbutton aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).not.toHaveAttribute('aria-disabled');
    });

    it('has aria-readonly="true" when readOnly', () => {
      render(<Spinbutton readOnly aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-readonly', 'true');
    });

    it('does not have aria-readonly when not readOnly', () => {
      render(<Spinbutton aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).not.toHaveAttribute('aria-readonly');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(<Spinbutton aria-label="Quantity" />);
      expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <>
          <span id="spinbutton-label">Item Count</span>
          <Spinbutton aria-labelledby="spinbutton-label" />
        </>
      );
      expect(screen.getByRole('spinbutton', { name: 'Item Count' })).toBeInTheDocument();
    });

    it('has accessible name via visible label', () => {
      render(<Spinbutton label="Quantity" />);
      expect(screen.getByRole('spinbutton', { name: 'Quantity' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('Keyboard Interaction', () => {
    it('increases value by step on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} step={1} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
    });

    it('decreases value by step on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} step={1} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowDown}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '4');
    });

    it('sets min value on Home when min is defined', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} min={0} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{Home}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
    });

    it('Home key has no effect when min is undefined', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{Home}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '50');
    });

    it('sets max value on End when max is defined', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} max={100} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{End}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
    });

    it('End key has no effect when max is undefined', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{End}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '50');
    });

    it('increases value by large step on PageUp', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} step={1} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{PageUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '60'); // default largeStep = step * 10
    });

    it('decreases value by large step on PageDown', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} step={1} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{PageDown}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '40');
    });

    it('uses custom largeStep when provided', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} step={1} largeStep={20} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{PageUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '70');
    });

    it('respects custom step value', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={50} step={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '55');
    });

    it('does not exceed max on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={100} max={100} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
    });

    it('does not go below min on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={0} min={0} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowDown}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
    });

    it('does not change value when disabled', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} disabled aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      spinbutton.focus();
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
    });

    it('does not change value on ArrowUp/Down when readOnly', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} readOnly aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on input', () => {
      render(<Spinbutton aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex="-1" when disabled', () => {
      render(<Spinbutton disabled aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('tabindex', '-1');
    });

    it('is focusable via Tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Spinbutton aria-label="Quantity" />
          <button>After</button>
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus spinbutton

      expect(screen.getByRole('spinbutton')).toHaveFocus();
    });

    it('is not focusable via Tab when disabled', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Spinbutton disabled aria-label="Quantity" />
          <button>After</button>
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus "After" button (skip spinbutton)

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('buttons have tabindex="-1"', () => {
      render(<Spinbutton aria-label="Quantity" showButtons />);
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('tabindex', '-1');
      });
    });

    it('focus stays on spinbutton after increment button click', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      const incrementButton = screen.getByLabelText(/increment/i);

      await user.click(spinbutton);
      await user.click(incrementButton);

      expect(spinbutton).toHaveFocus();
    });

    it('focus stays on spinbutton after decrement button click', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      const decrementButton = screen.getByLabelText(/decrement/i);

      await user.click(spinbutton);
      await user.click(decrementButton);

      expect(spinbutton).toHaveFocus();
    });
  });

  // 🟡 Medium Priority: Button Interaction
  describe('Button Interaction', () => {
    it('increases value on increment button click', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      const incrementButton = screen.getByLabelText(/increment/i);

      await user.click(incrementButton);

      expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
    });

    it('decreases value on decrement button click', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      const decrementButton = screen.getByLabelText(/decrement/i);

      await user.click(decrementButton);

      expect(spinbutton).toHaveAttribute('aria-valuenow', '4');
    });

    it('increment button does not exceed max', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={100} max={100} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      const incrementButton = screen.getByLabelText(/increment/i);

      await user.click(incrementButton);

      expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
    });

    it('decrement button does not go below min', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={0} min={0} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      const decrementButton = screen.getByLabelText(/decrement/i);

      await user.click(decrementButton);

      expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
    });

    it('buttons are disabled when component is disabled', async () => {
      render(<Spinbutton defaultValue={5} disabled aria-label="Quantity" />);
      const incrementButton = screen.getByLabelText(/increment/i);
      const decrementButton = screen.getByLabelText(/decrement/i);

      expect(incrementButton).toBeDisabled();
      expect(decrementButton).toBeDisabled();
    });

    it('hides buttons when showButtons is false', () => {
      render(<Spinbutton aria-label="Quantity" showButtons={false} />);
      expect(screen.queryByLabelText(/increment/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/decrement/i)).not.toBeInTheDocument();
    });

    it('keyboard still works when showButtons is false', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} aria-label="Quantity" showButtons={false} />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '6');
    });
  });

  // 🟡 Medium Priority: Text Input
  describe('Text Input', () => {
    it('accepts direct text input', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.clear(spinbutton);
      await user.type(spinbutton, '42');
      await user.tab(); // blur to confirm

      expect(spinbutton).toHaveAttribute('aria-valuenow', '42');
    });

    it('reverts to previous value on invalid input', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.clear(spinbutton);
      await user.type(spinbutton, 'abc');
      await user.tab(); // blur to confirm

      expect(spinbutton).toHaveAttribute('aria-valuenow', '5');
    });

    it('clamps value to max on valid input exceeding max', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} max={10} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.clear(spinbutton);
      await user.type(spinbutton, '999');
      await user.tab(); // blur to confirm

      expect(spinbutton).toHaveAttribute('aria-valuenow', '10');
    });

    it('clamps value to min on valid input below min', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} min={0} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.clear(spinbutton);
      await user.type(spinbutton, '-10');
      await user.tab(); // blur to confirm

      expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
    });

    it('does not allow text input when readOnly', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} readOnly aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.type(spinbutton, '42');

      expect(spinbutton).toHaveValue('5');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Spinbutton aria-label="Quantity" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with visible label', async () => {
      const { container } = render(<Spinbutton label="Quantity" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">Quantity</span>
          <Spinbutton aria-labelledby="label" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(<Spinbutton disabled aria-label="Quantity" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when readOnly', async () => {
      const { container } = render(<Spinbutton readOnly aria-label="Quantity" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with valueText', async () => {
      const { container } = render(
        <Spinbutton defaultValue={5} valueText="5 items" aria-label="Quantity" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Callbacks
  describe('Callbacks', () => {
    it('calls onValueChange on keyboard interaction', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} onValueChange={handleChange} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(handleChange).toHaveBeenCalledWith(6);
    });

    it('calls onValueChange on button click', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} onValueChange={handleChange} aria-label="Quantity" />);
      const incrementButton = screen.getByLabelText(/increment/i);

      await user.click(incrementButton);

      expect(handleChange).toHaveBeenCalledWith(6);
    });

    it('calls onValueChange on text input', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={5} onValueChange={handleChange} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.clear(spinbutton);
      await user.type(spinbutton, '42');
      await user.tab();

      expect(handleChange).toHaveBeenCalledWith(42);
    });

    it('does not call onValueChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Spinbutton defaultValue={5} disabled onValueChange={handleChange} aria-label="Quantity" />
      );
      const spinbutton = screen.getByRole('spinbutton');

      spinbutton.focus();
      await user.keyboard('{ArrowUp}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onValueChange when value does not change', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Spinbutton
          defaultValue={100}
          max={100}
          onValueChange={handleChange}
          aria-label="Quantity"
        />
      );
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal step values correctly', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={0.5} step={0.1} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '0.6');
    });

    it('handles negative values', () => {
      render(<Spinbutton defaultValue={-5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuenow', '-5');
    });

    it('handles negative min/max range', () => {
      render(<Spinbutton defaultValue={0} min={-50} max={50} aria-label="Temperature" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
      expect(spinbutton).toHaveAttribute('aria-valuemin', '-50');
      expect(spinbutton).toHaveAttribute('aria-valuemax', '50');
    });

    it('clamps defaultValue to max when exceeding', () => {
      render(<Spinbutton defaultValue={150} max={100} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuenow', '100');
    });

    it('clamps defaultValue to min when below', () => {
      render(<Spinbutton defaultValue={-10} min={0} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuenow', '0');
    });

    it('rounds value to step', () => {
      render(<Spinbutton defaultValue={53} step={5} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-valuenow', '55');
    });

    it('allows value beyond range when min/max undefined', async () => {
      const user = userEvent.setup();
      render(<Spinbutton defaultValue={1000} aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');

      await user.click(spinbutton);
      await user.keyboard('{ArrowUp}');

      expect(spinbutton).toHaveAttribute('aria-valuenow', '1001');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('displays visible label when label provided', () => {
      render(<Spinbutton label="Quantity" />);
      expect(screen.getByText('Quantity')).toBeInTheDocument();
    });

    it('has inputmode="numeric"', () => {
      render(<Spinbutton aria-label="Quantity" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('inputmode', 'numeric');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      render(<Spinbutton aria-label="Quantity" className="custom-spinbutton" />);
      const container = screen.getByRole('spinbutton').closest('.apg-spinbutton');
      expect(container).toHaveClass('custom-spinbutton');
    });

    it('sets id attribute on spinbutton element', () => {
      render(<Spinbutton aria-label="Quantity" id="my-spinbutton" />);
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('id', 'my-spinbutton');
    });

    it('passes through data-* attributes', () => {
      render(<Spinbutton aria-label="Quantity" data-testid="custom-spinbutton" />);
      expect(screen.getByTestId('custom-spinbutton')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Spinbutton aria-label="Quantity" aria-describedby="desc" />
          <p id="desc">Enter the number of items</p>
        </>
      );
      const spinbutton = screen.getByRole('spinbutton');
      expect(spinbutton).toHaveAttribute('aria-describedby', 'desc');
    });
  });
});
