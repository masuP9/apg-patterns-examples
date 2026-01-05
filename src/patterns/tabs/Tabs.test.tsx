import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabItem } from './Tabs';

// Test tab data
const defaultTabs: TabItem[] = [
  { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
  { id: 'tab2', label: 'Tab 2', content: 'Content 2' },
  { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
];

const tabsWithDisabled: TabItem[] = [
  { id: 'tab1', label: 'Tab 1', content: 'Content 1' },
  { id: 'tab2', label: 'Tab 2', content: 'Content 2', disabled: true },
  { id: 'tab3', label: 'Tab 3', content: 'Content 3' },
];

describe('Tabs', () => {
  // 🔴 High Priority: APG Core Compliance
  describe('APG: Keyboard Interaction (Horizontal)', () => {
    describe('Automatic Activation', () => {
      it('moves to and selects next tab with ArrowRight', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowRight}');

        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        expect(tab2).toHaveFocus();
        expect(tab2).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
      });

      it('moves to and selects previous tab with ArrowLeft', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} defaultSelectedId="tab2" />);

        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        tab2.focus();

        await user.keyboard('{ArrowLeft}');

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        expect(tab1).toHaveFocus();
        expect(tab1).toHaveAttribute('aria-selected', 'true');
      });

      it('loops from last to first with ArrowRight', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} defaultSelectedId="tab3" />);

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        tab3.focus();

        await user.keyboard('{ArrowRight}');

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        expect(tab1).toHaveFocus();
        expect(tab1).toHaveAttribute('aria-selected', 'true');
      });

      it('loops from first to last with ArrowLeft', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowLeft}');

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        expect(tab3).toHaveFocus();
        expect(tab3).toHaveAttribute('aria-selected', 'true');
      });

      it('moves to and selects first tab with Home', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} defaultSelectedId="tab3" />);

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        tab3.focus();

        await user.keyboard('{Home}');

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        expect(tab1).toHaveFocus();
        expect(tab1).toHaveAttribute('aria-selected', 'true');
      });

      it('moves to and selects last tab with End', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{End}');

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        expect(tab3).toHaveFocus();
        expect(tab3).toHaveAttribute('aria-selected', 'true');
      });

      it('skips disabled tab and moves to next enabled tab', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={tabsWithDisabled} />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowRight}');

        // Tab 2 is skipped, moves to Tab 3
        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        expect(tab3).toHaveFocus();
        expect(tab3).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('Manual Activation', () => {
      it('moves focus with arrow keys but does not switch panel', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} activation="manual" />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowRight}');

        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        expect(tab2).toHaveFocus();
        // Panel does not switch
        expect(tab1).toHaveAttribute('aria-selected', 'true');
        expect(tab2).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
      });

      it('selects focused tab with Enter', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} activation="manual" />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowRight}');
        await user.keyboard('{Enter}');

        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        expect(tab2).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
      });

      it('selects focused tab with Space', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} activation="manual" />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowRight}');
        await user.keyboard(' ');

        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        expect(tab2).toHaveAttribute('aria-selected', 'true');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
      });
    });
  });

  describe('APG: Keyboard Interaction (Vertical)', () => {
    it('moves to and selects next tab with ArrowDown', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} orientation="vertical" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await user.keyboard('{ArrowDown}');

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('moves to and selects previous tab with ArrowUp', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} orientation="vertical" defaultSelectedId="tab2" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      await user.keyboard('{ArrowUp}');

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });

    it('loops with ArrowDown/Up', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} orientation="vertical" defaultSelectedId="tab3" />);

      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      tab3.focus();

      await user.keyboard('{ArrowDown}');

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveFocus();
    });
  });

  describe('APG: ARIA Attributes', () => {
    it('tablist has role="tablist"', () => {
      render(<Tabs tabs={defaultTabs} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('each tab has role="tab"', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('each panel has role="tabpanel"', () => {
      render(<Tabs tabs={defaultTabs} />);
      // Only selected panel is displayed
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('selected tab has aria-selected="true", unselected have "false"', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('selected tab aria-controls matches panel id', () => {
      render(<Tabs tabs={defaultTabs} />);
      const selectedTab = screen.getByRole('tab', { name: 'Tab 1' });
      const tabpanel = screen.getByRole('tabpanel');

      const ariaControls = selectedTab.getAttribute('aria-controls');
      expect(ariaControls).toBe(tabpanel.id);
    });

    it('panel aria-labelledby matches tab id', () => {
      render(<Tabs tabs={defaultTabs} />);
      const selectedTab = screen.getByRole('tab', { name: 'Tab 1' });
      const tabpanel = screen.getByRole('tabpanel');

      const ariaLabelledby = tabpanel.getAttribute('aria-labelledby');
      expect(ariaLabelledby).toBe(selectedTab.id);
    });

    it('aria-orientation reflects orientation prop', () => {
      const { rerender } = render(<Tabs tabs={defaultTabs} />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');

      rerender(<Tabs tabs={defaultTabs} orientation="vertical" />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('APG: Focus Management (Roving Tabindex)', () => {
    it('Automatic: only selected tab has tabIndex=0', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
    });

    it('Manual: focused tab has tabIndex=0', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} activation="manual" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await user.keyboard('{ArrowRight}');

      const tabs = screen.getAllByRole('tab');
      // In Manual, focused tab (not selected) has tabIndex=0
      expect(tabs[0]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[1]).toHaveAttribute('tabIndex', '0');
      expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
    });

    it('can move to tabpanel with Tab key', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await user.tab();

      expect(screen.getByRole('tabpanel')).toHaveFocus();
    });

    it('tabpanel is focusable with tabIndex=0', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toHaveAttribute('tabIndex', '0');
    });
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no WCAG 2.1 AA violations', async () => {
      const { container } = render(<Tabs tabs={defaultTabs} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Props', () => {
    it('can specify initial selected tab with defaultSelectedId', () => {
      render(<Tabs tabs={defaultTabs} defaultSelectedId="tab2" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
    });

    it('calls onSelectionChange when tab is selected', async () => {
      const handleSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} onSelectionChange={handleSelectionChange} />);

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleSelectionChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('Edge Cases', () => {
    it('selects first tab when defaultSelectedId does not exist', () => {
      render(<Tabs tabs={defaultTabs} defaultSelectedId="nonexistent" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });
  });

  // 🟢 Low Priority: Extensibility
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      const { container } = render(<Tabs tabs={defaultTabs} className="custom-tabs" />);
      const tabsContainer = container.firstChild as HTMLElement;
      expect(tabsContainer).toHaveClass('custom-tabs');
    });
  });
});
