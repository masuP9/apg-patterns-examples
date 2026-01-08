import { useState } from 'react';
import { Table } from './Table';
import type { TableColumn, TableRow, TableCell } from './Table';

const initialRows: TableRow[] = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'] },
  { id: '2', cells: ['Bob', '25', 'Osaka'] },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
  { id: '4', cells: ['Diana', '28', 'Nagoya'] },
  { id: '5', cells: ['Edward', '42', 'Sapporo'] },
];

export function BasicTableDemo() {
  const columns: TableColumn[] = [
    { id: 'name', header: 'Name' },
    { id: 'age', header: 'Age' },
    { id: 'city', header: 'City' },
  ];

  return <Table columns={columns} rows={initialRows} aria-label="User List" />;
}

export function SortableTableDemo() {
  const [columns, setColumns] = useState<TableColumn[]>([
    { id: 'name', header: 'Name', sortable: true, sort: 'ascending' },
    { id: 'age', header: 'Age', sortable: true },
    { id: 'city', header: 'City', sortable: true },
  ]);
  const [rows, setRows] = useState<TableRow[]>(initialRows);

  const handleSortChange = (columnId: string, direction: 'ascending' | 'descending') => {
    setColumns((prev) =>
      prev.map((col) => ({
        ...col,
        sort: col.id === columnId ? direction : 'none',
      }))
    );

    const columnIndex = columns.findIndex(({ id }) => id === columnId);
    const sortedRows = [...rows].sort((a, b) => {
      const aCell = a.cells[columnIndex];
      const bCell = b.cells[columnIndex];
      // Extract string value from cell (cells in this demo are always strings)
      const aVal = typeof aCell === 'string' ? aCell : '';
      const bVal = typeof bCell === 'string' ? bCell : '';

      // Try numeric comparison for Age column
      if (columnId === 'age') {
        const aNum = parseInt(aVal, 10);
        const bNum = parseInt(bVal, 10);
        return direction === 'ascending' ? aNum - bNum : bNum - aNum;
      }

      // String comparison for other columns
      return direction === 'ascending' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
    setRows(sortedRows);
  };

  return (
    <Table
      columns={columns}
      rows={rows}
      aria-label="Sortable User List"
      onSortChange={handleSortChange}
    />
  );
}

export function RowHeaderTableDemo() {
  const columns: TableColumn[] = [
    { id: 'name', header: 'Name' },
    { id: 'age', header: 'Age' },
    { id: 'city', header: 'City' },
  ];

  const rows: TableRow[] = [
    { id: '1', cells: ['Alice', '30', 'Tokyo'], hasRowHeader: true },
    { id: '2', cells: ['Bob', '25', 'Osaka'], hasRowHeader: true },
    { id: '3', cells: ['Charlie', '35', 'Kyoto'], hasRowHeader: true },
  ];

  return <Table columns={columns} rows={rows} aria-label="User List with Row Headers" />;
}

export function VirtualizedTableDemo() {
  const columns: TableColumn[] = [
    { id: 'name', header: 'Name' },
    { id: 'age', header: 'Age' },
    { id: 'city', header: 'City' },
  ];

  // Simulating a subset of a larger dataset (rows 5-9 of 100 total)
  const rows: TableRow[] = [
    { id: '5', cells: ['Alice', '30', 'Tokyo'], rowIndex: 5 },
    { id: '6', cells: ['Bob', '25', 'Osaka'], rowIndex: 6 },
    { id: '7', cells: ['Charlie', '35', 'Kyoto'], rowIndex: 7 },
    { id: '8', cells: ['Diana', '28', 'Nagoya'], rowIndex: 8 },
    { id: '9', cells: ['Edward', '42', 'Sapporo'], rowIndex: 9 },
  ];

  return (
    <Table
      columns={columns}
      rows={rows}
      aria-label="Virtualized Table (rows 5-9 of 100)"
      totalRows={100}
      totalColumns={3}
      startColIndex={1}
    />
  );
}

export function SpanningCellsTableDemo() {
  const columns: TableColumn[] = [
    { id: 'product', header: 'Product' },
    { id: 'q1', header: 'Q1' },
    { id: 'q2', header: 'Q2' },
    { id: 'q3', header: 'Q3' },
    { id: 'q4', header: 'Q4' },
  ];

  // Demonstrates colspan (category spans 4 columns) and rowspan
  const rows: TableRow[] = [
    {
      id: 'electronics',
      cells: [
        { content: 'Electronics', rowspan: 2 } satisfies TableCell,
        '150',
        '180',
        '200',
        '220',
      ],
    },
    {
      id: 'electronics-sub',
      cells: ['175', '190', '210', '240'],
    },
    {
      id: 'clothing',
      cells: ['Clothing', { content: 'N/A', colspan: 2 } satisfies TableCell, '90', '120'],
    },
    {
      id: 'summary',
      cells: [{ content: 'Total', colspan: 4 } satisfies TableCell, '1775'],
    },
  ];

  return <Table columns={columns} rows={rows} aria-label="Quarterly Sales with Spanning Cells" />;
}
