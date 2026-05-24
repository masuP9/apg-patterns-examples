import { useState } from 'react';
import { TreeView, type TreeNode } from './TreeView';

interface Props {
  nodes: TreeNode[];
  'aria-label': string;
  defaultExpandedIds?: string[];
}

export function TreeViewActivationDemo({
  nodes,
  'aria-label': ariaLabel,
  defaultExpandedIds = [],
}: Props) {
  const [activatedId, setActivatedId] = useState<string | null>(null);

  const handleActivate = (id: string) => {
    setActivatedId(id);
  };

  const findNodeLabel = (nodes: TreeNode[], id: string): string | null => {
    for (const { id: nodeId, label, children } of nodes) {
      if (nodeId === id) {
        return label;
      }
      if (children) {
        const found = findNodeLabel(children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  const activatedLabel = activatedId ? findNodeLabel(nodes, activatedId) : null;

  const handleReset = () => {
    setActivatedId(null);
  };

  return (
    <div className="flex flex-col gap-4">
      <TreeView
        nodes={nodes}
        aria-label={ariaLabel}
        defaultExpandedIds={defaultExpandedIds}
        onActivate={handleActivate}
      />
      <div className="flex items-center gap-3">
        <div
          role="status"
          aria-live="polite"
          className="flex-1 rounded-md border border-dashed border-gray-300 bg-gray-50 px-4 py-3 text-sm dark:border-gray-600 dark:bg-gray-800"
        >
          <span className="text-muted-foreground">Activated: </span>
          {activatedLabel ? (
            <span className="font-medium">{activatedLabel}</span>
          ) : (
            <span className="text-muted-foreground italic">
              Select a node with Enter, Space, or Click
            </span>
          )}
        </div>
        {activatedId && (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
