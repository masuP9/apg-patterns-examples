<template>
  <ul
    ref="containerRef"
    role="menubar"
    :class="`apg-menubar ${className}`.trim()"
    :aria-label="ariaLabel"
    :aria-labelledby="ariaLabelledby"
  >
    <li v-for="(menubarItem, index) in items" :key="menubarItem.id" role="none">
      <span
        :id="`${instanceId}-menubar-${menubarItem.id}`"
        :ref="(el) => setMenubarItemRef(index, el)"
        role="menuitem"
        aria-haspopup="menu"
        :aria-expanded="state.openMenubarIndex === index"
        :tabindex="index === menubarFocusIndex ? 0 : -1"
        class="apg-menubar-trigger"
        @click="handleMenubarClick(index)"
        @keydown="(e) => handleMenubarKeyDown(e, index)"
        @mouseenter="handleMenubarHover(index)"
      >
        {{ menubarItem.label }}
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
        :id="`${instanceId}-menu-${menubarItem.id}`"
        role="menu"
        :aria-labelledby="`${instanceId}-menubar-${menubarItem.id}`"
        class="apg-menubar-menu"
        :aria-hidden="state.openMenubarIndex !== index"
      >
        <template v-if="state.openMenubarIndex === index">
          <MenuItems
            :items="menubarItem.items"
            :parentId="menubarItem.id"
            :isSubmenu="false"
            :instanceId="instanceId"
            :state="state"
            :checkboxStates="checkboxStates"
            :radioStates="radioStates"
            :menuItemRefs="menuItemRefs"
          />
        </template>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  computed,
  onUnmounted,
  nextTick,
  watch,
  useId,
  h,
  type FunctionalComponent,
} from 'vue';

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

interface MenubarPropsBase {
  items: MenubarItem[];
  className?: string;
}

type MenubarProps = MenubarPropsBase &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-label'?: never; 'aria-labelledby': string }
  );

const props = withDefaults(defineProps<MenubarProps>(), {
  className: '',
});

const emit = defineEmits<{
  itemSelect: [itemId: string];
}>();

defineOptions({
  inheritAttrs: false,
});

// State
interface MenuState {
  openMenubarIndex: number;
  openSubmenuPath: string[];
  focusedItemPath: string[];
}

const instanceId = useId();
const containerRef = ref<HTMLUListElement>();
const menubarItemRefs = ref<Record<number, HTMLSpanElement>>({});
const menuItemRefs = ref<Record<string, HTMLSpanElement>>({});
const menubarFocusIndex = ref(0);
const typeAheadBuffer = ref('');
const typeAheadTimeoutId = ref<number | null>(null);
const typeAheadTimeout = 500;

const state = reactive<MenuState>({
  openMenubarIndex: -1,
  openSubmenuPath: [],
  focusedItemPath: [],
});

// Checkbox and radio states
const checkboxStates = ref<Map<string, boolean>>(new Map());
const radioStates = ref<Map<string, string>>(new Map());

// Initialize checkbox/radio states
const initStates = () => {
  const collectStates = (menuItems: MenuItem[]) => {
    menuItems.forEach((item) => {
      if (item.type === 'checkbox') {
        checkboxStates.value.set(item.id, item.checked ?? false);
      } else if (item.type === 'radiogroup') {
        const checked = item.items.find((r) => r.checked);
        if (checked) {
          radioStates.value.set(item.name, checked.id);
        }
        item.items.forEach((radio) => {
          // Track individual radio items too
        });
      } else if (item.type === 'submenu') {
        collectStates(item.items);
      }
    });
  };
  props.items.forEach((menubarItem) => collectStates(menubarItem.items));
};
initStates();

// Computed
const ariaLabel = computed(() => props['aria-label']);
const ariaLabelledby = computed(() => props['aria-labelledby']);
const isMenuOpen = computed(() => state.openMenubarIndex >= 0);

// Helper to set refs
const setMenubarItemRef = (index: number, el: unknown) => {
  if (el instanceof HTMLSpanElement) {
    menubarItemRefs.value[index] = el;
  } else if (el === null) {
    delete menubarItemRefs.value[index];
  }
};

// Close all menus
const closeAllMenus = () => {
  state.openMenubarIndex = -1;
  state.openSubmenuPath = [];
  state.focusedItemPath = [];
  typeAheadBuffer.value = '';
  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
    typeAheadTimeoutId.value = null;
  }
};

// Get first focusable item from menu items
const getFirstFocusableItem = (menuItems: MenuItem[]): MenuItem | null => {
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
};

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

