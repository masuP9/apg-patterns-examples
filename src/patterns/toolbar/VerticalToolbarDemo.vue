<script setup lang="ts">
import Toolbar from './Toolbar.vue'
import ToolbarButton from './ToolbarButton.vue'
import ToolbarSeparator from './ToolbarSeparator.vue'
</script>

<template>
  <Toolbar orientation="vertical" aria-label="Actions">
    <ToolbarButton>New</ToolbarButton>
    <ToolbarButton>Open</ToolbarButton>
    <ToolbarButton>Save</ToolbarButton>
    <ToolbarSeparator />
    <ToolbarButton>Print</ToolbarButton>
  </Toolbar>
</template>
