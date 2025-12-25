# APG Patterns Examples

> Accessible UI component implementations across React, Svelte, and Vue following WAI-ARIA APG patterns

[![Deploy to GitHub Pages](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml/badge.svg)](https://github.com/masuP9/apg-patterns-examples/actions/workflows/ci.yml)

## Overview

This project provides production-ready, accessible UI components that follow the [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) specifications. Each component is implemented across three major frontend frameworks: **React**, **Svelte**, and **Vue**.

## Features

- **Multi-framework**: React, Svelte, and Vue implementations
- **Accessibility-first**: Full WAI-ARIA APG compliance
- **Astro Islands**: Fast, optimized static site with interactive components
- **Interactive Docs**: Live examples with syntax highlighting (Shiki)
- **Developer Experience**: TypeScript, hot reload, unified development
- **Responsive**: Mobile-first design approach

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
cd site && npm install && cd ..
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
```

## Component Status

| Pattern | React | Svelte | Vue | Status |
|---------|-------|--------|-----|--------|
| Toggle Button | ✅ | ✅ | ✅ | Complete |
| Tabs | ✅ | ✅ | ✅ | Complete |
| Accordion | 📋 | 📋 | 📋 | Planned |
| Dialog | 📋 | 📋 | 📋 | Planned |
| Menu | 📋 | 📋 | 📋 | Planned |

## Architecture

```
apg-patterns-examples/
├── site/                         # Astro site
│   ├── src/
│   │   ├── components/
│   │   │   ├── patterns/         # APG pattern components
│   │   │   │   ├── button/       # ToggleButton (React/Vue/Svelte)
│   │   │   │   └── tabs/         # Tabs (React/Vue/Svelte)
│   │   │   └── ui/               # Site UI components
│   │   ├── layouts/              # Page layouts
│   │   ├── pages/                # Route pages
│   │   └── styles/               # Global & pattern styles
│   └── astro.config.mjs
├── .internal/                    # Internal documentation
├── CLAUDE.md                     # Development guide
├── TODO.md                       # Task tracking
└── package.json
```

## Component API

### Toggle Button

All components follow the same props pattern across frameworks:

```tsx
// React
<ToggleButton
  initialPressed={false}
  onToggle={(pressed) => console.log(pressed)}
>
  Mute
</ToggleButton>
```

```vue
<!-- Vue -->
<ToggleButton
  :initial-pressed="false"
  @toggle="(pressed) => console.log(pressed)"
>
  Mute
</ToggleButton>
```

```svelte
<!-- Svelte -->
<ToggleButton
  initialPressed={false}
  ontoggle={(e) => console.log(e.detail)}
>
  Mute
</ToggleButton>
```

### Key Features

- **HTML Attribute Inheritance**: Pass any standard button attributes
- **Accessibility**: Complete ARIA support with `aria-pressed`, keyboard navigation
- **Framework Agnostic**: Consistent API across React, Svelte, and Vue
- **TypeScript**: Full type safety and IntelliSense support

## Styling

Components use CSS with accessibility enhancements:

- High contrast mode support
- Reduced motion preferences
- Forced colors mode support
- CSS custom properties for theming

```css
/* Customize theme */
:root {
  --apg-toggle-bg: #e5e7eb;
  --apg-toggle-bg-pressed: #2563eb;
  --apg-toggle-text: #1f2937;
}
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-component`
3. Follow our [coding standards](./CODING_RULES.md)
4. Submit a pull request

### Development Guidelines

- Follow APG patterns precisely
- Maintain framework parity
- Document accessibility features
- Use semantic commit messages

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## Acknowledgments

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/)
- Framework communities: React, Svelte, Vue
- Astro team for the Islands architecture

## Links

- [Live Demo](https://masup9.github.io/apg-patterns-examples/)
- [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)
