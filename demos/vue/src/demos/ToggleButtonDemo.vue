<template>
  <div class="p-8">
    <div class="flex gap-4">
      <ToggleButton
        :initial-pressed="notification"
        :on-toggle="(pressed: boolean) => setNotification(pressed)"
        aria-label="Toggle email notifications"
      >
        📧 Email Notifications
      </ToggleButton>

      <ToggleButton
        :initial-pressed="darkMode"
        :on-toggle="(pressed: boolean) => setDarkMode(pressed)"
        aria-label="Toggle dark mode"
      >
        🌙 Dark Mode
      </ToggleButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ToggleButton from '../components/ToggleButton.vue'

const notification = ref(false)
const darkMode = ref(false)

const setNotification = (pressed: boolean) => {
  notification.value = pressed
}

const setDarkMode = (pressed: boolean) => {
  darkMode.value = pressed
}
</script>