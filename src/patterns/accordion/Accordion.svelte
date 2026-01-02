<script lang="ts">
  /**
   * APG Accordion Pattern - Svelte Implementation
   *
   * A vertically stacked set of interactive headings that each reveal a section of content.
   *
   * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
   */
  import { onMount } from 'svelte';

  /**
   * Accordion item configuration
   */
  export interface AccordionItem {
    /** Unique identifier for the item */
    id: string;
    /** Content displayed in the accordion header button */
    header: string;
    /** Content displayed in the collapsible panel (HTML string) */
    content?: string;
    /** When true, the item cannot be expanded/collapsed */
    disabled?: boolean;
    /** When true, the panel is expanded on initial render */
    defaultExpanded?: boolean;
  }

  /**
   * Props for the Accordion component
   */
  interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    enableArrowKeys?: boolean;
    onExpandedChange?: (expandedIds: string[]) => void;
    className?: string;
  }

  let {
    items = [],
    allowMultiple = false,
    headingLevel = 3,
    enableArrowKeys = true,
    onExpandedChange = () => {},
    className = '',
  }: AccordionProps = $props();

  let expandedIds = $state<string[]>([]);
  let instanceId = $state('');
  let buttonRefs = $state<Record<string, HTMLButtonElement | undefined>>({});

  onMount(() => {
    instanceId = `accordion-${Math.random().toString(36).substring(2, 11)}`;
    // Initialize with defaultExpanded items
    if (Array.isArray(items)) {
      expandedIds = items
        .filter((item) => item.defaultExpanded && !item.disabled)
        .map((item) => item.id);
    }
  });

  // Derived values
  let safeItems = $derived(Array.isArray(items) ? items : []);
  let availableItems = $derived(safeItems.filter((item) => !item.disabled));
  let useRegion = $derived(safeItems.length <= 6);

  function isExpanded(itemId: string): boolean {
    return expandedIds.includes(itemId);
  }

  function handleToggle(itemId: string) {
    const item = safeItems.find((i) => i.id === itemId);
    if (item?.disabled) return;

    const isCurrentlyExpanded = expandedIds.includes(itemId);

    if (isCurrentlyExpanded) {
      expandedIds = expandedIds.filter((id) => id !== itemId);
    } else {
      if (allowMultiple) {
        expandedIds = [...expandedIds, itemId];
      } else {
        expandedIds = [itemId];
      }
    }

    onExpandedChange(expandedIds);
  }

  function handleKeyDown(event: KeyboardEvent, currentItemId: string) {
    if (!enableArrowKeys) return;

    const currentIndex = availableItems.findIndex((item) => item.id === currentItemId);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    let shouldPreventDefault = false;

    switch (event.key) {
      case 'ArrowDown':
        if (currentIndex < availableItems.length - 1) {
          newIndex = currentIndex + 1;
        }
        shouldPreventDefault = true;
        break;

      case 'ArrowUp':
        if (currentIndex > 0) {
          newIndex = currentIndex - 1;
        }
        shouldPreventDefault = true;
        break;

      case 'Home':
        newIndex = 0;
        shouldPreventDefault = true;
        break;

      case 'End':
        newIndex = availableItems.length - 1;
        shouldPreventDefault = true;
        break;
    }

    if (shouldPreventDefault) {
      event.preventDefault();
      if (newIndex !== currentIndex) {
        const newItem = availableItems[newIndex];
        if (newItem) {
          buttonRefs[newItem.id]?.focus();
        }
      }
    }
  }

  function getItemClass(item: AccordionItem): string {
    let cls = 'apg-accordion-item';
    if (isExpanded(item.id)) cls += ' apg-accordion-item--expanded';
    if (item.disabled) cls += ' apg-accordion-item--disabled';
    return cls;
  }

  function getTriggerClass(itemId: string): string {
    return isExpanded(itemId)
      ? 'apg-accordion-trigger apg-accordion-trigger--expanded'
      : 'apg-accordion-trigger';
  }

  function getIconClass(itemId: string): string {
    return isExpanded(itemId)
      ? 'apg-accordion-icon apg-accordion-icon--expanded'
      : 'apg-accordion-icon';
  }

  function getPanelClass(itemId: string): string {
    return isExpanded(itemId)
      ? 'apg-accordion-panel apg-accordion-panel--expanded'
      : 'apg-accordion-panel apg-accordion-panel--collapsed';
  }
</script>

{#if safeItems.length > 0}
  <div class="apg-accordion {className}">
    {#each safeItems as item (item.id)}
      {@const headerId = `${instanceId}-header-${item.id}`}
      {@const panelId = `${instanceId}-panel-${item.id}`}

      <div class={getItemClass(item)}>
        {#if headingLevel === 2}
          <h2 class="apg-accordion-header">
            <button
              bind:this={buttonRefs[item.id]}
              type="button"
              id={headerId}
              aria-expanded={isExpanded(item.id)}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              class={getTriggerClass(item.id)}
              onclick={() => handleToggle(item.id)}
              onkeydown={(e) => handleKeyDown(e, item.id)}
            >
              <span class="apg-accordion-trigger-content">{item.header}</span>
              <span class={getIconClass(item.id)} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
          </h2>
        {:else if headingLevel === 3}
          <h3 class="apg-accordion-header">
            <button
              bind:this={buttonRefs[item.id]}
              type="button"
              id={headerId}
              aria-expanded={isExpanded(item.id)}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              class={getTriggerClass(item.id)}
              onclick={() => handleToggle(item.id)}
              onkeydown={(e) => handleKeyDown(e, item.id)}
            >
              <span class="apg-accordion-trigger-content">{item.header}</span>
              <span class={getIconClass(item.id)} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
          </h3>
        {:else if headingLevel === 4}
          <h4 class="apg-accordion-header">
            <button
              bind:this={buttonRefs[item.id]}
              type="button"
              id={headerId}
              aria-expanded={isExpanded(item.id)}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              class={getTriggerClass(item.id)}
              onclick={() => handleToggle(item.id)}
              onkeydown={(e) => handleKeyDown(e, item.id)}
            >
              <span class="apg-accordion-trigger-content">{item.header}</span>
              <span class={getIconClass(item.id)} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
          </h4>
        {:else if headingLevel === 5}
          <h5 class="apg-accordion-header">
            <button
              bind:this={buttonRefs[item.id]}
              type="button"
              id={headerId}
              aria-expanded={isExpanded(item.id)}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              class={getTriggerClass(item.id)}
              onclick={() => handleToggle(item.id)}
              onkeydown={(e) => handleKeyDown(e, item.id)}
            >
              <span class="apg-accordion-trigger-content">{item.header}</span>
              <span class={getIconClass(item.id)} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
          </h5>
        {:else}
          <h6 class="apg-accordion-header">
            <button
              bind:this={buttonRefs[item.id]}
              type="button"
              id={headerId}
              aria-expanded={isExpanded(item.id)}
              aria-controls={panelId}
              aria-disabled={item.disabled || undefined}
              disabled={item.disabled}
              class={getTriggerClass(item.id)}
              onclick={() => handleToggle(item.id)}
              onkeydown={(e) => handleKeyDown(e, item.id)}
            >
              <span class="apg-accordion-trigger-content">{item.header}</span>
              <span class={getIconClass(item.id)} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
          </h6>
        {/if}
        <div
          role={useRegion ? 'region' : undefined}
          id={panelId}
          aria-labelledby={useRegion ? headerId : undefined}
          class={getPanelClass(item.id)}
        >
          <div class="apg-accordion-panel-content">
            {#if item.content}
              {@html item.content}
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
{/if}
