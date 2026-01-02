<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { cn } from '@/lib/utils';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip content */
  content: string;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Tooltip placement */
  placement?: TooltipPlacement;
  /** Custom tooltip ID for SSR */
  id?: string;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Additional class name for the wrapper */
  class?: string;
  /** Additional class name for the tooltip content */
  tooltipClass?: string;
}

const props = withDefaults(defineProps<TooltipProps>(), {
  open: undefined,
  defaultOpen: false,
  delay: 300,
  placement: 'top',
  id: undefined,
  disabled: false,
  class: '',
  tooltipClass: '',
});

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

// Generate unique ID
let uid = '';
onMounted(() => {
  uid = props.id ?? `tooltip-${crypto.randomUUID().slice(0, 8)}`;
  tooltipId.value = uid;
});

const tooltipId = ref(props.id ?? '');

const internalOpen = ref(props.defaultOpen);
const isControlled = computed(() => props.open !== undefined);
const isOpen = computed(() => (isControlled.value ? props.open : internalOpen.value));

let timeout: ReturnType<typeof setTimeout> | null = null;

const setOpen = (value: boolean) => {
  if (!isControlled.value) {
    internalOpen.value = value;
  }
  emit('update:open', value);
};

const showTooltip = () => {
  if (props.disabled) return;
  if (timeout) {
    clearTimeout(timeout);
  }
  timeout = setTimeout(() => {
    setOpen(true);
  }, props.delay);
};

const hideTooltip = () => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  setOpen(false);
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    hideTooltip();
  }
};

watch(isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeyDown);
  } else {
    document.removeEventListener('keydown', handleKeyDown);
  }
});

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout);
  }
  document.removeEventListener('keydown', handleKeyDown);
});

const placementClasses: Record<TooltipPlacement, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
};
</script>

<template>
  <span
    :class="cn('apg-tooltip-trigger', 'relative inline-block', props.class)"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @focusin="showTooltip"
    @focusout="hideTooltip"
    :aria-describedby="isOpen && !disabled ? tooltipId : undefined"
  >
    <slot />
    <span
      :id="tooltipId"
      role="tooltip"
      :aria-hidden="!isOpen"
      :class="
        cn(
          'apg-tooltip',
          'absolute z-50 px-3 py-1.5 text-sm',
          'rounded-md bg-gray-900 text-white shadow-lg',
          'dark:bg-gray-100 dark:text-gray-900',
          'pointer-events-none whitespace-nowrap',
          'transition-opacity duration-150',
          placementClasses[placement],
          isOpen ? 'visible opacity-100' : 'invisible opacity-0',
          props.tooltipClass
        )
      "
    >
      {{ content }}
    </span>
  </span>
</template>
