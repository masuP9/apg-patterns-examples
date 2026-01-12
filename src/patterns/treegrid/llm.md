# TreeGrid Pattern - AI Implementation Guide

> APG Reference: https://www.w3.org/WAI/ARIA/apg/patterns/treegrid/

## Overview

TreeGrid is a composite widget combining Grid's 2D navigation with TreeView's expandable hierarchy. It presents tabular data with parent-child relationships where rows can be expanded/collapsed.

## Key Differences from Similar Patterns

### TreeGrid vs Grid

| Feature | Grid | TreeGrid |
|---------|------|----------|
| Container role | `grid` | `treegrid` |
| ArrowRight at rowheader | Move right | Expand collapsed parent |
| ArrowLeft at rowheader | Stop | Collapse expanded parent |
| Enter key | Activate cell | Activate cell (same) |
| Space key | Cell selection | **Row selection** |
| `aria-expanded` | None | Required on parent rows |
| `aria-level` | None | Required on all rows |
| `aria-selected` target | gridcell | **row** |

### TreeGrid vs TreeView

| Feature | TreeView | TreeGrid |
|---------|----------|----------|
| Navigation unit | Node (1D) | Cell (2D) |
| Container role | `tree` | `treegrid` |
| Child elements | `treeitem` | `row` + `gridcell` |
| ArrowDown/Up | Next/prev node | Same column in next/prev row |
| Home/End | First/last node | First/last cell in row |

## ARIA Requirements

### Roles

| Role | Element | Required | Description |
|------|---------|----------|-------------|
| `treegrid` | Container | Yes | TreeGrid root |
| `row` | Row container | Yes | Each row |
| `gridcell` | Data cell | Yes | Standard data cell |
| `columnheader` | Header cell | No | Column header |
| `rowheader` | Row header | No | First column (tree control) |

### Properties

| Attribute | Element | Values | Required | Notes |
|-----------|---------|--------|----------|-------|
| `aria-label` | treegrid | String | Yes* | Accessible name |
| `aria-labelledby` | treegrid | ID ref | Yes* | Alternative naming |
| `aria-rowcount` | treegrid | Integer | No | Virtualization |
| `aria-colcount` | treegrid | Integer | No | Virtualization |
| `aria-level` | row | Integer (1-based) | Yes | Hierarchy depth |
| `aria-setsize` | row | Integer | No | Siblings count |
| `aria-posinset` | row | Integer (1-based) | No | Position in siblings |
| `aria-rowindex` | row | Integer (1-based) | No | Virtualization |
| `aria-colindex` | gridcell | Integer (1-based) | No | Virtualization |

*Either `aria-label` or `aria-labelledby` required

### States

| Attribute | Element | Values | Required | Change Trigger |
|-----------|---------|--------|----------|----------------|
| `aria-expanded` | row (parent only) | `true`/`false` | Yes* | ArrowRight/Left at rowheader |
| `aria-selected` | **row** | `true`/`false` | No | Space, click |
| `aria-multiselectable` | treegrid | `true` | No | When multiselectable |
| `aria-disabled` | row, gridcell | `true` | No | disabled prop |

*Required on rows with children. Leaf rows MUST NOT have `aria-expanded`.

## Keyboard Support

| Key | Action | Notes |
|-----|--------|-------|
| `ArrowDown` | Move to same column in next visible row | Skips collapsed children |
| `ArrowUp` | Move to same column in previous visible row | |
| `ArrowRight` (at rowheader) | Expand collapsed parent / Move to first child (expanded) | |
| `ArrowRight` (other cells) | Move to right cell | Does NOT expand |
| `ArrowLeft` (at rowheader) | Collapse expanded parent / Move to parent (collapsed) | |
| `ArrowLeft` (other cells) | Move to left cell | Does NOT collapse |
| `Home` | First cell in current row | |
| `End` | Last cell in current row | |
| `Ctrl+Home` | First cell in first row | |
| `Ctrl+End` | Last cell in last visible row | |
| `Enter` | Activate cell (onCellActivate) | Does NOT expand/collapse |
| `Space` | Toggle **row** selection | Row selection, not cell |
| `Ctrl+A` | Select all visible rows | multiselectable only |
| `PageDown` | Move down by pageSize | enablePageNavigation |
| `PageUp` | Move up by pageSize | enablePageNavigation |
| `Tab` | Exit grid | Single tab stop |

## Focus Management

- **Roving tabindex**: Only one cell has `tabIndex="0"`
- **Column preservation**: Maintain column position when navigating rows
- **Collapsed children**: Skipped during navigation
- **Collapse focus**: When parent collapses with focus on child, focus moves to parent
- **Header cells**: NOT focusable
- **Disabled cells**: Focusable but not activatable/selectable

## Test Checklist

### High Priority: ARIA Attributes

