<script lang="ts">
  import Toolbar from '../Toolbar.svelte';
  import ToolbarButton from '../ToolbarButton.svelte';
</script>

<Toolbar aria-label="Test toolbar">
  <ToolbarButton>First</ToolbarButton>
  <ToolbarButton disabled>Second (disabled)</ToolbarButton>
  <ToolbarButton>Third</ToolbarButton>
</Toolbar>
