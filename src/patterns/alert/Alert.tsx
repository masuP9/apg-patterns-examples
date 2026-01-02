import { cn } from "@/lib/utils";
import { Info, CircleCheck, AlertTriangle, OctagonAlert, X } from "lucide-react";
import { useId, type ReactNode } from "react";
import { type AlertVariant, variantStyles } from "./alert-config";

export type { AlertVariant };

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "role" | "children"> {
  /**
   * Alert message content.
   * Changes to this prop trigger screen reader announcements.
   */
  message?: string;
  /**
   * Optional children for complex content.
   * Use message prop for simple text alerts.
   */
  children?: ReactNode;
  /**
   * Alert variant for visual styling.
   * Does NOT affect ARIA - all variants use role="alert"
   */
  variant?: AlertVariant;
  /**
   * Custom ID for the alert container.
   * Useful for SSR/hydration consistency.
   */
  id?: string;
  /**
   * Whether to show dismiss button.
   * Note: Manual dismiss only - NO auto-dismiss per WCAG 2.2.3
   */
  dismissible?: boolean;
  /**
   * Callback when alert is dismissed.
   * Should clear the message to hide the alert content.
   */
  onDismiss?: () => void;
}

const variantIcons: Record<AlertVariant, React.ReactNode> = {
  info: <Info className="size-5" />,
  success: <CircleCheck className="size-5" />,
  warning: <AlertTriangle className="size-5" />,
  error: <OctagonAlert className="size-5" />,
};

/**
 * Alert component following WAI-ARIA APG Alert Pattern
 *
 * IMPORTANT: The live region container (role="alert") is always present in the DOM.
 * Only the content inside changes dynamically - NOT the container itself.
 * This ensures screen readers properly announce alert messages.
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/alert/
 */
export const Alert: React.FC<AlertProps> = ({
  message,
  children,
  variant = "info",
  id: providedId,
  className,
  dismissible = false,
  onDismiss,
  ...restProps
}) => {
  const generatedId = useId();
  const alertId = providedId ?? `alert-${generatedId}`;

  const content = message || children;
  const hasContent = Boolean(content);

  return (
    <div
      className={cn(
        "apg-alert",
        hasContent && [
          "relative flex items-start gap-3 px-4 py-3 rounded-lg border",
          "transition-colors duration-150",
          variantStyles[variant],
        ],
        !hasContent && "contents",
        className
      )}
      {...restProps}
    >
      {/* Live region - contains only content for screen reader announcement */}
      <div
        id={alertId}
        role="alert"
        className={cn(
          hasContent && "flex-1 flex items-start gap-3",
          !hasContent && "contents"
        )}
      >
        {hasContent && (
          <>
            <span className="apg-alert-icon flex-shrink-0 mt-0.5" aria-hidden="true">
              {variantIcons[variant]}
            </span>
            <span className="apg-alert-content flex-1">{content}</span>
          </>
        )}
      </div>
      {/* Dismiss button - outside live region to avoid SR announcing it as part of alert */}
      {hasContent && dismissible && (
        <button
          type="button"
          className={cn(
            "apg-alert-dismiss",
            "flex-shrink-0 min-w-11 min-h-11 p-2 -m-2 rounded",
            "flex items-center justify-center",
            "hover:bg-black/10 dark:hover:bg-white/10",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
          )}
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default Alert;
