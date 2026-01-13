<script lang="ts">
  import { onMount, onDestroy, untrack } from 'svelte';

  export interface CarouselSlide {
    /** Unique identifier for the slide */
    id: string;
    /** Slide content (HTML string) */
    content: string;
    /** Accessible label for the slide */
    label?: string;
  }

  interface CarouselProps {
    slides: CarouselSlide[];
    'aria-label': string;
    initialSlide?: number;
    autoRotate?: boolean;
    rotationInterval?: number;
    class?: string;
    onSlideChange?: (index: number) => void;
    'data-testid'?: string;
    /** Optional ID for SSR stability (auto-generated if not provided) */
    id?: string;
  }

  let {
    slides = [],
    'aria-label': ariaLabel,
    initialSlide = 0,
    autoRotate = false,
    rotationInterval = 5000,
    class: className = '',
    onSlideChange = () => {},
    'data-testid': testId,
    id: propId,
  }: CarouselProps = $props();

  // Validate initialSlide - fallback to 0 if out of bounds
  let validInitialSlide = $derived(
    initialSlide >= 0 && initialSlide < slides.length ? initialSlide : 0
  );

  // State - new model: separate user intent from temporary pause
  let currentSlide = $state(0);
  let focusedIndex = $state(0);
  let autoRotateMode = $state(false);
  let isPausedByInteraction = $state(false);

  // Transition animation state
  let exitingSlide = $state<number | null>(null);
  let transitionDirection = $state<'next' | 'prev' | null>(null);

  // Refs
  let tablistElement: HTMLElement;
  let tabRefs: HTMLButtonElement[] = [];
  // Generate ID - use prop if provided for SSR stability, otherwise generate on client
  const generateId = () => {
    if (typeof propId === 'string' && propId.length > 0) {
      return propId;
    }
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return `carousel-${crypto.randomUUID().slice(0, 8)}`;
    }
    return `carousel-${Math.random().toString(36).slice(2, 11)}`;
  };
  let carouselId = $state(untrack(() => propId) || '');
  let timerRef: ReturnType<typeof setInterval> | null = null;
  let animationTimeoutRef: ReturnType<typeof setTimeout> | null = null;
  let rafRef: number | null = null;
  let pendingDragOffset = 0;
  let pointerStartX: number | null = null;
  let activePointerId: number | null = null;
  let isDragging = $state(false);
  let dragOffset = $state(0);

  // Generate ID on client side if not provided via prop
  $effect(() => {
    if (typeof window !== 'undefined' && !carouselId) {
      carouselId = generateId();
    }
  });

  // Derived
  let slidesContainerId = $derived(`${carouselId}-slides`);
  let isActuallyRotating = $derived(autoRotateMode && !isPausedByInteraction);
  let containerClass = $derived(`apg-carousel ${className}`.trim());
  let slidesContainerClass = $derived(
    `apg-carousel-slides${isDragging ? ' apg-carousel-slides--dragging' : ''}`
  );

  // Compute which adjacent slide to show during drag
  let swipeAdjacentSlide = $derived(
    isDragging && dragOffset !== 0
      ? dragOffset > 0
        ? (currentSlide - 1 + slides.length) % slides.length // swiping right, show prev
        : (currentSlide + 1) % slides.length // swiping left, show next
      : null
  );

  // Initialize on mount
  onMount(() => {
    currentSlide = validInitialSlide;
    focusedIndex = validInitialSlide;

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        autoRotateMode = false;
      } else {
        autoRotateMode = autoRotate;
      }
    } else {
      autoRotateMode = autoRotate;
    }
  });

  onDestroy(() => {
    if (timerRef) {
      clearInterval(timerRef);
      timerRef = null;
    }
    if (animationTimeoutRef) {
      clearTimeout(animationTimeoutRef);
      animationTimeoutRef = null;
    }
    if (rafRef) {
      cancelAnimationFrame(rafRef);
      rafRef = null;
    }
  });

  // Auto-rotation timer effect with animation
  $effect(() => {
    if (timerRef) {
      clearInterval(timerRef);
      timerRef = null;
    }

    if (isActuallyRotating) {
      timerRef = setInterval(() => {
        const current = currentSlide;
        const nextIndex = (current + 1) % slides.length;

        // Trigger animation
        exitingSlide = current;
        transitionDirection = 'next';
        currentSlide = nextIndex;
        focusedIndex = nextIndex;
        onSlideChange(nextIndex);

        // Clean up animation state
        animationTimeoutRef = setTimeout(() => {
          exitingSlide = null;
          transitionDirection = null;
          animationTimeoutRef = null;
        }, 300);
      }, rotationInterval);
    }

    return () => {
      if (timerRef) {
        clearInterval(timerRef);
        timerRef = null;
      }
    };
  });

  // Slide navigation with animation
  function goToSlide(index: number) {
    if (slides.length < 2) return;
    const newIndex = ((index % slides.length) + slides.length) % slides.length;
    if (newIndex === currentSlide) return;

    // Determine direction based on index change
    const current = currentSlide;
    const isWrapForward = current === slides.length - 1 && newIndex === 0;
    const isWrapBackward = current === 0 && newIndex === slides.length - 1;
    const direction = isWrapForward || (!isWrapBackward && newIndex > current) ? 'next' : 'prev';

    // Start transition
    exitingSlide = current;
    transitionDirection = direction;
    currentSlide = newIndex;
    focusedIndex = newIndex;
    onSlideChange(newIndex);

    // Clean up after animation
    animationTimeoutRef = setTimeout(() => {
      exitingSlide = null;
      transitionDirection = null;
      animationTimeoutRef = null;
    }, 300);
  }

  // Instant slide change (no animation) for swipe completion
  function goToSlideInstant(index: number) {
    if (slides.length < 2) return;
    const newIndex = ((index % slides.length) + slides.length) % slides.length;
    currentSlide = newIndex;
    focusedIndex = newIndex;
    onSlideChange(newIndex);
  }

  function goToNextSlide() {
    goToSlide(currentSlide + 1);
  }

  function goToPrevSlide() {
    goToSlide(currentSlide - 1);
  }

  // Focus management
  function handleTabFocus(index: number) {
    focusedIndex = index;
    if (tabRefs[index]) {
      tabRefs[index].focus();
    }
  }

  // Keyboard handler for tablist
  function handleKeyDown(event: KeyboardEvent) {
    const { key } = event;
    const target = event.target;
    if (!tablistElement || !(target instanceof Node) || !tablistElement.contains(target)) {
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
  }

  // Toggle auto-rotate mode (user intent)
  function toggleAutoRotateMode() {
    autoRotateMode = !autoRotateMode;
    // When enabling auto-rotate, reset interaction pause so rotation starts immediately
    if (autoRotateMode) {
      isPausedByInteraction = false;
    }
  }

  // Pause/resume by interaction (hover/focus)
  function pauseByInteraction() {
    isPausedByInteraction = true;
  }

  function resumeByInteraction() {
    isPausedByInteraction = false;
  }

  // Focus/blur handlers for entire carousel
  function handleCarouselFocusIn() {
    if (autoRotateMode) {
      pauseByInteraction();
    }
  }

  function handleCarouselFocusOut(event: FocusEvent) {
    if (!autoRotateMode) return;

    // Only resume if focus is leaving the carousel entirely
    const { currentTarget, relatedTarget } = event;
    const focusLeftCarousel =
      relatedTarget === null ||
      (currentTarget instanceof Element &&
        relatedTarget instanceof Node &&
        !currentTarget.contains(relatedTarget));
    if (focusLeftCarousel) {
      resumeByInteraction();
    }
  }

  // Mouse hover handlers for slides container only
  function handleSlidesMouseEnter() {
    if (autoRotateMode) {
      pauseByInteraction();
    }
  }

  function handleSlidesMouseLeave() {
    if (autoRotateMode) {
      resumeByInteraction();
    }
  }

  // Touch/swipe handlers
  function handlePointerDown(event: PointerEvent) {
    if (slides.length < 2) return; // Disable swipe for single slide
    if (activePointerId !== null) return; // Ignore if already tracking a pointer
    activePointerId = event.pointerId;
    pointerStartX = event.clientX;
    isDragging = true;
    dragOffset = 0;
    // Capture pointer to receive events even if pointer moves outside element
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    if (autoRotateMode) {
      pauseByInteraction();
    }
  }

  function handlePointerMove(event: PointerEvent) {
    if (activePointerId !== event.pointerId) return; // Ignore other pointers
    if (pointerStartX === null) return;
    const diff = event.clientX - pointerStartX;
    pendingDragOffset = diff;

    // Throttle updates using requestAnimationFrame
    if (rafRef === null) {
      rafRef = requestAnimationFrame(() => {
        dragOffset = pendingDragOffset;
        rafRef = null;
      });
    }
  }

  function handlePointerUp(event: PointerEvent) {
    if (activePointerId !== event.pointerId) return; // Ignore other pointers
    if (!isDragging || pointerStartX === null) return;

    const diff = event.clientX - pointerStartX;
    const target = event.currentTarget as HTMLElement;
    const containerWidth = target?.offsetWidth || 300;
    const threshold = containerWidth * 0.2; // 20% of container width

    if (diff > threshold) {
      // Swiped right - go to previous slide (instant, no animation)
      goToSlideInstant(currentSlide - 1);
    } else if (diff < -threshold) {
      // Swiped left - go to next slide (instant, no animation)
      goToSlideInstant(currentSlide + 1);
    }
    // else: snap back (just reset dragOffset)

    // Cancel any pending RAF
    if (rafRef !== null) {
      cancelAnimationFrame(rafRef);
      rafRef = null;
    }

    activePointerId = null;
    pointerStartX = null;
    isDragging = false;
    dragOffset = 0;

    if (autoRotateMode) {
      resumeByInteraction();
    }
  }

  function handlePointerCancel(event: PointerEvent) {
    if (activePointerId !== event.pointerId) return; // Ignore other pointers
    // Cancel any pending RAF
    if (rafRef !== null) {
      cancelAnimationFrame(rafRef);
      rafRef = null;
    }
    activePointerId = null;
    pointerStartX = null;
    isDragging = false;
    dragOffset = 0;
  }
</script>

<section
  class={containerClass}
  aria-roledescription="carousel"
  aria-label={ariaLabel}
  data-testid={testId}
  onfocusin={handleCarouselFocusIn}
  onfocusout={handleCarouselFocusOut}
>
  <!-- Slides Container -->
  <div
    id={slidesContainerId}
    data-testid="slides-container"
    class={slidesContainerClass}
    role="group"
    aria-live={isActuallyRotating ? 'off' : 'polite'}
    aria-atomic="false"
    onpointerdown={handlePointerDown}
    onpointermove={handlePointerMove}
    onpointerup={handlePointerUp}
    onpointercancel={handlePointerCancel}
    onmouseenter={handleSlidesMouseEnter}
    onmouseleave={handleSlidesMouseLeave}
  >
    {#each slides as slide, index (slide.id)}
      {@const isActive = index === currentSlide}
      {@const isExiting = index === exitingSlide}
      {@const isSwipeAdjacent = index === swipeAdjacentSlide}
      {@const enteringClass =
        transitionDirection && !isDragging && isActive
          ? `apg-carousel-slide--entering-${transitionDirection}`
          : ''}
      {@const exitingClass =
        transitionDirection && !isDragging && isExiting
          ? `apg-carousel-slide--exiting-${transitionDirection}`
          : ''}
      {@const swipeClass =
        isDragging && isSwipeAdjacent
          ? dragOffset > 0
            ? 'apg-carousel-slide--swipe-prev'
            : 'apg-carousel-slide--swipe-next'
          : ''}
      {@const slideStyle = isDragging
        ? isActive
          ? `transform: translateX(${dragOffset}px)`
          : isSwipeAdjacent
            ? `transform: translateX(calc(${dragOffset > 0 ? '-100%' : '100%'} + ${dragOffset}px))`
            : undefined
        : undefined}
      <div
        id={`${carouselId}-panel-${slide.id}`}
        role="tabpanel"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${slides.length}`}
        aria-labelledby={`${carouselId}-tab-${slide.id}`}
        aria-hidden={!isActive}
        inert={!isActive ? true : undefined}
        class={`apg-carousel-slide ${isActive ? 'apg-carousel-slide--active' : ''} ${enteringClass} ${exitingClass} ${swipeClass}`.trim()}
        style={slideStyle}
      >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- Content is provided by the consuming application -->
        {@html slide.content}
      </div>
    {/each}
  </div>

  <!-- Controls -->
  <div class="apg-carousel-controls">
    <!-- Play/Pause Button (first in tab order) -->
    {#if autoRotate}
      <button
        type="button"
        class="apg-carousel-play-pause"
        aria-label={autoRotateMode ? 'Stop automatic slide show' : 'Start automatic slide show'}
        onclick={toggleAutoRotateMode}
      >
        {#if autoRotateMode}
          <svg aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
            <rect x="3" y="2" width="4" height="12" rx="1.5" />
            <rect x="9" y="2" width="4" height="12" rx="1.5" />
          </svg>
        {:else}
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 2.5v11a.5.5 0 0 0 .75.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5z" />
          </svg>
        {/if}
      </button>
    {/if}

    <!-- Tablist (slide indicators) -->
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <div
      bind:this={tablistElement}
      role="tablist"
      aria-label="Slides"
      class="apg-carousel-tablist"
      onkeydown={handleKeyDown}
    >
      {#each slides as slide, index (slide.id)}
        <button
          bind:this={tabRefs[index]}
          type="button"
          role="tab"
          id={`${carouselId}-tab-${slide.id}`}
          aria-selected={index === currentSlide}
          aria-controls={`${carouselId}-panel-${slide.id}`}
          tabindex={index === focusedIndex ? 0 : -1}
          class={`apg-carousel-tab ${index === currentSlide ? 'apg-carousel-tab--selected' : ''}`}
          onclick={() => goToSlide(index)}
          aria-label={slide.label || `Slide ${index + 1}`}
        >
          <span class="apg-carousel-tab-indicator" aria-hidden="true"></span>
        </button>
      {/each}
    </div>

    <!-- Previous/Next Buttons -->
    <div role="group" aria-label="Slide controls" class="apg-carousel-nav">
      <button
        type="button"
        class="apg-carousel-prev"
        aria-label="Previous slide"
        aria-controls={slidesContainerId}
        onclick={goToPrevSlide}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="15" y1="10" x2="5" y2="10" />
          <polyline points="10 5 5 10 10 15" />
        </svg>
      </button>
      <button
        type="button"
        class="apg-carousel-next"
        aria-label="Next slide"
        aria-controls={slidesContainerId}
        onclick={goToNextSlide}
      >
        <svg
          aria-hidden="true"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="5" y1="10" x2="15" y2="10" />
          <polyline points="10 5 15 10 10 15" />
        </svg>
      </button>
    </div>
  </div>
</section>

<style>
  /* Styles are in src/styles/patterns/carousel.css */
</style>
