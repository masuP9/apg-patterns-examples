import { cn } from '@/lib/utils';
import { useCallback, useRef, useState } from 'react';

export interface SwitchProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'type' | 'role' | 'aria-checked'
> {
  /** Initial checked state */
  initialChecked?: boolean;
  /** Switch label text */
  children?: React.ReactNode;
  /** Callback fired when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
}

const SWIPE_THRESHOLD = 10;

export const Switch: React.FC<SwitchProps> = ({
  initialChecked = false,
  children,
  onCheckedChange,
  className = '',
  disabled,
  ...buttonProps
}) => {
  const [checked, setChecked] = useState(initialChecked);
  const pointerStartX = useRef<number | null>(null);
  const hasSwiped = useRef(false);

  const setCheckedState = useCallback(
    (newChecked: boolean) => {
      if (newChecked !== checked) {
        setChecked(newChecked);
        onCheckedChange?.(newChecked);
      }
    },
    [checked, onCheckedChange]
  );

  const handleClick = useCallback(() => {
    if (disabled || hasSwiped.current) return;
    setCheckedState(!checked);
  }, [checked, setCheckedState, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        setCheckedState(!checked);
      }
    },
    [checked, setCheckedState, disabled]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled) return;
      pointerStartX.current = event.clientX;
      hasSwiped.current = false;
      const target = event.target as HTMLElement;
      target.setPointerCapture?.(event.pointerId);
    },
    [disabled]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (disabled || pointerStartX.current === null) return;
      const deltaX = event.clientX - pointerStartX.current;
      if (Math.abs(deltaX) >= SWIPE_THRESHOLD) {
        hasSwiped.current = true;
        const newChecked = deltaX > 0;
        setCheckedState(newChecked);
        pointerStartX.current = null;
      }
    },
    [disabled, setCheckedState]
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      pointerStartX.current = null;
      const target = event.target as HTMLElement;
      target.releasePointerCapture?.(event.pointerId);
      // Reset hasSwiped after a microtask to allow click handler to check it
      queueMicrotask(() => {
        hasSwiped.current = false;
      });
    },
    []
  );

  return (
    <button
      type="button"
      role="switch"
      {...buttonProps}
      className={cn('apg-switch', className)}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <span className="apg-switch-track">
        <span className="apg-switch-icon" aria-hidden="true">
          <svg viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10.28 2.28a.75.75 0 00-1.06-1.06L4.5 5.94 2.78 4.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l5.25-5.25z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span className="apg-switch-thumb" />
      </span>
      {children && <span className="apg-switch-label">{children}</span>}
    </button>
  );
};

export default Switch;
