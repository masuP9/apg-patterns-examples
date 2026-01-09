<template>
  <section
    :class="containerClass"
    aria-roledescription="carousel"
    :aria-label="props.ariaLabel"
    :data-testid="props.dataTestid"
    @focusin="handleCarouselFocusIn"
    @focusout="handleCarouselFocusOut"
  >
    <!-- Slides Container -->
    <div
      :id="slidesContainerId"
      data-testid="slides-container"
      :class="slidesContainerClass"
      role="group"
      :aria-live="isActuallyRotating ? 'off' : 'polite'"
      aria-atomic="false"
      :style="undefined"
      @pointerdown="handlePointerDown"
      @pointermove="handlePointerMove"
      @pointerup="handlePointerUp"
      @pointercancel="handlePointerCancel"
      @mouseenter="handleSlidesMouseEnter"
      @mouseleave="handleSlidesMouseLeave"
    >
      <div
        v-for="(slide, index) in slides"
        :key="slide.id"
        :id="`${carouselId}-panel-${slide.id}`"
        role="tabpanel"
        aria-roledescription="slide"
        :aria-label="`${index + 1} of ${slides.length}`"
        :aria-labelledby="`${carouselId}-tab-${slide.id}`"
        :aria-hidden="index !== currentSlide"
        :inert="index !== currentSlide ? true : undefined"
        :class="[
          'apg-carousel-slide',
          index === currentSlide ? 'apg-carousel-slide--active' : '',
          transitionDirection && !isDragging && index === currentSlide
            ? `apg-carousel-slide--entering-${transitionDirection}`
            : '',
          transitionDirection && !isDragging && index === exitingSlide
            ? `apg-carousel-slide--exiting-${transitionDirection}`
            : '',
          isDragging && index === swipeAdjacentSlide && dragOffset > 0
            ? 'apg-carousel-slide--swipe-prev'
            : '',
          isDragging && index === swipeAdjacentSlide && dragOffset < 0
            ? 'apg-carousel-slide--swipe-next'
            : '',
        ]"
        :style="getSlideStyle(index)"
      >
        <div v-html="slide.content" />
      </div>
    </div>

    <!-- Controls -->
    <div class="apg-carousel-controls">
      <!-- Play/Pause Button (first in tab order) -->
      <button
        v-if="autoRotate"
        type="button"
        class="apg-carousel-play-pause"
        :aria-label="autoRotateMode ? 'Stop automatic slide show' : 'Start automatic slide show'"
        @click="toggleAutoRotateMode"
      >
        <svg
          v-if="autoRotateMode"
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <rect x="3" y="2" width="4" height="12" rx="1.5" />
          <rect x="9" y="2" width="4" height="12" rx="1.5" />
        </svg>
        <svg
          v-else
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4 2.5v11a.5.5 0 0 0 .75.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5z" />
        </svg>
      </button>

      <!-- Tablist (slide indicators) -->
      <div
        ref="tablistRef"
        role="tablist"
        aria-label="Slides"
        class="apg-carousel-tablist"
        @keydown="handleKeyDown"
      >
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          :ref="(el) => setTabRef(slide.id, el)"
          type="button"
          role="tab"
          :id="`${carouselId}-tab-${slide.id}`"
          :aria-selected="index === currentSlide"
          :aria-controls="`${carouselId}-panel-${slide.id}`"
          :tabindex="index === focusedIndex ? 0 : -1"
          :class="['apg-carousel-tab', index === currentSlide ? 'apg-carousel-tab--selected' : '']"
          @click="goToSlide(index)"
          :aria-label="slide.label || `Slide ${index + 1}`"
        >
          <span class="apg-carousel-tab-indicator" aria-hidden="true" />
        </button>
      </div>

      <!-- Previous/Next Buttons -->
      <div role="group" aria-label="Slide controls" class="apg-carousel-nav">
        <button
          type="button"
          class="apg-carousel-prev"
          aria-label="Previous slide"
          :aria-controls="slidesContainerId"
          @click="goToPrevSlide"
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
          :aria-controls="slidesContainerId"
          @click="goToNextSlide"
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
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';

