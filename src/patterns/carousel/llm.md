# Carousel Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

## Overview

A carousel presents a set of items (slides), one at a time, with controls to navigate between items. Supports auto-rotation with pause on focus/hover, keyboard navigation via tablist pattern, and touch/swipe gestures.

## ARIA Requirements

### Roles

| Role       | Element           | Description                        |
| ---------- | ----------------- | ---------------------------------- |
| `region`   | Container section | Landmark for the carousel          |
| `tablist`  | Tab container     | Slide picker navigation            |
| `tab`      | Each tab button   | Slide selector                     |
| `tabpanel` | Each slide        | Slide content container            |
| `group`    | Controls wrapper  | Groups prev/next buttons           |

### Properties

| Attribute              | Element        | Values          | Required | Notes                                |
| ---------------------- | -------------- | --------------- | -------- | ------------------------------------ |
| `aria-roledescription` | Container      | `"carousel"`    | Yes      | Announces as "carousel" to AT        |
| `aria-roledescription` | Each tabpanel  | `"slide"`       | Yes      | Announces as "slide" to AT           |
| `aria-label`           | Container      | text            | Yes      | Describes carousel purpose           |
| `aria-label`           | Each tabpanel  | `"N of M"`      | Yes      | Slide position (e.g., "1 of 5")      |
| `aria-controls`        | Each tab       | tabpanel ID     | Yes      | References controlled slide          |
| `aria-controls`        | Prev/Next btns | slides cont. ID | Yes      | References slides container          |

### States

| Attribute       | Element          | Values             | Required | Change Trigger             |
| --------------- | ---------------- | ------------------ | -------- | -------------------------- |
| `aria-selected` | tab              | `true`/`false`     | Yes      | Tab activation             |
| `aria-live`     | Slides container | `"off"`/`"polite"` | Yes      | Rotation state change      |
| `tabindex`      | tab              | `0`/`-1`           | Yes      | Focus movement (roving)    |
| `hidden`        | tabpanel         | boolean            | Yes      | Slide visibility change    |

## Keyboard Support

| Key          | Action                            |
| ------------ | --------------------------------- |
| `Tab`        | Move through interactive elements |
| `ArrowRight` | Next tab (wraps to first)         |
| `ArrowLeft`  | Previous tab (wraps to last)      |
| `Home`       | First tab                         |
| `End`        | Last tab                          |
| `Enter`      | Activate focused element          |
| `Space`      | Activate focused element          |

## Focus Management

- **Roving tabindex** in tablist: only active tab has `tabindex="0"`
- **Rotation control button** should be first in tab order (before tablist)
- **Auto-rotation pauses** when any element in the carousel receives keyboard focus (including controls and slide content)
- **Auto-rotation pauses** on mouse hover over slides container (not controls)
- **Auto-rotation resumes** when focus leaves the carousel entirely
- **Clicking play button** resets pause state and starts rotation immediately (even if focus remains on button)
- **Respect `prefers-reduced-motion`**: do not auto-start rotation if set to `reduce`

## Difference from Tabs Pattern

| Feature                | Tabs   | Carousel                     | Reason                         |
| ---------------------- | ------ | ---------------------------- | ------------------------------ |
| `aria-roledescription` | None   | `"carousel"` / `"slide"`     | Identify as slideshow          |
| `aria-live`            | None   | `"off"` / `"polite"` dynamic | Suppress reads during rotation |
| Auto-rotation          | No     | Yes                          | Automatic slide transition     |
| Focus/hover pause      | No     | Yes                          | Pause for user interaction     |
| Prev/Next buttons      | No     | Yes                          | Intuitive navigation           |

## Test Checklist

### High Priority: ARIA Structure

- [ ] Container has `aria-roledescription="carousel"`
- [ ] Container has `aria-label` describing purpose
- [ ] Each tabpanel has `aria-roledescription="slide"`
- [ ] Each tabpanel has `aria-label="N of M"` format
- [ ] Tab container has `role="tablist"`
- [ ] Each tab has `role="tab"` and `aria-controls`
- [ ] Active tab has `aria-selected="true"`

### High Priority: Keyboard

- [ ] `ArrowRight` moves to next tab (wraps from last to first)
- [ ] `ArrowLeft` moves to previous tab (wraps from first to last)
- [ ] `Home` moves to first tab
- [ ] `End` moves to last tab
- [ ] `Enter`/`Space` activates tab or button

### High Priority: Focus Management

- [ ] Only one tab has `tabindex="0"` at a time
- [ ] Rotation control is first in tab order
- [ ] Focus moves correctly with arrow keys

### High Priority: Auto-Rotation

- [ ] Slides rotate automatically when `autoRotate` enabled
- [ ] `aria-live="off"` during rotation
- [ ] `aria-live="polite"` when rotation stopped
- [ ] Rotation pauses on keyboard focus anywhere in carousel
- [ ] Rotation pauses on mouse hover over slides container
- [ ] Rotation resumes when focus leaves carousel entirely
- [ ] Play/pause button toggles `autoRotateMode`
- [ ] Play button click starts rotation immediately (resets interaction pause)
- [ ] Button icon reflects `autoRotateMode` (not affected by interaction pause)
- [ ] Respects `prefers-reduced-motion: reduce`

### Medium Priority: Navigation Controls

- [ ] Next button shows next slide (wraps)
- [ ] Previous button shows previous slide (wraps)

### Medium Priority: Touch/Swipe

- [ ] Swipe left shows next slide
- [ ] Swipe right shows previous slide
- [ ] Touch pauses rotation

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] No axe-core violations during rotation

### Low Priority: Props

