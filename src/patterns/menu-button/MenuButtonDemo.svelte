<script lang="ts">
  import MenuButton, { type MenuItem } from './MenuButton.svelte';

  interface Props {
    variant?: 'basic' | 'disabled-items';
  }

  let { variant = 'basic' }: Props = $props();

  const actionItems: MenuItem[] = [
    { id: 'cut', label: 'Cut' },
    { id: 'copy', label: 'Copy' },
    { id: 'paste', label: 'Paste' },
    { id: 'delete', label: 'Delete' },
  ];

  const fileItems: MenuItem[] = [
    { id: 'new', label: 'New File' },
    { id: 'open', label: 'Open...' },
    { id: 'save', label: 'Save' },
    { id: 'save-as', label: 'Save As...' },
    { id: 'export', label: 'Export', disabled: true },
    { id: 'print', label: 'Print' },
  ];

  let items = $derived(variant === 'disabled-items' ? fileItems : actionItems);
  let label = $derived(variant === 'disabled-items' ? 'File' : 'Actions');
  let showNote = $derived(variant === 'disabled-items');

  let lastAction = $state<string | null>(null);

  function handleItemSelect(itemId: string) {
    lastAction = itemId;
  }
</script>

<div class="space-y-4">
  <MenuButton {items} {label} onItemSelect={handleItemSelect} />
  <p class="text-muted-foreground text-sm">
    Last action: {lastAction ?? 'None'}
  </p>
  {#if showNote}
    <p class="text-muted-foreground text-xs">
      Note: "Export" is disabled and will be skipped during keyboard navigation
    </p>
  {/if}
</div>
