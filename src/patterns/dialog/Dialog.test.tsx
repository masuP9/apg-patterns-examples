import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DialogRoot, DialogTrigger, Dialog } from './Dialog';

// Test wrapper component
function TestDialog({
  title = 'Test Dialog',
  description,
  closeOnOverlayClick = true,
  defaultOpen = false,
  onOpenChange,
  children = <p>Dialog content</p>,
}: {
  title?: string;
  description?: string;
  closeOnOverlayClick?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <DialogRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>Open Dialog</DialogTrigger>
      <Dialog title={title} description={description} closeOnOverlayClick={closeOnOverlayClick}>
        {children}
      </Dialog>
    </DialogRoot>
  );
}

describe('Dialog', () => {
  // 🔴 High Priority: APG Core Compliance
  describe('APG: Keyboard Interaction', () => {
    it('closes dialog with Escape key', async () => {
      const user = userEvent.setup();
      render(<TestDialog />);

      // Open dialog
      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Close with Escape
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('APG: ARIA Attributes', () => {
    it('has role="dialog"', async () => {
      const user = userEvent.setup();
      render(<TestDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('has aria-modal="true"', async () => {
      const user = userEvent.setup();
      render(<TestDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    });

    it('references title with aria-labelledby', async () => {
      const user = userEvent.setup();
      render(<TestDialog title="My Dialog Title" />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');
      const titleId = dialog.getAttribute('aria-labelledby');

      expect(titleId).toBeTruthy();
      expect(document.getElementById(titleId!)).toHaveTextContent('My Dialog Title');
    });

    it('references description with aria-describedby when present', async () => {
      const user = userEvent.setup();
      render(<TestDialog description="This is a description" />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      await vi.waitFor(() => {
        const dialog = screen.getByRole('dialog');
        const descriptionId = dialog.getAttribute('aria-describedby');

        expect(descriptionId).toBeTruthy();
        expect(document.getElementById(descriptionId!)).toHaveTextContent('This is a description');
      });
    });

    it('has no aria-describedby when description is absent', async () => {
      const user = userEvent.setup();
      render(<TestDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      expect(dialog).not.toHaveAttribute('aria-describedby');
    });
  });

  describe('APG: Focus Management', () => {
    it('focuses first focusable element when opened', async () => {
      const user = userEvent.setup();
      render(<TestDialog />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      // Focus moves to first focusable element in dialog (Close button)
      await vi.waitFor(() => {
        expect(screen.getByRole('button', { name: 'Close dialog' })).toHaveFocus();
      });
    });

    // Note: Testing autofocus attribute is difficult in jsdom environment
    // because React's autoFocus uses its own focus management, not DOM attributes.
    // Recommended to verify with browser E2E tests (Playwright).

    it('restores focus to trigger when closed', async () => {
      const user = userEvent.setup();
      render(<TestDialog />);

      const trigger = screen.getByRole('button', { name: 'Open Dialog' });
      await user.click(trigger);
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      await vi.waitFor(() => {
        expect(trigger).toHaveFocus();
      });
    });

    // Note: Focus trap is handled by native <dialog> element's showModal().
    // jsdom does not implement showModal()'s focus trap behavior,
    // so these tests should be verified with browser E2E tests (Playwright).
  });

  // 🟡 Medium Priority: Accessibility Validation
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const user = userEvent.setup();
      const { container } = render(<TestDialog description="Description" />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Props', () => {
    it('displays title', async () => {
      const user = userEvent.setup();
      render(<TestDialog title="Custom Title" />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('displays description', async () => {
      const user = userEvent.setup();
      render(<TestDialog description="Custom Description" />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByText('Custom Description')).toBeInTheDocument();
    });

    it('closes on overlay click when closeOnOverlayClick=true', async () => {
      const user = userEvent.setup();
      render(<TestDialog closeOnOverlayClick={true} />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      // Click dialog element itself (equivalent to overlay)
      await user.click(dialog);
      await vi.waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });
    });

    it('does not close on overlay click when closeOnOverlayClick=false', async () => {
      const user = userEvent.setup();
      render(<TestDialog closeOnOverlayClick={false} />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      const dialog = screen.getByRole('dialog');

      // Click dialog element itself
      await user.click(dialog);
      await vi.waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });

    it('calls onOpenChange when opened and closed', async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(<TestDialog onOpenChange={onOpenChange} />);

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(onOpenChange).toHaveBeenCalledWith(true);

      // Close with Close button
      await user.click(screen.getByRole('button', { name: 'Close dialog' }));
      await vi.waitFor(() => {
        expect(onOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('initially displayed when defaultOpen=true', async () => {
      render(<TestDialog defaultOpen={true} />);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  // 🟢 Low Priority: Extensibility
  describe('HTML Attribute Inheritance', () => {
    it('applies className to dialog', async () => {
      const user = userEvent.setup();
      render(
        <DialogRoot>
          <DialogTrigger>Open</DialogTrigger>
          <Dialog title="Test" className="custom-class">
            Content
          </Dialog>
        </DialogRoot>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));
      expect(screen.getByRole('dialog')).toHaveClass('custom-class');
    });

    it('applies className to trigger', async () => {
      render(
        <DialogRoot>
          <DialogTrigger className="trigger-class">Open</DialogTrigger>
          <Dialog title="Test">Content</Dialog>
        </DialogRoot>
      );

      expect(screen.getByRole('button', { name: 'Open' })).toHaveClass('trigger-class');
    });
  });
});
