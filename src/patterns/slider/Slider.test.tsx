import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';

describe('Slider', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="slider"', () => {
      render(<Slider aria-label="Volume" />);
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('has aria-valuenow set to current value', () => {
      render(<Slider defaultValue={50} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('has aria-valuenow set to min when no defaultValue', () => {
      render(<Slider min={10} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '10');
    });

    it('has aria-valuemin set (default: 0)', () => {
      render(<Slider aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
    });

    it('has aria-valuemax set (default: 100)', () => {
      render(<Slider aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('has custom aria-valuemin when provided', () => {
      render(<Slider defaultValue={50} min={10} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '10');
    });

    it('has custom aria-valuemax when provided', () => {
      render(<Slider defaultValue={50} max={200} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemax', '200');
    });

    it('has aria-valuetext when valueText provided', () => {
      render(<Slider defaultValue={75} valueText="75 percent" aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuetext', '75 percent');
    });

    it('does not have aria-valuetext when not provided', () => {
      render(<Slider defaultValue={75} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('aria-valuetext');
    });

    it('uses format for aria-valuetext', () => {
      render(<Slider defaultValue={75} format="{value}%" aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuetext', '75%');
    });

    it('updates aria-valuetext on value change', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} format="{value}%" aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuetext', '51%');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(<Slider disabled aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(<Slider aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('aria-disabled');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(<Slider aria-label="Volume" />);
      expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <>
          <span id="slider-label">Brightness</span>
          <Slider aria-labelledby="slider-label" />
        </>
      );
      expect(screen.getByRole('slider', { name: 'Brightness' })).toBeInTheDocument();
    });

    it('has accessible name via visible label', () => {
      render(<Slider label="Zoom Level" />);
      expect(screen.getByRole('slider', { name: 'Zoom Level' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('Keyboard Interaction', () => {
    it('increases value by step on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={1} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '51');
    });

    it('decreases value by step on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={1} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowLeft}');

      expect(slider).toHaveAttribute('aria-valuenow', '49');
    });

    it('increases value by step on ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={1} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowUp}');

      expect(slider).toHaveAttribute('aria-valuenow', '51');
    });

    it('decreases value by step on ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={1} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowDown}');

      expect(slider).toHaveAttribute('aria-valuenow', '49');
    });

    it('sets min value on Home', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} min={0} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{Home}');

      expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    it('sets max value on End', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} max={100} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{End}');

      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('increases value by large step on PageUp', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={1} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{PageUp}');

      expect(slider).toHaveAttribute('aria-valuenow', '60'); // default largeStep = step * 10
    });

    it('decreases value by large step on PageDown', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={1} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{PageDown}');

      expect(slider).toHaveAttribute('aria-valuenow', '40');
    });

    it('uses custom largeStep when provided', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={1} largeStep={20} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{PageUp}');

      expect(slider).toHaveAttribute('aria-valuenow', '70');
    });

    it('respects custom step value', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} step={5} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '55');
    });

    it('does not exceed max on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={100} max={100} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('does not go below min on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={0} min={0} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowLeft}');

      expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    it('does not change value when disabled', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} disabled aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on thumb', () => {
      render(<Slider aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex="-1" when disabled', () => {
      render(<Slider disabled aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabindex', '-1');
    });

    it('is focusable via Tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Slider aria-label="Volume" />
          <button>After</button>
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus slider

      expect(screen.getByRole('slider')).toHaveFocus();
    });

    it('is not focusable via Tab when disabled', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Slider disabled aria-label="Volume" />
          <button>After</button>
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus "After" button (skip slider)

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Orientation
  describe('Orientation', () => {
    it('does not have aria-orientation for horizontal slider', () => {
      render(<Slider orientation="horizontal" aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('aria-orientation');
    });

    it('has aria-orientation="vertical" for vertical slider', () => {
      render(<Slider orientation="vertical" aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('keyboard works correctly for vertical slider', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={50} orientation="vertical" aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowUp}');

      expect(slider).toHaveAttribute('aria-valuenow', '51');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Slider aria-label="Volume" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with visible label', async () => {
      const { container } = render(<Slider label="Volume" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">Volume</span>
          <Slider aria-labelledby="label" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(<Slider disabled aria-label="Volume" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with valueText', async () => {
      const { container } = render(
        <Slider defaultValue={50} valueText="50%" aria-label="Volume" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations at boundary values', async () => {
      const { container } = render(<Slider defaultValue={0} aria-label="Volume" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for vertical slider', async () => {
      const { container } = render(<Slider orientation="vertical" aria-label="Volume" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Callbacks
  describe('Callbacks', () => {
    it('calls onValueChange on keyboard interaction', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Slider defaultValue={50} onValueChange={handleChange} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(handleChange).toHaveBeenCalledWith(51);
    });

    it('calls onValueChange with correct value on Home', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(<Slider defaultValue={50} min={0} onValueChange={handleChange} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{Home}');

      expect(handleChange).toHaveBeenCalledWith(0);
    });

    it('does not call onValueChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Slider defaultValue={50} disabled onValueChange={handleChange} aria-label="Volume" />
      );
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onValueChange when value does not change', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Slider defaultValue={100} max={100} onValueChange={handleChange} aria-label="Volume" />
      );
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal step values correctly', async () => {
      const user = userEvent.setup();
      render(<Slider defaultValue={0.5} min={0} max={1} step={0.1} aria-label="Volume" />);
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '0.6');
    });

    it('handles negative min/max range', () => {
      render(<Slider defaultValue={0} min={-50} max={50} aria-label="Temperature" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '0');
      expect(slider).toHaveAttribute('aria-valuemin', '-50');
      expect(slider).toHaveAttribute('aria-valuemax', '50');
    });

    it('clamps defaultValue to min', () => {
      render(<Slider defaultValue={-10} min={0} max={100} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    it('clamps defaultValue to max', () => {
      render(<Slider defaultValue={150} min={0} max={100} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('rounds value to step', () => {
      render(<Slider defaultValue={53} min={0} max={100} step={5} aria-label="Volume" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '55');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows value when showValue is true (default)', () => {
      render(<Slider defaultValue={75} aria-label="Volume" />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('hides value when showValue is false', () => {
      render(<Slider defaultValue={75} aria-label="Volume" showValue={false} />);
      expect(screen.queryByText('75')).not.toBeInTheDocument();
    });

    it('displays formatted value when format provided', () => {
      render(<Slider defaultValue={75} format="{value}%" aria-label="Volume" />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('displays visible label when label provided', () => {
      render(<Slider label="Volume" />);
      expect(screen.getByText('Volume')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      render(<Slider aria-label="Volume" className="custom-slider" />);
      const container = screen.getByRole('slider').closest('.apg-slider');
      expect(container).toHaveClass('custom-slider');
    });

    it('sets id attribute on slider element', () => {
      render(<Slider aria-label="Volume" id="my-slider" />);
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('id', 'my-slider');
    });

    it('passes through data-* attributes', () => {
      render(<Slider aria-label="Volume" data-testid="custom-slider" />);
      expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Slider aria-label="Volume" aria-describedby="desc" />
          <p id="desc">Adjust the volume level</p>
        </>
      );
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-describedby', 'desc');
    });
  });
});
