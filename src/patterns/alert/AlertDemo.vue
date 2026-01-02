<script setup lang="ts">
import { ref } from 'vue';
import Alert from './Alert.vue';
import type { AlertVariant } from './Alert.vue';

const variant = ref<AlertVariant>('info');
const message = ref('');

const messages: Record<AlertVariant, string> = {
  info: 'This is an informational message.',
  success: 'Operation completed successfully!',
  warning: 'Please review your input before proceeding.',
  error: 'An error occurred. Please try again.',
};

const showAlert = (v: AlertVariant) => {
  variant.value = v;
  message.value = messages[v];
};

const clearAlert = () => {
  message.value = '';
};
</script>

<template>
  <div class="space-y-4">
    <Alert :message="message" :variant="variant" :dismissible="true" @dismiss="clearAlert" />
    <div class="flex flex-wrap gap-2">
      <button
        type="button"
        class="rounded-md bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
        @click="showAlert('info')"
      >
        Info
      </button>
      <button
        type="button"
        class="rounded-md bg-green-100 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-200 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
        @click="showAlert('success')"
      >
        Success
      </button>
      <button
        type="button"
        class="rounded-md bg-amber-100 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:outline-none"
        @click="showAlert('warning')"
      >
        Warning
      </button>
      <button
        type="button"
        class="rounded-md bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
        @click="showAlert('error')"
      >
        Error
      </button>
    </div>
  </div>
</template>
