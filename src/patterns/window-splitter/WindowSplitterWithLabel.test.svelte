<script lang="ts">
  import WindowSplitter from './WindowSplitter.svelte';
</script>

<div>
  <span id="splitter-label">Panel Divider</span>
  <div id="primary">Primary Pane</div>
  <WindowSplitter primaryPaneId="primary" aria-labelledby="splitter-label" />
</div>
