<script lang="ts">
  import { Volume2, VolumeOff, Sun, Moon, Bell, BellOff } from 'lucide-svelte';
  import ToggleButton from './ToggleButton.svelte';
</script>

<div class="flex flex-wrap gap-4">
  <ToggleButton>
    {#snippet pressedIndicator()}<VolumeOff size={20} />{/snippet}
    {#snippet unpressedIndicator()}<Volume2 size={20} />{/snippet}
    Mute
  </ToggleButton>
  <ToggleButton initialPressed={true}>
    {#snippet pressedIndicator()}<Moon size={20} />{/snippet}
    {#snippet unpressedIndicator()}<Sun size={20} />{/snippet}
    Dark Mode
  </ToggleButton>
  <ToggleButton disabled>
    {#snippet pressedIndicator()}<BellOff size={20} />{/snippet}
    {#snippet unpressedIndicator()}<Bell size={20} />{/snippet}
    Notifications
  </ToggleButton>
</div>
