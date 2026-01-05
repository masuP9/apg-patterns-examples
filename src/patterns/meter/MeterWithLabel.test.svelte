<script lang="ts">
  import Meter from './Meter.svelte';
</script>

<div>
  <span id="meter-label">Battery Level</span>
  <Meter value={80} aria-labelledby="meter-label" />
</div>
