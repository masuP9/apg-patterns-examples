import { useState } from 'react';
import { Button } from './Button';

/**
 * Demo: Basic Button
 * Shows a simple custom button that displays click count.
 */
export function BasicButtonDemo() {
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="space-y-4">
      <Button
        onClick={() => setClickCount((c) => c + 1)}
        className="inline-flex items-center gap-2"
      >
        <span>Click me</span>
        {clickCount > 0 && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs text-white">
            {clickCount}
          </span>
        )}
      </Button>
      <p className="text-muted-foreground text-sm">
        This custom button uses <code>role=&quot;button&quot;</code> on a <code>&lt;span&gt;</code>{' '}
        element.
      </p>
    </div>
  );
}

/**
 * Demo: Disabled Button
 * Shows how disabled state is handled with aria-disabled and tabindex.
 */
export function DisabledButtonDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={() => alert('Clicked!')}>Enabled Button</Button>
      <Button disabled onClick={() => alert('This should not fire!')}>
        Disabled Button
      </Button>
    </div>
  );
}

/**
 * Demo: Icon Button
 * Shows a button with only an icon, using aria-label for accessible name.
 */
export function IconButtonDemo() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="flex flex-wrap gap-4">
      <Button
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        onClick={() => setIsFavorite((f) => !f)}
        className="inline-flex h-10 w-10 items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={isFavorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      </Button>
      <Button
        aria-label="Settings"
        onClick={() => alert('Settings clicked!')}
        className="inline-flex h-10 w-10 items-center justify-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </Button>
    </div>
  );
}

/**
 * Main demo component that shows all button variants
 */
export function ButtonDemo() {
  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-4 text-lg font-semibold">Basic Button</h3>
        <BasicButtonDemo />
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Disabled State</h3>
        <DisabledButtonDemo />
      </section>

      <section>
        <h3 className="mb-4 text-lg font-semibold">Icon Buttons</h3>
        <IconButtonDemo />
      </section>
    </div>
  );
}
