import { useState, useCallback } from 'react';
import { Grid, type GridColumnDef, type GridRowData, type GridCellData } from './Grid';

const columns: GridColumnDef[] = [
  { id: 'name', header: 'Name' },
  { id: 'email', header: 'Email' },
  { id: 'role', header: 'Role' },
  { id: 'status', header: 'Status' },
];

const rows: GridRowData[] = [
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
      { id: 'user3-1', value: 'charlie@example.com', disabled: true },
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

export function GridDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [multiselectable, setMultiselectable] = useState(true);

  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

   
  const handleCellActivate = useCallback((_cellId: string, _rowId: string, _colId: string) => {
    // Handle cell activation (e.g., navigate, open modal, etc.)
  }, []);

  const renderCell = useCallback((cell: GridCellData, rowId: string, colId: string) => {
    // Make Name column a link
    if (colId === 'name') {
      return (
        <a href={`#user-${rowId}`} onClick={(e) => e.preventDefault()}>
          {cell.value}
        </a>
      );
    }
    return cell.value;
  }, []);

  return (
    <div className="apg-grid-demo">
      <div className="apg-grid-demo__description">
        <p>
          Use arrow keys to navigate between cells. Press Space to select/deselect cells. Press
          Enter to activate a cell.
        </p>
      </div>

      <div className="apg-grid-demo__controls">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={multiselectable}
            onChange={(e) => setMultiselectable(e.target.checked)}
          />
          Multi-select mode
        </label>
      </div>

      <Grid
        columns={columns}
        rows={rows}
        ariaLabel="User list"
        selectable
        multiselectable={multiselectable}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        onCellActivate={handleCellActivate}
        renderCell={renderCell}
        enablePageNavigation
        pageSize={2}
      />

      {selectedIds.length > 0 && (
        <div className="apg-grid-demo__selection-info">
          <strong>Selected cells:</strong> {selectedIds.join(', ')}
        </div>
      )}
    </div>
  );
}

export default GridDemo;