export interface CarouselSlide {
  /** Unique identifier for the slide */
  id: string;
  /** Slide content (HTML string) */
  content: string;
  /** Accessible label for the slide */
  label?: string;
}

export interface CarouselProps {
  /** Array of slides */
  slides: CarouselSlide[];
  /** Accessible label for the carousel (required) */
  ariaLabel: string;
  /** Initial slide index (0-based) */
  initialSlide?: number;
  /** Enable auto-rotation */
  autoRotate?: boolean;
  /** Rotation interval in milliseconds (default: 5000) */
  rotationInterval?: number;
  /** Additional CSS class */
  class?: string;
  /** Test ID for E2E testing */
  dataTestid?: string;
  /** Optional ID for SSR stability (auto-generated if not provided) */
  id?: string;
}

const props = withDefaults(defineProps<CarouselProps>(), {
  initialSlide: 0,
  autoRotate: false,
  rotationInterval: 5000,
  class: '',
});

const emit = defineEmits<{
  slideChange: [index: number];
}>();

// Validate initialSlide - fallback to 0 if out of bounds
const validInitialSlide = computed(() => {
  return props.initialSlide >= 0 && props.initialSlide < props.slides.length
    ? props.initialSlide
    : 0;
});

// Generate ID - use prop if provided for SSR stability, otherwise generate
let generatedId: string | undefined;
if (typeof props.id === 'string' && props.id.length > 0) {
  generatedId = props.id;
} else if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
  // Use crypto.randomUUID for better uniqueness when available
  generatedId = `carousel-${crypto.randomUUID().slice(0, 8)}`;
} else {
  generatedId = `carousel-${Math.random().toString(36).slice(2, 11)}`;
}
const carouselId = ref(generatedId);

// Helper to get initial auto-rotate mode
const getInitialAutoRotateMode = (): boolean => {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      return false;
    }
  }
  return props.autoRotate;
};

// State - new model: separate user intent from temporary pause
const currentSlide = ref(validInitialSlide.value);
const focusedIndex = ref(validInitialSlide.value);
const autoRotateMode = ref(getInitialAutoRotateMode());
const isPausedByInteraction = ref(false);

// Transition animation state
const exitingSlide = ref<number | null>(null);
const transitionDirection = ref<'next' | 'prev' | null>(null);

// Refs
const tablistRef = ref<HTMLElement>();
const tabRefs = ref<Record<string, HTMLButtonElement>>({});
let timerRef: ReturnType<typeof setInterval> | null = null;
let animationTimeoutRef: ReturnType<typeof setTimeout> | null = null;
let rafRef: number | null = null;
let pendingDragOffset = 0;
let pointerStartX: number | null = null;
let activePointerId: number | null = null;
const isDragging = ref(false);
const dragOffset = ref(0);

// Computed
const slidesContainerId = computed(() => `${carouselId.value}-slides`);
const isActuallyRotating = computed(() => autoRotateMode.value && !isPausedByInteraction.value);
const containerClass = computed(() => `apg-carousel ${props.class}`.trim());
const slidesContainerClass = computed(
  () => `apg-carousel-slides${isDragging.value ? ' apg-carousel-slides--dragging' : ''}`
);

// Compute which adjacent slide to show during drag
const swipeAdjacentSlide = computed(() =>
  isDragging.value && dragOffset.value !== 0
    ? dragOffset.value > 0
      ? (currentSlide.value - 1 + props.slides.length) % props.slides.length // swiping right, show prev
      : (currentSlide.value + 1) % props.slides.length // swiping left, show next
    : null
);

// Calculate transform style for each slide during swipe
const getSlideStyle = (index: number): Record<string, string> | undefined => {
  if (!isDragging.value) return undefined;

  if (index === currentSlide.value) {
    return { transform: `translateX(${dragOffset.value}px)` };
  } else if (index === swipeAdjacentSlide.value) {
    // Position adjacent slide next to current slide
    const baseOffset = dragOffset.value > 0 ? '-100%' : '100%';
    return { transform: `translateX(calc(${baseOffset} + ${dragOffset.value}px))` };
  }
  return undefined;
};

