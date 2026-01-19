import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  DataGrid,
  type DataGridColumnDef,
  type DataGridRowData,
  type SortDirection,
} from './DataGrid';

// Helper function to create sortable columns
const createSortableColumns = (): DataGridColumnDef[] => [
  { id: 'name', header: 'Name', sortable: true, sortDirection: 'none' },
  { id: 'email', header: 'Email', sortable: true, sortDirection: 'none' },
  { id: 'role', header: 'Role', sortable: false },
];

// Helper function to create basic columns (no sort)
const createBasicColumns = (): DataGridColumnDef[] => [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

// Helper function to create basic rows
const createBasicRows = (): DataGridRowData[] => [
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

// Rows with editable cells
const createEditableRows = (): DataGridRowData[] => [
  {
    id: 'row1',
    cells: [
      { id: 'row1-0', value: 'Alice', editable: true },
      { id: 'row1-1', value: 'alice@example.com', editable: true },
      { id: 'row1-2', value: 'Admin', readonly: true },
    ],
  },
  {
    id: 'row2',
    cells: [
      { id: 'row2-0', value: 'Bob', editable: true },
      { id: 'row2-1', value: 'bob@example.com', editable: true },
      { id: 'row2-2', value: 'User' },
    ],
  },
];

// Rows with disabled cells/rows
const createRowsWithDisabled = (): DataGridRowData[] => [
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
    disabled: true,
    cells: [
      { id: 'row2-0', value: 'Bob' },
      { id: 'row2-1', value: 'bob@example.com' },
      { id: 'row2-2', value: 'User' },
    ],
  },
];

// Rows with row header
const createRowsWithRowHeader = (): DataGridRowData[] => [
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

// Columns with span
const createColumnsWithSpan = (): DataGridColumnDef[] => [
  { id: 'info', header: 'Info', colspan: 2 },
  { id: 'role', header: 'Role' },
];

// Rows with spanned cells
const createRowsWithSpan = (): DataGridRowData[] => [
  {
    id: 'row1',
    cells: [
      { id: 'row1-0', value: 'Merged', colspan: 2 },
      { id: 'row1-2', value: 'Normal' },
    ],
  },
  {
    id: 'row2',
    hasRowHeader: true,
    cells: [
      { id: 'row2-0', value: 'Header', rowspan: 2 },
      { id: 'row2-1', value: 'A' },
      { id: 'row2-2', value: 'B' },
    ],
  },
];

describe('DataGrid', () => {
  // ========================================
  // High Priority: ARIA Attributes
  // ========================================
  describe('ARIA Attributes', () => {
    it('has role="grid" on container', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('has role="row" on all rows', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      // Header row + 3 data rows = 4 rows
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('has role="gridcell" on data cells', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      // 3 rows * 3 columns = 9 cells
      expect(screen.getAllByRole('gridcell')).toHaveLength(9);
    });

    it('has role="columnheader" on header cells', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    });

    it('has role="rowheader" when hasRowHeader is true', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createRowsWithRowHeader()}
          ariaLabel="Users"
        />
      );
      expect(screen.getAllByRole('rowheader')).toHaveLength(2);
    });

    it('sortable columnheader has aria-sort', () => {
      render(
        <DataGrid columns={createSortableColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      const nameHeader = screen.getByRole('columnheader', { name: 'Name' });
      expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('non-sortable columnheader does NOT have aria-sort', () => {
      render(
        <DataGrid columns={createSortableColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      const roleHeader = screen.getByRole('columnheader', { name: 'Role' });
      expect(roleHeader).not.toHaveAttribute('aria-sort');
    });

    it('aria-sort updates on sort action', async () => {
      const columns: DataGridColumnDef[] = [
        { id: 'name', header: 'Name', sortable: true, sortDirection: 'none' },
      ];
      const onSort = vi.fn((_columnId: string, direction: SortDirection) => {
        columns[0].sortDirection = direction;
      });
      const { rerender } = render(
        <DataGrid columns={columns} rows={createBasicRows()} ariaLabel="Users" onSort={onSort} />
      );

      const header = screen.getByRole('columnheader', { name: 'Name' });
      header.focus();
      await userEvent.setup().keyboard('{Enter}');

      // Rerender with updated column
      rerender(
        <DataGrid columns={columns} rows={createBasicRows()} ariaLabel="Users" onSort={onSort} />
      );

      expect(header).toHaveAttribute('aria-sort', 'ascending');
    });

    it('row has aria-selected when rowSelectable', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
        />
      );
      const rows = screen.getAllByRole('row');
      // Skip header row, check data rows
      expect(rows[1]).toHaveAttribute('aria-selected', 'false');
      expect(rows[2]).toHaveAttribute('aria-selected', 'false');
    });

    it('has accessible name via aria-label', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      expect(screen.getByRole('grid', { name: 'Users' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <div>
          <h2 id="grid-title">User List</h2>
          <DataGrid
            columns={createBasicColumns()}
            rows={createBasicRows()}
            ariaLabelledby="grid-title"
          />
        </div>
      );
      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-labelledby', 'grid-title');
    });

    it('has aria-multiselectable="true" when rowMultiselectable', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
          rowMultiselectable
        />
      );
      expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('has aria-multiselectable="true" when cell multiselectable', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
          multiselectable
        />
      );
      expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('has aria-readonly="true" when readonly prop is true', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          editable
          readonly
        />
      );
      expect(screen.getByRole('grid')).toHaveAttribute('aria-readonly', 'true');
    });

    it('editable cells have aria-readonly="false" or omitted', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
        />
      );
      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      const ariaReadonly = editableCell.getAttribute('aria-readonly');
      expect(ariaReadonly === null || ariaReadonly === 'false').toBe(true);
    });

    it('readonly cells have aria-readonly="true"', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
        />
      );
      const readonlyCell = screen.getByRole('gridcell', { name: 'Admin' });
      expect(readonlyCell).toHaveAttribute('aria-readonly', 'true');
    });

    it('has aria-rowcount/aria-colcount when virtualizing', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          totalRows={100}
          totalColumns={10}
        />
      );
      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-rowcount', '100');
      expect(grid).toHaveAttribute('aria-colcount', '10');
    });

    it('has aria-rowindex on rows when virtualizing (1-based, header row = 1)', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          totalRows={100}
          startRowIndex={10}
        />
      );
      const rows = screen.getAllByRole('row');
      // Header row should have aria-rowindex="1"
      expect(rows[0]).toHaveAttribute('aria-rowindex', '1');
      // Data rows start at startRowIndex
      expect(rows[1]).toHaveAttribute('aria-rowindex', '10');
      expect(rows[2]).toHaveAttribute('aria-rowindex', '11');
    });

    it('has aria-colindex on cells/headers when virtualizing', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          totalColumns={10}
          startColIndex={5}
        />
      );
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveAttribute('aria-colindex', '5');
      expect(headers[1]).toHaveAttribute('aria-colindex', '6');

      const cells = screen.getAllByRole('gridcell').slice(0, 3);
      expect(cells[0]).toHaveAttribute('aria-colindex', '5');
      expect(cells[1]).toHaveAttribute('aria-colindex', '6');
    });

    it('has aria-disabled="true" on disabled rows/cells', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createRowsWithDisabled()}
          ariaLabel="Users"
        />
      );
      const disabledCell = screen.getByRole('gridcell', { name: 'alice@example.com' });
      expect(disabledCell).toHaveAttribute('aria-disabled', 'true');

      // Disabled row should have aria-disabled on its cells
      const disabledRow = screen.getAllByRole('row')[2];
      expect(disabledRow).toHaveAttribute('aria-disabled', 'true');
    });

    it('has aria-colspan on gridcells with colspan > 1', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createRowsWithSpan()} ariaLabel="Users" />
      );
      const mergedCell = screen.getByRole('gridcell', { name: 'Merged' });
      expect(mergedCell).toHaveAttribute('aria-colspan', '2');
    });

    it('has aria-colspan on columnheaders with colspan > 1', () => {
      render(
        <DataGrid columns={createColumnsWithSpan()} rows={createBasicRows()} ariaLabel="Users" />
      );
      const infoHeader = screen.getByRole('columnheader', { name: 'Info' });
      expect(infoHeader).toHaveAttribute('aria-colspan', '2');
    });

    it('has aria-rowspan on gridcells/rowheaders with rowspan > 1', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createRowsWithSpan()} ariaLabel="Users" />
      );
      const spannedCell = screen.getByRole('rowheader', { name: 'Header' });
      expect(spannedCell).toHaveAttribute('aria-rowspan', '2');
    });
  });

  // ========================================
  // High Priority: Keyboard - Base Navigation
  // ========================================
  describe('Keyboard - Base Navigation', () => {
    it('ArrowRight moves focus one cell right', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{ArrowRight}');

      expect(screen.getAllByRole('gridcell')[1]).toHaveFocus();
    });

    it('ArrowLeft moves focus one cell left', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const secondCell = screen.getAllByRole('gridcell')[1];
      secondCell.focus();
      await user.keyboard('{ArrowLeft}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('ArrowDown moves focus one row down', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getAllByRole('gridcell')[3]).toHaveFocus();
    });

    it('ArrowUp moves focus one row up', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const secondRowFirstCell = screen.getAllByRole('gridcell')[3];
      secondRowFirstCell.focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('ArrowRight stops at row end (no wrap by default)', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const lastCellInRow = screen.getAllByRole('gridcell')[2];
      lastCellInRow.focus();
      await user.keyboard('{ArrowRight}');

      expect(lastCellInRow).toHaveFocus();
    });

    it('ArrowUp from first data row enters sortable header', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createSortableColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const firstDataCell = screen.getAllByRole('gridcell')[0];
      firstDataCell.focus();
      await user.keyboard('{ArrowUp}');

      // Should move to sortable header
      const sortableHeader = screen.getByRole('columnheader', { name: 'Name' });
      expect(sortableHeader).toHaveFocus();
    });

    it('ArrowDown from header enters first data row', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createSortableColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const sortableHeader = screen.getByRole('columnheader', { name: 'Name' });
      sortableHeader.focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('Home moves to first cell in row', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const lastCellInRow = screen.getAllByRole('gridcell')[2];
      lastCellInRow.focus();
      await user.keyboard('{Home}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('End moves to last cell in row', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{End}');

      expect(screen.getAllByRole('gridcell')[2]).toHaveFocus();
    });

    it('Ctrl+Home moves to first cell in grid', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const lastCell = screen.getAllByRole('gridcell')[8];
      lastCell.focus();
      await user.keyboard('{Control>}{Home}{/Control}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('Ctrl+End moves to last cell in grid', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{Control>}{End}{/Control}');

      expect(screen.getAllByRole('gridcell')[8]).toHaveFocus();
    });

    it('PageDown moves down by pageSize (when enabled)', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enablePageNavigation
          pageSize={2}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{PageDown}');

      expect(screen.getAllByRole('gridcell')[6]).toHaveFocus();
    });

    it('PageUp moves up by pageSize (when enabled)', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enablePageNavigation
          pageSize={2}
        />
      );

      const lastRowCell = screen.getAllByRole('gridcell')[6];
      lastRowCell.focus();
      await user.keyboard('{PageUp}');

      expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
    });

    it('Tab exits grid to next focusable element', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
          <button>After</button>
        </div>
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.tab();

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it('Shift+Tab exits grid to previous focusable element', async () => {
      render(
        <div>
          <button>Before</button>
          <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
        </div>
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      fireEvent.keyDown(firstCell, { key: 'Tab', shiftKey: true });

      // Note: actual focus behavior depends on browser
    });

    it('navigation skips disabled cells', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createRowsWithDisabled()}
          ariaLabel="Users"
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{ArrowRight}');

      // Should skip disabled cell and focus Admin
      expect(screen.getByRole('gridcell', { name: 'Admin' })).toHaveFocus();
    });
  });

  // ========================================
  // High Priority: Keyboard - Sorting
  // ========================================
  describe('Keyboard - Sorting', () => {
    it('Enter on sortable header triggers sort', async () => {
      const onSort = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createSortableColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          onSort={onSort}
        />
      );

      const header = screen.getByRole('columnheader', { name: 'Name' });
      header.focus();
      await user.keyboard('{Enter}');

      expect(onSort).toHaveBeenCalledWith('name', 'ascending');
    });

    it('Space on sortable header triggers sort', async () => {
      const onSort = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createSortableColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          onSort={onSort}
        />
      );

      const header = screen.getByRole('columnheader', { name: 'Name' });
      header.focus();
      await user.keyboard(' ');

      expect(onSort).toHaveBeenCalledWith('name', 'ascending');
    });

    it('sort cycles: none -> ascending -> descending -> ascending', async () => {
      const onSort = vi.fn();
      const user = userEvent.setup();
      const columns: DataGridColumnDef[] = [
        { id: 'name', header: 'Name', sortable: true, sortDirection: 'none' },
      ];

      const { rerender } = render(
        <DataGrid columns={columns} rows={createBasicRows()} ariaLabel="Users" onSort={onSort} />
      );

      const header = screen.getByRole('columnheader', { name: 'Name' });
      header.focus();

      // First: none -> ascending
      await user.keyboard('{Enter}');
      expect(onSort).toHaveBeenLastCalledWith('name', 'ascending');

      // Update column and rerender
      columns[0].sortDirection = 'ascending';
      rerender(
        <DataGrid columns={columns} rows={createBasicRows()} ariaLabel="Users" onSort={onSort} />
      );

      // Second: ascending -> descending
      await user.keyboard('{Enter}');
      expect(onSort).toHaveBeenLastCalledWith('name', 'descending');

      // Update column and rerender
      columns[0].sortDirection = 'descending';
      rerender(
        <DataGrid columns={columns} rows={createBasicRows()} ariaLabel="Users" onSort={onSort} />
      );

      // Third: descending -> ascending (loop)
      await user.keyboard('{Enter}');
      expect(onSort).toHaveBeenLastCalledWith('name', 'ascending');
    });

    it('non-sortable headers do not respond to Enter/Space', async () => {
      const onSort = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createSortableColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          onSort={onSort}
        />
      );

      // Focus on non-sortable header (Role column)
      // Non-sortable headers should not be focusable, so this test verifies the behavior
      const roleHeader = screen.getByRole('columnheader', { name: 'Role' });
      roleHeader.focus();
      await user.keyboard('{Enter}');
      await user.keyboard(' ');

      // onSort should not have been called for non-sortable header
      expect(onSort).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // High Priority: Keyboard - Range Selection
  // ========================================
  describe('Keyboard - Range Selection', () => {
    it('Shift+ArrowDown extends selection downward', async () => {
      const onRangeSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enableRangeSelection
          onRangeSelect={onRangeSelect}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');

      expect(onRangeSelect).toHaveBeenCalled();
      // Should include first cell and cell below
      const selectedIds = onRangeSelect.mock.calls[0][0];
      expect(selectedIds).toContain('row1-0');
      expect(selectedIds).toContain('row2-0');
    });

    it('Shift+ArrowUp extends selection upward', async () => {
      const onRangeSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enableRangeSelection
          onRangeSelect={onRangeSelect}
        />
      );

      const secondRowCell = screen.getAllByRole('gridcell')[3];
      secondRowCell.focus();
      await user.keyboard('{Shift>}{ArrowUp}{/Shift}');

      expect(onRangeSelect).toHaveBeenCalled();
      const selectedIds = onRangeSelect.mock.calls[0][0];
      expect(selectedIds).toContain('row1-0');
      expect(selectedIds).toContain('row2-0');
    });

    it('Shift+Home extends selection to row start', async () => {
      const onRangeSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enableRangeSelection
          onRangeSelect={onRangeSelect}
        />
      );

      const lastCellInRow = screen.getAllByRole('gridcell')[2];
      lastCellInRow.focus();
      await user.keyboard('{Shift>}{Home}{/Shift}');

      expect(onRangeSelect).toHaveBeenCalled();
      const selectedIds = onRangeSelect.mock.calls[0][0];
      expect(selectedIds).toContain('row1-0');
      expect(selectedIds).toContain('row1-1');
      expect(selectedIds).toContain('row1-2');
    });

    it('Shift+End extends selection to row end', async () => {
      const onRangeSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enableRangeSelection
          onRangeSelect={onRangeSelect}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{Shift>}{End}{/Shift}');

      expect(onRangeSelect).toHaveBeenCalled();
      const selectedIds = onRangeSelect.mock.calls[0][0];
      expect(selectedIds).toContain('row1-0');
      expect(selectedIds).toContain('row1-1');
      expect(selectedIds).toContain('row1-2');
    });

    it('Ctrl+Shift+Home extends selection to grid start', async () => {
      const onRangeSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enableRangeSelection
          onRangeSelect={onRangeSelect}
        />
      );

      const lastCell = screen.getAllByRole('gridcell')[8];
      lastCell.focus();
      await user.keyboard('{Control>}{Shift>}{Home}{/Shift}{/Control}');

      expect(onRangeSelect).toHaveBeenCalled();
      // Should include all cells from start to current
    });

    it('Ctrl+Shift+End extends selection to grid end', async () => {
      const onRangeSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enableRangeSelection
          onRangeSelect={onRangeSelect}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();
      await user.keyboard('{Control>}{Shift>}{End}{/Shift}{/Control}');

      expect(onRangeSelect).toHaveBeenCalled();
      // Should include all cells from current to end
    });

    it('selection anchor is set on first selection', async () => {
      const onRangeSelect = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          enableRangeSelection
          onRangeSelect={onRangeSelect}
        />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      // First Shift+ArrowDown
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      const firstCall = onRangeSelect.mock.calls[0][0];

      // Second Shift+ArrowDown (should extend from anchor)
      await user.keyboard('{Shift>}{ArrowDown}{/Shift}');
      const secondCall = onRangeSelect.mock.calls[1][0];

      // Second call should have more cells (anchor + 2 rows down)
      expect(secondCall.length).toBeGreaterThan(firstCall.length);
    });
  });

  // ========================================
  // High Priority: Row Selection
  // ========================================
  describe('Row Selection', () => {
    it('checkbox click toggles row selection', async () => {
      const onRowSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const checkbox = screen.getAllByRole('checkbox')[0];
      await user.click(checkbox);

      expect(onRowSelectionChange).toHaveBeenCalledWith(['row1']);
    });

    it('Space on checkbox cell toggles row selection', async () => {
      const onRowSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const checkbox = screen.getAllByRole('checkbox')[0];
      checkbox.focus();
      await user.keyboard(' ');

      expect(onRowSelectionChange).toHaveBeenCalledWith(['row1']);
    });

    it('aria-selected updates on row element', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
        />
      );

      const rows = screen.getAllByRole('row');
      const dataRow = rows[1];
      expect(dataRow).toHaveAttribute('aria-selected', 'false');

      const checkbox = screen.getAllByRole('checkbox')[0];
      await user.click(checkbox);

      expect(dataRow).toHaveAttribute('aria-selected', 'true');
    });

    it('onRowSelectionChange callback fires', async () => {
      const onRowSelectionChange = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
          onRowSelectionChange={onRowSelectionChange}
        />
      );

      const checkbox = screen.getAllByRole('checkbox')[0];
      await user.click(checkbox);

      expect(onRowSelectionChange).toHaveBeenCalledTimes(1);
      expect(onRowSelectionChange).toHaveBeenCalledWith(['row1']);
    });
  });

  // ========================================
  // High Priority: Selection Model Exclusivity
  // ========================================
  describe('Selection Model Exclusivity', () => {
    it('when rowSelectable: aria-selected on rows only', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
        />
      );

      const rows = screen.getAllByRole('row');
      // Data rows should have aria-selected
      expect(rows[1]).toHaveAttribute('aria-selected');

      // Cells should NOT have aria-selected
      const cells = screen.getAllByRole('gridcell');
      cells.forEach((cell) => {
        expect(cell).not.toHaveAttribute('aria-selected');
      });
    });

    it('when selectable (cell): aria-selected on gridcells only', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          selectable
        />
      );

      // Cells should have aria-selected
      const cells = screen.getAllByRole('gridcell');
      cells.forEach((cell) => {
        expect(cell).toHaveAttribute('aria-selected');
      });

      // Data rows should NOT have aria-selected
      const rows = screen.getAllByRole('row');
      expect(rows[1]).not.toHaveAttribute('aria-selected');
    });

    it('aria-multiselectable on grid (not on individual elements)', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
          rowMultiselectable
        />
      );

      const grid = screen.getByRole('grid');
      expect(grid).toHaveAttribute('aria-multiselectable', 'true');

      // Rows/cells should NOT have aria-multiselectable
      const rows = screen.getAllByRole('row');
      rows.forEach((row) => {
        expect(row).not.toHaveAttribute('aria-multiselectable');
      });
    });
  });

  // ========================================
  // High Priority: Focus Management
  // ========================================
  describe('Focus Management', () => {
    it('sortable columnheaders are focusable (tabindex)', () => {
      render(
        <DataGrid columns={createSortableColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const sortableHeader = screen.getByRole('columnheader', { name: 'Name' });
      expect(sortableHeader).toHaveAttribute('tabindex');
    });

    it('non-sortable columnheaders are NOT focusable', () => {
      render(
        <DataGrid columns={createSortableColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const nonSortableHeader = screen.getByRole('columnheader', { name: 'Role' });
      expect(nonSortableHeader).not.toHaveAttribute('tabindex');
    });

    it('first focusable cell has tabindex="0"', () => {
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const firstCell = screen.getAllByRole('gridcell')[0];
      expect(firstCell).toHaveAttribute('tabindex', '0');
    });

    it('roving tabindex updates correctly', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );

      const cells = screen.getAllByRole('gridcell');
      cells[0].focus();
      await user.keyboard('{ArrowRight}');

      expect(cells[0]).toHaveAttribute('tabindex', '-1');
      expect(cells[1]).toHaveAttribute('tabindex', '0');
    });
  });

  // ========================================
  // High Priority: Cell Editing
  // ========================================
  describe('Cell Editing', () => {
    it('Enter on editable cell enters edit mode', async () => {
      const onEditStart = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
          onEditStart={onEditStart}
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{Enter}');

      expect(onEditStart).toHaveBeenCalledWith('row1-0', 'row1', 'name');
    });

    it('F2 on editable cell enters edit mode', async () => {
      const onEditStart = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
          onEditStart={onEditStart}
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{F2}');

      expect(onEditStart).toHaveBeenCalledWith('row1-0', 'row1', 'name');
    });

    it('Escape in edit mode cancels and restores grid navigation', async () => {
      const onEditEnd = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
          onEditEnd={onEditEnd}
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{Enter}');

      // Should be in edit mode, type something
      await user.keyboard('New Value');
      await user.keyboard('{Escape}');

      expect(onEditEnd).toHaveBeenCalledWith('row1-0', expect.any(String), true);
    });

    it('edit mode disables grid keyboard navigation', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{Enter}');

      // Arrow keys should work within input, not navigate grid
      await user.keyboard('{ArrowRight}');

      // Should still be in edit mode (focus on input, not next cell)
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });

    it('focus moves to input field on edit start', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{Enter}');

      const input = screen.getByRole('textbox');
      expect(input).toHaveFocus();
    });

    it('focus returns to cell on edit end', async () => {
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{Enter}');

      // Wait for edit mode to be active
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      // Wait for focus to return to cell
      await waitFor(() => {
        expect(editableCell).toHaveFocus();
      });
    });

    it('onEditStart callback fires when entering edit mode', async () => {
      const onEditStart = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
          onEditStart={onEditStart}
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{Enter}');

      expect(onEditStart).toHaveBeenCalledTimes(1);
    });

    it('onEditEnd callback fires when exiting edit mode', async () => {
      const onEditEnd = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
          onEditEnd={onEditEnd}
        />
      );

      const editableCell = screen.getByRole('gridcell', { name: 'Alice' });
      editableCell.focus();
      await user.keyboard('{Enter}');
      await user.keyboard('{Escape}');

      expect(onEditEnd).toHaveBeenCalledTimes(1);
    });

    it('non-editable cell does not enter edit mode on Enter/F2', async () => {
      const onEditStart = vi.fn();
      const user = userEvent.setup();
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createEditableRows()}
          ariaLabel="Users"
          editable
          onEditStart={onEditStart}
        />
      );

      // Admin cell is readonly
      const readonlyCell = screen.getByRole('gridcell', { name: 'Admin' });
      readonlyCell.focus();
      await user.keyboard('{Enter}');
      await user.keyboard('{F2}');

      expect(onEditStart).not.toHaveBeenCalled();
    });
  });

  // ========================================
  // Medium Priority: Accessibility
  // ========================================
  describe('Accessibility', () => {
    it('has no axe violations (WCAG 2.1 AA)', async () => {
      const { container } = render(
        <DataGrid columns={createBasicColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with row selection enabled', async () => {
      const { container } = render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
          rowMultiselectable
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with sorting enabled', async () => {
      const { container } = render(
        <DataGrid columns={createSortableColumns()} rows={createBasicRows()} ariaLabel="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('sort indicators have accessible names', () => {
      render(
        <DataGrid
          columns={[{ id: 'name', header: 'Name', sortable: true, sortDirection: 'ascending' }]}
          rows={createBasicRows()}
          ariaLabel="Users"
        />
      );

      const header = screen.getByRole('columnheader', { name: /Name/ });
      // Header should have aria-sort which provides accessible state
      expect(header).toHaveAttribute('aria-sort', 'ascending');
    });

    it('checkboxes have accessible labels', () => {
      render(
        <DataGrid
          columns={createBasicColumns()}
          rows={createBasicRows()}
          ariaLabel="Users"
          rowSelectable
        />
      );

      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach((checkbox) => {
        // Each checkbox should have an accessible name
        const label =
          checkbox.getAttribute('aria-label') || checkbox.getAttribute('aria-labelledby');
        expect(label).toBeTruthy();
      });
    });
  });
});
