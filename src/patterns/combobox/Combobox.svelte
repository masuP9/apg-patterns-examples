<script lang="ts">
  import { cn } from '@/lib/utils';
  import { onDestroy, tick } from 'svelte';

  export interface ComboboxOption {
    id: string;
    label: string;
    disabled?: boolean;
  }

  interface ComboboxProps {
    options: ComboboxOption[];
    selectedOptionId?: string;
    defaultSelectedOptionId?: string;
    inputValue?: string;
    defaultInputValue?: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    autocomplete?: 'none' | 'list' | 'both';
    noResultsMessage?: string;
    onSelect?: (option: ComboboxOption) => void;
    onInputChange?: (value: string) => void;
    onOpenChange?: (isOpen: boolean) => void;
    class?: string;
  }

  let {
    options = [],
    selectedOptionId = undefined,
    defaultSelectedOptionId = undefined,
    inputValue = undefined,
    defaultInputValue = '',
    label,
    placeholder = undefined,
    disabled = false,
    autocomplete = 'list',
    noResultsMessage = 'No results found',
    onSelect = () => {},
    onInputChange = () => {},
    onOpenChange = () => {},
    class: className = '',
    ...restProps
  }: ComboboxProps = $props();

  // Generate ID for SSR-safe aria-controls/aria-labelledby
  const instanceId = `combobox-${Math.random().toString(36).slice(2, 11)}`;

  // Compute initial input value
  const getInitialInputValue = () => {
    if (defaultSelectedOptionId) {
      const option = options.find((o) => o.id === defaultSelectedOptionId);
      return option?.label ?? defaultInputValue;
    }
    return defaultInputValue;
  };

  // State
  let isOpen = $state(false);
  let activeIndex = $state(-1);
  let isComposing = $state(false);
  let valueBeforeOpen = '';
  let internalInputValue = $state(getInitialInputValue());
  let internalSelectedId = $state<string | undefined>(defaultSelectedOptionId);
  let isSearching = $state(false);

  // Refs
  let containerElement: HTMLDivElement;
  let inputElement: HTMLInputElement;

  // Derived values
  let inputId = $derived(`${instanceId}-input`);
  let labelId = $derived(`${instanceId}-label`);
  let listboxId = $derived(`${instanceId}-listbox`);

  let currentInputValue = $derived(inputValue !== undefined ? inputValue : internalInputValue);
  let currentSelectedId = $derived(selectedOptionId ?? internalSelectedId);

  // Get selected option's label
  let selectedLabel = $derived.by(() => {
    if (!currentSelectedId) {
      return '';
    }
    const option = options.find(({ id }) => id === currentSelectedId);
    return option?.label ?? '';
  });

  let filteredOptions = $derived.by(() => {
    // Don't filter if autocomplete is none
    if (autocomplete === 'none') {
      return options;
    }

    // Don't filter if input is empty
    if (!currentInputValue) {
      return options;
    }

    // Don't filter if not in search mode AND input matches selected label
    if (!isSearching && currentInputValue === selectedLabel) {
      return options;
    }

    const lowerInputValue = currentInputValue.toLowerCase();

    return options.filter(({ label }) => label.toLowerCase().includes(lowerInputValue));
  });

  let enabledOptions = $derived(filteredOptions.filter(({ disabled }) => !disabled));

  let activeDescendantId = $derived.by(() => {
    if (activeIndex < 0 || activeIndex >= filteredOptions.length) {
      return undefined;
    }
    const option = filteredOptions[activeIndex];
    return option ? getOptionId(option.id) : undefined;
  });

  onDestroy(() => {
    if (typeof document !== 'undefined') {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  // Click outside effect
  $effect(() => {
    if (typeof document === 'undefined') return;

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  // Clear active index when filtered options change
  $effect(() => {
    if (activeIndex >= 0 && activeIndex >= filteredOptions.length) {
      activeIndex = -1;
    }
  });

  // Reset search mode when input value matches selected label or becomes empty
  $effect(() => {
    if (currentInputValue === '' || currentInputValue === selectedLabel) {
      isSearching = false;
    }
  });

  function getOptionId(optionId: string): string {
    return `${instanceId}-option-${optionId}`;
  }

  function updateInputValue(value: string) {
    if (inputValue === undefined) {
      internalInputValue = value;
    }
    onInputChange(value);
  }

  function openPopup(focusPosition?: 'first' | 'last') {
    if (isOpen) {
      return;
    }

    valueBeforeOpen = currentInputValue;
    isOpen = true;
    onOpenChange(true);

    if (!focusPosition || enabledOptions.length === 0) {
      return;
    }

    const targetOption =
      focusPosition === 'first' ? enabledOptions[0] : enabledOptions[enabledOptions.length - 1];
    const { id: targetId } = targetOption;
    const targetIndex = filteredOptions.findIndex(({ id }) => id === targetId);
    activeIndex = targetIndex;
  }

  function closePopup(restore = false) {
    isOpen = false;
    activeIndex = -1;
    isSearching = false;
    onOpenChange(false);

    if (restore) {
      updateInputValue(valueBeforeOpen);
    }
  }

  function selectOption({ id, label, disabled }: ComboboxOption) {
    if (disabled) {
      return;
    }

    if (selectedOptionId === undefined) {
      internalSelectedId = id;
    }

    isSearching = false;
    updateInputValue(label);
    onSelect({ id, label, disabled });
    closePopup();
  }

  function findEnabledIndex(
    startIndex: number,
    direction: 'next' | 'prev' | 'first' | 'last'
  ): number {
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
  }

  function handleClickOutside(event: MouseEvent) {
    if (!containerElement) {
      return;
    }

    if (!containerElement.contains(event.target as Node)) {
      closePopup();
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    isSearching = true;
    updateInputValue(value);

    if (!isOpen && !isComposing) {
      valueBeforeOpen = currentInputValue;
      isOpen = true;
      onOpenChange(true);
    }

    activeIndex = -1;
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (isComposing) {
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

          valueBeforeOpen = currentInputValue;
          isOpen = true;
          onOpenChange(true);
          return;
        }

        if (!isOpen) {
          openPopup('first');
          return;
        }

        const nextIndex = findEnabledIndex(activeIndex, 'next');

        if (nextIndex >= 0) {
          activeIndex = nextIndex;
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
          activeIndex = prevIndex;
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
          activeIndex = firstIndex;
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
          activeIndex = lastIndex;
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
  }

  function handleOptionClick(option: ComboboxOption) {
    if (option.disabled) {
      return;
    }

    selectOption(option);
  }

  function handleOptionHover({ id }: ComboboxOption) {
    const index = filteredOptions.findIndex((option) => option.id === id);

    if (index < 0) {
      return;
    }

    activeIndex = index;
  }

  function handleCompositionStart() {
    isComposing = true;
  }

  function handleCompositionEnd() {
    isComposing = false;
  }

  // Handle focus - open popup when input receives focus
  function handleFocus() {
    if (isOpen || disabled) {
      return;
    }

    openPopup();
  }
</script>

<div bind:this={containerElement} class={cn('apg-combobox', className)}>
  <label id={labelId} for={inputId} class="apg-combobox-label">
    {label}
  </label>
  <div class="apg-combobox-input-wrapper">
    <input
      bind:this={inputElement}
      id={inputId}
      type="text"
      role="combobox"
      class="apg-combobox-input"
      aria-autocomplete={autocomplete}
      aria-expanded={isOpen}
      aria-controls={listboxId}
      aria-labelledby={labelId}
      aria-activedescendant={activeDescendantId}
      value={currentInputValue}
      {placeholder}
      {disabled}
      oninput={handleInput}
      onkeydown={handleKeyDown}
      onfocus={handleFocus}
      oncompositionstart={handleCompositionStart}
      oncompositionend={handleCompositionEnd}
      {...restProps}
    />
    <span class="apg-combobox-caret" aria-hidden="true">
      <svg viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  </div>
  <!-- svelte-ignore a11y_no_noninteractive_element_to_interactive_role -->
  <ul
    id={listboxId}
    role="listbox"
    aria-labelledby={labelId}
    class="apg-combobox-listbox"
    hidden={!isOpen ? true : undefined}
  >
    {#if filteredOptions.length === 0}
      <li class="apg-combobox-no-results" role="status">
        {noResultsMessage}
      </li>
    {/if}
    {#each filteredOptions as option, index}
      {@const isActive = index === activeIndex}
      {@const isSelected = option.id === currentSelectedId}
      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
      <li
        id={getOptionId(option.id)}
        role="option"
        class="apg-combobox-option"
        aria-selected={isActive}
        aria-disabled={option.disabled || undefined}
        data-selected={isSelected || undefined}
        onclick={() => handleOptionClick(option)}
        onmouseenter={() => handleOptionHover(option)}
      >
        <span class="apg-combobox-option-icon" aria-hidden="true">
          <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path
              d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
            />
          </svg>
        </span>
        {option.label}
      </li>
    {/each}
  </ul>
</div>
