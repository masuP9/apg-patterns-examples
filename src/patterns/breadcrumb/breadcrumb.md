# Breadcrumb Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/

## Overview

A breadcrumb trail shows the user's location in a site hierarchy and provides navigation to ancestor pages.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `navigation` | <nav> element | Provides a navigation landmark for assistive technology (implicit role of <nav>) |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | <nav> | "Breadcrumb" (or localized) | Yes | Labels the navigation landmark for screen readers |
| `aria-current` | [object Object] | "page" | Yes | Identifies the current page within the breadcrumb trail |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-current` | Last item in the breadcrumb (current page) | "page" | Yes | Indicates the current page location within the breadcrumb navigation. |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Tab` | Move focus between breadcrumb links |
| `Enter` | Activate the focused link |

## Test Checklist

### High Priority: ARIA

- [ ] <nav> element is used
- [ ] <nav> has aria-label="Breadcrumb" (or localized)
- [ ] Last item has aria-current="page"
- [ ] Links use native <a> elements
- [ ] Uses ordered list (<ol>) for hierarchy
- [ ] Each breadcrumb is a list item (<li>)
- [ ] Current page is identifiable (text or aria-current)

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] Visual separators are decorative (hidden from AT)

## Implementation Notes

Structure:
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/products">Products</a></li>
    <li><a href="/products/shoes" aria-current="page">Shoes</a></li>
  </ol>
</nav>

Separators:
- Use CSS (::before/::after) for visual separators
- Do NOT use text separators that are read by screen readers
- If using icons, add aria-hidden="true"

Current Page Options:
1. Link with aria-current="page" (navigable)
2. Plain text (not linked) - less common

Screen Reader Announcement:
"Breadcrumb navigation, list, 3 items, Home, link, 1 of 3, Products, link, 2 of 3, Shoes, link, current page, 3 of 3"

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';

// Navigation landmark
it('has navigation with aria-label', () => {
  render(<Breadcrumb items={items} />);
  expect(screen.getByRole('navigation', { name: /breadcrumb/i }))
    .toBeInTheDocument();
});

// Current page
it('marks current page with aria-current', () => {
  render(<Breadcrumb items={items} />);
  const currentLink = screen.getByRole('link', { name: 'Shoes' });
  expect(currentLink).toHaveAttribute('aria-current', 'page');
});

// List structure
it('uses ordered list', () => {
  render(<Breadcrumb items={items} />);
  expect(screen.getByRole('list')).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Helper to get breadcrumb navigation
const getBreadcrumb = (page) => {
  return page.locator('nav[aria-label*="Breadcrumb"], nav[aria-label*="breadcrumb"]').first();
};

// ARIA Structure: nav element with aria-label
test('uses nav element with aria-label containing "Breadcrumb"', async ({ page }) => {
  await page.goto('patterns/breadcrumb/react/demo/');

  const nav = getBreadcrumb(page);
  await expect(nav).toBeAttached();

  const ariaLabel = await nav.getAttribute('aria-label');
  expect(ariaLabel?.toLowerCase()).toContain('breadcrumb');
});

// ARIA Structure: Last item has aria-current="page"
test('last item has aria-current="page"', async ({ page }) => {
  await page.goto('patterns/breadcrumb/react/demo/');

  const nav = getBreadcrumb(page);
  const currentPageElement = nav.locator('[aria-current="page"]');
  await expect(currentPageElement.first()).toBeAttached();
});

// Accessibility: No axe-core violations
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/breadcrumb/react/demo/');

  const nav = getBreadcrumb(page);
  await nav.waitFor();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('nav[aria-label*="Breadcrumb"]')
    .analyze();

  expect(accessibilityScanResults.violations).toEqual([]);
});
```
