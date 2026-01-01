<script setup lang="ts">
import { ref } from 'vue'
import Toolbar from './Toolbar.vue'
import ToolbarToggleButton from './ToolbarToggleButton.vue'

const isBold = ref(false)
const isItalic = ref(false)
const isUnderline = ref(false)
</script>

<template>
  <div class="space-y-4">
    <Toolbar aria-label="Text formatting with state">
      <ToolbarToggleButton
        :pressed="isBold"
        @update:pressed="isBold = $event"
      >
        Bold
      </ToolbarToggleButton>
      <ToolbarToggleButton
        :pressed="isItalic"
        @update:pressed="isItalic = $event"
      >
        Italic
      </ToolbarToggleButton>
      <ToolbarToggleButton
        :pressed="isUnderline"
        @update:pressed="isUnderline = $event"
      >
        Underline
      </ToolbarToggleButton>
    </Toolbar>
    <div class="text-sm text-muted-foreground">
      <p>
        Current state:
        <span class="font-mono">
          {{ JSON.stringify({ bold: isBold, italic: isItalic, underline: isUnderline }) }}
        </span>
      </p>
    </div>
    <div
      class="p-4 border border-border rounded-lg"
      :style="{
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        textDecoration: isUnderline ? 'underline' : 'none',
      }"
    >
      Sample text with applied formatting
    </div>
  </div>
</template>
