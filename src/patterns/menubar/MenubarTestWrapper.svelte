<script lang="ts">
  import Menubar from './Menubar.svelte';
  import type { MenubarItem } from './Menubar';

  interface Props {
    items: MenubarItem[];
    onItemSelect?: (id: string) => void;
  }

  let { items, onItemSelect }: Props = $props();
</script>

<div>
  <Menubar {items} aria-label="Application" {onItemSelect} />
  <button type="button">Outside</button>
</div>
