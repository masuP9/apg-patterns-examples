<script lang="ts">
  import MenuButton, { type MenuItem } from './MenuButton.svelte';

  interface Props {
    items: MenuItem[];
    multipleInstances?: boolean;
    onItemSelect?: (itemId: string) => void;
  }

  let { items, multipleInstances = false, onItemSelect }: Props = $props();
</script>

{#if multipleInstances}
  <div>
    <MenuButton {items} label="Actions 1" {onItemSelect} />
    <MenuButton {items} label="Actions 2" {onItemSelect} />
  </div>
{:else}
  <div>
    <MenuButton {items} label="Actions" {onItemSelect} />
    <button>Outside</button>
  </div>
{/if}
