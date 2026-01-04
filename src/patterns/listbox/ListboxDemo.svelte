<script lang="ts">
  import { onMount } from 'svelte';
  import Listbox, { type ListboxOption } from './Listbox.svelte';

  interface ListboxDemoProps {
    options: ListboxOption[];
    label: string;
    multiselectable?: boolean;
    orientation?: 'vertical' | 'horizontal';
    defaultSelectedIds?: string[];
  }

  let {
    options = [],
    label = '',
    multiselectable = false,
    orientation = 'vertical',
    defaultSelectedIds = [],
  }: ListboxDemoProps = $props();

  let labelId = $state('');
  let selectedIds = $state<string[]>([]);

  onMount(() => {
    labelId = `listbox-label-${Math.random().toString(36).substr(2, 9)}`;
    selectedIds = defaultSelectedIds;
  });

  let selectedDisplay = $derived(selectedIds.length > 0 ? selectedIds.join(', ') : 'None');

  function handleSelectionChange(ids: string[]) {
    selectedIds = ids;
  }
</script>

<div class="space-y-4">
  <div>
    <label id={labelId} class="mb-2 block text-sm font-medium">
      {label}
    </label>
    <Listbox
      {options}
      {multiselectable}
      {orientation}
      {defaultSelectedIds}
      ariaLabelledby={labelId}
      onSelectionChange={handleSelectionChange}
    />
  </div>
  <p class="text-muted-foreground text-sm">
    Selected: {selectedDisplay}
  </p>
  {#if multiselectable}
    <p class="text-muted-foreground text-xs">
      Tip: Use Space to toggle, Shift+Arrow to extend selection, Ctrl+A to select all
    </p>
  {/if}
</div>
