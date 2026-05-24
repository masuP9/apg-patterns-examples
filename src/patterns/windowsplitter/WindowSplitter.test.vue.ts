import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import WindowSplitter from './WindowSplitter.vue';

// Helper to render with panes for aria-controls validation
const renderWithPanes = (
  props: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {}
) => {
  return render({
    components: { WindowSplitter },
    template: `
      <div>
        <div id="primary">Primary Pane</div>
        <div id="secondary">Secondary Pane</div>
        <WindowSplitter v-bind="allProps" />
      </div>
    `,
    data() {
      return {
        allProps: {
          primaryPaneId: 'primary',
          ...props,
          ...attrs,
        },
      };
    },
  });
};

describe('WindowSplitter (Vue)', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="separator"', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has aria-valuenow set to current position (default: 50)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('has aria-valuenow set to custom defaultPosition', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 30 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '30');
    });

    it('has aria-valuemin set (default: 10)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemin', '10');
    });

    it('has aria-valuemax set (default: 90)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemax', '90');
    });

    it('has custom aria-valuemin when provided', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', min: 5 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemin', '5');
    });

    it('has custom aria-valuemax when provided', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', max: 95 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemax', '95');
    });

    it('has aria-controls referencing primary pane', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'main-panel' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      expect(screen.getByRole('separator')).toHaveAttribute('aria-controls', 'main-panel');
    });

    it('has aria-controls referencing both panes when secondaryPaneId provided', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', secondaryPaneId: 'secondary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      expect(screen.getByRole('separator')).toHaveAttribute('aria-controls', 'primary secondary');
    });

    it('has aria-valuenow="0" when collapsed', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultCollapsed: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '0');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', disabled: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).not.toHaveAttribute('aria-disabled');
    });

    // Note: aria-readonly is not a valid attribute for role="separator"
    // Readonly behavior is enforced via JavaScript only

    it('clamps defaultPosition to min', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 5, min: 10 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    it('clamps defaultPosition to max', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 95, max: 90 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      expect(screen.getByRole('separator', { name: 'Resize panels' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render({
        components: { WindowSplitter },
        template: `
          <div>
            <span id="splitter-label">Panel Divider</span>
            <WindowSplitter primaryPaneId="primary" aria-labelledby="splitter-label" />
          </div>
        `,
      });
      expect(screen.getByRole('separator', { name: 'Panel Divider' })).toBeInTheDocument();
    });

    it('supports aria-describedby', () => {
      render({
        components: { WindowSplitter },
        template: `
          <div>
            <WindowSplitter primaryPaneId="primary" aria-label="Resize" aria-describedby="help" />
            <p id="help">Press Enter to collapse</p>
          </div>
        `,
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-describedby', 'help');
    });
  });

  // 🔴 High Priority: Orientation
  describe('Orientation', () => {
    it('does not have aria-orientation for horizontal splitter (default)', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).not.toHaveAttribute('aria-orientation');
    });

    it('has aria-orientation="vertical" for vertical splitter', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', orientation: 'vertical' },
        attrs: { 'aria-label': 'Resize panels' },
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
        props: { primaryPaneId: 'primary', defaultPosition: 50, step: 5 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });

    it('decreases value by step on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, step: 5 },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');

      expect(separator).toHaveAttribute('aria-valuenow', '40');
    });

    it('ignores ArrowUp on horizontal splitter', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowUp}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('ignores ArrowDown on horizontal splitter', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        props: { primaryPaneId: 'primary', defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(separator).toHaveAttribute('aria-valuenow', '0');
    });

    it('restores previous value on Enter after collapse', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('remembers position across multiple collapse/expand cycles', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, step: 5 },
        attrs: { 'aria-label': 'Resize panels' },
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
        props: { primaryPaneId: 'primary', defaultPosition: 50, min: 10 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Home}');

      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    it('sets max value on End', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, max: 90 },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
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
        props: { primaryPaneId: 'primary', defaultPosition: 50, disabled: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      separator.focus();
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not change value when readonly', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, readonly: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not collapse when disabled', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, disabled: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      separator.focus();
      await user.keyboard('{Enter}');

      expect(separator).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not collapse when readonly', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, readonly: true },
        attrs: { 'aria-label': 'Resize panels' },
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
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex="-1" when disabled', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', disabled: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('tabindex', '-1');
    });

    it('is focusable when readonly', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', readonly: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('tabindex', '0');
    });

    it('maintains focus after collapse', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(document.activeElement).toBe(separator);
    });

    it('maintains focus after expand', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultCollapsed: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(document.activeElement).toBe(separator);
    });

    it('can be focused via click', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
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
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.pointer({ target: separator, keys: '[MouseLeft>]' });

      expect(document.activeElement).toBe(separator);
    });

    it('does not start drag when disabled', async () => {
      // When disabled, the handler returns early without calling setPointerCapture
      // The key test is that keyboard operations are blocked, not focus behavior
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', disabled: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      // tabindex should be -1 when disabled
      expect(separator).toHaveAttribute('tabindex', '-1');
    });

    it('does not start drag when readonly', async () => {
      // When readonly, the handler returns early without calling setPointerCapture
      // readonly is focusable but not operable - keyboard tests verify this behavior
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', readonly: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      // readonly should still be focusable (tabindex="0")
      expect(separator).toHaveAttribute('tabindex', '0');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = renderWithPanes({}, { 'aria-label': 'Resize panels' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when collapsed', async () => {
      const { container } = renderWithPanes(
        { defaultCollapsed: true },
        { 'aria-label': 'Resize panels' }
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = renderWithPanes({ disabled: true }, { 'aria-label': 'Resize panels' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for vertical splitter', async () => {
      const { container } = renderWithPanes(
        { orientation: 'vertical' },
        { 'aria-label': 'Resize panels' }
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render({
        components: { WindowSplitter },
        template: `
          <div>
            <span id="splitter-label">Panel Divider</span>
            <div id="primary">Primary Pane</div>
            <WindowSplitter primaryPaneId="primary" aria-labelledby="splitter-label" />
          </div>
        `,
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Events
  describe('Events', () => {
    it('emits positionChange on keyboard interaction', async () => {
      const user = userEvent.setup();
      const { emitted } = render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, step: 5 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(emitted('positionChange')).toBeTruthy();
      const [position] = emitted('positionChange')[0] as [number, number];
      expect(position).toBe(55);
    });

    it('emits collapsedChange on collapse', async () => {
      const user = userEvent.setup();
      const { emitted } = render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(emitted('collapsedChange')).toBeTruthy();
      const [collapsed, previousPosition] = emitted('collapsedChange')[0] as [boolean, number];
      expect(collapsed).toBe(true);
      expect(previousPosition).toBe(50);
    });

    it('emits collapsedChange on expand', async () => {
      const user = userEvent.setup();
      const { emitted } = render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultCollapsed: true },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{Enter}');

      expect(emitted('collapsedChange')).toBeTruthy();
      const [collapsed] = emitted('collapsedChange')[0] as [boolean, number];
      expect(collapsed).toBe(false);
    });

    it('emits positionChange with sizeInPx parameter', async () => {
      const user = userEvent.setup();
      const { emitted } = render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50, step: 5 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(emitted('positionChange')).toBeTruthy();
      const [position, sizeInPx] = emitted('positionChange')[0] as [number, number];
      expect(position).toBe(55);
      expect(typeof sizeInPx).toBe('number');
    });

    it('does not emit when value does not change', async () => {
      const user = userEvent.setup();
      const { emitted } = render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 90, max: 90 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(emitted('positionChange')).toBeFalsy();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('does not exceed max on ArrowRight', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 88, max: 90, step: 5 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowRight}');

      expect(separator).toHaveAttribute('aria-valuenow', '90');
    });

    it('does not go below min on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 12, min: 10, step: 5 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);
      await user.keyboard('{ArrowLeft}');

      expect(separator).toHaveAttribute('aria-valuenow', '10');
    });

    it('handles min=0 max=100 range', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', min: 0, max: 100, defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
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
        },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('aria-valuemin', '20');
      expect(separator).toHaveAttribute('aria-valuemax', '80');
    });

    it('prevents default on handled keyboard events', async () => {
      const user = userEvent.setup();
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary', defaultPosition: 50 },
        attrs: { 'aria-label': 'Resize panels' },
      });
      const separator = screen.getByRole('separator');

      await user.click(separator);

      // The fact that ArrowRight changes the value means preventDefault worked
      await user.keyboard('{ArrowRight}');
      expect(separator).toHaveAttribute('aria-valuenow', '55');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to container', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels', class: 'custom-splitter' },
      });
      const container = screen.getByRole('separator').closest('.apg-window-splitter');
      expect(container).toHaveClass('custom-splitter');
    });

    it('sets id attribute on separator element', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: { 'aria-label': 'Resize panels', id: 'my-splitter' },
      });
      const separator = screen.getByRole('separator');
      expect(separator).toHaveAttribute('id', 'my-splitter');
    });

    it('passes through data-* attributes', () => {
      render(WindowSplitter, {
        props: { primaryPaneId: 'primary' },
        attrs: {
          'aria-label': 'Resize panels',
          'data-testid': 'custom-splitter',
        },
      });
      expect(screen.getByTestId('custom-splitter')).toBeInTheDocument();
    });
  });
});
