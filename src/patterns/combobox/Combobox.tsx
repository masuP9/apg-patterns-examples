import { cn } from '@/lib/utils';
import type { HTMLAttributes, KeyboardEvent, ReactElement } from 'react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

export interface ComboboxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'onChange' | 'onSelect'
> {
  /** List of options */
  options: ComboboxOption[];
  /** Selected option ID (controlled) */
  selectedOptionId?: string;
  /** Default selected option ID */
  defaultSelectedOptionId?: string;
  /** Input value (controlled) */
  inputValue?: string;
  /** Default input value */
  defaultInputValue?: string;
  /** Label text */
  label: string;
  /** Placeholder */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Autocomplete type */
  autocomplete?: 'none' | 'list' | 'both';
  /** Message shown when no results found */
  noResultsMessage?: string;

  /** Selection callback */
  onSelect?: (option: ComboboxOption) => void;

  /** Input change callback */
  onInputChange?: (value: string) => void;

  /** Popup open/close callback */
  onOpenChange?: (isOpen: boolean) => void;
}

export function Combobox({
  options,
  selectedOptionId: controlledSelectedId,
  defaultSelectedOptionId,
  inputValue: controlledInputValue,
  defaultInputValue = '',
  label,
  placeholder,
  disabled = false,
  autocomplete = 'list',
  noResultsMessage = 'No results found',
  onSelect,
  onInputChange,
  onOpenChange,
  className = '',
  ...restProps
}: ComboboxProps): ReactElement {
  const instanceId = useId();
  const inputId = `${instanceId}-input`;
  const labelId = `${instanceId}-label`;
  const listboxId = `${instanceId}-listbox`;

  // Internal state
  const [isOpen, setIsOpen] = useState(false);
  const [internalInputValue, setInternalInputValue] = useState(() => {
    if (!defaultSelectedOptionId) {
      return defaultInputValue;
    }

    const option = options.find(({ id }) => id === defaultSelectedOptionId);

    if (option === undefined) {
      return defaultInputValue;
    }

    return option.label;
  });
  const [internalSelectedId, setInternalSelectedId] = useState<string | undefined>(
    defaultSelectedOptionId
  );
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isSearching, setIsSearching] = useState(false);

  // Track value before opening for Escape restoration
  const valueBeforeOpen = useRef<string>('');
  const isComposing = useRef(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine controlled vs uncontrolled
  const inputValue = controlledInputValue ?? internalInputValue;
  const selectedId = controlledSelectedId ?? internalSelectedId;

  // Get selected option's label
  const selectedLabel = useMemo(() => {
    if (!selectedId) {
      return '';
    }
    const option = options.find(({ id }) => id === selectedId);
    return option?.label ?? '';
  }, [options, selectedId]);

  // Filter options based on input value and search mode
  const filteredOptions = useMemo(() => {
    // Don't filter if autocomplete is none
    if (autocomplete === 'none') {
      return options;
    }

    // Don't filter if input is empty
    if (!inputValue) {
      return options;
    }

    // Don't filter if not in search mode AND input matches selected label
    if (!isSearching && inputValue === selectedLabel) {
      return options;
    }

    const lowerInputValue = inputValue.toLowerCase();

    return options.filter(({ label }) => label.toLowerCase().includes(lowerInputValue));
  }, [options, inputValue, autocomplete, isSearching, selectedLabel]);

  // Get enabled options from filtered list
  const enabledOptions = useMemo(
    () => filteredOptions.filter(({ disabled }) => !disabled),
    [filteredOptions]
  );

  // Generate option IDs
  const getOptionId = useCallback(
    (optionId: string) => `${instanceId}-option-${optionId}`,
    [instanceId]
  );

  // Get active descendant ID
  const activeDescendantId = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= filteredOptions.length) {
      return undefined;
    }

    const option = filteredOptions[activeIndex];

    if (option === undefined) {
      return undefined;
    }

    return getOptionId(option.id);
  }, [activeIndex, filteredOptions, getOptionId]);

  // Update input value
  const updateInputValue = useCallback(
    (value: string) => {
      if (controlledInputValue === undefined) {
        setInternalInputValue(value);
      }
      onInputChange?.(value);
    },
    [controlledInputValue, onInputChange]
  );

  // Open popup
  const openPopup = useCallback(
    (focusPosition?: 'first' | 'last') => {
      if (isOpen) {
        return;
      }

      valueBeforeOpen.current = inputValue;
      setIsOpen(true);
      onOpenChange?.(true);

      if (!focusPosition || enabledOptions.length === 0) {
        return;
      }

      const targetOption =
        focusPosition === 'first' ? enabledOptions[0] : enabledOptions[enabledOptions.length - 1];
      const { id: targetId } = targetOption;
      const targetIndex = filteredOptions.findIndex(({ id }) => id === targetId);

      setActiveIndex(targetIndex);
    },
    [isOpen, inputValue, enabledOptions, filteredOptions, onOpenChange]
  );

  // Close popup
  const closePopup = useCallback(
    (restore = false) => {
      setIsOpen(false);
      setActiveIndex(-1);
      setIsSearching(false);
      onOpenChange?.(false);

      if (restore) {
        updateInputValue(valueBeforeOpen.current);
      }
    },
    [onOpenChange, updateInputValue]
  );

  // Select option
  const selectOption = useCallback(
    ({ id, label, disabled }: ComboboxOption) => {
      if (disabled) {
        return;
      }

      if (controlledSelectedId === undefined) {
        setInternalSelectedId(id);
      }

      setIsSearching(false);
      updateInputValue(label);
      onSelect?.({ id, label, disabled });
      closePopup();
    },
    [controlledSelectedId, updateInputValue, onSelect, closePopup]
  );

  // Find next/previous enabled option index
  const findEnabledIndex = useCallback(
    (startIndex: number, direction: 'next' | 'prev' | 'first' | 'last'): number => {
      if (enabledOptions.length === 0) {
        return -1;
      }

      if (direction === 'first') {
        const { id: firstId } = enabledOptions[0];
        return filteredOptions.findIndex(({ id }) => id === firstId);
      }

      if (direction === 'last') {
        const { id: lastId } = enabledOptions[enabledOptions.length - 1];
        return filteredOptions.findIndex(({ id }) => id === lastId);
      }

      const currentOption = filteredOptions[startIndex];
      const currentEnabledIndex = currentOption
        ? enabledOptions.findIndex(({ id }) => id === currentOption.id)
        : -1;

      if (direction === 'next') {
        if (currentEnabledIndex < 0) {
          const { id: firstId } = enabledOptions[0];
          return filteredOptions.findIndex(({ id }) => id === firstId);
        }

        if (currentEnabledIndex >= enabledOptions.length - 1) {
          return startIndex;
        }

        const { id: nextId } = enabledOptions[currentEnabledIndex + 1];
        return filteredOptions.findIndex(({ id }) => id === nextId);
      }

      // direction === 'prev'
      if (currentEnabledIndex < 0) {
        const { id: lastId } = enabledOptions[enabledOptions.length - 1];
        return filteredOptions.findIndex(({ id }) => id === lastId);
      }

      if (currentEnabledIndex <= 0) {
        return startIndex;
      }

      const { id: prevId } = enabledOptions[currentEnabledIndex - 1];
      return filteredOptions.findIndex(({ id }) => id === prevId);
    },
    [enabledOptions, filteredOptions]
  );

  // Handle input keydown
  const handleInputKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (isComposing.current) {
        return;
      }

      const { key, altKey } = event;

      switch (key) {
        case 'ArrowDown': {
          event.preventDefault();

          if (altKey) {
            if (isOpen) {
              return;
            }

            valueBeforeOpen.current = inputValue;
            setIsOpen(true);
            onOpenChange?.(true);
            return;
          }

          if (!isOpen) {
            openPopup('first');
            return;
          }

          const nextIndex = findEnabledIndex(activeIndex, 'next');

          if (nextIndex >= 0) {
            setActiveIndex(nextIndex);
          }
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();

          if (altKey) {
            if (!isOpen || activeIndex < 0) {
              return;
            }

            const option = filteredOptions[activeIndex];

            if (option === undefined || option.disabled) {
              return;
            }

            selectOption(option);
            return;
          }

          if (!isOpen) {
            openPopup('last');
            return;
          }

          const prevIndex = findEnabledIndex(activeIndex, 'prev');

          if (prevIndex >= 0) {
            setActiveIndex(prevIndex);
          }
          break;
        }
        case 'Home': {
          if (!isOpen) {
            return;
          }

          event.preventDefault();

          const firstIndex = findEnabledIndex(0, 'first');

          if (firstIndex >= 0) {
            setActiveIndex(firstIndex);
          }
          break;
        }
        case 'End': {
          if (!isOpen) {
            return;
          }

          event.preventDefault();

          const lastIndex = findEnabledIndex(0, 'last');

          if (lastIndex >= 0) {
            setActiveIndex(lastIndex);
          }
          break;
        }
        case 'Enter': {
          if (!isOpen || activeIndex < 0) {
            return;
          }

          event.preventDefault();

          const option = filteredOptions[activeIndex];

          if (option === undefined || option.disabled) {
            return;
          }

          selectOption(option);
          break;
        }
        case 'Escape': {
          if (!isOpen) {
            return;
          }

          event.preventDefault();
          closePopup(true);
          break;
        }
        case 'Tab': {
          if (isOpen) {
            closePopup();
          }
          break;
        }
      }
    },
    [
      isOpen,
      inputValue,
      activeIndex,
      filteredOptions,
      openPopup,
      closePopup,
      selectOption,
      findEnabledIndex,
      onOpenChange,
    ]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      setIsSearching(true);
      updateInputValue(value);

      if (!isOpen && !isComposing.current) {
        valueBeforeOpen.current = inputValue;
        setIsOpen(true);
        onOpenChange?.(true);
      }

      setActiveIndex(-1);
    },
    [isOpen, inputValue, updateInputValue, onOpenChange]
  );

  // Handle option click
  const handleOptionClick = useCallback(
    (option: ComboboxOption) => {
      if (option.disabled) {
        return;
      }

      selectOption(option);
    },
    [selectOption]
  );

  // Handle option hover
  const handleOptionHover = useCallback(
    ({ id }: ComboboxOption) => {
      const index = filteredOptions.findIndex((option) => option.id === id);

      if (index < 0) {
        return;
      }

      setActiveIndex(index);
    },
    [filteredOptions]
  );

  // Handle IME composition
  const handleCompositionStart = useCallback(() => {
    isComposing.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposing.current = false;
  }, []);

  // Handle focus - open popup when input receives focus
  const handleFocus = useCallback(() => {
    if (isOpen || disabled) {
      return;
    }

    openPopup();
  }, [isOpen, disabled, openPopup]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const { current: container } = containerRef;

      if (container === null) {
        return;
      }

      if (event.target instanceof Node && !container.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closePopup]);

  // Clear active index when filtered options change and no match exists
  useEffect(() => {
    if (activeIndex >= 0 && activeIndex >= filteredOptions.length) {
      setActiveIndex(-1);
    }
  }, [activeIndex, filteredOptions.length]);

  // Reset search mode when input value matches selected label or becomes empty
  useEffect(() => {
    if (inputValue === '' || inputValue === selectedLabel) {
      setIsSearching(false);
    }
  }, [inputValue, selectedLabel]);

  return (
    <div ref={containerRef} className={cn('apg-combobox', className)} {...restProps}>
      <label id={labelId} htmlFor={inputId} className="apg-combobox-label">
        {label}
      </label>
      <div className="apg-combobox-input-wrapper">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          className="apg-combobox-input"
          aria-autocomplete={autocomplete}
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-activedescendant={activeDescendantId || undefined}
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          onFocus={handleFocus}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
        />
        <span className="apg-combobox-caret" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      </div>
      <ul
        id={listboxId}
        role="listbox"
        aria-labelledby={labelId}
        className="apg-combobox-listbox"
        hidden={!isOpen || undefined}
      >
        {filteredOptions.length === 0 && (
          <li className="apg-combobox-no-results" role="status">
            {noResultsMessage}
          </li>
        )}
        {filteredOptions.map(({ id, label: optionLabel, disabled: optionDisabled }, index) => {
          const isActive = index === activeIndex;
          const isSelected = id === selectedId;

          return (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- managed on option aria-activedescendant
            <li
              key={id}
              id={getOptionId(id)}
              role="option"
              className="apg-combobox-option"
              aria-selected={isActive}
              aria-disabled={optionDisabled || undefined}
              onClick={() =>
                handleOptionClick({ id, label: optionLabel, disabled: optionDisabled })
              }
              onMouseEnter={() =>
                handleOptionHover({ id, label: optionLabel, disabled: optionDisabled })
              }
              data-selected={isSelected || undefined}
            >
              <span className="apg-combobox-option-icon" aria-hidden="true">
                <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                  <path d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z" />
                </svg>
              </span>
              {optionLabel}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Combobox;
