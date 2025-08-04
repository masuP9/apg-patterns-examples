<script context="module" lang="ts">
  // Types
  export interface TabItem {
    id: string;
    label: string;
    content?: string;
    disabled?: boolean;
  }
</script>

<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  // Props
  export let tabs: TabItem[] = [];
  export let defaultSelectedId: string | undefined = undefined;
  export let orientation: 'horizontal' | 'vertical' = 'horizontal';
  export let activation: 'automatic' | 'manual' = 'automatic';
  export let deletable: boolean = false;

  // Event dispatcher
  const dispatch = createEventDispatcher<{
    selectionChange: string;
    tabDelete: string;
  }>();

  // State
  let selectedId: string;
  let focusedIndex: number = 0;
  let tablistElement: HTMLElement;
  let tabRefs: Record<string, HTMLButtonElement> = {};

  // Generate unique ID for accessibility
  let tablistId: string;
  onMount(() => {
    tablistId = `tabs-${Math.random().toString(36).substr(2, 9)}`;
  });

  // Initialize selected tab
  $: {
    if (tabs.length > 0) {
      const initialTab = defaultSelectedId 
        ? tabs.find(tab => tab.id === defaultSelectedId && !tab.disabled)
        : tabs.find(tab => !tab.disabled);
      selectedId = initialTab?.id || tabs[0]?.id;
    }
  }

  // Get available (non-disabled) tabs
  $: availableTabs = tabs.filter(tab => !tab.disabled);
  $: selectedTab = tabs.find(tab => tab.id === selectedId);

  // Update focused index when selected tab changes
  $: {
    const selectedIndex = availableTabs.findIndex(tab => tab.id === selectedId);
    if (selectedIndex >= 0) {
      focusedIndex = selectedIndex;
    }
  }

  function handleTabSelection(tabId: string) {
    selectedId = tabId;
    dispatch('selectionChange', tabId);
  }

  function handleTabFocus(index: number) {
    focusedIndex = index;
    const tab = availableTabs[index];
    if (tab && tabRefs[tab.id]) {
      tabRefs[tab.id].focus();
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Only handle keyboard events if focus is on a tab
    const target = event.target;
    if (!tablistElement || !(target instanceof Node) || !tablistElement.contains(target)) {
      return;
    }

    let newIndex = focusedIndex;
    let shouldPreventDefault = false;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        newIndex = orientation === 'horizontal' 
          ? (focusedIndex + 1) % availableTabs.length
          : (focusedIndex + 1) % availableTabs.length;
        shouldPreventDefault = true;
        break;
        
      case 'ArrowLeft':
      case 'ArrowUp':
        newIndex = orientation === 'horizontal'
          ? (focusedIndex - 1 + availableTabs.length) % availableTabs.length
          : (focusedIndex - 1 + availableTabs.length) % availableTabs.length;
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
        if (activation === 'manual') {
          const focusedTab = availableTabs[focusedIndex];
          if (focusedTab) {
            handleTabSelection(focusedTab.id);
          }
        }
        shouldPreventDefault = true;
        break;
        
      case 'Delete':
        if (deletable) {
          const focusedTab = availableTabs[focusedIndex];
          if (focusedTab) {
            dispatch('tabDelete', focusedTab.id);
          }
        }
        shouldPreventDefault = true;
        break;
    }

    if (shouldPreventDefault) {
      event.preventDefault();
      
      if (newIndex !== focusedIndex) {
        handleTabFocus(newIndex);
        
        // Automatic activation: select tab when focus moves
        if (activation === 'automatic') {
          const newTab = availableTabs[newIndex];
          if (newTab) {
            handleTabSelection(newTab.id);
          }
        }
      }
    }
  }

  function handleTabDelete(tabId: string, event: Event) {
    event.stopPropagation();
    dispatch('tabDelete', tabId);
  }
</script>

