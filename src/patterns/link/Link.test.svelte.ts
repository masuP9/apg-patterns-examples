import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import Link from './Link.svelte';

describe('Link (Svelte)', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="link" on element', () => {
      render(Link, {
        props: { href: '#', children: 'Click here' },
      });
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('has tabindex="0" on element', () => {
      render(Link, {
        props: { href: '#', children: 'Click here' },
      });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('tabindex', '0');
    });

    it('has accessible name from text content', () => {
      render(Link, {
        props: { href: '#', children: 'Learn more' },
      });
      expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(Link, {
        props: { href: '#', 'aria-label': 'Go to homepage', children: '→' },
      });
      expect(screen.getByRole('link', { name: 'Go to homepage' })).toBeInTheDocument();
    });

    it('sets aria-disabled="true" when disabled', () => {
      render(Link, {
        props: { href: '#', disabled: true, children: 'Disabled link' },
      });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets tabindex="-1" when disabled', () => {
      render(Link, {
        props: { href: '#', disabled: true, children: 'Disabled link' },
      });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('tabindex', '-1');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(Link, {
        props: { href: '#', children: 'Active link' },
      });
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-disabled');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction
  describe('APG Keyboard Interaction', () => {
    it('calls onClick on Enter key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Link, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick on Space key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Link, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when event.isComposing is true', () => {
      const handleClick = vi.fn();
      render(Link, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      const link = screen.getByRole('link');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      Object.defineProperty(event, 'isComposing', { value: true });

      link.dispatchEvent(event);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onClick on click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Link, {
        props: { onClick: handleClick, children: 'Click me' },
      });

      await user.click(screen.getByRole('link'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled (click)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Link, {
        props: { onClick: handleClick, disabled: true, children: 'Disabled' },
      });

      await user.click(screen.getByRole('link'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled (Enter key)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Link, {
        props: { onClick: handleClick, disabled: true, children: 'Disabled' },
      });

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('is focusable via Tab', async () => {
      const user = userEvent.setup();
      render(Link, {
        props: { href: '#', children: 'Click here' },
      });

      await user.tab();
      expect(screen.getByRole('link')).toHaveFocus();
    });

    it('is not focusable when disabled', async () => {
      const user = userEvent.setup();
      const container = document.createElement('div');
      document.body.appendChild(container);

      const beforeButton = document.createElement('button');
      beforeButton.textContent = 'Before';
      container.appendChild(beforeButton);

      render(Link, {
        target: container,
        props: { href: '#', disabled: true, children: 'Disabled link' },
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

    it('moves focus between multiple links with Tab', async () => {
      const user = userEvent.setup();
      const container = document.createElement('div');
      document.body.appendChild(container);

      render(Link, {
        target: container,
        props: { href: '#', children: 'Link 1' },
      });
      render(Link, {
        target: container,
        props: { href: '#', children: 'Link 2' },
      });
      render(Link, {
        target: container,
        props: { href: '#', children: 'Link 3' },
      });

      await user.tab();
      expect(screen.getByRole('link', { name: 'Link 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('link', { name: 'Link 2' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('link', { name: 'Link 3' })).toHaveFocus();

      document.body.removeChild(container);
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Link, {
        props: { href: '#', children: 'Click here' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(Link, {
        props: { href: '#', disabled: true, children: 'Disabled link' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-label', async () => {
      const { container } = render(Link, {
        props: { href: '#', 'aria-label': 'Go to homepage', children: '→' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Navigation
  describe('Navigation', () => {
    const originalLocation = window.location;

    beforeEach(() => {
      // @ts-expect-error - delete window.location for mocking
      delete window.location;
      window.location = { ...originalLocation, href: '' };
    });

    afterEach(() => {
      window.location = originalLocation;
    });

    it('navigates to href on activation', async () => {
      const user = userEvent.setup();
      render(Link, {
        props: { href: 'https://example.com', children: 'Visit' },
      });

      await user.click(screen.getByRole('link'));
      expect(window.location.href).toBe('https://example.com');
    });

    it('opens in new tab when target="_blank"', async () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      const user = userEvent.setup();

      render(Link, {
        props: { href: 'https://example.com', target: '_blank', children: 'External' },
      });

      await user.click(screen.getByRole('link'));
      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://example.com',
        '_blank',
        'noopener,noreferrer'
      );

      windowOpenSpy.mockRestore();
    });

    it('does not navigate when disabled', async () => {
      const user = userEvent.setup();
      render(Link, {
        props: { href: 'https://example.com', disabled: true, children: 'Disabled' },
      });

      await user.click(screen.getByRole('link'));
      expect(window.location.href).toBe('');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to element', () => {
      render(Link, {
        props: { href: '#', class: 'custom-link', children: 'Styled' },
      });
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link');
    });

    it('passes through data-* attributes', () => {
      render(Link, {
        props: { href: '#', 'data-testid': 'my-link', 'data-custom': 'value', children: 'Link' },
      });
      const link = screen.getByTestId('my-link');
      expect(link).toHaveAttribute('data-custom', 'value');
    });

    it('sets id attribute', () => {
      render(Link, {
        props: { href: '#', id: 'main-link', children: 'Main' },
      });
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('id', 'main-link');
    });
  });
});
