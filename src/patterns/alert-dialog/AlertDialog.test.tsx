import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialogRoot, AlertDialogTrigger, AlertDialog } from './AlertDialog';

// Test wrapper component
function TestAlertDialog({
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'default' as const,
  allowEscapeClose = false,
  defaultOpen = false,
  onConfirm,
  onCancel,
}: {
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'default' | 'danger';
  allowEscapeClose?: boolean;
  defaultOpen?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}) {
  return (
    <AlertDialogRoot defaultOpen={defaultOpen}>
      <AlertDialogTrigger>Open Alert</AlertDialogTrigger>
      <AlertDialog
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        confirmVariant={confirmVariant}
        allowEscapeClose={allowEscapeClose}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </AlertDialogRoot>
  );
}

describe('AlertDialog', () => {
  // 🔴 High Priority: APG ARIA Attributes
  describe('APG: ARIA Attributes', () => {
    it('has role="alertdialog" (NOT dialog)', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      // Must be alertdialog, not dialog
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('has aria-modal="true"', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('has aria-labelledby referencing title', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog title="Delete Item" />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      const dialog = screen.getByRole('alertdialog');
      const titleId = dialog.getAttribute('aria-labelledby');

      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)).toHaveTextContent('Delete Item');
    });

    it('has aria-describedby referencing message (REQUIRED unlike Dialog)', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog message="This action cannot be undone." />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      const dialog = screen.getByRole('alertdialog');
      const messageId = dialog.getAttribute('aria-describedby');

      expect(messageId).toBeTruthy();
      expect(document.getElementById(messageId!)).toHaveTextContent(
        'This action cannot be undone.'
      );
    });
  });

  // 🔴 High Priority: APG Keyboard Interaction
  describe('APG: Keyboard Interaction', () => {
    it('does NOT close on Escape by default (unlike Dialog)', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<TestAlertDialog onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      // Should NOT close
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(onCancel).not.toHaveBeenCalled();
    });

    it('closes on Escape when allowEscapeClose=true', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<TestAlertDialog allowEscapeClose={true} onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
      expect(onCancel).toHaveBeenCalled();
    });

    it('Tab moves focus to next focusable element', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      // Initial focus should be on Cancel
      await vi.waitFor(() => {
        expect(cancelButton).toHaveFocus();
      });

      await user.tab();
      expect(confirmButton).toHaveFocus();
    });

    it('Shift+Tab moves focus to previous focusable element', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      // Move to confirm button first
      await vi.waitFor(() => {
        expect(cancelButton).toHaveFocus();
      });
      await user.tab();
      expect(confirmButton).toHaveFocus();

      // Shift+Tab back to cancel
      await user.tab({ shift: true });
      expect(cancelButton).toHaveFocus();
    });

    it('Tab wraps from last to first element', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      await vi.waitFor(() => {
        expect(cancelButton).toHaveFocus();
      });

      // Tab to confirm
      await user.tab();
      expect(confirmButton).toHaveFocus();

      // Tab should wrap to cancel
      await user.tab();
      expect(cancelButton).toHaveFocus();
    });

    it('Shift+Tab wraps from first to last element', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      const confirmButton = screen.getByRole('button', { name: 'Confirm' });

      await vi.waitFor(() => {
        expect(cancelButton).toHaveFocus();
      });

      // Shift+Tab should wrap to confirm
      await user.tab({ shift: true });
      expect(confirmButton).toHaveFocus();
    });

    it('Enter activates focused button', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<TestAlertDialog onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
      });

      await user.keyboard('{Enter}');
      expect(onCancel).toHaveBeenCalled();
    });

    it('Space activates focused button', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<TestAlertDialog onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
      });

      await user.keyboard(' ');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('APG: Focus Management', () => {
    it('focuses Cancel button on open (safest action, unlike Dialog)', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog cancelLabel="Cancel" confirmLabel="Delete" />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      await vi.waitFor(() => {
        // Cancel should be focused, NOT Delete (destructive action)
        expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
      });
    });

    it('returns focus to trigger when closed via Cancel', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Alert' });
      await user.click(trigger);

      await vi.waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(trigger).toHaveFocus();
    });

    it('returns focus to trigger when closed via Confirm', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Alert' });
      await user.click(trigger);

      await vi.waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(trigger).toHaveFocus();
    });

    it('returns focus to trigger when closed via Escape (when allowed)', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog allowEscapeClose={true} />);

      const trigger = screen.getByRole('button', { name: 'Open Alert' });
      await user.click(trigger);

      await vi.waitFor(() => {
        expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');
      expect(trigger).toHaveFocus();
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const user = userEvent.setup();
      const { container } = render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟢 Low Priority: Props & Callbacks
  describe('Props & Callbacks', () => {
    it('calls onConfirm when confirm button clicked', async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      render(<TestAlertDialog onConfirm={onConfirm} />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      await user.click(screen.getByRole('button', { name: 'Confirm' }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it('calls onCancel when cancel button clicked', async () => {
      const user = userEvent.setup();
      const onCancel = vi.fn();
      render(<TestAlertDialog onCancel={onCancel} />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('closes dialog after confirm action', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Confirm' }));
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('closes dialog after cancel action', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    });

    it('displays custom button labels', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog confirmLabel="Delete" cancelLabel="Keep" />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Keep' })).toBeInTheDocument();
    });

    it('applies danger variant to confirm button', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog confirmVariant="danger" confirmLabel="Delete" />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
        'apg-alert-dialog-confirm--danger'
      );
    });

    it('initially displays when defaultOpen=true', async () => {
      render(<TestAlertDialog defaultOpen={true} />);
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    });
  });

  // No close button (×) by design
  describe('Alert Dialog Specific Behavior', () => {
    it('does NOT have a close button (×) unlike regular Dialog', async () => {
      const user = userEvent.setup();
      render(<TestAlertDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Alert' }));

      // Should NOT have close button
      expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument();
    });
  });
});
