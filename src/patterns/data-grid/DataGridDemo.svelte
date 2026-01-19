<script lang="ts">
  import DataGrid from './DataGrid.svelte';
  import type { DataGridColumnDef, DataGridRowData, SortDirection } from './DataGrid.svelte';

  // Role options for combobox
  const roleOptions = ['Admin', 'Editor', 'Viewer', 'Moderator', 'Guest'];

  // Status options for select
  const statusOptions = ['Active', 'Inactive'];

  // Columns with sort state and edit configuration
  let columns = $state<DataGridColumnDef[]>([
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
  let rows = $state<DataGridRowData[]>([
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
  ]);

  // Row selection state
  let selectedRowIds = $state<string[]>([]);

  // Range selection state
  let rangeSelectedIds = $state<string[]>([]);

  // Demo options
  let rowSelectable = $state(true);
  let rowMultiselectable = $state(true);
  let enableRangeSelection = $state(false);
  let editable = $state(true);

  // Handle sort
  function handleSort(columnId: string, direction: SortDirection) {
    columns = columns.map((col) => ({
      ...col,
      sortDirection: col.id === columnId ? direction : 'none',
    }));

    // Sort rows based on the column
    const colIndex = ['name', 'email', 'role', 'status'].indexOf(columnId);
    if (colIndex === -1) return;

    rows = [...rows].sort((a, b) => {
      const aValue = String(a.cells[colIndex]?.value ?? '');
      const bValue = String(b.cells[colIndex]?.value ?? '');
      const comparison = aValue.localeCompare(bValue);
      return direction === 'ascending' ? comparison : -comparison;
    });
  }

  // Handle row selection change
  function handleRowSelectionChange(ids: string[]) {
    selectedRowIds = ids;
  }

  // Handle range selection change
  function handleRangeSelect(ids: string[]) {
    rangeSelectedIds = ids;
  }

  // Handle cell edit
  function handleEditEnd(cellId: string, value: string, cancelled: boolean) {
    if (cancelled) return;

    rows = rows.map((row) => ({
      ...row,
      cells: row.cells.map((cell) => (cell.id === cellId ? { ...cell, value } : cell)),
    }));
  }

  // Render cell content
  function renderCell(
    cell: { id: string; value: string | number },
    _rowId: string,
    colId: string
  ): string {
    // Add visual indicator for status column
    if (colId === 'status') {
      const isActive = cell.value === 'Active';
      return `<span class="status-badge ${isActive ? 'status-active' : 'status-inactive'}">${cell.value}</span>`;
    }
    return String(cell.value);
  }
</script>

<div class="apg-data-grid-demo">
  <div class="apg-data-grid-demo__description">
    <p>
      <strong>Navigation:</strong> Arrow keys to navigate, Home/End for row bounds, Ctrl+Home/End for
      grid bounds.
    </p>
    <p>
      <strong>Sorting:</strong> Click or press Enter/Space on a sortable column header to cycle sort direction.
    </p>
    {#if rowSelectable}
      <p>
        <strong>Row Selection:</strong> Click checkboxes or press Space to select/deselect rows.
      </p>
    {/if}
    {#if enableRangeSelection}
      <p>
        <strong>Range Selection:</strong> Hold Shift and use arrow keys to extend selection.
      </p>
    {/if}
    {#if editable}
      <p>
        <strong>Editing:</strong> Press Enter or F2 on an editable cell (Role/Status, indicated by pen
        icon) to edit. Role uses combobox with autocomplete, Status uses select dropdown. Escape to cancel.
      </p>
    {/if}
  </div>

  <div class="apg-data-grid-demo__controls">
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={rowSelectable} />
      Row Selection
    </label>
    {#if rowSelectable}
      <label class="flex items-center gap-2">
        <input type="checkbox" bind:checked={rowMultiselectable} />
        Multi-select
      </label>
    {/if}
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={enableRangeSelection} />
      Range Selection
    </label>
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={editable} />
      Editable
    </label>
  </div>

  <DataGrid
    {columns}
    {rows}
    ariaLabel="User list"
    {rowSelectable}
    {rowMultiselectable}
    {selectedRowIds}
    onRowSelectionChange={handleRowSelectionChange}
    onSort={handleSort}
    {enableRangeSelection}
    onRangeSelect={handleRangeSelect}
    {editable}
    onEditEnd={handleEditEnd}
    {renderCell}
    enablePageNavigation
    pageSize={3}
  />

  {#if selectedRowIds.length > 0}
    <div class="apg-data-grid-demo__selection-info">
      <strong>Selected rows:</strong>
      {selectedRowIds.join(', ')}
    </div>
  {/if}

  {#if rangeSelectedIds.length > 0}
    <div class="apg-data-grid-demo__selection-info">
      <strong>Range selected cells:</strong>
      {rangeSelectedIds.join(', ')}
    </div>
  {/if}
</div>