onUnmounted(() => {
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

const setTabRef = (id: string, el: unknown) => {
  if (el instanceof HTMLButtonElement) {
    tabRefs.value[id] = el;
  }
};

// Slide navigation with animation
const goToSlide = (index: number) => {
  if (props.slides.length < 2) return;
  const newIndex = ((index % props.slides.length) + props.slides.length) % props.slides.length;
  if (newIndex === currentSlide.value) return;

  // Determine direction based on index change
  const current = currentSlide.value;
  const isWrapForward = current === props.slides.length - 1 && newIndex === 0;
  const isWrapBackward = current === 0 && newIndex === props.slides.length - 1;
  const direction = isWrapForward || (!isWrapBackward && newIndex > current) ? 'next' : 'prev';

  // Start transition
  exitingSlide.value = current;
  transitionDirection.value = direction;
  currentSlide.value = newIndex;
  focusedIndex.value = newIndex;
  emit('slideChange', newIndex);

  // Clean up after animation
  animationTimeoutRef = setTimeout(() => {
    exitingSlide.value = null;
    transitionDirection.value = null;
    animationTimeoutRef = null;
  }, 300);
};

// Instant slide change (no animation) for swipe completion
const goToSlideInstant = (index: number) => {
  if (props.slides.length < 2) return;
  const newIndex = ((index % props.slides.length) + props.slides.length) % props.slides.length;
  currentSlide.value = newIndex;
  focusedIndex.value = newIndex;
  emit('slideChange', newIndex);
};

const goToNextSlide = () => {
  goToSlide(currentSlide.value + 1);
};

const goToPrevSlide = () => {
  goToSlide(currentSlide.value - 1);
};

// Focus management
const handleTabFocus = (index: number) => {
  focusedIndex.value = index;
  const slide = props.slides[index];
  if (slide) {
    tabRefs.value[slide.id]?.focus();
  }
};

// Keyboard handler for tablist
const handleKeyDown = (event: KeyboardEvent) => {
  const { key } = event;
  const target = event.target;
  if (!tablistRef.value || !(target instanceof Node) || !tablistRef.value.contains(target)) {
    return;
  }

  let newIndex = focusedIndex.value;
  let shouldPreventDefault = false;

  switch (key) {
    case 'ArrowRight':
      newIndex = (focusedIndex.value + 1) % props.slides.length;
      shouldPreventDefault = true;
      break;

    case 'ArrowLeft':
      newIndex = (focusedIndex.value - 1 + props.slides.length) % props.slides.length;
      shouldPreventDefault = true;
      break;

    case 'Home':
      newIndex = 0;
      shouldPreventDefault = true;
      break;

    case 'End':
      newIndex = props.slides.length - 1;
      shouldPreventDefault = true;
      break;

    case 'Enter':
    case ' ':
      // Tab is already selected on focus, but this handles manual confirmation
      goToSlide(focusedIndex.value);
      shouldPreventDefault = true;
      break;
  }

  if (shouldPreventDefault) {
    event.preventDefault();

    if (newIndex !== focusedIndex.value) {
      handleTabFocus(newIndex);
      goToSlide(newIndex);
    }
  }
};

// Auto-rotation timer with animation
watch(
  [isActuallyRotating, () => props.slides.length, () => props.rotationInterval],
  ([rotating, slidesLength, interval]) => {
    if (timerRef) {
      clearInterval(timerRef);
      timerRef = null;
    }

    if (rotating) {
      timerRef = setInterval(() => {
        const current = currentSlide.value;
        const nextIndex = (current + 1) % slidesLength;

        // Trigger animation
        exitingSlide.value = current;
        transitionDirection.value = 'next';
        currentSlide.value = nextIndex;
        focusedIndex.value = nextIndex;
        emit('slideChange', nextIndex);

        // Clean up animation state
        animationTimeoutRef = setTimeout(() => {
          exitingSlide.value = null;
          transitionDirection.value = null;
          animationTimeoutRef = null;
        }, 300);
      }, interval);
    }
  },
  { immediate: true }
);

// Toggle auto-rotate mode (user intent)
const toggleAutoRotateMode = () => {
  autoRotateMode.value = !autoRotateMode.value;
  // When enabling auto-rotate, reset interaction pause so rotation starts immediately
  if (autoRotateMode.value) {
    isPausedByInteraction.value = false;
  }
};

// Pause/resume by interaction (hover/focus)
const pauseByInteraction = () => {
  isPausedByInteraction.value = true;
};

const resumeByInteraction = () => {
  isPausedByInteraction.value = false;
};

// Focus/blur handlers for entire carousel
const handleCarouselFocusIn = () => {
  if (autoRotateMode.value) {
    pauseByInteraction();
  }
};

const handleCarouselFocusOut = (event: FocusEvent) => {
  if (!autoRotateMode.value) return;

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
};

// Mouse hover handlers for slides container only
const handleSlidesMouseEnter = () => {
  if (autoRotateMode.value) {
    pauseByInteraction();
  }
};

const handleSlidesMouseLeave = () => {
  if (autoRotateMode.value) {
    resumeByInteraction();
  }
};

// Touch/swipe handlers
const handlePointerDown = (event: PointerEvent) => {
  if (props.slides.length < 2) return; // Disable swipe for single slide
  if (activePointerId !== null) return; // Ignore if already tracking a pointer
  activePointerId = event.pointerId;
  pointerStartX = event.clientX;
  isDragging.value = true;
  dragOffset.value = 0;
  // Capture pointer to receive events even if pointer moves outside element
  (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  if (autoRotateMode.value) {
    pauseByInteraction();
  }
};

const handlePointerMove = (event: PointerEvent) => {
  if (activePointerId !== event.pointerId) return; // Ignore other pointers
  if (pointerStartX === null) return;
  const diff = event.clientX - pointerStartX;
  pendingDragOffset = diff;

  // Throttle updates using requestAnimationFrame
  if (rafRef === null) {
    rafRef = requestAnimationFrame(() => {
      dragOffset.value = pendingDragOffset;
      rafRef = null;
    });
  }
};

const handlePointerUp = (event: PointerEvent) => {
  if (activePointerId !== event.pointerId) return; // Ignore other pointers
  if (!isDragging.value || pointerStartX === null) return;

  const diff = event.clientX - pointerStartX;
  const target = event.currentTarget as HTMLElement;
  const containerWidth = target?.offsetWidth || 300;
  const threshold = containerWidth * 0.2; // 20% of container width

  if (diff > threshold) {
    // Swiped right - go to previous slide (instant, no animation)
    goToSlideInstant(currentSlide.value - 1);
  } else if (diff < -threshold) {
    // Swiped left - go to next slide (instant, no animation)
    goToSlideInstant(currentSlide.value + 1);
  }
  // else: snap back (just reset dragOffset)

  // Cancel any pending RAF
  if (rafRef !== null) {
    cancelAnimationFrame(rafRef);
    rafRef = null;
  }

  activePointerId = null;
  pointerStartX = null;
  isDragging.value = false;
  dragOffset.value = 0;

  if (autoRotateMode.value) {
    resumeByInteraction();
  }
};

const handlePointerCancel = (event: PointerEvent) => {
  if (activePointerId !== event.pointerId) return; // Ignore other pointers
  // Cancel any pending RAF
  if (rafRef !== null) {
    cancelAnimationFrame(rafRef);
    rafRef = null;
  }
  activePointerId = null;
  pointerStartX = null;
  isDragging.value = false;
  dragOffset.value = 0;
};
</script>

<style scoped>
/* Styles are in src/styles/patterns/carousel.css */
</style>
