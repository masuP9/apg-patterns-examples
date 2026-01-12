import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { TreeGrid, type TreeGridColumnDef, type TreeGridNodeData } from './TreeGrid';

// =============================================================================
// Test Data Helpers
// =============================================================================

const createBasicColumns = (): TreeGridColumnDef[] => [
  { id: 'name', header: 'Name', isRowHeader: true },
  { id: 'size', header: 'Size' },
  { id: 'date', header: 'Date Modified' },
];

const createBasicNodes = (): TreeGridNodeData[] => [
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

const createNestedNodes = (): TreeGridNodeData[] => [
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

const createNodesWithDisabled = (): TreeGridNodeData[] => [
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

// =============================================================================
// Tests
// =============================================================================

describe('TreeGrid', () => {
  // ===========================================================================
  // ARIA Attributes
  // ===========================================================================
  describe('ARIA Attributes', () => {
    it('has role="treegrid" on container', () => {
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );
      expect(screen.getByRole('treegrid')).toBeInTheDocument();
    });

    it('has role="row" on all rows', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs', 'images']}
        />
      );
      // Header row + 3 root level + 2 docs children + 1 images child = 7 rows
      expect(screen.getAllByRole('row')).toHaveLength(7);
    });

    it('has role="gridcell" on data cells', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs', 'images']}
        />
      );
      // 6 data rows * 2 gridcells per row (excluding rowheader) = 12 gridcells
      expect(screen.getAllByRole('gridcell')).toHaveLength(12);
    });

    it('has role="columnheader" on header cells', () => {
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );
      expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    });

    it('has role="rowheader" on first column cells', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs', 'images']}
        />
      );
      // 6 data rows * 1 rowheader = 6 rowheaders
      expect(screen.getAllByRole('rowheader')).toHaveLength(6);
    });

    it('has accessible name via aria-label', () => {
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );
      expect(screen.getByRole('treegrid', { name: 'Files' })).toBeInTheDocument();
    });

    it('has accessible name via aria-labelledby', () => {
      render(
        <div>
          <h2 id="grid-title">File Browser</h2>
          <TreeGrid
            columns={createBasicColumns()}
            nodes={createBasicNodes()}
            ariaLabelledby="grid-title"
          />
        </div>
      );
      const treegrid = screen.getByRole('treegrid');
      expect(treegrid).toHaveAttribute('aria-labelledby', 'grid-title');
    });

    it('parent rows have aria-expanded', () => {
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      const rows = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-level'));
      // docs and images are parent rows (rowheader includes expand icon, so use includes)
      const docsRow = rows.find((r) =>
        r.querySelector('[role="rowheader"]')?.textContent?.includes('Documents')
      );
      const imagesRow = rows.find((r) =>
        r.querySelector('[role="rowheader"]')?.textContent?.includes('Images')
      );

      expect(docsRow).toHaveAttribute('aria-expanded');
      expect(imagesRow).toHaveAttribute('aria-expanded');
    });

    it('leaf rows do NOT have aria-expanded', () => {
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      const rows = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-level'));
      // readme is a leaf row
      const readmeRow = rows.find((r) =>
        r.querySelector('[role="rowheader"]')?.textContent?.includes('README.md')
      );

      expect(readmeRow).not.toHaveAttribute('aria-expanded');
    });

    it('has aria-level on all data rows', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs', 'images']}
        />
      );

      const dataRows = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-level'));
      expect(dataRows.length).toBeGreaterThan(0);
      dataRows.forEach((row) => {
        expect(row).toHaveAttribute('aria-level');
      });
    });

    it('aria-level increments with depth (1-based)', () => {
      const columns: TreeGridColumnDef[] = [
        { id: 'name', header: 'Name', isRowHeader: true },
        { id: 'size', header: 'Size' },
      ];

      render(
        <TreeGrid
          columns={columns}
          nodes={createNestedNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['root', 'level2']}
        />
      );

      const rows = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-level'));

      const rootRow = rows.find((r) =>
        r.querySelector('[role="rowheader"]')?.textContent?.includes('Root')
      );
      const level2Row = rows.find((r) =>
        r.querySelector('[role="rowheader"]')?.textContent?.includes('Level 2')
      );
      const level3Row = rows.find((r) =>
        r.querySelector('[role="rowheader"]')?.textContent?.includes('Level 3')
      );

      expect(rootRow).toHaveAttribute('aria-level', '1');
      expect(level2Row).toHaveAttribute('aria-level', '2');
      expect(level3Row).toHaveAttribute('aria-level', '3');
    });

    it('has aria-selected on row (not gridcell) when selectable', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          selectable
        />
      );

      // Check that rows have aria-selected
      const dataRows = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-level'));
      dataRows.forEach((row) => {
        expect(row).toHaveAttribute('aria-selected', 'false');
      });

      // Check that gridcells do NOT have aria-selected
      const gridcells = screen.getAllByRole('gridcell');
      gridcells.forEach((cell) => {
        expect(cell).not.toHaveAttribute('aria-selected');
      });
    });

    it('has aria-multiselectable when multiselectable', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          selectable
          multiselectable
        />
      );

      expect(screen.getByRole('treegrid')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('has aria-disabled on disabled rows', () => {
      const columns: TreeGridColumnDef[] = [
        { id: 'name', header: 'Name', isRowHeader: true },
        { id: 'size', header: 'Size' },
      ];

      render(<TreeGrid columns={columns} nodes={createNodesWithDisabled()} ariaLabel="Files" />);

      const docsRow = screen
        .getAllByRole('row')
        .find((r) => r.querySelector('[role="rowheader"]')?.textContent?.includes('Documents'));
      expect(docsRow).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // ===========================================================================
  // Keyboard - Row Navigation
  // ===========================================================================
  describe('Keyboard - Row Navigation', () => {
    it('ArrowDown moves to same column in next visible row', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      // Focus first rowheader (Documents)
      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{ArrowDown}');

      // Should move to report.pdf rowheader (first child)
      expect(screen.getByRole('rowheader', { name: 'report.pdf' })).toHaveFocus();
    });

    it('ArrowUp moves to same column in previous visible row', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      // Focus report.pdf rowheader
      const reportRowheader = screen.getByRole('rowheader', { name: 'report.pdf' });
      reportRowheader.focus();

      await user.keyboard('{ArrowUp}');

      // Should move to Documents rowheader
      expect(screen.getByRole('rowheader', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowDown skips collapsed child rows', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus Documents rowheader (collapsed)
      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{ArrowDown}');

      // Should skip children and move to Images
      expect(screen.getByRole('rowheader', { name: 'Images' })).toHaveFocus();
    });

    it('ArrowUp stops at first visible row', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus first data row
      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{ArrowUp}');

      // Should stay at Documents (first data row)
      expect(docsRowheader).toHaveFocus();
    });

    it('ArrowDown stops at last visible row', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus last row (README.md)
      const readmeRowheader = screen.getByRole('rowheader', { name: 'README.md' });
      readmeRowheader.focus();

      await user.keyboard('{ArrowDown}');

      // Should stay at README.md
      expect(readmeRowheader).toHaveFocus();
    });

    it('maintains column position during row navigation', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      // Focus size cell of Documents (first '--' cell)
      const docsSizeCell = screen.getAllByRole('gridcell', { name: '--' })[0];
      docsSizeCell.focus();

      await user.keyboard('{ArrowDown}');

      // Should move to size cell of report.pdf
      expect(screen.getByRole('gridcell', { name: '2.5 MB' })).toHaveFocus();
    });
  });

  // ===========================================================================
  // Keyboard - Cell Navigation
  // ===========================================================================
  describe('Keyboard - Cell Navigation', () => {
    it('ArrowRight moves right at non-rowheader cells', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus size cell
      const sizeCell = screen.getAllByRole('gridcell', { name: '--' })[0];
      sizeCell.focus();

      await user.keyboard('{ArrowRight}');

      // Should move to date cell
      expect(screen.getByRole('gridcell', { name: '2024-01-15' })).toHaveFocus();
    });

    it('ArrowLeft moves left at non-rowheader cells', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus date cell
      const dateCell = screen.getByRole('gridcell', { name: '2024-01-15' });
      dateCell.focus();

      await user.keyboard('{ArrowLeft}');

      // Should move to size cell
      expect(screen.getAllByRole('gridcell', { name: '--' })[0]).toHaveFocus();
    });

    it('ArrowRight at non-rowheader does NOT expand', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus size cell of Documents (collapsed parent)
      const sizeCell = screen.getAllByRole('gridcell', { name: '--' })[0];
      sizeCell.focus();

      const parentRow = sizeCell.closest('[role="row"]');
      expect(parentRow).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard('{ArrowRight}');

      // Should NOT expand, just move right
      expect(parentRow).toHaveAttribute('aria-expanded', 'false');
    });

    it('ArrowLeft at non-rowheader does NOT collapse', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      // Focus date cell of Documents (expanded parent)
      const dateCell = screen.getByRole('gridcell', { name: '2024-01-15' });
      dateCell.focus();

      const parentRow = dateCell.closest('[role="row"]');
      expect(parentRow).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{ArrowLeft}');

      // Should NOT collapse, just move left
      expect(parentRow).toHaveAttribute('aria-expanded', 'true');
    });

    it('Home moves to first cell in row', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus last cell (date)
      const dateCell = screen.getByRole('gridcell', { name: '2024-01-15' });
      dateCell.focus();

      await user.keyboard('{Home}');

      // Should move to rowheader
      expect(screen.getByRole('rowheader', { name: 'Documents' })).toHaveFocus();
    });

    it('End moves to last cell in row', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus rowheader
      const rowheader = screen.getByRole('rowheader', { name: 'Documents' });
      rowheader.focus();

      await user.keyboard('{End}');

      // Should move to last cell (date)
      expect(screen.getByRole('gridcell', { name: '2024-01-15' })).toHaveFocus();
    });

    it('Ctrl+Home moves to first cell in grid', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus last row
      const readmeRowheader = screen.getByRole('rowheader', { name: 'README.md' });
      readmeRowheader.focus();

      await user.keyboard('{Control>}{Home}{/Control}');

      // Should move to first rowheader
      expect(screen.getByRole('rowheader', { name: 'Documents' })).toHaveFocus();
    });

    it('Ctrl+End moves to last cell in grid', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Focus first cell
      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{Control>}{End}{/Control}');

      // Should move to last cell (date of README.md)
      expect(screen.getByRole('gridcell', { name: '2024-01-01' })).toHaveFocus();
    });
  });

  // ===========================================================================
  // Keyboard - Tree Operations (at rowheader only)
  // ===========================================================================
  describe('Keyboard - Tree Operations', () => {
    it('ArrowRight expands collapsed parent row at rowheader', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      const parentRow = docsRowheader.closest('[role="row"]');
      expect(parentRow).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard('{ArrowRight}');

      expect(parentRow).toHaveAttribute('aria-expanded', 'true');
    });

    it('ArrowRight moves to next cell when expanded at rowheader', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{ArrowRight}');

      // Should move to next cell (size cell: --)
      expect(screen.getAllByRole('gridcell', { name: '--' })[0]).toHaveFocus();
    });

    it('ArrowRight moves to next cell on leaf row at rowheader', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      const readmeRowheader = screen.getByRole('rowheader', { name: 'README.md' });
      readmeRowheader.focus();

      await user.keyboard('{ArrowRight}');

      // Should move to the next cell (size cell: 4 KB)
      expect(screen.getByRole('gridcell', { name: '4 KB' })).toHaveFocus();
    });

    it('ArrowLeft collapses expanded parent row at rowheader', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      const parentRow = docsRowheader.closest('[role="row"]');
      expect(parentRow).toHaveAttribute('aria-expanded', 'true');

      await user.keyboard('{ArrowLeft}');

      expect(parentRow).toHaveAttribute('aria-expanded', 'false');
    });

    it('ArrowLeft moves to parent when collapsed at rowheader', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      // Focus on child row
      const reportRowheader = screen.getByRole('rowheader', { name: 'report.pdf' });
      reportRowheader.focus();

      await user.keyboard('{ArrowLeft}');

      // Should move to parent's rowheader
      expect(screen.getByRole('rowheader', { name: 'Documents' })).toHaveFocus();
    });

    it('ArrowLeft does nothing at root level collapsed row', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      // Documents is at root level and collapsed
      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      const parentRow = docsRowheader.closest('[role="row"]');
      expect(parentRow).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard('{ArrowLeft}');

      // Should stay at Documents
      expect(docsRowheader).toHaveFocus();
    });
  });

  // ===========================================================================
  // Keyboard - Selection & Activation
  // ===========================================================================
  describe('Keyboard - Selection & Activation', () => {
    it('Enter activates cell (calls onCellActivate)', async () => {
      const user = userEvent.setup();
      const onCellActivate = vi.fn();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          onCellActivate={onCellActivate}
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{Enter}');

      expect(onCellActivate).toHaveBeenCalledWith('docs-name', 'docs', 'name');
    });

    it('Enter does NOT expand/collapse', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      const parentRow = docsRowheader.closest('[role="row"]');
      expect(parentRow).toHaveAttribute('aria-expanded', 'false');

      await user.keyboard('{Enter}');

      // Should still be collapsed
      expect(parentRow).toHaveAttribute('aria-expanded', 'false');
    });

    it('Space toggles row selection', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          selectable
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      const row = docsRowheader.closest('[role="row"]');
      expect(row).toHaveAttribute('aria-selected', 'false');

      await user.keyboard(' ');

      expect(row).toHaveAttribute('aria-selected', 'true');

      await user.keyboard(' ');

      expect(row).toHaveAttribute('aria-selected', 'false');
    });

    it('Space does not select disabled row', async () => {
      const user = userEvent.setup();
      const columns: TreeGridColumnDef[] = [
        { id: 'name', header: 'Name', isRowHeader: true },
        { id: 'size', header: 'Size' },
      ];

      render(
        <TreeGrid
          columns={columns}
          nodes={createNodesWithDisabled()}
          ariaLabel="Files"
          selectable
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      const row = docsRowheader.closest('[role="row"]');
      expect(row).toHaveAttribute('aria-disabled', 'true');
      expect(row).toHaveAttribute('aria-selected', 'false');

      await user.keyboard(' ');

      expect(row).toHaveAttribute('aria-selected', 'false');
    });

    it('Ctrl+A selects all visible rows (multiselectable)', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          selectable
          multiselectable
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{Control>}a{/Control}');

      // All visible rows should be selected
      const dataRows = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-level'));
      dataRows.forEach((row) => {
        expect(row).toHaveAttribute('aria-selected', 'true');
      });
    });

    it('single selection clears previous on Space', async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          selectable
        />
      );

      // Select Documents
      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();
      await user.keyboard(' ');

      const docsRow = docsRowheader.closest('[role="row"]');
      expect(docsRow).toHaveAttribute('aria-selected', 'true');

      // Select Images
      await user.keyboard('{ArrowDown}');
      await user.keyboard(' ');

      const imagesRow = screen.getByRole('rowheader', { name: 'Images' }).closest('[role="row"]');
      expect(imagesRow).toHaveAttribute('aria-selected', 'true');

      // Documents should be deselected
      expect(docsRow).toHaveAttribute('aria-selected', 'false');
    });

    it('calls onSelectionChange callback', async () => {
      const user = userEvent.setup();
      const onSelectionChange = vi.fn();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          selectable
          onSelectionChange={onSelectionChange}
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();
      await user.keyboard(' ');

      expect(onSelectionChange).toHaveBeenCalledWith(['docs']);
    });
  });

  // ===========================================================================
  // Focus Management
  // ===========================================================================
  describe('Focus Management', () => {
    it('only one cell has tabIndex="0"', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      const allFocusableCells = screen
        .getAllByRole('rowheader')
        .concat(screen.getAllByRole('gridcell'));
      const tabIndex0Cells = allFocusableCells.filter(
        (cell) => cell.getAttribute('tabindex') === '0'
      );

      expect(tabIndex0Cells).toHaveLength(1);
    });

    it('other cells have tabIndex="-1"', () => {
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      const cells = screen.getAllByRole('gridcell');
      const tabIndexMinus1Cells = cells.filter((cell) => cell.getAttribute('tabindex') === '-1');

      // All gridcells should have tabindex="-1" (rowheader has tabindex="0")
      expect(tabIndexMinus1Cells.length).toBe(cells.length);
    });

    it("focus moves to parent when child's parent collapses", async () => {
      const user = userEvent.setup();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
        />
      );

      // Focus on child
      const reportRowheader = screen.getByRole('rowheader', { name: 'report.pdf' });
      reportRowheader.focus();

      // Collapse parent
      await user.keyboard('{ArrowLeft}'); // Move to parent
      await user.keyboard('{ArrowLeft}'); // Collapse parent

      // Focus should be on parent
      expect(screen.getByRole('rowheader', { name: 'Documents' })).toHaveFocus();
    });

    it('columnheader cells are not focusable', () => {
      render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );

      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).not.toHaveAttribute('tabindex');
      });
    });

    it('disabled cells are focusable', () => {
      const columns: TreeGridColumnDef[] = [
        { id: 'name', header: 'Name', isRowHeader: true },
        { id: 'size', header: 'Size' },
      ];

      render(<TreeGrid columns={columns} nodes={createNodesWithDisabled()} ariaLabel="Files" />);

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      expect(docsRowheader).toHaveAttribute('tabindex');
    });

    it('Tab exits grid', async () => {
      const user = userEvent.setup();
      render(
        <div>
          <button>Before</button>
          <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
          <button>After</button>
        </div>
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.tab();

      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });
  });

  // ===========================================================================
  // Virtualization Support
  // ===========================================================================
  describe('Virtualization Support', () => {
    it('has aria-rowcount when totalRows provided', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          totalRows={100}
        />
      );

      expect(screen.getByRole('treegrid')).toHaveAttribute('aria-rowcount', '100');
    });

    it('has aria-colcount when totalColumns provided', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          totalColumns={10}
        />
      );

      expect(screen.getByRole('treegrid')).toHaveAttribute('aria-colcount', '10');
    });

    it('has aria-rowindex on rows when virtualizing', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          totalRows={100}
          startRowIndex={10}
        />
      );

      const rows = screen.getAllByRole('row').filter((r) => r.hasAttribute('aria-level'));
      expect(rows[0]).toHaveAttribute('aria-rowindex', '10');
      expect(rows[1]).toHaveAttribute('aria-rowindex', '11');
      expect(rows[2]).toHaveAttribute('aria-rowindex', '12');
    });

    it('has aria-colindex on cells when virtualizing', () => {
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          totalColumns={10}
          startColIndex={5}
        />
      );

      const firstRowCells = [
        screen.getAllByRole('rowheader')[0],
        ...screen.getAllByRole('gridcell').slice(0, 2),
      ];
      expect(firstRowCells[0]).toHaveAttribute('aria-colindex', '5');
      expect(firstRowCells[1]).toHaveAttribute('aria-colindex', '6');
      expect(firstRowCells[2]).toHaveAttribute('aria-colindex', '7');
    });
  });

  // ===========================================================================
  // Accessibility
  // ===========================================================================
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(
        <TreeGrid columns={createBasicColumns()} nodes={createBasicNodes()} ariaLabel="Files" />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations when expanded', async () => {
      const { container } = render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs', 'images']}
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations with selection enabled', async () => {
      const { container } = render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          selectable
          multiselectable
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  // ===========================================================================
  // Callbacks
  // ===========================================================================
  describe('Callbacks', () => {
    it('calls onExpandedChange when expanding', async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          onExpandedChange={onExpandedChange}
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{ArrowRight}');

      expect(onExpandedChange).toHaveBeenCalledWith(['docs']);
    });

    it('calls onExpandedChange when collapsing', async () => {
      const user = userEvent.setup();
      const onExpandedChange = vi.fn();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          defaultExpandedIds={['docs']}
          onExpandedChange={onExpandedChange}
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{ArrowLeft}');

      expect(onExpandedChange).toHaveBeenCalledWith([]);
    });

    it('calls onFocusChange when focus moves', async () => {
      const user = userEvent.setup();
      const onFocusChange = vi.fn();
      render(
        <TreeGrid
          columns={createBasicColumns()}
          nodes={createBasicNodes()}
          ariaLabel="Files"
          onFocusChange={onFocusChange}
        />
      );

      const docsRowheader = screen.getByRole('rowheader', { name: 'Documents' });
      docsRowheader.focus();

      await user.keyboard('{ArrowRight}');

      expect(onFocusChange).toHaveBeenCalled();
    });
  });
});
