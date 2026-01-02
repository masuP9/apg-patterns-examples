import { useCallback, useId, useRef, useState } from 'react';

/**
 * Accordion item configuration
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/accordion/
 */
export interface AccordionItem {
  /** Unique identifier for the item */
  id: string;
  /** Content displayed in the accordion header button */
  header: React.ReactNode;
  /** Content displayed in the collapsible panel */
  content: React.ReactNode;
  /** When true, the item cannot be expanded/collapsed */
  disabled?: boolean;
  /** When true, the panel is expanded on initial render */
  defaultExpanded?: boolean;
}

/**
 * Props for the Accordion component
 *
 * @example
 * ```tsx
 * const items = [
 *   { id: 'section1', header: 'Section 1', content: 'Content 1', defaultExpanded: true },
 *   { id: 'section2', header: 'Section 2', content: 'Content 2' },
 * ];
 *
 * <Accordion
 *   items={items}
 *   headingLevel={3}
 *   allowMultiple={false}
 *   onExpandedChange={(ids) => console.log('Expanded:', ids)}
 * />
 * ```
 */
export interface AccordionProps {
  /**
   * Array of accordion items to display
   * Each item requires an id, header, and content
   */
  items: AccordionItem[];
  /**
   * Allow multiple panels to be expanded simultaneously
   * @default false
   */
  allowMultiple?: boolean;
  /**
   * Heading level for accessibility (h2-h6)
   * Should match the document outline hierarchy
   * @default 3
   */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /**
   * Enable arrow key navigation between accordion headers
   * When enabled: Arrow Up/Down, Home, End keys navigate between headers
   * @default true
   */
  enableArrowKeys?: boolean;
  /**
   * Callback fired when the expanded panels change
   * @param expandedIds - Array of currently expanded item IDs
   */
  onExpandedChange?: (expandedIds: string[]) => void;
  /**
   * Additional CSS class to apply to the accordion container
   * @default ""
   */
  className?: string;
}

export function Accordion({
  items,
  allowMultiple = false,
  headingLevel = 3,
  enableArrowKeys = true,
  onExpandedChange,
  className = '',
}: AccordionProps): React.ReactElement {
  const instanceId = useId();
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Initialize with defaultExpanded items
  const [expandedIds, setExpandedIds] = useState<string[]>(() =>
    items.filter((item) => item.defaultExpanded && !item.disabled).map((item) => item.id)
  );

  const availableItems = items.filter((item) => !item.disabled);

  const handleToggle = useCallback(
    (itemId: string) => {
      const item = items.find((i) => i.id === itemId);
      if (item?.disabled) return;

      let newExpandedIds: string[];
      const isCurrentlyExpanded = expandedIds.includes(itemId);

      if (isCurrentlyExpanded) {
        newExpandedIds = expandedIds.filter((id) => id !== itemId);
      } else {
        if (allowMultiple) {
          newExpandedIds = [...expandedIds, itemId];
        } else {
          newExpandedIds = [itemId];
        }
      }

      setExpandedIds(newExpandedIds);
      onExpandedChange?.(newExpandedIds);
    },
    [expandedIds, allowMultiple, items, onExpandedChange]
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent, currentItemId: string) => {
      if (!enableArrowKeys) return;

      const currentIndex = availableItems.findIndex((item) => item.id === currentItemId);
      if (currentIndex === -1) return;

      let newIndex = currentIndex;
      let shouldPreventDefault = false;

      switch (event.key) {
        case 'ArrowDown':
          // Move to next, but don't wrap (APG compliant)
          if (currentIndex < availableItems.length - 1) {
            newIndex = currentIndex + 1;
          }
          shouldPreventDefault = true;
          break;

        case 'ArrowUp':
          // Move to previous, but don't wrap (APG compliant)
          if (currentIndex > 0) {
            newIndex = currentIndex - 1;
          }
          shouldPreventDefault = true;
          break;

        case 'Home':
          newIndex = 0;
          shouldPreventDefault = true;
          break;

        case 'End':
          newIndex = availableItems.length - 1;
          shouldPreventDefault = true;
          break;
      }

      if (shouldPreventDefault) {
        event.preventDefault();
        if (newIndex !== currentIndex) {
          const newItem = availableItems[newIndex];
          if (newItem && buttonRefs.current[newItem.id]) {
            buttonRefs.current[newItem.id]?.focus();
          }
        }
      }
    },
    [enableArrowKeys, availableItems]
  );

  // Use role="region" only for 6 or fewer panels (APG recommendation)
  const useRegion = items.length <= 6;

  // Dynamic heading component with proper typing
  const HeadingTag = `h${headingLevel}` as 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

  return (
    <div className={`apg-accordion ${className}`.trim()}>
      {items.map((item) => {
        const headerId = `${instanceId}-header-${item.id}`;
        const panelId = `${instanceId}-panel-${item.id}`;
        const isExpanded = expandedIds.includes(item.id);

        const itemClass = `apg-accordion-item ${
          isExpanded ? 'apg-accordion-item--expanded' : ''
        } ${item.disabled ? 'apg-accordion-item--disabled' : ''}`.trim();

        const triggerClass = `apg-accordion-trigger ${
          isExpanded ? 'apg-accordion-trigger--expanded' : ''
        }`.trim();

        const iconClass = `apg-accordion-icon ${
          isExpanded ? 'apg-accordion-icon--expanded' : ''
        }`.trim();

        const panelClass = `apg-accordion-panel ${
          isExpanded ? 'apg-accordion-panel--expanded' : 'apg-accordion-panel--collapsed'
        }`.trim();

        return (
          <div key={item.id} className={itemClass}>
            <HeadingTag className="apg-accordion-header">
              <button
                ref={(el) => {
                  buttonRefs.current[item.id] = el;
                }}
                type="button"
                id={headerId}
                aria-expanded={isExpanded}
                aria-controls={panelId}
                aria-disabled={item.disabled || undefined}
                disabled={item.disabled}
                className={triggerClass}
                onClick={() => handleToggle(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
              >
                <span className="apg-accordion-trigger-content">{item.header}</span>
                <span className={iconClass} aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
            </HeadingTag>
            <div
              role={useRegion ? 'region' : undefined}
              id={panelId}
              aria-labelledby={useRegion ? headerId : undefined}
              className={panelClass}
            >
              <div className="apg-accordion-panel-content">{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
