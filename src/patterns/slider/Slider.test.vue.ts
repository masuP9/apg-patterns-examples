import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Slider from './Slider.vue';

describe('Slider (Vue)', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="slider"', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume' },
      });
      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('has aria-valuenow set to current value', () => {
      render(Slider, {
        props: { defaultValue: 50 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });

    it('has aria-valuenow set to min when no defaultValue', () => {
      render(Slider, {
        props: { min: 10 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '10');
    });

    it('has aria-valuemin set (default: 0)', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
    });

    it('has aria-valuemax set (default: 100)', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });

    it('has custom aria-valuemin when provided', () => {
      render(Slider, {
        props: { defaultValue: 50, min: 10 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '10');
    });

    it('has custom aria-valuemax when provided', () => {
      render(Slider, {
        props: { defaultValue: 50, max: 200 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemax', '200');
    });

    it('has aria-valuetext when valueText provided', () => {
      render(Slider, {
        props: { defaultValue: 75, valueText: '75 percent' },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuetext', '75 percent');
    });

    it('does not have aria-valuetext when not provided', () => {
      render(Slider, {
        props: { defaultValue: 75 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('aria-valuetext');
    });

    it('uses format for aria-valuetext', () => {
      render(Slider, {
        props: {
          defaultValue: 75,
          format: '{value}%',
        },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuetext', '75%');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(Slider, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('aria-disabled');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume' },
      });
      expect(screen.getByRole('slider', { name: 'Volume' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render({
        components: { Slider },
        template: `
          <div>
            <span id="slider-label">Brightness</span>
            <Slider aria-labelledby="slider-label" />
          </div>
        `,
      });
      expect(screen.getByRole('slider', { name: 'Brightness' })).toBeInTheDocument();
    });

    it('has accessible name via visible label', () => {
      render(Slider, {
        props: { label: 'Zoom Level' },
      });
      expect(screen.getByRole('slider', { name: 'Zoom Level' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Keyboard Interaction
  describe('Keyboard Interaction', () => {
    it('increases value by step on ArrowRight', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 50, step: 1 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '51');
    });

    it('decreases value by step on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 50, step: 1 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowLeft}');

      expect(slider).toHaveAttribute('aria-valuenow', '49');
    });

    it('sets min value on Home', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 50, min: 0 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{Home}');

      expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    it('sets max value on End', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 50, max: 100 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{End}');

      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('increases value by large step on PageUp', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 50, step: 1 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{PageUp}');

      expect(slider).toHaveAttribute('aria-valuenow', '60');
    });

    it('does not exceed max on ArrowRight', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 100, max: 100 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });

    it('does not change value when disabled', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 50, disabled: true },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      slider.focus();
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '50');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on thumb', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex="-1" when disabled', () => {
      render(Slider, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('tabindex', '-1');
    });
  });

  // 🔴 High Priority: Orientation
  describe('Orientation', () => {
    it('does not have aria-orientation for horizontal slider', () => {
      render(Slider, {
        props: { orientation: 'horizontal' },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).not.toHaveAttribute('aria-orientation');
    });

    it('has aria-orientation="vertical" for vertical slider', () => {
      render(Slider, {
        props: { orientation: 'vertical' },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Slider, {
        attrs: { 'aria-label': 'Volume' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with visible label', async () => {
      const { container } = render(Slider, {
        props: { label: 'Volume' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(Slider, {
        props: { disabled: true },
        attrs: { 'aria-label': 'Volume' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for vertical slider', async () => {
      const { container } = render(Slider, {
        props: { orientation: 'vertical' },
        attrs: { 'aria-label': 'Volume' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Events
  describe('Events', () => {
    it('emits valueChange on keyboard interaction', async () => {
      const user = userEvent.setup();
      const { emitted } = render(Slider, {
        props: { defaultValue: 50 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(emitted('valueChange')).toBeTruthy();
      expect(emitted('valueChange')[0]).toEqual([51]);
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal step values correctly', async () => {
      const user = userEvent.setup();
      render(Slider, {
        props: { defaultValue: 0.5, min: 0, max: 1, step: 0.1 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');

      await user.click(slider);
      await user.keyboard('{ArrowRight}');

      expect(slider).toHaveAttribute('aria-valuenow', '0.6');
    });

    it('handles negative min/max range', () => {
      render(Slider, {
        props: { defaultValue: 0, min: -50, max: 50 },
        attrs: { 'aria-label': 'Temperature' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '0');
      expect(slider).toHaveAttribute('aria-valuemin', '-50');
      expect(slider).toHaveAttribute('aria-valuemax', '50');
    });

    it('clamps defaultValue to min', () => {
      render(Slider, {
        props: { defaultValue: -10, min: 0, max: 100 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '0');
    });

    it('clamps defaultValue to max', () => {
      render(Slider, {
        props: { defaultValue: 150, min: 0, max: 100 },
        attrs: { 'aria-label': 'Volume' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuenow', '100');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows value when showValue is true (default)', () => {
      render(Slider, {
        props: { defaultValue: 75 },
        attrs: { 'aria-label': 'Volume' },
      });
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('hides value when showValue is false', () => {
      render(Slider, {
        props: { defaultValue: 75, showValue: false },
        attrs: { 'aria-label': 'Volume' },
      });
      expect(screen.queryByText('75')).not.toBeInTheDocument();
    });

    it('displays formatted value when format provided', () => {
      render(Slider, {
        props: {
          defaultValue: 75,
          format: '{value}%',
        },
        attrs: { 'aria-label': 'Volume' },
      });
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('displays visible label when label provided', () => {
      render(Slider, {
        props: { label: 'Volume' },
      });
      expect(screen.getByText('Volume')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to container', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume', class: 'custom-slider' },
      });
      const container = screen.getByRole('slider').closest('.apg-slider');
      expect(container).toHaveClass('custom-slider');
    });

    it('sets id attribute on slider element', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume', id: 'my-slider' },
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('id', 'my-slider');
    });

    it('passes through data-* attributes', () => {
      render(Slider, {
        attrs: { 'aria-label': 'Volume', 'data-testid': 'custom-slider' },
      });
      expect(screen.getByTestId('custom-slider')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render({
        components: { Slider },
        template: `
          <div>
            <Slider aria-label="Volume" aria-describedby="desc" />
            <p id="desc">Adjust the volume level</p>
          </div>
        `,
      });
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-describedby', 'desc');
    });
  });
});
