<template>
  <div ref="containerRef" :class="cn('apg-combobox', className)">
    <label :id="labelId" :for="inputId" class="apg-combobox-label">
      {{ label }}
    </label>
    <div class="apg-combobox-input-wrapper">
      <input
        ref="inputRef"
        :id="inputId"
        type="text"
        role="combobox"
        class="apg-combobox-input"
        :aria-autocomplete="autocomplete"
        :aria-expanded="isOpen"
        :aria-controls="listboxId"
        :aria-labelledby="labelId"
        :aria-activedescendant="activeDescendantId || undefined"
        :value="currentInputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        v-bind="$attrs"
        @input="handleInput"
        @keydown="handleKeyDown"
        @focus="handleFocus"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
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
    <ul
      :id="listboxId"
      role="listbox"
      :aria-labelledby="labelId"
      class="apg-combobox-listbox"
      :hidden="!isOpen || undefined"
    >
      <li v-if="filteredOptions.length === 0" class="apg-combobox-no-results" role="status">
        {{ noResultsMessage }}
      </li>
      <li
        v-for="(option, index) in filteredOptions"
        :key="option.id"
        :id="getOptionId(option.id)"
        role="option"
        class="apg-combobox-option"
        :aria-selected="index === activeIndex"
        :aria-disabled="option.disabled || undefined"
        :data-selected="option.id === currentSelectedId || undefined"
        @click="handleOptionClick(option)"
        @mouseenter="handleOptionHover(option)"
      >
        <span class="apg-combobox-option-icon" aria-hidden="true">
          <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            <path
              d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
            />
          </svg>
        </span>
        {{ option.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { cn } from '@/lib/utils';
import { computed, onUnmounted, ref, useId, watch } from 'vue';

export interface ComboboxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
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
  className?: string;
}

const props = withDefaults(defineProps<ComboboxProps>(), {
  defaultInputValue: '',
  disabled: false,
  autocomplete: 'list',
  noResultsMessage: 'No results found',
  className: '',
});

const emit = defineEmits<{
  select: [option: ComboboxOption];
  inputChange: [value: string];
  openChange: [isOpen: boolean];
}>();

defineOptions({
  inheritAttrs: false,
});

// Refs
const containerRef = ref<HTMLDivElement>();
const inputRef = ref<HTMLInputElement>();
const instanceId = useId();

// State
const isOpen = ref(false);
const activeIndex = ref(-1);
const isComposing = ref(false);
const valueBeforeOpen = ref('');
const isSearching = ref(false);

// Internal state for uncontrolled mode
const internalInputValue = ref(() => {
  if (props.defaultSelectedOptionId) {
    const option = props.options.find(({ id }) => id === props.defaultSelectedOptionId);
    return option?.label ?? props.defaultInputValue;
  }
  return props.defaultInputValue;
});
const internalSelectedId = ref<string | undefined>(props.defaultSelectedOptionId);

// Computed
const inputId = computed(() => `${instanceId}-input`);
const labelId = computed(() => `${instanceId}-label`);
const listboxId = computed(() => `${instanceId}-listbox`);

const currentInputValue = computed(() => {
  if (props.inputValue !== undefined) {
    return props.inputValue;
  }
  // Handle both function ref (from initialization) and string value
  const value = internalInputValue.value;
  return typeof value === 'function' ? value() : value;
});

const currentSelectedId = computed(() => props.selectedOptionId ?? internalSelectedId.value);

// Get selected option's label
const selectedLabel = computed(() => {
  if (!currentSelectedId.value) {
    return '';
  }
  const option = props.options.find(({ id }) => id === currentSelectedId.value);
  return option?.label ?? '';
});

const filteredOptions = computed(() => {
  const { autocomplete, options } = props;
  const inputValue = currentInputValue.value;

  // Don't filter if autocomplete is none
  if (autocomplete === 'none') {
    return options;
  }

  // Don't filter if input is empty
  if (!inputValue) {
    return options;
  }

  // Don't filter if not in search mode AND input matches selected label
  if (!isSearching.value && inputValue === selectedLabel.value) {
    return options;
  }

  const lowerInputValue = inputValue.toLowerCase();

  return options.filter(({ label }) => label.toLowerCase().includes(lowerInputValue));
});

const enabledOptions = computed(() => filteredOptions.value.filter(({ disabled }) => !disabled));

const activeDescendantId = computed(() => {
  if (activeIndex.value < 0 || activeIndex.value >= filteredOptions.value.length) {
    return undefined;
  }
  const option = filteredOptions.value[activeIndex.value];
  return option ? getOptionId(option.id) : undefined;
});

// Helper functions
const getOptionId = (optionId: string) => `${instanceId}-option-${optionId}`;

const updateInputValue = (value: string) => {
  if (props.inputValue === undefined) {
    internalInputValue.value = value;
  }
  emit('inputChange', value);
};

const openPopup = (focusPosition?: 'first' | 'last') => {
  if (isOpen.value) {
    return;
  }

  valueBeforeOpen.value = currentInputValue.value;
  isOpen.value = true;
  emit('openChange', true);

  if (!focusPosition || enabledOptions.value.length === 0) {
    return;
  }

  const targetOption =
    focusPosition === 'first'
      ? enabledOptions.value[0]
      : enabledOptions.value[enabledOptions.value.length - 1];
  const { id: targetId } = targetOption;
  const targetIndex = filteredOptions.value.findIndex(({ id }) => id === targetId);
  activeIndex.value = targetIndex;
};

const closePopup = (restore = false) => {
  isOpen.value = false;
  activeIndex.value = -1;
  isSearching.value = false;
  emit('openChange', false);

  if (restore) {
    updateInputValue(valueBeforeOpen.value);
  }
};

const selectOption = ({ id, label, disabled }: ComboboxOption) => {
  if (disabled) {
    return;
  }

  if (props.selectedOptionId === undefined) {
    internalSelectedId.value = id;
  }

  isSearching.value = false;
  updateInputValue(label);
  emit('select', { id, label, disabled });
  closePopup();
};

const findEnabledIndex = (
  startIndex: number,
  direction: 'next' | 'prev' | 'first' | 'last'
): number => {
  if (enabledOptions.value.length === 0) {
    return -1;
  }

  if (direction === 'first') {
    const { id: firstId } = enabledOptions.value[0];
    return filteredOptions.value.findIndex(({ id }) => id === firstId);
  }

  if (direction === 'last') {
    const { id: lastId } = enabledOptions.value[enabledOptions.value.length - 1];
    return filteredOptions.value.findIndex(({ id }) => id === lastId);
  }

  const currentOption = filteredOptions.value[startIndex];
  const currentEnabledIndex = currentOption
    ? enabledOptions.value.findIndex(({ id }) => id === currentOption.id)
    : -1;

  if (direction === 'next') {
    if (currentEnabledIndex < 0) {
      const { id: firstId } = enabledOptions.value[0];
      return filteredOptions.value.findIndex(({ id }) => id === firstId);
    }

    if (currentEnabledIndex >= enabledOptions.value.length - 1) {
      return startIndex;
    }

    const { id: nextId } = enabledOptions.value[currentEnabledIndex + 1];
    return filteredOptions.value.findIndex(({ id }) => id === nextId);
  }

  // direction === 'prev'
  if (currentEnabledIndex < 0) {
    const { id: lastId } = enabledOptions.value[enabledOptions.value.length - 1];
    return filteredOptions.value.findIndex(({ id }) => id === lastId);
  }

  if (currentEnabledIndex <= 0) {
    return startIndex;
  }

  const { id: prevId } = enabledOptions.value[currentEnabledIndex - 1];
  return filteredOptions.value.findIndex(({ id }) => id === prevId);
};

// Event handlers
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const value = target.value;
  isSearching.value = true;
  updateInputValue(value);

  if (!isOpen.value && !isComposing.value) {
    valueBeforeOpen.value = currentInputValue.value;
    isOpen.value = true;
    emit('openChange', true);
  }

  activeIndex.value = -1;
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (isComposing.value) {
    return;
  }

  const { key, altKey } = event;

  switch (key) {
    case 'ArrowDown': {
      event.preventDefault();

      if (altKey) {
        if (isOpen.value) {
          return;
        }

        valueBeforeOpen.value = currentInputValue.value;
        isOpen.value = true;
        emit('openChange', true);
        return;
      }

      if (!isOpen.value) {
        openPopup('first');
        return;
      }

      const nextIndex = findEnabledIndex(activeIndex.value, 'next');

      if (nextIndex >= 0) {
        activeIndex.value = nextIndex;
      }
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();

      if (altKey) {
        if (!isOpen.value || activeIndex.value < 0) {
          return;
        }

        const option = filteredOptions.value[activeIndex.value];

        if (option === undefined || option.disabled) {
          return;
        }

        selectOption(option);
        return;
      }

      if (!isOpen.value) {
        openPopup('last');
        return;
      }

      const prevIndex = findEnabledIndex(activeIndex.value, 'prev');

      if (prevIndex >= 0) {
        activeIndex.value = prevIndex;
      }
      break;
    }
    case 'Home': {
      if (!isOpen.value) {
        return;
      }

      event.preventDefault();

      const firstIndex = findEnabledIndex(0, 'first');

      if (firstIndex >= 0) {
        activeIndex.value = firstIndex;
      }
      break;
    }
    case 'End': {
      if (!isOpen.value) {
        return;
      }

      event.preventDefault();

      const lastIndex = findEnabledIndex(0, 'last');

      if (lastIndex >= 0) {
        activeIndex.value = lastIndex;
      }
      break;
    }
    case 'Enter': {
      if (!isOpen.value || activeIndex.value < 0) {
        return;
      }

      event.preventDefault();

      const option = filteredOptions.value[activeIndex.value];

      if (option === undefined || option.disabled) {
        return;
      }

      selectOption(option);
      break;
    }
    case 'Escape': {
      if (!isOpen.value) {
        return;
      }

      event.preventDefault();
      closePopup(true);
      break;
    }
    case 'Tab': {
      if (isOpen.value) {
        closePopup();
      }
      break;
    }
  }
};

