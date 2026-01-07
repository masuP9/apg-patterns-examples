import { useCallback, useId, useMemo, useRef, useState } from 'react';

export interface ListboxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ListboxProps {
  /** Array of options */
  options: ListboxOption[];
  /** Enable multi-select mode */
  multiselectable?: boolean;
  /** Orientation of the listbox */
  orientation?: 'vertical' | 'horizontal';
  /** Initially selected option ID(s) */
  defaultSelectedIds?: string[];
  /** Callback when selection changes */
  onSelectionChange?: (selectedIds: string[]) => void;
  /** Type-ahead search timeout in ms */
  typeAheadTimeout?: number;
  /** Accessible label */
  'aria-label'?: string;
  /** ID of labeling element */
  'aria-labelledby'?: string;
  /** Additional CSS class */
  className?: string;
}

export function Listbox({
  options,
  multiselectable = false,
  orientation = 'vertical',
  defaultSelectedIds = [],
  onSelectionChange,
  typeAheadTimeout = 500,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  className = '',
}: ListboxProps): React.ReactElement {
  const availableOptions = useMemo(() => options.filter((opt) => !opt.disabled), [options]);

  // Map of option id to index in availableOptions for O(1) lookup
  const availableIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    availableOptions.forEach(({ id }, index) => map.set(id, index));
    return map;
  }, [availableOptions]);

  const initialSelectedIds = useMemo(() => {
    if (defaultSelectedIds.length > 0) {
      return new Set(defaultSelectedIds);
    }
    if (availableOptions.length > 0) {
      // Single-select mode: select first available option by default
      if (!multiselectable) {
        return new Set([availableOptions[0].id]);
      }
    }
    return new Set<string>();
  }, [defaultSelectedIds, multiselectable, availableOptions]);

  // Compute initial focus index
  const initialFocusIndex = useMemo(() => {
    if (availableOptions.length === 0) return 0;
    const firstSelectedId = [...initialSelectedIds][0];
    const index = availableOptions.findIndex((opt) => opt.id === firstSelectedId);
    return index >= 0 ? index : 0;
  }, [initialSelectedIds, availableOptions]);

  const [selectedIds, setSelectedIds] = useState<Set<string>>(initialSelectedIds);
  const [focusedIndex, setFocusedIndex] = useState(initialFocusIndex);

  const listboxRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const typeAheadBuffer = useRef<string>('');
  const typeAheadTimeoutId = useRef<number | null>(null);
  // Track anchor for shift-selection range (synced with initial focus)
  const selectionAnchor = useRef<number>(initialFocusIndex);

  const instanceId = useId();

  const getOptionId = useCallback(
    (optionId: string) => `${instanceId}-option-${optionId}`,
    [instanceId]
  );

  const updateSelection = useCallback(
    (newSelectedIds: Set<string>) => {
      setSelectedIds(newSelectedIds);
      onSelectionChange?.([...newSelectedIds]);
    },
    [onSelectionChange]
  );

  const focusOption = useCallback(
    (index: number) => {
      const option = availableOptions[index];
      if (option) {
        setFocusedIndex(index);
        optionRefs.current.get(option.id)?.focus();
      }
    },
    [availableOptions]
  );

  const selectOption = useCallback(
    (optionId: string) => {
      if (multiselectable) {
        // Toggle selection
        const newSelected = new Set(selectedIds);
        if (newSelected.has(optionId)) {
          newSelected.delete(optionId);
        } else {
          newSelected.add(optionId);
        }
        updateSelection(newSelected);
      } else {
        // Single-select: replace selection
        updateSelection(new Set([optionId]));
      }
    },
    [multiselectable, selectedIds, updateSelection]
  );

  const selectRange = useCallback(
    (fromIndex: number, toIndex: number) => {
      const start = Math.min(fromIndex, toIndex);
      const end = Math.max(fromIndex, toIndex);
      const newSelected = new Set(selectedIds);

      for (let i = start; i <= end; i++) {
        const option = availableOptions[i];
        if (option) {
          newSelected.add(option.id);
        }
      }

      updateSelection(newSelected);
    },
    [availableOptions, selectedIds, updateSelection]
  );

  const selectAll = useCallback(() => {
    const allIds = new Set(availableOptions.map((opt) => opt.id));
    updateSelection(allIds);
  }, [availableOptions, updateSelection]);

  const handleTypeAhead = useCallback(
    (char: string) => {
      // Guard: no options to search
      if (availableOptions.length === 0) return;

      // Clear existing timeout
      if (typeAheadTimeoutId.current !== null) {
        clearTimeout(typeAheadTimeoutId.current);
      }

      // Add character to buffer
      typeAheadBuffer.current += char.toLowerCase();

      // Find matching option starting from current focus (or next if same char repeated)
      const buffer = typeAheadBuffer.current;
      const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

      let searchOptions = availableOptions;
      let startIndex = focusedIndex;

      // If repeating same character, cycle through matches starting from next
      if (isSameChar) {
        typeAheadBuffer.current = buffer[0]; // Reset buffer to single char
        startIndex = (focusedIndex + 1) % availableOptions.length;
      }

      // Search from start index, wrapping around
      for (let i = 0; i < searchOptions.length; i++) {
        const index = (startIndex + i) % searchOptions.length;
        const option = searchOptions[index];
        const searchStr = isSameChar ? buffer[0] : typeAheadBuffer.current;
        if (option.label.toLowerCase().startsWith(searchStr)) {
          focusOption(index);
          // Update anchor for shift-selection
          selectionAnchor.current = index;
          // Single-select: also select the option
          if (!multiselectable) {
            updateSelection(new Set([option.id]));
          }
          break;
        }
      }

      // Set timeout to clear buffer
      typeAheadTimeoutId.current = window.setTimeout(() => {
        typeAheadBuffer.current = '';
        typeAheadTimeoutId.current = null;
      }, typeAheadTimeout);
    },
    [
      availableOptions,
      focusedIndex,
      focusOption,
      multiselectable,
      typeAheadTimeout,
      updateSelection,
    ]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      // Guard: no options to navigate
      if (availableOptions.length === 0) return;

      const { key, shiftKey, ctrlKey, metaKey } = event;

      // Determine navigation keys based on orientation
      const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
      const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

      // Ignore navigation keys for wrong orientation
      if (orientation === 'vertical' && (key === 'ArrowLeft' || key === 'ArrowRight')) {
        return;
      }
      if (orientation === 'horizontal' && (key === 'ArrowUp' || key === 'ArrowDown')) {
        return;
      }

      let newIndex = focusedIndex;
      let shouldPreventDefault = false;

      switch (key) {
        case nextKey:
          if (focusedIndex < availableOptions.length - 1) {
            newIndex = focusedIndex + 1;
          }
          shouldPreventDefault = true;

          if (multiselectable && shiftKey) {
            // Extend selection
            focusOption(newIndex);
            selectRange(selectionAnchor.current, newIndex);
            return;
          }
          break;

        case prevKey:
          if (focusedIndex > 0) {
            newIndex = focusedIndex - 1;
          }
          shouldPreventDefault = true;

          if (multiselectable && shiftKey) {
            // Extend selection
            focusOption(newIndex);
            selectRange(selectionAnchor.current, newIndex);
            return;
          }
          break;

        case 'Home':
          newIndex = 0;
          shouldPreventDefault = true;

          if (multiselectable && shiftKey) {
            // Select from anchor to start
            focusOption(newIndex);
            selectRange(selectionAnchor.current, newIndex);
            return;
          }
          break;

        case 'End':
          newIndex = availableOptions.length - 1;
          shouldPreventDefault = true;

          if (multiselectable && shiftKey) {
            // Select from anchor to end
            focusOption(newIndex);
            selectRange(selectionAnchor.current, newIndex);
            return;
          }
          break;

        case ' ':
          shouldPreventDefault = true;
          if (multiselectable) {
            // Toggle selection of focused option
            const focusedOption = availableOptions[focusedIndex];
            if (focusedOption) {
              selectOption(focusedOption.id);
              // Update anchor
              selectionAnchor.current = focusedIndex;
            }
          }
          // Single-select: Space/Enter just confirms (selection already follows focus)
          return;

        case 'Enter':
          shouldPreventDefault = true;
          // Confirm current selection (useful for form submission scenarios)
          return;

        case 'a':
        case 'A':
          if ((ctrlKey || metaKey) && multiselectable) {
            shouldPreventDefault = true;
            selectAll();
            return;
          }
          // Fall through to type-ahead
          break;
      }

      if (shouldPreventDefault) {
        event.preventDefault();

        if (newIndex !== focusedIndex) {
          focusOption(newIndex);

          // Single-select: selection follows focus
          if (!multiselectable) {
            const newOption = availableOptions[newIndex];
            if (newOption) {
              updateSelection(new Set([newOption.id]));
            }
          } else {
            // Multi-select without shift: just move focus, update anchor
            selectionAnchor.current = newIndex;
          }
        }
        return;
      }

      // Type-ahead: single printable character
      if (key.length === 1 && !ctrlKey && !metaKey) {
        event.preventDefault();
        handleTypeAhead(key);
      }
    },
    [
      orientation,
      focusedIndex,
      availableOptions,
      multiselectable,
      focusOption,
      selectRange,
      selectOption,
      selectAll,
      updateSelection,
      handleTypeAhead,
    ]
  );

  const handleOptionClick = useCallback(
    (optionId: string, index: number) => {
      focusOption(index);
      selectOption(optionId);
      selectionAnchor.current = index;
    },
    [focusOption, selectOption]
  );

  const containerClass = `apg-listbox ${
    orientation === 'horizontal' ? 'apg-listbox--horizontal' : ''
  } ${className}`.trim();

  // If no available options, listbox itself needs tabIndex for keyboard access
  const listboxTabIndex = availableOptions.length === 0 ? 0 : undefined;

  return (
    <ul
      ref={listboxRef}
      role="listbox"
      aria-multiselectable={multiselectable || undefined}
      aria-orientation={orientation}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledby}
      tabIndex={listboxTabIndex}
      className={containerClass}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const isSelected = selectedIds.has(option.id);
        const availableIndex = availableIndexMap.get(option.id) ?? -1;
        const isFocusTarget = availableIndex === focusedIndex;
        const tabIndex = option.disabled ? -1 : isFocusTarget ? 0 : -1;

        const optionClass = `apg-listbox-option ${
          isSelected ? 'apg-listbox-option--selected' : ''
        } ${option.disabled ? 'apg-listbox-option--disabled' : ''}`.trim();

        return (
          <li
            key={option.id}
            ref={(el) => {
              if (el) {
                optionRefs.current.set(option.id, el);
              } else {
                optionRefs.current.delete(option.id);
              }
            }}
            role="option"
            id={getOptionId(option.id)}
            aria-selected={isSelected}
            aria-disabled={option.disabled || undefined}
            tabIndex={tabIndex}
            className={optionClass}
            onClick={() => !option.disabled && handleOptionClick(option.id, availableIndex)}
          >
            <span className="apg-listbox-option-icon" aria-hidden="true">
              <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
                  fill="currentColor"
                />
              </svg>
            </span>
            {option.label}
          </li>
        );
      })}
    </ul>
  );
}

export default Listbox;
