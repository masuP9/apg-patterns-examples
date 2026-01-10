<script lang="ts">
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

  // Utility function
  function clamp(value: number, minVal: number, maxVal: number): number {
    return Math.min(maxVal, Math.max(minVal, value));
  }

  // Refs
  let splitterEl: HTMLDivElement | null = null;
  let containerEl: HTMLDivElement | null = null;
  let isDragging = $state(false);

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

  // Computed
  const isVertical = $derived(orientation === 'vertical');
  const isHorizontal = $derived(orientation === 'horizontal');

  const isRTL = $derived(
    dir === 'rtl' || (dir !== 'ltr' && typeof document !== 'undefined' && document.dir === 'rtl')
  );

  const ariaControls = $derived(
    secondaryPaneId ? `${primaryPaneId} ${secondaryPaneId}` : primaryPaneId
  );

  // Update position and emit
  function updatePosition(newPosition: number) {
    const clampedPosition = clamp(newPosition, min, max);
    if (clampedPosition !== position) {
      position = clampedPosition;

      const sizeInPx = containerEl
        ? (clampedPosition / 100) *
          (isHorizontal ? containerEl.offsetWidth : containerEl.offsetHeight)
        : 0;

      onpositionchange?.(clampedPosition, sizeInPx);
    }
  }

  // Handle collapse/expand
  function handleToggleCollapse() {
    if (!collapsible || disabled || readonly) return;

    if (collapsed) {
      // Expand: restore to previous or fallback
      const restorePosition =
        previousPosition ?? expandedPosition ?? defaultPosition ?? 50;
      const clampedRestore = clamp(restorePosition, min, max);

      oncollapsedchange?.(false, position);
      collapsed = false;
      position = clampedRestore;

      const sizeInPx = containerEl
        ? (clampedRestore / 100) *
          (isHorizontal ? containerEl.offsetWidth : containerEl.offsetHeight)
        : 0;
      onpositionchange?.(clampedRestore, sizeInPx);
    } else {
      // Collapse: save current position, set to 0
      previousPosition = position;
      oncollapsedchange?.(true, position);
      collapsed = true;
      position = 0;
      onpositionchange?.(0, 0);
    }
  }

  // Keyboard handler
  function handleKeyDown(event: KeyboardEvent) {
    if (disabled || readonly) return;

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
        delta = currentStep;
        handled = true;
        break;

      case 'ArrowDown':
        if (!isVertical) break;
        delta = -currentStep;
        handled = true;
        break;

      case 'Enter':
        handleToggleCollapse();
        handled = true;
        break;

      case 'Home':
        updatePosition(min);
        handled = true;
        break;

      case 'End':
        updatePosition(max);
        handled = true;
        break;
    }

    if (handled) {
      event.preventDefault();
      if (delta !== 0) {
        updatePosition(position + delta);
      }
    }
  }

  // Pointer handlers
  function handlePointerDown(event: PointerEvent) {
    if (disabled || readonly) return;

    event.preventDefault();
    if (!splitterEl) return;

    if (typeof splitterEl.setPointerCapture === 'function') {
      splitterEl.setPointerCapture(event.pointerId);
    }
    isDragging = true;
    splitterEl.focus();
  }

  function handlePointerMove(event: PointerEvent) {
    if (!isDragging) return;

    if (!containerEl) return;

    // Use demo container for stable measurement if available
    const demoContainer = containerEl.closest('.apg-window-splitter-demo-container') as HTMLElement | null;
    const measureElement = demoContainer || containerEl.parentElement || containerEl;
    const rect = measureElement.getBoundingClientRect();

    let percent: number;
    if (isHorizontal) {
      const x = event.clientX - rect.left;
      percent = (x / rect.width) * 100;
    } else {
      const y = event.clientY - rect.top;
      // For vertical, y position corresponds to primary pane height
      percent = (y / rect.height) * 100;
    }

    // Clamp the percent to min/max
    const clampedPercent = clamp(percent, min, max);

    // Update CSS variable directly for smooth dragging
    if (demoContainer) {
      demoContainer.style.setProperty(
        '--splitter-position',
        `${clampedPercent}%`
      );
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
    isDragging = false;
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
  ></div>
</div>
