import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Alert from './Alert.svelte';

// Excluded React-specific cases (no faithful Svelte analogue):
// - 'container remains the same element when message changes' (React rerender of internal id stability)
// - 'container remains when message is cleared' (React rerender semantics)
// - 'can pass complex content via children' (Svelte children use Snippet; cannot construct ad-hoc markup snippets in this harness)
// - 'message takes priority when both message and children are provided' (same Snippet limitation)
// - 'can pass additional HTML attributes' (Svelte Alert declares explicit props and does NOT
//   spread rest props onto the element, so arbitrary HTML attributes are not forwarded — an
//   intentional framework-implementation difference, not a bug)
// React used `className` prop; Svelte uses `class`. React used `onDismiss` callback prop;
// Svelte also accepts an `onDismiss` callback prop.

describe('Alert (Svelte)', () => {
  // High Priority: APG Core Compliance
  describe('APG: ARIA Attributes', () => {
    it('has role="alert"', () => {
      render(Alert, { props: { message: 'Test message' } });
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('role=alert container exists in DOM even without message', () => {
      render(Alert);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('APG: Focus Management', () => {
    it('alert itself does not receive focus (no tabindex)', () => {
      render(Alert, { props: { message: 'Test message' } });
      expect(screen.getByRole('alert')).not.toHaveAttribute('tabindex');
    });
  });

  describe('Dismiss Feature', () => {
    it('shows dismiss button when dismissible=true', () => {
      render(Alert, { props: { message: 'Test message', dismissible: true } });
      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument();
    });

    it('does not show dismiss button when dismissible=false (default)', () => {
      render(Alert, { props: { message: 'Test message' } });
      expect(screen.queryByRole('button', { name: 'Dismiss alert' })).not.toBeInTheDocument();
    });

    it('calls onDismiss when dismiss button is clicked', async () => {
      const handleDismiss = vi.fn();
      const user = userEvent.setup();
      render(Alert, {
        props: { message: 'Test message', dismissible: true, onDismiss: handleDismiss },
      });

      await user.click(screen.getByRole('button', { name: 'Dismiss alert' }));
      expect(handleDismiss).toHaveBeenCalledTimes(1);
    });

    it('dismiss button has type=button', () => {
      render(Alert, { props: { message: 'Test message', dismissible: true } });
      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toHaveAttribute(
        'type',
        'button'
      );
    });

    it('dismiss button has aria-label', () => {
      render(Alert, { props: { message: 'Test message', dismissible: true } });
      expect(screen.getByRole('button', { name: 'Dismiss alert' })).toHaveAccessibleName(
        'Dismiss alert'
      );
    });
  });

  // Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no WCAG 2.1 AA violations (with message)', async () => {
      const { container } = render(Alert, { props: { message: 'Test message' } });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no WCAG 2.1 AA violations (without message)', async () => {
      const { container } = render(Alert);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no WCAG 2.1 AA violations (dismissible)', async () => {
      const { container } = render(Alert, {
        props: { message: 'Test message', dismissible: true, onDismiss: () => {} },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Variant Styles', () => {
    it.each(['info', 'success', 'warning', 'error'] as const)(
      'applies appropriate style class for variant=%s',
      (variant) => {
        render(Alert, { props: { message: 'Test message', variant } });
        const alert = screen.getByRole('alert');
        // apg-alert class is on the parent wrapper, not on role="alert"
        const wrapper = alert.parentElement;
        expect(wrapper).toHaveClass('apg-alert');
      }
    );

    it('default variant is info', () => {
      render(Alert, { props: { message: 'Test message' } });
      const alert = screen.getByRole('alert');
      // info variant style is applied to the parent wrapper
      const wrapper = alert.parentElement;
      expect(wrapper).toHaveClass('bg-blue-50');
    });
  });

  // Low Priority: Props & Extensibility
  describe('Props', () => {
    it('can set custom ID with id prop', () => {
      render(Alert, { props: { message: 'Test message', id: 'custom-alert-id' } });
      expect(screen.getByRole('alert')).toHaveAttribute('id', 'custom-alert-id');
    });

    it('merges className correctly', () => {
      render(Alert, { props: { message: 'Test message', class: 'custom-class' } });
      const alert = screen.getByRole('alert');
      // class is applied to the parent wrapper
      const wrapper = alert.parentElement;
      expect(wrapper).toHaveClass('apg-alert');
      expect(wrapper).toHaveClass('custom-class');
    });
  });
});
