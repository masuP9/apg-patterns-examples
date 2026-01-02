import { cn } from '@/lib/utils';
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  /** Tooltip content */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state (uncontrolled) */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Delay before showing tooltip (ms) */
  delay?: number;
  /** Tooltip placement */
  placement?: TooltipPlacement;
  /** Custom tooltip ID for SSR */
  id?: string;
  /** Whether the tooltip is disabled */
  disabled?: boolean;
  /** Additional class name for the wrapper */
  className?: string;
  /** Additional class name for the tooltip content */
  tooltipClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delay = 300,
  placement = 'top',
  id: providedId,
  disabled = false,
  className,
  tooltipClassName,
}) => {
  const generatedId = useId();
  const tooltipId = providedId ?? `tooltip-${generatedId}`;

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setInternalOpen(value);
      }
      onOpenChange?.(value);
    },
    [isControlled, onOpenChange]
  );

  const showTooltip = useCallback(() => {
    if (disabled) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
    }, delay);
  }, [delay, disabled, setOpen]);

  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setOpen(false);
  }, [setOpen]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideTooltip();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, hideTooltip]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const placementClasses: Record<TooltipPlacement, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <span
      ref={triggerRef}
      className={cn('apg-tooltip-trigger', 'relative inline-block', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      aria-describedby={isOpen && !disabled ? tooltipId : undefined}
    >
      {children}
      <span
        ref={tooltipRef}
        id={tooltipId}
        role="tooltip"
        aria-hidden={!isOpen}
        className={cn(
          'apg-tooltip',
          'absolute z-50 px-3 py-1.5 text-sm',
          'rounded-md bg-gray-900 text-white shadow-lg',
          'dark:bg-gray-100 dark:text-gray-900',
          'pointer-events-none whitespace-nowrap',
          'transition-opacity duration-150',
          placementClasses[placement],
          isOpen ? 'visible opacity-100' : 'invisible opacity-0',
          tooltipClassName
        )}
      >
        {content}
      </span>
    </span>
  );
};

export default Tooltip;
