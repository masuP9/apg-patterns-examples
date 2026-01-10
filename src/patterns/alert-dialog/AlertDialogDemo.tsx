import React from 'react';
import { AlertDialogRoot, AlertDialogTrigger, AlertDialog } from './AlertDialog';

/**
 * Alert Dialog Demo Component
 *
 * Demonstrates the Alert Dialog pattern with various use cases:
 * - Delete confirmation (destructive action)
 * - Discard changes confirmation
 * - Information acknowledgment
 */
export function AlertDialogDemo(): React.ReactElement {
  return (
    <div className="space-y-8">
      {/* Delete Confirmation Example */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Delete Confirmation</h3>
        <p className="text-muted-foreground text-sm">
          A destructive action that requires explicit confirmation. Escape key is disabled.
        </p>
        <AlertDialogRoot>
          <AlertDialogTrigger className="bg-destructive text-destructive-foreground rounded-md px-4 py-2 hover:opacity-90">
            Delete Item
          </AlertDialogTrigger>
          <AlertDialog
            title="Delete this item?"
            message="This action cannot be undone. This will permanently delete the item from your account."
            confirmLabel="Delete"
            cancelLabel="Cancel"
            confirmVariant="danger"
          />
        </AlertDialogRoot>
      </section>

      {/* Discard Changes Example */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Discard Changes</h3>
        <p className="text-muted-foreground text-sm">Confirm before losing unsaved changes.</p>
        <AlertDialogRoot>
          <AlertDialogTrigger className="bg-secondary text-secondary-foreground rounded-md px-4 py-2 hover:opacity-90">
            Close Editor
          </AlertDialogTrigger>
          <AlertDialog
            title="Discard unsaved changes?"
            message="You have unsaved changes. Are you sure you want to discard them?"
            confirmLabel="Discard"
            cancelLabel="Keep Editing"
          />
        </AlertDialogRoot>
      </section>

      {/* Information Acknowledgment Example */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Information Acknowledgment</h3>
        <p className="text-muted-foreground text-sm">
          Non-destructive alert with Escape key enabled.
        </p>
        <AlertDialogRoot>
          <AlertDialogTrigger className="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:opacity-90">
            Show Notice
          </AlertDialogTrigger>
          <AlertDialog
            title="System Maintenance"
            message="The system will undergo maintenance on Sunday at 2:00 AM. Please save your work before then."
            confirmLabel="Understood"
            cancelLabel="Remind Me Later"
            allowEscapeClose={true}
          />
        </AlertDialogRoot>
      </section>
    </div>
  );
}

export default AlertDialogDemo;
