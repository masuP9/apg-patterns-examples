import { useId, useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

/**
 * Props for the Disclosure component
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * @example
 * ```tsx
 * <Disclosure trigger="Show details">
 *   <p>Hidden content that can be revealed</p>
 * </Disclosure>
 * ```
 */
export interface DisclosureProps {
  /**
   * Content displayed in the disclosure trigger button
   */
  trigger: React.ReactNode;
  /**
   * Content displayed in the collapsible panel
   */
  children: React.ReactNode;
  /**
   * When true, the panel is expanded on initial render
   * @default false
   */
  defaultExpanded?: boolean;
  /**
   * Callback fired when the expanded state changes
   * @param expanded - The new expanded state
   */
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * When true, the disclosure cannot be expanded/collapsed
   * @default false
   */
  disabled?: boolean;
  /**
   * Additional CSS class to apply to the disclosure container
   * @default ""
   */
  className?: string;
}

export function Disclosure({
  trigger,
  children,
  defaultExpanded = false,
  onExpandedChange,
  disabled = false,
  className = '',
}: DisclosureProps): React.ReactElement {
  const instanceId = useId();
  const panelId = `${instanceId}-panel`;

  const [expanded, setExpanded] = useState(defaultExpanded);

  const handleToggle = useCallback(() => {
    if (disabled) return;

    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  }, [expanded, disabled, onExpandedChange]);

  return (
    <div className={cn('apg-disclosure', className)}>
      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={panelId}
        disabled={disabled}
        className="apg-disclosure-trigger"
        onClick={handleToggle}
      >
        <span className="apg-disclosure-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </span>
        <span className="apg-disclosure-trigger-content">{trigger}</span>
      </button>
      <div
        id={panelId}
        className="apg-disclosure-panel"
        aria-hidden={!expanded}
        inert={!expanded ? true : undefined}
      >
        <div className="apg-disclosure-panel-content">{children}</div>
      </div>
    </div>
  );
}

export default Disclosure;
