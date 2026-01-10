<template>
  <div
    ref="containerRef"
    :class="[
      'apg-window-splitter',
      isVertical && 'apg-window-splitter--vertical',
      disabled && 'apg-window-splitter--disabled',
      $attrs.class,
    ]"
    :style="{ '--splitter-position': `${position}%` }"
  >
    <div
      ref="splitterRef"
      role="separator"
      :id="$attrs.id"
      :tabindex="disabled ? -1 : 0"
      :aria-valuenow="position"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-controls="ariaControls"
      :aria-orientation="isVertical ? 'vertical' : undefined"
      :aria-disabled="disabled ? true : undefined"
      :aria-label="$attrs['aria-label']"
      :aria-labelledby="$attrs['aria-labelledby']"
      :aria-describedby="$attrs['aria-describedby']"
      :data-testid="$attrs['data-testid']"
      class="apg-window-splitter__separator"
      @keydown="handleKeyDown"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

defineOptions({
  inheritAttrs: false,
});

export interface WindowSplitterProps {
  /** Primary pane ID (required for aria-controls) */
  primaryPaneId: string;
  /** Secondary pane ID (optional, added to aria-controls) */
  secondaryPaneId?: string;
  /** Initial position as % (0-100, default: 50) */
  defaultPosition?: number;
  /** Initial collapsed state (default: false) */
  defaultCollapsed?: boolean;
  /** Position when expanding from initial collapse */
  expandedPosition?: number;
  /** Minimum position as % (default: 10) */
  min?: number;
  /** Maximum position as % (default: 90) */
  max?: number;
  /** Keyboard step as % (default: 5) */
  step?: number;
  /** Shift+Arrow step as % (default: 10) */
  largeStep?: number;
  /** Splitter orientation (default: horizontal = left-right split) */
  orientation?: 'horizontal' | 'vertical';
  /** Text direction for RTL support */
  dir?: 'ltr' | 'rtl';
  /** Whether pane can be collapsed (default: true) */
  collapsible?: boolean;
  /** Disabled state (not focusable, not operable) */
  disabled?: boolean;
  /** Readonly state (focusable but not operable) */
  readonly?: boolean;
}

const props = withDefaults(defineProps<WindowSplitterProps>(), {
  secondaryPaneId: undefined,
  defaultPosition: 50,
  defaultCollapsed: false,
  expandedPosition: undefined,
  min: 10,
  max: 90,
  step: 5,
  largeStep: 10,
  orientation: 'horizontal',
  dir: undefined,
  collapsible: true,
  disabled: false,
  readonly: false,
});

const emit = defineEmits<{
  positionChange: [position: number, sizeInPx: number];
  collapsedChange: [collapsed: boolean, previousPosition: number];
}>();

// Utility function
const clamp = (value: number, minVal: number, maxVal: number): number => {
  return Math.min(maxVal, Math.max(minVal, value));
};

// Refs
const splitterRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const isDragging = ref(false);
const previousPosition = ref<number | null>(
  props.defaultCollapsed ? null : clamp(props.defaultPosition, props.min, props.max)
);

// State
const initialPosition = props.defaultCollapsed
  ? 0
  : clamp(props.defaultPosition, props.min, props.max);
const position = ref(initialPosition);
const collapsed = ref(props.defaultCollapsed);

// Computed
const isVertical = computed(() => props.orientation === 'vertical');
const isHorizontal = computed(() => props.orientation === 'horizontal');

const isRTL = computed(() => {
  if (props.dir === 'rtl') return true;
  if (props.dir === 'ltr') return false;
  if (typeof document !== 'undefined') {
    return document.dir === 'rtl';
  }
  return false;
});

const ariaControls = computed(() => {
  if (props.secondaryPaneId) {
    return `${props.primaryPaneId} ${props.secondaryPaneId}`;
  }
  return props.primaryPaneId;
});

// Update position and emit
const updatePosition = (newPosition: number) => {
  const clampedPosition = clamp(newPosition, props.min, props.max);
  if (clampedPosition !== position.value) {
    position.value = clampedPosition;

    const container = containerRef.value;
    const sizeInPx = container
      ? (clampedPosition / 100) *
        (isHorizontal.value ? container.offsetWidth : container.offsetHeight)
      : 0;

    emit('positionChange', clampedPosition, sizeInPx);
  }
};

