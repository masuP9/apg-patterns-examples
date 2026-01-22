# Slider Multithumb Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

## Overview

A multi-thumb slider is an input widget with two thumbs that allows users to select a range of values from within a given range. Each thumb can be moved along a track to adjust the lower and upper bounds of the selected range.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `slider` | Lower thumb element | Identifies the element as a slider for selecting the lower bound of the range. |
| `slider` | Upper thumb element | Identifies the element as a slider for selecting the upper bound of the range. |
| `group` | Container element | Groups the two sliders together and associates them with a common label. |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | Each slider element | Number | Yes | Updated dynamically when value changes via keyboard or pointer |
| `aria-valuemin` | Each slider element | Number | Yes | Static for lower thumb (absolute min), dynamic for upper thumb (lower value + minDistance) |
| `aria-valuemax` | Each slider element | Number | Yes | Dynamic for lower thumb (upper value - minDistance), static for upper thumb (absolute max) |
| `aria-valuetext` | Each slider element | String | Yes | Example: "$20", "$80", "20% - 80%" |
| `aria-orientation` | Each slider element | `"horizontal"` \| `"vertical"` | No | Default: horizontal (implicit). Only set for vertical sliders. |
| `aria-disabled` | Each slider element | `true` \| `undefined` | No | Set only when disabled |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Tab` | Moves focus between thumbs (lower to upper) |
| `Shift + Tab` | Moves focus between thumbs (upper to lower) |
| `Right Arrow` | Increases the value by one step |
| `Up Arrow` | Increases the value by one step |
| `Left Arrow` | Decreases the value by one step |
| `Down Arrow` | Decreases the value by one step |
| `Home` | Sets the thumb to its minimum allowed value (dynamic for upper thumb) |
| `End` | Sets the thumb to its maximum allowed value (dynamic for lower thumb) |
| `Page Up` | Increases the value by a large step (default: step * 10) |
| `Page Down` | Decreases the value by a large step (default: step * 10) |

## Focus Management

- Tab order: Both thumbs are in the tab order (tabindex="0")
- Constant order: Lower thumb always comes first in tab order, regardless of values
- Track click: Clicking the track moves the nearest thumb and focuses it

## Test Checklist

### High Priority: ARIA

- [ ] Has two elements with role="slider"
- [ ] Container has role="group"
- [ ] Both thumbs have aria-valuenow
- [ ] Dynamic aria-valuemin/max updates on thumb movement
- [ ] Has accessible names for both thumbs

### High Priority: Keyboard

- [ ] Right/Up Arrow increases value
- [ ] Left/Down Arrow decreases value
- [ ] Home sets to minimum (dynamic for upper)
- [ ] End sets to maximum (dynamic for lower)
- [ ] Page Up/Down changes value by large step
- [ ] Thumbs cannot cross each other

### High Priority: Focus Management

- [ ] Tab moves between thumbs in order
- [ ] Both thumbs are focusable

### Medium Priority: Accessibility

- [ ] No axe-core violations
- [ ] Focus indicator visible on each thumb

## Implementation Notes

## Multi-Thumb Slider Specifics

Unlike a single-thumb slider, multi-thumb sliders require:
- **Two slider elements** within a `group` role container
- **Dynamic bounds** that update based on the other thumb's value
- **Collision prevention** to ensure thumbs don't cross

## Structure

```
<div role="group" aria-labelledby="label-id">
  <span id="label-id">Price Range</span>
  <div class="slider-track">
    <div class="slider-fill" />
    <div
      role="slider"
      tabindex="0"
      aria-valuenow="20"
      aria-valuemin="0"
      aria-valuemax="80"  <!-- Dynamic: upper value -->
      aria-label="Minimum Price"
    />
    <div
      role="slider"
      tabindex="0"
      aria-valuenow="80"
      aria-valuemin="20"  <!-- Dynamic: lower value -->
      aria-valuemax="100"
      aria-label="Maximum Price"
    />
  </div>
</div>

Visual Layout:
┌─────────────────────────────────────┐
│ Price Range                          │
│ ├─────●━━━━━━━━━━━━●────────────────┤
│ 0     20          80            100  │
└─────────────────────────────────────┘
       ↑            ↑
   Lower Thumb  Upper Thumb
```

## Accessible Naming

Each thumb needs its own label:
- `aria-label` tuple: `["Minimum Price", "Maximum Price"]`
- `aria-labelledby` tuple: Reference separate label elements
- `getAriaLabel` function: Dynamic label based on thumb index

## Dynamic Bounds

Per APG specification:
- Lower thumb's `aria-valuemax` = upper value - minDistance
- Upper thumb's `aria-valuemin` = lower value + minDistance

This ensures Home/End keys behave correctly for assistive technology users.

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA structure test
it('renders two slider elements in a group', () => {
  render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);

  const sliders = screen.getAllByRole('slider');
  expect(sliders).toHaveLength(2);
  expect(screen.getByRole('group')).toBeInTheDocument();
});

// Dynamic bounds test
it('updates aria-valuemin/max dynamically', async () => {
  const user = userEvent.setup();
  render(<MultiThumbSlider defaultValue={[20, 80]} aria-label={['Min', 'Max']} />);

  const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

  // Lower thumb's max should be upper value
  expect(lowerThumb).toHaveAttribute('aria-valuemax', '80');
  // Upper thumb's min should be lower value
  expect(upperThumb).toHaveAttribute('aria-valuemin', '20');

  // Move lower thumb
  lowerThumb.focus();
  await user.keyboard('{ArrowRight}');

  // Upper thumb's min should update
  expect(upperThumb).toHaveAttribute('aria-valuemin', '21');
});

// Collision prevention test
it('prevents thumbs from crossing', async () => {
  const user = userEvent.setup();
  render(<MultiThumbSlider defaultValue={[50, 55]} aria-label={['Min', 'Max']} />);

  const [lowerThumb] = screen.getAllByRole('slider');
  lowerThumb.focus();

  // Try to move lower thumb past upper
  for (let i = 0; i < 10; i++) {
    await user.keyboard('{ArrowRight}');
  }

  // Should stop at upper value
  expect(lowerThumb).toHaveAttribute('aria-valuenow', '55');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has two sliders in a group', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const group = page.getByRole('group');
  const sliders = group.getByRole('slider');

  await expect(sliders).toHaveCount(2);
});

// Dynamic bounds test
test('updates dynamic bounds on thumb movement', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

  await lowerThumb.focus();
  await page.keyboard.press('ArrowRight');

  const newMin = await upperThumb.getAttribute('aria-valuemin');
  expect(Number(newMin)).toBeGreaterThan(20); // Original lower value
});

// Collision prevention test
test('prevents thumb crossing via keyboard', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

  // Get upper thumb's current value
  const upperValue = await upperThumb.getAttribute('aria-valuenow');

  await lowerThumb.focus();
  // Press End to try to go to max
  await page.keyboard.press('End');

  // Lower thumb should stop at upper value
  const lowerValue = await lowerThumb.getAttribute('aria-valuenow');
  expect(Number(lowerValue)).toBeLessThanOrEqual(Number(upperValue));
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/slider-multithumb/react/');
  const group = page.getByRole('group').first();
  await group.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="group"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
