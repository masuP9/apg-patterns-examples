import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import Grid from './Grid.svelte';

// Helper function to create basic grid data
const createBasicColumns = () => [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
];

const createBasicRows = () => [
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

const createRowsWithDisabled = () => [
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
    cells: [
      { id: 'row2-0', value: 'Bob' },
      { id: 'row2-1', value: 'bob@example.com' },
      { id: 'row2-2', value: 'User' },
    ],
  },
];

describe('Grid (Svelte)', () => {
  // 🔴 High Priority: ARIA Attributes
  describe('ARIA Attributes', () => {
    it('has role="grid" on container', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });
      expect(screen.getByRole('grid')).toBeInTheDocument();
    });

    it('has role="row" on all rows', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });
      expect(screen.getAllByRole('row')).toHaveLength(4);
    });

    it('has role="gridcell" on data cells', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });
      expect(screen.getAllByRole('gridcell')).toHaveLength(9);
    });

    it('has role="columnheader" on header cells', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });
      expect(screen.getAllByRole('columnheader')).toHaveLength(3);
    });

    it('has accessible name via aria-label', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });
      expect(screen.getByRole('grid', { name: 'Users' })).toBeInTheDocument();
    });

    it('has aria-multiselectable when multiselectable', () => {
      render(Grid, {
        props: {
          columns: createBasicColumns(),
          rows: createBasicRows(),
          ariaLabel: 'Users',
          selectable: true,
          multiselectable: true,
        },
      });
      expect(screen.getByRole('grid')).toHaveAttribute('aria-multiselectable', 'true');
    });

    it('has aria-disabled on disabled cells', () => {
      render(Grid, {
        props: {
          columns: createBasicColumns(),
          rows: createRowsWithDisabled(),
          ariaLabel: 'Users',
        },
      });
      const disabledCell = screen.getByRole('gridcell', { name: 'alice@example.com' });
      expect(disabledCell).toHaveAttribute('aria-disabled', 'true');
    });
  });

  // 🔴 High Priority: Keyboard Navigation
  describe('Keyboard Navigation', () => {
    it('ArrowRight moves focus one cell right', async () => {
      const user = userEvent.setup();
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      await user.keyboard('{ArrowRight}');

      await vi.waitFor(() => {
        expect(screen.getAllByRole('gridcell')[1]).toHaveFocus();
      });
    });

    it('ArrowDown moves focus one row down', async () => {
      const user = userEvent.setup();
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      await user.keyboard('{ArrowDown}');

      await vi.waitFor(() => {
        expect(screen.getAllByRole('gridcell')[3]).toHaveFocus();
      });
    });

    it('ArrowUp stops at first data row', async () => {
      const user = userEvent.setup();
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const firstDataCell = screen.getAllByRole('gridcell')[0];
      firstDataCell.focus();

      await user.keyboard('{ArrowUp}');

      await vi.waitFor(() => {
        expect(firstDataCell).toHaveFocus();
      });
    });

    it('Home moves to first cell in row', async () => {
      const user = userEvent.setup();
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const lastCellInRow = screen.getAllByRole('gridcell')[2];
      lastCellInRow.focus();

      await user.keyboard('{Home}');

      await vi.waitFor(() => {
        expect(screen.getAllByRole('gridcell')[0]).toHaveFocus();
      });
    });

    it('End moves to last cell in row', async () => {
      const user = userEvent.setup();
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      await user.keyboard('{End}');

      await vi.waitFor(() => {
        expect(screen.getAllByRole('gridcell')[2]).toHaveFocus();
      });
    });
  });

  // 🔴 High Priority: Focus Management
  describe('Focus Management', () => {
    it('first focusable cell has tabIndex="0" by default', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const firstCell = screen.getAllByRole('gridcell')[0];
      expect(firstCell).toHaveAttribute('tabindex', '0');
    });

    it('other cells have tabIndex="-1"', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const cells = screen.getAllByRole('gridcell');
      expect(cells[0]).toHaveAttribute('tabindex', '0');
      expect(cells[1]).toHaveAttribute('tabindex', '-1');
    });

    it('columnheader cells are not focusable', () => {
      render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });

      const headers = screen.getAllByRole('columnheader');
      headers.forEach((header) => {
        expect(header).not.toHaveAttribute('tabindex');
      });
    });
  });

  // 🔴 High Priority: Selection
  describe('Selection', () => {
    it('Space toggles selection', async () => {
      const user = userEvent.setup();
      render(Grid, {
        props: {
          columns: createBasicColumns(),
          rows: createBasicRows(),
          ariaLabel: 'Users',
          selectable: true,
        },
      });

      const firstCell = screen.getAllByRole('gridcell')[0];
      firstCell.focus();

      expect(firstCell).toHaveAttribute('aria-selected', 'false');

      await user.keyboard(' ');

      await vi.waitFor(() => {
        expect(firstCell).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  // 🟡 Medium Priority: Accessibility
  describe('Accessibility', () => {
    it('has no axe violations', async () => {
      const { container } = render(Grid, {
        props: { columns: createBasicColumns(), rows: createBasicRows(), ariaLabel: 'Users' },
      });
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
