# Carousel Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/

## Overview

A carousel presents a set of items (slides), one at a time, with controls to navigate between items. Supports auto-rotation with pause on focus/hover, keyboard navigation via tablist pattern, and touch/swipe gestures.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `region` | Container (section) | Landmark region for the carousel |
| `group` | Slides container | Groups all slides together |
| `tablist` | Tab container | Container for slide indicator tabs |
| `tab` | Each tab button | Individual slide indicator |
| `tabpanel` | Each slide | Individual slide content area |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-roledescription` | [object Object] | "carousel" | Yes | Announces "carousel" to screen readers |
| `aria-roledescription` | [object Object] | "slide" | Yes | Announces "slide" instead of "tabpanel" |
| `aria-label` | [object Object] | Text | Yes | Describes the carousel purpose |
| `aria-label` | [object Object] | "N of M" | Yes | Slide position (e.g., "1 of 5") |
| `aria-controls` | [object Object] | ID reference | Yes | References controlled element |
| `aria-labelledby` | [object Object] | ID reference | Yes | References associated tab |
| `aria-atomic` | [object Object] | "false" | No | Only announce changed content |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-selected` | Tab element | `true` \| `false` | Yes | Tab click, Arrow keys, Prev/Next buttons, Auto-rotation |
| `aria-live` | Slides container | `"off"` \| `"polite"` | Yes | Play/Pause click, Focus in/out, Mouse hover |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Tab` | Navigate between controls (Play/Pause, tablist, Prev/Next) |
| `ArrowRight` | Move to next slide indicator tab (loops to first) |
| `ArrowLeft` | Move to previous slide indicator tab (loops to last) |
| `Home` | Move focus to first slide indicator tab |
| `End` | Move focus to last slide indicator tab |
| `Enter / Space` | Activate focused tab or button |

## Focus Management

- Selected tab: tabIndex="0"
- Other tabs: tabIndex="-1"
- Keyboard focus enters carousel: Rotation pauses temporarily, aria-live changes to "polite"
- Keyboard focus leaves carousel: Rotation resumes (if auto-rotate mode is on)
- Mouse hovers over slides: Rotation pauses temporarily
- Mouse leaves slides: Rotation resumes (if auto-rotate mode is on)
- Pause button clicked: Turns off auto-rotate mode, button shows play icon
- Play button clicked: Turns on auto-rotate mode and starts rotation immediately
- prefers-reduced-motion: reduce: Auto-rotation disabled by default

## Test Checklist

### High Priority: ARIA

- [ ] Container has aria-roledescription="carousel"
- [ ] Container has aria-label describing purpose
- [ ] Each tabpanel has aria-roledescription="slide"
- [ ] Each tabpanel has aria-label="N of M"
- [ ] Tab container has role="tablist"
- [ ] Each tab has role="tab" and aria-controls
- [ ] Active tab has aria-selected="true"
- [ ] aria-live="off" during rotation
- [ ] aria-live="polite" when rotation stopped

### High Priority: Keyboard

- [ ] ArrowRight moves to next tab (wraps)
- [ ] ArrowLeft moves to previous tab (wraps)
- [ ] Home moves to first tab
- [ ] End moves to last tab
- [ ] Enter/Space activates tab or button

### High Priority: Focus Management

- [ ] Only one tab has tabindex="0" at a time
- [ ] Rotation control is first in tab order
- [ ] Rotation pauses on keyboard focus
- [ ] Rotation pauses on mouse hover

### High Priority: Click Behavior

- [ ] Play/pause button toggles rotation

### Medium Priority: Click Behavior

- [ ] Next button shows next slide
- [ ] Previous button shows previous slide

### High Priority: Accessibility

- [ ] Respects prefers-reduced-motion

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

## Structure

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

## Auto-Rotation State Model

Two independent boolean states:

```
autoRotateMode: boolean       // User's intent (toggled by play/pause button)
isPausedByInteraction: boolean // Temporary pause (focus/hover)

isActuallyRotating = autoRotateMode && !isPausedByInteraction
```

**State transitions:**
- click pause button → autoRotateMode = false
- click play button → autoRotateMode = true (also resets isPausedByInteraction)
- focus enters carousel → isPausedByInteraction = true
- focus leaves carousel → isPausedByInteraction = false
- hover enters slides → isPausedByInteraction = true
- hover leaves slides → isPausedByInteraction = false

**UI behavior:**
- Button icon reflects `autoRotateMode` only
- `aria-live` uses `isActuallyRotating`: "off" when rotating, "polite" when paused

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
  });
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';

const carouselSelector = '[data-testid="carousel-manual"]';

test('has aria-roledescription="carousel" on container', async ({ page }) => {
  await page.goto('patterns/carousel/react/');
  await page.locator(carouselSelector).waitFor();

  const carousel = page.locator(carouselSelector);
  await expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
});

test('ArrowRight/ArrowLeft navigate tabs with wrapping', async ({ page }) => {
  await page.goto('patterns/carousel/react/');

  const carousel = page.locator(carouselSelector);
  const tabs = carousel.locator('[role="tablist"] [role="tab"]');
  const firstTab = tabs.first();

  await firstTab.click();
  await expect(firstTab).toHaveAttribute('aria-selected', 'true');

  await page.keyboard.press('ArrowRight');
  const secondTab = tabs.nth(1);
  await expect(secondTab).toHaveAttribute('aria-selected', 'true');
});
```
