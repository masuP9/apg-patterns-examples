import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Toolbar, ToolbarButton, ToolbarToggleButton, ToolbarSeparator } from './Toolbar';

describe('Toolbar', () => {
  // 🔴 High Priority: APG 準拠の核心
  describe('APG: ARIA 属性', () => {
    it('role="toolbar" が設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('aria-orientation がデフォルトで "horizontal"', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('aria-orientation が orientation prop を反映する', () => {
      const { rerender } = render(
        <Toolbar aria-label="Test toolbar" orientation="vertical">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'vertical');

      rerender(
        <Toolbar aria-label="Test toolbar" orientation="horizontal">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('aria-label が透過される', () => {
      render(
        <Toolbar aria-label="Text formatting">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Text formatting');
    });

    it('aria-labelledby が透過される', () => {
      render(
        <>
          <h2 id="toolbar-label">Toolbar Label</h2>
          <Toolbar aria-labelledby="toolbar-label">
            <ToolbarButton>Button</ToolbarButton>
          </Toolbar>
        </>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-labelledby', 'toolbar-label');
    });
  });

  describe('APG: キーボード操作 (Horizontal)', () => {
    it('ArrowRight で次のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    });

    it('ArrowLeft で前のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const secondButton = screen.getByRole('button', { name: 'Second' });
      secondButton.focus();

      await user.keyboard('{ArrowLeft}');

      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    it('ArrowRight で最後から先頭にラップしない（端で止まる）', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const thirdButton = screen.getByRole('button', { name: 'Third' });
      thirdButton.focus();

      await user.keyboard('{ArrowRight}');

      expect(thirdButton).toHaveFocus();
    });

    it('ArrowLeft で先頭から最後にラップしない（端で止まる）', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowLeft}');

      expect(firstButton).toHaveFocus();
    });

    it('ArrowUp/Down は水平ツールバーでは無効', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
        </Toolbar>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowDown}');
      expect(firstButton).toHaveFocus();

      await user.keyboard('{ArrowUp}');
      expect(firstButton).toHaveFocus();
    });

    it('Home で最初のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const thirdButton = screen.getByRole('button', { name: 'Third' });
      thirdButton.focus();

      await user.keyboard('{Home}');

      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    it('End で最後のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{End}');

      expect(screen.getByRole('button', { name: 'Third' })).toHaveFocus();
    });

    it('disabled アイテムをスキップして移動', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton disabled>Second (disabled)</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('button', { name: 'Third' })).toHaveFocus();
    });
  });

  describe('APG: キーボード操作 (Vertical)', () => {
    it('ArrowDown で次のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar" orientation="vertical">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowDown}');

      expect(screen.getByRole('button', { name: 'Second' })).toHaveFocus();
    });

    it('ArrowUp で前のボタンにフォーカス移動', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar" orientation="vertical">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      const secondButton = screen.getByRole('button', { name: 'Second' });
      secondButton.focus();

      await user.keyboard('{ArrowUp}');

      expect(screen.getByRole('button', { name: 'First' })).toHaveFocus();
    });

    it('ArrowLeft/Right は垂直ツールバーでは無効', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar" orientation="vertical">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
        </Toolbar>
      );

      const firstButton = screen.getByRole('button', { name: 'First' });
      firstButton.focus();

      await user.keyboard('{ArrowRight}');
      expect(firstButton).toHaveFocus();

      await user.keyboard('{ArrowLeft}');
      expect(firstButton).toHaveFocus();
    });

    it('ArrowDown で端で止まる（ラップしない）', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar" orientation="vertical">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
        </Toolbar>
      );

      const secondButton = screen.getByRole('button', { name: 'Second' });
      secondButton.focus();

      await user.keyboard('{ArrowDown}');

      expect(secondButton).toHaveFocus();
    });
  });

  describe('APG: フォーカス管理', () => {
    it('最初の有効なアイテムが tabIndex=0、他は tabIndex=-1 (Roving Tabindex)', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
        </Toolbar>
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveAttribute('tabIndex', '0');
      expect(buttons[1]).toHaveAttribute('tabIndex', '-1');
    });

    it('クリックでフォーカス位置が更新される', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>First</ToolbarButton>
          <ToolbarButton>Second</ToolbarButton>
          <ToolbarButton>Third</ToolbarButton>
        </Toolbar>
      );

      await user.click(screen.getByRole('button', { name: 'Second' }));
      await user.keyboard('{ArrowRight}');

      expect(screen.getByRole('button', { name: 'Third' })).toHaveFocus();
    });
  });
});

