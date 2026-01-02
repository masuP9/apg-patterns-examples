<script lang="ts">
  import Alert, { type AlertVariant } from './Alert.svelte';

  let variant = $state<AlertVariant>('info');
  let message = $state('');

  const messages: Record<AlertVariant, string> = {
    info: 'This is an informational message.',
    success: 'Operation completed successfully!',
    warning: 'Please review your input before proceeding.',
    error: 'An error occurred. Please try again.',
  };

  function showAlert(v: AlertVariant) {
    variant = v;
    message = messages[v];
  }

  function clearAlert() {
    message = '';
  }
</script>

<div class="space-y-4">
  <Alert id="demo-alert" {message} {variant} dismissible onDismiss={clearAlert} />
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
      onclick={() => showAlert('info')}
    >
      Info
    </button>
    <button
      type="button"
      class="rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
      onclick={() => showAlert('success')}
    >
      Success
    </button>
    <button
      type="button"
      class="rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
      onclick={() => showAlert('warning')}
    >
      Warning
    </button>
    <button
      type="button"
      class="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
      onclick={() => showAlert('error')}
    >
      Error
    </button>
  </div>
</div>
