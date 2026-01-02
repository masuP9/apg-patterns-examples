<script lang="ts">
  import Alert, { type AlertVariant } from "./Alert.svelte";

  let variant = $state<AlertVariant>("info");
  let message = $state("");

  const messages: Record<AlertVariant, string> = {
    info: "This is an informational message.",
    success: "Operation completed successfully!",
    warning: "Please review your input before proceeding.",
    error: "An error occurred. Please try again.",
  };

  function showAlert(v: AlertVariant) {
    variant = v;
    message = messages[v];
  }

  function clearAlert() {
    message = "";
  }
</script>

<div class="space-y-4">
  <Alert
    id="demo-alert"
    {message}
    {variant}
    dismissible
    onDismiss={clearAlert}
  />
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      onclick={() => showAlert("info")}
    >
      Info
    </button>
    <button
      type="button"
      class="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-md hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      onclick={() => showAlert("success")}
    >
      Success
    </button>
    <button
      type="button"
      class="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-md hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
      onclick={() => showAlert("warning")}
    >
      Warning
    </button>
    <button
      type="button"
      class="px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      onclick={() => showAlert("error")}
    >
      Error
    </button>
  </div>
</div>