// Handle collapse/expand
const handleToggleCollapse = () => {
  if (!props.collapsible || props.disabled || props.readonly) return;

  if (collapsed.value) {
    // Expand: restore to previous or fallback
    const restorePosition =
      previousPosition.value ?? props.expandedPosition ?? props.defaultPosition ?? 50;
    const clampedRestore = clamp(restorePosition, props.min, props.max);

    emit('collapsedChange', false, position.value);
    collapsed.value = false;
    position.value = clampedRestore;

    const container = containerRef.value;
    const sizeInPx = container
      ? (clampedRestore / 100) *
        (isHorizontal.value ? container.offsetWidth : container.offsetHeight)
      : 0;
    emit('positionChange', clampedRestore, sizeInPx);
  } else {
    // Collapse: save current position, set to 0
    previousPosition.value = position.value;
    emit('collapsedChange', true, position.value);
    collapsed.value = true;
    position.value = 0;
    emit('positionChange', 0, 0);
  }
};

// Keyboard handler
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled || props.readonly) return;

  const hasShift = event.shiftKey;
  const currentStep = hasShift ? props.largeStep : props.step;

  let delta = 0;
  let handled = false;

  switch (event.key) {
    case 'ArrowRight':
      if (!isHorizontal.value) break;
      delta = isRTL.value ? -currentStep : currentStep;
      handled = true;
      break;

    case 'ArrowLeft':
      if (!isHorizontal.value) break;
      delta = isRTL.value ? currentStep : -currentStep;
      handled = true;
      break;

    case 'ArrowUp':
      if (!isVertical.value) break;
      delta = currentStep;
      handled = true;
      break;

    case 'ArrowDown':
      if (!isVertical.value) break;
      delta = -currentStep;
      handled = true;
      break;

    case 'Enter':
      handleToggleCollapse();
      handled = true;
      break;

    case 'Home':
      updatePosition(props.min);
      handled = true;
      break;

    case 'End':
      updatePosition(props.max);
      handled = true;
      break;
  }

  if (handled) {
    event.preventDefault();
    if (delta !== 0) {
      updatePosition(position.value + delta);
    }
  }
};

// Pointer handlers
const handlePointerDown = (event: PointerEvent) => {
  if (props.disabled || props.readonly) return;

  event.preventDefault();
  const splitter = splitterRef.value;
  if (!splitter) return;

  if (typeof splitter.setPointerCapture === 'function') {
    splitter.setPointerCapture(event.pointerId);
  }
  isDragging.value = true;
  splitter.focus();
};

const handlePointerMove = (event: PointerEvent) => {
  if (!isDragging.value) return;

  const container = containerRef.value;
  if (!container) return;

  // Use demo container for stable measurement if available
  const demoContainer = container.closest(
    '.apg-window-splitter-demo-container'
  ) as HTMLElement | null;
  const measureElement = demoContainer || container.parentElement || container;
  const rect = measureElement.getBoundingClientRect();

  let percent: number;
  if (isHorizontal.value) {
    const x = event.clientX - rect.left;
    percent = (x / rect.width) * 100;
  } else {
    const y = event.clientY - rect.top;
    // For vertical, y position corresponds to primary pane height
    percent = (y / rect.height) * 100;
  }

  // Clamp the percent to min/max
  const clampedPercent = clamp(percent, props.min, props.max);

  // Update CSS variable directly for smooth dragging
  if (demoContainer) {
    demoContainer.style.setProperty('--splitter-position', `${clampedPercent}%`);
  }

  updatePosition(percent);
};

const handlePointerUp = (event: PointerEvent) => {
  const splitter = splitterRef.value;
  if (splitter && typeof splitter.releasePointerCapture === 'function') {
    try {
      splitter.releasePointerCapture(event.pointerId);
    } catch {
      // Ignore
    }
  }
  isDragging.value = false;
};
</script>
