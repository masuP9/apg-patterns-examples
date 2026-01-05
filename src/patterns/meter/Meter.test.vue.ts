import { render, screen } from '@testing-library/vue';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import Meter from './Meter.vue';

describe('Meter (Vue)', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="meter"', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress' },
      });
      expect(screen.getByRole('meter')).toBeInTheDocument();
    });

    it('has aria-valuenow set to current value', () => {
      render(Meter, {
        props: { value: 75 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '75');
    });

    it('has aria-valuemin set (default: 0)', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemin', '0');
    });

    it('has aria-valuemax set (default: 100)', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemax', '100');
    });

    it('has custom aria-valuemin when provided', () => {
      render(Meter, {
        props: { value: 50, min: 10 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemin', '10');
    });

    it('has custom aria-valuemax when provided', () => {
      render(Meter, {
        props: { value: 50, max: 200 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemax', '200');
    });

    it('has aria-valuetext when valueText provided', () => {
      render(Meter, {
        props: { value: 75, valueText: '75 percent complete' },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuetext', '75 percent complete');
    });

    it('does not have aria-valuetext when not provided', () => {
      render(Meter, {
        props: { value: 75 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).not.toHaveAttribute('aria-valuetext');
    });

    it('uses format for aria-valuetext', () => {
      render(Meter, {
        props: {
          value: 75,
          min: 0,
          max: 100,
          format: '{value}%',
        },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuetext', '75%');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'CPU Usage' },
      });
      expect(screen.getByRole('meter', { name: 'CPU Usage' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render({
        components: { Meter },
        template: `
          <div>
            <span id="meter-label">Battery Level</span>
            <Meter :value="80" aria-labelledby="meter-label" />
          </div>
        `,
      });
      expect(screen.getByRole('meter', { name: 'Battery Level' })).toBeInTheDocument();
    });

    it('has accessible name via visible label', () => {
      render(Meter, {
        props: { value: 50, label: 'Storage Used' },
      });
      expect(screen.getByRole('meter', { name: 'Storage Used' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Value Clamping
  describe('Value Clamping', () => {
    it('clamps value above max to max', () => {
      render(Meter, {
        props: { value: 150, min: 0, max: 100 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '100');
    });

    it('clamps value below min to min', () => {
      render(Meter, {
        props: { value: -50, min: 0, max: 100 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '0');
    });

    it('does not clamp when clamp=false', () => {
      render(Meter, {
        props: { value: 150, min: 0, max: 100, clamp: false },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '150');
    });
  });

  // 🔴 High Priority: Focus Behavior
  describe('Focus Behavior', () => {
    it('is not focusable by default', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).not.toHaveAttribute('tabindex');
    });

    it('is focusable when tabIndex is provided', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress', tabindex: 0 },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('tabindex', '0');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with visible label', async () => {
      const { container } = render(Meter, {
        props: { value: 50, label: 'CPU Usage' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with valueText', async () => {
      const { container } = render(Meter, {
        props: { value: 75, valueText: '75% complete' },
        attrs: { 'aria-label': 'Progress' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal values correctly', () => {
      render(Meter, {
        props: { value: 33.33 },
        attrs: { 'aria-label': 'Progress' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '33.33');
    });

    it('handles negative min/max range', () => {
      render(Meter, {
        props: { value: 0, min: -50, max: 50 },
        attrs: { 'aria-label': 'Temperature' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '0');
      expect(meter).toHaveAttribute('aria-valuemin', '-50');
      expect(meter).toHaveAttribute('aria-valuemax', '50');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows value when showValue is true (default)', () => {
      render(Meter, {
        props: { value: 75 },
        attrs: { 'aria-label': 'Progress' },
      });
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('hides value when showValue is false', () => {
      render(Meter, {
        props: { value: 75, showValue: false },
        attrs: { 'aria-label': 'Progress' },
      });
      expect(screen.queryByText('75')).not.toBeInTheDocument();
    });

    it('displays formatted value when format provided', () => {
      render(Meter, {
        props: {
          value: 75,
          format: '{value}%',
        },
        attrs: { 'aria-label': 'Progress' },
      });
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('displays visible label when label provided', () => {
      render(Meter, {
        props: { value: 50, label: 'CPU Usage' },
      });
      expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to container', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress', class: 'custom-meter' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveClass('custom-meter');
    });

    it('sets id attribute', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress', id: 'my-meter' },
      });
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('id', 'my-meter');
    });

    it('passes through data-* attributes', () => {
      render(Meter, {
        props: { value: 50 },
        attrs: { 'aria-label': 'Progress', 'data-testid': 'custom-meter' },
      });
      expect(screen.getByTestId('custom-meter')).toBeInTheDocument();
    });
  });
});
