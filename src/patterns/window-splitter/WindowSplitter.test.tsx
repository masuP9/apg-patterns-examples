import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { WindowSplitter } from './WindowSplitter';

describe('WindowSplitter', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="separator"', () => {
      render(<WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has aria-valuenow representing primary pane percentage', () => {
      render(
        <WindowSplitter primaryPaneId="primary" defaultPosition={50} aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('has aria-valuenow set to defaultPosition (default: 50)', () => {
      render(<WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('has aria-valuenow="0" when collapsed', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter primaryPaneId="primary" defaultPosition={50} aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}');

      expect(splitter).toHaveAttribute('aria-valuenow', '0');
    });

    it('has aria-valuenow="0" when defaultCollapsed is true', () => {
      render(
        <WindowSplitter primaryPaneId="primary" defaultCollapsed aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuenow', '0');
    });

    it('has aria-valuemin set (default: 10)', () => {
      render(<WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuemin', '10');
    });

    it('has aria-valuemax set (default: 90)', () => {
      render(<WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuemax', '90');
    });

    it('has custom aria-valuemin when provided', () => {
      render(<WindowSplitter primaryPaneId="primary" min={20} aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuemin', '20');
    });

    it('has custom aria-valuemax when provided', () => {
      render(<WindowSplitter primaryPaneId="primary" max={80} aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuemax', '80');
    });

    it('has aria-controls referencing primary pane', () => {
      render(<WindowSplitter primaryPaneId="main-panel" aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-controls', 'main-panel');
    });

    it('has aria-controls with multiple IDs when secondaryPaneId provided', () => {
      render(
        <WindowSplitter
          primaryPaneId="primary"
          secondaryPaneId="secondary"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-controls', 'primary secondary');
    });

    it('does not have aria-orientation for horizontal splitter (default)', () => {
      render(<WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).not.toHaveAttribute('aria-orientation');
    });

    it('has aria-orientation="vertical" for vertical splitter', () => {
      render(
        <WindowSplitter primaryPaneId="primary" orientation="vertical" aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('has aria-disabled="true" when disabled', () => {
      render(<WindowSplitter primaryPaneId="primary" disabled aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-disabled', 'true');
    });

    // Note: aria-readonly is not a valid attribute for role="separator"
    // Readonly behavior is enforced via JavaScript only
  });

  // 🔴 High Priority: Accessible Name
  describe('Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(<WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />);
      expect(screen.getByRole('separator', { name: 'Resize panels' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <>
          <span id="splitter-label">Adjust panel size</span>
          <WindowSplitter primaryPaneId="primary" aria-labelledby="splitter-label" />
        </>
      );
      expect(screen.getByRole('separator', { name: 'Adjust panel size' })).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Horizontal Splitter
  describe('Keyboard Interaction - Horizontal Splitter', () => {
    it('increases value by step on ArrowRight', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(splitter).toHaveAttribute('aria-valuenow', '55');
    });

    it('decreases value by step on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowLeft}');

      expect(splitter).toHaveAttribute('aria-valuenow', '45');
    });

    it('ArrowUp does nothing on horizontal splitter', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          orientation="horizontal"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowUp}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('ArrowDown does nothing on horizontal splitter', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          orientation="horizontal"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowDown}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('increases value by largeStep on Shift+ArrowRight', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          largeStep={10}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(splitter).toHaveAttribute('aria-valuenow', '60');
    });

    it('decreases value by largeStep on Shift+ArrowLeft', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          largeStep={10}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Shift>}{ArrowLeft}{/Shift}');

      expect(splitter).toHaveAttribute('aria-valuenow', '40');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Vertical Splitter
  describe('Keyboard Interaction - Vertical Splitter', () => {
    it('increases value by step on ArrowUp', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          orientation="vertical"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowUp}');

      expect(splitter).toHaveAttribute('aria-valuenow', '55');
    });

    it('decreases value by step on ArrowDown', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          orientation="vertical"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowDown}');

      expect(splitter).toHaveAttribute('aria-valuenow', '45');
    });

    it('ArrowLeft does nothing on vertical splitter', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          orientation="vertical"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowLeft}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('ArrowRight does nothing on vertical splitter', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          orientation="vertical"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('increases value by largeStep on Shift+ArrowUp', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          largeStep={10}
          orientation="vertical"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Shift>}{ArrowUp}{/Shift}');

      expect(splitter).toHaveAttribute('aria-valuenow', '60');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Collapse/Expand
  describe('Keyboard Interaction - Collapse/Expand', () => {
    it('collapses on Enter (aria-valuenow becomes 0)', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter primaryPaneId="primary" defaultPosition={50} aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}');

      expect(splitter).toHaveAttribute('aria-valuenow', '0');
    });

    it('expands to previous value on Enter after collapse', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter primaryPaneId="primary" defaultPosition={50} aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}'); // Collapse → 0
      await user.keyboard('{Enter}'); // Expand → 50

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('expands to expandedPosition when initially collapsed', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultCollapsed
          expandedPosition={60}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}'); // Expand → 60

      expect(splitter).toHaveAttribute('aria-valuenow', '60');
    });

    it('expands to defaultPosition when initially collapsed without expandedPosition', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultCollapsed
          defaultPosition={40}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}'); // Expand → 40

      expect(splitter).toHaveAttribute('aria-valuenow', '40');
    });

    it('does not collapse when collapsible is false', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          collapsible={false}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('restores correct value after multiple collapse/expand cycles', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}'); // 55
      await user.keyboard('{Enter}'); // Collapse → 0
      await user.keyboard('{Enter}'); // Expand → 55

      expect(splitter).toHaveAttribute('aria-valuenow', '55');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Home/End
  describe('Keyboard Interaction - Home/End', () => {
    it('sets min value on Home', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          min={10}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Home}');

      expect(splitter).toHaveAttribute('aria-valuenow', '10');
    });

    it('sets max value on End', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          max={90}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{End}');

      expect(splitter).toHaveAttribute('aria-valuenow', '90');
    });

    it('does not exceed max on ArrowRight', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={85}
          max={90}
          step={10}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(splitter).toHaveAttribute('aria-valuenow', '90');
    });

    it('does not go below min on ArrowLeft', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={15}
          min={10}
          step={10}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowLeft}');

      expect(splitter).toHaveAttribute('aria-valuenow', '10');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - RTL
  describe('Keyboard Interaction - RTL', () => {
    it('ArrowLeft increases value in RTL mode', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          dir="rtl"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowLeft}');

      expect(splitter).toHaveAttribute('aria-valuenow', '55');
    });

    it('ArrowRight decreases value in RTL mode', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          dir="rtl"
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(splitter).toHaveAttribute('aria-valuenow', '45');
    });
  });

  // 🔴 High Priority: Keyboard Interaction - Disabled/Readonly
  describe('Keyboard Interaction - Disabled/Readonly', () => {
    it('does not change value when disabled', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          disabled
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      splitter.focus();
      await user.keyboard('{ArrowRight}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not change value when readonly', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          readonly
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });

    it('does not collapse when disabled', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          disabled
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      splitter.focus();
      await user.keyboard('{Enter}');

      expect(splitter).toHaveAttribute('aria-valuenow', '50');
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('has tabindex="0" on splitter', () => {
      render(<WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('tabindex', '0');
    });

    it('has tabindex="-1" when disabled', () => {
      render(<WindowSplitter primaryPaneId="primary" disabled aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('tabindex', '-1');
    });

    it('has tabindex="0" when readonly (focusable but not operable)', () => {
      render(<WindowSplitter primaryPaneId="primary" readonly aria-label="Resize panels" />);
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('tabindex', '0');
    });

    it('is focusable via Tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <WindowSplitter primaryPaneId="primary" aria-label="Resize panels" />
          <button>After</button>
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Focus splitter

      expect(screen.getByRole('separator')).toHaveFocus();
    });

    it('is not focusable via Tab when disabled', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <WindowSplitter primaryPaneId="primary" disabled aria-label="Resize panels" />
          <button>After</button>
        </>
      );

      await user.tab(); // Focus "Before" button
      await user.tab(); // Skip splitter, focus "After" button

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('focus remains on splitter after collapse', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter primaryPaneId="primary" defaultPosition={50} aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}'); // Collapse

      expect(splitter).toHaveFocus();
    });
  });

  // 🟡 Medium Priority: Pointer Interaction
  describe('Pointer Interaction', () => {
    it('updates position on pointer down', () => {
      const handleChange = vi.fn();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          onPositionChange={handleChange}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      fireEvent.pointerDown(splitter, { clientX: 100, clientY: 100 });

      // Focus should be on splitter
      expect(splitter).toHaveFocus();
    });

    it('does not respond to pointer when disabled', () => {
      const handleChange = vi.fn();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          disabled
          onPositionChange={handleChange}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      fireEvent.pointerDown(splitter, { clientX: 100, clientY: 100 });

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not respond to pointer when readonly', () => {
      const handleChange = vi.fn();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          readonly
          onPositionChange={handleChange}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      fireEvent.pointerDown(splitter, { clientX: 100, clientY: 100 });

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    // Helper: Render with pane elements for aria-controls validation
    const renderWithPanes = (
      splitterProps: Partial<Parameters<typeof WindowSplitter>[0]> & {
        'aria-label'?: string;
        'aria-labelledby'?: string;
      }
    ) => {
      return render(
        <>
          <div id="primary">Primary Pane</div>
          <WindowSplitter primaryPaneId="primary" {...splitterProps} />
          <div id="secondary">Secondary Pane</div>
        </>
      );
    };

    it('has no axe violations', async () => {
      const { container } = renderWithPanes({ 'aria-label': 'Resize panels' });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <span id="label">Resize panels</span>
          <div id="primary">Primary Pane</div>
          <WindowSplitter primaryPaneId="primary" aria-labelledby="label" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = renderWithPanes({
        disabled: true,
        'aria-label': 'Resize panels',
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when collapsed', async () => {
      const { container } = renderWithPanes({
        defaultCollapsed: true,
        'aria-label': 'Resize panels',
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations for vertical splitter', async () => {
      const { container } = renderWithPanes({
        orientation: 'vertical',
        'aria-label': 'Resize panels',
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Callbacks
  describe('Callbacks', () => {
    it('calls onPositionChange on keyboard interaction', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          step={5}
          onPositionChange={handleChange}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(handleChange).toHaveBeenCalled();
      expect(handleChange.mock.calls[0][0]).toBe(55);
    });

    it('calls onCollapsedChange on collapse', async () => {
      const handleCollapse = vi.fn();
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          onCollapsedChange={handleCollapse}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}');

      expect(handleCollapse).toHaveBeenCalledWith(true, 50);
    });

    it('calls onCollapsedChange on expand', async () => {
      const handleCollapse = vi.fn();
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultCollapsed
          defaultPosition={50}
          onCollapsedChange={handleCollapse}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}'); // Expand

      expect(handleCollapse).toHaveBeenCalledWith(false, 0);
    });

    it('does not call onPositionChange when disabled', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={50}
          disabled
          onPositionChange={handleChange}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      splitter.focus();
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('does not call onPositionChange when value does not change', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={90}
          max={90}
          step={5}
          onPositionChange={handleChange}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('clamps defaultPosition to min', () => {
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={5}
          min={10}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuenow', '10');
    });

    it('clamps defaultPosition to max', () => {
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultPosition={95}
          max={90}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-valuenow', '90');
    });

    it('clamps expandedPosition to min/max', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter
          primaryPaneId="primary"
          defaultCollapsed
          expandedPosition={95}
          max={90}
          aria-label="Resize panels"
        />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Enter}'); // Expand

      expect(splitter).toHaveAttribute('aria-valuenow', '90');
    });

    it('uses default step of 5', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter primaryPaneId="primary" defaultPosition={50} aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{ArrowRight}');

      expect(splitter).toHaveAttribute('aria-valuenow', '55');
    });

    it('uses default largeStep of 10', async () => {
      const user = userEvent.setup();
      render(
        <WindowSplitter primaryPaneId="primary" defaultPosition={50} aria-label="Resize panels" />
      );
      const splitter = screen.getByRole('separator');

      await user.click(splitter);
      await user.keyboard('{Shift>}{ArrowRight}{/Shift}');

      expect(splitter).toHaveAttribute('aria-valuenow', '60');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      render(
        <WindowSplitter
          primaryPaneId="primary"
          aria-label="Resize panels"
          className="custom-splitter"
        />
      );
      const container = screen.getByRole('separator').closest('.apg-window-splitter');
      expect(container).toHaveClass('custom-splitter');
    });

    it('sets id attribute on splitter element', () => {
      render(
        <WindowSplitter primaryPaneId="primary" aria-label="Resize panels" id="my-splitter" />
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('id', 'my-splitter');
    });

    it('supports aria-describedby', () => {
      render(
        <>
          <WindowSplitter
            primaryPaneId="primary"
            aria-label="Resize panels"
            aria-describedby="desc"
          />
          <p id="desc">Use arrow keys to resize, Enter to collapse</p>
        </>
      );
      const splitter = screen.getByRole('separator');
      expect(splitter).toHaveAttribute('aria-describedby', 'desc');
    });
  });
});
