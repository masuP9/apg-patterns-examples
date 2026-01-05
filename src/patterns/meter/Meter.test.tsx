import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Meter } from './Meter';

describe('Meter', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="meter"', () => {
      render(<Meter value={50} aria-label="Progress" />);
      expect(screen.getByRole('meter')).toBeInTheDocument();
    });

    it('has aria-valuenow set to current value', () => {
      render(<Meter value={75} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '75');
    });

    it('has aria-valuemin set (default: 0)', () => {
      render(<Meter value={50} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemin', '0');
    });

    it('has aria-valuemax set (default: 100)', () => {
      render(<Meter value={50} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemax', '100');
    });

    it('has custom aria-valuemin when provided', () => {
      render(<Meter value={50} min={10} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemin', '10');
    });

    it('has custom aria-valuemax when provided', () => {
      render(<Meter value={50} max={200} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuemax', '200');
    });

    it('has aria-valuetext when valueText provided', () => {
      render(<Meter value={75} valueText="75 percent complete" aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuetext', '75 percent complete');
    });

    it('does not have aria-valuetext when not provided', () => {
      render(<Meter value={75} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).not.toHaveAttribute('aria-valuetext');
    });

    it('uses format for aria-valuetext', () => {
      render(<Meter value={75} min={0} max={100} format="{value}%" aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuetext', '75%');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(<Meter value={50} aria-label="CPU Usage" />);
      expect(screen.getByRole('meter', { name: 'CPU Usage' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <>
          <span id="meter-label">Battery Level</span>
          <Meter value={80} aria-labelledby="meter-label" />
        </>
      );
      expect(screen.getByRole('meter', { name: 'Battery Level' })).toBeInTheDocument();
    });

    it('has accessible name via visible label', () => {
      render(<Meter value={50} label="Storage Used" />);
      expect(screen.getByRole('meter', { name: 'Storage Used' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Value Clamping
  describe('Value Clamping', () => {
    it('clamps value above max to max', () => {
      render(<Meter value={150} min={0} max={100} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '100');
    });

    it('clamps value below min to min', () => {
      render(<Meter value={-50} min={0} max={100} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '0');
    });

    it('does not clamp when clamp=false', () => {
      render(<Meter value={150} min={0} max={100} clamp={false} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '150');
    });
  });

  // 🔴 High Priority: Focus Behavior
  describe('Focus Behavior', () => {
    it('is not focusable by default', () => {
      render(<Meter value={50} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).not.toHaveAttribute('tabindex');
    });

    it('is focusable when tabIndex is provided', () => {
      render(<Meter value={50} aria-label="Progress" tabIndex={0} />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('tabindex', '0');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Meter value={50} aria-label="Progress" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with visible label', async () => {
      const { container } = render(<Meter value={50} label="CPU Usage" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">Battery</span>
          <Meter value={80} aria-labelledby="label" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with valueText', async () => {
      const { container } = render(
        <Meter value={75} valueText="75% complete" aria-label="Progress" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations at boundary values', async () => {
      const { container } = render(<Meter value={0} aria-label="Empty" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('handles decimal values correctly', () => {
      render(<Meter value={33.33} aria-label="Progress" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '33.33');
    });

    it('handles negative min/max range', () => {
      render(<Meter value={0} min={-50} max={50} aria-label="Temperature" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '0');
      expect(meter).toHaveAttribute('aria-valuemin', '-50');
      expect(meter).toHaveAttribute('aria-valuemax', '50');
    });

    it('handles large values', () => {
      render(<Meter value={500000} min={0} max={1000000} aria-label="Revenue" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '500000');
      expect(meter).toHaveAttribute('aria-valuemax', '1000000');
    });

    it('handles zero range edge case (min equals max)', () => {
      render(<Meter value={50} min={50} max={50} aria-label="Static" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-valuenow', '50');
    });
  });

  // 🟡 Medium Priority: Visual Display
  describe('Visual Display', () => {
    it('shows value when showValue is true (default)', () => {
      render(<Meter value={75} aria-label="Progress" />);
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('hides value when showValue is false', () => {
      render(<Meter value={75} aria-label="Progress" showValue={false} />);
      expect(screen.queryByText('75')).not.toBeInTheDocument();
    });

    it('displays formatted value when format provided', () => {
      render(<Meter value={75} format="{value}%" aria-label="Progress" />);
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('displays visible label when label provided', () => {
      render(<Meter value={50} label="CPU Usage" />);
      expect(screen.getByText('CPU Usage')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      render(<Meter value={50} aria-label="Progress" className="custom-meter" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveClass('custom-meter');
    });

    it('sets id attribute', () => {
      render(<Meter value={50} aria-label="Progress" id="my-meter" />);
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('id', 'my-meter');
    });

    it('passes through data-* attributes', () => {
      render(<Meter value={50} aria-label="Progress" data-testid="custom-meter" />);
      expect(screen.getByTestId('custom-meter')).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <Meter value={50} aria-label="Progress" aria-describedby="desc" />
          <p id="desc">This shows your progress</p>
        </>
      );
      const meter = screen.getByRole('meter');
      expect(meter).toHaveAttribute('aria-describedby', 'desc');
    });
  });
});
