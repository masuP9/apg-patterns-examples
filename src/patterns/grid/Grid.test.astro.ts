import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, expect, it } from 'vitest';
import Grid from './Grid.astro';

// Helper data
const basicColumns = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

const basicRows = [
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
];

const rowsWithDisabled = [
  {
    id: 'row1',
    cells: [
      { id: 'row1-0', value: 'Alice' },
      { id: 'row1-1', value: 'alice@example.com', disabled: true },
      { id: 'row1-2', value: 'Admin' },
    ],
  },
];

describe('Grid (Astro)', () => {
  describe('ARIA Attributes', () => {
    it('renders role="grid" on container', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      expect(result).toContain('role="grid"');
    });

    it('renders role="row" on rows', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      const rowMatches = result.match(/role="row"/g);
      // Header row + 2 data rows = 3 rows
      expect(rowMatches?.length).toBe(3);
    });

    it('renders role="gridcell" on data cells', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      const cellMatches = result.match(/role="gridcell"/g);
      // 2 rows * 3 columns = 6 cells
      expect(cellMatches?.length).toBe(6);
    });

    it('renders role="columnheader" on header cells', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      const headerMatches = result.match(/role="columnheader"/g);
      expect(headerMatches?.length).toBe(3);
    });

    it('renders aria-label on grid', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      expect(result).toContain('aria-label="Users"');
    });

    it('renders aria-labelledby when provided', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabelledby: 'grid-title' },
      });

      expect(result).toContain('aria-labelledby="grid-title"');
    });

    it('renders aria-multiselectable when multiselectable', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: {
          columns: basicColumns,
          rows: basicRows,
          ariaLabel: 'Users',
          selectable: true,
          multiselectable: true,
        },
      });

      expect(result).toContain('aria-multiselectable="true"');
    });

    it('renders aria-disabled on disabled cells', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: rowsWithDisabled, ariaLabel: 'Users' },
      });

      expect(result).toContain('aria-disabled="true"');
    });

    it('renders aria-selected on selectable cells', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users', selectable: true },
      });

      expect(result).toContain('aria-selected="false"');
    });
  });

  describe('Structure', () => {
    it('renders Web Component wrapper', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      expect(result).toContain('<apg-grid');
      expect(result).toContain('</apg-grid>');
    });

    it('renders cell values', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      expect(result).toContain('Alice');
      expect(result).toContain('alice@example.com');
      expect(result).toContain('Admin');
    });

    it('renders column headers', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      expect(result).toContain('Name');
      expect(result).toContain('Email');
      expect(result).toContain('Role');
    });
  });

  describe('Focus Management', () => {
    it('renders tabindex="0" on first focusable cell', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      // First gridcell should have tabindex="0"
      const gridcellPattern = /role="gridcell"[^>]*tabindex="0"/;
      expect(result).toMatch(gridcellPattern);
    });

    it('renders tabindex="-1" on other cells', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      // Other gridcells should have tabindex="-1"
      const negativeTabindexMatches = result.match(/tabindex="-1"/g);
      expect(negativeTabindexMatches?.length).toBeGreaterThan(0);
    });

    it('columnheader cells do not have tabindex', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users' },
      });

      // columnheader should not have tabindex
      const headerWithTabindex = /role="columnheader"[^>]*tabindex/;
      expect(result).not.toMatch(headerWithTabindex);
    });
  });

  describe('Virtualization', () => {
    it('renders aria-rowcount when totalRows provided', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users', totalRows: 100 },
      });

      expect(result).toContain('aria-rowcount="100"');
    });

    it('renders aria-colcount when totalColumns provided', async () => {
      const container = await AstroContainer.create();
      const result = await container.renderToString(Grid, {
        props: { columns: basicColumns, rows: basicRows, ariaLabel: 'Users', totalColumns: 10 },
      });

      expect(result).toContain('aria-colcount="10"');
    });
  });
});
