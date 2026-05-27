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
      @mouseenter="handleSeparatorMouseEnter"
      @mouseleave="handleSeparatorMouseLeave"
      @mousemove="handleSeparatorMouseMove"
      @focus="handleSeparatorFocus"
      @blur="handleSeparatorBlur"
    />
    <div
      v-if="!disabled && !readonly"
      ref="popupRef"
      role="group"
      :aria-label="`Adjust ${splitterLabel}`"
      :class="[
        'apg-window-splitter__popup',
        popupState !== 'hidden' && 'apg-window-splitter__popup--visible',
      ]"
      :style="
        popupPos
          ? {
              left: `${popupPos.x}px`,
              top: `${popupPos.y}px`,
              flexDirection: isVertical ? 'column' : 'row',
            }
          : undefined
      "
      @mouseenter="handlePopupMouseEnter"
      @mouseleave="handlePopupMouseLeave"
      @keydown="handlePopupKeyDown"
    >
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        :tabindex="-1"
        :aria-label="`Collapse ${splitterLabel}`"
        :aria-disabled="isAtMin"
        @click="!isAtMin && handlePopupButtonClick(props.min - positionLocal)"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          :style="{ transform: `translate(${icons.collapse.dx}px, ${icons.collapse.dy}px)` }"
        >
          <path :d="icons.collapse.d" />
        </svg>
      </button>
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        :tabindex="-1"
        :aria-label="`Shrink ${splitterLabel}`"
        :aria-disabled="isAtMin"
        @click="!isAtMin && handlePopupButtonClick(-step)"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          :style="{ transform: `translate(${icons.shrink.dx}px, ${icons.shrink.dy}px)` }"
        >
          <path :d="icons.shrink.d" />
        </svg>
      </button>
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        :tabindex="-1"
        :aria-label="`Expand ${splitterLabel}`"
        :aria-disabled="isAtMax"
        @click="!isAtMax && handlePopupButtonClick(step)"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          :style="{ transform: `translate(${icons.expand.dx}px, ${icons.expand.dy}px)` }"
        >
          <path :d="icons.expand.d" />
        </svg>
      </button>
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        :tabindex="-1"
        :aria-label="`Expand ${splitterLabel} to maximum`"
        :aria-disabled="isAtMax"
        @click="!isAtMax && handlePopupButtonClick(props.max - positionLocal)"
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
          :style="{ transform: `translate(${icons.max.dx}px, ${icons.max.dy}px)` }"
        >
          <path :d="icons.max.d" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, getCurrentInstance, onUnmounted, ref, watch } from 'vue';

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

const instance = getCurrentInstance();

// Constants
const HOVER_DELAY = 300;
const DISMISS_DELAY = 300;
const ACTIVE_SETTLE_DELAY = 500;
const TAP_DISTANCE_THRESHOLD = 5;
const POPUP_OFFSET = 8;

// Utility function
const clamp = (value: number, minVal: number, maxVal: number): number => {
  return Math.min(maxVal, Math.max(minVal, value));
};

// Refs
const splitterRef = ref<HTMLDivElement | null>(null);
const containerRef = ref<HTMLDivElement | null>(null);
const popupRef = ref<HTMLDivElement | null>(null);
const previousPosition = ref<number | null>(
  props.defaultCollapsed ? null : clamp(props.defaultPosition, props.min, props.max)
);

// State
const initialPosition = props.defaultCollapsed
  ? 0
  : clamp(props.defaultPosition, props.min, props.max);
const position = ref(initialPosition);
const collapsed = ref(props.defaultCollapsed);
const popupState = ref<'hidden' | 'showing' | 'active'>('hidden');
const popupPos = ref<{ x: number; y: number } | null>(null);

// Non-reactive variables for immediate tracking (avoid reactivity overhead)
let positionLocal = initialPosition;
let isDragging = false;
let isMouseOverPopup = false;
let hoverTimer: ReturnType<typeof setTimeout> | null = null;
let dismissTimer: ReturnType<typeof setTimeout> | null = null;
let activeSettleTimer: ReturnType<typeof setTimeout> | null = null;
let pointerStart: { x: number; y: number } | null = null;
let hoverPos: { x: number; y: number } | null = null;

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

const splitterLabel = computed(() => {
  return (instance?.attrs['aria-label'] as string) || '';
});

const isAtMin = computed(() => position.value <= props.min);
const isAtMax = computed(() => position.value >= props.max);