describe('ToolbarButton', () => {
  describe('ARIA 属性', () => {
    it('role="button" が暗黙的に設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Click me</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('type="button" が設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Click me</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  describe('機能', () => {
    it('クリックで onClick が発火', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton onClick={handleClick}>Click me</ToolbarButton>
        </Toolbar>
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Enter で onClick が発火', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton onClick={handleClick}>Click me</ToolbarButton>
        </Toolbar>
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('Space で onClick が発火', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton onClick={handleClick}>Click me</ToolbarButton>
        </Toolbar>
      );

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('disabled 時は onClick が発火しない', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton onClick={handleClick} disabled>
            Click me
          </ToolbarButton>
        </Toolbar>
      );

      await user.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('disabled 時はフォーカス対象外（disabled属性で非フォーカス）', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton disabled>Click me</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});

describe('ToolbarToggleButton', () => {
  describe('ARIA 属性', () => {
    it('role="button" が暗黙的に設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
    });

    it('type="button" が設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('aria-pressed="false" が初期状態で設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('aria-pressed="true" が押下状態で設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton defaultPressed>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('機能', () => {
    it('クリックで aria-pressed がトグル', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('Enter で aria-pressed がトグル', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('Space で aria-pressed がトグル', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('onPressedChange が発火', async () => {
      const handlePressedChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton onPressedChange={handlePressedChange}>Toggle</ToolbarToggleButton>
        </Toolbar>
      );

      await user.click(screen.getByRole('button'));

      expect(handlePressedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole('button'));

      expect(handlePressedChange).toHaveBeenCalledWith(false);
    });

    it('defaultPressed で初期状態を設定', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton defaultPressed>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('pressed で制御された状態', async () => {
      const user = userEvent.setup();
      const Controlled = () => {
        const [pressed, setPressed] = React.useState(false);
        return (
          <Toolbar aria-label="Test toolbar">
            <ToolbarToggleButton pressed={pressed} onPressedChange={setPressed}>
              Toggle
            </ToolbarToggleButton>
          </Toolbar>
        );
      };

      render(<Controlled />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('disabled 時はトグルしない', async () => {
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton disabled>Toggle</ToolbarToggleButton>
        </Toolbar>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');

      await user.click(button);

      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('disabled 時は onPressedChange が発火しない', async () => {
      const handlePressedChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton disabled onPressedChange={handlePressedChange}>
            Toggle
          </ToolbarToggleButton>
        </Toolbar>
      );

      await user.click(screen.getByRole('button'));

      expect(handlePressedChange).not.toHaveBeenCalled();
    });

    it('disabled 時はフォーカス対象外（disabled属性で非フォーカス）', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton disabled>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});

describe('ToolbarSeparator', () => {
  describe('ARIA 属性', () => {
    it('role="separator" が設定される', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Before</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>After</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('horizontal toolbar 時に aria-orientation="vertical"', () => {
      render(
        <Toolbar aria-label="Test toolbar" orientation="horizontal">
          <ToolbarButton>Before</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>After</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('vertical toolbar 時に aria-orientation="horizontal"', () => {
      render(
        <Toolbar aria-label="Test toolbar" orientation="vertical">
          <ToolbarButton>Before</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>After</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
    });
  });
});

describe('アクセシビリティ', () => {
  it('axe による WCAG 2.1 AA 違反がない', async () => {
    const { container } = render(
      <Toolbar aria-label="Text formatting">
        <ToolbarToggleButton>Bold</ToolbarToggleButton>
        <ToolbarToggleButton>Italic</ToolbarToggleButton>
        <ToolbarSeparator />
        <ToolbarButton>Copy</ToolbarButton>
        <ToolbarButton>Paste</ToolbarButton>
      </Toolbar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('vertical toolbar でも WCAG 2.1 AA 違反がない', async () => {
    const { container } = render(
      <Toolbar aria-label="Actions" orientation="vertical">
        <ToolbarButton>New</ToolbarButton>
        <ToolbarButton>Open</ToolbarButton>
        <ToolbarSeparator />
        <ToolbarButton>Save</ToolbarButton>
      </Toolbar>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

describe('HTML 属性継承', () => {
  it('className がコンテナに適用される', () => {
    render(
      <Toolbar aria-label="Test toolbar" className="custom-toolbar">
        <ToolbarButton>Button</ToolbarButton>
      </Toolbar>
    );
    expect(screen.getByRole('toolbar')).toHaveClass('custom-toolbar');
  });

  it('ToolbarButton の className が適用される', () => {
    render(
      <Toolbar aria-label="Test toolbar">
        <ToolbarButton className="custom-button">Button</ToolbarButton>
      </Toolbar>
    );
    expect(screen.getByRole('button')).toHaveClass('custom-button');
  });

  it('ToolbarToggleButton の className が適用される', () => {
    render(
      <Toolbar aria-label="Test toolbar">
        <ToolbarToggleButton className="custom-toggle">Toggle</ToolbarToggleButton>
      </Toolbar>
    );
    expect(screen.getByRole('button')).toHaveClass('custom-toggle');
  });

  it('ToolbarSeparator の className が適用される', () => {
    render(
      <Toolbar aria-label="Test toolbar">
        <ToolbarButton>Before</ToolbarButton>
        <ToolbarSeparator className="custom-separator" />
        <ToolbarButton>After</ToolbarButton>
      </Toolbar>
    );
    expect(screen.getByRole('separator')).toHaveClass('custom-separator');
  });
});

// Import React for the controlled component test
import React from 'react';
