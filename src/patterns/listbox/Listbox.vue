<template>
  <ul
    ref="listboxRef"
    role="listbox"
    :aria-multiselectable="multiselectable || undefined"
    :aria-orientation="orientation"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
    :tabindex="listboxTabIndex"
    :class="containerClass"
    @keydown="handleKeyDown"
  >
    <li
      v-for="option in options"
      :key="option.id"
      :ref="(el) => setOptionRef(option.id, el)"
      role="option"
      :id="getOptionId(option.id)"
      :aria-selected="selectedIds.has(option.id)"
      :aria-disabled="option.disabled || undefined"
      :tabindex="getTabIndex(option)"
      :class="getOptionClass(option)"
      @click="!option.disabled && handleOptionClick(option.id)"
    >
      <span class="apg-listbox-option-icon" aria-hidden="true">
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
            fill="currentColor"
          />
        </svg>
      </span>
      {{ option.label }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';

export interface ListboxOption {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface ListboxProps {
  options: ListboxOption[];
  multiselectable?: boolean;
  orientation?: 'vertical' | 'horizontal';
  defaultSelectedIds?: string[];
  ariaLabel?: string;
  ariaLabelledby?: string;
  typeAheadTimeout?: number;
}

const props = withDefaults(defineProps<ListboxProps>(), {
  multiselectable: false,
  orientation: 'vertical',
  defaultSelectedIds: () => [],
  typeAheadTimeout: 500,
});

const emit = defineEmits<{
  selectionChange: [selectedIds: string[]];
}>();

const listboxRef = ref<HTMLElement>();
const optionRefs = ref<Record<string, HTMLLIElement>>({});
const instanceId = ref('');
const selectedIds = ref<Set<string>>(new Set());
const focusedIndex = ref(0);
const selectionAnchor = ref(0);
const typeAheadBuffer = ref('');
const typeAheadTimeoutId = ref<number | null>(null);

const availableOptions = computed(() => props.options.filter((opt) => !opt.disabled));

// Map of option id to index in availableOptions for O(1) lookup
const availableIndexMap = computed(() => {
  const map = new Map<string, number>();
  availableOptions.value.forEach(({ id }, index) => map.set(id, index));
  return map;
});

onMounted(() => {
  instanceId.value = `listbox-${Math.random().toString(36).slice(2, 11)}`;

  // Initialize selection
  if (props.defaultSelectedIds.length > 0) {
    selectedIds.value = new Set(props.defaultSelectedIds);
  } else if (!props.multiselectable && availableOptions.value.length > 0) {
    selectedIds.value = new Set([availableOptions.value[0].id]);
  }

  // Initialize focused index and sync anchor
  const firstSelectedId = [...selectedIds.value][0];
  if (firstSelectedId) {
    const index = availableOptions.value.findIndex((opt) => opt.id === firstSelectedId);
    if (index >= 0) {
      focusedIndex.value = index;
      selectionAnchor.value = index;
    }
  }
});

const setOptionRef = (id: string, el: unknown) => {
  if (el instanceof HTMLLIElement) {
    optionRefs.value[id] = el;
  } else if (el === null) {
    // Clean up ref when element is unmounted
    delete optionRefs.value[id];
  }
};

// If no available options, listbox itself needs tabIndex for keyboard access
const listboxTabIndex = computed(() => (availableOptions.value.length === 0 ? 0 : undefined));

const getOptionId = (optionId: string) => `${instanceId.value}-option-${optionId}`;

const containerClass = computed(() => {
  const classes = ['apg-listbox'];
  if (props.orientation === 'horizontal') {
    classes.push('apg-listbox--horizontal');
  }
  return classes.join(' ');
});

const getOptionClass = (option: ListboxOption) => {
  const classes = ['apg-listbox-option'];
  if (selectedIds.value.has(option.id)) {
    classes.push('apg-listbox-option--selected');
  }
  if (option.disabled) {
    classes.push('apg-listbox-option--disabled');
  }
  return classes.join(' ');
};

const getTabIndex = (option: ListboxOption): number => {
  if (option.disabled) return -1;
  const availableIndex = availableIndexMap.value.get(option.id) ?? -1;
  return availableIndex === focusedIndex.value ? 0 : -1;
};

const updateSelection = (newSelectedIds: Set<string>) => {
  selectedIds.value = newSelectedIds;
  emit('selectionChange', [...newSelectedIds]);
};

const focusOption = async (index: number) => {
  const option = availableOptions.value[index];
  if (option) {
    focusedIndex.value = index;
    await nextTick();
    optionRefs.value[option.id]?.focus();
  }
};

const selectOption = (optionId: string) => {
  if (props.multiselectable) {
    const newSelected = new Set(selectedIds.value);
    if (newSelected.has(optionId)) {
      newSelected.delete(optionId);
    } else {
      newSelected.add(optionId);
    }
    updateSelection(newSelected);
  } else {
    updateSelection(new Set([optionId]));
  }
};

const selectRange = (fromIndex: number, toIndex: number) => {
  const start = Math.min(fromIndex, toIndex);
  const end = Math.max(fromIndex, toIndex);
  const newSelected = new Set(selectedIds.value);

  for (let i = start; i <= end; i++) {
    const option = availableOptions.value[i];
    if (option) {
      newSelected.add(option.id);
    }
  }

  updateSelection(newSelected);
};

const selectAll = () => {
  const allIds = new Set(availableOptions.value.map((opt) => opt.id));
  updateSelection(allIds);
};

const handleTypeAhead = (char: string) => {
  // Guard: no options to search
  if (availableOptions.value.length === 0) return;

  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
  }

  typeAheadBuffer.value += char.toLowerCase();

  const buffer = typeAheadBuffer.value;
  const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

  let startIndex = focusedIndex.value;

  if (isSameChar) {
    typeAheadBuffer.value = buffer[0];
    startIndex = (focusedIndex.value + 1) % availableOptions.value.length;
  }

  for (let i = 0; i < availableOptions.value.length; i++) {
    const index = (startIndex + i) % availableOptions.value.length;
    const option = availableOptions.value[index];
    const searchStr = isSameChar ? buffer[0] : typeAheadBuffer.value;
    if (option.label.toLowerCase().startsWith(searchStr)) {
      focusOption(index);
      // Update anchor for shift-selection
      selectionAnchor.value = index;
      if (!props.multiselectable) {
        updateSelection(new Set([option.id]));
      }
      break;
    }
  }

  typeAheadTimeoutId.value = window.setTimeout(() => {
    typeAheadBuffer.value = '';
    typeAheadTimeoutId.value = null;
  }, props.typeAheadTimeout);
};

const handleOptionClick = (optionId: string) => {
  const index = availableIndexMap.value.get(optionId) ?? -1;
  focusOption(index);
  selectOption(optionId);
  selectionAnchor.value = index;
};

const handleKeyDown = async (event: KeyboardEvent) => {
  // Guard: no options to navigate
  if (availableOptions.value.length === 0) return;

  const { key, shiftKey, ctrlKey, metaKey } = event;

  const nextKey = props.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
  const prevKey = props.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';

  if (props.orientation === 'vertical' && (key === 'ArrowLeft' || key === 'ArrowRight')) {
    return;
  }
  if (props.orientation === 'horizontal' && (key === 'ArrowUp' || key === 'ArrowDown')) {
    return;
  }

  let newIndex = focusedIndex.value;
  let shouldPreventDefault = false;

  switch (key) {
    case nextKey:
      if (focusedIndex.value < availableOptions.value.length - 1) {
        newIndex = focusedIndex.value + 1;
      }
      shouldPreventDefault = true;

      if (props.multiselectable && shiftKey) {
        await focusOption(newIndex);
        selectRange(selectionAnchor.value, newIndex);
        event.preventDefault();
        return;
      }
      break;

    case prevKey:
      if (focusedIndex.value > 0) {
        newIndex = focusedIndex.value - 1;
      }
      shouldPreventDefault = true;

      if (props.multiselectable && shiftKey) {
        await focusOption(newIndex);
        selectRange(selectionAnchor.value, newIndex);
        event.preventDefault();
        return;
      }
      break;

    case 'Home':
      newIndex = 0;
      shouldPreventDefault = true;

      if (props.multiselectable && shiftKey) {
        await focusOption(newIndex);
        selectRange(selectionAnchor.value, newIndex);
        event.preventDefault();
        return;
      }
      break;

    case 'End':
      newIndex = availableOptions.value.length - 1;
      shouldPreventDefault = true;

      if (props.multiselectable && shiftKey) {
        await focusOption(newIndex);
        selectRange(selectionAnchor.value, newIndex);
        event.preventDefault();
        return;
      }
      break;

    case ' ':
      shouldPreventDefault = true;
      if (props.multiselectable) {
        const focusedOption = availableOptions.value[focusedIndex.value];
        if (focusedOption) {
          selectOption(focusedOption.id);
          selectionAnchor.value = focusedIndex.value;
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
      if ((ctrlKey || metaKey) && props.multiselectable) {
        shouldPreventDefault = true;
        selectAll();
        event.preventDefault();
        return;
      }
      break;
  }

  if (shouldPreventDefault) {
    event.preventDefault();

    if (newIndex !== focusedIndex.value) {
      await focusOption(newIndex);

      if (!props.multiselectable) {
        const newOption = availableOptions.value[newIndex];
        if (newOption) {
          updateSelection(new Set([newOption.id]));
        }
      } else {
        selectionAnchor.value = newIndex;
      }
    }
    return;
  }

  if (key.length === 1 && !ctrlKey && !metaKey) {
    event.preventDefault();
    handleTypeAhead(key);
  }
};
</script>
