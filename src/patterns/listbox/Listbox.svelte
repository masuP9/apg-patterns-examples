<script lang="ts">
  import { onMount } from 'svelte';

  export interface ListboxOption {
    id: string;
    label: string;
    disabled?: boolean;
  }

  interface ListboxProps {
    options: ListboxOption[];
    multiselectable?: boolean;
    orientation?: 'vertical' | 'horizontal';
    defaultSelectedIds?: string[];
    ariaLabel?: string;
    ariaLabelledby?: string;
    typeAheadTimeout?: number;
    onSelectionChange?: (selectedIds: string[]) => void;
    class?: string;
  }

  let {
    options = [],
    multiselectable = false,
    orientation = 'vertical',
    defaultSelectedIds = [],
    ariaLabel = undefined,
    ariaLabelledby = undefined,
    typeAheadTimeout = 500,
    onSelectionChange = () => {},
    class: className = '',
  }: ListboxProps = $props();

  let selectedIds = $state<Set<string>>(new Set());
  let focusedIndex = $state(0);
  let selectionAnchor = $state(0);
  let listboxElement: HTMLElement;
  let optionRefs = new Map<string, HTMLLIElement>();
  let instanceId = $state('');
  let typeAheadBuffer = $state('');
  let typeAheadTimeoutId: number | null = null;

  onMount(() => {
    instanceId = `listbox-${Math.random().toString(36).slice(2, 11)}`;
  });

  // Action to track option element references
  function trackOptionRef(node: HTMLLIElement, optionId: string) {
    optionRefs.set(optionId, node);
    return {
      destroy() {
        optionRefs.delete(optionId);
      },
    };
  }

  // Initialize selection
  $effect(() => {
    if (options.length > 0 && selectedIds.size === 0) {
      if (defaultSelectedIds.length > 0) {
        selectedIds = new Set(defaultSelectedIds);
      } else if (!multiselectable && availableOptions.length > 0) {
        selectedIds = new Set([availableOptions[0].id]);
      }

      // Initialize focused index and sync anchor
      const firstSelectedId = [...selectedIds][0];
      if (firstSelectedId) {
        const index = availableOptions.findIndex((opt) => opt.id === firstSelectedId);
        if (index >= 0) {
          focusedIndex = index;
          selectionAnchor = index;
        }
      }
    }
  });

  // Derived values
  let availableOptions = $derived(options.filter((opt) => !opt.disabled));

  // If no available options, listbox itself needs tabIndex for keyboard access
  let listboxTabIndex = $derived(availableOptions.length === 0 ? 0 : undefined);

  let containerClass = $derived(
    `apg-listbox ${orientation === 'horizontal' ? 'apg-listbox--horizontal' : ''} ${className}`.trim()
  );

  function getOptionClass(option: ListboxOption): string {
    const classes = ['apg-listbox-option'];
    if (selectedIds.has(option.id)) {
      classes.push('apg-listbox-option--selected');
    }
    if (option.disabled) {
      classes.push('apg-listbox-option--disabled');
    }
    return classes.join(' ');
  }

  function getTabIndex(option: ListboxOption): number {
    if (option.disabled) return -1;
    const availableIndex = availableOptions.findIndex((opt) => opt.id === option.id);
    return availableIndex === focusedIndex ? 0 : -1;
  }

  function updateSelection(newSelectedIds: Set<string>) {
    selectedIds = newSelectedIds;
    onSelectionChange([...newSelectedIds]);
  }

  function focusOption(index: number) {
    const option = availableOptions[index];
    if (option) {
      focusedIndex = index;
      optionRefs.get(option.id)?.focus();
    }
  }

  function selectOption(optionId: string) {
    if (multiselectable) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(optionId)) {
        newSelected.delete(optionId);
      } else {
        newSelected.add(optionId);
      }
      updateSelection(newSelected);
    } else {
      updateSelection(new Set([optionId]));
    }
  }

  function selectRange(fromIndex: number, toIndex: number) {
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
  }

  function selectAll() {
    const allIds = new Set(availableOptions.map((opt) => opt.id));
    updateSelection(allIds);
  }

  function handleTypeAhead(char: string) {
    // Guard: no options to search
    if (availableOptions.length === 0) return;

    if (typeAheadTimeoutId !== null) {
      clearTimeout(typeAheadTimeoutId);
    }

    typeAheadBuffer += char.toLowerCase();

    const buffer = typeAheadBuffer;
    const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

    let startIndex = focusedIndex;

    if (isSameChar) {
      typeAheadBuffer = buffer[0];
      startIndex = (focusedIndex + 1) % availableOptions.length;
    }

    for (let i = 0; i < availableOptions.length; i++) {
      const index = (startIndex + i) % availableOptions.length;
      const option = availableOptions[index];
      const searchStr = isSameChar ? buffer[0] : typeAheadBuffer;
      if (option.label.toLowerCase().startsWith(searchStr)) {
        focusOption(index);
        // Update anchor for shift-selection
        selectionAnchor = index;
        if (!multiselectable) {
          updateSelection(new Set([option.id]));
        }
        break;
      }
    }

    typeAheadTimeoutId = window.setTimeout(() => {
      typeAheadBuffer = '';
      typeAheadTimeoutId = null;
    }, typeAheadTimeout);
  }

  function handleOptionClick(optionId: string) {
    const index = availableOptions.findIndex((opt) => opt.id === optionId);
    focusOption(index);
    selectOption(optionId);
    selectionAnchor = index;
  }

  function handleKeyDown(event: KeyboardEvent) {
    // Guard: no options to navigate
    if (availableOptions.length === 0) return;

    const { key, shiftKey, ctrlKey, metaKey } = event;

    const nextKey = orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const prevKey = orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

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
          focusOption(newIndex);
          selectRange(selectionAnchor, newIndex);
          event.preventDefault();
          return;
        }
        break;

      case prevKey:
        if (focusedIndex > 0) {
          newIndex = focusedIndex - 1;
        }
        shouldPreventDefault = true;

        if (multiselectable && shiftKey) {
          focusOption(newIndex);
          selectRange(selectionAnchor, newIndex);
          event.preventDefault();
          return;
        }
        break;

      case 'Home':
        newIndex = 0;
        shouldPreventDefault = true;

        if (multiselectable && shiftKey) {
          focusOption(newIndex);
          selectRange(selectionAnchor, newIndex);
          event.preventDefault();
          return;
        }
        break;

      case 'End':
        newIndex = availableOptions.length - 1;
        shouldPreventDefault = true;

        if (multiselectable && shiftKey) {
          focusOption(newIndex);
          selectRange(selectionAnchor, newIndex);
          event.preventDefault();
          return;
        }
        break;

      case ' ':
        shouldPreventDefault = true;
        if (multiselectable) {
          const focusedOption = availableOptions[focusedIndex];
          if (focusedOption) {
            selectOption(focusedOption.id);
            selectionAnchor = focusedIndex;
          }
        }
        event.preventDefault();
        return;

      case 'Enter':
        shouldPreventDefault = true;
        event.preventDefault();
        return;

      case 'a':
      case 'A':
        if ((ctrlKey || metaKey) && multiselectable) {
          shouldPreventDefault = true;
          selectAll();
          event.preventDefault();
          return;
        }
        break;
    }

    if (shouldPreventDefault) {
      event.preventDefault();

      if (newIndex !== focusedIndex) {
        focusOption(newIndex);

        if (!multiselectable) {
          const newOption = availableOptions[newIndex];
          if (newOption) {
            updateSelection(new Set([newOption.id]));
          }
        } else {
          selectionAnchor = newIndex;
        }
      }
      return;
    }

    if (key.length === 1 && !ctrlKey && !metaKey) {
      event.preventDefault();
      handleTypeAhead(key);
    }
  }
</script>

<ul
  bind:this={listboxElement}
  role="listbox"
  aria-multiselectable={multiselectable || undefined}
  aria-orientation={orientation}
  aria-label={ariaLabel}
  aria-labelledby={ariaLabelledby}
  tabindex={listboxTabIndex}
  class={containerClass}
  onkeydown={handleKeyDown}
>
  {#each options as option}
    {@const isSelected = selectedIds.has(option.id)}

    <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
    <li
      use:trackOptionRef={option.id}
      role="option"
      id="{instanceId}-option-{option.id}"
      aria-selected={isSelected}
      aria-disabled={option.disabled || undefined}
      tabindex={getTabIndex(option)}
      class={getOptionClass(option)}
      onclick={() => !option.disabled && handleOptionClick(option.id)}
    >
      <span class="apg-listbox-option-icon" aria-hidden="true">
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
            fill="currentColor"
          />
        </svg>
      </span>
      {option.label}
    </li>
  {/each}
</ul>
