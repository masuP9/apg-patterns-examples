import type { ButtonHTMLAttributes, KeyboardEvent, ReactElement } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface MenuButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'aria-haspopup' | 'aria-expanded' | 'aria-controls' | 'type'
> {
  items: MenuItem[];
  label: string;
  onItemSelect?: (itemId: string) => void;
  defaultOpen?: boolean;
}

export function MenuButton({
  items,
  label,
  onItemSelect,
  defaultOpen = false,
  className = '',
  ...restProps
}: MenuButtonProps): ReactElement {
  const instanceId = useId();
  const buttonId = `${instanceId}-button`;
  const menuId = `${instanceId}-menu`;

  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuItemRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const typeAheadBuffer = useRef<string>('');
  const typeAheadTimeoutId = useRef<number | null>(null);
  const typeAheadTimeout = 500;

  // Get available (non-disabled) items
  const availableItems = useMemo(() => items.filter((item) => !item.disabled), [items]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setFocusedIndex(-1);
    // Clear type-ahead state to prevent stale buffer on reopen
    typeAheadBuffer.current = '';
    if (typeAheadTimeoutId.current !== null) {
      clearTimeout(typeAheadTimeoutId.current);
      typeAheadTimeoutId.current = null;
    }
  }, []);

  const openMenu = useCallback(
    (focusPosition: 'first' | 'last') => {
      if (availableItems.length === 0) {
        // All items disabled, open menu but keep focus on button
        setIsOpen(true);
        return;
      }

      setIsOpen(true);
      const targetIndex = focusPosition === 'first' ? 0 : availableItems.length - 1;
      setFocusedIndex(targetIndex);
    },
    [availableItems]
  );

  // Focus menu item when focusedIndex changes and menu is open
  useEffect(() => {
    if (!isOpen || focusedIndex < 0) return;

    const targetItem = availableItems[focusedIndex];
    if (targetItem) {
      menuItemRefs.current.get(targetItem.id)?.focus();
    }
  }, [isOpen, focusedIndex, availableItems]);

  const toggleMenu = useCallback(() => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu('first');
    }
  }, [isOpen, closeMenu, openMenu]);

  const handleItemClick = useCallback(
    (item: MenuItem) => {
      if (item.disabled) return;
      onItemSelect?.(item.id);
      closeMenu();
      buttonRef.current?.focus();
    },
    [onItemSelect, closeMenu]
  );

  const handleButtonKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
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
    },
    [openMenu]
  );

  const handleTypeAhead = useCallback(
    (char: string) => {
      if (availableItems.length === 0) return;

      // Clear existing timeout
      if (typeAheadTimeoutId.current !== null) {
        clearTimeout(typeAheadTimeoutId.current);
      }

      // Add character to buffer
      typeAheadBuffer.current += char.toLowerCase();

      const buffer = typeAheadBuffer.current;
      const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

      // For same char repeated or single char, start from next item to cycle through matches
      // For multi-char string, start from current to allow refining the search
      let startIndex: number;
      let searchStr: string;

      if (isSameChar) {
        // Same character repeated: cycle through matches
        typeAheadBuffer.current = buffer[0];
        searchStr = buffer[0];
        startIndex = focusedIndex >= 0 ? (focusedIndex + 1) % availableItems.length : 0;
      } else if (buffer.length === 1) {
        // Single character: start from next item to find next match
        searchStr = buffer;
        startIndex = focusedIndex >= 0 ? (focusedIndex + 1) % availableItems.length : 0;
      } else {
        // Multi-character: refine search from current position
        searchStr = buffer;
        startIndex = focusedIndex >= 0 ? focusedIndex : 0;
      }

      // Search from start index, wrapping around
      for (let i = 0; i < availableItems.length; i++) {
        const index = (startIndex + i) % availableItems.length;
        const option = availableItems[index];
        if (option.label.toLowerCase().startsWith(searchStr)) {
          setFocusedIndex(index);
          break;
        }
      }

      // Set timeout to clear buffer
      typeAheadTimeoutId.current = window.setTimeout(() => {
        typeAheadBuffer.current = '';
        typeAheadTimeoutId.current = null;
      }, typeAheadTimeout);
    },
    [availableItems, focusedIndex]
  );

  const handleMenuKeyDown = useCallback(
    (event: KeyboardEvent<HTMLLIElement>, item: MenuItem) => {
      // Guard: no available items to navigate
      if (availableItems.length === 0) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu();
          buttonRef.current?.focus();
        }
        return;
      }

      const currentIndex = availableItems.findIndex((i) => i.id === item.id);

      // Guard: disabled item received focus (e.g., programmatic focus)
      if (currentIndex < 0) {
        if (event.key === 'Escape') {
          event.preventDefault();
          closeMenu();
          buttonRef.current?.focus();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowDown': {
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % availableItems.length;
          setFocusedIndex(nextIndex);
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          const prevIndex = currentIndex === 0 ? availableItems.length - 1 : currentIndex - 1;
          setFocusedIndex(prevIndex);
          break;
        }
        case 'Home': {
          event.preventDefault();
          setFocusedIndex(0);
          break;
        }
        case 'End': {
          event.preventDefault();
          setFocusedIndex(availableItems.length - 1);
          break;
        }
        case 'Escape': {
          event.preventDefault();
          closeMenu();
          buttonRef.current?.focus();
          break;
        }
        case 'Tab': {
          // Let the browser handle Tab, but close the menu
          closeMenu();
          break;
        }
        case 'Enter':
        case ' ': {
          event.preventDefault();
          if (!item.disabled) {
            onItemSelect?.(item.id);
            closeMenu();
            buttonRef.current?.focus();
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
    },
    [availableItems, closeMenu, onItemSelect, handleTypeAhead]
  );

  // Cleanup type-ahead timeout on unmount
  useEffect(() => {
    return () => {
      if (typeAheadTimeoutId.current !== null) {
        clearTimeout(typeAheadTimeoutId.current);
      }
    };
  }, []);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeMenu]);

  return (
    <div ref={containerRef} className={`apg-menu-button ${className}`.trim()}>
      <button
        ref={buttonRef}
        id={buttonId}
        type="button"
        className="apg-menu-button-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={toggleMenu}
        onKeyDown={handleButtonKeyDown}
        {...restProps}
      >
        {label}
      </button>
      <ul
        id={menuId}
        role="menu"
        aria-labelledby={buttonId}
        className="apg-menu-button-menu"
        hidden={!isOpen || undefined}
        inert={!isOpen || undefined}
      >
        {items.map((item) => {
          const availableIndex = availableItems.findIndex((i) => i.id === item.id);
          const isFocused = availableIndex === focusedIndex;
          const tabIndex = item.disabled ? -1 : isFocused ? 0 : -1;

          return (
            <li
              key={item.id}
              ref={(el) => {
                if (el) {
                  menuItemRefs.current.set(item.id, el);
                } else {
                  menuItemRefs.current.delete(item.id);
                }
              }}
              role="menuitem"
              tabIndex={tabIndex}
              aria-disabled={item.disabled || undefined}
              className="apg-menu-button-item"
              onClick={() => handleItemClick(item)}
              onKeyDown={(e) => handleMenuKeyDown(e, item)}
              onFocus={() => {
                if (!item.disabled && availableIndex >= 0) {
                  setFocusedIndex(availableIndex);
                }
              }}
            >
              {item.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default MenuButton;
