import { cn } from '@/lib/utils';
import { useCallback, useRef } from 'react';

export interface ButtonProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  /** Click handler */
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Button content */
  children: React.ReactNode;
}

/**
 * Custom Button using role="button"
 *
 * This component demonstrates how to implement a custom button using ARIA.
 * For production use, prefer the native <button> element which provides
 * all accessibility features automatically.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/button/
 */
export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  className,
  children,
  ...spanProps
}) => {
  // Track if Space was pressed on this element (for keyup activation)
  const spacePressed = useRef(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (disabled) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      onClick?.(event);
    },
    [disabled, onClick]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      // Ignore if composing (IME input) or already handled
      if (event.nativeEvent.isComposing || event.defaultPrevented) {
        return;
      }

      if (disabled) {
        return;
      }

      // Space: prevent scroll on keydown, activate on keyup (native button behavior)
      if (event.key === ' ') {
        event.preventDefault();
        spacePressed.current = true;
        return;
      }

      // Enter: activate on keydown (native button behavior)
      if (event.key === 'Enter') {
        event.preventDefault();
        event.currentTarget.click();
      }
    },
    [disabled]
  );

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLSpanElement>) => {
      // Space: activate on keyup if Space was pressed on this element
      if (event.key === ' ' && spacePressed.current) {
        spacePressed.current = false;

        if (disabled) {
          return;
        }

        event.preventDefault();
        event.currentTarget.click();
      }
    },
    [disabled]
  );

  return (
    <span
      {...spanProps}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled ? 'true' : undefined}
      className={cn('apg-button', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      {children}
    </span>
  );
};

export default Button;