const icons = computed(() =>
  isVertical.value
    ? {
        collapse: { d: 'M2 9L6 5L10 9M2 5L6 1L10 5', dx: 0, dy: -1 },
        shrink: { d: 'M2 8L6 4L10 8', dx: 0, dy: -1 },
        expand: { d: 'M2 4L6 8L10 4', dx: 0, dy: 1 },
        max: { d: 'M2 3L6 7L10 3M2 7L6 11L10 7', dx: 0, dy: 1 },
      }
    : {
        collapse: { d: 'M5 2L1 6L5 10M9 2L5 6L9 10', dx: -1, dy: 0 },
        shrink: { d: 'M8 2L4 6L8 10', dx: -1, dy: 0 },
        expand: { d: 'M4 2L8 6L4 10', dx: 1, dy: 0 },
        max: { d: 'M3 2L7 6L3 10M7 2L11 6L7 10', dx: 1, dy: 0 },
      }
);

// Timer management
const clearAllTimers = () => {
  if (hoverTimer) clearTimeout(hoverTimer);
  if (dismissTimer) clearTimeout(dismissTimer);
  if (activeSettleTimer) clearTimeout(activeSettleTimer);
  hoverTimer = null;
  dismissTimer = null;
  activeSettleTimer = null;
};

onUnmounted(() => {
  clearAllTimers();
});

watch(popupState, (state, _, onCleanup) => {
  if (state !== 'active') return;
  const handleOutsidePointerDown = (e: PointerEvent) => {
    if (popupRef.value && !popupRef.value.contains(e.target as Node)) {
      hidePopup();
    }
  };
  document.addEventListener('pointerdown', handleOutsidePointerDown);
  onCleanup(() => document.removeEventListener('pointerdown', handleOutsidePointerDown));
});

// Popup position calculation
const calcPopupPosition = (clientX: number, clientY: number) => {
  const splitter = splitterRef.value;
  if (!splitter) return null;
  const rect = splitter.getBoundingClientRect();
  const popupEl = popupRef.value;
  const popupWidth = popupEl?.offsetWidth || (isVertical.value ? 34 : 120);
  const popupHeight = popupEl?.offsetHeight || (isVertical.value ? 120 : 34);
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  let x: number;
  let y: number;

  if (isHorizontal.value) {
    x = clientX - popupWidth / 2;
    const belowY = clientY + POPUP_OFFSET;
    const aboveY = clientY - POPUP_OFFSET - popupHeight;
    y = belowY + popupHeight <= vh ? belowY : aboveY;
  } else {
    y = clientY - popupHeight / 2;
    const rightX = clientX + POPUP_OFFSET;
    const leftX = clientX - POPUP_OFFSET - popupWidth;
    x = rightX + popupWidth <= vw ? rightX : leftX;
  }

  x = clamp(x, 0, vw - popupWidth);
  y = clamp(y, 0, vh - popupHeight);

  return { x, y };
};

// Popup show/hide
const showPopup = (clientX: number, clientY: number) => {
  if (props.disabled || props.readonly) return;
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
  const pos = calcPopupPosition(clientX, clientY);
  if (pos) {
    popupPos.value = pos;
    popupState.value = 'showing';
  }
};

const hidePopup = () => {
  clearAllTimers();
  popupState.value = 'hidden';
  popupPos.value = null;
};

const scheduleDismiss = () => {
  if (dismissTimer) clearTimeout(dismissTimer);
  dismissTimer = setTimeout(() => {
    const splitter = splitterRef.value;
    const popup = popupRef.value;
    const hasFocusInside =
      popup?.contains(document.activeElement) || splitter === document.activeElement;
    if (!hasFocusInside) {
      hidePopup();
    }
  }, DISMISS_DELAY);
};

// Update position and emit
const updatePosition = (newPosition: number) => {
  const clampedPosition = clamp(newPosition, props.min, props.max);
  if (clampedPosition !== positionLocal) {
    positionLocal = clampedPosition;
    position.value = clampedPosition;

    const container = containerRef.value;
    const sizeInPx = container
      ? (clampedPosition / 100) *
        (isHorizontal.value ? container.offsetWidth : container.offsetHeight)
      : 0;

    emit('positionChange', clampedPosition, sizeInPx);
  }
};

