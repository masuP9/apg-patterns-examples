<script lang="ts">
  import Toolbar from '../Toolbar.svelte';
  import ToolbarButton from '../ToolbarButton.svelte';
  import ToolbarSeparator from '../ToolbarSeparator.svelte';
</script>

<Toolbar aria-label="Actions" orientation="vertical">
  <ToolbarButton>New</ToolbarButton>
  <ToolbarButton>Open</ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Save</ToolbarButton>
</Toolbar>
