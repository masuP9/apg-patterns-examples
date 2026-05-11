/**
 * Shared demo data for the Table pattern (Astro Web Component variant).
 *
 * The React / Vue / Svelte variants use wrapper demo components
 * (TableDemo / SortableTableDemo / etc.) with their own internal data.
 * The Astro Web Component variant consumes the raw rows/columns from here.
 */

export const basicColumns = [
  { id: 'name', header: 'Name' },
  { id: 'age', header: 'Age' },
  { id: 'city', header: 'City' },
];

export const basicRows = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'] },
  { id: '2', cells: ['Bob', '25', 'Osaka'] },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'] },
  { id: '4', cells: ['Diana', '28', 'Nagoya'] },
  { id: '5', cells: ['Edward', '42', 'Sapporo'] },
];

export const rowHeaderRows = [
  { id: '1', cells: ['Alice', '30', 'Tokyo'], hasRowHeader: true },
  { id: '2', cells: ['Bob', '25', 'Osaka'], hasRowHeader: true },
  { id: '3', cells: ['Charlie', '35', 'Kyoto'], hasRowHeader: true },
];

export const virtualizedRows = [
  { id: '5', cells: ['Alice', '30', 'Tokyo'], rowIndex: 5 },
  { id: '6', cells: ['Bob', '25', 'Osaka'], rowIndex: 6 },
  { id: '7', cells: ['Charlie', '35', 'Kyoto'], rowIndex: 7 },
  { id: '8', cells: ['Diana', '28', 'Nagoya'], rowIndex: 8 },
  { id: '9', cells: ['Edward', '42', 'Sapporo'], rowIndex: 9 },
];

export const spanningColumns = [
  { id: 'product', header: 'Product' },
  { id: 'q1', header: 'Q1' },
  { id: 'q2', header: 'Q2' },
  { id: 'q3', header: 'Q3' },
  { id: 'q4', header: 'Q4' },
];

export const spanningRows = [
  {
    id: 'electronics',
    cells: [{ content: 'Electronics', rowspan: 2 }, '150', '180', '200', '220'],
  },
  { id: 'electronics-sub', cells: ['175', '190', '210', '240'] },
  { id: 'clothing', cells: ['Clothing', { content: 'N/A', colspan: 2 }, '90', '120'] },
  { id: 'summary', cells: [{ content: 'Total', colspan: 4 }, '1775'] },
];
