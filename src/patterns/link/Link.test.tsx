import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { Link } from './Link';

describe('Link', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="link" on element', () => {
      render(<Link href="#">Click here</Link>);
      expect(screen.getByRole('link')).toBeInTheDocument();
    });

    it('has tabindex="0" on element', () => {
      render(<Link href="#">Click here</Link>);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('tabindex', '0');
    });

    it('has accessible name from text content', () => {
      render(<Link href="#">Learn more</Link>);
      expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(
        <Link href="#" aria-label="Go to homepage">
          <span aria-hidden="true">→</span>
        </Link>
      );
      expect(screen.getByRole('link', { name: 'Go to homepage' })).toBeInTheDocument();
    });

    it('has accessible name from aria-labelledby', () => {
      render(
        <>
          <span id="link-label">External link</span>
          <Link href="#" aria-labelledby="link-label">
            Click
          </Link>
        </>
      );
      expect(screen.getByRole('link', { name: 'External link' })).toBeInTheDocument();
    });

    it('sets aria-disabled="true" when disabled', () => {
      render(
        <Link href="#" disabled>
          Disabled link
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets tabindex="-1" when disabled', () => {
      render(
        <Link href="#" disabled>
          Disabled link
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('tabindex', '-1');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(<Link href="#">Active link</Link>);
      const link = screen.getByRole('link');
      expect(link).not.toHaveAttribute('aria-disabled');
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction
  describe('APG Keyboard Interaction', () => {
    it('calls onClick on Enter key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Link onClick={handleClick}>Click me</Link>);

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick on Space key', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Link onClick={handleClick}>Click me</Link>);

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard(' ');

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when event.isComposing is true', () => {
      const handleClick = vi.fn();
      render(<Link onClick={handleClick}>Click me</Link>);

      const link = screen.getByRole('link');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
      });
      // Simulate IME composing state
      Object.defineProperty(event, 'isComposing', { value: true });

      link.dispatchEvent(event);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when event.defaultPrevented is true', () => {
      const handleClick = vi.fn();
      render(<Link onClick={handleClick}>Click me</Link>);

      const link = screen.getByRole('link');
      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      event.preventDefault();

      link.dispatchEvent(event);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('calls onClick on click', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(<Link onClick={handleClick}>Click me</Link>);

      await user.click(screen.getByRole('link'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled (click)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Link onClick={handleClick} disabled>
          Disabled
        </Link>
      );

      await user.click(screen.getByRole('link'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled (Enter key)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Link onClick={handleClick} disabled>
          Disabled
        </Link>
      );

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
      render(<Link href="#">Click here</Link>);

      await user.tab();
      expect(screen.getByRole('link')).toHaveFocus();
    });

    it('is not focusable when disabled', async () => {
      const user = userEvent.setup();
      render(
        <>
          <button>Before</button>
          <Link href="#" disabled>
            Disabled link
          </Link>
          <button>After</button>
        </>
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('moves focus between multiple links with Tab', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Link href="#">Link 1</Link>
          <Link href="#">Link 2</Link>
          <Link href="#">Link 3</Link>
        </>
      );

      await user.tab();
      expect(screen.getByRole('link', { name: 'Link 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('link', { name: 'Link 2' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('link', { name: 'Link 3' })).toHaveFocus();
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(<Link href="#">Click here</Link>);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(
        <Link href="#" disabled>
          Disabled link
        </Link>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-label', async () => {
      const { container } = render(
        <Link href="#" aria-label="Go to homepage">
          →
        </Link>
      );
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
      render(<Link href="https://example.com">Visit</Link>);

      await user.click(screen.getByRole('link'));
      expect(window.location.href).toBe('https://example.com');
    });

    it('navigates to href on Enter key', async () => {
      const user = userEvent.setup();
      render(<Link href="https://example.com">Visit</Link>);

      const link = screen.getByRole('link');
      link.focus();
      await user.keyboard('{Enter}');

      expect(window.location.href).toBe('https://example.com');
    });

    it('opens in new tab when target="_blank"', async () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
      const user = userEvent.setup();

      render(
        <Link href="https://example.com" target="_blank">
          External
        </Link>
      );

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
      render(
        <Link href="https://example.com" disabled>
          Disabled
        </Link>
      );

      await user.click(screen.getByRole('link'));
      expect(window.location.href).toBe('');
    });

    it('calls onClick and navigates to href', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <Link href="https://example.com" onClick={handleClick}>
          Visit
        </Link>
      );

      await user.click(screen.getByRole('link'));
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe('https://example.com');
    });

    it('does not navigate when onClick prevents default', async () => {
      const handleClick = vi.fn((e: React.MouseEvent | React.KeyboardEvent) => {
        e.preventDefault();
      });
      const user = userEvent.setup();

      render(
        <Link href="https://example.com" onClick={handleClick}>
          Visit
        </Link>
      );

      await user.click(screen.getByRole('link'));
      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe('');
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to element', () => {
      render(
        <Link href="#" className="custom-link">
          Styled
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveClass('custom-link');
    });

    it('passes through data-* attributes', () => {
      render(
        <Link href="#" data-testid="my-link" data-custom="value">
          Link
        </Link>
      );
      const link = screen.getByTestId('my-link');
      expect(link).toHaveAttribute('data-custom', 'value');
    });

    it('sets id attribute', () => {
      render(
        <Link href="#" id="main-link">
          Main
        </Link>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('id', 'main-link');
    });
  });
});
