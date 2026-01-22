# Landmarks Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/

## Overview

Landmarks identify the major sections of a page. There are eight landmark roles that enable assistive technology users to efficiently navigate page structure.

### Native vs Custom Comparison

| Feature | Native | Custom |
| --- | --- | --- |
| `<header>` | banner | Only when direct child of `<body>` |
| `<nav>` | navigation | Always |
| `<main>` | main | Always |
| `<footer>` | contentinfo | Only when direct child of `<body>` |
| `<aside>` | complementary | Always |
| `<section>` | region | **Only when aria-label/labelledby is present** |
| `<form>` | form | **Only when aria-label/labelledby is present** |

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `banner` | `<header>` | Site-wide header |
| `navigation` | `<nav>` | Navigation links |
| `main` | `<main>` | Primary content |
| `contentinfo` | `<footer>` | Site-wide footer |
| `complementary` | `<aside>` | Supporting content |
| `region` | `<section>` | Named section |
| `search` | `<form role="search">` | Search functionality |
| `form` | `<form>` | Form area |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | [object Object] | String | Yes | Provides an accessible name for the landmark |
| `aria-labelledby` | [object Object] | ID reference | Yes | References a visible heading element |

## Keyboard Support

## Test Checklist

### High Priority: ARIA

- [ ] Has banner landmark (`<header>` or `role="banner"`)
- [ ] Has navigation landmark (`<nav>` or `role="navigation"`)
- [ ] Has main landmark (`<main>` or `role="main"`)
- [ ] Has contentinfo landmark (`<footer>` or `role="contentinfo"`)
- [ ] Has exactly one main landmark
- [ ] Banner is at top level (not inside article/aside/main/nav/section)
- [ ] Navigation landmarks have unique labels when multiple
- [ ] Region landmarks have accessible name (aria-label or aria-labelledby)
- [ ] Form landmarks have accessible name

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)

## Implementation Notes

Structure Diagram:
```
+-----------------------------------------------------------------+
| <header> role="banner"                                          |
| +-------------------------------------------------------------+ |
| | <nav aria-label="Main"> role="navigation"                   | |
| +-------------------------------------------------------------+ |
+-----------------------------------------------------------------+
+-----------------------------------------------------------------+
| <main> role="main"                                              |
| +---------------------+ +-------------------------------------+ |
| | <section            | | <aside aria-label="Related">       | |
| |   aria-labelledby>  | |   role="complementary"              | |
| |   role="region"     | |                                     | |
| +---------------------+ +-------------------------------------+ |
| +-------------------------------------------------------------+ |
| | <form role="search" aria-label="Site search">               | |
| +-------------------------------------------------------------+ |
| +-------------------------------------------------------------+ |
| | <form aria-label="Contact form"> role="form"                | |
| +-------------------------------------------------------------+ |
+-----------------------------------------------------------------+
+-----------------------------------------------------------------+
| <footer> role="contentinfo"                                     |
| +-------------------------------------------------------------+ |
| | <nav aria-label="Footer"> role="navigation"                 | |
| +-------------------------------------------------------------+ |
+-----------------------------------------------------------------+
```

Key Points:
- Prefer semantic HTML elements over ARIA roles
- header/footer only map to banner/contentinfo at body level
- section without label is NOT a region landmark
- form without label is NOT a form landmark
- <search> element has limited browser support, use <form role="search">

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';

// Has banner landmark
it('has banner landmark', () => {
  render(<LandmarkDemo />);
  expect(screen.getByRole('banner')).toBeInTheDocument();
});

// Has navigation landmarks with unique labels
it('has navigation landmarks with unique labels', () => {
  render(<LandmarkDemo />);
  const navs = screen.getAllByRole('navigation');
  const labels = navs.map(nav =>
    nav.getAttribute('aria-label') ||
    nav.querySelector('[aria-labelledby]')?.id
  );
  const uniqueLabels = new Set(labels);
  expect(uniqueLabels.size).toBe(navs.length);
});

// Has exactly one main landmark
it('has exactly one main landmark', () => {
  render(<LandmarkDemo />);
  expect(screen.getAllByRole('main')).toHaveLength(1);
});

// Region has accessible name
it('region has accessible name', () => {
  render(<LandmarkDemo />);
  const region = screen.getByRole('region');
  expect(region).toHaveAccessibleName();
});

// Search landmark exists
it('has search landmark', () => {
  render(<LandmarkDemo />);
  expect(screen.getByRole('search')).toBeInTheDocument();
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Landmark Roles
test('has all required landmarks', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const demo = page.locator('.apg-landmark-demo');

  await expect(demo.getByRole('banner')).toBeVisible();
  await expect(demo.getByRole('navigation').first()).toBeVisible();
  await expect(demo.getByRole('main')).toBeVisible();
  await expect(demo.getByRole('contentinfo')).toBeVisible();
  await expect(demo.getByRole('complementary')).toBeVisible();
  await expect(demo.getByRole('region')).toBeVisible();
  await expect(demo.getByRole('search')).toBeVisible();
  await expect(demo.getByRole('form')).toBeVisible();
});

// Unique Landmarks
test('has exactly one main, banner, and contentinfo', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const demo = page.locator('.apg-landmark-demo');

  await expect(demo.getByRole('main')).toHaveCount(1);
  await expect(demo.getByRole('banner')).toHaveCount(1);
  await expect(demo.getByRole('contentinfo')).toHaveCount(1);
});

// Labeling
test('landmarks requiring labels have accessible names', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const demo = page.locator('.apg-landmark-demo');

  // region, search, form require accessible names
  await expect(demo.getByRole('region')).toHaveAccessibleName(/.+/);
  await expect(demo.getByRole('search')).toHaveAccessibleName(/.+/);
  await expect(demo.getByRole('form')).toHaveAccessibleName(/.+/);
  await expect(demo.getByRole('complementary')).toHaveAccessibleName(/.+/);
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/landmarks/react/demo/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.apg-landmark-demo')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```
