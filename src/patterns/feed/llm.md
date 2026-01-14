# Feed Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/feed/

## Overview

A feed is a section of a page that automatically loads new content as the user scrolls (infinite scroll). Unlike widgets, feeds use the `structure` category, allowing assistive technologies to use reading mode by default.

## Key Differences from Listbox

| Aspect | Listbox | Feed | Reason |
|--------|---------|------|--------|
| Category | Widget | Structure | Feed uses AT reading mode |
| Purpose | Selection | Browsing/consuming | No selection state needed |
| Navigation | Arrow Up/Down | Page Up/Down | Long content per article |
| `aria-selected` | Required | None | No selection concept |
| `aria-busy` | None | Conditional | Dynamic loading state |
| `aria-posinset/setsize` | Optional | Required | Position in infinite scroll |
| Escape | None | Ctrl+Home/End | Exit from long feed |

## ARIA Requirements

### Roles

| Role | Element | Description |
|------|---------|-------------|
| `feed` | Container | Scrollable content feed |
| `article` | Each item | Individual content unit |

### Properties

| Attribute | Element | Values | Required | Notes |
|-----------|---------|--------|----------|-------|
| `aria-label` | feed | String | Yes* | Accessible name |
| `aria-labelledby` | feed | ID reference | Yes* | Alternative (mutually exclusive) |
| `aria-labelledby` | article | ID reference | Yes | Must reference article title |
| `aria-describedby` | article | ID reference | Recommended | Reference to main content |
| `aria-posinset` | article | Number (1-based) | Yes | Position in feed (sequential) |
| `aria-setsize` | article | Number or -1 | Yes | Total count (-1 if unknown) |

> *Either `aria-label` or `aria-labelledby` is required on feed

### States

| Attribute | Element | Values | Required | Change Trigger |
|-----------|---------|--------|----------|----------------|
| `aria-busy` | feed | `true` / `false` | Conditional | During DOM operations |

## Keyboard Support

| Key | Action |
|-----|--------|
| `Page Down` | Move focus to next article |
| `Page Up` | Move focus to previous article |
| `Ctrl + End` | Move focus to first focusable element AFTER feed |
| `Ctrl + Home` | Move focus to first focusable element BEFORE feed |

**Note**: Arrow keys are NOT used (unlike Listbox) because articles contain long content.

## Focus Management (Roving Tabindex)

- Current article has `tabIndex="0"`
- Other articles have `tabIndex="-1"`
- Focus does NOT wrap at edges
- Page Up/Down works even when focus is inside article element
- Interactive elements inside articles are navigated with Tab

## Dynamic Loading

- Set `aria-busy="true"` before multiple DOM operations
- Set `aria-busy="false"` after all operations complete
- Maintain focus position during loading
- Update `aria-posinset`/`aria-setsize` when articles are added/removed
- Prevent duplicate `onLoadMore` calls while `loading=true`

## Test Checklist

### High Priority: ARIA Structure

- [ ] Container has `role="feed"`
- [ ] Each article has `role="article"`
- [ ] Feed has `aria-label` or `aria-labelledby`
- [ ] Feed without accessible name shows warning/error
- [ ] Each article has `aria-labelledby` referencing title
- [ ] `aria-posinset` starts from 1 and is sequential
- [ ] `aria-setsize` is total count or -1

### High Priority: Keyboard

- [ ] Page Down moves to next article
- [ ] Page Up moves to previous article
- [ ] Ctrl+End moves focus outside feed (after)
- [ ] Ctrl+Home moves focus outside feed (before)
- [ ] Focus does not loop at first/last article
- [ ] Page Up/Down works when focus is inside article element

### High Priority: Focus Management

- [ ] Article elements have tabindex attribute
- [ ] Only one article has `tabindex="0"` (roving)
- [ ] tabindex updates when focus moves
- [ ] Article scrolls into view on focus

### High Priority: Dynamic Loading

- [ ] `aria-busy="true"` during loading
- [ ] `aria-busy="false"` after loading
- [ ] `aria-posinset`/`aria-setsize` update on article addition
- [ ] Focus maintained during loading
- [ ] No duplicate `onLoadMore` calls during loading

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] No axe-core violations during loading state
- [ ] `aria-describedby` set when description provided

## Implementation Notes

