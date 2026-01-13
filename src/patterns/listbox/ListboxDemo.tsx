import { useState } from 'react';
import { Listbox, type ListboxOption } from './Listbox';

const fruitOptions: ListboxOption[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'apricot', label: 'Apricot' },
  { id: 'banana', label: 'Banana' },
  { id: 'cherry', label: 'Cherry' },
  { id: 'date', label: 'Date' },
  { id: 'elderberry', label: 'Elderberry' },
  { id: 'fig', label: 'Fig' },
  { id: 'grape', label: 'Grape' },
];

const colorOptions: ListboxOption[] = [
  { id: 'red', label: 'Red' },
  { id: 'orange', label: 'Orange' },
  { id: 'yellow', label: 'Yellow' },
  { id: 'green', label: 'Green', disabled: true },
  { id: 'blue', label: 'Blue' },
  { id: 'indigo', label: 'Indigo' },
  { id: 'purple', label: 'Purple' },
];

export function SingleSelectListboxDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['apple']);

  return (
    <div className="space-y-4">
      <div>
        <span id="fruit-label" className="mb-2 block text-sm font-medium">
          Choose a fruit:
        </span>
        <Listbox
          options={fruitOptions}
          defaultSelectedIds={['apple']}
          onSelectionChange={setSelectedIds}
          aria-labelledby="fruit-label"
        />
      </div>
      <p className="text-muted-foreground text-sm">
        Selected: {selectedIds.length > 0 ? selectedIds.join(', ') : 'None'}
      </p>
    </div>
  );
}

export function MultiSelectListboxDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <div className="space-y-4">
      <div>
        <span id="color-label" className="mb-2 block text-sm font-medium">
          Choose colors (multiple):
        </span>
        <Listbox
          options={colorOptions}
          multiselectable
          aria-labelledby="color-label"
          onSelectionChange={setSelectedIds}
        />
      </div>
      <p className="text-muted-foreground text-sm">
        Selected: {selectedIds.length > 0 ? selectedIds.join(', ') : 'None'}
      </p>
      <p className="text-muted-foreground text-xs">
        Tip: Use Space to toggle, Shift+Arrow to extend selection, Ctrl+A to select all
      </p>
    </div>
  );
}

export function HorizontalListboxDemo() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['apple']);

  return (
    <div className="space-y-4">
      <div>
        <span id="horizontal-label" className="mb-2 block text-sm font-medium">
          Choose a fruit (horizontal):
        </span>
        <Listbox
          options={fruitOptions.slice(0, 5)}
          orientation="horizontal"
          defaultSelectedIds={['apple']}
          aria-labelledby="horizontal-label"
          onSelectionChange={setSelectedIds}
        />
      </div>
      <p className="text-muted-foreground text-sm">
        Selected: {selectedIds.length > 0 ? selectedIds.join(', ') : 'None'}
      </p>
    </div>
  );
}
