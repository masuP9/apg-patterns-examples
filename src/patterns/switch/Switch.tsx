import { cn } from '@/lib/utils';
import { useCallback, useState } from 'react';

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

export const Switch: React.FC<SwitchProps> = ({
  initialChecked = false,
  children,
  onCheckedChange,
  className = '',
  disabled,
  ...buttonProps
}) => {
  const [checked, setChecked] = useState(initialChecked);

  const handleClick = useCallback(() => {
    if (disabled) return;
    const newChecked = !checked;
    setChecked(newChecked);
    onCheckedChange?.(newChecked);
  }, [checked, onCheckedChange, disabled]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        const newChecked = !checked;
        setChecked(newChecked);
        onCheckedChange?.(newChecked);
      }
    },
    [checked, onCheckedChange, disabled]
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
