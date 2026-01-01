<script lang="ts">
  import Toolbar from './Toolbar.svelte';
  import ToolbarButton from './ToolbarButton.svelte';
  import ToolbarSeparator from './ToolbarSeparator.svelte';
</script>

<Toolbar orientation="vertical" aria-label="Actions">
  <ToolbarButton>New</ToolbarButton>
  <ToolbarButton>Open</ToolbarButton>
  <ToolbarButton>Save</ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Print</ToolbarButton>
</Toolbar>
