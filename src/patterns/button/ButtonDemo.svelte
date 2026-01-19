<script lang="ts">
  import Button from './Button.svelte';

  let clickCount = $state(0);
  let isFavorite = $state(false);

  function handleEnabledClick() {
    alert('Clicked!');
  }

  function handleDisabledClick() {
    alert('This should not fire!');
  }

  function handleSettingsClick() {
    alert('Settings clicked!');
  }
</script>

<div class="space-y-8">
  <!-- Basic Button -->
  <section>
    <h3 class="mb-4 text-lg font-semibold">Basic Button</h3>
    <div class="space-y-4">
      <Button onClick={() => clickCount++} class="inline-flex items-center gap-2">
        <span>Click me</span>
        {#if clickCount > 0}
          <span class="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
            {clickCount}
          </span>
        {/if}
      </Button>
      <p class="text-muted-foreground text-sm">
        This custom button uses <code>role="button"</code> on a
        <code>&lt;span&gt;</code> element.
      </p>
    </div>
  </section>

  <!-- Disabled State -->
  <section>
    <h3 class="mb-4 text-lg font-semibold">Disabled State</h3>
    <div class="flex flex-wrap gap-4">
      <Button onClick={handleEnabledClick}>Enabled Button</Button>
      <Button disabled onClick={handleDisabledClick}>Disabled Button</Button>
    </div>
  </section>

  <!-- Icon Buttons -->
  <section>
    <h3 class="mb-4 text-lg font-semibold">Icon Buttons</h3>
    <div class="flex flex-wrap gap-4">
      <Button
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => (isFavorite = !isFavorite)}
        class="inline-flex h-10 w-10 items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
          />
        </svg>
      </Button>
      <Button
        aria-label="Settings"
        onClick={handleSettingsClick}
        class="inline-flex h-10 w-10 items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
          />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </Button>
    </div>
  </section>
</div>
