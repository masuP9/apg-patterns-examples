# Alert Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/alert/

## Overview

An alert displays a brief, important message that attracts the user's attention without interrupting their task. Alerts are announced by screen readers immediately when content changes.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `alert` | Alert container | An element that displays a brief, important message that attracts the user's attention without interrupting their task |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Enter` | Activates the dismiss button (if present) |
| `Space` | Activates the dismiss button (if present) |

## Focus Management

- Alert must NOT move focus: Alerts are non-modal and should not interrupt user workflow by stealing focus
- Alert container is not focusable: The alert element should not have tabindex or receive keyboard focus
- Dismiss button is focusable: If present, the dismiss button can be reached via Tab navigation

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="alert"
- [ ] Live region exists in DOM before content
- [ ] Content changes are announced

### High Priority: Focus Management

- [ ] Alert does NOT steal focus
- [ ] Alert container is NOT focusable
- [ ] Dismiss button (if present) is focusable

### High Priority: Behavior

- [ ] Initial page load content is NOT announced
- [ ] Dynamic content changes ARE announced
- [ ] No auto-dismissal (or user control provided)

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

## Critical Implementation Rule

**The live region container MUST exist in the DOM from page load.**

```jsx
// WRONG: Dynamically adding live region
{showAlert && <div role="alert">Message</div>}

// CORRECT: Live region always exists, content changes
<div role="alert">
  {message && <span>{message}</span>}
</div>
```

## Structure

```
<!-- Container always in DOM -->
<div role="alert">
  <!-- Content added dynamically -->
  <span>Your changes have been saved.</span>
</div>

Announcement Behavior:
- Page load content: NOT announced
- Dynamic changes: ANNOUNCED immediately
- aria-live="assertive": interrupts current speech
```

## Alert vs Status

| role="alert" | role="status"        |
|--------------|----------------------|
| assertive    | polite               |
| interrupts   | waits for pause      |
| urgent info  | non-urgent updates   |

## Alert vs Alert Dialog

| Use Alert                         | Use Alert Dialog                   |
|-----------------------------------|------------------------------------|
| Informational, no action required | Requires immediate response        |
| Should NOT interrupt workflow     | Must acknowledge before continuing |
| Focus stays on current task       | Focus moves to dialog              |

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';

// Live region exists
it('has role="alert"', () => {
  render(<Alert message="Saved" />);
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

// Dynamic content announced
it('announces dynamic content', async () => {
  const { rerender } = render(<Alert message="" />);

  // Change content
  rerender(<Alert message="Changes saved" />);

  expect(screen.getByRole('alert')).toHaveTextContent('Changes saved');
});

// Does not steal focus
it('does not move focus', () => {
  const button = document.createElement('button');
  document.body.appendChild(button);
  button.focus();

  render(<Alert message="Saved" />);

  expect(document.activeElement).toBe(button);
  button.remove();
});

// Alert container not focusable
it('is not focusable', () => {
  render(<Alert message="Saved" />);
  const alert = screen.getByRole('alert');
  expect(alert).not.toHaveAttribute('tabindex');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure: Live region exists in DOM
test('has role="alert" on container', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const alert = page.locator('[role="alert"]');
  await expect(alert).toHaveAttribute('role', 'alert');
  await expect(alert).toBeAttached();
});

// Focus Management: Alert does NOT steal focus
test('does NOT steal focus when alert appears', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const infoButton = page.getByRole('button', { name: 'Info' });

  await infoButton.focus();
  await expect(infoButton).toBeFocused();

  await infoButton.click();

  // Focus should still be on the button, not on the alert
  await expect(infoButton).toBeFocused();
});

// Accessibility: No axe-core violations
test('has no axe-core violations (with message)', async ({ page }) => {
  await page.goto('patterns/alert/react/');
  const infoButton = page.getByRole('button', { name: 'Info' });

  await infoButton.click();
  await expect(page.locator('[role="alert"]')).toContainText('informational');

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="alert"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
