import { cn } from '@/lib/utils';

/**
 * Represents a single item in the breadcrumb trail
 */
export interface BreadcrumbItem {
  /**
   * Display text for the breadcrumb item
   */
  label: string;
  /**
   * URL for the breadcrumb link. If omitted, renders as non-interactive text.
   */
  href?: string;
}

/**
 * Props for the Breadcrumb component
 *
 * @see https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Current Page' }
 *   ]}
 * />
 * ```
 */
export interface BreadcrumbProps {
  /**
   * Array of breadcrumb items representing the navigation path
   */
  items: BreadcrumbItem[];
  /**
   * Accessible label for the navigation landmark
   * @default "Breadcrumb"
   */
  ariaLabel?: string;
  /**
   * Additional CSS class to apply to the nav element
   */
  className?: string;
}

export function Breadcrumb({
  items,
  ariaLabel = 'Breadcrumb',
  className,
}: BreadcrumbProps): React.ReactElement | null {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label={ariaLabel} className={cn('apg-breadcrumb', className)}>
      <ol className="apg-breadcrumb-list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const key = `${item.href ?? 'current'}-${item.label}`;

          return (
            <li key={key} className="apg-breadcrumb-item">
              {item.href && !isLast ? (
                <a href={item.href} className="apg-breadcrumb-link">
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="apg-breadcrumb-current">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
