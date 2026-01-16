# Slider (Multi-Thumb) Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/slider-multithumb/

## Overview

A multi-thumb slider allows users to select a range by moving **exactly two thumbs** along a track. Common use cases include price range filters, date range selectors, and audio frequency bands. Each thumb operates independently but cannot cross the other thumb.

> **Scope**: This implementation targets **two-thumb range sliders only**. For 3+ thumbs, each thumb would need neighbor-based bounds (bounded by adjacent thumbs), which is beyond this implementation.

## Key Difference from Single Slider

**CRITICAL**: Unlike single slider, multi-thumb slider has **dynamic ARIA bounds**:
- Lower thumb's `aria-valuemax` = upper thumb's `aria-valuenow` **- minDistance**
- Upper thumb's `aria-valuemin` = lower thumb's `aria-valuenow` **+ minDistance**

This ensures screen readers announce the valid range for each thumb while respecting the minimum distance constraint.

When `minDistance = 0` (default), bounds equal the other thumb's value directly.

## ARIA Requirements

### Roles

| Role | Element | Required | Description |
| --- | --- | --- | --- |
| `slider` | Each thumb element | Yes | Identifies each thumb as a slider control |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | each slider | number | Yes | Current value of this thumb |
| `aria-valuemin` | each slider | number | Yes | **Dynamic**: depends on other thumb |
| `aria-valuemax` | each slider | number | Yes | **Dynamic**: depends on other thumb |
| `aria-valuetext` | each slider | string | No | Human-readable value (e.g., "$50") |
| `aria-label` | each slider | string | Conditional | When no visible label |
| `aria-labelledby` | each slider | ID ref | Conditional | When visible label exists |
| `aria-orientation` | each slider | `horizontal` / `vertical` | No | Only set when vertical |
| `aria-disabled` | each slider | `true` / `false` | No | When slider is disabled |

### Dynamic Bounds Rules

```
Lower thumb (index 0):
  aria-valuemin = props.min (absolute)
  aria-valuemax = values[1] - minDistance

Upper thumb (index 1):
  aria-valuemin = values[0] + minDistance
  aria-valuemax = props.max (absolute)
```

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | each slider | number | Yes | User interaction |
| `aria-valuemin` | each slider | number | Yes | **Other thumb moves** |
| `aria-valuemax` | each slider | number | Yes | **Other thumb moves** |
| `aria-valuetext` | each slider | string | No | Value change (when format used) |

## Keyboard Support

| Key | Action | Constraint |
| --- | --- | --- |
| `ArrowRight` | Increase value by step | Cannot exceed other thumb (- minDistance) |
| `ArrowUp` | Increase value by step | Cannot exceed other thumb (- minDistance) |
| `ArrowLeft` | Decrease value by step | Cannot go below other thumb (+ minDistance) |
| `ArrowDown` | Decrease value by step | Cannot go below other thumb (+ minDistance) |
| `Home` | Set to **dynamic** minimum | Lower: absolute min, Upper: lower value + minDistance |
| `End` | Set to **dynamic** maximum | Lower: upper value - minDistance, Upper: absolute max |
| `Page Up` | Increase by large step | Respects thumb constraints |
| `Page Down` | Decrease by large step | Respects thumb constraints |

**Note**: Home/End go to **dynamic bounds** (including minDistance), not absolute min/max.

### RTL (Right-to-Left) Behavior

In RTL layouts, `ArrowLeft` and `ArrowRight` should maintain their **logical** direction:
- `ArrowRight` always increases value (toward max)
- `ArrowLeft` always decreases value (toward min)

Visual position may differ, but keyboard semantics remain consistent.

## Focus Management

- Each thumb has `tabindex="0"` independently
- Tab order follows DOM order (always lower thumb first, then upper)
- Tab order is **constant** regardless of thumb visual positions
- `tabindex="-1"` when disabled
- Focus stays on active thumb during pointer drag
- Track click moves focus to the activated thumb

## Test Checklist

### High Priority: ARIA

- [ ] Each thumb has `role="slider"`
- [ ] Each thumb has `aria-valuenow` set to current value
- [ ] Lower thumb `aria-valuemin` = absolute min
- [ ] Lower thumb `aria-valuemax` = upper thumb value (dynamic)
- [ ] Upper thumb `aria-valuemin` = lower thumb value (dynamic)
- [ ] Upper thumb `aria-valuemax` = absolute max
- [ ] `aria-valuemin` updates when lower thumb moves
- [ ] `aria-valuemax` updates when upper thumb moves
- [ ] Each thumb has accessible name
- [ ] `aria-valuetext` updates with format/getAriaValueText
- [ ] `aria-orientation="vertical"` only when vertical
- [ ] `aria-disabled="true"` when disabled

