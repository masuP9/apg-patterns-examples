# Window Splitter Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/

## Overview

A movable separator between two panes that allows users to resize the relative size of each pane. Used in IDEs, file browsers, and resizable layouts. Unlike Slider, it controls layout structure with direction-specific keyboard navigation and collapse/expand functionality.

## ARIA Requirements

### Roles

| Role | Element | Required | Description |
| --- | --- | --- | --- |
| `separator` | Splitter element | Yes | Focusable separator that controls pane size |

### Properties

| Attribute | Element | Values | Required | Notes |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | separator | 0-100 | Yes | Primary pane size as % of container |
| `aria-valuemin` | separator | number | Yes | Minimum value (default: 0) |
| `aria-valuemax` | separator | number | Yes | Maximum value (default: 100) |
| `aria-controls` | separator | ID ref(s) | Yes | Primary pane ID (+ secondary pane ID optional) |
| `aria-label` | separator | string | Conditional | When no visible label |
| `aria-labelledby` | separator | ID ref | Conditional | When visible label exists |
| `aria-orientation` | separator | `horizontal` / `vertical` | No | Default: horizontal (left-right split) |
| `aria-describedby` | separator | ID ref | No | Reference to help text |

**Label Requirement**: One of `aria-label` or `aria-labelledby` is required.

**Note**: `aria-readonly` is NOT a valid attribute for `role="separator"`. Readonly behavior must be enforced via JavaScript only.

**aria-valuenow Meaning**:
- `0`: Primary pane collapsed
- `50`: Primary pane is 50% of container
- `100`: Primary pane fills container (secondary hidden)

### States

| Attribute | Element | Values | Required | Change Trigger |
| --- | --- | --- | --- | --- |
| `aria-valuenow` | separator | number | Yes | Keyboard, pointer drag, collapse/expand |

## Keyboard Support

| Key | Action | Notes |
| --- | --- | --- |
| `ArrowLeft` | Move horizontal splitter left (decrease) | **Horizontal only** - no effect on vertical |
| `ArrowRight` | Move horizontal splitter right (increase) | **Horizontal only** - reversed in RTL |
| `ArrowUp` | Move vertical splitter up (increase) | **Vertical only** - no effect on horizontal |
| `ArrowDown` | Move vertical splitter down (decrease) | **Vertical only** |
| `Shift+Arrow` | Move by large step | Uses `largeStep` prop (default: 10%) |
| `Enter` | Toggle collapse/expand | **Unique to Window Splitter** |
| `Home` | Move to minimum | Same as Slider |
| `End` | Move to maximum | Same as Slider |

**Key Differences from Slider**:
1. Arrow keys are direction-restricted based on `aria-orientation`
2. `Enter` toggles collapse (not in Slider)
3. No `Page Up/Down` support (not in APG spec)
4. RTL support for horizontal splitter

## Focus Management

- Single focusable element: the separator with `role="separator"`
- `tabindex="0"` on separator
- `tabindex="-1"` when disabled
- Focus remains on separator after collapse/expand

## Test Checklist

### High Priority: ARIA

- [ ] `role="separator"` on splitter
- [ ] `aria-valuenow` = primary pane % (0-100)
- [ ] `aria-valuenow="0"` when collapsed
- [ ] `aria-valuemin` set
- [ ] `aria-valuemax` set
- [ ] `aria-controls` references primary pane ID
- [ ] `aria-controls` includes secondary pane ID when provided
- [ ] `aria-label` or `aria-labelledby` present (conditional required)
- [ ] `aria-orientation="vertical"` when vertical

### High Priority: Keyboard

- [ ] `ArrowRight` increases on horizontal splitter
- [ ] `ArrowLeft` decreases on horizontal splitter
- [ ] `ArrowUp`/`ArrowDown` ignored on horizontal splitter
- [ ] `ArrowUp` increases on vertical splitter
- [ ] `ArrowDown` decreases on vertical splitter
- [ ] `ArrowLeft`/`ArrowRight` ignored on vertical splitter
- [ ] `Shift+Arrow` moves by large step
- [ ] `Enter` collapses (aria-valuenow → 0)
- [ ] `Enter` expands to previous value
- [ ] `Enter` expands to `expandedPosition` when initially collapsed
- [ ] `Home` sets min
- [ ] `End` sets max
- [ ] Value clamped to min/max
- [ ] No effect when disabled
- [ ] `ArrowLeft` increases in RTL mode (horizontal)
- [ ] `ArrowRight` decreases in RTL mode (horizontal)

