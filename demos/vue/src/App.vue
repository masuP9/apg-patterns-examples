<template>
  <div class="apg-demo-container">
    <div class="apg-demo-section">
      <h1 class="apg-demo-title">Toggle Button Demo</h1>
      <p class="apg-demo-description">
        Interactive demonstration of accessible toggle buttons following the 
        <a
          href="https://www.w3.org/WAI/ARIA/apg/patterns/button/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-600 underline hover:text-blue-800"
        >
          WAI-ARIA Button Pattern
        </a>
        .
      </p>

      <div class="apg-button-group">
        <div>
          <p id="email-desc" class="apg-toggle-button-description">
            Enable or disable email notifications for your account
          </p>
          <ToggleButton
            :initial-pressed="notification"
            :on-toggle="(pressed: boolean) => setNotification(pressed)"
            aria-label="Toggle email notifications"
            aria-describedby="email-desc"
          >
            📧 Email Notifications
          </ToggleButton>
        </div>

        <div>
          <p id="dark-desc" class="apg-toggle-button-description">
            Switch between light and dark theme
          </p>
          <ToggleButton
            :initial-pressed="darkMode"
            :on-toggle="(pressed: boolean) => setDarkMode(pressed)"
            aria-label="Toggle dark mode"
            aria-describedby="dark-desc"
          >
            🌙 Dark Mode
          </ToggleButton>
        </div>
      </div>

      <div class="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <h3 class="text-lg font-semibold mb-2 text-blue-900 dark:text-blue-100">
          Current State:
        </h3>
        <p class="text-blue-800 dark:text-blue-200">
          📧 Notifications: 
          <strong>{{ notification ? "Enabled" : "Disabled" }}</strong>
        </p>
        <p class="text-blue-800 dark:text-blue-200">
          🌙 Dark Mode: <strong>{{ darkMode ? "On" : "Off" }}</strong>
        </p>
      </div>

      <div class="mt-6 p-4 bg-green-50 rounded-lg dark:bg-green-900/20 border border-green-200 dark:border-green-800">
        <h3 class="text-lg font-semibold mb-2 text-green-900 dark:text-green-100">
          ✅ Accessibility Features:
        </h3>
        <ul class="text-green-800 dark:text-green-200 space-y-1 text-sm">
          <li>
            • Uses 
            <code class="bg-green-100 dark:bg-green-800 px-1 rounded">
              aria-pressed
            </code>
            attribute
          </li>
          <li>• Keyboard support (Space/Enter)</li>
          <li>• Screen reader announcements</li>
          <li>• Focus management</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ToggleButton from './components/ToggleButton.vue'

const notification = ref(false)
const darkMode = ref(false)

const setNotification = (pressed: boolean) => {
  notification.value = pressed
}

const setDarkMode = (pressed: boolean) => {
  darkMode.value = pressed
}
</script>