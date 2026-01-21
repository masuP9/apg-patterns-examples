# Link Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/link/

## Overview

A link is an interactive element that navigates to a resource when activated. Provides keyboard-accessible navigation with proper screen reader announcement.

## Native HTML vs Custom Implementation

| Use Case | Recommended |
| --- | --- |
| Standard navigation | Native `<a href>` |
| JavaScript-driven navigation | Native `<a href>` with `event.preventDefault()` |
| Non-link element that navigates | Custom `role="link"` (educational purposes only) |

### Native vs Custom Comparison

| Feature | Native | Custom |
| --- | --- | --- |
| Ctrl/Cmd + Click (new tab) | Built-in | Not supported |
| Right-click context menu | Full menu | Limited |
| Copy link address | Built-in | Not supported |
| Drag to bookmarks | Built-in | Not supported |
| SEO recognition | Crawled | May be ignored |
| Works without JavaScript | Yes | No |
| Screen reader announcement | Automatic | Requires ARIA |
| Focus management | Automatic | Requires tabindex |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `link` | <a href> or element with role="link" | Identifies the element as a hyperlink. Native <a href> has this role implicitly. |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `tabindex` | Custom element | `0 (focusable)` \| `-1 (not focusable)` | Yes | Required for custom implementations. Native <a href> is focusable by default. Set to -1 when disabled. |
| `aria-label` | Link element | string | No | Provides an invisible label for the link when no visible text |
| `aria-labelledby` | Link element | ID reference | No | References an external element as the label |
| `aria-current` | Link element | `page` \| `step` \| `location` \| `date` \| `time` \| `true` | No | Indicates the current item within a set (e.g., current page in navigation) |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-disabled` | Link element | `true` \| `false` | No | Disabled state change |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Enter` | Activate the link and navigate to the target resource |
| `Tab` | Move focus to the next focusable element |
| `Shift + Tab` | Move focus to the previous focusable element |

## Focus Management

- Native <a href>: Focusable by default
- Custom links: Require tabindex="0"
- Disabled links: Use tabindex="-1" (removed from tab order)

## Test Checklist

### High Priority: ARIA

- [ ] role="link" exists (implicit via native or explicit)
- [ ] tabindex="0" on custom link element
- [ ] Accessible name from text content
- [ ] Accessible name from aria-label when no text
- [ ] aria-disabled="true" when disabled
- [ ] tabindex="-1" when disabled

### High Priority: Keyboard

- [ ] Enter key activates link
- [ ] Space key does NOT activate link
- [ ] Ignores keydown when event.isComposing === true (IME)
- [ ] Ignores keydown when event.defaultPrevented === true

### High Priority: Click Behavior

- [ ] Click activates link
- [ ] Disabled link ignores click
- [ ] Disabled link ignores Enter key

### High Priority: Focus Management

- [ ] Focusable via Tab key
- [ ] Not focusable when disabled

### Medium Priority: Accessibility

- [ ] No axe-core violations (all states)

## Implementation Notes

### Common Pitfalls

1. **Space key**: Links are activated by Enter only, NOT Space. Space scrolls the page.

2. **IME input**: Check `event.isComposing` to avoid triggering during IME composition.

3. **Security for `target="_blank"`**: Always use `noopener,noreferrer` with `window.open()`.

4. **Disabled state**: Use both `aria-disabled="true"` AND `tabindex="-1"`. Prevent click/keydown handlers.

### Structure (Custom Implementation)

```
<span
  role="link"
  tabindex="0" (or "-1" when disabled)
  aria-disabled="false" (or "true")
>
  Link Text
</span>
```

### Navigation Logic

```typescript
const navigate = (href: string, target?: string) => {
  if (target === '_blank') {
    window.open(href, '_blank', 'noopener,noreferrer');
  } else {
    window.location.href = href;
  }
};
```

### CSS Requirements

```css
[role="link"] {
  cursor: pointer;
  text-decoration: underline;
  color: var(--link-color, blue);
}

[role="link"]:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}

[role="link"][aria-disabled="true"] {
  cursor: not-allowed;
  opacity: 0.5;
  text-decoration: none;
}
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Role test
it('has role="link"', () => {
  render(<Link href="#">Click here</Link>);
  expect(screen.getByRole('link')).toBeInTheDocument();
});

// Accessible name test
it('has accessible name from text content', () => {
  render(<Link href="#">Learn more</Link>);
  expect(screen.getByRole('link', { name: 'Learn more' })).toBeInTheDocument();
});

// Enter key test
it('activates on Enter key', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick}>Click me</Link>);

  const link = screen.getByRole('link');
  link.focus();
  await user.keyboard('{Enter}');

  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Space key should NOT activate
it('does not activate on Space key', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick}>Click me</Link>);

  const link = screen.getByRole('link');
  link.focus();
  await user.keyboard(' ');

  expect(handleClick).not.toHaveBeenCalled();
});

// Disabled test
it('is not focusable when disabled', () => {
  render(<Link href="#" disabled>Disabled link</Link>);

  const link = screen.getByRole('link');
  expect(link).toHaveAttribute('tabindex', '-1');
  expect(link).toHaveAttribute('aria-disabled', 'true');
});

// Click test
it('calls onClick on click', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick}>Click me</Link>);

  await user.click(screen.getByRole('link'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});

// Disabled ignores interaction
it('does not call onClick when disabled', async () => {
  const handleClick = vi.fn();
  const user = userEvent.setup();
  render(<Link onClick={handleClick} disabled>Disabled</Link>);

  await user.click(screen.getByRole('link'));
  expect(handleClick).not.toHaveBeenCalled();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has role="link" and tabindex="0"', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const links = page.locator('[role="link"]');
  expect(await links.count()).toBeGreaterThan(0);

  // Enabled links should have tabindex="0"
  const enabledLink = page.locator('[role="link"]:not([aria-disabled="true"])').first();
  await expect(enabledLink).toHaveAttribute('tabindex', '0');
});

// Keyboard Interaction
test('activates on Enter key, not Space', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const link = page.locator('[role="link"]:not([aria-disabled="true"])').first();

  // Track keydown events
  await page.evaluate(() => {
    const links = document.querySelectorAll('[role="link"]:not([aria-disabled="true"])');
    links.forEach((link) => {
      (link as HTMLElement).dataset.enterPressed = 'false';
      link.addEventListener('keydown', (e) => {
        if ((e as KeyboardEvent).key === 'Enter') {
          e.preventDefault();
          (link as HTMLElement).dataset.enterPressed = 'true';
        }
      }, { capture: true });
    });
  });

  await link.focus();
  await page.keyboard.press('Enter');
  expect(await link.getAttribute('data-enter-pressed')).toBe('true');

  // Space should NOT activate (link should still be visible, no navigation)
  await page.keyboard.press('Space');
  await expect(link).toBeVisible();
});

// Disabled State
test('disabled link has aria-disabled and tabindex="-1"', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const disabledLink = page.locator('[role="link"][aria-disabled="true"]');

  if (await disabledLink.count() > 0) {
    await expect(disabledLink.first()).toHaveAttribute('aria-disabled', 'true');
    await expect(disabledLink.first()).toHaveAttribute('tabindex', '-1');
  }
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/link/react/demo/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[role="link"]')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```
