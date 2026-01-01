<script lang="ts">
  import Toolbar from './Toolbar.svelte';
  import ToolbarToggleButton from './ToolbarToggleButton.svelte';

  let isBold = $state(false);
  let isItalic = $state(false);
  let isUnderline = $state(false);
</script>

<div class="space-y-4">
  <Toolbar aria-label="Text formatting with state">
    <ToolbarToggleButton
      pressed={isBold}
      onPressedChange={(pressed) => isBold = pressed}
    >
      Bold
    </ToolbarToggleButton>
    <ToolbarToggleButton
      pressed={isItalic}
      onPressedChange={(pressed) => isItalic = pressed}
    >
      Italic
    </ToolbarToggleButton>
    <ToolbarToggleButton
      pressed={isUnderline}
      onPressedChange={(pressed) => isUnderline = pressed}
    >
      Underline
    </ToolbarToggleButton>
  </Toolbar>
  <div class="text-sm text-muted-foreground">
    <p>
      Current state:
      <span class="font-mono">
        {JSON.stringify({ bold: isBold, italic: isItalic, underline: isUnderline })}
      </span>
    </p>
  </div>
  <div
    class="p-4 border border-border rounded-lg"
    style:font-weight={isBold ? 'bold' : 'normal'}
    style:font-style={isItalic ? 'italic' : 'normal'}
    style:text-decoration={isUnderline ? 'underline' : 'none'}
  >
    Sample text with applied formatting
  </div>
</div>
