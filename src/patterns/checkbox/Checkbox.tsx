import { cn } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface CheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  /** Initial checked state */
  initialChecked?: boolean;
  /** Indeterminate (mixed) state */
  indeterminate?: boolean;
  /** Callback when checked state changes */
  onCheckedChange?: (checked: boolean) => void;
  /** Test ID for wrapper element */
  'data-testid'?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  initialChecked = false,
  indeterminate = false,
  onCheckedChange,
  className,
  disabled,
  'data-testid': dataTestId,
  ...inputProps
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [checked, setChecked] = useState(initialChecked);
  const [isIndeterminate, setIsIndeterminate] = useState(indeterminate);

  // Update indeterminate property on the input element
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  // Sync with prop changes
  useEffect(() => {
    setIsIndeterminate(indeterminate);
  }, [indeterminate]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = event.target.checked;
      setChecked(newChecked);
      setIsIndeterminate(false);
      onCheckedChange?.(newChecked);
    },
    [onCheckedChange]
  );

  return (
    <span className={cn('apg-checkbox', className)} data-testid={dataTestId}>
      <input
        ref={inputRef}
        type="checkbox"
        className="apg-checkbox-input"
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        {...inputProps}
      />
      <span className="apg-checkbox-control" aria-hidden="true">
        <span className="apg-checkbox-icon apg-checkbox-icon--check">
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 3L4.5 8.5L2 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="apg-checkbox-icon apg-checkbox-icon--indeterminate">
          <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 6H9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </span>
    </span>
  );
};

export default Checkbox;
