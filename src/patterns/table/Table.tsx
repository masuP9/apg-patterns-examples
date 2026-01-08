import type { ReactNode } from 'react';

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
  content: string | ReactNode;
  /** Number of columns this cell spans */
  colspan?: number;
  /** Number of rows this cell spans */
  rowspan?: number;
}

/**
 * Cell value - can be simple string/node or object with spanning
 */
export type TableCellValue = string | ReactNode | TableCell;

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

export interface TableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'role'> {
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
}

export function Table({
  columns,
  rows,
  caption,
  onSortChange,
  totalColumns,
  totalRows,
  startColIndex,
  className,
  ...props
}: TableProps) {
  const handleSortClick = (column: TableColumn) => {
    if (!column.sortable || !onSortChange) return;

    const newDirection: 'ascending' | 'descending' =
      column.sort === 'ascending' ? 'descending' : 'ascending';
    onSortChange(column.id, newDirection);
  };

  // CSS Grid needs to know the column count
  const tableStyle = {
    '--table-cols': columns.length,
  } as React.CSSProperties;

  return (
    <div
      role="table"
      className={`apg-table${className ? ` ${className}` : ''}`}
      style={tableStyle}
      aria-colcount={totalColumns}
      aria-rowcount={totalRows}
      {...props}
    >
      {caption && <div className="apg-table-caption">{caption}</div>}

      {/* Header rowgroup */}
      <div role="rowgroup" className="apg-table-header">
        <div role="row" className="apg-table-row">
          {columns.map((column, colIndex) => {
            const sortProps = column.sortable
              ? { 'aria-sort': column.sort || ('none' as const) }
              : {};
            const colIndexProps =
              startColIndex !== undefined ? { 'aria-colindex': startColIndex + colIndex } : {};

            return (
              <div
                key={column.id}
                role="columnheader"
                className="apg-table-columnheader"
                {...sortProps}
                {...colIndexProps}
              >
                {column.sortable ? (
                  <button
                    type="button"
                    className="apg-table-sort-button"
                    onClick={() => handleSortClick(column)}
                    aria-label={`Sort by ${column.header}`}
                  >
                    {column.header}
                    <span className="apg-table-sort-icon" aria-hidden="true">
                      {column.sort === 'ascending' ? '▲' : column.sort === 'descending' ? '▼' : '⇅'}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Body rowgroup */}
      <div role="rowgroup" className="apg-table-body">
        {rows.map((row) => {
          const rowIndexProps = row.rowIndex !== undefined ? { 'aria-rowindex': row.rowIndex } : {};

          return (
            <div key={row.id} role="row" className="apg-table-row" {...rowIndexProps}>
              {row.cells.map((cell, cellIndex) => {
                const isRowHeader = row.hasRowHeader && cellIndex === 0;
                const cellRole = isRowHeader ? 'rowheader' : 'cell';
                const colIndexProps =
                  startColIndex !== undefined ? { 'aria-colindex': startColIndex + cellIndex } : {};

                // Handle cell spanning
                const cellData = isTableCell(cell) ? cell : { content: cell };
                const spanProps: Record<string, number | undefined> = {};
                const gridStyle: React.CSSProperties = {};

                if (cellData.colspan && cellData.colspan > 1) {
                  spanProps['aria-colspan'] = cellData.colspan;
                  gridStyle.gridColumn = `span ${cellData.colspan}`;
                }
                if (cellData.rowspan && cellData.rowspan > 1) {
                  spanProps['aria-rowspan'] = cellData.rowspan;
                  gridStyle.gridRow = `span ${cellData.rowspan}`;
                }

                return (
                  <div
                    key={cellIndex}
                    role={cellRole}
                    className={`apg-table-${cellRole}`}
                    style={Object.keys(gridStyle).length > 0 ? gridStyle : undefined}
                    {...colIndexProps}
                    {...spanProps}
                  >
                    {cellData.content}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
