import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

/**
 * Toolbar context for managing focus state
 */
interface ToolbarContextValue {
  orientation: "horizontal" | "vertical";
}

// Default context value for SSR compatibility
const defaultContext: ToolbarContextValue = {
  orientation: "horizontal",
};

const ToolbarContext = createContext<ToolbarContextValue>(defaultContext);

function useToolbarContext() {
  return useContext(ToolbarContext);
}

/**
 * Props for the Toolbar component
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/
 */
export interface ToolbarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role"> {
  /** Direction of the toolbar */
  orientation?: "horizontal" | "vertical";
  /** Child elements (ToolbarButton, ToolbarToggleButton, ToolbarSeparator) */
  children: React.ReactNode;
}

/**
 * Toolbar container component implementing WAI-ARIA Toolbar pattern
 *
 * @example
 * ```tsx
 * <Toolbar aria-label="Text formatting">
 *   <ToolbarToggleButton>Bold</ToolbarToggleButton>
 *   <ToolbarToggleButton>Italic</ToolbarToggleButton>
 *   <ToolbarSeparator />
 *   <ToolbarButton>Copy</ToolbarButton>
 * </Toolbar>
 * ```
 */
export function Toolbar({
  orientation = "horizontal",
  children,
  className = "",
  onKeyDown,
  ...props
}: ToolbarProps): React.ReactElement {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const getButtons = useCallback((): HTMLButtonElement[] => {
    if (!toolbarRef.current) return [];
    return Array.from(
      toolbarRef.current.querySelectorAll<HTMLButtonElement>(
        "button:not([disabled])"
      )
    );
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const buttons = getButtons();
      if (buttons.length === 0) return;

      const currentIndex = buttons.findIndex(
        (btn) => btn === document.activeElement
      );
      if (currentIndex === -1) return;

      const nextKey = orientation === "vertical" ? "ArrowDown" : "ArrowRight";
      const prevKey = orientation === "vertical" ? "ArrowUp" : "ArrowLeft";
      const invalidKeys =
        orientation === "vertical"
          ? ["ArrowLeft", "ArrowRight"]
          : ["ArrowUp", "ArrowDown"];

      // Ignore invalid direction keys
      if (invalidKeys.includes(event.key)) {
        return;
      }

      let newIndex = currentIndex;
      let shouldPreventDefault = false;

      switch (event.key) {
        case nextKey:
          // No wrap - stop at end
          if (currentIndex < buttons.length - 1) {
            newIndex = currentIndex + 1;
          }
          shouldPreventDefault = true;
          break;

        case prevKey:
          // No wrap - stop at start
          if (currentIndex > 0) {
            newIndex = currentIndex - 1;
          }
          shouldPreventDefault = true;
          break;

        case "Home":
          newIndex = 0;
          shouldPreventDefault = true;
          break;

        case "End":
          newIndex = buttons.length - 1;
          shouldPreventDefault = true;
          break;
      }

      if (shouldPreventDefault) {
        event.preventDefault();
        if (newIndex !== currentIndex) {
          buttons[newIndex].focus();
          setFocusedIndex(newIndex);
        }
      }

      onKeyDown?.(event);
    },
    [orientation, getButtons, onKeyDown]
  );

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      const { target } = event;
      if (!(target instanceof HTMLButtonElement)) return;

      const buttons = getButtons();
      const targetIndex = buttons.findIndex((btn) => btn === target);
      if (targetIndex !== -1) {
        setFocusedIndex(targetIndex);
      }
    },
    [getButtons]
  );

  // Roving tabindex: only the focused button should have tabIndex=0
  useEffect(() => {
    const buttons = getButtons();
    if (buttons.length === 0) return;

    // Clamp focusedIndex to valid range
    const validIndex = Math.min(focusedIndex, buttons.length - 1);
    if (validIndex !== focusedIndex) {
      setFocusedIndex(validIndex);
      return; // Will re-run with corrected index
    }

    buttons.forEach((btn, index) => {
      btn.tabIndex = index === focusedIndex ? 0 : -1;
    });
  }, [focusedIndex, getButtons, children]);

  return (
    <ToolbarContext.Provider value={{ orientation }}>
      <div
        ref={toolbarRef}
        role="toolbar"
        aria-orientation={orientation}
        className={`apg-toolbar ${className}`.trim()}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        {...props}
      >
        {children}
      </div>
    </ToolbarContext.Provider>
  );
}

/**
 * Props for the ToolbarButton component
 */
export interface ToolbarButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "type"> {
  /** Button content */
  children: React.ReactNode;
}

/**
 * Button component for use within a Toolbar
 */
export function ToolbarButton({
  children,
  className = "",
  disabled,
  ...props
}: ToolbarButtonProps): React.ReactElement {
  // Verify we're inside a Toolbar
  useToolbarContext();

  return (
    <button
      type="button"
      className={`apg-toolbar-button ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Props for the ToolbarToggleButton component
 */
export interface ToolbarToggleButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "type" | "aria-pressed"
  > {
  /** Controlled pressed state */
  pressed?: boolean;
  /** Default pressed state (uncontrolled) */
  defaultPressed?: boolean;
  /** Callback when pressed state changes */
  onPressedChange?: (pressed: boolean) => void;
  /** Button content */
  children: React.ReactNode;
}

/**
 * Toggle button component for use within a Toolbar
 */
export function ToolbarToggleButton({
  pressed: controlledPressed,
  defaultPressed = false,
  onPressedChange,
  children,
  className = "",
  disabled,
  onClick,
  ...props
}: ToolbarToggleButtonProps): React.ReactElement {
  // Verify we're inside a Toolbar
  useToolbarContext();

  const [internalPressed, setInternalPressed] = useState(defaultPressed);
  const isControlled = controlledPressed !== undefined;
  const pressed = isControlled ? controlledPressed : internalPressed;

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;

      const newPressed = !pressed;

      if (!isControlled) {
        setInternalPressed(newPressed);
      }

      onPressedChange?.(newPressed);
      onClick?.(event);
    },
    [disabled, pressed, isControlled, onPressedChange, onClick]
  );

  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`apg-toolbar-button ${className}`.trim()}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Props for the ToolbarSeparator component
 */
export interface ToolbarSeparatorProps {
  /** Additional CSS class */
  className?: string;
}

/**
 * Separator component for use within a Toolbar
 */
export function ToolbarSeparator({
  className = "",
}: ToolbarSeparatorProps): React.ReactElement {
  const { orientation } = useToolbarContext();

  // Separator orientation is perpendicular to toolbar orientation
  const separatorOrientation =
    orientation === "horizontal" ? "vertical" : "horizontal";

  return (
    <div
      role="separator"
      aria-orientation={separatorOrientation}
      className={`apg-toolbar-separator ${className}`.trim()}
    />
  );
}
