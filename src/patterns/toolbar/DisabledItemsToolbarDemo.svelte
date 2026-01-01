<script lang="ts">
  import Toolbar from './Toolbar.svelte';
  import ToolbarButton from './ToolbarButton.svelte';
  import ToolbarSeparator from './ToolbarSeparator.svelte';
</script>

<Toolbar aria-label="Edit actions">
  <ToolbarButton>Undo</ToolbarButton>
  <ToolbarButton disabled>Redo</ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Cut</ToolbarButton>
  <ToolbarButton>Copy</ToolbarButton>
  <ToolbarButton disabled>Paste</ToolbarButton>
</Toolbar>
