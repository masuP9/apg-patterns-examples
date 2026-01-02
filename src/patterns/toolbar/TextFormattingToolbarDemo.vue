<script setup lang="ts">
import Toolbar from './Toolbar.vue';
import ToolbarButton from './ToolbarButton.vue';
import ToolbarToggleButton from './ToolbarToggleButton.vue';
import ToolbarSeparator from './ToolbarSeparator.vue';
</script>

<template>
  <Toolbar aria-label="Text formatting">
    <ToolbarToggleButton>Bold</ToolbarToggleButton>
    <ToolbarToggleButton>Italic</ToolbarToggleButton>
    <ToolbarToggleButton>Underline</ToolbarToggleButton>
    <ToolbarSeparator />
    <ToolbarButton>Align Left</ToolbarButton>
    <ToolbarButton>Center</ToolbarButton>
    <ToolbarButton>Align Right</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarButton>Copy</ToolbarButton>
    <ToolbarButton>Cut</ToolbarButton>
    <ToolbarButton>Paste</ToolbarButton>
  </Toolbar>
</template>
