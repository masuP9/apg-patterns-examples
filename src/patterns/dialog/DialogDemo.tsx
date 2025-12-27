/**
 * Dialog Demo Component
 *
 * A wrapper component for demonstrating the Dialog pattern in Astro pages.
 * This combines DialogRoot, DialogTrigger, and Dialog into a single component
 * that works seamlessly with Astro's islands architecture.
 */

import React from "react";
import { DialogRoot, DialogTrigger, Dialog } from "./Dialog";

export interface DialogDemoProps {
  /** Dialog title (required for accessibility) */
  title: string;
  /** Optional description text */
  description?: string;
  /** Text for the trigger button */
  triggerText: string;
  /** Additional CSS class for trigger button */
  triggerClass?: string;
  /** Dialog content */
  children: React.ReactNode;
  /** Default open state */
  defaultOpen?: boolean;
  /** Close on overlay click */
  closeOnOverlayClick?: boolean;
  /** Additional CSS class for dialog */
  className?: string;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
}

export function DialogDemo({
  title,
  description,
  triggerText,
  triggerClass = "",
  children,
  defaultOpen = false,
  closeOnOverlayClick = true,
  className = "",
  onOpenChange,
}: DialogDemoProps): React.ReactElement {
  return (
    <DialogRoot defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className={triggerClass}>{triggerText}</DialogTrigger>
      <Dialog
        title={title}
        description={description}
        closeOnOverlayClick={closeOnOverlayClick}
        className={className}
      >
        {children}
      </Dialog>
    </DialogRoot>
  );
}

export default DialogDemo;
