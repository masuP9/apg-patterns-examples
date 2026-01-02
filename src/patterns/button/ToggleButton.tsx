import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';

export interface ToggleButtonProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'type' | 'aria-pressed' | 'onToggle'
> {
  /** Initial pressed state */
  initialPressed?: boolean;
  /** Button label text */
  children: React.ReactNode;
  /** Callback fired when toggle state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Custom indicator for pressed state (default: "●") */
  pressedIndicator?: React.ReactNode;
  /** Custom indicator for unpressed state (default: "○") */
  unpressedIndicator?: React.ReactNode;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  initialPressed = false,
  children,
  onPressedChange,
  pressedIndicator = '●',
  unpressedIndicator = '○',
  className = '',
  ...buttonProps
}) => {
  const [pressed, setPressed] = useState(initialPressed);

  const handleClick = useCallback(() => {
    setPressed(!pressed);
    onPressedChange?.(!pressed);
  }, [pressed, onPressedChange]);

  return (
    <button
      type="button"
      {...buttonProps}
      className={cn('apg-toggle-button', className)}
      aria-pressed={pressed}
      onClick={handleClick}
    >
      <span className="apg-toggle-button-content">{children}</span>
      <span className="apg-toggle-indicator" aria-hidden="true">
        {pressed ? pressedIndicator : unpressedIndicator}
      </span>
    </button>
  );
};

export default ToggleButton;
