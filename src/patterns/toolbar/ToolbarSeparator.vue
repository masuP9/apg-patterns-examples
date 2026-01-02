<template>
  <div role="separator" :aria-orientation="separatorOrientation" class="apg-toolbar-separator" />
</template>

<script setup lang="ts">
import { inject, computed } from 'vue';
import { ToolbarContextKey } from './toolbar-context';

// Verify we're inside a Toolbar
const context = inject(ToolbarContextKey);
if (!context) {
  console.warn('ToolbarSeparator must be used within a Toolbar');
}

// Separator orientation is perpendicular to toolbar orientation
const separatorOrientation = computed(() =>
  context?.orientation.value === 'horizontal' ? 'vertical' : 'horizontal'
);
</script>
