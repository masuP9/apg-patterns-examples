# Tabs Pattern

Tabs are a set of layered sections of content, known as tab panels, that display one panel of content at a time. Following the [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

## Pattern Types

### Horizontal Tabs
The default orientation where tabs are arranged horizontally and arrow keys navigate left/right.

### Vertical Tabs
Alternative orientation where tabs are arranged vertically and arrow keys navigate up/down.

### Manual Activation
Mode where arrow keys move focus but don't change the active tab. Users must press Enter or Space to activate.

## Accessibility Requirements

### ARIA Roles and Properties
- **role="tablist"**: Applied to the container element
- **role="tab"**: Applied to each tab button
- **role="tabpanel"**: Applied to each content panel
- **aria-selected**: Indicates the currently selected tab (`true`/`false`)
- **aria-controls**: Links tab to its corresponding panel
- **aria-labelledby**: Links panel to its corresponding tab

### Keyboard Support
| Key | Function |
|-----|----------|
| `←` `→` | Navigate between tabs horizontally |
| `↑` `↓` | Navigate between tabs vertically |
| `Home` | Move focus to first tab |
| `End` | Move focus to last tab |
| `Space` `Enter` | Activate focused tab (manual mode) |
| `Tab` | Move focus to tab panel |
| `Delete` | Delete focused tab (if deletable) |

### Focus Management
- **Roving Tabindex**: Only selected tab has `tabindex="0"`, others have `tabindex="-1"`
- **Automatic Activation**: Arrow keys immediately select the focused tab (default)
- **Manual Activation**: Arrow keys move focus, Enter/Space activates the tab

## Implementation Examples

Choose a framework to see the live demo:

import StorybookEmbed from '@site/src/components/StorybookEmbed';
import CodeViewer from '@site/src/components/CodeViewer';

### Horizontal Tabs (Default)

<StorybookEmbed
  frameworks={['react', 'svelte', 'vue']}
  story="apg-tabs--default"
/>

### Vertical Tabs

<StorybookEmbed
  frameworks={['react', 'svelte', 'vue']}
  story="apg-tabs--vertical"
/>

### Manual Activation

<StorybookEmbed
  frameworks={['react', 'svelte', 'vue']}
  story="apg-tabs--manual-activation"
/>

## Source Code

Explore the complete implementation with syntax highlighting:

<CodeViewer
  frameworks={['react', 'svelte', 'vue']}
  pattern="tabs"
/>

## MCP Metadata

```json
{
  "pattern": "tabs",
  "aria_features": ["role=tablist", "role=tab", "role=tabpanel", "aria-selected", "aria-controls", "aria-labelledby"],
  "keyboard_support": ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Space", "Enter", "Delete"],
  "complexity": "advanced",
  "apg_compliance": true,
  "frameworks": ["react", "svelte", "vue"]
}
```

## Testing

### Automated Testing
- Verify ARIA attributes are set correctly
- Test keyboard navigation patterns
- Check focus management and roving tabindex
- Validate tab activation modes

### Manual Testing
- Screen reader announces tab changes correctly
- Visual focus indicators are clear
- Keyboard navigation works in all orientations
- Tab panels are properly associated with tabs

## Resources

- [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [MDN ARIA: tablist role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/tablist_role)
- [WCAG 2.1 Success Criteria 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)