import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  // 🔴 High Priority: APG Core Compliance
  describe('APG: ARIA Attributes', () => {
    it('has role="tooltip"', () => {
      render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      expect(screen.getByRole('tooltip', { hidden: true })).toBeInTheDocument();
    });

    it('has aria-hidden="true" when hidden', () => {
      render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveAttribute('aria-hidden', 'true');
    });

    it('has aria-hidden="false" when visible', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('sets aria-describedby only when visible', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');
      const wrapper = trigger.parentElement;

      // No aria-describedby when hidden
      expect(wrapper).not.toHaveAttribute('aria-describedby');

      await user.hover(trigger);
      await waitFor(() => {
        expect(wrapper).toHaveAttribute('aria-describedby');
      });

      const tooltipId = wrapper?.getAttribute('aria-describedby');
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toHaveAttribute('id', tooltipId);
    });
  });

  describe('APG: Keyboard Interaction', () => {
    it('closes with Escape key', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });

      await user.keyboard('{Escape}');
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
          'aria-hidden',
          'true'
        );
      });
    });

    it('shows on focus', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();

      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('closes on focus out', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Tooltip content="This is a tooltip" delay={0}>
            <button>First</button>
          </Tooltip>
          <button>Second</button>
        </>
      );

      await user.tab();
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });

      await user.tab();
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
          'aria-hidden',
          'true'
        );
      });
    });
  });

  describe('Hover Interaction', () => {
    afterEach(() => {
      vi.useRealTimers();
    });

    it('shows on hover', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });
    });

    it('closes on hover out', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });

      await user.unhover(trigger);
      await waitFor(() => {
        expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute(
          'aria-hidden',
          'true'
        );
      });
    });

    it('shows after delay', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="This is a tooltip" delay={100}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');

      await user.hover(trigger);

      // Hidden immediately before delay
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');

      // Visible after delay
      await waitFor(
        () => {
          expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
        },
        { timeout: 200 }
      );
    });
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no WCAG 2.1 AA violations (hidden state)', async () => {
      const { container } = render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no WCAG 2.1 AA violations (visible state)', async () => {
      const user = userEvent.setup();
      const { container } = render(
        <Tooltip content="This is a tooltip" delay={0}>
          <button>Hover me</button>
        </Tooltip>
      );

      await user.hover(screen.getByRole('button'));
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('tooltip does not receive focus', () => {
      render(
        <Tooltip content="This is a tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).not.toHaveAttribute('tabindex');
    });
  });

  describe('Props', () => {
    it('can change position with placement prop', () => {
      render(
        <Tooltip content="Tooltip" placement="bottom">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveClass('top-full');
    });

    it('does not show tooltip when disabled', async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip" delay={0} disabled>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      // Does not show because disabled (delay=0 so immediate)
      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');
    });

    it('can set custom ID with id prop', () => {
      render(
        <Tooltip content="Tooltip" id="custom-tooltip-id">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveAttribute('id', 'custom-tooltip-id');
    });

    it('calls onOpenChange when state changes', async () => {
      const handleOpenChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Tooltip content="Tooltip" delay={0} onOpenChange={handleOpenChange}>
          <button>Hover me</button>
        </Tooltip>
      );
      const trigger = screen.getByRole('button');

      await user.hover(trigger);
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(true);
      });

      await user.unhover(trigger);
      await waitFor(() => {
        expect(handleOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('can be controlled with open prop', () => {
      const { rerender } = render(
        <Tooltip content="Tooltip" open={false}>
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByRole('tooltip', { hidden: true })).toHaveAttribute('aria-hidden', 'true');

      rerender(
        <Tooltip content="Tooltip" open={true}>
          <button>Hover me</button>
        </Tooltip>
      );

      expect(screen.getByRole('tooltip')).toHaveAttribute('aria-hidden', 'false');
    });
  });

  // 🟢 Low Priority: Extensibility
  describe('HTML Attribute Inheritance', () => {
    it('merges className correctly', () => {
      render(
        <Tooltip content="Tooltip" className="custom-class">
          <button>Hover me</button>
        </Tooltip>
      );
      const wrapper = screen.getByRole('button').parentElement;
      expect(wrapper).toHaveClass('custom-class');
      expect(wrapper).toHaveClass('apg-tooltip-trigger');
    });

    it('applies tooltipClassName', () => {
      render(
        <Tooltip content="Tooltip" tooltipClassName="custom-tooltip">
          <button>Hover me</button>
        </Tooltip>
      );
      const tooltip = screen.getByRole('tooltip', { hidden: true });
      expect(tooltip).toHaveClass('custom-tooltip');
    });
  });
});
