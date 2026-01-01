<script lang="ts">
  import Toolbar from './Toolbar.svelte';
  import ToolbarToggleButton from './ToolbarToggleButton.svelte';
  import ToolbarSeparator from './ToolbarSeparator.svelte';
</script>

<Toolbar aria-label="Default pressed states">
  <ToolbarToggleButton defaultPressed={true}>Bold (default on)</ToolbarToggleButton>
  <ToolbarToggleButton>Italic (default off)</ToolbarToggleButton>
  <ToolbarSeparator />
  <ToolbarToggleButton defaultPressed={true} disabled>
    Disabled (pressed)
  </ToolbarToggleButton>
  <ToolbarToggleButton disabled>
    Disabled (not pressed)
  </ToolbarToggleButton>
</Toolbar>
