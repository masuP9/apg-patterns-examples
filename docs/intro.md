# APG Patterns Examples

Welcome to **APG Patterns Examples** - a comprehensive collection of accessible UI component implementations across React, Svelte, and Vue.js frameworks.

## What is this?

This project provides practical implementations of the [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) patterns, helping developers create accessible user interfaces with real, working examples.

## Key Features

- 🎯 **Multiple Frameworks**: React, Svelte, and Vue implementations
- ♿ **Accessibility First**: Full ARIA compliance and keyboard navigation
- 📚 **Comprehensive Documentation**: Detailed guides and implementation notes
- 🔧 **MCP Integration**: AI-friendly metadata for code generation tools
- 🧪 **Testing Included**: Accessibility and functional tests for all patterns
- 📱 **Live Demos**: Interactive examples you can test and explore

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/apg-patterns-examples.git

# Install dependencies
cd apg-patterns-examples
npm install

# Start the documentation site
npm start

# Run all demos (in separate terminals)
npm run dev:demos
```

## Supported Patterns

### Currently Available

- **[Button](./patterns/button/overview)** - Basic buttons, toggle buttons, and icon buttons
- **[Accordion](./patterns/accordion/overview)** - Collapsible content sections
- **[Dialog](./patterns/dialog/overview)** - Modal dialogs and popups

### Coming Soon

- **Combobox** - Searchable dropdown menus
- **Tabs** - Tab panel navigation
- **Menu** - Application menus and context menus
- **Listbox** - Selectable lists
- **Grid** - Interactive data grids
- **Tree View** - Hierarchical data display

## MCP Integration

This project is designed to be AI-friendly with structured metadata that can be consumed by AI tools through the Model Context Protocol (MCP).

```json
{
  "pattern": "button",
  "framework": "react",
  "complexity": "basic",
  "aria_features": ["aria-pressed", "aria-label"],
  "keyboard_support": ["Enter", "Space"],
  "apg_compliance": true
}
```

Learn more about [MCP Integration](./mcp/overview).

## Project Structure

```
apg-patterns-examples/
├── docs/                    # Documentation (Docusaurus)
│   ├── patterns/           # Pattern-specific docs
│   └── frameworks/         # Framework-specific guides
├── demos/                  # Live demo implementations
│   ├── react/             # React demos
│   ├── svelte/            # Svelte demos
│   └── vue/               # Vue demos
├── patterns/              # Pattern metadata and specs
│   ├── button/
│   ├── accordion/
│   └── dialog/
└── scripts/               # Build and utility scripts
```

## Contributing

We welcome contributions! Please see our [Contributing Guide](./contributing) for details on:

- Adding new patterns
- Implementing framework variants
- Improving accessibility
- Writing tests
- Updating documentation

## Resources

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/patterns/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Specification](https://www.w3.org/TR/wai-aria/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---

Ready to explore? Start with the [Button pattern](./patterns/button/overview) or check out our [Getting Started guide](./getting-started/installation)!