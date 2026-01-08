import { render, screen, within } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Table from './Table.svelte';
import TableWithLabelledby from './TableWithLabelledby.test.svelte';
import type { TableColumn, TableRow, TableCell } from './Table.svelte';

const basicColumns: TableColumn[] = [
  { id: 'name', header: 'Name' },
  { id: 'age', header: 'Age' },
  { id: 'city', header: 'City' },
];

const basicRows: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'] },
  { id: '2', cells: ['Bob', '25', 'Osaka'] },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
];

const sortableColumns: TableColumn[] = [
  { id: 'name', header: 'Name', sortable: true, sort: 'ascending' },
  { id: 'age', header: 'Age', sortable: true },
  { id: 'city', header: 'City' },
];

const rowsWithRowHeader: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'], hasRowHeader: true },
  { id: '2', cells: ['Bob', '25', 'Osaka'], hasRowHeader: true },
];

describe('Table (Svelte)', () => {
  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA Structure', () => {
    it('has role="table" on container', () => {
      render(Table, {
        props: { columns: basicColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('has role="rowgroup" on header and body groups', () => {
      render(Table, {
        props: { columns: basicColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const rowgroups = screen.getAllByRole('rowgroup');
      expect(rowgroups).toHaveLength(2);
    });

    it('has role="row" on all rows', () => {
      render(Table, {
        props: { columns: basicColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 1 header + 3 data
    });

    it('has role="columnheader" on header cells', () => {
      render(Table, {
        props: { columns: basicColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(3);
      expect(headers[0]).toHaveTextContent('Name');
    });

    it('has role="cell" on data cells', () => {
      render(Table, {
        props: { columns: basicColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(9);
    });

    it('has role="rowheader" on row headers when hasRowHeader is true', () => {
      render(Table, {
        props: { columns: basicColumns, rows: rowsWithRowHeader, 'aria-label': 'Users' },
      });
      const rowheaders = screen.getAllByRole('rowheader');
      expect(rowheaders).toHaveLength(2);
      expect(rowheaders[0]).toHaveTextContent('Alice');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('APG: Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(Table, {
        props: { columns: basicColumns, rows: basicRows, 'aria-label': 'User List' },
      });
      expect(screen.getByRole('table', { name: 'User List' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(TableWithLabelledby);
      expect(screen.getByRole('table', { name: 'Employee Directory' })).toBeInTheDocument();
    });

    it('displays caption when provided', () => {
      render(Table, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          'aria-label': 'Users',
          caption: 'User Data',
        },
      });
      expect(screen.getByText('User Data')).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Sort State
  describe('APG: Sort State', () => {
    it('has aria-sort="ascending" on ascending sorted column', () => {
      render(Table, {
        props: { columns: sortableColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('has aria-sort="descending" on descending sorted column', () => {
      const columns: TableColumn[] = [
        { id: 'name', header: 'Name', sortable: true, sort: 'descending' },
        { id: 'age', header: 'Age', sortable: true },
      ];
      render(Table, {
        props: { columns, rows: basicRows, 'aria-label': 'Users' },
      });
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('has aria-sort="none" on unsorted sortable columns', () => {
      render(Table, {
        props: { columns: sortableColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const ageHeader = screen.getByRole('columnheader', { name: /age/i });
      expect(ageHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('does not have aria-sort on non-sortable columns', () => {
      render(Table, {
        props: { columns: sortableColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const cityHeader = screen.getByRole('columnheader', { name: /city/i });
      expect(cityHeader).not.toHaveAttribute('aria-sort');
    });

    it('calls onSortChange when sortable header is clicked', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(Table, {
        props: {
          columns: sortableColumns,
          rows: basicRows,
          'aria-label': 'Users',
          onSortChange,
        },
      });

      const ageHeader = screen.getByRole('columnheader', { name: /age/i });
      const sortButton = within(ageHeader).getByRole('button');
      await user.click(sortButton);

      expect(onSortChange).toHaveBeenCalledWith('age', 'ascending');
    });

    it('toggles sort direction when already sorted column is clicked', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(Table, {
        props: {
          columns: sortableColumns,
          rows: basicRows,
          'aria-label': 'Users',
          onSortChange,
        },
      });

      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      const sortButton = within(nameHeader).getByRole('button');
      await user.click(sortButton);

      expect(onSortChange).toHaveBeenCalledWith('name', 'descending');
    });
  });

  // 🟡 Medium Priority: Virtualization Support
  describe('APG: Virtualization Support', () => {
    it('has aria-colcount when totalColumns is provided', () => {
      render(Table, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          'aria-label': 'Users',
          totalColumns: 10,
        },
      });
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-colcount', '10');
    });

    it('has aria-rowcount when totalRows is provided', () => {
      render(Table, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          'aria-label': 'Users',
          totalRows: 100,
        },
      });
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-rowcount', '100');
    });

    it('has aria-rowindex on rows when rowIndex is provided', () => {
      const rowsWithIndex: TableRow[] = [
        { id: '1', cells: ['Alice', '30', 'Tokyo'], rowIndex: 5 },
        { id: '2', cells: ['Bob', '25', 'Osaka'], rowIndex: 6 },
      ];
      render(Table, {
        props: {
          columns: basicColumns,
          rows: rowsWithIndex,
          'aria-label': 'Users',
          totalRows: 100,
        },
      });
      const rows = screen.getAllByRole('row');
      expect(rows[1]).toHaveAttribute('aria-rowindex', '5');
      expect(rows[2]).toHaveAttribute('aria-rowindex', '6');
    });

    it('has aria-colindex on cells when startColIndex is provided', () => {
      render(Table, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          'aria-label': 'Users',
          totalColumns: 10,
          startColIndex: 3,
        },
      });
      const firstRow = screen.getAllByRole('row')[1];
      const cells = within(firstRow).getAllByRole('cell');
      expect(cells[0]).toHaveAttribute('aria-colindex', '3');
      expect(cells[1]).toHaveAttribute('aria-colindex', '4');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations with basic table', async () => {
      const { container } = render(Table, {
        props: { columns: basicColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with sortable columns', async () => {
      const { container } = render(Table, {
        props: { columns: sortableColumns, rows: basicRows, 'aria-label': 'Users' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with row headers', async () => {
      const { container } = render(Table, {
        props: { columns: basicColumns, rows: rowsWithRowHeader, 'aria-label': 'Users' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with empty table', async () => {
      const { container } = render(Table, {
        props: { columns: basicColumns, rows: [], 'aria-label': 'Empty Users' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Cell Spanning
  describe('APG: Cell Spanning', () => {
    it('has aria-colspan when cell spans multiple columns', () => {
      const rowsWithColspan: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Merged', colspan: 2 } as TableCell, 'Single'],
        },
      ];
      render(Table, {
        props: { columns: basicColumns, rows: rowsWithColspan, 'aria-label': 'Users' },
      });
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).toHaveAttribute('aria-colspan', '2');
      expect(cells[1]).not.toHaveAttribute('aria-colspan');
    });

    it('has aria-rowspan when cell spans multiple rows', () => {
      const rowsWithRowspan: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Spans 2 rows', rowspan: 2 } as TableCell, 'A', 'B'],
        },
        { id: '2', cells: ['C', 'D'] },
      ];
      render(Table, {
        props: { columns: basicColumns, rows: rowsWithRowspan, 'aria-label': 'Users' },
      });
      const firstRowCells = within(screen.getAllByRole('row')[1]).getAllByRole('cell');
      expect(firstRowCells[0]).toHaveAttribute('aria-rowspan', '2');
    });

    it('does not have aria-colspan when colspan is 1', () => {
      const rowsWithColspanOne: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Single', colspan: 1 } as TableCell, 'B', 'C'],
        },
      ];
      render(Table, {
        props: { columns: basicColumns, rows: rowsWithColspanOne, 'aria-label': 'Users' },
      });
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).not.toHaveAttribute('aria-colspan');
    });

    it('renders cell content correctly with TableCell object', () => {
      const rowsWithTableCell: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Cell Content', colspan: 2 } as TableCell, 'Normal'],
        },
      ];
      render(Table, {
        props: { columns: basicColumns, rows: rowsWithTableCell, 'aria-label': 'Users' },
      });
      expect(screen.getByText('Cell Content')).toBeInTheDocument();
      expect(screen.getByText('Normal')).toBeInTheDocument();
    });

    it('has no axe violations with spanning cells', async () => {
      const rowsWithSpanning: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Merged', colspan: 2 } as TableCell, 'C'],
        },
        { id: '2', cells: ['D', 'E', 'F'] },
      ];
      const { container } = render(Table, {
        props: { columns: basicColumns, rows: rowsWithSpanning, 'aria-label': 'Users' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('renders empty table with no rows', () => {
      render(Table, {
        props: { columns: basicColumns, rows: [], 'aria-label': 'Empty' },
      });
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const cells = screen.queryAllByRole('cell');
      expect(cells).toHaveLength(0);
    });

    it('handles single column', () => {
      const singleColumn: TableColumn[] = [{ id: 'name', header: 'Name' }];
      const singleColumnRows: TableRow[] = [
        { id: '1', cells: ['Alice'] },
        { id: '2', cells: ['Bob'] },
      ];
      render(Table, {
        props: { columns: singleColumn, rows: singleColumnRows, 'aria-label': 'Names' },
      });
      expect(screen.getAllByRole('columnheader')).toHaveLength(1);
      expect(screen.getAllByRole('cell')).toHaveLength(2);
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies class to container', () => {
      render(Table, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          'aria-label': 'Users',
          class: 'custom-table',
        },
      });
      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-table');
    });

    it('sets id attribute', () => {
      render(Table, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          'aria-label': 'Users',
          id: 'my-table',
        },
      });
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('id', 'my-table');
    });

    it('passes through data-* attributes', () => {
      render(Table, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          'aria-label': 'Users',
          'data-testid': 'user-table',
        },
      });
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });
});
