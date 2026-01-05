import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Switch } from './Switch';

describe('Switch', () => {
  // 🔴 High Priority: APG Core Compliance
  describe('APG: ARIA Attributes', () => {
    it('has role="switch"', () => {
      render(<Switch>Wi-Fi</Switch>);
      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('has aria-checked="false" in initial state', () => {
      render(<Switch>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });

    it('changes to aria-checked="true" after click', async () => {
      const user = userEvent.setup();
      render(<Switch>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('has type="button"', () => {
      render(<Switch>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('type', 'button');
    });

    it('has aria-disabled when disabled', () => {
      render(<Switch disabled>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-disabled', 'true');
    });

    it('cannot change aria-checked when disabled', async () => {
      const user = userEvent.setup();
      render(<Switch disabled>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      await user.click(switchEl);
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('APG: Keyboard Interaction', () => {
    it('toggles with Space key', async () => {
      const user = userEvent.setup();
      render(<Switch>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      switchEl.focus();
      await user.keyboard(' ');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('toggles with Enter key', async () => {
      const user = userEvent.setup();
      render(<Switch>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');

      expect(switchEl).toHaveAttribute('aria-checked', 'false');
      switchEl.focus();
      await user.keyboard('{Enter}');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('can move focus with Tab key', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Switch>Switch 1</Switch>
          <Switch>Switch 2</Switch>
        </>
      );

      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 2' })).toHaveFocus();
    });

    it('skips with Tab key when disabled', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Switch>Switch 1</Switch>
          <Switch disabled>Switch 2</Switch>
          <Switch>Switch 3</Switch>
        </>
      );

      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('switch', { name: 'Switch 3' })).toHaveFocus();
    });

    it('keyboard operation disabled when disabled', async () => {
      const user = userEvent.setup();
      render(<Switch disabled>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');

      switchEl.focus();
      await user.keyboard(' ');
      expect(switchEl).toHaveAttribute('aria-checked', 'false');
    });
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no WCAG 2.1 AA violations', async () => {
      const { container } = render(<Switch>Wi-Fi</Switch>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has accessible name via label (children)', () => {
      render(<Switch>Wi-Fi</Switch>);
      expect(screen.getByRole('switch', { name: 'Wi-Fi' })).toBeInTheDocument();
    });

    it('can set accessible name via aria-label', () => {
      render(<Switch aria-label="Enable notifications" />);
      expect(screen.getByRole('switch', { name: 'Enable notifications' })).toBeInTheDocument();
    });

    it('can reference external label via aria-labelledby', () => {
      render(
        <>
          <span id="switch-label">Bluetooth</span>
          <Switch aria-labelledby="switch-label" />
        </>
      );
      expect(screen.getByRole('switch', { name: 'Bluetooth' })).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('renders in ON state with initialChecked=true', () => {
      render(<Switch initialChecked>Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveAttribute('aria-checked', 'true');
    });

    it('calls onCheckedChange when state changes', async () => {
      const handleCheckedChange = vi.fn();
      const user = userEvent.setup();
      render(<Switch onCheckedChange={handleCheckedChange}>Wi-Fi</Switch>);

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledWith(true);

      await user.click(screen.getByRole('switch'));
      expect(handleCheckedChange).toHaveBeenCalledWith(false);
    });
  });

  // 🟢 Low Priority: Extensibility
  describe('HTML Attribute Inheritance', () => {
    it('merges className correctly', () => {
      render(<Switch className="custom-class">Wi-Fi</Switch>);
      const switchEl = screen.getByRole('switch');
      expect(switchEl).toHaveClass('custom-class');
      expect(switchEl).toHaveClass('apg-switch');
    });

    it('inherits data-* attributes', () => {
      render(<Switch data-testid="custom-switch">Wi-Fi</Switch>);
      expect(screen.getByTestId('custom-switch')).toBeInTheDocument();
    });
  });
});
