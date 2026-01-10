import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

// ============================================================================
// Context
// ============================================================================

interface AlertDialogContextValue {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  titleId: string;
  messageId: string;
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null);

function useAlertDialogContext() {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error('AlertDialog components must be used within an AlertDialogRoot');
  }
  return context;
}

// ============================================================================
// AlertDialogRoot
// ============================================================================

export interface AlertDialogRootProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function AlertDialogRoot({
  children,
  defaultOpen = false,
}: AlertDialogRootProps): React.ReactElement {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const instanceId = useId();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Open on mount if defaultOpen
  useEffect(() => {
    if (mounted && defaultOpen && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [mounted, defaultOpen]);

  const open = useCallback(() => {
    if (dialogRef.current) {
      const { activeElement } = document;
      triggerRef.current = activeElement instanceof HTMLElement ? activeElement : null;
      // Lock body scroll
      document.body.style.overflow = 'hidden';
      dialogRef.current.showModal();
    }
  }, []);

  const close = useCallback(() => {
    // Unlock body scroll
    document.body.style.overflow = '';
    dialogRef.current?.close();
    triggerRef.current?.focus();
  }, []);

  // Handle dialog close event
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      // Unlock body scroll
      document.body.style.overflow = '';
      triggerRef.current?.focus();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [mounted]);

  const contextValue: AlertDialogContextValue = {
    dialogRef,
    open,
    close,
    titleId: `${instanceId}-title`,
    messageId: `${instanceId}-message`,
  };

  return <AlertDialogContext.Provider value={contextValue}>{children}</AlertDialogContext.Provider>;
}

// ============================================================================
// AlertDialogTrigger
// ============================================================================

export interface AlertDialogTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  children: React.ReactNode;
}

export function AlertDialogTrigger({
  children,
  className = '',
  ...buttonProps
}: AlertDialogTriggerProps): React.ReactElement {
  const { open } = useAlertDialogContext();

  return (
    <button
      type="button"
      className={`apg-alert-dialog-trigger ${className}`.trim()}
      onClick={open}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

// ============================================================================
// AlertDialog
// ============================================================================

export interface AlertDialogProps {
  /** Dialog title (required for accessibility) */
  title: string;
  /** Alert message (required - unlike regular Dialog) */
  message: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Confirm button variant */
  confirmVariant?: 'default' | 'danger';
  /** Allow closing with Escape key (default: false - unlike regular Dialog) */
  allowEscapeClose?: boolean;
  /** Callback when confirm button is clicked */
  onConfirm?: () => void;
  /** Callback when cancel button is clicked */
  onCancel?: () => void;
  /** Additional CSS class */
  className?: string;
}

export function AlertDialog({
  title,
  message,
  confirmLabel = 'OK',
  cancelLabel = 'Cancel',
  confirmVariant = 'default',
  allowEscapeClose = false,
  onConfirm,
  onCancel,
  className = '',
}: AlertDialogProps): React.ReactElement | null {
  const { dialogRef, close, titleId, messageId } = useAlertDialogContext();
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Focus cancel button when dialog opens (safest action)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleOpen = () => {
      // Use requestAnimationFrame to ensure dialog is fully rendered
      requestAnimationFrame(() => {
        cancelButtonRef.current?.focus();
      });
    };

    // MutationObserver to detect when dialog is opened
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.attributeName === 'open' && dialog.hasAttribute('open')) {
          handleOpen();
        }
      }
    });

    observer.observe(dialog, { attributes: true });
    return () => observer.disconnect();
  }, [dialogRef, mounted]);

  // Handle cancel event (fired by native dialog on Escape key in browsers)
  // This event fires BEFORE keydown, so we must handle it here
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      if (!allowEscapeClose) {
        event.preventDefault();
      } else {
        onCancel?.();
      }
    };

    dialog.addEventListener('cancel', handleCancel);
    return () => dialog.removeEventListener('cancel', handleCancel);
  }, [dialogRef, allowEscapeClose, onCancel, mounted]);

  // Handle Escape keydown (for JSDOM and environments where cancel event is not fired)
  // Listen at document level in capture phase to intercept before any default behavior
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Escape when dialog is open
      if (event.key === 'Escape' && dialog.hasAttribute('open')) {
        // Prevent default to stop any built-in close behavior
        event.preventDefault();
        event.stopPropagation();
        if (allowEscapeClose) {
          onCancel?.();
          close();
        }
      }
    };

    // Use document level capture phase to intercept before dialog's default behavior
    document.addEventListener('keydown', handleKeyDown, true);
    return () => document.removeEventListener('keydown', handleKeyDown, true);
  }, [dialogRef, allowEscapeClose, onCancel, close, mounted]);

  // Manual focus trap for JSDOM and older browsers
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift+Tab from first element -> wrap to last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab from last element -> wrap to first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    dialog.addEventListener('keydown', handleKeyDown);
    return () => dialog.removeEventListener('keydown', handleKeyDown);
  }, [dialogRef, mounted]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    close();
  }, [onConfirm, close]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    close();
  }, [onCancel, close]);

  // SSR safety
  if (typeof document === 'undefined') return null;
  if (!mounted) return null;

  const confirmButtonClass =
    `apg-alert-dialog-confirm ${confirmVariant === 'danger' ? 'apg-alert-dialog-confirm--danger' : ''}`.trim();

  return createPortal(
    <dialog
      ref={dialogRef}
      role="alertdialog"
      className={`apg-alert-dialog ${className}`.trim()}
      aria-labelledby={titleId}
      aria-describedby={messageId}
    >
      <h2 id={titleId} className="apg-alert-dialog-title">
        {title}
      </h2>
      <p id={messageId} className="apg-alert-dialog-message">
        {message}
      </p>
      <div className="apg-alert-dialog-actions">
        <button
          ref={cancelButtonRef}
          type="button"
          className="apg-alert-dialog-cancel"
          onClick={handleCancel}
        >
          {cancelLabel}
        </button>
        <button type="button" className={confirmButtonClass} onClick={handleConfirm}>
          {confirmLabel}
        </button>
      </div>
    </dialog>,
    document.body
  );
}

// ============================================================================
// Exports
// ============================================================================

export default {
  Root: AlertDialogRoot,
  Trigger: AlertDialogTrigger,
  Content: AlertDialog,
};