<div class="tabs-container" class:vertical={orientation === 'vertical'}>
  <!-- Tablist -->
  <div
    bind:this={tablistElement}
    role="tablist"
    aria-orientation={orientation}
    class="tablist"
    tabindex="-1"
    on:keydown={handleKeyDown}
  >
    {#each tabs as tab, index}
      {@const isSelected = tab.id === selectedId}
      {@const tabIndex = tab.disabled ? -1 : (isSelected ? 0 : -1)}
      {@const tabPanelId = `${tablistId}-panel-${tab.id}`}
      
      <button
        bind:this={tabRefs[tab.id]}
        role="tab"
        type="button"
        id="{tablistId}-tab-{tab.id}"
        aria-selected={isSelected}
        aria-controls={isSelected ? tabPanelId : undefined}
        tabindex={tabIndex}
        disabled={tab.disabled}
        class="tab"
        class:selected={isSelected}
        class:disabled={tab.disabled}
        on:click={() => !tab.disabled && handleTabSelection(tab.id)}
      >
        <span class="tab-label">{tab.label}</span>
        {#if deletable && !tab.disabled}
          <button
            type="button"
            class="delete-button"
            aria-label="Delete {tab.label} tab"
            on:click={(e) => handleTabDelete(tab.id, e)}
          >
            ×
          </button>
        {/if}
      </button>
    {/each}
  </div>

  <!-- Tab Panels -->
  <div class="tabpanels">
    {#each tabs as tab}
      {@const isSelected = tab.id === selectedId}
      {@const tabPanelId = `${tablistId}-panel-${tab.id}`}
      
      <div
        role="tabpanel"
        id={tabPanelId}
        aria-labelledby="{tablistId}-tab-{tab.id}"
        hidden={!isSelected}
        class="tabpanel"
        class:active={isSelected}
        tabindex={isSelected ? 0 : -1}
      >
        {#if tab.content}
          {@html tab.content}
        {:else}
          <slot />
        {/if}
      </div>
    {/each}
  </div>
</div>

<style>
  /* APG Tabs Component Styles */
  .tabs-container {
    display: flex;
    flex-direction: column;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    overflow: hidden;
  }

  .tabs-container.vertical {
    flex-direction: row;
  }

  /* Tablist */
  .tablist {
    display: flex;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    margin: 0;
    padding: 0;
  }

  .vertical .tablist {
    flex-direction: column;
    border-bottom: none;
    border-right: 1px solid #e5e7eb;
    min-width: 200px;
  }

  /* Individual Tab */
  .tab {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .vertical .tab {
    border-bottom: none;
    border-right: 2px solid transparent;
    justify-content: flex-start;
    width: 100%;
    text-align: left;
  }

  /* Tab States */
  .tab:hover:not(.disabled) {
    background: #f3f4f6;
    color: #374151;
  }

  .tab:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
    z-index: 1;
  }

  .tab.selected {
    background: white;
    color: #374151;
    border-bottom-color: #3b82f6;
  }

  .vertical .tab.selected {
    border-bottom-color: transparent;
    border-right-color: #3b82f6;
  }

  .tab.disabled {
    color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .tab.disabled:hover {
    background: none;
    color: #9ca3af;
  }

  /* Tab Label */
  .tab-label {
    flex: 1;
  }

  /* Delete Button */
  .delete-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    background: none;
    border: none;
    border-radius: 50%;
    font-size: 16px;
    line-height: 1;
    color: #6b7280;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-left: 0.25rem;
  }

  .delete-button:hover {
    background: #ef4444;
    color: white;
  }

  .delete-button:focus {
    outline: 2px solid #ef4444;
    outline-offset: 1px;
  }

  /* Tab Panels Container */
  .tabpanels {
    flex: 1;
    position: relative;
    background: white;
  }

  /* Individual Tab Panel */
  .tabpanel {
    padding: 1rem;
    min-height: 200px;
  }

  .tabpanel:focus {
    outline: 2px solid #3b82f6;
    outline-offset: -2px;
  }

  .tabpanel:not(.active) {
    display: none;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .tablist {
      overflow-x: auto;
      scrollbar-width: thin;
    }
    
    .tab {
      flex-shrink: 0;
      min-width: 120px;
    }
    
    
    .vertical .tablist {
      flex-direction: row;
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
      min-width: auto;
    }
    
    .vertical .tab {
      border-right: none;
      border-bottom: 2px solid transparent;
    }
    
    .vertical .tab.selected {
      border-right-color: transparent;
      border-bottom-color: #3b82f6;
    }
  }

  /* Reduced Motion Support */
  @media (prefers-reduced-motion: reduce) {
    .tab {
      transition: none;
    }
    
    .delete-button {
      transition: none;
    }
  }
</style>