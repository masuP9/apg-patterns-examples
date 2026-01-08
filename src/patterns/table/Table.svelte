<script lang="ts" module>
  export interface TableColumn {
    id: string;
    header: string;
    /** Column is sortable */
    sortable?: boolean;
    /** Current sort direction */
    sort?: 'ascending' | 'descending' | 'none';
  }

  /**
   * Cell with spanning support
   */
  export interface TableCell {
    content: string;
    /** Number of columns this cell spans */
    colspan?: number;
    /** Number of rows this cell spans */
    rowspan?: number;
  }

  /**
   * Cell value - can be simple string or object with spanning
   */
  export type TableCellValue = string | TableCell;

  /**
   * Type guard to check if cell is a TableCell object
   */
  export function isTableCell(cell: TableCellValue): cell is TableCell {
    return typeof cell === 'object' && cell !== null && 'content' in cell;
  }

  export interface TableRow {
    id: string;
    cells: TableCellValue[];
    /** First cell is row header */
    hasRowHeader?: boolean;
    /** Row index for virtualization (1-based) */
    rowIndex?: number;
  }
</script>

<script lang="ts">
  interface Props {
    /** Column definitions */
    columns: TableColumn[];
    /** Row data */
    rows: TableRow[];
    /** Caption text (optional) */
    caption?: string;
    /** Callback when sort changes */
    onSortChange?: (columnId: string, direction: 'ascending' | 'descending') => void;

    // Virtualization support
    /** Total number of columns (for virtualization) */
    totalColumns?: number;
    /** Total number of rows (for virtualization) */
    totalRows?: number;
    /** Starting column index (1-based, for virtualization) */
    startColIndex?: number;

    // HTML attributes
    class?: string;
    id?: string;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    'aria-describedby'?: string;
    'data-testid'?: string;
  }

  let {
    columns,
    rows,
    caption,
    onSortChange,
    totalColumns,
    totalRows,
    startColIndex,
    class: className,
    ...restProps
  }: Props = $props();

  function handleSortClick(column: TableColumn) {
    if (!column.sortable) return;

    const newDirection: 'ascending' | 'descending' =
      column.sort === 'ascending' ? 'descending' : 'ascending';
    onSortChange?.(column.id, newDirection);
  }

  function getSortIcon(sort?: 'ascending' | 'descending' | 'none'): string {
    if (sort === 'ascending') return '▲';
    if (sort === 'descending') return '▼';
    return '⇅';
  }

  function getCellRole(row: TableRow, cellIndex: number): 'rowheader' | 'cell' {
    return row.hasRowHeader && cellIndex === 0 ? 'rowheader' : 'cell';
  }

  function getCellGridStyle(cell: TableCellValue): string | undefined {
    if (!isTableCell(cell)) return undefined;
    const styles: string[] = [];
    if (cell.colspan && cell.colspan > 1) {
      styles.push(`grid-column: span ${cell.colspan}`);
    }
    if (cell.rowspan && cell.rowspan > 1) {
      styles.push(`grid-row: span ${cell.rowspan}`);
    }
    return styles.length > 0 ? styles.join('; ') : undefined;
  }
</script>

<div
  role="table"
  class={`apg-table${className ? ` ${className}` : ''}`}
  style="--table-cols: {columns.length}"
  aria-colcount={totalColumns}
  aria-rowcount={totalRows}
  {...restProps}
>
  {#if caption}
    <div class="apg-table-caption">{caption}</div>
  {/if}

  <!-- Header rowgroup -->
  <div role="rowgroup" class="apg-table-header">
    <div role="row" class="apg-table-row">
      {#each columns as column, colIndex (column.id)}
        <div
          role="columnheader"
          class="apg-table-columnheader"
          aria-sort={column.sortable ? column.sort || 'none' : undefined}
          aria-colindex={startColIndex !== undefined ? startColIndex + colIndex : undefined}
        >
          {#if column.sortable}
            <button
              type="button"
              class="apg-table-sort-button"
              aria-label={`Sort by ${column.header}`}
              onclick={() => handleSortClick(column)}
            >
              {column.header}
              <span class="apg-table-sort-icon" aria-hidden="true">
                {getSortIcon(column.sort)}
              </span>
            </button>
          {:else}
            {column.header}
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Body rowgroup -->
  <div role="rowgroup" class="apg-table-body">
    {#each rows as row (row.id)}
      <div role="row" class="apg-table-row" aria-rowindex={row.rowIndex}>
        {#each row.cells as cell, cellIndex (cellIndex)}
          <div
            role={getCellRole(row, cellIndex)}
            class={`apg-table-${getCellRole(row, cellIndex)}`}
            style={getCellGridStyle(cell)}
            aria-colindex={startColIndex !== undefined ? startColIndex + cellIndex : undefined}
            aria-colspan={isTableCell(cell) && cell.colspan && cell.colspan > 1
              ? cell.colspan
              : undefined}
            aria-rowspan={isTableCell(cell) && cell.rowspan && cell.rowspan > 1
              ? cell.rowspan
              : undefined}
          >
            {isTableCell(cell) ? cell.content : cell}
          </div>
        {/each}
      </div>
    {/each}
  </div>
</div>
