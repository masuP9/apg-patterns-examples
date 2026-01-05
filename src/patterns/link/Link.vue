<template>
  <span
    role="link"
    :tabindex="props.disabled ? -1 : 0"
    :aria-disabled="props.disabled ? 'true' : undefined"
    class="apg-link"
    v-bind="$attrs"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

export interface LinkProps {
  /** Link destination URL */
  href?: string;
  /** Link target */
  target?: '_self' | '_blank';
  /** Whether the link is disabled */
  disabled?: boolean;
  /** Callback fired when link is activated */
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
}

const props = withDefaults(defineProps<LinkProps>(), {
  href: undefined,
  target: undefined,
  disabled: false,
  onClick: undefined,
});

const navigate = () => {
  if (!props.href) {
    return;
  }

  if (props.target === '_blank') {
    window.open(props.href, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = props.href;
  }
};

const handleClick = (event: MouseEvent) => {
  if (props.disabled) {
    event.preventDefault();
    return;
  }

  props.onClick?.(event);

  // Navigate only if onClick didn't prevent the event
  if (!event.defaultPrevented) {
    navigate();
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  // Ignore if composing (IME input) or already handled
  if (event.isComposing || event.defaultPrevented) {
    return;
  }

  if (props.disabled) {
    return;
  }

  // Only Enter key activates link (NOT Space)
  if (event.key === 'Enter') {
    props.onClick?.(event);

    // Navigate only if onClick didn't prevent the event
    if (!event.defaultPrevented) {
      navigate();
    }
  }
};
</script>
