<script lang="ts">
  import TreeGrid, { type TreeGridColumnDef, type TreeGridNodeData } from './TreeGrid.svelte';

  const columns: TreeGridColumnDef[] = [
    { id: 'name', header: 'Name', isRowHeader: true },
    { id: 'size', header: 'Size' },
    { id: 'date', header: 'Date Modified' },
  ];

  const nodes: TreeGridNodeData[] = [
    {
      id: 'docs',
      cells: [
        { id: 'docs-name', value: 'Documents' },
        { id: 'docs-size', value: '--' },
        { id: 'docs-date', value: '2024-01-15' },
      ],
      children: [
        {
          id: 'reports',
          cells: [
            { id: 'reports-name', value: 'Reports' },
            { id: 'reports-size', value: '--' },
            { id: 'reports-date', value: '2024-01-10' },
          ],
          children: [
            {
              id: 'q4-report',
              cells: [
                { id: 'q4-report-name', value: 'Q4-Report.pdf' },
                { id: 'q4-report-size', value: '2.5 MB' },
                { id: 'q4-report-date', value: '2024-01-10' },
              ],
            },
            {
              id: 'annual-report',
              cells: [
                { id: 'annual-report-name', value: 'Annual-Report.pdf' },
                { id: 'annual-report-size', value: '5.2 MB' },
                { id: 'annual-report-date', value: '2024-01-05' },
              ],
            },
          ],
        },
        {
          id: 'photos',
          cells: [
            { id: 'photos-name', value: 'Photos' },
            { id: 'photos-size', value: '--' },
            { id: 'photos-date', value: '2024-01-08' },
          ],
          children: [
            {
              id: 'vacation',
              cells: [
                { id: 'vacation-name', value: 'vacation.jpg' },
                { id: 'vacation-size', value: '3.1 MB' },
                { id: 'vacation-date', value: '2024-01-08' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'downloads',
      cells: [
        { id: 'downloads-name', value: 'Downloads' },
        { id: 'downloads-size', value: '--' },
        { id: 'downloads-date', value: '2024-01-12' },
      ],
      children: [
        {
          id: 'app-installer',
          cells: [
            { id: 'app-installer-name', value: 'app-installer.exe' },
            { id: 'app-installer-size', value: '125 MB' },
            { id: 'app-installer-date', value: '2024-01-12' },
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

  let selectedRowIds = $state<string[]>([]);
  let expandedIds = $state<string[]>(['docs']);
  let multiselectable = $state(true);

  function handleSelectionChange(ids: string[]) {
    selectedRowIds = ids;
  }

  function handleExpandedChange(ids: string[]) {
    expandedIds = ids;
  }

  function handleCellActivate(cellId: string, rowId: string, colId: string) {
    console.log('Cell activated:', { cellId, rowId, colId });
  }
</script>

<div class="apg-treegrid-demo">
  <div class="apg-treegrid-demo__description">
    <p>
      Use arrow keys to navigate between cells. At the first column (rowheader), ArrowRight expands
      collapsed rows and ArrowLeft collapses expanded rows. Press Space to select/deselect rows.
      Press Enter to activate a cell.
    </p>
  </div>

  <div class="apg-treegrid-demo__controls">
    <label class="flex items-center gap-2">
      <input type="checkbox" bind:checked={multiselectable} />
      Multi-select mode
    </label>
  </div>

  <TreeGrid
    {columns}
    {nodes}
    ariaLabel="File browser"
    selectable
    {multiselectable}
    {selectedRowIds}
    {expandedIds}
    enablePageNavigation
    pageSize={2}
    onSelectionChange={handleSelectionChange}
    onExpandedChange={handleExpandedChange}
    onCellActivate={handleCellActivate}
  />

  {#if selectedRowIds.length > 0}
    <div class="apg-treegrid-demo__selection-info">
      <strong>Selected rows:</strong>
      {selectedRowIds.join(', ')}
    </div>
  {/if}
</div>