### High Priority: Keyboard

- [ ] ArrowRight/Up increases value by step
- [ ] ArrowLeft/Down decreases value by step
- [ ] Lower thumb cannot exceed upper thumb
- [ ] Upper thumb cannot go below lower thumb
- [ ] Home on lower thumb goes to absolute min
- [ ] Home on upper thumb goes to lower thumb value + minDistance
- [ ] End on lower thumb goes to upper thumb value - minDistance
- [ ] End on upper thumb goes to absolute max
- [ ] PageUp/PageDown uses largeStep
- [ ] PageUp/PageDown respects constraints
- [ ] Keys have no effect when disabled

### High Priority: Focus

- [ ] Both thumbs have tabindex="0"
- [ ] Tab visits lower thumb first, then upper
- [ ] Tab order constant regardless of values
- [ ] Thumbs not focusable when disabled (tabindex="-1")
- [ ] Focus visible on focus-visible
- [ ] Focus stays on thumb during drag
- [ ] Track click moves focus to activated thumb

### Medium Priority: Pointer

- [ ] Thumb drag changes value
- [ ] Track click updates nearest thumb
- [ ] Track click tie-breaker is deterministic
- [ ] Drag continues when pointer leaves thumb (pointer capture)
- [ ] Pointer does not switch thumbs mid-drag
- [ ] minDistance enforced during drag
- [ ] Vertical slider drag works correctly
- [ ] Disabled slider ignores pointer events

### Medium Priority: Accessibility

- [ ] No axe-core violations
- [ ] No axe violations when disabled
- [ ] Focus visible indicator meets WCAG

### Low Priority: Props

- [ ] `className` applied to container
- [ ] `onValueChange(values, activeIndex)` fires on change
- [ ] `onValueCommit(values)` fires on pointer up/blur
- [ ] `defaultValue` sets initial values
- [ ] `value` prop works for controlled mode
- [ ] Decimal `step` values work correctly

## Implementation Notes

### Props Design

```typescript
type MultiThumbSliderProps = {
  // Values
  value?: [number, number];           // Controlled
  defaultValue?: [number, number];    // Uncontrolled (default: [min, max])
  min?: number;                       // Default: 0
  max?: number;                       // Default: 100
  step?: number;                      // Default: 1
  largeStep?: number;                 // Default: step * 10
  minDistance?: number;               // Default: 0

  // Appearance
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  showValues?: boolean;               // Default: true
  format?: string;                    // e.g., "${value}"

  // Labels (one required)
  'aria-label'?: [string, string];
  'aria-labelledby'?: [string, string];
  getAriaLabel?: (index: number) => string;

  // Value text
  getAriaValueText?: (value: number, index: number) => string;

  // Callbacks
  onValueChange?: (values: [number, number], activeThumbIndex: number) => void;
  onValueCommit?: (values: [number, number]) => void;

  // Other
  className?: string;
  id?: string;
  'aria-describedby'?: string | [string, string];
};
```

### Group Labeling

For accessibility, the slider set should have a group label:

```html
<div role="group" aria-labelledby="price-range-label">
  <span id="price-range-label">Price Range</span>
  <!-- thumbs here -->
</div>
```

Or use `aria-label` on the group container if no visible label exists.

### Edge Case Handling

```typescript
// Invalid initial values: clamp and ensure lower < upper
const normalizeValues = (
  values: [number, number],
  min: number,
  max: number,
  minDistance: number
): [number, number] => {
  let [lower, upper] = values;

  // Clamp to absolute bounds
  lower = clamp(lower, min, max - minDistance);
  upper = clamp(upper, min + minDistance, max);

  // Ensure lower <= upper - minDistance
  if (lower > upper - minDistance) {
    // Prefer keeping upper, adjust lower
    lower = upper - minDistance;
  }

  return [lower, upper];
};

// If minDistance > (max - min), it's an invalid configuration
// Should warn in development and fallback to minDistance = 0
```

### Structure

