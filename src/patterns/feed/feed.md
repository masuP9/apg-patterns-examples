# Feed Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/feed/

## Overview

A feed is a section of a page that automatically loads new content as the user scrolls (infinite scroll). Unlike widgets, feeds use the structure category, allowing assistive technologies to use reading mode by default.

## ARIA Requirements

### Roles

| Role | Element | Description |
| --- | --- | --- |
| `feed` | Container element | A dynamic list of articles where scrolling may add/remove content |
| `article` | Each article element | Independent content item within the feed |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-label` | [object Object] | Text | No | Accessible name for the feed (conditional*) |
| `aria-labelledby` | [object Object] | ID reference | No | References visible heading for the feed (conditional*) |
| `aria-labelledby` | [object Object] | ID reference | Yes | References the article title element |
| `aria-describedby` | [object Object] | ID reference | No | References the article description or content (recommended) |
| `aria-posinset` | [object Object] | Number (1-based) | Yes | Position of article in the feed (starts at 1) |
| `aria-setsize` | [object Object] | Number or -1 | Yes | Total articles in feed, or -1 if unknown |

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-busy` | Feed container | `true` \| `false` | No | Loading starts (true), loading completes (false). Indicates when the feed is loading new content. Screen readers will wait to announce changes until loading completes. |

## Keyboard Support

| Key | Action |
| --- | --- |
| `Page Down` | Move focus to next article in the feed |
| `Page Up` | Move focus to previous article in the feed |
| `Ctrl + End` | Move focus to first focusable element after the feed |
| `Ctrl + Home` | Move focus to first focusable element before the feed |

## Focus Management

- Roving tabindex: Only one article has tabindex="0", others have tabindex="-1"
- Initial focus: First article has tabindex="0" by default
- Focus tracking: tabindex updates as focus moves between articles
- No wrap: Focus does not wrap from first to last article or vice versa
- Content inside articles: Interactive elements inside articles remain keyboard accessible

## Test Checklist

### High Priority: ARIA

- [ ] Container has role="feed"
- [ ] Each article has role="article"
- [ ] Feed has aria-label or aria-labelledby
- [ ] Each article has aria-labelledby referencing title
- [ ] aria-posinset starts from 1 and is sequential
- [ ] aria-setsize is total count or -1
- [ ] aria-busy="true" during loading
- [ ] aria-busy="false" after loading
- [ ] aria-posinset/aria-setsize update on article addition

### Medium Priority: ARIA

- [ ] aria-describedby set when description provided

### High Priority: Keyboard

- [ ] Page Down moves to next article
- [ ] Page Up moves to previous article
- [ ] Ctrl+End moves focus outside feed (after)
- [ ] Ctrl+Home moves focus outside feed (before)
- [ ] Focus does not loop at first/last article
- [ ] Page Up/Down works when focus is inside article element

### High Priority: Focus Management

- [ ] Article elements have tabindex attribute
- [ ] Only one article has tabindex="0" (roving)
- [ ] tabindex updates when focus moves
- [ ] Article scrolls into view on focus
- [ ] Focus maintained during loading

### High Priority: Accessibility

- [ ] No duplicate onLoadMore calls during loading

### Medium Priority: Accessibility

- [ ] No axe-core violations (WCAG 2.1 AA)
- [ ] No axe-core violations during loading state

## Implementation Notes

## Structure

```html
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
```

## Key Differences from Listbox

| Aspect | Listbox | Feed |
|--------|---------|------|
| Category | Widget | Structure |
| Purpose | Selection | Browsing/consuming |
| Navigation | Arrow Up/Down | Page Up/Down |
| aria-selected | Required | None |
| aria-busy | None | Conditional |
| aria-posinset/setsize | Optional | Required |
| Escape | None | Ctrl+Home/End |

## Dynamic Loading

- Set `aria-busy="true"` before multiple DOM operations
- Set `aria-busy="false"` after all operations complete
- Maintain focus position during loading
- Update `aria-posinset`/`aria-setsize` when articles are added/removed
- Prevent duplicate `onLoadMore` calls while `loading=true`

## Ctrl+Home/End Implementation

- Find all focusable elements in document
- Filter to visible elements only (offsetParent !== null)
- For Ctrl+Home: find first focusable BEFORE feed container
- For Ctrl+End: find first focusable AFTER feed container
- Call focus() on found element

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
