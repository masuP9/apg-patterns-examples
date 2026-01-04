import { useState } from 'react';
import { MenuButton, type MenuItem } from './MenuButton';

const actionItems: MenuItem[] = [
  { id: 'cut', label: 'Cut' },
  { id: 'copy', label: 'Copy' },
  { id: 'paste', label: 'Paste' },
  { id: 'delete', label: 'Delete' },
];

const fileItems: MenuItem[] = [
  { id: 'new', label: 'New File' },
  { id: 'open', label: 'Open...' },
  { id: 'save', label: 'Save' },
  { id: 'save-as', label: 'Save As...' },
  { id: 'export', label: 'Export', disabled: true },
  { id: 'print', label: 'Print' },
];

export function BasicMenuButtonDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <MenuButton items={actionItems} label="Actions" onItemSelect={setLastAction} />
      <p className="text-muted-foreground text-sm">Last action: {lastAction ?? 'None'}</p>
    </div>
  );
}

export function DisabledItemsMenuButtonDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <MenuButton items={fileItems} label="File" onItemSelect={setLastAction} />
      <p className="text-muted-foreground text-sm">Last action: {lastAction ?? 'None'}</p>
      <p className="text-muted-foreground text-xs">
        Note: "Export" is disabled and will be skipped during keyboard navigation
      </p>
    </div>
  );
}
