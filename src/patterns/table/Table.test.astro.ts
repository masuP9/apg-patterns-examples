/**
 * Table Astro Component Tests using Container API
 *
 * These tests verify the actual Table.astro component output using Astro's Container API.
 * This ensures the component renders correct ARIA structure and attributes.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import Table from './Table.astro';
import type { TableColumn, TableRow, TableCell } from './Table.astro';

describe('Table (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  // Helper to render and parse HTML
  async function renderTable(props: {
    columns: TableColumn[];
    rows: TableRow[];
    caption?: string;
    totalColumns?: number;
    totalRows?: number;
    startColIndex?: number;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    class?: string;
    id?: string;
  }): Promise<Document> {
    const html = await container.renderToString(Table, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

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

  // 🔴 High Priority: APG ARIA Structure
  describe('APG: ARIA Structure', () => {
    it('has role="table" on container', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const table = doc.querySelector('[role="table"]');
      expect(table).not.toBeNull();
    });

    it('has role="rowgroup" on header and body groups', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const rowgroups = doc.querySelectorAll('[role="rowgroup"]');
      expect(rowgroups).toHaveLength(2);
    });

    it('has role="row" on all rows', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const rows = doc.querySelectorAll('[role="row"]');
      expect(rows).toHaveLength(4); // 1 header + 3 data
    });

    it('has role="columnheader" on header cells', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const headers = doc.querySelectorAll('[role="columnheader"]');
      expect(headers).toHaveLength(3);
      expect(headers[0]?.textContent).toContain('Name');
    });

    it('has role="cell" on data cells', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const cells = doc.querySelectorAll('[role="cell"]');
      expect(cells).toHaveLength(9);
    });

    it('has role="rowheader" on row headers when hasRowHeader is true', async () => {
      const rowsWithRowHeader: TableRow[] = [
        { id: '1', cells: ['Alice', '30', 'Tokyo'], hasRowHeader: true },
        { id: '2', cells: ['Bob', '25', 'Osaka'], hasRowHeader: true },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithRowHeader,
        'aria-label': 'Test Table',
      });
      const rowheaders = doc.querySelectorAll('[role="rowheader"]');
      expect(rowheaders).toHaveLength(2);
      expect(rowheaders[0]?.textContent?.trim()).toBe('Alice');
    });
  });

  // 🔴 High Priority: Accessible Name
  describe('APG: Accessible Name', () => {
    it('has accessible name via aria-label', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'User List',
      });
      const table = doc.querySelector('[role="table"]');
      expect(table?.getAttribute('aria-label')).toBe('User List');
    });

    it('has accessible name via aria-labelledby', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-labelledby': 'table-title',
      });
      const table = doc.querySelector('[role="table"]');
      expect(table?.getAttribute('aria-labelledby')).toBe('table-title');
    });

    it('has description via aria-describedby', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
        'aria-describedby': 'desc',
      });
      const table = doc.querySelector('[role="table"]');
      expect(table?.getAttribute('aria-describedby')).toBe('desc');
    });

    it('displays caption when provided', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
        caption: 'User Data',
      });
      const caption = doc.querySelector('.apg-table-caption');
      expect(caption?.textContent).toBe('User Data');
    });
  });

  // 🔴 High Priority: Sort State
  describe('APG: Sort State', () => {
    it('has aria-sort="ascending" on ascending sorted column', async () => {
      const doc = await renderTable({
        columns: sortableColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const nameHeader = doc.querySelector('[role="columnheader"]');
      expect(nameHeader?.getAttribute('aria-sort')).toBe('ascending');
    });

    it('has aria-sort="descending" on descending sorted column', async () => {
      const columns: TableColumn[] = [
        { id: 'name', header: 'Name', sortable: true, sort: 'descending' },
        { id: 'age', header: 'Age', sortable: true },
      ];
      const doc = await renderTable({
        columns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const nameHeader = doc.querySelector('[role="columnheader"]');
      expect(nameHeader?.getAttribute('aria-sort')).toBe('descending');
    });

    it('has aria-sort="none" on unsorted sortable columns', async () => {
      const doc = await renderTable({
        columns: sortableColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const headers = doc.querySelectorAll('[role="columnheader"]');
      // Second column (Age) is sortable but not sorted
      expect(headers[1]?.getAttribute('aria-sort')).toBe('none');
    });

    it('does not have aria-sort on non-sortable columns', async () => {
      const doc = await renderTable({
        columns: sortableColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const headers = doc.querySelectorAll('[role="columnheader"]');
      // Third column (City) is not sortable
      expect(headers[2]?.hasAttribute('aria-sort')).toBe(false);
    });

    it('sortable header has button with accessible name', async () => {
      const doc = await renderTable({
        columns: sortableColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const sortButton = doc.querySelector('[data-sort-column="name"]');
      expect(sortButton).not.toBeNull();
      expect(sortButton?.getAttribute('aria-label')).toContain('Name');
    });
  });

  // 🟡 Medium Priority: Virtualization Support
  describe('APG: Virtualization Support', () => {
    it('has aria-colcount when totalColumns is provided', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
        totalColumns: 10,
      });
      const table = doc.querySelector('[role="table"]');
      expect(table?.getAttribute('aria-colcount')).toBe('10');
    });

    it('has aria-rowcount when totalRows is provided', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
        totalRows: 100,
      });
      const table = doc.querySelector('[role="table"]');
      expect(table?.getAttribute('aria-rowcount')).toBe('100');
    });

    it('has aria-rowindex on rows when rowIndex is provided', async () => {
      const rowsWithIndex: TableRow[] = [
        { id: '1', cells: ['Alice', '30', 'Tokyo'], rowIndex: 5 },
        { id: '2', cells: ['Bob', '25', 'Osaka'], rowIndex: 6 },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithIndex,
        'aria-label': 'Test Table',
        totalRows: 100,
      });
      const rows = doc.querySelectorAll('[role="row"]');
      // Skip header row (index 0)
      expect(rows[1]?.getAttribute('aria-rowindex')).toBe('5');
      expect(rows[2]?.getAttribute('aria-rowindex')).toBe('6');
    });

    it('has aria-colindex on cells when startColIndex is provided', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
        totalColumns: 10,
        startColIndex: 3,
      });
      const firstDataRow = doc.querySelectorAll('[role="row"]')[1];
      const cells = firstDataRow?.querySelectorAll('[role="cell"]');
      expect(cells?.[0]?.getAttribute('aria-colindex')).toBe('3');
      expect(cells?.[1]?.getAttribute('aria-colindex')).toBe('4');
      expect(cells?.[2]?.getAttribute('aria-colindex')).toBe('5');
    });

    it('does not have virtualization attributes when not provided', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const table = doc.querySelector('[role="table"]');
      expect(table?.hasAttribute('aria-colcount')).toBe(false);
      expect(table?.hasAttribute('aria-rowcount')).toBe(false);

      const rows = doc.querySelectorAll('[role="row"]');
      expect(rows[1]?.hasAttribute('aria-rowindex')).toBe(false);

      const cells = doc.querySelectorAll('[role="cell"]');
      expect(cells[0]?.hasAttribute('aria-colindex')).toBe(false);
    });
  });

  // 🟡 Medium Priority: Cell Spanning
  describe('APG: Cell Spanning', () => {
    it('has aria-colspan when cell spans multiple columns', async () => {
      const rowsWithColspan: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Merged', colspan: 2 } as TableCell, 'Single'],
        },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithColspan,
        'aria-label': 'Test Table',
      });
      const cells = doc.querySelectorAll('[role="cell"]');
      expect(cells[0]?.getAttribute('aria-colspan')).toBe('2');
      expect(cells[1]?.hasAttribute('aria-colspan')).toBe(false);
    });

    it('has aria-rowspan when cell spans multiple rows', async () => {
      const rowsWithRowspan: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Spans 2 rows', rowspan: 2 } as TableCell, 'A', 'B'],
        },
        { id: '2', cells: ['C', 'D'] },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithRowspan,
        'aria-label': 'Test Table',
      });
      const firstDataRow = doc.querySelectorAll('[role="row"]')[1];
      const firstCell = firstDataRow?.querySelector('[role="cell"]');
      expect(firstCell?.getAttribute('aria-rowspan')).toBe('2');
    });

    it('has grid-column span style for colspan cells', async () => {
      const rowsWithColspan: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Merged', colspan: 2 } as TableCell, 'Single'],
        },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithColspan,
        'aria-label': 'Test Table',
      });
      const cells = doc.querySelectorAll('[role="cell"]');
      const style = cells[0]?.getAttribute('style') || '';
      expect(style).toContain('grid-column');
      expect(style).toContain('span 2');
    });

    it('has grid-row span style for rowspan cells', async () => {
      const rowsWithRowspan: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Spans 2 rows', rowspan: 2 } as TableCell, 'A', 'B'],
        },
        { id: '2', cells: ['C', 'D'] },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithRowspan,
        'aria-label': 'Test Table',
      });
      const firstDataRow = doc.querySelectorAll('[role="row"]')[1];
      const firstCell = firstDataRow?.querySelector('[role="cell"]');
      const style = firstCell?.getAttribute('style') || '';
      expect(style).toContain('grid-row');
      expect(style).toContain('span 2');
    });

    it('does not have aria-colspan when colspan is 1', async () => {
      const rowsWithColspanOne: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Single', colspan: 1 } as TableCell, 'B', 'C'],
        },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithColspanOne,
        'aria-label': 'Test Table',
      });
      const cells = doc.querySelectorAll('[role="cell"]');
      expect(cells[0]?.hasAttribute('aria-colspan')).toBe(false);
    });

    it('does not have aria-rowspan when rowspan is 1', async () => {
      const rowsWithRowspanOne: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Single', rowspan: 1 } as TableCell, 'B', 'C'],
        },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithRowspanOne,
        'aria-label': 'Test Table',
      });
      const cells = doc.querySelectorAll('[role="cell"]');
      expect(cells[0]?.hasAttribute('aria-rowspan')).toBe(false);
    });

    it('renders cell content correctly with TableCell object', async () => {
      const rowsWithTableCell: TableRow[] = [
        {
          id: '1',
          cells: [{ content: 'Cell Content', colspan: 2 } as TableCell, 'Normal'],
        },
      ];
      const doc = await renderTable({
        columns: basicColumns,
        rows: rowsWithTableCell,
        'aria-label': 'Test Table',
      });
      const cells = doc.querySelectorAll('[role="cell"]');
      expect(cells[0]?.textContent?.trim()).toBe('Cell Content');
      expect(cells[1]?.textContent?.trim()).toBe('Normal');
    });
  });

  // 🟡 Medium Priority: CSS Grid Layout
  describe('CSS Grid Layout', () => {
    it('has --table-cols CSS variable set to column count', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const tableContainer = doc.querySelector('.apg-table');
      const style = tableContainer?.getAttribute('style') || '';
      expect(style).toContain('--table-cols');
      expect(style).toContain('3');
    });

    it('table container has apg-table class', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const tableContainer = doc.querySelector('.apg-table');
      expect(tableContainer).not.toBeNull();
    });
  });

  // 🟡 Medium Priority: Edge Cases
  describe('Edge Cases', () => {
    it('renders empty table with no rows', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: [],
        'aria-label': 'Empty Table',
      });
      const table = doc.querySelector('[role="table"]');
      expect(table).not.toBeNull();
      const cells = doc.querySelectorAll('[role="cell"]');
      expect(cells).toHaveLength(0);
    });

    it('handles single column', async () => {
      const singleColumn: TableColumn[] = [{ id: 'name', header: 'Name' }];
      const singleColumnRows: TableRow[] = [
        { id: '1', cells: ['Alice'] },
        { id: '2', cells: ['Bob'] },
      ];
      const doc = await renderTable({
        columns: singleColumn,
        rows: singleColumnRows,
        'aria-label': 'Single Column Table',
      });
      expect(doc.querySelectorAll('[role="columnheader"]')).toHaveLength(1);
      expect(doc.querySelectorAll('[role="cell"]')).toHaveLength(2);
    });

    it('handles single row', async () => {
      const singleRow: TableRow[] = [{ id: '1', cells: ['Alice', '30', 'Tokyo'] }];
      const doc = await renderTable({
        columns: basicColumns,
        rows: singleRow,
        'aria-label': 'Single Row Table',
      });
      const rows = doc.querySelectorAll('[role="row"]');
      expect(rows).toHaveLength(2); // 1 header + 1 data
    });

    it('applies custom class', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
        class: 'custom-table',
      });
      const tableContainer = doc.querySelector('.apg-table');
      expect(tableContainer?.classList.contains('custom-table')).toBe(true);
    });

    it('applies custom id', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
        id: 'my-table',
      });
      const tableContainer = doc.querySelector('#my-table');
      expect(tableContainer).not.toBeNull();
    });
  });

  // 🟢 Low Priority: HTML Attributes
  describe('HTML Attributes', () => {
    it('Web Component wrapper uses apg-table element', async () => {
      const doc = await renderTable({
        columns: basicColumns,
        rows: basicRows,
        'aria-label': 'Test Table',
      });
      const webComponent = doc.querySelector('apg-table');
      expect(webComponent).not.toBeNull();
    });
  });
});