- [ ] Container has `role="treegrid"`
- [ ] All rows have `role="row"`
- [ ] Data cells have `role="gridcell"`
- [ ] Header cells have `role="columnheader"`
- [ ] First column cells have `role="rowheader"` (when specified)
- [ ] Parent rows have `aria-expanded` (true or false)
- [ ] Leaf rows do NOT have `aria-expanded`
- [ ] All rows have `aria-level`
- [ ] `aria-level` increments with depth (1-based)
- [ ] Has `aria-label` or `aria-labelledby`
- [ ] Has `aria-selected` on **row** (not gridcell) when selectable
- [ ] Has `aria-multiselectable` when multiselectable
- [ ] Has `aria-rowcount`/`aria-colcount` when virtualized
- [ ] Has `aria-rowindex`/`aria-colindex` when virtualized

### High Priority: Keyboard - Row Navigation

- [ ] ArrowDown moves to same column in next visible row
- [ ] ArrowUp moves to same column in previous visible row
- [ ] ArrowDown skips collapsed child rows
- [ ] ArrowUp stops at first visible row
- [ ] ArrowDown stops at last visible row
- [ ] Column position maintained during row navigation

### High Priority: Keyboard - Cell Navigation

- [ ] ArrowRight moves right (at non-rowheader cells)
- [ ] ArrowLeft moves left (at non-rowheader cells)
- [ ] ArrowRight at non-rowheader does NOT expand
- [ ] ArrowLeft at non-rowheader does NOT collapse
- [ ] Home moves to first cell in row
- [ ] End moves to last cell in row
- [ ] Ctrl+Home moves to first cell in grid
- [ ] Ctrl+End moves to last cell in grid

### High Priority: Keyboard - Tree Operations (at rowheader only)

- [ ] ArrowRight expands collapsed parent row
- [ ] ArrowRight moves to first child when expanded
- [ ] ArrowRight does nothing on leaf row
- [ ] ArrowLeft collapses expanded parent row
- [ ] ArrowLeft moves to parent when collapsed
- [ ] ArrowLeft does nothing at root level

### High Priority: Keyboard - Selection & Activation

- [ ] Enter activates cell (calls onCellActivate)
- [ ] Enter does NOT expand/collapse
- [ ] Space toggles **row** selection
- [ ] Space does not select disabled row
- [ ] Ctrl+A selects all visible rows (multiselectable)

### High Priority: Focus Management

- [ ] Only one cell has `tabIndex="0"`
- [ ] Other cells have `tabIndex="-1"`
- [ ] Column position maintained across row navigation
- [ ] Collapsed child rows skipped in navigation
- [ ] Focus moves to parent when child's parent collapses
- [ ] columnheader cells not focusable
- [ ] Disabled cells focusable but not activatable

### Medium Priority: Accessibility

- [ ] No axe-core violations
- [ ] No violations when expanded
- [ ] No violations when collapsed

## Implementation Notes

```
Structure:

┌──────────────────────────────────────────────────────────────────┐
│ div role="treegrid" aria-label="..."                              │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ div role="row" (header)                                      │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │ │
│ │ │columnheader │ │columnheader │ │columnheader │              │ │
│ │ │ NOT focused │ │ NOT focused │ │ NOT focused │              │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘              │ │
│ └──────────────────────────────────────────────────────────────┘ │
│ ┌──────────────────────────────────────────────────────────────┐ │
│ │ div role="row" aria-level="1" aria-expanded="true"           │ │
│ │ aria-selected="false"                                        │ │
│ │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐              │ │
│ │ │ rowheader   │ │  gridcell   │ │  gridcell   │              │ │
│ │ │ tabIndex=0  │ │ tabIndex=-1 │ │ tabIndex=-1 │              │ │
│ │ │ (tree ctrl) │ │             │ │             │              │ │
│ │ └─────────────┘ └─────────────┘ └─────────────┘              │ │
│ └──────────────────────────────────────────────────────────────┘ │
│   ┌────────────────────────────────────────────────────────────┐ │
│   │ div role="row" aria-level="2" (child row)                  │ │
│   │ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │ │
│   │ │ rowheader   │ │  gridcell   │ │  gridcell   │            │ │
│   │ └─────────────┘ └─────────────┘ └─────────────┘            │ │
│   └────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

### Critical Implementation Points

1. **Row selection, not cell selection**: `aria-selected` on `row`, not `gridcell`
2. **Tree operations only at rowheader**: ArrowRight/Left expand/collapse only at first column
3. **Enter does NOT toggle expansion**: Enter only activates, use Arrow keys for tree ops
4. **Visible rows calculation**: Consider expanded state when computing navigable rows
5. **aria-level is 1-based**: Root level = 1, first child = 2, etc.
6. **Leaf rows**: No `aria-expanded` attribute

### Props Design (React)

```typescript
interface TreeGridNodeData {
  id: string;
  cells: TreeGridCellData[];
  children?: TreeGridNodeData[];
  disabled?: boolean;
}

interface TreeGridCellData {
  id: string;
  value: string | number;
  disabled?: boolean;
  colspan?: number;
}

interface TreeGridColumnDef {
  id: string;
  header: string;
  isRowHeader?: boolean;  // First column for tree control
}

