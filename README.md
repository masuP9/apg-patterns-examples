# APG Patterns Examples

> Accessible UI component implementations across React, Vue, Svelte, and Astro following WAI-ARIA APG patterns

[![Deploy to GitHub Pages](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml)

[日本語](./README.ja.md) | English

## Overview

This project provides accessible UI components that follow the [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) specifications. Each component is implemented across four major frontend frameworks: **React**, **Vue**, **Svelte**, and **Astro** (Web Components).

## Features

- **Multi-framework**: React, Vue, Svelte, and Astro (Web Components) implementations
- **Accessibility-first**: WAI-ARIA APG compliance
- **Astro Islands**: Fast, optimized static site with interactive components
- **Interactive Docs**: Live examples with syntax highlighting (Shiki)
- **Testing**: Tests with Vitest and Testing Library
- **Developer Experience**: TypeScript, Tailwind CSS, hot reload
- **Responsive**: Mobile-first design approach

## Tech Stack

| Layer     | Technology                   |
| --------- | ---------------------------- |
| Framework | Astro (Islands Architecture) |
| Content   | MDX                          |
| Demo      | React / Vue / Svelte / Astro |
| Styling   | Tailwind CSS + shadcn/ui     |
| Code      | Shiki                        |
| Testing   | Vitest + Testing Library     |
| Deploy    | GitHub Pages                 |

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/masuP9/apg-patterns-examples.git
cd apg-patterns-examples

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
# Opens at http://localhost:4321

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint
npm run lint

# Format
npm run format
```

## Component Status

| Pattern       | React | Vue | Svelte | Astro | Status   |
| ------------- | ----- | --- | ------ | ----- | -------- |
| Accordion     | ✅    | ✅  | ✅     | ✅    | Complete |
| Alert         | ✅    | ✅  | ✅     | ✅    | Complete |
| Breadcrumb    | ✅    | ✅  | ✅     | ✅    | Complete |
| Dialog        | ✅    | ✅  | ✅     | ✅    | Complete |
| Disclosure    | ✅    | ✅  | ✅     | ✅    | Complete |
| Listbox       | ✅    | ✅  | ✅     | ✅    | Complete |
| Menu Button   | ✅    | ✅  | ✅     | ✅    | Complete |
| Switch        | ✅    | ✅  | ✅     | ✅    | Complete |
| Tabs          | ✅    | ✅  | ✅     | ✅    | Complete |
| Toggle Button | ✅    | ✅  | ✅     | ✅    | Complete |
| Toolbar       | ✅    | ✅  | ✅     | ✅    | Complete |
| Tooltip       | ✅    | ✅  | ✅     | ✅    | Complete |

## Architecture

```
apg-patterns-examples/
├── src/
│   ├── components/           # Site UI (shadcn/ui)
│   │   └── ui/
│   ├── lib/                  # Utilities
│   ├── patterns/             # APG pattern implementations
│   │   ├── accordion/        # Accordion (React/Vue/Svelte/Astro)
│   │   ├── alert/            # Alert
│   │   ├── breadcrumb/       # Breadcrumb
│   │   ├── button/           # Toggle Button
│   │   ├── dialog/           # Dialog
│   │   ├── disclosure/       # Disclosure
│   │   ├── listbox/          # Listbox
│   │   ├── menu-button/      # Menu Button
│   │   ├── switch/           # Switch
│   │   ├── tabs/             # Tabs
│   │   ├── toolbar/          # Toolbar
│   │   └── tooltip/          # Tooltip
│   ├── layouts/              # Page layouts
│   ├── pages/                # Route pages
│   ├── styles/               # Global styles
│   └── test/                 # Test utilities
├── .internal/                # Internal documentation
├── public/                   # Static assets
├── astro.config.mjs
├── CLAUDE.md                 # Development guide
└── package.json
```

## Component API

### Toggle Button

All components follow the same props pattern across frameworks:

```tsx
// React
<ToggleButton initialPressed={false} onToggle={(pressed) => console.log(pressed)}>
  Mute
</ToggleButton>
```

```vue
<!-- Vue -->
<ToggleButton :initial-pressed="false" @toggle="(pressed) => console.log(pressed)">
  Mute
</ToggleButton>
```

```svelte
<!-- Svelte -->
<ToggleButton initialPressed={false} ontoggle={(e) => console.log(e.detail)}>Mute</ToggleButton>
```

### Key Features

- **HTML Attribute Inheritance**: Pass any standard HTML attributes
- **Accessibility**: Complete ARIA support with keyboard navigation
- **Framework Agnostic**: Consistent API across React, Vue, Svelte, and Astro
- **TypeScript**: Full type safety and IntelliSense support

## Styling

Components use Tailwind CSS with accessibility enhancements:

- High contrast mode support
- Reduced motion preferences
- Forced colors mode support
- CSS custom properties for theming

## Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details on:

- Development setup and workflow
- Coding standards and guidelines
- Component implementation requirements
- Testing requirements
- Pull request process

### Quick Contributing Steps

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-component`
3. Follow our [coding standards](./CODING_RULES.md)
4. Ensure all tests pass and code is formatted
5. Submit a pull request

### Development Guidelines

- Follow APG patterns precisely
- Maintain framework parity across all 4 frameworks
- Write comprehensive tests with accessibility checks
- Document accessibility features thoroughly
- Use semantic commit messages

## Security

For security concerns or to report vulnerabilities, please see our [Security Policy](./SECURITY.md).

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/)
- Framework communities: React, Vue, Svelte
- Astro team for the Islands architecture

## Links

- [Live Demo](https://masup9.github.io/apg-patterns-examples/)
- [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)