### High Priority: Focus

- [ ] `tabindex="0"` on splitter
- [ ] `tabindex="-1"` when disabled
- [ ] Focus remains after collapse
- [ ] `readonly`: focusable but not operable

### Medium Priority: Pointer

- [ ] Drag changes position
- [ ] `aria-valuenow` updates during drag
- [ ] Drag continues outside splitter (pointer capture)
- [ ] Pointer capture released on mouseup
- [ ] Touch drag works
- [ ] No drag when disabled
- [ ] No drag when readonly
- [ ] `onPositionChange(position, sizeInPx)` called

### Medium Priority: Accessibility

- [ ] No axe-core violations
- [ ] No violations when collapsed
- [ ] No violations when disabled

## Implementation Notes

### Props Design

```typescript
type LabelProps =
  | { 'aria-label': string; 'aria-labelledby'?: never }
  | { 'aria-label'?: never; 'aria-labelledby': string };

type WindowSplitterProps = {
  primaryPaneId: string;           // Required: aria-controls target
  secondaryPaneId?: string;        // Optional: additional aria-controls
  defaultPosition?: number;        // % (0-100), default: 50
  defaultCollapsed?: boolean;      // default: false
  expandedPosition?: number;       // Position when expanding from initial collapse
  min?: number;                    // %, default: 10
  max?: number;                    // %, default: 90
  step?: number;                   // %, default: 5
  largeStep?: number;              // %, default: 10
  orientation?: 'horizontal' | 'vertical';
  dir?: 'ltr' | 'rtl';
  collapsible?: boolean;           // default: true
  disabled?: boolean;
  readonly?: boolean;
  onPositionChange?: (position: number, sizeInPx: number) => void;
  onCollapsedChange?: (collapsed: boolean, previousPosition: number) => void;
  'aria-describedby'?: string;
  className?: string;
  id?: string;
} & LabelProps;
```

### Structure

The component provides **only the separator element**. Panes are external and controlled via CSS custom property `--splitter-position`.

```
<!-- External layout (user provides) -->
<div class="my-layout">
  <div id="primary" style="width: var(--splitter-position)">...</div>

  <!-- WindowSplitter component output -->
  <div class="apg-window-splitter" style="--splitter-position: 50%">
    <div role="separator"
         tabindex="0"
         aria-valuenow="50"
         aria-valuemin="10"
         aria-valuemax="90"
         aria-controls="primary secondary"
         aria-label="Resize panels">
    </div>
  </div>

  <div id="secondary">...</div>
</div>
```

**Note**: The component outputs a container div with `--splitter-position` CSS custom property and a nested separator div. Pane sizing must be handled by the parent layout using this CSS variable.

### Collapse State Management

```typescript
// Use useRef to persist previous position across collapses
const previousPositionRef = useRef<number | null>(null);

const handleEnter = () => {
  if (!collapsible) return;

  if (collapsed) {
    // Expand: restore to previous or fallback
    const restorePosition = previousPositionRef.current
      ?? expandedPosition
      ?? defaultPosition
      ?? 50;
    const clampedRestore = clamp(restorePosition, min, max);
    onCollapsedChange?.(false, position);
    setCollapsed(false);
    setPosition(clampedRestore);
    onPositionChange?.(clampedRestore, sizeInPx);
  } else {
    // Collapse: save current position, set to 0
    previousPositionRef.current = position;
    onCollapsedChange?.(true, position);
    setCollapsed(true);
    setPosition(0);
    onPositionChange?.(0, 0);  // Important: notify parent of position change
  }
};
```

**Important**: Both `onCollapsedChange` and `onPositionChange` must be called when collapsing/expanding to ensure parent components can react to both state changes.

### RTL Support

```typescript
const getHorizontalDelta = (key: string, isRTL: boolean, step: number): number => {
  if (key === 'ArrowRight') return isRTL ? -step : step;
  if (key === 'ArrowLeft') return isRTL ? step : -step;
  return 0;
};
```

### Keyboard Handler

