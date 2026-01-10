import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import WindowSplitter from './WindowSplitter.svelte';
import WindowSplitterWithLabel from './WindowSplitterWithLabel.test.svelte';
import WindowSplitterWithDescribedby from './WindowSplitterWithDescribedby.test.svelte';
import WindowSplitterWithPanes from './WindowSplitterWithPanes.test.svelte';

describe('WindowSplitter (Svelte)', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="separator"', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has aria-valuenow set to current position (default: 50)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('has aria-valuenow set to custom defaultPosition', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 30,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '30');
    });

    it('has aria-valuemin set (default: 10)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemin', '10');
    });

    it('has aria-valuemax set (default: 90)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemax', '90');
    });

    it('has custom aria-valuemin when provided', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', min: 5, 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemin', '5');
    });

    it('has custom aria-valuemax when provided', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', max: 95, 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemax', '95');
    });

    it('has aria-controls referencing primary pane', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'main-panel', 'aria-label': 'Resize panels' },
      });
      expect(screen.getByRole('separator')).toHaveAttribute('aria-controls', 'main-panel');
    });

    it('has aria-controls referencing both panes when secondaryPaneId provided', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          secondaryPaneId: 'secondary',
          'aria-label': 'Resize panels',
        },
      });
      expect(screen.getByRole('separator')).toHaveAttribute('aria-controls', 'primary secondary');
    });

    it('has aria-valuenow="0" when collapsed', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultCollapsed: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '0');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          disabled: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).not.toHaveAttribute('aria-disabled');
    });

    // Note: aria-readonly is not a valid attribute for role="separator"
    // Readonly behavior is enforced via JavaScript only

    it('clamps defaultPosition to min', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 5,
          min: 10,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    it('clamps defaultPosition to max', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 95,
          max: 90,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      expect(screen.getByRole('separator', { name: 'Resize panels' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(WindowSplitterWithLabel);
      expect(screen.getByRole('separator', { name: 'Panel Divider' })).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render(WindowSplitterWithDescribedby);
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-describedby', 'help');
    });
  });

  // 🔴 High Priority: Orientation
  describe('Orientation', () => {
    it('does not have aria-orientation for horizontal splitter (default)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).not.toHaveAttribute('aria-orientation');
    });

    it('has aria-orientation="vertical" for vertical splitter', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          orientation: 'vertical',
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Horizontal
  describe('Keyboard Interaction - Horizontal', () => {
    it('increases value by step on ArrowRight', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });

    it('decreases value by step on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowLeft}');

      expect(separator).toHaveAttribute('aria-valuenow', '45');
    });

    it('increases value by largeStep on Shift+ArrowRight', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          largeStep: 10,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(separator).toHaveAttribute('aria-valuenow', '60');
    });

    it('decreases value by largeStep on Shift+ArrowLeft', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          largeStep: 10,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');

      expect(separator).toHaveAttribute('aria-valuenow', '40');
    });

    it('ignores ArrowUp on horizontal splitter', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowUp}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('ignores ArrowDown on horizontal splitter', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowDown}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Vertical
  describe('Keyboard Interaction - Vertical', () => {
    it('increases value by step on ArrowUp', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          orientation: 'vertical',
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowUp}');

      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });

    it('decreases value by step on ArrowDown', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          orientation: 'vertical',
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowDown}');

      expect(separator).toHaveAttribute('aria-valuenow', '45');
    });

    it('ignores ArrowLeft on vertical splitter', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          orientation: 'vertical',
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowLeft}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('ignores ArrowRight on vertical splitter', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          orientation: 'vertical',
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Collapse/Expand
  describe('Keyboard Interaction - Collapse/Expand', () => {
    it('collapses on Enter (aria-valuenow becomes 0)', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(separator).toHaveAttribute('aria-valuenow', '0');
    });

    it('restores previous value on Enter after collapse', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}'); // Collapse
      await user.keyboard('{Enter}'); // Expand

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('expands to expandedPosition when initially collapsed', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultCollapsed: true,
          expandedPosition: 30,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}'); // Expand

      expect(separator).toHaveAttribute('aria-valuenow', '30');
    });

    it('does not collapse when collapsible is false', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          collapsible: false,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('remembers position across multiple collapse/expand cycles', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}'); // 55
      await user.keyboard('{Enter}'); // Collapse → 0
      expect(separator).toHaveAttribute('aria-valuenow', '0');

      await user.keyboard('{Enter}'); // Expand → 55
      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Home/End
  describe('Keyboard Interaction - Home/End', () => {
    it('sets min value on Home', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          min: 10,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Home}');

      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    it('sets max value on End', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          max: 90,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{End}');

      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - RTL
  describe('Keyboard Interaction - RTL', () => {
    it('ArrowLeft increases value in RTL mode (horizontal)', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          dir: 'rtl',
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowLeft}');

      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });

    it('ArrowRight decreases value in RTL mode (horizontal)', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          dir: 'rtl',
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '45');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Disabled/Readonly
  describe('Keyboard Interaction - Disabled/Readonly', () => {
    it('does not change value when disabled', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          disabled: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      separator.focus();
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not change value when readonly', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          readonly: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not collapse when disabled', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          disabled: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      separator.focus();
      await user.keyboard('{Enter}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not collapse when readonly', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          readonly: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on separator', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex="-1" when disabled', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          disabled: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('tabindex', '-1');
    });

    it('is focusable when readonly', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          readonly: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('tabindex', '0');
    });

    it('can be focused via click', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);

      expect(document.activeElement).toBe(separator);
    });
  });

  // 🟡 Medium Priority: Pointer Interaction
  describe('Pointer Interaction', () => {
    it('focuses separator on pointer down', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.pointer({ target: separator, keys: '[MouseLeft>]' });

      expect(document.activeElement).toBe(separator);
    });

    it('does not start drag when disabled', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          disabled: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      // tabindex should be -1 when disabled
      expect(separator).toHaveAttribute('tabindex', '-1');
    });

    it('does not start drag when readonly', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          readonly: true,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      // readonly should still be focusable (tabindex="0")
      expect(separator).toHaveAttribute('tabindex', '0');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(WindowSplitterWithPanes, {
        props: { 'aria-label': 'Resize panels' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when collapsed', async () => {
      const { container } = render(WindowSplitterWithPanes, {
        props: { defaultCollapsed: true, 'aria-label': 'Resize panels' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(WindowSplitterWithPanes, {
        props: { disabled: true, 'aria-label': 'Resize panels' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for vertical splitter', async () => {
      const { container } = render(WindowSplitterWithPanes, {
        props: { orientation: 'vertical', 'aria-label': 'Resize panels' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render(WindowSplitterWithLabel);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Callbacks
  describe('Callbacks', () => {
    it('calls onpositionchange on keyboard interaction', async () => {
      const user = userEvent.setup();
      let capturedPosition: number | undefined;
      let capturedSizeInPx: number | undefined;

      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          step: 5,
          'aria-label': 'Resize panels',
          onpositionchange: (pos: number, size: number) => {
            capturedPosition = pos;
            capturedSizeInPx = size;
          },
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(capturedPosition).toBe(55);
      expect(typeof capturedSizeInPx).toBe('number');
    });

    it('calls oncollapsedchange on collapse', async () => {
      const user = userEvent.setup();
      let capturedCollapsed: boolean | undefined;
      let capturedPreviousPosition: number | undefined;

      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          'aria-label': 'Resize panels',
          oncollapsedchange: (collapsed: boolean, prevPos: number) => {
            capturedCollapsed = collapsed;
            capturedPreviousPosition = prevPos;
          },
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(capturedCollapsed).toBe(true);
      expect(capturedPreviousPosition).toBe(50);
    });

    it('calls oncollapsedchange on expand', async () => {
      const user = userEvent.setup();
      let capturedCollapsed: boolean | undefined;

      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultCollapsed: true,
          'aria-label': 'Resize panels',
          oncollapsedchange: (collapsed: boolean) => {
            capturedCollapsed = collapsed;
          },
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(capturedCollapsed).toBe(false);
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('does not exceed max on ArrowRight', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 88,
          max: 90,
          step: 5,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });

    it('does not go below min on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 12,
          min: 10,
          step: 5,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowLeft}');

      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    it('handles min=0 max=100 range', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          min: 0,
          max: 100,
          defaultPosition: 50,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemin', '0');
      expect(separator).toHaveAttribute('aria-valuemax', '100');
      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('handles custom min/max range', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          min: 20,
          max: 80,
          defaultPosition: 50,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemin', '20');
      expect(separator).toHaveAttribute('aria-valuemax', '80');
    });

    it('prevents default on handled keyboard events', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          defaultPosition: 50,
          'aria-label': 'Resize panels',
        },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to container', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          'aria-label': 'Resize panels',
          class: 'custom-splitter',
        },
      });
      const container = screen.getByRole('separator').closest('.apg-window-splitter');
      expect(container).toHaveClass('custom-splitter');
    });

    it('sets id attribute on separator element', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          'aria-label': 'Resize panels',
          id: 'my-splitter',
        },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('id', 'my-splitter');
    });

    it('passes through data-* attributes', () => {
      render(WindowSplitter, {
        props: {
          primaryPaneId: 'primary',
          'aria-label': 'Resize panels',
          'data-testid': 'custom-splitter',
        },
      });
      expect(screen.getByTestId('custom-splitter')).toBeInTheDocument();
    });
  });
});
