import { useCallback, useState } from "react";

export interface ToggleButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "onClick" | "type" | "aria-pressed" | "onToggle"
  > {
  /** Initial pressed state */
  initialPressed?: boolean;
  /** Button label text */
  children: React.ReactNode;
  /** Callback fired when toggle state changes */
  onPressedChange?: (pressed: boolean) => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  initialPressed = false,
  children,
  onPressedChange,
  className = "",
  ...buttonProps
}) => {
  const [pressed, setPressed] = useState(initialPressed);

  const handleClick = useCallback(() => {
    setPressed(!pressed);
    onPressedChange?.(!pressed);
  }, [pressed, onPressedChange]);

  // Build CSS classes
  const stateClass = pressed
    ? "apg-toggle-button--pressed"
    : "apg-toggle-button--not-pressed";

  return (
    <button
      type="button"
      {...buttonProps}
      className={`apg-toggle-button ${stateClass} ${className}`.trim()}
      aria-pressed={pressed}
      onClick={handleClick}
    >
      <span className="apg-toggle-button-content">{children}</span>
      <span
        className={`apg-toggle-indicator ${
          pressed
            ? "apg-toggle-indicator--pressed"
            : "apg-toggle-indicator--not-pressed"
        }`}
        aria-hidden="true"
      >
        {pressed ? "●" : "○"}
      </span>
    </button>
  );
};

export default ToggleButton;
