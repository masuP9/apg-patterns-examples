# Vue Toggle Button Demo

This demo showcases an accessible toggle button component implemented in Vue.js following the [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/button/).

## Features

- ✅ **Accessibility First**: Full WAI-ARIA compliance with proper semantics
- ✅ **Keyboard Navigation**: Space and Enter key support
- ✅ **TypeScript Support**: Fully typed component with props validation
- ✅ **Customizable**: Multiple sizes, variants, and styling options
- ✅ **Responsive Design**: Works on all screen sizes with touch-friendly targets
- ✅ **Dark Mode Support**: Automatic theme switching based on system preferences
- ✅ **High Contrast Support**: Enhanced visibility for users with visual impairments
- ✅ **Reduced Motion Support**: Respects user motion preferences

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) to view the demo in your browser.

### Build

```bash
npm run build
```

### Type Checking

```bash
npm run type-check
```

## Component Usage

```vue
<template>
  <ToggleButton
    :initial-pressed="false"
    description="Enable notifications"
    size="medium"
    variant="default"
    @toggle="handleToggle"
  >
    Notifications
  </ToggleButton>
</template>

<script setup lang="ts">
import ToggleButton from './components/ToggleButton.vue'

const handleToggle = (pressed: boolean) => {
  console.log('Toggle state:', pressed)
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialPressed` | `boolean` | `false` | Initial pressed state |
| `ariaLabel` | `string` | `undefined` | Optional aria-label for additional context |
| `description` | `string` | `undefined` | Optional description for aria-describedby |
| `disabled` | `boolean` | `false` | Optional disabled state |
| `class` | `string` | `''` | Optional custom class name |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size variant |
| `variant` | `'default' \| 'danger' \| 'success'` | `'default'` | Button color variant |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `toggle` | `boolean` | Emitted when toggle state changes |

## Accessibility Features

- **aria-pressed**: Indicates the current state of the toggle
- **Keyboard Support**: Space and Enter keys activate the toggle
- **Focus Management**: Visible focus indicators for keyboard navigation
- **Screen Reader Support**: Proper labeling and state announcements
- **Touch Targets**: Minimum 44px height for touch accessibility
- **High Contrast**: Enhanced borders and colors for better visibility
- **Reduced Motion**: Respects user's motion preferences

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is part of the APG Patterns Examples and follows the same licensing terms.