interface TreeGridProps {
  // Required
  columns: TreeGridColumnDef[];
  nodes: TreeGridNodeData[];

  // Accessible name (one required)
  ariaLabel?: string;
  ariaLabelledby?: string;

  // Expansion
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;

  // Selection (row-based)
  selectable?: boolean;
  multiselectable?: boolean;
  selectedRowIds?: string[];
  defaultSelectedRowIds?: string[];
  onSelectionChange?: (rowIds: string[]) => void;

  // Focus
  focusedCellId?: string | null;
  defaultFocusedCellId?: string;
  onFocusChange?: (cellId: string | null) => void;

  // Virtualization
  totalRows?: number;
  totalColumns?: number;
  startRowIndex?: number;  // 1-based, 2 if header row included
  startColIndex?: number;  // 1-based

  // Behavior
  enablePageNavigation?: boolean;
  pageSize?: number;

  // Callbacks
  onCellActivate?: (cellId: string, rowId: string, colId: string) => void;
  onRowActivate?: (rowId: string) => void;
}
```

## Example Test Code (React + Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const columns = [
  { id: 'name', header: 'Name', isRowHeader: true },
  { id: 'size', header: 'Size' },
  { id: 'date', header: 'Date Modified' },
];

const nodes = [
  {
    id: 'docs',
    cells: [
      { id: 'docs-name', value: 'Documents' },
      { id: 'docs-size', value: '--' },
      { id: 'docs-date', value: '2024-01-15' },
    ],
    children: [
      {
        id: 'report',
        cells: [
          { id: 'report-name', value: 'report.pdf' },
          { id: 'report-size', value: '2.5 MB' },
          { id: 'report-date', value: '2024-01-10' },
        ],
      },
    ],
  },
  {
    id: 'readme',
    cells: [
      { id: 'readme-name', value: 'README.md' },
      { id: 'readme-size', value: '4 KB' },
      { id: 'readme-date', value: '2024-01-01' },
    ],
  },
];

// ARIA role test
it('has role="treegrid" on container', () => {
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);
  expect(screen.getByRole('treegrid')).toBeInTheDocument();
});

// aria-level test
it('has correct aria-level on rows', () => {
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" defaultExpandedIds={['docs']} />);
  const rows = screen.getAllByRole('row').filter(r => r.hasAttribute('aria-level'));
  expect(rows[0]).toHaveAttribute('aria-level', '1'); // docs
  expect(rows[1]).toHaveAttribute('aria-level', '2'); // report
  expect(rows[2]).toHaveAttribute('aria-level', '1'); // readme
});

// aria-expanded test
it('parent rows have aria-expanded, leaf rows do not', () => {
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);
  const rows = screen.getAllByRole('row').filter(r => r.hasAttribute('aria-level'));

  // docs is parent
  expect(rows[0]).toHaveAttribute('aria-expanded');
  // readme is leaf
  expect(rows[1]).not.toHaveAttribute('aria-expanded');
});

// ArrowRight expands at rowheader
it('ArrowRight expands collapsed parent at rowheader', async () => {
  const user = userEvent.setup();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);

  const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
  docsRowheader.focus();

  const parentRow = docsRowheader.closest('[role="row"]');
  expect(parentRow).toHaveAttribute('aria-expanded', 'false');

  await user.keyboard('{ArrowRight}');

  expect(parentRow).toHaveAttribute('aria-expanded', 'true');
});

// ArrowRight at non-rowheader does NOT expand
it('ArrowRight at non-rowheader moves right without expanding', async () => {
  const user = userEvent.setup();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" />);

  const sizeCell = screen.getByRole('gridcell', { name: '--' });
  sizeCell.focus();

  const parentRow = screen.getAllByRole('row').find(r => r.getAttribute('aria-level') === '1');
  expect(parentRow).toHaveAttribute('aria-expanded', 'false');

  await user.keyboard('{ArrowRight}');

  // Should NOT expand, just move right
  expect(parentRow).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByRole('gridcell', { name: '2024-01-15' })).toHaveFocus();
});

// Row selection
it('Space toggles row selection', async () => {
  const user = userEvent.setup();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" selectable />);

  const cell = screen.getAllByRole('gridcell')[0];
  cell.focus();

  const row = cell.closest('[role="row"]');
  expect(row).toHaveAttribute('aria-selected', 'false');

  await user.keyboard(' ');

  expect(row).toHaveAttribute('aria-selected', 'true');
});

// Enter does NOT expand
it('Enter activates but does NOT expand', async () => {
  const user = userEvent.setup();
  const onCellActivate = vi.fn();
  render(<TreeGrid columns={columns} nodes={nodes} ariaLabel="Files" onCellActivate={onCellActivate} />);

  const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
  docsRowheader.focus();

  const parentRow = docsRowheader.closest('[role="row"]');
  expect(parentRow).toHaveAttribute('aria-expanded', 'false');

  await user.keyboard('{Enter}');

  expect(onCellActivate).toHaveBeenCalled();
  expect(parentRow).toHaveAttribute('aria-expanded', 'false'); // Still collapsed
});
```
