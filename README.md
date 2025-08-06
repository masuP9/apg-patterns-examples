# APG Patterns Examples

> Accessible UI component implementations across React, Svelte, and Vue following WAI-ARIA APG patterns

[![Deploy to GitHub Pages](https://github.com/masuP9/apg-patterns-examples/actions/workflows/deploy.yml/badge.svg)](https://github.com/masuP9/apg-patterns-examples/actions/workflows/deploy.yml)

## 🎯 Overview

This project provides production-ready, accessible UI components that follow the [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) specifications. Each component is implemented across three major frontend frameworks: **React**, **Svelte**, and **Vue**.

## ✨ Features

- 🌐 **Multi-framework**: React, Svelte, and Vue implementations
- ♿ **Accessibility-first**: Full WAI-ARIA APG compliance
- 🎨 **Design System**: Shared CSS with Tailwind utilities
- 📚 **Interactive Docs**: Live examples with syntax highlighting
- 🔧 **Developer Experience**: TypeScript, hot reload, unified development
- 📱 **Responsive**: Mobile-first design approach

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/masuP9/apg-patterns-examples.git
cd apg-patterns-examples

# Install dependencies
npm install

# Install demo dependencies
cd demos/react && npm install && cd ../..
cd demos/svelte && npm install && cd ../..
cd demos/vue && npm install && cd ../..
```

### Development

```bash
# 🚀 Start all development environments
npm run dev                  # Docusaurus + All Storybooks
                            # - Docusaurus: http://localhost:3000
                            # - React Storybook: http://localhost:6006
                            # - Vue Storybook: http://localhost:6007  
                            # - Svelte Storybook: http://localhost:6008

# Alternative: Start individual environments  
npm start                    # Docusaurus only (port 3000)
npm run storybook:react      # React Storybook only (port 6006)
npm run storybook:vue        # Vue Storybook only (port 6007)
npm run storybook:svelte     # Svelte Storybook only (port 6008)
```

## 📋 Component Status

| Pattern | React | Svelte | Vue | Status |
|---------|-------|--------|-----|--------|
| [Toggle Button](./docs/patterns/button/overview.md) | ✅ | ✅ | ✅ | Complete |
| [Tabs](./docs/patterns/tabs/overview.md) | ✅ | ✅ | ✅ | Complete |
| Accordion | 📋 | 📋 | 📋 | Planned |
| Dialog | 📋 | 📋 | 📋 | Planned |
| Menu | 📋 | 📋 | 📋 | Planned |

## 🏗️ Architecture

```
apg-patterns-examples/
├── demos/                    # Framework implementations
│   ├── react/                # React components & demo
│   ├── svelte/               # Svelte components & demo  
│   ├── vue/                  # Vue components & demo
│   └── shared/               # Shared CSS & utilities
├── docs/                     # Documentation pages
├── src/components/           # Docusaurus components
│   ├── CodeViewer/          # Dynamic code display
│   └── StorybookEmbed/      # Storybook iframe integration
└── plugins/                 # Custom Docusaurus plugins
    └── code-loader/         # Real-time code loading
```

## 🧩 Component API

### Toggle Button

All components follow the same props pattern across frameworks:

```tsx
// React
<ToggleButton 
  initialPressed={false}
  onToggle={(pressed) => setPressed(pressed)}
  aria-label="Toggle notifications"
  className="custom-style"
>
  📧 Email Notifications
</ToggleButton>

// Vue  
<ToggleButton 
  :initial-pressed="false"
  :on-toggle="(pressed) => setPressed(pressed)"
  aria-label="Toggle notifications"
  class="custom-style"
>
  📧 Email Notifications
</ToggleButton>

// Svelte
<ToggleButton 
  initialPressed={false}
  onToggle={(pressed) => setPressed(pressed)}
  aria-label="Toggle notifications"
  class="custom-style"
>
  📧 Email Notifications
</ToggleButton>
```

### Key Features

- **HTML Attribute Inheritance**: Pass any standard button attributes
- **Accessibility**: Complete ARIA support with `aria-pressed`, keyboard navigation
- **Framework Agnostic**: Consistent API across React, Svelte, and Vue
- **TypeScript**: Full type safety and IntelliSense support

## 🎨 Styling

Components use a layered styling approach:

1. **Base Styles**: APG-compliant default styling
2. **Tailwind Utilities**: Responsive and utility-first CSS
3. **Custom Classes**: Override with your design system
4. **CSS Variables**: Theme customization support

```css
/* Customize APG button theme */
:root {
  --apg-primary: #2563eb;
  --apg-primary-hover: #1d4ed8;
  --apg-focus-ring: 0 0 0 2px rgba(37, 99, 235, 0.5);
}
```

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run accessibility tests  
npm run test:a11y

# Run E2E tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-component`
3. Follow our [coding standards](./CONTRIBUTING.md)
4. Add tests for your changes
5. Submit a pull request

### Development Guidelines

- Follow APG patterns precisely
- Maintain framework parity
- Include comprehensive tests
- Document accessibility features
- Use semantic commit messages

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- [WAI-ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/)
- Framework communities: React, Svelte, Vue
- Docusaurus team for the documentation platform

## 📞 Support

- 📚 [Documentation](https://masup9.github.io/apg-patterns-examples/)
- 🐛 [Issue Tracker](https://github.com/masuP9/apg-patterns-examples/issues)
- 💬 [Discussions](https://github.com/masuP9/apg-patterns-examples/discussions)

---

<div align="center">
  
**[🌐 Live Demo](https://masup9.github.io/apg-patterns-examples/) | [📖 Documentation](https://masup9.github.io/apg-patterns-examples/) | [🚀 Get Started](#quick-start)**

Made with ❤️ for accessible web development

</div>