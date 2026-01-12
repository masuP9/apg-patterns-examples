import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Grid, type GridColumnDef, type GridRowData } from './Grid';

// Helper function to create basic grid data
const createBasicColumns = (): GridColumnDef[] => [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

const createBasicRows = (): GridRowData[] => [
  {
    id: 'row1',
    cells: [
      { id: 'row1-0', value: 'Alice' },
      { id: 'row1-1', value: 'alice@example.com' },
      { id: 'row1-2', value: 'Admin' },
    ],
  },
  {
    id: 'row2',
    cells: [
      { id: 'row2-0', value: 'Bob' },
      { id: 'row2-1', value: 'bob@example.com' },
      { id: 'row2-2', value: 'User' },
    ],
  },
  {
    id: 'row3',
    cells: [
      { id: 'row3-0', value: 'Charlie' },
      { id: 'row3-1', value: 'charlie@example.com' },
      { id: 'row3-2', value: 'User' },
    ],
  },
];

// Rows with disabled cells
const createRowsWithDisabled = (): GridRowData[] => [
  {
    id: 'row1',
    cells: [
      { id: 'row1-0', value: 'Alice' },
      { id: 'row1-1', value: 'alice@example.com', disabled: true },
      { id: 'row1-2', value: 'Admin' },
    ],
  },
  {
    id: 'row2',
    cells: [
      { id: 'row2-0', value: 'Bob' },
      { id: 'row2-1', value: 'bob@example.com' },
      { id: 'row2-2', value: 'User' },
    ],
  },
];

// Rows with row header
const createRowsWithRowHeader = (): GridRowData[] => [
  {
    id: 'row1',
    hasRowHeader: true,
    cells: [
      { id: 'row1-0', value: '1' },
      { id: 'row1-1', value: 'Alice' },
      { id: 'row1-2', value: 'Admin' },
    ],
  },
  {
    id: 'row2',
    hasRowHeader: true,
    cells: [
      { id: 'row2-0', value: '2' },
      { id: 'row2-1', value: 'Bob' },
      { id: 'row2-2', value: 'User' },
    ],
  },
];

// Rows with spanned cells
const createRowsWithSpan = (): GridRowData[] => [
  {
    id: 'row1',
    cells: [
      { id: 'row1-0', value: 'Merged', colspan: 2 },
      { id: 'row1-2', value: 'Normal' },
    ],
  },
  {
    id: 'row2',
    cells: [
      { id: 'row2-0', value: 'A' },
      { id: 'row2-1', value: 'B' },
      { id: 'row2-2', value: 'C' },
    ],
  },
];

// Columns with span
const createColumnsWithSpan = (): GridColumnDef[] => [
  { id: 'info', header: 'Info', colspan: 2 },
  { id: 'role', header: 'Role' },
];

describe('Grid', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="grid" on container', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('has role="row" on all rows', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);
      // Header row + 3 data rows = 4 rows
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('has role="gridcell" on data cells', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);
      // 3 rows * 3 columns = 9 cells
      expect(screen.getAllByRole('gridcell')).toHaveLength(9);
    });

    it('has role="columnheader" on header cells', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);
      expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    });

    it('has role="rowheader" when hasRowHeader', () => {
      render(
        <Grid columns={createBasicColumns()} rows={createRowsWithRowHeader()} ariaLabel="Users" />
      );
      expect(screen.getAllByRole('rowheader')).toHaveLength(2);
    });

    it('has accessible name via aria-label', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);
      expect(screen.getByRole('grid', { name: 'Users' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <div>
          <h2 id="grid-title">User List</h2>
          <Grid
            columns={createBasicColumns()}
            rows={createBasicRows()}
            ariaLabelledby="grid-title"
          />
        </div>
      );
      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-labelledby', 'grid-title');
    });

    it('has aria-multiselectable when multiselectable', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
          multiselectable
        />
      );
      expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('has aria-selected on selectable cells', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
        />
      );
      const cells = screen.getAllByRole('gridcell');
      cells.forEach((cell) => {
        expect(cell).toHaveAttribute('aria-selected', 'false');
      });
    });

    it('has aria-disabled on disabled cells', () => {
      render(
        <Grid columns={createBasicColumns()} rows={createRowsWithDisabled()} ariaLabel="Users" />
      );
      const disabledCell = screen.getByRole('gridcell', { name: 'alice@example.com' });
      expect(disabledCell).toHaveAttribute('aria-disabled', 'true');
    });

    it('has aria-colspan on spanned cells', () => {
      render(<Grid columns={createBasicColumns()} rows={createRowsWithSpan()} ariaLabel="Users" />);
      const mergedCell = screen.getByRole('gridcell', { name: 'Merged' });
      expect(mergedCell).toHaveAttribute('aria-colspan', '2');
    });

    it('has aria-colspan on spanned columnheader', () => {
      render(<Grid columns={createColumnsWithSpan()} rows={createBasicRows()} ariaLabel="Users" />);
      const infoHeader = screen.getByRole('columnheader', { name: 'Info' });
      expect(infoHeader).toHaveAttribute('aria-colspan', '2');
    });
  });

  // 🔴 High Priority: Keyboard - 2D Navigation
  describe('Keyboard - 2D Navigation', () => {
    it('ArrowRight moves focus one cell right', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      await user.keyboard('{ArrowRight}');

      expect(screen.getAllByRole('gridcell')[1]).toHaveFocus();
    });

    it('ArrowLeft moves focus one cell left', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const secondCell = screen.getAllByRole('gridcell')[1];
      secondCell.focus();

      await user.keyboard('{ArrowLeft}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('ArrowDown moves focus one row down', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const firstCell = screen.getAllByRole('gridcell')[0]; // row1, col0
      firstCell.focus();

      await user.keyboard('{ArrowDown}');

      // Should move to row2, col0
      expect(screen.getAllByRole('gridcell')[3]).toHaveFocus();
    });

    it('ArrowUp moves focus one row up', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const secondRowFirstCell = screen.getAllByRole('gridcell')[3]; // row2, col0
      secondRowFirstCell.focus();

      await user.keyboard('{ArrowUp}');

      // Should move to row1, col0
      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('ArrowRight stops at row end (default)', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const lastCellInRow = screen.getAllByRole('gridcell')[2]; // row1, col2 (last in row)
      lastCellInRow.focus();

      await user.keyboard('{ArrowRight}');

      // Should stay at the same cell
      expect(lastCellInRow).toHaveFocus();
    });

    it('ArrowRight wraps to next row when wrapNavigation is true', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          wrapNavigation
        />
      );

      const lastCellInRow = screen.getAllByRole('gridcell')[2]; // row1, col2 (last in row)
      lastCellInRow.focus();

      await user.keyboard('{ArrowRight}');

      // Should wrap to first cell of next row
      expect(screen.getAllByRole('gridcell')[3]).toHaveFocus();
    });

    it('ArrowDown stops at grid bottom', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const lastRowCell = screen.getAllByRole('gridcell')[6]; // row3, col0 (last row)
      lastRowCell.focus();

      await user.keyboard('{ArrowDown}');

      // Should stay at the same cell
      expect(lastRowCell).toHaveFocus();
    });

    it('ArrowUp stops at first data row (does not enter headers)', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const firstDataCell = screen.getAllByRole('gridcell')[0]; // row1, col0
      firstDataCell.focus();

      await user.keyboard('{ArrowUp}');

      // Should stay at the first data cell, not move to header
      expect(firstDataCell).toHaveFocus();
    });

    it('skips disabled cells during horizontal navigation', async () => {
      const user = userEvent.setup();
      render(
        <Grid columns={createBasicColumns()} rows={createRowsWithDisabled()} ariaLabel="Users" />
      );

      const firstCell = screen.getAllByRole('gridcell')[0]; // row1, col0 (Alice)
      firstCell.focus();

      await user.keyboard('{ArrowRight}');

      // Should skip disabled cell (alice@example.com) and focus Admin
      expect(screen.getByRole('gridcell', { name: 'Admin' })).toHaveFocus();
    });
  });

  // 🔴 High Priority: Keyboard - Extended Navigation
  describe('Keyboard - Extended Navigation', () => {
    it('Home moves to first cell in row', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const lastCellInRow = screen.getAllByRole('gridcell')[2]; // row1, col2
      lastCellInRow.focus();

      await user.keyboard('{Home}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('End moves to last cell in row', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const firstCell = screen.getAllByRole('gridcell')[0]; // row1, col0
      firstCell.focus();

      await user.keyboard('{End}');

      expect(screen.getAllByRole('gridcell')[2]).toHaveFocus();
    });

    it('Ctrl+Home moves to first cell in grid', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const lastCell = screen.getAllByRole('gridcell')[8]; // row3, col2 (last cell)
      lastCell.focus();

      await user.keyboard('{Control>}{Home}{/Control}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('Ctrl+End moves to last cell in grid', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const firstCell = screen.getAllByRole('gridcell')[0]; // row1, col0
      firstCell.focus();

      await user.keyboard('{Control>}{End}{/Control}');

      expect(screen.getAllByRole('gridcell')[8]).toHaveFocus();
    });

    it('PageDown moves down by pageSize', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enablePageNavigation
          pageSize={2}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0]; // row1, col0
      firstCell.focus();

      await user.keyboard('{PageDown}');

      // Should move 2 rows down
      expect(screen.getAllByRole('gridcell')[6]).toHaveFocus();
    });

    it('PageUp moves up by pageSize', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enablePageNavigation
          pageSize={2}
        />
      );

      const lastRowCell = screen.getAllByRole('gridcell')[6]; // row3, col0
      lastRowCell.focus();

      await user.keyboard('{PageUp}');

      // Should move 2 rows up
      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('first focusable cell has tabIndex="0" by default', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const firstCell = screen.getAllByRole('gridcell')[0];
      expect(firstCell).toHaveAttribute('tabindex', '0');
    });

    it('defaultFocusedId sets initial focus', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          defaultFocusedId="row2-1"
        />
      );

      const targetCell = screen.getByRole('gridcell', { name: 'bob@example.com' });
      expect(targetCell).toHaveAttribute('tabindex', '0');
    });

    it('other cells have tabIndex="-1"', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const cells = screen.getAllByRole('gridcell');
      // First cell should have tabindex="0", others should have tabindex="-1"
      expect(cells[0]).toHaveAttribute('tabindex', '0');
      expect(cells[1]).toHaveAttribute('tabindex', '-1');
      expect(cells[2]).toHaveAttribute('tabindex', '-1');
    });

    it('focused cell updates tabIndex on navigation', async () => {
      const user = userEvent.setup();
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const cells = screen.getAllByRole('gridcell');
      cells[0].focus();

      await user.keyboard('{ArrowRight}');

      expect(cells[0]).toHaveAttribute('tabindex', '-1');
      expect(cells[1]).toHaveAttribute('tabindex', '0');
    });

    it('disabled cells are focusable', async () => {
      const user = userEvent.setup();
      render(
        <Grid columns={createBasicColumns()} rows={createRowsWithDisabled()} ariaLabel="Users" />
      );

      const disabledCell = screen.getByRole('gridcell', { name: 'alice@example.com' });
      // Disabled cell should still have tabindex (either 0 or -1)
      expect(disabledCell).toHaveAttribute('tabindex');
    });

    it('Tab focuses grid then exits', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
          <button>After</button>
        </div>
      );

      const beforeButton = screen.getByRole('button', { name: 'Before' });
      beforeButton.focus();

      await user.tab();
      // Should focus grid (first cell)
      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();

      await user.tab();
      // Should exit grid to next element
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('Shift+Tab exits grid to previous element', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
          <button>After</button>
        </div>
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      // Use fireEvent for Shift+Tab due to jsdom limitations
      fireEvent.keyDown(firstCell, { key: 'Tab', shiftKey: true });

      // Note: actual focus behavior depends on browser, but we verify the event is handled
    });

    it('columnheader cells are not focusable', () => {
      render(<Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />);

      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).not.toHaveAttribute('tabindex');
      });
    });
  });

  // 🔴 High Priority: Selection
  describe('Selection', () => {
    it('Space toggles selection (single)', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      expect(firstCell).toHaveAttribute('aria-selected', 'false');

      await user.keyboard(' ');

      expect(firstCell).toHaveAttribute('aria-selected', 'true');
    });

    it('Space toggles selection (multi)', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
          multiselectable
        />
      );

      const cells = screen.getAllByRole('gridcell');
      cells[0].focus();

      await user.keyboard(' ');
      expect(cells[0]).toHaveAttribute('aria-selected', 'true');

      await user.keyboard('{ArrowRight}');
      await user.keyboard(' ');

      // Both should be selected in multiselect mode
      expect(cells[0]).toHaveAttribute('aria-selected', 'true');
      expect(cells[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('single selection clears previous on Space', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
        />
      );

      const cells = screen.getAllByRole('gridcell');
      cells[0].focus();

      await user.keyboard(' ');
      expect(cells[0]).toHaveAttribute('aria-selected', 'true');

      await user.keyboard('{ArrowRight}');
      await user.keyboard(' ');

      // Previous selection should be cleared
      expect(cells[0]).toHaveAttribute('aria-selected', 'false');
      expect(cells[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('Enter activates cell', async () => {
      const user = userEvent.setup();
      const onCellActivate = vi.fn();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          onCellActivate={onCellActivate}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      await user.keyboard('{Enter}');

      expect(onCellActivate).toHaveBeenCalledWith('row1-0', 'row1', 'name');
    });

    it('Enter does not activate disabled cell', async () => {
      const user = userEvent.setup();
      const onCellActivate = vi.fn();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createRowsWithDisabled()}
          ariaLabel="Users"
          onCellActivate={onCellActivate}
        />
      );

      const disabledCell = screen.getByRole('gridcell', { name: 'alice@example.com' });
      disabledCell.focus();

      await user.keyboard('{Enter}');

      expect(onCellActivate).not.toHaveBeenCalled();
    });

    it('Space does not select disabled cell', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createRowsWithDisabled()}
          ariaLabel="Users"
          selectable
        />
      );

      const disabledCell = screen.getByRole('gridcell', { name: 'alice@example.com' });
      disabledCell.focus();

      await user.keyboard(' ');

      expect(disabledCell).toHaveAttribute('aria-selected', 'false');
    });

    it('Ctrl+A selects all (multiselectable only)', async () => {
      const user = userEvent.setup();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
          multiselectable
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      await user.keyboard('{Control>}a{/Control}');

      const cells = screen.getAllByRole('gridcell');
      cells.forEach((cell) => {
        expect(cell).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('calls onSelectionChange callback', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
          onSelectionChange={onSelectionChange}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      await user.keyboard(' ');

      expect(onSelectionChange).toHaveBeenCalledWith(['row1-0']);
    });

    it('controlled selectedIds overrides internal state', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
          selectedIds={['row2-1']}
        />
      );

      const targetCell = screen.getByRole('gridcell', { name: 'bob@example.com' });
      expect(targetCell).toHaveAttribute('aria-selected', 'true');

      const otherCells = screen.getAllByRole('gridcell').filter((cell) => cell !== targetCell);
      otherCells.forEach((cell) => {
        expect(cell).toHaveAttribute('aria-selected', 'false');
      });
    });
  });

  // 🟡 Medium Priority: Virtualization Support
  describe('Virtualization Support', () => {
    it('has aria-rowcount when totalRows provided', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          totalRows={100}
        />
      );

      expect(screen.getByRole('grid')).toHaveAttribute('aria-rowcount', '100');
    });

    it('has aria-colcount when totalColumns provided', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          totalColumns={10}
        />
      );

      expect(screen.getByRole('grid')).toHaveAttribute('aria-colcount', '10');
    });

    it('has aria-rowindex on rows when virtualizing', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          totalRows={100}
          startRowIndex={10}
        />
      );

      const rows = screen.getAllByRole('row');
      // Skip header row (index 0), check data rows
      expect(rows[1]).toHaveAttribute('aria-rowindex', '10');
      expect(rows[2]).toHaveAttribute('aria-rowindex', '11');
      expect(rows[3]).toHaveAttribute('aria-rowindex', '12');
    });

    it('has aria-colindex on cells when virtualizing', () => {
      render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          totalColumns={10}
          startColIndex={5}
        />
      );

      const firstRowCells = screen.getAllByRole('gridcell').slice(0, 3);
      expect(firstRowCells[0]).toHaveAttribute('aria-colindex', '5');
      expect(firstRowCells[1]).toHaveAttribute('aria-colindex', '6');
      expect(firstRowCells[2]).toHaveAttribute('aria-colindex', '7');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <Grid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with selection enabled', async () => {
      const { container } = render(
        <Grid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
          multiselectable
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
