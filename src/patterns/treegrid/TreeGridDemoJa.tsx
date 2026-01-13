import { useState, useCallback } from 'react';
import { TreeGrid, type TreeGridColumnDef, type TreeGridNodeData } from './TreeGrid';

const columns: TreeGridColumnDef[] = [
  { id: 'name', header: '名前', isRowHeader: true },
  { id: 'size', header: 'サイズ' },
  { id: 'date', header: '更新日' },
];

const nodes: TreeGridNodeData[] = [
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

export function TreeGridDemoJa() {
  const [selectedRowIds, setSelectedRowIds] = useState<string[]>([]);
  const [expandedIds, setExpandedIds] = useState<string[]>(['docs']);
  const [multiselectable, setMultiselectable] = useState(true);

  const handleSelectionChange = useCallback((ids: string[]) => {
    setSelectedRowIds(ids);
  }, []);

  const handleExpandedChange = useCallback((ids: string[]) => {
    setExpandedIds(ids);
  }, []);

  const handleCellActivate = useCallback((_cellId: string, _rowId: string, _colId: string) => {
    // Handle cell activation (e.g., navigate, open modal, etc.)
  }, []);

  return (
    <div className="apg-treegrid-demo">
      <div className="apg-treegrid-demo__description">
        <p>
          矢印キーでセル間を移動します。最初の列（行ヘッダー）では、右矢印キーで折りたたまれた行を展開し、左矢印キーで展開された行を折りたたみます。スペースキーで行の選択/解除を行います。Enterキーでセルをアクティブにします。
        </p>
      </div>

      <div className="apg-treegrid-demo__controls">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={multiselectable}
            onChange={(e) => setMultiselectable(e.target.checked)}
          />
          複数選択モード
        </label>
      </div>

      <TreeGrid
        columns={columns}
        nodes={nodes}
        ariaLabel="ファイルブラウザー"
        selectable
        multiselectable={multiselectable}
        selectedRowIds={selectedRowIds}
        expandedIds={expandedIds}
        onSelectionChange={handleSelectionChange}
        onExpandedChange={handleExpandedChange}
        onCellActivate={handleCellActivate}
        enablePageNavigation
        pageSize={2}
      />

      {selectedRowIds.length > 0 && (
        <div className="apg-treegrid-demo__selection-info">
          <strong>選択中の行:</strong> {selectedRowIds.join(', ')}
        </div>
      )}
    </div>
  );
}

export default TreeGridDemoJa;
