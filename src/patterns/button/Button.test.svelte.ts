import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button.svelte';

describe('Button (Svelte)', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="button" on element', () => {
      render(Button, {
        props: { children: 'Click me' },
      });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has tabindex="0" on element', () => {
      render(Button, {
        props: { children: 'Click me' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabindex', '0');
    });

    it('has accessible name from text content', () => {
      render(Button, {
        props: { children: 'Submit Form' },
      });
      expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(Button, {
        props: { 'aria-label': 'Close dialog', children: '×' },
      });
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    });

    it('sets aria-disabled="true" when disabled', () => {
      render(Button, {
        props: { disabled: true, children: 'Disabled button' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets tabindex="-1" when disabled', () => {
      render(Button, {
        props: { disabled: true, children: 'Disabled button' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabindex', '-1');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(Button, {
        props: { children: 'Active button' },
      });
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-disabled');
    });

    it('does not have aria-pressed (not a toggle button)', () => {
      render(Button, {
        props: { children: 'Not a toggle' },
      });
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-pressed');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction
  describe('APG Keyboard Interaction', () => {
    it('calls onClick on Space key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick on Enter key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not scroll page on Space key', async () => {
      const handleClick = vi.fn();
      render(Button, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const button = screen.getByRole('button');
      button.focus();

      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        bubbles: true,
        cancelable: true,
      });
      const preventDefaultSpy = vi.spyOn(spaceEvent, 'preventDefault');

      button.dispatchEvent(spaceEvent);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('does not call onClick when event.isComposing is true', () => {
      const handleClick = vi.fn();
      render(Button, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const button = screen.getByRole('button');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      Object.defineProperty(event, 'isComposing', { value: true });

      button.dispatchEvent(event);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when event.defaultPrevented is true', () => {
      const handleClick = vi.fn();
      render(Button, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const button = screen.getByRole('button');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      event.preventDefault();

      button.dispatchEvent(event);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onClick on click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled (click)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, disabled: true, children: 'Disabled' },
      });

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled (Space key)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, disabled: true, children: 'Disabled' },
      });

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled (Enter key)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, disabled: true, children: 'Disabled' },
      });

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('is focusable via Tab', async () => {
      const user = userEvent.setup();
      render(Button, {
        props: { children: 'Click me' },
      });

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('is not focusable when disabled', async () => {
      const user = userEvent.setup();
      const container = document.createElement('div');
      document.body.appendChild(container);

      const beforeButton = document.createElement('button');
      beforeButton.textContent = 'Before';
      container.appendChild(beforeButton);

      render(Button, {
        target: container,
        props: { disabled: true, children: 'Disabled button' },
      });

      const afterButton = document.createElement('button');
      afterButton.textContent = 'After';
      container.appendChild(afterButton);

      await user.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();

      document.body.removeChild(container);
    });

    it('moves focus between multiple buttons with Tab', async () => {
      const user = userEvent.setup();
      const container = document.createElement('div');
      document.body.appendChild(container);

      render(Button, {
        target: container,
        props: { children: 'Button 1' },
      });
      render(Button, {
        target: container,
        props: { children: 'Button 2' },
      });
      render(Button, {
        target: container,
        props: { children: 'Button 3' },
      });

      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 2' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 3' })).toHaveFocus();

      document.body.removeChild(container);
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Button, {
        props: { children: 'Click me' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(Button, {
        props: { disabled: true, children: 'Disabled button' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-label', async () => {
      const { container } = render(Button, {
        props: { 'aria-label': 'Close', children: '×' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to element', () => {
      render(Button, {
        props: { class: 'custom-button', children: 'Styled' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button');
    });

    it('passes through data-* attributes', () => {
      render(Button, {
        props: { 'data-testid': 'my-button', 'data-custom': 'value', children: 'Button' },
      });
      const button = screen.getByTestId('my-button');
      expect(button).toHaveAttribute('data-custom', 'value');
    });

    it('sets id attribute', () => {
      render(Button, {
        props: { id: 'main-button', children: 'Main' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'main-button');
    });
  });
});
