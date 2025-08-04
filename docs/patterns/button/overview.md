# Button Pattern

Buttons are interactive elements that trigger actions when activated. This section covers accessible button implementations following the [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

## Pattern Types

### Toggle Button
A button that maintains state and can be pressed (activated) or not pressed (not activated). Toggle buttons are useful for:
- Showing/hiding content panels
- Turning features on/off
- Selecting/deselecting items

### Basic Button
A simple action trigger without state persistence.

### Icon Button
Buttons that use icons to convey meaning, requiring proper labeling for accessibility.

## Accessibility Requirements

### ARIA Properties
- **aria-pressed**: Indicates the current "pressed" state of toggle buttons
  - `true`: Button is pressed
  - `false`: Button is not pressed
  - `undefined`: Button doesn't maintain state (basic button)

### Keyboard Support
| Key | Function |
|-----|----------|
| `Space` or `Enter` | Activates the button |

### Focus Management
- Buttons must be focusable
- Clear visual focus indicators required
- Focus should remain on button after activation

## Implementation Examples

Choose a framework to see the live demo:

import DemoTabs from '@site/src/components/DemoTabs';
import CodeViewer from '@site/src/components/CodeViewer';

<DemoTabs
  frameworks={['react', 'svelte', 'vue']}
  demoPath="toggle-button"
/>

## Source Code

Explore the complete implementation with syntax highlighting:

<CodeViewer
  frameworks={['react', 'svelte', 'vue']}
  pattern="toggleButton"
/>

## MCP Metadata

```json
{
  "pattern": "button",
  "subpattern": "toggle",
  "aria_features": ["aria-pressed", "aria-label"],
  "keyboard_support": ["Space", "Enter"],
  "complexity": "intermediate",
  "apg_compliance": true,
  "frameworks": ["react", "svelte", "vue"]
}
```

## Testing

### Automated Testing
- Verify `aria-pressed` attribute changes
- Test keyboard activation
- Check focus management

### Manual Testing
- Screen reader announces state changes
- Visual state changes are clear
- Keyboard navigation works properly

## Resources

- [WAI-ARIA Button Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/button/)
- [MDN Button Element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/button)
- [WCAG 2.1 Success Criteria 4.1.2](https://www.w3.org/WAI/WCAG21/Understanding/name-role-value.html)