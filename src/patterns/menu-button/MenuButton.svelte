<script lang="ts">
  import { onDestroy, tick } from 'svelte';

  export interface MenuItem {
    id: string;
    label: string;
    disabled?: boolean;
  }

  interface MenuButtonProps {
    items: MenuItem[];
    label: string;
    defaultOpen?: boolean;
    onItemSelect?: (itemId: string) => void;
    class?: string;
  }

  let {
    items = [],
    label,
    defaultOpen = false,
    onItemSelect = () => {},
    class: className = '',
    ...restProps
  }: MenuButtonProps = $props();

  // State - capture defaultOpen value to avoid reactivity warning
  const initialOpen = defaultOpen;
  let isOpen = $state(initialOpen);
  let focusedIndex = $state(-1);
  // Generate ID immediately for SSR-safe aria-controls/aria-labelledby
  const instanceId = `menu-button-${Math.random().toString(36).slice(2, 11)}`;
  let typeAheadBuffer = $state('');
  let typeAheadTimeoutId: number | null = null;
  const typeAheadTimeout = 500;

  // Refs
  let containerElement: HTMLDivElement;
  let buttonElement: HTMLButtonElement;
  let menuItemRefs = new Map<string, HTMLLIElement>();

  // Derived
  let availableItems = $derived(items.filter((item) => !item.disabled));
  let buttonId = $derived(`${instanceId}-button`);
  let menuId = $derived(`${instanceId}-menu`);

  onDestroy(() => {
    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  // Focus effect - explicitly track dependencies with stale check
  $effect(() => {
    const open = isOpen;
    const index = focusedIndex;
    const items = availableItems;

    if (open && index >= 0) {
      const targetItem = items[index];
      if (targetItem) {
        const targetId = targetItem.id;
        tick().then(() => {
          // Guard against stale focus: check menu is still open
          if (isOpen && focusedIndex >= 0) {
            menuItemRefs.get(targetId)?.focus();
          }
        });
      }
    }
  });

  // Click outside effect (browser-only)
  $effect(() => {
    if (typeof document === 'undefined') return;

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  // Action to track menu item refs
  function trackItemRef(node: HTMLLIElement, itemId: string) {
    menuItemRefs.set(itemId, node);
    return {
      destroy() {
        menuItemRefs.delete(itemId);
      },
    };
  }

  function getTabIndex(item: MenuItem): number {
    if (item.disabled) return -1;
    const availableIndex = availableItems.findIndex((i) => i.id === item.id);
    return availableIndex === focusedIndex ? 0 : -1;
  }

  function closeMenu() {
    isOpen = false;
    focusedIndex = -1;
    // Clear type-ahead state
    typeAheadBuffer = '';
    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
      typeAheadTimeoutId = null;
    }
  }

  function openMenu(focusPosition: 'first' | 'last') {
    if (availableItems.length === 0) {
      isOpen = true;
      return;
    }

    isOpen = true;
    const targetIndex = focusPosition === 'first' ? 0 : availableItems.length - 1;
    focusedIndex = targetIndex;
  }

  function toggleMenu() {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu('first');
    }
  }

  function handleClickOutside(event: MouseEvent) {
    if (containerElement && !containerElement.contains(event.target as Node)) {
      closeMenu();
    }
  }

  async function handleItemClick(item: MenuItem) {
    if (item.disabled) return;
    onItemSelect(item.id);
    closeMenu();
    await tick();
    buttonElement?.focus();
  }

  function handleItemFocus(item: MenuItem) {
    if (item.disabled) return;
    const availableIndex = availableItems.findIndex((i) => i.id === item.id);
    if (availableIndex >= 0) {
      focusedIndex = availableIndex;
    }
  }

  function handleButtonKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        openMenu('first');
        break;
      case 'ArrowDown':
        event.preventDefault();
        openMenu('first');
        break;
      case 'ArrowUp':
        event.preventDefault();
        openMenu('last');
        break;
    }
  }

  function handleTypeAhead(char: string) {
    if (availableItems.length === 0) return;

    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
    }

    typeAheadBuffer += char.toLowerCase();

    const buffer = typeAheadBuffer;
    const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

    let startIndex: number;
    let searchStr: string;

    if (isSameChar) {
      typeAheadBuffer = buffer[0];
      searchStr = buffer[0];
      startIndex = focusedIndex >= 0 ? (focusedIndex + 1) % availableItems.length : 0;
    } else if (buffer.length === 1) {
      searchStr = buffer;
      startIndex = focusedIndex >= 0 ? (focusedIndex + 1) % availableItems.length : 0;
    } else {
      searchStr = buffer;
      startIndex = focusedIndex >= 0 ? focusedIndex : 0;
    }

    for (let i = 0; i < availableItems.length; i++) {
      const index = (startIndex + i) % availableItems.length;
      const option = availableItems[index];
      if (option.label.toLowerCase().startsWith(searchStr)) {
        focusedIndex = index;
        break;
      }
    }

    typeAheadTimeoutId = window.setTimeout(() => {
      typeAheadBuffer = '';
      typeAheadTimeoutId = null;
    }, typeAheadTimeout);
  }

  async function handleMenuKeyDown(event: KeyboardEvent, item: MenuItem) {
    // Guard: no available items
    if (availableItems.length === 0) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        await tick();
        buttonElement?.focus();
      }
      return;
    }

    const currentIndex = availableItems.findIndex((i) => i.id === item.id);

    // Guard: disabled item received focus
    if (currentIndex < 0) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        await tick();
        buttonElement?.focus();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % availableItems.length;
        focusedIndex = nextIndex;
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prevIndex = currentIndex === 0 ? availableItems.length - 1 : currentIndex - 1;
        focusedIndex = prevIndex;
        break;
      }
      case 'Home': {
        event.preventDefault();
        focusedIndex = 0;
        break;
      }
      case 'End': {
        event.preventDefault();
        focusedIndex = availableItems.length - 1;
        break;
      }
      case 'Escape': {
        event.preventDefault();
        closeMenu();
        await tick();
        buttonElement?.focus();
        break;
      }
      case 'Tab': {
        closeMenu();
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        if (!item.disabled) {
          onItemSelect(item.id);
          closeMenu();
          await tick();
          buttonElement?.focus();
        }
        break;
      }
      default: {
        // Type-ahead: single printable character
        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          event.preventDefault();
          handleTypeAhead(event.key);
        }
      }
    }
  }
</script>

<div bind:this={containerElement} class="apg-menu-button {className}">
  <button
    bind:this={buttonElement}
    id={buttonId}
    type="button"
    class="apg-menu-button-trigger"
    aria-haspopup="menu"
    aria-expanded={isOpen}
    aria-controls={menuId}
    onclick={toggleMenu}
    onkeydown={handleButtonKeyDown}
    {...restProps}
  >
    {label}
  </button>
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  <ul
    id={menuId}
    role="menu"
    aria-labelledby={buttonId}
    class="apg-menu-button-menu"
    hidden={!isOpen ? true : undefined}
    inert={!isOpen ? true : undefined}
  >
    {#each items as item}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
      <li
        use:trackItemRef={item.id}
        role="menuitem"
        tabindex={getTabIndex(item)}
        aria-disabled={item.disabled || undefined}
        class="apg-menu-button-item"
        onclick={() => handleItemClick(item)}
        onkeydown={(e) => handleMenuKeyDown(e, item)}
        onfocus={() => handleItemFocus(item)}
      >
        {item.label}
      </li>
    {/each}
  </ul>
</div>