const handleOptionClick = (option: ComboboxOption) => {
  if (option.disabled) {
    return;
  }

  selectOption(option);
};

const handleOptionHover = ({ id }: ComboboxOption) => {
  const index = filteredOptions.value.findIndex((option) => option.id === id);

  if (index < 0) {
    return;
  }

  activeIndex.value = index;
};

const handleCompositionStart = () => {
  isComposing.value = true;
};

const handleCompositionEnd = () => {
  isComposing.value = false;
};

// Handle focus - open popup when input receives focus
const handleFocus = () => {
  if (isOpen.value || props.disabled) {
    return;
  }

  openPopup();
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const { value: container } = containerRef;

  if (container === undefined) {
    return;
  }

  if (!container.contains(event.target as Node)) {
    closePopup();
  }
};

watch(
  () => isOpen.value,
  (newIsOpen) => {
    if (newIsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }
);

// Clear active index when filtered options change
watch(
  () => filteredOptions.value.length,
  (newLength) => {
    if (activeIndex.value >= 0 && activeIndex.value >= newLength) {
      activeIndex.value = -1;
    }
  }
);

// Reset search mode when input value matches selected label or becomes empty
watch(
  () => currentInputValue.value,
  (newValue) => {
    if (newValue === '' || newValue === selectedLabel.value) {
      isSearching.value = false;
    }
  }
);

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
