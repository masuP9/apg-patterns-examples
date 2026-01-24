import { cn } from '@/lib/utils';
import {
  buildPatternUrl,
  getLocaleFromDocument,
  getPreferredFramework,
  type Locale,
} from '@/lib/pattern-search';
import { getPatterns, type Pattern } from '@/lib/patterns';
import { getPatternDescription } from '@/i18n/patterns';
import type { KeyboardEvent, ReactElement } from 'react';
import { Search } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';

export interface PatternSearchProps {
  /** Placeholder text */
  placeholder?: string;
  /** Label for screen readers */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

export function PatternSearch({
  placeholder = 'Search patterns...',
  label = 'Search patterns',
  className,
}: PatternSearchProps): ReactElement {
  const instanceId = useId();
  const inputId = `${instanceId}-input`;
  const labelId = `${instanceId}-label`;
  const listboxId = `${instanceId}-listbox`;

  // State
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [locale] = useState<Locale>(() => getLocaleFromDocument());
  const [isMac, setIsMac] = useState(true); // Default to Mac to avoid hydration mismatch

  // Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  // Get available patterns
  const patterns = useMemo(() => getPatterns(), []);

  // Filter patterns based on query
  const filteredPatterns = useMemo(() => {
    if (!query.trim()) {
      return patterns;
    }

    const lowerQuery = query.toLowerCase();
    return patterns.filter(
      (pattern) =>
        pattern.name.toLowerCase().includes(lowerQuery) ||
        pattern.description.toLowerCase().includes(lowerQuery)
    );
  }, [patterns, query]);

  // Group patterns alphabetically and get sorted keys
  const { groupedPatterns, groupKeys } = useMemo(() => {
    const groups: Record<string, Pattern[]> = {};
    for (const pattern of filteredPatterns) {
      const firstLetter = pattern.name[0].toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(pattern);
    }
    // Sort keys alphabetically
    const sortedKeys = Object.keys(groups).sort();
    return { groupedPatterns: groups, groupKeys: sortedKeys };
  }, [filteredPatterns]);

  // Flat list for keyboard navigation (sorted to match visual order)
  const flatPatterns = useMemo(() => {
    return groupKeys.flatMap((key) => groupedPatterns[key] ?? []);
  }, [groupedPatterns, groupKeys]);

  // Get option ID
  const getOptionId = useCallback(
    (patternId: string) => `${instanceId}-option-${patternId}`,
    [instanceId]
  );

  // Get active descendant ID
  const activeDescendantId = useMemo(() => {
    if (activeIndex < 0 || activeIndex >= flatPatterns.length) {
      return undefined;
    }
    const pattern = flatPatterns[activeIndex];
    return pattern ? getOptionId(pattern.id) : undefined;
  }, [activeIndex, flatPatterns, getOptionId]);

  // Navigate to pattern
  const navigateToPattern = useCallback(
    (pattern: Pattern) => {
      const framework = getPreferredFramework();
      const url = buildPatternUrl(pattern.id, framework, locale);
      window.location.assign(url);
    },
    [locale]
  );

  // Open popup
  const openPopup = useCallback(() => {
    if (!isOpen) {
      setIsOpen(true);
      setActiveIndex(-1);
    }
  }, [isOpen]);

  // Close popup
  const closePopup = useCallback((restoreQuery = false) => {
    setIsOpen(false);
    setActiveIndex(-1);
    if (restoreQuery) {
      setQuery('');
    }
  }, []);

  // Handle input change
  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setQuery(value);
      if (!isOpen) {
        openPopup();
      }
      setActiveIndex(-1);
    },
    [isOpen, openPopup]
  );

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;

      switch (key) {
        case 'ArrowDown': {
          event.preventDefault();
          if (!isOpen) {
            openPopup();
            if (flatPatterns.length > 0) {
              setActiveIndex(0);
            }
            return;
          }
          setActiveIndex((prev) => {
            if (prev < flatPatterns.length - 1) {
              return prev + 1;
            }
            return prev;
          });
          break;
        }
        case 'ArrowUp': {
          event.preventDefault();
          if (!isOpen) {
            openPopup();
            if (flatPatterns.length > 0) {
              setActiveIndex(flatPatterns.length - 1);
            }
            return;
          }
          setActiveIndex((prev) => {
            if (prev > 0) {
              return prev - 1;
            }
            return prev;
          });
          break;
        }
        case 'Home': {
          if (!isOpen) {
            return;
          }
          event.preventDefault();
          if (flatPatterns.length > 0) {
            setActiveIndex(0);
          }
          break;
        }
        case 'End': {
          if (!isOpen) {
            return;
          }
          event.preventDefault();
          if (flatPatterns.length > 0) {
            setActiveIndex(flatPatterns.length - 1);
          }
          break;
        }
        case 'Enter': {
          if (!isOpen) {
            return;
          }
          event.preventDefault();
          if (activeIndex >= 0 && activeIndex < flatPatterns.length) {
            const pattern = flatPatterns[activeIndex];
            if (pattern) {
              navigateToPattern(pattern);
            }
          } else if (flatPatterns.length > 0) {
            // Select first item if none active
            const pattern = flatPatterns[0];
            if (pattern) {
              navigateToPattern(pattern);
            }
          }
          break;
        }
        case 'Escape': {
          if (!isOpen) {
            return;
          }
          event.preventDefault();
          closePopup(true);
          break;
        }
        case 'Tab': {
          if (isOpen) {
            closePopup();
          }
          break;
        }
      }
    },
    [isOpen, flatPatterns, activeIndex, openPopup, closePopup, navigateToPattern]
  );

  // Handle option click
  const handleOptionClick = useCallback(
    (pattern: Pattern) => {
      navigateToPattern(pattern);
    },
    [navigateToPattern]
  );

  // Handle option mouse enter
  const handleOptionMouseEnter = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  // Handle focus
  const handleFocus = useCallback(() => {
    openPopup();
  }, [openPopup]);

  // Click outside to close
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const container = containerRef.current;
      if (container && event.target instanceof Node && !container.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closePopup]);

  // Global keyboard shortcut (Cmd/Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        openPopup();
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [openPopup]);

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex < 0 || !isOpen) {
      return;
    }

    const pattern = flatPatterns[activeIndex];
    if (!pattern) {
      return;
    }

    const optionElement = document.getElementById(getOptionId(pattern.id));
    if (optionElement && listboxRef.current) {
      optionElement.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex, isOpen, flatPatterns, getOptionId]);

  // Reset active index when filtered patterns change
  useEffect(() => {
    if (activeIndex >= flatPatterns.length) {
      setActiveIndex(flatPatterns.length > 0 ? 0 : -1);
    }
  }, [activeIndex, flatPatterns.length]);

  // Detect platform for keyboard shortcut display
  useEffect(() => {
    const platform = navigator.platform?.toLowerCase() ?? '';
    const userAgent = navigator.userAgent?.toLowerCase() ?? '';
    const isMacPlatform = platform.includes('mac') || userAgent.includes('macintosh');
    setIsMac(isMacPlatform);
  }, []);

  return (
    <div ref={containerRef} className={cn('pattern-search relative', className)}>
      <label id={labelId} htmlFor={inputId} className="sr-only">
        {label}
      </label>
      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          role="combobox"
          className={cn(
            'bg-background border-input placeholder:text-muted-foreground focus-visible:ring-foreground',
            'flex h-9 w-full rounded-md border py-2 pr-3 pl-9 text-sm',
            'focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-labelledby={labelId}
          aria-activedescendant={activeDescendantId}
          value={query}
          placeholder={placeholder}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
        />
        <kbd
          className={cn(
            'pointer-events-none absolute top-1/2 right-2 -translate-y-1/2',
            'bg-muted text-muted-foreground hidden h-5 items-center gap-0.5 rounded border px-1.5 font-mono text-[10px] font-medium select-none sm:flex'
          )}
        >
          {isMac ? (
            <>
              <span className="text-xs">⌘</span>
              <span>K</span>
            </>
          ) : (
            <span>Ctrl+K</span>
          )}
        </kbd>
      </div>
      {/* Empty state - outside listbox for valid ARIA structure */}
      {isOpen && flatPatterns.length === 0 && (
        <div
          className="bg-popover text-popover-foreground absolute z-50 mt-1 w-full rounded-md border p-1 shadow-md sm:min-w-80"
          role="status"
          aria-live="polite"
        >
          <div className="text-muted-foreground px-2 py-4 text-center text-sm">
            No patterns found
          </div>
        </div>
      )}
      <ul
        ref={listboxRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={labelId}
        className={cn(
          'bg-popover text-popover-foreground absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-md border p-1 shadow-md sm:min-w-80',
          (!isOpen || flatPatterns.length === 0) && 'hidden'
        )}
      >
        {groupKeys.map((letter) => {
          const patterns = groupedPatterns[letter];
          if (!patterns) return null;

          return (
            <li key={letter} role="presentation">
              <div className="text-muted-foreground px-2 py-1.5 text-xs font-semibold">
                {letter}
              </div>
              <ul role="group" aria-label={`Patterns starting with ${letter}`}>
                {patterns.map((pattern) => {
                  const globalIndex = flatPatterns.findIndex((p) => p.id === pattern.id);
                  const isActive = globalIndex === activeIndex;

                  return (
                    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- keyboard handled on combobox input via aria-activedescendant
                    <li
                      key={pattern.id}
                      id={getOptionId(pattern.id)}
                      role="option"
                      aria-selected={isActive}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-sm px-2 py-2',
                        'hover:bg-accent hover:text-accent-foreground',
                        isActive && 'bg-accent text-accent-foreground'
                      )}
                      onClick={() => handleOptionClick(pattern)}
                      onMouseEnter={() => handleOptionMouseEnter(globalIndex)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span className="bg-muted flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-lg">
                        {pattern.icon}
                      </span>
                      <div className="flex-1 overflow-hidden">
                        <div className="font-medium">{pattern.name}</div>
                        <div className="text-muted-foreground line-clamp-1 text-xs">
                          {getPatternDescription(pattern.id, pattern.description, locale)}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default PatternSearch;
