import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { MultiThumbSlider } from './MultiThumbSlider';

describe('MultiThumbSlider', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has two elements with role="slider"', () => {
      render(<MultiThumbSlider aria-label={['Minimum', 'Maximum']} />);
      const sliders = screen.getAllByRole('slider');
      expect(sliders).toHaveLength(2);
    });

    it('has aria-valuenow set on each thumb', () => {
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Minimum', 'Maximum']} />);
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '80');
    });

    it('has correct static aria-valuemin/max on lower thumb', () => {
      render(
        <MultiThumbSlider defaultValue={[20, 80]} min={0} max={100} aria-label={['Min', 'Max']} />
      );
      const [lowerThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuemin', '0'); // absolute min
      expect(lowerThumb).toHaveAttribute('aria-valuemax', '80'); // upper thumb value
    });

    it('has correct dynamic aria-valuemin/max on upper thumb', () => {
      render(
        <MultiThumbSlider defaultValue={[20, 80]} min={0} max={100} aria-label={['Min', 'Max']} />
      );
      const [, upperThumb] = screen.getAllByRole('slider');
      expect(upperThumb).toHaveAttribute('aria-valuemin', '20'); // lower thumb value
      expect(upperThumb).toHaveAttribute('aria-valuemax', '100'); // absolute max
    });

    it('updates upper thumb aria-valuemin when lower thumb moves', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Minimum', 'Maximum']} />);
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
      expect(upperThumb).toHaveAttribute('aria-valuemin', '21');
    });

    it('updates lower thumb aria-valuemax when upper thumb moves', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Minimum', 'Maximum']} />);
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '79');
      expect(lowerThumb).toHaveAttribute('aria-valuemax', '79');
    });

    it('applies minDistance to dynamic bounds', () => {
      render(
        <MultiThumbSlider
          defaultValue={[20, 80]}
          minDistance={10}
          aria-label={['Minimum', 'Maximum']}
        />
      );
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      // Lower thumb max = 80 - 10 = 70
      expect(lowerThumb).toHaveAttribute('aria-valuemax', '70');
      // Upper thumb min = 20 + 10 = 30
      expect(upperThumb).toHaveAttribute('aria-valuemin', '30');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(<MultiThumbSlider disabled aria-label={['Minimum', 'Maximum']} />);
      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('does not have aria-disabled when not disabled', () => {
      render(<MultiThumbSlider aria-label={['Minimum', 'Maximum']} />);
      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).not.toHaveAttribute('aria-disabled');
      });
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label tuple', () => {
      render(<MultiThumbSlider aria-label={['Minimum Price', 'Maximum Price']} />);
      expect(screen.getByRole('slider', { name: 'Minimum Price' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: 'Maximum Price' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby tuple', () => {
      render(
        <>
          <span id="min-label">Min Value</span>
          <span id="max-label">Max Value</span>
          <MultiThumbSlider aria-labelledby={['min-label', 'max-label']} />
        </>
      );
      expect(screen.getByRole('slider', { name: 'Min Value' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: 'Max Value' })).toBeInTheDocument();
    });

    it('has accessible name via getAriaLabel function', () => {
      render(<MultiThumbSlider getAriaLabel={(index) => (index === 0 ? 'Start' : 'End')} />);
      expect(screen.getByRole('slider', { name: 'Start' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: 'End' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('Keyboard Interaction', () => {
    it('ArrowRight increases lower thumb value', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
    });

    it('ArrowRight increases upper thumb value', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowRight}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '81');
    });

    it('ArrowLeft decreases lower thumb value', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowLeft}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '19');
    });

    it('ArrowLeft decreases upper thumb value', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '79');
    });

    it('lower thumb cannot exceed upper thumb with ArrowRight', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[79, 80]} aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowRight}'); // Try to exceed

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '80');
    });

    it('upper thumb cannot go below lower thumb with ArrowLeft', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 21]} aria-label={['Min', 'Max']} />);
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');
      await user.keyboard('{ArrowLeft}'); // Try to go below

      expect(upperThumb).toHaveAttribute('aria-valuenow', '20');
    });

    it('minDistance prevents collision on keyboard', async () => {
      const user = userEvent.setup();
      render(
        <MultiThumbSlider defaultValue={[45, 55]} minDistance={10} aria-label={['Min', 'Max']} />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      // Try to increase beyond allowed (55 - 10 = 45, already at max)
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '45');
    });

    it('Home on lower thumb goes to absolute min', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[30, 70]} min={0} aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{Home}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0');
    });

    it('Home on upper thumb goes to lower thumb value (dynamic min)', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[30, 70]} min={0} aria-label={['Min', 'Max']} />);
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{Home}');

      // Should go to lower thumb value (30), not absolute min (0)
      expect(upperThumb).toHaveAttribute('aria-valuenow', '30');
    });

    it('End on lower thumb goes to upper thumb value (dynamic max)', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[30, 70]} max={100} aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{End}');

      // Should go to upper thumb value (70), not absolute max (100)
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '70');
    });

    it('End on upper thumb goes to absolute max', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[30, 70]} max={100} aria-label={['Min', 'Max']} />);
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{End}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '100');
    });

    it('Home/End respects minDistance', async () => {
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[30, 70]}
          minDistance={10}
          min={0}
          max={100}
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

      // Lower thumb End should stop at 70 - 10 = 60
      await user.click(lowerThumb);
      await user.keyboard('{End}');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '60');

      // Upper thumb Home should stop at 60 + 10 = 70 (lower moved to 60)
      await user.click(upperThumb);
      await user.keyboard('{Home}');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '70');
    });

    it('PageUp increases value by largeStep', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{PageUp}');

      // Default largeStep = step * 10 = 10
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '30');
    });

    it('PageDown decreases value by largeStep', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{PageDown}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '70');
    });

    it('PageUp respects thumb constraints', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[75, 80]} aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{PageUp}'); // Would be 85, but max is 80

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '80');
    });

    it('does not change value when disabled', async () => {
      const user = userEvent.setup();
      render(<MultiThumbSlider defaultValue={[20, 80]} disabled aria-label={['Min', 'Max']} />);
      const [lowerThumb] = screen.getAllByRole('slider');

      lowerThumb.focus();
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('both thumbs have tabindex="0"', () => {
      render(<MultiThumbSlider aria-label={['Min', 'Max']} />);
      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('tabindex', '0');
      });
    });

    it('Tab moves to lower thumb first', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <MultiThumbSlider aria-label={['Min', 'Max']} />
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus lower thumb

      const [lowerThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveFocus();
    });

    it('Tab moves from lower to upper thumb', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <MultiThumbSlider aria-label={['Min', 'Max']} />
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus lower thumb
      await user.tab(); // Focus upper thumb

      const [, upperThumb] = screen.getAllByRole('slider');
      expect(upperThumb).toHaveFocus();
    });

    it('Tab order is constant regardless of thumb positions', async () => {
      const user = userEvent.setup();
      // Even if lower thumb has higher value visually, tab order follows DOM
      render(
        <>
          <button>Before</button>
          <MultiThumbSlider defaultValue={[80, 90]} aria-label={['Min', 'Max']} />
        </>
      );

      await user.tab();
      await user.tab();

      const [lowerThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveFocus();
    });

    it('thumbs have tabindex="-1" when disabled', () => {
      render(<MultiThumbSlider disabled aria-label={['Min', 'Max']} />);
      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('tabindex', '-1');
      });
    });

    it('is not focusable via Tab when disabled', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <MultiThumbSlider disabled aria-label={['Min', 'Max']} />
          <button>After</button>
        </>
      );

      await user.tab(); // Focus "Before"
      await user.tab(); // Skip slider, focus "After"

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Orientation
  describe('Orientation', () => {
    it('does not have aria-orientation for horizontal slider', () => {
      render(<MultiThumbSlider orientation="horizontal" aria-label={['Min', 'Max']} />);
      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).not.toHaveAttribute('aria-orientation');
      });
    });

    it('has aria-orientation="vertical" for vertical slider', () => {
      render(<MultiThumbSlider orientation="vertical" aria-label={['Min', 'Max']} />);
      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('aria-orientation', 'vertical');
      });
    });

    it('ArrowUp increases value in vertical mode', async () => {
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[20, 80]}
          orientation="vertical"
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowUp}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
    });

    it('ArrowDown decreases value in vertical mode', async () => {
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[20, 80]}
          orientation="vertical"
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowDown}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '19');
    });
  });

  // 🔴 High Priority: Value Text
  describe('Value Text', () => {
    it('sets aria-valuetext with format', () => {
      render(
        <MultiThumbSlider defaultValue={[20, 80]} format="${value}" aria-label={['Min', 'Max']} />
      );
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuetext', '$20');
      expect(upperThumb).toHaveAttribute('aria-valuetext', '$80');
    });

    it('sets aria-valuetext with getAriaValueText', () => {
      render(
        <MultiThumbSlider
          defaultValue={[20, 80]}
          getAriaValueText={(value, index) => `${index === 0 ? 'From' : 'To'} ${value}%`}
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuetext', 'From 20%');
      expect(upperThumb).toHaveAttribute('aria-valuetext', 'To 80%');
    });

    it('updates aria-valuetext on value change', async () => {
      const user = userEvent.setup();
      render(
        <MultiThumbSlider defaultValue={[20, 80]} format="${value}" aria-label={['Min', 'Max']} />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuetext', '$21');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<MultiThumbSlider aria-label={['Minimum', 'Maximum']} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="min">Min</span>
          <span id="max">Max</span>
          <MultiThumbSlider aria-labelledby={['min', 'max']} />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(
        <MultiThumbSlider disabled aria-label={['Minimum', 'Maximum']} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with minDistance', async () => {
      const { container } = render(
        <MultiThumbSlider defaultValue={[20, 80]} minDistance={10} aria-label={['Min', 'Max']} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for vertical slider', async () => {
      const { container } = render(
        <MultiThumbSlider orientation="vertical" aria-label={['Min', 'Max']} />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Callbacks
  describe('Callbacks', () => {
    it('calls onValueChange with values array and activeIndex', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[20, 80]}
          onValueChange={handleChange}
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(handleChange).toHaveBeenCalledWith([21, 80], 0);
    });

    it('calls onValueChange with correct index for upper thumb', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[20, 80]}
          onValueChange={handleChange}
          aria-label={['Min', 'Max']}
        />
      );
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');

      expect(handleChange).toHaveBeenCalledWith([20, 79], 1);
    });

    it('does not call onValueChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[20, 80]}
          disabled
          onValueChange={handleChange}
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      lowerThumb.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onValueChange when value does not change', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[80, 80]}
          onValueChange={handleChange}
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}'); // Already at max (upper thumb value)

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal step values correctly', async () => {
      const user = userEvent.setup();
      render(
        <MultiThumbSlider
          defaultValue={[0.2, 0.8]}
          min={0}
          max={1}
          step={0.1}
          aria-label={['Min', 'Max']}
        />
      );
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0.3');
    });

    it('handles negative min/max range', () => {
      render(
        <MultiThumbSlider defaultValue={[-30, 30]} min={-50} max={50} aria-label={['Min', 'Max']} />
      );
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '-30');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '30');
      expect(lowerThumb).toHaveAttribute('aria-valuemin', '-50');
      expect(upperThumb).toHaveAttribute('aria-valuemax', '50');
    });

    it('normalizes invalid defaultValue (lower > upper)', () => {
      render(<MultiThumbSlider defaultValue={[80, 20]} aria-label={['Min', 'Max']} />);
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      // Should normalize: lower should be adjusted
      const lowerValue = Number(lowerThumb.getAttribute('aria-valuenow'));
      const upperValue = Number(upperThumb.getAttribute('aria-valuenow'));
      expect(lowerValue).toBeLessThanOrEqual(upperValue);
    });

    it('clamps defaultValue to min/max', () => {
      render(
        <MultiThumbSlider defaultValue={[-10, 150]} min={0} max={100} aria-label={['Min', 'Max']} />
      );
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '100');
    });

    it('rounds values to step', () => {
      render(<MultiThumbSlider defaultValue={[23, 77]} step={5} aria-label={['Min', 'Max']} />);
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '25');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '75');
    });

    it('uses default values when not provided', () => {
      render(<MultiThumbSlider aria-label={['Min', 'Max']} />);
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      // Default: [min, max] = [0, 100]
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '100');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows values when showValues is true (default)', () => {
      render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('hides values when showValues is false', () => {
      render(
        <MultiThumbSlider defaultValue={[20, 80]} showValues={false} aria-label={['Min', 'Max']} />
      );
      expect(screen.queryByText('20')).not.toBeInTheDocument();
      expect(screen.queryByText('80')).not.toBeInTheDocument();
    });

    it('displays formatted values when format provided', () => {
      render(
        <MultiThumbSlider defaultValue={[20, 80]} format="${value}" aria-label={['Min', 'Max']} />
      );
      expect(screen.getByText('$20')).toBeInTheDocument();
      expect(screen.getByText('$80')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      render(<MultiThumbSlider aria-label={['Min', 'Max']} className="custom-slider" />);
      const container = screen.getAllByRole('slider')[0].closest('.apg-slider-multithumb');
      expect(container).toHaveClass('custom-slider');
    });

    it('sets id attribute on container', () => {
      render(<MultiThumbSlider aria-label={['Min', 'Max']} id="my-slider" />);
      const container = screen.getAllByRole('slider')[0].closest('.apg-slider-multithumb');
      expect(container).toHaveAttribute('id', 'my-slider');
    });

    it('passes through data-testid', () => {
      render(<MultiThumbSlider aria-label={['Min', 'Max']} data-testid="custom-slider" />);
      expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
    });

    it('supports aria-describedby as string', () => {
      render(
        <>
          <MultiThumbSlider aria-label={['Min', 'Max']} aria-describedby="desc" />
          <p id="desc">Select a range</p>
        </>
      );
      const sliders = screen.getAllByRole('slider');
      sliders.forEach((slider) => {
        expect(slider).toHaveAttribute('aria-describedby', 'desc');
      });
    });

    it('supports aria-describedby as tuple', () => {
      render(
        <>
          <MultiThumbSlider
            aria-label={['Min', 'Max']}
            aria-describedby={['min-desc', 'max-desc']}
          />
          <p id="min-desc">Minimum value</p>
          <p id="max-desc">Maximum value</p>
        </>
      );
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-describedby', 'min-desc');
      expect(upperThumb).toHaveAttribute('aria-describedby', 'max-desc');
    });
  });

  // 🟢 Low Priority: Group Labeling
  describe('Group Labeling', () => {
    it('has role="group" on container', () => {
      render(<MultiThumbSlider aria-label={['Min', 'Max']} label="Price Range" />);
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('group has accessible name via label prop', () => {
      render(<MultiThumbSlider aria-label={['Min', 'Max']} label="Price Range" />);
      expect(screen.getByRole('group', { name: 'Price Range' })).toBeInTheDocument();
    });
  });
});
