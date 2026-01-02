<template>
  <div :class="['apg-disclosure', className]">
    <button
      type="button"
      :aria-expanded="expanded"
      :aria-controls="panelId"
      :disabled="disabled"
      class="apg-disclosure-trigger"
      @click="handleToggle"
    >
      <span class="apg-disclosure-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </span>
      <span class="apg-disclosure-trigger-content">
        <slot name="trigger">{{ trigger }}</slot>
      </span>
    </button>
    <div
      :id="panelId"
      class="apg-disclosure-panel"
      :aria-hidden="!expanded"
      :inert="!expanded || undefined"
    >
      <div class="apg-disclosure-panel-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * APG Disclosure Pattern - Vue Implementation
 *
 * A button that controls the visibility of a section of content.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 */
import { ref, useId } from 'vue';

/**
 * Props for the Disclosure component
 *
 * @example
 * ```vue
 * <Disclosure trigger="Show details">
 *   <p>Hidden content that can be revealed</p>
 * </Disclosure>
 * ```
 */
export interface DisclosureProps {
  /** Content displayed in the disclosure trigger button (can also use #trigger slot) */
  trigger?: string;
  /** When true, the panel is expanded on initial render @default false */
  defaultExpanded?: boolean;
  /** When true, the disclosure cannot be expanded/collapsed @default false */
  disabled?: boolean;
  /** Additional CSS class @default "" */
  className?: string;
}

const props = withDefaults(defineProps<DisclosureProps>(), {
  trigger: '',
  defaultExpanded: false,
  disabled: false,
  className: '',
});

const emit = defineEmits<{
  expandedChange: [expanded: boolean];
}>();

const instanceId = useId();
const panelId = `${instanceId}-panel`;

const expanded = ref(props.defaultExpanded);
const { className } = props;

const handleToggle = () => {
  if (props.disabled) return;

  expanded.value = !expanded.value;
  emit('expandedChange', expanded.value);
};
</script>
