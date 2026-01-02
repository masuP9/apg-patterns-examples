import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

// Import test wrapper components
import ToolbarTestBasic from './test-wrappers/ToolbarTestBasic.svelte';
import ToolbarTestVertical from './test-wrappers/ToolbarTestVertical.svelte';
import ToolbarTestDisabled from './test-wrappers/ToolbarTestDisabled.svelte';
import ToolbarTestToggle from './test-wrappers/ToolbarTestToggle.svelte';
import ToolbarTestSeparator from './test-wrappers/ToolbarTestSeparator.svelte';
import ToolbarTestSeparatorVertical from './test-wrappers/ToolbarTestSeparatorVertical.svelte';

describe('Toolbar (Svelte)', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('role="toolbar" が設定される', () => {
      render(ToolbarTestBasic);
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('aria-orientation がデフォルトで "horizontal"', () => {
      render(ToolbarTestBasic);
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('aria-orientation が orientation prop を反映する', () => {
      render(ToolbarTestVertical);
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('aria-label が透過される', () => {
      render(ToolbarTestBasic);
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Test toolbar');
    });
  });

  describe('APG: キーボード操作 (Horizontal)', () => {
    it('ArrowRight で次のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(ToolbarTestBasic);

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    });

    it('ArrowLeft で前のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(ToolbarTestBasic);

      const secondButton = screen.getByRole('button', { name: 'Second' });
      secondButton.focus();

      await user.keyboard('{ArrowLeft}');

      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    it('ArrowRight で最後から先頭にラップしない（端で止まる）', async () => {
      const user = userEvent.setup();
      render(ToolbarTestBasic);

      const thirdButton = screen.getByRole('button', { name: 'Third' });
      thirdButton.focus();

      await user.keyboard('{ArrowRight}');

      expect(thirdButton).toHaveFocus();
    });

    it('ArrowLeft で先頭から最後にラップしない（端で止まる）', async () => {
      const user = userEvent.setup();
      render(ToolbarTestBasic);

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowLeft}');

      expect(firstButton).toHaveFocus();
    });

    it('ArrowUp/Down は水平ツールバーでは無効', async () => {
      const user = userEvent.setup();
      render(ToolbarTestBasic);

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowDown}');
      expect(firstButton).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(firstButton).toHaveFocus();
    });

    it('Home で最初のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(ToolbarTestBasic);

      const thirdButton = screen.getByRole('button', { name: 'Third' });
      thirdButton.focus();

      await user.keyboard('{Home}');

      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    it('End で最後のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(ToolbarTestBasic);

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{End}');

      expect(screen.getByRole('button', { name: 'Third' })).toHaveFocus();
    });

    it('disabled アイテムをスキップして移動', async () => {
      const user = userEvent.setup();
      render(ToolbarTestDisabled);

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('button', { name: 'Third' })).toHaveFocus();
    });
  });

  describe('APG: キーボード操作 (Vertical)', () => {
    it('ArrowDown で次のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(ToolbarTestVertical);

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    });

    it('ArrowUp で前のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(ToolbarTestVertical);

      const secondButton = screen.getByRole('button', { name: 'Second' });
      secondButton.focus();

      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    it('ArrowLeft/Right は垂直ツールバーでは無効', async () => {
      const user = userEvent.setup();
      render(ToolbarTestVertical);

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowRight}');
      expect(firstButton).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(firstButton).toHaveFocus();
    });
  });
});

describe('ToolbarButton (Svelte)', () => {
  describe('ARIA 属性', () => {
    it('role="button" が暗黙的に設定される', () => {
      render(ToolbarTestBasic);
      expect(screen.getByRole('button', { name: 'First' })).toBeInTheDocument();
    });

    it('type="button" が設定される', () => {
      render(ToolbarTestBasic);
      expect(screen.getByRole('button', { name: 'First' })).toHaveAttribute('type', 'button');
    });
  });

  describe('機能', () => {
    it('disabled 時はフォーカス対象外（disabled属性で非フォーカス）', () => {
      render(ToolbarTestDisabled);
      const disabledButton = screen.getByRole('button', { name: 'Second (disabled)' });
      expect(disabledButton).toBeDisabled();
    });
  });
});

describe('ToolbarToggleButton (Svelte)', () => {
  describe('ARIA 属性', () => {
    it('aria-pressed="false" が初期状態で設定される', () => {
      render(ToolbarTestToggle);
      expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    });

    it('type="button" が設定される', () => {
      render(ToolbarTestToggle);
      expect(screen.getByRole('button', { name: 'Toggle' })).toHaveAttribute('type', 'button');
    });
  });

  describe('機能', () => {
    it('クリックで aria-pressed がトグル', async () => {
      const user = userEvent.setup();
      render(ToolbarTestToggle);

      const button = screen.getByRole('button', { name: 'Toggle' });
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('Enter で aria-pressed がトグル', async () => {
      const user = userEvent.setup();
      render(ToolbarTestToggle);

      const button = screen.getByRole('button', { name: 'Toggle' });
      button.focus();
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('Space で aria-pressed がトグル', async () => {
      const user = userEvent.setup();
      render(ToolbarTestToggle);

      const button = screen.getByRole('button', { name: 'Toggle' });
      button.focus();
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });
  });
});

describe('ToolbarSeparator (Svelte)', () => {
  describe('ARIA 属性', () => {
    it('role="separator" が設定される', () => {
      render(ToolbarTestSeparator);
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('horizontal toolbar 時に aria-orientation="vertical"', () => {
      render(ToolbarTestSeparator);
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('vertical toolbar 時に aria-orientation="horizontal"', () => {
      render(ToolbarTestSeparatorVertical);
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });
});

describe('アクセシビリティ (Svelte)', () => {
  it('axe による WCAG 2.1 AA 違反がない', async () => {
    const { container } = render(ToolbarTestSeparator);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('vertical toolbar でも WCAG 2.1 AA 違反がない', async () => {
    const { container } = render(ToolbarTestSeparatorVertical);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
