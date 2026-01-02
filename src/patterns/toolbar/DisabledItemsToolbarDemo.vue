<script setup lang="ts">
import Toolbar from './Toolbar.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarSeparator from './ToolbarSeparator.vue';
</script>

<template>
  <Toolbar aria-label="Edit actions">
    <ToolbarButton>Undo</ToolbarButton>
    <ToolbarButton disabled>Redo</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarButton>Cut</ToolbarButton>
    <ToolbarButton>Copy</ToolbarButton>
    <ToolbarButton disabled>Paste</ToolbarButton>
  </Toolbar>
</template>
