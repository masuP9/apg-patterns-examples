<template>
  <button
    type="button"
    role="switch"
    class="apg-switch"
    :aria-checked="checked"
    :aria-disabled="props.disabled || undefined"
    :disabled="props.disabled"
    v-bind="$attrs"
    @click="handleClick"
    @keydown="handleKeyDown"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
  >
    <span class="apg-switch-track">
      <span class="apg-switch-icon" aria-hidden="true">
        <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span class="apg-switch-thumb" />
    </span>
    <span v-if="$slots.default" class="apg-switch-label">
      <slot />
    </span>
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineOptions({
  inheritAttrs: false,
});

export interface SwitchProps {
  /** Initial checked state */
  initialChecked?: boolean;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  initialChecked: false,
  disabled: false,
  onCheckedChange: undefined,
});

const emit = defineEmits<{
  change: [checked: boolean];
}>();

defineSlots<{
  default(): unknown;
}>();

const SWIPE_THRESHOLD = 10;

const checked = ref(props.initialChecked);
let pointerStartX: number | null = null;
let hasSwiped = false;

const setCheckedState = (newChecked: boolean) => {
  if (newChecked !== checked.value) {
    checked.value = newChecked;
    props.onCheckedChange?.(newChecked);
    emit('change', newChecked);
  }
};

const toggle = () => {
  if (props.disabled) return;
  setCheckedState(!checked.value);
};

const handleClick = () => {
  if (hasSwiped) return;
  toggle();
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    toggle();
  }
};

const handlePointerDown = (event: PointerEvent) => {
  if (props.disabled) return;
  pointerStartX = event.clientX;
  hasSwiped = false;
  const target = event.target as HTMLElement;
  target.setPointerCapture?.(event.pointerId);
};

const handlePointerMove = (event: PointerEvent) => {
  if (props.disabled || pointerStartX === null) return;
  const deltaX = event.clientX - pointerStartX;
  if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
    hasSwiped = true;
    const newChecked = deltaX > 0;
    setCheckedState(newChecked);
    pointerStartX = null;
  }
};

const handlePointerUp = (event: PointerEvent) => {
  pointerStartX = null;
  const target = event.target as HTMLElement;
  target.releasePointerCapture?.(event.pointerId);
  // Reset hasSwiped after a microtask to allow click handler to check it
  queueMicrotask(() => {
    hasSwiped = false;
  });
};
</script>