- [ ] `onSlideChange` callback fires on slide change
- [ ] `initialSlide` prop sets initial slide
- [ ] `autoRotate` prop enables/disables rotation
- [ ] `rotationInterval` prop controls interval

## Implementation Notes

### Structure

```
section[aria-roledescription="carousel"][aria-label="..."]
├── div[role="group"][aria-live="off|polite"]  (slides container)
│   └── div[role="tabpanel"][aria-roledescription="slide"][aria-label="1 of N"]
│       └── <Slide Content>
└── div.controls  (below slides)
    ├── button  (Play/Pause - first tab stop)
    ├── div[role="tablist"]
    │   └── button[role="tab"]*  (roving tabindex)
    └── div[role="group"]  (prev/next)
        ├── button  (Previous)
        └── button  (Next)
```

### Auto-Rotation State Model

Two independent boolean states:

```
autoRotateMode: boolean       // User's intent (toggled by play/pause button)
isPausedByInteraction: boolean // Temporary pause (focus/hover)

isActuallyRotating = autoRotateMode && !isPausedByInteraction
```

**State transitions:**

```
autoRotateMode:
  - click pause button → false
  - click play button → true (also resets isPausedByInteraction to false)

isPausedByInteraction:
  - focus enters carousel → true
  - focus leaves carousel → false
  - hover enters slides container → true
  - hover leaves slides container → false
```

**UI behavior:**

- Play/pause button icon reflects `autoRotateMode` only (not affected by interaction pause)
- `aria-live` uses `isActuallyRotating`: "off" when rotating, "polite" when paused

### Touch/Swipe Implementation

```typescript
// Use PointerEvents for cross-device support
let startX: number;
const threshold = 50; // px

onPointerDown = (e) => { startX = e.clientX; pauseRotation(); };
onPointerUp = (e) => {
  const diff = e.clientX - startX;
  if (diff > threshold) goToPrev();
  else if (diff < -threshold) goToNext();
  resumeIfAllowed();
};
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Carousel } from './Carousel';

const slides = [
  { id: '1', content: <div>Slide 1</div> },
  { id: '2', content: <div>Slide 2</div> },
  { id: '3', content: <div>Slide 3</div> },
];

describe('Carousel', () => {
  describe('APG: ARIA Structure', () => {
    it('has aria-roledescription="carousel" on container', () => {
      render(<Carousel slides={slides} aria-label="Featured" />);
      const carousel = screen.getByRole('region');
      expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    });

    it('has aria-roledescription="slide" on each tabpanel', () => {
      render(<Carousel slides={slides} aria-label="Featured" />);
      const panels = screen.getAllByRole('tabpanel', { hidden: true });
      panels.forEach((panel) => {
        expect(panel).toHaveAttribute('aria-roledescription', 'slide');
      });
    });
  });

  describe('APG: Keyboard Interaction', () => {
    it('moves focus to next tab on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Carousel slides={slides} aria-label="Featured" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]);
      await user.keyboard('{ArrowRight}');

      expect(tabs[1]).toHaveFocus();
    });

    it('wraps from last to first on ArrowRight', async () => {
      const user = userEvent.setup();
      render(<Carousel slides={slides} aria-label="Featured" />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[2]); // last tab
      await user.keyboard('{ArrowRight}');

      expect(tabs[0]).toHaveFocus();
    });
  });

  describe('APG: Auto-Rotation', () => {
    it('has aria-live="off" during auto-rotation', () => {
      render(<Carousel slides={slides} aria-label="Featured" autoRotate />);
      const slidesContainer = screen.getByRole('group', { name: /slides/i });
      expect(slidesContainer).toHaveAttribute('aria-live', 'off');
    });

    it('stops rotation on keyboard focus', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      render(<Carousel slides={slides} aria-label="Featured" autoRotate rotationInterval={1000} />);

      const tabs = screen.getAllByRole('tab');
      await user.click(tabs[0]); // focus enters

      const slidesContainer = screen.getByRole('group', { name: /slides/i });
      expect(slidesContainer).toHaveAttribute('aria-live', 'polite');

      vi.useRealTimers();
    });
  });
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';

const carouselSelector = '[data-testid="carousel-manual"]';

// ARIA Structure: Container has aria-roledescription="carousel"
test('has aria-roledescription="carousel" on container', async ({ page }) => {
  await page.goto('patterns/carousel/react/');
  await page.locator(carouselSelector).waitFor();

  const carousel = page.locator(carouselSelector);
  await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
});

// ARIA Structure: Each slide has aria-roledescription="slide" and aria-label
test('has aria-roledescription="slide" and aria-label on each tabpanel', async ({ page }) => {
  await page.goto('patterns/carousel/react/');

  const carousel = page.locator(carouselSelector);
  const panels = carousel.locator('[role="tabpanel"]');
  const count = await panels.count();

  for (let i = 0; i < count; i++) {
    const panel = panels.nth(i);
    await expect(panel).toHaveAttribute('aria-roledescription', 'slide');
    const label = await panel.getAttribute('aria-label');
    expect(label).toMatch(new RegExp(`${i + 1} of ${count}`));
  }
});

// Keyboard: Arrow keys navigate tabs with wrapping
test('ArrowRight/ArrowLeft navigate tabs with wrapping', async ({ page }) => {
  await page.goto('patterns/carousel/react/');

  const carousel = page.locator(carouselSelector);
  const tabs = carousel.locator('[role="tablist"] [role="tab"]');
  const firstTab = tabs.first();

  await firstTab.click();
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');

  // ArrowRight moves to next
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  const secondTab = tabs.nth(1);
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');

  // Navigate to last, then ArrowRight wraps to first
  const count = await tabs.count();
  await tabs.nth(count - 1).click();
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');
});
```
