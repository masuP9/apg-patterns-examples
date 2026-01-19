import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Button from './Button.vue';

describe('Button (Vue)', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG ARIA Attributes', () => {
    it('has role="button" on element', () => {
      render(Button, {
        slots: { default: 'Click me' },
      });
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('has tabindex="0" on element', () => {
      render(Button, {
        slots: { default: 'Click me' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabindex', '0');
    });

    it('has accessible name from text content', () => {
      render(Button, {
        slots: { default: 'Submit Form' },
      });
      expect(screen.getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();
    });

    it('has accessible name from aria-label', () => {
      render(Button, {
        attrs: { 'aria-label': 'Close dialog' },
        slots: { default: '×' },
      });
      expect(screen.getByRole('button', { name: 'Close dialog' })).toBeInTheDocument();
    });

    it('has accessible name from aria-labelledby', () => {
      render({
        components: { Button },
        template: `
          <div>
            <span id="btn-label">Save changes</span>
            <Button aria-labelledby="btn-label">Save</Button>
          </div>
        `,
      });
      expect(screen.getByRole('button', { name: 'Save changes' })).toBeInTheDocument();
    });

    it('sets aria-disabled="true" when disabled', () => {
      render(Button, {
        props: { disabled: true },
        slots: { default: 'Disabled button' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-disabled', 'true');
    });

    it('sets tabindex="-1" when disabled', () => {
      render(Button, {
        props: { disabled: true },
        slots: { default: 'Disabled button' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('tabindex', '-1');
    });

    it('does not have aria-disabled when not disabled', () => {
      render(Button, {
        slots: { default: 'Active button' },
      });
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-disabled');
    });

    it('does not have aria-pressed (not a toggle button)', () => {
      render(Button, {
        slots: { default: 'Not a toggle' },
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
        props: { onClick: handleClick },
        slots: { default: 'Click me' },
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
        props: { onClick: handleClick },
        slots: { default: 'Click me' },
      });

      const button = screen.getByRole('button');
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not scroll page on Space key', async () => {
      const handleClick = vi.fn();
      render(Button, {
        props: { onClick: handleClick },
        slots: { default: 'Click me' },
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
        props: { onClick: handleClick },
        slots: { default: 'Click me' },
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
        props: { onClick: handleClick },
        slots: { default: 'Click me' },
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
        props: { onClick: handleClick },
        slots: { default: 'Click me' },
      });

      await user.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled (click)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, disabled: true },
        slots: { default: 'Disabled' },
      });

      await user.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when disabled (Space key)', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();
      render(Button, {
        props: { onClick: handleClick, disabled: true },
        slots: { default: 'Disabled' },
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
        props: { onClick: handleClick, disabled: true },
        slots: { default: 'Disabled' },
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
        slots: { default: 'Click me' },
      });

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });

    it('is not focusable when disabled', async () => {
      const user = userEvent.setup();
      render({
        components: { Button },
        template: `
          <div>
            <button>Before</button>
            <Button disabled>Disabled button</Button>
            <button>After</button>
          </div>
        `,
      });

      await user.tab();
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('moves focus between multiple buttons with Tab', async () => {
      const user = userEvent.setup();
      render({
        components: { Button },
        template: `
          <div>
            <Button>Button 1</Button>
            <Button>Button 2</Button>
            <Button>Button 3</Button>
          </div>
        `,
      });

      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 1' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 2' })).toHaveFocus();
      await user.tab();
      expect(screen.getByRole('button', { name: 'Button 3' })).toHaveFocus();
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Button, {
        slots: { default: 'Click me' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when disabled', async () => {
      const { container } = render(Button, {
        props: { disabled: true },
        slots: { default: 'Disabled button' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-label', async () => {
      const { container } = render(Button, {
        attrs: { 'aria-label': 'Close' },
        slots: { default: '×' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to element', () => {
      render(Button, {
        attrs: { class: 'custom-button' },
        slots: { default: 'Styled' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-button');
    });

    it('passes through data-* attributes', () => {
      render(Button, {
        attrs: { 'data-testid': 'my-button', 'data-custom': 'value' },
        slots: { default: 'Button' },
      });
      const button = screen.getByTestId('my-button');
      expect(button).toHaveAttribute('data-custom', 'value');
    });

    it('sets id attribute', () => {
      render(Button, {
        attrs: { id: 'main-button' },
        slots: { default: 'Main' },
      });
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('id', 'main-button');
    });
  });
});