```
┌─────────────────────────────────────────────────────────────────┐
│ <div role="group" aria-labelledby="label" class="...">          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ <div class="apg-slider-multithumb-track">                   │ │
│ │   <div class="apg-slider-multithumb-range" />  ← 選択範囲   │ │
│ │   <div                                                      │ │
│ │     role="slider"                                           │ │
│ │     class="apg-slider-multithumb-thumb"                     │ │
│ │     tabindex="0"                                            │ │
│ │     aria-valuenow="20"                                      │ │
│ │     aria-valuemin="0"        ← absolute min                 │ │
│ │     aria-valuemax="80"       ← upper thumb value            │ │
│ │     aria-label="Minimum"                                    │ │
│ │   />                                                        │ │
│ │   <div                                                      │ │
│ │     role="slider"                                           │ │
│ │     class="apg-slider-multithumb-thumb"                     │ │
│ │     tabindex="0"                                            │ │
│ │     aria-valuenow="80"                                      │ │
│ │     aria-valuemin="20"       ← lower thumb value            │ │
│ │     aria-valuemax="100"      ← absolute max                 │ │
│ │     aria-label="Maximum"                                    │ │
│ │   />                                                        │ │
│ │ </div>                                                      │ │
│ └─────────────────────────────────────────────────────────────┘ │
│ <div class="apg-slider-multithumb-values" aria-hidden="true">   │
│   <span>20</span> - <span>80</span>                             │
│ </div>                                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Value Calculation

```typescript
// Clamp value to range
const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

// Round to step (avoid floating point drift)
const roundToStep = (value: number, step: number, min: number) => {
  const steps = Math.round((value - min) / step);
  const result = min + steps * step;
  const decimalPlaces = (step.toString().split('.')[1] || '').length;
  return Number(result.toFixed(decimalPlaces));
};

// Get dynamic bounds for a thumb
const getThumbBounds = (
  index: number,
  values: [number, number],
  min: number,
  max: number,
  minDistance: number
) => {
  if (index === 0) {
    return { min: min, max: values[1] - minDistance };
  } else {
    return { min: values[0] + minDistance, max: max };
  }
};

