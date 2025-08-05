<script lang="ts">
  import ToggleButton from "../components/ToggleButton.svelte";

  let notification = false;
  let darkMode = false;

  function handleNotificationToggle(pressed: boolean) {
    notification = pressed;
  }

  function handleDarkModeToggle(pressed: boolean) {
    darkMode = pressed;
  }
</script>

<div class="p-8">
  <div class="flex gap-4">
    <ToggleButton
      initialPressed={notification}
      onToggle={handleNotificationToggle}
      aria-label="Toggle email notifications"
    >
      📧 Email Notifications
    </ToggleButton>

    <ToggleButton
      initialPressed={darkMode}
      onToggle={handleDarkModeToggle}
      aria-label="Toggle dark mode"
    >
      🌙 Dark Mode
    </ToggleButton>
  </div>
</div>