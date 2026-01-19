<template>
  <span
    role="button"
    :tabindex="props.disabled ? -1 : 0"
    :aria-disabled="props.disabled ? 'true' : undefined"
    class="apg-button"
    v-bind="$attrs"
    @click="handleClick"
    @keydown="handleKeyDown"
    @keyup="handleKeyUp"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import { ref } from 'vue';

/**
 * Custom Button using role="button"
 *
 * This component demonstrates how to implement a custom button using ARIA.
 * For production use, prefer the native <button> element which provides
 * all accessibility features automatically.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
defineOptions({
  inheritAttrs: false,
});

export interface ButtonProps {
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Callback fired when button is activated */
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
}

const props = withDefaults(defineProps<ButtonProps>(), {
  disabled: false,
  onClick: undefined,
});

// Track if Space was pressed on this element (for keyup activation)
const spacePressed = ref(false);

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  props.onClick?.(event);
};

const handleKeyDown = (event: KeyboardEvent) => {
  // Ignore if composing (IME input) or already handled
  if (event.isComposing || event.defaultPrevented) {
    return;
  }

  if (props.disabled) {
    return;
  }

  // Space: prevent scroll on keydown, activate on keyup (native button behavior)
  if (event.key === ' ') {
    event.preventDefault();
    spacePressed.value = true;
    return;
  }

  // Enter: activate on keydown (native button behavior)
  if (event.key === 'Enter') {
    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  // Space: activate on keyup if Space was pressed on this element
  if (event.key === ' ' && spacePressed.value) {
    spacePressed.value = false;

    if (props.disabled) {
      return;
    }

    event.preventDefault();
    (event.currentTarget as HTMLElement).click();
  }
};
</script>