// Update value with constraints
const updateThumbValue = (
  index: number,
  newValue: number,
  values: [number, number],
  min: number,
  max: number,
  step: number,
  minDistance: number
): [number, number] => {
  const bounds = getThumbBounds(index, values, min, max, minDistance);
  const rounded = roundToStep(newValue, step, min);
  const clamped = clamp(rounded, bounds.min, bounds.max);

  const newValues: [number, number] = [...values];
  newValues[index] = clamped;
  return newValues;
};
```

### Keyboard Handler

```typescript
const handleKeyDown = (index: number) => (event: KeyboardEvent) => {
  if (disabled) return;

  const bounds = getThumbBounds(index, values, min, max, minDistance);
  let newValue = values[index];

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowUp':
      newValue = values[index] + step;
      break;
    case 'ArrowLeft':
    case 'ArrowDown':
      newValue = values[index] - step;
      break;
    case 'Home':
      newValue = bounds.min; // Dynamic min!
      break;
    case 'End':
      newValue = bounds.max; // Dynamic max!
      break;
    case 'PageUp':
      newValue = values[index] + largeStep;
      break;
    case 'PageDown':
      newValue = values[index] - largeStep;
      break;
    default:
      return;
  }

  event.preventDefault();
  const newValues = updateThumbValue(index, newValue, values, min, max, step, minDistance);
  setValues(newValues);
  onValueChange?.(newValues, index);
};
```

### Track Click Handler

```typescript
const handleTrackClick = (event: PointerEvent) => {
  if (disabled) return;

  const clickValue = getValueFromPointer(event);

  // Determine which thumb to move (nearest, with tie-breaker)
  const distToLower = Math.abs(clickValue - values[0]);
  const distToUpper = Math.abs(clickValue - values[1]);

  // Tie-breaker: prefer lower thumb when equidistant
  const activeIndex = distToLower <= distToUpper ? 0 : 1;

  const newValues = updateThumbValue(
    activeIndex,
    clickValue,
    values,
    min,
    max,
    step,
    minDistance
  );

  setValues(newValues);
  onValueChange?.(newValues, activeIndex);

  // Move focus to the activated thumb
  thumbRefs[activeIndex].current?.focus();
};
```

### Common Pitfalls

1. **Static ARIA bounds**: Must update `aria-valuemin`/`max` dynamically based on other thumb
2. **Home/End to absolute**: Home/End must go to dynamic bounds, not absolute min/max
3. **Stale bounds**: Compute bounds on every render, don't memoize values array
4. **Rounding before clamp**: Apply `roundToStep` before clamping to avoid stepping outside bounds
5. **Thumb identity**: Don't reorder values array - always clamp, never swap thumbs
6. **Pointer capture**: Use setPointerCapture to prevent thumb switching during drag
7. **Track click tie-breaker**: Define deterministic behavior when click is equidistant

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('MultiThumbSlider', () => {
  // Dynamic ARIA bounds test
  it('updates upper thumb aria-valuemin when lower thumb moves', async () => {
    const user = userEvent.setup();
    render(
      <MultiThumbSlider
        defaultValue={[20, 80]}
        aria-label={['Minimum', 'Maximum']}
      />
    );

    const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

    // Initial state
    expect(upperThumb).toHaveAttribute('aria-valuemin', '20');

    // Move lower thumb
    await user.click(lowerThumb);
    await user.keyboard('{ArrowRight}');

    // Upper thumb's aria-valuemin should update
    expect(lowerThumb).toHaveAttribute('aria-valuenow', '21');
    expect(upperThumb).toHaveAttribute('aria-valuemin', '21');
  });

  // Home/End dynamic bounds test
  it('Home on upper thumb goes to lower thumb value, not absolute min', async () => {
    const user = userEvent.setup();
    render(
      <MultiThumbSlider
        defaultValue={[30, 70]}
        min={0}
        max={100}
        aria-label={['Minimum', 'Maximum']}
      />
    );

    const [, upperThumb] = screen.getAllByRole('slider');

    await user.click(upperThumb);
    await user.keyboard('{Home}');

    // Should go to lower thumb value (30), not absolute min (0)
    expect(upperThumb).toHaveAttribute('aria-valuenow', '30');
  });

  // Collision test
  it('lower thumb cannot exceed upper thumb', async () => {
    const user = userEvent.setup();
    render(
      <MultiThumbSlider
        defaultValue={[49, 50]}
        aria-label={['Minimum', 'Maximum']}
      />
    );

    const [lowerThumb] = screen.getAllByRole('slider');

    await user.click(lowerThumb);
    await user.keyboard('{ArrowRight}'); // Try to go to 50
    await user.keyboard('{ArrowRight}'); // Try to exceed

    expect(lowerThumb).toHaveAttribute('aria-valuenow', '50');
  });

  // Tab order test
  it('Tab order is constant regardless of thumb positions', async () => {
    const user = userEvent.setup();
    render(
      <MultiThumbSlider
        defaultValue={[80, 90]} // Lower thumb visually on right
        aria-label={['Minimum', 'Maximum']}
      />
    );

    const [lowerThumb, upperThumb] = screen.getAllByRole('slider');

    await user.tab();
    expect(lowerThumb).toHaveFocus();

    await user.tab();
    expect(upperThumb).toHaveFocus();
  });

  // axe test
  it('has no axe violations', async () => {
    const { container } = render(
      <MultiThumbSlider aria-label={['Minimum', 'Maximum']} />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('MultiThumbSlider', () => {
  test('dynamic aria-valuemin/max updates', async ({ page }) => {
    await page.goto('/patterns/slider-multithumb/react/demo/');
    await page.getByRole('slider').first().waitFor();

    const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

    // Check initial bounds
    await expect(lowerThumb).toHaveAttribute('aria-valuemax', '80');
    await expect(upperThumb).toHaveAttribute('aria-valuemin', '20');

    // Move lower thumb
    await lowerThumb.focus();
    await page.keyboard.press('ArrowRight');

    // Bounds should update
    await expect(upperThumb).toHaveAttribute('aria-valuemin', '21');
  });

  test('Home/End respect dynamic bounds', async ({ page }) => {
    await page.goto('/patterns/slider-multithumb/react/demo/');
    const [lowerThumb, upperThumb] = await page.getByRole('slider').all();

    // Upper thumb: Home goes to lower value
    await upperThumb.focus();
    await page.keyboard.press('Home');
    await expect(upperThumb).toHaveAttribute('aria-valuenow', '20');

    // Lower thumb: End goes to upper value
    await lowerThumb.focus();
    await page.keyboard.press('End');
    await expect(lowerThumb).toHaveAttribute('aria-valuenow', '20');
  });

  test('has no axe violations', async ({ page }) => {
    await page.goto('/patterns/slider-multithumb/react/demo/');
    await page.getByRole('slider').first().waitFor();

    const results = await new AxeBuilder({ page })
      .include('.apg-slider-multithumb')
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```
