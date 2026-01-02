<script setup lang="ts">
import { computed, useId } from "vue";
import { cn } from "@/lib/utils";
import { Info, CircleCheck, AlertTriangle, OctagonAlert, X } from "lucide-vue-next";
import { type AlertVariant, variantStyles } from "./alert-config";

export type { AlertVariant };

export interface AlertProps {
  /**
   * Alert message content.
   * Changes to this prop trigger screen reader announcements.
   */
  message?: string;
  /**
   * Alert variant for visual styling.
   * Does NOT affect ARIA - all variants use role="alert"
   */
  variant?: AlertVariant;
  /**
   * Custom ID for the alert container.
   * Useful for SSR/hydration consistency.
   */
  id?: string;
  /**
   * Whether to show dismiss button.
   * Note: Manual dismiss only - NO auto-dismiss per WCAG 2.2.3
   */
  dismissible?: boolean;
  /**
   * Additional class name for the alert container
   */
  class?: string;
}

const props = withDefaults(defineProps<AlertProps>(), {
  message: undefined,
  variant: "info",
  id: undefined,
  dismissible: false,
  class: "",
});

const emit = defineEmits<{
  dismiss: [];
}>();

// Generate SSR-safe unique ID
const generatedId = useId();
const alertId = computed(() => props.id ?? `alert-${generatedId}`);

const hasContent = computed(() => Boolean(props.message) || Boolean(slots.default));

const slots = defineSlots<{
  default?: () => unknown;
}>();

const variantIcons = {
  info: Info,
  success: CircleCheck,
  warning: AlertTriangle,
  error: OctagonAlert,
};

const handleDismiss = () => {
  emit("dismiss");
};
</script>

<template>
  <div
    :class="
      cn(
        'apg-alert',
        hasContent && [
          'relative flex items-start gap-3 px-4 py-3 rounded-lg border',
          'transition-colors duration-150',
          variantStyles[variant],
        ],
        !hasContent && 'contents',
        props.class
      )
    "
  >
    <!-- Live region - contains only content for screen reader announcement -->
    <div
      :id="alertId"
      role="alert"
      :class="cn(
        hasContent && 'flex-1 flex items-start gap-3',
        !hasContent && 'contents'
      )"
    >
      <template v-if="hasContent">
        <span class="apg-alert-icon flex-shrink-0 mt-0.5" aria-hidden="true">
          <component :is="variantIcons[variant]" class="size-5" />
        </span>
        <span class="apg-alert-content flex-1">
          <template v-if="message">{{ message }}</template>
          <slot v-else />
        </span>
      </template>
    </div>
    <!-- Dismiss button - outside live region to avoid SR announcing it as part of alert -->
    <button
      v-if="hasContent && dismissible"
      type="button"
      :class="
        cn(
          'apg-alert-dismiss',
          'flex-shrink-0 min-w-11 min-h-11 p-2 -m-2 rounded',
          'flex items-center justify-center',
          'hover:bg-black/10 dark:hover:bg-white/10',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current'
        )
      "
      aria-label="Dismiss alert"
      @click="handleDismiss"
    >
      <X class="size-5" aria-hidden="true" />
    </button>
  </div>
</template>
