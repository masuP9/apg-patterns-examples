import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import { useCallback, useRef, useState } from 'react';

// CSS custom properties type for splitter position
interface SplitterStyle extends CSSProperties {
  '--splitter-position': string;
}

// Label: one of these required (exclusive)
type LabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type WindowSplitterBaseProps = {
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
  onPositionChange?: (position: number, sizeInPx: number) => void;

  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean, previousPosition: number) => void;

  /** Reference to help text */
  'aria-describedby'?: string;

  /** Test id for testing */
  'data-testid'?: string;

  className?: string;
  id?: string;
};

export type WindowSplitterProps = WindowSplitterBaseProps & LabelProps;

// Clamp value to min/max range
const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

export const WindowSplitter: React.FC<WindowSplitterProps> = ({
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
  onPositionChange,
  onCollapsedChange,
  'aria-describedby': ariaDescribedby,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledby,
  'data-testid': dataTestid,
  className,
  id,
}) => {
  // Calculate initial position: clamp to valid range, or 0 if collapsed
  const initialPosition = defaultCollapsed ? 0 : clamp(defaultPosition, min, max);

  const [position, setPosition] = useState(initialPosition);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const splitterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPositionRef = useRef<number | null>(defaultCollapsed ? null : initialPosition);

  const isHorizontal = orientation === 'horizontal';
  const isVertical = orientation === 'vertical';

  // Determine RTL mode
  const isRTL =
    dir === 'rtl' ||
    (dir === undefined && typeof document !== 'undefined' && document.dir === 'rtl');

  // Update position and call callback
  const updatePosition = useCallback(
    (newPosition: number) => {
      const clampedPosition = clamp(newPosition, min, max);
      if (clampedPosition !== position) {
        setPosition(clampedPosition);

        // Calculate size in px (approximation, actual calculation needs container)
        const container = containerRef.current;
        const sizeInPx = container
          ? (clampedPosition / 100) *
          (isHorizontal ? container.offsetWidth : container.offsetHeight)
          : 0;

        onPositionChange?.(clampedPosition, sizeInPx);
      }
    },
    [position, min, max, isHorizontal, onPositionChange]
  );

  // Handle collapse/expand
  const handleToggleCollapse = useCallback(() => {
    if (!collapsible || disabled || readonly) return;

    if (collapsed) {
      // Expand: restore to previous or fallback
      const restorePosition =
        previousPositionRef.current ?? expandedPosition ?? defaultPosition ?? 50;
      const clampedRestore = clamp(restorePosition, min, max);

      onCollapsedChange?.(false, position);
      setCollapsed(false);
      setPosition(clampedRestore);

      const container = containerRef.current;
      const sizeInPx = container
        ? (clampedRestore / 100) * (isHorizontal ? container.offsetWidth : container.offsetHeight)
        : 0;
      onPositionChange?.(clampedRestore, sizeInPx);
    } else {
      // Collapse: save current position, set to 0
      previousPositionRef.current = position;
      onCollapsedChange?.(true, position);
      setCollapsed(true);
      setPosition(0);
      onPositionChange?.(0, 0);
    }
  }, [
    collapsed,
    collapsible,
    disabled,
    readonly,
    position,
    expandedPosition,
    defaultPosition,
    min,
    max,
    isHorizontal,
    onCollapsedChange,
    onPositionChange,
  ]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || readonly) return;

      const hasShift = event.shiftKey;
      const currentStep = hasShift ? largeStep : step;

      let delta = 0;
      let handled = false;

      switch (event.key) {
        // Horizontal splitter: ArrowLeft/Right only
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

        // Vertical splitter: ArrowUp/Down only
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

        // Collapse/Expand
        case 'Enter':
          handleToggleCollapse();
          handled = true;
          break;

        // Home/End
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
    },
    [
      disabled,
      readonly,
      isHorizontal,
      isVertical,
      isRTL,
      step,
      largeStep,
      position,
      min,
      max,
      handleToggleCollapse,
      updatePosition,
    ]
  );

  // Pointer handlers
  const isDraggingRef = useRef(false);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (disabled || readonly) return;

      event.preventDefault();
      const splitter = splitterRef.current;
      if (!splitter) return;

      if (typeof splitter.setPointerCapture === 'function') {
        splitter.setPointerCapture(event.pointerId);
      }
      isDraggingRef.current = true;
      splitter.focus();
    },
    [disabled, readonly]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      if (!isDraggingRef.current) return;

      const container = containerRef.current;
      if (!container) return;

      // Use demo container for stable measurement if available
      const demoContainerElement = container.closest('.apg-window-splitter-demo-container');
      const demoContainer =
        demoContainerElement instanceof HTMLElement ? demoContainerElement : null;
      const measureElement = demoContainer || container.parentElement || container;
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
        demoContainer.style.setProperty('--splitter-position', `${clampedPercent}%`);
      }

      updatePosition(percent);
    },
    [isHorizontal, min, max, updatePosition]
  );

  const handlePointerUp = useCallback((event: React.PointerEvent) => {
    const splitter = splitterRef.current;
    if (splitter && typeof splitter.releasePointerCapture === 'function') {
      try {
        splitter.releasePointerCapture(event.pointerId);
      } catch {
        // Ignore if pointer capture was not set
      }
    }
    isDraggingRef.current = false;
  }, []);

  // Compute aria-controls
  const ariaControls = secondaryPaneId ? `${primaryPaneId} ${secondaryPaneId}` : primaryPaneId;

  return (
    <div
      ref={containerRef}
      className={clsx(
        'apg-window-splitter',
        isVertical && 'apg-window-splitter--vertical',
        disabled && 'apg-window-splitter--disabled',
        className
      )}
      style={{ '--splitter-position': `${position}%` } satisfies SplitterStyle}
    >
      {/* role=separator as a interactive element when is focusable */}
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
      <div
        ref={splitterRef}
        role="separator"
        id={id}
        tabIndex={disabled ? -1 : 0}
        aria-valuenow={position}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-controls={ariaControls}
        aria-orientation={isVertical ? 'vertical' : undefined}
        aria-disabled={disabled ? true : undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        data-testid={dataTestid}
        className="apg-window-splitter__separator"
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
};
