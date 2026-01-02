import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Tabs, type TabItem } from './Tabs';

// テスト用のタブデータ
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
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: キーボード操作 (Horizontal)', () => {
    describe('Automatic Activation', () => {
      it('ArrowRight で次のタブに移動・選択する', async () => {
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

      it('ArrowLeft で前のタブに移動・選択する', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} defaultSelectedId="tab2" />);

        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        tab2.focus();

        await user.keyboard('{ArrowLeft}');

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        expect(tab1).toHaveFocus();
        expect(tab1).toHaveAttribute('aria-selected', 'true');
      });

      it('ArrowRight で最後から最初にループする', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} defaultSelectedId="tab3" />);

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        tab3.focus();

        await user.keyboard('{ArrowRight}');

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        expect(tab1).toHaveFocus();
        expect(tab1).toHaveAttribute('aria-selected', 'true');
      });

      it('ArrowLeft で最初から最後にループする', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowLeft}');

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        expect(tab3).toHaveFocus();
        expect(tab3).toHaveAttribute('aria-selected', 'true');
      });

      it('Home で最初のタブに移動・選択する', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} defaultSelectedId="tab3" />);

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        tab3.focus();

        await user.keyboard('{Home}');

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        expect(tab1).toHaveFocus();
        expect(tab1).toHaveAttribute('aria-selected', 'true');
      });

      it('End で最後のタブに移動・選択する', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{End}');

        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        expect(tab3).toHaveFocus();
        expect(tab3).toHaveAttribute('aria-selected', 'true');
      });

      it('disabled タブをスキップして次の有効なタブに移動する', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={tabsWithDisabled} />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowRight}');

        // Tab 2 はスキップされ、Tab 3 に移動
        const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
        expect(tab3).toHaveFocus();
        expect(tab3).toHaveAttribute('aria-selected', 'true');
      });
    });

    describe('Manual Activation', () => {
      it('矢印キーでフォーカス移動するがパネルは切り替わらない', async () => {
        const user = userEvent.setup();
        render(<Tabs tabs={defaultTabs} activation="manual" />);

        const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
        tab1.focus();

        await user.keyboard('{ArrowRight}');

        const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
        expect(tab2).toHaveFocus();
        // パネルは切り替わらない
        expect(tab1).toHaveAttribute('aria-selected', 'true');
        expect(tab2).toHaveAttribute('aria-selected', 'false');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 1');
      });

      it('Enter でフォーカス中のタブを選択する', async () => {
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

      it('Space でフォーカス中のタブを選択する', async () => {
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

  describe('APG: キーボード操作 (Vertical)', () => {
    it('ArrowDown で次のタブに移動・選択する', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} orientation="vertical" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await user.keyboard('{ArrowDown}');

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveFocus();
      expect(tab2).toHaveAttribute('aria-selected', 'true');
    });

    it('ArrowUp で前のタブに移動・選択する', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} orientation="vertical" defaultSelectedId="tab2" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      tab2.focus();

      await user.keyboard('{ArrowUp}');

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveFocus();
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });

    it('ArrowDown/Up でループする', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} orientation="vertical" defaultSelectedId="tab3" />);

      const tab3 = screen.getByRole('tab', { name: 'Tab 3' });
      tab3.focus();

      await user.keyboard('{ArrowDown}');

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveFocus();
    });
  });

  describe('APG: ARIA 属性', () => {
    it('tablist が role="tablist" を持つ', () => {
      render(<Tabs tabs={defaultTabs} />);
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('各タブが role="tab" を持つ', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3);
    });

    it('各パネルが role="tabpanel" を持つ', () => {
      render(<Tabs tabs={defaultTabs} />);
      // 選択中のパネルのみ表示
      expect(screen.getByRole('tabpanel')).toBeInTheDocument();
    });

    it('選択中タブが aria-selected="true"、非選択が "false"', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
      expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
      expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('選択中タブの aria-controls がパネル id と一致', () => {
      render(<Tabs tabs={defaultTabs} />);
      const selectedTab = screen.getByRole('tab', { name: 'Tab 1' });
      const tabpanel = screen.getByRole('tabpanel');

      const ariaControls = selectedTab.getAttribute('aria-controls');
      expect(ariaControls).toBe(tabpanel.id);
    });

    it('パネルの aria-labelledby がタブ id と一致', () => {
      render(<Tabs tabs={defaultTabs} />);
      const selectedTab = screen.getByRole('tab', { name: 'Tab 1' });
      const tabpanel = screen.getByRole('tabpanel');

      const ariaLabelledby = tabpanel.getAttribute('aria-labelledby');
      expect(ariaLabelledby).toBe(selectedTab.id);
    });

    it('aria-orientation が orientation prop を反映する', () => {
      const { rerender } = render(<Tabs tabs={defaultTabs} />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');

      rerender(<Tabs tabs={defaultTabs} orientation="vertical" />);
      expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
    });
  });

  describe('APG: フォーカス管理 (Roving Tabindex)', () => {
    it('Automatic: 選択中タブのみ tabIndex=0', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabs = screen.getAllByRole('tab');

      expect(tabs[0]).toHaveAttribute('tabIndex', '0');
      expect(tabs[1]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
    });

    it('Manual: フォーカス中タブが tabIndex=0', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} activation="manual" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await user.keyboard('{ArrowRight}');

      const tabs = screen.getAllByRole('tab');
      // Manual では選択中ではなくフォーカス中のタブが tabIndex=0
      expect(tabs[0]).toHaveAttribute('tabIndex', '-1');
      expect(tabs[1]).toHaveAttribute('tabIndex', '0');
      expect(tabs[2]).toHaveAttribute('tabIndex', '-1');
    });

    it('Tab キーで tabpanel に移動できる', async () => {
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      tab1.focus();

      await user.tab();

      expect(screen.getByRole('tabpanel')).toHaveFocus();
    });

    it('tabpanel が tabIndex=0 でフォーカス可能', () => {
      render(<Tabs tabs={defaultTabs} />);
      const tabpanel = screen.getByRole('tabpanel');
      expect(tabpanel).toHaveAttribute('tabIndex', '0');
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('axe による WCAG 2.1 AA 違反がない', async () => {
      const { container } = render(<Tabs tabs={defaultTabs} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Props', () => {
    it('defaultSelectedId で初期選択タブを指定できる', () => {
      render(<Tabs tabs={defaultTabs} defaultSelectedId="tab2" />);

      const tab2 = screen.getByRole('tab', { name: 'Tab 2' });
      expect(tab2).toHaveAttribute('aria-selected', 'true');
      expect(screen.getByRole('tabpanel')).toHaveTextContent('Content 2');
    });

    it('onSelectionChange がタブ選択時に呼び出される', async () => {
      const handleSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(<Tabs tabs={defaultTabs} onSelectionChange={handleSelectionChange} />);

      await user.click(screen.getByRole('tab', { name: 'Tab 2' }));

      expect(handleSelectionChange).toHaveBeenCalledWith('tab2');
    });
  });

  describe('異常系', () => {
    it('defaultSelectedId が存在しない場合、最初のタブが選択される', () => {
      render(<Tabs tabs={defaultTabs} defaultSelectedId="nonexistent" />);

      const tab1 = screen.getByRole('tab', { name: 'Tab 1' });
      expect(tab1).toHaveAttribute('aria-selected', 'true');
    });
  });

  // 🟢 Low Priority: 拡張性
  describe('HTML 属性継承', () => {
    it('className がコンテナに適用される', () => {
      const { container } = render(<Tabs tabs={defaultTabs} className="custom-tabs" />);
      const tabsContainer = container.firstChild as HTMLElement;
      expect(tabsContainer).toHaveClass('custom-tabs');
    });
  });
});
