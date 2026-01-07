<template>
  <div ref="containerRef" :class="`apg-menu-button ${className}`.trim()">
    <button
      ref="buttonRef"
      :id="buttonId"
      type="button"
      class="apg-menu-button-trigger"
      aria-haspopup="menu"
      :aria-expanded="isOpen"
      :aria-controls="menuId"
      v-bind="$attrs"
      @click="toggleMenu"
      @keydown="handleButtonKeyDown"
    >
      {{ label }}
    </button>
    <ul
      :id="menuId"
      role="menu"
      :aria-labelledby="buttonId"
      class="apg-menu-button-menu"
      :hidden="!isOpen || undefined"
      :inert="!isOpen || undefined"
    >
      <li
        v-for="item in items"
        :key="item.id"
        :ref="(el) => setItemRef(item.id, el)"
        role="menuitem"
        :tabindex="getTabIndex(item)"
        :aria-disabled="item.disabled || undefined"
        class="apg-menu-button-item"
        @click="handleItemClick(item)"
        @keydown="(e) => handleMenuKeyDown(e, item)"
        @focus="handleItemFocus(item)"
      >
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted, nextTick, watch, useId } from 'vue';

export interface MenuItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface MenuButtonProps {
  items: MenuItem[];
  label: string;
  defaultOpen?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<MenuButtonProps>(), {
  defaultOpen: false,
  className: '',
});

const emit = defineEmits<{
  itemSelect: [itemId: string];
}>();

defineOptions({
  inheritAttrs: false,
});

// Refs
const containerRef = ref<HTMLDivElement>();
const buttonRef = ref<HTMLButtonElement>();
const menuItemRefs = ref<Record<string, HTMLLIElement>>({});
// Use Vue 3.5+ useId for SSR-safe unique IDs
const instanceId = useId();
const isOpen = ref(props.defaultOpen);
const focusedIndex = ref(-1);
const typeAheadBuffer = ref('');
const typeAheadTimeoutId = ref<number | null>(null);
const typeAheadTimeout = 500;

// Computed
const buttonId = computed(() => `${instanceId}-button`);
const menuId = computed(() => `${instanceId}-menu`);
const availableItems = computed(() => props.items.filter((item) => !item.disabled));

// Map of item id to index in availableItems for O(1) lookup
const availableIndexMap = computed(() => {
  const map = new Map<string, number>();
  availableItems.value.forEach(({ id }, index) => map.set(id, index));
  return map;
});

onUnmounted(() => {
  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
  }
});

// Watch focusedIndex to focus the correct item (also react to availableItems changes)
watch([() => isOpen.value, () => focusedIndex.value, availableItems], async () => {
  if (!isOpen.value || focusedIndex.value < 0) return;

  const targetItem = availableItems.value[focusedIndex.value];
  if (targetItem) {
    await nextTick();
    menuItemRefs.value[targetItem.id]?.focus();
  }
});

// Helper functions
const setItemRef = (id: string, el: unknown) => {
  if (el instanceof HTMLLIElement) {
    menuItemRefs.value[id] = el;
  } else if (el === null) {
    delete menuItemRefs.value[id];
  }
};

const getTabIndex = (item: MenuItem): number => {
  if (item.disabled) return -1;
  const availableIndex = availableIndexMap.value.get(item.id) ?? -1;
  return availableIndex === focusedIndex.value ? 0 : -1;
};

// Menu control
const closeMenu = () => {
  isOpen.value = false;
  focusedIndex.value = -1;
  // Clear type-ahead state
  typeAheadBuffer.value = '';
  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
    typeAheadTimeoutId.value = null;
  }
};

const openMenu = (focusPosition: 'first' | 'last') => {
  if (availableItems.value.length === 0) {
    isOpen.value = true;
    return;
  }

  isOpen.value = true;
  const targetIndex = focusPosition === 'first' ? 0 : availableItems.value.length - 1;
  focusedIndex.value = targetIndex;
};

