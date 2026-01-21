# Toolbar Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/

## Overview

A toolbar is a container for grouping a set of controls, such as buttons, toggle buttons, or checkboxes. It provides a single tab stop for keyboard navigation with arrow keys moving between controls.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `toolbar` | Container | Container for grouping controls |
| `button` | Button elements | Implicit role for <button> elements |
| `separator` | Separator | Visual and semantic separator between groups |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | toolbar | String | Yes | Accessible name for the toolbar |
| `aria-labelledby` | toolbar | ID reference | Yes | Alternative to aria-label (takes precedence) |
| `aria-orientation` | toolbar | `"horizontal"` \| `"vertical"` | No | Orientation of the toolbar (default: horizontal) |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-pressed` | ToolbarToggleButton | `true` \| `false` | Yes | Click, Enter, Space |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Tab` | Move focus into/out of the toolbar (single tab stop) |
| `Arrow Right / Arrow Left` | Navigate between controls (horizontal toolbar) |
| `Arrow Down / Arrow Up` | Navigate between controls (vertical toolbar) |
| `Home` | Move focus to first control |
| `End` | Move focus to last control |
| `Enter / Space` | Activate button / toggle pressed state |

## Focus Management

- Roving Tabindex: Only one control has tabindex="0" at a time
- Other controls: Other controls have tabindex="-1"
- Arrow keys: Arrow keys move focus between controls
- Disabled/Separator: Disabled controls and separators are skipped
- No wrap: Focus does not wrap (stops at edges)

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="toolbar"
- [ ] Toolbar has aria-label or aria-labelledby
- [ ] aria-orientation reflects horizontal/vertical
- [ ] Toggle buttons have aria-pressed
- [ ] Separator has role="separator"

### High Priority: Keyboard

- [ ] ArrowRight/Left navigates horizontal toolbar
- [ ] ArrowDown/Up navigates vertical toolbar
- [ ] Home/End move to first/last item
- [ ] Focus does not wrap at edges
- [ ] Disabled items are skipped

### High Priority: Focus Management

- [ ] Roving tabindex implemented correctly

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

## Structure

```html
<div role="toolbar" aria-label="Text formatting" aria-orientation="horizontal">
  <button type="button" tabindex="0" aria-pressed="false">Bold</button>
  <button type="button" tabindex="-1" aria-pressed="false">Italic</button>
  <div role="separator" aria-orientation="vertical"></div>
  <button type="button" tabindex="-1">Copy</button>
  <button type="button" tabindex="-1" disabled>Paste</button>
</div>
```

## Key Implementation Points

1. **Roving Tabindex**: Only one button has tabindex="0" at a time
2. **Orientation**: Arrow keys depend on aria-orientation
3. **Skip Disabled**: Disabled buttons and separators are skipped during navigation
4. **No Wrap**: Focus stops at edges (does not loop)
5. **Toggle Buttons**: Use aria-pressed for toggle state

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// ARIA Structure
it('has toolbar role', () => {
  render(<Toolbar aria-label="Actions"><ToolbarButton>Copy</ToolbarButton></Toolbar>);
  expect(screen.getByRole('toolbar')).toBeInTheDocument();
});

// Keyboard Navigation
it('ArrowRight moves focus to next button', async () => {
  const user = userEvent.setup();
  render(
    <Toolbar aria-label="Actions">
      <ToolbarButton>Copy</ToolbarButton>
      <ToolbarButton>Paste</ToolbarButton>
    </Toolbar>
  );

  const buttons = screen.getAllByRole('button');
  buttons[0].focus();
  await user.keyboard('{ArrowRight}');

  expect(buttons[1]).toHaveFocus();
});

// Toggle Button
it('toggles aria-pressed on click', async () => {
  const user = userEvent.setup();
  render(
    <Toolbar aria-label="Formatting">
      <ToolbarToggleButton>Bold</ToolbarToggleButton>
    </Toolbar>
  );

  const toggle = screen.getByRole('button', { name: 'Bold' });
  expect(toggle).toHaveAttribute('aria-pressed', 'false');

  await user.click(toggle);
  expect(toggle).toHaveAttribute('aria-pressed', 'true');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has correct ARIA structure', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');
  const toolbar = page.getByRole('toolbar');

  await expect(toolbar).toBeVisible();
  await expect(toolbar).toHaveAttribute('aria-label');
});

// Keyboard Navigation
test('arrow keys navigate between buttons', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');
  const toolbar = page.getByRole('toolbar').first();
  const buttons = toolbar.getByRole('button');

  await buttons.first().click();
  await page.keyboard.press('ArrowRight');

  await expect(buttons.nth(1)).toBeFocused();
});

// axe-core
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/toolbar/react/');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="toolbar"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