// Open menubar menu
const openMenubarMenu = (index: number, focusPosition: 'first' | 'last' = 'first') => {
  const menubarItem = props.items[index];
  if (!menubarItem) return;

  const focusableItems = getAllFocusableItems(menubarItem.items);

  let focusedId = '';
  if (focusPosition === 'first') {
    focusedId = focusableItems[0]?.id ?? '';
  } else {
    focusedId = focusableItems[focusableItems.length - 1]?.id ?? '';
  }

  state.openMenubarIndex = index;
  state.openSubmenuPath = [];
  state.focusedItemPath = focusedId ? [focusedId] : [];
  menubarFocusIndex.value = index;
};

// Get focusable items
const getFocusableItems = (menuItems: MenuItem[]): MenuItem[] => {
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
};

// Focus effect for menu items
watch(
  () => state.focusedItemPath,
  async (path) => {
    if (path.length === 0) return;
    const focusedId = path[path.length - 1];
    await nextTick();
    menuItemRefs.value[focusedId]?.focus();
  },
  { deep: true }
);

// Click outside
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    closeAllMenus();
  }
};

watch(isMenuOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('mousedown', handleClickOutside);
  } else {
    document.removeEventListener('mousedown', handleClickOutside);
  }
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
  }
});

// Handle type-ahead
const handleTypeAhead = (char: string, focusableItems: MenuItem[]) => {
  const enabledItems = focusableItems.filter((item) => !('disabled' in item && item.disabled));
  if (enabledItems.length === 0) return;

  if (typeAheadTimeoutId.value !== null) {
    clearTimeout(typeAheadTimeoutId.value);
  }

  typeAheadBuffer.value += char.toLowerCase();
  const buffer = typeAheadBuffer.value;
  const isSameChar = buffer.length > 1 && buffer.split('').every((c) => c === buffer[0]);

  let searchStr: string;
  let startIndex: number;

  const currentId = state.focusedItemPath[state.focusedItemPath.length - 1];
  const currentIndex = enabledItems.findIndex((item) => item.id === currentId);

  if (isSameChar) {
    typeAheadBuffer.value = buffer[0];
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
      state.focusedItemPath = [...state.focusedItemPath.slice(0, -1), item.id];
      break;
    }
  }

  typeAheadTimeoutId.value = window.setTimeout(() => {
    typeAheadBuffer.value = '';
    typeAheadTimeoutId.value = null;
  }, typeAheadTimeout);
};

