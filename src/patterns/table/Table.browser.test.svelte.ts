/**
 * Visual Cell Spanning Tests for Table Component (Svelte)
 *
 * These tests verify that colspan and rowspan are visually rendered correctly
 * using getBoundingClientRect() to measure actual element dimensions.
 *
 * NOTE: These tests require a real browser environment (Vitest browser mode)
 * because jsdom returns zero dimensions for getBoundingClientRect().
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount, unmount, type Component } from 'svelte';
import Table, { type TableColumn, type TableRow } from './Table.svelte';

// Helper to create base columns
const createColumns = (count: number): TableColumn[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `col-${i + 1}`,
    header: `Column ${i + 1}`,
  }));

describe('Table Visual Cell Spanning (Svelte)', () => {
  let container: HTMLDivElement;
  let component: ReturnType<typeof mount> | null = null;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);

    // Inject CSS styles (matches table.css gap-based approach)
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
    if (component) {
      unmount(component);
      component = null;
    }
    container.remove();
    const style = document.getElementById('test-table-styles');
    if (style) {
      style.remove();
    }
  });

  function renderTable(columns: TableColumn[], rows: TableRow[]): HTMLElement {
    component = mount(Table as Component, {
      target: container,
      props: { columns, rows },
    });
    return container;
  }

  describe('colspan visual rendering', () => {
    it('colspan=2 cell has approximately 2x width of normal cell', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: 'Merged (colspan=2)', colspan: 2 }, 'Single'] },
        { id: '2', cells: ['A', 'B', 'C'] },
      ];

      const el = renderTable(columns, rows);
      const cells = el.querySelectorAll('[role="cell"]');
      const mergedCell = cells[0];
      const normalCell = cells[3];

      const mergedWidth = mergedCell.getBoundingClientRect().width;
      const normalWidth = normalCell.getBoundingClientRect().width;

      expect(mergedWidth).toBeGreaterThan(normalWidth * 1.8);
      expect(mergedWidth).toBeLessThan(normalWidth * 2.2);
    });

    it('colspan=3 cell spans all columns in a 3-column table', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: 'Spans all 3 columns', colspan: 3 }] },
        { id: '2', cells: ['A', 'B', 'C'] },
      ];

      const el = renderTable(columns, rows);
      const cells = el.querySelectorAll('[role="cell"]');
      const fullSpanCell = cells[0];
      const tableBody = el.querySelector('.apg-table-body');

      const cellWidth = fullSpanCell.getBoundingClientRect().width;
      const bodyWidth = tableBody?.getBoundingClientRect().width ?? 0;

      expect(cellWidth).toBeGreaterThan(bodyWidth * 0.9);
    });
  });

  describe('rowspan visual rendering', () => {
    it('rowspan=2 cell has approximately 2x height of normal cell', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: 'Spans 2 rows', rowspan: 2 }, 'A', 'B'] },
        { id: '2', cells: ['C', 'D'] },
      ];

      const el = renderTable(columns, rows);
      const cells = el.querySelectorAll('[role="cell"]');
      const spanningCell = cells[0];
      const normalCell = cells[1];

      const spanningHeight = spanningCell.getBoundingClientRect().height;
      const normalHeight = normalCell.getBoundingClientRect().height;

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

      const el = renderTable(columns, rows);
      const cells = el.querySelectorAll('[role="cell"]');
      const spanningCell = cells[0];
      const normalCells = [cells[1], cells[2], cells[3]];

      const spanningHeight = spanningCell.getBoundingClientRect().height;
      const totalNormalHeight = normalCells.reduce(
        (sum, cell) => sum + cell.getBoundingClientRect().height,
        0
      );

      expect(spanningHeight).toBeGreaterThan(totalNormalHeight * 0.9);
      expect(spanningHeight).toBeLessThan(totalNormalHeight * 1.1);
    });
  });

  describe('combined colspan and rowspan', () => {
    it('cell with colspan=2 and rowspan=2 has correct dimensions', () => {
      const columns = createColumns(3);
      const rows: TableRow[] = [
        { id: '1', cells: [{ content: '2x2 merged', colspan: 2, rowspan: 2 }, 'A'] },
        { id: '2', cells: ['B'] },
        { id: '3', cells: ['C', 'D', 'E'] },
      ];

      const el = renderTable(columns, rows);
      const cells = el.querySelectorAll('[role="cell"]');
      const mergedCell = cells[0];
      const normalCell = cells[4];

      const mergedRect = mergedCell.getBoundingClientRect();
      const normalRect = normalCell.getBoundingClientRect();

      expect(mergedRect.width).toBeGreaterThan(normalRect.width * 1.8);
      expect(mergedRect.width).toBeLessThan(normalRect.width * 2.2);
      expect(mergedRect.height).toBeGreaterThan(normalRect.height * 1.8);
      expect(mergedRect.height).toBeLessThan(normalRect.height * 2.2);
    });
  });
});
