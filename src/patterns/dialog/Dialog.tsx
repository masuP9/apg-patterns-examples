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

interface DialogContextValue {
  dialogRef: React.RefObject<HTMLDialogElement | null>;
  open: () => void;
  close: () => void;
  titleId: string;
  descriptionId: string;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('Dialog components must be used within a DialogRoot');
  }
  return context;
}

// ============================================================================
// DialogRoot
// ============================================================================

export interface DialogRootProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DialogRoot({
  children,
  defaultOpen = false,
  onOpenChange,
}: DialogRootProps): React.ReactElement {
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
      onOpenChange?.(true);
    }
  }, [mounted, defaultOpen, onOpenChange]);

  const open = useCallback(() => {
    if (dialogRef.current) {
      const { activeElement } = document;
      triggerRef.current = activeElement instanceof HTMLElement ? activeElement : null;
      dialogRef.current.showModal();
      onOpenChange?.(true);
    }
  }, [onOpenChange]);

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  // Handle dialog close event (from Escape key or close() call)
  // Note: mounted must be in dependencies to re-run after Dialog component mounts
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleClose = () => {
      onOpenChange?.(false);
      triggerRef.current?.focus();
    };

    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, [onOpenChange, mounted]);

  const contextValue: DialogContextValue = {
    dialogRef,
    open,
    close,
    titleId: `${instanceId}-title`,
    descriptionId: `${instanceId}-description`,
  };

  return <DialogContext.Provider value={contextValue}>{children}</DialogContext.Provider>;
}

// ============================================================================
// DialogTrigger
// ============================================================================

export interface DialogTriggerProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick'
> {
  children: React.ReactNode;
}

export function DialogTrigger({
  children,
  className = '',
  ...buttonProps
}: DialogTriggerProps): React.ReactElement {
  const { open } = useDialogContext();

  return (
    <button
      type="button"
      className={`apg-dialog-trigger ${className}`.trim()}
      onClick={open}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

// ============================================================================
// Dialog
// ============================================================================

export interface DialogProps {
  /** Dialog title (required for accessibility) */
  title: string;
  /** Optional description text */
  description?: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Additional CSS class */
  className?: string;
}

export function Dialog({
  title,
  description,
  children,
  closeOnOverlayClick = true,
  className = '',
}: DialogProps): React.ReactElement | null {
  const { dialogRef, close, titleId, descriptionId } = useDialogContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDialogClick = useCallback(
    (event: React.MouseEvent<HTMLDialogElement>) => {
      // Close on backdrop click
      if (closeOnOverlayClick && event.target === event.currentTarget) {
        close();
      }
    },
    [closeOnOverlayClick, close]
  );

  // SSR safety
  if (typeof document === 'undefined') return null;
  if (!mounted) return null;

  return createPortal(
    // disable dialog a11y warnings, as only dropdown click. there are alternative keyboard ways to close
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
    <dialog
      ref={dialogRef}
      className={`apg-dialog ${className}`.trim()}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClick={handleDialogClick}
    >
      <div className="apg-dialog-header">
        <h2 id={titleId} className="apg-dialog-title">
          {title}
        </h2>
        <button
          type="button"
          className="apg-dialog-close"
          onClick={close}
          aria-label="Close dialog"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      {description && (
        <p id={descriptionId} className="apg-dialog-description">
          {description}
        </p>
      )}
      <div className="apg-dialog-body">{children}</div>
    </dialog>,
    document.body
  );
}

// ============================================================================
// Exports
// ============================================================================

export default {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Content: Dialog,
};