// Menubar keyboard navigation
const handleMenubarKeyDown = async (event: KeyboardEvent, index: number) => {
  switch (event.key) {
    case 'ArrowRight': {
      event.preventDefault();
      const nextIndex = (index + 1) % props.items.length;
      menubarFocusIndex.value = nextIndex;
      if (isMenuOpen.value) {
        openMenubarMenu(nextIndex, 'first');
      } else {
        await nextTick();
        menubarItemRefs.value[nextIndex]?.focus();
      }
      break;
    }
    case 'ArrowLeft': {
      event.preventDefault();
      const prevIndex = index === 0 ? props.items.length - 1 : index - 1;
      menubarFocusIndex.value = prevIndex;
      if (isMenuOpen.value) {
        openMenubarMenu(prevIndex, 'first');
      } else {
        await nextTick();
        menubarItemRefs.value[prevIndex]?.focus();
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
      menubarFocusIndex.value = 0;
      await nextTick();
      menubarItemRefs.value[0]?.focus();
      break;
    }
    case 'End': {
      event.preventDefault();
      const lastIndex = props.items.length - 1;
      menubarFocusIndex.value = lastIndex;
      await nextTick();
      menubarItemRefs.value[lastIndex]?.focus();
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
};

// Menubar click
const handleMenubarClick = (index: number) => {
  if (state.openMenubarIndex === index) {
    closeAllMenus();
  } else {
    openMenubarMenu(index, 'first');
  }
};

// Menubar hover
const handleMenubarHover = (index: number) => {
  if (isMenuOpen.value && state.openMenubarIndex !== index) {
    openMenubarMenu(index, 'first');
  }
};

// Handle menu item activation
const handleActivate = (item: MenuItem, radioGroupName?: string) => {
  if ('disabled' in item && item.disabled) return;

  if (item.type === 'item') {
    emit('itemSelect', item.id);
    closeAllMenus();
    nextTick(() => {
      menubarItemRefs.value[state.openMenubarIndex]?.focus();
    });
  } else if (item.type === 'checkbox') {
    const newChecked = !checkboxStates.value.get(item.id);
    checkboxStates.value.set(item.id, newChecked);
    item.onCheckedChange?.(newChecked);
    // Menu stays open
  } else if (item.type === 'radio' && radioGroupName) {
    radioStates.value.set(radioGroupName, item.id);
    // Menu stays open
  } else if (item.type === 'submenu') {
    // Open submenu and focus first item
    const firstItem = getFirstFocusableItem(item.items);
    state.openSubmenuPath = [...state.openSubmenuPath, item.id];
    if (firstItem) {
      state.focusedItemPath = [...state.focusedItemPath, firstItem.id];
    }
  }
};

// Handle menu keyboard navigation
const handleMenuKeyDown = async (
  event: KeyboardEvent,
  item: MenuItem,
  menuItems: MenuItem[],
  isSubmenu: boolean,
  radioGroupName?: string
) => {
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
        state.focusedItemPath = [...state.focusedItemPath.slice(0, -1), nextItem.id];
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
        state.focusedItemPath = [...state.focusedItemPath.slice(0, -1), prevItem.id];
      }
      break;
    }
    case 'ArrowRight': {
      event.preventDefault();
      if (item.type === 'submenu') {
        // Open submenu and focus first item
        const firstItem = getFirstFocusableItem(item.items);
        state.openSubmenuPath = [...state.openSubmenuPath, item.id];
        if (firstItem) {
          state.focusedItemPath = [...state.focusedItemPath, firstItem.id];
        }
      } else if (!isSubmenu) {
        const nextMenubarIndex = (state.openMenubarIndex + 1) % props.items.length;
        openMenubarMenu(nextMenubarIndex, 'first');
      }
      break;
    }
    case 'ArrowLeft': {
      event.preventDefault();
      if (isSubmenu) {
        state.openSubmenuPath = state.openSubmenuPath.slice(0, -1);
        state.focusedItemPath = state.focusedItemPath.slice(0, -1);
      } else {
        const prevMenubarIndex =
          state.openMenubarIndex === 0 ? props.items.length - 1 : state.openMenubarIndex - 1;
        openMenubarMenu(prevMenubarIndex, 'first');
      }
      break;
    }
    case 'Home': {
      event.preventDefault();
      const firstEnabled = enabledItems[0];
      if (firstEnabled) {
        state.focusedItemPath = [...state.focusedItemPath.slice(0, -1), firstEnabled.id];
      }
      break;
    }
    case 'End': {
      event.preventDefault();
      const lastEnabled = enabledItems[enabledItems.length - 1];
      if (lastEnabled) {
        state.focusedItemPath = [...state.focusedItemPath.slice(0, -1), lastEnabled.id];
      }
      break;
    }
    case 'Escape': {
      event.preventDefault();
      if (isSubmenu) {
        state.openSubmenuPath = state.openSubmenuPath.slice(0, -1);
        state.focusedItemPath = state.focusedItemPath.slice(0, -1);
      } else {
        const menubarIndex = state.openMenubarIndex;
        closeAllMenus();
        await nextTick();
        menubarItemRefs.value[menubarIndex]?.focus();
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
      handleActivate(item, radioGroupName);
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
};

// MenuItems component for recursive rendering
const MenuItems: FunctionalComponent<{
  items: MenuItem[];
  parentId: string;
  isSubmenu: boolean;
  instanceId: string;
  state: MenuState;
  checkboxStates: Map<string, boolean>;
  radioStates: Map<string, string>;
  menuItemRefs: Record<string, HTMLSpanElement>;
}> = (innerProps) => {
  return innerProps.items.map((item) => {
    if (item.type === 'separator') {
      return h('li', { key: item.id, role: 'none' }, [
        h('hr', { role: 'separator', class: 'apg-menubar-separator' }),
      ]);
    }

    if (item.type === 'radiogroup') {
      return h('li', { key: item.id, role: 'none' }, [
        h(
          'ul',
          { role: 'group', 'aria-label': item.label, class: 'apg-menubar-group' },
          item.items.map((radioItem) => {
            const isChecked = innerProps.radioStates.get(item.name) === radioItem.id;
            const isFocused =
              innerProps.state.focusedItemPath[innerProps.state.focusedItemPath.length - 1] ===
              radioItem.id;
            return h('li', { key: radioItem.id, role: 'none' }, [
              h(
                'span',
                {
                  ref: (el: unknown) => {
                    if (el instanceof HTMLSpanElement) {
                      innerProps.menuItemRefs[radioItem.id] = el;
                    }
                  },
                  role: 'menuitemradio',
                  'aria-checked': isChecked,
                  'aria-disabled': radioItem.disabled || undefined,
                  tabindex: isFocused ? 0 : -1,
                  class: 'apg-menubar-menuitem apg-menubar-menuitemradio',
                  onClick: () => handleActivate(radioItem, item.name),
                  onKeydown: (e: KeyboardEvent) =>
                    handleMenuKeyDown(
                      e,
                      radioItem,
                      innerProps.items,
                      innerProps.isSubmenu,
                      item.name
                    ),
                },
                radioItem.label
              ),
            ]);
          })
        ),
      ]);
    }

    if (item.type === 'checkbox') {
      const isChecked = innerProps.checkboxStates.get(item.id) ?? false;
      const isFocused =
        innerProps.state.focusedItemPath[innerProps.state.focusedItemPath.length - 1] === item.id;
      return h('li', { key: item.id, role: 'none' }, [
        h(
          'span',
          {
            ref: (el: unknown) => {
              if (el instanceof HTMLSpanElement) {
                innerProps.menuItemRefs[item.id] = el;
              }
            },
            role: 'menuitemcheckbox',
            'aria-checked': isChecked,
            'aria-disabled': item.disabled || undefined,
            tabindex: isFocused ? 0 : -1,
            class: 'apg-menubar-menuitem apg-menubar-menuitemcheckbox',
            onClick: () => handleActivate(item),
            onKeydown: (e: KeyboardEvent) =>
              handleMenuKeyDown(e, item, innerProps.items, innerProps.isSubmenu),
          },
          item.label
        ),
      ]);
    }

    if (item.type === 'submenu') {
      const isExpanded = innerProps.state.openSubmenuPath.includes(item.id);
      const isFocused =
        innerProps.state.focusedItemPath[innerProps.state.focusedItemPath.length - 1] === item.id;
      return h('li', { key: item.id, role: 'none' }, [
        h(
          'span',
          {
            id: `${innerProps.instanceId}-menuitem-${item.id}`,
            ref: (el: unknown) => {
              if (el instanceof HTMLSpanElement) {
                innerProps.menuItemRefs[item.id] = el;
              }
            },
            role: 'menuitem',
            'aria-haspopup': 'menu',
            'aria-expanded': isExpanded,
            'aria-disabled': item.disabled || undefined,
            tabindex: isFocused ? 0 : -1,
            class: 'apg-menubar-menuitem apg-menubar-submenu-trigger',
            onClick: () => handleActivate(item),
            onKeydown: (e: KeyboardEvent) =>
              handleMenuKeyDown(e, item, innerProps.items, innerProps.isSubmenu),
          },
          [
            item.label,
            h(
              'svg',
              {
                xmlns: 'http://www.w3.org/2000/svg',
                width: '12',
                height: '12',
                viewBox: '0 0 24 24',
                fill: 'none',
                stroke: 'currentColor',
                'stroke-width': '2',
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
                'aria-hidden': 'true',
                style: 'margin-left: auto; position: relative; top: 1px',
              },
              h('path', { d: 'm9 18 6-6-6-6' })
            ),
          ]
        ),
        h(
          'ul',
          {
            id: `${innerProps.instanceId}-submenu-${item.id}`,
            role: 'menu',
            'aria-labelledby': `${innerProps.instanceId}-menuitem-${item.id}`,
            class: 'apg-menubar-submenu',
            'aria-hidden': !isExpanded,
          },
          isExpanded
            ? [
                h(MenuItems, {
                  items: item.items,
                  parentId: item.id,
                  isSubmenu: true,
                  instanceId: innerProps.instanceId,
                  state: innerProps.state,
                  checkboxStates: innerProps.checkboxStates,
                  radioStates: innerProps.radioStates,
                  menuItemRefs: innerProps.menuItemRefs,
                }),
              ]
            : []
        ),
      ]);
    }

    // Regular menuitem
    const isFocused =
      innerProps.state.focusedItemPath[innerProps.state.focusedItemPath.length - 1] === item.id;
    return h('li', { key: item.id, role: 'none' }, [
      h(
        'span',
        {
          ref: (el: unknown) => {
            if (el instanceof HTMLSpanElement) {
              innerProps.menuItemRefs[item.id] = el;
            }
          },
          role: 'menuitem',
          'aria-disabled': item.disabled || undefined,
          tabindex: isFocused ? 0 : -1,
          class: 'apg-menubar-menuitem',
          onClick: () => handleActivate(item),
          onKeydown: (e: KeyboardEvent) =>
            handleMenuKeyDown(e, item, innerProps.items, innerProps.isSubmenu),
        },
        item.label
      ),
    ]);
  });
};

// Define props for the functional component to help Vue pass them correctly
MenuItems.props = [
  'items',
  'parentId',
  'isSubmenu',
  'instanceId',
  'state',
  'checkboxStates',
  'radioStates',
  'menuItemRefs',
];
</script>
