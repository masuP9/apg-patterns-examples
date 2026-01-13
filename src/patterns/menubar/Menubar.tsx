import type { HTMLAttributes, KeyboardEvent, ReactElement } from 'react';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

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

type MenubarLabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

export type MenubarProps = Omit<
  HTMLAttributes<HTMLUListElement>,
  'role' | 'aria-label' | 'aria-labelledby'
> &
  MenubarLabelProps & {
    items: MenubarItem[];
    onItemSelect?: (itemId: string) => void;
  };

interface MenuState {
  openMenubarIndex: number;
  openSubmenuPath: string[];
  focusedItemPath: string[];
}

export function Menubar({
  items,
  onItemSelect,
  className = '',
  ...restProps
}: MenubarProps): ReactElement {
  const instanceId = useId();

  const [state, setState] = useState<MenuState>({
    openMenubarIndex: -1,
    openSubmenuPath: [],
    focusedItemPath: [],
  });

  const [checkboxStates, setCheckboxStates] = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>();
    const collectCheckboxStates = (menuItems: MenuItem[]) => {
      menuItems.forEach((item) => {
        if (item.type === 'checkbox') {
          map.set(item.id, item.checked ?? false);
        } else if (item.type === 'submenu') {
          collectCheckboxStates(item.items);
        } else if (item.type === 'radiogroup') {
          item.items.forEach((radio) => {
            map.set(radio.id, radio.checked ?? false);
          });
        }
      });
    };
    items.forEach((menubarItem) => collectCheckboxStates(menubarItem.items));
    return map;
  });

  const [radioStates, setRadioStates] = useState<Map<string, string>>(() => {
    const map = new Map<string, string>();
    const collectRadioStates = (menuItems: MenuItem[]) => {
      menuItems.forEach((item) => {
        if (item.type === 'radiogroup') {
          const checked = item.items.find((r) => r.checked);
          if (checked) {
            map.set(item.name, checked.id);
          }
        } else if (item.type === 'submenu') {
          collectRadioStates(item.items);
        }
      });
    };
    items.forEach((menubarItem) => collectRadioStates(menubarItem.items));
    return map;
  });

  const containerRef = useRef<HTMLUListElement>(null);
  const menubarItemRefs = useRef<Map<number, HTMLSpanElement>>(new Map());
  const menuItemRefs = useRef<Map<string, HTMLSpanElement>>(new Map());
  const typeAheadBuffer = useRef<string>('');
  const typeAheadTimeoutId = useRef<number | null>(null);
  const typeAheadTimeout = 500;
  const [menubarFocusIndex, setMenubarFocusIndex] = useState(0);

  const isMenuOpen = state.openMenubarIndex >= 0;

  // Close all menus
  const closeAllMenus = useCallback(() => {
    setState({
      openMenubarIndex: -1,
      openSubmenuPath: [],
      focusedItemPath: [],
    });
    typeAheadBuffer.current = '';
    if (typeAheadTimeoutId.current !== null) {
      clearTimeout(typeAheadTimeoutId.current);
      typeAheadTimeoutId.current = null;
    }
  }, []);

  // Open a menubar item's menu
  const openMenubarMenu = useCallback(
    (index: number, focusPosition: 'first' | 'last' = 'first') => {
      const menubarItem = items[index];
      if (!menubarItem) return;

      // Get all focusable items including radios from radiogroups
      const getAllFocusableItems = (menuItems: MenuItem[]): MenuItem[] => {
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
      };

      const focusableItems = getAllFocusableItems(menubarItem.items);

      let focusedId = '';
      if (focusPosition === 'first') {
        focusedId = focusableItems[0]?.id ?? '';
      } else {
        focusedId = focusableItems[focusableItems.length - 1]?.id ?? '';
      }

      setState({
        openMenubarIndex: index,
        openSubmenuPath: [],
        focusedItemPath: focusedId ? [focusedId] : [],
      });
      setMenubarFocusIndex(index);
    },
    [items]
  );

  // Get all focusable items from a menu
  const getFocusableItems = useCallback((menuItems: MenuItem[]): MenuItem[] => {
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
  }, []);

  // Focus effect for menu items
  useEffect(() => {
    if (state.focusedItemPath.length === 0) return;

    const focusedId = state.focusedItemPath[state.focusedItemPath.length - 1];
    const element = menuItemRefs.current.get(focusedId);
    element?.focus();
  }, [state.focusedItemPath]);

  // Focus effect for menubar items
  useEffect(() => {
    if (!isMenuOpen) return;

    const element = menubarItemRefs.current.get(state.openMenubarIndex);
    if (state.focusedItemPath.length === 0) {
      element?.focus();
    }
  }, [isMenuOpen, state.openMenubarIndex, state.focusedItemPath.length]);

  // Click outside to close
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, closeAllMenus]);

  // Cleanup type-ahead timeout on unmount
  useEffect(() => {
    return () => {
      if (typeAheadTimeoutId.current !== null) {
        clearTimeout(typeAheadTimeoutId.current);
      }
    };
  }, []);

  // Handle type-ahead
  const handleTypeAhead = useCallback(
    (char: string, focusableItems: MenuItem[]) => {
      const enabledItems = focusableItems.filter((item) =>
        'disabled' in item ? !item.disabled : true
      );
      if (enabledItems.length === 0) return;

      if (typeAheadTimeoutId.current !== null) {
        clearTimeout(typeAheadTimeoutId.current);
      }

      typeAheadBuffer.current += char.toLowerCase();
      const buffer = typeAheadBuffer.current;
      const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

      let searchStr: string;
      let startIndex: number;

      const currentId = state.focusedItemPath[state.focusedItemPath.length - 1];
      const currentIndex = enabledItems.findIndex((item) => item.id === currentId);

      if (isSameChar) {
        typeAheadBuffer.current = buffer[0];
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
          setState((prev) => ({
            ...prev,
            focusedItemPath: [...prev.focusedItemPath.slice(0, -1), item.id],
          }));
          break;
        }
      }

      typeAheadTimeoutId.current = window.setTimeout(() => {
        typeAheadBuffer.current = '';
        typeAheadTimeoutId.current = null;
      }, typeAheadTimeout);
    },
    [state.focusedItemPath]
  );

  // Handle menubar item keyboard navigation
  const handleMenubarKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>, index: number) => {
      switch (event.key) {
        case 'ArrowRight': {
          event.preventDefault();
          const nextIndex = (index + 1) % items.length;
          setMenubarFocusIndex(nextIndex);
          if (isMenuOpen) {
            openMenubarMenu(nextIndex, 'first');
          } else {
            menubarItemRefs.current.get(nextIndex)?.focus();
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          const prevIndex = index === 0 ? items.length - 1 : index - 1;
          setMenubarFocusIndex(prevIndex);
          if (isMenuOpen) {
            openMenubarMenu(prevIndex, 'first');
          } else {
            menubarItemRefs.current.get(prevIndex)?.focus();
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
          setMenubarFocusIndex(0);
          menubarItemRefs.current.get(0)?.focus();
          break;
        }
        case 'End': {
          event.preventDefault();
          const lastIndex = items.length - 1;
          setMenubarFocusIndex(lastIndex);
          menubarItemRefs.current.get(lastIndex)?.focus();
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
    },
    [items.length, isMenuOpen, openMenubarMenu, closeAllMenus]
  );

  // Handle menubar item click
  const handleMenubarClick = useCallback(
    (index: number) => {
      if (state.openMenubarIndex === index) {
        closeAllMenus();
      } else {
        openMenubarMenu(index, 'first');
      }
    },
    [state.openMenubarIndex, closeAllMenus, openMenubarMenu]
  );

  // Handle menubar item hover
  const handleMenubarHover = useCallback(
    (index: number) => {
      if (isMenuOpen && state.openMenubarIndex !== index) {
        openMenubarMenu(index, 'first');
      }
    },
    [isMenuOpen, state.openMenubarIndex, openMenubarMenu]
  );

  // Get first focusable item from menu items
  const getFirstFocusableItem = useCallback((menuItems: MenuItem[]): MenuItem | null => {
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
  }, []);

  // Handle menu item activation
  const activateMenuItem = useCallback(
    (item: MenuItem, radioGroupName?: string) => {
      if ('disabled' in item && item.disabled) return;

      if (item.type === 'item') {
        onItemSelect?.(item.id);
        closeAllMenus();
        menubarItemRefs.current.get(state.openMenubarIndex)?.focus();
      } else if (item.type === 'checkbox') {
        const newChecked = !checkboxStates.get(item.id);
        setCheckboxStates((prev) => new Map(prev).set(item.id, newChecked));
        item.onCheckedChange?.(newChecked);
        // Menu stays open for checkbox
      } else if (item.type === 'radio' && radioGroupName) {
        setRadioStates((prev) => new Map(prev).set(radioGroupName, item.id));
        // Menu stays open for radio
      } else if (item.type === 'submenu') {
        // Open submenu and focus first item
        const firstItem = getFirstFocusableItem(item.items);
        setState((prev) => ({
          ...prev,
          openSubmenuPath: [...prev.openSubmenuPath, item.id],
          focusedItemPath: firstItem
            ? [...prev.focusedItemPath, firstItem.id]
            : prev.focusedItemPath,
        }));
      }
    },
    [onItemSelect, closeAllMenus, checkboxStates, state.openMenubarIndex, getFirstFocusableItem]
  );

  // Handle menu item keyboard navigation
  const handleMenuKeyDown = useCallback(
    (
      event: KeyboardEvent<HTMLSpanElement>,
      item: MenuItem,
      menuItems: MenuItem[],
      isSubmenu: boolean,
      radioGroupName?: string
    ) => {
      const focusableItems = getFocusableItems(menuItems);
      const currentIndex = focusableItems.findIndex((i) => i.id === item.id);

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          // Disabled items are focusable per APG
          const nextIndex = (currentIndex + 1) % focusableItems.length;
          const nextItem = focusableItems[nextIndex];
          if (nextItem) {
            setState((prev) => ({
              ...prev,
              focusedItemPath: [...prev.focusedItemPath.slice(0, -1), nextItem.id],
            }));
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          // Disabled items are focusable per APG
          const prevIndex = currentIndex === 0 ? focusableItems.length - 1 : currentIndex - 1;
          const prevItem = focusableItems[prevIndex];
          if (prevItem) {
            setState((prev) => ({
              ...prev,
              focusedItemPath: [...prev.focusedItemPath.slice(0, -1), prevItem.id],
            }));
          }
          break;
        }
        case 'ArrowRight': {
          event.preventDefault();
          if (item.type === 'submenu') {
            // Open submenu and focus first item
            const firstItem = getFirstFocusableItem(item.items);
            setState((prev) => ({
              ...prev,
              openSubmenuPath: [...prev.openSubmenuPath, item.id],
              focusedItemPath: firstItem
                ? [...prev.focusedItemPath, firstItem.id]
                : prev.focusedItemPath,
            }));
          } else if (!isSubmenu) {
            // Move to next menubar item
            const nextMenubarIndex = (state.openMenubarIndex + 1) % items.length;
            openMenubarMenu(nextMenubarIndex, 'first');
          }
          break;
        }
        case 'ArrowLeft': {
          event.preventDefault();
          if (isSubmenu) {
            // Close submenu, return to parent submenu trigger
            // The parent ID is the last entry in openSubmenuPath (the submenu trigger that opened this submenu)
            const parentId = state.openSubmenuPath[state.openSubmenuPath.length - 1];
            setState((prev) => ({
              ...prev,
              openSubmenuPath: prev.openSubmenuPath.slice(0, -1),
              focusedItemPath: parentId
                ? [...prev.focusedItemPath.slice(0, -1).filter((id) => id !== parentId), parentId]
                : prev.focusedItemPath.slice(0, -1),
            }));
            // Explicitly focus parent after state update
            if (parentId) {
              setTimeout(() => {
                menuItemRefs.current.get(parentId)?.focus();
              }, 0);
            }
          } else {
            // Move to previous menubar item
            const prevMenubarIndex =
              state.openMenubarIndex === 0 ? items.length - 1 : state.openMenubarIndex - 1;
            openMenubarMenu(prevMenubarIndex, 'first');
          }
          break;
        }
        case 'Home': {
          event.preventDefault();
          // Disabled items are focusable per APG
          const firstItem = focusableItems[0];
          if (firstItem) {
            setState((prev) => ({
              ...prev,
              focusedItemPath: [...prev.focusedItemPath.slice(0, -1), firstItem.id],
            }));
          }
          break;
        }
        case 'End': {
          event.preventDefault();
          // Disabled items are focusable per APG
          const lastItem = focusableItems[focusableItems.length - 1];
          if (lastItem) {
            setState((prev) => ({
              ...prev,
              focusedItemPath: [...prev.focusedItemPath.slice(0, -1), lastItem.id],
            }));
          }
          break;
        }
        case 'Escape': {
          event.preventDefault();
          if (isSubmenu) {
            // Close submenu, return to parent
            setState((prev) => ({
              ...prev,
              openSubmenuPath: prev.openSubmenuPath.slice(0, -1),
              focusedItemPath: prev.focusedItemPath.slice(0, -1),
            }));
          } else {
            // Close menu, return to menubar item
            closeAllMenus();
            menubarItemRefs.current.get(state.openMenubarIndex)?.focus();
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
    },
    [
      getFocusableItems,
      getFirstFocusableItem,
      state.openMenubarIndex,
      state.openSubmenuPath,
      items.length,
      openMenubarMenu,
      closeAllMenus,
      activateMenuItem,
      handleTypeAhead,
    ]
  );

  // Render menu items recursively
  const renderMenuItems = useCallback(
    (
      menuItems: MenuItem[],
      parentId: string,
      isSubmenu: boolean,
      depth: number = 0
    ): ReactElement[] => {
      const elements: ReactElement[] = [];

      menuItems.forEach((item) => {
        if (item.type === 'separator') {
          elements.push(
            <li key={item.id} role="none">
              <hr className="apg-menubar-separator" />
            </li>
          );
        } else if (item.type === 'radiogroup') {
          const { name, label, id } = item;
          elements.push(
            <li key={id} role="none">
              <ul role="group" aria-label={label} className="apg-menubar-group">
                {item.items.map((radioItem) => {
                  const { id: radioItemId, label: radioItemLabel, disabled } = radioItem;
                  const isChecked = radioStates.get(name) === radioItemId;
                  const isFocused =
                    state.focusedItemPath[state.focusedItemPath.length - 1] === radioItemId;

                  return (
                    <li key={radioItemId} role="none">
                      <span
                        ref={(el) => {
                          if (el) {
                            menuItemRefs.current.set(radioItemId, el);
                          } else {
                            menuItemRefs.current.delete(radioItemId);
                          }
                        }}
                        role="menuitemradio"
                        aria-checked={isChecked}
                        aria-disabled={disabled || undefined}
                        tabIndex={isFocused ? 0 : -1}
                        className="apg-menubar-menuitem apg-menubar-menuitemradio"
                        onClick={() => activateMenuItem(radioItem, name)}
                        onKeyDown={(e) =>
                          handleMenuKeyDown(e, radioItem, menuItems, isSubmenu, name)
                        }
                      >
                        {radioItemLabel}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        } else if (item.type === 'checkbox') {
          const isChecked = checkboxStates.get(item.id) ?? false;
          const isFocused = state.focusedItemPath[state.focusedItemPath.length - 1] === item.id;

          elements.push(
            <li key={item.id} role="none">
              <span
                ref={(el) => {
                  if (el) {
                    menuItemRefs.current.set(item.id, el);
                  } else {
                    menuItemRefs.current.delete(item.id);
                  }
                }}
                role="menuitemcheckbox"
                aria-checked={isChecked}
                aria-disabled={item.disabled || undefined}
                tabIndex={isFocused ? 0 : -1}
                className="apg-menubar-menuitem apg-menubar-menuitemcheckbox"
                onClick={() => activateMenuItem(item)}
                onKeyDown={(e) => handleMenuKeyDown(e, item, menuItems, isSubmenu)}
              >
                {item.label}
              </span>
            </li>
          );
        } else if (item.type === 'submenu') {
          const isExpanded = state.openSubmenuPath.includes(item.id);
          const isFocused = state.focusedItemPath[state.focusedItemPath.length - 1] === item.id;
          const submenuId = `${instanceId}-submenu-${item.id}`;

          elements.push(
            <li key={item.id} role="none">
              <span
                id={`${instanceId}-menuitem-${item.id}`}
                ref={(el) => {
                  if (el) {
                    menuItemRefs.current.set(item.id, el);
                  } else {
                    menuItemRefs.current.delete(item.id);
                  }
                }}
                role="menuitem"
                aria-haspopup="menu"
                aria-expanded={isExpanded}
                aria-disabled={item.disabled || undefined}
                tabIndex={isFocused ? 0 : -1}
                className="apg-menubar-menuitem apg-menubar-submenu-trigger"
                onClick={() => activateMenuItem(item)}
                onKeyDown={(e) => handleMenuKeyDown(e, item, menuItems, isSubmenu)}
              >
                {item.label}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ marginLeft: 'auto', position: 'relative', top: '1px' }}
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </span>
              <ul
                id={submenuId}
                role="menu"
                aria-labelledby={`${instanceId}-menuitem-${item.id}`}
                className="apg-menubar-submenu"
                aria-hidden={!isExpanded}
              >
                {isExpanded && renderMenuItems(item.items, item.id, true, depth + 1)}
              </ul>
            </li>
          );
        } else {
          // Regular menuitem
          const isFocused = state.focusedItemPath[state.focusedItemPath.length - 1] === item.id;

          elements.push(
            <li key={item.id} role="none">
              <span
                ref={(el) => {
                  if (el) {
                    menuItemRefs.current.set(item.id, el);
                  } else {
                    menuItemRefs.current.delete(item.id);
                  }
                }}
                role="menuitem"
                aria-disabled={item.disabled || undefined}
                tabIndex={isFocused ? 0 : -1}
                className="apg-menubar-menuitem"
                onClick={() => activateMenuItem(item)}
                onKeyDown={(e) => handleMenuKeyDown(e, item, menuItems, isSubmenu)}
              >
                {item.label}
              </span>
            </li>
          );
        }
      });

      return elements;
    },
    [
      instanceId,
      state.openSubmenuPath,
      state.focusedItemPath,
      checkboxStates,
      radioStates,
      activateMenuItem,
      handleMenuKeyDown,
    ]
  );

  return (
    <ul
      ref={containerRef}
      role="menubar"
      className={`apg-menubar ${className}`.trim()}
      {...restProps}
    >
      {items.map((menubarItem, index) => {
        const isExpanded = state.openMenubarIndex === index;
        const menuId = `${instanceId}-menu-${menubarItem.id}`;
        const menubarItemId = `${instanceId}-menubar-${menubarItem.id}`;

        return (
          <li key={menubarItem.id} role="none">
            <span
              id={menubarItemId}
              ref={(el) => {
                if (el) {
                  menubarItemRefs.current.set(index, el);
                } else {
                  menubarItemRefs.current.delete(index);
                }
              }}
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={isExpanded}
              tabIndex={index === menubarFocusIndex ? 0 : -1}
              className="apg-menubar-trigger"
              onClick={() => handleMenubarClick(index)}
              onKeyDown={(e) => handleMenubarKeyDown(e, index)}
              onMouseEnter={() => handleMenubarHover(index)}
            >
              {menubarItem.label}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ position: 'relative', top: '1px', opacity: 0.7 }}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <ul
              id={menuId}
              role="menu"
              aria-labelledby={menubarItemId}
              className="apg-menubar-menu"
              aria-hidden={!isExpanded}
            >
              {isExpanded && renderMenuItems(menubarItem.items, menubarItem.id, false)}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

export default Menubar;
