import { useState } from 'react';
import { Menubar, type MenubarItem } from './Menubar';
import '@patterns/menubar/menubar.css';

const menubarItems: MenubarItem[] = [
  {
    id: 'file',
    label: 'File',
    items: [
      { type: 'item', id: 'new', label: 'New' },
      { type: 'item', id: 'open', label: 'Open' },
      {
        type: 'submenu',
        id: 'open-recent',
        label: 'Open Recent',
        items: [
          { type: 'item', id: 'project1', label: 'project-alpha.js' },
          { type: 'item', id: 'project2', label: 'dashboard.tsx' },
          { type: 'item', id: 'project3', label: 'styles.css' },
        ],
      },
      { type: 'separator', id: 'sep1' },
      { type: 'item', id: 'save', label: 'Save' },
      { type: 'item', id: 'save-as', label: 'Save As...' },
      { type: 'separator', id: 'sep2' },
      { type: 'item', id: 'export', label: 'Export', disabled: true },
      { type: 'item', id: 'print', label: 'Print...' },
    ],
  },
  {
    id: 'edit',
    label: 'Edit',
    items: [
      { type: 'item', id: 'undo', label: 'Undo' },
      { type: 'item', id: 'redo', label: 'Redo' },
      { type: 'separator', id: 'sep3' },
      { type: 'item', id: 'cut', label: 'Cut' },
      { type: 'item', id: 'copy', label: 'Copy' },
      { type: 'item', id: 'paste', label: 'Paste' },
      { type: 'separator', id: 'sep4' },
      { type: 'item', id: 'find', label: 'Find...' },
      { type: 'item', id: 'replace', label: 'Replace...' },
    ],
  },
  {
    id: 'view',
    label: 'View',
    items: [
      {
        type: 'checkbox',
        id: 'show-toolbar',
        label: 'Show Toolbar',
        checked: true,
      },
      {
        type: 'checkbox',
        id: 'show-sidebar',
        label: 'Show Sidebar',
        checked: false,
      },
      { type: 'checkbox', id: 'show-minimap', label: 'Show Minimap', checked: true },
      { type: 'separator', id: 'sep5' },
      {
        type: 'radiogroup',
        id: 'theme-group',
        name: 'theme',
        label: 'Theme',
        items: [
          { type: 'radio', id: 'theme-light', label: 'Light', checked: true },
          { type: 'radio', id: 'theme-dark', label: 'Dark', checked: false },
          { type: 'radio', id: 'theme-auto', label: 'System', checked: false },
        ],
      },
      { type: 'separator', id: 'sep6' },
      { type: 'item', id: 'zoom-in', label: 'Zoom In' },
      { type: 'item', id: 'zoom-out', label: 'Zoom Out' },
      { type: 'item', id: 'zoom-reset', label: 'Reset Zoom' },
    ],
  },
  {
    id: 'help',
    label: 'Help',
    items: [
      { type: 'item', id: 'docs', label: 'Documentation' },
      { type: 'item', id: 'shortcuts', label: 'Keyboard Shortcuts' },
      { type: 'separator', id: 'sep7' },
      { type: 'item', id: 'about', label: 'About' },
    ],
  },
];

export function BasicMenubarDemo() {
  const [lastAction, setLastAction] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <Menubar items={menubarItems} aria-label="Application" onItemSelect={setLastAction} />
      <p className="text-muted-foreground text-sm">Last action: {lastAction ?? 'None'}</p>
    </div>
  );
}
