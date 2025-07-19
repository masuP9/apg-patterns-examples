# Code Loader Plugin

Docusaurus custom plugin that loads source code files at build time and makes them available to CodeViewer components.

## Features

- **Real-time File Loading**: Reads actual source files from the filesystem
- **Framework Support**: React, Svelte, Vue, and shared styles
- **Error Handling**: Comprehensive error reporting and graceful fallbacks
- **Usage Extraction**: Automatically generates usage examples from App files
- **TypeScript Support**: Full type definitions and error checking

## Files Loaded

### React
- `demos/react/src/components/Button/ToggleButton.tsx`
- `demos/react/src/App.tsx`

### Svelte
- `demos/svelte/src/components/ToggleButton.svelte`
- `demos/svelte/src/App.svelte`

### Vue
- `demos/vue/src/components/ToggleButton.vue`
- `demos/vue/src/App.vue`

### Shared
- `demos/shared/styles/toggle-button.css`

## Usage

The plugin automatically makes code available via the `usePluginData` hook:

```tsx
import { usePluginData } from '@docusaurus/useGlobalData';

const pluginData = usePluginData('code-loader-plugin');
const codeFiles = pluginData.codeFiles;
```

### With CodeViewer Component

```tsx
<CodeViewer
  frameworks={['react', 'svelte', 'vue']}
  pattern="toggleButton"
/>
```

## Data Structure

The plugin provides data in the following format:

```typescript
{
  codeFiles: {
    toggleButton: {
      react: {
        component: string,    // ToggleButton.tsx content
        styles: string,       // Shared CSS content
        usage: string        // Extracted usage example
      },
      svelte: {
        component: string,    // ToggleButton.svelte content
        styles: string,       // Shared CSS content
        usage: string        // Extracted usage example
      },
      vue: {
        component: string,    // ToggleButton.vue content
        styles: string,       // Shared CSS content
        usage: string        // Extracted usage example
      }
    }
  }
}
```

## Error Handling

The plugin includes comprehensive error handling:

- **File Not Found**: Returns placeholder content with helpful error message
- **Read Errors**: Catches and reports file system errors
- **Usage Extraction Failures**: Graceful fallback for parsing errors
- **Build-time Logging**: Detailed console output for debugging

## Build-time Logging

During build, the plugin provides detailed output:

```
✅ Successfully loaded: demos/react/src/components/Button/ToggleButton.tsx
✅ Successfully loaded: demos/svelte/src/components/ToggleButton.svelte
✅ Successfully loaded: demos/vue/src/components/ToggleButton.vue
⚠️  File not found: demos/missing/file.ts
✅ All code files loaded successfully!
✅ Code loader plugin data set successfully
```

## Benefits

1. **Always Up-to-date**: Code examples match actual implementations
2. **No Manual Sync**: Eliminates copy-paste errors and outdated examples
3. **Single Source of Truth**: Real files are the documentation source
4. **Development Friendly**: Immediate feedback on missing or broken files

## Adding New Patterns

To add new patterns, update the `filePaths` object in `plugins/code-loader/index.js`:

```javascript
const filePaths = {
  // ... existing patterns
  newPattern: {
    component: 'demos/react/src/components/NewPattern.tsx',
    app: 'demos/react/src/App.tsx',
  },
  // ... etc
};
```

Then update the return data structure and add the pattern to CodeViewer usage.