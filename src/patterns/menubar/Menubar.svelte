<script lang="ts">
  import { onDestroy, tick } from 'svelte';

  // Menu item types
  export interface MenuItemBase {
    id: string;
    label: string;
    disabled?: boolean;
  }

  export interface MenuItemAction extends MenuItemBase {
    type: 'item';
  }

  export interface MenuItemCheckbox extends MenuItemBase {
    type: 'checkbox';
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }

  export interface MenuItemRadio extends MenuItemBase {
    type: 'radio';
    checked?: boolean;
  }

  export interface MenuItemSeparator {
    type: 'separator';
    id: string;
  }

  export interface MenuItemRadioGroup {
    type: 'radiogroup';
    id: string;
    name: string;
    label: string;
    items: MenuItemRadio[];
  }

  export interface MenuItemSubmenu extends MenuItemBase {
    type: 'submenu';
    items: MenuItem[];
  }

  export type MenuItem =
    | MenuItemAction
    | MenuItemCheckbox
    | MenuItemRadio
    | MenuItemSeparator
    | MenuItemRadioGroup
    | MenuItemSubmenu;

  export interface MenubarItem {
    id: string;
    label: string;
    items: MenuItem[];
  }

  interface MenubarProps {
    items: MenubarItem[];
    'aria-label'?: string;
    'aria-labelledby'?: string;
    onItemSelect?: (itemId: string) => void;
    class?: string;
  }

  let {
    items = [],
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    onItemSelect = () => {},
    class: className = '',
    ...restProps
  }: MenubarProps = $props();

  // State
  const instanceId = `menubar-${Math.random().toString(36).slice(2, 11)}`;
  let menubarFocusIndex = $state(0);
  let openMenubarIndex = $state(-1);
  let openSubmenuPath = $state<string[]>([]);
  let focusedItemPath = $state<string[]>([]);
  let checkboxStates = $state<Map<string, boolean>>(new Map());
  let radioStates = $state<Map<string, string>>(new Map());
  let typeAheadBuffer = $state('');
  let typeAheadTimeoutId: number | null = null;
  const typeAheadTimeout = 500;

  // Refs
  let containerElement: HTMLUListElement;
  let menubarItemRefs = new Map<number, HTMLSpanElement>();
  let menuItemRefs = new Map<string, HTMLSpanElement>();

  // Initialize checkbox/radio states
  const initStates = () => {
    const collectStates = (menuItems: MenuItem[]) => {
      menuItems.forEach((item) => {
        if (item.type === 'checkbox') {
          checkboxStates.set(item.id, item.checked ?? false);
        } else if (item.type === 'radiogroup') {
          const checked = item.items.find((r) => r.checked);
          if (checked) {
            radioStates.set(item.name, checked.id);
          }
        } else if (item.type === 'submenu') {
          collectStates(item.items);
        }
      });
    };
    items.forEach((menubarItem) => collectStates(menubarItem.items));
  };
  initStates();

  let isMenuOpen = $derived(openMenubarIndex >= 0);

  onDestroy(() => {
    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  // Focus effect for menu items
  $effect(() => {
    const path = focusedItemPath;
    if (path.length === 0) return;

    const focusedId = path[path.length - 1];
    tick().then(() => {
      if (focusedItemPath.length > 0) {
        menuItemRefs.get(focusedId)?.focus();
      }
    });
  });

  // Click outside effect
  $effect(() => {
    if (typeof document === 'undefined') return;

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  function handleClickOutside(event: MouseEvent) {
    if (containerElement && !containerElement.contains(event.target as Node)) {
      closeAllMenus();
    }
  }

  // Ref tracking actions
  function trackMenubarItemRef(node: HTMLSpanElement, index: number) {
    menubarItemRefs.set(index, node);
    return {
      destroy() {
        menubarItemRefs.delete(index);
      },
    };
  }

  function trackMenuItemRef(node: HTMLSpanElement, itemId: string) {
    menuItemRefs.set(itemId, node);
    return {
      destroy() {
        menuItemRefs.delete(itemId);
      },
    };
  }

  // Helper functions
  function closeAllMenus() {
    openMenubarIndex = -1;
    openSubmenuPath = [];
    focusedItemPath = [];
    typeAheadBuffer = '';
    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
      typeAheadTimeoutId = null;
    }
  }

  // Get first focusable item from menu items
  function getFirstFocusableItem(menuItems: MenuItem[]): MenuItem | null {
    for (const item of menuItems) {
      if (item.type === 'separator') continue;
      if (item.type === 'radiogroup') {
        const enabledRadio = item.items.find((r) => !r.disabled);
        if (enabledRadio) return enabledRadio;
        continue;
      }
      if ('disabled' in item && item.disabled) continue;
      return item;
    }
    return null;
  }

  // Get all focusable items including radios from radiogroups
  function getAllFocusableItems(menuItems: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = [];
    for (const item of menuItems) {
      if (item.type === 'separator') continue;
      if (item.type === 'radiogroup') {
        result.push(...item.items.filter((r) => !r.disabled));
      } else if (!('disabled' in item && item.disabled)) {
        result.push(item);
      }
    }
    return result;
  }

  function openMenubarMenu(index: number, focusPosition: 'first' | 'last' = 'first') {
    const menubarItem = items[index];
    if (!menubarItem) return;

    const focusableItems = getAllFocusableItems(menubarItem.items);

    let focusedId = '';
    if (focusPosition === 'first') {
      focusedId = focusableItems[0]?.id ?? '';
    } else {
      focusedId = focusableItems[focusableItems.length - 1]?.id ?? '';
    }

    openMenubarIndex = index;
    openSubmenuPath = [];
    focusedItemPath = focusedId ? [focusedId] : [];
    menubarFocusIndex = index;
  }

  function getFocusableItems(menuItems: MenuItem[]): MenuItem[] {
    const result: MenuItem[] = [];
    menuItems.forEach((item) => {
      if (item.type === 'separator') return;
      if (item.type === 'radiogroup') {
        result.push(...item.items);
      } else {
        result.push(item);
      }
    });
    return result;
  }

  function handleTypeAhead(char: string, focusableItems: MenuItem[]) {
    const enabledItems = focusableItems.filter((item) => !('disabled' in item && item.disabled));
    if (enabledItems.length === 0) return;

    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
    }

    typeAheadBuffer += char.toLowerCase();
    const buffer = typeAheadBuffer;
    const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

    let searchStr: string;
    let startIndex: number;

    const currentId = focusedItemPath[focusedItemPath.length - 1];
    const currentIndex = enabledItems.findIndex((item) => item.id === currentId);

    if (isSameChar) {
      typeAheadBuffer = buffer[0];
      searchStr = buffer[0];
      startIndex = currentIndex >= 0 ? (currentIndex + 1) % enabledItems.length : 0;
    } else if (buffer.length === 1) {
      searchStr = buffer;
      startIndex = currentIndex >= 0 ? (currentIndex + 1) % enabledItems.length : 0;
    } else {
      searchStr = buffer;
      startIndex = currentIndex >= 0 ? currentIndex : 0;
    }

    for (let i = 0; i < enabledItems.length; i++) {
      const index = (startIndex + i) % enabledItems.length;
      const item = enabledItems[index];
      if ('label' in item && item.label.toLowerCase().startsWith(searchStr)) {
        focusedItemPath = [...focusedItemPath.slice(0, -1), item.id];
        break;
      }
    }

    typeAheadTimeoutId = window.setTimeout(() => {
      typeAheadBuffer = '';
      typeAheadTimeoutId = null;
    }, typeAheadTimeout);
  }

  async function handleMenubarKeyDown(event: KeyboardEvent, index: number) {
    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const nextIndex = (index + 1) % items.length;
        menubarFocusIndex = nextIndex;
        if (isMenuOpen) {
          openMenubarMenu(nextIndex, 'first');
        } else {
          await tick();
          menubarItemRefs.get(nextIndex)?.focus();
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const prevIndex = index === 0 ? items.length - 1 : index - 1;
        menubarFocusIndex = prevIndex;
        if (isMenuOpen) {
          openMenubarMenu(prevIndex, 'first');
        } else {
          await tick();
          menubarItemRefs.get(prevIndex)?.focus();
        }
        break;
      }
      case 'ArrowDown':
      case 'Enter':
      case ' ': {
        event.preventDefault();
        openMenubarMenu(index, 'first');
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        openMenubarMenu(index, 'last');
        break;
      }
      case 'Home': {
        event.preventDefault();
        menubarFocusIndex = 0;
        await tick();
        menubarItemRefs.get(0)?.focus();
        break;
      }
      case 'End': {
        event.preventDefault();
        const lastIndex = items.length - 1;
        menubarFocusIndex = lastIndex;
        await tick();
        menubarItemRefs.get(lastIndex)?.focus();
        break;
      }
      case 'Escape': {
        event.preventDefault();
        closeAllMenus();
        break;
      }
      case 'Tab': {
        closeAllMenus();
        break;
      }
    }
  }

  function handleMenubarClick(index: number) {
    if (openMenubarIndex === index) {
      closeAllMenus();
    } else {
      openMenubarMenu(index, 'first');
    }
  }

  function handleMenubarHover(index: number) {
    if (isMenuOpen && openMenubarIndex !== index) {
      openMenubarMenu(index, 'first');
    }
  }

  function activateMenuItem(item: MenuItem, radioGroupName?: string) {
    if ('disabled' in item && item.disabled) return;

    if (item.type === 'item') {
      onItemSelect(item.id);
      closeAllMenus();
      tick().then(() => {
        menubarItemRefs.get(openMenubarIndex)?.focus();
      });
    } else if (item.type === 'checkbox') {
      const newChecked = !checkboxStates.get(item.id);
      checkboxStates.set(item.id, newChecked);
      checkboxStates = new Map(checkboxStates); // trigger reactivity
      item.onCheckedChange?.(newChecked);
      // Menu stays open
    } else if (item.type === 'radio' && radioGroupName) {
      radioStates.set(radioGroupName, item.id);
      radioStates = new Map(radioStates); // trigger reactivity
      // Menu stays open
    } else if (item.type === 'submenu') {
      // Open submenu and focus first item
      const firstItem = getFirstFocusableItem(item.items);
      openSubmenuPath = [...openSubmenuPath, item.id];
      if (firstItem) {
        focusedItemPath = [...focusedItemPath, firstItem.id];
      }
    }
  }

  async function handleMenuKeyDown(
    event: KeyboardEvent,
    item: MenuItem,
    menuItems: MenuItem[],
    isSubmenu: boolean,
    radioGroupName?: string
  ) {
    const focusableItems = getFocusableItems(menuItems);
    const enabledItems = focusableItems.filter((i) => !('disabled' in i && i.disabled));
    const currentIndex = focusableItems.findIndex((i) => i.id === item.id);

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        let nextIndex = currentIndex;
        do {
          nextIndex = (nextIndex + 1) % focusableItems.length;
        } while (
          focusableItems[nextIndex] &&
          'disabled' in focusableItems[nextIndex] &&
          (focusableItems[nextIndex] as MenuItemBase).disabled &&
          nextIndex !== currentIndex
        );

        const nextItem = focusableItems[nextIndex];
        if (nextItem) {
          focusedItemPath = [...focusedItemPath.slice(0, -1), nextItem.id];
        }
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        let prevIndex = currentIndex;
        do {
          prevIndex = prevIndex === 0 ? focusableItems.length - 1 : prevIndex - 1;
        } while (
          focusableItems[prevIndex] &&
          'disabled' in focusableItems[prevIndex] &&
          (focusableItems[prevIndex] as MenuItemBase).disabled &&
          prevIndex !== currentIndex
        );

        const prevItem = focusableItems[prevIndex];
        if (prevItem) {
          focusedItemPath = [...focusedItemPath.slice(0, -1), prevItem.id];
        }
        break;
      }
      case 'ArrowRight': {
        event.preventDefault();
        if (item.type === 'submenu') {
          // Open submenu and focus first item
          const firstItem = getFirstFocusableItem(item.items);
          openSubmenuPath = [...openSubmenuPath, item.id];
          if (firstItem) {
            focusedItemPath = [...focusedItemPath, firstItem.id];
          }
        } else if (!isSubmenu) {
          const nextMenubarIndex = (openMenubarIndex + 1) % items.length;
          openMenubarMenu(nextMenubarIndex, 'first');
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        if (isSubmenu) {
          openSubmenuPath = openSubmenuPath.slice(0, -1);
          focusedItemPath = focusedItemPath.slice(0, -1);
        } else {
          const prevMenubarIndex = openMenubarIndex === 0 ? items.length - 1 : openMenubarIndex - 1;
          openMenubarMenu(prevMenubarIndex, 'first');
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        const firstEnabled = enabledItems[0];
        if (firstEnabled) {
          focusedItemPath = [...focusedItemPath.slice(0, -1), firstEnabled.id];
        }
        break;
      }
      case 'End': {
        event.preventDefault();
        const lastEnabled = enabledItems[enabledItems.length - 1];
        if (lastEnabled) {
          focusedItemPath = [...focusedItemPath.slice(0, -1), lastEnabled.id];
        }
        break;
      }
      case 'Escape': {
        event.preventDefault();
        if (isSubmenu) {
          openSubmenuPath = openSubmenuPath.slice(0, -1);
          focusedItemPath = focusedItemPath.slice(0, -1);
        } else {
          const menubarIndex = openMenubarIndex;
          closeAllMenus();
          await tick();
          menubarItemRefs.get(menubarIndex)?.focus();
        }
        break;
      }
      case 'Tab': {
        closeAllMenus();
        break;
      }
      case 'Enter':
      case ' ': {
        event.preventDefault();
        activateMenuItem(item, radioGroupName);
        break;
      }
      default: {
        const { key, ctrlKey, metaKey, altKey } = event;
        if (key.length === 1 && !ctrlKey && !metaKey && !altKey) {
          event.preventDefault();
          handleTypeAhead(key, focusableItems);
        }
      }
    }
  }

  // Check if submenu is expanded
  function isSubmenuExpanded(itemId: string): boolean {
    return openSubmenuPath.includes(itemId);
  }

  // Check if item is focused (only the last item in the path)
  function isItemFocused(itemId: string): boolean {
    return focusedItemPath[focusedItemPath.length - 1] === itemId;
  }
</script>

<ul
  bind:this={containerElement}
  role="menubar"
  class="apg-menubar {className}"
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  {...restProps}
>
  {#each items as menubarItem, index (menubarItem.id)}
    <li role="none">
      <span
        id="{instanceId}-menubar-{menubarItem.id}"
        use:trackMenubarItemRef={index}
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={openMenubarIndex === index}
        tabindex={index === menubarFocusIndex ? 0 : -1}
        class="apg-menubar-trigger"
        onclick={() => handleMenubarClick(index)}
        onkeydown={(e) => handleMenubarKeyDown(e, index)}
        onmouseenter={() => handleMenubarHover(index)}
      >
        {menubarItem.label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          style="position: relative; top: 1px; opacity: 0.7"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
      <ul
        id="{instanceId}-menu-{menubarItem.id}"
        role="menu"
        aria-labelledby="{instanceId}-menubar-{menubarItem.id}"
        class="apg-menubar-menu"
        aria-hidden={openMenubarIndex !== index}
      >
        {#if openMenubarIndex === index}
          {#each menubarItem.items as item (item.id)}
            {#if item.type === 'separator'}
              <li role="none">
                <hr role="separator" class="apg-menubar-separator" />
              </li>
            {:else if item.type === 'radiogroup'}
              <li role="none">
                <ul role="group" aria-label={item.label} class="apg-menubar-group">
                  {#each item.items as radioItem (radioItem.id)}
                    <li role="none">
                      <span
                        use:trackMenuItemRef={radioItem.id}
                        role="menuitemradio"
                        aria-checked={radioStates.get(item.name) === radioItem.id}
                        aria-disabled={radioItem.disabled || undefined}
                        tabindex={isItemFocused(radioItem.id) ? 0 : -1}
                        class="apg-menubar-menuitem apg-menubar-menuitemradio"
                        onclick={() => activateMenuItem(radioItem, item.name)}
                        onkeydown={(e) =>
                          handleMenuKeyDown(e, radioItem, menubarItem.items, false, item.name)}
                      >
                        {radioItem.label}
                      </span>
                    </li>
                  {/each}
                </ul>
              </li>
            {:else if item.type === 'checkbox'}
              <li role="none">
                <span
                  use:trackMenuItemRef={item.id}
                  role="menuitemcheckbox"
                  aria-checked={checkboxStates.get(item.id) ?? false}
                  aria-disabled={item.disabled || undefined}
                  tabindex={isItemFocused(item.id) ? 0 : -1}
                  class="apg-menubar-menuitem apg-menubar-menuitemcheckbox"
                  onclick={() => activateMenuItem(item)}
                  onkeydown={(e) => handleMenuKeyDown(e, item, menubarItem.items, false)}
                >
                  {item.label}
                </span>
              </li>
            {:else if item.type === 'submenu'}
              <li role="none">
                <span
                  id="{instanceId}-menuitem-{item.id}"
                  use:trackMenuItemRef={item.id}
                  role="menuitem"
                  aria-haspopup="menu"
                  aria-expanded={isSubmenuExpanded(item.id)}
                  aria-disabled={item.disabled || undefined}
                  tabindex={isItemFocused(item.id) ? 0 : -1}
                  class="apg-menubar-menuitem apg-menubar-submenu-trigger"
                  onclick={() => activateMenuItem(item)}
                  onkeydown={(e) => handleMenuKeyDown(e, item, menubarItem.items, false)}
                >
                  {item.label}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    aria-hidden="true"
                    style="margin-left: auto; position: relative; top: 1px"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </span>
                <ul
                  id="{instanceId}-submenu-{item.id}"
                  role="menu"
                  aria-labelledby="{instanceId}-menuitem-{item.id}"
                  class="apg-menubar-submenu"
                  aria-hidden={!isSubmenuExpanded(item.id)}
                >
                  {#if isSubmenuExpanded(item.id)}
                    {#each item.items as subItem (subItem.id)}
                      {#if subItem.type === 'separator'}
                        <li role="none">
                          <hr role="separator" class="apg-menubar-separator" />
                        </li>
                      {:else if subItem.type !== 'radiogroup'}
                        <li role="none">
                          <span
                            use:trackMenuItemRef={subItem.id}
                            role="menuitem"
                            aria-disabled={subItem.disabled || undefined}
                            tabindex={isItemFocused(subItem.id) ? 0 : -1}
                            class="apg-menubar-menuitem"
                            onclick={() => activateMenuItem(subItem)}
                            onkeydown={(e) => handleMenuKeyDown(e, subItem, item.items, true)}
                          >
                            {subItem.label}
                          </span>
                        </li>
                      {/if}
                    {/each}
                  {/if}
                </ul>
              </li>
            {:else}
              <li role="none">
                <span
                  use:trackMenuItemRef={item.id}
                  role="menuitem"
                  aria-disabled={item.disabled || undefined}
                  tabindex={isItemFocused(item.id) ? 0 : -1}
                  class="apg-menubar-menuitem"
                  onclick={() => activateMenuItem(item)}
                  onkeydown={(e) => handleMenuKeyDown(e, item, menubarItem.items, false)}
                >
                  {item.label}
                </span>
              </li>
            {/if}
          {/each}
        {/if}
      </ul>
    </li>
  {/each}
</ul>
