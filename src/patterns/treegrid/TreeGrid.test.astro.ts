/**
 * TreeGrid Astro Component Tests using Container API
 *
 * Verifies the TreeGrid.astro initial HTML structure and ARIA attributes.
 * Interaction cases (keyboard navigation, selection, expansion toggles, focus
 * movement, mouse) are covered by the Vue unit tests and E2E; the Container API
 * only renders initial HTML.
 *
 * Astro renders ALL data rows up-front and hides collapsed subtrees with
 * `style="display: none"` (rather than omitting them from the DOM). Structural
 * counts therefore reflect the full row/cell set.
 *
 * Ported structural/initial-state subset of TreeGrid.test.tsx. Interaction-only
 * React cases are omitted here — they require a browser and are covered elsewhere.
 *
 * @see https://docs.astro.build/en/reference/container-reference/
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { describe, it, expect, beforeEach } from 'vitest';
import { JSDOM } from 'jsdom';
import TreeGrid from './TreeGrid.astro';

const createBasicColumns = () => [
  { id: 'name', header: 'Name', isRowHeader: true },
  { id: 'size', header: 'Size' },
  { id: 'date', header: 'Date Modified' },
];

const createBasicNodes = () => [
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
      {
        id: 'notes',
        cells: [
          { id: 'notes-name', value: 'notes.txt' },
          { id: 'notes-size', value: '1 KB' },
          { id: 'notes-date', value: '2024-01-05' },
        ],
      },
    ],
  },
  {
    id: 'images',
    cells: [
      { id: 'images-name', value: 'Images' },
      { id: 'images-size', value: '--' },
      { id: 'images-date', value: '2024-01-20' },
    ],
    children: [
      {
        id: 'photo1',
        cells: [
          { id: 'photo1-name', value: 'photo1.jpg' },
          { id: 'photo1-size', value: '3 MB' },
          { id: 'photo1-date', value: '2024-01-18' },
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

const createNestedNodes = () => [
  {
    id: 'root',
    cells: [
      { id: 'root-name', value: 'Root' },
      { id: 'root-size', value: '--' },
    ],
    children: [
      {
        id: 'level2',
        cells: [
          { id: 'level2-name', value: 'Level 2' },
          { id: 'level2-size', value: '--' },
        ],
        children: [
          {
            id: 'level3',
            cells: [
              { id: 'level3-name', value: 'Level 3' },
              { id: 'level3-size', value: '1 KB' },
            ],
          },
        ],
      },
    ],
  },
];

const createNodesWithDisabled = () => [
  {
    id: 'docs',
    cells: [
      { id: 'docs-name', value: 'Documents' },
      { id: 'docs-size', value: '--' },
    ],
    disabled: true,
    children: [
      {
        id: 'report',
        cells: [
          { id: 'report-name', value: 'report.pdf' },
          { id: 'report-size', value: '2.5 MB' },
        ],
      },
    ],
  },
  {
    id: 'readme',
    cells: [
      { id: 'readme-name', value: 'README.md' },
      { id: 'readme-size', value: '4 KB' },
    ],
  },
];

describe('TreeGrid (Astro Container API)', () => {
  let container: AstroContainer;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  async function renderGrid(props: Record<string, unknown>): Promise<Document> {
    const html = await container.renderToString(TreeGrid, { props });
    const dom = new JSDOM(html);
    return dom.window.document;
  }

  function rowByHeaderText(doc: Document, text: string): Element | undefined {
    return Array.from(doc.querySelectorAll('[role="row"]')).find((r) =>
      r.querySelector('[role="rowheader"]')?.textContent?.includes(text)
    );
  }

  describe('ARIA Attributes', () => {
    it('has role="treegrid" on container', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
      });
      expect(doc.querySelector('[role="treegrid"]')).not.toBeNull();
    });

    it('has role="row" on all rows', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      // Header row + 6 data rows (Astro renders all rows up-front) = 7
      expect(doc.querySelectorAll('[role="row"]')).toHaveLength(7);
    });

    it('has role="gridcell" on data cells', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      expect(doc.querySelectorAll('[role="gridcell"]')).toHaveLength(12);
    });

    it('has role="columnheader" on header cells', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
      });
      expect(doc.querySelectorAll('[role="columnheader"]')).toHaveLength(3);
    });

    it('has role="rowheader" on first column cells', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      expect(doc.querySelectorAll('[role="rowheader"]')).toHaveLength(6);
    });

    it('has accessible name via aria-label', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
      });
      expect(doc.querySelector('[role="treegrid"]')?.getAttribute('aria-label')).toBe('Files');
    });

    it('has accessible name via aria-labelledby', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabelledby: 'grid-title',
      });
      expect(doc.querySelector('[role="treegrid"]')?.getAttribute('aria-labelledby')).toBe(
        'grid-title'
      );
    });

    it('parent rows have aria-expanded', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
      });
      expect(rowByHeaderText(doc, 'Documents')?.hasAttribute('aria-expanded')).toBe(true);
      expect(rowByHeaderText(doc, 'Images')?.hasAttribute('aria-expanded')).toBe(true);
    });

    it('leaf rows do NOT have aria-expanded', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
      });
      expect(rowByHeaderText(doc, 'README.md')?.hasAttribute('aria-expanded')).toBe(false);
    });

    it('has aria-level on all data rows', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        defaultExpandedIds: ['docs', 'images'],
      });
      const dataRows = Array.from(doc.querySelectorAll('[role="row"]')).filter((r) =>
        r.hasAttribute('aria-level')
      );
      expect(dataRows.length).toBeGreaterThan(0);
      dataRows.forEach((row) => {
        expect(row.hasAttribute('aria-level')).toBe(true);
      });
    });

    it('aria-level increments with depth (1-based)', async () => {
      const columns = [
        { id: 'name', header: 'Name', isRowHeader: true },
        { id: 'size', header: 'Size' },
      ];
      const doc = await renderGrid({
        columns,
        nodes: createNestedNodes(),
        ariaLabel: 'Files',
        defaultExpandedIds: ['root', 'level2'],
      });
      expect(rowByHeaderText(doc, 'Root')?.getAttribute('aria-level')).toBe('1');
      expect(rowByHeaderText(doc, 'Level 2')?.getAttribute('aria-level')).toBe('2');
      expect(rowByHeaderText(doc, 'Level 3')?.getAttribute('aria-level')).toBe('3');
    });

    it('has aria-selected on row (not gridcell) when selectable', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        selectable: true,
      });
      const dataRows = Array.from(doc.querySelectorAll('[role="row"]')).filter((r) =>
        r.hasAttribute('aria-level')
      );
      dataRows.forEach((row) => {
        expect(row.getAttribute('aria-selected')).toBe('false');
      });
      doc.querySelectorAll('[role="gridcell"]').forEach((cell) => {
        expect(cell.hasAttribute('aria-selected')).toBe(false);
      });
    });

    it('has aria-multiselectable when multiselectable', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        selectable: true,
        multiselectable: true,
      });
      expect(doc.querySelector('[role="treegrid"]')?.getAttribute('aria-multiselectable')).toBe(
        'true'
      );
    });

    it('has aria-disabled on disabled rows', async () => {
      const columns = [
        { id: 'name', header: 'Name', isRowHeader: true },
        { id: 'size', header: 'Size' },
      ];
      const doc = await renderGrid({
        columns,
        nodes: createNodesWithDisabled(),
        ariaLabel: 'Files',
      });
      expect(rowByHeaderText(doc, 'Documents')?.getAttribute('aria-disabled')).toBe('true');
    });
  });

  describe('Focus Management', () => {
    it('only one cell has tabIndex="0"', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        defaultExpandedIds: ['docs'],
      });
      const cells = Array.from(doc.querySelectorAll('[role="rowheader"], [role="gridcell"]'));
      const tab0 = cells.filter((c) => c.getAttribute('tabindex') === '0');
      expect(tab0).toHaveLength(1);
    });

    it('other cells have tabIndex="-1"', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
      });
      const cells = Array.from(doc.querySelectorAll('[role="gridcell"]'));
      const minus1 = cells.filter((c) => c.getAttribute('tabindex') === '-1');
      expect(minus1.length).toBe(cells.length);
    });

    it('columnheader cells are not focusable', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
      });
      doc.querySelectorAll('[role="columnheader"]').forEach((header) => {
        expect(header.hasAttribute('tabindex')).toBe(false);
      });
    });

    it('disabled cells are focusable', async () => {
      const columns = [
        { id: 'name', header: 'Name', isRowHeader: true },
        { id: 'size', header: 'Size' },
      ];
      const doc = await renderGrid({
        columns,
        nodes: createNodesWithDisabled(),
        ariaLabel: 'Files',
      });
      const docsRowheader = Array.from(doc.querySelectorAll('[role="rowheader"]')).find((r) =>
        r.textContent?.includes('Documents')
      );
      expect(docsRowheader?.hasAttribute('tabindex')).toBe(true);
    });
  });

  describe('Virtualization Support', () => {
    it('has aria-rowcount when totalRows provided', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        totalRows: 100,
      });
      expect(doc.querySelector('[role="treegrid"]')?.getAttribute('aria-rowcount')).toBe('100');
    });

    it('has aria-colcount when totalColumns provided', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        totalColumns: 10,
      });
      expect(doc.querySelector('[role="treegrid"]')?.getAttribute('aria-colcount')).toBe('10');
    });

    it('has aria-rowindex on rows when virtualizing', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        totalRows: 100,
        startRowIndex: 10,
      });
      const rows = Array.from(doc.querySelectorAll('[role="row"]')).filter((r) =>
        r.hasAttribute('aria-level')
      );
      expect(rows[0].getAttribute('aria-rowindex')).toBe('10');
      expect(rows[1].getAttribute('aria-rowindex')).toBe('11');
      expect(rows[2].getAttribute('aria-rowindex')).toBe('12');
    });

    it('has aria-colindex on cells when virtualizing', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        totalColumns: 10,
        startColIndex: 5,
      });
      const firstRowCells = [
        doc.querySelectorAll('[role="rowheader"]')[0],
        ...Array.from(doc.querySelectorAll('[role="gridcell"]')).slice(0, 2),
      ];
      expect(firstRowCells[0].getAttribute('aria-colindex')).toBe('5');
      expect(firstRowCells[1].getAttribute('aria-colindex')).toBe('6');
      expect(firstRowCells[2].getAttribute('aria-colindex')).toBe('7');
    });
  });

  describe('Props', () => {
    it('applies className to container', async () => {
      const doc = await renderGrid({
        columns: createBasicColumns(),
        nodes: createBasicNodes(),
        ariaLabel: 'Files',
        class: 'custom-grid',
      });
      expect(doc.querySelector('.apg-treegrid')?.classList.contains('custom-grid')).toBe(true);
    });
  });
});
