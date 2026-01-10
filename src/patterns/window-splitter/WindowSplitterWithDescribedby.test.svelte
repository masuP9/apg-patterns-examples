<script lang="ts">
  import WindowSplitter from './WindowSplitter.svelte';
</script>

<div>
  <div id="primary">Primary Pane</div>
  <WindowSplitter
    primaryPaneId="primary"
    aria-label="Resize"
    aria-describedby="help"
  />
  <p id="help">Press Enter to collapse</p>
</div>
