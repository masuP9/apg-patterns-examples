import { useState, useCallback } from 'react';
import {
  DataGrid,
  type DataGridColumnDef,
  type DataGridRowData,
  type DataGridCellData,
  type SortDirection,
} from './DataGrid';

// Role options for combobox
const roleOptions = ['Admin', 'Editor', 'Viewer', 'Moderator', 'Guest'];

// Status options for select
const statusOptions = ['Active', 'Inactive'];

const initialRows: DataGridRowData[] = [
  {
    id: 'user1',
    cells: [
      { id: 'user1-0', value: 'Alice Johnson' },
      { id: 'user1-1', value: 'alice@example.com' },
      { id: 'user1-2', value: 'Admin' },
      { id: 'user1-3', value: 'Active' },
    ],
  },
  {
    id: 'user2',
    cells: [
      { id: 'user2-0', value: 'Bob Smith' },
      { id: 'user2-1', value: 'bob@example.com' },
      { id: 'user2-2', value: 'Editor' },
      { id: 'user2-3', value: 'Active' },
    ],
  },
  {
    id: 'user3',
    cells: [
      { id: 'user3-0', value: 'Charlie Brown' },
      { id: 'user3-1', value: 'charlie@example.com' },
      { id: 'user3-2', value: 'Viewer' },
      { id: 'user3-3', value: 'Inactive' },
    ],
  },
  {
    id: 'user4',
    cells: [
      { id: 'user4-0', value: 'Diana Prince' },
      { id: 'user4-1', value: 'diana@example.com' },
      { id: 'user4-2', value: 'Admin' },
      { id: 'user4-3', value: 'Active' },
    ],
  },
  {
    id: 'user5',
    cells: [
      { id: 'user5-0', value: 'Eve Wilson' },
      { id: 'user5-1', value: 'eve@example.com' },
      { id: 'user5-2', value: 'Editor' },
      { id: 'user5-3', value: 'Active' },
    ],
  },
];

export function DataGridDemo() {
  // Columns with sort state and edit configuration
  const [columns, setColumns] = useState<DataGridColumnDef[]>([
    { id: 'name', header: 'Name', sortable: true, sortDirection: 'none', isRowLabel: true },
    { id: 'email', header: 'Email', sortable: true, sortDirection: 'none' },
    {
      id: 'role',
      header: 'Role',
      sortable: true,
      sortDirection: 'none',
      editable: true,
      editType: 'combobox',
      options: roleOptions,
    },
    {
      id: 'status',
      header: 'Status',
      sortable: false,
      editable: true,
      editType: 'select',
      options: statusOptions,
    },
  ]);

  // Row data with editable values
  const [rows, setRows] = useState<DataGridRowData[]>(initialRows);

  // Row selection state
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);

  // Range selection state
  const [rangeSelectedIds, setRangeSelectedIds] = useState<string[]>([]);

  // Demo options
  const [rowSelectable, setRowSelectable] = useState(true);
  const [rowMultiselectable, setRowMultiselectable] = useState(true);
  const [enableRangeSelection, setEnableRangeSelection] = useState(false);
  const [editable, setEditable] = useState(true);

  // Handle sort
  const handleSort = useCallback((columnId: string, direction: SortDirection) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        sortDirection: col.id === columnId ? direction : 'none',
      }))
    );

    // Sort rows based on the column
    setRows((prevRows) => {
      const colIndex = ['name', 'email', 'role', 'status'].indexOf(columnId);
      if (colIndex === -1) return prevRows;

      const sorted = [...prevRows].sort((a, b) => {
        const aValue = String(a.cells[colIndex]?.value ?? '');
        const bValue = String(b.cells[colIndex]?.value ?? '');
        const comparison = aValue.localeCompare(bValue);
        return direction === 'ascending' ? comparison : -comparison;
      });

      return sorted;
    });
  }, []);

  // Handle row selection change
  const handleRowSelectionChange = useCallback((ids: string[]) => {
    setSelectedRowIds(ids);
  }, []);

  // Handle range selection change
  const handleRangeSelect = useCallback((ids: string[]) => {
    setRangeSelectedIds(ids);
  }, []);

  // Handle cell edit
  const handleEditEnd = useCallback((cellId: string, value: string, cancelled: boolean) => {
    if (cancelled) return;

    setRows((prevRows) =>
      prevRows.map((row) => ({
        ...row,
        cells: row.cells.map((cell) => (cell.id === cellId ? { ...cell, value } : cell)),
      }))
    );
  }, []);

  // Render cell content
  const renderCell = useCallback((cell: DataGridCellData, _rowId: string, colId: string) => {
    // Add visual indicator for status column
    if (colId === 'status') {
      const isActive = cell.value === 'Active';
      return (
        <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
          {cell.value}
        </span>
      );
    }
    return cell.value;
  }, []);

  return (
    <div className="apg-data-grid-demo">
      <div className="apg-data-grid-demo__controls">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rowSelectable}
            onChange={(e) => setRowSelectable(e.target.checked)}
          />
          Row Selection
        </label>
        {rowSelectable && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rowMultiselectable}
              onChange={(e) => setRowMultiselectable(e.target.checked)}
            />
            Multi-select
          </label>
        )}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={enableRangeSelection}
            onChange={(e) => setEnableRangeSelection(e.target.checked)}
          />
          Range Selection
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={editable}
            onChange={(e) => setEditable(e.target.checked)}
          />
          Editable
        </label>
      </div>

      <DataGrid
        columns={columns}
        rows={rows}
        ariaLabel="User list"
        rowSelectable={rowSelectable}
        rowMultiselectable={rowMultiselectable}
        selectedRowIds={selectedRowIds}
        onRowSelectionChange={handleRowSelectionChange}
        onSort={handleSort}
        enableRangeSelection={enableRangeSelection}
        onRangeSelect={handleRangeSelect}
        editable={editable}
        onEditEnd={handleEditEnd}
        renderCell={renderCell}
        enablePageNavigation
        pageSize={3}
      />

      {selectedRowIds.length > 0 && (
        <div className="apg-data-grid-demo__selection-info">
          <strong>Selected rows:</strong> {selectedRowIds.join(', ')}
        </div>
      )}

      {rangeSelectedIds.length > 0 && (
        <div className="apg-data-grid-demo__selection-info">
          <strong>Range selected cells:</strong> {rangeSelectedIds.join(', ')}
        </div>
      )}

      <div className="apg-data-grid-demo__description">
        <p>
          <strong>Navigation:</strong> Arrow keys to navigate, Home/End for row bounds,
          Ctrl+Home/End for grid bounds.
        </p>
        <p>
          <strong>Sorting:</strong> Click or press Enter/Space on a sortable column header to cycle
          sort direction.
        </p>
        {rowSelectable && (
          <p>
            <strong>Row Selection:</strong> Click checkboxes or press Space to select/deselect rows.
          </p>
        )}
        {enableRangeSelection && (
          <p>
            <strong>Range Selection:</strong> Hold Shift and use arrow keys to extend selection.
          </p>
        )}
        {editable && (
          <p>
            <strong>Editing:</strong> Press Enter or F2 on an editable cell (Role/Status, indicated
            by pen icon) to edit. Role uses combobox with autocomplete, Status uses select dropdown.
            Escape to cancel.
          </p>
        )}
      </div>
    </div>
  );
}

export default DataGridDemo;
