import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { ToggleButton } from './ToggleButton';

describe('ToggleButton', () => {
  // 🔴 High Priority: APG Core Compliance
  describe('APG: Keyboard Interaction', () => {
    it('toggles with Space key', async () => {
      const user = userEvent.setup();
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
      button.focus();
      await user.keyboard(' ');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('toggles with Enter key', async () => {
      const user = userEvent.setup();
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
      button.focus();
      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('can move focus with Tab key', async () => {
      const user = userEvent.setup();
      render(
        <>
          <ToggleButton>Button 1</ToggleButton>
          <ToggleButton>Button 2</ToggleButton>
        </>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 2' })).toHaveFocus();
    });

    it('skips with Tab key when disabled', async () => {
      const user = userEvent.setup();
      render(
        <>
          <ToggleButton>Button 1</ToggleButton>
          <ToggleButton disabled>Button 2</ToggleButton>
          <ToggleButton>Button 3</ToggleButton>
        </>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 3' })).toHaveFocus();
    });
  });

  describe('APG: ARIA Attributes', () => {
    it('has implicit role="button"', () => {
      render(<ToggleButton>Mute</ToggleButton>);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has aria-pressed="false" in initial state', () => {
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });

    it('changes to aria-pressed="true" after click', async () => {
      const user = userEvent.setup();
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('has type="button"', () => {
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('cannot change aria-pressed when disabled', async () => {
      const user = userEvent.setup();
      render(<ToggleButton disabled>Mute</ToggleButton>);
      const button = screen.getByRole('button');

      expect(button).toHaveAttribute('aria-pressed', 'false');
      await user.click(button);
      expect(button).toHaveAttribute('aria-pressed', 'false');
    });
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no WCAG 2.1 AA violations', async () => {
      const { container } = render(<ToggleButton>Mute</ToggleButton>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible name', () => {
      render(<ToggleButton>Mute Audio</ToggleButton>);
      expect(screen.getByRole('button', { name: /Mute Audio/i })).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('renders in pressed state with initialPressed=true', () => {
      render(<ToggleButton initialPressed>Mute</ToggleButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('calls onPressedChange when state changes', async () => {
      const handlePressedChange = vi.fn();
      const user = userEvent.setup();
      render(<ToggleButton onPressedChange={handlePressedChange}>Mute</ToggleButton>);

      await user.click(screen.getByRole('button'));
      expect(handlePressedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole('button'));
      expect(handlePressedChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Custom Indicators', () => {
    it('displays default ●/○ indicator', () => {
      render(<ToggleButton>Mute</ToggleButton>);
      const button = screen.getByRole('button');
      const indicator = button.querySelector('.apg-toggle-indicator');
      expect(indicator).toHaveTextContent('○');
    });

    it('can set custom indicator with pressedIndicator', () => {
      render(
        <ToggleButton initialPressed pressedIndicator="🔇">
          Mute
        </ToggleButton>
      );
      const button = screen.getByRole('button');
      const indicator = button.querySelector('.apg-toggle-indicator');
      expect(indicator).toHaveTextContent('🔇');
    });

    it('can set custom indicator with unpressedIndicator', () => {
      render(<ToggleButton unpressedIndicator="🔊">Mute</ToggleButton>);
      const button = screen.getByRole('button');
      const indicator = button.querySelector('.apg-toggle-indicator');
      expect(indicator).toHaveTextContent('🔊');
    });

    it('switches custom indicator on toggle', async () => {
      const user = userEvent.setup();
      render(
        <ToggleButton pressedIndicator="🔇" unpressedIndicator="🔊">
          Mute
        </ToggleButton>
      );
      const button = screen.getByRole('button');
      const indicator = button.querySelector('.apg-toggle-indicator');

      expect(indicator).toHaveTextContent('🔊');
      await user.click(button);
      expect(indicator).toHaveTextContent('🔇');
      await user.click(button);
      expect(indicator).toHaveTextContent('🔊');
    });

    it('can pass ReactNode as custom indicator', () => {
      render(
        <ToggleButton initialPressed pressedIndicator={<span data-testid="custom-icon">X</span>}>
          Mute
        </ToggleButton>
      );
      expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('maintains aria-hidden with custom indicator', () => {
      render(
        <ToggleButton pressedIndicator="🔇" unpressedIndicator="🔊">
          Mute
        </ToggleButton>
      );
      const button = screen.getByRole('button');
      const indicator = button.querySelector('.apg-toggle-indicator');
      expect(indicator).toHaveAttribute('aria-hidden', 'true');
    });

    it('has no axe violations with custom indicator', async () => {
      const { container } = render(
        <ToggleButton pressedIndicator="🔇" unpressedIndicator="🔊">
          Mute
        </ToggleButton>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Extensibility
  describe('HTML Attribute Inheritance', () => {
    it('merges className correctly', () => {
      render(<ToggleButton className="custom-class">Mute</ToggleButton>);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('apg-toggle-button');
    });

    it('inherits data-* attributes', () => {
      render(<ToggleButton data-testid="custom-toggle">Mute</ToggleButton>);
      expect(screen.getByTestId('custom-toggle')).toBeInTheDocument();
    });

    it('works correctly with React node children', () => {
      render(
        <ToggleButton>
          <span>Icon</span> Text
        </ToggleButton>
      );
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Icon');
      expect(button).toHaveTextContent('Text');
    });
  });
});
