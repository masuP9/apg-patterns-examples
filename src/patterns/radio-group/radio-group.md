# Radio Group Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/radio/

## Overview

A radio group is a set of checkable buttons, known as radio buttons, where no more than one of the buttons can be checked at a time.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `radiogroup` | Container element | Groups radio buttons together. Must have an accessible name via aria-label or aria-labelledby. |
| `radio` | Each option element | Identifies the element as a radio button. Only one radio in a group can be checked at a time. |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-orientation` | radiogroup | `horizontal` \| `vertical` | No | Indicates the orientation of the radio group. Vertical is the default. Only set when horizontal. |
| `aria-label` | radiogroup | String | Yes | Accessible name for the radio group |
| `aria-labelledby` | radiogroup | ID reference | Yes | Alternative to aria-label |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-checked` | Each radio | `true` \| `false` | Yes | Click, Space, Arrow keys |
| `aria-disabled` | Disabled radio | true | No |  |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Tab` | Move focus into the group (to selected or first radio) |
| `Shift + Tab` | Move focus out of the group |
| `Space` | Select the focused radio (does not unselect) |
| `ArrowDown / ArrowRight` | Move to next radio and select (wraps to first) |
| `ArrowUp / ArrowLeft` | Move to previous radio and select (wraps to last) |
| `Home` | Move to first radio and select |
| `End` | Move to last radio and select |

## Focus Management

- Roving tabindex: Only one radio in the group is tabbable at any time
- Selected radio: Has <code>tabindex="0"</code>
- If none selected: First enabled radio has <code>tabindex="0"</code>
- All other radios: Have <code>tabindex="-1"</code>
- Disabled radios: Always have <code>tabindex="-1"</code>

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="radiogroup"
- [ ] Each option has role="radio"
- [ ] Selected radio has aria-checked="true"

### High Priority: Keyboard

- [ ] Arrow keys move and select
- [ ] Space selects focused radio

### High Priority: Focus Management

- [ ] Tab enters group to selected/first radio
- [ ] Roving tabindex implemented correctly

### High Priority: Click Behavior

- [ ] Click selects radio

### High Priority: Behavior

- [ ] Disabled radios skipped during navigation

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

## Structure

```html
<div role="radiogroup" aria-label="Pizza size">
  <div role="radio" aria-checked="false" tabindex="-1" aria-labelledby="small-label">
    <span id="small-label">Small</span>
  </div>
  <div role="radio" aria-checked="true" tabindex="0" aria-labelledby="medium-label">
    <span id="medium-label">Medium</span>
  </div>
  <div role="radio" aria-checked="false" tabindex="-1" aria-labelledby="large-label">
    <span id="large-label">Large</span>
  </div>
</div>
```

## Key Implementation Points

1. **Roving Tabindex**: Only selected (or first if none) radio has tabindex="0"
2. **Selection follows focus**: Arrow keys both move focus AND select
3. **Wrapping**: Navigation wraps from last to first and vice versa
4. **Disabled handling**: Disabled radios are skipped during arrow navigation
5. **Single selection**: Only one radio can be checked at a time

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has radiogroup role', () => {
  render(<RadioGroup options={options} />);
  expect(screen.getByRole('radiogroup')).toBeInTheDocument();
});

// Keyboard navigation with selection
it('ArrowDown moves and selects next radio', async () => {
  const user = userEvent.setup();
  render(<RadioGroup options={options} />);

  const radios = screen.getAllByRole('radio');
  radios[0].focus();
  await user.keyboard('{ArrowDown}');

  expect(radios[1]).toHaveFocus();
  expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  expect(radios[0]).toHaveAttribute('aria-checked', 'false');
});

// Wrapping
it('wraps from last to first', async () => {
  const user = userEvent.setup();
  render(<RadioGroup options={options} value={options[2].value} />);

  const radios = screen.getAllByRole('radio');
  radios[2].focus();
  await user.keyboard('{ArrowDown}');

  expect(radios[0]).toHaveFocus();
  expect(radios[0]).toHaveAttribute('aria-checked', 'true');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');
  const radiogroup = page.getByRole('radiogroup');
  const radios = page.getByRole('radio');

  await expect(radiogroup).toHaveAttribute('aria-label');
  await expect(radios).toHaveCount(3);
});

// Click interaction
test('clicking radio selects it', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');
  const radios = page.getByRole('radio');

  await radios.nth(1).click();

  await expect(radios.nth(1)).toHaveAttribute('aria-checked', 'true');
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/radio-group/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="radiogroup"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
