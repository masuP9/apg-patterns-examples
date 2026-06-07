<script lang="ts">
  import { onMount } from 'svelte';

  interface WindowSplitterProps {
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
    /** Callback when position changes */
    onpositionchange?: (position: number, sizeInPx: number) => void;
    /** Callback when collapsed state changes */
    oncollapsedchange?: (collapsed: boolean, previousPosition: number) => void;
    [key: string]: unknown;
  }

  let {
    primaryPaneId,
    secondaryPaneId,
    defaultPosition = 50,
    defaultCollapsed = false,
    expandedPosition,
    min = 10,
    max = 90,
    step = 5,
    largeStep = 10,
    orientation = 'horizontal',
    dir,
    collapsible = true,
    disabled = false,
    readonly = false,
    onpositionchange,
    oncollapsedchange,
    ...restProps
  }: WindowSplitterProps = $props();

  // Constants
  const HOVER_DELAY = 300;
  const DISMISS_DELAY = 300;
  const ACTIVE_SETTLE_DELAY = 500;
  const TAP_DISTANCE_THRESHOLD = 5;
  const POPUP_OFFSET = 8;

  // Utility function
  function clamp(value: number, minVal: number, maxVal: number): number {
    return Math.min(maxVal, Math.max(minVal, value));
  }

  // Refs
  let splitterEl: HTMLDivElement | null = null;
  let containerEl: HTMLDivElement | null = null;
  let popupEl: HTMLDivElement | null = $state(null);

  // State - capture initial prop values (intentionally not reactive to prop changes)
  // Using IIFE to avoid Svelte's state_referenced_locally warning
  const { initPosition, initCollapsed, initPreviousPosition } = (() => {
    const collapsed = defaultCollapsed;
    const pos = collapsed ? 0 : clamp(defaultPosition, min, max);
    const prevPos = collapsed ? null : clamp(defaultPosition, min, max);
    return { initPosition: pos, initCollapsed: collapsed, initPreviousPosition: prevPos };
  })();
  let position = $state(initPosition);
  let collapsed = $state(initCollapsed);
  let previousPosition: number | null = initPreviousPosition;
  let popupState = $state<'hidden' | 'showing' | 'active'>('hidden');
  let popupPos = $state<{ x: number; y: number } | null>(null);

  // Plain variable for synchronous position tracking (for rapid popup button clicks)
  let latestPosition = initPosition;

  // Timer refs (plain variables, not reactive)
  let hoverTimer: ReturnType<typeof setTimeout> | null = null;
  let dismissTimer: ReturnType<typeof setTimeout> | null = null;
  let activeSettleTimer: ReturnType<typeof setTimeout> | null = null;

  // Pointer tracking
  let pointerStart: { x: number; y: number } | null = null;
  let isDragging = false;
  let isMouseOverPopup = false;
  let hoverPos: { x: number; y: number } | null = null;

  // Computed
  const isVertical = $derived(orientation === 'vertical');
  const isHorizontal = $derived(orientation === 'horizontal');

  const isRTL = $derived(
    dir === 'rtl' || (dir !== 'ltr' && typeof document !== 'undefined' && document.dir === 'rtl')
  );

  const ariaControls = $derived(
    secondaryPaneId ? `${primaryPaneId} ${secondaryPaneId}` : primaryPaneId
  );

  const splitterLabel = $derived((restProps['aria-label'] as string) || '');

  // While collapsed the splitter sits below `min`, so the shrink direction is
  // disabled (already minimal) and the expand direction stays enabled.
  const shrinkDisabled = $derived(collapsed || position <= min);
  const collapseDisabled = $derived(collapsed || position <= min);
  const expandDisabled = $derived(!collapsed && position >= max);
  const maxDisabled = $derived(!collapsed && position >= max);

  const icons = $derived(
    isVertical
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

  // Timer cleanup
  function clearAllTimers() {
    if (hoverTimer) clearTimeout(hoverTimer);
    if (dismissTimer) clearTimeout(dismissTimer);
    if (activeSettleTimer) clearTimeout(activeSettleTimer);
    hoverTimer = null;
    dismissTimer = null;
    activeSettleTimer = null;
  }

  onMount(() => {
    return () => clearAllTimers();
  });

  $effect(() => {
    if (popupState !== 'active') return;
    const handleOutsidePointerDown = (e: PointerEvent) => {
      if (popupEl && !popupEl.contains(e.target as Node)) {
        hidePopup();
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  });

  // Calculate popup position
  function calcPopupPosition(clientX: number, clientY: number): { x: number; y: number } | null {
    if (!splitterEl) return null;
    const popupWidth = popupEl?.offsetWidth || (isVertical ? 34 : 120);
    const popupHeight = popupEl?.offsetHeight || (isVertical ? 120 : 34);
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    let x: number;
    let y: number;

    if (isHorizontal) {
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
  }

  // Show popup
  function showPopup(clientX: number, clientY: number) {
    if (disabled || readonly) return;
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
    const pos = calcPopupPosition(clientX, clientY);
    if (pos) {
      popupPos = pos;
      popupState = 'showing';
    }
  }

  // Hide popup
  function hidePopup() {
    clearAllTimers();
    popupState = 'hidden';
    popupPos = null;
  }

  // Schedule dismiss
  function scheduleDismiss() {
    if (dismissTimer) clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
      const hasFocusInside =
        popupEl?.contains(document.activeElement) || splitterEl === document.activeElement;
      if (!hasFocusInside) {
        hidePopup();
      }
    }, DISMISS_DELAY);
  }

  // Update position and emit
  function updatePosition(newPosition: number) {
    const clampedPosition = clamp(newPosition, min, max);
    if (clampedPosition !== latestPosition) {
      latestPosition = clampedPosition;
      position = clampedPosition;

      const sizeInPx = containerEl
        ? (clampedPosition / 100) *
          (isHorizontal ? containerEl.offsetWidth : containerEl.offsetHeight)
        : 0;

      onpositionchange?.(clampedPosition, sizeInPx);
    }
  }

  // Mark the popup as actively adjusting, then settle back to the showing state.
  function markPopupActive() {
    popupState = 'active';
    if (activeSettleTimer) clearTimeout(activeSettleTimer);
    activeSettleTimer = setTimeout(() => {
      if (popupState === 'active') {
        if (!isMouseOverPopup) {
          const pos = hoverPos;
          if (pos) {
            const newPopupPos = calcPopupPosition(pos.x, pos.y);
            if (newPopupPos) popupPos = newPopupPos;
          }
        }
        popupState = 'showing';
      }
    }, ACTIVE_SETTLE_DELAY);
  }

  // Expand from the collapsed state, restoring to the previous/expanded position.
  // Shared by the collapse toggle, popup buttons and keyboard handlers.
  function expandFromCollapsed() {
    const currentPos = latestPosition;
    const restorePosition = previousPosition ?? expandedPosition ?? defaultPosition ?? 50;
    const clampedRestore = clamp(restorePosition, min, max);

    oncollapsedchange?.(false, currentPos);
    collapsed = false;
    latestPosition = clampedRestore;
    position = clampedRestore;

    const sizeInPx = containerEl
      ? (clampedRestore / 100) * (isHorizontal ? containerEl.offsetWidth : containerEl.offsetHeight)
      : 0;
    onpositionchange?.(clampedRestore, sizeInPx);
  }

  // Handle popup button (collapse / shrink / expand / maximize)
  function handlePopupAdjust(kind: 'collapse' | 'shrink' | 'expand' | 'maximize') {
    if (disabled || readonly) return;

    if (collapsed) {
      // Shrink direction is a no-op while collapsed (already at minimum).
      if (kind === 'collapse' || kind === 'shrink') return;
      expandFromCollapsed();
      if (kind === 'maximize') updatePosition(max);
      markPopupActive();
      return;
    }

    const currentPos = latestPosition;
    let target = currentPos;
    switch (kind) {
      case 'collapse':
        target = min;
        break;
      case 'shrink':
        target = currentPos - step;
        break;
      case 'expand':
        target = currentPos + step;
        break;
      case 'maximize':
        target = max;
        break;
    }
    updatePosition(target);
    markPopupActive();
  }

  // Handle collapse/expand
  function handleToggleCollapse() {
    if (!collapsible || disabled || readonly) return;

    if (collapsed) {
      expandFromCollapsed();
      return;
    }
    // Collapse: save current position, set to 0
    const currentPos = latestPosition;
    previousPosition = currentPos;
    oncollapsedchange?.(true, currentPos);
    collapsed = true;
    latestPosition = 0;
    position = 0;
    onpositionchange?.(0, 0);
  }

  // Keyboard handler
  function handleKeyDown(event: KeyboardEvent) {
    if (disabled || readonly) return;

    // Tab to popup when visible
    if (event.key === 'Tab' && !event.shiftKey && popupState !== 'hidden') {
      const firstBtn = popupEl?.querySelector<HTMLButtonElement>('button');
      if (firstBtn) {
        event.preventDefault();
        firstBtn.focus();
        return;
      }
    }

    const hasShift = event.shiftKey;
    const currentStep = hasShift ? largeStep : step;

    let delta = 0;
    let handled = false;

    switch (event.key) {
      case 'ArrowRight':
        if (!isHorizontal) break;
        delta = isRTL ? -currentStep : currentStep;
        handled = true;
        break;

      case 'ArrowLeft':
        if (!isHorizontal) break;
        delta = isRTL ? currentStep : -currentStep;
        handled = true;
        break;

      case 'ArrowUp':
        if (!isVertical) break;
        delta = -currentStep;
        handled = true;
        break;

      case 'ArrowDown':
        if (!isVertical) break;
        delta = currentStep;
        handled = true;
        break;

      case 'Enter':
        handleToggleCollapse();
        handled = true;
        break;

      case 'Home':
        // Shrink direction is a no-op while collapsed (already at minimum).
        if (!collapsed) updatePosition(min);
        handled = true;
        break;

      case 'End':
        if (collapsed) {
          expandFromCollapsed();
        } else {
          updatePosition(max);
        }
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      if (delta !== 0) {
        if (collapsed) {
          // Only the expand direction wakes a collapsed splitter; shrink is a no-op.
          if (delta > 0) expandFromCollapsed();
        } else {
          updatePosition(latestPosition + delta);
        }
      }
    }
  }

  // Pointer handlers
  function handlePointerDown(event: PointerEvent) {
    if (disabled || readonly) return;

    event.preventDefault();
    if (!splitterEl) return;

    pointerStart = { x: event.clientX, y: event.clientY };
    isDragging = false;

    if (typeof splitterEl.setPointerCapture === 'function') {
      splitterEl.setPointerCapture(event.pointerId);
    }

    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    splitterEl.focus();
  }

  function handlePointerMove(event: PointerEvent) {
    const start = pointerStart;
    if (!start) return;

    if (!isDragging) {
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance >= TAP_DISTANCE_THRESHOLD) {
        isDragging = true;
        if (popupState !== 'hidden') hidePopup();
      } else {
        return;
      }
    }

    if (!containerEl) return;

    // Measure the containing layout (the consumer positions the panes there).
    // The visual update is driven solely by onpositionchange, keeping the
    // component agnostic of how the consumer renders its panes.
    const measureElement = containerEl.parentElement || containerEl;
    const rect = measureElement.getBoundingClientRect();

    let percent: number;
    if (isHorizontal) {
      const x = event.clientX - rect.left;
      percent = (x / rect.width) * 100;
    } else {
      const y = event.clientY - rect.top;
      percent = (y / rect.height) * 100;
    }

    updatePosition(percent);
  }

  function handlePointerUp(event: PointerEvent) {
    if (splitterEl && typeof splitterEl.releasePointerCapture === 'function') {
      try {
        splitterEl.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore
      }
    }

    const start = pointerStart;
    if (start && !isDragging) {
      // Tap detected - show popup
      showPopup(start.x, start.y);
    }

    isDragging = false;
    pointerStart = null;
  }

  // Hover handlers for separator
  function handleSeparatorMouseEnter(event: MouseEvent) {
    if (disabled || readonly || isDragging) return;
    hoverPos = { x: event.clientX, y: event.clientY };
    if (popupState === 'hidden') {
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
  }

  function handleSeparatorMouseLeave() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
    if (popupState !== 'hidden') scheduleDismiss();
  }

  function handleSeparatorMouseMove(event: MouseEvent) {
    hoverPos = { x: event.clientX, y: event.clientY };
  }

  // Focus/blur handlers for separator
  function handleSeparatorFocus() {
    if (disabled || readonly) return;
    if (popupState === 'hidden') {
      if (splitterEl) {
        const rect = splitterEl.getBoundingClientRect();
        showPopup(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
  }

  function handleSeparatorBlur() {
    if (popupState !== 'hidden') {
      setTimeout(() => {
        if (!popupEl?.contains(document.activeElement) && splitterEl !== document.activeElement) {
          scheduleDismiss();
        }
      }, 0);
    }
  }

  // Popup mouse handlers
  function handlePopupMouseEnter() {
    isMouseOverPopup = true;
    if (dismissTimer) {
      clearTimeout(dismissTimer);
      dismissTimer = null;
    }
  }

  function handlePopupMouseLeave() {
    isMouseOverPopup = false;
    if (popupState !== 'hidden') scheduleDismiss();
  }

  // Popup keydown handler
  function handlePopupKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.preventDefault();
      hidePopup();
      splitterEl?.focus();
    }
    if (event.key === 'Tab' && event.shiftKey) {
      event.preventDefault();
      hidePopup();
      splitterEl?.focus();
    }
  }
</script>

<div
  bind:this={containerEl}
  class="apg-window-splitter {isVertical ? 'apg-window-splitter--vertical' : ''} {disabled
    ? 'apg-window-splitter--disabled'
    : ''} {restProps.class || ''}"
  style="--splitter-position: {position}%"
>
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
  <!-- role="separator" with aria-valuenow is a focusable widget per WAI-ARIA spec -->
  <div
    bind:this={splitterEl}
    role="separator"
    id={restProps.id}
    tabindex={disabled ? -1 : 0}
    aria-valuenow={position}
    aria-valuemin={min}
    aria-valuemax={max}
    aria-controls={ariaControls}
    aria-orientation={isVertical ? 'vertical' : undefined}
    aria-disabled={disabled ? true : undefined}
    aria-label={restProps['aria-label']}
    aria-labelledby={restProps['aria-labelledby']}
    aria-describedby={restProps['aria-describedby']}
    data-testid={restProps['data-testid']}
    class="apg-window-splitter__separator"
    onkeydown={handleKeyDown}
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onmouseenter={handleSeparatorMouseEnter}
    onmouseleave={handleSeparatorMouseLeave}
    onmousemove={handleSeparatorMouseMove}
    onfocus={handleSeparatorFocus}
    onblur={handleSeparatorBlur}
  ></div>
  {#if !disabled && !readonly}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div
      bind:this={popupEl}
      role="group"
      aria-label={`Adjust ${splitterLabel}`}
      class="apg-window-splitter__popup {popupState !== 'hidden'
        ? 'apg-window-splitter__popup--visible'
        : ''}"
      style={popupPos
        ? `position: fixed; left: ${popupPos.x}px; top: ${popupPos.y}px; flex-direction: ${isVertical ? 'column' : 'row'}`
        : undefined}
      onmouseenter={handlePopupMouseEnter}
      onmouseleave={handlePopupMouseLeave}
      onkeydown={handlePopupKeyDown}
    >
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        tabindex={-1}
        aria-label={`Collapse ${splitterLabel}`}
        aria-disabled={collapseDisabled}
        onclick={() => !collapseDisabled && handlePopupAdjust('collapse')}
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
          style="transform: translate({icons.collapse.dx}px, {icons.collapse.dy}px)"
          ><path d={icons.collapse.d} /></svg
        >
      </button>
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        tabindex={-1}
        aria-label={`Shrink ${splitterLabel}`}
        aria-disabled={shrinkDisabled}
        onclick={() => !shrinkDisabled && handlePopupAdjust('shrink')}
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
          style="transform: translate({icons.shrink.dx}px, {icons.shrink.dy}px)"
          ><path d={icons.shrink.d} /></svg
        >
      </button>
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        tabindex={-1}
        aria-label={`Expand ${splitterLabel}`}
        aria-disabled={expandDisabled}
        onclick={() => !expandDisabled && handlePopupAdjust('expand')}
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
          style="transform: translate({icons.expand.dx}px, {icons.expand.dy}px)"
          ><path d={icons.expand.d} /></svg
        >
      </button>
      <button
        type="button"
        class="apg-window-splitter__popup-button"
        tabindex={-1}
        aria-label={`Expand ${splitterLabel} to maximum`}
        aria-disabled={maxDisabled}
        onclick={() => !maxDisabled && handlePopupAdjust('maximize')}
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
          style="transform: translate({icons.max.dx}px, {icons.max.dy}px)"
          ><path d={icons.max.d} /></svg
        >
      </button>
    </div>
  {/if}
</div>
