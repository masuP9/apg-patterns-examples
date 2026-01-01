<script lang="ts">
  import Toolbar from './Toolbar.svelte';
  import ToolbarButton from './ToolbarButton.svelte';
  import ToolbarToggleButton from './ToolbarToggleButton.svelte';
  import ToolbarSeparator from './ToolbarSeparator.svelte';
</script>

<Toolbar aria-label="Text formatting">
  <ToolbarToggleButton>Bold</ToolbarToggleButton>
  <ToolbarToggleButton>Italic</ToolbarToggleButton>
  <ToolbarToggleButton>Underline</ToolbarToggleButton>
  <ToolbarSeparator />
  <ToolbarButton>Align Left</ToolbarButton>
  <ToolbarButton>Center</ToolbarButton>
  <ToolbarButton>Align Right</ToolbarButton>
  <ToolbarSeparator />
  <ToolbarButton>Copy</ToolbarButton>
  <ToolbarButton>Cut</ToolbarButton>
  <ToolbarButton>Paste</ToolbarButton>
</Toolbar>
