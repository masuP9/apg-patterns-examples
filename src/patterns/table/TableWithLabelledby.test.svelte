<script lang="ts">
  import Table from './Table.svelte';
  import type { TableColumn, TableRow } from './Table.svelte';

  const columns: TableColumn[] = [
    { id: 'name', header: 'Name' },
    { id: 'age', header: 'Age' },
  ];

  const rows: TableRow[] = [
    { id: '1', cells: ['Alice', '30'] },
    { id: '2', cells: ['Bob', '25'] },
  ];
</script>

<div>
  <h2 id="table-title">Employee Directory</h2>
  <Table {columns} {rows} aria-labelledby="table-title" />
</div>
