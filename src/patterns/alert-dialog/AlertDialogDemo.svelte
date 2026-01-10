<!--
  Alert Dialog Demo Component

  Demonstrates the Alert Dialog pattern with various use cases:
  - Delete confirmation (destructive action)
  - Discard changes confirmation
  - Information acknowledgment
-->
<script lang="ts">
  import AlertDialog from './AlertDialog.svelte';
</script>

<div class="space-y-8">
  <!-- Delete Confirmation Example -->
  <section class="space-y-4">
    <h3 class="text-lg font-semibold">Delete Confirmation</h3>
    <p class="text-muted-foreground text-sm">
      A destructive action that requires explicit confirmation. Escape key is disabled.
    </p>
    <AlertDialog
      title="Delete this item?"
      message="This action cannot be undone. This will permanently delete the item from your account."
      confirmLabel="Delete"
      cancelLabel="Cancel"
      confirmVariant="danger"
    >
      {#snippet trigger({ open })}
        <button
          type="button"
          class="bg-destructive text-destructive-foreground rounded-md px-4 py-2 hover:opacity-90"
          onclick={open}
        >
          Delete Item
        </button>
      {/snippet}
    </AlertDialog>
  </section>

  <!-- Discard Changes Example -->
  <section class="space-y-4">
    <h3 class="text-lg font-semibold">Discard Changes</h3>
    <p class="text-muted-foreground text-sm">Confirm before losing unsaved changes.</p>
    <AlertDialog
      title="Discard unsaved changes?"
      message="You have unsaved changes. Are you sure you want to discard them?"
      confirmLabel="Discard"
      cancelLabel="Keep Editing"
    >
      {#snippet trigger({ open })}
        <button
          type="button"
          class="bg-secondary text-secondary-foreground rounded-md px-4 py-2 hover:opacity-90"
          onclick={open}
        >
          Close Editor
        </button>
      {/snippet}
    </AlertDialog>
  </section>

  <!-- Information Acknowledgment Example -->
  <section class="space-y-4">
    <h3 class="text-lg font-semibold">Information Acknowledgment</h3>
    <p class="text-muted-foreground text-sm">Non-destructive alert with Escape key enabled.</p>
    <AlertDialog
      title="System Maintenance"
      message="The system will undergo maintenance on Sunday at 2:00 AM. Please save your work before then."
      confirmLabel="Understood"
      cancelLabel="Remind Me Later"
      allowEscapeClose={true}
    >
      {#snippet trigger({ open })}
        <button
          type="button"
          class="bg-primary text-primary-foreground rounded-md px-4 py-2 hover:opacity-90"
          onclick={open}
        >
          Show Notice
        </button>
      {/snippet}
    </AlertDialog>
  </section>
</div>
