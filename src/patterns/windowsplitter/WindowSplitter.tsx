import { clsx } from 'clsx';
import type { CSSProperties } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface SplitterStyle extends CSSProperties {
  '--splitter-position': string;
}

type LabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type WindowSplitterBaseProps = {
  primaryPaneId: string;
  secondaryPaneId?: string;
  defaultPosition?: number;
  defaultCollapsed?: boolean;
  expandedPosition?: number;
  min?: number;
  max?: number;
  step?: number;
  largeStep?: number;
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  collapsible?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  onPositionChange?: (position: number, sizeInPx: number) => void;
  onCollapsedChange?: (collapsed: boolean, previousPosition: number) => void;
  'aria-describedby'?: string;
  'data-testid'?: string;
  className?: string;
  id?: string;
};

export type WindowSplitterProps = WindowSplitterBaseProps & LabelProps;

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(max, Math.max(min, value));
};

const ChevronIcon = ({ d, dx = 0, dy = 0 }: { d: string; dx?: number; dy?: number }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={dx || dy ? { transform: `translate(${dx}px, ${dy}px)` } : undefined}
  >
    <path d={d} />
  </svg>
);

const HOVER_DELAY = 300;
const DISMISS_DELAY = 300;
const ACTIVE_SETTLE_DELAY = 500;
const TAP_DISTANCE_THRESHOLD = 5;
const POPUP_OFFSET = 8;

