<script lang="ts">
  import Toolbar from '../Toolbar.svelte';
  import ToolbarButton from '../ToolbarButton.svelte';
  import ToolbarToggleButton from '../ToolbarToggleButton.svelte';
  import ToolbarSeparator from '../ToolbarSeparator.svelte';
</script>

<Toolbar aria-label="Text formatting">
  <ToolbarToggleButton>Bold</ToolbarToggleButton>
  <ToolbarToggleButton>Italic</ToolbarToggleButton>
  <ToolbarSeparator />
  <ToolbarButton>Copy</ToolbarButton>
  <ToolbarButton>Paste</ToolbarButton>
</Toolbar>
