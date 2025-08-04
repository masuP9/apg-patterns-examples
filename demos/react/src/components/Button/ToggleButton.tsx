import React, { useCallback, useState } from "react";

export interface ToggleButtonProps 
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onClick" | "onKeyUp" | "type" | "aria-pressed"> {
  /** Initial pressed state */
  initialPressed?: boolean;
  /** Button label text */
  children: React.ReactNode;
  /** Callback fired when toggle state changes */
  onToggle?: (pressed: boolean) => void;
}

export function ToggleButton({
  initialPressed = false,
  children,
  onToggle,
  className = "",
  ...buttonProps
}: ToggleButtonProps): JSX.Element {
  const [pressed, setPressed] = useState(initialPressed);

  const handleClick = useCallback(() => {
    if (buttonProps.disabled) return;

    const newPressed = !pressed;
    setPressed(newPressed);
    onToggle?.(newPressed);
  }, [pressed, buttonProps.disabled, onToggle]);

  const handleKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle Space and Enter keys according to APG specification
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault(); // Prevent default behavior (scrolling for space)
        handleClick();
      }
    },
    [handleClick]
  );

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
      onKeyUp={handleKeyUp}
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
}

export default ToggleButton;