// Popup button click handler
const handlePopupButtonClick = (delta: number) => {
  if (props.disabled || props.readonly) return;
  const currentPos = positionLocal;
  const newPos = currentPos + delta;
  if (newPos < props.min || newPos > props.max) return;
  updatePosition(newPos);
  popupState.value = 'active';
  if (activeSettleTimer) clearTimeout(activeSettleTimer);
  activeSettleTimer = setTimeout(() => {
    if (popupState.value === 'active') {
      if (!isMouseOverPopup) {
        const pos = hoverPos;
        if (pos) {
          const newPopupPos = calcPopupPosition(pos.x, pos.y);
          if (newPopupPos) popupPos.value = newPopupPos;
        }
      }
      popupState.value = 'showing';
    }
  }, ACTIVE_SETTLE_DELAY);
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
    positionLocal = clampedRestore;
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
    positionLocal = 0;
    position.value = 0;
    emit('positionChange', 0, 0);
  }
};

// Keyboard handler
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.disabled || props.readonly) return;

  // Tab moves focus to popup if visible
  if (event.key === 'Tab' && !event.shiftKey && popupState.value !== 'hidden') {
    const firstBtn = popupRef.value?.querySelector<HTMLButtonElement>('button');
    if (firstBtn) {
      event.preventDefault();
      firstBtn.focus();
      return;
    }
  }

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
      delta = -currentStep;
      handled = true;
      break;

    case 'ArrowDown':
      if (!isVertical.value) break;
      delta = currentStep;
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
      updatePosition(positionLocal + delta);
    }
  }
};

// Pointer handlers
const handlePointerDown = (event: PointerEvent) => {
  if (props.disabled || props.readonly) return;

  event.preventDefault();
  const splitter = splitterRef.value;
  if (!splitter) return;

  pointerStart = { x: event.clientX, y: event.clientY };
  isDragging = false;

  if (typeof splitter.setPointerCapture === 'function') {
    splitter.setPointerCapture(event.pointerId);
  }

  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }

  splitter.focus();
};

const handlePointerMove = (event: PointerEvent) => {
  const start = pointerStart;
  if (!start) return;

  if (!isDragging) {
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance >= TAP_DISTANCE_THRESHOLD) {
      isDragging = true;
      if (popupState.value !== 'hidden') hidePopup();
    } else {
      return;
    }
  }

  const container = containerRef.value;
  if (!container) return;

  // Use demo container for stable measurement if available
  const demoContainerElement = container.closest('.apg-window-splitter-demo-container');
  const demoContainer = demoContainerElement instanceof HTMLElement ? demoContainerElement : null;
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

  const start = pointerStart;
  if (start && !isDragging) {
    showPopup(start.x, start.y);
  }

  isDragging = false;
  pointerStart = null;
};

// Separator mouse handlers for hover popup
const handleSeparatorMouseEnter = (event: MouseEvent) => {
  if (props.disabled || props.readonly || isDragging) return;
  hoverPos = { x: event.clientX, y: event.clientY };
  if (popupState.value === 'hidden') {
    if (hoverTimer) clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      const pos = hoverPos;
      if (pos) showPopup(pos.x, pos.y);
    }, HOVER_DELAY);
  }
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
};

const handleSeparatorMouseLeave = () => {
  if (hoverTimer) {
    clearTimeout(hoverTimer);
    hoverTimer = null;
  }
  if (popupState.value !== 'hidden') scheduleDismiss();
};

const handleSeparatorMouseMove = (event: MouseEvent) => {
  hoverPos = { x: event.clientX, y: event.clientY };
};

// Separator focus/blur handlers
const handleSeparatorFocus = () => {
  if (props.disabled || props.readonly) return;
  if (popupState.value === 'hidden') {
    const splitter = splitterRef.value;
    if (splitter) {
      const rect = splitter.getBoundingClientRect();
      showPopup(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
};

const handleSeparatorBlur = () => {
  if (popupState.value !== 'hidden') {
    setTimeout(() => {
      const popup = popupRef.value;
      const splitter = splitterRef.value;
      if (!popup?.contains(document.activeElement) && splitter !== document.activeElement) {
        scheduleDismiss();
      }
    }, 0);
  }
};

// Popup mouse handlers
const handlePopupMouseEnter = () => {
  isMouseOverPopup = true;
  if (dismissTimer) {
    clearTimeout(dismissTimer);
    dismissTimer = null;
  }
};

const handlePopupMouseLeave = () => {
  isMouseOverPopup = false;
  if (popupState.value !== 'hidden') scheduleDismiss();
};

// Popup keydown handler
const handlePopupKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    event.preventDefault();
    hidePopup();
    splitterRef.value?.focus();
  }
  if (event.key === 'Tab' && event.shiftKey) {
    event.preventDefault();
    hidePopup();
    splitterRef.value?.focus();
  }
};
</script>
