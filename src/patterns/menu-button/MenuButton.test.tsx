import { act, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MenuButton, type MenuItem } from './MenuButton';

afterEach(() => {
  vi.useRealTimers();
});

// テスト用のデフォルトアイテム
const defaultItems: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
];

// disabled アイテムを含むテスト用アイテム
const itemsWithDisabled: MenuItem[] = [
  { id: 'cut', label: 'Cut', disabled: true },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
];

// 全て disabled のテスト用アイテム
const allDisabledItems: MenuItem[] = [
  { id: 'cut', label: 'Cut', disabled: true },
  { id: 'copy', label: 'Copy', disabled: true },
  { id: 'paste', label: 'Paste', disabled: true },
];

// タイプアヘッド用のテストアイテム
const typeAheadItems: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'clear', label: 'Clear' },
  { id: 'edit', label: 'Edit' },
];

describe('MenuButton', () => {
  // 🔴 High Priority: APG マウス操作
  describe('APG: マウス操作', () => {
    it('ボタンクリックでメニューが開く', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).not.toHaveAttribute('hidden');
    });

    it('開いた状態でボタンクリックでメニューが閉じる (トグル)', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('メニューアイテムクリックで実行、メニューが閉じる', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(<MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const menuItem = screen.getByRole('menuitem', { name: 'Copy' });
      await user.click(menuItem);

      expect(onItemSelect).toHaveBeenCalledWith('copy');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('disabled アイテムクリックでは何も起こらない', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(<MenuButton items={itemsWithDisabled} label="Actions" onItemSelect={onItemSelect} />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const disabledItem = screen.getByRole('menuitem', { name: 'Cut' });
      await user.click(disabledItem);

      expect(onItemSelect).not.toHaveBeenCalled();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('メニュー外クリックでメニューが閉じる', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <MenuButton items={defaultItems} label="Actions" />
          <button>Outside</button>
        </div>
      );

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.click(screen.getByRole('button', { name: 'Outside' }));
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });
  });

  // 🔴 High Priority: APG キーボード操作 (ボタン)
  describe('APG: キーボード操作 (ボタン)', () => {
    it('Enter でメニューが開き、最初の有効アイテムにフォーカス', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard('{Enter}');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('Space でメニューが開き、最初の有効アイテムにフォーカス', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard(' ');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('ArrowDown でメニューが開き、最初の有効アイテムにフォーカス', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard('{ArrowDown}');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('ArrowUp でメニューが開き、最後の有効アイテムにフォーカス', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      button.focus();
      await user.keyboard('{ArrowUp}');

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: APG キーボード操作 (メニュー)
  describe('APG: キーボード操作 (メニュー)', () => {
    it('ArrowDown で次の有効アイテムに移動', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });

    it('ArrowDown で最後から最初にループ', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const lastItem = screen.getByRole('menuitem', { name: 'Paste' });
      lastItem.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('ArrowUp で前の有効アイテムに移動', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const secondItem = screen.getByRole('menuitem', { name: 'Copy' });
      secondItem.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('ArrowUp で最初から最後にループ', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
    });

    it('Home で最初の有効アイテムに移動 (disabled スキップ)', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={itemsWithDisabled} label="Actions" defaultOpen />);

      const lastItem = screen.getByRole('menuitem', { name: 'Paste' });
      lastItem.focus();
      await user.keyboard('{Home}');

      // Cut is disabled, so focus should go to Copy
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });

    it('End で最後の有効アイテムに移動 (disabled スキップ)', async () => {
      const user = userEvent.setup();
      const itemsWithLastDisabled: MenuItem[] = [
        { id: 'cut', label: 'Cut' },
        { id: 'copy', label: 'Copy' },
        { id: 'paste', label: 'Paste', disabled: true },
      ];
      render(<MenuButton items={itemsWithLastDisabled} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{End}');

      // Paste is disabled, so focus should go to Copy
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();
    });

    it('ArrowDown/Up で disabled アイテムをスキップ', async () => {
      const user = userEvent.setup();
      const itemsWithMiddleDisabled: MenuItem[] = [
        { id: 'cut', label: 'Cut' },
        { id: 'copy', label: 'Copy', disabled: true },
        { id: 'paste', label: 'Paste' },
      ];
      render(<MenuButton items={itemsWithMiddleDisabled} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('{ArrowDown}');

      // Copy is disabled, so focus should skip to Paste
      expect(screen.getByRole('menuitem', { name: 'Paste' })).toHaveFocus();
    });

    it('Escape でメニューを閉じ、ボタンにフォーカス', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Escape}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(button).toHaveFocus();
    });

    it('Tab でメニューを閉じ、フォーカス移動', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <MenuButton items={defaultItems} label="Actions" />
          <button>Next</button>
        </div>
      );

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{Tab}');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('Enter でアイテムを実行、メニューを閉じる', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} defaultOpen />
      );

      const item = screen.getByRole('menuitem', { name: 'Copy' });
      item.focus();
      await user.keyboard('{Enter}');

      expect(onItemSelect).toHaveBeenCalledWith('copy');
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    it('Space でアイテムを実行、メニューを閉じる (スクロール防止)', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(
        <MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} defaultOpen />
      );

      const item = screen.getByRole('menuitem', { name: 'Copy' });
      item.focus();
      await user.keyboard(' ');

      expect(onItemSelect).toHaveBeenCalledWith('copy');
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });
  });

  // 🔴 High Priority: タイプアヘッド
  describe('APG: タイプアヘッド', () => {
    it('文字キーでマッチするアイテムにフォーカス', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('e');

      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });

    it('複数文字入力でマッチ (例: "cl" → "Clear")', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('cl');

      expect(screen.getByRole('menuitem', { name: 'Clear' })).toHaveFocus();
    });

    it('同じ文字連打でマッチをサイクル', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();

      // First 'c' -> Cut (already focused, or next match)
      await user.keyboard('c');
      // Items starting with 'c': Cut, Copy, Clear
      // After first 'c' from Cut, should go to Copy
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();

      await user.keyboard('c');
      expect(screen.getByRole('menuitem', { name: 'Clear' })).toHaveFocus();

      await user.keyboard('c');
      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('タイプアヘッドで disabled アイテムをスキップ', async () => {
      const user = userEvent.setup();
      const itemsWithDisabledMatch: MenuItem[] = [
        { id: 'cut', label: 'Cut' },
        { id: 'copy', label: 'Copy', disabled: true },
        { id: 'clear', label: 'Clear' },
      ];
      render(<MenuButton items={itemsWithDisabledMatch} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('c');

      // Copy is disabled, so should skip to Clear
      expect(screen.getByRole('menuitem', { name: 'Clear' })).toHaveFocus();
    });

    it('マッチなしの場合フォーカス変更なし', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      firstItem.focus();
      await user.keyboard('z');

      expect(screen.getByRole('menuitem', { name: 'Cut' })).toHaveFocus();
    });

    it('500ms 後にバッファリセット', () => {
      vi.useFakeTimers();
      render(<MenuButton items={typeAheadItems} label="Actions" defaultOpen />);

      const firstItem = screen.getByRole('menuitem', { name: 'Cut' });
      act(() => {
        firstItem.focus();
      });

      // Type 'c' -> moves to Copy
      act(() => {
        fireEvent.keyDown(firstItem, { key: 'c' });
      });
      expect(screen.getByRole('menuitem', { name: 'Copy' })).toHaveFocus();

      // Wait for buffer reset (500ms)
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // After reset, 'e' should match 'Edit' (not 'ce')
      const copyItem = screen.getByRole('menuitem', { name: 'Copy' });
      act(() => {
        fireEvent.keyDown(copyItem, { key: 'e' });
      });
      expect(screen.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: APG ARIA 属性
  describe('APG: ARIA 属性', () => {
    it('ボタンが aria-haspopup="menu" を持つ', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-haspopup',
        'menu'
      );
    });

    it('閉じた状態で aria-expanded="false"', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'false'
      );
    });

    it('開いた状態で aria-expanded="true"', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      expect(screen.getByRole('button', { name: 'Actions' })).toHaveAttribute(
        'aria-expanded',
        'true'
      );
    });

    it('ボタンが aria-controls でメニューを常に参照', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      const button = screen.getByRole('button', { name: 'Actions' });
      const menuId = button.getAttribute('aria-controls');

      expect(menuId).toBeTruthy();
      expect(document.getElementById(menuId!)).toHaveAttribute('role', 'menu');
    });

    it('メニューが role="menu" を持つ', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('メニューが aria-labelledby でボタンを参照', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const menu = screen.getByRole('menu');
      const labelledbyId = menu.getAttribute('aria-labelledby');

      expect(labelledbyId).toBeTruthy();
      expect(document.getElementById(labelledbyId!)).toHaveAttribute('aria-haspopup', 'menu');
    });

    it('アイテムが role="menuitem" を持つ', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const menuItems = screen.getAllByRole('menuitem');

      expect(menuItems).toHaveLength(3);
    });

    it('disabled アイテムが aria-disabled="true"', () => {
      render(<MenuButton items={itemsWithDisabled} label="Actions" defaultOpen />);
      const disabledItem = screen.getByRole('menuitem', { name: 'Cut' });

      expect(disabledItem).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // 🔴 High Priority: フォーカス管理
  describe('APG: フォーカス管理', () => {
    it('フォーカスアイテムが tabindex="0"', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const focusedItem = screen.getByRole('menuitem', { name: 'Cut' });
      expect(focusedItem).toHaveAttribute('tabindex', '0');
    });

    it('他アイテムが tabindex="-1"', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const otherItems = screen
        .getAllByRole('menuitem')
        .filter((item) => item.textContent !== 'Cut');
      otherItems.forEach((item) => {
        expect(item).toHaveAttribute('tabindex', '-1');
      });
    });

    it('disabled アイテムが tabindex="-1"', () => {
      render(<MenuButton items={itemsWithDisabled} label="Actions" defaultOpen />);
      const disabledItem = screen.getByRole('menuitem', { name: 'Cut' });

      expect(disabledItem).toHaveAttribute('tabindex', '-1');
    });

    it('メニュー閉じでフォーカスがボタンに戻る', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={defaultItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const item = screen.getByRole('menuitem', { name: 'Copy' });
      await user.click(item);

      expect(button).toHaveFocus();
    });

    it('閉じた状態でメニューが inert + hidden', () => {
      render(<MenuButton items={defaultItems} label="Actions" />);
      const menu = screen.getByRole('menu', { hidden: true });

      expect(menu).toHaveAttribute('hidden');
      expect(menu).toHaveAttribute('inert');
    });
  });

  // 🔴 High Priority: エッジケース
  describe('エッジケース', () => {
    it('全アイテム disabled の場合、メニューは開くがフォーカスはボタンに留まる', async () => {
      const user = userEvent.setup();
      render(<MenuButton items={allDisabledItems} label="Actions" />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveFocus();
    });

    it('空の items 配列でもクラッシュしない', () => {
      expect(() => {
        render(<MenuButton items={[]} label="Actions" />);
      }).not.toThrow();

      expect(screen.getByRole('button', { name: 'Actions' })).toBeInTheDocument();
    });

    it('複数インスタンスで ID が衝突しない', () => {
      render(
        <>
          <MenuButton items={defaultItems} label="Actions 1" />
          <MenuButton items={defaultItems} label="Actions 2" />
        </>
      );

      const button1 = screen.getByRole('button', { name: 'Actions 1' });
      const button2 = screen.getByRole('button', { name: 'Actions 2' });

      const menuId1 = button1.getAttribute('aria-controls');
      const menuId2 = button2.getAttribute('aria-controls');

      expect(menuId1).not.toBe(menuId2);
    });
  });

  // 🟡 Medium Priority: アクセシビリティ検証
  describe('アクセシビリティ', () => {
    it('閉じた状態で axe 違反なし', async () => {
      const { container } = render(<MenuButton items={defaultItems} label="Actions" />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });

    it('開いた状態で axe 違反なし', async () => {
      const { container } = render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const results = await axe(container);

      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props / 動作
  describe('Props', () => {
    it('defaultOpen=true で初期表示', () => {
      render(<MenuButton items={defaultItems} label="Actions" defaultOpen />);
      const button = screen.getByRole('button', { name: 'Actions' });

      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('menu')).not.toHaveAttribute('hidden');
    });

    it('className がコンテナに適用', () => {
      const { container } = render(
        <MenuButton items={defaultItems} label="Actions" className="custom-class" />
      );

      expect(container.querySelector('.apg-menu-button')).toHaveClass('custom-class');
    });

    it('onItemSelect が正しい id で呼ばれる', async () => {
      const user = userEvent.setup();
      const onItemSelect = vi.fn();
      render(<MenuButton items={defaultItems} label="Actions" onItemSelect={onItemSelect} />);

      const button = screen.getByRole('button', { name: 'Actions' });
      await user.click(button);

      const item = screen.getByRole('menuitem', { name: 'Paste' });
      await user.click(item);

      expect(onItemSelect).toHaveBeenCalledWith('paste');
      expect(onItemSelect).toHaveBeenCalledTimes(1);
    });
  });
});