```typescript
const handleKeyDown = (event: KeyboardEvent) => {
  if (disabled || readonly) return;

  const isHorizontal = orientation === 'horizontal';
  const isRTL = dir === 'rtl' || document.dir === 'rtl';
  const currentStep = event.shiftKey ? largeStep : step;

  let delta = 0;
  let handled = false;

  switch (event.key) {
    case 'ArrowRight':
      if (!isHorizontal) break;
      delta = isRTL ? -currentStep : currentStep;
      handled = true;
      break;
    case 'ArrowLeft':
      if (!isHorizontal) break;
      delta = isRTL ? currentStep : -currentStep;
      handled = true;
      break;
    case 'ArrowUp':
      if (isHorizontal) break;
      delta = currentStep;
      handled = true;
      break;
    case 'ArrowDown':
      if (isHorizontal) break;
      delta = -currentStep;
      handled = true;
      break;
    case 'Enter':
      handleEnter();
      handled = true;
      break;
    case 'Home':
      setPosition(min);
      handled = true;
      break;
    case 'End':
      setPosition(max);
      handled = true;
      break;
  }

  if (handled) {
    event.preventDefault();
    if (delta !== 0) {
      setPosition(clamp(position + delta, min, max));
    }
  }
};
```

### Common Pitfalls

1. **Direction-specific keys**: Arrow keys must check `orientation` before acting
2. **RTL reversal**: Only applies to horizontal splitter's ArrowLeft/Right
3. **Collapse value**: `aria-valuenow` must be `0` when collapsed, not `min`
4. **Previous position persistence**: Use `useRef`, not `useState`, to avoid re-renders
5. **Pointer capture**: Required for drag outside splitter bounds
6. **readonly vs disabled**: `readonly` is focusable, `disabled` is not
7. **Collapse callbacks**: Must call both `onCollapsedChange` AND `onPositionChange(0, 0)` when collapsing
8. **Svelte $derived**: Use value form `$derived(expression)`, not function form `$derived(() => ...)`

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

// Role test
it('has role="separator"', () => {
  render(<WindowSplitter primaryPaneId="primary" aria-label="Resize" />);
  expect(screen.getByRole('separator')).toBeInTheDocument();
});

// ARIA values test
it('has correct aria-valuenow as percentage', () => {
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      aria-label="Resize"
    />
  );
  const splitter = screen.getByRole('separator');
  expect(splitter).toHaveAttribute('aria-valuenow', '50');
});

// aria-controls test
it('has aria-controls referencing primary pane', () => {
  render(<WindowSplitter primaryPaneId="main-panel" aria-label="Resize" />);
  expect(screen.getByRole('separator')).toHaveAttribute(
    'aria-controls',
    'main-panel'
  );
});

// Direction-specific keyboard test
it('ArrowUp/Down ignored on horizontal splitter', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      orientation="horizontal"
      aria-label="Resize"
    />
  );
  const splitter = screen.getByRole('separator');

  await user.click(splitter);
  await user.keyboard('{ArrowUp}');

  expect(splitter).toHaveAttribute('aria-valuenow', '50'); // Unchanged
});

// Collapse test
it('collapses on Enter (aria-valuenow becomes 0)', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      aria-label="Resize"
    />
  );
  const splitter = screen.getByRole('separator');

  await user.click(splitter);
  await user.keyboard('{Enter}');

  expect(splitter).toHaveAttribute('aria-valuenow', '0');
});

// Expand restore test
it('restores previous value on Enter after collapse', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      aria-label="Resize"
    />
  );
  const splitter = screen.getByRole('separator');

  await user.click(splitter);
  await user.keyboard('{Enter}'); // Collapse → 0
  await user.keyboard('{Enter}'); // Expand → 50

  expect(splitter).toHaveAttribute('aria-valuenow', '50');
});

// RTL test
it('ArrowLeft increases value in RTL mode', async () => {
  const user = userEvent.setup();
  render(
    <WindowSplitter
      primaryPaneId="primary"
      defaultPosition={50}
      step={5}
      dir="rtl"
      aria-label="Resize"
    />
  );
  const splitter = screen.getByRole('separator');

  await user.click(splitter);
  await user.keyboard('{ArrowLeft}');

  expect(splitter).toHaveAttribute('aria-valuenow', '55');
});

// axe test
it('has no axe violations', async () => {
  const { container } = render(
    <WindowSplitter primaryPaneId="primary" aria-label="Resize" />
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```
