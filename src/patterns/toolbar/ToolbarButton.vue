<script lang="ts">
export interface ToolbarButtonProps {
  /** Whether the button is disabled */
  disabled?: boolean;
}
</script>

<template>
  <button type="button" class="apg-toolbar-button" :disabled="disabled" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { inject } from 'vue';
import { ToolbarContextKey } from './toolbar-context';

defineOptions({
  inheritAttrs: false,
});

withDefaults(
  defineProps<{
    /** Whether the button is disabled */
    disabled?: boolean;
  }>(),
  {
    disabled: false,
  }
);

// Verify we're inside a Toolbar
const context = inject(ToolbarContextKey);
if (!context) {
  console.warn('ToolbarButton must be used within a Toolbar');
}
</script>
