<script lang="ts">
  import Grid from './Grid.svelte';

  const columns = [
    { id: 'name', header: 'Name' },
    { id: 'email', header: 'Email' },
    { id: 'role', header: 'Role' },
    { id: 'status', header: 'Status' },
  ];

  const rows = [
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

  let selectedIds = $state<string[]>([]);
  let multiselectable = $state(true);

  function handleSelectionChange(ids: string[]) {
    selectedIds = ids;
  }

  function handleCellActivate(cellId: string, rowId: string, colId: string) {
    console.log('Cell activated:', { cellId, rowId, colId });
  }

  function renderCell(cell: { value: string | number }, rowId: string, colId: string) {
    if (colId === 'name') {
      return `<a href="#user-${rowId}" onclick="event.preventDefault()">${cell.value}</a>`;
    }
    return String(cell.value);
  }
</script>

<div class="apg-grid-demo">
  <div class="apg-grid-demo__description">
    <p>
      Use arrow keys to navigate between cells. Press Space to select/deselect cells. Press Enter to
      activate a cell.
    </p>
  </div>

  <div class="apg-grid-demo__controls">
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={multiselectable} />
      Multi-select mode
    </label>
  </div>

  <Grid
    {columns}
    {rows}
    ariaLabel="User list"
    selectable
    {multiselectable}
    {selectedIds}
    onSelectionChange={handleSelectionChange}
    onCellActivate={handleCellActivate}
    {renderCell}
    enablePageNavigation
    pageSize={2}
  />

  {#if selectedIds.length > 0}
    <div class="apg-grid-demo__selection-info">
      <strong>Selected cells:</strong>
      {selectedIds.join(', ')}
    </div>
  {/if}
</div>