const toggleMenu = () => {
  if (isOpen.value) {
    closeMenu();
  } else {
    openMenu('first');
  }
};

// Event handlers
const handleItemClick = async (item: MenuItem) => {
  if (item.disabled) return;
  emit('itemSelect', item.id);
  closeMenu();
  await nextTick();
  buttonRef.value?.focus();
};

const handleItemFocus = (item: MenuItem) => {
  if (item.disabled) return;
  const availableIndex = availableIndexMap.value.get(item.id) ?? -1;
  if (availableIndex >= 0) {
    focusedIndex.value = availableIndex;
  }
};

const handleButtonKeyDown = (event: KeyboardEvent) => {
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
};

const handleTypeAhead = (char: string) => {
  const { value: items } = availableItems;
  if (items.length === 0) return;

  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
  }

  typeAheadBuffer.value += char.toLowerCase();

  const buffer = typeAheadBuffer.value;
  const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);
  const currentFocusedIndex = focusedIndex.value;
  const itemsLength = items.length;

  let startIndex: number;
  let searchStr: string;

  if (isSameChar) {
    typeAheadBuffer.value = buffer[0];
    searchStr = buffer[0];
    startIndex = currentFocusedIndex >= 0 ? (currentFocusedIndex + 1) % itemsLength : 0;
  } else if (buffer.length === 1) {
    searchStr = buffer;
    startIndex = currentFocusedIndex >= 0 ? (currentFocusedIndex + 1) % itemsLength : 0;
  } else {
    searchStr = buffer;
    startIndex = currentFocusedIndex >= 0 ? currentFocusedIndex : 0;
  }

  for (let i = 0; i < itemsLength; i++) {
    const index = (startIndex + i) % itemsLength;
    const option = items[index];
    if (option.label.toLowerCase().startsWith(searchStr)) {
      focusedIndex.value = index;
      break;
    }
  }

  typeAheadTimeoutId.value = window.setTimeout(() => {
    typeAheadBuffer.value = '';
    typeAheadTimeoutId.value = null;
  }, typeAheadTimeout);
};

const handleMenuKeyDown = async (event: KeyboardEvent, item: MenuItem) => {
  const { value: items } = availableItems;
  const itemsLength = items.length;

  // Guard: no available items
  if (itemsLength === 0) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      await nextTick();
      buttonRef.value?.focus();
    }
    return;
  }

  const currentIndex = availableIndexMap.value.get(item.id) ?? -1;

  // Guard: disabled item received focus
  if (currentIndex < 0) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeMenu();
      await nextTick();
      buttonRef.value?.focus();
    }
    return;
  }

  switch (event.key) {
    case 'ArrowDown': {
      event.preventDefault();
      const nextIndex = (currentIndex + 1) % itemsLength;
      focusedIndex.value = nextIndex;
      break;
    }
    case 'ArrowUp': {
      event.preventDefault();
      const prevIndex = currentIndex === 0 ? itemsLength - 1 : currentIndex - 1;
      focusedIndex.value = prevIndex;
      break;
    }
    case 'Home': {
      event.preventDefault();
      focusedIndex.value = 0;
      break;
    }
    case 'End': {
      event.preventDefault();
      focusedIndex.value = itemsLength - 1;
      break;
    }
    case 'Escape': {
      event.preventDefault();
      closeMenu();
      await nextTick();
      buttonRef.value?.focus();
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
        emit('itemSelect', item.id);
        closeMenu();
        await nextTick();
        buttonRef.value?.focus();
      }
      break;
    }
    default: {
      // Type-ahead: single printable character
      const { key, ctrlKey, metaKey, altKey } = event;
      if (key.length === 1 && !ctrlKey && !metaKey && !altKey) {
        event.preventDefault();
        handleTypeAhead(key);
      }
    }
  }
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  const { value: container } = containerRef;
  if (container && !container.contains(event.target as Node)) {
    closeMenu();
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

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>
