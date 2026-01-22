# Slider Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/slider/

## Overview

A slider is an input widget where the user selects a value from within a given range. The slider has a thumb that can be moved along a track to change the value.

### Native vs Custom Comparison

| Feature | Native | Custom |
| --- | --- | --- |
| Basic value selection | Recommended | Not needed |
| Keyboard support | Built-in | Manual implementation |
| JavaScript disabled support | Works natively | Requires fallback |
| Form integration | Built-in | Manual implementation |
| Custom styling | Limited (pseudo-elements) | Full control |
| Consistent cross-browser appearance | Varies significantly | Consistent |
| Vertical orientation | Limited browser support | Full control |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `slider` | Thumb element | Identifies the element as a slider that allows users to select a value from within a range |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | [object Object] | Number | Yes | Updated dynamically when value changes via keyboard or pointer |
| `aria-valuemin` | [object Object] | Number | Yes | Default: 0 |
| `aria-valuemax` | [object Object] | Number | Yes | Default: 100 |
| `aria-valuetext` | [object Object] | String | Yes | Example: "50%", "Medium", "3 of 5 stars" |
| `aria-orientation` | [object Object] | `"horizontal"` \| `"vertical"` | No | Default: horizontal (implicit). Only set for vertical sliders. |
| `aria-disabled` | [object Object] | `true` \| `undefined` | No | Set only when disabled |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Right Arrow` | Increases the value by one step |
| `Up Arrow` | Increases the value by one step |
| `Left Arrow` | Decreases the value by one step |
| `Down Arrow` | Decreases the value by one step |
| `Home` | Sets the slider to its minimum value |
| `End` | Sets the slider to its maximum value |
| `Page Up` | Increases the value by a large step (default: step * 10) |
| `Page Down` | Decreases the value by a large step (default: step * 10) |

## Test Checklist

### High Priority: ARIA

- [ ] Has role="slider"
- [ ] Has aria-valuenow attribute
- [ ] Has aria-valuemin attribute
- [ ] Has aria-valuemax attribute
- [ ] aria-valuenow updates on value change
- [ ] Has accessible name

### High Priority: Keyboard

- [ ] Right/Up Arrow increases value
- [ ] Left/Down Arrow decreases value
- [ ] Home sets to minimum
- [ ] End sets to maximum
- [ ] Page Up/Down changes value by large step
- [ ] Value clamped to min/max

### Medium Priority: Accessibility

- [ ] No axe-core violations
- [ ] Focus indicator visible

## Implementation Notes

## Native HTML Alternative

Consider using `<input type="range">` first:
```html
<label for="volume">Volume</label>
<input type="range" id="volume" min="0" max="100" value="50">
```

Use custom slider when:
- Custom styling beyond pseudo-elements
- Consistent cross-browser appearance
- Complex visual feedback during interaction

## Accessible Naming

One of these is required:
- **Visible label** (recommended) - Using label element or visible text
- `aria-label` - Invisible label
- `aria-labelledby` - Reference to external label element

## Structure

```
<div class="slider-container">
  <div role="slider"
       tabindex="0"
       aria-valuenow="50"
       aria-valuemin="0"
       aria-valuemax="100"
       aria-label="Volume"
       class="slider-thumb">
  </div>
</div>

Visual Layout:
├─────────●─────────────────────────┤
0        50                     100
```

## aria-valuetext

Use when numeric value needs context:
- "50%" instead of "50"
- "Medium" instead of "3"
- "3 of 5 stars" instead of "3"

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA attributes test
it('has correct ARIA attributes', () => {
  render(<Slider min={0} max={100} defaultValue={50} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  expect(slider).toHaveAttribute('aria-valuenow', '50');
  expect(slider).toHaveAttribute('aria-valuemin', '0');
  expect(slider).toHaveAttribute('aria-valuemax', '100');
});

// Keyboard navigation test
it('increases value on Arrow Right', async () => {
  const user = userEvent.setup();
  render(<Slider min={0} max={100} defaultValue={50} step={1} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  slider.focus();

  await user.keyboard('{ArrowRight}');
  expect(slider).toHaveAttribute('aria-valuenow', '51');
});

// Home/End test
it('sets to min on Home, max on End', async () => {
  const user = userEvent.setup();
  render(<Slider min={0} max={100} defaultValue={50} aria-label="Volume" />);

  const slider = screen.getByRole('slider');
  slider.focus();

  await user.keyboard('{Home}');
  expect(slider).toHaveAttribute('aria-valuenow', '0');

  await user.keyboard('{End}');
  expect(slider).toHaveAttribute('aria-valuenow', '100');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA structure test
test('has role="slider" with required attributes', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();

  await expect(slider).toHaveAttribute('role', 'slider');
  await expect(slider).toHaveAttribute('aria-valuenow');
  await expect(slider).toHaveAttribute('aria-valuemin');
  await expect(slider).toHaveAttribute('aria-valuemax');
});

// Keyboard navigation test
test('supports keyboard navigation', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();

  await slider.focus();
  const initialValue = await slider.getAttribute('aria-valuenow');

  await page.keyboard.press('ArrowRight');
  const newValue = await slider.getAttribute('aria-valuenow');
  expect(Number(newValue)).toBeGreaterThan(Number(initialValue));

  await page.keyboard.press('Home');
  const minValue = await slider.getAttribute('aria-valuemin');
  await expect(slider).toHaveAttribute('aria-valuenow', minValue);
});

// axe-core accessibility test
test('has no axe-core violations', async ({ page }) => {
  await page.goto('/patterns/slider/react/');
  const slider = page.getByRole('slider').first();
  await slider.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="slider"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
