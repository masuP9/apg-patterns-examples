import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Toolbar, ToolbarButton, ToolbarToggleButton, ToolbarSeparator } from './Toolbar';

describe('Toolbar', () => {
  // 🔴 High Priority: APG Core Compliance
  describe('APG: ARIA Attributes', () => {
    it('has role="toolbar"', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toBeInTheDocument();
    });

    it('has aria-orientation="horizontal" by default', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-orientation', 'horizontal');
    });

    it('aria-orientation reflects orientation prop', () => {
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

    it('passes through aria-label', () => {
      render(
        <Toolbar aria-label="Text formatting">
          <ToolbarButton>Button</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('toolbar')).toHaveAttribute('aria-label', 'Text formatting');
    });

    it('passes through aria-labelledby', () => {
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

  describe('APG: Keyboard Interaction (Horizontal)', () => {
    it('moves focus to next button with ArrowRight', async () => {
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

    it('moves focus to previous button with ArrowLeft', async () => {
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

    it('does not wrap from last to first with ArrowRight (stops at edge)', async () => {
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

    it('does not wrap from first to last with ArrowLeft (stops at edge)', async () => {
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

    it('ArrowUp/Down are disabled in horizontal toolbar', async () => {
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

    it('moves focus to first button with Home', async () => {
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

    it('moves focus to last button with End', async () => {
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

    it('skips disabled items when navigating', async () => {
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

  describe('APG: Keyboard Interaction (Vertical)', () => {
    it('moves focus to next button with ArrowDown', async () => {
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

    it('moves focus to previous button with ArrowUp', async () => {
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

    it('ArrowLeft/Right are disabled in vertical toolbar', async () => {
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

    it('stops at edge with ArrowDown (does not wrap)', async () => {
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

  describe('APG: Focus Management', () => {
    it('first enabled item has tabIndex=0, others have tabIndex=-1 (Roving Tabindex)', () => {
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

    it('updates focus position on click', async () => {
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
  describe('ARIA Attributes', () => {
    it('has implicit role="button"', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Click me</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('has type="button"', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Click me</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });
  });

  describe('Functionality', () => {
    it('fires onClick on click', async () => {
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

    it('fires onClick on Enter', async () => {
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

    it('fires onClick on Space', async () => {
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

    it('does not fire onClick when disabled', async () => {
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

    it('is not focusable when disabled (disabled attribute)', () => {
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
  describe('ARIA Attributes', () => {
    it('has implicit role="button"', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button', { name: 'Toggle' })).toBeInTheDocument();
    });

    it('has type="button"', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('has aria-pressed="false" in initial state', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('has aria-pressed="true" when pressed', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton defaultPressed>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });
  });

  describe('Functionality', () => {
    it('toggles aria-pressed on click', async () => {
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

    it('toggles aria-pressed on Enter', async () => {
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

    it('toggles aria-pressed on Space', async () => {
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

    it('fires onPressedChange', async () => {
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

    it('sets initial state with defaultPressed', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarToggleButton defaultPressed>Toggle</ToolbarToggleButton>
        </Toolbar>
      );
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('controlled state with pressed prop', async () => {
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

    it('does not toggle when disabled', async () => {
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

    it('does not fire onPressedChange when disabled', async () => {
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

    it('is not focusable when disabled (disabled attribute)', () => {
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
  describe('ARIA Attributes', () => {
    it('has role="separator"', () => {
      render(
        <Toolbar aria-label="Test toolbar">
          <ToolbarButton>Before</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>After</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('separator')).toBeInTheDocument();
    });

    it('has aria-orientation="vertical" in horizontal toolbar', () => {
      render(
        <Toolbar aria-label="Test toolbar" orientation="horizontal">
          <ToolbarButton>Before</ToolbarButton>
          <ToolbarSeparator />
          <ToolbarButton>After</ToolbarButton>
        </Toolbar>
      );
      expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
    });

    it('has aria-orientation="horizontal" in vertical toolbar', () => {
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

describe('Accessibility', () => {
  it('has no WCAG 2.1 AA violations', async () => {
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

  it('has no WCAG 2.1 AA violations in vertical toolbar', async () => {
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

describe('HTML Attribute Inheritance', () => {
  it('applies className to container', () => {
    render(
      <Toolbar aria-label="Test toolbar" className="custom-toolbar">
        <ToolbarButton>Button</ToolbarButton>
      </Toolbar>
    );
    expect(screen.getByRole('toolbar')).toHaveClass('custom-toolbar');
  });

  it('applies className to ToolbarButton', () => {
    render(
      <Toolbar aria-label="Test toolbar">
        <ToolbarButton className="custom-button">Button</ToolbarButton>
      </Toolbar>
    );
    expect(screen.getByRole('button')).toHaveClass('custom-button');
  });

  it('applies className to ToolbarToggleButton', () => {
    render(
      <Toolbar aria-label="Test toolbar">
        <ToolbarToggleButton className="custom-toggle">Toggle</ToolbarToggleButton>
      </Toolbar>
    );
    expect(screen.getByRole('button')).toHaveClass('custom-toggle');
  });

  it('applies className to ToolbarSeparator', () => {
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
