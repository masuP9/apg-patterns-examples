import { cn } from '@/lib/utils';
import { useCallback } from 'react';

export interface LinkProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'onClick'> {
  /** Link destination URL */
  href?: string;
  /** Link target */
  target?: '_self' | '_blank';
  /** Click handler */
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Link content */
  children: React.ReactNode;
}

export const Link: React.FC<LinkProps> = ({
  href,
  target,
  onClick,
  disabled = false,
  className,
  children,
  ...spanProps
}) => {
  const navigate = useCallback(() => {
    if (!href) {
      return;
    }

    if (target === '_blank') {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = href;
    }
  }, [href, target]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLSpanElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }

      onClick?.(event);

      // Navigate only if onClick didn't prevent the event
      if (!event.defaultPrevented) {
        navigate();
      }
    },
    [disabled, onClick, navigate]
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

      // Only Enter key activates link (NOT Space)
      if (event.key === 'Enter') {
        onClick?.(event);

        // Navigate only if onClick didn't prevent the event
        if (!event.defaultPrevented) {
          navigate();
        }
      }
    },
    [disabled, onClick, navigate]
  );

  return (
    <span
      role="link"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled ? 'true' : undefined}
      className={cn('apg-link', className)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...spanProps}
    >
      {children}
    </span>
  );
};

export default Link;
