/**
 * Shared demo data for the Tree View pattern.
 */

export const fileSystemNodes = [
  {
    id: 'documents',
    label: 'Documents',
    children: [
      { id: 'report', label: 'report.pdf' },
      { id: 'notes', label: 'notes.txt' },
      {
        id: 'projects',
        label: 'Projects',
        children: [
          { id: 'project-a', label: 'Project A' },
          { id: 'project-b', label: 'Project B' },
        ],
      },
    ],
  },
  {
    id: 'images',
    label: 'Images',
    children: [
      { id: 'vacation', label: 'vacation.jpg' },
      { id: 'profile', label: 'profile.png' },
    ],
  },
  { id: 'readme', label: 'readme.md' },
];

export const disabledNodes = [
  {
    id: 'folder1',
    label: 'Accessible Folder',
    children: [
      { id: 'file1', label: 'file1.txt' },
      { id: 'file2', label: 'file2.txt', disabled: true },
    ],
  },
  {
    id: 'folder2',
    label: 'Restricted Folder',
    disabled: true,
    children: [{ id: 'secret', label: 'secret.txt' }],
  },
  { id: 'public', label: 'public.txt' },
];
