<template>
  <div class="space-y-4">
    <div>
      <label :id="labelId" class="mb-2 block text-sm font-medium">
        {{ label }}
      </label>
      <Listbox
        :options="options"
        :multiselectable="multiselectable"
        :orientation="orientation"
        :default-selected-ids="defaultSelectedIds"
        :aria-labelledby="labelId"
        @selection-change="handleSelectionChange"
      />
    </div>
    <p class="text-muted-foreground text-sm">Selected: {{ selectedDisplay }}</p>
    <p v-if="multiselectable" class="text-muted-foreground text-xs">
      Tip: Use Space to toggle, Shift+Arrow to extend selection, Ctrl+A to select all
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import Listbox, { type ListboxOption } from './Listbox.vue';

interface Props {
  options: ListboxOption[];
  label: string;
  multiselectable?: boolean;
  orientation?: 'vertical' | 'horizontal';
  defaultSelectedIds?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  multiselectable: false,
  orientation: 'vertical',
  defaultSelectedIds: () => [],
});

const labelId = ref('');
const selectedIds = ref<string[]>([]);

onMounted(() => {
  labelId.value = `listbox-label-${Math.random().toString(36).substr(2, 9)}`;
  selectedIds.value = props.defaultSelectedIds;
});

const selectedDisplay = computed(() => {
  return selectedIds.value.length > 0 ? selectedIds.value.join(', ') : 'None';
});

const handleSelectionChange = (ids: string[]) => {
  selectedIds.value = ids;
};
</script>
