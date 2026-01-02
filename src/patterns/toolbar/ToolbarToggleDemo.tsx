import { useState } from 'react';
import { Toolbar, ToolbarButton, ToolbarToggleButton, ToolbarSeparator } from './Toolbar';

/**
 * Demo component showing controlled ToolbarToggleButton usage
 */
export function ToolbarToggleDemo() {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  return (
    <div className="space-y-4">
      <Toolbar aria-label="Text formatting with state">
        <ToolbarToggleButton pressed={isBold} onPressedChange={setIsBold}>
          Bold
        </ToolbarToggleButton>
        <ToolbarToggleButton pressed={isItalic} onPressedChange={setIsItalic}>
          Italic
        </ToolbarToggleButton>
        <ToolbarToggleButton pressed={isUnderline} onPressedChange={setIsUnderline}>
          Underline
        </ToolbarToggleButton>
      </Toolbar>
      <div className="text-muted-foreground text-sm">
        <p>
          Current state:{' '}
          <span className="font-mono">
            {JSON.stringify({ bold: isBold, italic: isItalic, underline: isUnderline })}
          </span>
        </p>
      </div>
      <div
        className="border-border rounded-lg border p-4"
        style={{
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none',
        }}
      >
        Sample text with applied formatting
      </div>
    </div>
  );
}

/**
 * Demo component showing defaultPressed usage
 */
export function ToolbarToggleDefaultDemo() {
  return (
    <Toolbar aria-label="Default pressed states">
      <ToolbarToggleButton defaultPressed>Bold (default on)</ToolbarToggleButton>
      <ToolbarToggleButton>Italic (default off)</ToolbarToggleButton>
      <ToolbarSeparator />
      <ToolbarToggleButton defaultPressed disabled>
        Disabled (pressed)
      </ToolbarToggleButton>
      <ToolbarToggleButton disabled>Disabled (not pressed)</ToolbarToggleButton>
    </Toolbar>
  );
}

/**
 * Demo component for Text Formatting Toolbar
 */
export function TextFormattingToolbarDemo() {
  return (
    <Toolbar aria-label="Text formatting">
      <ToolbarToggleButton>Bold</ToolbarToggleButton>
      <ToolbarToggleButton>Italic</ToolbarToggleButton>
      <ToolbarToggleButton>Underline</ToolbarToggleButton>
      <ToolbarSeparator />
      <ToolbarButton>Align Left</ToolbarButton>
      <ToolbarButton>Center</ToolbarButton>
      <ToolbarButton>Align Right</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Copy</ToolbarButton>
      <ToolbarButton>Cut</ToolbarButton>
      <ToolbarButton>Paste</ToolbarButton>
    </Toolbar>
  );
}

/**
 * Demo component for Vertical Toolbar
 */
export function VerticalToolbarDemo() {
  return (
    <Toolbar orientation="vertical" aria-label="Actions">
      <ToolbarButton>New</ToolbarButton>
      <ToolbarButton>Open</ToolbarButton>
      <ToolbarButton>Save</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Print</ToolbarButton>
    </Toolbar>
  );
}

/**
 * Demo component for Toolbar with Disabled Items
 */
export function DisabledItemsToolbarDemo() {
  return (
    <Toolbar aria-label="Edit actions">
      <ToolbarButton>Undo</ToolbarButton>
      <ToolbarButton disabled>Redo</ToolbarButton>
      <ToolbarSeparator />
      <ToolbarButton>Cut</ToolbarButton>
      <ToolbarButton>Copy</ToolbarButton>
      <ToolbarButton disabled>Paste</ToolbarButton>
    </Toolbar>
  );
}
