import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { h } from 'vue';
import MultiThumbSlider from './MultiThumbSlider.vue';

// Prop/event mapping vs React:
// - React `aria-label` / `aria-labelledby` / `aria-describedby` tuples -> Vue
//   `ariaLabel` / `ariaLabelledby` / `ariaDescribedby` props.
// - React `onValueChange` callback prop -> Vue `valueChange` emit (assert via onValueChange listener).
// - React `className` -> Vue `class` (passed through $attrs).
// No React-specific cases are skipped; all titles are ported 1:1.

describe('MultiThumbSlider (Vue)', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has two elements with role="slider"', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Minimum', 'Maximum'] } });
      expect(screen.getAllByRole('slider')).toHaveLength(2);
    });

    it('has aria-valuenow set on each thumb', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], ariaLabel: ['Minimum', 'Maximum'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '80');
    });

    it('has correct static aria-valuemin/max on lower thumb', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], min: 0, max: 100, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuemin', '0');
      expect(lowerThumb).toHaveAttribute('aria-valuemax', '80');
    });

    it('has correct dynamic aria-valuemin/max on upper thumb', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], min: 0, max: 100, ariaLabel: ['Min', 'Max'] },
      });
      const [, upperThumb] = screen.getAllByRole('slider');
      expect(upperThumb).toHaveAttribute('aria-valuemin', '20');
      expect(upperThumb).toHaveAttribute('aria-valuemax', '100');
    });

    it('updates upper thumb aria-valuemin when lower thumb moves', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], ariaLabel: ['Minimum', 'Maximum'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
      expect(upperThumb).toHaveAttribute('aria-valuemin', '21');
    });

    it('updates lower thumb aria-valuemax when upper thumb moves', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], ariaLabel: ['Minimum', 'Maximum'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '79');
      expect(lowerThumb).toHaveAttribute('aria-valuemax', '79');
    });

    it('applies minDistance to dynamic bounds', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], minDistance: 10, ariaLabel: ['Minimum', 'Maximum'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuemax', '70');
      expect(upperThumb).toHaveAttribute('aria-valuemin', '30');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(MultiThumbSlider, { props: { disabled: true, ariaLabel: ['Minimum', 'Maximum'] } });
      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('does not have aria-disabled when not disabled', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Minimum', 'Maximum'] } });
      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).not.toHaveAttribute('aria-disabled');
      });
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label tuple', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Minimum Price', 'Maximum Price'] } });
      expect(screen.getByRole('slider', { name: 'Minimum Price' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: 'Maximum Price' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby tuple', () => {
      render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [
              h('span', { id: 'min-label' }, 'Min Value'),
              h('span', { id: 'max-label' }, 'Max Value'),
              h(MultiThumbSlider, { ariaLabelledby: ['min-label', 'max-label'] }),
            ]);
        },
      });
      expect(screen.getByRole('slider', { name: 'Min Value' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: 'Max Value' })).toBeInTheDocument();
    });

    it('has accessible name via getAriaLabel function', () => {
      render(MultiThumbSlider, {
        props: { getAriaLabel: (index: number) => (index === 0 ? 'Start' : 'End') },
      });
      expect(screen.getByRole('slider', { name: 'Start' })).toBeInTheDocument();
      expect(screen.getByRole('slider', { name: 'End' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('Keyboard Interaction', () => {
    it('ArrowRight increases lower thumb value', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [20, 80], ariaLabel: ['Min', 'Max'] } });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
    });

    it('ArrowRight increases upper thumb value', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [20, 80], ariaLabel: ['Min', 'Max'] } });
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowRight}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '81');
    });

    it('ArrowLeft decreases lower thumb value', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [20, 80], ariaLabel: ['Min', 'Max'] } });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowLeft}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '19');
    });

    it('ArrowLeft decreases upper thumb value', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [20, 80], ariaLabel: ['Min', 'Max'] } });
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '79');
    });

    it('lower thumb cannot exceed upper thumb with ArrowRight', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [79, 80], ariaLabel: ['Min', 'Max'] } });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '80');
    });

    it('upper thumb cannot go below lower thumb with ArrowLeft', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [20, 21], ariaLabel: ['Min', 'Max'] } });
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');
      await user.keyboard('{ArrowLeft}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '20');
    });

    it('minDistance prevents collision on keyboard', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [45, 55], minDistance: 10, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '45');
    });

    it('Home on lower thumb goes to absolute min', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [30, 70], min: 0, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{Home}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0');
    });

    it('Home on upper thumb goes to lower thumb value (dynamic min)', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [30, 70], min: 0, ariaLabel: ['Min', 'Max'] },
      });
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{Home}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '30');
    });

    it('End on lower thumb goes to upper thumb value (dynamic max)', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [30, 70], max: 100, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{End}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '70');
    });

    it('End on upper thumb goes to absolute max', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [30, 70], max: 100, ariaLabel: ['Min', 'Max'] },
      });
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{End}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '100');
    });

    it('Home/End respects minDistance', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: {
          defaultValue: [30, 70],
          minDistance: 10,
          min: 0,
          max: 100,
          ariaLabel: ['Min', 'Max'],
        },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{End}');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '60');

      await user.click(upperThumb);
      await user.keyboard('{Home}');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '70');
    });

    it('PageUp increases value by largeStep', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [20, 80], ariaLabel: ['Min', 'Max'] } });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{PageUp}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '30');
    });

    it('PageDown decreases value by largeStep', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [20, 80], ariaLabel: ['Min', 'Max'] } });
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{PageDown}');

      expect(upperThumb).toHaveAttribute('aria-valuenow', '70');
    });

    it('PageUp respects thumb constraints', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, { props: { defaultValue: [75, 80], ariaLabel: ['Min', 'Max'] } });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{PageUp}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '80');
    });

    it('does not change value when disabled', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], disabled: true, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      lowerThumb.focus();
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('both thumbs have tabindex="0"', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Min', 'Max'] } });
      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).toHaveAttribute('tabindex', '0');
      });
    });

    it('Tab moves to lower thumb first', async () => {
      const user = userEvent.setup();
      render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [h('button', 'Before'), h(MultiThumbSlider, { ariaLabel: ['Min', 'Max'] })]);
        },
      });

      await user.tab();
      await user.tab();

      const [lowerThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveFocus();
    });

    it('Tab moves from lower to upper thumb', async () => {
      const user = userEvent.setup();
      render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [h('button', 'Before'), h(MultiThumbSlider, { ariaLabel: ['Min', 'Max'] })]);
        },
      });

      await user.tab();
      await user.tab();
      await user.tab();

      const [, upperThumb] = screen.getAllByRole('slider');
      expect(upperThumb).toHaveFocus();
    });

    it('Tab order is constant regardless of thumb positions', async () => {
      const user = userEvent.setup();
      render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [
              h('button', 'Before'),
              h(MultiThumbSlider, { defaultValue: [80, 90], ariaLabel: ['Min', 'Max'] }),
            ]);
        },
      });

      await user.tab();
      await user.tab();

      const [lowerThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveFocus();
    });

    it('thumbs have tabindex="-1" when disabled', () => {
      render(MultiThumbSlider, { props: { disabled: true, ariaLabel: ['Min', 'Max'] } });
      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).toHaveAttribute('tabindex', '-1');
      });
    });

    it('is not focusable via Tab when disabled', async () => {
      const user = userEvent.setup();
      render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [
              h('button', 'Before'),
              h(MultiThumbSlider, { disabled: true, ariaLabel: ['Min', 'Max'] }),
              h('button', 'After'),
            ]);
        },
      });

      await user.tab();
      await user.tab();

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Orientation
  describe('Orientation', () => {
    it('does not have aria-orientation for horizontal slider', () => {
      render(MultiThumbSlider, { props: { orientation: 'horizontal', ariaLabel: ['Min', 'Max'] } });
      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).not.toHaveAttribute('aria-orientation');
      });
    });

    it('has aria-orientation="vertical" for vertical slider', () => {
      render(MultiThumbSlider, { props: { orientation: 'vertical', ariaLabel: ['Min', 'Max'] } });
      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).toHaveAttribute('aria-orientation', 'vertical');
      });
    });

    it('ArrowUp increases value in vertical mode', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], orientation: 'vertical', ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowUp}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
    });

    it('ArrowDown decreases value in vertical mode', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], orientation: 'vertical', ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowDown}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '19');
    });
  });

  // 🔴 High Priority: Value Text
  describe('Value Text', () => {
    it('sets aria-valuetext with format', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], format: '${value}', ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuetext', '$20');
      expect(upperThumb).toHaveAttribute('aria-valuetext', '$80');
    });

    it('sets aria-valuetext with getAriaValueText', () => {
      render(MultiThumbSlider, {
        props: {
          defaultValue: [20, 80],
          getAriaValueText: (value: number, index: number) =>
            `${index === 0 ? 'From' : 'To'} ${value}%`,
          ariaLabel: ['Min', 'Max'],
        },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuetext', 'From 20%');
      expect(upperThumb).toHaveAttribute('aria-valuetext', 'To 80%');
    });

    it('updates aria-valuetext on value change', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], format: '${value}', ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuetext', '$21');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(MultiThumbSlider, {
        props: { ariaLabel: ['Minimum', 'Maximum'] },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [
              h('span', { id: 'min' }, 'Min'),
              h('span', { id: 'max' }, 'Max'),
              h(MultiThumbSlider, { ariaLabelledby: ['min', 'max'] }),
            ]);
        },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(MultiThumbSlider, {
        props: { disabled: true, ariaLabel: ['Minimum', 'Maximum'] },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with minDistance', async () => {
      const { container } = render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], minDistance: 10, ariaLabel: ['Min', 'Max'] },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for vertical slider', async () => {
      const { container } = render(MultiThumbSlider, {
        props: { orientation: 'vertical', ariaLabel: ['Min', 'Max'] },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Callbacks
  describe('Callbacks', () => {
    it('calls onValueChange with values array and activeIndex', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], onValueChange: handleChange, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(handleChange).toHaveBeenCalledWith([21, 80], 0);
    });

    it('calls onValueChange with correct index for upper thumb', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], onValueChange: handleChange, ariaLabel: ['Min', 'Max'] },
      });
      const [, upperThumb] = screen.getAllByRole('slider');

      await user.click(upperThumb);
      await user.keyboard('{ArrowLeft}');

      expect(handleChange).toHaveBeenCalledWith([20, 79], 1);
    });

    it('does not call onValueChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: {
          defaultValue: [20, 80],
          disabled: true,
          onValueChange: handleChange,
          ariaLabel: ['Min', 'Max'],
        },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      lowerThumb.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onValueChange when value does not change', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [80, 80], onValueChange: handleChange, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal step values correctly', async () => {
      const user = userEvent.setup();
      render(MultiThumbSlider, {
        props: { defaultValue: [0.2, 0.8], min: 0, max: 1, step: 0.1, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb] = screen.getAllByRole('slider');

      await user.click(lowerThumb);
      await user.keyboard('{ArrowRight}');

      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0.3');
    });

    it('handles negative min/max range', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [-30, 30], min: -50, max: 50, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '-30');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '30');
      expect(lowerThumb).toHaveAttribute('aria-valuemin', '-50');
      expect(upperThumb).toHaveAttribute('aria-valuemax', '50');
    });

    it('normalizes invalid defaultValue (lower > upper)', () => {
      render(MultiThumbSlider, { props: { defaultValue: [80, 20], ariaLabel: ['Min', 'Max'] } });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      const lowerValue = Number(lowerThumb.getAttribute('aria-valuenow'));
      const upperValue = Number(upperThumb.getAttribute('aria-valuenow'));
      expect(lowerValue).toBeLessThanOrEqual(upperValue);
    });

    it('clamps defaultValue to min/max', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [-10, 150], min: 0, max: 100, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '100');
    });

    it('rounds values to step', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [23, 77], step: 5, ariaLabel: ['Min', 'Max'] },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '25');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '75');
    });

    it('uses default values when not provided', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Min', 'Max'] } });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-valuenow', '0');
      expect(upperThumb).toHaveAttribute('aria-valuenow', '100');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows values when showValues is true (default)', () => {
      render(MultiThumbSlider, { props: { defaultValue: [20, 80], ariaLabel: ['Min', 'Max'] } });
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });

    it('hides values when showValues is false', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], showValues: false, ariaLabel: ['Min', 'Max'] },
      });
      expect(screen.queryByText('20')).not.toBeInTheDocument();
      expect(screen.queryByText('80')).not.toBeInTheDocument();
    });

    it('displays formatted values when format provided', () => {
      render(MultiThumbSlider, {
        props: { defaultValue: [20, 80], format: '${value}', ariaLabel: ['Min', 'Max'] },
      });
      expect(screen.getByText('$20')).toBeInTheDocument();
      expect(screen.getByText('$80')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Min', 'Max'], class: 'custom-slider' } });
      const container = screen.getAllByRole('slider')[0].closest('.apg-slider-multithumb');
      expect(container).toHaveClass('custom-slider');
    });

    it('sets id attribute on container', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Min', 'Max'], id: 'my-slider' } });
      const container = screen.getAllByRole('slider')[0].closest('.apg-slider-multithumb');
      expect(container).toHaveAttribute('id', 'my-slider');
    });

    it('passes through data-testid', () => {
      render(MultiThumbSlider, {
        props: { ariaLabel: ['Min', 'Max'], 'data-testid': 'custom-slider' },
      });
      expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
    });

    it('supports aria-describedby as string', () => {
      render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [
              h(MultiThumbSlider, { ariaLabel: ['Min', 'Max'], ariaDescribedby: 'desc' }),
              h('p', { id: 'desc' }, 'Select a range'),
            ]);
        },
      });
      screen.getAllByRole('slider').forEach((slider) => {
        expect(slider).toHaveAttribute('aria-describedby', 'desc');
      });
    });

    it('supports aria-describedby as tuple', () => {
      render({
        components: { MultiThumbSlider },
        setup() {
          return () =>
            h('div', [
              h(MultiThumbSlider, {
                ariaLabel: ['Min', 'Max'],
                ariaDescribedby: ['min-desc', 'max-desc'],
              }),
              h('p', { id: 'min-desc' }, 'Minimum value'),
              h('p', { id: 'max-desc' }, 'Maximum value'),
            ]);
        },
      });
      const [lowerThumb, upperThumb] = screen.getAllByRole('slider');
      expect(lowerThumb).toHaveAttribute('aria-describedby', 'min-desc');
      expect(upperThumb).toHaveAttribute('aria-describedby', 'max-desc');
    });
  });

  // 🟢 Low Priority: Group Labeling
  describe('Group Labeling', () => {
    it('has role="group" on container', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Min', 'Max'], label: 'Price Range' } });
      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('group has accessible name via label prop', () => {
      render(MultiThumbSlider, { props: { ariaLabel: ['Min', 'Max'], label: 'Price Range' } });
      expect(screen.getByRole('group', { name: 'Price Range' })).toBeInTheDocument();
    });
  });
});