type PopupState = 'hidden' | 'showing' | 'active';

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
  const initialPosition = defaultCollapsed ? 0 : clamp(defaultPosition, min, max);

  const [position, setPosition] = useState(initialPosition);
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [popupState, setPopupState] = useState<PopupState>('hidden');
  const [popupPos, setPopupPos] = useState<{ x: number; y: number } | null>(null);

  const splitterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const previousPositionRef = useRef<number | null>(defaultCollapsed ? null : initialPosition);
  const positionRef = useRef(initialPosition);

  const isDraggingRef = useRef(false);
  const isMouseOverPopupRef = useRef(false);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeSettleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const hoverPosRef = useRef<{ x: number; y: number } | null>(null);

  const isHorizontal = orientation === 'horizontal';
  const isVertical = orientation === 'vertical';

  const isRTL =
    dir === 'rtl' ||
    (dir === undefined && typeof document !== 'undefined' && document.dir === 'rtl');

  const splitterLabel = ariaLabel || '';

  const icons = isVertical
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
      };

  const clearAllTimers = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    if (activeSettleTimerRef.current) clearTimeout(activeSettleTimerRef.current);
    hoverTimerRef.current = null;
    dismissTimerRef.current = null;
    activeSettleTimerRef.current = null;
  }, []);

  useEffect(() => {
    return () => clearAllTimers();
  }, [clearAllTimers]);

  const calcPopupPosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!splitterRef.current) return null;
      const popupEl = popupRef.current;
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
    },
    [isHorizontal, isVertical]
  );

  const showPopup = useCallback(
    (clientX: number, clientY: number) => {
      if (disabled || readonly) return;
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
      const pos = calcPopupPosition(clientX, clientY);
      if (pos) {
        setPopupPos(pos);
        setPopupState('showing');
      }
    },
    [disabled, readonly, calcPopupPosition]
  );

  const hidePopup = useCallback(() => {
    clearAllTimers();
    setPopupState('hidden');
    setPopupPos(null);
  }, [clearAllTimers]);

  useEffect(() => {
    if (popupState !== 'active') return;
    const handleOutsidePointerDown = (e: PointerEvent) => {
      const popup = popupRef.current;
      if (popup && e.target instanceof Node && !popup.contains(e.target)) {
        hidePopup();
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [popupState, hidePopup]);

  const scheduleDismiss = useCallback(() => {
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current);
    dismissTimerRef.current = setTimeout(() => {
      const splitter = splitterRef.current;
      const popup = popupRef.current;
      const hasFocusInside =
        popup?.contains(document.activeElement) || splitter === document.activeElement;
      if (!hasFocusInside) {
        hidePopup();
      }
    }, DISMISS_DELAY);
  }, [hidePopup]);

  const updatePosition = useCallback(
    (newPosition: number) => {
      const clampedPosition = clamp(newPosition, min, max);
      if (clampedPosition !== positionRef.current) {
        positionRef.current = clampedPosition;
        setPosition(clampedPosition);
        const container = containerRef.current;
        const sizeInPx = container
          ? (clampedPosition / 100) *
            (isHorizontal ? container.offsetWidth : container.offsetHeight)
          : 0;
        onPositionChange?.(clampedPosition, sizeInPx);
      }
    },
    [min, max, isHorizontal, onPositionChange]
  );

  const handlePopupButtonClick = useCallback(
    (delta: number) => {
      if (disabled || readonly) return;
      const currentPos = positionRef.current;
      const newPos = currentPos + delta;
      if (newPos < min || newPos > max) return;
      updatePosition(newPos);
      setPopupState('active');
      if (activeSettleTimerRef.current) clearTimeout(activeSettleTimerRef.current);
      activeSettleTimerRef.current = setTimeout(() => {
        setPopupState((prev) => {
          if (prev === 'active') {
            if (!isMouseOverPopupRef.current) {
              const pos = hoverPosRef.current;
              if (pos) {
                const newPopupPos = calcPopupPosition(pos.x, pos.y);
                if (newPopupPos) setPopupPos(newPopupPos);
              }
            }
            return 'showing';
          }
          return prev;
        });
      }, ACTIVE_SETTLE_DELAY);
    },
    [disabled, readonly, min, max, updatePosition, calcPopupPosition]
  );

  const handleToggleCollapse = useCallback(() => {
    if (!collapsible || disabled || readonly) return;
    const currentPos = positionRef.current;
    if (collapsed) {
      const restorePosition =
        previousPositionRef.current ?? expandedPosition ?? defaultPosition ?? 50;
      const clampedRestore = clamp(restorePosition, min, max);
      onCollapsedChange?.(false, currentPos);
      setCollapsed(false);
      positionRef.current = clampedRestore;
      setPosition(clampedRestore);
      const container = containerRef.current;
      const sizeInPx = container
        ? (clampedRestore / 100) * (isHorizontal ? container.offsetWidth : container.offsetHeight)
        : 0;
      onPositionChange?.(clampedRestore, sizeInPx);
    } else {
      previousPositionRef.current = currentPos;
      onCollapsedChange?.(true, currentPos);
      setCollapsed(true);
      positionRef.current = 0;
      setPosition(0);
      onPositionChange?.(0, 0);
    }
  }, [
    collapsed,
    collapsible,
    disabled,
    readonly,
    expandedPosition,
    defaultPosition,
    min,
    max,
    isHorizontal,
    onCollapsedChange,
    onPositionChange,
  ]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled || readonly) return;

      if (event.key === 'Tab' && !event.shiftKey && popupState !== 'hidden') {
        const firstBtn = popupRef.current?.querySelector<HTMLButtonElement>('button');
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
          updatePosition(positionRef.current + delta);
        }
      }
    },
    [
      disabled,
      readonly,
      popupState,
      isHorizontal,
      isVertical,
      isRTL,
      step,
      largeStep,
      min,
      max,
      handleToggleCollapse,
      updatePosition,
    ]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (disabled || readonly) return;
      event.preventDefault();
      const splitter = splitterRef.current;
      if (!splitter) return;

      pointerStartRef.current = { x: event.clientX, y: event.clientY };
      isDraggingRef.current = false;

      if (typeof splitter.setPointerCapture === 'function') {
        splitter.setPointerCapture(event.pointerId);
      }

      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }

      splitter.focus();
    },
    [disabled, readonly]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const start = pointerStartRef.current;
      if (!start) return;

      if (!isDraggingRef.current) {
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= TAP_DISTANCE_THRESHOLD) {
          isDraggingRef.current = true;
          if (popupState !== 'hidden') hidePopup();
        } else {
          return;
        }
      }

      const container = containerRef.current;
      if (!container) return;

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
        percent = (y / rect.height) * 100;
      }

      const clampedPercent = clamp(percent, min, max);
      if (demoContainer) {
        demoContainer.style.setProperty('--splitter-position', `${clampedPercent}%`);
      }
      updatePosition(percent);
    },
    [isHorizontal, min, max, updatePosition, popupState, hidePopup]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      const splitter = splitterRef.current;
      if (splitter && typeof splitter.releasePointerCapture === 'function') {
        try {
          splitter.releasePointerCapture(event.pointerId);
        } catch {
          // Ignore
        }
      }

      const start = pointerStartRef.current;
      if (start && !isDraggingRef.current) {
        showPopup(start.x, start.y);
      }

      isDraggingRef.current = false;
      pointerStartRef.current = null;
    },
    [showPopup]
  );

  const handleSeparatorMouseEnter = useCallback(
    (event: React.MouseEvent) => {
      if (disabled || readonly || isDraggingRef.current) return;
      hoverPosRef.current = { x: event.clientX, y: event.clientY };
      if (popupState === 'hidden') {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = setTimeout(() => {
          const pos = hoverPosRef.current;
          if (pos) showPopup(pos.x, pos.y);
        }, HOVER_DELAY);
      }
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
        dismissTimerRef.current = null;
      }
    },
    [disabled, readonly, popupState, showPopup]
  );

  const handleSeparatorMouseLeave = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (popupState !== 'hidden') scheduleDismiss();
  }, [popupState, scheduleDismiss]);

  const handleSeparatorMouseMove = useCallback((event: React.MouseEvent) => {
    hoverPosRef.current = { x: event.clientX, y: event.clientY };
  }, []);

  const handleSeparatorFocus = useCallback(() => {
    if (disabled || readonly) return;
    if (popupState === 'hidden') {
      const splitter = splitterRef.current;
      if (splitter) {
        const rect = splitter.getBoundingClientRect();
        showPopup(rect.left + rect.width / 2, rect.top + rect.height / 2);
      }
    }
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, [disabled, readonly, popupState, showPopup]);

  const handleSeparatorBlur = useCallback(() => {
    if (popupState !== 'hidden') {
      setTimeout(() => {
        const popup = popupRef.current;
        const splitter = splitterRef.current;
        if (!popup?.contains(document.activeElement) && splitter !== document.activeElement) {
          scheduleDismiss();
        }
      }, 0);
    }
  }, [popupState, scheduleDismiss]);

  const handlePopupMouseEnter = useCallback(() => {
    isMouseOverPopupRef.current = true;
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const handlePopupMouseLeave = useCallback(() => {
    isMouseOverPopupRef.current = false;
    if (popupState !== 'hidden') scheduleDismiss();
  }, [popupState, scheduleDismiss]);

  const handlePopupKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        hidePopup();
        splitterRef.current?.focus();
      }
      if (event.key === 'Tab' && event.shiftKey) {
        event.preventDefault();
        hidePopup();
        splitterRef.current?.focus();
      }
    },
    [hidePopup]
  );

  const ariaControls = secondaryPaneId ? `${primaryPaneId} ${secondaryPaneId}` : primaryPaneId;

  const isAtMin = position <= min;
  const isAtMax = position >= max;

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
        onMouseEnter={handleSeparatorMouseEnter}
        onMouseLeave={handleSeparatorMouseLeave}
        onMouseMove={handleSeparatorMouseMove}
        onFocus={handleSeparatorFocus}
        onBlur={handleSeparatorBlur}
      />
      {!disabled && !readonly && (
        /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
        <div
          ref={popupRef}
          role="group"
          aria-label={`Adjust ${splitterLabel}`}
          className={clsx(
            'apg-window-splitter__popup',
            popupState !== 'hidden' && 'apg-window-splitter__popup--visible'
          )}
          style={
            popupPos
              ? {
                  left: popupPos.x,
                  top: popupPos.y,
                  flexDirection: isVertical ? ('column' as const) : ('row' as const),
                }
              : undefined
          }
          onMouseEnter={handlePopupMouseEnter}
          onMouseLeave={handlePopupMouseLeave}
          onKeyDown={handlePopupKeyDown}
        >
          <button
            type="button"
            className="apg-window-splitter__popup-button"
            tabIndex={-1}
            aria-label={`Collapse ${splitterLabel}`}
            aria-disabled={isAtMin}
            onClick={() => !isAtMin && handlePopupButtonClick(min - positionRef.current)}
          >
            <ChevronIcon {...icons.collapse} />
          </button>
          <button
            type="button"
            className="apg-window-splitter__popup-button"
            tabIndex={-1}
            aria-label={`Shrink ${splitterLabel}`}
            aria-disabled={isAtMin}
            onClick={() => !isAtMin && handlePopupButtonClick(-step)}
          >
            <ChevronIcon {...icons.shrink} />
          </button>
          <button
            type="button"
            className="apg-window-splitter__popup-button"
            tabIndex={-1}
            aria-label={`Expand ${splitterLabel}`}
            aria-disabled={isAtMax}
            onClick={() => !isAtMax && handlePopupButtonClick(step)}
          >
            <ChevronIcon {...icons.expand} />
          </button>
          <button
            type="button"
            className="apg-window-splitter__popup-button"
            tabIndex={-1}
            aria-label={`Expand ${splitterLabel} to maximum`}
            aria-disabled={isAtMax}
            onClick={() => !isAtMax && handlePopupButtonClick(max - positionRef.current)}
          >
            <ChevronIcon {...icons.max} />
          </button>
        </div>
      )}
    </div>
  );
};
