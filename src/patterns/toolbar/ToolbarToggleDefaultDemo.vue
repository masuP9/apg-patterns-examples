<script setup lang="ts">
import Toolbar from './Toolbar.vue'
import ToolbarToggleButton from './ToolbarToggleButton.vue'
import ToolbarSeparator from './ToolbarSeparator.vue'
</script>

<template>
  <Toolbar aria-label="Default pressed states">
    <ToolbarToggleButton :default-pressed="true">Bold (default on)</ToolbarToggleButton>
    <ToolbarToggleButton>Italic (default off)</ToolbarToggleButton>
    <ToolbarSeparator />
    <ToolbarToggleButton :default-pressed="true" disabled>
      Disabled (pressed)
    </ToolbarToggleButton>
    <ToolbarToggleButton disabled>
      Disabled (not pressed)
    </ToolbarToggleButton>
  </Toolbar>
</template>
