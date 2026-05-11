/**
 * Shared demo data for the TreeGrid pattern (Astro Web Component variant).
 *
 * The React / Vue / Svelte demos use locale-specific wrapper components
 * (`TreeGridDemo` / `TreeGridDemoJa`); only the Astro Web Component variant
 * consumes the raw data, but exposing both locales here keeps demo data
 * colocated and avoids inlining ~130 lines into a single .astro file.
 */

export const columnsEn = [
  { id: 'name', header: 'Name', isRowHeader: true },
  { id: 'size', header: 'Size' },
  { id: 'date', header: 'Date Modified' },
];

export const nodesEn = [
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

export const columnsJa = [
  { id: 'name', header: '名前', isRowHeader: true },
  { id: 'size', header: 'サイズ' },
  { id: 'date', header: '更新日' },
];

export const nodesJa = [
  {
    id: 'docs',
    cells: [
      { id: 'docs-name', value: 'ドキュメント' },
      { id: 'docs-size', value: '--' },
      { id: 'docs-date', value: '2024-01-15' },
    ],
    children: [
      {
        id: 'reports',
        cells: [
          { id: 'reports-name', value: 'レポート' },
          { id: 'reports-size', value: '--' },
          { id: 'reports-date', value: '2024-01-10' },
        ],
        children: [
          {
            id: 'q4-report',
            cells: [
              { id: 'q4-report-name', value: 'Q4レポート.pdf' },
              { id: 'q4-report-size', value: '2.5 MB' },
              { id: 'q4-report-date', value: '2024-01-10' },
            ],
          },
          {
            id: 'annual-report',
            cells: [
              { id: 'annual-report-name', value: '年次報告書.pdf' },
              { id: 'annual-report-size', value: '5.2 MB' },
              { id: 'annual-report-date', value: '2024-01-05' },
            ],
          },
        ],
      },
      {
        id: 'photos',
        cells: [
          { id: 'photos-name', value: '写真' },
          { id: 'photos-size', value: '--' },
          { id: 'photos-date', value: '2024-01-08' },
        ],
        children: [
          {
            id: 'vacation',
            cells: [
              { id: 'vacation-name', value: '旅行.jpg' },
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
      { id: 'downloads-name', value: 'ダウンロード' },
      { id: 'downloads-size', value: '--' },
      { id: 'downloads-date', value: '2024-01-12' },
    ],
    children: [
      {
        id: 'app-installer',
        cells: [
          { id: 'app-installer-name', value: 'アプリインストーラー.exe' },
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
