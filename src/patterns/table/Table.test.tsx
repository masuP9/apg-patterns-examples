import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Table, TableColumn, TableRow, TableCell } from './Table';

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

describe('Table', () => {
  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA Structure', () => {
    it('has role="table" on container', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" />);
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('has role="rowgroup" on header and body groups', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" />);
      const rowgroups = screen.getAllByRole('rowgroup');
      expect(rowgroups).toHaveLength(2); // header + body
    });

    it('has role="row" on all rows', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(4); // 1 header row + 3 data rows
    });

    it('has role="columnheader" on header cells', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" />);
      const headers = screen.getAllByRole('columnheader');
      expect(headers).toHaveLength(3);
      expect(headers[0]).toHaveTextContent('Name');
      expect(headers[1]).toHaveTextContent('Age');
      expect(headers[2]).toHaveTextContent('City');
    });

    it('has role="cell" on data cells', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" />);
      const cells = screen.getAllByRole('cell');
      expect(cells).toHaveLength(9); // 3 columns x 3 rows
    });

    it('has role="rowheader" on row headers when hasRowHeader is true', () => {
      render(<Table columns={basicColumns} rows={rowsWithRowHeader} aria-label="Users" />);
      const rowheaders = screen.getAllByRole('rowheader');
      expect(rowheaders).toHaveLength(2);
      expect(rowheaders[0]).toHaveTextContent('Alice');
      expect(rowheaders[1]).toHaveTextContent('Bob');
    });

    it('does not have rowheader role when hasRowHeader is false', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" />);
      expect(screen.queryByRole('rowheader')).not.toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('APG: Accessible Name', () => {
    it('has accessible name via aria-label', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="User List" />);
      expect(screen.getByRole('table', { name: 'User List' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <>
          <h2 id="table-title">Employee Directory</h2>
          <Table columns={basicColumns} rows={basicRows} aria-labelledby="table-title" />
        </>
      );
      expect(screen.getByRole('table', { name: 'Employee Directory' })).toBeInTheDocument();
    });

    it('has description via aria-describedby', () => {
      render(
        <>
          <Table
            columns={basicColumns}
            rows={basicRows}
            aria-label="Users"
            aria-describedby="table-desc"
          />
          <p id="table-desc">A list of registered users</p>
        </>
      );
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-describedby', 'table-desc');
    });

    it('displays caption when provided', () => {
      render(
        <Table columns={basicColumns} rows={basicRows} aria-label="Users" caption="User Data" />
      );
      expect(screen.getByText('User Data')).toBeInTheDocument();
    });
  });

  // 🔴 High Priority: Sort State
  describe('APG: Sort State', () => {
    it('has aria-sort="ascending" on ascending sorted column', () => {
      render(<Table columns={sortableColumns} rows={basicRows} aria-label="Users" />);
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('has aria-sort="descending" on descending sorted column', () => {
      const columns: TableColumn[] = [
        { id: 'name', header: 'Name', sortable: true, sort: 'descending' },
        { id: 'age', header: 'Age', sortable: true },
      ];
      render(<Table columns={columns} rows={basicRows} aria-label="Users" />);
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('has aria-sort="none" on unsorted sortable columns', () => {
      render(<Table columns={sortableColumns} rows={basicRows} aria-label="Users" />);
      const ageHeader = screen.getByRole('columnheader', { name: /age/i });
      expect(ageHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('does not have aria-sort on non-sortable columns', () => {
      render(<Table columns={sortableColumns} rows={basicRows} aria-label="Users" />);
      const cityHeader = screen.getByRole('columnheader', { name: /city/i });
      expect(cityHeader).not.toHaveAttribute('aria-sort');
    });

    it('calls onSortChange when sortable header is clicked', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(
        <Table
          columns={sortableColumns}
          rows={basicRows}
          aria-label="Users"
          onSortChange={onSortChange}
        />
      );

      const ageHeader = screen.getByRole('columnheader', { name: /age/i });
      const sortButton = within(ageHeader).getByRole('button');
      await user.click(sortButton);

      expect(onSortChange).toHaveBeenCalledWith('age', 'ascending');
    });

    it('toggles sort direction when already sorted column is clicked', async () => {
      const user = userEvent.setup();
      const onSortChange = vi.fn();
      render(
        <Table
          columns={sortableColumns}
          rows={basicRows}
          aria-label="Users"
          onSortChange={onSortChange}
        />
      );

      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      const sortButton = within(nameHeader).getByRole('button');
      await user.click(sortButton);

      expect(onSortChange).toHaveBeenCalledWith('name', 'descending');
    });

    it('sortable header button has accessible name', () => {
      render(<Table columns={sortableColumns} rows={basicRows} aria-label="Users" />);
      const nameHeader = screen.getByRole('columnheader', { name: /name/i });
      const sortButton = within(nameHeader).getByRole('button');
      expect(sortButton).toHaveAccessibleName(/sort by name/i);
    });
  });

  // 🟡 Medium Priority: Virtualization Support
  describe('APG: Virtualization Support', () => {
    it('has aria-colcount when totalColumns is provided', () => {
      render(
        <Table columns={basicColumns} rows={basicRows} aria-label="Users" totalColumns={10} />
      );
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-colcount', '10');
    });

    it('has aria-rowcount when totalRows is provided', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" totalRows={100} />);
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-rowcount', '100');
    });

    it('has aria-rowindex on rows when rowIndex is provided', () => {
      const rowsWithIndex: TableRow[] = [
        { id: '1', cells: ['Alice', '30', 'Tokyo'], rowIndex: 5 },
        { id: '2', cells: ['Bob', '25', 'Osaka'], rowIndex: 6 },
      ];
      render(
        <Table columns={basicColumns} rows={rowsWithIndex} aria-label="Users" totalRows={100} />
      );
      const rows = screen.getAllByRole('row');
      // Skip header row (index 0)
      expect(rows[1]).toHaveAttribute('aria-rowindex', '5');
      expect(rows[2]).toHaveAttribute('aria-rowindex', '6');
    });

    it('has aria-colindex on cells when startColIndex is provided', () => {
      render(
        <Table
          columns={basicColumns}
          rows={basicRows}
          aria-label="Users"
          totalColumns={10}
          startColIndex={3}
        />
      );
      const firstRow = screen.getAllByRole('row')[1]; // First data row
      const cells = within(firstRow).getAllByRole('cell');
      expect(cells[0]).toHaveAttribute('aria-colindex', '3');
      expect(cells[1]).toHaveAttribute('aria-colindex', '4');
      expect(cells[2]).toHaveAttribute('aria-colindex', '5');
    });

    it('does not have virtualization attributes when not provided', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" />);
      const table = screen.getByRole('table');
      expect(table).not.toHaveAttribute('aria-colcount');
      expect(table).not.toHaveAttribute('aria-rowcount');

      const rows = screen.getAllByRole('row');
      expect(rows[1]).not.toHaveAttribute('aria-rowindex');

      const cells = screen.getAllByRole('cell');
      expect(cells[0]).not.toHaveAttribute('aria-colindex');
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations with basic table', async () => {
      const { container } = render(
        <Table columns={basicColumns} rows={basicRows} aria-label="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with sortable columns', async () => {
      const { container } = render(
        <Table columns={sortableColumns} rows={basicRows} aria-label="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with row headers', async () => {
      const { container } = render(
        <Table columns={basicColumns} rows={rowsWithRowHeader} aria-label="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with aria-labelledby', async () => {
      const { container } = render(
        <>
          <h2 id="title">Users</h2>
          <Table columns={basicColumns} rows={basicRows} aria-labelledby="title" />
        </>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with virtualization attributes', async () => {
      const { container } = render(
        <Table
          columns={basicColumns}
          rows={basicRows}
          aria-label="Users"
          totalColumns={10}
          totalRows={100}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with empty table', async () => {
      const { container } = render(
        <Table columns={basicColumns} rows={[]} aria-label="Empty Users" />
      );
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
      render(<Table columns={basicColumns} rows={rowsWithColspan} aria-label="Users" />);
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
      render(<Table columns={basicColumns} rows={rowsWithRowspan} aria-label="Users" />);
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
      render(<Table columns={basicColumns} rows={rowsWithColspanOne} aria-label="Users" />);
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).not.toHaveAttribute('aria-colspan');
    });

    it('does not have aria-rowspan when rowspan is 1', () => {
      const rowsWithRowspanOne: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Single', rowspan: 1 } as TableCell, 'B', 'C'],
        },
      ];
      render(<Table columns={basicColumns} rows={rowsWithRowspanOne} aria-label="Users" />);
      const cells = screen.getAllByRole('cell');
      expect(cells[0]).not.toHaveAttribute('aria-rowspan');
    });

    it('renders cell content correctly with TableCell object', () => {
      const rowsWithTableCell: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Cell Content', colspan: 2 } as TableCell, 'Normal'],
        },
      ];
      render(<Table columns={basicColumns} rows={rowsWithTableCell} aria-label="Users" />);
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
      const { container } = render(
        <Table columns={basicColumns} rows={rowsWithSpanning} aria-label="Users" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('renders empty table with no rows', () => {
      render(<Table columns={basicColumns} rows={[]} aria-label="Empty" />);
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      const cells = screen.queryAllByRole('cell');
      expect(cells).toHaveLength(0);
    });

    it('handles ReactNode in cells', () => {
      const rowsWithNodes: TableRow[] = [
        {
          id: '1',
          cells: [
            <a key="name" href="/alice">
              Alice
            </a>,
            '30',
            <span key="city" className="highlight">
              Tokyo
            </span>,
          ],
        },
      ];
      render(<Table columns={basicColumns} rows={rowsWithNodes} aria-label="Users" />);
      expect(screen.getByRole('link', { name: 'Alice' })).toBeInTheDocument();
      expect(screen.getByText('Tokyo')).toHaveClass('highlight');
    });

    it('handles single column', () => {
      const singleColumn: TableColumn[] = [{ id: 'name', header: 'Name' }];
      const singleColumnRows: TableRow[] = [
        { id: '1', cells: ['Alice'] },
        { id: '2', cells: ['Bob'] },
      ];
      render(<Table columns={singleColumn} rows={singleColumnRows} aria-label="Names" />);
      expect(screen.getAllByRole('columnheader')).toHaveLength(1);
      expect(screen.getAllByRole('cell')).toHaveLength(2);
    });

    it('handles single row', () => {
      const singleRow: TableRow[] = [{ id: '1', cells: ['Alice', '30', 'Tokyo'] }];
      render(<Table columns={basicColumns} rows={singleRow} aria-label="User" />);
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // 1 header + 1 data
    });
  });

  // 🟢 Low Priority: HTML Attribute Inheritance
  describe('HTML Attribute Inheritance', () => {
    it('applies className to container', () => {
      render(
        <Table
          columns={basicColumns}
          rows={basicRows}
          aria-label="Users"
          className="custom-table"
        />
      );
      const table = screen.getByRole('table');
      expect(table).toHaveClass('custom-table');
    });

    it('sets id attribute', () => {
      render(<Table columns={basicColumns} rows={basicRows} aria-label="Users" id="my-table" />);
      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('id', 'my-table');
    });

    it('passes through data-* attributes', () => {
      render(
        <Table
          columns={basicColumns}
          rows={basicRows}
          aria-label="Users"
          data-testid="user-table"
        />
      );
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });
  });
});
