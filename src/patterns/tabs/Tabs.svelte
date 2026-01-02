<script lang="ts">
  import { onMount } from 'svelte';

  export interface TabItem {
    id: string;
    label: string;
    content?: string;
    disabled?: boolean;
  }

  interface TabsProps {
    tabs: TabItem[];
    defaultSelectedId?: string;
    orientation?: 'horizontal' | 'vertical';
    activationMode?: 'automatic' | 'manual';
    label?: string;
    onSelectionChange?: (tabId: string) => void;
  }

  let {
    tabs = [],
    defaultSelectedId = undefined,
    orientation = 'horizontal',
    activationMode = 'automatic',
    label = undefined,
    onSelectionChange = () => {},
  }: TabsProps = $props();

  let selectedId = $state('');
  let focusedIndex = $state(0);
  let tablistElement: HTMLElement;
  let tabRefs: Record<string, HTMLButtonElement> = {};
  let tablistId = $state('');

  onMount(() => {
    tablistId = `tabs-${Math.random().toString(36).substr(2, 9)}`;
  });

  // Initialize selected tab
  $effect(() => {
    if (tabs.length > 0 && !selectedId) {
      const initialTab = defaultSelectedId
        ? tabs.find((tab) => tab.id === defaultSelectedId && !tab.disabled)
        : tabs.find((tab) => !tab.disabled);
      selectedId = initialTab?.id || tabs[0]?.id;
    }
  });

  // Derived values
  let availableTabs = $derived(tabs.filter((tab) => !tab.disabled));

  let containerClass = $derived(
    `apg-tabs ${orientation === 'vertical' ? 'apg-tabs--vertical' : 'apg-tabs--horizontal'}`
  );

  let tablistClass = $derived(
    `apg-tablist ${orientation === 'vertical' ? 'apg-tablist--vertical' : 'apg-tablist--horizontal'}`
  );

  function getTabClass(tab: TabItem): string {
    const classes = ['apg-tab'];
    classes.push(orientation === 'vertical' ? 'apg-tab--vertical' : 'apg-tab--horizontal');
    if (tab.id === selectedId) classes.push('apg-tab--selected');
    if (tab.disabled) classes.push('apg-tab--disabled');
    return classes.join(' ');
  }

  function getPanelClass(tab: TabItem): string {
    return `apg-tabpanel ${tab.id === selectedId ? 'apg-tabpanel--active' : 'apg-tabpanel--inactive'}`;
  }

  function handleTabSelection(tabId: string) {
    selectedId = tabId;
    onSelectionChange(tabId);
  }

  function handleTabFocus(index: number) {
    focusedIndex = index;
    const tab = availableTabs[index];
    if (tab && tabRefs[tab.id]) {
      tabRefs[tab.id].focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    const target = event.target;
    if (!tablistElement || !(target instanceof Node) || !tablistElement.contains(target)) {
      return;
    }

    let newIndex = focusedIndex;
    let shouldPreventDefault = false;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = (focusedIndex + 1) % availableTabs.length;
        shouldPreventDefault = true;
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = (focusedIndex - 1 + availableTabs.length) % availableTabs.length;
        shouldPreventDefault = true;
        break;

      case 'Home':
        newIndex = 0;
        shouldPreventDefault = true;
        break;

      case 'End':
        newIndex = availableTabs.length - 1;
        shouldPreventDefault = true;
        break;

      case 'Enter':
      case ' ':
        if (activationMode === 'manual') {
          const focusedTab = availableTabs[focusedIndex];
          if (focusedTab) {
            handleTabSelection(focusedTab.id);
          }
        }
        shouldPreventDefault = true;
        break;
    }

    if (shouldPreventDefault) {
      event.preventDefault();

      if (newIndex !== focusedIndex) {
        handleTabFocus(newIndex);

        if (activationMode === 'automatic') {
          const newTab = availableTabs[newIndex];
          if (newTab) {
            handleTabSelection(newTab.id);
          }
        }
      }
    }
  }

  // Update focused index when selected tab changes
  $effect(() => {
    const selectedIndex = availableTabs.findIndex((tab) => tab.id === selectedId);
    if (selectedIndex >= 0) {
      focusedIndex = selectedIndex;
    }
  });
</script>

<div class={containerClass}>
  <div
    bind:this={tablistElement}
    role="tablist"
    aria-orientation={orientation}
    class={tablistClass}
    onkeydown={handleKeyDown}
  >
    {#each tabs as tab}
      {@const isSelected = tab.id === selectedId}
      {@const tabIndex = tab.disabled ? -1 : isSelected ? 0 : -1}

      <button
        bind:this={tabRefs[tab.id]}
        role="tab"
        type="button"
        id="{tablistId}-tab-{tab.id}"
        aria-selected={isSelected}
        aria-controls={isSelected ? `${tablistId}-panel-${tab.id}` : undefined}
        tabindex={tabIndex}
        disabled={tab.disabled}
        class={getTabClass(tab)}
        onclick={() => !tab.disabled && handleTabSelection(tab.id)}
      >
        <span class="apg-tab-label">{tab.label}</span>
      </button>
    {/each}
  </div>

  <div class="apg-tabpanels">
    {#each tabs as tab}
      {@const isSelected = tab.id === selectedId}

      <div
        role="tabpanel"
        id="{tablistId}-panel-{tab.id}"
        aria-labelledby="{tablistId}-tab-{tab.id}"
        hidden={!isSelected}
        class={getPanelClass(tab)}
        tabindex={isSelected ? 0 : -1}
      >
        {#if tab.content}
          {@html tab.content}
        {/if}
      </div>
    {/each}
  </div>
</div>
