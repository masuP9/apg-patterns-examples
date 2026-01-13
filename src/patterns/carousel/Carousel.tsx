import { useCallback, useEffect, useId, useRef, useState } from 'react';

export interface CarouselSlide {
  /** Unique identifier for the slide */
  id: string;
  /** Slide content (JSX or string) */
  content: React.ReactNode;
  /** Accessible label for the slide */
  label?: string;
}

export interface CarouselProps {
  /** Array of slides */
  slides: CarouselSlide[];
  /** Accessible label for the carousel (required) */
  'aria-label': string;
  /** Initial slide index (0-based) */
  initialSlide?: number;
  /** Enable auto-rotation */
  autoRotate?: boolean;
  /** Rotation interval in milliseconds (default: 5000) */
  rotationInterval?: number;
  /** Callback when slide changes */
  onSlideChange?: (index: number) => void;
  /** Additional CSS class */
  className?: string;
  /** Test ID for E2E testing */
  'data-testid'?: string;
}

export function Carousel({
  slides,
  'aria-label': ariaLabel,
  initialSlide = 0,
  autoRotate = false,
  rotationInterval = 5000,
  onSlideChange,
  className = '',
  'data-testid': testId,
}: CarouselProps): React.ReactElement {
  // Validate initialSlide - fallback to 0 if out of bounds
  const validInitialSlide = initialSlide >= 0 && initialSlide < slides.length ? initialSlide : 0;

  const [currentSlide, setCurrentSlide] = useState(validInitialSlide);
  const [focusedIndex, setFocusedIndex] = useState(validInitialSlide);

  // Transition animation state
  const [exitingSlide, setExitingSlide] = useState<number | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<'next' | 'prev' | null>(null);

  // New state model: separate user intent from temporary pause
  const [autoRotateMode, setAutoRotateMode] = useState(() => {
    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        return false;
      }
    }
    return autoRotate;
  });
  const [isPausedByInteraction, setIsPausedByInteraction] = useState(false);

  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const tablistRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentSlideRef = useRef(currentSlide);

  const carouselId = useId();
  const slidesContainerId = `${carouselId}-slides`;

  // Computed: actual rotation state
  const isActuallyRotating = autoRotateMode && !isPausedByInteraction;

  // Handle slide change with animation
  const goToSlide = useCallback(
    (index: number) => {
      if (slides.length < 2) return;
      const newIndex = ((index % slides.length) + slides.length) % slides.length;
      if (newIndex === currentSlide) return;

      // Determine direction based on index change
      // Special case for wrap-around
      const isWrapForward = currentSlide === slides.length - 1 && newIndex === 0;
      const isWrapBackward = currentSlide === 0 && newIndex === slides.length - 1;
      const direction =
        isWrapForward || (!isWrapBackward && newIndex > currentSlide) ? 'next' : 'prev';

      // Start transition
      setExitingSlide(currentSlide);
      setTransitionDirection(direction);
      setCurrentSlide(newIndex);
      setFocusedIndex(newIndex);
      onSlideChange?.(newIndex);

      // Clean up after animation
      animationTimeoutRef.current = setTimeout(() => {
        setExitingSlide(null);
        setTransitionDirection(null);
        animationTimeoutRef.current = null;
      }, 300); // Match CSS animation duration
    },
    [slides.length, currentSlide, onSlideChange]
  );

  const goToNextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const goToPrevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Focus management
  const handleTabFocus = useCallback(
    (index: number) => {
      setFocusedIndex(index);
      const slide = slides[index];
      if (slide) {
        tabRefs.current.get(slide.id)?.focus();
      }
    },
    [slides]
  );

  // Keyboard handler for tablist
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const { key } = event;
      const target = event.target;
      if (
        !tablistRef.current ||
        !(target instanceof Node) ||
        !tablistRef.current.contains(target)
      ) {
        return;
      }

      let newIndex = focusedIndex;
      let shouldPreventDefault = false;

      switch (key) {
        case 'ArrowRight':
          newIndex = (focusedIndex + 1) % slides.length;
          shouldPreventDefault = true;
          break;

        case 'ArrowLeft':
          newIndex = (focusedIndex - 1 + slides.length) % slides.length;
          shouldPreventDefault = true;
          break;

        case 'Home':
          newIndex = 0;
          shouldPreventDefault = true;
          break;

        case 'End':
          newIndex = slides.length - 1;
          shouldPreventDefault = true;
          break;

        case 'Enter':
        case ' ':
          // Tab is already selected on focus, but this handles manual confirmation
          goToSlide(focusedIndex);
          shouldPreventDefault = true;
          break;
      }

      if (shouldPreventDefault) {
        event.preventDefault();

        if (newIndex !== focusedIndex) {
          handleTabFocus(newIndex);
          goToSlide(newIndex);
        }
      }
    },
    [focusedIndex, slides.length, handleTabFocus, goToSlide]
  );

  // Keep ref in sync with state
  useEffect(() => {
    currentSlideRef.current = currentSlide;
  }, [currentSlide]);

  // Auto-rotation timer with animation support
  useEffect(() => {
    if (isActuallyRotating) {
      timerRef.current = setInterval(() => {
        const current = currentSlideRef.current;
        const nextIndex = (current + 1) % slides.length;

        // Trigger animation
        setExitingSlide(current);
        setTransitionDirection('next');
        setCurrentSlide(nextIndex);
        setFocusedIndex(nextIndex);
        onSlideChange?.(nextIndex);

        // Clean up animation state
        animationTimeoutRef.current = setTimeout(() => {
          setExitingSlide(null);
          setTransitionDirection(null);
          animationTimeoutRef.current = null;
        }, 300);
      }, rotationInterval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isActuallyRotating, slides.length, rotationInterval, onSlideChange]);

  // Cleanup animation timeout and RAF on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  // Toggle auto-rotate mode (user intent)
  const toggleAutoRotateMode = useCallback(() => {
    setAutoRotateMode((prev) => {
      const newMode = !prev;
      // When enabling auto-rotate, reset interaction pause so rotation starts immediately
      if (newMode) {
        setIsPausedByInteraction(false);
      }
      return newMode;
    });
  }, []);

  // Pause/resume by interaction (hover/focus)
  const pauseByInteraction = useCallback(() => {
    setIsPausedByInteraction(true);
  }, []);

  const resumeByInteraction = useCallback(() => {
    setIsPausedByInteraction(false);
  }, []);

  // Focus/blur handlers for entire carousel
  const handleCarouselFocusIn = useCallback(() => {
    if (autoRotateMode) {
      pauseByInteraction();
    }
  }, [autoRotateMode, pauseByInteraction]);

  const handleCarouselFocusOut = useCallback(
    (event: React.FocusEvent) => {
      if (!autoRotateMode) return;

      // Only resume if focus is leaving the carousel entirely
      const carousel = event.currentTarget;
      const relatedTarget = event.relatedTarget;
      const focusLeftCarousel =
        relatedTarget === null ||
        (relatedTarget instanceof Node && !carousel.contains(relatedTarget));
      if (focusLeftCarousel) {
        resumeByInteraction();
      }
    },
    [autoRotateMode, resumeByInteraction]
  );

  // Mouse hover handlers for slides container only
  const handleSlidesMouseEnter = useCallback(() => {
    if (autoRotateMode) {
      pauseByInteraction();
    }
  }, [autoRotateMode, pauseByInteraction]);

  const handleSlidesMouseLeave = useCallback(() => {
    if (autoRotateMode) {
      resumeByInteraction();
    }
  }, [autoRotateMode, resumeByInteraction]);

  // Touch/swipe handlers
  const pointerStartX = useRef<number | null>(null);
  const activePointerId = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingDragOffset = useRef<number>(0);
  const slidesContainerRef = useRef<HTMLDivElement>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Compute which adjacent slide to show during drag
  const swipeAdjacentSlide =
    isDragging && dragOffset !== 0
      ? dragOffset > 0
        ? (currentSlide - 1 + slides.length) % slides.length // swiping right, show prev
        : (currentSlide + 1) % slides.length // swiping left, show next
      : null;

  // Instant slide change (no animation) for swipe completion
  const goToSlideInstant = useCallback(
    (index: number) => {
      if (slides.length < 2) return;
      const newIndex = ((index % slides.length) + slides.length) % slides.length;
      setCurrentSlide(newIndex);
      setFocusedIndex(newIndex);
      onSlideChange?.(newIndex);
    },
    [slides.length, onSlideChange]
  );

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (slides.length < 2) return; // Disable swipe for single slide
      if (activePointerId.current !== null) return; // Ignore if already tracking a pointer
      activePointerId.current = event.pointerId;
      pointerStartX.current = event.clientX;
      setIsDragging(true);
      setDragOffset(0);
      // Capture pointer to receive events even if pointer moves outside element
      event.currentTarget.setPointerCapture(event.pointerId);
      if (autoRotateMode) {
        pauseByInteraction();
      }
    },
    [slides.length, autoRotateMode, pauseByInteraction]
  );

  const handlePointerMove = useCallback((event: React.PointerEvent) => {
    if (activePointerId.current !== event.pointerId) return; // Ignore other pointers
    if (pointerStartX.current === null) return;
    const diff = event.clientX - pointerStartX.current;
    pendingDragOffset.current = diff;

    // Throttle updates using requestAnimationFrame
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setDragOffset(pendingDragOffset.current);
        rafRef.current = null;
      });
    }
  }, []);

  const handlePointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (activePointerId.current !== event.pointerId) return; // Ignore other pointers
      if (pointerStartX.current === null) return;

      const diff = event.clientX - pointerStartX.current;
      const containerWidth = slidesContainerRef.current?.offsetWidth || 300;
      const threshold = containerWidth * 0.2; // 20% of container width

      // Use ref to get current slide value to avoid stale closure
      const current = currentSlideRef.current;
      if (diff > threshold) {
        // Swiped right - go to previous slide (instant, no animation)
        goToSlideInstant(current - 1);
      } else if (diff < -threshold) {
        // Swiped left - go to next slide (instant, no animation)
        goToSlideInstant(current + 1);
      }
      // else: snap back (just reset dragOffset)

      // Cancel any pending RAF
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      activePointerId.current = null;
      pointerStartX.current = null;
      setIsDragging(false);
      setDragOffset(0);

      if (autoRotateMode) {
        resumeByInteraction();
      }
    },
    [goToSlideInstant, autoRotateMode, resumeByInteraction]
  );

  const handlePointerCancel = useCallback((event: React.PointerEvent) => {
    if (activePointerId.current !== event.pointerId) return; // Ignore other pointers
    // Cancel any pending RAF
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    activePointerId.current = null;
    pointerStartX.current = null;
    setIsDragging(false);
    setDragOffset(0);
  }, []);

  const containerClass = `apg-carousel ${className}`.trim();

  return (
    <section
      className={containerClass}
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      data-testid={testId}
      onFocus={handleCarouselFocusIn}
      onBlur={handleCarouselFocusOut}
    >
      {/* Slides Container */}
      <div
        ref={slidesContainerRef}
        id={slidesContainerId}
        data-testid="slides-container"
        className={['apg-carousel-slides', isDragging && 'apg-carousel-slides--dragging']
          .filter(Boolean)
          .join(' ')}
        role="group"
        aria-live={isActuallyRotating ? 'off' : 'polite'}
        aria-atomic="false"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onMouseEnter={handleSlidesMouseEnter}
        onMouseLeave={handleSlidesMouseLeave}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const isExiting = index === exitingSlide;
          const isSwipeAdjacent = index === swipeAdjacentSlide;
          const panelId = `${carouselId}-panel-${slide.id}`;
          const tabId = `${carouselId}-tab-${slide.id}`;

          // Determine animation class (only for non-swipe transitions)
          let animationClass = '';
          if (transitionDirection && !isDragging) {
            if (isActive) {
              animationClass = `apg-carousel-slide--entering-${transitionDirection}`;
            } else if (isExiting) {
              animationClass = `apg-carousel-slide--exiting-${transitionDirection}`;
            }
          }

          // Determine swipe position class
          let swipeClass = '';
          if (isSwipeAdjacent && isDragging) {
            swipeClass =
              dragOffset > 0 ? 'apg-carousel-slide--swipe-prev' : 'apg-carousel-slide--swipe-next';
          }

          // Calculate transform for swipe
          let slideStyle: React.CSSProperties | undefined;
          if (isDragging) {
            if (isActive) {
              slideStyle = { transform: `translateX(${dragOffset}px)` };
            } else if (isSwipeAdjacent) {
              // Position adjacent slide next to current slide
              const baseOffset = dragOffset > 0 ? '-100%' : '100%';
              slideStyle = { transform: `translateX(calc(${baseOffset} + ${dragOffset}px))` };
            }
          }

          return (
            <div
              key={slide.id}
              id={panelId}
              role="tabpanel"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${slides.length}`}
              aria-labelledby={tabId}
              aria-hidden={!isActive}
              inert={!isActive ? true : undefined}
              className={`apg-carousel-slide ${isActive ? 'apg-carousel-slide--active' : ''} ${animationClass} ${swipeClass}`.trim()}
              style={slideStyle}
            >
              {slide.content}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="apg-carousel-controls">
        {/* Play/Pause Button (first in tab order) */}
        {autoRotate && (
          <button
            type="button"
            className="apg-carousel-play-pause"
            aria-label={autoRotateMode ? 'Stop automatic slide show' : 'Start automatic slide show'}
            onClick={toggleAutoRotateMode}
          >
            {autoRotateMode ? (
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <rect x="3" y="2" width="4" height="12" rx="1.5" />
                <rect x="9" y="2" width="4" height="12" rx="1.5" />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M4 2.5v11a.5.5 0 0 0 .75.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5z" />
              </svg>
            )}
          </button>
        )}

        {/* Tablist (slide indicators) */}
        {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus -- keydown handled on container; child buttons are focusable */}
        <div
          ref={tablistRef}
          role="tablist"
          aria-label="Slides"
          className="apg-carousel-tablist"
          onKeyDown={handleKeyDown}
        >
          {slides.map((slide, index) => {
            const isSelected = index === currentSlide;
            const isFocusTarget = index === focusedIndex;
            const tabId = `${carouselId}-tab-${slide.id}`;
            const panelId = `${carouselId}-panel-${slide.id}`;

            return (
              <button
                key={slide.id}
                ref={(el) => {
                  if (el) {
                    tabRefs.current.set(slide.id, el);
                  } else {
                    tabRefs.current.delete(slide.id);
                  }
                }}
                type="button"
                role="tab"
                id={tabId}
                aria-selected={isSelected}
                aria-controls={panelId}
                tabIndex={isFocusTarget ? 0 : -1}
                className={`apg-carousel-tab ${isSelected ? 'apg-carousel-tab--selected' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={slide.label || `Slide ${index + 1}`}
              >
                <span className="apg-carousel-tab-indicator" aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {/* Previous/Next Buttons */}
        <div role="group" aria-label="Slide controls" className="apg-carousel-nav">
          <button
            type="button"
            className="apg-carousel-prev"
            aria-label="Previous slide"
            aria-controls={slidesContainerId}
            onClick={goToPrevSlide}
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="15" y1="10" x2="5" y2="10" />
              <polyline points="10 5 5 10 10 15" />
            </svg>
          </button>
          <button
            type="button"
            className="apg-carousel-next"
            aria-label="Next slide"
            aria-controls={slidesContainerId}
            onClick={goToNextSlide}
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="10" x2="15" y2="10" />
              <polyline points="10 5 15 10 10 15" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

export default Carousel;