```html
Structure:
<div role="feed" aria-label="Blog Posts" aria-busy="false">
  <article
    tabindex="0"
    aria-labelledby="article-1-title"
    aria-describedby="article-1-desc"
    aria-posinset="1"
    aria-setsize="-1"
  >
    <h2 id="article-1-title">Article Title</h2>
    <p id="article-1-desc">Article description...</p>
    <div>Article content with <a href="#">links</a>...</div>
  </article>
  <article
    tabindex="-1"
    aria-labelledby="article-2-title"
    aria-describedby="article-2-desc"
    aria-posinset="2"
    aria-setsize="-1"
  >
    ...
  </article>
</div>

Ctrl+Home/End Implementation:
- Find all focusable elements in document
- Filter to visible elements only (offsetParent !== null)
- For Ctrl+Home: find first focusable BEFORE feed container
- For Ctrl+End: find first focusable AFTER feed container
- Call focus() on found element
```

## Props Design

```typescript
interface FeedArticle {
  id: string;
  title: string;
  description?: string;
  content: React.ReactNode;
}

interface FeedProps {
  articles: FeedArticle[];
  'aria-label'?: string;
  'aria-labelledby'?: string;
  setSize?: number;        // undefined=auto, -1=unknown, positive=explicit
  loading?: boolean;       // Suppresses onLoadMore when true
  onLoadMore?: () => void;
  onFocusChange?: (articleId: string, index: number) => void;
  className?: string;
}
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const articles = [
  { id: '1', title: 'First Article', content: 'Content 1' },
  { id: '2', title: 'Second Article', content: 'Content 2' },
  { id: '3', title: 'Third Article', content: 'Content 3' },
];

// ARIA structure
it('has role="feed" on container', () => {
  render(<Feed articles={articles} aria-label="News" />);
  expect(screen.getByRole('feed')).toBeInTheDocument();
});

it('has role="article" on each article', () => {
  render(<Feed articles={articles} aria-label="News" />);
  expect(screen.getAllByRole('article')).toHaveLength(3);
});

it('has sequential aria-posinset starting from 1', () => {
  render(<Feed articles={articles} aria-label="News" />);
  const articleElements = screen.getAllByRole('article');

  articleElements.forEach((article, index) => {
    expect(article).toHaveAttribute('aria-posinset', String(index + 1));
  });
});

// Keyboard navigation
it('Page Down moves focus to next article', async () => {
  const user = userEvent.setup();
  render(<Feed articles={articles} aria-label="News" />);

  const firstArticle = screen.getAllByRole('article')[0];
  firstArticle.focus();

  await user.keyboard('{PageDown}');

  expect(screen.getAllByRole('article')[1]).toHaveFocus();
});

it('does not loop at last article', async () => {
  const user = userEvent.setup();
  render(<Feed articles={articles} aria-label="News" />);

  const lastArticle = screen.getAllByRole('article')[2];
  lastArticle.focus();

  await user.keyboard('{PageDown}');

  expect(lastArticle).toHaveFocus(); // Still on last
});

// Roving tabindex
it('uses roving tabindex', () => {
  render(<Feed articles={articles} aria-label="News" />);

  const articleElements = screen.getAllByRole('article');
  const withTabindex0 = articleElements.filter(
    el => el.getAttribute('tabindex') === '0'
  );

  expect(withTabindex0).toHaveLength(1);
});

// Dynamic loading
it('sets aria-busy during loading', () => {
  render(<Feed articles={articles} aria-label="News" loading />);

  expect(screen.getByRole('feed')).toHaveAttribute('aria-busy', 'true');
});
```

## Example E2E Test Code (Playwright)

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ARIA Structure
test('has role="feed" and article elements', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const feed = page.locator('[data-testid="feed-demo"]');
  await expect(feed).toHaveAttribute('role', 'feed');

  const articles = feed.locator('article');
  expect(await articles.count()).toBeGreaterThan(0);

  // Verify aria-posinset is sequential
  const count = await articles.count();
  for (let i = 0; i < count; i++) {
    const article = articles.nth(i);
    await expect(article).toHaveAttribute('aria-posinset', String(i + 1));
  }
});

// Keyboard Navigation (Page Up/Down)
test('Page Down moves focus to next article', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const feed = page.locator('[data-testid="feed-demo"]');
  const articles = feed.locator('article');
  const firstArticle = articles.first();
  const secondArticle = articles.nth(1);

  await firstArticle.focus();
  await expect(firstArticle).toBeFocused();

  await page.keyboard.press('PageDown');
  await expect(secondArticle).toBeFocused();
});

// Roving Tabindex
test('uses roving tabindex on articles', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const feed = page.locator('[data-testid="feed-demo"]');
  const count = await feed.locator('article').count();

  // Only one article should have tabindex="0"
  await expect(feed.locator('article[tabindex="0"]')).toHaveCount(1);
  await expect(feed.locator('article[tabindex="-1"]')).toHaveCount(count - 1);
});

// Accessibility
test('has no axe-core violations', async ({ page }) => {
  await page.goto('patterns/feed/react/demo/');
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('.apg-feed-demo-wrapper')
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```
