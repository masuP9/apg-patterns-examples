/**
 * Visual Cell Spanning Tests for Table Component
 *
 * These tests verify that colspan and rowspan are visually rendered correctly
 * using getBoundingClientRect() to measure actual element dimensions.
 *
 * NOTE: These tests require a real browser environment (Vitest browser mode)
 * because jsdom returns zero dimensions for getBoundingClientRect().
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { Table, type TableColumn, type TableRow } from './Table';
import '@/styles/patterns/table.css';

// Helper to create base columns
const createColumns = (count: number): TableColumn[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `col-${i + 1}`,
    header: `Column ${i + 1}`,
  }));

describe('Table Visual Cell Spanning', () => {
  beforeEach(() => {
    // Inject CSS styles into the document (matches table.css gap-based approach)
    const style = document.createElement('style');
    style.textContent = `
      .apg-table {
        display: grid;
        grid-template-columns: repeat(var(--table-cols, 1), 1fr);
        width: 600px;
        gap: 1px;
        background: #ccc;
      }
      .apg-table-header,
      .apg-table-body {
        display: grid;
        grid-column: 1 / -1;
        grid-template-columns: subgrid;
        gap: 1px;
        background: #ccc;
      }
      .apg-table-row {
        display: contents;
      }
      .apg-table-columnheader,
      .apg-table-rowheader,
      .apg-table-cell {
        padding: 8px;
        min-height: 40px;
        box-sizing: border-box;
        background: #fff;
      }
    `;
    style.id = 'test-table-styles';
    document.head.appendChild(style);
  });

  afterEach(() => {
    cleanup();
    const style = document.getElementById('test-table-styles');
    if (style) {
      style.remove();
    }
  });

  describe('colspan visual rendering', () => {
    it('colspan=2 cell has approximately 2x width of normal cell', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: 'Merged (colspan=2)', colspan: 2 }, 'Single'] },
        { id: '2', cells: ['A', 'B', 'C'] },
      ];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const cells = container.querySelectorAll('[role="cell"]');
      const mergedCell = cells[0]; // colspan=2
      const normalCell = cells[3]; // Row 2, first cell (normal)

      const mergedWidth = mergedCell.getBoundingClientRect().width;
      const normalWidth = normalCell.getBoundingClientRect().width;

      // colspan=2 should be approximately 2x the width of a normal cell
      // Allow 20% tolerance for borders/padding
      expect(mergedWidth).toBeGreaterThan(normalWidth * 1.8);
      expect(mergedWidth).toBeLessThan(normalWidth * 2.2);
    });

    it('colspan=3 cell spans all columns in a 3-column table', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: 'Spans all 3 columns', colspan: 3 }] },
        { id: '2', cells: ['A', 'B', 'C'] },
      ];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const cells = container.querySelectorAll('[role="cell"]');
      const fullSpanCell = cells[0];
      const tableBody = container.querySelector('.apg-table-body');

      const cellWidth = fullSpanCell.getBoundingClientRect().width;
      const bodyWidth = tableBody?.getBoundingClientRect().width ?? 0;

      // Full span cell should be nearly as wide as the table body
      expect(cellWidth).toBeGreaterThan(bodyWidth * 0.9);
    });
  });

  describe('rowspan visual rendering', () => {
    it('rowspan=2 cell has approximately 2x height of normal cell', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: 'Spans 2 rows', rowspan: 2 }, 'A', 'B'] },
        { id: '2', cells: ['C', 'D'] }, // First cell skipped due to rowspan
      ];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const cells = container.querySelectorAll('[role="cell"]');
      const spanningCell = cells[0]; // rowspan=2
      const normalCell = cells[1]; // Normal cell in same row

      const spanningHeight = spanningCell.getBoundingClientRect().height;
      const normalHeight = normalCell.getBoundingClientRect().height;

      // rowspan=2 should be approximately 2x the height of a normal cell
      // Allow 20% tolerance
      expect(spanningHeight).toBeGreaterThan(normalHeight * 1.8);
      expect(spanningHeight).toBeLessThan(normalHeight * 2.2);
    });

    it('rowspan=3 cell spans 3 rows', () => {
      const columns = createColumns(2);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: 'Spans 3 rows', rowspan: 3 }, 'Row 1'] },
        { id: '2', cells: ['Row 2'] },
        { id: '3', cells: ['Row 3'] },
      ];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const cells = container.querySelectorAll('[role="cell"]');
      const spanningCell = cells[0]; // rowspan=3
      const normalCells = [cells[1], cells[2], cells[3]]; // Normal cells

      const spanningHeight = spanningCell.getBoundingClientRect().height;

      // Sum up the heights of normal cells
      const totalNormalHeight = normalCells.reduce(
        (sum, cell) => sum + cell.getBoundingClientRect().height,
        0
      );

      // Spanning cell height should be close to total height of 3 rows
      expect(spanningHeight).toBeGreaterThan(totalNormalHeight * 0.9);
      expect(spanningHeight).toBeLessThan(totalNormalHeight * 1.1);
    });
  });

  describe('combined colspan and rowspan', () => {
    it('cell with colspan=2 and rowspan=2 has correct dimensions', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: '2x2 merged', colspan: 2, rowspan: 2 }, 'A'] },
        { id: '2', cells: ['B'] }, // First two cells skipped
        { id: '3', cells: ['C', 'D', 'E'] }, // Normal row
      ];

      const { container } = render(<Table columns={columns} rows={rows} />);

      const cells = container.querySelectorAll('[role="cell"]');
      const mergedCell = cells[0]; // colspan=2, rowspan=2
      const normalCell = cells[4]; // Row 3, first cell

      const mergedRect = mergedCell.getBoundingClientRect();
      const normalRect = normalCell.getBoundingClientRect();

      // Width should be ~2x normal
      expect(mergedRect.width).toBeGreaterThan(normalRect.width * 1.8);
      expect(mergedRect.width).toBeLessThan(normalRect.width * 2.2);

      // Height should be ~2x normal
      expect(mergedRect.height).toBeGreaterThan(normalRect.height * 1.8);
      expect(mergedRect.height).toBeLessThan(normalRect.height * 2.2);
    });
  });
});
