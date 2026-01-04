<template>
  <div class="space-y-4">
    <MenuButton :items="items" :label="label" @item-select="handleItemSelect" />
    <p class="text-muted-foreground text-sm">Last action: {{ lastAction ?? 'None' }}</p>
    <p v-if="showNote" class="text-muted-foreground text-xs">
      Note: "Export" is disabled and will be skipped during keyboard navigation
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import MenuButton, { type MenuItem } from './MenuButton.vue';

const props = defineProps<{
  variant?: 'basic' | 'disabled-items';
}>();

const actionItems: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete' },
];

const fileItems: MenuItem[] = [
  { id: 'new', label: 'New File' },
  { id: 'open', label: 'Open...' },
  { id: 'save', label: 'Save' },
  { id: 'save-as', label: 'Save As...' },
  { id: 'export', label: 'Export', disabled: true },
  { id: 'print', label: 'Print' },
];

const items = computed(() => (props.variant === 'disabled-items' ? fileItems : actionItems));
const label = computed(() => (props.variant === 'disabled-items' ? 'File' : 'Actions'));
const showNote = computed(() => props.variant === 'disabled-items');

const lastAction = ref<string | null>(null);

const handleItemSelect = (itemId: string) => {
  lastAction.value = itemId;
};
</script>
